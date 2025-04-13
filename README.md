# Smart Legal Assistance Platform

A comprehensive platform connecting clients with attorneys and providing AI-powered legal assistance.

## Features

- **Attorney Matching**: Find attorneys based on specialization, location, and availability
- **Client Portal**: Manage cases, documents, and communications
- **AI Legal Chatbot**: Get preliminary legal guidance and information
- **Document Generation**: Create legal documents using customizable templates
- **Secure Authentication**: Multi-factor authentication and OAuth integration
- **Activity Tracking**: Monitor user activities for security and compliance

## Project Structure

The project consists of two main components:

- **Backend API**: Django REST Framework application
- **Frontend**: React-based user interface

## Tech Stack

### Backend
- Django 4.2
- Django REST Framework
- PostgreSQL
- Redis & Celery
- JWT Authentication
- Swagger/OpenAPI Documentation

### Frontend
- React
- Redux for state management
- Material-UI components
- Responsive design

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 16+
- PostgreSQL 13+
- Redis 6+

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/SmartLegalAssistancePlatform.git
   cd SmartLegalAssistancePlatform
   ```

2. Set up the backend:
   ```
   cd SmartLegalAssistanceBackend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the variables according to the [Environment Variables](#environment-variables) section

4. Initialize the database:
   ```
   python manage.py migrate
   python manage.py createsuperuser
   ```

5. Set up the frontend:
   ```
   cd ../frontend
   npm install
   ```

6. Start the development servers:
   - Backend: `python manage.py runserver`
   - Frontend: `npm run dev`

## Environment Variables

See the [Environment Setup Guide](./docs/ENVIRONMENT_SETUP.md) for detailed instructions on obtaining and configuring all required environment variables.

## API Documentation

Once the backend server is running, API documentation is available at:

- Swagger UI: `http://localhost:8000/swagger/`
- ReDoc: `http://localhost:8000/redoc/`

## Database Schema

Database schema documentation is available in the [database](./database) directory.

## Contributing

Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details. 