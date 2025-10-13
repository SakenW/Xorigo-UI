#!/usr/bin/env node
/**
 * @fileoverview 构建前数据一致性校验脚本
 *
 * 此脚本在构建前运行,确保所有数据适配层的数据一致性
 * 如果校验失败,将阻断构建过程
 *
 * 使用: npm run prebuild
 * 或: tsx scripts/validate-readonly-consistency.ts
 */

import { validateAllConsistency, printValidationReport } from '../src/data/validation'

/**
 * 主函数
 */
async function main() {
  console.log('\n🚀 开始构建前数据一致性校验...\n')

  try {
    // 执行完整验证
    const report = validateAllConsistency()

    // 打印详细报告
    printValidationReport(report)

    // 根据验证结果决定是否阻断构建
    if (!report.summary.isValid) {
      console.error('\n❌ 数据一致性校验失败,构建已阻断!\n')
      console.error('请修复以上错误后重新构建。\n')
      process.exit(1)
    }

    // 如果有警告,给出提示但不阻断构建
    if (report.summary.totalWarnings > 0) {
      console.warn(
        `\n⚠️  检测到 ${report.summary.totalWarnings} 个警告,建议修复后重新构建。\n`,
      )
      console.log('✅ 允许继续构建,但请关注以上警告。\n')
    } else {
      console.log('\n✅ 数据一致性校验通过,继续构建。\n')
    }

    process.exit(0)
  } catch (error) {
    console.error('\n❌ 校验脚本执行失败:\n')
    console.error(error)
    console.error('\n构建已阻断!\n')
    process.exit(1)
  }
}

// 执行主函数
main()
