from rest_framework import serializers
from reviews.models import Review

class ReviewSerializer(serializers.ModelSerializer):
    tenant = serializers.StringRelatedField(read_only=True)
    created_at = serializers.DateTimeField(read_only=True)

    class Meta:
        model = Review
        fields = ["id", "listing", "tenant", "comment", "rating", "created_at"]
        read_only_fields = ["tenant", "created_at"]
