export function formatEstPrice(est: {
  price: number;
  currency: string;
  priceUnit: string;
}): string {
  return `${est.price.toLocaleString("fr-FR")} ${est.currency} / ${est.priceUnit}`;
}

export function formatEstDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}