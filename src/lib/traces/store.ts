export type TraceEvent = {
  id: string;
  runId: string;
  ts: number;
  type:
    | "run_start"
    | "step_start"
    | "tool_start"
    | "tool_end"
    | "step_end"
    | "run_end"
    | "error";
  message: string;
  data?: Record<string, unknown>;
};

const MAX_EVENTS = 500;
const events: TraceEvent[] = [];

export function appendTrace(event: Omit<TraceEvent, "id" | "ts"> & { ts?: number }) {
  const row: TraceEvent = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    ts: event.ts ?? Date.now(),
    runId: event.runId,
    type: event.type,
    message: event.message,
    data: event.data,
  };
  events.unshift(row);
  if (events.length > MAX_EVENTS) events.length = MAX_EVENTS;
  return row;
}

export function listTraces(limit = 80): TraceEvent[] {
  return events.slice(0, limit);
}

export function clearTraces() {
  events.length = 0;
}
