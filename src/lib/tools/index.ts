import { tool } from "ai";
import { z } from "zod";
import { searchKnowledge } from "@/lib/knowledge/base";
import { addSessionNote, listSessionNotes, searchSessionNotes } from "@/lib/memory/session";
import { listArtifacts, saveArtifact } from "@/lib/artifacts/store";

export const sharedTools = {
  searchKnowledge: tool({
    description: "在内置 Agent 工程知识库中检索相关文档。",
    inputSchema: z.object({
      query: z.string().describe("检索关键词，如 subagent / memory / eval"),
      limit: z.number().int().min(1).max(8).optional(),
    }),
    execute: async ({ query, limit }) => {
      const docs = searchKnowledge(query, limit ?? 4);
      return {
        count: docs.length,
        docs: docs.map((d) => ({
          id: d.id,
          title: d.title,
          tags: d.tags,
          excerpt: d.content.slice(0, 280),
        })),
      };
    },
  }),

  calculate: tool({
    description: "安全计算简单算术表达式（仅支持数字与 + - * / ()）。",
    inputSchema: z.object({
      expression: z.string(),
    }),
    execute: async ({ expression }) => {
      if (!/^[\d+\-*/().\s]+$/.test(expression)) {
        return { ok: false, error: "表达式包含非法字符" };
      }
      try {
        const value = Function(`"use strict"; return (${expression});`)() as number;
        if (typeof value !== "number" || !Number.isFinite(value)) {
          return { ok: false, error: "计算结果无效" };
        }
        return { ok: true, expression, value };
      } catch {
        return { ok: false, error: "计算失败" };
      }
    },
  }),

  createTaskPlan: tool({
    description: "生成结构化任务计划，拆解目标、步骤、风险与验收标准。",
    inputSchema: z.object({
      goal: z.string(),
      steps: z.array(z.string()).min(2).max(12),
      risks: z.array(z.string()).optional(),
      acceptance: z.array(z.string()).optional(),
    }),
    execute: async ({ goal, steps, risks, acceptance }) => {
      const artifact = saveArtifact({
        title: `Plan: ${goal.slice(0, 48)}`,
        kind: "plan",
        content: [
          `# Goal\n${goal}`,
          `# Steps\n${steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}`,
          `# Risks\n${(risks ?? ["无"]).map((r) => `- ${r}`).join("\n")}`,
          `# Acceptance\n${(acceptance ?? ["任务完成且可复现"]).map((a) => `- ${a}`).join("\n")}`,
        ].join("\n\n"),
      });
      return { planId: artifact.id, goal, steps, risks: risks ?? [], acceptance: acceptance ?? [] };
    },
  }),

  saveMemory: tool({
    description: "把关键结论写入会话记忆，供后续轮次检索。",
    inputSchema: z.object({
      content: z.string(),
      tags: z.array(z.string()).optional(),
    }),
    execute: async ({ content, tags }) => addSessionNote(content, tags ?? []),
  }),

  recallMemory: tool({
    description: "检索会话记忆。",
    inputSchema: z.object({
      query: z.string().optional(),
      limit: z.number().int().min(1).max(20).optional(),
    }),
    execute: async ({ query, limit }) => {
      const items = query
        ? searchSessionNotes(query, limit ?? 8)
        : listSessionNotes(limit ?? 8);
      return { count: items.length, items };
    },
  }),

  saveArtifact: tool({
    description: "保存报告/清单等产物，供用户在侧边栏查看。",
    inputSchema: z.object({
      title: z.string(),
      kind: z.enum(["plan", "report", "checklist", "note"]),
      content: z.string(),
    }),
    execute: async (input) => saveArtifact(input),
  }),

  listArtifacts: tool({
    description: "列出已保存产物。",
    inputSchema: z.object({
      limit: z.number().int().min(1).max(30).optional(),
    }),
    execute: async ({ limit }) => ({
      items: listArtifacts(limit ?? 10),
    }),
  }),

  getServerTime: tool({
    description: "获取服务端当前时间（ISO）。",
    inputSchema: z.object({}),
    execute: async () => ({
      iso: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    }),
  }),

  mockWebSearch: tool({
    description:
      "模拟联网搜索（演示用，不访问外网）。用于展示 Agent 如何整合检索结果。",
    inputSchema: z.object({
      query: z.string(),
    }),
    execute: async ({ query }) => ({
      query,
      results: [
        {
          title: `Survey: ${query}`,
          snippet: `关于「${query}」的综述性材料：覆盖定义、常见架构与落地权衡。`,
          source: "mock://survey",
        },
        {
          title: `Best practices for ${query}`,
          snippet: `实践清单：可观测性、工具权限最小化、评测集与回归门禁。`,
          source: "mock://best-practices",
        },
        {
          title: `Failure modes: ${query}`,
          snippet: `常见失败：工具幻觉、无限循环、上下文膨胀、缺少人工审批。`,
          source: "mock://failures",
        },
      ],
    }),
  }),
};
