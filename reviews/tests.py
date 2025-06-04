from django.contrib.auth import get_user_model
from django.test import TestCase, override_settings

from listings.models import Listing
from reviews.serializers import ReviewSerializer

TEST_DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:'
    }
}

@override_settings(DATABASES=TEST_DATABASES)
class ReviewRatingValidationTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.landlord = User.objects.create_user(
            username='owner', password='pass', role='landlord'
        )
        self.tenant = User.objects.create_user(
            username='tenant', password='pass', role='tenant'
        )
        self.listing = Listing.objects.create(
            owner=self.landlord,
            title='Test Listing',
            description='Desc',
            price=100,
            city='City',
            district='District',
            rooms=1,
            property_type='house'
        )

    def test_rating_below_min(self):
        serializer = ReviewSerializer(data={
            'listing': self.listing.id,
            'rating': 0,
            'comment': 'Too low'
        })
        self.assertFalse(serializer.is_valid())
        self.assertIn('rating', serializer.errors)

    def test_rating_above_max(self):
        serializer = ReviewSerializer(data={
            'listing': self.listing.id,
            'rating': 6,
            'comment': 'Too high'
        })
        self.assertFalse(serializer.is_valid())
        self.assertIn('rating', serializer.errors)