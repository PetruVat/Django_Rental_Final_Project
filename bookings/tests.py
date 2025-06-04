from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from django.test import override_settings

from listings.models import Listing
from bookings.models import Booking

TEST_DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:'
    }
}

@override_settings(DATABASES=TEST_DATABASES)
class BookingViewTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.owner = User.objects.create_user(
            username='owner', password='pass', role='landlord'
        )
        self.tenant = User.objects.create_user(
            username='tenant', password='pass', role='tenant'
        )
        self.listing = Listing.objects.create(
            owner=self.owner,
            title='Test Listing',
            description='Desc',
            price=100,
            city='City',
            district='District',
            rooms=1,
            property_type='house'
        )
        self.booking = Booking.objects.create(
            listing=self.listing,
            tenant=self.tenant,
            start_date='2024-01-01',
            end_date='2024-01-02'
        )

    def test_bookings_list_authenticated(self):
        self.client.force_authenticate(user=self.tenant)
        url = reverse('bookings-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)