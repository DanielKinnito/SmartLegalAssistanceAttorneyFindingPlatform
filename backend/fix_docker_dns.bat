@echo off
echo Fixing Docker DNS issues for registry-1.docker.io

:: Ensure running as administrator
>nul 2>&1 "%SYSTEMROOT%\system32\cacls.exe" "%SYSTEMROOT%\system32\config\system"
if '%errorlevel%' NEQ '0' (
    echo Administrator privileges required
    echo Please run as administrator and try again
    pause
    exit /b
)

:: Path to hosts file
set HOSTS_FILE=%WINDIR%\System32\drivers\etc\hosts

:: Backup hosts file
echo Creating backup of hosts file...
copy "%HOSTS_FILE%" "%HOSTS_FILE%.bak"

:: Remove any existing registry-1.docker.io entries
echo Cleaning existing registry-1.docker.io entries...
powershell -Command "(Get-Content '%HOSTS_FILE%') | Where-Object { $_ -notmatch 'registry-1.docker.io' } | Set-Content '%HOSTS_FILE%'"

:: Add new entries
echo Adding registry-1.docker.io entries to hosts file...
echo # Docker registry IPv4 addresses >> "%HOSTS_FILE%"
echo 44.205.64.79 registry-1.docker.io >> "%HOSTS_FILE%"
echo 34.205.13.154 registry-1.docker.io >> "%HOSTS_FILE%"
echo 3.216.34.172 registry-1.docker.io >> "%HOSTS_FILE%"

:: Clear Docker cache
echo Clearing Docker cache...
docker system prune -f

echo Docker DNS fix completed.
echo Try building your image again with: docker build -t auth-service ./auth-service
pause 