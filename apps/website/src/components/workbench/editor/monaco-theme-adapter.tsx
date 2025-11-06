/**
 * Monaco 编辑器七轴主题适配器
 * 将 Xorigo UI 的七轴主题系统转换为 Monaco Editor 主题
 */

'use client'

import { useEffect, useMemo, useState } from 'react'
import type { editor } from 'monaco-editor'
import * as monaco from 'monaco-editor'

// ============================================================================
// 七轴主题类型定义
// ============================================================================

/**
 * 七轴主题配置
 */
export interface SevenAxisTheme {
  /** 模式轴 - light/dark/auto */
  mode: 'light' | 'dark' | 'auto'
  /** 色调轴 - 色相选择 */
  hue: string
  /** 饱和度轴 - 0-1 */
  saturation: number
  /** 亮度轴 - 0-1 */
  lightness: number
  /** 密度轴 - compact/comfortable/spacious */
  density: 'compact' | 'comfortable' | 'spacious'
  /** 圆度轴 - 0-1 */
  roundness: number
  /** 对比度轴 - low/normal/high */
  contrast: 'low' | 'normal' | 'high'
  /** 自定义颜色覆盖 */
  customColors?: Record<string, string>
}

/**
 * Monaco 主题定义
 */
interface MonacoThemeDefinition {
  base: 'vs' | 'vs-dark' | 'hc-black'
  inherit: boolean
  rules: editor.IMonacoThemeRule[]
  colors: editor.IColors
}

/**
 * 主题适配器属性
 */
export interface MonacoThemeAdapterProps {
  /** 七轴主题配置 */
  theme: SevenAxisTheme
  /** Monaco 实例 */
  monaco: typeof monaco | null
  /** 编辑器实例 */
  editor: editor.IStandaloneCodeEditor | null
  /** 是否自动应用主题 */
  autoApply?: boolean
}

// ============================================================================
// 颜色计算工具
// ============================================================================

/**
 * HSL 颜色转 HEX
 */
function hslToHex(h: number, s: number, l: number): string {
  l /= 100
  const a = (s * Math.min(l, 1 - l)) / 100
  const f = (n: number) => {
    const k = (n + h / 30) % 12
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0')
  }
  return `#${f(0)}${f(8)}${f(4)}`
}

/**
 * HEX 转 RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      }
    : null
}

/**
 * RGB 转 HSL
 */
function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255
  g /= 255
  b /= 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  let h = 0
  let s = 0
  const l = (max + min) / 2

  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / d + 2
        break
      case b:
        h = (r - g) / d + 4
        break
    }
    h /= 6
  }

  return { h: h * 360, s, l }
}

/**
 * 调整颜色亮度
 */
function adjustLightness(hex: string, amount: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const { h, s } = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const newL = Math.max(0, Math.min(1, h === 0 ? 0 : (h / 360 + amount) % 1))
  return hslToHex(h, s, newL)
}

/**
 * 调整颜色饱和度
 */
function adjustSaturation(hex: string, amount: number): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return hex

  const { h, l } = rgbToHsl(rgb.r, rgb.g, rgb.b)
  const newS = Math.max(0, Math.min(1, (h === 0 ? 0 : h / 360 + amount) % 1))
  return hslToHex(h, newS, l)
}

/**
 * 获取对比色
 */
function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex)
  if (!rgb) return '#000000'

  const { r, g, b } = rgb
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness > 128 ? '#000000' : '#ffffff'
}

/**
 * 混合两个颜色
 */
