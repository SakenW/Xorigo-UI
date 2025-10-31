/**
 * Theme safe access utilities
 * Provides safe ways to access theme values with fallbacks
 */

/**
 * Safely gets a theme value with fallback
 */
export function safeThemeAccess<T>(obj: any, path: string, fallback: T): T {
  try {
    const keys = path.split('.')
    let result = obj

    for (const key of keys) {
      if (result && typeof result === 'object' && key in result) {
        result = result[key]
      } else {
        return fallback
      }
    }

    return result ?? fallback
  } catch {
    return fallback
  }
}

/**
 * Safely gets a color from theme
 */
export function getThemeColor(theme: any, colorPath: string, fallback: string = '#000000'): string {
  return safeThemeAccess(theme, `colors.${colorPath}`, fallback)
}

/**
 * Safely gets a spacing value from theme
 */
export function getThemeSpacing(theme: any, spacingKey: string, fallback: string = '1rem'): string {
  return safeThemeAccess(theme, `spacing.${spacingKey}`, fallback)
}

/**
 * Safely gets a font size from theme
 */
export function getThemeFontSize(theme: any, sizeKey: string, fallback: string = '1rem'): string {
  return safeThemeAccess(theme, `fontSizes.${sizeKey}`, fallback)
}