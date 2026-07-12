"use client";

import type { TripResult } from "@/lib/travel";
import { formatHours } from "@/lib/travel";

export function DownloadReportButton({ trip }: { trip: TripResult }) {
  function handleDownload() {
    const lines: string[] = [];
    lines.push("VOYAGE AI — TRAVEL REPORT");
    lines.push("==========================");
    lines.push(`From: ${trip.from}`);
    lines.push(`To: ${trip.to}`);
    lines.push(`Distance: ${trip.distanceKm} km (estimated)`);
    lines.push(`Travelers: ${trip.travelers}`);
    if (trip.budget !== null) lines.push(`Budget: $${trip.budget}`);
    if (trip.departTime) lines.push(`Departure time: ${trip.departTime}`);
    lines.push("");
    lines.push("ALL OPTIONS (sorted by cost)");
    lines.push("-----------------------------");
    for (const m of trip.modes) {
      if (!m.available) {
        lines.push(`${m.label}: not available — ${m.unavailableReason}`);
        continue;
      }
      lines.push(
        `${m.label}: ${formatHours(m.timeHours)}, $${m.cost.toFixed(2)}${
          m.fuelCost ? ` (fuel: $${m.fuelCost.toFixed(2)})` : ""
        }, ${m.distanceKm} km — ${m.advantage}`
      );
      lines.push(`  Navigate: ${m.mapsUrl}`);
    }

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `voyage-ai-report-${trip.from}-to-${trip.to}.txt`.replace(/\s+/g, "-");
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleDownload}
      className="w-full rounded-sm border border-navy px-6 py-3 text-white bg-black font-sans text-sm font-semibold text-navy transition hover:bg-navy hover:text-paper sm:w-auto"
    >
      Download travel report
    </button>
  );
}