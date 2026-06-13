// Ajouter Icons au début du fichier (après les imports)
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";  // ← AJOUTER useLocation

import { useArtisteStore } from "../../store/useArtisteStore";
import "../../styles/Meschambres.css";

// ========== AJOUTER LES ICÔNES (copiées de DashboardArtiste) ==========
const Icons = {
  museLogo: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z" fill="currentColor"/>
    </svg>
  ),
  dashboardIcon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  ),
  artworksIcon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V21" />
    </svg>
  ),
  gallery: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9L12 15L21 9L12 3L3 9Z" />
      <path d="M5 12V18L12 22L19 18V12" />
    </svg>
  ),
  commande: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10C16 12.2 14.2 14 12 14C9.8 14 8 12.2 8 10" />
    </svg>
  ),
  payment: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="5" width="20" height="14" rx="2" />
      <line x1="2" y1="10" x2="22" y2="10" />
      <circle cx="18" cy="16" r="1" fill="currentColor" />
    </svg>
  ),
  ai: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2L15.5 9.5L23 11L17 16.5L18.5 24L12 20L5.5 24L7 16.5L1 11L8.5 9.5L12 2Z" />
    </svg>
  ),
  settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15C19.2 15.6 18.9 16.2 18.5 16.7L19.5 18.3L18.3 19.5L16.7 18.5C16.2 18.9 15.6 19.2 15 19.4L14.5 21H9.5L9 19.4C8.4 19.2 7.8 18.9 7.3 18.5L5.7 19.5L4.5 18.3L5.5 16.7C5.1 16.2 4.8 15.6 4.6 15L3 14.5V9.5L4.6 9C4.8 8.4 5.1 7.8 5.5 7.3L4.5 5.7L5.7 4.5L7.3 5.5C7.8 5.1 8.4 4.8 9 4.6L9.5 3H14.5L15 4.6C15.6 4.8 16.2 5.1 16.7 5.5L18.3 4.5L19.5 5.7L18.5 7.3C18.9 7.8 19.2 8.4 19.4 9L21 9.5V14.5L19.4 15Z" />
    </svg>
  ),
};
const navItems = [
  { icon: "dashboardIcon", label: "Dashboard", id: "dashboard", path: "/dashboard-artiste" },
  { icon: "artworksIcon", label: "Mes Œuvres", id: "oeuvres", path: "/mes-oeuvres" },
  { icon: "gallery", label: "Mes Galeries", id: "chambre", path: "/mes-chambres" },
  { icon: "commande", label: "Commandes", id: "commandes", path: "/commandes" },
  { icon: "payment", label: "Mes Paiements", id: "paiements", path: "/mes-paiements" },
  { icon: "ai", label: "Assistant IA", id: "ia", path: null },
  { icon: "settings", label: "Paramètres", id: "settings", path: null },
];;

