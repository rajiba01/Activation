from django.urls import path
from . import views

urlpatterns = [
    # Utilise la nouvelle fonction combinée pour GET (liste) et POST (création)
    path('annonces/', views.list_create_annonces, name='list-create-annonces'),
    
    path('annonces/<uuid:pk>/', views.get_annonce, name='get-annonce'),
    path('annonces/<uuid:pk>/update/', views.patch_annonce, name='update-annonce'),
    path('annonces/<uuid:pk>/delete/', views.delete_annonce, name='delete-annonce'),
]