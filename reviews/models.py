from django.conf import settings
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from listings.models import Listing

# Create your models here.
class Review(models.Model):
    listing = models.ForeignKey(
        Listing,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    tenant = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='reviews'
    )
    rating = models.PositiveSmallIntegerField(
        default=5,
        help_text='Rating from 1 to 5',
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ("listing", "tenant")

    def __str__(self):
        return f'Review {self.id} for {self.listing}'