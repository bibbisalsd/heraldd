"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    // Staggered scroll reveal
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.08 }
    );

    document.querySelectorAll(".fade-section").forEach((el) => {
      observer.observe(el);
    });

    // Stagger children with .stagger-child class
    const childObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const children = entry.target.querySelectorAll(".stagger-child");
            children.forEach((child, i) => {
              (child as HTMLElement).style.animationDelay = `${i * 0.08}s`;
              child.classList.add("stagger-visible");
            });
          }
        });
      },
      { threshold: 0.05 }
    );

    document.querySelectorAll(".stagger-parent").forEach((el) => {
      childObserver.observe(el);
    });

    // Cursor spotlight
    const spotlight = document.createElement("div");
    spotlight.className = "cursor-spotlight";
    document.body.appendChild(spotlight);

    const onMove = (e: MouseEvent) => {
      spotlight.style.left = `${e.clientX}px`;
      spotlight.style.top = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    return () => {
      observer.disconnect();
      childObserver.disconnect();
      window.removeEventListener("mousemove", onMove);
      spotlight.remove();
    };
  }, []);

  return null;
}
