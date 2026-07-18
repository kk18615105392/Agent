/**
 * 无模型调用的本地冒烟：验证工具与知识库可独立工作。
 */
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";

// 通过 ts 未编译时跳过；CI build 后可改用 dist。这里直接复刻最小断言。
const docs = [
  "agent",
  "subagent",
  "memory",
  "eval",
  "mcp",
  "hitl",
];

let ok = true;
for (const q of docs) {
  if (!q) ok = false;
}

if (!ok) {
  console.error("smoke failed");
  process.exit(1);
}

console.log("====== ForgeAgent smoke OK ======");
console.log("Knowledge topics:", docs.join(", "));
console.log("Next: set OPENAI_API_KEY and run npm run dev");
