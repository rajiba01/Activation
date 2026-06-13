from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Oeuvre
from .serializers import OeuvreSerializer

class OeuvreViewSet(viewsets.ModelViewSet):
    queryset = Oeuvre.objects.all()
    serializer_class = OeuvreSerializer
    #permission_classes = [permissions.AllowAny] # Ajustez la permission si nécessaire
    parser_classes = (MultiPartParser, FormParser, JSONParser)


    @action(detail=False, methods=['get'], url_path='par-galerie/(?P<nom_galerie>[^/.]+)')
    def par_galerie(self, request, nom_galerie=None):
        """
        Récupère les œuvres d'une galerie spécifique grâce à son nom.
        """
        # "galerie__nom__iexact" cherche le nom de manière insensible à la casse
        oeuvres = self.get_queryset().filter(galerie__nom__iexact=nom_galerie)
        serializer = self.get_serializer(oeuvres, many=True)
        return Response(serializer.data)

# Create your views here.
