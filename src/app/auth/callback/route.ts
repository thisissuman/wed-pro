import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/server'

function safeNext(value: string | null, fallback = '/dashboard'): string {
  if (!value) return fallback
  // Only allow internal redirects to avoid open-redirect issues.
  if (value.startsWith('/') && !value.startsWith('//')) {
    return value
  }
  return fallback
}

function resolveRedirectOrigin(request: Request, origin: string): string {
  const forwardedHost = request.headers.get('x-forwarded-host')
  const isLocalEnv = process.env.NODE_ENV === 'development'

  if (isLocalEnv) return origin
  if (forwardedHost) return `https://${forwardedHost}`
  return origin
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const tokenHash = searchParams.get('token_hash')
  const type = searchParams.get('type')
  const nextParam = searchParams.get('next')
  const next = safeNext(
    nextParam,
    type === 'recovery' ? '/reset-password' : '/dashboard'
  )
  const redirectOrigin = resolveRedirectOrigin(request, origin)
  const supabase = await createClient()

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${redirectOrigin}${next}`)
    }
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as EmailOtpType,
    })

    if (!error) {
      return NextResponse.redirect(`${redirectOrigin}${next}`)
    }
  }

  // If error occurs, redirect to login page with a specific query parameter.
  const errorUrl = new URL('/login', redirectOrigin)
  errorUrl.searchParams.set('error', 'auth-code-error')
  if (next !== '/dashboard') {
    errorUrl.searchParams.set('next', next)
  }
  return NextResponse.redirect(errorUrl)
}
