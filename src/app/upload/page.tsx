'use client'
// src/app/upload/page.tsx
// ─── THE CORE PAGE ───────────────────────────────────────────────────────────
// Entity users come here to:
//   1. Choose their entity + reporting period
//   2. Drop an Excel file
//   3. Preview the data in a table
//   4. Submit → file goes to Supabase Storage, record goes to DB
//
// 'use client' because this page uses browser APIs (FileReader, drag events, state).

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import * as XLSX from 'xlsx'
import { supabase } from '@/lib/supabase'
import Sidebar from '@/components/layout/Sidebar'
import { Upload, FileSpreadsheet, X, CheckCircle, AlertCircle } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────────────────────
type UploadStatus = 'idle' | 'preview' | 'uploading' | 'success' | 'error'

// ─── ENTITY + PERIOD options (match the sample data in PROJECT-CONTEXT.md) ───
const ENTITIES = [
  { id: 'kc', name: 'Karachi Corporation (KC)' },
  { id: 'ld', name: 'Lahore Division (LD)' },
  { id: 'pu', name: 'Peshawar Unit (PU)' },
  { id: 'ih', name: 'Islamabad HQ (IH)' },
  { id: 'qc', name: 'Quetta Center (QC)' },
  { id: 'fu', name: 'Faisalabad Unit (FU)' },
  { id: 'mc', name: 'Multan Center (MC)' },
]

const PERIODS = ['2025-H1', '2025-H2', '2025-Q1', '2025-Q2', '2025-Q3', '2025-Q4']

