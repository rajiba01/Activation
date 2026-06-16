"""
mcp_scheduler/mcp_engine.py
MCP Engine unifié — LangChain + Groq.
Gère en un seul prompt :
  - CRUD des œuvres (create, update, delete, get, list, statut)
  - Tâches planifiées (send_email, send_reminder, generate_report, post_notif)
"""
import json
import logging
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from django.conf import settings
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from oeuvres.models import Oeuvre

logger = logging.getLogger(__name__)


# ══════════════════════════════════════════════════════════════
#  SYSTEM PROMPT UNIFIÉ
# ══════════════════════════════════════════════════════════════
PARSER_SYSTEM = """
Tu es un assistant intelligent qui analyse des instructions en langage naturel.
Tu retournes UNIQUEMENT un JSON valide, sans texte avant ou après.

Tu gères deux catégories :

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATÉGORIE 1 — GESTION DES ŒUVRES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Actions : create, update, delete, get, list, statut

Exemples :
- "Ajoute une œuvre titre La Mer prix 500 technique huile"
- "Supprime l'œuvre God of War"
- "Change le statut de La Nuit en Vendu"
- "Modifie le prix de La Mer à 800"
- "Liste mes œuvres publiées"

JSON pour CREATE :
{{
  "category": "oeuvre",
  "action": "create",
  "data": {{
    "titre": "<titre>",
    "description": "<description ou vide>",
    "prix": <nombre>,
    "technique": "<technique ou vide>",
    "dimensions": "<dimensions ou vide>",
    "statut": "Publié",
    "nb_exemplaires": 1,
    "tags": [],
    "date_realisation": "<YYYY-MM-DD ou date du jour>"
  }}
}}

JSON pour UPDATE :
{{
  "category": "oeuvre",
  "action": "update",
  "titre_recherche": "<titre>",
  "data": {{ "<champ>": "<valeur>" }}
}}

JSON pour DELETE :
{{
  "category": "oeuvre",
  "action": "delete",
  "titre_recherche": "<titre>"
}}

JSON pour GET :
{{
  "category": "oeuvre",
  "action": "get",
  "titre_recherche": "<titre>"
}}

JSON pour LIST :
{{
  "category": "oeuvre",
  "action": "list",
  "filtres": {{ "statut": "<statut ou null>", "technique": "<technique ou null>" }}
}}

JSON pour STATUT :
{{
  "category": "oeuvre",
  "action": "statut",
  "titre_recherche": "<titre>",
  "statut": "<Brouillon|Publié|Vendu>"
}}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CATÉGORIE 2 — TÂCHES PLANIFIÉES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Outils : send_email, send_reminder, generate_report, post_notif
Jours   : * = tous, 1=lundi ... 7=dimanche

Exemples :
- "Envoie un mail à test@mail.com tous les jours à 8h"
- "Rappelle-moi dans 5 min de vérifier les commandes"
- "Envoie un mail maintenant à test@mail.com"

JSON :
{{
  "category": "task",
  "title": "<titre court>",
  "tool": "<send_email|send_reminder|generate_report|post_notif>",
  "tool_params": {{
    "to": "<email ou null>",
    "subject": "<sujet>",
    "body": "<corps du message>"
  }},
  "cron_hour": <0-23>,
  "cron_minute": <0-59>,
  "cron_day": "<* ou numéros>",
  "repeat": <true|false>
}}
"""

PARSER_HUMAN = "Instruction : {prompt}"


