"use client";

import { motion } from "framer-motion";
import { MessageCircle, ExternalLink } from "lucide-react";
import type { RSVPData } from "@/types/wedding.types";

interface RSVPSectionProps {
  rsvp: RSVPData;
}

/**
 * Royal Template — RSVP Section
 *
 * Call-to-action for confirming attendance via WhatsApp or link.
 */
export function RSVPSection({ rsvp }: RSVPSectionProps) {
  const whatsappUrl =
    rsvp.type === "whatsapp" && rsvp.whatsappNumber
      ? `https://wa.me/${rsvp.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(rsvp.message || "I would love to attend your wedding!")}`
      : null;

  return (
    <section className="px-6 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto text-center space-y-6"
      >
        <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.3em] text-champagne-gold/60">
          We Hope to See You
        </p>
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-ivory font-semibold">
          RSVP
        </h2>
        <p className="font-[family-name:var(--font-body)] text-sm text-on-surface-variant/80 leading-relaxed">
          Kindly confirm your presence. Your attendance would make our
          celebration truly complete.
        </p>

        {/* WhatsApp RSVP */}
        {whatsappUrl && (
          <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] text-white font-[family-name:var(--font-body)] text-sm font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(37,211,102,0.3)] transition-all duration-200"
          >
            <MessageCircle size={18} />
            {rsvp.buttonText || "Confirm via WhatsApp"}
          </motion.a>
        )}

        {/* Form or Link RSVP */}
        {rsvp.type === "form" && rsvp.formUrl && (
          <motion.a
            href={rsvp.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full gold-gradient text-deep-maroon font-[family-name:var(--font-body)] text-sm font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all duration-200"
          >
            <ExternalLink size={16} />
            Fill RSVP Form
          </motion.a>
        )}

        {rsvp.type === "link" && rsvp.formUrl && (
          <motion.a
            href={rsvp.formUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-champagne-gold/30 text-champagne-gold font-[family-name:var(--font-body)] text-sm font-medium hover:bg-champagne-gold/10 transition-colors duration-200"
          >
            <ExternalLink size={16} />
            Confirm Attendance
          </motion.a>
        )}
      </motion.div>
    </section>
  );
}
