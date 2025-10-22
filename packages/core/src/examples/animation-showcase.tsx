/**
 * 动画系统演示页面
 *
 * 展示 Xorigo UI 动画系统的所有核心功能
 */

import React, { useState } from 'react'
import {
  AnimatedCard,
  AnimatedButton,
  AnimatedAlert,
  AnimatedBadge,
  AnimatedList,
  AnimatedPresence,
  fadeVariants,
  slideVariants,
  scaleVariants,
  hoverVariants,
  pulseVariants,
  staggerVariants
} from '../motion'
import { createThemeAnimation } from '../motion/theme-integration'

// 动画演示组件
export function AnimationShowcase() {
  const [isVisible, setIsVisible] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [currentAlert, setCurrentAlert] = useState<'success' | 'warning' | 'error' | null>(null)

  // 模拟加载状态
  const handleLoading = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }

  // 显示通知
  const showAlert = (type: 'success' | 'warning' | 'error') => {
    setCurrentAlert(type)
    setTimeout(() => setCurrentAlert(null), 3000)
  }

  // 列表数据
  const listItems = [
    '淡入动画效果',
    '滑入动画效果',
    '缩放动画效果',
    '弹性动画效果'
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-12">

        {/* 标题区域 */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Xorigo UI 动画系统演示
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            基于 Framer Motion 12 的主题感知动画系统，提供可访问性优先、性能优化的动画体验
          </p>
        </div>

        {/* 基础动画演示 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">基础动画效果</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 淡入动画 */}
            <AnimatedCard animation="fade" variants={fadeVariants}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">淡入动画</h3>
              <p className="text-gray-600">使用 fadeVariants 实现的平滑淡入效果</p>
            </AnimatedCard>

            {/* 滑入动画 */}
            <AnimatedCard animation="slide" variants={slideVariants}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">滑入动画</h3>
              <p className="text-gray-600">使用 slideVariants 实现的滑入效果</p>
            </AnimatedCard>

            {/* 缩放动画 */}
            <AnimatedCard animation="scale" variants={scaleVariants}>
              <h3 className="text-lg font-medium text-gray-900 mb-2">缩放动画</h3>
              <p className="text-gray-600">使用 scaleVariants 实现的缩放效果</p>
            </AnimatedCard>
          </div>
        </section>

        {/* 交互式动画演示 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">交互式动画</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 悬停和点击动画 */}
            <AnimatedCard variant="interactive" className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">悬停和点击效果</h3>
              <div className="space-y-4">
                <AnimatedButton
                  variant="primary"
                  animation="tap"
                  whileHover="hover"
                  whileTap="tap"
                >
                  悬停点击我
                </AnimatedButton>

                <AnimatedBadge
                  animation="scale"
                  whileHover="hover"
                  className="cursor-pointer"
                >
                  悬停徽章
                </AnimatedBadge>
              </div>
            </AnimatedCard>

            {/* 加载状态动画 */}
            <AnimatedCard variant="interactive" className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">加载状态动画</h3>
              <div className="space-y-4">
                <AnimatedButton
                  variant="secondary"
                  loading={isLoading}
                  onClick={handleLoading}
                  disabled={isLoading}
                >
                  {isLoading ? '加载中...' : '开始加载'}
                </AnimatedButton>

                {isLoading && (
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600">处理中...</span>
                  </div>
                )}
              </div>
            </AnimatedCard>
          </div>
        </section>

        {/* 列表动画演示 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">列表动画效果</h2>

          <AnimatedCard className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">错位动画列表</h3>
            <AnimatedList
              staggerDelay={0.1}
              direction="up"
              animation="stagger"
              className="space-y-3"
            >
              {listItems.map((item, index) => (
                <div
                  key={index}
                  className="p-3 bg-white rounded-lg border border-gray-200 text-gray-700"
                >
                  {item}
                </div>
              ))}
            </AnimatedList>
          </AnimatedCard>
        </section>

        {/* 通知动画演示 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">通知动画</h2>

          <div className="space-y-4">
            <div className="flex space-x-4">
              <AnimatedButton variant="outline" onClick={() => showAlert('success')}>
                显示成功通知
              </AnimatedButton>
              <AnimatedButton variant="outline" onClick={() => showAlert('warning')}>
                显示警告通知
              </AnimatedButton>
              <AnimatedButton variant="outline" onClick={() => showAlert('error')}>
                显示错误通知
              </AnimatedButton>
            </div>

            <AnimatedPresence>
              {currentAlert && (
                <AnimatedAlert
                  variant={currentAlert}
                  animation="slide"
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  {currentAlert === 'success' && '✅ 操作成功完成！'}
                  {currentAlert === 'warning' && '⚠️ 请注意这个警告信息。'}
                  {currentAlert === 'error' && '❌ 发生了一个错误，请重试。'}
                </AnimatedAlert>
              )}
            </AnimatedPresence>
          </div>
        </section>

        {/* 条件渲染动画演示 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">条件渲染动画</h2>

          <AnimatedCard variant="interactive" className="p-6">
            <div className="space-y-4">
              <AnimatedButton
                variant="primary"
                onClick={() => setIsVisible(!isVisible)}
              >
                {isVisible ? '隐藏内容' : '显示内容'}
              </AnimatedButton>

              <AnimatedPresence>
                {isVisible && (
                  <AnimatedCard
                    animation="scale"
                    variants={scaleVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white"
                  >
                    <h3 className="text-lg font-medium mb-2">条件渲染内容</h3>
                    <p>这个内容会根据按钮点击状态进行动画显示和隐藏。</p>
                  </AnimatedCard>
                )}
              </AnimatedPresence>
            </div>
          </AnimatedCard>
        </section>

        {/* 主题感知动画演示 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">主题感知动画</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 微妙动画 */}
            <AnimatedCard
              animation="fade"
              motionIntensity="subtle"
              motionComplexity="simple"
              className="p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">微妙动画</h3>
              <p className="text-gray-600">适合阅读场景的轻柔动画效果</p>
            </AnimatedCard>

            {/* 标准动画 */}
            <AnimatedCard
              animation="scale"
              motionIntensity="standard"
              motionComplexity="moderate"
              className="p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">标准动画</h3>
              <p className="text-gray-600">平衡的动画体验，适合一般交互</p>
            </AnimatedCard>

            {/* 表现力动画 */}
            <AnimatedCard
              animation="scale"
              motionIntensity="expressive"
              motionComplexity="complex"
              className="p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">表现力动画</h3>
              <p className="text-gray-600">丰富的动画效果，适合装饰元素</p>
            </AnimatedCard>
          </div>
        </section>

        {/* 高级动画演示 */}
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">高级动画效果</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 脉冲动画 */}
            <AnimatedCard
              animation="pulse"
              variants={pulseVariants}
              animate="animate"
              className="p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">脉冲动画</h3>
              <p className="text-gray-600">持续的呼吸效果，适合强调重要元素</p>
            </AnimatedCard>

            {/* 弹性动画 */}
            <AnimatedCard
              animation="bounce"
              variants={{
                hidden: { scale: 0.8, opacity: 0 },
                visible: {
                  scale: 1,
                  opacity: 1,
                  transition: {
                    type: 'spring',
                    damping: 15,
                    stiffness: 300
                  }
                }
              }}
              className="p-6"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">弹性动画</h3>
              <p className="text-gray-600">活泼的弹性效果，增加界面趣味性</p>
            </AnimatedCard>
          </div>
        </section>

        {/* 底部信息 */}
        <footer className="text-center py-8 border-t border-gray-200">
          <p className="text-gray-600">
            Xorigo UI 动画系统 - 基于 Framer Motion 12 构建
          </p>
          <p className="text-sm text-gray-500 mt-2">
            支持主题感知 • 可访问性优先 • 性能优化
          </p>
        </footer>
      </div>
    </div>
  )
}

export default AnimationShowcase