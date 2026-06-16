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
    permission_classes = [permissions.IsAuthenticated]  # ← CHANGER à IsAuthenticated
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def perform_create(self, serializer):
        # ✅ Associer l'œuvre à l'artiste connecté
        serializer.save(artiste=self.request.user)

    @action(detail=False, methods=['get'], url_path='par-galerie/(?P<nom_galerie>[^/.]+)')
    def par_galerie(self, request, nom_galerie=None):
        oeuvres = self.get_queryset().filter(galerie__nom__iexact=nom_galerie)
        serializer = self.get_serializer(oeuvres, many=True)
        return Response(serializer.data)