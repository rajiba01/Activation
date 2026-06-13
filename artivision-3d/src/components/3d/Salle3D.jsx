// src/components/3d/Salle3D.jsx - Version Musée Professionnel
import { useMemo, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import ArtworkFrame from "./ArtworkFrame";
import * as THREE from "three";

const ROOM = {
  width: 18,
  height: 5,
  depth: 12,
};

// Positions optimisées pour un circuit muséal naturel
const WALL_POSITIONS = [
  // Mur Nord — œuvres principales
  { position: [-5.5, 1.9, -5.7], rotation: [0, 0, 0], zone: "north" },
  { position: [-1.8, 1.9, -5.7], rotation: [0, 0, 0], zone: "north" },
  { position: [1.8, 1.9, -5.7], rotation: [0, 0, 0], zone: "north" },
  { position: [5.5, 1.9, -5.7], rotation: [0, 0, 0], zone: "north" },

  // Mur Sud
  { position: [-5.5, 1.9, 5.7], rotation: [0, Math.PI, 0], zone: "south" },
  { position: [-1.8, 1.9, 5.7], rotation: [0, Math.PI, 0], zone: "south" },
  { position: [1.8, 1.9, 5.7], rotation: [0, Math.PI, 0], zone: "south" },
  { position: [5.5, 1.9, 5.7], rotation: [0, Math.PI, 0], zone: "south" },

  // Mur Ouest
  { position: [-8.7, 1.9, -3.5], rotation: [0, Math.PI / 2, 0], zone: "west" },
  { position: [-8.7, 1.9, 0.5], rotation: [0, Math.PI / 2, 0], zone: "west" },
  { position: [-8.7, 1.9, 4.5], rotation: [0, Math.PI / 2, 0], zone: "west" },

  // Mur Est
  { position: [8.7, 1.9, -3.5], rotation: [0, -Math.PI / 2, 0], zone: "east" },
  { position: [8.7, 1.9, 0.5], rotation: [0, -Math.PI / 2, 0], zone: "east" },
  { position: [8.7, 1.9, 4.5], rotation: [0, -Math.PI / 2, 0], zone: "east" },
];

// Spots de musée pour chaque œuvre
function ArtworkSpotlight({ position, target }) {
  const lightRef = useRef();
  return (
    <spotLight
      ref={lightRef}
      position={position}
      target-position={target}
      intensity={1.2}
      angle={0.28}
      penumbra={0.7}
      color="#FFF5D6"
      castShadow={false}
      distance={8}
      decay={2}
    />
  );
}

// Système d'éclairage professionnel de musée
function Lighting() {
  const warmRef = useRef();

  useFrame(({ clock }) => {
    if (warmRef.current) {
      const t = clock.getElapsedTime() * 0.3;
      warmRef.current.intensity = 0.4 + Math.sin(t) * 0.04;
    }
  });

  return (
    <>
      {/* Ambiance générale douce */}
      <ambientLight intensity={0.35} color="#F0E8D8" />

      {/* Lumière de remplissage froide (contraste muséal) */}
      <directionalLight
        position={[0, 8, 2]}
        intensity={0.6}
        color="#D8E8F5"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.1}
        shadow-camera-far={30}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={8}
        shadow-camera-bottom={-8}
      />

      {/* Lumière chaude centrale — lustre */}
      <pointLight
        ref={warmRef}
        position={[0, 4.2, 0]}
        intensity={0.5}
        color="#FFD080"
        distance={16}
        decay={2}
      />

      {/* Spots mur Nord */}
      <spotLight position={[-5.5, 4.8, -3]} angle={0.3} penumbra={0.8} intensity={1.4} color="#FFF5D6" target-position={[-5.5, 1.9, -5.7]} />
      <spotLight position={[-1.8, 4.8, -3]} angle={0.3} penumbra={0.8} intensity={1.4} color="#FFF5D6" target-position={[-1.8, 1.9, -5.7]} />
      <spotLight position={[1.8, 4.8, -3]} angle={0.3} penumbra={0.8} intensity={1.4} color="#FFF5D6" target-position={[1.8, 1.9, -5.7]} />
      <spotLight position={[5.5, 4.8, -3]} angle={0.3} penumbra={0.8} intensity={1.4} color="#FFF5D6" target-position={[5.5, 1.9, -5.7]} />

      {/* Spots mur Sud */}
      <spotLight position={[-5.5, 4.8, 3]} angle={0.3} penumbra={0.8} intensity={1.1} color="#FFF5D6" target-position={[-5.5, 1.9, 5.7]} />
      <spotLight position={[1.8, 4.8, 3]} angle={0.3} penumbra={0.8} intensity={1.1} color="#FFF5D6" target-position={[1.8, 1.9, 5.7]} />
      <spotLight position={[5.5, 4.8, 3]} angle={0.3} penumbra={0.8} intensity={1.1} color="#FFF5D6" target-position={[5.5, 1.9, 5.7]} />

      {/* Spots murs latéraux */}
      <spotLight position={[-5, 4.8, -3.5]} angle={0.32} penumbra={0.8} intensity={1.0} color="#FFF5D6" target-position={[-8.7, 1.9, -3.5]} />
      <spotLight position={[-5, 4.8, 0.5]} angle={0.32} penumbra={0.8} intensity={1.0} color="#FFF5D6" target-position={[-8.7, 1.9, 0.5]} />
      <spotLight position={[5, 4.8, -3.5]} angle={0.32} penumbra={0.8} intensity={1.0} color="#FFF5D6" target-position={[8.7, 1.9, -3.5]} />
      <spotLight position={[5, 4.8, 0.5]} angle={0.32} penumbra={0.8} intensity={1.0} color="#FFF5D6" target-position={[8.7, 1.9, 0.5]} />

      {/* Lumière d'entrée */}
      <spotLight position={[0, 4.5, 7]} intensity={0.9} angle={0.4} penumbra={0.6} color="#FFF8E8" />
    </>
  );
}

