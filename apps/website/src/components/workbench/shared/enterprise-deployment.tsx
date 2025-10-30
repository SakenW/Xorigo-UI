'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Server,
  Database,
  Cloud,
  Monitor,
  Smartphone,
  Tablet,
  Wifi,
  Shield,
  Activity,
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Download,
  Upload,
  RefreshCw,
  Play,
  Pause,
  Square,
  Terminal,
  Code,
  GitBranch,
  Package,
  Layers,
  HardDrive,
  Cpu,
  Zap,
  Globe,
  Lock,
  Unlock,
  Users,
  Calendar,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Copy,
  Save,
  X,
  MoreHorizontal,
  Eye,
  EyeOff,
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Thermometer,
  Wind,
  Droplets,
  ZapOff,
  Battery,
  BatteryCharging,
  Router,
  Network,
  MapPin,
  Building,
  Factory
} from 'lucide-react'

// 部署相关接口定义
interface DeploymentEnvironment {
  id: string
  name: string
  type: 'development' | 'staging' | 'production'
  status: 'active' | 'inactive' | 'maintenance' | 'error'
  platform: 'docker' | 'kubernetes' | 'vm' | 'serverless'
  region: string
  endpoint: string
  version: string
  createdAt: Date
  updatedAt: Date
  lastDeploy?: Date
  health: HealthStatus
  resources: ResourceUsage
  scaling: ScalingConfig
  monitoring: MonitoringConfig
}

interface HealthStatus {
  overall: 'healthy' | 'warning' | 'critical' | 'unknown'
  checks: HealthCheck[]
  uptime: number
  lastCheck: Date
}

interface HealthCheck {
  name: string
  status: 'pass' | 'fail' | 'warning'
  responseTime: number
  message: string
  lastCheck: Date
}

interface ResourceUsage {
  cpu: {
    current: number
    limit: number
    average: number
    peak: number
  }
  memory: {
    current: number
    limit: number
    average: number
    peak: number
  }
  storage: {
    current: number
    limit: number
    average: number
    peak: number
  }
  network: {
    inbound: number
    outbound: number
    average: number
    peak: number
  }
}

interface ScalingConfig {
  minReplicas: number
  maxReplicas: number
  currentReplicas: number
  targetCPU: number
  targetMemory: number
  autoScaling: boolean
  strategy: 'manual' | 'auto' | 'scheduled'
}

interface MonitoringConfig {
  enabled: boolean
  metrics: string[]
  alerts: AlertRule[]
  dashboards: Dashboard[]
  retention: number
}

interface AlertRule {
  id: string
  name: string
  description: string
  metric: string
  condition: AlertCondition
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
  notifications: NotificationChannel[]
  createdAt: Date
  updatedAt: Date
}

interface AlertCondition {
  operator: 'greater_than' | 'less_than' | 'equals' | 'not_equals'
  threshold: number
  duration: number
  evaluation: 'avg' | 'max' | 'min' | 'sum'
}

interface NotificationChannel {
  type: 'email' | 'slack' | 'webhook' | 'teams' | 'sms'
  enabled: boolean
  recipients: string[]
  template?: string
}

