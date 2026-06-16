// src/components/3d/GuideChat.jsx
// Panel de discussion avec le guide IA — style carnet de musée bordeaux/or
import { useState, useRef, useEffect, useCallback } from "react";
import { aiGuideService } from "../../services/ai";

// ── Styles inline constants ───────────────────────────────────────────────────
const COLORS = {
  bg:        "#0A0508",
  bgPanel:   "#150810",
  bgCard:    "#1C0A12",
  border:    "rgba(201,160,64,0.22)",
  borderHov: "rgba(201,160,64,0.5)",
  gold:      "#C9A040",
  goldLight: "#E8C06A",
  cream:     "#F5ECD7",
  creamDim:  "rgba(245,236,215,0.65)",
  bordeaux:  "#3D0C1F",
  muted:     "rgba(245,236,215,0.35)",
};

// ── Indicateur "en train d'écrire" ───────────────────────────────────────────
function TypingIndicator() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "10px 14px" }}>
      <div style={{
        width: 28, height: 28, borderRadius: "50%",
        background: `linear-gradient(135deg, ${COLORS.bordeaux}, ${COLORS.bgCard})`,
        border: `1px solid ${COLORS.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 13, flexShrink: 0,
      }}>
        ✦
      </div>
      <div style={{
        background: COLORS.bgCard, border: `1px solid ${COLORS.border}`,
        borderRadius: "0 8px 8px 8px", padding: "8px 14px",
        display: "flex", gap: 4, alignItems: "center",
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 5, height: 5, borderRadius: "50%",
            background: COLORS.gold,
            animation: `typingBounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
    </div>
  );
}

