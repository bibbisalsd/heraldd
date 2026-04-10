import styles from "./Crsis.module.css";
import GsapSection from "./GsapSection";

const CONCEPT_D = [
  {
    title: "State Builder",
    desc: "Processes each event and updates the world-state model. Deterministic transitions. No LLM involved in state management. Every state change is diffable and testable.",
  },
  {
    title: "Planner",
    desc: "Reads the structured world-state and produces action plans. Code reading data and applying priority rules, not a model reasoning about 'what should I do next?'",
  },
  {
    title: "Specialist Workers",
    desc: "Code (deepcoder:14b), Logic (rnj-1:8b), Code Reviewer (deepseek-r1:8b), Vision (qwen3-vl:8b), Research (gemma4:12b), Memory, Web, Desktop. Ten seats across eight models. Each worker has one domain. Workers produce evidence, not opinions.",
  },
  {
    title: "Judge / Verifier",
    desc: "Checks outputs against grounded evidence: tool output, file reads, OCR results, memory provenance. Evaluates proof, not plausibility. The last gate before output.",
  },
];

const CLAIM_RULES = [
  {
    num: "1",
    title: "Tag Every Claim",
    desc: "Every internal claim is tagged: observed (tool output), recalled (memory), inferred (reasoning), or guessed (low confidence). No untagged claims reach the output.",
  },
  {
    num: "2",
    title: "Prefer Observed",
    desc: "Final output prefers observed > recalled > inferred > guessed. The evidence hierarchy is structural, not prompt-based. Architecture enforces what prompts cannot.",
  },
  {
    num: "3",
    title: "Evidence Resolves Conflict",
    desc: "When two sources disagree, the source with higher evidence provenance wins. Not the prettier answer. Not the more confident model. The one with proof.",
  },
  {
    num: "4",
    title: "Separate Belief and Evidence",
    desc: "Two stores: what it believes (inference, hunches, defaults) and what it can prove (tool outputs, file reads, OCR results). They are never merged blindly.",
  },
];

const STEPS = [
  {
    num: "1",
    title: "Observe",
    desc: "Every turn logs its routing decision, tool selection, renderer output, and implicit user satisfaction signals. Did the user re-ask the same question? Say \"that's wrong\"? Or accept and move on?",
  },
  {
    num: "2",
    title: "Analyze",
    desc: "Pattern detection runs on the decision log. Which intents are misrouted? Which tool results are empty? Which renderer outputs get corrected by follow-up messages?",
  },
  {
    num: "3",
    title: "Propose",
    desc: "The system generates concrete improvement proposals: new exact-match phrases, adjusted classification thresholds, additional synonym mappings, new tool registrations, new memory retention rules.",
  },
  {
    num: "4",
    title: "Gate",
    desc: "No change applies without human approval. Every proposal shows what it changes, why, what evidence triggered it, and a rollback path. The system cannot modify itself silently.",
  },
  {
    num: "5",
    title: "Apply & Validate",
    desc: "Approved changes are applied atomically with a snapshot taken first. If the test suite fails or the system degrades, automatic rollback restores the previous state. The loop restarts.",
  },
];

const IMPLICATIONS = [
  {
    title: "It Writes Its Own Brain",
    desc: "CRSIS doesn't tune model weights or adjust prompts. It modifies the deterministic code that makes every routing, tool selection, and classification decision. It's rewriting the logic that controls the entire system.",
  },
  {
    title: "Compounding Intelligence",
    desc: "Each improvement cycle makes the next one more effective. Better routing produces cleaner logs. Cleaner logs produce better analysis. Better analysis produces smarter proposals. The system accelerates its own improvement rate.",
  },
  {
    title: "The Terminator Problem",
    desc: "An AI that can rewrite its own decision-making code is the premise of every runaway AI scenario. Ultron. Skynet. The difference is the gate: CRSIS cannot apply changes without explicit human approval. Remove the gate, and you have an autonomous system that rewrites its own brain. That's why the gate is not optional. It's architectural.",
  },
  {
    title: "Why This Hasn't Been Done",
    desc: "Every other AI system puts the LLM in the decision loop. You can't safely let a black box modify itself because you can't predict, audit, or reverse the changes. Herald's brain is deterministic code. Code can be diffed, tested, versioned, and rolled back. That's what makes self-improvement tractable instead of catastrophic.",
  },
];

