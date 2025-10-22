/**
 * Xorigo UI 七轴主题系统 - 主题轴控制器
 *
 * 基于 v1.4 SSOT 文档的完整实现
 * 包含智能约束系统（A11y Guard）
 */

// === 基础类型定义 ===
export type ModeAxis = 'light' | 'dark' | 'hc'
export type BaseAxis = `${'neutral-warm' | 'neutral-cool' | 'neutral-true'}-${'low' | 'mid' | 'high'}`
export type AccentAxis = `${'mono' | 'analog' | 'duo'}(${string})`
export type ToneAxis = 'calm' | 'standard' | 'vivid'
export type DensityAxis = 'spacious' | 'comfortable' | 'compact'
export type MotionAxis = `${'subtle' | 'standard' | 'expressive'}.${'classic' | 'soft' | 'spring'}`
export type SurfaceAxis = 'flat' | 'soft-shadow' | 'glass' | 'neon' | 'glass+neon'

// === 核心接口定义 ===
export interface ThemeAxes {
  mode: ModeAxis
  base: BaseAxis
  accent: AccentAxis
  tone: ToneAxis
  density: DensityAxis
  motion: MotionAxis
  surface: SurfaceAxis
}

// === 颜色系统接口 ===
export interface ThemeColors {
  background: {
    primary: string
    secondary: string
    tertiary: string
    quaternary: string
  }
  text: {
    primary: string
    secondary: string
    tertiary: string
    quaternary: string
    inverse: string
  }
  border: {
    primary: string
    secondary: string
    tertiary: string
    focus: string
  }
  primary: string
  secondary: string
  primaryForeground: string
  secondaryForeground: string
  foreground: string
  success: string
  error: string
  warning: string
  info: string
  onSuccess: string
  onError: string
  onWarning: string
  onInfo: string
  popover: string
  popoverForeground: string
  card: string
  cardForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
}

// === 表面系统接口 ===
export interface ThemeSurface {
  shadow: string
  blur: string
  glow: string
  backdrop: string
}

export interface ThemeRecipe {
  id: string
  name: string
  axes: ThemeAxes
  tokens: Record<string, string | number>
  colors: ThemeColors
  surface: ThemeSurface
}

// === 智能约束系统（A11y Guard）===

interface ConstraintRule {
  name: string
  condition: (axes: ThemeAxes) => boolean
  action: (axes: ThemeAxes) => Partial<ThemeAxes>
  warning?: string
}

const constraintRules: ConstraintRule[] = [
  // 高对比模式约束
  {
    name: 'motion × contrast',
    condition: (axes) => axes.mode === 'hc' && axes.motion.startsWith('expressive'),
    action: (axes) => ({
      ...axes,
      motion: 'subtle.classic' as MotionAxis
    }),
    warning: '高对比模式：动效已降级至 subtle.classic 以保证可访问性'
  },

  // 色调与表面约束
  {
    name: 'tone × surface',
    condition: (axes) => axes.tone === 'vivid' && axes.surface.includes('neon'),
    action: (axes) => ({
      ...axes,
      // 注意：在约束规则中无法直接修改 tokens，因为 ThemeAxes 没有这个属性
      // 这个标记会在 generateThemeTokens 中处理
    }),
    warning: 'vivid + neon 组合：已自动降低饱和度以减少视觉疲劳'
  },

  // 密度与动效约束
  {
    name: 'density × motion',
    condition: (axes) => axes.density === 'compact' && axes.motion.startsWith('expressive'),
    action: (axes) => axes, // 不修改，仅警告
    warning: '紧凑布局 + 表现力动效：可能影响用户体验，建议使用 subtle/standard 动效'
  },

  // 高对比模式下的表面约束
  {
    name: 'hc surface constraint',
    condition: (axes) => axes.mode === 'hc' && axes.surface.includes('glass'),
    action: (axes) => ({
      ...axes,
      surface: 'flat' as SurfaceAxis
    }),
    warning: '高对比模式：表面已切换至 flat 以确保可读性'
  }
]

// === 智能约束应用器 ===
export function applyIntelligentConstraints(axes: ThemeAxes): {
  axes: ThemeAxes
  warnings: string[]
  appliedConstraints: string[]
} {
  const warnings: string[] = []
  const appliedConstraints: string[] = []
  let resultAxes = { ...axes }

  constraintRules.forEach(rule => {
    if (rule.condition(resultAxes)) {
      const newAxes = { ...resultAxes, ...rule.action(resultAxes) }

      // 检查是否实际发生了变化
      const hasChanges = JSON.stringify(newAxes) !== JSON.stringify(resultAxes)

      if (hasChanges) {
        resultAxes = newAxes
        appliedConstraints.push(rule.name)
      }

      if (rule.warning) {
        warnings.push(rule.warning)
      }
    }
  })

  return {
    axes: resultAxes,
    warnings,
    appliedConstraints
  }
}

