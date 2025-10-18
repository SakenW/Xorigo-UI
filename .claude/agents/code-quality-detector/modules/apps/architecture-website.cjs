"use strict";
/**
 * Website 架构规则检测模块
 * 基于 CRITICAL-ARCHITECTURE-RULE.md 的架构要求
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.websiteArchitectureModule = void 0;
/**
 * Website 架构规则检测模块
 */
exports.websiteArchitectureModule = {
    id: 'architecture-website',
    name: 'Website 架构规则检测',
    description: '检测 Website 是否违反架构规则，确保所有 UI 组件来自 packages',
    enabled: true,
    tokenCost: 100, // 中等 token 消耗，需要解析代码
    rules: [
        {
            id: 'website-no-ui-components',
            name: '禁止创建 UI 组件',
            description: 'Website 中不能创建 UI 组件，必须从 packages 引入',
            severity: 'error',
            category: 'architecture'
        },
        {
            id: 'website-ui-imports',
            name: 'UI 组件导入检查',
            description: 'UI 组件必须从 @xorigo-ui 包导入',
            severity: 'error',
            category: 'architecture'
        },
        {
            id: 'website-component-extensions',
            name: '禁止扩展 packages 组件',
            description: '不能继承或扩展 packages 中的组件',
            severity: 'error',
            category: 'architecture'
        },
        {
            id: 'website-style-overrides',
            name: '禁止覆盖组件样式',
            description: '不能通过 className 覆盖 packages 组件的默认样式',
            severity: 'warning',
            category: 'architecture'
        }
    ],
    async check(context) {
        const results = [];
        const { filePath, content, operation } = context;
        if (!content || !['create', 'edit'].includes(operation)) {
            return results;
        }
        // 只检测 Website 目录
        if (!filePath.includes('/apps/website/')) {
            return results;
        }
        // 检测各种架构违规
        await this.checkUIComponentCreation(filePath, content, results);
        await this.checkUIComponentImports(filePath, content, results);
        await this.checkComponentExtensions(filePath, content, results);
        await this.checkStyleOverrides(filePath, content, results);
        return results;
    },
    /**
     * 检查是否在 Website 中创建了 UI 组件
     */
    async checkUIComponentCreation(filePath, content, results) {
        // 定义常见的 UI 组件名称模式
        const uiComponentPatterns = [
            // 基础 UI 组件
            /\b(?:Button|Card|Input|Select|Modal|Dialog|Popover|Tooltip|Badge|Tag|Avatar|Icon)\b/g,
            /\b(?:Table|List|Grid|Flex|Box|Container|Spacer|Divider)\b/g,
            /\b(?:Menu|Tabs|Breadcrumb|Pagination|Steps|Sidebar|Navbar)\b/g,
            /\b(?:Checkbox|Radio|Switch|Slider|DatePicker|Upload|Form)\b/g,
            /\b(?:Toast|Message|Notification|Progress|Spinner|Loading|Skeleton)\b/g,
            /\b(?:Accordion|Collapse|Drawer|Alert|Result|Empty)\b/g,
            // 常见 UI 组件变体
            /\b[A-Z][a-zA-Z]*(?:Button|Card|Input|Modal|Dialog|List|Grid|Menu|Tab|Form)\b/g,
            /\b[A-Z][a-zA-Z]*(?:Component|Widget|Element)\b/g
        ];
        // 检查函数/组件定义
        const componentDefinitionPatterns = [
            /(?:export\s+)?(?:const|function)\s+([A-Z][a-zA-Z]*)\s*=\s*(?:\([^)]*\)\s*=>|function)/g,
            /(?:export\s+)?function\s+([A-Z][a-zA-Z]*)\s*\(/g,
            /(?:export\s+)?(?:const|let|var)\s+([A-Z][a-zA-Z]*)\s*:\s*React\./g,
            /export\s+(?:default\s+)?(?:function|const)\s+([A-Z][a-zA-Z]*)/g
        ];
        for (const pattern of componentDefinitionPatterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const componentName = match[1] || match[0];
                // 检查是否是 UI 组件
                if (this.isUIComponentName(componentName)) {
                    // 检查是否是允许的业务组件
                    if (!this.isAllowedBusinessComponent(componentName, content, match.index)) {
                        results.push({
                            ruleId: 'website-no-ui-components',
                            severity: 'error',
                            message: `Website 中创建了 UI 组件 "${componentName}"，违反架构规则`,
                            suggestion: 'UI 组件必须在 packages/ 目录中创建，Website 只能从 @xorigo-ui 导入使用',
                            autoFix: {
                                command: `# 将组件移动到 packages 目录\nmv "${filePath}" "packages/core/src/ui/${componentName}.tsx"`,
                                description: '将 UI 组件移动到 packages 目录'
                            }
                        });
                    }
                }
            }
        }
    },
    /**
     * 检查 UI 组件导入是否正确
     */
    async checkUIComponentImports(filePath, content, results) {
        // 检查 import 语句
        const importPatterns = [
            /import\s+.*?\s+from\s+['"]([^'"]+)['"]/g,
            /import\s*\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g
        ];
        for (const pattern of importPatterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const importPath = match[1] || match[2];
                const importNames = match[1] ? match[2] : match[1];
                // 检查是否是相对路径导入组件（违规）
                if (importPath.startsWith('./') || importPath.startsWith('../')) {
                    if (this.containsUIComponents(importNames || importPath)) {
                        results.push({
                            ruleId: 'website-ui-imports',
                            severity: 'error',
                            message: `使用相对路径导入 UI 组件: "${importPath}"`,
                            suggestion: 'UI 组件必须从 @xorigo-ui/core 导入',
                            autoFix: {
                                command: `# 替换为正确的导入\nsed -i 's|from "${importPath}"|from "@xorigo-ui/core"|g' "${filePath}"`,
                                description: '更新导入路径为 @xorigo-ui/core'
                            }
                        });
                    }
                }
                // 检查是否从非 @xorigo-ui 包导入 UI 组件
                if (!importPath.startsWith('@xorigo-ui/') && this.containsUIComponents(importNames || importPath)) {
                    results.push({
                        ruleId: 'website-ui-imports',
                        severity: 'error',
                        message: `UI 组件必须从 @xorigo-ui 包导入，当前来源: "${importPath}"`,
                        suggestion: '使用 @xorigo-ui/core 导入所有 UI 组件'
                    });
                }
            }
        }
    },
    /**
     * 检查是否扩展了 packages 组件
     */
    async checkComponentExtensions(filePath, content, results) {
        // 检查继承语句
        const extendsPatterns = [
            /class\s+(\w+)\s+extends\s+(Button|Card|Input|Select|Modal|Dialog|Popover|Tooltip|Badge|Tag|Avatar|Icon|Table|List|Grid|Menu|Tabs|Form|Checkbox|Radio|Switch|Slider|Toast|Message|Progress|Spinner|Accordion|Collapse|Drawer|Alert|Result|Empty)/g,
            /(?:const|let|var)\s+(\w+)\s*=\s*(Button|Card|Input|Select|Modal|Dialog|Popover|Tooltip|Badge|Tag|Avatar|Icon|Table|List|Grid|Menu|Tabs|Form|Checkbox|Radio|Switch|Slider|Toast|Message|Progress|Spinner|Accordion|Collapse|Drawer|Alert|Result|Empty)\.extend/g
        ];
        for (const pattern of extendsPatterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const componentName = match[1];
                const baseComponent = match[2];
                results.push({
                    ruleId: 'website-component-extensions',
                    severity: 'error',
                    message: `组件 "${componentName}" 继承了 packages 组件 "${baseComponent}"`,
                    suggestion: '不能继承或扩展 packages 中的组件，应该使用组合模式',
                    autoFix: {
                        command: `# 使用组合模式重写组件\n# 将继承改为组合使用 ${baseComponent}`,
                        description: '将继承改为组合模式'
                    }
                });
            }
        }
    },
    /**
     * 检查样式覆盖
     */
    async checkStyleOverrides(filePath, content, results) {
        // 检查可能覆盖组件样式的情况
        const styleOverridePatterns = [
            /<(Button|Card|Input|Select|Modal|Dialog|Popover|Tooltip|Badge|Tag|Avatar|Icon|Table|List|Grid|Menu|Tabs|Form|Checkbox|Radio|Switch|Slider|Toast|Message|Progress|Spinner|Accordion|Collapse|Drawer|Alert|Result|Empty)[^>]*\s+className=["'][^"']*(?:custom-|my-|override-|style-)/gi,
            /\.styles?\.(Button|Card|Input|Select|Modal|Dialog|Popover|Tooltip|Badge|Tag|Avatar|Icon|Table|List|Grid|Menu|Tabs|Form|Checkbox|Radio|Switch|Slider|Toast|Message|Progress|Spinner|Accordion|Collapse|Drawer|Alert|Result|Empty)/g
        ];
        for (const pattern of styleOverridePatterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                const componentName = match[1];
                results.push({
                    ruleId: 'website-style-overrides',
                    severity: 'warning',
                    message: `发现可能覆盖 "${componentName}" 组件样式的代码`,
                    suggestion: '避免直接覆盖 packages 组件的样式，使用组件的 variant 或 theme 系统'
                });
            }
        }
    },
    /**
     * 判断是否是 UI 组件名称
     */
    isUIComponentName(name) {
        const uiComponentKeywords = [
            'Button', 'Card', 'Input', 'Select', 'Modal', 'Dialog', 'Popover', 'Tooltip', 'Badge', 'Tag', 'Avatar', 'Icon',
            'Table', 'List', 'Grid', 'Flex', 'Box', 'Container', 'Spacer', 'Divider',
            'Menu', 'Tab', 'Breadcrumb', 'Pagination', 'Step', 'Sidebar', 'Navbar', 'Navigation',
            'Form', 'Field', 'Checkbox', 'Radio', 'Switch', 'Slider', 'Picker', 'Upload', 'Textarea',
            'Toast', 'Message', 'Notification', 'Progress', 'Spinner', 'Loading', 'Skeleton', 'Alert',
            'Accordion', 'Collapse', 'Drawer', 'Result', 'Empty', 'Pane', 'Panel', 'Window',
            'Chart', 'Graph', 'Widget', 'Control', 'Item', 'Element', 'Component'
        ];
        return uiComponentKeywords.some(keyword => name.includes(keyword));
    },
    /**
     * 判断是否是允许的业务组件
     */
    isAllowedBusinessComponent(name, content, position) {
        const allowedPatterns = [
            'Layout', 'Page', 'Section', 'Header', 'Footer', 'Sidebar', 'Wrapper', 'Container', // 布局组件
            'Search', 'Filter', 'Sort', 'Pagination', // 业务逻辑组件
            'Card', 'List', 'Grid' // 组合组件（如果组合了 packages 组件）
        ];
        // 检查组件名称
        if (allowedPatterns.some(pattern => name.includes(pattern))) {
            return true;
        }
        // 检查组件内容是否只使用了 packages 组件
        const componentContent = content.substring(position, Math.min(position + 1000, content.length));
        const hasPackageImports = componentContent.includes('from \'@xorigo-ui/') ||
            componentContent.includes('from "@xorigo-ui/');
        return hasPackageImports && !this.hasDirectUIRendering(componentContent);
    },
    /**
     * 判断导入内容是否包含 UI 组件
     */
    containsUIComponents(importText) {
        const uiKeywords = [
            'Button', 'Card', 'Input', 'Select', 'Modal', 'Dialog', 'Popover', 'Tooltip', 'Badge', 'Tag', 'Avatar', 'Icon',
            'Table', 'List', 'Grid', 'Menu', 'Tab', 'Form', 'Checkbox', 'Radio', 'Switch', 'Slider', 'Toast', 'Alert'
        ];
        return uiKeywords.some(keyword => importText.includes(keyword));
    },
    /**
     * 检查是否有直接的 UI 渲染（非组合）
     */
    hasDirectUIRendering(content) {
        // 检查是否有直接的 HTML 元素渲染（可能表示自定义 UI）
        const directRenderingPatterns = [
            /<\s*(div|span|button|input|select|textarea|a|img|h[1-6]|p|ul|ol|li)(?![^>]*\bclassName\b)[^>]*>/g,
            /React\.createElement\s*\(\s*['"`](div|span|button|input|select|textarea)/g
        ];
        return directRenderingPatterns.some(pattern => pattern.test(content));
    }
};
// 注册模块
const detection_core_1 = require("../../core/detection-core");
detection_core_1.DetectionSystem.registerModule(exports.websiteArchitectureModule);
