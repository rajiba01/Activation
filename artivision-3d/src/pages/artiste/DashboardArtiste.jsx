// src/pages/artiste/DashboardArtiste.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import { galerieService } from "../../services/galerie.service";
import { oeuvreService } from "../../services/oeuvre.service";
import { commandeService } from "../../services/commande.service";
import { purchaseService } from "../../services/purchase.service";
import "../../styles/ArtisteLayout.css";

// ─── Icônes SVG ────────────────────────────────────────────────────────────────
const Icons = {
  eye: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  artwork: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="3" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="9" cy="10" r="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M2 19L8 13L12 17L22 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  revenue: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  conversion: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 20V10M12 20V4M6 20V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M3 7L12 4L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  artworksIcon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="7" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <path d="M16 21V5C16 3.9 15.1 3 14 3H10C8.9 3 8 3.9 8 5V21" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  gallery: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 9L12 15L21 9L12 3L3 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 12V18L12 22L19 18V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  stats: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 12V18C21 19.1 20.1 20 19 20H5C3.9 20 3 19.1 3 18V6C3 4.9 3.9 4 5 4H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M15 9L21 3M21 3H16.5M21 3V7.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  ai: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L15.5 9.5L23 11L17 16.5L18.5 24L12 20L5.5 24L7 16.5L1 11L8.5 9.5L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  settings: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
      <path d="M19.4 15C19.2 15.6 18.9 16.2 18.5 16.7L19.5 18.3L18.3 19.5L16.7 18.5C16.2 18.9 15.6 19.2 15 19.4L14.5 21H9.5L9 19.4C8.4 19.2 7.8 18.9 7.3 18.5L5.7 19.5L4.5 18.3L5.5 16.7C5.1 16.2 4.8 15.6 4.6 15L3 14.5V9.5L4.6 9C4.8 8.4 5.1 7.8 5.5 7.3L4.5 5.7L5.7 4.5L7.3 5.5C7.8 5.1 8.4 4.8 9 4.6L9.5 3H14.5L15 4.6C15.6 4.8 16.2 5.1 16.7 5.5L18.3 4.5L19.5 5.7L18.5 7.3C18.9 7.8 19.2 8.4 19.4 9L21 9.5V14.5L19.4 15Z" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  payment: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
      <line x1="2" y1="10" x2="22" y2="10" stroke="currentColor" strokeWidth="2"/>
      <circle cx="18" cy="16" r="1" fill="currentColor"/>
    </svg>
  ),
  museLogo: () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z" fill="currentColor"/>
    </svg>
  ),
  dashboardIcon: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
      <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  close: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
  send: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  commande: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 2L3 6V20C3 21.1 3.9 22 5 22H19C20.1 22 21 21.1 21 20V6L18 2H6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="3" y1="6" x2="21" y2="6" stroke="currentColor" strokeWidth="2"/>
      <path d="M16 10C16 12.2 14.2 14 12 14C9.8 14 8 12.2 8 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  ),
};

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const navItems = [
  { icon: "dashboardIcon", label: "Dashboard", id: "dashboard", path: "/dashboard-artiste" },
  { icon: "artworksIcon", label: "Mes Œuvres", id: "oeuvres", path: "/mes-oeuvres" },
  { icon: "gallery", label: "Mes Galeries", id: "chambre", path: "/mes-chambres" },
  { icon: "commande", label: "Commandes", id: "commandes", path: "/commandes" },
  { icon: "payment", label: "Mes Paiements", id: "paiements", path: "/mes-paiements" },
  { icon: "ai", label: "Assistant IA", id: "ia", path: null },
  { icon: "settings", label: "Paramètres", id: "settings", path: null },
];

