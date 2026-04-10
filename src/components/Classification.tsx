import styles from "./Classification.module.css";
import GsapSection from "./GsapSection";

const NOT_LIST = [
  {
    label: "Not an Algorithm",
    reason:
      "Algorithms are finite procedures that transform specific input to output (quicksort, Dijkstra's). Herald defines component relationships and boundaries, not a single computational procedure.",
  },
  {
    label: "Not a Framework",
    reason:
      "Frameworks are reusable code skeletons other projects import (Django, React). Herald is a specific architectural approach, not a library you install.",
  },
  {
    label: "Not a Paradigm",
    reason:
      'Paradigms are fundamental computation models (OOP, functional, reactive). Herald operates within existing paradigms -- it doesn\'t create a new way of "thinking about computation."',
  },
  {
    label: "Not a Design Pattern",
    reason:
      "GoF patterns (Singleton, Observer, Strategy) are local, single-layer solutions. Herald spans the entire application architecture.",
  },
];

const CONSTRAINTS = [
  {
    num: "01",
    title: "Deterministic Decision Supremacy",
    desc: "All routing, tool selection, memory management, permission checks, and output coordination are performed by deterministic code across 171 modules. A 5-stage cascade routes to ten specialist model seats. The LLM participates in none of these decisions. Same input, same path, every time.",
  },
  {
    num: "02",
    title: "Immutable Fact Boundary",
    desc: "The interface between the deterministic pipeline and the LLM is a frozen data structure containing pre-assembled facts and explicit constraints. The LLM cannot request more facts, call tools, or modify the packet.",
  },
  {
    num: "03",
    title: "Static Call Graph Enforcement",
    desc: "The component interaction topology across 171 modules is declared as a frozen set of allowed edges. No component can call another unless that edge is explicitly permitted. Sequential relay enforces VRAM boundaries. Extensions cannot bypass ingress normalization or output coordination.",
  },
];

const COMPARISONS = [
  {
    pattern: "Pipes-and-Filters",
    similarity: "Closest structural match. Data flows linearly through a chain of transformers.",
    difference: "P&F doesn't enforce a static call graph or a capability ceiling on the terminal stage. Herald adds both.",
  },
  {
    pattern: "CQRS",
    similarity: 'All "command" work (tools, memory, routing) in the pipeline. LLM performs only the "query" of rendering facts.',
    difference: "CQRS separates read/write models for storage. Herald applies the same split to intelligence itself.",
  },
  {
    pattern: "Hexagonal Arch",
    similarity: "Deterministic pipeline is the domain core. LLM is an external rendering port that can be swapped or degraded.",
    difference: "Hex arch doesn't constrain what adapters can do, just where they connect. Herald constrains capabilities.",
  },
  {
    pattern: "MVC",
    similarity: "Pipeline = Controller, Memory = Model, LLM = View.",
    difference: "MVC allows bidirectional Controller-View interaction. Herald's ten model seats receive immutable packets with zero access back. Sequential relay adds a resource management dimension MVC doesn't address.",
  },
];

