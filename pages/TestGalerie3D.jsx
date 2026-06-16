// src/pages/TestGalerie3D.jsx
import { useState, Suspense, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { Environment, Html, PerspectiveCamera } from "@react-three/drei";
import Salle3D from "../components/3d/Salle3D";
import Navigation from "../components/3d/Navigation";
import AvatarController from "../components/3d/AvatarController";
import { MiniMapCanvas, MiniMapRenderer } from "../components/3d/MiniMap";
import { useGalleryStore } from "../store/useGalleryStore";
import "../styles/TestGalerie3D.css";

// URLs d'images de démonstration
const DEMO_IMAGES = [
  "https://picsum.photos/id/104/600/450", // Paysage
  "https://picsum.photos/id/165/600/450", // Nature
  "https://picsum.photos/id/37/600/450", // Chemin forestier
  "https://picsum.photos/id/96/600/450", // Montagne
];
// Données de démonstration
const DEMO_GALLERY = {
  id: "demo",
  nom: "Galerie Découverte",
  subscription_type: "galerie",
  description: "Visitez gratuitement cette galerie d'exposition"
};

const DEMO_ARTWORKS = [
  {
    id: 1,
    titre: "Lumière d'Automne",
    description: "Une œuvre captivante qui capture la beauté éphémère de l'automne.",
    prix: 450,
    technique: "Huile sur toile",
    dimensions: "80 × 60 cm",
    date_realisation: "2024-09-15",
    statut: "Publié",
    img: DEMO_IMAGES[0],
    galerie: "demo",
    galerieName: "Galerie Découverte",
    isNew: true,
    display_width: 1.2,
    display_height: 0.9
  },
  {
    id: 2,
    titre: "Rêverie Nocturne",
    description: "Une ambiance sereine et mystérieuse qui invite à la contemplation.",
    prix: 380,
    technique: "Aquarelle",
    dimensions: "50 × 70 cm",
    date_realisation: "2024-08-20",
    statut: "Publié",
    img: DEMO_IMAGES[1],
    galerie: "demo",
    galerieName: "Galerie Découverte",
    isNew: false,
    display_width: 1.2,
    display_height: 0.9
  },
  {
    id: 3,
    titre: "Jardin Secret",
    description: "Un jardin imaginaire où la nature et l'art se rencontrent.",
    prix: 520,
    technique: "Acrylique",
    dimensions: "100 × 80 cm",
    date_realisation: "2024-10-01",
    statut: "Publié",
    img: DEMO_IMAGES[2],
    galerie: "demo",
    galerieName: "Galerie Découverte",
    isNew: true,
    display_width: 1.2,
    display_height: 0.9
  },
  {
    id: 4,
    titre: "Méditerranée",
    description: "Les couleurs et la lumière de la Méditerranée capturées.",
    prix: 290,
    technique: "Pastel",
    dimensions: "40 × 60 cm",
    date_realisation: "2024-07-12",
    statut: "Publié",
    img: DEMO_IMAGES[3],
    galerie: "demo",
    galerieName: "Galerie Découverte",
    isNew: false,
    display_width: 1.2,
    display_height: 0.9
    },
];

// Loader
function Loader3D({ message = "Chargement de la galerie de démonstration..." }) {
  return (
    <Html center>
      <div className="test-loader">
        <div className="test-loader__spinner"></div>
        <p className="test-loader__text">{message}</p>
      </div>
    </Html>
  );
}

// Modal info œuvre
function ArtworkInfoModal({ oeuvre, onClose, onBuy }) {
  return (
    <div className="test-modal-overlay" onClick={onClose}>
      <div className="test-modal" onClick={e => e.stopPropagation()}>
        <button className="test-modal__close" onClick={onClose}>✕</button>
        <div className="test-modal__content">
          <div className="test-modal__img-wrap">
            <img src={oeuvre.img} alt={oeuvre.titre} className="test-modal__img" />
            <div className="test-modal__badge"> Œuvre démo</div>
          </div>
          <div className="test-modal__info">
            <p className="test-modal__technique">{oeuvre.technique}</p>
            <h2 className="test-modal__title">{oeuvre.titre}</h2>
            <p className="test-modal__desc">{oeuvre.description}</p>
            <div className="test-modal__details">
              <div className="test-modal__detail">
                <span>Dimensions</span>
                <strong>{oeuvre.dimensions}</strong>
              </div>
              <div className="test-modal__detail">
                <span>Année</span>
                <strong>{new Date(oeuvre.date_realisation).getFullYear()}</strong>
              </div>
            </div>
            <div className="test-modal__footer">
              <div className="test-modal__price">{oeuvre.prix} DT</div>
              <button className="test-modal__btn" onClick={() => { onClose(); onBuy(oeuvre); }}>
                💎 Acquérir
              </button>
            </div>
            <p className="test-modal__demo-note">
              ✨ Cette œuvre fait partie de la collection démo. Connectez-vous pour acheter !
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestGalerie3D() {
  const navigate = useNavigate();
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [panelOpen, setPanelOpen] = useState(true); // État du panneau latéral
  const [showControls, setShowControls] = useState(true);
  
  // Utiliser le store pour le mode de navigation
  const { navMode, setNavMode } = useGalleryStore();

  const handleArtworkClick = (oeuvre) => {
    setSelectedArtwork(oeuvre);
    setShowInfoModal(true);
  };

  const handleBuyClick = (oeuvre) => {
    alert(` Pour acheter "${oeuvre.titre}", veuillez vous connecter ou créer un compte !`);
  };

  // Basculer l'affichage du panneau
  const togglePanel = () => {
    setPanelOpen(!panelOpen);
  };

  // Basculer entre mode auto et manuel
  const toggleNavMode = () => {
    setNavMode(navMode === "auto" ? "manual" : "auto");
    setShowControls(true);
    setTimeout(() => setShowControls(false), 3000);
  };

  // Cacher les contrôles après 5 secondes
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="test-container">
      {/* Canvas 3D */}
      <Canvas
        shadows
        camera={{ position: [0, 1.7, 9], fov: 72 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={<Loader3D />}>
          <PerspectiveCamera makeDefault position={[0, 1.7, 9]} fov={72} />
          <Environment preset="apartment" background={false} environmentIntensity={0.4} />

          <Salle3D
            chambre={DEMO_GALLERY}
            oeuvres={DEMO_ARTWORKS}
            onArtworkClick={handleArtworkClick}
            selectedArtworkId={selectedArtwork?.id}
          />

          <Navigation artworks={DEMO_ARTWORKS} onNavigateToArtwork={handleArtworkClick} />
          
          <AvatarController 
            artworks={DEMO_ARTWORKS} 
            onArtworkGuide={() => {}} 
            onOpenChat={() => {}} 
          />
          
          <MiniMapRenderer />
        </Suspense>
      </Canvas>

      <MiniMapCanvas />

      {/* Header Trailer */}
      <div className="test-header">
        <div className="test-header__logo">
          <span className="test-header__logo-icon"></span>
          <span className="test-header__logo-text">ARTIVISION</span>
          <span className="test-header__badge">FREE TRAILER</span>
        </div>
        
        {/* Bouton pour cacher/afficher le panneau */}
        <button 
          className="test-header__panel-btn"
          onClick={togglePanel}
          title={panelOpen ? "Masquer le catalogue" : "Afficher le catalogue"}
        >
          {panelOpen ? " Masquer" : " Catalogue"}
        </button>
        
        {/* Bouton mode */}
        <button 
          className="test-header__mode-btn"
          onClick={toggleNavMode}
          title={navMode === "auto" ? "Passer en mode manuel (WASD)" : "Passer en mode automatique"}
        >
          {navMode === "auto" ? " Auto" : " Manuel"}
        </button>
        
        <div className="test-header__timer">
          <span className="test-header__timer-icon">⏱</span>
          <span>Visite gratuite - 30 min</span>
        </div>
        <button className="test-header__close" onClick={() => navigate("/")}>
          ✕ Quitter
        </button>
      </div>

      {/* Panneau latéral - avec condition d'affichage */}
      <div className={`test-panel ${panelOpen ? "test-panel--open" : "test-panel--closed"}`}>
        <div className="test-panel__header">
          <h3 className="test-panel__title"> Collection Découverte</h3>
          <button className="test-panel__close-btn" onClick={togglePanel} title="Fermer">
            ✕
          </button>
        </div>
        <div className="test-panel__content">
          <p className="test-panel__subtitle">5 œuvres à découvrir</p>
          <div className="test-artworks-list">
            {DEMO_ARTWORKS.map((artwork, idx) => (
              <div key={artwork.id} className="test-artwork-item" onClick={() => handleArtworkClick(artwork)}>
                <div className="test-artwork-item__rank">{idx + 1}</div>
                <div className="test-artwork-item__img">
                  <img src={artwork.img} alt={artwork.titre} />
                </div>
                <div className="test-artwork-item__info">
                  <p className="test-artwork-item__title">{artwork.titre}</p>
                  <p className="test-artwork-item__price">{artwork.prix} DT</p>
                </div>
                <button className="test-artwork-item__buy" onClick={(e) => { e.stopPropagation(); handleBuyClick(artwork); }}>
                  ⊕
                </button>
              </div>
            ))}
          </div>
          <div className="test-panel__footer">
            <button className="test-panel__btn" onClick={() => navigate("/inscription-artiste")}>
               Devenir artiste
            </button>
            <button className="test-panel__btn test-panel__btn--secondary" onClick={() => navigate("/login")}>
               Se connecter
            </button>
          </div>
        </div>
      </div>

      {/* Bouton flottant pour rouvrir le panneau quand il est fermé */}
      {!panelOpen && (
        <button className="test-panel-reopen" onClick={togglePanel} title="Ouvrir le catalogue">
          <span className="test-panel-reopen__icon"></span>
          <span className="test-panel-reopen__text">Catalogue</span>
        </button>
      )}

      {/* Contrôles manuels */}
      {showControls && navMode === "manual" && (
        <div className="test-controls">
          <div className="test-controls__group">
            <div className="test-controls__key">W</div>
            <div className="test-controls__key">A</div>
            <div className="test-controls__key">S</div>
            <div className="test-controls__key">D</div>
            <span className="test-controls__label">Déplacement</span>
          </div>
          <div className="test-controls__group">
            <div className="test-controls__key"></div>
            <span className="test-controls__label">Regarder</span>
          </div>
          <div className="test-controls__group">
            <div className="test-controls__key"></div>
            <span className="test-controls__label">Interagir</span>
          </div>
        </div>
      )}

      {/* Indicateur de mode */}
      <div className="test-mode-indicator">
        {navMode === "manual" ? (
          <span className="test-mode-indicator__manual"> Mode manuel actif - Utilisez WASD pour vous déplacer</span>
        ) : (
          <span className="test-mode-indicator__auto"> Mode automatique - Cliquez sur une œuvre pour la visiter</span>
        )}
      </div>

      {/* Modal info */}
      {showInfoModal && selectedArtwork && (
        <ArtworkInfoModal
          oeuvre={selectedArtwork}
          onClose={() => setShowInfoModal(false)}
          onBuy={handleBuyClick}
        />
      )}
    </div>
  );
}