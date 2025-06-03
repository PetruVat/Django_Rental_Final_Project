from rest_framework import viewsets, permissions, mixins, status, generics
from rest_framework.exceptions import PermissionDenied
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from listings.models import Listing, ListingImage
from listings.serializers import ListingSerializer, ListingImageSerializer
from listings.permissions import IsListingOwnerOrReadOnly, IsListingOwnerForImage
from analytics.models import SearchHistory, ViewHistory


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.all()
    serializer_class = ListingSerializer
    permission_classes = (permissions.IsAuthenticated, IsListingOwnerOrReadOnly)


    filter_backends = [SearchFilter, OrderingFilter, DjangoFilterBackend]
    filterset_fields = {
        'price':['gte', 'lte'],
        'city':['exact'],
        'district':['exact'],
        'rooms':['gte','lte'],
        'property_type':['exact'],
    }
    search_fields = ('title', 'description',)
    ordering_fields = ('price', 'created_at',)

    def list(self, request, *args, **kwargs):
        """
        Переопределяем list, чтобы сохранять историю поиска по ключевому слову.
        """
        # Если есть параметр search в GET-запросе, сохраняем запрос
        keyword = request.query_params.get('search')
        if keyword:
            SearchHistory.objects.create(
                user=request.user if request.user.is_authenticated else None,
                keyword=keyword,
                timestamp=timezone.now()
            )
        return super().list(request, *args, **kwargs)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def retrieve(self, request, *args, **kwargs):
        """
        Переопределяем retrieve, чтобы сохранять факт просмотра объявления пользователем.
        """
        instance = self.get_object()
        ViewHistory.objects.create(
            user=request.user if request.user.is_authenticated else None,
            listing=instance,
            timestamp=timezone.now()
        )
        return super().retrieve(request, *args, **kwargs)

class ListingImageViewSet(mixins.CreateModelMixin,
                          mixins.DestroyModelMixin,
                          viewsets.GenericViewSet):
    """
    POST для загрузки новой картинки,
    DELETE для удаления (опционально).
    """
    queryset = ListingImage.objects.all()
    serializer_class = ListingImageSerializer
    permission_classes = [IsAuthenticated]


class UploadListingImageView(generics.CreateAPIView):
    """Upload a new image for a listing."""

    queryset = ListingImage.objects.all()
    serializer_class = ListingImageSerializer
    parser_classes = [MultiPartParser]
    permission_classes = [IsAuthenticated, IsListingOwnerForImage]

    def perform_create(self, serializer):
        listing = serializer.validated_data["listing"]
        if listing.owner != self.request.user:
            raise PermissionDenied(
                "Вы не являетесь владельцем этого объявления."
            )
        serializer.save()

