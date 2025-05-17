@echo off
echo Starting Django server with Supabase configuration...

:: First, try to find and kill any existing Django server process
echo Checking for existing Django server processes...
tasklist /fi "imagename eq python.exe" | find "python.exe" > nul
if %errorlevel% equ 0 (
    echo Found Python processes, attempting to stop any Django servers...
    for /f "tokens=2" %%a in ('tasklist /fi "imagename eq python.exe" ^| findstr /r "python.exe"') do (
        echo Stopping process %%a
        taskkill /PID %%a /F > nul 2>&1
    )
)

:: Run the database fix script to ensure clean setup
echo Running database fix script...
python fix_db_issue.py

:: Run the Django server with Supabase settings
echo Starting Django server...
python manage.py runserver --settings=config.settings.development_supabase 