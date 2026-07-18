# ForgeAgent｜面试说明

> 投递方向：Agent 工程师 / AI 应用开发 / LLM 应用工程师  
> 仓库：https://github.com/kk18615105392/Agent  
> 本地运行见 [docs/setup.md](docs/setup.md)

---

## 一句话介绍

基于 **Vercel AI SDK（ToolLoopAgent + Subagents）** 的多 Agent 编排工作台：主编排代理自主调用工具，把调研 / 分析 / 写作委派给专用 Subagent，并配套 Memory、Artifacts、Trace，形成可演示、可讲解的 Agent 工程闭环。

---

## 简历怎么写（可直接粘贴）

**ForgeAgent｜多 Agent 编排工作台｜个人项目**  
`Next.js · Vercel AI SDK · TypeScript · ToolLoopAgent`

- 使用 AI SDK `ToolLoopAgent` 构建主编排 Agent，实现多步工具调用与停止条件控制，完成任务规划到结果交付的闭环。  
- 引入 Research / Analyst / Writer Subagent 委派机制，隔离高消耗调研与成文流程，保持主 Agent 上下文可控。  
- 实现 Memory / Artifacts / Trace 可观测能力，支持会话记忆检索、产物落盘与工具执行轨迹展示。  
- 搭建流式对话 UI，形成可演示、可讲解的 Agent 工程作品。

---

## 我完成了什么

1. 基于 **AI SDK 7 `ToolLoopAgent`** 实现主编排 Agent，支持多步 Tool Calling 与 `stepCountIs` 循环控制。  
2. 设计并落地 **Research / Analyst / Writer 三类 Subagent**，通过委派工具做上下文卸载与能力隔离。  
3. 实现 **Knowledge 检索、任务计划、Session Memory、Artifacts、Mock Search** 等工具集。  
4. 用 `createAgentUIStreamResponse` + `useChat` 做 **流式对话工作台**，实时展示 tool 状态。  
5. 用 Lifecycle Callbacks 沉淀 **运行轨迹（Traces）**，支持步骤 / 工具耗时观测。

---

## 我提升了什么

1. 把「单次 LLM 问答」升级为 **可多步协作的 Agent 运行时**，工具与子代理可独立扩展。  
2. 通过 Subagent 摘要回传，**控制主对话上下文规模**，避免长调研拖垮主编排。  
3. Trace + Artifacts + Memory，把黑盒生成变成 **可解释执行过程**。  
4. 统一 AI SDK Agent 范式后，新工具只需 schema + execute，**扩展路径标准化**。

> 若追问量化：当前是作品集级系统，重点验证架构完整性；上线后可用任务完成率、平均步数、工具正确率、P95 延迟评测。

---

## 面试 30 秒口述

我做了一个叫 ForgeAgent 的多 Agent 工作台。核心不是聊天框，而是用最新 AI SDK 的 ToolLoopAgent 做编排：主代理会自己选工具，复杂调研和分析会委派给 Subagent，最后还能把结论写进 Memory、把报告存成 Artifact，并且每一步 tool 调用都有 Trace。用来证明我能把 Agent 从 demo 做到可观测、可扩展的工程形态。

---

## 面试官常问（对照本项目）

| 问题 | 怎么答 |
|------|--------|
| 为什么用 ToolLoopAgent，而不是单次 generateText？ | 需要多步工具环、统一 stopWhen / lifecycle、配置可复用。 |
| Subagent 解决什么？ | 上下文卸载、能力隔离；主代理只拿摘要，避免上下文膨胀。 |
| 如何做可观测？ | `onStart / onStep* / onToolExecution*` 写 Trace，UI 侧栏实时展示。 |
| Memory 和 Artifacts 区别？ | Memory 服务后续推理；Artifacts 是可交付产物（计划/报告）。 |
| 生产还缺什么？ | 真实检索、向量库、MCP、toolApproval、评测集与外部 tracing。 |

---

## 技术能力对照

| 能力点 | 本项目落点 |
|--------|------------|
| Agent Loop | `ToolLoopAgent` + `stepCountIs` |
| Subagents | Research / Analyst / Writer 委派 |
| Tool Calling | knowledge / plan / memory / artifacts 等 |
| Streaming UI | Agent UI Stream + `useChat` |
| Observability | Lifecycle → Trace 面板 |

---

## 现场演示三问（可选）

1. 「调研 Subagent 适用场景」→ 看 `delegateResearch` + Trace  
2. 「制定 Agent 评测方案」→ 看计划 / 分析委派  
3. 「计算并把结论写入记忆」→ 看 `calculate` + Memory 面板  
