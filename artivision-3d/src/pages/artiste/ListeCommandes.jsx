// src/pages/artiste/ListeCommandes.jsx
import { useState, useEffect, useRef } from "react";
import Header from "../../components/Headerartiste";
import Footer from "../../components/Footer";
import { commandeService } from "../../services/commande.service";
import { oeuvreService } from "../../services/oeuvre.service";
import "../../styles/ListeCommandes.css";

const STATUTS = ["Tous", "En attente", "Confirmée", "Livré"];
const PER_PAGE = 6;

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
    <div className="lc-csb-track">
      <div className="lc-csb-thumb" ref={thumbRef} onMouseDown={onMouseDown} />
    </div>
  );
}

function StatutBadge({ statut }) {
  const map = {
    "Livré":      { cls: "lc-badge--livre",    icon: "✓", color: "#3A6B35" },
    "Confirmée":  { cls: "lc-badge--confirme", icon: "✓", color: "#3A6B35" },
    "En attente": { cls: "lc-badge--attente",  icon: "⏳", color: "#C9A040" },
  };
  const { cls, icon, color } = map[statut] || { cls: "", icon: "📋", color: "#8B6030" };
  return (
    <span className={`lc-badge ${cls}`} style={{ background: `${color}15`, color: color, border: `1px solid ${color}30` }}>
      <span className="lc-badge__dot" style={{ background: color }} /> {icon} {statut}
    </span>
  );
}

function Toast({ msg, visible }) {
  return (
    <div className={`lc-toast ${visible ? "lc-toast--visible" : ""}`}>
      <span className="lc-toast__icon">✨</span> {msg}
    </div>
  );
}

