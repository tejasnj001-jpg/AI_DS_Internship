from django.db import models
from django.contrib.auth.models import User

from donors.models import Donor


class Hospital(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )

    hospital_name = models.CharField(
        max_length=150
    )

    location = models.CharField(
        max_length=200
    )

    latitude = models.FloatField(
        null=True,
        blank=True
    )

    longitude = models.FloatField(
        null=True,
        blank=True
    )

    phone = models.CharField(
        max_length=15
    )
    email = models.EmailField(
        null=True,
        blank=True
    )

    def __str__(self):
        return self.hospital_name


class BloodRequest(models.Model):

    hospital_name = models.CharField(
        max_length=150
    )

    hospital = models.ForeignKey(
        Hospital,
        on_delete=models.CASCADE,
        related_name="blood_requests",
        null=True,
        blank=True
    )

    blood_group = models.CharField(
        max_length=5
    )

    units_required = models.IntegerField()

    location = models.CharField(
        max_length=200
    )

    latitude = models.FloatField(
        null=True,
        blank=True
    )

    longitude = models.FloatField(
        null=True,
        blank=True
    )

    urgency = models.CharField(
        max_length=20
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.hospital_name} - {self.blood_group}"


class DonorResponse(models.Model):

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Accepted", "Accepted"),
        ("Rejected", "Rejected"),
    ]

    blood_request = models.ForeignKey(
        BloodRequest,
        on_delete=models.CASCADE,
        related_name="donor_responses"
    )

    donor = models.ForeignKey(
        Donor,
        on_delete=models.CASCADE,
        related_name="blood_request_responses"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    responded_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return (
            f"{self.donor.name} - "
            f"{self.blood_request.hospital_name} - "
            f"{self.status}"
        )