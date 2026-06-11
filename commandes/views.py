from django.shortcuts import render
from rest_framework import viewsets, status, permissions
from rest_framework.response import Response
from rest_framework.decorators import action
from django.core.mail import send_mail
from django.conf import settings
import random
from .models import Command
from .serializers import CommandSerializer

class CommandViewSet(viewsets.ModelViewSet):
    queryset = Command.objects.all()
    serializer_class = CommandSerializer
    permission_classes = [permissions.AllowAny] # Changez en IsAuthenticated idéalement

    def perform_create(self, serializer):
        # Générer un OTP à 6 chiffres
        otp = str(random.randint(100000, 999999))
        command = serializer.save(otp=otp)
        
        # Envoi du mail
        if command.user.email:
            try:
                send_mail(
                    'Code de validation - Votre commande',
                    f'Bonjour,\n\nVotre code OTP pour confirmer la commande est : {otp}',
                    settings.DEFAULT_FROM_EMAIL,
                    [command.user.email],
                    fail_silently=False,
                )
            except Exception as e:
                import logging
                logging.getLogger(__name__).error(f"Erreur d'envoi OTP email: {e}")

    # Endpoint personnalisé pour valider l'OTP : /api/.../commands/{id}/verify_otp/
    @action(detail=True, methods=['post'])
    def verify_otp(self, request, pk=None):
        command = self.get_object()
        otp_provided = request.data.get('otp')
        
        if not otp_provided:
            return Response({'error': 'Veuillez fournir le code OTP.'}, status=status.HTTP_400_BAD_REQUEST)
            
        if command.otp == otp_provided:
            command.is_verified = True
            command.status = 'Confirmée'
            command.otp = None  # OTP utilisé, on le vide
            command.save()
            return Response({'status': 'success', 'message': 'Commande vérifiée avec succès.'})
            
        return Response({'error': 'Code OTP invalide.'}, status=status.HTTP_400_BAD_REQUEST)
