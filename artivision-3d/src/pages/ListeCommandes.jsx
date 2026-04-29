import { useState, useEffect, useRef } from "react";
import Header from "../components/Headerartiste";
import Footer from "../components/Footer";
import "../styles/ListeCommandes.css";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const COMMANDES_INIT = [
  { id: "0001", oeuvre: "Lumière d'Automne",  email: "wael@gmail.com",   statut: "Livré",      montant: 450,  date: "2026-03-01", codeOn: false, confirmed: true  },
  { id: "0002", oeuvre: "Reflets Bleutés",    email: "sarah@gmail.com",  statut: "En attente", montant: 280,  date: "2026-03-05", codeOn: true,  confirmed: false },
  { id: "0003", oeuvre: "Portail Doré",       email: "karim@gmail.com",  statut: "Prêt",       montant: 720,  date: "2026-03-08", codeOn: false, confirmed: true  },
  { id: "0004", oeuvre: "Nuit Parisienne",    email: "leila@gmail.com",  statut: "En attente", montant: 190,  date: "2026-03-10", codeOn: true,  confirmed: false },
  { id: "0005", oeuvre: "Aube Rosée",         email: "omar@gmail.com",   statut: "Prêt",       montant: 340,  date: "2026-03-11", codeOn: false, confirmed: false },
  { id: "0006", oeuvre: "Horizon Violet",     email: "nina@gmail.com",   statut: "Livré",      montant: 560,  date: "2026-03-12", codeOn: false, confirmed: true  },
  { id: "0007", oeuvre: "Tempête d'Or",       email: "adam@gmail.com",   statut: "En attente", montant: 820,  date: "2026-03-13", codeOn: true,  confirmed: false },
  { id: "0008", oeuvre: "Silence Blanc",      email: "rima@gmail.com",   statut: "Livré",      montant: 310,  date: "2026-03-14", codeOn: false, confirmed: true  },
  { id: "0009", oeuvre: "Jardin Céleste",     email: "yass@gmail.com",   statut: "Prêt",       montant: 490,  date: "2026-03-15", codeOn: false, confirmed: false },
  { id: "0010", oeuvre: "Miroir d'Encre",     email: "lina@gmail.com",   statut: "En attente", montant: 650,  date: "2026-03-16", codeOn: true,  confirmed: false },
  { id: "0011", oeuvre: "Flamme Bleue",       email: "sami@gmail.com",   statut: "Livré",      montant: 230,  date: "2026-03-17", codeOn: false, confirmed: true  },
  { id: "0012", oeuvre: "Cascade Dorée",      email: "maya@gmail.com",   statut: "Prêt",       montant: 780,  date: "2026-03-18", codeOn: false, confirmed: true  },
];

const STATUTS = ["Tous", "En attente", "Prêt", "Livré"];
const PER_PAGE = 6;

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
      thumb.style.top    = `${thumbTop}vh`;
    };
    window.addEventListener("scroll", update);
    update();
    return () => window.removeEventListener("scroll", update);
  }, []);

  const onMouseDown = (e) => {
    isDragging.current = true;
    dragStart.current  = e.clientY;
    scrollStart.current = window.scrollY;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup",   onMouseUp);
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
    window.removeEventListener("mouseup",   onMouseUp);
  };

  return (
    <div className="lc-csb-track">
      <div className="lc-csb-thumb" ref={thumbRef} onMouseDown={onMouseDown} />
    </div>
  );
}

// ─── Statut Badge ─────────────────────────────────────────────────────────────
function StatutBadge({ statut }) {
  const map = {
    "Livré":      { cls: "lc-badge--livre",    icon: "✓" },
    "En attente": { cls: "lc-badge--attente",  icon: "⏳" },
    "Prêt":       { cls: "lc-badge--pret",     icon: "◉" },
  };
  const { cls, icon } = map[statut] || {};
  return (
    <span className={`lc-badge ${cls}`}>
      <span className="lc-badge__dot" /> {icon} {statut}
    </span>
  );
}

