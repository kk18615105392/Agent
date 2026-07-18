import { ToolLoopAgent, stepCountIs, tool } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { sharedTools } from "@/lib/tools";

function model() {
  return openai(process.env.OPENAI_MODEL ?? "gpt-4o-mini");
}

/** 研究 Subagent：检索 + 模拟搜索，输出摘要 */
export const researchSubagent = new ToolLoopAgent({
  model: model(),
  instructions: `你是研究子代理（Research Subagent）。
- 使用 searchKnowledge / mockWebSearch / recallMemory 收集信息
- 自主完成调研
- 最终回复必须是结构化中文摘要：结论、关键依据、不确定点、建议下一步`,
  tools: {
    searchKnowledge: sharedTools.searchKnowledge,
    mockWebSearch: sharedTools.mockWebSearch,
    recallMemory: sharedTools.recallMemory,
  },
  stopWhen: stepCountIs(8),
});

/** 分析 Subagent：拆解问题与量化 */
export const analystSubagent = new ToolLoopAgent({
  model: model(),
  instructions: `你是分析子代理（Analyst Subagent）。
- 把模糊需求拆成指标、约束、风险
- 必要时用 calculate
- 最终给出：问题定义、假设、指标、风险矩阵（简表）`,
  tools: {
    calculate: sharedTools.calculate,
    searchKnowledge: sharedTools.searchKnowledge,
    createTaskPlan: sharedTools.createTaskPlan,
  },
  stopWhen: stepCountIs(8),
});

/** 写作 Subagent：产出可交付文档 */
export const writerSubagent = new ToolLoopAgent({
  model: model(),
  instructions: `你是写作子代理（Writer Subagent）。
- 把输入材料整理成清晰 Markdown 报告
- 用 saveArtifact 落盘
- 语气专业、简洁，面向面试官/技术负责人`,
  tools: {
    saveArtifact: sharedTools.saveArtifact,
    listArtifacts: sharedTools.listArtifacts,
  },
  stopWhen: stepCountIs(6),
});

export const delegateResearch = tool({
  description: "把深度调研任务委派给 Research Subagent，返回其摘要。",
  inputSchema: z.object({
    task: z.string().describe("研究任务描述"),
  }),
  execute: async ({ task }, { abortSignal }) => {
    const result = await researchSubagent.generate({
      prompt: task,
      abortSignal,
    });
    return {
      summary: result.text,
      steps: result.steps.length,
    };
  },
});

export const delegateAnalysis = tool({
  description: "把分析拆解任务委派给 Analyst Subagent。",
  inputSchema: z.object({
    task: z.string(),
  }),
  execute: async ({ task }, { abortSignal }) => {
    const result = await analystSubagent.generate({
      prompt: task,
      abortSignal,
    });
    return {
      analysis: result.text,
      steps: result.steps.length,
    };
  },
});

export const delegateWriting = tool({
  description: "把成文任务委派给 Writer Subagent，生成并保存报告。",
  inputSchema: z.object({
    brief: z.string().describe("写作简报与必须包含的要点"),
  }),
  execute: async ({ brief }, { abortSignal }) => {
    const result = await writerSubagent.generate({
      prompt: brief,
      abortSignal,
    });
    return {
      document: result.text,
      steps: result.steps.length,
    };
  },
});
