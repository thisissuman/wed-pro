"use client";

import { motion } from "framer-motion";
import {
  Users,
  Edit3,
  MousePointer2,
  Timer,
  Mail,
  Music,
  MapPin,
  Wand2,
  ImagePlus,
} from "lucide-react";
import { features } from "@/data/features";

const iconMap: Record<
  string,
  React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>
> = {
  Users,
  Edit3,
  MousePointer2,
  Timer,
  Mail,
  Music,
  MapPin,
  Wand2,
  ImagePlus,
};

export function PremiumFeatures() {
  return (
    <section className="space-y-12">
      {/* Header */}
      <div className="text-center">
        <span className="font-label-sm text-label-sm text-champagne-gold uppercase tracking-[0.2em] block mb-4">
          Everything You Need
        </span>
        <h2 className="font-[family-name:var(--font-heading)] text-headline-lg md:text-display-lg text-ivory mb-6 font-semibold leading-tight">
          Free Beta Features
        </h2>
        <p className="font-[family-name:var(--font-body)] text-body-lg text-on-surface-variant max-w-2xl mx-auto mb-8">
          Enjoy unrestricted access to our entire premium invitation suite during our free beta phase. Perfect your announcement with absolutely no limitations or hidden fees.
        </p>
        <div className="h-[1px] w-24 bg-champagne-gold/30 mx-auto mb-8"></div>
        <p className="font-[family-name:var(--font-body)] text-body-md text-on-surface-variant/70 max-w-3xl mx-auto italic">
          Publish, update, unpublish, and share your invitation freely while we
          polish the studio for real couples.
        </p>
      </div>

      {/* Feature Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, i) => {
          const Icon = iconMap[feature.icon];
          return (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.5, 0, 0, 1] }}
              className="bg-surface/40 border border-champagne-gold/10 rounded-xl p-4 flex items-center gap-4 group hover:shadow-[0_0_40px_rgba(212,175,55,0.08)] hover:border-champagne-gold/30 transition-all duration-300"
            >
              <div className="flex-shrink-0 w-10 h-10 rounded-full border border-champagne-gold/20 flex items-center justify-center bg-background group-hover:border-champagne-gold/50 transition-colors">
                {Icon && (
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="text-champagne-gold transition-transform group-hover:scale-110 duration-300"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-[family-name:var(--font-body)] text-sm font-medium text-ivory truncate">
                    {feature.label}
                  </h3>
                  {feature.badge && (
                    <span className="px-1.5 py-0.5 rounded-full bg-champagne-gold/10 text-champagne-gold text-[8px] font-bold uppercase tracking-wider shrink-0">
                      {feature.badge}
                    </span>
                  )}
                </div>
                <p className="font-[family-name:var(--font-body)] text-[12px] text-on-surface-variant/70 leading-tight truncate mt-0.5">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
