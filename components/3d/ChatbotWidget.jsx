// src/components/3d/ChatbotWidget.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";

const API_BASE = "http://localhost:8000/api/ia";

// ── Headers avec ton JWT (identique à ton code fonctionnel) ──
function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

// Utilitaires de temps et conversion d'image
function formatTime(date) {
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ChatbotWidget({ currentGallery, artworks }) {
  const [isOpen, setIsOpen] = useState(false);
  const [convId, setConvId] = useState(null);
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      content: `Bonsoir. Je suis Maestro Éloi, expert en histoire de l'art. Bienvenue dans la galerie "${currentGallery?.nom || 'Virtuelle'}". Partagez une image, décrivez une œuvre ou posez-moi vos questions.`,
      time: new Date(),
    }
  ]);
  
  const [input, setInput] = useState("");
  const [pendingImage, setPendingImage] = useState(null); // { file, preview, base64 }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, isOpen]);

  // Gestion de l'image (Méthode Base64 identique à ton Atelier)
  const handleImageFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const preview = URL.createObjectURL(file);
    const base64  = await fileToBase64(file);
    setPendingImage({ file, preview, base64 });
  };

  // Envoi du message (Même logique d'enchaînement d'API que ton Atelier)
  const handleSend = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text && !pendingImage) return;
    setError(null);

    // 1. Message local de l'utilisateur
    const userMsg = {
      id: Date.now(),
      role: "user",
      content: text || "📎 Image partagée",
      image: pendingImage?.preview || null,
      time: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    const currentBase64 = pendingImage?.base64 || null;
    setPendingImage(null);
    setLoading(true);

    try {
      let activeConvId = convId;

      // 2. Si pas de conversation active, on la crée en base Django
      if (!activeConvId) {
        const createRes = await fetch(`${API_BASE}/conversations/`, {
          method: "POST",
          headers: getAuthHeaders(),
          body: JSON.stringify({ 
            title: `Maestro — Galerie ${currentGallery?.nom || '3D'}`, 
            mode: "general" 
          }),
        });
        if (!createRes.ok) throw new Error("Impossible de lancer la session d'art.");
        const createData = await createRes.json();
        activeConvId = createData.id;
        setConvId(activeConvId);
      }

      // Contexte à injecter si tu veux guider l'IA sur la salle actuelle
      const artContext = ` [Contexte Galerie: ${currentGallery?.nom || 'salle d\'exposition'}]`;

      // 3. Envoi du prompt à la conversation Django
      const promptRes = await fetch(`${API_BASE}/conversations/${activeConvId}/prompt/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          prompt: text ? text + artContext : "Analyse cette image.",
          image: currentBase64 // Ton backend reçoit le binaire via la clé image en base64
        }),
      });

      if (!promptRes.ok) {
        const err = await promptRes.json();
        throw new Error(err.detail || "Le Maestro a rencontré un problème.");
      }

      const promptData = await promptRes.json();

      // 4. Insertion de la réponse (Utilise la clé .content)
      const assistantMsg = {
        id: promptData.id,
        role: "assistant",
        content: promptData.content, // Clé magique !
        time: new Date(promptData.created_at || Date.now()),
        meta: promptData.analysis_result || null, // Récupère le mouvement, la période...
      };

      setMessages((prev) => [...prev, assistantMsg]);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── BOUTON FLOTTANT LUXE ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: "fixed", bottom: 24, left: 24, zIndex: 150,
          background: "linear-gradient(135deg, #1C0A12, #2A1218)",
          border: "1px solid #C9A040", borderRadius: "50%",
          width: 56, height: 56, cursor: "pointer",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 24, color: "#C9A040", transition: "transform 0.3s ease",
        }}
      >
        {isOpen ? "✕" : "🎨"}
      </button>

      {/* ── INTERFACE DU CHATBOT ── */}
      {isOpen && (
        <div style={{
          position: "fixed", bottom: 96, left: 24, zIndex: 150,
          width: 360, height: 490,
          background: "rgba(28, 10, 18, 0.92)", backdropFilter: "blur(12px)",
          border: "1px solid rgba(201, 160, 64, 0.3)", borderRadius: 4,
          boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
          display: "flex", flexDirection: "column", overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(201, 160, 64, 0.2)", background: "#1C0A12" }}>
            <h4 style={{ color: "#F5ECD7", fontFamily: "'Georgia', serif", margin: 0, fontSize: 14, fontWeight: 400 }}>
              Maestro Éloi <span style={{ fontSize: 10, color: "#C9A040", marginLeft: 6 }}>• EXPERT EN ART</span>
            </h4>
          </div>

          {/* Zone des messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map((msg) => (
              <div key={msg.id} style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%", padding: "10px 14px", borderRadius: 4, fontSize: 12, lineHeight: 1.5,
                background: msg.role === "user" ? "rgba(201, 160, 64, 0.15)" : "rgba(255,255,255,0.04)",
                border: msg.role === "user" ? "1px solid rgba(201, 160, 64, 0.3)" : "1px solid rgba(255,255,255,0.05)",
                color: "#F5ECD7",
              }}>
                {msg.image && (
                  <img src={msg.image} alt="Œuvre" style={{ width: "100%", maxHeight: 140, objectFit: "cover", borderRadius: 2, marginBottom: 6, display: "block" }} />
                )}
                <div style={{ whiteSpace: "pre-wrap" }}>{msg.content}</div>

                {/* Ajout des badges de métadonnées (Période / Style) s'ils reviennent de l'API */}
                {msg.meta && (msg.meta.art_movement || msg.meta.art_period) && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 6 }}>
                    {msg.meta.art_period && <span style={{ fontSize: 9, background: "rgba(255,255,255,0.08)", padding: "2px 6px", color: "#C9A040" }}>🕰 {msg.meta.art_period}</span>}
                    {msg.meta.art_movement && <span style={{ fontSize: 9, background: "rgba(255,255,255,0.08)", padding: "2px 6px", color: "#C9A040" }}>🎨 {msg.meta.art_movement}</span>}
                  </div>
                )}
                <div style={{ fontSize: 9, opacity: 0.4, textAlign: "right", marginTop: 4 }}>{formatTime(new Date(msg.time))}</div>
              </div>
            ))}
            
            {loading && (
              <div style={{ color: "#C9A040", fontSize: 11, fontStyle: "italic", paddingLeft: 4 }}>
                Le Maestro étudie votre demande...
              </div>
            )}
            {error && (
              <div style={{ color: "#ef4444", fontSize: 11, padding: 4, background: "rgba(239,68,68,0.1)" }}>
                ⚠ {error}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Aperçu Image en attente avant envoi */}
          {pendingImage && (
            <div style={{ padding: "8px 16px", background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", gap: 10, borderTop: "1px solid rgba(201,160,64,0.1)" }}>
              <img src={pendingImage.preview} alt="Aperçu" style={{ width: 36, height: 36, objectFit: "cover", border: "1px solid #C9A040" }} />
              <span style={{ color: "rgba(245,236,215,0.6)", fontSize: 11, flex: 1 }}>Toile prête pour analyse</span>
              <button onClick={() => setPendingImage(null)} style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer" }}>✕</button>
            </div>
          )}

          {/* Formulaire de saisie */}
          <form onSubmit={handleSend} style={{ padding: 12, borderTop: "1px solid rgba(201,160,64,0.15)", display: "flex", gap: 8, alignItems: "center" }}>
            <input 
              type="file" 
              ref={fileInputRef} 
              style={{ display: "none" }} 
              accept="image/*"
              onChange={(e) => handleImageFile(e.target.files[0])} 
            />
            
            {/* Bouton Trombone */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={loading}
              style={{
                background: "rgba(201,160,64,0.1)", border: "1px solid rgba(201,160,64,0.2)",
                borderRadius: 2, width: 34, height: 34, color: "#C9A040", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14
              }}
            >
              🖼
            </button>

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Questionner l'expert..."
              disabled={loading}
              style={{
                flex: 1, background: "rgba(0,0,0,0.2)", border: "1px solid rgba(201,160,64,0.2)",
                borderRadius: 2, padding: "8px 12px", color: "#F5ECD7", fontSize: 12, outline: "none",
              }}
            />
            <button type="submit" disabled={loading || (!input.trim() && !pendingImage)} style={{
              background: "linear-gradient(135deg, #C9A040, #E8C06A)",
              border: "none", borderRadius: 2, height: 34, padding: "0 14px",
              color: "#1A0C10", fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}>
              ➤
            </button>
          </form>
        </div>
      )}
    </>
  );
}