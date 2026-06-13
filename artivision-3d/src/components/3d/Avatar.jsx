// src/components/3d/Avatar.jsx — Guide Muséal Élégant
import { useRef, useEffect, useState, forwardRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const Avatar = forwardRef(function Avatar({ position, onInteract }, ref) {
  const groupRef = useRef();
  const innerRef = ref || groupRef;

  // Refs pour animations
  const bodyRef   = useRef();
  const headRef   = useRef();
  const leftArmRef  = useRef();
  const rightArmRef = useRef();
  const leftLegRef  = useRef();
  const rightLegRef = useRef();
  const haloRef   = useRef();
  const particlesRef = useRef([]);

  const [hovered, setHovered]   = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const walkClock = useRef(0);
  const breathClock = useRef(0);

  // ── Construire le personnage ──────────────────────────────────────────────
  useEffect(() => {
    if (!innerRef.current) return;
    const g = innerRef.current;

    // Matériaux
    const skinMat   = new THREE.MeshStandardMaterial({ color: "#E8C49A", roughness: 0.4, metalness: 0.0 });
    const suitMat   = new THREE.MeshStandardMaterial({ color: "#1C0A12", roughness: 0.55, metalness: 0.05 });
    const shirtMat  = new THREE.MeshStandardMaterial({ color: "#F5ECD7", roughness: 0.6 });
    const pantsMat  = new THREE.MeshStandardMaterial({ color: "#150810", roughness: 0.6 });
    const goldMat   = new THREE.MeshStandardMaterial({ color: "#C9A040", metalness: 0.9, roughness: 0.1 });
    const shoeMat   = new THREE.MeshStandardMaterial({ color: "#0A0508", roughness: 0.5, metalness: 0.15 });
    const hairMat   = new THREE.MeshStandardMaterial({ color: "#1A0C06", roughness: 0.85 });
    const eyeWhite  = new THREE.MeshStandardMaterial({ color: "#F8F4EE" });
    const eyeDark   = new THREE.MeshStandardMaterial({ color: "#1A0C06" });
    const eyeShine  = new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#ffffff", emissiveIntensity: 1 });

    // — Jambes —
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.62, 10), pantsMat);
    leftLeg.position.set(-0.14, 0.31, 0);
    leftLeg.castShadow = true;
    leftLegRef.current = leftLeg;
    g.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.09, 0.62, 10), pantsMat);
    rightLeg.position.set(0.14, 0.31, 0);
    rightLeg.castShadow = true;
    rightLegRef.current = rightLeg;
    g.add(rightLeg);

    // Chaussures
    const leftShoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.28), shoeMat);
    leftShoe.position.set(-0.14, 0.04, 0.04);
    g.add(leftShoe);
    const rightShoe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.28), shoeMat);
    rightShoe.position.set(0.14, 0.04, 0.04);
    g.add(rightShoe);

    // — Torse / veste —
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.25, 0.75, 12), suitMat);
    body.position.set(0, 0.975, 0);
    body.castShadow = true;
    bodyRef.current = body;
    g.add(body);

    // Chemise (plastron)
    const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.5, 0.05), shirtMat);
    shirt.position.set(0, 0.96, 0.26);
    g.add(shirt);

    // Boutonnières
    for (let i = 0; i < 3; i++) {
      const btn = new THREE.Mesh(new THREE.SphereGeometry(0.015, 6, 6), goldMat);
      btn.position.set(0, 1.06 - i * 0.14, 0.28);
      g.add(btn);
    }

    // Pochette dorée
    const pocket = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.02), goldMat);
    pocket.position.set(-0.17, 1.1, 0.26);
    g.add(pocket);
    // Pointe de pochette
    const pocketTip = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.06, 4), shirtMat);
    pocketTip.position.set(-0.17, 1.15, 0.27);
    pocketTip.rotation.z = Math.PI;
    g.add(pocketTip);

    // — Épaules arrondies —
    const leftShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), suitMat);
    leftShoulder.position.set(-0.32, 1.22, 0);
    g.add(leftShoulder);
    const rightShoulder = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), suitMat);
    rightShoulder.position.set(0.32, 1.22, 0);
    g.add(rightShoulder);

    // — Bras —
    const leftArm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.52, 10), suitMat);
    leftArm.position.set(-0.4, 0.96, 0);
    leftArm.castShadow = true;
    leftArmRef.current = leftArm;
    g.add(leftArm);

    const rightArm = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.52, 10), suitMat);
    rightArm.position.set(0.4, 0.96, 0);
    rightArm.castShadow = true;
    rightArmRef.current = rightArm;
    g.add(rightArm);

    // Mains
    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), skinMat);
    leftHand.position.set(-0.4, 0.7, 0);
    g.add(leftHand);
    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 12), skinMat);
    rightHand.position.set(0.4, 0.7, 0);
    g.add(rightHand);

    // — Cou —
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.14, 10), skinMat);
    neck.position.set(0, 1.43, 0);
    g.add(neck);

    // — Tête —
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.27, 24, 24), skinMat);
    head.position.set(0, 1.75, 0);
    head.castShadow = true;
    headRef.current = head;
    g.add(head);

    // Mâchoire légèrement aplatie
    const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), skinMat);
    jaw.position.set(0, 1.62, 0.04);
    jaw.scale.set(1, 0.6, 1);
    g.add(jaw);

    // Sourcils
    for (let s of [-1, 1]) {
      const brow = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.025, 0.02), hairMat);
      brow.position.set(s * 0.12, 1.84, 0.25);
      brow.rotation.z = s * 0.15;
      g.add(brow);
    }

    // Yeux
    for (let s of [-1, 1]) {
      const eyeW = new THREE.Mesh(new THREE.SphereGeometry(0.07, 16, 16), eyeWhite);
      eyeW.position.set(s * 0.12, 1.77, 0.24);
      g.add(eyeW);

      const pupil = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), eyeDark);
      pupil.position.set(s * 0.12, 1.77, 0.28);
      g.add(pupil);

      const shine = new THREE.Mesh(new THREE.SphereGeometry(0.016, 8, 8), eyeShine);
      shine.position.set(s * 0.13, 1.795, 0.31);
      g.add(shine);
    }

    // Nez
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), skinMat);
    nose.scale.set(0.7, 0.5, 1);
    nose.position.set(0, 1.71, 0.28);
    g.add(nose);

    // Bouche (sourire léger)
    const mouthL = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), new THREE.MeshStandardMaterial({ color: "#C07060", roughness: 0.6 }));
    mouthL.position.set(-0.055, 1.635, 0.265);
    g.add(mouthL);
    const mouthR = mouthL.clone();
    mouthR.position.set(0.055, 1.635, 0.265);
    g.add(mouthR);

    // — Cheveux —
    const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.28, 20, 20), hairMat);
    hairTop.position.set(0, 1.86, -0.02);
    hairTop.scale.set(1, 0.52, 1);
    g.add(hairTop);

    // Raie côté
    const hairSide = new THREE.Mesh(new THREE.SphereGeometry(0.18, 12, 12), hairMat);
    hairSide.position.set(-0.14, 1.9, 0.06);
    hairSide.scale.set(1.2, 0.35, 0.8);
    g.add(hairSide);

    // — Cravate —
    const tieTop = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.12, 0.02), new THREE.MeshStandardMaterial({ color: "#3D0C1F", roughness: 0.7 }));
    tieTop.position.set(0, 1.38, 0.27);
    g.add(tieTop);
    const tieBody = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.28, 0.02), new THREE.MeshStandardMaterial({ color: "#3D0C1F", roughness: 0.7 }));
    tieBody.position.set(0, 1.18, 0.275);
    g.add(tieBody);
    // Motif cravate
    const tiePattern = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.01), goldMat);
    tiePattern.position.set(0, 1.18, 0.285);
    g.add(tiePattern);

    // — Halo au sol —
    const halo = new THREE.Mesh(
      new THREE.RingGeometry(0.38, 0.52, 48),
      new THREE.MeshBasicMaterial({ color: "#C9A040", transparent: true, opacity: 0.35, side: THREE.DoubleSide })
    );
    halo.rotation.x = -Math.PI / 2;
    halo.position.y = 0.01;
    haloRef.current = halo;
    g.add(halo);

    // — Particules flottantes —
    const particles = [];
    for (let i = 0; i < 6; i++) {
      const p = new THREE.Mesh(
        new THREE.SphereGeometry(0.025, 6, 6),
        new THREE.MeshBasicMaterial({ color: "#C9A040", transparent: true, opacity: 0.7 })
      );
      const angle = (i / 6) * Math.PI * 2;
      p.userData = { angle, radius: 0.45 + Math.random() * 0.15, speed: 0.5 + Math.random() * 0.5, phase: Math.random() * Math.PI * 2 };
      g.add(p);
      particles.push(p);
    }
    particlesRef.current = particles;

  }, []);

  // ── Animations frame ─────────────────────────────────────────────────────
  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();
    breathClock.current = t;

    // Respiration (idle bob)
    if (bodyRef.current) {
      bodyRef.current.position.y = 0.975 + Math.sin(t * 1.8) * 0.008;
    }
    if (headRef.current) {
      headRef.current.position.y = 1.75 + Math.sin(t * 1.8) * 0.01;
      // Regard vers l'avant (légère rotation de tête)
      headRef.current.rotation.y = Math.sin(t * 0.4) * 0.08;
    }

    // Balancement des bras au repos
    if (leftArmRef.current && rightArmRef.current) {
      const swing = isWalking
        ? Math.sin(walkClock.current) * 0.6
        : Math.sin(t * 1.5) * 0.06;
      leftArmRef.current.rotation.x  =  swing;
      rightArmRef.current.rotation.x = -swing;
      if (isWalking) walkClock.current += delta * 8;
    }

    // Halo pulsant
    if (haloRef.current) {
      const pulse = 0.25 + Math.sin(t * 2.2) * 0.12;
      haloRef.current.material.opacity = pulse;
      const s = 1 + Math.sin(t * 2.2) * 0.06;
      haloRef.current.scale.set(s, s, s);
    }

    // Particules orbitales
    particlesRef.current.forEach(p => {
      const { angle, radius, speed, phase } = p.userData;
      const a = angle + t * speed;
      p.position.set(Math.cos(a) * radius, 0.6 + Math.sin(t * 2 + phase) * 0.25, Math.sin(a) * radius);
      p.material.opacity = 0.4 + Math.sin(t * 3 + phase) * 0.3;
    });
  });

  return (
    <group
      ref={innerRef}
      position={position}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={() => onInteract?.()}
    >
      {/* Indicateur "Parler" au survol */}
      {hovered && (
        <Html position={[0, 2.2, 0]} center style={{ pointerEvents: "none" }}>
          <div style={{
            background: "linear-gradient(135deg, #1C0A12, #2A1218)",
            border: "1px solid rgba(201,160,64,0.6)",
            borderRadius: 3,
            padding: "6px 14px",
            fontSize: 11,
            color: "#C9A040",
            letterSpacing: "0.12em",
            whiteSpace: "nowrap",
            boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
            position: "relative",
          }}>
            ✦ PARLER AU GUIDE
            <div style={{
              position: "absolute", bottom: -6, left: "50%",
              transform: "translateX(-50%)",
              width: 0, height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "6px solid rgba(201,160,64,0.6)",
            }} />
          </div>
        </Html>
      )}

      {/* Badge nom */}
      <Html position={[0, -0.05, 0]} center style={{ pointerEvents: "none" }}>
        <div style={{
          background: "rgba(10,5,8,0.82)",
          border: "1px solid rgba(201,160,64,0.3)",
          color: "#C9A040",
          padding: "3px 10px",
          borderRadius: 2,
          fontSize: 9,
          letterSpacing: "0.18em",
          whiteSpace: "nowrap",
          backdropFilter: "blur(4px)",
        }}>
          GUIDE · ARTVISION
        </div>
      </Html>
    </group>
  );
});

export default Avatar;