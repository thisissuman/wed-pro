"use client";

import { motion } from "framer-motion";
import { Eye, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createStarterWeddingData, makeDraftSlug } from "@/lib/invitations";
import { buildLoginUrl } from "@/lib/auth/redirects";
import type { Template } from "@/types";

interface TemplateCardProps {
  template: Template;
  index?: number;
}

export function TemplateCard({ template, index = 0 }: TemplateCardProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelect = async () => {
    if (isCreating) return;

    setErrorMessage(null);
    setIsCreating(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push(buildLoginUrl("/template"));
      setIsCreating(false);
      return;
    }

    const id = crypto.randomUUID();
    const slug = makeDraftSlug(template.id);
    const content = createStarterWeddingData({
      id,
      slug,
      templateId: template.id,
      userId: user.id,
    });

    const { error } = await supabase.from("invitations").insert({
      id,
      user_id: user.id,
      slug,
      template_id: template.id,
      status: "draft",
      content,
    });

    if (error) {
      setErrorMessage(error.message);
      setIsCreating(false);
      return;
    }

    router.push(`/dashboard/invitations/${id}/edit`);
    router.refresh();
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
          disabled={isCreating}
          icon={isCreating ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
        >
          {isCreating ? "Creating" : "Select"}
        </Button>
      </div>

      {errorMessage && (
        <p className="px-4 pb-4 text-xs leading-relaxed text-[#ffb4a8]">
          {errorMessage}
        </p>
      )}
    </motion.article>
  );
}
