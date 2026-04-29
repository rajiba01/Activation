import { useState, useEffect, useRef } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/Accueil.css";

// ─── Data statique (galleries, stats, reviews, faqs, heroSlides) ──────────────

const galleries = [
  { id: 1, title: "Galerie Impressionniste", desc: "Une sélection d'œuvres lumineuses du XIXe siècle", img: "/images/galerie/g1.jpg" },
  { id: 2, title: "Art Contemporain", desc: "Explorez les créations des artistes d'aujourd'hui", img: "/images/galerie/g2.jpg" },
  { id: 3, title: "Sculpture & Volumes", desc: "Des formes qui défient l'espace et le temps", img: "/images/galerie/g3.jpg" },
  { id: 4, title: "Portraits Classiques", desc: "L'âme humaine capturée pour l'éternité", img: "/images/galerie/g4.jpg" },
  { id: 5, title: "Art Abstrait", desc: "Couleurs et formes libres de toute contrainte", img: "/images/galerie/g5.jpg" },
  { id: 6, title: "Photographie d'Art", desc: "L'instant figé comme une œuvre vivante", img: "/images/galerie/g6.png" },
];

const stats = [
  { value: "100+", label: "Visiteur" },
  { value: "80+",  label: "Abonnement" },
  { value: "55+",  label: "Artiste" },
  { value: "150+", label: "Oeuvre" },
  { value: "70+",  label: "Galerie" },
];

const reviews = [
  { name: "Sophie M.",  avatar: "https://i.pravatar.cc/60?img=47", text: "Une experience immersive absolument epoustouflante. Je me suis sentie transportee dans chaque galerie.", stars: 5 },
  { name: "Lucas D.",   avatar: "https://i.pravatar.cc/60?img=68", text: "Pouvoir discuter avec chaque tableau grace au chatbot est une idee revolutionnaire. Bravo !", stars: 5 },
  { name: "Amira B.",   avatar: "https://i.pravatar.cc/60?img=32", text: "La visualisation 3D est bluffante de realisme. J'ai adore explorer les espaces d'exposition.", stars: 4 },
];

const faqs = [
  { q: "Je n'y connais rien en art, c'est pour moi ?",  a: "Absolument ! ArtVision est concu pour tous les publics. Notre chatbot vous guide pas a pas dans votre decouverte." },
  { q: "Est-ce vraiment gratuit ?",                      a: "Oui, l'acces de base est totalement gratuit. Des fonctionnalites premium sont disponibles pour les abonnes." },
  { q: "Comment devenir artiste sur la plateforme ?",    a: "Creez un compte et soumettez votre candidature via la section Nos Artistes. Notre equipe examine chaque dossier." },
  { q: "La visualisation chez moi est-elle realiste ?",  a: "Notre technologie 3D offre une immersion tres fidele a la realite, avec des jeux de lumiere et des proportions exactes." },
  { q: "Comment ca marche pour acheter ?",               a: "Reperez une oeuvre, contactez l'artiste via notre plateforme securisee et finalisez votre achat en toute serenite." },
];

const heroSlides = [
  { img: "/images/hero1.png", label: "Galerie Virtuelle 3D" },
  { img: "/images/hero2.png", label: "Galerie Impressionniste" },
  { img: "/images/hero3.png", label: "Art Contemporain" },
];

