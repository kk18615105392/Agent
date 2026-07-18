# ForgeAgent｜面试说明（完整版）

> 投递方向：Agent 工程师 / AI 应用开发 / LLM 应用工程师 / 智能体平台开发  
> 仓库：https://github.com/kk18615105392/Agent  
> 本地运行：[docs/setup.md](docs/setup.md)

---

## 1. 一句话 / 三段介绍

**一句话**  
基于 Vercel AI SDK 的多 Agent 编排工作台：主编排代理自主调用工具，把调研 / 分析 / 写作委派给 Subagent，并提供 Memory、Artifacts、Trace，形成可观测的 Agent 工程闭环。

**项目背景（面试开场 20 秒）**  
很多“AI 项目”停在 ChatUI。真正的 Agent 岗更关心：工具怎么选、多步怎么停、上下文怎么不爆、子任务怎么隔离、结果怎么可解释。ForgeAgent 就是围绕这些问题做的可运行作品。

**技术关键词**  
`ToolLoopAgent` · `Subagents` · `Tool Calling` · `Streaming UI` · `Session Memory` · `Artifacts` · `Lifecycle Trace` · `Next.js`

---

## 2. 简历可直接粘贴

**ForgeAgent｜多 Agent 编排工作台｜个人项目**  
`Next.js · Vercel AI SDK 7 · TypeScript · ToolLoopAgent`

- 使用 AI SDK `ToolLoopAgent` 构建主编排 Agent，实现多步工具调用与 `stepCountIs` 停止条件，完成「规划 → 执行 → 交付」闭环。  
- 设计 Research / Analyst / Writer 三类 Subagent 委派机制，隔离高消耗调研与成文，控制主 Agent 上下文规模。  
- 实现 Knowledge / Plan / Memory / Artifacts 等工具集，支持检索、任务拆解、会话记忆与产物落盘。  
- 基于 Lifecycle Callbacks 输出运行轨迹（Trace），配合流式 UI 展示 tool 状态，提升可观测性与可讲解性。  
- 沉淀标准化扩展方式：新增能力以 Tool / Subagent 形式接入，降低后续接 MCP、真实检索的改造成本。

---

## 3. 我完成了什么（What）

### 3.1 运行时与编排
1. 主编排 Agent：`ToolLoopAgent` + 系统指令约束角色与工具使用策略。  
2. 循环控制：`stepCountIs` 限制最大步数，避免无限 tool loop。  
3. 流式接口：`createAgentUIStreamResponse` 对前端输出 UI Message Stream。  

### 3.2 多 Agent 协作
4. Research Subagent：知识库 + 模拟检索，产出结构化调研摘要。  
5. Analyst Subagent：指标 / 风险 / 计划拆解，必要时调用计算工具。  
6. Writer Subagent：把材料整理成 Markdown 报告并 `saveArtifact`。  
7. 委派工具：`delegateResearch / delegateAnalysis / delegateWriting`，主代理按需调用。  

### 3.3 工具与状态
8. 共享工具：`searchKnowledge`、`createTaskPlan`、`saveMemory`、`recallMemory`、`saveArtifact`、`calculate`、`mockWebSearch` 等。  
9. Session Memory：跨轮次保存关键结论，支持检索召回。  
10. Artifacts：计划 / 报告等可交付产物落盘，侧边栏可查看。  

### 3.4 可观测与工程化
11. Lifecycle Trace：`onStart / onStep* / onToolExecution*` 记录执行轨迹。  
12. 工作台 UI：对话区 + Traces / Artifacts / Memory 三面板。  
13. Health / Workspace API：便于演示与状态检查。  
14. CI：GitHub Actions 执行 lint + build，保证可构建。

---

## 4. 我提升了什么（Impact）

| 维度 | 之前常见形态 | ForgeAgent 提升点 |
|------|--------------|-------------------|
| 交互形态 | 单轮问答 | 多步 Agent Loop，可连续调工具 |
| 复杂任务 | 全塞进一个 prompt | Subagent 拆分，主代理只拿摘要 |
| 上下文 | 越聊越臃肿 | 调研上下文卸载，主编排更稳 |
| 可解释性 | 只看最终文本 | Trace 可见每步工具与耗时 |
| 可扩展性 | 改 prompt 硬编码 | Tool / Subagent 插件化扩展 |
| 交付物 | 聊天记录即结果 | Artifacts 形成可复用文档 |

