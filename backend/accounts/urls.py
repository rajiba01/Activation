from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    # 🔐 AUTH
    path('register/user/', RegisterUserView.as_view()),
    path('register/artist/', RegisterArtistView.as_view()),
    path('login/', TokenObtainPairView.as_view()),

    # 👤 USERS
    path('users/', UserListView.as_view()),
    path('users/<int:pk>/', UserDetailView.as_view()),
    path('users/<int:pk>/update/', UserUpdateView.as_view()),
    path('users/<int:pk>/delete/', UserDeleteView.as_view()),

    # 🎨 ARTISTS
    path('artists/', ArtistListView.as_view()),
    path('artists/<int:pk>/', ArtistDetailView.as_view()),
    path('artists/<int:pk>/update/', ArtistUpdateView.as_view()),
    path('artists/<int:pk>/delete/', ArtistDeleteView.as_view()),
]