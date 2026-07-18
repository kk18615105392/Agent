"use client";

import { useCallback, useEffect, useState } from "react";

type Workspace = {
  artifacts: Array<{
    id: string;
    title: string;
    kind: string;
    content: string;
    createdAt: number;
  }>;
  memory: Array<{
    id: string;
    content: string;
    tags: string[];
    createdAt: number;
  }>;
  traces: Array<{
    id: string;
    type: string;
    message: string;
    ts: number;
  }>;
};

export function WorkspacePanel({ refreshKey }: { refreshKey: number }) {
  const [data, setData] = useState<Workspace | null>(null);
  const [tab, setTab] = useState<"traces" | "artifacts" | "memory">("traces");

  const load = useCallback(async () => {
    const res = await fetch("/api/workspace");
    if (res.ok) setData(await res.json());
  }, []);

  useEffect(() => {
    void load();
    const t = setInterval(() => void load(), 2500);
    return () => clearInterval(t);
  }, [load, refreshKey]);

  return (
    <aside className="flex h-full min-h-0 flex-col border-l border-[var(--line)] bg-[var(--panel)] backdrop-blur-md">
      <div className="flex gap-1 border-b border-[var(--line)] p-3">
        {(
          [
            ["traces", "轨迹"],
            ["artifacts", "产物"],
            ["memory", "记忆"],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`rounded px-3 py-1.5 text-xs font-semibold transition ${
              tab === key
                ? "bg-[var(--accent)] text-[#062016]"
                : "text-[var(--muted)] hover:text-[var(--ink)]"
            }`}
          >
            {label}
          </button>
        ))}
        <button
          type="button"
          onClick={() => void fetch("/api/workspace", { method: "DELETE" }).then(load)}
          className="ml-auto text-xs text-[var(--muted)] hover:text-[var(--danger)]"
        >
          清空轨迹
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-3 text-sm">
        {tab === "traces" && (
          <ul className="space-y-2 font-mono text-[11px] leading-relaxed text-[var(--muted)]">
            {(data?.traces ?? []).map((t) => (
              <li key={t.id} className="rounded border border-[var(--line)] px-2 py-1.5">
                <span className="text-[var(--accent-2)]">{t.type}</span> · {t.message}
              </li>
            ))}
            {!data?.traces?.length && <li>暂无轨迹。发送一条任务后这里会滚动更新。</li>}
          </ul>
        )}

        {tab === "artifacts" && (
          <ul className="space-y-3">
            {(data?.artifacts ?? []).map((a) => (
              <li key={a.id} className="rounded border border-[var(--line)] p-3">
                <div className="mb-1 text-xs text-[var(--accent)]">{a.kind}</div>
                <div className="font-semibold">{a.title}</div>
                <pre className="mt-2 max-h-48 overflow-auto whitespace-pre-wrap font-mono text-[11px] text-[var(--muted)]">
                  {a.content}
                </pre>
              </li>
            ))}
            {!data?.artifacts?.length && <li className="text-[var(--muted)]">尚无产物。</li>}
          </ul>
        )}

        {tab === "memory" && (
          <ul className="space-y-2">
            {(data?.memory ?? []).map((m) => (
              <li key={m.id} className="rounded border border-[var(--line)] p-3">
                <p>{m.content}</p>
                <div className="mt-1 text-xs text-[var(--muted)]">{m.tags.join(" · ")}</div>
              </li>
            ))}
            {!data?.memory?.length && <li className="text-[var(--muted)]">尚无会话记忆。</li>}
          </ul>
        )}
      </div>
    </aside>
  );
}
