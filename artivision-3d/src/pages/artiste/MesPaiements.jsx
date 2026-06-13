// src/pages/artiste/MesPaiements.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Headerartiste";
import Footer from "../../components/Footer";
import { purchaseService } from "../../services/purchase.service";
import "../../styles/MesPaiements.css";

export default function MesPaiements() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subscriptions, setSubscriptions] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Récupérer les abonnements artiste (pas de galerie spécifique)
        const accesses = await purchaseService.getUserAccesses('artiste');
        console.log("📦 Abonnements récupérés:", accesses);
        setSubscriptions(accesses);
      } catch (error) {
        console.error("Erreur chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const isExpired = (expiresAt) => {
    return new Date(expiresAt) < new Date();
  };

  const formatDate = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit', month: 'long', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getRemainingDetails = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    
    if (expiry <= now) {
      return { expired: true, days: 0, hours: 0, text: "Expiré" };
    }
    
    const diffMs = expiry - now;
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return { expired: false, days, hours, text: `${days} jour${days > 1 ? 's' : ''} restant${days > 1 ? 's' : ''}` };
    } else {
      return { expired: false, days: 0, hours, text: `${hours} heure${hours > 1 ? 's' : ''} restante${hours > 1 ? 's' : ''}` };
    }
  };

  const getSubscriptionTypeLabel = (type) => {
    const types = {
      'atelier': { label: 'Atelier', color: '#C9A040', icon: '🎨', description: 'Jusqu\'à 10 œuvres' },
      'galerie': { label: 'Galerie', color: '#8B2020', icon: '🏛️', description: 'Jusqu\'à 40 œuvres' },
      'musee': { label: 'Musée', color: '#D4AF37', icon: '🏺', description: 'Œuvres illimitées' }
    };
    return types[type?.toLowerCase()] || { label: 'Standard', color: '#8B2020', icon: '🎫', description: 'Abonnement de base' };
  };

  // Calculer le pourcentage de progression
  const getProgressPercentage = (purchasedAt, expiresAt) => {
    const start = new Date(purchasedAt);
    const end = new Date(expiresAt);
    const now = new Date();
    
    if (now >= end) return 100;
    if (now <= start) return 0;
    
    const total = end - start;
    const elapsed = now - start;
    return (elapsed / total) * 100;
  };

  return (
    <>
      <Header />
      <main className="mp-page">
        <div className="mp-hero">
          <h1>Mes Abonnements</h1>
          <p>Gérez vos abonnements et l'accès à la plateforme</p>
        </div>

        <div className="mp-container">
          {loading ? (
            <div className="mp-loading">
              <div className="mp-loading-spinner"></div>
              <p>Chargement de vos abonnements...</p>
            </div>
          ) : subscriptions.length === 0 ? (
            <div className="mp-empty">
              <span className="mp-empty-icon">🎫</span>
              <h3>Aucun abonnement actif</h3>
              <p>Vous n'avez pas encore souscrit à un abonnement.</p>
              <button className="mp-btn mp-btn--primary" onClick={() => navigate("/espace-artiste")}>
                Découvrir les offres
              </button>
            </div>
          ) : (
            <div className="mp-grid">
              {subscriptions.map(sub => {
                const expired = isExpired(sub.expires_at);
                const remaining = getRemainingDetails(sub.expires_at);
                const subType = getSubscriptionTypeLabel(sub.subscription_type);
                const progress = getProgressPercentage(sub.purchased_at, sub.expires_at);
                
                return (
                  <div key={sub.id} className={`mp-card ${expired ? 'mp-card--expired' : 'mp-card--active'}`}>
                    {/* Bandeau de statut */}
                    <div className={`mp-card-banner ${expired ? 'mp-card-banner--expired' : 'mp-card-banner--active'}`}>
                      <span className="mp-card-banner-icon">{subType.icon}</span>
                      <span className="mp-card-banner-text">
                        {expired ? 'Abonnement expiré' : 'Abonnement actif'}
                      </span>
                    </div>

                    <div className="mp-card-header">
                      <div className="mp-card-title-wrap">
                        <h3>Abonnement {subType.label}</h3>
                        <span className="mp-card-type" style={{ background: `${subType.color}15`, color: subType.color }}>
                          {subType.description}
                        </span>
                      </div>
                      <span className={`mp-status ${expired ? 'mp-status--expired' : 'mp-status--active'}`}>
                        {expired ? 'Expiré' : 'Actif'}
                      </span>
                    </div>

                    <div className="mp-card-body">
                      {/* Période d'abonnement */}
                      <div className="mp-period-section">
                        <div className="mp-period-header">
                          <span className="mp-period-icon">📅</span>
                          <span className="mp-period-title">Période d'abonnement</span>
                        </div>
                        <div className="mp-period-dates">
                          <div className="mp-date-block">
                            <span className="mp-date-label">Début</span>
                            <strong className="mp-date-value">{formatDateTime(sub.purchased_at)}</strong>
                          </div>
                          <div className="mp-date-arrow">→</div>
                          <div className="mp-date-block">
                            <span className="mp-date-label">Fin</span>
                            <strong className={`mp-date-value ${expired ? 'mp-date-value--expired' : ''}`}>
                              {formatDateTime(sub.expires_at)}
                            </strong>
                          </div>
                        </div>
                      </div>

                      {/* Barre de progression */}
                      <div className="mp-progress-section">
                        <div className="mp-progress-bar">
                          <div 
                            className="mp-progress-fill" 
                            style={{ width: `${progress}%`, background: subType.color }}
                          />
                        </div>
                        <div className="mp-progress-text">
                          <span>{Math.floor(progress)}% utilisé</span>
                          <span>{remaining.text}</span>
                        </div>
                      </div>

                      {/* Détails financiers */}
                      <div className="mp-details-section">
                        <div className="mp-details-row">
                          <span className="mp-details-label">📦 Abonnement</span>
                          <span className="mp-details-value" style={{ color: subType.color }}>
                            {subType.icon} {subType.label}
                          </span>
                        </div>
                        <div className="mp-details-row">
                          <span className="mp-details-label">💰 Montant payé</span>
                          <span className="mp-details-value">{sub.price_paid} DT</span>
                        </div>
                        <div className="mp-details-row">
                          <span className="mp-details-label">📅 Date d'achat</span>
                          <span className="mp-details-value">{formatDate(sub.purchased_at)}</span>
                        </div>
                        <div className="mp-details-row">
                          <span className="mp-details-label">🔄 Renouvellement</span>
                          <span className="mp-details-value">
                            {expired ? 'À renouveler' : `Le ${formatDate(sub.expires_at)}`}
                          </span>
                        </div>
                      </div>

                      {/* Compteur de temps restant */}
                      {!expired && (
                        <div className="mp-remaining-section">
                          <div className="mp-remaining-timer">
                            <div className="mp-remaining-circle">
                              <svg viewBox="0 0 100 100" className="mp-progress-ring">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(201,160,64,0.1)" strokeWidth="8"/>
                                <circle 
                                  cx="50" cy="50" r="45" fill="none" 
                                  stroke="#C9A040" strokeWidth="8"
                                  strokeDasharray={`${(remaining.days / 30) * 283} 283`}
                                  strokeDashoffset="0"
                                  transform="rotate(-90 50 50)"
                                  className="mp-progress-ring__circle"
                                />
                              </svg>
                              <div className="mp-remaining-text">
                                <span className="mp-remaining-days">{remaining.days}</span>
                                <span className="mp-remaining-unit">jours</span>
                              </div>
                            </div>
                            <div className="mp-remaining-info">
                              <p className="mp-remaining-label">Temps restant</p>
                              <p className="mp-remaining-value">{remaining.text}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mp-card-footer">
                      {!expired ? (
                        <>
                          <button 
                            className="mp-card-btn mp-card-btn--primary"
                            onClick={() => navigate("/mes-chambres")}
                          >
                            🎨 Gérer mes galeries
                          </button>
                          <button 
                            className="mp-card-btn mp-card-btn--outline"
                            onClick={() => navigate("/espace-artiste")}
                          >
                            🔄 Changer d'abonnement
                          </button>
                        </>
                      ) : (
                        <button 
                          className="mp-card-btn mp-card-btn--primary"
                          onClick={() => navigate("/espace-artiste")}
                        >
                          💰 Renouveler l'abonnement
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}