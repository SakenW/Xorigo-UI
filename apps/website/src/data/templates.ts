import type { Template } from '@/types/templates'

/**
 * 完整的项目模板数据
 * 包含所有可用模板的详细信息
 */

export const templates: Template[] = [
  {
    id: 'landing-page',
    name: '营销落地页',
    category: 'starter',
    description: '现代化的产品营销落地页模板',
    longDescription: '这是一个功能完整的营销落地页模板，采用现代化的设计理念，包含英雄区域、功能展示、客户评价、价格方案等核心模块。使用 Next.js 14 App Router 构建，支持响应式设计和深色模式。',
    preview: '/templates/landing-preview.jpg',
    technologies: [
      { name: 'Next.js', version: '14', icon: '⚛️', category: 'frontend' },
      { name: 'Tailwind CSS', version: '3.4', icon: '🎨', category: 'styling' },
      { name: 'Framer Motion', version: '11', icon: '🎭', category: 'animation' },
      { name: 'TypeScript', version: '5', icon: '📘', category: 'frontend' },
      { name: 'Lucide React', icon: '🎯', category: 'frontend' }
    ],
    features: [
      { name: '响应式设计', description: '完美适配桌面、平板和移动设备', included: true },
      { name: '深色模式', description: '支持系统主题切换', included: true },
      { name: 'SEO 优化', description: '完整的 meta 标签和结构化数据', included: true },
      { name: '性能优化', description: '图片优化、代码分割、懒加载', included: true },
      { name: '动画效果', description: '流畅的页面过渡和交互动画', included: true },
      { name: '表单验证', description: '客户端表单验证和错误处理', included: true }
    ],
    githubRepo: 'https://github.com/xorigo-ui/landing-page-template',
    demoUrl: 'https://landing-page-template.xorigo-ui.com',
    difficulty: 'beginner',
    estimatedTime: '30分钟',
    stats: {
      downloads: 1250,
      stars: 89,
      forks: 23,
      lastUpdated: '2024-03-15'
    },
    tags: ['营销', '落地页', 'SaaS', '产品展示'],
    author: {
      name: 'Xorigo UI Team',
      avatar: '/images/xorigo-logo.svg',
      url: 'https://xorigo-ui.com'
    }
  },
  {
    id: 'admin-dashboard',
    name: '管理后台',
    category: 'application',
    description: '功能完整的管理后台模板',
    longDescription: '一个功能丰富的管理后台模板，包含用户管理、数据分析、系统设置等常用功能。采用侧边栏导航布局，支持多级菜单、数据可视化、实时通知等高级功能。集成 Recharts 图表库，提供丰富的数据展示组件。',
    preview: '/templates/admin-preview.jpg',
    technologies: [
      { name: 'Next.js', version: '14', icon: '⚛️', category: 'frontend' },
      { name: 'TypeScript', version: '5', icon: '📘', category: 'frontend' },
      { name: 'Recharts', version: '2.8', icon: '📊', category: 'frontend' },
      { name: 'Tailwind CSS', version: '3.4', icon: '🎨', category: 'styling' },
      { name: 'Prisma', icon: '🗄️', category: 'database' },
      { name: 'NextAuth', icon: '🔐', category: 'backend' }
    ],
    features: [
      { name: '用户认证', description: '完整的登录注册和权限管理', included: true },
      { name: '数据可视化', description: '多种图表类型和实时数据更新', included: true },
      { name: '响应式布局', description: '适配各种屏幕尺寸的管理界面', included: true },
      { name: '实时通知', description: 'WebSocket 实时消息推送', included: true },
      { name: '数据表格', description: '支持排序、筛选、分页的数据表格', included: true },
      { name: '文件上传', description: '拖拽上传和批量文件处理', included: true },
      { name: '主题切换', description: '支持亮色/暗色主题切换', included: true },
      { name: '国际化', description: '支持多语言切换', included: false }
    ],
    githubRepo: 'https://github.com/xorigo-ui/admin-dashboard-template',
    demoUrl: 'https://admin-dashboard-template.xorigo-ui.com',
    difficulty: 'intermediate',
    estimatedTime: '2小时',
    stats: {
      downloads: 890,
      stars: 156,
      forks: 45,
      lastUpdated: '2024-03-18'
    },
    tags: ['管理后台', '数据分析', '企业应用', 'Dashboard'],
    author: {
      name: 'Xorigo UI Team',
      avatar: '/images/xorigo-logo.svg',
      url: 'https://xorigo-ui.com'
    }
  },
  {
    id: 'ecommerce',
    name: '电商网站',
    category: 'industry',
    description: '完整的电子商务解决方案',
    longDescription: '一个功能完整的电商网站模板，包含商品展示、购物车、订单管理、支付集成等核心功能。支持多种支付方式、库存管理、用户评价系统。使用 Stripe 处理支付，Prisma 管理数据，提供完整的电商体验。',
    preview: '/templates/ecommerce-preview.jpg',
    technologies: [
      { name: 'Next.js', version: '14', icon: '⚛️', category: 'frontend' },
      { name: 'Stripe', icon: '💳', category: 'backend' },
      { name: 'Prisma', icon: '🗄️', category: 'database' },
      { name: 'TypeScript', version: '5', icon: '📘', category: 'frontend' },
      { name: 'Tailwind CSS', version: '3.4', icon: '🎨', category: 'styling' },
      { name: 'React Query', icon: '🔄', category: 'frontend' },
      { name: 'Zod', icon: '✅', category: 'frontend' }
    ],
    features: [
      { name: '商品管理', description: '完整的商品信息和库存管理', included: true },
      { name: '购物车', description: '本地存储的购物车功能', included: true },
      { name: '支付集成', description: 'Stripe 安全支付处理', included: true },
      { name: '订单管理', description: '订单跟踪和状态管理', included: true },
      { name: '用户系统', description: '用户注册、登录和个人中心', included: true },
      { name: '搜索功能', description: '商品搜索和筛选', included: true },
      { name: '评价系统', description: '用户评价和评分功能', included: true },
      { name: '优惠券', description: '优惠券和折扣码系统', included: false },
      { name: '物流跟踪', description: '订单物流状态跟踪', included: false }
    ],
    githubRepo: 'https://github.com/xorigo-ui/ecommerce-template',
    demoUrl: 'https://ecommerce-template.xorigo-ui.com',
    difficulty: 'advanced',
    estimatedTime: '4小时',
    stats: {
      downloads: 567,
      stars: 234,
      forks: 67,
      lastUpdated: '2024-03-20'
    },
    tags: ['电商', '支付', '商城', 'B2C'],
    author: {
      name: 'Xorigo UI Team',
      avatar: '/images/xorigo-logo.svg',
      url: 'https://xorigo-ui.com'
    }
  }
]

