from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate  
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.contrib.sites.shortcuts import get_current_site
from rest_framework.views import APIView

import requests
from django.utils import timezone
from django.conf import settings
import logging
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User, Artist 
from .serializers import (
    ArtistSerializer,
    RegisterUserSerializer,
    RegisterArtistSerializer,
    UserSerializer
)

logger = logging.getLogger(__name__)
class CurrentUserView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({
            'status': 'success',
            'data': serializer.data
        })
def send_login_alert_email(user, ip, geo, timestamp):
    logger.info("=== DEBUT send_login_alert_email ===")
    logger.info("user.email = %s", user.email)
    
    subject = "Nouvelle connexion sur votre compte"
    loc_parts = []
    if geo.get('city'):
        loc_parts.append(geo['city'])
    if geo.get('region'):
        loc_parts.append(geo['region'])
    if geo.get('country'):
        loc_parts.append(geo['country'])
    location = ", ".join(loc_parts) if loc_parts else "Localisation non disponible"
    message = (
        f"Bonjour {user.username},\n\n"
        f"Une connexion a été effectuée sur votre compte.\n\n"
        f"- Adresse IP : {ip}\n"
        f"- Localisation approximative : {location}\n"
        f"- Fournisseur/Org : {geo.get('org') or 'inconnu'}\n"
        f"- Date/Heure (UTC) : {timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}\n\n"
        "Si vous n'êtes pas à l'origine de cette connexion, changez votre mot de passe immédiatement."
    )
    
    logger.info("Subject: %s", subject)
    logger.info("DEFAULT_FROM_EMAIL: %s", settings.DEFAULT_FROM_EMAIL)
    logger.info("EMAIL_BACKEND: %s", settings.EMAIL_BACKEND)
    
    try:
        logger.info("Envoi send_mail en cours...")
        result = send_mail(subject, message, settings.DEFAULT_FROM_EMAIL, [user.email], fail_silently=False)
        logger.info("send_mail réussi, result=%s", result)
        return True
    except Exception as e:
        logger.exception("EXCEPTION dans send_mail: %s", e)
        return False


# AUTH & REGISTER

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """Créer un nouvel utilisateur et envoyer un email d'activation"""
    serializer = RegisterUserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        token_generator = PasswordResetTokenGenerator()
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        token = token_generator.make_token(user)

        domain = get_current_site(request).domain
        link = f"http://{domain}/api/accounts/activate/{uidb64}/{token}/"

        subject = 'Confirmation de votre compte'
        message = (
            f"Bonjour {user.username},\n\n"
            f"Veuillez cliquer sur le lien ci-dessous pour activer votre compte :\n\n{link}\n\n"
            "Si vous n'avez pas demandé ceci, ignorez ce message."
        )
        send_mail(subject, message, 'noreply@monapp.com', [user.email], fail_silently=False)

        return Response(
            {'status': 'success', 'message': "Utilisateur créé — email d'activation envoyé", 'data': serializer.data},
            status=status.HTTP_201_CREATED
        )

    return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_artist(request):
    """Créer un nouvel artiste"""
    serializer = RegisterArtistSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'status': 'success',
            'message': 'Artiste créé avec succès',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response({
        'status': 'error',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


# USERS CRUD

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def list_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response({'status': 'success', 'data': serializer.data})

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_user(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'success', 'message': 'Utilisateur créé', 'data': serializer.data}, status=status.HTTP_201_CREATED)
    return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'status': 'error', 'message': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user)
    return Response({'status': 'success', 'data': serializer.data})

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'status': 'error', 'message': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'success', 'message': 'Utilisateur mis à jour', 'data': serializer.data})
    return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'status': 'error', 'message': 'Utilisateur non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    user.delete()
    return Response({'status': 'success', 'message': 'Utilisateur supprimé'}, status=status.HTTP_204_NO_CONTENT)


# ARTISTS CRUD

