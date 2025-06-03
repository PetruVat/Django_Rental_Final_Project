from rest_framework import permissions


class BookingPermission(permissions.BasePermission):
    """
    Tenant может создавать и отменять свои брони.
    Landlord может подтверждать или отклонять брони на свои объекты.
    """

    def has_permission(self, request, view):
        if view.action == 'create':
            return request.user.role == 'tenant'
        return True  # Остальные разрешения — в has_object_permission

    def has_object_permission(self, request, view, obj):
        user = request.user

        if request.method in permissions.SAFE_METHODS:
            return True

        if user.role == 'tenant':
            # Может отменить свою бронь
            if view.action in ['partial_update', 'destroy']:
                return obj.tenant == user

        if user.role == 'landlord':
            # Может подтвердить или отклонить бронь для своего объекта
            if view.action == 'partial_update':
                return obj.listing.owner == user

        return False
