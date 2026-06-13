// src/components/3d/AvatarController.jsx
import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useGalleryStore } from "../../store/useGalleryStore";
import Avatar from "./Avatar";

// Points de patrouille par défaut (utilisés si aucun n'est passé en prop)
const DEFAULT_PATROL_POINTS = [
  new THREE.Vector3(-5, 0, 3),
  new THREE.Vector3(-5, 0, 0),
  new THREE.Vector3(-5, 0, -3),
  new THREE.Vector3(0, 0, -3),
  new THREE.Vector3(5, 0, -3),
  new THREE.Vector3(5, 0, 0),
  new THREE.Vector3(5, 0, 3),
  new THREE.Vector3(0, 0, 3),
];

export default function AvatarController({ patrolPoints, onArtworkGuide, artworks, onOpenChat }) {
  const points = patrolPoints || DEFAULT_PATROL_POINTS;

  const avatarRef  = useRef();
  const posRef     = useRef(points[0].clone());
  const [targetIndex, setTargetIndex] = useState(0);
  const { navMode } = useGalleryStore();
  const speed = 2.2;

  useFrame((_, delta) => {
    if (!avatarRef.current || navMode !== "auto") return;

    const target = points[targetIndex];
    const dir = new THREE.Vector3().subVectors(target, posRef.current);
    const dist = dir.length();

    if (dist < 0.18) {
      setTargetIndex(p => (p + 1) % points.length);
    } else {
      dir.normalize();
      posRef.current.addScaledVector(dir, speed * delta);
      avatarRef.current.position.copy(posRef.current);
      avatarRef.current.rotation.y = Math.atan2(dir.x, dir.z);
    }
  });

  return (
    <Avatar
      ref={avatarRef}
      position={[points[0].x, 0, points[0].z]}
      onInteract={() => onOpenChat?.()}
    />
  );
}