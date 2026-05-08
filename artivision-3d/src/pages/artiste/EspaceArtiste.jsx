import { useState, useEffect, useRef } from "react";
import Header from "../../components/Headerartiste";
import Footer from "../../components/Footer";
import "../../styles/EspaceArtiste.css";

// ─── SVG Icon Components ───────────────────────────────────────────────────────

const Icon = {
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
  Frame: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="1"/>
      <rect x="7" y="7" width="10" height="10"/>
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
      fill="currentColor" stroke="none">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Building: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>
    </svg>
  ),
  BarChart: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10"/>
      <line x1="12" y1="20" x2="12" y2="4"/>
      <line x1="6" y1="20" x2="6" y2="14"/>
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
  ShoppingCart: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
    </svg>
  ),
  Target: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  MessageSquare: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  ),
  DollarSign: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  ),
  Sparkle: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M12 2l1.8 5.4L19.2 9l-5.4 1.8L12 16.2l-1.8-5.4L4.8 9l5.4-1.8L12 2z"/>
      <path d="M19 15l.9 2.7 2.7.9-2.7.9L19 22l-.9-2.7-2.7-.9 2.7-.9L19 15z"/>
      <path d="M5 15l.6 1.8 1.8.6-1.8.6L5 19.8l-.6-1.8-1.8-.6 1.8-.6L5 15z"/>
    </svg>
  ),
  Check: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Close: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Send: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13"/>
      <polygon points="22 2 15 22 11 13 2 9 22 2"/>
    </svg>
  ),
  ChevronLeft: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6"/>
    </svg>
  ),
  ChevronRight: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  ),
  Users: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Home: (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
};

const IC = ({ name, size = 18, style = {}, className = "" }) => {
  const Comp = Icon[name];
  if (!Comp) return null;
  return <Comp width={size} height={size} style={style} className={className} />;
};

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
  { value: "55+",   label: "Artistes actifs",      iconName: "Palette" },
  { value: "150+",  label: "Œuvres exposées",      iconName: "Frame"   },
  { value: "3 200", label: "Visiteurs / mois",     iconName: "Eye"     },
  { value: "92%",   label: "Taux de satisfaction", iconName: "Star"    },
];

const offres = [
  {
    iconName: "Building",
    titre: "Espace d'Exposition 3D",
    desc: "Créez une galerie virtuelle immersive personnalisée. Vos visiteurs explorent vos œuvres comme dans un vrai musée.",
    color: "#8B2020",
  },
  {
    iconName: "BarChart",
    titre: "Dashboard Analytique",
    desc: "Suivez vos visites, ventes, temps d'observation et revenus en temps réel avec des graphiques détaillés.",
    color: "#C9A040",
  },
  {
    iconName: "Bot",
    titre: "Assistant IA Muse",
    desc: "Un chatbot intelligent répond à vos questions sur vos performances et vous guide pour optimiser vos ventes.",
    color: "#5C4A30",
  },
  {
    iconName: "ShoppingCart",
    titre: "Vente Intégrée",
    desc: "Vos œuvres sont achetables directement depuis la galerie. Paiement sécurisé et gestion automatisée.",
    color: "#3A6B35",
  },
  {
    iconName: "Target",
    titre: "Essai Virtuel",
    desc: "Les acheteurs visualisent vos œuvres dans leur intérieur avant d'acheter — moins d'hésitations, plus de ventes.",
    color: "#2C4A8B",
  },
  {
    iconName: "MessageSquare",
    titre: "Chatbot par Œuvre",
    desc: "Chaque tableau dispose d'un assistant IA qui répond aux questions des visiteurs en votre absence.",
    color: "#7B3F8B",
  },
];

