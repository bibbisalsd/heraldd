import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Herald / Skeptic -- From Constrained LLM Renderer to Local Assistant Operating System",
  description:
    "An architectural pattern and operating system for evidence-grounded AI. Deterministic code decides. Multiple specialist models execute. A world-state model tracks reality. A judge verifies claims against evidence. The LLM renders.",
  keywords: [
    "Herald",
    "Skeptic",
    "Local Assistant Operating System",
    "CLLM",
    "Constrained LLM",
    "AI Architecture",
    "LLM Renderer",
    "Esoteric v0.2",
    "World Model",
    "Multi-Model",
    "Evidence Grounded",
    "Cognitive Architecture",
    "Deterministic AI",
  ],
  openGraph: {
    title: "Herald / Skeptic -- From Constrained LLM Renderer to Local Assistant Operating System",
    description:
      "What if the LLM isn't the brain -- but one voice in a world-model orchestra? Multiple specialist models, evidence-grounded verification, persistent world-state.",
    type: "website",
    siteName: "Herald / Skeptic",
  },
  twitter: {
    card: "summary_large_image",
    title: "Herald / Skeptic -- Local Assistant Operating System",
    description:
      "Deterministic code decides. 5 specialist models execute. A world-state model tracks reality. A judge verifies every claim against evidence.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Outfit:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
