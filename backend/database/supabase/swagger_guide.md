# Accessing Swagger UI API Documentation

The Smart Legal Assistance Platform provides a Swagger UI interface where you can view and test all available API endpoints.

## Viewing the API Documentation

Once your server is running, you can access the Swagger UI at one of the following URLs:

### Local Development

```
http://localhost:8000/api/swagger/
```

or the ReDoc version (alternative UI):

```
http://localhost:8000/api/redoc/
```

### Production Deployment

If deployed to a server like Render.com:

```
https://your-app-name.onrender.com/api/swagger/
```

## Using Swagger UI

1. Navigate to the Swagger UI URL
2. You'll see a list of all available API endpoints grouped by functionality
3. For protected endpoints (most of them), you'll need to authenticate:
   - Click the "Authorize" button at the top right
   - Enter your JWT token in the format: `Bearer your_jwt_token_here`
   - Click "Authorize" to save

## Authentication Flow

1. Use the `/api/token/` endpoint to obtain a JWT token (this doesn't require authentication)
2. Use the returned access token for all other endpoints
3. When the access token expires, use the refresh token with the `/api/token/refresh/` endpoint to get a new access token

## Troubleshooting

If you're getting 401 Unauthorized errors:
- Make sure you've added the `Bearer ` prefix before your token
- Check that your token hasn't expired
- Verify that you're using the access token, not the refresh token

If Swagger UI doesn't load:
- Make sure DEBUG is set to True in your local development settings
- Check that drf-yasg is in your INSTALLED_APPS
- Verify that the Swagger URL patterns are included in your urls.py 