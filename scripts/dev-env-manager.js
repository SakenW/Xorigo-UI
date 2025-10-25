#!/usr/bin/env node

/**
 * Xorigo UI 开发环境管理器
 * 智能切换本地开发、Docker 开发和混合模式
 */

import { execSync } from 'child_process'
import readline from 'readline'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

// 颜色输出函数
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  cyan: (text) => `\x1b[36m${text}\x1b[0m`,
  magenta: (text) => `\x1b[35m${text}\x1b[0m`
}

// 开发模式配置
const DEVELOPMENT_MODES = {
  LOCAL: {
    name: '本地开发模式',
    description: '直接在本地运行开发服务器',
    ports: { core: 3001, website: 3100 },
    command: 'concurrently "pnpm dev:core" "pnpm dev:website"',
    advantages: ['⚡ 启动速度快', '🔍 调试方便', '💻 资源占用少'],
    disadvantages: ['⚠️ 环境依赖本地配置']
  },
  DOCKER_CORE: {
    name: 'Docker 核心库模式',
    description: '在 Docker 中运行核心库，本地运行 Website',
    ports: { core: 3001, website: 3100 },
    command: 'docker:dev',
    advantages: ['🐳 环境一致性好', '🔄 热更新支持'],
    disadvantages: ['🐢 启动较慢', '📦 资源占用多']
  },
  DOCKER_MONOREPO: {
    name: 'Docker 完整模式',
    description: '在 Docker 中运行完整 Monorepo 环境',
    ports: { website: 3100, storybook: 6006, recipes: 3101 },
    command: 'docker:dev:monorepo',
    advantages: ['🎯 完全隔离', '👥 团队协作友好'],
    disadvantages: ['🐢 启动最慢', '💾 内存占用大']
  },
  HYBRID: {
    name: '混合模式',
    description: '本地开发 + Docker 辅助',
    ports: { core: 3001, website: 3100 },
    command: 'concurrently "pnpm dev:core" "pnpm dev:website"',
    advantages: ['⚡ 性能最优', '🎛️ 灵活配置'],
    disadvantages: ['🔧 配置复杂']
  }
}

// 获取环境状态
function getEnvironmentStatus() {
  console.log(`\n${colors.cyan('📊 环境状态检查')}:`)
  console.log('==================')

  try {
    // 检查 Docker 状态
    console.log(`\n${colors.blue('Docker 服务')}:`)
    try {
      const dockerServices = execSync(
        'docker ps --filter "name=xorigo" --format "table {{.Names}}\\t{{.Status}}\\t{{.Ports}}"',
        { encoding: 'utf8' }
      )
      console.log(dockerServices)
    } catch {
      console.log('  无 Docker 服务运行')
    }

    // 检查本地端口
    console.log(`\n${colors.blue('本地端口占用')}:`)
    const ports = [3000, 3001, 3002, 3100, 3101, 6006]
    ports.forEach(port => {
      try {
        execSync(`lsof -ti:${port}`, { stdio: 'ignore' })
        console.log(`  端口 ${port}: ${colors.yellow('被占用')}`)
      } catch {
        console.log(`  端口 ${port}: ${colors.green('空闲')}`)
      }
    })

    // 检查 Node.js 进程
    console.log(`\n${colors.blue('Node.js 进程')}:`)
    try {
      const nodeProcesses = execSync(
        'ps aux | grep -E "(node|vite|next)" | grep -v grep',
        { encoding: 'utf8' }
      )
      if (nodeProcesses.trim()) {
        console.log(nodeProcesses.split('\n').map(line => `  ${line}`).join('\n'))
      } else {
        console.log('  无 Node.js 开发进程运行')
      }
    } catch {
      console.log('  无 Node.js 开发进程运行')
    }

  } catch (error) {
    console.log(`  ${colors.red('状态检查失败')}: ${error.message}`)
  }
}

// 检查端口占用情况
function checkPortOccupancy(port) {
  try {
    // 首先尝试使用 -ti 参数获取PID
    let pid = execSync(`lsof -ti:${port}`, { stdio: 'pipe' }).toString().trim()

    // 如果 -ti 参数失败，使用 -i 参数解析
    if (!pid) {
      const lsofOutput = execSync(`lsof -i:${port}`, { stdio: 'pipe' }).toString().trim()
      if (lsofOutput) {
        const lines = lsofOutput.split('\n')
        if (lines.length > 1) { // 跳过标题行
          const firstLine = lines[1]
          const parts = firstLine.split(/\s+/)
          pid = parts[1] // PID在第二列
        }
      }
    }

    if (pid) {
      try {
        const processInfo = execSync(`ps -p ${pid} -o pid,ppid,cmd --no-headers`, { stdio: 'pipe' }).toString().trim()
        const [processId, parentPid, command] = processInfo.split(/\s+/)
        return {
          occupied: true,
          pid: processId,
          parentPid: parentPid,
          command: command,
          processInfo: processInfo
        }
      } catch (cmdError) {
        return {
          occupied: true,
          pid: pid,
          command: 'Unknown',
          processInfo: `PID ${pid}`
        }
      }
    }
  } catch (error) {
    // 端口未被占用
  }
  return { occupied: false }
}

