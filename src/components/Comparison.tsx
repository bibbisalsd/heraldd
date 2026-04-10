import styles from "./Comparison.module.css";
import GsapSection from "./GsapSection";

const CAPABILITIES = [
  {
    label: "Cost per turn",
    claude: "$0.01 - $0.10",
    autogpt: "High API costs",
    chatgpt: "$0.01 - $0.05",
    herald: "$0.00 (Local Hardware)",
    heraldWins: true,
  },
  {
    label: "Hallucination control",
    claude: "System Prompts",
    autogpt: "Self-Reflection",
    chatgpt: "System Prompts",
    herald: "Fact-anchored output gating & Judge",
    heraldWins: true,
  },
  {
    label: "Routing",
    claude: "LLM Tool Calling",
    autogpt: "LLM Agent Loop",
    chatgpt: "LLM Tool Calling",
    herald: "5-stage deterministic (100% known intents)",
    heraldWins: true,
  },
  {
    label: "Tool selection",
    claude: "LLM decides",
    autogpt: "LLM decides",
    chatgpt: "LLM decides",
    herald: "Deterministic code",
    heraldWins: true,
  },
  {
    label: "LLM calls per turn",
    claude: "2-5+",
    autogpt: "5-20+",
    chatgpt: "1-3+",
    herald: "0-1",
    heraldWins: true,
  },
  {
    label: "Offline capability",
    claude: "None",
    autogpt: "None",
    chatgpt: "None",
    herald: "Full (degraded mode)",
    heraldWins: true,
  },
  {
    label: "Decision auditability",
    claude: "Partial (chain traces)",
    autogpt: "Minimal",
    chatgpt: "Partial (run logs)",
    herald: "100% (code paths)",
    heraldWins: true,
  },
  {
    label: "Hallucinated tool calls",
    claude: "Possible",
    autogpt: "Frequent",
    chatgpt: "Possible",
    herald: "Structurally impossible",
    heraldWins: true,
  },
  {
    label: "Typical latency",
    claude: "1-5s",
    autogpt: "10-60s",
    chatgpt: "1-3s",
    herald: "Sub-100ms routing (+ TTS init delay)",
    heraldWins: true,
  },
  {
    label: "Heavy tasks (research, code)",
    claude: "5-30s",
    autogpt: "30-120s",
    chatgpt: "5-30s",
    herald: "5-30s",
    heraldWins: false,
  },
  {
    label: "World-state model",
    claude: "None (stateless)",
    autogpt: "Task list only",
    chatgpt: "Thread context",
    herald: "Persistent structured world-state",
    heraldWins: true,
  },
  {
    label: "Multi-model coordination",
    claude: "Manual chains",
    autogpt: "Single model loop",
    chatgpt: "Single model",
    herald: "10 model seats (7 distinct models)",
    heraldWins: true,
  },
  {
    label: "Output verification",
    claude: "None built-in",
    autogpt: "Self-reflection (same model)",
    chatgpt: "None built-in",
    herald: "Evidence-grounded judge",
    heraldWins: true,
  },
];

export default function Comparison() {
  return (
    <GsapSection id="comparison" className="section">
      <div className="section-label">Head-to-Head</div>
      <h2 className="section-title">
        How Herald compares to the frameworks everyone uses.
      </h2>
      <div className="section-body">
        <p>
          Every major AI agent framework puts the LLM in the decision loop.
          Herald is the only architecture where deterministic code owns every
          routing and tool selection decision. Here&apos;s what that means in
          practice.
        </p>
      </div>

      <div className={`${styles.tableWrap} glass-panel`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.capHeader}>Capability</th>
              <th>Claude CLI</th>
              <th>AutoGPT</th>
              <th>ChatGPT</th>
              <th className={styles.heraldHeader}>Herald / Skeptic</th>
            </tr>
          </thead>
          <tbody>
            {CAPABILITIES.map((row) => (
              <tr key={row.label}>
                <td className={styles.capCell}>{row.label}</td>
                <td>{row.claude}</td>
                <td>{row.autogpt}</td>
                <td>{row.chatgpt}</td>
                <td
                  className={
                    row.heraldWins ? styles.heraldWin : styles.heraldNeutral
                  }
                >
                  {row.herald}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.footnote}>
        Heavy tasks (research, code analysis, vision) take comparable time in
        all architectures because the work itself is irreducibly complex.
        Herald&apos;s advantage is on the targeted 70-85% of interactions that don&apos;t
        need an LLM at all.
      </div>
    </GsapSection>
  );
}
