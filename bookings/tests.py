from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIRequestFactory
from django.test import override_settings, TestCase
from django.utils import timezone
from datetime import timedelta

from listings.models import Listing
from bookings.models import Booking
from bookings.serializers import BookingSerializer

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

    def test_bookings_list_unauthenticated(self):
        url = reverse('bookings-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)


@override_settings(DATABASES=TEST_DATABASES)
class BookingValidationTests(TestCase):
    def setUp(self):
        User = get_user_model()
        self.landlord = User.objects.create_user(
            username='land', password='pass', role='landlord'
        )
        self.tenant = User.objects.create_user(
            username='ten', password='pass', role='tenant'
        )
        self.listing = Listing.objects.create(
            owner=self.landlord,
            title='Listing',
            description='Desc',
            price=100,
            city='City',
            district='District',
            rooms=1,
            property_type='house'
        )
        self.factory = APIRequestFactory()

    def test_start_date_before_today(self):
        request = self.factory.post('/bookings/')
        request.user = self.tenant
        data = {
            'listing': self.listing.id,
            'start_date': (timezone.now().date() - timedelta(days=1)).isoformat(),
            'end_date': (timezone.now().date() + timedelta(days=1)).isoformat(),
        }
        serializer = BookingSerializer(data=data, context={'request': request})
        self.assertFalse(serializer.is_valid())
        self.assertIn('start_date', serializer.errors)

    def test_cannot_book_own_listing(self):
        request = self.factory.post('/bookings/')
        request.user = self.landlord
        data = {
            'listing': self.listing.id,
            'start_date': (timezone.now().date() + timedelta(days=1)).isoformat(),
            'end_date': (timezone.now().date() + timedelta(days=2)).isoformat(),
        }
        serializer = BookingSerializer(data=data, context={'request': request})
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)