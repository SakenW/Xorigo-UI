'use client'

import React, { useState, useEffect } from 'react'

export default function AxisDemoPage() {
  // 七轴状态
  const [axes, setAxes] = useState({
    mode: 'light', // light, dark, hc
    baseColor: 'neutral-true', // neutral-true, neutral-warm, neutral-cool
    contrastLevel: 'mid', // low, mid, high
    accentStrategy: 'mono', // mono, analog
    accentHue: 'blue', // blue, red, green, purple, orange, cyan
    tone: 'standard', // calm, standard, vivid
    density: 'comfortable', // spacious, comfortable, compact
    motionIntensity: 'standard', // subtle, standard, expressive
    surface: 'soft-shadow', // flat, soft-shadow, glass, neon
  })

  // 应用主题到CSS变量
  useEffect(() => {
    const root = document.documentElement

    // 根据七轴配置生成CSS变量
    const theme = generateThemeFromAxes(axes)

    // 应用CSS变量
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value)
    })

    Object.entries(theme.spacing).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value)
    })

    Object.entries(theme.motion).forEach(([key, value]) => {
      root.style.setProperty(`--motion-${key}`, value)
    })

    root.style.setProperty('--font-scale', theme.fontScale)
    root.style.setProperty('--border-radius', theme.borderRadius)
    root.style.setProperty('--shadow', theme.shadow)

  }, [axes])

  // 生成当前主题配置
  const currentTheme = generateThemeFromAxes(axes)

  // 生成主题配置
  function generateThemeFromAxes(axisValues: typeof axes) {
    const { mode, baseColor, contrastLevel, accentStrategy, accentHue, tone, density, motionIntensity, surface } = axisValues

    // 基础色彩配置
    const baseColors = {
      'neutral-true': { light: '#ffffff', dark: '#000000' },
      'neutral-warm': { light: '#fafafa', dark: '#1a1a1a' },
      'neutral-cool': { light: '#f8fafc', dark: '#0f172a' }
    }

    const accentColors = {
      blue: { light: '#3b82f6', dark: '#60a5fa' },
      red: { light: '#ef4444', dark: '#f87171' },
      green: { light: '#10b981', dark: '#34d399' },
      purple: { light: '#8b5cf6', dark: '#a78bfa' },
      orange: { light: '#f97316', dark: '#fb923c' },
      cyan: { light: '#06b6d4', dark: '#22d3ee' }
    }

    const base = baseColors[baseColor as keyof typeof baseColors]
    const accent = accentColors[accentHue as keyof typeof accentColors]

    // 生成完整的主题
    return {
      colors: {
        background: mode === 'light' ? base.light : base.dark,
        foreground: mode === 'light' ? '#111827' : '#f9fafb',
        primary: accent[mode as 'light' | 'dark'],
        secondary: mode === 'light' ? '#6b7280' : '#9ca3af',
        accent: accent[mode as 'light' | 'dark'],
        muted: mode === 'light' ? '#f3f4f6' : '#374151',
        border: mode === 'light' ? '#e5e7eb' : '#4b5563',
      },
      spacing: {
        xs: density === 'compact' ? '0.25rem' : density === 'spacious' ? '0.75rem' : '0.5rem',
        sm: density === 'compact' ? '0.5rem' : density === 'spacious' ? '1rem' : '0.75rem',
        md: density === 'compact' ? '0.75rem' : density === 'spacious' ? '1.5rem' : '1rem',
        lg: density === 'compact' ? '1rem' : density === 'spacious' ? '2rem' : '1.5rem',
        xl: density === 'compact' ? '1.5rem' : density === 'spacious' ? '3rem' : '2rem',
      },
      motion: {
        duration: motionIntensity === 'subtle' ? '0.2s' : motionIntensity === 'expressive' ? '0.5s' : '0.3s',
        easing: motionIntensity === 'expressive' ? 'cubic-bezier(0.68, -0.55, 0.265, 1.55)' : 'ease-in-out',
      },
      fontScale: tone === 'vivid' ? '1.1' : tone === 'calm' ? '0.95' : '1',
      borderRadius: surface === 'glass' ? '1rem' : surface === 'flat' ? '0' : '0.5rem',
      shadow: surface === 'soft-shadow' ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' :
               surface === 'glass' ? '0 8px 32px 0 rgba(31, 38, 135, 0.37)' :
               surface === 'neon' ? '0 0 20px rgba(59, 130, 246, 0.5)' : 'none'
    }
  }

  // 预设主题配置
  const presetThemes = [
    {
      name: '企业蓝调',
      axes: {
        mode: 'light',
        baseColor: 'neutral-cool',
        contrastLevel: 'mid',
        accentStrategy: 'mono',
        accentHue: 'blue',
        tone: 'standard',
        density: 'comfortable',
        motionIntensity: 'standard',
        surface: 'soft-shadow'
      }
    },
    {
      name: '极简白',
      axes: {
        mode: 'light',
        baseColor: 'neutral-true',
        contrastLevel: 'low',
        accentStrategy: 'mono',
        accentHue: 'gray',
        tone: 'calm',
        density: 'spacious',
        motionIntensity: 'subtle',
        surface: 'flat'
      }
    },
    {
      name: '创意紫',
      axes: {
        mode: 'light',
        baseColor: 'neutral-true',
        contrastLevel: 'mid',
        accentStrategy: 'analog',
        accentHue: 'purple',
        tone: 'vivid',
        density: 'comfortable',
        motionIntensity: 'expressive',
        surface: 'glass'
      }
    },
    {
      name: '暗色模式',
      axes: {
        mode: 'dark',
        baseColor: 'neutral-true',
        contrastLevel: 'mid',
        accentStrategy: 'mono',
        accentHue: 'blue',
        tone: 'standard',
        density: 'comfortable',
        motionIntensity: 'standard',
        surface: 'soft-shadow'
      }
    },
    {
      name: '霓虹科技',
      axes: {
        mode: 'dark',
        baseColor: 'neutral-cool',
        contrastLevel: 'high',
        accentStrategy: 'duo',
        accentHue: 'cyan',
        tone: 'vivid',
        density: 'compact',
        motionIntensity: 'expressive',
        surface: 'neon'
      }
    },
    {
      name: '温暖阳光',
      axes: {
        mode: 'light',
        baseColor: 'neutral-warm',
        contrastLevel: 'mid',
        accentStrategy: 'analog',
        accentHue: 'orange',
        tone: 'vivid',
        density: 'spacious',
        motionIntensity: 'standard',
        surface: 'soft-shadow'
      }
    }
  ]

  return (
    <div className="min-h-screen transition-all duration-300" style={{
      backgroundColor: 'var(--color-background)',
      color: 'var(--color-foreground)'
    }}>
      {/* 页面头部 */}
      <header className="border-b" style={{ borderColor: 'var(--color-border)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              🎨 七轴主题系统 - 完整演示
            </h1>
            <p className="text-lg opacity-80">
              实时体验七轴参数调节，见证主题的动态变化
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 当前状态显示 */}
        <div className="mb-8 p-6 rounded-lg border" style={{
          backgroundColor: 'var(--color-muted)',
          borderColor: 'var(--color-border)'
        }}>
          <h2 className="text-xl font-semibold mb-4">当前七轴配置</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="opacity-60">模式:</span>
              <span className="ml-2 font-medium">{axes.mode}</span>
            </div>
            <div>
              <span className="opacity-60">基础色:</span>
              <span className="ml-2 font-medium">{axes.baseColor}</span>
            </div>
            <div>
              <span className="opacity-60">强调色:</span>
              <span className="ml-2 font-medium">{axes.accentHue}</span>
            </div>
            <div>
              <span className="opacity-60">色调:</span>
              <span className="ml-2 font-medium">{axes.tone}</span>
            </div>
            <div>
              <span className="opacity-60">密度:</span>
              <span className="ml-2 font-medium">{axes.density}</span>
            </div>
            <div>
              <span className="opacity-60">动效:</span>
              <span className="ml-2 font-medium">{axes.motionIntensity}</span>
            </div>
            <div>
              <span className="opacity-60">表面:</span>
              <span className="ml-2 font-medium">{axes.surface}</span>
            </div>
            <div>
              <span className="opacity-60">对比度:</span>
              <span className="ml-2 font-medium">{axes.contrastLevel}</span>
            </div>
          </div>
        </div>

        {/* 预设主题快速切换 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🎯 预设主题</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {presetThemes.map((preset, index) => (
              <button
                key={index}
                onClick={() => setAxes(preset.axes)}
                className="p-4 rounded-lg border-2 hover:scale-105 transition-all duration-300 text-left"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: 'var(--color-background)',
                  transform: 'scale(1)',
                  transition: `all ${currentTheme.motion.duration} ${currentTheme.motion.easing}`
                }}
              >
                <h3 className="font-semibold mb-1">{preset.name}</h3>
                <p className="text-xs opacity-60">
                  {preset.axes.mode === 'light' ? '亮色' : '暗色'} •
                  {preset.axes.tone === 'vivid' ? '鲜艳' : '柔和'} •
                  {preset.axes.surface === 'neon' ? '霓虹' : '标准'}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* 七轴参数调节 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🎛️ 七轴参数调节</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* 模式轴 */}
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-semibold mb-3">模式轴 (Mode)</h3>
              <div className="space-y-2">
                {['light', 'dark', 'hc'].map((mode) => (
                  <label key={mode} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="mode"
                      value={mode}
                      checked={axes.mode === mode}
                      onChange={(e) => setAxes({...axes, mode: e.target.value})}
                      className="rounded"
                    />
                    <span>{mode === 'light' ? '亮色模式' : mode === 'dark' ? '暗色模式' : '高对比度'}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* 基础色轴 */}
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-semibold mb-3">基础色轴 (Base Color)</h3>
              <div className="space-y-2">
                {['neutral-true', 'neutral-warm', 'neutral-cool'].map((color) => (
                  <label key={color} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="baseColor"
                      value={color}
                      checked={axes.baseColor === color}
                      onChange={(e) => setAxes({...axes, baseColor: e.target.value})}
                      className="rounded"
                    />
                    <span>
                      {color === 'neutral-true' ? '中性色' :
                       color === 'neutral-warm' ? '暖中性' : '冷中性'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 强调色轴 */}
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-semibold mb-3">强调色轴 (Accent Hue)</h3>
              <div className="grid grid-cols-3 gap-2">
                {['blue', 'red', 'green', 'purple', 'orange', 'cyan'].map((hue) => (
                  <button
                    key={hue}
                    onClick={() => setAxes({...axes, accentHue: hue})}
                    className={`p-2 rounded border-2 hover:scale-110 transition-transform ${
                      axes.accentHue === hue ? 'border-2' : 'border'
                    }`}
                    style={{
                      backgroundColor: hue === 'blue' ? '#3b82f6' :
                                      hue === 'red' ? '#ef4444' :
                                      hue === 'green' ? '#10b981' :
                                      hue === 'purple' ? '#8b5cf6' :
                                      hue === 'orange' ? '#f97316' :
                                      hue === 'cyan' ? '#06b6d4' : '#gray',
                      borderColor: axes.accentHue === hue ? 'var(--color-foreground)' : 'transparent'
                    }}
                  >
                    <span className="text-white text-xs font-medium">
                      {hue === 'blue' ? '蓝' : hue === 'red' ? '红' : hue === 'green' ? '绿' :
                       hue === 'purple' ? '紫' : hue === 'orange' ? '橙' : '青'}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* 色调轴 */}
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-semibold mb-3">色调轴 (Tone)</h3>
              <div className="space-y-2">
                {['calm', 'standard', 'vivid'].map((tone) => (
                  <label key={tone} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="tone"
                      value={tone}
                      checked={axes.tone === tone}
                      onChange={(e) => setAxes({...axes, tone: e.target.value})}
                      className="rounded"
                    />
                    <span>
                      {tone === 'calm' ? '平静' : tone === 'standard' ? '标准' : '鲜艳'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 密度轴 */}
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-semibold mb-3">密度轴 (Density)</h3>
              <div className="space-y-2">
                {['compact', 'comfortable', 'spacious'].map((density) => (
                  <label key={density} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="density"
                      value={density}
                      checked={axes.density === density}
                      onChange={(e) => setAxes({...axes, density: e.target.value})}
                      className="rounded"
                    />
                    <span>
                      {density === 'compact' ? '紧凑' : density === 'comfortable' ? '舒适' : '宽松'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 动效轴 */}
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-semibold mb-3">动效轴 (Motion)</h3>
              <div className="space-y-2">
                {['subtle', 'standard', 'expressive'].map((motion) => (
                  <label key={motion} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="motion"
                      value={motion}
                      checked={axes.motionIntensity === motion}
                      onChange={(e) => setAxes({...axes, motionIntensity: e.target.value})}
                      className="rounded"
                    />
                    <span>
                      {motion === 'subtle' ? '微妙' : motion === 'standard' ? '标准' : '动感'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* 表面轴 */}
            <div className="p-4 rounded-lg border" style={{ borderColor: 'var(--color-border)' }}>
              <h3 className="font-semibold mb-3">表面轴 (Surface)</h3>
              <div className="space-y-2">
                {['flat', 'soft-shadow', 'glass', 'neon'].map((surface) => (
                  <label key={surface} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="surface"
                      value={surface}
                      checked={axes.surface === surface}
                      onChange={(e) => setAxes({...axes, surface: e.target.value})}
                      className="rounded"
                    />
                    <span>
                      {surface === 'flat' ? '平面' :
                       surface === 'soft-shadow' ? '柔和阴影' :
                       surface === 'glass' ? '玻璃' : '霓虹'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* 实时预览区域 */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">👁️ 实时预览</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* 卡片预览 */}
            <div
              className="p-6 rounded-lg transition-all duration-300 hover:scale-105"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--shadow)',
                transform: 'scale(1)'
              }}
            >
              <h3 className="font-bold mb-2" style={{ color: 'var(--color-primary)' }}>
                示例卡片
              </h3>
              <p className="mb-4" style={{ color: 'var(--color-secondary)' }}>
                这是一个实时响应七轴参数变化的示例卡片
              </p>
              <button
                className="px-4 py-2 rounded text-white transition-all duration-300"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  transform: 'scale(1)'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                主要按钮
              </button>
            </div>

            {/* 表单预览 */}
            <div
              className="p-6 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--shadow)'
              }}
            >
              <h3 className="font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>
                表单示例
              </h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="输入框示例"
                  className="w-full px-3 py-2 rounded border transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-foreground)',
                    borderRadius: 'calc(var(--border-radius) / 2)',
                    padding: 'var(--spacing-sm) var(--spacing-md)'
                  }}
                />
                <select
                  className="w-full px-3 py-2 rounded border transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-background)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-foreground)',
                    borderRadius: 'calc(var(--border-radius) / 2)',
                    padding: 'var(--spacing-sm) var(--spacing-md)'
                  }}
                >
                  <option>选择框示例</option>
                  <option>选项 1</option>
                  <option>选项 2</option>
                </select>
              </div>
            </div>

            {/* 按钮组预览 */}
            <div
              className="p-6 rounded-lg transition-all duration-300"
              style={{
                backgroundColor: 'var(--color-background)',
                borderColor: 'var(--color-border)',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderRadius: 'var(--border-radius)',
                boxShadow: 'var(--shadow)'
              }}
            >
              <h3 className="font-bold mb-4" style={{ color: 'var(--color-foreground)' }}>
                按钮组
              </h3>
              <div className="space-y-3">
                <button
                  className="w-full px-4 py-2 rounded text-white transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    borderRadius: 'calc(var(--border-radius) / 2)'
                  }}
                >
                  主要按钮
                </button>
                <button
                  className="w-full px-4 py-2 rounded transition-all duration-300"
                  style={{
                    backgroundColor: 'var(--color-secondary)',
                    color: 'var(--color-background)',
                    borderRadius: 'calc(var(--border-radius) / 2)'
                  }}
                >
                  次要按钮
                </button>
                <button
                  className="w-full px-4 py-2 rounded transition-all duration-300"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                    borderWidth: '1px',
                    borderStyle: 'solid',
                    borderRadius: 'calc(var(--border-radius) / 2)'
                  }}
                >
                  轮廓按钮
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 七轴说明 */}
        <div className="p-6 rounded-lg border" style={{
          backgroundColor: 'var(--color-muted)',
          borderColor: 'var(--color-border)'
        }}>
          <h2 className="text-xl font-bold mb-4">📚 七轴系统说明</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h3 className="font-semibold mb-2">视觉轴 (Visual)</h3>
              <ul className="space-y-1 opacity-80">
                <li><strong>模式:</strong> 亮色/暗色/高对比度</li>
                <li><strong>基础色:</strong> 中性色的冷暖调</li>
                <li><strong>强调色:</strong> 主要功能色彩</li>
                <li><strong>色调:</strong> 色彩饱和度</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2">交互轴 (Interaction)</h3>
              <ul className="space-y-1 opacity-80">
                <li><strong>密度:</strong> 空间紧凑程度</li>
                <li><strong>动效:</strong> 动画强度</li>
                <li><strong>表面:</strong> 材质效果</li>
                <li><strong>对比度:</strong> 明暗差异</li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-lg opacity-80" style={{ backgroundColor: 'var(--color-background)' }}>
            <p className="text-center">
              <strong>🎯 核心理念:</strong> 七轴系统通过精确控制视觉和交互参数，
              实现了从企业专业到创意表达的无限主题可能性。
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}