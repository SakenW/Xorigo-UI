"use strict";
/**
 * 检测系统初始化脚本
 * 加载配置并启动检测系统
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeDetectionSystem = initializeDetectionSystem;
const detection_core_1 = require("./core/detection-core");
const directories_1 = require("./config/directories");
/**
 * 初始化检测系统
 */
function initializeDetectionSystem() {
    console.log('🚀 初始化 Xorigo UI 项目检测系统...');
    // 加载目录配置
    (0, detection_core_1.updateDirectoryConfigs)(directories_1.PROJECT_DIRECTORY_CONFIGS);
    console.log(`✅ 已加载 ${directories_1.PROJECT_DIRECTORY_CONFIGS.length} 个目录配置:`);
    directories_1.PROJECT_DIRECTORY_CONFIGS.forEach(config => {
        console.log(`   📁 ${config.name}: ${config.modules.length} 个检测模块`);
    });
    console.log('🎯 检测系统已准备就绪');
}
// 自动初始化
initializeDetectionSystem();
