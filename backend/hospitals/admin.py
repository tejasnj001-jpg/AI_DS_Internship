from django.contrib import admin

from .models import Hospital, BloodRequest, DonorResponse


admin.site.register(Hospital)
admin.site.register(BloodRequest)
admin.site.register(DonorResponse)