// 智能端口冲突处理
async function handlePortConflicts(requiredPorts, modeName) {
  console.log(`\n${colors.cyan('🔍 检查端口占用情况')}:`)
  console.log('==================')

  const conflictPorts = []

  for (const [serviceName, port] of Object.entries(requiredPorts)) {
    const status = checkPortOccupancy(port)

    if (status.occupied) {
      console.log(`  端口 ${port}: ${colors.red('被占用')} (${serviceName})`)
      console.log(`    ${colors.yellow('进程信息')}: ${status.processInfo}`)

      // 检查是否是开发服务器进程
      const isDevProcess = status.command.includes('vite') ||
                          status.command.includes('next') ||
                          status.command.includes('node.*dev') ||
                          status.command.includes('concurrently') ||
                          status.processInfo.includes('vite') ||
                          status.processInfo.includes('next') ||
                          status.processInfo.includes('dev')

      if (isDevProcess) {
        console.log(`    ${colors.cyan('检测到开发服务器进程')}`)
        conflictPorts.push({
          port,
          serviceName,
          ...status,
          isDevProcess,
          canStop: true
        })
      } else {
        console.log(`    ${colors.yellow('非开发服务器进程')}`)
        conflictPorts.push({
          port,
          serviceName,
          ...status,
          isDevProcess: false,
          canStop: false
        })
      }
    } else {
      console.log(`  端口 ${port}: ${colors.green('空闲')} (${serviceName})`)
    }
  }

  if (conflictPorts.length === 0) {
    console.log(`\n${colors.green('✅ 无端口冲突，可以启动开发服务器')}`)
    return { shouldProceed: true }
  }

  console.log(`\n${colors.yellow('⚠️ 检测到端口冲突')}`)

  // 统计可以停止和不能停止的进程
  const stoppableProcesses = conflictPorts.filter(p => p.canStop && p.isDevProcess)
  const nonStoppableProcesses = conflictPorts.filter(p => !p.canStop || !p.isDevProcess)

  if (stoppableProcesses.length > 0) {
    console.log(`\n${colors.blue('🛑 发现可以停止的开发服务器进程')}:`)
    stoppableProcesses.forEach(p => {
      console.log(`  - ${p.serviceName} (端口 ${p.port}, PID ${p.pid})`)
    })

    // 询问用户是否要停止现有的开发服务器
    return new Promise((resolve) => {
      rl.question(`\n${colors.yellow('是否停止现有的开发服务器进程？')} [y/N]: `, (answer) => {
        if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
          resolve({ shouldProceed: true, stopProcesses: stoppableProcesses })
        } else {
          console.log(`\n${colors.red('❌ 用户取消，停止启动开发服务器')}`)
          resolve({ shouldProceed: false })
        }
      })
    })
  }

  if (nonStoppableProcesses.length > 0) {
    console.log(`\n${colors.red('❌ 发现无法停止的进程占用端口')}:`)
    nonStoppableProcesses.forEach(p => {
      console.log(`  - ${p.serviceName} (端口 ${p.port}, PID ${p.pid}): ${p.command}`)
    })

    console.log(`\n${colors.yellow('解决方案')}:`)
    nonStoppableProcesses.forEach(p => {
      console.log(`  手动停止进程 ${p.pid}: kill ${p.pid}`)
    })

    return { shouldProceed: false }
  }

  return { shouldProceed: true }
}

