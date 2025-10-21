'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { StyleRecipeProvider, useStyleRecipe } from '../provider/StyleRecipeProvider'
import { useThemeSystem } from '../hooks/useThemeSystem'
import { useDynamicTheme } from '../hooks/useDynamicTheme'

// ============================================================================
// 应用示例：完整的主题系统集成
// ============================================================================

// 1. 应用级主题上下文
interface AppThemeContextType {
  currentMode: 'preset' | 'quick' | 'custom'
  currentTheme: string
  userPreferences: {
    autoSwitch: boolean
    timeBasedSwitching: boolean
    accessibilityMode: boolean
  }
  switchTheme: (theme: string, mode?: 'preset' | 'quick' | 'custom') => void
  toggleAutoSwitch: () => void
}

const AppThemeContext = createContext<AppThemeContextType | undefined>(undefined)

// 2. 主题状态管理
type ThemeAction =
  | { type: 'SWITCH_THEME'; payload: { theme: string; mode: 'preset' | 'quick' | 'custom' } }
  | { type: 'TOGGLE_AUTO_SWITCH' }
  | { type: 'TIME_BASED_SWITCH'; payload: { hour: number } }
  | { type: 'ACCESSIBILITY_MODE'; payload: { enabled: boolean } }

interface ThemeState {
  currentMode: 'preset' | 'quick' | 'custom'
  currentTheme: string
  userPreferences: {
    autoSwitch: boolean
    timeBasedSwitching: boolean
    accessibilityMode: boolean
  }
}

const themeReducer = (state: ThemeState, action: ThemeAction): ThemeState => {
  switch (action.type) {
    case 'SWITCH_THEME':
      return {
        ...state,
        currentMode: action.payload.mode,
        currentTheme: action.payload.theme,
      }
    case 'TOGGLE_AUTO_SWITCH':
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          autoSwitch: !state.userPreferences.autoSwitch,
        },
      }
    case 'TIME_BASED_SWITCH':
      const hour = action.payload.hour
      let newTheme = state.currentTheme
      let newMode = state.currentMode

      if (hour >= 6 && hour < 18) {
        // 白天模式
        if (state.userPreferences.accessibilityMode) {
          newTheme = 'hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat'
          newMode = 'preset'
        } else {
          newTheme = 'professional-light'
          newMode = 'quick'
        }
      } else {
        // 夜间模式
        if (state.userPreferences.accessibilityMode) {
          newTheme = 'dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat'
          newMode = 'preset'
        } else {
          newTheme = 'developer-code'
          newMode = 'quick'
        }
      }

      return {
        ...state,
        currentTheme: newTheme,
        currentMode: newMode,
      }
    case 'ACCESSIBILITY_MODE':
      return {
        ...state,
        userPreferences: {
          ...state.userPreferences,
          accessibilityMode: action.payload.enabled,
        },
      }
    default:
      return state
  }
}

// 3. 应用主题提供者
export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, {
    currentMode: 'preset',
    currentTheme: 'light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow',
    userPreferences: {
      autoSwitch: false,
      timeBasedSwitching: false,
      accessibilityMode: false,
    },
  })

  const themeSystem = useThemeSystem()

  // 时间自动切换
  useEffect(() => {
    if (!state.userPreferences.timeBasedSwitching) return

    const checkTime = () => {
      const hour = new Date().getHours()
      dispatch({ type: 'TIME_BASED_SWITCH', payload: { hour } })
    }

    checkTime()
    const interval = setInterval(checkTime, 60000) // 每分钟检查一次

    return () => clearInterval(interval)
  }, [state.userPreferences.timeBasedSwitching, state.userPreferences.accessibilityMode])

  // 应用主题切换
  useEffect(() => {
    const applyTheme = async () => {
      try {
        switch (state.currentMode) {
          case 'preset':
            await themeSystem.applyPreset(state.currentTheme)
            break
          case 'quick':
            await themeSystem.applyQuickConfig(state.currentTheme)
            break
          case 'custom':
            // 自定义主题逻辑
            break
        }
      } catch (error) {
        console.error('Failed to apply theme:', error)
      }
    }

    applyTheme()
  }, [state.currentTheme, state.currentMode, themeSystem])

  const contextValue: AppThemeContextType = {
    ...state,
    switchTheme: (theme, mode = 'preset') => {
      dispatch({ type: 'SWITCH_THEME', payload: { theme, mode } })
    },
    toggleAutoSwitch: () => {
      dispatch({ type: 'TOGGLE_AUTO_SWITCH' })
    },
  }

  return (
    <AppThemeContext.Provider value={contextValue}>
      {children}
    </AppThemeContext.Provider>
  )
}

// 4. 使用应用主题的Hook
export const useAppTheme = () => {
  const context = useContext(AppThemeContext)
  if (!context) {
    throw new Error('useAppTheme must be used within AppThemeProvider')
  }
  return context
}

// ============================================================================
// 组件示例：展示不同场景下的主题使用
// ============================================================================

