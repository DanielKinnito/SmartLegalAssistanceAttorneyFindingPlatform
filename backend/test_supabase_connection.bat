@echo off
echo Running Supabase Connection Test...
echo ==============================

:: Check if .env file exists
if not exist .env (
    echo Creating .env file from example...
    copy database\supabase\env.example .env
    echo.
    echo IMPORTANT: Please update the .env file with your actual credentials!
    echo Specifically, update the SUPABASE_KEY with your actual API key.
    echo.
    timeout /t 5
)

:: Install required packages
echo Installing required packages...
pip install -r database\supabase\requirements.txt

:: Run the test script
echo.
echo Running Supabase connection test...
python test_supabase_direct.py

echo.
echo Test completed.
echo.
echo For more database utilities, run:
echo   database\supabase\run_supabase_tests.bat
echo.

pause 