function mixColors(color1: string, color2: string, ratio: number): string {
  const rgb1 = hexToRgb(color1)
  const rgb2 = hexToRgb(color2)

  if (!rgb1 || !rgb2) return color1

  const r = Math.round(rgb1.r * (1 - ratio) + rgb2.r * ratio)
  const g = Math.round(rgb1.g * (1 - ratio) + rgb2.g * ratio)
  const b = Math.round(rgb1.b * (1 - ratio) + rgb2.b * ratio)

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// ============================================================================
// 主题生成器
// ============================================================================

/**
 * 根据七轴配置生成 Monaco 主题
 */
export function generateMonacoTheme(theme: SevenAxisTheme): MonacoThemeDefinition {
  const isDark = theme.mode === 'dark'
  const baseTheme = isDark ? 'vs-dark' : 'vs'

  // 基于色调和饱和度计算主色
  const primaryHue = parseInt(theme.hue.replace('#', ''), 16) % 360
  const primaryColor = hslToHex(
    primaryHue,
    theme.saturation,
    theme.lightness
  )

  // 根据密度调整间距
  const spacingMultiplier = theme.density === 'compact' ? 0.8 : theme.density === 'spacious' ? 1.2 : 1.0

  // 根据对比度调整
  const contrastMultiplier = theme.contrast === 'high' ? 1.5 : theme.contrast === 'low' ? 0.75 : 1.0

  // 计算各种颜色变体
  const primaryLight = adjustLightness(primaryColor, 0.3)
  const primaryDark = adjustLightness(primaryColor, -0.3)
  const primaryLighter = adjustLightness(primaryColor, 0.5)
  const primaryDarker = adjustLightness(primaryColor, -0.5)

  // 背景色系
  const background = isDark ? '#1e1e1e' : '#ffffff'
  const backgroundLight = isDark ? '#252526' : '#f3f3f3'
  const backgroundLighter = isDark ? '#2d2d30' : '#f8f8f8'
  const backgroundDark = isDark ? '#1a1a1a' : '#e0e0e0'

  // 文本色系
  const foreground = isDark ? '#d4d4d4' : '#333333'
  const foregroundLight = isDark ? '#cccccc' : '#666666'
  const foregroundMuted = isDark ? '#858585' : '#999999'

  // 边框色系
  const border = isDark ? '#3c3c3c' : '#e0e0e0'
  const borderLight = isDark ? '#505050' : '#f0f0f0'

  // 选择色
  const selection = mixColors(primaryColor, isDark ? '#000000' : '#ffffff', 0.3)
  const selectionInactive = mixColors(selection, isDark ? '#1e1e1e' : '#ffffff', 0.5)

  // 活动行背景
  const activeLineBackground = isDark ? '#2a2d2e' : '#f0f0f0'

  // 匹配括号背景
  const bracketMatchBackground = mixColors(primaryColor, background, 0.8)

  // 错误和警告色
  const error = '#f44747'
  const warning = '#ff9800'
  const info = '#2196f3'
  const success = '#4caf50'

  // 定义语法颜色规则
  const rules: editor.IMonacoThemeRule[] = [
    { token: '', foreground: foreground },
    { token: 'comment', foreground: foregroundMuted, fontStyle: 'italic' },
    { token: 'comment.line', foreground: foregroundMuted, fontStyle: 'italic' },
    { token: 'comment.block', foreground: foregroundMuted, fontStyle: 'italic' },
    { token: 'string', foreground: primaryColor },
    { token: 'string.template', foreground: primaryColor },
    { token: 'string.regexp', foreground: primaryColor },
    { token: 'number', foreground: '#569cd6' },
    { token: 'keyword', foreground: primaryColor, fontStyle: 'bold' },
    { token: 'keyword.control', foreground: primaryColor, fontStyle: 'bold' },
    { token: 'keyword.operator', foreground: primaryColor },
    { token: 'keyword.operator.new', foreground: primaryColor },
    { token: 'keyword.operator.delete', foreground: primaryColor },
    { token: 'keyword.other', foreground: primaryColor },
    { token: 'operator', foreground: foregroundLight },
    { token: 'delimiter', foreground: foregroundLight },
    { token: 'delimiter.bracket', foreground: foregroundLight },
    { token: 'delimiter.array', foreground: foregroundLight },
    { token: 'type', foreground: '#4ec9b0' },
    { token: 'type.identifier', foreground: '#4ec9b0' },
    { token: 'class', foreground: '#4ec9b0', fontStyle: 'bold' },
    { token: 'interface', foreground: '#b8d7a3' },
    { token: 'struct', foreground: '#b8d7a3' },
    { token: 'enum', foreground: '#b8d7a3' },
    { token: 'typeParameter', foreground: '#b8d7a3' },
    { token: 'function', foreground: '#dcdcaa' },
    { token: 'function.call', foreground: '#dcdcaa' },
    { token: 'method', foreground: '#dcdcaa' },
    { token: 'method.call', foreground: '#dcdcaa' },
    { token: 'property', foreground: '#9cdcfe' },
    { token: 'variable', foreground: foreground },
    { token: 'variable.other', foreground: foreground },
    { token: 'variable.other.property', foreground: '#9cdcfe' },
    { token: 'constant', foreground: '#569cd6' },
    { token: 'constant.other', foreground: '#569cd6' },
    { token: 'constant.other.property', foreground: '#9cdcfe' },
    { token: 'tag', foreground: '#569cd6' },
    { token: 'tag.html', foreground: '#569cd6' },
    { token: 'tag.builtin', foreground: '#569cd6' },
    { token: 'tag.identifier', foreground: '#569cd6' },
    { token: 'attribute.name', foreground: '#92c5f8' },
    { token: 'attribute.value', foreground: primaryColor },
    { token: 'attribute.value.number', foreground: '#569cd6' },
    { token: 'attribute.value.unit', foreground: '#569cd6' },
    { token: 'attribute.value.hex', foreground: '#569cd6' },
    { token: 'attribute.value.string', foreground: primaryColor },
    { token: 'attribute.value.regexp', foreground: primaryColor },
    { token: 'attribute.value.keyword', foreground: primaryColor },
    { token: 'number.hex', foreground: '#569cd6' },
    { token: 'number.float', foreground: '#569cd6' },
    { token: 'number.octal', foreground: '#569cd6' },
    { token: 'number.binary', foreground: '#569cd6' },
    { token: 'regexp', foreground: primaryColor },
    { token: 'constant.language', foreground: primaryColor },
    { token: 'constant.character.escape', foreground: primaryColor },
    { token: 'constant.character', foreground: primaryColor },
    { token: 'constant.character.string-escape', foreground: primaryColor },
    { token: 'storage', foreground: primaryColor },
    { token: 'storage.type', foreground: primaryColor },
    { token: 'storage.modifier', foreground: primaryColor },
    { token: 'storage.namespace', foreground: primaryColor },
    { token: 'punctuation', foreground: foregroundLight },
    { token: 'punctuation.definition', foreground: foregroundLight },
    { token: 'punctuation.definition.comment', foreground: foregroundMuted },
    { token: 'punctuation.definition.string', foreground: foregroundLight },
    { token: 'punctuation.definition.variable', foreground: foregroundLight },
    { token: 'punctuation.definition.keyword', foreground: foregroundLight },
    { token: 'punctuation.definition.operator', foreground: foregroundLight },
    { token: 'punctuation.definition.separator', foreground: foregroundLight },
    { token: 'punctuation.definition.array', foreground: foregroundLight },
    { token: 'punctuation.definition.bracket', foreground: foregroundLight },
    { token: 'punctuation.definition.brace', foreground: foregroundLight }
  ]

  // 应用自定义颜色覆盖
  if (theme.customColors) {
    Object.entries(theme.customColors).forEach(([token, color]) => {
      rules.push({ token, foreground: color })
    })
  }

  // 定义颜色
  const colors: editor.IColors = {
    // 基础颜色
    'focusBorder': primaryColor,
    'foreground': foreground,
    'disabledForeground': foregroundMuted,
    'widget.shadow': isDark ? '#000000' : '#cccccc',

    // 选择
    'selection.background': selection,
    'selection.inactiveBackground': selectionInactive,
    'inactiveSelection.background': selectionInactive,
    'selectionHighlightBackground': mixColors(selection, background, 0.7),
    'editor.selectionBackground': selection,
    'editor.selectionInactiveBackground': selectionInactive,
    'editor.inactiveSelectionBackground': selectionInactive,

    // 搜索
    'editor.findMatchBackground': mixColors(primaryColor, background, 0.6),
    'editor.findMatchHighlightBackground': mixColors(primaryColor, background, 0.8),

    // 当前行
    'editor.lineHighlightBackground': activeLineBackground,
    'editor.lineHighlightActiveLineBackground': activeLineBackground,

    // 光标
    'editorCursor.foreground': primaryColor,

    // 编辑器背景
    'editor.background': background,
    'editor.foreground': foreground,
    'editorLineNumber.foreground': foregroundMuted,
    'editorLineNumber.activeForeground': foreground,
    'editorLineNumber.dimmedForeground': foregroundMuted,

    // 滚动条
    'scrollbar.shadow': isDark ? '#000000' : '#cccccc',
    'scrollbarSlider.background': mixColors(primaryColor, background, 0.3),
    'scrollbarSlider.hoverBackground': mixColors(primaryColor, background, 0.5),
    'scrollbarSlider.activeBackground': mixColors(primaryColor, background, 0.7),

    // 小地图
    'minimap.background': backgroundLight,

    // 侧边栏
    'sideBar.background': backgroundLight,
    'sideBar.foreground': foreground,
    'sideBar.border': border,
    'sideBarTitle.foreground': foreground,
    'sideBarSectionHeader.background': backgroundLighter,
    'sideBarSectionHeader.foreground': foreground,

    // 活动栏
    'activityBar.background': backgroundDark,
    'activityBar.foreground': foreground,
    'activityBar.inactiveForeground': foregroundMuted,
    'activityBarBadge.background': primaryColor,
    'activityBarBadge.foreground': getContrastColor(primaryColor),

    // 面板
    'panel.background': backgroundLight,
    'panel.border': border,
    'panelTitle.activeBorder': primaryColor,
    'panelTitle.activeForeground': foreground,
    'panelTitle.inactiveForeground': foregroundMuted,

    // 状态栏
    'statusBar.background': backgroundDark,
    'statusBar.foreground': foreground,
    'statusBar.border': border,
    'statusBar.noFolderBackground': backgroundDark,
    'statusBar.debuggingBackground': error,

    // 标签页
    'tab.activeBackground': background,
    'tab.activeForeground': foreground,
    'tab.inactiveForeground': foregroundMuted,
    'tab.border': border,
    'tab.activeBorder': primaryColor,
    'tab.activeBorderTop': primaryColor,

    // 标题栏
    'titleBar.activeBackground': backgroundDark,
    'titleBar.activeForeground': foreground,
    'titleBar.inactiveBackground': backgroundLight,
    'titleBar.inactiveForeground': foregroundMuted,

    // 按钮
    'button.background': primaryColor,
    'button.foreground': getContrastColor(primaryColor),
    'button.hoverBackground': mixColors(primaryColor, isDark ? '#ffffff' : '#000000', 0.1),
    'button.activeBackground': mixColors(primaryColor, isDark ? '#ffffff' : '#000000', 0.2),

    // 输入框
    'input.background': background,
    'input.foreground': foreground,
    'input.border': border,
    'input.placeholderForeground': foregroundMuted,

    // 下拉框
    'dropdown.background': background,
    'dropdown.foreground': foreground,
    'dropdown.border': border,

    // 列表
    'list.activeSelectionBackground': mixColors(primaryColor, background, 0.7),
    'list.activeSelectionForeground': getContrastColor(mixColors(primaryColor, background, 0.7)),
    'list.inactiveSelectionBackground': mixColors(primaryColor, background, 0.5),
    'list.hoverBackground': mixColors(primaryColor, background, 0.3),
    'list.hoverForeground': foreground,
    'list.activeSelectionIconForeground': getContrastColor(mixColors(primaryColor, background, 0.7)),

    // 错误指示
    'errorForeground': error,
    'editorError.foreground': error,
    'editorError.border': error,
    'editorWarning.foreground': warning,
    'editorWarning.border': warning,
    'editorInfo.foreground': info,
    'editorInfo.border': info,
    'editorHint.foreground': primaryLight,
    'editorHint.border': primaryLight,

    // 徽章
    'badge.background': primaryColor,
    'badge.foreground': getContrastColor(primaryColor),

    // 进度条
    'progressBar.background': primaryColor,

    // 分隔符
    'separator.border': border,
    'separator.foreground': foregroundMuted,

    // 键盘快捷键
    'keybindingLabel.background': mixColors(primaryColor, background, 0.7),
    'keybindingLabel.foreground': getContrastColor(mixColors(primaryColor, background, 0.7)),

    // 概览标尺
    'editorOverviewRuler.border': border,
    'editorOverviewRuler.findMatchForeground': mixColors(primaryColor, background, 0.5),
    'editorOverviewRuler.selectionHighlightForeground': mixColors(selection, background, 0.5),

    // 代码片段
    'editorSnippetTabstopHighlightBackground': mixColors(primaryColor, background, 0.7),
    'editorSnippetTabstopHighlightBorder': primaryColor,
    'editorSnippetFinalTabstopHighlightBackground': mixColors(primaryColor, background, 0.7),
    'editorSnippetFinalTabstopHighlightBorder': primaryColor,

    // 匹配括号
    'editorBracketMatch.background': bracketMatchBackground,
    'editorBracketMatch.border': primaryColor,

    // 概览标尺标记
    'editorGutter.background': background,
    'editorGutter.foreground': foregroundMuted,
    'editorGutter.modifiedBackground': primaryLight,
    'editorGutter.addedBackground': success,
    'editorGutter.deletedBackground': error,

    // 推荐
    'editorLightbulb.foreground': warning,
    'editorLightbulbAutoSave.foreground': primaryColor,

    // 引用
    'editorCursor.foreground': primaryColor,

    // 装饰
    'editorWidget.background': backgroundLight,
    'editorWidget.foreground': foreground,
    'editorWidget.border': border,

    // 快速建议
    'editorSuggestWidget.background': backgroundLight,
    'editorSuggestWidget.foreground': foreground,
    'editorSuggestWidget.border': border,
    'editorSuggestWidget.selectedBackground': mixColors(primaryColor, backgroundLight, 0.3),
    'editorSuggestWidget.selectedForeground': foreground,
    'editorSuggestWidget.highlightForeground': primaryColor,

    // 参数提示
    'editorParameterHint.foreground': foreground,
    'editorParameterHint.background': backgroundLight,

    // 悬浮提示
    'editorHoverWidget.background': backgroundLight,
    'editorHoverWidget.foreground': foreground,
    'editorHoverWidget.border': border,

    // 代码操作
    'editorCodeActionWidget.background': backgroundLight,
    'editorCodeActionWidget.foreground': foreground,
    'editorCodeActionWidget.border': border,

    // 差异编辑器
    'diffEditor.insertedTextBackground': mixColors(success, background, 0.3),
    'diffEditor.removedTextBackground': mixColors(error, background, 0.3),

    // 圣杯标记
    'gitDecoration.addedResourceForeground': success,
    'gitDecoration.modifiedResourceForeground': primaryColor,
    'gitDecoration.deletedResourceForeground': error,
    'gitDecoration.untrackedResourceForeground': info,
    'gitDecoration.ignoredResourceForeground': foregroundMuted,
    'gitDecoration.conflictingResourceForeground': warning,

    // 搜索编辑器
    'searchEditor.findMatchBackground': mixColors(primaryColor, background, 0.6),
    'searchEditor.textInputBorder': border,

    // 端口
    'ports.iconRunningProcessForeground': primaryColor,

    // 测试
    'testing.iconPassed': success,
    'testing.iconFailed': error,
    'testing.iconSkipped': foregroundMuted,
    'testing.messageInputBorder': border,
    'testing.peekBorder': border,
    'testing.runAction': primaryColor
  }

  return {
    base: baseTheme as 'vs' | 'vs-dark' | 'hc-black',
    inherit: true,
    rules,
    colors
  }
}

// ============================================================================
// 主题适配器组件
// ============================================================================

/**
 * Monaco 编辑器七轴主题适配器
 */
export function MonacoThemeAdapter({
  theme,
  monaco,
  editor,
  autoApply = true
}: MonacoThemeAdapterProps) {
  const [appliedThemeName, setAppliedThemeName] = useState<string | null>(null)

  // 生成主题
  const monacoTheme = useMemo(() => generateMonacoTheme(theme), [theme])

  // 应用主题
  useEffect(() => {
    if (!monaco || !autoApply) return

    const themeName = `xorigo-ui-${theme.mode}-${theme.hue.replace('#', '')}-${theme.density}-${theme.contrast}`

    // 定义主题
    monaco.editor.defineTheme(themeName, monacoTheme)

    // 应用主题到编辑器
    if (editor) {
      monaco.editor.setTheme(themeName)
      setAppliedThemeName(themeName)
    }

    return () => {
      // 清理：如果需要的话，可以移除主题定义
      // monaco.editor.removeTheme(themeName)
    }
  }, [monaco, editor, monacoTheme, theme, autoApply])

  return null
}

// ============================================================================
// 导出
// ============================================================================

export type { MonacoThemeDefinition }
