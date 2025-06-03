from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.utils import timezone

from reviews.models import Review
from reviews.serializers import ReviewSerializer
from reviews.permissions import IsTenantOrReadOnly
from bookings.models import Booking

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = (permissions.IsAuthenticated, IsTenantOrReadOnly)

    def get_queryset(self):
        listing_id = self.request.query_params.get('listing')
        if listing_id:
            return self.queryset.filter(listing_id=listing_id)
        return self.queryset.none()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        listing = serializer.validated_data.get('listing')
        user = request.user
        today = timezone.now().date()

        # Проверка: есть завершённая аренда
        has_confirmed = Booking.objects.filter(
            listing=listing,
            tenant=user,
            status='confirmed',
            end_date__lte=today
        ).exists()

        if not has_confirmed:
            return Response(
                {"detail": "Вы можете оставить отзыв только после завершённой аренды."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Проверка: отзыв уже оставлен
        already_reviewed = Review.objects.filter(
            listing=listing,
            tenant=user
        ).exists()

        if already_reviewed:
            return Response(
                {"detail": "Вы уже оставили отзыв к этому объявлению."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save(tenant=user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