// 停止指定的进程
function stopProcesses(processes) {
  console.log(`\n${colors.cyan('🛑 停止开发服务器进程')}:`)
  console.log('==================')

  let stoppedCount = 0

  processes.forEach(process => {
    try {
      console.log(`停止 ${process.serviceName} (PID ${process.pid})...`)
      execSync(`kill ${process.pid}`, { stdio: 'ignore' })

      // 等待进程结束
      let attempts = 0
      while (attempts < 10) {
        const stillOccupied = checkPortOccupancy(process.port)
        if (!stillOccupied.occupied) {
          console.log(`  ${colors.green('✅ 已停止')}`)
          stoppedCount++
          break
        }
        attempts++
        execSync('sleep 0.5', { stdio: 'ignore' })
      }

      if (attempts >= 10) {
        console.log(`  ${colors.yellow('⚠️ 进程未响应，强制停止')}`)
        execSync(`kill -9 ${process.pid}`, { stdio: 'ignore' })
        stoppedCount++
      }
    } catch (error) {
      console.log(`  ${colors.red('❌ 停止失败')}: ${error.message}`)
    }
  })

  if (stoppedCount > 0) {
    console.log(`\n${colors.green(`✅ 成功停止 ${stoppedCount} 个进程`)}`)
  }

  return stoppedCount
}

// 停止所有服务
function stopAllServices() {
  console.log(`\n${colors.cyan('🛑 停止所有服务')}:`)
  console.log('==================')

  try {
    // 停止 Docker 服务
    console.log('停止 Docker 服务...')
    execSync('docker-compose -f docker-compose.dev.yml down', { stdio: 'inherit' })
    execSync('docker-compose -f docker-compose.dev.monorepo.yml down', { stdio: 'inherit' })

    // 停止本地 Node.js 进程
    console.log('停止本地 Node.js 服务...')
    try {
      // 检查并停止 Vite 进程
      const viteProcesses = execSync('ps aux | grep -E "vite.*--port" | grep -v grep', { encoding: 'utf8' })
      if (viteProcesses.trim()) {
        console.log('发现 Vite 进程，正在停止...')
        execSync('pkill -f "vite.*--port"', { stdio: 'ignore' })
      }

      // 检查并停止 Next.js 进程
      const nextProcesses = execSync('ps aux | grep -E "next-server|next.*dev" | grep -v grep', { encoding: 'utf8' })
      if (nextProcesses.trim()) {
        console.log('发现 Next.js 进程，正在停止...')
        execSync('pkill -f "next-server|next.*dev"', { stdio: 'ignore' })
      }

      // 检查并停止 concurrently 进程
      const concurrentlyProcesses = execSync('ps aux | grep -E "concurrently" | grep -v grep', { encoding: 'utf8' })
      if (concurrentlyProcesses.trim()) {
        console.log('发现 concurrently 进程，正在停止...')
        execSync('pkill -f "concurrently"', { stdio: 'ignore' })
      }

      // 等待进程完全停止
      execSync('sleep 2', { stdio: 'ignore' })
      console.log('✅ 本地服务已停止')
    } catch {
      console.log('ℹ️ 无本地服务需要停止')
    }

    console.log(`${colors.green('✅ 所有服务已停止')}`)

  } catch (error) {
    console.log(`${colors.red('❌ 停止服务时出错')}: ${error.message}`)
  }
}

// 启动开发模式
async function startDevelopmentMode(mode) {
  const config = DEVELOPMENT_MODES[mode]
  if (!config) {
    console.log(`${colors.red('❌ 未知的开发模式')}: ${mode}`)
    return
  }

  console.log(`\n${colors.cyan('🚀 启动')}: ${config.name}`)
  console.log(`📝 ${config.description}`)
  console.log('==================')

  try {
    // 智能端口冲突处理
    const portResult = await handlePortConflicts(config.ports, config.name)

    if (!portResult.shouldProceed) {
      console.log(`\n${colors.yellow('启动已取消')}`)
      return
    }

    // 如果需要停止进程，先停止
    if (portResult.stopProcesses && portResult.stopProcesses.length > 0) {
      const stoppedCount = stopProcesses(portResult.stopProcesses)
      if (stoppedCount > 0) {
        // 等待系统稳定
        console.log('等待系统稳定...')
        execSync('sleep 1', { stdio: 'ignore' })
      }
    }

    // 执行环境检查
    console.log('\n检查开发环境...')
    execSync('node scripts/check-dev-env.js', { stdio: 'inherit' })

    // 启动开发服务器
    console.log(`\n${colors.green('启动')}: ${config.name}...`)
    console.log(`访问地址:`)
    if (config.ports.core) {
      console.log(`  核心库: http://localhost:${config.ports.core}`)
    }
    if (config.ports.website) {
      console.log(`  Website: http://localhost:${config.ports.website}`)
    }
    if (config.ports.storybook) {
      console.log(`  Storybook: http://localhost:${config.ports.storybook}`)
    }
    if (config.ports.recipes) {
      console.log(`  配方预览: http://localhost:${config.ports.recipes}`)
    }
    console.log('==================')

    execSync(`pnpm ${config.command}`, { stdio: 'inherit' })

  } catch (error) {
    console.log(`${colors.red('❌ 启动失败')}: ${error.message}`)
    console.log(`\n${colors.yellow('故障排除建议')}:`)
    console.log('1. 检查端口是否被占用')
    console.log('2. 运行 pnpm install 安装依赖')
    console.log('3. 检查 Node.js 和 pnpm 版本')
    console.log('4. 查看 Docker 服务状态')
    console.log('5. 运行 pnpm local:dev status 检查环境状态')
  }
}

