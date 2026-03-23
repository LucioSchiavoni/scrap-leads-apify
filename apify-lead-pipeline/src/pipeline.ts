import "dotenv/config";
import { SEARCH_TARGETS } from "./config.js";
import { scrapeGoogleMaps } from "./scrape.js";
import { filterAndEnrich } from "./filter.js";
import { exportToExcel } from "./export.js";

async function main() {
  const startTime = Date.now();

  console.log("=== APIFY LEAD PIPELINE ===\n");
  console.log(`[pipeline] ${SEARCH_TARGETS.length} jobs configurados\n`);

  console.log("[1/3] Scrapeando Google Maps via Apify...\n");
  const rawResults = await scrapeGoogleMaps(SEARCH_TARGETS);
  console.log(`\n[resultado] Total bruto: ${rawResults.length} negocios\n`);

  console.log("[2/3] Filtrando: sin web + con teléfono + dedup...\n");
  const leads = filterAndEnrich(rawResults);
  console.log(`\n[resultado] Leads calificados: ${leads.length}\n`);

  if (leads.length === 0) {
    console.log("[pipeline] No se encontraron leads. Revisá los parámetros.");
    return;
  }

  console.log("[3/3] Exportando a Excel...\n");
  const timestamp = new Date().toISOString().slice(0, 10);
  const filename = `leads-dental-${timestamp}.xlsx`;
  const path = exportToExcel(leads, filename);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log("=== RESUMEN ===");
  console.log(`Total scrapeados:  ${rawResults.length}`);
  console.log(`Sin website:       ${leads.length}`);
  console.log(`Archivo:           ${path}`);
  console.log(`Tiempo:            ${elapsed}s`);
  console.log("===============\n");

  console.log("Próximos pasos:");
  console.log("1. Abrí el Excel y revisá los leads");
  console.log("2. Copiá los links de WhatsApp para enviar mensajes");
  console.log("3. Marcá el estado de cada lead (Enviado/Respondió/No interesa)");
}

main().catch((err) => {
  console.error("[error]", err);
  process.exit(1);
});
