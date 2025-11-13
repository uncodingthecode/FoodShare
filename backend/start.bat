@echo off
REM FoodShare Backend Startup Script for Windows
REM This script helps you start the backend server easily

echo ============================================================
echo.
echo    FoodShare Backend Server
echo.
echo ============================================================
echo.

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM Check if .env exists
if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo .env file created. Please update it with your settings.
    echo.
)

REM Ask if user wants to seed database
set /p seed_choice="Do you want to seed the database with sample data? (y/n): "

if /i "%seed_choice%"=="y" (
    echo Seeding database...
    call npm run seed
    echo.
)

REM Start the server
echo Starting backend server...
echo.
call npm run dev
