#!/usr/bin/env node
"use strict";
/**
 * Xorigo UI 代码质量检测 Agent
 *
 * 这是一个独立的 Claude Agent，专门负责 Xorigo UI 项目的代码质量检测
 * 包括命名规范、架构规则、组件分类等多维度检测
 * 支持 Claude Hook 调用和命令行直接运行
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.quickDetect = exports.AGENT_METADATA = void 0;
exports.detectCodeQuality = detectCodeQuality;
exports.getAgentStatus = getAgentStatus;
exports.configureAgent = configureAgent;
exports.setAgentEnabled = setAgentEnabled;
exports.healthCheck = healthCheck;
const detection_core_1 = require("./core/detection-core");
const modules_1 = require("./modules");
// 导入并初始化检测系统
require("./init");
/**
 * Agent 元数据
 */
exports.AGENT_METADATA = {
    name: 'code-quality-detector',
    displayName: 'Xorigo UI 代码质量检测',
    version: '1.0.0',
    description: '检测 Xorigo UI 项目的代码质量、命名规范和架构规则合规性',
    author: 'Xorigo UI Team',
    tags: ['code-quality', 'naming', 'architecture', 'classification'],
    supportedOperations: ['create', 'edit', 'delete', 'move'],
    targetDirectories: [
        '/home/saken/project/Xorigo-UI/packages',
        '/home/saken/project/Xorigo-UI/apps/website'
    ]
};
/**
 * 执行代码质量检测
 *
 * @param context 检测上下文
 * @returns 检测结果列表
 */
async function detectCodeQuality(context) {
    try {
        console.log(`🔍 [${exports.AGENT_METADATA.name}] 开始检测: ${context.filePath}`);
        const results = await detection_core_1.projectDetectionSystem.detect(context);
        if (results.length > 0) {
            console.log(`⚠️ [${exports.AGENT_METADATA.name}] 发现 ${results.length} 个问题`);
        }
        else {
            console.log(`✅ [${exports.AGENT_METADATA.name}] 未发现问题`);
        }
        return results;
    }
    catch (error) {
        console.error(`❌ [${exports.AGENT_METADATA.name}] 检测失败:`, error);
        return [];
    }
}
/**
 * 获取 Agent 状态和统计信息
 */
function getAgentStatus() {
    const stats = detection_core_1.projectDetectionSystem.getStats();
    const moduleStats = (0, modules_1.getModuleStats)();
    return {
        agent: exports.AGENT_METADATA,
        status: 'active',
        modules: moduleStats,
        performance: {
            estimatedSavings: stats.tokenOptimizer.estimatedSavings,
            directoriesMonitored: stats.directories
        },
        lastUpdate: new Date().toISOString()
    };
}
/**
 * 配置 Agent
 */
function configureAgent(config) {
    console.log(`⚙️ [${exports.AGENT_METADATA.name}] 配置更新:`, config);
    detection_core_1.projectDetectionSystem.configure(config);
}
/**
 * 启用/禁用 Agent
 */
function setAgentEnabled(enabled) {
    console.log(`${enabled ? '✅' : '❌'} [${exports.AGENT_METADATA.name}] ${enabled ? '启用' : '禁用'}`);
    detection_core_1.projectDetectionSystem.setEnabled(enabled);
}
/**
 * Agent 健康检查
 */
async function healthCheck() {
    const status = getAgentStatus();
    const systemHealth = await detection_core_1.projectDetectionSystem.healthCheck();
    return {
        agent: status.agent.name,
        status: systemHealth.status === 'healthy' ? 'healthy' : 'unhealthy',
        details: {
            ...status,
            systemHealth
        }
    };
}
/**
 * 快速检测函数（用于 Claude Hook）
 */
