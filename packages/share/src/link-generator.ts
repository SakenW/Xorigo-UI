/**
 * Xorigo UI Share - Link Generator
 *
 * Generates secure share links with configurable permissions and access controls.
 * Supports link expiration, access count limits, and detailed analytics.
 */

import { nanoid } from 'nanoid'
import { z } from 'zod'
import {
  ShareLink,
  ShareLinkOptions,
  LinkAnalytics,
  AccessRecord,
  ValidationResult
} from './types'
import { generateChecksum, formatTimestamp } from './utils'

// Validation schemas
const ShareLinkOptionsSchema = z.object({
  expiresIn: z.number().min(1).max(365 * 24 * 60 * 60).optional(), // Max 1 year
  maxAccessCount: z.number().min(1).max(10000).optional(),
  requireAuth: z.boolean().default(false),
  allowAnonymous: z.boolean().default(true),
  metadata: z.record(z.unknown()).optional(),
  domain: z.string().url().optional(),
  secure: z.boolean().default(true)
})

const ResourceTypeSchema = z.enum(['document', 'template', 'project', 'file'])

// In-memory storage (replace with database in production)
const shareLinksStore = new Map<string, ShareLink>()
const accessRecordsStore = new Map<string, AccessRecord[]>()

/**
 * Share Link Generator
 *
 * Features:
 * - Secure token generation with optional expiration
 * - Configurable access permissions and limits
 * - Built-in analytics and tracking
 * - Support for multiple resource types
 * - Automatic cleanup of expired links
 */
export class ShareLinkGenerator {
  private baseUrl: string
  private secret: string
  private tokenLength: number

  constructor(options: { baseUrl?: string; secret?: string; tokenLength?: number } = {}) {
    this.baseUrl = options.baseUrl || 'http://localhost:3001'
    this.secret = options.secret || process.env.SHARE_SECRET || 'default-secret-key'
    this.tokenLength = options.tokenLength || 32
  }

  /**
   * Generate a secure share link for a resource
   */
  async generate(
    resourceId: string,
    resourceType: 'document' | 'template' | 'project' | 'file',
    options: ShareLinkOptions = {}
  ): Promise<ShareLink> {
    // Validate inputs
    const validatedOptions = ShareLinkOptionsSchema.parse(options)
    ResourceTypeSchema.parse(resourceType)

    if (!resourceId || typeof resourceId !== 'string') {
      throw new Error('Invalid resource ID')
    }

    // Generate token
    const token = nanoid(this.tokenLength)

    // Calculate expiration
    const now = Date.now()
    const expiresAt = validatedOptions.expiresIn
      ? now + (validatedOptions.expiresIn * 1000)
      : undefined

    // Create share link
    const shareLink: ShareLink = {
      id: nanoid(16),
      url: this.buildShareUrl(token),
      token,
      resourceId,
      resourceType,
      createdBy: this.getCurrentUserId(),
      createdAt: now,
      expiresAt,
      maxAccessCount: validatedOptions.maxAccessCount,
      accessCount: 0,
      status: 'active',
      metadata: {
        ...validatedOptions.metadata,
        checksum: this.generateTokenChecksum(token, resourceId),
        requireAuth: validatedOptions.requireAuth,
        allowAnonymous: validatedOptions.allowAnonymous
      }
    }

    // Store link (in production, save to database)
    shareLinksStore.set(token, shareLink)

    return shareLink
  }

  /**
   * Generate multiple share links in batch
   */
  async generateBatch(
    resources: Array<{ id: string; type: 'document' | 'template' | 'project' | 'file' }>,
    options: ShareLinkOptions = {}
  ): Promise<ShareLink[]> {
    const results: ShareLink[] = []

    for (const resource of resources) {
      try {
        const link = await this.generate(resource.id, resource.type, options)
        results.push(link)
      } catch (error) {
        console.error(`Failed to generate link for ${resource.id}:`, error)
        // Continue with other resources
      }
    }

    return results
  }

