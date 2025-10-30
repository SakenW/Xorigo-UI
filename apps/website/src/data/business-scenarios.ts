import { BusinessScenario } from '@/components/workbench/solution-platform/business-scenario-card'

/**
 * 业务场景数据定义
 * 基于 Xorigo UI 组件库的实际使用场景
 */
export const businessScenarios: BusinessScenario[] = [
  // 🚀 快速原型分类
  {
    id: 'user-authentication',
    title: '用户认证系统',
    description: '完整的用户登录、注册、密码重置流程，包含表单验证和第三方登录',
    icon: '🔐',
    category: 'prototype',
    color: 'blue',
    popularity: 95,
    difficulty: 'beginner',
    estimatedTime: '30分钟',
    solutions: [
      {
        id: 'login-form',
        name: '登录表单',
        description: '用户名密码登录，支持记住我',
        components: ['Form', 'Input', 'Button', 'Checkbox'],
        codeAvailable: true
      },
      {
        id: 'registration-form',
        name: '注册表单',
        description: '用户注册，包含邮箱验证',
        components: ['Form', 'Input', 'Button', 'Alert'],
        codeAvailable: true
      },
      {
        id: 'password-reset',
        name: '密码重置',
        description: '忘记密码流程',
        components: ['Form', 'Input', 'Button', 'Alert'],
        codeAvailable: false
      },
      {
        id: 'social-login',
        name: '第三方登录',
        description: '微信、QQ、GitHub登录',
        components: ['Button', 'Card', 'Avatar'],
        codeAvailable: false
      }
    ]
  },
  {
    id: 'user-profile',
    title: '个人中心',
    description: '用户信息展示、编辑、头像上传等个人资料管理功能',
    icon: '👤',
    category: 'prototype',
    color: 'green',
    popularity: 85,
    difficulty: 'intermediate',
    estimatedTime: '45分钟',
    solutions: [
      {
        id: 'profile-view',
        name: '资料展示',
        description: '个人信息查看页面',
        components: ['Card', 'Avatar', 'Typography', 'Button'],
        codeAvailable: true
      },
      {
        id: 'profile-edit',
        name: '资料编辑',
        description: '个人信息修改表单',
        components: ['Form', 'Input', 'Button', 'Avatar'],
        codeAvailable: true
      },
      {
        id: 'avatar-upload',
        name: '头像上传',
        description: '图片上传和裁剪',
        components: ['Button', 'Card', 'Progress'],
        codeAvailable: false
      }
    ]
  },
  {
    id: 'content-management',
    title: '内容管理',
    description: '文章发布、编辑、删除等CMS内容管理功能',
    icon: '📝',
    category: 'prototype',
    color: 'purple',
    popularity: 75,
    difficulty: 'intermediate',
    estimatedTime: '60分钟',
    solutions: [
      {
        id: 'article-editor',
        name: '文章编辑器',
        description: '富文本内容编辑',
        components: ['Form', 'Textarea', 'Button', 'Card'],
        codeAvailable: true
      },
      {
        id: 'content-list',
        name: '内容列表',
        description: '文章管理和搜索',
        components: ['Table', 'Button', 'Input', 'Card'],
        codeAvailable: false
      }
    ]
  },

  // 💼 业务功能分类
  {
    id: 'ecommerce-system',
    title: '电商系统',
    description: '商品展示、购物车、订单管理等电商核心功能',
    icon: '🛒',
    category: 'business',
    color: 'orange',
    popularity: 90,
    difficulty: 'advanced',
    estimatedTime: '120分钟',
    solutions: [
      {
        id: 'product-card',
        name: '商品卡片',
        description: '商品信息展示卡片',
        components: ['Card', 'Button', 'Typography', 'Avatar'],
        codeAvailable: true
      },
      {
        id: 'shopping-cart',
        name: '购物车',
        description: '商品添加、数量调整',
        components: ['Card', 'Button', 'Input', 'Table'],
        codeAvailable: true
      },
      {
        id: 'checkout-flow',
        name: '结算流程',
        description: '订单确认和支付',
        components: ['Form', 'Button', 'Card', 'Alert'],
        codeAvailable: false
      },
      {
        id: 'order-management',
        name: '订单管理',
        description: '订单列表和状态管理',
        components: ['Table', 'Button', 'Card', 'Tabs'],
        codeAvailable: false
      }
    ]
  },
  {
    id: 'data-management',
    title: '数据管理',
    description: '数据表格、筛选、分页等数据管理界面',
    icon: '📊',
    category: 'business',
    color: 'indigo',
    popularity: 80,
    difficulty: 'intermediate',
    estimatedTime: '90分钟',
    solutions: [
      {
        id: 'data-table',
        name: '数据表格',
        description: '可排序、筛选的数据表格',
        components: ['Table', 'Button', 'Input', 'Select'],
        codeAvailable: true
      },
      {
        id: 'advanced-filters',
        name: '高级筛选',
        description: '多条件数据筛选',
        components: ['Form', 'Select', 'Button', 'Card'],
        codeAvailable: false
      },
      {
        id: 'data-export',
        name: '数据导出',
        description: 'Excel、CSV导出功能',
        components: ['Button', 'Card', 'Progress'],
        codeAvailable: false
      }
    ]
  },
  {
    id: 'user-management',
    title: '用户管理',
    description: '用户列表、权限管理、角色分配等后台管理功能',
    icon: '👥',
    category: 'business',
    color: 'pink',
    popularity: 70,
    difficulty: 'advanced',
    estimatedTime: '100分钟',
    solutions: [
      {
        id: 'user-list',
        name: '用户列表',
        description: '用户信息管理表格',
        components: ['Table', 'Button', 'Avatar', 'Card'],
        codeAvailable: true
      },
      {
        id: 'role-management',
        name: '角色管理',
        description: '权限和角色分配',
        components: ['Card', 'Button', 'Checkbox', 'Tabs'],
        codeAvailable: false
      }
    ]
  },

  // 📊 数据展示分类
  {
    id: 'data-visualization',
    title: '数据可视化',
    description: '图表、统计卡片、仪表板等数据展示组件',
    icon: '📈',
    category: 'data',
    color: 'blue',
    popularity: 65,
    difficulty: 'intermediate',
    estimatedTime: '75分钟',
    solutions: [
      {
        id: 'stat-cards',
        name: '统计卡片',
        description: '数据指标展示卡片',
        components: ['Card', 'Typography', 'Progress'],
        codeAvailable: true
      },
      {
        id: 'chart-components',
        name: '图表组件',
        description: '各类数据图表',
        components: ['Card', 'Typography', 'Progress'],
        codeAvailable: false
      },
      {
        id: 'dashboard-layout',
        name: '仪表板布局',
        description: '数据看板页面布局',
        components: ['Grid', 'Card', 'Typography', 'Progress'],
        codeAvailable: false
      }
    ]
  },
  {
    id: 'analytics-dashboard',
    title: '分析仪表板',
    description: '业务数据分析、趋势展示、报表生成',
    icon: '📊',
    category: 'data',
    color: 'green',
    popularity: 60,
    difficulty: 'advanced',
    estimatedTime: '120分钟',
    solutions: [
      {
        id: 'trend-charts',
        name: '趋势图表',
        description: '时间序列数据展示',
        components: ['Card', 'Typography', 'Progress'],
        codeAvailable: false
      }
    ]
  },

  // 🎨 页面布局分类
  {
    id: 'navigation-layout',
    title: '导航布局',
    description: '顶部导航、侧边栏、面包屑等页面导航组件',
    icon: '🧭',
    category: 'layout',
    color: 'purple',
    popularity: 88,
    difficulty: 'beginner',
    estimatedTime: '40分钟',
    solutions: [
      {
        id: 'top-navigation',
        name: '顶部导航',
        description: '网站主导航栏',
        components: ['Container', 'Button', 'Typography'],
        codeAvailable: true
      },
      {
        id: 'sidebar-navigation',
        name: '侧边栏导航',
        description: '后台管理侧边栏',
        components: ['Card', 'Button', 'Typography'],
        codeAvailable: true
      },
      {
        id: 'breadcrumb-navigation',
        name: '面包屑导航',
        description: '页面层级导航',
        components: ['Typography', 'Button'],
        codeAvailable: true
      }
    ]
  },
  {
    id: 'content-layout',
    title: '内容布局',
    description: '网格布局、卡片列表、响应式内容展示',
    icon: '📐',
    category: 'layout',
    color: 'orange',
    popularity: 75,
    difficulty: 'intermediate',
    estimatedTime: '50分钟',
    solutions: [
      {
        id: 'grid-layout',
        name: '网格布局',
        description: '响应式网格系统',
        components: ['Grid', 'Card', 'Container'],
        codeAvailable: true
      },
      {
        id: 'card-list',
        name: '卡片列表',
        description: '内容卡片列表布局',
        components: ['Card', 'Typography', 'Button'],
        codeAvailable: true
      }
    ]
  },
  {
    id: 'responsive-layout',
    title: '响应式布局',
    description: '移动端适配、弹性布局、断点设计',
    icon: '📱',
    category: 'layout',
    color: 'indigo',
    popularity: 82,
    difficulty: 'intermediate',
    estimatedTime: '60分钟',
    solutions: [
      {
        id: 'mobile-first',
        name: '移动优先布局',
        description: '移动端响应式设计',
        components: ['Container', 'Card', 'Button', 'Typography'],
        codeAvailable: true
      }
    ]
  }
]

/**
 * 按分类获取业务场景
 */
export function getBusinessScenariosByCategory(category: string): BusinessScenario[] {
  return businessScenarios.filter(scenario => scenario.category === category)
}

/**
 * 获取热门业务场景
 */
export function getPopularBusinessScenarios(limit: number = 6): BusinessScenario[] {
  return businessScenarios
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, limit)
}

/**
 * 根据ID获取业务场景
 */
export function getBusinessScenarioById(id: string): BusinessScenario | undefined {
  return businessScenarios.find(scenario => scenario.id === id)
}

/**
 * 搜索业务场景
 */
export function searchBusinessScenarios(query: string): BusinessScenario[] {
  const lowerQuery = query.toLowerCase()
  return businessScenarios.filter(scenario =>
    scenario.title.toLowerCase().includes(lowerQuery) ||
    scenario.description.toLowerCase().includes(lowerQuery) ||
    scenario.solutions.some(solution =>
      solution.name.toLowerCase().includes(lowerQuery) ||
      solution.description.toLowerCase().includes(lowerQuery)
    )
  )
}