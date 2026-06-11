from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import Galerie
from .serializers import GalerieSerializer

class GalerieViewSet(viewsets.ModelViewSet):
    queryset = Galerie.objects.all()
    serializer_class = GalerieSerializer
    #permission_classes = [permissions.AllowAny]
    parser_classes = (MultiPartParser, FormParser, JSONParser)


