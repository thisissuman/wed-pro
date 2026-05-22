'use client'

import { useEffect, useState, useRef } from 'react'

interface Particle {
  id: number
  size: number
  left: number
  duration: number
  delay: number
}

export function AuthBackground() {
  const [particles, setParticles] = useState<Particle[]>([])
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generate particles only on the client-side to prevent Next.js hydration mismatches
    const generated: Particle[] = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 1,
      left: Math.random() * 100,
      duration: Math.random() * 12 + 10,
      delay: Math.random() * -15, // Negative delay so particles are already spread across the screen initially
    }))
    
    // Set particles inside requestAnimationFrame to prevent synchronous setState cascades in useEffect
    requestAnimationFrame(() => {
      setParticles(generated)
    })


    // Parallax mouse movements
    const handleMouseMove = (e: MouseEvent) => {
      if (!bgRef.current) return
      const xAxis = (window.innerWidth / 2 - e.clientX) / 60
      const yAxis = (window.innerHeight / 2 - e.clientY) / 60
      bgRef.current.style.setProperty('--parallax-x', `${xAxis}px`)
      bgRef.current.style.setProperty('--parallax-y', `${yAxis}px`)
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!bgRef.current || !e.touches[0]) return
      const touch = e.touches[0]
      const xAxis = (window.innerWidth / 2 - touch.clientX) / 60
      const yAxis = (window.innerHeight / 2 - touch.clientY) / 60
      bgRef.current.style.setProperty('--parallax-x', `${xAxis}px`)
      bgRef.current.style.setProperty('--parallax-y', `${yAxis}px`)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .parallax-bg-style {
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          transform: translate(var(--parallax-x, 0px), var(--parallax-y, 0px)) scale(1.05);
          transition: transform 0.3s ease-out;
          animation: slowZoomStyle 35s infinite alternate linear;
        }

        @keyframes slowZoomStyle {
          0% { transform: translate(var(--parallax-x, 0px), var(--parallax-y, 0px)) scale(1.05); }
          100% { transform: translate(var(--parallax-x, 0px), var(--parallax-y, 0px)) scale(1.15); }
        }

        .shimmer-effect-style {
          background: radial-gradient(circle at center, rgba(212, 175, 55, 0.25) 0%, transparent 60%);
          animation: shimmerAnim 8s ease-in-out infinite;
        }

        @keyframes shimmerAnim {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.35; }
        }

        .auth-particles-style {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
        }

        .auth-particle-node {
          position: absolute;
          background: rgba(212, 175, 55, 0.5);
          border-radius: 50%;
          bottom: -20px;
          animation: floatUpStyle linear infinite;
        }

        @keyframes floatUpStyle {
          0% {
            transform: translateY(0) translateX(0) scale(0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
            transform: translateY(-10vh) translateX(10px) scale(1);
          }
          90% {
            opacity: 0.8;
            transform: translateY(-90vh) translateX(-15px) scale(1);
          }
          100% {
            transform: translateY(-110vh) translateX(0) scale(0);
            opacity: 0;
          }
        }
      `}} />

      {/* Background Image Layer */}
      <div 
        ref={bgRef}
        className="fixed inset-0 z-0 parallax-bg-style" 
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAColhBNAolO1lXESvGcZhEw6DPZzod96JQfP4496MJalYQ-YVssj65bdfwbNPwugA52_wH_Q24CU7xBBOYnbnEfCd1FA35X9Bpr4CZKXaVrNGTNvVhAWeuassHKZ_d1W1m-Yn8grbJ-P24Gr9vbj_x6uwnO-kskDSdI0BMhP2rTE3xEesldBaVEWOkYHw_dT3wX0vWdjARybe0O_7Qb8mvJjshtQhB0i3pR_-ozdkpFUjQjsla6pdIKHP9ml1ViGScDruF2zwkRnE')`
        }}
      >
        {/* Dimming and blend filters */}
        <div className="absolute inset-0 bg-black/70 backdrop-blur-[1px] mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/50" />
      </div>

      {/* Shimmer Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none shimmer-effect-style" />

      {/* Ambient Glow Aura */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[85vw] max-w-4xl h-[550px] bg-[#D4AF37]/5 rounded-full blur-[130px]" />
      </div>

      {/* Floating Gold Particles */}
      <div className="auth-particles-style">
        {particles.map((p) => (
          <div
            key={p.id}
            className="auth-particle-node"
            style={{
              width: `${p.size}px`,
              height: `${p.size}px`,
              left: `${p.left}%`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  )
}
