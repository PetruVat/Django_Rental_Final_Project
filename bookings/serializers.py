from rest_framework import serializers
from django.utils import timezone

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

    def validate(self, attrs):
        listing = attrs.get('listing')
        start_date = attrs.get('start_date')
        end_date = attrs.get('end_date')

        if start_date and start_date < timezone.now().date():
            raise serializers.ValidationError(
                {'start_date': 'Дата начала не может быть в прошлом.'}
            )

        request = self.context.get('request')
        if listing and request and listing.owner == request.user:
            raise serializers.ValidationError(
                'Нельзя бронировать собственное объявление.'
            )

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError(
                {'end_date': 'Дата окончания не может быть раньше даты начала.'}
            )

        if listing and start_date and end_date:
            qs = Booking.objects.filter(
                listing=listing,
            ).exclude(status__in=['canceled', 'rejected'])

            if self.instance:
                qs = qs.exclude(pk=self.instance.pk)

            qs = qs.filter(start_date__lte=end_date, end_date__gte=start_date)

            if qs.exists():
                raise serializers.ValidationError(
                    'Выбранные даты уже заняты для этого объявления.'
                )

        return attrs
