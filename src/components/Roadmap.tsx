import styles from "./Roadmap.module.css";
import GsapSection from "./GsapSection";

const STATS = [
  { value: "46k+", label: "Lines of Code" },
  { value: "171", label: "Python Modules" },
  { value: "107", label: "Test Files" },
  { value: "50+", label: "Deterministic Tools" },
];

const COMPLETED_TASKS = [
  {
    id: "A",
    title: "Conversation Buffer",
    desc: "Bounded turn history with renderer context wiring. The system remembers what was said and can reference prior turns.",
  },
  {
    id: "B",
    title: "Persistent Event Logger",
    desc: "Structured JSONL event logging with daily file rotation. Every turn emits a traceable, replayable record.",
  },
  {
    id: "C",
    title: "Intent Handler Registry",
    desc: "Modular intent-to-handler mapping with runtime registration. New intents plug in without touching the dispatcher.",
  },
  {
    id: "D",
    title: "Dependency Split",
    desc: "Core, dev, voice, and combined requirements files. CI installs only what it needs. Zero runtime dependencies.",
  },
  {
    id: "E",
    title: "Memory Backup & Restore",
    desc: "SQLite memory with backup, restore, list, and prune operations. Facts persist across sessions and survive crashes.",
  },
  {
    id: "F",
    title: "Semantic Matcher Upgrade",
    desc: "Lexical synonym expansion and bigram scoring for intent matching. Handles paraphrases without an embedding model.",
  },
  {
    id: "\u2713",
    title: "CLLM Renderer Wiring",
    desc: "Ollama integration with preferred/fallback model tries and deterministic template fallback. The rendering pipeline is live.",
  },
  {
    id: "G",
    title: "BG1 Result Retrieval",
    desc: "4-level retrieval cascade allowing users to ask for background task outputs asynchronously.",
  },
  {
    id: "H",
    title: "Real-time Terminal Streaming",
    desc: "deepseek-r1 streams its \"thinking\" tokens live to the terminal to show background task progress.",
  },
];

const STOP_POINTS = [
  { id: "A", label: "Pure Complete", desc: "Core build at 100/100. Voice proven on hardware.", after: "Phase 1" },
  { id: "B", label: "Platform Complete", desc: "Full capabilities minus AMD GPU validation.", after: "Phase 4" },
  { id: "C", label: "Full 100%", desc: "AMD proven. Install-pack ships. Everything documented.", after: "Phase 6" },
];

interface Task {
  id: string;
  title: string;
  desc: string;
  owner: string;
  deps: string | null;
  status?: "Built" | "Partial" | "Planned";
}

interface Phase {
  phase: number;
  name: string;
  desc: string;
  accent: string;
  stopPoint?: string;
  tasks: Task[];
}

const PHASES: Phase[] = [
  {
    phase: 1,
    name: "Memory & Fact Anchoring",
    desc: "Establish reliable memory retrieval and contradiction prevention.",
    accent: "var(--accent-green, #22c55e)",
    tasks: [
      { id: "Task G", title: "Fact Anchoring", desc: "Require canonical constraints for facts.", owner: "Codex", deps: null, status: "Built" },
      { id: "Task H", title: "Contradiction Guard", desc: "Pre-save hooks preventing conflicting memory logic.", owner: "Codex", deps: null, status: "Built" },
      { id: "Task I", title: "Confidence Decay", desc: "Decay certainty metrics over time to favor fresh updates.", owner: "Codex", deps: null, status: "Built" },
    ],
  },
  {
    phase: 2,
    name: "Observability & Quality Signals",
    desc: "Robust logging, tracing, and feedback loops for deterministic execution.",
    accent: "var(--accent-green, #22c55e)",
    stopPoint: "A",
    tasks: [
      { id: "Task J", title: "Miss Logging", desc: "Track unhandled user intents directly in jsonl.", owner: "Codex", deps: null, status: "Built" },
      { id: "Task K", title: "Quality Scoring", desc: "Evaluate response fidelity through heuristic scores.", owner: "Codex", deps: "Task G", status: "Built" },
      { id: "Task L", title: "Correction Hook", desc: "Capture real-time feedback and corrections systematically.", owner: "Codex", deps: null, status: "Built" },
    ],
  },
  {
    phase: 3,
    name: "Multimodal & Retrieval Integration",
    desc: "Enable comprehensive input handling for dynamic vision logic and semantic searches.",
    accent: "var(--accent)",
    tasks: [
      { id: "Task M", title: "Code Sandbox", desc: "Isolated environment for untested script generation.", owner: "Codex", deps: null, status: "Built" },
      { id: "Task N", title: "Vision Payloads", desc: "Direct multimodal Ollama request with Base64 payloads.", owner: "Codex", deps: null, status: "Built" },
      { id: "Task O", title: "RAG Retrieval", desc: "Cosine similarity paired with recent-confidence decay filtering.", owner: "Codex", deps: "Task I", status: "Built" },
    ],
  },
  {
    phase: 4,
    name: "Provenance & Auto-Healing",
    desc: "Strictly track origin and provide snapshot rollbacks for agent logic rules.",
    accent: "var(--accent-warm, #f59e0b)",
    stopPoint: "B",
    tasks: [
      { id: "Task P", title: "Memory Provenance", desc: "Tag all semantic items with deterministic sources.", owner: "Codex", deps: null, status: "Built" },
      { id: "Task Q", title: "Rule Versioning", desc: "Support full rollbacks and logging in CRSIS Engine.", owner: "Codex", deps: "Task L", status: "Built" },
      { id: "Task R", title: "Health Dashboard", desc: "Aggregate miss logs, timeouts, and logic skips to terminal.", owner: "Codex", deps: "Task K", status: "Built" },
    ],
  },
];

