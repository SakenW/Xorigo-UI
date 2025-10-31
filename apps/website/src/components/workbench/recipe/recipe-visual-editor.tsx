/**
 * 配方可视化编辑器
 * 提供实时的配方预览、编辑和七轴主题系统支持
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Badge } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import type { Recipe } from '../workbench-types'

/**
 * 七轴主题配置
 */
export interface SevenAxisTheme {
  /** 模式轴 - light/dark/auto */
  mode: 'light' | 'dark' | 'auto'
  /** 色调轴 - 0-360度色相 */
  hue: number
  /** 饱和度轴 - 0-100% */
  saturation: number
  /** 亮度轴 - 0-100% */
  lightness: number
  /** 密度轴 - compact/comfortable/spacious */
  density: 'compact' | 'comfortable' | 'spacious'
  /** 圆度轴 - 0-100% */
  roundness: number
  /** 对比度轴 - low/normal/high */
  contrast: 'low' | 'normal' | 'high'
}

/**
 * 配方编辑器属性
 */
export interface RecipeVisualEditorProps {
  /** 当前配方 */
  recipe: Recipe
  /** 配方更新回调 */
  onRecipeChange?: (recipe: Recipe) => void
  /** 主题配置 */
  theme?: SevenAxisTheme
  /** 主题更新回调 */
  onThemeChange?: (theme: SevenAxisTheme) => void
  /** 预设主题列表 */
  presetThemes?: SevenAxisTheme[]
  /** 是否显示高级选项 */
  showAdvanced?: boolean
  /** 是否启用实时预览 */
  livePreview?: boolean
  /** 自定义CSS变量 */
  customCSS?: Record<string, string>
}

/**
 * 颜色工具函数
 */
class ColorUtils {
  /**
   * HSL转RGB
   */
  static hslToRgb(h: number, s: number, l: number): [number, number, number] {
    h = h / 360
    s = s / 100
    l = l / 100

    let r, g, b

    if (s === 0) {
      r = g = b = l
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1
        if (t > 1) t -= 1
        if (t < 1/6) return p + (q - p) * 6 * t
        if (t < 1/2) return q
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
        return p
      }

      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)]
  }

  /**
   * RGB转十六进制
   */
  static rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16)
      return hex.length === 1 ? '0' + hex : hex
    }).join('')
  }

  /**
   * 生成基于主题的颜色
   */
  static generateThemeColors(theme: SevenAxisTheme): string[] {
    const { hue, saturation, lightness } = theme

    const colors = [
      // 主色
      ColorUtils.rgbToHex(...ColorUtils.hslToRgb(hue, saturation, lightness)),
      // 次色（色相偏移30度）
      ColorUtils.rgbToHex(...ColorUtils.hslToRgb((hue + 30) % 360, saturation * 0.8, lightness)),
      // 强调色（色相偏移60度）
      ColorUtils.rgbToHex(...ColorUtils.hslToRgb((hue + 60) % 360, saturation * 1.2, Math.min(lightness * 0.8, 100))),
      // 背景色
      theme.mode === 'dark'
        ? ColorUtils.rgbToHex(...ColorUtils.hslToRgb(hue, saturation * 0.1, 10))
        : ColorUtils.rgbToHex(...ColorUtils.hslToRgb(hue, saturation * 0.1, 95)),
      // 文本色
      theme.mode === 'dark'
        ? ColorUtils.rgbToHex(...ColorUtils.hslToRgb(hue, saturation * 0.2, 90))
        : ColorUtils.rgbToHex(...ColorUtils.hslToRgb(hue, saturation * 0.3, 20)),
      // 边框色
      theme.mode === 'dark'
        ? ColorUtils.rgbToHex(...ColorUtils.hslToRgb(hue, saturation * 0.2, 25))
        : ColorUtils.rgbToHex(...ColorUtils.hslToRgb(hue, saturation * 0.2, 85)),
      // 阴影色
      ColorUtils.rgbToHex(...ColorUtils.hslToRgb(hue, saturation * 0.3, theme.mode === 'dark' ? 5 : 50)),
      // 高亮色
      ColorUtils.rgbToHex(...ColorUtils.hslToRgb(hue, saturation, theme.mode === 'dark' ? 15 : 95)),
    ]

    return colors
  }

  /**
   * 计算对比度
   */
  static calculateContrast(color1: string, color2: string): number {
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : { r: 0, g: 0, b: 0 }
    }

    const rgb1 = hexToRgb(color1)
    const rgb2 = hexToRgb(color2)

    const luminance = (color: { r: number, g: number, b: number }) => {
      const sRGB = [color.r, color.g, color.b].map(val => {
        val = val / 255
        return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2]
    }

    const lum1 = luminance(rgb1)
    const lum2 = luminance(rgb2)

    return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05)
  }
}

