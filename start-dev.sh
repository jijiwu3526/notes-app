#!/bin/bash

# 启动全栈记事本应用
echo "Starting Full Stack Notes App..."

# 检查是否已安装依赖
if [ ! -d "frontend/node_modules" ] || [ ! -d "backend/node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    (cd frontend && npm install)
    (cd backend && npm install)
fi

echo "Starting development servers..."
echo "Frontend will be available at http://localhost:5173"
echo "Backend will be available at http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

# 启动前端和后端服务器
npm run dev