import styles from "./Business.module.css";
import GsapSection from "./GsapSection";

const POINTS = [
  {
    title: "70-85% Inference Cost Reduction",
    desc: "Most AI agent deployments burn tokens on every routing decision, every tool selection, every intermediate reasoning step. Herald's 5-stage cascade eliminates inference on the majority of interactions. Ten specialist model seats run locally via sequential relay at zero API cost.",
    metric: "Cost",
  },
  {
    title: "100x Faster Common Interactions",
    desc: "<100ms routing latency through the 5-stage cascade for decisions that take traditional architectures 1-3 seconds. BG1 streaming delivers real-time progress updates for heavy tasks. In voice interfaces, fast response starts naturally.",
    metric: "Speed",
  },
  {
    title: "Auditable Decision Paths for Compliance",
    desc: "Regulated industries (healthcare, finance, legal) need to explain why an AI system made a decision. When the LLM is the brain, that explanation is \"the model thought so.\" With Herald, it's 46k+ lines of deterministic code across 171 modules you can step through in a debugger.",
    metric: "Compliance",
  },
  {
    title: "Zero Hallucinated Tool Calls",
    desc: "LLMs hallucinate function calls, fabricate arguments, and call the wrong tools. Herald makes this structurally impossible -- the LLM never selects tools. For industries where a wrong API call has consequences, this isn't a feature. It's a requirement.",
    metric: "Reliability",
  },
  {
    title: "Model-Agnostic by Architecture",
    desc: "Each of the ten model seats is a swappable rendering port. Switch from llama to deepseek to gemma4 without touching the brain. Sequential relay manages VRAM across all seats on a single GPU. When a better model ships, swap it in with a config change.",
    metric: "Flexibility",
  },
  {
    title: "Resilience Without Redundancy",
    desc: "Traditional architectures need failover clusters, load balancers, and API quota management to stay alive. Herald's degraded mode works without any of the ten model seats. The deterministic brain across 171 modules never stops. You don't need redundancy for something that doesn't fail.",
    metric: "Uptime",
  },
];

export default function Business() {
  return (
    <GsapSection id="business" className="section">
      <div className="section-label">Business Case</div>
      <h2 className="section-title">
        Every company running LLM agents is burning tokens on decisions that
        don&apos;t need a model.
      </h2>
      <div className="section-body">
        <p>
          The AI agent market is projected to reach $47B by 2030. Every player
          in it is building on the same assumption: the LLM must be in the
          critical path. Herald challenges that assumption with concrete,
          measurable advantages.
        </p>
      </div>

      <div className={styles.grid}>
        {POINTS.map((p) => (
          <div key={p.title} className={`${styles.card} gs-child glass-panel`}>
            <div className={styles.metric}>{p.metric}</div>
            <div className={styles.title}>{p.title}</div>
            <div className={styles.desc}>{p.desc}</div>
          </div>
        ))}
      </div>

    </GsapSection>
  );
}
