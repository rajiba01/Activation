from django.db import models
import uuid
from accounts.models import User
from Galerie.models import Galerie

class Command(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    galerie = models.ForeignKey(Galerie, on_delete=models.CASCADE)
    date_command = models.DateTimeField(auto_now_add=True)
    oeuvres = models.ManyToManyField('oeuvres.Oeuvre', blank=True)
    status = models.CharField(max_length=20, default='En attente')  # ex: En attente, Confirmée
    otp = models.CharField(max_length=6, blank=True, null=True)     # Code OTP à 6 chiffres
    is_verified = models.BooleanField(default=False)
