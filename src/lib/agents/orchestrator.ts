import { ToolLoopAgent, stepCountIs, type InferAgentUIMessage } from "ai";
import { openai } from "@ai-sdk/openai";
import { sharedTools } from "@/lib/tools";
import {
  delegateAnalysis,
  delegateResearch,
  delegateWriting,
} from "@/lib/agents/subagents";
import { appendTrace } from "@/lib/traces/store";

function model() {
  return openai(process.env.OPENAI_MODEL ?? "gpt-4o-mini");
}

/**
 * ForgeAgent Orchestrator
 * - Tool Loop
 * - Subagent 委派
 * - Memory / Artifacts / Knowledge
 * - Lifecycle 追踪
 */
export const forgeOrchestrator = new ToolLoopAgent({
  model: model(),
  instructions: `你是 ForgeAgent 主编排代理（Orchestrator）。

职责：
1. 理解用户目标，必要时先 createTaskPlan
2. 复杂调研 → delegateResearch
3. 指标/风险拆解 → delegateAnalysis
4. 需要成文交付 → delegateWriting
5. 关键结论 → saveMemory
6. 直接可答的小问题可自己用 searchKnowledge / calculate 解决

风格：
- 中文回答，结构清晰
- 说明你调用了哪些能力（工具/子代理），但不要泄露密钥
- 若信息不足，先提出澄清问题再行动`,
  tools: {
    ...sharedTools,
    delegateResearch,
    delegateAnalysis,
    delegateWriting,
  },
  stopWhen: stepCountIs(16),
  onStart: ({ modelId }) => {
    appendTrace({
      runId: "live",
      type: "run_start",
      message: `Orchestrator started (${String(modelId)})`,
    });
  },
  onStepStart: ({ stepNumber }) => {
    appendTrace({
      runId: "live",
      type: "step_start",
      message: `Step ${stepNumber} start`,
      data: { stepNumber },
    });
  },
  onToolExecutionStart: ({ toolCall }) => {
    appendTrace({
      runId: "live",
      type: "tool_start",
      message: `Tool → ${toolCall.toolName}`,
      data: { toolName: toolCall.toolName, toolCallId: toolCall.toolCallId },
    });
  },
  onToolExecutionEnd: ({ toolCall, toolExecutionMs, toolOutput }) => {
    appendTrace({
      runId: "live",
      type: "tool_end",
      message: `Tool ← ${toolCall.toolName} (${toolExecutionMs}ms)`,
      data: {
        toolName: toolCall.toolName,
        ok: toolOutput.type === "tool-result",
      },
    });
  },
  onStepEnd: ({ stepNumber, finishReason, usage }) => {
    appendTrace({
      runId: "live",
      type: "step_end",
      message: `Step ${stepNumber} end (${finishReason})`,
      data: {
        stepNumber,
        finishReason,
        totalTokens: usage?.totalTokens,
      },
    });
  },
  onEnd: ({ steps, totalUsage }) => {
    appendTrace({
      runId: "live",
      type: "run_end",
      message: `Orchestrator finished · ${steps.length} steps`,
      data: {
        steps: steps.length,
        totalTokens: totalUsage?.totalTokens,
      },
    });
  },
});

export type ForgeAgentUIMessage = InferAgentUIMessage<typeof forgeOrchestrator>;
