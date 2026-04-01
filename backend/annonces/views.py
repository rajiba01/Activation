from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Annonce
from .serializers import AnnonceSerializer



@api_view(['GET', 'POST'])
def list_create_annonces(request):
    """
    GET: Liste toutes les annonces
    POST: Crée une nouvelle annonce
    """
    if request.method == 'GET':
        annonces = Annonce.objects.all().order_by('-created_at')
        serializer = AnnonceSerializer(annonces, many=True)
        return Response({
            'status': 'success',
            'count': annonces.count(),
            'data': serializer.data
        })
    elif request.method == 'POST':
        serializer = AnnonceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                'status': 'success',
                'message': 'Annonce créée avec succès',
                'data': serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response({
            'status': 'error',
            'errors': serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)



@api_view(['GET'])
def get_annonce(request, pk):
    try:
        annonce = Annonce.objects.get(pk=pk)
    except Annonce.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Annonce non trouvée'
        }, status=status.HTTP_404_NOT_FOUND)

    serializer = AnnonceSerializer(annonce)
    return Response({
        'status': 'success',
        'data': serializer.data
    })




@api_view(['PATCH'])
def patch_annonce(request, pk):
    try:
        annonce = Annonce.objects.get(pk=pk)
    except Annonce.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Annonce non trouvée'
        }, status=status.HTTP_404_NOT_FOUND)

    serializer = AnnonceSerializer(annonce, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({
            'status': 'success',
            'message': 'Annonce mise à jour avec succès',
            'data': serializer.data
        })
    return Response({
        'status': 'error',
        'errors': serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)



@api_view(['DELETE'])
def delete_annonce(request, pk):
    """Supprimer une annonce"""
    try:
        annonce = Annonce.objects.get(pk=pk)
    except Annonce.DoesNotExist:
        return Response({
            'status': 'error',
            'message': 'Annonce non trouvée'
        }, status=status.HTTP_404_NOT_FOUND)

    annonce.delete()
    return Response({
        'status': 'success',
        'message': 'Annonce supprimée avec succès'
    }, status=status.HTTP_204_NO_CONTENT)