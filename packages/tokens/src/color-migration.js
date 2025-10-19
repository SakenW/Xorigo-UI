/**
 * 🎨 硬编码颜色迁移策略
 *
 * 将Tailwind硬编码颜色映射到CSS变量系统
 */
/**
 * 硬编码颜色映射表
 * 将Tailwind类名映射到语义化CSS变量
 */
export const colorMigrationMap = {
    // === 基础中性色 ===
    'gray-50': 'var(--color-neutral-50)',
    'gray-100': 'var(--color-neutral-100)',
    'gray-200': 'var(--color-neutral-200)',
    'gray-300': 'var(--color-neutral-300)',
    'gray-400': 'var(--color-neutral-400)',
    'gray-500': 'var(--color-neutral-500)',
    'gray-600': 'var(--color-neutral-600)',
    'gray-700': 'var(--color-neutral-700)',
    'gray-800': 'var(--color-neutral-800)',
    'gray-900': 'var(--color-neutral-900)',
    'gray-950': 'var(--color-neutral-950)',
    // === 主色系 ===
    'blue-50': 'var(--color-primary-50)',
    'blue-100': 'var(--color-primary-100)',
    'blue-200': 'var(--color-primary-200)',
    'blue-300': 'var(--color-primary-300)',
    'blue-400': 'var(--color-primary-400)',
    'blue-500': 'var(--color-primary-500)',
    'blue-600': 'var(--color-primary-600)',
    'blue-700': 'var(--color-primary-700)',
    'blue-800': 'var(--color-primary-800)',
    'blue-900': 'var(--color-primary-900)',
    'blue-950': 'var(--color-primary-950)',
    // === 成功色系 ===
    'green-50': 'var(--color-success-50)',
    'green-100': 'var(--color-success-100)',
    'green-200': 'var(--color-success-200)',
    'green-300': 'var(--color-success-300)',
    'green-400': 'var(--color-success-400)',
    'green-500': 'var(--color-success-500)',
    'green-600': 'var(--color-success-600)',
    'green-700': 'var(--color-success-700)',
    'green-800': 'var(--color-success-800)',
    'green-900': 'var(--color-success-900)',
    'green-950': 'var(--color-success-950)',
    // === 警告色系 ===
    'yellow-50': 'var(--color-warning-50)',
    'yellow-100': 'var(--color-warning-100)',
    'yellow-200': 'var(--color-warning-200)',
    'yellow-300': 'var(--color-warning-300)',
    'yellow-400': 'var(--color-warning-400)',
    'yellow-500': 'var(--color-warning-500)',
    'yellow-600': 'var(--color-warning-600)',
    'yellow-700': 'var(--color-warning-700)',
    'yellow-800': 'var(--color-warning-800)',
    'yellow-900': 'var(--color-warning-900)',
    'yellow-950': 'var(--color-warning-950)',
    // === 错误色系 ===
    'red-50': 'var(--color-error-50)',
    'red-100': 'var(--color-error-100)',
    'red-200': 'var(--color-error-200)',
    'red-300': 'var(--color-error-300)',
    'red-400': 'var(--color-error-400)',
    'red-500': 'var(--color-error-500)',
    'red-600': 'var(--color-error-600)',
    'red-700': 'var(--color-error-700)',
    'red-800': 'var(--color-error-800)',
    'red-900': 'var(--color-error-900)',
    'red-950': 'var(--color-error-950)',
    // === 信息色系 ===
    'cyan-50': 'var(--color-info-50)',
    'cyan-100': 'var(--color-info-100)',
    'cyan-200': 'var(--color-info-200)',
    'cyan-300': 'var(--color-info-300)',
    'cyan-400': 'var(--color-info-400)',
    'cyan-500': 'var(--color-info-500)',
    'cyan-600': 'var(--color-info-600)',
    'cyan-700': 'var(--color-info-700)',
    'cyan-800': 'var(--color-info-800)',
    'cyan-900': 'var(--color-info-900)',
    'cyan-950': 'var(--color-info-950)',
    // === 紫色系（创意主题） ===
    'purple-50': 'var(--color-secondary-50)',
    'purple-100': 'var(--color-secondary-100)',
    'purple-200': 'var(--color-secondary-200)',
    'purple-300': 'var(--color-secondary-300)',
    'purple-400': 'var(--color-secondary-400)',
    'purple-500': 'var(--color-secondary-500)',
    'purple-600': 'var(--color-secondary-600)',
    'purple-700': 'var(--color-secondary-700)',
    'purple-800': 'var(--color-secondary-800)',
    'purple-900': 'var(--color-secondary-900)',
    'purple-950': 'var(--color-secondary-950)',
    // === 特殊颜色映射 ===
    'white': 'var(--color-neutral-50)',
    'black': 'var(--color-neutral-950)',
    'slate-50': 'var(--color-neutral-50)',
    'slate-100': 'var(--color-neutral-100)',
    'slate-200': 'var(--color-neutral-200)',
    'slate-300': 'var(--color-neutral-300)',
    'slate-400': 'var(--color-neutral-400)',
    'slate-500': 'var(--color-neutral-500)',
    'slate-600': 'var(--color-neutral-600)',
    'slate-700': 'var(--color-neutral-700)',
    'slate-800': 'var(--color-neutral-800)',
    'slate-900': 'var(--color-neutral-900)',
    'slate-950': 'var(--color-neutral-950)',
    // === 透明度变体 ===
    'bg-white': 'bg-neutral-50',
    'bg-black': 'bg-neutral-950',
    'bg-gray-50': 'bg-neutral-50',
    'bg-gray-100': 'bg-neutral-100',
    'bg-gray-200': 'bg-neutral-200',
    'bg-gray-300': 'bg-neutral-300',
    'bg-gray-400': 'bg-neutral-400',
    'bg-gray-500': 'bg-neutral-500',
    'bg-gray-600': 'bg-neutral-600',
    'bg-gray-700': 'bg-neutral-700',
    'bg-gray-800': 'bg-neutral-800',
    'bg-gray-900': 'bg-neutral-900',
    'bg-gray-950': 'bg-neutral-950',
    'text-white': 'text-neutral-50',
    'text-black': 'text-neutral-950',
    'text-gray-50': 'text-neutral-50',
    'text-gray-100': 'text-neutral-100',
    'text-gray-200': 'text-neutral-200',
    'text-gray-300': 'text-neutral-300',
    'text-gray-400': 'text-neutral-400',
    'text-gray-500': 'text-neutral-500',
    'text-gray-600': 'text-neutral-600',
    'text-gray-700': 'text-neutral-700',
    'text-gray-800': 'text-neutral-800',
    'text-gray-900': 'text-neutral-900',
    'text-gray-950': 'text-neutral-950',
    'border-white': 'border-neutral-50',
    'border-black': 'border-neutral-950',
    'border-gray-50': 'border-neutral-50',
    'border-gray-100': 'border-neutral-100',
    'border-gray-200': 'border-neutral-200',
    'border-gray-300': 'border-neutral-300',
    'border-gray-400': 'border-neutral-400',
    'border-gray-500': 'border-neutral-500',
    'border-gray-600': 'border-neutral-600',
    'border-gray-700': 'border-neutral-700',
    'border-gray-800': 'border-neutral-800',
    'border-gray-900': 'border-neutral-900',
    'border-gray-950': 'border-neutral-950',
};
/**
 * 语义化颜色映射
 * 根据组件用途映射到语义化颜色
 */
