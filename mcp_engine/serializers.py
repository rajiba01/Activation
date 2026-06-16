"""
mcp_scheduler/serializers.py
"""
from rest_framework import serializers
from .models import ScheduledTask, TaskExecution


class TaskExecutionSerializer(serializers.ModelSerializer):
    class Meta:
        model  = TaskExecution
        fields = ["id", "success", "output", "run_at"]
        read_only_fields = fields


class ScheduledTaskSerializer(serializers.ModelSerializer):
    executions   = TaskExecutionSerializer(many=True, read_only=True)
    next_run_at  = serializers.DateTimeField(read_only=True)
    last_run_at  = serializers.DateTimeField(read_only=True)

    class Meta:
        model  = ScheduledTask
        fields = [
            "id", "raw_prompt", "title", "tool", "tool_params",
            "cron_hour", "cron_minute", "cron_day", "repeat",
            "status", "run_count", "next_run_at", "last_run_at",
            "created_at", "executions",
        ]
        read_only_fields = [
            "id", "title", "tool", "tool_params",
            "cron_hour", "cron_minute", "cron_day", "repeat",
            "run_count", "next_run_at", "last_run_at", "created_at",
        ]


class PromptCreateSerializer(serializers.Serializer):
    """Entrée utilisateur — prompt naturel uniquement."""
    prompt = serializers.CharField(min_length=10, max_length=1000)
