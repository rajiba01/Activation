import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  User, AtSign, Mail, Lock, AlignLeft,
  Palette, Camera, ChevronLeft, ChevronRight,
} from "lucide-react";
import '../styles/InscriptionArtiste.css';

const IMG = {
  logo:   "/images/logo_artivision.png",
  image1: "/images/inscription/image1.png",
  image2: "/images/inscription/image2.png",
  image3: "/images/inscription/image3.png",
  image4: "/images/inscription/cadre1.png",
  image5: "/images/inscription/image5.png",
  image6: "/images/inscription/image6.png",
};

const styleOptions = [
  "Peinture à l'huile",
  "Aquarelle",
  "Art numérique",
  "Photographie",
  "Sculpture",
  "Dessin au crayon",
];

/* ── Particules dorées flottantes ── */
function Particles() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3, alpha: Math.random() * 0.55 + 0.1,
      speed: Math.random() * 0.3 + 0.08, drift: (Math.random() - 0.5) * 0.2,
      phase: Math.random() * Math.PI * 2,
    }));
    let t = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.01;
      particles.forEach((p) => {
        const pulse = Math.sin(t + p.phase) * 0.25;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247, 213, 179, ${Math.max(0, p.alpha + pulse)})`; ctx.fill();
        p.y -= p.speed; p.x += p.drift;
        if (p.y < -5) { p.y = canvas.height + 5; p.x = Math.random() * canvas.width; }
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);
  return <canvas ref={canvasRef} className="av-particles" />;
}

/* ── Icône de champ ── */
function FieldIcon({ icon: Icon }) {
  return (
    <span className="av-field-icon">
      <Icon size={15} strokeWidth={1.8} />
    </span>
  );
}

/* ── Dropdown — portal vers document.body ── */
function DropdownPortal({ value, onChange, open, setOpen }) {
  const btnRef  = useRef(null);
  const listRef = useRef(null);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    if (open && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setCoords({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: r.width });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (listRef.current && !listRef.current.contains(e.target) &&
          btnRef.current  && !btnRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, setOpen]);

  const list = (
    <ul
      ref={listRef}
      className="av-drop-list"
      style={{
        position: "absolute",
        top:      coords.top,
        left:     coords.left,
        width:    coords.width,
        zIndex:   99999,
      }}
    >
      {styleOptions.map((o) => (
        <li key={o} className="av-drop-item"
          onClick={() => { onChange(o); setOpen(false); }}>
          {o}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="av-field-wrap av-field-wrap--drop">
      <FieldIcon icon={Palette} />
      <button
        ref={btnRef}
        className="av-drop-btn"
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
      >
        <span>{value || "Votre style d'art"}</span>
        <span className={`av-drop-arrow${open ? " av-drop-arrow--open" : ""}`}>▾</span>
      </button>
      {open && createPortal(list, document.body)}
    </div>
  );
}

/* ════════════ COMPOSANT PRINCIPAL ════════════ */
export default function ArtivisionPage() {
  const [nom, setNom]           = useState("");
  const [prenom, setPrenom]     = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");

  const [bio, setBio]           = useState("");
  const [style, setStyle]       = useState("");
  const [photo, setPhoto]       = useState(null);
  const [dropOpen, setDropOpen] = useState(false);

  const [view, setView]   = useState("register");
  const [step, setStep]   = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  const switchView = (v) => { setView(v); setStep(1); };
  
  const handlePhotoChange = (e) => {
    if (e.target.files[0]) {
      const fileName = e.target.files[0].name;
      // Tronquer le nom si trop long (garde l'extension)
      const maxLength = 20;
      if (fileName.length > maxLength) {
        const extension = fileName.split('.').pop();
        const nameWithoutExt = fileName.substring(0, fileName.lastIndexOf('.'));
        const truncatedName = nameWithoutExt.substring(0, maxLength - 3 - extension.length) + '...' + extension;
        setPhoto(truncatedName);
      } else {
        setPhoto(fileName);
      }
    }
  };
  
  const canProceed = nom.trim() && prenom.trim() && username.trim() && email.trim() && password.trim();

  // Message conditionnel pour le panneau gauche
  const leftPanelContent = view === "login" ? (
    <>
      <p className="av-welcome-text">Bienvenue<br /> chez<br /> Artivision</p>
    
    </>
  ) : (
    <>
      <p className="av-already-text">Vous avez un compte déjà?</p>
      <button className="av-login-btn" onClick={() => switchView("login")}>
        Se connecter
      </button>
    </>
  );

  return (
    <div className="av-root">

      {/* ══════════ PANNEAU GAUCHE ══════════ */}
      <div className={`av-left-panel${ready ? " av-left-ready" : ""}`}>
        <Particles />
        {/* image4 — cadre décoratif filigrane */}
        <img src={IMG.image4} alt="" className="av-left-deco" aria-hidden="true" />

        <div className="av-logo-wrap av-anim-fade-down">
          <img src={IMG.logo} alt="Artivision" className="av-logo-img" />
          <span className="av-logo-name">ARTIVISION</span>
        </div>
        <div className="av-left-content av-anim-fade-up">
          {leftPanelContent}
        </div>
        <div className="av-socials av-anim-fade-up">
          {["instagram", "facebook", "x", "linkedin"].map((s) => (
            <SocialIcon key={s} name={s} />
          ))}
        </div>
      </div>

      <div className="av-divider" />

      {/* ══════════ PANNEAU DROIT ══════════ */}
      <div className="av-right-panel">
        <Particles />
        <img src={IMG.image1} alt="" className="av-hand"            aria-hidden="true" />
        <img src={IMG.image2} alt="" className="av-orn-top-right"   aria-hidden="true" />
        <img src={IMG.image3} alt="" className="av-orn-bottom-left" aria-hidden="true" />

        <div className="av-card-wrapper">
          <img src={IMG.image6} alt="" className="av-card-bg" aria-hidden="true" />
          <img src={IMG.image5} alt="médaillon" className="av-medallion" />

          <div className="av-card-content">

            {/* ─────── CONNEXION ─────── */}
            {view === "login" && (
              <>
                <h2 className="av-parch-title">Connectez-vous</h2>
                <div className="av-field-wrap">
                  <FieldIcon icon={Mail} />
                  <input className="av-field-input" type="email" placeholder="Email ou username" />
                </div>
                <div className="av-field-wrap">
                  <FieldIcon icon={Lock} />
                  <input className="av-field-input" type="password" placeholder="Mot de passe" />
                </div>
                <button className="av-submit-btn">Se connecter</button>
                <p className="av-switch-link">
                  Pas encore de compte ?{" "}
                  <span className="av-switch-anchor" onClick={() => switchView("register")}>
                    S'inscrire
                  </span>
                </p>
              </>
            )}

            {/* ─────── ÉTAPE 1 ─────── */}
            {view === "register" && step === 1 && (
              <>
                <h2 className="av-parch-title">Inscrivez vous au espace artiste</h2>
                <div className="av-steps-indicator">
                  <div className="av-step-dot av-step-dot--active" />
                  <div className="av-step-line" />
                  <div className="av-step-dot" />
                </div>

                <div className="av-field-wrap">
                  <FieldIcon icon={User} />
                  <input className="av-field-input" type="text" placeholder="Nom"
                    value={nom} onChange={(e) => setNom(e.target.value)} />
                </div>
                <div className="av-field-wrap">
                  <FieldIcon icon={User} />
                  <input className="av-field-input" type="text" placeholder="Prénom"
                    value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                </div>
                <div className="av-field-wrap">
                  <FieldIcon icon={AtSign} />
                  <input className="av-field-input" type="text" placeholder="User name"
                    value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div className="av-field-wrap">
                  <FieldIcon icon={Mail} />
                  <input className="av-field-input" type="email" placeholder="Email"
                    value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="av-field-wrap">
                  <FieldIcon icon={Lock} />
                  <input className="av-field-input" type="password" placeholder="Mot de passe"
                    value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button
                  className={`av-submit-btn${!canProceed ? " av-submit-btn--disabled" : ""}`}
                  onClick={() => canProceed && setStep(2)}
                  disabled={!canProceed}
                >
                  <span>Suivant</span>
                  <ChevronRight size={15} strokeWidth={2} />
                </button>
              </>
            )}

            {/* ─────── ÉTAPE 2 ─────── */}
            {view === "register" && step === 2 && (
              <>
                <h2 className="av-parch-title">Votre profil artiste</h2>
                <div className="av-steps-indicator">
                  <div className="av-step-dot av-step-dot--done" onClick={() => setStep(1)} />
                  <div className="av-step-line av-step-line--done" />
                  <div className="av-step-dot av-step-dot--active" />
                </div>

                <div className="av-field-wrap">
                  <FieldIcon icon={AlignLeft} />
                  <input className="av-field-input" type="text" placeholder="Biographie"
                    value={bio} onChange={(e) => setBio(e.target.value)} />
                </div>

                <DropdownPortal
                  value={style}
                  onChange={setStyle}
                  open={dropOpen}
                  setOpen={setDropOpen}
                />

                <div className="av-field-wrap">
                  <FieldIcon icon={Camera} />
                  <label className="av-photo-label">
                    <span className="av-photo-text">{photo || "Choisir une photo"}</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="av-photo-input"
                      onChange={handlePhotoChange}
                      id="photo-upload"
                    />
                  </label>
                </div>

                <button className="av-submit-btn">S'inscrire</button>

                <button className="av-back-btn" onClick={() => setStep(1)}>
                  <ChevronLeft size={14} strokeWidth={2} />
                  <span>Retour</span>
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Icônes réseaux sociaux SVG ── */
function SocialIcon({ name }) {
  const icons = {
    instagram: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" width="20" height="20">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
    facebook: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
    x: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
    linkedin: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  };
  return <span className="av-social-icon" title={name}>{icons[name]}</span>;
}