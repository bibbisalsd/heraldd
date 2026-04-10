"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./HowItWorks.module.css";
import { 
  PIPELINE_NODES, 
  TIERS, 
  TIER1_EXACT, 
  TIER2_STRICT, 
  TIER3_SOFT, 
  TIER3_SEMANTIC, 
  TIER5_KEYWORDS, 
  EXAMPLE_QUERIES 
} from "../data/pipeline";

gsap.registerPlugin(ScrollTrigger);

interface DispatchResult {
  tier: string;
  tierNum: number;
  match: string;
  lane: string;
  llmCalled: boolean;
  latency: string;
}

function classifyQuery(query: string): DispatchResult | null {
  const q = query.trim().toLowerCase().replace(/[?.!,]/g, "");

  if (!q) return null;

  // Stage 1: Exact Match
  for (const word of TIER1_EXACT) {
    if (q === word) {
      return { tier: "Stage 1: Exact Match", tierNum: 1, match: word, lane: "Realtime", llmCalled: false, latency: "<5ms" };
    }
  }

  // Stage 2: Strict Deterministic
  for (const [pattern, match] of TIER2_STRICT) {
    if (pattern.test(q)) {
      return { tier: "Stage 2: Strict Deterministic", tierNum: 2, match, lane: "Realtime", llmCalled: false, latency: "<10ms" };
    }
  }

  // Stage 3: Soft Deterministic
  for (const [pattern, match] of TIER3_SOFT) {
    if (pattern.test(q)) {
      return { tier: "Stage 3: Soft Deterministic", tierNum: 3, match, lane: "Realtime", llmCalled: false, latency: "<25ms" };
    }
  }

  // Stage 4: Semantic Match (Simulated)
  for (const [text, match] of TIER3_SEMANTIC) {
    if (q.includes(text.toLowerCase())) {
      return { tier: "Stage 4: Semantic Match", tierNum: 4, match, lane: "Realtime", llmCalled: false, latency: "100-300ms" };
    }
  }

  // Stage 5: Classifier Fallback
  for (const item of TIER5_KEYWORDS) {
    for (const kw of item.keywords) {
      if (q.includes(kw)) {
        return { tier: "Stage 5: Classifier Fallback", tierNum: 5, match: kw, lane: item.lane, llmCalled: true, latency: "5-30s" };
      }
    }
  }

  return { tier: "Fallback: General Chat", tierNum: 6, match: "no pattern match", lane: "Realtime", llmCalled: true, latency: "200-400ms" };
}

