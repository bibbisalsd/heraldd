import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import ClosingCta from "@/components/ClosingCta";
import SiteComponents from "@/components/SiteComponents";

const PAGE_SECTIONS = [
  { id: "problem", label: "Problem" },
  { id: "how-it-works", label: "How It Works" },
  { id: "applications", label: "Applications" },
  { id: "business", label: "Business" },
  { id: "numbers", label: "Numbers" },
  { id: "comparison", label: "Comparison" },
  { id: "skeptic", label: "Skeptic" },
  { id: "crsis", label: "CRSIS" },
  { id: "world-model", label: "World Model" },
  { id: "roadmap", label: "Roadmap" },
];

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div style={{ paddingLeft: "var(--sidebar-padding, 0)" }}>
      <style>{`@media (min-width: 901px) { :root { --sidebar-padding: 164px; } }`}</style>
      <SmoothScroll />
      <SiteComponents />
      <ScrollReveal />
      <ScrollProgress sections={PAGE_SECTIONS} />
      <Nav />
      {children}
      <ClosingCta />
      <Footer />
    </div>
  );
}
