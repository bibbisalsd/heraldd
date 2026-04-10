"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import styles from "./Hero.module.css";
import GsapSection from "./GsapSection";

// Lazy load the 3D scene
const HeroScene = dynamic(() => import("./three/HeroScene"), { 
  ssr: false,
  loading: () => null
});

const HOOK_TEXT = "What if the LLM isn\u2019t the brain\u2014but one voice in a world-model orchestra?";

export default function Hero() {
  const [typed, setTyped] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);

  // Typewriter effect - starts after entrance animations
  useEffect(() => {
    const startDelay = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setTyped(HOOK_TEXT.slice(0, i));
        if (i >= HOOK_TEXT.length) {
          clearInterval(interval);
          setTimeout(() => setCursorVisible(false), 2000);
        }
      }, 45);
      return () => clearInterval(interval);
    }, 1200);
    return () => clearTimeout(startDelay);
  }, []);

  return (
    <GsapSection className={styles.hero}>
      {/* 3D Scene as fixed background */}
      <div style={{ position: "fixed", inset: 0, zIndex: 0 }}>
        <HeroScene />
      </div>
      
      {/* Content */}
      <div className={styles.inner}>
        <div className={styles.badge}>46k+ LOC &middot; 10 Model Seats &middot; 171 Modules</div>
        <h1 className={styles.title}>
          <span className={styles.gradientText}>Herald</span>
          <span className={styles.arrow}> &rarr; </span>
          <span className={styles.gradientTextWarm}>Skeptic</span>
          <span className={styles.dot}>.</span>
        </h1>
        <p className={styles.subtitle}>From Constrained LLM Renderer to Local Assistant Operating System</p>
        <p className={styles.hook}>
          {typed}
          <span
            className={`${styles.cursor} ${!cursorVisible ? styles.cursorHidden : ""}`}
          >
            |
          </span>
        </p>
        <p className={styles.desc}>
          Every AI agent framework puts the LLM at the center of every decision.
          Herald inverts this entirely — a 5-stage deterministic cascade routes,
          selects tools, and assembles facts across ten specialist model seats.
          The LLM renders once, at the end, constrained to rephrasing what the
          code already knows. Sequential relay manages VRAM so all ten seats
          share a single consumer GPU.
        </p>
        <div className={styles.cta}>
          <a href="/explore" className={styles.primary}>
            <span className={styles.primaryGlow} />
            Explore in 3D
          </a>
          <a href="/how-it-works" className={styles.secondary}>
            See how it works
          </a>
          <a href="/numbers" className={styles.secondary}>
            View benchmarks
          </a>
        </div>
      </div>
    </GsapSection>
  );
}