// src/app/layout.tsx
// This is the ROOT layout — it wraps EVERY page in the app.
// Think of it like a picture frame that never changes.

import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PIDC Statistics Dashboard',
  description: 'Pakistan Industrial Development Corporation — Statistics Portal',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
