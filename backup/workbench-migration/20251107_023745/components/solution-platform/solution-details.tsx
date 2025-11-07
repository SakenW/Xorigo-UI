'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@xorigo-ui/core'
import { Card } from '@xorigo-ui/core'
import { cn } from '@/utils'
import { ArrowLeft, Clock, Users, Code, Play, Download, Star, Settings, Search, Filter, TrendingUp, BookOpen, Award, Target, Zap, CheckCircle2, AlertCircle, Lightbulb, GraduationCap, GitBranch, Shield, Cpu } from 'lucide-react'
import type { BusinessScenario, SolutionTemplate } from './business-scenario-card'
import { SolutionConfigurator } from './solution-configurator'

interface SolutionDetailsProps {
  scenario: BusinessScenario | null
  onClose: () => void
  onSolutionSelect?: (solution: SolutionTemplate) => void
  className?: string
}

export function SolutionDetails({
  scenario,
  onClose,
  onSolutionSelect,
  className
}: SolutionDetailsProps) {
  const [selectedSolution, setSelectedSolution] = useState<SolutionTemplate | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'solutions' | 'components' | 'best-practices' | 'learning-path'>('overview')
  const [showConfigurator, setShowConfigurator] = useState<SolutionTemplate | null>(null)
  const [hoveredSolution, setHoveredSolution] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'popularity' | 'difficulty' | 'name'>('popularity')

  const handleConfigureSolution = (solution: SolutionTemplate) => {
    setShowConfigurator(solution)
  }

  const handleConfiguratorClose = () => {
    setShowConfigurator(null)
  }

  if (!scenario) return null

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/20'
      case 'intermediate': return 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/20'
      case 'advanced': return 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/20'
      default: return 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/20'
    }
  }

  const getPopularityHeat = (popularity: number) => {
    if (popularity >= 80) return { text: '🔥 热门', color: 'text-red-600' }
    if (popularity >= 60) return { text: '⭐ 推荐', color: 'text-yellow-600' }
    if (popularity >= 40) return { text: '📈 常用', color: 'text-blue-600' }
    return { text: '💡 新功能', color: 'text-purple-600' }
  }

  const popularity = getPopularityHeat(scenario.popularity)

  // 搜索和过滤功能
  const filteredAndSortedSolutions = useMemo(() => {
    let filtered = scenario.solutions

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(solution =>
        solution.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        solution.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        solution.components.some(comp => comp.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // 排序
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'popularity':
          return (b.codeAvailable ? 10 : 0) - (a.codeAvailable ? 10 : 0)
        case 'difficulty':
          const difficultyOrder = { 'beginner': 1, 'intermediate': 2, 'advanced': 3 }
          return difficultyOrder[scenario.difficulty as keyof typeof difficultyOrder] -
                 difficultyOrder[scenario.difficulty as keyof typeof difficultyOrder]
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })
  }, [scenario.solutions, searchQuery, sortBy, scenario.difficulty])

  // 模拟组件统计
  const componentStats = useMemo(() => {
    const allComponents = scenario.solutions.flatMap(s => s.components)
    const uniqueComponents = Array.from(new Set(allComponents))

    return {
      total: allComponents.length,
      unique: uniqueComponents.length,
      byCategory: uniqueComponents.reduce((acc, comp) => {
        // 简单分类逻辑
        if (['Button', 'Input', 'Form', 'Select', 'Checkbox'].includes(comp)) {
          acc.form++
        } else if (['Card', 'Table', 'List', 'Grid'].includes(comp)) {
          acc.layout++
        } else if (['Modal', 'Dialog', 'Drawer', 'Popover'].includes(comp)) {
          acc.overlay++
        } else {
          acc.other++
        }
        return acc
      }, { form: 0, layout: 0, overlay: 0, other: 0 } as Record<string, number>)
    }
  }, [scenario.solutions])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={cn(
        'min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10',
        className
      )}
    >
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>返回解决方案平台</span>
            </button>

            {/* 标签页导航 */}
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              {[
                { id: 'overview', label: '总览', icon: '📊' },
                { id: 'solutions', label: '解决方案', icon: '🎯' },
                { id: 'components', label: '组件', icon: '🧩' },
                { id: 'best-practices', label: '最佳实践', icon: '✨' },
                { id: 'learning-path', label: '学习路径', icon: '🎓' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    activeTab === tab.id
                      ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  )}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className={cn('text-sm font-medium', popularity.color)}>
                {popularity.text}
              </span>
              <Button
                size="sm"
                className="flex items-center gap-2"
              >
                <Star className="w-4 h-4" />
                收藏
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* 场景标题 */}
        <div className="mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-white/50 to-white/10 dark:from-gray-800/50 dark:to-gray-900/10 flex items-center justify-center text-4xl border border-white/20 dark:border-gray-700/20 backdrop-blur-sm">
              {scenario.icon}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {scenario.title}
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-4 max-w-3xl">
                {scenario.description}
              </p>

              <div className="flex items-center gap-4 flex-wrap">
                <span className={cn(
                  'inline-flex items-center gap-2 px-3 py-1 text-sm font-medium rounded-full',
                  getDifficultyColor(scenario.difficulty)
                )}>
                  {scenario.difficulty === 'beginner' && '🎯'}
                  {scenario.difficulty === 'intermediate' && '🚀'}
                  {scenario.difficulty === 'advanced' && '⚡'}
                  {scenario.difficulty}
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4" />
                  {scenario.estimatedTime}
                </span>
                <span className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  {scenario.solutions.length} 个解决方案
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 标签页内容 */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 统计信息卡片 */}
              <div className="grid md:grid-cols-4 gap-6 mb-8">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Code className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">总组件数</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {componentStats.total}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">独特组件</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {componentStats.unique}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <Play className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">可用演示</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {scenario.solutions.filter(s => s.codeAvailable).length}
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                      <Download className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">代码示例</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">
                    {scenario.solutions.filter(s => s.codeAvailable).length}
                  </div>
                </Card>
              </div>

              {/* 快速开始 */}
              <Card className="p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">🚀 快速开始</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg mb-3 mx-auto">
                      1
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">选择解决方案</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      根据项目需求选择最适合的解决方案模板
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 font-bold text-lg mb-3 mx-auto">
                      2
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">配置参数</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      根据你的设计需求调整组件样式和行为
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center text-purple-600 dark:text-purple-400 font-bold text-lg mb-3 mx-auto">
                      3
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">获取代码</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      复制完整的代码示例，直接应用到你的项目
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {activeTab === 'solutions' && (
            <motion.div
              key="solutions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 搜索和排序栏 */}
              <Card className="p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* 搜索框 */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="搜索解决方案..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  {/* 排序选择器 */}
                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-gray-400" />
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="popularity">按可用性排序</option>
                      <option value="name">按名称排序</option>
                    </select>
                  </div>
                </div>

                {/* 搜索结果统计 */}
                {searchQuery && (
                  <div className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                    找到 {filteredAndSortedSolutions.length} 个结果
                  </div>
                )}
              </Card>

              {/* 解决方案网格 */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedSolutions.map((solution, index) => (
                  <motion.div
                    key={solution.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                  >
                    <Card
                      className={cn(
                        'p-6 hover:shadow-lg transition-all duration-300 cursor-pointer group relative overflow-hidden',
                        hoveredSolution === solution.id && 'ring-2 ring-blue-500 ring-opacity-50 shadow-blue-500/20'
                      )}
                      onClick={() => setSelectedSolution(solution)}
                      onMouseEnter={() => setHoveredSolution(solution.id)}
                      onMouseLeave={() => setHoveredSolution(null)}
                    >
                      {/* 悬停指示器 */}
                      {hoveredSolution === solution.id && (
                        <motion.div
                          layoutId="hoverIndicator"
                          className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}

                      <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {solution.name}
                            </h3>
                            {solution.codeAvailable && (
                              <CheckCircle2 className="w-4 h-4 text-green-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                            {solution.description}
                          </p>
                        </div>
                        <div className="ml-3">
                          {solution.codeAvailable ? (
                            <div className="px-2 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs rounded-full font-medium">
                              可用
                            </div>
                          ) : (
                            <div className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 text-xs rounded-full font-medium">
                              开发中
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs font-medium text-gray-500 dark:text-gray-400">
                          包含组件 ({solution.components.length})
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {solution.components.slice(0, 5).map((component) => (
                            <span
                              key={component}
                              className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded"
                            >
                              {component}
                            </span>
                          ))}
                          {solution.components.length > 5 && (
                            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs rounded">
                              +{solution.components.length - 5}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleConfigureSolution(solution)
                            }}
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            配置
                          </Button>
                          <Button
                            size="sm"
                            className="flex-1"
                            onClick={(e) => {
                              e.stopPropagation()
                              onSolutionSelect?.(solution)
                            }}
                          >
                            {solution.codeAvailable ? '查看代码' : '了解更多'}
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'components' && (
            <motion.div
              key="components"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="grid md:grid-cols-4 gap-4">
                {Object.entries(componentStats.byCategory).map(([category, count]) => (
                  <Card key={category} className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {count}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                        {category} 组件
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">所有组件</h3>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {Array.from(new Set(scenario.solutions.flatMap(s => s.components))).map((component) => (
                    <div
                      key={component}
                      className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-center text-sm text-gray-700 dark:text-gray-300"
                    >
                      {component}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'best-practices' && (
            <motion.div
              key="best-practices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                {/* 最佳实践概览 */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {scenario.title} 最佳实践
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        基于 Xorigo UI 设计系统的专业指导和建议
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Award className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">95%</div>
                      <div className="text-sm text-blue-700 dark:text-blue-300">遵循率</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Zap className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">3x</div>
                      <div className="text-sm text-green-700 dark:text-green-300">开发效率</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <Shield className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">100%</div>
                      <div className="text-sm text-purple-700 dark:text-purple-300">代码质量</div>
                    </div>
                  </div>
                </Card>

                {/* 设计原则 */}
                <Card className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-500" />
                    核心设计原则
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">一致性优先</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        保持统一的视觉风格、交互模式和组件使用方式，确保用户体验的一致性。
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">可访问性第一</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        遵循 WCAG 2.1 AA 标准，确保所有用户都能无障碍使用你的应用。
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">响应式设计</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        采用移动优先的设计理念，确保在各种设备上都有良好的显示效果。
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-2">性能优化</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        合理使用动画和过渡效果，避免过度装饰，保持应用的流畅性。
                      </p>
                    </div>
                  </div>
                </Card>

                {/* 技术建议 */}
                <Card className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <Cpu className="w-5 h-5 text-green-500" />
                    技术实现建议
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">使用 TypeScript</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          启用严格模式，为所有组件定义完整的类型接口，提高代码的可维护性。
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">主题系统集成</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          充分利用 Xorigo UI 的七轴主题系统，支持多主题切换和个性化定制。
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h5 className="font-medium text-gray-900 dark:text-white">避免硬编码样式</h5>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          使用设计令牌和主题变量，避免在组件中硬编码颜色、间距等样式值。
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* 常见问题 */}
                <Card className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">常见问题与解决方案</h4>
                  <div className="space-y-4">
                    <div className="border-l-4 border-blue-500 pl-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">如何处理表单验证？</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        使用 Xorigo UI 的 Form 组件配合验证库，实现客户端和服务端双重验证。
                      </p>
                    </div>
                    <div className="border-l-4 border-green-500 pl-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">如何优化移动端体验？</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        使用响应式断点，适配不同屏幕尺寸，并优化触摸交互体验。
                      </p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-4">
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">如何处理暗色模式？</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        利用主题系统的自动切换功能，确保在暗色模式下的视觉效果和可读性。
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}

          {activeTab === 'learning-path' && (
            <motion.div
              key="learning-path"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="space-y-6">
                {/* 学习路径概览 */}
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {scenario.title} 学习路径
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        循序渐进的学习计划，从基础到高级掌握相关技能
                      </p>
                    </div>
                  </div>

                  {/* 学习进度 */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">学习进度</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">预计 {scenario.estimatedTime}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                      <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                </Card>

                {/* 学习阶段 */}
                <div className="space-y-4">
                  {/* 第一阶段 */}
                  <Card className="p-6 border-l-4 border-green-500">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-green-600 dark:text-green-400 font-bold">1</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          基础概念理解
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          掌握 {scenario.title} 的核心概念和 Xorigo UI 组件的基本使用方法。
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <BookOpen className="w-4 h-4" />
                            理论学习：15分钟
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Code className="w-4 h-4" />
                            实践练习：15分钟
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* 第二阶段 */}
                  <Card className="p-6 border-l-4 border-blue-500">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 dark:text-blue-400 font-bold">2</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          组件组合实践
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          学习如何组合多个 Xorigo UI 组件，构建完整的用户界面。
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <BookOpen className="w-4 h-4" />
                            理论学习：20分钟
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Code className="w-4 h-4" />
                            实践练习：25分钟
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* 第三阶段 */}
                  <Card className="p-6 border-l-4 border-purple-500">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-purple-600 dark:text-purple-400 font-bold">3</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                          高级特性应用
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          掌握主题定制、动画效果、响应式设计等高级特性。
                        </p>
                        <div className="grid md:grid-cols-2 gap-3">
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <BookOpen className="w-4 h-4" />
                            理论学习：25分钟
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <Code className="w-4 h-4" />
                            实践练习：30分钟
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* 学习资源 */}
                <Card className="p-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <GitBranch className="w-5 h-5 text-orange-500" />
                    相关学习资源
                  </h4>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="text-2xl mb-2">📚</div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">官方文档</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        完整的 API 文档和使用指南
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="text-2xl mb-2">🎥</div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">视频教程</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        实践演示和详细讲解
                      </p>
                    </div>
                    <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="text-2xl mb-2">💡</div>
                      <h5 className="font-medium text-gray-900 dark:text-white mb-1">最佳实践</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        行业标准和设计模式
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 解决方案配置器 */}
      <AnimatePresence>
        {showConfigurator && (
          <SolutionConfigurator
            solution={showConfigurator}
            scenario={scenario}
            isOpen={!!showConfigurator}
            onClose={handleConfiguratorClose}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}