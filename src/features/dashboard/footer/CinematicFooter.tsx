import Link from "next/link";

export function CinematicFooter() {
  return (
    <footer className="bg-surface-container-lowest border-t border-champagne-gold/20 pt-16 pb-24 md:pb-12 px-[var(--spacing-container-margin)] mt-12 relative z-40">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-center md:text-left">
        <div className="space-y-4 col-span-1 md:col-span-2">
          <div className="font-[family-name:var(--font-heading)] text-headline-lg text-champagne-gold tracking-widest font-semibold">
            Vivaha Studio
          </div>
          <p className="font-[family-name:var(--font-body)] text-on-surface-variant max-w-sm mx-auto md:mx-0">
            Crafting cinematic digital invitations for royal celebrations.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="font-[family-name:var(--font-heading)] text-ivory text-lg border-b border-champagne-gold/20 pb-2 inline-block font-medium">
            Explore
          </h4>
          <ul className="space-y-2 font-[family-name:var(--font-body)] text-sm font-medium tracking-wide">
            <li>
              <Link
                className="text-on-surface-variant hover:text-champagne-gold transition-colors"
                href="/template"
              >
                Templates
              </Link>
            </li>
            <li>
              <Link
                className="text-on-surface-variant hover:text-champagne-gold transition-colors"
                href="/#features"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                className="text-on-surface-variant hover:text-champagne-gold transition-colors"
                href="/#testimonials"
              >
                Stories
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="font-[family-name:var(--font-heading)] text-ivory text-lg border-b border-champagne-gold/20 pb-2 inline-block font-medium">
            Support
          </h4>
          <ul className="space-y-2 font-[family-name:var(--font-body)] text-sm font-medium tracking-wide">
            <li>
              <a
                className="text-on-surface-variant hover:text-champagne-gold transition-colors"
                href="mailto:sumanmaharana222888@gmail.com"
              >
                Contact us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto border-t border-champagne-gold/10 pt-8">
        <p className="font-[family-name:var(--font-body)] text-xs font-semibold text-on-surface-variant uppercase tracking-widest text-center md:text-left">
          © 2026 Vivaha Studio. Crafted for Royal Celebrations.
        </p>
      </div>
    </footer>
  );
}
