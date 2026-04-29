import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/UserPage.css";

// ─── Static Data ──────────────────────────────────────────────────────────────

const USER = {
  prenom: "Yasmine",
  nom: "Azouri",
  avatar: "https://i.pravatar.cc/80?img=32",
  galeriesVisitees: 3,
};

const HOW_TO_STEPS = [
  { icon: "🔍", titre: "Parcourez les galeries", desc: "Explorez notre sélection filtrée selon vos goûts artistiques." },
  { icon: "🎟", titre: "Choisissez & payez",     desc: "Sélectionnez une galerie et payez — sécurisé et instantané." },
  { icon: "🏛", titre: "Entrez en 3D",            desc: "Accédez à l'espace immersif pendant toute la durée choisie." },
  { icon: "🤖", titre: "Dialoguez avec l'IA",     desc: "Le chatbot attaché à chaque tableau répond à vos questions." },
];

const TRAILER_GALLERY = {
  id: 0,
  titre: "Galerie Lumière — Visite Gratuite",
  artiste: "Vincent Van Gogh",
  img: "/images/galerie/g1.jpg",
  desc: "Découvrez l'ambiance d'une vraie galerie ARTIVISION sans débourser un centime. 5 œuvres sélectionnées, chatbot IA actif, immersion 3D complète.",
  nbOeuvres: 5,
  duree: "30 min",
};

const GALLERIES = [
  {
    id: 1,
    titre: "Galerie Impressionniste",
    artiste: "Vincent Van Gogh",
    artisteAvatar: "/images/artiste/vangogh.jpg",
    img: "/images/galerie/g1.jpg",
    style: "L'Impressionnisme",
    prix: 5, dureeAcces: "48h",
    nbOeuvres: 24, nbVisiteurs: 1240, rating: 4.8,
    badge: "Populaire", badgeColor: "#8B2020",
    description: "Plongez dans l'univers lumineux de Van Gogh. Chaque toile raconte une histoire de lumière et d'émotion pure.",
    tags: ["Peinture", "XIXe siècle", "Lumière"],
    nouveaute: false,
  },
  {
    id: 2,
    titre: "Art Contemporain",
    artiste: "Marlene Dumas",
    artisteAvatar: "/images/artiste/marlene.jpg",
    img: "/images/galerie/g2.jpg",
    style: "Art Contemporain",
    prix: 8, dureeAcces: "72h",
    nbOeuvres: 40, nbVisiteurs: 890, rating: 4.6,
    badge: "Nouveau", badgeColor: "#3A6B35",
    description: "Une exploration audacieuse des œuvres contemporaines. Questionnez votre rapport au monde à travers l'art d'aujourd'hui.",
    tags: ["Contemporain", "Abstrait", "Émotion"],
    nouveaute: true,
  },
  {
    id: 3,
    titre: "Sculpture & Volumes",
    artiste: "Pablo Picasso",
    artisteAvatar: "/images/artiste/pablo.jpg",
    img: "/images/galerie/g3.jpg",
    style: "Le Cubisme",
    prix: 6, dureeAcces: "48h",
    nbOeuvres: 18, nbVisiteurs: 670, rating: 4.7,
    badge: null, badgeColor: null,
    description: "Des formes qui transcendent l'espace. Explorez la troisième dimension à travers les sculptures cubistes de Picasso.",
    tags: ["Sculpture", "Cubisme", "Volume"],
    nouveaute: false,
  },
  {
    id: 4,
    titre: "Portraits Classiques",
    artiste: "Frida Kahlo",
    artisteAvatar: "/images/artiste/frida.jpg",
    img: "/images/galerie/g4.jpg",
    style: "Le Surréalisme",
    prix: 7, dureeAcces: "7j",
    nbOeuvres: 32, nbVisiteurs: 2100, rating: 4.9,
    badge: "Best-seller", badgeColor: "#C9A040",
    description: "L'âme humaine capturée pour l'éternité par Frida Kahlo. Une plongée intime dans l'identité, la douleur et la beauté.",
    tags: ["Portrait", "Surréalisme", "Identité"],
    nouveaute: false,
  },
  {
    id: 5,
    titre: "Art Abstrait",
    artiste: "Wassily Kandinsky",
    artisteAvatar: "https://i.pravatar.cc/60?img=15",
    img: "/images/galerie/g5.jpg",
    style: "L'Art Nouveau",
    prix: 4, dureeAcces: "24h",
    nbOeuvres: 28, nbVisiteurs: 540, rating: 4.5,
    badge: null, badgeColor: null,
    description: "Couleurs et formes libres de toute contrainte. Une symphonie visuelle qui éveille les sens et libère l'imaginaire.",
    tags: ["Abstrait", "Couleur", "Liberté"],
    nouveaute: true,
  },
  {
    id: 6,
    titre: "Photographie d'Art",
    artiste: "Leila Mansouri",
    artisteAvatar: "https://i.pravatar.cc/60?img=32",
    img: "/images/galerie/g6.png",
    style: "Photographie",
    prix: 3, dureeAcces: "48h",
    nbOeuvres: 56, nbVisiteurs: 780, rating: 4.4,
    badge: "Coup de cœur", badgeColor: "#7B3F8B",
    description: "L'instant figé comme une œuvre vivante. La photographe Leila Mansouri capture l'invisible dans chaque cliché.",
    tags: ["Photo", "Instant", "Émotion"],
    nouveaute: false,
  },
];

