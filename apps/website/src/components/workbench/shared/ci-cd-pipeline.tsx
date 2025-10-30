'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch,
  GitCommit,
  GitMerge,
  GitPullRequest,
  Play,
  Pause,
  Square,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  Settings,
  Terminal,
  Database,
  Server,
  Cloud,
  Download,
  Upload,
  Activity,
  BarChart3,
  PieChart,
  TrendingUp,
  FileText,
  Code,
  TestTube,
  Shield,
  Rocket,
  Package,
  Layers,
  RefreshCw,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Copy,
  Save,
  X,
  MoreHorizontal,
  Zap,
  Target,
  Flag,
  Bookmark,
  Archive,
  Globe,
  Lock,
  Unlock,
  Users,
  Calendar,
  Filter,
  Search,
  Timer,
  Cpu,
  HardDrive,
  Wifi,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'

// CI/CD相关接口定义
interface Pipeline {
  id: string
  name: string
  description: string
  repository: string
  branch: string
  trigger: 'push' | 'pull_request' | 'manual' | 'scheduled'
  status: 'active' | 'inactive' | 'paused' | 'error'
  lastRun?: Date
  nextRun?: Date
  createdAt: Date
  updatedAt: Date
  createdBy: string
  config: PipelineConfig
  statistics: PipelineStatistics
}

interface PipelineConfig {
  stages: PipelineStage[]
  environment: 'development' | 'staging' | 'production'
  notifications: NotificationConfig[]
  artifacts: ArtifactConfig[]
  security: SecurityConfig
  performance: PerformanceConfig
}

interface PipelineStage {
  id: string
  name: string
  type: 'build' | 'test' | 'deploy' | 'security' | 'quality' | 'custom'
  status: 'pending' | 'running' | 'success' | 'failure' | 'skipped' | 'cancelled'
  duration?: number
  startTime?: Date
  endTime?: Date
  commands: string[]
  dependencies: string[]
  artifacts: string[]
  environment: Record<string, string>
  conditions: StageCondition[]
}

interface StageCondition {
  type: 'branch' | 'file' | 'environment' | 'custom'
  operator: 'equals' | 'contains' | 'regex' | 'not_equals'
  value: string
  description: string
}

interface PipelineRun {
  id: string
  pipelineId: string
  pipelineName: string
  runNumber: number
  status: 'running' | 'success' | 'failure' | 'cancelled' | 'pending'
  trigger: 'push' | 'pull_request' | 'manual' | 'scheduled'
  branch: string
  commit: string
  commitMessage: string
  author: string
  startTime: Date
  endTime?: Date
  duration?: number
  stages: PipelineStage[]
  artifacts: PipelineArtifact[]
  logs: PipelineLog[]
  environment: string
  metadata: {
    runner: string
    labels: string[]
    variables: Record<string, string>
  }
}

interface PipelineArtifact {
  id: string
  name: string
  type: 'build' | 'test' | 'deploy' | 'log' | 'report'
  size: number
  downloadUrl?: string
  createdAt: Date
  expiresAt?: Date
  retention: number
}

interface PipelineLog {
  id: string
  stageId: string
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  timestamp: Date
  source: string
}

interface PipelineStatistics {
  totalRuns: number
  successRate: number
  averageDuration: number
  lastWeekRuns: number
  lastMonthRuns: number
  successRuns: number
  failureRuns: number
  cancelledRuns: number
}

interface NotificationConfig {
  type: 'email' | 'slack' | 'webhook' | 'teams'
  enabled: boolean
  conditions: ('on_success' | 'on_failure' | 'on_start' | 'on_complete')[]
  recipients: string[]
  template?: string
}

interface ArtifactConfig {
  retention: number
  compression: boolean
  encryption: boolean
  storage: 'local' | 's3' | 'gcs' | 'azure'
  paths: string[]
}

interface SecurityConfig {
  scanEnabled: boolean
  vulnerabilityCheck: boolean
  dependencyCheck: boolean
  codeAnalysis: boolean
  secretsDetection: boolean
}

