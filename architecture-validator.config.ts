/**
 * Architecture Validator Configuration
 * 用于确保重构过程严格遵循v2.0架构设计
 */

export const architectureConfig = {
  version: '2.0',
  strictMode: true,
  zeroOverlap: true,

  // 模块定义和边界
  modules: {
    components: {
      path: 'apps/website/app/(dashboard)/components',
      allowedFeatures: ['display', 'copy', 'search', 'filter'],
      forbiddenFeatures: ['edit', 'combine', 'template', 'teach'],
      dependencies: ['@xorigo-ui/core'],
    },

    workbench: {
      path: 'apps/website/app/(dashboard)/workbench',
      allowedFeatures: ['edit', 'experiment', 'preview', 'customize'],
      forbiddenFeatures: ['browse-library', 'download-template', 'teach'],
      dependencies: ['@xorigo-ui/core', 'monaco-editor'],
      modes: ['gallery', 'editor', 'split'],
    },

    tools: {
      path: 'apps/website/app/(dashboard)/tools',
      allowedFeatures: ['independent-tools', 'export-results'],
      forbiddenFeatures: ['component-edit', 'project-manage'],
      dependencies: [], // 工具必须独立，不依赖其他模块
      requireIndependence: true,
    },

    templates: {
      path: 'apps/website/app/(dashboard)/templates',
      allowedFeatures: ['complete-project', 'download', 'clone'],
      forbiddenFeatures: ['single-component', 'online-edit'],
      dependencies: ['@xorigo-ui/core'],
    },

    docs: {
      path: 'apps/website/app/(content)/docs',
      allowedFeatures: ['technical-reference', 'api-docs'],
      forbiddenFeatures: ['interactive-tutorial', 'video', 'design-guide'],
      dependencies: [],
    },

    showcase: {
      path: 'apps/website/app/(content)/showcase',
      allowedFeatures: ['display-works', 'inspiration'],
      forbiddenFeatures: ['source-code', 'template-download', 'tutorial'],
      dependencies: [],
    },
  },

  // 验证规则
  validationRules: {
    // 功能重叠检测
    overlapDetection: {
      enabled: true,
      threshold: 0, // 零容忍重叠
      action: 'block', // 发现重叠立即阻止
    },

    // 依赖验证
    dependencyValidation: {
      checkCircular: true,
      checkUnused: true,
      checkForbidden: true,
    },

    // 文件位置验证
    fileLocationValidation: {
      enforceModuleBoundaries: true,
      preventCrossModuleImports: true,
    },
  },

  // 架构校验点
  checkpoints: [
    {
      name: 'pre-commit',
      checks: ['module-boundaries', 'feature-overlap', 'dependencies'],
    },
    {
      name: 'pre-build',
      checks: ['imports', 'types', 'api-boundaries'],
    },
    {
      name: 'post-build',
      checks: ['functionality', 'performance', 'architecture-compliance'],
    },
  ],

  // 报告配置
  reporting: {
    outputPath: 'architecture-validation-reports',
    format: ['json', 'html', 'markdown'],
    includeMetrics: true,
    trackProgress: true,
  },
}

// 验证函数
export function validateArchitecture(
  module: string,
  feature: string
): { valid: boolean; message?: string } {
  const moduleConfig = architectureConfig.modules[module]

  if (!moduleConfig) {
    return { valid: false, message: `Unknown module: ${module}` }
  }

  if (moduleConfig.forbiddenFeatures.includes(feature)) {
    return {
      valid: false,
      message: `Feature "${feature}" is forbidden in module "${module}"`,
    }
  }

  if (!moduleConfig.allowedFeatures.includes(feature)) {
    return {
      valid: false,
      message: `Feature "${feature}" is not allowed in module "${module}"`,
    }
  }

  return { valid: true }
}

// 重叠检测函数
export function detectOverlap(
  module1: string,
  module2: string
): { hasOverlap: boolean; overlappingFeatures?: string[] } {
  const config1 = architectureConfig.modules[module1]
  const config2 = architectureConfig.modules[module2]

  if (!config1 || !config2) {
    return { hasOverlap: false }
  }

  const overlapping = config1.allowedFeatures.filter((feature) =>
    config2.allowedFeatures.includes(feature)
  )

  return {
    hasOverlap: overlapping.length > 0,
    overlappingFeatures: overlapping,
  }
}