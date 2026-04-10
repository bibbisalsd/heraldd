"use client";

import { useState, Suspense, useCallback, useEffect, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Vector3 } from "three";
import { OrbitControls, Environment } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import ArchNode3D from "./ArchNode3D";
import ArchEdge3D from "./ArchEdge3D";
import { NODES, EDGES, NODE_COLORS, ArchNode, CRITICAL_PATH, REGIONS } from "./archData";
import styles from "./ArchScene.module.css";

const DEFAULT_TARGET = new Vector3(4, 0.5, 0);

/* ── Orbital Rings — scene-wide concentric golden rings ── */
const RING_DEFS = [
  { radius: 14, tube: 0.025, rot: [Math.PI / 2, 0, 0], speed: 0.02, color: "#f59e0b", opacity: 0.2 },
  { radius: 18, tube: 0.02, rot: [Math.PI / 2.5, 0.3, 0], speed: -0.015, color: "#8b5cf6", opacity: 0.18 },
  { radius: 22, tube: 0.015, rot: [Math.PI / 3, -0.2, 0.4], speed: 0.01, color: "#d97706", opacity: 0.12 },
  { radius: 10, tube: 0.03, rot: [Math.PI / 4, 0.5, 0.2], speed: -0.025, color: "#06b6d4", opacity: 0.25 },
  { radius: 26, tube: 0.012, rot: [Math.PI / 2.2, 0.15, -0.3], speed: 0.008, color: "#3b82f6", opacity: 0.1 },
  { radius: 16, tube: 0.022, rot: [Math.PI / 1.8, -0.4, 0.1], speed: 0.018, color: "#fbbf24", opacity: 0.15 },
] as const;

function OrbitalRings() {
  const refs = useRef<THREE.Mesh[]>([]);
  const fc = useRef(0);

  useFrame((_, delta) => {
    fc.current++;
    if (fc.current % 2 !== 0) return;
    refs.current.forEach((mesh, i) => {
      if (mesh) mesh.rotation.z += delta * 2 * RING_DEFS[i].speed;
    });
  });

  return (
    <group position={[4, 0, 0]}>
      {RING_DEFS.map((ring, i) => (
        <mesh
          key={i}
          ref={(el) => { if (el) refs.current[i] = el; }}
          rotation={ring.rot as unknown as [number, number, number]}
        >
          <torusGeometry args={[ring.radius, ring.tube, 8, 64]} />
          <meshBasicMaterial color={ring.color} transparent opacity={ring.opacity} />
        </mesh>
      ))}
    </group>
  );
}

/* ── Holographic Skeleton — wireframe icosahedra for internal structure ── */
function HolographicSkeleton() {
  const outerRef = useRef<THREE.Mesh>(null!);
  const innerRef = useRef<THREE.Mesh>(null!);
  const fc = useRef(0);

  useFrame((_, delta) => {
    fc.current++;
    if (fc.current % 2 !== 0) return;
    const d = delta * 2;
    if (outerRef.current) {
      outerRef.current.rotation.y += d * 0.008;
      outerRef.current.rotation.x += d * 0.003;
    }
    if (innerRef.current) {
      innerRef.current.rotation.y -= d * 0.012;
      innerRef.current.rotation.z += d * 0.005;
    }
  });

  return (
    <group position={[4, 0, 0]}>
      <mesh ref={outerRef}>
        <icosahedronGeometry args={[16, 1]} />
        <meshBasicMaterial color="#6366f1" wireframe transparent opacity={0.12} />
      </mesh>
      <mesh ref={innerRef}>
        <icosahedronGeometry args={[10, 2]} />
        <meshBasicMaterial color="#ec4899" wireframe transparent opacity={0.10} />
      </mesh>
    </group>
  );
}

