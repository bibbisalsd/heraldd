"use client";

import styles from "./ModelSeats.module.css";
import GsapSection from "./GsapSection";
import { MODEL_SEATS, ALLOCATION_RULES } from "../data/models";

export default function ModelSeats() {
  return (
    <GsapSection id="model-seats" className="section">
      <div className="section-label">Multi-Model Architecture</div>
      <h2 className="section-title">Model Seats: One Model, One Job</h2>
      <div className="section-body">
        <p>
          Esoteric v0.2 uses ten specialist model seats. No single model does everything.
          Each seat has a specific purpose, latency target, and activation condition.
        </p>
        <p>
          This is the opposite of &quot;one LLM to rule them all.&quot; The renderer speaks.
          The code specialist reasons about code. The vision specialist sees.
          The verifier judges. Code orchestrates all of them.
        </p>
      </div>

      {/* Stats row */}
      <div className={styles.statRow}>
        <div className={styles.stat}>
          <div className={styles.statValue}>10</div>
          <div className={styles.statLabel}>Model seats</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>2b-14b</div>
          <div className={styles.statLabel}>Parameter range</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>4</div>
          <div className={styles.statLabel}>BG1 specialists</div>
        </div>
        <div className={styles.stat}>
          <div className={styles.statValue}>6</div>
          <div className={styles.statLabel}>Realtime seats</div>
        </div>
      </div>

      {/* Model seats grid */}
      <h3 className={styles.archLabel}>The Specialist Seats</h3>
      <div className={styles.seatGrid}>
        {MODEL_SEATS.map((seat) => (
          <div
            key={seat.id}
            className={`${styles.seatCard} gs-child`}
            style={{ borderColor: seat.color }}
          >
            <div className={styles.seatHeader}>
              <span className={styles.seatName}>{seat.name}</span>
              {seat.bg && <span className={styles.bgBadge}>BG1</span>}
            </div>
            <div className={styles.seatModel}>{seat.model}</div>
            {seat.fallback && (
              <div className={styles.seatFallback}>Fallback: {seat.fallback}</div>
            )}
            <div className={styles.seatLatency}>
              <span className={styles.latencyLabel}>Latency:</span>
              <span className={styles.latencyValue}>{seat.latency}</span>
            </div>
            <div className={styles.seatPurpose}>{seat.purpose}</div>
            <div className={styles.seatUsage}>{seat.usage}</div>
          </div>
        ))}
      </div>

      {/* Allocation rules */}
      <h3 className={styles.archLabel} style={{ marginTop: "48px" }}>Seat Allocation Logic</h3>
      <div className={styles.rulesGrid}>
        {ALLOCATION_RULES.map((rule) => (
          <div key={rule.rule} className={`${styles.ruleCard} gs-child`}>
            <div className={styles.ruleTitle}>{rule.rule}</div>
            <div className={styles.ruleDesc}>{rule.desc}</div>
          </div>
        ))}
      </div>

      {/* Latency comparison */}
      <div className={styles.latencyBox}>
        <div className={styles.latencyTitle}>Latency Targets by Seat</div>
        <div className={styles.latencyBars}>
          {MODEL_SEATS.map((seat) => (
            <div key={seat.id} className={styles.latencyRow}>
              <div className={styles.latencySeatName}>{seat.name}</div>
              <div className={styles.latencyBarContainer}>
                <div
                  className={styles.latencyBar}
                  style={{
                    width: seat.latency === "<50ms" ? "10%" :
                           seat.latency === "<100ms" ? "20%" :
                           seat.latency === "<200ms" ? "30%" :
                           seat.latency === "<500ms" ? "45%" :
                           seat.latency === "<2s" ? "65%" : "85%",
                    backgroundColor: seat.color,
                  }}
                />
              </div>
              <div className={styles.latencyValueSmall}>{seat.latency}</div>
            </div>
          ))}
        </div>
        <p className={styles.latencyCaption}>
          Renderer target is sub-50ms for instant responses. BG1 specialists run asynchronously
          with progress updates at 15%, 60%, 95%.
        </p>
      </div>

      {/* Architecture diagram */}
      <div className={styles.architectureBox}>
        <div className={styles.archLabel}>Model Seat Orchestration</div>
        <div className={styles.archFlow}>
          <div className={styles.flowColumn}>
            <div className={styles.flowLabel}>Realtime Lane</div>
            <div className={styles.flowSeat} style={{ borderColor: "var(--accent)" }}>
              Renderer (e2b/e4b)
            </div>
            <div className={styles.flowSeat} style={{ borderColor: "var(--accent-green)" }}>
              Embedding
            </div>
            <div className={styles.flowSeat} style={{ borderColor: "var(--accent-red)" }}>
              Verifier
            </div>
          </div>
          <div className={styles.flowDivider}>&#9474;</div>
          <div className={styles.flowColumn}>
            <div className={styles.flowLabel}>BG1 Worker</div>
            <div className={styles.flowSeat} style={{ borderColor: "var(--accent-blue)" }}>
              Code (14b) &#8594; Review (8b)
            </div>
            <div className={styles.flowSeat} style={{ borderColor: "var(--accent-purple)" }}>
              Vision (8b)
            </div>
            <div className={styles.flowSeat} style={{ borderColor: "var(--accent-cyan)" }}>
              Logic (8b)
            </div>
          </div>
        </div>
        <p className={styles.archCaption}>
          The 5-stage dispatcher routes to realtime lane for quick tasks (70-85% of turns).
          Heavy tasks enter BG1 queue and activate specialist seats on-demand, including
          the sequential code relay and deep reasoning logic specialist.
        </p>
      </div>
    </GsapSection>
  );
}
