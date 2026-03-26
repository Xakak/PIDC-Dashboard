# backend/main.py
# ─────────────────────────────────────────────────────────────────────────────
# PIDC Statistics Dashboard — FastAPI Backend
#
# What this does:
#   - Receives a webhook from Supabase Storage when a file is uploaded
#   - Downloads the Excel file from Supabase Storage
#   - Parses it with pandas (validates columns, extracts data rows)
#   - Writes the extracted statistics into the Supabase database
#   - Updates the upload status to 'approved' or 'rejected'
#
# To run:
#   cd backend
#   python -m venv venv
#   source venv/bin/activate   (Mac/Linux) OR venv\Scripts\activate (Windows)
#   pip install -r requirements.txt
#   uvicorn main:app --reload --port 8000
# ─────────────────────────────────────────────────────────────────────────────

from fastapi import FastAPI, BackgroundTasks, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import pandas as pd
import io
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()   # reads .env file

app = FastAPI(title="PIDC Statistics API", version="1.0.0")

# ─── CORS ────────────────────────────────────────────────────────────────────
# Allow the Next.js frontend to call this API from the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",          # local dev
        os.getenv("FRONTEND_URL", ""),    # production URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Supabase client ─────────────────────────────────────────────────────────
# Uses the SERVICE ROLE key (not the anon key) so it can bypass RLS.
# NEVER expose this key to the frontend.
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", ""),
    os.getenv("SUPABASE_SERVICE_KEY", ""),  # Settings → API → service_role key
)


# ─────────────────────────────────────────────────────────────────────────────
# MODELS
# These define what JSON shape the API expects to receive.
# ─────────────────────────────────────────────────────────────────────────────

class ProcessUploadRequest(BaseModel):
    """
    Sent by the Next.js frontend after a user uploads a file.
    Contains the upload record ID and the file path in Supabase Storage.
    """
    upload_id: str          # The UUID from the uploads table
    file_path: str          # e.g. "kc/2025-H1/1234567890_report.xlsx"
    entity_id: str          # e.g. "kc"
    period: str             # e.g. "2025-H1"


class UpdateStatusRequest(BaseModel):
    """
    Sent by the admin panel when they approve or reject a submission.
    """
    upload_id: str
    status: str             # 'approved' or 'rejected'
    notes: Optional[str] = None


# ─────────────────────────────────────────────────────────────────────────────
# ROUTES
# ─────────────────────────────────────────────────────────────────────────────

@app.get("/ping")
def ping():
    """
    Health check. Visit http://localhost:8000/ping to confirm the server is up.
    Should return: {"status": "ok", "service": "pidc-statistics-api"}
    """
    return {"status": "ok", "service": "pidc-statistics-api"}


@app.post("/process-upload")
async def process_upload(
    request: ProcessUploadRequest,
    background_tasks: BackgroundTasks
):
    """
    Called by the Next.js frontend after a user submits their Excel file.

    1. Immediately returns {"status": "processing"} so the UI doesn't hang.
    2. In the background, downloads the file and parses it.
    3. Updates the upload status in Supabase to 'approved' or 'rejected'.

    BackgroundTasks = runs AFTER the response is sent, so the user doesn't wait.
    """
    # Mark the upload as 'processing' right away
    supabase.table("uploads").update({"status": "processing"}).eq("id", request.upload_id).execute()

    # Schedule the heavy work to run in the background
    background_tasks.add_task(
        _parse_and_store,
        request.upload_id,
        request.file_path,
        request.entity_id,
        request.period,
    )

    return {"status": "processing", "upload_id": request.upload_id}


@app.get("/upload-status/{upload_id}")
def get_upload_status(upload_id: str):
    """
    The frontend can poll this endpoint to check if processing is done.
    Returns the current status of an upload.
    """
    result = supabase.table("uploads").select("status, notes").eq("id", upload_id).single().execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Upload not found")

    return result.data


