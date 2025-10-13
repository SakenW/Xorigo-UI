/**
 * 🎨 TH-UI 令牌系统 - 统一导出
 *
 * 基于 DTCG 标准的设计令牌系统
 * 从 src/tokens/ 目录动态加载令牌数据
 */

// ============================================================================
// 兼容性导出 - 旧版颜色令牌 (Legacy Color Tokens Export)
// ============================================================================

export * from './colors'

// ============================================================================
// 核心令牌导出 (Core Tokens Export)
// ============================================================================

import neutralScaleData from './core/palettes/neutralScale.json'
import blueScaleData from './core/palettes/blueScale.json'
import cyanScaleData from './core/palettes/cyanScale.json'
import purpleScaleData from './core/palettes/purpleScale.json'
import stateColorsData from './core/palettes/stateColors.json'

import typographyData from './core/foundations/typography.json'
import spacingData from './core/foundations/spacing.json'

// 再导出供外部使用
export { neutralScaleData as neutralScale }
export { blueScaleData as blueScale }
export { cyanScaleData as cyanScale }
export { purpleScaleData as purpleScale }
export { stateColorsData as stateColors }
export { typographyData as typography }
export { spacingData as spacing }

// ============================================================================
// 配方导出 (Recipes Export)
// ============================================================================

import corporateBlueData from './recipes/corporate-blue/meta.json'
export { corporateBlueData as corporateBlue }

// ============================================================================
// 密度预设导出 (Density Presets Export)
// ============================================================================

import comfortableData from './density-presets/comfortable.json'
import spaciousData from './density-presets/spacious.json'
import compactData from './density-presets/compact.json'

export { comfortableData as comfortable }
export { spaciousData as spacious }
export { compactData as compact }

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
  [key: string]: DTCGToken | string | any
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
  axes?: {
    mode?: 'light' | 'dark' | 'hc'
    base?: { neutral: string, contrast: string }
    accent?: { strategy: string, hues: string[] }
    tone?: 'calm' | 'standard' | 'vivid'
    density?: 'spacious' | 'comfortable' | 'compact'
    motion?: { pack: string, curve: string }
    surface?: string[]
  }
  oklchTone?: Record<string, { dC: number, dL: number }>
  a11y?: {
    text: number
    largeText: number
    nonText: number
  }
  [key: string]: any // 允许额外的 DTCG 元数据字段
}

export interface DTCGDensityPreset {
  multipliers?: {
    typography?: Record<string, number | any>
    spacing?: Record<string, number | any>
    sizing?: Record<string, number | any>
    border?: Record<string, number | any>
    shadow?: Record<string, number | any>
  }
  [key: string]: any // 允许额外的 DTCG 元数据字段
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
      neutralScale: neutralScaleData as DTCGPalette,
      blueScale: blueScaleData as DTCGPalette,
      cyanScale: cyanScaleData as DTCGPalette,
      purpleScale: purpleScaleData as DTCGPalette,
      stateColors: stateColorsData as DTCGPalette
    },
    foundations: {
      typography: typographyData,
      spacing: spacingData
    }
  }
}

/**
 * 获取所有配方元数据
 */
export function getAllRecipeMeta(): Record<string, DTCGRecipeMeta> {
  return {
    'corporate-blue': corporateBlueData as unknown as DTCGRecipeMeta
  }
}

/**
 * 获取所有密度预设
 */
export function getAllDensityPresets(): Record<string, DTCGDensityPreset> {
  return {
    comfortable: comfortableData as DTCGDensityPreset,
    spacious: spaciousData as DTCGDensityPreset,
    compact: compactData as DTCGDensityPreset
  }
}