// 显示主菜单
function showMenu() {
  console.log(`
${colors.magenta('🚀 Xorigo UI 开发环境管理器')}
==============================

${colors.blue('开发模式选择')}:
1. ${colors.green('本地开发模式')} (推荐日常开发)
   - 直接在本地运行开发服务器
   - 启动快、调试方便、资源占用少
   - 端口: 核心库 3001, Website 3100

2. ${colors.blue('Docker 核心库模式')} (核心库开发)
   - 在 Docker 中运行核心库，本地运行 Website
   - 环境一致性保障
   - 端口: 核心库 3001, Website 3100

3. ${colors.blue('Docker 完整模式')} (团队协作)
   - 在 Docker 中运行完整 Monorepo 环境
   - 完全隔离、团队协作友好
   - 端口: Website 3100, Storybook 6006, 配方预览 3101

4. ${colors.blue('混合模式')} (性能最优)
   - 本地开发 + Docker 辅助
   - 性能最优、灵活配置
   - 端口: 核心库 3001, Website 3100

${colors.yellow('工具选项')}:
5. 📊 检查环境状态
6. 🛑 停止所有服务
7. 🔧 环境配置帮助
8. 📋 端口使用说明
9. ❌ 退出

${colors.cyan('当前状态')}: ${getStatusSummary()}
  `)

  rl.question(`${colors.yellow('请选择 (1-9)')}: `, handleUserChoice)
}

// 获取状态摘要
function getStatusSummary() {
  try {
    const hasDocker = execSync('docker --version', { stdio: 'ignore' }).length > 0
    const hasPnpm = execSync('pnpm --version', { stdio: 'ignore' }).length > 0

    let localProcesses = 0
    try {
      localProcesses = execSync('ps aux | grep -E "(node|vite|next)" | grep -v grep | wc -l', { encoding: 'utf8' }).trim()
    } catch {
      localProcesses = '0'
    }

    const dockerRunning = execSync('docker ps --filter "name=xorigo" --quiet | wc -l', { encoding: 'utf8' }).trim() > '0'

    let status = []
    if (hasPnpm) status.push('pnpm ✅')
    if (hasDocker) status.push('Docker ✅')
    if (dockerRunning) status.push('容器运行中 🐳')
    if (localProcesses > '0') status.push('本地服务运行中 🚀')

    return status.length > 0 ? status.join(', ') : '空闲'
  } catch {
    return '检查中...'
  }
}

// 处理用户选择
async function handleUserChoice(choice) {
  switch (choice.trim()) {
    case '1':
      rl.close()
      await startDevelopmentMode('LOCAL')
      break
    case '2':
      rl.close()
      await startDevelopmentMode('DOCKER_CORE')
      break
    case '3':
      rl.close()
      await startDevelopmentMode('DOCKER_MONOREPO')
      break
    case '4':
      rl.close()
      await startDevelopmentMode('HYBRID')
      break
    case '5':
      getEnvironmentStatus()
      setTimeout(() => showMenu(), 2000)
      break
    case '6':
      stopAllServices()
      setTimeout(() => showMenu(), 2000)
      break
    case '7':
      showEnvironmentHelp()
      setTimeout(() => showMenu(), 2000)
      break
    case '8':
      showPortUsage()
      setTimeout(() => showMenu(), 2000)
      break
    case '9':
      console.log(`\n${colors.green('👋 再见！')}`)
      rl.close()
      process.exit(0)
    default:
      console.log(`${colors.red('❌ 无效选择')}: ${choice}`)
      setTimeout(() => showMenu(), 1000)
  }
}

