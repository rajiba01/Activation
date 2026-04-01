import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import { useAuth } from "../hook/userHook";  // 🆕 Importer le hook
import {
  User, AtSign, Mail, Lock, Calendar,
  MapPin, Phone, ChevronLeft, ChevronRight,
} from "lucide-react";
import '../styles/InscriptionUser.css';

// =============== CONSTANTES ===============
const IMG = {
  logo:   "/images/logo_artivision.png",
  image1: "/images/inscription/image1.png",
  image2: "/images/inscription/image2.png",
  image3: "/images/inscription/image3.png",
  image4: "/images/inscription/cadre1.png",
  image5: "/images/inscription/image5.png",
  image6: "/images/inscription/image6.png",
};

// =============== DONNÉES DES PRÉFÉRENCES AVEC IMAGES ===============
const ART_PREFERENCES = [
  { id: 1, name: "La Renaissance", image: "/images/art/renaissance.jpg" },
  { id: 2, name: "Le Baroque", image: "/images/art/baroque.jpg" },
  { id: 3, name: "L'Impressionnisme", image: "/images/art/impressionnisme.jpg" },
  { id: 4, name: "L'Art Nouveau", image: "/images/art/art-nouveau.jpg" },
  { id: 5, name: "Le Cubisme", image: "/images/art/cubisme.jpg" },
  { id: 6, name: "Le Surréalisme", image: "/images/art/surrealisme.jpg" },
  { id: 7, name: "Le Pop Art", image: "/images/art/pop-art.jpg" },
  { id: 8, name: "Le Street Art", image: "/images/art/street-art.jpg" },
  { id: 9, name: "Le Fauvisme", image: "/images/art/fauvisme.jpg" },
  { id: 10, name: "La Calligraphie", image: "/images/art/calligraphie.jpg" },
  { id: 11, name: "Le Naturalisme", image: "/images/art/naturalisme.jpg" },
];

