import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Meschambres.css";

// ─── Shared State (in production: use Context/Redux/Zustand) ──────────────────
// MesChambers reads the same oeuvres data. In real app, both pages share
// the same store. For demo, we replicate the same initial data.

const ARTIST = {
  name: "Ariana Soghra",
  avatar: "https://i.pravatar.cc/80?img=47",
  abonnement: "Premium",
  depuis: "Janvier 2024",
};

const OEUVRES_DATA = [
  {
    id: "o1", galerieId: "g1", galerieName: "Galerie Impressionniste",
    titre: "Lumière d'Automne",
    description: "Une exploration de la lumière automnale à travers des touches impressionnistes délicates.",
    prix: 450, dateRealisation: "2024-09-15", technique: "Huile sur toile",
    dimensions: "80 × 60 cm", statut: "Publié", nbExemplaires: 1,
    tags: ["Impressionnisme", "Automne", "Lumière"],
    img: "/images/galerie/g1.jpg",
  },
  {
    id: "o2", galerieId: "g1", galerieName: "Galerie Impressionniste",
    titre: "Reflets Bleutés",
    description: "Jeu de reflets sur l'eau au coucher du soleil, inspiré des étangs normands.",
    prix: 280, dateRealisation: "2024-07-20", technique: "Aquarelle",
    dimensions: "50 × 40 cm", statut: "Publié", nbExemplaires: 3,
    tags: ["Aquarelle", "Eau", "Coucher de soleil"],
    img: "/images/galerie/g2.jpg",
  },
  {
    id: "o3", galerieId: "g2", galerieName: "Lumières de Paris",
    titre: "Portail Doré",
    description: "La magnificence dorée d'une entrée parisienne, capturée dans ses moindres détails ornementaux.",
    prix: 720, dateRealisation: "2024-11-03", technique: "Peinture acrylique",
    dimensions: "100 × 80 cm", statut: "Publié", nbExemplaires: 1,
    tags: ["Paris", "Architecture", "Or"],
    img: "/images/galerie/g3.jpg",
  },
  {
    id: "o4", galerieId: "g3", galerieName: "Abstraction Pure",
    titre: "Nuit Parisienne",
    description: "Une nuit parisienne abstraite, entre rêve et réalité, dans des tons profonds de bleu et violet.",
    prix: 190, dateRealisation: "2024-05-12", technique: "Pastel",
    dimensions: "40 × 30 cm", statut: "Brouillon", nbExemplaires: 5,
    tags: ["Nuit", "Abstrait", "Paris"],
    img: "/images/galerie/g4.jpg",
  },
  {
    id: "o5", galerieId: "g2", galerieName: "Lumières de Paris",
    titre: "Aube Rosée",
    description: "Les premières lueurs rosées de l'aube sur les toits de la ville endormie.",
    prix: 340, dateRealisation: "2024-08-28", technique: "Huile sur toile",
    dimensions: "70 × 55 cm", statut: "Vendu", nbExemplaires: 1,
    tags: ["Aube", "Lumière", "Toits"],
    img: "/images/galerie/g5.jpg",
  },
  {
    id: "o6", galerieId: "g1", galerieName: "Galerie Impressionniste",
    titre: "Horizon Violet",
    description: "Le violet profond de l'horizon au crépuscule, entre ciel et terre.",
    prix: 560, dateRealisation: "2025-01-10", technique: "Huile sur toile",
    dimensions: "90 × 70 cm", statut: "Publié", nbExemplaires: 1,
    tags: ["Horizon", "Crépuscule", "Violet"],
    img: "/images/galerie/g6.png",
  },
  {
    id: "o7", galerieId: "g2", galerieName: "Lumières de Paris",
    titre: "Tempête d'Or",
    description: "Une tempête abstraite déclinée dans des teintes or et ambre, puissance et beauté.",
    prix: 820, dateRealisation: "2025-02-14", technique: "Acrylique",
    dimensions: "120 × 90 cm", statut: "Publié", nbExemplaires: 1,
    tags: ["Abstrait", "Or", "Puissance"],
    img: "/images/galerie/g1.jpg",
  },
];

