#!/usr/bin/env node

/**
 * NPM 发布配置助手
 * 帮助配置和验证 NPM 发布环境
 */

import { execSync } from 'child_process'
import { readFileSync, existsSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

console.log('🚀 Xorigo UI NPM 发布配置助手\n')

// 检查当前 NPM 配置
function checkNpmConfig() {
  try {
    const whoami = execSync('npm whoami', { encoding: 'utf8' }).trim()
    console.log('✅ NPM 登录状态:')
    console.log(`   当前用户: ${whoami}`)
    return whoami
  } catch (error) {
    console.log('❌ NPM 未登录')
    console.log('💡 请先运行: npm login')
    return null
  }
}

// 检查包配置
function checkPackageConfig() {
  const corePackagePath = join(projectRoot, 'packages/core/package.json')

  if (!existsSync(corePackagePath)) {
    console.log('❌ 核心包不存在')
    return false
  }

  const packageJson = JSON.parse(readFileSync(corePackagePath, 'utf8'))

  console.log('📦 包配置检查:')
  console.log(`   包名: ${packageJson.name}`)
  console.log(`   版本: ${packageJson.version}`)
  console.log(`   描述: ${packageJson.description}`)
  console.log(`   许可证: ${packageJson.license}`)

  // 检查 publishConfig
  if (packageJson.publishConfig) {
    console.log(`   发布配置: ${JSON.stringify(packageJson.publishConfig)}`)
  } else {
    console.log('⚠️  缺少 publishConfig')
  }

  return packageJson
}

// 检查构建状态
function checkBuildStatus() {
  const distPath = join(projectRoot, 'packages/core/dist')

  console.log('🔨 构建状态检查:')

  if (existsSync(distPath)) {
    const files = ['index.mjs', 'index.cjs.js', 'index.d.ts']
    let allExists = true

    files.forEach(file => {
      const filePath = join(distPath, file)
      if (existsSync(filePath)) {
        console.log(`   ✅ ${file}`)
      } else {
        console.log(`   ❌ ${file} 缺失`)
        allExists = false
      }
    })

    if (allExists) {
      console.log('✅ 构建文件完整')
    } else {
      console.log('⚠️  构建不完整，需要重新构建')
      return false
    }
  } else {
    console.log('❌ dist 目录不存在，需要构建')
    return false
  }

  return true
}

// 生成 .npmrc 配置文件
function generateNpmrc() {
  const npmrcPath = join(projectRoot, '.npmrc')

  const content = `# NPM 配置文件
# 登录后自动生成认证信息

# 包发布配置
@xorigo-ui:registry=https://registry.npmjs.org/

# 如需使用 Access Token，请取消注释并替换 YOUR_TOKEN
# //registry.npmjs.org/:_authToken=YOUR_TOKEN
`

  writeFileSync(npmrcPath, content)
  console.log(`✅ 已生成 .npmrc 配置文件: ${npmrcPath}`)
}

// 创建发布脚本
function createPublishScript() {
  const scriptPath = join(projectRoot, 'scripts', 'publish-package.js')

  const content = `#!/usr/bin/env node

/**
 * Xorigo UI NPM 发布脚本
 */

import { execSync } from 'child_process'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const projectRoot = join(__dirname, '..')

function publishPackage(tag = 'latest') {
  try {
    console.log('🚀 开始发布 Xorigo UI...')

    // 1. 检查登录状态
    console.log('🔍 检查 NPM 登录状态...')
    const whoami = execSync('npm whoami', { encoding: 'utf8' }).trim()
    console.log(\`✅ 已登录为: \${whoami}\`)

    // 2. 检查构建状态
    console.log('🔨 检查构建状态...')
    execSync('ls packages/core/dist', { cwd: projectRoot })
    console.log('✅ 构建文件完整')

    // 3. 执行发布
    console.log(\`📦 发布到 NPM (tag: \${tag})...\`)
    execSync('npm publish --access public', {
      cwd: join(projectRoot, 'packages/core'),
      stdio: 'inherit'
    })

    console.log('🎉 发布成功！')
    console.log(\`🔗 包地址: https://www.npmjs.com/package/@xorigo-ui/core\`)

  } catch (error) {
    console.error('❌ 发布失败:')
    console.error(error.message)
    process.exit(1)
  }
}

const tag = process.argv[2] || 'latest'
publishPackage(tag)
`

  writeFileSync(scriptPath, content)
  console.log(`✅ 已创建发布脚本: ${scriptPath}`)
}

// 主流程
async function main() {
  console.log('📋 配置检查清单:')

  // 1. 检查 NPM 登录
  const npmUser = checkNpmConfig()

  // 2. 检查包配置
  const packageConfig = checkPackageConfig()

  // 3. 检查构建状态
  const buildOk = checkBuildStatus()

  console.log('\n🔧 推荐的配置步骤:')

  if (!npmUser) {
    console.log('1. 登录 NPM:')
    console.log('   npm login')
    console.log('   # 输入您的用户名、密码和邮箱')
  }

  if (!buildOk) {
    console.log('2. 重新构建:')
    console.log('   pnpm build')
  }

  console.log('3. 检查包配置')
  console.log('4. 发布到 NPM:')
  console.log('   npm publish --access public')

  // 生成配置文件
  console.log('\n📝 生成配置文件...')
  generateNpmrc()
  createPublishScript()

  console.log('\n📋 快速发布命令:')
  console.log('1. 检查登录: npm whoami')
  console.log('2. 构建包: pnpm build')
  console.log('3. 发布: npm publish --access public')
  console.log('4. 或使用脚本: node scripts/publish-package.js')

  console.log('\n📖 完整文档:')
  console.log('- 查看 .npmrc 配置文件')
  console.log('- 检查 scripts/publish-package.js')
  console.log('- 访问: https://www.npmjs.com/settings/xorigo/packages')
}

main().catch(console.error)