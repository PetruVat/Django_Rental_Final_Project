# listings\permissions.py
from rest_framework import permissions
from listings.models import ListingImage, Listing


class IsListingOwnerOrReadOnly(permissions.BasePermission):
    """
    Только Арендодатель может делать объявления!
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return False
        return request.user.role == "landlord"



    def has_object_permission(self, request, view, obj):
        """Только владелец объявления может изменить/удалить."""
        # чтение — всем аутентифицированным
        if request.method in permissions.SAFE_METHODS:
            return True
        if not request.user.is_authenticated:
            return False
        # запись - только владелец
        return obj.owner == request.user

class IsListingOwnerForImage(permissions.BasePermission):
    """
    Разрешает доступ только если пользователь — владелец объявления,
    к которому привязано изображение.
    """

    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False
        if isinstance(obj, ListingImage):
            return obj.listing.owner == request.user
        return False

    def has_permission(self, request, view):
        listing_id = request.data.get('listing')
        if not (request.user and request.user.is_authenticated and listing_id):
            return False
        try:
            listing = Listing.objects.get(pk=listing_id)
        except Listing.DoesNotExist:
            return False
        return listing.owner == request.user