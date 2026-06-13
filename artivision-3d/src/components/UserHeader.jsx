// src/components/UserHeader.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/auth.service";
import "../styles/Headerartiste.css";

const Icons = {
  Home: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Gallery: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="3" width="20" height="16" rx="2"/><path d="M8 21h8M12 17v4"/>
    </svg>
  ),
  Heart: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  History: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Settings: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  ),
  Ticket: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/>
    </svg>
  ),
  Logout: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
};

// Navigation desktop
const navLinks = [
  { label: "Accueil",              path: "/" },
  { label: "Galeries 3D",         path: "/user-page" },
  { label: "Mes Achats",          path: "/mes-achats" },
  { label: "Aide",                path: "/aide" },
];

export default function UserHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const navigate = useNavigate();

  // Récupérer les infos de l'utilisateur connecté
  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await authService.getCurrentUser();
        const userData = response.data?.data || response.data;
        setUser(userData);
      } catch (error) {
        console.error("Erreur chargement utilisateur:", error);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Focus search input when opened
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/recherche?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
      setSearchValue("");
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate("/login");
  };

  // Obtenir le nom à afficher
  const getUserName = () => {
    if (loading) return "Chargement...";
    if (user) {
      return user.prenom || user.Prenom || user.username || "Visiteur";
    }
    return "Visiteur";
  };

  const getUserAvatar = () => {
    if (user?.avatar) return user.avatar;
    return `https://i.pravatar.cc/80?img=${user?.id || 1}`;
  };

  return (
    <header className={`hdr ${scrolled ? "hdr--scrolled" : ""}`}>

      {/* Gold line top */}
      <div className="hdr__gold-top" />

      <div className="hdr__inner">

        {/* Logo */}
        <a href="/" className="hdr__logo" aria-label="ARTIVISION accueil">
          <img
            src="/images/logo_artivision.png"
            alt="ARTIVISION 3D"
            className="hdr__logo-img"
          />
          <span className="hdr__logo-text">ARTIVISION</span>
        </a>

        {/* Nav desktop */}
        <nav className="hdr__nav" aria-label="Navigation principale">
          {navLinks.map((l) => (
            <a key={l.path} href={l.path} className="hdr__nav-link">
              {l.label}
              <span className="hdr__nav-underline" />
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="hdr__actions">

          {/* Search */}
          <div className={`hdr__search-wrap ${searchOpen ? "hdr__search-wrap--open" : ""}`}>
            <form onSubmit={handleSearch} className="hdr__search-form">
              <input
                ref={searchRef}
                type="text"
                className="hdr__search-input"
                placeholder="Rechercher une galerie, une œuvre…"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Escape" && setSearchOpen(false)}
                aria-label="Recherche"
              />
              {searchValue && (
                <button type="button" className="hdr__search-clear"
                  onClick={() => setSearchValue("")} aria-label="Effacer">✕</button>
              )}
            </form>
            <button
              className="hdr__search-btn"
              onClick={() => setSearchOpen(!searchOpen)}
              aria-label="Ouvrir la recherche"
              aria-expanded={searchOpen}
            >
              {searchOpen
                ? <span className="hdr__icon hdr__icon--close">✕</span>
                : <svg className="hdr__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
              }
            </button>
          </div>

          {/* Divider */}
          <div className="hdr__divider" />

          {/* Profile */}
          <div className="hdr__profile-wrap" ref={profileRef}>
            <button
              className="hdr__avatar-btn"
              onClick={() => setProfileOpen(!profileOpen)}
              aria-label="Menu profil"
              aria-expanded={profileOpen}
            >
              <img
                src={getUserAvatar()}
                alt="Avatar"
                className="hdr__avatar-img"
              />
              <div className="hdr__avatar-status" />
              <span className="hdr__avatar-name">{getUserName()}</span>
              <svg className={`hdr__avatar-chevron ${profileOpen ? "hdr__avatar-chevron--open" : ""}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown - Menu utilisateur */}
            {profileOpen && (
              <div className="hdr__dropdown">
                <div className="hdr__dropdown-top">
                  <img src={getUserAvatar()} alt="Avatar" className="hdr__dropdown-avatar" />
                  <div>
                    <p className="hdr__dropdown-name">{user?.prenom || user?.Prenom || user?.username || "Visiteur"} {user?.nom || user?.Nom || ""}</p>
                    <p className="hdr__dropdown-role">Visiteur</p>
                  </div>
                </div>
                <div className="hdr__dropdown-divider" />
                <a href="/user-page" className="hdr__dropdown-item" onClick={() => setProfileOpen(false)}>
                  <span className="hdr__dropdown-icon"><Icons.Gallery /></span>
                  Galeries 3D
                </a>
                <a href="/mes-achats" className="hdr__dropdown-item" onClick={() => setProfileOpen(false)}>
                  <span className="hdr__dropdown-icon"><Icons.Ticket /></span>
                  Mes Achats
                </a>
                <a href="/favoris" className="hdr__dropdown-item" onClick={() => setProfileOpen(false)}>
                  <span className="hdr__dropdown-icon"><Icons.Heart /></span>
                  Mes Favoris
                </a>
                <a href="/historique" className="hdr__dropdown-item" onClick={() => setProfileOpen(false)}>
                  <span className="hdr__dropdown-icon"><Icons.History /></span>
                  Historique
                </a>
                <a href="/parametres" className="hdr__dropdown-item" onClick={() => setProfileOpen(false)}>
                  <span className="hdr__dropdown-icon"><Icons.Settings /></span>
                  Paramètres
                </a>
                <div className="hdr__dropdown-divider" />
                <button className="hdr__dropdown-logout" onClick={handleLogout}>
                  <span className="hdr__dropdown-icon"><Icons.Logout /></span> Se déconnecter
                </button>
              </div>
            )}
          </div>

          {/* Burger mobile */}
          <button
            className={`hdr__burger ${menuOpen ? "hdr__burger--open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu mobile"
            aria-expanded={menuOpen}
          >
            <span /><span /><span />
          </button>

        </div>
      </div>

      {/* Gold border bottom */}
      <div className="hdr__gold-bottom" />

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="hdr__mobile-nav" aria-label="Navigation mobile">
          <a href="/" className="hdr__mobile-link" onClick={() => setMenuOpen(false)}>Accueil</a>
          <a href="/user-page" className="hdr__mobile-link" onClick={() => setMenuOpen(false)}>Galeries 3D</a>
          <a href="/mes-achats" className="hdr__mobile-link" onClick={() => setMenuOpen(false)}>Mes Achats</a>
          <a href="/aide" className="hdr__mobile-link" onClick={() => setMenuOpen(false)}>Aide</a>
          <div className="hdr__mobile-divider" />
          <button className="hdr__mobile-link hdr__mobile-link--logout" onClick={handleLogout}>
            Se déconnecter
          </button>
        </nav>
      )}

    </header>
  );
}