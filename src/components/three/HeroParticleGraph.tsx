import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// ── Individual node ──────────────────────────────────────
function Node({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!);
  const speed = useMemo(() => 0.3 + Math.random() * 0.5, []);
  const offset = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(t * speed + offset) * 0.3;
      const scale = 0.85 + Math.sin(t * speed * 1.3 + offset) * 0.15;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.12, 16, 16]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.6}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

// ── Edge between two positions ───────────────────────────
function Edge({
  start,
  end,
  opacity,
}: {
  start: [number, number, number];
  end: [number, number, number];
  opacity: number;
}) {
  const points = useMemo(() => {
    return [new THREE.Vector3(...start), new THREE.Vector3(...end)];
  }, [start, end]);

  const lineGeometry = useMemo(() => {
    const geom = new THREE.BufferGeometry().setFromPoints(points);
    return geom;
  }, [points]);

  return (
    // @ts-expect-error react-three-fiber line element
    <line geometry={lineGeometry}>
      <lineBasicMaterial
        color="#6e6bf4"
        transparent
        opacity={opacity * 0.35}
      />
    </line>
  );
}

// ── Scene content ─────────────────────────────────────────
function ParticleScene() {
  const groupRef = useRef<THREE.Group>(null!);

  // Generate node positions
  const nodes = useMemo<[number, number, number][]>(() => {
    const list: [number, number, number][] = [];
    for (let i = 0; i < 38; i++) {
      list.push([
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 6,
        (Math.random() - 0.5) * 5,
      ]);
    }
    return list;
  }, []);

  // Node colors — mostly violet with some mint & amber accents
  const nodeColors = useMemo(() =>
    nodes.map((_, i) => {
      if (i % 7 === 0) return '#4fd1a5';
      if (i % 11 === 0) return '#f2b84b';
      return '#6e6bf4';
    }),
  [nodes]);

  // Generate edges: connect each node to 2–3 nearby neighbours
  const edges = useMemo(() => {
    const edgeList: { start: [number, number, number]; end: [number, number, number]; opacity: number }[] = [];
    for (let i = 0; i < nodes.length; i++) {
      const distances = nodes
        .map((n, j) => ({ j, dist: new THREE.Vector3(...n).distanceTo(new THREE.Vector3(...nodes[i])) }))
        .filter((d) => d.j !== i)
        .sort((a, b) => a.dist - b.dist)
        .slice(0, 3);
      distances.forEach(({ j, dist }) => {
        if (i < j) {
          edgeList.push({
            start: nodes[i],
            end: nodes[j],
            opacity: Math.max(0.05, 1 - dist / 4),
          });
        }
      });
    }
    return edgeList;
  }, [nodes]);

  // Slow drift
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.04;
      groupRef.current.rotation.x = Math.sin(t * 0.02) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Nodes */}
      {nodes.map((pos, i) => (
        <Node key={i} position={pos} color={nodeColors[i]} />
      ))}
      {/* Edges */}
      {edges.map((e, i) => (
        <Edge key={i} start={e.start} end={e.end} opacity={e.opacity} />
      ))}
    </group>
  );
}

// ── Exported Canvas wrapper ────────────────────────────────
export default function HeroParticleGraph() {
  return (
    <Canvas
      camera={{ position: [0, 0, 10], fov: 55 }}
      style={{ width: '100%', height: '100%' }}
      dpr={[1, 1.5]}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1.2} color="#6e6bf4" />
      <pointLight position={[-5, -3, -4]} intensity={0.6} color="#4fd1a5" />
      <ParticleScene />
    </Canvas>
  );
}
