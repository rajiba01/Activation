import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import ArtworkFrame from "./ArtworkFrame";

// Dimensions de la salle 1
const ROOM = {
  width: 16,    // X
  height: 4,    // Y (hauteur plafond)
  depth: 10,    // Z
};

// Positions prédéfinies sur les murs pour les œuvres
// L'API retourne position_x/y/z, rotation_y, wall
// Si pas de données API → on utilise ces défauts
const DEFAULT_POSITIONS = [
  // Mur Nord (z = -depth/2), face au visiteur
  { position: [-5,  1.7, -4.95], rotation: [0, 0,    0], wall: "north" },
  { position: [-2,  1.7, -4.95], rotation: [0, 0,    0], wall: "north" },
  { position: [ 1,  1.7, -4.95], rotation: [0, 0,    0], wall: "north" },
  { position: [ 4,  1.7, -4.95], rotation: [0, 0,    0], wall: "north" },

  // Mur Sud (z = +depth/2)
  { position: [-5,  1.7,  4.95], rotation: [0, Math.PI, 0], wall: "south" },
  { position: [-2,  1.7,  4.95], rotation: [0, Math.PI, 0], wall: "south" },
  { position: [ 1,  1.7,  4.95], rotation: [0, Math.PI, 0], wall: "south" },
  { position: [ 4,  1.7,  4.95], rotation: [0, Math.PI, 0], wall: "south" },

  // Mur Ouest (x = -width/2)
  { position: [-7.95, 1.7, -2], rotation: [0,  Math.PI / 2, 0], wall: "west" },
  { position: [-7.95, 1.7,  2], rotation: [0,  Math.PI / 2, 0], wall: "west" },

  // Mur Est (x = +width/2)
  { position: [ 7.95, 1.7, -2], rotation: [0, -Math.PI / 2, 0], wall: "east" },
  { position: [ 7.95, 1.7,  2], rotation: [0, -Math.PI / 2, 0], wall: "east" },

  // Cloisons centrales — face avant
  { position: [-1.5, 1.7, -1.0], rotation: [0, 0, 0], wall: "island" },
  { position: [ 1.5, 1.7, -1.0], rotation: [0, 0, 0], wall: "island" },

  // Cloisons centrales — face arrière
  { position: [-1.5, 1.7,  1.0], rotation: [0, Math.PI, 0], wall: "island" },
  { position: [ 1.5, 1.7,  1.0], rotation: [0, Math.PI, 0], wall: "island" },
];

function Wall({ position, rotation, args, color = "#F5F0E8" }) {
  return (
    <mesh position={position} rotation={rotation} receiveShadow>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.9} metalness={0} />
    </mesh>
  );
}

function Partition({ position }) {
  // Cloison centrale (îlot)
  return (
    <group position={position}>
      {/* Corps de la cloison */}
      <mesh receiveShadow castShadow>
        <boxGeometry args={[0.15, ROOM.height - 0.5, 2.2]} />
        <meshStandardMaterial color="#EDE8DE" roughness={0.9} />
      </mesh>
      {/* Socle */}
      <mesh position={[0, -(ROOM.height / 2 - 0.3), 0]}>
        <boxGeometry args={[0.2, 0.2, 2.4]} />
        <meshStandardMaterial color="#D4C9B0" roughness={0.8} />
      </mesh>
    </group>
  );
}

function Floor() {
  // On essaye de charger une texture parquet
  let floorTexture = null;
  try {
    floorTexture = useTexture("/images/textures/parquet.jpg");
    if (floorTexture) {
      floorTexture.wrapS = floorTexture.wrapT = 1000; // RepeatWrapping
      floorTexture.repeat.set(4, 4);
    }
  } catch {
    // pas de texture → couleur unie
  }

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
      <planeGeometry args={[ROOM.width, ROOM.depth]} />
      {floorTexture ? (
        <meshStandardMaterial map={floorTexture} roughness={0.8} />
      ) : (
        <meshStandardMaterial color="#C8A882" roughness={0.8} />
      )}
    </mesh>
  );
}

function Ceiling() {
  return (
    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, ROOM.height, 0]}>
      <planeGeometry args={[ROOM.width, ROOM.depth]} />
      <meshStandardMaterial color="#FDFAF5" roughness={1} />
    </mesh>
  );
}

function Lighting() {
  return (
    <>
      {/* Lumière ambiante douce */}
      <ambientLight intensity={0.4} color="#fff8f0" />

      {/* Spots de plafond — rangée centrale */}
      {[-4, -1, 2, 5].map((x, i) => (
        <spotLight
          key={i}
          position={[x, ROOM.height - 0.2, 0]}
          target-position={[x, 0, 0]}
          intensity={1.2}
          angle={0.45}
          penumbra={0.5}
          color="#fff5e0"
          castShadow
          shadow-mapSize={[512, 512]}
        />
      ))}

      {/* Spots sur les murs Nord/Sud */}
      {[-5, -2, 1, 4].map((x, i) => (
        <spotLight
          key={`ns-${i}`}
          position={[x, ROOM.height - 0.3, -3]}
          intensity={0.8}
          angle={0.4}
          penumbra={0.6}
          color="#ffe8c0"
        />
      ))}
    </>
  );
}

export default function Salle1({ artworks = [], onArtworkClick }) {
  // Merge artworks API avec les positions prédéfinies
  const artworkSlots = DEFAULT_POSITIONS.map((slot, i) => ({
    ...slot,
    artwork: artworks[i] || null,
  }));

  const hw = ROOM.width / 2;
  const hd = ROOM.depth / 2;
  const wallT = 0.2; // épaisseur mur

  return (
    <group>
      <Lighting />
      <Floor />
      <Ceiling />

      {/* Mur Nord */}
      <Wall
        position={[0, ROOM.height / 2, -hd]}
        args={[ROOM.width, ROOM.height, wallT]}
      />
      {/* Mur Sud */}
      <Wall
        position={[0, ROOM.height / 2, hd]}
        args={[ROOM.width, ROOM.height, wallT]}
      />
      {/* Mur Ouest */}
      <Wall
        position={[-hw, ROOM.height / 2, 0]}
        args={[wallT, ROOM.height, ROOM.depth]}
      />
      {/* Mur Est */}
      <Wall
        position={[hw, ROOM.height / 2, 0]}
        args={[wallT, ROOM.height, ROOM.depth]}
      />

      {/* Cloisons centrales (îlots comme dans ton design Unity) */}
      <Partition position={[-2, ROOM.height / 2, 0]} />
      <Partition position={[ 2, ROOM.height / 2, 0]} />

      {/* Plinthe bas de mur */}
      {[
        { pos: [0, 0.1, -hd + 0.11],      args: [ROOM.width, 0.2, 0.1] },
        { pos: [0, 0.1,  hd - 0.11],      args: [ROOM.width, 0.2, 0.1] },
        { pos: [-hw + 0.11, 0.1, 0],      args: [0.1, 0.2, ROOM.depth] },
        { pos: [ hw - 0.11, 0.1, 0],      args: [0.1, 0.2, ROOM.depth] },
      ].map((p, i) => (
        <Wall key={`plinth-${i}`} position={p.pos} args={p.args} color="#D4C9B0" />
      ))}

      {/* Œuvres sur les murs */}
      {artworkSlots.map((slot, i) =>
        slot.artwork ? (
          <ArtworkFrame
            key={slot.artwork.id || i}
            artwork={slot.artwork}
            position={slot.position}
            rotation={slot.rotation}
            onClick={onArtworkClick}
          />
        ) : null
      )}
    </group>
  );
}

export { ROOM, DEFAULT_POSITIONS };