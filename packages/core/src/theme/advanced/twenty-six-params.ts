/**
 * 🎛️ 26参数七轴主题系统 - 类型定义
 *
 * 完整的26参数精细控制系统，支持：
 * - 七轴核心系统 (7个参数)
 * - 字体系统 (5个参数)
 * - 尺寸比例 (6个参数)
 * - 间距系统 (8个参数)
 */

import type { ColorScale } from '../seven-axis-calculator'

// ============================================================================
// 七轴核心参数 (7个)
// ============================================================================

/**
 * 模式轴 - 控制主题的基础模式
 */
export type ThemeMode = 'light' | 'dark' | 'auto' | 'sepia'

export interface ModeConfig {
  mode: ThemeMode
  autoDetectSystem: boolean
  sepiaIntensity: number // 0-1，用于 sepia 模式
}

/**
 * 色调轴 - 控制主色调的色相 (0-360°)
 */
export type HueValue = number // 0-360

export interface HueConfig {
  primary: HueValue
  secondary?: HueValue
  accent?: HueValue
  neutral?: HueValue
}

/**
 * 饱和度轴 - 控制颜色的鲜艳度 (0-1)
 */
export type SaturationValue = number // 0-1

export interface SaturationConfig {
  factor: SaturationValue
  strategy: 'uniform' | 'adaptive' | 'manual'
}

/**
 * 亮度轴 - 控制颜色的明暗 (0-1)
 */
export type LightnessValue = number // 0-1

export interface LightnessConfig {
  factor: LightnessValue
  contrast: number // 对比度调整 0-1
}

/**
 * 密度轴 - 控制空间紧凑度
 */
export type DensityLevel = 'compact' | 'comfortable' | 'spacious'

export interface DensityConfig {
  level: DensityLevel
  customScale?: number // 0.5-2.0 自定义比例
}

/**
 * 圆度轴 - 控制边角圆润度 (0-1)
 */
export type RoundnessValue = number // 0-1

export interface RoundnessConfig {
  level: RoundnessValue
  radius: number // 基础圆角半径 (px)
}

/**
 * 对比度轴 - 控制视觉对比度
 */
export type ContrastLevel = 'low' | 'normal' | 'high' | 'custom'

export interface ContrastConfig {
  level: ContrastLevel
  ratio: number // 对比度比例
}

/**
 * 七轴核心配置
 */
export interface SevenAxisCoreParams {
  mode: ModeConfig
  hue: HueConfig
  saturation: SaturationConfig
  lightness: LightnessConfig
  density: DensityConfig
  roundness: RoundnessConfig
  contrast: ContrastConfig
}

// ============================================================================
// 字体系统参数 (5个)
// ============================================================================

/**
 * 字体配置
 */
export interface FontConfig {
  family: string
  weight: number // 100-900
  style: 'normal' | 'italic'
  size?: number // 字体大小
  lineHeight?: number // 行高
}

/**
 * 字体系统配置
 */
export interface FontSystem {
  primary: FontConfig
  secondary: FontConfig
  mono: FontConfig
  display: FontConfig
  code: FontConfig
}

// ============================================================================
// 尺寸比例参数 (6个)
// ============================================================================

/**
 * 尺寸比例配置
 */
export interface SizeScale {
  xs: number // e.g., 12px
  sm: number // e.g., 14px
  md: number // e.g., 16px
  lg: number // e.g., 18px
  xl: number // e.g., 24px
  '2xl': number // e.g., 30px
}

// ============================================================================
// 间距系统参数 (8个)
// ============================================================================

/**
 * 间距系统配置
 */
export interface SpacingSystem {
  space0: number  // 0px
  space1: number  // 4px
  space2: number  // 8px
  space3: number  // 12px
  space4: number  // 16px
  space5: number  // 20px
  space6: number  // 24px
  space7: number  // 32px
}

// ============================================================================
// 高级参数集合
// ============================================================================

/**
 * 高级参数配置
 */
export interface AdvancedParams {
  fonts: FontSystem
  sizes: SizeScale
  spacing: SpacingSystem
}

// ============================================================================
// 完整的26参数配置
// ============================================================================

/**
 * 完整的26参数主题配置
 */
export interface TwentySixParams {
  // 七轴核心系统 (7个参数)
  mode: ModeConfig
  hue: HueConfig
  saturation: SaturationConfig
  lightness: LightnessConfig
  density: DensityConfig
  roundness: RoundnessConfig
  contrast: ContrastConfig

  // 字体系统 (5个参数)
  fonts: FontSystem

  // 尺寸比例 (6个参数)
  sizes: SizeScale

