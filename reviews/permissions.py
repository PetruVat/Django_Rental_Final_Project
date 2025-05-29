from rest_framework import permissions


class IsReviewAuthorOrReadOnly(permissions.BasePermission):
    """
    Только автор отзыва может изменить или удалить его.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user
