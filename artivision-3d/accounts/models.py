from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid
from django.core.validators import RegexValidator

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    Nom=models.CharField(max_length=100)
    Prenom=models.CharField(max_length=100)
    email=models.EmailField(unique=True)
    ville=models.CharField(max_length=100,blank=True, null=True, default='')
    Tel=models.CharField(max_length=20, validators=[RegexValidator(regex=r'^\+?1?\d{9,15}$', message="Le numéro de téléphone doit être au format : '+999999999'. Jusqu'à 15 chiffres autorisés."),], blank=True, null=True, default=''  )

    class Meta:
        app_label = 'accounts'

class Artist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    biographie = models.TextField()
    style_art = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='artists/')

    class Meta:
        app_label = 'accounts'

    def __str__(self):
        return self.user.username