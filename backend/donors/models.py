from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Donor(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    name = models.CharField(max_length=100)
    blood_group = models.CharField(max_length=5)
    phone = models.CharField(max_length=15)
    email = models.EmailField(null=True,blank=True)
    location = models.CharField(max_length=200)
    latitude = models.FloatField(null=True, blank=True)
    longitude = models.FloatField(null=True, blank=True)

    is_available = models.BooleanField(default=True)

    def __str__(self):
        return self.name