/**
 * Xorigo UI Team - Type Definitions
 */

import type { PermissionLevel } from '@xorigo-ui/share'

export type TemplateCategory =
  | 'dashboard'
  | 'landing-page'
  | 'form'
  | 'email'
  | 'document'
  | 'presentation'
  | 'custom'

export interface TemplateTag {
  id: string
  name: string
  color?: string
}

export interface TemplateVersion {
  version: string
  createdAt: number
  createdBy: string
  changelog?: string
  content: unknown
  preview?: string
  deprecated?: boolean
}

export interface Template {
  id: string
  name: string
  description: string
  category: TemplateCategory
  tags: TemplateTag[]
  versions: TemplateVersion[]
  currentVersion: string
  author: {
    id: string
    name: string
    email?: string
  }
  teamId?: string
  isPublic: boolean
  isFeatured: boolean
  usageCount: number
  rating: number
  ratingsCount: number
  createdAt: number
  updatedAt: number
  metadata?: Record<string, unknown>
}

export interface TemplateLibrary {
  templates: Map<string, Template>
  categories: TemplateCategory[]
  tags: Map<string, TemplateTag>
}

export interface TeamMember {
  id: string
  name: string
  email: string
  role: 'owner' | 'admin' | 'editor' | 'viewer'
  joinedAt: number
  lastActive: number
  avatar?: string
}

export interface Team {
  id: string
  name: string
  description?: string
  members: TeamMember[]
  createdAt: number
  updatedAt: number
  settings: TeamSettings
  permissions: TeamPermissions
}

export interface TeamSettings {
  allowPublicTemplates: boolean
  allowMemberInvites: boolean
  requireApprovalForPublic: boolean
  defaultTemplateVisibility: 'private' | 'team' | 'public'
  allowTemplateSharing: boolean
}

export interface TeamPermissions {
  owner: PermissionLevel
  admin: PermissionLevel
  editor: PermissionLevel
  viewer: PermissionLevel
}

export interface TemplateSearchOptions {
  query?: string
  category?: TemplateCategory
  tags?: string[]
  author?: string
  teamId?: string
  isPublic?: boolean
  isFeatured?: boolean
  minRating?: number
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'usageCount' | 'rating'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

export interface TemplateSearchResult {
  templates: Template[]
  total: number
  hasMore: boolean
}

export interface TemplateUsage {
  id: string
  templateId: string
  userId: string
  teamId?: string
  usedAt: number
  metadata?: Record<string, unknown>
}

export interface TemplateStats {
  templateId: string
  totalUsages: number
  uniqueUsers: number
  averageRating: number
  recentUsages: TemplateUsage[]
  usagesByDay: Array<{ date: string; count: number }>
}

export interface TemplateImportOptions {
  overwriteExisting?: boolean
  markAsPublic?: boolean
  importVersions?: boolean
  preserveMetadata?: boolean
}

export interface TemplateExportOptions {
  includeVersions?: boolean
  includeMetadata?: boolean
  format?: 'json' | 'yaml'
}
