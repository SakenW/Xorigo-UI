/**
 * @xorigo-cli/commands
 *
 * Xorigo UI CLI 主入口
 * 提供组件脚手架、质量检查、令牌导出等功能
 */

import { Command, InvalidArgumentError } from 'commander'
import chalk from 'chalk'
import { logger } from './utils/logger'

// 导入所有命令
import {
  addCommand,
  initCommand,
  themeCommand,
  buildCommand,
  generateCommand,
  publishCommand,
  tokensCommand,
  i18nCommand,
  registryCommand,
  checkCommand,
  doctorCommand,
  syncCommand
} from './commands/index'

/**
 * CLI 版本
 */
const VERSION = '2025.11.05'

/**
 * 创建主程序
 */
export const createProgram = () => {
  const program = new Command()

  // 程序信息
  program
    .name('xorigo')
    .description('Xorigo UI CLI - 现代化组件库脚手架工具')
    .version(VERSION, '-v, --version', '显示版本号')
    .helpOption('-h, --help', '显示帮助信息')

  // 全局选项
  program
    .option('--verbose', '显示详细日志', false)
    .option('--quiet', '静默模式', false)

  // 注册所有命令
  program
    .addCommand(initCommand)
    .addCommand(addCommand)
    .addCommand(themeCommand)
    .addCommand(buildCommand)
    .addCommand(generateCommand)
    .addCommand(publishCommand)
    .addCommand(tokensCommand)
    .addCommand(i18nCommand)
    .addCommand(registryCommand)
    .addCommand(checkCommand)
    .addCommand(doctorCommand)
    .addCommand(syncCommand)

  // 自定义帮助信息
  program.addHelpCommand('help [command]', '显示命令帮助')

  // 未知命令处理
  program.on('command:*', (commands) => {
    logger.error(`未知命令: ${commands[0]}`)
    logger.info(`使用 'xorigo --help' 查看可用命令`)
    process.exit(1)
  })

  // 无参数时显示帮助
  if (process.argv.length === 2) {
    program.outputHelp()
    process.exit(0)
  }

  return program
}

/**
 * 主函数
 */
async function main() {
  try {
    const program = createProgram()
    await program.parseAsync()
  } catch (error) {
    if (error instanceof InvalidArgumentError) {
      logger.error(error.message)
      process.exit(1)
    }

    if (error instanceof Error) {
      logger.error(error.message)
      logger.debug(error.stack)
    } else {
      logger.error('未知错误')
    }

    process.exit(1)
  }
}

// 导出 CLI 实例
export const program = createProgram()

// 如果直接运行此文件
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch((error) => {
    logger.error('初始化 CLI 失败:', error)
    process.exit(1)
  })
}
