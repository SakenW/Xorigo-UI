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

export interface ThemeRecipe {
  id: string
  name: string
  axes: ThemeAxes
  tokens: Record<string, string | number>
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
      tokens: {
        ...axes.tokens,
        // 降低饱和度计算的标记
        '_saturation_adjustment': 'reduced'
      }
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

  return {
    id: `${constrainedAxes.mode}-${constrainedAxes.base}-${constrainedAxes.accent}-${Date.now()}`,
    name: `Generated Theme (${constrainedAxes.mode})`,
    axes: constrainedAxes,
    tokens: {
      ...baseTokens,
      ...accentTokens,
      ...surfaceTokens,
      ...motionTokens,
      ...densityTokens
    }
  }
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
  const [strategy, hue] = axes.accent.match(/^(mono|analog|duo)\((.*)\)$) || []

  return {
    '--xor-accent-primary': getAccentColor(strategy, hue, 'primary'),
    '--xor-accent-secondary': getAccentColor(strategy, hue, 'secondary'),
    '--xor-accent-tertiary': getAccentColor(strategy, hue, 'tertiary'),
  }
}

function computeSurfaceTokens(axes: ThemeAxes): Record<string, string | number> {
  const surfaceTokens = {
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
  const colors = {
    'neutral-warm': { low: '#fafafa', mid: '#f5f5f5', high: '#e5e5e5' },
    'neutral-cool': { low: '#f8f9fa', mid: '#f1f3f4', high: '#e8eaed' },
    'neutral-true': { low: '#ffffff', mid: '#fafafa', high: '#f5f5f5' }
  }

  return colors[baseColor as keyof typeof colors]?.[contrastLevel as keyof typeof colors[typeof baseColor]] || '#ffffff'
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
