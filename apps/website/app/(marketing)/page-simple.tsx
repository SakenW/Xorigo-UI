'use client'

import React from 'react'
import { motion } from 'framer-motion'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <motion.h1
        className="text-6xl md:text-8xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Xorigo UI
      </motion.h1>

      <motion.p
        className="text-2xl text-gray-300 mb-12 text-center max-w-3xl px-4"
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
          className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-semibold transition-all transform hover:scale-105"
        >
          查看文档
        </a>
        <a
          href="https://github.com/Xorigo/xorigo-ui"
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold border border-purple-600/30 transition-all transform hover:scale-105"
        >
          GitHub
        </a>
      </motion.div>

      <motion.div
        className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9 }}
      >
        <div className="bg-gray-900 p-6 rounded-lg border border-purple-600/20">
          <div className="text-3xl font-bold text-purple-400">100+</div>
          <div className="text-sm text-gray-400 mt-2">组件</div>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-purple-600/20">
          <div className="text-3xl font-bold text-pink-400">10+</div>
          <div className="text-sm text-gray-400 mt-2">主题配方</div>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-purple-600/20">
          <div className="text-3xl font-bold text-blue-400">7</div>
          <div className="text-sm text-gray-400 mt-2">七轴系统</div>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg border border-purple-600/20">
          <div className="text-3xl font-bold text-green-400">100%</div>
          <div className="text-sm text-gray-400 mt-2">TypeScript</div>
        </div>
      </motion.div>

      <motion.p
        className="mt-16 text-gray-500 text-center max-w-2xl px-4"
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