/**
 * 主题安全访问工具
 *
 * 提供安全的主题访问方法，防止在主题未初始化时出现空指针错误
 */

import type { ThemeRecipe, ThemeColors } from '../system/theme-provider'

// 默认主题颜色值
const DEFAULT_THEME_COLORS: Required<ThemeColors> = {
  background: {
    primary: '#ffffff',
    secondary: '#f5f5f5',
    tertiary: '#fafafa',
    quaternary: '#f9f9f9'
  },
  text: {
    primary: '#000000',
    secondary: '#666666',
    tertiary: '#999999',
    quaternary: '#cccccc',
    inverse: '#ffffff'
  },
  border: {
    primary: '#e5e5e5',
    secondary: '#d0d0d0',
    tertiary: '#e8e8e8',
    focus: '#2196f3'
  },
  primary: '#2196f3',
  secondary: '#9c27b0',
  primaryForeground: '#ffffff',
  secondaryForeground: '#ffffff',
  foreground: '#000000',
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  onSuccess: '#ffffff',
  onError: '#ffffff',
  onWarning: '#ffffff',
  onInfo: '#ffffff',
  popover: '#ffffff',
  popoverForeground: '#000000',
  card: '#ffffff',
  cardForeground: '#000000',
  muted: '#f5f5f5',
  mutedForeground: '#666666',
  accent: '#2196f3',
  accentForeground: '#ffffff',
  destructive: '#dc2626',
  destructiveForeground: '#ffffff'
}

/**
 * 安全获取主题颜色
 */
export function getThemeColor(theme: ThemeRecipe | null | undefined, path: keyof ThemeColors): string {
  if (!theme || !theme.colors) {
    return DEFAULT_THEME_COLORS[path]
  }

  const color = theme.colors[path]
  return color || DEFAULT_THEME_COLORS[path]
}

/**
 * 安全获取嵌套主题颜色
 */
export function getNestedThemeColor(
  theme: ThemeRecipe | null | undefined,
  parentPath: keyof ThemeColors,
  childPath: string
): string {
  if (!theme || !theme.colors || !theme.colors[parentPath]) {
    const defaultParent = DEFAULT_THEME_COLORS[parentPath]
    if (typeof defaultParent === 'object' && defaultParent !== null) {
      return (defaultParent as any)[childPath] || '#000000'
    }
    return '#000000'
  }

  const parent = theme.colors[parentPath]
  if (typeof parent === 'object' && parent !== null) {
    return (parent as any)[childPath] || DEFAULT_THEME_COLORS[parentPath]
  }

  return DEFAULT_THEME_COLORS[parentPath]
}

/**
 * 生成主题样式对象，提供安全的默认值
 */
export function createThemeStyles(theme: ThemeRecipe | null | undefined): Record<string, string> {
  if (!theme || !theme.colors) {
    return {
      '--xor-bg-primary': DEFAULT_THEME_COLORS.background.primary,
      '--xor-bg-secondary': DEFAULT_THEME_COLORS.background.secondary,
      '--xor-text-primary': DEFAULT_THEME_COLORS.text.primary,
      '--xor-text-secondary': DEFAULT_THEME_COLORS.text.secondary,
      '--xor-border-primary': DEFAULT_THEME_COLORS.border.primary,
      '--xor-primary': DEFAULT_THEME_COLORS.primary,
      '--xor-secondary': DEFAULT_THEME_COLORS.secondary,
      '--xor-success': DEFAULT_THEME_COLORS.success,
      '--xor-error': DEFAULT_THEME_COLORS.error,
      '--xor-warning': DEFAULT_THEME_COLORS.warning,
      '--xor-info': DEFAULT_THEME_COLORS.info,
      '--xor-foreground': DEFAULT_THEME_COLORS.foreground,
      '--xor-muted': DEFAULT_THEME_COLORS.muted,
      '--xor-popover': DEFAULT_THEME_COLORS.popover,
      '--xor-card': DEFAULT_THEME_COLORS.card,
      '--xor-destructive': DEFAULT_THEME_COLORS.destructive
    }
  }

  return {
    '--xor-bg-primary': theme.colors.background.primary,
    '--xor-bg-secondary': theme.colors.background.secondary,
    '--xor-text-primary': theme.colors.text.primary,
    '--xor-text-secondary': theme.colors.text.secondary,
    '--xor-border-primary': theme.colors.border.primary,
    '--xor-primary': theme.colors.primary,
    '--xor-secondary': theme.colors.secondary,
    '--xor-success': theme.colors.success,
    '--xor-error': theme.colors.error,
    '--xor-warning': theme.colors.warning,
    '--xor-info': theme.colors.info,
    '--xor-foreground': theme.colors.foreground,
    '--xor-muted': theme.colors.muted,
    '--xor-popover': theme.colors.popover,
    '--xor-card': theme.colors.card,
    '--xor-destructive': theme.colors.destructive
  }
}

/**
 * 创建HSL格式的主题样式
 */
export function createHSLThemeStyles(theme: ThemeRecipe | null | undefined): Record<string, string> {
  if (!theme || !theme.colors) {
    return {}
  }

  return {
    '--xor-bg-primary': `hsl(${theme.colors.background.primary})`,
    '--xor-bg-secondary': `hsl(${theme.colors.background.secondary})`,
    '--xor-text-primary': `hsl(${theme.colors.text.primary})`,
    '--xor-text-secondary': `hsl(${theme.colors.text.secondary})`,
    '--xor-border-primary': `hsl(${theme.colors.border.primary})`,
    '--xor-primary': `hsl(${theme.colors.primary})`,
    '--xor-secondary': `hsl(${theme.colors.secondary})`,
    '--xor-success': `hsl(${theme.colors.success})`,
    '--xor-error': `hsl(${theme.colors.error})`,
    '--xor-warning': `hsl(${theme.colors.warning})`,
    '--xor-info': `hsl(${theme.colors.info})`,
    '--xor-foreground': `hsl(${theme.colors.foreground})`,
    '--xor-muted': `hsl(${theme.colors.muted})`,
    '--xor-popover': `hsl(${theme.colors.popover})`,
    '--xor-card': `hsl(${theme.colors.card})`,
    '--xor-destructive': `hsl(${theme.colors.destructive})`
  }
}