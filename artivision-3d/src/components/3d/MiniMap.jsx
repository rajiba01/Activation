import { useRef, useEffect } from "react";
import { useFrame, useThree, createPortal } from "@react-three/fiber";
import { OrthographicCamera, useFBO } from "@react-three/drei";
import { useGalleryStore } from "../../store/useGalleryStore";
import * as THREE from "three";

// ── Mini-map rendue dans un canvas 2D overlay (approche simple et fiable) ──
// On lit la position caméra principale et on dessine un plan 2D

export default function MiniMap({ roomWidth = 16, roomDepth = 10, partitions = [] }) {
  const canvasRef = useRef(null);
  const { camera } = useThree();
  const { navMode } = useGalleryStore();

  useFrame(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Fond salle
    ctx.fillStyle = "rgba(20,16,12,0.85)";
    ctx.beginPath();
    ctx.roundRect(0, 0, W, H, 8);
    ctx.fill();

    const pad = 14;
    const scaleX = (W - pad * 2) / roomWidth;
    const scaleZ = (H - pad * 2) / roomDepth;

    // Convertit coord 3D → canvas 2D
    const toMap = (x, z) => ({
      mx: pad + (x + roomWidth / 2) * scaleX,
      my: pad + (z + roomDepth / 2) * scaleZ,
    });

    // Murs extérieurs
    ctx.strokeStyle = "#C9A040";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);

    // Cloisons
    ctx.fillStyle = "#8B7250";
    for (const p of partitions) {
      const { mx: x1, my: y1 } = toMap(p.minX, p.minZ);
      const { mx: x2, my: y2 } = toMap(p.maxX, p.maxZ);
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    }

    // Salles — étiquettes
    ctx.fillStyle = "rgba(201,160,64,0.12)";
    ctx.fillRect(pad + 1, pad + 1, W - pad * 2 - 2, H - pad * 2 - 2);

    // Position du joueur (triangle orienté)
    const cam = camera.position;
    const { mx, my } = toMap(cam.x, cam.z);

    // Direction caméra
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const angle = Math.atan2(dir.x, dir.z);

    ctx.save();
    ctx.translate(mx, my);
    ctx.rotate(angle);

    // Triangle joueur
    ctx.fillStyle = "#E24B4A";
    ctx.beginPath();
    ctx.moveTo(0, -7);
    ctx.lineTo(-4, 5);
    ctx.lineTo(4, 5);
    ctx.closePath();
    ctx.fill();

    // Halo
    ctx.globalAlpha = 0.25;
    ctx.fillStyle = "#E24B4A";
    ctx.beginPath();
    ctx.arc(0, 0, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    ctx.restore();

    // Légende mode nav
    ctx.fillStyle = navMode === "auto" ? "#5DCAA5" : "#7F77DD";
    ctx.font = "bold 9px monospace";
    ctx.fillText(navMode === "auto" ? "AUTO" : "MANUEL", pad + 2, H - pad + 4);
  });

  return null; // Le canvas est dans le DOM, pas dans la scène 3D
}

// ── Canvas HTML overlay (placé dans Galerie3D.jsx) ──
export function MiniMapCanvas({
  roomWidth = 16,
  roomDepth = 10,
  partitions = [
    { minX: -2.2, maxX: -1.8, minZ: -1.2, maxZ: 1.2 },
    { minX:  1.8, maxX:  2.2, minZ: -1.2, maxZ: 1.2 },
  ],
}) {
  const canvasRef = useRef(null);

  // On expose le ref au composant MiniMap via un event custom
  useEffect(() => {
    window.__minimapCanvasRef = canvasRef;
    return () => { window.__minimapCanvasRef = null; };
  }, []);

  return (
    <div style={{
      position: "absolute",
      bottom: 24,
      right: 24,
      width: 160,
      height: 110,
      borderRadius: 10,
      overflow: "hidden",
      border: "1.5px solid rgba(201,160,64,0.5)",
      boxShadow: "0 4px 24px rgba(0,0,0,0.6)",
      zIndex: 50,
    }}>
      <canvas
        ref={canvasRef}
        width={160}
        height={110}
        style={{ display: "block", width: "100%", height: "100%" }}
        id="minimap-canvas"
      />
    </div>
  );
}

// ── Composant Three.js qui dessine sur le canvas HTML ──
export function MiniMapRenderer({ roomWidth = 16, roomDepth = 10, partitions }) {
  const { camera } = useThree();
  const { navMode } = useGalleryStore();
  const defaultPartitions = [
    { minX: -2.2, maxX: -1.8, minZ: -1.2, maxZ: 1.2 },
    { minX:  1.8, maxX:  2.2, minZ: -1.2, maxZ: 1.2 },
  ];
  const parts = partitions || defaultPartitions;

  useFrame(() => {
    const canvas = document.getElementById("minimap-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Fond
    ctx.fillStyle = "rgba(20,14,8,0.88)";
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(0, 0, W, H, 8);
    else ctx.rect(0, 0, W, H);
    ctx.fill();

    const pad = 12;
    const scaleX = (W - pad * 2) / roomWidth;
    const scaleZ = (H - pad * 2) / roomDepth;

    const toMap = (x, z) => ({
      mx: pad + (x + roomWidth / 2) * scaleX,
      my: pad + (z + roomDepth / 2) * scaleZ,
    });

    // Sol salle
    ctx.fillStyle = "rgba(201,160,64,0.08)";
    ctx.fillRect(pad, pad, W - pad * 2, H - pad * 2);

    // Murs
    ctx.strokeStyle = "#C9A040";
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pad, pad, W - pad * 2, H - pad * 2);

    // Cloisons
    ctx.fillStyle = "#7A6040";
    for (const p of parts) {
      const { mx: x1, my: y1 } = toMap(p.minX, p.minZ);
      const { mx: x2, my: y2 } = toMap(p.maxX, p.maxZ);
      ctx.fillRect(x1, y1, x2 - x1, y2 - y1);
    }

    // Joueur
    const cam = camera.position;
    const { mx, my } = toMap(cam.x, cam.z);
    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir);
    const angle = Math.atan2(dir.x, dir.z);

    ctx.save();
    ctx.translate(mx, my);
    ctx.rotate(angle);

    // Halo
    ctx.globalAlpha = 0.2;
    ctx.fillStyle = "#E24B4A";
    ctx.beginPath();
    ctx.arc(0, 0, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Triangle
    ctx.fillStyle = "#E24B4A";
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(0, -6);
    ctx.lineTo(-3.5, 4);
    ctx.lineTo(3.5, 4);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();

    // Badge mode
    const modeColor = navMode === "auto" ? "#5DCAA5" : "#7F77DD";
    ctx.fillStyle = modeColor;
    ctx.font = "bold 8px monospace";
    ctx.fillText(navMode === "auto" ? "● AUTO" : "● MANUEL", pad, H - 5);
  });

  return null;
}