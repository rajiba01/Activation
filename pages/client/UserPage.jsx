// src/pages/client/UserPage.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../../components/UserHeader";
import Footer from "../../components/Footer";
import "../../styles/UserPage.css";
import { gallerySyncService } from "../../services/gallerySync.service";
import { purchaseService } from "../../services/purchase.service";
import { authService } from "../../services/auth.service";
import PaiementModal from "../../components/PaiementModal";

// ─── SVG Icon Components ───────────────────────────────────────────────────────

const Icon = {
  Search: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Ticket: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
    </svg>
  ),
  Building: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  ),
  Bot: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="10" rx="2"/>
      <circle cx="12" cy="5" r="2"/><path d="M12 7v4"/>
      <line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/>
    </svg>
  ),
  Frame: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="1"/>
      <rect x="7" y="7" width="10" height="10"/>
    </svg>
  ),
  Clock: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Palette: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
    </svg>
  ),
  Eye: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Star: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill="currentColor" stroke="currentColor" strokeWidth="0">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  StarOutline: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Heart: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill="currentColor" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  HeartOutline: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Play: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
      fill="currentColor" stroke="none">
      <polygon points="5 3 19 12 5 21 5 3"/>
    </svg>
  ),
  Lock: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  ),
  Check: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  ThumbsUp: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3z"/>
      <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
    </svg>
  ),
  Close: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Gift: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 12 20 22 4 22 4 12"/>
      <rect x="2" y="7" width="20" height="5"/>
      <line x1="12" y1="22" x2="12" y2="7"/>
      <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
      <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
    </svg>
  ),
  Home: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Smile: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  ),
  Sparkle: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2l1.8 5.4L19.2 9l-5.4 1.8L12 16.2l-1.8-5.4L4.8 9l5.4-1.8L12 2z"/>
      <path d="M19 15l.9 2.7 2.7.9-2.7.9L19 22l-.9-2.7-2.7-.9 2.7-.9L19 15z"/>
      <path d="M5 15l.6 1.8 1.8.6-1.8.6L5 19.8l-.6-1.8-1.8-.6 1.8-.6L5 15z"/>
    </svg>
  ),
  Arrow: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  ),
  CreditCard: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  ),
  Maximize: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
    </svg>
  ),
  UserIcon: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
};

const IC = ({ name, size = 18, style = {}, className = "" }) => {
  const Comp = Icon[name];
  if (!Comp) return null;
  return <Comp width={size} height={size} style={style} className={className} />;
};

// ─── Static Data ──────────────────────────────────────────────────────────────

const HOW_TO_STEPS = [
  { iconName: "Search", titre: "Parcourez les galeries", desc: "Explorez notre sélection filtrée selon vos goûts artistiques." },
  { iconName: "Ticket", titre: "Choisissez & payez",     desc: "Sélectionnez une galerie et payez — sécurisé et instantané." },
  { iconName: "Building", titre: "Entrez en 3D",         desc: "Accédez à l'espace immersif pendant toute la durée choisie." },
  { iconName: "Bot", titre: "Dialoguez avec l'IA",       desc: "Le chatbot attaché à chaque tableau répond à vos questions." },
];

const REVIEWS = [
  {
    id: 1,
    name: "Sophie Marchand",
    avatar: "https://i.pravatar.cc/60?img=47",
    galerie: "Galerie Impressionniste",
    stars: 5,
    text: "Une expérience absolument envoûtante. J'ai passé deux heures dans la galerie sans m'en rendre compte.",
    date: "12 mars 2026",
    helpful: 24,
  },
  {
    id: 2,
    name: "Karim Belhadj",
    avatar: "https://i.pravatar.cc/60?img=68",
    galerie: "Portraits Classiques",
    stars: 5,
    text: "Je ne connaissais rien à Frida Kahlo avant cette visite. Maintenant je comprends pourquoi elle est une icône.",
    date: "8 mars 2026",
    helpful: 18,
  },
  {
    id: 3,
    name: "Amira Ben Salem",
    avatar: "https://i.pravatar.cc/60?img=32",
    galerie: "Art Contemporain",
    stars: 4,
    text: "La galerie d'art contemporain m'a bousculée dans le bon sens. L'IA aide vraiment à comprendre.",
    date: "5 mars 2026",
    helpful: 11,
  },
];

