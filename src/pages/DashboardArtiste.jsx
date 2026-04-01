import { useState, useEffect, useRef } from "react";
import "../styles/DashboardArtiste.css";

// ─── Mock Data ────────────────────────────────────────────────────────────────

const artistInfo = {
  name: "Ariana Soghra",
  avatar: "https://i.pravatar.cc/80?img=47",
  chambre: "Galerie Impressionniste",
  abonnement: "Premium",
  depuis: "Janvier 2024",
};

const kpiData = [
  { label: "Total Visites", value: "3 842", delta: "+12%", icon: "👁", color: "#8B2020" },
  { label: "Œuvres Exposées", value: "24", delta: "+3", icon: "🖼", color: "#C9A040" },
  { label: "Revenus du mois", value: "4 200 DT", delta: "+8%", icon: "💰", color: "#3A6B35" },
  { label: "Taux Conversion", value: "18.4%", delta: "+2.1%", icon: "📈", color: "#2C4A8B" },
];

const visitsMonthly = [320, 410, 390, 520, 480, 610, 570, 720, 680, 810, 760, 920];
const months = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"];

const revenueData = [1200, 1800, 1500, 2200, 1900, 2600, 2300, 3100, 2800, 3500, 3200, 4200];

const topOeuvres = [
  { titre: "Lumière d'Automne", visites: 412, ventes: 3, temps: "4m 32s", conversion: "22%" },
  { titre: "Reflets Bleutés", visites: 389, ventes: 2, temps: "3m 58s", conversion: "18%" },
  { titre: "Portail Doré", visites: 301, ventes: 4, temps: "5m 12s", conversion: "31%" },
  { titre: "Nuit Parisienne", visites: 278, ventes: 1, temps: "2m 47s", conversion: "9%" },
  { titre: "Aube Rosée", visites: 245, ventes: 2, temps: "3m 22s", conversion: "16%" },
];

const demographieData = [
  { pays: "France", pct: 38, color: "#8B2020" },
  { pays: "Tunisie", pct: 24, color: "#C9A040" },
  { pays: "Belgique", pct: 14, color: "#5C4A30" },
  { pays: "Canada", pct: 12, color: "#3A6B35" },
  { pays: "Autres", pct: 12, color: "#9B8060" },
];

const chatMessages = [
  { role: "assistant", text: "Bonjour Ariana ! Comment puis-je vous aider aujourd'hui ?" },
];

const suggestions = [
  "Résume mes performances ce mois-ci",
  "Quelles œuvres sont les plus populaires ?",
  "Quel prix optimal pour ma nouvelle œuvre ?",
  "Combien de visiteurs ce mois-ci ?",
];

// ─── Mini Sparkline SVG ───────────────────────────────────────────────────────

function Sparkline({ data, color = "#8B2020", height = 40, width = 100 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  });
  const polyline = pts.join(" ");
  const area = `0,${height} ${polyline} ${width},${height}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="sparkline">
      <defs>
        <linearGradient id={`sg-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#sg-${color.replace("#","")})`} />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Bar Chart ────────────────────────────────────────────────────────────────

