# ForgeAgent · 简历包装文案

> 投递方向：Agent 工程师 / AI 应用开发 / LLM 应用工程师  
> 项目独立，勿与短链项目混写。

---

## 项目名称（简历一行）

**ForgeAgent — 基于 Vercel AI SDK 的多 Agent 编排工作台**  
（Next.js + ToolLoopAgent + Subagents + 流式 UI）

仓库：`https://github.com/kk18615105392/Agent`

---

## 项目描述（2～3 句）

面向复杂任务拆解与协作执行，设计并实现多 Agent 编排系统：主编排代理通过 Tool Loop 自主调用工具，并将调研、分析、写作委派给专用 Subagent；配套会话记忆、产物落盘与运行轨迹面板，形成可演示、可讲解的 Agent 工程闭环。

---

## 完成了什么（What I built）

可直接贴简历的要点（选 3～5 条）：

1. 基于 **Vercel AI SDK 7 `ToolLoopAgent`** 实现主编排 Agent，支持多步 Tool Calling 与 `stepCountIs` 循环控制，完成「规划 → 执行 → 汇总」闭环。  
2. 设计并落地 **Research / Analyst / Writer 三类 Subagent**，通过委派工具实现上下文卸载与能力隔离，降低主编排上下文膨胀。  
3. 实现 **Knowledge 检索、算术工具、任务计划、Session Memory、Artifacts** 等工具集，支撑 Agent 可行动、可落盘、可复用。  
4. 使用 `createAgentUIStreamResponse` + `useChat` 构建 **流式对话工作台**，实时展示 tool 调用状态与最终回答。  
5. 基于 Agent Lifecycle Callbacks 沉淀 **运行轨迹（Traces）**，支持步骤/工具耗时观测，便于调试与面试演示可观测性。  
6. 提供健康检查、工作区 API、GitHub Actions（lint/build），保证项目可克隆、可构建、可演示。

---

## 提升了什么（Impact / 量化写法）

没有真实业务流量时，用「工程收益 / 能力覆盖」表述（避免虚假数据）：

1. 将「单次 LLM 问答」升级为 **可多步协作的 Agent 运行时**，工具与子代理可独立扩展，后续接入 MCP/真实检索成本更低。  
2. 通过 Subagent 摘要回传，**控制主对话上下文规模**，避免长调研任务拖垮主编排连贯性。  
3. Trace + Artifacts + Memory 三面板，把黑盒生成变成 **可解释执行过程**，面试/评审可逐步回放决策路径。  
4. 统一 AI SDK Agent 范式后，新工具接入只需声明 schema + execute，**扩展路径标准化**。

若面试官追问量化，可诚实说：  
「当前是作品集级系统，重点验证架构完整性；上线后将用任务完成率、平均步数、工具正确率、P95 延迟做评测。」

---

## 简历条目模板（推荐粘贴版）

**ForgeAgent｜多 Agent 编排工作台｜个人项目**  
`Next.js · Vercel AI SDK · TypeScript · ToolLoopAgent`

- 使用 AI SDK `ToolLoopAgent` 构建主编排 Agent，实现多步工具调用与停止条件控制，完成任务规划到结果交付的闭环。  
- 引入 Research/Analyst/Writer Subagent 委派机制，隔离高消耗调研与成文流程，保持主 Agent 上下文可控。  
- 实现 Memory / Artifacts / Trace 可观测能力，支持会话记忆检索、产物落盘与工具执行轨迹展示。  
- 搭建流式对话 UI 与 CI 构建流水线，形成可演示、可讲解的 Agent 工程作品。

---

## 面试 30 秒口述

我做了一个叫 ForgeAgent 的多 Agent 工作台。核心不是聊天框，而是用最新 AI SDK 的 ToolLoopAgent 做编排：主代理会自己选工具，复杂调研和分析会委派给 Subagent，最后还能把结论写进 Memory、把报告存成 Artifact，并且每一步 tool 调用都有 Trace。这个项目用来证明我能把 Agent 从 demo 做到可观测、可扩展的工程形态。