const STYLES = ["Tous", "L'Impressionnisme", "Le Surréalisme", "Art Contemporain", "Le Cubisme", "L'Art Nouveau", "Photographie"];

const AVG_RATING = (REVIEWS.reduce((s, r) => s + r.stars, 0) / REVIEWS.length).toFixed(1);

// ─── Stars Component ──────────────────────────────────────────────────────────

function Stars({ count, size = 14 }) {
  return (
    <div className="up-review-card__stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`up-review-card__star ${i < count ? "up-review-card__star--on" : ""}`}>
          <IC name="Star" size={size} />
        </span>
      ))}
    </div>
  );
}

// ─── Gallery Card ──────────────────────────────────────────────────────────────

function GalleryCard({ galerie, onEnter, isFavorite, onToggleFavorite, hasAccess }) {
  return (
    <div className="up-card">
      {hasAccess && (
        <div className="up-card__badge" style={{ background: "#3A6B35" }}>
          ✅ Accès actif
        </div>
      )}
      {galerie.badge && !hasAccess && (
        <div className="up-card__badge" style={{ background: galerie.badgeColor }}>
          {galerie.badge}
        </div>
      )}
      <button
        className={`up-card__fav ${isFavorite ? "up-card__fav--active" : ""}`}
        onClick={e => { e.stopPropagation(); onToggleFavorite(galerie.id); }}
        aria-label="Ajouter aux favoris"
      >
        {isFavorite ? <IC name="Heart" size={16} /> : <IC name="HeartOutline" size={16} />}
      </button>

      <div className="up-card__img-wrap">
        <img src={galerie.img} alt={galerie.titre} className="up-card__img"
          onError={e => { e.target.src = `https://picsum.photos/400/220?random=${galerie.id}`; }} />
        <div className="up-card__img-overlay">
          <p className="up-card__desc">{galerie.description}</p>
        </div>
      </div>

      <div className="up-card__artiste-row">
        <img src={galerie.artisteAvatar} alt={galerie.artiste} className="up-card__artiste-avatar"
          onError={e => { e.target.src = `https://i.pravatar.cc/40?img=${galerie.id}`; }} />
        <span className="up-card__artiste-name">{galerie.artiste}</span>
        {galerie.nouveaute && <span className="up-card__new-dot" title="Nouveau" />}
      </div>

      <h3 className="up-card__titre">{galerie.titre}</h3>

      <div className="up-card__tags">
        {galerie.tags.map((t, i) => <span key={i} className="up-card__tag">{t}</span>)}
      </div>

      <div className="up-card__stats">
        <span className="up-card__stat">
          <span className="up-card__stat-icon"><IC name="Frame" size={13} /></span>
          {galerie.nbOeuvres} œuvres
        </span>
        <span className="up-card__stat">
          <span className="up-card__stat-icon"><IC name="Eye" size={13} /></span>
          {galerie.nbVisiteurs.toLocaleString()}
        </span>
        <span className="up-card__stat up-card__stat--rating">
          <IC name="Star" size={12} style={{ marginRight: 2 }} />
          {galerie.rating}
        </span>
      </div>

      <div className="up-card__footer">
        <div className="up-card__price-wrap">
          {hasAccess ? (
            <span className="up-card__price" style={{ color: "#3A6B35" }}>Accès déjà acheté</span>
          ) : (
            <>
              <span className="up-card__price">{galerie.prix} DT</span>
              <span className="up-card__duree">Accès {galerie.dureeAcces}</span>
            </>
          )}
        </div>
        <button className="up-card__cta" onClick={() => onEnter(galerie)}>
          {hasAccess ? "🎨 Entrer" : "Entrer"} <IC name="Arrow" size={14} style={{ marginLeft: 4 }} />
        </button>
      </div>
    </div>
  );
}

// ─── Free Trailer Section ──────────────────────────────────────────────────────