export default function Roadmap() {
  return (
    <GsapSection id="roadmap" className="section">
      <div className="section-label">Development Roadmap</div>
      <h2 className="section-title">
        From working build to full Skeptic platform.
      </h2>
      <div className="section-body">
        <p>
          <strong>Jarvis Core</strong> is the reference implementation (107 test files, ~46,000 LOC across 171 modules).
          <strong>Esoteric v0.2</strong> is the fully decomposed active runtime featuring a
          PocketMemory graph, NameProfile identity inference, deterministic cognitive layer, and 10 model seats.
        </p>
        <p>
          The roadmap below tracks the completed NH-CRSIS hardening tasks (G–R) and phases 1-4. The complete system
          has reached 100% Core Build completion (Phase 9 completed), adding advanced observability, maintenance ops,
          and robust local Voice pipelines (Kokoro TTS and faster-whisper STT).
        </p>
      </div>

      {/* Stats row */}
      <div className={styles.statRow}>
        {STATS.map((s) => (
          <div key={s.label} className={styles.stat}>
            <div className={styles.statValue}>{s.value}</div>
            <div className={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Score bars */}
      <div className={styles.scoreRow}>
        <div className={styles.scoreCard}>
          <div className={styles.scoreLabel}>Pure Core</div>
          <div className={styles.scoreBarOuter}>
            <div className={styles.scoreBarInner} style={{ width: "100%" }} />
          </div>
          <div className={styles.scoreValue}>100 / 100</div>
        </div>
        <div className={styles.scoreCard}>
          <div className={styles.scoreLabel}>Full Platform</div>
          <div className={styles.scoreBarOuter}>
            <div className={styles.scoreBarInnerWarm} style={{ width: "95%" }} />
          </div>
          <div className={styles.scoreValue}>95 / 100</div>
        </div>
      </div>

      {/* Stop points */}
      <div className={styles.stopPointRow}>
        {STOP_POINTS.map((sp) => (
          <div key={sp.id} className={styles.stopPoint}>
            <div className={styles.stopPointId}>{sp.id}</div>
            <div>
              <div className={styles.stopPointLabel}>{sp.label}</div>
              <div className={styles.stopPointDesc}>{sp.desc}</div>
              <div className={styles.stopPointAfter}>{sp.after}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Completed tasks */}
      <h3 className={styles.subhead}>Foundation &mdash; Tasks A&ndash;F</h3>
      <div className={styles.completedGrid}>
        {COMPLETED_TASKS.map((t) => (
          <div key={t.id} className={`${styles.completedCard} gs-child`}>
            <div className={styles.taskId}>{t.id}</div>
            <div>
              <div className={styles.taskTitle}>{t.title}</div>
              <div className={styles.taskDesc}>{t.desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Phase timeline */}
      {PHASES.map((phase) => (
        <div key={phase.phase} className={styles.phaseBlock} style={{ borderLeftColor: phase.accent }}>
          <div className={styles.phaseHeader}>
            <span className={styles.phaseNum}>Phase {phase.phase}</span>
            <span className={styles.phaseName}>{phase.name}</span>
            {phase.stopPoint && (
              <span className={styles.stopBadge}>Stop Point {phase.stopPoint}</span>
            )}
          </div>
          <p className={styles.phaseDesc}>{phase.desc}</p>
          <div className={styles.taskGrid}>
            {phase.tasks.map((task) => (
              <div key={task.id} className={styles.taskCard}>
                <div className={styles.taskCardHeader}>
                  <span className={styles.taskId}>{task.id}</span>
                  <span className={`${styles.badge} ${task.status === "Built" ? styles.badgeBuilt : ''}`}>{task.status || "Planned"}</span>
                </div>
                <div className={styles.taskTitle}>{task.title}</div>
                <div className={styles.taskDesc}>{task.desc}</div>
                <div className={styles.taskMeta}>
                  <span>{task.owner}</span>
                  {task.deps && (
                    <span className={styles.taskDep}>
                      depends on {task.deps}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Vision callout */}
      <div className={styles.visionBox}>
        <div className={styles.visionTitle}>
          How Skeptic becomes real
        </div>
        <p className={styles.visionText}>
          Skeptic is not a single feature. It&apos;s the convergence of Herald&apos;s
          deterministic pipeline with Concept D&apos;s world-model architecture.
          Phase 0&ndash;1 closes the pure core. Phase 2&ndash;3 gives the system
          real capabilities and specialist depth. Phase 4 opens the addon
          platform. Phase 5&ndash;6 proves the hardware path and ships the
          final build.
        </p>
        <p className={styles.visionText}>
          When all seven phases complete, Esoteric v0.2 becomes a true Local Assistant
          Operating System: a persistent world-state model tracking reality,
          specialist workers producing evidence, and a judge that verifies every
          claim before it reaches the user. Not AGI. Something more
          practical &mdash; a cognitive architecture that stays honest.
        </p>
      </div>

      {/* Closing quote */}
      <div className={styles.quoteBox}>
        <p className={styles.quoteText}>
          The foundation is built. The path is explicit. What remains is
          bounded, artifact-backed finishing work &mdash; not another
          open-ended redesign.
        </p>
      </div>
    </GsapSection>
  );
}
