import math

from rest_framework import viewsets, status
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes

from .models import Hospital, BloodRequest, DonorResponse
from .serializers import BloodRequestSerializer, DonorResponseSerializer
from donors.models import Donor
from .email_service import (
    send_donor_notification,
    send_hospital_response_notification
)


def calculate_distance(lat1, lon1, lat2, lon2):
    R = 6371

    lat1 = math.radians(lat1)
    lon1 = math.radians(lon1)
    lat2 = math.radians(lat2)
    lon2 = math.radians(lon2)

    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1)
        * math.cos(lat2)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.atan2(
        math.sqrt(a),
        math.sqrt(1 - a)
    )

    distance = R * c

    return round(distance, 2)


def is_compatible(donor_group, recipient_group):
    compatibility = {
        "O-": ["O-", "O+", "A-", "A+", "B-", "B+", "AB-", "AB+"],
        "O+": ["O+", "A+", "B+", "AB+"],
        "A-": ["A-", "A+", "AB-", "AB+"],
        "A+": ["A+", "AB+"],
        "B-": ["B-", "B+", "AB-", "AB+"],
        "B+": ["B+", "AB+"],
        "AB-": ["AB-", "AB+"],
        "AB+": ["AB+"],
    }

    donor_group = donor_group.upper()
    recipient_group = recipient_group.upper()

    return recipient_group in compatibility.get(
        donor_group,
        []
    )