// Sol en marbre procédural
function Floor() {
  const floorTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");

    // Base marbre clair
    ctx.fillStyle = "#E8DFCF";
    ctx.fillRect(0, 0, 1024, 1024);

    // Veines de marbre
    for (let i = 0; i < 40; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const len = 80 + Math.random() * 200;
      const angle = Math.random() * Math.PI;
      const opacity = 0.03 + Math.random() * 0.06;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = `rgba(160,140,110,${opacity})`;
      ctx.lineWidth = 0.5 + Math.random() * 1.5;
      ctx.beginPath();
      ctx.moveTo(-len / 2, 0);

      // Courbe sinueuse
      for (let j = 0; j < 10; j++) {
        const px = -len / 2 + (len / 10) * j;
        const py = (Math.random() - 0.5) * 12;
        ctx.lineTo(px, py);
      }
      ctx.stroke();
      ctx.restore();
    }

    // Joints de dalles (grille subtile)
    ctx.strokeStyle = "rgba(180,160,130,0.25)";
    ctx.lineWidth = 1.5;
    const tileSize = 256;
    for (let i = 0; i <= 1024; i += tileSize) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1024); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke();
    }

    // Reflet central doux
    const grad = ctx.createRadialGradient(512, 512, 0, 512, 512, 600);
    grad.addColorStop(0, "rgba(255,255,255,0.08)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 2);
    return texture;
  }, []);

  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth, 1, 1]} />
        <meshStandardMaterial
          map={floorTexture}
          roughness={0.25}
          metalness={0.12}
          color="#D8CFBA"
        />
      </mesh>
      {/* Plinthe au sol */}
      <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color="#C8B89A" roughness={0.4} metalness={0.15} />
      </mesh>
    </>
  );
}

