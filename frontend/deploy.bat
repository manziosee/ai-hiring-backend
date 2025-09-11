@echo off
echo Deploying AI Hiring Frontend to Fly.io...

echo.
echo Step 1: Installing Fly CLI (if not installed)
where flyctl >nul 2>nul
if %errorlevel% neq 0 (
    echo Fly CLI not found. Please install it first:
    echo https://fly.io/docs/hands-on/install-flyctl/
    pause
    exit /b 1
)

echo.
echo Step 2: Logging into Fly.io
flyctl auth login

echo.
echo Step 3: Creating/Launching the app
flyctl launch --no-deploy

echo.
echo Step 4: Deploying the application
flyctl deploy

echo.
echo Step 5: Opening the deployed app
flyctl open

echo.
echo Deployment complete!
pause