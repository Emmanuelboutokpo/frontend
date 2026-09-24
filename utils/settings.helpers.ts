import type { ServiceStatus } from "@/types/settings";

export const SERVICE_STATUS_STYLES: Record<
  ServiceStatus["status"],
  { label: string; className: string; dot: string }
> = {
  OPERATIONAL: {
    label: "Opérationnel",
    className: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  DEGRADED: {
    label: "Dégradé",
    className: "text-amber-700",
    dot: "bg-amber-500",
  },
  DOWN: {
    label: "Hors service",
    className: "text-rose-700",
    dot: "bg-rose-500",
  },
};