/* ── Critical Path Trace ── */
function CriticalPathTrace() {
  const mainRef = useRef<THREE.Mesh>(null!);
  const trailRef = useRef<THREE.Mesh>(null!);
  const progress = useRef(0);

  // Build sequential curves for the critical path
  const { curves, totalLength } = useMemo(() => {
    const cvs: { curve: THREE.QuadraticBezierCurve3; length: number }[] = [];
    let total = 0;
    for (let i = 0; i < CRITICAL_PATH.length - 1; i++) {
      const fromNode = NODES.find((n) => n.id === CRITICAL_PATH[i]);
      const toNode = NODES.find((n) => n.id === CRITICAL_PATH[i + 1]);
      if (!fromNode || !toNode) continue;
      const start = new THREE.Vector3(...fromNode.position);
      const end = new THREE.Vector3(...toNode.position);
      const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
      const dist = start.distanceTo(end);
      mid.z += dist * 0.12;
      mid.y += dist * 0.1;
      const curve = new THREE.QuadraticBezierCurve3(start, mid, end);
      const len = curve.getLength();
      cvs.push({ curve, length: len });
      total += len;
    }
    return { curves: cvs, totalLength: total };
  }, []);

  const getPositionAt = useCallback((t: number) => {
    let dist = t * totalLength;
    for (const { curve, length } of curves) {
      if (dist <= length) {
        return curve.getPoint(dist / length);
      }
      dist -= length;
    }
    return curves[curves.length - 1]?.curve.getPoint(1) ?? new THREE.Vector3();
  }, [curves, totalLength]);

  useFrame((_, delta) => {
    // ~6s for full traversal, 1.5s pause at end
    const cycleDuration = 7.5;
    const travelPortion = 6 / cycleDuration;
    progress.current = (progress.current + delta / cycleDuration) % 1;

    const t = Math.min(progress.current / travelPortion, 1);
    const tTrail = Math.min(Math.max(progress.current - 0.012) / travelPortion, 1);

    if (mainRef.current) {
      mainRef.current.position.copy(getPositionAt(t));
      mainRef.current.visible = t < 1;
    }
    if (trailRef.current) {
      trailRef.current.position.copy(getPositionAt(Math.max(0, tTrail)));
      trailRef.current.visible = t < 1;
    }
  });

  return (
    <group>
      <mesh ref={mainRef}>
        <sphereGeometry args={[0.22, 16, 16]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.95} />
      </mesh>
      <mesh ref={trailRef}>
        <sphereGeometry args={[0.15, 12, 12]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.65} />
      </mesh>
    </group>
  );
}


