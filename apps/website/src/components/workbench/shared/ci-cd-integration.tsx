'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import {
  Play,
  Pause,
  RotateCcw,
  Settings,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  GitBranch,
  GitCommit,
  GitMerge,
  Package,
  Upload,
  Download,
  Server,
  Shield,
  Terminal,
  FileText,
  Activity,
  BarChart3,
  Zap,
  Code,
  TestTube,
  Package2,
  Rocket,
  Globe,
  Lock,
  Unlock,
  Eye,
  Edit,
  Trash2,
  Copy,
  Plus,
  ChevronDown,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  Timer,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  Building,
  Cloud,
  Database,
  Cpu,
  HardDrive,
  Wifi,
  WifiOff,
  RefreshCw,
  Save,
  X,
  Filter,
  Search,
  Bell,
  BellOff,
  MessageSquare,
  Link,
  ExternalLink,
  Archive,
  Flag,
  Tag,
  Star,
  Heart,
  Bookmark,
  Share2
} from 'lucide-react'

// CI/CD 流水线接口
interface CICDPipeline {
  id: string
  name: string
  description: string
  repository: {
    url: string
    branch: string
    commit: string
  }
  triggers: {
    type: 'manual' | 'schedule' | 'webhook' | 'event'
    config: Record<string, any>
  }
  stages: CICDStage[]
  status: 'idle' | 'running' | 'success' | 'failed' | 'cancelled' | 'pending'
  createdAt: Date
  updatedAt: Date
  lastRun?: Date
  nextRun?: Date
  metrics: {
    totalRuns: number
    successRate: number
    averageDuration: number
    lastRunDuration?: number
  }
  environment: 'development' | 'staging' | 'production'
  tags: string[]
}

interface CICDStage {
  id: string
  name: string
  type: 'build' | 'test' | 'security' | 'deploy' | 'quality' | 'custom'
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped'
  duration?: number
  startTime?: Date
  endTime?: Date
  config: {
    command: string
    timeout?: number
    retryCount?: number
    conditions?: Record<string, any>
  }
  artifacts?: {
    name: string
    path: string
    size: number
    checksum: string
  }[]
  logs?: string[]
  dependencies?: string[]
}

interface CICDRun {
  id: string
  pipelineId: string
  number: number
  status: 'running' | 'success' | 'failed' | 'cancelled'
  startTime: Date
  endTime?: Date
  duration?: number
  trigger: {
    type: 'manual' | 'schedule' | 'webhook' | 'event'
    triggeredBy: string
    payload?: Record<string, any>
  }
  commit: {
    hash: string
    message: string
    author: string
    branch: string
  }
  stages: {
    stageId: string
    status: 'pending' | 'running' | 'success' | 'failed' | 'skipped'
    duration?: number
    logs?: string[]
  }[]
  artifacts?: {
    name: string
    path: string
    size: number
    downloadUrl: string
  }[]
  metrics: {
    testCoverage?: number
    securityScore?: number
    performanceScore?: number
    codeQualityScore?: number
  }
}

interface CICDIntegrationProps {
  config: any
  onConfigUpdate?: (config: any) => void
  className?: string
}

