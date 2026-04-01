from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    Nom=models.CharField(max_length=100)
    Prenom=models.CharField(max_length=100)
    email=models.EmailField(unique=True)

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