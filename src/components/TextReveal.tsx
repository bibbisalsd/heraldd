"use client";

import { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface TextRevealProps {
  children: string;
  className?: string;
  stagger?: number;
  /** ScrollTrigger start position, e.g. "top 85%" */
  start?: string;
}

export default function TextReveal({
  children,
  className,
  stagger = 0.03,
  start = "top 85%",
}: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const spans = el.querySelectorAll<HTMLSpanElement>(".tr-unit");

    const ctx = gsap.context(() => {
      gsap.set(spans, { opacity: 0, y: 20 });

      gsap.to(spans, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
        stagger,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none none",
        },
      });
    }, el);

    return () => ctx.revert();
  }, [stagger, start]);

  // Split text into units (by word)
  const units = children.split(" ").map((word, i, arr) => (
    <span key={i} className="tr-unit" style={{ display: "inline-block" }}>
      {word}
      {i < arr.length - 1 ? "\u00A0" : ""}
    </span>
  ));

  return (
    <div ref={containerRef} className={className}>
      {units}
    </div>
  );
}