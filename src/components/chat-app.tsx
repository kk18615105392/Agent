"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useMemo, useState } from "react";
import { WorkspacePanel } from "@/components/workspace-panel";

const prompts = [
  "请调研 Subagent 的适用场景，并输出一份面试可讲的要点清单。",
  "帮我制定一个 Agent 评测方案，包含指标与风险。",
  "计算 (128 + 64) * 0.15，并把结论写入记忆。",
];

function partText(part: UIMessage["parts"][number]): string | null {
  if (part.type === "text" && "text" in part) return part.text;
  return null;
}

function toolLabel(part: UIMessage["parts"][number]): string | null {
  if (typeof part.type === "string" && part.type.startsWith("tool-")) {
    return part.type.replace(/^tool-/, "");
  }
  return null;
}

export function ChatApp() {
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/chat" }),
    [],
  );
  const { messages, sendMessage, status, error, stop } = useChat({
    transport,
  });
  const [input, setInput] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const busy = status === "submitted" || status === "streaming";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    await sendMessage({ text });
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="mx-auto grid h-dvh max-w-[1400px] grid-cols-1 md:grid-cols-[1fr_340px]">
      <main className="flex min-h-0 flex-col">
        <header className="border-b border-[var(--line)] px-6 py-5">
          <p className="font-mono text-xs tracking-[0.2em] text-[var(--accent)]">
            FORGEAGENT
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight md:text-3xl">
            Multi-Agent 编排工作室台
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-[var(--muted)]">
            基于最新 Vercel AI SDK：ToolLoopAgent、Subagent 委派、Tool Calling、
            Session Memory、Artifacts 与运行轨迹。面向 Agent 工程岗位作品集。
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {["ToolLoop", "Subagents", "Memory", "Traces", "Streaming"].map((t) => (
              <span
                key={t}
                className="rounded border border-[var(--line)] px-2 py-0.5 font-mono text-[11px] text-[var(--muted)]"
              >
                {t}
              </span>
            ))}
          </div>
        </header>

        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5">
          {messages.length === 0 && (
            <div className="rounded border border-dashed border-[var(--line)] p-5">
              <p className="mb-3 text-sm text-[var(--muted)]">试试这些提示：</p>
              <div className="flex flex-col gap-2">
                {prompts.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setInput(p)}
                    className="rounded border border-[var(--line)] bg-black/20 px-3 py-2 text-left text-sm hover:border-[var(--accent)]"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((m) => (
            <article
              key={m.id}
              className={`rounded-lg border px-4 py-3 ${
                m.role === "user"
                  ? "ml-8 border-[var(--accent)]/30 bg-[rgba(62,207,142,0.08)]"
                  : "mr-4 border-[var(--line)] bg-black/20"
              }`}
            >
              <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-[var(--muted)]">
                {m.role}
              </div>
              <div className="space-y-2 whitespace-pre-wrap text-sm leading-relaxed">
                {m.parts.map((part, i) => {
                  const text = partText(part);
                  if (text) return <p key={i}>{text}</p>;
                  const tool = toolLabel(part);
                  if (tool) {
                    return (
                      <div
                        key={i}
                        className="rounded border border-[var(--line)] bg-black/30 px-2 py-1 font-mono text-[11px] text-[var(--accent-2)]"
                      >
                        tool · {tool}
                        {"state" in part ? ` · ${String(part.state)}` : ""}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </article>
          ))}

          {error && (
            <div className="rounded border border-[var(--danger)]/50 bg-[rgba(239,107,74,0.1)] px-4 py-3 text-sm text-[var(--danger)]">
              {error.message}
            </div>
          )}
        </div>

        <form
          onSubmit={onSubmit}
          className="border-t border-[var(--line)] px-6 py-4"
        >
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="描述一个 Agent 任务…"
              className="min-w-0 flex-1 rounded border border-[var(--line)] bg-black/30 px-3 py-3 text-sm outline-none ring-[var(--accent)] focus:ring-1"
            />
            {busy ? (
              <button
                type="button"
                onClick={() => stop()}
                className="rounded bg-[var(--danger)] px-4 py-3 text-sm font-semibold text-white"
              >
                停止
              </button>
            ) : (
              <button
                type="submit"
                className="rounded bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-[#062016]"
              >
                发送
              </button>
            )}
          </div>
        </form>
      </main>

      <WorkspacePanel refreshKey={refreshKey} />
    </div>
  );
}