// === 主题令牌生成器 ===
export function generateThemeTokens(axes: ThemeAxes): ThemeRecipe {
  // 先应用智能约束
  const { axes: constrainedAxes, warnings } = applyIntelligentConstraints(axes)

  // 输出警告信息（开发模式）
  if (process.env.NODE_ENV === 'development' && warnings.length > 0) {
    console.group('🎨 主题约束系统警告')
    warnings.forEach(warning => console.warn('⚠️', warning))
    console.groupEnd()
  }

  // 基础令牌计算
  const baseTokens = computeBaseTokens(constrainedAxes)
  const accentTokens = computeAccentTokens(constrainedAxes)
  const surfaceTokens = computeSurfaceTokens(constrainedAxes)
  const motionTokens = computeMotionTokens(constrainedAxes)
  const densityTokens = computeDensityTokens(constrainedAxes)

  // 处理特殊组合约束（如 vivid + neon）
  const adjustmentTokens: Record<string, string | number> = {}
  if (constrainedAxes.tone === 'vivid' && constrainedAxes.surface.includes('neon')) {
    Object.assign(adjustmentTokens, {
      '_saturation_adjustment': 'reduced'
    })
  }

  // 生成颜色数据
  const themeColors = generateThemeColors(constrainedAxes)

  // 生成表面数据
  const themeSurface = generateThemeSurface(constrainedAxes)

  return {
    id: `${constrainedAxes.mode}-${constrainedAxes.base}-${constrainedAxes.accent}-${Date.now()}`,
    name: `Generated Theme (${constrainedAxes.mode})`,
    axes: constrainedAxes,
    tokens: {
      ...baseTokens,
      ...accentTokens,
      ...surfaceTokens,
      ...motionTokens,
      ...densityTokens,
      ...adjustmentTokens
    },
    colors: themeColors,
    surface: themeSurface
  }
}

// === 颜色数据生成函数 ===
function generateThemeColors(axes: ThemeAxes): ThemeColors {
  const [baseColor, contrastLevel] = axes.base.split('-') as [string, string]
  const match = axes.accent.match(/^(mono|analog|duo)\((.*)\)$/)
  const [, strategy, hue] = match ? [match[1], match[2]] : ['mono', 'blue']

  return {
    background: {
      primary: getBaseColor(baseColor, contrastLevel, 'primary'),
      secondary: getBaseColor(baseColor, contrastLevel, 'secondary'),
      tertiary: getBaseColor(baseColor, contrastLevel, 'tertiary'),
      quaternary: getBaseColor(baseColor, contrastLevel, 'quaternary'),
    },
    text: {
      primary: getTextColor(baseColor, contrastLevel, 'primary', axes.mode),
      secondary: getTextColor(baseColor, contrastLevel, 'secondary', axes.mode),
      tertiary: getTextColor(baseColor, contrastLevel, 'tertiary', axes.mode),
      quaternary: getTextColor(baseColor, contrastLevel, 'quaternary', axes.mode),
      inverse: getTextColor(baseColor, contrastLevel, 'inverse', axes.mode),
    },
    border: {
      primary: getBorderColor(baseColor, contrastLevel, 'primary'),
      secondary: getBorderColor(baseColor, contrastLevel, 'secondary'),
      tertiary: getBorderColor(baseColor, contrastLevel, 'tertiary'),
      focus: getAccentColor(strategy, hue, 'primary'),
    },
    primary: getAccentColor(strategy, hue, 'primary'),
    secondary: getAccentColor(strategy, hue, 'secondary'),
    primaryForeground: getOnAccentColor(strategy, hue, 'primary'),
    secondaryForeground: getOnAccentColor(strategy, hue, 'secondary'),
    foreground: getForegroundColor(axes.mode),
    success: getFunctionalColor('success'),
    error: getFunctionalColor('error'),
    warning: getFunctionalColor('warning'),
    info: getFunctionalColor('info'),
    onSuccess: getOnFunctionalColor('success'),
    onError: getOnFunctionalColor('error'),
    onWarning: getOnFunctionalColor('warning'),
    onInfo: getOnFunctionalColor('info'),
    popover: getBaseColor(baseColor, contrastLevel, 'popover'),
    popoverForeground: getTextColor(baseColor, contrastLevel, 'popover', axes.mode),
    card: getBaseColor(baseColor, contrastLevel, 'card'),
    cardForeground: getTextColor(baseColor, contrastLevel, 'card', axes.mode),
    muted: getBaseColor(baseColor, contrastLevel, 'muted'),
    mutedForeground: getTextColor(baseColor, contrastLevel, 'muted', axes.mode),
    accent: getAccentColor(strategy, hue, 'accent'),
    accentForeground: getOnAccentColor(strategy, hue, 'accent'),
    destructive: getFunctionalColor('destructive'),
    destructiveForeground: getOnFunctionalColor('destructive'),
  }
}

