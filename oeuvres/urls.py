from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OeuvreViewSet

router = DefaultRouter()
router.register(r'oeuvres', OeuvreViewSet, basename='oeuvre')

urlpatterns = [
    path('', include(router.urls)),
]