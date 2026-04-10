"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import styles from "./Inversion.module.css";

interface Segment {
  label: string;
  width: number; // percentage of total bar
  type: "neutral" | "llm" | "code" | "render";
  duration: number; // ms this step "takes" in the animation
}

const TRADITIONAL: Segment[] = [
  { label: "Input", width: 5, type: "neutral", duration: 50 },
  { label: "LLM: Intent", width: 16, type: "llm", duration: 480 },
  { label: "LLM: Pick tool", width: 16, type: "llm", duration: 440 },
  { label: "LLM: Format args", width: 13, type: "llm", duration: 380 },
  { label: "Tool exec", width: 8, type: "neutral", duration: 120 },
  { label: "LLM: Read result", width: 14, type: "llm", duration: 420 },
  { label: "LLM: Compose", width: 18, type: "llm", duration: 520 },
  { label: "Output", width: 10, type: "neutral", duration: 50 },
];

const HERALD: Segment[] = [
  { label: "Input", width: 8, type: "neutral", duration: 5 },
  { label: "5-Stage Cascade", width: 14, type: "code", duration: 3 },
  { label: "Code: Tool", width: 18, type: "code", duration: 8 },
  { label: "Fact Compiler", width: 14, type: "code", duration: 4 },
  { label: "LLM: Render", width: 30, type: "render", duration: 180 },
  { label: "Output", width: 16, type: "neutral", duration: 5 },
];

const TRAD_TOTAL_MS = TRADITIONAL.reduce((s, seg) => s + seg.duration, 0);
const HERALD_TOTAL_MS = HERALD.reduce((s, seg) => s + seg.duration, 0);

function formatMs(ms: number): string {
  if (ms >= 1000) return (ms / 1000).toFixed(2) + "s";
  return ms + "ms";
}