// Plafond avec caissons et lustre
function Ceiling() {
  return (
    <>
      {/* Plafond principal */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.height, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color="#F8F4EC" roughness={0.85} metalness={0.0} />
      </mesh>

      {/* Corniche périmétrique */}
      <mesh position={[0, ROOM.height - 0.12, 0]}>
        <boxGeometry args={[ROOM.width - 0.1, 0.22, ROOM.depth - 0.1]} />
        <meshStandardMaterial color="#F0EAD8" roughness={0.6} metalness={0.05} />
      </mesh>

      {/* Caissons décoratifs (grille 3x2) */}
      {[[-5, -3], [0, -3], [5, -3], [-5, 2], [0, 2], [5, 2]].map(([x, z], i) => (
        <group key={i} position={[x, ROOM.height - 0.05, z]}>
          <mesh>
            <boxGeometry args={[3.8, 0.08, 3.8]} />
            <meshStandardMaterial color="#EDE6D5" roughness={0.7} />
          </mesh>
          <mesh>
            <boxGeometry args={[3.4, 0.12, 3.4]} />
            <meshStandardMaterial color="#F5F0E5" roughness={0.65} />
          </mesh>
        </group>
      ))}

      {/* Lustre central */}
      <group position={[0, ROOM.height - 0.3, 0]}>
        {/* Anneau */}
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.7, 0.04, 12, 48]} />
          <meshStandardMaterial color="#C9A040" metalness={0.9} roughness={0.15} />
        </mesh>
        {/* Pendentifs */}
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <group key={i} position={[Math.cos(a) * 0.7, 0, Math.sin(a) * 0.7]}>
              <mesh position={[0, -0.12, 0]}>
                <cylinderGeometry args={[0.015, 0.015, 0.22, 6]} />
                <meshStandardMaterial color="#C9A040" metalness={0.9} roughness={0.1} />
              </mesh>
              <mesh position={[0, -0.25, 0]}>
                <sphereGeometry args={[0.05, 12, 12]} />
                <meshStandardMaterial color="#E8C06A" metalness={0.8} roughness={0.1} emissive="#FFD060" emissiveIntensity={0.3} />
              </mesh>
            </group>
          );
        })}
        {/* Tige centrale */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 0.5, 8]} />
          <meshStandardMaterial color="#B8922A" metalness={0.85} roughness={0.2} />
        </mesh>
      </group>
    </>
  );
}

