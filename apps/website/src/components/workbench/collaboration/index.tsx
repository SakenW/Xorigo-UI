/**
 * 协作编辑主入口组件
 * 集成所有协作功能并提供统一的界面
 */

'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import {
  Users,
  GitBranch,
  Share2,
  MessageSquare,
  Settings,
  Maximize2,
  Minimize2,
  X,
  Plus,
  Edit3,
  Eye,
  EyeOff
} from 'lucide-react'

// 导入子组件
import { RealTimeEditor } from './real-time-editor'
import { VersionControl } from './version-control'
import { SharingComments } from './sharing-comments'
import { TeamTemplateLibrary } from './team-template-library'

// 导入hooks
import { useCollaboration } from './hooks/use-collaboration'
import { useVersionControl } from './hooks/use-version-control'
import { useSharing } from './hooks/use-sharing'
import { useTemplateLibrary } from './hooks/use-template-library'

// 导入类型
import type {
  User,
  CollaborationSession,
  Version,
  Branch,
  ShareableLink,
  Comment,
  TeamTemplate
} from './types'

// ============================================================================
// 组件变体配置
// ============================================================================

const collaborationPanelVariants = cva(
  'fixed bg-white dark:bg-gray-900 border shadow-xl transition-all duration-300',
  {
    variants: {
      position: {
        'right': 'right-0 top-0 h-full border-l border-gray-200 dark:border-gray-700',
        'bottom': 'bottom-0 left-0 right-0 border-t border-gray-200 dark:border-gray-700',
        'left': 'left-0 top-0 h-full border-r border-gray-200 dark:border-gray-700',
        'floating': 'rounded-lg border border-gray-200 dark:border-gray-700'
      },
      size: {
        'small': 'w-80 h-96',
        'medium': 'w-96 h-[32rem]',
        'large': 'w-[48rem] h-[36rem]',
        'fullscreen': 'w-full h-full'
      }
    },
    defaultVariants: {
      position: 'right',
      size: 'large'
    }
  }
)

const tabButtonVariants = cva(
  'flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200',
  {
    variants: {
      active: {
        true: 'bg-blue-600 text-white',
        false: 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
      }
    }
  }
)

// ============================================================================
// 组件 Props
// ============================================================================

interface CollaborationPanelProps extends VariantProps<typeof collaborationPanelVariants> {
  documentId: string
  userId: string
  organizationId?: string
  initialContent?: string
  className?: string
  onContentChange?: (content: string) => void
  onError?: (error: any) => void
}

interface CollaborationWorkspaceProps {
  documentId: string
  userId: string
  organizationId?: string
  initialContent?: string
  className?: string
  onContentChange?: (content: string) => void
  onError?: (error: any) => void
}

// ============================================================================
// 协作面板组件
// ============================================================================

interface CollaborationPanelProps {
  documentId: string
  userId: string
  organizationId?: string
  position: 'right' | 'bottom' | 'left' | 'floating'
  size: 'small' | 'medium' | 'large' | 'fullscreen'
  isVisible: boolean
  onClose: () => void
  onToggleSize: () => void
}