export function CICDIntegration({
  config,
  onConfigUpdate,
  className
}: CICDIntegrationProps) {
  const [selectedPipeline, setSelectedPipeline] = useState<string>('')
  const [activeTab, setActiveTab] = useState<'pipelines' | 'runs' | 'environments' | 'settings'>('pipelines')
  const [viewMode, setViewMode] = useState<'list' | 'card' | 'timeline'>('card')
  const [showCreatePipeline, setShowCreatePipeline] = useState(false)

  // 模拟 CI/CD 流水线数据
  const pipelines: CICDPipeline[] = useMemo(() => [
    {
      id: 'pipeline-1',
      name: '主应用构建流水线',
      description: 'React 应用的完整构建、测试和部署流程',
      repository: {
        url: 'https://github.com/xorigo/ui-main-app.git',
        branch: 'main',
        commit: 'a1b2c3d4e5f6g7h8i9j0'
      },
      triggers: {
        type: 'webhook',
        config: {
          events: ['push', 'pull_request'],
          branches: ['main', 'develop']
        }
      },
      stages: [
        {
          id: 'stage-1',
          name: '代码质量检查',
          type: 'quality',
          status: 'success',
          duration: 120,
          config: {
            command: 'npm run lint && npm run type-check',
            timeout: 300
          }
        },
        {
          id: 'stage-2',
          name: '单元测试',
          type: 'test',
          status: 'success',
          duration: 240,
          config: {
            command: 'npm run test:unit --coverage',
            timeout: 600
          }
        },
        {
          id: 'stage-3',
          name: '构建应用',
          type: 'build',
          status: 'success',
          duration: 180,
          config: {
            command: 'npm run build',
            timeout: 900
          }
        },
        {
          id: 'stage-4',
          name: '安全扫描',
          type: 'security',
          status: 'success',
          duration: 150,
          config: {
            command: 'npm audit && npm run security:scan',
            timeout: 300
          }
        },
        {
          id: 'stage-5',
          name: '部署到生产环境',
          type: 'deploy',
          status: 'success',
          duration: 90,
          config: {
            command: 'kubectl apply -f k8s/',
            timeout: 600
          }
        }
      ],
      status: 'success',
      createdAt: new Date('2024-01-15T10:00:00Z'),
      updatedAt: new Date('2024-01-25T14:30:00Z'),
      lastRun: new Date('2024-01-25T14:30:00Z'),
      nextRun: new Date('2024-01-25T16:00:00Z'),
      metrics: {
        totalRuns: 45,
        successRate: 93.3,
        averageDuration: 780,
        lastRunDuration: 820
      },
      environment: 'production',
      tags: ['production', 'main', 'critical']
    },
    {
      id: 'pipeline-2',
      name: '组件库发布流水线',
      description: 'Xorigo UI 组件库的构建、测试和NPM发布流程',
      repository: {
        url: 'https://github.com/xorigo/ui-components.git',
        branch: 'main',
        commit: 'f1e2d3c4b5a6g7h8i9j0'
      },
      triggers: {
        type: 'webhook',
        config: {
          events: ['push'],
          branches: ['main']
        }
      },
      stages: [
        {
          id: 'stage-1',
          name: '依赖检查',
          type: 'quality',
          status: 'success',
          duration: 60,
          config: {
            command: 'npm ci --audit',
            timeout: 180
          }
        },
        {
          id: 'stage-2',
          name: '类型检查',
          type: 'quality',
          status: 'success',
          duration: 45,
          config: {
            command: 'npm run type-check',
            timeout: 120
          }
        },
        {
          id: 'stage-3',
          name: '组件测试',
          type: 'test',
          status: 'success',
          duration: 180,
          config: {
            command: 'npm run test:components',
            timeout: 300
          }
        },
        {
          id: 'stage-4',
          name: '构建组件库',
          type: 'build',
          status: 'success',
          duration: 120,
          config: {
            command: 'npm run build:lib',
            timeout: 600
          }
        },
        {
          id: 'stage-5',
          name: '发布到NPM',
          type: 'deploy',
          status: 'success',
          duration: 80,
          config: {
            command: 'npm publish',
            timeout: 300
          }
        }
      ],
      status: 'success',
      createdAt: new Date('2024-01-18T16:00:00Z'),
      updatedAt: new Date('2024-01-24T11:20:00Z'),
      lastRun: new Date('2024-01-24T11:20:00Z'),
      metrics: {
        totalRuns: 28,
        successRate: 96.4,
        averageDuration: 485,
        lastRunDuration: 460
      },
      environment: 'production',
      tags: ['npm', 'components', 'library']
    },
    {
      id: 'pipeline-3',
      name: '文档构建流水线',
      description: '文档网站的构建和部署流程',
      repository: {
        url: 'https://github.com/xorigo/ui-docs.git',
        branch: 'main',
        commit: 'b2c3d4e5f6a7g8h9i0j1'
      },
      triggers: {
        type: 'schedule',
        config: {
          cron: '0 */6 * * *',
          timezone: 'Asia/Shanghai'
        }
      },
      stages: [
        {
          id: 'stage-1',
          name: '构建文档',
          type: 'build',
          status: 'success',
          duration: 90,
          config: {
            command: 'npm run build:docs',
            timeout: 300
          }
        },
        {
          id: 'stage-2',
          name: '部署到CDN',
          type: 'deploy',
          status: 'success',
          duration: 60,
          config: {
            command: 'aws s3 sync build/ s3://docs.xorigo.com',
            timeout: 180
          }
        }
      ],
      status: 'success',
      createdAt: new Date('2024-01-20T09:00:00Z'),
      updatedAt: new Date('2024-01-25T06:00:00Z'),
      lastRun: new Date('2024-01-25T06:00:00Z'),
      nextRun: new Date('2024-01-25T12:00:00Z'),
      metrics: {
        totalRuns: 18,
        successRate: 100,
        averageDuration: 150,
        lastRunDuration: 145
      },
      environment: 'production',
      tags: ['docs', 'scheduled', 'cdn']
    }
  ], [])

  // 模拟运行历史数据
  const recentRuns: CICDRun[] = useMemo(() => [
    {
      id: 'run-1',
      pipelineId: 'pipeline-1',
      number: 156,
      status: 'success',
      startTime: new Date('2024-01-25T14:30:00Z'),
      endTime: new Date('2024-01-25T14:43:40Z'),
      duration: 820,
      trigger: {
        type: 'webhook',
        triggeredBy: 'GitHub',
        payload: {
          event: 'push',
          branch: 'main',
          commit: 'a1b2c3d4e5f6g7h8i9j0'
        }
      },
      commit: {
        hash: 'a1b2c3d4e5f6g7h8i9j0',
        message: 'feat: 添加配置版本管理功能',
        author: '张三',
        branch: 'main'
      },
      stages: [
        { stageId: 'stage-1', status: 'success', duration: 120 },
        { stageId: 'stage-2', status: 'success', duration: 240 },
        { stageId: 'stage-3', status: 'success', duration: 180 },
        { stageId: 'stage-4', status: 'success', duration: 150 },
        { stageId: 'stage-5', status: 'success', duration: 90 }
      ],
      artifacts: [
        {
          name: 'build-artifacts.zip',
          path: '/artifacts/build-156.zip',
          size: 15728640,
          downloadUrl: 'https://ci.xorigo.com/artifacts/build-156.zip'
        }
      ],
      metrics: {
        testCoverage: 87.5,
        securityScore: 92,
        performanceScore: 88,
        codeQualityScore: 91
      }
    },
    {
      id: 'run-2',
      pipelineId: 'pipeline-2',
      number: 89,
      status: 'success',
      startTime: new Date('2024-01-24T11:20:00Z'),
      endTime: new Date('2024-01-24T11:27:40Z'),
      duration: 460,
      trigger: {
        type: 'webhook',
        triggeredBy: 'GitHub'
      },
      commit: {
        hash: 'f1e2d3c4b5a6g7h8i9j0',
        message: 'fix: 修复按钮组件的TypeScript类型问题',
        author: '李四',
        branch: 'main'
      },
      stages: [
        { stageId: 'stage-1', status: 'success', duration: 60 },
        { stageId: 'stage-2', status: 'success', duration: 45 },
        { stageId: 'stage-3', status: 'success', duration: 180 },
        { stageId: 'stage-4', status: 'success', duration: 120 },
        { stageId: 'stage-5', status: 'success', duration: 80 }
      ],
      artifacts: [
        {
          name: 'xorigo-ui-1.2.3.tgz',
          path: '/artifacts/xorigo-ui-1.2.3.tgz',
          size: 2097152,
          downloadUrl: 'https://registry.npmjs.org/xorigo-ui/-/xorigo-ui-1.2.3.tgz'
        }
      ],
      metrics: {
        testCoverage: 91.2,
        securityScore: 95,
        performanceScore: 89,
        codeQualityScore: 94
      }
    }
  ], [])

  const handleRunPipeline = (pipelineId: string) => {
    console.log('Running pipeline:', pipelineId)
  }

  const handleStopPipeline = (pipelineId: string) => {
    console.log('Stopping pipeline:', pipelineId)
  }

  const handleEditPipeline = (pipelineId: string) => {
    console.log('Editing pipeline:', pipelineId)
  }

  const handleDeletePipeline = (pipelineId: string) => {
    console.log('Deleting pipeline:', pipelineId)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />
      case 'running':
        return <Activity className="w-5 h-5 text-blue-500" />
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-gray-500" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />
    }
  }

  const getStageIcon = (type: string) => {
    switch (type) {
      case 'build':
        return <Package className="w-4 h-4 text-purple-500" />
      case 'test':
        return <TestTube className="w-4 h-4 text-blue-500" />
      case 'security':
        return <Shield className="w-4 h-4 text-red-500" />
      case 'deploy':
        return <Rocket className="w-4 h-4 text-green-500" />
      case 'quality':
        return <Code className="w-4 h-4 text-orange-500" />
      default:
        return <Settings className="w-4 h-4 text-gray-500" />
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}m ${remainingSeconds}s`
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 头部控制区 */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <GitBranch className="w-7 h-7 text-blue-600" />
              CI/CD 流水线集成
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              自动化构建、测试、部署和发布流程管理
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setActiveTab('pipelines')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'pipelines'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <GitBranch className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('runs')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'runs'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Activity className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('environments')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'environments'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Server className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'settings'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>

            <Button onClick={() => setShowCreatePipeline(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              创建流水线
            </Button>
          </div>
        </div>

        {/* 统计概览 */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 border border-green-200 dark:border-green-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 dark:text-green-400">成功运行</p>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                  {pipelines.filter(p => p.status === 'success').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 dark:text-blue-400">运行中</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">
                  {pipelines.filter(p => p.status === 'running').length}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 border border-red-200 dark:border-red-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 dark:text-red-400">失败</p>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300">
                  {pipelines.filter(p => p.status === 'failed').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 dark:text-purple-400">平均成功率</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                  {Math.round(pipelines.reduce((acc, p) => acc + p.metrics.successRate, 0) / pipelines.length)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* 流水线列表 */}
      <AnimatePresence mode="wait">
        {activeTab === 'pipelines' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {pipelines.map((pipeline, index) => (
              <motion.div
                key={pipeline.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(pipeline.status)}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {pipeline.name}
                      </h3>
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        pipeline.environment === 'production'
                          ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                          : pipeline.environment === 'staging'
                          ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                      }`}>
                        {pipeline.environment}
                      </span>
                    </div>

                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {pipeline.description}
                    </p>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <GitBranch className="w-4 h-4" />
                        <span>{pipeline.repository.branch}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>平均时长: {formatDuration(pipeline.metrics.averageDuration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        <span>成功率: {pipeline.metrics.successRate}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="w-4 h-4" />
                        <span>运行次数: {pipeline.metrics.totalRuns}</span>
                      </div>
                    </div>

                    {/* 阶段指示器 */}
                    <div className="flex items-center gap-2 mb-3">
                      {pipeline.stages.map((stage, stageIndex) => (
                        <div key={stage.id} className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            stage.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                            stage.status === 'failed' ? 'bg-red-100 dark:bg-red-900/30' :
                            stage.status === 'running' ? 'bg-blue-100 dark:bg-blue-900/30' :
                            'bg-gray-100 dark:bg-gray-700'
                          }`}>
                            {getStageIcon(stage.type)}
                          </div>
                          {stageIndex < pipeline.stages.length - 1 && (
                            <div className={`w-8 h-0.5 ${
                              stage.status === 'success' ? 'bg-green-300 dark:bg-green-700' :
                              stage.status === 'failed' ? 'bg-red-300 dark:bg-red-700' :
                              'bg-gray-300 dark:bg-gray-600'
                            }`}></div>
                          )}
                        </div>
                      ))}
                    </div>

                    {pipeline.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {pipeline.tags.map(tag => (
                          <span
                            key={tag}
                            className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded-md"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-6">
                    {pipeline.status === 'running' ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleStopPipeline(pipeline.id)}
                        className="flex items-center gap-1 text-red-600 dark:text-red-400"
                      >
                        <Pause className="w-4 h-4" />
                        停止
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRunPipeline(pipeline.id)}
                        className="flex items-center gap-1"
                      >
                        <Play className="w-4 h-4" />
                        运行
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditPipeline(pipeline.id)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      编辑
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      查看
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 运行历史 */}
        {activeTab === 'runs' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {recentRuns.map((run, index) => (
              <motion.div
                key={run.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusIcon(run.status)}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          #{run.number} - {pipelines.find(p => p.id === run.pipelineId)?.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {run.commit.message}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        <span>{run.commit.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <GitBranch className="w-4 h-4" />
                        <span>{run.commit.branch}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>持续时间: {formatDuration(run.duration)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{run.startTime.toLocaleString()}</span>
                      </div>
                    </div>

                    {/* 质量指标 */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          {run.metrics.testCoverage}%
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          测试覆盖率
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {run.metrics.securityScore}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          安全评分
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                          {run.metrics.performanceScore}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          性能评分
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-semibold text-orange-600 dark:text-orange-400">
                          {run.metrics.codeQualityScore}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          代码质量
                        </div>
                      </div>
                    </div>

                    {/* 构建产物 */}
                    {run.artifacts && run.artifacts.length > 0 && (
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-500" />
                        {run.artifacts.map(artifact => (
                          <button
                            key={artifact.name}
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            {artifact.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-6">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Eye className="w-4 h-4" />
                      查看详情
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Terminal className="w-4 h-4" />
                      查看日志
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 环境管理 */}
        {activeTab === 'environments' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {['development', 'staging', 'production'].map((env, index) => (
              <motion.div
                key={env}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                    {env}
                  </h3>
                  <Server className={`w-6 h-6 ${
                    env === 'production' ? 'text-red-500' :
                    env === 'staging' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">活跃流水线</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {pipelines.filter(p => p.environment === env).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">今日运行</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {Math.floor(Math.random() * 20) + 5}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">成功率</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {Math.floor(Math.random() * 10) + 90}%
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="outline" size="sm" className="w-full">
                    管理环境
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* 设置 */}
        {activeTab === 'settings' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              CI/CD 设置
            </h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  默认运行超时 (分钟)
                </label>
                <Input
                  type="number"
                  defaultValue="30"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  最大并发运行数
                </label>
                <Input
                  type="number"
                  defaultValue="5"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  通知设置
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      流水线失败时通知
                    </span>
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      流水线成功时通知
                    </span>
                  </label>
                </div>
              </div>
              <Button className="w-full">
                保存设置
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}