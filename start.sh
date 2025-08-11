#!/bin/bash

echo "🚀 Starting HostelEase MERN Stack Application..."
echo "================================================"

# Check if MongoDB is running
echo "📊 Checking MongoDB status..."
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first:"
    echo "   mongod"
    echo ""
    read -p "Press Enter to continue anyway..."
else
    echo "✅ MongoDB is running"
fi

# Start Backend
echo ""
echo "🔧 Starting Backend Server..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing backend dependencies..."
    npm install
fi

echo "🚀 Starting backend on port 5000..."
npm run dev &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 3

# Start Frontend
echo ""
echo "🎨 Starting Frontend Application..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

echo "🚀 Starting frontend on port 3000..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "🎉 HostelEase is starting up!"
echo "================================================"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5000"
echo "📊 Health Check: http://localhost:5000/api/health"
echo ""
echo "🔑 Default Login Credentials:"
echo "   Admin: admin@hostelease.com / admin123"
echo "   Staff: staff@hostelease.com / staff123"
echo "   Student: john@example.com / student123"
echo ""
echo "Press Ctrl+C to stop both servers"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Servers stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
