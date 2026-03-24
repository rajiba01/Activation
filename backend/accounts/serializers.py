from rest_framework import serializers
from .models import User, Artist


class RegisterUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'prenom', 'password']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user


class RegisterArtistSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    biographie = serializers.CharField()
    style_art = serializers.CharField()
    photo = serializers.ImageField()

    class Meta:
        model = User
        fields = ['username', 'email', 'prenom', 'password', 'biographie', 'style_art', 'photo']

    def create(self, validated_data):
        # extraire les champs artiste
        biographie = validated_data.pop('biographie')
        style_art = validated_data.pop('style_art')
        photo = validated_data.pop('photo')

        # créer user
        user = User.objects.create_user(**validated_data)

        # créer artiste
        Artist.objects.create(
            user=user,
            biographie=biographie,
            style_art=style_art,
            photo=photo
        )

        return user
    
    # 👤 USER
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'prenom']


# 🎨 ARTIST
class ArtistSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Artist
        fields = ['id', 'user', 'biographie', 'style_art', 'photo']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user')

        # update user
        user = instance.user
        user.username = user_data.get('username', user.username)
        user.email = user_data.get('email', user.email)
        user.prenom = user_data.get('prenom', user.prenom)
        user.save()

        # update artist
        instance.biographie = validated_data.get('biographie', instance.biographie)
        instance.style_art = validated_data.get('style_art', instance.style_art)
        instance.photo = validated_data.get('photo', instance.photo)
        instance.save()

        return instance