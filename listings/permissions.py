from rest_framework import permissions


class IsListingOwnerOrReadOnly(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.is_authenticated and request.user.role == "landloard"


    """
    Только владелец объявления может изменить/удалить.
    """
    def has_object_permission(self, request, view, obj):
        # чтение — всем аутентифицированным
        if request.method in permissions.SAFE_METHODS:
            return True
        # запись - только владелец
        return obj.owner == request.user
