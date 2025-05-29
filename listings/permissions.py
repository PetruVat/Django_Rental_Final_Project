from rest_framework import permissions


class IsListingOwnerOrReadOnly(permissions.BasePermission):
    """
    Только владелец объявления может изменить/удалить.
    """
    def has_object_permission(self, request, view, obj):
        # чтение — всем аутентифицированным
        if request.method in permissions.SAFE_METHODS:
            return True
        # запись - только владелец
        return obj.owner == request.user
