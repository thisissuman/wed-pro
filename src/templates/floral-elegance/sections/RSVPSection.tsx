"use client";

import { memo } from "react";
import { motion } from "framer-motion";
import { MessageCircle, ExternalLink } from "lucide-react";
import type { RsvpSectionContract } from "@/templates/shared/sections/types";
import { PREVIEW_SECTION_IDS } from "@/templates/shared/sections/preview-ids";

function RSVPSectionInner({ rsvp }: RsvpSectionContract) {
  const whatsappUrl =
    rsvp.type === "whatsapp" && rsvp.whatsappNumber
      ? `https://wa.me/${rsvp.whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(rsvp.message || "I would love to attend your wedding!")}`
      : null;

  return (
    <section id={PREVIEW_SECTION_IDS.rsvp} className="px-6 py-12 md:py-16 bg-transparent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="max-w-lg mx-auto text-center space-y-5"
      >
        <p className="font-[family-name:var(--font-body)] text-[10px] uppercase tracking-[0.35em] text-[var(--template-primary)] font-semibold">
          We Hope to See You
        </p>
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[var(--template-text)] font-bold">
          RSVP
        </h2>
        <p className="font-[family-name:var(--font-body)] text-sm text-[var(--template-text-muted)] leading-relaxed max-w-sm mx-auto font-light">
          Kindly confirm your presence. Your attendance would make our celebration truly complete.
        </p>

        <div className="pt-3">
          {whatsappUrl && (
            <motion.a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center gap-2.5 px-8 py-3.5 rounded-full bg-[#25D366] text-white font-[family-name:var(--font-body)] text-sm font-semibold tracking-wide hover:shadow-[0_0_20px_rgba(37,211,102,0.25)] transition-[transform,shadow] duration-200 cursor-pointer"
            >
              <MessageCircle size={18} />
              {rsvp.buttonText || "Confirm via WhatsApp"}
            </motion.a>
          )}

          {rsvp.type === "link" && rsvp.formUrl && (
            <motion.a
              href={rsvp.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex min-h-[44px] min-w-[44px] touch-manipulation items-center justify-center gap-2 px-8 py-3.5 rounded-full border border-[var(--template-primary)]/30 text-[var(--template-primary)] font-[family-name:var(--font-body)] text-sm font-semibold hover:bg-[var(--template-primary)]/10 transition-[transform,background-color] duration-200 cursor-pointer shadow-sm bg-[var(--template-surface)]"
            >
              <ExternalLink size={16} />
              {rsvp.buttonText || "Confirm Attendance"}
            </motion.a>
          )}
        </div>
      </motion.div>
    </section>
  );
}

export const RSVPSection = memo(RSVPSectionInner);
