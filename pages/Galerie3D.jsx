// src/pages/Galerie3D.jsx — Version avec synchronisation des ventes & Musique

import { useEffect, useState, Suspense, useCallback, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Environment, Html, PerspectiveCamera } from "@react-three/drei";
import { useArtisteStore } from "../store/useArtisteStore";
import { gallerySyncService } from "../services/gallerySync.service";
import { oeuvreService } from "../services/oeuvre.service";
import { purchaseService } from "../services/purchase.service";
import Salle3D from "../components/3d/Salle3D";
import SalleAtelier3D from "../components/3d/SalleAtelier3D";
import SalleMusee3D from "../components/3d/SalleMusee3D";
import Navigation from "../components/3d/Navigation";
import AvatarController from "../components/3d/AvatarController";
import { MiniMapCanvas, MiniMapRenderer } from "../components/3d/MiniMap";
import { useGalleryStore } from "../store/useGalleryStore";
import PaiementModal from "../components/PaiementModal";
// Import du lecteur audio
import MuseumAudio from "../components/3d/MusemAudio";
import ChatbotWidget from "../components/3d/ChatbotWidget";
import "../styles/Galerie3D.css";
import myBackgroundMusic from "../assets/music/music.mp3";

// ── Loader artistique ─────────────────────────────────────────────────────────
function Loader3D({ message = "Chargement de la galerie..." }) {
  return (
    <Html center>
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 16,
        color: "#C9A040", fontFamily: "'Georgia', serif",
      }}>
        <div style={{
          width: 48, height: 48,
          border: "2px solid rgba(201,160,64,0.2)",
          borderTop: "2px solid #C9A040",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
        <p style={{ fontSize: 13, letterSpacing: "0.12em", opacity: 0.8 }}>{message}</p>
      </div>
    </Html>
  );
}

