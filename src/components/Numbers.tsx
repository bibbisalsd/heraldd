"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./Numbers.module.css";
import GsapSection from "./GsapSection";

const SPEED_ROWS = [
  { query: '"What time is it"', traditional: "1-3s", herald: "<30ms", factor: "~100x" },
  { query: '"What\'s my name"', traditional: "1-3s", herald: "<15ms", factor: "~100x" },
  { query: '"Status"', traditional: "1-2s", herald: "<5ms", factor: "~200x" },
  { query: '"Hello"', traditional: "0.5-1s", herald: "<5ms", factor: "~100x" },
  { query: '"Review this code"', traditional: "5-30s", herald: "5-30s (BG1)", factor: "1x" },
  { query: '"Research quantum computing"', traditional: "5-30s", herald: "5-30s (BG1)", factor: "1x" },
];

const STATS = [
  {
    value: "70-85",
    suffix: "%",
    label: "Zero-inference turns (target)",
    desc: "Design target for interactions handled entirely by deterministic code. The LLM is never called on these paths.",
    isRange: true,
  },
  {
    value: "<50",
    suffix: "ms",
    label: "Target response latency",
    desc: "Design target for exact-match paths. Dictionary lookups and tool calls, not model inference.",
  },
  {
    value: "10",
    suffix: "",
    label: "Specialist model seats",
    desc: "Eight distinct models across ten seats. Sequential relay manages VRAM so all seats share a single consumer GPU.",
  },
  {
    value: "100",
    suffix: "%",
    label: "Decision auditability",
    desc: "Every routing decision has a traceable code path across 171 modules and 46k+ lines of deterministic code.",
  },
  {
    value: "0",
    suffix: "",
    label: "Hallucinated tool calls",
    desc: "The LLM never selects tools. Code selects tools. Wrong tool calls are structurally impossible.",
    isZero: true,
  },
] as const;

function AnimatedNumber({
  value,
  suffix,
  isRange,
  isZero,
}: {
  value: string;
  suffix: string;
  isRange?: boolean;
  isZero?: boolean;
}) {
  const [display, setDisplay] = useState("—");
  const [zeroConfirmed, setZeroConfirmed] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;

          if (isZero) {
            setDisplay("0");
            setTimeout(() => setZeroConfirmed(true), 700);
            return;
          }

          if (isRange) {
            const [loStr, hiStr] = value.split("-");
            const lo = parseInt(loStr, 10);
            const hi = parseInt(hiStr, 10);
            const duration = 1800;
            const startTime = performance.now();
            const tick = (now: number) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);
              const eased = 1 - Math.pow(1 - progress, 3);
              setDisplay(`${Math.round(lo * eased)}\u2013${Math.round(hi * eased)}`);
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            return;
          }

          const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
          const numStr = value.replace(/^[^0-9]*/, "").replace(/[^0-9]/g, "");
          const target = parseInt(numStr, 10) || 0;
          const duration = 1800;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(`${prefix}${Math.round(target * eased)}`);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, isRange, isZero]);

  return (
    <div
      ref={ref}
      className={[
        styles.statValue,
        isZero ? styles.statValueZero : "",
        zeroConfirmed ? styles.statValueZeroConfirmed : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {display}
      <span className={styles.statSuffix}>{suffix}</span>
      {isZero && (
        <span
          className={[
            styles.zeroCheck,
            zeroConfirmed ? styles.zeroCheckVisible : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          ✓
        </span>
      )}
    </div>
  );
}

export default function Numbers() {
  return (
    <GsapSection id="numbers" className="section">
      <div className="section-label">Performance</div>
      <h2 className="section-title">The numbers speak for themselves.</h2>
      <div className="section-body">
        <p>
          Herald doesn&apos;t optimize LLM calls. It eliminates them. 46k+ lines
          of deterministic code across 171 modules, ten specialist model seats,
          and a 5-stage cascade ensure that common queries never touch a model.
          The speedup isn&apos;t incremental&mdash;it&apos;s orders of magnitude.
        </p>
      </div>

      <div className={styles.statGrid}>
        {STATS.map((s) => (
          <div key={s.label} className={`${styles.statCard} gs-child`}>
            <AnimatedNumber
              value={s.value}
              suffix={s.suffix}
              isRange={"isRange" in s ? s.isRange : undefined}
              isZero={"isZero" in s ? s.isZero : undefined}
            />
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statDesc}>{s.desc}</div>
          </div>
        ))}
      </div>

      <h3 className={styles.subhead}>Response Latency: Herald vs Traditional</h3>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Query</th>
              <th>Traditional (LLM-as-Brain)</th>
              <th>Herald (LLM-as-Renderer)</th>
              <th>Speedup</th>
            </tr>
          </thead>
          <tbody>
            {SPEED_ROWS.map((r) => (
              <tr key={r.query}>
                <td className={styles.queryCell}>{r.query}</td>
                <td className={styles.slowCell}>{r.traditional}</td>
                <td className={styles.fastCell}>{r.herald}</td>
                <td className={styles.factorCell}>{r.factor}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.note}>
        Heavy tasks (research, code review, vision) route to BG1 specialist
        seats and take comparable time in both architectures because they require
        actual model inference. Herald&apos;s advantage is on the 70{"\u2013"}85%
        of interactions that the 5-stage cascade resolves without calling a model at all.
      </div>
    </GsapSection>
  );
}