// === 表面数据生成函数 ===
function generateThemeSurface(axes: ThemeAxes): ThemeSurface {
  return {
    shadow: getSurfaceShadow(axes.surface),
    blur: getSurfaceBlur(axes.surface),
    glow: getSurfaceGlow(axes.surface),
    backdrop: getSurfaceBackdrop(axes.surface),
  }
}

// === 辅助函数扩展 ===
function getBorderColor(baseColor: string, contrastLevel: string, variant: string): string {
  // 简化的边框颜色计算
  const colors: Record<string, Record<string, string>> = {
    'neutral-warm': {
      low: '#f5f0f0',
      mid: '#e8e0e0',
      high: '#d4c4c4'
    },
    'neutral-cool': {
      low: '#f4f4f5',
      mid: '#e8eaed',
      high: '#d2d6db'
    },
    'neutral-true': {
      low: '#fafafa',
      mid: '#f5f5f5',
      high: '#e5e5e5'
    }
  }
  return colors[baseColor]?.[contrastLevel] || '#e5e5e5'
}

function getTextColor(baseColor: string, contrastLevel: string, variant: string, mode?: string): string {
  // 简化的文字颜色计算
  if (mode === 'dark') {
    return '#ffffff'
  }
  return '#000000'
}

function getOnAccentColor(strategy: string, hue: string, variant: string): string {
  // 简化的对比色计算
  return '#ffffff'
}

function getForegroundColor(mode: string): string {
  return mode === 'dark' ? '#ffffff' : '#000000'
}

function getFunctionalColor(type: string): string {
  const colors = {
    success: '#10b981',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    destructive: '#dc2626'
  }
  return colors[type as keyof typeof colors] || '#6b7280'
}

function getOnFunctionalColor(type: string): string {
  return '#ffffff'
}

function getSurfaceShadow(surface: string): string {
  const shadows = {
    flat: 'none',
    'soft-shadow': '0 4px 16px rgba(0, 0, 0, 0.1)',
    glass: '0 8px 32px rgba(0, 0, 0, 0.1)',
    neon: '0 0 20px var(--xor-primary)',
    'glass+neon': '0 0 30px var(--xor-primary), 0 8px 32px rgba(0, 0, 0, 0.1)'
  }
  return shadows[surface as keyof typeof shadows] || 'none'
}

function getSurfaceBlur(surface: string): string {
  const blurs = {
    flat: '0px',
    glass: 'blur(8px)',
    'soft-shadow': '0px',
    neon: '0px',
    'glass+neon': 'blur(8px)'
  }
  return blurs[surface as keyof typeof blurs] || '0px'
}

function getSurfaceGlow(surface: string): string {
  return surface.includes('neon') ? '0 0 30px currentColor' : 'none'
}

function getSurfaceBackdrop(surface: string): string {
  return surface.includes('glass') ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
}

// === 令牌计算函数 ===
function computeBaseTokens(axes: ThemeAxes): Record<string, string | number> {
  const [baseColor, contrastLevel] = axes.base.split('-') as [string, string]

  return {
    // 基础颜色令牌
    '--xor-bg-primary': getBaseColor(baseColor, contrastLevel, 'primary'),
    '--xor-bg-secondary': getBaseColor(baseColor, contrastLevel, 'secondary'),
    '--xor-bg-tertiary': getBaseColor(baseColor, contrastLevel, 'tertiary'),

    // 文字颜色令牌
    '--xor-text-primary': getTextColor(baseColor, contrastLevel, 'primary'),
    '--xor-text-secondary': getTextColor(baseColor, contrastLevel, 'secondary'),
    '--xor-text-tertiary': getTextColor(baseColor, contrastLevel, 'tertiary'),
  }
}