# ══════════════════════════════════════════════════════════════
#  OUTIL EMAIL
# ══════════════════════════════════════════════════════════════
class MCPTools:

    @staticmethod
    def send_email(params: dict) -> str:
        to      = params.get("to")
        subject = params.get("subject", "Message automatique")
        body    = params.get("body", "")
        if not to:
            raise ValueError("Destinataire email manquant.")
        try:
            msg = MIMEMultipart("alternative")
            msg["Subject"] = subject
            msg["From"]    = settings.DEFAULT_FROM_EMAIL
            msg["To"]      = to
            msg.attach(MIMEText(body, "plain", "utf-8"))
            with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
                server.ehlo()
                if settings.EMAIL_USE_TLS:
                    server.starttls()
                server.login(settings.EMAIL_HOST_USER, settings.EMAIL_HOST_PASSWORD)
                server.sendmail(settings.DEFAULT_FROM_EMAIL, [to], msg.as_string())
            logger.info("Email envoyé à %s", to)
            return f"Email envoyé à {to} avec succès."
        except Exception as e:
            logger.exception("Erreur email: %s", e)
            raise

    @staticmethod
    def send_reminder(params: dict) -> str:
        if params.get("to"):
            return MCPTools.send_email({**params, "subject": params.get("subject", "Rappel automatique")})
        return f"Rappel enregistré : {params.get('body', '')}"

    @staticmethod
    def generate_report(params: dict) -> str:
        if params.get("to"):
            return MCPTools.send_email(params)
        return f"Rapport généré : {params.get('subject', '')}"

    @staticmethod
    def post_notif(params: dict) -> str:
        logger.info("NOTIFICATION: %s", params.get("body", ""))
        return f"Notification envoyée : {params.get('body', '')}"

    TOOL_MAP = {
        "send_email":     send_email.__func__,
        "send_reminder":  send_reminder.__func__,
        "generate_report": generate_report.__func__,
        "post_notif":     post_notif.__func__,
    }

    @classmethod
    def execute(cls, tool: str, params: dict) -> str:
        fn = cls.TOOL_MAP.get(tool)
        if not fn:
            raise ValueError(f"Outil inconnu : {tool}")
        return fn(params)


# ══════════════════════════════════════════════════════════════
#  CRUD ŒUVRES
# ══════════════════════════════════════════════════════════════
class OeuvreCRUDTools:
    
    @staticmethod
    def _find(titre: str, user):
        from oeuvres.models import Oeuvre
        return (
            Oeuvre.objects.filter(artiste=user, titre__iexact=titre).first()
            or Oeuvre.objects.filter(artiste=user, titre__icontains=titre).first()
        )

    @staticmethod
    def create(data: dict, user) -> dict:
        from oeuvres.models import Oeuvre
        from Galerie.models import Galerie
        from datetime import date
        galerie = Galerie.objects.filter(status='published').first() or Galerie.objects.first()
        if not galerie:
            raise ValueError("Aucune galerie disponible.")
        oeuvre = Oeuvre.objects.create(
            artiste=user, galerie=galerie,
            titre=data.get("titre", "Sans titre"),
            description=data.get("description", ""),
            prix=float(data.get("prix", 0)),
            technique=data.get("technique", ""),
            dimensions=data.get("dimensions", ""),
            statut=data.get("statut", "Publié"),
            nb_exemplaires=int(data.get("nb_exemplaires", 1)),
            tags=data.get("tags", []),
            date_realisation=data.get("date_realisation") or str(date.today()),
        )
        return {
            "success": True, "action": "create",
            "message": f"✅ Œuvre « {oeuvre.titre} » créée.",
            "oeuvre": {"id": oeuvre.id, "titre": oeuvre.titre, "prix": float(oeuvre.prix), "statut": oeuvre.statut}
        }

    @staticmethod
    def update(titre: str, data: dict, user) -> dict:
        oeuvre = OeuvreCRUDTools._find(titre, user)
        if not oeuvre: raise ValueError(f"Œuvre « {titre} » introuvable.")
        FIELDS = ["titre", "description", "prix", "technique", "dimensions", "statut", "nb_exemplaires", "tags", "date_realisation"]
        updated = []
        for f, v in data.items():
            if f in FIELDS:
                setattr(oeuvre, f, v)
                updated.append(f)
        if updated: oeuvre.save(update_fields=updated)
        return {"success": True, "action": "update", "message": f"✅ Mise à jour : {', '.join(updated)}."}

    @staticmethod
    def delete(titre: str, user) -> dict:
        oeuvre = OeuvreCRUDTools._find(titre, user)
        if not oeuvre: raise ValueError(f"Œuvre « {titre} » introuvable.")
        oeuvre.delete()
        return {"success": True, "action": "delete", "message": "🗑️ Supprimée."}

    @staticmethod
    def get(titre: str, user) -> dict:
        oeuvre = OeuvreCRUDTools._find(titre, user)
        if not oeuvre: raise ValueError(f"Œuvre « {titre} » introuvable.")
        return {"success": True, "action": "get", "oeuvre": {"id": oeuvre.id, "titre": oeuvre.titre}}

    @staticmethod
    def list_oeuvres(filtres: dict, user) -> dict:
        from oeuvres.models import Oeuvre
        qs = Oeuvre.objects.filter(artiste=user)
        if filtres.get("statut"): qs = qs.filter(statut=filtres["statut"])
        oeuvres = list(qs.values("id", "titre", "prix", "statut"))
        return {"success": True, "action": "list", "oeuvres": oeuvres}

    @staticmethod
    def change_statut(titre: str, new_statut: str, user) -> dict:
        oeuvre = OeuvreCRUDTools._find(titre, user)
        if not oeuvre: raise ValueError("Introuvable.")
        oeuvre.statut = new_statut
        oeuvre.save(update_fields=["statut"])
        return {"success": True, "action": "statut", "message": "Statut modifié."}

    @classmethod
    def execute(cls, config: dict, user) -> dict:
        action = config.get("action")
        # Mapping des actions
        dispatch = {
            "create": lambda: cls.create(config.get("data", {}), user),
            "update": lambda: cls.update(config["titre_recherche"], config.get("data", {}), user),
            "delete": lambda: cls.delete(config["titre_recherche"], user),
            "get":    lambda: cls.get(config["titre_recherche"], user),
            "list":   lambda: cls.list_oeuvres(config.get("filtres", {}), user),
            "statut": lambda: cls.change_statut(config["titre_recherche"], config["statut"], user),
        }
        if action in dispatch:
            return dispatch[action]()
        raise ValueError(f"Action inconnue : {action}")
