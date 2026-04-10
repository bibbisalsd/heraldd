"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "@react-three/drei";
import { NODES, NODE_COLORS } from "./archData";

interface NodeProps {
  position: [number, number, number];
  color: string;
  scale?: number;
  pulse?: boolean;
}

function GlowNode({ position, color, scale = 1, pulse = true }: NodeProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Pulse animation
    if (pulse) {
      const t = state.clock.elapsedTime;
      const s = 1 + Math.sin(t * 2 + position[0]) * 0.1;
      meshRef.current.scale.setScalar(scale * s);
    }
    
    // Glow follows with offset
    if (glowRef.current) {
      glowRef.current.scale.copy(meshRef.current.scale).multiplyScalar(1.3);
    }
  });

  return (
    <group position={position}>
      {/* Main node */}
      <mesh ref={meshRef}>
        <octahedronGeometry args={[0.3 * scale, 0]} />
        <meshStandardMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.5}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      {/* Glow sphere */}
      <mesh ref={glowRef} scale={1.3}>
        <sphereGeometry args={[0.35 * scale, 16, 16]} />
        <meshBasicMaterial 
          color={color} 
          transparent 
          opacity={0.15}
        />
      </mesh>
    </group>
  );
}

function ConnectionLine({ 
  start, 
  end, 
  color,
}: { 
  start: [number, number, number]; 
  end: [number, number, number];
  color: string;
}) {
  // Simple tube geometry for connection line
  const curve = useMemo(() => {
    return new THREE.LineCurve3(
      new THREE.Vector3(...start),
      new THREE.Vector3(...end)
    );
  }, [start, end]);

  return (
    <mesh>
      <tubeGeometry args={[curve, 1, 0.02, 8, false]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </mesh>
  );
}

// Key Herald architecture nodes for the hero scene
const HERO_NODES: { id: string; label: string; position: [number, number, number]; color: string }[] = [
  { id: "ingress", label: "Ingress", position: [-4, 0, 0], color: "#6b7280" },
  { id: "normalizer", label: "Normalizer", position: [-2.5, 0, 0], color: "#3b82f6" },
  { id: "dispatcher", label: "Dispatcher", position: [0, 0, 0], color: "#3b82f6" },
  { id: "lane", label: "Lane", position: [2, 0.5, 0], color: "#8b5cf6" },
  { id: "compiler", label: "Compiler", position: [2, -0.5, 0], color: "#3b82f6" },
  { id: "renderer", label: "Renderer", position: [4, 0, 0], color: "#f59e0b" },
  { id: "output", label: "Output", position: [6, 0, 0], color: "#6b7280" },
];

export default function HeroNodes() {
  const groupRef = useRef<THREE.Group>(null);
  const scroll = useScroll();

  // Calculate which nodes should be active based on scroll
  // Scroll 0-0.3: Ingress -> Normalizer
  // Scroll 0.3-0.5: Normalizer -> Dispatcher  
  // Scroll 0.5-0.7: Dispatcher -> Lane/Compiler
  // Scroll 0.7-1.0: All to Renderer -> Output
  
  const activeIndices = useMemo(() => {
    return [0];
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    
    // Subtle rotation based on scroll offset
    const r = scroll.offset;
    groupRef.current.rotation.y = r * 0.2;
    groupRef.current.rotation.x = Math.sin(r * Math.PI) * 0.1;
  });

  return (
    <group ref={groupRef}>
      {HERO_NODES.map((node, i) => (
        <GlowNode
          key={node.id}
          position={node.position}
          color={activeIndices.includes(i) ? node.color : "#2a2a35"}
          scale={activeIndices.includes(i) ? 1 : 0.5}
          pulse={activeIndices.includes(i)}
        />
      ))}
      
      {/* Connection lines */}
      {HERO_NODES.slice(0, -1).map((node, i) => {
        const progress = activeIndices.includes(i + 1) 
          ? 1 
          : activeIndices.includes(i) 
            ? 0.5 
            : 0;
        return (
          <ConnectionLine
            key={`line-${i}`}
            start={node.position}
            end={HERO_NODES[i + 1].position}
            color="#3b82f6"
          />
        );
      })}
    </group>
  );
}