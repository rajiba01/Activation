import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Mesoeuvres.css";
import { useArtisteStore } from "../../store/useArtisteStore";

// ─── SVG Icons ──────────────────────────────────────────────────────────────
const Icons = {
  Dashboard: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  Oeuvres: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="2.5" />
      <path d="M21 15L16 10L5 21" />
    </svg>
  ),
  Chambres: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-6 9 6v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  ),
  Stats: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  AssistantIA: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 2a5 5 0 0 0-5 5v5a5 5 0 0 0 10 0V7a5 5 0 0 0-5-5z" />
      <path d="M21 12c0 4.97-4.03 9-9 9" />
      <path d="M10 17l-2 2" />
      <path d="M18 5l-1 1" />
    </svg>
  ),
  Settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H5.78a1.65 1.65 0 0 0-1.51 1 1.65 1.65 0 0 0 .33 1.82l.07.09A10 10 0 0 0 12 18a10 10 0 0 0 6.18-2.07z" />
    </svg>
  ),
  Search: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="10" cy="10" r="7" />
      <line x1="21" y1="21" x2="14.5" y2="14.5" />
    </svg>
  ),
  Grid: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
    </svg>
  ),
  List: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  ),
  Edit: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 3l4 4-8 8H9v-4l8-8z" />
      <path d="M3 21h18" />
    </svg>
  ),
  Trash: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="3 6 5 6 21 6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  ),
  Ruler: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 12h18M3 6h18M3 18h18" />
    </svg>
  ),
  Package: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M2 4h20v16H2z" />
    </svg>
  ),
  Calendar: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  ImageUpload: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="2.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  Close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  ),
  Warning: () => (
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <circle cx="12" cy="16" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  ),
  EmptyArt: () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="2.5" />
      <path d="M21 15L16 10L5 21" />
    </svg>
  ),
  ChangeImage: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  Save: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  TagAdd: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
};

// ─── Données statiques ─────────────────────────────────────────────────────
const ARTIST = {
  name: "Ariana Soghra",
  avatar: "https://i.pravatar.cc/80?img=47",
  abonnement: "Premium",
  depuis: "Janvier 2024",
};

const TECHNIQUES = [
  "Huile sur toile", "Aquarelle", "Acrylique", "Pastel", "Dessin au crayon",
  "Art numérique", "Photographie", "Sculpture", "Gravure", "Autre",
];

const STATUTS = ["Tous", "Publié", "Brouillon", "Vendu"];

const NAV_ITEMS = [
  { icon: "dashboard", label: "Dashboard", id: "dashboard", path: "/dashboard-artiste" },
  { icon: "oeuvres", label: "Mes Œuvres", id: "oeuvres", path: "/mes-oeuvres" },
  { icon: "chambres", label: "Mes Chambres", id: "chambre", path: "/mes-chambres" },
  { icon: "stats", label: "Statistiques", id: "stats", path: "/dashboard-artiste" },
  { icon: "assistant", label: "Assistant IA", id: "ia", path: "/dashboard-artiste" },
  { icon: "settings", label: "Paramètres", id: "settings", path: "/dashboard-artiste" },
];

// ─── Custom Scrollbar ──────────────────────────────────────────────────────
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

// ─── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar() {
  const navigate = useNavigate();
  
  const renderIcon = (iconName) => {
    switch(iconName) {
      case "dashboard": return <Icons.Dashboard />;
      case "oeuvres": return <Icons.Oeuvres />;
      case "chambres": return <Icons.Chambres />;
      case "stats": return <Icons.Stats />;
      case "assistant": return <Icons.AssistantIA />;
      case "settings": return <Icons.Settings />;
      default: return null;
    }
  };
  
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
            <span className="mo-nav-icon">{renderIcon(item.icon)}</span>
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

// ─── Add / Edit Modal ──────────────────────────────────────────────────────
const EMPTY_FORM = {
  galerieId: "", titre: "", description: "",
  prix: "", dateRealisation: "", technique: "",
  dimensions: "", nbExemplaires: "1", statut: "Publié",
  informationsComplementaires: "", tags: [], img: null, imgPreview: null,
};

