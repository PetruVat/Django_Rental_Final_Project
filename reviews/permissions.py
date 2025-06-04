from rest_framework import permissions


class IsTenantOrReadOnly(permissions.BasePermission):
    """
    Только tenant может создавать отзывы.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return False
        return request.user.role == 'tenant'
