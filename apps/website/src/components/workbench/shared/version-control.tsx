'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { cn } from '@/utils'
import {
  GitBranch,
  GitMerge,
  GitCommit,
  History,
  ArrowLeft,
  ArrowRight,
  GitCompare,
  Save,
  Clock,
  User,
  MessageSquare,
  Hash,
  RefreshCw,
  Download,
  Upload,
  Eye,
  CheckCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Copy,
  Trash2,
  Tag,
  Archive,
  RotateCcw,
  Zap
} from 'lucide-react'

// 版本控制相关类型定义
interface VersionCommit {
  id: string
  message: string
  author: string
  timestamp: string
  config: any
  changes: ConfigChange[]
  branch: string
  tags: string[]
  parentId?: string
  isAutoSave: boolean
}

interface ConfigChange {
  path: string
  type: 'create' | 'update' | 'delete'
  oldValue?: any
  newValue?: any
  description: string
}

interface VersionBranch {
  name: string
  headCommitId: string
  isMain: boolean
  isProtected: boolean
  createdAt: string
  lastModified: string
}

interface VersionTag {
  name: string
  commitId: string
  message: string
  createdAt: string
  author: string
}

interface VersionControlProps {
  currentConfig: any
  onRestoreVersion?: (commitId: string) => void
  onCompareVersions?: (fromCommitId: string, toCommitId: string) => void
  className?: string
}

