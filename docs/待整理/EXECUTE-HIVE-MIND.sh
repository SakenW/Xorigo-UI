#!/bin/bash

# Website 重构 Hive-Mind 执行脚本
# 用途: 一键启动 claude-flow hive-mind 批量执行

set -e

echo "🚀 Xorigo UI Website 重构 - Hive-Mind 执行脚本"
echo "================================================"
echo ""

# 检查当前目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在 /home/saken/project/Xorigo-UI/apps/website 目录下执行此脚本"
    exit 1
fi

# 显示菜单
echo "请选择执行方式:"
echo ""
echo "1) 全自动执行（完整16周重构，6组并行）"
echo "2) Phase 1 执行（数据层基础，Week 1-2）"
echo "3) Phase 2 执行（页面优化，Week 3-4）"
echo "4) Phase 3 执行（DX 增强，Week 5-6）"
echo "5) 手动模式（逐步执行，完全控制）"
echo "6) 退出"
echo ""

read -p "请输入选项 (1-6): " choice

case $choice in
    1)
        echo ""
        echo "🎯 执行方案A: 全自动重构（16周完整计划）"
        echo "================================================"
        echo ""
        echo "执行命令:"
        echo "claude-flow hive-mind --plan ../../docs/待整理/Website重构-Agent执行计划.md --phase all --parallel 6 --verbose"
        echo ""
        read -p "确认执行? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            claude-flow hive-mind \
                --plan ../../docs/待整理/Website重构-Agent执行计划.md \
                --phase all \
                --parallel 6 \
                --verbose
            
            echo ""
            echo "✅ 执行完成！"
            echo ""
            echo "验收测试:"
            echo "npm run build          # 验证构建通过"
            echo "npm run lint           # 验证 ESLint 通过"
            echo "npm test               # 验证单元测试通过"
            echo "npx xorigo doctor      # 健康检查"
        fi
        ;;
    
    2)
        echo ""
        echo "🎯 执行 Phase 1: 数据层基础建设（Week 1-2）"
        echo "================================================"
        echo ""
        echo "包含 Agent:"
        echo "- Agent 1.1: Data Layer Adapter Creator (8h)"
        echo "- Agent 1.2: Schema Validator (10h)"
        echo "- Agent 1.3: ESLint Rules Enforcer (4h)"
        echo "- Agent 2.1: Error Boundary Implementer (6h)"
        echo ""
        read -p "确认执行? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            claude-flow hive-mind \
                --plan ../../docs/待整理/Website重构-Agent执行计划.md \
                --phase 1 \
                --parallel 4 \
                --verbose
            
            echo ""
            echo "✅ Phase 1 执行完成！"
            echo ""
            echo "验收测试:"
            echo "npm run build          # 验证构建前校验工作"
            echo "npm run lint           # 验证 ESLint 规则强制执行"
        fi
        ;;
    
    3)
        echo ""
        echo "🎯 执行 Phase 2: 页面优化（Week 3-4）"
        echo "================================================"
        echo ""
        echo "包含 Agent:"
        echo "- Agent 3.1: RSC Page Optimizer (12h)"
        echo "- Agent 3.2: Client Component Isolator (8h)"
        echo "- Agent 6.1: Search Index Builder (8h)"
        echo "- Agent 6.2: Search UI Optimizer (6h)"
        echo ""
        read -p "确认执行? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            claude-flow hive-mind \
                --plan ../../docs/待整理/Website重构-Agent执行计划.md \
                --phase 2 \
                --parallel 4 \
                --verbose
            
            echo ""
            echo "✅ Phase 2 执行完成！"
            echo ""
            echo "验收测试:"
            echo "npm run build          # 验证 RSC 页面构建成功"
            echo "npm run analyze        # 验证 Bundle Size 达标"
        fi
        ;;
    
    4)
        echo ""
        echo "🎯 执行 Phase 3: DX 增强层（Week 5-6）"
        echo "================================================"
        echo ""
        echo "包含 Agent:"
        echo "- Agent 4.1: Playground Store Designer (10h)"
        echo "- Agent 4.2: Playground UI Builder (16h)"
        echo "- Agent 5.1: CLI Tools Enhancer (12h)"
        echo "- Agent 5.2: Performance Dashboard Creator (10h)"
        echo ""
        read -p "确认执行? (y/n): " confirm
        if [ "$confirm" = "y" ]; then
            claude-flow hive-mind \
                --plan ../../docs/待整理/Website重构-Agent执行计划.md \
                --phase 3 \
                --parallel 4 \
                --verbose
            
            echo ""
            echo "✅ Phase 3 执行完成！"
            echo ""
            echo "验收测试:"
            echo "npx xorigo doctor      # 验证健康检查命令"
            echo "npx xorigo sync docs   # 验证文档同步命令"
            echo "npm run dev            # 验证 Playground 双模式工作"
        fi
        ;;
    
    5)
        echo ""
        echo "📖 手动模式 - 参考文档:"
        echo "================================================"
        echo ""
        echo "1. 实施清单:"
        echo "   cat ../../docs/待整理/Website重构实施清单.md"
        echo ""
        echo "2. 快速开始指南（Step-by-step）:"
        echo "   cat ../../docs/待整理/Website重构快速开始指南.md"
        echo ""
        echo "3. 开发规范:"
        echo "   cat ../../docs/待整理/Website重构最佳实践和规则.md"
        echo ""
        echo "4. 架构设计方案:"
        echo "   cat ../../docs/待整理/Website重构架构设计方案.md"
        echo ""
        ;;
    
    6)
        echo "👋 退出"
        exit 0
        ;;
    
    *)
        echo "❌ 无效选项"
        exit 1
        ;;
esac

echo ""
echo "🎉 完成！"