// ─── Toggle Switch ────────────────────────────────────────────────────────────
function Toggle({ value, onChange }) {
  return (
    <button
      className={`lc-toggle ${value ? "lc-toggle--on" : ""}`}
      onClick={() => onChange(!value)}
      aria-label="Toggle code"
    >
      <span className="lc-toggle__thumb" />
    </button>
  );
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function Toast({ msg, visible }) {
  return (
    <div className={`lc-toast ${visible ? "lc-toast--visible" : ""}`}>
      <span className="lc-toast__icon">✦</span> {msg}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function ListeCommandes() {
  const [commandes, setCommandes] = useState(COMMANDES_INIT);
  const [search,    setSearch]    = useState("");
  const [filtre,    setFiltre]    = useState("Tous");
  const [page,      setPage]      = useState(1);
  const [sortCol,   setSortCol]   = useState(null);
  const [sortDir,   setSortDir]   = useState("asc");
  const [toast,     setToast]     = useState({ msg: "", visible: false });

  const showToast = (msg) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800);
  };

  // ── Actions ──
  const toggleCode = (id) => {
    setCommandes(cs => cs.map(c => c.id === id ? { ...c, codeOn: !c.codeOn } : c));
  };

  const envoyerCode = (id) => {
    const c = commandes.find(c => c.id === id);
    showToast(`Code envoyé à ${c.email} ✓`);
  };

  const confirmer = (id) => {
    setCommandes(cs => cs.map(c =>
      c.id === id ? { ...c, confirmed: true, statut: "Livré" } : c
    ));
    showToast("Commande confirmée et marquée Livrée ✓");
  };

  // ── Sort ──
  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("asc"); }
    setPage(1);
  };

  // ── Filter + Search ──
  const filtered = commandes
    .filter(c => filtre === "Tous" || c.statut === filtre)
    .filter(c => {
      const q = search.toLowerCase();
      return (
        c.id.includes(q) ||
        c.oeuvre.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (!sortCol) return 0;
      let va = a[sortCol], vb = b[sortCol];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ?  1 : -1;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  // Reset page on filter/search change
  useEffect(() => setPage(1), [search, filtre]);

  // ── KPIs ──
  const kpis = [
    { label: "Total commandes",  value: commandes.length,                              color: "#8B2020", icon: "📋" },
    { label: "En attente",       value: commandes.filter(c => c.statut === "En attente").length, color: "#C9A040", icon: "⏳" },
    { label: "Prêtes",           value: commandes.filter(c => c.statut === "Prêt").length,       color: "#2C4A8B", icon: "◉"  },
    { label: "Livrées",          value: commandes.filter(c => c.statut === "Livré").length,      color: "#3A6B35", icon: "✓"  },
  ];

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <span className="lc-sort-icon lc-sort-icon--inactive">⇅</span>;
    return <span className="lc-sort-icon lc-sort-icon--active">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <>
      <Header />

      <main className="lc-page">

        {/* ── Hero ── */}
        <div className="lc-hero">
          <div className="lc-hero__bg" />
          <div className="lc-hero__content">
            <p className="lc-hero__eyebrow">✦ Espace Artiste</p>
            <h1 className="lc-hero__title">Liste des Commandes</h1>
            <p className="lc-hero__sub">Gérez et suivez toutes les commandes de vos œuvres en temps réel</p>
          </div>
        </div>

        <div className="lc-container">

          {/* ── KPI Cards ── */}
          <section className="lc-kpis">
            {kpis.map((k, i) => (
              <div key={i} className="lc-kpi-card">
                <div className="lc-kpi-top">
                  <span className="lc-kpi-icon">{k.icon}</span>
                  <span className="lc-kpi-value" style={{ color: k.color }}>{k.value}</span>
                </div>
                <p className="lc-kpi-label">{k.label}</p>
                <div className="lc-kpi-bar" style={{ background: k.color }} />
              </div>
            ))}
          </section>

          {/* ── Toolbar ── */}
          <div className="lc-toolbar">

            {/* Search */}
            <div className="lc-search-wrap">
              <svg className="lc-search-icon" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                className="lc-search"
                placeholder="Rechercher par N°, œuvre ou email…"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button className="lc-search-clear" onClick={() => setSearch("")}>✕</button>
              )}
            </div>

            {/* Statut filters */}
            <div className="lc-filters">
              {STATUTS.map(s => (
                <button
                  key={s}
                  className={`lc-filter-btn ${filtre === s ? "lc-filter-btn--active" : ""}`}
                  onClick={() => setFiltre(s)}
                >
                  {s}
                  <span className="lc-filter-count">
                    {s === "Tous" ? commandes.length : commandes.filter(c => c.statut === s).length}
                  </span>
                </button>
              ))}
            </div>

          </div>

          {/* ── Table ── */}
          <div className="lc-table-wrap">
            {paginated.length === 0 ? (
              <div className="lc-empty">
                <span className="lc-empty__icon">🔍</span>
                <p>Aucune commande trouvée</p>
              </div>
            ) : (
              <table className="lc-table">
                <thead>
                  <tr>
                    <th className="lc-th lc-th--sortable" onClick={() => handleSort("id")}>
                      N° Commande <SortIcon col="id" />
                    </th>
                    <th className="lc-th lc-th--sortable" onClick={() => handleSort("oeuvre")}>
                      Œuvre <SortIcon col="oeuvre" />
                    </th>
                    <th className="lc-th lc-th--sortable" onClick={() => handleSort("date")}>
                      Date <SortIcon col="date" />
                    </th>
                    <th className="lc-th lc-th--sortable" onClick={() => handleSort("statut")}>
                      Statut <SortIcon col="statut" />
                    </th>
                    <th className="lc-th">Code Vérif.</th>
                    <th className="lc-th">E-mail Client</th>
                    <th className="lc-th lc-th--sortable" onClick={() => handleSort("montant")}>
                      Montant <SortIcon col="montant" />
                    </th>
                    <th className="lc-th lc-th--center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((c, i) => (
                    <tr key={c.id} className={`lc-tr ${i % 2 === 0 ? "lc-tr--even" : ""}`}>

                      {/* N° */}
                      <td className="lc-td">
                        <span className="lc-order-num">#{c.id}</span>
                      </td>

                      {/* Œuvre */}
                      <td className="lc-td">
                        <span className="lc-oeuvre">{c.oeuvre}</span>
                      </td>

                      {/* Date */}
                      <td className="lc-td lc-td--muted">
                        {new Date(c.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
                      </td>

                      {/* Statut */}
                      <td className="lc-td">
                        <StatutBadge statut={c.statut} />
                      </td>

                      {/* Code Toggle */}
                      <td className="lc-td lc-td--center">
                        <Toggle value={c.codeOn} onChange={() => toggleCode(c.id)} />
                      </td>

                      {/* Email */}
                      <td className="lc-td">
                        <a href={`mailto:${c.email}`} className="lc-email">{c.email}</a>
                      </td>

                      {/* Montant */}
                      <td className="lc-td">
                        <span className="lc-montant">{c.montant} DT</span>
                      </td>

                      {/* Actions */}
                      <td className="lc-td lc-td--actions">
                        <button
                          className="lc-action-btn lc-action-btn--send"
                          onClick={() => envoyerCode(c.id)}
                          disabled={!c.codeOn}
                          title="Envoyer le code de vérification"
                        >
                          <span>📨</span> Envoyer Code
                        </button>
                        <button
                          className={`lc-action-btn lc-action-btn--confirm ${c.confirmed ? "lc-action-btn--done" : ""}`}
                          onClick={() => !c.confirmed && confirmer(c.id)}
                          disabled={c.confirmed}
                          title={c.confirmed ? "Déjà confirmée" : "Confirmer la livraison"}
                        >
                          <span>{c.confirmed ? "✓" : "◎"}</span>
                          {c.confirmed ? "Confirmé" : "Confirmer"}
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ── Pagination ── */}
          {totalPages > 1 && (
            <div className="lc-pagination">
              <button
                className="lc-page-btn lc-page-btn--nav"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`lc-page-btn ${p === page ? "lc-page-btn--active" : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}

              <button
                className="lc-page-btn lc-page-btn--nav"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                ›
              </button>

              <span className="lc-pagination__info">
                {filtered.length} résultat{filtered.length > 1 ? "s" : ""}
              </span>
            </div>
          )}

        </div>
      </main>

      <Footer />
      <Toast msg={toast.msg} visible={toast.visible} />
      <CustomScrollbar />
    </>
  );
}