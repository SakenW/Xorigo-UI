'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CounterAnimation } from './CounterAnimation'

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
  /** 主题颜色变体 */
  variant?: 'default' | 'blue' | 'green' | 'purple' | 'orange'
}

export function StatsCard({
  label,
  value,
  suffix = '',
  icon,
  delay = 0,
  className = '',
  variant = 'default'
}: StatsCardProps) {
  // 主题配置
  const variants = {
    default: {
      bg: 'from-slate-800/90 via-slate-900/90 to-slate-950/95',
      border: 'border-white/10 hover:border-white/20',
      icon: 'text-cyan-400 group-hover:text-cyan-300',
      glow: 'from-blue-500/10 via-purple-500/10 to-pink-500/10'
    },
    blue: {
      bg: 'from-blue-900/90 via-blue-950/90 to-indigo-950/95',
      border: 'border-blue-400/20 hover:border-blue-300/40',
      icon: 'text-blue-400 group-hover:text-blue-300',
      glow: 'from-blue-500/10 via-cyan-500/10 to-indigo-500/10'
    },
    green: {
      bg: 'from-green-900/90 via-emerald-950/90 to-teal-950/95',
      border: 'border-green-400/20 hover:border-green-300/40',
      icon: 'text-green-400 group-hover:text-green-300',
      glow: 'from-green-500/10 via-emerald-500/10 to-teal-500/10'
    },
    purple: {
      bg: 'from-purple-900/90 via-violet-950/90 to-fuchsia-950/95',
      border: 'border-purple-400/20 hover:border-purple-300/40',
      icon: 'text-purple-400 group-hover:text-purple-300',
      glow: 'from-purple-500/10 via-violet-500/10 to-fuchsia-500/10'
    },
    orange: {
      bg: 'from-orange-900/90 via-amber-950/90 to-yellow-950/95',
      border: 'border-orange-400/20 hover:border-orange-300/40',
      icon: 'text-orange-400 group-hover:text-orange-300',
      glow: 'from-orange-500/10 via-amber-500/10 to-yellow-500/10'
    }
  }

  const theme = variants[variant]

  return (
    <motion.div
      className={`group relative bg-gradient-to-br ${theme.bg} backdrop-blur-lg rounded-3xl p-8 border ${theme.border} transition-all duration-300 hover:shadow-2xl hover:shadow-white/10 hover:-translate-y-2 ${className}`}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.02 }}
    >
      {/* 背景光效 */}
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.glow} rounded-3xl opacity-50`} />

      {/* 内边框装饰 */}
      <div className="absolute inset-[1px] bg-gradient-to-br from-white/5 to-transparent rounded-3xl" />

      {/* 光晕效果 */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${theme.glow} rounded-3xl opacity-0 group-hover:opacity-100 blur-md transition-all duration-500`} />

      {/* 顶部发光线 */}
      <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* 底部阴影线 */}
      <div className="absolute bottom-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-black/40 to-transparent" />

      {/* 图标容器 */}
      <div className="relative z-20 w-14 h-14 bg-gradient-to-br from-white/10 to-white/5 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-all duration-300 border border-white/10 backdrop-blur-sm">
        <div className={`${theme.icon} text-2xl transition-colors duration-300 drop-shadow-lg`}>
          {icon}
        </div>
      </div>

      {/* 数字 */}
      <div className="relative z-20 text-5xl font-bold text-white mb-3 group-hover:scale-105 transition-transform duration-300 drop-shadow-lg">
        <CounterAnimation value={value} suffix={suffix} />
      </div>

      {/* 标签 */}
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

export { StatsCard as default }