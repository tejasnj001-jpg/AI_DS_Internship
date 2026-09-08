from django.core.mail import send_mail
from django.conf import settings


def send_donor_notification(donor, blood_request):

    if not donor.email:
        return False

    subject = "🩸 Blood Donation Request - Urgent Need"

    message = f"""
Hello {donor.name},

A hospital has created a blood request that matches your blood group.

Hospital: {blood_request.hospital_name}
Blood Group Required: {blood_request.blood_group}
Units Required: {blood_request.units_required}
Location: {blood_request.location}
Urgency: {blood_request.urgency}

Please log in to your Blood Donor Hospital Matching System dashboard
to view the request and accept or reject it.

Thank you for helping save lives.

AI-Based Blood Donor Hospital Matching System
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [donor.email],
        fail_silently=False,
    )

    return True


def send_hospital_response_notification(
    hospital,
    donor,
    blood_request,
    donor_status
):

    if not hospital.email:
        return False

    subject = f"🩸 Donor Response - {donor_status}"

    message = f"""
Hello {hospital.hospital_name},

A donor has responded to your blood request.

Donor Name: {donor.name}
Donor Blood Group: {donor.blood_group}
Donor Location: {donor.location}
Donor Phone: {donor.phone}

Blood Group Required: {blood_request.blood_group}
Units Required: {blood_request.units_required}
Location: {blood_request.location}
Urgency: {blood_request.urgency}

Donor Response: {donor_status}

Please log in to your Blood Donor Hospital Matching System dashboard
to view the donor response.

AI-Based Blood Donor Hospital Matching System
"""

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [hospital.email],
        fail_silently=False,
    )

    return True