# ══════════════════════════════════════════════════════════════
#  ENGINE UNIFIÉ
# ══════════════════════════════════════════════════════════════
class MCPSchedulerEngine:

    MODEL = "llama-3.1-8b-instant"
    TEMP  = 0.1

    def __init__(self):
        self.llm = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model=self.MODEL,
            temperature=self.TEMP,
            max_tokens=600,
        )
        self.chain = (
            ChatPromptTemplate.from_messages([
                ("system", PARSER_SYSTEM),
                ("human",  PARSER_HUMAN),
            ])
            | self.llm
            | StrOutputParser()
        )

    def _parse(self, raw_prompt: str) -> dict:
        raw = self.chain.invoke({"prompt": raw_prompt}).strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip().rstrip("```")
        try:
            return json.loads(raw)
        except json.JSONDecodeError:
            logger.error("LLM parse error: %s", raw)
            raise ValueError("Je n'ai pas pu interpréter votre instruction. Soyez plus précis.")

    # ── Utilisé par les tâches planifiées (Celery) ──
    def parse_prompt(self, raw_prompt: str) -> dict:
        return self._parse(raw_prompt)

    # ── Utilisé pour le CRUD immédiat ──
    def execute_tool(self, tool: str, tool_params: dict) -> str:
        return MCPTools.execute(tool, tool_params)

    # ── Point d'entrée unifié : parse + exécute selon la catégorie ──
    def handle(self, raw_prompt: str, user=None , image_file=None) -> dict:
        config   = self._parse(raw_prompt)
        category = config.get("category", "task")
        if image_file:
            logger.info("Image reçue dans le moteur : %s", image_file.name)
        if category == "oeuvre":
            if user is None:
                raise ValueError("Utilisateur requis pour les actions sur les œuvres.")
            return OeuvreCRUDTools.execute(config, user)

        elif category == "task":
            return {"category": "task", "config": config}

        raise ValueError(f"Catégorie inconnue : {category}")


# Singleton
_engine = None

def get_mcp_engine() -> MCPSchedulerEngine:
    global _engine
    if _engine is None:
        _engine = MCPSchedulerEngine()
    return _engine
