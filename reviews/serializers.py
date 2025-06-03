from rest_framework import serializers
from reviews.models import Review
from listings.models import Listing  # Import Listing model


class ReviewSerializer(serializers.ModelSerializer):
    tenant_name = serializers.CharField(source="tenant.username", read_only=True)

    class Meta:
        model = Review
        fields = ["id", "listing", "tenant_name", "rating", "comment", "created_at"]
        read_only_fields = ["id", "tenant_name", "created_at"]

    def create(self, validated_data):
        # tenant берётся из запроса
        request = self.context.get("request")
        validated_data["tenant"] = request.user
        return super().create(validated_data)


class ListingSerializerWithReviews(serializers.ModelSerializer):
    average_rating = serializers.SerializerMethodField()
    reviews = ReviewSerializer(many=True, read_only=True)  # Nest reviews

    class Meta:
        model = Listing
        fields = '__all__'  # Or specify fields you need, e.g., ('id', 'title', 'price', 'average_rating', 'reviews')

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if reviews:
            total = sum(review.rating for review in reviews)
            return total / len(reviews)
        return 0