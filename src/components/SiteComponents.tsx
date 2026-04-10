"use client";

import dynamic from "next/dynamic";

// Lazy load ambient particles (WebGL, not needed on server)
const AmbientParticles = dynamic(() => import("./three/AmbientParticles"), {
  ssr: false,
  loading: () => null,
});

/**
 * Wrapper for client-side only components that need browser APIs.
 * Keeps the layout server component clean.
 */
export default function SiteComponents() {
  return (
    <>
      <AmbientParticles />
    </>
  );
}