from rest_framework import viewsets, permissions
from rest_framework.filters import SearchFilter, OrderingFilter
from django_filters.rest_framework import DjangoFilterBackend

from listings.models import Listing
from listings.serializers import ListingSerializer


class ListingViewSet(viewsets.ModelViewSet):
    queryset = Listing.objects.filter(is_active=True)
    serializer_class = ListingSerializer
    permission_classes = (permissions.IsAuthenticated,)


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

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)
