from django.contrib.auth.models import AbstractUser
from django.db import models

# Create your models here.
class User(AbstractUser):
    ROLE_CHOICES = (
        ('tenant', 'Tenant'),
        ('landlord', 'Landlord'),
    )
    role = models.CharField(
        max_length=10,
        choices=ROLE_CHOICES,
        default='tenant',
        help_text='Role of the user: tenant or landlord'
    )

    def __str__(self):
        return f'{self.username} ({self.role})'