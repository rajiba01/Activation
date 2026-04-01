import { useState, useEffect, useRef } from "react";
import Header from "../components/Headerartiste";
import Footer from "../components/Footer";
import "../styles/EspaceArtiste.css";

// ─── Data ─────────────────────────────────────────────────────────────────────

const heroSlides = [
  {
    img: "/images/hero1.png",
    label: "Votre Galerie en 3D",
    sub: "Exposez vos œuvres dans un espace immersif unique",
  },
  {
    img: "/images/hero2.png",
    label: "Vendez Sans Frontières",
    sub: "Atteignez des collectionneurs du monde entier",
  },
  {
    img: "/images/hero3.png",
    label: "Gérez en Temps Réel",
    sub: "Statistiques, revenus et performances à portée de main",
  },
];

const stats = [
  { value: "55+",   label: "Artistes actifs",    icon: "🎨" },
  { value: "150+",  label: "Œuvres exposées",    icon: "🖼️" },
  { value: "3 200", label: "Visiteurs / mois",   icon: "👁️" },
  { value: "92%",   label: "Taux de satisfaction", icon: "⭐" },
];

const offres = [
  {
    icon: "🏛",
    titre: "Espace d'Exposition 3D",
    desc: "Créez une galerie virtuelle immersive personnalisée. Vos visiteurs explorent vos œuvres comme dans un vrai musée.",
    color: "#8B2020",
  },
  {
    icon: "📊",
    titre: "Dashboard Analytique",
    desc: "Suivez vos visites, ventes, temps d'observation et revenus en temps réel avec des graphiques détaillés.",
    color: "#C9A040",
  },
  {
    icon: "🤖",
    titre: "Assistant IA Muse",
    desc: "Un chatbot intelligent répond à vos questions sur vos performances et vous guide pour optimiser vos ventes.",
    color: "#5C4A30",
  },
  {
    icon: "🛒",
    titre: "Vente Intégrée",
    desc: "Vos œuvres sont achetables directement depuis la galerie. Paiement sécurisé et gestion automatisée.",
    color: "#3A6B35",
  },
  {
    icon: "🎯",
    titre: "Essai Virtuel",
    desc: "Les acheteurs visualisent vos œuvres dans leur intérieur avant d'acheter — moins d'hésitations, plus de ventes.",
    color: "#2C4A8B",
  },
  {
    icon: "💬",
    titre: "Chatbot par Œuvre",
    desc: "Chaque tableau dispose d'un assistant IA qui répond aux questions des visiteurs en votre absence.",
    color: "#7B3F8B",
  },
];

const chambres = [
  {
    nom: "Atelier",
    prix: "29 DT / mois",
    icon: "🎨",
    color: "#F1D3C0",
    accent: "#8B2020",
    desc: "Idéal pour débuter. Exposez jusqu'à 10 œuvres dans un espace intimiste.",
    features: [
      "Jusqu'à 10 œuvres",
      "1 chambre thématique",
      "Statistiques de base",
      "Chatbot intégré",
      "Support par email",
    ],
    badge: null,
  },
  {
    nom: "Galerie",
    prix: "69 DT / mois",
    icon: "🏛",
    color: "#2C0A0A",
    accent: "#C9A040",
    desc: "Pour les artistes confirmés. Un espace grand format avec outils avancés.",
    features: [
      "Jusqu'à 40 œuvres",
      "3 chambres thématiques",
      "Dashboard analytique complet",
      "Assistant IA Muse",
      "Personnalisation du décor",
      "Revenus droits d'entrée",
    ],
    badge: "Populaire",
  },
  {
    nom: "Musée",
    prix: "149 DT / mois",
    icon: "✦",
    color: "#3A1A0A",
    accent: "#F5D98B",
    desc: "L'expérience ultime. Votre propre musée virtuel avec toutes les fonctionnalités premium.",
    features: [
      "Œuvres illimitées",
      "Chambres illimitées",
      "Analytics temps réel avancés",
      "IA prioritaire",
      "Décor entièrement personnalisé",
      "Revenus maximisés",
      "Gestionnaire de compte dédié",
    ],
    badge: "Premium",
  },
];