const REVIEWS = [
  {
    id: 1,
    name: "Sophie Marchand",
    avatar: "https://i.pravatar.cc/60?img=47",
    galerie: "Galerie Impressionniste",
    stars: 5,
    text: "Une expérience absolument envoûtante. J'ai passé deux heures dans la galerie sans m'en rendre compte. Le chatbot m'a expliqué chaque tableau avec une précision époustouflante.",
    date: "12 mars 2026",
    helpful: 24,
  },
  {
    id: 2,
    name: "Karim Belhadj",
    avatar: "https://i.pravatar.cc/60?img=68",
    galerie: "Portraits Classiques",
    stars: 5,
    text: "Je ne connaissais rien à Frida Kahlo avant cette visite. Maintenant je comprends pourquoi elle est une icône. L'immersion 3D est bluffante — on se sent vraiment dans la galerie.",
    date: "8 mars 2026",
    helpful: 18,
  },
  {
    id: 3,
    name: "Amira Ben Salem",
    avatar: "https://i.pravatar.cc/60?img=32",
    galerie: "Art Contemporain",
    stars: 4,
    text: "La galerie d'art contemporain m'a bousculée dans le bon sens. Certaines œuvres m'ont laissée perplexe, mais c'est exactement ça l'art contemporain ! L'IA aide vraiment à comprendre.",
    date: "5 mars 2026",
    helpful: 11,
  },
  {
    id: 4,
    name: "Lucas Devereux",
    avatar: "https://i.pravatar.cc/60?img=12",
    galerie: "Galerie Impressionniste",
    stars: 5,
    text: "Le trailer gratuit m'a convaincu d'acheter l'accès complet. Excellent moyen de découvrir sans risque. La qualité des œuvres numérisées est remarquable.",
    date: "1 mars 2026",
    helpful: 32,
  },
  {
    id: 5,
    name: "Nina Volkov",
    avatar: "https://i.pravatar.cc/60?img=25",
    galerie: "Sculpture & Volumes",
    stars: 4,
    text: "Pouvoir tourner autour des sculptures en 3D est une révolution. On voit des détails impossibles à percevoir dans un vrai musée bondé. Je recommande vivement.",
    date: "27 fév 2026",
    helpful: 9,
  },
  {
    id: 6,
    name: "Omar Tazi",
    avatar: "https://i.pravatar.cc/60?img=56",
    galerie: "Photographie d'Art",
    stars: 5,
    text: "La galerie photo de Leila Mansouri est tout simplement poétique. À 3 DT l'entrée, c'est le meilleur rapport qualité-prix de toute la plateforme. Une vraie pépite.",
    date: "22 fév 2026",
    helpful: 41,
  },
];

