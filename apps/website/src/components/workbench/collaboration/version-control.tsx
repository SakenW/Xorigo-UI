'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import { GitBranch, GitMerge, GitCommit, Clock, User, Tag, AlertCircle, CheckCircle, XCircle } from 'lucide-react'
import { getVersionControlService, type VersionControlService } from './services/version-control-service'
import type {
  Version,
  Branch,
  MergeRequest,
  VersionChange,
  UseVersionControlOptions
} from './types'

// ============================================================================
// 组件变体配置
// ============================================================================

const versionControlVariants = cva(
  'rounded-lg border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
        active: 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950',
        success: 'border-green-500 bg-green-50 dark:border-green-400 dark:bg-green-950',
        warning: 'border-yellow-500 bg-yellow-50 dark:border-yellow-400 dark:bg-yellow-950',
        error: 'border-red-500 bg-red-50 dark:border-red-400 dark:bg-red-950'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const versionCardVariants = cva(
  'p-4 rounded-lg border transition-all duration-200 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600',
        active: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
        merge: 'border-purple-500 bg-purple-50 dark:bg-purple-950',
        conflict: 'border-red-500 bg-red-50 dark:bg-red-950'
      }
    }
  }
)

const branchCardVariants = cva(
  'p-3 rounded-lg border transition-all duration-200 cursor-pointer',
  {
    variants: {
      variant: {
        default: 'border-gray-200 hover:border-gray-300 dark:border-gray-700 dark:hover:border-gray-600',
        active: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
        protected: 'border-orange-500 bg-orange-50 dark:bg-orange-950',
        main: 'border-green-500 bg-green-50 dark:bg-green-950'
      }
    }
  }
)

const mergeRequestVariants = cva(
  'p-4 rounded-lg border transition-all duration-200',
  {
    variants: {
      status: {
        open: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
        in_review: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
        approved: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
        rejected: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950',
        merged: 'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-950',
        closed: 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800'
      }
    }
  }
)

// ============================================================================
// 组件 Props
// ============================================================================

interface VersionControlProps {
  documentId: string
  userId: string
  className?: string
  onVersionCreated?: (version: Version) => void
  onBranchCreated?: (branch: Branch) => void
  onMergeRequested?: (mergeRequest: MergeRequest) => void
  onError?: (error: any) => void
}

// ============================================================================
// 版本历史组件
// ============================================================================

interface VersionHistoryProps {
  versions: Version[]
  selectedVersionId?: string
  onVersionSelect: (version: Version) => void
  onVersionCompare: (version1: Version, version2: Version) => void
}

