'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Box,
  Square,
  Pentagon,
  Braces,
  Database,
  FileCode,
  ArrowRight
} from 'lucide-react'

/**
 * Component3DCarousel - 3D组件轮播展示
 *
 * 一个精美的3D轮播组件，用于展示UI组件库中的各个组件
 *
 * 主要特性：
 * - 3D透视效果和流畅的动画过渡
 * - 自动轮播和手动导航控制
 * - 响应式设计和鼠标悬停交互
 * - 优雅的视觉效果和状态指示
 */
const Component3DCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  const components = [
    { name: 'Button', icon: <Box />, color: 'from-purple-500 to-pink-500', desc: '灵活的按钮组件' },
    { name: 'Card', icon: <Square />, color: 'from-cyan-500 to-blue-500', desc: '优雅的卡片容器' },
    { name: 'Input', icon: <Braces />, color: 'from-yellow-500 to-orange-500', desc: '强大的表单输入' },
    { name: 'Modal', icon: <Pentagon />, color: 'from-green-500 to-teal-500', desc: '流畅的弹窗组件' },
    { name: 'Table', icon: <Database />, color: 'from-indigo-500 to-purple-500', desc: '智能数据表格' },
    { name: 'Form', icon: <FileCode />, color: 'from-pink-500 to-rose-500', desc: '完整的表单方案' }
  ]

  // 自动轮播效果 - 简化版
  useEffect(() => {
    if (isHovering) return

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % components.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [isHovering, components.length])

  // 导航函数 - 简化版
  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + components.length) % components.length)
  }, [components.length])

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % components.length)
  }, [components.length])

  return (
    <div
      className="relative h-[450px] flex items-center justify-center"
      style={{ perspective: '1200px' }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* 3D轮播容器 */}
      <div className="relative w-full h-full max-w-6xl">
        {components.map((component, index) => {
          const offset = index - activeIndex
          const absOffset = Math.abs(offset)
          const isActive = offset === 0

          return (
            <motion.div
              key={component.name}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
              animate={{
                x: `${offset * 120}px`,
                z: isActive ? 0 : -absOffset * 150,
                rotateY: offset * -25,
                opacity: absOffset > 2 ? 0 : isActive ? 1 : 0.5,
                scale: isActive ? 1.1 : 0.8,
              }}
              transition={{
                type: 'spring',
                stiffness: 120,
                damping: 25,
                duration: 0.5
              }}
              style={{
                transformStyle: 'preserve-3d',
                zIndex: isActive ? 30 : 20 - absOffset * 2
              }}
            >
              <motion.div
                className={`relative w-72 h-96 rounded-3xl bg-gradient-to-br ${component.color} p-[3px] cursor-pointer ${
                  isActive ? 'shadow-2xl' : 'shadow-lg'
                }`}
                whileHover={{
                  scale: isActive ? 1.08 : 1.03,
                  rotateY: 5,
                }}
                onClick={() => setActiveIndex(index)}
                style={{
                  boxShadow: isActive
                    ? '0 25px 60px rgba(168, 85, 247, 0.4), 0 0 40px rgba(168, 85, 247, 0.2)'
                    : '0 10px 30px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* 卡片内容 */}
                <div className="relative w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-3xl p-6 flex flex-col items-center justify-center overflow-hidden"
                     style={{
                       background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)'
                     }}>
                  {/* 顶部装饰光线 */}
                  <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${
                    isActive ? 'via-white/40' : 'via-white/20'
                  } to-transparent`} />

                  {/* 图标 */}
                  <motion.div
                    className={`relative mb-4 ${isActive ? 'p-6' : 'p-4'} bg-white/5 rounded-xl backdrop-blur-sm`}
                    animate={{
                      rotateY: isActive ? [0, 360] : 0,
                      scale: isActive ? [1, 1.1, 1] : 1
                    }}
                    transition={{
                      rotateY: {
                        duration: 3,
                        ease: "linear",
                        repeat: isActive ? Infinity : 0
                      }
                    }}
                  >
                    {React.cloneElement(component.icon as React.ReactElement, {
                      className: `${isActive ? 'w-16 h-16' : 'w-12 h-12'} text-white drop-shadow-lg`
                    })}
                  </motion.div>

                  {/* 组件名称 */}
                  <motion.h3
                    className={`${isActive ? 'text-2xl' : 'text-lg'} font-bold text-white mb-2`}
                  >
                    {component.name}
                  </motion.h3>

                  {/* 描述文字 */}
                  <p className={`text-center ${isActive ? 'text-sm text-gray-300' : 'text-xs text-gray-500'}`}>
                    {component.desc}
                  </p>

                  {/* 底部标签 */}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-4 left-1/2 -translate-x-1/2"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        <span className="text-xs text-white font-medium">当前选中</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )
        })}
      </div>

      {/* 控制点 */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 backdrop-blur-sm px-4 py-3 rounded-full border border-white/10 z-10">
        {components.map((component, index) => {
          const isActive = index === activeIndex
          return (
            <motion.button
              key={index}
              className={`relative rounded-full transition-all ${
                isActive
                  ? 'w-8 h-2 bg-gradient-to-r from-purple-500 to-cyan-500'
                  : 'w-2 h-2 bg-gray-600 hover:bg-gray-500'
              }`}
              onClick={() => setActiveIndex(index)}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            >
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full bg-white"
                  style={{ opacity: 0.3 }}
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* 左右切换按钮 */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
        <motion.button
          className="w-10 h-10 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-purple-500/40 transition-all"
          onClick={handlePrev}
          whileHover={{ scale: 1.1, x: -5 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
        </motion.button>
      </div>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
        <motion.button
          className="w-10 h-10 bg-black/60 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white hover:bg-purple-500/40 transition-all"
          onClick={handleNext}
          whileHover={{ scale: 1.1, x: 5 }}
          whileTap={{ scale: 0.9 }}
        >
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  )
}

export { Component3DCarousel }