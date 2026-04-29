import { useState, useRef } from "react";
import Header from "../components/Headerartiste";
import Footer from "../components/Footer";
import "../styles/AjouterGalerie.css";

// ─── Décors disponibles ───────────────────────────────────────────────────────
const decors = [
  { id: "classique", label: "Classique",    img: "/images/galerie/g1.jpg", desc: "Murs blancs, éclairage neutre" },
  { id: "moderne",   label: "Moderne",      img: "/images/galerie/g2.jpg", desc: "Design épuré, lignes droites" },
  { id: "baroque",   label: "Baroque",      img: "/images/galerie/g3.jpg", desc: "Ornements dorés, ambiance royale" },
];

// ─── Scrollbar ────────────────────────────────────────────────────────────────
import { useEffect } from "react";

function CustomScrollbar() {
  const thumbRef = useRef(null);
  const isDragging = useRef(false);
  const dragStart = useRef(0);
  const scrollStart = useRef(0);

  useEffect(() => {
    const update = () => {
      const thumb = thumbRef.current;
      if (!thumb) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const ratio = clientHeight / scrollHeight;
      const thumbH = Math.max(ratio * 100, 8);
      const thumbTop = (scrollTop / (scrollHeight - clientHeight)) * (100 - thumbH);
      thumb.style.height = `${thumbH}vh`;
      thumb.style.top = `${thumbTop}vh`;
    };
    window.addEventListener("scroll", update);
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const onMouseDown = (e) => {
    isDragging.current = true;
    dragStart.current = e.clientY;
    scrollStart.current = window.scrollY;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  const onMouseMove = (e) => {
    if (!isDragging.current) return;
    const dy = e.clientY - dragStart.current;
    const { scrollHeight, clientHeight } = document.documentElement;
    window.scrollTo(0, scrollStart.current + (dy / clientHeight) * scrollHeight);
  };
  const onMouseUp = () => {
    isDragging.current = false;
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);
  };

  return (
    <div className="ag-csb-track">
      <div className="ag-csb-thumb" ref={thumbRef} onMouseDown={onMouseDown} />
    </div>
  );
}

// ─── Surface Visualizer ───────────────────────────────────────────────────────
function SurfaceVisualizer({ x, y }) {
  const maxDim = 200;
  const xNum = parseFloat(x) || 0;
  const yNum = parseFloat(y) || 0;
  const maxVal = Math.max(xNum, yNum, 1);
  const w = Math.max((xNum / maxVal) * maxDim, 8);
  const h = Math.max((yNum / maxVal) * maxDim, 8);
  const area = xNum && yNum ? (xNum * yNum).toFixed(1) : "—";

  return (
    <div className="ag-surface-visual">
      <div className="ag-surface-canvas">
        <div
          className="ag-surface-rect"
          style={{ width: `${w}px`, height: `${h}px` }}
        >
          <span className="ag-surface-label">{xNum > 0 && yNum > 0 ? `${xNum}m × ${yNum}m` : ""}</span>
        </div>
        {/* Axes */}
        <div className="ag-surface-axis ag-surface-axis--x">
          <span>X</span>
        </div>
        <div className="ag-surface-axis ag-surface-axis--y">
          <span>Y</span>
        </div>
      </div>
      <div className="ag-surface-info">
        <div className="ag-surface-stat">
          <span className="ag-surface-stat-label">Superficie</span>
          <span className="ag-surface-stat-value">{area} m²</span>
        </div>
        <div className="ag-surface-stat">
          <span className="ag-surface-stat-label">Capacité estimée</span>
          <span className="ag-surface-stat-value">
            {xNum && yNum ? `${Math.floor(xNum * yNum / 4)} œuvres` : "—"}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current, steps }) {
  return (
    <div className="ag-steps">
      {steps.map((s, i) => (
        <div key={i} className={`ag-step ${i < current ? "ag-step--done" : ""} ${i === current ? "ag-step--active" : ""}`}>
          <div className="ag-step__circle">
            {i < current ? "✓" : i + 1}
          </div>
          <span className="ag-step__label">{s}</span>
          {i < steps.length - 1 && <div className="ag-step__line" />}
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function AjouterGalerie() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    nom: "",
    surfaceX: "",
    surfaceY: "",
    localisation: "",
    description: "",
    decor: "",
    tarif: "",
    nbOeuvres: "",
    duree: "",
    prixVisiteur: "",
    images: [],
  });

  const [errors, setErrors] = useState({});
  const fileRef = useRef(null);

  const steps = ["Informations", "Dimensions", "Décor & Images", "Tarification"];

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: "" }));
  };

  // ── Validation par étape ──
  const validate = () => {
    const errs = {};
    if (step === 0) {
      if (!form.nom.trim())          errs.nom = "Le nom est requis";
      if (!form.localisation.trim()) errs.localisation = "La localisation est requise";
      if (!form.description.trim())  errs.description = "La description est requise";
    }
    if (step === 1) {
      if (!form.surfaceX || isNaN(form.surfaceX) || +form.surfaceX <= 0)
        errs.surfaceX = "Valeur invalide";
      if (!form.surfaceY || isNaN(form.surfaceY) || +form.surfaceY <= 0)
        errs.surfaceY = "Valeur invalide";
    }
    if (step === 2) {
      if (!form.decor) errs.decor = "Choisissez un décor";
    }
    if (step === 3) {
      if (!form.tarif || isNaN(form.tarif) || +form.tarif <= 0)
        errs.tarif = "Tarif invalide";
      if (!form.nbOeuvres || isNaN(form.nbOeuvres) || +form.nbOeuvres <= 0)
        errs.nbOeuvres = "Nombre invalide";
      if (!form.duree)       errs.duree = "Choisissez une durée";
      if (!form.prixVisiteur || isNaN(form.prixVisiteur) || +form.prixVisiteur <= 0)
        errs.prixVisiteur = "Prix invalide";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => { if (validate()) setStep(s => s + 1); };
  const prev = () => setStep(s => s - 1);

  const handleImages = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(f => ({ file: f, url: URL.createObjectURL(f), name: f.name }));
    setForm(f => ({ ...f, images: [...f.images, ...previews] }));
  };

  const removeImage = (i) => {
    setForm(f => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  };

  const handleSubmit = () => {
    if (validate()) setSubmitted(true);
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <>
        <Header />
        <main className="ag-page">
          <div className="ag-success">
            <div className="ag-success__icon">✦</div>
            <h2 className="ag-success__title">Galerie créée avec succès !</h2>
            <p className="ag-success__sub">
              Votre galerie <strong>"{form.nom}"</strong> a été soumise pour validation.<br />
              Notre équipe l'examinera sous 24h.
            </p>
            <div className="ag-success__recap">
              <div className="ag-recap-row"><span>Surface</span><span>{form.surfaceX} × {form.surfaceY} m²</span></div>
              <div className="ag-recap-row"><span>Décor</span><span>{decors.find(d => d.id === form.decor)?.label}</span></div>
              <div className="ag-recap-row"><span>Œuvres max</span><span>{form.nbOeuvres}</span></div>
              <div className="ag-recap-row"><span>Durée location</span><span>{form.duree}</span></div>
              <div className="ag-recap-row"><span>Prix visiteur</span><span>{form.prixVisiteur} DT</span></div>
            </div>
            <div className="ag-success__actions">
              <a href="/dashboard-artiste" className="ag-btn ag-btn--primary">Voir mon dashboard</a>
              <button className="ag-btn ag-btn--ghost" onClick={() => { setSubmitted(false); setStep(0); setForm({ nom:"",surfaceX:"",surfaceY:"",localisation:"",description:"",decor:"",tarif:"",nbOeuvres:"",duree:"",prixVisiteur:"",images:[] }); }}>
                Ajouter une autre galerie
              </button>
            </div>
          </div>
        </main>
        <Footer />
        <CustomScrollbar />
      </>
    );
  }

  return (
    <>
      <Header />

      <main className="ag-page">

        {/* ── Page Header ── */}
        <div className="ag-hero">
          <div className="ag-hero__bg" />
          <div className="ag-hero__content">
            <p className="ag-hero__eyebrow">✦ Espace Artiste</p>
            <h1 className="ag-hero__title">Ajouter une Galerie</h1>
            <p className="ag-hero__sub">Créez votre espace d'exposition virtuel en 3D en quelques étapes</p>
          </div>
        </div>

        {/* ── Form Container ── */}
        <div className="ag-container">

          {/* Step Indicator */}
          <StepIndicator current={step} steps={steps} />

          <div className="ag-form-card">

            {/* ══ STEP 0 — Informations ══ */}
            {step === 0 && (
              <div className="ag-form-step">
                <div className="ag-form-step__header">
                  <span className="ag-step-num">01</span>
                  <div>
                    <h2 className="ag-form-step__title">Informations générales</h2>
                    <p className="ag-form-step__sub">Décrivez votre galerie pour attirer les visiteurs</p>
                  </div>
                </div>

                <div className="ag-fields">
                  {/* Nom */}
                  <div className="ag-field">
                    <label className="ag-label">Nom de la galerie <span className="ag-required">*</span></label>
                    <input
                      className={`ag-input ${errors.nom ? "ag-input--error" : ""}`}
                      placeholder="Ex: Galerie des Lumières"
                      value={form.nom}
                      onChange={e => set("nom", e.target.value)}
                    />
                    {errors.nom && <span className="ag-error">{errors.nom}</span>}
                  </div>

                  {/* Localisation */}
                  <div className="ag-field">
                    <label className="ag-label">Localisation <span className="ag-required">*</span></label>
                    <div className="ag-input-icon-wrap">
                      <span className="ag-input-icon">📍</span>
                      <input
                        className={`ag-input ag-input--icon ${errors.localisation ? "ag-input--error" : ""}`}
                        placeholder="Ex: Paris, France"
                        value={form.localisation}
                        onChange={e => set("localisation", e.target.value)}
                      />
                    </div>
                    {errors.localisation && <span className="ag-error">{errors.localisation}</span>}
                  </div>

                  {/* Description */}
                  <div className="ag-field">
                    <label className="ag-label">Description <span className="ag-required">*</span></label>
                    <textarea
                      className={`ag-textarea ${errors.description ? "ag-input--error" : ""}`}
                      placeholder="Décrivez l'ambiance, le thème et les œuvres exposées dans votre galerie…"
                      rows={5}
                      value={form.description}
                      onChange={e => set("description", e.target.value)}
                    />
                    <div className="ag-char-count">{form.description.length} / 500</div>
                    {errors.description && <span className="ag-error">{errors.description}</span>}
                  </div>
                </div>
              </div>
            )}

            {/* ══ STEP 1 — Dimensions ══ */}
            {step === 1 && (
              <div className="ag-form-step">
                <div className="ag-form-step__header">
                  <span className="ag-step-num">02</span>
                  <div>
                    <h2 className="ag-form-step__title">Dimensions de l'espace</h2>
                    <p className="ag-form-step__sub">Définissez la surface de votre galerie virtuelle</p>
                  </div>
                </div>

                <div className="ag-dimensions-layout">
                  <div className="ag-fields ag-fields--inline">
                    <div className="ag-field">
                      <label className="ag-label">Largeur X (mètres) <span className="ag-required">*</span></label>
                      <div className="ag-input-icon-wrap">
                        <span className="ag-input-icon ag-input-icon--unit">m</span>
                        <input
                          type="number" min="1" max="200"
                          className={`ag-input ag-input--icon ${errors.surfaceX ? "ag-input--error" : ""}`}
                          placeholder="Ex: 20"
                          value={form.surfaceX}
                          onChange={e => set("surfaceX", e.target.value)}
                        />
                      </div>
                      {errors.surfaceX && <span className="ag-error">{errors.surfaceX}</span>}
                    </div>

                    <div className="ag-dim-separator">×</div>

                    <div className="ag-field">
                      <label className="ag-label">Longueur Y (mètres) <span className="ag-required">*</span></label>
                      <div className="ag-input-icon-wrap">
                        <span className="ag-input-icon ag-input-icon--unit">m</span>
                        <input
                          type="number" min="1" max="200"
                          className={`ag-input ag-input--icon ${errors.surfaceY ? "ag-input--error" : ""}`}
                          placeholder="Ex: 30"
                          value={form.surfaceY}
                          onChange={e => set("surfaceY", e.target.value)}
                        />
                      </div>
                      {errors.surfaceY && <span className="ag-error">{errors.surfaceY}</span>}
                    </div>
                  </div>

                  {/* Visualizer */}
                  <SurfaceVisualizer x={form.surfaceX} y={form.surfaceY} />
                </div>
              </div>
            )}

            {/* ══ STEP 2 — Décor & Images ══ */}
            {step === 2 && (
              <div className="ag-form-step">
                <div className="ag-form-step__header">
                  <span className="ag-step-num">03</span>
                  <div>
                    <h2 className="ag-form-step__title">Décor & Images</h2>
                    <p className="ag-form-step__sub">Choisissez l'ambiance visuelle de votre galerie</p>
                  </div>
                </div>

                {/* Décor selector */}
                <div className="ag-field ag-field--wide">
                  <label className="ag-label">Type de décor <span className="ag-required">*</span></label>
                  <div className="ag-decor-grid">
                    {decors.map(d => (
                      <div
                        key={d.id}
                        className={`ag-decor-card ${form.decor === d.id ? "ag-decor-card--selected" : ""}`}
                        onClick={() => set("decor", d.id)}
                      >
                        <div className="ag-decor-img-wrap">
                          <img src={d.img} alt={d.label} className="ag-decor-img" />
                          <div className="ag-decor-overlay" />
                          {form.decor === d.id && (
                            <div className="ag-decor-check">✓</div>
                          )}
                        </div>
                        <div className="ag-decor-info">
                          <p className="ag-decor-label">{d.label}</p>
                          <p className="ag-decor-desc">{d.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {errors.decor && <span className="ag-error">{errors.decor}</span>}
                </div>

                {/* Upload images */}
                <div className="ag-field ag-field--wide">
                  <label className="ag-label">Images de votre galerie</label>
                  <div
                    className="ag-upload-zone"
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => {
                      e.preventDefault();
                      const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
                      const previews = files.map(f => ({ file: f, url: URL.createObjectURL(f), name: f.name }));
                      setForm(f => ({ ...f, images: [...f.images, ...previews] }));
                    }}
                  >
                    <input ref={fileRef} type="file" accept="image/*" multiple hidden onChange={handleImages} />
                    <div className="ag-upload-icon">🖼</div>
                    <p className="ag-upload-text">Glissez vos images ici ou <span className="ag-upload-link">cliquez pour parcourir</span></p>
                    <p className="ag-upload-hint">PNG, JPG, WEBP • Max 10 Mo par image</p>
                  </div>

                  {form.images.length > 0 && (
                    <div className="ag-image-previews">
                      {form.images.map((img, i) => (
                        <div key={i} className="ag-image-thumb">
                          <img src={img.url} alt={img.name} />
                          <button className="ag-image-remove" onClick={() => removeImage(i)}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ══ STEP 3 — Tarification ══ */}
            {step === 3 && (
              <div className="ag-form-step">
                <div className="ag-form-step__header">
                  <span className="ag-step-num">04</span>
                  <div>
                    <h2 className="ag-form-step__title">Tarification & Capacité</h2>
                    <p className="ag-form-step__sub">Configurez les conditions d'accès à votre galerie</p>
                  </div>
                </div>

                <div className="ag-fields ag-fields--2col">

                  {/* Tarif mensuel */}
                  <div className="ag-field">
                    <label className="ag-label">Tarif mensuel (DT) <span className="ag-required">*</span></label>
                    <p className="ag-field-hint">Coût de location de l'espace pour vous</p>
                    <div className="ag-input-icon-wrap">
                      <span className="ag-input-icon ag-input-icon--unit">DT</span>
                      <input
                        type="number" min="0"
                        className={`ag-input ag-input--icon ${errors.tarif ? "ag-input--error" : ""}`}
                        placeholder="Ex: 69"
                        value={form.tarif}
                        onChange={e => set("tarif", e.target.value)}
                      />
                    </div>
                    {errors.tarif && <span className="ag-error">{errors.tarif}</span>}
                  </div>

                  {/* Nb œuvres */}
                  <div className="ag-field">
                    <label className="ag-label">Nombre max d'œuvres <span className="ag-required">*</span></label>
                    <p className="ag-field-hint">Capacité d'exposition de votre galerie</p>
                    <div className="ag-input-icon-wrap">
                      <span className="ag-input-icon">🖼</span>
                      <input
                        type="number" min="1"
                        className={`ag-input ag-input--icon ${errors.nbOeuvres ? "ag-input--error" : ""}`}
                        placeholder="Ex: 30"
                        value={form.nbOeuvres}
                        onChange={e => set("nbOeuvres", e.target.value)}
                      />
                    </div>
                    {errors.nbOeuvres && <span className="ag-error">{errors.nbOeuvres}</span>}
                  </div>

                  {/* Durée de location */}
                  <div className="ag-field">
                    <label className="ag-label">Durée d'accès visiteur <span className="ag-required">*</span></label>
                    <p className="ag-field-hint">Durée d'accès après paiement du visiteur</p>
                    <div className="ag-select-wrap">
                      <select
                        className={`ag-select ${errors.duree ? "ag-input--error" : ""}`}
                        value={form.duree}
                        onChange={e => set("duree", e.target.value)}
                      >
                        <option value="">Choisir une durée…</option>
                        <option value="24h">24 heures</option>
                        <option value="48h">48 heures</option>
                        <option value="72h">72 heures</option>
                        <option value="7j">7 jours</option>
                        <option value="illimité">Accès illimité</option>
                      </select>
                      <span className="ag-select-arrow">▾</span>
                    </div>
                    {errors.duree && <span className="ag-error">{errors.duree}</span>}
                  </div>

                  {/* Prix visiteur */}
                  <div className="ag-field">
                    <label className="ag-label">Prix d'entrée visiteur (DT) <span className="ag-required">*</span></label>
                    <p className="ag-field-hint">Montant payé par chaque visiteur</p>
                    <div className="ag-input-icon-wrap">
                      <span className="ag-input-icon ag-input-icon--unit">DT</span>
                      <input
                        type="number" min="0" step="0.5"
                        className={`ag-input ag-input--icon ${errors.prixVisiteur ? "ag-input--error" : ""}`}
                        placeholder="Ex: 5"
                        value={form.prixVisiteur}
                        onChange={e => set("prixVisiteur", e.target.value)}
                      />
                    </div>
                    {errors.prixVisiteur && <span className="ag-error">{errors.prixVisiteur}</span>}
                  </div>
                </div>

                {/* Récap financier */}
                {form.tarif && form.prixVisiteur && form.nbOeuvres && (
                  <div className="ag-recap-finance">
                    <p className="ag-recap-finance__title">✦ Estimation financière</p>
                    <div className="ag-recap-finance__grid">
                      <div className="ag-recap-finance__item">
                        <span>Coût mensuel</span>
                        <strong>{form.tarif} DT</strong>
                      </div>
                      <div className="ag-recap-finance__item">
                        <span>Seuil de rentabilité</span>
                        <strong>{Math.ceil(form.tarif / form.prixVisiteur)} visiteurs</strong>
                      </div>
                      <div className="ag-recap-finance__item ag-recap-finance__item--highlight">
                        <span>Revenu si galerie pleine</span>
                        <strong>{(form.prixVisiteur * form.nbOeuvres * 0.7).toFixed(0)} DT / mois*</strong>
                      </div>
                    </div>
                    <p className="ag-recap-finance__note">* Estimation basée sur 70% de taux d'occupation • Commission plateforme incluse</p>
                  </div>
                )}
              </div>
            )}

            {/* ── Navigation buttons ── */}
            <div className="ag-form-nav">
              {step > 0 && (
                <button className="ag-btn ag-btn--ghost-dark" onClick={prev}>
                  ← Précédent
                </button>
              )}
              <div className="ag-form-nav__right">
                <span className="ag-step-counter">Étape {step + 1} / {steps.length}</span>
                {step < steps.length - 1 ? (
                  <button className="ag-btn ag-btn--primary" onClick={next}>
                    Suivant →
                  </button>
                ) : (
                  <button className="ag-btn ag-btn--gold" onClick={handleSubmit}>
                    ✦ Créer la galerie
                  </button>
                )}
              </div>
            </div>

          </div>

          {/* Sidebar info */}
          <aside className="ag-sidebar">
            <div className="ag-info-card">
              <div className="ag-info-card__icon">💡</div>
              <h3 className="ag-info-card__title">Conseils</h3>
              {step === 0 && (
                <ul className="ag-info-list">
                  <li>Choisissez un nom mémorable et évocateur</li>
                  <li>Une bonne description attire 3× plus de visiteurs</li>
                  <li>Précisez le thème artistique de votre galerie</li>
                </ul>
              )}
              {step === 1 && (
                <ul className="ag-info-list">
                  <li>Une surface de 20×30m est idéale pour débuter</li>
                  <li>Prévoyez 4m² minimum par œuvre exposée</li>
                  <li>Les grandes galeries attirent plus de visiteurs</li>
                </ul>
              )}
              {step === 2 && (
                <ul className="ag-info-list">
                  <li>Le décor Classique est le plus apprécié des visiteurs</li>
                  <li>Ajoutez 5-10 images de haute qualité</li>
                  <li>Les images HD augmentent le taux de conversion</li>
                </ul>
              )}
              {step === 3 && (
                <ul className="ag-info-list">
                  <li>Un prix entre 3-8 DT maximise les visites</li>
                  <li>48h d'accès est la durée la plus populaire</li>
                  <li>70% des revenus d'entrée vous reviennent</li>
                </ul>
              )}
            </div>

            <div className="ag-info-card ag-info-card--dark">
              <div className="ag-info-card__icon">📋</div>
              <h3 className="ag-info-card__title">Récapitulatif</h3>
              <div className="ag-recap-mini">
                <div className="ag-recap-mini__row">
                  <span>Nom</span>
                  <span>{form.nom || "—"}</span>
                </div>
                <div className="ag-recap-mini__row">
                  <span>Surface</span>
                  <span>{form.surfaceX && form.surfaceY ? `${form.surfaceX}×${form.surfaceY}m` : "—"}</span>
                </div>
                <div className="ag-recap-mini__row">
                  <span>Décor</span>
                  <span>{decors.find(d => d.id === form.decor)?.label || "—"}</span>
                </div>
                <div className="ag-recap-mini__row">
                  <span>Prix visiteur</span>
                  <span>{form.prixVisiteur ? `${form.prixVisiteur} DT` : "—"}</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </main>

      <Footer />
      <CustomScrollbar />
    </>
  );
}