import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Scene from "../components/3d/Scene";
import { MiniMapCanvas } from "../components/3d/MiniMap";
import { useGalleryStore } from "../store/useGalleryStore";
import "../styles/Galerie3D.css";

// ── Données mock pour tester SANS l'API Django ──────────────────────────────
const MOCK_ARTWORKS = [
  { id: 1, title: "Lumière d'Automne",  price: 450, image_url: "/images/galerie/g1.jpg", artist: "Van Gogh",   description: "Une exploration de la lumière automnale." },
  { id: 2, title: "Reflets Bleutés",    price: 280, image_url: "/images/galerie/g2.jpg", artist: "Monet",      description: "Jeu de reflets sur l'eau." },
  { id: 3, title: "Portail Doré",       price: 720, image_url: "/images/galerie/g3.jpg", artist: "Klimt",      description: "La magnificence dorée d'une entrée." },
  { id: 4, title: "Nuit Parisienne",    price: 190, image_url: "/images/galerie/g4.jpg", artist: "Picasso",    description: "Une nuit abstraite entre rêve et réalité." },
  { id: 5, title: "Aube Rosée",         price: 340, image_url: "/images/galerie/g5.jpg", artist: "Renoir",     description: "Les premières lueurs rosées de l'aube." },
  { id: 6, title: "Horizon Violet",     price: 560, image_url: "/images/galerie/g6.png", artist: "Kandinsky",  description: "Le violet de l'horizon au crépuscule." },
  { id: 7, title: "Tempête d'Or",       price: 820, image_url: "/images/galerie/g1.jpg", artist: "Turner",     description: "Une tempête déclinée en teintes or." },
  { id: 8, title: "Silence Blanc",      price: 310, image_url: "/images/galerie/g2.jpg", artist: "Malevich",   description: "La pureté du silence en blanc." },
];

// ── Panel info œuvre (s'affiche au clic) ─────────────────────────────────────
function ArtworkPanel({ artwork, onClose }) {
  if (!artwork) return null;
  return (
    <div className="g3d-panel" onClick={onClose}>
      <div className="g3d-panel__card" onClick={(e) => e.stopPropagation()}>
        <button className="g3d-panel__close" onClick={onClose}>✕</button>
        <img src={artwork.image_url} alt={artwork.title} className="g3d-panel__img" />
        <div className="g3d-panel__body">
          <p className="g3d-panel__artist">✦ {artwork.artist}</p>
          <h2 className="g3d-panel__title">{artwork.title}</h2>
          <p className="g3d-panel__desc">{artwork.description}</p>
          <div className="g3d-panel__footer">
            <span className="g3d-panel__price">{artwork.price} DT</span>
            <button className="g3d-panel__buy">Acheter cette œuvre</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── HUD — contrôles superposés ────────────────────────────────────────────────
function HUD({ onBack }) {
  const { navMode, isPlaying, setNavMode, togglePlay } = useGalleryStore();
  const isAuto = navMode === "auto";

  return (
    <div className="g3d-hud">
      {/* Bouton retour */}
      <button className="g3d-hud__back" onClick={onBack}>
        ← Quitter la galerie
      </button>

      {/* Contrôles navigation */}
      <div className="g3d-hud__controls">
        {/* Toggle Auto / Manuel */}
        <button
          className={`g3d-hud__btn ${isAuto ? "g3d-hud__btn--active" : ""}`}
          onClick={() => setNavMode("auto")}
          title="Mode cinématique automatique"
        >
          ▶ Auto
        </button>
        <button
          className={`g3d-hud__btn ${!isAuto ? "g3d-hud__btn--active" : ""}`}
          onClick={() => setNavMode("manual")}
          title="Mode manuel WASD"
        >
          🕹 Manuel
        </button>

        {/* Play / Pause (mode auto seulement) */}
        {isAuto && (
          <button className="g3d-hud__btn g3d-hud__btn--play" onClick={togglePlay}>
            {isPlaying ? "⏸ Pause" : "▶ Play"}
          </button>
        )}
      </div>

      {/* Aide clavier */}
      <div className="g3d-hud__help">
        {isAuto
          ? "Tab → mode manuel  •  Espace → pause"
          : "WASD → avancer  •  Souris → regarder  •  Tab → mode auto  •  Esc → quitter"}
      </div>
    </div>
  );
}

// ── Page principale ───────────────────────────────────────────────────────────
export default function Galerie3D() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artworks, setArtworks] = useState(MOCK_ARTWORKS);
  const [loading, setLoading] = useState(false);
  const [galleryType, setGalleryType] = useState(1);

  const { selectedArtwork, setSelectedArtwork, clearSelectedArtwork } = useGalleryStore();

  // ── Fetch réel depuis Django (décommente quand le back est prêt) ──
  /*
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/galleries/${id}/artworks/`)
      .then(r => r.json())
      .then(data => {
        setArtworks(data.artworks);
        setGalleryType(data.gallery.room_type); // 1 | 2 | 3
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);
  */

  if (loading) {
    return (
      <div className="g3d-loading">
        <div className="g3d-loading__spinner" />
        <p>Chargement de la galerie…</p>
      </div>
    );
  }

  return (
    <div className="g3d-root">
      {/* Canvas Three.js — plein écran */}
      <Scene
        galleryType={galleryType}
        artworks={artworks}
        onArtworkClick={setSelectedArtwork}
      />

      {/* Mini-map canvas HTML (overlay) */}
      <MiniMapCanvas />

      {/* HUD contrôles */}
      <HUD onBack={() => navigate(-1)} />

      {/* Panel info œuvre */}
      <ArtworkPanel
        artwork={selectedArtwork}
        onClose={clearSelectedArtwork}
      />
    </div>
  );
}