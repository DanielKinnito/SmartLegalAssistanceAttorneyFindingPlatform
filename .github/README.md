# GitHub Workflows for Smart Legal Assistance Platform

This directory contains GitHub Actions workflows that automate various processes for the Smart Legal Assistance Platform.

## Workflows

### Docker Build and Push

**File:** `.github/workflows/docker-build.yml`

This workflow automatically builds and pushes Docker images for the backend whenever changes are made to Python files, requirements.txt, Dockerfile, or docker-compose.yml.

#### What it does:

1. Triggers on pushes to the main branch and pull requests to main branch
2. Builds the Docker image using the Dockerfile
3. Tags the image with both the commit SHA and 'latest'
4. Pushes the image to DockerHub (only for pushes to main, not for pull requests)
5. Runs basic tests to ensure the build is functional
6. Updates the deployment via Render webhook (if configured)

#### Required Secrets:

To use this workflow, you need to set up the following secrets in your GitHub repository:

- `DOCKERHUB_USERNAME`: Your DockerHub username
- `DOCKERHUB_TOKEN`: Your DockerHub access token (not your password)
- `RENDER_DEPLOY_HOOK`: The webhook URL provided by Render for automatic deployments

#### How to set up secrets:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add each of the required secrets

## Troubleshooting

If the workflow isn't working as expected:

1. Check that you've added all required secrets
2. Verify your DockerHub credentials are correct
3. Make sure your Dockerfile is valid and builds successfully locally
4. Check the GitHub Actions logs for any specific error messages 