/**
 * @fileoverview 发布自动化脚本
 * @description 全自动化的发布流程，包括版本管理、NPM发布、GitHub Release、文档更新等
 */

import { execSync } from 'child_process'
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

// 类型定义
interface ReleaseConfig {
  version: string
  tag: string
  channels: string[]
  dryRun: boolean
  skipTests: boolean
  skipBuild: boolean
  createGitHubRelease: boolean
  updateDocs: boolean
}

interface PackageInfo {
  name: string
  version: string
  path: string
  publishConfig: {
    access: string
    registry?: string
  }
}

interface ChangelogEntry {
  version: string
  date: string
  changes: {
    type: 'feat' | 'fix' | 'perf' | 'refactor' | 'test' | 'docs' | 'chore'
    scope?: string
    description: string
    breaking?: boolean
  }[]
}

class ReleaseManager {
  private config: ReleaseConfig
  private packages: PackageInfo[] = []
  private changelog: ChangelogEntry[] = []

  constructor(config: Partial<ReleaseConfig> = {}) {
    this.config = {
      version: '',
      tag: '',
      channels: ['latest'],
      dryRun: false,
      skipTests: false,
      skipBuild: false,
      createGitHubRelease: true,
      updateDocs: true,
      ...config,
    }
  }

  /**
   * 执行完整的发布流程
   */
  async execute(): Promise<void> {
    console.log('🚀 开始发布流程...\n')

    try {
      // 1. 验证环境
      await this.validateEnvironment()

      // 2. 检查Git状态
      await this.checkGitStatus()

      // 3. 更新版本号
      await this.updateVersions()

      // 4. 运行测试
      if (!this.config.skipTests) {
        await this.runTests()
      }

      // 5. 构建所有包
      if (!this.config.skipBuild) {
        await this.buildPackages()
      }

      // 6. 生成变更日志
      await this.generateChangelog()

      // 7. 提交更改
      await this.commitChanges()

      // 8. 创建Git标签
      await this.createTags()

      // 9. 发布到NPM
      await this.publishToNPM()

      // 10. 创建GitHub Release
      if (this.config.createGitHubRelease) {
        await this.createGitHubRelease()
      }

      // 11. 更新文档
      if (this.config.updateDocs) {
        await this.updateDocumentation()
      }

      // 12. 推送到远程仓库
      await this.pushToRemote()

      console.log('\n✅ 发布完成！')
      this.printSummary()

    } catch (error) {
      console.error('\n❌ 发布失败:', error)
      process.exit(1)
    }
  }

  /**
   * 验证发布环境
   */
  private async validateEnvironment(): Promise<void> {
    console.log('📋 验证发布环境...')

    // 检查必要工具
    const requiredTools = ['git', 'pnpm', 'node']
    for (const tool of requiredTools) {
      try {
        execSync(`${tool} --version`, { stdio: 'ignore' })
        console.log(`  ✓ ${tool} 已安装`)
      } catch {
        throw new Error(`${tool} 未安装或不在PATH中`)
      }
    }

    // 检查NPM配置
    try {
      const npmUser = execSync('npm whoami').toString().trim()
      console.log(`  ✓ NPM用户: ${npmUser}`)
    } catch {
      throw new Error('请先运行 npm login 登录NPM')
    }

    // 读取package.json
    const rootPackage = JSON.parse(readFileSync('package.json', 'utf-8'))
    console.log(`  ✓ 项目名称: ${rootPackage.name}`)
    console.log(`  ✓ 项目版本: ${rootPackage.version}`)

    this.packages = this.discoverPackages()
    console.log(`  ✓ 发现 ${this.packages.length} 个包\n`)
  }

  /**
   * 发现所有需要发布的包
   */
  private discoverPackages(): PackageInfo[] {
    const packages: PackageInfo[] = []
    const packagesDir = 'packages'

    if (!existsSync(packagesDir)) {
      return packages
    }

    const entries = execSync(`find ${packagesDir} -name "package.json" -type f`)
      .toString()
      .trim()
      .split('\n')

    for (const packageJsonPath of entries) {
      try {
        const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'))
        if (pkg.name && !pkg.private) {
          packages.push({
            name: pkg.name,
            version: pkg.version,
            path: packageJsonPath.replace('/package.json', ''),
            publishConfig: pkg.publishConfig || { access: 'public' },
          })
        }
      } catch (error) {
        console.warn(`  ⚠️ 无法读取 ${packageJsonPath}: ${error}`)
      }
    }

    return packages
  }

  /**
   * 检查Git状态
   */
  private async checkGitStatus(): Promise<void> {
    console.log('📂 检查Git状态...')

    const status = execSync('git status --porcelain').toString().trim()

    if (status && !this.config.dryRun) {
      throw new Error('工作目录不干净，请先提交或储藏更改')
    }

    const currentBranch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
    console.log(`  ✓ 当前分支: ${currentBranch}`)

    const hasRemote = execSync('git remote -v').toString().trim().length > 0
    if (hasRemote) {
      console.log('  ✓ 远程仓库已配置')
    }

    console.log()
  }

