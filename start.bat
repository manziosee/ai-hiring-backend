@echo off
echo ========================================
echo    AI Hiring Platform - Quick Start
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo.

REM Check if .env exists
if not exist ".env" (
    echo 📝 Creating .env file from template...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
        echo ✅ .env file created
        echo ⚠️  Please edit .env file with your database and API keys
        echo.
    ) else (
        echo ❌ .env.example not found
        pause
        exit /b 1
    )
) else (
    echo ✅ .env file exists
)

REM Install dependencies
echo 📦 Installing dependencies...
npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ Failed to install root dependencies
    pause
    exit /b 1
)

echo 📦 Installing backend dependencies...
cd backend
npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo ❌ Failed to install backend dependencies
    pause
    exit /b 1
)

echo 🗄️  Generating Prisma client...
npm run prisma:generate
if %errorlevel% neq 0 (
    echo ❌ Failed to generate Prisma client
    echo ⚠️  Make sure your DATABASE_URL is configured in .env
    pause
    exit /b 1
)

cd ..

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📝 Next steps:
echo 1. Edit .env file with your database credentials
echo 2. Ensure PostgreSQL is running
echo 3. Run database migrations: cd backend ^&^& npm run prisma:migrate
echo 4. Start the application: npm run dev
echo.
echo 📖 For detailed instructions, see INSTALLATION.md
echo 🌐 API docs will be available at: http://localhost:3000/api
echo.
pause