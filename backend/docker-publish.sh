#!/bin/bash

# Set default values
DEFAULT_USERNAME=$(whoami)
DEFAULT_REPO="smart-legal-assistance"
DEFAULT_TAG="latest"

# Get inputs or use defaults
read -p "Enter Docker Hub username [$DEFAULT_USERNAME]: " DOCKER_USERNAME
DOCKER_USERNAME=${DOCKER_USERNAME:-$DEFAULT_USERNAME}

read -p "Enter repository name [$DEFAULT_REPO]: " REPO_NAME
REPO_NAME=${REPO_NAME:-$DEFAULT_REPO}

read -p "Enter image tag [$DEFAULT_TAG]: " IMAGE_TAG
IMAGE_TAG=${IMAGE_TAG:-$DEFAULT_TAG}

# Full image name
IMAGE_NAME="$DOCKER_USERNAME/$REPO_NAME:$IMAGE_TAG"

echo "Building image: $IMAGE_NAME"

# Build the Docker image
docker build -t $IMAGE_NAME .

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful!"
    
    # Ask to push to Docker Hub
    read -p "Push to Docker Hub? (y/n): " PUSH_CHOICE
    
    if [ "$PUSH_CHOICE" = "y" ] || [ "$PUSH_CHOICE" = "Y" ]; then
        echo "Logging in to Docker Hub..."
        docker login
        
        if [ $? -eq 0 ]; then
            echo "Pushing $IMAGE_NAME to Docker Hub..."
            docker push $IMAGE_NAME
            
            if [ $? -eq 0 ]; then
                echo "Image pushed successfully!"
                echo ""
                echo "To deploy, use the following image: $IMAGE_NAME"
                echo "Make sure to set DOCKER_IMAGE_NAME=$IMAGE_NAME in your environment variables"
            else
                echo "Error pushing image."
            fi
        else
            echo "Docker Hub login failed."
        fi
    else
        echo "Skipping push to Docker Hub."
        echo "You can push manually with: docker push $IMAGE_NAME"
    fi
else
    echo "Build failed!"
fi 