from django.contrib import admin
from .models import Conversation, Message, AnalysisResult


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = ["title", "mode", "user", "total_tokens", "created_at", "updated_at"]
    list_filter  = ["mode", "created_at"]
    search_fields = ["title", "user__username"]
    readonly_fields = ["id", "total_tokens", "created_at", "updated_at"]


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display  = ["conversation", "role", "model_used", "tokens_used", "latency_ms", "created_at"]
    list_filter   = ["role", "model_used"]
    search_fields = ["content", "conversation__title"]
    readonly_fields = ["id", "created_at"]


@admin.register(AnalysisResult)
class AnalysisResultAdmin(admin.ModelAdmin):
    list_display = ["art_movement", "art_period", "confidence_score", "created_at"]
    search_fields = ["art_movement", "art_period", "summary"]
    readonly_fields = ["id", "created_at"]
