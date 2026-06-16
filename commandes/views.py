# commandes/views.py
from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.mail import send_mail
from django.conf import settings
import random
from .models import Command
from .serializers import CommandSerializer
from oeuvres.models import Oeuvre

class CommandViewSet(viewsets.ModelViewSet):
    serializer_class = CommandSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        
        from accounts.models import Artist
        is_artist = hasattr(user, 'artist') and user.artist is not None
        
        if is_artist:
            oeuvres_ids = Oeuvre.objects.filter(artiste=user).values_list('id', flat=True)
            return Command.objects.filter(oeuvres__id__in=oeuvres_ids).distinct()
        else:
            return Command.objects.filter(user=user)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        otp = str(random.randint(100000, 999999))
        
        command = serializer.save(
            user=self.request.user,
            otp=otp,
            status='En attente',
            is_verified=False
        )
        
        if command.user.email:
            try:
                send_mail(
                    '🎨 Code de validation - Votre commande ArtVision',
                    f'Bonjour {command.user.username},\n\n'
                    f'Merci pour votre achat ! Voici votre code OTP :\n\n'
                    f'🔑 CODE : {otp}\n\n'
                    f'Cordialement,\nL\'équipe ArtVision 3D',
                    settings.DEFAULT_FROM_EMAIL,
                    [command.user.email],
                    fail_silently=False,
                )
            except Exception as e:
                print(f"❌ Erreur email: {e}")
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def perform_update(self, serializer):
        serializer.save()
        print(f"✅ Commande {serializer.instance.id} mise à jour: {serializer.instance.status}")

    @action(detail=True, methods=['post'])
    def verify_otp(self, request, pk=None):
        command = self.get_object()
        otp_provided = request.data.get('otp')
        
        if not otp_provided:
            return Response({'error': 'Veuillez fournir le code OTP.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if command.otp == otp_provided:
            command.is_verified = True
            command.status = 'Confirmée'
            command.otp = None
            command.save()
            return Response({'status': 'success', 'message': 'Commande vérifiée avec succès.'})
            
        return Response({'error': 'Code OTP invalide.'}, status=status.HTTP_400_BAD_REQUEST)