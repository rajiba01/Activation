import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Headerartiste.css";

const navLinks = [
  { label: "Accueil",              path: "/espace-artiste" },
  { label: "Listes des commandes", path: "/commandes" },
  { label: "Extension 3D",         path: "/extension-3d" },
  { label: "Ajouter une Galerie",  path: "/ajouter-galerie" },
  { label: "Aide",                 path: "/aide" },
];

export default function Header() {
  const [scrolled,     setScrolled]     = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchValue,  setSearchValue]  = useState("");
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [profileOpen,  setProfileOpen]  = useState(false);
  const searchRef  = useRef(null);
  const profileRef = useRef(null);
  const navigate   = useNavigate();

  /* ── Scroll shadow ── */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Focus search input when opened ── */
  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  /* ── Close profile dropdown on outside click ── */
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

  return (
    <header className={`hdr ${scrolled ? "hdr--scrolled" : ""}`}>

      {/* ── Gold line top ── */}
      <div className="hdr__gold-top" />

      <div className="hdr__inner">

        {/* ── Logo ── */}
        
        <a href="/" className="hdr__logo" aria-label="ARTIVISION accueil">
          <img
            src="/images/logo_artivision.png"
            alt="ARTIVISION 3D"
            className="hdr__logo-img"
          />
          <span className="hdr__logo-text">ARTIVISION</span>

        </a>


        {/* ── Nav (desktop) ── */}
        <nav className="hdr__nav" aria-label="Navigation principale">
          {navLinks.map((l) => (
            <a key={l.path} href={l.path} className="hdr__nav-link">
              {l.label}
              <span className="hdr__nav-underline" />
            </a>
          ))}
        </nav>

        {/* ── Right actions ── */}
        <div className="hdr__actions">

          {/* Search */}
          <div className={`hdr__search-wrap ${searchOpen ? "hdr__search-wrap--open" : ""}`}>
            <form onSubmit={handleSearch} className="hdr__search-form">
              <input
                ref={searchRef}
                type="text"
                className="hdr__search-input"
                placeholder="Rechercher une œuvre, un artiste…"
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
                src="https://i.pravatar.cc/80?img=47"
                alt="Avatar"
                className="hdr__avatar-img"
              />
              <div className="hdr__avatar-status" />
              <span className="hdr__avatar-name">Ariana</span>
              <svg className={`hdr__avatar-chevron ${profileOpen ? "hdr__avatar-chevron--open" : ""}`}
                viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {/* Dropdown */}
            {profileOpen && (
              <div className="hdr__dropdown">
                <div className="hdr__dropdown-top">
                  <img src="https://i.pravatar.cc/80?img=47" alt="Avatar" className="hdr__dropdown-avatar" />
                  <div>
                    <p className="hdr__dropdown-name">Ariana Soghra</p>
                    <p className="hdr__dropdown-role">Artiste • Premium</p>
                  </div>
                </div>
                <div className="hdr__dropdown-divider" />
                {[
                  { icon: "◈", label: "Mon Dashboard",  path: "/dashboard-artiste" },
                  { icon: "🖼", label: "Mes Œuvres",     path: "/mes-oeuvres" },
                  { icon: "🏛", label: "Ma Chambre",     path: "/ma-chambre" },
                  { icon: "⚙", label: "Paramètres",     path: "/parametres" },
                ].map((item) => (
                  <a key={item.path} href={item.path} className="hdr__dropdown-item"
                    onClick={() => setProfileOpen(false)}>
                    <span className="hdr__dropdown-icon">{item.icon}</span>
                    {item.label}
                  </a>
                ))}
                <div className="hdr__dropdown-divider" />
                <button className="hdr__dropdown-logout"
                  onClick={() => { setProfileOpen(false); navigate("/login"); }}>
                  <span>⎋</span> Se déconnecter
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

      {/* ── Gold border bottom ── */}
      <div className="hdr__gold-bottom" />

      {/* ── Mobile menu ── */}
      {menuOpen && (
        <nav className="hdr__mobile-nav" aria-label="Navigation mobile">
          {navLinks.map((l) => (
            <a key={l.path} href={l.path} className="hdr__mobile-link"
              onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
          <div className="hdr__mobile-divider" />
          <a href="/dashboard-artiste" className="hdr__mobile-link hdr__mobile-link--accent"
            onClick={() => setMenuOpen(false)}>
            ◈ Mon Dashboard
          </a>
        </nav>
      )}

    </header>
  );
}