#!/bin/bash

# Xorigo UI Docker 开发环境启动脚本

set -e

echo "🚀 启动 Xorigo UI Docker 开发环境..."

# 检查并清理npm run dev进程
echo "🔍 检查并清理npm run dev进程..."
NPM_DEV_PROCESSES=$(ps aux | grep -E "npm.*run.*dev" | grep -v grep | wc -l)
if [ "$NPM_DEV_PROCESSES" -gt 0 ]; then
    echo "⚠️  发现 $NPM_DEV_PROCESSES 个npm run dev进程，正在清理..."
    pkill -9 -f "npm.*run.*dev" 2>/dev/null || true
    pkill -9 -f "next.*dev" 2>/dev/null || true
    sleep 1
    echo "✅ npm run dev进程已清理"
fi

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker 未运行,请先启动 Docker Desktop"
  echo "💡 在WSL2中，需要确保Docker Desktop的WSL2集成已启用"
  exit 1
fi

# 停止并移除旧容器
echo "🧹 清理旧容器..."
docker-compose -f docker-compose.dev.monorepo.yml down 2>/dev/null || true

# 构建并启动容器
echo "🏗️  构建 Docker 镜像..."
docker-compose -f docker-compose.dev.monorepo.yml build

echo "▶️  启动开发容器..."
docker-compose -f docker-compose.dev.monorepo.yml up -d

# 等待服务就绪
echo "⏳ 等待服务启动..."
sleep 3

# 检查容器状态
if docker ps | grep -q xorigo-ui-dev; then
  echo "✅ Xorigo UI 开发环境已启动!"
  echo ""
  echo "📍 访问地址: http://localhost:3100"
  echo "📊 查看日志: docker-compose -f docker-compose.dev.monorepo.yml logs -f"
  echo "🛑 停止服务: docker-compose -f docker-compose.dev.monorepo.yml down"
  echo ""
  echo "🔥 热更新已启用 - 修改代码会自动刷新"
else
  echo "❌ 容器启动失败,请检查日志:"
  docker-compose -f docker-compose.dev.monorepo.yml logs
  exit 1
fi
