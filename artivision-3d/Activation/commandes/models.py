# commandes/models.py
from django.db import models
import uuid
from accounts.models import User
from Galerie.models import Galerie

class Command(models.Model):
    STATUS_CHOICES = [
        ('En attente', 'En attente'),
        ('Confirmée', 'Confirmée'),
        ('Livré', 'Livré'),
        ('Annulée', 'Annulée'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='commands')
    galerie = models.ForeignKey(Galerie, on_delete=models.CASCADE, null=True, blank=True)
    date_command = models.DateTimeField(auto_now_add=True)
    oeuvres = models.ManyToManyField('oeuvres.Oeuvre', blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='En attente')
    otp = models.CharField(max_length=6, blank=True, null=True)
    is_verified = models.BooleanField(default=False)

    def __str__(self):
        return f"Commande {self.id} - {self.user.username}"