**诚实口径（量化追问时）**  
当前是作品集级系统，重点验证架构完整性；若上线，建议用：任务完成率、工具调用正确率、平均步数、P95 延迟、人工介入率做评测。

---

## 5. 架构怎么讲（白板 2 分钟）

```text
用户目标
   │
   ▼
Orchestrator (ToolLoopAgent)
   │ 自行选择 tools
   ├─ createTaskPlan / searchKnowledge / calculate ...
   ├─ delegateResearch ──► Research Subagent ──► 摘要
   ├─ delegateAnalysis ──► Analyst Subagent ──► 分析
   └─ delegateWriting  ──► Writer Subagent  ──► 报告(Artifact)
   │
   ├─ saveMemory（沉淀结论）
   └─ Trace（每步可观测）
```

**设计取舍（必讲）**
- 主代理负责编排与决策，不负责重活细节。  
- Subagent 负责高 token / 专项工具域，结果用摘要回传。  
- Trace 不替代日志系统，但足够支撑面试演示与调试。  
- Memory 与 Artifacts 分离：一个服务推理，一个服务交付。

---

## 6. 核心代码索引（对着讲）

| 想讲的点 | 文件 |
|----------|------|
| 主编排 Agent / Trace | `src/lib/agents/orchestrator.ts` |
| Subagent 与委派 | `src/lib/agents/subagents.ts` |
| 工具集 | `src/lib/tools/index.ts` |
| 知识库 | `src/lib/knowledge/base.ts` |
| 会话记忆 | `src/lib/memory/session.ts` |
| 产物 | `src/lib/artifacts/store.ts` |
| 轨迹存储 | `src/lib/traces/store.ts` |
| 流式 API | `src/app/api/chat/route.ts` |
| 对话 UI | `src/components/chat-app.tsx` |
| 侧栏可观测 | `src/components/workspace-panel.tsx` |

---

## 7. 面试官高频问答（加长版）

### Q1：为什么是 Agent，而不是普通 Chatbot？
因为系统具备：**多步决策、工具执行、状态沉淀、子任务委派**。最终答案依赖中间工具结果，不是一次补全。

### Q2：ToolLoopAgent 比手写 while 循环好在哪？
- 统一封装 model / tools / stopWhen / lifecycle  
- 少样板代码，行为更一致  
- 便于在 API / 脚本 / 评测里复用同一 Agent 定义  

### Q3：什么时候该上 Subagent？什么时候不该？
**该上**：信息探索很重、需要并行调研、工具权限要隔离、主上下文快爆。  
**不该上**：单工具就能解决、延迟敏感、任务极简单（Subagent 会增加延迟与复杂度）。

### Q4：如何防止 Agent 死循环？
- `stepCountIs` 限制最大步数  
- 指令约束“信息足够就停止并总结”  
- 后续可加：重复工具调用检测、预算（token/费用）熔断、人工审批  

### Q5：Memory 怎么设计的？和生产差距？
当前是进程内 Session Memory（演示级）。生产应分层：  
Working Memory（当前对话）→ Session Summary → Long-term（向量库/用户偏好），并做权限与过期策略。

### Q6：如何评测这个 Agent？
建议四类指标：  
1. 任务成功 / 部分成功 / 失败  
2. 工具选择正确率、参数正确率  
3. 平均步数、超时率  
4. 幻觉与违规（乱调危险工具）  
固定一批 golden prompts，回归对比版本。

### Q7：和 LangGraph / AutoGen 比呢？
本项目刻意站在 **AI SDK 原生 Agent** 路线：更贴 Next.js 全栈与 Vercel 生态，强调工程可落地。LangGraph 更偏图编排与复杂状态机；AutoGen 更偏多角色对话框架。选型看团队栈与编排复杂度。

### Q8：安全上你怎么做？
当前演示工具偏只读/本地安全。生产必须：  
工具白名单、参数校验、敏感工具 `toolApproval`、审计日志、密钥不进 prompt、输出脱敏。

### Q9：如果让你一周迭代，优先做什么？
1. 真实 Web Search / 企业知识库（RAG）  
2. MCP Client 接入外部工具  
3. toolApproval（高风险操作人工确认）  
4. 持久化 Memory + Trace（DB）  
5. 离线评测集与回归 CI  

