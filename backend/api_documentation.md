# Authentication API Documentation

This document outlines the authentication API endpoints for the Smart Legal Assistance platform.

## Base URL

All URLs referenced in this documentation have the following base:

```
http://localhost:8000/api/
```

## Authentication Endpoints

### Register User

Creates a new user account.

- **URL**: `users/`
- **Method**: `POST`
- **Auth required**: No
- **Permissions required**: None

**Request Body**:

```json
{
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "password": "securepassword123",
  "password_confirm": "securepassword123",
  "user_type": "CLIENT",
  "phone_number": "+251912345678"
}
```

Note: `user_type` must be one of: `CLIENT`, `ATTORNEY`, or `ADMIN`.

**Success Response**:

- **Code**: 201 Created
- **Content example**:

```json
{
  "user": {
    "id": "uuid-string",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "user_type": "CLIENT",
    "phone_number": "+251912345678",
    "profile_image": null,
    "date_joined": "2023-04-13T18:13:00.000000Z",
    "last_login": "2023-04-13T18:13:00.000000Z",
    "is_active": true,
    "mfa_enabled": false
  },
  "refresh": "eyJ0eXAi...refreshtoken",
  "access": "eyJ0eXAi...accesstoken"
}
```

**Error Response**:

- **Code**: 400 Bad Request
- **Content example**:

```json
{
  "email": ["This field is required."],
  "password": ["Password fields didn't match."]
}
```

### Login

Authenticates a user and returns JWT tokens.

- **URL**: `users/token/`
- **Method**: `POST`
- **Auth required**: No
- **Permissions required**: None

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "securepassword123"
}
```

**Success Response**:

- **Code**: 200 OK
- **Content example**:

```json
{
  "refresh": "eyJ0eXAi...refreshtoken",
  "access": "eyJ0eXAi...accesstoken"
}
```

**Error Response**:

- **Code**: 401 Unauthorized
- **Content example**:

```json
{
  "detail": "No active account found with the given credentials"
}
```

### Refresh Token

Gets a new access token using a refresh token.

- **URL**: `users/token/refresh/`
- **Method**: `POST`
- **Auth required**: No
- **Permissions required**: None

**Request Body**:

```json
{
  "refresh": "eyJ0eXAi...refreshtoken"
}
```

**Success Response**:

- **Code**: 200 OK
- **Content example**:

```json
{
  "access": "eyJ0eXAi...newaccesstoken"
}
```

**Error Response**:

- **Code**: 401 Unauthorized
- **Content example**:

```json
{
  "detail": "Token is invalid or expired",
  "code": "token_not_valid"
}
```

### Logout

Blacklists the refresh token, effectively logging out the user.

- **URL**: `users/logout/`
- **Method**: `POST`
- **Auth required**: Yes (Bearer Token)
- **Permissions required**: Authenticated user

**Request Headers**:

```
Authorization: Bearer eyJ0eXAi...accesstoken
```

**Request Body**:

```json
{
  "refresh": "eyJ0eXAi...refreshtoken"
}
```

**Success Response**:

- **Code**: 200 OK
- **Content example**:

```json
{
  "detail": "Successfully logged out."
}
```

**Error Response**:

- **Code**: 400 Bad Request
- **Content example**:

```json
{
  "detail": "Refresh token is required."
}
```

### Get Current User Profile

Retrieves the profile of the currently authenticated user.

- **URL**: `users/me/`
- **Method**: `GET`
- **Auth required**: Yes (Bearer Token)
- **Permissions required**: Authenticated user

**Request Headers**:

```
Authorization: Bearer eyJ0eXAi...accesstoken
```

**Success Response**:

- **Code**: 200 OK
- **Content example**:

```json
{
  "id": "uuid-string",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "user_type": "CLIENT",
  "phone_number": "+251912345678",
  "profile_image": null,
  "date_joined": "2023-04-13T18:13:00.000000Z",
  "last_login": "2023-04-13T18:13:00.000000Z",
  "is_active": true,
  "mfa_enabled": false
}
```

**Error Response**:

- **Code**: 401 Unauthorized
- **Content example**:

```json
{
  "detail": "Authentication credentials were not provided."
}
```

### Change Password

Changes the password for the authenticated user.

- **URL**: `users/change_password/`
- **Method**: `POST`
- **Auth required**: Yes (Bearer Token)
- **Permissions required**: Authenticated user

**Request Headers**:

```
Authorization: Bearer eyJ0eXAi...accesstoken
```

**Request Body**:

```json
{
  "old_password": "oldpassword123",
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```

**Success Response**:

- **Code**: 200 OK
- **Content example**:

```json
{
  "detail": "Password changed successfully."
}
```

**Error Response**:

- **Code**: 400 Bad Request
- **Content example**:

```json
{
  "detail": "Old password is incorrect."
}
```

OR

```json
{
  "new_password": ["New password fields didn't match."]
}
```

### Toggle MFA

Toggles multi-factor authentication for the authenticated user.

- **URL**: `users/toggle_mfa/`
- **Method**: `POST`
- **Auth required**: Yes (Bearer Token)
- **Permissions required**: Authenticated user

**Request Headers**:

```
Authorization: Bearer eyJ0eXAi...accesstoken
```

**Success Response**:

- **Code**: 200 OK
- **Content example**:

```json
{
  "mfa_enabled": true
}
```

## Using Authentication in Requests

For all authenticated endpoints, include the access token in the Authorization header:

```
Authorization: Bearer eyJ0eXAi...accesstoken
```

The access token has a limited lifetime (configured to 5 hours by default). When it expires, use the refresh token to get a new access token via the `/api/users/token/refresh/` endpoint.

## Error Handling

All authentication errors will return appropriate HTTP status codes:

- 400 Bad Request: Invalid input
- 401 Unauthorized: Authentication failed
- 403 Forbidden: Permission denied
- 404 Not Found: Resource not found 