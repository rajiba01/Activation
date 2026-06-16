// src/components/PaiementModal.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/PaiementModal.css";

export default function PaiementModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  montant, 
  description, 
  type, // 'gallery_access' ou 'artwork'
  itemId,
  role // 'visiteur' ou 'artiste'
}) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  // État des champs de paiement
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  
  // Validation
  const [errors, setErrors] = useState({});

  // Formatage automatique
  const handleCardNumber = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 16) value = value.slice(0, 16);
    value = value.replace(/(\d{4})/g, "$1 ").trim();
    setCardNumber(value);
    setErrors(prev => ({ ...prev, cardNumber: "" }));
  };

  const handleExpiryDate = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    setExpiryDate(value);
    setErrors(prev => ({ ...prev, expiryDate: "" }));
  };

  const handleCvv = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 3) value = value.slice(0, 3);
    setCvv(value);
    setErrors(prev => ({ ...prev, cvv: "" }));
  };

  const validate = () => {
    const newErrors = {};
    
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      newErrors.cardNumber = "Numéro de carte invalide (16 chiffres)";
    }
    if (!cardName.trim()) {
      newErrors.cardName = "Nom du titulaire requis";
    }
    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiryDate = "Format MM/AA invalide";
    }
    if (cvv.length !== 3) {
      newErrors.cvv = "CVV invalide (3 chiffres)";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validate()) return;
    
    setLoading(true);
    setError("");
    
    // Simulation d'appel API de paiement
    try {
      // Ici vous appellerez votre API de paiement réelle
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Paiement réussi
      setStep(2);
      
      // Appeler la fonction de succès
      if (onSuccess) {
        await onSuccess();
      }
      
    } catch (err) {
      setError("Erreur lors du paiement. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const getCardType = () => {
    const num = cardNumber.replace(/\s/g, "");
    if (num.startsWith("4")) return "Visa";
    if (num.startsWith("5")) return "Mastercard";
    if (num.startsWith("3")) return "American Express";
    return "Carte bancaire";
  };

  if (!isOpen) return null;

  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm-modal" onClick={e => e.stopPropagation()}>
        
        {/* Étape 1 : Formulaire de paiement */}
        {step === 1 && (
          <>
            <div className="pm-header">
              <button className="pm-close" onClick={onClose}>✕</button>
              <div className="pm-logo">💳</div>
              <h2>Paiement sécurisé</h2>
              <p className="pm-subtitle">{description}</p>
            </div>

            <div className="pm-body">
              {/* Montant */}
              <div className="pm-amount">
                <span>Montant à payer</span>
                <strong>{montant} DT</strong>
              </div>

              {/* Formulaire carte */}
              <div className="pm-form">
                <div className="pm-card-type">
                  {getCardType()} <span>🔒 Paiement 100% sécurisé</span>
                </div>

                <div className="pm-field">
                  <label>Numéro de carte</label>
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={handleCardNumber}
                    className={errors.cardNumber ? "error" : ""}
                  />
                  {errors.cardNumber && <span className="pm-error">{errors.cardNumber}</span>}
                </div>

                <div className="pm-field">
                  <label>Titulaire de la carte</label>
                  <input
                    type="text"
                    placeholder="John DOE"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    className={errors.cardName ? "error" : ""}
                  />
                  {errors.cardName && <span className="pm-error">{errors.cardName}</span>}
                </div>

                <div className="pm-row">
                  <div className="pm-field pm-field--half">
                    <label>Date d'expiration</label>
                    <input
                      type="text"
                      placeholder="MM/AA"
                      value={expiryDate}
                      onChange={handleExpiryDate}
                      className={errors.expiryDate ? "error" : ""}
                    />
                    {errors.expiryDate && <span className="pm-error">{errors.expiryDate}</span>}
                  </div>
                  <div className="pm-field pm-field--half">
                    <label>CVV</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={cvv}
                      onChange={handleCvv}
                      className={errors.cvv ? "error" : ""}
                    />
                    {errors.cvv && <span className="pm-error">{errors.cvv}</span>}
                  </div>
                </div>

                {error && <div className="pm-error-global">{error}</div>}

                <div className="pm-secure">
                  <span>🔒</span> Transactions sécurisées par SSL
                </div>
              </div>
            </div>

            <div className="pm-footer">
              <button className="pm-btn pm-btn--cancel" onClick={onClose}>
                Annuler
              </button>
              <button 
                className="pm-btn pm-btn--pay" 
                onClick={handlePayment}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="pm-spinner" />
                    Traitement...
                  </>
                ) : (
                  `Payer ${montant} DT`
                )}
              </button>
            </div>
          </>
        )}

        {/* Étape 2 : Succès */}
        {step === 2 && (
          <div className="pm-success">
            <div className="pm-success-icon">✓</div>
            <h2>Paiement réussi !</h2>
            <p>Votre transaction a été effectuée avec succès.</p>
            <div className="pm-success-details">
              <div>Montant : <strong>{montant} DT</strong></div>
              <div>Référence : <strong>ART-{Date.now()}</strong></div>
            </div>
            <button className="pm-btn pm-btn--success" onClick={onSuccess}>
              Continuer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}