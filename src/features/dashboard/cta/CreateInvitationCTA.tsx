"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export function CreateInvitationCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.97 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="text-center py-12 px-6 rounded-3xl bg-surface-container border border-champagne-gold/20 relative overflow-hidden gold-aura"
    >
      {/* Radial Glow Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-champagne-gold/10 via-transparent to-transparent opacity-50" />

      {/* Content */}
      <div className="relative z-10 space-y-6">
        <h2 className="font-[family-name:var(--font-heading)] text-headline-lg md:text-display-lg text-ivory font-bold">
          Your Story, Artfully Crafted.
        </h2>
        <p className="font-[family-name:var(--font-body)] text-body-lg text-on-surface-variant max-w-2xl mx-auto">
          Transform your wedding details into a cinematic digital experience in
          minutes.
        </p>
        <Button className="px-8 py-4 text-body-lg">
          Create My Invitation
        </Button>
      </div>
    </motion.section>
  );
}
