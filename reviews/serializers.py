from rest_framework import serializers
from reviews.models import Review


class ReviewSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source='author.username')
    listing = serializers.PrimaryKeyRelatedField(
        queryset=Review.objects.none()
    )

    class Meta:
        model = Review
        fields = (
            'id',
            'listing',
            'author',
            'rating',
            'comment',
            'created_at'
        )