interface PerformanceConfig {
  benchmarkEnabled: boolean
  loadTesting: boolean
  monitoringEnabled: boolean
  thresholds: PerformanceThreshold[]
}

interface PerformanceThreshold {
  metric: string
  value: number
  operator: 'less_than' | 'greater_than' | 'equals'
  unit: string
}

export function CICDPipeline({
  className
}: {
  className?: string
}) {
  // 状态管理
  const [activeTab, setActiveTab] = useState<'pipelines' | 'runs' | 'artifacts' | 'environments' | 'monitoring'>('pipelines')
  const [pipelines, setPipelines] = useState<Pipeline[]>([])
  const [pipelineRuns, setPipelineRuns] = useState<PipelineRun[]>([])
  const [selectedPipeline, setSelectedPipeline] = useState<Pipeline | null>(null)
  const [selectedRun, setSelectedRun] = useState<PipelineRun | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all')
  const [isCreatingPipeline, setIsCreatingPipeline] = useState(false)
  const [isRunningPipeline, setIsRunningPipeline] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // 初始化数据
  useEffect(() => {
    initializeCICDData()
  }, [])

  const initializeCICDData = () => {
    // 模拟初始化CI/CD数据
    const mockPipelines: Pipeline[] = [
      {
        id: 'pipeline-1',
        name: '前端构建流水线',
        description: 'React应用的自动化构建、测试和部署',
        repository: 'xorigo-ui/frontend',
        branch: 'main',
        trigger: 'push',
        status: 'active',
        lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
        nextRun: new Date(Date.now() + 30 * 60 * 1000),
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdBy: 'admin',
        config: {
          stages: [
            {
              id: 'stage-1',
              name: '代码检出',
              type: 'build',
              status: 'success',
              duration: 30,
              commands: ['git checkout $BRANCH', 'npm ci'],
              dependencies: [],
              artifacts: ['source-code'],
              environment: { NODE_VERSION: '18' },
              conditions: []
            },
            {
              id: 'stage-2',
              name: '代码质量检查',
              type: 'quality',
              status: 'success',
              duration: 120,
              commands: ['npm run lint', 'npm run type-check'],
              dependencies: ['stage-1'],
              artifacts: ['quality-reports'],
              environment: {},
              conditions: []
            },
            {
              id: 'stage-3',
              name: '单元测试',
              type: 'test',
              status: 'success',
              duration: 180,
              commands: ['npm run test:unit', 'npm run test:coverage'],
              dependencies: ['stage-2'],
              artifacts: ['test-reports', 'coverage'],
              environment: {},
              conditions: []
            },
            {
              id: 'stage-4',
              name: '构建应用',
              type: 'build',
              status: 'success',
              duration: 240,
              commands: ['npm run build'],
              dependencies: ['stage-3'],
              artifacts: ['build-artifacts'],
              environment: {},
              conditions: []
            }
          ],
          environment: 'production',
          notifications: [
            {
              type: 'slack',
              enabled: true,
              conditions: ['on_failure', 'on_success'],
              recipients: ['#devops', '#frontend'],
              template: 'pipeline-notification'
            }
          ],
          artifacts: {
            retention: 30,
            compression: true,
            encryption: false,
            storage: 's3',
            paths: ['build/**', 'coverage/**', 'reports/**']
          },
          security: {
            scanEnabled: true,
            vulnerabilityCheck: true,
            dependencyCheck: true,
            codeAnalysis: false,
            secretsDetection: true
          },
          performance: {
            benchmarkEnabled: false,
            loadTesting: false,
            monitoringEnabled: true,
            thresholds: [
              { metric: 'build_time', value: 300, operator: 'less_than', unit: 'seconds' }
            ]
          }
        },
        statistics: {
          totalRuns: 156,
          successRate: 94.2,
          averageDuration: 570,
          lastWeekRuns: 7,
          lastMonthRuns: 28,
          successRuns: 147,
          failureRuns: 8,
          cancelledRuns: 1
        }
      },
      {
        id: 'pipeline-2',
        name: '组件库发布流水线',
        description: '组件库的自动化测试、构建和NPM发布',
        repository: 'xorigo-ui/components',
        branch: 'main',
        trigger: 'push',
        status: 'active',
        lastRun: new Date(Date.now() - 6 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        createdBy: 'admin',
        config: {
          stages: [
            {
              id: 'stage-1',
              name: '环境准备',
              type: 'build',
              status: 'success',
              duration: 45,
              commands: ['npm ci', 'npm run setup'],
              dependencies: [],
              artifacts: [],
              environment: {},
              conditions: []
            },
            {
              id: 'stage-2',
              name: '组件测试',
              type: 'test',
              status: 'success',
              duration: 300,
              commands: ['npm run test:components', 'npm run test:visual'],
              dependencies: ['stage-1'],
              artifacts: ['test-results'],
              environment: {},
              conditions: []
            },
            {
              id: 'stage-3',
              name: '构建组件库',
              type: 'build',
              status: 'success',
              duration: 180,
              commands: ['npm run build:lib'],
              dependencies: ['stage-2'],
              artifacts: ['dist'],
              environment: {},
              conditions: []
            },
            {
              id: 'stage-4',
              name: '发布到NPM',
              type: 'deploy',
              status: 'success',
              duration: 60,
              commands: ['npm publish --access public'],
              dependencies: ['stage-3'],
              artifacts: ['package-info'],
              environment: { NPM_TOKEN: '$NPM_TOKEN' },
              conditions: [{ type: 'branch', operator: 'equals', value: 'main', description: '仅在main分支发布' }]
            }
          ],
          environment: 'production',
          notifications: [
            {
              type: 'email',
              enabled: true,
              conditions: ['on_failure', 'on_success'],
              recipients: ['team@xorigo.com'],
              template: 'publish-notification'
            }
          ],
          artifacts: {
            retention: 90,
            compression: true,
            encryption: false,
            storage: 's3',
            paths: ['dist/**', 'docs/**']
          },
          security: {
            scanEnabled: true,
            vulnerabilityCheck: true,
            dependencyCheck: true,
            codeAnalysis: true,
            secretsDetection: false
          },
          performance: {
            benchmarkEnabled: true,
            loadTesting: false,
            monitoringEnabled: true,
            thresholds: []
          }
        },
        statistics: {
          totalRuns: 89,
          successRate: 96.6,
          averageDuration: 585,
          lastWeekRuns: 4,
          lastMonthRuns: 16,
          successRuns: 86,
          failureRuns: 3,
          cancelledRuns: 0
        }
      }
    ]

    const mockRuns: PipelineRun[] = [
      {
        id: 'run-1',
        pipelineId: 'pipeline-1',
        pipelineName: '前端构建流水线',
        runNumber: 157,
        status: 'success',
        trigger: 'push',
        branch: 'main',
        commit: 'a1b2c3d4',
        commitMessage: 'feat: 添加新的CI/CD集成功能',
        author: '张三',
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 1.8 * 60 * 60 * 1000),
        duration: 720,
        stages: mockPipelines[0].config.stages,
        artifacts: [
          {
            id: 'artifact-1',
            name: 'build-artifacts',
            type: 'build',
            size: 45.6 * 1024 * 1024,
            createdAt: new Date(Date.now() - 1.9 * 60 * 60 * 1000),
            expiresAt: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
            retention: 30
          }
        ],
        logs: [],
        environment: 'production',
        metadata: {
          runner: 'github-actions-ubuntu-latest',
          labels: ['frontend', 'react', 'typescript'],
          variables: { NODE_VERSION: '18', BUILD_ENV: 'production' }
        }
      },
      {
        id: 'run-2',
        pipelineId: 'pipeline-2',
        pipelineName: '组件库发布流水线',
        runNumber: 90,
        status: 'running',
        trigger: 'push',
        branch: 'main',
        commit: 'e5f6g7h8',
        commitMessage: 'fix: 修复按钮组件的样式问题',
        author: '李四',
        startTime: new Date(Date.now() - 30 * 60 * 1000),
        stages: [
          { ...mockPipelines[1].config.stages[0], status: 'success', duration: 42 },
          { ...mockPipelines[1].config.stages[1], status: 'running', startTime: new Date(Date.now() - 28 * 60 * 1000) },
          { ...mockPipelines[1].config.stages[2], status: 'pending' },
          { ...mockPipelines[1].config.stages[3], status: 'pending' }
        ],
        artifacts: [],
        logs: [],
        environment: 'production',
        metadata: {
          runner: 'github-actions-ubuntu-latest',
          labels: ['components', 'library', 'npm'],
          variables: { NODE_VERSION: '18', PUBLISH: 'true' }
        }
      }
    ]

    setPipelines(mockPipelines)
    setPipelineRuns(mockRuns)
  }

  // 过滤和搜索数据
  const filteredPipelines = useMemo(() => {
    return pipelines.filter(pipeline =>
      pipeline.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pipeline.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pipeline.repository.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [pipelines, searchQuery])

  const filteredRuns = useMemo(() => {
    return pipelineRuns.filter(run => {
      const matchesSearch = run.pipelineName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         run.commitMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         run.author.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = selectedStatus === 'all' || run.status === selectedStatus
      const matchesEnvironment = selectedEnvironment === 'all' || run.environment === selectedEnvironment

      return matchesSearch && matchesStatus && matchesEnvironment
    })
  }, [pipelineRuns, searchQuery, selectedStatus, selectedEnvironment])

  // 展开/收起项目
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // 获取状态图标
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'failure':
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'cancelled':
      case 'paused':
      case 'inactive':
        return <Pause className="w-4 h-4 text-gray-500" />
      default:
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
    }
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
      case 'active':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'failure':
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'running':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'pending':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'cancelled':
      case 'paused':
      case 'inactive':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      default:
        return 'text-orange-600 bg-orange-50 border-orange-200'
    }
  }

  // 运行流水线
  const runPipeline = (pipelineId: string) => {
    setIsRunningPipeline(true)
    // 模拟运行流水线
    setTimeout(() => {
      setIsRunningPipeline(false)
      console.log(`Running pipeline: ${pipelineId}`)
    }, 2000)
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 头部信息 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <GitBranch className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">CI/CD流水线管理</h3>
            <p className="text-sm text-muted-foreground">
              自动化构建、测试、部署和监控的完整CI/CD解决方案
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 统计信息 */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>流水线: {pipelines.length}</span>
            <span>运行中: {pipelineRuns.filter(r => r.status === 'running').length}</span>
            <span>成功率: {pipelines.length > 0 ? (pipelines.reduce((sum, p) => sum + p.statistics.successRate, 0) / pipelines.length).toFixed(1) : 0}%</span>
          </div>

          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
            <Plus className="w-4 h-4" />
            <span>新建流水线</span>
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="flex items-center space-x-1 p-1 bg-muted rounded-lg">
        {[
          { id: 'pipelines', label: '流水线', icon: GitBranch },
          { id: 'runs', label: '运行记录', icon: Activity },
          { id: 'artifacts', label: '构建产物', icon: Package },
          { id: 'environments', label: '环境管理', icon: Server },
          { id: 'monitoring', label: '监控仪表', icon: BarChart3 }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 搜索和过滤器 */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索流水线、运行记录或提交信息..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {activeTab === 'runs' && (
          <div className="flex items-center space-x-2">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-muted rounded-md text-sm"
            >
              <option value="all">所有状态</option>
              <option value="success">成功</option>
              <option value="failure">失败</option>
              <option value="running">运行中</option>
              <option value="cancelled">已取消</option>
              <option value="pending">等待中</option>
            </select>

            <select
              value={selectedEnvironment}
              onChange={(e) => setSelectedEnvironment(e.target.value)}
              className="px-3 py-2 bg-muted rounded-md text-sm"
            >
              <option value="all">所有环境</option>
              <option value="development">开发环境</option>
              <option value="staging">测试环境</option>
              <option value="production">生产环境</option>
            </select>
          </div>
        )}
      </div>

      {/* 流水线管理 */}
      {activeTab === 'pipelines' && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {filteredPipelines.map((pipeline) => (
              <motion.div
                key={pipeline.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 bg-background border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedPipeline?.id === pipeline.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedPipeline(pipeline)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {/* 流水线图标 */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
                      <GitBranch className="w-5 h-5 text-blue-500" />
                    </div>

                    {/* 流水线信息 */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-foreground">{pipeline.name}</h5>
                        {getStatusIcon(pipeline.status)}

                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 text-xs rounded-full">
                          {pipeline.environment}
                        </span>

                        <span className="px-2 py-0.5 bg-purple-500/10 text-purple-600 text-xs rounded-full">
                          {pipeline.trigger}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {pipeline.description}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <GitBranch className="w-3 h-3" />
                          <span>{pipeline.repository}/{pipeline.branch}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Activity className="w-3 h-3" />
                          <span>{pipeline.statistics.totalRuns} 次运行</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <TrendingUp className="w-3 h-3" />
                          <span>{pipeline.statistics.successRate}% 成功率</span>
                        </div>

                        {pipeline.lastRun && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>最后运行: {pipeline.lastRun.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* 阶段进度 */}
                      <div className="mt-3 flex items-center space-x-2">
                        {pipeline.config.stages.map((stage, index) => (
                          <div key={stage.id} className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${
                              stage.status === 'success' ? 'bg-green-500' :
                              stage.status === 'failure' ? 'bg-red-500' :
                              stage.status === 'running' ? 'bg-blue-500' :
                              'bg-gray-300'
                            }`} />
                            {index < pipeline.config.stages.length - 1 && (
                              <div className="w-8 h-0.5 bg-gray-200" />
                            )}
                          </div>
                        ))}
                        <span className="text-xs text-muted-foreground ml-2">
                          {pipeline.config.stages.filter(s => s.status === 'success').length}/{pipeline.config.stages.length} 阶段
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        runPipeline(pipeline.id)
                      }}
                      disabled={isRunningPipeline || pipeline.status !== 'active'}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                      title="运行流水线"
                    >
                      <Play className="w-4 h-4 text-green-500" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpanded(pipeline.id)
                      }}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    >
                      {expandedItems.has(pipeline.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // 编辑流水线
                      }}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      title="编辑流水线"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 展开的详细信息 */}
                {expandedItems.has(pipeline.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-border space-y-4"
                  >
                    {/* 阶段详情 */}
                    <div>
                      <h6 className="text-sm font-medium mb-2">流水线阶段</h6>
                      <div className="space-y-2">
                        {pipeline.config.stages.map((stage) => (
                          <div key={stage.id} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(stage.status)}
                              <span className="text-sm font-medium">{stage.name}</span>
                              <span className="text-xs text-muted-foreground">({stage.type})</span>
                            </div>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              {stage.duration && <span>{stage.duration}s</span>}
                              <span>{stage.commands.length} 命令</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 统计信息 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-2 bg-muted rounded">
                        <p className="font-medium">{pipeline.statistics.totalRuns}</p>
                        <p className="text-xs text-muted-foreground">总运行次数</p>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <p className="font-medium">{pipeline.statistics.successRate}%</p>
                        <p className="text-xs text-muted-foreground">成功率</p>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <p className="font-medium">{pipeline.statistics.averageDuration}s</p>
                        <p className="text-xs text-muted-foreground">平均耗时</p>
                      </div>
                      <div className="p-2 bg-muted rounded">
                        <p className="font-medium">{pipeline.statistics.lastWeekRuns}</p>
                        <p className="text-xs text-muted-foreground">本周运行</p>
                      </div>
                    </div>

                    {/* 配置信息 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">通知配置</p>
                        <div className="flex flex-wrap gap-1">
                          {pipeline.config.notifications.map((notif, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded text-xs">
                              {notif.type}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="font-medium mb-1">安全扫描</p>
                        <div className="flex flex-wrap gap-1">
                          {pipeline.config.security.scanEnabled && <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded text-xs">扫描</span>}
                          {pipeline.config.security.vulnerabilityCheck && <span className="px-2 py-1 bg-orange-500/10 text-orange-600 rounded text-xs">漏洞检查</span>}
                          {pipeline.config.security.dependencyCheck && <span className="px-2 py-1 bg-purple-500/10 text-purple-600 rounded text-xs">依赖检查</span>}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 运行记录 */}
      {activeTab === 'runs' && (
        <div className="space-y-4">
          <div className="grid gap-3">
            {filteredRuns.map((run) => (
              <motion.div
                key={run.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 bg-background border rounded-lg ${getStatusColor(run.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {/* 运行状态图标 */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50">
                      {getStatusIcon(run.status)}
                    </div>

                    {/* 运行信息 */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-foreground">
                          {run.pipelineName} #{run.runNumber}
                        </h5>
                        <span className="text-xs text-muted-foreground">by {run.author}</span>

                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          run.environment === 'production' ? 'bg-red-500/10 text-red-600' :
                          run.environment === 'staging' ? 'bg-yellow-500/10 text-yellow-600' :
                          'bg-blue-500/10 text-blue-600'
                        }`}>
                          {run.environment}
                        </span>

                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          run.trigger === 'push' ? 'bg-blue-500/10 text-blue-600' :
                          run.trigger === 'pull_request' ? 'bg-purple-500/10 text-purple-600' :
                          run.trigger === 'manual' ? 'bg-green-500/10 text-green-600' :
                          'bg-gray-500/10 text-gray-600'
                        }`}>
                          {run.trigger}
                        </span>
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {run.commitMessage}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <GitCommit className="w-3 h-3" />
                          <span className="font-mono">{run.commit.substring(0, 7)}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <GitBranch className="w-3 h-3" />
                          <span>{run.branch}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>开始: {run.startTime.toLocaleString()}</span>
                        </div>

                        {run.duration && (
                          <div className="flex items-center space-x-1">
                            <Timer className="w-3 h-3" />
                            <span>耗时: {run.duration}s</span>
                          </div>
                        )}
                      </div>

                      {/* 阶段进度 */}
                      <div className="mt-3 flex items-center space-x-2">
                        {run.stages.map((stage, index) => (
                          <div key={stage.id} className="flex items-center">
                            <div className={`w-2 h-2 rounded-full ${
                              stage.status === 'success' ? 'bg-green-500' :
                              stage.status === 'failure' ? 'bg-red-500' :
                              stage.status === 'running' ? 'bg-blue-500' :
                              stage.status === 'pending' ? 'bg-yellow-500' :
                              'bg-gray-300'
                            }`} />
                            {index < run.stages.length - 1 && (
                              <div className="w-8 h-0.5 bg-gray-200" />
                            )}
                          </div>
                        ))}
                        <span className="text-xs text-muted-foreground ml-2">
                          {run.stages.filter(s => s.status === 'success').length}/{run.stages.length} 阶段完成
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 展开按钮 */}
                  <button
                    onClick={() => toggleExpanded(run.id)}
                    className="p-1.5 hover:bg-white/50 rounded-md transition-colors"
                  >
                    {expandedItems.has(run.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* 展开的详细信息 */}
                {expandedItems.has(run.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-current/20"
                  >
                    {/* 阶段详情 */}
                    <div className="mb-4">
                      <h6 className="text-sm font-medium mb-2">阶段执行情况</h6>
                      <div className="space-y-2">
                        {run.stages.map((stage) => (
                          <div key={stage.id} className="flex items-center justify-between p-2 bg-white/50 rounded">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(stage.status)}
                              <span className="text-sm font-medium">{stage.name}</span>
                              {stage.duration && <span className="text-xs text-muted-foreground">({stage.duration}s)</span>}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {stage.commands.length} 命令
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 构建产物 */}
                    {run.artifacts.length > 0 && (
                      <div className="mb-4">
                        <h6 className="text-sm font-medium mb-2">构建产物</h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {run.artifacts.map((artifact) => (
                            <div key={artifact.id} className="flex items-center justify-between p-2 bg-white/50 rounded">
                              <div className="flex items-center space-x-2">
                                <Package className="w-4 h-4" />
                                <span className="text-sm">{artifact.name}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {(artifact.size / 1024 / 1024).toFixed(1)} MB
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 运行环境 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">运行环境</p>
                        <p className="text-muted-foreground">{run.metadata.runner}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">标签</p>
                        <div className="flex flex-wrap gap-1">
                          {run.metadata.labels.map((label, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-500/10 text-blue-600 rounded text-xs">
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 构建产物 */}
      {activeTab === 'artifacts' && (
        <div className="space-y-4">
          <div className="p-6 bg-background border rounded-lg text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">构建产物管理</h4>
            <p className="text-sm text-muted-foreground mb-4">
              查看、下载和管理所有流水线生成的构建产物
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">构建产物</span>
                  <span className="text-2xl font-bold text-blue-600">234</span>
                </div>
                <p className="text-xs text-muted-foreground">总计 2.3 GB</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">测试报告</span>
                  <span className="text-2xl font-bold text-green-600">156</span>
                </div>
                <p className="text-xs text-muted-foreground">覆盖率和质量报告</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">部署包</span>
                  <span className="text-2xl font-bold text-purple-600">89</span>
                </div>
                <p className="text-xs text-muted-foreground">各环境部署包</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 环境管理 */}
      {activeTab === 'environments' && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {[
              { name: '开发环境', status: 'active', url: 'dev.xorigo.com', lastDeploy: '2小时前', version: 'v2.1.0-dev' },
              { name: '测试环境', status: 'active', url: 'staging.xorigo.com', lastDeploy: '6小时前', version: 'v2.0.5' },
              { name: '生产环境', status: 'active', url: 'xorigo.com', lastDeploy: '2天前', version: 'v2.0.4' }
            ].map((env, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-background border rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-green-500/10">
                      <Server className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <h5 className="font-medium text-foreground">{env.name}</h5>
                      <p className="text-sm text-muted-foreground">{env.url}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">{env.version}</p>
                      <p className="text-xs text-muted-foreground">最后部署: {env.lastDeploy}</p>
                    </div>

                    <button className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
                      <Download className="w-4 h-4" />
                      <span>部署</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 监控仪表 */}
      {activeTab === 'monitoring' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-background border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">今日运行</span>
                <Activity className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-600">42</p>
              <p className="text-xs text-muted-foreground">成功率 95.2%</p>
            </div>

            <div className="p-4 bg-background border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">平均耗时</span>
                <Timer className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600">3.2分钟</p>
              <p className="text-xs text-muted-foreground">比昨日减少 15%</p>
            </div>

            <div className="p-4 bg-background border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">失败次数</span>
                <XCircle className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-600">2</p>
              <p className="text-xs text-muted-foreground">需要关注</p>
            </div>

            <div className="p-4 bg-background border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">存储使用</span>
                <HardDrive className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-orange-600">8.7GB</p>
              <p className="text-xs text-muted-foreground">45% 已使用</p>
            </div>
          </div>

          {/* 图表区域 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 bg-background border rounded-lg">
              <h5 className="font-medium mb-3">运行趋势</h5>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <BarChart3 className="w-12 h-12" />
                <span className="ml-2">运行趋势图表</span>
              </div>
            </div>

            <div className="p-4 bg-background border rounded-lg">
              <h5 className="font-medium mb-3">性能指标</h5>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <PieChart className="w-12 h-12" />
                <span className="ml-2">性能分析图表</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}