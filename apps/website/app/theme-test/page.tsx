'use client'

import { useTheme } from '@xorigo-ui/system'
import { AdvancedThemeSwitcher } from '@xorigo-ui/core'
import { useState, useEffect } from 'react'

export default function ThemeTestPage() {
  const { currentTheme, setTheme, themeConfig, isTransitioning } = useTheme()
  const [debugInfo, setDebugInfo] = useState<string[]>([])

  useEffect(() => {
    // 收集调试信息
    const info = [
      `当前主题: ${currentTheme}`,
      `主题配置名称: ${themeConfig?.name || '未加载'}`,
      `过渡状态: ${isTransitioning ? '是' : '否'}`,
      `CSS变量主色: ${getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim() || '未设置'}`,
      `CSS变量渐变: ${getComputedStyle(document.documentElement).getPropertyValue('--theme-gradient').trim() || '未设置'}`,
    ]
    setDebugInfo(info)
  }, [currentTheme, themeConfig, isTransitioning])

  const handleDirectThemeChange = (themeId: string) => {
    setDebugInfo(prev => [...prev, `直接调用setTheme(${themeId})`])
    setTheme(themeId)
  }

  const availableThemes = [
    'cyber-blue-purple',
    'warm-sunrise',
    'pink-romance',
    'forest-nature',
    'deep-ocean',
    'royal-violet',
    'minimal-black-white',
    'vibrant-lemon',
    'dreamy-rainbow',
    'carnival-circus'
  ]

  return (
    <div className="min-h-screen p-8" style={{ background: 'var(--theme-gradient, #f3f4f6)' }}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--theme-primary, #000)' }}>
          🎨 主题切换测试页面
        </h1>

        {/* AdvancedThemeSwitcher 测试 */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">AdvancedThemeSwitcher 组件测试</h2>
          <div className="flex items-center gap-4 mb-4">
            <AdvancedThemeSwitcher
              size="md"
              variant="dropdown"
              showLabel={true}
              enableSearch={true}
              enableCategories={true}
            />
          </div>
          <p className="text-white/70 text-sm">
            尝试点击上方的主题切换器，看看是否有反应
          </p>
        </div>

        {/* 直接主题切换测试 */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">直接主题切换测试</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {availableThemes.map(themeId => (
              <button
                key={themeId}
                onClick={() => handleDirectThemeChange(themeId)}
                className={`p-3 rounded-lg text-white text-sm font-medium transition-all
                  ${currentTheme === themeId
                    ? 'ring-2 ring-white bg-white/20'
                    : 'bg-white/10 hover:bg-white/20'
                  }
                `}
                style={{
                  background: currentTheme === themeId
                    ? 'var(--theme-gradient)'
                    : undefined
                }}
              >
                {themeId}
              </button>
            ))}
          </div>
        </div>

        {/* 调试信息 */}
        <div className="bg-black/20 backdrop-blur-md rounded-xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white">🔍 调试信息</h2>
          <div className="space-y-2">
            {debugInfo.map((info, index) => (
              <div key={index} className="text-white/80 font-mono text-sm">
                {info}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-white/20">
            <h3 className="text-white font-semibold mb-2">浏览器控制台检查</h3>
            <p className="text-white/70 text-sm">
              请打开浏览器开发者工具(F12)，查看Console标签页是否有错误信息
            </p>
          </div>

          <div className="mt-4 pt-4 border-t border-white/20">
            <h3 className="text-white font-semibold mb-2">CSS变量检查</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-white/80 font-mono text-sm">
              <div>--theme-primary: <span className="text-yellow-300">{getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim() || '未设置'}</span></div>
              <div>--theme-secondary: <span className="text-yellow-300">{getComputedStyle(document.documentElement).getPropertyValue('--theme-secondary').trim() || '未设置'}</span></div>
              <div>--theme-accent: <span className="text-yellow-300">{getComputedStyle(document.documentElement).getPropertyValue('--theme-accent').trim() || '未设置'}</span></div>
              <div>--theme-gradient: <span className="text-yellow-300">{getComputedStyle(document.documentElement).getPropertyValue('--theme-gradient').trim() || '未设置'}</span></div>
            </div>
          </div>
        </div>

        {/* 测试卡片 */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🎨</div>
            <h3 className="text-lg font-semibold text-white mb-2">主题切换</h3>
            <p className="text-white/70 text-sm">
              测试主题切换功能是否正常工作
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🔧</div>
            <h3 className="text-lg font-semibold text-white mb-2">调试信息</h3>
            <p className="text-white/70 text-sm">
              查看详细的主题状态和CSS变量
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">✨</div>
            <h3 className="text-lg font-semibold text-white mb-2">视觉效果</h3>
            <p className="text-white/70 text-sm">
              观察颜色和渐变的实时变化
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}