### Q10：这个项目最大的不足是什么？（加分诚实题）
- 检索是 mock / 本地知识库，不是生产检索  
- Memory/Trace 未持久化  
- 缺少正式评测集与线上观测（如 Langfuse）  
- 尚未做严格的 Human-in-the-loop 审批流  

---

## 8. 场景题怎么答（STAR）

### 场景 A：用户说“帮我做 Agent 评测方案”
- **S**：目标模糊，需要结构  
- **T**：给出可执行评测框架  
- **A**：Orchestrator → `createTaskPlan` / `delegateAnalysis`，必要时 Writer 落报告  
- **R**：侧栏出现 Plan/Report，Trace 可见工具链  

### 场景 B：长调研导致主对话变慢变乱
- **S**：上下文膨胀  
- **T**：保持主编排稳定  
- **A**：`delegateResearch` 把重活丢给 Subagent，只回摘要  
- **R**：主上下文更干净，结果仍完整  

### 场景 C：需要可解释给面试官看
- **S**：黑盒生成难讲  
- **T**：证明每一步在干什么  
- **A**：Lifecycle Trace + UI 展示 tool 状态  
- **R**：可逐步回放决策路径  

---

## 9. 30 秒 / 2 分钟口述稿

**30 秒**  
我做了 ForgeAgent：用 AI SDK 的 ToolLoopAgent 做主编排，复杂任务委派给 Research/Analyst/Writer 三个 Subagent，并且有 Memory、Artifacts 和 Trace。重点证明我能把 Agent 做成可观测、可扩展的工程系统，而不是只有一个聊天框。

**2 分钟**  
先讲问题：Chatbot 不够，Agent 要会用工具、会多步、还得可控。  
然后讲结构：主代理编排，Subagent 干重活，摘要回流。  
再讲工程：工具集、记忆、产物、轨迹、流式 UI。  
最后讲演进：接 MCP、真实检索、审批、评测与持久化。  
如果现场有环境，我会跑三个演示问题，让面试官直接看 Trace。

---

## 10. 现场演示剧本（建议背熟）

1. **Subagent 调研**  
   提示词：`请调研 Subagent 的适用场景，并输出面试可讲要点。`  
   观察：`delegateResearch`、Research 工具调用、最终结构化摘要。  

2. **评测方案**  
   提示词：`帮我制定一个 Agent 评测方案，包含指标、风险和验收标准。`  
   观察：计划工具 / 分析委派、Artifacts 是否出现。  

3. **工具 + 记忆**  
   提示词：`计算 (128 + 64) * 0.15，并把结论写入记忆。`  
   观察：`calculate` → `saveMemory`，Memory 面板可见。  

**演示话术**  
“请看右侧 Trace：这不是一次性生成，而是一步步选工具；Subagent 回来的是摘要，所以主对话不会被调研细节撑爆。”

---

## 11. 简历项目描述（中/英可选）

**中文（项目描述栏）**  
设计并实现基于 Vercel AI SDK 的多 Agent 编排系统，支持 Tool Loop、Subagent 委派、会话记忆、产物落盘与运行轨迹可视化，面向 Agent 工程能力展示与面试讲解。

**English（optional）**  
Built a multi-agent orchestration studio with Vercel AI SDK ToolLoopAgent, featuring subagent delegation, tool calling, session memory, artifacts, and lifecycle traces for observable agent workflows.

---

## 12. 自我检验清单（面试前打勾）

- [ ] 能画出主代理 / Subagent / Trace 关系图  
- [ ] 能解释为何需要 `stepCountIs`  
- [ ] 能说清 Memory vs Artifacts  
- [ ] 能举一个“该用 / 不该用 Subagent”的例子  
- [ ] 能承认当前不足并给出一周迭代计划  
- [ ] 能对着三个演示提示词走完流程  
- [ ] 简历条目与仓库 README 表述一致  

---

## 13. 岗位匹配说明（写给自己）

这个项目证明你具备：
- Agent 运行时理解（loop / tools / stop）  
- 多代理协作与上下文管理  
- 可观测性与工程化表达能力  
- 对生产缺口（MCP、审批、评测）有清晰认知  

更适合投：Agent 平台、AI 应用、Copilot/助手、智能客服编排、内部 Agent 中台等方向。  
