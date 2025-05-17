@echo off
setlocal

rem Set default values
set "DEFAULT_USERNAME=%USERNAME%"
set "DEFAULT_REPO=smart-legal-assistance"
set "DEFAULT_TAG=latest"

rem Get inputs or use defaults
set /p DOCKER_USERNAME=Enter Docker Hub username [%DEFAULT_USERNAME%]: 
if "%DOCKER_USERNAME%"=="" set "DOCKER_USERNAME=%DEFAULT_USERNAME%"

set /p REPO_NAME=Enter repository name [%DEFAULT_REPO%]: 
if "%REPO_NAME%"=="" set "REPO_NAME=%DEFAULT_REPO%"

set /p IMAGE_TAG=Enter image tag [%DEFAULT_TAG%]: 
if "%IMAGE_TAG%"=="" set "IMAGE_TAG=%DEFAULT_TAG%"

rem Full image name
set "IMAGE_NAME=%DOCKER_USERNAME%/%REPO_NAME%:%IMAGE_TAG%"

echo Building image: %IMAGE_NAME%

rem Build the Docker image
docker build -t %IMAGE_NAME% .

rem Check if build was successful
if %ERRORLEVEL% equ 0 (
    echo Build successful!
    
    rem Ask to push to Docker Hub
    set /p PUSH_CHOICE=Push to Docker Hub? (y/n): 
    
    if /i "%PUSH_CHOICE%"=="y" (
        echo Logging in to Docker Hub...
        docker login
        
        if %ERRORLEVEL% equ 0 (
            echo Pushing %IMAGE_NAME% to Docker Hub...
            docker push %IMAGE_NAME%
            
            if %ERRORLEVEL% equ 0 (
                echo Image pushed successfully!
                echo.
                echo To deploy, use the following image: %IMAGE_NAME%
                echo Make sure to set DOCKER_IMAGE_NAME=%IMAGE_NAME% in your environment variables
            ) else (
                echo Error pushing image.
            )
        ) else (
            echo Docker Hub login failed.
        )
    ) else (
        echo Skipping push to Docker Hub.
        echo You can push manually with: docker push %IMAGE_NAME%
    )
) else (
    echo Build failed!
)

endlocal 