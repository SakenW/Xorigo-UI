#!/bin/bash

# TH-UI Docker 开发环境启动脚本

set -e

echo "🚀 启动 TH-UI Docker 开发环境..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker 未运行,请先启动 Docker"
  exit 1
fi

# 停止并移除旧容器
echo "🧹 清理旧容器..."
docker-compose -f docker-compose.dev.yml down 2>/dev/null || true

# 构建并启动容器
echo "🏗️  构建 Docker 镜像..."
docker-compose -f docker-compose.dev.yml build

echo "▶️  启动开发容器..."
docker-compose -f docker-compose.dev.yml up -d

# 等待服务就绪
echo "⏳ 等待服务启动..."
sleep 3

# 检查容器状态
if docker ps | grep -q th-ui-dev; then
  echo "✅ TH-UI 开发环境已启动!"
  echo ""
  echo "📍 访问地址: http://localhost:3100"
  echo "📊 查看日志: docker-compose -f docker-compose.dev.yml logs -f"
  echo "🛑 停止服务: docker-compose -f docker-compose.dev.yml down"
  echo ""
  echo "🔥 热更新已启用 - 修改代码会自动刷新"
else
  echo "❌ 容器启动失败,请检查日志:"
  docker-compose -f docker-compose.dev.yml logs
  exit 1
fi
