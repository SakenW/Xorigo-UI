#!/bin/bash

# Xorigo UI Docker 开发环境守护脚本
# 确保只使用Docker容器进行开发，禁止npm run dev进程

echo "🐳 Xorigo UI Docker 开发环境守护脚本"
echo "=================================="

# 检查并终止所有npm run dev进程
echo "🔍 检查npm run dev进程..."

NPM_DEV_PROCESSES=$(ps aux | grep -E "npm.*run.*dev" | grep -v grep | wc -l)

if [ "$NPM_DEV_PROCESSES" -gt 0 ]; then
    echo "⚠️  发现 $NPM_DEV_PROCESSES 个npm run dev进程，正在终止..."

    # 强制终止所有npm run dev进程
    pkill -9 -f "npm.*run.*dev"
    pkill -9 -f "next.*dev"
    pkill -9 -f "node.*next"

    # 等待进程终止
    sleep 2

    # 再次检查
    REMAINING=$(ps aux | grep -E "npm.*run.*dev" | grep -v grep | wc -l)
    if [ "$REMAINING" -gt 0 ]; then
        echo "❌ 仍有 $REMAINING 个进程顽固运行"
        ps aux | grep -E "npm.*run.*dev" | grep -v grep
    else
        echo "✅ 所有npm run dev进程已清理"
    fi
else
    echo "✅ 没有发现npm run dev进程"
fi

# 检查端口占用
echo "🔍 检查端口3000、3001、3100..."

if command -v netstat >/dev/null 2>&1; then
    PORT_3000=$(netstat -tlnp 2>/dev/null | grep ":3000 ")
    PORT_3001=$(netstat -tlnp 2>/dev/null | grep ":3001 ")
    PORT_3100=$(netstat -tlnp 2>/dev/null | grep ":3100 ")
elif command -v ss >/dev/null 2>&1; then
    PORT_3000=$(ss -tlnp 2>/dev/null | grep ":3000 ")
    PORT_3001=$(ss -tlnp 2>/dev/null | grep ":3001 ")
    PORT_3100=$(ss -tlnp 2>/dev/null | grep ":3100 ")
fi

if [ -n "$PORT_3000" ] || [ -n "$PORT_3001" ]; then
    echo "⚠️  发现端口3000/3001被占用，这违反了Docker开发规范"
    echo "端口3000占用: $PORT_3000"
    echo "端口3001占用: $PORT_3001"
else
    echo "✅ 端口3000/3001没有被占用"
fi

if [ -n "$PORT_3100" ]; then
    echo "✅ 端口3100正在使用（Docker容器或开发服务器）"
else
    echo "⚠️  端口3100没有被占用，Docker容器可能未运行"
fi

# 检查Docker状态
echo "🐳 检查Docker状态..."

if command -v docker >/dev/null 2>&1; then
    if docker info >/dev/null 2>&1; then
        DOCKER_CONTAINERS=$(docker ps --format "table {{.Names}}\t{{.Ports}}" | grep -E "(xorigo|3100)")
        if [ -n "$DOCKER_CONTAINERS" ]; then
            echo "✅ Docker容器正在运行:"
            echo "$DOCKER_CONTAINERS"
        else
            echo "⚠️  没有发现Xorigo UI相关的Docker容器"
        fi
    else
        echo "⚠️  Docker守护进程未运行"
    fi
else
    echo "⚠️  Docker命令未找到"
fi

# 输出建议
echo ""
echo "📝 Docker开发环境提醒:"
echo "✅ 正确方式: npm run docker:dev 或 docker-compose -f docker-compose.dev.monorepo.yml up"
echo "🚫 禁止方式: npm run dev, npm run dev:website"
echo "🌐 访问地址: http://localhost:3100 (Docker容器端口)"
echo ""

# 如果发现npm run dev进程，输出警告
if [ "$NPM_DEV_PROCESSES" -gt 0 ]; then
    echo "🚨 警告: 检测到违反Docker开发规范的npm run dev进程!"
    echo "这些进程已被自动终止。请使用Docker容器进行开发。"
    exit 1
else
    echo "🎉 开发环境检查通过，符合Docker开发规范"
    exit 0
fi