/**
 * Xorigo UI Share - Permission Manager
 *
 * Manages access control and permissions for shared resources.
 * Supports role-based access control, fine-grained permissions, and team hierarchies.
 */

import { z } from 'zod'
import {
  PermissionLevel,
  SharePermissions,
  ShareSettings
} from './types'

// Validation schemas
const PermissionLevelSchema = z.object({
  view: z.boolean(),
  edit: z.boolean(),
  comment: z.boolean(),
  share: z.boolean(),
  delete: z.boolean().optional(),
  download: z.boolean().optional()
})

const SharePermissionsSchema = z.object({
  public: PermissionLevelSchema,
  authenticated: PermissionLevelSchema,
  custom: z.record(PermissionLevelSchema).optional()
})

const ShareSettingsSchema = z.object({
  allowComments: z.boolean(),
  allowDownload: z.boolean(),
  allowCopy: z.boolean(),
  showAccessCount: z.boolean(),
  password: z.string().optional(),
  watermark: z.object({
    enabled: z.boolean(),
    text: z.string().optional(),
    opacity: z.number().min(0).max(1).optional()
  }).optional()
})

export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer' | 'guest'

export interface User {
  id: string
  name: string
  email?: string
  role: UserRole
  teamId?: string
  permissions?: PermissionLevel
}

export interface PermissionContext {
  user?: User
  isAuthenticated: boolean
  ip?: string
  userAgent?: string
  referrer?: string
}

export interface PermissionResult {
  granted: boolean
  permissions: PermissionLevel
  reason?: string
  requiresAuth?: boolean
}

/**
 * Permission Manager
 *
 * Handles:
 * - Role-based access control (RBAC)
 * - Fine-grained permission levels
 * - Team-based permissions
 * - Conditional access based on context
 */
export class PermissionManager {
  private roles: Map<UserRole, PermissionLevel> = new Map()
  private teamPermissions: Map<string, PermissionLevel> = new Map()

  constructor() {
    this.initializeDefaultRoles()
  }

  private initializeDefaultRoles(): void {
    // Owner: Full access
    this.roles.set('owner', {
      view: true,
      edit: true,
      comment: true,
      share: true,
      delete: true,
      download: true
    })

    // Admin: Most permissions except ownership transfer
    this.roles.set('admin', {
      view: true,
      edit: true,
      comment: true,
      share: true,
      delete: false,
      download: true
    })

    // Editor: Can edit and comment
    this.roles.set('editor', {
      view: true,
      edit: true,
      comment: true,
      share: false,
      delete: false,
      download: false
    })

    // Viewer: Read-only access
    this.roles.set('viewer', {
      view: true,
      edit: false,
      comment: false,
      share: false,
      delete: false,
      download: false
    })

    // Guest: Very limited access
    this.roles.set('guest', {
      view: true,
      edit: false,
      comment: false,
      share: false,
      delete: false,
      download: false
    })
  }

  /**
   * Check if a user has required permissions
   */
  hasPermission(
    context: PermissionContext,
    required: PermissionLevel,
    sharePermissions: SharePermissions,
    settings?: ShareSettings
  ): PermissionResult {
    // Validate settings
    const validatedSettings = settings ? ShareSettingsSchema.parse(settings) : undefined

    // Handle password protection
    if (validatedSettings?.password && !this.verifyPassword(context, validatedSettings.password)) {
      return {
        granted: false,
        permissions: this.getEmptyPermissions(),
        reason: 'Password required',
        requiresAuth: true
      }
    }

    // Determine effective permissions
    const effectivePermissions = this.getEffectivePermissions(context, sharePermissions)

    // Check if all required permissions are granted
    const granted = this.checkPermissionLevel(effectivePermissions, required)

    // Additional checks based on settings
    if (granted && validatedSettings) {
      // Check download restrictions
      if (required.download && !validatedSettings.allowDownload) {
        return {
          granted: false,
          permissions: effectivePermissions,
          reason: 'Downloads not allowed'
        }
      }

      // Check copy restrictions
      if (required.share && !validatedSettings.allowCopy) {
        return {
          granted: false,
          permissions: effectivePermissions,
          reason: 'Sharing not allowed'
        }
      }
    }

    return {
      granted,
      permissions: effectivePermissions,
      grantedBy: context.user?.role || (context.isAuthenticated ? 'authenticated' : 'public')
    }
  }

  /**
   * Get effective permissions based on context
   */
  getEffectivePermissions(
    context: PermissionContext,
    sharePermissions: SharePermissions
  ): PermissionLevel {
    const validatedPermissions = SharePermissionsSchema.parse(sharePermissions)

    // Owner always has owner-level permissions
    if (context.user?.role === 'owner') {
      return this.roles.get('owner')!
    }

    // Authenticated users
    if (context.isAuthenticated && context.user) {
      // Check user-specific permissions
      const userPermissions = context.user.permissions
      if (userPermissions) {
        return userPermissions
      }

      // Check team-specific permissions
      if (context.user.teamId && this.teamPermissions.has(context.user.teamId)) {
        const teamPerms = this.teamPermissions.get(context.user.teamId)!
        // Merge with authenticated permissions
        return this.mergePermissions(validatedPermissions.authenticated, teamPerms)
      }

      // Fall back to authenticated user permissions
      return validatedPermissions.authenticated
    }

    // Public (unauthenticated) access
    return validatedPermissions.public
  }

