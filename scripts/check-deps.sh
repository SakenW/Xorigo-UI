#!/bin/bash
# scripts/check-deps.sh
# Xorigo UI 依赖健康度检查脚本

echo "🔍 Xorigo UI 依赖健康度检查"
echo "=============================="
echo "检查时间: $(date '+%Y-%m-%d %H:%M:%S')"
echo ""

# 1. 检查 npm install（干运行）
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "1️⃣  检查 npm install（干运行）"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm install --legacy-peer-deps --dry-run 2>&1 | head -50
echo ""

# 2. 检查安全漏洞
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "2️⃣  安全漏洞扫描"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm audit --audit-level=moderate 2>&1 | grep -A 20 "npm audit report"
echo ""

# 3. 检查过期依赖
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "3️⃣  过期依赖检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm outdated 2>&1 | head -20
echo ""

# 4. 检查 peer dependency 冲突
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "4️⃣  Peer Dependency 冲突检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
npm list 2>&1 | grep -E "invalid|UNMET" || echo "✅ 无 peer dependency 冲突"
echo ""

# 5. 检查关键依赖状态
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "5️⃣  关键依赖状态"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 检查 vite
echo "📦 vite:"
if [ -f "node_modules/vite/package.json" ]; then
    VITE_VERSION=$(node -p "require('./node_modules/vite/package.json').version")
    echo "   版本: $VITE_VERSION ✅"
else
    echo "   状态: ❌ 包损坏或缺失"
fi

# 检查 react
echo "📦 React:"
if [ -f "packages/core/node_modules/react/package.json" ]; then
    REACT_VERSION=$(node -p "require('./packages/core/node_modules/react/package.json').version")
    echo "   版本: $REACT_VERSION ✅"
elif [ -f "node_modules/react/package.json" ]; then
    REACT_VERSION=$(node -p "require('./node_modules/react/package.json').version")
    echo "   版本: $REACT_VERSION (根目录) ✅"
else
    echo "   状态: ❌ 未安装"
fi

# 检查 TypeScript
echo "📦 TypeScript:"
if [ -f "node_modules/typescript/package.json" ]; then
    TS_VERSION=$(node -p "require('./node_modules/typescript/package.json').version")
    echo "   版本: $TS_VERSION ✅"
else
    echo "   状态: ❌ 未安装"
fi

# 检查 Framer Motion
echo "📦 Framer Motion:"
if [ -f "packages/core/node_modules/framer-motion/package.json" ]; then
    FM_VERSION=$(node -p "require('./packages/core/node_modules/framer-motion/package.json').version")
    echo "   版本: $FM_VERSION ✅"
else
    echo "   状态: ❌ 未安装"
fi

echo ""

# 6. 检查文件权限问题
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "6️⃣  文件权限检查"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
ROOT_FILES=$(find node_modules -user root 2>/dev/null | wc -l)
if [ "$ROOT_FILES" -gt 0 ]; then
    echo "⚠️  发现 $ROOT_FILES 个 root 权限文件"
    echo "   建议运行: sudo rm -rf node_modules && npm install"
else
    echo "✅ 无权限问题"
fi

echo ""
echo "=============================="
echo "检查完成！"
echo ""

# 生成报告文件
REPORT_FILE="docs/deps-health-report-$(date '+%Y%m%d-%H%M%S').txt"
echo "📄 详细报告已保存至: $REPORT_FILE"

# 写入报告
{
    echo "Xorigo UI 依赖健康度报告"
    echo "检查时间: $(date '+%Y-%m-%d %H:%M:%S')"
    echo ""
    echo "=== 安全漏洞 ==="
    npm audit --audit-level=moderate 2>&1
    echo ""
    echo "=== 过期依赖 ==="
    npm outdated 2>&1
    echo ""
    echo "=== Peer Dependency 冲突 ==="
    npm list 2>&1 | grep -E "invalid|UNMET"
    echo ""
    echo "=== 权限问题 ==="
    find node_modules -user root 2>/dev/null | head -20
} > "$REPORT_FILE" 2>&1

echo "✅ 报告生成完成"
