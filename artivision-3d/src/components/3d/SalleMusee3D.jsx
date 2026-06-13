// src/components/3d/SalleMusee3D.jsx - Style Musée Ultra Premium (Abonnement Musée)
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import ArtworkFrame from "./ArtworkFrame";
import * as THREE from "three";

const ROOM = {
  width: 22,
  height: 6,
  depth: 16,
};

// Positions premium pour plus d'œuvres
const WALL_POSITIONS = [
  // Mur Nord - 7 œuvres
  { position: [-7.2, 2.4, -7.5], rotation: [0, 0, 0], zone: "north" },
  { position: [-4.5, 2.4, -7.5], rotation: [0, 0, 0], zone: "north" },
  { position: [-1.8, 2.4, -7.5], rotation: [0, 0, 0], zone: "north" },
  { position: [1.8, 2.4, -7.5], rotation: [0, 0, 0], zone: "north" },
  { position: [4.5, 2.4, -7.5], rotation: [0, 0, 0], zone: "north" },
  { position: [7.2, 2.4, -7.5], rotation: [0, 0, 0], zone: "north" },
  // Mur Sud - 7 œuvres
  { position: [-7.2, 2.4, 7.5], rotation: [0, Math.PI, 0], zone: "south" },
  { position: [-4.5, 2.4, 7.5], rotation: [0, Math.PI, 0], zone: "south" },
  { position: [-1.8, 2.4, 7.5], rotation: [0, Math.PI, 0], zone: "south" },
  { position: [1.8, 2.4, 7.5], rotation: [0, Math.PI, 0], zone: "south" },
  { position: [4.5, 2.4, 7.5], rotation: [0, Math.PI, 0], zone: "south" },
  { position: [7.2, 2.4, 7.5], rotation: [0, Math.PI, 0], zone: "south" },
  // Mur Ouest - 4 œuvres
  { position: [-10.2, 2.4, -5], rotation: [0, Math.PI / 2, 0], zone: "west" },
  { position: [-10.2, 2.4, -1], rotation: [0, Math.PI / 2, 0], zone: "west" },
  { position: [-10.2, 2.4, 3], rotation: [0, Math.PI / 2, 0], zone: "west" },
  { position: [-10.2, 2.4, 6], rotation: [0, Math.PI / 2, 0], zone: "west" },
  // Mur Est - 4 œuvres
  { position: [10.2, 2.4, -5], rotation: [0, -Math.PI / 2, 0], zone: "east" },
  { position: [10.2, 2.4, -1], rotation: [0, -Math.PI / 2, 0], zone: "east" },
  { position: [10.2, 2.4, 3], rotation: [0, -Math.PI / 2, 0], zone: "east" },
  { position: [10.2, 2.4, 6], rotation: [0, -Math.PI / 2, 0], zone: "east" },
];

