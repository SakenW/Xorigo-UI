"use strict";
/**
 * 组件分类系统检测模块
 * 基于 COMPONENT-CLASSIFICATION-SYSTEM.md 的组件分类规则
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.classificationSystemModule = void 0;
/**
 * 组件分类系统检测模块
 */
exports.classificationSystemModule = {
    id: 'classification-system',
    name: '组件分类系统检测',
    description: '检测组件是否符合分类系统规范，确保组件位于正确的分类目录',
    enabled: true,
    tokenCost: 80,
    rules: [
        {
            id: 'classification-directory-placement',
            name: '组件目录位置检查',
            description: '组件应该位于对应的分类目录中',
            severity: 'error',
            category: 'structure'
        },
        {
            id: 'classification-naming-consistency',
            name: '组件命名一致性检查',
            description: '组件命名应该与分类和功能保持一致',
            severity: 'warning',
            category: 'naming'
        },
        {
            id: 'classification-api-compliance',
            name: 'API 设计规范检查',
            description: '组件 API 应该符合对应分类的设计标准',
            severity: 'info',
            category: 'api'
        }
    ],
    async check(context) {
        const results = [];
        const { filePath, content, operation } = context;
        if (!content || !['create', 'edit'].includes(operation)) {
            return results;
        }
        // 只检测 packages 目录中的组件
        if (!filePath.includes('/packages/') || !this.isComponentFile(filePath)) {
            return results;
        }
        // 获取组件信息
        const componentInfo = this.extractComponentInfo(filePath, content);
        if (componentInfo) {
            await this.checkDirectoryPlacement(filePath, componentInfo, results);
            await this.checkNamingConsistency(filePath, componentInfo, results);
            await this.checkAPICompliance(filePath, componentInfo, content, results);
        }
        return results;
    },
    /**
     * 检查组件目录位置是否正确
     */
    async checkDirectoryPlacement(filePath, componentInfo, results) {
        const expectedCategory = this.determineComponentCategory(componentInfo.name, componentInfo.usage);
        const currentDirectory = this.getCurrentDirectory(filePath);
        const expectedDirectory = this.getExpectedDirectory(expectedCategory);
        if (currentDirectory !== expectedDirectory) {
            results.push({
                ruleId: 'classification-directory-placement',
                severity: 'error',
                message: `组件 "${componentInfo.name}" 应该位于 "${expectedDirectory}" 目录，当前位置: "${currentDirectory}"`,
                suggestion: `将组件移动到正确的分类目录`,
                autoFix: {
                    command: `mkdir -p packages/core/src/${expectedDirectory}\nmv "${filePath}" "packages/core/src/${expectedDirectory}/${componentInfo.name}.tsx"`,
                    description: '移动组件到正确的分类目录'
                }
            });
        }
    },
    /**
     * 检查组件命名一致性
     */
    async checkNamingConsistency(filePath, componentInfo, results) {
        const category = this.determineComponentCategory(componentInfo.name, componentInfo.usage);
        const namingRules = this.getNamingRules(category);
        // 检查组件名称是否符合命名规则
        if (!this.followsNamingRules(componentInfo.name, namingRules)) {
            results.push({
                ruleId: 'classification-naming-consistency',
                severity: 'warning',
                message: `组件 "${componentInfo.name}" 的命名不符合 ${category} 分类的命名规范`,
                suggestion: namingRules.suggestion
            });
        }
        // 检查 Props 命名是否规范
        if (componentInfo.props) {
            const invalidProps = this.checkPropsNaming(componentInfo.props, category);
            if (invalidProps.length > 0) {
                results.push({
                    ruleId: 'classification-naming-consistency',
                    severity: 'warning',
                    message: `发现不符合规范的 Props: ${invalidProps.join(', ')}`,
                    suggestion: '使用标准的 Props 命名规范'
                });
            }
        }
    },
    /**
     * 检查 API 设计规范
     */
    async checkAPICompliance(filePath, componentInfo, content, results) {
        const category = this.determineComponentCategory(componentInfo.name, componentInfo.usage);
        const apiStandards = this.getAPIStandards(category);
        // 检查是否必需的 Props
        const missingProps = this.checkRequiredProps(componentInfo.props, apiStandards.requiredProps);
        if (missingProps.length > 0) {
            results.push({
                ruleId: 'classification-api-compliance',
                severity: 'info',
                message: `${category} 组件建议包含以下 Props: ${missingProps.join(', ')}`,
                suggestion: `添加标准的 ${missingProps.join(', ')} Props 以提高组件一致性`
            });
        }
        // 检查是否支持标准变体
        if (apiStandards.variants && !componentInfo.variants) {
            results.push({
                ruleId: 'classification-api-compliance',
                severity: 'info',
                message: `建议为 ${category} 组件添加标准变体支持`,
                suggestion: `实现变体: ${apiStandards.variants.join(', ')}`
            });
        }
        // 检查可访问性支持
        if (apiStandards.accessibility && !this.hasAccessibilitySupport(content)) {
            results.push({
                ruleId: 'classification-api-compliance',
                severity: 'info',
                message: `建议为 ${category} 组件添加可访问性支持`,
                suggestion: '添加 ARIA 标签、键盘导航和屏幕阅读器支持'
            });
        }
    },
    /**
     * 提取组件信息
     */
    extractComponentInfo(filePath, content) {
        const componentName = this.extractComponentName(content);
        if (!componentName)
            return null;
        return {
            name: componentName,
            props: this.extractProps(content),
            variants: this.extractVariants(content),
            usage: this.analyzeComponentUsage(content)
        };
    },
    /**
     * 提取组件名称
     */
    extractComponentName(content) {
        const patterns = [
            /export\s+(?:default\s+)?(?:const|function)\s+([A-Z][a-zA-Z]*)/g,
            /export\s+const\s+([A-Z][a-zA-Z]*)\s*:\s*React\./g,
            /function\s+([A-Z][a-zA-Z]*)/g
        ];
        for (const pattern of patterns) {
            const match = pattern.exec(content);
            if (match) {
                return match[1];
            }
        }
        return null;
    },
    /**
     * 提取 Props 定义
     */
    extractProps(content) {
        const interfaceMatch = content.match(/interface\s+\w+Props\s*{([^}]+)}/s);
        if (!interfaceMatch)
            return [];
        const propsContent = interfaceMatch[1];
        const propMatches = propsContent.match(/(\w+)\s*[?:]/g);
        return propMatches ? propMatches.map(prop => prop.replace(/[?:]/g, '')) : [];
    },
    /**
     * 提取变体信息
     */
    extractVariants(content) {
        return content.includes('variants:') || content.includes('variant?:');
    },
    /**
     * 分析组件用途
     */
    analyzeComponentUsage(content) {
        const usage = [];
        if (content.includes('onClick') || content.includes('onSubmit')) {
            usage.push('interactive');
        }
        if (content.includes('children') || content.includes('ReactNode')) {
            usage.push('container');
        }
        if (content.includes('input') || content.includes('onChange')) {
            usage.push('input');
        }
        if (content.includes('loading') || content.includes('disabled')) {
            usage.push('stateful');
        }
        return usage;
    },
    /**
     * 确定组件分类
     */
    determineComponentCategory(name, usage) {
        // 基于组件名称的分类规则
        const categoryMappings = {
            // Base 组件
            'Button': 'base', 'Text': 'base', 'Icon': 'base', 'Link': 'base', 'Divider': 'base', 'Avatar': 'base',
            // Layout 组件
            'Box': 'layout', 'Flex': 'layout', 'Grid': 'layout', 'Container': 'layout', 'Spacer': 'layout',
            // Navigation 组件
            'Menu': 'navigation', 'Tab': 'navigation', 'Breadcrumb': 'navigation', 'Pagination': 'navigation',
            // Form 组件
            'Input': 'form', 'Select': 'form', 'Checkbox': 'form', 'Radio': 'form', 'Switch': 'form',
            // Data Display 组件
            'Table': 'data-display', 'List': 'data-display', 'Card': 'data-display', 'Tag': 'data-display',
            // Feedback 组件
            'Modal': 'feedback', 'Toast': 'feedback', 'Alert': 'feedback', 'Progress': 'feedback', 'Loading': 'feedback'
        };
        // 检查精确匹配
        for (const [componentName, category] of Object.entries(categoryMappings)) {
            if (name === componentName) {
                return category;
            }
        }
        // 检查包含关系
        if (name.includes('Button') || name.includes('Text') || name.includes('Icon')) {
            return 'base';
        }
        if (name.includes('Layout') || name.includes('Grid') || name.includes('Flex')) {
            return 'layout';
        }
        if (name.includes('Menu') || name.includes('Nav') || name.includes('Tab')) {
            return 'navigation';
        }
        if (name.includes('Input') || name.includes('Select') || name.includes('Form')) {
            return 'form';
        }
        if (name.includes('Table') || name.includes('List') || name.includes('Card')) {
            return 'data-display';
        }
        if (name.includes('Modal') || name.includes('Alert') || name.includes('Toast')) {
            return 'feedback';
        }
        // 基于用途的分类
        if (usage.includes('interactive') && !usage.includes('container')) {
            return 'base';
        }
        if (usage.includes('container')) {
            return 'layout';
        }
        if (usage.includes('input')) {
            return 'form';
        }
        // 默认分类
        return 'composite';
    },
    /**
     * 获取当前目录
     */
    getCurrentDirectory(filePath) {
        const match = filePath.match(/\/packages\/core\/src\/([^\/]+)\//);
        return match ? match[1] : 'unknown';
    },
    /**
     * 获取期望的目录
     */
    getExpectedDirectory(category) {
        const directoryMappings = {
            'base': 'ui',
            'layout': 'layout',
            'navigation': 'navigation',
            'form': 'forms',
            'data-display': 'data-display',
            'feedback': 'feedback',
            'composite': 'composite',
            'system': 'system',
            'visualization': 'visualization'
        };
        return directoryMappings[category] || 'ui';
    },
    /**
     * 获取命名规则
     */
    getNamingRules(category) {
        const rules = {
            'base': {
                pattern: /^[A-Z][a-zA-Z]*$/,
                suggestion: 'Base 组件应该使用简洁的 PascalCase 名称，如 Button, Input, Icon'
            },
            'layout': {
                pattern: /^[A-Z][a-zA-Z]*(?:Layout|Container|Wrapper)?$/,
                suggestion: 'Layout 组件名称应该包含 Layout, Container 或 Wrapper 后缀'
            },
            'navigation': {
                pattern: /^[A-Z][a-zA-Z]*(?:Nav|Menu|Tab|Breadcrumb)?$/,
                suggestion: 'Navigation 组件名称应该体现导航功能'
            },
            'form': {
                pattern: /^[A-Z][a-zA-Z]*(?:Input|Select|Field)?$/,
                suggestion: 'Form 组件名称应该明确表示输入功能'
            }
        };
        return rules[category] || { pattern: /^[A-Z][a-zA-Z]*$/, suggestion: '使用 PascalCase 命名' };
    },
    /**
     * 检查是否遵循命名规则
     */
    followsNamingRules(name, rules) {
        return rules.pattern.test(name);
    },
    /**
     * 检查 Props 命名
     */
    checkPropsNaming(props, category) {
        const invalidProps = [];
        // 检查标准 Props
        const standardProps = ['className', 'children', 'disabled', 'variant', 'size'];
        const missingStandardProps = standardProps.filter(prop => !props.includes(prop));
        if (missingStandardProps.length > 0 && props.length > 2) {
            // 如果组件有较多 Props 但缺少标准 Props，提醒添加
            invalidProps.push(...missingStandardProps.map(prop => `建议添加 ${prop}`));
        }
        return invalidProps;
    },
    /**
     * 获取 API 标准
     */
    getAPIStandards(category) {
        const standards = {
            'base': {
                requiredProps: ['className', 'children'],
                variants: ['variant', 'size'],
                accessibility: true
            },
            'form': {
                requiredProps: ['value', 'onChange'],
                variants: ['variant', 'size'],
                accessibility: true
            },
            'layout': {
                requiredProps: ['children'],
                variants: ['direction', 'spacing'],
                accessibility: false
            }
        };
        return standards[category] || { requiredProps: [], variants: [], accessibility: false };
    },
    /**
     * 检查必需的 Props
     */
    checkRequiredProps(actualProps, requiredProps) {
        return requiredProps.filter(prop => !actualProps.includes(prop));
    },
    /**
     * 检查是否有可访问性支持
     */
    hasAccessibilitySupport(content) {
        const accessibilityPatterns = [
            /aria-/,
            /role=/,
            /tabIndex=/,
            /onKeyDown/,
            /onFocus/,
            /ref=/
        ];
        return accessibilityPatterns.some(pattern => pattern.test(content));
    },
    /**
     * 判断是否为组件文件
     */
    isComponentFile(filePath) {
        return /\.(tsx|jsx)$/.test(filePath) &&
            (filePath.includes('/ui/') ||
                filePath.includes('/components/') ||
                filePath.includes('/forms/') ||
                filePath.includes('/layout/'));
    }
};
// 注册模块
const detection_core_1 = require("../../core/detection-core");
detection_core_1.DetectionSystem.registerModule(exports.classificationSystemModule);
