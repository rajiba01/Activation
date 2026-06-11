// src/pages/Galerie3D.jsx
import { useEffect, useState, Suspense } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import { useArtisteStore } from "../store/useArtisteStore";
import Salle3D from "../components/3d/Salle3D";
import "../styles/Galerie3D.css";

// Loader 3D
function Loader3D() {
  return (
    <Html center>
      <div className="g3d-loader">
        <div className="g3d-loader-spinner" />
        <p>Chargement de la galerie 3D...</p>
      </div>
    </Html>
  );
}

// Modal d'achat
function BuyModal({ oeuvre, onClose }) {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = async () => {
    setPaying(true);
    await new Promise(r => setTimeout(r, 1800));
    setPaying(false);
    setPaid(true);
  };

  return (
    <div className="g3d-buy-modal-overlay" onClick={onClose}>
      <div className="g3d-buy-modal" onClick={e => e.stopPropagation()}>
        <button className="g3d-buy-modal-close" onClick={onClose}>✕</button>
        {!paid ? (
          <>
            <img 
              src={oeuvre.img} 
              alt={oeuvre.titre} 
              className="g3d-buy-modal-img"
              onError={e => { e.target.src = "https://picsum.photos/seed/fallback/300/200"; }}
            />
            <h3>{oeuvre.titre}</h3>
            <p className="tech">{oeuvre.technique} · {oeuvre.dimensions || "Dimensions non spécifiées"}</p>
            <p className="desc">{oeuvre.description}</p>
            <div className="price">
              <span>Prix</span>
              <strong>{oeuvre.prix} DT</strong>
            </div>
            <button className="buy-btn" onClick={handlePay} disabled={paying}>
              {paying ? "Traitement..." : `🛒 Acheter — ${oeuvre.prix} DT`}
            </button>
          </>
        ) : (
          <div className="g3d-buy-success">
            <h2>✨ Achat confirmé !</h2>
            <p>Vous avez acquis <strong>"{oeuvre.titre}"</strong></p>
            <p>Un email de confirmation vous sera envoyé.</p>
            <button className="buy-btn" onClick={onClose}>Fermer</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Galerie3D() {
  const { galerieId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const mode = location.state?.mode || "visiteur";

  const chambres = useArtisteStore((state) => state.chambres);
  const getOeuvresByChambre = useArtisteStore((state) => state.getOeuvresByChambre);

  const [loading, setLoading] = useState(true);
  const [panelOpen, setPanelOpen] = useState(true);
  const [hoveredArtwork, setHoveredArtwork] = useState(null);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showBuyModal, setShowBuyModal] = useState(false);

  const chambre = chambres.find(c => c.id === galerieId) || chambres[0];
const toutes = useArtisteStore(state => state.oeuvres); // ou le nom de ta collection
const oeuvresPubliees = chambre 
  ? toutes.filter(o => o.galerieId === chambre.id || o.chambreId === chambre.id)
  : [];

console.log("🔍 chambre.id:", chambre?.id);
console.log("🔍 toutes oeuvres:", toutes?.map(o => ({ id: o.id, galerieId: o.galerieId })));
  useEffect(() => {
    console.log("🎨 Galerie3D - Chargement:", {
      galerieId,
      chambreTrouvee: !!chambre,
      chambreNom: chambre?.nom,
      nbOeuvres: oeuvresPubliees.length
    });
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [chambre, oeuvresPubliees]);

  const handleArtworkClick = (oeuvre) => {
    console.log("🖼️ Clic sur:", oeuvre.titre);
    setSelectedArtwork(oeuvre);
    if (mode === "visiteur") {
      setShowBuyModal(true);
    } else {
      navigate("/mes-oeuvres", { state: { editOeuvreId: oeuvre.id } });
    }
  };

  if (!chambre) {
    return (
      <div className="g3d-error">
        <h1>🏛️ Galerie non trouvée</h1>
        <p>ID: {galerieId}</p>
        <button onClick={() => navigate("/mes-chambres")}>Retour</button>
      </div>
    );
  }

  return (
    <div className="g3d-root">
      <Canvas
        shadows
        camera={{ position: [0, 3, 12], fov: 65 }}
        style={{ width: "100%", height: "100%", background: "#1a1a1a" }}
      >
        <Suspense fallback={<Loader3D />}>
          <Salle3D
            chambre={chambre}
            oeuvres={oeuvresPubliees}
            onArtworkClick={handleArtworkClick}
            onArtworkHover={setHoveredArtwork}
          />
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            zoomSpeed={1.2}
            rotateSpeed={0.8}
            panSpeed={0.8}
            target={[0, 2.5, 0]}
            maxPolarAngle={Math.PI / 2.2}
            minDistance={3}
            maxDistance={20}
            makeDefault
          />
          <Environment preset="apartment" background={false} />
        </Suspense>
      </Canvas>

      {/* Loading overlay */}
      {loading && (
        <div className="g3d-loading-overlay">
          <div className="g3d-loading-card">
            <h2>{chambre.nom}</h2>
            <div className="g3d-loading-bar">
              <div className="g3d-loading-bar-fill" />
            </div>
            <p>Chargement de l'espace 3D...</p>
          </div>
        </div>
      )}
      
      {/* Header */}
      <div className="g3d-header">
        <div className="g3d-header-info">
          <span className="g3d-header-name">{chambre.nom}</span>
          <span className="g3d-header-decor">✦ {chambre.decor || "classique"}</span>
          <span className="g3d-header-stats">
            {oeuvresPubliees.length} œuvre{oeuvresPubliees.length > 1 ? "s" : ""}
          </span>
        </div>
        <button 
          className="g3d-quit-btn"
          onClick={() => navigate(mode === "artiste" ? "/mes-chambres" : "/user-page")}
        >
          ✕ Quitter
        </button>
      </div>
      
      {/* Panel latéral */}
      <div className={`g3d-panel ${panelOpen ? "g3d-panel--open" : "g3d-panel--closed"}`}>
        <button className="g3d-panel-toggle" onClick={() => setPanelOpen(!panelOpen)}>
          {panelOpen ? "›" : "‹"}
        </button>
        
        <div className="g3d-panel-header">
          <h3>Œuvres exposées</h3>
          <span className="g3d-panel-count">{oeuvresPubliees.length}</span>
        </div>
        
        <div className="g3d-panel-list">
          {oeuvresPubliees.length === 0 ? (
            <div className="g3d-panel-empty">
              <p>Aucune œuvre exposée</p>
              <small>Ajoutez des œuvres depuis votre espace artiste</small>
            </div>
          ) : (
            oeuvresPubliees.map((o, index) => (
              <div 
                key={`${o.id}-${index}`}
                className={`g3d-panel-item ${selectedArtwork?.id === o.id ? "active" : ""}`}
                onClick={() => handleArtworkClick(o)}
              >
                <img 
                  src={o.img} 
                  alt={o.titre} 
                  className="g3d-panel-thumb"
                  onError={e => { e.target.src = "https://picsum.photos/seed/fallback/60/60"; }}
                />
                <div className="g3d-panel-info">
                  <p className="g3d-panel-title">{o.titre}</p>
                  <p className="g3d-panel-price">{o.prix} DT</p>
                  <p className="g3d-panel-tech">{o.technique}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
      
      {/* Tooltip */}
      {hoveredArtwork && (
        <div className="g3d-tooltip" style={{ left: 20, bottom: 100 }}>
          <p className="g3d-tooltip-title">{hoveredArtwork.titre}</p>
          <p className="g3d-tooltip-price">{hoveredArtwork.prix} DT</p>
          <p className="g3d-tooltip-tech">{hoveredArtwork.technique}</p>
        </div>
      )}
      
      {/* Instructions */}
      <div className="g3d-instructions">
        <span>🖱️ Glisser = tourner</span>
        <span>🔍 Ctrl + glisser = zoom</span>
        <span>🎯 Clic sur une œuvre = détails</span>
      </div>
      
      {/* Mini-map */}
      <div className="g3d-minimap">
        <svg width="100" height="100" viewBox="0 0 100 100">
          <rect x="0" y="0" width="100" height="100" fill="rgba(0,0,0,0.6)" rx="8" />
          <rect x="10" y="10" width="80" height="60" fill="none" stroke="#C9A040" strokeWidth="1.5" />
          <text x="50" y="85" textAnchor="middle" fill="#C9A040" fontSize="8">Salle d'exposition</text>
          <circle cx="50" cy="40" r="3" fill="#C9A040" />
          {oeuvresPubliees.map((_, i) => (
            <circle key={`map-${i}`} cx={15 + (i % 4) * 18} cy={18 + Math.floor(i / 4) * 15} r="1.5" fill="#8B2020" />
          ))}
        </svg>
      </div>
      
      {/* Modal d'achat */}
      {showBuyModal && selectedArtwork && (
        <BuyModal oeuvre={selectedArtwork} onClose={() => setShowBuyModal(false)} />
      )}
    </div>
  );
}