"use client";

import styles from "./CognitiveLayer.module.css";
import GsapSection from "./GsapSection";

const SIGNAL_CATEGORIES = [
  {
    name: "Identity",
    color: "var(--accent, #f59e0b)",
    signals: [
      { name: "declared_name", desc: "User declares their name" },
      { name: "declared_age", desc: "User declares their age" },
      { name: "declared_address_preference", desc: "How user wants to be addressed" },
      { name: "mentions_owner", desc: "User refers to themselves" },
      { name: "claims_creator_identity", desc: "User claims to have created Jarvis" },
    ],
  },
  {
    name: "Intent Classification",
    color: "var(--accent-green, #22c55e)",
    signals: [
      { name: "is_query", desc: "Utterance is a question" },
      { name: "asks_time", desc: "Asks for current time" },
      { name: "asks_day", desc: "Asks for current day" },
      { name: "asks_date", desc: "Asks for current date" },
      { name: "asks_status", desc: "Asks system status" },
      { name: "asks_cancel", desc: "Wants to cancel running task" },
      { name: "asks_notify_when_free", desc: "Notify when system becomes free" },
      { name: "asks_identity", desc: "Asks 'what are you'" },
      { name: "asks_wellbeing", desc: "Asks how system feels" },
      { name: "asks_hearing_check", desc: "Asks 'can you hear me'" },
    ],
  },
  {
    name: "Recall Requests",
    color: "var(--accent-warm, #f59e0b)",
    signals: [
      { name: "asks_name_recall", desc: "Asks 'what is my name'" },
      { name: "asks_age_recall", desc: "Asks 'how old am I'" },
      { name: "asks_address_preference_recall", desc: "Asks how system addresses them" },
      { name: "asks_owner_summary", desc: "Asks 'what do you know about me'" },
    ],
  },
  {
    name: "System Inquiry",
    color: "var(--text-secondary, #9ca3af)",
    signals: [
      { name: "asks_runtime_location", desc: "Asks where system runs" },
      { name: "asks_code_location", desc: "Asks where codebase is stored" },
      { name: "asks_workflow", desc: "Asks how system operates" },
      { name: "asks_tools", desc: "Asks what tools are available" },
      { name: "asks_capabilities", desc: "Asks what system can do" },
      { name: "asks_creator_info", desc: "Asks who created system" },
      { name: "asks_architecture_info", desc: "Asks about system architecture" },
    ],
  },
  {
    name: "Inspection Requests",
    color: "var(--accent-blue, #3b82f6)",
    signals: [
      { name: "mentions_codebase", desc: "References the codebase" },
      { name: "mentions_screen", desc: "References screen/display" },
      { name: "wants_code_inspection", desc: "Wants to inspect code" },
      { name: "wants_screen_inspection", desc: "Wants screen capture" },
    ],
  },
  {
    name: "Social & Control",
    color: "var(--accent-purple, #a855f7)",
    signals: [
      { name: "is_greeting", desc: "User greets system" },
      { name: "expresses_gratitude", desc: "User says thank you" },
      { name: "requests_memory_wipe", desc: "Requests memory reset" },
    ],
  },
];

const PROCESS_FLOW = [
  { step: 1, title: "Normalize", desc: "Lowercase, strip punctuation, normalize whitespace" },
  { step: 2, title: "Tokenize", desc: "Split into tokens, apply alias mapping (javis→jarvis)" },
  { step: 3, title: "Stem", desc: "Reduce to stems (running→run, memories→memory)" },
  { step: 4, title: "Pattern Match", desc: "31 boolean signals via lexical patterns, not LLM" },
  { step: 5, title: "Entity Extract", desc: "Capture declared_name, declared_age, address_preference" },
  { step: 6, title: "Route", desc: "Signals feed into 5-stage cascade for intent matching across 10 model seats" },
];