function OeuvreModal({ oeuvre, onClose, onSave, galeries }) {
  const isEdit = !!oeuvre;
  const [form, setForm] = useState(isEdit ? { ...oeuvre, tags: [...(oeuvre.tags || [])], imgPreview: oeuvre.img, img: null } : { ...EMPTY_FORM });
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
      id: isEdit ? oeuvre.id : undefined,
      galerieName: galerie?.nom || "",
      prix: parseFloat(form.prix),
      nbExemplaires: parseInt(form.nbExemplaires) || 1,
      img: form.imgPreview || oeuvre?.img || "",
    });
  };

  return (
    <div className="mo-modal-backdrop" onClick={onClose}>
      <div className="mo-modal" onClick={e => e.stopPropagation()}>
        <div className="mo-modal__head">
          <div>
            <h2 className="mo-modal__title">{isEdit ? "Modifier l'œuvre" : "Ajouter une œuvre"}</h2>
            <p className="mo-modal__sub">{isEdit ? "Mettez à jour les informations de votre création" : "Ajoutez une nouvelle création à votre galerie"}</p>
          </div>
          <button className="mo-modal__close" onClick={onClose}><Icons.Close /></button>
        </div>

        <div className="mo-modal__body">
          {/* Image Upload */}
          <div
            className={`mo-upload-zone ${dragover ? "mo-upload-zone--dragover" : ""}`}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragover(true); }}
            onDragLeave={() => setDragover(false)}
            onDrop={e => { e.preventDefault(); setDragover(false); handleImage(e.dataTransfer.files[0]); }}
          >
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={e => handleImage(e.target.files[0])} />
            {form.imgPreview ? (
              <>
                <img src={form.imgPreview} alt="preview" className="mo-upload-zone__preview" />
                <button className="mo-upload-zone__change" onClick={e => { e.stopPropagation(); fileRef.current?.click(); }}>
                  <Icons.ChangeImage /> Changer l'image
                </button>
              </>
            ) : (
              <>
                <span className="mo-upload-zone__icon"><Icons.ImageUpload /></span>
                <p className="mo-upload-zone__text">Glissez votre image ici ou <span className="mo-upload-zone__link">parcourez</span></p>
                <p className="mo-upload-zone__hint">PNG, JPG, WEBP — Max 10 Mo</p>
              </>
            )}
          </div>
          {errors.img && <p className="mo-error" style={{ marginTop: -20, marginBottom: 16 }}>{errors.img}</p>}

          {/* Section 1: Identification */}
          <div className="mo-section-sep">
            <div className="mo-section-sep__line" />
            <span className="mo-section-sep__label">Identification</span>
            <div className="mo-section-sep__line" />
          </div>

          <div className="mo-form-grid">
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

            <div className="mo-field">
              <label className="mo-label">Titre de l'œuvre <span className="mo-required">*</span></label>
              <p className="mo-hint">Le nom sous lequel l'œuvre sera exposée</p>
              <input className={`mo-input ${errors.titre ? "mo-input--error" : ""}`}
                placeholder="Ex: Lumière d'Automne" value={form.titre}
                onChange={e => set("titre", e.target.value)} />
              {errors.titre && <p className="mo-error">{errors.titre}</p>}
            </div>

            <div className="mo-field">
              <label className="mo-label">Technique <span className="mo-required">*</span></label>
              <select className={`mo-select ${errors.technique ? "mo-input--error" : ""}`}
                value={form.technique} onChange={e => set("technique", e.target.value)}>
                <option value="">Choisir…</option>
                {TECHNIQUES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
              {errors.technique && <p className="mo-error">{errors.technique}</p>}
            </div>

            <div className="mo-field">
              <label className="mo-label">Dimensions</label>
              <p className="mo-hint">Format : largeur × hauteur</p>
              <input className="mo-input" placeholder="Ex: 80 × 60 cm" value={form.dimensions}
                onChange={e => set("dimensions", e.target.value)} />
            </div>

            <div className="mo-field">
              <label className="mo-label">Date de réalisation <span className="mo-required">*</span></label>
              <input type="date" className={`mo-input ${errors.dateRealisation ? "mo-input--error" : ""}`}
                value={form.dateRealisation} onChange={e => set("dateRealisation", e.target.value)} />
              {errors.dateRealisation && <p className="mo-error">{errors.dateRealisation}</p>}
            </div>

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

            <div className="mo-field mo-form-grid--full">
              <label className="mo-label">Mots-clés / Tags</label>
              <p className="mo-hint">Aidez les visiteurs à trouver votre œuvre</p>
              <div className="mo-tag-input-row">
                <input className="mo-input" style={{ flex: 1 }} placeholder="Ex: Impressionnisme"
                  value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && (e.preventDefault(), addTag())} />
                <button className="mo-tag-add" onClick={addTag} type="button"><Icons.TagAdd /> Ajouter</button>
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

          {/* Tarification */}
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

        <div className="mo-modal__footer">
          <button className="mo-btn mo-btn--ghost" onClick={onClose}>Annuler</button>
          <button className="mo-btn mo-btn--primary mo-btn--save" onClick={handleSave}>
            <Icons.Save /> {isEdit ? "Mettre à jour" : "Publier l'œuvre"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function MesOeuvres() {
  const navigate = useNavigate();
  
  // ✅ Récupérer depuis le store au lieu de l'état local
  const oeuvres = useArtisteStore((state) => state.oeuvres);
  const ajouterOeuvre = useArtisteStore((state) => state.ajouterOeuvre);
  const modifierOeuvre = useArtisteStore((state) => state.modifierOeuvre);
  const supprimerOeuvre = useArtisteStore((state) => state.supprimerOeuvre);
  const chambres = useArtisteStore((state) => state.chambres);

  const [search, setSearch] = useState("");
  const [filtreStatut, setFiltreStatut] = useState("Tous");
  const [filtreGalerie, setFiltreGalerie] = useState("Tous");
  const [view, setView] = useState("grid");
  const [showModal, setShowModal] = useState(false);
  const [editOeuvre, setEditOeuvre] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [toast, setToast] = useState({ msg: "", show: false });

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  };

  // ✅ Utiliser les actions du store
  const handleSave = (data) => {
    if (editOeuvre) {
      modifierOeuvre(data.id, data);
      showToast("✓ Œuvre mise à jour avec succès");
    } else {
      ajouterOeuvre(data);
      showToast("✓ Œuvre ajoutée à votre galerie");
    }
    setShowModal(false);
    setEditOeuvre(null);
  };

  // ✅ Utiliser l'action du store
  const handleDelete = (id) => {
    supprimerOeuvre(id);
    setDeleteTarget(null);
    showToast("✓ Œuvre supprimée");
  };

  const openAdd = () => { setEditOeuvre(null); setShowModal(true); };
  const openEdit = (o) => { setEditOeuvre(o); setShowModal(true); };

  // ✅ Les galeries viennent du store
  const galeries = chambres.map(c => ({ id: c.id, nom: c.nom }));
  const galerieOptions = ["Tous", ...galeries.map(g => g.nom)];

  // Filtrer les œuvres
  const filtered = oeuvres
    .filter(o => filtreStatut === "Tous" || o.statut === filtreStatut)
    .filter(o => filtreGalerie === "Tous" || o.galerieName === filtreGalerie)
    .filter(o => !search || o.titre?.toLowerCase().includes(search.toLowerCase()) ||
      o.description?.toLowerCase().includes(search.toLowerCase()));

  const kpis = [
    { icon: "oeuvres", label: "Total œuvres", val: oeuvres.length, color: "#8B2020" },
    { icon: "published", label: "Publiées", val: oeuvres.filter(o => o.statut === "Publié").length, color: "#3A6B35" },
    { icon: "draft", label: "Brouillons", val: oeuvres.filter(o => o.statut === "Brouillon").length, color: "#C9A040" },
    { icon: "sold", label: "Vendues", val: oeuvres.filter(o => o.statut === "Vendu").length, color: "#2C4A8B" },
  ];

  const renderKpiIcon = (iconName) => {
    switch(iconName) {
      case "oeuvres": return <Icons.Oeuvres />;
      case "published": return <Icons.Grid />;
      case "draft": return <Icons.Edit />;
      case "sold": return <Icons.Package />;
      default: return null;
    }
  };

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
              <span className="mo-kpi__icon">{renderKpiIcon(k.icon)}</span>
              <p className="mo-kpi__val" style={{ color: k.color }}>{k.val}</p>
              <p className="mo-kpi__lbl">{k.label}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="mo-toolbar">
          <div className="mo-toolbar__left">
            <div className="mo-search-wrap">
              <span className="mo-search-icon"><Icons.Search /></span>
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
              onClick={() => setView("grid")}><Icons.Grid /></button>
            <button className={`mo-view-btn ${view === "list" ? "mo-view-btn--active" : ""}`}
              onClick={() => setView("list")}><Icons.List /></button>
          </div>
        </div>

        {/* Grid */}
        <div className={`mo-grid ${view === "list" ? "mo-grid--list" : ""}`}>
          {filtered.length === 0 ? (
            <div className="mo-empty">
              <span className="mo-empty__icon"><Icons.EmptyArt /></span>
              <h2 className="mo-empty__title">Aucune œuvre trouvée</h2>
              <p className="mo-empty__sub">Commencez à enrichir votre galerie en ajoutant votre première création.</p>
              <button className="mo-btn mo-btn--primary" onClick={openAdd}>+ Ajouter ma première œuvre</button>
            </div>
          ) : (
            filtered.map((o, idx) => (
              <div key={o.id} className={`mo-card ${view === "list" ? "mo-card--list" : ""}`}
                style={{ animationDelay: `${idx * 0.05}s` }}>
                <div className={`mo-card__status mo-card__status--${o.statut?.toLowerCase() || "brouillon"}`}>{o.statut || "Brouillon"}</div>
                <div className="mo-card__actions-top">
                  <button className="mo-card__action-btn mo-card__action-btn--edit"
                    onClick={() => openEdit(o)} title="Modifier"><Icons.Edit /></button>
                  <button className="mo-card__action-btn mo-card__action-btn--del"
                    onClick={() => setDeleteTarget(o)} title="Supprimer"><Icons.Trash /></button>
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
                    {o.dimensions && <span className="mo-card__meta-item"><Icons.Ruler /> {o.dimensions}</span>}
                    <span className="mo-card__meta-item"><Icons.Package /> {o.nbExemplaires} ex.</span>
                    <span className="mo-card__meta-item"><Icons.Calendar /> {new Date(o.dateRealisation).toLocaleDateString("fr-FR", { day:"2-digit", month:"short", year:"numeric" })}</span>
                  </div>
                </div>
                <div className="mo-card__footer">
                  <span className="mo-card__price">{o.prix} DT</span>
                  <span className="mo-card__date">{o.tags?.slice(0,2).join(" · ") || ""}</span>
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
            <span className="mo-confirm__icon"><Icons.Warning /></span>
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