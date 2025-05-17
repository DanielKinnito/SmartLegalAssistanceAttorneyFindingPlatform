# Smart Legal Assistance Platform - Backend

This is the backend component of the Smart Legal Assistance Platform, a platform designed to connect clients with attorneys and provide legal document generation services.

## Architecture

The backend is structured as a monolithic Django application with the following components:

1. **Authentication Service**: Handles user authentication and authorization for clients and attorneys.
2. **Attorney Service**: Manages attorney profiles, specialties, and credentials.
3. **Client Service**: Manages client profiles and legal requests.
4. **Document Service**: Handles document template management and generation.
5. **Chatbot Service**: Provides AI-powered legal assistance.

```
backend/
├── apps/
│   ├── users/           # Authentication and user management
│   ├── attorneys/       # Attorney profile management
│   ├── clients/         # Client profile management
│   ├── document_generation/ # Document generation
│   └── chatbot/         # AI-powered legal assistance
├── config/              # Project configuration
├── templates/           # HTML templates
├── static/             # Static files
├── docs/               # Documentation
└── docker/             # Docker-related files
```

## Development Setup

### Prerequisites

- Python 3.10+
- Docker and Docker Compose
- PostgreSQL (optional for local development)

### Local Development

1. Clone the repository:

```bash
git clone https://github.com/yourusername/smart-legal-assistance.git
cd smart-legal-assistance/backend
```

2. Create and activate a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run migrations:

```bash
python manage.py migrate
```

6. Create a superuser:

```bash
python manage.py createsuperuser
```

7. Run the development server:

```bash
python manage.py runserver
```

### Docker Development

1. Build and run with Docker Compose:

```bash
docker-compose up --build
```

This will start all services, including a PostgreSQL database.

## Authentication Service

The authentication service provides the following endpoints:

### Client Registration
- **URL**: `/api/auth/register/client/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "client@example.com",
    "password": "password123",
    "confirm_password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "phone_number": "+1234567890"
  }
  ```

### Attorney Registration
- **URL**: `/api/auth/register/attorney/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "attorney@example.com",
    "password": "password123",
    "confirm_password": "password123",
    "first_name": "Jane",
    "last_name": "Smith",
    "phone_number": "+1234567890",
    "bar_number": "BAR123456",
    "practice_areas": ["Family Law", "Criminal Law"],
    "years_of_experience": 5,
    "bio": "Experienced attorney specializing in family and criminal law."
  }
  ```

### Login
- **URL**: `/api/auth/login/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  ```

### Token Refresh
- **URL**: `/api/auth/refresh/`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "refresh": "your_refresh_token"
  }
  ```

### Logout
- **URL**: `/api/auth/logout/`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer your_access_token`
- **Body**:
  ```json
  {
    "refresh": "your_refresh_token"
  }
  ```

### Get Profile
- **URL**: `/api/auth/profile/`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer your_access_token`

### Change Password
- **URL**: `/api/auth/change-password/`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer your_access_token`
- **Body**:
  ```json
  {
    "old_password": "current_password",
    "new_password": "new_password",
    "confirm_password": "new_password"
  }
  ```

### Toggle MFA
- **URL**: `/api/auth/toggle-mfa/`
- **Method**: `POST`
- **Headers**: `Authorization: Bearer your_access_token`

## API Documentation

When running locally, API documentation is available at:

- Swagger UI: http://localhost:8000/api/schema/swagger-ui/
- ReDoc: http://localhost:8000/api/schema/redoc/

## Testing

Run the test suite:

```bash
python manage.py test
```

For Postman testing, import the collection from `docs/postman/Smart_Legal_Assistance_API.postman_collection.json`.

## Docker Workflow

The project uses GitHub Actions to automatically build and push Docker images to Docker Hub. The workflow:

1. Triggers on push to main branch and pull requests
2. Builds the Docker image using Buildx
3. Runs tests in the container
4. Pushes the image to Docker Hub (only on main branch)
5. Triggers deployment on Render.com (only on main branch)

To use this workflow:

1. Add the following secrets to your GitHub repository:
   - `DOCKERHUB_USERNAME`: Your Docker Hub username
   - `DOCKERHUB_TOKEN`: Your Docker Hub access token
   - `RENDER_DEPLOY_HOOK`: Your Render.com deploy webhook URL

2. Push to the main branch to trigger the workflow

## Deployment

The application is configured for deployment on Render.com using the `render.yaml` file.

To deploy:

1. Push your code to GitHub
2. Create a new Render Blueprint instance
3. Point it to your repository
4. Render will automatically set up all services and databases

## Environment Variables

The following environment variables are required:

```
DEBUG=False
SECRET_KEY=your_secret_key
DATABASE_URL=postgres://user:password@host:port/dbname
ALLOWED_HOSTS=your-domain.com
CORS_ALLOWED_ORIGINS=https://your-frontend-domain.com
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Deployment

### GitHub Workflow for Automatic Docker Builds

This project uses GitHub Actions to automatically build and push Docker images whenever changes are made to the codebase. The workflow is configured to:

1. Trigger on pushes to the main branch that modify Python files, requirements.txt, Dockerfile, or docker-compose.yml
2. Build the Docker image and tag it with both the commit SHA and 'latest'
3. Push the image to DockerHub
4. Optionally deploy to Render using a webhook

For detailed setup instructions, see [GitHub Workflow Setup Guide](docs/github_workflow_setup.md).

### Manual Deployment

1. Push your code to GitHub
2. Create a new Render Blueprint instance
3. Point it to your repository
4. Render will automatically set up all services and databases 