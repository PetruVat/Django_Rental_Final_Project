from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone

from listings.models import Listing
from listings.serializers import ListingSerializer
from listings.permissions import IsListingOwnerOrReadOnly
from analytics.models import SearchHistory, ViewHistory


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.filter(is_active=True)
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