@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def create_artist(request):
    serializer = ArtistSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'success', 'message': 'Artiste créé', 'data': serializer.data}, status=status.HTTP_201_CREATED)
    return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def list_artists(request):
    artists = Artist.objects.all()
    serializer = ArtistSerializer(artists, many=True)
    return Response({'status': 'success', 'data': serializer.data})

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_artist(request, pk):
    try:
        artist = Artist.objects.get(pk=pk)
    except Artist.DoesNotExist:
        return Response({'status': 'error', 'message': 'Artiste non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ArtistSerializer(artist)
    return Response({'status': 'success', 'data': serializer.data})

@api_view(['PUT', 'PATCH'])
@permission_classes([permissions.IsAuthenticated])
def update_artist(request, pk):
    try:
        artist = Artist.objects.get(pk=pk)
    except Artist.DoesNotExist:
        return Response({'status': 'error', 'message': 'Artiste non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ArtistSerializer(artist, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'status': 'success', 'message': 'Artiste mis à jour', 'data': serializer.data})
    return Response({'status': 'error', 'errors': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def delete_artist(request, pk):
    try:
        artist = Artist.objects.get(pk=pk)
    except Artist.DoesNotExist:
        return Response({'status': 'error', 'message': 'Artiste non trouvé'}, status=status.HTTP_404_NOT_FOUND)
    
    artist.delete()
    return Response({'status': 'success', 'message': 'Artiste supprimé'}, status=status.HTTP_204_NO_CONTENT)


# UTILITAIRES

def get_client_ip(request):
    x_forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded:
        ip = x_forwarded.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def geolocate_ip(ip):
    try:
        base = settings.IP_GEO_API_URL.rstrip('/')
        if ip in ('127.0.0.1', '::1', None):
            url = f"{base}/json/"
        else:
            url = f"{base}/{ip}/json/"
        resp = requests.get(url, timeout=3)
        if resp.status_code == 200:
            d = resp.json()
            return {
                'city': d.get('city'),
                'region': d.get('region'),
                'country': d.get('country_name') or d.get('country'),
                'org': d.get('org') or d.get('asn')
            }
    except Exception:
        pass
    return {'city': None, 'region': None, 'country': None, 'org': None}


# ⭐⭐⭐ LOGIN MODIFIÉ POUR ACCEPTER EMAIL ⭐⭐⭐

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    logger.info("=== LOGIN CALLED ===")
    username_or_email = request.data.get('username')
    password = request.data.get('password')
    
    if not username_or_email or not password:
        return Response({'status': 'error', 'message': 'Email et mot de passe requis'}, 
                       status=status.HTTP_400_BAD_REQUEST)
    
    # Vérifier si c'est un email ou un username
    if '@' in username_or_email:
        # Chercher l'utilisateur par email
        try:
            user_obj = User.objects.get(email=username_or_email)
            username = user_obj.username
        except User.DoesNotExist:
            return Response({'status': 'error', 'message': 'Email ou mot de passe incorrect'}, 
                           status=status.HTTP_401_UNAUTHORIZED)
    else:
        username = username_or_email
    
    # Authentifier avec le username
    user = authenticate(username=username, password=password)
    
    if user is None:
        return Response({'status': 'error', 'message': 'Email ou mot de passe incorrect'}, 
                       status=status.HTTP_401_UNAUTHORIZED)

    refresh = RefreshToken.for_user(user)
    
    logger.info("=== AVANT send_login_alert_email ===")
    try:
        ip = get_client_ip(request) or 'unknown'
        geo = geolocate_ip(ip)
    except Exception as e:
        logger.exception("Erreur géoloc")
        ip, geo = 'unknown', {}

    timestamp = timezone.now()
    email_ok = send_login_alert_email(user, ip, geo, timestamp)
    logger.info("=== APRES send_login_alert_email, email_ok=%s ===", email_ok)

    return Response({
        'status': 'success',
        'data': {
            'access': str(refresh.access_token), 
            'refresh': str(refresh)
        },
        'alert_email_sent': email_ok
    }, status=status.HTTP_200_OK)
    # accounts/views.py - Ajouter cette vue

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_role(request):
    user = request.user
    is_artist = hasattr(user, 'artist') and user.artist is not None
    return Response({
        'status': 'success',
        'data': {
            'is_artist': is_artist,
            'role': 'artiste' if is_artist else 'visiteur'
        }
    })