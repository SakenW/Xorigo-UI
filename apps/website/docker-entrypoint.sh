#!/bin/sh
# 修复 Next.js App Router 目录结构问题
# 确保在容器启动时正确复制 app 目录

echo "🔧 修复 Next.js App Router 目录结构..."

# 复制 app 目录到根目录
if [ -d "/app/src/app" ]; then
    cp -r /app/src/app /app/
    echo "✅ 已复制 app 目录到根目录"
else
    echo "❌ /app/src/app 目录不存在"
fi

# 启动 Next.js 开发服务器
echo "🚀 启动 Next.js 开发服务器..."
exec npx next dev --port 3100 --hostname 0.0.0.0