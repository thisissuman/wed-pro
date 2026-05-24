import Link from "next/link";

export default function InvitationNotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-6 text-center">
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-champagne-gold/70">
        Invitation Not Found
      </p>
      <h1 className="mt-4 font-heading text-3xl text-ivory md:text-4xl">
        This celebration isn&apos;t available
      </h1>
      <p className="mt-3 max-w-md font-body text-sm leading-relaxed text-on-surface-variant/80">
        The invitation may be unpublished, the link may have changed, or it may not exist yet.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center rounded-full border border-champagne-gold/30 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-champagne-gold transition hover:border-champagne-gold/60 hover:bg-champagne-gold/10"
      >
        Back to Vivaha Studio
      </Link>
    </main>
  );
}