  // 间距系统 (8个参数)
  spacing: SpacingSystem
}

// ============================================================================
// 计算结果类型
// ============================================================================

/**
 * 主题计算结果
 */
export interface ThemeCalculationResult {
  // 颜色系统
  colors: {
    primary: ColorScale
    secondary?: ColorScale
    accent?: ColorScale
    neutral: ColorScale
    semantic: {
      success: ColorScale
      warning: ColorScale
      error: ColorScale
      info: ColorScale
    }
  }

  // 字体系统
  typography: {
    families: Record<string, string>
    sizes: Record<string, number>
    weights: Record<string, number>
    lineHeights: Record<string, number>
  }

  // 尺寸和间距
  layout: {
    sizes: SizeScale
    spacing: SpacingSystem
    radii: {
      none: number
      sm: number
      md: number
      lg: number
      xl: number
      full: number
    }
  }

  // CSS变量
  cssVariables: Record<string, string>

  // 元数据
  metadata: {
    calculatedAt: number
    calculationTime: number
    version: string
  }
}

// ============================================================================
// 配置器相关类型
// ============================================================================

/**
 * 预设主题元数据
 */
export interface PresetThemeMeta {
  id: string
  name: string
  description: string
  category: string
  tags: string[]
  author: string
  rating: number
  downloads: number
  isPopular?: boolean
  isNew?: boolean
}

/**
 * 完整预设主题
 */
export interface PresetTheme extends PresetThemeMeta {
  parameters: TwentySixParams
  createdAt: Date
  updatedAt: Date
}

/**
 * 用户自定义主题
 */
export interface UserTheme extends PresetThemeMeta {
  parameters: TwentySixParams
  isModified: boolean
  originalParameters?: TwentySixParams
}

// ============================================================================
// UI组件相关类型
// ============================================================================

/**
 * 参数控制组件通用属性
 */
export interface ControlProps<T> {
  value: T
  onChange: (value: T) => void
  disabled?: boolean
  className?: string
}

/**
 * 色相选择器属性
 */
export interface HueSelectorProps extends ControlProps<HueValue> {
  showSecondary?: boolean
  showAccent?: boolean
  secondaryValue?: HueValue
  accentValue?: HueValue
  onSecondaryChange?: (value: HueValue) => void
  onAccentChange?: (value: HueValue) => void
}

/**
 * 滑块组件属性
 */
export interface SliderProps extends ControlProps<number> {
  min: number
  max: number
  step?: number
  formatValue?: (value: number) => string
  showValue?: boolean
  unit?: string
}

/**
 * 选择器组件属性
 */
export interface SelectorProps<T extends string> extends ControlProps<T> {
  options: Array<{
    value: T
    label: string
    icon?: string
    description?: string
  }>
}

/**
 * 预览组件属性
 */
export interface PreviewProps {
  parameters: TwentySixParams
  components?: Array<{
    name: string
    component: React.ComponentType<any>
  }>
  showGrid?: boolean
  className?: string
}

// ============================================================================
// 默认值和常量
// ============================================================================

/**
 * 默认26参数配置
 */
export const DEFAULT_TWENTY_SIX_PARAMS: TwentySixParams = {
  // 七轴核心
  mode: {
    mode: 'light',
    autoDetectSystem: true,
    sepiaIntensity: 0
  },
  hue: {
    primary: 240, // 蓝色
    secondary: 280,
    accent: 160
  },
  saturation: {
    factor: 0.6,
    strategy: 'uniform'
  },
  lightness: {
    factor: 1.0,
    contrast: 0.5
  },
  density: {
    level: 'comfortable',
    customScale: 1.0
  },
  roundness: {
    level: 0.5,
    radius: 4
  },
  contrast: {
    level: 'normal',
    ratio: 0.5
  },

  // 字体系统
  fonts: {
    primary: {
      family: 'Inter, system-ui, sans-serif',
      weight: 400,
      style: 'normal',
      size: 16,
      lineHeight: 1.5
    },
    secondary: {
      family: 'Inter, system-ui, sans-serif',
      weight: 500,
      style: 'normal'
    },
    mono: {
      family: 'JetBrains Mono, Consolas, monospace',
      weight: 400,
      style: 'normal'
    },
    display: {
      family: 'Inter, system-ui, sans-serif',
      weight: 700,
      style: 'normal'
    },
    code: {
      family: 'JetBrains Mono, Consolas, monospace',
      weight: 500,
      style: 'normal'
    }
  },

  // 尺寸比例
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    '2xl': 30
  },

  // 间距系统
  spacing: {
    space0: 0,
    space1: 4,
    space2: 8,
    space3: 12,
    space4: 16,
    space5: 20,
    space6: 24,
    space7: 32
  }
}

