// src/components/3d/SalleAtelier3D.jsx - Style Studio Contemporain
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import ArtworkFrame from "./ArtworkFrame";
import * as THREE from "three";

const ROOM = {
  width: 14,
  height: 4.5,
  depth: 10,
};

// Positions adaptées pour style atelier - 12 positions
const WALL_POSITIONS = [
  // Mur Nord (face avant) - 4 œuvres
  { position: [-4.5, 1.6, -4.8], rotation: [0, 0, 0], zone: "north" },
  { position: [-1.5, 1.6, -4.8], rotation: [0, 0, 0], zone: "north" },
  { position: [1.5, 1.6, -4.8], rotation: [0, 0, 0], zone: "north" },
  { position: [4.5, 1.6, -4.8], rotation: [0, 0, 0], zone: "north" },
  
  // Mur Sud (face arrière) - 4 œuvres
  { position: [-4.5, 1.6, 4.8], rotation: [0, Math.PI, 0], zone: "south" },
  { position: [-1.5, 1.6, 4.8], rotation: [0, Math.PI, 0], zone: "south" },
  { position: [1.5, 1.6, 4.8], rotation: [0, Math.PI, 0], zone: "south" },
  { position: [4.5, 1.6, 4.8], rotation: [0, Math.PI, 0], zone: "south" },
  
  // Mur Ouest (gauche) - 2 œuvres
  { position: [-6.5, 1.6, -2.5], rotation: [0, Math.PI / 2, 0], zone: "west" },
  { position: [-6.5, 1.6, 2.5], rotation: [0, Math.PI / 2, 0], zone: "west" },
  
  // Mur Est (droite) - 2 œuvres
  { position: [6.5, 1.6, -2.5], rotation: [0, -Math.PI / 2, 0], zone: "east" },
  { position: [6.5, 1.6, 2.5], rotation: [0, -Math.PI / 2, 0], zone: "east" },
];

