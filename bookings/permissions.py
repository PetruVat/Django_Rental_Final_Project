from rest_framework import permissions


class BookingPermission(permissions.BasePermission):
    """
    Tenant может создавать/отменять свои брони.
    Landlord может подтверждать/отклонять брони для своих объявлений.
    """
    def has_object_permission(self, request, view, obj):
        user = request.user
        # чтение - viewset сам фильтрует
        if request.method in permissions.SAFE_METHODS:
            return True


        # Tenant: создание и отмена (cancel → PATCH status='cancelled')
        if user.role == 'tenant':
            # при создании объект ещё не существует → has_permission
            if view.action == 'create':
                return True

            # отмена: проверяем, что это его бронь
            if view.action in ['patial_update', 'destroy']:
                return obj.tenant == user

        # Landlord: может менять статус своих броней
        if user.role == 'landlord' and view.action == 'partial_update':
            return obj.listing.owner == user

        return False
