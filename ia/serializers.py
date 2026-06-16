from rest_framework import serializers
from .models import Conversation, Message, AnalysisResult


# ─────────────────────────────────────────────
#  AnalysisResult
# ─────────────────────────────────────────────
class AnalysisResultSerializer(serializers.ModelSerializer):
    class Meta:
        model  = AnalysisResult
        fields = [
            "id", "art_period", "art_movement", "techniques",
            "artists_mentioned", "keywords", "confidence_score",
            "summary", "created_at",
        ]
        read_only_fields = fields


# ─────────────────────────────────────────────
#  Message
# ─────────────────────────────────────────────
class MessageSerializer(serializers.ModelSerializer):
    analysis_result = AnalysisResultSerializer(read_only=True)

    class Meta:
        model  = Message
        fields = [
            "id", "role", "content", "tokens_used",
            "model_used", "latency_ms", "created_at",
            "analysis_result",
        ]
        read_only_fields = [
            "id", "role", "tokens_used", "model_used",
            "latency_ms", "created_at", "analysis_result",
        ]


# ─────────────────────────────────────────────
#  Conversation (list)
# ─────────────────────────────────────────────
class ConversationListSerializer(serializers.ModelSerializer):
    message_count = serializers.IntegerField(source="messages.count", read_only=True)
    last_message  = serializers.SerializerMethodField()

    class Meta:
        model  = Conversation
        fields = [
            "id", "title", "mode", "artwork_description",
            "artwork_image", "total_tokens", "message_count",
            "last_message", "created_at", "updated_at",
        ]
        read_only_fields = ["id", "total_tokens", "message_count", "last_message",
                            "created_at", "updated_at"]

    def get_last_message(self, obj):
        msg = obj.messages.filter(role="assistant").last()
        if msg:
            return {"content": msg.content[:200], "created_at": msg.created_at}
        return None


# ─────────────────────────────────────────────
#  Conversation (detail  — avec messages)
# ─────────────────────────────────────────────
class ConversationDetailSerializer(ConversationListSerializer):
    messages = MessageSerializer(many=True, read_only=True)

    class Meta(ConversationListSerializer.Meta):
        fields = ConversationListSerializer.Meta.fields + ["messages"]


# ─────────────────────────────────────────────
#  Conversation (create / update)
# ─────────────────────────────────────────────
class ConversationWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Conversation
        fields = ["id","title", "mode", "artwork_description", "artwork_image"]
        read_only_fields = ["id"]

# ─────────────────────────────────────────────
#  Prompt  (entrée utilisateur → appel LangChain)
# ─────────────────────────────────────────────
class PromptInputSerializer(serializers.Serializer):
    prompt = serializers.CharField(min_length=5, max_length=4000)
