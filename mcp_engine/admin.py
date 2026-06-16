from django.contrib import admin
from .models import ScheduledTask, TaskExecution


@admin.register(ScheduledTask)
class ScheduledTaskAdmin(admin.ModelAdmin):
    list_display  = ["title", "tool", "status", "cron_hour", "cron_minute",
                     "cron_day", "repeat", "run_count", "next_run_at", "created_at"]
    list_filter   = ["status", "tool", "repeat"]
    search_fields = ["title", "raw_prompt", "user__email"]
    readonly_fields = ["id", "run_count", "last_run_at", "next_run_at", "created_at", "updated_at"]
    actions       = ["pause_tasks", "activate_tasks"]

    @admin.action(description="Mettre en pause")
    def pause_tasks(self, request, queryset):
        queryset.update(status="paused")

    @admin.action(description="Activer")
    def activate_tasks(self, request, queryset):
        queryset.update(status="active")


@admin.register(TaskExecution)
class TaskExecutionAdmin(admin.ModelAdmin):
    list_display  = ["task", "success", "run_at", "output_preview"]
    list_filter   = ["success"]
    readonly_fields = ["id", "run_at"]

    def output_preview(self, obj):
        return obj.output[:80]
    output_preview.short_description = "Résultat"
