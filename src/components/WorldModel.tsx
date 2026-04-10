import styles from "./WorldModel.module.css";
import GsapSection from "./GsapSection";

const WORLD_STATE_FIELDS = [
  {
    field: "User Profile",
    desc: "Speaker identity, permission level, preferences, interaction history. The system knows who it is talking to.",
  },
  {
    field: "Current Task Stack",
    desc: "Active tasks ordered by priority. What the system is doing right now and what is queued next.",
  },
  {
    field: "Open Background Jobs",
    desc: "BG1 worker status, progress percentage, estimated completion. Heavy tasks tracked in real time.",
  },
  {
    field: "Recent Failures",
    desc: "Last N failures with timestamps, error types, and affected subsystems. Patterns surface automatically.",
  },
  {
    field: "Device Status",
    desc: "Microphone availability, speaker state, screen capture readiness, active window metadata.",
  },
  {
    field: "Tool Availability Map",
    desc: "Which registered tools are currently reachable, healthy, and permitted for the active permission profile.",
  },
  {
    field: "Model Availability Map",
    desc: "Which model seats are loaded, responding, and within latency bounds. CPU vs GPU state tracked.",
  },
  {
    field: "Confidence Ledger",
    desc: "Aggregate confidence across recent turns. Tracks when the system is certain vs when it is guessing.",
  },
];

const COMPONENTS = [
  {
    title: "State Builder",
    desc: "After each tool result, user input, or system event, the state builder applies deterministic update rules to the world-state. No LLM involved. State transitions are diffable and testable. The world-state is never modified by a model \u2014 only by code that processes grounded events.",
  },
  {
    title: "Planner",
    desc: "Reads the current world-state (task stack, failures, availability) and produces an action plan. Not an LLM reasoning about 'what should I do?' \u2014 code reading structured data and applying priority rules. The planner feeds into the existing 5-stage dispatcher.",
  },
  {
    title: "Evidence Store",
    desc: "Every tool result, file read, and screen capture OCR is stored with full provenance: source, timestamp, and confidence. The evidence store never contains inferences or hunches \u2014 only direct observations. This is what the Judge checks claims against.",
  },
  {
    title: "Belief State",
    desc: "Holds what the system thinks is true but cannot prove: inferred user preferences, predicted next actions, default assumptions. It explicitly acknowledges uncertainty. Separate from the evidence store. Can be wrong.",
  },
  {
    title: "Judge / Verifier",
    desc: "Before any output is finalized, the Judge cross-references every claim against the evidence store. Claims with tool-output backing are tagged 'observed'. Claims from memory are 'recalled'. Reasoning chains are 'inferred'. Everything else is 'guessed'. Observed claims take priority.",
  },
];

const MODEL_SEATS = [
  {
    model: "llama3.2:1b/3b",
    role: "Renderer",
    desc: "Handles the majority of turns: greetings, status, time, simple tool calls. <100ms routed. Only routes to specialists when the task requires domain expertise.",
  },
  {
    model: "deepcoder:14b",
    role: "Code Specialist",
    desc: "Code generation, debugging, refactoring, explanation. Runs in the BG1 worker lane with bounded observe-test-reason-retry loops.",
  },
  {
    model: "rnj-1:8b",
    role: "Logic Specialist",
    desc: "Logical reasoning, math, and structured problem solving. BG1 lane with sequential relay — loaded on-demand to conserve VRAM.",
  },
  {
    model: "deepseek-r1:8b",
    role: "Code Reviewer",
    desc: "Deep code review, architectural analysis, and reasoning chains. BG1 lane. Outputs are verified by the Judge against actual execution results.",
  },
  {
    model: "qwen3-vl:8b",
    role: "Vision Specialist",
    desc: "Screen captures, uploaded images, document scans. Processes actual pixel data. Outputs are grounded in what it literally sees.",
  },
  {
    model: "gemma4:12b",
    role: "Research Writer",
    desc: "Research synthesis and long-form summarization. BG1 lane for heavy research tasks requiring extended context.",
  },
  {
    model: "gemma4:4b",
    role: "Fast Reasoner",
    desc: "Quick reasoning for queries that need domain depth beyond the renderer. Realtime lane, sub-second response.",
  },
  {
    model: "Controller + Verifier Prompt",
    role: "Judge / Verifier",
    desc: "Reuses the renderer model (llama3.2:3b) with a specialized verifier prompt. Checks claims against the evidence store via deterministic code in judge.py.",
  },
];

const CLAIM_CATEGORIES = [
  { tag: "Observed", color: "#22c55e", desc: "Directly from tool output, file read, or OCR result. Highest trust." },
  { tag: "Recalled", color: "#4f8ff7", desc: "Retrieved from persistent memory with provenance. Medium-high trust." },
  { tag: "Inferred", color: "#f59e0b", desc: "Derived through reasoning chains. Medium trust. May be wrong." },
  { tag: "Guessed", color: "#ef4444", desc: "Low confidence. No supporting evidence. Flagged explicitly." },
];

