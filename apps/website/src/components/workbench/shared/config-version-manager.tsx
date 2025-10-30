'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import {
  ChevronLeft,
  ChevronRight,
  GitBranch,
  GitCommit,
  GitMerge,
  Calendar,
  User,
  MessageSquare,
  FileJson,
  Download,
  Upload,
  RotateCcw,
  Eye,
  Copy,
  Trash2,
  Tag,
  Star,
  Clock,
  BarChart3,
  Settings,
  Shield
} from 'lucide-react'

// 配置版本接口
interface ConfigVersion {
  id: string
  version: string
  name: string
  description: string
  config: any
  timestamp: Date
  author: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  changes: {
    added: string[]
    modified: string[]
    removed: string[]
  }
  metadata: {
    tags: string[]
    category: string
    environment: 'development' | 'staging' | 'production'
    performance: {
      score: number
      bundleSize: number
      loadTime: number
    }
  }
  stats: {
    views: number
    downloads: number
    forks: number
    stars: number
  }
  isCurrent: boolean
  isStable: boolean
  parentVersion?: string
  branchName: string
}

// 分支接口
interface Branch {
  id: string
  name: string
  description: string
  isDefault: boolean
  isProtected: boolean
  lastCommit: string
  commitCount: number
  createdBy: string
  createdAt: Date
  mergedInto?: string
}

// 版本比较结果接口
interface VersionDiff {
  versionA: ConfigVersion
  versionB: ConfigVersion
  changes: {
    structural: {
      added: string[]
      removed: string[]
      modified: { path: string; old: any; new: any }[]
    }
    functional: {
      newFeatures: string[]
      removedFeatures: string[]
      improvedFeatures: string[]
    }
    performance: {
      improvement: number
      regression: number
    }
  }
  compatibility: 'compatible' | 'breaking' | 'minor-breaking'
  migrationComplexity: 'simple' | 'moderate' | 'complex'
}

interface ConfigVersionManagerProps {
  config: any
  onConfigUpdate?: (config: any) => void
  onVersionChange?: (version: ConfigVersion) => void
  className?: string
}

