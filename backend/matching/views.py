import math

from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from donors.models import Donor
from hospitals.models import BloodRequest
from ai_matching.ml_model import predict_donor_suitability

def calculate_distance(lat1, lon1, lat2, lon2):

    R = 6371  # Earth radius in kilometers

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

    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

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

    return recipient_group in compatibility.get(donor_group, [])


def calculate_matching_score(distance, urgency, same_location):

    score = 0

    # Compatibility
    # Compatible donors are already filtered.
    score += 40

    # Distance score
    if distance <= 5:
        score += 30
    elif distance <= 20:
        score += 25
    elif distance <= 50:
        score += 20
    elif distance <= 100:
        score += 10
    else:
        score += 5

    # Urgency score
    urgency = urgency.lower()

    if urgency in ["critical", "emergency"]:
        score += 20
    elif urgency == "high":
        score += 15
    elif urgency == "medium":
        score += 10
    else:
        score += 5

    # Same location
    if same_location:
        score += 10

    return score


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def match_donors(request):

    request_id = request.GET.get('request_id')

    blood_request = BloodRequest.objects.get(id=request_id)

    # Get all available donors
    donors = Donor.objects.filter(
        is_available=True
    )

    data = []

    for donor in donors:

        # Check blood group compatibility
        compatible = is_compatible(
            donor.blood_group,
            blood_request.blood_group
        )

        # Skip incompatible donors
        if not compatible:
            continue

        # Calculate distance for this donor
        distance = calculate_distance(
            blood_request.latitude,
            blood_request.longitude,
            donor.latitude,
            donor.longitude
        )

        # Check whether donor and hospital are in same location
        same_location = (
            donor.location.lower() == blood_request.location.lower()
        )

        # Set priority
        if same_location:
            priority = "High"
        else:
            priority = "Normal"

        # Calculate intelligent matching score
        matching_score = calculate_matching_score(
            distance,
            blood_request.urgency,
            same_location
        )
        ai_prediction, ai_confidence = predict_donor_suitability(
            1,
            distance,
            3 if blood_request.urgency.lower() in ["critical", "emergency"]
             else 2 if blood_request.urgency.lower() == "high"
            else 1,
            1 if donor.location.lower() == blood_request.location.lower()
            else 0,
            1 if donor.is_available else 0
        )

        data.append({
            'id':donor.id,
            'name': donor.name,
            'blood_group': donor.blood_group,
            'phone': donor.phone,
            'location': donor.location,
            'priority': priority,
            'matching_score': matching_score,
            'distance_km': distance,
            'compatibility': "Compatible",
            'ai_prediction': ai_prediction,
            'ai_confidence': ai_confidence,
            'ai_features': {
                'compatibility': 1,
                'distance_km': distance,
                'urgency': blood_request.urgency,
                'same_location': 1 if same_location else 0,
                'is_available': 1 if donor.is_available else 0,
            },
        })

    # Sort donors from highest score to lowest score
    data.sort(
        key=lambda donor: donor['matching_score'],
        reverse=True
    )

    return Response({
        'blood_request': {
            'hospital_name': blood_request.hospital_name,
            'blood_group': blood_request.blood_group,
            'units_required': blood_request.units_required,
            'location': blood_request.location,
            'urgency': blood_request.urgency,
        },
        'matching_donors': data
    })