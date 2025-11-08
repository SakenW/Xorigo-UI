'use client'

import { useState, useMemo, useCallback } from 'react'
import { ComponentExample, ComponentCategory } from '@/types/workbench'

// 完整的组件数据配置 (135个组件)
const componentCategories: ComponentCategory[] = [
  // 原有的8个类别 + 新增的6个类别
  {
    id: 'forms',
    name: '表单组件',
    description: '智能表单、输入组件、验证器、字段管理',
    icon: '📋',
    componentCount: 39,
    subcategories: [
      {
        id: 'input',
        name: '输入组件',
        description: '文本、密码、数字输入',
        components: [
          {
            id: 'text-input',
            name: 'TextInput',
            description: '基础文本输入框，用于输入用户名、标题、搜索词等单行文本内容',
            element: 'input',
            category: 'forms',
            subcategory: 'input',
            tags: ['input', 'form', 'text'],
            props: ['placeholder', 'value', 'onChange', 'disabled'],
            usage: 8,
            difficulty: 'beginner'
          },
          {
            id: 'password-input',
            name: 'PasswordInput',
            description: '安全密码输入框，支持密码强度检测、显示/隐藏切换',
            element: 'input',
            category: 'forms',
            subcategory: 'input',
            tags: ['input', 'form', 'password', 'security'],
            props: ['placeholder', 'showPassword', 'strength', 'value', 'onChange'],
            usage: 4,
            difficulty: 'intermediate'
          },
          {
            id: 'number-input',
            name: 'NumberInput',
            description: '数字输入框，支持增减按钮、范围限制和小数精度',
            element: 'input',
            category: 'forms',
            subcategory: 'input',
            tags: ['input', 'form', 'number', 'validation'],
            props: ['min', 'max', 'step', 'precision', 'value', 'onChange'],
            usage: 5,
            difficulty: 'intermediate'
          },
          {
            id: 'email-input',
            name: 'EmailInput',
            description: '邮箱地址输入框，支持格式自动验证、域名限制',
            element: 'input',
            category: 'forms',
            subcategory: 'input',
            tags: ['input', 'form', 'email', 'validation'],
            props: ['validation', 'domains', 'placeholder', 'value', 'onChange'],
            usage: 3,
            difficulty: 'intermediate'
          },
          {
            id: 'phone-input',
            name: 'PhoneInput',
            description: '手机号码输入框，支持国际区号选择、格式化显示',
            element: 'input',
            category: 'forms',
            subcategory: 'input',
            tags: ['input', 'form', 'phone', 'international'],
            props: ['countryCode', 'format', 'placeholder', 'value', 'onChange'],
            usage: 3,
            difficulty: 'advanced'
          },
          {
            id: 'button',
            name: 'Button',
            description: '交互按钮组件，支持多种样式、尺寸和状态',
            element: 'button',
            category: 'forms',
            subcategory: 'input',
            tags: ['button', 'form', 'action', 'click'],
            props: ['variant', 'size', 'disabled', 'loading', 'onClick'],
            usage: 12,
            difficulty: 'beginner'
          }
        ]
      },
      {
        id: 'select',
        name: '选择组件',
        description: '下拉选择、多选、单选',
        components: [
          {
            id: 'select',
            name: 'Select',
            description: '下拉选择框，支持单选、多选、搜索过滤',
            element: 'select',
            category: 'forms',
            subcategory: 'select',
            tags: ['select', 'form', 'dropdown'],
            props: ['options', 'multiple', 'searchable', 'selected', 'onChange'],
            usage: 6,
            difficulty: 'beginner'
          },
          {
            id: 'checkbox',
            name: 'Checkbox',
            description: '复选框组件，支持多选、全选、半选状态',
            element: 'input',
            category: 'forms',
            subcategory: 'select',
            tags: ['checkbox', 'form', 'selection'],
            props: ['checked', 'indeterminate', 'disabled', 'onChange'],
            usage: 7,
            difficulty: 'beginner'
          },
          {
            id: 'radio',
            name: 'Radio',
            description: '单选框组件，用于互斥选项选择',
            element: 'input',
            category: 'forms',
            subcategory: 'select',
            tags: ['radio', 'form', 'selection'],
            props: ['options', 'selected', 'disabled', 'onChange'],
            usage: 4,
            difficulty: 'beginner'
          },
          {
            id: 'switch',
            name: 'Switch',
            description: '开关切换组件，用于启用/禁用功能',
            element: 'button',
            category: 'forms',
            subcategory: 'select',
            tags: ['switch', 'form', 'toggle'],
            props: ['checked', 'disabled', 'onChange'],
            usage: 5,
            difficulty: 'beginner'
          }
        ]
      }
    ]
  },

  // 新增：图表组件 (19个)
  {
    id: 'charts',
    name: '图表组件',
    description: '数据可视化图表、统计图表、实时图表',
    icon: '📊',
    componentCount: 19,
    subcategories: [
      {
        id: 'basic-charts',
        name: '基础图表',
        description: '常用图表类型',
        components: [
          { id: 'area-chart', name: 'AreaChart', description: '面积图，展示数据变化趋势', usage: 6 },
          { id: 'bar-chart', name: 'BarChart', description: '柱状图，对比数据大小', usage: 8 },
          { id: 'line-chart', name: 'LineChart', description: '折线图，展示数据趋势', usage: 10 },
          { id: 'pie-chart', name: 'PieChart', description: '饼图，展示数据占比', usage: 7 },
          { id: 'column-chart', name: 'ColumnChart', description: '条形图，对比数据', usage: 5 }
        ]
      },
      {
        id: 'advanced-charts',
        name: '高级图表',
        description: '专业图表类型',
        components: [
          { id: 'donut-chart', name: 'DonutChart', description: '环形图，中心空心的饼图', usage: 4 },
          { id: 'funnel-chart', name: 'FunnelChart', description: '漏斗图，展示转化流程', usage: 3 },
          { id: 'gauge-chart', name: 'GaugeChart', description: '仪表盘，展示进度指标', usage: 4 },
          { id: 'radar-chart', name: 'RadarChart', description: '雷达图，多维度数据对比', usage: 3 },
          { id: 'heatmap', name: 'Heatmap', description: '热力图，数据密度分布', usage: 5 }
        ]
      },
      {
        id: 'chart-components',
        name: '图表组件',
        description: '图表辅助组件',
        components: [
          { id: 'mini-chart', name: 'MiniChart', description: '迷你图表，紧凑显示', usage: 6 },
          { id: 'sparkline', name: 'Sparkline', description: '迷你折线图，趋势展示', usage: 4 },
          { id: 'chart-container', name: 'ChartContainer', description: '图表容器，统一布局', usage: 8 },
          { id: 'chart-tooltip', name: 'ChartTooltip', description: '图表提示框', usage: 9 },
          { id: 'legend', name: 'Legend', description: '图例，说明图表元素', usage: 7 },
          { id: 'axis', name: 'Axis', description: '坐标轴，图表轴线', usage: 6 },
          { id: 'grid-lines', name: 'GridLines', description: '网格线，图表辅助线', usage: 5 },
          { id: 'simple-mode', name: 'SimpleMode', description: '简单模式，简化显示', usage: 4 },
          { id: 'chart-area', name: 'ChartArea', description: '图表区域，整体布局', usage: 3 }
        ]
      }
    ]
  },

  // 新增：业务区块组件 (15个)
  {
    id: 'blocks',
    name: '业务区块',
    description: '页面区块、业务组件、营销模块',
    icon: '📦',
    componentCount: 15,
    subcategories: [
      {
        id: 'marketing-blocks',
        name: '营销区块',
        description: '营销页面组件',
        components: [
          { id: 'hero-section', name: 'HeroSection', description: '首屏区块，重要展示区域', usage: 8 },
          { id: 'feature-section', name: 'FeatureSection', description: '特性展示区块', usage: 6 },
          { id: 'call-to-action-section', name: 'CallToActionSection', description: '行动召唤区块', usage: 5 },
          { id: 'testimonial-section', name: 'TestimonialSection', description: '用户评价区块', usage: 4 },
          { id: 'faq-section', name: 'FAQSection', description: '常见问题区块', usage: 3 }
        ]
      },
      {
        id: 'auth-blocks',
        name: '认证区块',
        description: '用户认证组件',
        components: [
          { id: 'login-section', name: 'LoginSection', description: '登录区块', usage: 7 },
          { id: 'register-section', name: 'RegisterSection', description: '注册区块', usage: 6 },
          { id: 'auth-card', name: 'AuthCard', description: '认证卡片', usage: 5 },
          { id: 'reset-password-section', name: 'ResetPasswordSection', description: '密码重置区块', usage: 3 }
        ]
      },
      {
        id: 'data-blocks',
        name: '数据区块',
        description: '数据展示区块',
        components: [
          { id: 'pricing-section', name: 'PricingSection', description: '价格方案区块', usage: 4 },
          { id: 'chart-panel', name: 'ChartPanel', description: '图表面板', usage: 6 },
          { id: 'kp-overview', name: 'KPOverview', description: '关键指标概览', usage: 5 },
          { id: 'stats-grid', name: 'StatsGrid', description: '统计网格', usage: 4 },
          { id: 'filter-bar', name: 'FilterBar', description: '筛选栏', usage: 7 },
          { id: 'activity-feed', name: 'ActivityFeed', description: '活动动态', usage: 3 }
        ]
      }
    ]
  },

  // 新增：高级数据展示组件 (15个)
  {
    id: 'advanced-data-display',
    name: '高级数据展示',
    description: '用户展示、标签展示、统计展示、列表展示',
    icon: '🔧',
    componentCount: 15,
    subcategories: [
      {
        id: 'user-display',
        name: '用户展示',
        description: '用户头像和信息展示',
        components: [
          { id: 'avatar', name: 'Avatar', description: '用户头像，支持多种样式', usage: 9 },
          { id: 'avatar-group', name: 'AvatarGroup', description: '头像组，展示多个用户', usage: 5 }
        ]
      },
      {
        id: 'tag-display',
        name: '标签展示',
        description: '标签和徽章展示',
        components: [
          { id: 'chip-display', name: 'ChipDisplay', description: '芯片标签，紧凑展示', usage: 6 },
          { id: 'tag', name: 'Tag', description: '标签，分类标记', usage: 8 }
        ]
      },
      {
        id: 'statistic-display',
        name: '统计展示',
        description: '统计数据和指标展示',
        components: [
          { id: 'statistic-card', name: 'StatisticCard', description: '统计卡片，关键指标展示', usage: 7 },
          { id: 'data-grid', name: 'DataGrid', description: '数据网格，表格展示', usage: 5 }
        ]
      },
      {
        id: 'list-display',
        name: '列表展示',
        description: '各种列表展示方式',
        components: [
          { id: 'description-list', name: 'DescriptionList', description: '描述列表，键值对展示', usage: 4 },
          { id: 'key-value-list', name: 'KeyValueList', description: '键值列表，数据对展示', usage: 3 },
          { id: 'list-item', name: 'ListItem', description: '列表项，单个条目展示', usage: 8 }
        ]
      },
      {
        id: 'interactive-display',
        name: '交互展示',
        description: '交互式展示组件',
        components: [
          { id: 'info-tooltip', name: 'InfoTooltip', description: '信息提示框', usage: 6 },
          { id: 'steps', name: 'Steps', description: '步骤条，流程展示', usage: 4 },
          { id: 'timeline', name: 'Timeline', description: '时间轴，历史记录', usage: 5 }
        ]
      }
    ]
  },

  // 新增：增强输入组件 (15个)
  {
    id: 'enhanced-inputs',
    name: '增强输入',
    description: '高级输入控件、组合输入、智能输入',
    icon: '⚡',
    componentCount: 15,
    subcategories: [
      {
        id: 'smart-inputs',
        name: '智能输入',
        description: '智能输入组件',
        components: [
          { id: 'autocomplete', name: 'Autocomplete', description: '自动完成输入，智能建议', usage: 6 },
          { id: 'color-picker', name: 'ColorPicker', description: '颜色选择器，取色工具', usage: 5 },
          { id: 'date-time-picker', name: 'DateTimePicker', description: '日期时间选择器', usage: 4 },
          { id: 'time-picker', name: 'TimePicker', description: '时间选择器，只选时间', usage: 3 }
        ]
      },
      {
        id: 'group-inputs',
        name: '组合输入',
        description: '组合式输入控件',
        components: [
          { id: 'button-group', name: 'ButtonGroup', description: '按钮组，选项按钮集合', usage: 7 },
          { id: 'checkbox-group', name: 'CheckboxGroup', description: '复选框组，多选组合', usage: 5 },
          { id: 'radio-group', name: 'RadioGroup', description: '单选框组，单选组合', usage: 6 }
        ]
      },
      {
        id: 'interactive-inputs',
        name: '交互输入',
        description: '交互式输入控件',
        components: [
          { id: 'chip', name: 'Chip', description: '芯片输入，标签式输入', usage: 8 },
          { id: 'icon-button', name: 'IconButton', description: '图标按钮，带图标的按钮', usage: 9 },
          { id: 'range-slider', name: 'RangeSlider', description: '范围滑块，区间选择', usage: 4 },
          { id: 'rating', name: 'Rating', description: '评分组件，星级评价', usage: 6 },
          { id: 'toggle', name: 'Toggle', description: '切换开关，状态切换', usage: 7 }
        ]
      },
      {
        id: 'file-inputs',
        name: '文件输入',
        description: '文件上传相关',
        components: [
          { id: 'file-upload', name: 'FileUpload', description: '文件上传，拖拽上传', usage: 5 },
          { id: 'upload-button', name: 'UploadButton', description: '上传按钮，触发上传', usage: 4 }
        ]
      }
    ]
  },

  // 新增：反馈动效组件 (13个)
  {
    id: 'feedback-motion',
    name: '反馈动效',
    description: '通知提示、加载状态、骨架屏、动画效果',
    icon: '🎨',
    componentCount: 13,
    subcategories: [
      {
        id: 'notifications',
        name: '通知提示',
        description: '各种通知和提示组件',
        components: [
          { id: 'announcement', name: 'Announcement', description: '公告通知，重要信息展示', usage: 3 },
          { id: 'banner', name: 'Banner', description: '横幅通知，页面顶部提醒', usage: 4 },
          { id: 'snackbar', name: 'Snackbar', description: '消息提示，底部弹出通知', usage: 8 }
        ]
      },
      {
        id: 'empty-states',
        name: '空状态',
        description: '空数据和缺省状态',
        components: [
          { id: 'empty', name: 'Empty', description: '空状态，无数据展示', usage: 6 },
          { id: 'empty-state', name: 'EmptyState', description: '空状态组件，引导用户', usage: 5 },
          { id: 'result', name: 'Result', description: '结果状态，操作结果展示', usage: 4 }
        ]
      },
      {
        id: 'loading-states',
        name: '加载状态',
        description: '各种加载和骨架屏',
        components: [
          { id: 'loader', name: 'Loader', description: '加载器，加载动画', usage: 7 },
          { id: 'skeleton', name: 'Skeleton', description: '骨架屏，内容占位', usage: 9 },
          { id: 'skeleton-avatar', name: 'SkeletonAvatar', description: '头像骨架屏', usage: 5 },
          { id: 'skeleton-block', name: 'SkeletonBlock', description: '块状骨架屏', usage: 4 },
          { id: 'skeleton-text', name: 'SkeletonText', description: '文本骨架屏', usage: 6 }
        ]
      },
      {
        id: 'alerts',
        name: '警告提示',
        description: '各种警告和提示',
        components: [
          { id: 'inline-alert', name: 'InlineAlert', description: '内联警告，行内提示', usage: 3 }
        ]
      }
    ]
  },

  // 新增：其他专业组件 (19个)
  {
    id: 'other-components',
    name: '其他组件',
    description: '布局组件、导航组件、浮层组件',
    icon: '🧩',
    componentCount: 19,
    subcategories: [
      {
        id: 'layout-components',
        name: '布局组件',
        description: '页面布局和容器组件',
        components: [
          { id: 'app-layout', name: 'AppLayout', description: '应用布局，整体页面布局', usage: 5 },
          { id: 'gap', name: 'Gap', description: '间距组件，空白间隔', usage: 4 },
          { id: 'page-container', name: 'PageContainer', description: '页面容器，内容容器', usage: 6 },
          { id: 'space', name: 'Space', description: '空间组件，子元素间距', usage: 7 },
          { id: 'wrap', name: 'Wrap', description: '包裹组件，自动换行', usage: 3 }
        ]
      },
      {
        id: 'navigation-components',
        name: '导航组件',
        description: '各种导航和菜单组件',
        components: [
          { id: 'app-shell', name: 'AppShell', description: '应用外壳，页面框架', usage: 4 },
          { id: 'contextual-menu', name: 'ContextualMenu', description: '上下文菜单，右键菜单', usage: 5 },
          { id: 'link', name: 'Link', description: '链接组件，导航链接', usage: 8 },
          { id: 'nav-link', name: 'NavLink', description: '导航链接，当前状态高亮', usage: 6 },
          { id: 'nav-menu', name: 'NavMenu', description: '导航菜单，主导航', usage: 7 },
          { id: 'segmented-control', name: 'SegmentedControl', description: '分段控件，选项切换', usage: 4 },
          { id: 'sidenav', name: 'Sidenav', description: '侧边栏导航', usage: 5 },
          { id: 'skip-nav', name: 'SkipNav', description: '跳过导航，无障碍导航', usage: 2 },
          { id: 'stepper', name: 'Stepper', description: '步骤条，流程导航', usage: 6 },
          { id: 'topbar', name: 'Topbar', description: '顶部栏，页面顶部', usage: 5 }
        ]
      },
      {
        id: 'overlay-components',
        name: '浮层组件',
        description: '各种浮层和弹窗组件',
        components: [
          { id: 'confirm-dialog', name: 'ConfirmDialog', description: '确认对话框，操作确认', usage: 8 },
          { id: 'image-preview', name: 'ImagePreview', description: '图片预览，图片查看', usage: 5 },
          { id: 'side-panel', name: 'SidePanel', description: '侧边面板，滑出面板', usage: 6 }
        ]
      }
    ]
  },

  // 原有的其余类别...
  {
    id: 'display',
    name: '展示组件',
    description: '标题、文本、图标、分隔符、标签',
    icon: '📝',
    componentCount: 15,
    subcategories: [
      {
        id: 'typography',
        name: '文字排版',
        description: '标题、段落、文本样式',
        components: [
          {
            id: 'heading',
            name: 'Heading',
            description: '页面标题组件，支持不同级别和样式',
            element: 'h1',
            category: 'display',
            subcategory: 'typography',
            tags: ['heading', 'title', 'typography'],
            props: ['level', 'size', 'weight', 'children'],
            usage: 12,
            difficulty: 'beginner'
          },
          {
            id: 'text',
            name: 'Text',
            description: '正文文本组件，支持多种字体大小和颜色',
            element: 'p',
            category: 'display',
            subcategory: 'typography',
            tags: ['text', 'paragraph', 'typography'],
            props: ['size', 'color', 'weight', 'children'],
            usage: 15,
            difficulty: 'beginner'
          },
          {
            id: 'label',
            name: 'Label',
            description: '表单标签组件，用于描述输入框用途',
            element: 'label',
            category: 'display',
            subcategory: 'typography',
            tags: ['label', 'text', 'form'],
            props: ['for', 'required', 'children'],
            usage: 8,
            difficulty: 'beginner'
          }
        ]
      },
      {
        id: 'badge',
        name: '徽章标签',
        description: '状态标签、徽章、标记',
        components: [
          {
            id: 'badge',
            name: 'Badge',
            description: '徽章组件',
            element: 'span',
            category: 'display',
            subcategory: 'badge',
            tags: ['badge', 'status', 'indicator'],
            props: ['variant', 'size', 'children'],
            usage: 10,
            difficulty: 'beginner'
          },
          {
            id: 'tag',
            name: 'Tag',
            description: '标签组件',
            element: 'span',
            category: 'display',
            subcategory: 'badge',
            tags: ['tag', 'label', 'category'],
            props: ['color', 'closable', 'onClose', 'children'],
            usage: 7,
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'divider',
        name: '分隔分割',
        description: '分割线、间隔、布局分隔',
        components: [
          {
            id: 'divider',
            name: 'Divider',
            description: '分割线组件',
            element: 'hr',
            category: 'display',
            subcategory: 'divider',
            tags: ['divider', 'separator', 'layout'],
            props: ['orientation', 'dashed', 'text'],
            usage: 6,
            difficulty: 'beginner'
          }
        ]
      }
    ]
  },
  {
    id: 'feedback',
    name: '反馈组件',
    description: '提示、警告、消息、加载状态',
    icon: '💬',
    componentCount: 12,
    subcategories: [
      {
        id: 'alert',
        name: '警告提示',
        description: '警告、成功、错误、信息提示',
        components: [
          {
            id: 'alert',
            name: 'Alert',
            description: '页面内警告提示组件，用于显示成功、错误、警告、信息等重要提示信息',
            element: 'div',
            category: 'feedback',
            subcategory: 'alert',
            tags: ['alert', 'warning', 'message'],
            props: ['type', 'closable', 'showIcon', 'children'],
            usage: 9,
            difficulty: 'beginner'
          },
          {
            id: 'message',
            name: 'Message',
            description: '消息提示组件',
            element: 'div',
            category: 'feedback',
            subcategory: 'alert',
            tags: ['message', 'toast', 'notification'],
            props: ['type', 'duration', 'content', 'onClose'],
            usage: 11,
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'progress',
        name: '进度加载',
        description: '进度条、加载器、状态指示',
        components: [
          {
            id: 'progress',
            name: 'Progress',
            description: '进度条组件',
            element: 'div',
            category: 'feedback',
            subcategory: 'progress',
            tags: ['progress', 'bar', 'percentage'],
            props: ['percent', 'status', 'showInfo', 'strokeWidth'],
            usage: 7,
            difficulty: 'beginner'
          },
          {
            id: 'spinner',
            name: 'Spinner',
            description: '加载器组件',
            element: 'div',
            category: 'feedback',
            subcategory: 'progress',
            tags: ['spinner', 'loading', 'animation'],
            props: ['size', 'color', 'speed'],
            usage: 8,
            difficulty: 'beginner'
          }
        ]
      }
    ]
  },
  {
    id: 'navigation',
    name: '导航组件',
    description: '菜单、面包屑、分页、步骤条',
    icon: '🧭',
    componentCount: 10,
    subcategories: [
      {
        id: 'menu',
        name: '菜单导航',
        description: '导航菜单、下拉菜单、侧边栏',
        components: [
          {
            id: 'menu',
            name: 'Menu',
            description: '菜单组件',
            element: 'nav',
            category: 'navigation',
            subcategory: 'menu',
            tags: ['menu', 'navigation', 'sidebar'],
            props: ['items', 'mode', 'selectedKeys', 'onClick'],
            usage: 10,
            difficulty: 'intermediate'
          },
          {
            id: 'breadcrumb',
            name: 'Breadcrumb',
            description: '面包屑导航',
            element: 'nav',
            category: 'navigation',
            subcategory: 'menu',
            tags: ['breadcrumb', 'navigation', 'path'],
            props: ['items', 'separator'],
            usage: 6,
            difficulty: 'beginner'
          }
        ]
      },
      {
        id: 'pagination',
        name: '分页步骤',
        description: '分页器、步骤条、导航控制',
        components: [
          {
            id: 'pagination',
            name: 'Pagination',
            description: '分页组件',
            element: 'nav',
            category: 'navigation',
            subcategory: 'pagination',
            tags: ['pagination', 'page', 'navigation'],
            props: ['current', 'total', 'pageSize', 'onChange'],
            usage: 8,
            difficulty: 'intermediate'
          },
          {
            id: 'steps',
            name: 'Steps',
            description: '步骤条组件',
            element: 'div',
            category: 'navigation',
            subcategory: 'pagination',
            tags: ['steps', 'wizard', 'process'],
            props: ['current', 'items', 'direction'],
            usage: 5,
            difficulty: 'intermediate'
          }
        ]
      }
    ]
  },
  {
    id: 'layout',
    name: '布局组件',
    description: '栅格、容器、卡片、分割面板',
    icon: '📐',
    componentCount: 8,
    subcategories: [
      {
        id: 'grid',
        name: '栅格布局',
        description: '栅格系统、响应式布局',
        components: [
          {
            id: 'row',
            name: 'Row',
            description: '行组件',
            element: 'div',
            category: 'layout',
            subcategory: 'grid',
            tags: ['row', 'grid', 'layout'],
            props: ['gutter', 'align', 'justify'],
            usage: 9,
            difficulty: 'beginner'
          },
          {
            id: 'col',
            name: 'Col',
            description: '列组件',
            element: 'div',
            category: 'layout',
            subcategory: 'grid',
            tags: ['col', 'column', 'grid'],
            props: ['span', 'offset', 'push', 'pull'],
            usage: 9,
            difficulty: 'beginner'
          }
        ]
      },
      {
        id: 'container',
        name: '容器面板',
        description: '容器、卡片、分割面板',
        components: [
          {
            id: 'card',
            name: 'Card',
            description: '卡片组件',
            element: 'div',
            category: 'layout',
            subcategory: 'container',
            tags: ['card', 'container', 'panel'],
            props: ['title', 'extra', 'bordered', 'children'],
            usage: 12,
            difficulty: 'beginner'
          },
          {
            id: 'collapse',
            name: 'Collapse',
            description: '折叠面板',
            element: 'div',
            category: 'layout',
            subcategory: 'container',
            tags: ['collapse', 'accordion', 'panel'],
            props: ['items', 'activeKeys', 'onChange'],
            usage: 6,
            difficulty: 'intermediate'
          }
        ]
      }
    ]
  },
  {
    id: 'data-display',
    name: '数据展示',
    description: '表格、列表、树形控件、时间轴',
    icon: '📊',
    componentCount: 11,
    subcategories: [
      {
        id: 'table',
        name: '表格列表',
        description: '数据表格、列表展示',
        components: [
          {
            id: 'table',
            name: 'Table',
            description: '表格组件',
            element: 'table',
            category: 'data-display',
            subcategory: 'table',
            tags: ['table', 'data', 'grid'],
            props: ['columns', 'dataSource', 'pagination', 'rowSelection'],
            usage: 13,
            difficulty: 'advanced'
          },
          {
            id: 'list',
            name: 'List',
            description: '列表组件',
            element: 'div',
            category: 'data-display',
            subcategory: 'table',
            tags: ['list', 'items', 'display'],
            props: ['items', 'itemLayout', 'dataSource'],
            usage: 8,
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'tree',
        name: '树形结构',
        description: '树形控件、目录结构',
        components: [
          {
            id: 'tree',
            name: 'Tree',
            description: '树形组件',
            element: 'div',
            category: 'data-display',
            subcategory: 'tree',
            tags: ['tree', 'hierarchy', 'nested'],
            props: ['treeData', 'selectedKeys', 'expandedKeys', 'onSelect'],
            usage: 6,
            difficulty: 'advanced'
          },
          {
            id: 'timeline',
            name: 'Timeline',
            description: '时间轴组件',
            element: 'div',
            category: 'data-display',
            subcategory: 'tree',
            tags: ['timeline', 'history', 'events'],
            props: ['items', 'mode', 'position'],
            usage: 4,
            difficulty: 'intermediate'
          }
        ]
      }
    ]
  },
  {
    id: 'input-enhanced',
    name: '输入增强',
    description: '日期选择、颜色选择、文件上传、富文本',
    icon: '🎯',
    componentCount: 9,
    subcategories: [
      {
        id: 'picker',
        name: '选择器',
        description: '日期、时间、颜色选择器',
        components: [
          {
            id: 'datepicker',
            name: 'DatePicker',
            description: '日期选择器',
            element: 'input',
            category: 'input-enhanced',
            subcategory: 'picker',
            tags: ['date', 'picker', 'calendar'],
            props: ['value', 'onChange', 'format', 'disabled'],
            usage: 10,
            difficulty: 'intermediate'
          },
          {
            id: 'colorpicker',
            name: 'ColorPicker',
            description: '颜色选择器',
            element: 'input',
            category: 'input-enhanced',
            subcategory: 'picker',
            tags: ['color', 'picker', 'palette'],
            props: ['value', 'onChange', 'presetColors'],
            usage: 5,
            difficulty: 'intermediate'
          }
        ]
      },
      {
        id: 'upload',
        name: '上传编辑',
        description: '文件上传、富文本编辑器',
        components: [
          {
            id: 'upload',
            name: 'Upload',
            description: '文件上传组件',
            element: 'input',
            category: 'input-enhanced',
            subcategory: 'upload',
            tags: ['upload', 'file', 'drag'],
            props: ['accept', 'multiple', 'onChange', 'beforeUpload'],
            usage: 7,
            difficulty: 'advanced'
          },
          {
            id: 'editor',
            name: 'Editor',
            description: '富文本编辑器',
            element: 'div',
            category: 'input-enhanced',
            subcategory: 'upload',
            tags: ['editor', 'rich-text', 'wysiwyg'],
            props: ['value', 'onChange', 'toolbar', 'plugins'],
            usage: 4,
            difficulty: 'advanced'
          }
        ]
      }
    ]
  },
  {
    id: 'others',
    name: '其他组件',
    description: '工具类、拖拽、虚拟滚动、图片处理',
    icon: '🔧',
    componentCount: 6,
    subcategories: [
      {
        id: 'utility',
        name: '工具组件',
        description: '锚点、回到顶部、空状态',
        components: [
          {
            id: 'anchor',
            name: 'Anchor',
            description: '锚点组件',
            element: 'div',
            category: 'others',
            subcategory: 'utility',
            tags: ['anchor', 'link', 'navigation'],
            props: ['items', 'offset', 'affix'],
            usage: 3,
            difficulty: 'intermediate'
          },
          {
            id: 'backtop',
            name: 'BackTop',
            description: '回到顶部组件',
            element: 'button',
            category: 'others',
            subcategory: 'utility',
            tags: ['backtop', 'scroll', 'navigation'],
            props: ['visibilityHeight', 'onClick'],
            usage: 4,
            difficulty: 'beginner'
          },
          {
            id: 'empty',
            name: 'Empty',
            description: '空状态组件',
            element: 'div',
            category: 'others',
            subcategory: 'utility',
            tags: ['empty', 'placeholder', 'no-data'],
            props: ['image', 'description', 'children'],
            usage: 6,
            difficulty: 'beginner'
          }
        ]
      }
    ]
  }
]

export function useComponentLibraryV2() {
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedComponent, setSelectedComponent] = useState<ComponentExample | null>(null)

  // 获取当前选中的分类
  const currentCategory = useMemo(() => {
    return componentCategories.find(cat => cat.id === selectedCategory) || null
  }, [selectedCategory])

  // 获取当前选中的子分类
  const currentSubcategory = useMemo(() => {
    if (!currentCategory || !selectedSubcategory) return null
    return currentCategory.subcategories.find(sub => sub.id === selectedSubcategory) || null
  }, [currentCategory, selectedSubcategory])

  // 获取过滤后的组件
  const filteredComponents = useMemo(() => {
    let components: ComponentExample[] = []

    if (currentSubcategory) {
      components = currentSubcategory.components
    } else if (currentCategory) {
      components = currentCategory.subcategories.flatMap(sub => sub.components)
    } else {
      components = componentCategories.flatMap(cat =>
        cat.subcategories.flatMap(sub => sub.components)
      )
    }

    // 应用搜索过滤
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase()
      components = components.filter(comp =>
        comp.name.toLowerCase().includes(lowerSearchTerm) ||
        comp.description.toLowerCase().includes(lowerSearchTerm) ||
        comp.tags.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      )
    }

    return components
  }, [currentCategory, currentSubcategory, searchTerm])

  // 获取组件总数
  const totalComponentCount = useMemo(() => {
    return componentCategories.reduce((total, cat) =>
      total + cat.subcategories.reduce((subTotal, sub) =>
        subTotal + sub.components.length, 0
      ), 0
    )
  }, [])

  // 组件操作函数
  const handleComponentClick = useCallback((component: ComponentExample) => {
    setSelectedComponent(component)
  }, [])

  const handleCloseDetails = useCallback(() => {
    setSelectedComponent(null)
  }, [])

  const handleCategorySelect = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory('')
  }, [])

  const handleSubcategorySelect = useCallback((categoryId: string, subcategoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubcategory(subcategoryId)
  }, [])

  return {
    // 数据
    componentCategories,
    currentCategory,
    currentSubcategory,
    filteredComponents,
    totalComponentCount,
    selectedComponent,

    // 状态
    searchTerm,
    selectedCategory,
    selectedSubcategory,

    // 操作函数
    setSearchTerm,
    handleComponentClick,
    handleCloseDetails,
    handleCategorySelect,
    handleSubcategorySelect
  }
}