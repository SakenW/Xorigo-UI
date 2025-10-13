#!/usr/bin/env node
/**
 * @fileoverview TypeScript 类型检查脚本
 *
 * 在构建前执行严格的 TypeScript 类型检查
 * 如果发现类型错误，将阻断构建过程
 *
 * 使用: npm run type-check
 * 或: tsx scripts/type-check.ts
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'

interface TypeCheckResult {
  success: boolean
  errors: string[]
  warnings: string[]
  exitCode: number
  output: string
}

/**
 * 执行 TypeScript 类型检查
 */
function runTypeCheck(): TypeCheckResult {
  console.log('🔍 执行 TypeScript 类型检查...\n')

  try {
    // 执行 tsc --noEmit 进行类型检查
    const output = execSync('npx tsc --noEmit --pretty', {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: process.cwd(),
    })

    return {
      success: true,
      errors: [],
      warnings: [],
      exitCode: 0,
      output: output.toString(),
    }
  } catch (error: any) {
    const output = error.stdout?.toString() || error.stderr?.toString() || String(error)

    // 解析输出，分离错误和警告
    const lines = output.split('\n').filter(line => line.trim())
    const errors: string[] = []
    const warnings: string[] = []

    lines.forEach(line => {
      // TypeScript 编译器通常用 error 表示错误，warning 表示警告
      if (line.toLowerCase().includes('error')) {
        errors.push(line)
      } else if (line.toLowerCase().includes('warning')) {
        warnings.push(line)
      } else if (line.includes('(') && line.includes(')')) {
        // 可能是错误或警告的详细信息
        if (lines.some(l => l.includes('error') && l.includes(line.split('(')[1]))) {
          errors.push(line)
        } else {
          warnings.push(line)
        }
      }
    })

    return {
      success: false,
      errors,
      warnings,
      exitCode: error.status || 1,
      output,
    }
  }
}

/**
 * 检查 TypeScript 配置
 */
function checkTypeScriptConfig(): boolean {
  const tsconfigPath = join(process.cwd(), 'tsconfig.json')

  if (!existsSync(tsconfigPath)) {
    console.error('❌ 未找到 tsconfig.json 文件')
    return false
  }

  try {
    const tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'))

    // 检查关键配置
    const issues: string[] = []

    if (tsconfig.compilerOptions?.strict !== true) {
      issues.push('建议启用 strict: true 以获得更严格的类型检查')
    }

    if (!tsconfig.compilerOptions?.noImplicitAny) {
      issues.push('建议启用 noImplicitAny 以禁止隐式 any 类型')
    }

    if (!tsconfig.compilerOptions?.strictNullChecks) {
      issues.push('建议启用 strictNullChecks 以启用严格空值检查')
    }

    if (issues.length > 0) {
      console.warn('⚠️  TypeScript 配置建议:')
      issues.forEach(issue => console.warn(`   - ${issue}`))
      console.log()
    }

    return true
  } catch (error) {
    console.error('❌ tsconfig.json 解析失败:', error)
    return false
  }
}

/**
 * 检查依赖项的类型声明
 */
function checkTypingDependencies(): string[] {
  const packageJsonPath = join(process.cwd(), 'package.json')

  if (!existsSync(packageJsonPath)) {
    return ['❌ 未找到 package.json 文件']
  }

  try {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'))
    const issues: string[] = []

    // 检查常见依赖的类型声明
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

    const typePackages = [
      { pkg: 'react', type: '@types/react' },
      { pkg: 'react-dom', type: '@types/react-dom' },
      { pkg: 'next', type: '@types/next' },
      { pkg: 'node', type: '@types/node' },
    ]

    typePackages.forEach(({ pkg, type }) => {
      if (dependencies[pkg] && !dependencies[type]) {
        issues.push(`⚠️  发现 ${pkg} 依赖但缺少 ${type} 类型声明`)
      }
    })

    return issues
  } catch (error) {
    return [`❌ package.json 解析失败: ${error}`]
  }
}

/**
 * 打印类型检查报告
 */
function printTypeCheckReport(result: TypeCheckResult): void {
  console.log('📊 TypeScript 类型检查报告')
  console.log('='.repeat(50))

  if (result.success) {
    console.log('✅ 类型检查通过！未发现类型错误。')

    if (result.warnings.length > 0) {
      console.log(`\n⚠️  发现 ${result.warnings.length} 个警告:`)
      result.warnings.forEach(warning => console.log(`   ${warning}`))
    }
  } else {
    console.log(`❌ 类型检查失败！发现 ${result.errors.length} 个错误。`)

    if (result.errors.length > 0) {
      console.log('\n🚫 错误详情:')
      result.errors.forEach(error => console.log(`   ${error}`))
    }

    if (result.warnings.length > 0) {
      console.log('\n⚠️  警告详情:')
      result.warnings.forEach(warning => console.log(`   ${warning}`))
    }

    console.log('\n💡 修复建议:')
    console.log('   1. 检查上述错误并修复类型问题')
    console.log('   2. 确保导入的模块具有正确的类型声明')
    console.log('   3. 考虑在 tsconfig.json 中启用更严格的类型检查选项')
    console.log('   4. 使用 interface 或 type 定义明确的数据结构')
  }

  console.log('='.repeat(50))
  console.log()
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始 TypeScript 类型检查...\n')

  try {
    // 检查 TypeScript 配置
    if (!checkTypeScriptConfig()) {
      console.error('❌ TypeScript 配置检查失败')
      process.exit(1)
    }

    // 检查类型声明依赖
    const typingIssues = checkTypingDependencies()
    if (typingIssues.length > 0) {
      console.log('📦 类型声明依赖检查:')
      typingIssues.forEach(issue => console.log(`   ${issue}`))
      console.log()
    }

    // 执行类型检查
    const result = runTypeCheck()

    // 打印报告
    printTypeCheckReport(result)

    // 根据结果决定是否退出
    if (!result.success) {
      console.error('❌ TypeScript 类型检查失败，构建已阻断！')
      console.error('请修复类型错误后重新运行构建。\n')
      process.exit(1)
    }

    console.log('✅ TypeScript 类型检查通过，继续构建。\n')
    process.exit(0)
  } catch (error) {
    console.error('\n❌ 类型检查脚本执行失败:')
    console.error(error)
    console.error('\n构建已阻断！\n')
    process.exit(1)
  }
}

// 执行主函数
main()