// ─── Custom Scrollbar ──────────────────────────────────────────────────────────
function CustomScrollbar() {
  const thumbRef = useRef(null);
  const isDrag = useRef(false); 
  const dragY = useRef(0); 
  const scrollY0 = useRef(0);
  
  useEffect(() => {
    const update = () => {
      const t = thumbRef.current; 
      if (!t) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const ratio = clientHeight / scrollHeight;
      const h = Math.max(ratio * 100, 8);
      const top = scrollHeight > clientHeight ? (scrollTop / (scrollHeight - clientHeight)) * (100 - h) : 0;
      t.style.height = `${h}vh`; 
      t.style.top = `${top}vh`;
    };
    window.addEventListener("scroll", update, { passive: true }); 
    window.addEventListener("resize", update); 
    update();
    return () => { 
      window.removeEventListener("scroll", update); 
      window.removeEventListener("resize", update); 
    };
  }, []);
  
  const onMouseDown = (e) => {
    isDrag.current = true; 
    dragY.current = e.clientY; 
    scrollY0.current = window.scrollY;
    const onMove = (ev) => { 
      if (!isDrag.current) return; 
      const { scrollHeight, clientHeight } = document.documentElement; 
      window.scrollTo(0, scrollY0.current + ((ev.clientY - dragY.current) / clientHeight) * scrollHeight); 
    };
    const onUp = () => { 
      isDrag.current = false; 
      window.removeEventListener("mousemove", onMove); 
      window.removeEventListener("mouseup", onUp); 
    };
    window.addEventListener("mousemove", onMove); 
    window.addEventListener("mouseup", onUp);
  };
  
  return <div className="mc-csb-track"><div className="mc-csb-thumb" ref={thumbRef} onMouseDown={onMouseDown} /></div>;
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────
// ========== SIDEBAR MODIFIÉE ==========
function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isActive = (path) => {
    if (!path) return false;
    return location.pathname === path;
  };

  return (
    <aside className="mc-sidebar">
      <div className="sidebar-logo">
        <span className="logo-mark"><Icons.museLogo /></span>
        <span className="logo-text">ARTIVISION</span>
      </div>

      <div className="sidebar-artist">
        <img src="https://i.pravatar.cc/80?img=47" alt="Artiste" className="sidebar-avatar" />
        <div>
          <p className="sidebar-name">Mon Profil</p>
          <p className="sidebar-role">Artiste</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${isActive(item.path) ? "nav-item--active" : ""}`}
            onClick={() => item.path && navigate(item.path)}
          >
            <span className="nav-icon">{Icons[item.icon] && Icons[item.icon]()}</span>
            <span className="nav-label">{item.label}</span>
            {isActive(item.path) && <span className="nav-indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-abonnement">
          <span className="abonnement-badge">Actif</span>
          <p className="abonnement-info">Abonnement actif</p>
        </div>
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
function ChambresCard({ chambre, oeuvres, onOeuvreClick, onDeleteChambre, onAddOeuvre, navigate }) {
  const MAX_DISPLAY = 5;
  const rest = oeuvres.length - MAX_DISPLAY;
  const totalRevenues = chambre.revenus || 0;
  const published = oeuvres.filter(o => o.statut === "Publié").length;

  return (
    <div className="mc-chambre-card">
      <div className={`mc-chambre-card__header mc-chambre-card__header--${chambre.headerVariant || "burg"}`}>
        <div className="mc-chambre-card__header-inner">
          <div className="mc-chambre-card__header-top">
            <div className="mc-chambre-card__icon-wrap">🖼️</div>
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
              <span className="mc-chambre-card__stat-val">{chambre.nbVisiteursTotal?.toLocaleString() || 0}</span>
              <span className="mc-chambre-card__stat-lbl">Visiteurs</span>
            </div>
            <div className="mc-chambre-card__stat">
              <span className="mc-chambre-card__stat-val">{totalRevenues.toLocaleString()}</span>
              <span className="mc-chambre-card__stat-lbl">Revenus DT</span>
            </div>
            <div className="mc-chambre-card__stat">
              <span className="mc-chambre-card__stat-val">{chambre.prixEntree || 0} DT</span>
              <span className="mc-chambre-card__stat-lbl">Entrée</span>
            </div>
          </div>
        </div>
      </div>

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
                <div className={`mc-oeuvre-mini__status mc-oeuvre-mini__status--${o.statut?.toLowerCase() || "brouillon"}`} />
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
         
          <button 
            onClick={() => {
              console.log("🖼️ Visite 3D - ID:", chambre.id);
              navigate(`/galerie-3d/${chambre.id}`, { state: { mode: "artiste" } });
            }} 
            className="mc-chambre-card__cta"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ display: "inline", marginRight: "6px" }}>
              <path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            Visiter en 3D
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MesChambres() {
  const navigate = useNavigate();

  // ✅ Utiliser le store
  const chambres = useArtisteStore((state) => state.chambres);
  const oeuvres = useArtisteStore((state) => state.oeuvres);
  const supprimerChambre = useArtisteStore((state) => state.supprimerChambre);
  const loadChambres = useArtisteStore((state) => state.loadChambres); // ← AJOUTE CETTE LIGNE
  const loadOeuvres = useArtisteStore((state) => state.loadOeuvres);   // ← AJOUTE CETTE LIGNE
  const [selectedOeuvre, setSelectedOeuvre] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ msg: "", show: false });

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  };

  const handleDeleteChambre = (chambre) => setDeleteTarget(chambre);

  const confirmDelete = () => {
    supprimerChambre(deleteTarget.id);
    setDeleteTarget(null);
    showToast("✓ Galerie supprimée");
  };

  const handleNavigateToEdit = (oeuvre) => {
    setSelectedOeuvre(null);
    navigate("/mes-oeuvres", { state: { editOeuvreId: oeuvre.id } });
  };
  useEffect(() => {
    console.log("🔄 Chargement des galeries...");
    loadChambres();
    loadOeuvres();
  }, []);

const getOeuvresByChambre = useArtisteStore((state) => state.getOeuvresByChambre);

  const totalOeuvres = oeuvres.length;
  const totalVisiteurs = chambres.reduce((s, c) => s + (c.nbVisiteursTotal || 0), 0);
  const totalRevenus = chambres.reduce((s, c) => s + (c.revenus || 0), 0);

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

        <div className="mc-kpis">
          {kpis.map((k, i) => (
            <div key={i} className="mc-kpi">
              <span className="mc-kpi__icon">{k.icon}</span>
              <p className="mc-kpi__val" style={{ color: k.color }}>{k.val}</p>
              <p className="mc-kpi__lbl">{k.label}</p>
            </div>
          ))}
        </div>

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
                  oeuvres={getOeuvresByChambre(c.id)}  // ← Utilisez la fonction du store
                  onOeuvreClick={setSelectedOeuvre}
                  onDeleteChambre={handleDeleteChambre}
                  onAddOeuvre={() => navigate("/mes-oeuvres")}
                  navigate={navigate}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedOeuvre && (
        <OeuvreDetailPanel
          oeuvre={selectedOeuvre}
          onClose={() => setSelectedOeuvre(null)}
          onNavigateToEdit={handleNavigateToEdit}
        />
      )}
      
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