// 显示环境配置帮助
function showEnvironmentHelp() {
  console.log(`
${colors.cyan('🔧 环境配置帮助')}
==================

${colors.blue('快速设置命令')}:
${colors.yellow('首次设置')}:
  pnpm install              # 安装依赖
  pnpm local:dev:check      # 检查本地环境

${colors.yellow('环境问题排查')}:
  pnpm type-check          # TypeScript 类型检查
  pnpm lint                 # ESLint 代码检查
  pnpm test                 # 运行测试

${colors.blue('Docker 相关')}:
${colors.yellow('构建镜像')}:
  docker-compose -f docker-compose.dev.yml build

${colors.yellow('查看日志')}:
  pnpm docker:logs         # 查看核心库日志
  pnpm docker:logs:monorepo # 查看 monorepo 日志

${colors.yellow('清理 Docker')}:
  docker system prune -f   # 清理未使用的镜像和容器
  docker volume prune -f   # 清理未使用的卷

${colors.blue('端口冲突解决')}:
${colors.yellow('查找占用端口的进程')}:
  lsof -ti:3001            # 查找端口 3001 的进程
  kill -9 <PID>             # 终止进程

${colors.yellow('常用端口')}:
  3000: ${colors.red('保留给其他库')}
  3001: 核心库开发服务器
  3002: 核心库预览服务器
  3100: Website 开发服务器
  3101: 配方预览服务器
  6006: Storybook 开发服务器
  6380: Redis 开发服务器

${colors.blue('性能优化')}:
${colors.yellow('本地开发优化')}:
  - 关闭不必要的浏览器标签
  - 使用 pnpm 而非 npm (更快)
  - 启用 VS Code 扩展自动保存

${colors.yellow('Docker 优化')}:
  - 确保 Docker Desktop 有足够内存
  - 使用 .dockerignore 减少构建上下文
  - 定期清理 Docker 缓存
  `)
}

// 显示端口使用说明
function showPortUsage() {
  console.log(`
${colors.cyan('📋 端口使用说明')}
==================

${colors.blue('端口分配表')}:
${colors.green('✅ 可用端口')}:
  3001: 核心库开发服务器 (Vite)
  3002: 核心库预览服务器 (Vite Preview)
  3100: Website 开发服务器 (Next.js)
  3101: 配方预览服务器 (Next.js)
  6006: Storybook 开发服务器
  6380: Redis 开发服务器

${colors.red('❌ 保留端口')}:
  3000: 为其他库保留，请勿占用

${colors.blue('端口访问地址')}:
${colors.yellow('核心库开发')}:
  http://localhost:3001
  http://localhost:3001/dev  # Vite 开发工具

${colors.yellow('Website 开发')}:
  http://localhost:3100
  http://localhost:3100/recipes  # 配方预览页面

${colors.yellow('文档和示例')}:
  http://localhost:6006  # Storybook 交互式文档

${colors.blue('端口冲突解决')}:
${colors.yellow('如果端口被占用')}:
1. 找到占用端口的进程:
   lsof -ti:3001

2. 终止进程:
   kill -9 <PID>

3. 或者使用命令清理相关服务:
   pnpm docker:stop

${colors.blue('防火墙和网络')}:
${colors.yellow('确保防火墙允许以下端口')}:
- 3001 (TCP) - 核心库开发
- 3002 (TCP) - 核心库预览
- 3100 (TCP) - Website 开发
- 3101 (TCP) - 配方预览
- 6006 (TCP) - Storybook
- 6380 (TCP) - Redis

${colors.yellow('WSL 用户注意事项')}:
- Windows 防火墙可能阻止端口访问
- 使用 localhost 或 127.0.0.1 而非 0.0.0.0
- 确保 WSL 网络配置正确
  `)
}

// 启动交互菜单
if (process.argv[2]) {
  // 支持命令行参数直接启动
  const mode = process.argv[2].toUpperCase()
  const validModes = Object.keys(DEVELOPMENT_MODES)

  if (validModes.includes(mode)) {
    console.log(`${colors.cyan('🚀 直接启动模式')}: ${DEVELOPMENT_MODES[mode].name}`)
    startDevelopmentMode(mode).catch(error => {
      console.error(`${colors.red('启动失败')}: ${error.message}`)
      process.exit(1)
    })
  } else if (process.argv[2] === 'status') {
    getEnvironmentStatus()
  } else if (process.argv[2] === 'stop') {
    stopAllServices()
  } else if (process.argv[2] === 'help') {
    console.log(`
${colors.cyan('用法')}:
  node scripts/dev-env-manager.js [mode]

${colors.blue('可用模式')}:
  local, docker-core, docker-monorepo, hybrid

${colors.blue('其他选项')}:
  status  - 检查环境状态
  stop    - 停止所有服务
  help    - 显示此帮助信息
    `)
  }
} else {
  // 启动交互菜单
  showMenu()
}