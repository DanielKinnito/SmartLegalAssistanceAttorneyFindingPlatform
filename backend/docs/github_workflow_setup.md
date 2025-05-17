# Setting Up GitHub Workflow for Automatic Docker Builds

This guide explains how to set up the GitHub workflow that automatically builds and pushes Docker images for the Smart Legal Assistance Platform backend.

## Prerequisites

1. A GitHub repository with your code
2. A DockerHub account
3. A Render account (if using Render for deployment)

## Step 1: Create a DockerHub Access Token

1. Log in to [DockerHub](https://hub.docker.com/)
2. Click on your username in the top-right corner and select "Account Settings"
3. Navigate to the "Security" tab
4. Click "New Access Token"
5. Give your token a description (e.g., "GitHub Actions")
6. Select the appropriate permissions (at minimum: "Read & Write")
7. Click "Generate" and copy the token immediately (it won't be shown again)

## Step 2: Set Up GitHub Repository Secrets

1. Go to your GitHub repository
2. Navigate to "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Add the following secrets:

   - Name: `DOCKERHUB_USERNAME`
     Value: Your DockerHub username
   
   - Name: `DOCKERHUB_TOKEN`
     Value: The access token generated in Step 1
   
   - Name: `RENDER_DEPLOY_HOOK` (if using Render)
     Value: The webhook URL from your Render service

## Step 3: Get the Render Deploy Hook (If Using Render)

1. Log in to [Render](https://render.com/)
2. Navigate to your service
3. Go to the "Settings" tab
4. Scroll down to "Deploy Hooks"
5. Click "Add Deploy Hook" if you don't already have one
6. Copy the generated URL

## Step 4: Push to Main Branch

The workflow is triggered automatically when you push changes to the main branch that include modifications to:
- Python files (*.py)
- requirements.txt
- Dockerfile
- docker-compose.yml

## Checking Workflow Status

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. You should see your workflow runs listed
4. Click on a run to see detailed logs and status

## Troubleshooting

### Workflow Not Triggering

- Check that you've pushed to the main branch
- Ensure that you've modified at least one of the files specified in the workflow's `paths` section
- Verify that the workflow file exists at `.github/workflows/docker-build.yml`

### Workflow Failing

- Check the detailed error logs in the GitHub Actions tab
- Verify that your secrets are correctly set up
- Ensure your Dockerfile builds successfully locally
- Make sure your DockerHub account has permission to push to the repository

### Deployment Not Updating

- Verify the Render deploy hook is correct
- Check Render logs for any deployment issues 