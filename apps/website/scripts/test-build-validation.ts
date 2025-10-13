#!/usr/bin/env node
/**
 * @fileoverview 构建验证测试脚本
 *
 * 测试所有构建前校验规则是否能正常工作
 * 包括数据一致性检查、类型检查和 ESLint 规则验证
 */

import { execSync } from 'child_process'
import { writeFileSync, unlinkSync, existsSync } from 'fs'
import { join } from 'path'

interface TestResult {
  name: string
  success: boolean
  message: string
  duration: number
}

/**
 * 执行命令并返回结果
 */
function runCommand(command: string, description: string): TestResult {
  const startTime = Date.now()

  try {
    console.log(`🧪 测试: ${description}`)
    console.log(`   命令: ${command}`)

    const output = execSync(command, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: process.cwd(),
    })

    const duration = Date.now() - startTime
    console.log(`   ✅ 成功 (${duration}ms)`)
    if (output.trim()) {
      console.log(`   输出: ${output.split('\n')[0]}...`)
    }
    console.log()

    return {
      name: description,
      success: true,
      message: '执行成功',
      duration,
    }
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.log(`   ❌ 失败 (${duration}ms)`)
    console.log(`   错误: ${error.message?.split('\n')[0] || String(error)}`)
    console.log()

    return {
      name: description,
      success: false,
      message: error.message || String(error),
      duration,
    }
  }
}

/**
 * 创建测试文件来验证 ESLint 规则
 */
function createTestFile(): string {
  const testFilePath = join(process.cwd(), 'test-forbidden-import.ts')
  const testContent = `
// 测试文件 - 验证 ESLint 规则是否工作
// 这个文件应该触发 ESLint 错误

import { someRegistryFunction } from '@xorigo-ui/registry'
import { someTokenFunction } from '@xorigo-ui/tokens'
import { someI18nFunction } from '@xorigo-ui/i18n'
import { someStyleRecipeFunction } from '@xorigo-ui/style-recipe'

console.log('这个文件应该触发 ESLint 错误')
`

  writeFileSync(testFilePath, testContent)
  return testFilePath
}

/**
 * 清理测试文件
 */
function cleanupTestFile(filePath: string): void {
  if (existsSync(filePath)) {
    unlinkSync(filePath)
  }
}

/**
 * 测试 ESLint 规则是否正确检测到禁止的导入
 */
function testEslintRules(): TestResult {
  const testFile = createTestFile()
  const startTime = Date.now()

  try {
    console.log('🧪 测试: ESLint 规则验证 - 检测禁止的导入')

    const output = execSync(`npx eslint "${testFile}" --format=json`, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: process.cwd(),
    })

    const results = JSON.parse(output)
    const forbiddenImportErrors = results[0]?.messages?.filter(
      (msg: any) => msg.ruleId === 'no-restricted-imports'
    ) || []

    const duration = Date.now() - startTime

    if (forbiddenImportErrors.length >= 4) {
      console.log(`   ✅ 成功检测到 ${forbiddenImportErrors.length} 个禁止导入错误 (${duration}ms)`)
      console.log(`   检测到的包: registry, tokens, i18n, style-recipe`)
      console.log()

      return {
        name: 'ESLint 规则验证',
        success: true,
        message: `成功检测到 ${forbiddenImportErrors.length} 个禁止导入错误`,
        duration,
      }
    } else {
      console.log(`   ❌ 失败: 只检测到 ${forbiddenImportErrors.length} 个错误，期望至少 4 个 (${duration}ms)`)
      console.log()

      return {
        name: 'ESLint 规则验证',
        success: false,
        message: `只检测到 ${forbiddenImportErrors.length} 个错误，期望至少 4 个`,
        duration,
      }
    }
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.log(`   ❌ 失败 (${duration}ms)`)
    console.log(`   错误: ${error.message?.split('\n')[0] || String(error)}`)
    console.log()

    return {
      name: 'ESLint 规则验证',
      success: false,
      message: error.message || String(error),
      duration,
    }
  } finally {
    cleanupTestFile(testFile)
  }
}

/**
 * 测试只读适配器是否正常工作
 */
