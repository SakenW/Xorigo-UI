/**
 * 通用检测系统核心配置
 * 根据不同路径触发相应的检测模块，优化 token 使用
 */

export interface DetectionRule {
  id: string
  name: string
  description: string
  severity: 'error' | 'warning' | 'info'
  category: 'naming' | 'structure' | 'api' | 'content' | 'performance'
}

export interface DetectionModule {
  id: string
  name: string
  description: string
  enabled: boolean
  rules: DetectionRule[]
  check: (context: DetectionContext) => Promise<DetectionResult[]>
  tokenCost?: number // 预估 token 消耗
}

export interface DetectionContext {
  operation: 'create' | 'edit' | 'delete' | 'move'
  filePath: string
  content?: string
  oldContent?: string
  workspace: string
  timestamp: Date
}

export interface DetectionResult {
  ruleId: string
  severity: 'error' | 'warning' | 'info'
  message: string
  suggestion?: string
  autoFix?: {
    command: string
    description: string
  }
}

export interface DirectoryConfig {
  path: string
  name: string
  modules: string[] // 启用的模块 ID 列表
  excludePatterns?: string[] // 排除的文件模式
  customRules?: DetectionRule[] // 目录特有的规则
}

/**
 * 路径到模块的映射配置 - 将从外部配置文件导入
 */
export let DIRECTORY_CONFIGS: DirectoryConfig[] = []

/**
 * 更新目录配置
 */
export function updateDirectoryConfigs(configs: DirectoryConfig[]): void {
  DIRECTORY_CONFIGS = configs
  // 重新创建路径路由器实例
  if (globalDetectionSystem) {
    (globalDetectionSystem as any).router = new PathRouter(configs)
  }
}

/**
 * 检测模块注册表
 */
export const DETECTION_MODULES: Map<string, DetectionModule> = new Map()

/**
 * 路径路由器 - 根据文件路径确定要运行的检测模块
 */
export class PathRouter {
  private configs: DirectoryConfig[]

  constructor(configs: DirectoryConfig[]) {
    this.configs = configs
  }

  /**
   * 根据文件路径获取要运行的检测模块
   */
  getModulesForPath(filePath: string): DetectionModule[] {
    const config = this.configs.find(cfg => filePath.startsWith(cfg.path))

    if (!config) {
      return [] // 不在监控目录内
    }

    // 检查是否在排除列表中
    const isExcluded = config.excludePatterns?.some(pattern =>
      this.matchPattern(filePath, pattern)
    )

    if (isExcluded) {
      return []
    }

    // 返回启用的检测模块
    return config.modules
      .map(moduleId => DETECTION_MODULES.get(moduleId))
      .filter(Boolean) as DetectionModule[]
  }

  /**
   * 简单的通配符匹配
   */
  private matchPattern(path: string, pattern: string): boolean {
    const regexPattern = pattern
      .replace(/\*\*/g, '.*')
      .replace(/\*/g, '[^/]*')
      .replace(/\?/g, '.')

    return new RegExp(regexPattern).test(path)
  }

  /**
   * 获取路径所属的配置
   */
  getConfigForPath(filePath: string): DirectoryConfig | undefined {
    return this.configs.find(cfg => filePath.startsWith(cfg.path))
  }
}

/**
 * 检测系统核心类
 */
export class DetectionSystem {
  private router: PathRouter
  private enabled: boolean = true

  constructor() {
    this.router = new PathRouter(DIRECTORY_CONFIGS)
  }

  /**
   * 执行检测
   */
  async detect(context: DetectionContext): Promise<DetectionResult[]> {
    if (!this.enabled) {
      return []
    }

    // 获取适用的检测模块
    const modules = this.router.getModulesForPath(context.filePath)

    if (modules.length === 0) {
      return [] // 没有适用的检测模块
    }

    // 并行运行所有检测模块
    const results = await Promise.all(
      modules.map(module => this.runModule(module, context))
    )

    return results.flat()
  }

  /**
   * 运行单个检测模块
   */
  private async runModule(
    module: DetectionModule,
    context: DetectionContext
  ): Promise<DetectionResult[]> {
    try {
      if (!module.enabled) {
        return []
      }

      return await module.check(context)
    } catch (error) {
      console.error(`检测模块 ${module.id} 运行失败:`, error)
      return [{
        ruleId: `${module.id}-error`,
        severity: 'error',
        message: `检测模块运行失败: ${error instanceof Error ? error.message : '未知错误'}`
      }]
    }
  }

  /**
   * 启用/禁用检测系统
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
  }

  /**
   * 注册检测模块
   */
  static registerModule(module: DetectionModule): void {
    DETECTION_MODULES.set(module.id, module)
  }

  /**
   * 获取检测统计信息
   */
  getStats(): {
    totalModules: number
    enabledModules: number
    directoryConfigs: number
  } {
    return {
      totalModules: DETECTION_MODULES.size,
      enabledModules: Array.from(DETECTION_MODULES.values()).filter(m => m.enabled).length,
      directoryConfigs: DIRECTORY_CONFIGS.length
    }
  }
}

// 创建全局检测系统实例
export const globalDetectionSystem = new DetectionSystem()