'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CounterAnimation } from './counter-animation'

/**
 * 统计数据卡片组件
 *
 * 用于展示关键指标，具有丰富的动画效果和交互体验
 */
interface StatsCardProps {
  /** 数据标签 */
  label: string
  /** 数值 */
  value: number
  /** 单位/后缀 */
  suffix?: string
  /** 图标 */
  icon: React.ReactNode
  /** 延迟动画时间（秒） */
  delay?: number
  /** 额外的CSS类名 */
  className?: string
}

export function StatsCard({
  label,
  value,
  suffix = '',
  icon,
  delay = 0,
  className = ''
}: StatsCardProps) {
  return (
    <motion.div
      className={`group relative bg-gradient-to-br from-slate-800/90 via-slate-900/90 to-slate-950/95 backdrop-blur-lg rounded-3xl p-8 border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-2 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02 }}
    >
      {/* 背景光效 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl opacity-50" />

      {/* 内边框装饰 */}
      <div className="absolute inset-[1px] bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />

      {/* 光晕效果 */}
      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-500" />

      {/* 顶部发光线 */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* 底部阴影线 */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-black/40 to-transparent" />

      {/* 图标容器 */}
      <div className="relative z-20 w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 border border-white/10 backdrop-blur-sm">
        <div className="text-cyan-400 text-2xl group-hover:text-cyan-300 transition-colors duration-300 drop-shadow-lg">
          {icon}
        </div>
      </div>

      {/* 数字 - 改为更明显的白色 */}
      <div className="relative z-20 text-5xl font-bold text-white mb-3 group-hover:scale-105 transition-transform duration-300 drop-shadow-lg">
        <CounterAnimation value={value} suffix={suffix} />
      </div>

      {/* 标签 - 更明显的对比度 */}
      <div className="relative z-20 text-lg font-semibold text-gray-300 group-hover:text-white transition-colors duration-300 drop-shadow-md">
        {label}
      </div>

      {/* 悬停时的粒子效果 */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 animate-ping" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-cyan-400/50 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '0.3s' }} />
        <div className="absolute top-1/2 right-1/3 w-1.5 h-1.5 bg-purple-400/40 rounded-full opacity-0 group-hover:opacity-100 animate-ping" style={{ animationDelay: '0.6s' }} />
      </div>
    </motion.div>
  )
}

export default StatsCard