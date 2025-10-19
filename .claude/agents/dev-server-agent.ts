/**
 * Xorigo UI 开发服务器代理
 *
 * 专门负责开发服务器和 Docker 容器操作的子代理
 * 严禁使用 npm run dev，必须使用 3100 端口的热更新容器
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 */

import { Bash } from 'claude-ai-tools'

export class DevServerAgent {
  private workspace: string
  private containerName = 'xorigo-ui-website-dev'
  private composeFile = 'docker-compose.dev.monorepo.yml'
  private port = 3100

  constructor(workspace: string) {
    this.workspace = workspace
  }

  /**
   * 获取代理状态信息
   */
  getStatus() {
    return {
      name: 'Development Server Agent',
      version: '1.0.0',
      description: '专门负责开发服务器和Docker容器操作的子代理',
      responsibilities: [
        'Docker 开发环境管理',
        '热更新容器监控',
        '端口冲突检测和清理',
        '容器日志管理',
        '开发环境健康检查'
      ],
      strictRules: [
        '❌ 严禁使用 npm run dev 命令',
        '✅ 必须使用 Docker 热更新容器',
        '✅ 端口必须为 3100',
        '✅ 使用 docker-compose.dev.monorepo.yml'
      ]
    }
  }

  /**
   * 健康检查
   */
  async healthCheck() {
    try {
      const isDockerRunning = await this.checkDockerStatus()
      const isContainerRunning = await this.checkContainerStatus()
      const isPortAvailable = await this.checkPortAvailability()

      return {
        status: 'healthy',
        docker: isDockerRunning,
        container: isContainerRunning,
        port: isPortAvailable,
        portNumber: this.port,
        lastCheck: new Date().toISOString()
      }
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        lastCheck: new Date().toISOString()
      }
    }
  }

  /**
   * 启动开发环境
   */
  async startDevEnvironment() {
    console.log('🚀 启动 Xorigo UI Docker 开发环境...')

    try {
      // 步骤1: 检查Docker状态
      const dockerStatus = await this.checkDockerStatus()
      if (!dockerStatus) {
        throw new Error('Docker 未运行，请先启动 Docker Desktop')
      }

      // 步骤2: 强制清理违规进程
      await this.cleanupViolatingProcesses()

      // 步骤3: 停止旧容器
      await this.stopOldContainers()

      // 步骤4: 构建并启动新容器
      console.log('🏗️ 构建 Docker 镜像...')
      await this.executeCommand(`docker-compose -f ${this.composeFile} build`)

      console.log('▶️ 启动开发容器...')
      await this.executeCommand(`docker-compose -f ${this.composeFile} up -d`)

      // 步骤5: 等待服务就绪
      console.log('⏳ 等待服务启动...')
      await this.waitForServiceReady()

      // 步骤6: 验证启动成功
      const success = await this.verifyStartup()

      if (success) {
        console.log('✅ Xorigo UI 开发环境已启动!')
        console.log(`📍 访问地址: http://localhost:${this.port}`)
        console.log('🔥 热更新已启用 - 修改代码会自动刷新')
        return { success: true, port: this.port, url: `http://localhost:${this.port}` }
      } else {
        throw new Error('容器启动失败')
      }
    } catch (error) {
      console.error('❌ 启动失败:', error.message)
      await this.showLogs()
      throw error
    }
  }

  /**
   * 停止开发环境
   */
  async stopDevEnvironment() {
    console.log('🛑 停止 Xorigo UI 开发环境...')

    try {
      await this.executeCommand(`docker-compose -f ${this.composeFile} down`)
      console.log('✅ 开发环境已停止')
      return { success: true }
    } catch (error) {
      console.error('❌ 停止失败:', error.message)
      throw error
    }
  }

  /**
   * 重启开发环境
   */
  async restartDevEnvironment() {
    console.log('🔄 重启 Xorigo UI 开发环境...')
    await this.stopDevEnvironment()
    await this.startDevEnvironment()
  }

  /**
   * Docker 镜像构建
   */
  async buildDockerImages(rebuild = false) {
    const action = rebuild ? '重新构建' : '构建'
    console.log(`🏗️ ${action} Docker 镜像...`)

    try {
      // 检查 Docker 状态
      const dockerStatus = await this.checkDockerStatus()
      if (!dockerStatus) {
        throw new Error('Docker 未运行，请先启动 Docker Desktop')
      }

      // 清理违规进程
      await this.cleanupViolatingProcesses()

      // 如果是重新构建，先停止并清理容器
      if (rebuild) {
        console.log('🧹 停止并清理旧容器...')
        await this.executeCommand(`docker-compose -f ${this.composeFile} down --rmi all`)
      }

      // 执行构建
      console.log('🔨 开始构建 Docker 镜像...')
      await this.executeCommand(`docker-compose -f ${this.composeFile} build`)

      console.log('✅ Docker 镜像构建完成!')
      return { success: true, action }
    } catch (error) {
      console.error(`❌ Docker 镜像${action}失败:`, error.message)
      throw error
    }
  }

  /**
   * 清理 Docker 资源
   */
  async cleanDockerResources() {
    console.log('🧹 清理 Docker 资源...')

    try {
      // 检查 Docker 状态
      const dockerStatus = await this.checkDockerStatus()
      if (!dockerStatus) {
        throw new Error('Docker 未运行，请先启动 Docker Desktop')
      }

      // 停止并删除容器
      console.log('🛑 停止并删除容器...')
      await this.executeCommand(`docker-compose -f ${this.composeFile} down --volumes --remove-orphans`)

      // 清理未使用的镜像
      console.log('🗑️ 清理未使用的镜像...')
      await this.executeCommand('docker image prune -f')

      // 清理未使用的网络
      console.log('🌐 清理未使用的网络...')
      await this.executeCommand('docker network prune -f')

      // 清理未使用的卷
      console.log('💾 清理未使用的卷...')
      await this.executeCommand('docker volume prune -f')

      console.log('✅ Docker 资源清理完成!')
      return { success: true }
    } catch (error) {
      console.error('❌ Docker 资源清理失败:', error.message)
      throw error
    }
  }

  /**
   * 获取 Docker 系统信息
   */
  async getDockerSystemInfo() {
    console.log('📊 获取 Docker 系统信息...')

    try {
      const dockerStatus = await this.checkDockerStatus()
      if (!dockerStatus) {
        throw new Error('Docker 未运行，请先启动 Docker Desktop')
      }

      // 获取系统信息
      const systemInfo = await this.executeCommand('docker system df')
      const containerInfo = await this.executeCommand('docker ps -a --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"')
      const imageInfo = await this.executeCommand('docker images --format "table {{.Repository}}\t{{.Tag}}\t{{.Size}}"')

      return {
        systemInfo: systemInfo.stdout,
        containerInfo: containerInfo.stdout,
        imageInfo: imageInfo.stdout,
        timestamp: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ 获取 Docker 系统信息失败:', error.message)
      throw error
    }
  }

  /**
   * 查看容器日志
   */
  async showLogs(follow = false) {
    try {
      const followFlag = follow ? '-f' : ''
      await this.executeCommand(`docker-compose -f ${this.composeFile} logs ${followFlag}`)
    } catch (error) {
      console.error('❌ 获取日志失败:', error.message)
      throw error
    }
  }

  /**
   * 检查端口冲突和违规进程
   */
  async checkForViolations() {
    console.log('🔍 检查端口冲突和违规进程...')

    const violations = {
      npmDevProcesses: [],
      conflictingPorts: [],
      conflictingProcesses: []
    }

    try {
      // 检查 npm run dev 进程
      const npmDevCheck = await this.executeCommand(
        "ps aux | grep -E \"npm.*run.*dev|next.*dev\" | grep -v grep || echo 'No processes found'"
      )

      if (npmDevCheck.stdout && !npmDevCheck.stdout.includes('No processes found')) {
        violations.npmDevProcesses = npmDevCheck.stdout.trim().split('\n').filter(line => line.trim())
      }

      // 检查端口冲突
      const portsToCheck = ['3000', '3001', '3100']
      for (const port of portsToCheck) {
        try {
          const portCheck = await this.executeCommand(`lsof -ti:${port} || echo 'Port ${port} free'`)
          if (portCheck.stdout && !portCheck.stdout.includes('free')) {
            violations.conflictingPorts.push(port)
          }
        } catch (error) {
          // 端口空闲是正常情况
        }
      }

      // 生成违规报告
      const hasViolations = violations.npmDevProcesses.length > 0 || violations.conflictingPorts.length > 0

      if (hasViolations) {
        console.log('⚠️ 发现以下违规情况:')
        if (violations.npmDevProcesses.length > 0) {
          console.log(`🚫 npm run dev 进程: ${violations.npmDevProcesses.length} 个`)
        }
        if (violations.conflictingPorts.length > 0) {
          console.log(`🚫 端口冲突: ${violations.conflictingPorts.join(', ')}`)
        }
      } else {
        console.log('✅ 未发现违规情况')
      }

      return { hasViolations, violations }
    } catch (error) {
      console.error('❌ 检查违规情况失败:', error.message)
      throw error
    }
  }

  /**
   * 强制清理违规进程
   */
  async cleanupViolatingProcesses() {
    console.log('🧹 强制清理违规进程...')

    const cleanupCommands = [
      'pkill -9 -f "npm.*run.*dev" 2>/dev/null || true',
      'pkill -9 -f "next.*dev" 2>/dev/null || true',
      'sudo killall -9 node 2>/dev/null || true',
      'pgrep -f "npm.*run.*dev" | xargs -r kill -9 2>/dev/null || true',
      'pgrep -f "next.*dev" | xargs -r kill -9 2>/dev/null || true'
    ]

    for (const command of cleanupCommands) {
      await this.executeCommand(command)
    }

    console.log('✅ 违规进程清理完成')
  }

  /**
   * 检查 Docker 状态
   */
  private async checkDockerStatus(): Promise<boolean> {
    try {
      const result = await this.executeCommand('docker info > /dev/null 2>&1 && echo "running" || echo "not running"')
      return result.stdout.includes('running')
    } catch (error) {
      return false
    }
  }

  /**
   * 检查容器状态
   */
  private async checkContainerStatus(): Promise<boolean> {
    try {
      const result = await this.executeCommand(`docker ps | grep ${this.containerName} || echo "not running"`)
      return result.stdout.includes(this.containerName)
    } catch (error) {
      return false
    }
  }

  /**
   * 检查端口可用性
   */
  private async checkPortAvailability(): Promise<boolean> {
    try {
      const result = await this.executeCommand(`curl -I http://localhost:${this.port} 2>/dev/null | head -1 || echo "not responding"`)
      return result.stdout.includes('200') || result.stdout.includes('not responding')
    } catch (error) {
      return true // 端口无响应也是可用的
    }
  }

  /**
   * 停止旧容器
   */
  private async stopOldContainers() {
    console.log('🧹 清理旧容器...')
    await this.executeCommand(`docker-compose -f ${this.composeFile} down 2>/dev/null || true`)
  }

  /**
   * 等待服务就绪
   */
  private async waitForServiceReady() {
    // 等待3秒让容器启动
    await new Promise(resolve => setTimeout(resolve, 3000))
  }

  /**
   * 验证启动成功
   */
  private async verifyStartup(): Promise<boolean> {
    try {
      const result = await this.executeCommand(`docker ps | grep -q ${this.containerName} && echo "success" || echo "failed"`)
      return result.stdout.includes('success')
    } catch (error) {
      return false
    }
  }

  /**
   * 执行命令
   */
  private async executeCommand(command: string) {
    // 这里应该使用实际的命令执行工具
    // 在实际实现中，这会是 Bash 工具的调用
    console.log(`执行命令: ${command}`)

    // 模拟命令执行
    return {
      stdout: '',
      stderr: '',
      exitCode: 0
    }
  }
}

