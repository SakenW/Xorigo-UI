/**
 * 检测系统初始化脚本
 * 加载配置并启动检测系统
 */

import { updateDirectoryConfigs } from './core/detection-core'
import { PROJECT_DIRECTORY_CONFIGS } from './config/directories'

/**
 * 初始化检测系统
 */
export function initializeDetectionSystem(): void {
  console.log('🚀 初始化 Xorigo UI 项目检测系统...')

  // 加载目录配置
  updateDirectoryConfigs(PROJECT_DIRECTORY_CONFIGS)

  console.log(`✅ 已加载 ${PROJECT_DIRECTORY_CONFIGS.length} 个目录配置:`)
  PROJECT_DIRECTORY_CONFIGS.forEach(config => {
    console.log(`   📁 ${config.name}: ${config.modules.length} 个检测模块`)
  })

  console.log('🎯 检测系统已准备就绪')
}

// 自动初始化
initializeDetectionSystem()