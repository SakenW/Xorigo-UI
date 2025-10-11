/**
 * 🎨 TH-UI 配方展示组件
 *
 * 简化版配方演示，展示关键特性
 */

import React from 'react'
import { motion } from 'framer-motion'

export function RecipeShowcase() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🎨 配方展示页面的全新设计
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">现代化设计</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              采用渐变背景、圆角卡片和流畅动画
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-2xl mb-3">🔍</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">高级筛选</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              支持分类、对比度、可访问性等多维度筛选
            </p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="text-2xl mb-3">📱</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">响应式布局</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              完美适配移动端和桌面端设备
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}