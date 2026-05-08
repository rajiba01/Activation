import { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import * as THREE from "three";
import { useGalleryStore } from "../../store/useGalleryStore";

// Points du chemin cinématique pour la Salle 1
const CINEMATIC_PATH_S1 = [
  new THREE.Vector3( 0,   1.7,  7),
  new THREE.Vector3(-5,   1.7,  3),
  new THREE.Vector3(-5,   1.7, -3),
  new THREE.Vector3( 0,   1.7, -3),
  new THREE.Vector3( 0,   1.7,  0),
  new THREE.Vector3( 5,   1.7, -3),
  new THREE.Vector3( 5,   1.7,  3),
  new THREE.Vector3( 0,   1.7,  7),
];

// Murs de la salle 1 pour la collision AABB
const WALLS_S1 = {
  minX: -7.6, maxX: 7.6,
  minZ: -4.6, maxZ: 4.6,
};

// Cloisons centrales (AABB simplifié)
const PARTITIONS_S1 = [
  { minX: -2.2, maxX: -1.8, minZ: -1.2, maxZ: 1.2 },
  { minX:  1.8, maxX:  2.2, minZ: -1.2, maxZ: 1.2 },
];

function checkCollision(pos) {
  // Murs extérieurs
  if (
    pos.x < WALLS_S1.minX || pos.x > WALLS_S1.maxX ||
    pos.z < WALLS_S1.minZ || pos.z > WALLS_S1.maxZ
  ) return true;

  // Cloisons centrales
  for (const p of PARTITIONS_S1) {
    if (
      pos.x > p.minX && pos.x < p.maxX &&
      pos.z > p.minZ && pos.z < p.maxZ
    ) return true;
  }

  return false;
}

// ── Mode cinématique automatique ──
function AutoNavigation({ pathPoints, isPlaying }) {
  const { camera } = useThree();
  const tRef = useRef(0);
  const curve = useRef(
    new THREE.CatmullRomCurve3(pathPoints, true) // closed loop
  );

  useFrame((_, delta) => {
    if (!isPlaying) return;

    tRef.current = (tRef.current + delta * 0.04) % 1;
    const t = tRef.current;

    const pos = curve.current.getPoint(t);
    const ahead = curve.current.getPoint((t + 0.01) % 1);

    // Lerp doux vers la position
    camera.position.lerp(pos, 0.05);

    // Regarder vers le prochain point
    const lookDir = ahead.clone().sub(camera.position).normalize();
    const targetQ = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, -1),
      lookDir
    );
    camera.quaternion.slerp(targetQ, 0.05);
  });

  return null;
}

// ── Mode manuel FPS ──
function ManualNavigation() {
  const { camera } = useThree();
  const keys = useRef({});
  const velocity = useRef(new THREE.Vector3());
  const speed = 4;

  useEffect(() => {
    const down = (e) => { keys.current[e.code] = true; };
    const up = (e) => { keys.current[e.code] = false; };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  useFrame((_, delta) => {
    const k = keys.current;
    const dir = new THREE.Vector3();

    // Direction caméra (ignorant Y)
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(forward, new THREE.Vector3(0, 1, 0));

    if (k["KeyW"] || k["ArrowUp"])    dir.add(forward);
    if (k["KeyS"] || k["ArrowDown"])  dir.sub(forward);
    if (k["KeyA"] || k["ArrowLeft"])  dir.sub(right);
    if (k["KeyD"] || k["ArrowRight"]) dir.add(right);

    dir.normalize();
    velocity.current.lerp(dir.multiplyScalar(speed), 0.15);

    const nextPos = camera.position.clone().add(
      velocity.current.clone().multiplyScalar(delta)
    );

    // Collision — on ne bouge que si pas de collision
    if (!checkCollision(nextPos)) {
      camera.position.copy(nextPos);
    } else {
      velocity.current.set(0, 0, 0);
    }

    // Hauteur fixe (pas de saut)
    camera.position.y = 1.7;
  });

  return <PointerLockControls />;
}

// ── Composant principal ──
export default function Navigation({ pathPoints = CINEMATIC_PATH_S1 }) {
  const { navMode, isPlaying, setNavMode } = useGalleryStore();

  // Tab pour basculer auto ↔ manuel
  useEffect(() => {
    const handleTab = (e) => {
      if (e.code === "Tab") {
        e.preventDefault();
        setNavMode(navMode === "auto" ? "manual" : "auto");
      }
      // Escape pour quitter le pointer lock
      if (e.code === "Escape" && navMode === "manual") {
        setNavMode("auto");
      }
    };
    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [navMode, setNavMode]);

  return (
    <>
      {navMode === "auto" && (
        <AutoNavigation pathPoints={pathPoints} isPlaying={isPlaying} />
      )}
      {navMode === "manual" && <ManualNavigation />}
    </>
  );
}

export { CINEMATIC_PATH_S1 };