import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useTexture, Text } from "@react-three/drei";
import * as THREE from "three";

// Fallback texture (couleur unie si image non chargée)
function FallbackFrame({ width = 1.2, height = 0.9, color = "#8B6030" }) {
  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

function ArtworkMesh({ artwork, onClick, width = 1.2, height = 0.9 }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Charge la texture depuis l'URL de l'API
  let texture = null;
  try {
    texture = useTexture(artwork.image_url || "/images/galerie/g1.jpg");
  } catch {
    // texture reste null
  }

  // Légère animation au hover
  useFrame(() => {
    if (!meshRef.current) return;
    const target = hovered ? 0.03 : 0;
    meshRef.current.position.z = THREE.MathUtils.lerp(
      meshRef.current.position.z,
      target,
      0.1
    );
  });

  return (
    <group
      ref={meshRef}
      onClick={(e) => { e.stopPropagation(); onClick(artwork); }}
      onPointerEnter={() => { setHovered(true); document.body.style.cursor = "pointer"; }}
      onPointerLeave={() => { setHovered(false); document.body.style.cursor = "default"; }}
    >
      {/* Cadre doré */}
      <mesh position={[0, 0, -0.005]}>
        <boxGeometry args={[width + 0.12, height + 0.12, 0.04]} />
        <meshStandardMaterial color={hovered ? "#D4A853" : "#B8922A"} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Toile */}
      <mesh>
        <planeGeometry args={[width, height]} />
        {texture ? (
          <meshStandardMaterial map={texture} />
        ) : (
          <meshStandardMaterial color="#C4A882" />
        )}
      </mesh>

      {/* Petit spot de lumière simulé */}
      {hovered && (
        <pointLight position={[0, 0.5, 0.3]} intensity={0.8} color="#fff8e7" distance={2} />
      )}
    </group>
  );
}

// Composant principal exporté
export default function ArtworkFrame({ artwork, position, rotation, onClick }) {
  if (!artwork) return null;

  // Dimensions selon les métadonnées ou défaut
  const w = artwork.display_width || 1.2;
  const h = artwork.display_height || 0.9;

  return (
    <group position={position} rotation={rotation}>
      <ArtworkMesh artwork={artwork} onClick={onClick} width={w} height={h} />

      {/* Étiquette sous le tableau */}
      <Text
        position={[0, -(h / 2) - 0.18, 0.01]}
        fontSize={0.07}
        color="#2C0A0A"
        anchorX="center"
        anchorY="middle"
        maxWidth={w}
      >
        {artwork.title || "Sans titre"}
      </Text>
      <Text
        position={[0, -(h / 2) - 0.30, 0.01]}
        fontSize={0.055}
        color="#8B6030"
        anchorX="center"
        anchorY="middle"
      >
        {artwork.price ? `${artwork.price} DT` : ""}
      </Text>
    </group>
  );
}