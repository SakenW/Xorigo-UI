"use strict";
/**
 * 检测模块总入口
 * 自动注册所有检测模块
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULE_STATUS = void 0;
exports.getModuleStats = getModuleStats;
// 导入所有模块，这会自动注册它们
require("./common");
require("./apps");
require("./packages");
/**
 * 检测模块初始化状态
 */
exports.MODULE_STATUS = {
    loaded: true,
    timestamp: new Date().toISOString(),
    modules: {
        common: ['structure-common'],
        apps: ['naming-app', 'content-app'],
        packages: ['naming-package', 'api-component']
    }
};
/**
 * 获取模块统计信息
 */
function getModuleStats() {
    const totalModules = Object.values(exports.MODULE_STATUS.modules).flat().length;
    const moduleCounts = Object.entries(exports.MODULE_STATUS.modules).map(([category, modules]) => ({
        category,
        count: modules.length
    }));
    return {
        total: totalModules,
        byCategory: moduleCounts,
        loaded: exports.MODULE_STATUS.loaded
    };
}
