export default function DashboardLoading() {
  return (
    <main className="max-w-[980px] mx-auto px-[var(--spacing-container-margin)] pt-8 md:pt-14 pb-32 min-h-screen animate-pulse">
      <div className="mb-9 space-y-4">
        <div className="h-6 w-40 rounded-full bg-surface-container-high" />
        <div className="h-10 w-72 max-w-full rounded-xl bg-surface-container-high" />
        <div className="h-4 w-96 max-w-full rounded-lg bg-surface-container" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-48 rounded-2xl bg-surface-container-high" />
        <div className="h-48 rounded-2xl bg-surface-container-high" />
      </div>
    </main>
  );
}
