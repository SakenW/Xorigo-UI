#!/bin/bash

# 重新构建并部署 TH-UI

set -e

echo "🔄 重新构建并部署 TH-UI..."

# 停止容器
echo "🛑 停止现有容器..."
docker-compose down

# 删除旧镜像
echo "🗑️  删除旧镜像..."
docker rmi th-ui-prod 2>/dev/null || true

# 重新构建
echo "🏗️  重新构建镜像..."
docker-compose build --no-cache

# 启动
echo "▶️  启动容器..."
docker-compose up -d

echo "✅ 重新部署完成!"
echo "📍 访问地址: http://localhost:3100"
