export const APIFY_TOKEN = process.env.APIFY_TOKEN ?? "";

export const ACTOR_ID = "compass/crawler-google-places";

// Presupuesto free tier: ~1000 resultados/mes ($5 USD)
// Distribucion: Uruguay 200 | España 800

export const SEARCH_TARGETS = [
  // === URUGUAY — simbólico ===
  { category: "Veterinaria", locations: ["Montevideo, Uruguay"], maxResults: 15 },
  { category: "Peluquería", locations: ["Montevideo, Uruguay"], maxResults: 15 },

  // === ESPAÑA — ~770 resultados (con email enrichment) ===
  { category: "Centro de estética", locations: ["Sevilla, España", "Bilbao, España", "Zaragoza, España"], maxResults: 60 },
  { category: "Cirujano plástico", locations: ["Madrid, España", "Barcelona, España", "Sevilla, España"], maxResults: 40 },
  { category: "Veterinaria", locations: ["Sevilla, España", "Bilbao, España", "Zaragoza, España"], maxResults: 60 },
  { category: "Peluquería", locations: ["Sevilla, España", "Zaragoza, España", "Bilbao, España"], maxResults: 60 },
  { category: "Oftalmólogo", locations: ["Madrid, España", "Barcelona, España"], maxResults: 30 },
  { category: "Clínica de estética", locations: ["Zaragoza, España", "Bilbao, España"], maxResults: 40 },
];
export const COUNTRY_CODES: Record<string, string> = {
  uruguay: "598",
  españa: "34",
  spain: "34",
};

export const OUTPUT_DIR = "./output";


