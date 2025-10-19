/**
 * Xorigo UI Claude Agents 目录索引
 *
 * 这个目录包含多个独立的 Claude Agent，每个 Agent 负责特定的功能
 */

// 导出可用的 Agents
export { default as codeQualityDetector } from './code-quality-detector'
export { DevServerAgent, getDevServerAgent, getAgentManager, getDevServer } from './dev-server-agent'

/**
 * Agent 接口定义
 */
export interface AgentInterface {
  getStatus(): any
  healthCheck(): Promise<any>
}

/**
 * 开发服务器代理接口
 */
export interface DevServerInterface extends AgentInterface {
  startDevEnvironment(): Promise<any>
  stopDevEnvironment(): Promise<any>
  restartDevEnvironment(): Promise<any>
  showLogs(follow?: boolean): Promise<any>
  checkForViolations(): Promise<any>
  cleanupViolatingProcesses(): Promise<any>
  buildDockerImages(rebuild?: boolean): Promise<any>
  cleanDockerResources(): Promise<any>
  getDockerSystemInfo(): Promise<any>
}

/**
 * 可用的 Agent 列表
 */
export const AVAILABLE_AGENTS = [
  {
    name: 'code-quality-detector',
    displayName: '代码质量检测',
    description: '检测 Xorigo UI 项目的代码质量、命名规范和架构规则合规性',
    version: '1.0.0',
    path: './code-quality-detector',
    active: true
  },
  {
    name: 'dev-server-agent',
    displayName: '开发服务器代理',
    description: '专门负责开发服务器和Docker容器操作的子代理，严禁使用npm run dev',
    version: '1.0.0',
    path: './dev-server-agent',
    active: true,
    strictRules: [
      '严禁使用 npm run dev 命令',
      '必须使用 Docker 热更新容器',
      '端口必须为 3100',
      '使用 docker-compose.dev.monorepo.yml'
    ]
  }
] as const

/**
 * Agent 类型定义
 */
export type AgentName = typeof AVAILABLE_AGENTS[number]['name']

/**
 * 获取 Agent 信息
 */
export function getAgentInfo(name: AgentName) {
  return AVAILABLE_AGENTS.find(agent => agent.name === name)
}

/**
 * 获取所有活跃的 Agent
 */
export function getActiveAgents() {
  return AVAILABLE_AGENTS.filter(agent => agent.active)
}

/**
 * 检查 Agent 是否可用
 */
export function isAgentAvailable(name: AgentName): boolean {
  const agent = getAgentInfo(name)
  return agent?.active ?? false
}