// Éclairage royal ultra premium
function RoyalLighting() {
  const chandelier1Ref = useRef();
  const chandelier2Ref = useRef();
  const chandelier3Ref = useRef();
  
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime() * 0.3;
    if (chandelier1Ref.current) {
      chandelier1Ref.current.intensity = 0.8 + Math.sin(t) * 0.12;
    }
    if (chandelier2Ref.current) {
      chandelier2Ref.current.intensity = 0.7 + Math.cos(t * 0.8) * 0.1;
    }
    if (chandelier3Ref.current) {
      chandelier3Ref.current.intensity = 0.75 + Math.sin(t * 1.2) * 0.1;
    }
  });
  
  return (
    <>
      {/* Ambiance générale chaleureuse */}
      <ambientLight intensity={0.55} color="#F0DCC0" />
      
      {/* Lumière directionnelle principale */}
      <directionalLight
        position={[2, 10, 3]}
        intensity={0.85}
        color="#FFF8E8"
        castShadow
        shadow-mapSize-width={4096}
        shadow-mapSize-height={4096}
        shadow-camera-near={0.1}
        shadow-camera-far={40}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      
      {/* Lumière de remplissage dorée */}
      <pointLight
        position={[-3, 5, -2]}
        intensity={0.5}
        color="#FFD070"
        distance={20}
        decay={1.5}
      />
      <pointLight
        position={[3, 5, 2]}
        intensity={0.5}
        color="#FFD070"
        distance={20}
        decay={1.5}
      />
      
      {/* Trois lustres majestueux */}
      <pointLight
        ref={chandelier1Ref}
        position={[-5, 5.2, -3]}
        intensity={0.8}
        color="#FFE0A0"
        distance={22}
        decay={1.8}
      />
      <pointLight
        ref={chandelier2Ref}
        position={[0, 5.5, 0]}
        intensity={0.85}
        color="#FFE0A0"
        distance={25}
        decay={1.6}
      />
      <pointLight
        ref={chandelier3Ref}
        position={[5, 5.2, 3]}
        intensity={0.8}
        color="#FFE0A0"
        distance={22}
        decay={1.8}
      />
      
      {/* Spots renforcés pour chaque œuvre */}
      {[-7.2, -4.5, -1.8, 1.8, 4.5, 7.2].map(x => (
        <spotLight key={x} position={[x, 5.5, -5]} angle={0.25} penumbra={0.6} intensity={2.0} color="#FFF8E8" target-position={[x, 2.4, -7.5]} />
      ))}
      {[-7.2, -4.5, -1.8, 1.8, 4.5, 7.2].map(x => (
        <spotLight key={x} position={[x, 5.5, 5]} angle={0.25} penumbra={0.6} intensity={2.0} color="#FFF8E8" target-position={[x, 2.4, 7.5]} />
      ))}
      
      {/* Spots murs latéraux */}
      {[-5, -1, 3, 6].map(z => (
        <spotLight key={z} position={[-8, 5.5, z]} angle={0.28} penumbra={0.6} intensity={1.8} color="#FFF8E8" target-position={[-10.2, 2.4, z]} />
      ))}
      {[-5, -1, 3, 6].map(z => (
        <spotLight key={z} position={[8, 5.5, z]} angle={0.28} penumbra={0.6} intensity={1.8} color="#FFF8E8" target-position={[10.2, 2.4, z]} />
      ))}
    </>
  );
}

// Sol en marbre noir et or
function MarbleFloor() {
  const marbleTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext("2d");
    
    // Fond noir profond
    ctx.fillStyle = "#1A1512";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Veines d'or majestueuses
    for (let i = 0; i < 120; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const angle = Math.random() * Math.PI * 2;
      const len = 100 + Math.random() * 300;
      
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(-len / 2, 0);
      for (let j = 0; j < 15; j++) {
        const px = -len / 2 + (len / 15) * j;
        const py = Math.sin(j * 0.6) * 12 + (Math.random() - 0.5) * 8;
        ctx.lineTo(px, py);
      }
      
      // Dégradé d'or
      const goldIntensity = 0.4 + Math.random() * 0.4;
      ctx.strokeStyle = `rgba(212, 175, 55, ${goldIntensity})`;
      ctx.lineWidth = 1.5 + Math.random() * 3;
      ctx.stroke();
      
      // Petites pépites d'or
      for (let k = 0; k < 5; k++) {
        const px = -len / 2 + Math.random() * len;
        const py = (Math.random() - 0.5) * 20;
        ctx.fillStyle = `rgba(212, 175, 55, ${0.3 + Math.random() * 0.3})`;
        ctx.beginPath();
        ctx.arc(px, py, 1 + Math.random() * 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    
    // Dalles en losange avec filets dorés
    ctx.strokeStyle = "rgba(212, 175, 55, 0.35)";
    ctx.lineWidth = 2;
    const step = 180;
    for (let i = 0; i <= canvas.width; i += step) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }
    
    // Dégradé de reflet central
    const grad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width/2);
    grad.addColorStop(0, "rgba(212, 175, 55, 0.15)");
    grad.addColorStop(0.5, "rgba(212, 175, 55, 0.05)");
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(3, 2);
    return texture;
  }, []);
  
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial map={marbleTexture} roughness={0.18} metalness={0.45} color="#1A1512" />
      </mesh>
      {/* Plinthe dorée */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.12} />
      </mesh>
    </>
  );
}

