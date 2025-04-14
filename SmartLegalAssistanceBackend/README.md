# Smart Legal Assistance - Backend

This is the backend API for the Smart Legal Assistance project, a platform that connects clients with attorneys for legal services.

## Technology Stack

- **Framework:** Django & Django REST Framework
- **Database:** PostgreSQL
- **Cache/Message Broker:** Redis
- **Authentication:** JWT (JSON Web Tokens) & OAuth 2.0
- **Containerization:** Docker & Docker Compose
- **Task Queue:** Celery

## Project Structure

This project follows a modular architecture with the following key components:

- **Users:** Authentication and user management
- **Attorneys:** Attorney profiles, credentials, and availability
- **Clients:** Client profiles and legal requests
- **Admin:** Administrative functions and platform monitoring
- **Chatbot:** AI-powered legal assistance chatbot
- **Document Generation:** Legal document templates and generation

## Setup Instructions

### Prerequisites

- Docker and Docker Compose
- Git

### Installation

1. Clone the repository:
   ```
   git clone <repository_url>
   cd SmartLegalAssistanceBackend
   ```

2. Create a `.env` file based on `.env.example`:
   ```
   cp .env.example .env
   ```
   
3. Update the environment variables in the `.env` file as needed.

4. Build and start the Docker containers:
   ```
   docker-compose up -d --build
   ```

5. Create a superuser:
   ```
   docker-compose exec web python manage.py createsuperuser
   ```

6. Apply migrations:
   ```
   docker-compose exec web python manage.py migrate
   ```

7. Collect static files:
   ```
   docker-compose exec web python manage.py collectstatic --no-input
   ```

### Development

- Run the development server:
  ```
  docker-compose up
  ```

- Access the Django admin at `http://localhost:8000/admin/`
- Access the API at `http://localhost:8000/api/`

### Testing

Run tests with:
```
docker-compose exec web python manage.py test
```

## API Documentation

API documentation is available at `/api/docs/` when the server is running.

## Contributing

1. Create a feature branch from development
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the [MIT License](LICENSE). 