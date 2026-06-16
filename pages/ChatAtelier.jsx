import React, { useState, useEffect, useRef, useCallback } from "react";
import "../styles/ChatAtelier.css";

// ─── Config API ───────────────────────────────────────────────
const API_BASE = "http://localhost:8000/api/ia";
const API_MCP_BASE = "http://localhost:8000/api/mcp";
// ── Headers avec JWT (comme authService) ──
function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}
// ─── Agents disponibles ───────────────────────────────────────
const AGENTS = [
  {
    id: "maestro",
     isMCP: false,
    name: "Maestro Éloi",
    role: "EXPERT EN ART",
    icon: "🎨",
    color: "#c0392b",
    acceptsImages: true,
    mode: "general",
    description:
      "Analyse vos œuvres et images, identifie styles et techniques, explore l'histoire de l'art et guide votre sensibilité esthétique.",
    tags: ["Analyse d'œuvres", "Histoire de l'art", "Critique", "Images acceptées"],
    greeting:
      "Bonsoir. Je suis Maestro Éloi, expert en histoire de l'art. Partagez une image d'une œuvre, décrivez un tableau qui vous intrigue, ou posez-moi vos questions sur un mouvement artistique. Que souhaitez-vous explorer ?",
  },
  {
    id: "orion",
    name: "Assistant Orion",
    role: "TÂCHES & PRODUCTIVITÉ",
    icon: "⚙️",
      isMCP: true, 
    color: "#555",
    acceptsImages: true,
    mode: "general",
    description:
      "Gestion de tâches, organisation du quotidien, rédaction, planification et support pour toutes vos tâches routinières.",
    tags: ["Organisation", "Rédaction", "Planning", "Rappels"],
    greeting:
      "Bonjour ! Je suis Orion, votre assistant productivité. Comment puis-je organiser votre journée ou vous aider dans vos tâches ?",
  },
];

// ─── Utilitaires ──────────────────────────────────────────────
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

