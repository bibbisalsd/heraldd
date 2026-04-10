"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface PinnedSectionProps {
  children: ReactNode;
  /** Height multiplier (default 1 = 100vh) */
  height?: number;
  /** Class name for container */
  className?: string;
  /** Optional animation timeline config */
  animation?: {
    /** Duration in seconds */
    duration?: number;
    /** Ease function */
    ease?: string;
  };
}

/**
 * Full-viewport scroll-pinned section using GSAP ScrollTrigger.
 * The section stays fixed while content animates within it.
 * On scroll-through, the section unpins and the next section slides up.
 */
export default function PinnedSection({
  children,
  height = 1,
  className,
  animation,
}: PinnedSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    const trigger = triggerRef.current;
    if (!el || !trigger) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: "top top",
          end: `+=${height * 100}%`,
          pin: true,
          pinSpacing: false,
          scrub: true,
          anticipatePin: 1,
        },
      });

      // If custom animation is provided, could add timeline animations here
      if (animation) {
        tl.to(el, {
          duration: animation.duration || 1,
          ease: animation.ease || "none",
        });
      }
    }, el);

    return () => ctx.revert();
  }, [height, animation]);

  return (
    <div ref={triggerRef} style={{ position: "relative" }}>
      <div
        ref={containerRef}
        className={className}
        style={{
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {children}
      </div>
    </div>
  );
}