'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface BusinessScenario {
  id: string
  name: string
  description: string
  icon: string
  tags: string[]
  difficulty: string
  features: string[]
  techStack: string[]
  componentCount: number
}

interface SolutionPlatformProps {
  scenarios: BusinessScenario[]
  searchTerm: string
  selectedDifficulty: string
  difficultyStats: {
    beginner: number
    intermediate: number
    advanced: number
    expert: number
  }
  onSearchChange: (value: string) => void
  onDifficultyChange: (value: string) => void
  onViewDetails: (id: string) => void
  onUseTemplate: (id: string) => void
}

export default function SolutionPlatform({
  scenarios,
  searchTerm,
  selectedDifficulty,
  difficultyStats,
  onSearchChange,
  onDifficultyChange,
  onViewDetails,
  onUseTemplate
}: SolutionPlatformProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* 头部统计 */}
      <div className="p-6 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🚀 解决方案平台 ({scenarios.length}个业务场景)
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              企业级业务场景解决方案模板，覆盖各行各业，基于现代技术栈构建
            </p>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {scenarios.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">总方案数</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-green-600 dark:text-green-400">
                {difficultyStats.beginner}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">初级</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                {difficultyStats.intermediate}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">中级</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                {difficultyStats.advanced}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">高级</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-red-600 dark:text-red-400">
                {difficultyStats.expert}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">专家级</div>
            </div>
          </div>
        </div>

        {/* 过滤器 */}
        <div className="flex items-center space-x-4 mt-6">
          <button
            onClick={() => onDifficultyChange('')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              !selectedDifficulty
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            全部 ({scenarios.length})
          </button>
          <button
            onClick={() => onDifficultyChange('beginner')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              selectedDifficulty === 'beginner'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            初级 ({difficultyStats.beginner})
          </button>
          <button
            onClick={() => onDifficultyChange('intermediate')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              selectedDifficulty === 'intermediate'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            中级 ({difficultyStats.intermediate})
          </button>
          <button
            onClick={() => onDifficultyChange('advanced')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              selectedDifficulty === 'advanced'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            高级 ({difficultyStats.advanced})
          </button>
          <button
            onClick={() => onDifficultyChange('expert')}
            className={`px-4 py-2 text-sm rounded-lg transition-colors ${
              selectedDifficulty === 'expert'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
            }`}
          >
            专家级 ({difficultyStats.expert})
          </button>
        </div>

        {/* 搜索 */}
        <div className="mt-4 max-w-md">
          <div className="relative">
            <input
              type="text"
              placeholder="搜索解决方案..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              🔍
            </div>
          </div>
        </div>
      </div>

      {/* 场景网格 */}
      <div className="flex-1 p-6 overflow-y-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {scenarios.map((scenario) => (
            <motion.div
              key={scenario.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl cursor-pointer hover:shadow-lg transition-all duration-200"
            >
              {/* 头部 */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{scenario.icon}</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {scenario.name}
                    </h3>
                    <div className="flex items-center space-x-2 mt-1">
                      {scenario.tags?.map((tag, index) => (
                        <span
                          key={`${scenario.id}-tag-${tag}`}
                          className={`px-2 py-1 text-xs rounded ${
                            tag === '推荐' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' :
                            tag === '热门' ? 'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400' :
                            tag === '新品' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                            'bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={`px-2 py-1 text-xs rounded-full ${
                  scenario.difficulty === 'beginner' ? 'bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400' :
                  scenario.difficulty === 'intermediate' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400' :
                  scenario.difficulty === 'advanced' ? 'bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400' :
                  'bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                }`}>
                  {scenario.difficulty === 'beginner' ? '初级' :
                   scenario.difficulty === 'intermediate' ? '中级' :
                   scenario.difficulty === 'advanced' ? '高级' : '专家级'}
                </div>
              </div>

              {/* 描述 */}
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                {scenario.description}
              </p>

              {/* 特性 */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1 mb-2">
                  {scenario.features?.map((feature, index) => (
                    <span
                      key={`${scenario.id}-feature-${feature}-${index}`}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                  {scenario.features.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                      +{scenario.features.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* 技术栈 */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
                  {scenario.techStack.slice(0, 3).map((tech, index) => (
                    <span
                      key={`${scenario.id}-tech-${tech}-${index}`}
                      className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                  {scenario.techStack.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded">
                      +{scenario.techStack.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* 底部信息 */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {scenario.componentCount} 个组件
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => onViewDetails(scenario.id)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    查看详情
                  </button>
                  <button
                    onClick={() => onUseTemplate(scenario.id)}
                    className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    使用模板
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}