'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ComponentLibrary from './components/ComponentLibrary'
import SolutionPlatform from './components/SolutionPlatform'
import WorkbenchNavigation from './components/WorkbenchNavigation'

// 业务场景数据
const businessScenarios = [
  {
    id: 'dashboard',
    name: '智能仪表盘',
    description: '实时数据监控、KPI展示、智能分析',
    icon: '📈',
    tags: ['推荐', '热门'],
    difficulty: 'intermediate',
    features: ['实时数据同步', '多维度数据展示'],
    techStack: ['React', 'D3.js', 'WebSocket'],
    componentCount: 12
  },
  {
    id: 'ecommerce',
    name: '电商管理平台',
    description: '商品管理、订单处理、支付集成',
    icon: '🛒',
    tags: ['热门'],
    difficulty: 'advanced',
    features: ['商品管理', '购物车系统'],
    techStack: ['Next.js', 'Stripe', 'PostgreSQL'],
    componentCount: 15
  },
  {
    id: 'crm',
    name: 'CRM客户关系管理',
    description: '客户信息、销售管道、营销自动化',
    icon: '👥',
    tags: ['推荐'],
    difficulty: 'advanced',
    features: ['客户管理', '销售管道'],
    techStack: ['React', 'Node.js', 'MongoDB'],
    componentCount: 18
  },
  {
    id: 'healthcare',
    name: '医疗健康管理',
    description: '病历管理、预约系统、健康监测',
    icon: '🏥',
    tags: ['新品'],
    difficulty: 'expert',
    features: ['电子病历', '预约管理'],
    techStack: ['Vue.js', 'Python', 'FastAPI'],
    componentCount: 20
  },
  {
    id: 'education',
    name: '教育管理平台',
    description: '课程管理、学生信息、在线考试',
    icon: '📚',
    tags: ['推荐'],
    difficulty: 'intermediate',
    features: ['课程管理', '学生信息系统'],
    techStack: ['Next.js', 'Express', 'MySQL'],
    componentCount: 14
  },
  {
    id: 'finance',
    name: '财务管理系统',
    description: '账务处理、报表生成、预算管理',
    icon: '💰',
    difficulty: 'expert',
    features: ['账务处理', '财务报表'],
    techStack: ['Angular', 'Java', 'Oracle'],
    componentCount: 22
  },
  {
    id: 'analytics',
    name: '数据分析平台',
    description: '数据挖掘、可视化、预测分析',
    icon: '📊',
    difficulty: 'expert',
    features: ['数据挖掘', '可视化图表'],
    techStack: ['Python', 'TensorFlow', 'Plotly'],
    componentCount: 16
  },
  {
    id: 'project',
    name: '项目管理工具',
    description: '任务分配、进度跟踪、团队协作',
    icon: '🎯',
    difficulty: 'intermediate',
    features: ['任务管理', '甘特图'],
    techStack: ['React', 'Socket.io', 'Redis'],
    componentCount: 13
  },
  {
    id: 'social',
    name: '社交媒体管理',
    description: '内容发布、用户互动、数据分析',
    icon: '📱',
    difficulty: 'intermediate',
    features: ['内容管理', '多平台发布'],
    techStack: ['Nuxt.js', 'GraphQL', 'PostgreSQL'],
    componentCount: 11
  },
  {
    id: 'inventory',
    name: '库存管理系统',
    description: '库存跟踪、采购管理、供应商协作',
    icon: '🏪',
    difficulty: 'intermediate',
    features: ['库存管理', '采购系统'],
    techStack: ['React', 'Node.js', 'PostgreSQL'],
    componentCount: 10
  },
  {
    id: 'email',
    name: '邮件营销平台',
    description: '邮件模板、营销活动、效果分析',
    icon: '📧',
    difficulty: 'intermediate',
    features: ['邮件模板', '自动化营销'],
    techStack: ['Vue.js', 'SendGrid', 'MongoDB'],
    componentCount: 9
  },
  {
    id: 'cms',
    name: '内容管理系统',
    description: '文章编辑、媒体管理、发布控制',
    icon: '🎨',
    difficulty: 'intermediate',
    features: ['内容编辑', '媒体管理'],
    techStack: ['Next.js', 'Strapi', 'PostgreSQL'],
    componentCount: 12
  },
  {
    id: 'security',
    name: '网络安全监控',
    description: '威胁检测、漏洞扫描、安全报告',
    icon: '🛡️',
    difficulty: 'expert',
    features: ['威胁检测', '漏洞扫描'],
    techStack: ['Python', 'Elasticsearch', 'Docker'],
    componentCount: 17
  },
  {
    id: 'crossborder',
    name: '跨境电商平台',
    description: '多语言支持、国际支付、物流管理',
    icon: '🌐',
    difficulty: 'expert',
    features: ['多语言支持', '国际支付'],
    techStack: ['React', 'Stripe', 'Docker'],
    componentCount: 19
  },
  {
    id: 'ai-assistant',
    name: 'AI智能客服',
    description: '自然语言处理、智能问答、情感分析',
    icon: '🤖',
    difficulty: 'expert',
    features: ['智能问答', '情感分析'],
    techStack: ['Python', 'OpenAI', 'FastAPI'],
    componentCount: 14
  }
]

export default function WorkbenchV2Integrated() {
  const [activeMode, setActiveMode] = useState<'workbench' | 'component-library'>('workbench')

  // 解决方案平台状态
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState('')
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null)

  // 过滤场景
  const filteredScenarios = businessScenarios.filter(scenario => {
    const matchesSearch = !searchTerm ||
      scenario.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      scenario.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDifficulty = !selectedDifficulty || scenario.difficulty === selectedDifficulty
    return matchesSearch && matchesDifficulty
  })

  // 获取难度统计
  const getDifficultyStats = () => {
    const stats = {
      beginner: businessScenarios.filter(s => s.difficulty === 'beginner').length,
      intermediate: businessScenarios.filter(s => s.difficulty === 'intermediate').length,
      advanced: businessScenarios.filter(s => s.difficulty === 'advanced').length,
      expert: businessScenarios.filter(s => s.difficulty === 'expert').length
    }
    return stats
  }

  const handleViewScenarioDetails = (scenarioId: string) => {
    setSelectedScenario(scenarioId)
  }

  const handleUseTemplate = (scenarioId: string) => {
    console.log('使用模板:', scenarioId)
    // 这里可以实现模板使用逻辑
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 导航栏 */}
      <WorkbenchNavigation
        activeMode={activeMode}
        onModeChange={setActiveMode}
        totalComponentCount={96} // 这里可以从组件库hook获取
      />

      {/* 主内容区域 */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          {activeMode === 'workbench' ? (
            <motion.div
              key="workbench"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SolutionPlatform
                scenarios={filteredScenarios}
                searchTerm={searchTerm}
                selectedDifficulty={selectedDifficulty}
                difficultyStats={getDifficultyStats()}
                onSearchChange={setSearchTerm}
                onDifficultyChange={setSelectedDifficulty}
                onViewDetails={handleViewScenarioDetails}
                onUseTemplate={handleUseTemplate}
              />
            </motion.div>
          ) : (
            <motion.div
              key="component-library"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ComponentLibrary />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* 底部状态栏 */}
      <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>状态: 运行中</span>
            </span>
            <span>组件: 96 已注册</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>服务器: 在线</span>
            <span>版本: v2.0.0</span>
          </div>
        </div>
      </footer>
    </div>
  )
}