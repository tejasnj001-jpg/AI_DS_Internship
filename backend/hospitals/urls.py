from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    BloodRequestViewSet,
    DonorResponseViewSet,
    my_hospital,
    hospital_blood_requests,
    blood_request_responses,
    hospital_register,
)

router = DefaultRouter()

router.register(
    'blood-requests',
    BloodRequestViewSet
)

router.register(
    'donor-responses',
    DonorResponseViewSet
)

urlpatterns = [
    path(
        '',
        include(router.urls)
    ),

    path(
        'my-hospital/',
        my_hospital
    ),

    path(
        'my-hospital-blood-requests/',
        hospital_blood_requests
    ),

    path(
        'blood-request-responses/<int:request_id>/',
        blood_request_responses
    ),

    path(
            'hospital-register/',
            hospital_register
        ),

]