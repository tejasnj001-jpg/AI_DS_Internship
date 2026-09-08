from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import DonorViewSet, my_donor, donor_register
from hospitals.views import my_blood_requests


router = DefaultRouter()

router.register("donors", DonorViewSet)


urlpatterns = [
    path("", include(router.urls)),

    path("my-donor/", my_donor),

    path("donor-register/", donor_register),

    path("my-blood-requests/", my_blood_requests),
]