function OtpModal({ isOpen, onClose, onConfirm, commande }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = async () => {
    if (otp.length !== 6) {
      setError("Le code OTP doit contenir 6 chiffres");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onConfirm(commande.id, otp);
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || "Code OTP invalide");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lc-modal-overlay" onClick={onClose}>
      <div className="lc-modal" onClick={e => e.stopPropagation()}>
        <h3>🔐 Validation OTP</h3>
        <p>Entrez le code à 6 chiffres :</p>
        <input
          type="text"
          placeholder="000000"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
          className="lc-otp-input"
        />
        {error && <p className="lc-error">{error}</p>}
        <div className="lc-modal-actions">
          <button onClick={onClose}>Annuler</button>
          <button onClick={handleConfirm} disabled={loading}>
            {loading ? "Vérification..." : "Confirmer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ListeCommandes() {
  const [commandes, setCommandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filtre, setFiltre] = useState("Tous");
  const [page, setPage] = useState(1);
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [toast, setToast] = useState({ msg: "", visible: false });
  const [selectedOtpCommand, setSelectedOtpCommand] = useState(null);
  const [oeuvresMap, setOeuvresMap] = useState({});

  const showToast = (msg) => {
    setToast({ msg, visible: true });
    setTimeout(() => setToast(t => ({ ...t, visible: false })), 2800);
  };

  const handleSort = (col) => {
    if (sortCol === col) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortCol(col);
      setSortDir("asc");
    }
  };

  const loadCommandes = async () => {
    try {
      const response = await commandeService.getAll();
      return response.data || [];
    } catch (error) {
      console.error("Erreur chargement:", error);
      return [];
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const data = await loadCommandes();
      setCommandes(data);
      
      const oeuvresIds = new Set();
      data.forEach(cmd => {
        (cmd.oeuvres || []).forEach(id => oeuvresIds.add(id));
      });
      
      const newOeuvresMap = {};
      for (const id of oeuvresIds) {
        try {
          const oeuvreRes = await oeuvreService.getById(id);
          newOeuvresMap[id] = oeuvreRes.data;
        } catch (e) {
          console.error(`Erreur œuvre ${id}:`, e);
        }
      }
      setOeuvresMap(newOeuvresMap);
      setLoading(false);
    };
    
    init();
  }, []);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getOeuvreName = (oeuvreId) => {
    return oeuvresMap[oeuvreId]?.titre || `Œuvre #${oeuvreId}`;
  };

  const handleConfirmOrder = async (orderId, otp) => {
    const response = await commandeService.verifyOtp(orderId, otp);
    if (response.data?.status === 'success') {
      const newData = await loadCommandes();
      setCommandes(newData);
      showToast(`✅ Commande confirmée !`);
    }
    return response;
  };

  const handleMarkAsDelivered = async (commande) => {
    try {
      console.log(`📤 Mise à jour commande ${commande.id} vers Livré`);
      const response = await commandeService.update(commande.id, { status: 'Livré' });
      
      if (response.data) {
        const newData = await loadCommandes();
        setCommandes(newData);
        showToast(`📦 Commande marquée comme livrée !`);
      }
    } catch (error) {
      console.error("❌ Erreur:", error.response?.data || error);
      showToast("Erreur lors de la mise à jour");
    }
  };

  const filtered = commandes
    .filter(c => filtre === "Tous" || c.status === filtre)
    .filter(c => {
      const q = search.toLowerCase();
      return (
        c.id.toLowerCase().includes(q) ||
        (c.user_email || c.user?.email || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (!sortCol) return 0;
      let va = a[sortCol], vb = b[sortCol];
      if (typeof va === "string") va = va.toLowerCase();
      if (typeof vb === "string") vb = vb.toLowerCase();
      if (va < vb) return sortDir === "asc" ? -1 : 1;
      if (va > vb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  useEffect(() => {
    setPage(1);
  }, [search, filtre]);

  const kpis = [
    { label: "Total commandes", value: commandes.length, color: "#8B2020", icon: "📋" },
    { label: "En attente", value: commandes.filter(c => c.status === "En attente").length, color: "#C9A040", icon: "⏳" },
    { label: "Confirmées", value: commandes.filter(c => c.status === "Confirmée").length, color: "#2C4A8B", icon: "✓" },
    { label: "Livrées", value: commandes.filter(c => c.status === "Livré").length, color: "#3A6B35", icon: "📦" },
  ];

  const SortIcon = ({ col }) => {
    if (sortCol !== col) return <span className="lc-sort-icon">↕️</span>;
    return <span className="lc-sort-icon">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="lc-loading">Chargement des commandes...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="lc-page">
        <div className="lc-hero">
          <div className="lc-hero__bg" />
          <div className="lc-hero__content">
            <p className="lc-hero__eyebrow">✨ Espace Artiste</p>
            <h1 className="lc-hero__title">Liste des Commandes</h1>
            <p className="lc-hero__sub">Gérez et suivez toutes les commandes</p>
          </div>
        </div>

        <div className="lc-container">
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

          <div className="lc-toolbar">
            <div className="lc-search-wrap">
              <span className="lc-search-icon">🔍</span>
              <input
                className="lc-search"
                placeholder="Rechercher..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="lc-filters">
              {STATUTS.map(s => (
                <button
                  key={s}
                  className={`lc-filter-btn ${filtre === s ? "lc-filter-btn--active" : ""}`}
                  onClick={() => setFiltre(s)}
                >
                  {s}
                  <span className="lc-filter-count">
                    {s === "Tous" ? commandes.length : commandes.filter(c => c.status === s).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="lc-table-wrap">
            {paginated.length === 0 ? (
              <div className="lc-empty">
                <span className="lc-empty__icon">📭</span>
                <p>Aucune commande trouvée</p>
              </div>
            ) : (
              <table className="lc-table">
                <thead>
                  <tr>
                    <th className="lc-th lc-th--sortable" onClick={() => handleSort("id")}>N° Commande <SortIcon col="id" /></th>
                    <th className="lc-th lc-th--sortable" onClick={() => handleSort("oeuvre")}>Œuvre <SortIcon col="oeuvre" /></th>
                    <th className="lc-th lc-th--sortable" onClick={() => handleSort("date_command")}>Date <SortIcon col="date_command" /></th>
                    <th className="lc-th lc-th--sortable" onClick={() => handleSort("status")}>Statut <SortIcon col="status" /></th>
                    <th className="lc-th">E-mail Client</th>
                    <th className="lc-th lc-th--center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((c, i) => (
                    <tr key={c.id} className={`lc-tr ${i % 2 === 0 ? "lc-tr--even" : ""}`}>
                      <td className="lc-td"><span className="lc-order-num">#{c.id.slice(0, 8)}</span></td>
                      <td className="lc-td"><span className="lc-oeuvre">{(c.oeuvres || []).map(id => getOeuvreName(id)).join(", ") || "—"}</span></td>
                      <td className="lc-td lc-td--muted">{formatDate(c.date_command)}</td>
                      <td className="lc-td"><StatutBadge statut={c.status} /></td>
                      <td className="lc-td"><a href={`mailto:${c.user_email || c.user?.email}`} className="lc-email">{c.user_email || c.user?.email || "—"}</a></td>
                      <td className="lc-td lc-td--actions">
                        {c.status === "Confirmée" && !c.is_verified && (
                          <button className="lc-action-btn lc-action-btn--confirm" onClick={() => setSelectedOtpCommand(c)}>🔐 Vérifier OTP</button>
                        )}
                        {c.status === "Confirmée" && c.is_verified && (
                          <button className="lc-action-btn lc-action-btn--deliver" onClick={() => handleMarkAsDelivered(c)}>📦 Marquer livré</button>
                        )}
                        {c.status === "Livré" && <span className="lc-completed">✅ Livrée</span>}
                        {c.status === "En attente" && <span className="lc-pending">⏳ En attente</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {totalPages > 1 && (
            <div className="lc-pagination">
              <button className="lc-page-btn" onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}>←</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`lc-page-btn ${p === page ? "lc-page-btn--active" : ""}`} onClick={() => setPage(p)}>{p}</button>
              ))}
              <button className="lc-page-btn" onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}>→</button>
            </div>
          )}
        </div>
      </main>

      <Footer />
      <Toast msg={toast.msg} visible={toast.visible} />
      <CustomScrollbar />

      {selectedOtpCommand && (
        <OtpModal isOpen={!!selectedOtpCommand} onClose={() => setSelectedOtpCommand(null)} onConfirm={handleConfirmOrder} commande={selectedOtpCommand} />
      )}
    </>
  );
}