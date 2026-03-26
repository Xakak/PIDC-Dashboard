'use client'
// src/app/admin/page.tsx
// ─── ADMIN PANEL ─────────────────────────────────────────────────────────────
// Admins see all pending uploads here and can:
//   - Approve: marks status = 'approved' in the database
//   - Reject:  marks status = 'rejected' with a note
//   - Download: get the original Excel file from Supabase Storage
//
// 'use client' because we need useState + real-time actions.

import { useEffect, useState } from 'react'
import { supabase, type Upload } from '@/lib/supabase'
import Sidebar from '@/components/layout/Sidebar'
import { Download, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react'

// ─── Status badge colors ──────────────────────────────────────────────────────
const statusConfig = {
  pending:    { label: 'Pending Review', color: 'bg-warning/10 text-warning border-warning/20',   icon: Clock },
  processing: { label: 'Processing',     color: 'bg-info/10 text-info border-info/20',             icon: RefreshCw },
  approved:   { label: 'Approved',       color: 'bg-success/10 text-success border-success/20',   icon: CheckCircle },
  rejected:   { label: 'Rejected',       color: 'bg-error/10 text-error border-error/20',         icon: XCircle },
}

export default function AdminPage() {
  const [uploads, setUploads]   = useState<Upload[]>([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState<Upload['status'] | 'all'>('all')

  // ─── Load uploads from the database ──────────────────────────────────────
  async function fetchUploads() {
    setLoading(true)
    let query = supabase
      .from('uploads')
      .select('*')
      .order('created_at', { ascending: false })

    if (filter !== 'all') {
      query = query.eq('status', filter)
    }

    const { data, error } = await query
    if (!error && data) setUploads(data)
    setLoading(false)
  }

  // Re-fetch when the filter changes
  useEffect(() => { fetchUploads() }, [filter])

  // ─── Approve an upload ────────────────────────────────────────────────────
  async function handleApprove(id: string) {
    const { error } = await supabase
      .from('uploads')
      .update({ status: 'approved' })
      .eq('id', id)

    if (!error) fetchUploads()   // refresh the list
  }

  // ─── Reject an upload (with optional note) ────────────────────────────────
  async function handleReject(id: string) {
    const note = window.prompt('Reason for rejection (optional):')
    const { error } = await supabase
      .from('uploads')
      .update({ status: 'rejected', notes: note ?? null })
      .eq('id', id)

    if (!error) fetchUploads()
  }

  // ─── Download the original file from Supabase Storage ────────────────────
  async function handleDownload(filePath: string) {
    const { data, error } = await supabase.storage
      .from('uploads')
      .download(filePath)

    if (error || !data) {
      alert('Could not download file: ' + error?.message)
      return
    }

    // Create a temporary link and click it to trigger download
    const url  = URL.createObjectURL(data)
    const link = document.createElement('a')
    link.href     = url
    link.download = filePath.split('/').pop() ?? 'file.xlsx'
    link.click()
    URL.revokeObjectURL(url)
  }

  // ─── UI ───────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-bg-base">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Admin Panel</h1>
        <p className="text-text-secondary text-sm mb-6">
          Review and approve entity submissions.
        </p>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-6">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-sm capitalize cursor-pointer transition-colors
                          ${filter === f
                            ? 'bg-primary text-bg-base font-medium'
                            : 'bg-bg-surface text-text-secondary hover:text-text-primary border border-border-default'
                          }`}
            >
              {f}
            </button>
          ))}
          <button
            onClick={fetchUploads}
            className="ml-auto px-3 py-1.5 rounded-lg bg-bg-surface border border-border-default
                       text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
            title="Refresh"
          >
            <RefreshCw size={14} />
          </button>
        </div>

        {/* Table */}
        <div className="bg-bg-surface border border-border-default rounded-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-text-secondary text-sm animate-pulse">
              Loading submissions...
            </div>
          ) : uploads.length === 0 ? (
            <div className="p-12 text-center text-text-secondary text-sm">
              No submissions found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border-default">
                  <th className="px-6 py-4 text-left text-text-secondary font-medium">Entity</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-medium">Period</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-medium">Status</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-medium">Submitted</th>
                  <th className="px-6 py-4 text-left text-text-secondary font-medium">Notes</th>
                  <th className="px-6 py-4 text-right text-text-secondary font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploads.map((upload) => {
                  const cfg        = statusConfig[upload.status]
                  const StatusIcon = cfg.icon
                  const date       = new Date(upload.created_at).toLocaleDateString('en-PK', {
                    day: '2-digit', month: 'short', year: 'numeric',
                  })
                  return (
                    <tr key={upload.id} className="border-b border-border-default hover:bg-bg-elevated">
                      <td className="px-6 py-4 text-text-primary font-medium">{upload.entity_id}</td>
                      <td className="px-6 py-4 text-text-secondary font-mono">{upload.period}</td>

                      {/* Status badge */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1
                                          rounded-full text-xs border ${cfg.color}`}>
                          <StatusIcon size={10} />
                          {cfg.label}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-text-muted text-xs">{date}</td>
                      <td className="px-6 py-4 text-text-muted text-xs max-w-[160px] truncate">
                        {upload.notes ?? '—'}
                      </td>

                      {/* Action buttons */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {/* Download always available */}
                          <button
                            onClick={() => handleDownload(upload.file_path)}
                            className="p-1.5 rounded-lg text-text-secondary hover:text-info
                                       hover:bg-info/10 transition-colors cursor-pointer"
                            title="Download file"
                          >
                            <Download size={14} />
                          </button>

                          {/* Approve / Reject only for pending */}
                          {upload.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApprove(upload.id)}
                                className="p-1.5 rounded-lg text-text-secondary hover:text-success
                                           hover:bg-success/10 transition-colors cursor-pointer"
                                title="Approve"
                              >
                                <CheckCircle size={14} />
                              </button>
                              <button
                                onClick={() => handleReject(upload.id)}
                                className="p-1.5 rounded-lg text-text-secondary hover:text-error
                                           hover:bg-error/10 transition-colors cursor-pointer"
                                title="Reject"
                              >
                                <XCircle size={14} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  )
}
