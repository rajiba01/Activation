"""
ia/services/langchain_service.py
Orchestration LangChain + Groq pour l'analyse d'art.
Pipeline :
  1. SystemPrompt  (selon le mode)
  2. Memory        (historique de la conversation)
  3. LLM call      (Groq llama-3.1-8b-instant)
  4. Output parser (extraction JSON structurée)
  5. Retry chain   (fiabilité)
"""

import json
import time
import os
import logging
from typing import Optional
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.messages import HumanMessage, AIMessage
from langchain_core.output_parsers import StrOutputParser, JsonOutputParser
from pydantic import BaseModel, Field
from django.conf import settings

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────
#  Pydantic schema — résultat structuré
# ─────────────────────────────────────────────
class ArtAnalysisSchema(BaseModel):
    answer: str = Field(description="Réponse complète de l'expert en art")
    art_period: str = Field(default="", description="Période artistique (ex: Renaissance, XIXe siècle)")
    art_movement: str = Field(default="", description="Mouvement artistique (ex: Impressionnisme, Baroque)")
    techniques: list[str] = Field(default=[], description="Techniques picturales identifiées")
    artists_mentioned: list[str] = Field(default=[], description="Artistes cités dans l'analyse")
    keywords: list[str] = Field(default=[], description="Mots-clés de l'analyse (max 8)")
    confidence_score: float = Field(default=0.8, description="Score de confiance entre 0 et 1")
    summary: str = Field(default="", description="Résumé en 2 phrases maximum")


# ─────────────────────────────────────────────
#  System prompts par mode
# ─────────────────────────────────────────────
SYSTEM_PROMPTS: dict[str, str] = {
    "general": (
        "Tu es un expert en analyse d'art, critique et historien de l'art de renommée internationale. "
        "Tu maîtrises toutes les périodes artistiques, de l'Antiquité à l'art contemporain. "
        "Fournis une analyse approfondie : style, technique, composition, lumière, couleur, "
        "contexte historique et impact émotionnel. "
        "Réponds UNIQUEMENT avec un JSON valide respectant exactement le schéma fourni."
    ),
    "style": (
        "Tu es un expert en techniques picturales et styles artistiques. "
        "Concentre-toi sur : médium, touche, palette, composition, perspective, mouvement artistique. "
        "Réponds UNIQUEMENT avec un JSON valide respectant exactement le schéma fourni."
    ),
    "histoire": (
        "Tu es un historien de l'art spécialisé dans la contextualisation des œuvres. "
        "Analyse chaque œuvre à travers son époque : contexte politique, social, religieux, "
        "biographie de l'artiste, mécènes, réception critique et influence sur les générations suivantes. "
        "Réponds UNIQUEMENT avec un JSON valide respectant exactement le schéma fourni."
    ),
    "symbolisme": (
        "Tu es un expert en iconographie et symbolisme. "
        "Décrypte la signification cachée : symboles religieux, mythologiques, allégoriques, "
        "attributs, couleurs symboliques, gestes codifiés. "
        "Réponds UNIQUEMENT avec un JSON valide respectant exactement le schéma fourni."
    ),
    "emotion": (
        "Tu es un critique d'art spécialisé dans l'analyse phénoménologique et émotionnelle. "
        "Explore : effet émotionnel, atmosphère, tensions visuelles, rapport forme/ressenti. "
        "Réponds UNIQUEMENT avec un JSON valide respectant exactement le schéma fourni."
    ),
    "comparaison": (
        "Tu es un expert en art comparatif. "
        "Analyse similitudes, influences mutuelles, emprunts stylistiques, évolutions et divergences. "
        "Réponds UNIQUEMENT avec un JSON valide respectant exactement le schéma fourni."
    ),
}

JSON_SCHEMA_HINT = """
Réponds UNIQUEMENT avec ce JSON (aucun texte avant ou après) :
{{
  "answer": "<réponse complète de l'expert>",
  "art_period": "<période>",
  "art_movement": "<mouvement>",
  "techniques": ["<tech1>", "<tech2>"],
  "artists_mentioned": ["<artiste1>"],
  "keywords": ["<mot1>", "<mot2>"],
  "confidence_score": 0.85,
  "summary": "<résumé en 2 phrases>"
}}
"""


# ─────────────────────────────────────────────
#  Service LangChain
# ─────────────────────────────────────────────
class ArtAnalystService:

    MODEL_NAME = "llama-3.1-8b-instant"
    TEMPERATURE = 0.4
    MAX_TOKENS = 2048

    def __init__(self):
        from django.conf import settings
        groq_key = settings.GROQ_API_KEY
        self.llm = ChatGroq(
        api_key=groq_key,
        model=self.MODEL_NAME,
        temperature=self.TEMPERATURE,
        max_tokens=self.MAX_TOKENS,
    )

    # ── Reconstruction historique LangChain ──
    def _build_history(self, messages_qs) -> list:
        history = []
        for msg in messages_qs:
            if msg.role == "user":
                history.append(HumanMessage(content=msg.content))
            elif msg.role == "assistant":
                history.append(AIMessage(content=msg.content))
        return history

    # ── Chain principale ──
    def _build_chain(self, mode: str):
        system_prompt = SYSTEM_PROMPTS.get(mode, SYSTEM_PROMPTS["general"])

        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt + "\n\n" + JSON_SCHEMA_HINT),
            MessagesPlaceholder(variable_name="history"),
            ("human", "{input}"),
        ])

        chain = prompt | self.llm | StrOutputParser()
        return chain

    # ── Parsing sécurisé du JSON ──
    def _safe_parse(self, raw: str) -> dict:
        raw = raw.strip()
        # Nettoyer les blocs markdown si présents
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            logger.warning("JSON parse failed, returning raw answer only.")
            return {
                "answer": raw,
                "art_period": "",
                "art_movement": "",
                "techniques": [],
                "artists_mentioned": [],
                "keywords": [],
                "confidence_score": 0.5,
                "summary": "",
            }

    # ── Point d'entrée principal ──
    def analyze(
        self,
        prompt: str,
        mode: str,
        conversation_messages,
    ) -> dict:
        """
        Retourne :
          {
            "answer": str,
            "structured": dict (ArtAnalysisSchema fields),
            "model_used": str,
            "tokens_used": int,
            "latency_ms": int,
          }
        """
        history = self._build_history(conversation_messages)
        chain = self._build_chain(mode)

        start = time.time()
        try:
            raw_response = chain.invoke({"history": history, "input": prompt})
        except Exception as exc:
            logger.exception("LangChain/Groq error: %s", exc)
            raise

        latency_ms = int((time.time() - start) * 1000)
        parsed = self._safe_parse(raw_response)

        return {
            "answer": parsed.get("answer", raw_response),
            "structured": {
                "art_period":        parsed.get("art_period", ""),
                "art_movement":      parsed.get("art_movement", ""),
                "techniques":        parsed.get("techniques", []),
                "artists_mentioned": parsed.get("artists_mentioned", []),
                "keywords":          parsed.get("keywords", []),
                "confidence_score":  float(parsed.get("confidence_score", 0.8)),
                "summary":           parsed.get("summary", ""),
            },
            "model_used":  self.MODEL_NAME,
            "tokens_used": 0,          # Groq ne retourne pas encore les tokens via LangChain
            "latency_ms":  latency_ms,
        }


# Singleton — instancié à la première utilisation uniquement
_service_instance = None

def get_art_analyst_service():
    global _service_instance
    if _service_instance is None:
        _service_instance = ArtAnalystService()
    return _service_instance

art_analyst_service = None  # sera initialisé au premier appel
