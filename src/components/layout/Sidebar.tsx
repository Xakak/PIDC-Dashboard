'use client'
// src/components/layout/Sidebar.tsx
// The left sidebar shown on every dashboard page (upload, admin, dashboard).
// 'use client' because it uses usePathname to highlight the active link.

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import {
  LayoutDashboard,
  Upload,
  ShieldCheck,
  LogOut,
} from 'lucide-react'

// ─── Nav items ───────────────────────────────────────────────────────────────
// Add new pages here when you create them.
const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Upload Data', href: '/upload',   icon: Upload },
  { label: 'Admin Panel', href: '/admin',    icon: ShieldCheck },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router   = useRouter()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <aside className="w-64 bg-bg-surface border-r border-border-default
                      flex flex-col min-h-screen shrink-0">

      {/* Logo */}
      <div className="p-6 border-b border-border-default">
        <div className="flex items-center gap-3">
          <div className="bg-primary rounded-lg w-8 h-8 flex items-center justify-center shrink-0">
            <span className="text-bg-base font-bold text-xs">P</span>
          </div>
          <div>
            <p className="text-text-primary font-semibold text-sm">PIDC Portal</p>
            <p className="text-text-muted text-xs">Statistics Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm
                          transition-colors cursor-pointer
                          ${isActive
                            ? 'bg-primary/10 text-primary border border-primary/20'
                            : 'text-text-secondary hover:text-text-primary hover:bg-bg-elevated'
                          }`}
            >
              <Icon size={16} />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border-default">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm
                     text-text-secondary hover:text-error hover:bg-error/5
                     transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          Sign out
        </button>
      </div>
    </aside>
  )
}
