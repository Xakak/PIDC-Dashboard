// src/lib/supabase.ts
// This file creates ONE shared Supabase client for the entire app.
// Import `supabase` from here whenever you need to talk to the database.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// createClient connects to your Supabase project
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── TypeScript types that mirror the database tables ───────────────────────
// Update these if you change the schema.sql

export type UserRole = 'admin' | 'entity' | 'viewer'

export type Entity = {
  id: string
  name: string
  code: string          // e.g. "KC", "LD"
  type: 'Industrial' | 'Commercial' | 'Services' | 'Administrative'
  created_at: string
}

export type Upload = {
  id: string
  entity_id: string
  period: string        // e.g. "2025-H1"
  status: 'pending' | 'processing' | 'approved' | 'rejected'
  file_path: string     // path inside Supabase Storage
  uploaded_by: string   // user id
  created_at: string
  notes: string | null
}

export type Profile = {
  id: string            // same as auth.users id
  email: string
  role: UserRole
  entity_id: string | null  // null for admins
  full_name: string
}
