from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    prenom = models.CharField(max_length=100)

    def __str__(self):
        return self.username


class Artist(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    biographie = models.TextField()
    style_art = models.CharField(max_length=100)
    photo = models.ImageField(upload_to='artists/')

    def __str__(self):
        return self.user.username