// Murs avec texture enduit artistique
function Walls() {
  const wallTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");

    // Couleur de base bordeaux très sombre
    ctx.fillStyle = "#2A1218";
    ctx.fillRect(0, 0, 512, 512);

    // Texture enduit subtile
    for (let i = 0; i < 6000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const r = Math.random() * 2;
      const op = Math.random() * 0.04;
      ctx.fillStyle = `rgba(255,220,180,${op})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    return new THREE.CanvasTexture(canvas);
  }, []);

  const hw = ROOM.width / 2;
  const hd = ROOM.depth / 2;
  const wallColor = "#2A1218";

  return (
    <>
      {/* Mur Nord */}
      <mesh position={[0, ROOM.height / 2, -hd]} receiveShadow castShadow>
        <boxGeometry args={[ROOM.width, ROOM.height, 0.25]} />
        <meshStandardMaterial map={wallTexture} color={wallColor} roughness={0.75} metalness={0.02} />
      </mesh>
      {/* Mur Sud */}
      <mesh position={[0, ROOM.height / 2, hd]} receiveShadow castShadow>
        <boxGeometry args={[ROOM.width, ROOM.height, 0.25]} />
        <meshStandardMaterial map={wallTexture} color={wallColor} roughness={0.75} metalness={0.02} />
      </mesh>
      {/* Mur Ouest */}
      <mesh position={[-hw, ROOM.height / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.25, ROOM.height, ROOM.depth]} />
        <meshStandardMaterial map={wallTexture} color={wallColor} roughness={0.75} metalness={0.02} />
      </mesh>
      {/* Mur Est */}
      <mesh position={[hw, ROOM.height / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.25, ROOM.height, ROOM.depth]} />
        <meshStandardMaterial map={wallTexture} color={wallColor} roughness={0.75} metalness={0.02} />
      </mesh>

      {/* === CIMAISES (rails dorés) — signature visuelle === */}
      {/* Mur Nord */}
      <mesh position={[0, 2.85, -hd + 0.14]}>
        <boxGeometry args={[ROOM.width - 0.5, 0.06, 0.06]} />
        <meshStandardMaterial color="#C9A040" metalness={0.92} roughness={0.08} />
      </mesh>
      <mesh position={[0, 0.18, -hd + 0.14]}>
        <boxGeometry args={[ROOM.width - 0.5, 0.05, 0.04]} />
        <meshStandardMaterial color="#C9A040" metalness={0.88} roughness={0.12} />
      </mesh>
      {/* Mur Sud */}
      <mesh position={[0, 2.85, hd - 0.14]}>
        <boxGeometry args={[ROOM.width - 0.5, 0.06, 0.06]} />
        <meshStandardMaterial color="#C9A040" metalness={0.92} roughness={0.08} />
      </mesh>
      <mesh position={[0, 0.18, hd - 0.14]}>
        <boxGeometry args={[ROOM.width - 0.5, 0.05, 0.04]} />
        <meshStandardMaterial color="#C9A040" metalness={0.88} roughness={0.12} />
      </mesh>
      {/* Mur Ouest */}
      <mesh position={[-hw + 0.14, 2.85, 0]}>
        <boxGeometry args={[0.06, 0.06, ROOM.depth - 0.5]} />
        <meshStandardMaterial color="#C9A040" metalness={0.92} roughness={0.08} />
      </mesh>
      {/* Mur Est */}
      <mesh position={[hw - 0.14, 2.85, 0]}>
        <boxGeometry args={[0.06, 0.06, ROOM.depth - 0.5]} />
        <meshStandardMaterial color="#C9A040" metalness={0.92} roughness={0.08} />
      </mesh>

      {/* Plinthes */}
      <mesh position={[0, 0.1, -hd + 0.14]}>
        <boxGeometry args={[ROOM.width - 0.5, 0.18, 0.08]} />
        <meshStandardMaterial color="#1A0C10" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.1, hd - 0.14]}>
        <boxGeometry args={[ROOM.width - 0.5, 0.18, 0.08]} />
        <meshStandardMaterial color="#1A0C10" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[-hw + 0.14, 0.1, 0]}>
        <boxGeometry args={[0.08, 0.18, ROOM.depth - 0.5]} />
        <meshStandardMaterial color="#1A0C10" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[hw - 0.14, 0.1, 0]}>
        <boxGeometry args={[0.08, 0.18, ROOM.depth - 0.5]} />
        <meshStandardMaterial color="#1A0C10" roughness={0.5} metalness={0.1} />
      </mesh>
    </>
  );
}

// Colonnes d'angle élégantes
function Columns() {
  const hw = ROOM.width / 2 - 0.5;
  const hd = ROOM.depth / 2 - 0.5;
  const positions = [
    [-hw, 0, -hd], [hw, 0, -hd],
    [-hw, 0, hd], [hw, 0, hd],
  ];

  return (
    <>
      {positions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          {/* Fût */}
          <mesh castShadow position={[0, ROOM.height / 2 - 0.3, 0]}>
            <cylinderGeometry args={[0.18, 0.22, ROOM.height - 0.6, 16]} />
            <meshStandardMaterial color="#E8DFC8" roughness={0.5} metalness={0.06} />
          </mesh>
          {/* Chapiteau */}
          <mesh position={[0, ROOM.height - 0.22, 0]}>
            <boxGeometry args={[0.52, 0.22, 0.52]} />
            <meshStandardMaterial color="#D4C9A8" roughness={0.45} metalness={0.08} />
          </mesh>
          {/* Base */}
          <mesh position={[0, 0.1, 0]}>
            <boxGeometry args={[0.48, 0.18, 0.48]} />
            <meshStandardMaterial color="#C8BCA0" roughness={0.5} metalness={0.06} />
          </mesh>
          {/* Filet doré */}
          <mesh position={[0, ROOM.height - 0.12, 0]}>
            <cylinderGeometry args={[0.21, 0.21, 0.03, 16]} />
            <meshStandardMaterial color="#C9A040" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Mobilier muséal
function MuseumFurniture() {
  return (
    <>
      {/* Banc central de contemplation */}
      <group position={[0, 0, 0.8]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.08, 0.65]} />
          <meshStandardMaterial color="#4A2E1A" roughness={0.5} metalness={0.05} />
        </mesh>
        <mesh position={[0, -0.22, 0]} castShadow>
          <boxGeometry args={[2.2, 0.06, 0.08]} />
          <meshStandardMaterial color="#3A2010" roughness={0.55} />
        </mesh>
        {/* Pieds */}
        {[[-0.9, 0.25], [0.9, 0.25], [-0.9, -0.25], [0.9, -0.25]].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.2, z]} castShadow>
            <boxGeometry args={[0.06, 0.38, 0.06]} />
            <meshStandardMaterial color="#C9A040" metalness={0.85} roughness={0.15} />
          </mesh>
        ))}
        {/* Coussin */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[2.1, 0.06, 0.58]} />
          <meshStandardMaterial color="#3D0C1F" roughness={0.8} metalness={0.0} />
        </mesh>
      </group>

      {/* Banc symétrique côté opposé */}
      <group position={[0, 0, -1]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.08, 0.65]} />
          <meshStandardMaterial color="#4A2E1A" roughness={0.5} metalness={0.05} />
        </mesh>
        {[[-0.9, 0.25], [0.9, 0.25], [-0.9, -0.25], [0.9, -0.25]].map(([x, z], i) => (
          <mesh key={i} position={[x, -0.2, z]} castShadow>
            <boxGeometry args={[0.06, 0.38, 0.06]} />
            <meshStandardMaterial color="#C9A040" metalness={0.85} roughness={0.15} />
          </mesh>
        ))}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[2.1, 0.06, 0.58]} />
          <meshStandardMaterial color="#3D0C1F" roughness={0.8} metalness={0.0} />
        </mesh>
      </group>

      {/* Podiums pour sculptures / objets */}
      {[[-6, -3.5], [6, -3.5], [-6, 3.5], [6, 3.5]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[0.7, 0.9, 0.7]} />
            <meshStandardMaterial color="#2A1810" roughness={0.55} metalness={0.05} />
          </mesh>
          {/* Plateau doré */}
          <mesh position={[0, 0.46, 0]}>
            <boxGeometry args={[0.72, 0.04, 0.72]} />
            <meshStandardMaterial color="#C9A040" metalness={0.88} roughness={0.12} />
          </mesh>
          {/* Sphère décorative */}
          <mesh position={[0, 0.72, 0]} castShadow>
            <sphereGeometry args={[0.18, 24, 24]} />
            <meshStandardMaterial color="#D4B85A" metalness={0.75} roughness={0.2} emissive="#C9A040" emissiveIntensity={0.05} />
          </mesh>
        </group>
      ))}

      {/* Plantes en pots — coins */}
      {[[-7.5, -4.5], [7.5, -4.5]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          {/* Pot */}
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.18, 0.5, 12]} />
            <meshStandardMaterial color="#7A5C38" roughness={0.7} />
          </mesh>
          {/* Bande décorative */}
          <mesh position={[0, 0.18, 0]}>
            <cylinderGeometry args={[0.225, 0.225, 0.04, 12]} />
            <meshStandardMaterial color="#C9A040" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Feuillage stylisé */}
          {[0, 1, 2, 3, 4].map(j => {
            const a = (j / 5) * Math.PI * 2;
            const r = 0.18;
            return (
              <mesh key={j} position={[Math.cos(a) * r * 0.7, 0.75 + j * 0.1, Math.sin(a) * r * 0.7]} castShadow>
                <sphereGeometry args={[0.14 - j * 0.015, 8, 8]} />
                <meshStandardMaterial color={`hsl(${130 + j * 8}, 40%, ${25 + j * 3}%)`} roughness={0.9} />
              </mesh>
            );
          })}
        </group>
      ))}
    </>
  );
}

// Cartel (étiquette) de salle
function RoomLabel({ title = "Salle Principale" }) {
  return (
    <group position={[0, 0.65, 5.55]}>
      {/* Fond du cartel */}
      <mesh>
        <boxGeometry args={[1.8, 0.38, 0.03]} />
        <meshStandardMaterial color="#1A0C10" roughness={0.5} metalness={0.1} />
      </mesh>
      {/* Bordure dorée */}
      <mesh position={[0, 0, 0.015]}>
        <boxGeometry args={[1.82, 0.40, 0.01]} />
        <meshStandardMaterial color="#C9A040" metalness={0.88} roughness={0.12} />
      </mesh>
      <Text
        position={[0, 0, 0.025]}
        fontSize={0.1}
        color="#F5ECD7"
        anchorX="center"
        anchorY="middle"
        font={undefined}
        letterSpacing={0.08}
      >
        {title.toUpperCase()}
      </Text>
    </group>
  );
}

export default function Salle3D({ chambre, oeuvres = [], onArtworkClick, selectedArtworkId }) {
  const artworkItems = useMemo(() => {
    const maxItems = Math.min(oeuvres.length, WALL_POSITIONS.length);
    return Array.from({ length: maxItems }, (_, i) => ({
      ...WALL_POSITIONS[i],
      oeuvre: oeuvres[i],
      index: i,
    }));
  }, [oeuvres]);

  return (
    <group>
      <Lighting />
      <Floor />
      <Ceiling />
      <Walls />
      <Columns />
      <MuseumFurniture />
      <RoomLabel title={chambre?.nom || "Galerie ArtVision"} />

      {artworkItems.map((item) => (
        <ArtworkFrame
          key={`artwork-${item.oeuvre.id ?? item.index}`}
          artwork={item.oeuvre}
          position={item.position}
          rotation={item.rotation}
          onClick={() => onArtworkClick?.(item.oeuvre)}
          index={item.index}
          isSelected={selectedArtworkId === item.oeuvre.id}
        />
      ))}
    </group>
  );
}

export { ROOM };