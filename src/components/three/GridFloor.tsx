"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function GridFloor() {
  const ringsRef = useRef<THREE.Group>(null!);
  const fc = useRef(0);

  useFrame((state) => {
    fc.current++;
    if (fc.current % 3 !== 0) return;
    if (ringsRef.current) {
      ringsRef.current.rotation.y = state.clock.elapsedTime * 0.015;
    }
  });

  return (
    <group>
      {/* Very faint reference grid — visible only up close */}
      <gridHelper args={[80, 40, "#151830", "#0d0f20"]} position={[4, -8, 0]} />

      {/* Ground fade plane */}
      <mesh position={[4, -8.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[80, 80]} />
        <meshBasicMaterial
          color="#08090d"
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Slow-spinning orbital reference rings for spatial depth */}
      <group ref={ringsRef} position={[4, 0, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[22, 22.04, 64]} />
          <meshBasicMaterial
            color="#1c2048"
            transparent
            opacity={0.1}
            side={THREE.DoubleSide}
          />
        </mesh>
        <mesh rotation={[Math.PI / 2.4, 0.25, 0]}>
          <ringGeometry args={[28, 28.03, 64]} />
          <meshBasicMaterial
            color="#1c2048"
            transparent
            opacity={0.055}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>
    </group>
  );
}
