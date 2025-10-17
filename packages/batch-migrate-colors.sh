#!/bin/bash

# 批量替换硬编码颜色的脚本
# 使用语义化令牌替换Tailwind硬编码颜色

# 文件路径映射
declare -A file_mappings=(
    ["AvatarGroup.tsx"]="/home/saken/project/Xorigo-UI/packages/core/src/ui/AvatarGroup.tsx"
    ["Code.tsx"]="/home/saken/project/Xorigo-UI/packages/core/src/ui/Code.tsx"
    ["Kbd.tsx"]="/home/saken/project/Xorigo-UI/packages/core/src/ui/Kbd.tsx"
    ["ScrollArea.tsx"]="/home/saken/project/Xorigo-UI/packages/core/src/ui/ScrollArea.tsx"
    ["Separator.tsx"]="/home/saken/project/Xorigo-UI/packages/core/src/ui/Separator.tsx"
    ["Surface.tsx"]="/home/saken/project/Xorigo-UI/packages/core/src/ui/Surface.tsx"
    ["Tooltip.tsx"]="/home/saken/project/Xorigo-UI/packages/core/src/ui/Tooltip.tsx"
)

# 颜色映射规则
declare -A color_mappings=(
    # 基础颜色
    ["gray-50"]="bg-[var(--bg-tertiary)]"
    ["gray-100"]="bg-[var(--bg-tertiary)]"
    ["gray-200"]="bg-[var(--bg-disabled)]"
    ["gray-300"]="border-[var(--border-secondary)]"
    ["gray-400"]="text-[var(--text-tertiary)]"
    ["gray-500"]="text-[var(--text-secondary)]"
    ["gray-600"]="text-[var(--text-secondary)]"
    ["gray-700"]="text-[var(--text-primary)]"
    ["gray-800"]="bg-[var(--bg-inverse)]"
    ["gray-900"]="bg-[var(--bg-inverse)]"
    ["gray-950"]="bg-[var(--bg-contrast-high)]"

    # 白色/黑色
    ["white"]="bg-[var(--bg-secondary)]"
    ["black"]="bg-[var(--bg-contrast-high)]"

    # 主色系
    ["blue-50"]="bg-[var(--bg-tertiary)]"
    ["blue-100"]="bg-[var(--bg-tertiary)]"
    ["blue-200"]="bg-[var(--bg-tertiary)]"
    ["blue-500"]="bg-[var(--bg-primary-action)]"
    ["blue-600"]="bg-[var(--bg-primary-action-hover)]"

    # 状态色
    ["red-500"]="bg-[var(--bg-error)]"
    ["red-600"]="text-[var(--text-error)]"
    ["green-500"]="bg-[var(--bg-success)]"
    ["green-600"]="text-[var(--text-success)]"
    ["yellow-500"]="bg-[var(--bg-warning)]"
    ["yellow-600"]="text-[var(--text-warning)]"
    ["purple-400"]="text-[var(--text-secondary-action)]"
    ["purple-500"]="bg-[var(--bg-secondary-action)]"
    ["purple-600"]="bg-[var(--bg-secondary-action-hover)]"
    ["cyan-200"]="bg-[var(--bg-tertiary)]"
    ["cyan-400"]="text-[var(--text-info)]"
    ["cyan-500"]="bg-[var(--bg-info)]"
    ["cyan-600"]="text-[var(--text-info)]"
)

# 添加语义化令牌导入的函数
add_semantic_import() {
    local file="$1"
    if ! grep -q "semanticColors" "$file"; then
        sed -i '1a import { semanticColors } from '\''@xorigo-ui/tokens'\''' "$file"
        echo "✅ 添加语义化令牌导入到 $file"
    fi
}

# 批量替换颜色的函数
replace_colors() {
    local file="$1"
    echo "🔧 处理文件: $file"

    # 备份原文件
    cp "$file" "${file}.backup"

    # 应用颜色映射
    for old_color in "${!color_mappings[@]}"; do
        new_color="${color_mappings[$old_color]}"
        # 替换各种前缀的颜色
        sed -i "s/bg-$old_color/bg-[var(--bg-tertiary)]/g" "$file"
        sed -i "s/text-$old_color/text-[var(--text-primary)]/g" "$file"
        sed -i "s/border-$old_color/border-[var(--border-primary)]/g" "$file"
    done

    # 特殊处理一些复杂的颜色模式
    sed -i 's/dark:bg-gray-800/dark:bg-[var(--bg-inverse)]/g' "$file"
    sed -i 's/dark:bg-gray-900/dark:bg-[var(--bg-contrast-high)]/g' "$file"
    sed -i 's/dark:border-gray-700/dark:border-[var(--border-primary)]/g' "$file"
    sed -i 's/dark:text-gray-100/dark:text-[var(--text-primary)]/g' "$file"
    sed -i 's/dark:text-gray-200/dark:text-[var(--text-secondary)]/g" "$file"
    sed -i 's/dark:text-gray-300/dark:text-[var(--text-tertiary)]/g" "$file"
    sed -i 's/dark:text-gray-400/dark:text-[var(--text-tertiary)]/g" "$file"
    sed -i 's/dark:text-gray-500/dark:text-[var(--text-secondary)]/g" "$file"

    echo "✅ 完成颜色替换: $file"
}

# 主函数
main() {
    echo "🚀 开始批量迁移UI组件的硬编码颜色..."

    for file_key in "${!file_mappings[@]}"; do
        file_path="${file_mappings[$file_key]}"
        if [[ -f "$file_path" ]]; then
            echo "📁 处理: $file_key"
            add_semantic_import "$file_path"
            replace_colors "$file_path"
        else
            echo "⚠️ 文件不存在: $file_path"
        fi
    done

    echo "🎉 批量迁移完成！"
    echo "💡 提示：所有文件都已备份为 .backup 文件，如有问题可恢复。"
}

# 执行主函数
main "$@"