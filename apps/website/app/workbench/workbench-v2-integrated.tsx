/**
 * Workbench V2 集成版本 - 混合布局设计
 * 顶部模式导航 + 左侧分类导航（仅在组件库时显示）
 * 保留增强的解决方案平台内容（15个业务场景）
 */

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// 导入现有组件
import { FloatingAIButton } from '../../src/components/workbench/ai-assistant/floating-ai-button'
import { WorkbenchMonacoEditor } from '../../src/components/workbench/editor/workbench-monaco-editor'
import WorkbenchNavigation from './components/workbench-navigation'

// 类型定义 - 匹配新的导航架构
type WorkMode = 'workbench' | 'component-library'
type ActiveMode = 'solution' | 'devtools' | 'components' | 'editor' | 'theme' | 'ai-assistant'

interface BusinessScenario {
  id: string
  name: string
  description: string
  icon: string
  category: string
  difficulty: string
  features: string[]
  technologies: string[]
  isRecommended?: boolean
  isPopular?: boolean
  isNew?: boolean
}

interface ComponentSubcategory {
  id: string
  name: string
  description: string
  count: number
  icon?: string
}

interface ComponentCategory {
  id: string
  name: string
  icon: string
  description: string
  count: number
  color: string
  subcategories?: ComponentSubcategory[]
}

interface ComponentExample {
  id: string
  name: string
  description: string
  category: string
  subcategory: string
  count: number
  props?: string[]
  usage?: string
}

interface ThemeRecipe {
  id: string
  name: string
  description: string
  mode: string
  hue: string
  preview: string
}

// 增强的业务场景数据 - 15个企业级解决方案
const mockScenarios: BusinessScenario[] = [
  {
    id: 'dashboard',
    name: '智能仪表盘',
    icon: '📈',
    category: 'analytics',
    difficulty: '中级',
    description: '实时数据监控、KPI展示、智能分析',
    features: ['实时数据同步', '多维度数据展示', '智能预警系统', '自定义报表'],
    technologies: ['React 19', 'TypeScript', 'D3.js', 'WebSocket'],
    isRecommended: true,
    isPopular: true
  },
  {
    id: 'ecommerce',
    name: '电商管理平台',
    icon: '🛒',
    category: 'commerce',
    difficulty: '高级',
    description: '商品管理、订单处理、支付集成',
    features: ['商品管理', '购物车系统', '支付集成', '订单管理'],
    technologies: ['React 19', 'Node.js', 'Stripe API', 'PostgreSQL'],
    isPopular: true
  },
  {
    id: 'crm',
    name: 'CRM客户关系管理',
    icon: '👥',
    category: 'business',
    difficulty: '高级',
    description: '客户信息、销售管道、营销自动化',
    features: ['客户管理', '销售管道', '营销自动化', '数据分析'],
    technologies: ['React 19', 'TypeScript', 'HubSpot API', 'MongoDB'],
    isRecommended: true
  },
  {
    id: 'healthcare',
    name: '医疗健康管理',
    icon: '🏥',
    category: 'health',
    difficulty: '专家级',
    description: '病历管理、预约系统、健康监测',
    features: ['电子病历', '预约管理', '健康监测', '报告生成'],
    technologies: ['React 19', 'HIPAA合规', 'HL7/FHIR', '云存储'],
    isNew: true
  },
  {
    id: 'education',
    name: '教育管理平台',
    icon: '📚',
    category: 'education',
    difficulty: '中级',
    description: '课程管理、学生信息、在线考试',
    features: ['课程管理', '学生信息系统', '在线考试', '成绩分析'],
    technologies: ['React 19', 'LTI集成', 'WebRTC', 'AWS'],
    isRecommended: true
  },
  {
    id: 'finance',
    name: '财务管理系统',
    icon: '💰',
    category: 'finance',
    difficulty: '专家级',
    description: '账务处理、报表生成、预算管理',
    features: ['账务处理', '财务报表', '预算管理', '审计追踪'],
    technologies: ['React 19', 'QuickBooks API', 'Plaid', '加密存储']
  },
  {
    id: 'data-analytics',
    name: '数据分析平台',
    icon: '📊',
    category: 'analytics',
    difficulty: '专家级',
    description: '数据挖掘、可视化、预测分析',
    features: ['数据挖掘', '可视化图表', '预测分析', '机器学习'],
    technologies: ['React 19', 'Python', 'TensorFlow.js', 'Apache Spark']
  },
  {
    id: 'project-management',
    name: '项目管理工具',
    icon: '🎯',
    category: 'business',
    difficulty: '中级',
    description: '任务分配、进度跟踪、团队协作',
    features: ['任务管理', '甘特图', '团队协作', '时间跟踪'],
    technologies: ['React 19', 'TypeScript', 'WebSockets', 'PostgreSQL']
  },
  {
    id: 'social-media',
    name: '社交媒体管理',
    icon: '📱',
    category: 'social',
    difficulty: '中级',
    description: '内容发布、用户互动、数据分析',
    features: ['内容管理', '多平台发布', '社交互动', '效果分析'],
    technologies: ['React 19', '社交API', '内容审核', 'Redis缓存']
  },
  {
    id: 'inventory',
    name: '库存管理系统',
    icon: '🏪',
    category: 'commerce',
    difficulty: '中级',
    description: '库存跟踪、采购管理、供应商协作',
    features: ['库存管理', '采购系统', '供应商管理', '条码扫描'],
    technologies: ['React 19', '条码API', 'ERP集成', '云数据库']
  },
  {
    id: 'email-marketing',
    name: '邮件营销平台',
    icon: '📧',
    category: 'marketing',
    difficulty: '中级',
    description: '邮件模板、营销活动、效果分析',
    features: ['邮件模板', '自动化营销', 'A/B测试', '效果分析'],
    technologies: ['React 19', 'SendGrid API', 'Mailchimp', '分析工具']
  },
  {
    id: 'cms',
    name: '内容管理系统',
    icon: '🎨',
    category: 'content',
    difficulty: '中级',
    description: '文章编辑、媒体管理、发布控制',
    features: ['内容编辑', '媒体管理', '版本控制', 'SEO优化'],
    technologies: ['React 19', '富文本编辑器', 'CDN', '搜索引擎优化']
  },
  {
    id: 'security',
    name: '网络安全监控',
    icon: '🛡️',
    category: 'security',
    difficulty: '专家级',
    description: '威胁检测、漏洞扫描、安全报告',
    features: ['威胁检测', '漏洞扫描', '安全报告', '实时监控'],
    technologies: ['React 19', '安全API', 'SIEM集成', '加密通信']
  },
  {
    id: 'cross-border',
    name: '跨境电商平台',
    icon: '🌐',
    category: 'commerce',
    difficulty: '专家级',
    description: '多语言支持、国际支付、物流管理',
    features: ['多语言支持', '国际支付', '物流管理', '关税计算'],
    technologies: ['React 19', 'i18n', '国际支付网关', '物流API']
  },
  {
    id: 'ai-customer-service',
    name: 'AI智能客服',
    icon: '🤖',
    category: 'ai',
    difficulty: '专家级',
    description: '自然语言处理、智能问答、情感分析',
    features: ['智能问答', '情感分析', '多语言支持', '学习优化'],
    technologies: ['React 19', 'OpenAI API', 'NLP', '机器学习']
  }
]

