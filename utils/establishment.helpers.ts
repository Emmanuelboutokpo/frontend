export function getEstablishmentDetailPath(
  categorySlug: string | undefined,
  subcategorySlug: string | undefined,
  establishmentSlug: string
): string {
  const categoryPath = categorySlug ?? "explorer";
  const subcategoryPath =
    categoryPath === "restaurant" || !subcategorySlug
      ? ""
      : `/${subcategorySlug}`;
  return `/${categoryPath}${subcategoryPath}/${establishmentSlug}`;
}

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