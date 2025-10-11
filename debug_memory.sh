#!/bin/bash

# 调试 claude-flow 内存存储的脚本

echo "🔍 Claude-Flow 内存调试脚本"
echo "============================"

# 检查 claude-flow 是否可用
if ! command -v claude-flow &> /dev/null; then
    echo "❌ claude-flow 未安装，请先运行：npm i -g claude-flow@alpha"
    exit 1
fi

echo "✅ claude-flow 版本：$(claude-flow --version 2>/dev/null || echo '未知')"

# 检查当前目录
echo ""
echo "📁 当前目录：$(pwd)"

# 检查关键文件
echo ""
echo "📋 检查关键文件："
echo "TECH_STACK.md: $([ -f docs/references/TECH_STACK.md ] && echo '✅ 存在' || echo '❌ 不存在')"
echo "文件大小: $(wc -c < docs/references/TECH_STACK.md 2>/dev/null || echo '0') 字节"

# 测试载入一个简单文档
echo ""
echo "🧪 测试载入文档..."

# 先清理可能存在的测试数据
claude-flow memory remove "test-context" 2>/dev/null || true

# 载入 TECH_STACK.md 到测试路径
echo "载入 TECH_STACK.md..."
claude-flow memory store "test-context/tech-stack" "$(head -20 docs/references/TECH_STACK.md)"

# 检查是否载入成功
echo ""
echo "🔍 验证载入结果："
if claude-flow memory list "test-context/" | grep -q "tech-stack"; then
    echo "✅ 文档载入成功"
    echo "内容预览："
    claude-flow memory search "test-context/" "React" | head -3
else
    echo "❌ 文档载入失败"
    echo "可用的记忆条目："
    claude-flow memory list | head -10
fi

# 测试搜索功能
echo ""
echo "🔍 测试搜索功能："
echo "搜索 'React'："
claude-flow memory search "test-context/" "React" | head -5

echo ""
echo "搜索 'TypeScript'："
claude-flow memory search "test-context/" "TypeScript" | head -5

# 清理测试数据
echo ""
echo "🧹 清理测试数据..."
claude-flow memory remove "test-context"

echo ""
echo "✅ 调试完成"
echo ""
echo "如果载入成功，问题可能在于："
echo "1. 文件太大（超过单次载入限制）"
echo "2. 特殊字符编码问题"
echo "3. claude-flow memory 系统的搜索逻辑"