const STYLES = ["Tous", "L'Impressionnisme", "Le Surréalisme", "Art Contemporain", "Le Cubisme", "L'Art Nouveau", "Photographie"];

const AVG_RATING = (REVIEWS.reduce((s, r) => s + r.stars, 0) / REVIEWS.length).toFixed(1);

// ─── Sub-components ───────────────────────────────────────────────────────────

function Stars({ count, size = 14 }) {
  return (
    <div className="up-review-card__stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={`up-review-card__star ${i < count ? "up-review-card__star--on" : ""}`}
          style={{ fontSize: size }}>★</span>
      ))}
    </div>
  );
}

// ─── Gallery Card ──────────────────────────────────────────────────────────────

function GalleryCard({ galerie, onEnter, isFavorite, onToggleFavorite }) {
  return (
    <div className="up-card">
      {galerie.badge && (
        <div className="up-card__badge" style={{ background: galerie.badgeColor }}>
          {galerie.badge}
        </div>
      )}
      <button
        className={`up-card__fav ${isFavorite ? "up-card__fav--active" : ""}`}
        onClick={e => { e.stopPropagation(); onToggleFavorite(galerie.id); }}
        aria-label="Ajouter aux favoris"
      >
        {isFavorite ? "♥" : "♡"}
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
        <span className="up-card__stat"><span className="up-card__stat-icon">🖼</span> {galerie.nbOeuvres} œuvres</span>
        <span className="up-card__stat"><span className="up-card__stat-icon">👁</span> {galerie.nbVisiteurs.toLocaleString()}</span>
        <span className="up-card__stat up-card__stat--rating">★ {galerie.rating}</span>
      </div>

      <div className="up-card__footer">
        <div className="up-card__price-wrap">
          <span className="up-card__price">{galerie.prix} DT</span>
          <span className="up-card__duree">Accès {galerie.dureeAcces}</span>
        </div>
        <button className="up-card__cta" onClick={() => onEnter(galerie)}>Entrer ›</button>
      </div>
    </div>
  );
}

// ─── Free Trailer Section ──────────────────────────────────────────────────────

