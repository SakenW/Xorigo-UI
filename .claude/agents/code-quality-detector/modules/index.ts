/**
 * 检测模块总入口
 * 自动注册所有检测模块
 */

// 导入所有模块，这会自动注册它们
import './common'
import './apps'
import './packages'

/**
 * 检测模块初始化状态
 */
export const MODULE_STATUS = {
  loaded: true,
  timestamp: new Date().toISOString(),
  modules: {
    common: ['structure-common'],
    apps: ['naming-app', 'content-app'],
    packages: ['naming-package', 'api-component']
  }
}

/**
 * 获取模块统计信息
 */
export function getModuleStats() {
  const totalModules = Object.values(MODULE_STATUS.modules).flat().length
  const moduleCounts = Object.entries(MODULE_STATUS.modules).map(([category, modules]) => ({
    category,
    count: modules.length
  }))

  return {
    total: totalModules,
    byCategory: moduleCounts,
    loaded: MODULE_STATUS.loaded
  }
}