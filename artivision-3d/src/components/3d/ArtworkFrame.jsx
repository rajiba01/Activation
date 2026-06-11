// src/components/3d/ArtworkFrame.jsx
import { useRef, useState, Suspense } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, useTexture } from "@react-three/drei";
import * as THREE from "three";

// ✅ Composant image avec useTexture (Suspense-based)
function ArtworkImage({ url, width, height }) {
  const texture = useTexture(url);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;

  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial map={texture} toneMapped={false} />
    </mesh>
  );
}

// ✅ Fallback coloré pendant le chargement
function ArtworkPlaceholder({ width, height, color = "#8B7355" }) {
  return (
    <mesh>
      <planeGeometry args={[width, height]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// ✅ Wrapper avec gestion d'erreur
function ArtworkImageSafe({ url, width, height }) {
  if (!url || url.trim() === "") {
    return <ArtworkPlaceholder width={width} height={height} color="#A0522D" />;
  }

  return (
    <Suspense fallback={<ArtworkPlaceholder width={width} height={height} color="#C4A882" />}>
      <ArtworkImage url={url} width={width} height={height} />
    </Suspense>
  );
}

// ✅ Mesh principal avec hover
function ArtworkMesh({ artwork, onClick, width = 1.2, height = 0.9 }) {
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);

  useFrame(() => {
    if (!groupRef.current) return;
    const targetZ = hovered ? 0.04 : 0;
    groupRef.current.position.z = THREE.MathUtils.lerp(
      groupRef.current.position.z,
      targetZ,
      0.1
    );
  });

  const handleClick = (e) => {
    e.stopPropagation();
    if (onClick && artwork) onClick(artwork);
  };

  const handlePointerEnter = (e) => {
    e.stopPropagation();
    setHovered(true);
    document.body.style.cursor = "pointer";
  };

  const handlePointerLeave = (e) => {
    e.stopPropagation();
    setHovered(false);
    document.body.style.cursor = "default";
  };

  return (
    <group
      ref={groupRef}
      onClick={handleClick}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {/* Cadre doré derrière */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[width + 0.14, height + 0.14, 0.05]} />
        <meshStandardMaterial
          color={hovered ? "#D4A853" : "#B8922A"}
          metalness={0.85}
          roughness={0.15}
        />
      </mesh>

      {/* Image de l'œuvre */}
      <ArtworkImageSafe url={artwork?.img} width={width} height={height} />

      {/* Lumière de spot au hover */}
      {hovered && (
        <pointLight
          position={[0, 0.6, 0.4]}
          intensity={1.2}
          color="#fff8e7"
          distance={2.5}
        />
      )}
    </group>
  );
}

// ✅ Composant principal exporté
export default function ArtworkFrame({ artwork, position, rotation, onClick }) {
  if (!artwork) {
    console.warn("⚠️ ArtworkFrame: artwork est null/undefined");
    return null;
  }

  const w = artwork.display_width || 1.2;
  const h = artwork.display_height || 0.9;

  console.log("🖼️ ArtworkFrame:", artwork.titre, "| img:", artwork.img, "| pos:", position);

  return (
    <group position={position} rotation={rotation}>
      <ArtworkMesh
        artwork={artwork}
        onClick={onClick}
        width={w}
        height={h}
      />

      {/* Titre */}
      <Text
        position={[0, -(h / 2) - 0.18, 0.02]}
        fontSize={0.075}
        color="#1a0a0a"
        anchorX="center"
        anchorY="middle"
        maxWidth={w + 0.2}
        font={undefined}
      >
        {artwork.titre || "Sans titre"}
      </Text>

      {/* Prix */}
      {artwork.prix && (
        <Text
          position={[0, -(h / 2) - 0.32, 0.02]}
          fontSize={0.06}
          color="#8B6030"
          anchorX="center"
          anchorY="middle"
        >
          {`${artwork.prix} DT`}
        </Text>
      )}
    </group>
  );
}