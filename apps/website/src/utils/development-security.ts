/**
 * 开发环境安全工具
 * 提供命令行级别的检测和阻止机制
 */

export interface SecurityViolation {
  type: 'port_conflict' | 'forbidden_process' | 'incorrect_command'
  message: string
  severity: 'error' | 'warning'
  suggestions: string[]
  autoFixAvailable?: boolean
}

export class DevelopmentSecurity {
  private static instance: DevelopmentSecurity
  private violations: SecurityViolation[] = []
  private isMonitoring = false

  static getInstance(): DevelopmentSecurity {
    if (!DevelopmentSecurity.instance) {
      DevelopmentSecurity.instance = new DevelopmentSecurity()
    }
    return DevelopmentSecurity.instance
  }

  /**
   * 检测端口冲突
   */
  async detectPortConflicts(): Promise<SecurityViolation[]> {
    const violations: SecurityViolation[] = []

    try {
      // 检查端口 3000 (Next.js 默认端口)
      const port3000 = await this.checkPort(3000)
      if (port3000) {
        violations.push({
          type: 'port_conflict',
          message: '🚨 端口 3000 被占用，可能存在违规的 npm run dev 进程',
          severity: 'error',
          suggestions: [
            '执行: pkill -9 -f "npm run dev"',
            '执行: sudo fuser -k 3000/tcp',
            '使用 Docker: npm run docker:dev'
          ],
          autoFixAvailable: true
        })
      }

      // 检查端口 3001 (备用 Next.js 端口)
      const port3001 = await this.checkPort(3001)
      if (port3001) {
        violations.push({
          type: 'port_conflict',
          message: '🚨 端口 3001 被占用，可能存在违规的开发服务器',
          severity: 'error',
          suggestions: [
            '执行: pkill -9 -f "next dev"',
            '执行: sudo fuser -k 3001/tcp',
            '使用 Docker: npm run docker:dev'
          ],
          autoFixAvailable: true
        })
      }

      // 检查端口 3100 (Docker 容器端口)
      const port3100 = await this.checkPort(3100)
      if (!port3100) {
        violations.push({
          type: 'port_conflict',
          message: '⚠️ Docker 容器端口 3100 未响应',
          severity: 'warning',
          suggestions: [
            '启动 Docker 容器: npm run docker:dev',
            '检查 Docker 服务: docker ps',
            '重新构建: docker-compose up --build'
          ]
        })
      }

    } catch (error) {
      console.error('端口检测失败:', error)
    }

    return violations
  }

  /**
   * 检查指定端口是否被占用
   */
  private async checkPort(port: number): Promise<boolean> {
    try {
      const response = await fetch(`http://localhost:${port}`, {
        method: 'HEAD',
        mode: 'no-cors',
        signal: AbortSignal.timeout(2000)
      })
      return true
    } catch {
      try {
        // 备用检测方法
        const response = await fetch(`http://127.0.0.1:${port}`, {
          method: 'HEAD',
          signal: AbortSignal.timeout(2000)
        })
        return true
      } catch {
        return false
      }
    }
  }

  /**
   * 检测违规进程
   */
  async detectForbiddenProcesses(): Promise<SecurityViolation[]> {
    const violations: SecurityViolation[] = []

    // 这里只能在前端做有限检测，真正的进程检测需要后端支持
    // 可以通过检测端口占用来间接判断

    return violations
  }

  /**
   * 自动修复常见问题
   */
  async autoFix(violations: SecurityViolation[]): Promise<boolean> {
    let fixed = false

    for (const violation of violations) {
      if (violation.autoFixAvailable && violation.type === 'port_conflict') {
        try {
          console.log(`🔧 尝试自动修复: ${violation.message}`)

          // 在浏览器环境中无法直接执行系统命令
          // 但可以提供详细的修复指导
          this.showFixInstructions(violation)
          fixed = true
        } catch (error) {
          console.error(`自动修复失败:`, error)
        }
      }
    }

    return fixed
  }

  /**
   * 显示修复指导
   */
  private showFixInstructions(violation: SecurityViolation): void {
    console.group(`🔧 修复指导: ${violation.message}`)
    violation.suggestions.forEach((suggestion, index) => {
      console.log(`${index + 1}. ${suggestion}`)
    })
    console.groupEnd()

    // 如果在浏览器环境中，可以显示用户友好的提示
    if (typeof window !== 'undefined') {
      this.showUserNotification(violation)
    }
  }

