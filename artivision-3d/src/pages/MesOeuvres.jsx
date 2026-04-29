import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Mesoeuvres.css";

// ─── Static Data ──────────────────────────────────────────────────────────────

const ARTIST = {
  name: "Ariana Soghra",
  avatar: "https://i.pravatar.cc/80?img=47",
  abonnement: "Premium",
  depuis: "Janvier 2024",
};

const GALERIES_ARTISTE = [
  { id: "g1", nom: "Galerie Impressionniste" },
  { id: "g2", nom: "Lumières de Paris" },
  { id: "g3", nom: "Abstraction Pure" },
];

const OEUVRES_INIT = [
  {
    id: "o1", galerieId: "g1", galerieName: "Galerie Impressionniste",
    titre: "Lumière d'Automne", description: "Une exploration de la lumière automnale à travers des touches impressionnistes délicates.",
    prix: 450, dateRealisation: "2024-09-15", technique: "Huile sur toile",
    dimensions: "80 × 60 cm", statut: "Publié", nbExemplaires: 1,
    tags: ["Impressionnisme", "Automne", "Lumière"],
    img: "/images/galerie/g1.jpg",
  },
  {
    id: "o2", galerieId: "g1", galerieName: "Galerie Impressionniste",
    titre: "Reflets Bleutés", description: "Jeu de reflets sur l'eau au coucher du soleil, inspiré des étangs normands.",
    prix: 280, dateRealisation: "2024-07-20", technique: "Aquarelle",
    dimensions: "50 × 40 cm", statut: "Publié", nbExemplaires: 3,
    tags: ["Aquarelle", "Eau", "Coucher de soleil"],
    img: "/images/galerie/g2.jpg",
  },
  {
    id: "o3", galerieId: "g2", galerieName: "Lumières de Paris",
    titre: "Portail Doré", description: "La magnificence dorée d'une entrée parisienne, capturée dans ses moindres détails ornementaux.",
    prix: 720, dateRealisation: "2024-11-03", technique: "Peinture acrylique",
    dimensions: "100 × 80 cm", statut: "Publié", nbExemplaires: 1,
    tags: ["Paris", "Architecture", "Or"],
    img: "/images/galerie/g3.jpg",
  },
  {
    id: "o4", galerieId: "g3", galerieName: "Abstraction Pure",
    titre: "Nuit Parisienne", description: "Une nuit parisienne abstraite, entre rêve et réalité, dans des tons profonds de bleu et violet.",
    prix: 190, dateRealisation: "2024-05-12", technique: "Pastel",
    dimensions: "40 × 30 cm", statut: "Brouillon", nbExemplaires: 5,
    tags: ["Nuit", "Abstrait", "Paris"],
    img: "/images/galerie/g4.jpg",
  },
  {
    id: "o5", galerieId: "g2", galerieName: "Lumières de Paris",
    titre: "Aube Rosée", description: "Les premières lueurs rosées de l'aube sur les toits de la ville endormie.",
    prix: 340, dateRealisation: "2024-08-28", technique: "Huile sur toile",
    dimensions: "70 × 55 cm", statut: "Vendu", nbExemplaires: 1,
    tags: ["Aube", "Lumière", "Toits"],
    img: "/images/galerie/g5.jpg",
  },
];

const TECHNIQUES = [
  "Huile sur toile", "Aquarelle", "Acrylique", "Pastel", "Dessin au crayon",
  "Art numérique", "Photographie", "Sculpture", "Gravure", "Autre",
];

const STATUTS = ["Tous", "Publié", "Brouillon", "Vendu"];

const NAV_ITEMS = [
  { icon: "◈", label: "Dashboard",    id: "dashboard",  path: "/dashboard-artiste" },
  { icon: "🖼", label: "Mes Œuvres",  id: "oeuvres",    path: "/mes-oeuvres" },
  { icon: "🏛", label: "Mes Chambres",id: "chambre",    path: "/mes-chambres" },
  { icon: "📊", label: "Statistiques",id: "stats",      path: "/dashboard-artiste" },
  { icon: "✦", label: "Assistant IA", id: "ia",         path: "/dashboard-artiste" },
  { icon: "⚙", label: "Paramètres",  id: "settings",   path: "/dashboard-artiste" },
];

