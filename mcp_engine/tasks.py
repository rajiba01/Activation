"""
mcp_scheduler/tasks.py
"""
import logging
import threading
from datetime import datetime, timedelta

from celery import shared_task
from django.utils import timezone

logger = logging.getLogger(__name__)


# ══════════════════════════════════════════════════════════════
#  EXÉCUTION SYNCHRONE — fallback sans Redis/Celery
# ══════════════════════════════════════════════════════════════
def execute_task_sync(task_id: str):
    """Exécution directe sans Celery — utilisé si Redis indisponible."""
    from .models import ScheduledTask, TaskExecution, TaskStatus
    from .mcp_engine import get_mcp_engine

    try:
        task = ScheduledTask.objects.get(id=task_id)
    except ScheduledTask.DoesNotExist:
        logger.error("Tâche introuvable : %s", task_id)
        return

    logger.info("▶ [SYNC] Exécution tâche [%s] — outil: %s", task.title, task.tool)

    try:
        engine = get_mcp_engine()
        output = engine.execute_tool(task.tool, task.tool_params)

        TaskExecution.objects.create(task=task, success=True, output=output)
        task.run_count  += 1
        task.last_run_at = timezone.now()
        if not task.repeat:
            task.status = TaskStatus.DONE
        else:
            task.next_run_at = _compute_next_run(task)
        task.save(update_fields=["run_count", "last_run_at", "status", "next_run_at"])
        logger.info("✓ [SYNC] Tâche [%s] exécutée avec succès", task.title)
        return output

    except Exception as exc:
        logger.exception("✗ [SYNC] Tâche [%s] échouée : %s", task.title, exc)
        TaskExecution.objects.create(task=task, success=False, output=str(exc))
        raise


def safe_delay(task_id: str, delay_seconds: int = 0):
    """
    Lance la tâche via Celery si Redis disponible,
    sinon fallback sur threading.Timer.
    """
    try:
        if delay_seconds > 0:
            execute_scheduled_task.apply_async(
                args=[task_id],
                countdown=delay_seconds,
            )
        else:
            execute_scheduled_task.delay(task_id)
        logger.info("⚡ Tâche %s envoyée à Celery (délai: %ds)", task_id, delay_seconds)

    except Exception as e:
        logger.warning("Redis indisponible (%s) — fallback threading", e)
        if delay_seconds > 0:
            threading.Timer(delay_seconds, execute_task_sync, args=[task_id]).start()
            logger.info("⏱ Tâche %s planifiée via Timer dans %ds", task_id, delay_seconds)
        else:
            # Exécution dans un thread pour ne pas bloquer la requête HTTP
            threading.Thread(target=execute_task_sync, args=[task_id], daemon=True).start()


# ══════════════════════════════════════════════════════════════
#  CELERY TASKS
# ══════════════════════════════════════════════════════════════
@shared_task(bind=True, max_retries=3, default_retry_delay=60)
def execute_scheduled_task(self, task_id: str):
    """Tâche Celery principale."""
    from .models import ScheduledTask, TaskExecution, TaskStatus
    from .mcp_engine import get_mcp_engine

    try:
        task = ScheduledTask.objects.get(id=task_id)
    except ScheduledTask.DoesNotExist:
        logger.error("Tâche introuvable : %s", task_id)
        return

    if task.status != TaskStatus.ACTIVE:
        logger.info("Tâche %s ignorée (status: %s)", task_id, task.status)
        return

    logger.info("▶ Exécution tâche [%s] — outil: %s", task.title, task.tool)

    try:
        engine = get_mcp_engine()
        output = engine.execute_tool(task.tool, task.tool_params)

        TaskExecution.objects.create(task=task, success=True, output=output)
        task.run_count  += 1
        task.last_run_at = timezone.now()
        if not task.repeat:
            task.status = TaskStatus.DONE
        else:
            task.next_run_at = _compute_next_run(task)
        task.save(update_fields=["run_count", "last_run_at", "status", "next_run_at"])
        logger.info("✓ Tâche [%s] exécutée avec succès", task.title)

    except Exception as exc:
        logger.exception("✗ Tâche [%s] échouée : %s", task.title, exc)
        TaskExecution.objects.create(task=task, success=False, output=str(exc))
        try:
            raise self.retry(exc=exc)
        except self.MaxRetriesExceededError:
            task.status = TaskStatus.FAILED
            task.save(update_fields=["status"])


@shared_task
def dispatch_due_tasks():
    """Celery Beat — vérifie toutes les minutes."""
    from .models import ScheduledTask, TaskStatus

    now = timezone.now()
    due_tasks = ScheduledTask.objects.filter(
        status=TaskStatus.ACTIVE,
        next_run_at__lte=now,
    )
    count = due_tasks.count()
    if count:
        logger.info("⏰ %d tâche(s) à exécuter", count)
    for task in due_tasks:
        safe_delay(str(task.id))
    return f"{count} tâche(s) déclenchée(s)"


# ══════════════════════════════════════════════════════════════
#  UTILITAIRE
# ══════════════════════════════════════════════════════════════
def _compute_next_run(task) -> datetime:
    now  = timezone.now()
    next = now.replace(hour=task.cron_hour, minute=task.cron_minute, second=0, microsecond=0)

    if task.cron_day == "*":
        if next <= now:
            next += timedelta(days=1)
    else:
        target_days = [int(d) for d in str(task.cron_day).split(",")]
        for i in range(8):
            candidate = next + timedelta(days=i)
            if candidate.isoweekday() in target_days and candidate > now:
                next = candidate
                break
    return next