// Plafond cathédrale avec fresque et lustres
function RoyalCeiling() {
  return (
    <>
      {/* Plafond principal avec effet voûté */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.height, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color="#F5ECD7" roughness={0.65} metalness={0.03} />
      </mesh>
      
      {/* Rosace centrale majestueuse */}
      <group position={[0, ROOM.height - 0.02, 0]}>
        <mesh>
          <ringGeometry args={[1.5, 2.2, 64]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.06} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <ringGeometry args={[0.8, 1.3, 64]} />
          <meshStandardMaterial color="#C9A040" metalness={0.92} roughness={0.08} side={THREE.DoubleSide} />
        </mesh>
        <mesh>
          <circleGeometry args={[0.5, 32]} />
          <meshStandardMaterial color="#E8C06A" metalness={0.88} roughness={0.1} />
        </mesh>
        {/* Fleur de lys centrale */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => {
          const rad = deg * Math.PI / 180;
          return (
            <mesh key={deg} position={[Math.cos(rad) * 0.9, 0, Math.sin(rad) * 0.9]}>
              <sphereGeometry args={[0.08, 16, 16]} />
              <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.08} />
            </mesh>
          );
        })}
      </group>
      
      {/* Corniches sculptées massives */}
      <mesh position={[0, ROOM.height - 0.18, 0]}>
        <boxGeometry args={[ROOM.width - 0.1, 0.22, ROOM.depth - 0.1]} />
        <meshStandardMaterial color="#E8DCC8" roughness={0.55} metalness={0.08} />
      </mesh>
      
      {/* Moulures dorées au plafond */}
      {[-7, -4, -1, 2, 5, 8].map(x => (
        <mesh key={x} position={[x, ROOM.height - 0.06, -6]}>
          <boxGeometry args={[1.5, 0.05, 0.15]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.06} />
        </mesh>
      ))}
      {[-7, -4, -1, 2, 5, 8].map(x => (
        <mesh key={x} position={[x, ROOM.height - 0.06, 6]}>
          <boxGeometry args={[1.5, 0.05, 0.15]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.06} />
        </mesh>
      ))}
      
      {/* Lustres suspendus */}
      {[[-5, -3], [0, 0], [5, 3]].map(([x, z], idx) => (
        <group key={idx} position={[x, ROOM.height - 0.5, z]}>
          {/* Chaîne */}
          <mesh position={[0, -0.3, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.6, 6]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.08} />
          </mesh>
          {/* Anneau principal */}
          <mesh position={[0, -0.65, 0]}>
            <torusGeometry args={[0.55, 0.06, 16, 48]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.05} />
          </mesh>
          {/* Pendentifs en cristal */}
          {Array.from({ length: 12 }).map((_, i) => {
            const a = (i / 12) * Math.PI * 2;
            return (
              <group key={i}>
                <mesh position={[Math.cos(a) * 0.55, -0.7, Math.sin(a) * 0.55]}>
                  <cylinderGeometry args={[0.02, 0.02, 0.15, 6]} />
                  <meshStandardMaterial color="#D4AF37" metalness={0.9} roughness={0.1} />
                </mesh>
                <mesh position={[Math.cos(a) * 0.55, -0.78, Math.sin(a) * 0.55]}>
                  <sphereGeometry args={[0.045, 12, 12]} />
                  <meshStandardMaterial color="#FFF8E8" metalness={0.7} roughness={0.15} emissive="#FFF0D0" emissiveIntensity={0.15} />
                </mesh>
              </group>
            );
          })}
          {/* Boule centrale */}
          <mesh position={[0, -0.65, 0]}>
            <sphereGeometry args={[0.2, 24, 24]} />
            <meshStandardMaterial color="#E8C06A" metalness={0.88} roughness={0.08} emissive="#D4AF37" emissiveIntensity={0.1} />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Murs en velours pourpre avec panneaux dorés
function RoyalWalls() {
  const velvetTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    
    // Fond pourpre profond
    ctx.fillStyle = "#2D0A1A";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Texture velours riche
    for (let i = 0; i < 15000; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = Math.random() * 2.5;
      const op = Math.random() * 0.08;
      ctx.fillStyle = `rgba(180, 50, 100, ${op})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Motifs de fleurs de lys
    for (let i = 0; i < 60; i++) {
      const x = (i % 8) * 128 + 64;
      const y = Math.floor(i / 8) * 128 + 64;
      ctx.save();
      ctx.translate(x, y);
      ctx.fillStyle = `rgba(212, 175, 55, ${0.08 + Math.random() * 0.08})`;
      // Simple fleur de lys stylisée
      ctx.beginPath();
      ctx.arc(0, -8, 4, 0, Math.PI * 2);
      ctx.arc(-6, 4, 4, 0, Math.PI * 2);
      ctx.arc(6, 4, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.5, 1.2);
    return texture;
  }, []);
  
  const hw = ROOM.width / 2;
  const hd = ROOM.depth / 2;
  
  return (
    <>
      <mesh position={[0, ROOM.height / 2, -hd]} receiveShadow castShadow>
        <boxGeometry args={[ROOM.width, ROOM.height, 0.3]} />
        <meshStandardMaterial map={velvetTexture} color="#2D0A1A" roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[0, ROOM.height / 2, hd]} receiveShadow castShadow>
        <boxGeometry args={[ROOM.width, ROOM.height, 0.3]} />
        <meshStandardMaterial map={velvetTexture} color="#2D0A1A" roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[-hw, ROOM.height / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.3, ROOM.height, ROOM.depth]} />
        <meshStandardMaterial map={velvetTexture} color="#2D0A1A" roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[hw, ROOM.height / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.3, ROOM.height, ROOM.depth]} />
        <meshStandardMaterial map={velvetTexture} color="#2D0A1A" roughness={0.55} metalness={0.05} />
      </mesh>
      
      {/* Grandes cimaises dorées massives */}
      <mesh position={[0, 3.5, -hd + 0.16]}>
        <boxGeometry args={[ROOM.width - 0.5, 0.12, 0.1]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.06} />
      </mesh>
      <mesh position={[0, 3.5, hd - 0.16]}>
        <boxGeometry args={[ROOM.width - 0.5, 0.12, 0.1]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.95} roughness={0.06} />
      </mesh>
      
      {/* Cadres dorés décoratifs sur les murs */}
      {[-8, -4, 0, 4, 8].map(x => (
        <mesh key={x} position={[x, 1.2, -hd + 0.16]}>
          <boxGeometry args={[0.08, 1.2, 0.05]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.08} />
        </mesh>
      ))}
    </>
  );
}

// Colonnes corinthiennes majestueuses
function CorinthianColumns() {
  const hw = ROOM.width / 2 - 1;
  const hd = ROOM.depth / 2 - 1;
  const positions = [
    [-hw, 0, -hd], [hw, 0, -hd],
    [-hw, 0, hd], [hw, 0, hd],
    [-hw + 4, 0, -hd], [hw - 4, 0, -hd],
    [-hw + 4, 0, hd], [hw - 4, 0, hd],
  ];
  
  return (
    <>
      {positions.map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          {/* Fût cannelé avec effet marbre */}
          <mesh castShadow position={[0, ROOM.height / 2 - 0.4, 0]}>
            <cylinderGeometry args={[0.28, 0.32, ROOM.height - 0.8, 32]} />
            <meshStandardMaterial color="#E8DCC8" roughness={0.35} metalness={0.12} />
          </mesh>
          {/* Cannelures profondes */}
          {[-0.1, -0.05, 0, 0.05, 0.1].map(rot => (
            <mesh key={rot} position={[rot, 0, 0]} castShadow>
              <cylinderGeometry args={[0.03, 0.03, ROOM.height - 0.8, 8]} />
              <meshStandardMaterial color="#D4C9A8" roughness={0.45} metalness={0.1} />
            </mesh>
          ))}
          {/* Chapiteau corinthien doré */}
          <mesh position={[0, ROOM.height - 0.28, 0]}>
            <boxGeometry args={[0.85, 0.28, 0.85]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.08} />
          </mesh>
          <mesh position={[0, ROOM.height - 0.2, 0]}>
            <boxGeometry args={[0.92, 0.1, 0.92]} />
            <meshStandardMaterial color="#E8C06A" metalness={0.88} roughness={0.1} />
          </mesh>
          {/* Volutes */}
          {[[-0.25, 0.15], [0.25, 0.15]].map(([ox, oz]) => (
            <mesh key={ox} position={[ox, ROOM.height - 0.22, oz]}>
              <sphereGeometry args={[0.1, 12, 12]} />
              <meshStandardMaterial color="#C9A040" metalness={0.88} roughness={0.1} />
            </mesh>
          ))}
          {/* Base dorée */}
          <mesh position={[0, 0.15, 0]}>
            <boxGeometry args={[0.72, 0.22, 0.72]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.1} />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Mobilier royal ultra premium
function RoyalFurniture() {
  return (
    <>
      {/* Canapés royaux en velours pourpre */}
      <group position={[-4, 0, 1.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.55, 0.75]} />
          <meshStandardMaterial color="#3D0C1F" roughness={0.65} metalness={0.02} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[2.2, 0.08, 0.72]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.85} metalness={0.05} />
        </mesh>
        <mesh position={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[2.3, 0.08, 0.8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.12} />
        </mesh>
        {/* Accoudoirs dorés */}
        <mesh position={[-1.1, 0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.35, 0.75]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.1} />
        </mesh>
        <mesh position={[1.1, 0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.35, 0.75]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.1} />
        </mesh>
      </group>
      
      <group position={[4, 0, 1.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 0.55, 0.75]} />
          <meshStandardMaterial color="#3D0C1F" roughness={0.65} metalness={0.02} />
        </mesh>
        <mesh position={[0, 0.3, 0]} castShadow>
          <boxGeometry args={[2.2, 0.08, 0.72]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.85} metalness={0.05} />
        </mesh>
        <mesh position={[0, -0.15, 0]} castShadow>
          <boxGeometry args={[2.3, 0.08, 0.8]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.8} roughness={0.12} />
        </mesh>
        <mesh position={[-1.1, 0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.35, 0.75]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.1} />
        </mesh>
        <mesh position={[1.1, 0.2, 0]} castShadow>
          <boxGeometry args={[0.15, 0.35, 0.75]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.1} />
        </mesh>
      </group>
      
      {/* Table basse centrale en marbre */}
      <group position={[0, 0, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.08, 32]} />
          <meshStandardMaterial color="#2A1A0A" roughness={0.25} metalness={0.15} />
        </mesh>
        <mesh position={[0, 0.05, 0]} castShadow>
          <cylinderGeometry args={[1.15, 1.15, 0.04, 32]} />
          <meshStandardMaterial color="#D4AF37" metalness={0.88} roughness={0.1} />
        </mesh>
      </group>
      
      {/* Podiums premium pour sculptures */}
      {[[-8.5, -5.5], [8.5, -5.5], [-8.5, 5.5], [8.5, 5.5]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[1.1, 1.2, 1.1]} />
            <meshStandardMaterial color="#2A1810" roughness={0.45} metalness={0.08} />
          </mesh>
          <mesh position={[0, 0.62, 0]}>
            <boxGeometry args={[1.15, 0.08, 1.15]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.08} />
          </mesh>
          {/* Sculpture en bronze doré */}
          <mesh position={[0, 0.98, 0]} castShadow>
            <sphereGeometry args={[0.28, 32, 32]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.15} />
          </mesh>
          <mesh position={[0, 1.15, 0]} castShadow>
            <coneGeometry args={[0.15, 0.25, 8]} />
            <meshStandardMaterial color="#E8C06A" metalness={0.88} roughness={0.12} />
          </mesh>
        </group>
      ))}
      
      {/* Grandes plantes luxuriantes en pots dorés */}
      {[[-6, -6], [6, -6], [-6, 6], [6, 6]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.35, 0.28, 0.65, 16]} />
            <meshStandardMaterial color="#D4AF37" metalness={0.85} roughness={0.12} />
          </mesh>
          <mesh position={[0, 0.28, 0]}>
            <cylinderGeometry args={[0.38, 0.38, 0.08, 16]} />
            <meshStandardMaterial color="#E8C06A" metalness={0.88} roughness={0.1} />
          </mesh>
          {[0, 1, 2, 3, 4, 5, 6].map(j => {
            const a = (j / 7) * Math.PI * 2;
            return (
              <mesh key={j} position={[Math.cos(a) * 0.35, 0.75 + j * 0.12, Math.sin(a) * 0.35]} castShadow>
                <sphereGeometry args={[0.18 - j * 0.015, 12, 12]} />
                <meshStandardMaterial color={`hsl(${115 + j * 5}, 45%, ${32 + j * 3}%)`} roughness={0.82} />
              </mesh>
            );
          })}
          <mesh position={[0, 0.85, 0]} castShadow>
            <coneGeometry args={[0.28, 0.45, 8]} />
            <meshStandardMaterial color="hsl(120, 42%, 28%)" roughness={0.85} />
          </mesh>
        </group>
      ))}
    </>
  );
}

// Cartel doré majestueux
function RoyalLabel({ title = "Grande Galerie Royale" }) {
  return (
    <group position={[0, 0.7, 7.2]}>
      <mesh>
        <boxGeometry args={[2.8, 0.55, 0.05]} />
        <meshStandardMaterial color="#2A1A0A" roughness={0.45} metalness={0.15} />
      </mesh>
      <mesh position={[0, 0, 0.022]}>
        <boxGeometry args={[2.82, 0.57, 0.015]} />
        <meshStandardMaterial color="#D4AF37" metalness={0.92} roughness={0.08} />
      </mesh>
      <Text
        position={[0, 0, 0.035]}
        fontSize={0.14}
        color="#F5ECD7"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.12}
        font={undefined}
      >
        {title.toUpperCase()}
      </Text>
      <Text
        position={[0, -0.18, 0.035]}
        fontSize={0.07}
        color="#D4AF37"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.08}
        font={undefined}
      >
        COLLECTION PERMANENTE
      </Text>
    </group>
  );
}

export default function SalleMusee3D({ chambre, oeuvres = [], onArtworkClick, selectedArtworkId }) {
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
      <RoyalLighting />
      <MarbleFloor />
      <RoyalCeiling />
      <RoyalWalls />
      <CorinthianColumns />
      <RoyalFurniture />
      <RoyalLabel title={chambre?.nom || "Galerie Impériale"} />

      {artworkItems.map((item) => (
        <ArtworkFrame
          key={`artwork-${item.oeuvre?.id ?? item.index}`}
          artwork={item.oeuvre}
          position={item.position}
          rotation={item.rotation}
          onClick={() => onArtworkClick?.(item.oeuvre)}
          index={item.index}
          isSelected={selectedArtworkId === item.oeuvre?.id}
        />
      ))}
    </group>
  );
}

export { ROOM as MUSEE_ROOM };