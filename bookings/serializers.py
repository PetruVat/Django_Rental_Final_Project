from rest_framework import serializers

from bookings.models import Booking
from listings.models import Listing


class BookingSerializer(serializers.ModelSerializer):
    tenant = serializers.ReadOnlyField(source='tenant.username')
    listing = serializers.PrimaryKeyRelatedField(
        queryset=Listing.objects.all()
    )

    class Meta:
        model = Booking
        fields = (
            'id',
            'listing',
            'tenant',
            'start_date',
            'end_date',
            'status',
            'created_at'
        )
        read_only_fields = ('status', 'created_at')
