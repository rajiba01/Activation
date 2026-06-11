// src/components/3d/Salle3D.jsx
import { useMemo } from "react";
import ArtworkFrame from "./ArtworkFrame";

// Dimensions de la salle
const ROOM = {
  width: 16,
  height: 4,
  depth: 10,
};

// Positions des œuvres sur les murs (12 emplacements)
const WALL_POSITIONS = [
  // Mur Nord (Z négatif) - 4 œuvres
  { position: [-5, 2.2, -4.8], rotation: [0, 0, 0] },
  { position: [-1.5, 2.2, -4.8], rotation: [0, 0, 0] },
  { position: [2, 2.2, -4.8], rotation: [0, 0, 0] },
  { position: [5.5, 2.2, -4.8], rotation: [0, 0, 0] },
  
  // Mur Sud (Z positif) - 4 œuvres
  { position: [-5, 2.2, 4.8], rotation: [0, Math.PI, 0] },
  { position: [-1.5, 2.2, 4.8], rotation: [0, Math.PI, 0] },
  { position: [2, 2.2, 4.8], rotation: [0, Math.PI, 0] },
  { position: [5.5, 2.2, 4.8], rotation: [0, Math.PI, 0] },
  
  // Mur Ouest (X négatif) - 2 œuvres
  { position: [-7.8, 2.2, -2.5], rotation: [0, Math.PI / 2, 0] },
  { position: [-7.8, 2.2, 2], rotation: [0, Math.PI / 2, 0] },
  
  // Mur Est (X positif) - 2 œuvres
  { position: [7.8, 2.2, -2.5], rotation: [0, -Math.PI / 2, 0] },
  { position: [7.8, 2.2, 2], rotation: [0, -Math.PI / 2, 0] },
];

// Composant Mur
function Wall({ position, size, color = "#F5ECD7" }) {
  return (
    <mesh position={position} receiveShadow castShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
    </mesh>
  );
}

// Composant Sol
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
      <planeGeometry args={[ROOM.width, ROOM.depth]} />
      <meshStandardMaterial color="#C8A882" roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

// Composant Plafond
function Ceiling() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.height, 0]}>
      <planeGeometry args={[ROOM.width, ROOM.depth]} />
      <meshStandardMaterial color="#FDFAF5" roughness={0.9} />
    </mesh>
  );
}

// Composant Éclairage
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.6} color="#fff8f0" />
      <directionalLight position={[5, 8, 5]} intensity={1.2} castShadow shadow-mapSize={1024} />
      <pointLight position={[0, 3, 0]} intensity={0.5} color="#fff5e0" />
      {/* Spots supplémentaires */}
      <pointLight position={[-3, 3.5, -3]} intensity={0.4} color="#ffd700" />
      <pointLight position={[3, 3.5, 3]} intensity={0.4} color="#ffd700" />
    </>
  );
}

export default function Salle3D({ chambre, oeuvres = [], onArtworkClick, onArtworkHover }) {
  // Log pour déboguer
  console.log("🎨 Salle3D - Œuvres reçues:", oeuvres.length);
  console.log("🎨 Salle3D - Première œuvre:", oeuvres[0]);

  // Associer les œuvres aux positions des murs
  const artworkItems = useMemo(() => {
    const items = [];
    const maxItems = Math.min(oeuvres.length, WALL_POSITIONS.length);
    
    for (let i = 0; i < maxItems; i++) {
      items.push({
        ...WALL_POSITIONS[i],
        oeuvre: oeuvres[i],
      });
    }
    
    return items;
  }, [oeuvres]);

  const hw = ROOM.width / 2;
  const hd = ROOM.depth / 2;

  return (
    <group>
      <Lighting />
      <Floor />
      <Ceiling />

      {/* Mur Nord */}
      <Wall position={[0, ROOM.height / 2, -hd]} size={[ROOM.width, ROOM.height, 0.2]} />
      
      {/* Mur Sud */}
      <Wall position={[0, ROOM.height / 2, hd]} size={[ROOM.width, ROOM.height, 0.2]} />
      
      {/* Mur Ouest */}
      <Wall position={[-hw, ROOM.height / 2, 0]} size={[0.2, ROOM.height, ROOM.depth]} />
      
      {/* Mur Est */}
      <Wall position={[hw, ROOM.height / 2, 0]} size={[0.2, ROOM.height, ROOM.depth]} />

      {/* Plinthe bas de mur */}
      <mesh position={[0, 0.1, -hd + 0.11]} receiveShadow>
        <boxGeometry args={[ROOM.width, 0.15, 0.1]} />
        <meshStandardMaterial color="#D4C9B0" />
      </mesh>
      <mesh position={[0, 0.1, hd - 0.11]} receiveShadow>
        <boxGeometry args={[ROOM.width, 0.15, 0.1]} />
        <meshStandardMaterial color="#D4C9B0" />
      </mesh>

      {/* Œuvres sur les murs */}
{artworkItems.map((item, idx) => (
  <ArtworkFrame
    key={`artwork-pos-${idx}`}
    artwork={item.oeuvre}
    position={item.position}
    rotation={item.rotation}
    onClick={onArtworkClick}
  />
))}
  
    </group>
  );
}

export { ROOM };