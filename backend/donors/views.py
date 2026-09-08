from django.contrib.auth.models import User

from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Donor
from .serializers import DonorSerializer


class DonorViewSet(viewsets.ModelViewSet):
    queryset = Donor.objects.all()
    serializer_class = DonorSerializer


@api_view(["POST"])
def donor_register(request):

    username = request.data.get("username")
    password = request.data.get("password")

    name = request.data.get("name")
    blood_group = request.data.get("blood_group")
    phone = request.data.get("phone")
    email = request.data.get("email")
    location = request.data.get("location")
    latitude = request.data.get("latitude")
    longitude = request.data.get("longitude")

    if not username or not password:
        return Response(
            {"error": "Username and password are required."},
            status=400
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists."},
            status=400
        )

    user = User.objects.create_user(
        username=username,
        password=password
    )

    donor = Donor.objects.create(
        user=user,
        name=name,
        blood_group=blood_group,
        phone=phone,
        email=email,
        location=location,
        latitude=latitude,
        longitude=longitude,
        is_available=True
    )

    return Response(
        {
            "message": "Donor registered successfully!",
            "username": user.username,
            "donor_id": donor.id
        },
        status=201
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_donor(request):

    donor = Donor.objects.filter(
        user=request.user
    ).first()

    if donor:
        return Response(
            {
                "id": donor.id,
                "name": donor.name,
                "blood_group": donor.blood_group,
                "phone": donor.phone,
                "email":donor.email,
                "location": donor.location,
                "latitude": donor.latitude,
                "longitude": donor.longitude,
                "is_available": donor.is_available
            }
        )

    return Response(
        {
            "error": "No donor profile found for this user.",
            "username": request.user.username
        },
        status=404
    )