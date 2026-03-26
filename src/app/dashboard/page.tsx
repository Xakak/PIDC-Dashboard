// src/app/dashboard/page.tsx
// The main dashboard overview page.
// Shows submission stats fetched from Supabase.

import Sidebar from '@/components/layout/Sidebar'
import { supabase } from '@/lib/supabase'

export default async function DashboardPage() {
  // ─── Fetch stats from the database ──────────────────────────────────────
  // These are simple counts — no complex logic yet.

  const { count: totalUploads } = await supabase
    .from('uploads')
    .select('*', { count: 'exact', head: true })

  const { count: pendingUploads } = await supabase
    .from('uploads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'pending')

  const { count: approvedUploads } = await supabase
    .from('uploads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'approved')

  // ─── UI ──────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-bg-base">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Dashboard</h1>
        <p className="text-text-secondary text-sm mb-8">Overview of all entity submissions</p>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <KpiCard label="Total Submissions" value={totalUploads ?? 0} />
          <KpiCard label="Pending Review"    value={pendingUploads ?? 0} color="warning" />
          <KpiCard label="Approved"          value={approvedUploads ?? 0} color="success" />
        </div>

        {/* Placeholder for charts — add Recharts here in Week 5 */}
        <div className="bg-bg-surface border border-border-default rounded-xl p-6">
          <p className="text-text-secondary text-sm">
            📊 Charts will appear here once real data is uploaded. (Week 5)
          </p>
        </div>
      </main>
    </div>
  )
}

// ─── Small reusable KPI card component ──────────────────────────────────────
function KpiCard({
  label,
  value,
  color = 'primary',
}: {
  label: string
  value: number
  color?: 'primary' | 'warning' | 'success'
}) {
  const colorMap = {
    primary: 'text-primary',
    warning: 'text-warning',
    success: 'text-success',
  }
  return (
    <div className="bg-bg-surface border border-border-default rounded-xl p-6">
      <p className="text-text-secondary text-sm mb-2">{label}</p>
      <p className={`text-4xl font-bold font-mono ${colorMap[color]}`}>{value}</p>
    </div>
  )
}
