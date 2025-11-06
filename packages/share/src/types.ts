/**
 * Xorigo UI Share - Type Definitions
 */

export interface ShareLink {
  id: string
  url: string
  token: string
  resourceId: string
  resourceType: 'document' | 'template' | 'project' | 'file'
  createdBy: string
  createdAt: number
  expiresAt?: number
  maxAccessCount?: number
  accessCount: number
  status: 'active' | 'expired' | 'revoked' | 'maxed'
  metadata?: Record<string, unknown>
}

export interface ShareLinkOptions {
  expiresIn?: number
  maxAccessCount?: number
  requireAuth?: boolean
  allowAnonymous?: boolean
  metadata?: Record<string, unknown>
  domain?: string
  secure?: boolean
}

export interface AccessRecord {
  id: string
  linkId: string
  userId?: string
  userAgent?: string
  ip?: string
  accessedAt: number
  duration?: number
  referrer?: string
  success: boolean
  error?: string
}

export interface PermissionLevel {
  view: boolean
  edit: boolean
  comment: boolean
  share: boolean
  delete?: boolean
  download?: boolean
}

export interface SharePermissions {
  public: PermissionLevel
  authenticated: PermissionLevel
  custom?: Record<string, PermissionLevel>
}

export interface ShareSettings {
  allowComments: boolean
  allowDownload: boolean
  allowCopy: boolean
  showAccessCount: boolean
  password?: string
  watermark?: {
    enabled: boolean
    text?: string
    opacity?: number
  }
}

export interface LinkAnalytics {
  totalAccess: number
  uniqueUsers: number
  averageDuration: number
  topReferrers: Array<{ referrer: string; count: number }>
  accessByHour: Array<{ hour: number; count: number }>
  accessByCountry: Array<{ country: string; count: number }>
  recentAccess: AccessRecord[]
}

export interface ValidationResult {
  valid: boolean
  error?: string
  link?: ShareLink
}

export interface ShareLinkGenerator {
  generate(resourceId: string, resourceType: ShareLink['resourceType'], options?: ShareLinkOptions): Promise<ShareLink>
  generateBatch(resources: Array<{ id: string; type: ShareLink['resourceType'] }>, options?: ShareLinkOptions): Promise<ShareLink[]>
  validate(token: string): Promise<ValidationResult>
  revoke(token: string): Promise<boolean>
  getAnalytics(token: string): Promise<LinkAnalytics>
  getLinksByResource(resourceId: string): Promise<ShareLink[]>
  cleanupExpired(): Promise<number>
}

export interface AccessTracker {
  trackAccess(token: string, userId?: string, metadata?: Record<string, unknown>): Promise<AccessRecord>
  getAccessHistory(linkId: string): Promise<AccessRecord[]>
  incrementAccessCount(linkId: string): Promise<boolean>
  canAccess(link: ShareLink, userId?: string): Promise<boolean>
}
