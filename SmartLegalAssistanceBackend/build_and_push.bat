@echo off
setlocal enabledelayedexpansion

:: Default values
set IMAGE_NAME=smart-legal-assistance-backend
set TAG=latest
set DOCKER_HUB_USERNAME=

:: Parse command line arguments
:parse_args
if "%~1"=="" goto check_args
if "%~1"=="-u" (
    set DOCKER_HUB_USERNAME=%~2
    shift
    shift
    goto parse_args
)
if "%~1"=="--username" (
    set DOCKER_HUB_USERNAME=%~2
    shift
    shift
    goto parse_args
)
if "%~1"=="-t" (
    set TAG=%~2
    shift
    shift
    goto parse_args
)
if "%~1"=="--tag" (
    set TAG=%~2
    shift
    shift
    goto parse_args
)
echo Unknown option: %~1
exit /b 1

:check_args
:: Check if username is provided
if "%DOCKER_HUB_USERNAME%"=="" (
    echo Error: Docker Hub username is required
    echo Usage: %0 -u ^<username^> [-t ^<tag^>]
    exit /b 1
)

:: Build Docker image
echo Building Docker image: %IMAGE_NAME%:%TAG%
docker build -t %IMAGE_NAME%:%TAG% .
if %ERRORLEVEL% neq 0 (
    echo Failed to build Docker image
    exit /b 1
)

:: Tag image with Docker Hub username
set FULL_IMAGE_NAME=%DOCKER_HUB_USERNAME%/%IMAGE_NAME%:%TAG%
echo Tagging image as: %FULL_IMAGE_NAME%
docker tag %IMAGE_NAME%:%TAG% %FULL_IMAGE_NAME%
if %ERRORLEVEL% neq 0 (
    echo Failed to tag Docker image
    exit /b 1
)

:: Login to Docker Hub
echo Logging in to Docker Hub (you will be prompted for credentials)
docker login
if %ERRORLEVEL% neq 0 (
    echo Failed to login to Docker Hub
    exit /b 1
)

:: Push image to Docker Hub
echo Pushing image to Docker Hub: %FULL_IMAGE_NAME%
docker push %FULL_IMAGE_NAME%
if %ERRORLEVEL% neq 0 (
    echo Failed to push Docker image
    exit /b 1
)

echo Successfully built and pushed %FULL_IMAGE_NAME%
echo.
echo To deploy to render.com:
echo 1. Go to render.com and create a new Web Service
echo 2. Select 'Deploy an existing image from a registry'
echo 3. Enter the image URL: %FULL_IMAGE_NAME%
echo 4. Set environment variables as defined in render.yaml
echo 5. Set the port to 8000
echo 6. Create the service
echo.
echo Image URL to use in render.com: %FULL_IMAGE_NAME%

endlocal 