export function VersionControl({
  currentConfig,
  onRestoreVersion,
  onCompareVersions,
  className
}: VersionControlProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'branches' | 'compare' | 'tags'>('history')
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null)
  const [compareCommits, setCompareCommits] = useState<{ from: string; to: string }>({ from: '', to: '' })
  const [expandedCommits, setExpandedCommits] = useState<Set<string>>(new Set())
  const [showCreateCommit, setShowCreateCommit] = useState(false)
  const [commitMessage, setCommitMessage] = useState('')
  const [isCreatingCommit, setIsCreatingCommit] = useState(false)

  // 模拟版本数据
  const commits: VersionCommit[] = useMemo(() => [
    {
      id: 'commit-001',
      message: '初始化解决方案配置',
      author: 'Claude AI',
      timestamp: '2025-10-29 10:00:00',
      config: {},
      changes: [
        {
          path: 'solution.config',
          type: 'create',
          newValue: { theme: 'light', layout: 'sidebar' },
          description: '创建初始解决方案配置'
        }
      ],
      branch: 'main',
      tags: ['v1.0.0'],
      isAutoSave: false
    },
    {
      id: 'commit-002',
      message: '添加设计令牌配置',
      author: '开发团队',
      timestamp: '2025-10-29 10:15:00',
      config: { designTokens: { colorScale: 'blue' } },
      changes: [
        {
          path: 'designTokens.colorScale',
          type: 'update',
          oldValue: 'default',
          newValue: 'blue',
          description: '更新颜色缩放配置'
        }
      ],
      branch: 'main',
      tags: [],
      parentId: 'commit-001',
      isAutoSave: false
    },
    {
      id: 'commit-003',
      message: '自动保存：组件配置更新',
      author: 'System',
      timestamp: '2025-10-29 10:30:00',
      config: { components: ['Button', 'Card'] },
      changes: [
        {
          path: 'components',
          type: 'update',
          oldValue: ['Button'],
          newValue: ['Button', 'Card'],
          description: '添加Card组件配置'
        }
      ],
      branch: 'main',
      tags: [],
      parentId: 'commit-002',
      isAutoSave: true
    },
    {
      id: 'commit-004',
      message: '优化性能配置',
      author: 'Claude AI',
      timestamp: '2025-10-29 10:45:00',
      config: { features: { responsive: true, animations: true } },
      changes: [
        {
          path: 'features.responsive',
          type: 'update',
          oldValue: false,
          newValue: true,
          description: '启用响应式设计'
        },
        {
          path: 'features.animations',
          type: 'create',
          newValue: true,
          description: '添加动画配置'
        }
      ],
      branch: 'main',
      tags: ['v1.1.0'],
      parentId: 'commit-003',
      isAutoSave: false
    }
  ], [])

  const branches: VersionBranch[] = useMemo(() => [
    {
      name: 'main',
      headCommitId: 'commit-004',
      isMain: true,
      isProtected: true,
      createdAt: '2025-10-29 09:00:00',
      lastModified: '2025-10-29 10:45:00'
    },
    {
      name: 'feature/ui-redesign',
      headCommitId: 'commit-003',
      isMain: false,
      isProtected: false,
      createdAt: '2025-10-29 10:20:00',
      lastModified: '2025-10-29 10:30:00'
    },
    {
      name: 'hotfix/performance-fix',
      headCommitId: 'commit-002',
      isMain: false,
      isProtected: false,
      createdAt: '2025-10-29 10:40:00',
      lastModified: '2025-10-29 10:42:00'
    }
  ], [])

  const tags: VersionTag[] = useMemo(() => [
    {
      name: 'v1.0.0',
      commitId: 'commit-001',
      message: '初始版本发布',
      createdAt: '2025-10-29 10:00:00',
      author: 'Claude AI'
    },
    {
      name: 'v1.1.0',
      commitId: 'commit-004',
      message: '添加设计令牌和性能优化',
      createdAt: '2025-10-29 10:45:00',
      author: 'Claude AI'
    }
  ], [])

  // 创建新提交
  const handleCreateCommit = useCallback(async () => {
    if (!commitMessage.trim()) return

    setIsCreatingCommit(true)

    // 模拟创建提交
    setTimeout(() => {
      setShowCreateCommit(false)
      setCommitMessage('')
      setIsCreatingCommit(false)
      console.log('创建新提交:', commitMessage)
    }, 1000)
  }, [commitMessage])

  // 切换提交展开状态
  const toggleCommitExpansion = useCallback((commitId: string) => {
    setExpandedCommits(prev => {
      const newSet = new Set(prev)
      if (newSet.has(commitId)) {
        newSet.delete(commitId)
      } else {
        newSet.add(commitId)
      }
      return newSet
    })
  }, [])

  // 恢复到指定版本
  const handleRestoreVersion = useCallback((commitId: string) => {
    onRestoreVersion?.(commitId)
    console.log('恢复到版本:', commitId)
  }, [onRestoreVersion])

  // 比较版本
  const handleCompareVersions = useCallback(() => {
    if (compareCommits.from && compareCommits.to) {
      onCompareVersions?.(compareCommits.from, compareCommits.to)
      console.log('比较版本:', compareCommits)
    }
  }, [compareCommits, onCompareVersions])

  // 获取变更类型样式
  const getChangeTypeStyles = (type: ConfigChange['type']) => {
    switch (type) {
      case 'create': return 'text-green-600 bg-green-50 border-green-200'
      case 'update': return 'text-blue-600 bg-blue-50 border-blue-200'
      case 'delete': return 'text-red-600 bg-red-50 border-red-200'
    }
  }

  // 获取变更类型图标
  const getChangeTypeIcon = (type: ConfigChange['type']) => {
    switch (type) {
      case 'create': return <CheckCircle className="w-4 h-4" />
      case 'update': return <RefreshCw className="w-4 h-4" />
      case 'delete': return <Trash2 className="w-4 h-4" />
    }
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* 版本控制头部 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl">
              <GitBranch className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                版本管理
                <Zap className="w-5 h-5 text-yellow-500" />
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Git风格的配置版本控制和历史追踪
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {commits.length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                提交记录
              </div>
            </div>
            <Button
              onClick={() => setShowCreateCommit(true)}
              className="flex items-center gap-2"
            >
              <GitCommit className="w-4 h-4" />
              创建提交
            </Button>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: '总提交数', value: commits.length, icon: GitCommit, color: 'blue' },
            { label: '分支数量', value: branches.length, icon: GitBranch, color: 'green' },
            { label: '版本标签', value: tags.length, icon: Tag, color: 'purple' },
            { label: '自动保存', value: commits.filter(c => c.isAutoSave).length, icon: Archive, color: 'orange' }
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <stat.icon className={cn('w-5 h-5 mx-auto mb-1 text-', stat.color, '-500')} />
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 标签页导航 */}
        <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-xl p-1">
          {[
            { id: 'history', label: '提交历史', icon: History },
            { id: 'branches', label: '分支管理', icon: GitBranch },
            { id: 'compare', label: '版本对比', icon: GitCompare },
            { id: 'tags', label: '版本标签', icon: Tag }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </Card>

      {/* 提交历史 */}
      {activeTab === 'history' && (
        <div className="space-y-4">
          {commits.map((commit, index) => (
            <motion.div
              key={commit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className={cn(
                'p-6 transition-all duration-200',
                selectedCommit === commit.id && 'ring-2 ring-blue-500'
              )}>
                {/* 提交头部 */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center justify-center w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                      <GitCommit className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-gray-900 dark:text-white">
                          {commit.message}
                        </h4>
                        {commit.isAutoSave && (
                          <span className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded-full">
                            自动保存
                          </span>
                        )}
                        {commit.tags.length > 0 && (
                          <div className="flex items-center gap-1">
                            {commit.tags.map(tag => (
                              <span key={tag} className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {commit.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {commit.timestamp}
                        </div>
                        <div className="flex items-center gap-1">
                          <GitBranch className="w-4 h-4" />
                          {commit.branch}
                        </div>
                        <div className="flex items-center gap-1">
                          <Hash className="w-4 h-4" />
                          {commit.id}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleCommitExpansion(commit.id)}
                      className="p-2"
                    >
                      {expandedCommits.has(commit.id) ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleRestoreVersion(commit.id)}
                      className="flex items-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      恢复
                    </Button>
                  </div>
                </div>

                {/* 展开的变更详情 */}
                {expandedCommits.has(commit.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-t pt-4 mt-4"
                  >
                    <h5 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                      <GitCompare className="w-4 h-4 text-blue-500" />
                      变更详情 ({commit.changes.length} 项)
                    </h5>
                    <div className="space-y-2">
                      {commit.changes.map((change, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                          <div className={cn('flex items-center gap-2 px-2 py-1 rounded text-xs border', getChangeTypeStyles(change.type))}>
                            {getChangeTypeIcon(change.type)}
                            {change.type === 'create' && '创建'}
                            {change.type === 'update' && '更新'}
                            {change.type === 'delete' && '删除'}
                          </div>
                          <div className="flex-1">
                            <div className="font-mono text-sm text-gray-700 dark:text-gray-300">
                              {change.path}
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400">
                              {change.description}
                            </div>
                          </div>
                          {change.oldValue !== undefined && (
                            <div className="text-xs text-red-600 dark:text-red-400">
                              {JSON.stringify(change.oldValue)}
                            </div>
                          )}
                          {change.newValue !== undefined && (
                            <div className="text-xs text-green-600 dark:text-green-400">
                              {JSON.stringify(change.newValue)}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* 分支管理 */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          {branches.map((branch, index) => (
            <motion.div
              key={branch.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-green-500" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {branch.name}
                      </h4>
                      {branch.isMain && (
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                          主分支
                        </span>
                      )}
                      {branch.isProtected && (
                        <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full">
                          受保护
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div>创建时间: {branch.createdAt}</div>
                      <div>最后修改: {branch.lastModified}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      查看
                    </Button>
                    <Button size="sm" variant="outline">
                      <GitMerge className="w-4 h-4 mr-1" />
                      合并
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* 版本对比 */}
      {activeTab === 'compare' && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-blue-500" />
            版本对比
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                源版本
              </label>
              <select
                value={compareCommits.from}
                onChange={(e) => setCompareCommits(prev => ({ ...prev, from: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">选择源版本</option>
                {commits.map(commit => (
                  <option key={commit.id} value={commit.id}>
                    {commit.id} - {commit.message}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                目标版本
              </label>
              <select
                value={compareCommits.to}
                onChange={(e) => setCompareCommits(prev => ({ ...prev, to: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">选择目标版本</option>
                {commits.map(commit => (
                  <option key={commit.id} value={commit.id}>
                    {commit.id} - {commit.message}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <Button
            onClick={handleCompareVersions}
            disabled={!compareCommits.from || !compareCommits.to}
            className="w-full"
          >
            <GitCompare className="w-4 h-4 mr-2" />
            开始对比
          </Button>
        </Card>
      )}

      {/* 版本标签 */}
      {activeTab === 'tags' && (
        <div className="space-y-4">
          {tags.map((tag, index) => (
            <motion.div
              key={tag.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-purple-500" />
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {tag.name}
                      </h4>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <div>{tag.message}</div>
                      <div>提交: {tag.commitId}</div>
                      <div>作者: {tag.author}</div>
                      <div>时间: {tag.createdAt}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-1" />
                      下载
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-1" />
                      查看
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* 创建提交对话框 */}
      {showCreateCommit && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowCreateCommit(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <GitCommit className="w-5 h-5 text-blue-500" />
              创建新提交
            </h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                提交消息
              </label>
              <Input
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                placeholder="描述本次变更..."
                className="w-full"
              />
            </div>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleCreateCommit}
                disabled={!commitMessage.trim() || isCreatingCommit}
                className="flex-1"
              >
                {isCreatingCommit ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <GitCommit className="w-4 h-4 mr-2" />
                )}
                创建提交
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateCommit(false)}
                disabled={isCreatingCommit}
              >
                取消
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}