/**
 * 单例实例
 */
let devServerAgentInstance: DevServerAgent | null = null

export function getDevServerAgent(workspace?: string): DevServerAgent {
  if (!devServerAgentInstance) {
    if (!workspace) {
      throw new Error('Workspace path is required for first initialization')
    }
    devServerAgentInstance = new DevServerAgent(workspace)
  }
  return devServerAgentInstance
}

/**
 * 代理配置
 */
export const DevServerAgentConfig = {
  name: 'Development Server Agent',
  version: '1.0.0',
  description: '专门负责开发服务器和Docker容器操作的子代理',

  // 严格规则
  strictRules: [
    '严禁使用 npm run dev 命令',
    '必须使用 Docker 热更新容器',
    '端口必须为 3100',
    '使用 docker-compose.dev.monorepo.yml',
    '启动前必须清理违规进程',
    '禁止端口冲突'
  ],

  // 支持的操作
  supportedOperations: [
    'start-dev-environment',
    'stop-dev-environment',
    'restart-dev-environment',
    'show-logs',
    'check-violations',
    'cleanup-processes',
    'health-check'
  ],

  // 默认配置
  defaultConfig: {
    port: 3100,
    containerName: 'xorigo-ui-website-dev',
    composeFile: 'docker-compose.dev.monorepo.yml',
    startupTimeout: 60000,
    healthCheckInterval: 30000
  }
}

export default DevServerAgent