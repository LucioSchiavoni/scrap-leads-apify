import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const STATUS_FILE = path.join(process.cwd(), "lead-statuses.json");

function loadStatuses(): Record<string, string> {
  try {
    if (fs.existsSync(STATUS_FILE)) {
      return JSON.parse(fs.readFileSync(STATUS_FILE, "utf-8"));
    }
  } catch {}
  return {};
}

function saveStatuses(statuses: Record<string, string>) {
  fs.writeFileSync(STATUS_FILE, JSON.stringify(statuses, null, 2));
}

export async function GET() {
  return NextResponse.json(loadStatuses());
}

export async function POST(req: NextRequest) {
  const { id, status } = await req.json();
  if (!id || !status) {
    return NextResponse.json({ error: "Missing id or status" }, { status: 400 });
  }
  const statuses = loadStatuses();
  statuses[id] = status;
  saveStatuses(statuses);
  return NextResponse.json({ ok: true });
}
