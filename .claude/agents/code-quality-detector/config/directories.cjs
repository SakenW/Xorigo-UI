"use strict";
/**
 * 项目目录配置
 * 定义各个监控目录的检测模块和规则
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.FILE_PATTERN_CONFIGS = exports.PROJECT_DIRECTORY_CONFIGS = void 0;
exports.getDirectoryConfig = getDirectoryConfig;
exports.getFilePatternConfig = getFilePatternConfig;
/**
 * 项目目录监控配置
 */
exports.PROJECT_DIRECTORY_CONFIGS = [
    {
        path: '/home/saken/project/Xorigo-UI/packages',
        name: 'Core Package Library',
        modules: ['naming-package', 'api-component', 'classification-system', 'structure-common'],
        excludePatterns: [
            '**/node_modules/**',
            '**/dist/**',
            '**/.git/**',
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/coverage/**'
        ],
        customRules: [
            {
                id: 'packages-no-hardcoded-colors',
                name: '禁止硬编码颜色',
                description: '组件中不能使用硬编码颜色值',
                severity: 'error',
                category: 'content'
            }
        ]
    },
    {
        path: '/home/saken/project/Xorigo-UI/apps/website',
        name: 'Website Application',
        modules: ['naming-app', 'content-app', 'architecture-website', 'structure-common'],
        excludePatterns: [
            '**/node_modules/**',
            '**/.next/**',
            '**/.git/**',
            '**/*.test.ts',
            '**/*.test.tsx',
            '**/out/**'
        ],
        customRules: [
            {
                id: 'website-no-relative-imports',
                name: '禁止相对导入',
                description: 'Website 中避免深层相对路径导入',
                severity: 'warning',
                category: 'structure'
            }
        ]
    }
];
/**
 * 特殊文件模式配置
 */
exports.FILE_PATTERN_CONFIGS = {
    // 组件文件
    component: {
        patterns: ['**/*.tsx', '**/*.jsx'],
        preferredModules: ['api-component', 'naming-app', 'naming-package']
    },
    // 工具函数文件
    utility: {
        patterns: ['**/utils/**/*.ts', '**/lib/**/*.ts'],
        preferredModules: ['naming-package', 'structure-common']
    },
    // 配置文件
    config: {
        patterns: ['**/*.config.js', '**/*.config.ts', 'tailwind.config.*'],
        preferredModules: ['structure-common']
    },
    // 文档文件
    docs: {
        patterns: ['**/*.md', '**/*.mdx'],
        preferredModules: ['structure-common']
    },
    // 测试文件
    test: {
        patterns: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts'],
        preferredModules: ['structure-common']
    }
};
/**
 * 获取目录配置
 */
function getDirectoryConfig(filePath) {
    return exports.PROJECT_DIRECTORY_CONFIGS.find(config => filePath.startsWith(config.path));
}
/**
 * 获取文件模式配置
 */
function getFilePatternConfig(filePath) {
    const fileName = filePath.split('/').pop() || '';
    for (const [type, config] of Object.entries(exports.FILE_PATTERN_CONFIGS)) {
        if (config.patterns.some(pattern => matchPattern(filePath, pattern))) {
            return { type, ...config };
        }
    }
    return null;
}
/**
 * 简单的通配符匹配
 */
function matchPattern(path, pattern) {
    const regexPattern = pattern
        .replace(/\*\*/g, '.*')
        .replace(/\*/g, '[^/]*')
        .replace(/\?/g, '.');
    return new RegExp(regexPattern).test(path);
}
