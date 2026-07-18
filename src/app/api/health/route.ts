import { NextResponse } from "next/server";
import { KNOWLEDGE_BASE } from "@/lib/knowledge/base";

export async function GET() {
  return NextResponse.json({
    status: "UP",
    app: "ForgeAgent",
    capabilities: [
      "ToolLoopAgent",
      "Subagents",
      "ToolCalling",
      "SessionMemory",
      "Artifacts",
      "TraceObservability",
      "StreamingUI",
    ],
    knowledgeDocs: KNOWLEDGE_BASE.length,
    model: process.env.OPENAI_MODEL ?? "gpt-4o-mini",
    hasApiKey: Boolean(process.env.OPENAI_API_KEY),
  });
}
