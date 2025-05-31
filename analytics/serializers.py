from rest_framework import serializers

class PopularSearchSerializer(serializers.Serializer):
    keyword = serializers.CharField()
    count = serializers.IntegerField()

class PopularListingSerializer(serializers.Serializer):
    listing_id = serializers.IntegerField()
    title = serializers.CharField()
    view_count = serializers.IntegerField()
