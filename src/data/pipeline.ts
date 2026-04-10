export const PIPELINE_NODES = [
  { label: "Ingress", desc: "Raw input accepted", color: "#6b7280" },
  { label: "Normalizer", desc: "Wake word stripped, profile mapped", color: "#3b82f6" },
  { label: "Dispatcher", desc: "Intent classified deterministically", color: "#3b82f6" },
  { label: "Lane", desc: "Realtime or background worker", color: "#8b5cf6" },
  { label: "Compiler", desc: "Facts assembled into packet", color: "#3b82f6" },
  { label: "Renderer", desc: "Facts rephrased into speech", color: "#f59e0b" },
  { label: "Formatter", desc: "Internal tokens cleaned", color: "#3b82f6" },
  { label: "Output", desc: "Delivered to sink", color: "#6b7280" },
];

export const TIERS = [
  { 
    tier: "Stage 1", 
    name: "Exact Match", 
    complexity: "O(1)", 
    desc: 'Hardcoded phrases. "time", "status", "help" match instantly. No inference, no scoring.' 
  },
  { 
    tier: "Stage 2", 
    name: "Strict Deterministic", 
    complexity: "O(1)", 
    desc: "Signal-based pattern matching (e.g. asks_time, asks_cancel, asks_weather)." 
  },
  { 
    tier: "Stage 3", 
    name: "Soft Deterministic", 
    complexity: "O(n)", 
    desc: "Synonym expansion and entity extraction for greetings, identity, and app operations." 
  },
  { 
    tier: "Stage 4", 
    name: "Semantic Match", 
    complexity: "Vector", 
    desc: "Embedding-based intent matching via nomic-embed-text for fuzzy intent detection." 
  },
  { 
    tier: "Stage 5", 
    name: "Classifier Fallback", 
    complexity: "O(n)", 
    desc: "Keyword router that assigns unhandled queries to BG1 specialists or general_chat." 
  },
];

export const TIER1_EXACT = ["time", "status", "help", "cancel", "stop", "version"];

export const TIER2_STRICT: [RegExp, string][] = [
  [/what.*time|current.*time|tell.*time/i, "time"],
  [/what.*date|today'?s date|what day/i, "date"],
  [/cancel.*task|stop.*process|abort/i, "cancel"],
  [/what.*weather|weather.*like|forecast/i, "weather"],
];

export const TIER3_SOFT: [RegExp, string][] = [
  [/hello|hi|hey|greetings/i, "greeting"],
  [/who are you|what is your name|your identity/i, "identity"],
  [/who am i|my name/i, "user_identity"],
];

export const TIER3_SEMANTIC: [string, string][] = [
  ["how do you work", "architecture_query"],
  ["tell me about yourself", "identity_query"],
  ["what can you do", "capabilities_query"],
];

export const TIER5_KEYWORDS = [
  { keywords: ["research", "analyze", "deep dive"], lane: "BG1: Research (deepseek-r1)" },
  { keywords: ["code", "debug", "refactor", "fix", "write"], lane: "BG1: Code (deepcoder -> rnj-1)" },
  { keywords: ["vision", "see", "look", "describe"], lane: "BG1: Vision (qwen3-vl)" },
];

export const EXAMPLE_QUERIES = [
  "What time is it",
  "Hello",
  "Research quantum computing",
  "Debug this python script",
  "What do you see?",
  "Status",
];
