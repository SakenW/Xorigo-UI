'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts'
import {
  Users, Activity, TrendingUp, AlertCircle,
  Clock, Target, Zap, Monitor, BarChart3, PieChartIcon,
  TrendingDown, CheckCircle, XCircle, Loader, Eye
} from 'lucide-react'

interface UserBehaviorData {
  timestamp: string
  activeUsers: number
  pageViews: number
  avgSessionDuration: number
  bounceRate: number
  conversionRate: number
}

interface ComponentUsageData {
  component: string
  usage: number
  growth: number
  category: string
  performance: number
}

interface PerformanceMetrics {
  metric: string
  value: number
  target: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
  trend: 'up' | 'down' | 'stable'
}

interface ABTestResult {
  testId: string
  testName: string
  variantA: string
  variantB: string
  conversionA: number
  conversionB: number
  significance: number
  winner: 'A' | 'B' | 'inconclusive'
  status: 'running' | 'completed' | 'paused'
}

export default function PerformanceMonitoring() {
  const [selectedTab, setSelectedTab] = useState<'behavior' | 'usage' | 'metrics' | 'abtest'>('behavior')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')
  const [isLoading, setIsLoading] = useState(false)

  // 模拟用户行为数据
  const userBehaviorData: UserBehaviorData[] = [
    { timestamp: '10-01', activeUsers: 1240, pageViews: 8900, avgSessionDuration: 245, bounceRate: 32, conversionRate: 4.2 },
    { timestamp: '10-02', activeUsers: 1380, pageViews: 9200, avgSessionDuration: 267, bounceRate: 30, conversionRate: 4.5 },
    { timestamp: '10-03', activeUsers: 1420, pageViews: 9800, avgSessionDuration: 289, bounceRate: 28, conversionRate: 4.8 },
    { timestamp: '10-04', activeUsers: 1390, pageViews: 9500, avgSessionDuration: 278, bounceRate: 29, conversionRate: 4.6 },
    { timestamp: '10-05', activeUsers: 1560, pageViews: 11200, avgSessionDuration: 312, bounceRate: 26, conversionRate: 5.1 },
    { timestamp: '10-06', activeUsers: 1680, pageViews: 12800, avgSessionDuration: 334, bounceRate: 24, conversionRate: 5.4 },
    { timestamp: '10-07', activeUsers: 1750, pageViews: 13500, avgSessionDuration: 356, bounceRate: 23, conversionRate: 5.7 },
  ]

  // 模拟组件使用数据
  const componentUsageData: ComponentUsageData[] = [
    { component: 'Button', usage: 3420, growth: 12.5, category: 'Primitives', performance: 98 },
    { component: 'Card', usage: 2890, growth: 8.3, category: 'Layout', performance: 95 },
    { component: 'Input', usage: 2650, growth: 15.2, category: 'Forms', performance: 92 },
    { component: 'Modal', usage: 1980, growth: -2.1, category: 'Overlay', performance: 89 },
    { component: 'Table', usage: 1870, growth: 6.7, category: 'Data Display', performance: 87 },
    { component: 'Navigation', usage: 1650, growth: 10.4, category: 'Navigation', performance: 94 },
    { component: 'Chart', usage: 1430, growth: 18.9, category: 'Data Visualization', performance: 91 },
    { component: 'Form', usage: 1320, growth: 5.6, category: 'Forms', performance: 88 },
  ]

  // 模拟性能指标数据
  const performanceMetrics: PerformanceMetrics[] = [
    { metric: '首屏加载时间', value: 1.2, target: 2.0, status: 'excellent', trend: 'down' },
    { metric: '交互响应时间', value: 45, target: 100, status: 'excellent', trend: 'stable' },
    { metric: '组件查找时间', value: 8, target: 30, status: 'excellent', trend: 'down' },
    { metric: '内存使用率', value: 65, target: 70, status: 'good', trend: 'stable' },
    { metric: 'CPU使用率', value: 42, target: 50, status: 'good', trend: 'down' },
    { metric: '错误率', value: 0.02, target: 0.1, status: 'excellent', trend: 'down' },
  ]

  // 模拟A/B测试数据
  const abTestResults: ABTestResult[] = [
    {
      testId: '001',
      testName: '按钮颜色优化',
      variantA: '蓝色按钮',
      variantB: '绿色按钮',
      conversionA: 4.2,
      conversionB: 5.1,
      significance: 0.95,
      winner: 'B',
      status: 'completed'
    },
    {
      testId: '002',
      testName: '页面布局测试',
      variantA: '三栏布局',
      variantB: '两栏布局',
      conversionA: 3.8,
      conversionB: 4.5,
      significance: 0.87,
      winner: 'B',
      status: 'completed'
    },
    {
      testId: '003',
      testName: '搜索算法优化',
      variantA: '基础搜索',
      variantB: '智能搜索',
      conversionA: 2.9,
      conversionB: 3.4,
      significance: 0.72,
      winner: 'inconclusive',
      status: 'running'
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100'
      case 'good': return 'text-blue-600 bg-blue-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'critical': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />
      case 'down': return <TrendingDown className="w-4 h-4 text-green-500" />
      case 'stable': return <div className="w-4 h-4 bg-gray-400 rounded-full" />
      default: return null
    }
  }

  const renderUserBehaviorAnalysis = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* 核心指标卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: '活跃用户', value: '1,750', change: '+15.2%', icon: Users, color: 'text-blue-600' },
          { label: '页面浏览量', value: '13.5K', change: '+22.8%', icon: Eye, color: 'text-green-600' },
          { label: '平均会话时长', value: '5m 56s', change: '+18.3%', icon: Clock, color: 'text-purple-600' },
          { label: '转化率', value: '5.7%', change: '+2.1%', icon: Target, color: 'text-orange-600' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* 用户行为趋势图 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">用户行为趋势</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={userBehaviorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="activeUsers"
              stackId="1"
              stroke="#3b82f6"
              fill="#93bbfc"
              name="活跃用户"
            />
            <Area
              type="monotone"
              dataKey="pageViews"
              stackId="2"
              stroke="#10b981"
              fill="#86efac"
              name="页面浏览量"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 热力图和转化漏斗 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">页面热力图分布</h3>
          <div className="grid grid-cols-8 gap-1">
            {Array.from({ length: 64 }).map((_, i) => {
              const intensity = Math.random()
              return (
                <div
                  key={i}
                  className="aspect-square rounded"
                  style={{
                    backgroundColor: `rgba(59, 130, 246, ${intensity})`,
                  }}
                  title={`点击密度: ${(intensity * 100).toFixed(0)}%`}
                />
              )
            })}
          </div>
          <div className="flex items-center justify-between mt-4 text-sm text-gray-600">
            <span>低活跃度</span>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-200 rounded" />
              <div className="w-4 h-4 bg-blue-400 rounded" />
              <div className="w-4 h-4 bg-blue-600 rounded" />
            </div>
            <span>高活跃度</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">转化漏斗分析</h3>
          <div className="space-y-3">
            {[
              { stage: '访问首页', users: 10000, rate: 100 },
              { stage: '浏览组件', users: 6800, rate: 68 },
              { stage: '开始配置', users: 3200, rate: 32 },
              { stage: '生成代码', users: 1800, rate: 18 },
              { stage: '下载使用', users: 570, rate: 5.7 },
            ].map((stage, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">{stage.stage}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-end pr-2"
                    style={{ width: `${stage.rate}%` }}
                  >
                    <span className="text-xs text-white font-medium">
                      {stage.rate}%
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-900 w-16 text-right">
                  {stage.users.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )

  const renderComponentUsageStats = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* 组件使用排行 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">组件使用统计</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={componentUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="component" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="usage" fill="#3b82f6" name="使用次数" />
            <Bar dataKey="growth" fill="#10b981" name="增长率%" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 组件分类分布 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">分类使用分布</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={componentUsageData.reduce((acc, item) => {
                  const existing = acc.find(x => x.name === item.category)
                  if (existing) {
                    existing.value += item.usage
                  } else {
                    acc.push({ name: item.category, value: item.usage })
                  }
                  return acc
                }, [] as { name: string; value: number }[])}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">组件性能评分</h3>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={componentUsageData.slice(0, 6)}>
              <PolarGrid />
              <PolarAngleAxis dataKey="component" />
              <PolarRadiusAxis angle={90} domain={[0, 100]} />
              <Radar name="性能评分" dataKey="performance" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 详细使用数据表格 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">详细使用数据</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">组件名称</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">分类</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">使用次数</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">增长率</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">性能评分</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">状态</th>
              </tr>
            </thead>
            <tbody>
              {componentUsageData.map((component, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{component.component}</td>
                  <td className="py-3 px-4 text-gray-600">{component.category}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{component.usage.toLocaleString()}</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center ${component.growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {component.growth > 0 ? '+' : ''}{component.growth}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">{component.performance}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      component.performance >= 95 ? 'bg-green-100 text-green-800' :
                      component.performance >= 90 ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {component.performance >= 95 ? '优秀' :
                       component.performance >= 90 ? '良好' : '需优化'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  )

  const renderPerformanceMetrics = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* 核心性能指标 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {performanceMetrics.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-sm font-medium text-gray-600">{metric.metric}</h4>
              {getStatusIcon(metric.trend)}
            </div>
            <div className="flex items-end justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {metric.value}
                  <span className="text-sm text-gray-500 ml-1">
                    {metric.metric.includes('时间') ? 's' :
                     metric.metric.includes('率') ? '%' : ''}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  目标: {metric.target}
                  {metric.metric.includes('时间') ? 's' :
                   metric.metric.includes('率') ? '%' : ''}
                </p>
              </div>
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(metric.status)}`}>
                {metric.status === 'excellent' ? '优秀' :
                 metric.status === 'good' ? '良好' :
                 metric.status === 'warning' ? '警告' : '严重'}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Core Web Vitals */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Core Web Vitals</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: 'LCP (Largest Contentful Paint)',
              value: 1.2,
              target: 2.5,
              unit: 's',
              status: 'good',
              description: '最大内容绘制时间'
            },
            {
              name: 'FID (First Input Delay)',
              value: 45,
              target: 100,
              unit: 'ms',
              status: 'good',
              description: '首次输入延迟'
            },
            {
              name: 'CLS (Cumulative Layout Shift)',
              value: 0.08,
              target: 0.1,
              unit: '',
              status: 'good',
              description: '累积布局偏移'
            },
          ].map((vital, index) => (
            <div key={index} className="text-center">
              <div className="relative inline-flex items-center justify-center w-32 h-32 mb-4">
                <svg className="transform -rotate-90 w-32 h-32">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke={vital.value <= vital.target ? '#10b981' : '#ef4444'}
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(vital.value / vital.target) * 352} 352`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute">
                  <p className="text-2xl font-bold text-gray-900">{vital.value}</p>
                  <p className="text-xs text-gray-500">{vital.unit}</p>
                </div>
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{vital.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{vital.description}</p>
              <p className="text-xs text-gray-500">目标: {vital.target}{vital.unit}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 性能趋势图 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">性能趋势监控</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={userBehaviorData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="avgSessionDuration"
              stroke="#3b82f6"
              name="平均会话时长"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="bounceRate"
              stroke="#ef4444"
              name="跳出率"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="conversionRate"
              stroke="#10b981"
              name="转化率"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )

  const renderABTesting = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* A/B测试概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: '活跃测试', value: '12', change: '+3', icon: Activity, color: 'text-blue-600' },
          { label: '完成测试', value: '48', change: '+8', icon: CheckCircle, color: 'text-green-600' },
          { label: '平均提升', value: '15.2%', change: '+2.1%', icon: TrendingUp, color: 'text-purple-600' },
          { label: '显著性', value: '92%', change: '+5%', icon: Target, color: 'text-orange-600' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <p className="text-sm text-green-600 mt-1">{stat.change}</p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* A/B测试结果表格 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">测试结果详情</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">测试名称</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">变体A</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">变体B</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">转化率A</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">转化率B</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">提升</th>
                <th className="text-right py-3 px-4 font-medium text-gray-900">显著性</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">获胜方</th>
                <th className="text-center py-3 px-4 font-medium text-gray-900">状态</th>
              </tr>
            </thead>
            <tbody>
              {abTestResults.map((test, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 font-medium text-gray-900">{test.testName}</td>
                  <td className="py-3 px-4 text-gray-600">{test.variantA}</td>
                  <td className="py-3 px-4 text-gray-600">{test.variantB}</td>
                  <td className="py-3 px-4 text-right text-gray-900">{test.conversionA}%</td>
                  <td className="py-3 px-4 text-right text-gray-900">{test.conversionB}%</td>
                  <td className="py-3 px-4 text-right">
                    <span className={`inline-flex items-center ${
                      ((test.conversionB - test.conversionA) / test.conversionA * 100) > 0
                        ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {((test.conversionB - test.conversionA) / test.conversionA * 100) > 0 ? '+' : ''}
                      {((test.conversionB - test.conversionA) / test.conversionA * 100).toFixed(1)}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right text-gray-900">{(test.significance * 100).toFixed(0)}%</td>
                  <td className="py-3 px-4 text-center">
                    {test.winner === 'A' && <span className="text-blue-600 font-medium">变体A</span>}
                    {test.winner === 'B' && <span text-green-600="font-medium">变体B</span>}
                    {test.winner === 'inconclusive' && <span className="text-gray-600">无显著差异</span>}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      test.status === 'completed' ? 'bg-green-100 text-green-800' :
                      test.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {test.status === 'completed' ? '已完成' :
                       test.status === 'running' ? '进行中' : '已暂停'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 创建新测试 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">创建新的A/B测试</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">测试名称</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="输入测试名称"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">测试类型</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>UI优化测试</option>
              <option>功能测试</option>
              <option>性能测试</option>
              <option>文案测试</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">变体A描述</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="描述变体A的内容"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">变体B描述</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              placeholder="描述变体B的内容"
            />
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            创建测试
          </button>
        </div>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 页面标题 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">性能监控和分析</h1>
          <p className="text-gray-600">全面的用户行为分析、组件使用统计和性能指标监控</p>
        </motion.div>

        {/* 时间范围选择 */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {(['7d', '30d', '90d'] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {range === '7d' ? '7天' : range === '30d' ? '30天' : '90天'}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 border border-gray-300">
            <Loader className="w-4 h-4" />
            刷新数据
          </button>
        </div>

        {/* 标签页导航 */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { key: 'behavior', label: '用户行为分析', icon: Users },
              { key: 'usage', label: '组件使用统计', icon: BarChart3 },
              { key: 'metrics', label: '性能指标', icon: Monitor },
              { key: 'abtest', label: 'A/B测试', icon: PieChartIcon },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 text-sm font-medium transition-colors ${
                  selectedTab === tab.key
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* 内容区域 */}
        <AnimatePresence mode="wait">
          {selectedTab === 'behavior' && renderUserBehaviorAnalysis()}
          {selectedTab === 'usage' && renderComponentUsageStats()}
          {selectedTab === 'metrics' && renderPerformanceMetrics()}
          {selectedTab === 'abtest' && renderABTesting()}
        </AnimatePresence>
      </div>
    </div>
  )
}