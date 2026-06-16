"""
art_analyst/celery.py  (ou backend/celery.py selon ton projet)
À placer dans le même dossier que settings.py
"""
import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")  # adapte si besoin

app = Celery("artivision")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

# ── Beat schedule — vérifie les tâches dues toutes les minutes ──
app.conf.beat_schedule = {
    "dispatch-due-tasks-every-minute": {
        "task":     "mcp_scheduler.tasks.dispatch_due_tasks",
        "schedule": crontab(minute="*"),   # toutes les minutes
    },
}

app.conf.timezone = "Africa/Tunis"
