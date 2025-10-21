'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeSystem } from '../hooks/useThemeSystem'
import { useDynamicTheme } from '../hooks/useDynamicTheme'
import { StyleRecipeProvider } from '../provider/StyleRecipeProvider'
import type { QuickConfig } from '../hooks/useThemeSystem'

// ============================================================================
// 主题系统演示组件 - 展示三层架构的设计哲学
// ============================================================================

interface ThemeSystemDemoProps {
  className?: string
}

export const ThemeSystemDemo: React.FC<ThemeSystemDemoProps> = ({ className }) => {
  const themeSystem = useThemeSystem()
  const dynamicTheme = useDynamicTheme({ autoApply: true })

  const [activeTab, setActiveTab] = useState<'presets' | 'quick' | 'custom'>('presets')
  const [showPhilosophy, setShowPhilosophy] = useState(false)

  // 计算当前组合数量
  const totalCombinations = themeSystem.presetRecipes.length +
                           themeSystem.quickConfigs.length +
                           'infinite-custom'

  return (
    <div className={`max-w-6xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl ${className}`}>
      {/* 标题区域 */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🎨 七轴主题系统设计哲学
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          自由与约束的平衡艺术 - 渐进式复杂性的用户体验
        </p>
        <button
          onClick={() => setShowPhilosophy(!showPhilosophy)}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          {showPhilosophy ? '隐藏' : '显示'}设计哲学
        </button>
      </div>

      {/* 设计哲学说明 */}
      <AnimatePresence>
        {showPhilosophy && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg border border-purple-200 dark:border-purple-700"
          >
            <h2 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">
              🧠 设计哲学核心
            </h2>
            <div className="grid md:grid-cols-2 gap-6 text-sm">
              <div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  🎯 三层渐进式架构
                </h3>
                <ul className="space-y-1 text-purple-700 dark:text-purple-300">
                  <li>• <strong>初学者</strong>：18个专业预设配方</li>
                  <li>• <strong>中级用户</strong>：8个快速配置场景</li>
                  <li>• <strong>专家用户</strong>：无限自由组合</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  ⚖️ 自由与约束平衡
                </h3>
                <ul className="space-y-1 text-purple-700 dark:text-purple-300">
                  <li>• <strong>完全自由</strong>：选择过载，创意瘫痪</li>
                  <li>• <strong>完全约束</strong>：限制创造力，千篇一律</li>
                  <li>• <strong>智能约束</strong>：防止错误，鼓励探索</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  🎭 实用主义导向
                </h3>
                <ul className="space-y-1 text-purple-700 dark:text-purple-300">
                  <li>• <strong>场景驱动</strong>：办公、创意、休闲、无障碍</li>
                  <li>• <strong>经验映射</strong>：专业术语 → 用户语言</li>
                  <li>• <strong>即时预览</strong>：所见即所得的反馈</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  🛡️ 智能保护系统
                </h3>
                <ul className="space-y-1 text-purple-700 dark:text-purple-300">
                  <li>• <strong>冲突检测</strong>：暗色+霓虹=刺眼警告</li>
                  <li>• <strong>可访问性</strong>：高对比度模式自动约束</li>
                  <li>• <strong>专业性</strong>：商务场景动效限制</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {themeSystem.presetRecipes.length}
          </div>
          <div className="text-sm text-blue-800 dark:text-blue-200">专业预设</div>
        </div>
        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {themeSystem.quickConfigs.length}
          </div>
          <div className="text-sm text-green-800 dark:text-green-200">快速配置</div>
        </div>
        <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            ∞
          </div>
          <div className="text-sm text-purple-800 dark:text-purple-200">自定义组合</div>
        </div>
      </div>

      {/* 选项卡切换 */}
      <div className="flex space-x-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
        {[
          { id: 'presets', label: '🎨 预设配方', desc: '专业优化的主题' },
          { id: 'quick', label: '⚡ 快速配置', desc: '常见场景配置' },
          { id: 'custom', label: '🎛️ 完全自定义', desc: '七轴自由组合' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-4 py-3 rounded-md transition-all ${
              activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <div className="font-medium">{tab.label}</div>
            <div className="text-xs opacity-75">{tab.desc}</div>
          </button>
        ))}
      </div>

      {/* 内容区域 */}
      <AnimatePresence mode="wait">
        {activeTab === 'presets' && (
          <motion.div
            key="presets"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🎨 专业预设配方 - 设计师精选
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {themeSystem.presetRecipes.map((recipe) => (
                <motion.div
                  key={recipe.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-300 dark:hover:border-blue-600 cursor-pointer transition-colors"
                  onClick={() => themeSystem.applyPreset(recipe.id)}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {recipe.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {recipe.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      {recipe.category}
                    </span>
                    <span className="text-xs text-gray-500">
                      {themeSystem.currentPreset === recipe.id ? '✅ 当前' : ''}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'quick' && (
          <motion.div
            key="quick"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              ⚡ 快速配置 - 场景驱动
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {themeSystem.quickConfigs.map((config) => (
                <motion.div
                  key={config.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    themeSystem.currentQuickConfig === config.id
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-green-300 dark:hover:border-green-600'
                  }`}
                  onClick={() => themeSystem.applyQuickConfig(config.id)}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {config.name}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    {config.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {config.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <QuickConfigPreview config={config} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === 'custom' && (
          <motion.div
            key="custom"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              🎛️ 完全自定义 - 七轴自由组合
            </h3>

            {/* 当前配置展示 */}
            <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                当前七轴配置
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                {Object.entries(dynamicTheme.values).map(([axis, value]) => (
                  <div key={axis} className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400 capitalize">
                      {axis.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 验证结果 */}
            <ValidationResult validation={themeSystem.validateTheme(dynamicTheme.values)} />

            {/* 控制面板 */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  基础轴控制
                </h4>
                <div className="space-y-4">
                  <AxisControl
                    label="模式 (Mode)"
                    value={dynamicTheme.values.mode}
                    options={['light', 'dark', 'hc']}
                    onChange={(value) => dynamicTheme.updateAxis('mode', value)}
                  />
                  <AxisControl
                    label="色调 (Tone)"
                    value={dynamicTheme.values.tone}
                    options={['calm', 'standard', 'vivid']}
                    onChange={(value) => dynamicTheme.updateAxis('tone', value)}
                  />
                  <AxisControl
                    label="密度 (Density)"
                    value={dynamicTheme.values.density}
                    options={['spacious', 'comfortable', 'compact']}
                    onChange={(value) => dynamicTheme.updateAxis('density', value)}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                  高级轴控制
                </h4>
                <div className="space-y-4">
                  <AxisControl
                    label="动效强度 (Motion)"
                    value={dynamicTheme.values.motionIntensity}
                    options={['subtle', 'standard', 'expressive']}
                    onChange={(value) => dynamicTheme.updateAxis('motionIntensity', value)}
                  />
                  <AxisControl
                    label="表面效果 (Surface)"
                    value={dynamicTheme.values.surface}
                    options={['flat', 'soft-shadow', 'glass', 'neon']}
                    onChange={(value) => dynamicTheme.updateAxis('surface', value)}
                  />
                  <ColorControls
                    values={dynamicTheme.values}
                    onChange={dynamicTheme.updateMultipleAxes}
                  />
                </div>
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => dynamicTheme.reset()}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                🔄 重置为默认
              </button>
              <button
                onClick={() => themeSystem.saveCustomTheme('我的自定义主题')}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                💾 保存主题
              </button>
              <button
                onClick={() => dynamicTheme.applyRecipe()}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                ✨ 应用更改
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ============================================================================
// 辅助组件
// ============================================================================

interface QuickConfigPreviewProps {
  config: QuickConfig
}

const QuickConfigPreview: React.FC<QuickConfigPreviewProps> = ({ config }) => {
  const { values } = config

  return (
    <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
      <div className="flex justify-between">
        <span>模式:</span>
        <span className="font-medium">{values.mode}</span>
      </div>
      <div className="flex justify-between">
        <span>色调:</span>
        <span className="font-medium">{values.tone}</span>
      </div>
      <div className="flex justify-between">
        <span>密度:</span>
        <span className="font-medium">{values.density}</span>
      </div>
      <div className="flex justify-between">
        <span>动效:</span>
        <span className="font-medium">{values.motionIntensity}</span>
      </div>
    </div>
  )
}

interface AxisControlProps {
  label: string
  value: string
  options: string[]
  onChange: (value: string) => void
}

const AxisControl: React.FC<AxisControlProps> = ({ label, value, options, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

interface ColorControlsProps {
  values: any
  onChange: (updates: any) => void
}

const ColorControls: React.FC<ColorControlsProps> = ({ values, onChange }) => {
  return (
    <div className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          基础色彩
        </label>
        <select
          value={values.baseColor}
          onChange={(e) => onChange({ baseColor: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="neutral-true">中性色</option>
          <option value="neutral-warm">暖中性</option>
          <option value="neutral-cool">冷中性</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          对比度
        </label>
        <select
          value={values.contrastLevel}
          onChange={(e) => onChange({ contrastLevel: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="low">低</option>
          <option value="mid">中</option>
          <option value="high">高</option>
        </select>
      </div>
    </div>
  )
}

interface ValidationResultProps {
  validation: {
    isValid: boolean
    warnings: string[]
    suggestions: string[]
  }
}

const ValidationResult: React.FC<ValidationResultProps> = ({ validation }) => {
  if (validation.isValid && validation.warnings.length === 0) {
    return (
      <div className="p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <div className="flex items-center text-green-800 dark:text-green-200">
          ✅ 配置完美，无任何问题
        </div>
      </div>
    )
  }

  return (
    <div className={`p-3 border rounded-lg ${
      validation.warnings.length > 0
        ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    }`}>
      {validation.warnings.length > 0 && (
        <div className="space-y-1">
          <div className="flex items-center text-yellow-800 dark:text-yellow-200 font-medium">
            ⚠️ 警告
          </div>
          {validation.warnings.map((warning, index) => (
            <div key={index} className="text-sm text-yellow-700 dark:text-yellow-300">
              • {warning}
            </div>
          ))}
        </div>
      )}

      {validation.suggestions.length > 0 && (
        <div className="mt-3 space-y-1">
          <div className="flex items-center text-blue-800 dark:text-blue-200 font-medium">
            💡 建议
          </div>
          {validation.suggestions.map((suggestion, index) => (
            <div key={index} className="text-sm text-blue-700 dark:text-blue-300">
              • {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ============================================================================
// 包装器组件 - 提供 StyleRecipe 上下文
// ============================================================================

export const ThemeSystemDemoWrapper: React.FC<ThemeSystemDemoProps> = (props) => {
  return (
    <StyleRecipeProvider>
      <ThemeSystemDemo {...props} />
    </StyleRecipeProvider>
  )
}

export default ThemeSystemDemoWrapper