// 基于96个真实组件的分类数据 - 按使用重度排序（最常用的在前）
const componentCategories: ComponentCategory[] = [
  {
    id: 'forms',
    name: '表单组件',
    icon: '📋',
    description: '智能表单、输入组件、验证器、字段管理',
    count: 18,
    color: 'cyan',
    subcategories: [
      { id: 'input', name: '输入组件', description: '文本、密码、数字输入', count: 5 },
      { id: 'select', name: '选择组件', description: '下拉选择、多选、单选', count: 4 },
      { id: 'validation', name: '验证器', description: '表单验证和错误处理', count: 3 },
      { id: 'form-container', name: '表单容器', description: '表单布局和管理', count: 3 },
      { id: 'date-time', name: '日期时间', description: '日期选择器、时间选择器', count: 3 }
    ]
  },
  {
    id: 'layout',
    name: '布局组件',
    icon: '📐',
    description: '智能布局、响应式栅格、容器组件等',
    count: 15,
    color: 'emerald',
    subcategories: [
      { id: 'grid', name: '栅格系统', description: '响应式栅格布局', count: 4 },
      { id: 'container', name: '容器组件', description: '灵活容器布局', count: 3 },
      { id: 'flex', name: '弹性布局', description: 'Flexbox布局组件', count: 3 },
      { id: 'responsive', name: '响应式工具', description: '断点和响应式管理', count: 3 },
      { id: 'spacing', name: '间距工具', description: '内外边距管理', count: 2 }
    ]
  },
  {
    id: 'components',
    name: '组件管理',
    icon: '📦',
    description: 'ComponentRegistry、ComponentScanner等组件管理工具',
    count: 12,
    color: 'green',
    subcategories: [
      { id: 'registry', name: '注册系统', description: '组件注册和管理', count: 4 },
      { id: 'scanner', name: '扫描器', description: '组件发现和扫描', count: 3 },
      { id: 'loader', name: '加载器', description: '动态加载组件', count: 3 },
      { id: 'cache', name: '缓存系统', description: '组件缓存管理', count: 2 }
    ]
  },
  {
    id: 'feedback',
    name: '反馈组件',
    icon: '💬',
    description: '提示、通知、加载状态、进度指示器',
    count: 10,
    color: 'pink',
    subcategories: [
      { id: 'alert', name: '提示框', description: '警告、信息、错误提示', count: 3 },
      { id: 'toast', name: '通知', description: '轻量级通知提示', count: 2 },
      { id: 'loading', name: '加载状态', description: '加载动画和进度', count: 2 },
      { id: 'progress', name: '进度条', description: '进度指示器', count: 2 },
      { id: 'badge', name: '徽章', description: '状态徽章和标签', count: 1 }
    ]
  },
  {
    id: 'overlays',
    name: '覆盖层组件',
    icon: '🎭',
    description: '模态框、抽屉、悬浮层、弹出组件',
    count: 9,
    color: 'teal',
    subcategories: [
      { id: 'modal', name: '模态框', description: '对话框和确认框', count: 3 },
      { id: 'drawer', name: '抽屉', description: '侧边抽屉面板', count: 2 },
      { id: 'tooltip', name: '提示框', description: '悬浮提示信息', count: 2 },
      { id: 'popover', name: '弹出层', description: '复杂弹出内容', count: 2 }
    ]
  },
  {
    id: 'charts',
    name: '图表组件',
    icon: '📊',
    description: '数据可视化、图表、仪表盘组件',
    count: 8,
    color: 'violet',
    subcategories: [
      { id: 'basic-charts', name: '基础图表', description: '柱状图、折线图、饼图', count: 3 },
      { id: 'advanced-charts', name: '高级图表', description: '散点图、热力图、雷达图', count: 2 },
      { id: 'dashboard', name: '仪表盘', description: '数据仪表盘组件', count: 2 },
      { id: 'data-grid', name: '数据表格', description: '高级数据表格', count: 1 }
    ]
  },
  {
    id: 'editor',
    name: '编辑器',
    icon: '✏️',
    description: 'Monaco编辑器系列、AI助手、代码生成器',
    count: 8,
    color: 'purple',
    subcategories: [
      { id: 'monaco', name: 'Monaco编辑器', description: 'VS Code编辑器集成', count: 3 },
      { id: 'ai-assistant', name: 'AI助手', description: '智能编程助手', count: 2 },
      { id: 'code-generator', name: '代码生成器', description: '自动代码生成', count: 2 },
      { id: 'syntax-highlighter', name: '语法高亮', description: '代码着色器', count: 1 }
    ]
  },
  {
    id: 'navigation',
    name: '导航组件',
    icon: '🧭',
    description: '智能面包屑、分页、标签页、菜单组件',
    count: 7,
    color: 'indigo',
    subcategories: [
      { id: 'breadcrumb', name: '面包屑', description: '路径导航面包屑', count: 1 },
      { id: 'pagination', name: '分页器', description: '数据分页导航', count: 2 },
      { id: 'tabs', name: '标签页', description: '标签页切换', count: 2 },
      { id: 'menu', name: '菜单', description: '下拉菜单和导航菜单', count: 2 }
    ]
  },
  {
    id: 'media',
    name: '媒体组件',
    icon: '🖼️',
    description: '图片、视频、图标、媒体展示组件',
    count: 6,
    color: 'orange',
    subcategories: [
      { id: 'image', name: '图片组件', description: '图片展示和处理', count: 2 },
      { id: 'video', name: '视频组件', description: '视频播放器', count: 1 },
      { id: 'icon', name: '图标', description: '图标库和图标组件', count: 2 },
      { id: 'avatar', name: '头像', description: '用户头像组件', count: 1 }
    ]
  },
  {
    id: 'core',
    name: '核心组件',
    icon: '⚡',
    description: 'WorkbenchV2、智能面包屑等核心功能组件',
    count: 3,
    color: 'blue',
    subcategories: [
      { id: 'workbench', name: '工作台引擎', description: 'Workbench核心架构', count: 1 },
      { id: 'breadcrumb', name: '智能导航', description: '面包屑和导航系统', count: 1 },
      { id: 'core-utilities', name: '核心工具', description: '基础工具类组件', count: 1 }
    ]
  }
]

