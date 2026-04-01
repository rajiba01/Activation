from rest_framework import serializers
from .models import User, Artist


class RegisterUserSerializer(serializers.ModelSerializer):
    # API (Français) -> Modèle (Django)
    pseudo = serializers.CharField(source='username')
    nom = serializers.CharField(source='Nom')
    prenom = serializers.CharField(source='Prenom')
    mdp = serializers.CharField(write_only=True, source='password')

    class Meta:
        model = User
        fields = ['pseudo', 'nom', 'prenom', 'email', 'mdp']

    def create(self, validated_data):
        # validated_data utilise les vrais noms du modèle (password, username, Nom, Prenom)
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            Nom=validated_data.get('Nom', ''),
            Prenom=validated_data.get('Prenom', '')
        )
        return user


class RegisterArtistSerializer(serializers.ModelSerializer):
    pseudo = serializers.CharField(source='username')
    nom = serializers.CharField(source='Nom')
    prenom = serializers.CharField(source='Prenom')
    mdp = serializers.CharField(write_only=True, source='password')
    
    biographie = serializers.CharField()
    style_art = serializers.CharField()
    photo = serializers.ImageField(required=False) # Facultatif si pas tjrs fourni

    class Meta:
        model = User
        fields = ['pseudo', 'nom', 'prenom', 'email', 'mdp', 'biographie', 'style_art', 'photo']

    def create(self, validated_data):
        biographie = validated_data.pop('biographie')
        style_art = validated_data.pop('style_art')
        photo = validated_data.pop('photo', None)

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            Nom=validated_data.get('Nom', ''),
            Prenom=validated_data.get('Prenom', '')
        )

        Artist.objects.create(
            user=user,
            biographie=biographie,
            style_art=style_art,
            photo=photo
        )

        return user
    
# 👤 USER
class UserSerializer(serializers.ModelSerializer):
    pseudo = serializers.CharField(source='username', read_only=True)
    nom = serializers.CharField(source='Nom')
    prenom = serializers.CharField(source='Prenom')

    class Meta:
        model = User
        fields = ['id', 'pseudo', 'nom', 'prenom', 'email']


# 🎨 ARTIST
class ArtistSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Artist
        fields = ['id', 'user', 'biographie', 'style_art', 'photo']

    def update(self, instance, validated_data):
        if 'user' in validated_data:
            user_data = validated_data.pop('user')
            user = instance.user
            user.Nom = user_data.get('Nom', user.Nom)
            user.email = user_data.get('email', user.email)
            user.Prenom = user_data.get('Prenom', user.Prenom)
            user.save()

        instance.biographie = validated_data.get('biographie', instance.biographie)
        instance.style_art = validated_data.get('style_art', instance.style_art)
        
        if 'photo' in validated_data:
            instance.photo = validated_data.get('photo')
            
        instance.save()
        return instance