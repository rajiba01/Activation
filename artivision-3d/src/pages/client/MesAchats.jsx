// src/pages/client/MesAchats.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/UserHeader";
import Footer from "../../components/Footer";
import { purchaseService } from "../../services/purchase.service";
import { gallerySyncService } from "../../services/gallerySync.service";
import "../../styles/MesAchats.css";

export default function MesAchats() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [galleryAccesses, setGalleryAccesses] = useState([]);
  const [artworkOrders, setArtworkOrders] = useState([]);
  const [galleries, setGalleries] = useState({});
  const [activeTab, setActiveTab] = useState("galeries");
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [otpCode, setOtpCode] = useState("");
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);

  const loadOrders = async () => {
    const orders = await purchaseService.getUserOrders();
    setArtworkOrders(orders);
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const accesses = await purchaseService.getUserAccesses('visiteur');
        setGalleryAccesses(accesses);
        
        await loadOrders();
        
        const allGalleries = await gallerySyncService.getPublishedGalleriesForVisitors();
        const galleryMap = {};
        allGalleries.forEach(g => { galleryMap[g.id] = g; });
        setGalleries(galleryMap);
        
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
    
    const interval = setInterval(loadOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const isExpired = (expiresAt) => new Date(expiresAt) < new Date();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  const handleVerifyOtp = (order) => {
    setSelectedOrder(order);
    setOtpCode("");
    setOtpError("");
    setShowOtpModal(true);
  };

  const handleSubmitOtp = async () => {
    if (!otpCode || otpCode.length !== 6) {
      setOtpError("Le code OTP doit contenir 6 chiffres");
      return;
    }
    
    setOtpLoading(true);
    setOtpError("");
    
    try {
      const response = await purchaseService.verifyOrderOtp(selectedOrder.id, otpCode);
      
      if (response.data?.status === 'success') {
        let artworkIds = [];
        
        if (selectedOrder.oeuvres && Array.isArray(selectedOrder.oeuvres)) {
          for (const oeuvre of selectedOrder.oeuvres) {
            let artworkId = oeuvre.id || oeuvre.oeuvre_id || oeuvre.artwork_id || (typeof oeuvre === 'number' ? oeuvre : null);
            if (artworkId) artworkIds.push(artworkId);
          }
        }
        
        if (artworkIds.length > 0) {
          for (const artworkId of artworkIds) {
            try {
              await purchaseService.markArtworkAsSold(artworkId);
            } catch (err) {
              console.error(`Erreur marquage ${artworkId}:`, err);
            }
          }
          alert("✅ Commande confirmée ! L'œuvre a été retirée de la galerie.");
        }
        
        await loadOrders();
        setShowOtpModal(false);
        
      } else {
        setOtpError("Code OTP invalide");
      }
    } catch (error) {
      console.error("Erreur:", error);
      setOtpError(error.response?.data?.error || "Erreur lors de la vérification");
    } finally {
      setOtpLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="ma-loading">Chargement...</div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="ma-page">
        <div className="ma-hero">
          <h1>Mes Achats</h1>
          <p>Accès aux galeries et œuvres acquises</p>
        </div>

        <div className="ma-tabs">
          <button className={`ma-tab ${activeTab === 'galeries' ? 'ma-tab--active' : ''}`} onClick={() => setActiveTab('galeries')}>
            🏛️ Accès Galeries ({galleryAccesses.length})
          </button>
          <button className={`ma-tab ${activeTab === 'oeuvres' ? 'ma-tab--active' : ''}`} onClick={() => setActiveTab('oeuvres')}>
            🖼️ Commandes ({artworkOrders.length})
          </button>
        </div>

        <div className="ma-container">
          {activeTab === 'galeries' ? (
            galleryAccesses.length === 0 ? (
              <div className="ma-empty">
                <span className="ma-empty-icon">🎫</span>
                <h3>Aucun accès acheté</h3>
                <button className="ma-btn" onClick={() => navigate("/user-page")}>Découvrir les galeries</button>
              </div>
            ) : (
              <div className="ma-grid">
                {galleryAccesses.map(access => {
                  const gallery = galleries[access.gallery];
                  const expired = isExpired(access.expires_at);
                  return (
                    <div key={access.id} className={`ma-card ${expired ? 'ma-card--expired' : ''}`}>
                      <div className="ma-card-img">
                        <img src={gallery?.cover_image || "/images/galerie/default.jpg"} alt={gallery?.nom || "Galerie"} />
                        {!expired && <div className="ma-card-badge">ACTIF</div>}
                        {expired && <div className="ma-card-badge ma-card-badge--expired">EXPIRÉ</div>}
                      </div>
                      <div className="ma-card-body">
                        <h3>{gallery?.nom || `Galerie #${access.gallery}`}</h3>
                        <p className="ma-card-price">{access.price_paid} DT</p>
                        <div className="ma-card-dates">
                          <span>Acheté le {formatDate(access.purchased_at)}</span>
                          <span className={expired ? 'expired' : ''}>Expire le {formatDate(access.expires_at)}</span>
                        </div>
                        {!expired && (
                          <button className="ma-card-btn" onClick={() => navigate(`/galerie-3d/${access.gallery}`, { state: { role: "visiteur", hasPurchasedAccess: true } })}>
                            🏛 Entrer dans la galerie
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            artworkOrders.length === 0 ? (
              <div className="ma-empty">
                <span className="ma-empty-icon">🖼️</span>
                <h3>Aucune commande</h3>
                <button className="ma-btn" onClick={() => navigate("/user-page")}>Explorer les galeries</button>
              </div>
            ) : (
              <div className="ma-grid">
                {artworkOrders.map(order => (
                  <div key={order.id} className="ma-card">
                    <div className="ma-card-header">
                      <h3>Commande #{order.id.slice(0, 8)}</h3>
                      <span className={`ma-status ${order.status === 'Livré' ? 'ma-status--delivered' : order.status === 'Confirmée' ? 'ma-status--confirmed' : 'ma-status--pending'}`}>
                        {order.status === 'Livré' ? '📦 Livrée' : order.status === 'Confirmée' ? '✅ Confirmée' : '⏳ En attente'}
                      </span>
                    </div>
                    <div className="ma-card-body">
                      <p className="ma-card-date">Date : {formatDate(order.date_command)}</p>
                      {order.oeuvres && order.oeuvres.length > 0 && (
                        <div className="ma-artworks-list">
                          <strong>Œuvres :</strong>
                          <ul>{order.oeuvres.map((oeuvre, idx) => <li key={idx}>{oeuvre.titre || `Œuvre #${oeuvre}`}</li>)}</ul>
                        </div>
                      )}
                      {order.is_verified ? (
                        <div className="ma-verified-badge">✅ Commande vérifiée</div>
                      ) : (
                        <button className="ma-verify-btn" onClick={() => handleVerifyOtp(order)}>🔑 Saisir le code</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </main>

      {showOtpModal && selectedOrder && (
        <div className="ma-modal-overlay" onClick={() => setShowOtpModal(false)}>
          <div className="ma-modal" onClick={e => e.stopPropagation()}>
            <h3>Code de confirmation</h3>
            <p>Entrez le code à 6 chiffres reçu par email :</p>
            <input type="text" placeholder="000000" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} maxLength={6} autoFocus />
            {otpError && <p className="ma-modal-error">{otpError}</p>}
            <div className="ma-modal-actions">
              <button onClick={() => setShowOtpModal(false)} disabled={otpLoading}>Annuler</button>
              <button onClick={handleSubmitOtp} disabled={otpLoading}>{otpLoading ? "Vérification..." : "Confirmer"}</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}