/**
 * 预设主题配置
 */
const PRESET_THEMES: SevenAxisTheme[] = [
  {
    mode: 'light',
    hue: 220,
    saturation: 70,
    lightness: 50,
    density: 'comfortable',
    roundness: 8,
    contrast: 'normal'
  },
  {
    mode: 'dark',
    hue: 220,
    saturation: 60,
    lightness: 60,
    density: 'comfortable',
    roundness: 12,
    contrast: 'normal'
  },
  {
    mode: 'light',
    hue: 0,
    saturation: 65,
    lightness: 55,
    density: 'spacious',
    roundness: 4,
    contrast: 'high'
  },
  {
    mode: 'light',
    hue: 120,
    saturation: 50,
    lightness: 45,
    density: 'compact',
    roundness: 16,
    contrast: 'low'
  },
  {
    mode: 'auto',
    hue: 280,
    saturation: 75,
    lightness: 58,
    density: 'comfortable',
    roundness: 20,
    contrast: 'normal'
  }
]

/**
 * 配方可视化编辑器组件
 */
export function RecipeVisualEditor({
  recipe,
  onRecipeChange,
  theme: initialTheme,
  onThemeChange,
  presetThemes = PRESET_THEMES,
  showAdvanced = false,
  livePreview = true,
  customCSS = {},
}: RecipeVisualEditorProps) {
  const [theme, setTheme] = useState<SevenAxisTheme>(initialTheme || PRESET_THEMES[0])
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<'basic' | 'advanced'>('basic')

  // 计算主题颜色
  const themeColors = useMemo(() => {
    return ColorUtils.generateThemeColors(theme)
  }, [theme])

  // 生成CSS变量
  const cssVariables = useMemo(() => {
    const variables: Record<string, string> = {
      '--color-primary': themeColors[0],
      '--color-secondary': themeColors[1],
      '--color-accent': themeColors[2],
      '--color-background': themeColors[3],
      '--color-text': themeColors[4],
      '--color-border': themeColors[5],
      '--color-shadow': themeColors[6],
      '--color-highlight': themeColors[7],
      '--roundness': `${theme.roundness}px`,
      '--density-multiplier': theme.density === 'compact' ? '0.75' : theme.density === 'spacious' ? '1.25' : '1',
      '--contrast-ratio': theme.contrast === 'low' ? '3' : theme.contrast === 'high' ? '7' : '4.5',
      ...customCSS
    }

    return variables
  }, [themeColors, theme.roundness, theme.density, theme.contrast, customCSS])

  /**
   * 更新主题
   */
  const updateTheme = useCallback((updates: Partial<SevenAxisTheme>) => {
    const newTheme = { ...theme, ...updates }
    setTheme(newTheme)
    onThemeChange?.(newTheme)

    // 更新配方颜色
    if (livePreview && onRecipeChange) {
      const updatedRecipe: Recipe = {
        ...recipe,
        colors: themeColors,
      }
      onRecipeChange(updatedRecipe)
    }
  }, [theme, onThemeChange, livePreview, onRecipeChange, recipe, themeColors])

  /**
   * 应用预设主题
   */
  const applyPresetTheme = useCallback((presetTheme: SevenAxisTheme) => {
    updateTheme(presetTheme)
  }, [updateTheme])

  /**
   * 导出主题配置
   */
  const exportTheme = useCallback(() => {
    const themeData = {
      theme,
      colors: themeColors,
      cssVariables,
      recipe: {
        ...recipe,
        colors: themeColors
      }
    }

    const blob = new Blob([JSON.stringify(themeData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${recipe.name}-theme.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [theme, themeColors, cssVariables, recipe])

  /**
   * 渲染主题预览组件
   */
  const ThemePreview = () => (
    <div
      className="p-6 rounded-lg space-y-4 transition-all duration-300"
      style={{
        backgroundColor: cssVariables['--color-background'],
        color: cssVariables['--color-text'],
        border: `1px solid ${cssVariables['--color-border']}`,
        borderRadius: cssVariables['--roundness'],
        boxShadow: `0 4px 6px ${cssVariables['--color-shadow']}40`,
      }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold" style={{ color: cssVariables['--color-primary'] }}>
          {recipe.name}
        </h3>
        <Badge variant="secondary" style={{
          backgroundColor: cssVariables['--color-accent'],
          color: cssVariables['--color-background']
        }}>
          预览
        </Badge>
      </div>

      <p className="text-sm opacity-80" style={{ lineHeight: `${1.5 * parseFloat(cssVariables['--density-multiplier'] || '1')}` }}>
        {recipe.description}
      </p>

      {/* 颜色展示 */}
      <div className="grid grid-cols-4 gap-2">
        {themeColors.map((color, index) => (
          <div key={index} className="text-center space-y-1">
            <div
              className="w-full h-12 rounded-md border-2 transition-transform hover:scale-105"
              style={{
                backgroundColor: color,
                borderColor: cssVariables['--color-border'],
                borderRadius: cssVariables['--roundness']
              }}
              title={color}
            />
            <span className="text-xs font-mono opacity-70">{color}</span>
          </div>
        ))}
      </div>

      {/* 示例组件 */}
      <div className="space-y-3 pt-3 border-t" style={{ borderColor: cssVariables['--color-border'] }}>
        <Button
          style={{
            backgroundColor: cssVariables['--color-primary'],
            color: cssVariables['--color-highlight'],
            borderRadius: cssVariables['--roundness'],
            padding: `${8 * parseFloat(cssVariables['--density-multiplier'] || '1')}px ${16 * parseFloat(cssVariables['--density-multiplier'] || '1')}px`
          }}
        >
          主要按钮
        </Button>

        <Card style={{
          backgroundColor: cssVariables['--color-highlight'],
          borderColor: cssVariables['--color-border'],
          borderRadius: cssVariables['--roundness']
        }}>
          <CardHeader>
            <CardTitle style={{ color: cssVariables['--color-text'] }}>示例卡片</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm" style={{ color: cssVariables['--color-text'], opacity: 0.8 }}>
              这是一个使用当前主题的示例卡片，展示了主题在不同组件上的效果。
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 可访问性信息 */}
      <div className="text-xs space-y-1 pt-2 border-t" style={{ borderColor: cssVariables['--color-border'] }}>
        <div className="flex justify-between">
          <span>对比度:</span>
          <span>{ColorUtils.calculateContrast(cssVariables['--color-text'], cssVariables['--color-background']).toFixed(2)}:1</span>
        </div>
        <div className="flex justify-between">
          <span>圆度:</span>
          <span>{theme.roundness}px</span>
        </div>
        <div className="flex justify-between">
          <span>密度:</span>
          <span>{theme.density}</span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="recipe-visual-editor space-y-6">
      {/* 标题和操作 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">配方可视化编辑器</h2>
          <p className="text-sm text-muted-foreground">调整七轴主题系统参数，实时预览效果</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? '预览模式' : '编辑模式'}
          </Button>
          <Button variant="outline" size="sm" onClick={exportTheme}>
            导出配置
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 左侧：编辑器 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>主题配置</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* 预设主题 */}
              <div>
                <label className="text-sm font-medium mb-2 block">预设主题</label>
                <div className="grid grid-cols-2 gap-2">
                  {presetThemes.map((preset, index) => (
                    <Button
                      key={index}
                      variant={JSON.stringify(theme) === JSON.stringify(preset) ? "default" : "outline"}
                      size="sm"
                      onClick={() => applyPresetTheme(preset)}
                      className="justify-start"
                    >
                      {preset.mode === 'dark' ? '🌙' : '☀️'} {preset.mode === 'auto' ? '自动' : preset.mode === 'dark' ? '深色' : '浅色'}
                    </Button>
                  ))}
                </div>
              </div>

              {/* 基础设置 */}
              {activeTab === 'basic' && (
                <div className="space-y-4">
                  {/* 模式设置 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">模式</label>
                    <div className="flex space-x-2">
                      {[
                        { value: 'light', label: '☀️ 浅色' },
                        { value: 'dark', label: '🌙 深色' },
                        { value: 'auto', label: '🔄 自动' }
                      ].map(mode => (
                        <Button
                          key={mode.value}
                          variant={theme.mode === mode.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateTheme({ mode: mode.value as any })}
                        >
                          {mode.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* 色调调节 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      色调 ({theme.hue}°)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={theme.hue}
                      onChange={(e) => updateTheme({ hue: parseInt(e.target.value) })}
                      className="w-full h-2 bg-gradient-to-r from-red-500 via-green-500 to-blue-500 rounded-lg appearance-none cursor-pointer"
                      disabled={!isEditing}
                    />
                  </div>

                  {/* 饱和度调节 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      饱和度 ({theme.saturation}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={theme.saturation}
                      onChange={(e) => updateTheme({ saturation: parseInt(e.target.value) })}
                      className="w-full"
                      disabled={!isEditing}
                    />
                  </div>

                  {/* 亮度调节 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      亮度 ({theme.lightness}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={theme.lightness}
                      onChange={(e) => updateTheme({ lightness: parseInt(e.target.value) })}
                      className="w-full"
                      disabled={!isEditing}
                    />
                  </div>

                  {/* 圆度调节 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      圆度 ({theme.roundness}px)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={theme.roundness}
                      onChange={(e) => updateTheme({ roundness: parseInt(e.target.value) })}
                      className="w-full"
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              )}

              {/* 高级设置 */}
              {activeTab === 'advanced' && showAdvanced && (
                <div className="space-y-4">
                  {/* 密度设置 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">密度</label>
                    <div className="flex space-x-2">
                      {[
                        { value: 'compact', label: '紧凑' },
                        { value: 'comfortable', label: '舒适' },
                        { value: 'spacious', label: '宽松' }
                      ].map(density => (
                        <Button
                          key={density.value}
                          variant={theme.density === density.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateTheme({ density: density.value as any })}
                          disabled={!isEditing}
                        >
                          {density.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* 对比度设置 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">对比度</label>
                    <div className="flex space-x-2">
                      {[
                        { value: 'low', label: '低' },
                        { value: 'normal', label: '正常' },
                        { value: 'high', label: '高' }
                      ].map(contrast => (
                        <Button
                          key={contrast.value}
                          variant={theme.contrast === contrast.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => updateTheme({ contrast: contrast.value as any })}
                          disabled={!isEditing}
                        >
                          {contrast.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* 自定义CSS变量 */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">自定义CSS变量</label>
                    <div className="space-y-2">
                      {Object.entries(customCSS).map(([key, value]) => (
                        <div key={key} className="flex items-center space-x-2">
                          <Input
                            placeholder="变量名"
                            value={key}
                            disabled
                            className="flex-1"
                          />
                          <Input
                            placeholder="变量值"
                            value={value}
                            disabled
                            className="flex-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 标签切换 */}
              {showAdvanced && (
                <div className="flex space-x-2 border-t pt-4">
                  <Button
                    variant={activeTab === 'basic' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('basic')}
                  >
                    基础设置
                  </Button>
                  <Button
                    variant={activeTab === 'advanced' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setActiveTab('advanced')}
                  >
                    高级设置
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* 右侧：预览 */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>实时预览</CardTitle>
            </CardHeader>
            <CardContent>
              <ThemePreview />
            </CardContent>
          </Card>

          {/* CSS变量显示 */}
          <Card>
            <CardHeader>
              <CardTitle>CSS变量</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-48 overflow-auto">
                <pre className="text-xs bg-muted p-3 rounded-md">
                  {Object.entries(cssVariables).map(([key, value]) => (
                    <div key={key}>
                      <span style={{ color: cssVariables['--color-primary'] }}>{key}</span>
                      : <span style={{ color: cssVariables['--color-accent'] }}>{value}</span>;
                    </div>
                  ))}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}