"use strict";
/**
 * 通用检测系统核心配置
 * 根据不同路径触发相应的检测模块，优化 token 使用
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalDetectionSystem = exports.DetectionSystem = exports.PathRouter = exports.DETECTION_MODULES = exports.DIRECTORY_CONFIGS = void 0;
exports.updateDirectoryConfigs = updateDirectoryConfigs;
/**
 * 路径到模块的映射配置 - 将从外部配置文件导入
 */
exports.DIRECTORY_CONFIGS = [];
/**
 * 更新目录配置
 */
function updateDirectoryConfigs(configs) {
    exports.DIRECTORY_CONFIGS = configs;
    // 重新创建路径路由器实例
    if (exports.globalDetectionSystem) {
        exports.globalDetectionSystem.router = new PathRouter(configs);
    }
}
/**
 * 检测模块注册表
 */
exports.DETECTION_MODULES = new Map();
/**
 * 路径路由器 - 根据文件路径确定要运行的检测模块
 */
class PathRouter {
    constructor(configs) {
        this.configs = configs;
    }
    /**
     * 根据文件路径获取要运行的检测模块
     */
    getModulesForPath(filePath) {
        const config = this.configs.find(cfg => filePath.startsWith(cfg.path));
        if (!config) {
            return []; // 不在监控目录内
        }
        // 检查是否在排除列表中
        const isExcluded = config.excludePatterns?.some(pattern => this.matchPattern(filePath, pattern));
        if (isExcluded) {
            return [];
        }
        // 返回启用的检测模块
        return config.modules
            .map(moduleId => exports.DETECTION_MODULES.get(moduleId))
            .filter(Boolean);
    }
    /**
     * 简单的通配符匹配
     */
    matchPattern(path, pattern) {
        const regexPattern = pattern
            .replace(/\*\*/g, '.*')
            .replace(/\*/g, '[^/]*')
            .replace(/\?/g, '.');
        return new RegExp(regexPattern).test(path);
    }
    /**
     * 获取路径所属的配置
     */
    getConfigForPath(filePath) {
        return this.configs.find(cfg => filePath.startsWith(cfg.path));
    }
}
exports.PathRouter = PathRouter;
/**
 * 检测系统核心类
 */
class DetectionSystem {
    constructor() {
        this.enabled = true;
        this.router = new PathRouter(exports.DIRECTORY_CONFIGS);
    }
    /**
     * 执行检测
     */
    async detect(context) {
        if (!this.enabled) {
            return [];
        }
        // 获取适用的检测模块
        const modules = this.router.getModulesForPath(context.filePath);
        if (modules.length === 0) {
            return []; // 没有适用的检测模块
        }
        // 并行运行所有检测模块
        const results = await Promise.all(modules.map(module => this.runModule(module, context)));
        return results.flat();
    }
    /**
     * 运行单个检测模块
     */
    async runModule(module, context) {
        try {
            if (!module.enabled) {
                return [];
            }
            return await module.check(context);
        }
        catch (error) {
            console.error(`检测模块 ${module.id} 运行失败:`, error);
            return [{
                    ruleId: `${module.id}-error`,
                    severity: 'error',
                    message: `检测模块运行失败: ${error instanceof Error ? error.message : '未知错误'}`
                }];
        }
    }
    /**
     * 启用/禁用检测系统
     */
    setEnabled(enabled) {
        this.enabled = enabled;
    }
    /**
     * 注册检测模块
     */
    static registerModule(module) {
        exports.DETECTION_MODULES.set(module.id, module);
    }
    /**
     * 获取检测统计信息
     */
    getStats() {
        return {
            totalModules: exports.DETECTION_MODULES.size,
            enabledModules: Array.from(exports.DETECTION_MODULES.values()).filter(m => m.enabled).length,
            directoryConfigs: exports.DIRECTORY_CONFIGS.length
        };
    }
}
exports.DetectionSystem = DetectionSystem;
// 创建全局检测系统实例
exports.globalDetectionSystem = new DetectionSystem();