// ── Bulle de message ──────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex",
      flexDirection: isUser ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 8,
      padding: "4px 14px",
      animation: "msgSlide 0.25s ease",
    }}>
      {/* Avatar miniature */}
      {!isUser && (
        <div style={{
          width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
          background: `linear-gradient(135deg, ${COLORS.bordeaux}, #2A1218)`,
          border: `1px solid ${COLORS.border}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, color: COLORS.gold,
        }}>
          ✦
        </div>
      )}

      <div style={{ maxWidth: "78%" }}>
        <div style={{
          background: isUser
            ? `linear-gradient(135deg, ${COLORS.bordeaux} 0%, #4A1428 100%)`
            : COLORS.bgCard,
          border: `1px solid ${isUser ? "rgba(201,160,64,0.3)" : COLORS.border}`,
          borderRadius: isUser ? "8px 0 8px 8px" : "0 8px 8px 8px",
          padding: "9px 13px",
          color: isUser ? COLORS.cream : COLORS.creamDim,
          fontSize: 13,
          lineHeight: 1.6,
        }}>
          {msg.content}
        </div>
        <div style={{
          fontSize: 9, color: COLORS.muted, letterSpacing: "0.08em",
          marginTop: 3,
          textAlign: isUser ? "right" : "left",
          paddingLeft: isUser ? 0 : 4,
          paddingRight: isUser ? 4 : 0,
        }}>
          {formatTime(msg.timestamp)}
        </div>
      </div>
    </div>
  );
}

// ── Suggestions de questions ──────────────────────────────────────────────────
function Suggestions({ questions, onSelect, disabled }) {
  return (
    <div style={{
      padding: "8px 14px",
      display: "flex", flexWrap: "wrap", gap: 6,
    }}>
      {questions.map((q, i) => (
        <button
          key={i}
          disabled={disabled}
          onClick={() => onSelect(q)}
          style={{
            background: "rgba(201,160,64,0.06)",
            border: `1px solid ${COLORS.border}`,
            borderRadius: 16, padding: "5px 11px",
            color: COLORS.gold, fontSize: 11,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.4 : 1,
            transition: "all 0.2s",
            whiteSpace: "nowrap",
          }}
          onMouseEnter={e => { if (!disabled) e.currentTarget.style.background = "rgba(201,160,64,0.14)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(201,160,64,0.06)"; }}
        >
          {q}
        </button>
      ))}
    </div>
  );
}

// ── Composant principal ───────────────────────────────────────────────────────
export default function GuideChat({ chambre, oeuvres = [], currentOeuvre = null, onClose }) {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  const galleryData = { chambre, oeuvres };

  // Message de bienvenue
  useEffect(() => {
    const welcome = aiGuideService.getWelcomeMessage(chambre);
    setMessages([{
      role: "assistant",
      content: welcome,
      timestamp: new Date(),
    }]);
    setSuggestions(aiGuideService.getSuggestedQuestions(oeuvres, currentOeuvre));
    setTimeout(() => inputRef.current?.focus(), 100);
  }, []);

  // Mettre à jour suggestions si une œuvre est sélectionnée
  useEffect(() => {
    setSuggestions(aiGuideService.getSuggestedQuestions(oeuvres, currentOeuvre));
  }, [currentOeuvre?.id]);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = useCallback(async (text) => {
    const content = (text || input).trim();
    if (!content || loading) return;

    setInput("");
    setShowSuggestions(false);
    setError(null);

    const userMsg = { role: "user", content, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      const { content: reply } = await aiGuideService.sendMessage({
        message: content,
        history: messages,
        galleryData,
      });

      setMessages(prev => [...prev, {
        role: "assistant",
        content: reply,
        timestamp: new Date(),
      }]);
    } catch (err) {
      setError("Le guide est temporairement indisponible. Veuillez réessayer.");
      console.error("GuideChat error:", err);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [input, loading, messages, galleryData]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <style>{`
        @keyframes typingBounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
          40% { transform: translateY(-5px); opacity: 1; }
        }
        @keyframes msgSlide {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes panelIn {
          from { opacity: 0; transform: translateX(24px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .guide-input:focus { outline: none; }
        .guide-input::placeholder { color: rgba(245,236,215,0.25); }
        .guide-scroll::-webkit-scrollbar { width: 3px; }
        .guide-scroll::-webkit-scrollbar-track { background: transparent; }
        .guide-scroll::-webkit-scrollbar-thumb { background: rgba(201,160,64,0.2); border-radius: 2px; }
      `}</style>

      <div style={{
        position: "fixed", bottom: 24, right: 300,
        width: 360, maxHeight: 560,
        display: "flex", flexDirection: "column",
        background: `linear-gradient(160deg, #130810 0%, #1C0A12 100%)`,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 6,
        boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(201,160,64,0.05)",
        zIndex: 150,
        animation: "panelIn 0.3s ease",
        overflow: "hidden",
      }}>

        {/* ── Header ── */}
        <div style={{
          padding: "14px 16px",
          borderBottom: `1px solid ${COLORS.border}`,
          display: "flex", alignItems: "center", gap: 12,
          background: "rgba(0,0,0,0.3)",
          flexShrink: 0,
        }}>
          {/* Mini avatar */}
          <div style={{
            width: 40, height: 40, borderRadius: "50%",
            background: `linear-gradient(135deg, ${COLORS.bordeaux} 0%, #2A1218 100%)`,
            border: `2px solid rgba(201,160,64,0.4)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, flexShrink: 0,
            boxShadow: `0 0 12px rgba(201,160,64,0.15)`,
          }}>
            ✦
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ color: COLORS.cream, fontSize: 13, fontFamily: "'Georgia', serif" }}>
              Guide ArtVision
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <div style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#5DCAA5",
                boxShadow: "0 0 4px #5DCAA5",
              }} />
              <span style={{ color: "#5DCAA5", fontSize: 10, letterSpacing: "0.08em" }}>
                DISPONIBLE
              </span>
            </div>
          </div>
          <button onClick={onClose} style={{
            background: "none", border: "none",
            color: COLORS.muted, cursor: "pointer",
            fontSize: 16, padding: 4, transition: "color 0.2s",
            borderRadius: 2,
          }}
          onMouseEnter={e => e.currentTarget.style.color = COLORS.cream}
          onMouseLeave={e => e.currentTarget.style.color = COLORS.muted}
          >
            ✕
          </button>
        </div>

        {/* ── Contexte œuvre courante ── */}
        {currentOeuvre && (
          <div style={{
            margin: "10px 14px 0",
            padding: "8px 12px",
            background: "rgba(201,160,64,0.06)",
            border: `1px solid rgba(201,160,64,0.18)`,
            borderRadius: 3,
            display: "flex", alignItems: "center", gap: 8,
            flexShrink: 0,
          }}>
            <img src={currentOeuvre.img} alt={currentOeuvre.titre}
              style={{ width: 32, height: 32, objectFit: "cover", borderRadius: 2, border: `1px solid ${COLORS.border}` }}
              onError={e => { e.target.style.display = "none"; }}
            />
            <div>
              <div style={{ color: COLORS.cream, fontSize: 11 }}>{currentOeuvre.titre}</div>
              <div style={{ color: COLORS.gold, fontSize: 10 }}>{currentOeuvre.prix} DT</div>
            </div>
            <div style={{ marginLeft: "auto", color: COLORS.muted, fontSize: 9, letterSpacing: "0.1em" }}>
              EN COURS
            </div>
          </div>
        )}

        {/* ── Messages ── */}
        <div
          className="guide-scroll"
          style={{
            flex: 1, overflowY: "auto",
            padding: "10px 0",
            minHeight: 0,
          }}
        >
          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          {loading && <TypingIndicator />}
          {error && (
            <div style={{
              margin: "4px 14px",
              padding: "8px 12px",
              background: "rgba(226,75,74,0.1)",
              border: "1px solid rgba(226,75,74,0.25)",
              borderRadius: 4,
              color: "#E24B4A", fontSize: 12,
            }}>
              ⚠ {error}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Suggestions ── */}
        {showSuggestions && suggestions.length > 0 && !loading && (
          <>
            <div style={{
              height: 1, background: COLORS.border, flexShrink: 0, margin: "0 14px",
            }} />
            <Suggestions
              questions={suggestions.slice(0, 3)}
              onSelect={(q) => sendMessage(q)}
              disabled={loading}
            />
          </>
        )}

        {/* ── Input ── */}
        <div style={{
          borderTop: `1px solid ${COLORS.border}`,
          padding: "10px 12px",
          display: "flex", alignItems: "flex-end", gap: 8,
          background: "rgba(0,0,0,0.2)",
          flexShrink: 0,
        }}>
          <textarea
            ref={inputRef}
            className="guide-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(false)}
            placeholder="Posez votre question…"
            rows={1}
            disabled={loading}
            style={{
              flex: 1, background: "rgba(201,160,64,0.05)",
              border: `1px solid ${input ? COLORS.borderHov : COLORS.border}`,
              borderRadius: 3, padding: "8px 12px",
              color: COLORS.cream, fontSize: 13,
              resize: "none", fontFamily: "inherit",
              lineHeight: 1.4, transition: "border-color 0.2s",
              maxHeight: 80, overflow: "auto",
            }}
          />
          <button
            onClick={() => sendMessage()}
            disabled={loading || !input.trim()}
            style={{
              width: 36, height: 36, borderRadius: 3, flexShrink: 0,
              background: input.trim() && !loading
                ? `linear-gradient(135deg, ${COLORS.gold}, ${COLORS.goldLight})`
                : "rgba(201,160,64,0.1)",
              border: `1px solid ${input.trim() ? COLORS.gold : COLORS.border}`,
              cursor: input.trim() && !loading ? "pointer" : "not-allowed",
              color: input.trim() && !loading ? "#1A0C10" : COLORS.muted,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16, transition: "all 0.2s",
            }}
          >
            {loading ? (
              <div style={{
                width: 14, height: 14, borderRadius: "50%",
                border: "2px solid rgba(201,160,64,0.3)",
                borderTop: `2px solid ${COLORS.gold}`,
                animation: "spin 0.8s linear infinite",
              }} />
            ) : "↑"}
          </button>
        </div>

        {/* Mention */}
        <div style={{
          textAlign: "center", padding: "4px 0 8px",
          color: "rgba(245,236,215,0.18)", fontSize: 9, letterSpacing: "0.1em",
          flexShrink: 0,
        }}>
          ARTVISION AI · Guide Culturel
        </div>
      </div>
    </>
  );
}