  /**
   * Validate a share link token
   */
  async validate(token: string): Promise<ValidationResult> {
    if (!token || typeof token !== 'string') {
      return { valid: false, error: 'Invalid token format' }
    }

    const link = shareLinksStore.get(token)

    if (!link) {
      return { valid: false, error: 'Link not found' }
    }

    // Check expiration
    if (link.status === 'expired' || (link.expiresAt && Date.now() > link.expiresAt)) {
      return { valid: false, error: 'Link has expired', link }
    }

    // Check revocation
    if (link.status === 'revoked') {
      return { valid: false, error: 'Link has been revoked', link }
    }

    // Check access count
    if (link.maxAccessCount && link.accessCount >= link.maxAccessCount) {
      link.status = 'maxed'
      return { valid: false, error: 'Maximum access count reached', link }
    }

    // Validate checksum
    const expectedChecksum = this.generateTokenChecksum(token, link.resourceId)
    const actualChecksum = (link.metadata?.checksum as string) || ''

    if (expectedChecksum !== actualChecksum) {
      return { valid: false, error: 'Token checksum mismatch', link }
    }

    return { valid: true, link }
  }

  /**
   * Revoke a share link
   */
  async revoke(token: string): Promise<boolean> {
    const link = shareLinksStore.get(token)

    if (!link) {
      return false
    }

    link.status = 'revoked'
    return true
  }

  /**
   * Get analytics for a share link
   */
  async getAnalytics(token: string): Promise<LinkAnalytics> {
    const link = shareLinksStore.get(token)

    if (!link) {
      throw new Error('Link not found')
    }

    const records = accessRecordsStore.get(token) || []

    // Calculate analytics
    const totalAccess = records.length
    const uniqueUsers = new Set(records.map(r => r.userId || 'anonymous')).size
    const averageDuration = records.length > 0
      ? records.reduce((sum, r) => sum + (r.duration || 0), 0) / records.length
      : 0

    // Group by referrer
    const referrerCounts = new Map<string, number>()
    records.forEach(record => {
      if (record.referrer) {
        const count = referrerCounts.get(record.referrer) || 0
        referrerCounts.set(record.referrer, count + 1)
      }
    })
    const topReferrers = Array.from(referrerCounts.entries())
      .map(([referrer, count]) => ({ referrer, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Group by hour
    const hourCounts = new Map<number, number>()
    records.forEach(record => {
      const hour = new Date(record.accessedAt).getHours()
      const count = hourCounts.get(hour) || 0
      hourCounts.set(hour, count + 1)
    })
    const accessByHour = Array.from(hourCounts.entries())
      .map(([hour, count]) => ({ hour, count }))
      .sort((a, b) => a.hour - b.hour)

    return {
      totalAccess,
      uniqueUsers,
      averageDuration,
      topReferrers,
      accessByHour,
      accessByCountry: [], // TODO: Implement geolocation tracking
      recentAccess: records.slice(-50).reverse()
    }
  }

  /**
   * Get all share links for a resource
   */
  async getLinksByResource(resourceId: string): Promise<ShareLink[]> {
    return Array.from(shareLinksStore.values())
      .filter(link => link.resourceId === resourceId)
      .sort((a, b) => b.createdAt - a.createdAt)
  }

  /**
   * Clean up expired share links
   */
  async cleanupExpired(): Promise<number> {
    const now = Date.now()
    let cleaned = 0

    for (const [token, link] of shareLinksStore.entries()) {
      if (link.expiresAt && now > link.expiresAt) {
        shareLinksStore.delete(token)
        accessRecordsStore.delete(token)
        cleaned++
      }
    }

    return cleaned
  }

  private buildShareUrl(token: string): string {
    const protocol = this.baseUrl.startsWith('https') ? 'https' : 'http'
    const domain = this.baseUrl.replace(/^https?:\/\//, '')
    return `${protocol}://${domain}/share/${token}`
  }

  private generateTokenChecksum(token: string, resourceId: string): string {
    const data = `${token}:${resourceId}:${this.secret}`
    return generateChecksum(data)
  }

  private getCurrentUserId(): string {
    // In a real application, get this from authentication context
    return 'user_system'
  }

  // Public methods for AccessTracker
  incrementAccessCount(token: string): boolean {
    const link = shareLinksStore.get(token)
    if (!link) return false

    link.accessCount++
    return true
  }

  addAccessRecord(record: AccessRecord): void {
    if (!accessRecordsStore.has(record.linkId)) {
      accessRecordsStore.set(record.linkId, [])
    }
    accessRecordsStore.get(record.linkId)!.push(record)
  }

  getAccessRecords(token: string): AccessRecord[] {
    return accessRecordsStore.get(token) || []
  }
}

export default ShareLinkGenerator
