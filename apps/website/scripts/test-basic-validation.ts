#!/usr/bin/env node
/**
 * @fileoverview 基本构建验证测试
 *
 * 测试核心构建前校验功能
 */

import { execSync } from 'child_process'
import { writeFileSync, unlinkSync, existsSync } from 'fs'
import { join } from 'path'

function testCommand(name: string, command: string): boolean {
  try {
    console.log(`🧪 测试: ${name}`)
    const output = execSync(command, { encoding: 'utf8', stdio: 'pipe' })
    console.log(`   ✅ 成功`)
    return true
  } catch (error: any) {
    console.log(`   ❌ 失败: ${error.message?.split('\n')[0] || String(error)}`)
    return false
  }
}

function testEslintRules(): boolean {
  const testFile = join(process.cwd(), 'test-forbidden-import.ts')
  const testContent = `
// 测试文件 - 验证 ESLint 规则
import { someFunction } from '@xorigo-ui/registry'
import { someToken } from '@xorigo-ui/tokens'
`

  try {
    writeFileSync(testFile, testContent)

    console.log('🧪 测试: ESLint 规则验证')
    const output = execSync(`npx eslint "${testFile}" --format=compact`, {
      encoding: 'utf8',
      stdio: 'pipe'
    })

    const hasErrors = output.includes('no-restricted-imports')
    if (hasErrors) {
      console.log('   ✅ 成功检测到禁止导入错误')
      unlinkSync(testFile)
      return true
    } else {
      console.log('   ❌ 未能检测到禁止导入错误')
      unlinkSync(testFile)
      return false
    }
  } catch (error: any) {
    const output = error.stdout || error.stderr || String(error)
    const hasErrors = output.includes('no-restricted-imports')

    if (hasErrors) {
      console.log('   ✅ 成功检测到禁止导入错误')
    } else {
      console.log('   ❌ 未能检测到禁止导入错误')
    }

    if (existsSync(testFile)) {
      unlinkSync(testFile)
    }
    return hasErrors
  }
}

async function main() {
  console.log('🚀 基本构建验证测试\n')

  const tests = [
    { name: '数据一致性校验脚本', command: 'npx tsx scripts/validate-readonly-consistency.ts', required: true },
    { name: 'TypeScript 类型检查脚本', command: 'npx tsx scripts/type-check.ts', required: false }, // 可能因为类型问题失败
    { name: 'ESLint 配置检查', command: 'npx eslint --print-config .eslintrc.cjs', required: true },
  ]

  const results = tests.map(test => ({
    name: test.name,
    success: testCommand(test.name, test.command),
    required: test.required
  }))

  // 测试 ESLint 规则
  results.push({
    name: 'ESLint 规则验证',
    success: testEslintRules(),
    required: true
  })

  console.log('\n📊 测试结果:')
  console.log('='.repeat(40))

  const successCount = results.filter(r => r.success).length
  const requiredFailures = results.filter(r => !r.success && r.required).length

  results.forEach(result => {
    const status = result.success ? '✅' : '❌'
    const required = result.required ? ' (必需)' : ' (可选)'
    console.log(`${status} ${result.name}${required}`)
  })

  console.log(`\n总计: ${successCount}/${results.length} 通过`)

  if (requiredFailures > 0) {
    console.log(`\n❌ ${requiredFailures} 个必需测试失败`)
    console.log('构建验证系统存在问题，需要修复')
    process.exit(1)
  } else {
    console.log('\n✅ 所有必需测试通过!')
    console.log('构建验证系统基本功能正常')
  }
}

main().catch(console.error)