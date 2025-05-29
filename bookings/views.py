from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied

from bookings.models import Booking
from bookings.serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        # Арендодатель видит брони его объявлений, арендатор — свои брони
        if user.role == 'landlord':
            return Booking.objects.filter(listing__owner=user)
        return Booking.objects.filter(tenant=user)

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)