function CollaborationPanelInner({
  documentId,
  userId,
  organizationId,
  position,
  size,
  isVisible,
  onClose,
  onToggleSize
}: CollaborationPanelProps) {
  const [activeTab, setActiveTab] = useState<'real-time' | 'version-control' | 'sharing' | 'templates'>('real-time')
  const [isMinimized, setIsMinimized] = useState(false)

  // 协作功能hooks
  const collaboration = useCollaboration({
    documentId,
    userId,
    onError: (error) => console.error('Collaboration error:', error)
  })

  const versionControl = useVersionControl({
    documentId,
    userId,
    onError: (error) => console.error('Version control error:', error)
  })

  const sharing = useSharing({
    documentId,
    userId,
    onError: (error) => console.error('Sharing error:', error)
  })

  const templateLibrary = useTemplateLibrary({
    organizationId,
    userId,
    onError: (error) => console.error('Template library error:', error)
  })

  // 自动连接协作会话
  useEffect(() => {
    if (isVisible && !collaboration.isConnected) {
      collaboration.connect()
    }
  }, [isVisible, collaboration.isConnected])

  const tabs = [
    {
      id: 'real-time' as const,
      label: '实时协作',
      icon: Users,
      count: collaboration.onlineUsers.length
    },
    {
      id: 'version-control' as const,
      label: '版本控制',
      icon: GitBranch,
      count: versionControl.mergeRequests.filter(mr => mr.status === 'open').length
    },
    {
      id: 'sharing' as const,
      label: '分享评论',
      icon: MessageSquare,
      count: sharing.comments.filter(c => !c.isResolved).length
    },
    {
      id: 'templates' as const,
      label: '模板库',
      icon: Settings,
      count: 0
    }
  ]

  const handleContentSizeChange = useCallback((size: 'small' | 'medium' | 'large' | 'fullscreen') => {
    // 这里可以实现面板大小调整逻辑
    console.log('Panel size changed to:', size)
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: position === 'right' ? 100 : position === 'left' ? -100 : 0, y: position === 'bottom' ? 100 : 0 }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      exit={{ opacity: 0, x: position === 'right' ? 100 : position === 'left' ? -100 : 0, y: position === 'bottom' ? 100 : 0 }}
      className={cn(collaborationPanelVariants({ position, size }))}
      style={{
        zIndex: 50
      }}
    >
      {/* 头部 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            协作工作台
          </h2>
          {collaboration.isConnected && (
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-xs text-green-600 dark:text-green-400">
                在线
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded"
          >
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </button>
          <button
            onClick={onToggleSize}
            className="p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded"
          >
            <Settings className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="flex border-b border-gray-200 dark:border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                tabButtonVariants({ active: activeTab === tab.id }),
                'flex-1 justify-center relative'
              )}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {tab.count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* 内容区域 */}
      <AnimatePresence mode="wait">
        {!isMinimized && (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex-1 overflow-auto"
            style={{ height: isMinimized ? 0 : 'calc(100% - 120px)' }}
          >
            {activeTab === 'real-time' && (
              <div className="p-4">
                {/* 在线用户列表 */}
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                    在线用户 ({collaboration.onlineUsers.length})
                  </h3>
                  <div className="space-y-2">
                    {collaboration.onlineUsers.map((user) => (
                      <div key={user.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-medium"
                          style={{ backgroundColor: user.color }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">
                            {user.status === 'editing' ? '正在编辑...' : '在线'}
                          </div>
                        </div>
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* 连接状态 */}
                {!collaboration.isConnected && (
                  <div className="p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                      <span className="text-sm text-yellow-800 dark:text-yellow-200">
                        正在连接到协作会话...
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'version-control' && (
              <div className="p-4">
                <VersionControl
                  documentId={documentId}
                  userId={userId}
                  onVersionCreated={(version) => console.log('Version created:', version)}
                  onBranchCreated={(branch) => console.log('Branch created:', branch)}
                  onMergeRequested={(mergeRequest) => console.log('Merge request created:', mergeRequest)}
                  onError={(error) => console.error('Version control error:', error)}
                />
              </div>
            )}

            {activeTab === 'sharing' && (
              <div className="p-4">
                <SharingComments
                  documentId={documentId}
                  userId={userId}
                  onLinkCreated={(link) => console.log('Link created:', link)}
                  onCommentAdded={(comment) => console.log('Comment added:', comment)}
                  onLinkAccessed={(linkId, accessInfo) => console.log('Link accessed:', linkId, accessInfo)}
                  onError={(error) => console.error('Sharing error:', error)}
                />
              </div>
            )}

            {activeTab === 'templates' && (
              <div className="p-4">
                <TeamTemplateLibrary
                  organizationId={organizationId}
                  userId={userId}
                  onTemplateSelected={(template) => console.log('Template selected:', template)}
                  onError={(error) => console.error('Template library error:', error)}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// ============================================================================
// 协作工作区主组件
// ============================================================================

export function CollaborationWorkspace({
  documentId,
  userId,
  organizationId,
  initialContent = '',
  className,
  onContentChange,
  onError
}: CollaborationWorkspaceProps) {
  const [showPanel, setShowPanel] = useState(false)
  const [panelPosition, setPanelPosition] = useState<'right' | 'bottom' | 'left'>('right')
  const [panelSize, setPanelSize] = useState<'small' | 'medium' | 'large' | 'fullscreen'>('large')

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

  const handleContentChange = useCallback((content: string, operation?: any) => {
    onContentChange?.(content)
  }, [onContentChange])

  const handleTogglePanel = useCallback(() => {
    setShowPanel(!showPanel)
  }, [showPanel])

  const handleTogglePanelSize = useCallback(() => {
    const sizes: Array<'small' | 'medium' | 'large' | 'fullscreen'> = ['small', 'medium', 'large', 'fullscreen']
    const currentIndex = sizes.indexOf(panelSize)
    const nextIndex = (currentIndex + 1) % sizes.length
    setPanelSize(sizes[nextIndex])
  }, [panelSize])

  const handlePanelPositionChange = useCallback((position: 'right' | 'bottom' | 'left') => {
    setPanelPosition(position)
  }, [])

  return (
    <div className={cn('relative h-full', className)}>
      {/* 主编辑区域 */}
      <div className={cn(
        'transition-all duration-300',
        showPanel && panelPosition === 'right' && 'mr-96',
        showPanel && panelPosition === 'left' && 'ml-96',
        showPanel && panelPosition === 'bottom' && 'mb-96'
      )}>
        <RealTimeEditor
          documentId={documentId}
          userId={userId}
          initialContent={initialContent}
          onContentChange={handleContentChange}
          onUserJoined={(user) => console.log('User joined:', user)}
          onUserLeft={(userId) => console.log('User left:', userId)}
          onConflictDetected={(conflict) => console.log('Conflict detected:', conflict)}
          onCursorMove={(cursor) => console.log('Cursor moved:', cursor)}
          onSelectionChange={(selection) => console.log('Selection changed:', selection)}
        />
      </div>

      {/* 协作面板切换按钮 */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={handleTogglePanel}
          className={cn(
            'flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200',
            showPanel && 'bg-gray-600 hover:bg-gray-700'
          )}
        >
          {showPanel ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span>隐藏协作</span>
            </>
          ) : (
            <>
              <Users className="w-4 h-4" />
              <span>协作面板</span>
              {collaboration.onlineUsers.length > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {collaboration.onlineUsers.length}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* 协作面板 */}
      <AnimatePresence>
        {showPanel && (
          <CollaborationPanelInner
            documentId={documentId}
            userId={userId}
            organizationId={organizationId}
            position={panelPosition}
            size={panelSize}
            isVisible={showPanel}
            onClose={handleTogglePanel}
            onToggleSize={handleTogglePanelSize}
          />
        )}
      </AnimatePresence>

      {/* 快捷操作按钮组 */}
      <div className="fixed bottom-4 left-4 z-40 flex flex-col gap-2">
        <button
          onClick={() => setPanelPosition('right')}
          className={cn(
            'p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200',
            panelPosition === 'right' ? 'ring-2 ring-blue-500' : ''
          )}
          title="右侧面板"
        >
          <div className="w-4 h-4 bg-blue-500 rounded-l" />
        </button>
        <button
          onClick={() => setPanelPosition('bottom')}
          className={cn(
            'p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200',
            panelPosition === 'bottom' ? 'ring-2 ring-blue-500' : ''
          )}
          title="底部面板"
        >
          <div className="w-4 h-1 bg-blue-500 rounded" />
        </button>
        <button
          onClick={() => setPanelPosition('left')}
          className={cn(
            'p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-200',
            panelPosition === 'left' ? 'ring-2 ring-blue-500' : ''
          )}
          title="左侧面板"
        >
          <div className="w-4 h-4 bg-blue-500 rounded-r" />
        </button>
      </div>
    </div>
  )
}

// ============================================================================
// 导出所有组件和hooks
// ============================================================================

export {
  CollaborationWorkspace as default,
  RealTimeEditor,
  VersionControl,
  SharingComments,
  TeamTemplateLibrary,
  useCollaboration,
  useVersionControl,
  useSharing,
  useTemplateLibrary
}

// 导出类型
export type {
  User,
  CollaborationSession,
  EditOperation,
  CursorPosition,
  SelectionRange,
  Version,
  Branch,
  MergeRequest,
  ShareableLink,
  Comment,
  Annotation,
  TeamTemplate,
  ConflictResolution
} from './types'