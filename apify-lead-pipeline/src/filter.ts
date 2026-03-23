import type { ApifyPlaceResult, Lead } from "./types.js";
import { normalizePhone, buildWhatsAppLink } from "./phone.js";

function hasPhone(place: ApifyPlaceResult): boolean {
  return !!place.phone && place.phone.trim().length >= 6;
}

function locationHint(place: ApifyPlaceResult): string {
  return [place.city, place.address, place.countryCode]
    .filter(Boolean)
    .join(" ");
}

export function filterAndEnrich(raw: ApifyPlaceResult[]): Lead[] {
  const withPhone = raw.filter(hasPhone);
  console.log(`[filter] Con teléfono: ${withPhone.length}/${raw.length}`);

  const seen = new Set<string>();
  const unique = withPhone.filter((p) => {
    const key = (p.phone ?? "").replace(/\D/g, "");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  console.log(`[filter] Únicos: ${unique.length}`);

  return unique.map((place) => {
    const name = place.title ?? "Negocio";
    const hint = locationHint(place);
    const normalized = normalizePhone(place.phone ?? "", hint);

    return {
      businessName: name,
      category: place.categoryName ?? "",
      address: place.address ?? "",
      city: place.city ?? "",
      country: place.countryCode ?? "",
      phoneRaw: place.phone ?? "",
      phoneNormalized: normalized,
      whatsappLink: buildWhatsAppLink(normalized, ""),
      googleMapsUrl: place.url ?? "",
      rating: place.totalScore ?? 0,
      reviewsCount: place.reviewsCount ?? 0,
    };
  });
}