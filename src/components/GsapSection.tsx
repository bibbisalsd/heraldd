"use client";

import { useRef, useEffect, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface GsapSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  /** Extra parallax offset in pixels (default 40) */
  parallax?: number;
  /** Stagger delay for .gs-child elements (default 0.08s) */
  stagger?: number;
  style?: React.CSSProperties;
}

export default function GsapSection({
  children,
  className,
  id,
  parallax = 40,
  stagger = 0.08,
  style,
}: GsapSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const ctx = gsap.context(() => {
      // Section fade-in with parallax
      gsap.from(el, {
        opacity: 0,
        y: parallax,
        duration: 0.9,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // Stagger children with .gs-child class
      const childElements = el.querySelectorAll<HTMLElement>(".gs-child");
      if (childElements.length > 0) {
        gsap.from(childElements, {
          opacity: 0,
          y: 24,
          duration: 0.6,
          ease: "power2.out",
          stagger,
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }

      // Animate .costCard elements with slide-in effect
      const costCards = el.querySelectorAll<HTMLElement>(".costCard");
      if (costCards.length > 0) {
        // Set initial state from CSS nth-child rules
        costCards.forEach((card, i) => {
          const xOffset = i % 2 === 0 ? -30 : 30;
          gsap.set(card, { x: xOffset, y: 30, opacity: 0 });
        });
        
        gsap.to(costCards, {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.7,
          ease: "power2.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: el,
            start: "top 70%",
            toggleActions: "play none none none",
          },
        });
      }

      // Animate .frameworkChip elements  
      const frameworkChips = el.querySelectorAll<HTMLElement>(".frameworkChip");
      if (frameworkChips.length > 0) {
        gsap.from(frameworkChips, {
          opacity: 0,
          y: 20,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [parallax, stagger]);

  return (
    <section ref={sectionRef} id={id} className={className} style={style}>
      {children}
    </section>
  );
}