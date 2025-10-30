'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  GitBranch,
  GitMerge,
  GitCommit,
  GitPullRequest,
  Clock,
  User,
  MessageSquare,
  RotateCcw,
  Eye,
  Tag,
  Hash,
  ArrowLeft,
  ArrowRight,
  GitCompare,
  Save,
  RefreshCw,
  History,
  Zap,
  Shield,
  Database
} from 'lucide-react'

// 版本管理相关接口定义
interface VersionCommit {
  id: string
  hash: string
  author: string
  email: string
  timestamp: Date
  message: string
  description?: string
  branch: string
  tags: string[]
  parents: string[]
  changes: VersionChange[]
  metadata: {
    linesAdded: number
    linesRemoved: number
    filesChanged: number
    componentsAdded: string[]
    componentsRemoved: string[]
    componentsModified: string[]
  }
}

interface VersionBranch {
  name: string
  displayName: string
  isDefault: boolean
  isProtected: boolean
  lastCommit: string
  commitsAhead: number
  commitsBehind: number
  createdAt: Date
  createdBy: string
  description?: string
}

interface VersionTag {
  name: string
  commit: string
  author: string
  timestamp: Date
  message?: string
  isStable: boolean
  version?: string
}

interface VersionChange {
  type: 'component' | 'configuration' | 'property' | 'deletion' | 'addition'
  path: string
  oldValue?: any
  newValue?: any
  description: string
}

interface VersionDiff {
  fromCommit: string
  toCommit: string
  changes: VersionChange[]
  statistics: {
    linesAdded: number
    linesRemoved: number
    filesChanged: number
    componentsChanged: number
  }
  summary: string
}

