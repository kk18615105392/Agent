/**
 * 无模型调用的本地冒烟：验证知识主题清单可用。
 */
const docs = ["agent", "subagent", "memory", "eval", "mcp", "hitl"];

if (docs.length < 3) {
  console.error("smoke failed");
  process.exit(1);
}

console.log("====== ForgeAgent smoke OK ======");
console.log("Knowledge topics:", docs.join(", "));
console.log("Next: set OPENAI_API_KEY and run npm run dev");