function BarChart({ data, labels, color = "#8B2020", title }) {
  const max = Math.max(...data);
  return (
    <div className="chart-container">
      <p className="chart-title">{title}</p>
      <div className="bar-chart">
        {data.map((v, i) => (
          <div key={i} className="bar-col">
            <div
              className="bar-fill"
              style={{ height: `${(v / max) * 100}%`, background: `linear-gradient(180deg, ${color}, ${color}88)` }}
              title={`${labels[i]}: ${v}`}
            />
            <span className="bar-label">{labels[i]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Line Chart ──────────────────────────────────────────────────────────────

function LineChart({ data, labels, color = "#C9A040", title }) {
  const width = 560;
  const height = 160;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const pad = { t: 10, r: 10, b: 28, l: 40 };
  const cw = width - pad.l - pad.r;
  const ch = height - pad.t - pad.b;

  const pts = data.map((v, i) => {
    const x = pad.l + (i / (data.length - 1)) * cw;
    const y = pad.t + ch - ((v - min) / range) * ch;
    return { x, y, v, label: labels[i] };
  });
  const polyline = pts.map(p => `${p.x},${p.y}`).join(" ");
  const area = `${pts[0].x},${pad.t + ch} ${polyline} ${pts[pts.length-1].x},${pad.t + ch}`;

  return (
    <div className="chart-container">
      <p className="chart-title">{title}</p>
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="line-chart-svg">
        <defs>
          <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0.01" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((t, i) => (
          <line key={i} x1={pad.l} x2={width - pad.r} y1={pad.t + t * ch} y2={pad.t + t * ch}
            stroke="rgba(44,10,10,0.06)" strokeWidth="1" strokeDasharray="4,4" />
        ))}
        {/* Area */}
        <polygon points={area} fill="url(#lineGrad)" />
        {/* Line */}
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Dots */}
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="4" fill={color} stroke="#FBF6F0" strokeWidth="2">
            <title>{p.label}: {p.v.toLocaleString()}</title>
          </circle>
        ))}
        {/* X labels */}
        {pts.map((p, i) => (
          <text key={i} x={p.x} y={height - 4} textAnchor="middle"
            fontSize="10" fill="rgba(44,10,10,0.45)" fontFamily="Cormorant Garamond, serif">
            {p.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

// ─── Donut Chart ─────────────────────────────────────────────────────────────

function DonutChart({ data }) {
  const total = data.reduce((s, d) => s + d.pct, 0);
  let cumul = 0;
  const r = 50; const cx = 70; const cy = 70;
  const segments = data.map(d => {
    const start = (cumul / total) * 360;
    cumul += d.pct;
    const end = (cumul / total) * 360;
    const toRad = deg => (deg - 90) * Math.PI / 180;
    const x1 = cx + r * Math.cos(toRad(start));
    const y1 = cy + r * Math.sin(toRad(start));
    const x2 = cx + r * Math.cos(toRad(end));
    const y2 = cy + r * Math.sin(toRad(end));
    const large = end - start > 180 ? 1 : 0;
    return { ...d, d: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z` };
  });

  return (
    <div className="donut-wrap">
      <svg width="140" height="140" viewBox="0 0 140 140">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#F0E4CF" strokeWidth="12" />
        {segments.map((s, i) => (
          <path key={i} d={s.d} fill={s.color} opacity="0.85">
            <title>{s.pays}: {s.pct}%</title>
          </path>
        ))}
        <circle cx={cx} cy={cy} r="32" fill="#FBF6F0" />
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize="11" fontFamily="Playfair Display, serif" fill="#2C0A0A" fontWeight="700">Visiteurs</text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="9" fontFamily="Cormorant Garamond, serif" fill="#8B6030">par région</text>
      </svg>
      <div className="donut-legend">
        {data.map((d, i) => (
          <div key={i} className="legend-item">
            <span className="legend-dot" style={{ background: d.color }} />
            <span className="legend-label">{d.pays}</span>
            <span className="legend-pct">{d.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Heatmap ─────────────────────────────────────────────────────────────────

function Heatmap() {
  const heures = ["8h", "10h", "12h", "14h", "16h", "18h", "20h", "22h"];
  const jours = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];
  const seed = (h, j) => Math.floor(((h * 7 + j * 3 + h * j) % 10) * 10 + 5);
  const max = 95;
  return (
    <div className="heatmap-wrap">
      <div className="heatmap-grid" style={{ gridTemplateColumns: `40px repeat(${heures.length}, 1fr)` }}>
        <div />
        {heures.map(h => <div key={h} className="hm-label hm-label--top">{h}</div>)}
        {jours.map((j, ji) => (
          <>
            <div key={j} className="hm-label hm-label--side">{j}</div>
            {heures.map((h, hi) => {
              const v = seed(hi, ji);
              const intensity = v / max;
              return (
                <div key={h} className="hm-cell"
                  style={{ background: `rgba(139,32,32,${intensity * 0.85})` }}
                  title={`${j} ${h}: ${v} interactions`}
                />
              );
            })}
          </>
        ))}
      </div>
      <div className="hm-scale">
        <span>Faible</span>
        <div className="hm-scale-bar" />
        <span>Élevé</span>
      </div>
    </div>
  );
}

// ─── Chatbot ─────────────────────────────────────────────────────────────────

function ChatbotPanel() {
  const [messages, setMessages] = useState(chatMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    if (!text.trim()) return;
    const userMsg = { role: "user", text };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.text
      }));

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `Tu es un assistant IA pour la plateforme ARTIVISION 3D, spécialisé pour aider les artistes. 
Tu t'appelles "Muse IA". Tu réponds en français.
L'artiste s'appelle Ariana Soghra. Voici ses données du mois :
- 3842 visites totales (+12%)
- 24 œuvres exposées
- Revenus : 4200 DT (+8%)
- Taux de conversion : 18.4%
- Top œuvre : "Portail Doré" avec 31% de conversion
- Démographie : 38% France, 24% Tunisie, 14% Belgique
- Pic d'activité : vendredi et samedi soir entre 18h-22h
Réponds de façon concise, chaleureuse et professionnelle.`,
          messages: history,
        }),
      });
      const data = await res.json();
      const reply = data.content?.[0]?.text || "Je n'ai pas pu obtenir de réponse pour le moment.";
      setMessages(prev => [...prev, { role: "assistant", text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", text: "Une erreur s'est produite. Veuillez réessayer." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chatbot-panel">
      <div className="chatbot-header">
        <div className="chatbot-avatar">✦</div>
        <div>
          <p className="chatbot-name">Muse IA</p>
          <p className="chatbot-sub">Votre assistant artistique</p>
        </div>
        <div className="chatbot-status" />
      </div>

      <div className="chatbot-messages">
        {messages.map((m, i) => (
          <div key={i} className={`chat-msg chat-msg--${m.role}`}>
            {m.role === "assistant" && <span className="chat-icon">✦</span>}
            <div className="chat-bubble">{m.text}</div>
          </div>
        ))}
        {loading && (
          <div className="chat-msg chat-msg--assistant">
            <span className="chat-icon">✦</span>
            <div className="chat-bubble chat-bubble--typing">
              <span /><span /><span />
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <div className="chatbot-suggestions">
        {suggestions.map((s, i) => (
          <button key={i} className="suggestion-chip" onClick={() => send(s)}>{s}</button>
        ))}
      </div>

      <div className="chatbot-input-row">
        <input
          className="chatbot-input"
          placeholder="Posez votre question…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && send(input)}
          disabled={loading}
        />
        <button className="chatbot-send" onClick={() => send(input)} disabled={loading || !input.trim()}>
          ›
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const navItems = [
  { icon: "◈", label: "Dashboard", id: "dashboard" },
  { icon: "🖼", label: "Mes Œuvres", id: "oeuvres" },
  { icon: "🏛", label: "Ma Chambre", id: "chambre" },
  { icon: "📊", label: "Statistiques", id: "stats" },
  { icon: "✦", label: "Assistant IA", id: "ia" },
  { icon: "⚙", label: "Paramètres", id: "settings" },
];

function Sidebar({ active, setActive }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-mark">✦</span>
        <span className="logo-text">ARTIVISION</span>
      </div>

      <div className="sidebar-artist">
        <img src={artistInfo.avatar} alt={artistInfo.name} className="sidebar-avatar" />
        <div>
          <p className="sidebar-name">{artistInfo.name}</p>
          <p className="sidebar-role">Artiste • {artistInfo.abonnement}</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? "nav-item--active" : ""}`}
            onClick={() => setActive(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
            {active === item.id && <span className="nav-indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-abonnement">
          <span className="abonnement-badge">Premium</span>
          <p className="abonnement-info">Membre depuis {artistInfo.depuis}</p>
        </div>
      </div>
    </aside>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardArtiste() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [period, setPeriod] = useState("mois");
  const [showChat, setShowChat] = useState(false);

  return (
    <div className="dashboard-root">
      <Sidebar active={activeNav} setActive={setActiveNav} />

      <main className="dashboard-main">

        {/* ── Header ── */}
        <header className="dash-header">
          <div>
            <h1 className="dash-title">Tableau de Bord</h1>
            <p className="dash-subtitle">Bienvenue, {artistInfo.name} — voici vos performances</p>
          </div>
          <div className="dash-header-actions">
            <div className="period-selector">
              {["semaine", "mois", "année"].map(p => (
                <button key={p} className={`period-btn ${period === p ? "period-btn--active" : ""}`}
                  onClick={() => setPeriod(p)}>{p.charAt(0).toUpperCase() + p.slice(1)}</button>
              ))}
            </div>
            <button className="chat-toggle-btn" onClick={() => setShowChat(!showChat)}>
              ✦ Muse IA
            </button>
          </div>
        </header>

        {/* ── KPI Cards ── */}
        <section className="kpi-grid">
          {kpiData.map((k, i) => (
            <div key={i} className="kpi-card">
              <div className="kpi-top">
                <span className="kpi-icon">{k.icon}</span>
                <span className="kpi-delta" style={{ color: k.delta.startsWith("+") ? "#3A6B35" : "#8B2020" }}>
                  {k.delta}
                </span>
              </div>
              <p className="kpi-value" style={{ color: k.color }}>{k.value}</p>
              <p className="kpi-label">{k.label}</p>
              <div className="kpi-sparkline">
                <Sparkline data={visitsMonthly.slice(-6)} color={k.color} width={80} height={30} />
              </div>
            </div>
          ))}
        </section>

        {/* ── Charts Row ── */}
        <section className="charts-row">
          <div className="chart-card chart-card--wide">
            <LineChart data={visitsMonthly} labels={months} color="#8B2020" title="Visites par mois" />
          </div>
          <div className="chart-card">
            <BarChart data={revenueData} labels={months} color="#C9A040" title="Revenus (DT)" />
          </div>
        </section>

        {/* ── Top Œuvres + Démographie ── */}
        <section className="bottom-row">

          {/* Top Œuvres */}
          <div className="table-card">
            <div className="card-header">
              <h2 className="card-title">Top Œuvres</h2>
              <span className="card-badge">Ce mois</span>
            </div>
            <table className="oeuvres-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Visites</th>
                  <th>Ventes</th>
                  <th>Temps moyen</th>
                  <th>Conversion</th>
                </tr>
              </thead>
              <tbody>
                {topOeuvres.map((o, i) => (
                  <tr key={i} className={i % 2 === 0 ? "tr-even" : ""}>
                    <td className="td-titre">
                      <span className="rank">#{i + 1}</span> {o.titre}
                    </td>
                    <td>{o.visites}</td>
                    <td>{o.ventes}</td>
                    <td>{o.temps}</td>
                    <td>
                      <span className="conversion-pill"
                        style={{ background: parseInt(o.conversion) > 20 ? "rgba(58,107,53,0.12)" : "rgba(139,32,32,0.08)",
                          color: parseInt(o.conversion) > 20 ? "#3A6B35" : "#8B2020" }}>
                        {o.conversion}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Démographie + Heatmap */}
          <div className="right-col">
            <div className="demo-card">
              <div className="card-header">
                <h2 className="card-title">Démographie</h2>
              </div>
              <DonutChart data={demographieData} />
            </div>

            <div className="heatmap-card">
              <div className="card-header">
                <h2 className="card-title">Carte de Chaleur</h2>
                <span className="card-badge">Interactions</span>
              </div>
              <Heatmap />
            </div>
          </div>

        </section>

      </main>

      {/* ── Floating Chatbot ── */}
      {showChat && (
        <div className="chat-overlay">
          <button className="chat-close" onClick={() => setShowChat(false)}>✕</button>
          <ChatbotPanel />
        </div>
      )}

      {/* ── Floating Chat Button ── */}
      {!showChat && (
        <button className="chat-fab" onClick={() => setShowChat(true)}>
          <span className="fab-icon">✦</span>
          <span className="fab-label">Muse IA</span>
        </button>
      )}
    </div>
  );
}