#!/bin/bash

# Xorigo UI 生产环境部署脚本

set -e

echo "🚀 开始部署 Xorigo UI 生产环境..."

# 检查 Docker 是否运行
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker 未运行,请先启动 Docker"
  exit 1
fi

# 停止并移除旧容器
echo "🧹 清理旧容器..."
docker-compose down 2>/dev/null || true

# 构建镜像
echo "🏗️  构建生产镜像..."
docker-compose build --no-cache

# 启动容器
echo "▶️  启动生产容器..."
docker-compose up -d

# 等待服务就绪
echo "⏳ 等待服务启动..."
sleep 5

# 检查健康状态
echo "🔍 检查服务健康状态..."
for i in {1..10}; do
  if docker exec xorigo-ui-prod wget --quiet --tries=1 --spider http://localhost:3100/health 2>/dev/null; then
    echo "✅ Xorigo UI 生产环境部署成功!"
    echo ""
    echo "📍 访问地址: http://localhost:3100"
    echo "📊 查看日志: docker-compose logs -f"
    echo "📈 查看状态: docker-compose ps"
    echo "🛑 停止服务: docker-compose down"
    echo ""
    exit 0
  fi
  echo "等待健康检查... ($i/10)"
  sleep 3
done

echo "❌ 服务启动失败,请检查日志:"
docker-compose logs
exit 1