function TrailerSection({ onWatch }) {
  const MOSAIC_IMGS = ["/images/galerie/g1.jpg", "/images/galerie/g2.jpg", "/images/galerie/g4.jpg"];
  const features = [
    { iconName: "Building", text: "Galerie 3D complète — navigation libre" },
    { iconName: "Bot",      text: "Chatbot IA sur chaque œuvre" },
    { iconName: "Palette",  text: "5 chefs-d'œuvre soigneusement sélectionnés" },
    { iconName: "Clock",    text: "Accès 30 minutes — sans carte bancaire" },
  ];

  return (
    <div className="up-trailer" style={{ margin: "44px 52px 0" }}>
      <div className="up-trailer__inner">
        <div className="up-trailer__left">
          <div>
            <div className="up-trailer__eyebrow"><span className="up-trailer__eyebrow-dot" />Visite Gratuite</div>
            <h2 className="up-trailer__title">Explorez <span>sans payer</span><br />avec notre Free Trailer</h2>
            <p className="up-trailer__desc">Découvrez l'immersion 3D d'ARTIVISION gratuitement. 5 œuvres sélectionnées, chatbot IA actif, 30 minutes pour tomber amoureux de l'art virtuel — sans engagement.</p>
          </div>
          <div className="up-trailer__features">
            {features.map((f, i) => (
              <div key={i} className="up-trailer__feature">
                <div className="up-trailer__feature-icon"><IC name={f.iconName} size={16} /></div>
                {f.text}
              </div>
            ))}
          </div>
          <div>
            <button className="up-trailer__play-btn" onClick={onWatch}>
              <div className="up-trailer__play-icon"><IC name="Play" size={16} /></div>
              Lancer la visite gratuite
            </button>
            <div className="up-trailer__free-tag"><IC name="Check" size={13} style={{ marginRight: 5 }} />Aucune carte bancaire · Accès immédiat</div>
          </div>
        </div>
        <div className="up-trailer__right">
          <div className="up-trailer__mosaic">
            <div><img src={MOSAIC_IMGS[0]} alt="galerie" className="up-trailer__mosaic-img" /></div>
            <div><img src={MOSAIC_IMGS[1]} alt="galerie" className="up-trailer__mosaic-img" /></div>
            <div style={{ position: "relative" }}>
              <img src={MOSAIC_IMGS[2]} alt="galerie" className="up-trailer__mosaic-img" />
              <div className="up-trailer__overlay-badge"><IC name="Sparkle" size={12} style={{ marginRight: 5 }} />Free Trailer</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Trailer Modal avec temps limité ───────────────────────────────────────────

function TrailerModal({ onClose, onStartFreeTrailer }) {
  const [countdown, setCountdown] = useState(30 * 60);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    if (countdown <= 0) return;
    const t = setInterval(() => setCountdown(c => c - 1), 1000);
    return () => clearInterval(t);
  }, [started, countdown]);

  const fmt = (s) => {
    const m = Math.floor(s / 60), sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const handleStart = () => {
    setStarted(true);
    onStartFreeTrailer();
  };

  return (
    <div className="up-trailer-modal" onClick={onClose}>
      <div className="up-trailer-modal__box" onClick={e => e.stopPropagation()}>
        <div className="up-trailer-modal__top">
          <img src="/images/galerie/g1.jpg" alt="trailer" className="up-trailer-modal__preview-img" />
          <button className="up-trailer-modal__close-btn" onClick={onClose}><IC name="Close" size={16} /></button>
          <div className="up-trailer-modal__center">
            {!started ? (
              <>
                <div className="up-trailer-modal__big-play" onClick={handleStart}><IC name="Play" size={32} /></div>
                <p className="up-trailer-modal__play-label">Démarrer la visite gratuite</p>
                <div className="up-trailer-modal__timer"><IC name="Clock" size={14} style={{ marginRight: 5 }} />30 min d'accès offert</div>
              </>
            ) : (
              <>
                <div className="up-trailer-modal__big-play"><IC name="Building" size={32} /></div>
                <p className="up-trailer-modal__play-label">Visite en cours…</p>
                <div className="up-trailer-modal__timer">
                  <IC name="Clock" size={14} style={{ marginRight: 5 }} />
                  {fmt(countdown)} restantes
                </div>
              </>
            )}
          </div>
        </div>
        <div className="up-trailer-modal__body">
          <h3 className="up-trailer-modal__name">Galerie Gratuite — Free Trailer</h3>
          <p className="up-trailer-modal__info">
            {started 
              ? "Votre visite est en cours. Naviguez librement dans la galerie 3D et interrogez le chatbot sur chaque œuvre."
              : "Découvrez notre galerie gratuite ! 5 œuvres, chatbot IA, navigation 3D. 30 minutes offertes."}
          </p>
          <div className="up-trailer-modal__actions">
            {!started ? (
              <>
                <button className="up-trailer-modal__cta" onClick={handleStart}>
                  <IC name="Play" size={14} style={{ marginRight: 6 }} />Commencer maintenant
                </button>
                <button className="up-trailer-modal__skip" onClick={onClose}>Fermer</button>
              </>
            ) : (
              <>
                <Link to="/test-galerie" className="up-trailer-modal__cta" style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                  <IC name="Building" size={14} style={{ marginRight: 6 }} />Entrer dans la galerie
                </Link>
                <button className="up-trailer-modal__skip" onClick={onClose}>Fermer</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Ajout d'avis Modal ────────────────────────────────────────────────────────

function AddReviewModal({ isOpen, onClose, onSubmit, hasAccess }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = () => {
    if (!hasAccess) {
      alert("Vous devez avoir acheté l'accès à au moins une galerie pour laisser un avis.");
      return;
    }
    if (!comment.trim()) {
      alert("Veuillez écrire un commentaire.");
      return;
    }
    onSubmit({ rating, comment, date: new Date().toISOString() });
    setRating(5);
    setComment("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="ma-modal-overlay" onClick={onClose}>
      <div className="ma-modal" onClick={e => e.stopPropagation()}>
        <h3>📝 Laisser un avis</h3>
        <p>Partagez votre expérience sur ARTIVISION</p>
        
        <div className="review-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={`review-star ${(hoverRating || rating) >= star ? 'active' : ''}`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              ★
            </span>
          ))}
        </div>
        
        <textarea
          className="review-textarea"
          placeholder="Votre avis sur la plateforme..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
        />
        
        <div className="ma-modal-actions">
          <button onClick={onClose}>Annuler</button>
          <button onClick={handleSubmit}>Publier mon avis</button>
        </div>
      </div>
    </div>
  );
}

// ─── Reviews Section avec ajout d'avis ─────────────────────────────────────────

function ReviewsSection({ userHasAccess, onAddReview, reviews, onToggleHelpful }) {
  const [showAll, setShowAll] = useState(false);
  const [showAddReview, setShowAddReview] = useState(false);
  const [helpfulClicked, setHelpfulClicked] = useState({});
  const [helpfulCounts, setHelpfulCounts] = useState(
    Object.fromEntries(reviews.map(r => [r.id, r.helpful || 0]))
  );

  const toggleHelpful = (id) => {
    const wasClicked = helpfulClicked[id];
    setHelpfulClicked(prev => ({ ...prev, [id]: !wasClicked }));
    setHelpfulCounts(prev => ({ ...prev, [id]: wasClicked ? prev[id] - 1 : prev[id] + 1 }));
    if (onToggleHelpful) onToggleHelpful(id);
  };

  const displayed = showAll ? reviews : reviews.slice(0, 3);

  return (
    <section className="up-reviews">
      <div className="up-reviews__head">
        <div className="up-reviews__title-wrap">
          <span className="up-reviews__eyebrow"><IC name="Sparkle" size={12} style={{ marginRight: 5 }} />Témoignages</span>
          <h2 className="up-reviews__title">Ce que disent nos visiteurs</h2>
        </div>
        <div className="up-reviews__avg">
          <span className="up-reviews__avg-num">{AVG_RATING}</span>
          <div className="up-reviews__avg-stars">
            <div className="up-reviews__stars-row">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`up-reviews__star ${i < Math.round(AVG_RATING) ? "up-reviews__star--on" : ""}`}><IC name="Star" size={16} /></span>
              ))}
            </div>
            <span className="up-reviews__avg-count">{reviews.length} avis vérifiés</span>
          </div>
        </div>
      </div>
      
      <div className="up-reviews__grid">
        {displayed.map((r, idx) => (
          <div key={r.id} className="up-review-card" style={{ animationDelay: `${idx * 0.07}s` }}>
            <div className="up-review-card__top">
              <div className="up-review-card__avatar-initial">{r.name.charAt(0)}</div>
              <div className="up-review-card__meta">
                <p className="up-review-card__name">{r.name}</p>
                <p className="up-review-card__galerie">— {r.galerie || "ARTIVISION"}</p>
              </div>
              <Stars count={r.stars} />
            </div>
            <p className="up-review-card__text">"{r.text}"</p>
            <div className="up-review-card__footer">
              <span className="up-review-card__date">{r.date}</span>
              <button className={`up-review-card__helpful ${helpfulClicked[r.id] ? "up-review-card__helpful--active" : ""}`} onClick={() => toggleHelpful(r.id)}>
                <IC name="ThumbsUp" size={13} style={{ marginRight: 5 }} />Utile ({helpfulCounts[r.id]})
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <div className="up-reviews__footer">
        {!showAll && reviews.length > 3 && (
          <button className="up-reviews__more-btn" onClick={() => setShowAll(true)}>
            Voir tous les avis ({reviews.length})
          </button>
        )}
        <button className="up-reviews__add-btn" onClick={() => setShowAddReview(true)}>
          ✍️ Donner mon avis
        </button>
      </div>

      <AddReviewModal
        isOpen={showAddReview}
        onClose={() => setShowAddReview(false)}
        onSubmit={onAddReview}
        hasAccess={userHasAccess}
      />
    </section>
  );
}

// ─── Entry Modal ───────────────────────────────────────────────────────────────

const HOW_TO_MODAL = [
  { iconName: "CreditCard", titre: "Paiement immédiat", desc: "Transaction sécurisée. Votre accès est activé instantanément." },
  { iconName: "Building",   titre: "Galerie 3D",        desc: "Naviguez librement dans l'espace virtuel pendant toute la durée." },
  { iconName: "Bot",        titre: "Chatbot IA",        desc: "Chaque œuvre dispose d'un assistant qui répond à vos questions." },
  { iconName: "Home",       titre: "Essai dans votre intérieur", desc: "Visualisez l'œuvre chez vous avant de l'acheter." },
];

function EntryModal({ galerie, onClose, hasExistingAccess, onOpenPaiement }) {
  const handleOpenPaiement = () => {
    onClose();
    onOpenPaiement({
      type: 'gallery_access',
      itemId: galerie.id,
      montant: galerie.prix,
      description: `Accès à la galerie "${galerie.titre}"`,
      role: 'visiteur',
      galerie: galerie
    });
  };

  if (hasExistingAccess) {
    return (
      <div className="up-modal-backdrop" onClick={onClose}>
        <div className="up-modal" onClick={e => e.stopPropagation()}>
          <button className="up-modal__close" onClick={onClose}><IC name="Close" size={16} /></button>
          <div className="up-modal__success">
            <span className="up-modal__success-icon"><IC name="Sparkle" size={36} /></span>
            <h2 className="up-modal__success-title">Accès déjà disponible !</h2>
            <p className="up-modal__success-sub">Vous avez déjà accès à <strong>"{galerie.titre}"</strong>.</p>
            <div className="up-modal__success-badge"><IC name="Ticket" size={14} style={{ marginRight: 6 }} />Accès actif</div>
            <button className="up-modal__enter-btn" onClick={() => window.location.href = `/galerie-3d/${galerie.id}?role=visiteur`}>
              🏛 Entrer dans la galerie maintenant
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="up-modal-backdrop" onClick={onClose}>
      <div className="up-modal" onClick={e => e.stopPropagation()}>
        <button className="up-modal__close" onClick={onClose}><IC name="Close" size={16} /></button>

        <div className="up-modal__header">
          <span className="up-modal__icon"><IC name="Building" size={28} /></span>
          <h2 className="up-modal__title">{galerie.titre}</h2>
          <p className="up-modal__artiste">par {galerie.artiste}</p>
        </div>

        <div className="up-modal__steps-grid" style={{ marginBottom: 20 }}>
          <p className="up-modal__steps-title">Comment ça marche ?</p>
          {HOW_TO_MODAL.map((s, i) => (
            <div key={i} className="up-modal__step">
              <div className="up-modal__step-icon"><IC name={s.iconName} size={18} /></div>
              <div><p className="up-modal__step-titre">{s.titre}</p><p className="up-modal__step-desc">{s.desc}</p></div>
            </div>
          ))}
        </div>

        <div className="up-modal__recap">
          <div className="up-modal__recap-row"><span>Galerie</span><strong>{galerie.titre}</strong></div>
          <div className="up-modal__recap-row"><span>Durée d'accès</span><strong>{galerie.dureeAcces} après paiement</strong></div>
          <div className="up-modal__recap-row"><span>Nombre d'œuvres</span><strong>{galerie.nbOeuvres} œuvres</strong></div>
          <div className="up-modal__recap-row"><span>Prix d'entrée</span><strong className="up-modal__total">{galerie.prix} DT</strong></div>
        </div>

        <button className="up-modal__pay-btn" onClick={handleOpenPaiement}>
          <IC name="CreditCard" size={16} style={{ marginRight: 7 }} />
          Payer avec carte bancaire — {galerie.prix} DT
        </button>
        <p className="up-modal__secure"><IC name="Lock" size={13} style={{ marginRight: 5 }} />Paiement sécurisé · Accès immédiat</p>
      </div>
    </div>
  );
}

// ─── Custom Scrollbar ──────────────────────────────────────────────────────────

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
      const thumbTop = scrollHeight > clientHeight ? (scrollTop / (scrollHeight - clientHeight)) * (100 - thumbH) : 0;
      thumb.style.height = `${thumbH}vh`;
      thumb.style.top = `${thumbTop}vh`;
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
    return () => { window.removeEventListener("scroll", update); window.removeEventListener("resize", update); };
  }, []);

  const onMouseDown = (e) => {
    isDragging.current = true;
    dragStart.current = e.clientY;
    scrollStart.current = window.scrollY;
    const onMove = (ev) => {
      if (!isDragging.current) return;
      const { scrollHeight, clientHeight } = document.documentElement;
      window.scrollTo(0, scrollStart.current + ((ev.clientY - dragStart.current) / clientHeight) * scrollHeight);
    };
    const onUp = () => {
      isDragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (<div className="up-csb-track"><div className="up-csb-thumb" ref={thumbRef} onMouseDown={onMouseDown} /></div>);
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function UserPage() {
  const navigate = useNavigate();
  const [styleFilter, setStyleFilter] = useState("Tous");
  const [sortBy, setSortBy] = useState("populaire");
  const [favorites, setFavorites] = useState([]);
  const [selectedGalerie, setSelectedGalerie] = useState(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [search, setSearch] = useState("");
  
  // États utilisateur
  const [userInfo, setUserInfo] = useState(null);
  
  // États paiement
  const [showPaiementModal, setShowPaiementModal] = useState(false);
  const [paymentItem, setPaymentItem] = useState(null);
  
  // États galeries
  const [galleries, setGalleries] = useState([]);
  const [loadingGalleries, setLoadingGalleries] = useState(true);
  const [userAccesses, setUserAccesses] = useState({});
  
  // États avis
  const [userReviews, setUserReviews] = useState(REVIEWS);
  const [userHasAccess, setUserHasAccess] = useState(false);

  // ✅ Fonction pour le Trailer - redirige vers /test-galerie
  const handleWatchTrailer = () => {
    navigate("/test-galerie");
  };

  // Charger les infos de l'utilisateur connecté
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const response = await authService.getCurrentUser();
        const userData = response.data?.data || response.data;
        setUserInfo(userData);
      } catch (error) {
        console.error("Erreur chargement utilisateur:", error);
      }
    };
    loadUserInfo();
  }, []);

  // Charger les galeries et les accès
  useEffect(() => {
    const loadData = async () => {
      setLoadingGalleries(true);
      try {
        const data = await gallerySyncService.getPublishedGalleriesForVisitors();
        
        const formatted = data.map(g => ({
          id: g.id,
          titre: g.nom,
          artiste: g.artiste_nom || "Artiste",
          artisteAvatar: g.artiste_avatar || "/images/artiste/default.jpg",
          img: g.cover_image || "/images/galerie/default.jpg",
          style: g.style || "Art Contemporain",
          prix: g.prix_visiteur || 5,
          dureeAcces: g.duree_acces || "48h",
          nbOeuvres: g.nb_oeuvres_max || 0,
          nbVisiteurs: g.visiteurs_count || 0,
          rating: g.rating || 4.5,
          badge: g.badge || null,
          badgeColor: g.badge_color || null,
          description: g.description || "",
          tags: g.tags || ["Art", "Exposition"],
          nouveaute: false,
        }));
        
        setGalleries(formatted);
        
        // Vérifier les accès pour chaque galerie
        let hasAnyAccess = false;
        const accesses = {};
        for (const g of formatted) {
          try {
            const access = await purchaseService.checkAccess(g.id, 'visiteur');
            accesses[g.id] = access.has_access;
            if (access.has_access) hasAnyAccess = true;
          } catch (err) {
            accesses[g.id] = false;
          }
        }
        setUserAccesses(accesses);
        setUserHasAccess(hasAnyAccess);
        
      } catch (error) {
        console.error("Erreur chargement galeries:", error);
      } finally {
        setLoadingGalleries(false);
      }
    };
    
    loadData();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  };

  const filtered = galleries
    .filter(g => styleFilter === "Tous" || g.style === styleFilter)
    .filter(g => !search || g.titre.toLowerCase().includes(search.toLowerCase()) || g.artiste.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "populaire")  return b.nbVisiteurs - a.nbVisiteurs;
      if (sortBy === "prix-asc")   return a.prix - b.prix;
      if (sortBy === "prix-desc")  return b.prix - a.prix;
      if (sortBy === "rating")     return b.rating - a.rating;
      if (sortBy === "nouveau")    return b.nouveaute - a.nouveaute;
      return 0;
    });

  const handleOpenPaiement = (item) => {
    setPaymentItem(item);
    setShowPaiementModal(true);
  };

  const handlePaiementSuccess = async () => {
    setShowPaiementModal(false);
    
    if (paymentItem?.type === 'gallery_access' && paymentItem.galerie) {
      try {
        const result = await purchaseService.purchaseGalleryAccess(paymentItem.galerie.id);
        console.log("✅ Accès acheté:", result.data);
        
        setUserAccesses(prev => ({ ...prev, [paymentItem.galerie.id]: true }));
        setUserHasAccess(true);
        
        navigate(`/galerie-3d/${paymentItem.galerie.id}`, { 
          state: { role: "visiteur", hasPurchasedAccess: true }
        });
      } catch (error) {
        console.error("❌ Erreur achat accès:", error);
        alert("Erreur lors de l'achat de l'accès: " + (error.response?.data?.error || error.message));
      }
    }
  };

  const handleAddReview = (review) => {
    const newReview = {
      id: userReviews.length + 1,
      name: userInfo?.prenom || userInfo?.Prenom || userInfo?.username || "Visiteur",
      avatar: "",
      galerie: "ARTIVISION",
      stars: review.rating,
      text: review.comment,
      date: new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }),
      helpful: 0,
    };
    setUserReviews(prev => [newReview, ...prev]);
    alert("✅ Merci pour votre avis !");
  };

  const getUserFirstName = () => {
    if (userInfo) {
      return userInfo.prenom || userInfo.Prenom || userInfo.username || "Visiteur";
    }
    return "Visiteur";
  };

  if (loadingGalleries) {
    return (
      <>
        <Header />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '20px' }}>
          <div className="g3d-loader-spinner" style={{ width: 50, height: 50 }} />
          <p style={{ color: '#8B6030' }}>Chargement des galeries...</p>
        </div>
        <Footer />
      </>
    );
  }

  const purchasedCount = Object.values(userAccesses).filter(v => v === true).length;

  return (
    <>
      <Header />

      {showOnboarding && (
        <div className="up-onboard">
          <span className="up-onboard__icon"><IC name="Gift" size={22} /></span>
          <div className="up-onboard__text">
            <p className="up-onboard__title">Bienvenue, {getUserFirstName()} ! Votre compte est activé.</p>
            <p className="up-onboard__sub">Explorez les galeries virtuelles 3D, payez l'entrée et laissez l'IA vous guider dans chaque œuvre.</p>
          </div>
          <div className="up-onboard__steps">
            {["Choisir une galerie", "Payer l'entrée", "Explorer en 3D"].map((s, i) => (
              <div key={i} className="up-onboard__step"><span className="up-onboard__step-num">{i + 1}</span>{s}</div>
            ))}
          </div>
          <button className="up-onboard__close" onClick={() => setShowOnboarding(false)}><IC name="Close" size={14} /></button>
        </div>
      )}

      <div className="up-welcome">
        <div>
          <span className="up-welcome__greeting"><IC name="Sparkle" size={12} style={{ marginRight: 5 }} />Espace Visiteur</span>
          <h1 className="up-welcome__title">Bonjour, <em>{getUserFirstName()}</em></h1>
          <p className="up-welcome__sub">Découvrez des galeries d'art virtuelles en 3D — payez l'entrée et explorez à votre rythme.</p>
        </div>
        <div className="up-welcome__stats">
          <div className="up-welcome__stat"><span className="up-welcome__stat-val">{galleries.length}</span><span className="up-welcome__stat-lbl">Galeries</span></div>
          <div className="up-welcome__stat"><span className="up-welcome__stat-val">{purchasedCount}</span><span className="up-welcome__stat-lbl">Achetées</span></div>
          <div className="up-welcome__stat"><span className="up-welcome__stat-val">{favorites.length}</span><span className="up-welcome__stat-lbl">Favoris</span></div>
        </div>
      </div>

      <div className="up-howto" style={{ margin: "40px 52px 0" }}>
        {HOW_TO_STEPS.map((s, i) => (
          <div key={i} className="up-howto__step">
            <span className="up-howto__num">0{i + 1}</span>
            <div className="up-howto__icon"><IC name={s.iconName} size={22} /></div>
            <div><p className="up-howto__titre">{s.titre}</p><p className="up-howto__desc">{s.desc}</p></div>
          </div>
        ))}
      </div>

      <TrailerSection onWatch={handleWatchTrailer} />

      <div className="up-section-head">
        <div className="up-section-head__left">
          <span className="up-section-label">Nos Galeries</span>
          <span className="up-section-count">{filtered.length} galerie{filtered.length > 1 ? "s" : ""}</span>
        </div>
        <div className="up-filters-right">
          <div className="up-search-wrap">
            <span className="up-search-icon"><IC name="Search" size={15} /></span>
            <input className="up-search" placeholder="Galerie, artiste…" value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="up-sort-select" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="populaire">Plus populaires</option>
            <option value="rating">Mieux notées</option>
            <option value="prix-asc">Prix croissant</option>
            <option value="prix-desc">Prix décroissant</option>
            <option value="nouveau">Nouveautés</option>
          </select>
        </div>
      </div>

      <div className="up-style-pills">
        {STYLES.map(s => (
          <button key={s} className={`up-style-btn ${styleFilter === s ? "up-style-btn--active" : ""}`} onClick={() => setStyleFilter(s)}>{s}</button>
        ))}
      </div>

      <div className="up-grid-wrap">
        <div className="up-grid">
          {filtered.length === 0 ? (
            <div className="up-empty"><span className="up-empty__icon"><IC name="Palette" size={40} /></span><p className="up-empty__text">Aucune galerie trouvée.</p></div>
          ) : (
            filtered.map((g, idx) => (
              <div key={g.id} style={{ animationDelay: `${idx * 0.06}s` }}>
                <GalleryCard
                  galerie={g}
                  onEnter={setSelectedGalerie}
                  isFavorite={favorites.includes(g.id)}
                  onToggleFavorite={toggleFavorite}
                  hasAccess={userAccesses[g.id] || false}
                />
              </div>
            ))
          )}
        </div>
      </div>

      <ReviewsSection 
        userHasAccess={userHasAccess}
        onAddReview={handleAddReview}
        reviews={userReviews}
      />
      <Footer />

      {showTrailerModal && (
        <TrailerModal 
          onClose={() => setShowTrailerModal(false)} 
          onStartFreeTrailer={() => console.log("Visite gratuite démarrée")}
        />
      )}
      {selectedGalerie && (
        <EntryModal 
          galerie={selectedGalerie} 
          onClose={() => setSelectedGalerie(null)} 
          hasExistingAccess={userAccesses[selectedGalerie.id] || false}
          onOpenPaiement={handleOpenPaiement}
        />
      )}

      {showPaiementModal && paymentItem && (
        <PaiementModal
          isOpen={showPaiementModal}
          onClose={() => setShowPaiementModal(false)}
          onSuccess={handlePaiementSuccess}
          montant={paymentItem.montant}
          description={paymentItem.description}
          type={paymentItem.type}
          itemId={paymentItem.itemId}
          role={paymentItem.role}
        />
      )}

      <CustomScrollbar />
    </>
  );
}