export default function Classification() {
  return (
    <GsapSection id="classification" className="section">
      <div className="section-label">Formal Classification</div>
      <h2 className="section-title">
        Architectural Pattern: Constrained Dataflow with Terminal Rendering
        Boundary
      </h2>
      <div className="section-body">
        <p>
          Herald is classified at the same level as MVC, CQRS, or Hexagonal
          Architecture. It defines how an entire system&apos;s components
          relate, what responsibilities they hold, and what boundaries they
          cannot cross.
        </p>
      </div>

      <div className={styles.notGrid}>
        {NOT_LIST.map((item) => (
          <div key={item.label} className={styles.notCard}>
            <div className={styles.notX}>&times;</div>
            <div>
              <div className={styles.notLabel}>{item.label}</div>
              <div className={styles.notReason}>{item.reason}</div>
            </div>
          </div>
        ))}
      </div>

      <h3 className={styles.subhead}>The Three Defining Constraints</h3>
      <div className={styles.constraintGrid}>
        {CONSTRAINTS.map((c) => (
          <div key={c.num} className={styles.constraintCard}>
            <div className={styles.constraintNum}>{c.num}</div>
            <div className={styles.constraintTitle}>{c.title}</div>
            <div className={styles.constraintDesc}>{c.desc}</div>
          </div>
        ))}
      </div>

      <h3 className={styles.subhead}>Comparison to Known Patterns</h3>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Pattern</th>
              <th>Where Herald Overlaps</th>
              <th>Where Herald Diverges</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISONS.map((c) => (
              <tr key={c.pattern}>
                <td className={styles.patternName}>{c.pattern}</td>
                <td>{c.similarity}</td>
                <td>{c.difference}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className={styles.subhead}>Architecture at a Glance</h3>
      <div className={styles.diagramGrid}>
        {/* MVC */}
        <div className={styles.diagramCard}>
          <div className={styles.diagramName}>MVC</div>
          <div className={styles.diagramArea}>
            <div className={styles.dBox}>Controller</div>
            <div className={styles.dRow}>
              <span className={styles.dArrow}>↙</span>
              <span className={styles.dArrow}>↘</span>
            </div>
            <div className={styles.dRow}>
              <div className={styles.dBox}>Model</div>
              <span className={styles.dArrowBidir}>↔</span>
              <div className={styles.dBox}>View</div>
            </div>
          </div>
          <div className={styles.diagramTrait}>
            Bidirectional. View updates Controller. LLM equivalent sits at the center.
          </div>
        </div>

        {/* Hexagonal */}
        <div className={styles.diagramCard}>
          <div className={styles.diagramName}>Hexagonal</div>
          <div className={styles.diagramArea}>
            <div className={styles.dRow}>
              <div className={styles.dCol}>
                <div className={styles.dBox}>Adapter</div>
                <div className={styles.dBox}>Adapter</div>
              </div>
              <span className={styles.dArrow}>→</span>
              <div className={styles.dBoxCore}>Domain Core</div>
              <span className={styles.dArrow}>←</span>
              <div className={styles.dCol}>
                <div className={styles.dBox}>Adapter</div>
                <div className={styles.dBox}>Adapter</div>
              </div>
            </div>
            <div className={styles.dLabel}>
              Ports surround the core symmetrically
            </div>
          </div>
          <div className={styles.diagramTrait}>
            Symmetric. Any adapter can do anything at its port. No capability ceiling.
          </div>
        </div>

        {/* CQRS */}
        <div className={styles.diagramCard}>
          <div className={styles.diagramName}>CQRS</div>
          <div className={styles.diagramArea}>
            <div className={styles.dRow}>
              <div className={styles.dBox}>Command</div>
              <span className={styles.dArrow}>→</span>
              <div className={styles.dBox}>Write Model</div>
            </div>
            <div className={styles.dRow}>
              <span className={styles.dArrow}>↕ Store</span>
            </div>
            <div className={styles.dRow}>
              <div className={styles.dBox}>Query</div>
              <span className={styles.dArrow}>→</span>
              <div className={styles.dBox}>Read Model</div>
            </div>
          </div>
          <div className={styles.diagramTrait}>
            Split read/write models. Both sides are intelligent. Separation is about storage, not capability.
          </div>
        </div>

        {/* Herald / CLLM */}
        <div className={styles.diagramCardHighlight}>
          <div className={styles.diagramNameAccent}>Herald &middot; CLLM</div>
          <div className={styles.diagramArea}>
            <div className={styles.dRow}>
              <div className={styles.dBoxCore}>Brain</div>
              <span className={styles.dArrow}>→</span>
              <span className={styles.dBoxBoundary}>║</span>
              <span className={styles.dArrow}>→</span>
              <div className={styles.dBoxRender}>LLM</div>
            </div>
            <div className={styles.dLabel}>
              Unidirectional &middot; Immutable boundary &middot; Terminal renderer
            </div>
          </div>
          <div className={styles.diagramTrait}>
            Linear. LLM at the edge, not the center. Cannot call back. Frozen data in, natural language out.
          </div>
        </div>
      </div>

      {/* ─── Herald Detailed Architecture ─── */}
      <div className={styles.heraldDiagram}>
        <div className={styles.heraldTitle}>
          Herald / CLLM &mdash; Full Pipeline Architecture
        </div>

        <div className={styles.heraldFlow}>
          {/* Deterministic zone */}
          <div className={styles.heraldZoneDet}>
            <div className={styles.heraldStage}>
              <div className={styles.heraldStageInput}>Input</div>
              <div className={styles.heraldStageMeta}>Ingress</div>
            </div>

            <span className={styles.dArrow}>→</span>

            <div className={styles.heraldStage}>
              <div className={styles.heraldStageDet}>5-Stage Cascade</div>
              <div className={styles.heraldStageMeta}>171 modules</div>
            </div>

            <span className={styles.dArrow}>→</span>

            <div className={styles.heraldStage}>
              <div className={styles.heraldStageDet}>Fact Compiler</div>
              <div className={styles.heraldStageMeta}>Frozen packet</div>
            </div>
          </div>

          {/* Boundary */}
          <div className={styles.heraldBoundary}>
            <div className={styles.heraldBoundaryBar} />
            <div className={styles.heraldBoundaryText}>Immutable</div>
            <div className={styles.heraldBoundaryBar} />
          </div>

          {/* LLM zone */}
          <div className={styles.heraldZoneLlm}>
            <div className={styles.heraldStage}>
              <div className={styles.heraldStageLlm}>LLM Renderer</div>
              <div className={styles.heraldStageMeta}>10 seats &middot; seq relay</div>
            </div>

            <span className={styles.dArrow}>→</span>

            <div className={styles.heraldStage}>
              <div className={styles.heraldStageInput}>Output</div>
              <div className={styles.heraldStageMeta}>Coordinated</div>
            </div>
          </div>
        </div>

        <div className={styles.heraldZoneLabels}>
          <span className={styles.heraldZoneTagDet}>
            ◄ Deterministic Brain ►
          </span>
          <span className={styles.heraldZoneTagLlm}>
            ◄ Constrained Renderer ►
          </span>
        </div>

        <div className={styles.heraldConstraints}>
          <div className={styles.heraldConstraintItem}>
            <div className={styles.heraldConstraintNum}>Constraint 01</div>
            <div className={styles.heraldConstraintLabel}>
              Deterministic Decision Supremacy
            </div>
          </div>
          <div className={styles.heraldConstraintItem}>
            <div className={styles.heraldConstraintNum}>Constraint 02</div>
            <div className={styles.heraldConstraintLabel}>
              Immutable Fact Boundary
            </div>
          </div>
          <div className={styles.heraldConstraintItem}>
            <div className={styles.heraldConstraintNum}>Constraint 03</div>
            <div className={styles.heraldConstraintLabel}>
              Static Call Graph Enforcement
            </div>
          </div>
        </div>
      </div>
    </GsapSection>
  );
}