/* ── Scroll-Driven Pipeline Diagram ── */
function PipelineDiagram() {
  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const lineRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      // Animate each node based on scroll position in the container
      PIPELINE_NODES.forEach((node, i) => {
        const nodeEl = nodeRefs.current[i];
        const lineEl = lineRefs.current[i];
        
        if (!nodeEl) return;

        // Node scale/opacity animation
        gsap.fromTo(nodeEl, 
          { scale: 0.8, opacity: 0.3 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            ease: "power2.out",
            scrollTrigger: {
              trigger: nodeEl,
              start: "top 80%",
              end: "top 40%",
              scrub: 0.5,
              toggleActions: "play reverse play reverse",
            }
          }
        );

        // Connector line drawing
        if (lineEl) {
          gsap.fromTo(lineEl,
            { scaleX: 0, opacity: 0 },
            {
              scaleX: 1,
              opacity: 1,
              duration: 0.3,
              ease: "none",
              scrollTrigger: {
                trigger: nodeEl,
                start: "top 60%",
                end: "top 30%",
                scrub: 0.5,
              }
            }
          );
        }
      });
    }, container);

    return () => ctx.revert();
  }, []);

  return (
    <div className={styles.diagram} ref={containerRef}>
      {PIPELINE_NODES.map((node, i) => (
        <div key={i} className={styles.diagramStep}>
          <div
            ref={(el) => { nodeRefs.current[i] = el; }}
            className={styles.diagramNode}
            style={{
              borderColor: node.color,
              boxShadow: `0 0 20px ${node.color}33`,
            }}
          >
            <div
              className={styles.diagramNodeDot}
              style={{ background: node.color }}
            />
            <span className={styles.diagramNodeLabel}>{node.label}</span>
          </div>
          <div className={styles.diagramDesc}>
            {node.desc}
          </div>
          {i < PIPELINE_NODES.length - 1 && (
            <div className={styles.diagramConnector}>
              <div 
                ref={(el) => { lineRefs.current[i] = el; }}
                className={styles.connectorLine} 
              />
              <div className={styles.connectorDot} style={{ background: PIPELINE_NODES[i + 1].color }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ── Query Playground ── */
function QueryPlayground() {
  const [query, setQuery] = useState("What time is it");
  const [result, setResult] = useState<DispatchResult | null>(() => classifyQuery("What time is it"));

  const handleChange = (val: string) => {
    setQuery(val);
    setResult(classifyQuery(val));
  };

  const tierColor = result
    ? result.tierNum === 1 ? "#22c55e"
    : result.tierNum === 2 ? "#3b82f6"
    : result.tierNum === 3 ? "#8b5cf6"
    : result.tierNum === 4 ? "#f59e0b"
    : result.tierNum === 5 ? "#ec4899"
    : "#ef4444"
    : "var(--text-muted)";

  return (
    <div className={styles.playground}>
      <div className={styles.pgTerminal}>
        <div className={styles.pgPrompt}>
          <span className={styles.pgCaret}>&gt;</span>
          <input
            className={styles.pgInput}
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Type a query..."
            spellCheck={false}
          />
        </div>
      </div>

      <div className={styles.pgChips}>
        {EXAMPLE_QUERIES.map((q) => (
          <button
            key={q}
            className={`${styles.pgChip} ${query === q ? styles.pgChipActive : ""}`}
            onClick={() => handleChange(q)}
          >
            {q}
          </button>
        ))}
      </div>

      <div className={styles.pgResult}>
        {result ? (
          <>
            <div className={styles.pgResultRow}>
              <span className={styles.pgResultLabel}>Matched</span>
              <span className={styles.pgResultValue} style={{ color: tierColor }}>{result.tier}</span>
            </div>
            <div className={styles.pgResultRow}>
              <span className={styles.pgResultLabel}>Pattern</span>
              <span className={styles.pgResultMono}>{result.match}</span>
            </div>
            <div className={styles.pgResultRow}>
              <span className={styles.pgResultLabel}>Routed to</span>
              <span className={styles.pgResultMono}>{result.lane}</span>
            </div>
            <div className={styles.pgResultRow}>
              <span className={styles.pgResultLabel}>LLM called</span>
              <span className={result.llmCalled ? styles.pgBad : styles.pgGood}>
                {result.llmCalled ? "Yes" : "No"}
              </span>
            </div>
            <div className={styles.pgResultRow}>
              <span className={styles.pgResultLabel}>Est. latency</span>
              <span className={styles.pgResultMono}>{result.latency}</span>
            </div>
          </>
        ) : (
          <div className={styles.pgEmpty}>Awaiting input — type a query or select one above</div>
        )}
      </div>
    </div>
  );
}

function BG1StreamingMockup() {
  return (
    <div className={styles.bg1Terminal}>
      <div className={styles.bg1Header}>
        <div className={styles.bg1Dots}>
          <span className={styles.bg1Dot} />
          <span className={styles.bg1Dot} />
          <span className={styles.bg1Dot} />
        </div>
        <div className={styles.bg1Title}>BG1 Specialist: deepseek-r1:8b</div>
      </div>
      <div className={styles.bg1Content}>
        <div className={styles.bg1Line}>
          <span className={styles.bg1System}>[System]</span> Routing to Research Specialist...
        </div>
        <div className={styles.bg1Line}>
          <span className={styles.bg1System}>[System]</span> Context loaded (128k window).
        </div>
        <div className={styles.bg1Thinking}>
          [BG1 thinking]
          The user is asking about quantum computing. I need to explain the core concepts 
          of qubits, superposition, and entanglement. I should also mention current 
          limitations like decoherence and the state of NISQ devices.
          Searching evidence store for "quantum computing basics"...
          Found 3 corroborated claims.
        </div>
        <div className={styles.bg1Line}>
          <span className={styles.bg1Output}>Quantum computing leverages the principles of quantum mechanics to perform calculations that are currently impossible for classical computers...</span>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section fade-section">
      <div className="section-label">Technical Deep-Dive</div>
      <h2 className="section-title">How Herald works, step by step.</h2>

      <a href="/explore" className={styles.exploreLink}>
        <div className={styles.exploreBanner}>
          <div className={styles.exploreIcon}>&#x2B22;</div>
          <div>
            <div className={styles.exploreTitle}>Explore the full architecture in 3D</div>
            <div className={styles.exploreDesc}>Orbit, zoom, and click through every component. See how data flows from input to output.</div>
          </div>
          <div className={styles.exploreArrow}>&rarr;</div>
        </div>
      </a>

      <h3 className={styles.subhead}>The Pipeline</h3>
      <PipelineDiagram />

      <h3 className={styles.subhead}>5-Stage Deterministic Routing</h3>
      <div className="section-body">
        <p>No LLM decides where your input goes. Five stages of deterministic classification run in sequence. The first match wins.</p>
      </div>
      <div className={styles.tierGrid}>
        {TIERS.map((t) => (
          <div key={t.tier} className={styles.tierCard}>
            <div className={styles.tierHeader}>
              <span className={styles.tierName}>{t.tier}: {t.name}</span>
              <span className={styles.tierComplexity}>{t.complexity}</span>
            </div>
            <div className={styles.tierDesc}>{t.desc}</div>
          </div>
        ))}
      </div>

      <h3 className={styles.subhead}>Try It: Dispatcher Playground (Simulation)</h3>
      <div className="section-body">
        <p>This is a JavaScript approximation of the Python dispatcher. Type any query and see which tier would catch it, where it routes, and whether the LLM is called. Latency estimates are design targets, not benchmarked values.</p>
      </div>
      <QueryPlayground />

      <h3 className={styles.subhead}>Real-Time BG1 Streaming</h3>
      <div className="section-body">
        <p>Background tasks (BG1) use specialized models like <code>deepseek-r1:8b</code> for deep reasoning. You can see the "thinking" process in real-time before the final answer is rendered.</p>
      </div>
      <BG1StreamingMockup />

      <div className={styles.degradedBox}>
        <div className={styles.degradedLabel}>Degraded Mode</div>
        <p className={styles.degradedText}>
          When the LLM is unavailable&mdash;Ollama crashes, VRAM fills up, model corrupts&mdash;Herald continues operating. The deterministic brain never stops. Responses lose their natural language polish but remain functionally correct.
        </p>
      </div>

      <div className={styles.degradedBox}>
        <div className={styles.degradedLabel}>Skeptic: The Cognitive Layer</div>
        <p className={styles.degradedText}>
          This is the Herald pipeline&mdash;the rendering layer. Skeptic adds a cognitive layer above it: a persistent world-state model, a planner, specialist model seats, and an evidence-grounded judge that feed into this pipeline. See the{" "}
          <a href="/world-model" style={{ color: "var(--accent)", textDecoration: "underline" }}>World Model</a>{" "}
          page for the full Concept D architecture.
        </p>
      </div>
    </section>
  );
}