// 主题切换器组件
export const ThemeSwitcher: React.FC<{ className?: string }> = ({ className }) => {
  const { currentMode, currentTheme, switchTheme, userPreferences, toggleAutoSwitch } = useAppTheme()
  const themeSystem = useThemeSystem()

  return (
    <div className={`p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        🎨 主题控制
      </h3>

      {/* 当前主题信息 */}
      <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded">
        <div className="text-sm text-gray-600 dark:text-gray-300">
          当前: <span className="font-medium">{currentTheme}</span>
          <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
            {currentMode}
          </span>
        </div>
      </div>

      {/* 快速切换按钮 */}
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            快速切换
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => switchTheme('professional-light', 'quick')}
              className="px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              ☀️ 专业亮色
            </button>
            <button
              onClick={() => switchTheme('professional-dark', 'quick')}
              className="px-3 py-2 text-xs bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
            >
              🌙 专业暗色
            </button>
            <button
              onClick={() => switchTheme('creative-vibrant', 'quick')}
              className="px-3 py-2 text-xs bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors"
            >
              🎨 创意活力
            </button>
            <button
              onClick={() => switchTheme('hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat', 'preset')}
              className="px-3 py-2 text-xs bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
            >
              ♿ 高对比
            </button>
          </div>
        </div>

        {/* 预设主题选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            预设主题
          </label>
          <select
            value={currentMode === 'preset' ? currentTheme : ''}
            onChange={(e) => e.target.value && switchTheme(e.target.value, 'preset')}
            className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">选择预设主题...</option>
            {themeSystem.presetRecipes.map((recipe) => (
              <option key={recipe.id} value={recipe.id}>
                {recipe.name}
              </option>
            ))}
          </select>
        </div>

        {/* 自动切换 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-700 dark:text-gray-300">自动切换</span>
          <button
            onClick={toggleAutoSwitch}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              userPreferences.autoSwitch ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                userPreferences.autoSwitch ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  )
}

// 场景化组件：仪表板
export const DashboardDemo: React.FC = () => {
  const { currentTheme } = useAppTheme()

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        📊 仪表板
      </h2>
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        当前主题: <span className="font-medium">{currentTheme}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-blue-800 dark:text-blue-200 font-semibold">用户数</div>
          <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">1,234</div>
        </div>
        <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-green-800 dark:text-green-200 font-semibold">收入</div>
          <div className="text-2xl font-bold text-green-900 dark:text-green-100">$56,789</div>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="text-purple-800 dark:text-purple-200 font-semibold">转化率</div>
          <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">3.45%</div>
        </div>
      </div>
    </div>
  )
}

// 场景化组件：编辑器
export const EditorDemo: React.FC = () => {
  const { currentTheme } = useAppTheme()

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        📝 代码编辑器
      </h2>
      <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        当前主题: <span className="font-medium">{currentTheme}</span>
      </div>

      <div className="font-mono text-sm p-4 bg-gray-900 dark:bg-black rounded-lg">
        <div className="text-blue-400">const</div>
        <div className="text-green-400">themeSystem</div>
        <div className="text-white"> = {`{`}</div>
        <div className="ml-4 text-yellow-400">mode</div>
        <div className="text-white">:</div>
        <div className="text-orange-400">'dynamic'</div>
        <div className="text-white">,</div>
        <div className="ml-4 text-yellow-400">axes</div>
        <div className="text-white">:</div>
        <div className="text-green-400">7</div>
        <div className="text-white">,</div>
        <div className="ml-4 text-yellow-400">possibilities</div>
        <div className="text-white">:</div>
        <div className="text-orange-400">'infinite'</div>
        <div className="text-white">{`}`}</div>
      </div>
    </div>
  )
}

// 完整的应用示例
export const ThemeSystemApp: React.FC = () => {
  return (
    <StyleRecipeProvider>
      <AppThemeProvider>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-6">
          <div className="max-w-7xl mx-auto">
            <header className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                🎨 七轴主题系统集成示例
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                展示不同场景下的主题切换和使用
              </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* 主题控制面板 */}
              <div className="lg:col-span-1">
                <ThemeSwitcher />
              </div>

              {/* 内容区域 */}
              <div className="lg:col-span-3 space-y-6">
                <DashboardDemo />
                <EditorDemo />
              </div>
            </div>

            <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-400">
              <p>
                🚀 这个示例展示了如何在真实应用中集成七轴主题系统
              </p>
              <p className="mt-1">
                支持预设主题、快速配置和完全自定义三种使用模式
              </p>
            </footer>
          </div>
        </div>
      </AppThemeProvider>
    </StyleRecipeProvider>
  )
}

// ============================================================================
// 使用指南和最佳实践
// ============================================================================

export const THEME_INTEGRATION_GUIDE = {
  // 快速开始
  quickStart: `
// 1. 包装你的应用
<StyleRecipeProvider>
  <AppThemeProvider>
    <YourApp />
  </AppThemeProvider>
</StyleRecipeProvider>

// 2. 在组件中使用主题
const { currentTheme, switchTheme } = useAppTheme()

// 3. 切换主题
switchTheme('professional-light', 'quick')
`,

  // 最佳实践
  bestPractices: [
    '为不同场景预设合适的主题配置',
    '使用时间自动切换提升用户体验',
    '提供快速主题切换按钮而非复杂配置界面',
    '为无障碍用户提供高对比度主题选项',
    '在主题切换时保存用户偏好设置',
    '使用过渡动画平滑主题切换过程',
  ],

  // 性能优化
  performance: [
    '避免频繁切换主题造成性能问题',
    '使用防抖处理主题切换事件',
    '预加载常用主题资源',
    '使用 CSS 变量实现平滑过渡',
  ],

  // 可访问性考虑
  accessibility: [
    '提供高对比度主题选项',
    '支持系统级暗色模式偏好',
    '确保主题切换不影响屏幕阅读器',
    '提供键盘快捷键切换主题',
  ],
}

export default ThemeSystemApp