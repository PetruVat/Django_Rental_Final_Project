from django.conf import settings
from django.db import models

# Create your models here.
class Listing(models.Model):
    TYPE_CHOICES = (
        ('house', 'House'),
        ('apartment', 'Apartment'),
        ('room', 'Room'),
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='listings'
    )
    title = models.CharField(max_length=200)
    description = models.TextField()
    price = models.IntegerField()
    city = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    rooms = models.PositiveSmallIntegerField()
    property_type = models.CharField(
        max_length=20,
        choices=TYPE_CHOICES,
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title


class ListingImage(models.Model):                   # ② НОВЫЙ класс
    listing  = models.ForeignKey(
        "Listing",
        on_delete=models.CASCADE,
    )
    image    = models.ImageField(upload_to="listing_images/")
    uploaded = models.DateTimeField(auto_now_add=True)

