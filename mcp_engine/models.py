"""
mcp_scheduler/models.py
Modèles pour les tâches automatiques planifiées par prompt naturel.
"""
import uuid
from django.db import models
from django.conf import settings


class TaskStatus(models.TextChoices):
    ACTIVE   = "active",   "Active"
    PAUSED   = "paused",   "En pause"
    DONE     = "done",     "Terminée"
    FAILED   = "failed",   "Échouée"


class TaskTool(models.TextChoices):
    SEND_EMAIL       = "send_email",       "Envoyer un email"
    SEND_REMINDER    = "send_reminder",    "Envoyer un rappel"
    GENERATE_REPORT  = "generate_report",  "Générer un rapport"
    POST_NOTIF       = "post_notif",       "Envoyer une notification"
    # Nouveaux outils CRUD
    DELETE_ARTWORK   = "delete_artwork",   "Supprimer une œuvre"
    DELETE_GALLERY   = "delete_gallery",   "Supprimer une galerie"

class ScheduledTask(models.Model):
    """
    Tâche planifiée créée depuis un prompt naturel.
    Ex: "Envoie un mail à rajibawael@gmail.com tous les jours à 8h"
    """
    id           = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user         = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE,
        related_name="scheduled_tasks",
    )
    # Prompt original de l'utilisateur
    raw_prompt   = models.TextField(verbose_name="Prompt naturel")

    # Champs extraits par le MCP/LLM
    title        = models.CharField(max_length=255, blank=True)
    tool         = models.CharField(max_length=30, choices=TaskTool.choices, blank=True)
    tool_params  = models.JSONField(default=dict, help_text="Paramètres extraits (to, subject, body...)")

    # Planification extraite
    cron_hour    = models.PositiveSmallIntegerField(null=True, blank=True, help_text="0-23")
    cron_minute  = models.PositiveSmallIntegerField(default=0)
    cron_day     = models.CharField(max_length=20, default="*", help_text="* ou 1-7 (lundi=1)")
    repeat       = models.BooleanField(default=True, help_text="Répéter ou exécuter une seule fois")
    next_run_at  = models.DateTimeField(null=True, blank=True)

    # État
    status       = models.CharField(max_length=10, choices=TaskStatus.choices, default=TaskStatus.ACTIVE)
    celery_task_id = models.CharField(max_length=255, blank=True)
    run_count    = models.PositiveIntegerField(default=0)
    last_run_at  = models.DateTimeField(null=True, blank=True)
    created_at   = models.DateTimeField(auto_now_add=True)
    updated_at   = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Tâche planifiée"
        verbose_name_plural = "Tâches planifiées"

    def __str__(self):
        return f"[{self.tool}] {self.title} — {self.status}"


class TaskExecution(models.Model):
    """
    Journal d'exécution de chaque tâche.
    """
    id        = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    task      = models.ForeignKey(ScheduledTask, on_delete=models.CASCADE, related_name="executions")
    success   = models.BooleanField(default=False)
    output    = models.TextField(blank=True, help_text="Résultat ou message d'erreur")
    run_at    = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-run_at"]
        verbose_name = "Exécution"

    def __str__(self):
        status = "✓" if self.success else "✗"
        return f"{status} {self.task.title} — {self.run_at.strftime('%d/%m %H:%M')}"