export default function WorldModel() {
  return (
    <GsapSection id="world-model" className="section">
      <div className="section-label">Concept D Architecture</div>
      <h2 className="section-title">
        The World Model: A persistent internal model of reality.
      </h2>
      <div className="section-body">
        <p>
          Most AI assistants are stateless turn-by-turn chatbots. They forget
          what just happened. They don&apos;t track what tools are available.
          They can&apos;t tell you what they&apos;re currently working on.
          Skeptic is different. It maintains a persistent, structured world-state
          model that tracks everything the system knows about reality &mdash;
          updated after every event, read by every decision.
        </p>
      </div>

      {/* World-State Fields */}
      <h3 className={styles.subhead}>World-State Fields</h3>
      <div className={styles.fieldGrid}>
        {WORLD_STATE_FIELDS.map((f) => (
          <div key={f.field} className={`${styles.fieldCard} gs-child`}>
            <div className={styles.fieldName}>{f.field}</div>
            <div className={styles.fieldDesc}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Architecture Components */}
      <h3 className={styles.subhead}>Architecture Components</h3>
      <p className={styles.bodyText}>
        Five components work together to maintain the world model and enforce
        evidence-grounded verification. Each has one job. None uses an LLM for
        state management.
      </p>
      <div className={styles.compGrid}>
        {COMPONENTS.map((c) => (
          <div key={c.title} className={styles.compCard}>
            <div className={styles.compTitle}>{c.title}</div>
            <div className={styles.compDesc}>{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Evidence vs Belief */}
      <h3 className={styles.subhead}>Evidence Store vs Belief State</h3>
      <div className={styles.vsGrid}>
        <div className={styles.vsCard}>
          <div className={styles.vsTitle} style={{ color: "#22c55e" }}>
            Evidence Store
          </div>
          <ul className={styles.vsList}>
            <li>Only direct observations</li>
            <li>Full provenance (source, timestamp)</li>
            <li>Cannot contain inferences</li>
            <li>What the Judge checks against</li>
            <li>Ground truth for output assembly</li>
          </ul>
        </div>
        <div className={styles.vsDivider}>
          <span className={styles.vsVs}>vs</span>
        </div>
        <div className={styles.vsCard}>
          <div className={styles.vsTitle} style={{ color: "#f59e0b" }}>
            Belief State
          </div>
          <ul className={styles.vsList}>
            <li>Inferences, hunches, defaults</li>
            <li>Explicitly uncertain</li>
            <li>Can be wrong</li>
            <li>Never merged with evidence</li>
            <li>Useful but never authoritative</li>
          </ul>
        </div>
      </div>

      {/* Claim Categories */}
      <h3 className={styles.subhead}>Claim Categories</h3>
      <p className={styles.bodyText}>
        Every claim that reaches the output is tagged with one of four
        categories. The evidence hierarchy is structural &mdash; architecture
        enforces what prompts cannot.
      </p>
      <div className={styles.claimGrid}>
        {CLAIM_CATEGORIES.map((c) => (
          <div key={c.tag} className={styles.claimCard}>
            <div className={styles.claimTag} style={{ color: c.color, borderColor: c.color }}>
              {c.tag}
            </div>
            <div className={styles.claimDesc}>{c.desc}</div>
          </div>
        ))}
      </div>

      {/* Model Seats */}
      <h3 className={styles.subhead}>Model Seats</h3>
      <p className={styles.bodyText}>
        Not one model doing everything. Ten specialist seats across eight distinct
        models, each with one job, coordinated by deterministic code via sequential relay.
      </p>
      <div className={styles.seatGrid}>
        {MODEL_SEATS.map((s) => (
          <div key={s.role} className={`${styles.seatCard} gs-child glass-panel`}>
            <div className={styles.seatModel}>{s.model}</div>
            <div className={styles.seatRole}>{s.role}</div>
            <div className={styles.seatDesc}>{s.desc}</div>
          </div>
        ))}
      </div>

      {/* Why this matters */}
      <div className={styles.visionBox}>
        <div className={styles.visionTitle}>
          Why this feels closer to AGI
        </div>
        <p className={styles.visionText}>
          A model does not really &ldquo;think forever by itself&rdquo; in the
          magical sense. In practice, a system that behaves like a cognitive
          agent is built from scheduled loops, event listeners, memory refresh
          tasks, background evaluators, and persistent state. Skeptic is exactly
          this: a well-designed cognitive architecture around multiple model
          roles.
        </p>
        <p className={styles.visionText}>
          Esoteric v0.2 stops behaving like a turn-by-turn chatbot. It starts behaving
          like an agent maintaining a live internal model of reality. Not AGI in
          the literal sense. But something much closer to a true cognitive
          system than a normal assistant &mdash; and one that stays honest
          because every claim is checked against grounded evidence.
        </p>
      </div>
    </GsapSection>
  );
}
