'use client'

import { Suspense, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { AuthBackground } from '@/components/auth/AuthBackground'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'
import {
  buildOAuthCallbackUrl,
  describeAuthError,
  safeNextPath,
} from '@/lib/auth/redirects'
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

  // Form errors override query-string errors so the latest action wins.
  const errorMsg = formError ?? queryError
  const setErrorMsg = setFormError

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
          setErrorMsg(error.message)
          toast.error('Login failed', error.message)
          return
        }

        toast.success('Welcome back')
        router.push(nextPath)
        router.refresh()
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
        setErrorMsg(error.message)
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

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-6 w-full max-w-7xl mx-auto min-h-screen select-none">
        {/* Brand Header */}
        <div className="mb-10 text-center animate-fade-in duration-1000">
          <h1 className="font-heading text-4xl md:text-5xl text-[#f2ca50] tracking-[0.25em] drop-shadow-lg uppercase font-semibold">
            Vivaha Studio
          </h1>
          <p className="font-body text-xs md:text-sm text-[#d0c5af]/80 uppercase mt-4 tracking-[0.3em]">
            Crafted for Royal Celebrations
          </p>
        </div>

        {/* Login Card */}
        <div className="w-full max-w-md bg-[#201f1f]/50 backdrop-blur-2xl rounded-2xl p-8 md:p-10 border border-[#f2ca50]/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-500 hover:border-[#f2ca50]/25">
          {/* Subtle gold line on top border */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#f2ca50]/30 to-transparent" />
          
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl text-[#FFFFF0] mb-2 font-medium">Welcome Back</h2>
            <p className="font-body text-sm text-[#d0c5af]/70">Continue your beautiful journey</p>
          </div>

          {/* Golden Rose error message banner */}
          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-[#8f0f07]/20 border border-[#ffb4a8]/30 text-[#ffb4a8] text-xs leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
              <span className="font-semibold mr-1">Authentication Error:</span>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
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
                className="peer w-full bg-transparent border-0 border-b border-[#FFFFF0]/30 py-3 px-0 text-[#FFFFF0] font-body text-sm focus:ring-0 focus:border-[#f2ca50] transition-colors placeholder-transparent focus:outline-none"
              />
              <label
                htmlFor="email"
                className="absolute left-0 -top-3.5 text-[#d0c5af]/60 font-body text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-[#f2ca50]"
              >
                Email Address
              </label>
            </div>

            {/* Password Input */}
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
                className="peer w-full bg-transparent border-0 border-b border-[#FFFFF0]/30 py-3 pr-10 pl-0 text-[#FFFFF0] font-body text-sm focus:ring-0 focus:border-[#f2ca50] transition-colors placeholder-transparent focus:outline-none"
              />
              <label
                htmlFor="password"
                className="absolute left-0 top-0 text-[#d0c5af]/60 font-body text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-5 peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#f2ca50]"
              >
                Password
              </label>
              
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                className="absolute right-0 top-3.5 text-[#d0c5af]/50 hover:text-[#f2ca50] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end pt-1">
              <Link 
                href="/forgot-password" 
                className="font-body text-xs text-[#f2ca50] hover:text-[#FFFFF0] transition-colors"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center py-4 px-8 rounded-full bg-gradient-to-r from-[#f2ca50] to-[#B76E79] text-[#3c2f00] font-heading font-semibold text-xs uppercase tracking-[0.15em] hover:shadow-[0_0_20px_rgba(242,202,80,0.35)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none group relative overflow-hidden"
              >
                {isPending ? 'Authenticating...' : 'Login to Your Studio'}
                {!isPending && (
                  <ArrowRight size={15} className="ml-2 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
            </div>
          </form>

          {/* Social Sign In Divider */}
          <div className="my-6 relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#f2ca50]/15" />
            </div>
            <div className="relative px-4 bg-[#201f1f] text-[#d0c5af]/50 font-body text-xs uppercase tracking-widest">
              Or
            </div>
          </div>

          {/* Google Auth Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isPending || isGooglePending}
            className="w-full flex items-center justify-center gap-3 bg-transparent border border-[#f2ca50]/20 text-[#e5e2e1] font-body text-sm py-3.5 rounded-full hover:bg-[#f2ca50]/5 hover:border-[#f2ca50]/40 active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            <span className="font-body text-xs uppercase tracking-widest text-[#d0c5af]">
              {isGooglePending ? 'Redirecting…' : 'Continue with Google'}
            </span>
          </button>
        </div>

        {/* Footer Redirect Link */}
        <div className="mt-8 text-center animate-fade-in">
          <p className="font-body text-sm text-[#d0c5af]/80">
            New to Vivaha?{' '}
            <Link
              href="/signup"
              className="text-[#f2ca50] hover:text-[#FFFFF0] ml-1 transition-colors underline underline-offset-4 decoration-[#f2ca50]/30 hover:decoration-[#FFFFF0]/40 font-semibold"
            >
              Create Your Story
            </Link>
          </p>
        </div>
      </main>
    </>
  )
}
