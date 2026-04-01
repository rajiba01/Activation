import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hook/userHook";
import "../styles/Login.css";

export default function Login() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showLoginForm, setShowLoginForm] = useState(false);
  
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  // 📝 Gestion connexion
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ login() va mapper username → pseudo et password → mdp
      await login(loginUsername, loginPassword);
      alert('Connexion réussie !');
      navigate('/');
    } catch (err) {
      console.error('Erreur:', err);
    }
  };

  // 📝 Gestion choix rôle
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
        <div className="corner-top">
          <img src="../images/inscription/deco.png" alt="decoration haut" className="corner-img" />
        </div>

        <div className="logo-section">
          <img src="../images/logo_artivision.png" alt="Artivision logo" className="logo-img" />
          <p className="logo-text">ARTIVISION</p>
          <div className="ornament-line">
            <span />
            <i>◆</i>
            <span />
          </div>
        </div>

        <div className="corner-bottom">
          <img src="../images/inscription/deco.png" alt="decoration bas" className="corner-img" />
        </div>
      </div>

      {/* ═══════════════ PANNEAU DROIT ═══════════════ */}
      <div className="right-panel">
        <img src="../images/inscription/cadre.png" alt="Artivision galerie" className="right-bg-img" />

        <div className="right-overlay" />

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

          {/* 🆕 Afficher formulaire connexion ou choix rôle */}
          {!showLoginForm ? (
            <>
              <p className="vous-etes-label">Vous êtes</p>

              <div className="role-options">
                <button
                  className={`role-btn ${selectedRole === "artiste" ? "active" : ""}`}
                  onClick={() => handleRoleClick("artiste")}
                >
                  🎨 Artiste
                </button>

                <button
                  className={`role-btn ${selectedRole === "visiteur" ? "active" : ""}`}
                  onClick={() => handleRoleClick("visiteur")}
                >
                  👤 Visiteur
                </button>
              </div>

              {/* 🆕 Bouton pour se connecter */}
             
            </>
          ) : (
            <>
              <h2>Connexion</h2>
              <form onSubmit={handleLoginSubmit}>
                <input
                  type="text"
                  placeholder="Pseudo (username)"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  disabled={loading}
                />
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={loading}
                />
                {error && <p className="error">{error}</p>}
                <button type="submit" disabled={loading}>
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>
              <button onClick={() => setShowLoginForm(false)}>
                ← Retour
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}