// src/components/3d/AvatarWithPhysics.jsx - Version avec physique (optionnelle)
import { useRef, useEffect, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

export function AvatarWithPhysics({ startPosition, walls = [] }) {
  const avatarRef = useRef();
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const [isGrounded, setIsGrounded] = useState(true);
  
  const speed = 3;
  const jumpForce = 5;
  const gravity = 15;
  
  // Claviers
  const keys = useRef({});
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      keys.current[e.code] = true;
    };
    const handleKeyUp = (e) => {
      keys.current[e.code] = false;
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);
  
  useFrame((_, delta) => {
    if (!avatarRef.current) return;
    
    // Mouvement
    const moveDir = new THREE.Vector3();
    
    if (keys.current["KeyW"]) moveDir.z -= 1;
    if (keys.current["KeyS"]) moveDir.z += 1;
    if (keys.current["KeyA"]) moveDir.x -= 1;
    if (keys.current["KeyD"]) moveDir.x += 1;
    
    moveDir.normalize();
    
    // Appliquer le mouvement
    velocity.current.x = moveDir.x * speed;
    velocity.current.z = moveDir.z * speed;
    
    // Gravité
    if (!isGrounded) {
      velocity.current.y -= gravity * delta;
    }
    
    // Nouvelle position
    const newPos = avatarRef.current.position.clone();
    newPos.x += velocity.current.x * delta;
    newPos.z += velocity.current.z * delta;
    newPos.y += velocity.current.y * delta;
    
    // Collision avec le sol
    if (newPos.y <= 0) {
      newPos.y = 0;
      velocity.current.y = 0;
      setIsGrounded(true);
      
      // Saut
      if (keys.current["Space"]) {
        velocity.current.y = jumpForce;
        setIsGrounded(false);
      }
    } else {
      setIsGrounded(false);
    }
    
    // Collision avec les murs
    for (const wall of walls) {
      if (newPos.x + 0.4 > wall.minX && newPos.x - 0.4 < wall.maxX &&
          newPos.z + 0.4 > wall.minZ && newPos.z - 0.4 < wall.maxZ) {
        // Revenir à l'ancienne position
        newPos.x = avatarRef.current.position.x;
        newPos.z = avatarRef.current.position.z;
      }
    }
    
    avatarRef.current.position.copy(newPos);
    
    // Rotation basée sur la direction
    if (moveDir.x !== 0 || moveDir.z !== 0) {
      const angle = Math.atan2(moveDir.x, moveDir.z);
      avatarRef.current.rotation.y = angle;
    }
  });
  
  return (
    <group ref={avatarRef} position={startPosition}>
      {/* Corps */}
      <mesh castShadow receiveShadow>
        <capsuleGeometry args={[0.3, 0.5, 8, 16]} />
        <meshStandardMaterial color="#ff6b6b" />
      </mesh>
      {/* Yeux */}
      <mesh position={[0.15, 0.5, 0.35]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[-0.15, 0.5, 0.35]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="white" />
      </mesh>
      <mesh position={[0.15, 0.48, 0.42]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh position={[-0.15, 0.48, 0.42]}>
        <sphereGeometry args={[0.04, 16, 16]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}