// =============== COMPOSANTS RÉUTILISABLES ===============
function Particles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.8 + 0.3,
      alpha: Math.random() * 0.55 + 0.1,
      speed: Math.random() * 0.3 + 0.08,
      drift: (Math.random() - 0.5) * 0.2,
      phase: Math.random() * Math.PI * 2,
    }));

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      t += 0.01;

      particles.forEach((p) => {
        const pulse = Math.sin(t + p.phase) * 0.25;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(247, 213, 179, ${Math.max(0, p.alpha + pulse)})`;
        ctx.fill();

        p.y -= p.speed;
        p.x += p.drift;

        if (p.y < -5) {
          p.y = canvas.height + 5;
          p.x = Math.random() * canvas.width;
        }
      });

      raf = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="av-particles" />;
}

function FieldIcon({ icon: Icon }) {
  return (
    <span className="av-field-icon">
      <Icon size={15} strokeWidth={1.8} />
    </span>
  );
}

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

// =============== COMPOSANT DE CARTE PRÉFÉRENCE ===============
function ArtPreferenceCard({ preference, isSelected, onToggle }) {
  return (
    <div 
      className={`av-pref-card ${isSelected ? 'av-pref-card--selected' : ''}`}
      onClick={() => onToggle(preference.name)}
    >
      <div className="av-pref-card-image-container">
        <img 
          src={preference.image} 
          alt={preference.name}
          className="av-pref-card-image"
          onError={(e) => {
            e.target.src = "/images/art/placeholder.jpg";
          }}
        />
        {isSelected && (
          <div className="av-pref-card-check">
            <span>✓</span>
          </div>
        )}
      </div>
      <p className="av-pref-card-name">{preference.name}</p>
    </div>
  );
}

// =============== COMPOSANT PRINCIPAL DES PRÉFÉRENCES ===============
function ArtisticPreferences({ selected, onToggle }) {
  return (
    <div className="av-pref-grid-cards">
      {ART_PREFERENCES.map((pref) => (
        <ArtPreferenceCard
          key={pref.id}
          preference={pref}
          isSelected={selected.includes(pref.name)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

// =============== PAGE PRINCIPALE ===============
export default function InscriptionUser() {
  const [nom, setNom] = useState("");
  const [prenom, setPrenom] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedPreferences, setSelectedPreferences] = useState([]);

  // 🆕 État pour la connexion
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [view, setView] = useState("register");  // "register" ou "login"
  const [step, setStep] = useState(1);
  const [ready, setReady] = useState(false);
  
  const { register, login, loading, error } = useAuth();  // 🆕 Ajouter login
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 60);
    return () => clearTimeout(t);
  }, []);

  // 🆕 Fonction pour changer de vue
  const switchView = (v) => {
    setView(v);
    setStep(1);
    setLoginUsername("");  // Réinitialiser les champs login
    setLoginPassword("");
  };

  const togglePreference = (pref) => {
    setSelectedPreferences(prev =>
      prev.includes(pref)
        ? prev.filter(p => p !== pref)
        : [...prev, pref]
    );
  };

  // 🎯 FONCTION : Inscription
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (view === "register" && step === 2) {
      try {
        const userData = {
          nom,
          prenom,
          username,
          email,
          password,
          preferences: selectedPreferences,
          role: 'visiteur',
        };

        console.log('Données à envoyer:', userData);

        const result = await register(userData);
        console.log('Inscription réussie:', result);

        alert("Inscription réussie ! Veuillez vous connecter.");
        switchView("login");  // 🆕 Aller à la page login au lieu de naviguer

      } catch (err) {
        console.error('Erreur inscription:', err);
        alert('Erreur : ' + err.message);
      }
    }
  };

  // 🆕 FONCTION : Connexion
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('📤 Tentative connexion avec:', { loginUsername, loginPassword });
      
      await login(loginUsername, loginPassword);
      
      console.log('✅ Connexion réussie');
      alert('Connexion réussie !');
      navigate('/');  // Aller à l'accueil

    } catch (err) {
      console.error('❌ Erreur connexion:', err);
    }
  };

  const canProceedStep1 = nom.trim() && prenom.trim() && username.trim() &&
    email.trim() && password.trim();

  return (
    <div className="av-root">
      {/* Panneau Gauche */}
      <div className={`av-left-panel${ready ? " av-left-ready" : ""}`}>
        <Particles />
        <img src={IMG.image4} alt="" className="av-left-deco" aria-hidden="true" />

        <div className="av-logo-wrap av-anim-fade-down">
          <img src={IMG.logo} alt="Artivision" className="av-logo-img" />
          <span className="av-logo-name">ARTIVISION</span>
        </div>

        <div className="av-left-content av-anim-fade-up">
          {view === "login" ? (
            <p className="av-welcome-text">Bienvenue<br /> chez<br /> Artivision</p>
          ) : (
            <>
              <p className="av-already-text">Vous avez un compte déjà?</p>
              <button className="av-login-btn" onClick={() => switchView("login")}>
                Se connecter
              </button>
            </>
          )}
        </div>

        <div className="av-socials av-anim-fade-up">
          {["instagram", "facebook", "x", "linkedin"].map((s) => (
            <SocialIcon key={s} name={s} />
          ))}
        </div>
      </div>

      <div className="av-divider" />

      {/* Panneau Droit */}
      <div className="av-right-panel">
        <Particles />
        <img src={IMG.image1} alt="" className="av-hand" aria-hidden="true" />
        <img src={IMG.image2} alt="" className="av-orn-top-right" aria-hidden="true" />
        <img src={IMG.image3} alt="" className="av-orn-bottom-left" aria-hidden="true" />

        <div className="av-card-wrapper">
          <img src={IMG.image6} alt="" className="av-card-bg" aria-hidden="true" />
          <img src={IMG.image5} alt="médaillon" className="av-medallion" />

          <div className="av-card-content">
            <form onSubmit={view === "login" ? handleLoginSubmit : handleSubmit}>
              
              {/* 🆕 FORMULAIRE CONNEXION */}
              {view === "login" && (
                <>
                  <h2 className="av-parch-title">Connectez-vous</h2>
                  
                  <div className="av-field-wrap">
                    <FieldIcon icon={AtSign} />
                    <input 
                      className="av-field-input" 
                      type="text" 
                      placeholder="Nom d'utilisateur"
                      value={loginUsername}
                      onChange={(e) => setLoginUsername(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  <div className="av-field-wrap">
                    <FieldIcon icon={Lock} />
                    <input 
                      className="av-field-input" 
                      type="password" 
                      placeholder="Mot de passe"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      disabled={loading}
                    />
                  </div>

                  {error && <p className="error">{error}</p>}

                  <button type="submit" className="av-submit-btn" disabled={loading}>
                    {loading ? 'Connexion en cours...' : 'Se connecter'}
                  </button>

                  <p className="av-switch-link">
                    Pas encore de compte ?{" "}
                    <span className="av-switch-anchor" onClick={() => switchView("register")}>
                      S'inscrire
                    </span>
                  </p>
                </>
              )}

              {/* Inscription - Étape 1 */}
              {view === "register" && step === 1 && (
                <>
                  <h2 className="av-parch-title">Inscription membre</h2>
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
                    <input className="av-field-input" type="text" placeholder="Nom d'utilisateur"
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

                  {error && <p className="error">{error}</p>}

                  <button
                    type="button"
                    className={`av-submit-btn${!canProceedStep1 ? " av-submit-btn--disabled" : ""}`}
                    onClick={() => canProceedStep1 && setStep(2)}
                    disabled={!canProceedStep1}
                  >
                    <span>Suivant</span>
                    <ChevronRight size={15} strokeWidth={2} />
                  </button>
                </>
              )}

              {/* Inscription - Étape 2 */}
              {view === "register" && step === 2 && (
                <>
                  <h2 className="av-parch-title">Choisissez vos styles artistiques préférés</h2>
                  <div className="av-steps-indicator">
                    <div className="av-step-dot av-step-dot--done" onClick={() => setStep(1)} />
                    <div className="av-step-line av-step-line--done" />
                    <div className="av-step-dot av-step-dot--active" />
                  </div>

                  <div className="av-preferences-wrapper">
                    <ArtisticPreferences
                      selected={selectedPreferences}
                      onToggle={togglePreference}
                    />

                    <div className="av-selection-summary">
                      <span className="av-selection-count">
                        {selectedPreferences.length} style{selectedPreferences.length > 1 ? 's' : ''} sélectionné{selectedPreferences.length > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {error && <p className="error">{error}</p>}

                  <button
                    type="submit"
                    className={`av-submit-btn ${selectedPreferences.length === 0 ? 'av-submit-btn--disabled' : ''}`}
                    disabled={selectedPreferences.length === 0 || loading}
                  >
                    {loading ? 'Inscription en cours...' : "S'inscrire"}
                  </button>

                  <button type="button" className="av-back-btn" onClick={() => setStep(1)} disabled={loading}>
                    <ChevronLeft size={10} strokeWidth={2} />
                    <span>Retour</span>
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}