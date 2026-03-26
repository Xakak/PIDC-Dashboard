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
    <div className="min-h-screen bg-bg-base flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo / header */}
        <div className="text-center mb-8">
          <div className="inline-block bg-primary rounded-lg p-3 mb-4">
            <span className="text-bg-base font-bold text-xl">PIDC</span>
          </div>
          <h1 className="text-2xl font-bold text-text-primary">Statistics Portal</h1>
          <p className="text-text-secondary mt-1 text-sm">Pakistan Industrial Development Corporation</p>
        </div>

        {/* Card */}
        <div className="bg-bg-surface border border-border-default rounded-xl p-8">
          <h2 className="text-lg font-semibold text-text-primary mb-6">Sign in to your account</h2>

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
                className="w-full bg-bg-elevated border border-border-default rounded-lg px-4 py-2.5
                           text-text-primary placeholder-text-muted text-sm
                           focus:outline-none focus:border-primary transition-colors"
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
                className="w-full bg-bg-elevated border border-border-default rounded-lg px-4 py-2.5
                           text-text-primary placeholder-text-muted text-sm
                           focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50
                         text-bg-base font-semibold rounded-lg py-2.5 text-sm
                         transition-colors cursor-pointer mt-2"
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
