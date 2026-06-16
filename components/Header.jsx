import "../styles/Header.css";

function handleClick(e, id) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}

export default function Header() {
  return (
    <header className="header">
      <nav className="header__nav header__nav--left">
        <a href="#artists"  className="header__link" onClick={(e) => handleClick(e, "artists")}>Nos Artistes</a>
        <a href="#galeries" className="header__link" onClick={(e) => handleClick(e, "galeries")}>Galerie</a>
      </nav>

      <div className="header__logo">
        <div className="header__logo-icon">
          <img src="/images/logo_artivision.png" alt="Logo ArtVision" className="header__logo-img" />
        </div>
        <a href="/" className="header__logo-text">ArtVision</a>
      </div>

      <nav className="header__nav header__nav--right">
        <a href="#apropos" className="header__link" onClick={(e) => handleClick(e, "apropos")}>A Propos</a>
        <a href="#faq"     className="header__link" onClick={(e) => handleClick(e, "faq")}>Aide</a>
        <a href="/login"   className="header__btn">S'inscrire</a>
      </nav>
    </header>
  );
}