// 完整的组件数据 - 按分类和子分类组织
const components: ComponentExample[] = [
  // 表单组件 - 输入组件
  { id: '1', name: 'TextInput', description: '文本输入框', category: 'forms', subcategory: 'input', count: 8, props: ['placeholder', 'value', 'onChange', 'disabled'], usage: '基础文本输入，支持验证和格式化' },
  { id: '2', name: 'PasswordInput', description: '密码输入框', category: 'forms', subcategory: 'input', count: 4, props: ['placeholder', 'showPassword', 'strength'], usage: '密码输入，支持强度检测和显示切换' },
  { id: '3', name: 'NumberInput', description: '数字输入框', category: 'forms', subcategory: 'input', count: 5, props: ['min', 'max', 'step', 'precision'], usage: '数字输入，支持范围限制和精度控制' },
  { id: '4', name: 'EmailInput', description: '邮箱输入框', category: 'forms', subcategory: 'input', count: 3, props: ['validation', 'domains'], usage: '邮箱输入，自动验证格式' },
  { id: '5', name: 'PhoneInput', description: '手机号输入框', category: 'forms', subcategory: 'input', count: 3, props: ['countryCode', 'format'], usage: '手机号输入，支持国际格式' },

  // 表单组件 - 选择组件
  { id: '6', name: 'Select', description: '下拉选择器', category: 'forms', subcategory: 'select', count: 6, props: ['options', 'multiple', 'searchable'], usage: '单选/多选下拉框' },
  { id: '7', name: 'Checkbox', description: '复选框', category: 'forms', subcategory: 'select', count: 4, props: ['checked', 'indeterminate', 'disabled'], usage: '多选框组件' },
  { id: '8', name: 'Radio', description: '单选框', category: 'forms', subcategory: 'select', count: 4, props: ['options', 'selected', 'disabled'], usage: '单选按钮组' },
  { id: '9', name: 'Switch', description: '开关切换', category: 'forms', subcategory: 'select', count: 3, props: ['checked', 'disabled', 'size'], usage: '开关式切换控件' },

  // 表单组件 - 验证器
  { id: '10', name: 'FormValidator', description: '表单验证器', category: 'forms', subcategory: 'validation', count: 5, props: ['rules', 'errors', 'validate'], usage: '表单验证和错误提示' },
  { id: '11', name: 'FieldError', description: '字段错误提示', category: 'forms', subcategory: 'validation', count: 3, props: ['message', 'type'], usage: '表单字段错误显示' },

  // 布局组件 - 栅格系统
  { id: '12', name: 'Grid', description: '栅格布局', category: 'layout', subcategory: 'grid', count: 6, props: ['columns', 'gap', 'responsive'], usage: '响应式栅格布局系统' },
  { id: '13', name: 'Row', description: '行容器', category: 'layout', subcategory: 'grid', count: 4, props: ['gutter', 'align', 'justify'], usage: '栅格行容器' },
  { id: '14', name: 'Col', description: '列容器', category: 'layout', subcategory: 'grid', count: 4, props: ['span', 'offset', 'responsive'], usage: '栅格列容器' },

  // 布局组件 - 容器组件
  { id: '15', name: 'Container', description: '容器组件', category: 'layout', subcategory: 'container', count: 5, props: ['fluid', 'maxWidth', 'padding'], usage: '响应式内容容器' },
  { id: '16', name: 'Section', description: '区块容器', category: 'layout', subcategory: 'container', count: 3, props: ['spacing', 'divider'], usage: '页面区块容器' },

  // 布局组件 - 弹性布局
  { id: '17', name: 'Flex', description: '弹性布局', category: 'layout', subcategory: 'flex', count: 6, props: ['direction', 'align', 'justify', 'wrap'], usage: 'Flexbox布局容器' },
  { id: '18', name: 'Spacer', description: '间距组件', category: 'layout', subcategory: 'flex', count: 3, props: ['size', 'flex'], usage: '弹性间距占位符' },

  // 反馈组件 - 提示框
  { id: '19', name: 'Alert', description: '警告提示', category: 'feedback', subcategory: 'alert', count: 5, props: ['type', 'message', 'closable'], usage: '信息提示和警告显示' },
  { id: '20', name: 'Notification', description: '通知提醒', category: 'feedback', subcategory: 'alert', count: 4, props: ['type', 'placement', 'duration'], usage: '全局通知提醒' },

  // 反馈组件 - 通知
  { id: '21', name: 'Toast', description: '轻量提示', category: 'feedback', subcategory: 'toast', count: 3, props: ['message', 'type', 'position'], usage: '轻量级消息提示' },

  // 反馈组件 - 加载状态
  { id: '22', name: 'Spinner', description: '加载动画', category: 'feedback', subcategory: 'loading', count: 4, props: ['size', 'color', 'type'], usage: '加载状态动画' },
  { id: '23', name: 'Skeleton', description: '骨架屏', category: 'feedback', subcategory: 'loading', count: 3, props: ['lines', 'animated'], usage: '内容加载占位符' },

  // 反馈组件 - 进度条
  { id: '24', name: 'ProgressBar', description: '进度条', category: 'feedback', subcategory: 'progress', count: 4, props: ['value', 'max', 'color', 'size'], usage: '线性进度条' },
  { id: '25', name: 'ProgressCircle', description: '环形进度', category: 'feedback', subcategory: 'progress', count: 3, props: ['value', 'size', 'stroke'], usage: '圆形进度指示器' },

  // 覆盖层组件 - 模态框
  { id: '26', name: 'Modal', description: '模态对话框', category: 'overlays', subcategory: 'modal', count: 6, props: ['visible', 'title', 'footer', 'size'], usage: '模态对话框容器' },
  { id: '27', name: 'Dialog', description: '确认对话框', category: 'overlays', subcategory: 'modal', count: 3, props: ['title', 'content', 'onConfirm'], usage: '确认操作对话框' },

  // 覆盖层组件 - 抽屉
  { id: '28', name: 'Drawer', description: '抽屉面板', category: 'overlays', subcategory: 'drawer', count: 4, props: ['position', 'visible', 'title'], usage: '侧边抽屉面板' },

  // 覆盖层组件 - 提示框
  { id: '29', name: 'Tooltip', description: '悬浮提示', category: 'overlays', subcategory: 'tooltip', count: 5, props: ['content', 'position', 'trigger'], usage: '鼠标悬浮提示' },
  { id: '30', name: 'Popover', description: '弹出卡片', category: 'overlays', subcategory: 'popover', count: 4, props: ['content', 'trigger', 'placement'], usage: '复杂内容弹出层' },

  // 图表组件 - 基础图表
  { id: '31', name: 'BarChart', description: '柱状图', category: 'charts', subcategory: 'basic-charts', count: 4, props: ['data', 'xAxis', 'yAxis', 'colors'], usage: '柱状数据可视化' },
  { id: '32', name: 'LineChart', description: '折线图', category: 'charts', subcategory: 'basic-charts', count: 4, props: ['data', 'xAxis', 'yAxis', 'smooth'], usage: '趋势数据可视化' },
  { id: '33', name: 'PieChart', description: '饼图', category: 'charts', subcategory: 'basic-charts', count: 3, props: ['data', 'colors', 'labels'], usage: '占比数据可视化' },

  // 图表组件 - 仪表盘
  { id: '34', name: 'Dashboard', description: '数据仪表盘', category: 'charts', subcategory: 'dashboard', count: 3, props: ['widgets', 'layout', 'refresh'], usage: '数据仪表盘容器' },
  { id: '35', name: 'Widget', description: '仪表盘组件', category: 'charts', subcategory: 'dashboard', count: 5, props: ['type', 'data', 'title'], usage: '仪表盘小部件' },

  // 编辑器组件
  { id: '36', name: 'CodeEditor', description: '代码编辑器', category: 'editor', subcategory: 'monaco', count: 4, props: ['language', 'theme', 'value', 'onChange'], usage: 'Monaco代码编辑器' },
  { id: '37', name: 'AIAssistant', description: 'AI编程助手', category: 'editor', subcategory: 'ai-assistant', count: 3, props: ['prompt', 'response', 'onGenerate'], usage: '智能代码生成助手' },

  // 导航组件
  { id: '38', name: 'Breadcrumb', description: '面包屑导航', category: 'navigation', subcategory: 'breadcrumb', count: 3, props: ['items', 'separator', 'onClick'], usage: '页面路径导航' },
  { id: '39', name: 'Pagination', description: '分页器', category: 'navigation', subcategory: 'pagination', count: 4, props: ['current', 'total', 'onChange'], usage: '数据分页导航' },
  { id: '40', name: 'Tabs', description: '标签页', category: 'navigation', subcategory: 'tabs', count: 5, props: ['tabs', 'active', 'onChange'], usage: '标签页切换' },
  { id: '41', name: 'Menu', description: '导航菜单', category: 'navigation', subcategory: 'menu', count: 4, props: ['items', 'onClick', 'horizontal'], usage: '导航菜单组件' },

  // 媒体组件
  { id: '42', name: 'Image', description: '图片组件', category: 'media', subcategory: 'image', count: 4, props: ['src', 'alt', 'lazy', 'fallback'], usage: '响应式图片显示' },
  { id: '43', name: 'VideoPlayer', description: '视频播放器', category: 'media', subcategory: 'video', count: 2, props: ['src', 'controls', 'autoplay'], usage: '视频播放组件' },
  { id: '44', name: 'Icon', description: '图标组件', category: 'media', subcategory: 'icon', count: 8, props: ['name', 'size', 'color'], usage: '图标库组件' },
  { id: '45', name: 'Avatar', description: '头像组件', category: 'media', subcategory: 'avatar', count: 3, props: ['src', 'name', 'size'], usage: '用户头像显示' },

  // 核心组件
  { id: '46', name: 'WorkbenchV2', description: '工作台核心', category: 'core', subcategory: 'workbench', count: 1, props: ['mode', 'config'], usage: '工作台核心架构' },
  { id: '47', name: 'SmartBreadcrumb', description: '智能导航', category: 'core', subcategory: 'breadcrumb', count: 1, props: ['routes', 'auto'], usage: '智能面包屑导航' },
  { id: '48', name: 'ComponentRegistry', description: '组件注册器', category: 'components', subcategory: 'registry', count: 2, props: ['components', 'register'], usage: '组件注册管理' }
]

