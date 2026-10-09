// Root page — middleware handles the redirect to /login or /dashboard
// This file exists as a fallback only
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/login')
}