function Scene({
  selectedNode,
  onSelect,
  hiddenNodeIds,
  tracePath,
  resetKey,
}: {
  selectedNode: string | null;
  onSelect: (id: string | null) => void;
  hiddenNodeIds: Set<string>;
  tracePath: boolean;
  resetKey: number;
}) {
  const controlsRef = useRef<any>(null);
  const targetVec = useRef(new Vector3(4, 0, 0));

  // Reset camera when resetKey increments
  useEffect(() => {
    if (resetKey === 0 || !controlsRef.current) return;
    const cam = controlsRef.current.object;
    if (cam) {
      cam.position.set(4, 6, 30);
      controlsRef.current.target.set(4, 0.5, 0);
      controlsRef.current.update();
    }
  }, [resetKey]);

  // Camera fly-to: drift toward selected node or back to center
  useFrame(() => {
    if (!controlsRef.current) return;
    if (selectedNode) {
      const node = NODES.find((n) => n.id === selectedNode);
      if (node) targetVec.current.set(...node.position);
    } else {
      targetVec.current.copy(DEFAULT_TARGET);
    }
    controlsRef.current.target.lerp(targetVec.current, 0.04);
    controlsRef.current.update();
  });

  return (
    <>
      {/* Lighting — warm garage with cool tech accents */}
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 15, 8]} intensity={0.6} color="#fef3c7" castShadow />
      <pointLight position={[4, 3, 0]} intensity={0.5} color="#06b6d4" distance={30} />
      <pointLight position={[-6, 6, -4]} intensity={0.3} color="#8b5cf6" distance={25} />
      <pointLight position={[12, 1, 6]} intensity={0.2} color="#f59e0b" distance={20} />

      {/* Subtle depth fog — pushed far back so garage stays visible */}
      <fog attach="fog" args={["#0a0c14", 50, 120]} />

      {/* 2K HDRI — industrial workshop foundry (Poly Haven)
          Glossy floors, metal highlights, warm skylight + cool lamps.
          Tony Stark garage vibe. */}
      <Environment
        files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/industrial_workshop_foundry_2k.hdr"
        background
        backgroundBlurriness={0.3}
        backgroundIntensity={0.55}
        environmentIntensity={0.7}
      />

      {/* Holographic structure overlaid on the garage */}
      <OrbitalRings />
      <HolographicSkeleton />

      {EDGES.filter((e) => {
        return !hiddenNodeIds.has(e.from) && !hiddenNodeIds.has(e.to);
      }).map((edge) => (
        <ArchEdge3D
          key={`${edge.from}-${edge.to}`}
          edge={edge}
          nodes={NODES}
          highlightedNode={selectedNode}
        />
      ))}

      {NODES.filter((n) => !hiddenNodeIds.has(n.id)).map((node) => (
        <ArchNode3D
          key={node.id}
          node={node}
          selected={selectedNode === node.id}
          dimmed={selectedNode !== null && selectedNode !== node.id}
          onSelect={onSelect}
        />
      ))}

      {/* Critical path trace */}
      {tracePath && <CriticalPathTrace />}

      {/* Post-processing — bloom + vignette only */}
      <EffectComposer>
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.15} darkness={0.65} />
      </EffectComposer>

      {/* Camera controls — user-driven orbit */}
      <OrbitControls
        ref={controlsRef}
        enableDamping
        dampingFactor={0.05}
        rotateSpeed={0.4}
        zoomSpeed={0.6}
        panSpeed={0.4}
        minDistance={5}
        maxDistance={60}
        makeDefault
      />
    </>
  );
}

