"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function PlanPage() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [budget, setBudget] = useState("");
  const [travelers, setTravelers] = useState("1");
  const [departTime, setDepartTime] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!from.trim() || !to.trim()) {
      setError("Enter where you're starting and where you're headed.");
      return;
    }
    const params = new URLSearchParams({ from: from.trim(), to: to.trim() });
    if (budget.trim()) params.set("budget", budget.trim());
    if (travelers.trim()) params.set("travelers", travelers.trim());
    if (departTime.trim()) params.set("departTime", departTime.trim());
    router.push(`/results?${params.toString()}`);
  }

  return (
    <main className="flex flex-1 flex-col items-center px-6 py-12 md:py-20">
      <div className="mb-10 flex w-full max-w-lg items-center justify-between">
        <Link
          href="/"
          className="font-mono text-xs uppercase tracking-[0.15em] text-ink-soft transition hover:text-navy"
        >
          ← Back
        </Link>
        <span className="font-display text-lg font-bold text-navy">
          VOYAGE<span className="text-amber">AI</span>
        </span>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <TicketCard>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">
            Boarding pass
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold text-navy">
            Where are you headed?
          </h1>

          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Field label="From">
              <input
                type="text"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                placeholder="Current location"
                className="w-full border-b-2 border-navy/20 bg-transparent pb-2 font-mono text-lg text-navy outline-none transition focus:border-amber"
              />
            </Field>
            <Field label="To">
              <input
                type="text"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="Destination"
                className="w-full border-b-2 border-navy/20 bg-transparent pb-2 font-mono text-lg text-navy outline-none transition focus:border-amber"
              />
            </Field>
          </div>

          {error && (
            <p className="mt-4 font-sans text-sm text-red-700">{error}</p>
          )}

          <div className="my-8 border-t border-dashed border-navy/25" />

          <button
            type="button"
            onClick={() => setShowDetails((v) => !v)}
            className="flex w-full items-center justify-between font-sans text-sm font-medium text-navy"
          >
            Add trip details
            <span className="font-mono text-xs text-ink-soft">
              {showDetails ? "− optional" : "+ optional"}
            </span>
          </button>

          {showDetails && (
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-3">
              <Field label="Budget">
                <input
                  type="number"
                  min="0"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="No limit"
                  className="w-full border-b-2 border-navy/20 bg-transparent pb-2 font-mono text-base text-navy outline-none transition focus:border-amber"
                />
              </Field>
              <Field label="Travelers">
                <input
                  type="number"
                  min="1"
                  value={travelers}
                  onChange={(e) => setTravelers(e.target.value)}
                  className="w-full border-b-2 border-navy/20 bg-transparent pb-2 font-mono text-base text-navy outline-none transition focus:border-amber"
                />
              </Field>
              <Field label="Departs">
                <input
                  type="time"
                  value={departTime}
                  onChange={(e) => setDepartTime(e.target.value)}
                  className="w-full border-b-2 border-navy/20 bg-transparent pb-2 font-mono text-base text-navy outline-none transition focus:border-amber"
                />
              </Field>
            </div>
          )}
        </TicketCard>

        <button
          type="submit"
          className="mt-6 w-full rounded-sm bg-amber px-6 py-4 font-sans text-sm font-semibold text-navy transition hover:brightness-95"
        >
          Compare routes
        </button>
      </form>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-xs uppercase tracking-[0.15em] text-ink-soft">
        {label}
      </span>
      {children}
    </label>
  );
}

function TicketCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative rounded-md border border-navy/15 bg-paper-dim px-8 py-10 shadow-sm">
      <Notch side="left" />
      <Notch side="right" />
      {children}
    </div>
  );
}

function Notch({ side }: { side: "left" | "right" }) {
  return (
    <span
      aria-hidden
      className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full bg-paper ${
        side === "left" ? "-left-2.5" : "-right-2.5"
      }`}
    />
  );
}