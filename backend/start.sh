#!/bin/bash

# FoodShare Backend Startup Script
# This script helps you start the backend server easily

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║   🍱 FoodShare Backend Server                             ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."
if ! mongod --version &> /dev/null; then
    echo "⚠️  Warning: MongoDB command not found."
    echo "   Please make sure MongoDB is installed and running."
    echo ""
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "📝 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env file created. Please update it with your settings."
    echo ""
fi

# Ask if user wants to seed database
echo "❓ Do you want to seed the database with sample data? (y/n)"
read -r seed_choice

if [[ $seed_choice == "y" || $seed_choice == "Y" ]]; then
    echo "🌱 Seeding database..."
    npm run seed
    echo ""
fi

# Start the server
echo "🚀 Starting backend server..."
echo ""
npm run dev