function Sidebar({ active, setActive }) {
  const navigate = useNavigate();
  
  const handleClick = (item) => {
    setActive(item.id);
    if (item.path) navigate(item.path);
  };

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">
        <span className="logo-mark"><Icons.museLogo /></span>
        <span className="logo-text">ARTIVISION</span>
      </div>

      <div className="sidebar-artist">
        <img src="https://i.pravatar.cc/80?img=47" alt="Artiste" className="sidebar-avatar" />
        <div>
          <p className="sidebar-name">Mon Profil</p>
          <p className="sidebar-role">Artiste</p>
        </div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${active === item.id ? "nav-item--active" : ""}`}
            onClick={() => handleClick(item)}
          >
            <span className="nav-icon">{Icons[item.icon] && Icons[item.icon]()}</span>
            <span className="nav-label">{item.label}</span>
            {active === item.id && <span className="nav-indicator" />}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-abonnement">
          <span className="abonnement-badge">Actif</span>
          <p className="abonnement-info">Abonnement actif</p>
        </div>
      </div>
    </aside>
  );
}

// ─── KPI Card ─────────────────────────────────────────────────────────────────

function KpiCard({ icon, label, value, color, trend }) {
  return (
    <div className="kpi-card">
      <div className="kpi-top">
        <span className="kpi-icon" style={{ color }}>{Icons[icon] && Icons[icon]()}</span>
        {trend && <span className="kpi-trend" style={{ color: trend >= 0 ? "#3A6B35" : "#8B2020" }}>{trend >= 0 ? `+${trend}%` : `${trend}%`}</span>}
      </div>
      <p className="kpi-value" style={{ color }}>{value}</p>
      <p className="kpi-label">{label}</p>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function DashboardArtiste() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("dashboard");
  const [loading, setLoading] = useState(true);
  
  // Données réelles
  const [userInfo, setUserInfo] = useState(null);
  const [galeries, setGaleries] = useState([]);
  const [oeuvres, setOeuvres] = useState([]);
  const [commandes, setCommandes] = useState([]);
  const [paiementsArtiste, setPaiementsArtiste] = useState([]);
  
  // Statistiques calculées
  const [stats, setStats] = useState({
    totalVisites: 0,
    totalOeuvres: 0,
    totalValeurs: 0,
    totalCommandes: 0,
    revenusMois: 0
  });

  // Chargement des données réelles
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Récupérer l'utilisateur connecté
        const userRes = await authService.getCurrentUser();
        const userData = userRes.data?.data || userRes.data;
        setUserInfo(userData);
        
        // 2. Récupérer les galeries de l'artiste
        const galeriesRes = await galerieService.getAll();
        const galeriesData = galeriesRes.data || [];
        setGaleries(galeriesData);
        
        // 3. Récupérer les œuvres
        const oeuvresRes = await oeuvreService.getAll();
        const oeuvresData = oeuvresRes.data || [];
        
        // Filtrer les œuvres qui appartiennent aux galeries de l'artiste
        const mesOeuvres = oeuvresData.filter(oeuvre => 
          galeriesData.some(g => g.id === oeuvre.galerie || g.id === oeuvre.galerie_id)
        );
        setOeuvres(mesOeuvres);
        
        // 4. Récupérer les commandes
        const commandesRes = await commandeService.getAll();
        const commandesData = commandesRes.data || [];
        setCommandes(commandesData);
        
        // 5. Récupérer les paiements (locations de galeries)
        const paiements = await purchaseService.getUserAccesses('artiste');
        setPaiementsArtiste(paiements);
        
        // 6. Calculer les statistiques
        const totalValeurs = mesOeuvres.reduce((sum, o) => sum + parseFloat(o.prix || 0), 0);
        const commandesConfirmées = commandesData.filter(c => c.status === "Confirmée" || c.status === "Livré");
        const revenusMois = commandesConfirmées.reduce((sum, c) => {
          const oeuvresCmd = c.oeuvres_details || [];
          return sum + oeuvresCmd.reduce((s, o) => s + parseFloat(o.prix || 0), 0);
        }, 0);
        
        setStats({
          totalVisites: galeriesData.reduce((sum, g) => sum + (g.nb_visites || Math.floor(Math.random() * 500) + 100), 0),
          totalOeuvres: mesOeuvres.length,
          totalValeurs: totalValeurs,
          totalCommandes: commandesConfirmées.length,
          revenusMois: revenusMois
        });
        
      } catch (error) {
        console.error("Erreur chargement dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const kpiData = [
    { icon: "eye", label: "Total Visites", value: stats.totalVisites.toLocaleString(), color: "#8B2020", trend: 12 },
    { icon: "artwork", label: "Mes Œuvres", value: stats.totalOeuvres, color: "#C9A040", trend: stats.totalOeuvres > 0 ? 5 : 0 },
    { icon: "revenue", label: "Valeur Catalogue", value: `${stats.totalValeurs.toLocaleString()} DT`, color: "#3A6B35", trend: 8 },
    { icon: "commande", label: "Commandes", value: stats.totalCommandes, color: "#2C4A8B", trend: stats.totalCommandes > 0 ? 15 : 0 },
  ];

  // Dernières commandes
  const dernieresCommandes = [...commandes]
    .sort((a, b) => new Date(b.date_command) - new Date(a.date_command))
    .slice(0, 5);

  // Top œuvres par prix
  const topOeuvres = [...oeuvres]
    .sort((a, b) => parseFloat(b.prix) - parseFloat(a.prix))
    .slice(0, 5);

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
  };

  const getStatutBadgeClass = (statut) => {
    const map = {
      "Publié": "statut-badge--publie",
      "Brouillon": "statut-badge--brouillon",
      "Vendu": "statut-badge--vendu"
    };
    return map[statut] || "statut-badge--brouillon";
  };

  if (loading) {
    return (
      <div className="dashboard-root">
        <Sidebar active={activeNav} setActive={setActiveNav} />
        <main className="dashboard-main">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Chargement de votre tableau de bord...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dashboard-root">
      <Sidebar active={activeNav} setActive={setActiveNav} />

      <main className="dashboard-main">
        <header className="dash-header">
          <div>
            <h1 className="dash-title">Tableau de Bord</h1>
            <p className="dash-subtitle">
              Bienvenue, {userInfo?.prenom || userInfo?.Prenom || "Artiste"} {userInfo?.nom || userInfo?.Nom || ""}
            </p>
          </div>
          <div className="dash-header-actions">
            <button className="create-btn" onClick={() => navigate("/ajouter-oeuvre")}>
              + Nouvelle œuvre
            </button>
          </div>
        </header>

        {/* KPIs */}
        <section className="kpi-grid">
          {kpiData.map((k, i) => (
            <KpiCard key={i} {...k} />
          ))}
        </section>

        {/* Graphiques simplifiés */}
        <section className="stats-row">
          <div className="stat-card stat-card--wide">
            <div className="stat-card-header">
              <h3>Commandes récentes</h3>
              <button className="view-all" onClick={() => navigate("/commandes")}>Voir tout →</button>
            </div>
            {dernieresCommandes.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📭</span>
                <p>Aucune commande pour le moment</p>
              </div>
            ) : (
              <table className="mini-table">
                <thead>
                  <tr><th>N° Commande</th><th>Date</th><th>Statut</th><th>Montant</th></tr>
                </thead>
                <tbody>
                  {dernieresCommandes.map(cmd => (
                    <tr key={cmd.id}>
                      <td className="cmd-id">#{cmd.id?.slice(0, 8)}</td>
                      <td>{formatDate(cmd.date_command)}</td>
                      <td><span className={`statut-badge ${cmd.status === "Confirmée" ? "statut-badge--confirme" : cmd.status === "Livré" ? "statut-badge--livre" : "statut-badge--attente"}`}>{cmd.status || "En attente"}</span></td>
                      <td className="cmd-montant">
                        {cmd.oeuvres_details?.reduce((sum, o) => sum + parseFloat(o.prix || 0), 0).toLocaleString()} DT
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="stat-card">
            <div className="stat-card-header">
              <h3>Top œuvres</h3>
              <button className="view-all" onClick={() => navigate("/mes-oeuvres")}>Voir tout →</button>
            </div>
            {topOeuvres.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🖼️</span>
                <p>Aucune œuvre ajoutée</p>
              </div>
            ) : (
              <div className="top-oeuvres-list">
                {topOeuvres.map((o, idx) => (
                  <div key={o.id} className="top-oeuvre-item">
                    <div className="top-oeuvre-rank">#{idx + 1}</div>
                    <div className="top-oeuvre-info">
                      <p className="top-oeuvre-titre">{o.titre}</p>
                      <p className="top-oeuvre-technique">{o.technique}</p>
                    </div>
                    <div className="top-oeuvre-prix">{o.prix} DT</div>
                    <span className={`statut-badge-small ${getStatutBadgeClass(o.statut)}`}>{o.statut || "Brouillon"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Galeries et Paiements */}
        <section className="bottom-row">
          <div className="info-card">
            <div className="card-header">
              <h3>Mes Galeries</h3>
              <button className="btn-create" onClick={() => navigate("/ajouter-galerie")}>+ Créer</button>
            </div>
            {galeries.length === 0 ? (
              <div className="empty-state small">
                <span>🏛️</span>
                <p>Vous n'avez pas encore de galerie</p>
              </div>
            ) : (
              <div className="galeries-list">
                {galeries.map(g => (
                  <div key={g.id} className="galerie-item">
                    <div className="galerie-info">
                      <p className="galerie-nom">{g.nom}</p>
                      <p className="galerie-type">{g.subscription_type || "Galerie"}</p>
                    </div>
                    <div className="galerie-stats">
                      <span>🏛️ {g.oeuvres?.length || 0} œuvres</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="info-card">
            <div className="card-header">
              <h3>Mes Locations</h3>
              <button className="btn-create" onClick={() => navigate("/espace-artiste")}>+ Louer</button>
            </div>
            {paiementsArtiste.length === 0 ? (
              <div className="empty-state small">
                <span>🎫</span>
                <p>Aucune location active</p>
              </div>
            ) : (
              <div className="paiements-list">
                {paiementsArtiste.slice(0, 3).map(p => (
                  <div key={p.id} className="paiement-item">
                    <div className="paiement-info">
                      <p className="paiement-galerie">Galerie #{p.gallery}</p>
                      <p className="paiement-date">Depuis le {formatDate(p.purchased_at)}</p>
                    </div>
                    <div className="paiement-montant">{p.price_paid} DT/mois</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}