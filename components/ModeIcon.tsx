import type { ModeId } from "@/lib/travel";

const PATHS: Record<ModeId, string> = {
  walk: "M13 4a2 2 0 1 1-2 2 2 2 0 0 1 2-2zM10 8l3 2 2 5-1 5M9 15l-2 5M13 10l3 1 3-2",
  bike: "M6 17a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm12 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 17l4-9h4l2 9M10 8h5",
  motorcycle: "M5 17a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zm14 0a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM7.5 14.5l3-6h4l4.5 6M10.5 8.5h5",
  bus: "M4 7h16v9a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7zM4 12h16M7 17v2M17 17v2M7 10h3M14 10h3",
  taxi: "M5 16l1.5-5a2 2 0 0 1 2-1.5h7a2 2 0 0 1 2 1.5l1.5 5M5 16a1.5 1.5 0 1 0 3 0M16 16a1.5 1.5 0 1 0 3 0M5 16h14M9 9V7h6v2",
  personal_vehicle: "M4 16l1.2-5.2A2 2 0 0 1 7.1 9.3h9.8a2 2 0 0 1 1.9 1.5L20 16M4 16a1.5 1.5 0 1 0 3 0M17 16a1.5 1.5 0 1 0 3 0M4 16h16M8 9.3l1-2.3h6l1 2.3",
  train: "M6 4h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zM4 17l-2 3M20 17l2 3M8 4v13M16 4v13M4 10h16",
  flight: "M10.5 3.5L12 2l1.5 1.5L12 8l7 4.5v2L12 12l-1 6 2 1.5v1.5l-2.5-1-2.5 1v-1.5l2-1.5-1-6-7 2.5v-2L9 8l-1.5-4.5z",
};

export function ModeIcon({ id, className }: { id: ModeId; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={PATHS[id]} />
    </svg>
  );
}