@app.post("/admin/update-status")
def update_status(request: UpdateStatusRequest):
    """
    Called from the Admin Panel to approve or reject a submission.
    Updates the status column in the uploads table.
    """
    if request.status not in ("approved", "rejected"):
        raise HTTPException(status_code=400, detail="Status must be 'approved' or 'rejected'")

    supabase.table("uploads").update({
        "status": request.status,
        "notes":  request.notes,
    }).eq("id", request.upload_id).execute()

    return {"success": True}


# ─────────────────────────────────────────────────────────────────────────────
# BACKGROUND WORKER
# This function runs after the HTTP response is sent.
# It does the actual Excel parsing.
# ─────────────────────────────────────────────────────────────────────────────

def _parse_and_store(upload_id: str, file_path: str, entity_id: str, period: str):
    """
    Downloads the Excel file from Supabase Storage, validates it,
    extracts the data, and stores it in the database.

    If anything goes wrong, the upload is marked as 'rejected' with an error note.
    """
    try:
        # 1. Download the file bytes from Supabase Storage
        response = supabase.storage.from_("uploads").download(file_path)
        # response is raw bytes of the Excel file

        # 2. Load into pandas
        excel_bytes = io.BytesIO(response)
        df = pd.read_excel(excel_bytes, sheet_name=0)  # read first sheet

        # 3. Validate required columns exist
        #    These match the template structure in the PRD (Appendix 14.2)
        required_columns = ["Metric Name", "Category", "Value", "Unit"]
        missing = [col for col in required_columns if col not in df.columns]

        if missing:
            # Reject with a helpful error message
            supabase.table("uploads").update({
                "status": "rejected",
                "notes":  f"Missing required columns: {', '.join(missing)}. "
                          f"Please use the standard PIDC template.",
            }).eq("id", upload_id).execute()
            return

        # 4. Clean the data
        df = df.dropna(subset=["Metric Name", "Value"])  # drop rows without name or value
        df["Value"] = pd.to_numeric(df["Value"], errors="coerce")  # force numbers
        df = df.dropna(subset=["Value"])  # drop rows where Value wasn't a number

        if len(df) == 0:
            supabase.table("uploads").update({
                "status": "rejected",
                "notes":  "No valid data rows found after cleaning. Check your Excel file.",
            }).eq("id", upload_id).execute()
            return

        # 5. Store each row in the 'statistics' table
        #    (You'll need to add this table to schema.sql — see the comment below)
        rows_to_insert = []
        for _, row in df.iterrows():
            rows_to_insert.append({
                "upload_id":   upload_id,
                "entity_id":   entity_id,
                "period":      period,
                "metric_name": str(row.get("Metric Name", "")),
                "category":    str(row.get("Category", "")),
                "value":       float(row["Value"]),
                "unit":        str(row.get("Unit", "")),
                "notes":       str(row.get("Notes", "")) if pd.notna(row.get("Notes")) else None,
            })

        if rows_to_insert:
            supabase.table("statistics").insert(rows_to_insert).execute()

        # 6. Mark upload as approved
        supabase.table("uploads").update({
            "status": "approved",
            "notes":  f"Successfully processed {len(rows_to_insert)} data rows.",
        }).eq("id", upload_id).execute()

    except Exception as e:
        # Something unexpected went wrong — reject with the error
        supabase.table("uploads").update({
            "status": "rejected",
            "notes":  f"Processing error: {str(e)}",
        }).eq("id", upload_id).execute()


# ─────────────────────────────────────────────────────────────────────────────
# NOTE: Add this table to supabase/schema.sql for statistics storage:
#
# create table if not exists statistics (
#   id           uuid primary key default gen_random_uuid(),
#   upload_id    uuid references uploads(id) on delete cascade,
#   entity_id    text not null,
#   period       text not null,
#   metric_name  text not null,
#   category     text not null,
#   value        numeric not null,
#   unit         text,
#   notes        text,
#   created_at   timestamptz not null default now()
# );
# ─────────────────────────────────────────────────────────────────────────────
