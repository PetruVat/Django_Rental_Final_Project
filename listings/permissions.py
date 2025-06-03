# listings\permissions.py
from rest_framework import permissions
from listings.models import ListingImage


class IsListingOwnerOrReadOnly(permissions.BasePermission):
    """
    Только Арендодатель может делать объявления!
    """
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

class IsListingOwnerForImage(permissions.BasePermission):
    """
    Разрешает доступ только если пользователь — владелец объявления,
    к которому привязано изображение.
    """

    def has_object_permission(self, request, view, obj):
        if isinstance(obj, ListingImage):
            return obj.listing.owner == request.user
        return False