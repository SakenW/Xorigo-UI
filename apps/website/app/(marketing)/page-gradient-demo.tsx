'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Button, Typography, Card } from '@xorigo-ui/core'
import { gradientUtils, type GradientType } from '@xorigo-ui/core/utils'

/**
 * 渐变工具演示页面
 * 展示如何使用新的渐变工具替换硬编码渐变
 */

export default function GradientDemoPage() {
  // 示例：展示不同渐变预设的效果
  const GradientShowcase = ({ preset, title, description }: {
    preset: GradientType
    title: string
    description: string
  }) => {
    const textGradient = gradientUtils.getTextGradientClasses(preset)
    const bgGradient = gradientUtils.getBackgroundGradientClasses(preset)
    const borderGradient = gradientUtils.getBorderGradientClasses(preset, 3)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        className="space-y-4"
      >
        {/* 文字渐变 */}
        <div className="text-center">
          <h2 style={textGradient.style} className="text-3xl font-bold">
            {title}
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            {description}
          </p>
        </div>

        {/* 背景渐变卡片 */}
        <div
          style={bgGradient.style}
          className="p-6 rounded-xl text-white shadow-lg"
        >
          <h3 className="text-xl font-semibold mb-2">
            背景渐变效果
          </h3>
          <p className="text-white/90">
            使用 {preset} 预设的背景渐变
          </p>
        </div>

        {/* 边框渐变卡片 */}
        <div
          style={borderGradient.style}
          className="p-6 rounded-xl bg-white dark:bg-gray-800"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
            边框渐变效果
          </h3>
          <p className="text-gray-600 dark:text-gray-300">
            使用 {preset} 预设的边框渐变
          </p>
        </div>
      </motion.div>
    )
  }

  // 动态渐变动画组件
  const AnimatedGradientDemo = () => {
    const animatedGradient = gradientUtils.createAnimatedGradient([
      'var(--bg-primary-action)',
      'var(--bg-secondary-action)',
      'var(--bg-warning)',
      'var(--bg-info)',
      'var(--bg-success)'
    ], 4)

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={animatedGradient}
        className="h-32 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-2xl"
      >
        动态彩虹渐变动画 (4秒循环)
      </motion.div>
    )
  }

  // 按钮渐变增强示例
  const EnhancedButton = ({ preset, label, variant }: {
    preset: GradientType
    label: string
    variant: 'background' | 'border' | 'text'
  }) => {
    const gradientStyle = gradientUtils.applyGradient(preset, variant)

    return (
      <Button
        style={gradientStyle.style}
        className="px-6 py-3 font-medium"
        variant="outline"
      >
        {label}
      </Button>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* 标题区域 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1
            style={gradientUtils.getTextGradientClasses('primary').style}
            className="text-5xl md:text-6xl font-bold mb-4"
          >
            Xorigo UI 渐变工具演示
          </h1>
          <p
            style={gradientUtils.getTextGradientClasses('subtle').style}
            className="text-xl md:text-2xl"
          >
            基于语义化令牌的渐变增强工具
          </p>
        </motion.div>

        {/* 渐变预设展示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            渐变预设展示
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <GradientShowcase
              preset="primary"
              title="主要色渐变"
              description="品牌主色，适用于重要元素"
            />
            <GradientShowcase
              preset="success"
              title="成功状态渐变"
              description="成功提示，完成状态"
            />
            <GradientShowcase
              preset="warning"
              title="警告状态渐变"
              description="警告提示，注意事项"
            />
            <GradientShowcase
              preset="error"
              title="错误状态渐变"
              description="错误提示，危险操作"
            />
            <GradientShowcase
              preset="info"
              title="信息状态渐变"
              description="信息提示，帮助说明"
            />
            <GradientShowcase
              preset="glass"
              title="玻璃效果渐变"
              description="透明层，现代UI设计"
            />
            <GradientShowcase
              preset="rainbow"
              title="彩虹渐变"
              description="多彩效果，特殊场合"
            />
            <GradientShowcase
              preset="dark"
              title="深色主题渐变"
              description="深色背景，高端效果"
            />
          </div>
        </motion.div>

        {/* 动态渐变展示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            动态渐变动画
          </h2>
          <div className="flex justify-center">
            <AnimatedGradientDemo />
          </div>
        </motion.div>

        {/* 按钮渐变增强展示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
            按钮渐变增强
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <EnhancedButton
              preset="primary"
              label="主要色背景"
              variant="background"
            />
            <EnhancedButton
              preset="success"
              label="成功色边框"
              variant="border"
            />
            <EnhancedButton
              preset="error"
              label="错误色文字"
              variant="text"
            />
            <EnhancedButton
              preset="rainbow"
              label="彩虹边框"
              variant="border"
            />
            <EnhancedButton
              preset="glass"
              label="玻璃效果背景"
              variant="background"
            />
          </div>
        </motion.div>

        {/* 使用说明 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            使用方法
          </h2>
          <div className="prose prose dark:prose-invert max-w-none">
            <div className="space-y-4 text-gray-700 dark:text-gray-300">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">文字渐变</h3>
                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">
                    {`const textGradient = gradientUtils.getTextGradientClasses('primary')
<h1 style={textGradient.style}>标题</h1>`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">背景渐变</h3>
                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">
                    {`const bgGradient = gradientUtils.getBackgroundGradientClasses('dark')
<div style={bgGradient.style}>内容</div>`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">动态渐变</h3>
                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">
                    {`const animatedGradient = gradientUtils.createAnimatedGradient([
  'var(--bg-primary-action)',
  'var(--bg-secondary-action)',
  'var(--bg-info)'
], 3)`}
                  </code>
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">增强组件</h3>
                <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg overflow-x-auto">
                  <code className="text-sm">
                    {`const gradientStyle = gradientUtils.applyGradient('primary', 'background')
<Button style={gradientStyle.style}>渐变按钮</Button>`}
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </motion.div>

        {/* 预设配置展示 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-8"
        >
          <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
            可用渐变预设
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.keys(gradientUtils.gradientPresets || {}).map((preset) => {
              const presetKey = preset as GradientType
              const presetConfig = gradientUtils.gradientPresets[presetKey]

              return (
                <div
                  key={preset}
                  className="bg-white dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600"
                >
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {presetConfig.description}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {presetConfig.usage}
                  </p>
                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-medium">背景:</span>
                      <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded mt-1 overflow-x-auto">
                        <code className="text-xs break-all">
                          {presetConfig.background}
                        </code>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">文字:</span>
                      <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded mt-1 overflow-x-auto">
                        <code className="text-xs break-all">
                          {presetConfig.text}
                        </code>
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">边框:</span>
                      <div className="bg-gray-100 dark:bg-gray-600 p-2 rounded mt-1 overflow-x-auto">
                        <code className="text-xs break-all">
                          {presetConfig.border}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}