"use client";

import { animate, motion, useMotionValue, type AnimationPlaybackControls } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/templates/royal/hooks/usePrefersReducedMotion";
import { Heart } from "lucide-react";
import { invitationExamples } from "@/data/testimonials";

export function TestimonialSection() {
  const reducedMotion = usePrefersReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const playback = useRef<AnimationPlaybackControls | null>(null);
  const x = useMotionValue(0);
  const [distance, setDistance] = useState(0);
  const [userPaused, setUserPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const paused = userPaused || hovered || focused;
  const pausedRef = useRef(paused);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance((track.scrollWidth + (parseFloat(getComputedStyle(track).columnGap) || 0)) / 2);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    x.set(0);
    if (reducedMotion || distance <= 0) return;
    const animation = animate(x, [0, -distance], { duration: 35, repeat: Infinity, ease: "linear" });
    playback.current = animation;
    if (pausedRef.current) animation.pause();
    return () => { animation.stop(); playback.current = null; };
  }, [distance, reducedMotion, x]);

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) playback.current?.pause();
    else playback.current?.play();
  }, [paused]);

  // Existing story-card layout now presents clearly labelled product examples.
  const duplicatedExamples = [...invitationExamples, ...invitationExamples];

  return (
    <section className="space-y-8 overflow-hidden py-4 relative">
      {/* Header */}
      <div className="text-center">
        <h2 className="font-[family-name:var(--font-heading)] text-headline-lg text-champagne-gold mb-2 font-semibold">
          Imagine Your Celebration
        </h2>
        <p className="text-sm text-on-surface-variant">Illustrative wedding examples, not customer reviews.</p>
      </div>

      <div className="invitation-examples-pause flex justify-center">
        <button type="button" aria-pressed={userPaused} onClick={() => setUserPaused(value => !value)}
          className="min-h-11 rounded-full border border-champagne-gold/30 px-5 text-sm text-on-surface focus-visible:outline focus-visible:outline-2 focus-visible:outline-champagne-gold">
          {userPaused ? "Resume motion" : "Pause motion"}
        </button>
      </div>

      {/* Cinematic Fade Overlays */}
      <div className="invitation-examples-fade absolute top-16 bottom-0 left-0 w-12 md:w-32 bg-gradient-to-r from-charcoal-black to-transparent z-10 pointer-events-none" />
      <div className="invitation-examples-fade absolute top-16 bottom-0 right-0 w-12 md:w-32 bg-gradient-to-l from-charcoal-black to-transparent z-10 pointer-events-none" />

      {/* Infinite Scrolling Marquee Container */}
      <div className="w-full overflow-hidden py-4 flex"
        onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setFocused(true)}
        onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}>
        <motion.div
          ref={trackRef}
          className="invitation-examples-track flex gap-6 w-max"
          style={{ x }}
        >
          {duplicatedExamples.map((example, i) => (
            <div
              key={`${example.id}-${i}`}
              aria-hidden={i >= invitationExamples.length ? true : undefined}
              className={`${i >= invitationExamples.length ? "invitation-examples-duplicate " : ""}shrink-0 max-w-full w-[300px] md:w-[400px] bg-surface p-6 rounded-2xl border border-champagne-gold/20 flex flex-col gap-4 relative select-none`}
            >
              <div className="flex items-center gap-2 text-champagne-gold">
                <Heart size={18} aria-hidden />
                <span className="text-[10px] uppercase tracking-widest">Illustrative example</span>
              </div>
              <h3 className="font-heading text-lg text-ivory">{example.title}</h3>
              <p className="font-[family-name:var(--font-body)] text-on-surface relative z-10">
                {example.description}
              </p>

              {/* Available template */}
              <div className="mt-auto pt-4 border-t border-surface-bright">
                <p className="font-[family-name:var(--font-heading)] text-body-lg text-ivory font-medium">
                  {example.templateName}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

