# commandes/serializers.py
from rest_framework import serializers
from .models import Command
from oeuvres.serializers import OeuvreSerializer

class CommandSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    oeuvres_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Command
        fields = [
            'id', 'user', 'user_email', 'user_name',
            'galerie', 'date_command', 'oeuvres', 'oeuvres_details',
            'status', 'is_verified', 'otp'
        ]
        read_only_fields = ['id', 'user', 'date_command']
        extra_kwargs = {
            'galerie': {'required': False, 'allow_null': True}
        }
    
    def get_oeuvres_details(self, obj):
        from oeuvres.serializers import OeuvreSerializer
        oeuvres_qs = obj.oeuvres.all()
        return OeuvreSerializer(oeuvres_qs, many=True).data