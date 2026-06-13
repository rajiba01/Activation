from django.db import models

# Create your models here.
class Galerie(models.Model):
    nom = models.CharField(max_length=200)
    localisation = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    surface_x = models.FloatField()
    surface_y = models.FloatField()
    decor = models.CharField(max_length=200)
    tarif_mensuel = models.DecimalField(max_digits=10, decimal_places=2)
    nb_oeuvres_max = models.IntegerField()
    duree_acces = models.CharField(max_length=100)
    prix_visiteur = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.nom

class GalerieImage(models.Model):
    galerie = models.ForeignKey(Galerie, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='galeries/images/')

    def __str__(self):
        return f"Image pour {self.galerie.nom}"