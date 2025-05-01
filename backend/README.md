# Smart Legal Assistance Platform - Backend

This repository contains the backend code for the Smart Legal Assistance Platform, a platform connecting clients with legal professionals.

## Running Locally

1. **Clone this repository:**  
   * Clone this repository to your local machine and open the folder.

2. **Set up environment variables:**
   * Copy `.env.example` to `.env` and configure the required environment variables.

3. **Install dependencies:**
   ```
   pip install -r requirements.txt
   ```

4. **Apply migrations:**
   ```
   python manage.py migrate
   ```

5. **Create an admin user:**
   ```
   python manage.py create_admin
   ```
   Or specify the credentials directly:
   ```
   python manage.py create_admin --email admin@example.com --password securepassword
   ```

   Default admin credentials for testing (DO NOT USE IN PRODUCTION):
   - Email: admin@legalassistance.com
   - Password: admin123

6. **Run the development server:**
   ```
   python manage.py runserver
   ```

## API Documentation

Once the backend server is running, API documentation is available at:

- Swagger UI: `http://localhost:8000/swagger/`
- ReDoc: `http://localhost:8000/redoc/`

## Features

- User authentication and authorization
- Attorney profiles and specialties
- Client case management
- Document generation
- Legal chatbot assistance
- Appointment scheduling
- Administrative dashboard

## Technologies Used

- Django REST Framework
- PostgreSQL / SQLite
- JWT Authentication
- Celery for background tasks
- Docker for containerization

## License

This project is licensed under the MIT License - see the LICENSE file for details. 