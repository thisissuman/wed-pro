"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { useRef, useState } from "react";

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5], [0.2, 0.4]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setMousePosition({ x, y });
  };

  const cardRotateX = isHovering ? -(mousePosition.y / 20) : 0;
  const cardRotateY = isHovering ? (mousePosition.x / 20) : 0;

  return (
    <section className="relative z-10 space-y-12">
      {/* Section Header */}
      <header className="text-center relative z-10">
        <span className="font-label-md text-label-md text-champagne-gold uppercase tracking-[0.2em] mb-4 block">
          Simple Process
        </span>
        <h1 className="font-display-lg text-display-lg text-on-surface mb-6">
          How It Works
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Fill in your details — we transform them into a stunning invitation
          webpage.
        </p>
      </header>

      {/* Cinematic Journey Layout */}
      <div
        ref={containerRef}
        className="relative rounded-3xl p-4 md:p-12 border border-surface-container-high bg-charcoal-black/50 backdrop-blur-sm overflow-hidden"
        style={{
          backgroundImage: "radial-gradient(rgba(212, 175, 55, 0.1) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        {/* Atmospheric Background Image */}
        <motion.div
          className="absolute inset-0 pointer-events-none mix-blend-luminosity bg-cover bg-center origin-center"
          style={{
            backgroundImage:
              "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDWbgVcT8ziF2lbzVXOmz0xOEbMzfO9uZ0roU7k5NbXF8s3eL3XC0dm4pCo738v7TnCMLQdu67QlPALZzlZU-dLlsfDQ3GGpbKprBBaLgZvmEhrMQRTPDJzvTT69gbCPY0Er4EAqpz9LgawEjA_5HlarAJbGWbU1WOLnK6UKEfTY3rBqxDcLbNaEKAHPMPTW-W4SGlVWQb4Lh9N1EvwgBAG2fjfnC9TL_HI1mzjG9yLyMMjCN4ldq9fpAhca0nmunG9M-6fie8D7fM')",
            scale: bgScale,
            opacity: bgOpacity,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-black via-transparent to-charcoal-black pointer-events-none"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-stretch justify-between gap-12 lg:gap-8">
          {/* Step 1: Fill Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex-1 flex flex-col relative z-20"
          >
            <div className="text-center mb-8">
              <span className="font-label-sm text-label-sm text-champagne-gold uppercase tracking-[0.15em]">
                1 · Fill Details
              </span>
            </div>
            <div className="bg-surface-container/80 backdrop-blur-md rounded-2xl border border-surface-container-high p-6 flex-1 shadow-2xl">
              {/* Mac OS Window Dots */}
              <div className="flex items-center gap-2 mb-6 border-b border-surface-container-high pb-4">
                <div className="w-3 h-3 rounded-full bg-error/50"></div>
                <div className="w-3 h-3 rounded-full bg-primary/50"></div>
                <div className="w-3 h-3 rounded-full bg-champagne-gold/50"></div>
                <span className="ml-2 font-label-sm text-on-surface-variant/50 text-[10px] uppercase">
                  Create Invitation
                </span>
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-surface-container-lowest/50 border border-surface-container-high">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant/70 mb-1">
                    Groom&apos;s Name
                  </label>
                  <div className="font-body-md text-body-md text-on-surface">
                    Rohan Mehra
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-surface-container-lowest/50 border border-surface-container-high">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant/70 mb-1">
                    Wedding Date
                  </label>
                  <div className="font-body-md text-body-md text-on-surface">
                    14 Feb 2026
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-surface-container-lowest/50 border border-surface-container-high">
                  <label className="block font-label-sm text-label-sm text-on-surface-variant/70 mb-1">
                    Venue
                  </label>
                  <div className="font-body-md text-body-md text-on-surface">
                    The Leela Palace, Udaipur
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Step 2: Transform */}
          <div className="flex flex-col items-center justify-center lg:w-32 py-8 lg:py-0 relative">
            <div className="absolute lg:inset-y-0 lg:left-1/2 lg:-translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-champagne-gold/30 to-transparent hidden lg:block"></div>
            <div className="text-center mb-6 lg:absolute lg:top-0 lg:w-full">
              <span className="font-label-sm text-label-sm text-champagne-gold uppercase tracking-[0.15em]">
                2 · Transform
              </span>
            </div>
            
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="relative z-10 w-16 h-16 rounded-full bg-surface-container border border-champagne-gold/30 flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.2)]"
            >
              <Sparkles className="text-champagne-gold animate-pulse" size={24} />
            </motion.div>
          </div>

          {/* Step 3: Get Invitation */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="flex-1 flex flex-col perspective-1000"
          >
            <div className="text-center mb-8 relative z-20">
              <span className="font-label-sm text-label-sm text-champagne-gold uppercase tracking-[0.15em]">
                3 · Get Invitation
              </span>
            </div>
            
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => {
                setIsHovering(false);
                setMousePosition({ x: 0, y: 0 });
              }}
              animate={{
                rotateX: cardRotateX,
                rotateY: cardRotateY,
                scale: isHovering ? 1.02 : 1,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              className="bg-surface-container/90 backdrop-blur-xl rounded-2xl border border-champagne-gold/20 p-2 flex-1 shadow-2xl relative overflow-hidden transform-style-3d cursor-pointer gold-aura-hover"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-charcoal-black via-[#1a1112] to-[#12111a] z-0 pointer-events-none"></div>
              <div className="relative z-10 h-full w-full rounded-xl border border-white/5 flex flex-col items-center justify-center p-8 text-center min-h-[400px]">
                <Sparkles className="text-champagne-gold/50 mb-6" size={24} />
                <p className="font-label-sm text-label-sm text-champagne-gold tracking-[0.3em] uppercase mb-8">
                  We Invite You
                </p>
                <h3 className="font-[family-name:var(--font-heading)] text-[48px] leading-tight text-ivory font-light italic mb-4">
                  Aisha
                </h3>
                <div className="flex items-center gap-4 my-2 text-champagne-gold/50">
                  <div className="h-[1px] w-12 bg-champagne-gold/30"></div>
                  <Heart size={14} fill="currentColor" />
                  <div className="h-[1px] w-12 bg-champagne-gold/30"></div>
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-[48px] leading-tight text-ivory font-light italic mt-4 mb-12">
                  Rohan
                </h3>
                <p className="font-label-sm text-label-sm text-on-surface tracking-[0.2em] mb-2 uppercase">
                  14 · FEBRUARY · 2026
                </p>
                <p className="font-body-md text-sm text-on-surface-variant italic">
                  The Leela Palace · Udaipur
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
