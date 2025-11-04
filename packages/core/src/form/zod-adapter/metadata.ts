/**
 * @fileoverview ZodAdapter 组件元数据
 * @description Zod 验证适配器组件的完整元数据定义
 */

export const zodAdapterMetadata = {
  // 基础信息
  name: 'ZodAdapter',
  displayName: 'Zod 验证适配器',
  version: '1.0.0',
  stability: 'stable' as const,
  category: 'forms',
  layer: 'component',

  // 功能标签
  tags: [
    'validation',
    'zod',
    'form',
    'schema',
    'typescript',
    'adapter',
    'realtime-validation',
    'async-validation',
    'field-validation',
    'custom-error-messages',
    'validation-timing',
    'conditional-validation',
    'array-validation',
    'nested-object-validation',
    'type-inference',
    'error-formatting',
    'accessibility',
  ],

  // 架构信息
  architecture: {
    ssot_version: 'v2025.11.03',
    component_layer: true,
    dependency_level: 4,
    dependencies: ['primitives', 'utils', 'forms', 'zod'],
  },

  // 特性列表
  features: {
    core: [
      {
        name: 'Zod 模式验证适配器',
        description: '将 Zod 验证与 Xorigo UI 组件无缝集成',
        status: 'stable' as const,
      },
      {
        name: '实时验证',
        description: '支持 onChange 和 onBlur 实时验证',
        status: 'stable' as const,
      },
      {
        name: '异步验证',
        description: '支持异步验证函数和远程验证',
        status: 'stable' as const,
      },
      {
        name: '字段级验证',
        description: '支持单个字段的独立验证',
        status: 'stable' as const,
      },
      {
        name: '自定义错误消息',
        description: '支持自定义验证错误消息',
        status: 'stable' as const,
      },
      {
        name: '验证时机控制',
        description: '可控制验证触发时机 (onChange/onBlur/onSubmit)',
        status: 'stable' as const,
      },
      {
        name: '条件验证',
        description: '支持基于其他字段值的条件验证',
        status: 'stable' as const,
      },
      {
        name: '数组验证',
        description: '支持数组类型字段的验证',
        status: 'stable' as const,
      },
      {
        name: '嵌套对象验证',
        description: '支持嵌套对象的深度验证',
        status: 'stable' as const,
      },
      {
        name: '类型推断',
        description: '基于 Zod 模式自动推断 TypeScript 类型',
        status: 'stable' as const,
      },
      {
        name: '错误格式化',
        description: '将 ZodError 转换为字段错误对象',
        status: 'stable' as const,
      },
      {
        name: 'TypeScript 类型安全',
        description: '提供完整的 TypeScript 类型支持',
        status: 'stable' as const,
      },
      {
        name: 'Zod 深度集成',
        description: '深度集成 Zod 库的所有功能',
        status: 'stable' as const,
      },
      {
        name: '可访问性支持',
        description: '提供 ARIA 属性和键盘导航支持',
        status: 'stable' as const,
      },
    ],
  },

  // 变体配置
  variants: [
    { name: 'default', description: '默认变体，带背景和间距', status: 'stable' as const },
    { name: 'minimal', description: '简洁变体，无背景，紧密间距', status: 'stable' as const },
    { name: 'bordered', description: '边框变体，带边框和内边距', status: 'stable' as const },
  ],

  // 尺寸配置
  sizes: [
    { name: 'sm', description: '小尺寸', status: 'stable' as const },
    { name: 'md', description: '中等尺寸（默认）', status: 'stable' as const },
    { name: 'lg', description: '大尺寸', status: 'stable' as const },
    { name: 'xl', description: '特大尺寸', status: 'stable' as const },
  ],

  // 主题集成
  theme_integration: {
    supported: true,
    seven_axis_compatible: true,
    token_usage: ['color', 'spacing', 'typography', 'border', 'shadow'],
    auto_adaptation: true,
  },

  // API 配置
  api: {
    props: {
      required: ['schema'],
      optional: [
        'initialValues',
        'validateOnChange',
        'validateOnBlur',
        'showSubmitButton',
        'showResetButton',
        'submitButtonLabel',
        'resetButtonLabel',
        'showSubmittingState',
        'showValidationErrors',
        'enableReinitialize',
        'onSubmit',
        'onReset',
        'adapterDisabled',
        'adapterReadonly',
        'variant',
        'size',
        'disabled',
        'className',
        'children',
      ],
    },
    context: [
      'useZodAdapter',
      'getFieldProps',
      'validateField',
      'validateForm',
      'setFieldValue',
      'setFieldTouched',
      'resetForm',
    ],
    hooks: ['useZodField', 'useZodForm', 'useZodSubmit', 'useZodReset'],
  },

  // 事件处理
  events: [
    {
      name: 'onSubmit',
      description: '表单提交时触发',
      payload: 'values: T, context: ZodAdapterContextValue',
    },
    {
      name: 'onReset',
      description: '表单重置时触发',
      payload: 'void',
    },
  ],

  // 可访问性
  accessibility: {
    aria_support: true,
    keyboard_navigation: true,
    screen_reader: true,
    role: 'form',
    attributes: ['aria-busy', 'aria-invalid', 'aria-describedby'],
  },

  // 性能优化
  performance: {
    lazy_validation: true,
    debounce_validation: true,
    memoization: true,
    re_renders: 'optimized',
  },

  // 测试覆盖
  testing: {
    unit_tests: true,
    integration_tests: true,
    accessibility_tests: true,
    visual_tests: true,
    coverage_target: '> 90%',
  },

  // 使用场景
  use_cases: [
    '用户注册表单验证',
    '产品信息表单验证',
    '联系表单验证',
    '复杂表单数据验证',
    '类型安全的表单处理',
    '实时输入校验',
    '异步验证需求',
    '嵌套对象验证',
    '数组字段验证',
    '条件依赖验证',
  ],

  // 最佳实践
  best_practices: [
    '使用 TypeScript 泛型确保类型安全',
    '在 onChange 和 onBlur 之间选择合适的验证时机',
    '为复杂验证创建自定义 Zod 模式',
    '使用 Context API 访问表单状态',
    '提供有意义的自定义错误消息',
    '在提交前验证整个表单',
    '使用 useZodField 钩子获取字段属性',
    '启用 enableReinitialize 以支持动态初始值',
    '利用 Zod 的类型推断减少类型定义',
    '为异步验证添加适当的加载状态',
  ],

  // 相关组件
  related_components: [
    {
      name: 'FormikAdapter',
      relationship: 'similar' as const,
      description: 'Formik 表单适配器',
    },
    {
      name: 'FormProvider',
      relationship: 'complementary' as const,
      description: '表单提供者',
    },
    {
      name: 'Form',
      relationship: 'complementary' as const,
      description: '表单容器',
    },
    {
      name: 'FormField',
      relationship: 'complementary' as const,
      description: '字段容器',
    },
    {
      name: 'FormItem',
      relationship: 'complementary' as const,
      description: '表单项容器',
    },
    {
      name: 'ErrorMessage',
      relationship: 'complementary' as const,
      description: '错误消息显示',
    },
    {
      name: 'ValidationMessage',
      relationship: 'complementary' as const,
      description: '验证消息显示',
    },
  ],

  // 导出信息
  exports: {
    components: ['ZodAdapter'],
    hooks: ['useZodAdapter', 'useZodField', 'useZodForm', 'useZodSubmit', 'useZodReset'],
    types: ['ZodAdapterProps', 'ZodAdapterContextValue'],
    utilities: [
      'zodAdapterVariants',
      'formContentVariants',
      'submitButtonVariants',
      'resetButtonVariants',
      'createZodValidationRule',
      'createAsyncZodValidator',
      'createRequiredValidator',
      'createEmailValidator',
      'createMinLengthValidator',
      'createMaxLengthValidator',
    ],
    constants: ['ZOD_ADAPTER_VARIANTS', 'ZOD_ADAPTER_SIZES', 'ZOD_ADAPTER_DEFAULTS'],
  },

  // 性能指标
  performance_metrics: {
    bundle_size: {
      minified: '< 15KB',
      gzipped: '< 5KB',
    },
    render_time: {
      initial: '< 16ms',
      update: '< 8ms',
    },
    validation_time: {
      field: '< 5ms',
      form: '< 20ms',
      async: '< 100ms',
    },
  },

  // 浏览器支持
  browser_support: {
    chrome: '>= 88',
    firefox: '>= 85',
    safari: '>= 14',
    edge: '>= 88',
  },

  // 兼容性
  compatibility: {
    react: '^18.0.0 || ^19.0.0',
    typescript: '~5.9.3',
    zod: '^3.0.0',
  },

  // 状态
  status: {
    development: 'complete',
    testing: 'complete',
    documentation: 'complete',
    ready_for_production: true,
    deprecated: false,
  },

  // 维护信息
  maintenance: {
    owner: 'Xorigo UI Team',
    created_date: '2025-11-04',
    last_updated: '2025-11-04',
    next_review: '2026-11-04',
  },
} as const
