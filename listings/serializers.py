from django.db.models import Avg
from rest_framework import serializers
from listings.models import Listing, ListingImage


class ListingImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ListingImage
        fields = ['listing_id', 'image']


class ListingSerializer(serializers.ModelSerializer):
    images = ListingImageSerializer(many=True, read_only=True, source="listingimage_set")
    average_rating = serializers.SerializerMethodField()

    class Meta:
        model = Listing
        fields = [
            "id",
            "owner",
            "title",
            "description",
            "price",
            "city",
            "district",
            "rooms",
            "property_type",
            "is_active",
            "created_at",
            "images",
            "average_rating",
        ]
        read_only_fields = ["owner"]

    def create(self, validated_data):
        validated_data["owner"] = self.context["request"].user
        return super().create(validated_data)

    def get_average_rating(self, obj):
        avg = obj.reviews.aggregate(avg=Avg("rating"))[
            "avg"
        ]
        return round(avg, 1) if avg is not None else None