const CHAMBRES_DATA = [
  {
    id: "g1",
    nom: "Galerie Impressionniste",
    description: "Votre espace principal dédié aux œuvres lumineuses et aux jeux de lumière impressionnistes.",
    decor: "Classique",
    surface: "20 × 30 m",
    dateCreation: "2024-01-15",
    prixEntree: 5,
    dureeAcces: "48h",
    nbVisiteursTotal: 1240,
    revenus: 6200,
    headerVariant: "burg",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  },
  {
    id: "g2",
    nom: "Lumières de Paris",
    description: "Une galerie élégante aux accents dorés, idéale pour vos peintures architecturales et urbaines.",
    decor: "Baroque",
    surface: "15 × 25 m",
    dateCreation: "2024-06-08",
    prixEntree: 7,
    dureeAcces: "72h",
    nbVisiteursTotal: 890,
    revenus: 6230,
    headerVariant: "gold",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>,
  },
  {
    id: "g3",
    nom: "Abstraction Pure",
    description: "Espace contemporain épuré pour vos créations abstraites et expérimentales.",
    decor: "Moderne",
    surface: "18 × 22 m",
    dateCreation: "2025-01-20",
    prixEntree: 4,
    dureeAcces: "24h",
    nbVisiteursTotal: 340,
    revenus: 1360,
    headerVariant: "green",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  },
];

const NAV_ITEMS = [
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: "Dashboard", id: "dashboard", path: "/dashboard-artiste" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="16" rx="2"/><path d="M8 21h8M12 17v4"/></svg>, label: "Mes Œuvres", id: "oeuvres", path: "/mes-oeuvres" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: "Mes Chambres", id: "chambre", path: "/mes-chambres" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>, label: "Statistiques", id: "stats", path: "/dashboard-artiste" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>, label: "Assistant IA", id: "ia", path: "/dashboard-artiste" },
  { icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>, label: "Paramètres", id: "settings", path: "/dashboard-artiste" },
];

// ─── Custom Scrollbar ──────────────────────────────────────────────────────────