const temoignages = [
  {
    name: "Leila Mansouri",
    avatar: "https://i.pravatar.cc/60?img=32",
    metier: "Peintre contemporaine",
    stars: 5,
    text: "ARTIVISION a transformé ma façon de vendre. Mes œuvres touchent maintenant des collectionneurs en France, Belgique et Canada. C'est incroyable.",
  },
  {
    name: "Karim Belhadj",
    avatar: "https://i.pravatar.cc/60?img=68",
    metier: "Sculpteur & Designer",
    stars: 5,
    text: "Le dashboard m'aide à comprendre ce que les visiteurs aiment vraiment. J'ai doublé mes ventes en trois mois grâce aux statistiques.",
  },
  {
    name: "Sofia Reyes",
    avatar: "https://i.pravatar.cc/60?img=47",
    metier: "Photographe d'art",
    stars: 5,
    text: "La fonctionnalité d'essai virtuel est révolutionnaire. Les acheteurs voient mes photos chez eux avant d'acheter — le taux de conversion a explosé.",
  },
];

const etapes = [
  { num: "01", titre: "Créez votre compte", desc: "Inscription rapide, validation par notre équipe sous 24h." },
  { num: "02", titre: "Choisissez votre espace", desc: "Sélectionnez la formule qui correspond à vos ambitions." },
  { num: "03", titre: "Ajoutez vos œuvres", desc: "Téléversez images HD, descriptions et prix en quelques clics." },
  { num: "04", titre: "Accueillez vos visiteurs", desc: "Votre galerie 3D est en ligne. Les revenus arrivent automatiquement." },
];

// ─── Scrollbar ────────────────────────────────────────────────────────────────

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
    <div className="ea-csb-track">
      <div className="ea-csb-thumb" ref={thumbRef} onMouseDown={onMouseDown} />
    </div>
  );
}

// ─── Hero Carousel ────────────────────────────────────────────────────────────

function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const total = heroSlides.length;
  const prev = () => setCurrent(c => (c - 1 + total) % total);
  const next = () => setCurrent(c => (c + 1) % total);

  useEffect(() => {
    const t = setInterval(next, 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="ea-hero">
      <div className="ea-hero__track" style={{ transform: `translateX(-${current * 100}%)` }}>
        {heroSlides.map((s, i) => (
          <div key={i} className="ea-hero__slide">
            <img src={s.img} alt={s.label} className="ea-hero__img" />
          </div>
        ))}
      </div>
      <div className="ea-hero__overlay" />
      <div className="ea-hero__content">
        <p className="ea-hero__eyebrow">✦ Espace Artiste</p>
        <h1 className="ea-hero__title">{heroSlides[current].label}</h1>
        <p className="ea-hero__sub">{heroSlides[current].sub}</p>
        <div className="ea-hero__actions">
          <a href="/inscription-artiste" className="ea-btn ea-btn--primary">Rejoindre la plateforme</a>
          <a href="#offres" className="ea-btn ea-btn--ghost">Découvrir les offres</a>
        </div>
      </div>
      <button className="ea-hero__arrow ea-hero__arrow--left" onClick={prev}>‹</button>
      <button className="ea-hero__arrow ea-hero__arrow--right" onClick={next}>›</button>
      <div className="ea-hero__dots">
        {heroSlides.map((_, i) => (
          <button key={i} className={`ea-hero__dot ${i === current ? "ea-hero__dot--active" : ""}`}
            onClick={() => setCurrent(i)} />
        ))}
      </div>
    </section>
  );
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function Stars({ n }) {
  return (
    <div className="ea-stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < n ? "ea-star ea-star--on" : "ea-star"}>★</span>
      ))}
    </div>
  );
}

// ─── Chatbot ─────────────────────────────────────────────────────────────────

const initMessages = [
  { role: "assistant", text: "Bonjour ! Je suis Muse IA 🎨 Comment puis-je vous aider à rejoindre ARTIVISION ?" },
];

const quickReplies = [
  "Comment fonctionne la plateforme ?",
  "Quels sont les tarifs ?",
  "Comment ajouter mes œuvres ?",
  "Comment sont calculés mes revenus ?",
];

