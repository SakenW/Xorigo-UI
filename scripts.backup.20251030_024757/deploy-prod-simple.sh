#!/bin/bash
# ============================================
# Xorigo UI 简化生产环境部署脚本
# ============================================

set -e

echo "🚀 部署 Xorigo UI 生产环境（简化版）"

# 设置环境变量
export NODE_ENV=production
export WEBSITE_PORT=3100
export REDIS_PORT=6379
export REDIS_PASSWORD=${REDIS_PASSWORD:-prod123}

# 停止现有容器
echo "📦 停止现有容器..."
docker-compose -f docker-compose.prod.simple.yml down 2>/dev/null || true

# 构建生产镜像
echo "🔨 构建生产镜像..."
docker-compose -f docker-compose.prod.simple.yml build --no-cache

# 启动生产服务
echo "🚀 启动生产服务..."
docker-compose -f docker-compose.prod.simple.yml up -d

# 等待服务就绪
echo "⏳ 等待服务就绪..."
sleep 10

# 检查服务状态
echo "🔍 检查服务状态..."
docker-compose -f docker-compose.prod.simple.yml ps

# 测试健康检查
echo "💚 测试健康检查..."
curl -f http://localhost:3100/api/health || echo "⚠️ 健康检查失败"

echo "✅ 部署完成！"
echo "🌐 访问地址: http://localhost:3100"
echo ""
echo "📋 常用命令："
echo "  查看日志: docker-compose -f docker-compose.prod.simple.yml logs -f"
echo "  停止服务: docker-compose -f docker-compose.prod.simple.yml down"
echo "  重启服务: docker-compose -f docker-compose.prod.simple.yml restart"