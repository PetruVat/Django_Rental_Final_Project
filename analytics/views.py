from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.db.models import Count, Max
from analytics.models import SearchHistory, ViewHistory
from analytics.serializers import (
    PopularSearchSerializer,
    PopularListingSerializer,
    UserSearchHistorySerializer,
)
from listings.models import Listing

class PopularSearchView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        """
        Возвращает топ-10 самых частых поисковых запросов (keyword, count).
        """
        qs = SearchHistory.objects.values('keyword').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        serializer = PopularSearchSerializer(qs, many=True)
        return Response(serializer.data)

class PopularListingView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        """
        Возвращает топ-10 объявлений по количеству просмотров.
        """
        qs = ViewHistory.objects.values('listing').annotate(
            view_count=Count('id')
        ).order_by('-view_count')[:10]

        # Собираем полную информацию по объявлениям
        results = []
        for item in qs:
            try:
                listing = Listing.objects.get(pk=item['listing'])
                results.append({
                    'listing_id': listing.id,
                    'title': listing.title,
                    'view_count': item['view_count']
                })
            except Listing.DoesNotExist:
                continue

        serializer = PopularListingSerializer(results, many=True)
        return Response(serializer.data)


class UserSearchHistoryView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        """Возвращает последние поисковые запросы текущего пользователя."""
        qs = (
            SearchHistory.objects.filter(user=request.user)
            .values("keyword")
            .annotate(count=Count("id"), last_time=Max("timestamp"))
            .order_by("-last_time")[:10]
        )
        serializer = UserSearchHistorySerializer(qs, many=True)
        return Response(serializer.data)