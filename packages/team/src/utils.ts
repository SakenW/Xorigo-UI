/**
 * Xorigo UI Team - Utility Functions
 */

export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toISOString()
}

export function calculateDistance(pos1: { x: number; y: number }, pos2: { x: number; y: number }): number {
  const dx = pos1.x - pos2.x
  const dy = pos1.y - pos2.y
  return Math.sqrt(dx * dx + dy * dy)
}

export function generateId(): string {
  return `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

export function parseVersionString(version: string): {
  major: number
  minor: number
  patch: number
  prerelease?: string
  build?: string
} | null {
  const parts = version.split('.')
  if (parts.length < 3) return null

  return {
    major: parseInt(parts[0]),
    minor: parseInt(parts[1]),
    patch: parseInt(parts[2]),
    prerelease: parts[3],
    build: parts[4]
  }
}

export function bumpVersion(
  version: string,
  type: 'major' | 'minor' | 'patch' | 'prerelease'
): string {
  const parts = version.split('.')
  if (parts.length < 3) return version

  switch (type) {
    case 'major':
      parts[0] = (parseInt(parts[0]) + 1).toString()
      parts[1] = '0'
      parts[2] = '0'
      break
    case 'minor':
      parts[1] = (parseInt(parts[1]) + 1).toString()
      parts[2] = '0'
      break
    case 'patch':
      parts[2] = (parseInt(parts[2]) + 1).toString()
      break
    case 'prerelease':
      if (parts.length === 3) {
        parts.push('alpha.0')
      } else {
        const prereleaseNum = parseInt(parts[3].split('-')[1]) || 0
        parts[3] = `alpha.${prereleaseNum + 1}`
      }
      break
  }

  return parts.join('.')
}

export function compareVersions(v1: string, v2: string): number {
  const p1 = parseVersionString(v1)
  const p2 = parseVersionString(v2)

  if (!p1 || !p2) return 0

  if (p1.major !== p2.major) return p1.major - p2.major
  if (p1.minor !== p2.minor) return p1.minor - p2.minor
  if (p1.patch !== p2.patch) return p1.patch - p2.patch

  // Handle prerelease
  if (!p1.prerelease && p2.prerelease) return 1
  if (p1.prerelease && !p2.prerelease) return -1
  if (p1.prerelease && p2.prerelease) {
    return p1.prerelease.localeCompare(p2.prerelease)
  }

  return 0
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

export function getRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp

  if (diff < 60000) return 'just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`

  return formatTimestamp(timestamp)
}

export function validateBranchName(name: string): { valid: boolean; error?: string } {
  if (!name || name.length === 0) {
    return { valid: false, error: 'Branch name cannot be empty' }
  }

  if (name.length > 100) {
    return { valid: false, error: 'Branch name too long' }
  }

  if (name.includes('..')) {
    return { valid: false, error: 'Branch name cannot contain consecutive dots' }
  }

  if (name.startsWith('.') || name.endsWith('.')) {
    return { valid: false, error: 'Branch name cannot start or end with a dot' }
  }

  if (name.includes('/.') || name.includes('./')) {
    return { valid: false, error: 'Branch name cannot contain "/." or "./' }
  }

  const invalidChars = /[~\^:\?\*\[@]/
  if (invalidChars.test(name)) {
    return { valid: false, error: 'Branch name contains invalid characters' }
  }

  return { valid: true }
}

export function sanitizeFilename(name: string): string {
  return name
    .replace(/[^a-z0-9\-_.]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase()
}

export function calculateFileHash(content: string): string {
  let hash = 0
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return Math.abs(hash).toString(16)
}

export function groupBy<T>(array: T[], keyFn: (item: T) => string): Record<string, T[]> {
  return array.reduce((result, item) => {
    const key = keyFn(item)
    if (!result[key]) {
      result[key] = []
    }
    result[key].push(item)
    return result
  }, {} as Record<string, T[]>)
}

export function sortBy<T>(array: T[], keyFn: (item: T) => number | string, order: 'asc' | 'desc' = 'asc'): T[] {
  return [...array].sort((a, b) => {
    const aVal = keyFn(a)
    const bVal = keyFn(b)

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal
    }

    const comparison = aVal.localeCompare(bVal as string)
    return order === 'asc' ? comparison : -comparison
  })
}

export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  return function (this: unknown, ...args: Parameters<T>) {
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}