exports.quickDetect = detectCodeQuality;
// CLI 接口 - 支持 Claude Hooks 调用
async function main() {
    const args = process.argv.slice(2);
    try {
        // 解析命令行参数
        const options = parseArgs(args);
        // 构建检测上下文
        const context = buildDetectionContext(options);
        // 执行检测
        const results = await detectCodeQuality(context);
        // 输出结果
        outputResults(results, options);
        // 根据错误级别设置退出码
        const exitCode = determineExitCode(results);
        process.exit(exitCode);
    }
    catch (error) {
        console.error('❌ 检测执行失败:', error instanceof Error ? error.message : String(error));
        process.exit(1);
    }
}
// 解析命令行参数
function parseArgs(args) {
    const options = {
        verbose: false,
        check: null,
        toolInput: null,
        filePath: null,
        operation: 'edit'
    };
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        switch (arg) {
            case '--verbose':
            case '-v':
                options.verbose = true;
                break;
            case '--check':
                options.check = args[++i];
                break;
            case '--tool-input':
                const toolInputJson = args[++i];
                try {
                    options.toolInput = JSON.parse(toolInputJson);
                }
                catch (e) {
                    console.error('❌ 无效的 tool_input JSON:', toolInputJson);
                    process.exit(1);
                }
                break;
            case '--file':
                options.filePath = args[++i];
                break;
            case '--operation':
                options.operation = args[++i];
                break;
            case '--help':
            case '-h':
                showHelp();
                process.exit(0);
            default:
                if (arg.startsWith('--')) {
                    console.error('❌ 未知参数:', arg);
                    process.exit(1);
                }
        }
    }
    return options;
}
// 构建检测上下文
function buildDetectionContext(options) {
    // 从 tool_input 或命令行参数构建上下文
    let toolInput = options.toolInput;
    // 如果没有 tool_input，尝试从命令行参数构建
    if (!toolInput && options.filePath) {
        toolInput = {
            file_path: options.filePath,
            operation: options.operation || 'edit'
        };
    }
    return {
        toolInput,
        operation: options.operation,
        metadata: {
            timestamp: new Date().toISOString(),
            agent: 'code-quality-detector',
            version: exports.AGENT_METADATA.version,
            mode: options.check ? `check-${options.check}` : 'full'
        }
    };
}
// 输出检测结果
function outputResults(results, options) {
    if (!results || results.length === 0) {
        if (options.verbose) {
            console.log('✅ 未发现代码质量问题');
        }
        return;
    }
    // 按严重程度分组
    const errors = results.filter(r => r.severity === 'error');
    const warnings = results.filter(r => r.severity === 'warning');
    const infos = results.filter(r => r.severity === 'info');
    // 输出错误
    if (errors.length > 0) {
        console.log('\n🚨 错误:');
        errors.forEach(result => {
            console.log(`  ❌ ${result.message}`);
            if (result.file) {
                console.log(`     文件: ${result.file}${result.line ? `:${result.line}` : ''}`);
            }
            if (result.rule) {
                console.log(`     规则: ${result.rule}`);
            }
            if (options.verbose && result.context) {
                console.log(`     详情: ${result.context}`);
            }
        });
    }
    // 输出警告
    if (warnings.length > 0) {
        console.log('\n⚠️  警告:');
        warnings.forEach(result => {
            console.log(`  ⚠️  ${result.message}`);
            if (result.file) {
                console.log(`     文件: ${result.file}${result.line ? `:${result.line}` : ''}`);
            }
            if (result.rule) {
                console.log(`     规则: ${result.rule}`);
            }
        });
    }
    // 输出信息（仅在详细模式下）
    if (infos.length > 0 && options.verbose) {
        console.log('\n💡 信息:');
        infos.forEach(result => {
            console.log(`  ℹ️  ${result.message}`);
            if (result.file) {
                console.log(`     文件: ${result.file}`);
            }
        });
    }
    // 输出统计
    const totalIssues = results.length;
    console.log(`\n📊 检测完成: 发现 ${totalIssues} 个问题 (${errors.length} 错误, ${warnings.length} 警告)`);
    // 输出修复建议
    const fixableResults = results.filter(r => r.fixable);
    if (fixableResults.length > 0) {
        console.log('\n🔧 修复建议:');
        fixableResults.forEach(result => {
            if (result.fixSuggestion) {
                console.log(`  💡 ${result.fixSuggestion}`);
            }
        });
    }
}
// 确定退出码
function determineExitCode(results) {
    if (!results || results.length === 0) {
        return 0;
    }
    const errors = results.filter(r => r.severity === 'error');
    const warnings = results.filter(r => r.severity === 'warning');
    if (errors.length > 0) {
        return 1; // 有错误
    }
    else if (warnings.length > 0) {
        return 0; // 仅有警告，视为成功
    }
    return 0;
}
// 显示帮助信息
function showHelp() {
    console.log(`
Xorigo UI 代码质量检测工具 v${exports.AGENT_METADATA.version}

用法:
  node index.js [选项]

选项:
  -v, --verbose              显示详细输出
  --check <type>             指定检查类型 (architecture|naming|full)
  --tool-input <json>        Claude Hook 工具输入 (JSON格式)
  --file <path>              指定检测文件路径
  --operation <type>         操作类型 (edit|write|read|delete)
  -h, --help                 显示此帮助信息

示例:
  node index.js --file /path/to/file.ts
  node index.js --check architecture --file apps/website/components/Button.tsx
  node index.js --tool-input '{"file_path":"src/Button.tsx","operation":"edit"}'
  node index.js --verbose --check naming

支持的检查类型:
  architecture  - Website 架构规则检查
  naming        - 组件命名规范检查
  full          - 完整代码质量检查 (默认)

退出码:
  0  - 成功（无错误或仅有警告）
  1  - 检测到错误
`);
}
// 如果直接运行此脚本，执行主函数
if (require.main === module) {
    main();
}
// 导出主要接口
exports.default = {
    detect: detectCodeQuality,
    getStatus: getAgentStatus,
    configure: configureAgent,
    setEnabled: setAgentEnabled,
    healthCheck,
    metadata: exports.AGENT_METADATA
};