interface Dashboard {
  id: string
  name: string
  description: string
  widgets: Widget[]
  timeRange: string
  refreshInterval: number
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

interface Widget {
  id: string
  type: 'metric' | 'chart' | 'table' | 'text' | 'status'
  title: string
  query: string
  visualization: 'line' | 'bar' | 'pie' | 'gauge' | 'number'
  position: { x: number; y: number; width: number; height: number }
  config: Record<string, any>
}

interface Deployment {
  id: string
  environmentId: string
  version: string
  status: 'pending' | 'running' | 'success' | 'failed' | 'rolled_back'
  trigger: 'manual' | 'auto' | 'scheduled'
  startTime: Date
  endTime?: Date
  duration?: number
  commit?: string
  branch?: string
  author?: string
  changes: DeploymentChange[]
  rollback: boolean
  metadata: {
    image: string
    replicas: number
    resources: Record<string, string>
    annotations: Record<string, string>
  }
}

interface DeploymentChange {
  type: 'create' | 'update' | 'delete' | 'scale'
  resource: string
  description: string
  impact: 'low' | 'medium' | 'high'
}

interface PerformanceMetric {
  timestamp: Date
  name: string
  value: number
  unit: string
  tags: Record<string, string>
}

export function EnterpriseDeployment({
  className
}: {
  className?: string
}) {
  // 状态管理
  const [activeTab, setActiveTab] = useState<'environments' | 'deployments' | 'monitoring' | 'alerts' | 'dashboards'>('environments')
  const [environments, setEnvironments] = useState<DeploymentEnvironment[]>([])
  const [deployments, setDeployments] = useState<Deployment[]>([])
  const [selectedEnvironment, setSelectedEnvironment] = useState<DeploymentEnvironment | null>(null)
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [isDeploying, setIsDeploying] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // 初始化数据
  useEffect(() => {
    initializeDeploymentData()
  }, [])

  const initializeDeploymentData = () => {
    // 模拟初始化部署数据
    const mockEnvironments: DeploymentEnvironment[] = [
      {
        id: 'env-1',
        name: '开发环境',
        type: 'development',
        status: 'active',
        platform: 'docker',
        region: 'us-west-2',
        endpoint: 'dev.xorigo.com',
        version: 'v2.1.0-dev',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        lastDeploy: new Date(Date.now() - 2 * 60 * 60 * 1000),
        health: {
          overall: 'healthy',
          checks: [
            {
              name: 'API Health Check',
              status: 'pass',
              responseTime: 45,
              message: 'All services responding normally',
              lastCheck: new Date()
            },
            {
              name: 'Database Connection',
              status: 'pass',
              responseTime: 12,
              message: 'Database connection healthy',
              lastCheck: new Date()
            },
            {
              name: 'Cache Service',
              status: 'warning',
              responseTime: 180,
              message: 'Cache response time above threshold',
              lastCheck: new Date()
            }
          ],
          uptime: 99.8,
          lastCheck: new Date()
        },
        resources: {
          cpu: { current: 35, limit: 100, average: 42, peak: 68 },
          memory: { current: 2.1, limit: 4, average: 2.3, peak: 3.2 },
          storage: { current: 15.6, limit: 50, average: 16.2, peak: 18.9 },
          network: { inbound: 120, outbound: 85, average: 95, peak: 220 }
        },
        scaling: {
          minReplicas: 1,
          maxReplicas: 3,
          currentReplicas: 2,
          targetCPU: 70,
          targetMemory: 80,
          autoScaling: true,
          strategy: 'auto'
        },
        monitoring: {
          enabled: true,
          metrics: ['cpu', 'memory', 'network', 'response_time'],
          alerts: [],
          dashboards: [],
          retention: 30
        }
      },
      {
        id: 'env-2',
        name: '测试环境',
        type: 'staging',
        status: 'active',
        platform: 'kubernetes',
        region: 'us-east-1',
        endpoint: 'staging.xorigo.com',
        version: 'v2.0.5',
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        lastDeploy: new Date(Date.now() - 6 * 60 * 60 * 1000),
        health: {
          overall: 'healthy',
          checks: [
            {
              name: 'API Health Check',
              status: 'pass',
              responseTime: 52,
              message: 'All services responding normally',
              lastCheck: new Date()
            },
            {
              name: 'Database Connection',
              status: 'pass',
              responseTime: 15,
              message: 'Database connection healthy',
              lastCheck: new Date()
            }
          ],
          uptime: 99.5,
          lastCheck: new Date()
        },
        resources: {
          cpu: { current: 58, limit: 200, average: 65, peak: 120 },
          memory: { current: 6.8, limit: 16, average: 7.2, peak: 10.5 },
          storage: { current: 45.2, limit: 100, average: 46.8, peak: 52.3 },
          network: { inbound: 280, outbound: 195, average: 230, peak: 450 }
        },
        scaling: {
          minReplicas: 2,
          maxReplicas: 5,
          currentReplicas: 3,
          targetCPU: 75,
          targetMemory: 85,
          autoScaling: true,
          strategy: 'auto'
        },
        monitoring: {
          enabled: true,
          metrics: ['cpu', 'memory', 'network', 'response_time', 'error_rate'],
          alerts: [],
          dashboards: [],
          retention: 60
        }
      },
      {
        id: 'env-3',
        name: '生产环境',
        type: 'production',
        status: 'active',
        platform: 'kubernetes',
        region: 'us-east-1,us-west-2,eu-west-1',
        endpoint: 'xorigo.com',
        version: 'v2.0.4',
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        lastDeploy: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        health: {
          overall: 'healthy',
          checks: [
            {
              name: 'API Health Check',
              status: 'pass',
              responseTime: 38,
              message: 'All services responding normally',
              lastCheck: new Date()
            },
            {
              name: 'Database Connection',
              status: 'pass',
              responseTime: 8,
              message: 'Database connection healthy',
              lastCheck: new Date()
            },
            {
              name: 'Load Balancer',
              status: 'pass',
              responseTime: 25,
              message: 'Load balancer distributing traffic evenly',
              lastCheck: new Date()
            }
          ],
          uptime: 99.9,
          lastCheck: new Date()
        },
        resources: {
          cpu: { current: 320, limit: 1000, average: 340, peak: 580 },
          memory: { current: 45.6, limit: 128, average: 48.2, peak: 72.3 },
          storage: { current: 180.5, limit: 500, average: 185.6, peak: 220.8 },
          network: { inbound: 1200, outbound: 850, average: 980, peak: 2100 }
        },
        scaling: {
          minReplicas: 5,
          maxReplicas: 20,
          currentReplicas: 12,
          targetCPU: 70,
          targetMemory: 80,
          autoScaling: true,
          strategy: 'auto'
        },
        monitoring: {
          enabled: true,
          metrics: ['cpu', 'memory', 'network', 'response_time', 'error_rate', 'throughput'],
          alerts: [],
          dashboards: [],
          retention: 90
        }
      }
    ]

    const mockDeployments: Deployment[] = [
      {
        id: 'deploy-1',
        environmentId: 'env-3',
        version: 'v2.0.4',
        status: 'success',
        trigger: 'auto',
        startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 1.9 * 24 * 60 * 60 * 1000),
        duration: 3600,
        commit: 'a1b2c3d4',
        branch: 'main',
        author: 'CI/CD Bot',
        changes: [
          {
            type: 'update',
            resource: 'frontend-app',
            description: 'Updated frontend application to v2.0.4',
            impact: 'medium'
          }
        ],
        rollback: false,
        metadata: {
          image: 'xorigo/frontend:v2.0.4',
          replicas: 12,
          resources: {
            'cpu': '500m',
            'memory': '512Mi'
          },
          annotations: {
            'deployed-by': 'github-actions',
            'build-number': '156'
          }
        }
      },
      {
        id: 'deploy-2',
        environmentId: 'env-2',
        version: 'v2.0.5',
        status: 'success',
        trigger: 'auto',
        startTime: new Date(Date.now() - 6 * 60 * 60 * 1000),
        endTime: new Date(Date.now() - 5.8 * 60 * 60 * 1000),
        duration: 2400,
        commit: 'e5f6g7h8',
        branch: 'main',
        author: 'CI/CD Bot',
        changes: [
          {
            type: 'update',
            resource: 'api-server',
            description: 'Updated API server with performance improvements',
            impact: 'low'
          }
        ],
        rollback: false,
        metadata: {
          image: 'xorigo/api:v2.0.5',
          replicas: 3,
          resources: {
            'cpu': '250m',
            'memory': '256Mi'
          },
          annotations: {
            'deployed-by': 'github-actions',
            'build-number': '89'
          }
        }
      }
    ]

    setEnvironments(mockEnvironments)
    setDeployments(mockDeployments)
  }

