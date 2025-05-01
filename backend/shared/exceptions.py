"""
Common exception classes for the Smart Legal Assistance Platform.
"""
from typing import Dict, Any, Optional

class ServiceError(Exception):
    """Base class for service-specific errors."""
    def __init__(
        self,
        message: str,
        code: str = "service_error",
        status_code: int = 500,
        detail: Optional[Dict[str, Any]] = None
    ):
        self.message = message
        self.code = code
        self.status_code = status_code
        self.detail = detail or {}
        super().__init__(self.message)


class AuthenticationError(ServiceError):
    """Raised when authentication fails."""
    def __init__(
        self,
        message: str = "Authentication failed",
        code: str = "authentication_error",
        status_code: int = 401,
        detail: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, code, status_code, detail)


class AuthorizationError(ServiceError):
    """Raised when authorization fails."""
    def __init__(
        self,
        message: str = "Not authorized",
        code: str = "authorization_error",
        status_code: int = 403,
        detail: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, code, status_code, detail)


class ResourceNotFoundError(ServiceError):
    """Raised when a requested resource is not found."""
    def __init__(
        self,
        message: str = "Resource not found",
        code: str = "not_found",
        status_code: int = 404,
        detail: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, code, status_code, detail)


class ValidationError(ServiceError):
    """Raised when input validation fails."""
    def __init__(
        self,
        message: str = "Validation error",
        code: str = "validation_error",
        status_code: int = 400,
        detail: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, code, status_code, detail)


class DatabaseError(ServiceError):
    """Raised when a database operation fails."""
    def __init__(
        self,
        message: str = "Database error",
        code: str = "database_error",
        status_code: int = 500,
        detail: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, code, status_code, detail)


class ExternalServiceError(ServiceError):
    """Raised when communication with an external service fails."""
    def __init__(
        self,
        message: str = "External service error",
        code: str = "external_service_error",
        status_code: int = 503,
        detail: Optional[Dict[str, Any]] = None
    ):
        super().__init__(message, code, status_code, detail) 