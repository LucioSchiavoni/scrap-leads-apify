import { COUNTRY_CODES } from "./config.js";

export function normalizePhone(raw: string, locationHint: string): string {
  const digits = raw.replace(/[^\d+]/g, "");

  if (digits.startsWith("+")) return digits;

  const countryKey = Object.keys(COUNTRY_CODES).find((k) =>
    locationHint.toLowerCase().includes(k)
  );

  if (!countryKey) return digits;

  const code = COUNTRY_CODES[countryKey];
  let local = digits.startsWith("0") ? digits.slice(1) : digits;

  if (countryKey === "españa" || countryKey === "spain") {
    const firstDigit = local.charAt(0);
    if (firstDigit !== "6" && firstDigit !== "7") {
      return "";
    }
  }

  return `+${code}${local}`;
}

export function buildWhatsAppLink(phone: string, message: string): string {
  const encoded = encodeURIComponent(message);
  const clean = phone.replace("+", "");
  return `https://wa.me/${clean}?text=${encoded}`;
}