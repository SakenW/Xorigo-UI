'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { BusinessScenarioCard } from './business-scenario-card'
import {
  businessScenarios,
  getBusinessScenariosByCategory,
  getPopularBusinessScenarios,
  searchBusinessScenarios,
  type BusinessScenario
} from '../../../data/business-scenarios'

interface SolutionPlatformHomeProps {
  className?: string
  onScenarioSelect?: (scenario: BusinessScenario) => void
}

export function SolutionPlatformHome({
  className,
  onScenarioSelect
}: SolutionPlatformHomeProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  // 增强的分类定义
  const categories = [
    {
      id: 'all',
      name: '全部场景',
      icon: '🎯',
      color: 'blue',
      description: '查看所有业务场景',
      count: businessScenarios.length,
      trending: true
    },
    {
      id: 'prototype',
      name: '快速原型',
      icon: '🚀',
      color: 'green',
      description: '登录、注册、个人中心、用户认证',
      count: getBusinessScenariosByCategory('prototype').length,
      popular: true,
      tags: ['MVP', '快速开发', '基础功能']
    },
    {
      id: 'business',
      name: '业务功能',
      icon: '💼',
      color: 'orange',
      description: '电商、数据管理、用户管理、支付系统',
      count: getBusinessScenariosByCategory('business').length,
      popular: true,
      tags: ['企业级', 'CRUD', '业务流程']
    },
    {
      id: 'data',
      name: '数据展示',
      icon: '📊',
      color: 'purple',
      description: '图表、统计、仪表板、数据可视化',
      count: getBusinessScenariosByCategory('data').length,
      tags: ['BI', '分析', '可视化']
    },
    {
      id: 'layout',
      name: '页面布局',
      icon: '🎨',
      color: 'indigo',
      description: '导航、内容、响应式、页面架构',
      count: getBusinessScenariosByCategory('layout').length,
      tags: ['UI设计', '响应式', '用户体验']
    }
  ]

  // 分类统计信息
  const categoryStats = useMemo(() => {
    return categories.map(category => ({
      ...category,
      avgPopularity: category.id === 'all'
        ? Math.round(businessScenarios.reduce((sum, s) => sum + s.popularity, 0) / businessScenarios.length)
        : Math.round(getBusinessScenariosByCategory(category.id).reduce((sum, s) => sum + s.popularity, 0) / getBusinessScenariosByCategory(category.id).length),
      completedSolutions: category.id === 'all'
        ? businessScenarios.reduce((sum, s) => sum + s.solutions.filter(sol => sol.codeAvailable).length, 0)
        : getBusinessScenariosByCategory(category.id).reduce((sum, s) => sum + s.solutions.filter(sol => sol.codeAvailable).length, 0)
    }))
  }, [categories, businessScenarios])

  // 智能推荐逻辑
  const intelligentRecommendations = useMemo(() => {
    // 基于不同策略的推荐
    const recommendations = [
      {
        id: 'trending',
        name: '🔥 热门推荐',
        scenarios: businessScenarios
          .filter(s => s.popularity >= 85)
          .slice(0, 4),
        reason: '高人气场景'
      },
      {
        id: 'beginner',
        name: '🎯 新手推荐',
        scenarios: businessScenarios
          .filter(s => s.difficulty === 'beginner' && s.popularity >= 60)
          .slice(0, 3),
        reason: '适合初学者'
      },
      {
        id: 'complete',
        name: '💎� 功能完整',
        scenarios: businessScenarios
          .filter(s => s.solutions.length >= 4 && s.solutions.filter(sol => sol.codeAvailable).length >= 2)
          .slice(0, 3),
        reason: '功能齐全'
      }
    ]

    return recommendations
  }, [businessScenarios])

  // 筛选后的业务场景
  const filteredScenarios = useMemo(() => {
    let scenarios = businessScenarios

    // 按分类筛选
    if (selectedCategory !== 'all') {
      scenarios = getBusinessScenariosByCategory(selectedCategory)
    }

    // 按搜索关键词筛选
    if (searchQuery.trim()) {
      scenarios = searchBusinessScenarios(searchQuery)
    }

    return scenarios
  }, [selectedCategory, searchQuery])

  // 热门推荐（显示在顶部）
  const recommendedScenarios = useMemo(() => {
    return getPopularBusinessScenarios(3)
  }, [])

  const handleScenarioClick = (scenario: BusinessScenario) => {
    onScenarioSelect?.(scenario)
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSearchQuery('') // 清空搜索
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setSelectedCategory('all') // 搜索时重置分类
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Hero 区域 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            🎯 你在做什么？
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            选择你的业务场景，获得完整的解决方案模板，从组件组合直接到生产就绪的代码
          </p>

          {/* 智能搜索框 */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                🔍
              </div>
              <Input
                placeholder="搜索业务场景... (例如: 登录表单、电商系统、数据看板)"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-14 pr-16 h-14 text-lg border-0 bg-white dark:bg-gray-800 rounded-2xl shadow-lg focus:shadow-xl transition-all duration-300"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* 分类导航 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative px-6 py-4 rounded-2xl border-2 transition-all duration-300
                  ${selectedCategory === category.id
                    ? `border-${category.color}-500 bg-${category.color}-50 dark:bg-${category.color}-900/20 shadow-lg`
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {category.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {category.description}
                    </div>
                  </div>
                </div>
                {selectedCategory === category.id && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 pointer-events-none"
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 热门推荐区域 */}
        {!searchQuery && selectedCategory === 'all' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                💡 推荐解决方案
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                基于热门需求的精选解决方案模板
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {recommendedScenarios.map((scenario, index) => (
                <motion.div
                  key={scenario.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                >
                  <BusinessScenarioCard
                    scenario={scenario}
                    onClick={handleScenarioClick}
                    variant={scenario.color === 'blue' ? 'primary' :
                            scenario.color === 'green' ? 'secondary' : 'accent'}
                    size="lg"
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* 场景列表 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {/* 标题和统计 */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {selectedCategory === 'all' ? '🎯 所有业务场景' :
                 categories.find(c => c.id === selectedCategory)?.icon + ' ' +
                 categories.find(c => c.id === selectedCategory)?.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? `搜索 "${searchQuery}" 的结果` : '选择适合你项目的业务场景'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {filteredScenarios.length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                个解决方案
              </div>
            </div>
          </div>

          {/* 场景网格 */}
          <AnimatePresence mode="wait">
            {filteredScenarios.length > 0 ? (
              <motion.div
                key="scenarios"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filteredScenarios.map((scenario, index) => (
                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 * index }}
                  >
                    <BusinessScenarioCard
                      scenario={scenario}
                      onClick={handleScenarioClick}
                      size="md"
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  没有找到匹配的业务场景
                </h3>
                <p className="text-gray-600 mb-6">
                  尝试调整搜索关键词或选择不同的分类
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                  }}
                >
                  清除过滤条件
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}