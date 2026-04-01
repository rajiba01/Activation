from rest_framework import serializers
from .models import Annonce


class AnnonceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Annonce
        fields = ['id', 'title', 'description', 'price', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']