  /**
   * 更新版本号
   */
  private async updateVersions(): Promise<void> {
    console.log('🏷️ 更新版本号...')

    const rootPackage = JSON.parse(readFileSync('package.json', 'utf-8'))

    if (!this.config.version) {
      this.config.version = await this.promptVersion(rootPackage.version)
    }

    this.config.tag = `v${this.config.version}`

    console.log(`  发布版本: ${this.config.version}`)
    console.log(`  标签: ${this.config.tag}\n`)
  }

  /**
   * 提示输入版本号
   */
  private async promptVersion(currentVersion: string): Promise<string> {
    console.log(`当前版本: ${currentVersion}`)
    console.log('版本类型:')
    console.log('  1. patch (x.x.X) - 修复')
    console.log('  2. minor (x.X.x) - 新功能')
    console.log('  3. major (X.x.x) - 破坏性变更')
    console.log('  4. 自定义版本')

    // 在实际实现中，这里会使用inquirer进行交互式输入
    // 现在使用默认的minor版本
    const [major, minor, patch] = currentVersion.split('.').map(Number)
    const newVersion = `${major}.${minor + 1}.0`

    return newVersion
  }

  /**
   * 运行测试
   */
  private async runTests(): Promise<void> {
    console.log('🧪 运行测试套件...')

    const tests = [
      { name: '单元测试', command: 'pnpm test --filter @xorigo-ui/core' },
      { name: '集成测试', command: 'pnpm test:integration' },
      { name: 'E2E测试', command: 'pnpm test:e2e' },
      { name: '类型检查', command: 'pnpm type-check --filter @xorigo-ui/core' },
      { name: '代码规范检查', command: 'pnpm lint --filter @xorigo-ui/core' },
    ]

    for (const test of tests) {
      console.log(`  运行 ${test.name}...`)
      try {
        execSync(test.command, { stdio: 'inherit' })
        console.log(`  ✓ ${test.name} 通过\n`)
      } catch (error) {
        throw new Error(`${test.name} 失败`)
      }
    }
  }

  /**
   * 构建所有包
   */
  private async buildPackages(): Promise<void> {
    console.log('🔨 构建所有包...')

    console.log('  构建核心包...')
    execSync('pnpm --filter @xorigo-ui/core build', { stdio: 'inherit' })

    console.log('  构建AI包...')
    execSync('pnpm --filter @xorigo-ui/ai build', { stdio: 'inherit' })

    console.log('  构建主题包...')
    execSync('pnpm --filter @xorigo-ui/theme build', { stdio: 'inherit' })

    console.log('  构建工具包...')
    execSync('pnpm --filter @xorigo-ui/utils build', { stdio: 'inherit' })

    console.log('  ✓ 所有包构建完成\n')
  }

  /**
   * 生成变更日志
   */
  private async generateChangelog(): Promise<void> {
    console.log('📝 生成变更日志...')

    // 使用changeset命令
    execSync('pnpm changeset version', { stdio: 'inherit' })

    // 读取CHANGELOG.md
    const changelogPath = 'CHANGELOG.md'
    if (existsSync(changelogPath)) {
      const changelog = readFileSync(changelogPath, 'utf-8')
      console.log('  ✓ 变更日志已更新\n')
    }
  }

  /**
   * 提交更改
   */
  private async commitChanges(): Promise<void> {
    if (this.config.dryRun) {
      console.log('🔍 [DRY RUN] 跳过提交')
      return
    }

    console.log('💾 提交更改...')

    execSync('git add .')
    execSync(`git commit -m "chore: release ${this.config.version}"`)

    console.log('  ✓ 更改已提交\n')
  }

  /**
   * 创建标签
   */
  private async createTags(): Promise<void> {
    if (this.config.dryRun) {
      console.log('🔍 [DRY RUN] 跳过创建标签')
      return
    }

    console.log('🏷️ 创建标签...')

    for (const pkg of this.packages) {
      const tag = `${pkg.name}@${this.config.version}`
      try {
        execSync(`git tag -a ${tag} -m "Release ${tag}"`)
        console.log(`  ✓ 已创建标签: ${tag}`)
      } catch (error) {
        console.warn(`  ⚠️ 标签 ${tag} 已存在`)
      }
    }

    console.log()
  }

