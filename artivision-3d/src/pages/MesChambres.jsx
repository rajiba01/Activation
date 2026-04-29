import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Meschambres.css";

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
    icon: "🏛",
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
    icon: "✦",
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
    icon: "◈",
  },
];

const NAV_ITEMS = [
  { icon: "◈", label: "Dashboard",     id: "dashboard", path: "/dashboard-artiste" },
  { icon: "🖼", label: "Mes Œuvres",   id: "oeuvres",   path: "/mes-oeuvres" },
  { icon: "🏛", label: "Mes Chambres", id: "chambre",   path: "/mes-chambres" },
  { icon: "📊", label: "Statistiques", id: "stats",     path: "/dashboard-artiste" },
  { icon: "✦", label: "Assistant IA",  id: "ia",        path: "/dashboard-artiste" },
  { icon: "⚙", label: "Paramètres",   id: "settings",  path: "/dashboard-artiste" },
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
          <button className="mc-detail-panel__close" onClick={onClose}>✕</button>
        </div>

        <img src={oeuvre.img} alt={oeuvre.titre} className="mc-detail-panel__img"
          onError={e => { e.target.src = "https://picsum.photos/440/240?random=99"; }} />

        <div className="mc-detail-panel__body">
          <span className="mc-detail-panel__galerie">✦ {oeuvre.galerieName}</span>
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
              ✏ Modifier l'œuvre
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
              <button className="mc-chambre-card__act-btn" title="Modifier la chambre">✏</button>
              <button className="mc-chambre-card__act-btn mc-chambre-card__act-btn--del"
                title="Supprimer la chambre" onClick={() => onDeleteChambre(chambre)}>🗑</button>
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
            <span className="mc-oeuvres-empty__icon">🎨</span>
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
            🗓 Créée le {new Date(chambre.dateCreation).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })}
            &nbsp;· {chambre.decor} · {chambre.surface}
          </span>
          <a href={`/galerie/${chambre.id}`} className="mc-chambre-card__cta">
            🏛 Visiter la galerie
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
    { icon: "🏛", label: "Mes galeries",    val: chambres.length,                color: "#8B2020" },
    { icon: "🖼", label: "Œuvres exposées", val: totalOeuvres,                    color: "#C9A040" },
    { icon: "👁", label: "Total visiteurs", val: totalVisiteurs.toLocaleString(), color: "#2C4A8B" },
    { icon: "💰", label: "Revenus totaux",  val: `${totalRevenus.toLocaleString()} DT`, color: "#3A6B35" },
  ];

  return (
    <div className="mc-root">
      <Sidebar />

      <main className="mc-main">

        {/* Header */}
        <div className="mc-header">
          <div>
            <span className="mc-header__eyebrow">✦ Espace Artiste</span>
            <h1 className="mc-header__title">Mes Chambres</h1>
            <p className="mc-header__sub">
              Vos galeries virtuelles et les œuvres qui y sont exposées
            </p>
          </div>
          <div className="mc-header__actions">
            <button className="mc-btn mc-btn--ghost" onClick={() => navigate("/mes-oeuvres")}>
              🖼 Gérer les œuvres
            </button>
            <button className="mc-btn mc-btn--primary" onClick={() => navigate("/ajouter-galerie")}>
              + Nouvelle galerie
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
            <span className="mc-empty__icon">🏛</span>
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
            <span className="mc-confirm__icon">🏛</span>
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