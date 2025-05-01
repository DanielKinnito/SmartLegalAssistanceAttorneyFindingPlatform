# Smart Legal Assistance Platform - Backend

This is the backend component of the Smart Legal Assistance Platform, a platform designed to connect clients with attorneys and provide legal document generation services.

## Architecture

The backend is structured as a microservices architecture with the following components:

1. **API Gateway**: A FastAPI service that routes requests to the appropriate microservice.
2. **Auth Service**: Handles user authentication and authorization.
3. **Attorney Service**: Manages attorney profiles, specialties, and credentials.
4. **Client Service**: Manages client profiles and legal requests.
5. **Document Service**: Handles document template management and generation.
6. **Shared**: Common code and utilities used across services.

```
backend/
├── api-gateway/     # Gateway service for routing requests
├── auth-service/    # Authentication and user management
├── attorney-service/# Attorney profile management
├── client-service/  # Client profile management
├── document-service/# Document generation
├── shared/          # Shared utilities
├── docker/          # Docker-related files
└── docker-compose.yml
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

2. Run with Docker Compose:

```bash
docker-compose up
```

This will start all services, including a PostgreSQL database.

3. Alternatively, you can run individual services for development:

```bash
# Auth Service
cd auth-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver 8001
```

### API Documentation

When running locally, API documentation is available at:

- API Gateway: http://localhost:8000/docs
- Auth Service: http://localhost:8001/api/schema/swagger-ui/
- Attorney Service: http://localhost:8002/api/schema/swagger-ui/
- Client Service: http://localhost:8003/api/schema/swagger-ui/
- Document Service: http://localhost:8004/api/schema/swagger-ui/

## Deployment

The application is configured for deployment on Render.com using the `render.yaml` file.

To deploy:

1. Push your code to GitHub
2. Create a new Render Blueprint instance
3. Point it to your repository
4. Render will automatically set up all services and databases

## Environment Variables

Each service has its own set of environment variables. See the `docker-compose.yml` file for the complete list.

## License

This project is licensed under the MIT License - see the LICENSE file for details. 