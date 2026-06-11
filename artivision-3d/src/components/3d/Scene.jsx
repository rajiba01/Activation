import { Canvas } from "@react-three/fiber";
import { OrbitControls, Box, Environment, Text } from "@react-three/drei";

function SimpleRoom() {
  return (
    <>
      {/* Sol */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#C8A882" roughness={0.8} />
      </mesh>

      {/* Grille au sol */}
      <gridHelper args={[10, 20, "#C9A040", "#8B6030"]} position={[0, -0.4, 0]} />

      {/* Mur du fond */}
      <mesh position={[0, 2, -5]} receiveShadow>
        <boxGeometry args={[10, 4, 0.2]} />
        <meshStandardMaterial color="#F5ECD7" />
      </mesh>

      {/* Mur gauche */}
      <mesh position={[-5, 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4, 10]} />
        <meshStandardMaterial color="#F5ECD7" />
      </mesh>

      {/* Mur droit */}
      <mesh position={[5, 2, 0]} receiveShadow>
        <boxGeometry args={[0.2, 4, 10]} />
        <meshStandardMaterial color="#F5ECD7" />
      </mesh>

      {/* Plafond */}
      <mesh position={[0, 3.8, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#FFFDF8" />
      </mesh>

      {/* Œuvre centrale avec cadre */}
      <group position={[0, 2, -4.8]}>
        {/* Cadre doré */}
        <mesh position={[0, 0, -0.05]}>
          <boxGeometry args={[2.2, 1.8, 0.1]} />
          <meshStandardMaterial color="#C9A040" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Toile */}
        <mesh>
          <planeGeometry args={[2, 1.6]} />
          <meshStandardMaterial color="#8B2020" />
        </mesh>
        <Text position={[0, -1.1, 0.01]} fontSize={0.15} color="#2C0A0A" anchorX="center">
          Œuvre d'art
        </Text>
      </group>

      {/* Lumière ambiante */}
      <ambientLight intensity={0.5} />
      
      {/* Lumière directionnelle */}
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow shadow-mapSize={1024} />
      
      {/* Lumière de remplissage */}
      <pointLight position={[0, 3, 0]} intensity={0.3} color="#fff5e0" />
      
      {/* Spot sur l'œuvre */}
      <spotLight position={[0, 4, -3]} intensity={1.5} angle={0.3} penumbra={0.5} castShadow />
    </>
  );
}

export default function Scene() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "#1a1a1a" }}>
      <Canvas
        shadows
        camera={{ position: [0, 2, 5], fov: 60 }}
        style={{ background: "#111" }}
      >
        <OrbitControls 
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          zoomSpeed={1.2}
          rotateSpeed={1}
          panSpeed={0.8}
        />
        <SimpleRoom />
        <Environment preset="city" />
      </Canvas>
      
      {/* Instructions UI */}
      <div style={{
        position: "absolute",
        bottom: 20,
        left: 20,
        background: "rgba(0,0,0,0.7)",
        color: "#C9A040",
        padding: "10px 15px",
        borderRadius: 8,
        fontFamily: "monospace",
        fontSize: 12,
        zIndex: 100
      }}>
        🖱️ Souris = tourner | 🖱️² = zoomer | 🖱️ droit + drag = se déplacer
      </div>
      
      <div style={{
        position: "absolute",
        top: 20,
        left: 20,
        background: "rgba(0,0,0,0.7)",
        color: "white",
        padding: "8px 15px",
        borderRadius: 8,
        fontFamily: "monospace",
        fontSize: 12,
        zIndex: 100
      }}>
        🏛️ TEST 3D - Galerie Virtuelle
      </div>
    </div>
  );
}