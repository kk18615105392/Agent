# ForgeAgent

> **Multi-Agent 编排工作室台** — 面向 **Agent / AI Engineer** 岗位的独立作品集项目。  
> 使用最新 **Vercel AI SDK（ToolLoopAgent + Subagents + Streaming UI）** 构建，覆盖工具调用、子代理委派、会话记忆、产物落盘与运行轨迹。

[![CI](https://github.com/kk18615105392/Agent/actions/workflows/ci.yml/badge.svg)](https://github.com/kk18615105392/Agent/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![AI SDK](https://img.shields.io/badge/AI%20SDK-7-blue)](https://ai-sdk.dev/)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

---

## 项目定位（面试一句话）

ForgeAgent 是一个可运行的 **Agent 运行时演示**：主编排代理通过 Tool Loop 自主选工具，必要时把调研 / 分析 / 写作委派给 **Subagent**，并提供 Memory、Artifacts 与 Trace 面板，方便讲清「如何把 LLM 做成可观测、可协作的 Agent 系统」。

本仓库与任何短链 / 分库分表项目 **无关联**，专注 Agent 工程能力。

---

## 技术栈（刻意对齐最新 Agent 开发工具）

| 能力 | 实现 |
|------|------|
| Agent 本体 | `ToolLoopAgent`（AI SDK 7） |
| 子代理 | Research / Analyst / Writer Subagents + 委派 Tools |
| 工具调用 | Knowledge / Calculate / Plan / Memory / Artifacts / Mock Search |
| 流式 UI | `createAgentUIStreamResponse` + `@ai-sdk/react` `useChat` |
| 循环控制 | `stepCountIs` |
| 可观测性 | Lifecycle callbacks → Trace 面板 |
| 应用框架 | Next.js 16 App Router + TypeScript |

---

## 架构

```text
用户
  │  stream chat
  ▼
Orchestrator (ToolLoopAgent)
  ├─ shared tools (knowledge / memory / artifacts / calc …)
  ├─ delegateResearch  → Research Subagent
  ├─ delegateAnalysis  → Analyst Subagent
  └─ delegateWriting   → Writer Subagent
         │
         ▼
   Traces / Memory / Artifacts 侧边栏
```

---

## 快速开始

### 环境

- Node.js 22+
- OpenAI API Key（或兼容网关，设置 `OPENAI_API_KEY`）

### 安装与运行

```bash
git clone https://github.com/kk18615105392/Agent.git
cd Agent   # 本地开发目录也可能是 forge-agent

cp .env.example .env.local
# 编辑 .env.local，填入 OPENAI_API_KEY

npm install
npm run dev
```

打开 http://localhost:3000

### 健康检查

```bash
curl http://localhost:3000/api/health
```

### 构建

```bash
npm run build
npm start
```

---

## 演示剧本（建议面试现场）

1. **Subagent 调研**  
   「请调研 Subagent 的适用场景，并输出面试可讲要点。」  
   → 观察 `delegateResearch` + Trace

2. **计划 + 分析**  
   「帮我制定 Agent 评测方案，包含指标与风险。」  
   → `createTaskPlan` / `delegateAnalysis`

3. **工具 + 记忆**  
   「计算 (128+64)*0.15，并把结论写入记忆。」  
   → `calculate` + `saveMemory`，侧边栏 Memory 可见

---

## 目录结构

```text
src/
  app/
    api/chat/route.ts          # Agent 流式入口
    api/health/route.ts
    api/workspace/route.ts     # traces / memory / artifacts
    page.tsx
  components/
    chat-app.tsx               # 流式对话 UI
    workspace-panel.tsx        # 可观测侧栏
  lib/
    agents/
      orchestrator.ts          # ★ 主编排 Agent
      subagents.ts             # ★ Research/Analyst/Writer
    tools/index.ts             # ★ 共享 Tools
    knowledge/base.ts
    memory/session.ts
    artifacts/store.ts
    traces/store.ts
```

---

## 面试可讲点（对照代码）

1. **为什么要用 ToolLoopAgent，而不是单次 `generateText`？**  
   多步工具环、可复用配置、统一 stopWhen / lifecycle。

2. **Subagent 解决什么问题？**  
   上下文卸载、能力隔离、并行调研；主代理只拿摘要。

3. **如何做可观测？**  
   `onStart / onStep* / onToolExecution*` 写入 Trace，UI 实时展示。

4. **Memory 与 Artifacts 区别？**  
   Memory 服务后续推理；Artifacts 是可交付产物（计划/报告）。

5. **生产还缺什么？（加分）**  
   真实联网检索、向量库、MCP Server、toolApproval、评测集与 tracing（Langfuse 等）。

---

## GitHub Actions

推送到 `main` 后自动执行 `lint` + `build`。  
工作流：`.github/workflows/ci.yml`

---

## License

MIT
