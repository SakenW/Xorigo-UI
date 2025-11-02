'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { SevenAxisThemeProvider, useSevenAxisTheme } from '@xorigo-ui/core'
import { SiteNavigation } from '@/components/shared/site-navigation'
import { ThemeSelector } from '@/components/theme/theme-selector'
import { ThemePreview } from '@/components/theme/theme-preview'
import { Button } from '@xorigo-ui/core'

function ThemePageContent() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false)
  const { theme, currentRecipe, applyRecipe } = useSevenAxisTheme()

  useEffect(() => {
    // 获取当前应用的主题
    if (currentRecipe) {
      setSelectedTheme(currentRecipe.id)
    }
  }, [currentRecipe])

  const handleThemeSelect = async (themeId: string, theme: any) => {
    setIsApplying(true)
    try {
      setSelectedTheme(themeId)
      // 主题已经在 ThemeSelector 中应用了，这里只是更新状态
    } catch (error) {
      console.error('主题选择失败:', error)
    } finally {
      setIsApplying(false)
    }
  }

  const handleThemePreview = async (themeId: string, theme: any) => {
    try {
      // 预览主题 - 临时应用但不设为选中状态
      setPreviewTheme(themeId)
      await applyRecipe(theme.recipeId)
    } catch (error) {
      console.error('主题预览失败:', error)
    }
  }

  const handleStopPreview = () => {
    setPreviewTheme(null)
    // 恢复到原始选中的主题
    if (selectedTheme) {
      applyRecipe(selectedTheme)
    }
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-background-primary)', color: 'var(--color-text-primary)' }}>
      {/* 导航栏 */}
      <SiteNavigation />

      {/* 主要内容 */}
      <main className="pt-20">
        {/* 页面标题区域 */}
        <motion.section
          className="py-12 px-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: `linear-gradient(135deg,
              ${theme?.colors?.surface?.secondary || 'var(--color-surface-secondary)'} 0%,
              ${theme?.colors?.surface?.tertiary || 'var(--color-surface-tertiary)'} 100%)`
          }}
        >
          <div className="max-w-7xl mx-auto text-center">
            <motion.h1
              className="text-5xl font-bold mb-4"
              style={{ color: 'var(--color-text-primary)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              🎨 主题管理中心
            </motion.h1>

            <motion.p
              className="text-xl mb-8 max-w-3xl mx-auto leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              探索Xorigo UI强大的七轴主题系统，从20个精心设计的主题配方中选择，或创建属于你的独特风格
            </motion.p>

            <motion.div
              className="flex gap-4 justify-center flex-wrap"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button
                size="lg"
                onClick={() => {
                  const element = document.getElementById('theme-selector')
                  element?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                浏览主题
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => window.location.href = '/workbench'}
              >
                主题编辑器
              </Button>
            </motion.div>

            {/* 当前主题信息 */}
            {selectedTheme && (
              <motion.div
                className="mt-8 p-4 rounded-lg inline-block"
                style={{
                  backgroundColor: 'var(--color-surface-primary)',
                  border: '1px solid var(--color-border-default)'
                }}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: 'var(--color-primary-500)' }}
                  />
                  <span style={{ color: 'var(--color-text-primary)' }}>
                    当前主题: <strong className="font-semibold">
                      {ALL_THEMES.find(t => t.id === selectedTheme)?.name || selectedTheme}
                    </strong>
                  </span>
                  {isApplying && (
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* 功能特性区域 */}
        <motion.section
          className="py-16 px-4"
          style={{ backgroundColor: 'var(--color-background-secondary)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-7xl mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center mb-12"
              style={{ color: 'var(--color-text-primary)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              🚀 主题系统特性
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '🎨',
                  title: '20+ 预设主题',
                  description: '涵盖企业、极简、科技、创意等多种风格'
                },
                {
                  icon: '⚙️',
                  title: '七轴配方系统',
                  description: '模式、色调、饱和度、亮度、密度、圆度、对比度'
                },
                {
                  icon: '🔄',
                  title: '实时切换',
                  description: '一键切换主题，立即预览效果'
                },
                {
                  icon: '🎯',
                  title: '智能推荐',
                  description: '基于使用场景和偏好的主题推荐'
                },
                {
                  icon: '📱',
                  title: '响应式设计',
                  description: '完美适配桌面端和移动端设备'
                },
                {
                  icon: '♿',
                  title: '可访问性',
                  description: '支持高对比度模式，符合WCAG标准'
                },
                {
                  icon: '💾',
                  title: '主题保存',
                  description: '保存自定义主题，支持导入导出'
                },
                {
                  icon: '🤖',
                  title: 'AI 生成',
                  description: '基于描述自动生成主题配方（即将推出）'
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  className="p-6 rounded-lg text-center"
                  style={{
                    backgroundColor: 'var(--color-surface-primary)',
                    border: '1px solid var(--color-border-default)'
                  }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  whileHover={{
                    y: -5,
                    borderColor: 'var(--color-primary-300)',
                    boxShadow: 'var(--shadow-lg)'
                  }}
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: 'var(--color-text-primary)' }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* 主题选择器 */}
        <motion.section
          id="theme-selector"
          className="py-16 px-4"
          style={{ backgroundColor: 'var(--color-background-primary)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <ThemeSelector
            selectedTheme={selectedTheme || undefined}
            onThemeSelect={handleThemeSelect}
            onThemePreview={handleThemePreview}
            showSearch={true}
            showCategories={true}
            maxItems={20}
          />
        </motion.section>

        {/* 主题预览区域 */}
        {(previewTheme || selectedTheme) && (
          <motion.section
            className="py-16 px-4"
            style={{ backgroundColor: 'var(--color-background-secondary)' }}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <ThemePreview
              recipeId={previewTheme || selectedTheme || undefined}
              isExpanded={isPreviewExpanded}
              onToggleExpanded={() => setIsPreviewExpanded(!isPreviewExpanded)}
            />

            {/* 预览控制按钮 */}
            {previewTheme && previewTheme !== selectedTheme && (
              <div className="text-center mt-8">
                <div className="inline-flex gap-3">
                  <Button
                    variant="outline"
                    onClick={handleStopPreview}
                  >
                    停止预览
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedTheme(previewTheme)
                      setPreviewTheme(null)
                    }}
                  >
                    应用此主题
                  </Button>
                </div>
              </div>
            )}
          </motion.section>
        )}

        {/* 使用指南 */}
        <motion.section
          className="py-16 px-4"
          style={{ backgroundColor: 'var(--color-background-secondary)' }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="max-w-4xl mx-auto">
            <motion.h2
              className="text-3xl font-bold text-center mb-12"
              style={{ color: 'var(--color-text-primary)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              📖 使用指南
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  step: '01',
                  title: '浏览主题',
                  description: '通过分类和搜索功能找到喜欢的主题风格',
                  action: '点击"预览"查看效果'
                },
                {
                  step: '02',
                  title: '预览效果',
                  description: '实时预览主题在界面中的实际效果',
                  action: '确认满意后点击"应用"'
                },
                {
                  step: '03',
                  title: '应用主题',
                  description: '一键应用选定主题，立即生效',
                  action: '可以在工作台进一步自定义'
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div
                    className="absolute -top-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{
                      backgroundColor: 'var(--color-primary-500)',
                      color: 'white'
                    }}
                  >
                    {step.step}
                  </div>

                  <div
                    className="p-6 rounded-lg h-full pt-16"
                    style={{
                      backgroundColor: 'var(--color-surface-primary)',
                      border: '1px solid var(--color-border-default)'
                    }}
                  >
                    <h3
                      className="text-xl font-semibold mb-3"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-base mb-4 leading-relaxed"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {step.description}
                    </p>
                    <div
                      className="text-sm font-medium p-2 rounded"
                      style={{
                        backgroundColor: 'var(--color-surface-tertiary)',
                        color: 'var(--color-primary-600)'
                      }}
                    >
                      💡 {step.action}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  )
}

// 主题数据（与 ThemeSelector 中保持一致）
const ALL_THEMES = [
  {
    id: 'corporate-blue',
    name: '企业蓝',
    recipeId: 'light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow'
  },
  {
    id: 'corporate-navy-dark',
    name: '企业深蓝',
    recipeId: 'dark.neutral-cool-high.mono(navy).standard.comfortable.standard.soft-shadow'
  },
  {
    id: 'minimal-white',
    name: '极简白',
    recipeId: 'light.neutral-true-mid.mono(gray).calm.spacious.subtle.flat'
  },
  {
    id: 'minimal-graphite-dark',
    name: '极简石墨',
    recipeId: 'dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat'
  },
  {
    id: 'minimal-black-white',
    name: '极简黑白',
    recipeId: 'light.neutral-true-mid.mono(gray).calm.spacious.minimal.flat'
  },
  {
    id: 'tech-cyan',
    name: '科技青',
    recipeId: 'light.neutral-cool-mid.mono(cyan).standard.comfortable.standard.soft-shadow'
  },
  {
    id: 'tech-neon-dark',
    name: '科技霓虹',
    recipeId: 'dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon'
  },
  {
    id: 'cyber-blue-purple',
    name: '赛博蓝紫',
    recipeId: 'dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass'
  },
  {
    id: 'creative-purple',
    name: '创意紫',
    recipeId: 'light.neutral-true-mid.analog(purple).standard.comfortable.soft.spring'
  },
  {
    id: 'creative-aurora-dark',
    name: '创意极光',
    recipeId: 'dark.neutral-true-mid.analog(purple).vivid.comfortable.expressive.glass'
  },
  {
    id: 'royal-violet',
    name: '高贵紫罗兰',
    recipeId: 'dark.neutral-cool-high.mono(purple).vivid.comfortable.standard.glass'
  },
  {
    id: 'deep-ocean',
    name: '深海探索',
    recipeId: 'dark.neutral-cool-high.mono(blue).standard.comfortable.minimal.elevated'
  },
  {
    id: 'forest-nature',
    name: '自然森林',
    recipeId: 'light.neutral-true-mid.analog(green).standard.comfortable.standard.soft-shadow'
  },
  {
    id: 'warm-sunrise',
    name: '温暖晨曦',
    recipeId: 'light.neutral-warm-high.analog(orange).vibrant.comfortable.standard.soft-shadow'
  },
  {
    id: 'vibrant-lemon',
    name: '活力柠檬',
    recipeId: 'light.neutral-warm-mid.analog(yellow).vibrant.comfortable.expressive.soft-shadow'
  },
  {
    id: 'pink-romance',
    name: '粉彩浪漫',
    recipeId: 'light.neutral-warm-mid.analog(pink).soft.spacious.standard.soft-shadow'
  },
  {
    id: 'dreamy-rainbow',
    name: '梦幻彩虹',
    recipeId: 'light.neutral-true-mid.triadic(red,green,blue).vivid.spacious.expressive.glass'
  },
  {
    id: 'carnival-circus',
    name: '嘉年华马戏团',
    recipeId: 'light.neutral-warm-mid.triadic(red,yellow,blue).vibrant.comfortable.expressive.elevated'
  },
  {
    id: 'classic-neutral',
    name: '经典中性',
    recipeId: 'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow'
  },
  {
    id: 'high-contrast-pro',
    name: '高对比专业',
    recipeId: 'hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat'
  }
] as const

export default function ThemesPage() {
  return (
    <SevenAxisThemeProvider recipeId="corporate-blue">
      <ThemePageContent />
    </SevenAxisThemeProvider>
  )
}