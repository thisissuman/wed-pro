import { DashboardShell } from "@/components/layout/DashboardShell";
import { HeroSection } from "@/features/dashboard/hero/HeroSection";
import { PremiumFeatures } from "@/features/dashboard/features/PremiumFeatures";
import { HowItWorks } from "@/features/dashboard/how-it-works/HowItWorks";
import { DigitalVsPhysical } from "@/features/dashboard/comparison/DigitalVsPhysical";
import { TestimonialSection } from "@/features/dashboard/testimonials/TestimonialSection";
import { FinalCTA } from "@/features/dashboard/cta/FinalCTA";
import { CinematicFooter } from "@/features/dashboard/footer/CinematicFooter";

/** Marketing homepage — safe to cache at the edge between deploys. */
export const revalidate = 3600;

export default function HomePage() {
  return (
    <DashboardShell>
      <main className="max-w-[1200px] mx-auto px-[var(--spacing-container-margin)] py-[var(--spacing-section-gap-md)] space-y-[var(--spacing-section-gap-lg)] pb-32">
        <HeroSection />

        <section id="features">
          <PremiumFeatures />
        </section>

        <section id="how-it-works">
          <HowItWorks />
        </section>

        <section id="comparison">
          <DigitalVsPhysical />
        </section>

        <section id="testimonials">
          <TestimonialSection />
        </section>

        <FinalCTA />
      </main>
      <CinematicFooter />
    </DashboardShell>
  );
}
