from rest_framework import serializers
from .models import GalleryAccess

class GalleryAccessSerializer(serializers.ModelSerializer):
    gallery_name = serializers.CharField(source='gallery.nom', read_only=True)
    user_name = serializers.CharField(source='user.username', read_only=True)
    user_email = serializers.CharField(source='user.email', read_only=True)
    
    class Meta:
        model = GalleryAccess
        fields = [
            'id', 'user', 'user_name', 'user_email', 
            'gallery', 'gallery_name', 'role', 
            'price_paid', 'purchased_at', 'expires_at', 'is_active'
        ]
        read_only_fields = ['id', 'purchased_at']