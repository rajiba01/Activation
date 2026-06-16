from django.contrib import admin
from django.urls import path, include
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings
from django.conf.urls.static import static


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
    path('api/accounts/', include('accounts.urls')),
    path('api/galerie/', include('Galerie.urls')),
    path('api/galerie/', include('oeuvres.urls')),
    path('api/commandes/', include('commandes.urls')),
    path('api/purchases/', include('purchases.urls')),
    path('api/ia/', include('ia.urls')),
    path('api/mcp/', include('mcp_engine.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)