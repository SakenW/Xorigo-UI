'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils'
import { Share2, Link, Lock, Unlock, Eye, MessageSquare, ThumbsUp, Heart, Laugh, AlertCircle, CheckCircle, Copy, Calendar, Users, Settings, Trash2, Reply, Edit3, Flag } from 'lucide-react'
import { getSharingService, type SharingService } from './services/sharing-service'
import type {
  ShareableLink,
  Comment,
  Annotation,
  UseSharingOptions
} from './types'

// ============================================================================
// 组件变体配置
// ============================================================================

const sharingCardVariants = cva(
  'p-4 rounded-lg border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900',
        active: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
        success: 'border-green-500 bg-green-50 dark:bg-green-950',
        warning: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950',
        error: 'border-red-500 bg-red-50 dark:bg-red-950'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

const commentVariants = cva(
  'p-3 rounded-lg border transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'border-gray-200 dark:border-gray-700',
        resolved: 'border-green-200 bg-green-50 dark:bg-green-950',
        active: 'border-blue-200 bg-blue-50 dark:bg-blue-950'
      },
      isReply: {
        true: 'ml-8 border-l-2 border-gray-300 dark:border-gray-600',
        false: ''
      }
    },
    defaultVariants: {
      variant: 'default',
      isReply: false
    }
  }
)

const annotationVariants = cva(
  'inline-block px-1 rounded transition-all duration-200 cursor-pointer',
  {
    variants: {
      type: {
        highlight: 'bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100',
        note: 'bg-blue-200 dark:bg-blue-800 text-blue-900 dark:text-blue-100',
        suggestion: 'bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100',
        warning: 'bg-orange-200 dark:bg-orange-800 text-orange-900 dark:text-orange-100',
        error: 'bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100'
      }
    }
  }
)

// ============================================================================
// 组件 Props
// ============================================================================

interface SharingCommentsProps {
  documentId: string
  userId: string
  className?: string
  onLinkCreated?: (link: ShareableLink) => void
  onCommentAdded?: (comment: Comment) => void
  onLinkAccessed?: (linkId: string, accessInfo: any) => void
  onError?: (error: any) => void
}

// ============================================================================
// 分享链接管理组件
// ============================================================================

interface ShareLinkManagerProps {
  links: ShareableLink[]
  onLinkCreate: (linkData: any) => void
  onLinkUpdate: (linkId: string, updateData: any) => void
  onLinkDelete: (linkId: string) => void
  onLinkCopy: (link: ShareableLink) => void
}

