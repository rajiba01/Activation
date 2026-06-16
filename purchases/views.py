# purchases/views.py
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import GalleryAccess
from .serializers import GalleryAccessSerializer
from Galerie.models import Galerie

class GalleryAccessViewSet(viewsets.ModelViewSet):
    serializer_class = GalleryAccessSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return GalleryAccess.objects.filter(user=self.request.user)
    
    @action(detail=False, methods=['post'])
    def purchase_access(self, request):
        role = request.data.get('role')
        subscription_type = request.data.get('subscription_type')
        
        if not role:
            return Response(
                {'error': 'role est requis'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if role not in ['artiste', 'visiteur']:
            return Response(
                {'error': 'role doit être "artiste" ou "visiteur"'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # ✅ Pour les artistes : l'abonnement n'est pas lié à une galerie spécifique
        # C'est un accès à la plateforme, pas à une galerie particulière
        gallery = None
        
        if role == 'artiste':
            # Créer une galerie virtuelle "Abonnement" pour l'accès
            # ou laisser gallery = None
            gallery = None  # L'abonnement n'est pas lié à une galerie
        else:
            # Pour les visiteurs, besoin d'une galerie
            gallery_id = request.data.get('gallery_id')
            if not gallery_id:
                return Response(
                    {'error': 'gallery_id requis pour les visiteurs'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            try:
                gallery = Galerie.objects.get(id=gallery_id)
            except Galerie.DoesNotExist:
                return Response(
                    {'error': 'Galerie non trouvée'}, 
                    status=status.HTTP_404_NOT_FOUND
                )
        
        # Déterminer le prix selon le type d'abonnement
        if role == 'artiste':
            prix_map = {
                'atelier': 29,
                'galerie': 69,
                'musee': 149
            }
            price = prix_map.get(subscription_type, 69)
            duration_days = 30
        else:
            price = 5
            duration_days = 2
        
        # Vérifier si l'utilisateur a déjà un abonnement actif
        existing_access = GalleryAccess.objects.filter(
            user=request.user,
            role=role,
            is_active=True,
            expires_at__gt=timezone.now()
        ).exists()
        
        if existing_access and role == 'artiste':
            return Response(
                {'error': 'Vous avez déjà un abonnement actif'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Créer l'accès (sans galerie pour les artistes)
        access = GalleryAccess.objects.create(
            user=request.user,
            gallery=gallery,  # Peut être None pour les artistes
            role=role,
            subscription_type=subscription_type if role == 'artiste' else None,
            price_paid=price,
            expires_at=timezone.now() + timedelta(days=duration_days)
        )
        
        serializer = self.get_serializer(access)
        return Response({
            'status': 'success',
            'access': serializer.data
        }, status=status.HTTP_201_CREATED)