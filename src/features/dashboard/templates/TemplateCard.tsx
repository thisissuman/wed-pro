"use client";

import { motion } from "framer-motion";
import { Eye, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import type { Template } from "@/types";

interface TemplateCardProps {
  template: Template;
  index?: number;
}

export function TemplateCard({ template, index = 0 }: TemplateCardProps) {
  const router = useRouter();

  const handleSelect = async () => {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/login?next=/dashboard");
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      className="w-full max-w-[340px] md:max-w-[360px] bg-surface rounded-2xl overflow-hidden border border-champagne-gold/10 gold-aura gold-aura-hover transition-all duration-300 group flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-[400px] w-full overflow-hidden bg-surface-container">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
          style={{ backgroundImage: `url("${template.imageUrl}")` }}
          role="img"
          aria-label={template.name}
        />

        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-black via-charcoal-black/50 to-transparent" />

        {/* Badge */}
        {template.badge && (
          <div className="absolute top-4 left-4 bg-deep-maroon/80 backdrop-blur-md px-3 py-1 rounded-full border border-champagne-gold/30">
            <span className="font-[family-name:var(--font-body)] text-[10px] text-ivory uppercase tracking-widest font-semibold">
              {template.badge}
            </span>
          </div>
        )}

        {/* Title & Description */}
        <div className="absolute bottom-4 left-4 right-4 z-10">
          <h3 className="font-[family-name:var(--font-heading)] text-headline-lg-mobile text-ivory mb-1 font-semibold">
            {template.name}
          </h3>
          <p className="font-[family-name:var(--font-body)] text-body-md text-on-surface-variant line-clamp-2">
            {template.description}
          </p>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 flex gap-3 mt-auto bg-surface">
        <Button
          variant="ghost"
          icon={<Eye size={18} />}
          className="flex-1"
          onClick={() => router.push(`/preview/${template.id}`)}
        >
          Preview
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          onClick={handleSelect}
          icon={<ArrowRight size={16} />}
        >
          Select
        </Button>
      </div>
    </motion.article>
  );
}
