'use client'

import { Suspense, useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { AuthBackground } from '@/components/auth/AuthBackground'
import { AuthCard, AuthFormShell } from '@/components/auth/AuthFormShell'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import {
  buildOAuthCallbackUrl,
  buildSignupUrl,
  describeAuthError,
  safeNextPath,
} from '@/lib/auth/redirects'
import { mapAuthErrorMessage } from '@/lib/auth/messages'
import { toast } from '@/lib/toast'

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  )
}

function LoginPageInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = safeNextPath(searchParams.get('next'))
  const queryError = describeAuthError(searchParams.get('error'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [isGooglePending, setIsGooglePending] = useState(false)
  const [isPending, startTransition] = useTransition()

  const errorMsg = formError ?? queryError
  const setErrorMsg = setFormError

  useEffect(() => {
    router.prefetch(nextPath)
  }, [router, nextPath])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    startTransition(async () => {
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          const friendly = mapAuthErrorMessage(error.message)
          setErrorMsg(friendly)
          toast.error('Login failed', friendly)
          return
        }

        toast.success('Welcome back')
        // Refresh server components so middleware sees the new session, then navigate.
        router.refresh()
        router.push(nextPath)
      } catch {
        setErrorMsg('An unexpected error occurred. Please try again.')
      }
    })
  }

  const handleGoogleLogin = async () => {
    setErrorMsg(null)
    setIsGooglePending(true)
    try {
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: buildOAuthCallbackUrl(window.location.origin, nextPath),
        },
      })
      if (error) {
        setErrorMsg(mapAuthErrorMessage(error.message))
        setIsGooglePending(false)
      }
    } catch {
      setErrorMsg('Failed to initialize Google login.')
      setIsGooglePending(false)
    }
  }

  return (
    <>
      <AuthBackground />

      <AuthFormShell
        tagline="Crafted for Royal Celebrations"
        footer={
          <p className="font-body text-sm text-[#d0c5af]/80">
            New to Vivaha?{' '}
            <Link
              href={buildSignupUrl(nextPath)}
              className="ml-1 font-semibold text-[#f2ca50] underline underline-offset-4 decoration-[#f2ca50]/30 transition-colors hover:text-[#FFFFF0] hover:decoration-[#FFFFF0]/40"
            >
              Create Your Story
            </Link>
          </p>
        }
      >
        <AuthCard>
          <div className="mb-8 text-center">
            <h2 className="mb-2 font-heading text-2xl font-medium text-[#FFFFF0]">Welcome Back</h2>
            <p className="font-body text-sm text-[#d0c5af]/70">Continue your beautiful journey</p>
          </div>

          {errorMsg && (
            <div className="mb-6 animate-in fade-in slide-in-from-top-2 rounded-xl border border-[#ffb4a8]/30 bg-[#8f0f07]/20 p-4 text-xs leading-relaxed text-[#ffb4a8] duration-300">
              <span className="mr-1 font-semibold">Authentication Error:</span>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="relative group">
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
                disabled={isPending}
                inputMode="email"
                autoComplete="email"
                className="peer w-full border-0 border-b border-[#FFFFF0]/30 bg-transparent px-0 py-3 font-body text-sm text-[#FFFFF0] placeholder-transparent transition-colors focus:border-[#f2ca50] focus:ring-0 focus:outline-none"
              />
              <label
                htmlFor="email"
                className="absolute left-0 -top-3.5 font-body text-xs text-[#d0c5af]/60 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-sm peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#f2ca50]"
              >
                Email Address
              </label>
            </div>

            <div className="relative group pt-2">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
                disabled={isPending}
                autoComplete="current-password"
                className="peer w-full border-0 border-b border-[#FFFFF0]/30 bg-transparent py-3 pr-12 pl-0 font-body text-sm text-[#FFFFF0] placeholder-transparent transition-colors focus:border-[#f2ca50] focus:ring-0 focus:outline-none"
              />
              <label
                htmlFor="password"
                className="absolute left-0 top-0 font-body text-xs text-[#d0c5af]/60 transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#f2ca50]"
              >
                Password
              </label>

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-0 top-2 flex min-h-11 min-w-11 items-center justify-center text-[#d0c5af]/50 transition-colors hover:text-[#f2ca50] focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="flex justify-end pt-1">
              <Link
                href="/forgot-password"
                className="font-body text-xs text-[#f2ca50] transition-colors hover:text-[#FFFFF0]"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-[#f2ca50] to-[#B76E79] px-8 py-4 font-heading text-xs font-semibold uppercase tracking-[0.15em] text-[#3c2f00] transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(242,202,80,0.35)] active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50"
              >
                {isPending ? 'Authenticating...' : 'Login to Your Studio'}
                {!isPending && (
                  <ArrowRight size={15} className="ml-2 transition-transform group-hover:translate-x-1" />
                )}
              </button>
            </div>
          </form>

          <div className="relative my-6 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#f2ca50]/15" />
            </div>
            <div className="relative bg-[#201f1f] px-4 font-body text-xs uppercase tracking-widest text-[#d0c5af]/50">
              Or
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isPending || isGooglePending}
            className="flex w-full min-h-11 items-center justify-center gap-3 rounded-full border border-[#f2ca50]/20 bg-transparent py-3.5 font-body text-sm text-[#e5e2e1] transition-all duration-300 hover:border-[#f2ca50]/40 hover:bg-[#f2ca50]/5 active:scale-[0.98] disabled:opacity-50"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="font-body text-xs uppercase tracking-widest text-[#d0c5af]">
              {isGooglePending ? 'Redirecting…' : 'Continue with Google'}
            </span>
          </button>
        </AuthCard>
      </AuthFormShell>
    </>
  )
}