export function ConfigVersionManager({
  config,
  onConfigUpdate,
  onVersionChange,
  className
}: ConfigVersionManagerProps) {
  const [selectedVersion, setSelectedVersion] = useState<string>('')
  const [selectedBranch, setSelectedBranch] = useState<string>('main')
  const [viewMode, setViewMode] = useState<'list' | 'timeline' | 'comparison'>('timeline')
  const [compareMode, setCompareMode] = useState<boolean>(false)
  const [compareVersions, setCompareVersions] = useState<{ versionA: string; versionB: string }>({
    versionA: '',
    versionB: ''
  })

  // 模拟版本数据
  const versions: ConfigVersion[] = useMemo(() => [
    {
      id: 'v1',
      version: '1.0.0',
      name: '初始版本',
      description: '第一个稳定版本，包含基础功能',
      config,
      timestamp: new Date('2024-01-15T10:00:00Z'),
      author: {
        id: 'user1',
        name: '张三',
        email: 'zhangsan@example.com'
      },
      changes: {
        added: ['基础配置', '主题系统', '组件库'],
        modified: [],
        removed: []
      },
      metadata: {
        tags: ['stable', 'initial', 'production-ready'],
        category: 'stable',
        environment: 'production',
        performance: {
          score: 95,
          bundleSize: '2.1MB',
          loadTime: '1.2s'
        }
      },
      stats: {
        views: 1250,
        downloads: 180,
        forks: 12,
        stars: 45
      },
      isCurrent: false,
      isStable: true,
      branchName: 'main'
    },
    {
      id: 'v2',
      version: '1.1.0',
      name: '功能增强版本',
      description: '新增团队协作和高级配置功能',
      config,
      timestamp: new Date('2024-01-20T14:30:00Z'),
      author: {
        id: 'user2',
        name: '李四',
        email: 'lisi@example.com'
      },
      changes: {
        added: ['团队协作', '配置模板', '智能优化'],
        modified: ['主题系统', '性能优化'],
        removed: []
      },
      metadata: {
        tags: ['feature', 'collaboration', 'enhanced'],
        category: 'feature',
        environment: 'staging',
        performance: {
          score: 92,
          bundleSize: '2.3MB',
          loadTime: '1.4s'
        }
      },
      stats: {
        views: 890,
        downloads: 95,
        forks: 8,
        stars: 28
      },
      isCurrent: true,
      isStable: true,
      parentVersion: 'v1',
      branchName: 'main'
    },
    {
      id: 'v3',
      version: '1.2.0-beta',
      name: '测试版本',
      description: '实验性功能，包含AI辅助优化',
      config,
      timestamp: new Date('2024-01-25T09:15:00Z'),
      author: {
        id: 'user3',
        name: '王五',
        email: 'wangwu@example.com'
      },
      changes: {
        added: ['AI优化建议', '代码质量分析'],
        modified: ['配置验证', '错误处理'],
        removed: ['旧版兼容']
      },
      metadata: {
        tags: ['beta', 'ai', 'experimental'],
        category: 'experimental',
        environment: 'development',
        performance: {
          score: 88,
          bundleSize: '2.5MB',
          loadTime: '1.6s'
        }
      },
      stats: {
        views: 320,
        downloads: 15,
        forks: 2,
        stars: 12
      },
      isCurrent: false,
      isStable: false,
      parentVersion: 'v2',
      branchName: 'feature/ai-optimization'
    }
  ], [config])

  // 分支数据
  const branches: Branch[] = useMemo(() => [
    {
      id: 'main',
      name: 'main',
      description: '主分支，稳定版本',
      isDefault: true,
      isProtected: true,
      lastCommit: 'v2',
      commitCount: 25,
      createdBy: '张三',
      createdAt: new Date('2024-01-15T10:00:00Z')
    },
    {
      id: 'develop',
      name: 'develop',
      description: '开发分支',
      isDefault: false,
      isProtected: false,
      lastCommit: 'v3',
      commitCount: 12,
      createdBy: '李四',
      createdAt: new Date('2024-01-18T16:00:00Z')
    },
    {
      id: 'feature/ai-optimization',
      name: 'feature/ai-optimization',
      description: 'AI优化功能分支',
      isDefault: false,
      isProtected: false,
      lastCommit: 'v3',
      commitCount: 8,
      createdBy: '王五',
      createdAt: new Date('2024-01-22T11:00:00Z')
    }
  ], [])

  // 版本比较函数
  const versionComparison = useMemo(() => {
    if (!compareVersions.versionA || !compareVersions.versionB) return null

    const versionA = versions.find(v => v.id === compareVersions.versionA)
    const versionB = versions.find(v => v.id === compareVersions.versionB)

    if (!versionA || !versionB) return null

    return {
      versionA,
      versionB,
      changes: {
        structural: {
          added: ['AI组件', '智能分析'],
          removed: ['旧版配置'],
          modified: [
            { path: 'theme.colors', old: 'old-colors', new: 'new-colors' },
            { path: 'components.layout', old: 'old-layout', new: 'new-layout' }
          ]
        },
        functional: {
          newFeatures: ['AI建议', '智能优化'],
          removedFeatures: ['旧版兼容'],
          improvedFeatures: ['性能分析', '配置验证']
        },
        performance: {
          improvement: 15,
          regression: -5
        }
      },
      compatibility: 'compatible' as const,
      migrationComplexity: 'simple' as const
    }
  }, [compareVersions, versions])

  const handleCreateVersion = () => {
    // 创建新版本逻辑
    console.log('Creating new version...')
  }

  const handleRestoreVersion = (version: ConfigVersion) => {
    onConfigUpdate?.(version.config)
    onVersionChange?.(version)
  }

  const handleExportVersion = (version: ConfigVersion) => {
    const dataStr = JSON.stringify(version.config, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)

    const exportFileDefaultName = `config-${version.version}-${Date.now()}.json`

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  const handleDuplicateVersion = (version: ConfigVersion) => {
    // 复制版本逻辑
    console.log('Duplicating version:', version.id)
  }

  const handleDeleteVersion = (versionId: string) => {
    // 删除版本逻辑
    console.log('Deleting version:', versionId)
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
              配置版本管理
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              管理配置版本历史，支持分支、合并和回滚
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('timeline')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'timeline'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Clock className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setCompareMode(!compareMode)
                  if (!compareMode) {
                    setCompareVersions({ versionA: '', versionB: '' })
                  }
                }}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  compareMode
                    ? 'bg-white dark:bg-gray-600 text-blue-600 dark:text-blue-400 shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <GitMerge className="w-4 h-4" />
              </button>
            </div>

            <Button onClick={handleCreateVersion} className="flex items-center gap-2">
              <GitCommit className="w-4 h-4" />
              创建版本
            </Button>
          </div>
        </div>

        {/* 分支选择 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <GitBranch className="w-4 h-4" />
            <span>分支:</span>
          </div>
          <div className="flex gap-2">
            {branches.map(branch => (
              <button
                key={branch.id}
                onClick={() => setSelectedBranch(branch.id)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  selectedBranch === branch.id
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                } ${branch.isProtected ? 'ring-2 ring-orange-200 dark:ring-orange-800' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span>{branch.name}</span>
                  {branch.isProtected && <Shield className="w-3 h-3 text-orange-500" />}
                  {branch.isDefault && <Tag className="w-3 h-3 text-green-500" />}
                </div>
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 版本比较模式 */}
      <AnimatePresence>
        {compareMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              版本比较
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                  版本 A
                </label>
                <select
                  value={compareVersions.versionA}
                  onChange={(e) => setCompareVersions(prev => ({ ...prev, versionA: e.target.value }))}
                  className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-100"
                >
                  <option value="">选择版本...</option>
                  {versions.map(version => (
                    <option key={version.id} value={version.id}>
                      {version.version} - {version.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-700 dark:text-blue-300 mb-2">
                  版本 B
                </label>
                <select
                  value={compareVersions.versionB}
                  onChange={(e) => setCompareVersions(prev => ({ ...prev, versionB: e.target.value }))}
                  className="w-full px-3 py-2 border border-blue-300 dark:border-blue-700 rounded-lg bg-white dark:bg-gray-800 text-blue-900 dark:text-blue-100"
                >
                  <option value="">选择版本...</option>
                  {versions.map(version => (
                    <option key={version.id} value={version.id}>
                      {version.version} - {version.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {versionComparison && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700"
              >
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="font-semibold text-blue-900 dark:text-blue-100">
                      {versionComparison.versionA.version}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {versionComparison.versionA.name}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-blue-900 dark:text-blue-100">
                      {versionComparison.versionB.version}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {versionComparison.versionB.name}
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>新增: {versionComparison.changes.structural.added.length} 项</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>修改: {versionComparison.changes.structural.modified.length} 项</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>删除: {versionComparison.changes.structural.removed.length} 项</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 版本列表/时间线 */}
      <div className="space-y-4">
        {versions.map((version, index) => (
          <motion.div
            key={version.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`bg-white dark:bg-gray-800 rounded-xl border ${
              version.isCurrent
                ? 'border-blue-200 dark:border-blue-700 ring-2 ring-blue-100 dark:ring-blue-800/30'
                : 'border-gray-200 dark:border-gray-700'
            } p-6`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {version.version}
                  </h3>
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full font-medium">
                    {version.branchName}
                  </span>
                  {version.isCurrent && (
                    <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full font-medium">
                      当前版本
                    </span>
                  )}
                  {version.isStable && (
                    <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full font-medium">
                      稳定版本
                    </span>
                  )}
                  <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                    version.metadata.environment === 'production'
                      ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                      : version.metadata.environment === 'staging'
                      ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}>
                    {version.metadata.environment}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {version.description}
                </p>

                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                  <div className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    <span>{version.author.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{version.timestamp.toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>{version.changes.added.length + version.changes.modified.length} 项变更</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    <span>{version.stats.stars}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">性能评分:</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${
                      version.metadata.performance.score >= 90 ? 'bg-green-500' :
                      version.metadata.performance.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {version.metadata.performance.score}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">|</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    包大小: {version.metadata.performance.bundleSize}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">|</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    加载时间: {version.metadata.performance.loadTime}
                  </span>
                </div>

                {version.metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {version.metadata.tags.map(tag => (
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExportVersion(version)}
                  className="flex items-center gap-1"
                >
                  <Download className="w-4 h-4" />
                  导出
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDuplicateVersion(version)}
                  className="flex items-center gap-1"
                >
                  <Copy className="w-4 h-4" />
                  复制
                </Button>
                {!version.isCurrent && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRestoreVersion(version)}
                    className="flex items-center gap-1"
                  >
                    <RotateCcw className="w-4 h-4" />
                    恢复
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <Eye className="w-4 h-4" />
                  查看
                </Button>
                {!version.isStable && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteVersion(version.id)}
                    className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}