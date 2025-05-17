@echo off
echo Setting up for Supabase...

:: Copy the env file if it doesn't exist
if not exist .env (
    echo Creating .env file from example...
    copy database\supabase\env.example .env
    echo Please update the .env file with your Supabase API key!
)

:: Run the server with Supabase settings
echo Starting Django server with Supabase configuration...
python manage.py runserver --settings=config.settings.supabase 