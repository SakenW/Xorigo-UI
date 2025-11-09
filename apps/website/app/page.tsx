'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { useTheme } from '@xorigo-ui/system'

export default function HomePage() {
  const { themeConfig } = useTheme()

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center transition-all duration-500"
      style={{
        backgroundColor: themeConfig.mode === 'dark' ? '#000000' : '#ffffff',
        color: themeConfig.mode === 'dark' ? '#ffffff' : '#000000'
      }}
    >
      <motion.h1
        className="text-6xl md:text-8xl font-bold text-center mb-8 bg-clip-text text-transparent"
        style={{
          backgroundImage: themeConfig.gradient
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Xorigo UI
      </motion.h1>

      <motion.p
        className="text-2xl mb-12 text-center max-w-3xl px-4 transition-colors duration-500"
        style={{ color: themeConfig.mode === 'dark' ? '#d1d5db' : '#4b5563' }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        下一代 React 组件库 - 性能优化版
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6 }}
      >
        <a
          href="/docs"
          className="px-8 py-4 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          style={{
            background: themeConfig.gradient,
            boxShadow: `0 0 20px ${themeConfig.glow}`
          }}
        >
          查看文档
        </a>
        <a
          href="https://github.com/Xorigo/xorigo-ui"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          style={{
            background: themeConfig.mode === 'dark' ? '#374151' : '#6b7280',
            border: `2px solid ${themeConfig.colors[500]}`,
            boxShadow: `0 0 15px ${themeConfig.glow}`
          }}
        >
          GitHub
        </a>
        <a
          href="/recipes"
          className="px-8 py-4 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
          style={{
            background: themeConfig.mode === 'dark' ? '#374151' : '#6b7280',
            border: `2px solid ${themeConfig.colors[500]}`,
            boxShadow: `0 0 15px ${themeConfig.glow}`
          }}
        >
          主题配方
        </a>
      </motion.div>

      <motion.div
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <div
          className="p-6 rounded-lg transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: themeConfig.mode === 'dark' ? '#1f2937' : '#f9fafb',
            border: `2px solid ${themeConfig.colors[500]}30`,
            boxShadow: `0 0 15px ${themeConfig.glow}20`
          }}
        >
          <div
            className="text-3xl font-bold transition-colors duration-300"
            style={{ color: themeConfig.colors[400] }}
          >
            100+
          </div>
          <div
            className="text-sm mt-2 transition-colors duration-300"
            style={{ color: themeConfig.mode === 'dark' ? '#9ca3af' : '#6b7280' }}
          >
            组件
          </div>
        </div>
        <div
          className="p-6 rounded-lg transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: themeConfig.mode === 'dark' ? '#1f2937' : '#f9fafb',
            border: `2px solid ${themeConfig.colors[300]}30`,
            boxShadow: `0 0 15px ${themeConfig.glow}20`
          }}
        >
          <div
            className="text-3xl font-bold transition-colors duration-300"
            style={{ color: themeConfig.colors[300] }}
          >
            12+
          </div>
          <div
            className="text-sm mt-2 transition-colors duration-300"
            style={{ color: themeConfig.mode === 'dark' ? '#9ca3af' : '#6b7280' }}
          >
            主题配方
          </div>
        </div>
        <div
          className="p-6 rounded-lg transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: themeConfig.mode === 'dark' ? '#1f2937' : '#f9fafb',
            border: `2px solid ${themeConfig.colors[200]}30`,
            boxShadow: `0 0 15px ${themeConfig.glow}20`
          }}
        >
          <div
            className="text-3xl font-bold transition-colors duration-300"
            style={{ color: themeConfig.colors[200] }}
          >
            7
          </div>
          <div
            className="text-sm mt-2 transition-colors duration-300"
            style={{ color: themeConfig.mode === 'dark' ? '#9ca3af' : '#6b7280' }}
          >
            七轴系统
          </div>
        </div>
        <div
          className="p-6 rounded-lg transition-all duration-300 hover:scale-105"
          style={{
            backgroundColor: themeConfig.mode === 'dark' ? '#1f2937' : '#f9fafb',
            border: `2px solid #10b98130`,
            boxShadow: `0 0 15px rgba(16, 185, 129, 0.2)`
          }}
        >
          <div className="text-3xl font-bold text-green-400 transition-colors duration-300">
            100%
          </div>
          <div
            className="text-sm mt-2 transition-colors duration-300"
            style={{ color: themeConfig.mode === 'dark' ? '#9ca3af' : '#6b7280' }}
          >
            TypeScript
          </div>
        </div>
      </motion.div>

      <motion.p
        className="mt-16 text-center max-w-2xl px-4 transition-colors duration-500"
        style={{ color: themeConfig.mode === 'dark' ? '#6b7280' : '#9ca3af' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        基于 React 19 + TypeScript 5.9 + Tailwind CSS 4 构建<br />
        由 Saken 与 AI 协作打造
      </motion.p>
    </div>
  )
}
