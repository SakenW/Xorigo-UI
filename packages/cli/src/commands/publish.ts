/**
 * NPM 发布命令
 * 支持包的构建、测试和发布到 NPM
 */

import { Command } from 'commander'
import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { logger } from '../utils/logger'

const execAsync = promisify(exec)

export interface PublishOptions {
  tag: string
  access: 'public' | 'private'
  dryRun: boolean
  skipBuild: boolean
  skipTests: boolean
}

/**
 * 检查 package.json
 */
async function checkPackageJson(): Promise<any> {
  try {
    const content = await fs.readFile('package.json', 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    throw new Error('未找到 package.json 文件')
  }
}

/**
 * 检查版本是否已发布
 */
async function checkVersionExists(packageName: string, version: string): Promise<boolean> {
  try {
    const { stdout } = await execAsync(`npm view ${packageName}@${version} version`)
    return !!stdout.trim()
  } catch {
    return false
  }
}

/**
 * 运行测试
 */
async function runTests(): Promise<void> {
  logger.info('运行测试...')

  try {
    await execAsync('pnpm test', {
      env: { ...process.env, CI: 'true' }
    })
    logger.success('测试通过')
  } catch (error) {
    throw new Error('测试失败，请检查测试结果')
  }
}

/**
 * 构建包
 */
async function buildPackage(): Promise<void> {
  logger.info('构建包...')

  try {
    await execAsync('pnpm build')
    logger.success('构建成功')
  } catch (error) {
    throw new Error('构建失败，请检查构建错误')
  }
}

/**
 * 验证包内容
 */
async function validatePackage(distPath: string, packageJson: any): Promise<void> {
  logger.section('验证包内容')

  const requiredFiles = [
    'package.json',
    'README.md',
    'LICENSE',
    'dist/index.js',
    'dist/index.d.ts'
  ]

  for (const file of requiredFiles) {
    const filePath = path.join(distPath, file)
    try {
      await fs.access(filePath)
      logger.success(`✓ ${file}`)
    } catch {
      logger.warn(`✗ ${file} 不存在`)
    }
  }

  // 检查必要字段
  if (!packageJson.name) {
    throw new Error('package.json 缺少 name 字段')
  }

  if (!packageJson.version) {
    throw new Error('package.json 缺少 version 字段')
  }

  if (!packageJson.types && !packageJson.typings) {
    logger.warn('未找到类型定义文件')
  }
}

/**
 * 生成发布日志
 */
function generateChangelog(packageJson: any, tag: string, version: string): string {
  const timestamp = new Date().toISOString()

  return `# 发布日志

**包名**: ${packageJson.name}
**版本**: ${version}
**标签**: ${tag}
**时间**: ${timestamp}

## 安装

\`\`\`bash
npm install ${packageJson.name}@${tag}
# 或
pnpm add ${packageJson.name}@${tag}
# 或
yarn add ${packageJson.name}@${tag}
\`\`\`

## 变更

本版本包含以下更新...

---
由 Xorigo CLI 自动生成
`
}

/**
 * NPM 发布命令
 */
export const publishCommand = new Command('publish')
  .description('发布包到 NPM')
  .option('-t, --tag <tag>', 'NPM 标签 (latest, beta, alpha)', 'latest')
  .option('--access <access>', '访问级别 (public|private)', 'public')
  .option('--dry-run', '模拟发布', false)
  .option('--skip-build', '跳过构建步骤', false)
  .option('--skip-tests', '跳过测试步骤', false)
  .action(async (options: PublishOptions) => {
    const startTime = Date.now()
    const spinner = ora('准备发布...').start()

    try {
      // 检查是否在正确的目录
      spinner.text = '检查项目配置...'
      const packageJson = await checkPackageJson()

      const version = packageJson.version
      const packageName = packageJson.name

      if (!version) {
        throw new Error('package.json 中未定义版本号')
      }

      if (!packageName) {
        throw new Error('package.json 中未定义包名')
      }

      // 检查是否已发布
      spinner.text = '检查版本状态...'
      const exists = await checkVersionExists(packageName, version)
      if (exists) {
        throw new Error(`版本 ${version} 已经发布，请更新版本号`)
      }

      // 运行测试
      if (!options.skipTests) {
        spinner.text = '运行测试...'
        await runTests()
      }

      // 构建包
      if (!options.skipBuild) {
        spinner.text = '构建包...'
        await buildPackage()
      } else {
        logger.warn('跳过构建步骤')
      }

      // 验证包内容
      spinner.text = '验证包内容...'
      const distPath = path.join(process.cwd(), 'dist')
      try {
        await fs.access(distPath)
        await validatePackage(distPath, packageJson)
      } catch (error) {
        throw new Error('未找到构建输出目录，请先运行构建')
      }

      // 模拟发布
      if (options.dryRun) {
        const elapsed = Date.now() - startTime
        spinner.info(chalk.blue('ℹ 模拟发布模式'))

        logger.section('发布信息')
        console.log(chalk.gray(`  📦 包名: ${packageName}`))
        console.log(chalk.gray(`  🏷️ 版本: ${version}`))
        console.log(chalk.gray(`  🏷️ 标签: ${tag}`))
        console.log(chalk.gray(`  🔒 访问: ${options.access}`))
        console.log(chalk.gray(`  ⏱️ 用时: ${elapsed}ms`))

        logger.success('✅ 模拟发布成功')
        logger.info('使用 --no-dry-run 执行实际发布')
        return
      }

      // 发布到 NPM
      spinner.text = '发布到 NPM...'

      const publishCommand = `npm publish --tag ${options.tag} --access ${options.access}`

      try {
        await execAsync(publishCommand)
        logger.success('发布成功')
      } catch (error) {
        if (error instanceof Error && error.message.includes('401')) {
          throw new Error('认证失败，请检查 NPM_TOKEN')
        }
        if (error instanceof Error && error.message.includes('403')) {
          throw new Error('权限不足，请检查包名和访问级别')
        }
        throw error
      }

      // 生成发布日志
      spinner.text = '生成发布日志...'
      const changelog = generateChangelog(packageJson, options.tag, version)
      await fs.writeFile('CHANGELOG-PUBLISH.md', changelog, 'utf-8')

      const elapsed = Date.now() - startTime

      spinner.succeed(chalk.green('✅ 发布完成'))

      logger.section('发布信息')
      console.log(chalk.gray(`  📦 包名: ${packageName}`))
      console.log(chalk.gray(`  🏷️ 版本: ${version}`))
      console.log(chalk.gray(`  🏷️ 标签: ${options.tag}`))
      console.log(chalk.gray(`  🔗 地址: https://www.npmjs.com/package/${packageName}`))
      console.log(chalk.gray(`  ⏱️ 总耗时: ${elapsed}ms`))

      logger.section('安装命令')
      console.log(chalk.cyan(`  npm install ${packageName}@${options.tag}`))

      logger.section('后续步骤')
      logger.info('更新 Git 标签')
      console.log(chalk.gray(`  git tag v${version}`))
      console.log(chalk.gray(`  git push origin v${version}`))

      logger.info('发布公告')
      logger.info(`查看发布日志: CHANGELOG-PUBLISH.md`)

    } catch (error) {
      spinner.fail(chalk.red('❌ 发布失败'))
      console.error(chalk.red('错误:'), error instanceof Error ? error.message : error)

      if (!options.dryRun) {
        logger.section('故障排除')
        logger.info('常见解决方案:')
        console.log(chalk.gray('  1. 检查版本号是否已发布'))
        console.log(chalk.gray('  2. 确认 NPM_TOKEN 有效'))
        console.log(chalk.gray('  3. 检查包名是否冲突'))
        console.log(chalk.gray('  4. 运行 pnpm build 检查构建错误'))
      }

      process.exit(1)
    }
  })
