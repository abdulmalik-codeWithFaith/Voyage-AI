import Link from "next/link";

const HERO_LINES = ["TRAVEL SMARTER.", "SPEND LESS.", "ARRIVE BETTER."];

function FlipLine({ text, lineDelay }: { text: string; lineDelay: number }) {
  return (
    <span className="block">
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="flip-letter"
          style={{ animationDelay: `${lineDelay + i * 0.02}s` }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
}

const FEATURES = [
  {
    label: "Compare",
    title: "Every route, side by side",
    body: "Walking, biking, motorcycle, bus, taxi, personal vehicle, train, and flight — time, cost, distance, and fuel, all in one board.",
  },
  {
    label: "Recommend",
    title: "One clear answer, explained",
    body: "Not just options. Voyage AI weighs your budget, group size, and departure time, then tells you which route wins and why.",
  },
  {
    label: "Navigate",
    title: "One tap into Google Maps",
    body: "Every recommendation comes with a live navigation link. No copying addresses, no second app.",
  },
];

export default function LandingPage() {
  return (
    <main className="flex-1">
      <nav className="flex items-center justify-between px-6 py-5 md:px-12">
        <span className="font-display text-xl font-bold tracking-wide text-navy">
          VOYAGE<span className="text-amber">AI</span>
        </span>
        <Link
          href="/plan"
          className="rounded-sm border border-navy px-4 py-2 font-sans text-sm font-medium text-navy transition hover:bg-navy hover:text-paper"
        >
          Plan a trip
        </Link>
      </nav>

      <section className="bg-navy text-paper">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2 md:items-center md:px-12 md:py-24">
          <div>
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-amber">
              Route comparison, decided for you
            </p>
            <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
              {HERO_LINES.map((line, i) => (
                <FlipLine key={line} text={line} lineDelay={i * 0.3} />
              ))}
            </h1>
            <p className="mt-6 max-w-md font-sans text-base text-paper/80">
              Enter where you are and where you&apos;re headed. Voyage AI
              compares every practical way to get there and tells you which
              one actually makes sense.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/plan"
                className="rounded-sm bg-amber px-6 py-3 font-sans text-sm font-semibold text-navy transition hover:brightness-95"
              >
                Start planning
              </Link>
              <span className="font-mono text-xs text-paper/60">
                No sign-up needed
              </span>
            </div>
          </div>

          <RouteLadder />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16 md:px-12 md:py-24">
        <div className="grid gap-8 md:grid-cols-3">
          {FEATURES.map((f, i) => (
            <div key={f.label} className="relative pl-6">
              <div
                aria-hidden
                className="absolute left-0 top-1 h-full w-px bg-navy/15"
              />
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">
                {f.label}
              </p>
              <h3 className="mt-2 font-display text-2xl font-bold text-navy">
                {f.title}
              </h3>
              <p className="mt-2 font-sans text-sm leading-relaxed text-ink-soft">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-navy/10 bg-paper-dim">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-16 text-center md:px-12">
          <h2 className="font-display text-3xl font-extrabold text-navy sm:text-4xl">
            Travel smarter. Spend less. Arrive better.
          </h2>
          <Link
            href="/plan"
            className="mt-2 rounded-sm bg-navy px-8 py-3 font-sans text-sm font-semibold text-paper transition hover:bg-navy-light"
          >
            Compare your route
          </Link>
        </div>
      </section>
    </main>
  );
}

function RouteLadder() {
  const stops = [
    { label: "Walk", cx: 40 },
    { label: "Bus", cx: 140 },
    { label: "Train", cx: 240 },
    { label: "Flight", cx: 340 },
  ];
  return (
    <svg
      viewBox="0 0 380 140"
      className="h-auto w-full max-w-md justify-self-center"
      role="img"
      aria-label="Diagram of a route with four transport stops connecting origin to destination"
    >
      <line
        x1="20"
        y1="70"
        x2="360"
        y2="70"
        stroke="#F2A93B"
        strokeWidth="2"
        strokeDasharray="6 6"
      />
      {stops.map((s) => (
        <g key={s.label}>
          <circle cx={s.cx} cy="70" r="7" fill="#F6F0E4" stroke="#F2A93B" strokeWidth="2" />
          <text
            x={s.cx}
            y="100"
            textAnchor="middle"
            fill="#F6F0E4"
            fontFamily="var(--font-mono)"
            fontSize="11"
            opacity="0.85"
          >
            {s.label}
          </text>
        </g>
      ))}
      <circle cx="20" cy="70" r="5" fill="#F6F0E4" />
      <circle cx="360" cy="70" r="5" fill="#F6F0E4" />
    </svg>
  );
}