  /**
   * 发布到NPM
   */
  private async publishToNPM(): Promise<void> {
    console.log('📦 发布到NPM...')

    for (const pkg of this.packages) {
      const fullName = `${pkg.name}@${this.config.version}`

      if (this.config.dryRun) {
        console.log(`  🔍 [DRY RUN] 将发布: ${fullName}`)
        continue
      }

      console.log(`  发布 ${fullName}...`)

      const channel = this.config.channels.includes('latest') ? '' : '--tag'
      const tagFlag = this.config.channels.includes('latest') ? '' : this.config.channels[0]

      try {
        execSync(`cd ${pkg.path} && pnpm publish ${channel} ${tagFlag}`, {
          stdio: 'inherit',
        })
        console.log(`  ✓ ${fullName} 发布成功\n`)
      } catch (error) {
        console.error(`  ❌ ${fullName} 发布失败\n`)
        throw error
      }
    }
  }

  /**
   * 创建GitHub Release
   */
  private async createGitHubRelease(): Promise<void> {
    if (this.config.dryRun) {
      console.log('🔍 [DRY RUN] 跳过GitHub Release')
      return
    }

    console.log('🐙 创建GitHub Release...')

    try {
      // 使用gh CLI创建Release
      execSync(
        `gh release create ${this.config.tag} --notes-file CHANGELOG.md --latest`,
        { stdio: 'inherit' }
      )
      console.log('  ✓ GitHub Release 创建成功\n')
    } catch (error) {
      console.warn('  ⚠️ GitHub Release 创建失败，请手动创建')
      console.warn('  手动创建地址: https://github.com/your-org/xorigo-ui/releases/new\n')
    }
  }

  /**
   * 更新文档
   */
  private async updateDocumentation(): Promise<void> {
    if (this.config.dryRun) {
      console.log('🔍 [DRY RUN] 跳过文档更新')
      return
    }

    console.log('📚 更新文档...')

    try {
      // 更新官网
      execSync('pnpm --filter website docs:update', { stdio: 'inherit' })
      console.log('  ✓ 官网文档已更新')
    } catch (error) {
      console.warn('  ⚠️ 文档更新失败')
    }

    console.log()
  }

  /**
   * 推送到远程仓库
   */
  private async pushToRemote(): Promise<void> {
    if (this.config.dryRun) {
      console.log('🔍 [DRY RUN] 跳过推送')
      return
    }

    console.log('☁️ 推送到远程仓库...')

    try {
      execSync('git push origin', { stdio: 'inherit' })
      execSync('git push origin --tags', { stdio: 'inherit' })
      console.log('  ✓ 已推送到远程仓库\n')
    } catch (error) {
      console.warn('  ⚠️ 推送失败，请手动推送')
      console.warn('  手动推送命令:')
      console.warn('    git push origin')
      console.warn('    git push origin --tags\n')
    }
  }

  /**
   * 打印发布摘要
   */
  private printSummary(): void {
    console.log('\n' + '='.repeat(60))
    console.log('📊 发布摘要')
    console.log('='.repeat(60))
    console.log(`版本: ${this.config.version}`)
    console.log(`标签: ${this.config.tag}`)
    console.log(`发布的包数量: ${this.packages.length}`)

    console.log('\n发布的包:')
    for (const pkg of this.packages) {
      console.log(`  - ${pkg.name}@${this.config.version}`)
    }

    console.log('\n下一步:')
    console.log('1. 检查GitHub Release')
    console.log('2. 验证NPM包')
    console.log('3. 更新社区')
    console.log('='.repeat(60))
  }
}

// CLI入口点
async function main() {
  const args = process.argv.slice(2)
  const config: Partial<ReleaseConfig> = {}

  // 解析命令行参数
  for (let i = 0; i < args.length; i++) {
    const arg = args[i]
    switch (arg) {
      case '--version':
        config.version = args[++i]
        break
      case '--tag':
        config.tag = args[++i]
        break
      case '--channel':
        config.channels = args[++i].split(',')
        break
      case '--dry-run':
        config.dryRun = true
        break
      case '--skip-tests':
        config.skipTests = true
        break
      case '--skip-build':
        config.skipBuild = true
        break
      case '--no-github':
        config.createGitHubRelease = false
        break
      case '--no-docs':
        config.updateDocs = false
        break
      case '--help':
        printHelp()
        process.exit(0)
    }
  }

  const releaseManager = new ReleaseManager(config)
  await releaseManager.execute()
}

function printHelp(): void {
  console.log(`
Xorigo UI 发布自动化脚本

用法:
  pnpm release [选项]

选项:
  --version <版本>    指定发布版本号
  --tag <标签>        指定Git标签
  --channel <频道>    NPM频道 (默认: latest)
  --dry-run          试运行，不执行实际操作
  --skip-tests       跳过测试
  --skip-build       跳过构建
  --no-github        不创建GitHub Release
  --no-docs          不更新文档
  --help             显示帮助信息

示例:
  pnpm release --version 1.0.0
  pnpm release --dry-run
  pnpm release --channel beta,next
`)
}

// 运行
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(error => {
    console.error(error)
    process.exit(1)
  })
}

export { ReleaseManager }