function VersionHistory({ versions, selectedVersionId, onVersionSelect, onVersionCompare }: VersionHistoryProps) {
  const [compareMode, setCompareMode] = useState(false)
  const [compareVersions, setCompareVersions] = useState<string[]>([])

  const handleVersionClick = (version: Version) => {
    if (compareMode) {
      const newCompareVersions = [...compareVersions, version.id].slice(-2)
      setCompareVersions(newCompareVersions)

      if (newCompareVersions.length === 2) {
        const version1 = versions.find(v => v.id === newCompareVersions[0])
        const version2 = versions.find(v => v.id === newCompareVersions[1])
        if (version1 && version2) {
          onVersionCompare(version1, version2)
          setCompareMode(false)
          setCompareVersions([])
        }
      }
    } else {
      onVersionSelect(version)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          版本历史
        </h3>
        <button
          onClick={() => {
            setCompareMode(!compareMode)
            setCompareVersions([])
          }}
          className={cn(
            'px-3 py-1 text-sm rounded-lg transition-colors',
            compareMode
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
          )}
        >
          {compareMode ? '选择版本比较' : '比较版本'}
        </button>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {versions.map((version) => (
            <motion.div
              key={version.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onClick={() => handleVersionClick(version)}
              className={cn(
                versionCardVariants({
                  variant: selectedVersionId === version.id ? 'active' :
                           compareVersions.includes(version.id) ? 'merge' : 'default'
                }),
                'relative'
              )}
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
                  <GitCommit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900 dark:text-white truncate">
                      {version.name}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                      {version.version}
                    </span>
                    {version.isMainBranch && (
                      <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                        main
                      </span>
                    )}
                  </div>
                  {version.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {version.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-500">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span>{version.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatRelativeTime(version.timestamp)}</span>
                    </div>
                    {version.tags.length > 0 && (
                      <div className="flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>{version.tags.join(', ')}</span>
                      </div>
                    )}
                  </div>
                  {version.changes.length > 0 && (
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      {version.changes.length} 个变更
                    </div>
                  )}
                </div>
              </div>
              {compareVersions.includes(version.id) && (
                <div className="absolute top-2 right-2 w-2 h-2 bg-purple-500 rounded-full" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ============================================================================
// 分支管理组件
// ============================================================================

interface BranchManagementProps {
  branches: Branch[]
  currentBranchId: string
  onBranchSelect: (branch: Branch) => void
  onBranchCreate: () => void
  onBranchDelete: (branchId: string) => void
}

function BranchManagement({ branches, currentBranchId, onBranchSelect, onBranchCreate, onBranchDelete }: BranchManagementProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newBranchName, setNewBranchName] = useState('')
  const [newBranchDescription, setNewBranchDescription] = useState('')

  const handleCreateBranch = () => {
    if (newBranchName.trim()) {
      onBranchCreate()
      setNewBranchName('')
      setNewBranchDescription('')
      setShowCreateForm(false)
    }
  }

  const getBranchVariant = (branch: Branch) => {
    if (branch.id === currentBranchId) return 'active'
    if (branch.isMain) return 'main'
    if (branch.isProtected) return 'protected'
    return 'default'
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          分支管理
        </h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          创建分支
        </button>
      </div>

      <AnimatePresence>
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50 dark:bg-blue-950"
          >
            <input
              type="text"
              placeholder="分支名称"
              value={newBranchName}
              onChange={(e) => setNewBranchName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-2"
            />
            <textarea
              placeholder="分支描述（可选）"
              value={newBranchDescription}
              onChange={(e) => setNewBranchDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mb-2 resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <button
                onClick={handleCreateBranch}
                className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
              >
                创建
              </button>
              <button
                onClick={() => {
                  setShowCreateForm(false)
                  setNewBranchName('')
                  setNewBranchDescription('')
                }}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                取消
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {branches.map((branch) => (
          <motion.div
            key={branch.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={cn(branchCardVariants({ variant: getBranchVariant(branch) }))}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <GitBranch className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {branch.name}
                    </span>
                    {branch.isMain && (
                      <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                        main
                      </span>
                    )}
                    {branch.isProtected && (
                      <span className="text-xs px-2 py-1 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-full">
                        protected
                      </span>
                    )}
                  </div>
                  {branch.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {branch.description}
                    </p>
                  )}
                  <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {formatRelativeTime(branch.createdAt)}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {branch.id === currentBranchId && (
                  <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                    当前
                  </span>
                )}
                {!branch.isMain && !branch.isProtected && branch.id !== currentBranchId && (
                  <button
                    onClick={() => onBranchDelete(branch.id)}
                    className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

// ============================================================================
// 合并请求组件
// ============================================================================

interface MergeRequestsProps {
  mergeRequests: MergeRequest[]
  onRequestSelect: (request: MergeRequest) => void
  onRequestApprove: (requestId: string) => void
  onRequestReject: (requestId: string) => void
  onRequestMerge: (requestId: string) => void
}

function MergeRequests({ mergeRequests, onRequestSelect, onRequestApprove, onRequestReject, onRequestMerge }: MergeRequestsProps) {
  const getStatusIcon = (status: MergeRequest['status']) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      case 'in_review':
        return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
      case 'merged':
        return <GitMerge className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      default:
        return <AlertCircle className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    }
  }

  const getStatusText = (status: MergeRequest['status']) => {
    switch (status) {
      case 'open': return '待审核'
      case 'in_review': return '审核中'
      case 'approved': return '已批准'
      case 'rejected': return '已拒绝'
      case 'merged': return '已合并'
      case 'closed': return '已关闭'
      default: return status
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        合并请求
      </h3>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {mergeRequests.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            暂无合并请求
          </div>
        ) : (
          mergeRequests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(mergeRequestVariants({ status: request.status }))}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(request.status)}
                    <span className="font-medium text-gray-900 dark:text-white">
                      {request.title}
                    </span>
                    <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                      {getStatusText(request.status)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {request.description}
                  </p>
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                    <span>
                      {request.sourceBranch} → {request.targetBranch}
                    </span>
                    <span>{request.author.name}</span>
                    <span>{formatRelativeTime(request.createdAt)}</span>
                    {request.conflicts.length > 0 && (
                      <span className="text-red-600 dark:text-red-400">
                        {request.conflicts.length} 个冲突
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-1 ml-4">
                  {request.status === 'open' && (
                    <>
                      <button
                        onClick={() => onRequestApprove(request.id)}
                        className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition-colors"
                      >
                        批准
                      </button>
                      <button
                        onClick={() => onRequestReject(request.id)}
                        className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                      >
                        拒绝
                      </button>
                    </>
                  )}
                  {request.status === 'approved' && (
                    <button
                      onClick={() => onRequestMerge(request.id)}
                      className="px-2 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700 transition-colors"
                    >
                      合并
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

// ============================================================================
// 主版本控制组件
// ============================================================================

export function VersionControl({
  documentId,
  userId,
  className,
  onVersionCreated,
  onBranchCreated,
  onMergeRequested,
  onError
}: VersionControlProps) {
  const [activeTab, setActiveTab] = useState<'history' | 'branches' | 'merge-requests'>('history')
  const [versions, setVersions] = useState<Version[]>([])
  const [branches, setBranches] = useState<Branch[]>([])
  const [mergeRequests, setMergeRequests] = useState<MergeRequest[]>([])
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null)
  const [selectedVersion, setSelectedVersion] = useState<Version | null>(null)
  const [loading, setLoading] = useState(true)

  const versionControlServiceRef = useRef<VersionControlService | null>(null)

  // 初始化版本控制服务
  useEffect(() => {
    if (!documentId || !userId) return

    const service = getVersionControlService({
      documentId,
      userId,
      onVersionCreated: (version) => {
        setVersions(prev => [...prev, version])
        onVersionCreated?.(version)
      },
      onBranchCreated: (branch) => {
        setBranches(prev => [...prev, branch])
        onBranchCreated?.(branch)
      },
      onMergeRequested: (mergeRequest) => {
        setMergeRequests(prev => [...prev, mergeRequest])
        onMergeRequested?.(mergeRequest)
      },
      onError: (error) => {
        console.error('Version control error:', error)
        onError?.(error)
      }
    })

    versionControlServiceRef.current = service

    loadData()
  }, [documentId, userId])

  // 加载数据
  const loadData = useCallback(async () => {
    try {
      setLoading(true)

      const [versionsData, branchesData, mergeRequestsData] = await Promise.all([
        versionControlServiceRef.current?.getVersionHistory() || [],
        versionControlServiceRef.current?.getAllBranches() || [],
        versionControlServiceRef.current?.getMergeRequests() || []
      ])

      setVersions(versionsData)
      setBranches(branchesData)
      setMergeRequests(mergeRequestsData)

      // 设置当前分支
      const mainBranch = branchesData.find(b => b.isMain)
      setCurrentBranch(mainBranch || branchesData[0] || null)
    } catch (error) {
      console.error('Failed to load version control data:', error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [onError])

  // 处理版本选择
  const handleVersionSelect = useCallback((version: Version) => {
    setSelectedVersion(version)
  }, [])

  // 处理版本比较
  const handleVersionCompare = useCallback((version1: Version, version2: Version) => {
    console.log('Comparing versions:', version1.id, version2.id)
    // 这里可以实现版本比较UI
  }, [])

  // 处理分支选择
  const handleBranchSelect = useCallback(async (branch: Branch) => {
    if (versionControlServiceRef.current) {
      await versionControlServiceRef.current.switchBranch(branch.id)
      setCurrentBranch(branch)
      await loadData()
    }
  }, [loadData])

  // 处理创建分支
  const handleCreateBranch = useCallback(async (branchName: string, description?: string) => {
    if (versionControlServiceRef.current) {
      const result = await versionControlServiceRef.current.createBranch({
        name: branchName,
        description
      })
      if (result.success) {
        await loadData()
      }
    }
  }, [loadData])

  // 处理删除分支
  const handleDeleteBranch = useCallback(async (branchId: string) => {
    if (versionControlServiceRef.current) {
      const result = await versionControlServiceRef.current.deleteBranch(branchId)
      if (result.success) {
        await loadData()
      }
    }
  }, [loadData])

  // 处理合并请求批准
  const handleMergeRequestApprove = useCallback(async (requestId: string) => {
    console.log('Approving merge request:', requestId)
    // 实现批准逻辑
  }, [])

  // 处理合并请求拒绝
  const handleMergeRequestReject = useCallback(async (requestId: string) => {
    console.log('Rejecting merge request:', requestId)
    // 实现拒绝逻辑
  }, [])

  // 处理合并请求合并
  const handleMergeRequestMerge = useCallback(async (requestId: string) => {
    if (versionControlServiceRef.current) {
      const result = await versionControlServiceRef.current.mergeBranch(requestId)
      if (result.success) {
        await loadData()
      }
    }
  }, [loadData])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className={cn('space-y-6', className)}>
      {/* 标签页导航 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {[
          { key: 'history', label: '版本历史', icon: GitCommit },
          { key: 'branches', label: '分支管理', icon: GitBranch },
          { key: 'merge-requests', label: '合并请求', icon: GitMerge }
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 border-b-2 transition-colors',
              activeTab === key
                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* 当前分支信息 */}
      {currentBranch && (
        <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GitBranch className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="font-medium text-blue-900 dark:text-blue-100">
                当前分支: {currentBranch.name}
              </span>
            </div>
            <span className="text-sm text-blue-700 dark:text-blue-300">
              版本: {currentBranch.headVersionId}
            </span>
          </div>
        </div>
      )}

      {/* 标签页内容 */}
      <AnimatePresence mode="wait">
        {activeTab === 'history' && (
          <motion.div
            key="history"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <VersionHistory
              versions={versions}
              selectedVersionId={selectedVersion?.id}
              onVersionSelect={handleVersionSelect}
              onVersionCompare={handleVersionCompare}
            />
          </motion.div>
        )}

        {activeTab === 'branches' && (
          <motion.div
            key="branches"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <BranchManagement
              branches={branches}
              currentBranchId={currentBranch?.id || ''}
              onBranchSelect={handleBranchSelect}
              onBranchCreate={() => {/* 显示创建分支表单 */}}
              onBranchDelete={handleDeleteBranch}
            />
          </motion.div>
        )}

        {activeTab === 'merge-requests' && (
          <motion.div
            key="merge-requests"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <MergeRequests
              mergeRequests={mergeRequests}
              onRequestSelect={(request) => console.log('Selected merge request:', request)}
              onRequestApprove={handleMergeRequestApprove}
              onRequestReject={handleMergeRequestReject}
              onRequestMerge={handleMergeRequestMerge}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// 工具函数
function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return '刚刚'
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes}分钟前`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours}小时前`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days}天前`
  } else {
    return date.toLocaleDateString()
  }
}