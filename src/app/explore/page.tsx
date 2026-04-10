"use client";

import dynamic from "next/dynamic";

const ArchScene = dynamic(
  () => import("@/components/three/ArchScene"),
  { ssr: false }
);

export default function ExplorePage() {
  return (
    <>
      <ArchScene />
      <a
        href="/"
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 20,
          fontFamily: '"JetBrains Mono", monospace',
          fontSize: "0.65rem",
          color: "rgba(245, 197, 66, 0.5)",
          background: "rgba(8, 10, 16, 0.65)",
          border: "1px solid rgba(245, 197, 66, 0.12)",
          padding: "8px 16px",
          borderRadius: "10px",
          textDecoration: "none",
          backdropFilter: "blur(16px)",
          letterSpacing: "0.04em",
        }}
      >
        &larr; Back to overview
      </a>
    </>
  );
}