export function VersionManagement({
  config,
  onConfigUpdate,
  className
}: {
  config: any
  onConfigUpdate: (config: any) => void
  className?: string
}) {
  // 状态管理
  const [activeTab, setActiveTab] = useState<'commits' | 'branches' | 'tags' | 'compare'>('commits')
  const [commits, setCommits] = useState<VersionCommit[]>([])
  const [branches, setBranches] = useState<VersionBranch[]>([])
  const [tags, setTags] = useState<VersionTag[]>([])
  const [selectedCommit, setSelectedCommit] = useState<VersionCommit | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<string>('main')
  const [selectedTag, setSelectedTag] = useState<VersionTag | null>(null)
  const [currentDiff, setCurrentDiff] = useState<VersionDiff | null>(null)
  const [compareFromCommit, setCompareFromCommit] = useState<string>('')
  const [compareToCommit, setCompareToCommit] = useState<string>('')
  const [isCreatingBranch, setIsCreatingBranch] = useState(false)
  const [isCreatingTag, setIsCreatingTag] = useState(false)
  const [isCommitting, setIsCommitting] = useState(false)
  const [newBranchName, setNewBranchName] = useState('')
  const [newTagName, setNewTagName] = useState('')
  const [commitMessage, setCommitMessage] = useState('')
  const [commitDescription, setCommitDescription] = useState('')
  const [isAutoBackupEnabled, setIsAutoBackupEnabled] = useState(true)
  const [backupInterval, setBackupInterval] = useState(300) // 5分钟

  // 初始化版本管理数据
  useEffect(() => {
    initializeVersionData()
  }, [])

  const initializeVersionData = () => {
    // 模拟初始化版本数据
    const mockCommits: VersionCommit[] = [
      {
        id: '1',
        hash: 'a1b2c3d4',
        author: '张三',
        email: 'zhang@example.com',
        timestamp: new Date(Date.now() - 3600000),
        message: 'feat: 添加按钮组件',
        description: '新增了主要的按钮组件，支持多种变体和尺寸',
        branch: 'main',
        tags: ['v1.0.0'],
        parents: ['0'],
        changes: [
          {
            type: 'addition',
            path: 'components/Button',
            newValue: { variant: 'primary', size: 'md' },
            description: '添加按钮组件'
          }
        ],
        metadata: {
          linesAdded: 120,
          linesRemoved: 0,
          filesChanged: 3,
          componentsAdded: ['Button'],
          componentsRemoved: [],
          componentsModified: []
        }
      },
      {
        id: '2',
        hash: 'e5f6g7h8',
        author: '李四',
        email: 'li@example.com',
        timestamp: new Date(Date.now() - 1800000),
        message: 'fix: 修复按钮组件的点击事件处理',
        description: '修复了按钮组件在某些情况下的点击事件没有正确触发的问题',
        branch: 'main',
        tags: [],
        parents: ['1'],
        changes: [
          {
            type: 'configuration',
            path: 'components/Button/props',
            oldValue: { onClick: undefined },
            newValue: { onClick: 'function' },
            description: '修复点击事件处理'
          }
        ],
        metadata: {
          linesAdded: 15,
          linesRemoved: 8,
          filesChanged: 1,
          componentsAdded: [],
          componentsRemoved: [],
          componentsModified: ['Button']
        }
      },
      {
        id: '3',
        hash: 'i9j0k1l2',
        author: '王五',
        email: 'wang@example.com',
        timestamp: new Date(Date.now() - 900000),
        message: 'feat: 添加输入框组件和表单验证',
        description: '新增了输入框组件，支持多种验证规则和错误提示',
        branch: 'feature/form-components',
        tags: [],
        parents: ['1'],
        changes: [
          {
            type: 'addition',
            path: 'components/Input',
            newValue: { type: 'text', validation: 'required' },
            description: '添加输入框组件'
          },
          {
            type: 'addition',
            path: 'components/Form',
            newValue: { validation: true },
            description: '添加表单组件'
          }
        ],
        metadata: {
          linesAdded: 200,
          linesRemoved: 5,
          filesChanged: 5,
          componentsAdded: ['Input', 'Form'],
          componentsRemoved: [],
          componentsModified: []
        }
      }
    ]

    const mockBranches: VersionBranch[] = [
      {
        name: 'main',
        displayName: '主分支',
        isDefault: true,
        isProtected: true,
        lastCommit: '2',
        commitsAhead: 0,
        commitsBehind: 0,
        createdAt: new Date(Date.now() - 7200000),
        createdBy: '系统',
        description: '主要开发分支'
      },
      {
        name: 'feature/form-components',
        displayName: '表单组件功能',
        isDefault: false,
        isProtected: false,
        lastCommit: '3',
        commitsAhead: 1,
        commitsBehind: 0,
        createdAt: new Date(Date.now() - 3600000),
        createdBy: '王五',
        description: '开发表单相关组件'
      }
    ]

    const mockTags: VersionTag[] = [
      {
        name: 'v1.0.0',
        commit: '1',
        author: '张三',
        timestamp: new Date(Date.now() - 3600000),
        message: '第一个稳定版本',
        isStable: true,
        version: '1.0.0'
      }
    ]

    setCommits(mockCommits)
    setBranches(mockBranches)
    setTags(mockTags)
    setSelectedBranch('main')
  }

  // 创建新提交
  const createCommit = () => {
    if (!commitMessage.trim()) return

    setIsCommitting(true)

    setTimeout(() => {
      const newCommit: VersionCommit = {
        id: String(commits.length + 1),
        hash: generateCommitHash(),
        author: '当前用户',
        email: 'current@example.com',
        timestamp: new Date(),
        message: commitMessage,
        description: commitDescription,
        branch: selectedBranch,
        tags: [],
        parents: [commits[0]?.id || '0'],
        changes: generateConfigChanges(),
        metadata: {
          linesAdded: Math.floor(Math.random() * 50),
          linesRemoved: Math.floor(Math.random() * 20),
          filesChanged: Math.floor(Math.random() * 5) + 1,
          componentsAdded: [],
          componentsRemoved: [],
          componentsModified: ['Configuration']
        }
      }

      setCommits([newCommit, ...commits])
      setCommitMessage('')
      setCommitDescription('')
      setIsCommitting(false)
    }, 1000)
  }

  // 创建新分支
  const createBranch = () => {
    if (!newBranchName.trim()) return

    const newBranch: VersionBranch = {
      name: newBranchName,
      displayName: newBranchName,
      isDefault: false,
      isProtected: false,
      lastCommit: commits[0]?.id || '',
      commitsAhead: 0,
      commitsBehind: 0,
      createdAt: new Date(),
      createdBy: '当前用户',
      description: `从 ${selectedBranch} 分支创建`
    }

    setBranches([...branches, newBranch])
    setNewBranchName('')
    setIsCreatingBranch(false)
    setSelectedBranch(newBranchName)
  }

  // 创建新标签
  const createTag = () => {
    if (!newTagName.trim() || !selectedCommit) return

    const newTag: VersionTag = {
      name: newTagName,
      commit: selectedCommit.id,
      author: '当前用户',
      timestamp: new Date(),
      message: `标签 ${newTagName}`,
      isStable: newTagName.includes('v'),
      version: newTagName.startsWith('v') ? newTagName.substring(1) : undefined
    }

    setTags([...tags, newTag])
    setNewTagName('')
    setIsCreatingTag(false)
  }

  // 版本回滚
  const rollbackToVersion = (commit: VersionCommit) => {
    // 这里应该实现实际的回滚逻辑
    console.log('回滚到版本:', commit.hash)
  }

  // 生成提交哈希
  const generateCommitHash = () => {
    return Math.random().toString(36).substring(2, 10)
  }

  // 生成配置变更
  const generateConfigChanges = () => {
    return [
      {
        type: 'configuration' as const,
        path: 'config/general',
        newValue: config,
        description: '更新配置'
      }
    ]
  }

  // 计算版本差异
  const compareVersions = (fromCommit: string, toCommit: string) => {
    // 这里应该实现实际的差异计算逻辑
    const mockDiff: VersionDiff = {
      fromCommit,
      toCommit,
      changes: [
        {
          type: 'configuration',
          path: 'components/Button',
          oldValue: { variant: 'primary' },
          newValue: { variant: 'secondary' },
          description: '按钮变体更改'
        }
      ],
      statistics: {
        linesAdded: 25,
        linesRemoved: 15,
        filesChanged: 2,
        componentsChanged: 1
      },
      summary: '更改了按钮组件的变体设置'
    }

    setCurrentDiff(mockDiff)
    setActiveTab('compare')
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 版本管理头部 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <GitBranch className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">版本管理</h3>
            <p className="text-sm text-muted-foreground">
              Git风格的配置版本控制和历史追踪
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 自动备份开关 */}
          <button
            onClick={() => setIsAutoBackupEnabled(!isAutoBackupEnabled)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              isAutoBackupEnabled
                ? 'bg-green-500/10 text-green-600 hover:bg-green-500/20'
                : 'bg-gray-500/10 text-gray-600 hover:bg-gray-500/20'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>自动备份</span>
          </button>

          {/* 提交按钮 */}
          <button
            onClick={() => setIsCommitting(true)}
            disabled={isCommitting}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            <GitCommit className="w-4 h-4" />
            <span>提交更改</span>
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="flex items-center space-x-1 p-1 bg-muted rounded-lg">
        {[
          { id: 'commits', label: '提交历史', icon: History },
          { id: 'branches', label: '分支管理', icon: GitBranch },
          { id: 'tags', label: '版本标签', icon: Tag },
          { id: 'compare', label: '版本对比', icon: GitCompare }
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

      {/* 提交面板 */}
      {isCommitting && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-background border rounded-lg"
        >
          <h4 className="font-medium mb-3">创建新提交</h4>

          <div className="space-y-3">
            <div>
              <input
                type="text"
                placeholder="提交标题 (必需)"
                value={commitMessage}
                onChange={(e) => setCommitMessage(e.target.value)}
                className="w-full px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <textarea
                placeholder="提交描述 (可选)"
                value={commitDescription}
                onChange={(e) => setCommitDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">
                分支: {selectedBranch}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setIsCommitting(false)
                    setCommitMessage('')
                    setCommitDescription('')
                  }}
                  className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
                >
                  取消
                </button>

                <button
                  onClick={createCommit}
                  disabled={!commitMessage.trim()}
                  className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  提交
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 提交历史 */}
      {activeTab === 'commits' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">提交历史</h4>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              className="px-3 py-1 bg-muted rounded-md text-sm"
            >
              {branches.map((branch) => (
                <option key={branch.name} value={branch.name}>
                  {branch.displayName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-3">
            {commits
              .filter((commit) => commit.branch === selectedBranch)
              .map((commit) => (
                <motion.div
                  key={commit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 bg-background border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                    selectedCommit?.id === commit.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedCommit(commit)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <GitCommit className="w-4 h-4 text-green-500" />
                        <span className="font-medium text-foreground">
                          {commit.message}
                        </span>
                        {commit.tags.length > 0 && (
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 text-xs rounded-full">
                            {commit.tags[0]}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {commit.description}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{commit.author}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{commit.timestamp.toLocaleTimeString()}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Hash className="w-3 h-3" />
                          <span className="font-mono">{commit.hash}</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <span className="text-green-500">+{commit.metadata.linesAdded}</span>
                          <span className="text-red-500">-{commit.metadata.linesRemoved}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          rollbackToVersion(commit)
                        }}
                        className="p-1.5 hover:bg-muted rounded-md transition-colors"
                        title="回滚到此版本"
                      >
                        <RotateCcw className="w-4 h-4 text-orange-500" />
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // 查看详情
                        }}
                        className="p-1.5 hover:bg-muted rounded-md transition-colors"
                        title="查看详情"
                      >
                        <Eye className="w-4 h-4 text-blue-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </div>
      )}

      {/* 分支管理 */}
      {activeTab === 'branches' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">分支管理</h4>
            <button
              onClick={() => setIsCreatingBranch(true)}
              className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
            >
              <GitBranch className="w-4 h-4" />
              <span>创建分支</span>
            </button>
          </div>

          {/* 创建分支表单 */}
          {isCreatingBranch && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-background border rounded-lg"
            >
              <div className="flex items-center space-x-3 mb-3">
                <GitBranch className="w-5 h-5 text-blue-500" />
                <h5 className="font-medium">创建新分支</h5>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">分支名称</label>
                  <input
                    type="text"
                    placeholder="例如: feature/new-component"
                    value={newBranchName}
                    onChange={(e) => setNewBranchName(e.target.value)}
                    className="w-full px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    基于: {selectedBranch}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setIsCreatingBranch(false)
                        setNewBranchName('')
                      }}
                      className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
                    >
                      取消
                    </button>

                    <button
                      onClick={createBranch}
                      disabled={!newBranchName.trim()}
                      className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    >
                      创建
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* 分支列表 */}
          <div className="grid gap-3">
            {branches.map((branch) => (
              <motion.div
                key={branch.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 bg-background border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedBranch === branch.name ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedBranch(branch.name)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <GitBranch className={`w-5 h-5 ${
                      branch.isDefault ? 'text-blue-500' :
                      branch.isProtected ? 'text-orange-500' : 'text-gray-500'
                    }`} />

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{branch.displayName}</span>

                        {branch.isDefault && (
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 text-xs rounded-full">
                            默认
                          </span>
                        )}

                        {branch.isProtected && (
                          <span className="px-2 py-0.5 bg-orange-500/10 text-orange-600 text-xs rounded-full">
                            受保护
                          </span>
                        )}

                        {branch.commitsAhead > 0 && (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-xs rounded-full">
                            +{branch.commitsAhead}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {branch.description}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span>创建者: {branch.createdBy}</span>
                        <span>最后更新: {branch.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // 切换到分支
                      }}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      title="切换分支"
                    >
                      <GitCompare className="w-4 h-4 text-green-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 版本标签 */}
      {activeTab === 'tags' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">版本标签</h4>
            <button
              onClick={() => setIsCreatingTag(true)}
              disabled={!selectedCommit}
              className="flex items-center space-x-2 px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600 disabled:opacity-50"
            >
              <Tag className="w-4 h-4" />
              <span>创建标签</span>
            </button>
          </div>

          {/* 创建标签表单 */}
          {isCreatingTag && selectedCommit && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-background border rounded-lg"
            >
              <div className="flex items-center space-x-3 mb-3">
                <Tag className="w-5 h-5 text-blue-500" />
                <h5 className="font-medium">创建新标签</h5>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium mb-1">标签名称</label>
                  <input
                    type="text"
                    placeholder="例如: v1.0.1 或 release-2024.01"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    className="w-full px-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground">
                    基于提交: <span className="font-mono">{selectedCommit.hash}</span>
                  </p>
                  <p className="text-sm font-medium mt-1">{selectedCommit.message}</p>
                </div>

                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={() => {
                      setIsCreatingTag(false)
                      setNewTagName('')
                    }}
                    className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground"
                  >
                    取消
                  </button>

                  <button
                    onClick={createTag}
                    disabled={!newTagName.trim()}
                    className="px-4 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                  >
                    创建
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* 标签列表 */}
          <div className="grid gap-3">
            {tags.map((tag) => (
              <motion.div
                key={tag.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-background border rounded-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Tag className={`w-5 h-5 ${
                      tag.isStable ? 'text-green-500' : 'text-gray-500'
                    }`} />

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{tag.name}</span>

                        {tag.isStable && (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-600 text-xs rounded-full">
                            稳定版本
                          </span>
                        )}

                        {tag.version && (
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 text-xs rounded-full">
                            v{tag.version}
                          </span>
                        )}
                      </div>

                      {tag.message && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {tag.message}
                        </p>
                      )}

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                        <span>创建者: {tag.author}</span>
                        <span>提交: <span className="font-mono">{tag.commit}</span></span>
                        <span>{tag.timestamp.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => {
                        // 切换到标签版本
                      }}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      title="切换到此版本"
                    >
                      <GitCompare className="w-4 h-4 text-green-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 版本对比 */}
      {activeTab === 'compare' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">版本对比</h4>
            <button
              onClick={() => {
                setCompareFromCommit('')
                setCompareToCommit('')
                setCurrentDiff(null)
              }}
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              清除对比
            </button>
          </div>

          {/* 版本选择器 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">源版本</label>
              <select
                value={compareFromCommit}
                onChange={(e) => setCompareFromCommit(e.target.value)}
                className="w-full px-3 py-2 bg-muted rounded-md text-sm"
              >
                <option value="">选择提交...</option>
                {commits.map((commit) => (
                  <option key={commit.id} value={commit.id}>
                    {commit.hash} - {commit.message}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">目标版本</label>
              <select
                value={compareToCommit}
                onChange={(e) => setCompareToCommit(e.target.value)}
                className="w-full px-3 py-2 bg-muted rounded-md text-sm"
              >
                <option value="">选择提交...</option>
                {commits.map((commit) => (
                  <option key={commit.id} value={commit.id}>
                    {commit.hash} - {commit.message}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {compareFromCommit && compareToCommit && (
            <div className="flex justify-center">
              <button
                onClick={() => compareVersions(compareFromCommit, compareToCommit)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <GitCompare className="w-4 h-4" />
                <span>开始对比</span>
              </button>
            </div>
          )}

          {/* 对比结果 */}
          {currentDiff && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* 对比统计 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-background border rounded-lg">
                  <div className="flex items-center space-x-2 text-green-500">
                    <span className="text-2xl font-bold">+{currentDiff.statistics.linesAdded}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">新增行数</p>
                </div>

                <div className="p-4 bg-background border rounded-lg">
                  <div className="flex items-center space-x-2 text-red-500">
                    <span className="text-2xl font-bold">-{currentDiff.statistics.linesRemoved}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">删除行数</p>
                </div>

                <div className="p-4 bg-background border rounded-lg">
                  <div className="flex items-center space-x-2 text-blue-500">
                    <span className="text-2xl font-bold">{currentDiff.statistics.filesChanged}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">文件变更</p>
                </div>

                <div className="p-4 bg-background border rounded-lg">
                  <div className="flex items-center space-x-2 text-purple-500">
                    <span className="text-2xl font-bold">{currentDiff.statistics.componentsChanged}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">组件变更</p>
                </div>
              </div>

              {/* 变更详情 */}
              <div className="p-4 bg-background border rounded-lg">
                <h5 className="font-medium mb-3">变更详情</h5>

                <div className="space-y-3">
                  {currentDiff.changes.map((change, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                      <div className={`p-1.5 rounded ${
                        change.type === 'addition' ? 'bg-green-500/10' :
                        change.type === 'deletion' ? 'bg-red-500/10' :
                        'bg-blue-500/10'
                      }`}>
                        {change.type === 'addition' && <span className="text-green-500">+</span>}
                        {change.type === 'deletion' && <span className="text-red-500">-</span>}
                        {change.type === 'configuration' && <span className="text-blue-500">~</span>}
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-sm">{change.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">{change.path}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 对比摘要 */}
              <div className="p-4 bg-blue-500/5 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2 text-blue-600 mb-2">
                  <GitCompare className="w-4 h-4" />
                  <span className="font-medium">对比摘要</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {currentDiff.summary}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      )}

      {/* 自动备份配置 */}
      {isAutoBackupEnabled && (
        <div className="p-4 bg-green-500/5 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <RefreshCw className="w-5 h-5 text-green-500" />
              <div>
                <h5 className="font-medium text-green-600">自动备份已启用</h5>
                <p className="text-sm text-muted-foreground">
                  每 {backupInterval / 60} 分钟自动备份配置
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                // 手动触发备份
                console.log('手动备份')
              }}
              className="flex items-center space-x-2 px-3 py-1.5 bg-green-500 text-white text-sm rounded-md hover:bg-green-600"
            >
              <Save className="w-4 h-4" />
              <span>立即备份</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}