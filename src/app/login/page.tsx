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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo / header */}
        <div className="text-center mb-8">
          <img 
            src="/PIDC-Logo.png" 
            alt="PIDC Logo" 
            className="h-24 mx-auto mb-4 object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-900">Statistics Portal</h1>
          <p className="text-gray-600 mt-1 text-sm">Pakistan Industrial Development Corporation</p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">Sign in</h2>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">

            {/* Email */}
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@pidc.gov.pk"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3
                           text-gray-900 placeholder-gray-400 text-sm
                           focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-3
                           text-gray-900 placeholder-gray-400 text-sm
                           focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 transition-all"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50
                         text-white font-semibold rounded-lg py-3 text-sm
                         transition-colors cursor-pointer mt-4"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>

          </form>
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          Contact your administrator to get access.
        </p>
      </div>
    </div>
  )
}