// ── Modal info œuvre ──────────────────────────────────────────────────────────
function ArtworkInfoModal({ oeuvre, onClose, onBuy }) {
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(10,5,8,0.85)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 200, backdropFilter: "blur(6px)",
    }} onClick={onClose}>
      <div style={{
        background: "linear-gradient(160deg, #1C0A12 0%, #2A1218 100%)",
        border: "1px solid rgba(201,160,64,0.3)",
        borderRadius: 4, maxWidth: 680, width: "92%",
        display: "flex", overflow: "hidden",
        boxShadow: "0 24px 60px rgba(0,0,0,0.65)",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ width: 280, flexShrink: 0, position: "relative" }}>
          <img src={oeuvre.img} alt={oeuvre.titre}
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            onError={e => { e.target.src = "https://picsum.photos/seed/info/280/380"; }}
          />
        </div>
        <div style={{ padding: "32px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
          <button onClick={onClose} style={{
            alignSelf: "flex-end", background: "none", border: "none",
            color: "rgba(245,236,215,0.4)", cursor: "pointer", fontSize: 18, marginBottom: 16,
            transition: "color 0.2s",
          }}>✕</button>

          <div style={{ flex: 1 }}>
            <p style={{ color: "#9A7A5A", fontSize: 11, letterSpacing: "0.2em", margin: "0 0 8px" }}>
              ŒUVRE ORIGINALE
            </p>
            <h2 style={{ color: "#F5ECD7", fontFamily: "'Georgia', serif", fontWeight: 400, fontSize: 22, margin: "0 0 6px" }}>
              {oeuvre.titre}
            </h2>
            <p style={{ color: "#9A7A5A", fontSize: 12, margin: "0 0 20px" }}>
              {oeuvre.technique} {oeuvre.dimensions ? `· ${oeuvre.dimensions}` : ""}
            </p>

            <div style={{ height: 1, background: "rgba(201,160,64,0.18)", marginBottom: 20 }} />

            {oeuvre.description && (
              <p style={{ color: "rgba(245,236,215,0.72)", fontSize: 13, lineHeight: 1.7, margin: "0 0 24px" }}>
                {oeuvre.description}
              </p>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
            <div>
              <p style={{ color: "#9A7A5A", fontSize: 10, letterSpacing: "0.15em", margin: "0 0 2px" }}>PRIX</p>
              <p style={{ color: "#C9A040", fontFamily: "'Georgia', serif", fontSize: 24, margin: 0, fontWeight: 700 }}>
                {oeuvre.prix} <span style={{ fontSize: 13, fontWeight: 400 }}>DT</span>
              </p>
            </div>
            <button onClick={() => { onClose(); onBuy(oeuvre); }} style={{
              background: "linear-gradient(135deg, #C9A040, #E8C06A)",
              border: "none", borderRadius: 2, padding: "12px 24px",
              color: "#1A0C10", fontSize: 12, fontWeight: 700,
              letterSpacing: "0.12em", cursor: "pointer",
            }}>
              ACQUÉRIR
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function Galerie3D() {
  const { galerieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.state?.mode || "visiteur";

  const { navMode, setNavMode } = useGalleryStore();
  const [roomStyle, setRoomStyle] = useState("galerie");
  const [loading, setLoading] = useState(true);
  const [chambre, setChambre] = useState(null);
  const [oeuvres, setOeuvres] = useState([]);
  const [panelOpen, setPanelOpen] = useState(true);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPaiementModal, setShowPaiementModal] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [paymentArtwork, setPaymentArtwork] = useState(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

  const pollingIntervalRef = useRef(null);

  const loadArtworks = useCallback(async () => {
    if (!galerieId) return [];
    
    try {
      console.log(`🖼️ Chargement des œuvres pour la galerie ${galerieId}`);
      
      const response = await oeuvreService.getByGalerie(parseInt(galerieId));
      
      let toutesOeuvres = [];
      if (response.data?.data && Array.isArray(response.data.data)) {
        toutesOeuvres = response.data.data;
      } else if (Array.isArray(response.data)) {
        toutesOeuvres = response.data;
      } else if (response.data?.results && Array.isArray(response.data.results)) {
        toutesOeuvres = response.data.results;
      } else {
        toutesOeuvres = [];
      }
      
      // Filtrer par galerie
      const targetGalerieId = parseInt(galerieId);
      const oeuvresFiltrees = toutesOeuvres.filter(oeuvre => {
        const oeuvreGalerieId = oeuvre.galerie || oeuvre.galerie_id || oeuvre.chambre_id;
        return parseInt(oeuvreGalerieId) === targetGalerieId;
      });
      
      // Exclure les œuvres vendues
      const oeuvresDisponibles = oeuvresFiltrees.filter(oeuvre => {
        const statut = oeuvre.statut?.toLowerCase();
        return statut !== "vendue" && statut !== "vendu";
      });
      
      const venduesCount = oeuvresFiltrees.length - oeuvresDisponibles.length;
      console.log(`📊 Galerie ${galerieId}: ${oeuvresDisponibles.length} disponibles, ${venduesCount} vendues`);
      
      return oeuvresDisponibles;
    } catch (error) {
      console.error("❌ Erreur chargement œuvres:", error);
      return [];
    }
  }, [galerieId]);

  const refreshArtworks = useCallback(async () => {
    const newArtworks = await loadArtworks();
    
    // Vérifier si la liste a changé
    if (newArtworks.length !== oeuvres.length) {
      console.log(`✨ Mise à jour: ${oeuvres.length} -> ${newArtworks.length} œuvres`);
      setOeuvres(newArtworks);
    } else {
      // Vérifier si des IDs ont changé
      const currentIds = new Set(oeuvres.map(o => o.id));
      const newIds = new Set(newArtworks.map(o => o.id));
      
      let hasChanges = false;
      for (const id of currentIds) {
        if (!newIds.has(id)) {
          console.log(`🗑️ Œuvre ${id} vendue, suppression de l'affichage`);
          hasChanges = true;
          break;
        }
      }
      
      if (hasChanges) {
        setOeuvres(newArtworks);
      }
    }
  }, [loadArtworks, oeuvres]);

  // Démarrer le polling après chargement
  useEffect(() => {
    if (!chambre || mode !== "visiteur") return;
    
    console.log("🟢 Démarrage du polling (vérification toutes les 5 secondes)");
    refreshArtworks();
    
    pollingIntervalRef.current = setInterval(() => {
      refreshArtworks();
    }, 5000);
    
    return () => {
      console.log("🔴 Arrêt du polling");
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
      }
    };
  }, [chambre, mode, refreshArtworks]);

  // Timeout sécurité
  useEffect(() => {
    const t = setTimeout(() => { if (loading) setLoading(false); }, 10000);
    return () => clearTimeout(t);
  }, [loading]);

  // Chargement
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setLoadingProgress(0);
      try {
        const interval = setInterval(() => {
          setLoadingProgress(p => Math.min(p + 8, 88));
        }, 150);

        const galleries = await gallerySyncService.getPublishedGalleriesForVisitors();
        const found = galleries.find(g => g.id === parseInt(galerieId));
        if (!found) { clearInterval(interval); setLoading(false); return; }
        setChambre(found);
        
        // DÉTERMINER LE STYLE DE SALLE
        let style = "galerie";
        if (found.subscription_type) {
          const subType = found.subscription_type.toLowerCase();
          if (subType === "atelier") style = "atelier";
          else if (subType === "musee") style = "musee";
          else style = "galerie";
        } else {
          const subscription = JSON.parse(localStorage.getItem('artist_subscription') || '{"type":"galerie"}');
          const subType = (subscription.type || "galerie").toLowerCase();
          if (subType === "atelier") style = "atelier";
          else if (subType === "musee") style = "musee";
          else style = "galerie";
        }
        
        console.log("🎨 Style de salle détecté:", style, "pour la galerie", found.nom);
        setRoomStyle(style);
        setLoadingProgress(60);

        const oeuvresDisponibles = await loadArtworks();
        setOeuvres(oeuvresDisponibles);

        setLoadingProgress(100);
        clearInterval(interval);
      } catch (err) {
        console.error(err);
      } finally {
        setTimeout(() => setLoading(false), 400);
      }
    };
    loadData();
  }, [galerieId, loadArtworks]);

  // Afficher les contrôles 3s après le passage en mode manuel
  useEffect(() => {
    if (navMode === "manual") {
      setShowControls(true);
      const t = setTimeout(() => setShowControls(false), 4000);
      return () => clearTimeout(t);
    }
  }, [navMode]);

  const handleBuyArtwork = (oeuvre) => {
    setPaymentArtwork(oeuvre);
    setShowPaiementModal(true);
  };

  const handlePaiementSuccess = async () => {
    setShowPaiementModal(false);
    setPurchaseSuccess(true);
    
    try {
      const response = await purchaseService.createArtworkOrder(paymentArtwork.id, chambre?.id);
      console.log("✅ Commande créée:", response.data);
      
      // Rafraîchir immédiatement les œuvres
      await refreshArtworks();
      
      alert(`✨ Félicitations !\n\nVotre commande pour "${paymentArtwork.titre}" a été enregistrée.\nUn email de confirmation vous a été envoyé.\n\nL'œuvre sera retirée de la galerie après confirmation OTP.`);
      setTimeout(() => setPurchaseSuccess(false), 3000);
    } catch (error) {
      console.error("❌ Erreur création commande:", error.response?.data);
      alert("Erreur lors de la création de la commande: " + JSON.stringify(error.response?.data));
      setPurchaseSuccess(false);
    }
  };

  const handleArtworkInfo = (o) => { 
    setSelectedArtwork(o); 
    setShowInfoModal(true); 
  };

  if (!chambre && !loading) {
    return (
      <div style={{
        position: "fixed", inset: 0, background: "#0a0508",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexDirection: "column", gap: 20, color: "#C9A040", fontFamily: "'Georgia', serif",
      }}>
        <div style={{ fontSize: 48, opacity: 0.4 }}>🏛️</div>
        <h2 style={{ fontWeight: 400 }}>Galerie introuvable</h2>
        <p style={{ color: "rgba(245,236,215,0.5)", fontSize: 13 }}>ID : {galerieId}</p>
        <button onClick={() => navigate("/user-page")} style={{
          background: "none", border: "1px solid rgba(201,160,64,0.4)",
          color: "#C9A040", padding: "10px 24px", borderRadius: 2,
          cursor: "pointer", letterSpacing: "0.1em", fontSize: 12,
        }}>
          ← RETOUR AUX GALERIES
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: "fixed", inset: 0, background: "#0a0508", overflow: "hidden" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
        @keyframes pulse { 0%,100% { opacity: 0.7; } 50% { opacity: 1; } }
      `}</style>

      {/* 🎵 Intégration du Lecteur Audio 🎵 */}
      <MuseumAudio audioSrc={myBackgroundMusic} />
      <ChatbotWidget currentGallery={chambre} artworks={oeuvres} />

      {/* ── Canvas 3D ── */}
      <Canvas
        shadows
        camera={{ position: [0, 1.7, 9], fov: 72 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
      >
        <Suspense fallback={<Loader3D message="Préparation de la galerie…" />}>
          <PerspectiveCamera makeDefault position={[0, 1.7, 9]} fov={72} />
          <Environment preset="apartment" background={false} environmentIntensity={0.4} />

          {roomStyle === "atelier" && (
            <SalleAtelier3D
              chambre={chambre}
              oeuvres={oeuvres}
              onArtworkClick={handleBuyArtwork}
              selectedArtworkId={selectedArtwork?.id}
            />
          )}
          {roomStyle === "galerie" && (
            <Salle3D
              chambre={chambre}
              oeuvres={oeuvres}
              onArtworkClick={handleBuyArtwork}
              selectedArtworkId={selectedArtwork?.id}
            />
          )}
          {roomStyle === "musee" && (
            <SalleMusee3D
              chambre={chambre}
              oeuvres={oeuvres}
              onArtworkClick={handleBuyArtwork}
              selectedArtworkId={selectedArtwork?.id}
            />
          )}

          <Navigation artworks={oeuvres} onNavigateToArtwork={handleArtworkInfo} />

          {mode === "visiteur" && (
            <AvatarController artworks={oeuvres} onArtworkGuide={(o, msg) => {}} onOpenChat={() => {}} />
          )}

          <MiniMapRenderer />
        </Suspense>
      </Canvas>

      <MiniMapCanvas />

      {/* ── Écran de chargement ── */}
      {loading && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 300,
          background: "linear-gradient(160deg, #0A0508 0%, #1C0A12 100%)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 32,
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "#C9A040", fontSize: 11, letterSpacing: "0.3em", marginBottom: 12, opacity: 0.7 }}>
              ARTVISION 3D
            </div>
            <div style={{ color: "#F5ECD7", fontFamily: "'Georgia', serif", fontSize: 28, fontWeight: 400 }}>
              {chambre?.nom || "Galerie Virtuelle"}
            </div>
          </div>

          <div style={{ width: 280, position: "relative" }}>
            <div style={{
              height: 1, background: "rgba(201,160,64,0.15)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: 0, left: 0, height: "100%",
                width: `${loadingProgress}%`,
                background: "linear-gradient(90deg, #8B6020, #C9A040, #E8C06A)",
                transition: "width 0.3s ease",
                boxShadow: "0 0 8px rgba(201,160,64,0.6)",
              }} />
            </div>
            <div style={{
              display: "flex", justifyContent: "space-between",
              marginTop: 10, color: "rgba(201,160,64,0.5)", fontSize: 10, letterSpacing: "0.1em",
            }}>
              <span>CHARGEMENT</span>
              <span>{loadingProgress}%</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 4, height: 4, borderRadius: "50%",
                background: "#C9A040",
                animation: `pulse 1.2s ease-in-out ${i * 0.3}s infinite`,
              }} />
            ))}
          </div>
        </div>
      )}

      {/* ── En-tête muséal ── */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, height: 56, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 20px",
        background: "linear-gradient(to bottom, rgba(10,5,8,0.92) 0%, rgba(10,5,8,0) 100%)",
        pointerEvents: "none",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, pointerEvents: "auto" }}>
          <div style={{ color: "#C9A040", fontSize: 9, letterSpacing: "0.3em", opacity: 0.7 }}>ARTVISION 3D</div>
          <div style={{ width: 1, height: 18, background: "rgba(201,160,64,0.3)" }} />
          <div style={{ color: "#F5ECD7", fontFamily: "'Georgia', serif", fontSize: 14, fontWeight: 400 }}>
            {chambre?.nom || "Galerie"}
          </div>
          <div style={{ color: "rgba(245,236,215,0.35)", fontSize: 11 }}>
            {oeuvres.length} œuvre{oeuvres.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, pointerEvents: "auto" }}>
          <button
            onClick={() => setNavMode(navMode === "auto" ? "manual" : "auto")}
            title={navMode === "auto" ? "Passer en mode manuel" : "Passer en mode automatique"}
            style={{
              background: "rgba(201,160,64,0.1)",
              border: "1px solid rgba(201,160,64,0.3)",
              color: "#C9A040",
              padding: "6px 14px",
              borderRadius: 2, cursor: "pointer",
              fontSize: 10, letterSpacing: "0.15em",
              display: "flex", alignItems: "center", gap: 6,
              transition: "all 0.2s",
            }}
          >
            <span style={{ fontSize: 13 }}>{navMode === "auto" ? "◈" : "⊹"}</span>
            {navMode === "auto" ? "AUTO" : "MANUEL"}
          </button>

          <button onClick={() => navigate("/user-page")} style={{
            background: "none", border: "1px solid rgba(201,160,64,0.25)",
            color: "rgba(245,236,215,0.55)", padding: "6px 14px",
            borderRadius: 2, cursor: "pointer", fontSize: 10, letterSpacing: "0.15em",
            transition: "all 0.2s",
          }}>
            ← QUITTER
          </button>
        </div>
      </div>

      {/* ── Panneau catalogue latéral ── */}
      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 90,
        width: panelOpen ? 260 : 0,
        transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        overflow: "hidden",
        background: "linear-gradient(to left, rgba(10,5,8,0.96) 0%, rgba(28,10,18,0.9) 100%)",
        borderLeft: panelOpen ? "1px solid rgba(201,160,64,0.18)" : "none",
      }}>
        <div style={{ width: 260, height: "100%", display: "flex", flexDirection: "column", paddingTop: 64 }}>
          <div style={{ padding: "20px 20px 12px" }}>
            <p style={{ color: "#9A7A5A", fontSize: 9, letterSpacing: "0.3em", margin: "0 0 6px" }}>CATALOGUE</p>
            <h3 style={{ color: "#F5ECD7", fontFamily: "'Georgia', serif", fontWeight: 400, fontSize: 16, margin: "0 0 4px" }}>
              Œuvres exposées
            </h3>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div style={{ height: 1, flex: 1, background: "rgba(201,160,64,0.25)" }} />
              <span style={{ color: "#C9A040", fontSize: 11 }}>{oeuvres.length}</span>
            </div>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0 12px 20px" }}>
            {oeuvres.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 16px", color: "rgba(245,236,215,0.3)" }}>
                <div style={{ fontSize: 28, marginBottom: 12 }}>🖼</div>
                <p style={{ fontSize: 12, fontStyle: "italic" }}>Aucune œuvre exposée</p>
              </div>
            ) : (
              oeuvres.map((o, idx) => (
                <div
                  key={o.id || idx}
                  onClick={() => handleArtworkInfo(o)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "10px 8px", marginBottom: 2, borderRadius: 2,
                    cursor: "pointer", transition: "background 0.2s",
                    borderBottom: "1px solid rgba(201,160,64,0.06)",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(201,160,64,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  <div style={{
                    width: 24, flexShrink: 0, textAlign: "center",
                    color: "rgba(201,160,64,0.35)", fontSize: 10, fontFamily: "'Georgia', serif",
                  }}>
                    {toRoman(idx + 1)}
                  </div>

                  <div style={{
                    width: 42, height: 42, flexShrink: 0, borderRadius: 1,
                    overflow: "hidden", border: "1px solid rgba(201,160,64,0.2)",
                  }}>
                    <img src={o.img} alt={o.titre}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      onError={e => { e.target.src = `https://picsum.photos/seed/${idx}/42/42`; }}
                    />
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      color: "#E8DFC8", fontSize: 12, margin: "0 0 2px",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {o.titre}
                    </p>
                    <p style={{ color: "#C9A040", fontSize: 11, margin: 0 }}>{o.prix} DT</p>
                  </div>

                  <button
                    onClick={e => { e.stopPropagation(); handleBuyArtwork(o); }}
                    style={{
                      background: "none", border: "1px solid rgba(201,160,64,0.25)",
                      color: "#C9A040", width: 26, height: 26, borderRadius: 1,
                      cursor: "pointer", fontSize: 11, flexShrink: 0,
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(201,160,64,0.15)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
                  >
                    ⊕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ── Toggle panneau ── */}
      <button
        onClick={() => setPanelOpen(p => !p)}
        style={{
          position: "fixed",
          right: panelOpen ? 268 : 8,
          top: "50%", transform: "translateY(-50%)",
          zIndex: 95, background: "rgba(28,10,18,0.9)",
          border: "1px solid rgba(201,160,64,0.25)",
          color: "#C9A040", width: 22, height: 48, borderRadius: "3px 0 0 3px",
          cursor: "pointer", fontSize: 10, transition: "right 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        {panelOpen ? "›" : "‹"}
      </button>

      {/* ── Overlay contrôles mode manuel ── */}
      {showControls && (
        <div style={{
          position: "fixed", bottom: 80, left: "50%", transform: "translateX(-50%)",
          zIndex: 100, background: "rgba(10,5,8,0.85)", backdropFilter: "blur(8px)",
          border: "1px solid rgba(201,160,64,0.2)",
          borderRadius: 4, padding: "16px 24px",
          display: "flex", gap: 20, alignItems: "center",
          animation: "fadeIn 0.4s ease, fadeOut 0.5s ease 3.5s forwards",
          pointerEvents: "none",
        }}>
          {[
            { key: "W A S D", label: "Se déplacer" },
            { key: "Souris", label: "Regarder" },
            { key: "Clic", label: "Activer" },
          ].map(({ key, label }) => (
            <div key={key} style={{ textAlign: "center" }}>
              <div style={{
                background: "rgba(201,160,64,0.1)", border: "1px solid rgba(201,160,64,0.3)",
                borderRadius: 3, padding: "3px 8px", marginBottom: 4,
                color: "#C9A040", fontSize: 11, fontFamily: "monospace",
              }}>
                {key}
              </div>
              <div style={{ color: "rgba(245,236,215,0.5)", fontSize: 10 }}>{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* ── Message de succès ── */}
      {purchaseSuccess && paymentArtwork && (
        <div style={{
          position: "fixed", bottom: 30, left: "50%", transform: "translateX(-50%)",
          zIndex: 200, background: "#3A6B35", color: "white",
          padding: "12px 24px", borderRadius: 40, fontSize: 13,
          boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
          animation: "fadeIn 0.3s ease",
        }}>
          ✅ Commande créée pour "{paymentArtwork.titre}" !
        </div>
      )}

      {/* ── Modals ── */}
      {showInfoModal && selectedArtwork && (
        <ArtworkInfoModal
          oeuvre={selectedArtwork}
          onClose={() => setShowInfoModal(false)}
          onBuy={handleBuyArtwork}
        />
      )}

      {showPaiementModal && paymentArtwork && (
        <PaiementModal
          isOpen={showPaiementModal}
          onClose={() => setShowPaiementModal(false)}
          onSuccess={handlePaiementSuccess}
          montant={paymentArtwork.prix}
          description={`Achat de l'œuvre "${paymentArtwork.titre}"`}
          type="artwork"
          itemId={paymentArtwork.id}
          role="visiteur"
        />
      )}
    </div>
  );
}

// Utilitaire chiffres romains (I à XIV)
function toRoman(n) {
  const map = [[10,"X"],[9,"IX"],[5,"V"],[4,"IV"],[1,"I"]];
  let s = "";
  for (const [v, r] of map) { while (n >= v) { s += r; n -= v; } }
  return s;
}