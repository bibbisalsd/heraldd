"use client";

import { memo, useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { ArchNode, NODE_COLORS, NODE_EMISSIVE } from "./archData";
import styles from "./ArchNode3D.module.css";

const SKEPTIC_NODE_IDS = [
  "memory_service",
  "admission_control", 
  "guardrails",
  "addon_registry",
  "seat_controller",
  "seat_code",
  "seat_vision",
];

interface Props {
  node: ArchNode;
  selected: boolean;
  dimmed: boolean;
  onSelect: (id: string | null) => void;
}

const NODE_RADIUS: Record<ArchNode["type"], number> = {
  input: 0.55,
  brain: 0.75,
  lane: 0.65,
  tool: 0.65,
  renderer: 1.1,
  output: 0.55,
  memory: 0.65,
  addon: 0.6,
  guard: 0.6,
  planned: 0.5,
  cognitive: 0.7,
  "model-seat": 0.55,
  crsis: 0.6,
  partial: 0.5,
};

function ArchNode3D({ node, selected, dimmed, onSelect }: Props) {
  const groupRef = useRef<THREE.Group>(null!);
  const meshRef = useRef<THREE.Mesh>(null!);
  const glowRef = useRef<THREE.Mesh>(null!);
  const [hovered, setHovered] = useState(false);
  const baseColor = NODE_COLORS[node.type];
  const emissive = NODE_EMISSIVE[node.type];
  const isRenderer = node.type === "renderer";
  const isPlanned = node.type === "planned";
  const radius = NODE_RADIUS[node.type];
  const isSkepticNode = SKEPTIC_NODE_IDS.includes(node.id);
  const active = hovered || selected;

  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  const freq = useMemo(() => {
    const pulseFreq: Record<string, number> = {
      renderer: 1.8, brain: 0.6, lane: 1.0, tool: 0.8,
      memory: 0.5, guard: 1.5, planned: 2.0, input: 0.7,
      output: 0.7, addon: 0.8, cognitive: 0.9, "model-seat": 0.7,
    };
    return pulseFreq[node.type] ?? 0.7;
  }, [node.type]);

  // Throttle: skip every other frame for non-essential animations
  const frameCount = useRef(0);
  useFrame((state, delta) => {
    frameCount.current++;
    if (!meshRef.current) return;

    // Scale lerp runs every frame (needs smoothness)
    const targetScale = hovered || selected ? 1.18 : 1;
    const s = meshRef.current.scale.x;
    meshRef.current.scale.setScalar(
      THREE.MathUtils.lerp(s, targetScale, delta * 6)
    );

    // Everything else runs every other frame
    if (frameCount.current % 2 !== 0) return;

    // Gentle floating bob
    if (groupRef.current) {
      groupRef.current.position.y =
        node.position[1] +
        Math.sin(state.clock.elapsedTime * 0.4 + phase) * 0.12;
    }

    // Glow pulse
    if (glowRef.current) {
      const pulse =
        1 + Math.sin(state.clock.elapsedTime * 1.2 + phase) * 0.1;
      glowRef.current.scale.setScalar(pulse);
    }

    // Planned nodes: slow rotation
    if (isPlanned) {
      meshRef.current.rotation.y += delta * 2 * 0.1;
    }

    // Dynamic emissive pulsing per type
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const baseIntensity = active ? 2.0 : isPlanned ? 0.8 : 0.7;
    const amplitude = active ? 0.6 : 0.25;
    mat.emissiveIntensity = baseIntensity + Math.sin(state.clock.elapsedTime * freq + phase) * amplitude;
  });

  // Memoize label style to avoid new object every render
  const labelStyle = useMemo(() => ({
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    fontSize: "11px",
    fontWeight: 600 as const,
    color: active ? "#fff" : "#7a7f96",
    textAlign: "center" as const,
    textShadow: `0 0 14px rgba(0,0,0,0.95), 0 0 6px ${baseColor}55`,
    letterSpacing: "0.04em",
    transition: "color 0.2s",
  }), [active, baseColor]);

  return (
    <group ref={groupRef} position={node.position}>
      {/* Core sphere */}
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(selected ? null : node.id);
        }}
      >
        {isSkepticNode ? (
          <tetrahedronGeometry args={[radius, 0]} />
        ) : (
          <sphereGeometry args={[radius, 24, 24]} />
        )}
        <meshStandardMaterial
          color={active ? baseColor : isPlanned ? "#2a2d3e" : "#1a1d2e"}
          emissive={emissive}
          emissiveIntensity={active ? 2.5 : isPlanned ? 0.8 : 0.6}
          transparent
          opacity={isPlanned ? 0.6 : 0.95}
          metalness={isPlanned ? 0.7 : 0.85}
          roughness={isPlanned ? 0.2 : 0.15}
        />
      </mesh>

      {/* Atmosphere glow shell */}
      <mesh ref={glowRef}>
        {isSkepticNode ? (
          <tetrahedronGeometry args={[radius * 1.5, 0]} />
        ) : (
          <sphereGeometry args={[radius * 1.5, 16, 16]} />
        )}
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={active ? 0.22 : 0.08}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Outer bloom halo — extra light bleed */}
      <mesh>
        <sphereGeometry args={[radius * 2.2, 8, 8]} />
        <meshBasicMaterial
          color={baseColor}
          transparent
          opacity={active ? 0.06 : 0.02}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Wireframe overlay for holographic scan-line look */}
      <mesh>
        <sphereGeometry args={[radius * 1.05, 12, 8]} />
        <meshBasicMaterial
          color={baseColor}
          wireframe
          transparent
          opacity={active ? 0.4 : 0.15}
        />
      </mesh>

      {/* Subtle ring for brain nodes */}
      {node.type === "brain" && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * 1.45, 0.012, 8, 48]} />
          <meshBasicMaterial
            color={baseColor}
            transparent
            opacity={0.18}
          />
        </mesh>
      )}

      {/* Planned nodes: dashed ring + stronger wireframe for "future state" look */}
      {isPlanned && (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[radius * 1.5, 0.015, 8, 24]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={active ? 0.35 : 0.15}
            />
          </mesh>
          <mesh rotation={[Math.PI / 4, Math.PI / 6, 0]}>
            <torusGeometry args={[radius * 1.3, 0.01, 8, 24]} />
            <meshBasicMaterial
              color="#ffffff"
              transparent
              opacity={active ? 0.25 : 0.08}
            />
          </mesh>
        </>
      )}

      {/* Cognitive nodes: single orbital ring */}
      {node.type === "cognitive" && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[radius * 1.5, 0.015, 8, 48]} />
          <meshBasicMaterial
            color="#facc15"
            transparent
            opacity={active ? 0.35 : 0.15}
          />
        </mesh>
      )}

      {/* Hover tooltip — hidden when another node is selected */}
      {hovered && !selected && !dimmed && (
        <Html
          center
          position={[0, radius + 1.3, 0]}
          distanceFactor={18}
          style={{ pointerEvents: "none", userSelect: "none" }}
        >
          <div className={styles.tooltip}>
            <div className={styles.tooltipName}>{node.label}</div>
            <div className={styles.tooltipType} style={{ color: baseColor }}>
              {node.type.toUpperCase()}
            </div>
          </div>
        </Html>
      )}

      {/* Label floats above — hidden when another node is selected */}
      {!dimmed && (
        <Html
          center
          position={[0, radius + 0.45, 0]}
          distanceFactor={18}
          style={{ pointerEvents: "none", userSelect: "none", whiteSpace: "nowrap" }}
        >
          <div style={labelStyle}>
            {node.label}
          </div>
        </Html>
      )}
    </group>
  );
}

export default memo(ArchNode3D, (prev, next) =>
  prev.node.id === next.node.id &&
  prev.selected === next.selected &&
  prev.dimmed === next.dimmed &&
  prev.onSelect === next.onSelect
);
