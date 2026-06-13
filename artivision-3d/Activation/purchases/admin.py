from django.contrib import admin
from .models import GalleryAccess

@admin.register(GalleryAccess)
class GalleryAccessAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'gallery', 'role', 'price_paid', 'purchased_at', 'expires_at', 'is_active']
    list_filter = ['role', 'is_active', 'gallery']
    search_fields = ['user__username', 'gallery__nom']
    readonly_fields = ['purchased_at']