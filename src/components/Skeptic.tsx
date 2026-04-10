import styles from "./Skeptic.module.css";
import GsapSection from "./GsapSection";

const STATS = [
  { value: "1845", label: "Lines in main.py" },
  { value: "10", label: "Model seats" },
  { value: "34", label: "Deterministic signals" },
  { value: "643", label: "PocketMemory lines" },
];

const FEATURES = [
  {
    title: "Persistent World-State Model",
    desc: "Every event updates a structured world-state: user profile, task stack, open jobs, recent failures, device status, tool availability, model availability, and confidence ledger. The system knows what it knows.",
  },
  {
    title: "Multi-Model Specialist Seats",
    desc: "Ten specialist seats across eight distinct models. Renderer, vision (lite + BG1), code specialist, logic specialist (rnj-1:8b), code reviewer (deepseek-r1:8b), research writer (gemma4:12b), fast reasoner (gemma4:4b), embedding, and verifier. Each model has one job. Sequential relay manages VRAM.",
  },
  {
    title: "Evidence-Grounded Verification",
    desc: "The Judge checks every output against grounded evidence: tool output, file contents, OCR results, memory provenance. Claims are tagged as observed, recalled, inferred, or guessed. Observed wins.",
  },
  {
    title: "Belief State vs Evidence Store",
    desc: "Separate what the system believes from what it can prove. The belief state tracks inferences and hunches. The evidence store tracks tool outputs and direct observations. Disagreements resolved by evidence, not prettiest answer.",
  },
  {
    title: "Event-Driven Cognition",
    desc: "Long-running thinking is event-driven and scheduled, not blocking. Background jobs report progress at 15%, 60%, 95%. The system thinks asynchronously, not in turn-by-turn lockstep.",
  },
  {
    title: "Herald Core Preserved",
    desc: "Deterministic routing, immutable fact boundaries, static call graph — all still enforced. Skeptic adds cognitive layers on top of Herald's foundation. The LLM still renders. Code still decides.",
  },
];

const MODEL_SEATS = [
  { model: "llama3.2:1b/3b", role: "Renderer", desc: "Fast responses, event watching, majority of turns" },
  { model: "qwen2.5vl:3b", role: "Vision Lite", desc: "Quick screen capture, OCR" },
  { model: "qwen3-vl:8b", role: "Vision BG1", desc: "Heavy visual analysis in background" },
  { model: "deepcoder:14b", role: "Code Specialist", desc: "Code generation, debugging, analysis" },
  { model: "rnj-1:8b", role: "Logic Specialist", desc: "Logical reasoning, math, structured problem solving" },
  { model: "deepseek-r1:8b", role: "Code Reviewer", desc: "Deep code review, architectural analysis, reasoning chains" },
  { model: "gemma4:12b", role: "Research Writer", desc: "Research synthesis, long-form summarization in BG1" },
  { model: "gemma4:4b", role: "Fast Reasoner", desc: "Quick reasoning when renderer needs domain depth" },
  { model: "nomic-embed-text-v2-moe", role: "Embedding", desc: "Semantic search, RAG retrieval" },
  { model: "llama3.2:3b", role: "Judge / Verifier", desc: "Evidence checking, claim tagging (reuses renderer model with verifier prompt)" },
];