function TrailerSection({ onWatch }) {
  const MOSAIC_IMGS = [
    "/images/galerie/g1.jpg",
    "/images/galerie/g2.jpg",
    "/images/galerie/g4.jpg",
  ];

  return (
    <div className="up-trailer" style={{ margin: "44px 52px 0" }}>
      <div className="up-trailer__inner">

        {/* Left */}
        <div className="up-trailer__left">
          <div>
            <div className="up-trailer__eyebrow">
              <span className="up-trailer__eyebrow-dot" />
              Visite Gratuite
            </div>
            <h2 className="up-trailer__title">
              Explorez <span>sans payer</span><br />avec notre Free Trailer
            </h2>
            <p className="up-trailer__desc">
              Découvrez l'immersion 3D d'ARTIVISION gratuitement. 5 œuvres sélectionnées, chatbot IA actif,
              30 minutes pour tomber amoureux de l'art virtuel — sans engagement.
            </p>
          </div>

          <div className="up-trailer__features">
            {[
              { icon: "🏛", text: "Galerie 3D complète — navigation libre" },
              { icon: "🤖", text: "Chatbot IA sur chaque œuvre" },
              { icon: "🎨", text: "5 chefs-d'œuvre soigneusement sélectionnés" },
              { icon: "⏱",  text: "Accès 30 minutes — sans carte bancaire" },
            ].map((f, i) => (
              <div key={i} className="up-trailer__feature">
                <div className="up-trailer__feature-icon">{f.icon}</div>
                {f.text}
              </div>
            ))}
          </div>

          <div>
            <button className="up-trailer__play-btn" onClick={onWatch}>
              <div className="up-trailer__play-icon">▶</div>
              Lancer la visite gratuite
            </button>
            <div className="up-trailer__free-tag">
              ✓ Aucune carte bancaire · Accès immédiat
            </div>
          </div>
        </div>

        {/* Right — mosaic */}
        <div className="up-trailer__right">
          <div className="up-trailer__mosaic">
            <div>
              <img src={MOSAIC_IMGS[0]} alt="galerie" className="up-trailer__mosaic-img"
                onError={e => { e.target.src = "https://picsum.photos/400/420?random=10"; }} />
            </div>
            <div>
              <img src={MOSAIC_IMGS[1]} alt="galerie" className="up-trailer__mosaic-img"
                onError={e => { e.target.src = "https://picsum.photos/400/210?random=11"; }} />
            </div>
            <div style={{ position: "relative" }}>
              <img src={MOSAIC_IMGS[2]} alt="galerie" className="up-trailer__mosaic-img"
                onError={e => { e.target.src = "https://picsum.photos/400/210?random=12"; }} />
              <div className="up-trailer__overlay-badge">✦ Free Trailer</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// ─── Trailer Modal ─────────────────────────────────────────────────────────────

function TrailerModal({ onClose }) {
  const [countdown, setCountdown] = useState(30 * 60); // 30min in seconds
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

  return (
    <div className="up-trailer-modal" onClick={onClose}>
      <div className="up-trailer-modal__box" onClick={e => e.stopPropagation()}>

        <div className="up-trailer-modal__top">
          <img src="/images/galerie/g1.jpg" alt="trailer" className="up-trailer-modal__preview-img"
            onError={e => { e.target.src = "https://picsum.photos/700/340?random=20"; }} />
          <button className="up-trailer-modal__close-btn" onClick={onClose}>✕</button>

          <div className="up-trailer-modal__center">
            {!started ? (
              <>
                <div className="up-trailer-modal__big-play" onClick={() => setStarted(true)}>▶</div>
                <p className="up-trailer-modal__play-label">Démarrer la visite gratuite</p>
                <div className="up-trailer-modal__timer">⏱ 30 min d'accès offert</div>
              </>
            ) : (
              <>
                <div className="up-trailer-modal__big-play">🏛</div>
                <p className="up-trailer-modal__play-label">Visite en cours…</p>
                <div className="up-trailer-modal__timer">
                  ⏱ {fmt(countdown)} restantes
                </div>
              </>
            )}
          </div>
        </div>

        <div className="up-trailer-modal__body">
          <h3 className="up-trailer-modal__name">Galerie Lumière — Free Trailer</h3>
          <p className="up-trailer-modal__info">
            {started
              ? "Votre visite est en cours. Naviguez librement dans la galerie 3D et interrogez le chatbot sur chaque œuvre."
              : "5 œuvres de Van Gogh, chatbot IA, navigation 3D. Aucun paiement requis — 30 minutes offertes pour découvrir ARTIVISION."}
          </p>
          <div className="up-trailer-modal__actions">
            {!started ? (
              <>
                <button className="up-trailer-modal__cta" onClick={() => setStarted(true)}>
                  ▶ Commencer maintenant
                </button>
                <button className="up-trailer-modal__skip" onClick={onClose}>
                  Fermer
                </button>
              </>
            ) : (
              <>
                <a href="/galerie/trailer" className="up-trailer-modal__cta"
                  style={{ display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>
                  🏛 Entrer dans la galerie
                </a>
                <button className="up-trailer-modal__skip" onClick={onClose}>Fermer</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Reviews Section ───────────────────────────────────────────────────────────

function ReviewsSection() {
  const [helpfulClicked, setHelpfulClicked] = useState({});
  const [helpfulCounts, setHelpfulCounts] = useState(
    Object.fromEntries(REVIEWS.map(r => [r.id, r.helpful]))
  );
  const [showAll, setShowAll] = useState(false);

  const toggleHelpful = (id) => {
    const wasClicked = helpfulClicked[id];
    setHelpfulClicked(prev => ({ ...prev, [id]: !wasClicked }));
    setHelpfulCounts(prev => ({ ...prev, [id]: wasClicked ? prev[id] - 1 : prev[id] + 1 }));
  };

  const displayed = showAll ? REVIEWS : REVIEWS.slice(0, 3);

  return (
    <section className="up-reviews">
      <div className="up-reviews__head">
        <div className="up-reviews__title-wrap">
          <span className="up-reviews__eyebrow">✦ Témoignages</span>
          <h2 className="up-reviews__title">Ce que disent nos visiteurs</h2>
        </div>
        <div className="up-reviews__avg">
          <span className="up-reviews__avg-num">{AVG_RATING}</span>
          <div className="up-reviews__avg-stars">
            <div className="up-reviews__stars-row">
              {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} className={`up-reviews__star ${i < Math.round(AVG_RATING) ? "up-reviews__star--on" : ""}`}>★</span>
              ))}
            </div>
            <span className="up-reviews__avg-count">{REVIEWS.length} avis vérifiés</span>
          </div>
        </div>
      </div>

      <div className="up-reviews__grid">
        {displayed.map((r, idx) => (
          <div key={r.id} className="up-review-card" style={{ animationDelay: `${idx * 0.07}s` }}>
            <div className="up-review-card__top">
              <img src={r.avatar} alt={r.name} className="up-review-card__avatar"
                onError={e => { e.target.src = `https://i.pravatar.cc/60?img=${r.id + 10}`; }} />
              <div className="up-review-card__meta">
                <p className="up-review-card__name">{r.name}</p>
                <p className="up-review-card__galerie">— {r.galerie}</p>
              </div>
              <Stars count={r.stars} />
            </div>
            <p className="up-review-card__text">"{r.text}"</p>
            <div className="up-review-card__footer">
              <span className="up-review-card__date">{r.date}</span>
              <button
                className={`up-review-card__helpful ${helpfulClicked[r.id] ? "up-review-card__helpful--active" : ""}`}
                onClick={() => toggleHelpful(r.id)}
              >
                👍 Utile ({helpfulCounts[r.id]})
              </button>
            </div>
          </div>
        ))}
      </div>

      {!showAll && REVIEWS.length > 3 && (
        <div className="up-reviews__more">
          <button className="up-reviews__more-btn" onClick={() => setShowAll(true)}>
            Voir tous les avis ({REVIEWS.length})
          </button>
        </div>
      )}
    </section>
  );
}

// ─── Entry Modal ───────────────────────────────────────────────────────────────

const HOW_TO_MODAL = [
  { icon: "🎟", titre: "Paiement immédiat",   desc: "Transaction sécurisée. Votre accès est activé instantanément." },
  { icon: "🏛", titre: "Galerie 3D",          desc: "Naviguez librement dans l'espace virtuel pendant toute la durée." },
  { icon: "🤖", titre: "Chatbot IA",          desc: "Chaque œuvre dispose d'un assistant qui répond à vos questions." },
  { icon: "🖼", titre: "Essai dans votre intérieur", desc: "Visualisez l'œuvre chez vous avant de l'acheter." },
];

function EntryModal({ galerie, onClose }) {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = async () => {
    setPaying(true);
    await new Promise(r => setTimeout(r, 1800));
    setPaying(false);
    setPaid(true);
  };

  return (
    <div className="up-modal-backdrop" onClick={onClose}>
      <div className="up-modal" onClick={e => e.stopPropagation()}>
        <button className="up-modal__close" onClick={onClose}>✕</button>

        {!paid ? (
          <>
            <div className="up-modal__header">
              <span className="up-modal__icon">🏛</span>
              <h2 className="up-modal__title">{galerie.titre}</h2>
              <p className="up-modal__artiste">par {galerie.artiste}</p>
            </div>

            <div className="up-modal__steps-grid" style={{ marginBottom: 20 }}>
              <p className="up-modal__steps-title">Comment ça marche ?</p>
              {HOW_TO_MODAL.map((s, i) => (
                <div key={i} className="up-modal__step">
                  <div className="up-modal__step-icon">{s.icon}</div>
                  <div>
                    <p className="up-modal__step-titre">{s.titre}</p>
                    <p className="up-modal__step-desc">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="up-modal__recap">
              <div className="up-modal__recap-row"><span>Galerie</span><strong>{galerie.titre}</strong></div>
              <div className="up-modal__recap-row"><span>Durée d'accès</span><strong>{galerie.dureeAcces} après paiement</strong></div>
              <div className="up-modal__recap-row"><span>Nombre d'œuvres</span><strong>{galerie.nbOeuvres} œuvres</strong></div>
              <div className="up-modal__recap-row">
                <span>Prix d'entrée</span>
                <strong className="up-modal__total">{galerie.prix} DT</strong>
              </div>
            </div>

            <button
              className={`up-modal__pay-btn ${paying ? "up-modal__pay-btn--loading" : ""}`}
              onClick={handlePay}
              disabled={paying}
            >
              {paying
                ? <span className="up-modal__spinner" />
                : <>🎟 Payer & Entrer — {galerie.prix} DT</>
              }
            </button>
            <p className="up-modal__secure">🔒 Paiement sécurisé · Accès immédiat</p>
          </>
        ) : (
          <div className="up-modal__success">
            <span className="up-modal__success-icon">✦</span>
            <h2 className="up-modal__success-title">Accès confirmé !</h2>
            <p className="up-modal__success-sub">
              Vous avez accès à <strong>"{galerie.titre}"</strong> pendant <strong>{galerie.dureeAcces}</strong>.
            </p>
            <div className="up-modal__success-badge">Votre ticket d'entrée est prêt</div>
            <a href={`/galerie/${galerie.id}`} className="up-modal__enter-btn">
              🏛 Entrer dans la galerie maintenant
            </a>
          </div>
        )}
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
      const thumbTop = scrollHeight > clientHeight
        ? (scrollTop / (scrollHeight - clientHeight)) * (100 - thumbH)
        : 0;
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

  return (
    <div className="up-csb-track">
      <div className="up-csb-thumb" ref={thumbRef} onMouseDown={onMouseDown} />
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function UserPage() {
  const [styleFilter, setStyleFilter] = useState("Tous");
  const [sortBy, setSortBy] = useState("populaire");
  const [favorites, setFavorites] = useState([]);
  const [selectedGalerie, setSelectedGalerie] = useState(null);
  const [showTrailerModal, setShowTrailerModal] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [search, setSearch] = useState("");

  const toggleFavorite = (id) => {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  };

  const filtered = GALLERIES
    .filter(g => styleFilter === "Tous" || g.style === styleFilter)
    .filter(g =>
      !search ||
      g.titre.toLowerCase().includes(search.toLowerCase()) ||
      g.artiste.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "populaire")  return b.nbVisiteurs - a.nbVisiteurs;
      if (sortBy === "prix-asc")   return a.prix - b.prix;
      if (sortBy === "prix-desc")  return b.prix - a.prix;
      if (sortBy === "rating")     return b.rating - a.rating;
      if (sortBy === "nouveau")    return b.nouveaute - a.nouveaute;
      return 0;
    });

  return (
    <>
      <Header />
      
      {/* ── Onboarding Banner ── */}
      {showOnboarding && (
        <div className="up-onboard">
          <span className="up-onboard__icon">🎉</span>
          <div className="up-onboard__text">
            <p className="up-onboard__title">Bienvenue, {USER.prenom} ! Votre compte est activé.</p>
            <p className="up-onboard__sub">
              Explorez les galeries virtuelles 3D, payez l'entrée et laissez l'IA vous guider dans chaque œuvre.
              Commencez par le <strong>Free Trailer</strong> — c'est gratuit !
            </p>
          </div>
          <div className="up-onboard__steps">
            {["Choisir une galerie", "Payer l'entrée", "Explorer en 3D"].map((s, i) => (
              <div key={i} className="up-onboard__step">
                <span className="up-onboard__step-num">{i + 1}</span>
                {s}
              </div>
            ))}
          </div>
          <button className="up-onboard__close" onClick={() => setShowOnboarding(false)}>✕</button>
        </div>
      )}

      {/* ── Welcome ── */}
      <div className="up-welcome">
        <div>
          <span className="up-welcome__greeting">✦ Espace Visiteur</span>
          <h1 className="up-welcome__title">Bonjour, <em>{USER.prenom}</em> 👋</h1>
          <p className="up-welcome__sub">
            Découvrez des galeries d'art virtuelles en 3D — payez l'entrée et explorez à votre rythme.
          </p>
        </div>
        <div className="up-welcome__stats">
          <div className="up-welcome__stat">
            <span className="up-welcome__stat-val">{GALLERIES.length}</span>
            <span className="up-welcome__stat-lbl">Galeries</span>
          </div>
          <div className="up-welcome__stat">
            <span className="up-welcome__stat-val">{USER.galeriesVisitees}</span>
            <span className="up-welcome__stat-lbl">Visitées</span>
          </div>
          <div className="up-welcome__stat">
            <span className="up-welcome__stat-val">{favorites.length}</span>
            <span className="up-welcome__stat-lbl">Favoris</span>
          </div>
        </div>
      </div>

      {/* ── How-to Strip ── */}
      <div className="up-howto" style={{ margin: "40px 52px 0" }}>
        {HOW_TO_STEPS.map((s, i) => (
          <div key={i} className="up-howto__step">
            <span className="up-howto__num">0{i + 1}</span>
            <div className="up-howto__icon">{s.icon}</div>
            <div>
              <p className="up-howto__titre">{s.titre}</p>
              <p className="up-howto__desc">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── FREE TRAILER ── */}
      <TrailerSection onWatch={() => setShowTrailerModal(true)} />

      {/* ── Galleries Header ── */}
      <div className="up-section-head">
        <div className="up-section-head__left">
          <span className="up-section-label">Nos Galeries</span>
          <span className="up-section-count">{filtered.length} galerie{filtered.length > 1 ? "s" : ""}</span>
        </div>
        <div className="up-filters-right">
          <div className="up-search-wrap">
            <span className="up-search-icon">🔍</span>
            <input
              className="up-search"
              placeholder="Galerie, artiste…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
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

      {/* Style Pills */}
      <div className="up-style-pills">
        {STYLES.map(s => (
          <button
            key={s}
            className={`up-style-btn ${styleFilter === s ? "up-style-btn--active" : ""}`}
            onClick={() => setStyleFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {/* ── Gallery Grid ── */}
      <div className="up-grid-wrap">
        <div className="up-grid">
          {filtered.length === 0 ? (
            <div className="up-empty">
              <span className="up-empty__icon">🎨</span>
              <p className="up-empty__text">Aucune galerie trouvée.</p>
            </div>
          ) : (
            filtered.map((g, idx) => (
              <div key={g.id} style={{ animationDelay: `${idx * 0.06}s` }}>
                <GalleryCard
                  galerie={g}
                  onEnter={setSelectedGalerie}
                  isFavorite={favorites.includes(g.id)}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── REVIEWS ── */}
      <ReviewsSection />

      <Footer />

      {/* ── Modals ── */}
      {showTrailerModal && <TrailerModal onClose={() => setShowTrailerModal(false)} />}
      {selectedGalerie  && <EntryModal galerie={selectedGalerie} onClose={() => setSelectedGalerie(null)} />}

      {/* ── Scrollbar ── */}
      <CustomScrollbar />
    </>
  );
}