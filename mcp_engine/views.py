"""
mcp_scheduler/views.py — unifié tâches + œuvres
"""
import re
import logging
from datetime import timedelta
from unittest import result
from urllib import request

from django.utils import timezone
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

from .models import ScheduledTask, TaskStatus
from .serializers import ScheduledTaskSerializer, PromptCreateSerializer
from .mcp_engine import get_mcp_engine
from .tasks import safe_delay, _compute_next_run

logger = logging.getLogger(__name__)

IMMEDIATE_KEYWORDS = ["maintenant", "immédiatement", "tout de suite", "dès maintenant"]

def _is_immediate(prompt: str) -> bool:
    return any(kw in prompt.lower() for kw in IMMEDIATE_KEYWORDS)

def _extract_delay_minutes(prompt: str) -> int:
    match = re.search(r"dans\s+(\d+)\s*min", prompt.lower())
    return int(match.group(1)) if match else 0


class ScheduledTaskViewSet(viewsets.ModelViewSet):
    serializer_class   = ScheduledTaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ScheduledTask.objects.filter(
            user=self.request.user
        ).prefetch_related("executions")

    def create(self, request, *args, **kwargs):
        input_ser = PromptCreateSerializer(data=request.data)
        input_ser.is_valid(raise_exception=True)
        raw_prompt = input_ser.validated_data["prompt"]

        # Récupérer l'image si envoyée
        image_file = request.FILES.get("img", None)

        try:
            result = get_mcp_engine().handle(
                raw_prompt,
                user=request.user,
                image_file=image_file,
            )
        except ValueError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.exception("MCP error: %s", e)
            # Le return doit être ICI, dans le bloc except
            return Response(
                {"detail": "Erreur lors de l'analyse.", "error": str(e)},
                status=status.HTTP_502_BAD_GATEWAY,
            )

        # ── Résultat œuvre → retourner directement ──
        if result.get("category") != "task":
            return Response(result, status=status.HTTP_200_OK)

        # ── Résultat tâche → créer en BDD et planifier ──
        config = result["config"]

        task = ScheduledTask.objects.create(
            user=request.user,
            raw_prompt=raw_prompt,
            title=config.get("title", raw_prompt[:60]),
            tool=config.get("tool", ""),
            tool_params=config.get("tool_params", {}),
            cron_hour=config.get("cron_hour", 8),
            cron_minute=config.get("cron_minute", 0),
            cron_day=str(config.get("cron_day", "*")),
            repeat=config.get("repeat", True),
            status=TaskStatus.ACTIVE,
        )

        delay_minutes = _extract_delay_minutes(raw_prompt)

        if delay_minutes > 0:
            safe_delay(str(task.id), delay_seconds=delay_minutes * 60)
            task.next_run_at = timezone.now() + timedelta(minutes=delay_minutes)
            task.repeat = False
            task.save(update_fields=["next_run_at", "repeat"])
            message = f"✅ Compris ! J'enverrai le mail dans {delay_minutes} minute(s)."

        elif _is_immediate(raw_prompt):
            safe_delay(str(task.id), delay_seconds=0)
            task.next_run_at = timezone.now()
            task.repeat = False
            task.save(update_fields=["next_run_at", "repeat"])
            message = "✅ Action exécutée immédiatement."

        else:
            task.next_run_at = _compute_next_run(task)
            task.save(update_fields=["next_run_at"])
            next_str = task.next_run_at.strftime("%d/%m/%Y à %H:%M")
            message = f"✅ Tâche planifiée. Prochaine exécution : {next_str}"

        data = ScheduledTaskSerializer(task).data
        data["message"] = message
        return Response(data, status=status.HTTP_201_CREATED)

    def partial_update(self, request, *args, **kwargs):
        task       = self.get_object()
        new_status = request.data.get("status")
        allowed    = [TaskStatus.ACTIVE, TaskStatus.PAUSED]
        if new_status not in allowed:
            return Response({"detail": f"Status autorisé : {allowed}"}, status=status.HTTP_400_BAD_REQUEST)
        task.status = new_status
        if new_status == TaskStatus.ACTIVE:
            task.next_run_at = _compute_next_run(task)
        task.save(update_fields=["status", "next_run_at"])
        return Response(ScheduledTaskSerializer(task).data)

    @action(detail=True, methods=["post"], url_path="run")
    def run_now(self, request, pk=None):
        task = self.get_object()
        safe_delay(str(task.id), delay_seconds=0)
        return Response({"detail": f"Tâche '{task.title}' déclenchée."}, status=status.HTTP_202_ACCEPTED)

    def destroy(self, request, *args, **kwargs):
        task  = self.get_object()
        title = task.title
        task.delete()
        return Response({"detail": f"Tâche '{title}' supprimée."}, status=status.HTTP_200_OK)