function ShareLinkManager({ links, onLinkCreate, onLinkUpdate, onLinkDelete, onLinkCopy }: ShareLinkManagerProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newLinkData, setNewLinkData] = useState({
    expiresAt: '',
    maxAccess: '',
    password: '',
    permissions: {
      canView: true,
      canEdit: false,
      canComment: true,
      canDownload: false,
      canShare: false
    }
  })

  const handleCreateLink = () => {
    const linkData = {
      expiresAt: newLinkData.expiresAt ? new Date(newLinkData.expiresAt) : undefined,
      maxAccess: newLinkData.maxAccess ? parseInt(newLinkData.maxAccess) : undefined,
      password: newLinkData.password || undefined,
      permissions: newLinkData.permissions
    }

    onLinkCreate(linkData)
    setNewLinkData({
      expiresAt: '',
      maxAccess: '',
      password: '',
      permissions: {
        canView: true,
        canEdit: false,
        canComment: true,
        canDownload: false,
        canShare: false
      }
    })
    setShowCreateForm(false)
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      // 这里可以显示一个成功提示
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const getShareableUrl = (link: ShareableLink) => {
    return `${window.location.origin}/shared/${link.token}`
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          分享链接
        </h3>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          创建链接
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
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  过期时间（可选）
                </label>
                <input
                  type="datetime-local"
                  value={newLinkData.expiresAt}
                  onChange={(e) => setNewLinkData(prev => ({ ...prev, expiresAt: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  最大访问次数（可选）
                </label>
                <input
                  type="number"
                  value={newLinkData.maxAccess}
                  onChange={(e) => setNewLinkData(prev => ({ ...prev, maxAccess: e.target.value }))}
                  placeholder="无限制"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  密码（可选）
                </label>
                <input
                  type="password"
                  value={newLinkData.password}
                  onChange={(e) => setNewLinkData(prev => ({ ...prev, password: e.target.value }))}
                  placeholder="设置访问密码"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  权限设置
                </label>
                <div className="space-y-2">
                  {Object.entries({
                    canView: '可以查看',
                    canEdit: '可以编辑',
                    canComment: '可以评论',
                    canDownload: '可以下载',
                    canShare: '可以分享'
                  }).map(([key, label]) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={newLinkData.permissions[key as keyof typeof newLinkData.permissions]}
                        onChange={(e) => setNewLinkData(prev => ({
                          ...prev,
                          permissions: {
                            ...prev.permissions,
                            [key]: e.target.checked
                          }
                        }))}
                        className="rounded border-gray-300 dark:border-gray-600"
                      />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreateLink}
                  className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  创建链接
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-2">
        {links.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            暂无分享链接
          </div>
        ) : (
          links.map((link) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(sharingCardVariants({ variant: link.isActive ? 'default' : 'error' }))}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Link className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-gray-900 dark:text-white">
                      分享链接
                    </span>
                    {link.password ? (
                      <Lock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                    ) : (
                      <Unlock className="w-4 h-4 text-green-600 dark:text-green-400" />
                    )}
                    {link.isActive ? (
                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Eye className="w-3 h-3" />
                      <span>{link.accessCount} 次访问</span>
                      {link.maxAccess && (
                        <span>/ {link.maxAccess} 次</span>
                      )}
                    </div>
                    {link.expiresAt && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="w-3 h-3" />
                        <span>过期时间: {link.expiresAt.toLocaleDateString()}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      创建时间: {link.createdAt.toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onLinkCopy(link)}
                    className="p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded"
                    title="复制链接"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {/* 编辑链接 */}}
                    className="p-1 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 rounded"
                    title="编辑"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onLinkDelete(link.id)}
                    className="p-1 text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900 rounded"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
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
// 评论组件
// ============================================================================

interface CommentItemProps {
  comment: Comment
  onReply: (parentId: string, content: string) => void
  onResolve: (commentId: string) => void
  onReact: (commentId: string, emoji: string) => void
  onDelete: (commentId: string) => void
  isReply?: boolean
}

function CommentItem({ comment, onReply, onResolve, onReact, onDelete, isReply = false }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [replyContent, setReplyContent] = useState('')

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent)
      setReplyContent('')
      setShowReplyForm(false)
    }
  }

  const getReactionEmoji = (emoji: string) => {
    const emojiMap: Record<string, string> = {
      thumbsup: '👍',
      heart: '❤️',
      laugh: '😄',
      wow: '😮',
      sad: '😢',
      angry: '😠'
    }
    return emojiMap[emoji] || emoji
  }

  const getReactionCount = (emoji: string) => {
    return comment.reactions.filter(r => r.emoji === emoji).length
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(commentVariants({
        variant: comment.isResolved ? 'resolved' : 'active',
        isReply
      }))}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-blue-600 dark:text-blue-400 text-sm font-medium">
            {comment.author.name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-gray-900 dark:text-white">
              {comment.author.name}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {formatRelativeTime(comment.createdAt)}
            </span>
            {comment.isResolved && (
              <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                已解决
              </span>
            )}
          </div>
          {comment.position && (
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              位置: 第 {comment.position.line + 1} 行, 第 {comment.position.column + 1} 列
            </div>
          )}
          <p className="text-gray-900 dark:text-white mb-2">
            {comment.content}
          </p>

          {/* 标签 */}
          {comment.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {comment.tags.map((tag, index) => (
                <span key={index} className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* 反应 */}
          {comment.reactions.length > 0 && (
            <div className="flex items-center gap-2 mb-2">
              {Array.from(new Set(comment.reactions.map(r => r.emoji))).map(emoji => (
                <button
                  key={emoji}
                  onClick={() => onReact(comment.id, emoji)}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <span>{getReactionEmoji(emoji)}</span>
                  <span>{getReactionCount(emoji)}</span>
                </button>
              ))}
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Reply className="w-3 h-3" />
              回复
            </button>
            {!comment.isResolved && (
              <button
                onClick={() => onResolve(comment.id)}
                className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 transition-colors"
              >
                <CheckCircle className="w-3 h-3" />
                解决
              </button>
            )}
            <div className="flex items-center gap-1">
              {['thumbsup', 'heart', 'laugh'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => onReact(comment.id, emoji)}
                  className="text-sm hover:scale-110 transition-transform"
                  title={getReactionEmoji(emoji)}
                >
                  {getReactionEmoji(emoji)}
                </button>
              ))}
            </div>
            <button
              className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Flag className="w-3 h-3" />
              举报
            </button>
          </div>

          {/* 回复表单 */}
          <AnimatePresence>
            {showReplyForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2"
              >
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="写下你的回复..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none"
                  rows={2}
                />
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleReply}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    回复
                  </button>
                  <button
                    onClick={() => {
                      setShowReplyForm(false)
                      setReplyContent('')
                    }}
                    className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    取消
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* 回复列表 */}
          <AnimatePresence>
            {comment.replies.length > 0 && (
              <div className="mt-3 space-y-2">
                {comment.replies.map((reply) => (
                  <CommentItem
                    key={reply.id}
                    comment={reply}
                    onReply={onReply}
                    onResolve={onResolve}
                    onReact={onReact}
                    onDelete={onDelete}
                    isReply={true}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  )
}

// ============================================================================
// 评论管理组件
// ============================================================================

interface CommentManagerProps {
  comments: Comment[]
  onAddComment: (commentData: any) => void
  onReplyComment: (parentId: string, content: string) => void
  onResolveComment: (commentId: string) => void
  onReactComment: (commentId: string, emoji: string) => void
  onDeleteComment: (commentId: string) => void
}

function CommentManager({
  comments,
  onAddComment,
  onReplyComment,
  onResolveComment,
  onReactComment,
  onDeleteComment
}: CommentManagerProps) {
  const [newCommentContent, setNewCommentContent] = useState('')
  const [selectedPosition, setSelectedPosition] = useState<{ line: number; column: number } | null>(null)

  const handleAddComment = () => {
    if (newCommentContent.trim()) {
      onAddComment({
        content: newCommentContent,
        position: selectedPosition,
        tags: []
      })
      setNewCommentContent('')
      setSelectedPosition(null)
    }
  }

  const handleTextSelection = () => {
    const selection = window.getSelection()
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()
      // 这里可以计算选中文本的行列位置
      setSelectedPosition({ line: 0, column: 0 })
    }
  }

  const topLevelComments = comments.filter(comment => !comment.parentId)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          评论 ({comments.length})
        </h3>
        <button
          onClick={handleTextSelection}
          className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          添加评论
        </button>
      </div>

      {/* 新评论表单 */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900"
      >
        <textarea
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="写下你的评论..."
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none mb-2"
          rows={3}
        />
        {selectedPosition && (
          <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-950 rounded-lg mb-2">
            <span className="text-sm text-blue-700 dark:text-blue-300">
              选中位置: 第 {selectedPosition.line + 1} 行, 第 {selectedPosition.column + 1} 列
            </span>
            <button
              onClick={() => setSelectedPosition(null)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              清除
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <button
            onClick={handleAddComment}
            disabled={!newCommentContent.trim()}
            className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            发布评论
          </button>
          <button
            onClick={() => {
              setNewCommentContent('')
              setSelectedPosition(null)
            }}
            className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
          >
            取消
          </button>
        </div>
      </motion.div>

      {/* 评论列表 */}
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {topLevelComments.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            暂无评论
          </div>
        ) : (
          topLevelComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={onReplyComment}
              onResolve={onResolveComment}
              onReact={onReactComment}
              onDelete={onDeleteComment}
            />
          ))
        )}
      </div>
    </div>
  )
}

// ============================================================================
// 主分享和评论组件
// ============================================================================

export function SharingComments({
  documentId,
  userId,
  className,
  onLinkCreated,
  onCommentAdded,
  onLinkAccessed,
  onError
}: SharingCommentsProps) {
  const [activeTab, setActiveTab] = useState<'sharing' | 'comments' | 'annotations'>('sharing')
  const [shareableLinks, setShareableLinks] = useState<ShareableLink[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [loading, setLoading] = useState(true)

  const sharingServiceRef = useRef<SharingService | null>(null)

  // 初始化分享服务
  useEffect(() => {
    if (!documentId || !userId) return

    const service = getSharingService({
      documentId,
      userId,
      onLinkCreated: (link) => {
        setShareableLinks(prev => [...prev, link])
        onLinkCreated?.(link)
      },
      onCommentAdded: (comment) => {
        setComments(prev => [...prev, comment])
        onCommentAdded?.(comment)
      },
      onLinkAccessed: (linkId, accessInfo) => {
        onLinkAccessed?.(linkId, accessInfo)
      },
      onError: (error) => {
        console.error('Sharing service error:', error)
        onError?.(error)
      }
    })

    sharingServiceRef.current = service

    loadData()
  }, [documentId, userId])

  // 加载数据
  const loadData = useCallback(async () => {
    try {
      setLoading(true)

      const [linksResult, commentsResult, annotationsResult] = await Promise.all([
        sharingServiceRef.current?.getShareableLinks() || { success: false, data: [] },
        sharingServiceRef.current?.getComments() || { success: false, data: [] },
        sharingServiceRef.current?.getAnnotations() || { success: false, data: [] }
      ])

      if (linksResult.success) {
        setShareableLinks(linksResult.data)
      }

      if (commentsResult.success) {
        setComments(commentsResult.data)
      }

      if (annotationsResult.success) {
        setAnnotations(annotationsResult.data)
      }
    } catch (error) {
      console.error('Failed to load sharing data:', error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }, [onError])

  // 处理创建分享链接
  const handleCreateShareLink = useCallback(async (linkData: any) => {
    if (sharingServiceRef.current) {
      const result = await sharingServiceRef.current.createShareableLink(linkData)
      if (result.success) {
        await loadData()
      }
    }
  }, [loadData])

  // 处理复制链接
  const handleCopyShareLink = useCallback(async (link: ShareableLink) => {
    const url = `${window.location.origin}/shared/${link.token}`
    try {
      await navigator.clipboard.writeText(url)
      // 这里可以显示成功提示
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }, [])

  // 处理删除分享链接
  const handleDeleteShareLink = useCallback(async (linkId: string) => {
    if (sharingServiceRef.current) {
      const result = await sharingServiceRef.current.deleteShareableLink(linkId)
      if (result.success) {
        await loadData()
      }
    }
  }, [loadData])

  // 处理添加评论
  const handleAddComment = useCallback(async (commentData: any) => {
    if (sharingServiceRef.current) {
      const result = await sharingServiceRef.current.addComment(commentData)
      if (result.success) {
        await loadData()
      }
    }
  }, [loadData])

  // 处理回复评论
  const handleReplyComment = useCallback(async (parentId: string, content: string) => {
    if (sharingServiceRef.current) {
      const result = await sharingServiceRef.current.addComment({
        content,
        parentId
      })
      if (result.success) {
        await loadData()
      }
    }
  }, [loadData])

  // 处理解决评论
  const handleResolveComment = useCallback(async (commentId: string) => {
    if (sharingServiceRef.current) {
      const result = await sharingServiceRef.current.resolveComment(commentId)
      if (result.success) {
        await loadData()
      }
    }
  }, [loadData])

  // 处理评论反应
  const handleReactComment = useCallback(async (commentId: string, emoji: string) => {
    if (sharingServiceRef.current) {
      const result = await sharingServiceRef.current.addCommentReaction(commentId, emoji)
      if (result.success) {
        await loadData()
      }
    }
  }, [loadData])

  // 处理删除评论
  const handleDeleteComment = useCallback(async (commentId: string) => {
    if (sharingServiceRef.current) {
      const result = await sharingServiceRef.current.deleteComment(commentId)
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
          { key: 'sharing', label: '分享链接', icon: Share2 },
          { key: 'comments', label: '评论', icon: MessageSquare },
          { key: 'annotations', label: '标注', icon: AlertCircle }
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

      {/* 标签页内容 */}
      <AnimatePresence mode="wait">
        {activeTab === 'sharing' && (
          <motion.div
            key="sharing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <ShareLinkManager
              links={shareableLinks}
              onLinkCreate={handleCreateShareLink}
              onLinkUpdate={() => {/* 实现更新逻辑 */}}
              onLinkDelete={handleDeleteShareLink}
              onLinkCopy={handleCopyShareLink}
            />
          </motion.div>
        )}

        {activeTab === 'comments' && (
          <motion.div
            key="comments"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <CommentManager
              comments={comments}
              onAddComment={handleAddComment}
              onReplyComment={handleReplyComment}
              onResolveComment={handleResolveComment}
              onReactComment={handleReactComment}
              onDeleteComment={handleDeleteComment}
            />
          </motion.div>
        )}

        {activeTab === 'annotations' && (
          <motion.div
            key="annotations"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                标注
              </h3>
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                标注功能正在开发中...
              </div>
            </div>
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