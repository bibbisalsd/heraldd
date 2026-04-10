"use client";

import { memo, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Line } from "@react-three/drei";
import { ArchNode, ArchEdge, NODE_COLORS } from "./archData";

interface Props {
  edge: ArchEdge;
  nodes: ArchNode[];
  highlightedNode: string | null;
}

function ArchEdge3D({ edge, nodes, highlightedNode }: Props) {
  const p1Ref = useRef<THREE.Mesh>(null!);
  const p2Ref = useRef<THREE.Mesh>(null!);
  const p3Ref = useRef<THREE.Mesh>(null!);
  const prog1 = useRef(Math.random());
  const prog2 = useRef((Math.random() + 0.5) % 1);
  const prog3 = useRef((Math.random() + 0.25) % 1);

  const fromNode = nodes.find((n) => n.id === edge.from);
  const toNode = nodes.find((n) => n.id === edge.to);

  const isHighlighted =
    highlightedNode === edge.from || highlightedNode === edge.to;
  const fromType = fromNode?.type ?? "brain";
  const color = isHighlighted ? NODE_COLORS[fromType] : "#3d2a10";

  const { points, curve, arrowPos, arrowQuat } = useMemo(() => {
    if (!fromNode || !toNode) {
      const zero = [0, 0, 0] as [number, number, number];
      return {
        points: [zero, zero],
        curve: new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(),
          new THREE.Vector3(),
          new THREE.Vector3()
        ),
        arrowPos: new THREE.Vector3(),
        arrowQuat: new THREE.Quaternion(),
      };
    }

    const start = new THREE.Vector3(...fromNode.position);
    const end = new THREE.Vector3(...toNode.position);
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const dist = start.distanceTo(end);
    mid.z += dist * 0.12;
    mid.y += dist * 0.1;

    const c = new THREE.QuadraticBezierCurve3(start, mid, end);
    const pts = c
      .getPoints(50)
      .map((p) => [p.x, p.y, p.z] as [number, number, number]);

    // Direction arrow at midpoint
    const ap = c.getPoint(0.5);
    const tangent = c.getTangent(0.5).normalize();
    const aq = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 1, 0),
      tangent
    );

    return { points: pts, curve: c, arrowPos: ap, arrowQuat: aq };
  }, [fromNode, toNode]);

  // Throttle: update every other frame
  const frameCount = useRef(0);
  useFrame((_, delta) => {
    frameCount.current++;
    if (frameCount.current % 2 !== 0) return;
    if (!curve) return;
    const speed = isHighlighted ? 0.35 : 0.18;
    const d = delta * 2; // compensate for skipped frame

    if (p1Ref.current) {
      prog1.current = (prog1.current + d * speed) % 1;
      p1Ref.current.position.copy(curve.getPoint(prog1.current));
    }
    if (p2Ref.current) {
      prog2.current = (prog2.current + d * speed * 0.65) % 1;
      p2Ref.current.position.copy(curve.getPoint(prog2.current));
    }
    if (p3Ref.current) {
      prog3.current = (prog3.current + d * speed * 1.3) % 1;
      p3Ref.current.position.copy(curve.getPoint(prog3.current));
    }
  });

  if (!fromNode || !toNode) return null;

  return (
    <group>
      <Line
        points={points}
        color={color}
        transparent
        opacity={isHighlighted ? 0.65 : 0.2}
        lineWidth={isHighlighted ? 2.5 : 1.2}
      />

      {/* Primary traveling particle */}
      <mesh ref={p1Ref}>
        <sphereGeometry args={[isHighlighted ? 0.12 : 0.07, 6, 6]} />
        <meshBasicMaterial
          color={isHighlighted ? NODE_COLORS[fromType] : "#06b6d4"}
          transparent
          opacity={isHighlighted ? 0.95 : 0.5}
        />
      </mesh>

      {/* Secondary particle */}
      <mesh ref={p2Ref}>
        <sphereGeometry args={[0.045, 6, 6]} />
        <meshBasicMaterial
          color={isHighlighted ? NODE_COLORS[fromType] : "#6366f1"}
          transparent
          opacity={isHighlighted ? 0.6 : 0.25}
        />
      </mesh>

      {/* Tertiary fast particle */}
      <mesh ref={p3Ref}>
        <sphereGeometry args={[0.04, 4, 4]} />
        <meshBasicMaterial
          color={isHighlighted ? NODE_COLORS[fromType] : "#ec4899"}
          transparent
          opacity={isHighlighted ? 0.5 : 0.3}
        />
      </mesh>

      {/* Direction arrow at midpoint */}
      <mesh position={arrowPos} quaternion={arrowQuat}>
        <coneGeometry args={[0.08, 0.22, 6]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={isHighlighted ? 0.7 : 0.25}
        />
      </mesh>
    </group>
  );
}

export default memo(ArchEdge3D, (prev, next) =>
  prev.edge.from === next.edge.from &&
  prev.edge.to === next.edge.to &&
  prev.highlightedNode === next.highlightedNode
);
