from rest_framework import permissions


class IsClient(permissions.BasePermission):
    """
    Permission to only allow clients to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'CLIENT'


class IsAttorney(permissions.BasePermission):
    """
    Permission to only allow attorneys to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'ATTORNEY'


class IsAdmin(permissions.BasePermission):
    """
    Permission to only allow admin users to access the view.
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.user_type == 'ADMIN'


class IsClientOwner(permissions.BasePermission):
    """
    Permission to only allow clients to view/edit their own resources.
    """
    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the client profile
        if hasattr(obj, 'user'):
            return obj.user == request.user
        # Check if the object has a client related field
        if hasattr(obj, 'client'):
            return obj.client.user == request.user
        return False


class IsAttorneyOwner(permissions.BasePermission):
    """
    Permission to only allow attorneys to view/edit their own resources.
    """
    def has_object_permission(self, request, view, obj):
        # Check if the user is the owner of the attorney profile
        if hasattr(obj, 'user'):
            return obj.user == request.user
        # Check if the object has an attorney related field
        if hasattr(obj, 'attorney'):
            return obj.attorney.user == request.user
        return False


class IsOwnerOrAdmin(permissions.BasePermission):
    """
    Permission to only allow owners of an object or admins to view/edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Allow admin users
        if request.user.user_type == 'ADMIN' or request.user.is_superuser:
            return True
            
        # Check user relation based on the object type
        if hasattr(obj, 'user'):
            return obj.user == request.user
        if hasattr(obj, 'client') and hasattr(obj.client, 'user'):
            return obj.client.user == request.user
        if hasattr(obj, 'attorney') and hasattr(obj.attorney, 'user'):
            return obj.attorney.user == request.user
        
        return False 