export const semanticColorMap = {
    // === 按钮状态 ===
    'hover:bg-blue-600': 'hover:bg-primary-600',
    'hover:bg-blue-500': 'hover:bg-primary-500',
    'focus:ring-blue-500': 'focus:ring-primary-500',
    'focus:ring-blue-600': 'focus:ring-primary-600',
    'focus:border-blue-500': 'focus:border-primary-500',
    'focus-visible:ring-blue-500': 'focus-visible:ring-primary-500',
    'active:bg-blue-700': 'active:bg-primary-700',
    // === 输入框状态 ===
    'border-gray-300': 'border-neutral-300',
    'disabled:bg-gray-100': 'disabled:bg-neutral-100',
    'disabled:text-gray-500': 'disabled:text-neutral-500',
    // === 状态指示 ===
    'text-green-600': 'text-success-600',
    'text-red-600': 'text-error-600',
    'text-yellow-600': 'text-warning-600',
    'text-blue-600': 'text-info-600',
    'bg-green-100': 'bg-success-100',
    'bg-red-100': 'bg-error-100',
    'bg-yellow-100': 'bg-warning-100',
    'bg-blue-100': 'bg-info-100',
    // === 交互状态 ===
    'hover:bg-gray-100': 'hover:bg-neutral-100',
    'hover:bg-gray-50': 'hover:bg-neutral-50',
    'hover:text-gray-900': 'hover:text-neutral-900',
    'hover:text-gray-700': 'hover:text-neutral-700',
    'active:bg-gray-200': 'active:bg-neutral-200',
};
/**
 * 迁移工具函数
 */
