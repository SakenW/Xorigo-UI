'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import {
  Users,
  GitBranch,
  Share2,
  MessageSquare,
  Code,
  FileText,
  Settings,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Clock,
  Star,
  Download,
  Eye,
  Edit3,
  Trash2,
  Copy,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Activity,
  Zap,
  Shield,
  Database
} from 'lucide-react'

// 导入协作组件
import CollaborationWorkspace, {
  RealTimeEditor,
  VersionControl,
  SharingComments,
  TeamTemplateLibrary,
  useCollaboration,
  useVersionControl,
  useSharing,
  useTemplateLibrary
} from './collaboration'

// 导入其他组件
import { WorkbenchNavigation } from './shared/workbench-navigation'
import { SmartBreadcrumb } from './shared/smart-breadcrumb'
import { ComponentPropertiesDrawer } from './smart-workbench/component-properties-drawer'
import { useRef } from 'react'
import { AIAssistantPanel } from './ai-assistant'

// 导入类型
import type {
  User,
  CollaborationSession,
  Version,
  Branch,
  ShareableLink,
  Comment,
  TeamTemplate
} from './collaboration/types'

// ============================================================================
// 组件变体配置
// ============================================================================

const workbenchVariants = cva(
  'h-full flex flex-col bg-gray-50 dark:bg-gray-950',
  {
    variants: {
      variant: {
        default: '',
        fullscreen: 'fixed inset-0 z-50',
        embedded: 'border border-gray-200 dark:border-gray-700 rounded-lg'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const statsCardVariants = cva(
  'p-4 rounded-lg border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
        primary: 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950',
        success: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950',
        warning: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950',
        error: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
      }
    }
  }
)

// ============================================================================
// 组件 Props
// ============================================================================

interface CollaborationWorkbenchProps extends VariantProps<typeof workbenchVariants> {
  documentId: string
  userId: string
  organizationId?: string
  initialContent?: string
  className?: string
  onContentChange?: (content: string) => void
  onError?: (error: any) => void
}

// ============================================================================
// 统计卡片组件
// ============================================================================

interface StatsCardProps {
  title: string
  value: string | number
  icon: React.ComponentType<any>
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error'
  change?: {
    value: number
    trend: 'up' | 'down'
  }
  description?: string
}

function StatsCard({ title, value, icon: Icon, variant = 'default', change, description }: StatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(statsCardVariants({ variant }))}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
          {description && (
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              {description}
            </p>
          )}
          {change && (
            <div className="flex items-center gap-1 mt-2">
              {change.trend === 'up' ? (
                <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
              ) : (
                <TrendingUp className="w-3 h-3 text-red-600 dark:text-red-400 rotate-180" />
              )}
              <span className={cn(
                'text-xs font-medium',
                change.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
              )}>
                {Math.abs(change.value)}%
              </span>
            </div>
          )}
        </div>
        <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Icon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 活动日志组件
// ============================================================================

interface ActivityLogProps {
  activities: Array<{
    id: string
    type: 'user_joined' | 'user_left' | 'edit_operation' | 'comment_added' | 'version_created'
    user: User
    timestamp: Date
    description: string
  }>
}

function ActivityLog({ activities }: ActivityLogProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_joined':
        return <Users className="w-4 h-4 text-green-600 dark:text-green-400" />
      case 'user_left':
        return <Users className="w-4 h-4 text-red-600 dark:text-red-400" />
      case 'edit_operation':
        return <Edit3 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      case 'comment_added':
        return <MessageSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
      case 'version_created':
        return <GitBranch className="w-4 h-4 text-orange-600 dark:text-orange-400" />
      default:
        return <Activity className="w-4 h-4 text-gray-600 dark:text-gray-400" />
    }
  }

  const formatTime = (date: Date) => {
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
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div className="space-y-2">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
        活动日志
      </h3>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            暂无活动记录
          </div>
        ) : (
          activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 p-3 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {activity.user.name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {activity.description}
                </p>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}

// ============================================================================
// 快速操作组件
// ============================================================================

interface QuickActionsProps {
  onNewTemplate: () => void
  onShareDocument: () => void
  onCreateBranch: () => void
  onInviteUsers: () => void
}

function QuickActions({ onNewTemplate, onShareDocument, onCreateBranch, onInviteUsers }: QuickActionsProps) {
  const actions = [
    {
      icon: Plus,
      label: '新建模板',
      description: '创建新的团队模板',
      color: 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900',
      onClick: onNewTemplate
    },
    {
      icon: Share2,
      label: '分享文档',
      description: '生成分享链接',
      color: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900',
      onClick: onShareDocument
    },
    {
      icon: GitBranch,
      label: '创建分支',
      description: '创建新的开发分支',
      color: 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900',
      onClick: onCreateBranch
    },
    {
      icon: Users,
      label: '邀请用户',
      description: '邀请新用户加入协作',
      color: 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900',
      onClick: onInviteUsers
    }
  ]

  return (
    <div className="grid grid-cols-2 gap-3">
      {actions.map((action, index) => (
        <motion.button
          key={index}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={action.onClick}
          className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 text-left"
        >
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-3', action.color)}>
            <action.icon className="w-4 h-4" />
          </div>
          <h4 className="font-medium text-gray-900 dark:text-white text-sm">
            {action.label}
          </h4>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
            {action.description}
          </p>
        </motion.button>
      ))}
    </div>
  )
}

// ============================================================================
// 主协作工作台组件
// ============================================================================

export function CollaborationWorkbench({
  documentId,
  userId,
  organizationId,
  initialContent = '',
  variant,
  className,
  onContentChange,
  onError
}: CollaborationWorkbenchProps) {
  // 核心状态
  const [activeView, setActiveView] = useState<'editor' | 'dashboard' | 'templates'>('dashboard')
  const [showAIAssistant, setShowAIAssistant] = useState(false)
  const [mounted, setMounted] = useState(false)

  // 协作功能hooks
  const collaboration = useCollaboration({
    documentId,
    userId,
    onContentChanged: (operation) => {
      console.log('Content changed via collaboration:', operation)
    },
    onError: (error) => {
      console.error('Collaboration error:', error)
      onError?.(error)
    }
  })

  const versionControl = useVersionControl({
    documentId,
    userId,
    onError: (error) => {
      console.error('Version control error:', error)
      onError?.(error)
    }
  })

  const sharing = useSharing({
    documentId,
    userId,
    onError: (error) => {
      console.error('Sharing error:', error)
      onError?.(error)
    }
  })

  const templateLibrary = useTemplateLibrary({
    organizationId,
    userId,
    onError: (error) => {
      console.error('Template library error:', error)
      onError?.(error)
    }
  })

  // 挂载状态
  useEffect(() => {
    setMounted(true)
  }, [])

  // 自动连接协作会话
  useEffect(() => {
    if (mounted && !collaboration.isConnected) {
      collaboration.connect()
    }
  }, [mounted, collaboration.isConnected])

  // 生成面包屑导航
  const breadcrumbItems = useMemo(() => {
    const items = []

    items.push({
      id: 'collaboration',
      label: '协作工作台',
      isActive: activeView === 'dashboard',
      icon: '🤝'
    })

    if (activeView === 'editor') {
      items.push({
        id: 'editor',
        label: '实时编辑',
        isActive: true,
        icon: '✏️'
      })
    } else if (activeView === 'templates') {
      items.push({
        id: 'templates',
        label: '模板库',
        isActive: true,
        icon: '📚'
      })
    }

    return items
  }, [activeView])

  // 模拟活动数据
  const activities = useMemo(() => {
    return [
      {
        id: '1',
        type: 'user_joined' as const,
        user: collaboration.onlineUsers[0] || {
          id: 'demo',
          name: '演示用户',
          email: 'demo@example.com',
          status: 'online' as const,
          lastSeen: new Date(),
          color: '#3B82F6',
          permissions: {
            canEdit: true,
            canComment: true,
            canShare: true,
            canManageTemplates: true,
            canDelete: true
          }
        },
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        description: '加入了协作会话'
      },
      {
        id: '2',
        type: 'edit_operation' as const,
        user: collaboration.onlineUsers[1] || {
          id: 'demo2',
          name: '用户2',
          email: 'user2@example.com',
          status: 'online' as const,
          lastSeen: new Date(),
          color: '#10B981',
          permissions: {
            canEdit: true,
            canComment: true,
            canShare: true,
            canManageTemplates: false,
            canDelete: false
          }
        },
        timestamp: new Date(Date.now() - 10 * 60 * 1000),
        description: '编辑了第 15 行代码'
      },
      {
        id: '3',
        type: 'comment_added' as const,
        user: collaboration.onlineUsers[0] || {
          id: 'demo',
          name: '演示用户',
          email: 'demo@example.com',
          status: 'online' as const,
          lastSeen: new Date(),
          color: '#3B82F6',
          permissions: {
            canEdit: true,
            canComment: true,
            canShare: true,
            canManageTemplates: true,
            canDelete: true
          }
        },
        timestamp: new Date(Date.now() - 15 * 60 * 1000),
        description: '添加了一条评论'
      }
    ]
  }, [collaboration.onlineUsers])

  // 快速操作处理
  const handleNewTemplate = useCallback(() => {
    setActiveView('templates')
  }, [])

  const handleShareDocument = useCallback(() => {
    // 实现分享逻辑
    console.log('Share document')
  }, [])

  const handleCreateBranch = useCallback(() => {
    // 实现创建分支逻辑
    console.log('Create branch')
  }, [])

  const handleInviteUsers = useCallback(() => {
    // 实现邀请用户逻辑
    console.log('Invite users')
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className={cn(workbenchVariants({ variant }), className)}>
      {/* 导航栏 */}
      <WorkbenchNavigation
        currentView="collaboration"
        onViewChange={(view) => {
          if (view === 'collaboration') {
            setActiveView('dashboard')
          }
        }}
        onAIAssistantClick={() => setShowAIAssistant(true)}
      />

      {/* 面包屑导航 */}
      <div className="px-6 py-3 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
        <SmartBreadcrumb
          items={breadcrumbItems}
          onItemSelect={(item) => {
            if (item.id === 'collaboration') {
              setActiveView('dashboard')
            } else if (item.id === 'editor') {
              setActiveView('editor')
            } else if (item.id === 'templates') {
              setActiveView('templates')
            }
          }}
        />
      </div>

      {/* 主要内容区域 */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeView === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full p-6 overflow-auto"
            >
              <div className="max-w-7xl mx-auto">
                {/* 头部 */}
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    协作工作台
                  </h1>
                  <p className="text-gray-600 dark:text-gray-400">
                    实时协作、版本控制、团队分享的统一工作平台
                  </p>
                </div>

                {/* 统计卡片 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatsCard
                    title="在线用户"
                    value={collaboration.onlineUsers.length}
                    icon={Users}
                    variant="primary"
                    change={{ value: 12, trend: 'up' }}
                    description="当前活跃用户"
                  />
                  <StatsCard
                    title="版本数量"
                    value={versionControl.versions.length}
                    icon={GitBranch}
                    variant="success"
                    change={{ value: 8, trend: 'up' }}
                    description="总版本数"
                  />
                  <StatsCard
                    title="评论数量"
                    value={sharing.comments.length}
                    icon={MessageSquare}
                    variant="warning"
                    description="待回复评论"
                  />
                  <StatsCard
                    title="团队模板"
                    value={templateLibrary.templates.length}
                    icon={Code}
                    variant="default"
                    change={{ value: 15, trend: 'up' }}
                    description="可用模板"
                  />
                </div>

                {/* 快速操作 */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    快速操作
                  </h2>
                  <QuickActions
                    onNewTemplate={handleNewTemplate}
                    onShareDocument={handleShareDocument}
                    onCreateBranch={handleCreateBranch}
                    onInviteUsers={handleInviteUsers}
                  />
                </div>

                {/* 主要内容区域 */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 左侧 - 活动日志 */}
                  <div className="lg:col-span-1">
                    <ActivityLog activities={activities} />
                  </div>

                  {/* 中间 - 协作编辑器预览 */}
                  <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                          实时协作编辑器
                        </h2>
                        <button
                          onClick={() => setActiveView('editor')}
                          className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          打开编辑器
                        </button>
                      </div>
                      <div className="h-64 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Edit3 className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            实时协作编辑器
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            支持多用户实时协作、冲突检测和解决
                          </p>
                          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex -space-x-2">
                              {collaboration.onlineUsers.slice(0, 3).map((user) => (
                                <div
                                  key={user.id}
                                  className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-900 flex items-center justify-center text-white text-xs font-medium"
                                  style={{ backgroundColor: user.color }}
                                  title={user.name}
                                >
                                  {user.name.charAt(0).toUpperCase()}
                                </div>
                              ))}
                            </div>
                            <span>
                              {collaboration.onlineUsers.length} 人在线
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeView === 'editor' && (
            <motion.div
              key="editor"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <CollaborationWorkspace
                documentId={documentId}
                userId={userId}
                organizationId={organizationId}
                initialContent={initialContent}
                onContentChange={onContentChange}
                onError={onError}
              />
            </motion.div>
          )}

          {activeView === 'templates' && (
            <motion.div
              key="templates"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full p-6 overflow-auto"
            >
              <TeamTemplateLibrary
                organizationId={organizationId}
                userId={userId}
                onTemplateSelected={(template) => {
                  console.log('Template selected:', template)
                }}
                onError={onError}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* AI 助手面板 */}
      <AnimatePresence>
        {showAIAssistant && (
          <AIAssistantPanel
            position="bottom-right"
            size="large"
            defaultTab="collaboration"
            onComponentSelect={(component) => {
              console.log('AI recommended component:', component)
            }}
            onSolutionSelect={(solution) => {
              console.log('AI solution:', solution)
            }}
            onClose={() => setShowAIAssistant(false)}
            showMinimizeButton={true}
            showCloseButton={true}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default CollaborationWorkbench