// 模板分类配置
export const templateCategories = [
  { value: 'all', label: '全部模板', description: '浏览所有可用的项目模板' },
  { value: 'starter', label: '基础模板', description: '适合新项目开始的简单模板' },
  { value: 'application', label: '完整应用', description: '功能完整的 Web 应用模板' },
  { value: 'industry', label: '行业方案', description: '针对特定行业的专业模板' }
]

// 技术栈列表
export const availableTechnologies = [
  'Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion',
  'Prisma', 'Stripe', 'Recharts', 'NextAuth', 'React Query', 'Zod'
]

// 难度级别配置
export const difficultyLevels = [
  { value: 'beginner', label: '初级', color: 'green', description: '适合初学者，30分钟内完成' },
  { value: 'intermediate', label: '中级', color: 'yellow', description: '需要一定基础，1-2小时完成' },
  { value: 'advanced', label: '高级', color: 'red', description: '需要丰富经验，3-4小时完成' }
]

// 获取模板分类标签
export function getCategoryLabel(category: string): string {
  const cat = templateCategories.find(c => c.value === category)
  return cat?.label || category
}

// 获取难度级别信息
export function getDifficultyInfo(difficulty: string) {
  return difficultyLevels.find(d => d.value === difficulty)
}

// 筛选模板
export function filterTemplates(templates: Template[], filters: {
  category?: string
  difficulty?: string
  technologies?: string[]
  search?: string
}): Template[] {
  return templates.filter(template => {
    // 分类筛选
    if (filters.category && filters.category !== 'all' && template.category !== filters.category) {
      return false
    }

    // 难度筛选
    if (filters.difficulty && filters.difficulty !== 'all' && template.difficulty !== filters.difficulty) {
      return false
    }

    // 技术栈筛选
    if (filters.technologies && filters.technologies.length > 0) {
      const templateTechNames = template.technologies.map(t => t.name)
      if (!filters.technologies.some(tech => templateTechNames.includes(tech))) {
        return false
      }
    }

    // 搜索筛选
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      const searchableText = [
        template.name,
        template.description,
        template.longDescription || '',
        ...template.tags,
        ...template.technologies.map(t => t.name)
      ].join(' ').toLowerCase()

      if (!searchableText.includes(searchLower)) {
        return false
      }
    }

    return true
  })
}

// 根据 ID 获取模板
export function getTemplateById(id: string): Template | undefined {
  return templates.find(template => template.id === id)
}

// 获取相关模板
export function getRelatedTemplates(template: Template, limit: number = 3): Template[] {
  return templates
    .filter(t => t.id !== template.id && t.category === template.category)
    .slice(0, limit)
}