from django.db import models
from Galerie.models import Galerie
from accounts.models import User  # ← AJOUTER CET IMPORT

class Oeuvre(models.Model):
    STATUT_CHOICES = [
        ('Brouillon', 'Brouillon'),
        ('Publié', 'Publié'),
        ('Vendu', 'Vendu'),
    ]

    galerie = models.ForeignKey(Galerie, on_delete=models.CASCADE, related_name='oeuvres')
    
    titre = models.CharField(max_length=255)
    description = models.TextField()
    prix = models.DecimalField(max_digits=10, decimal_places=2)
    date_realisation = models.DateField()
    technique = models.CharField(max_length=150)
    dimensions = models.CharField(max_length=150)
    statut = models.CharField(max_length=50, choices=STATUT_CHOICES, default='Publié')
    nb_exemplaires = models.IntegerField(default=1)
    tags = models.JSONField(default=list)
    img = models.ImageField(upload_to='oeuvres/images/', null=True, blank=True)
    
    # ✅ AJOUTER CETTE LIGNE
    artiste = models.ForeignKey(User, on_delete=models.CASCADE, related_name='oeuvres', null=True, blank=True)

    def __str__(self):
        return self.titre