export default function Skeptic() {
  return (
    <GsapSection id="skeptic" className="section">
      <div className="section-label">The Judgment System</div>
      <h2 className="section-title">Skeptic: Evidence-Grounded Architecture</h2>
      <div className="section-body">
        <p style={{ marginBottom: 0 }}>
          <strong>Where Herald&apos;s pattern meets Concept D&apos;s world model.</strong>
        </p>
        <p>
          Skeptic is the runtime layer that combines Herald&apos;s deterministic
          pipeline with a persistent world-state model, multi-model specialist
          architecture, and evidence-grounded verification. It&apos;s not one
          model doing everything. It&apos;s eight distinct models across ten
          specialist seats, coordinated by deterministic code via sequential relay,
          with a judge that checks every claim against grounded evidence before it reaches the user.
        </p>
      </div>

      <div className={styles.statRow}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.stat}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      <div className={styles.featureGrid}>
        {FEATURES.map((f) => (
          <div key={f.title} className={`${styles.featureCard} gs-child`}>
            <div className={styles.featureTitle}>{f.title}</div>
            <div className={styles.featureDesc}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Model Seats */}
      <h3 className={styles.archLabel} style={{ marginTop: "48px" }}>Model Seats</h3>
      <div className={styles.seatGrid}>
        {MODEL_SEATS.map((s) => (
          <div key={s.role} className={styles.seatCard}>
            <div className={styles.seatModel}>{s.model}</div>
            <div className={styles.seatRole}>{s.role}</div>
            <div className={styles.seatDesc}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* PocketMemory Architecture */}
      <h3 className={styles.archLabel} style={{ marginTop: "48px" }}>PocketMemory: Entity-Slot-Link Graph</h3>
      <div className={styles.pocketBox}>
        <p className={styles.pocketDesc}>
          PocketMemory is a 643-line graph-based memory system. Entities (users, tools, modules)
          have slots (key-value facts) and links (relationships). Protection levels separate
          canonical system knowledge from dynamic user data.
        </p>
        <div className={styles.pocketGrid}>
          <div className={styles.pocketCard}>
            <div className={styles.pocketTitle}>Entities</div>
            <div className={styles.pocketExample}>self:jarvis, person:owner, tool:*, module:*</div>
            <div className={styles.pocketDetail}>
              Seed entities: self:jarvis, person:creator_james, person:creator_bxserkk,
              architecture:herald_skeptic, codebase:jarviscore
            </div>
          </div>
          <div className={styles.pocketCard}>
            <div className={styles.pocketTitle}>Slots</div>
            <div className={styles.pocketExample}>name, purpose, spoken_purpose, file_path</div>
            <div className={styles.pocketDetail}>
              Each slot has confidence, provenance_type, source, and protection_level
            </div>
          </div>
          <div className={styles.pocketCard}>
            <div className={styles.pocketTitle}>Links</div>
            <div className={styles.pocketExample}>has_persona, belongs_to_project, has_tool</div>
            <div className={styles.pocketDetail}>
              Relationships between entities with confidence and provenance tracking
            </div>
          </div>
          <div className={styles.pocketCard}>
            <div className={styles.pocketTitle}>Protection</div>
            <div className={styles.pocketExample}>canonical vs dynamic</div>
            <div className={styles.pocketDetail}>
              Canonical entities/slots/links cannot be modified without allow_update_protected=true
            </div>
          </div>
        </div>
      </div>

      <div className={styles.architectureBox}>
        <div className={styles.archLabel}>Skeptic Pipeline</div>
        <div className={styles.archFlow}>
          <span className={styles.archNode}>Input</span>
          <span className={styles.archArrow}>&rarr;</span>
          <span className={styles.archNode}>Ingress</span>
          <span className={styles.archArrow}>&rarr;</span>
          <span className={styles.archNodeAlt}>State Builder</span>
          <span className={styles.archArrow}>&rarr;</span>
          <span className={styles.archNodeAlt}>Planner</span>
          <span className={styles.archArrow}>&rarr;</span>
          <span className={styles.archNode}>Dispatcher</span>
          <span className={styles.archArrow}>&rarr;</span>
          <span className={styles.archNodeAlt}>Workers</span>
          <span className={styles.archArrow}>&rarr;</span>
          <span className={styles.archNodeAlt}>Judge</span>
          <span className={styles.archArrow}>&rarr;</span>
          <span className={styles.archNode}>Compiler</span>
          <span className={styles.archArrow}>&rarr;</span>
          <span className={styles.archNodeAccent}>Renderer</span>
          <span className={styles.archArrow}>&rarr;</span>
          <span className={styles.archNode}>Output</span>
        </div>
      </div>
    </GsapSection>
  );
}
