import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();

  const handleRoleClick = (role) => {
    setSelectedRole(role);
    if (role === "artiste") {
      navigate("/inscription-artiste");
    } else if (role === "visiteur") {
      navigate("/inscription-user");
    }
  };

  return (
    <div className="login-container">

      {/* ═══════════════ PANNEAU GAUCHE ═══════════════ */}
      <div className="left-panel">

        {/* Image coin HAUT gauche */}
        <div className="corner-top">
          <img src="../images/inscription/deco.png" alt="decoration haut" className="corner-img" />
        </div>

        {/* Logo central */}
        <div className="logo-section">
          <img src="../images/logo_artivision.png" alt="Artivision logo" className="logo-img" />
          <p className="logo-text">ARTIVISION</p>
          <div className="ornament-line">
            <span />
            <i>◆</i>
            <span />
          </div>
        </div>

        {/* Image coin BAS gauche */}
        <div className="corner-bottom">
          <img src="../images/inscription/deco.png" alt="decoration bas" className="corner-img" />
        </div>

      </div>

      {/* ═══════════════ PANNEAU DROIT ═══════════════ */}
      <div className="right-panel">

        {/* Cadre image de fond */}
        <img src="../images/inscription/cadre.png" alt="Artivision galerie" className="right-bg-img" />

        <div className="right-overlay" />

        {/* Carte centrale */}
        <div className="frame-card">
          <div className="corner-deco tl" />
          <div className="corner-deco tr" />
          <div className="corner-deco bl" />
          <div className="corner-deco br" />

          <p className="welcome-eyebrow">✦ Galerie d'art & Vision ✦</p>

          <h1 className="welcome-title">
            Bienvenue chez
            <strong>Artivision</strong>
          </h1>

          <div className="divider">
            <div className="divider-line" />
            <div className="divider-diamond" />
            <div className="divider-line rev" />
          </div>

          <p className="vous-etes-label">Vous êtes</p>

          <div className="role-options">
            <button
              className={`role-btn ${selectedRole === "artiste" ? "active" : ""}`}
              onClick={() => handleRoleClick("artiste")}
            >
              <span className="role-icon">🎨</span>
              <span>Artiste</span>
            </button>

            <button
              className={`role-btn ${selectedRole === "visiteur" ? "active" : ""}`}
              onClick={() => handleRoleClick("visiteur")}
            >
              <span className="role-icon">👤</span>
              <span>Visiteur</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}