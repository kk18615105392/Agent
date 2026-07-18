import { createAgentUIStreamResponse } from "ai";
import { forgeOrchestrator } from "@/lib/agents/orchestrator";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return Response.json(
      {
        error:
          "缺少 OPENAI_API_KEY。请复制 .env.example 为 .env.local 并填入密钥后重启。",
      },
      { status: 500 },
    );
  }

  const { messages } = await request.json();

  return createAgentUIStreamResponse({
    agent: forgeOrchestrator,
    uiMessages: messages,
  });
}
