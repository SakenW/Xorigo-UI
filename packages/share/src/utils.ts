/**
 * Xorigo UI Share - Utility Functions
 */

import { PermissionLevel, SharePermissions, ShareSettings, UserRole } from './permission-manager'

export function generateChecksum(data: string): string {
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString()
}

export function isExpired(expiresAt?: number): boolean {
  return !!(expiresAt && Date.now() > expiresAt)
}

export function calculateRemainingTime(expiresAt?: number): number | null {
  if (!expiresAt) return null
  return Math.max(0, expiresAt - Date.now())
}

export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''}`
  return `${seconds} second${seconds !== 1 ? 's' : ''}`
}

export function parseAccessCount(maxAccessCount?: number): {
  value: number
  label: string
  unlimited: boolean
} {
  if (!maxAccessCount) {
    return { value: 0, label: 'Unlimited', unlimited: true }
  }

  if (maxAccessCount <= 10) {
    return { value: maxAccessCount, label: `${maxAccessCount} access`, unlimited: false }
  }

  if (maxAccessCount <= 100) {
    const label = maxAccessCount === 50 ? '50 accesses' : `${maxAccessCount} accesses`
    return { value: maxAccessCount, label, unlimited: false }
  }

  if (maxAccessCount <= 1000) {
    const value = Math.floor(maxAccessCount / 100) * 100
    return { value, label: `${value}+ accesses`, unlimited: false }
  }

  return { value: maxAccessCount, label: `${maxAccessCount}+ accesses`, unlimited: false }
}

export function validateResourceId(resourceId: string): boolean {
  return /^[a-zA-Z0-9_-]+$/.test(resourceId) && resourceId.length > 0 && resourceId.length <= 128
}

export function getPermissionsSummary(permissions: PermissionLevel): {
  level: 'full' | 'edit' | 'comment' | 'view' | 'none'
  features: string[]
} {
  if (permissions.edit && permissions.share) {
    return {
      level: 'full',
      features: ['View', 'Edit', 'Comment', 'Share', 'Download']
    }
  }

  if (permissions.edit) {
    return {
      level: 'edit',
      features: ['View', 'Edit', 'Comment']
    }
  }

  if (permissions.comment) {
    return {
      level: 'comment',
      features: ['View', 'Comment']
    }
  }

  if (permissions.view) {
    return {
      level: 'view',
      features: ['View only']
    }
  }

  return {
    level: 'none',
    features: []
  }
}

export function createShareUrl(baseUrl: string, token: string): string {
  const protocol = baseUrl.startsWith('https') ? 'https' : 'http'
  const domain = baseUrl.replace(/^https?:\/\//, '')
  return `${protocol}://${domain}/share/${token}`
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function maskEmail(email: string): string {
  const [username, domain] = email.split('@')
  if (username.length <= 3) {
    return `***@${domain}`
  }
  const maskedUsername = username.substring(0, 2) + '***' + username.substring(username.length - 1)
  return `${maskedUsername}@${domain}`
}

export function getUserRoleFromString(role: string): UserRole | null {
  const roles: UserRole[] = ['owner', 'admin', 'editor', 'viewer', 'guest']
  return roles.includes(role as UserRole) ? (role as UserRole) : null
}

export function getShareSettingsPreset(
  level: 'public' | 'private' | 'team'
): ShareSettings {
  switch (level) {
    case 'public':
      return {
        allowComments: true,
        allowDownload: true,
        allowCopy: true,
        showAccessCount: true
      }

    case 'team':
      return {
        allowComments: true,
        allowDownload: false,
        allowCopy: false,
        showAccessCount: true,
        watermark: {
          enabled: true,
          opacity: 0.3
        }
      }

    case 'private':
      return {
        allowComments: false,
        allowDownload: false,
        allowCopy: false,
        showAccessCount: false,
        watermark: {
          enabled: true,
          text: 'Confidential',
          opacity: 0.5
        }
      }

    default:
      return PermissionManager.createDefaultSettings()
  }
}

// Re-export PermissionManager
export { PermissionManager } from './permission-manager'
