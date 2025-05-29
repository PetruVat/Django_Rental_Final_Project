from rest_framework import serializers
from bookings.models import Booking


class BookingSerializer(serializers.ModelSerializer):
    tenant = serializers.ReadOnlyField(source='tenant.username')
    listing = serializers.PrimaryKeyRelatedField(
        queryset=Booking.objects.none()
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
