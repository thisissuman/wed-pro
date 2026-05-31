'use client'

import { Suspense, useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, KeyRound } from 'lucide-react'
import { createClient } from '@/utils/supabase/client'
import { AuthBackground } from '@/components/auth/AuthBackground'

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordPageInner />
    </Suspense>
  )
}

function ResetPasswordPageInner() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [sessionReady, setSessionReady] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    let settled = false

    const finish = (ready: boolean, message?: string) => {
      if (settled) return
      settled = true
      setSessionReady(ready)
      if (message) setErrorMsg(message)
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN')) {
        finish(true)
      }
    })

    void (async () => {
      const params = new URLSearchParams(window.location.search)
      const tokenHash = params.get('token_hash')
      const type = params.get('type')

      if (tokenHash && type === 'recovery') {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: 'recovery',
        })
        if (error) {
          finish(false, 'This reset link is invalid or has expired. Please request a new one.')
          return
        }
        finish(true)
        return
      }

      const { data } = await supabase.auth.getSession()
      if (data.session) {
        finish(true)
      } else {
        finish(false, 'This reset link is invalid or has expired. Please request a new one.')
      }
    })()

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    startTransition(async () => {
      try {
        const supabase = createClient()
        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
          setErrorMsg(error.message)
          return
        }

        router.push('/dashboard')
        router.refresh()
      } catch {
        setErrorMsg('Something went wrong. Please try again.')
      }
    })
  }

  return (
    <>
      <AuthBackground />

      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-6 w-full max-w-7xl mx-auto min-h-screen select-none">
        <BrandHeader />

        <div className="w-full max-w-md bg-[#201f1f]/50 backdrop-blur-2xl rounded-2xl p-8 md:p-10 border border-[#f2ca50]/15 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8)] relative overflow-hidden transition-all duration-500 hover:border-[#f2ca50]/25">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-[#f2ca50]/30 to-transparent" />

          {!sessionReady ? (
            <WaitingState errorMsg={errorMsg} />
          ) : (
            <>
              <div className="text-center mb-8">
                <h2 className="font-heading text-2xl text-[#FFFFF0] mb-2 font-medium">
                  Set New Password
                </h2>
                <p className="font-body text-sm text-[#d0c5af]/70">
                  Choose a secure password for your studio account.
                </p>
              </div>

              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-[#8f0f07]/20 border border-[#ffb4a8]/30 text-[#ffb4a8] text-xs leading-relaxed">
                  <span className="font-semibold mr-1">Reset Error:</span>
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <PasswordField
                  id="password"
                  label="New Password"
                  value={password}
                  onChange={setPassword}
                  showPassword={showPassword}
                  onToggleShow={() => setShowPassword((prev) => !prev)}
                  disabled={isPending}
                />
                <PasswordField
                  id="confirmPassword"
                  label="Confirm Password"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                  showPassword={showPassword}
                  onToggleShow={() => setShowPassword((prev) => !prev)}
                  disabled={isPending}
                />

                <SubmitButton pending={isPending} />
              </form>
            </>
          )}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/login"
            className="font-body text-sm text-[#f2ca50] hover:text-[#FFFFF0] transition-colors"
          >
            Back to Login
          </Link>
        </div>
      </main>
    </>
  )
}

function BrandHeader() {
  return (
    <div className="mb-10 text-center animate-fade-in duration-1000">
      <h1 className="font-heading text-4xl md:text-5xl text-[#f2ca50] tracking-[0.25em] drop-shadow-lg uppercase font-semibold">
        Vivaha Studio
      </h1>
      <p className="font-body text-xs md:text-sm text-[#d0c5af]/80 uppercase mt-4 tracking-[0.3em]">
        Secure your account
      </p>
    </div>
  )
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  showPassword,
  onToggleShow,
  disabled,
}: {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
  showPassword: boolean
  onToggleShow: () => void
  disabled: boolean
}) {
  return (
    <div className="relative group pt-2">
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        name={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        required
        minLength={6}
        disabled={disabled}
        className="peer w-full bg-transparent border-0 border-b border-[#FFFFF0]/30 py-3 pr-10 pl-0 text-[#FFFFF0] font-body text-sm focus:ring-0 focus:border-[#f2ca50] transition-colors placeholder-transparent focus:outline-none"
      />
      <label
        htmlFor={id}
        className="absolute left-0 top-0 text-[#d0c5af]/60 font-body text-xs transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:top-5 peer-focus:top-0 peer-focus:text-xs peer-focus:text-[#f2ca50]"
      >
        {label}
      </label>
      <button
        type="button"
        onClick={onToggleShow}
        tabIndex={-1}
        className="absolute right-0 top-3.5 text-[#d0c5af]/50 hover:text-[#f2ca50] transition-colors focus:outline-none"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}

function WaitingState({ errorMsg }: { errorMsg: string | null }) {
  return (
    <div className="py-6 text-center">
      {errorMsg ? (
        <div className="mb-4 p-4 rounded-xl bg-[#8f0f07]/20 border border-[#ffb4a8]/30 text-[#ffb4a8] text-xs leading-relaxed">
          <span className="font-semibold mr-1">Reset Error:</span>
          {errorMsg}
        </div>
      ) : (
        <p className="font-body text-sm text-[#d0c5af]/70">Checking your reset link…</p>
      )}
      <Link
        href="/forgot-password"
        className="mt-4 inline-block font-body text-xs text-[#f2ca50] hover:text-[#FFFFF0] transition-colors"
      >
        Request a new reset link
      </Link>
    </div>
  )
}

function SubmitButton({ pending }: { pending: boolean }) {
  return (
    <div className="pt-4">
      <button
        type="submit"
        disabled={pending}
        className="w-full flex items-center justify-center py-4 px-8 rounded-full bg-gradient-to-r from-[#f2ca50] to-[#B76E79] text-[#3c2f00] font-heading font-semibold text-xs uppercase tracking-[0.15em] hover:shadow-[0_0_20px_rgba(242,202,80,0.35)] hover:scale-[1.01] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none group"
      >
        {pending ? 'Updating…' : 'Update Password'}
        {!pending && (
          <KeyRound size={14} className="ml-2 group-hover:translate-x-0.5 transition-transform" />
        )}
      </button>
    </div>
  )
}
