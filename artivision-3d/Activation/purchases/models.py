# purchases/models.py
from django.db import models
from django.conf import settings
from Galerie.models import Galerie

class GalleryAccess(models.Model):
    ROLE_CHOICES = [
        ('artiste', 'Artiste'),
        ('visiteur', 'Visiteur'),
    ]
    
    SUBSCRIPTION_CHOICES = [
        ('atelier', 'Atelier'),
        ('galerie', 'Galerie'),
        ('musee', 'Musée'),
    ]
    
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='gallery_accesses')
    gallery = models.ForeignKey(Galerie, on_delete=models.CASCADE, related_name='accesses', null=True, blank=True)  # ← nullable
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    subscription_type = models.CharField(max_length=20, choices=SUBSCRIPTION_CHOICES, null=True, blank=True)  # ← NOUVEAU
    price_paid = models.DecimalField(max_digits=10, decimal_places=2)
    purchased_at = models.DateTimeField(auto_now_add=True)
    expires_at = models.DateTimeField()
    is_active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.user.username} - {self.role} ({self.subscription_type or 'N/A'})"
    
    class Meta:
        ordering = ['-purchased_at']