const themeRecipes: ThemeRecipe[] = [
  { id: '1', name: '现代简约', description: '简洁清爽的现代风格', mode: 'light', hue: 'blue', preview: 'modern' },
  { id: '2', name: '暗夜模式', description: '适合夜间使用的深色主题', mode: 'dark', hue: 'purple', preview: 'dark' },
  { id: '3', name: '企业蓝', description: '专业的企业级配色', mode: 'light', hue: 'indigo', preview: 'corporate' },
  { id: '4', name: '自然绿', description: '清新的自然绿色调', mode: 'light', hue: 'green', preview: 'nature' }
]

export default function WorkbenchV2Integrated() {
  // 新的导航架构状态
  const [workMode, setWorkMode] = useState<WorkMode>('workbench')
  const [activeMode, setActiveMode] = useState<ActiveMode>('solution')
  const [selectedCategory, setSelectedCategory] = useState<string>('forms')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('input')
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['forms']))

  // 内容状态
  const [selectedScenario, setSelectedScenario] = useState<BusinessScenario | null>(null)
  const [selectedComponent, setSelectedComponent] = useState<ComponentExample | null>(null)
  const [selectedRecipe, setSelectedRecipe] = useState<ThemeRecipe>(themeRecipes[0])

  // 组件预览状态管理
  const [previewProps, setPreviewProps] = useState<Record<string, any>>({})
  const [isInteractiveMode, setIsInteractiveMode] = useState<boolean>(false)
  const [filteredScenarios, setFilteredScenarios] = useState<BusinessScenario[]>(mockScenarios)
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('all')

  // Monaco编辑器配置
  useEffect(() => {
    // 配置Monaco编辑器环境
    if (typeof window !== 'undefined') {
      (window as any).MonacoEnvironment = {
        getWorkerUrl: (moduleId: string, label: string) => {
          if (label === 'json') {
            return '/_next/static/chunks/monaco-editor/esm/vs/language/json/json.worker.js'
          }
          if (label === 'css' || label === 'scss' || label === 'less') {
            return '/_next/static/chunks/monaco-editor/esm/vs/language/css/css.worker.js'
          }
          if (label === 'html' || label === 'handlebars' || label === 'razor') {
            return '/_next/static/chunks/monaco-editor/esm/vs/language/html/html.worker.js'
          }
          if (label === 'typescript' || label === 'javascript') {
            return '/_next/static/chunks/monaco-editor/esm/vs/language/typescript/ts.worker.js'
          }
          return '/_next/static/chunks/monaco-editor/esm/vs/editor/editor.worker.js'
        }
      }
    }
  }, [])

  // 计算总组件数
  const totalComponentCount = componentCategories.reduce((sum, cat) => sum + cat.count, 0)

  // 搜索和筛选功能
  const filterScenarios = (search: string, difficulty: string) => {
    let filtered = mockScenarios

    // 按搜索词筛选
    if (search.trim()) {
      filtered = filtered.filter(scenario =>
        scenario.name.toLowerCase().includes(search.toLowerCase()) ||
        scenario.description.toLowerCase().includes(search.toLowerCase()) ||
        scenario.features.some(feature => feature.toLowerCase().includes(search.toLowerCase()))
      )
    }

    // 按难度筛选
    if (difficulty !== 'all') {
      filtered = filtered.filter(scenario => scenario.difficulty === difficulty)
    }

    setFilteredScenarios(filtered)
  }

  // 查看解决方案详情
  const handleViewScenarioDetails = (scenario: BusinessScenario) => {
    setSelectedScenario(scenario)
    // 可以在这里添加显示详情的逻辑，比如打开模态框或跳转到详情页
    console.log('查看详情:', scenario.name)
  }

  // 使用模板
  const handleUseTemplate = (scenario: BusinessScenario) => {
    // 可以在这里添加使用模板的逻辑，比如创建新项目或下载模板
    console.log('使用模板:', scenario.name)
    alert(`正在准备 "${scenario.name}" 模板，即将开始下载...`)
  }

  // 子分类展开/收起
  const toggleCategoryExpansion = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories)
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId)
    } else {
      newExpanded.add(categoryId)
    }
    setExpandedCategories(newExpanded)
  }

  // 选择子分类
  const handleSubcategorySelect = (categoryId: string, subcategoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory(subcategoryId)
  }

  // 根据分类和子分类过滤组件
  const getFilteredComponents = () => {
    if (!selectedCategory) return []

    return components.filter(component => {
      // 如果有选中的子分类，则按子分类过滤
      if (selectedSubcategory) {
        return component.category === selectedCategory && component.subcategory === selectedSubcategory
      }
      // 否则只按主分类过滤
      return component.category === selectedCategory
    })
  }

  // 获取当前选中分类的信息
  const getCurrentCategoryInfo = () => {
    return componentCategories.find(cat => cat.id === selectedCategory)
  }

  // 获取当前选中子分类的信息
  const getCurrentSubcategoryInfo = () => {
    const category = getCurrentCategoryInfo()
    if (!category || !category.subcategories) return null
    return category.subcategories.find(sub => sub.id === selectedSubcategory)
  }

  // 获取属性默认值
  const getPropDefault = (prop: string): string => {
    const defaultMap: Record<string, string> = {
      'placeholder': '""',
      'value': 'undefined',
      'onChange': 'undefined',
      'disabled': 'false',
      'showPassword': 'false',
      'strength': 'true',
      'min': 'undefined',
      'max': 'undefined',
      'step': '1',
      'precision': 'undefined',
      'validation': 'undefined',
      'domains': '[]',
      'countryCode': '"+86"',
      'format': 'international',
      'options': '[]',
      'multiple': 'false',
      'searchable': 'false',
      'checked': 'false',
      'indeterminate': 'false',
      'selected': 'undefined',
      'size': '"md"',
      'columns': '12',
      'gap': '"md"',
      'responsive': '{}',
      'gutter': '"md"',
      'align': '"start"',
      'justify': '"start"',
      'span': 'undefined',
      'offset': '0'
    }
    return defaultMap[prop] || 'undefined'
  }

  // 组件预览相关函数
  const initializePreviewProps = (component: ComponentExample) => {
    const props: Record<string, any> = {}
    if (component.props) {
      component.props.forEach(prop => {
        props[prop] = getPropDefault(prop) === 'undefined' ? undefined :
                      getPropDefault(prop) === 'false' ? false :
                      getPropDefault(prop) === 'true' ? true :
                      getPropDefault(prop).startsWith('"') ? getPropDefault(prop).slice(1, -1) :
                      getPropDefault(prop)
      })
    }
    setPreviewProps(props)
  }

  const updatePreviewProp = (prop: string, value: any) => {
    setPreviewProps(prev => ({
      ...prev,
      [prop]: value
    }))
  }

  const resetPreviewProps = () => {
    if (selectedComponent) {
      initializePreviewProps(selectedComponent)
    }
  }

  // 当选中组件变化时，初始化预览属性
  useEffect(() => {
    if (selectedComponent) {
      initializePreviewProps(selectedComponent)
      setIsInteractiveMode(false)
    }
  }, [selectedComponent])

  // 模拟组件渲染函数
  const renderComponentPreview = (component: ComponentExample) => {
    const { name } = component
    const props = previewProps

    switch (name) {
      case 'TextInput':
        return (
          <div className="w-full">
            <input
              type="text"
              placeholder={props.placeholder || '请输入文本...'}
              value={props.value || ''}
              onChange={(e) => updatePreviewProp('value', e.target.value)}
              disabled={props.disabled || false}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        )

      case 'PasswordInput':
        return (
          <div className="w-full">
            <input
              type="password"
              placeholder={props.placeholder || '请输入密码...'}
              value={props.value || ''}
              onChange={(e) => updatePreviewProp('value', e.target.value)}
              disabled={props.disabled || false}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
            {props.strength && (
              <div className="mt-2">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 transition-all duration-300"
                    style={{ width: `${(props.value || '').length * 10}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  密码强度: {(props.value || '').length < 6 ? '弱' : (props.value || '').length < 10 ? '中' : '强'}
                </p>
              </div>
            )}
          </div>
        )

      case 'NumberInput':
        return (
          <div className="w-full">
            <input
              type="number"
              placeholder={props.placeholder || '请输入数字...'}
              value={props.value || ''}
              onChange={(e) => updatePreviewProp('value', parseFloat(e.target.value) || undefined)}
              min={props.min}
              max={props.max}
              step={props.step || 1}
              disabled={props.disabled || false}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            />
          </div>
        )

      case 'Select':
        return (
          <div className="w-full">
            <select
              value={props.value || ''}
              onChange={(e) => updatePreviewProp('value', e.target.value)}
              disabled={props.disabled || false}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="">请选择...</option>
              {props.options?.map((option: string, index: number) => (
                <option key={index} value={option}>{option}</option>
              )) || <option value="选项1">选项1</option>}
            </select>
          </div>
        )

      case 'Checkbox':
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={props.checked || false}
              onChange={(e) => updatePreviewProp('checked', e.target.checked)}
              disabled={props.disabled || false}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">同意条款</span>
          </div>
        )

      case 'Radio':
        return (
          <div className="space-y-2">
            {props.options?.map((option: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="radio-group"
                  value={option}
                  checked={props.selected === option}
                  onChange={() => updatePreviewProp('selected', option)}
                  disabled={props.disabled || false}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
              </div>
            )) || ['选项1', '选项2', '选项3'].map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="radio-group"
                  value={option}
                  checked={props.selected === option}
                  onChange={() => updatePreviewProp('selected', option)}
                  disabled={props.disabled || false}
                  className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">{option}</span>
              </div>
            ))}
          </div>
        )

      case 'Switch':
        return (
          <button
            onClick={() => updatePreviewProp('checked', !props.checked)}
            disabled={props.disabled || false}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              props.checked ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
            } ${props.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                props.checked ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        )

      default:
        return (
          <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
            <div className="text-gray-500 dark:text-gray-400">
              <div className="text-2xl mb-2">🧩</div>
              <div className="font-medium">{name}</div>
              <div className="text-sm mt-1">交互预览开发中...</div>
            </div>
          </div>
        )
    }
  }

  // Props 相关辅助函数
  const getPropType = (prop: string): string => {
    const typeMap: Record<string, string> = {
      'placeholder': 'string',
      'value': 'string | number',
      'onChange': 'function',
      'disabled': 'boolean',
      'showPassword': 'boolean',
      'strength': 'boolean',
      'min': 'number',
      'max': 'number',
      'step': 'number',
      'precision': 'number',
      'validation': 'function',
      'domains': 'string[]',
      'countryCode': 'string',
      'format': 'string',
      'options': 'array',
      'multiple': 'boolean',
      'searchable': 'boolean',
      'checked': 'boolean',
      'indeterminate': 'boolean',
      'selected': 'any',
      'size': 'string',
      'columns': 'number',
      'gap': 'string',
      'responsive': 'object',
      'gutter': 'number | string',
      'align': 'string',
      'justify': 'string',
      'span': 'number',
      'offset': 'number'
    }
    return typeMap[prop] || 'any'
  }

  const getPropDescription = (prop: string): string => {
    const descMap: Record<string, string> = {
      'placeholder': '输入框占位符文本',
      'value': '输入框的值',
      'onChange': '值变化时的回调函数',
      'disabled': '是否禁用输入框',
      'showPassword': '是否显示密码',
      'strength': '是否启用密码强度检测',
      'min': '最小值限制',
      'max': '最大值限制',
      'step': '步长值',
      'precision': '小数精度',
      'validation': '验证函数',
      'domains': '允许的邮箱域名列表',
      'countryCode': '默认国家代码',
      'format': '号码格式类型',
      'options': '选项数据数组',
      'multiple': '是否支持多选',
      'searchable': '是否支持搜索',
      'checked': '是否选中',
      'indeterminate': '是否为不确定状态',
      'selected': '选中的值',
      'size': '组件尺寸',
      'columns': '栅格列数',
      'gap': '栅格间距',
      'responsive': '响应式断点配置',
      'gutter': '栅格间隔',
      'align': '垂直对齐方式',
      'justify': '水平对齐方式',
      'span': '栅格占据列数',
      'offset': '栅格偏移列数'
    }
    return descMap[prop] || '属性描述'
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* 主要内容区域 - 左侧导航布局 */}
      <main className="flex h-[calc(100vh-4rem)]">
        {/* 左侧导航栏 - 使用新的导航组件 */}
        <WorkbenchNavigation
          workMode={workMode}
          activeMode={activeMode}
          onWorkModeChange={setWorkMode}
          onActiveModeChange={setActiveMode}
          totalComponentCount={totalComponentCount}
          solutionCount={mockScenarios.length}
          themeRecipeCount={themeRecipes.length}
          componentCategories={componentCategories}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          expandedCategories={expandedCategories}
          onCategoryChange={setSelectedCategory}
          onSubcategoryChange={setSelectedSubcategory}
          onToggleCategoryExpansion={toggleCategoryExpansion}
          onSubcategorySelect={handleSubcategorySelect}
        />

        {/* 右侧内容区域 */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <AnimatePresence mode="wait">
              {activeMode === 'solution' && (
                <motion.div
                  key="solution"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {(() => {
                    const stats = {
                      total: mockScenarios.length,
                      beginner: mockScenarios.filter(s => s.difficulty === '初级').length,
                      intermediate: mockScenarios.filter(s => s.difficulty === '中级').length,
                      advanced: mockScenarios.filter(s => s.difficulty === '高级').length,
                      expert: mockScenarios.filter(s => s.difficulty === '专家级').length
                    }

                    return (
                      <div className="space-y-6">
                        {/* 标题和统计 */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                            🚀 解决方案平台 ({mockScenarios.length}个业务场景)
                          </h2>
                          <p className="text-gray-600 dark:text-gray-400 mb-6">
                            企业级业务场景解决方案模板，覆盖各行各业，基于现代技术栈构建
                          </p>

                          {/* 统计卡片 */}
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
                              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.total}</div>
                              <div className="text-sm text-blue-600 dark:text-blue-400">总方案数</div>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-700">
                              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.beginner}</div>
                              <div className="text-sm text-green-600 dark:text-green-400">初级</div>
                            </div>
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
                              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.intermediate}</div>
                              <div className="text-sm text-yellow-600 dark:text-yellow-400">中级</div>
                            </div>
                            <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-700">
                              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.advanced}</div>
                              <div className="text-sm text-orange-600 dark:text-orange-400">高级</div>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-700">
                              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.expert}</div>
                              <div className="text-sm text-red-600 dark:text-red-400">专家级</div>
                            </div>
                          </div>

                          {/* 快速过滤 */}
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => filterScenarios(searchTerm, 'all')}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                            >
                              全部 ({stats.total})
                            </button>
                            <button
                              onClick={() => filterScenarios(searchTerm, '初级')}
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                            >
                              初级 ({stats.beginner})
                            </button>
                            <button
                              onClick={() => filterScenarios(searchTerm, '中级')}
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                            >
                              中级 ({stats.intermediate})
                            </button>
                            <button
                              onClick={() => filterScenarios(searchTerm, '高级')}
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                            >
                              高级 ({stats.advanced})
                            </button>
                            <button
                              onClick={() => filterScenarios(searchTerm, '专家级')}
                              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm"
                            >
                              专家级 ({stats.expert})
                            </button>
                          </div>
                        </div>

                        {/* 搜索和筛选栏 */}
                        <div className="mb-6 flex flex-col sm:flex-row gap-4">
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="搜索解决方案..."
                              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                              value={searchTerm}
                              onChange={(e) => {
                                setSearchTerm(e.target.value)
                                filterScenarios(e.target.value, selectedDifficultyFilter)
                              }}
                            />
                          </div>
                          <select
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            value={selectedDifficultyFilter}
                            onChange={(e) => {
                              setSelectedDifficultyFilter(e.target.value)
                              filterScenarios(searchTerm, e.target.value)
                            }}
                          >
                            <option value="all">所有难度</option>
                            <option value="初级">初级</option>
                            <option value="中级">中级</option>
                            <option value="高级">高级</option>
                            <option value="专家">专家</option>
                          </select>
                        </div>

                        {/* 解决方案网格 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {filteredScenarios.map((scenario) => (
                            <motion.div
                              key={scenario.id}
                              whileHover={{ scale: 1.02 }}
                              className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                                selectedScenario?.id === scenario.id
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                  : scenario.isRecommended
                                  ? 'border-red-300 dark:border-red-700 hover:border-red-500 shadow-red-100 dark:shadow-red-900/20'
                                  : scenario.isPopular
                                  ? 'border-orange-300 dark:border-orange-700 hover:border-orange-500 shadow-orange-100 dark:shadow-orange-900/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'
                              } ${scenario.isRecommended || scenario.isPopular ? 'shadow-lg' : 'shadow-md'}`}
                              onClick={() => setSelectedScenario(scenario)}
                            >
                              {/* 头部：图标和名称 */}
                              <div className="flex items-center space-x-3 mb-3">
                                <span className="text-3xl">{scenario.icon}</span>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                      {scenario.name}
                                    </h3>
                                    {/* 推荐和热门标识 */}
                                    {scenario.isRecommended && (
                                      <span className="px-2 py-1 text-xs bg-red-500 text-white rounded-full flex items-center gap-1">
                                        ⭐ 推荐
                                      </span>
                                    )}
                                    {scenario.isPopular && (
                                      <span className="px-2 py-1 text-xs bg-orange-500 text-white rounded-full flex items-center gap-1">
                                        🔥 热门
                                      </span>
                                    )}
                                    {scenario.isNew && (
                                      <span className="px-2 py-1 text-xs bg-green-500 text-white rounded-full flex items-center gap-1">
                                        ✨ 新品
                                      </span>
                                    )}
                                  </div>
                                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
                                    scenario.difficulty === '初级' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                    scenario.difficulty === '中级' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                    scenario.difficulty === '高级' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                                    'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                  }`}>
                                    {scenario.difficulty}
                                  </span>
                                </div>
                              </div>

                              {/* 简化描述 */}
                              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                {scenario.description}
                              </p>

                              {/* 主要特性（仅显示前2个） */}
                              <div className="flex flex-wrap gap-1 mb-4">
                                {scenario.features.slice(0, 2).map((feature, index) => (
                                  <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                                  >
                                    {feature}
                                  </span>
                                ))}
                                {scenario.features.length > 2 && (
                                  <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                    +{scenario.features.length - 2}
                                  </span>
                                )}
                              </div>

                              {/* 交互按钮 */}
                              <div className="flex gap-2">
                                <button
                                  className="flex-1 px-3 py-2 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleViewScenarioDetails(scenario)
                                  }}
                                >
                                  查看详情
                                </button>
                                <button
                                  className="flex-1 px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleUseTemplate(scenario)
                                  }}
                                >
                                  使用模板
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )
                  })()}
                </motion.div>
              )}

              {activeMode === 'components' && (
                <motion.div
                  key="components"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* 当前选中分类的详细信息 */}
                  {(() => {
                    const currentCategory = getCurrentCategoryInfo()
                    const currentSubcategory = getCurrentSubcategoryInfo()
                    const filteredComponents = getFilteredComponents()

                    return (
                      <div className="space-y-6">
                        {/* 分类标题区域 */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                          <div className="flex items-center space-x-4 mb-4">
                            <span className="text-4xl">{currentCategory?.icon}</span>
                            <div className="flex-1">
                              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {currentCategory?.name}
                                {currentSubcategory && (
                                  <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
                                    / {currentSubcategory.name}
                                  </span>
                                )}
                              </h2>
                              <p className="text-gray-600 dark:text-gray-400">
                                {currentSubcategory ? currentSubcategory.description : currentCategory?.description}
                              </p>
                            </div>
                            <div className="text-right">
                              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                {filteredComponents.length}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {currentSubcategory ? '个子组件' : '个组件'}
                              </div>
                            </div>
                          </div>

                          {/* 面包屑导航 */}
                          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <span>组件库</span>
                            <span>/</span>
                            <span>{currentCategory?.name}</span>
                            {currentSubcategory && (
                              <>
                                <span>/</span>
                                <span>{currentSubcategory.name}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* 组件网格 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                          {filteredComponents.map((component) => (
                            <motion.div
                              key={component.id}
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-5 border-2 rounded-xl cursor-pointer transition-all shadow-sm hover:shadow-lg ${
                                selectedComponent?.id === component.id
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-blue-200 dark:shadow-blue-800/20'
                                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                              }`}
                              onClick={() => setSelectedComponent(component)}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {component.name}
                                  </h3>
                                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {component.subcategory}
                                  </p>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                    {component.count}
                                  </span>
                                </div>
                              </div>

                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                {component.description}
                              </p>

                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-1">
                                {component.usage}
                              </p>

                              {/* 属性标签 */}
                              {component.props && (
                                <div className="flex flex-wrap gap-1">
                                  {component.props.slice(0, 3).map((prop, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded"
                                    >
                                      {prop}
                                    </span>
                                  ))}
                                  {component.props.length > 3 && (
                                    <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                                      +{component.props.length - 3}
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* 操作按钮 */}
                              <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                                <button
                                  className="flex-1 px-3 py-1.5 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    console.log('预览组件:', component.name)
                                  }}
                                >
                                  预览
                                </button>
                                <button
                                  className="flex-1 px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    console.log('查看文档:', component.name)
                                  }}
                                >
                                  文档
                                </button>
                              </div>
                            </motion.div>
                          ))}
                        </div>

                        {/* 组件详情页面 */}
                        {selectedComponent && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-blue-200 dark:border-blue-700"
                          >
                            {/* 详情页头部 */}
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                  <span className="text-2xl">🧩</span>
                                </div>
                                <div>
                                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {selectedComponent.name}
                                  </h2>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                                    {selectedComponent.subcategory} • {selectedComponent.category}
                                  </p>
                                </div>
                              </div>
                              <button
                                onClick={() => setSelectedComponent(null)}
                                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                              >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                              {/* 左侧：预览区域 */}
                              <div>
                                <div className="flex items-center justify-between mb-4">
                                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">组件预览</h3>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => setIsInteractiveMode(!isInteractiveMode)}
                                      className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                                        isInteractiveMode
                                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                                          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                      }`}
                                    >
                                      {isInteractiveMode ? '📝 编辑模式' : '👁️ 预览模式'}
                                    </button>
                                    <button
                                      onClick={resetPreviewProps}
                                      className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                      🔄 重置
                                    </button>
                                  </div>
                                </div>

                                {/* 预览模式切换 */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                                  {/* 预览标题栏 */}
                                  <div className="bg-gray-100 dark:bg-gray-800 px-4 py-2 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                      <span className="text-xs text-gray-600 dark:text-gray-400 ml-2">
                                        {selectedComponent.name} - {isInteractiveMode ? '交互式' : '静态'}预览
                                      </span>
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                      Live Preview
                                    </div>
                                  </div>

                                  {/* 预览内容区域 */}
                                  <div className="p-6 min-h-[300px]">
                                    {isInteractiveMode ? (
                                      <div className="space-y-6">
                                        {/* 组件实时预览 */}
                                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                          <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            实时组件预览:
                                          </div>
                                          {renderComponentPreview(selectedComponent)}
                                        </div>

                                        {/* Props 控制器 */}
                                        {selectedComponent.props && selectedComponent.props.length > 0 && (
                                          <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                            <div className="mb-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                                              属性控制器:
                                            </div>
                                            <div className="space-y-3">
                                              {selectedComponent.props.map((prop, index) => (
                                                <div key={index} className="flex items-center justify-between">
                                                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                    {prop}
                                                  </label>
                                                  <div className="flex items-center space-x-2">
                                                    {getPropType(prop) === 'boolean' ? (
                                                      <button
                                                        onClick={() => updatePreviewProp(prop, !previewProps[prop])}
                                                        className={`w-12 h-6 rounded-full transition-colors ${
                                                          previewProps[prop] ? 'bg-blue-600' : 'bg-gray-300 dark:bg-gray-600'
                                                        }`}
                                                      >
                                                        <div
                                                          className={`w-5 h-5 bg-white rounded-full transition-transform ${
                                                            previewProps[prop] ? 'translate-x-6' : 'translate-x-0.5'
                                                          }`}
                                                        />
                                                      </button>
                                                    ) : getPropType(prop) === 'string' ? (
                                                      <input
                                                        type="text"
                                                        value={previewProps[prop] || ''}
                                                        onChange={(e) => updatePreviewProp(prop, e.target.value)}
                                                        placeholder="输入值..."
                                                        className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                                      />
                                                    ) : getPropType(prop) === 'number' ? (
                                                      <input
                                                        type="number"
                                                        value={previewProps[prop] || ''}
                                                        onChange={(e) => updatePreviewProp(prop, parseFloat(e.target.value) || undefined)}
                                                        className="w-20 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                                                      />
                                                    ) : (
                                                      <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        {getPropType(prop)}
                                                      </span>
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        )}

                                        {/* 当前值显示 */}
                                        <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700">
                                          <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            当前Props值:
                                          </div>
                                          <pre className="text-xs text-gray-600 dark:text-gray-400 overflow-x-auto">
{JSON.stringify(previewProps, null, 2)}
                                          </pre>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-center">
                                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mx-auto mb-4">
                                          <span className="text-3xl">⚡</span>
                                        </div>
                                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                          {selectedComponent.name}
                                        </h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                          {selectedComponent.description}
                                        </p>
                                        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                                          {renderComponentPreview(selectedComponent)}
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                                          点击"编辑模式"可以进行交互式预览
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* 右侧：API文档 */}
                              <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">API 文档</h3>

                                {/* Props 表格 */}
                                {selectedComponent.props && selectedComponent.props.length > 0 && (
                                  <div className="mb-6">
                                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Props</h4>
                                    <div className="overflow-x-auto">
                                      <table className="w-full text-sm">
                                        <thead>
                                          <tr className="border-b border-gray-200 dark:border-gray-700">
                                            <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">属性</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">类型</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">默认值</th>
                                            <th className="text-left py-2 px-3 font-medium text-gray-900 dark:text-white">描述</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {selectedComponent.props.map((prop, index) => (
                                            <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                                              <td className="py-2 px-3">
                                                <code className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded text-xs">
                                                  {prop}
                                                </code>
                                              </td>
                                              <td className="py-2 px-3 text-gray-600 dark:text-gray-400">
                                                {getPropType(prop)}
                                              </td>
                                              <td className="py-2 px-3 text-gray-600 dark:text-gray-400">
                                                {getPropDefault(prop)}
                                              </td>
                                              <td className="py-2 px-3 text-gray-600 dark:text-gray-400">
                                                {getPropDescription(prop)}
                                              </td>
                                            </tr>
                                          ))}
                                        </tbody>
                                      </table>
                                    </div>
                                  </div>
                                )}

                                {/* 使用说明 */}
                                <div className="mb-6">
                                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">使用说明</h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    {selectedComponent.usage}
                                  </p>
                                </div>

                                {/* 代码示例 */}
                                <div>
                                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">代码示例</h4>
                                  <div className="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                    <pre className="text-green-400">
{`<${selectedComponent.name}
  ${selectedComponent.props?.map(prop => `${prop}="..."`).join('\n  ') || ''}
/>`}
                                    </pre>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* 底部操作区 */}
                            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                              <button className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                📋 复制代码
                              </button>
                              <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                📖 查看文档
                              </button>
                              <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                💡 使用技巧
                              </button>
                            </div>
                          </motion.div>
                        )}

                        {/* 详细信息面板 - 当没有选中组件时显示 */}
                        {!selectedComponent && (
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                            分类信息
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg border border-blue-200 dark:border-blue-700">
                              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">组件总数</h4>
                              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                                {filteredComponents.length}
                              </p>
                              <p className="text-sm text-blue-600 dark:text-blue-400">
                                {currentSubcategory ? '个子组件' : '个组件'}
                              </p>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg border border-purple-200 dark:border-purple-700">
                              <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">文件位置</h4>
                              <p className="text-sm text-purple-600 dark:text-purple-400 font-mono">
                                /src/components/{currentCategory?.id}/
                                {currentSubcategory && `/${currentSubcategory.id}`}
                              </p>
                            </div>
                            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg border border-green-200 dark:border-green-700">
                              <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">功能描述</h4>
                              <p className="text-sm text-green-600 dark:text-green-400">
                                {currentSubcategory ? currentSubcategory.description : currentCategory?.description}
                              </p>
                            </div>
                          </div>
                        </div>
                        )}
                      </div>
                    )
                  })()}
                </motion.div>
              )}

              {activeMode === 'editor' && (
                <motion.div
                  key="editor"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      代码编辑器
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Monaco编辑器集成 - 支持 TypeScript、智能提示、错误检查
                    </p>
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg overflow-hidden">
                      <WorkbenchMonacoEditor
                        language="typescript"
                        theme="vs-dark"
                        minHeight="400px"
                        value={`import { Button } from '@xorigo-ui/core'

export default function MyComponent() {
  return (
    <div>
      <Button variant="primary" size="lg">
        Hello Xorigo UI Workbench V2
      </Button>
    </div>
  )
}`}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMode === 'theme' && (
                <motion.div
                  key="theme"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      七轴主题配方
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      实时预览和配置主题配方，支持 26 个参数调节
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {themeRecipes.map((recipe) => (
                        <motion.div
                          key={recipe.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedRecipe?.id === recipe.id
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-500'
                          }`}
                          onClick={() => setSelectedRecipe(recipe)}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <div className={`w-4 h-4 rounded-full ${
                              recipe.mode === 'dark' ? 'bg-gray-800' : 'bg-white border border-gray-300'
                            }`} />
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {recipe.name}
                            </h3>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                            {recipe.description}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                              {recipe.mode}
                            </span>
                            <span className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 rounded">
                              {recipe.hue}
                            </span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMode === 'devtools' && (
                <motion.div
                  key="devtools"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      开发工具套件
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      性能监控、调试工具、依赖分析等开发辅助工具
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          性能监控器
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          实时监控组件渲染性能和内存使用
                        </p>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          依赖分析器
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          可视化组件依赖关系和包大小分析
                        </p>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          错误边界检测
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          自动检测和处理组件中的错误
                        </p>
                      </div>
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          代码质量分析
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          代码规范检查和最佳实践建议
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeMode === 'ai-assistant' && (
                <motion.div
                  key="ai-assistant"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                      AI 智能助手
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      您的智能开发伙伴，提供代码生成、问题解答、最佳实践建议等服务
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-3xl mb-4">🤖</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          智能对话
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          自然语言交互，理解您的开发需求，提供精准的技术支持
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded">
                            自然语言处理
                          </span>
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded">
                            上下文理解
                          </span>
                        </div>
                      </div>
                      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-3xl mb-4">💡</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          代码生成
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          基于描述自动生成组件代码，支持多种技术栈和设计模式
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded">
                            React 组件
                          </span>
                          <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 rounded">
                            TypeScript
                          </span>
                        </div>
                      </div>
                      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-3xl mb-4">🔍</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          问题诊断
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          智能分析代码问题，提供优化建议和最佳实践指导
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded">
                            错误检测
                          </span>
                          <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 rounded">
                            性能优化
                          </span>
                        </div>
                      </div>
                      <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="text-3xl mb-4">📚</div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                          知识库
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                          丰富的开发知识库，包含文档、教程、示例代码
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <span className="px-2 py-1 text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 rounded">
                            API 文档
                          </span>
                          <span className="px-2 py-1 text-xs bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 rounded">
                            最佳实践
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      {/* 底部状态栏 */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>状态: <span className="text-green-600 font-medium">运行中</span></span>
              <span>组件: <span className="font-mono">{totalComponentCount} 已注册</span></span>
            </div>
            <div className="flex items-center space-x-4">
              <span>服务器: <span className="text-green-600 font-medium">在线</span></span>
              <span>版本: <span className="font-mono">v2.0.0</span></span>
            </div>
          </div>
        </div>
      </footer>

      {/* AI 助手浮动按钮 */}
      <FloatingAIButton
        position="bottom-right"
        variant="default"
      />
    </div>
  )
}