/**
 * CLI 日志工具
 */

import chalk from 'chalk'

export const logger = {
  info(message: string): void {
    console.log(chalk.blue('ℹ'), message)
  },

  success(message: string): void {
    console.log(chalk.green('✓'), message)
  },

  warn(message: string): void {
    console.log(chalk.yellow('⚠'), message)
  },

  error(message: string): void {
    console.log(chalk.red('✗'), message)
  },

  debug(message: string): void {
    if (process.env.DEBUG) {
      console.log(chalk.gray('⚙'), message)
    }
  },

  section(title: string): void {
    console.log()
    console.log(chalk.bold(title))
    console.log(chalk.gray('━'.repeat(50)))
  },

  list(items: string[], indent = 2): void {
    items.forEach(item => {
      console.log(' '.repeat(indent) + '•', item)
    })
  },
}
