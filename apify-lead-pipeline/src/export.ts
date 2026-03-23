import * as XLSX from "xlsx";
import { mkdirSync } from "node:fs";
import { join } from "node:path";
import { OUTPUT_DIR } from "./config.js";
import type { Lead } from "./types.js";

export function exportToExcel(leads: Lead[], filename: string): string {
  mkdirSync(OUTPUT_DIR, { recursive: true });

  const rows = leads.map((l) => ({
    Negocio: l.businessName,
    Categoría: l.category,
    Dirección: l.address,
    Ciudad: l.city,
    País: l.country,
    "Teléfono Original": l.phoneRaw,
    "Teléfono Normalizado": l.phoneNormalized,
    "Link WhatsApp": l.whatsappLink,
    "Google Maps": l.googleMapsUrl,
    Rating: l.rating,
    Reviews: l.reviewsCount,
    Estado: "Pendiente",
    "Fecha Contacto": "",
    Respuesta: "",
    Notas: "",
  }));

  const ws = XLSX.utils.json_to_sheet(rows);

  const colWidths = [
    { wch: 35 },
    { wch: 20 },
    { wch: 40 },
    { wch: 20 },
    { wch: 8 },
    { wch: 18 },
    { wch: 18 },
    { wch: 40 },
    { wch: 50 },
    { wch: 8 },
    { wch: 8 },
    { wch: 12 },
    { wch: 14 },
    { wch: 15 },
    { wch: 30 },
  ];
  ws["!cols"] = colWidths;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Leads");

  const path = join(OUTPUT_DIR, filename);
  XLSX.writeFile(wb, path);

  return path;
}