function testReadonlyAdapters(): TestResult {
  const startTime = Date.now()

  try {
    console.log('🧪 测试: 只读适配器验证')

    // 测试只读适配器导入
    const output = execSync(`node -e "
      try {
        const { readonlyRegistry } = require('./src/data/registry.readonly.ts');
        const { readonlyTokens } = require('./src/data/tokens.readonly.ts');
        const { readonlyI18n } = require('./src/data/i18n.readonly.ts');
        const { readonlyRecipes } = require('./src/data/recipes.readonly.ts');
        console.log('✅ 所有只读适配器导入成功');
      } catch (error) {
        console.error('❌ 只读适配器导入失败:', error.message);
        process.exit(1);
      }
    "`, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: process.cwd(),
    })

    const duration = Date.now() - startTime
    console.log(`   ✅ 成功 (${duration}ms)`)
    console.log(`   输出: ${output.trim()}`)
    console.log()

    return {
      name: '只读适配器验证',
      success: true,
      message: '所有只读适配器正常工作',
      duration,
    }
  } catch (error: any) {
    const duration = Date.now() - startTime
    console.log(`   ❌ 失败 (${duration}ms)`)
    console.log(`   错误: ${error.message?.split('\n')[0] || String(error)}`)
    console.log()

    return {
      name: '只读适配器验证',
      success: false,
      message: error.message || String(error),
      duration,
    }
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始构建验证测试...\n')
  console.log('📋 测试清单:')
  console.log('   1. 数据一致性校验脚本')
  console.log('   2. TypeScript 类型检查脚本')
  console.log('   3. ESLint 规则验证')
  console.log('   4. 只读适配器验证')
  console.log('   5. 完整构建流程验证')
  console.log()

  const results: TestResult[] = []

  // 测试数据一致性校验脚本
  results.push(
    runCommand(
      'tsx scripts/validate-readonly-consistency.ts',
      '数据一致性校验脚本'
    )
  )

  // 测试 TypeScript 类型检查脚本
  results.push(
    runCommand(
      'tsx scripts/type-check.ts',
      'TypeScript 类型检查脚本'
    )
  )

  // 测试 ESLint 规则
  results.push(testEslintRules())

  // 测试只读适配器
  results.push(testReadonlyAdapters())

  // 测试完整验证流程
  results.push(
    runCommand(
      'npm run validate:all',
      '完整验证流程 (数据检查 + 类型检查 + ESLint)'
    )
  )

  // 打印测试结果摘要
  console.log('📊 测试结果摘要')
  console.log('='.repeat(50))

  const successCount = results.filter(r => r.success).length
  const failureCount = results.filter(r => !r.success).length
  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0)

  console.log(`✅ 成功: ${successCount} 个测试`)
  console.log(`❌ 失败: ${failureCount} 个测试`)
  console.log(`⏱️  总耗时: ${totalDuration}ms`)
  console.log()

  if (failureCount > 0) {
    console.log('❌ 失败的测试:')
    results
      .filter(r => !r.success)
      .forEach(result => {
        console.log(`   - ${result.name}: ${result.message}`)
      })
    console.log()
  }

  // 验证关键功能
  const criticalTests = [
    '数据一致性校验脚本',
    'TypeScript 类型检查脚本',
    'ESLint 规则验证',
  ]

  const criticalFailures = results.filter(
    r => !r.success && criticalTests.includes(r.name)
  )

  if (criticalFailures.length > 0) {
    console.log('🚨 关键测试失败!')
    console.log('以下关键功能无法正常工作:')
    criticalFailures.forEach(result => {
      console.log(`   - ${result.name}`)
    })
    console.log()
    console.log('❌ 构建验证测试失败 - 请修复关键问题')
    process.exit(1)
  }

  console.log('✅ 所有关键测试通过!')
  console.log('🎯 构建验证系统正常工作')
  console.log()

  if (failureCount === 0) {
    console.log('🎉 所有测试通过! 构建验证系统完全正常。')
  } else {
    console.log('⚠️  有一些非关键测试失败，但核心功能正常。')
  }

  console.log()
  console.log('📝 使用说明:')
  console.log('   - 运行 npm run prebuild 执行构建前检查')
  console.log('   - 运行 npm run validate:all 执行完整验证')
  console.log('   - 运行 npm run type-check 仅检查类型')
  console.log('   - 运行 npm run lint 检查代码规范')
  console.log()

  process.exit(0)
}

// 执行主函数
main()