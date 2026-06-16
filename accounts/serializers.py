from rest_framework import serializers
from .models import User, Artist

class RegisterUserSerializer(serializers.ModelSerializer):
    pseudo = serializers.CharField(source='username')
    nom = serializers.CharField(source='Nom')
    prenom = serializers.CharField(source='Prenom')
    mdp = serializers.CharField(write_only=True, source='password', required=True)
    ville = serializers.CharField(required=False, allow_blank=True)
    tel = serializers.CharField(source='Tel', required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['pseudo', 'nom', 'prenom', 'email', 'mdp', 'ville', 'tel']

    def create(self, validated_data):
        # IMPORTANT : validated_data contient déjà les noms du MODÈLE
        # car 'source' a fait la conversion automatiquement.
        password = validated_data.pop('password')
        
        # On utilise create_user pour hacher le mot de passe
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user
class RegisterArtistSerializer(serializers.ModelSerializer):
    pseudo = serializers.CharField(source='username')
    nom = serializers.CharField(source='Nom')
    prenom = serializers.CharField(source='Prenom')
    mdp = serializers.CharField(write_only=True, source='password', required=True)
    biographie = serializers.CharField(required=False, allow_blank=True)
    style_art = serializers.CharField(required=False, allow_blank=True)
    photo = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ['pseudo', 'nom', 'prenom', 'email', 'mdp', 'biographie', 'style_art', 'photo']
        # ⚠️ IMPORTANT: Dire à Django d'ignorer les champs qui ne sont pas dans User
        extra_kwargs = {
            'biographie': {'required': False},
            'style_art': {'required': False},
            'photo': {'required': False},
        }

    def validate(self, data):
        # Supprimer les champs qui ne sont pas dans User avant validation
        # On les garde pour les utiliser dans create
        return data

    def create(self, validated_data):
        biographie = validated_data.pop('biographie', None)
        style_art = validated_data.pop('style_art', None)
        photo = validated_data.pop('photo', None)

        password = validated_data.pop('password')
        username = validated_data.pop('username')
        email = validated_data.pop('email', '')

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            Nom=validated_data.get('Nom', ''),
            Prenom=validated_data.get('Prenom', '')
        )

        Artist.objects.create(
            user=user,
            biographie=biographie or "",
            style_art=style_art or "",
            photo=photo
        )
        return user
# accounts/serializers.py
from rest_framework import serializers
from .models import User, Artist

class UserSerializer(serializers.ModelSerializer):
    pseudo = serializers.CharField(source='username', read_only=True)
    nom = serializers.CharField(source='Nom')
    prenom = serializers.CharField(source='Prenom')
    tel = serializers.CharField(source='Tel', allow_blank=True)
    is_artist = serializers.SerializerMethodField()  # ← AJOUTER

    class Meta:
        model = User
        fields = ['id', 'pseudo', 'nom', 'prenom', 'email', 'ville', 'tel', 'is_artist']

    def get_is_artist(self, obj):
        # Vérifier si l'utilisateur a un profil artiste associé
        return hasattr(obj, 'artist') and obj.artist is not None

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