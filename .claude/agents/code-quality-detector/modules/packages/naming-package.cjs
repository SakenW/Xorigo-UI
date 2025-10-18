"use strict";
/**
 * Packages 目录命名规范检测模块
 * 针对组件库的严格命名要求
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.packagesNamingModule = void 0;
const PACKAGES_NAMING_RULES = [
    {
        id: 'packages-component-pascal',
        name: '组件文件命名',
        description: '组件文件必须使用 PascalCase',
        severity: 'error',
        category: 'naming'
    },
    {
        id: 'packages-no-version',
        name: '禁止版本号',
        description: '文件名不能包含版本号',
        severity: 'error',
        category: 'naming'
    },
    {
        id: 'packages-no-hyphens',
        name: '禁止连字符',
        description: '组件文件名不能使用连字符',
        severity: 'error',
        category: 'naming'
    },
    {
        id: 'packages-utils-camel',
        name: '工具函数命名',
        description: '工具函数文件使用 camelCase',
        severity: 'error',
        category: 'naming'
    }
];
/**
 * Packages 目录命名检测模块
 */
exports.packagesNamingModule = {
    id: 'naming-package',
    name: 'Packages 命名规范检测',
    description: '检测组件库的严格命名规范',
    enabled: true,
    tokenCost: 60, // 低 token 消耗
    rules: PACKAGES_NAMING_RULES,
    async check(context) {
        const results = [];
        const { filePath, operation } = context;
        // 只检测文件操作
        if (!['create', 'edit', 'move'].includes(operation)) {
            return results;
        }
        const fileName = filePath.split('/').pop() || '';
        const fileDir = filePath.split('/').slice(-2, -1)[0] || '';
        const relativePath = filePath.replace(/^.*\/packages\/[^/]+\//, '');
        // 检查组件文件命名
        if (this.isComponentFile(filePath, fileName)) {
            const baseName = fileName.replace(/\.(tsx?|jsx?)$/, '');
            // 检查 PascalCase
            if (!/^[A-Z][a-zA-Z0-9]*$/.test(baseName)) {
                results.push({
                    ruleId: 'packages-component-pascal',
                    severity: 'error',
                    message: `组件文件 "${fileName}" 必须使用 PascalCase 命名`,
                    suggestion: `建议重命名为: ${toPascalCase(baseName)}.${fileName.split('.').pop()}`,
                    autoFix: {
                        command: `mv "${filePath}" "${filePath.replace(fileName, toPascalCase(baseName) + '.' + fileName.split('.').pop())}"`,
                        description: '重命名为 PascalCase 格式'
                    }
                });
            }
            // 检查版本号
            if (/v\d+/.test(baseName) || /\d+\.\d+/.test(baseName)) {
                results.push({
                    ruleId: 'packages-no-version',
                    severity: 'error',
                    message: `组件文件 "${fileName}" 不能包含版本号`,
                    suggestion: '移除文件名中的版本信息，使用 Git 管理版本'
                });
            }
            // 检查连字符
            if (/-/.test(baseName)) {
                results.push({
                    ruleId: 'packages-no-hyphens',
                    severity: 'error',
                    message: `组件文件 "${fileName}" 不能使用连字符`,
                    suggestion: `使用 PascalCase 替代连字符: ${toPascalCase(baseName)}`
                });
            }
        }
        // 检查工具函数文件命名
        if (this.isUtilFile(filePath, fileName)) {
            const baseName = fileName.replace(/\.(ts|js)$/, '');
            if (!/^[a-z][a-zA-Z0-9]*$/.test(baseName)) {
                results.push({
                    ruleId: 'packages-utils-camel',
                    severity: 'error',
                    message: `工具函数文件 "${fileName}" 应使用 camelCase 命名`,
                    suggestion: `建议重命名为: ${toCamelCase(baseName)}.${fileName.split('.').pop()}`,
                    autoFix: {
                        command: `mv "${filePath}" "${filePath.replace(fileName, toCamelCase(baseName) + '.' + fileName.split('.').pop())}"`,
                        description: '重命名为 camelCase 格式'
                    }
                });
            }
        }
        // 检查目录结构
        if (operation === 'create' || operation === 'move') {
            await this.checkDirectoryStructure(relativePath, results);
        }
        return results;
    },
    /**
     * 判断是否为组件文件
     */
    isComponentFile(filePath, fileName) {
        const componentDirs = ['components', 'ui'];
        const componentExtensions = ['.tsx', '.jsx', '.ts', '.js'];
        const isInComponentDir = componentDirs.some(dir => filePath.includes(`/${dir}/`));
        const hasComponentExtension = componentExtensions.some(ext => fileName.endsWith(ext));
        return isInComponentDir && hasComponentExtension;
    },
    /**
     * 判断是否为工具函数文件
     */
    isUtilFile(filePath, fileName) {
        const utilDirs = ['utils', 'lib', 'helpers'];
        const utilExtensions = ['.ts', '.js'];
        const isInUtilDir = utilDirs.some(dir => filePath.includes(`/${dir}/`));
        const hasUtilExtension = utilExtensions.some(ext => fileName.endsWith(ext));
        return isInUtilDir && hasUtilExtension && !fileName.endsWith('.d.ts');
    },
    /**
     * 检查目录结构
     */
    async checkDirectoryStructure(relativePath, results) {
        // 检查是否在正确的目录中
        const validDirs = [
            'src/components',
            'src/utils',
            'src/hooks',
            'src/types',
            'src/tokens',
            'src/theme',
            'tests',
            'docs',
            'examples'
        ];
        const isInValidDir = validDirs.some(dir => relativePath.startsWith(dir));
        if (!isInValidDir && !relativePath.includes('node_modules')) {
            results.push({
                ruleId: 'packages-invalid-directory',
                severity: 'warning',
                message: `文件位置 "${relativePath}" 不在标准目录结构中`,
                suggestion: `请将文件放置在以下目录之一: ${validDirs.join(', ')}`
            });
        }
    }
};
/**
 * 转换为 PascalCase
 */
function toPascalCase(str) {
    return str
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .replace(/\s+/g, '')
        .replace(/\d+/g, digits => digits); // 保留数字
}
/**
 * 转换为 camelCase
 */
function toCamelCase(str) {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}
// 注册模块
const detection_core_1 = require("../../core/detection-core");
detection_core_1.DetectionSystem.registerModule(exports.packagesNamingModule);