@api_view(["POST"])
def hospital_register(request):

    username = request.data.get("username")
    password = request.data.get("password")
    hospital_name = request.data.get("hospital_name")
    location = request.data.get("location")
    latitude = request.data.get("latitude")
    longitude = request.data.get("longitude")
    email = request.data.get("email")
    phone = request.data.get("phone")

    if not username or not password:
        return Response(
            {"error": "Username and password are required."},
            status=400
        )

    if not hospital_name or not location or not phone:
        return Response(
            {"error": "Hospital name, location and phone are required."},
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

    hospital = Hospital.objects.create(
        user=user,
        hospital_name=hospital_name,
        location=location,
        latitude=latitude,
        longitude=longitude,
        email=email,
        phone=phone
    )

    return Response(
        {
            "message": "Hospital registered successfully!",
            "username": user.username,
            "hospital_id": hospital.id
        },
        status=201
    )


class BloodRequestViewSet(viewsets.ModelViewSet):
    queryset = BloodRequest.objects.all()
    serializer_class = BloodRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        try:
            hospital = Hospital.objects.get(
                user=self.request.user
            )
        except Hospital.DoesNotExist:
            raise ValueError(
                "No hospital profile found for this user."
            )

        blood_request = serializer.save(
            hospital=hospital,
            hospital_name=hospital.hospital_name,
            location=hospital.location,
            latitude=hospital.latitude,
            longitude=hospital.longitude
        )

        # Send email notifications to available compatible donors
        donors = Donor.objects.filter(
            is_available=True
        )

        for donor in donors:

            if is_compatible(
                donor.blood_group,
                blood_request.blood_group
            ):

                if donor.email:

                    try:
                        send_donor_notification(
                            donor,
                            blood_request
                        )
                    except Exception as e:
                        print(
                            f"Email notification failed for "
                            f"{donor.name}: {e}"
                        )


class DonorResponseViewSet(viewsets.ModelViewSet):
    queryset = DonorResponse.objects.all()
    serializer_class = DonorResponseSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):

        blood_request_id = request.data.get("blood_request")
        donor_id = request.data.get("donor")
        donor_status = request.data.get("status")

        if not blood_request_id or not donor_status:
            return Response(
                {
                    "error": "blood_request and status are required."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        if donor_status not in ["Accepted", "Rejected"]:
            return Response(
                {
                    "error": "Status must be Accepted or Rejected."
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Hospital responding to a matched donor
        if donor_id:

            try:
                hospital = Hospital.objects.get(
                    user=request.user
                )
            except Hospital.DoesNotExist:
                return Response(
                    {
                        "error": "No hospital profile found for this user."
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

            try:
                blood_request = BloodRequest.objects.get(
                    id=blood_request_id,
                    hospital=hospital
                )
            except BloodRequest.DoesNotExist:
                return Response(
                    {
                        "error": "Blood request not found or not authorized."
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

            try:
                donor = Donor.objects.get(
                    id=donor_id
                )
            except Donor.DoesNotExist:
                return Response(
                    {
                        "error": "Donor not found."
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

        # Donor responding to a blood request
        else:

            try:
                donor = Donor.objects.get(
                    user=request.user
                )
            except Donor.DoesNotExist:
                return Response(
                    {
                        "error": "No donor profile found for this user."
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

            try:
                blood_request = BloodRequest.objects.get(
                    id=blood_request_id
                )
            except BloodRequest.DoesNotExist:
                return Response(
                    {
                        "error": "Blood request not found."
                    },
                    status=status.HTTP_404_NOT_FOUND
                )

        donor_response, created = (
            DonorResponse.objects.update_or_create(
                blood_request=blood_request,
                donor=donor,
                defaults={
                    "status": donor_status
                }
            )
        )

        try:
            send_hospital_response_notification(
                hospital=blood_request.hospital,
                donor=donor,
                blood_request=blood_request,
                donor_status=donor_status
            )
        except Exception as e:
            print(f"Hospital email notification failed:{e}")


        return Response(
            {
                "message": (
                    f"Donor response "
                    f"{donor_status.lower()} successfully."
                ),
                "id": donor_response.id,
                "blood_request": donor_response.blood_request.id,
                "donor": donor_response.donor.id,
                "status": donor_response.status
            },
            status=(
                status.HTTP_201_CREATED
                if created
                else status.HTTP_200_OK
            )
        )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_hospital(request):

    try:
        hospital = Hospital.objects.get(
            user=request.user
        )
    except Hospital.DoesNotExist:
        return Response(
            {
                "error": "No hospital profile found for this user."
            },
            status=404
        )

    return Response(
        {
            "id": hospital.id,
            "hospital_name": hospital.hospital_name,
            "location": hospital.location,
            "latitude": hospital.latitude,
            "longitude": hospital.longitude,
            "email": hospital.email,
            "phone": hospital.phone
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_blood_requests(request):

    try:
        donor = Donor.objects.get(
            user=request.user
        )
    except Donor.DoesNotExist:
        return Response(
            {
                "error": "No donor profile found for this user."
            },
            status=404
        )

    blood_requests = BloodRequest.objects.all()

    data = []

    for blood_request in blood_requests:

        if not is_compatible(
            donor.blood_group,
            blood_request.blood_group
        ):
            continue

        distance = None

        if (
            donor.latitude is not None
            and donor.longitude is not None
            and blood_request.latitude is not None
            and blood_request.longitude is not None
        ):
            distance = calculate_distance(
                donor.latitude,
                donor.longitude,
                blood_request.latitude,
                blood_request.longitude
            )

        same_location = (
            donor.location.lower()
            == blood_request.location.lower()
        )

        if same_location:
            priority = "High"
        else:
            priority = "Normal"

        previous_response = DonorResponse.objects.filter(
            blood_request=blood_request,
            donor=donor
        ).first()

        response_status = (
            previous_response.status
            if previous_response
            else None
        )

        data.append(
            {
                "id": blood_request.id,
                "hospital_name": blood_request.hospital_name,
                "blood_group": blood_request.blood_group,
                "units_required": blood_request.units_required,
                "location": blood_request.location,
                "latitude": blood_request.latitude,
                "longitude": blood_request.longitude,
                "urgency": blood_request.urgency,
                "created_at": blood_request.created_at,
                "distance_km": distance,
                "priority": priority,
                "compatibility": "Compatible",
                "response_status": response_status,
            }
        )

    data.sort(
        key=lambda item: (
            item["distance_km"]
            if item["distance_km"] is not None
            else float("inf")
        )
    )

    return Response(data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def blood_request_responses(request, request_id):

    try:
        blood_request = BloodRequest.objects.get(
            id=request_id
        )
    except BloodRequest.DoesNotExist:
        return Response(
            {
                "error": "Blood request not found."
            },
            status=404
        )

    responses = DonorResponse.objects.filter(
        blood_request=blood_request
    ).select_related("donor")

    data = []

    for donor_response in responses:

        donor = donor_response.donor

        data.append(
            {
                "response_id": donor_response.id,
                "donor_id": donor.id,
                "donor_name": donor.name,
                "blood_group": donor.blood_group,
                "phone": donor.phone,
                "location": donor.location,
                "status": donor_response.status,
                "responded_at": donor_response.responded_at,
            }
        )

    return Response(
        {
            "blood_request": {
                "id": blood_request.id,
                "hospital_name": blood_request.hospital_name,
                "blood_group": blood_request.blood_group,
                "units_required": blood_request.units_required,
                "location": blood_request.location,
                "urgency": blood_request.urgency,
            },
            "responses": data,
        }
    )


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def hospital_blood_requests(request):

    try:
        hospital = Hospital.objects.get(
            user=request.user
        )
    except Hospital.DoesNotExist:
        return Response(
            {
                "error": "No hospital profile found for this user."
            },
            status=404
        )

    blood_requests = BloodRequest.objects.filter(
        hospital=hospital
    ).order_by("-created_at")

    serializer = BloodRequestSerializer(
        blood_requests,
        many=True
    )

    return Response(serializer.data)