#!/bin/bash
set -e

echo "🔍 检查循环依赖..."
npx madge --circular packages/

echo ""
echo "🔍 检查依赖方向..."
echo "验证规则:"
echo "  - core 不依赖 apps/**"
echo "  - core 不依赖 cli/**"
echo "  - system/hooks 不依赖 core"
echo ""

# 检查 system 是否依赖 core
if grep -q "@xorigo-ui/core" packages/system/package.json 2>/dev/null; then
  echo "❌ 错误: system 不应依赖 core"
  exit 1
fi

# 检查 hooks 是否依赖 core
if grep -q "@xorigo-ui/core" packages/hooks/package.json 2>/dev/null; then
  echo "❌ 错误: hooks 不应依赖 core"
  exit 1
fi

# 检查 core 是否依赖 apps
if grep -q "\"apps/" packages/core/package.json 2>/dev/null; then
  echo "❌ 错误: core 不应依赖 apps/**"
  exit 1
fi

# 检查 core 是否依赖 cli
if grep -q "@xorigo-ui/cli" packages/core/package.json 2>/dev/null; then
  echo "❌ 错误: core 不应依赖 cli"
  exit 1
fi

# 验证 core 依赖新包
echo "验证 core 依赖新包..."
REQUIRED_DEPS=("@xorigo-ui/system" "@xorigo-ui/hooks" "@xorigo-ui/i18n" "@xorigo-ui/tokens" "@xorigo-ui/style-recipe")
for dep in "${REQUIRED_DEPS[@]}"; do
  if ! grep -q "\"$dep\"" packages/core/package.json; then
    echo "❌ 错误: core 缺少依赖 $dep"
    exit 1
  fi
done

echo ""
echo "✅ 依赖检查完成"
echo "  ✅ 无循环依赖"
echo "  ✅ system/hooks 不依赖 core"
echo "  ✅ core 不依赖 apps/cli"
echo "  ✅ core 依赖所有必需的包"
