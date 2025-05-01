#!/bin/bash

# Exit on any error
set -e

# Default values
IMAGE_NAME="smart-legal-assistance-backend"
TAG="latest"
DOCKER_HUB_USERNAME=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -u|--username)
      DOCKER_HUB_USERNAME="$2"
      shift 2
      ;;
    -t|--tag)
      TAG="$2"
      shift 2
      ;;
    *)
      echo "Unknown option: $1"
      exit 1
      ;;
  esac
done

# Check if username is provided
if [ -z "$DOCKER_HUB_USERNAME" ]; then
  echo "Error: Docker Hub username is required"
  echo "Usage: $0 -u <username> [-t <tag>]"
  exit 1
fi

# Build Docker image
echo "Building Docker image: $IMAGE_NAME:$TAG"
docker build -t $IMAGE_NAME:$TAG .

# Tag image with Docker Hub username
FULL_IMAGE_NAME="$DOCKER_HUB_USERNAME/$IMAGE_NAME:$TAG"
echo "Tagging image as: $FULL_IMAGE_NAME"
docker tag $IMAGE_NAME:$TAG $FULL_IMAGE_NAME

# Login to Docker Hub
echo "Logging in to Docker Hub (you will be prompted for credentials)"
docker login

# Push image to Docker Hub
echo "Pushing image to Docker Hub: $FULL_IMAGE_NAME"
docker push $FULL_IMAGE_NAME

echo "Successfully built and pushed $FULL_IMAGE_NAME"
echo ""
echo "To deploy to render.com:"
echo "1. Go to render.com and create a new Web Service"
echo "2. Select 'Deploy an existing image from a registry'"
echo "3. Enter the image URL: $FULL_IMAGE_NAME"
echo "4. Set environment variables as defined in render.yaml"
echo "5. Set the port to 8000"
echo "6. Create the service"
echo ""
echo "Image URL to use in render.com: $FULL_IMAGE_NAME" 