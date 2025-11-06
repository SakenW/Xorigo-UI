/**
 * Xorigo UI Team - Template Library
 *
 * Manages team template libraries with version control,
 * categorization, and sharing capabilities.
 */

import { nanoid } from 'nanoid'
import { z } from 'zod'
import {
  Template,
  TemplateVersion,
  TemplateCategory,
  TemplateTag,
  TemplateSearchOptions,
  TemplateSearchResult,
  TemplateUsage,
  TemplateStats,
  Team,
  TeamMember
} from './types'
import { formatTimestamp, calculateDistance } from './utils'

// Validation schemas
const TemplateSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  category: z.enum(['dashboard', 'landing-page', 'form', 'email', 'document', 'presentation', 'custom']),
  tags: z.array(z.object({
    id: z.string(),
    name: z.string(),
    color: z.string().optional()
  })),
  currentVersion: z.string(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().optional()
  }),
  isPublic: z.boolean(),
  isFeatured: z.boolean()
})

const TemplateSearchOptionsSchema = z.object({
  query: z.string().optional(),
  category: z.enum(['dashboard', 'landing-page', 'form', 'email', 'document', 'presentation', 'custom']).optional(),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  teamId: z.string().optional(),
  isPublic: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
  minRating: z.number().min(0).max(5).optional(),
  sortBy: z.enum(['name', 'createdAt', 'updatedAt', 'usageCount', 'rating']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional()
})

// In-memory storage (replace with database in production)
const templatesStore = new Map<string, Template>()
const tagsStore = new Map<string, TemplateTag>()
const usagesStore = new Map<string, TemplateUsage[]>()

/**
 * Template Library Manager
 *
 * Features:
 * - Template CRUD operations with versioning
 * - Full-text search and filtering
 * - Team-based access control
 * - Usage analytics and statistics
 * - Template import/export
 */
export class TemplateLibrary {
  private teamId?: string

  constructor(teamId?: string) {
    this.teamId = teamId
    this.initializeDefaultTags()
  }

  private initializeDefaultTags(): void {
    const defaultTags = [
      { name: 'React', color: '#61DAFB' },
      { name: 'Vue', color: '#4FC08D' },
      { name: 'Angular', color: '#DD0031' },
      { name: 'Mobile', color: '#FF6B6B' },
      { name: 'Desktop', color: '#4ECDC4' },
      { name: 'E-commerce', color: '#45B7D1' },
      { name: 'SaaS', color: '#FFA07A' },
      { name: 'Marketing', color: '#98D8C8' },
      { name: 'Enterprise', color: '#F7DC6F' },
      { name: 'Open Source', color: '#BB8FCE' }
    ]

    defaultTags.forEach(tag => {
      const tagId = nanoid(8)
      tagsStore.set(tagId, { id: tagId, ...tag })
    })
  }

  /**
   * Create a new template
   */
  async create(
    data: Omit<Template, 'id' | 'versions' | 'currentVersion' | 'usageCount' | 'rating' | 'ratingsCount' | 'createdAt' | 'updatedAt'>,
    content: unknown
  ): Promise<Template> {
    const now = Date.now()
    const templateId = nanoid(16)

    // Validate input
    const validatedData = TemplateSchema.parse({
      ...data,
      id: templateId
    })

    // Create initial version
    const initialVersion: TemplateVersion = {
      version: '1.0.0',
      createdAt: now,
      createdBy: data.author.id,
      content,
      preview: typeof content === 'string' ? content.substring(0, 500) : undefined
    }

    const template: Template = {
      ...validatedData,
      versions: [initialVersion],
      currentVersion: '1.0.0',
      usageCount: 0,
      rating: 0,
      ratingsCount: 0,
      createdAt: now,
      updatedAt: now
    }

    templatesStore.set(templateId, template)
    return template
  }

  /**
   * Get template by ID
   */
  async get(templateId: string): Promise<Template | null> {
    return templatesStore.get(templateId) || null
  }

  /**
   * Update template
   */
  async update(
    templateId: string,
    updates: Partial<Omit<Template, 'id' | 'versions' | 'author' | 'createdAt' | 'usageCount' | 'rating' | 'ratingsCount'>>
  ): Promise<Template> {
    const template = templatesStore.get(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }

    // Check permissions
    // In production, verify user has edit permissions

    const updatedTemplate: Template = {
      ...template,
      ...updates,
      updatedAt: Date.now()
    }

    templatesStore.set(templateId, updatedTemplate)
    return updatedTemplate
  }

  /**
   * Delete template
   */
  async delete(templateId: string): Promise<boolean> {
    const template = templatesStore.get(templateId)
    if (!template) {
      return false
    }

    // Check permissions
    // In production, verify user has delete permissions

    templatesStore.delete(templateId)

    // Delete usage records
    usagesStore.delete(templateId)

    return true
  }

  /**
   * Add new version to template
   */
  async addVersion(
    templateId: string,
    content: unknown,
    version: string,
    changelog?: string
  ): Promise<TemplateVersion> {
    const template = templatesStore.get(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }

    // Check if version already exists
    if (template.versions.some(v => v.version === version)) {
      throw new Error(`Version ${version} already exists`)
    }

    const newVersion: TemplateVersion = {
      version,
      createdAt: Date.now(),
      createdBy: 'current_user', // In production, get from auth context
      changelog,
      content,
      preview: typeof content === 'string' ? content.substring(0, 500) : undefined
    }

    template.versions.push(newVersion)
    template.currentVersion = version
    template.updatedAt = Date.now()

    templatesStore.set(templateId, template)
    return newVersion
  }

  /**
   * Get specific version
   */
  async getVersion(templateId: string, version: string): Promise<TemplateVersion | null> {
    const template = templatesStore.get(templateId)
    if (!template) return null

    return template.versions.find(v => v.version === version) || null
  }

  /**
   * Search templates
   */
  async search(options: TemplateSearchOptions): Promise<TemplateSearchResult> {
    const validatedOptions = TemplateSearchOptionsSchema.parse(options)

    let filtered = Array.from(templatesStore.values())

    // Apply filters
    if (validatedOptions.query) {
      const query = validatedOptions.query.toLowerCase()
      filtered = filtered.filter(t =>
        t.name.toLowerCase().includes(query) ||
        t.description.toLowerCase().includes(query)
      )
    }

    if (validatedOptions.category) {
      filtered = filtered.filter(t => t.category === validatedOptions.category)
    }

    if (validatedOptions.tags && validatedOptions.tags.length > 0) {
      filtered = filtered.filter(t =>
        validatedOptions.tags!.some(tagId => t.tags.some(t => t.id === tagId))
      )
    }

    if (validatedOptions.author) {
      filtered = filtered.filter(t => t.author.id === validatedOptions.author)
    }

    if (validatedOptions.teamId) {
      filtered = filtered.filter(t => t.teamId === validatedOptions.teamId)
    }

    if (validatedOptions.isPublic !== undefined) {
      filtered = filtered.filter(t => t.isPublic === validatedOptions.isPublic)
    }

    if (validatedOptions.isFeatured !== undefined) {
      filtered = filtered.filter(t => t.isFeatured === validatedOptions.isFeatured)
    }

    if (validatedOptions.minRating !== undefined) {
      filtered = filtered.filter(t => t.rating >= validatedOptions.minRating!)
    }

    // Apply sorting
    const sortBy = validatedOptions.sortBy || 'updatedAt'
    const sortOrder = validatedOptions.sortOrder || 'desc'

    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'createdAt':
          comparison = a.createdAt - b.createdAt
          break
        case 'updatedAt':
          comparison = a.updatedAt - b.updatedAt
          break
        case 'usageCount':
          comparison = a.usageCount - b.usageCount
          break
        case 'rating':
          comparison = a.rating - b.rating
          break
      }

      return sortOrder === 'desc' ? -comparison : comparison
    })

    // Apply pagination
    const offset = validatedOptions.offset || 0
    const limit = validatedOptions.limit || 20
    const total = filtered.length
    const hasMore = offset + limit < total
    const templates = filtered.slice(offset, offset + limit)

    return {
      templates,
      total,
      hasMore
    }
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<TemplateCategory[]> {
    return ['dashboard', 'landing-page', 'form', 'email', 'document', 'presentation', 'custom']
  }

  /**
   * Get all tags
   */
  async getTags(): Promise<TemplateTag[]> {
    return Array.from(tagsStore.values())
  }

  /**
   * Track template usage
   */
  async trackUsage(templateId: string, userId: string, metadata?: Record<string, unknown>): Promise<void> {
    const template = templatesStore.get(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }

    // Increment usage count
    template.usageCount++
    templatesStore.set(templateId, template)

    // Record usage
    const usage: TemplateUsage = {
      id: nanoid(16),
      templateId,
      userId,
      usedAt: Date.now(),
      metadata
    }

    if (!usagesStore.has(templateId)) {
      usagesStore.set(templateId, [])
    }
    usagesStore.get(templateId)!.push(usage)
  }

  /**
   * Get template statistics
   */
  async getStats(templateId: string): Promise<TemplateStats> {
    const template = templatesStore.get(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }

    const usages = usagesStore.get(templateId) || []

    const totalUsages = usages.length
    const uniqueUsers = new Set(usages.map(u => u.userId)).size
    const averageRating = template.ratingsCount > 0 ? template.rating / template.ratingsCount : 0

    // Calculate usages by day (last 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000)
    const recentUsages = usages.filter(u => u.usedAt >= thirtyDaysAgo)

    const byDay = new Map<string, number>()
    recentUsages.forEach(usage => {
      const date = new Date(usage.usedAt).toISOString().split('T')[0]
      byDay.set(date, (byDay.get(date) || 0) + 1)
    })

    const usagesByDay = Array.from(byDay.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))

    return {
      templateId,
      totalUsages,
      uniqueUsers,
      averageRating,
      recentUsages: usages.slice(-10).reverse(),
      usagesByDay
    }
  }

  /**
   * Rate a template
   */
  async rate(templateId: string, userId: string, rating: number): Promise<void> {
    if (rating < 1 || rating > 5) {
      throw new Error('Rating must be between 1 and 5')
    }

    const template = templatesStore.get(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }

    // In production, track individual user ratings
    // For now, just update the aggregate
    template.ratingsCount++
    template.rating = (template.rating * (template.ratingsCount - 1) + rating) / template.ratingsCount

    templatesStore.set(templateId, template)
  }

  /**
   * Import template
   */
  async import(templateData: Template, options: { overwriteExisting?: boolean } = {}): Promise<Template> {
    const existing = templatesStore.get(templateData.id)

    if (existing && !options.overwriteExisting) {
      throw new Error('Template already exists')
    }

    if (existing && options.overwriteExisting) {
      // Merge with existing
      const merged: Template = {
        ...existing,
        ...templateData,
        id: existing.id,
        createdAt: existing.createdAt,
        usageCount: existing.usageCount,
        rating: existing.rating,
        ratingsCount: existing.ratingsCount,
        updatedAt: Date.now()
      }
      templatesStore.set(templateData.id, merged)
      return merged
    }

    templatesStore.set(templateData.id, templateData)
    return templateData
  }

  /**
   * Export template
   */
  async export(templateId: string, options: {
    includeVersions?: boolean
    includeMetadata?: boolean
    format?: 'json' | 'yaml'
  } = {}): Promise<string> {
    const template = templatesStore.get(templateId)
    if (!template) {
      throw new Error(`Template not found: ${templateId}`)
    }

    const exportData: Partial<Template> = {
      ...template,
      versions: options.includeVersions ? template.versions : undefined,
      metadata: options.includeMetadata ? template.metadata : undefined
    }

    // Remove internal fields
    delete (exportData as any).usageCount
    delete (exportData as any).rating
    delete (exportData as any).ratingsCount

    return options.format === 'yaml' ? JSON.stringify(exportData, null, 2) : JSON.stringify(exportData, null, 2)
  }

  /**
   * Get all templates
   */
  async getAll(teamId?: string): Promise<Template[]> {
    const all = Array.from(templatesStore.values())
    if (teamId) {
      return all.filter(t => t.teamId === teamId)
    }
    return all
  }

  /**
   * Clean up old templates
   */
  async cleanup(daysToKeep: number = 365): Promise<number> {
    const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000)
    let cleaned = 0

    for (const [id, template] of templatesStore.entries()) {
      if (template.updatedAt < cutoff && template.usageCount === 0) {
        templatesStore.delete(id)
        cleaned++
      }
    }

    return cleaned
  }
}

export default TemplateLibrary
