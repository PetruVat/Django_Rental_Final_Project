# accounts\permissions.py
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Позволяет редактировать только владельцу объекта.
    """

    def has_object_permission(self, request, view, obj):
        # всем разрешён SAFE_METHODS (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True
        # иначе, только владелец
        return obj.user == request.user