/**
 * 预设色相值 (快捷选择)
 */
export const PRESET_HUES = [
  { name: 'red', value: 0, color: '#ef4444' },
  { name: 'orange', value: 30, color: '#f97316' },
  { name: 'yellow', value: 60, color: '#eab308' },
  { name: 'lime', value: 90, color: '#84cc16' },
  { name: 'green', value: 120, color: '#22c55e' },
  { name: 'teal', value: 160, color: '#14b8a6' },
  { name: 'cyan', value: 180, color: '#06b6d4' },
  { name: 'sky', value: 200, color: '#0ea5e9' },
  { name: 'blue', value: 240, color: '#3b82f6' },
  { name: 'indigo', value: 260, color: '#6366f1' },
  { name: 'violet', value: 280, color: '#8b5cf6' },
  { name: 'purple', value: 300, color: '#a855f7' },
  { name: 'fuchsia', value: 320, color: '#d946ef' },
  { name: 'pink', value: 330, color: '#ec4899' },
  { name: 'rose', value: 350, color: '#f43f5e' }
]

/**
 * 常用字体列表
 */
export const COMMON_FONTS = {
  sans: [
    'Inter, system-ui, sans-serif',
    'Roboto, system-ui, sans-serif',
    'Helvetica Neue, Helvetica, sans-serif',
    'Arial, sans-serif',
    'system-ui, sans-serif'
  ],
  serif: [
    'Georgia, serif',
    'Times New Roman, serif',
    'Playfair Display, serif',
    'Merriweather, serif'
  ],
  mono: [
    'JetBrains Mono, Consolas, monospace',
    'Fira Code, monospace',
    'Source Code Pro, monospace',
    'Consolas, monospace',
    'monospace'
  ],
  display: [
    'Inter, system-ui, sans-serif',
    'Poppins, sans-serif',
    'Montserrat, sans-serif',
    'Playfair Display, serif',
    'Oswald, sans-serif'
  ]
}

// ============================================================================
// 验证函数
// ============================================================================

/**
 * 验证参数是否在有效范围内
 */
export function validateTwentySixParams(params: Partial<TwentySixParams>): boolean {
  try {
    // 验证色相
    if (params.hue) {
      const { primary, secondary, accent } = params.hue
      if (primary !== undefined && (primary < 0 || primary > 360)) return false
      if (secondary !== undefined && (secondary < 0 || secondary > 360)) return false
      if (accent !== undefined && (accent < 0 || accent > 360)) return false
    }

    // 验证饱和度和亮度
    if (params.saturation?.factor !== undefined) {
      if (params.saturation.factor < 0 || params.saturation.factor > 1) return false
    }
    if (params.lightness?.factor !== undefined) {
      if (params.lightness.factor < 0 || params.lightness.factor > 1) return false
    }

    // 验证圆度
    if (params.roundness?.level !== undefined) {
      if (params.roundness.level < 0 || params.roundness.level > 1) return false
    }

    // 验证字体权重
    if (params.fonts) {
      const fonts = params.fonts
      if (fonts.primary?.weight !== undefined && (fonts.primary.weight < 100 || fonts.primary.weight > 900)) return false
      // ... 其他字体验证
    }

    return true
  } catch {
    return false
  }
}

/**
 * 深度克隆参数对象
 */
export function cloneTwentySixParams(params: TwentySixParams): TwentySixParams {
  return JSON.parse(JSON.stringify(params))
}

/**
 * 重置为默认值
 */
export function resetToDefaults(): TwentySixParams {
  return cloneTwentySixParams(DEFAULT_TWENTY_SIX_PARAMS)
}

// ============================================================================
// 工具函数
// ============================================================================

/**
 * 格式化参数值用于显示
 */
export function formatParamValue(value: any, type: 'hue' | 'saturation' | 'lightness' | 'roundness' | 'number'): string {
  switch (type) {
    case 'hue':
      return `${Math.round(value as number)}°`
    case 'saturation':
    case 'lightness':
    case 'roundness':
      return `${Math.round((value as number) * 100)}%`
    case 'number':
      return String(value)
    default:
      return String(value)
  }
}

/**
 * 获取参数总数
 */
export function getParamCount(): number {
  return 26
}

/**
 * 获取参数分类计数
 */
export function getParamCounts() {
  return {
    sevenAxis: 7,
    fonts: 5,
    sizes: 6,
    spacing: 8,
    total: 26
  }
}