// ─── Composant principal ──────────────────────────────────────
export default function ChatAtelier() {
  const [activeAgent, setActiveAgent]       = useState(AGENTS[0]);
  const [sidebarOpen, setSidebarOpen]       = useState(true);
  const [conversations, setConversations]   = useState({}); // { agentId: { convId, messages[] } }
  const [input, setInput]                   = useState("");
  const [pendingImage, setPendingImage]     = useState(null); // { file, preview, base64 }
  const [loading, setLoading]               = useState(false);
  const [error, setError]                   = useState(null);

  const messagesEndRef = useRef(null);
  const fileInputRef   = useRef(null);
  const textareaRef    = useRef(null);

  // ── Scroll automatique ──
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversations, activeAgent]);

  // ── Messages de la conversation active ──
  const currentConv     = conversations[activeAgent.id];
  const currentMessages = currentConv?.messages || [
    {
      id: "welcome",
      role: "assistant",
      content: activeAgent.greeting,
      time: new Date(),
    },
  ];

  // ── Créer ou récupérer une conversation en base ──
  const ensureConversation = useCallback(async (agent) => {
    if (conversations[agent.id]?.convId) return conversations[agent.id].convId;

    const res = await fetch(`${API_BASE}/conversations/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: `${agent.name} — session`, mode: agent.mode }),
    });
    if (!res.ok) throw new Error("Impossible de créer la conversation.");
    const data = await res.json();

    setConversations((prev) => ({
      ...prev,
      [agent.id]: { convId: data.id, messages: prev[agent.id]?.messages || [] },
    }));
    return data.id;
  }, [conversations]);

  // ── Envoi du prompt ──
const handleSend = useCallback(async () => {
  const text = input.trim();
  if (!text && !pendingImage) return;
  setError(null);

  const userMsg = {
    id: Date.now(),
    role: "user",
    content: text || "📎 Image partagée",
    image: pendingImage?.preview || null,
    time: new Date(),
  };

  setConversations((prev) => ({
    ...prev,
    [activeAgent.id]: {
      ...prev[activeAgent.id],
      messages: [...(prev[activeAgent.id]?.messages || []), userMsg],
    },
  }));
  setInput("");
  setPendingImage(null);
  setLoading(true);

 try {
  // ── Orion → MCP Scheduler ──
  if (activeAgent.isMCP) {
    const mcpRes = await fetch(`${API_MCP_BASE}/tasks/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ prompt: text }),
    });

    if (!mcpRes.ok) {
      const err = await mcpRes.json();
      throw new Error(err.detail || "Erreur MCP.");
    }

    const mcpData = await mcpRes.json();

    // Construire une réponse lisible depuis la config MCP retournée
    const summary = [
      `✅ Tâche planifiée : **${mcpData.title}**`,
      `🔧 Outil : ${mcpData.tool}`,
      mcpData.cron_hour !== null
        ? `⏰ Planifiée à ${String(mcpData.cron_hour).padStart(2,"0")}h${String(mcpData.cron_minute).padStart(2,"0")}`
        : "",
      mcpData.cron_day === "*" ? "📅 Tous les jours" : `📅 Jour(s) : ${mcpData.cron_day}`,
      mcpData.repeat ? "🔁 Répétition activée" : "1️⃣ Exécution unique",
      mcpData.next_run_at
        ? `🚀 Prochaine exécution : ${new Date(mcpData.next_run_at).toLocaleString("fr-FR")}`
        : "",
    ].filter(Boolean).join("\n");

    const assistantMsg = {
      id:   mcpData.id,
      role: "assistant",
      content: summary,
      time: new Date(),
      meta: null,
    };

    setConversations((prev) => ({
      ...prev,
      [activeAgent.id]: {
        ...prev[activeAgent.id],
        messages: [...(prev[activeAgent.id]?.messages || []), assistantMsg],
      },
    }));

  } else {
    // ── Maestro → IA Conversations (code existant) ──
    let convId = conversations[activeAgent.id]?.convId;

    if (!convId) {
      const createRes = await fetch(`${API_BASE}/conversations/`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ title: `${activeAgent.name} — session`, mode: activeAgent.mode }),
      });
      if (!createRes.ok) throw new Error("Impossible de créer la conversation.");
      const createData = await createRes.json();
      convId = createData.id;
      setConversations((prev) => ({
        ...prev,
        [activeAgent.id]: { ...prev[activeAgent.id], convId },
      }));
    }

    const promptRes = await fetch(`${API_BASE}/conversations/${convId}/prompt/`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ prompt: text || "Analyse cette image." }),
    });

    if (!promptRes.ok) {
      const err = await promptRes.json();
      throw new Error(err.detail || "Erreur serveur.");
    }

    const promptData = await promptRes.json();
    const assistantMsg = {
      id:      promptData.id,
      role:    "assistant",
      content: promptData.content,
      time:    new Date(promptData.created_at),
      meta:    promptData.analysis_result || null,
    };

    setConversations((prev) => ({
      ...prev,
      [activeAgent.id]: {
        ...prev[activeAgent.id],
        messages: [...(prev[activeAgent.id]?.messages || []), assistantMsg],
      },
    }));
  }

} catch (e) {
  setError(e.message);
} finally {
  setLoading(false);
}});
  // ── Gestion image ──
  const handleImageFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const preview = URL.createObjectURL(file);
    const base64  = await fileToBase64(file);
    setPendingImage({ file, preview, base64 });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleImageFile(file);
  };

  // ── Keyboard ──
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Changer d'agent ──
  const switchAgent = (agent) => {
    setActiveAgent(agent);
    setInput("");
    setPendingImage(null);
    setError(null);
  };

  // ── Nouvelle conversation ──
  const newConversation = () => {
    setConversations((prev) => ({ ...prev, [activeAgent.id]: null }));
    setInput("");
    setPendingImage(null);
  };

  return (
    <div className="atelier-root">
      {/* ── SIDEBAR ── */}
      <aside className={`atelier-sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="brand-title">Atelier IA</span>
            <span className="brand-sub">ESPACE DE DESIGN</span>
          </div>
        </div>

        <div className="agents-label">AGENTS DISPONIBLES</div>

        <div className="agents-list">
          {AGENTS.map((agent) => (
            <button
              key={agent.id}
              className={`agent-card ${activeAgent.id === agent.id ? "active" : ""}`}
              onClick={() => switchAgent(agent)}
            >
              <div className="agent-card-top">
                <div className="agent-avatar" style={{ background: agent.color }}>
                  {agent.icon}
                </div>
                <div className="agent-info">
                  <div className="agent-name">
                    {agent.name}
                    {agent.acceptsImages && (
                      <span className="badge-images">📎 Images activées</span>
                    )}
                  </div>
                  <div className="agent-role">{agent.role}</div>
                </div>
              </div>
              <p className="agent-desc">{agent.description}</p>
              <div className="agent-tags">
                {agent.tags.map((t) => (
                  <span key={t} className="agent-tag">{t}</span>
                ))}
              </div>
              {activeAgent.id === agent.id && (
                <div className="agent-status">● ACTIF</div>
              )}
            </button>
          ))}
        </div>

        {/* Agent sélectionné résumé */}
        <div className="selected-agent-panel">
          <div className="selected-label">Agent sélectionné</div>
          <div className="selected-name">{activeAgent.name}</div>
          <p className="selected-desc">{activeAgent.description}</p>
          {activeAgent.acceptsImages && (
            <button className="btn-images-badge">📎 Accepte les images</button>
          )}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="atelier-main">
        {/* Header */}
        <header className="chat-header">
          <button className="btn-menu" onClick={() => setSidebarOpen((v) => !v)}>
            ☰
          </button>
          <div className="header-agent">
            <div className="header-avatar" style={{ background: activeAgent.color }}>
              {activeAgent.icon}
            </div>
            <div>
              <div className="header-name">{activeAgent.name}</div>
              <div className="header-role">{activeAgent.role}</div>
            </div>
            {activeAgent.acceptsImages && (
              <span className="header-badge">📎 Images activées</span>
            )}
          </div>
          <div className="header-right">
            <button className="btn-new-conv" onClick={newConversation} title="Nouvelle conversation">
              ✦ Nouveau
            </button>
            <span className="status-dot">● En ligne</span>
          </div>
        </header>

        {/* Messages */}
        <section
          className="chat-messages"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {currentMessages.map((msg) => (
            <div key={msg.id} className={`msg-row ${msg.role}`}>
              {msg.role === "assistant" && (
                <div className="msg-avatar" style={{ background: activeAgent.color }}>
                  {activeAgent.icon}
                </div>
              )}
              <div className="msg-body">
                {msg.role === "assistant" && (
                  <div className="msg-sender">{activeAgent.name}</div>
                )}
                <div className="msg-bubble">
                  {msg.image && (
                    <img src={msg.image} alt="Œuvre partagée" className="msg-image" />
                  )}
                  <p>{msg.content}</p>
                  {/* Métadonnées structurées */}
                  {msg.meta && (msg.meta.art_movement || msg.meta.art_period) && (
                    <div className="msg-meta">
                      {msg.meta.art_period && (
                        <span className="meta-tag">🕰 {msg.meta.art_period}</span>
                      )}
                      {msg.meta.art_movement && (
                        <span className="meta-tag">🎨 {msg.meta.art_movement}</span>
                      )}
                      {msg.meta.confidence_score > 0 && (
                        <span className="meta-tag">
                          ✦ {Math.round(msg.meta.confidence_score * 100)}% confiance
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="msg-time">{formatTime(new Date(msg.time))}</div>
              </div>
            </div>
          ))}

          {/* Loading */}
          {loading && (
            <div className="msg-row assistant">
              <div className="msg-avatar" style={{ background: activeAgent.color }}>
                {activeAgent.icon}
              </div>
              <div className="msg-body">
                <div className="msg-sender">{activeAgent.name}</div>
                <div className="msg-bubble typing">
                  <span /><span /><span />
                </div>
              </div>
            </div>
          )}

          {/* Erreur */}
          {error && (
            <div className="chat-error">⚠ {error}</div>
          )}

          <div ref={messagesEndRef} />
        </section>

        {/* Zone de saisie */}
        <footer className="chat-input-area">
          {/* Aperçu image en attente */}
          {pendingImage && (
            <div className="pending-image-preview">
              <img src={pendingImage.preview} alt="En attente" />
              <button onClick={() => setPendingImage(null)} className="btn-remove-img">✕</button>
            </div>
          )}

          <div className="input-row">
            <button
              className="btn-attach"
              onClick={() => fileInputRef.current?.click()}
              title="Joindre une image"
              disabled={!activeAgent.acceptsImages}
            >
              🖼
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleImageFile(e.target.files[0])}
            />
            <textarea
              ref={textareaRef}
              className="chat-textarea"
              placeholder="Message ou déposez une image..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={1}
            />
            <button
              className="btn-send"
              onClick={handleSend}
              disabled={loading || (!input.trim() && !pendingImage)}
            >
              ➤
            </button>
          </div>

          <div className="input-hints">
            <span>⏎ Envoyer</span>
            <span>⇧⏎ Nouvelle ligne</span>
            <span>Glisser-déposer une image</span>
          </div>
        </footer>
      </main>
    </div>
  );
}
