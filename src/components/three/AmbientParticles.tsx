"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

/**
 * Ambient floating particles that react to scroll velocity.
 * Lightweight full-viewport canvas behind all content.
 */
export default function AmbientParticles({ count = 150 }: { count?: number }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        pointerEvents: "none",
        opacity: 0.25,
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "low-power",
        }}
        dpr={[1, 1.5]}
      >
        <color attach="background" args={["#0a0a0f"]} />
        <ambientLight intensity={0.3} />
        <ParticleSystem count={count} />
      </Canvas>
    </div>
  );
}

function ParticleSystem({ count }: { count: number }) {
  const mesh = useRef<THREE.Points>(null);
  const velocities = useRef<Float32Array | null>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    velocities.current = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      // Spread throughout viewport (in normalized coordinates)
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
      randoms[i] = Math.random();
      
      // Random drift velocities
      velocities.current![i * 3] = (Math.random() - 0.5) * 0.002;
      velocities.current![i * 3 + 1] = Math.random() * 0.003 + 0.001;
      velocities.current![i * 3 + 2] = (Math.random() - 0.5) * 0.001;
    }
    
    return { positions, randoms };
  }, [count]);

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(particles.positions, 3));
    return geo;
  }, [particles.positions]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    const positions = mesh.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Upward drift
      positions[i3 + 1] += velocities.current![i3 + 1];
      
      // Subtle horizontal sway
      positions[i3] += Math.sin(time * 0.3 + particles.randoms[i] * 6) * 0.001;
      positions[i3 + 2] += Math.cos(time * 0.2 + particles.randoms[i] * 4) * 0.0005;
      
      // Wrap around when out of view
      if (positions[i3 + 1] > 10) {
        positions[i3 + 1] = -10;
      }
      if (positions[i3] > 10) positions[i3] = -10;
      if (positions[i3] < -10) positions[i3] = 10;
      if (positions[i3 + 2] > 5) positions[i3 + 2] = -5;
      if (positions[i3 + 2] < -5) positions[i3 + 2] = 5;
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial
        size={0.04}
        color="#4f8ff7"
        transparent
        opacity={0.5}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}