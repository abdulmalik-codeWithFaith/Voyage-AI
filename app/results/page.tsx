import Link from "next/link";
import { generateComparison, formatHours } from "@/lib/travel";
import { ModeIcon } from "@/components/ModeIcon";
import { DownloadReportButton } from "@/components/DownloadReportButton";

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const from = params.from;
  const to = params.to;

  if (!from || !to) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-20 text-center">
        <p className="font-display text-2xl font-bold text-navy">
          No trip to compare yet
        </p>
        <p className="font-sans text-sm text-ink-soft">
          Start from the plan page to enter a route.
        </p>
        <Link
          href="/plan"
          className="rounded-sm bg-amber px-6 py-3 font-sans text-sm font-semibold text-navy"
        >
          Plan a trip
        </Link>
      </main>
    );
  }

  const trip = generateComparison({
    from,
    to,
    budget: params.budget,
    travelers: params.travelers,
    departTime: params.departTime,
  });

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12 md:py-16">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/plan"
          className="font-mono text-xs uppercase tracking-[0.15em] text-ink-soft transition hover:text-navy"
        >
          ← Edit trip
        </Link>
        <span className="font-display text-lg font-bold text-navy">
          VOYAGE<span className="text-amber">AI</span>
        </span>
      </div>

      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">
        {trip.from} → {trip.to} · {trip.distanceKm} km
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold text-navy">
        Every way to get there
      </h1>
      <p className="mt-1 font-sans text-sm text-ink-soft">
        {trip.travelers > 1 ? `For ${trip.travelers} travelers. ` : ""}
        Sorted by cost, cheapest first.
      </p>

      <div className="mt-8 divide-y divide-navy/10 border-y border-navy/10">
        {trip.modes.map((m) => (
          <div key={m.id} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3 sm:w-40 sm:shrink-0">
              <ModeIcon
                id={m.id}
                className={`h-6 w-6 shrink-0 ${m.available ? "text-teal" : "text-navy/25"}`}
              />
              <p className={`font-display text-lg font-bold ${m.available ? "text-navy" : "text-ink-soft"}`}>
                {m.label}
              </p>
            </div>

            {m.available ? (
              <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-sm text-navy">
                  <span>{formatHours(m.timeHours)}</span>
                  <span>${m.cost.toFixed(2)}</span>
                  {m.fuelCost !== undefined && (
                    <span className="text-ink-soft">
                      fuel ${m.fuelCost.toFixed(2)}
                    </span>
                  )}
                  <span className="text-ink-soft">{m.distanceKm} km</span>
                </div>
                <p className="max-w-sm font-sans text-xs text-ink-soft">
                  {m.advantage}
                </p>
                <a
                  href={m.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 rounded-sm border border-teal px-3 py-1.5 font-mono text-xs uppercase tracking-wide text-teal transition hover:bg-teal hover:text-paper"
                >
                  Navigate
                </a>
              </div>
            ) : (
              <p className="font-sans text-xs text-ink-soft">
                {m.unavailableReason}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8">
        <DownloadReportButton trip={trip} />
      </div>
    </main>
  );
}