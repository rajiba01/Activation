"""
mcp_scheduler/urls.py
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ScheduledTaskViewSet

router = DefaultRouter()
router.register(r"tasks", ScheduledTaskViewSet, basename="mcp-task")

urlpatterns = [
    path("", include(router.urls)),
]
