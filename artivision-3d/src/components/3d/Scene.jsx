import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Sky, Environment } from "@react-three/drei";
import Salle1 from "./Salle1";
import Navigation from "./Navigation";
import { MiniMapRenderer } from "./MiniMap";
import { useGalleryStore } from "../../store/useGalleryStore";

function SceneFallback() {
  return (
    <mesh position={[0, 1, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#C9A040" />
    </mesh>
  );
}

export default function Scene({ galleryType = 1, artworks = [], onArtworkClick }) {
  const { navMode } = useGalleryStore();

  return (
    <Canvas
      shadows
      camera={{ fov: 75, near: 0.1, far: 100, position: [0, 1.7, 8] }}
      style={{ width: "100%", height: "100%" }}
      gl={{ antialias: true }}
    >
      {/* Ciel / ambiance extérieure */}
      <Sky sunPosition={[100, 20, 100]} />

      {/* Brume légère */}
      <fogExp2 args={["#f5f0e8", 0.04]} />

      {/* Contenu de la salle selon le type */}
      <Suspense fallback={<SceneFallback />}>
        {galleryType === 1 && (
          <Salle1 artworks={artworks} onArtworkClick={onArtworkClick} />
        )}
        {/* Salle2 et Salle3 seront ajoutées ici */}
      </Suspense>

      {/* Navigation (auto + manuel) */}
      <Navigation />

      {/* Mini-map : lit la caméra et dessine sur le canvas HTML */}
      <MiniMapRenderer />
    </Canvas>
  );
}