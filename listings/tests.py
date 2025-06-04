from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from django.test import override_settings
from django.core.files.uploadedfile import SimpleUploadedFile

from listings.models import Listing, ListingImage

TEST_DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:'
    }
}

@override_settings(DATABASES=TEST_DATABASES)
class ListingViewTests(APITestCase):
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

    def test_listings_list_authenticated(self):
        self.client.force_authenticate(user=self.tenant)
        url = reverse('listings-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)

    def test_listings_list_unauthenticated(self):
        url = reverse('listings-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 401)


@override_settings(DATABASES=TEST_DATABASES)
class ListingImagePermissionTests(APITestCase):
    def setUp(self):
        User = get_user_model()
        self.owner = User.objects.create_user(
            username='owner2', password='pass', role='landlord'
        )
        self.tenant = User.objects.create_user(
            username='tenant2', password='pass', role='tenant'
        )
        self.listing = Listing.objects.create(
            owner=self.owner,
            title='Test Listing 2',
            description='Desc',
            price=100,
            city='City',
            district='District',
            rooms=1,
            property_type='house'
        )

    def test_non_owner_cannot_create_image(self):
        self.client.force_authenticate(user=self.tenant)
        url = reverse('listingimage-list')
        image = SimpleUploadedFile('test.jpg', b'abc', content_type='image/jpeg')
        response = self.client.post(url, {'listing': self.listing.id, 'listing_id': self.listing.id, 'image': image})
        self.assertEqual(response.status_code, 403)

    def test_non_owner_cannot_delete_image(self):
        self.client.force_authenticate(user=self.owner)
        url = reverse('listingimage-list')
        image = SimpleUploadedFile('test.jpg', b'abc', content_type='image/jpeg')
        create_resp = self.client.post(url, {'listing': self.listing.id, 'listing_id': self.listing.id, 'image': image})
        image_obj = ListingImage.objects.first()
        self.client.force_authenticate(user=self.tenant)
        del_url = reverse('listingimage-detail', args=[image_obj.id])
        del_resp = self.client.delete(del_url)
        self.assertEqual(del_resp.status_code, 403)