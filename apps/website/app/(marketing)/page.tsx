'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo, useContext, Suspense } from 'react'
import { motion, useScroll, useTransform, useSpring, AnimatePresence, useMotionValue, useVelocity, useAnimationFrame, MotionValue, useInView } from 'framer-motion'

// 🎯 动画优化：创建 variants 简化动画参数配置
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
}

const cardVariants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] }
  },
  hover: {
    scale: 1.02,
    transition: { duration: 0.3, ease: "easeOut" }
  }
}

const floatVariants = {
  animate: {
    y: [0, -8, 0],
    transition: { duration: 3, ease: "easeInOut", repeat: Infinity }
  }
}

// 🎯 动画优化：创建随机偏移函数，避免周期同步卡顿
const createRandomizedAnimation = (baseDuration: number, variance: number = 0.2, index: number = 0) => {
  // 使用索引作为种子，确保每个组件有稳定的随机值
  const seedRandom = (index: number) => {
    const x = Math.sin(index) * 10000
    return x - Math.floor(x)
  }

  const randomOffset = seedRandom(index) * variance
  const randomDelay = seedRandom(index + 100) * 0.5

  return {
    duration: baseDuration + randomOffset,
    ease: [0.4, 0, 0.6, 1] as const, // 修复类型错误
    repeat: Infinity,
    delay: randomDelay
  }
}

// 🎯 动画优化：创建 will-change 样式生成器
const createWillChange = (properties: string[]) => ({
  willChange: properties.join(', ')
})
import { Button, Card, AnimatedCard, Typography, Surface, Code as CodeComponent, XorigoLogoLoader } from '@xorigo-ui/core'
import { SuperParticleSystem, FluidBackground } from '../../src/components/effects'
import { Component3DCarousel } from '../../src/components/showcase'
import { CodeEditor } from '../../src/components/interactive'
import { categoryColors } from '@xorigo-ui/tokens'
import {
  Zap,
  Palette,
  Box,
  Github,
  ArrowRight,
  Copy,
  Check,
  Code2,
  Rocket,
  Menu,
  X,
  Square,
  Pentagon,
  Braces,
  Database,
  FileCode,
  Play,
  Volume2,
  VolumeX,
  Loader2,
  Navigation,
  Layout,
  BarChart,
  FileText
} from 'lucide-react'

/**
 * Xorigo UI 主页 - 稳定优秀版
 * 基于 stable-excellent 页面的优化版本，作为新的主页展示
 *
 * 主要特性：
 * - 页面加载动画
 * - 超级粒子系统（带鼠标轨迹）
 * - 3D组件轮播展示
 * - 视差滚动效果
 * - 流体背景动画
 * - 增强导航栏
 * - 代码编辑器组件
 * - 统计数字动画
 */

// 🎯 页面加载动画优化：增加淡出层与 content transition，避免闪烁
const PageLoader = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // 使用预设时间让 XorigoLogoLoader 完成动画
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 2500) // 与 XorigoLogoLoader 的默认 duration 2000ms + 缓冲时间匹配

    // 延迟显示内容，避免闪烁
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 2600)

    return () => {
      clearTimeout(timer)
      clearTimeout(contentTimer)
    }
  }, [])

  if (isLoaded) return null

  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black flex items-center justify-center"
      style={{
        ...createWillChange(['opacity', 'transform']),
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex flex-col items-center justify-center">
        <XorigoLogoLoader
          variant="enhanced"
          size="xl"
          duration={2000}
          showProgress={true}
          className="scale-125" // 增大一些以突出品牌效果
        />

        {/* 增加品牌文字 - 使用 variants 优化 */}
        <motion.div
          className="mt-8 text-center"
          style={createWillChange(['opacity', 'transform'])}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
            Xorigo UI
          </h2>
          <motion.p
            className="text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: showContent ? 1 : 0 }}
            transition={{ delay: 1.2, duration: 0.6 }}
          >
            下一代 React 组件库
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  )
}



