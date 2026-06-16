import uuid
from django.db import models
from django.conf import settings

from accounts.models import User


class AnalysisMode(models.TextChoices):
    GENERAL      = "general",      "Analyse générale"
    STYLE        = "style",        "Style & technique"
    HISTOIRE     = "histoire",     "Contexte historique"
    SYMBOLISME   = "symbolisme",   "Symbolisme"
    EMOTION      = "emotion",      "Émotion & ressenti"
    COMPARAISON  = "comparaison",  "Comparaison d'œuvres"


class MessageRole(models.TextChoices):
    USER      = "user",      "Utilisateur"
    ASSISTANT = "assistant", "Assistant"


# ─────────────────────────────────────────────
#  Conversation  (session d'analyse)
# ─────────────────────────────────────────────
class Conversation(models.Model):
    id         = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
    User, on_delete=models.CASCADE,
    related_name="ia_conversations", null=True, blank=True,
)
    title      = models.CharField(max_length=255, default="Nouvelle analyse")
    mode       = models.CharField(
        max_length=20, choices=AnalysisMode.choices, default=AnalysisMode.GENERAL,
    )
    artwork_description = models.TextField(blank=True)
    artwork_image       = models.ImageField(upload_to="artworks/", null=True, blank=True)
    total_tokens        = models.PositiveIntegerField(default=0)
    created_at          = models.DateTimeField(auto_now_add=True)
    updated_at          = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-updated_at"]
        verbose_name = "Conversation"
        verbose_name_plural = "Conversations"

    def __str__(self):
        return f"[{self.mode}] {self.title}"


# ─────────────────────────────────────────────
#  Message  (échange utilisateur / assistant)
# ─────────────────────────────────────────────
class Message(models.Model):
    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    conversation = models.ForeignKey(
        Conversation, on_delete=models.CASCADE, related_name="messages",
    )
    role         = models.CharField(max_length=10, choices=MessageRole.choices)
    content      = models.TextField()
    tokens_used  = models.PositiveIntegerField(default=0)
    model_used   = models.CharField(max_length=100, blank=True)
    latency_ms   = models.PositiveIntegerField(default=0)
    created_at   = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        verbose_name = "Message"

    def __str__(self):
        return f"[{self.role}] {self.content[:80]}"



class AnalysisResult(models.Model):
    id               = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    message          = models.OneToOneField(
        Message, on_delete=models.CASCADE, related_name="analysis_result",
    )
    art_period       = models.CharField(max_length=150, blank=True)
    art_movement     = models.CharField(max_length=150, blank=True)
    techniques       = models.JSONField(default=list)
    artists_mentioned = models.JSONField(default=list)
    keywords         = models.JSONField(default=list)
    confidence_score = models.FloatField(default=0.0)
    summary          = models.TextField(blank=True)
    created_at       = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Résultat d'analyse"

    def __str__(self):
        return f"{self.art_movement} / {self.art_period}"
