# Docker Deployment Guide

This guide explains how to deploy the Smart Legal Assistance Platform using Docker and push to Docker Hub.

## Building and Pushing to Docker Hub

### Prerequisites

1. [Docker](https://docs.docker.com/get-docker/) installed on your machine
2. A [Docker Hub](https://hub.docker.com/) account

### Building and Pushing the Docker Image

1. **Login to Docker Hub**

   ```bash
   docker login
   ```

2. **Build the Docker Image**

   ```bash
   cd SmartLegalAssistanceBackend
   docker build -t yourusername/smart-legal-assistance-backend:latest .
   ```

3. **Push the Image to Docker Hub**

   ```bash
   docker push yourusername/smart-legal-assistance-backend:latest
   ```

   Replace `yourusername` with your Docker Hub username.

## Windows Script

For Windows users, you can use the included batch script:

```bash
cd SmartLegalAssistanceBackend
build_and_push.bat -u yourusername
```

## Linux/Mac Script

For Linux/Mac users, you can use the included shell script:

```bash
cd SmartLegalAssistanceBackend
chmod +x build_and_push.sh
./build_and_push.sh -u yourusername
```

## Deploying to Render.com

After pushing your image to Docker Hub, you can deploy it on Render.com:

1. Create a new Web Service on Render
2. Select "Deploy an existing image from a registry"
3. Enter the image URL: `yourusername/smart-legal-assistance-backend:latest`
4. Configure environment variables as specified in the `render.yaml` file
5. Set the port to 8000
6. Click "Create Web Service"

## Running Locally with Docker Compose

To run the complete application stack locally:

```bash
docker-compose up -d
```

This will start the following services:
- Web service (Django)
- PostgreSQL database
- Redis
- Celery worker
- Celery beat scheduler
- Nginx (serving static files and as a reverse proxy)

## Docker Compose Configuration

The `docker-compose.yml` file defines the following services:

1. **web**: The Django application
2. **db**: PostgreSQL database
3. **redis**: Redis for caching and Celery
4. **celery**: Celery worker for background tasks
5. **celery-beat**: Celery beat for scheduled tasks
6. **nginx**: Nginx for serving static files and as a reverse proxy

## Environmental Variables

Make sure to set up the proper environment variables before running the containers.
Copy the `.env.example` file to `.env` and update the values accordingly:

```bash
cp .env.example .env
```

## Troubleshooting

If you encounter any issues:

1. **Database Connection Issues**:
   - Check the database credentials in the `.env` file
   - Ensure the database service is running: `docker-compose ps`

2. **Static Files Not Loading**:
   - Make sure you've run `docker-compose exec web python manage.py collectstatic`

3. **Permission Issues**:
   - Check that volumes have the correct permissions

4. **Container Build Failures**:
   - Check the Dockerfile for any errors
   - Ensure all dependencies are correctly specified

## References

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Render.com Docker Deployment](https://render.com/docs/docker) 