// 🎨 优化版组件分类网格展示
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

  // 10个精选分类 - 全新优雅配色方案
  const categories = [
    {
      id: 'ui-basic',
      name: 'UI 基础组件',
      description: 'Button, Card, Typography',
      components: ['Button', 'Card', 'Typography', 'Icon', 'Skeleton', 'AvatarGroup', 'AnimatedCard', 'Tooltip'],
      icon: <Box className="w-6 h-6" />,
      // 🎨 优雅的靛蓝渐变
      primary: '#6366f1',
      secondary: '#8b5cf6',
      accent: '#a78bfa',
      glow: 'rgba(139, 92, 246, 0.4)',
      gradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
      hoverGradient: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #c4b5fd 100%)',
      selectedGradient: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)',
    },
    {
      id: 'inputs',
      name: 'Inputs 输入控件',
      description: 'Input, Checkbox, Select',
      components: ['Input', 'Checkbox', 'Select', 'Radio', 'Switch', 'Slider', 'DatePicker', 'FileInput'],
      icon: <Zap className="w-6 h-6" />,
      // 🌟 温暖的珊瑚渐变
      primary: '#f43f5e',
      secondary: '#fb7185',
      accent: '#fda4af',
      glow: 'rgba(251, 113, 133, 0.4)',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 50%, #fda4af 100%)',
      hoverGradient: 'linear-gradient(135deg, #f472b6 0%, #fda4af 50%, #fecdd3 100%)',
      selectedGradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fb7185 100%)',
    },
    {
      id: 'navigation',
      name: 'Navigation 导航结构',
      description: 'Navbar, Breadcrumb, Menu',
      components: ['Navbar', 'Breadcrumb', 'Menu', 'Tabs', 'Pagination', 'Sidebar'],
      icon: <Navigation className="w-6 h-6" />,
      // 🌊 清新的天蓝渐变
      primary: '#0ea5e9',
      secondary: '#38bdf8',
      accent: '#7dd3fc',
      glow: 'rgba(56, 189, 248, 0.4)',
      gradient: 'linear-gradient(135deg, #0ea5e9 0%, #38bdf8 50%, #7dd3fc 100%)',
      hoverGradient: 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 50%, #bae6fd 100%)',
      selectedGradient: 'linear-gradient(135deg, #0284c7 0%, #0ea5e9 50%, #38bdf8 100%)',
    },
    {
      id: 'feedback',
      name: 'Feedback 反馈状态',
      description: 'Alert, Loading, Spinner',
      components: ['Alert', 'Loading', 'Spinner', 'Toast', 'Progress', 'Badge'],
      icon: <Loader2 className="w-6 h-6" />,
      // 🌿 自然的翠绿渐变
      primary: '#10b981',
      secondary: '#34d399',
      accent: '#6ee7b7',
      glow: 'rgba(52, 211, 153, 0.4)',
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
      // 🔥 热情的橙红渐变
      primary: '#f97316',
      secondary: '#fb923c',
      accent: '#fdba74',
      glow: 'rgba(251, 146, 60, 0.4)',
      gradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)',
      hoverGradient: 'linear-gradient(135deg, #fb923c 0%, #fdba74 50%, #fed7aa 100%)',
      selectedGradient: 'linear-gradient(135deg, #ea580c 0%, #f97316 50%, #fb923c 100%)',
    },
    {
      id: 'data-display',
      name: 'DataDisplay 数据展示',
      description: 'Table, Code, Charts',
      components: ['Table', 'Code', 'Chart', 'List', 'Calendar', 'Timeline'],
      icon: <BarChart className="w-6 h-6" />,
      // 💎 深邃的宝蓝渐变
      primary: '#3b82f6',
      secondary: '#60a5fa',
      accent: '#93bbfc',
      glow: 'rgba(96, 165, 250, 0.4)',
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 50%, #93bbfc 100%)',
      hoverGradient: 'linear-gradient(135deg, #60a5fa 0%, #93bbfc 50%, #bfdbfe 100%)',
      selectedGradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
    },
    {
      id: 'layout',
      name: 'Layout 布局分区',
      description: 'Container, Flex, Grid',
      components: ['Container', 'Flex', 'Grid', 'Stack', 'Columns', 'Spacer'],
      icon: <Layout className="w-6 h-6" />,
      // 🎭 优雅的粉紫渐变
      primary: '#ec4899',
      secondary: '#f472b6',
      accent: '#f9a8d4',
      glow: 'rgba(244, 114, 182, 0.4)',
      gradient: 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #f9a8d4 100%)',
      hoverGradient: 'linear-gradient(135deg, #f472b6 0%, #f9a8d4 50%, #fbcfe8 100%)',
      selectedGradient: 'linear-gradient(135deg, #db2777 0%, #ec4899 50%, #f472b6 100%)',
    },
    {
      id: 'charts',
      name: 'Charts 图表组件',
      description: 'Chart, BarChart, LineChart',
      components: ['Chart', 'BarChart', 'LineChart', 'PieChart', 'AreaChart'],
      icon: <BarChart className="w-6 h-6" />,
      // 🌸 温柔的粉橙渐变
      primary: '#fb923c',
      secondary: '#fdba74',
      accent: '#fed7aa',
      glow: 'rgba(251, 146, 60, 0.4)',
      gradient: 'linear-gradient(135deg, #fb923c 0%, #fdba74 50%, #fed7aa 100%)',
      hoverGradient: 'linear-gradient(135deg, #fdba74 0%, #fed7aa 50%, #ffedd5 100%)',
      selectedGradient: 'linear-gradient(135deg, #f97316 0%, #fb923c 50%, #fdba74 100%)',
    },
    {
      id: 'forms',
      name: 'Forms 表单容器',
      description: 'Form, FormField, Fieldset',
      components: ['Form', 'FormField', 'Fieldset', 'FormValidation', 'FormSubmit'],
      icon: <FileText className="w-6 h-6" />,
      // 🌺 优雅的玫瑰渐变
      primary: '#f43f5e',
      secondary: '#fb7185',
      accent: '#fda4af',
      glow: 'rgba(251, 113, 133, 0.4)',
      gradient: 'linear-gradient(135deg, #f43f5e 0%, #fb7185 50%, #fda4af 100%)',
      hoverGradient: 'linear-gradient(135deg, #fb7185 0%, #fda4af 50%, #fecdd3 100%)',
      selectedGradient: 'linear-gradient(135deg, #e11d48 0%, #f43f5e 50%, #fb7185 100%)',
    },
    {
      id: 'utilities',
      name: 'Utilities 工具类',
      description: 'CopyButton, ScrollArea, Portal',
      components: ['CopyButton', 'ScrollArea', 'Portal', 'PortalProvider', 'useClickOutside'],
      icon: <Zap className="w-6 h-6" />,
      // ⚡ 活力的琥珀渐变
      primary: '#f59e0b',
      secondary: '#fbbf24',
      accent: '#fcd34d',
      glow: 'rgba(251, 191, 36, 0.4)',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)',
      hoverGradient: 'linear-gradient(135deg, #fbbf24 0%, #fcd34d 50%, #fde68a 100%)',
      selectedGradient: 'linear-gradient(135deg, #d97706 0%, #f59e0b 50%, #fbbf24 100%)',
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
                          className: "w-10 h-10 text-white/95 drop-shadow-2xl",
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
                            : 'text-white'
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
                          ? 'text-white/90'
                          : isHovered
                            ? 'text-white/80'
                            : 'text-gray-400/70'
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
                                    ? 'text-white/95'
                                    : 'text-gray-400/90'
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
                                  ? 'text-white/90'
                                  : isHovered
                                    ? 'text-white/80'
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
                              ? 'text-white/95'
                              : 'text-gray-400/80'
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
                          className: "w-10 h-10 text-white/95 drop-shadow-lg",
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
                            : 'text-white'
                        }`}
                        style={{
                          backgroundImage: selectedCategory
                            ? `linear-gradient(135deg, ${categories.find(c => c.id === selectedCategory)?.accent}, ${categories.find(c => c.id === selectedCategory)?.primary})`
                            : undefined,
                        }}
                      >
                        {categories.find(c => c.id === selectedCategory)?.name}
                      </h3>
                      <p className="text-gray-300 text-sm mb-3 leading-relaxed">
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
                              : '#10b981',
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
                                : '#34d399',
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
                                : '#34d399',
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
                              : '#a78bfa',
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



// 简单可靠的统计数字动画 - 最简单版本，永不消失
const CounterAnimation = ({ value, suffix = '' }: { value: number; suffix?: string }) => {
  const [count, setCount] = useState(value) // 直接初始化为最终值
  const [shouldAnimate, setShouldAnimate] = useState(false)

  // 组件挂载后等待一下开始动画
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldAnimate(true)
    }, 1500) // 1.5秒后开始动画

    return () => clearTimeout(timer)
  }, [])

  // 简单的动画逻辑
  useEffect(() => {
    if (!shouldAnimate) return

    let start = 0
    let current = 0
    const end = value
    const duration = 2000 // 2秒动画
    const increment = end / (duration / 16) // 60fps

    const interval = setInterval(() => {
      current += increment
      if (current >= end) {
        setCount(end)
        clearInterval(interval)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(interval)
  }, [shouldAnimate, value])

  return (
    <span className="inline-block">
      {count.toLocaleString()}{suffix}
    </span>
  )
}

// 导航栏已移至全局布局，无需在此重复定义

// 主组件
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const { scrollY, scrollYProgress } = useScroll()
  const scaleProgress = useTransform(scrollYProgress, [0, 1], [1, 0.8])
  const opacityProgress = useTransform(scrollYProgress, [0, 0.5], [1, 0.6])

  // 优化滚动衔接动画
  const heroOpacity = useTransform(scrollY, [0, 300, 600], [1, 0.8, 0])
  const heroScale = useTransform(scrollY, [0, 400], [1, 0.95])
  const heroY = useTransform(scrollY, [0, 500], [0, -100])
  const codeEditorOpacity = useTransform(scrollY, [0, 200, 400], [1, 0.8, 0])
  const codeEditorY = useTransform(scrollY, [0, 300], [0, -50])

  // 第二屏进入动画
  const carouselOpacity = useTransform(scrollY, [300, 600, 800], [0, 0.8, 1])
  const carouselY = useTransform(scrollY, [300, 600], [100, 0])
  const sectionTitleOpacity = useTransform(scrollY, [200, 500, 700], [0, 0.8, 1])
  const sectionTitleY = useTransform(scrollY, [200, 500], [50, 0])

  const stats = [
    { label: '组件', value: 50, suffix: '+', icon: <Box /> },
    { label: '主题', value: 20, suffix: '+', icon: <Palette /> },
    { label: 'TypeScript', value: 100, suffix: '%', icon: <Code2 /> },
    { label: '性能提升', value: 50, suffix: '%', icon: <Zap /> }
  ]

  const [soundEnabled, setSoundEnabled] = useState(false)

  // ✨ 点击涟漪效果组件
  const ClickRipple = () => {
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])
    const rippleIdRef = useRef(0)

    useEffect(() => {
      const handleClick = (e: MouseEvent) => {
        const newRipple = {
          id: rippleIdRef.current++,
          x: e.clientX,
          y: e.clientY
        }
        setRipples(prev => [...prev, newRipple])

        // 800ms后自动移除涟漪
        setTimeout(() => {
          setRipples(prev => prev.filter(r => r.id !== newRipple.id))
        }, 800)
      }

      window.addEventListener('mousedown', handleClick)
      return () => window.removeEventListener('mousedown', handleClick)
    }, [])

    return (
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        <AnimatePresence>
          {ripples.map(ripple => (
            <motion.div
              key={ripple.id}
              className="absolute"
              style={{
                left: ripple.x,
                top: ripple.y,
                transform: 'translate(-50%, -50%)',
              }}
              initial={{ scale: 0, opacity: 0.8 }}
              animate={{
                scale: [0, 3, 5],
                opacity: [0.8, 0.3, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 0.8,
                ease: "easeOut"
              }}
            >
              <div className="w-8 h-8 rounded-full border-2 border-purple-400" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <AnimatePresence>
      <PageLoader key="page-loader" />

      <motion.div
        key="main-content"
        className="min-h-screen bg-black text-white relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* 背景效果层 */}
        <FluidBackground />
        <SuperParticleSystem />
        <ClickRipple />

        {/* Hero Section增强版 - 优化滚动衔接，向上提内容 */}
        <section className="relative min-h-screen flex items-start justify-center px-6 pt-24">
          <motion.div
            className="max-w-7xl mx-auto w-full"
            style={{
              scale: heroScale,
              opacity: heroOpacity,
              y: heroY
            }}
          >
            <div className="text-center">
              {/* 声音控制 */}
              <motion.button
                className="fixed bottom-4 right-4 z-50 bg-purple-500/20 backdrop-blur-sm border border-purple-500/50 text-purple-400 p-3 rounded-full"
                onClick={() => setSoundEnabled(!soundEnabled)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                style={{ opacity: heroOpacity }}
              >
                {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
              </motion.button>

              {/* 标题超级动画 - 流动渐变光影 */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                {/* 增加容器高度，防止下降字符被剪裁 */}
                <div className="relative px-6 py-6 overflow-visible">
                  <motion.h1
                    className="text-7xl md:text-8xl lg:text-9xl font-bold mb-12 leading-relaxed"
                    style={{
                      perspective: '1000px',
                      lineHeight: '1.3'
                    }}
                  >
                    <motion.span
                      className="inline-block relative pb-4"
                      animate={{
                        rotateX: [0, 3, 0, -3, 0],
                      }}
                      transition={{
                        rotateX: {
                          duration: 10,
                          ease: 'easeInOut',
                          repeat: Infinity,
                        }
                      }}
                    >
                      {/* 基础渐变文字层 - 无缝循环流动 */}
                      <motion.div
                        className="relative"
                        style={{
                          background: 'linear-gradient(110deg, #a855f7 0%, #ec4899 12.5%, #06b6d4 25%, #10b981 37.5%, #f59e0b 50%, #ec4899 62.5%, #a855f7 75%, #06b6d4 87.5%, #a855f7 100%)',
                          backgroundSize: '400% 100%',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                        }}
                        animate={{
                          backgroundPosition: ['0% 50%', '100% 50%', '200% 50%', '300% 50%', '400% 50%'],
                        }}
                        transition={{
                          duration: 25,
                          ease: 'linear',
                          repeat: Infinity,
                        }}
                      >
                        Xorigo UI
                      </motion.div>

                      {/* 光影流动效果层 1 - 主光束（减慢速度） */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.5) 50%, transparent 100%)',
                          backgroundSize: '200% 100%',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                          mixBlendMode: 'overlay',
                        }}
                        animate={{
                          backgroundPosition: ['-200% 0%', '200% 0%']
                        }}
                        transition={{
                          duration: 4, // 减慢：2.5s → 4s
                          ease: 'easeInOut',
                          repeat: Infinity,
                          repeatDelay: 1.5 // 增加间隔：0.8s → 1.5s
                        }}
                      >
                        Xorigo UI
                      </motion.div>

                      {/* 光影流动效果层 2 - 副光束（反向，更慢） */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.4) 50%, transparent 100%)',
                          backgroundSize: '150% 100%',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                          mixBlendMode: 'screen',
                        }}
                        animate={{
                          backgroundPosition: ['200% 0%', '-200% 0%']
                        }}
                        transition={{
                          duration: 6, // 减慢：4s → 6s
                          ease: 'easeInOut',
                          repeat: Infinity,
                          repeatDelay: 1 // 增加间隔：0.3s → 1s
                        }}
                      >
                        Xorigo UI
                      </motion.div>

                      {/* 脉冲光晕效果（更慢呼吸） */}
                      <motion.div
                        className="absolute inset-0 pointer-events-none"
                        style={{
                          background: 'radial-gradient(circle, rgba(6, 182, 212, 0.3) 0%, transparent 70%)',
                          WebkitBackgroundClip: 'text',
                          backgroundClip: 'text',
                          color: 'transparent',
                          mixBlendMode: 'color-dodge',
                        }}
                        animate={{
                          opacity: [0.3, 0.7, 0.3], // 降低峰值：0.8 → 0.7
                        }}
                        transition={createRandomizedAnimation(5, 1.0, 4)}
                      >
                        Xorigo UI
                      </motion.div>
                    </motion.span>
                  </motion.h1>
                </div>

                <motion.p
                  className="text-3xl text-gray-300 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4, duration: 0.6 }} // 更快出现
                >
                  下一代 React 组件库
                </motion.p>

                <motion.p
                  className="text-xl text-gray-500 mb-12 max-w-3xl mx-auto"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.6 }} // 更快出现
                >
                  由 Saken 与 AI 协作打造，为现代 Web 应用提供极致的开发体验
                </motion.p>

                {/* CTA按钮组 */}
                <motion.div
                  className="flex flex-col sm:flex-row gap-6 justify-center mb-20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }} // 更快出现
                >
                  <motion.button
                    className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-12 py-5 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-purple-500/30 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="relative z-10 flex items-center justify-center">
                      <Rocket className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                      开始使用
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500"
                      initial={{ x: '100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>

                  <motion.button
                    className="group border-2 border-purple-500/50 hover:border-purple-400 text-white px-12 py-5 rounded-2xl text-lg font-bold backdrop-blur-sm hover:bg-purple-500/10 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.open('https://github.com/SakenW/Xorigo-UI', '_blank')}
                  >
                    <Github className="w-5 h-5 mr-2 inline-block group-hover:rotate-12 transition-transform" />
                    GitHub
                  </motion.button>
                </motion.div>
              </motion.div>

              {/* 代码编辑器展示 - 左右布局 */}
              <motion.div
                className="max-w-7xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.6 }}
                style={{
                  opacity: codeEditorOpacity,
                  y: codeEditorY
                }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 左侧：代码编辑器 */}
                  <CodeEditor />

                  {/* 右侧：实时预览 */}
                  <motion.div
                    className="relative bg-gradient-to-br from-gray-900/95 via-gray-900/90 to-gray-800/95 rounded-2xl overflow-hidden border border-cyan-500/30 shadow-2xl shadow-cyan-500/10 p-8"
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.3, duration: 0.6 }}
                  >
                    {/* 顶部光晕 */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                    {/* 预览标题 */}
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                      <span className="text-gray-300 text-sm font-medium">实时预览</span>
                    </div>

                    {/* 预览内容 */}
                    <motion.div
                      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                      whileHover={{ scale: 1.02 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <h1 className="text-2xl font-bold text-white mb-4">欢迎使用 Xorigo UI</h1>
                      <motion.button
                        className="relative overflow-hidden bg-gradient-to-r from-purple-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium shadow-lg"
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)' }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <span className="relative z-10">开始构建</span>
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-500"
                          initial={{ x: '100%' }}
                          whileHover={{ x: 0 }}
                          transition={{ duration: 0.3 }}
                        />
                      </motion.button>
                    </motion.div>

                    {/* 装饰光效 */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* 统计数据 - 移动到组件预览上方，优化渐入效果 */}
        <section className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 1.2,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* 统计卡片 1 - 组件数量 */}
                <motion.div
                  className="text-center group relative"
                  style={createWillChange(['transform', 'opacity'])}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{
                    scale: 1.08,
                    y: -8,
                    transition: { duration: 0.4 }
                  }}
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
                    whileHover={{
                      boxShadow: '0 12px 40px rgba(168, 85, 247, 0.5)',
                    }}
                  >
                    {/* 卡片内部光晕效果 */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={createRandomizedAnimation(3, 0.6, 5)}
                    />
                    <Box className="w-10 h-10 text-white relative z-10" />
                  </motion.div>
                  <motion.div
                    className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.4
                    }}
                  >
                    <CounterAnimation value={50} suffix="+" />
                  </motion.div>
                  <motion.div
                    className="text-gray-400 group-hover:text-gray-300 transition-colors"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.6
                    }}
                  >
                    组件
                  </motion.div>

                  {/* 悬停显示的详细信息 */}
                  <motion.div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-gray-900/95 backdrop-blur-xl border border-purple-500/30 rounded-xl p-4 shadow-2xl min-w-[200px]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <Box className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="text-white font-semibold">组件库</h4>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          <span>UI 基础组件</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          <span>表单控件</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          <span>导航组件</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-purple-400 rounded-full"></div>
                          <span>反馈组件</span>
                        </li>
                      </ul>
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-xs text-gray-400">持续更新中...</p>
                      </div>
                    </div>
                    {/* 小箭头 */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900/95"></div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* 统计卡片 2 - 主题 */}
                <motion.div
                  className="text-center group relative"
                  style={createWillChange(['transform', 'opacity'])}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.2,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{
                    scale: 1.08,
                    y: -8,
                    transition: { duration: 0.4 }
                  }}
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
                    whileHover={{
                      boxShadow: '0 12px 40px rgba(6, 182, 212, 0.5)',
                    }}
                  >
                    {/* 卡片内部光晕效果 */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={createRandomizedAnimation(3, 0.6, 5)}
                    />
                    <Palette className="w-10 h-10 text-white relative z-10" />
                  </motion.div>
                  <motion.div
                    className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.5
                    }}
                  >
                    <CounterAnimation value={20} suffix="+" />
                  </motion.div>
                  <motion.div
                    className="text-gray-400 group-hover:text-gray-300 transition-colors"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.7
                    }}
                  >
                    主题
                  </motion.div>

                  {/* 悬停显示的详细信息 */}
                  <motion.div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-gray-900/95 backdrop-blur-xl border border-cyan-500/30 rounded-xl p-4 shadow-2xl min-w-[200px]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
                          <Palette className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="text-white font-semibold">主题系统</h4>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                          <span>暗色主题</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                          <span>亮色主题</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                          <span>自定义配色</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full"></div>
                          <span>渐变效果</span>
                        </li>
                      </ul>
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-xs text-gray-400">支持动态切换</p>
                      </div>
                    </div>
                    {/* 小箭头 */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900/95"></div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* 统计卡片 3 - TypeScript */}
                <motion.div
                  className="text-center group relative"
                  style={createWillChange(['transform', 'opacity'])}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{
                    scale: 1.08,
                    y: -8,
                    transition: { duration: 0.4 }
                  }}
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
                    whileHover={{
                      boxShadow: '0 12px 40px rgba(16, 185, 129, 0.5)',
                    }}
                  >
                    {/* 卡片内部光晕效果 */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={createRandomizedAnimation(3, 0.6, 5)}
                    />
                    <Code2 className="w-10 h-10 text-white relative z-10" />
                  </motion.div>
                  <motion.div
                    className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.6
                    }}
                  >
                    <CounterAnimation value={100} suffix="%" />
                  </motion.div>
                  <motion.div
                    className="text-gray-400 group-hover:text-gray-300 transition-colors"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.8
                    }}
                  >
                    TypeScript
                  </motion.div>

                  {/* 悬停显示的详细信息 */}
                  <motion.div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-gray-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-xl p-4 shadow-2xl min-w-[200px]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <Code2 className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="text-white font-semibold">TypeScript</h4>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                          <span>完整类型定义</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                          <span>智能提示</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                          <span>泛型支持</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></div>
                          <span>类型安全</span>
                        </li>
                      </ul>
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-xs text-gray-400">企业级类型保障</p>
                      </div>
                    </div>
                    {/* 小箭头 */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900/95"></div>
                    </div>
                  </motion.div>
                </motion.div>

                {/* 统计卡片 4 - 性能提升 */}
                <motion.div
                  className="text-center group relative"
                  style={createWillChange(['transform', 'opacity'])}
                  initial={{ opacity: 0, y: 40, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{
                    duration: 0.8,
                    delay: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  }}
                  whileHover={{
                    scale: 1.08,
                    y: -8,
                    transition: { duration: 0.4 }
                  }}
                >
                  <motion.div
                    className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg relative overflow-hidden"
                    whileHover={{
                      boxShadow: '0 12px 40px rgba(249, 115, 22, 0.5)',
                    }}
                  >
                    {/* 卡片内部光晕效果 */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10"
                      animate={{
                        opacity: [0.3, 0.6, 0.3],
                      }}
                      transition={createRandomizedAnimation(3, 0.6, 5)}
                    />
                    <Zap className="w-10 h-10 text-white relative z-10" />
                  </motion.div>
                  <motion.div
                    className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.7
                    }}
                  >
                    <CounterAnimation value={50} suffix="%" />
                  </motion.div>
                  <motion.div
                    className="text-gray-400 group-hover:text-gray-300 transition-colors"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.8 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.9
                    }}
                  >
                    性能提升
                  </motion.div>

                  {/* 悬停显示的详细信息 */}
                  <motion.div
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300 z-50"
                    initial={{ opacity: 0, y: 10 }}
                    whileHover={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-gray-900/95 backdrop-blur-xl border border-orange-500/30 rounded-xl p-4 shadow-2xl min-w-[200px]">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                          <Zap className="w-4 h-4 text-white" />
                        </div>
                        <h4 className="text-white font-semibold">性能优化</h4>
                      </div>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                          <span>按需加载</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                          <span>代码分割</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                          <span>缓存优化</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                          <span>渲染优化</span>
                        </li>
                      </ul>
                      <div className="mt-3 pt-3 border-t border-gray-700">
                        <p className="text-xs text-gray-400">极致用户体验</p>
                      </div>
                    </div>
                    {/* 小箭头 */}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900/95"></div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* 3D组件展示 - 优化滚动衔接，避免导航条重叠 */}
        <section className="py-8 px-6 pt-6">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-12"
              style={{
                opacity: sectionTitleOpacity,
                y: sectionTitleY
              }}
              animate={{
                opacity: selectedCategory ? 0.3 : 1,
                scale: selectedCategory ? 0.95 : 1,
                filter: selectedCategory ? 'blur(0.5px)' : 'blur(0px)'
              }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
            >
              <h2 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  组件预览
                </span>
              </h2>
              <p className="text-xl text-gray-400">
                探索我们精心打造的每一个组件
              </p>
            </motion.div>

            <motion.div
              style={{
                opacity: carouselOpacity,
                y: carouselY
              }}
            >
              <ComponentCategoryGrid
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
              />
            </motion.div>
          </div>
        </section>

        {/* 页脚由全局布局提供，无需在这里重复添加 */}
      </motion.div>
    </AnimatePresence>
  )
}