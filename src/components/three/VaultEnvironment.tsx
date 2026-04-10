"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ══════════════════════════════════════════════════════════════
   STAR FIELD — distant stars for the orbital void
   ══════════════════════════════════════════════════════════════ */
const STAR_COUNT = 600;

function StarField() {
  const positions = useMemo(() => {
    const arr = new Float32Array(STAR_COUNT * 3);
    for (let i = 0; i < STAR_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 70 + Math.random() * 50;
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta) + 4;
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, []);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={STAR_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ffffff"
        size={0.12}
        transparent
        opacity={0.5}
        sizeAttenuation={false}
        depthWrite={false}
      />
    </points>
  );
}

/* ══════════════════════════════════════════════════════════════
   EARTH GLOW — planet with city lights visible through floor
   ══════════════════════════════════════════════════════════════ */
const CITY_LIGHT_COUNT = 400;

function EarthGlow() {
  const earthRef = useRef<THREE.Group>(null!);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(CITY_LIGHT_COUNT * 3);
    const col = new Float32Array(CITY_LIGHT_COUNT * 3);
    const palette = [
      new THREE.Color("#f59e0b"),
      new THREE.Color("#fbbf24"),
      new THREE.Color("#ffffff"),
      new THREE.Color("#fed7aa"),
      new THREE.Color("#4f8ff7"),
    ];

    for (let i = 0; i < CITY_LIGHT_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      // Only top hemisphere — visible from above
      if (phi > Math.PI * 0.45) {
        pos[i * 3] = 0;
        pos[i * 3 + 1] = -500;
        pos[i * 3 + 2] = 0;
        continue;
      }
      const r = 44;
      pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.cos(phi);
      pos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);

      const c = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, []);

  useFrame((_, delta) => {
    if (earthRef.current) earthRef.current.rotation.y += delta * 0.002;
  });

  return (
    <group ref={earthRef} position={[4, -52, 0]}>
      {/* Dark planet surface */}
      <mesh>
        <sphereGeometry args={[42, 48, 48]} />
        <meshStandardMaterial
          color="#020406"
          emissive="#060c18"
          emissiveIntensity={0.3}
          metalness={0.8}
          roughness={0.9}
        />
      </mesh>
      {/* Atmospheric rim */}
      <mesh>
        <sphereGeometry args={[44, 48, 48]} />
        <meshBasicMaterial
          color="#1e3a8a"
          transparent
          opacity={0.05}
          side={THREE.BackSide}
        />
      </mesh>
      {/* City lights */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
            count={CITY_LIGHT_COUNT}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
            count={CITY_LIGHT_COUNT}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.6}
          vertexColors
          transparent
          opacity={0.55}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   GLASS FLOOR — semi-transparent with edge glow
   ══════════════════════════════════════════════════════════════ */
function GlassFloor() {
  return (
    <group position={[4, -8, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial
          color="#060a14"
          transparent
          opacity={0.3}
          metalness={0.95}
          roughness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>
      <gridHelper args={[100, 60, "#0d1020", "#080c16"]} />
      {/* Subtle circular edge glow */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
        <ringGeometry args={[36, 37, 64]} />
        <meshBasicMaterial
          color="#f59e0b"
          transparent
          opacity={0.035}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   HYPERCAR SILHOUETTES — low-poly on floating hex platforms
   ══════════════════════════════════════════════════════════════ */

interface CarConfig {
  body: [number, number, number];
  cabin: [number, number, number];
  cabinOff: [number, number, number];
  wedge: boolean;
  rim: string;
}

const CAR_CONFIGS: Record<string, CarConfig> = {
  lambo: {
    body: [4.0, 0.38, 1.7],
    cabin: [1.4, 0.38, 1.5],
    cabinOff: [-0.3, 0.38, 0],
    wedge: true,
    rim: "#f59e0b",
  },
  bugatti: {
    body: [4.4, 0.5, 1.8],
    cabin: [1.8, 0.44, 1.6],
    cabinOff: [-0.2, 0.5, 0],
    wedge: false,
    rim: "#3b82f6",
  },
  rolls: {
    body: [5.0, 0.6, 1.9],
    cabin: [2.6, 0.65, 1.8],
    cabinOff: [0.1, 0.6, 0],
    wedge: false,
    rim: "#a855f7",
  },
  maybach: {
    body: [5.4, 0.55, 1.95],
    cabin: [2.8, 0.58, 1.85],
    cabinOff: [0.15, 0.55, 0],
    wedge: false,
    rim: "#ec4899",
  },
};

function CarSilhouette({
  variant,
  position,
  rotation,
}: {
  variant: string;
  position: [number, number, number];
  rotation: number;
}) {
  const groupRef = useRef<THREE.Group>(null!);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const c = CAR_CONFIGS[variant];

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime * 0.25 + phase) * 0.18;
    }
  });

  const carMat = useMemo(
    () => ({
      color: "#080a10",
      emissive: c.rim,
      emissiveIntensity: 0.04,
      metalness: 0.95,
      roughness: 0.15,
    }),
    [c.rim],
  );

  return (
    <group ref={groupRef} position={position}>
      <group rotation={[0, rotation, 0]}>
        {/* Hex platform */}
        <mesh position={[0, -0.2, 0]}>
          <cylinderGeometry args={[3.5, 3.5, 0.1, 6]} />
          <meshStandardMaterial
            color="#0a0c14"
            emissive={c.rim}
            emissiveIntensity={0.12}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        {/* Platform edge ring */}
        <mesh position={[0, -0.2, 0]}>
          <torusGeometry args={[3.5, 0.025, 8, 6]} />
          <meshBasicMaterial color={c.rim} transparent opacity={0.35} />
        </mesh>

        {/* Body */}
        <mesh position={[0, c.body[1] / 2, 0]}>
          <boxGeometry args={c.body} />
          <meshStandardMaterial {...carMat} />
        </mesh>

        {/* Cabin */}
        <mesh
          position={[
            c.cabinOff[0],
            c.body[1] + c.cabin[1] / 2,
            c.cabinOff[2],
          ]}
        >
          <boxGeometry args={c.cabin} />
          <meshStandardMaterial {...carMat} emissiveIntensity={0.03} />
        </mesh>

        {/* Front wedge (Lamborghini) */}
        {c.wedge && (
          <mesh position={[2.0, 0.14, 0]} rotation={[0, 0, -0.15]}>
            <boxGeometry args={[1.2, 0.18, 1.6]} />
            <meshStandardMaterial {...carMat} />
          </mesh>
        )}

        {/* Headlights */}
        <mesh
          position={[c.body[0] / 2, c.body[1] * 0.6, c.body[2] * 0.3]}
        >
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshBasicMaterial color={c.rim} transparent opacity={0.9} />
        </mesh>
        <mesh
          position={[c.body[0] / 2, c.body[1] * 0.6, -c.body[2] * 0.3]}
        >
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshBasicMaterial color={c.rim} transparent opacity={0.9} />
        </mesh>

        {/* Taillights */}
        <mesh
          position={[-c.body[0] / 2, c.body[1] * 0.5, c.body[2] * 0.35]}
        >
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.7} />
        </mesh>
        <mesh
          position={[-c.body[0] / 2, c.body[1] * 0.5, -c.body[2] * 0.35]}
        >
          <sphereGeometry args={[0.06, 6, 6]} />
          <meshBasicMaterial color="#ef4444" transparent opacity={0.7} />
        </mesh>

        {/* Backlight for silhouette rim-lighting */}
        <pointLight
          position={[-3.5, 1.2, 0]}
          intensity={0.4}
          color={c.rim}
          distance={8}
        />
      </group>
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   GOLD STREAMS — particles drifting from periphery to center
   ══════════════════════════════════════════════════════════════ */
const GOLD_COUNT = 100;

function GoldStreams() {
  const pointsRef = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(GOLD_COUNT * 3);
    for (let i = 0; i < GOLD_COUNT; i++) {
      const theta = Math.random() * Math.PI * 2;
      const r = 18 + Math.random() * 16;
      arr[i * 3] = r * Math.cos(theta) + 4;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10 - 2;
      arr[i * 3 + 2] = r * Math.sin(theta);
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position;
    const arr = pos.array as Float32Array;
    const cx = 4,
      cy = 0,
      cz = 0;

    for (let i = 0; i < GOLD_COUNT; i++) {
      const ix = i * 3,
        iy = i * 3 + 1,
        iz = i * 3 + 2;
      const dx = cx - arr[ix],
        dy = cy - arr[iy],
        dz = cz - arr[iz];
      const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const speed = delta * 0.7;
      arr[ix] += (dx / dist) * speed;
      arr[iy] += (dy / dist) * speed * 0.4;
      arr[iz] += (dz / dist) * speed;

      // Gentle orbit
      const angle = delta * 0.06;
      const x = arr[ix] - cx,
        z = arr[iz] - cz;
      arr[ix] = cx + x * Math.cos(angle) - z * Math.sin(angle);
      arr[iz] = cz + x * Math.sin(angle) + z * Math.cos(angle);

      if (dist < 5) {
        const theta = Math.random() * Math.PI * 2;
        const r = 18 + Math.random() * 16;
        arr[ix] = r * Math.cos(theta) + cx;
        arr[iy] = (Math.random() - 0.5) * 10 - 2;
        arr[iz] = r * Math.sin(theta);
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={GOLD_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f59e0b"
        size={0.18}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ══════════════════════════════════════════════════════════════
   LIGHT SHAFTS — volumetric cone lights from above
   ══════════════════════════════════════════════════════════════ */

const SHAFTS = [
  { pos: [-14, 20, 10] as const, color: "#f59e0b", opacity: 0.025 },
  { pos: [22, 22, -8] as const, color: "#3b82f6", opacity: 0.02 },
  { pos: [2, 18, -12] as const, color: "#a855f7", opacity: 0.018 },
  { pos: [30, 20, 6] as const, color: "#ec4899", opacity: 0.02 },
];

function LightShafts() {
  const refs = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    refs.current.forEach((mesh, i) => {
      if (mesh)
        mesh.rotation.z =
          Math.sin(state.clock.elapsedTime * 0.08 + i * 1.5) * 0.04;
    });
  });

  return (
    <group>
      {SHAFTS.map((shaft, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) refs.current[i] = el;
          }}
          position={shaft.pos as unknown as [number, number, number]}
          rotation={[Math.PI, 0, 0]}
        >
          <coneGeometry args={[8, 30, 8, 1, true]} />
          <meshBasicMaterial
            color={shaft.color}
            transparent
            opacity={shaft.opacity}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ══════════════════════════════════════════════════════════════
   MONEY RAIN — slow-falling green/gold particles
   ══════════════════════════════════════════════════════════════ */
const MONEY_COUNT = 50;

function MoneyRain() {
  const pointsRef = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const arr = new Float32Array(MONEY_COUNT * 3);
    for (let i = 0; i < MONEY_COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 60 + 4;
      arr[i * 3 + 1] = Math.random() * 25 - 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position;
    const arr = pos.array as Float32Array;

    for (let i = 0; i < MONEY_COUNT; i++) {
      const ix = i * 3,
        iy = i * 3 + 1,
        iz = i * 3 + 2;
      arr[iy] -= delta * 0.35;
      arr[ix] +=
        Math.sin(state.clock.elapsedTime * 0.2 + i) * delta * 0.08;
      arr[iz] +=
        Math.cos(state.clock.elapsedTime * 0.15 + i * 0.5) * delta * 0.04;

      if (arr[iy] < -10) {
        arr[ix] = (Math.random() - 0.5) * 60 + 4;
        arr[iy] = 18 + Math.random() * 8;
        arr[iz] = (Math.random() - 0.5) * 40;
      }
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={MONEY_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#22c55e"
        size={0.22}
        transparent
        opacity={0.35}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ══════════════════════════════════════════════════════════════
   MAIN EXPORT
   ══════════════════════════════════════════════════════════════ */
export default function VaultEnvironment() {
  return (
    <group>
      <StarField />
      <EarthGlow />
      <GlassFloor />
      <LightShafts />
      <GoldStreams />
      <MoneyRain />

      {/* Hypercars on floating platforms — positioned outside the node cluster */}
      <CarSilhouette variant="lambo" position={[-18, -3, 14]} rotation={0.45} />
      <CarSilhouette variant="bugatti" position={[28, -5, -13]} rotation={2.6} />
      <CarSilhouette variant="rolls" position={[-16, 2, -14]} rotation={1.0} />
      <CarSilhouette variant="maybach" position={[30, -1, 11]} rotation={2.1} />
    </group>
  );
}
