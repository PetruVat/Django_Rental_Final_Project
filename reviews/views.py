from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.utils import timezone

from reviews.models import Review
from reviews.serializers import ReviewSerializer
from reviews.permissions import IsReviewAuthorOrReadOnly
from bookings.models import Booking


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = (permissions.IsAuthenticated, IsReviewAuthorOrReadOnly)

    def get_queryset(self):
        # Просматривать можно все отзывы к конкретному объявлению
        listing_id = self.request.query_params.get('listing')
        if listing_id:
            return self.queryset.filter(listing_id=listing_id)
        return self.queryset

    def perform_create(self, serializer):
        listing = serializer.validated_data.get('listing')
        user = self.request.user
        now = timezone.now().date()

        # Проверка: есть ли завершённая подтверждённая бронь для этого пользователя
        has_confirmed = Booking.objects.filter(
            listing=listing,
            tenant=user,
            status='confirmed',
            end_date__lte=now
        ).exists()

        if not has_confirmed:
            return Response(
                {"detail": "Вы можете оставить отзыв только после завершённой аренды."},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer.save(author=user)