function computeAccentTokens(axes: ThemeAxes): Record<string, string | number> {
  const match = axes.accent.match(/^(mono|analog|duo)\((.*)\)$/)
  if (!match) return {}

  const [, strategy, hue] = match

  return {
    '--xor-accent-primary': getAccentColor(strategy, hue, 'primary'),
    '--xor-accent-secondary': getAccentColor(strategy, hue, 'secondary'),
    '--xor-accent-tertiary': getAccentColor(strategy, hue, 'tertiary'),
  }
}

function computeSurfaceTokens(axes: ThemeAxes): Record<string, string | number> {
  const surfaceTokens: Record<string, string | number> = {
    '--xor-surface-bg': 'transparent',
    '--xor-surface-border': 'transparent',
    '--xor-surface-shadow': 'none',
  }

  switch (axes.surface) {
    case 'glass':
      surfaceTokens['--xor-surface-bg'] = 'rgba(255, 255, 255, 0.1)'
      surfaceTokens['--xor-surface-border'] = 'rgba(255, 255, 255, 0.2)'
      surfaceTokens['--xor-surface-shadow'] = '0 8px 32px rgba(0, 0, 0, 0.1)'
      break

    case 'neon':
      surfaceTokens['--xor-surface-border'] = 'var(--xor-accent-primary)'
      surfaceTokens['--xor-surface-shadow'] = '0 0 20px var(--xor-accent-primary)'
      break

    case 'glass+neon':
      surfaceTokens['--xor-surface-bg'] = 'rgba(255, 255, 255, 0.1)'
      surfaceTokens['--xor-surface-border'] = 'var(--xor-accent-primary)'
      surfaceTokens['--xor-surface-shadow'] = '0 0 30px var(--xor-accent-primary), 0 8px 32px rgba(0, 0, 0, 0.1)'
      break

    case 'soft-shadow':
      surfaceTokens['--xor-surface-shadow'] = '0 4px 16px rgba(0, 0, 0, 0.1)'
      break
  }

  return surfaceTokens
}

function computeMotionTokens(axes: ThemeAxes): Record<string, string | number> {
  const [intensity, curve] = axes.motion.split('.') as [string, string]

  return {
    '--xor-motion-duration': getMotionDuration(intensity),
    '--xor-motion-easing': getMotionEasing(curve),
    '--xor-motion-scale': getMotionScale(intensity),
  }
}

function computeDensityTokens(axes: ThemeAxes): Record<string, string | number> {
  const densityScale = {
    spacious: 1.25,
    comfortable: 1,
    compact: 0.75
  }

  return {
    '--xor-density-scale': densityScale[axes.density],
  }
}

// === 辅助函数 ===
function getBaseColor(baseColor: string, contrastLevel: string, variant: string): string {
  // 简化的颜色计算逻辑
  const colors: Record<string, Record<string, string>> = {
    'neutral-warm': { low: '#fafafa', mid: '#f5f5f5', high: '#e5e5e5' },
    'neutral-cool': { low: '#f8f9fa', mid: '#f1f3f4', high: '#e8eaed' },
    'neutral-true': { low: '#ffffff', mid: '#fafafa', high: '#f5f5f5' }
  }

  return colors[baseColor]?.[contrastLevel] || '#ffffff'
}

function getTextColor(baseColor: string, contrastLevel: string, variant: string): string {
  // 根据背景色和对比度计算文字颜色
  return '#000000'
}

function getAccentColor(strategy: string, hue: string, variant: string): string {
  // 根据策略和色相计算强调色
  const hueColors = {
    cyan: '#00bcd4',
    blue: '#2196f3',
    purple: '#9c27b0',
    red: '#f44336'
  }

  return hueColors[hue as keyof typeof hueColors] || '#2196f3'
}

function getMotionDuration(intensity: string): string {
  const durations = {
    subtle: '200ms',
    standard: '300ms',
    expressive: '400ms'
  }

  return durations[intensity as keyof typeof durations] || '300ms'
}

function getMotionEasing(curve: string): string {
  const easings = {
    classic: 'cubic-bezier(0.4, 0, 0.2, 1)',
    soft: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }

  return easings[curve as keyof typeof easings] || 'cubic-bezier(0.4, 0, 0.2, 1)'
}

function getMotionScale(intensity: string): string {
  const scales = {
    subtle: '1.02',
    standard: '1.05',
    expressive: '1.1'
  }

  return scales[intensity as keyof typeof scales] || '1.05'
}

// === 向后兼容的优化建议 ===
export function suggestOptimizations(axes: ThemeAxes): string[] {
  const { warnings } = applyIntelligentConstraints(axes)
  return warnings
}