// Éclairage studio contemporain
function AtelierLighting() {
  const neonRef = useRef();
  
  useFrame(({ clock }) => {
    if (neonRef.current) {
      const t = clock.getElapsedTime() * 1.5;
      neonRef.current.intensity = 0.6 + Math.sin(t) * 0.1;
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} color="#E8E4DC" />
      
      {/* Plafonnier LED principal */}
      <pointLight
        ref={neonRef}
        position={[0, 3.8, 0]}
        intensity={0.8}
        color="#FFFFFF"
        distance={12}
        decay={1.5}
      />
      
      {/* Rampes LED sur les murs */}
      <rectAreaLight position={[-6.5, 2.5, 0]} width={0.5} height={3} intensity={1.2} color="#FFF0E0" />
      <rectAreaLight position={[6.5, 2.5, 0]} width={0.5} height={3} intensity={1.2} color="#FFF0E0" />
      <rectAreaLight position={[0, 2.5, -4.5]} width={5} height={0.5} intensity={1.0} color="#FFF0E0" />
      <rectAreaLight position={[0, 2.5, 4.5]} width={5} height={0.5} intensity={1.0} color="#FFF0E0" />
      
      {/* Spots orientables sur rails */}
      <spotLight position={[-4, 4.2, -3]} angle={0.35} penumbra={0.6} intensity={1.5} color="#FFF5E8" target-position={[-4.5, 1.6, -4.8]} />
      <spotLight position={[4, 4.2, -3]} angle={0.35} penumbra={0.6} intensity={1.5} color="#FFF5E8" target-position={[4.5, 1.6, -4.8]} />
      <spotLight position={[-4, 4.2, 3]} angle={0.35} penumbra={0.6} intensity={1.5} color="#FFF5E8" target-position={[-4.5, 1.6, 4.8]} />
      <spotLight position={[4, 4.2, 3]} angle={0.35} penumbra={0.6} intensity={1.5} color="#FFF5E8" target-position={[4.5, 1.6, 4.8]} />
      
      {/* Spots murs latéraux */}
      <spotLight position={[-5, 4.2, -2]} angle={0.35} penumbra={0.6} intensity={1.2} color="#FFF5E8" target-position={[-6.5, 1.6, -2.5]} />
      <spotLight position={[-5, 4.2, 2]} angle={0.35} penumbra={0.6} intensity={1.2} color="#FFF5E8" target-position={[-6.5, 1.6, 2.5]} />
      <spotLight position={[5, 4.2, -2]} angle={0.35} penumbra={0.6} intensity={1.2} color="#FFF5E8" target-position={[6.5, 1.6, -2.5]} />
      <spotLight position={[5, 4.2, 2]} angle={0.35} penumbra={0.6} intensity={1.2} color="#FFF5E8" target-position={[6.5, 1.6, 2.5]} />
    </>
  );
}

// Sol béton ciré
function ConcreteFloor() {
  const floorTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "#C8C4BC";
    ctx.fillRect(0, 0, 1024, 1024);
    
    // Texture béton
    for (let i = 0; i < 8000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const r = Math.random() * 1.5;
      const op = Math.random() * 0.08;
      ctx.fillStyle = `rgba(80,70,60,${op})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // Joints de dilatation
    ctx.strokeStyle = "rgba(100,90,80,0.25)";
    ctx.lineWidth = 1.5;
    for (let i = 0; i <= 1024; i += 256) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 1024); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(1024, i); ctx.stroke();
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2.5, 2);
    return texture;
  }, []);
  
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial map={floorTexture} roughness={0.45} metalness={0.12} color="#C0BCB4" />
      </mesh>
      {/* Plinthe industrielle */}
      <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color="#8A8278" roughness={0.5} />
      </mesh>
    </>
  );
}

// Plafond industriel avec rails et néons
function IndustrialCeiling() {
  return (
    <>
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.height, 0]} receiveShadow>
        <planeGeometry args={[ROOM.width, ROOM.depth]} />
        <meshStandardMaterial color="#E8E4DC" roughness={0.85} metalness={0.02} />
      </mesh>
      
      {/* Poutres métalliques apparentes */}
      {[-4.5, 0, 4.5].map((x, i) => (
        <mesh key={i} position={[x, ROOM.height - 0.12, 0]}>
          <boxGeometry args={[0.25, 0.18, ROOM.depth - 1]} />
          <meshStandardMaterial color="#6B6360" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}
      
      {/* Rails LED */}
      {[-6, -2, 2, 6].map((z, i) => (
        <mesh key={i} position={[0, ROOM.height - 0.08, z]}>
          <boxGeometry args={[ROOM.width - 1, 0.04, 0.12]} />
          <meshStandardMaterial color="#F5F0EA" metalness={0.9} roughness={0.1} emissive="#FFF8F0" emissiveIntensity={0.15} />
        </mesh>
      ))}
      
      {/* Néons décoratifs */}
      {[-5.5, 0, 5.5].map((z, i) => (
        <mesh key={i} position={[-6.2, ROOM.height - 0.18, z]}>
          <cylinderGeometry args={[0.03, 0.03, 1.8, 8]} />
          <meshStandardMaterial color="#FFF0D0" metalness={0.95} emissive="#FFE8B0" emissiveIntensity={0.25} />
        </mesh>
      ))}
      {[-5.5, 0, 5.5].map((z, i) => (
        <mesh key={i} position={[6.2, ROOM.height - 0.18, z]}>
          <cylinderGeometry args={[0.03, 0.03, 1.8, 8]} />
          <meshStandardMaterial color="#FFF0D0" metalness={0.95} emissive="#FFE8B0" emissiveIntensity={0.25} />
        </mesh>
      ))}
    </>
  );
}

// Murs style loft — briques apparentes
function LoftWalls() {
  const brickTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d");
    
    ctx.fillStyle = "#A89888";
    ctx.fillRect(0, 0, 512, 512);
    
    const brickW = 42;
    const brickH = 22;
    for (let row = 0; row < 24; row++) {
      const offset = (row % 2) * (brickW / 2);
      for (let col = 0; col < 14; col++) {
        const x = offset + col * brickW;
        const y = row * brickH;
        ctx.fillStyle = "#B8A898";
        ctx.fillRect(x, y, brickW - 2, brickH - 2);
        ctx.fillStyle = "#9A8878";
        ctx.fillRect(x + 3, y + 3, brickW - 8, brickH - 8);
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.5, 1.2);
    return texture;
  }, []);
  
  const hw = ROOM.width / 2;
  const hd = ROOM.depth / 2;
  const wallColor = "#A89080";
  
  return (
    <>
      <mesh position={[0, ROOM.height / 2, -hd]} receiveShadow castShadow>
        <boxGeometry args={[ROOM.width, ROOM.height, 0.25]} />
        <meshStandardMaterial map={brickTexture} color={wallColor} roughness={0.65} metalness={0.02} />
      </mesh>
      <mesh position={[0, ROOM.height / 2, hd]} receiveShadow castShadow>
        <boxGeometry args={[ROOM.width, ROOM.height, 0.25]} />
        <meshStandardMaterial map={brickTexture} color={wallColor} roughness={0.65} metalness={0.02} />
      </mesh>
      <mesh position={[-hw, ROOM.height / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.25, ROOM.height, ROOM.depth]} />
        <meshStandardMaterial map={brickTexture} color={wallColor} roughness={0.65} metalness={0.02} />
      </mesh>
      <mesh position={[hw, ROOM.height / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[0.25, ROOM.height, ROOM.depth]} />
        <meshStandardMaterial map={brickTexture} color={wallColor} roughness={0.65} metalness={0.02} />
      </mesh>
      
      {/* Cimaises industrielles (métal noir) */}
      <mesh position={[0, 2.4, -hd + 0.14]}>
        <boxGeometry args={[ROOM.width - 0.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#3A3530" metalness={0.85} roughness={0.25} />
      </mesh>
      <mesh position={[0, 2.4, hd - 0.14]}>
        <boxGeometry args={[ROOM.width - 0.5, 0.08, 0.08]} />
        <meshStandardMaterial color="#3A3530" metalness={0.85} roughness={0.25} />
      </mesh>
    </>
  );
}

// Mobilier studio moderne
function StudioFurniture() {
  return (
    <>
      {/* Canapé design */}
      <group position={[0, 0, 2.5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.0, 0.4, 0.7]} />
          <meshStandardMaterial color="#2A2520" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.22, -0.15]} castShadow>
          <boxGeometry args={[2.0, 0.08, 0.55]} />
          <meshStandardMaterial color="#C9A040" roughness={0.8} />
        </mesh>
      </group>
      
      {/* Table basse minimaliste */}
      <group position={[0, 0, 1.2]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.5, 0.5, 0.06, 24]} />
          <meshStandardMaterial color="#E8DFC8" metalness={0.3} roughness={0.4} />
        </mesh>
      </group>
      
      {/* Tabourets de bar */}
      {[[-2.5, -2], [2.5, -2]].map(([x, z], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.22, 0.24, 0.55, 8]} />
            <meshStandardMaterial color="#4A4538" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.3, 0]} castShadow>
            <cylinderGeometry args={[0.28, 0.28, 0.06, 8]} />
            <meshStandardMaterial color="#8A7A60" roughness={0.5} />
          </mesh>
        </group>
      ))}
      
      {/* Plante d'intérieur */}
      <group position={[-5.5, 0, -3.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.18, 0.14, 0.45, 8]} />
          <meshStandardMaterial color="#6A5A48" roughness={0.7} />
        </mesh>
        {[0, 1, 2, 3, 4].map(j => {
          const a = (j / 5) * Math.PI * 2;
          return (
            <mesh key={j} position={[Math.cos(a) * 0.2, 0.5 + j * 0.12, Math.sin(a) * 0.2]} castShadow>
              <sphereGeometry args={[0.12 - j * 0.015, 6, 6]} />
              <meshStandardMaterial color={`hsl(${100 + j * 5}, 45%, ${30 + j * 5}%)`} roughness={0.85} />
            </mesh>
          );
        })}
      </group>
    </>
  );
}

// Cartel style studio
function StudioLabel({ title = "Atelier ArtVision" }) {
  return (
    <group position={[0, 0.55, 4.8]}>
      <mesh>
        <boxGeometry args={[1.5, 0.32, 0.03]} />
        <meshStandardMaterial color="#2A2520" roughness={0.5} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0, 0.015]}>
        <boxGeometry args={[1.52, 0.34, 0.01]} />
        <meshStandardMaterial color="#C9A040" metalness={0.75} roughness={0.2} />
      </mesh>
      <Text
        position={[0, 0, 0.025]}
        fontSize={0.09}
        color="#F5ECD7"
        anchorX="center"
        anchorY="middle"
        letterSpacing={0.06}
      >
        {title.toUpperCase()}
      </Text>
    </group>
  );
}

export default function SalleAtelier3D({ chambre, oeuvres = [], onArtworkClick, selectedArtworkId }) {
  // Ajout d'un log pour debug
  console.log("SalleAtelier3D - Œuvres reçues:", oeuvres.length, oeuvres);
  
  const artworkItems = useMemo(() => {
    // On prend autant d'œuvres qu'il y a de positions, ou moins
    const maxItems = Math.min(oeuvres.length, WALL_POSITIONS.length);
    console.log("Nombre d'items à afficher:", maxItems);
    
    return Array.from({ length: maxItems }, (_, i) => ({
      ...WALL_POSITIONS[i],
      oeuvre: oeuvres[i],
      index: i,
    }));
  }, [oeuvres]);

  // Vérifier que artworkItems contient des données
  if (artworkItems.length === 0 && oeuvres.length > 0) {
    console.warn("Aucune position disponible pour les œuvres !");
  }

  return (
    <group>
      <AtelierLighting />
      <ConcreteFloor />
      <IndustrialCeiling />
      <LoftWalls />
      <StudioFurniture />
      <StudioLabel title={chambre?.nom || "Atelier d'Artiste"} />

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

export { ROOM as ATELIER_ROOM };