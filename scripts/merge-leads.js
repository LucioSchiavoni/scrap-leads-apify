const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "apify-lead-pipeline", "data");
const OUT_FILE = path.join(__dirname, "..", "leads.json");

const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));

const seen = new Set();
const merged = [];

for (const file of files) {
  const items = JSON.parse(fs.readFileSync(path.join(DATA_DIR, file), "utf-8"));
  for (const item of items) {
    const id = item.placeId || item.cid || item.title + item.address;
    if (seen.has(id)) continue;
    seen.add(id);
    merged.push({ ...item, _id: id, estado: "Nuevo" });
  }
}

fs.writeFileSync(OUT_FILE, JSON.stringify(merged, null, 2));
console.log(`✓ ${merged.length} leads unificados → leads.json`);
