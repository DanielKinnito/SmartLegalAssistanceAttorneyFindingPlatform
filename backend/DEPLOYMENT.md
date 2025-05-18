# Deployment Guide for Smart Legal Assistance Platform

This guide will help you deploy the Smart Legal Assistance backend application using Docker.

## Prerequisites

- Docker and Docker Compose installed on your server
- Docker Hub account (for pushing the image)
- Basic knowledge of Docker and server administration
- Domain name (optional, but recommended for production)

## Deployment Steps

### 1. Build and Push the Docker Image

#### Option 1: Using the provided scripts

For Windows:
```bash
# Run the Windows batch script
docker-publish.bat
```

For Linux/Mac:
```bash
# Make the script executable
chmod +x docker-publish.sh

# Run the script
./docker-publish.sh
```

The script will guide you through building and pushing the image to Docker Hub.

#### Option 2: Manual build and push

```bash
# Build the image
docker build -t kinnito/smart-legal-assistance:latest .

# Log in to Docker Hub
docker login

# Push the image
docker push kinnito/smart-legal-assistance:latest
```

### 2. Prepare Environment Variables

Copy the sample environment file and edit it with your values:

```bash
cp env.sample .env
```

Edit the `.env` file and set:
- Strong `SECRET_KEY`
- Your domain in `ALLOWED_HOSTS` and `CORS_ALLOWED_ORIGINS`
- Database credentials
- Email settings
- Admin credentials
- Docker image name (the one you pushed to Docker Hub)

### 3. Create Required Directories

```bash
mkdir -p nginx
```

### 4. Deploy with Docker Compose

```bash
# Start the services
docker-compose -f docker-compose.production.yml up -d
```

### 5. Verify Deployment

Your application should now be running. You can check the status with:

```bash
docker-compose -f docker-compose.production.yml ps
```

You should be able to access the application at:
- http://your-server-ip (if using Nginx)
- http://your-server-ip:8000 (if accessing directly)

## Maintenance

### Updating the Application

```bash
# Pull the latest changes
git pull

# Rebuild and restart the services
docker-compose -f docker-compose.production.yml up -d --build
```

### Viewing Logs

```bash
# View logs from all services
docker-compose -f docker-compose.production.yml logs

# View logs from a specific service (e.g., web)
docker-compose -f docker-compose.production.yml logs web
```

### Backup Database

```bash
# Create a database backup
docker-compose -f docker-compose.production.yml exec -T db pg_dump -U postgres legal_assistance > backup_$(date +%Y%m%d_%H%M%S).sql
```

## Troubleshooting

### Checking Container Status
```bash
docker-compose -f docker-compose.production.yml ps
```

### Checking Application Logs
```bash
docker-compose -f docker-compose.production.yml logs --tail=100 web
```

### Database Migration Issues
If you encounter migration issues:
```bash
docker-compose -f docker-compose.production.yml exec web python manage.py showmigrations
docker-compose -f docker-compose.production.yml exec web python manage.py migrate
```

### Static Files
If static files aren't being served correctly:
```bash
docker-compose -f docker-compose.production.yml exec web python manage.py collectstatic --noinput
```

## Security Recommendations

1. Always use strong passwords and keep them secure
2. Use HTTPS in production (consider setting up Let's Encrypt)
3. Regularly update dependencies and Docker images
4. Enable database backups
5. Monitor application logs for suspicious activity 
