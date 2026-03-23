import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "..", "apify-lead-pipeline", "data");

export async function GET() {
  try {
    const files = fs.readdirSync(DATA_DIR).filter((f) => f.endsWith(".json"));
    const all: Record<string, unknown>[] = [];
    const seen = new Set<string>();

    for (const file of files) {
      const content = fs.readFileSync(path.join(DATA_DIR, file), "utf-8");
      const items: Record<string, unknown>[] = JSON.parse(content);
      for (const item of items) {
        const id = (item.placeId as string) || (item.cid as string) || JSON.stringify(item);
        if (!seen.has(id)) {
          seen.add(id);
          all.push({ ...item, _id: id });
        }
      }
    }

    return NextResponse.json(all);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
