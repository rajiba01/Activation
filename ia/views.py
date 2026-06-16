"""
ia/views.py
API REST — analyse d'art avec LangChain + Groq.

Endpoints :
  GET    /ia/conversations/                → liste des conversations
  POST   /ia/conversations/               → créer une conversation
  GET    /ia/conversations/<uuid>/        → détail + historique messages
  PATCH  /ia/conversations/<uuid>/        → modifier titre / mode
  DELETE /ia/conversations/<uuid>/        → supprimer
  POST   /ia/conversations/<uuid>/prompt/ → envoyer un prompt → réponse IA
  DELETE /ia/conversations/<uuid>/clear/  → vider les messages
  GET    /ia/modes/                       → liste des modes disponibles
"""

import logging
from django.db import transaction
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from .models import Conversation, Message, AnalysisResult, AnalysisMode
from .serializers import (
    ConversationListSerializer,
    ConversationDetailSerializer,
    ConversationWriteSerializer,
    MessageSerializer,
    PromptInputSerializer,
)
from .services import get_art_analyst_service

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────
#  ConversationViewSet
# ─────────────────────────────────────────────
class ConversationViewSet(viewsets.ModelViewSet):
    """
    CRUD complet sur les conversations + action /prompt/.
    """
    permission_classes = [IsAuthenticated]  # ← remplacer par IsAuthenticated en production

    def get_queryset(self):
        qs = Conversation.objects.prefetch_related("messages__analysis_result")
        # Filtrer par user authentifié si disponible
        if self.request.user.is_authenticated:
            qs = qs.filter(user=self.request.user)
        return qs

    def get_serializer_class(self):
        if self.action in ("create", "update", "partial_update"):
            return ConversationWriteSerializer
        if self.action == "retrieve":
            return ConversationDetailSerializer
        return ConversationListSerializer

    def create(self, request, *args, **kwargs):
        serializer = ConversationWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        instance = serializer.save(user=request.user)
    # Retourner avec l'id
        return Response(
        ConversationListSerializer(instance).data,
        status=status.HTTP_201_CREATED
    ) # ← plus de None possible

    # ── POST /ia/conversations/<uuid>/prompt/ ──
    @action(detail=True, methods=["post"], url_path="prompt")
    def prompt(self, request, pk=None):
        """
        Corps attendu : { "prompt": "..." }
        Retourne     : le message assistant avec résultat structuré.
        """
        conversation = self.get_object()

        # Validation de l'input
        input_serializer = PromptInputSerializer(data=request.data)
        if not input_serializer.is_valid():
            return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_prompt = input_serializer.validated_data["prompt"]

        # Récupérer l'historique existant
        history_qs = conversation.messages.all()

        # ── Appel LangChain ──
        try:
            result = get_art_analyst_service().analyze(
                prompt=user_prompt,
                mode=conversation.mode,
                conversation_messages=history_qs,
            )
        except Exception as exc:
            logger.exception("LangChain error for conversation %s: %s", pk, exc)
            return Response(
                {"detail": "Erreur lors de l'appel au modèle IA.", "error": str(exc)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        # ── Persistance atomique ──
        with transaction.atomic():
            # 1. Sauvegarder le message utilisateur
            user_msg = Message.objects.create(
                conversation=conversation,
                role="user",
                content=user_prompt,
            )

            # 2. Sauvegarder la réponse assistant
            assistant_msg = Message.objects.create(
                conversation=conversation,
                role="assistant",
                content=result["answer"],
                model_used=result["model_used"],
                tokens_used=result["tokens_used"],
                latency_ms=result["latency_ms"],
            )

            # 3. Sauvegarder le résultat structuré
            structured = result["structured"]
            analysis_result = AnalysisResult.objects.create(
                message=assistant_msg,
                art_period=structured["art_period"],
                art_movement=structured["art_movement"],
                techniques=structured["techniques"],
                artists_mentioned=structured["artists_mentioned"],
                keywords=structured["keywords"],
                confidence_score=structured["confidence_score"],
                summary=structured["summary"],
            )

            # 4. Mettre à jour les tokens de la conversation
            conversation.total_tokens += result["tokens_used"]
            conversation.save(update_fields=["total_tokens", "updated_at"])

        return Response(
            MessageSerializer(assistant_msg).data,
            status=status.HTTP_201_CREATED,
        )

    # ── DELETE /ia/conversations/<uuid>/clear/ ──
    @action(detail=True, methods=["delete"], url_path="clear")
    def clear(self, request, pk=None):
        """Vider tous les messages d'une conversation sans la supprimer."""
        conversation = self.get_object()
        deleted_count, _ = conversation.messages.all().delete()
        conversation.total_tokens = 0
        conversation.save(update_fields=["total_tokens", "updated_at"])
        return Response(
            {"detail": f"{deleted_count} messages supprimés."},
            status=status.HTTP_200_OK,
        )


# ─────────────────────────────────────────────
#  ModeListView  —  GET /ia/modes/
# ─────────────────────────────────────────────
from rest_framework.views import APIView

class ModeListView(APIView):
    """Retourne la liste des modes d'analyse disponibles."""
    permission_classes = [AllowAny]

    def get(self, request):
        modes = [
            {"value": choice.value, "label": choice.label}
            for choice in AnalysisMode
        ]
        return Response(modes, status=status.HTTP_200_OK)