export default function CognitiveLayer() {
  return (
    <GsapSection id="cognitive-layer" className="section">
      <div className="section-label">Deterministic Understanding</div>
      <h2 className="section-title">Cognitive Layer: Pattern-Matching Before LLM</h2>
      <div className="section-body">
        <p>
          Before any of the ten model seats render, before any intent matches,
          the cognitive layer extracts structured understanding from raw input.
          Thirty-one boolean signals. Three entity extractions. Pattern-based
          classification. Zero LLM inference.
        </p>
        <p>
          This is the deterministic foundation that makes Herald&apos;s &quot;code decides&quot;
          philosophy possible across 46k+ lines and 171 modules. The LLM never
          guesses what the user wants — it only renders what the cognitive layer
          has already understood.
        </p>
      </div>

      {/* Stats row */}
      <div className={styles.statRow}>
        <div className={styles.stat}>
          <div className={styles.statValue}>34</div>
          <div className={styles.statLabel}>Signals (31 bool + 3 entity)</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>0</div>
          <div className={styles.statLabel}>LLM calls</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>6</div>
          <div className={styles.statLabel}>Signal categories</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>100%</div>
          <div className={styles.statLabel}>Deterministic</div>
        </div>
      </div>

      {/* Signal categories */}
      <h3 className={styles.archLabel}>Signal Categories</h3>
      <div className={styles.categoryGrid}>
        {SIGNAL_CATEGORIES.map((cat) => (
          <div key={cat.name} className={`${styles.categoryCard} gs-child`}>
            <div className={styles.categoryHeader} style={{ borderColor: cat.color }}>
              <span className={styles.categoryName}>{cat.name}</span>
            </div>
            <div className={styles.signalList}>
              {cat.signals.map((sig) => (
                <div key={sig.name} className={styles.signalItem}>
                  <code className={styles.signalName}>{sig.name}</code>
                  <span className={styles.signalDesc}>{sig.desc}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Process flow */}
      <h3 className={styles.archLabel} style={{ marginTop: "48px" }}>Processing Pipeline</h3>
      <div className={styles.flowGrid}>
        {PROCESS_FLOW.map((step) => (
          <div key={step.step} className={`${styles.flowCard} gs-child`}>
            <div className={styles.flowStep}>Step {step.step}</div>
            <div className={styles.flowTitle}>{step.title}</div>
            <div className={styles.flowDesc}>{step.desc}</div>
          </div>
        ))}
      </div>

      {/* Architecture box */}
      <div className={styles.architectureBox}>
        <div className={styles.archLabel}>Cognitive Layer Flow</div>
        <div className={styles.archFlow}>
          <span className={styles.archNode}>Raw Input</span>
          <span className={styles.archArrow}>&rarr;</span>
          <span className={styles.archNode}>Normalize</span>
          <span className={styles.archArrow}>&rarr;</span>
          <span className={styles.archNode}>Tokenize</span>
          <span className={styles.archArrow}>&rarr;</span>
          <span className={styles.archNode}>Stem</span>
          <span className={styles.archArrow}>&rarr;</span>
          <span className={styles.archNodeAlt}>34 Signals</span>
          <span className={styles.archArrow}>&rarr;</span>
          <span className={styles.archNodeAlt}>Entity Extract</span>
          <span className={styles.archArrow}>&rarr;</span>
          <span className={styles.archNode}>Dispatcher</span>
        </div>
        <p className={styles.archCaption}>
          The cognitive layer runs in under 5ms. Every signal is a boolean computed via
          lexical pattern matching. No embeddings. No vector search. No LLM.
        </p>
      </div>

      {/* Entity extraction detail */}
      <div className={styles.entityBox}>
        <div className={styles.entityTitle}>Entity Extraction</div>
        <div className={styles.entityGrid}>
          <div className={styles.entityCard}>
            <div className={styles.entityName}>declared_name</div>
            <div className={styles.entityPattern}>
              <code>&quot;my name is [X]&quot;</code>
            </div>
            <div className={styles.entityDesc}>
              Extracted via NameProfile from deterministic_understanding.py.
              Supports multi-word names, preserves title case.
            </div>
          </div>
          <div className={styles.entityCard}>
            <div className={styles.entityName}>declared_age</div>
            <div className={styles.entityPattern}>
              <code>&quot;i am [X] years old&quot;</code>
            </div>
            <div className={styles.entityDesc}>
              Regex pattern validates 0-129 range. Stores as string for memory persistence.
            </div>
          </div>
          <div className={styles.entityCard}>
            <div className={styles.entityName}>declared_address_preference</div>
            <div className={styles.entityPattern}>
              <code>&quot;call me [X]&quot;, &quot;address me as [X]&quot;</code>
            </div>
            <div className={styles.entityDesc}>
              Tuple of (primary, secondary?) for nickname handling. Title-cased on extract.
            </div>
          </div>
        </div>
      </div>
    </GsapSection>
  );
}
