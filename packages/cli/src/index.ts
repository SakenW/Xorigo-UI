/**
 * @xorigo-cli/commands
 *
 * Xorigo UI CLI 核心模块
 * 提供组件脚手架、质量检查、令牌导出等功能
 */

export { program } from 'commander'

// 导出命令处理函数
export * from './commands/index'

// 导出工具函数
export * from './utils/logger'
export * from './utils/file-system'
export * from './utils/validation'
