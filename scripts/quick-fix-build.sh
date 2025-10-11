#!/bin/bash
# scripts/quick-fix-build.sh
# TH-UI 构建系统快速修复脚本

set -e

echo "🔧 TH-UI 构建系统快速修复"
echo "=============================="

# Step 1: 清理权限混乱的 node_modules
echo ""
echo "Step 1/6: 清理 node_modules..."
sudo rm -rf node_modules packages/*/node_modules apps/*/node_modules
echo "✅ node_modules 清理完成"

# Step 2: 清理 npm 缓存
echo ""
echo "Step 2/6: 清理 npm 缓存..."
npm cache clean --force
echo "✅ npm 缓存清理完成"

# Step 3: 更新 .npmrc
echo ""
echo "Step 3/6: 更新 .npmrc 配置..."
cat > .npmrc << 'EOF'
# npm 配置 (npm 10+)
legacy-peer-deps=true
engine-strict=true
unsafe-perm=true
EOF
echo "✅ .npmrc 配置更新完成"

# Step 4: 安装依赖
echo ""
echo "Step 4/6: 安装依赖..."
npm install --legacy-peer-deps
echo "✅ 依赖安装完成"

# Step 5: 验证 vite 包完整性
echo ""
echo "Step 5/6: 验证 vite 包..."
if [ -f "node_modules/vite/package.json" ]; then
    echo "✅ vite 包完整"
else
    echo "❌ vite 包损坏，尝试修复..."
    npm install --legacy-peer-deps --force
fi

# Step 6: 测试构建
echo ""
echo "Step 6/6: 测试构建..."
cd packages/core
npm run build
cd ../..
echo "✅ 构建成功！"

echo ""
echo "🎉 修复完成！"
echo "=============================="
echo ""
echo "下一步："
echo "1. 检查构建产物: ls -la packages/core/dist/"
echo "2. 启动开发服务器: npm run dev"
echo "3. 运行类型检查: npm run type-check"
