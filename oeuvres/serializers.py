from rest_framework import serializers
from .models import Oeuvre

class OeuvreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Oeuvre
        fields = '__all__'
        read_only_fields = ['artiste']
    
    def create(self, validated_data):
        # Récupérer l'image du fichier
        img_file = validated_data.pop('img', None)
        oeuvre = Oeuvre.objects.create(**validated_data)
        
        # Sauvegarder l'image si elle existe
        if img_file:
            oeuvre.img = img_file
            oeuvre.save()
            print(f"✅ Image sauvegardée: {oeuvre.img.url}")
        
        return oeuvre
    
    def update(self, instance, validated_data):
        img_file = validated_data.pop('img', None)
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Sauvegarder la nouvelle image si elle existe
        if img_file:
            # Supprimer l'ancienne image
            if instance.img:
                instance.img.delete(save=False)
            instance.img = img_file
        
        instance.save()
        
        if img_file:
            print(f"✅ Image mise à jour: {instance.img.url}")
        
        return instance