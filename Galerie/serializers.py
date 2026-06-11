from rest_framework import serializers
from .models import Galerie, GalerieImage

class GalerieImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = GalerieImage
        fields = ['id', 'image']

class GalerieSerializer(serializers.ModelSerializer):
    images = GalerieImageSerializer(many=True, read_only=True)
    upload_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = Galerie
        fields = [
            'id', 'nom', 'localisation', 'description', 'surface_x', 
            'surface_y', 'decor', 'tarif_mensuel', 'nb_oeuvres_max', 
            'duree_acces', 'prix_visiteur', 'images', 'upload_images'
        ]

    def create(self, validated_data):
        upload_images = validated_data.pop('upload_images', [])
        galerie = Galerie.objects.create(**validated_data)
        for image in upload_images:
            GalerieImage.objects.create(galerie=galerie, image=image)
        return galerie