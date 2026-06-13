from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GalerieViewSet

router = DefaultRouter()
router.register(r'galeries', GalerieViewSet, basename='galerie')

urlpatterns = [
    path('', include(router.urls)),
]