function Lane({
  segments,
  label,
  dotColor,
  activeIndex,
  progress,
  elapsed,
  done,
}: {
  segments: Segment[];
  label: string;
  dotColor: string;
  activeIndex: number;
  progress: number;
  elapsed: number;
  done: boolean;
}) {
  return (
    <div className={styles.lane}>
      <div className={styles.laneHeader}>
        <div className={styles.laneLabel}>
          <span className={styles.laneDot} style={{ background: dotColor }} />
          {label}
        </div>
        <div className={`${styles.laneTimer} ${done ? styles.laneTimerDone : ""}`}>
          {formatMs(elapsed)}
          {done && <span className={styles.doneBadge}>DONE</span>}
        </div>
      </div>

      {/* Segmented progress bar */}
      <div className={styles.bar}>
        {segments.map((seg, i) => {
          const isFilled = i < activeIndex || (i === activeIndex && progress > 0);
          const isActive = i === activeIndex;
          return (
            <div
              key={i}
              className={`${styles.segment} ${styles[`seg_${seg.type}`]} ${
                isFilled ? styles.segFilled : ""
              } ${isActive ? styles.segActive : ""}`}
              style={{ width: `${seg.width}%` }}
            >
              {/* Fill overlay */}
              <div
                className={styles.segFill}
                style={{
                  width: i < activeIndex ? "100%" : isActive ? `${progress * 100}%` : "0%",
                }}
              />
              {/* Pulse dot on active segment */}
              {isActive && !done && (
                <div
                  className={styles.pulseDot}
                  style={{
                    left: `${progress * 100}%`,
                    background: dotColor,
                    boxShadow: `0 0 10px ${dotColor}`,
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Step labels */}
      <div className={styles.segLabels}>
        {segments.map((seg, i) => (
          <div
            key={i}
            className={`${styles.segLabel} ${
              i <= activeIndex ? styles.segLabelActive : ""
            }`}
            style={{ width: `${seg.width}%` }}
          >
            {seg.label}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Inversion() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [tradState, setTradState] = useState({ index: -1, progress: 0, elapsed: 0, done: false });
  const [heraldState, setHeraldState] = useState({ index: -1, progress: 0, elapsed: 0, done: false });
  const animRef = useRef<number>(0);
  const runRef = useRef(0);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const runAnimation = useCallback(() => {
    const run = ++runRef.current;
    const startTime = performance.now();
    // Animation speed multiplier (1 real second = ~600ms simulated for traditional)
    const speedMult = 0.6;

    const tick = (now: number) => {
      if (run !== runRef.current) return;
      const realElapsed = (now - startTime) * speedMult;

      // Traditional lane state
      let tradIdx = -1;
      let tradProg = 0;
      let tradElapsedSim = 0;
      let tradCum = 0;
      for (let i = 0; i < TRADITIONAL.length; i++) {
        if (realElapsed >= tradCum + TRADITIONAL[i].duration) {
          tradCum += TRADITIONAL[i].duration;
          tradIdx = i + 1;
          tradElapsedSim = tradCum;
        } else {
          tradIdx = i;
          tradProg = (realElapsed - tradCum) / TRADITIONAL[i].duration;
          tradElapsedSim = realElapsed;
          break;
        }
      }
      const tradDone = tradIdx >= TRADITIONAL.length;
      if (tradDone) tradElapsedSim = TRAD_TOTAL_MS;

      // Herald lane state
      let herIdx = -1;
      let herProg = 0;
      let herElapsedSim = 0;
      let herCum = 0;
      for (let i = 0; i < HERALD.length; i++) {
        if (realElapsed >= herCum + HERALD[i].duration) {
          herCum += HERALD[i].duration;
          herIdx = i + 1;
          herElapsedSim = herCum;
        } else {
          herIdx = i;
          herProg = (realElapsed - herCum) / HERALD[i].duration;
          herElapsedSim = realElapsed;
          break;
        }
      }
      const herDone = herIdx >= HERALD.length;
      if (herDone) herElapsedSim = HERALD_TOTAL_MS;

      setTradState({
        index: Math.min(tradIdx, TRADITIONAL.length - 1),
        progress: tradDone ? 1 : tradProg,
        elapsed: Math.round(tradElapsedSim),
        done: tradDone,
      });
      setHeraldState({
        index: Math.min(herIdx, HERALD.length - 1),
        progress: herDone ? 1 : herProg,
        elapsed: Math.round(herElapsedSim),
        done: herDone,
      });

      if (!tradDone || !herDone) {
        animRef.current = requestAnimationFrame(tick);
      } else {
        // Both done — pause, then loop
        setTimeout(() => {
          if (run !== runRef.current) return;
          setTradState({ index: -1, progress: 0, elapsed: 0, done: false });
          setHeraldState({ index: -1, progress: 0, elapsed: 0, done: false });
          setTimeout(() => {
            if (run === runRef.current) runAnimation();
          }, 500);
        }, 3500);
      }
    };

    animRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    const delay = setTimeout(() => runAnimation(), 400);
    return () => {
      clearTimeout(delay);
      runRef.current++;
    };
  }, [isVisible, runAnimation]);

  return (
    <section id="inversion" className="section fade-section">
      <div className="section-label">The Inversion</div>
      <h2 className="section-title">
        Move the LLM from the center to the edge.
      </h2>
      <div className="section-body">
        <p>
          Herald inverts the conventional relationship between LLMs and
          application logic. A 5-stage deterministic cascade handles every routing
          decision across ten specialist model seats. The LLM is called once, at
          the very end, to make the answer sound human. Sequential relay manages
          VRAM so all seats share a single GPU.
        </p>
      </div>

      <div className={styles.raceContainer} ref={sectionRef}>
        <Lane
          segments={TRADITIONAL}
          label="Traditional: LLM-as-Brain"
          dotColor="#ef4444"
          activeIndex={tradState.index}
          progress={tradState.progress}
          elapsed={tradState.elapsed}
          done={tradState.done}
        />
        <Lane
          segments={HERALD}
          label="Herald: LLM-as-Renderer"
          dotColor="#4f8ff7"
          activeIndex={heraldState.index}
          progress={heraldState.progress}
          elapsed={heraldState.elapsed}
          done={heraldState.done}
        />
      </div>

      {/* Summary stats */}
      <div className={styles.summaryRow}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>
            <span className={styles.summaryBad}>5</span> LLM calls
          </div>
          <div className={styles.summaryLabel}>~2.4s per turn</div>
        </div>
        <div className={styles.summaryVs}>vs</div>
        <div className={styles.summaryCard}>
          <div className={styles.summaryValue}>
            <span className={styles.summaryGood}>0-1</span> LLM calls
          </div>
          <div className={styles.summaryLabel}>&lt;30ms per turn</div>
        </div>
      </div>

      <div className={styles.keyPoint}>
        <div className={styles.keyLabel}>The key constraint</div>
        <p className={styles.keyText}>
          The LLM receives an <strong>immutable packet</strong> of
          pre-assembled facts from the response compiler. It can rephrase them into
          natural speech. It cannot add new facts, call tools, change the routing
          decision, or reason about what to do next. Ten model seats, one
          rendering boundary. The LLM is a rendering engine for human-readable
          text&mdash;nothing more.
        </p>
      </div>
    </section>
  );
}
