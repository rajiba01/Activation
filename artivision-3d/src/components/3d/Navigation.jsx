// src/components/3d/Navigation.jsx - Version Musée Pro
import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { useGalleryStore } from "../../store/useGalleryStore";

// Parcours cinématique fluide — circuit complet de la galerie
const CINEMATIC_PATH_S1 = [
  new THREE.Vector3(0,    1.7,  7.5),   // Entrée
  new THREE.Vector3(-5,   1.7,  5),     // Angle SO
  new THREE.Vector3(-7.5, 1.7,  2),     // Mur Ouest haut
  new THREE.Vector3(-7.5, 1.7, -2),     // Mur Ouest bas
  new THREE.Vector3(-5,   1.7, -5),     // Angle NO
  new THREE.Vector3(-1.5, 1.7, -5.5),   // Mur Nord gauche — face œuvres
  new THREE.Vector3(1.5,  1.7, -5.5),   // Mur Nord centre
  new THREE.Vector3(5,    1.7, -5),     // Angle NE
  new THREE.Vector3(7.5,  1.7, -2),     // Mur Est bas
  new THREE.Vector3(7.5,  1.7,  2),     // Mur Est haut
  new THREE.Vector3(5,    1.7,  5),     // Angle SE
  new THREE.Vector3(1.5,  1.7,  5.5),   // Mur Sud droite
  new THREE.Vector3(-1.5, 1.7,  5.5),   // Mur Sud gauche
  new THREE.Vector3(0,    1.7,  3.5),   // Centre — contemplation
  new THREE.Vector3(0,    1.7,  7.5),   // Retour entrée
];

const WALLS_S1 = { minX: -8.75, maxX: 8.75, minZ: -5.75, maxZ: 5.75 };
const PARTITIONS_S1 = [
  { minX: -2.4, maxX: -1.8, minZ: -1.4, maxZ: 1.4 },
  { minX:  1.8, maxX:  2.4, minZ: -1.4, maxZ: 1.4 },
];

function checkCollision(pos, radius = 0.35) {
  if (
    pos.x - radius < WALLS_S1.minX || pos.x + radius > WALLS_S1.maxX ||
    pos.z - radius < WALLS_S1.minZ || pos.z + radius > WALLS_S1.maxZ
  ) return true;
  for (const p of PARTITIONS_S1) {
    if (
      pos.x + radius > p.minX && pos.x - radius < p.maxX &&
      pos.z + radius > p.minZ && pos.z - radius < p.maxZ
    ) return true;
  }
  return false;
}

// ── Mode cinématique ─────────────────────────────────────────────────────────
function AutoNavigation({ pathPoints, isPlaying }) {
  const { camera } = useThree();
  const tRef = useRef(0);
  const curve = useRef(new THREE.CatmullRomCurve3(pathPoints, true, "catmullrom", 0.5));
  const targetY = useRef(1.7);

  useFrame((_, delta) => {
    if (!isPlaying) return;

    tRef.current = (tRef.current + delta * 0.042) % 1;
    const t = tRef.current;

    const pos = curve.current.getPoint(t);
    const lookAhead = curve.current.getPoint((t + 0.006) % 1);

    // Légère variation verticale pour dynamisme
    targetY.current = 1.7 + Math.sin(tRef.current * Math.PI * 4) * 0.04;
    pos.y = targetY.current;

    camera.position.lerp(pos, 0.06);

    const lookDir = new THREE.Vector3().subVectors(lookAhead, camera.position).normalize();
    if (lookDir.length() > 0.001) {
      const targetQ = new THREE.Quaternion().setFromUnitVectors(
        new THREE.Vector3(0, 0, -1),
        lookDir
      );
      camera.quaternion.slerp(targetQ, 0.06);
    }
  });

  return null;
}

// ── Mode manuel FPS muséal ───────────────────────────────────────────────────
function ManualNavigation() {
  const { camera, gl } = useThree();
  const keys = useRef({});
  const velocity = useRef(new THREE.Vector3());
  const bobTimer = useRef(0);
  const isMoving = useRef(false);
  const speed = 4.5;
  const friction = 0.88;

  useEffect(() => {
    const down = (e) => { keys.current[e.code] = true; };
    const up = (e) => { keys.current[e.code] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);

    const canvas = gl.domElement;
    const handleClick = () => {
      if (document.pointerLockElement !== canvas) {
        canvas.requestPointerLock();
      }
    };
    canvas.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      canvas.removeEventListener("click", handleClick);
    };
  }, [gl]);

  useFrame((_, delta) => {
    const k = keys.current;
    const dir = new THREE.Vector3();

    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0));

    if (k["KeyW"] || k["ArrowUp"]) dir.add(forward);
    if (k["KeyS"] || k["ArrowDown"]) dir.sub(forward);
    if (k["KeyA"] || k["ArrowLeft"]) dir.sub(right);
    if (k["KeyD"] || k["ArrowRight"]) dir.add(right);

    isMoving.current = dir.length() > 0;

    if (isMoving.current) {
      dir.normalize();
      velocity.current.lerp(dir.multiplyScalar(speed), 0.18);
      bobTimer.current += delta * 10;
    } else {
      velocity.current.multiplyScalar(friction);
    }

    const move = velocity.current.clone().multiplyScalar(delta);
    const nextPos = camera.position.clone().add(move);

    // Collision séparée X et Z pour glissement contre les murs
    const testX = camera.position.clone();
    testX.x += move.x;
    if (!checkCollision(testX)) {
      camera.position.x = testX.x;
    } else {
      velocity.current.x = 0;
    }

    const testZ = camera.position.clone();
    testZ.z += move.z;
    if (!checkCollision(testZ)) {
      camera.position.z = testZ.z;
    } else {
      velocity.current.z = 0;
    }

    // Bobinage de marche — subtil et élégant
    const bobAmount = isMoving.current
      ? Math.sin(bobTimer.current) * 0.018
      : 0;
    const rollAmount = isMoving.current
      ? Math.sin(bobTimer.current * 0.5) * 0.004
      : 0;

    camera.position.y += (1.7 + bobAmount - camera.position.y) * 0.12;
  });

  return <PointerLockControls />;
}

// ── Export principal ─────────────────────────────────────────────────────────
export default function Navigation({ pathPoints = CINEMATIC_PATH_S1, artworks = [], onNavigateToArtwork }) {
  const { navMode, isPlaying } = useGalleryStore();

  return (
    <>
      {navMode === "auto" && (
        <AutoNavigation pathPoints={pathPoints} isPlaying={isPlaying !== false} />
      )}
      {navMode === "manual" && <ManualNavigation />}
    </>
  );
}

export { CINEMATIC_PATH_S1 };