'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Card } from '@xorigo-ui/core'
import {
  Sparkles,
  Code2,
  Palette,
  Crown,
  ArrowRight,
  Monitor,
  ChevronLeft,
  ChevronRight,
  Maximize2
} from 'lucide-react'
import dynamic from 'next/dynamic'

// 动态导入四个方案
const MinimalTechHome = dynamic(() => import('./v1-minimal'), { ssr: false })
const DeveloperHome = dynamic(() => import('./v2-developer'), { ssr: false })
const CreativeHome = dynamic(() => import('./v3-creative'), { ssr: false })
const UltimateHome = dynamic(() => import('./ultimate-stable'), { ssr: false })

/**
 * 首页选择器 - 预览和选择不同风格的首页
 */

const HomepageSelector = () => {
  const [selectedVersion, setSelectedVersion] = useState<number | null>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const versions = [
    {
      id: 1,
      title: '极简科技风',
      description: '流体渐变 • 粒子动效 • 玻璃态设计',
      icon: <Sparkles className="w-6 h-6" />,
      gradient: 'from-purple-500 to-cyan-500',
      preview: '/demo-v1.jpg',
      component: MinimalTechHome,
      features: ['大量留白', '流体渐变背景', '粒子动效', '玻璃态卡片', '数字动画']
    },
    {
      id: 2,
      title: '开发者友好风',
      description: '代码编辑器 • 终端美学 • 实时预览',
      icon: <Code2 className="w-6 h-6" />,
      gradient: 'from-cyan-500 to-blue-500',
      preview: '/demo-v2.jpg',
      component: DeveloperHome,
      features: ['代码高亮', '终端动画', '打字机效果', '组件预览器', '技术栈展示']
    },
    {
      id: 3,
      title: '创意动感风',
      description: '3D透视 • 霓虹光效 • 视差滚动',
      icon: <Palette className="w-6 h-6" />,
      gradient: 'from-pink-500 to-yellow-500',
      preview: '/demo-v3.jpg',
      component: CreativeHome,
      features: ['3D卡片效果', '霓虹发光', '鼠标跟随', '波浪动画', '视差滚动']
    },
    {
      id: 4,
      title: '终极稳定版',
      description: '稳定性能 • 优化体验 • 无错误',
      icon: <Crown className="w-6 h-6" />,
      gradient: 'from-purple-500 via-pink-500 to-cyan-500',
      preview: '/demo-v4.jpg',
      component: UltimateHome,
      features: ['稳定粒子系统', '简化3D轮播', '平滑滚动', '鼠标光晕', '优化性能', '代码编辑器', '渐变背景']
    }
  ]

  const handleSelectVersion = (id: number) => {
    setSelectedVersion(id)
    setIsFullscreen(true)
  }

  const handleBack = () => {
    setIsFullscreen(false)
    setTimeout(() => setSelectedVersion(null), 300)
  }

  const SelectedComponent = selectedVersion
    ? versions.find(v => v.id === selectedVersion)?.component
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
      <AnimatePresence mode="wait">
        {!isFullscreen ? (
          <motion.div
            key="selector"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="container mx-auto px-6 py-12"
          >
            {/* 标题区域 */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-cyan-600 bg-clip-text text-transparent">
                选择您的首页风格
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                四种精心设计的首页方案，每种都充分利用 React 19 和 Framer Motion 12 的强大功能，
                为 Xorigo UI 组件库打造极致的展示效果。
              </p>
            </motion.div>

            {/* 方案卡片网格 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {versions.map((version, index) => (
                <motion.div
                  key={version.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="group relative overflow-hidden h-full hover:shadow-2xl transition-all duration-500">
                    {/* 渐变背景效果 */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${version.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                    />

                    <div className="relative p-8">
                      {/* 图标 */}
                      <motion.div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${version.gradient} flex items-center justify-center text-white mb-6`}
                        whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                        transition={{ duration: 0.5 }}
                      >
                        {version.icon}
                      </motion.div>

                      {/* 标题和描述 */}
                      <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                        {version.title}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {version.description}
                      </p>

                      {/* 特性列表 */}
                      <ul className="space-y-2 mb-8">
                        {version.features.map((feature, i) => (
                          <motion.li
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + i * 0.05 }}
                            className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                          >
                            <ChevronRight className="w-4 h-4 mr-2 text-gray-400" />
                            {feature}
                          </motion.li>
                        ))}
                      </ul>

                      {/* 预览按钮组 */}
                      <div className="flex gap-3">
                        <Button
                          className={`flex-1 bg-gradient-to-r ${version.gradient} text-white hover:shadow-lg transition-all duration-300`}
                          onClick={() => handleSelectVersion(version.id)}
                        >
                          <Monitor className="w-4 h-4 mr-2" />
                          预览
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => handleSelectVersion(version.id)}
                        >
                          选择此方案
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* 底部说明 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mt-16 text-gray-600 dark:text-gray-400"
            >
              <p className="mb-2">
                所有方案均使用 <span className="font-semibold">Xorigo UI 组件库</span> 构建
              </p>
              <p className="text-sm mb-6">
                技术栈：React 19 • TypeScript 5.9 • Tailwind CSS • Framer Motion 12
              </p>

              {/* 直接访问链接 */}
              <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                <p className="text-sm font-medium mb-4">直接访问链接：</p>
                <div className="flex flex-wrap justify-center gap-3 text-xs">
                  <code className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">极简版: /demo/v1-minimal</code>
                  <code className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">开发版: /demo/v2-developer</code>
                  <code className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">创意版: /demo/v3-creative</code>
                  <code className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded">稳定版: /demo/ultimate-stable</code>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative min-h-screen"
          >
            {/* 返回按钮 */}
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={handleBack}
              className="fixed top-6 left-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-lg text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
              返回选择
            </motion.button>

            {/* 全屏切换按钮 */}
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              onClick={() => {
                if (!document.fullscreenElement) {
                  document.documentElement.requestFullscreen()
                } else {
                  document.exitFullscreen()
                }
              }}
              className="fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 bg-black/50 backdrop-blur-lg text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
              全屏
            </motion.button>

            {/* 渲染选中的组件 */}
            {SelectedComponent && <SelectedComponent />}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default HomepageSelector