"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import styles from "./Nav.module.css";

const GROUPS = [
  {
    label: "Why",
    links: [
      { label: "Problem", href: "/problem" },
    ],
  },
  {
    label: "What",
    links: [
      { label: "Pattern", href: "/pattern" },
      { label: "Classification", href: "/classification" },
    ],
  },
  {
    label: "How",
    links: [
      { label: "How It Works", href: "/how-it-works" },
      { label: "Numbers", href: "/numbers" },
      { label: "Comparison", href: "/comparison" },
    ],
  },
  {
    label: "Architecture",
    links: [
      { label: "Cognitive Layer", href: "/cognitive-layer" },
      { label: "Model Seats", href: "/model-seats" },
    ],
  },
  {
    label: "System",
    links: [
      { label: "Skeptic", href: "/skeptic" },
      { label: "CRSIS", href: "/crsis" },
      { label: "World Model", href: "/world-model" },
    ],
  },
  {
    label: "Platform",
    links: [
      { label: "Applications", href: "/applications" },
      { label: "Business", href: "/business" },
      { label: "Roadmap", href: "/roadmap" },
      { label: "Esoteric", href: "/esoteric" },
    ],
  },
];

export default function Nav() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (pathname === "/explore") return null;

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <nav className={styles.sidebar}>
        <a href="/" className={styles.logo}>
          H<span className={styles.logoDot}>.</span>
        </a>

        <div className={styles.links}>
          {GROUPS.map((group, gi) => (
            <div key={group.label} className={styles.group}>
              {gi > 0 && <div className={styles.groupDivider} />}
              <div className={styles.groupLabel}>{group.label}</div>
              {group.links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`${styles.link} ${isActive ? styles.linkActive : ""}`}
                  >
                    {isActive && <span className={styles.activeIndicator} />}
                    {link.label}
                  </a>
                );
              })}
            </div>
          ))}
        </div>

        <a href="/explore" className={styles.exploreBtn}>
          3D
        </a>
      </nav>

      {/* ── Mobile top bar ── */}
      <nav className={styles.mobileBar}>
        <a href="/" className={styles.mobileLogo}>
          Herald<span className={styles.logoDot}>.</span>
        </a>
        <button
          className={`${styles.burger} ${mobileOpen ? styles.burgerOpen : ""}`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {GROUPS.map((group, gi) => (
            <div key={group.label} className={styles.mobileGroup}>
              {gi > 0 && <div className={styles.mobileDivider} />}
              <div className={styles.mobileGroupLabel}>{group.label}</div>
              {group.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`${styles.mobileLink} ${pathname === link.href ? styles.mobileLinkActive : ""}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          ))}
          <div className={styles.mobileDivider} />
          <a
            href="/explore"
            className={styles.mobileExploreLink}
            onClick={() => setMobileOpen(false)}
          >
            Explore in 3D ↗
          </a>
        </div>
      )}
    </>
  );
}
