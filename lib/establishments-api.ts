import type {
  Amenity,
  Category,
  Country,
  EntityId,
  Establishment,
  Photo,
  PropertyData,
  Review,
  SubCategory,
} from "@/types/types";

const API_URL = (
  process.env.NEXT_PUBLIC_API_URL ?? "https://bestreservs-api.onrender.com"
).replace(/\/+$/, "");

const ESTABLISHMENTS_PATH = "/establishments";

type ApiRecord = Record<string, unknown>;

function isRecord(value: unknown): value is ApiRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function firstValue(...values: unknown[]): unknown {
  return values.find((value) => value !== undefined && value !== null);
}

function firstPopulatedValue(...values: unknown[]): unknown {
  return values.find(
    (value) => value !== undefined && value !== null && (!Array.isArray(value) || value.length > 0)
  );
}

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback = 0): number {
  const number = typeof value === "number" ? value : Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function asId(value: unknown, fallback: EntityId = 0): EntityId {
  if (typeof value === "number" && Number.isFinite(value)) return value;

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return fallback;

    const numeric = Number(trimmed);
    return Number.isFinite(numeric) ? numeric : trimmed;
  }

  if (typeof value === "bigint") return Number(value);
  return fallback;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function idFrom(value: unknown): EntityId | undefined {
  const rawId = isRecord(value) ? value.id : value;
  if (typeof rawId !== "number" && typeof rawId !== "string" && typeof rawId !== "bigint") {
    return undefined;
  }
  const id = asId(rawId, "");
  return id === "" ? undefined : id;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function getCategoryId(value: unknown, data: PropertyData): EntityId {
  const id = idFrom(value);
  if (isRecord(value) && id !== undefined) return id;
  const name = isRecord(value)
    ? asString(firstValue(value.name, value.slug))
    : asString(value);
  const slug = slugify(name);
  const category = data.Categories.find(
    (item) =>
      item.slug === slug ||
      item.name.toLowerCase() === name.toLowerCase() ||
      slug.includes(item.slug)
  );
  return category?.id ?? id ?? 1;
}

function getSubcategoryId(value: unknown, categoryId: EntityId, data: PropertyData): EntityId | null {
  if (value === undefined || value === null || value === "") return null;
  const id = idFrom(value);
  if (isRecord(value) && id !== undefined) return id;
  const name = isRecord(value)
    ? asString(firstValue(value.name, value.slug))
    : asString(value);
  const subcategory = data.SubCategories.find(
    (item) =>
      item.category_id === categoryId &&
      (item.slug === slugify(name) ||
        item.name.toLowerCase() === name.toLowerCase())
  );
  return subcategory?.id ?? id ?? null;
}

function getIds(value: unknown): EntityId[] {
  return asArray(value)
    .map(idFrom)
    .filter((id): id is EntityId => id !== undefined);
}

export function normalizeApiCategory(value: unknown): Category | undefined {
  if (!isRecord(value)) return undefined;
  const id = idFrom(value);
  const name = asString(value.name);
  if (id === undefined || !name) return undefined;
  const slug = slugify(asString(firstValue(value.slug, name)));
  return {
    id,
    name,
    slug,
    icon: asString(value.icon, "building"),
    has_subcategories: Boolean(value.has_subcategories),
    description: asString(value.description),
  };
}

export function normalizeApiSubCategory(value: unknown): SubCategory | undefined {
  if (!isRecord(value)) return undefined;
  const id = idFrom(value);
  const categoryId = idFrom(value.category_id);
  const name = asString(value.name);
  if (id === undefined || !name || categoryId === undefined) return undefined;
  return {
    id,
    category_id: categoryId,
    name,
    slug: slugify(asString(firstValue(value.slug, name))),
    icon: asString(value.icon, "building"),
  };
}

export function normalizeApiAmenity(value: unknown): Amenity | undefined {
  if (!isRecord(value)) return undefined;
  const id = idFrom(value);
  const name = asString(value.name);
  if (id === undefined || !name) return undefined;
  return {
    id,
    name,
    slug: slugify(asString(firstValue(value.slug, name))),
    icon: asString(value.icon, "check"),
  };
}

export function normalizeApiCountry(value: unknown): Country | undefined {
  if (!isRecord(value) || asString(value.type).toUpperCase() !== "COUNTRY") {
    return undefined;
  }
  const id = idFrom(value);
  const name = asString(value.name);
  if (id === undefined || !name) return undefined;
  return {
    id,
    name,
    iso_code: asString(value.country_code),
    lat: asNumber(firstValue(value.latitude, value.lat)),
    lng: asNumber(firstValue(value.longitude, value.lng)),
  };
}

function getStatus(value: unknown): Establishment["status"] {
  const status = asString(value, "APPROVED").toUpperCase();
  if (status === "PENDING" || status === "EN_ATTENTE") return "PENDING";
  if (status === "REJECTED" || status === "REJETE") return "REJECTED";
  return "APPROVED";
}

export function normalizeEstablishment(value: unknown, data: PropertyData): Establishment {
  if (!isRecord(value)) {
    throw new Error("L’API a renvoyé un établissement invalide.");
  }

  const id = idFrom(firstValue(value.id, value.establishment_id));
  if (id === undefined) {
    throw new Error("L’API a renvoyé un établissement sans identifiant valide.");
  }

  const location = isRecord(value.location) ? value.location : {};
  const categoryValue = firstValue(value.category, value.category_id);
  const categoryId = getCategoryId(categoryValue, data);
  const category = normalizeApiCategory(value.category);
  const subcategoryId = getSubcategoryId(
    firstValue(value.subcategory, value.subcategory_id),
    categoryId,
    data
  );
  const subcategory = normalizeApiSubCategory(value.subcategory);
  const price = asNumber(firstValue(value.price, value.price_amount, value.starting_price), 0);
  const priceUnit = asString(firstValue(value.price_unit, value.priceUnit)).toLowerCase();
  const pricePerNight = firstValue(
    value.price_per_night,
    priceUnit.includes("night") || priceUnit.includes("nuit")
      ? price
      : priceUnit
        ? undefined
        : price
  );
  const pricePerMonth = firstValue(value.price_per_month, priceUnit.includes("month") || priceUnit.includes("mois") ? price : undefined);

  const amenities = firstPopulatedValue(value.amenity_ids, value.amenities);
  const reviews = firstPopulatedValue(value.reviews, value.latest_reviews);
  const reviewIds = getIds(firstValue(value.review_ids, reviews));
  const locationCountryId = asString(location.type).toUpperCase() === "COUNTRY"
    ? idFrom(location)
    : undefined;

  return {
    id,
    category_id: categoryId,
    subcategory_id: subcategoryId,
    category,
    subcategory,
    owner_id: idFrom(firstValue(value.owner_id, isRecord(value.owner) ? value.owner.id : undefined)) ?? 0,
    tenant_id: idFrom(value.tenant_id) ?? null,
    name: asString(value.name, "Établissement"),
    slug: asString(value.slug, String(id)),
    description: asString(value.description),
    address: asString(firstValue(value.address, location.address, location.full_address, isRecord(location.city) ? location.city.name : location.city, typeof value.location === "string" ? value.location : undefined, value.city)),
    location_id: idFrom(value.location_id) ?? idFrom(location) ?? 0,
    location_name: asString(location.name),
    country_id: idFrom(firstValue(value.country_id, isRecord(value.country) ? value.country.id : undefined, isRecord(location.country) ? location.country.id : undefined)) ?? locationCountryId ?? 0,
    department_id: idFrom(firstValue(value.department_id, isRecord(value.department) ? value.department.id : undefined)) ?? 0,
    commune_id: idFrom(firstValue(value.commune_id, isRecord(value.commune) ? value.commune.id : undefined)) ?? 0,
    district_id: idFrom(firstValue(value.district_id, isRecord(value.district) ? value.district.id : undefined)) ?? 0,
    locality_id: idFrom(firstValue(value.locality_id, isRecord(value.locality) ? value.locality.id : undefined)) ?? 0,
    lat: asNumber(firstValue(value.lat, value.latitude, location.lat, location.latitude), 0),
    lng: asNumber(firstValue(value.lng, value.longitude, location.lng, location.longitude), 0),
    status: getStatus(value.status),
    availability_status: asString(value.availability_status).toUpperCase() === "UNAVAILABLE"
      ? "UNAVAILABLE"
      : asString(value.availability_status).toUpperCase() === "RENTED"
        ? "RENTED"
        : "AVAILABLE",
    price,
    price_unit: asString(firstValue(value.price_unit, value.priceUnit)) || undefined,
    price_per_night: pricePerNight == null ? null : asNumber(pricePerNight),
    price_per_month: pricePerMonth == null ? null : asNumber(pricePerMonth),
    currency: asString(value.currency, "XOF"),
    owner: isRecord(value.owner)
      ? {
          first_name: asString(value.owner.first_name),
          last_name: asString(value.owner.last_name),
          avatar_url: typeof value.owner.avatar_url === "string" ? value.owner.avatar_url : null,
        }
      : null,
    payment_conditions: asArray(value.payment_conditions).flatMap((condition) => {
      if (!isRecord(condition)) return [];
      const conditionId = idFrom(condition);
      const name = asString(condition.name);
      return conditionId !== undefined && name ? [{ id: conditionId, name }] : [];
    }),
    bedrooms: asNumber(value.bedrooms),
    rooms_count: asNumber(value.rooms_count),
    bathrooms: asNumber(value.bathrooms),
    beds: asNumber(value.beds),
    bed_type: typeof value.bed_type === "string" ? value.bed_type : null,
    area: asNumber(firstValue(value.area, value.area_m2)),
    max_guests: asNumber(firstValue(value.max_guests, value.capacity, value.max_capacity)),
    rating: asNumber(firstValue(value.rating, value.average_rating)),
    ratings_detail: {
      accuracy: 0,
      cleanliness: 0,
      checkin: 0,
      communication: 0,
      location: 0,
      value: 0,
    },
    published_at: asString(firstValue(value.published_at, value.created_at)),
    updated_at: asString(value.updated_at),
    amenity_ids: getIds(amenities),
    payment_condition_ids: getIds(firstValue(value.payment_condition_ids, value.payment_conditions)),
    photo_ids: getIds(value.photo_ids),
    video_ids: getIds(value.video_ids),
    review_ids: reviewIds,
    review_count: asNumber(firstValue(value.review_count, value.reviews_count, value.total_reviews, reviewIds.length)),
    cuisine_type: typeof value.cuisine_type === "string" ? value.cuisine_type : undefined,
    opening_hours: typeof value.opening_hours === "string" || isRecord(value.opening_hours)
      ? value.opening_hours
      : undefined,
    phone: typeof value.phone === "string" ? value.phone : null,
  };
}

export function unwrapApiValue(body: unknown): unknown {
  let value = body;
  for (let depth = 0; depth < 3 && isRecord(value); depth += 1) {
    const nested = firstValue(value.data, value.result, value.establishment);
    if (nested === undefined || nested === value) break;
    value = nested;
  }
  return value;
}

export function normalizeEstablishmentResponse(body: unknown, data: PropertyData): Establishment {
  return normalizeEstablishment(unwrapApiValue(body), data);
}

export function normalizeEstablishmentList(body: unknown, data: PropertyData): Establishment[] {
  let value = unwrapApiValue(body);
  if (isRecord(value)) {
    value = firstValue(value.items, value.results, value.establishments, value.data);
  }
  if (!Array.isArray(value)) {
    throw new Error("L’API n’a pas renvoyé une liste d’établissements valide.");
  }
  return value.map((item) => normalizeEstablishment(item, data));
}

export function extractEstablishmentItems(body: unknown): unknown[] {
  let value = unwrapApiValue(body);
  if (isRecord(value)) {
    value = firstValue(value.items, value.results, value.establishments, value.data);
  }
  return asArray(value);
}

export function extractPhotos(value: unknown, establishmentId: EntityId): Photo[] {
  if (!isRecord(value)) return [];
  const gallery = firstValue(value.photos, value.images, value.gallery, value.cover_image, value.main_image);
  const coverPhoto = isRecord(value.cover_photo)
    ? { ...value.cover_photo, is_cover: true }
    : value.cover_photo;
  const photos = Array.isArray(gallery)
    ? [...gallery, coverPhoto]
    : gallery == null
      ? coverPhoto
      : [gallery, coverPhoto];
  return normalizePhotos(photos, establishmentId);
}

export function normalizePhotos(value: unknown, establishmentId: EntityId): Photo[] {
  const photos = Array.isArray(value) ? value : value == null ? [] : [value];
  return photos.flatMap((item, index) => {
    const fallbackId = `${establishmentId}-photo-${index + 1}`;
    if (typeof item === "string") {
      return [{
        id: fallbackId,
        establishment_id: establishmentId,
        url: item,
        width_ratio: 1,
        height_ratio: 1,
        is_cover: index === 0,
      }];
    }
    if (!isRecord(item)) return [];
    const url = asString(firstValue(item.url, item.image_url, item.src));
    if (!url) return [];
    return [{
      id: idFrom(firstValue(item.id, item.photo_id)) ?? fallbackId,
      establishment_id: idFrom(firstValue(item.establishment_id, item.establishmentId)) ?? establishmentId,
      url,
      width_ratio: asNumber(item.width_ratio, 1),
      height_ratio: asNumber(item.height_ratio, 1),
      is_cover: Boolean(firstValue(item.is_cover, item.is_primary)) || index === 0,
    }];
  });
}

export function normalizeReviews(value: unknown, establishmentId: EntityId): Review[] {
  let reviews = unwrapApiValue(value);
  if (isRecord(reviews)) {
    reviews = firstValue(reviews.items, reviews.results, reviews.reviews, reviews.data);
  }
  return asArray(reviews).flatMap((item, index) => {
    if (!isRecord(item)) return [];
    const fallbackId = `${establishmentId}-review-${index + 1}`;
    const id = idFrom(firstValue(item.id, item.review_id)) ?? fallbackId;
    return [{
      id,
      establishment_id: idFrom(firstValue(item.establishment_id, item.establishmentId)) ?? establishmentId,
      author_name: asString(firstValue(item.author_name, item.user_name, item.author, item.name), "Voyageur"),
      avatar: asString(firstValue(item.avatar, item.avatar_url)),
      rating: asNumber(firstValue(item.rating, item.score)),
      comment: asString(firstValue(item.comment, item.content, item.text)),
      created_at: asString(firstValue(item.created_at, item.date)),
      years_as_member: asNumber(item.years_as_member),
    }];
  });
}

export function getCollectionTotal(body: unknown): number | undefined {
  const value = unwrapApiValue(body);
  if (!isRecord(value)) return undefined;
  const total = firstValue(value.total, value.total_count, value.count, value.total_reviews);
  const parsed = asNumber(total, NaN);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function getCollectionPagination(body: unknown): {
  total?: number;
  limit?: number;
  offset?: number;
} {
  const value = unwrapApiValue(body);
  if (!isRecord(value)) return {};
  const read = (input: unknown) => {
    const parsed = asNumber(input, NaN);
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined;
  };
  return {
    total: read(value.total),
    limit: read(value.limit),
    offset: read(value.offset),
  };
}

function errorMessage(body: unknown, status: number): string {
  if (isRecord(body)) {
    const detail = firstValue(body.detail, body.message, body.error);
    if (typeof detail === "string") return detail;
  }
  return `La requête a échoué (${status}).`;
}

export async function requestEstablishmentsApi(path: string, params?: URLSearchParams): Promise<unknown> {
  const query = params?.toString();
  const response = await fetch(
    `${API_URL}${ESTABLISHMENTS_PATH}${path}${query ? `?${query}` : ""}`,
    { headers: { Accept: "application/json" } }
  );
  const body: unknown = await response.json();
  if (!response.ok) throw new Error(errorMessage(body, response.status));
  return body;
}
