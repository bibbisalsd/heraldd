import styles from "./Problem.module.css";
import GsapSection from "./GsapSection";

const FRAMEWORKS = [
  "LangChain",
  "AutoGPT",
  "CrewAI",
  "Claude Code",
  "ChatGPT",
  "OpenAI Assistants",
  "Amazon Bedrock Agents",
  "Google Gemini",
  "Microsoft Copilot",
  "Semantic Kernel",
];

const COSTS = [
  {
    icon: "~",
    label: "Slow",
    desc: "2+ LLM round-trips per query. Claude Code averages 3-8 calls per turn. ChatGPT chains multiple calls for tool use. Every question waits for the model to think, decide, act, then think again.",
  },
  {
    icon: "$",
    label: "Expensive",
    desc: "Tokens burned on every routing decision, every tool selection, every intermediate reasoning step. Cloud APIs charge per token. Herald runs 10 local model seats on a single consumer GPU at zero API cost.",
  },
  {
    icon: "?",
    label: "Unreliable",
    desc: "LLMs hallucinate tool calls, pick wrong functions, format arguments incorrectly, go off-script.",
  },
  {
    icon: "#",
    label: "Unauditable",
    desc: "When something breaks, you're debugging a black box. Why did the model pick that tool with those args?",
  },
  {
    icon: "!",
    label: "Fragile",
    desc: "Model goes down, VRAM fills up, API rate-limits. The entire system is dead. Herald's sequential relay and degraded mode mean the deterministic brain never stops.",
  },
];

export default function Problem() {
  return (
    <GsapSection id="problem" className="section">
      <div className="section-label">The Problem</div>
      <h2 className="section-title">
        The entire industry puts the LLM in the driver&apos;s seat.
      </h2>
      <div className="section-body">
        <p>
          Every major AI agent framework operates on the same assumption:{" "}
          <strong>the LLM is the brain</strong>. It receives user input, decides
          which tools to call, formats arguments, reads results, decides what to
          do next, and composes the final answer. The LLM is in the critical
          path of every single decision.
        </p>
      </div>

      <div className={styles.frameworkGrid}>
        {FRAMEWORKS.map((f) => (
          <div key={f} className={`${styles.frameworkChip} gs-child`}>
            {f}
          </div>
        ))}
        <div className={`${styles.frameworkChipAll} gs-child`}>All LLM-as-brain</div>
      </div>

      <div className={styles.costGrid}>
        {COSTS.map((c) => (
          <div key={c.label} className={`${styles.costCard} gs-child`}>
            <div className={styles.costIcon}>{c.icon}</div>
            <div className={styles.costLabel}>{c.label}</div>
            <div className={styles.costDesc}>{c.desc}</div>
          </div>
        ))}
      </div>
    </GsapSection>
  );
}
