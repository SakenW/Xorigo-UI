/**
 * Xorigo UI Share - Access Tracker
 *
 * Tracks and analyzes access to shared links.
 * Provides detailed analytics and access patterns.
 */

import { nanoid } from 'nanoid'
import { AccessRecord, AccessTracker as IAccessTracker } from './types'
import { formatTimestamp } from './utils'

// In-memory storage (replace with database in production)
const accessRecordsStore = new Map<string, AccessRecord[]>()

/**
 * Access Tracker
 *
 * Features:
 * - Real-time access tracking
 * - Access history and analytics
 * - Rate limiting support
 * - Geolocation tracking (optional)
 */
export class AccessTracker implements IAccessTracker {
  private maxRecordsPerLink: number

  constructor(options: { maxRecordsPerLink?: number } = {}) {
    this.maxRecordsPerLink = options.maxRecordsPerLink || 10000
  }

  /**
   * Track an access to a shared link
   */
  async trackAccess(
    token: string,
    userId?: string,
    metadata: Record<string, unknown> = {}
  ): Promise<AccessRecord> {
    const record: AccessRecord = {
      id: nanoid(16),
      linkId: token,
      userId,
      userAgent: metadata.userAgent as string,
      ip: metadata.ip as string,
      accessedAt: Date.now(),
      duration: metadata.duration as number,
      referrer: metadata.referrer as string,
      success: metadata.success !== false
    }

    if (metadata.error) {
      record.error = metadata.error as string
    }

    // Store record
    if (!accessRecordsStore.has(token)) {
      accessRecordsStore.set(token, [])
    }

    const records = accessRecordsStore.get(token)!
    records.push(record)

    // Trim old records if exceeding limit
    if (records.length > this.maxRecordsPerLink) {
      records.splice(0, records.length - this.maxRecordsPerLink)
    }

    return record
  }

  /**
   * Get access history for a link
   */
  async getAccessHistory(linkId: string): Promise<AccessRecord[]> {
    const records = accessRecordsStore.get(linkId)
    return records ? [...records] : []
  }

  /**
   * Increment access count for a link
   */
  async incrementAccessCount(linkId: string): Promise<boolean> {
    // In a real implementation, this would update the share link record
    // For now, just return true
    return true
  }

  /**
   * Check if a link can be accessed (rate limiting, etc.)
   */
  async canAccess(link: any, userId?: string): Promise<boolean> {
    // Check if link is still active
    if (link.status !== 'active') {
      return false
    }

    // Check expiration
    if (link.expiresAt && Date.now() > link.expiresAt) {
      return false
    }

    // Check access count limit
    if (link.maxAccessCount && link.accessCount >= link.maxAccessCount) {
      return false
    }

    // Check rate limiting (simple implementation)
    const records = accessRecordsStore.get(link.token) || []
    const now = Date.now()
    const recentAccesses = records.filter(
      r => r.userId === userId && now - r.accessedAt < 60000 // Last minute
    )

    if (recentAccesses.length > 10) { // Max 10 accesses per minute per user
      return false
    }

    return true
  }

  /**
   * Get statistics for a link
   */
  async getStatistics(linkId: string): Promise<{
    totalAccesses: number
    uniqueUsers: number
    successfulAccesses: number
    failedAccesses: number
    averageDuration: number
  }> {
    const records = accessRecordsStore.get(linkId) || []

    const totalAccesses = records.length
    const uniqueUsers = new Set(records.map(r => r.userId || 'anonymous')).size
    const successfulAccesses = records.filter(r => r.success).length
    const failedAccesses = records.filter(r => !r.success).length

    const successfulRecords = records.filter(r => r.success && r.duration)
    const averageDuration = successfulRecords.length > 0
      ? successfulRecords.reduce((sum, r) => sum + (r.duration || 0), 0) / successfulRecords.length
      : 0

    return {
      totalAccesses,
      uniqueUsers,
      successfulAccesses,
      failedAccesses,
      averageDuration
    }
  }

  /**
   * Get access timeline
   */
  async getAccessTimeline(linkId: string, days: number = 7): Promise<Array<{
    date: string
    count: number
  }>> {
    const records = accessRecordsStore.get(linkId) || []
    const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000)

    const filtered = records.filter(r => r.accessedAt >= cutoff)

    // Group by date
    const byDate = new Map<string, number>()
    filtered.forEach(record => {
      const date = new Date(record.accessedAt).toISOString().split('T')[0]
      byDate.set(date, (byDate.get(date) || 0) + 1)
    })

    return Array.from(byDate.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date))
  }

  /**
   * Clean up old access records
   */
  async cleanup(daysToKeep: number = 90): Promise<number> {
    const cutoff = Date.now() - (daysToKeep * 24 * 60 * 60 * 1000)
    let cleaned = 0

    for (const [linkId, records] of accessRecordsStore.entries()) {
      const originalLength = records.length
      const filtered = records.filter(r => r.accessedAt >= cutoff)

      if (filtered.length < originalLength) {
        accessRecordsStore.set(linkId, filtered)
        cleaned += originalLength - filtered.length
      }
    }

    return cleaned
  }
}

export default AccessTracker
