'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { XorigoLogoLoader } from '@xorigo-ui/core'
import {
  Box, Square, Pentagon, Braces, Database, FileCode,
  ArrowRight, Navigation, Layout, BarChart, FileText,
  Loader2, Zap, Copy, Check, X
} from 'lucide-react'

// 🎯 动画配置
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const createWillChange = (properties: string[]) => ({
  willChange: properties.join(', ')
})

const createRandomizedAnimation = (baseDuration: number, variance: number = 0.2, index: number = 0) => {
  const seedRandom = (index: number) => {
    const x = Math.sin(index) * 10000
    return x - Math.floor(x)
  }

  const randomOffset = seedRandom(index) * variance
  const randomDelay = seedRandom(index + 100) * 0.5

  return {
    duration: baseDuration + randomOffset,
    ease: [0.4, 0, 0.6, 1] as const,
    repeat: Infinity,
    delay: randomDelay
  }
}

const ComponentCategoryGrid = ({
  selectedCategory,
  setSelectedCategory
}: {
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
}) => {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null)
  const categoryGridRef = useRef<HTMLDivElement>(null)
  const detailPanelRef = useRef<HTMLDivElement>(null)

  // 10个精选分类 - 参考首页配色方案
  const categories = [
    {
      id: 'ui-basic',
      name: 'UI 基础组件',
      description: 'Button, Card, Typography',
      components: ['Button', 'Card', 'Typography', 'Icon', 'Skeleton', 'AvatarGroup', 'AnimatedCard', 'Tooltip'],
      icon: <Box className="w-6 h-6" />,
      // 🎨 优雅的蓝紫渐变 - 参考首页
      primary: '#8b5cf6', // indigo-500
      secondary: '#7c3aed', // indigo-600
      accent: '#a78bfa', // indigo-400
      glow: 'rgba(139, 92, 246, 0.4)',
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 50%, #a78bfa 100%)',
      hoverGradient: 'linear-gradient(135deg, #a78bfa 0%, #8b5cf6 50%, #c4b5fd 100%)',
      selectedGradient: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #8b5cf6 100%)',
    },
    {
      id: 'inputs',
      name: 'Inputs 输入控件',
      description: 'Input, Checkbox, Select',
      components: ['Input', 'Checkbox', 'Select', 'Radio', 'Switch', 'Slider', 'DatePicker', 'FileInput'],
      icon: <Zap className="w-6 h-6" />,
      // 🌟 温暖的橙粉渐变 - 参考首页
      primary: '#f97316', // orange-500
      secondary: '#fb923c', // orange-400
      accent: '#fdba74', // orange-300
      glow: 'rgba(249, 115, 22, 0.4)',
      gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)',
      hoverGradient: 'linear-gradient(135deg, #fb923c 0%, #fdba74 50%, #fed7aa 100%)',
      selectedGradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)',
    },
    {
      id: 'navigation',
      name: 'Navigation 导航结构',
      description: 'Navbar, Breadcrumb, Menu',
      components: ['Navbar', 'Breadcrumb', 'Menu', 'Tabs', 'Pagination', 'Sidebar'],
      icon: <Navigation className="w-6 h-6" />,
      // 🌊 清新的青色渐变 - 参考首页
      primary: '#06b6d4', // cyan-500
      secondary: '#22d3ee', // cyan-400
      accent: '#67e8f9', // cyan-300
      glow: 'rgba(6, 182, 212, 0.4)',
      gradient: 'linear-gradient(135deg, #06b6d4 0%, #22d3ee 50%, #67e8f9 100%)',
      hoverGradient: 'linear-gradient(135deg, #22d3ee 0%, #67e8f9 50%, #a5f3fc 100%)',
      selectedGradient: 'linear-gradient(135deg, #0891b2 0%, #06b6d4 50%, #22d3ee 100%)',
    },
    {
      id: 'feedback',
      name: 'Feedback 反馈状态',
      description: 'Alert, Loading, Spinner',
      components: ['Alert', 'Loading', 'Spinner', 'Toast', 'Progress', 'Badge'],
      icon: <Loader2 className="w-6 h-6" />,
      // 🌿 自然的翠绿渐变 - 参考首页
      primary: '#10b981', // emerald-500
      secondary: '#34d399', // emerald-400
      accent: '#6ee7b7', // emerald-300
      glow: 'rgba(16, 185, 129, 0.4)',
      gradient: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #6ee7b7 100%)',
      hoverGradient: 'linear-gradient(135deg, #34d399 0%, #6ee7b7 50%, #a7f3d0 100%)',
      selectedGradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
    },
    {
      id: 'overlays',
      name: 'Overlays 弹层遮罩',
      description: 'Modal, Dialog, Drawer',
      components: ['Modal', 'Dialog', 'Drawer', 'Popover', 'Tooltip', 'Dropdown'],
      icon: <Layout className="w-6 h-6" />,
      // 🔥 热情的玫瑰渐变 - 参考首页
      primary: '#ec4899', // pink-500
      secondary: '#f472b6', // pink-400
      accent: '#f9a8d4', // pink-300
      glow: 'rgba(236, 72, 153, 0.4)',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
      hoverGradient: 'linear-gradient(135deg, #f472b6 0%, #f9a8d4 50%, #fbcfe8 100%)',
      selectedGradient: 'linear-gradient(135deg, #db2777 0%, #ec4899 50%, #f472b6 100%)',
    },
    {
      id: 'data-display',
      name: 'DataDisplay 数据展示',
      description: 'Table, Code, Charts',
      components: ['Table', 'Code', 'Chart', 'List', 'Calendar', 'Timeline'],
      icon: <BarChart className="w-6 h-6" />,
      // 💎 深邃的蓝色渐变 - 参考首页
      primary: '#3b82f6', // blue-500
      secondary: '#60a5fa', // blue-400
      accent: '#93c5fd', // blue-300
      glow: 'rgba(59, 130, 246, 0.4)',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93c5fd 100%)',
      hoverGradient: 'linear-gradient(135deg, #60a5fa 0%, #93c5fd 50%, #bfdbfe 100%)',
      selectedGradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
    },
    {
      id: 'layout',
      name: 'Layout 布局分区',
      description: 'Container, Flex, Grid',
      components: ['Container', 'Flex', 'Grid', 'Stack', 'Columns', 'Spacer'],
      icon: <Layout className="w-6 h-6" />,
      // 🎭 优雅的紫色渐变 - 参考首页
      primary: '#a855f7', // purple-500
      secondary: '#c084fc', // purple-400
      accent: '#d8b4fe', // purple-300
      glow: 'rgba(168, 85, 247, 0.4)',
      gradient: 'linear-gradient(135deg, #a855f7 0%, #c084fc 50%, #d8b4fe 100%)',
      hoverGradient: 'linear-gradient(135deg, #c084fc 0%, #d8b4fe 50%, #e9d5ff 100%)',
      selectedGradient: 'linear-gradient(135deg, #9333ea 0%, #a855f7 50%, #c084fc 100%)',
    },
    {
      id: 'charts',
      name: 'Charts 图表组件',
      description: 'Chart, BarChart, LineChart',
      components: ['Chart', 'BarChart', 'LineChart', 'PieChart', 'AreaChart'],
      icon: <BarChart className="w-6 h-6" />,
      // 🌸 温柔的黄色渐变 - 参考首页
      primary: '#eab308', // yellow-500
      secondary: '#facc15', // yellow-400
      accent: '#fde047', // yellow-300
      glow: 'rgba(234, 179, 8, 0.4)',
      gradient: 'linear-gradient(135deg, #eab308 0%, #facc15 50%, #fde047 100%)',
      hoverGradient: 'linear-gradient(135deg, #facc15 0%, #fde047 50%, #fef08a 100%)',
      selectedGradient: 'linear-gradient(135deg, #ca8a04 0%, #eab308 50%, #facc15 100%)',
    },
    {
      id: 'forms',
      name: 'Forms 表单容器',
      description: 'Form, FormField, Fieldset',
      components: ['Form', 'FormField', 'Fieldset', 'FormValidation', 'FormSubmit'],
      icon: <FileText className="w-6 h-6" />,
      // 🌺 优雅的绿色渐变 - 参考首页
      primary: '#84cc16', // lime-500
      secondary: '#a3e635', // lime-400
      accent: '#bef264', // lime-300
      glow: 'rgba(132, 204, 22, 0.4)',
      gradient: 'linear-gradient(135deg, #84cc16 0%, #a3e635 50%, #bef264 100%)',
      hoverGradient: 'linear-gradient(135deg, #a3e635 0%, #bef264 50%, #d9f99d 100%)',
      selectedGradient: 'linear-gradient(135deg, #65a30d 0%, #84cc16 50%, #a3e635 100%)',
    },
    {
      id: 'utilities',
      name: 'Utilities 工具类',
      description: 'CopyButton, ScrollArea, Portal',
      components: ['CopyButton', 'ScrollArea', 'Portal', 'PortalProvider', 'useClickOutside'],
      icon: <Zap className="w-6 h-6" />,
      // ⚡ 活力的红色渐变 - 参考首页
      primary: '#ef4444', // red-500
      secondary: '#f87171', // red-400
      accent: '#fca5a5', // red-300
      glow: 'rgba(239, 68, 68, 0.4)',
      gradient: 'linear-gradient(135deg, #ef4444 0%, #f87171 50%, #fca5a5 100%)',
      hoverGradient: 'linear-gradient(135deg, #f87171 0%, #fca5a5 50%, #fecaca 100%)',
      selectedGradient: 'linear-gradient(135deg, #dc2626 0%, #ef4444 50%, #f87171 100%)',
    },
  ]

  // 🎯 优化的交互逻辑 - 双状态管理 + 焦点管理
  const handleCardClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    // 点击后聚焦到下方展示区域
    setTimeout(() => {
      detailPanelRef.current?.focus()
      // 确保详情面板在视窗内
      detailPanelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  const handleClose = () => {
    setSelectedCategory(null)
    // 关闭后焦点回到卡片网格区域
    setTimeout(() => {
      categoryGridRef.current?.focus()
      // 滚动回卡片区域
      categoryGridRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 100)
  }

  // 键盘导航支持
  const handleKeyDown = (e: React.KeyboardEvent, categoryId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      handleCardClick(categoryId)
    } else if (e.key === 'Escape' && selectedCategory) {
      e.preventDefault()
      handleClose()
    }
  }

  const handleDetailKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault()
      handleClose()
    }
  }

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* 🎯 统一尺寸分类网格 */}
      <div
        ref={categoryGridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-20"
        tabIndex={0}
        role="grid"
        aria-label="组件分类"
      >
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.id
          const isHovered = hoveredCategory === category.id

          const handleMouseEnter = () => {
            setHoveredCategory(category.id)
          }

          const handleMouseLeave = () => {
            setHoveredCategory(null)
          }

          return (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 60, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                delay: index * 0.12,
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="relative group"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              role="gridcell"
              tabIndex={isSelected ? 0 : -1}
              aria-selected={isSelected}
              aria-label={`${category.name}，包含${category.components.length}个组件`}
              onKeyDown={(e) => handleKeyDown(e, category.id)}
            >
              {/* 🌟 超精致卡片容器 */}
              <motion.div
                className={`relative cursor-pointer transform-gpu aspect-square`}
                style={createWillChange(['transform', 'opacity'])}
                whileHover={{
                  y: -12,
                  scale: 1.03,
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => handleCardClick(category.id)}
              >
                {/* 🌟 第一层：优雅的外层光晕 */}
                <motion.div
                  className={`absolute -inset-2 rounded-3xl transition-all duration-1000 ${
                    isSelected ? 'opacity-100' : 'opacity-0'
                  } ${!isSelected && isHovered ? 'group-hover:opacity-100' : ''}`}
                  style={{
                    background: isSelected
                      ? category.selectedGradient
                      : isHovered
                        ? category.hoverGradient
                        : category.gradient,
                    opacity: isSelected ? 0.6 : isHovered ? 0.4 : 0.3,
                    filter: `blur(16px)`,
                  }}
                  animate={{
                    scale: isSelected ? [1, 1.2, 1] : isHovered ? [1, 1.1, 1] : [1, 1.05, 1],
                    opacity: isSelected ? [0.5, 0.8, 0.5] : isHovered ? [0.3, 0.5, 0.3] : [0.2, 0.4, 0.2],
                  }}
                  transition={createRandomizedAnimation(4, 0.8, index)}
                />

                {/* ✨ 第二层：精致的光晕边框 */}
                <motion.div
                  className={`absolute inset-0 rounded-3xl transition-all duration-500 ${
                    isSelected
                      ? 'ring-2 shadow-lg'
                      : isHovered
                        ? 'ring-1 shadow-md'
                        : ''
                  }`}
                  style={{
                    ringColor: isSelected
                      ? category.primary
                      : isHovered
                        ? category.secondary
                        : 'transparent',
                    ringOpacity: isSelected ? 0.5 : 0.3,
                    boxShadow: isSelected
                      ? `0 0 24px ${category.glow}`
                      : isHovered
                        ? `0 0 16px ${category.glow}`
                        : 'none',
                    background: `linear-gradient(135deg, ${category.primary}10, ${category.secondary}10, transparent)`,
                  }}
                />

                {/* 💎 第三层：主卡片容器 */}
                <div className={`relative w-full h-full rounded-3xl backdrop-blur-xl overflow-hidden transition-all duration-700 ${
                  isSelected
                    ? 'bg-gradient-to-br from-gray-900/95 via-gray-800/90 to-gray-700/85'
                    : isHovered
                      ? 'bg-gradient-to-br from-gray-900/90 via-gray-800/85 to-gray-700/80'
                      : 'bg-gradient-to-br from-gray-900/85 via-gray-800/80 to-gray-700/75'
                }`}>

                  {/* 🌟 精致的内部背景纹理 */}
                  <motion.div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: isSelected
                        ? `radial-gradient(circle at 25% 25%, ${category.primary}15 0%, transparent 50%), radial-gradient(circle at 75% 75%, ${category.secondary}10 0%, transparent 50%)`
                        : 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)',
                    }}
                    animate={{
                      scale: [1, 1.15, 1],
                      rotate: [0, 3, -3, 0],
                    }}
                    transition={{
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />

                  {/* 🔮 精美的图标容器 */}
                  <div className="relative pt-6 pb-4 px-5">
                    <motion.div
                      className="flex items-center justify-center w-20 h-20 mx-auto mb-4 rounded-2xl shadow-2xl backdrop-blur-2xl border"
                      style={{
                        background: isSelected
                          ? category.selectedGradient
                          : isHovered
                            ? category.hoverGradient
                            : category.gradient,
                        borderColor: isSelected
                          ? `${category.primary}30`
                          : isHovered
                            ? `${category.secondary}40`
                            : 'rgba(255,255,255,0.15)',
                        boxShadow: isSelected
                          ? `0 8px 32px ${category.glow}`
                          : isHovered
                            ? `0 4px 20px ${category.glow}`
                            : '0 4px 16px rgba(0,0,0,0.3)',
                      }}
                      animate={{
                        scale: isHovered ? [1, 1.1, 1] : [1, 1.02, 1],
                        rotate: isHovered ? [0, 8, -8, 0] : [0, 0, 0],
                      }}
                      transition={{
                        duration: isHovered ? 0.6 : 0.4,
                        ease: "easeInOut",
                        repeat: isHovered ? Infinity : 0,
                        repeatDelay: isHovered ? 1 : 0
                      }}
                    >
                      {/* 图标内部精致光效 */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: `radial-gradient(circle at center, ${category.accent}30 0%, transparent 70%)`,
                        }}
                        animate={{
                          scale: [0.8, 1.3, 0.8],
                          opacity: [0.3, 0.7, 0.3],
                        }}
                        transition={createRandomizedAnimation(3, 0.6, index * 10)}
                      />

                      {/* 图标主体 */}
                      <div className="relative z-10">
                        {React.cloneElement(category.icon, {
                          className: "w-10 h-10 text-[var(--color-text-primary)]/95 drop-shadow-2xl",
                          style: {
                            filter: `drop-shadow(0 0 16px ${category.accent})`,
                          }
                        })}
                      </div>
                    </motion.div>

                    {/* 🏷️ 优雅的标题区域 */}
                    <div className="text-center mb-3">
                      <motion.h3
                        className={`font-bold leading-tight transition-colors duration-400 ${
                          isSelected
                            ? 'text-transparent bg-clip-text bg-gradient-to-r'
                            : 'text-[var(--color-text-primary)]'
                        }`}
                        style={{
                          fontSize: '13px',
                          letterSpacing: '0.5px',
                          backgroundImage: isSelected
                            ? `linear-gradient(135deg, ${category.accent}, ${category.primary})`
                            : undefined,
                        }}
                      >
                        {category.name}
                      </motion.h3>

                      {/* 优雅的装饰线 */}
                      <motion.div
                        className="h-px mx-auto mt-2 mb-3 rounded-full"
                        style={{
                          background: isSelected
                            ? `linear-gradient(90deg, transparent, ${category.primary}, ${category.accent}, transparent)`
                            : isHovered
                              ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)'
                              : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)',
                        }}
                        initial={{ width: "30%" }}
                        animate={{ width: isHovered ? "70%" : "50%" }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>

                    {/* 📄 精致的描述文字 */}
                    <motion.p
                      className={`text-center transition-all duration-400 leading-relaxed mb-4 px-2 ${
                        isSelected
                          ? 'text-[var(--color-text-primary)]/90'
                          : isHovered
                            ? 'text-[var(--color-text-primary)]/80'
                            : 'text-[var(--color-text-secondary)]/70'
                      }`}
                      style={{ fontSize: '10px', lineHeight: '1.4' }}
                    >
                      {category.description}
                    </motion.p>

                    {/* 💎 优雅的组件数量标签 - 非按钮形式 */}
                    <div className="flex justify-center mb-4">
                      <div className="relative">
                        {/* 装饰性背景光晕 */}
                        <motion.div
                          className={`absolute inset-0 rounded-full transition-all duration-500 ${
                            isSelected ? 'opacity-100' : isHovered ? 'opacity-60' : 'opacity-30'
                          }`}
                          style={{
                            background: isSelected
                              ? `radial-gradient(circle, ${category.accent}20 0%, transparent 70%)`
                              : isHovered
                                ? `radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)`
                                : `radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)`,
                            transform: 'scale(1.5)',
                          }}
                          animate={{
                            scale: isSelected ? [1.2, 1.8, 1.2] : isHovered ? [1.1, 1.4, 1.1] : [1, 1.2, 1],
                            opacity: isSelected ? [0.4, 0.7, 0.4] : isHovered ? [0.3, 0.5, 0.3] : [0.2, 0.3, 0.2],
                          }}
                          transition={createRandomizedAnimation(4, 0.8, index * 15)}
                        />

                        {/* 数量显示主体 */}
                        <div className="relative px-4 py-2">
                          <div className="flex items-center gap-2">
                            {/* 数字部分 */}
                            <motion.span
                              className={`text-2xl font-bold transition-all duration-400 ${
                                isSelected
                                  ? 'text-transparent bg-clip-text bg-gradient-to-r'
                                  : isHovered
                                    ? 'text-[var(--color-text-primary)]/95'
                                    : 'text-[var(--color-text-secondary)]/90'
                              }`}
                              style={{
                                fontSize: '18px',
                                fontWeight: '700',
                                backgroundImage: isSelected
                                  ? `linear-gradient(135deg, ${category.accent}, ${category.primary})`
                                  : undefined,
                                textShadow: isSelected
                                  ? `0 0 16px ${category.accent}`
                                  : isHovered
                                    ? '0 0 8px rgba(255,255,255,0.3)'
                                    : 'none',
                              }}
                              animate={{
                                scale: isSelected ? [1, 1.05, 1] : isHovered ? [1, 1.02, 1] : [1, 1.01, 1],
                              }}
                              transition={{
                                duration: 3,
                                repeat: Infinity,
                                ease: "easeInOut"
                              }}
                            >
                              {category.components.length}
                            </motion.span>

                            {/* 文字部分 */}
                            <span
                              className={`text-sm font-medium transition-colors duration-400 ${
                                isSelected
                                  ? 'text-[var(--color-text-primary)]/90'
                                  : isHovered
                                    ? 'text-[var(--color-text-primary)]/80'
                                    : 'text-gray-500/80'
                              }`}
                              style={{
                                fontSize: '11px',
                                letterSpacing: '0.5px',
                              }}
                            >
                              个组件
                            </span>
                          </div>

                          {/* 装饰性下划线 */}
                          <motion.div
                            className="h-px rounded-full mt-1"
                            style={{
                              background: isSelected
                                ? `linear-gradient(90deg, ${category.accent}, ${category.primary}, ${category.accent})`
                                : isHovered
                                  ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)'
                                  : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                            }}
                            initial={{ width: "40%" }}
                            animate={{
                              width: isSelected ? "100%" : isHovered ? "80%" : "60%"
                            }}
                            transition={{
                              duration: 0.6,
                              ease: "easeInOut"
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* 🎯 精致的交互指示器 */}
                    <motion.div
                      className="flex justify-center mt-4"
                      animate={{
                        y: isHovered ? -3 : 0,
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className={`p-2 rounded-full transition-all duration-400 backdrop-blur-sm border ${
                          isSelected
                            ? 'shadow-lg'
                            : isHovered
                              ? 'shadow-md'
                              : 'shadow-sm'
                        }`}
                        style={{
                          background: isSelected
                            ? `linear-gradient(135deg, ${category.primary}30, ${category.secondary}20)`
                            : isHovered
                              ? `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.08))`
                              : 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.04))',
                          borderColor: isSelected
                            ? category.primary
                            : isHovered
                              ? `${category.secondary}50`
                              : 'rgba(255,255,255,0.2)',
                          boxShadow: isSelected
                            ? `0 4px 16px ${category.glow}`
                            : isHovered
                              ? `0 2px 10px ${category.glow}`
                              : '0 1px 6px rgba(0,0,0,0.2)',
                        }}
                        whileHover={{
                          scale: 1.15,
                          rotate: isSelected ? 360 : 0,
                        }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.4 }}
                      >
                        {isSelected ? (
                          <motion.div
                            initial={{ rotate: 0 }}
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                          >
                            <Check className="w-4 h-4" style={{ color: category.accent }} />
                          </motion.div>
                        ) : (
                          <ArrowRight className={`w-4 h-4 transition-colors duration-400 ${
                            isHovered
                              ? 'text-[var(--color-text-primary)]/95'
                              : 'text-[var(--color-text-secondary)]/80'
                          }`} />
                        )}
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* 🌟 底部优雅装饰光效 */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-12 rounded-b-3xl"
                    style={{
                      background: isSelected
                        ? `linear-gradient(to top, ${category.primary}20, ${category.secondary}10, transparent)`
                        : 'linear-gradient(to top, rgba(255,255,255,0.08), transparent)',
                    }}
                    animate={{
                      opacity: isSelected ? [0.3, 0.6, 0.3] : [0.2, 0.4, 0.2],
                      scale: [1, 1.1, 1],
                    }}
                    transition={createRandomizedAnimation(4, 0.8, 1)}
                  />
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* 🎯 选中分类的详细展示 - 下方框架 */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            ref={detailPanelRef}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative mt-12"
            tabIndex={0}
            role="region"
            aria-labelledby="detail-panel-title"
            onKeyDown={handleDetailKeyDown}
          >
            <div
              className="p-10 backdrop-blur-xl rounded-3xl border shadow-2xl overflow-hidden relative"
              style={{
                background: selectedCategory
                  ? `linear-gradient(135deg, ${categories.find(c => c.id === selectedCategory)?.primary}08, ${categories.find(c => c.id === selectedCategory)?.secondary}05, rgba(17, 24, 39, 0.95))`
                  : 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.98))',
                borderColor: selectedCategory
                  ? `${categories.find(c => c.id === selectedCategory)?.primary}30`
                  : 'rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}>

              {/* 🌌 优雅的背景光效 */}
              <motion.div
                className="absolute inset-0 rounded-3xl"
                style={{
                  background: selectedCategory
                    ? `radial-gradient(circle at 20% 20%, ${categories.find(c => c.id === selectedCategory)?.primary}15 0%, transparent 50%), radial-gradient(circle at 80% 80%, ${categories.find(c => c.id === selectedCategory)?.secondary}10 0%, transparent 50%)`
                    : 'radial-gradient(circle at 20% 20%, rgba(99, 102, 241, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
                }}
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={createRandomizedAnimation(6, 1.2, 2)}
              />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center gap-6">
                    {/* 🔷 优雅的大图标容器 */}
                    <motion.div
                      className="p-5 rounded-2xl shadow-xl border"
                      style={{
                        background: selectedCategory
                          ? categories.find(c => c.id === selectedCategory)?.selectedGradient
                          : undefined,
                        borderColor: selectedCategory
                          ? `${categories.find(c => c.id === selectedCategory)?.primary}40`
                          : 'rgba(255, 255, 255, 0.2)',
                        boxShadow: selectedCategory
                          ? `0 8px 32px ${categories.find(c => c.id === selectedCategory)?.glow}`
                          : '0 4px 16px rgba(0, 0, 0, 0.3)',
                      }}
                      whileHover={{
                        scale: 1.05,
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      {/* 图标内部光效 */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl"
                        style={{
                          background: selectedCategory
                            ? `radial-gradient(circle at center, ${categories.find(c => c.id === selectedCategory)?.accent}30 0%, transparent 70%)`
                            : 'radial-gradient(circle at center, rgba(255,255,255,0.2) 0%, transparent 70%)',
                        }}
                        animate={{
                          scale: [0.9, 1.2, 0.9],
                          opacity: [0.3, 0.6, 0.3],
                        }}
                        transition={createRandomizedAnimation(3, 0.6, 3)}
                      />

                      {React.cloneElement(
                        categories.find(c => c.id === selectedCategory)?.icon as React.ReactElement,
                        {
                          className: "w-10 h-10 text-[var(--color-text-primary)]/95 drop-shadow-lg",
                          style: {
                            filter: selectedCategory
                              ? `drop-shadow(0 0 20px ${categories.find(c => c.id === selectedCategory)?.accent})`
                              : 'drop-shadow(0 0 10px rgba(255,255,255,0.3))',
                          }
                        }
                      )}
                    </motion.div>

                    <div>
                      <h3
                        id="detail-panel-title"
                        className={`text-2xl font-bold mb-2 transition-all duration-400 ${
                          selectedCategory
                            ? 'text-transparent bg-clip-text bg-gradient-to-r'
                            : 'text-[var(--color-text-primary)]'
                        }`}
                        style={{
                          backgroundImage: selectedCategory
                            ? `linear-gradient(135deg, ${categories.find(c => c.id === selectedCategory)?.accent}, ${categories.find(c => c.id === selectedCategory)?.primary})`
                            : undefined,
                        }}
                      >
                        {categories.find(c => c.id === selectedCategory)?.name}
                      </h3>
                      <p className="text-[var(--color-text-tertiary)] text-sm mb-3 leading-relaxed">
                        {categories.find(c => c.id === selectedCategory)?.description}
                      </p>
                      <div className="flex items-center gap-4">
                        <motion.span
                          className="flex items-center gap-2 px-4 py-2 rounded-full border backdrop-blur-sm transition-all duration-300"
                          style={{
                            background: selectedCategory
                              ? `linear-gradient(135deg, ${categories.find(c => c.id === selectedCategory)?.primary}25, ${categories.find(c => c.id === selectedCategory)?.secondary}15)`
                              : 'linear-gradient(135deg, rgba(34, 197, 94, 0.2), rgba(16, 185, 129, 0.15))',
                            borderColor: selectedCategory
                              ? categories.find(c => c.id === selectedCategory)?.primary
                              : 'var(--color-success-500)',
                            boxShadow: selectedCategory
                              ? `0 4px 16px ${categories.find(c => c.id === selectedCategory)?.glow}`
                              : '0 2px 8px rgba(34, 197, 94, 0.3)',
                          }}
                          whileHover={{ scale: 1.05 }}
                        >
                          <div
                            className="w-2 h-2 rounded-full animate-pulse"
                            style={{
                              backgroundColor: selectedCategory
                                ? categories.find(c => c.id === selectedCategory)?.accent
                                : 'var(--color-success-400)',
                              boxShadow: selectedCategory
                                ? `0 0 8px ${categories.find(c => c.id === selectedCategory)?.accent}`
                                : '0 0 8px rgba(52, 211, 153, 0.6)',
                            }}
                          />
                          <span
                            className="font-semibold transition-colors duration-300"
                            style={{
                              color: selectedCategory
                                ? categories.find(c => c.id === selectedCategory)?.accent
                                : 'var(--color-success-400)',
                            }}
                          >
                            {categories.find(c => c.id === selectedCategory)?.components.length} 个组件
                          </span>
                        </motion.span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={handleClose}
                    className="p-3 rounded-lg transition-all duration-300 backdrop-blur-sm border"
                    style={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      background: 'rgba(255, 255, 255, 0.05)',
                    }}
                    whileHover={{
                      scale: 1.1,
                      rotate: 90,
                      borderColor: selectedCategory
                        ? `${categories.find(c => c.id === selectedCategory)?.primary}50`
                        : 'rgba(255, 255, 255, 0.3)',
                      background: selectedCategory
                        ? `${categories.find(c => c.id === selectedCategory)?.primary}15`
                        : 'rgba(255, 255, 255, 0.1)',
                    }}
                    whileTap={{ scale: 0.9 }}
                    title="关闭详情并返回组件列表"
                  >
                    <X className="w-5 h-5 transition-colors duration-300" style={{
                      color: selectedCategory
                        ? categories.find(c => c.id === selectedCategory)?.primary
                        : '#9ca3af',
                    }} />
                  </motion.button>
                </div>

                {/* 🎨 优雅的组件网格展示 */}
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                  {categories.find(c => c.id === selectedCategory)?.components.map((component, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: idx * 0.05, duration: 0.4 }}
                      className="p-4 backdrop-blur-md rounded-xl border transition-all duration-300 cursor-pointer group text-center"
                      style={{
                        background: selectedCategory
                          ? `linear-gradient(135deg, ${categories.find(c => c.id === selectedCategory)?.primary}15, ${categories.find(c => c.id === selectedCategory)?.secondary}10)`
                          : 'linear-gradient(135deg, rgba(55, 65, 81, 0.6), rgba(75, 85, 99, 0.5))',
                        borderColor: selectedCategory
                          ? `${categories.find(c => c.id === selectedCategory)?.primary}30`
                          : 'rgba(156, 163, 175, 0.3)',
                      }}
                      whileHover={{
                        y: -4,
                        scale: 1.05,
                        borderColor: selectedCategory
                          ? `${categories.find(c => c.id === selectedCategory)?.primary}50`
                          : 'rgba(156, 163, 175, 0.5)',
                        background: selectedCategory
                          ? `linear-gradient(135deg, ${categories.find(c => c.id === selectedCategory)?.primary}20, ${categories.find(c => c.id === selectedCategory)?.secondary}15)`
                          : 'linear-gradient(135deg, rgba(55, 65, 81, 0.7), rgba(75, 85, 99, 0.6))',
                        boxShadow: selectedCategory
                          ? `0 8px 24px ${categories.find(c => c.id === selectedCategory)?.glow}`
                          : '0 4px 12px rgba(0, 0, 0, 0.3)',
                      }}
                    >
                      <div
                        className="w-12 h-12 mx-auto mb-2 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm border"
                        style={{
                          background: selectedCategory
                            ? `linear-gradient(135deg, ${categories.find(c => c.id === selectedCategory)?.accent}25, ${categories.find(c => c.id === selectedCategory)?.primary}20)`
                            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.15))',
                          borderColor: selectedCategory
                            ? `${categories.find(c => c.id === selectedCategory)?.accent}30`
                            : 'rgba(255, 255, 255, 0.2)',
                        }}
                      >
                        <span
                          className="text-lg font-bold transition-colors duration-300"
                          style={{
                            color: selectedCategory
                              ? categories.find(c => c.id === selectedCategory)?.accent
                              : 'var(--color-secondary-400)',
                            textShadow: selectedCategory
                              ? `0 0 12px ${categories.find(c => c.id === selectedCategory)?.accent}`
                              : '0 0 8px rgba(167, 139, 250, 0.5)',
                          }}
                        >
                          {component[0]}
                        </span>
                      </div>
                      <span
                        className="text-xs font-medium transition-colors duration-300 leading-tight"
                        style={{
                          color: selectedCategory
                            ? categories.find(c => c.id === selectedCategory)?.accent
                            : '#d1d5db',
                        }}
                      >
                        {component}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


export { ComponentCategoryGrid }
