export type ModeId =
  | "walk"
  | "bike"
  | "motorcycle"
  | "bus"
  | "taxi"
  | "personal_vehicle"
  | "train"
  | "flight";

export type ModeResult = {
  id: ModeId;
  label: string;
  available: boolean;
  unavailableReason?: string;
  timeHours: number;
  cost: number;
  fuelCost?: number;
  distanceKm: number;
  advantage: string;
  mapsUrl: string;
};

export type TripResult = {
  from: string;
  to: string;
  distanceKm: number;
  travelers: number;
  budget: number | null;
  departTime: string | null;
  modes: ModeResult[];
};

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h % 1000) / 1000;
}

function isRushHour(departTime: string | null): boolean {
  if (!departTime) return false;
  const hour = parseInt(departTime.split(":")[0], 10);
  return (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19);
}

function mapsUrl(mode: ModeId, from: string, to: string): string {
  const origin = encodeURIComponent(from);
  const destination = encodeURIComponent(to);
  const travelmode =
    mode === "walk"
      ? "walking"
      : mode === "bike"
        ? "bicycling"
        : mode === "bus" || mode === "train"
          ? "transit"
          : "driving";
  if (mode === "flight") {
    return `https://www.google.com/travel/flights?q=Flights%20to%20${destination}%20from%20${origin}`;
  }
  return `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=${travelmode}`;
}

type ModeConfig = {
  label: string;
  minDist: number;
  maxDist: number;
  speedKmh: number;
  fixedCost: number;
  perKmCost: number;
  perPerson: boolean;
  capacity?: number;
  fuelEfficiencyKmPerL?: number;
  fuelPricePerL?: number;
  advantage: string;
  rushSensitive: boolean;
};

const CONFIG: Record<ModeId, ModeConfig> = {
  walk: {
    label: "Walk",
    minDist: 0,
    maxDist: 8,
    speedKmh: 5,
    fixedCost: 0,
    perKmCost: 0,
    perPerson: true,
    advantage: "Free, zero emissions, no planning needed.",
    rushSensitive: false,
  },
  bike: {
    label: "Bike",
    minDist: 0,
    maxDist: 25,
    speedKmh: 15,
    fixedCost: 0,
    perKmCost: 0,
    perPerson: true,
    advantage: "No fuel cost and skips short-distance traffic.",
    rushSensitive: false,
  },
  motorcycle: {
    label: "Motorcycle",
    minDist: 0,
    maxDist: 400,
    speedKmh: 45,
    fixedCost: 0,
    perKmCost: 0,
    perPerson: true,
    capacity: 2,
    fuelEfficiencyKmPerL: 30,
    fuelPricePerL: 0.95,
    advantage: "Cuts through traffic, cheap on fuel.",
    rushSensitive: true,
  },
  bus: {
    label: "Bus",
    minDist: 2,
    maxDist: 900,
    speedKmh: 40,
    fixedCost: 2,
    perKmCost: 0.03,
    perPerson: true,
    advantage: "The cheapest option for medium and long distances.",
    rushSensitive: true,
  },
  taxi: {
    label: "Taxi",
    minDist: 0,
    maxDist: 150,
    speedKmh: 35,
    fixedCost: 2,
    perKmCost: 0.9,
    perPerson: false,
    capacity: 4,
    advantage: "Door-to-door with no navigating required.",
    rushSensitive: true,
  },
  personal_vehicle: {
    label: "Personal vehicle",
    minDist: 0,
    maxDist: 1200,
    speedKmh: 55,
    fixedCost: 0,
    perKmCost: 0.05,
    perPerson: false,
    capacity: 5,
    fuelEfficiencyKmPerL: 12,
    fuelPricePerL: 0.95,
    advantage: "Most flexible — your own schedule and stops.",
    rushSensitive: true,
  },
  train: {
    label: "Train",
    minDist: 15,
    maxDist: 1500,
    speedKmh: 80,
    fixedCost: 5,
    perKmCost: 0.08,
    perPerson: true,
    advantage: "Reliable schedule that skips road traffic entirely.",
    rushSensitive: false,
  },
  flight: {
    label: "Flight",
    minDist: 300,
    maxDist: 15000,
    speedKmh: 700,
    fixedCost: 60,
    perKmCost: 0.12,
    perPerson: true,
    advantage: "By far the fastest option over long distances.",
    rushSensitive: false,
  },
};

export function generateComparison(params: {
  from: string;
  to: string;
  budget?: string | null;
  travelers?: string | null;
  departTime?: string | null;
}): TripResult {
  const { from, to } = params;
  const travelers = Math.max(1, parseInt(params.travelers || "1", 10) || 1);
  const budget = params.budget ? parseFloat(params.budget) : null;
  const departTime = params.departTime || null;

  const seed = hashString(`${from.toLowerCase()}>${to.toLowerCase()}`);
  const distanceKm =
    from.trim().toLowerCase() === to.trim().toLowerCase()
      ? 1
      : Math.round(8 + seed * 640);

  const rush = isRushHour(departTime);

  const modes: ModeResult[] = (Object.keys(CONFIG) as ModeId[]).map((id) => {
    const cfg = CONFIG[id];
    const available = distanceKm >= cfg.minDist && distanceKm <= cfg.maxDist;
    if (!available) {
      return {
        id,
        label: cfg.label,
        available: false,
        unavailableReason:
          distanceKm < cfg.minDist
            ? "Too far to be practical at this distance."
            : "Not practical over this distance.",
        timeHours: 0,
        cost: 0,
        distanceKm,
        advantage: cfg.advantage,
        mapsUrl: mapsUrl(id, from, to),
      };
    }

    const speed = cfg.rushSensitive && rush ? cfg.speedKmh * 0.65 : cfg.speedKmh;
    const overhead = id === "flight" ? 2.5 : id === "train" ? 0.4 : 0;
    const timeHours = distanceKm / speed + overhead;

    const baseCost = cfg.fixedCost + cfg.perKmCost * distanceKm;
    let cost: number;
    if (cfg.perPerson) {
      cost = baseCost * travelers;
    } else {
      const vehicles = Math.ceil(travelers / (cfg.capacity || 1));
      cost = baseCost * vehicles;
    }

    let fuelCost: number | undefined;
    if (cfg.fuelEfficiencyKmPerL && cfg.fuelPricePerL) {
      fuelCost = (distanceKm / cfg.fuelEfficiencyKmPerL) * cfg.fuelPricePerL;
    }

    return {
      id,
      label: cfg.label,
      available: true,
      timeHours: Math.round(timeHours * 10) / 10,
      cost: Math.round(cost * 100) / 100,
      fuelCost: fuelCost ? Math.round(fuelCost * 100) / 100 : undefined,
      distanceKm,
      advantage: cfg.advantage,
      mapsUrl: mapsUrl(id, from, to),
    };
  });

  modes.sort((a, b) => {
    if (a.available !== b.available) return a.available ? -1 : 1;
    return a.cost - b.cost;
  });

  return {
    from,
    to,
    distanceKm,
    travelers,
    budget,
    departTime,
    modes,
  };
}

export function formatHours(hours: number): string {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h} hr`;
  return `${h} hr ${m} min`;
}