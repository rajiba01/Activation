from rest_framework import serializers
from .models import Command

class CommandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Command
        fields = ['id', 'user', 'galerie', 'date_command', 'oeuvres', 'status', 'is_verified']
        read_only_fields = ['status', 'is_verified', 'otp']