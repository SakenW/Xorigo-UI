/**
 * Xorigo UI Share
 *
 * Secure share link generation and permission management system.
 * Supports link expiration, access controls, and detailed analytics.
 */

export { ShareLinkGenerator } from './link-generator'
export { AccessTracker } from './access-tracker'
export { PermissionManager } from './permission-manager'

export type {
  ShareLink,
  ShareLinkOptions,
  AccessRecord,
  PermissionLevel,
  SharePermissions,
  ShareSettings,
  LinkAnalytics,
  ValidationResult
} from './types'

export {
  generateChecksum,
  formatTimestamp,
  isExpired,
  calculateRemainingTime,
  formatDuration,
  parseAccessCount,
  validateResourceId,
  getPermissionsSummary,
  createShareUrl,
  isValidEmail,
  maskEmail,
  getUserRoleFromString,
  getShareSettingsPreset
} from './utils'

// Version
export const VERSION = '2025.11.05'
