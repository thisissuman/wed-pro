"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { TemplateCard } from "@/features/dashboard/templates/TemplateCard";
import { CinematicFooter } from "@/features/dashboard/footer/CinematicFooter";
import { templates } from "@/data/templates";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

function TemplatePageContent() {
  const searchParams = useSearchParams();
  const recommendedFromQuery = searchParams.get("recommended");
  const recommendedId = useMemo(() => {
    if (recommendedFromQuery) return recommendedFromQuery;
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("recommendedTemplate");
    }
    return null;
  }, [recommendedFromQuery]);

  useEffect(() => {
    if (!recommendedId) return;
    const el = document.getElementById(`template-card-${recommendedId}`);
    if (el) {
      window.setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 400);
    }
  }, [recommendedId]);

  return (
    <div className="min-h-screen bg-background text-on-background selection:bg-champagne-gold/30">
      {/* Minimal Header for Template Page */}
      <header className="w-full px-[var(--spacing-container-margin)] py-4 flex items-center justify-start absolute top-0 left-0 z-50">
        <Link
          href="/"
          className="font-[family-name:var(--font-heading)] text-champagne-gold tracking-widest font-semibold text-lg md:text-headline-md"
        >
          Vivaha Studio
        </Link>
      </header>

      <main className="max-w-[1200px] w-full mx-auto px-[var(--spacing-container-margin)] pt-20 md:pt-24 pb-32 space-y-8">
        {/* Hero Section */}
        <section className="relative text-left space-y-3 pt-0 pb-2">
          {/* Ambient glow */}
          {/* Ambient glow - kept centered in background but subtle */}
          <div className="absolute top-0 left-0 w-[60vw] max-w-lg h-[200px] bg-champagne-gold/5 rounded-full blur-[100px] pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="inline-block font-[family-name:var(--font-body)] text-[9px] md:text-[10px] text-champagne-gold uppercase tracking-[0.3em] font-semibold bg-champagne-gold/5 border border-champagne-gold/15 px-3 py-1 rounded-full">
              Curated Collection
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-ivory font-semibold relative z-10 max-w-2xl leading-tight"
          >
            Choose Your <span className="text-champagne-gold">Invitation template</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="font-[family-name:var(--font-body)] text-xs md:text-sm text-on-surface-variant max-w-xl leading-relaxed"
          >
            Each template is crafted with cinematic precision to reflect the
            elegance and emotion of your royal celebration.
          </motion.p>
        </section>

        {/* Featured Collections — Template Grid */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="font-[family-name:var(--font-heading)] text-lg md:text-xl text-champagne-gold font-medium">
              Featured Collections
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 justify-items-center">
            {templates.map((template, i) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={i}
                recommended={recommendedId === template.id}
              />
            ))}
          </div>
        </section>

        {/* Bottom CTA */}
        <motion.section
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center py-12 px-6 rounded-3xl bg-surface-container border border-champagne-gold/20 relative overflow-hidden gold-aura"
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-champagne-gold/10 via-transparent to-transparent opacity-50" />

          <div className="relative z-10 space-y-5">
            <h2 className="font-[family-name:var(--font-heading)] text-headline-lg md:text-display-lg text-ivory font-bold">
              Looking for Something Custom?
            </h2>
            <p className="font-[family-name:var(--font-body)] text-body-md text-on-surface-variant max-w-lg mx-auto">
              Want a unique color palette, custom layout, or a completely bespoke design? Get in touch with our design team.
            </p>
            <Link
              href="mailto:hello@vivahastudio.com"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full gold-gradient text-charcoal-black font-[family-name:var(--font-body)] text-sm font-semibold tracking-wide hover:shadow-[0_0_25px_rgba(212,175,55,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              Request Custom Template
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.section>
      </main>
      <CinematicFooter />
    </div>
  );
}

export default function TemplatePage() {
  return (
    <Suspense fallback={null}>
      <TemplatePageContent />
    </Suspense>
  );
}
