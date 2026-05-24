'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Send } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { AuthBackground } from '@/components/auth/AuthBackground'
import { buildOAuthCallbackUrl } from '@/lib/auth/redirects'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setSuccessMsg(null)

    startTransition(async () => {
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: buildOAuthCallbackUrl(window.location.origin, '/reset-password'),
        })
        if (error) {
          setErrorMsg(error.message)
          return
        }
        setSuccessMsg(
          'Check your inbox for a password reset link. It may take a minute to arrive.'
        )
        setEmail('')
      } catch {
        setErrorMsg('Something went wrong. Please try again.')
      }
    })
  }

  return (
    <>
      <AuthBackground />

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-6 w-full max-w-7xl mx-auto min-h-screen select-none">
        <div className="mb-10 text-center animate-fade-in duration-1000">
          <h1 className="font-heading text-4xl md:text-5xl text-[#f2ca50] tracking-[0.25em] drop-shadow-lg uppercase font-semibold">
            Vivaha Studio
          </h1>
          <p className="font-body text-xs md:text-sm text-[#d0c5af]/80 uppercase mt-4 tracking-[0.3em]">
            Reset your access
          </p>
        </div>

        <div className="w-full max-w-md bg-[#201f1f]/50 backdrop-blur-2xl rounded-2xl p-8 md:p-10 border border-[#f2ca50]/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-500 hover:border-[#f2ca50]/25">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#f2ca50]/30 to-transparent" />

          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl text-[#FFFFF0] mb-2 font-medium">
              Forgot Password
            </h2>
            <p className="font-body text-sm text-[#d0c5af]/70">
              Enter your email and we&apos;ll send a reset link.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-[#8f0f07]/20 border border-[#ffb4a8]/30 text-[#ffb4a8] text-xs leading-relaxed">
              <span className="font-semibold mr-1">Reset Error:</span>
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 rounded-xl bg-[#d4af37]/10 border border-[#f2ca50]/45 text-[#f2ca50] text-xs leading-relaxed flex items-start gap-2.5">
              <CheckCircle2 size={16} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Email sent:</span> {successMsg}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
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

            <div className="pt-4">
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center py-4 px-8 rounded-full bg-gradient-to-r from-[#f2ca50] to-[#B76E79] text-[#3c2f00] font-heading font-semibold text-xs uppercase tracking-[0.15em] hover:shadow-[0_0_20px_rgba(242,202,80,0.35)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none group"
              >
                {isPending ? 'Sending…' : 'Send Reset Link'}
                {!isPending && <Send size={14} className="ml-2" />}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 font-body text-sm text-[#f2ca50] hover:text-[#FFFFF0] transition-colors"
          >
            <ArrowLeft size={14} />
            Back to Login
          </Link>
        </div>
      </main>
    </>
  )
}
