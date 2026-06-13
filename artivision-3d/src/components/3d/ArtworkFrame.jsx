// src/components/3d/ArtworkFrame.jsx - Version avec animations avancées
import { useRef, useState, useEffect } from "react";
import { Text, Html } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

export default function ArtworkFrame({ artwork, position, rotation, onClick, index, isSelected }) {
  const groupRef = useRef();
  const meshRef = useRef();
  const frameRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [textureApplied, setTextureApplied] = useState(false);
  const [pulseScale, setPulseScale] = useState(1);
  const [floatOffset, setFloatOffset] = useState(0);
  
  // Animation d'entrée
  const [animProgress, setAnimProgress] = useState(0);
  
  useEffect(() => {
    // Animation d'apparition séquentielle
    const timer = setTimeout(() => {
      setAnimProgress(1);
    }, index * 100);
    return () => clearTimeout(timer);
  }, [index]);

  // Animation de flottement et pulsation
  useFrame(({ clock }) => {
    if (hovered) {
      const t = clock.getElapsedTime();
      setFloatOffset(Math.sin(t * 3) * 0.005);
      setPulseScale(1 + Math.sin(t * 8) * 0.02);
    }
  });

  useEffect(() => {
    if (!artwork?.img) return;

    let imageUrl = artwork.img;
    if (imageUrl && !imageUrl.startsWith('http')) {
      if (imageUrl.startsWith('/media/')) {
        imageUrl = `http://localhost:8000${imageUrl}`;
      } else if (imageUrl.startsWith('/')) {
        imageUrl = `http://localhost:8000${imageUrl}`;
      } else {
        imageUrl = `http://localhost:8000/media/${imageUrl}`;
      }
    }

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;
    
    img.onload = () => {
      const texture = new THREE.CanvasTexture(img);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      
      if (meshRef.current) {
        meshRef.current.material.map = texture;
        meshRef.current.material.needsUpdate = true;
        setTextureApplied(true);
      }
    };
    
    img.onerror = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#2a1a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#C9A040';
      ctx.font = 'bold 24px Arial';
      ctx.fillText('🎨', canvas.width/2 - 15, canvas.height/2 - 20);
      ctx.font = '16px Arial';
      ctx.fillText(artwork.titre || 'Sans titre', canvas.width/2 - 60, canvas.height/2 + 20);
      const fallbackTexture = new THREE.CanvasTexture(canvas);
      if (meshRef.current) {
        meshRef.current.material.map = fallbackTexture;
        meshRef.current.material.needsUpdate = true;
        setTextureApplied(true);
      }
    };
  }, [artwork?.img, artwork?.titre]);

  if (!artwork) return null;

  const w = artwork.display_width || 1.2;
  const h = artwork.display_height || 0.9;
  
  // Animations
  const floatZ = floatOffset;
  const imageZ = hovered ? 0.05 : 0.02 + floatZ;
  const frameZ = -0.03;
  const scale = pulseScale;
  const appearScale = animProgress;
  const appearY = (1 - animProgress) * -0.5;

  // Couleurs du cadre selon le thème
  const frameColor = hovered ? "#E8C06A" : (isSelected ? "#C9A040" : "#B8922A");
  const glowColor = hovered ? "rgba(201,160,64,0.3)" : "rgba(201,160,64,0)";

  return (
    <group 
      ref={groupRef} 
      position={[position[0], position[1] + appearY, position[2]]}
      scale={[appearScale, appearScale, appearScale]}
    >
      {/* Lueur du cadre */}
      <mesh position={[0, 0, frameZ - 0.01]}>
        <planeGeometry args={[w + 0.2, h + 0.2]} />
        <meshBasicMaterial color={glowColor} transparent opacity={hovered ? 0.3 : 0} />
      </mesh>

      {/* Cadre avec animation au hover */}
      <mesh 
        ref={frameRef}
        position={[0, 0, frameZ]}
        scale={[scale, scale, scale]}
      >
        <boxGeometry args={[w + 0.12, h + 0.12, 0.08]} />
        <meshStandardMaterial 
          color={frameColor} 
          metalness={hovered ? 0.9 : 0.7} 
          roughness={hovered ? 0.1 : 0.3}
          emissive={hovered ? "#C9A040" : "#000000"}
          emissiveIntensity={hovered ? 0.2 : 0}
        />
      </mesh>

      {/* Moulure intérieure */}
      <mesh position={[0, 0, frameZ + 0.02]}>
        <boxGeometry args={[w + 0.08, h + 0.08, 0.02]} />
        <meshStandardMaterial color="#D4B85A" metalness={0.6} roughness={0.2} />
      </mesh>

      {/* Image */}
      <mesh 
        ref={meshRef}
        position={[0, 0, imageZ]}
        onClick={onClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        scale={[scale, scale, scale]}
      >
        <planeGeometry args={[w, h]} />
        <meshStandardMaterial 
          color={textureApplied ? undefined : "#8B7355"}
          side={THREE.DoubleSide}
          transparent
          emissive={hovered ? "#C9A040" : "#000000"}
          emissiveIntensity={hovered ? 0.1 : 0}
        />
      </mesh>

      {/* Verre de protection (reflet) */}
      {hovered && (
        <mesh position={[0, 0, imageZ + 0.001]}>
          <planeGeometry args={[w - 0.02, h - 0.02]} />
          <meshStandardMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.1}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>
      )}

      {/* Titre avec animation */}
      <Text
        position={[0, -(h / 2) - 0.12, 0.03]}
        fontSize={0.08}
        color={hovered ? "#C9A040" : "#FFFFFF"}
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
        fillOpacity={appearScale}
      >
        {artwork.titre || "Sans titre"}
      </Text>

      {/* Prix */}
      {artwork.prix && (
        <Text
          position={[0, -(h / 2) - 0.22, 0.03]}
          fontSize={0.07}
          color="#C9A040"
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.01}
          outlineColor="#000000"
          fillOpacity={appearScale}
        >
          {`${artwork.prix} DT`}
        </Text>
      )}

      {/* Badge "Nouveau" ou "En vedette" */}
      {artwork.isNew && (
        <Html position={[w/2 + 0.1, h/2 + 0.1, 0.05]}>
          <div style={{
            background: "#E24B4A",
            color: "white",
            padding: "2px 8px",
            borderRadius: "12px",
            fontSize: "10px",
            fontWeight: "bold",
            fontFamily: "sans-serif"
          }}>
            NOUVEAU
          </div>
        </Html>
      )}
    </group>
  );
}