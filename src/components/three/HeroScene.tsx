"use client";

import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useScroll } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import HeroNodes from "./HeroNodes";
import useDeviceTier from "@/hooks/useDeviceTier";

function ScrollCamera() {
  const scroll = useScroll();
  const { camera } = useThree();
  
  // Camera path: start at wide view, fly through architecture, end zoomed out
  const startPos = useMemo(() => new THREE.Vector3(0, 8, 25), []);
  const midPos = useMemo(() => new THREE.Vector3(2, 3, 8), []);
  const endPos = useMemo(() => new THREE.Vector3(0, 1.5, 5), []);
  
  const startLook = useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const midLook = useMemo(() => new THREE.Vector3(1, 0.5, 0), []);
  const endLook = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useFrame(() => {
    const r = scroll.range(0, 1);
    
    // Smooth camera position interpolation
    if (r < 0.5) {
      // First half: wide to mid
      const t = r * 2;
      const eased = easeInOutCubic(t);
      camera.position.lerpVectors(startPos, midPos, eased);
      const lookTarget = new THREE.Vector3().lerpVectors(startLook, midLook, eased);
      camera.lookAt(lookTarget);
    } else {
      // Second half: mid to end
      const t = (r - 0.5) * 2;
      const eased = easeInOutCubic(t);
      camera.position.lerpVectors(midPos, endPos, eased);
      const lookTarget = new THREE.Vector3().lerpVectors(midLook, endLook, eased);
      camera.lookAt(lookTarget);
    }
  });

  return null;
}

// Easing function
function easeInOutCubic(t: number): number {
  return t < 0.5 
    ? 4 * t * t * t 
    : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function Particles({ count = 400 }: { count?: number }) {
  const mesh = useRef<THREE.Points>(null);
  
  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randoms = new Float32Array(count);
    
    for (let i = 0; i < count; i++) {
      // Spread particles along the pipeline path
      const t = Math.random();
      positions[i * 3] = (t - 0.5) * 8; // x: along pipeline
      positions[i * 3 + 1] = (Math.random() - 0.5) * 4; // y: spread
      positions[i * 3 + 2] = (Math.random() - 0.5) * 6; // z: depth
      randoms[i] = Math.random();
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
      // Flow particles along x-axis
      positions[i * 3 + 1] += Math.sin(time * 0.5 + particles.randoms[i] * 10) * 0.002;
      positions[i * 3 + 2] += Math.cos(time * 0.3 + particles.randoms[i] * 8) * 0.001;
    }
    
    mesh.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial
        size={0.03}
        color="#4f8ff7"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function HeroScene() {
  const deviceTier = useDeviceTier();
  const [ready, setReady] = useState(false);

  // Wait for client-side hydration
  useEffect(() => setReady(true), []);

  // Don't render on low-end devices or if reduced motion preferred
  if (!ready || deviceTier.tier === "low" || deviceTier.prefersReducedMotion) {
    return null;
  }

  const particlesCount = deviceTier.tier === "high" ? 300 : 150;
  const dpr = deviceTier.tier === "high" ? 2 : 1;

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      zIndex: -1,
      pointerEvents: "none"
    }}>
      <Canvas
        camera={{ position: [0, 8, 25], fov: 50 }}
        gl={{ 
          antialias: true, 
          alpha: true,
          powerPreference: deviceTier.tier === "high" ? "high-performance" : "default"
        }}
        dpr={dpr}
      >
        <color attach="background" args={["#0a0a0f"]} />
        
        {/* Ambient lighting */}
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={0.8} color="#4f8ff7" />
        <pointLight position={[-10, -10, -5]} intensity={0.4} color="#8b5cf6" />
        
        <ScrollCamera />
        
        <HeroNodes />
        <Particles count={particlesCount} />
        
        {/* Post-processing only on high tier */}
        {deviceTier.tier === "high" && (
          <EffectComposer>
            <Bloom 
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              intensity={0.8}
            />
            <Vignette eskil={false} offset={0.1} darkness={0.5} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
}