  // 过滤和搜索数据
  const filteredEnvironments = useMemo(() => {
    return environments.filter(env =>
      env.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      env.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
      env.region.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [environments, searchQuery])

  const filteredDeployments = useMemo(() => {
    return deployments.filter(deploy => {
      const env = environments.find(e => e.id === deploy.environmentId)
      const matchesSearch = deploy.version.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         deploy.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         env?.name.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = selectedStatus === 'all' || deploy.status === selectedStatus

      return matchesSearch && matchesStatus
    })
  }, [deployments, environments, searchQuery, selectedStatus])

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
      case 'active':
      case 'success':
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'inactive':
      case 'failed':
      case 'critical':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'maintenance':
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case 'running':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'success':
      case 'healthy':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'inactive':
      case 'failed':
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'maintenance':
      case 'warning':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'running':
        return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'pending':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  // 部署应用
  const deployApplication = (environmentId: string) => {
    setIsDeploying(true)
    // 模拟部署过程
    setTimeout(() => {
      setIsDeploying(false)
      console.log(`Deploying to environment: ${environmentId}`)
    }, 3000)
  }

  // 格式化数字
  const formatNumber = (num: number) => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B'
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
    return num.toString()
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 头部信息 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Server className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">企业级部署和监控</h3>
            <p className="text-sm text-muted-foreground">
              Docker容器化部署、监控告警系统和性能指标管理
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 统计信息 */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>环境: {environments.length}</span>
            <span>活跃: {environments.filter(e => e.status === 'active').length}</span>
            <span>部署: {deployments.length}</span>
          </div>

          <button className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
            <Plus className="w-4 h-4" />
            <span>新建环境</span>
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="flex items-center space-x-1 p-1 bg-muted rounded-lg">
        {[
          { id: 'environments', label: '部署环境', icon: Server },
          { id: 'deployments', label: '部署历史', icon: GitBranch },
          { id: 'monitoring', label: '监控面板', icon: Activity },
          { id: 'alerts', label: '告警规则', icon: Bell },
          { id: 'dashboards', label: '监控仪表', icon: BarChart3 }
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
            placeholder="搜索环境、部署或版本..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {activeTab === 'environments' && (
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 bg-muted rounded-md text-sm"
          >
            <option value="all">所有平台</option>
            <option value="docker">Docker</option>
            <option value="kubernetes">Kubernetes</option>
            <option value="vm">VM</option>
            <option value="serverless">Serverless</option>
          </select>
        )}

        {activeTab === 'deployments' && (
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-muted rounded-md text-sm"
          >
            <option value="all">所有状态</option>
            <option value="success">成功</option>
            <option value="failed">失败</option>
            <option value="running">运行中</option>
            <option value="pending">等待中</option>
            <option value="rolled_back">已回滚</option>
          </select>
        )}
      </div>

      {/* 部署环境管理 */}
      {activeTab === 'environments' && (
        <div className="space-y-4">
          {/* 环境概览统计 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-background border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">总环境数</span>
                <Server className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-600">{environments.length}</p>
              <p className="text-xs text-muted-foreground">多平台部署</p>
            </div>

            <div className="p-4 bg-background border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">活跃环境</span>
                <CheckCircle className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600">{environments.filter(e => e.status === 'active').length}</p>
              <p className="text-xs text-muted-foreground">正常运行</p>
            </div>

            <div className="p-4 bg-background border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">总资源</span>
                <Cpu className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-purple-600">
                {formatNumber(environments.reduce((sum, env) => sum + env.resources.cpu.limit, 0))} cores
              </p>
              <p className="text-xs text-muted-foreground">CPU总容量</p>
            </div>

            <div className="p-4 bg-background border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">健康度</span>
                <Shield className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-orange-600">
                {environments.length > 0 ? (environments.reduce((sum, env) => sum + env.health.uptime, 0) / environments.length).toFixed(1) : 0}%
              </p>
              <p className="text-xs text-muted-foreground">平均可用性</p>
            </div>
          </div>

          {/* 环境列表 */}
          <div className="grid gap-4">
            {filteredEnvironments.map((environment) => (
              <motion.div
                key={environment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 bg-background border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedEnvironment?.id === environment.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedEnvironment(environment)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {/* 环境图标 */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-500/10">
                      {environment.platform === 'docker' && <Package className="w-5 h-5 text-blue-500" />}
                      {environment.platform === 'kubernetes' && <Layers className="w-5 h-5 text-blue-500" />}
                      {environment.platform === 'vm' && <Monitor className="w-5 h-5 text-blue-500" />}
                      {environment.platform === 'serverless' && <Cloud className="w-5 h-5 text-blue-500" />}
                    </div>

                    {/* 环境信息 */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-foreground">{environment.name}</h5>
                        {getStatusIcon(environment.status)}

                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          environment.type === 'production' ? 'bg-red-500/10 text-red-600' :
                          environment.type === 'staging' ? 'bg-yellow-500/10 text-yellow-600' :
                          'bg-blue-500/10 text-blue-600'
                        }`}>
                          {environment.type}
                        </span>

                        <span className="px-2 py-0.5 bg-gray-500/10 text-gray-600 text-xs rounded-full">
                          {environment.platform}
                        </span>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center space-x-1">
                          <Globe className="w-3 h-3" />
                          <span>{environment.region}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Monitor className="w-3 h-3" />
                          <span>{environment.endpoint}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <GitBranch className="w-3 h-3" />
                          <span>{environment.version}</span>
                        </div>

                        {environment.lastDeploy && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>最后部署: {environment.lastDeploy.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      {/* 健康状态 */}
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium">健康度:</span>
                        {getStatusIcon(environment.health.overall)}
                        <span className="text-sm">{environment.health.uptime}% 可用性</span>
                        <span className="text-xs text-muted-foreground">
                          {environment.health.checks.filter(c => c.status === 'pass').length}/{environment.health.checks.length} 检查通过
                        </span>
                      </div>

                      {/* 资源使用率 */}
                      <div className="grid grid-cols-4 gap-3 text-xs">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-muted-foreground">CPU</span>
                            <span>{environment.resources.cpu.current}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-blue-500 h-1.5 rounded-full"
                              style={{ width: `${environment.resources.cpu.current}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-muted-foreground">内存</span>
                            <span>{(environment.resources.memory.current / environment.resources.memory.limit * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-green-500 h-1.5 rounded-full"
                              style={{ width: `${environment.resources.memory.current / environment.resources.memory.limit * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-muted-foreground">存储</span>
                            <span>{(environment.resources.storage.current / environment.resources.storage.limit * 100).toFixed(1)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-orange-500 h-1.5 rounded-full"
                              style={{ width: `${environment.resources.storage.current / environment.resources.storage.limit * 100}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-muted-foreground">网络</span>
                            <span>{environment.resources.network.inbound} Mb/s</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div
                              className="bg-purple-500 h-1.5 rounded-full"
                              style={{ width: `${Math.min(environment.resources.network.inbound / 5, 100)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deployApplication(environment.id)
                      }}
                      disabled={isDeploying || environment.status !== 'active'}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors disabled:opacity-50"
                      title="部署应用"
                    >
                      <Upload className="w-4 h-4 text-green-500" />
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpanded(environment.id)
                      }}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    >
                      {expandedItems.has(environment.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // 编辑环境
                      }}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      title="编辑环境"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 展开的详细信息 */}
                {expandedItems.has(environment.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-border space-y-4"
                  >
                    {/* 扩展配置 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="text-sm font-medium mb-2">扩展配置</h6>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">副本数:</span>
                            <span>{environment.scaling.currentReplicas} / {environment.scaling.minReplicas}-{environment.scaling.maxReplicas}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">自动扩缩:</span>
                            <span className={environment.scaling.autoScaling ? 'text-green-600' : 'text-gray-600'}>
                              {environment.scaling.autoScaling ? '启用' : '禁用'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">扩缩策略:</span>
                            <span>{environment.scaling.strategy}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h6 className="text-sm font-medium mb-2">监控配置</h6>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">监控状态:</span>
                            <span className={environment.monitoring.enabled ? 'text-green-600' : 'text-gray-600'}>
                              {environment.monitoring.enabled ? '启用' : '禁用'}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">指标数量:</span>
                            <span>{environment.monitoring.metrics.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">数据保留:</span>
                            <span>{environment.monitoring.retention} 天</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 健康检查详情 */}
                    <div>
                      <h6 className="text-sm font-medium mb-2">健康检查详情</h6>
                      <div className="space-y-2">
                        {environment.health.checks.map((check, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(check.status)}
                              <span className="text-sm font-medium">{check.name}</span>
                              <span className="text-xs text-muted-foreground">({check.responseTime}ms)</span>
                            </div>
                            <span className="text-xs text-muted-foreground">{check.message}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 部署历史 */}
      {activeTab === 'deployments' && (
        <div className="space-y-4">
          <div className="grid gap-3">
            {filteredDeployments.map((deployment) => {
              const environment = environments.find(e => e.id === deployment.environmentId)
              return (
                <motion.div
                  key={deployment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 bg-background border rounded-lg ${getStatusColor(deployment.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {/* 部署状态图标 */}
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50">
                        {getStatusIcon(deployment.status)}
                      </div>

                      {/* 部署信息 */}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h5 className="font-medium text-foreground">
                            {environment?.name} - {deployment.version}
                          </h5>
                          <span className="text-xs text-muted-foreground">#{deployment.id}</span>

                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            deployment.trigger === 'auto' ? 'bg-blue-500/10 text-blue-600' :
                            deployment.trigger === 'manual' ? 'bg-green-500/10 text-green-600' :
                            'bg-gray-500/10 text-gray-600'
                          }`}>
                            {deployment.trigger}
                          </span>
                        </div>

                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3" />
                            <span>{deployment.author}</span>
                          </div>

                          {deployment.commit && (
                            <div className="flex items-center space-x-1">
                              <GitBranch className="w-3 h-3" />
                              <span className="font-mono">{deployment.commit.substring(0, 7)}</span>
                            </div>
                          )}

                          {deployment.branch && (
                            <div className="flex items-center space-x-1">
                              <GitBranch className="w-3 h-3" />
                              <span>{deployment.branch}</span>
                            </div>
                          )}

                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>开始: {deployment.startTime.toLocaleString()}</span>
                          </div>

                          {deployment.duration && (
                            <div className="flex items-center space-x-1">
                              <Timer className="w-3 h-3" />
                              <span>耗时: {deployment.duration}s</span>
                            </div>
                          )}
                        </div>

                        {/* 变更信息 */}
                        <div className="mb-2">
                          <div className="flex flex-wrap gap-1">
                            {deployment.changes.map((change, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 text-xs rounded ${
                                  change.type === 'update' ? 'bg-blue-500/10 text-blue-600' :
                                  change.type === 'create' ? 'bg-green-500/10 text-green-600' :
                                  change.type === 'delete' ? 'bg-red-500/10 text-red-600' :
                                  'bg-gray-500/10 text-gray-600'
                                }`}
                              >
                                {change.type}: {change.resource}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* 元数据 */}
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Package className="w-3 h-3" />
                            <span>{deployment.metadata.image}</span>
                          </div>

                          <div className="flex items-center space-x-1">
                            <Layers className="w-3 h-3" />
                            <span>{deployment.metadata.replicas} 副本</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 展开按钮 */}
                    <button
                      onClick={() => toggleExpanded(deployment.id)}
                      className="p-1.5 hover:bg-white/50 rounded-md transition-colors"
                    >
                      {expandedItems.has(deployment.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  {/* 展开的详细信息 */}
                  {expandedItems.has(deployment.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="mt-4 pt-4 border-t border-current/20"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-medium mb-1">资源配置</p>
                          <div className="space-y-1">
                            {Object.entries(deployment.metadata.resources).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-muted-foreground capitalize">{key}:</span>
                                <span className="font-mono">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <p className="font-medium mb-1">部署注释</p>
                          <div className="space-y-1">
                            {Object.entries(deployment.metadata.annotations).map(([key, value]) => (
                              <div key={key} className="flex justify-between">
                                <span className="text-muted-foreground capitalize">{key}:</span>
                                <span className="text-xs">{value}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      )}

      {/* 监控面板 */}
      {activeTab === 'monitoring' && (
        <div className="space-y-4">
          {/* 监控概览 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-background border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">CPU使用率</span>
                <Cpu className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-blue-600">42.3%</p>
              <p className="text-xs text-muted-foreground">平均 45.2%</p>
            </div>

            <div className="p-4 bg-background border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">内存使用率</span>
                <Database className="w-4 h-4 text-green-500" />
              </div>
              <p className="text-2xl font-bold text-green-600">68.7%</p>
              <p className="text-xs text-muted-foreground">平均 72.1%</p>
            </div>

            <div className="p-4 bg-background border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text font-medium">网络流量</span>
                <Wifi className="w-4 h-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold text-purple-600">2.3GB/s</p>
              <p className="text-xs text-muted-foreground">平均 2.8GB/s</p>
            </div>

            <div className="p-4 bg-background border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">响应时间</span>
                <Activity className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-orange-600">45ms</p>
              <p className="text-xs text-muted-foreground">P95: 120ms</p>
            </div>
          </div>

          {/* 监控图表 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="p-4 bg-background border rounded-lg">
              <h5 className="font-medium mb-3">CPU使用趋势</h5>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <LineChart className="w-12 h-12" />
                <span className="ml-2">CPU使用趋势图表</span>
              </div>
            </div>

            <div className="p-4 bg-background border rounded-lg">
              <h5 className="font-medium mb-3">响应时间分布</h5>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <PieChart className="w-12 h-12" />
                <span className="ml-2">响应时间分布图</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 告警规则 */}
      {activeTab === 'alerts' && (
        <div className="space-y-4">
          <div className="p-6 bg-background border rounded-lg text-center">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">告警规则配置</h4>
            <p className="text-sm text-muted-foreground mb-4">
              配置监控告警规则，确保系统异常时及时通知
            </p>
            <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
              创建告警规则
            </button>
          </div>
        </div>
      )}

      {/* 监控仪表 */}
      {activeTab === 'dashboards' && (
        <div className="space-y-4">
          <div className="p-6 bg-background border rounded-lg text-center">
            <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">监控仪表板</h4>
            <p className="text-sm text-muted-foreground mb-4">
              自定义监控仪表板，实时查看系统运行状态
            </p>
            <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
              创建仪表板
            </button>
          </div>
        </div>
      )}
    </div>
  )
}