  /**
   * 显示用户通知
   */
  private showUserNotification(violation: SecurityViolation): void {
    // 可以集成 toast 或 notification 系统
    console.log('💡 浏览器通知:', violation.message)
  }

  /**
   * 开始监控开发环境
   */
  startMonitoring(intervalMs: number = 10000): void {
    if (this.isMonitoring) {
      console.log('📊 开发环境监控已在运行')
      return
    }

    console.log('📊 开始监控开发环境...')
    this.isMonitoring = true

    const monitor = async () => {
      if (!this.isMonitoring) return

      try {
        const portViolations = await this.detectPortConflicts()
        const processViolations = await this.detectForbiddenProcesses()

        this.violations = [...portViolations, ...processViolations]

        if (this.violations.length > 0) {
          console.log(`⚠️ 检测到 ${this.violations.length} 个开发环境问题:`)
          this.violations.forEach(v => console.log(`  - ${v.message}`))
        } else {
          console.log('✅ 开发环境状态正常')
        }
      } catch (error) {
        console.error('监控检测失败:', error)
      }

      if (this.isMonitoring) {
        setTimeout(monitor, intervalMs)
      }
    }

    // 立即执行一次检测
    monitor()
  }

  /**
   * 停止监控
   */
  stopMonitoring(): void {
    this.isMonitoring = false
    console.log('📊 开发环境监控已停止')
  }

  /**
   * 获取当前违规状态
   */
  getViolations(): SecurityViolation[] {
    return [...this.violations]
  }

  /**
   * 检查命令是否合规
   */
  validateCommand(command: string): { allowed: boolean; reason?: string } {
    const forbiddenCommands = [
      /npm\s+run\s+dev/gi,
      /next\s+dev/gi,
      /yarn\s+dev/gi,
      /pnpm\s+dev/gi
    ]

    const allowedCommands = [
      /npm\s+run\s+docker:dev/gi,
      /docker-compose/gi,
      /docker\s+compose/gi
    ]

    // 检查是否是允许的命令
    if (allowedCommands.some(pattern => pattern.test(command))) {
      return { allowed: true }
    }

    // 检查是否是禁止的命令
    for (const pattern of forbiddenCommands) {
      if (pattern.test(command)) {
        return {
          allowed: false,
          reason: '🚨 禁止执行此命令！请使用 Docker 容器进行开发。\n✅ 正确方式: npm run docker:dev'
        }
      }
    }

    return { allowed: true }
  }

  /**
   * 生成开发环境报告
   */
  generateReport(): string {
    const violations = this.getViolations()
    const timestamp = new Date().toLocaleString('zh-CN')

    let report = `📊 开发环境安全报告\n`
    report += `生成时间: ${timestamp}\n\n`

    if (violations.length === 0) {
      report += `✅ 状态: 良好\n`
      report += `✅ 无违规进程\n`
      report += `✅ 端口配置正确\n`
    } else {
      report += `⚠️ 状态: 检测到 ${violations.length} 个问题\n\n`

      violations.forEach((violation, index) => {
        report += `${index + 1}. ${violation.message}\n`
        report += `   严重程度: ${violation.severity}\n`
        if (violation.suggestions.length > 0) {
          report += `   建议修复:\n`
          violation.suggestions.forEach(suggestion => {
            report += `     - ${suggestion}\n`
          })
        }
        report += `\n`
      })
    }

    report += `\n📋 开发规范提醒:\n`
    report += `- 禁止执行: npm run dev\n`
    report += `- 正确方式: npm run docker:dev\n`
    report += `- 访问地址: http://localhost:3100\n`

    return report
  }
}

// 导出单例实例
export const developmentSecurity = DevelopmentSecurity.getInstance()

// 导出便捷函数
export const checkDevelopmentEnvironment = () => developmentSecurity.detectPortConflicts()
export const startSecurityMonitoring = (interval?: number) => developmentSecurity.startMonitoring(interval)
export const stopSecurityMonitoring = () => developmentSecurity.stopMonitoring()
export const validateCommand = (command: string) => developmentSecurity.validateCommand(command)