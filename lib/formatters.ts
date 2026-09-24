export function formatCurrency(value: number, currency = "FCFA"): string {
  return `${value.toLocaleString("fr-FR")} ${currency}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}