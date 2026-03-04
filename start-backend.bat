@echo off
echo ========================================
echo   YojanaSaathi Backend Starter
echo ========================================
echo.

REM Check if backend folder exists
if not exist "backend" (
    echo ERROR: backend folder not found!
    echo Please run this from the project root directory.
    pause
    exit /b 1
)

REM Check if .env file exists
if not exist "backend\.env" (
    echo WARNING: backend\.env file not found!
    echo.
    echo Creating .env file from .env.example...
    copy "backend\.env.example" "backend\.env"
    echo.
    echo IMPORTANT: Please edit backend\.env and set your MySQL password!
    echo Then run this script again.
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
    echo.
)

echo Starting backend server...
echo.
echo Backend will run on: http://localhost:3000
echo API endpoints: http://localhost:3000/api
echo.
echo Press Ctrl+C to stop the server
echo ========================================
echo.

cd backend
call npm run dev