function ChatbotFloat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(initMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text,
      }));
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Tu es Muse IA, l'assistant de la plateforme ARTIVISION 3D. Tu aides les artistes à comprendre la plateforme et à les convaincre de rejoindre.
Plateforme : galerie d'art virtuelle 3D. Les artistes peuvent exposer leurs œuvres, les vendre, et recevoir des revenus des droits d'entrée.
Formules : Atelier (29 DT/mois, 10 œuvres), Galerie (69 DT/mois, 40 œuvres), Musée (149 DT/mois, illimité).
Fonctionnalités : exposition 3D, chatbot par œuvre, essai virtuel chez soi, dashboard analytique, assistant IA, vente intégrée.
Réponds en français, de façon chaleureuse, concise et enthousiaste. Maximum 3 phrases par réponse.`,
          messages: history,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Je n'ai pas pu répondre pour le moment.";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Une erreur s'est produite. Réessayez !" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FAB */}
      {!open && (
        <button className="ea-fab" onClick={() => setOpen(true)}>
          <span className="ea-fab__icon">✦</span>
          <span>Muse IA</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="ea-chat">
          <div className="ea-chat__header">
            <div className="ea-chat__avatar">✦</div>
            <div>
              <p className="ea-chat__name">Muse IA</p>
              <p className="ea-chat__sub">Assistant ARTIVISION</p>
            </div>
            <div className="ea-chat__online" />
            <button className="ea-chat__close" onClick={() => setOpen(false)}>✕</button>
          </div>

          <div className="ea-chat__messages">
            {messages.map((m, i) => (
              <div key={i} className={`ea-chat__msg ea-chat__msg--${m.role}`}>
                {m.role === "assistant" && <span className="ea-chat__icon">✦</span>}
                <div className="ea-chat__bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="ea-chat__msg ea-chat__msg--assistant">
                <span className="ea-chat__icon">✦</span>
                <div className="ea-chat__bubble ea-chat__bubble--typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          <div className="ea-chat__quick">
            {quickReplies.map((q, i) => (
              <button key={i} className="ea-chat__chip" onClick={() => send(q)}>{q}</button>
            ))}
          </div>

          <div className="ea-chat__input-row">
            <input className="ea-chat__input" placeholder="Votre question…" value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send(input)} disabled={loading} />
            <button className="ea-chat__send" onClick={() => send(input)}
              disabled={loading || !input.trim()}>›</button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────

export default function EspaceArtiste() {
  const [chambreFilter, setChambreFilter] = useState("tous");

  const filteredChambres = chambreFilter === "tous"
    ? chambres
    : chambres.filter(c => c.nom.toLowerCase() === chambreFilter);

  return (
    <>
      <Header />

      <main className="ea-page">

        {/* ── HERO ── */}
        <HeroCarousel />

        {/* ── STATS PLATEFORME ── */}
        <section className="ea-stats">
          <div className="ea-stats__inner">
            {stats.map((s, i) => (
              <div key={i} className="ea-stat-card">
                <span className="ea-stat-icon">{s.icon}</span>
                <span className="ea-stat-value">{s.value}</span>
                <span className="ea-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ── OFFRES / SERVICES ── */}
        <section id="offres" className="ea-section ea-offres">
          <div className="ea-section__head">
            <p className="ea-eyebrow">Ce qu'on vous offre</p>
            <h2 className="ea-section__title">Tout ce dont un artiste a besoin</h2>
            <p className="ea-section__sub">Une plateforme complète pensée pour valoriser votre art et maximiser vos revenus.</p>
          </div>
          <div className="ea-offres__grid">
            {offres.map((o, i) => (
              <div key={i} className="ea-offre-card">
                <div className="ea-offre-icon" style={{ background: `${o.color}15`, color: o.color }}>
                  {o.icon}
                </div>
                <h3 className="ea-offre-titre">{o.titre}</h3>
                <p className="ea-offre-desc">{o.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── COMMENT ÇA MARCHE ── */}
        <section className="ea-section ea-etapes">
          <div className="ea-section__head">
            <p className="ea-eyebrow">Simple & Rapide</p>
            <h2 className="ea-section__title">Commencez en 4 étapes</h2>
          </div>
          <div className="ea-etapes__row">
            {etapes.map((e, i) => (
              <div key={i} className="ea-etape">
                <div className="ea-etape__num">{e.num}</div>
                {i < etapes.length - 1 && <div className="ea-etape__line" />}
                <h3 className="ea-etape__titre">{e.titre}</h3>
                <p className="ea-etape__desc">{e.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TYPES DE CHAMBRES ── */}
        <section id="chambres" className="ea-section ea-chambres">
          <div className="ea-section__head">
            <p className="ea-eyebrow">Nos Formules</p>
            <h2 className="ea-section__title">Choisissez votre espace</h2>
            <p className="ea-section__sub">Des formules adaptées à chaque niveau, du jeune artiste au maître confirmé.</p>
          </div>

          {/* Filtres */}
          <div className="ea-filter-row">
            {["tous", "atelier", "galerie", "musée"].map(f => (
              <button key={f} className={`ea-filter-btn ${chambreFilter === f ? "ea-filter-btn--active" : ""}`}
                onClick={() => setChambreFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          <div className="ea-chambres__grid">
            {filteredChambres.map((c, i) => (
              <div key={i} className={`ea-chambre-card ${c.badge === "Populaire" ? "ea-chambre-card--featured" : ""}`}
                style={{ "--accent": c.accent }}>
                {c.badge && (
                  <div className="ea-chambre-badge"
                    style={{ background: c.badge === "Premium" ? "linear-gradient(135deg,#C9A040,#F5D98B)" : "linear-gradient(135deg,#8B2020,#C03030)" }}>
                    {c.badge}
                  </div>
                )}
                <div className="ea-chambre-top" style={{ background: c.color }}>
                  <span className="ea-chambre-icon" style={{ color: c.accent }}>{c.icon}</span>
                  <h3 className="ea-chambre-nom" style={{ color: c.accent }}>{c.nom}</h3>
                  <p className="ea-chambre-prix" style={{ color: c.accent }}>{c.prix}</p>
                </div>
                <div className="ea-chambre-body">
                  <p className="ea-chambre-desc">{c.desc}</p>
                  <ul className="ea-chambre-features">
                    {c.features.map((f, j) => (
                      <li key={j} className="ea-chambre-feature">
                        <span className="ea-check" style={{ color: c.accent }}>✓</span> {f}
                      </li>
                    ))}
                  </ul>
                  <a href="/inscription-artiste" className="ea-chambre-cta"
                    style={{ background: `linear-gradient(135deg, ${c.accent}dd, ${c.accent})` }}>
                    Choisir {c.nom}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── DASHBOARD APERÇU ── */}
        <section className="ea-section ea-dashboard-preview">
          <div className="ea-section__head">
            <p className="ea-eyebrow">Votre espace de gestion</p>
            <h2 className="ea-section__title">Un dashboard puissant à votre service</h2>
            <p className="ea-section__sub">Gérez vos œuvres, suivez vos performances et pilotez vos revenus depuis une interface élégante.</p>
          </div>
          <div className="ea-preview__grid">
            {[
              { icon: "🖼", titre: "Gestion des Œuvres", desc: "Ajoutez, modifiez, organisez vos créations par collections. Mise en ligne instantanée.", color: "#8B2020" },
              { icon: "📊", titre: "Statistiques Détaillées", desc: "Visites, conversions, revenus, carte de chaleur — tout en un seul endroit.", color: "#C9A040" },
              { icon: "💰", titre: "Suivi des Revenus", desc: "Droits d'entrée, ventes directes, commissions. Transparence totale sur vos gains.", color: "#3A6B35" },
              { icon: "🤖", titre: "Assistant IA Personnel", desc: "Posez vos questions à Muse IA : performances, prix optimal, recommandations.", color: "#2C4A8B" },
            ].map((p, i) => (
              <div key={i} className="ea-preview-card">
                <div className="ea-preview-icon" style={{ color: p.color, background: `${p.color}12` }}>
                  {p.icon}
                </div>
                <h3 className="ea-preview-titre">{p.titre}</h3>
                <p className="ea-preview-desc">{p.desc}</p>
                <div className="ea-preview-bar" style={{ background: p.color }} />
              </div>
            ))}
          </div>
          <div className="ea-preview__cta">
            <a href="/dashboard-artiste" className="ea-btn ea-btn--primary">Voir le Dashboard</a>
          </div>
        </section>

        {/* ── TÉMOIGNAGES ── */}
        <section className="ea-section ea-temoignages">
          <div className="ea-section__head">
            <p className="ea-eyebrow">Ils nous font confiance</p>
            <h2 className="ea-section__title">Ce que disent nos artistes</h2>
          </div>
          <div className="ea-temoignages__grid">
            {temoignages.map((t, i) => (
              <div key={i} className="ea-temoignage-card">
                <Stars n={t.stars} />
                <p className="ea-temoignage-text">"{t.text}"</p>
                <div className="ea-temoignage-author">
                  <img src={t.avatar} alt={t.name} className="ea-temoignage-avatar" />
                  <div>
                    <p className="ea-temoignage-name">{t.name}</p>
                    <p className="ea-temoignage-metier">{t.metier}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section className="ea-cta-final">
          <div className="ea-cta-final__inner">
            <p className="ea-eyebrow ea-eyebrow--light">Prêt à exposer ?</p>
            <h2 className="ea-cta-final__title">Rejoignez ARTIVISION aujourd'hui</h2>
            <p className="ea-cta-final__sub">Créez votre compte en quelques minutes et commencez à exposer votre art au monde entier.</p>
            <div className="ea-cta-final__actions">
              <a href="/inscription-artiste" className="ea-btn ea-btn--gold">Créer mon compte artiste</a>
              <a href="/login" className="ea-btn ea-btn--ghost-light">J'ai déjà un compte</a>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <ChatbotFloat />
      <CustomScrollbar />
    </>
  );
}