function CustomScrollbar() {
  const thumbRef = useRef(null);
  const isDrag = useRef(false); const dragY = useRef(0); const scrollY0 = useRef(0);
  useEffect(() => {
    const update = () => {
      const t = thumbRef.current; if (!t) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const ratio = clientHeight / scrollHeight;
      const h = Math.max(ratio * 100, 8);
      const top = scrollHeight > clientHeight ? (scrollTop / (scrollHeight - clientHeight)) * (100 - h) : 0;
      t.style.height = `${h}vh`; t.style.top = `${top}vh`;
    };
    window.addEventListener("scroll", update, { passive: true }); window.addEventListener("resize", update); update();
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);
  const onMouseDown = (e) => {
    isDrag.current = true; dragY.current = e.clientY; scrollY0.current = window.scrollY;
    const onMove = (ev) => { if (!isDrag.current) return; const { scrollHeight, clientHeight } = document.documentElement; window.scrollTo(0, scrollY0.current + ((ev.clientY - dragY.current) / clientHeight) * scrollHeight); };
    const onUp = () => { isDrag.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
  };
  return <div className="mc-csb-track"><div className="mc-csb-thumb" ref={thumbRef} onMouseDown={onMouseDown} /></div>;
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="mc-sidebar">
      <div className="mc-sidebar__logo">
        <img src="/images/logo_artivision.png" alt="Artivision" className="mc-sidebar__logo-img"
          onError={e => { e.target.style.display = "none"; }} />
      </div>
      <div className="mc-sidebar__artist">
        <img src={ARTIST.avatar} alt={ARTIST.name} className="mc-sidebar__avatar"
          onError={e => { e.target.src = "https://i.pravatar.cc/80?img=47"; }} />
        <div>
          <p className="mc-sidebar__name">{ARTIST.name}</p>
          <p className="mc-sidebar__role">Artiste • {ARTIST.abonnement}</p>
        </div>
      </div>
      <nav className="mc-sidebar__nav">
        {NAV_ITEMS.map(item => (
          <button key={item.id}
            className={`mc-nav-item ${item.id === "chambre" ? "mc-nav-item--active" : ""}`}
            onClick={() => navigate(item.path)}>
            <span className="mc-nav-icon">{item.icon}</span>
            <span className="mc-nav-label">{item.label}</span>
            {item.id === "chambre" && <span className="mc-nav-indicator" />}
          </button>
        ))}
      </nav>
      <div className="mc-sidebar__footer">
        <span className="mc-badge">{ARTIST.abonnement}</span>
        <p className="mc-sidebar__since">Depuis {ARTIST.depuis}</p>
      </div>
    </aside>
  );
}

// ─── Oeuvre Detail Drawer ──────────────────────────────────────────────────────

function OeuvreDetailPanel({ oeuvre, onClose, onNavigateToEdit }) {
  if (!oeuvre) return null;
  return (
    <div className="mc-detail-panel">
      <div className="mc-detail-panel__backdrop" onClick={onClose} />
      <div className="mc-detail-panel__drawer">
        <div className="mc-detail-panel__head">
          <div>
            <h2 className="mc-detail-panel__title">Détails de l'œuvre</h2>
          </div>
          <button className="mc-detail-panel__close" onClick={onClose}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <img src={oeuvre.img} alt={oeuvre.titre} className="mc-detail-panel__img"
          onError={e => { e.target.src = "https://picsum.photos/440/240?random=99"; }} />

        <div className="mc-detail-panel__body">
          <span className="mc-detail-panel__galerie">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline", marginRight: "4px" }}><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>
            {oeuvre.galerieName}
          </span>
          <h3 className="mc-detail-panel__name">{oeuvre.titre}</h3>
          <p className="mc-detail-panel__desc">"{oeuvre.description}"</p>

          <div className="mc-detail-panel__info-grid">
            <div className="mc-detail-panel__info">
              <p className="mc-detail-panel__info-lbl">Technique</p>
              <p className="mc-detail-panel__info-val">{oeuvre.technique}</p>
            </div>
            <div className="mc-detail-panel__info">
              <p className="mc-detail-panel__info-lbl">Dimensions</p>
              <p className="mc-detail-panel__info-val">{oeuvre.dimensions || "Non renseigné"}</p>
            </div>
            <div className="mc-detail-panel__info">
              <p className="mc-detail-panel__info-lbl">Date de réalisation</p>
              <p className="mc-detail-panel__info-val">
                {new Date(oeuvre.dateRealisation).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
              </p>
            </div>
            <div className="mc-detail-panel__info">
              <p className="mc-detail-panel__info-lbl">Exemplaires</p>
              <p className="mc-detail-panel__info-val">{oeuvre.nbExemplaires} ex.</p>
            </div>
            <div className="mc-detail-panel__info">
              <p className="mc-detail-panel__info-lbl">Statut</p>
              <p className="mc-detail-panel__info-val"
                style={{ color: oeuvre.statut === "Publié" ? "#3A6B35" : oeuvre.statut === "Vendu" ? "#2C4A8B" : "#C9A040" }}>
                {oeuvre.statut}
              </p>
            </div>
          </div>

          <span className="mc-detail-panel__price">{oeuvre.prix} DT</span>

          {oeuvre.tags?.length > 0 && (
            <div className="mc-detail-panel__tags">
              {oeuvre.tags.map(t => <span key={t} className="mc-detail-panel__tag">{t}</span>)}
            </div>
          )}

          <div className="mc-detail-panel__actions">
            <button className="mc-btn mc-btn--primary" style={{ flex: 1 }}
              onClick={() => onNavigateToEdit(oeuvre)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "6px" }}><path d="M17 3l4 4-7 7H10v-4l7-7z"/><path d="M4 20h16"/></svg>
              Modifier l'œuvre
            </button>
            <button className="mc-btn mc-btn--ghost" onClick={onClose}>Fermer</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Chambre Card ─────────────────────────────────────────────────────────────

function ChambresCard({ chambre, oeuvres, onOeuvreClick, onDeleteChambre, onAddOeuvre }) {
  const MAX_DISPLAY = 5;
  const rest = oeuvres.length - MAX_DISPLAY;

  const totalRevenues = chambre.revenus;
  const published = oeuvres.filter(o => o.statut === "Publié").length;

  return (
    <div className="mc-chambre-card">
      {/* Dark header */}
      <div className={`mc-chambre-card__header mc-chambre-card__header--${chambre.headerVariant}`}>
        <div className="mc-chambre-card__header-inner">
          <div className="mc-chambre-card__header-top">
            <div className="mc-chambre-card__icon-wrap">{chambre.icon}</div>
            <div className="mc-chambre-card__actions-head">
              <button className="mc-chambre-card__act-btn" title="Modifier la chambre">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 3l4 4-7 7H10v-4l7-7z"/><path d="M4 20h16"/></svg>
              </button>
              <button className="mc-chambre-card__act-btn mc-chambre-card__act-btn--del"
                title="Supprimer la chambre" onClick={() => onDeleteChambre(chambre)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
              </button>
            </div>
          </div>

          <h3 className="mc-chambre-card__name">{chambre.nom}</h3>
          <p className="mc-chambre-card__desc">{chambre.description}</p>

          <div className="mc-chambre-card__stats-row">
            <div className="mc-chambre-card__stat">
              <span className="mc-chambre-card__stat-val">{oeuvres.length}</span>
              <span className="mc-chambre-card__stat-lbl">Œuvres</span>
            </div>
            <div className="mc-chambre-card__stat">
              <span className="mc-chambre-card__stat-val">{chambre.nbVisiteursTotal.toLocaleString()}</span>
              <span className="mc-chambre-card__stat-lbl">Visiteurs</span>
            </div>
            <div className="mc-chambre-card__stat">
              <span className="mc-chambre-card__stat-val">{totalRevenues.toLocaleString()}</span>
              <span className="mc-chambre-card__stat-lbl">Revenus DT</span>
            </div>
            <div className="mc-chambre-card__stat">
              <span className="mc-chambre-card__stat-val">{chambre.prixEntree} DT</span>
              <span className="mc-chambre-card__stat-lbl">Entrée</span>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mc-chambre-card__body">
        <p className="mc-oeuvres-section-title">
          Œuvres exposées
          <span className="mc-oeuvres-section-title__count">
            {published} publiées · {oeuvres.length} total
          </span>
        </p>

        {oeuvres.length === 0 ? (
          <div className="mc-oeuvres-empty">
            <span className="mc-oeuvres-empty__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="16" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
            </span>
            <p className="mc-oeuvres-empty__text">Aucune œuvre dans cette galerie.</p>
            <button className="mc-btn mc-btn--primary" style={{ padding: "9px 20px", fontSize: 13 }}
              onClick={onAddOeuvre}>
              + Ajouter une œuvre
            </button>
          </div>
        ) : (
          <div className="mc-oeuvres-mini-grid">
            {oeuvres.slice(0, MAX_DISPLAY).map((o, i) => (
              <div key={o.id} className="mc-oeuvre-mini" style={{ animationDelay: `${i * 0.06}s` }}
                onClick={() => onOeuvreClick(o)}>
                <img src={o.img} alt={o.titre} className="mc-oeuvre-mini__img"
                  onError={e => { e.target.src = `https://picsum.photos/120/120?random=${i + 10}`; }} />
                <div className="mc-oeuvre-mini__overlay">
                  <p className="mc-oeuvre-mini__title">{o.titre}</p>
                </div>
                <div className={`mc-oeuvre-mini__status mc-oeuvre-mini__status--${o.statut.toLowerCase()}`} />
              </div>
            ))}
            {rest > 0 && (
              <div className="mc-oeuvres-more" onClick={onAddOeuvre}>
                <span className="mc-oeuvres-more__num">+{rest}</span>
                <span className="mc-oeuvres-more__label">autres</span>
              </div>
            )}
          </div>
        )}

        <div className="mc-chambre-card__footer">
          <span className="mc-chambre-card__meta">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline", marginRight: "4px" }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            Créée le {new Date(chambre.dateCreation).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
            &nbsp;· {chambre.decor} · {chambre.surface}
          </span>
          <a href={`/galerie/${chambre.id}`} className="mc-chambre-card__cta">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline", marginRight: "6px" }}><path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Visiter la galerie
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function MesChambres() {
  const navigate = useNavigate();

  // In production: import oeuvres from shared context/store
  // Here: local state mirroring MesOeuvres data
  const [oeuvres] = useState(OEUVRES_DATA);
  const [chambres, setChambres] = useState(CHAMBRES_DATA);
  const [selectedOeuvre, setSelectedOeuvre] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ msg: "", show: false });

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  };

  const handleDeleteChambre = (chambre) => setDeleteTarget(chambre);

  const confirmDelete = () => {
    setChambres(prev => prev.filter(c => c.id !== deleteTarget.id));
    setDeleteTarget(null);
    showToast("✓ Galerie supprimée");
  };

  const handleNavigateToEdit = (oeuvre) => {
    setSelectedOeuvre(null);
    // Navigate to MesOeuvres and open edit modal for this oeuvre
    navigate("/mes-oeuvres", { state: { editOeuvreId: oeuvre.id } });
  };

  const getOeuvresForChambre = (galerieId) =>
    oeuvres.filter(o => o.galerieId === galerieId);

  const totalOeuvres = oeuvres.length;
  const totalVisiteurs = chambres.reduce((s, c) => s + c.nbVisiteursTotal, 0);
  const totalRevenus = chambres.reduce((s, c) => s + c.revenus, 0);
  const totalPubliees = oeuvres.filter(o => o.statut === "Publié").length;

  const kpis = [
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>, label: "Mes galeries", val: chambres.length, color: "#8B2020" },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="2" y="3" width="20" height="16" rx="2"/><path d="M8 21h8M12 17v4"/></svg>, label: "Œuvres exposées", val: totalOeuvres, color: "#C9A040" },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>, label: "Total visiteurs", val: totalVisiteurs.toLocaleString(), color: "#2C4A8B" },
    { icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>, label: "Revenus totaux", val: `${totalRevenus.toLocaleString()} DT`, color: "#3A6B35" },
  ];

  return (
    <div className="mc-root">
      <Sidebar />

      <main className="mc-main">

        {/* Header */}
        <div className="mc-header">
          <div>
            <span className="mc-header__eyebrow">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline", marginRight: "6px" }}><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"/></svg>
              Espace Artiste
            </span>
            <h1 className="mc-header__title">Mes Chambres</h1>
            <p className="mc-header__sub">
              Vos galeries virtuelles et les œuvres qui y sont exposées
            </p>
          </div>
          <div className="mc-header__actions">
            <button className="mc-btn mc-btn--ghost" onClick={() => navigate("/mes-oeuvres")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "6px" }}><rect x="2" y="3" width="20" height="16" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
              Gérer les œuvres
            </button>
            <button className="mc-btn mc-btn--primary" onClick={() => navigate("/ajouter-galerie")}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: "6px" }}><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Nouvelle galerie
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mc-kpis">
          {kpis.map((k, i) => (
            <div key={i} className="mc-kpi">
              <span className="mc-kpi__icon">{k.icon}</span>
              <p className="mc-kpi__val" style={{ color: k.color }}>{k.val}</p>
              <p className="mc-kpi__lbl">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Chambres Grid */}
        {chambres.length === 0 ? (
          <div className="mc-empty">
            <span className="mc-empty__icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </span>
            <h2 className="mc-empty__title">Aucune galerie créée</h2>
            <p className="mc-empty__sub">Créez votre première galerie pour commencer à exposer vos œuvres.</p>
            <button className="mc-btn mc-btn--primary" onClick={() => navigate("/ajouter-galerie")}>
              + Créer ma première galerie
            </button>
          </div>
        ) : (
          <div className="mc-chambres-grid">
            {chambres.map((c, idx) => (
              <div key={c.id} style={{ animationDelay: `${idx * 0.08}s` }}>
                <ChambresCard
                  chambre={c}
                  oeuvres={getOeuvresForChambre(c.id)}
                  onOeuvreClick={setSelectedOeuvre}
                  onDeleteChambre={handleDeleteChambre}
                  onAddOeuvre={() => navigate("/mes-oeuvres")}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Oeuvre Detail Drawer */}
      {selectedOeuvre && (
        <OeuvreDetailPanel
          oeuvre={selectedOeuvre}
          onClose={() => setSelectedOeuvre(null)}
          onNavigateToEdit={handleNavigateToEdit}
        />
      )}

      {/* Delete Confirm */}
      {deleteTarget && (
        <div className="mc-confirm-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="mc-confirm" onClick={e => e.stopPropagation()}>
            <span className="mc-confirm__icon">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"><path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </span>
            <h2 className="mc-confirm__title">Supprimer cette galerie ?</h2>
            <p className="mc-confirm__sub">
              La galerie <strong>"{deleteTarget.nom}"</strong> et toutes ses configurations
              seront supprimées. Les œuvres resteront dans votre catalogue.
              Cette action est irréversible.
            </p>
            <div className="mc-confirm__actions">
              <button className="mc-btn mc-btn--ghost" onClick={() => setDeleteTarget(null)}>Annuler</button>
              <button className="mc-btn mc-btn--danger" onClick={confirmDelete}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      <div className={`mc-toast ${toast.show ? "mc-toast--show" : ""}`}>{toast.msg}</div>
      <CustomScrollbar />
    </div>
  );
}