from django.urls import path
from .views import match_donors

urlpatterns = [
    path('match/', match_donors),
]