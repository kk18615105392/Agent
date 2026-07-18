import { NextResponse } from "next/server";
import { listArtifacts } from "@/lib/artifacts/store";
import { listSessionNotes } from "@/lib/memory/session";
import { listTraces, clearTraces } from "@/lib/traces/store";

export async function GET() {
  return NextResponse.json({
    artifacts: listArtifacts(20),
    memory: listSessionNotes(20),
    traces: listTraces(60),
  });
}

export async function DELETE() {
  clearTraces();
  return NextResponse.json({ ok: true });
}
