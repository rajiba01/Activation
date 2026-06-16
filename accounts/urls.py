# C:\Users\Mega-Pc\Desktop\ProjetsReact\artivision-3d\Activation\accounts\urls.py

from django.urls import path
from .views import *


urlpatterns = [
    # AUTH
    path('register/user/', register_user),
    path('register/artist/', register_artist),
    path('login/', login, name='login'),
    path('users/me/', CurrentUserView.as_view(), name='current-user'),
    path('users/me/role/', get_user_role, name='user-role'),
    
    # USERS - changer int en uuid
    path('users/', list_users),
    path('users/<uuid:pk>/', get_user),           # ✅ UUID
    path('users/<uuid:pk>/update/', update_user), # ✅ UUID
    path('users/<uuid:pk>/delete/', delete_user), # ✅ UUID
    
    # ARTISTS - changer int en uuid
    path('artists/', list_artists),
    path('artists/<uuid:pk>/', get_artist),       # ✅ UUID
    path('artists/<uuid:pk>/update/', update_artist), # ✅ UUID
    path('artists/<uuid:pk>/delete/', delete_artist), # ✅ UUID
]