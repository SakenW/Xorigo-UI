#!/bin/bash
# ============================================
# Xorigo UI 开发环境快速重启脚本
# ============================================

set -e

echo "🔄 重启 Xorigo UI 开发环境"

# 停止并删除旧容器
echo "📦 停止现有容器..."
docker-compose -f docker-compose.dev.monorepo.yml down 2>/dev/null || true

# 启动完整开发环境（包含 Redis）
echo "🚀 启动开发服务器和 Redis..."
docker-compose -f docker-compose.dev.monorepo.yml up -d

# 等待服务就绪
echo "⏳ 等待服务就绪..."
sleep 5

# 检查服务状态
echo "🔍 检查服务状态..."
docker ps | grep xorigo-ui

# 查看日志
echo "📝 Website 最新日志："
docker logs xorigo-ui-website-dev --tail 15

echo "📦 Redis 状态："
docker logs xorigo-ui-redis --tail 5 2>/dev/null || echo "Redis 启动中..."

# 测试健康检查
echo "💚 测试健康检查..."
curl -I http://localhost:3100/ || echo "⚠️ 服务可能还在启动中"

echo ""
echo "✅ 开发环境重启完成！"
echo "🌐 Website: http://localhost:3100"
echo "📦 Redis: localhost:6379 (密码: dev123)"
echo "📖 查看日志:"
echo "  - Website: docker logs -f xorigo-ui-website-dev"
echo "  - Redis:   docker logs -f xorigo-ui-redis"