"use client";

import { motion } from "framer-motion";

interface DemoCardProps {
  name: string;
  imageUrl: string;
  index?: number;
}

export function DemoCard({ name, imageUrl, index = 0 }: DemoCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
      className="snap-center shrink-0 w-[240px] md:w-[280px] bg-surface rounded-2xl overflow-hidden border border-champagne-gold/10 group flex flex-col shadow-lg"
    >
      {/* Phone Mockup */}
      <div className="relative h-[480px] w-full bg-surface-container-low flex items-center justify-center p-4">
        <div className="w-full h-full rounded-xl overflow-hidden border border-surface-bright relative shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url("${imageUrl}")` }}
            role="img"
            aria-label={name}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Demo Button Overlay */}
        <div className="absolute bottom-8 w-full px-8">
          <button className="w-full py-3 rounded-full bg-surface/80 backdrop-blur-md border border-champagne-gold/50 text-champagne-gold font-[family-name:var(--font-body)] text-xs font-semibold uppercase tracking-widest hover:bg-champagne-gold hover:text-deep-maroon transition-all">
            View Live Demo
          </button>
        </div>
      </div>

      {/* Label */}
      <div className="p-4 text-center bg-surface">
        <h3 className="font-[family-name:var(--font-heading)] text-body-lg text-ivory font-medium">
          {name}
        </h3>
      </div>
    </motion.article>
  );
}