// ─── Custom Scrollbar ──────────────────────────────────────────────────────────

function CustomScrollbar() {
  const thumbRef = useRef(null);
  const isDrag = useRef(false);
  const dragY = useRef(0);
  const scrollY0 = useRef(0);

  useEffect(() => {
    const update = () => {
      const t = thumbRef.current; if (!t) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const ratio = clientHeight / scrollHeight;
      const h = Math.max(ratio * 100, 8);
      const top = scrollHeight > clientHeight ? (scrollTop / (scrollHeight - clientHeight)) * (100 - h) : 0;
      t.style.height = `${h}vh`; t.style.top = `${top}vh`;
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  const onMouseDown = (e) => {
    isDrag.current = true; dragY.current = e.clientY; scrollY0.current = window.scrollY;
    const onMove = (ev) => {
      if (!isDrag.current) return;
      const { scrollHeight, clientHeight } = document.documentElement;
      window.scrollTo(0, scrollY0.current + ((ev.clientY - dragY.current) / clientHeight) * scrollHeight);
    };
    const onUp = () => { isDrag.current = false; window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return <div className="mo-csb-track"><div className="mo-csb-thumb" ref={thumbRef} onMouseDown={onMouseDown} /></div>;
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────

function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="mo-sidebar">
      <div className="mo-sidebar__logo">
        <img src="/images/logo_artivision.png" alt="Artivision" className="mo-sidebar__logo-img"
          onError={e => { e.target.style.display = "none"; }} />
      </div>
      <div className="mo-sidebar__artist">
        <img src={ARTIST.avatar} alt={ARTIST.name} className="mo-sidebar__avatar"
          onError={e => { e.target.src = "https://i.pravatar.cc/80?img=47"; }} />
        <div>
          <p className="mo-sidebar__name">{ARTIST.name}</p>
          <p className="mo-sidebar__role">Artiste • {ARTIST.abonnement}</p>
        </div>
      </div>
      <nav className="mo-sidebar__nav">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            className={`mo-nav-item ${item.id === "oeuvres" ? "mo-nav-item--active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            <span className="mo-nav-icon">{item.icon}</span>
            <span className="mo-nav-label">{item.label}</span>
            {item.id === "oeuvres" && <span className="mo-nav-indicator" />}
          </button>
        ))}
      </nav>
      <div className="mo-sidebar__footer">
        <span className="mo-badge">{ARTIST.abonnement}</span>
        <p className="mo-sidebar__since">Depuis {ARTIST.depuis}</p>
      </div>
    </aside>
  );
}

// ─── Add / Edit Modal ──────────────────────────────────────────────────────────

const EMPTY_FORM = {
  galerieId: "", titre: "", description: "",
  prix: "", dateRealisation: "", technique: "",
  dimensions: "", nbExemplaires: "1", statut: "Publié",
  informationsComplementaires: "", tags: [], img: null, imgPreview: null,
};

function OeuvreModal({ oeuvre, onClose, onSave, galeries }) {
  const isEdit = !!oeuvre;
  const [form, setForm] = useState(isEdit ? { ...oeuvre, tags: [...oeuvre.tags], imgPreview: oeuvre.img, img: null } : { ...EMPTY_FORM });
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState("");
  const [dragover, setDragover] = useState(false);
  const fileRef = useRef(null);

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  };

  const handleImage = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const url = URL.createObjectURL(file);
    setForm(f => ({ ...f, img: file, imgPreview: url }));
  };

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  };

  const removeTag = (t) => set("tags", form.tags.filter(x => x !== t));

  const validate = () => {
    const e = {};
    if (!form.galerieId)   e.galerieId = "Choisissez une galerie";
    if (!form.titre.trim()) e.titre = "Le titre est requis";
    if (!form.prix || isNaN(form.prix) || +form.prix <= 0) e.prix = "Prix invalide";
    if (!form.dateRealisation) e.dateRealisation = "Date requise";
    if (!form.technique) e.technique = "Choisissez une technique";
    if (!isEdit && !form.imgPreview) e.img = "Ajoutez une image de l'œuvre";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const galerie = galeries.find(g => g.id === form.galerieId);
    onSave({
      ...form,
      id: isEdit ? oeuvre.id : `o${Date.now()}`,
      galerieName: galerie?.nom || "",
      prix: parseFloat(form.prix),
      nbExemplaires: parseInt(form.nbExemplaires) || 1,
      img: form.imgPreview || oeuvre?.img || "",
    });
  };

  return (
    <div className="mo-modal-backdrop" onClick={onClose}>
      <div className="mo-modal" onClick={e => e.stopPropagation()}>

        {/* Head */}
        <div className="mo-modal__head">
          <div>
            <h2 className="mo-modal__title">{isEdit ? "Modifier l'œuvre" : "Ajouter une œuvre"}</h2>
            <p className="mo-modal__sub">{isEdit ? "Mettez à jour les informations de votre création" : "Ajoutez une nouvelle création à votre galerie"}</p>
          </div>
          <button className="mo-modal__close" onClick={onClose}>✕</button>
        </div>

        <div className="mo-modal__body">

          {/* ── Image Upload ── */}
          <div
            className={`mo-upload-zone ${dragover ? "mo-upload-zone--dragover" : ""}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragover(true); }}
            onDragLeave={() => setDragover(false)}
            onDrop={e => { e.preventDefault(); setDragover(false); handleImage(e.dataTransfer.files[0]); }}
          >
            <input ref={fileRef} type="file" accept="image/*" hidden
              onChange={e => handleImage(e.target.files[0])} />
            {form.imgPreview ? (
              <>
                <img src={form.imgPreview} alt="preview" className="mo-upload-zone__preview" />
                <button className="mo-upload-zone__change" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>
                  🖼 Changer l'image
                </button>
              </>
            ) : (
              <>
                <span className="mo-upload-zone__icon">🖼</span>
                <p className="mo-upload-zone__text">Glissez votre image ici ou <span className="mo-upload-zone__link">parcourez</span></p>
                <p className="mo-upload-zone__hint">PNG, JPG, WEBP — Max 10 Mo</p>
              </>
            )}
          </div>
          {errors.img && <p className="mo-error" style={{ marginTop: -20, marginBottom: 16 }}>{errors.img}</p>}

          {/* ── Section 1: Identification ── */}
          <div className="mo-section-sep">
            <div className="mo-section-sep__line" />
            <span className="mo-section-sep__label">Identification</span>
            <div className="mo-section-sep__line" />
          </div>

          <div className="mo-form-grid">
            {/* Galerie */}
            <div className="mo-field">
              <label className="mo-label">Galerie de destination <span className="mo-required">*</span></label>
              <p className="mo-hint">Dans quelle galerie exposer cette œuvre ?</p>
              <select className={`mo-select ${errors.galerieId ? "mo-input--error" : ""}`}
                value={form.galerieId} onChange={e => set("galerieId", e.target.value)}>
                <option value="">Choisir une galerie…</option>
                {galeries.map(g => <option key={g.id} value={g.id}>{g.nom}</option>)}
              </select>
              {errors.galerieId && <p className="mo-error">{errors.galerieId}</p>}
            </div>

            {/* Titre */}
            <div className="mo-field">
              <label className="mo-label">Titre de l'œuvre <span className="mo-required">*</span></label>
              <p className="mo-hint">Le nom sous lequel l'œuvre sera exposée</p>
              <input className={`mo-input ${errors.titre ? "mo-input--error" : ""}`}
                placeholder="Ex: Lumière d'Automne" value={form.titre}
                onChange={e => set("titre", e.target.value)} />
              {errors.titre && <p className="mo-error">{errors.titre}</p>}
            </div>

            {/* Technique */}
            <div className="mo-field">
              <label className="mo-label">Technique <span className="mo-required">*</span></label>
              <select className={`mo-select ${errors.technique ? "mo-input--error" : ""}`}
                value={form.technique} onChange={e => set("technique", e.target.value)}>
                <option value="">Choisir…</option>
                {TECHNIQUES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.technique && <p className="mo-error">{errors.technique}</p>}
            </div>

            {/* Dimensions */}
            <div className="mo-field">
              <label className="mo-label">Dimensions</label>
              <p className="mo-hint">Format : largeur × hauteur</p>
              <input className="mo-input" placeholder="Ex: 80 × 60 cm" value={form.dimensions}
                onChange={e => set("dimensions", e.target.value)} />
            </div>

            {/* Date de réalisation */}
            <div className="mo-field">
              <label className="mo-label">Date de réalisation <span className="mo-required">*</span></label>
              <input type="date" className={`mo-input ${errors.dateRealisation ? "mo-input--error" : ""}`}
                value={form.dateRealisation} onChange={e => set("dateRealisation", e.target.value)} />
              {errors.dateRealisation && <p className="mo-error">{errors.dateRealisation}</p>}
            </div>

            {/* Statut */}
            <div className="mo-field">
              <label className="mo-label">Statut de publication</label>
              <select className="mo-select" value={form.statut} onChange={e => set("statut", e.target.value)}>
                <option value="Publié">Publié — visible par les visiteurs</option>
                <option value="Brouillon">Brouillon — masqué</option>
                <option value="Vendu">Vendu — archivé</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mo-section-sep" style={{ marginTop: 24 }}>
            <div className="mo-section-sep__line" />
            <span className="mo-section-sep__label">Description & Contexte</span>
            <div className="mo-section-sep__line" />
          </div>

          <div className="mo-form-grid">
            <div className="mo-field mo-form-grid--full">
              <label className="mo-label">Description de l'œuvre <span className="mo-required">*</span></label>
              <p className="mo-hint">Racontez l'histoire, l'inspiration et l'émotion de cette création</p>
              <textarea className="mo-textarea" rows={4}
                placeholder="Décrivez votre œuvre : inspiration, technique, histoire derrière la création…"
                value={form.description} onChange={e => set("description", e.target.value)}
                maxLength={800} />
              <div className="mo-char-count">{form.description.length} / 800</div>
            </div>

            <div className="mo-field mo-form-grid--full">
              <label className="mo-label">Informations complémentaires</label>
              <p className="mo-hint">Provenance, expositions précédentes, certificat d'authenticité, anecdotes…</p>
              <textarea className="mo-textarea" rows={3}
                placeholder="Toute information supplémentaire utile pour les acheteurs potentiels…"
                value={form.informationsComplementaires}
                onChange={e => set("informationsComplementaires", e.target.value)}
                maxLength={500} />
            </div>

            {/* Tags */}
            <div className="mo-field mo-form-grid--full">
              <label className="mo-label">Mots-clés / Tags</label>
              <p className="mo-hint">Aidez les visiteurs à trouver votre œuvre</p>
              <div className="mo-tag-input-row">
                <input className="mo-input" style={{ flex: 1 }} placeholder="Ex: Impressionnisme"
                  value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} />
                <button className="mo-tag-add" onClick={addTag} type="button">+ Ajouter</button>
              </div>
              {form.tags.length > 0 && (
                <div className="mo-tags-wrap">
                  {form.tags.map(t => (
                    <span key={t} className="mo-tag">
                      {t}
                      <button className="mo-tag__remove" onClick={() => removeTag(t)} type="button">×</button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Section tarification */}
          <div className="mo-section-sep" style={{ marginTop: 24 }}>
            <div className="mo-section-sep__line" />
            <span className="mo-section-sep__label">Tarification & Stock</span>
            <div className="mo-section-sep__line" />
          </div>

          <div className="mo-form-grid">
            <div className="mo-field">
              <label className="mo-label">Prix de vente (DT) <span className="mo-required">*</span></label>
              <p className="mo-hint">Prix affiché aux visiteurs</p>
              <input type="number" min="0" step="0.5"
                className={`mo-input ${errors.prix ? "mo-input--error" : ""}`}
                placeholder="Ex: 450" value={form.prix}
                onChange={e => set("prix", e.target.value)} />
              {errors.prix && <p className="mo-error">{errors.prix}</p>}
            </div>

            <div className="mo-field">
              <label className="mo-label">Nombre d'exemplaires</label>
              <p className="mo-hint">1 pour une œuvre unique</p>
              <input type="number" min="1" className="mo-input"
                placeholder="Ex: 1" value={form.nbExemplaires}
                onChange={e => set("nbExemplaires", e.target.value)} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mo-modal__footer">
          <button className="mo-btn mo-btn--ghost" onClick={onClose}>Annuler</button>
          <button className="mo-btn mo-btn--primary mo-btn--save" onClick={handleSave}>
            {isEdit ? "✦ Mettre à jour" : "✦ Publier l'œuvre"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function MesOeuvres() {
  const [oeuvres, setOeuvres] = useState(OEUVRES_INIT);
  const [search, setSearch] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [filtreGalerie, setFiltreGalerie] = useState("Tous");
  const [view, setView] = useState("grid"); // grid | list
  const [showModal, setShowModal] = useState(false);
  const [editOeuvre, setEditOeuvre] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ msg: "", show: false });

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  };

  const handleSave = (data) => {
    if (editOeuvre) {
      setOeuvres(prev => prev.map(o => o.id === data.id ? data : o));
      showToast("✓ Œuvre mise à jour avec succès");
    } else {
      setOeuvres(prev => [...prev, data]);
      showToast("✓ Œuvre ajoutée à votre galerie");
    }
    setShowModal(false);
    setEditOeuvre(null);
  };

  const handleDelete = (id) => {
    setOeuvres(prev => prev.filter(o => o.id !== id));
    setDeleteTarget(null);
    showToast("✓ Œuvre supprimée");
  };

  const openAdd = () => { setEditOeuvre(null); setShowModal(true); };
  const openEdit = (o) => { setEditOeuvre(o); setShowModal(true); };

  const galeries = GALERIES_ARTISTE;
  const galerieOptions = ["Tous", ...galeries.map(g => g.nom)];

  const filtered = oeuvres
    .filter(o => filtreStatut === "Tous" || o.statut === filtreStatut)
    .filter(o => filtreGalerie === "Tous" || o.galerieName === filtreGalerie)
    .filter(o => !search || o.titre.toLowerCase().includes(search.toLowerCase()) ||
      o.description.toLowerCase().includes(search.toLowerCase()));

  const kpis = [
    { icon: "🖼", label: "Total œuvres", val: oeuvres.length, color: "#8B2020" },
    { icon: "✅", label: "Publiées", val: oeuvres.filter(o => o.statut === "Publié").length, color: "#3A6B35" },
    { icon: "📝", label: "Brouillons", val: oeuvres.filter(o => o.statut === "Brouillon").length, color: "#C9A040" },
    { icon: "💰", label: "Vendues", val: oeuvres.filter(o => o.statut === "Vendu").length, color: "#2C4A8B" },
  ];

  return (
    <div className="mo-root">
      <Sidebar />

      <main className="mo-main">

        {/* Header */}
        <div className="mo-header">
          <div>
            <span className="mo-header__eyebrow">✦ Espace Artiste</span>
            <h1 className="mo-header__title">Mes Œuvres</h1>
            <p className="mo-header__sub">Gérez et organisez toutes vos créations artistiques</p>
          </div>
          <div className="mo-header__actions">
            <button className="mo-btn mo-btn--primary" onClick={openAdd}>
              + Ajouter une œuvre
            </button>
          </div>
        </div>

        {/* KPIs */}
        <div className="mo-kpis">
          {kpis.map((k, i) => (
            <div key={i} className="mo-kpi">
              <span className="mo-kpi__icon">{k.icon}</span>
              <p className="mo-kpi__val" style={{ color: k.color }}>{k.val}</p>
              <p className="mo-kpi__lbl">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mo-toolbar">
          <div className="mo-toolbar__left">
            <div className="mo-search-wrap">
              <span className="mo-search-icon">🔍</span>
              <input className="mo-search" placeholder="Rechercher une œuvre…"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            {STATUTS.map(s => (
              <button key={s} className={`mo-filter-btn ${filtreStatut === s ? "mo-filter-btn--active" : ""}`}
                onClick={() => setFiltreStatut(s)}>{s}</button>
            ))}
            <select className="mo-filter-btn" style={{ padding: "8px 14px", cursor: "pointer" }}
              value={filtreGalerie} onChange={e => setFiltreGalerie(e.target.value)}>
              {galerieOptions.map(g => <option key={g} value={g}>{g === "Tous" ? "Toutes les galeries" : g}</option>)}
            </select>
          </div>
          <div className="mo-view-toggle">
            <button className={`mo-view-btn ${view === "grid" ? "mo-view-btn--active" : ""}`}
              onClick={() => setView("grid")}>⊞</button>
            <button className={`mo-view-btn ${view === "list" ? "mo-view-btn--active" : ""}`}
              onClick={() => setView("list")}>☰</button>
          </div>
        </div>

        {/* Grid */}
        <div className={`mo-grid ${view === "list" ? "mo-grid--list" : ""}`}>
          {filtered.length === 0 ? (
            <div className="mo-empty">
              <span className="mo-empty__icon">🎨</span>
              <h2 className="mo-empty__title">Aucune œuvre trouvée</h2>
              <p className="mo-empty__sub">Commencez à enrichir votre galerie en ajoutant votre première création.</p>
              <button className="mo-btn mo-btn--primary" onClick={openAdd}>+ Ajouter ma première œuvre</button>
            </div>
          ) : (
            filtered.map((o, idx) => (
              <div key={o.id} className={`mo-card ${view === "list" ? "mo-card--list" : ""}`}
                style={{ animationDelay: `${idx * 0.05}s` }}>

                <div className={`mo-card__status mo-card__status--${o.statut.toLowerCase()}`}>{o.statut}</div>

                <div className="mo-card__actions-top">
                  <button className="mo-card__action-btn mo-card__action-btn--edit"
                    onClick={() => openEdit(o)} title="Modifier">✏</button>
                  <button className="mo-card__action-btn mo-card__action-btn--del"
                    onClick={() => setDeleteTarget(o)} title="Supprimer">🗑</button>
                </div>

                <div className="mo-card__img-wrap">
                  <img src={o.img} alt={o.titre} className="mo-card__img"
                    onError={e => { e.target.src = `https://picsum.photos/400/280?random=${idx + 1}`; }} />
                  <div className="mo-card__galerie-tag">{o.galerieName}</div>
                </div>

                <div className="mo-card__body">
                  <span className="mo-card__galerie-name">{o.technique}</span>
                  <h3 className="mo-card__title">{o.titre}</h3>
                  <p className="mo-card__desc">{o.description}</p>
                  <div className="mo-card__meta">
                    {o.dimensions && <span className="mo-card__meta-item">📐 {o.dimensions}</span>}
                    <span className="mo-card__meta-item">📦 {o.nbExemplaires} ex.</span>
                    <span className="mo-card__meta-item">📅 {new Date(o.dateRealisation).toLocaleDateString("fr-FR", { day:"2-digit", month:"short", year:"numeric" })}</span>
                  </div>
                </div>

                <div className="mo-card__footer">
                  <span className="mo-card__price">{o.prix} DT</span>
                  <span className="mo-card__date">{o.tags.slice(0,2).join(" · ")}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Modals */}
      {showModal && (
        <OeuvreModal
          oeuvre={editOeuvre}
          galeries={galeries}
          onClose={() => { setShowModal(false); setEditOeuvre(null); }}
          onSave={handleSave}
        />
      )}

      {deleteTarget && (
        <div className="mo-modal-backdrop" onClick={() => setDeleteTarget(null)}>
          <div className="mo-confirm" onClick={e => e.stopPropagation()}>
            <span className="mo-confirm__icon">🗑</span>
            <h2 className="mo-confirm__title">Supprimer cette œuvre ?</h2>
            <p className="mo-confirm__sub">
              <strong>"{deleteTarget.titre}"</strong> sera supprimée définitivement de votre galerie.
              Cette action est irréversible.
            </p>
            <div className="mo-confirm__actions">
              <button className="mo-btn mo-btn--ghost" onClick={() => setDeleteTarget(null)}>Annuler</button>
              <button className="mo-btn mo-btn--danger" onClick={() => handleDelete(deleteTarget.id)}>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      <div className={`mo-toast ${toast.show ? "mo-toast--show" : ""}`}>{toast.msg}</div>
      <CustomScrollbar />
    </div>
  );
}