export default function Crsis() {
  return (
    <GsapSection id="crsis" className="section">
      <div className="section-label">The Vision</div>
      <h2 className="section-title">
        CRSIS: The system that rewrites its own brain.
      </h2>
      <div className="section-body">
        <p>
          CRSIS&mdash;Continuous Runtime Self-Improvement System&mdash;is
          what turns Herald from a clever architecture into something that
          doesn&apos;t exist yet. But CRSIS doesn&apos;t operate in a vacuum.
          It sits on top of Concept D&apos;s cognitive architecture: a persistent
          world-state model, specialist workers, and an evidence-grounded judge.
          The world model provides the foundation. CRSIS provides the
          self-improvement loop that runs on top of it.
        </p>
      </div>

      <div className={styles.whyBox}>
        <div className={styles.whyTitle}>
          Why this is genuinely dangerous&mdash;and why it works anyway
        </div>
        <p className={styles.whyText}>
          Let&apos;s be direct: an AI system that can rewrite its own
          decision-making logic is the plot of every cautionary AI film ever
          made. The reason those scenarios are terrifying is that the AI
          operates as a black box&mdash;nobody can see what changed or why.
          Skeptic&apos;s brain is not a black box. It&apos;s deterministic
          Python code with a world-state model that tracks every belief
          separately from every piece of evidence. Every change is a git diff.
          Every proposal shows exactly what line changes, what evidence
          triggered it, and what rollback looks like. The danger isn&apos;t
          self-improvement. The danger is self-improvement without
          transparency. Skeptic has transparency by architecture.
        </p>
      </div>

      {/* Concept D Architecture */}
      <h3 className={styles.subhead}>The Cognitive Architecture (Concept D)</h3>
      <p className={styles.bridgeText}>
        Before the system can improve itself, it needs to understand the world
        it operates in. Concept D provides four components that turn Esoteric v0.2 from
        a turn-by-turn chatbot into a system that maintains a live internal
        model of reality.
      </p>
      <div className={styles.implGrid}>
        {CONCEPT_D.map((item) => (
          <div key={item.title} className={styles.implCard}>
            <div className={styles.implTitle}>{item.title}</div>
            <div className={styles.implDesc}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Hallucination Control */}
      <h3 className={styles.subhead}>Hallucination Control Rules</h3>
      <p className={styles.bridgeText}>
        No matter which models are used, these four rules are enforced
        architecturally&mdash;not by prompting. The system cannot bypass them
        because they are built into the Judge and the output assembly pipeline.
      </p>
      <div className={styles.stepGrid}>
        {CLAIM_RULES.map((r) => (
          <div key={r.num} className={styles.stepCard}>
            <div className={styles.stepNum}>{r.num}</div>
            <div className={styles.stepTitle}>{r.title}</div>
            <div className={styles.stepDesc}>{r.desc}</div>
          </div>
        ))}
      </div>

      {/* Bridge to CRSIS */}
      <div className={styles.bridgeBox}>
        <p className={styles.bridgeText}>
          Concept D provides the cognitive architecture&mdash;the world-state
          model, the evidence store, the judge. CRSIS provides the
          self-improvement loop that runs on top of it. Below is how the system
          learns from its own performance.
        </p>
      </div>

      <h3 className={styles.subhead}>The Self-Improvement Loop</h3>
      <div className={styles.stepGrid}>
        {STEPS.map((s) => (
          <div key={s.num} className={styles.stepCard}>
            <div className={styles.stepNum}>{s.num}</div>
            <div className={styles.stepTitle}>{s.title}</div>
            <div className={styles.stepDesc}>{s.desc}</div>
          </div>
        ))}
      </div>

      <h3 className={styles.subhead}>What This Actually Means</h3>
      <div className={styles.implGrid}>
        {IMPLICATIONS.map((imp) => (
          <div key={imp.title} className={styles.implCard}>
            <div className={styles.implTitle}>{imp.title}</div>
            <div className={styles.implDesc}>{imp.desc}</div>
          </div>
        ))}
      </div>

      <div className={styles.quoteBox}>
        <p className={styles.quoteText}>
          The world model is the foundation. The evidence store is the source
          of truth. The judge is the gatekeeper. CRSIS is what makes it
          dangerous. The human gate is what makes it controllable. Remove the
          gate and you have Ultron. Keep the gate and you have something no
          one has built before: a system with a persistent model of reality
          that gets smarter by rewriting itself, with a human hand on the
          kill switch.
        </p>
      </div>
    </GsapSection>
  );
}
