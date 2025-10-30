/**
 * 团队模板库 Hook
 * 提供模板搜索、使用和管理功能
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import { getTemplateService, type TemplateService } from '../services/template-service'
import type {
  TeamTemplate,
  TemplateCategory,
  TemplateLibrary,
  UseTemplateLibraryOptions
} from '../types'

export interface UseTemplateLibraryReturn {
  // 状态
  templates: TeamTemplate[]
  library: TemplateLibrary | null
  loading: boolean
  error: string | null
  totalPages: number
  currentPage: number
  totalResults: number

  // 搜索和筛选
  searchTemplates: (params: {
    query?: string
    category?: TemplateCategory
    tags?: string[]
    sortBy?: 'name' | 'created' | 'updated' | 'rating' | 'popularity'
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
  }) => Promise<void>

  // 模板操作
  createTemplate: (data: {
    name: string
    description: string
    category: TemplateCategory
    tags: string[]
    content: {
      code: string
      dependencies: string[]
      configuration: Record<string, any>
    }
    metadata: {
      version: string
      compatibility: string[]
      framework: string
      language: string
      complexity: 'simple' | 'moderate' | 'complex'
      estimatedTime: number
      prerequisites: string[]
    }
  }) => Promise<TeamTemplate | null>
  updateTemplate: (templateId: string, data: Partial<{
    name: string
    description: string
    tags: string[]
    content: {
      code: string
      dependencies: string[]
      configuration: Record<string, any>
    }
    metadata: {
      version: string
      compatibility: string[]
      complexity: 'simple' | 'moderate' | 'complex'
      estimatedTime: number
      prerequisites: string[]
    }
  }>) => Promise<TeamTemplate | null>
  deleteTemplate: (templateId: string) => Promise<void>
  useTemplate: (templateId: string) => Promise<TeamTemplate | null>
  rateTemplate: (templateId: string, rating: number, review?: string) => Promise<TeamTemplate | null>
  duplicateTemplate: (templateId: string, newName?: string) => Promise<TeamTemplate | null>
  approveTemplate: (templateId: string) => Promise<TeamTemplate | null>

  // 分类和统计
  getCategoryStats: () => Promise<Record<TemplateCategory, number>>
  getPopularTemplates: (limit?: number) => Promise<TeamTemplate[]>
  getMyTemplates: () => Promise<TeamTemplate[]>
  getPendingTemplates: () => Promise<TeamTemplate[]>

  // 工具方法
  getTemplateById: (templateId: string) => TeamTemplate | null
  refreshData: () => Promise<void>
}

export function useTemplateLibrary(options: UseTemplateLibraryOptions): UseTemplateLibraryReturn {
  const [templates, setTemplates] = useState<TeamTemplate[]>([])
  const [library, setLibrary] = useState<TemplateLibrary | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalResults, setTotalResults] = useState(0)

  const serviceRef = useRef<TemplateService | null>(null)

  // 初始化服务
  useEffect(() => {
    if (!options.userId) return

    const service = getTemplateService({
      ...options,
      onError: (error) => {
        setError(error.message)
        options.onError?.(error)
      }
    })

    serviceRef.current = service

    loadLibraryData()

    return () => {
      // 清理服务实例
    }
  }, [options])

  // 加载库数据
  const loadLibraryData = useCallback(async () => {
    if (!serviceRef.current) return

    try {
      const libraryData = await serviceRef.current.getLibrary()
      setLibrary(libraryData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load library data')
    }
  }, [])

  // 搜索模板
  const searchTemplates = useCallback(async (params: {
    query?: string
    category?: TemplateCategory
    tags?: string[]
    sortBy?: 'name' | 'created' | 'updated' | 'rating' | 'popularity'
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
  }) => {
    if (!serviceRef.current) return

    setLoading(true)
    setError(null)

    try {
      const result = await serviceRef.current.searchTemplates({
        query: params.query || options.searchQuery || '',
        category: params.category || options.categories?.[0],
        tags: params.tags || options.tags || [],
        sortBy: params.sortBy || options.sortBy || 'updated',
        sortOrder: params.sortOrder || options.sortOrder || 'desc',
        page: params.page || 1,
        limit: params.limit || 20
      })

      if (result.success && result.data) {
        setTemplates(result.data.templates)
        setTotalPages(result.data.totalPages)
        setCurrentPage(result.data.page)
        setTotalResults(result.data.total)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to search templates')
    } finally {
      setLoading(false)
    }
  }, [options])

  // 创建模板
  const createTemplate = useCallback(async (data: {
    name: string
    description: string
    category: TemplateCategory
    tags: string[]
    content: {
      code: string
      dependencies: string[]
      configuration: Record<string, any>
    }
    metadata: {
      version: string
      compatibility: string[]
      framework: string
      language: string
      complexity: 'simple' | 'moderate' | 'complex'
      estimatedTime: number
      prerequisites: string[]
    }
  }): Promise<TeamTemplate | null> => {
    if (!serviceRef.current) return null

    try {
      const result = await serviceRef.current.createTemplate(data)
      if (result.success && result.data) {
        setTemplates(prev => [result.data!, ...prev])
        options.onTemplateSelected?.(result.data)
        return result.data
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create template')
      return null
    }
  }, [options])

  // 更新模板
  const updateTemplate = useCallback(async (templateId: string, data: Partial<{
    name: string
    description: string
    tags: string[]
    content: {
      code: string
      dependencies: string[]
      configuration: Record<string, any>
    }
    metadata: {
      version: string
      compatibility: string[]
      complexity: 'simple' | 'moderate' | 'complex'
      estimatedTime: number
      prerequisites: string[]
    }
  }>): Promise<TeamTemplate | null> => {
    if (!serviceRef.current) return null

    try {
      const result = await serviceRef.current.updateTemplate(templateId, data)
      if (result.success && result.data) {
        setTemplates(prev => prev.map(template =>
          template.id === templateId ? result.data! : template
        ))
        return result.data
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update template')
      return null
    }
  }, [])

  // 删除模板
  const deleteTemplate = useCallback(async (templateId: string) => {
    if (!serviceRef.current) return

    try {
      const result = await serviceRef.current.deleteTemplate(templateId)
      if (result.success) {
        setTemplates(prev => prev.filter(template => template.id !== templateId))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete template')
    }
  }, [])

  // 使用模板
  const useTemplate = useCallback(async (templateId: string): Promise<TeamTemplate | null> => {
    if (!serviceRef.current) return null

    try {
      const result = await serviceRef.current.useTemplate(templateId)
      if (result.success && result.data) {
        setTemplates(prev => prev.map(template =>
          template.id === templateId ? result.data! : template
        ))
        options.onTemplateSelected?.(result.data)
        return result.data
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to use template')
      return null
    }
  }, [options])

  // 评分模板
  const rateTemplate = useCallback(async (templateId: string, rating: number, review?: string): Promise<TeamTemplate | null> => {
    if (!serviceRef.current) return null

    try {
      const result = await serviceRef.current.rateTemplate(templateId, rating, review)
      if (result.success && result.data) {
        setTemplates(prev => prev.map(template =>
          template.id === templateId ? result.data! : template
        ))
        return result.data
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to rate template')
      return null
    }
  }, [])

  // 复制模板
  const duplicateTemplate = useCallback(async (templateId: string, newName?: string): Promise<TeamTemplate | null> => {
    if (!serviceRef.current) return null

    try {
      const result = await serviceRef.current.duplicateTemplate(templateId, newName)
      if (result.success && result.data) {
        setTemplates(prev => [result.data!, ...prev])
        return result.data
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to duplicate template')
      return null
    }
  }, [])

  // 批准模板
  const approveTemplate = useCallback(async (templateId: string): Promise<TeamTemplate | null> => {
    if (!serviceRef.current) return null

    try {
      const result = await serviceRef.current.approveTemplate(templateId)
      if (result.success && result.data) {
        setTemplates(prev => prev.map(template =>
          template.id === templateId ? result.data! : template
        ))
        return result.data
      }
      return null
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve template')
      return null
    }
  }, [])

  // 获取分类统计
  const getCategoryStats = useCallback(async (): Promise<Record<TemplateCategory, number>> => {
    if (!serviceRef.current) return {} as Record<TemplateCategory, number>

    try {
      const result = await serviceRef.current.getCategoryStats()
      return result.success ? result.data : {} as Record<TemplateCategory, number>
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get category stats')
      return {} as Record<TemplateCategory, number>
    }
  }, [])

  // 获取热门模板
  const getPopularTemplates = useCallback(async (limit = 10): Promise<TeamTemplate[]> => {
    if (!serviceRef.current) return []

    try {
      const result = await serviceRef.current.getPopularTemplates(limit)
      return result.success ? result.data : []
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get popular templates')
      return []
    }
  }, [])

  // 获取我的模板
  const getMyTemplates = useCallback(async (): Promise<TeamTemplate[]> => {
    if (!serviceRef.current) return []

    try {
      const templates = await serviceRef.current.getMyTemplates()
      return templates
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get my templates')
      return []
    }
  }, [])

  // 获取待审核模板
  const getPendingTemplates = useCallback(async (): Promise<TeamTemplate[]> => {
    if (!serviceRef.current) return []

    try {
      const templates = await serviceRef.current.getPendingTemplates()
      return templates
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get pending templates')
      return []
    }
  }, [])

  // 工具方法
  const getTemplateById = useCallback((templateId: string): TeamTemplate | null => {
    return templates.find(template => template.id === templateId) || null
  }, [templates])

  const refreshData = useCallback(async () => {
    await searchTemplates({})
    await loadLibraryData()
  }, [searchTemplates, loadLibraryData])

  return {
    templates,
    library,
    loading,
    error,
    totalPages,
    currentPage,
    totalResults,
    searchTemplates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    useTemplate,
    rateTemplate,
    duplicateTemplate,
    approveTemplate,
    getCategoryStats,
    getPopularTemplates,
    getMyTemplates,
    getPendingTemplates,
    getTemplateById,
    refreshData
  }
}