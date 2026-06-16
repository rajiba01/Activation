from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import GalleryAccessViewSet

router = DefaultRouter()
router.register(r'access', GalleryAccessViewSet, basename='gallery-access')

urlpatterns = [
    path('', include(router.urls)),
]