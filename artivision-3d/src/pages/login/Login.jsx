// src/pages/login/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/auth.service";
import "../../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("📤 Tentative avec:", { email, password });

    try {
      const response = await authService.login(email, password);
      
      console.log("📦 Réponse login:", response.data);

      if (response.data?.data?.access) {
        localStorage.setItem("access_token", response.data.data.access);
        localStorage.setItem("refresh_token", response.data.data.refresh);
        
        // Récupérer le rôle de l'utilisateur
        try {
          const roleResponse = await authService.getUserRole();
          console.log("📦 Rôle reçu:", roleResponse.data);
          
          const isArtist = roleResponse.data?.data?.is_artist === true;
          
          if (isArtist) {
            console.log("🎨 Artiste - Redirection vers espace artiste");
            navigate("/espace-artiste");
          } else {
            console.log("👤 Visiteur - Redirection vers user-page");
            navigate("/user-page");
          }
        } catch (roleErr) {
          console.error("❌ Erreur récupération rôle:", roleErr);
          // Fallback: redirection par défaut vers user-page
          navigate("/user-page");
        }
      } else {
        setError("Email ou mot de passe incorrect");
      }
    } catch (error) {
      console.error("❌ Erreur:", error.response?.data);
      setError(error.response?.data?.message || "Email ou mot de passe incorrect");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
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

          <form onSubmit={handleLogin}>
            <div className="login-form">
              <input
                type="email"
                className="login-input"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value.trim())}
                required
              />
              <input
                type="password"
                className="login-input"
                placeholder="Mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="login-submit-btn" disabled={loading}>
                {loading ? "Connexion..." : "Se connecter"}
              </button>
            </div>
          </form>

          <div className="register-links">
            <p>
              <button 
                className="register-link-btn"
                onClick={() => navigate("/inscription-user")}
              >
                👤 S'inscrire en tant que Visiteur
              </button>
            </p>
            <p>
              <button 
                className="register-link-btn"
                onClick={() => navigate("/inscription-artiste")}
              >
                🎨 S'inscrire en tant qu'Artiste
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}