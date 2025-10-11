/**
 * 🎨 TH-UI 令牌系统 - 统一导出
 *
 * 基于 DTCG 标准的设计令牌系统
 * 从 src/tokens/ 目录动态加载令牌数据
 */

// ============================================================================
// 核心令牌导出 (Core Tokens Export)
// ============================================================================

export { default as neutralScale } from './core/palettes/neutralScale.json'
export { default as blueScale } from './core/palettes/blueScale.json'
export { default as cyanScale } from './core/palettes/cyanScale.json'
export { default as purpleScale } from './core/palettes/purpleScale.json'
export { default as stateColors } from './core/palettes/stateColors.json'

export { default as typography } from './core/foundations/typography.json'
export { default as spacing } from './core/foundations/spacing.json'

// ============================================================================
// 配方导出 (Recipes Export)
// ============================================================================

export { default as corporateBlue } from './recipes/corporate-blue/meta.json'

// ============================================================================
// 密度预设导出 (Density Presets Export)
// ============================================================================

export { default as comfortable } from './density-presets/comfortable.json'
export { default as spacious } from './density-presets/spacious.json'
export { default as compact } from './density-presets/compact.json'

// ============================================================================
// 组件别名导出 (Component Aliases Export)
// ============================================================================

export { default as buttonAliases } from './aliases/components/button.json'
export { default as cardAliases } from './aliases/components/card.json'

// ============================================================================
// 类型定义 (Type Definitions)
// ============================================================================

export interface DTCGToken {
  $value: string | number
  $type: string
  $description?: string
}

export interface DTCGPalette {
  [key: string]: DTCGToken
}

export interface DTCGCoreTokens {
  palettes: {
    neutralScale: DTCGPalette
    blueScale: DTCGPalette
    cyanScale: DTCGPalette
    purpleScale: DTCGPalette
    stateColors: DTCGPalette
  }
  foundations: {
    typography: Record<string, any>
    spacing: Record<string, any>
  }
}

export interface DTCGRecipeMeta {
  axes: {
    mode: 'light' | 'dark' | 'hc'
    base: { neutral: string, contrast: string }
    accent: { strategy: string, hues: string[] }
    tone: 'calm' | 'standard' | 'vivid'
    density: 'spacious' | 'comfortable' | 'compact'
    motion: { pack: string, curve: string }
    surface: string[]
  }
  oklchTone: Record<string, { dC: number, dL: number }>
  a11y: {
    text: number
    largeText: number
    nonText: number
  }
}

export interface DTCGDensityPreset {
  multipliers: {
    typography: Record<string, number>
    spacing: Record<string, number>
    sizing: Record<string, number>
    border: Record<string, number>
    shadow: Record<string, number>
  }
}

// ============================================================================
// 工具函数 (Utility Functions)
// ============================================================================

/**
 * 获取所有核心令牌
 */
export function getCoreTokens(): DTCGCoreTokens {
  return {
    palettes: {
      neutralScale,
      blueScale,
      cyanScale,
      purpleScale,
      stateColors
    },
    foundations: {
      typography,
      spacing
    }
  }
}

/**
 * 获取所有配方元数据
 */
export function getAllRecipeMeta(): Record<string, DTCGRecipeMeta> {
  return {
    'corporate-blue': corporateBlue
  }
}

/**
 * 获取所有密度预设
 */
export function getAllDensityPresets(): Record<string, DTCGDensityPreset> {
  return {
    comfortable,
    spacious,
    compact
  }
}