/**
 * 分享和评论 Hook
 * 提供文档分享、链接管理和评论功能
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getSharingService, type SharingService } from '../services/sharing-service'
import type {
  ShareableLink,
  Comment,
  Annotation,
  UseSharingOptions
} from '../types'

export interface UseSharingReturn {
  // 状态
  shareableLinks: ShareableLink[]
  comments: Comment[]
  annotations: Annotation[]
  loading: boolean
  error: string | null

  // 分享链接操作
  createShareableLink: (data: {
    expiresAt?: Date
    maxAccess?: number
    password?: string
    permissions: Partial<ShareableLink['permissions']>
  }) => Promise<ShareableLink | null>
  updateShareableLink: (linkId: string, data: {
    expiresAt?: Date
    maxAccess?: number
    isActive?: boolean
    permissions?: Partial<ShareableLink['permissions']>
  }) => Promise<ShareableLink | null>
  deleteShareableLink: (linkId: string) => Promise<void>
  copyShareableLink: (link: ShareableLink) => Promise<void>

  // 评论操作
  addComment: (data: {
    content: string
    position?: { line: number; column: number }
    selection?: {
      start: { line: number; column: number }
      end: { line: number; column: number }
    }
    parentId?: string
    tags?: string[]
  }) => Promise<Comment | null>
  resolveComment: (commentId: string) => Promise<void>
  deleteComment: (commentId: string) => Promise<void>
  addCommentReaction: (commentId: string, emoji: string) => Promise<void>

  // 标注操作
  addAnnotation: (data: {
    type: 'highlight' | 'note' | 'suggestion' | 'warning' | 'error'
    content: string
    position: { line: number; column: number }
    selection?: {
      start: { line: number; column: number }
      end: { line: number; column: number }
    }
    style?: {
      color: string
      backgroundColor?: string
      borderColor?: string
    }
    isPublic?: boolean
  }) => Promise<Annotation | null>
  deleteAnnotation: (annotationId: string) => Promise<void>

  // 数据操作
  refreshData: () => Promise<void>
  getCommentById: (commentId: string) => Comment | null
  getAnnotationById: (annotationId: string) => Annotation | null
}

export function useSharing(options: UseSharingOptions): UseSharingReturn {
  const [shareableLinks, setShareableLinks] = useState<ShareableLink[]>([])
  const [comments, setComments] = useState<Comment[]>([])
  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const serviceRef = useRef<SharingService | null>(null)

  // 初始化服务
  useEffect(() => {
    if (!options.documentId || !options.userId) return

    const service = getSharingService({
      ...options,
      onError: (error) => {
        setError(error.message)
        options.onError?.(error)
      }
    })

    serviceRef.current = service

    loadData()

    return () => {
      // 清理服务实例
    }
  }, [options])

  // 加载数据
  const loadData = useCallback(async () => {
    if (!serviceRef.current) return

    setLoading(true)
    setError(null)

    try {
      const [linksResult, commentsResult, annotationsResult] = await Promise.all([
        serviceRef.current.getShareableLinks(),
        serviceRef.current.getComments(),
        serviceRef.current.getAnnotations()
      ])

      setShareableLinks(linksResult.success ? linksResult.data : [])
      setComments(commentsResult.success ? commentsResult.data : [])
      setAnnotations(annotationsResult.success ? annotationsResult.data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  // 创建分享链接
  const createShareableLink = useCallback(async (data: {
    expiresAt?: Date
    maxAccess?: number
    password?: string
    permissions: Partial<ShareableLink['permissions']>
  }): Promise<ShareableLink | null> => {
    if (!serviceRef.current) return null

    try {
      const result = await serviceRef.current.createShareableLink(data)
      if (result.success && result.data) {
        setShareableLinks(prev => [...prev, result.data!])
        return result.data
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create shareable link')
      return null
    }
  }, [])

  // 更新分享链接
  const updateShareableLink = useCallback(async (linkId: string, data: {
    expiresAt?: Date
    maxAccess?: number
    isActive?: boolean
    permissions?: Partial<ShareableLink['permissions']>
  }): Promise<ShareableLink | null> => {
    if (!serviceRef.current) return null

    try {
      const result = await serviceRef.current.updateShareableLink(linkId, data)
      if (result.success && result.data) {
        setShareableLinks(prev => prev.map(link =>
          link.id === linkId ? result.data! : link
        ))
        return result.data
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update shareable link')
      return null
    }
  }, [])

  // 删除分享链接
  const deleteShareableLink = useCallback(async (linkId: string) => {
    if (!serviceRef.current) return

    try {
      const result = await serviceRef.current.deleteShareableLink(linkId)
      if (result.success) {
        setShareableLinks(prev => prev.filter(link => link.id !== linkId))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete shareable link')
    }
  }, [])

  // 复制分享链接
  const copyShareableLink = useCallback(async (link: ShareableLink) => {
    const url = `${window.location.origin}/shared/${link.token}`
    try {
      await navigator.clipboard.writeText(url)
      // 这里可以显示成功提示
    } catch (err) {
      setError('Failed to copy link to clipboard')
    }
  }, [])

  // 添加评论
  const addComment = useCallback(async (data: {
    content: string
    position?: { line: number; column: number }
    selection?: {
      start: { line: number; column: number }
      end: { line: number; column: number }
    }
    parentId?: string
    tags?: string[]
  }): Promise<Comment | null> => {
    if (!serviceRef.current) return null

    try {
      const result = await serviceRef.current.addComment(data)
      if (result.success && result.data) {
        setComments(prev => [...prev, result.data!])
        return result.data
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment')
      return null
    }
  }, [])

  // 解决评论
  const resolveComment = useCallback(async (commentId: string) => {
    if (!serviceRef.current) return

    try {
      const result = await serviceRef.current.resolveComment(commentId)
      if (result.success && result.data) {
        setComments(prev => {
          const updateCommentRecursive = (comments: Comment[]): Comment[] => {
            return comments.map(comment => {
              if (comment.id === commentId) {
                return result.data!
              }
              if (comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: updateCommentRecursive(comment.replies)
                }
              }
              return comment
            })
          }
          return updateCommentRecursive(prev)
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resolve comment')
    }
  }, [])

  // 删除评论
  const deleteComment = useCallback(async (commentId: string) => {
    if (!serviceRef.current) return

    try {
      const result = await serviceRef.current.deleteComment(commentId)
      if (result.success) {
        setComments(prev => {
          const removeCommentRecursive = (comments: Comment[]): Comment[] => {
            return comments.filter(comment => {
              if (comment.id === commentId) {
                return false
              }
              if (comment.replies.length > 0) {
                comment.replies = removeCommentRecursive(comment.replies)
              }
              return true
            })
          }
          return removeCommentRecursive(prev)
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete comment')
    }
  }, [])

  // 添加评论反应
  const addCommentReaction = useCallback(async (commentId: string, emoji: string) => {
    if (!serviceRef.current) return

    try {
      const result = await serviceRef.current.addCommentReaction(commentId, emoji)
      if (result.success && result.data) {
        setComments(prev => {
          const updateCommentRecursive = (comments: Comment[]): Comment[] => {
            return comments.map(comment => {
              if (comment.id === commentId) {
                return result.data!
              }
              if (comment.replies.length > 0) {
                return {
                  ...comment,
                  replies: updateCommentRecursive(comment.replies)
                }
              }
              return comment
            })
          }
          return updateCommentRecursive(prev)
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add comment reaction')
    }
  }, [])

  // 添加标注
  const addAnnotation = useCallback(async (data: {
    type: 'highlight' | 'note' | 'suggestion' | 'warning' | 'error'
    content: string
    position: { line: number; column: number }
    selection?: {
      start: { line: number; column: number }
      end: { line: number; column: number }
    }
    style?: {
      color: string
      backgroundColor?: string
      borderColor?: string
    }
    isPublic?: boolean
  }): Promise<Annotation | null> => {
    if (!serviceRef.current) return null

    try {
      const result = await serviceRef.current.addAnnotation(data)
      if (result.success && result.data) {
        setAnnotations(prev => [...prev, result.data!])
        return result.data
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add annotation')
      return null
    }
  }, [])

  // 删除标注
  const deleteAnnotation = useCallback(async (annotationId: string) => {
    if (!serviceRef.current) return

    try {
      const result = await serviceRef.current.deleteAnnotation(annotationId)
      if (result.success) {
        setAnnotations(prev => prev.filter(annotation => annotation.id !== annotationId))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete annotation')
    }
  }, [])

  // 刷新数据
  const refreshData = useCallback(async () => {
    await loadData()
  }, [loadData])

  // 工具方法
  const getCommentById = useCallback((commentId: string): Comment | null => {
    const findCommentRecursive = (comments: Comment[]): Comment | null => {
      for (const comment of comments) {
        if (comment.id === commentId) {
          return comment
        }
        const found = findCommentRecursive(comment.replies)
        if (found) {
          return found
        }
      }
      return null
    }
    return findCommentRecursive(comments)
  }, [comments])

  const getAnnotationById = useCallback((annotationId: string): Annotation | null => {
    return annotations.find(annotation => annotation.id === annotationId) || null
  }, [annotations])

  return {
    shareableLinks,
    comments,
    annotations,
    loading,
    error,
    createShareableLink,
    updateShareableLink,
    deleteShareableLink,
    copyShareableLink,
    addComment,
    resolveComment,
    deleteComment,
    addCommentReaction,
    addAnnotation,
    deleteAnnotation,
    refreshData,
    getCommentById,
    getAnnotationById
  }
}