export class ColorMigrator {
    /**
     * 替换单个类名中的硬编码颜色
     */
    static replaceSingleColor(className) {
        // 直接匹配颜色映射
        if (colorMigrationMap[className]) {
            return colorMigrationMap[className];
        }
        // 语义化映射
        if (semanticColorMap[className]) {
            return semanticColorMap[className];
        }
        // 处理透明度变体 (如 bg-white/95)
        const opacityMatch = className.match(/^(bg|text|border)-([a-z]+-[0-9]+)\/(\d+)$/);
        if (opacityMatch) {
            const [, prefix, color, opacity] = opacityMatch;
            const mappedColor = colorMigrationMap[color];
            if (mappedColor) {
                return `${prefix}-${mappedColor.replace('var(--color-', '').replace(')', '')}/${opacity}`;
            }
        }
        return className;
    }
    /**
     * 替换类名字符串中的所有硬编码颜色
     */
    static replaceColors(classString) {
        if (!classString || typeof classString !== 'string') {
            return classString;
        }
        return classString
            .split(' ')
            .map(className => this.replaceSingleColor(className))
            .join(' ');
    }
    /**
     * 生成迁移报告
     */
    static generateMigrationReport(content) {
        const originalClasses = content.split(/[\s\n]+/).filter(Boolean);
        const changes = [];
        let totalChanges = 0;
        const migrated = originalClasses.map(className => {
            const replaced = this.replaceSingleColor(className);
            if (replaced !== className) {
                changes.push(`${className} → ${replaced}`);
                totalChanges++;
            }
            return replaced;
        }).join(' ');
        return {
            original: content,
            migrated,
            changes,
            totalChanges
        };
    }
    /**
     * 批量迁移文件内容
     */
    static migrateFileContent(content) {
        // 匹配 className 属性的内容
        return content.replace(/className={?["'`]([^"'`]+)["'`]?/g, (match, classContent) => {
            const migrated = this.replaceColors(classContent);
            return match.replace(classContent, migrated);
        });
    }
    /**
     * 验证迁移结果
     */
    static validateMigration(original, migrated) {
        const issues = [];
        const recommendations = [];
        // 检查是否还有硬编码颜色
        const hardcodedColors = migrated.match(/(bg|text|border)-([a-z]+-[0-9]+)/g);
        if (hardcodedColors) {
            issues.push(`仍存在硬编码颜色: ${hardcodedColors.join(', ')}`);
        }
        // 检查CSS变量格式
        const invalidVariables = migrated.match(/var\(--[^)]+\)/g)?.filter(v => !v.match(/^var\(--(color|spacing|font)-[a-z0-9-]+\)$/));
        if (invalidVariables) {
            issues.push(`无效的CSS变量格式: ${invalidVariables.join(', ')}`);
        }
        // 检查类名长度是否合理
        const longClasses = migrated.split(' ').filter(c => c.length > 50);
        if (longClasses.length > 0) {
            recommendations.push(`发现过长类名，建议优化: ${longClasses.join(', ')}`);
        }
        return {
            isValid: issues.length === 0,
            issues,
            recommendations
        };
    }
}
// 静态属性，用于外部访问
ColorMigrator.colorMigrationMap = colorMigrationMap;
ColorMigrator.semanticColorMap = semanticColorMap;
/**
 * 迁移配置
 */
export const migrationConfig = {
    // 需要迁移的文件模式
    filePatterns: [
        'packages/core/src/**/*.{ts,tsx}',
        'packages/core/src/**/*.stories.tsx',
    ],
    // 排除的文件
    excludePatterns: [
        '**/*.test.tsx',
        '**/*.spec.tsx',
        '**/node_modules/**',
        '**/dist/**',
    ],
    // 迁移选项
    options: {
        dryRun: false, // 是否只生成报告不实际修改
        backup: true, // 是否创建备份
        validate: true, // 是否验证迁移结果
        reportFormat: 'json', // 报告格式: json | markdown | console
    },
    // 优先级迁移的组件
    priorityComponents: [
        'Button',
        'Input',
        'Card',
        'Modal',
        'Alert',
        'Toast',
        'Navbar',
        'Sidebar',
    ],
};
/**
 * 默认导出
 */
export default {
    ColorMigrator,
    colorMigrationMap,
    semanticColorMap,
    migrationConfig,
};
