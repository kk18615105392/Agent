# ForgeAgent

基于 **Vercel AI SDK** 的多 Agent 编排工作台。

主编排代理通过 Tool Loop 自主调用工具，将调研 / 分析 / 写作委派给 Subagent，并提供 Memory、Artifacts、Trace，形成可观测的 Agent 工程闭环。

[![CI](https://github.com/kk18615105392/Agent/actions/workflows/ci.yml/badge.svg)](https://github.com/kk18615105392/Agent/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![AI SDK](https://img.shields.io/badge/AI%20SDK-7-blue)](https://ai-sdk.dev/)

仓库：https://github.com/kk18615105392/Agent

---

## 项目解决什么问题

传统 ChatUI 往往只有一轮生成。本项目围绕 Agent 运行时的核心问题构建：

- 工具如何选择与执行  
- 多步循环如何收敛（停止条件）  
- 上下文如何避免膨胀  
- 子任务如何隔离（Subagent）  
- 执行过程如何可观测（Trace）  

---

## 功能

| 模块 | 说明 |
|------|------|
| Orchestrator | `ToolLoopAgent` 主编排，多步 Tool Calling |
| Subagents | Research / Analyst / Writer，任务委派与摘要回流 |
| Tools | 知识检索、任务计划、计算、Memory、Artifacts、Mock Search |
| Streaming UI | Agent UI Stream + 对话工作台 |
| Observability | Lifecycle Trace；侧栏查看 Traces / Memory / Artifacts |
| API | `/api/chat`、`/api/health`、`/api/workspace` |

---

## 架构

```text
用户
  │
  ▼
Orchestrator (ToolLoopAgent)
  ├─ shared tools（knowledge / plan / memory / calc …）
  ├─ delegateResearch  → Research Subagent
  ├─ delegateAnalysis  → Analyst Subagent
  └─ delegateWriting   → Writer Subagent
         │
         ▼
   Traces / Memory / Artifacts
```

设计要点：

- 主代理负责编排与决策，不承担重型探索细节  
- Subagent 负责高消耗 / 专项任务，结果以摘要返回  
- Memory 服务后续推理；Artifacts 沉淀可交付文档  
- Trace 记录每步与工具执行，便于调试与回放  

---

## 技术栈

| 层 | 技术 |
|----|------|
| 框架 | Next.js 16（App Router）· TypeScript · React 19 |
| Agent | Vercel AI SDK 7 · `ToolLoopAgent` · `stepCountIs` |
| 模型 | OpenAI API（`OPENAI_API_KEY`） |
| UI | `@ai-sdk/react` · `useChat` · Streaming |

---

## 目录结构

```text
src/
  app/api/chat/route.ts       # Agent 流式入口
  app/api/health/route.ts
  app/api/workspace/route.ts  # traces / memory / artifacts
  components/                 # 对话与侧栏
  lib/
    agents/                   # Orchestrator + Subagents
    tools/                    # 共享 Tools
    knowledge/ memory/ artifacts/ traces/
```

---

## 快速开始

详见 [docs/setup.md](docs/setup.md)。

```bash
git clone https://github.com/kk18615105392/Agent.git
cd Agent
cp .env.example .env.local   # 填入 OPENAI_API_KEY
npm install
npm run dev
```

打开 http://localhost:3000

---

## 相关文档

- 本地运行：[docs/setup.md](docs/setup.md)  
- 面试说明（简历 / 问答 / 口述）：[docs/interview.md](docs/interview.md)  

## License

MIT