export default function UploadPage() {
  // ─── State ────────────────────────────────────────────────────────────────
  const [file, setFile]           = useState<File | null>(null)
  const [entityId, setEntityId]   = useState('')
  const [period, setPeriod]       = useState('')
  const [previewData, setPreview] = useState<string[][]>([])     // rows of cells
  const [status, setStatus]       = useState<UploadStatus>('idle')
  const [errorMsg, setErrorMsg]   = useState('')
  const [dragOver, setDragOver]   = useState(false)

  const router = useRouter()

  // ─── 1. Parse Excel in browser (no server needed) ─────────────────────────
  function parseExcel(f: File) {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data     = new Uint8Array(e.target?.result as ArrayBuffer)
      const workbook = XLSX.read(data, { type: 'array' })

      // Read the FIRST sheet only for preview
      const sheetName = workbook.SheetNames[0]
      const sheet     = workbook.Sheets[sheetName]
      const rows      = XLSX.utils.sheet_to_json<string[]>(sheet, { header: 1 })

      // Show max 10 rows in preview to keep UI fast
      setPreview(rows.slice(0, 10) as string[][])
      setFile(f)
      setStatus('preview')
    }
    reader.readAsArrayBuffer(f)
  }

  // ─── 2. Drag-and-drop handlers ─────────────────────────────────────────────
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped && (dropped.name.endsWith('.xlsx') || dropped.name.endsWith('.xls'))) {
      parseExcel(dropped)
    } else {
      setErrorMsg('Please upload an Excel file (.xlsx or .xls)')
    }
  }, [])

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0]
    if (selected) parseExcel(selected)
  }

  // ─── 3. Submit: upload file to Supabase Storage + create DB record ─────────
  async function handleSubmit() {
    if (!file || !entityId || !period) {
      setErrorMsg('Please fill in all fields and upload a file.')
      return
    }
    setStatus('uploading')
    setErrorMsg('')

    try {
      // Get the current logged-in user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not logged in')

      // Build a unique file path in Storage
      const timestamp = Date.now()
      const filePath  = `${entityId}/${period}/${timestamp}_${file.name}`

      // Upload file to the "uploads" bucket
      const { error: storageError } = await supabase.storage
        .from('uploads')
        .upload(filePath, file)

      if (storageError) throw storageError

      // Create a record in the uploads table with status = 'pending'
      // An admin will then review this in the Admin Panel
      const { error: dbError } = await supabase
        .from('uploads')
        .insert({
          entity_id:   entityId,
          period:      period,
          status:      'pending',       // ← starts as pending, admin approves
          file_path:   filePath,
          uploaded_by: user.id,
          notes:       null,
        })

      if (dbError) throw dbError

      setStatus('success')
    } catch (err: any) {
      setErrorMsg(err.message ?? 'Upload failed. Please try again.')
      setStatus('error')
    }
  }

  function resetForm() {
    setFile(null)
    setPreview([])
    setStatus('idle')
    setErrorMsg('')
    setEntityId('')
    setPeriod('')
  }

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-bg-base">
      <Sidebar />

      <main className="flex-1 p-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Upload Statistics</h1>
        <p className="text-text-secondary text-sm mb-8">
          Upload your entity's Excel report for admin review.
        </p>

        {/* ── Success state ────────────────────────────────────────────────── */}
        {status === 'success' && (
          <div className="bg-success/10 border border-success/30 rounded-xl p-8 text-center">
            <CheckCircle className="mx-auto mb-4 text-success" size={48} />
            <h2 className="text-xl font-semibold text-text-primary mb-2">Upload Submitted!</h2>
            <p className="text-text-secondary text-sm mb-6">
              Your file has been sent for admin review. You'll see the status below once it's processed.
            </p>
            <button
              onClick={resetForm}
              className="bg-primary hover:bg-primary-hover text-bg-base font-semibold
                         rounded-lg px-6 py-2.5 text-sm cursor-pointer transition-colors"
            >
              Upload Another File
            </button>
          </div>
        )}

        {/* ── Main form (idle / preview / uploading / error) ───────────────── */}
        {status !== 'success' && (
          <div className="space-y-6">

            {/* Entity + Period selectors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Your Entity</label>
                <select
                  value={entityId}
                  onChange={(e) => setEntityId(e.target.value)}
                  className="w-full bg-bg-elevated border border-border-default rounded-lg
                             px-4 py-2.5 text-text-primary text-sm
                             focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="">Select entity...</option>
                  {ENTITIES.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm text-text-secondary mb-1.5">Reporting Period</label>
                <select
                  value={period}
                  onChange={(e) => setPeriod(e.target.value)}
                  className="w-full bg-bg-elevated border border-border-default rounded-lg
                             px-4 py-2.5 text-text-primary text-sm
                             focus:outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="">Select period...</option>
                  {PERIODS.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dropzone */}
            {status === 'idle' && (
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors
                            ${dragOver
                              ? 'border-primary bg-primary/5'
                              : 'border-border-hover hover:border-primary/50'
                            }`}
              >
                <Upload className="mx-auto mb-4 text-text-muted" size={40} />
                <p className="text-text-primary font-medium mb-1">Drop your Excel file here</p>
                <p className="text-text-muted text-sm mb-4">Supports .xlsx and .xls files</p>
                <label className="bg-bg-elevated hover:bg-border-hover border border-border-default
                                  text-text-primary text-sm rounded-lg px-4 py-2 cursor-pointer
                                  transition-colors">
                  Browse files
                  <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Preview table */}
            {(status === 'preview' || status === 'uploading' || status === 'error') && file && (
              <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden">
                {/* File header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
                  <div className="flex items-center gap-3">
                    <FileSpreadsheet className="text-success" size={20} />
                    <div>
                      <p className="text-text-primary text-sm font-medium">{file.name}</p>
                      <p className="text-text-muted text-xs">
                        {(file.size / 1024).toFixed(1)} KB — showing first 10 rows
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={resetForm}
                    className="text-text-muted hover:text-error transition-colors cursor-pointer"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* Table */}
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="bg-bg-elevated">
                        {previewData[0]?.map((header, i) => (
                          <th key={i} className="px-4 py-2 text-left text-text-secondary font-medium
                                                  border-b border-border-default whitespace-nowrap">
                            {String(header ?? '')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(1).map((row, rowIdx) => (
                        <tr key={rowIdx} className="border-b border-border-default hover:bg-bg-elevated">
                          {row.map((cell, colIdx) => (
                            <td key={colIdx} className="px-4 py-2 text-text-secondary font-mono whitespace-nowrap">
                              {String(cell ?? '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Error message */}
            {errorMsg && (
              <div className="flex items-center gap-2 bg-error/10 border border-error/30
                              text-error rounded-lg px-4 py-3 text-sm">
                <AlertCircle size={16} />
                {errorMsg}
              </div>
            )}

            {/* Submit button */}
            {(status === 'preview' || status === 'error') && (
              <button
                onClick={handleSubmit}
                disabled={!entityId || !period}
                className="bg-primary hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed
                           text-bg-base font-semibold rounded-lg px-8 py-3 text-sm
                           transition-colors cursor-pointer"
              >
                Submit for Admin Review
              </button>
            )}

            {status === 'uploading' && (
              <div className="text-text-secondary text-sm animate-pulse">
                Uploading file and creating submission record...
              </div>
            )}

          </div>
        )}
      </main>
    </div>
  )
}
