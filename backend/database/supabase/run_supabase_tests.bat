@echo off
echo Supabase Database Connection Tools
echo ==============================

:: Check if .env file exists in the root directory
cd ..\..
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

:: Test the connection
echo.
echo Testing database connection...
python database\supabase\connect_supabase.py

:: Display available utilities
echo.
echo Available database utilities:
echo 1. List all tables
echo 2. Describe a table
echo 3. Query a table
echo 4. Export data
echo 5. Run custom SQL query
echo 6. Exit

:menu
echo.
set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    python database\supabase\supabase_utils.py list-tables
    goto menu
)

if "%choice%"=="2" (
    set /p table="Enter table name: "
    python database\supabase\supabase_utils.py describe %table%
    goto menu
)

if "%choice%"=="3" (
    set /p table="Enter table name: "
    set /p limit="Enter row limit (default 10): "
    if "%limit%"=="" set limit=10
    set /p where="Enter WHERE clause (optional): "
    set /p order="Enter ORDER BY clause (optional): "
    
    if "%where%"=="" (
        if "%order%"=="" (
            python database\supabase\supabase_utils.py query %table% --limit %limit%
        ) else (
            python database\supabase\supabase_utils.py query %table% --limit %limit% --order-by "%order%"
        )
    ) else (
        if "%order%"=="" (
            python database\supabase\supabase_utils.py query %table% --limit %limit% --where "%where%"
        ) else (
            python database\supabase\supabase_utils.py query %table% --limit %limit% --where "%where%" --order-by "%order%"
        )
    )
    goto menu
)

if "%choice%"=="4" (
    set /p table="Enter table name (leave empty for all tables): "
    set /p format="Enter format (json/csv, default json): "
    if "%format%"=="" set format=json
    
    if "%table%"=="" (
        python database\supabase\supabase_utils.py export --format %format%
    ) else (
        python database\supabase\supabase_utils.py export --table %table% --format %format%
    )
    goto menu
)

if "%choice%"=="5" (
    set /p query="Enter SQL query: "
    python database\supabase\supabase_utils.py custom "%query%"
    goto menu
)

if "%choice%"=="6" (
    echo Exiting...
    exit /b 0
)

echo Invalid choice. Please try again.
goto menu 