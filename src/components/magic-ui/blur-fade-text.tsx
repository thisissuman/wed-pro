"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface BlurFadeTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export function BlurFadeText({ text, className, delay = 0 }: BlurFadeTextProps) {
  const words = text.trim().split(/\s+/);
  let charOffset = 0;

  return (
    <span className={className} aria-label={text}>
      {words.map((word, wordIndex) => (
        <span key={`${word}-${wordIndex}`} className="inline-block whitespace-nowrap">
          {wordIndex > 0 ? (
            <motion.span
              aria-hidden
              initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
              animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              transition={{
                duration: 0.45,
                delay: delay + charOffset++ * 0.03,
                ease: "easeOut",
              }}
              className="inline-block"
            >
              {"\u00A0"}
            </motion.span>
          ) : null}
          {word.split("").map((char, index) => {
            const globalIndex = charOffset++;
            return (
              <motion.span
                key={`${word}-${index}`}
                initial={{ opacity: 0, filter: "blur(8px)", y: 8 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: delay + globalIndex * 0.03,
                  ease: "easeOut",
                }}
                className="inline-block"
              >
                {char}
              </motion.span>
            );
          })}
        </span>
      ))}
    </span>
  );
}

interface BlurFadeProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function BlurFade({ children, className, delay = 0 }: BlurFadeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(6px)", y: 12 }}
      animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      transition={{ duration: 0.55, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