  /**
   * Set custom team permissions
   */
  setTeamPermissions(teamId: string, permissions: PermissionLevel): void {
    const validatedPermissions = PermissionLevelSchema.parse(permissions)
    this.teamPermissions.set(teamId, validatedPermissions)
  }

  /**
   * Remove team permissions
   */
  removeTeamPermissions(teamId: string): boolean {
    return this.teamPermissions.delete(teamId)
  }

  /**
   * Get team permissions
   */
  getTeamPermissions(teamId: string): PermissionLevel | undefined {
    return this.teamPermissions.get(teamId)
  }

  /**
   * Create a permission level from role
   */
  createPermissionFromRole(role: UserRole): PermissionLevel {
    const permissions = this.roles.get(role)
    if (!permissions) {
      throw new Error(`Unknown role: ${role}`)
    }
    return { ...permissions }
  }

  /**
   * Merge multiple permission levels
   */
  mergePermissions(...permissionLevels: PermissionLevel[]): PermissionLevel {
    return {
      view: permissionLevels.some(p => p.view),
      edit: permissionLevels.some(p => p.edit),
      comment: permissionLevels.some(p => p.comment),
      share: permissionLevels.some(p => p.share),
      delete: permissionLevels.some(p => p.delete),
      download: permissionLevels.some(p => p.download)
    }
  }

  /**
   * Check if a permission level satisfies requirements
   */
  private checkPermissionLevel(
    granted: PermissionLevel,
    required: PermissionLevel
  ): boolean {
    // If edit is required, viewer is not sufficient
    if (required.edit && !granted.edit) return false
    // If comment is required, need at least comment permission
    if (required.comment && !granted.comment) return false
    // If share is required, need share permission
    if (required.share && !granted.share) return false
    // If delete is required, need delete permission
    if (required.delete && !granted.delete) return false
    // If download is required, need download permission
    if (required.download && !granted.download) return false
    // View is always required
    if (!granted.view) return false

    return true
  }

  private getEmptyPermissions(): PermissionLevel {
    return {
      view: false,
      edit: false,
      comment: false,
      share: false,
      delete: false,
      download: false
    }
  }

  private verifyPassword(context: PermissionContext, password: string): boolean {
    // In a real implementation, check password from request headers or session
    // For now, this is a placeholder
    return false
  }

  /**
   * Create default share permissions
   */
  static createDefaultPermissions(): SharePermissions {
    return {
      public: {
        view: true,
        edit: false,
        comment: false,
        share: false,
        delete: false,
        download: false
      },
      authenticated: {
        view: true,
        edit: true,
        comment: true,
        share: false,
        delete: false,
        download: true
      }
    }
  }

  /**
   * Create default share settings
   */
  static createDefaultSettings(): ShareSettings {
    return {
      allowComments: true,
      allowDownload: true,
      allowCopy: false,
      showAccessCount: true,
      watermark: {
        enabled: false,
        opacity: 0.5
      }
    }
  }

  /**
   * Create restrictive settings (maximum security)
   */
  static createRestrictiveSettings(): ShareSettings {
    return {
      allowComments: false,
      allowDownload: false,
      allowCopy: false,
      showAccessCount: false,
      watermark: {
        enabled: true,
        text: 'Confidential',
        opacity: 0.3
      }
    }
  }

  /**
   * Create public settings (open access)
   */
  static createPublicSettings(): ShareSettings {
    return {
      allowComments: true,
      allowDownload: true,
      allowCopy: true,
      showAccessCount: true
    }
  }

  /**
   * Export permissions configuration
   */
  exportConfig(): string {
    const config = {
      roles: Object.fromEntries(this.roles),
      teamPermissions: Object.fromEntries(this.teamPermissions)
    }
    return JSON.stringify(config, null, 2)
  }

  /**
   * Import permissions configuration
   */
  importConfig(configJson: string): void {
    const config = JSON.parse(configJson)

    // Validate and import roles
    if (config.roles) {
      for (const [role, permissions] of Object.entries(config.roles)) {
        this.roles.set(role as UserRole, PermissionLevelSchema.parse(permissions))
      }
    }

    // Import team permissions
    if (config.teamPermissions) {
      for (const [teamId, permissions] of Object.entries(config.teamPermissions)) {
        this.teamPermissions.set(teamId, PermissionLevelSchema.parse(permissions))
      }
    }
  }
}

export default PermissionManager