// ─── Données artistes initiales ───────────────────────────────────────────────
const ARTISTS_INITIAL = [
  {
    _id: "1",
    name: "Vincent Van Gogh",
    slug: "van-gogh",
    img: "/images/artiste/vangogh.jpg",
    color: "#F1D3C0",
    barcode: "/images/Barcode.png",
    badge: "/images/padgeart.png",
  },
  {
    _id: "2",
    name: "Frida Kahlo",
    slug: "frida-kahlo",
    img: "/images/artiste/frida.jpg",
    color: "#EED7C5",
    barcode: "/images/Barcode.png",
    badge: "/images/padgeart.png",
  },
  {
    _id: "3",
    name: "Pablo Picasso",
    slug: "picasso",
    img: "/images/artiste/pablo.jpg",
    color: "#B36A5E",
    barcode: "/images/Barcode.png",
    badge: "/images/padgeart.png",
  },
  {
    _id: "4",
    name: "Marlene Dumas",
    slug: "marlene-dumas",
    img: "/images/artiste/marlene.jpg",
    color: "#DAC1AE",
    barcode: "/images/Barcode.png",
    badge: "/images/padgeart.png",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const total = heroSlides.length;

  // Refs pour swipe tactile et trackpad
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);
  const wheelTimeout = useRef(null);
  const isWheelLocked = useRef(false);

  const prev = () => setCurrent((c) => (c - 1 + total) % total);
  const next = () => setCurrent((c) => (c + 1) % total);

  // Auto-play
  useEffect(() => {
    const interval = setInterval(next, 4000);
    return () => clearInterval(interval);
  }, []);

  // ── Touch (mobile & tablette) ──
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    // Seulement si le mouvement horizontal est dominant et assez long
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
      dx < 0 ? next() : prev();
    }
    touchStartX.current = null;
    touchStartY.current = null;
  };

  // ── Trackpad deux doigts (scroll horizontal) ──
  const handleWheel = (e) => {
    // Scroll horizontal uniquement (deux doigts gauche/droite sur trackpad)
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY) && Math.abs(e.deltaX) > 20) {
      e.preventDefault();
      // Anti-rebond : ignore les événements pendant 600ms après un changement
      if (isWheelLocked.current) return;
      isWheelLocked.current = true;
      e.deltaX > 0 ? next() : prev();
      clearTimeout(wheelTimeout.current);
      wheelTimeout.current = setTimeout(() => {
        isWheelLocked.current = false;
      }, 600);
    }
  };

  return (
    <div
      className="hero-carousel"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      <div
        className="hero-carousel__track"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {heroSlides.map((slide, i) => (
          <div key={i} className="hero-carousel__slide">
            <img src={slide.img} alt={slide.label} className="hero-carousel__img" />
          </div>
        ))}
      </div>

      <div className="hero-carousel__overlay" />

      <div className="hero-carousel__center">
        <a href="/explorer" className="hero__cta hero__cta--gallery">Explorer</a>
      </div>

      <button className="hero-carousel__arrow hero-carousel__arrow--left" onClick={prev} aria-label="Précédent">‹</button>
      <button className="hero-carousel__arrow hero-carousel__arrow--right" onClick={next} aria-label="Suivant">›</button>

      <div className="hero-carousel__dots">
        {heroSlides.map((_, i) => (
          <button
            key={i}
            className={`hero-carousel__dot ${i === current ? "hero-carousel__dot--active" : ""}`}
            onClick={() => setCurrent(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

function GoldFrame({ children, className = "" }) {
  return (
    <div className={`gold-frame ${className}`}>
      <div className="gold-frame__inner">{children}</div>
    </div>
  );
}

function OvalFrame({ children, className = "" }) {
  return (
    <div className={`oval-frame ${className}`}>
      <div className="oval-frame__inner">{children}</div>
    </div>
  );
}

function StarRating({ count }) {
  return (
    <div className="stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < count ? "star star--filled" : "star"}>★</span>
      ))}
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`faq__item ${open ? "faq__item--open" : ""}`} onClick={() => setOpen(!open)}>
      <div className="faq__question">
        <span>{q}</span>
        <span className={`faq__chevron ${open ? "faq__chevron--open" : ""}`}>›</span>
      </div>
      {open && <p className="faq__answer">{a}</p>}
    </div>
  );
}






// ─── Custom Scrollbar ─────────────────────────────────────────────────────────
// track : pointer-events none → deux doigts trackpad JAMAIS bloqués
// thumb : seul élément cliquable/draggable

function CustomScrollbar() {
  const thumbRef    = useRef(null);
  const trackRef    = useRef(null);
  const dragging    = useRef(false);
  const startY      = useRef(0);
  const startScroll = useRef(0);

  const update = useRef(() => {
    const thumb = thumbRef.current;
    const track = trackRef.current;
    if (!thumb || !track) return;
    // Lit le scroll sur body OU window selon lequel scrolle réellement
    const scrollY  = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
    const winH     = window.innerHeight;
    const docH     = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    const trackH   = track.clientHeight;
    const ratio    = winH / docH;
    const thumbH   = Math.max(48, trackH * ratio);
    const maxTop   = trackH - thumbH;
    const top      = docH > winH ? (scrollY / (docH - winH)) * maxTop : 0;
    thumb.style.height = `${thumbH}px`;
    thumb.style.top    = `${top}px`;
  });

  useEffect(() => {
    const fn = update.current;
    window.addEventListener("scroll", fn, { passive: true });
    window.addEventListener("resize", fn);
    fn();
    return () => {
      window.removeEventListener("scroll", fn);
      window.removeEventListener("resize", fn);
    };
  }, []);

  const onMouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragging.current    = true;
    startY.current      = e.clientY;
    startScroll.current = window.scrollY;
    document.body.style.userSelect = "none";

    const onMove = (ev) => {
      if (!dragging.current) return;
      const track  = trackRef.current;
      const thumb  = thumbRef.current;
      if (!track || !thumb) return;
      const winH   = window.innerHeight;
      const docH   = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
      const trackH = track.clientHeight;
      const thumbH = thumb.clientHeight;
      const maxTop = trackH - thumbH;
      const dy     = ev.clientY - startY.current;
      const newTop = Math.min(Math.max(0, (startScroll.current / (docH - winH)) * maxTop + dy), maxTop);
      const ratio  = maxTop > 0 ? newTop / maxTop : 0;
      window.scrollTo({ top: ratio * (docH - winH) });
    };

    const onUp = () => {
      dragging.current = false;
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div className="csb-track" ref={trackRef}>
      <div
        className="csb-thumb"
        ref={thumbRef}
        onMouseDown={onMouseDown}
      />
    </div>
  );
}



function ArtistsCarousel({ artists }) {
  const gridRef = useRef(null);
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  // ── Touch (mobile) ──
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    // Si le swipe est horizontal, bloque le scroll vertical de la page
    if (Math.abs(dx) > Math.abs(dy)) {
      e.stopPropagation();
    }
  };

  const scrollBy = (amount) => {
    gridRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  const scrollTo = (index) => {
    gridRef.current?.scrollTo({ left: index * 280, behavior: "smooth" });
  };

  return (
    <div className="artists__carousel-wrapper">
      <button
        className="artists__arrow artists__arrow--left"
        onClick={() => scrollBy(-280)}
        aria-label="Précédent"
      >‹</button>

      {/* La grille scroll nativement avec deux doigts trackpad grâce à overflow-x: auto */}
      <div
        ref={gridRef}
        className="artists__grid"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        {artists.map((a) => (
          <div
            key={a._id}
            className="artists__card"
            style={{ background: a.color }}
          >
            <div className="artists__img-section">
              <div className="artists__img-wrap">
                <img src={a.img} alt={a.name} className="artists__img" />
              </div>
              <div className="artists__badge-slot">
                <img src={a.badge} alt="badge" />
              </div>
            </div>

            <hr className="artists__divider" />
            <p className="artists__name">{a.name}</p>
            <hr className="artists__divider2" />

            <div className="artists__bottom">
              <div className="artists__barcode-slot">
                <img src={a.barcode} alt="code barre" />
              </div>
            </div>

            <a href={`/artiste/${a.slug}`} className="artists__btn">
              Visiter la galerie
            </a>
          </div>
        ))}
      </div>

      <button
        className="artists__arrow artists__arrow--right"
        onClick={() => scrollBy(280)}
        aria-label="Suivant"
      >›</button>

      <div className="artists__dots">
        {artists.map((_, i) => (
          <button
            key={i}
            className={`artists__dot${i === 0 ? " artists__dot--active" : ""}`}
            onClick={() => scrollTo(i)}
            aria-label={`Artiste ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Accueil() {
  const [artists, setArtists]               = useState(ARTISTS_INITIAL);
  const [artistsLoading, setArtistsLoading] = useState(false);
  const [artistsError, setArtistsError]     = useState(null);

  // Décommente quand le back est prêt :
  /*
  useEffect(() => {
    const fetchArtists = async () => {
      setArtistsLoading(true);
      setArtistsError(null);
      try {
        const res  = await fetch("/api/artists");
        if (!res.ok) throw new Error("Erreur serveur");
        const data = await res.json();
        const normalized = data.map((a) => ({
          _id:     a._id,
          name:    a.name,
          slug:    a.slug,
          img:     a.photo      || a.img,
          color:   a.cardColor  || "#C4A882",
          barcode: a.barcodeImg || a.barcode,
          badge:   a.badgeImg   || "/images/padge.png",
        }));
        setArtists(normalized);
      } catch (err) {
        setArtistsError("Impossible de charger les artistes.");
        console.error(err);
      } finally {
        setArtistsLoading(false);
      }
    };
    fetchArtists();
  }, []);
  */

  return (
    <>
      <Header />

      <main className="accueil">

        {/* ── HERO ── */}
        <section id="hero" className="hero">
          <HeroCarousel />
        </section>

        {/* ── À PROPOS ── */}
        <section id="apropos" className="apropos">
          <img src="/images/dec.png" alt="Décoration" className="apropos__decorline apropos__decorline--top" />
          <div className="apropos__banner-wrap">
            <img src="/images/padge.png" alt="À propos" className="apropos__banner" />
            <span className="apropos__banner-label">À Propos</span>
          </div>
          <div className="apropos__decorline apropos__decorline--top" />

          <div className="apropos__row apropos__row--right">
            <OvalFrame className="apropos__oval apropos__oval--left">
              <img
                src="/images/inscription/cadre.png"
                alt="La première galerie d'art virtuelle 3D intelligente"
                className="apropos__oval-img"
              />
              <div className="apropos__oval-text">"La première <br /> galerie d'art<br />virtuelle et <br />intelligente"</div>
            </OvalFrame>
            <div className="apropos__text apropos__text--right">
              <p>
                Explorez des musées en immersion depuis votre canapé,<br />
                échangez avec un chatbot qui connaît chaque tableau sur le bout des doigts,<br />
                visualisez les œuvres dans votre propre intérieur avant de craquer.
              </p>
              <p className="apropos__tagline"><samp>L'art à portée de main, en toute simplicité.</samp></p>
            </div>
          </div>

          <div className="apropos__divider">
            <svg viewBox="0 0 200 30" className="apropos__ornament">
              <path d="M0,15 Q50,0 100,15 Q150,30 200,15" stroke="#C9A040" strokeWidth="1" fill="none" opacity="0.5"/>
              <circle cx="100" cy="15" r="4" fill="#C9A040" opacity="0.6"/>
              <circle cx="60" cy="10" r="2" fill="#C9A040" opacity="0.4"/>
              <circle cx="140" cy="20" r="2" fill="#C9A040" opacity="0.4"/>
            </svg>
          </div>

          <div className="apropos__row apropos__row--left">
            <div className="apropos__text apropos__text--left">
              <p>
                Un endroit où les artistes exposent comme chez eux, où les visiteurs explorent
                comme des amis invités, où chaque interaction ressemble à une vraie rencontre.
              </p>
              <p className="apropos__tagline apropos__tagline--red"><samp>Pas de vitrine froide, juste des liens chaleureux</samp></p>
            </div>
            <OvalFrame className="apropos__oval apropos__oval--right">
              <img
                src="/images/inscription/cadre.png"
                alt="Une famille plus qu'une plateforme"
                className="apropos__oval-img"
              />
              <div className="apropos__oval-text">"Une famille <br />plus qu'une<br /> plateforme"</div>
            </OvalFrame>
          </div>
          <img src="/images/dec1.png" alt="Décoration1" className="apropos__decorline1" />
        </section>

        {/* ── ARTISTS ── */}
        <section id="artists" className="artists">
          <img src="/images/dec1.png" alt="Décoration1" className="apropos__decorline1" />

          <div className="artiste__banner-wrap">
            <img src="/images/padge.png" alt="Nos Artistes" className="artiste__banner" />
            <h2 className="artiste__banner-label">Nos Artistes</h2>
          </div>

          {artistsLoading && (
            <p style={{ textAlign: "center", color: "#8B6030", fontStyle: "italic" }}>
              Chargement des artistes…
            </p>
          )}

          {artistsError && (
            <p style={{ textAlign: "center", color: "#8B2020" }}>{artistsError}</p>
          )}

          {!artistsLoading && !artistsError && (
            <ArtistsCarousel artists={artists} />
          )}

          <img src="/images/dec1.png" alt="Décoration1" className="apropos__decorline1" />
        </section>

        {/* ── GALLERIES ── */}
        <img src="/images/dec1.png" alt="Décoration1" className="apropos__decorline1" />

        <section id="galeries" className="galeries">
          <h2 className="section-title">Decouvrez nos Galeries</h2>
          <div className="galeries__grid">
            {galleries.map((g) => (
              <div key={g.id} className="galeries__card">
                <div className="galeries__frame-wrap">
                  <img src={g.img} alt={g.title} className="galeries__photo" />
                  <img src="/images/cadre.png" alt="" className="galeries__frame-img" />
                </div>
                <div className="galeries__info">
                  <div>
                    <p className="galeries__card-title">{g.title}</p>
                    <p className="galeries__card-desc">{g.desc}</p>
                  </div>
                  <a href={`/galerie/${g.id}`} className="galeries__arrow-btn" aria-label="Voir">›</a>
                </div>
              </div>
            ))}
          </div>
          <img src="/images/dec1.png" alt="Décoration1" className="apropos__decorline1" />
        </section>

        {/* ── STATS ── */}
        <section id="stats" className="stats">
          <div className="stats__grid">
            {stats.map((s) => (
              <GoldFrame key={s.label}>
                <div className="stats__card">
                  <span className="stats__value">{s.value}</span>
                  <span className="stats__label">{s.label}</span>
                </div>
              </GoldFrame>
            ))}
          </div>
        </section>

        {/* ── REVIEWS ── */}
        <img src="/images/dec1.png" alt="Décoration1" className="apropos__decorline1" />

        <section id="reviews" className="reviews">
          <p className="stats__section-label">Les Avis</p>
          <div className="reviews__grid">
            {reviews.map((r) => (
              <div key={r.name} className="reviews__card">
                <div className="reviews__top">
                  <img src={r.avatar} alt={r.name} className="reviews__avatar" />
                  <div>
                    <p className="reviews__name">{r.name}</p>
                    <StarRating count={r.stars} />
                  </div>
                </div>
                <p className="reviews__text">"{r.text}"</p>
              </div>
            ))}
          </div>
        </section>

        <img src="/images/dec1.png" alt="Décoration1" className="apropos__decorline1" />

        {/* ── FAQ ── */}
        <section id="faq" className="faq">
          <h2 className="section-title">Questions Frequemment Posees (FAQ)</h2>
          <div className="faq__list">
            {faqs.map((f) => (
              <FaqItem key={f.q} q={f.q} a={f.a} />
            ))}
          </div>
        </section>

      </main>

      <Footer />
      <CustomScrollbar />
    </>
  );
}