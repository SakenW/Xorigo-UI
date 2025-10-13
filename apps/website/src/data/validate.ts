#!/usr/bin/env node

/**
 * 🔍 数据层验证脚本
 *
 * 用于在开发和构建过程中验证数据层的完整性
 * 可通过 npm run validate:data 运行
 *
 * @author Hive Mind Coder Agent
 * @version 1.0.0
 */

import { validateAllConsistency, printValidationReport, checkDataLayerHealth } from './index'

/**
 * 主验证函数
 */
async function main() {
  console.log('🔍 开始数据层验证...\n')

  try {
    // 执行完整验证
    console.log('执行完整数据验证...')
    const report = validateAllConsistency()

    // 打印详细报告
    printValidationReport(report)

    // 检查健康状态
    console.log('\n🏥 检查健康状态...')
    const health = checkDataLayerHealth()

    // 根据结果设置退出码
    if (report.summary.isValid && health.healthy) {
      console.log('\n✅ 数据层验证通过，系统健康')
      process.exit(0)
    } else {
      console.log('\n❌ 数据层验证失败，存在健康问题')
      process.exit(1)
    }
  } catch (error) {
    console.error('\n💥 验证过程中发生错误:', error)
    process.exit(1)
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main()
}

export { main as validateDataLayer }