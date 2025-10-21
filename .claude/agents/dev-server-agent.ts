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
      version: '2.0.0',
      description: '专门负责开发服务器和Docker容器操作的子代理（增强版）',
      responsibilities: [
        'Docker 开发环境管理',
        '热更新容器监控',
        '端口冲突检测和清理',
        '容器日志管理',
        '开发环境健康检查',
        '智能编译错误诊断',
        '导入链分析',
        'Monorepo 包依赖检查',
        '容器路径映射'
      ],
      strictRules: [
        '❌ 严禁使用 npm run dev 命令',
        '✅ 必须使用 Docker 热更新容器',
        '✅ 端口必须为 3100',
        '✅ 使用 docker-compose.dev.monorepo.yml'
      ],
      newFeatures: [
        '🆕 增强的健康检查（包含编译状态）',
        '🆕 智能诊断编译错误',
        '🆕 导入链错误分析',
        '🆕 TypeScript 错误建议',
        '🆕 容器路径映射提示',
        '🆕 Monorepo 包依赖验证'
      ]
    }
  }

  /**
   * 健康检查（增强版）
   */
  async healthCheck() {
    try {
      const isDockerRunning = await this.checkDockerStatus()
      const isContainerRunning = await this.checkContainerStatus()
      const containerHealth = await this.checkContainerHealth()
      const isPortAvailable = await this.checkPortAvailability()
      const compilationStatus = await this.checkCompilationStatus()

      const isHealthy =
        isDockerRunning &&
        isContainerRunning &&
        containerHealth.status === 'healthy' &&
        compilationStatus.status === 'success'

      return {
        status: isHealthy ? 'healthy' : 'unhealthy',
        docker: isDockerRunning,
        container: isContainerRunning,
        containerHealth: containerHealth.status,
        containerHealthDetails: containerHealth.details,
        port: isPortAvailable,
        portNumber: this.port,
        compilation: compilationStatus,
        lastCheck: new Date().toISOString(),
        recommendations: this.generateHealthRecommendations({
          isDockerRunning,
          isContainerRunning,
          containerHealth,
          compilationStatus
        })
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
   * 检查容器健康状态（新增）
   */
  private async checkContainerHealth(): Promise<{ status: string; details: string }> {
    try {
      const result = await this.executeCommand(
        `docker inspect --format='{{.State.Health.Status}}' ${this.containerName} 2>/dev/null || echo "no-health-check"`
      )
      const status = result.stdout.trim()

      // 如果容器有健康检查，获取详细信息
      if (status !== 'no-health-check' && status !== 'starting') {
        const details = await this.executeCommand(
          `docker inspect --format='{{json .State.Health}}' ${this.containerName} 2>/dev/null`
        )
        return { status, details: details.stdout }
      }

      return { status: status === 'no-health-check' ? 'unknown' : status, details: '' }
    } catch (error) {
      return { status: 'unknown', details: error.message }
    }
  }

  /**
   * 检查编译状态（新增）
   */
  private async checkCompilationStatus(): Promise<{
    status: 'success' | 'error' | 'unknown'
    errors: string[]
    warnings: string[]
  }> {
    try {
      const logs = await this.executeCommand(
        `docker logs ${this.containerName} --tail 100 2>&1`
      )

      const errors: string[] = []
      const warnings: string[] = []

      // 分析日志中的编译错误
      const lines = logs.stdout.split('\n')
      for (const line of lines) {
        if (line.includes('error') || line.includes('Error') || line.includes('Failed')) {
          errors.push(line.trim())
        }
        if (line.includes('warn') || line.includes('Warning')) {
          warnings.push(line.trim())
        }
      }

      // 检查是否有编译成功的标志
      const hasSuccess = logs.stdout.includes('Compiled') || logs.stdout.includes('compiled')
      const hasErrors = errors.length > 0

      return {
        status: hasErrors ? 'error' : (hasSuccess ? 'success' : 'unknown'),
        errors: errors.slice(0, 10), // 最多返回10个错误
        warnings: warnings.slice(0, 5) // 最多返回5个警告
      }
    } catch (error) {
      return { status: 'unknown', errors: [], warnings: [] }
    }
  }

  /**
   * 生成健康检查建议（新增）
   */
  private generateHealthRecommendations(healthData: any): string[] {
    const recommendations: string[] = []

    if (!healthData.isDockerRunning) {
      recommendations.push('🐳 Docker 未运行 - 请启动 Docker Desktop')
    }

    if (!healthData.isContainerRunning) {
      recommendations.push('📦 容器未运行 - 执行 npm run docker:dev 启动容器')
    }

    if (healthData.containerHealth.status === 'unhealthy') {
      recommendations.push('⚠️ 容器不健康 - 检查日志: docker logs xorigo-ui-website-dev')
    }

    if (healthData.compilationStatus.status === 'error') {
      recommendations.push('❌ 编译错误 - 运行诊断工具: npm run diagnose')
      if (healthData.compilationStatus.errors.length > 0) {
        recommendations.push(`   首个错误: ${healthData.compilationStatus.errors[0]}`)
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ 一切正常 - 开发环境运行良好')
    }

    return recommendations
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
   * 智能诊断编译错误（新增）
   */
  async diagnoseCompilationErrors() {
    console.log('🔍 开始智能诊断编译错误...')

    try {
      // 获取容器日志
      const logs = await this.executeCommand(
        `docker logs ${this.containerName} --tail 200 2>&1`
      )

      // 解析编译错误
      const diagnosis = this.parseCompilationErrors(logs.stdout)

      // 生成诊断报告
      const report = this.generateDiagnosisReport(diagnosis)

      console.log(report)
      return diagnosis
    } catch (error) {
      console.error('❌ 诊断失败:', error.message)
      throw error
    }
  }

  /**
   * 解析编译错误（新增）
   */
  private parseCompilationErrors(logs: string): {
    errors: Array<{
      type: string
      message: string
      file?: string
      importChain?: string[]
      suggestions?: string[]
    }>
    summary: {
      totalErrors: number
      errorTypes: Record<string, number>
      criticalFiles: string[]
    }
  } {
    const errors: any[] = []
    const errorTypes: Record<string, number> = {}
    const criticalFiles: Set<string> = new Set()

    const lines = logs.split('\n')

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // 检测 Next.js 编译错误
      if (line.includes('Failed to compile') || line.includes('error')) {
        const error: any = {
          type: 'compilation',
          message: line.trim()
        }

        // 提取文件路径
        const fileMatch = line.match(/\.\/([^:]+\.(tsx|ts|js|jsx))/)
        if (fileMatch) {
          error.file = fileMatch[1]
          criticalFiles.add(fileMatch[1])
        }

        // 检测导入链错误
        if (line.includes('Import trace for requested module:')) {
          error.type = 'import-chain'
          const importChain: string[] = []

          // 收集导入链
          for (let j = i + 1; j < Math.min(i + 10, lines.length); j++) {
            const chainLine = lines[j]
            if (chainLine.trim().startsWith('./') || chainLine.trim().startsWith('src/')) {
              importChain.push(chainLine.trim())
            } else if (chainLine.includes('GET ') || chainLine.includes('error')) {
              break
            }
          }

          error.importChain = importChain
          error.suggestions = this.suggestImportChainFix(importChain)
        }

        // 检测文件不存在错误
        if (line.includes('No such file or directory') || line.includes('Cannot find module')) {
          error.type = 'missing-file'
          error.suggestions = this.suggestMissingFileFix(error.file)
        }

        // 检测 TypeScript 错误
        if (line.includes('TS') && /TS\d{4}/.test(line)) {
          error.type = 'typescript'
          const tsCodeMatch = line.match(/TS(\d{4})/)
          if (tsCodeMatch) {
            error.tsCode = tsCodeMatch[1]
            error.suggestions = this.suggestTypeScriptFix(tsCodeMatch[1])
          }
        }

        errors.push(error)
        errorTypes[error.type] = (errorTypes[error.type] || 0) + 1
      }
    }

    return {
      errors,
      summary: {
        totalErrors: errors.length,
        errorTypes,
        criticalFiles: Array.from(criticalFiles)
      }
    }
  }

  /**
   * 建议导入链修复方案（新增）
   */
  private suggestImportChainFix(importChain: string[]): string[] {
    const suggestions: string[] = []

    if (importChain.length === 0) return suggestions

    // 找到链的起点（通常是最后一个文件）
    const lastFile = importChain[importChain.length - 1]

    suggestions.push(`📍 检查文件: ${lastFile}`)
    suggestions.push(`🔧 可能的修复:`)
    suggestions.push(`   1. 检查 ${lastFile} 中的导入语句`)
    suggestions.push(`   2. 确认被导入的文件是否存在`)
    suggestions.push(`   3. 检查导出语句是否正确`)

    // 检测常见的模式
    if (importChain.some(file => file.includes('/index.ts') || file.includes('/index.tsx'))) {
      suggestions.push(`   4. 检查 index.ts 中是否有错误的重导出`)
    }

    if (importChain.some(file => file.includes('marketing') || file.includes('components'))) {
      suggestions.push(`   5. 检查组件目录结构是否正确`)
    }

    return suggestions
  }

  /**
   * 建议缺失文件修复方案（新增）
   */
  private suggestMissingFileFix(file?: string): string[] {
    const suggestions: string[] = []

    if (!file) return suggestions

    suggestions.push(`📍 文件不存在: ${file}`)
    suggestions.push(`🔧 可能的修复:`)
    suggestions.push(`   1. 检查文件路径拼写是否正确`)
    suggestions.push(`   2. 确认文件是否在正确的目录`)
    suggestions.push(`   3. 检查是否误删除了文件`)
    suggestions.push(`   4. 如果是从 index.ts 导出，检查导出语句`)

    // 容器路径映射提示
    if (file.startsWith('/app/')) {
      const hostPath = file.replace('/app/', '')
      suggestions.push(`   💡 容器路径 ${file} 映射到宿主机路径: ${hostPath}`)
    }

    return suggestions
  }

  /**
   * 建议 TypeScript 错误修复方案（新增）
   */
  private suggestTypeScriptFix(tsCode: string): string[] {
    const suggestions: string[] = []

    const commonErrors: Record<string, string[]> = {
      '2307': ['模块未找到', '检查导入路径', '确认包已安装'],
      '2503': ['找不到命名空间', '添加类型声明', '检查 tsconfig.json'],
      '2604': ['JSX 元素类型错误', '检查组件类型定义', '使用 React.ElementType'],
      '2786': ['JSX 组件使用错误', '检查组件签名', '确认 Props 类型']
    }

    if (commonErrors[tsCode]) {
      suggestions.push(`📍 TypeScript 错误 TS${tsCode}`)
      suggestions.push(`🔧 常见原因:`)
      commonErrors[tsCode].forEach((suggestion, index) => {
        suggestions.push(`   ${index + 1}. ${suggestion}`)
      })
    }

    return suggestions
  }

  /**
   * 生成诊断报告（新增）
   */
  private generateDiagnosisReport(diagnosis: any): string {
    const { errors, summary } = diagnosis
    let report = '\n'
    report += '=' .repeat(60) + '\n'
    report += '🔍 编译错误诊断报告\n'
    report += '='.repeat(60) + '\n\n'

    // 摘要
    report += `📊 错误摘要:\n`
    report += `   总错误数: ${summary.totalErrors}\n`
    report += `   错误类型:\n`
    Object.entries(summary.errorTypes).forEach(([type, count]) => {
      report += `      - ${type}: ${count}\n`
    })

    if (summary.criticalFiles.length > 0) {
      report += `\n📁 关键文件:\n`
      summary.criticalFiles.forEach(file => {
        report += `   - ${file}\n`
      })
    }

    // 详细错误
    if (errors.length > 0) {
      report += `\n📋 详细错误:\n\n`

      errors.slice(0, 5).forEach((error: any, index: number) => {
        report += `${index + 1}. [${error.type.toUpperCase()}] ${error.message}\n`

        if (error.file) {
          report += `   文件: ${error.file}\n`
        }

        if (error.importChain && error.importChain.length > 0) {
          report += `   导入链:\n`
          error.importChain.forEach((file: string) => {
            report += `      → ${file}\n`
          })
        }

        if (error.suggestions && error.suggestions.length > 0) {
          report += `\n`
          error.suggestions.forEach((suggestion: string) => {
            report += `   ${suggestion}\n`
          })
        }

        report += `\n`
      })

      if (errors.length > 5) {
        report += `   ... 还有 ${errors.length - 5} 个错误未显示\n\n`
      }
    }

    report += '='.repeat(60) + '\n'

    return report
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
      'pgrep -f "npm.*run.*dev" | xargs -r kill -9 2>/dev/null || true',
      'pgrep -f "next.*dev" | xargs -r kill -9 2>/dev/null || true'
      // 注意：移除了危险的 killall node 命令
    ]

    for (const command of cleanupCommands) {
      await this.executeCommand(command)
    }

    console.log('✅ 违规进程清理完成')
  }

  /**
   * 检查 Monorepo 包依赖状态（新增）
   */
  async checkMonorepoPackages() {
    console.log('📦 检查 Monorepo 包依赖状态...')

    try {
      const packages = ['core', 'tokens', 'system', 'style-recipe']
      const packageStatus: Record<string, {
        exists: boolean
        hasBuilt: boolean
        buildDate?: string
        issues: string[]
      }> = {}

      for (const pkg of packages) {
        const pkgPath = `${this.workspace}/packages/${pkg}`
        const distPath = `${pkgPath}/dist`

        // 检查包是否存在
        const exists = await this.checkPathExists(pkgPath)

        // 检查是否已构建
        const hasBuilt = exists && await this.checkPathExists(distPath)

        // 获取构建时间
        let buildDate: string | undefined
        if (hasBuilt) {
          const result = await this.executeCommand(`ls -lt ${distPath} | head -2 | tail -1 | awk '{print $6, $7, $8}'`)
          buildDate = result.stdout.trim()
        }

        // 检查潜在问题
        const issues: string[] = []
        if (!exists) {
          issues.push('包目录不存在')
        } else if (!hasBuilt) {
          issues.push('包未构建，需要运行 npm run build')
        }

        // 检查容器内的包状态
        if (hasBuilt) {
          const containerResult = await this.executeCommand(
            `docker exec ${this.containerName} ls -la /app/packages/${pkg}/dist 2>&1 || echo "not found"`
          )

          if (containerResult.stdout.includes('not found')) {
            issues.push('容器内包未同步，需要重启容器')
          } else if (containerResult.stdout.includes('No such file')) {
            issues.push('容器内包的 dist 目录不存在')
          }
        }

        packageStatus[pkg] = { exists, hasBuilt, buildDate, issues }
      }

      // 生成报告
      console.log('\n📊 Monorepo 包状态报告:')
      Object.entries(packageStatus).forEach(([pkg, status]) => {
        const icon = status.issues.length === 0 ? '✅' : '⚠️'
        console.log(`${icon} @xorigo-ui/${pkg}:`)
        console.log(`   存在: ${status.exists ? '是' : '否'}`)
        console.log(`   已构建: ${status.hasBuilt ? '是' : '否'}`)
        if (status.buildDate) {
          console.log(`   构建时间: ${status.buildDate}`)
        }
        if (status.issues.length > 0) {
          console.log(`   问题:`)
          status.issues.forEach(issue => {
            console.log(`      - ${issue}`)
          })
        }
      })

      return packageStatus
    } catch (error) {
      console.error('❌ 检查 Monorepo 包失败:', error.message)
      throw error
    }
  }

  /**
   * 修复 Monorepo 包依赖（新增）
   */
  async fixMonorepoPackages() {
    console.log('🔧 修复 Monorepo 包依赖...')

    try {
      const packageStatus = await this.checkMonorepoPackages()

      for (const [pkg, status] of Object.entries(packageStatus)) {
        if (status.issues.length > 0) {
          console.log(`\n🔧 修复 @xorigo-ui/${pkg}...`)

          if (!status.hasBuilt) {
            console.log(`   📦 构建包: ${pkg}`)
            await this.executeCommand(`cd ${this.workspace}/packages/${pkg} && npm run build`)
          }

          if (status.issues.some(i => i.includes('容器内'))) {
            console.log(`   🔄 重启容器以同步包`)
            await this.restartDevEnvironment()
            break // 重启后无需继续修复其他包
          }
        }
      }

      console.log('✅ Monorepo 包依赖修复完成')
      return { success: true }
    } catch (error) {
      console.error('❌ 修复 Monorepo 包失败:', error.message)
      throw error
    }
  }

  /**
   * 检查路径是否存在（辅助方法）
   */
  private async checkPathExists(path: string): Promise<boolean> {
    try {
      const result = await this.executeCommand(`[ -d "${path}" ] && echo "exists" || echo "not exists"`)
      return result.stdout.includes('exists')
    } catch (error) {
      return false
    }
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
  version: '2.0.0',
  description: '专门负责开发服务器和Docker容器操作的子代理（增强版）',

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
    'health-check',
    'diagnose-compilation-errors', // 新增
    'check-monorepo-packages',     // 新增
    'fix-monorepo-packages',       // 新增
    'build-docker-images',
    'clean-docker-resources',
    'get-docker-system-info'
  ],

  // 默认配置
  defaultConfig: {
    port: 3100,
    containerName: 'xorigo-ui-website-dev',
    composeFile: 'docker-compose.dev.monorepo.yml',
    startupTimeout: 60000,
    healthCheckInterval: 30000
  },

  // 新增功能
  features: {
    // 增强的健康检查
    enhancedHealthCheck: {
      enabled: true,
      checks: [
        'Docker 运行状态',
        '容器运行状态',
        '容器健康状态',
        '端口可用性',
        '编译状态',
        '错误分析',
        '警告检测'
      ]
    },

    // 智能诊断
    intelligentDiagnosis: {
      enabled: true,
      features: [
        '编译错误解析',
        '导入链分析',
        'TypeScript 错误建议',
        '文件缺失检测',
        '容器路径映射',
        '自动修复建议'
      ]
    },

    // Monorepo 支持
    monorepoSupport: {
      enabled: true,
      packages: ['core', 'tokens', 'system', 'style-recipe'],
      features: [
        '包构建状态检查',
        '容器同步验证',
        '自动构建修复',
        '依赖关系检查'
      ]
    },

    // 错误类型支持
    errorTypes: {
      'import-chain': {
        description: '导入链错误',
        handler: 'suggestImportChainFix'
      },
      'missing-file': {
        description: '文件缺失',
        handler: 'suggestMissingFileFix'
      },
      'typescript': {
        description: 'TypeScript 编译错误',
        handler: 'suggestTypeScriptFix'
      },
      'compilation': {
        description: '通用编译错误',
        handler: 'suggestGeneralFix'
      }
    }
  },

  // 使用示例
  examples: {
    healthCheck: 'devServerAgent.healthCheck()',
    diagnose: 'devServerAgent.diagnoseCompilationErrors()',
    checkPackages: 'devServerAgent.checkMonorepoPackages()',
    fixPackages: 'devServerAgent.fixMonorepoPackages()'
  }
}

export default DevServerAgent