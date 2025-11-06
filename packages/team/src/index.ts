/**
 * Xorigo UI Team
 *
 * Team template library and version control system.
 * Supports template management, branching, merging, and team permissions.
 */

export { TemplateLibrary } from './template-library'
export { VersionControl } from './version-control'

export type {
  Template,
  TemplateVersion,
  TemplateCategory,
  TemplateTag,
  TemplateSearchOptions,
  TemplateSearchResult,
  TemplateUsage,
  TemplateStats,
  Team,
  TeamMember,
  TeamSettings,
  TeamPermissions
} from './types'

export type {
  Version,
  VersionBranch,
  MergeRequest,
  ChangeSet,
  Commit,
  VersionHistory,
  VersionCompare,
  BranchInfo
} from './types.version'

export {
  formatTimestamp,
  calculateDistance,
  generateId,
  parseVersionString,
  bumpVersion,
  compareVersions,
  formatDuration,
  getRelativeTime,
  validateBranchName,
  sanitizeFilename,
  calculateFileHash,
  groupBy,
  sortBy,
  chunk,
  unique,
  clamp,
  debounce,
  throttle
} from './utils'

// Version
export const VERSION = '2025.11.05'
