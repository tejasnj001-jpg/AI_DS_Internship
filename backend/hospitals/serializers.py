from rest_framework import serializers

from .models import BloodRequest, DonorResponse


class BloodRequestSerializer(serializers.ModelSerializer):

    class Meta:
        model = BloodRequest

        fields = '__all__'

        read_only_fields = [
            "hospital",
            "hospital_name",
            "location",
            "latitude",
            "longitude",
            "created_at",
        ]


class DonorResponseSerializer(serializers.ModelSerializer):

    class Meta:
        model = DonorResponse

        fields = '__all__'