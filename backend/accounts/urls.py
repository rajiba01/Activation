from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    # AUTH
    path('register/user/', register_user),
    path('register/artist/', register_artist),
    path('login/', TokenObtainPairView.as_view()), # Token reste une classe 

    # USERS
    path('users/', list_users),
    path('users/<int:pk>/', get_user),
    path('users/<int:pk>/update/', update_user),
    path('users/<int:pk>/delete/', delete_user),

    # ARTISTS
    path('artists/', list_artists),
    path('artists/<int:pk>/', get_artist),
    path('artists/<int:pk>/update/', update_artist),
    path('artists/<int:pk>/delete/', delete_artist),
]