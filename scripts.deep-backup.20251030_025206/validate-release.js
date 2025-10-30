#!/usr/bin/env node

/**
 * 发布前验证脚本
 * 确保所有包都准备好发布
 */

import { readFileSync, existsSync } from 'fs'
import { execSync } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = dirname(__dirname)

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
}

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`)
}

function logStep(step) {
  log(`\n🔍 ${step}`, 'blue')
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green')
}

function logError(message) {
  log(`❌ ${message}`, 'red')
}

function logWarning(message) {
  log(`⚠️ ${message}`, 'yellow')
}

// 验证函数
function validatePackageJson(packagePath) {
  try {
    const content = readFileSync(packagePath, 'utf8')
    const pkg = JSON.parse(content)

    const required = ['name', 'version', 'description', 'license']
    const missing = required.filter(field => !pkg[field])

    if (missing.length > 0) {
      logError(`Missing required fields in ${packagePath}: ${missing.join(', ')}`)
      return false
    }

    return true
  } catch (error) {
    logError(`Invalid package.json at ${packagePath}: ${error.message}`)
    return false
  }
}

function checkBuildDist(packagePath) {
  const distPath = join(packagePath, 'dist')
  const packageJsonPath = join(packagePath, 'package.json')

  if (!existsSync(packageJsonPath)) {
    return true // 跳过没有package.json的目录
  }

  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'))

  // 如果是私有包，跳过构建检查
  if (pkg.private) {
    return true
  }

  // 检查是否有构建脚本
  if (!pkg.scripts?.build) {
    logWarning(`No build script in ${packagePath}`)
    return true
  }

  if (!existsSync(distPath)) {
    logError(`Missing dist directory in ${packagePath}`)
    return false
  }

  // 检查主要输出文件
  const mainFiles = [
    pkg.main,
    pkg.module,
    pkg.types
  ].filter(Boolean)

  for (const file of mainFiles) {
    const filePath = join(packagePath, file)
    if (!existsSync(filePath)) {
      logError(`Missing output file: ${filePath}`)
      return false
    }
  }

  return true
}

function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' })

    if (status.trim()) {
      logWarning('Working directory is not clean:')
      console.log(status)
      return false
    }

    return true
  } catch (error) {
    logError(`Failed to check git status: ${error.message}`)
    return false
  }
}

function checkTests() {
  try {
    // 检查是否有测试脚本
    const rootPackageJson = JSON.parse(
      readFileSync(join(rootDir, 'package.json'), 'utf8')
    )

    if (!rootPackageJson.scripts?.test) {
      logWarning('No test script found in root package.json')
      return true
    }

    // 运行测试
    execSync('npm run test', { stdio: 'pipe', cwd: rootDir })
    logSuccess('All tests passed')
    return true
  } catch (error) {
    logError(`Tests failed: ${error.message}`)
    return false
  }
}

function checkTypes() {
  try {
    execSync('npm run type-check', { stdio: 'pipe', cwd: rootDir })
    logSuccess('TypeScript checks passed')
    return true
  } catch (error) {
    logError(`TypeScript checks failed: ${error.message}`)
    return false
  }
}

function checkLinting() {
  try {
    execSync('npm run lint', { stdio: 'pipe', cwd: rootDir })
    logSuccess('Linting checks passed')
    return true
  } catch (error) {
    logError(`Linting checks failed: ${error.message}`)
    return false
  }
}

function checkDependencies() {
  try {
    // 检查是否有安全漏洞
    execSync('npm audit --audit-level=high', { stdio: 'pipe', cwd: rootDir })
    logSuccess('Security audit passed')

    // 检查是否有过时的依赖
    const outdated = execSync('npm outdated --json', {
      stdio: 'pipe',
      cwd: rootDir
    })

    if (outdated.trim()) {
      logWarning('Some dependencies are outdated')
      console.log(outdated)
    }

    return true
  } catch (error) {
    if (error.status === 1) {
      logError('Security vulnerabilities found')
      return false
    }

    logError(`Dependency check failed: ${error.message}`)
    return false
  }
}

function checkChangesets() {
  const changesetsDir = join(rootDir, '.changeset')

  if (!existsSync(changesetsDir)) {
    logError('No .changeset directory found')
    return false
  }

  // 检查是否有待发布的changesets
  try {
    const result = execSync('npx changeset status --verbose', {
      encoding: 'utf8',
      cwd: rootDir
    })

    if (result.includes('No changesets found')) {
      logWarning('No changesets found - consider adding a changeset for your changes')
      return true
    }

    logSuccess('Changesets found')
    return true
  } catch (error) {
    logError(`Failed to check changesets: ${error.message}`)
    return false
  }
}

function main() {
  log('🚀 Xorigo UI 发布验证开始', 'cyan')

  const checks = [
    { name: 'Git状态检查', fn: checkGitStatus },
    { name: 'Package.json验证', fn: () => {
      const packagesDir = join(rootDir, 'packages')
      const packages = ['core', 'tokens', 'system', 'style-recipe']

      for (const pkg of packages) {
        const packageJsonPath = join(packagesDir, pkg, 'package.json')
        if (!validatePackageJson(packageJsonPath)) {
          return false
        }
      }

      logSuccess('All package.json files are valid')
      return true
    }},
    { name: '构建输出检查', fn: () => {
      const packagesDir = join(rootDir, 'packages')
      const packages = ['core', 'tokens', 'system', 'style-recipe']

      for (const pkg of packages) {
        if (!checkBuildDist(join(packagesDir, pkg))) {
          return false
        }
      }

      logSuccess('All build outputs are present')
      return true
    }},
    { name: '类型检查', fn: checkTypes },
    { name: '代码检查', fn: checkLinting },
    { name: '测试验证', fn: checkTests },
    { name: '依赖安全检查', fn: checkDependencies },
    { name: 'Changesets检查', fn: checkChangesets }
  ]

  let passed = 0
  let failed = 0

  for (const check of checks) {
    logStep(check.name)

    if (check.fn()) {
      passed++
    } else {
      failed++
    }
  }

  log('\n📊 验证结果:', 'cyan')
  log(`✅ 通过: ${passed}`, 'green')
  log(`❌ 失败: ${failed}`, 'red')

  if (failed > 0) {
    logError('\n🚫 发布验证失败！请修复上述问题后重试。')
    process.exit(1)
  }

  logSuccess('\n🎉 所有验证通过！可以安全发布。')
}

main().catch(error => {
  logError(`验证脚本执行失败: ${error.message}`)
  process.exit(1)
})