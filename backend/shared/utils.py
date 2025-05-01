"""
Common utility functions for the Smart Legal Assistance Platform.
"""
import uuid
import re
import jwt
from datetime import datetime, timedelta
from typing import Dict, Any, Optional

def validate_uuid(uuid_string: str) -> bool:
    """
    Validate if a string is a valid UUID.
    """
    try:
        uuid_obj = uuid.UUID(uuid_string)
        return str(uuid_obj) == uuid_string
    except (ValueError, AttributeError):
        return False

def validate_email(email: str) -> bool:
    """
    Validate if a string is a valid email.
    """
    email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(email_regex, email))

def validate_phone_number(phone: str) -> bool:
    """
    Validate if a string is a valid phone number.
    """
    # Simple phone validation (digits, spaces, dashes, parentheses)
    phone_regex = r'^[\d\s\-\(\)]+$'
    return bool(re.match(phone_regex, phone))

def create_jwt_token(
    user_id: str,
    secret_key: str,
    expires_in_minutes: int = 60,
    additional_claims: Optional[Dict[str, Any]] = None
) -> str:
    """
    Create a JWT token with the given user_id and expiration time.
    """
    now = datetime.utcnow()
    payload = {
        'sub': user_id,
        'iat': now,
        'exp': now + timedelta(minutes=expires_in_minutes)
    }
    
    if additional_claims:
        payload.update(additional_claims)
    
    token = jwt.encode(payload, secret_key, algorithm='HS256')
    return token

def decode_jwt_token(token: str, secret_key: str) -> Dict[str, Any]:
    """
    Decode a JWT token and return the payload.
    """
    try:
        payload = jwt.decode(token, secret_key, algorithms=['HS256'])
        return payload
    except jwt.PyJWTError as e:
        raise ValueError(f"Invalid token: {str(e)}")

def format_address(
    street: str,
    city: str,
    state: str,
    postal_code: str,
    country: str = "USA"
) -> str:
    """
    Format an address from components.
    """
    return f"{street}, {city}, {state} {postal_code}, {country}" 