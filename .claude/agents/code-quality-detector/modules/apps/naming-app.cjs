"use strict";
/**
 * Apps 目录命名规范检测模块
 * 针对应用目录的特殊命名要求
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.appsNamingModule = void 0;
const APPS_NAMING_RULES = [
    {
        id: 'apps-page-route',
        name: '页面路由命名',
        description: '页面文件夹应使用 kebab-case 命名',
        pattern: /^app\/\([^)]+\)\/[a-z0-9-]+$/,
        severity: 'error',
        category: 'naming'
    },
    {
        id: 'apps-component-folder',
        name: '组件文件夹命名',
        description: '组件文件夹应使用 PascalCase',
        pattern: /^components\/[A-Z][a-zA-Z0-9]*$/,
        severity: 'error',
        category: 'naming'
    },
    {
        id: 'apps-layout-folder',
        name: '布局文件夹命名',
        description: '布局文件夹应使用 PascalCase',
        pattern: /^layouts\/[A-Z][a-zA-Z0-9]*$/,
        severity: 'error',
        category: 'naming'
    }
];
/**
 * Apps 目录命名检测模块
 */
exports.appsNamingModule = {
    id: 'naming-app',
    name: 'Apps 命名规范检测',
    description: '检测应用目录的命名规范',
    enabled: true,
    tokenCost: 50, // 较低的 token 消耗
    rules: APPS_NAMING_RULES,
    async check(context) {
        const results = [];
        const { filePath, operation } = context;
        // 只检测特定操作
        if (!['create', 'edit', 'move'].includes(operation)) {
            return results;
        }
        // 提取相对路径
        const relativePath = filePath.replace(/^.*\/apps\//, '');
        // 检查页面路由命名
        if (relativePath.startsWith('app/')) {
            const routeMatch = relativePath.match(/^app\/\([^)]+\)\/([^\/]+)/);
            if (routeMatch) {
                const routeName = routeMatch[1];
                if (!/^[a-z0-9-]+$/.test(routeName)) {
                    results.push({
                        ruleId: 'apps-page-route',
                        severity: 'error',
                        message: `页面路由文件夹 "${routeName}" 应使用 kebab-case 命名（小写字母和连字符）`,
                        suggestion: `建议重命名为: ${routeName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
                        autoFix: {
                            command: `mv "${filePath}" "${filePath.replace(routeName, routeName.toLowerCase().replace(/[^a-z0-9]+/g, '-'))}"`,
                            description: '重命名为 kebab-case 格式'
                        }
                    });
                }
            }
        }
        // 检查组件文件夹命名
        if (relativePath.includes('components/')) {
            const componentParts = relativePath.split('components/')[1]?.split('/') || [];
            const componentName = componentParts[0];
            if (componentName && !/^[A-Z][a-zA-Z0-9]*$/.test(componentName)) {
                results.push({
                    ruleId: 'apps-component-folder',
                    severity: 'error',
                    message: `组件文件夹 "${componentName}" 应使用 PascalCase 命名`,
                    suggestion: `建议重命名为: ${toPascalCase(componentName)}`,
                    autoFix: {
                        command: `mv "${filePath}" "${filePath.replace(componentName, toPascalCase(componentName))}"`,
                        description: '重命名为 PascalCase 格式'
                    }
                });
            }
        }
        // 检查文件命名
        const fileName = filePath.split('/').pop() || '';
        const fileDir = filePath.split('/').slice(-2, -1)[0] || '';
        // 组件文件应该是 PascalCase
        if (fileDir === 'components' && fileName.endsWith('.tsx') || fileName.endsWith('.ts')) {
            const baseName = fileName.replace(/\.(tsx?|jsx?)$/, '');
            if (!/^[A-Z][a-zA-Z0-9]*$/.test(baseName)) {
                results.push({
                    ruleId: 'apps-component-file',
                    severity: 'error',
                    message: `组件文件 "${fileName}" 应使用 PascalCase 命名`,
                    suggestion: `建议重命名为: ${toPascalCase(baseName)}.${fileName.split('.').pop()}`,
                    autoFix: {
                        command: `mv "${filePath}" "${filePath.replace(fileName, toPascalCase(baseName) + '.' + fileName.split('.').pop())}"`,
                        description: '重命名为 PascalCase 格式'
                    }
                });
            }
        }
        return results;
    }
};
/**
 * 转换为 PascalCase
 */
function toPascalCase(str) {
    return str
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/\s+/g, '');
}
// 注册模块
const detection_core_1 = require("../../core/detection-core");
detection_core_1.DetectionSystem.registerModule(exports.appsNamingModule);
