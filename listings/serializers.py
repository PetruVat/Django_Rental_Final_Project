from rest_framework import serializers
from listings.models import Listing


class ListingSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Listing
        fields = (
            'id',
            'owner',
            'title',
            'description',
            'price',
            'city',
            'district',
            'rooms',
            'property_type',
            'is_active',
            'created_at',
        )