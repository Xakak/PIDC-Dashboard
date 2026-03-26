'use client'
// src/app/login/page.tsx
// The login page. Users enter email + password.
// On success → redirect to /dashboard (admin) or /upload (entity user).
//
// 'use client' is needed because this page uses:
//   - useState (React state for form inputs)
//   - useRouter (Next.js navigation)
//   - browser events (onClick, onChange)

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  // ─── State ──────────────────────────────────────────────────────────────
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const router = useRouter()

  // ─── Handle login ────────────────────────────────────────────────────────
  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()          // stop the page from reloading
    setLoading(true)
    setError(null)

    // 1. Try to sign in with Supabase Auth
    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // 2. Fetch the user's profile to know their role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    // 3. Redirect based on role
    if (profile?.role === 'admin') {
      router.push('/admin')       // admin sees all uploads
    } else {
      router.push('/upload')      // entity user uploads data
    }
  }

  // ─── UI ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="w-full max-w-md relative">

        {/* Logo / header */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <img 
              src="/PIDC-Logo.png" 
              alt="PIDC Logo" 
              className="h-24 mx-auto mb-4 object-contain"
            />
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Statistics Portal</h1>
          <p className="text-text-secondary mt-1 text-sm">Pakistan Industrial Development Corporation</p>
        </div>

        {/* Card */}
        <div className="bg-bg-surface border border-border-default rounded-2xl p-8 shadow-2xl shadow-black/50">
          <h2 className="text-xl font-semibold text-text-primary mb-6 text-center">Sign in</h2>

          {/* Error message */}
          {error && (
            <div className="bg-error/10 border border-error/30 text-error rounded-lg px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@pidc.gov.pk"
                className="w-full bg-bg-elevated border border-border-default rounded-lg px-4 py-3
                           text-text-primary placeholder-text-muted text-sm
                           focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-text-secondary mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-bg-elevated border border-border-default rounded-lg px-4 py-3
                           text-text-primary placeholder-text-muted text-sm
                           focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50
                         text-white font-semibold rounded-lg py-3 text-sm
                         transition-colors cursor-pointer mt-4"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>
        </div>

        <p className="text-center text-text-muted text-xs mt-6">
          Contact your administrator to get access.
        </p>
      </div>
    </div>
  )
}
