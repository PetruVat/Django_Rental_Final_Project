from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView

from .models import Booking
from .serializers import BookingSerializer
from .permissions import BookingPermission


class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer
    permission_classes = [permissions.IsAuthenticated, BookingPermission]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'tenant':
            return Booking.objects.filter(tenant=user)
        elif user.role == 'landlord':
            return Booking.objects.filter(listing__owner=user)
        return Booking.objects.none()

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.user)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated, BookingPermission])
    def confirm(self, request, pk=None):
        booking = self.get_object()
        if request.user != booking.listing.owner:
            return Response({"detail": "Недостаточно прав."}, status=status.HTTP_403_FORBIDDEN)

        booking.status = 'confirmed'
        booking.save()
        return Response({'status': 'confirmed'}, status=status.HTTP_200_OK)

    @action(detail=True, methods=['patch'], permission_classes=[permissions.IsAuthenticated, BookingPermission])
    def decline(self, request, pk=None):
        booking = self.get_object()
        if request.user != booking.listing.owner:
            return Response({"detail": "Недостаточно прав."}, status=status.HTTP_403_FORBIDDEN)

        booking.status = 'rejected'
        booking.save()
        return Response({'status': 'rejected'}, status=status.HTTP_200_OK)

class BookingStatusUpdateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, pk):
        status_value = request.data.get("status")
        if status_value not in ["pending", "confirmed", "canceled", "rejected"]:
            return Response({"error": "Неверный статус"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            booking = Booking.objects.get(pk=pk)
        except Booking.DoesNotExist:
            return Response({"error": "Бронирование не найдено"}, status=status.HTTP_404_NOT_FOUND)

        if booking.listing.owner != request.user:
            return Response({"error": "Нет доступа"}, status=status.HTTP_403_FORBIDDEN)

        booking.status = status_value
        booking.save()
        return Response({"status": booking.status})