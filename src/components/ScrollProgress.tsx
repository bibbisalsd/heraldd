"use client";

import { useEffect, useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Section {
  id: string;
  label: string;
}

/**
 * Minimal vertical progress bar on the right edge.
 * Shows current position in the page with clickable dots for each section.
 */
export default function ScrollProgress({ sections = [] }: { sections?: Section[] }) {
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Update progress on scroll
    const updateProgress = () => {
      const scrolled = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? scrolled / max : 0);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", updateProgress);
  }, []);

  // Find active section based on scroll position
  useEffect(() => {
    if (sections.length === 0) return;

    const ctx = gsap.context(() => {
      sections.forEach((section, index) => {
        const el = document.getElementById(section.id);
        if (!el) return;

        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActiveSection(index),
          onEnterBack: () => setActiveSection(index),
        });
      });
    });

    return () => ctx.revert();
  }, [sections]);

  if (sections.length === 0) {
    // Simple progress bar without section dots
    return (
      <div
        style={{
          position: "fixed",
          right: 20,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 100,
        }}
      >
        <div
          ref={barRef}
          style={{
            width: 3,
            height: 120,
            background: "rgba(255,255,255,0.1)",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: "100%",
              height: `${progress * 100}%`,
              background: "var(--accent, #4f8ff7)",
              borderRadius: 2,
              transition: "height 0.1s ease-out",
            }}
          />
        </div>
      </div>
    );
  }

  // Full version with section dots
  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 12,
      }}
    >
      {/* Progress line */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          bottom: 0,
          width: 2,
          background: "rgba(255,255,255,0.1)",
          borderRadius: 1,
          transform: "translateX(-50%)",
        }}
      />
      
      {/* Active progress line */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: 2,
          height: `${progress * 100}%`,
          maxHeight: "100%",
          background: "var(--accent, #4f8ff7)",
          borderRadius: 1,
          transform: "translateX(-50%)",
          transition: "height 0.1s ease-out",
        }}
      />

      {/* Section dots */}
      {sections.map((section, index) => (
        <button
          key={section.id}
          onClick={() => {
            const el = document.getElementById(section.id);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
            }
          }}
          title={section.label}
          style={{
            width: index === activeSection ? 10 : 8,
            height: index === activeSection ? 10 : 8,
            borderRadius: "50%",
            border: "none",
            background: index === activeSection 
              ? "var(--accent, #4f8ff7)" 
              : "rgba(255,255,255,0.3)",
            cursor: "pointer",
            transition: "all 0.2s ease",
            position: "relative",
            zIndex: 1,
          }}
        />
      ))}
    </div>
  );
}