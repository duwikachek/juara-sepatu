export default function Loading() {
  return (
    <main className="mx-auto max-w-7xl px-6 pb-24 pt-32">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-2xl bg-neutral-900" />
        <div className="space-y-4">
          <div className="h-6 w-24 animate-pulse rounded bg-neutral-900" />
          <div className="h-10 w-3/4 animate-pulse rounded bg-neutral-900" />
          <div className="h-8 w-40 animate-pulse rounded bg-neutral-900" />
          <div className="h-24 w-full animate-pulse rounded bg-neutral-900" />
          <div className="h-14 w-full animate-pulse rounded bg-neutral-900" />
        </div>
      </div>
    </main>
  );
}