from rest_framework import status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .models import Artist, User
from .serializers import (
    ArtistSerializer,
    RegisterUserSerializer,
    RegisterArtistSerializer,
    UserSerializer
)


# AUTH & REGISTER


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """Créer un nouvel utilisateur"""
    serializer = RegisterUserSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'status': 'success',
            'message': 'Utilisateur créé avec succès',
            'data': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response({
        'status': 'error',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)


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



#  ARTISTS CRUD


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