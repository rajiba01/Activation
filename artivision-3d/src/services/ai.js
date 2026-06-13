// src/services/ai.js
// Service de communication avec le backend IA — Guide de galerie ArtVision
// Connecté à : /api/ai/chat/ (Django + Groq/Gemini selon votre config backend)

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000";

// ── Types de messages ─────────────────────────────────────────────────────────
// message: { role: "user" | "assistant", content: string, timestamp: Date }

// ── Contexte galerie injecté dans chaque requête ──────────────────────────────
function buildGalleryContext(galleryData) {
  if (!galleryData) return "";

  const { chambre, oeuvres = [] } = galleryData;

  const oeuvresText = oeuvres
    .map((o, i) =>
      `- Œuvre ${i + 1}: "${o.titre}" | Technique: ${o.technique || "N/A"} | Prix: ${o.prix} DT | Description: ${o.description || "Aucune"}`
    )
    .join("\n");

  return `
Tu es le guide virtuel de la galerie d'art "${chambre?.nom || "ArtVision 3D"}".
Tu es élégant, cultivé, passionné d'art tunisien et contemporain.
Tu connais parfaitement toutes les œuvres exposées et tu aides les visiteurs à les comprendre, les apprécier et potentiellement les acquérir.
Réponds toujours en français. Sois concis (3-4 phrases max sauf si on te demande plus).

Œuvres actuellement exposées dans cette galerie :
${oeuvresText || "Aucune œuvre disponible pour le moment."}

Si le visiteur te demande le prix ou comment acheter une œuvre, donne-lui l'information et encourage-le à cliquer sur l'œuvre pour l'acquérir.
  `.trim();
}

// ── Appel principal : envoyer un message ─────────────────────────────────────
export async function sendMessageToGuide({ message, history = [], galleryData = null }) {
  const systemContext = buildGalleryContext(galleryData);

  const payload = {
    message,
    history: history.map(m => ({ role: m.role, content: m.content })),
    system: systemContext,
    // Le backend peut utiliser ce champ pour choisir le modèle
    context_type: "gallery_guide",
  };

  const response = await fetch(`${API_BASE}/api/ai/chat/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Inclure le token CSRF si votre backend Django le requiert
      "X-CSRFToken": getCookie("csrftoken") || "",
    },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || error.message || `Erreur ${response.status}`);
  }

  const data = await response.json();

  // Adapter selon la structure de réponse de votre backend
  // Django Groq/Gemini retourne généralement : { response: "...", model: "..." }
  // ou : { message: "...", content: "..." }
  return {
    content: data.response || data.message || data.content || data.reply || "",
    model: data.model || "ai",
  };
}

// ── Variante streaming (si votre backend supporte SSE / stream) ───────────────
export async function* streamMessageToGuide({ message, history = [], galleryData = null }) {
  const systemContext = buildGalleryContext(galleryData);

  const response = await fetch(`${API_BASE}/api/ai/chat/stream/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCookie("csrftoken") || "",
    },
    credentials: "include",
    body: JSON.stringify({
      message,
      history: history.map(m => ({ role: m.role, content: m.content })),
      system: systemContext,
      context_type: "gallery_guide",
      stream: true,
    }),
  });

  if (!response.ok) throw new Error(`Erreur ${response.status}`);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split("\n").filter(l => l.startsWith("data: "));

    for (const line of lines) {
      const data = line.replace("data: ", "").trim();
      if (data === "[DONE]") return;
      try {
        const parsed = JSON.parse(data);
        yield parsed.delta || parsed.content || "";
      } catch {
        yield data;
      }
    }
  }
}

// ── Questions suggérées selon le contexte ────────────────────────────────────
export function getSuggestedQuestions(oeuvres = [], currentOeuvre = null) {
  const base = [
    "Quelles œuvres me recommandes-tu pour commencer ?",
    "Parle-moi du style artistique de cette galerie.",
    "Quelles techniques sont utilisées ici ?",
    "Y a-t-il des œuvres disponibles à moins de 500 DT ?",
    "Qu'est-ce qui rend cette galerie unique ?",
  ];

  if (currentOeuvre) {
    return [
      `Parle-moi de "${currentOeuvre.titre}"`,
      `Quelle est la technique utilisée pour "${currentOeuvre.titre}" ?`,
      `Est-ce que "${currentOeuvre.titre}" est une bonne acquisition ?`,
      "Y a-t-il d'autres œuvres similaires ?",
      ...base.slice(0, 2),
    ];
  }

  if (oeuvres.length > 0) {
    const random = oeuvres[Math.floor(Math.random() * oeuvres.length)];
    return [
      `Présente-moi "${random.titre}"`,
      ...base,
    ].slice(0, 5);
  }

  return base;
}

// ── Message de bienvenue du guide ────────────────────────────────────────────
export function getWelcomeMessage(chambre = null) {
  const name = chambre?.nom || "cette galerie";
  return `Bienvenue dans ${name} ! Je suis votre guide personnel. Je peux vous présenter les œuvres exposées, vous parler des artistes, des techniques utilisées, ou vous aider à choisir une acquisition. Comment puis-je vous accompagner ?`;
}

// ── Utilitaire CSRF ───────────────────────────────────────────────────────────
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

// ── Export objet service (compatible avec pattern 3alemni) ───────────────────
export const aiGuideService = {
  sendMessage: sendMessageToGuide,
  streamMessage: streamMessageToGuide,
  getSuggestedQuestions,
  getWelcomeMessage,
};

export default aiGuideService;