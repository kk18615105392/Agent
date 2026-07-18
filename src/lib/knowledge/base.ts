/**
 * 内置知识库（通用运维 / Agent 工程文档）
 * 纯演示数据，不依赖任何外部业务项目。
 */
export type KnowledgeDoc = {
  id: string;
  title: string;
  tags: string[];
  content: string;
};

export const KNOWLEDGE_BASE: KnowledgeDoc[] = [
  {
    id: "kb-agent-loop",
    title: "Agent Tool Loop 基础",
    tags: ["agent", "tool-calling", "loop"],
    content:
      "现代 Agent 的核心是 ReAct/Tool Loop：模型每步产出 text 或 tool_calls；若调用工具，运行时执行后把结果回灌，直到模型给出最终答案或触发 stopWhen。关键控制项包括 max steps、toolChoice、以及 toolApproval。",
  },
  {
    id: "kb-subagent",
    title: "Subagent 上下文卸载",
    tags: ["subagent", "context", "orchestration"],
    content:
      "Subagent 用于把高 token 消耗的探索任务隔离到独立上下文。主 Agent 只接收摘要（toModelOutput），从而保持主对话连贯。适合并行调研、长文档分析、专项工具域隔离。",
  },
  {
    id: "kb-memory",
    title: "Agent Memory 分层",
    tags: ["memory", "session", "rag"],
    content:
      "常见分层：Working Memory（当前对话）、Session Memory（跨轮次摘要）、Long-term Memory（用户偏好/知识库向量检索）。生产系统还需写入审计日志与可回放轨迹。",
  },
  {
    id: "kb-eval",
    title: "Agent 评测要点",
    tags: ["eval", "observability", "quality"],
    content:
      "评测维度：任务完成率、工具调用正确率、平均步数、延迟、幻觉率、安全违规次数。建议固定 golden dataset，并对每步 tool_call 做结构化断言。",
  },
  {
    id: "kb-mcp",
    title: "MCP 与工具生态",
    tags: ["mcp", "tools", "interop"],
    content:
      "Model Context Protocol (MCP) 把工具/资源以标准协议暴露给 Agent。AI SDK 可通过 createMCPClient 接入 MCP Server，实现与 IDE、浏览器、数据库等外部能力互通。",
  },
  {
    id: "kb-hitl",
    title: "Human-in-the-loop",
    tags: ["approval", "safety", "hitl"],
    content:
      "对高风险工具（发邮件、改生产、转账）应启用 toolApproval。流程：模型提出调用 → 前端展示待审批 → 用户批准/拒绝 → 继续或中止 Agent Loop。",
  },
];

export function searchKnowledge(query: string, limit = 4): KnowledgeDoc[] {
  const q = query.toLowerCase().trim();
  if (!q) return KNOWLEDGE_BASE.slice(0, limit);

  const scored = KNOWLEDGE_BASE.map((doc) => {
    const hay = `${doc.title} ${doc.tags.join(" ")} ${doc.content}`.toLowerCase();
    let score = 0;
    for (const token of q.split(/\s+/)) {
      if (hay.includes(token)) score += 1;
      if (doc.tags.some((t) => t.includes(token))) score += 2;
      if (doc.title.toLowerCase().includes(token)) score += 3;
    }
    return { doc, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return (scored.length ? scored.map((x) => x.doc) : KNOWLEDGE_BASE).slice(0, limit);
}
