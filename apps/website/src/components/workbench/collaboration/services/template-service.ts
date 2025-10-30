/**
 * 团队模板库服务
 * 处理团队模板的上传、管理、分类和使用统计
 */

import type {
  TeamTemplate,
  TemplateLibrary,
  TemplateCategory,
  TemplateRating,
  UseTemplateLibraryOptions,
  ApiResponse
} from '../types'

export class TemplateService {
  private options: UseTemplateLibraryOptions
  private templates: Map<string, TeamTemplate> = new Map()
  private library: TemplateLibrary | null = null

  constructor(options: UseTemplateLibraryOptions) {
    this.options = options
    this.initializeLibrary()
  }

  // 初始化模板库
  private async initializeLibrary(): Promise<void> {
    this.library = {
      id: 'default-library',
      name: '团队模板库',
      description: 'Xorigo UI 团队模板库',
      organizationId: this.options.organizationId || 'default',
      templates: [],
      categories: [
        'layout', 'component', 'pattern', 'business-logic',
        'data-structure', 'styling', 'configuration', 'workflow'
      ],
      tags: [],
      moderators: [],
      settings: {
        allowPublicSubmission: false,
        requireApproval: true,
        enableRating: true,
        enableComments: true,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        allowedFileTypes: ['.ts', '.tsx', '.js', '.jsx', '.json', '.md'],
        defaultPermissions: {
          canUse: true,
          canModify: false,
          canShare: true,
          canDelete: false,
          canApprove: false,
          canComment: true,
          canRate: true
        }
      },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    // 加载默认模板
    await this.loadDefaultTemplates()
  }

  // 加载默认模板
  private async loadDefaultTemplates(): Promise<void> {
    const defaultTemplates: TeamTemplate[] = [
      {
        id: 'responsive-layout',
        name: '响应式布局模板',
        description: '适用于移动端和桌面端的响应式布局组件',
        category: 'layout',
        tags: ['responsive', 'mobile', 'desktop'],
        author: this.getCurrentUser(),
        content: {
          code: `
export function ResponsiveLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  )
}`,
          dependencies: ['react', 'tailwindcss'],
          assets: [],
          configuration: {
            containerWidth: 'max-w-7xl',
            padding: 'px-4 py-8'
          },
          preview: {
            images: [],
            videos: [],
            description: '响应式布局预览',
            interactiveDemo: ''
          }
        },
        metadata: {
          version: '1.0.0',
          compatibility: ['React 18+', 'Tailwind CSS 3+'],
          framework: 'React',
          language: 'TypeScript',
          complexity: 'simple',
          estimatedTime: 15,
          prerequisites: ['React基础知识', 'Tailwind CSS基础'],
          relatedTemplates: ['dashboard-layout', 'sidebar-layout']
        },
        permissions: {
          canUse: true,
          canModify: false,
          canShare: true,
          canDelete: false,
          canApprove: false,
          canComment: true,
          canRate: true
        },
        statistics: {
          views: 156,
          downloads: 89,
          uses: 234,
          ratings: [],
          averageRating: 4.5,
          comments: 12,
          forks: 8,
          lastUsed: new Date()
        },
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        isPublic: true,
        isApproved: true,
        approvedBy: this.getCurrentUser(),
        approvedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        id: 'form-with-validation',
        name: '表单验证模板',
        description: '包含完整验证逻辑的表单组件模板',
        category: 'component',
        tags: ['form', 'validation', 'input'],
        author: this.getCurrentUser(),
        content: {
          code: `
interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'password'
  required: boolean
  validation?: {
    minLength?: number
    pattern?: RegExp
  }
}

export function ValidatedForm({ fields, onSubmit }: {
  fields: FormField[]
  onSubmit: (data: Record<string, string>) => void
}) {
  // 表单验证逻辑
  return <form>...</form>
}`,
          dependencies: ['react', 'zod'],
          assets: [],
          configuration: {
            validationLibrary: 'zod',
            showErrorMessages: true
          },
          preview: {
            images: [],
            videos: [],
            description: '表单验证预览',
            interactiveDemo: ''
          }
        },
        metadata: {
          version: '1.2.0',
          compatibility: ['React 18+', 'Zod 3+'],
          framework: 'React',
          language: 'TypeScript',
          complexity: 'moderate',
          estimatedTime: 30,
          prerequisites: ['React Hooks', 'Zod验证库'],
          relatedTemplates: ['contact-form', 'login-form']
        },
        permissions: {
          canUse: true,
          canModify: false,
          canShare: true,
          canDelete: false,
          canApprove: false,
          canComment: true,
          canRate: true
        },
        statistics: {
          views: 289,
          downloads: 167,
          uses: 445,
          ratings: [],
          averageRating: 4.8,
          comments: 23,
          forks: 15,
          lastUsed: new Date()
        },
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        isPublic: true,
        isApproved: true,
        approvedBy: this.getCurrentUser(),
        approvedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
      }
    ]

    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template)
    })

    if (this.library) {
      this.library.templates = defaultTemplates
    }
  }

  // 创建新模板
  async createTemplate(templateData: {
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
  }): Promise<ApiResponse<TeamTemplate>> {
    try {
      const newTemplate: TeamTemplate = {
        id: this.generateTemplateId(),
        name: templateData.name,
        description: templateData.description,
        category: templateData.category,
        tags: templateData.tags,
        author: this.getCurrentUser(),
        content: {
          code: templateData.content.code,
          dependencies: templateData.content.dependencies,
          assets: [],
          configuration: templateData.content.configuration,
          preview: {
            images: [],
            videos: [],
            description: '',
            interactiveDemo: ''
          }
        },
        metadata: {
          ...templateData.metadata,
          relatedTemplates: []
        },
        permissions: this.library?.settings.defaultPermissions || {
          canUse: true,
          canModify: false,
          canShare: true,
          canDelete: false,
          canApprove: false,
          canComment: true,
          canRate: true
        },
        statistics: {
          views: 0,
          downloads: 0,
          uses: 0,
          ratings: [],
          averageRating: 0,
          comments: 0,
          forks: 0
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
        isApproved: !this.library?.settings.requireApproval
      }

      this.templates.set(newTemplate.id, newTemplate)

      if (this.library) {
        this.library.templates.push(newTemplate)
        this.library.updatedAt = new Date()
      }

      return {
        success: true,
        data: newTemplate,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TEMPLATE_CREATE_ERROR',
          message: 'Failed to create template',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 更新模板
  async updateTemplate(templateId: string, updateData: Partial<{
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
  }>): Promise<ApiResponse<TeamTemplate>> {
    try {
      const template = this.templates.get(templateId)
      if (!template) {
        throw new Error('Template not found')
      }

      const updatedTemplate = {
        ...template,
        ...updateData,
        content: {
          ...template.content,
          ...updateData.content
        },
        metadata: {
          ...template.metadata,
          ...updateData.metadata
        },
        updatedAt: new Date()
      }

      this.templates.set(templateId, updatedTemplate)

      if (this.library) {
        const index = this.library.templates.findIndex(t => t.id === templateId)
        if (index !== -1) {
          this.library.templates[index] = updatedTemplate
          this.library.updatedAt = new Date()
        }
      }

      return {
        success: true,
        data: updatedTemplate,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TEMPLATE_UPDATE_ERROR',
          message: 'Failed to update template',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 删除模板
  async deleteTemplate(templateId: string): Promise<ApiResponse<void>> {
    try {
      const template = this.templates.get(templateId)
      if (!template) {
        throw new Error('Template not found')
      }

      if (!template.permissions.canDelete) {
        throw new Error('No permission to delete this template')
      }

      this.templates.delete(templateId)

      if (this.library) {
        this.library.templates = this.library.templates.filter(t => t.id !== templateId)
        this.library.updatedAt = new Date()
      }

      return {
        success: true,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TEMPLATE_DELETE_ERROR',
          message: 'Failed to delete template',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 搜索模板
  async searchTemplates(searchParams: {
    query?: string
    category?: TemplateCategory
    tags?: string[]
    sortBy?: 'name' | 'created' | 'updated' | 'rating' | 'popularity'
    sortOrder?: 'asc' | 'desc'
    page?: number
    limit?: number
  }): Promise<ApiResponse<{
    templates: TeamTemplate[]
    total: number
    page: number
    totalPages: number
  }>> {
    try {
      let filteredTemplates = Array.from(this.templates.values())

      // 过滤条件
      if (searchParams.query) {
        const query = searchParams.query.toLowerCase()
        filteredTemplates = filteredTemplates.filter(template =>
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }

      if (searchParams.category) {
        filteredTemplates = filteredTemplates.filter(template =>
          template.category === searchParams.category
        )
      }

      if (searchParams.tags && searchParams.tags.length > 0) {
        filteredTemplates = filteredTemplates.filter(template =>
          searchParams.tags!.some(tag => template.tags.includes(tag))
        )
      }

      // 只显示已批准的公共模板或用户自己的模板
      filteredTemplates = filteredTemplates.filter(template =>
        template.isPublic && template.isApproved || template.author.id === this.options.userId
      )

      // 排序
      const sortBy = searchParams.sortBy || 'updated'
      const sortOrder = searchParams.sortOrder || 'desc'

      filteredTemplates.sort((a, b) => {
        let comparison = 0

        switch (sortBy) {
          case 'name':
            comparison = a.name.localeCompare(b.name)
            break
          case 'created':
            comparison = a.createdAt.getTime() - b.createdAt.getTime()
            break
          case 'updated':
            comparison = a.updatedAt.getTime() - b.updatedAt.getTime()
            break
          case 'rating':
            comparison = a.statistics.averageRating - b.statistics.averageRating
            break
          case 'popularity':
            comparison = a.statistics.uses - b.statistics.uses
            break
        }

        return sortOrder === 'asc' ? comparison : -comparison
      })

      // 分页
      const page = searchParams.page || 1
      const limit = searchParams.limit || 20
      const total = filteredTemplates.length
      const totalPages = Math.ceil(total / limit)
      const startIndex = (page - 1) * limit
      const endIndex = startIndex + limit

      const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex)

      return {
        success: true,
        data: {
          templates: paginatedTemplates,
          total,
          page,
          totalPages
        },
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TEMPLATE_SEARCH_ERROR',
          message: 'Failed to search templates',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 评分模板
  async rateTemplate(templateId: string, rating: number, review?: string): Promise<ApiResponse<TeamTemplate>> {
    try {
      const template = this.templates.get(templateId)
      if (!template) {
        throw new Error('Template not found')
      }

      if (!template.permissions.canRate) {
        throw new Error('No permission to rate this template')
      }

      if (rating < 1 || rating > 5) {
        throw new Error('Rating must be between 1 and 5')
      }

      // 检查用户是否已经评分过
      const existingRatingIndex = template.statistics.ratings.findIndex(
        r => r.userId === this.options.userId
      )

      const newRating: TemplateRating = {
        userId: this.options.userId,
        rating,
        review,
        createdAt: new Date()
      }

      if (existingRatingIndex !== -1) {
        // 更新现有评分
        template.statistics.ratings[existingRatingIndex] = newRating
      } else {
        // 添加新评分
        template.statistics.ratings.push(newRating)
      }

      // 重新计算平均评分
      const totalRating = template.statistics.ratings.reduce((sum, r) => sum + r.rating, 0)
      template.statistics.averageRating = totalRating / template.statistics.ratings.length

      this.templates.set(templateId, template)

      return {
        success: true,
        data: template,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TEMPLATE_RATE_ERROR',
          message: 'Failed to rate template',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 使用模板
  async useTemplate(templateId: string): Promise<ApiResponse<TeamTemplate>> {
    try {
      const template = this.templates.get(templateId)
      if (!template) {
        throw new Error('Template not found')
      }

      if (!template.permissions.canUse) {
        throw new Error('No permission to use this template')
      }

      // 更新使用统计
      template.statistics.uses++
      template.statistics.lastUsed = new Date()

      this.templates.set(templateId, template)

      this.options.onTemplateSelected?.(template)

      return {
        success: true,
        data: template,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TEMPLATE_USE_ERROR',
          message: 'Failed to use template',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 批准模板
  async approveTemplate(templateId: string): Promise<ApiResponse<TeamTemplate>> {
    try {
      const template = this.templates.get(templateId)
      if (!template) {
        throw new Error('Template not found')
      }

      if (!template.permissions.canApprove) {
        throw new Error('No permission to approve this template')
      }

      template.isApproved = true
      template.approvedBy = this.getCurrentUser()
      template.approvedAt = new Date()

      this.templates.set(templateId, template)

      return {
        success: true,
        data: template,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TEMPLATE_APPROVE_ERROR',
          message: 'Failed to approve template',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 获取模板分类统计
  async getCategoryStats(): Promise<ApiResponse<Record<TemplateCategory, number>>> {
    try {
      const stats: Record<string, number> = {}

      this.library?.categories.forEach(category => {
        stats[category] = this.templates.size
      })

      Array.from(this.templates.values()).forEach(template => {
        if (template.isPublic && template.isApproved) {
          stats[template.category] = (stats[template.category] || 0) + 1
        }
      })

      return {
        success: true,
        data: stats as Record<TemplateCategory, number>,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'CATEGORY_STATS_ERROR',
          message: 'Failed to get category statistics',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 获取热门模板
  async getPopularTemplates(limit = 10): Promise<ApiResponse<TeamTemplate[]>> {
    try {
      const templates = Array.from(this.templates.values())
        .filter(template => template.isPublic && template.isApproved)
        .sort((a, b) => b.statistics.uses - a.statistics.uses)
        .slice(0, limit)

      return {
        success: true,
        data: templates,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'POPULAR_TEMPLATES_ERROR',
          message: 'Failed to get popular templates',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }

  // 工具方法

  private getCurrentUser(): any {
    return {
      id: this.options.userId || 'current-user',
      name: 'Current User',
      email: 'user@example.com',
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
    }
  }

  private generateTemplateId(): string {
    return `template-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // 公共API方法

  async getTemplate(templateId: string): Promise<TeamTemplate | null> {
    return this.templates.get(templateId) || null
  }

  async getLibrary(): Promise<TemplateLibrary | null> {
    return this.library
  }

  async getAllTemplates(): Promise<TeamTemplate[]> {
    return Array.from(this.templates.values())
  }

  async getMyTemplates(): Promise<TeamTemplate[]> {
    return Array.from(this.templates.values()).filter(
      template => template.author.id === this.options.userId
    )
  }

  async getPendingTemplates(): Promise<TeamTemplate[]> {
    return Array.from(this.templates.values()).filter(
      template => !template.isApproved && template.isPublic
    )
  }

  async duplicateTemplate(templateId: string, newName?: string): Promise<ApiResponse<TeamTemplate>> {
    try {
      const originalTemplate = this.templates.get(templateId)
      if (!originalTemplate) {
        throw new Error('Template not found')
      }

      const duplicatedTemplate: TeamTemplate = {
        ...originalTemplate,
        id: this.generateTemplateId(),
        name: newName || `${originalTemplate.name} (副本)`,
        author: this.getCurrentUser(),
        createdAt: new Date(),
        updatedAt: new Date(),
        isPublic: false,
        isApproved: false,
        statistics: {
          views: 0,
          downloads: 0,
          uses: 0,
          ratings: [],
          averageRating: 0,
          comments: 0,
          forks: 0
        }
      }

      this.templates.set(duplicatedTemplate.id, duplicatedTemplate)

      if (this.library) {
        this.library.templates.push(duplicatedTemplate)
        this.library.updatedAt = new Date()
      }

      return {
        success: true,
        data: duplicatedTemplate,
        timestamp: new Date()
      }
    } catch (error) {
      return {
        success: false,
        error: {
          code: 'TEMPLATE_DUPLICATE_ERROR',
          message: 'Failed to duplicate template',
          details: { error }
        },
        timestamp: new Date()
      }
    }
  }
}

// 导出单例实例
let templateServiceInstance: TemplateService | null = null

export function getTemplateService(options: UseTemplateLibraryOptions): TemplateService {
  const serviceKey = `${options.organizationId || 'default'}-${options.userId}`

  if (!templateServiceInstance || templateServiceInstance['organizationId'] !== options.organizationId) {
    templateServiceInstance = new TemplateService(options)
    templateServiceInstance['organizationId'] = options.organizationId
  }

  return templateServiceInstance
}