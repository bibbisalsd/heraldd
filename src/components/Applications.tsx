import styles from "./Applications.module.css";
import GsapSection from "./GsapSection";

const APPS = [
  {
    title: "Voice Assistants",
    desc: "Local, private, fast. No cloud API dependency. Ten specialist model seats on a single consumer GPU via sequential relay. <100ms deterministic routing through the 5-stage cascade. The LLM adds polish, not intelligence.",
    tag: "Consumer",
  },
  {
    title: "Enterprise Chatbots",
    desc: "Auditable decision paths for compliance teams. Every routing decision is traceable code, not black-box reasoning. SOC 2 and HIPAA-friendly by architecture.",
    tag: "Enterprise",
  },
  {
    title: "Safety-Critical Systems",
    desc: "Medical triage, legal document analysis, financial advisory. Where LLM hallucination isn't an inconvenience -- it's a liability. Deterministic routing eliminates hallucinated tool calls entirely.",
    tag: "Regulated",
  },
  {
    title: "Edge & IoT Deployment",
    desc: "A 1B parameter renderer handles most turns. Sequential relay loads specialist seats on-demand to conserve VRAM. Most turns skip inference entirely. Runs on devices where you can't afford cloud latency, bandwidth costs, or API rate limits.",
    tag: "Hardware",
  },
  {
    title: "Multi-Agent Orchestration",
    desc: "Ten specialist model seats coordinate through a shared world-state model, not competing LLM context windows. BG1 streaming delivers real-time progress at 15%, 60%, 95%. Deterministic routing across 171 modules means code orchestrates, not prompt engineering.",
    tag: "Infrastructure",
  },
  {
    title: "Self-Improving Systems",
    desc: "The CRSIS path built on Concept D. A deterministic brain with a world-state model can version, diff, test, and roll back its own decision logic. Self-modification that is safe because it is transparent.",
    tag: "Research",
  },
  {
    title: "Evidence-Critical AI",
    desc: "Every claim traced to evidence. Medical, legal, financial \u2014 where 'the model said so' is not acceptable. Skeptic tags every output as observed, recalled, inferred, or guessed.",
    tag: "Trust",
  },
];

export default function Applications() {
  return (
    <GsapSection id="applications" className="section">
      <div className="section-label">Applications</div>
      <h2 className="section-title">Where Herald changes the calculus.</h2>
      <div className="section-body">
        <p>
          The Herald pattern is most valuable where speed, reliability,
          auditability, or cost constraints make the conventional
          LLM-as-brain approach impractical or unacceptable. With 46k+ lines of
          deterministic code and ten specialist model seats, the architecture
          is production-scale.
        </p>
      </div>

      <div className={styles.grid}>
        {APPS.map((a) => (
          <div key={a.title} className={`${styles.card} gs-child glass-panel`}>
            <div className={styles.tag}>{a.tag}</div>
            <div className={styles.title}>{a.title}</div>
            <div className={styles.desc}>{a.desc}</div>
          </div>
        ))}
      </div>
    </GsapSection>
  );
}
