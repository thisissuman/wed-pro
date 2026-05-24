import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-champagne-gold/70">
        Vivaha Studio
      </p>
      <h1 className="mt-4 font-heading text-5xl text-ivory md:text-6xl">404</h1>
      <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-on-surface-variant/80">
        This page could not be found. The link may be broken or the invitation may no longer be
        available.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center rounded-full border border-champagne-gold/30 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:border-champagne-gold/60 hover:bg-champagne-gold/10"
        >
          Go Home
        </Link>
        <Link
          href="/template"
          className="inline-flex min-h-11 items-center rounded-full bg-gradient-to-r from-champagne-gold to-[#B76E79] px-6 text-xs font-semibold uppercase tracking-[0.14em] text-deep-maroon transition hover:opacity-90"
        >
          Browse Templates
        </Link>
      </div>
    </main>
  );
}