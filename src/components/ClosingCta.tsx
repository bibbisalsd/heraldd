"use client";

import { usePathname } from "next/navigation";
import styles from "./ClosingCta.module.css";

const PAGE_MAP: Record<string, { line: string; cta: string; href: string }> = {
  "/problem":        { line: "Herald inverts this with 10 model seats and zero LLM routing.", cta: "See the pattern →", href: "/pattern" },
  "/pattern":        { line: "46k+ lines of deterministic code. Numbers back this up.", cta: "View benchmarks →", href: "/numbers" },
  "/classification": { line: "See the 5-stage cascade in action.", cta: "How it works →", href: "/how-it-works" },
  "/how-it-works":   { line: "The speedup across 171 modules is measurable.", cta: "View benchmarks →", href: "/numbers" },
  "/numbers":        { line: "See how Herald stacks up against Claude CLI and ChatGPT.", cta: "Compare frameworks →", href: "/comparison" },
  "/comparison":     { line: "Meet the full OS layer — 10 seats, sequential relay.", cta: "Explore Skeptic →", href: "/skeptic" },
  "/skeptic":        { line: "The system rewrites its own brain.", cta: "How CRSIS works →", href: "/crsis" },
  "/crsis":          { line: "Grounded in a persistent world model.", cta: "Explore the world model →", href: "/world-model" },
  "/world-model":    { line: "See it in the real world.", cta: "View applications →", href: "/applications" },
  "/applications":   { line: "The business case is concrete.", cta: "See the numbers →", href: "/business" },
  "/business":       { line: "46k+ LOC, 171 modules — see where it's headed.", cta: "View the roadmap →", href: "/roadmap" },
  "/roadmap":        { line: "Walk the full architecture interactively.", cta: "Explore in 3D →", href: "/explore" },
};

const DEFAULT = {
  line: "Herald is the pattern. Skeptic is the operating system. 10 model seats. Zero cloud dependency.",
  cta: "Explore the architecture →",
  href: "/explore",
};

export default function ClosingCta() {
  const pathname = usePathname();
  const { line, cta, href } = PAGE_MAP[pathname] ?? DEFAULT;

  return (
    <div className={styles.wrap}>
      <div className={styles.box}>
        <p className={styles.tagline}>
          The question isn&apos;t whether this works.
        </p>
        <p className={styles.line}>{line}</p>
        <div className={styles.ctas}>
          <a href={href} className={styles.btn}>
            {cta}
          </a>
          <a href="/" className={styles.btnSecondary}>
            Back to home
          </a>
        </div>
      </div>
    </div>
  );
}