export default function ArchScene() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [hiddenRegions, setHiddenRegions] = useState<Set<string>>(new Set());
  const [tracePath, setTracePath] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [resetKey, setResetKey] = useState(0);
  const searchRef = useRef<HTMLInputElement>(null);

  // Build a set of hidden node ids from hidden regions
  const hiddenNodeIds = useMemo<Set<string>>(() => {
    const ids = new Set<string>();
    REGIONS.forEach((r) => {
      if (hiddenRegions.has(r.id)) {
        r.nodeIds.forEach((id) => ids.add(id));
      }
    });
    return ids;
  }, [hiddenRegions]);

  // Search: find matching node ids (highlight, don't hide others)
  const searchMatches = useMemo<Set<string>>(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return new Set();
    return new Set(
      NODES.filter(
        (n) =>
          n.label.toLowerCase().includes(q) ||
          n.description.toLowerCase().includes(q) ||
          n.type.toLowerCase().includes(q)
      ).map((n) => n.id)
    );
  }, [searchQuery]);

  // Auto-select first match when searching
  useEffect(() => {
    if (searchMatches.size > 0) {
      const first = Array.from(searchMatches)[0];
      setSelectedNode(first);
    }
  }, [searchMatches]);

  const visibleNodes = NODES.filter((n) => !hiddenNodeIds.has(n.id));
  const visibleEdges = EDGES.filter(
    (e) => !hiddenNodeIds.has(e.from) && !hiddenNodeIds.has(e.to)
  );

  const selectedData = selectedNode
    ? NODES.find((n) => n.id === selectedNode) ?? null
    : null;

  const incomingNodes: ArchNode[] = selectedNode
    ? EDGES.filter((e) => e.to === selectedNode)
        .map((e) => NODES.find((n) => n.id === e.from))
        .filter((n): n is ArchNode => n != null)
    : [];

  const outgoingNodes: ArchNode[] = selectedNode
    ? EDGES.filter((e) => e.from === selectedNode)
        .map((e) => NODES.find((n) => n.id === e.to))
        .filter((n): n is ArchNode => n != null)
    : [];

  const handleClose = useCallback(() => setSelectedNode(null), []);
  const handleSelect = useCallback((id: string | null) => setSelectedNode(id), []);

  const toggleRegion = useCallback((regionId: string) => {
    setHiddenRegions((prev) => {
      const next = new Set(prev);
      if (next.has(regionId)) next.delete(regionId);
      else next.add(regionId);
      return next;
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Cmd/Ctrl+K opens search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      if (e.key === "Escape") {
        if (searchQuery) {
          setSearchQuery("");
          searchRef.current?.blur();
        } else {
          setSelectedNode(null);
        }
        return;
      }

      // Don't steal keypresses when search is focused
      if (document.activeElement === searchRef.current) return;

      const visible = visibleNodes;
      if (visible.length === 0) return;

      if (e.key === "Tab" || e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        const idx = selectedNode ? visible.findIndex((n) => n.id === selectedNode) : -1;
        setSelectedNode(visible[(idx + 1) % visible.length].id);
      }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        const idx = selectedNode ? visible.findIndex((n) => n.id === selectedNode) : 0;
        setSelectedNode(visible[(idx - 1 + visible.length) % visible.length].id);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedNode, visibleNodes, searchQuery]);

  return (
    <div className={styles.container}>

      {/* ── HUD — top-left: title + stats + search ── */}
      <div className={`${styles.hud} ${styles.glassPanel}`}>
        <div className={styles.hudTitle}>Herald / Skeptic Architecture</div>
        <div className={styles.hudSubtitle}>Interactive 3D System Map</div>
        <div className={styles.hudStats}>
          <span>{visibleNodes.length}<span className={styles.hudStatLabel}> nodes</span></span>
          <span className={styles.hudStatDivider}>·</span>
          <span>{visibleEdges.length}<span className={styles.hudStatLabel}> edges</span></span>
        </div>

        {/* Search */}
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            ref={searchRef}
            className={styles.searchInput}
            type="text"
            placeholder="Search nodes… (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            spellCheck={false}
          />
          {searchQuery && (
            <button
              className={styles.searchClear}
              onClick={() => { setSearchQuery(""); searchRef.current?.focus(); }}
            >
              ×
            </button>
          )}
        </div>
        {searchQuery && (
          <div className={styles.searchResults}>
            {searchMatches.size === 0
              ? <span className={styles.searchNoMatch}>No matches</span>
              : Array.from(searchMatches).slice(0, 5).map((id) => {
                  const n = NODES.find((x) => x.id === id)!;
                  return (
                    <button
                      key={id}
                      className={`${styles.searchResultItem} ${selectedNode === id ? styles.searchResultActive : ""}`}
                      onClick={() => { setSelectedNode(id); setSearchQuery(""); }}
                    >
                      <span
                        className={styles.searchResultDot}
                        style={{ background: NODE_COLORS[n.type] }}
                      />
                      {n.label}
                    </button>
                  );
                })
            }
          </div>
        )}
      </div>

      {/* ── Region legend — left side ── */}
      <div className={`${styles.legend} ${styles.glassPanel}`}>
        <div className={styles.legendTitle}>Regions</div>
        {REGIONS.map((region) => (
          <button
            key={region.id}
            className={`${styles.legendItem} ${hiddenRegions.has(region.id) ? styles.legendItemHidden : ""}`}
            onClick={() => toggleRegion(region.id)}
          >
            <span className={styles.legendDot} style={{ background: region.color }} />
            {region.label}
          </button>
        ))}
      </div>

      {/* ── Bottom bar ── */}
      <div className={`${styles.bottomBar} ${styles.glassPanel}`}>
        <div className={styles.controlItem}><span className={styles.key}>Drag</span> Orbit</div>
        <div className={styles.controlItem}><span className={styles.key}>Scroll</span> Zoom</div>
        <div className={styles.controlItem}><span className={styles.key}>Click</span> Inspect</div>
        <div className={styles.controlItem}><span className={styles.key}>Tab</span> Navigate</div>
        <div className={styles.barDivider} />
        <button
          className={`${styles.traceToggle} ${tracePath ? styles.traceToggleActive : ""}`}
          onClick={() => setTracePath((p) => !p)}
        >
          <span className={styles.traceToggleDot} />
          {tracePath ? "Tracing..." : "Trace Data Flow"}
        </button>
        <div className={styles.barDivider} />
        <button
          className={styles.resetBtn}
          onClick={() => setResetKey((k) => k + 1)}
          title="Reset camera"
        >
          ⟳ Reset
        </button>
      </div>

      {/* ── Module info popup ── */}
      {selectedData && (
        <div className={styles.popupOverlay} onClick={handleClose}>
          <div
            className={styles.popup}
            onClick={(e) => e.stopPropagation()}
            style={{
              borderColor: NODE_COLORS[selectedData.type] + "22",
              boxShadow: `0 0 80px ${NODE_COLORS[selectedData.type]}11, 0 0 160px rgba(0,0,0,0.5)`,
            }}
          >
            <button className={styles.popupClose} onClick={handleClose}>&times;</button>

            <div
              className={styles.popupBadge}
              style={{ color: NODE_COLORS[selectedData.type], borderColor: NODE_COLORS[selectedData.type] + "33" }}
            >
              <span className={styles.popupBadgeDot} style={{ background: NODE_COLORS[selectedData.type] }} />
              {selectedData.type.toUpperCase()}
            </div>

            <h2 className={styles.popupTitle}>{selectedData.label}</h2>
            <div className={styles.popupKeyFact}>{selectedData.keyFact}</div>
            <p className={styles.popupDesc}>{selectedData.description}</p>
            <p className={styles.popupDetail}>{selectedData.detail}</p>

            {selectedData.siteSection && (
              <a href={selectedData.siteSection} className={styles.popupLearnMore} style={{ color: NODE_COLORS[selectedData.type] }}>
                Learn more on main site &rarr;
              </a>
            )}

            {/* Incoming + outgoing edges split */}
            {(incomingNodes.length > 0 || outgoingNodes.length > 0) && (
              <div className={styles.popupConnections}>
                {incomingNodes.length > 0 && (
                  <div className={styles.popupEdgeGroup}>
                    <div className={styles.popupConnectionsLabel}>
                      ← {incomingNodes.length} incoming
                    </div>
                    <div className={styles.popupConnectionsList}>
                      {incomingNodes.map((cn) => (
                        <button
                          key={cn.id}
                          className={styles.popupConnectionItem}
                          style={{ borderColor: NODE_COLORS[cn.type] + "44", color: NODE_COLORS[cn.type] }}
                          onClick={() => setSelectedNode(cn.id)}
                        >
                          <span className={styles.popupBadgeDot} style={{ background: NODE_COLORS[cn.type] }} />
                          {cn.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {outgoingNodes.length > 0 && (
                  <div className={styles.popupEdgeGroup}>
                    <div className={styles.popupConnectionsLabel}>
                      → {outgoingNodes.length} outgoing
                    </div>
                    <div className={styles.popupConnectionsList}>
                      {outgoingNodes.map((cn) => (
                        <button
                          key={cn.id}
                          className={styles.popupConnectionItem}
                          style={{ borderColor: NODE_COLORS[cn.type] + "44", color: NODE_COLORS[cn.type] }}
                          onClick={() => setSelectedNode(cn.id)}
                        >
                          <span className={styles.popupBadgeDot} style={{ background: NODE_COLORS[cn.type] }} />
                          {cn.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── 3D Canvas ── */}
      <Canvas
        camera={{ position: [4, 6, 30], fov: 50, near: 0.1, far: 200 }}
        dpr={[1, 1.5]}
        performance={{ min: 0.5 }}
        style={{ background: "#0a0c14" }}
      >
        <Suspense fallback={null}>
          <Scene
            selectedNode={selectedNode}
            onSelect={handleSelect}
            hiddenNodeIds={hiddenNodeIds}
            tracePath={tracePath}
            resetKey={resetKey}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
