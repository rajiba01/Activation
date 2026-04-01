from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def api_root(request):
    return Response({
        'message': 'API Annonces fonctionne !',
        'endpoints': {
            'Liste': '/api/annonces/',
            'Créer': '/api/annonces/create/',
            'Détail': '/api/annonces/<uuid>/',
            'Modifier': '/api/annonces/<uuid>/update/',
            'Supprimer': '/api/annonces/<uuid>/delete/',
        }
    })


urlpatterns = [
    path('', api_root),
    path('admin/', admin.site.urls),
    path('api/', include('annonces.urls')),
    path('api/accounts/', include('accounts.urls')),  # Ajout des routes accounts
]