const chambres = [
  {
    nom: "Atelier",
    prix: "29 DT / mois",
    iconName: "Palette",
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
    iconName: "Building",
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
    iconName: "Sparkle",
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

const dashboardItems = [
  { iconName: "Frame",      titre: "Gestion des Œuvres",        desc: "Ajoutez, modifiez, organisez vos créations par collections. Mise en ligne instantanée.",                color: "#8B2020" },
  { iconName: "BarChart",   titre: "Statistiques Détaillées",    desc: "Visites, conversions, revenus, carte de chaleur — tout en un seul endroit.",                           color: "#C9A040" },
  { iconName: "DollarSign", titre: "Suivi des Revenus",          desc: "Droits d'entrée, ventes directes, commissions. Transparence totale sur vos gains.",                    color: "#3A6B35" },
  { iconName: "Bot",        titre: "Assistant IA Personnel",     desc: "Posez vos questions à Muse IA : performances, prix optimal, recommandations.",                        color: "#2C4A8B" },
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
        <p className="ea-hero__eyebrow">
          <IC name="Sparkle" size={12} style={{ marginRight: 6 }} />
          Espace Artiste
        </p>
        <h1 className="ea-hero__title">{heroSlides[current].label}</h1>
        <p className="ea-hero__sub">{heroSlides[current].sub}</p>
        <div className="ea-hero__actions">
          <a href="/inscription-artiste" className="ea-btn ea-btn--primary">Rejoindre la plateforme</a>
          <a href="#offres" className="ea-btn ea-btn--ghost">Découvrir les offres</a>
        </div>
      </div>
      <button className="ea-hero__arrow ea-hero__arrow--left" onClick={prev}>
        <IC name="ChevronLeft" size={20} />
      </button>
      <button className="ea-hero__arrow ea-hero__arrow--right" onClick={next}>
        <IC name="ChevronRight" size={20} />
      </button>
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
        <span key={i} className={i < n ? "ea-star ea-star--on" : "ea-star"}>
          <IC name="Star" size={14} />
        </span>
      ))}
    </div>
  );
}

// ─── Chatbot ─────────────────────────────────────────────────────────────────

const initMessages = [
  { role: "assistant", text: "Bonjour ! Je suis Muse IA. Comment puis-je vous aider à rejoindre ARTIVISION ?" },
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
          <span className="ea-fab__icon"><IC name="Sparkle" size={16} /></span>
          <span>Muse IA</span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="ea-chat">
          <div className="ea-chat__header">
            <div className="ea-chat__avatar"><IC name="Sparkle" size={18} /></div>
            <div>
              <p className="ea-chat__name">Muse IA</p>
              <p className="ea-chat__sub">Assistant ARTIVISION</p>
            </div>
            <div className="ea-chat__online" />
            <button className="ea-chat__close" onClick={() => setOpen(false)}>
              <IC name="Close" size={14} />
            </button>
          </div>

          <div className="ea-chat__messages">
            {messages.map((m, i) => (
              <div key={i} className={`ea-chat__msg ea-chat__msg--${m.role}`}>
                {m.role === "assistant" && (
                  <span className="ea-chat__icon"><IC name="Sparkle" size={14} /></span>
                )}
                <div className="ea-chat__bubble">{m.text}</div>
              </div>
            ))}
            {loading && (
              <div className="ea-chat__msg ea-chat__msg--assistant">
                <span className="ea-chat__icon"><IC name="Sparkle" size={14} /></span>
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
              disabled={loading || !input.trim()}>
              <IC name="Send" size={15} />
            </button>
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
                <span className="ea-stat-icon"><IC name={s.iconName} size={22} /></span>
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
                  <IC name={o.iconName} size={24} />
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
                  <span className="ea-chambre-icon" style={{ color: c.accent }}>
                    <IC name={c.iconName} size={28} />
                  </span>
                  <h3 className="ea-chambre-nom" style={{ color: c.accent }}>{c.nom}</h3>
                  <p className="ea-chambre-prix" style={{ color: c.accent }}>{c.prix}</p>
                </div>
                <div className="ea-chambre-body">
                  <p className="ea-chambre-desc">{c.desc}</p>
                  <ul className="ea-chambre-features">
                    {c.features.map((f, j) => (
                      <li key={j} className="ea-chambre-feature">
                        <span className="ea-check" style={{ color: c.accent }}>
                          <IC name="Check" size={13} />
                        </span> {f}
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
            {dashboardItems.map((p, i) => (
              <div key={i} className="ea-preview-card">
                <div className="ea-preview-icon" style={{ color: p.color, background: `${p.color}12` }}>
                  <IC name={p.iconName} size={22} />
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