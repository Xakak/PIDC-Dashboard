// src/app/page.tsx
// The "/" route. Just redirects to /login immediately.

import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/login')
}
