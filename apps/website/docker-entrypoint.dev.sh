#!/bin/bash

# ============================================
# Xorigo UI Website Docker 开发环境启动脚本
# 支持 Monorepo 依赖和热更新
# ============================================

set -e

echo "🚀 Xorigo UI Website Docker 开发环境启动脚本"
echo "================================================"

# 检查环境变量
if [ -z "$NODE_ENV" ]; then
    export NODE_ENV=development
fi

if [ -z "$PORT" ]; then
    export PORT=3100
fi

if [ -z "$HOSTNAME" ]; then
    export HOSTNAME=0.0.0.0
fi

echo "📋 环境配置:"
echo "  NODE_ENV: $NODE_ENV"
echo "  PORT: $PORT"
echo "  HOSTNAME: $HOSTNAME"
echo ""

# 检查必要文件
echo "🔍 检查必要文件..."
if [ ! -f "package.json" ]; then
    echo "❌ package.json 不存在"
    exit 1
fi

if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install --legacy-peer-deps --no-audit --no-fund
fi

# 检查 Monorepo 依赖
echo "🔍 检查 Monorepo 依赖..."
echo "  检查 @xorigo-ui/core..."
if [ ! -d "node_modules/@xorigo-ui/core" ]; then
    echo "  📦 安装 @xorigo-ui/core..."
    npm install --legacy-peer-deps --no-audit --no-fund
fi

echo "  检查 @xorigo-ui/registry..."
if [ ! -d "node_modules/@xorigo-ui/registry" ]; then
    echo "  📦 安装 @xorigo-ui/registry..."
    npm install --legacy-peer-deps --no-audit --no-fund
fi

echo "  检查 @xorigo-ui/tokens..."
if [ ! -d "node_modules/@xorigo-ui/tokens" ]; then
    echo "  📦 安装 @xorigo-ui/tokens..."
    npm install --legacy-peer-deps --no-audit --no-fund
fi

echo "  检查 @xorigo-ui/style-recipe..."
if [ ! -d "node_modules/@xorigo-ui/style-recipe" ]; then
    echo "  📦 安装 @xorigo-ui/style-recipe..."
    npm install --legacy-peer-deps --no-audit --no-fund
fi

# 设置 Monorepo 包的符号链接
echo "🔗 设置 Monorepo 包符号链接..."
for package in core tokens style-recipe registry; do
    if [ -d "/packages/$package" ] && [ ! -L "node_modules/@xorigo-ui/$package" ]; then
        echo "  🔗 链接 @xorigo-ui/$package -> /packages/$package"
        ln -sf "/packages/$package" "node_modules/@xorigo-ui/$package"
    fi
done

# 为 core 包建立 monorepo 依赖链接
echo "🔗 为 core 包建立依赖链接..."
if [ -d "/packages/core" ]; then
    # 创建 core 包的 node_modules 目录结构
    mkdir -p "/packages/core/node_modules/@xorigo-ui"

    # 在 core 包中链接其他依赖包
    for dep_package in tokens style-recipe registry; do
        if [ -d "/packages/$dep_package" ] && [ ! -L "/packages/core/node_modules/@xorigo-ui/$dep_package" ]; then
            echo "  🔗 链接 core -> ../$dep_package"
            ln -sf "/packages/$dep_package" "/packages/core/node_modules/@xorigo-ui/$dep_package"
        fi
    done
fi

# 清理 Next.js 缓存（避免缓存问题）
echo "🧹 清理 Next.js 缓存..."
rm -rf .next || true
mkdir -p .next/cache

# 创建健康检查 API 端点目录
mkdir -p src/app/api/health

# 如果健康检查文件不存在，创建一个
if [ ! -f "src/app/api/health/route.ts" ]; then
    echo "📝 创建健康检查端点..."
    cat > src/app/api/health/route.ts << 'EOF'
/**
 * @fileoverview 健康检查 API 端点
 */
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: process.env.PORT || 3100,
    version: '0.1.0',
    services: {
      website: 'running',
      dataLayer: 'connected',
      playground: 'ready'
    }
  })
}

export const dynamic = 'force-dynamic'
EOF
fi

# 构建类型检查（可选，用于开发环境验证）
if [ "$SKIP_TYPE_CHECK" != "true" ]; then
    echo "🔍 运行类型检查..."
    npm run type-check || echo "⚠️ 类型检查失败，但继续启动开发服务器"
fi

echo ""
echo "🚀 启动 Next.js 开发服务器..."
echo "📍 Website 地址: http://localhost:$PORT"
echo "🔥 热更新已启用 - 修改源代码会自动刷新"
echo "📊 查看日志: docker logs xorigo-ui-website-dev -f"
echo ""

# 启动开发服务器
if [ "$MONITOR_MODE" = "true" ]; then
    echo "📈 启动监控面板模式..."
    export NEXT_PUBLIC_MONITOR_MODE=true
fi

exec npm run dev -- --port $PORT --hostname $HOSTNAME