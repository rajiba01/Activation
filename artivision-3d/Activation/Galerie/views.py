from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Galerie
from .serializers import GalerieSerializer

class GalerieViewSet(viewsets.ModelViewSet):
    queryset = Galerie.objects.all()
    serializer_class = GalerieSerializer
    
    def get_permissions(self):
        if self.action == 'public':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    @action(detail=False, methods=['get'], url_path='public')
    def public(self, request):
        """Endpoint public pour les visiteurs - retourne toutes les galeries publiées"""
        public_galeries = self.queryset.filter(status='published')
        serializer = self.get_serializer(public_galeries, many=True)
        return Response(serializer.data)