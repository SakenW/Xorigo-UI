# Next.js 架构优化 Skill

**触发条件**：当需要优化 Next.js 应用架构、配置 App Router 模式、实现 SSG/ISR 策略时触发

## 功能描述

基于 Xorigo UI Next.js 架构文档，自动化优化 Next.js 应用架构，确保严格依赖原则、组件展示完整性和性能优化。

## 核心能力

### 1. 架构合规性验证器
验证 Next.js 应用是否符合 Xorigo UI 架构约束：

```typescript
// 架构合规性验证器
class ArchitectureComplianceValidator {
  validateArchitecture(projectPath: string): ArchitectureComplianceResult {
    const result: ArchitectureComplianceResult = {
      compliant: true,
      violations: [],
      warnings: [],
      recommendations: [],
      score: 100
    }

    // 1. 验证依赖关系
    this.validateDependencyConstraints(projectPath, result)

    // 2. 验证目录结构
    this.validateDirectoryStructure(projectPath, result)

    // 3. 验证组件使用模式
    this.validateComponentUsage(projectPath, result)

    // 4. 验证样式系统集成
    this.validateStyleSystemIntegration(projectPath, result)

    // 5. 验证配置文件
    this.validateConfigurationFiles(projectPath, result)

    // 计算最终得分
    result.score = this.calculateComplianceScore(result)

    return result
  }

  private validateDependencyConstraints(projectPath: string, result: ArchitectureComplianceResult): void {
    // 检查 package.json 依赖
    const packageJson = this.readPackageJson(path.join(projectPath, 'package.json'))

    // 验证严格依赖原则
    if (!packageJson.dependencies || !packageJson.dependencies['@xorigo-ui/core']) {
      result.violations.push({
        type: 'missing_core_dependency',
        message: '缺少 @xorigo-ui/core 依赖',
        severity: 'error',
        recommendation: '添加 "dependencies": { "@xorigo-ui/core": "workspace:*" }'
      })
    }

    // 检查禁用的 UI 组件库
    const prohibitedLibraries = [
      'antd', 'antd-design',
      'chakra-ui', '@chakra-ui/react',
      '@mui/material', '@mui/icons-material',
      'semantic-ui-react',
      'react-bootstrap',
      '@blueprintjs/core',
      '@mantine/core',
      'primereact',
      'reactstrap'
    ]

    const allDependencies = {
      ...packageJson.dependencies,
      ...packageJson.devDependencies
    }

    Object.keys(allDependencies).forEach(dep => {
      if (prohibitedLibraries.some(prohibited => dep.includes(prohibited))) {
        result.violations.push({
          type: 'prohibited_ui_library',
          message: `使用了禁用的 UI 组件库: ${dep}`,
          severity: 'error',
          recommendation: `移除 ${dep}，所有 UI 组件应来自 @xorigo-ui/core`
        })
      }
    })

    // 检查样式库
    const styleLibraries = ['tailwindcss', '@tailwindcss/typography', '@tailwindcss/forms']
    const hasStyleLibraries = styleLibraries.some(lib => allDependencies[lib])

    if (!hasStyleLibraries) {
      result.warnings.push({
        type: 'missing_style_library',
        message: '建议添加 Tailwind CSS 相关依赖',
        severity: 'warning',
        recommendation: '添加 tailwindcss, @tailwindcss/typography, @tailwindcss/forms'
      })
    }
  }

  private validateDirectoryStructure(projectPath: string, result: ArchitectureComplianceResult): void {
    const requiredDirectories = [
      'app',
      'app/gallery',
      'app/adoption',
      'app/playground',
      'components',
      'lib',
      'public'
    ]

    requiredDirectories.forEach(dir => {
      const dirPath = path.join(projectPath, dir)
      if (!fs.existsSync(dirPath)) {
        result.violations.push({
          type: 'missing_directory',
          message: `缺少必需目录: ${dir}`,
          severity: 'error',
          recommendation: `创建目录: ${dir}`
        })
      }
    })

    // 检查 app 目录结构
    const appPath = path.join(projectPath, 'app')
    if (fs.existsSync(appPath)) {
      const appContents = fs.readdirSync(appPath)

      // 检查 layout.tsx
      if (!appContents.includes('layout.tsx')) {
        result.violations.push({
          type: 'missing_layout',
          message: '缺少根布局文件: app/layout.tsx',
          severity: 'error',
          recommendation: '创建 app/layout.tsx 文件'
        })
      }

      // 检查 globals.css
      if (!appContents.includes('globals.css')) {
        result.warnings.push({
          type: 'missing_globals_css',
          message: '缺少全局样式文件: app/globals.css',
          severity: 'warning',
          recommendation: '创建 app/globals.css 文件'
        })
      }
    }

    // 检查 components 目录
    const componentsPath = path.join(projectPath, 'components')
    if (fs.existsSync(componentsPath)) {
      this.validateComponentsDirectory(componentsPath, result)
    }
  }

  private validateComponentUsage(projectPath: string, result: ArchitectureComplianceResult): void {
    const files = this.getAllTypeScriptFiles(projectPath)

    files.forEach(file => {
      const content = fs.readFileSync(file, 'utf-8')

      // 检查是否从 @xorigo-ui/core 导入组件
      const hasCoreImport = content.includes('@xorigo-ui/core')
      const hasComponentImports = /import\s*\{[^}]+\}\s*from\s*['"]@xorigo-ui/core['"]/.test(content)

      if (hasComponentImports && !hasCoreImport) {
        // 验证导入的组件是否来自正确的包
        const importMatch = content.match(/import\s*\{([^}]+)\}\s*from\s*['"]([^'"]+)['"]/)
        if (importMatch && importMatch[2] !== '@xorigo-ui/core') {
          result.violations.push({
            type: 'invalid_component_import',
            message: `组件导入来源不正确: ${importMatch[2]}`,
            file: path.relative(projectPath, file),
            severity: 'error',
            recommendation: '所有组件都应从 @xorigo-ui/core 导入'
          })
        }
      }

      // 检查是否直接重新实现组件
      const directImplementation = /export\s+(const|function)\s+\w+.*=.*<.*>(?=.*React\.createElement|React\.Component|return\s*<)/.test(content)
      const hasCoreComponents = /Button|Card|Input|Modal/.test(content)

      if (directImplementation && hasCoreComponents && !content.includes('@xorigo-ui/core')) {
        result.violations.push({
          type: 'direct_component_implementation',
          message: '直接重新实现已有组件',
          file: path.relative(projectPath, file),
          severity: 'error',
          recommendation: '从 @xorigo-ui/core 导入组件，不要重新实现'
        })
      }

      // 检查样式定义
      const styleDefinitions = /className:\s*['"`][^'"`]*['"`]|styled\(|@apply|tailwindcss/.test(content)
      const hasCustomStyles = styleDefinitions && !content.includes('@xorigo-ui/core')

      if (hasCustomStyles && !content.includes('@xorigo-ui/core')) {
        result.warnings.push({
          type: 'custom_style_without_core',
          message: '使用了自定义样式但未集成组件库',
          file: path.relative(projectPath, file),
          severity: 'warning',
          recommendation: '集成 @xorigo-ui/core 的样式系统'
        })
      }
    })
  }

  private validateStyleSystemIntegration(projectPath: string, result: ArchitectureComplianceResult): void {
    // 检查 Tailwind 配置
    const tailwindConfigPath = path.join(projectPath, 'tailwind.config.ts')
    const tailwindJsConfigPath = path.join(projectPath, 'tailwind.config.js')

    let tailwindConfig: any = null
    if (fs.existsSync(tailwindConfigPath)) {
      try {
        tailwindConfig = require(tailwindConfigPath)
      } catch (error) {
        result.warnings.push({
          type: 'tailwind_config_error',
          message: 'Tailwind 配置文件加载失败',
          severity: 'warning',
          recommendation: '检查 tailwind.config.ts 语法'
        })
        return
      }
    } else if (fs.existsSync(tailwindJsConfigPath)) {
      tailwindConfig = require(tailwindJsConfigPath)
    }

    if (!tailwindConfig) {
      result.violations.push({
        type: 'missing_tailwind_config',
        message: '缺少 Tailwind CSS 配置文件',
        severity: 'error',
        recommendation: '创建 tailwind.config.ts 文件'
      })
      return
    }

    // 验证 Tailwind 配置
    if (!tailwindConfig.content || tailwindConfig.content.length === 0) {
      result.violations.push({
        type: 'missing_tailwind_content',
        message: 'Tailwind 配置缺少 content 路径',
        severity: 'error',
        recommendation: '设置 content: ["./src/**/*.{ts,tsx}"]'
      })
    }

    // 检查颜色配置
    if (!tailwindConfig.theme || !tailwindConfig.theme.extend || !tailwindConfig.theme.extend.colors) {
      result.warnings.push({
        type: 'missing_color_extension',
        message: 'Tailwind 配置缺少颜色扩展',
        severity: 'warning',
        recommendation: '添加颜色扩展以支持组件库主题'
      })
    }

    // 检查全局样式文件
    const globalsCssPath = path.join(projectPath, 'app/globals.css')
    if (fs.existsSync(globalsCssPath)) {
      const globalsContent = fs.readFileSync(globalsCssPath, 'utf-8')

      // 检查是否引用了组件库样式
      if (!globalsContent.includes('@xorigo-ui/core') && !globalsContent.includes('@tailwindcss')) {
        result.warnings.push({
          type: 'globals_css_missing_references',
          message: '全局样式文件缺少必要引用',
          severity: 'warning',
          recommendation: '添加 @tailwindcss/base 和 @tailwindcss/components 引用'
        })
      }
    }
  }

  private validateConfigurationFiles(projectPath: string, result: ArchitectureComplianceResult): void {
    // 检查 Next.js 配置
    const nextConfigPath = path.join(projectPath, 'next.config.js')
    if (!fs.existsSync(nextConfigPath)) {
      result.violations.push({
        type: 'missing_next_config',
        message: '缺少 next.config.js 配置文件',
        severity: 'error',
        recommendation: '创建 next.config.js 文件并配置必要选项'
      })
      return
    }

    const nextConfig = require(nextConfigPath)

    // 验证关键配置
    if (!nextConfig.transpilePackages || !nextConfig.transpilePackages.includes('@xorigo-ui/core')) {
      result.warnings.push({
        type: 'missing_transpile_packages',
        message: 'Next.js 配置缺少 transpilePackages',
        severity: 'warning',
        recommendation: '添加 transpilePackages: ["@xorigo-ui/core"]'
      })
    }

    // 检查图像域名配置
    if (!nextConfig.images || !nextConfig.images.domains) {
      result.warnings.push({
        type: 'missing_image_domains',
        message: 'Next.js 配置缺少图像域名配置',
        severity: 'warning',
        recommendation: '配置 images.domains 以支持外部图片'
      })
    }

    // 检查实验性特性
    if (!nextConfig.experimental) {
      result.warnings.push({
        type: 'missing_experimental_features',
        message: 'Next.js 配置缺少实验性特性',
        severity: 'info',
        recommendation: '启用 serverActions 和 ppr 特性'
      })
    }

    // 检查 Turbo 配置
    const turboConfigPath = path.join(projectPath, '..', 'turbo.json')
    if (!fs.existsSync(turboConfigPath)) {
      result.warnings.push({
        type: 'missing_turbo_config',
        message: '缺少 Turbo 配置文件',
        severity: 'warning',
        recommendation: '创建 turbo.json 文件以优化 monorepo 构建'
      })
    }
  }
}
```

### 2. 性能优化器
优化 Next.js 应用的性能配置：

```typescript
// 性能优化器
class PerformanceOptimizer {
  optimizeConfiguration(projectPath: string): OptimizationResult {
    const result: OptimizationResult = {
      optimizations: [],
      performanceMetrics: {},
      recommendations: [],
      estimatedImprovements: {}
    }

    // 1. 优化 Next.js 配置
    const nextConfigOptimization = this.optimizeNextConfig(projectPath)
    result.optimizations.push(nextConfigOptimization)

    // 2. 优化 Tailwind 配置
    const tailwindOptimization = this.optimizeTailwindConfig(projectPath)
    result.optimizations.push(tailwindOptimization)

    // 3. 优化组件使用
    const componentOptimization = this.optimizeComponentUsage(projectPath)
    result.optimizations.push(componentOptimization)

    // 4. 优化图片配置
    const imageOptimization = this.optimizeImageConfiguration(projectPath)
    result.optimizations.push(imageOptimization)

    // 5. 优化构建配置
    const buildOptimization = this.optimizeBuildConfiguration(projectPath)
    result.optimizations.push(buildOptimization)

    return result
  }

  private optimizeNextConfig(projectPath: string): Optimization {
    const nextConfigPath = path.join(projectPath, 'next.config.js')
    const optimizedConfig = this.generateOptimizedNextConfig()

    return {
      type: 'next_config',
      description: '优化 Next.js 配置以提高性能',
      changes: [
        {
          action: 'enable_sw_minification',
          description: '启用 SWC 压缩以加快构建速度',
          before: '// 缺少 SWC 配置',
          after: 'swcMinify: true,'
        },
        {
          action: 'enable_image_optimization',
          description: '启用图像优化和格式支持',
          before: '// 基础图像配置',
          after: 'images: { domains: ["cdn.thui.dev"], formats: ["image/avif", "image/webp"] },'
        },
        {
          action: 'enable_experimental_features',
          description: '启用实验性特性以提高性能',
          before: '// 缺少实验性特性',
          after: 'experimental: { ppr: true, serverActions: true, optimizeCss: true },'
        },
        {
          action: 'configure_transpile_packages',
          description: '配置包转译以优化运行时性能',
          before: '// 缺少转译配置',
          after: 'transpilePackages: ["@xorigo-ui/core"],'
        },
        {
          action: 'enable_compression',
          description: '启用 gzip 压缩',
          before: '// 缺少压缩配置',
          after: 'compress: true,'
        }
      ],
      config: optimizedConfig,
      estimatedImprovement: {
        buildTime: '-30%',
        bundleSize: '-20%',
        runtimePerformance: '+15%'
      }
    }
  }

  private optimizeTailwindConfig(projectPath: string): Optimization {
    const optimizedConfig = this.generateOptimizedTailwindConfig()

    return {
      type: 'tailwind_config',
      description: '优化 Tailwind CSS 配置以提高样式性能',
      changes: [
        {
          action: 'enable_purge',
          description: '启用 PurgeCSS 以移除未使用的样式',
          before: '// 缺少 PurgeCSS 配置',
          after: 'content: ["./src/**/*.{ts,tsx}"], purge: { layers: ["html", "components"] }'
        },
        {
          action: 'optimize_color_variables',
          description: '使用 CSS 变量优化颜色系统',
          before: '// 硬编码颜色值',
          after: 'colors: { primary: { 50: "var(--color-primary-50)", 500: "var(--color-primary-500)" } }'
        },
        {
          action: 'add_optimized_spacing',
          description: '使用间距变量优化布局',
          before: '// 硬编码间距值',
          after: 'spacing: { xs: "var(--spacing-xs)", sm: "var(--spacing-sm)" } }'
        }
      ],
      config: optimizedConfig,
      estimatedImprovement: {
        cssSize: '-25%',
        stylePerformance: '+10%'
      }
    }
  }

  private optimizeComponentUsage(projectPath: string): Optimization {
    const optimizationStrategies = this.generateComponentOptimizationStrategies()

    return {
      type: 'component_optimization',
      description: '优化组件使用以提高运行时性能',
      changes: optimizationStrategies,
      estimatedImprovement: {
        renderPerformance: '+20%',
        bundleSize: '-15%',
        memoryUsage: '-10%'
      }
    }
  }

  private optimizeImageConfiguration(projectPath: string): Optimization {
    const imageOptimizations = this.generateImageOptimizations()

    return {
      type: 'image_optimization',
      description: '优化图像配置以提高加载性能',
      changes: imageOptimizations,
      estimatedImprovement: {
        imageLoadTime: '-40%',
        bandwidth: '-30%',
        lighthouseScore: '+15'
      }
    }
  }

  private optimizeBuildConfiguration(projectPath: string): Optimization {
    const buildOptimizations = this.generateBuildOptimizations()

    return {
      type: 'build_optimization',
      description: '优化构建配置以提高开发体验',
      changes: buildOptimizations,
      estimatedImprovement: {
        developmentSpeed: '+25%',
        hotReload: '+20%',
        buildTime: '-35%'
      }
    }
  }

  private generateOptimizedNextConfig(): string {
    return `/** @type {import('next').NextConfig} */
const nextConfig = {
  // 性能优化配置
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 图像优化配置
  images: {
    domains: ['cdn.thui.dev', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000, // 1年
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // 实验性特性
  experimental: {
    ppr: true, // Partial Prerendering
    serverActions: true, // Server Actions
    optimizeCss: true, // CSS 优化
    largePageDataBytes: 128 * 1000, // 128KB
  },

  // 包转译配置
  transpilePackages: ['@xorigo-ui/core'],

  // 压缩配置
  compress: true,

  // 输出配置
  output: 'standalone',

  // 重定向配置
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ]
  },

  // 头部配置
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}

export default nextConfig`
  }
}
```

### 3. SSG/ISR 策略生成器
生成静态生成和增量再生策略：

```typescript
// SSG/ISR 策略生成器
class SSRIStrategyGenerator {
  generateStrategy(projectPath: string): SSRIStrategy {
    const pageAnalysis = this.analyzePages(projectPath)

    return {
      staticPages: this.generateStaticPageStrategy(pageAnalysis),
      isrPages: this.generateISRPageStrategy(pageAnalysis),
      dynamicPages: this.generateDynamicPageStrategy(pageAnalysis),
      hybridStrategy: this.generateHybridStrategy(pageAnalysis),
      revalidationPlan: this.generateRevalidationPlan(pageAnalysis),
      performanceMetrics: this.estimatePerformanceMetrics(pageAnalysis)
    }
  }

  private analyzePages(projectPath: string): PageAnalysis {
    const analysis: PageAnalysis = {
      pages: [],
      dataDependencies: new Map(),
      routePatterns: [],
      complexityScores: {}
    }

    // 分析 app 目录结构
    const appPath = path.join(projectPath, 'app')
    this.analyzeAppDirectory(appPath, analysis)

    // 分析组件依赖
    this.analyzeComponentDependencies(projectPath, analysis)

    // 计算复杂度分数
    this.calculateComplexityScores(analysis)

    return analysis
  }

  private generateStaticPageStrategy(analysis: PageAnalysis): StaticPageStrategy {
    const strategy: StaticPageStrategy = {
      pages: [],
      buildTime: {},
      bundleSize: {},
      lighthouseScores: {}
    }

    // 识别适合 SSG 的页面
    analysis.pages.forEach(page => {
      const score = analysis.complexityScores[page.path]

      // 低复杂度页面适合 SSG
      if (score <= 3) {
        strategy.pages.push({
          path: page.path,
          strategy: 'ssg',
          revalidate: null,
          buildTime: 'fast',
          estimatedSize: this.estimatePageSize(page),
          lighthouseScore: 95
        })

        // 生成 generateStaticParams
        if (page.dynamicSegments) {
          strategy.buildTime.generateStaticParams = this.estimateGenerateStaticParamsTime(page)
        }
      }
    })

    return strategy
  }

  private generateISRPageStrategy(analysis: PageAnalysis): ISRPageStrategy {
    const strategy: ISRPageStrategy = {
      pages: [],
      revalidationTimes: {},
      cacheHitRates: {},
      performanceMetrics: {}
    }

    // 识别适合 ISR 的页面
    analysis.pages.forEach(page => {
      const score = analysis.complexityScores[page.path]

      // 中等复杂度页面适合 ISR
      if (score > 3 && score <= 7) {
        const revalidateTime = this.calculateOptimalRevalidateTime(page)

        strategy.pages.push({
          path: page.path,
          strategy: 'isr',
          revalidate: revalidateTime,
          cacheHitRate: this.estimateCacheHitRate(page),
          buildTime: 'medium',
          estimatedSize: this.estimatePageSize(page)
        })

        strategy.revalidationTimes[page.path] = revalidateTime
        strategy.cacheHitRates[page.path] = this.estimateCacheHitRate(page)
      }
    })

    return strategy
  }

  private generateDynamicPageStrategy(analysis: PageAnalysis): DynamicPageStrategy {
    const strategy: DynamicPageStrategy = {
      pages: [],
      streamingSupported: {},
      performanceOptimizations: {}
    }

    // 识别需要动态渲染的页面
    analysis.pages.forEach(page => {
      const score = analysis.complexityScores[page.path]

      // 高复杂度页面需要动态渲染
      if (score > 7) {
        strategy.pages.push({
          path: page.path,
          strategy: 'dynamic',
          streaming: this.supportsStreaming(page),
          buildTime: 'slow',
          performanceOptimizations: this.getPerformanceOptimizations(page)
        })

        strategy.streamingSupported[page.path] = this.supportsStreaming(page)
        strategy.performanceOptimizations[page.path] = this.getPerformanceOptimizations(page)
      }
    })

    return strategy
  }

  private generateHybridStrategy(analysis: PageAnalysis): HybridStrategy {
    const strategy: HybridStrategy = {
      overview: {
        total: analysis.pages.length,
        ssg: 0,
        isr: 0,
        dynamic: 0
      },
      recommendations: [],
      implementation: {},
      monitoring: {}
    }

    // 统计各种策略的页面数量
    const pageStrategies = this.classifyPageStrategies(analysis)
    strategy.overview = {
      total: analysis.pages.length,
      ssg: pageStrategies.ssg.length,
      isr: pageStrategies.isr.length,
      dynamic: pageStrategies.dynamic.length
    }

    // 生成实现建议
    strategy.implementation = {
      staticGeneration: this.generateStaticGenerationImplementation(pageStrategies.ssg),
      incrementalRegeneration: this.generateISRImplementation(pageStrategies.isr),
      dynamicRendering: this.generateDynamicRenderingImplementation(pageStrategies.dynamic)
    }

    // 生成监控配置
    strategy.monitoring = {
      performanceMonitoring: this.generatePerformanceMonitoring(),
      cacheMonitoring: this.generateCacheMonitoring(),
      errorMonitoring: this.generateErrorMonitoring()
    }

    return strategy
  }

  private generateStaticGenerationImplementation(pages: PageInfo[]): ImplementationGuide {
    return {
      description: '静态生成实现指南',
      steps: [
        {
          title: '配置静态生成',
          description: '在页面组件中启用 SSG',
          code: `export async function generateStaticParams() {
  return [
    { slug: 'page1' },
    { slug: 'page2' }
  ]
}`,
          file: 'app/[slug]/page.tsx'
        },
        {
          title: '设置重新验证',
          description: '配置页面重新验证策略',
          code: `export const revalidate = 3600 // 1小时`,
          file: 'app/[slug]/page.tsx'
        },
        {
          title: '优化构建时间',
          description: '优化静态页面构建性能',
          code: `// 使用缓存和并行处理
const cache = new Map()

export async function getStaticProps({ params }) {
  if (cache.has(params.slug)) {
    return { props: cache.get(params.slug) }
  }

  const data = await fetchData(params.slug)
  cache.set(params.slug, data)

  return { props: data }
}`,
          file: 'lib/cache.ts'
        }
      ],
      bestPractices: [
        '使用 generateStaticParams 预渲染所有路由',
        '设置适当的 revalidate 时间',
        '实现客户端数据获取以支持实时更新',
        '使用 ISR 处理频繁变化的内容'
      ]
    }
  }

  private generateISRImplementation(pages: PageInfo[]): ImplementationGuide {
    return {
      description: '增量再生实现指南',
      steps: [
        {
          title: '配置 ISR',
          description: '设置页面增量再生',
          code: `export const revalidate = 3600 // 1小时

export async function getStaticProps() {
  // 获取数据
  const data = await fetchData()

  return {
    props: {
      data,
      lastModified: new Date().toISOString()
    }
  }
}`,
          file: 'app/page.tsx'
        },
        {
          title: '实现缓存失效',
          description: '实现基于数据的缓存失效',
          code: `import { unstable_cache } from 'next/cache'

const getData = unstable_cache(
  async (id: string) => fetch(\`/api/data/\${id}\`).then(r => r.json()),
  { revalidate: 3600 }
)

export async function getStaticProps({ params }) {
  const data = await getData(params.id)
  return { props: { data } }
}`,
          file: 'lib/data.ts'
        },
        {
          title: '添加错误处理',
          description: '处理 ISR 错误和回退策略',
          code: `export async function getStaticProps() {
  try {
    const data = await fetchData()
    return { props: { data } }
  } catch (error) {
    // 回退到静态生成
    return {
      props: {
        data: fallbackData,
        error: true,
        timestamp: new Date().toISOString()
      }
    }
  }
}`,
          file: 'app/page.tsx'
        }
      ],
      bestPractices: [
        '设置合适的 revalidate 时间',
        '实现数据层面的缓存',
        '提供错误处理和回退机制',
        '使用 on-demand revalidate 处理重要更新',
        '监控缓存命中率和性能'
      ]
    }
  }
}
```

### 4. 组件展示完整性检查器
确保组件库组件完全展示：

```typescript
// 组件展示完整性检查器
class ComponentShowcaseValidator {
  validateShowcase(projectPath: string): ShowcaseValidationResult {
    const result: ShowcaseValidationResult = {
      complete: true,
      missingComponents: [],
      incompleteImplementations: [],
      coverage: {
        total: 0,
        showcased: 0,
        percentage: 0
      },
      recommendations: []
    }

    // 1. 获取组件库组件列表
    const coreComponents = this.getCoreComponents(projectPath)
    result.coverage.total = coreComponents.length

    // 2. 获取展示的组件
    const showcasedComponents = this.getShowcasedComponents(projectPath)
    result.coverage.showcased = showcasedComponents.length
    result.coverage.percentage = (showcasedComponents.length / coreComponents.length) * 100

    // 3. 检查缺失的组件
    const missingComponents = coreComponents.filter(
      component => !showcasedComponents.find(sc => sc.name === component.name)
    )

    missingComponents.forEach(component => {
      result.missingComponents.push({
        component: component.name,
        category: component.category,
        file: component.file,
        severity: 'error',
        recommendation: `在 Gallery 中添加 ${component.name} 组件的展示`
      })
    })

    // 4. 检查展示完整性
    showcasedComponents.forEach(component => {
      const completeness = this.checkComponentShowcaseCompleteness(component, projectPath)

      if (completeness.score < 100) {
        result.incompleteImplementations.push(completeness)
      }
    })

    // 5. 计算总体完整性
    result.complete = result.missingComponents.length === 0 &&
                     result.incompleteImplementations.length === 0

    // 6. 生成建议
    result.recommendations = this.generateShowcaseRecommendations(result)

    return result
  }

  private getCoreComponents(projectPath: string): CoreComponent[] {
    const components: CoreComponent[] = []

    // 从组件库扫描所有导出的组件
    const coreIndexPath = path.join(projectPath, '..', 'packages', 'core', 'src', 'index.ts')

    if (fs.existsSync(coreIndexPath)) {
      const indexContent = fs.readFileSync(coreIndexPath, 'utf-8')
      const componentExports = this.extractComponentExports(indexContent)

      componentExports.forEach(exportInfo => {
        components.push({
          name: exportInfo.name,
          file: exportInfo.file,
          category: this.categorizeComponent(exportInfo.name),
          props: exportInfo.props,
          variants: exportInfo.variants,
          description: exportInfo.description
        })
      })
    }

    return components
  }

  private getShowcasedComponents(projectPath: string): ShowcasedComponent[] {
    const showcased: ShowcasedComponent[] = []

    // 扫描 Gallery 页面
    const galleryPath = path.join(projectPath, 'app', 'gallery')
    if (fs.existsSync(galleryPath)) {
      const galleryComponents = this.scanGalleryComponents(galleryPath)
      showcased.push(...galleryComponents)
    }

    // 扫描其他展示页面
    const showcasePages = this.findShowcasePages(projectPath)
    showcasePages.forEach(page => {
      const pageComponents = this.scanPageComponents(page)
      showcased.push(...pageComponents)
    })

    return Array.from(new Map(showcased.map(sc => [sc.name, sc])).values())
  }

  private checkComponentShowcaseCompleteness(component: ShowcasedComponent, projectPath: string): ComponentCompleteness {
    const completeness: ComponentCompleteness = {
      componentName: component.name,
      score: 0,
      checks: {},
      issues: [],
      recommendations: []
    }

    // 检查基本展示
    completeness.checks.basicRendering = {
      hasPreview: component.hasPreview,
      hasScreenshot: component.hasScreenshot,
      hasDescription: component.hasDescription
    }

    if (component.hasPreview) completeness.score += 20
    if (component.hasScreenshot) completeness.score += 15
    if (component.hasDescription) completeness.score += 10

    // 检查变体展示
    if (component.variants) {
      completeness.checks.variants = this.checkVariantShowcase(component)
      completeness.score += completeness.checks.variants.score
    } else {
      completeness.issues.push({
        type: 'missing_variants',
        message: '缺少变体展示',
        recommendation: '展示组件的所有变体和状态'
      })
    }

    // 检查交互展示
    if (component.interactive) {
      completeness.checks.interactions = this.checkInteractionShowcase(component)
      completeness.score += completeness.checks.interactions.score
    }

    // 检查可访问性展示
    completeness.checks.accessibility = this.checkAccessibilityShowcase(component)
    completeness.score += completeness.checks.accessibility.score

    // 检查代码示例
    completeness.checks.codeExample = this.checkCodeExampleShowcase(component)
    completeness.score += completeness.checks.codeExample.score

    return completeness
  }

  private checkVariantShowcase(component: ShowcasedComponent): VariantShowcaseCheck {
    const check: VariantShowcaseCheck = {
      score: 0,
      showcasedVariants: [],
      missingVariants: [],
      incompleteVariants: []
    }

    if (component.variants) {
      const expectedVariants = ['primary', 'secondary', 'success', 'warning', 'danger', 'neutral']
      const sizeVariants = ['xs', 'sm', 'md', 'lg', 'xl']

      // 检查变体展示
      expectedVariants.forEach(variant => {
        if (component.variants.includes(variant)) {
          check.showcasedVariants.push(variant)
          check.score += 5
        } else {
          check.missingVariants.push(variant)
        }
      })

      // 检查尺寸展示
      sizeVariants.forEach(size => {
        if (component.variants.includes(size)) {
          check.showcasedVariants.push(size)
          check.score += 3
        } else {
          check.missingVariants.push(size)
        }
      })
    }

    return check
  }

  private generateShowcaseRecommendations(result: ShowcaseValidationResult): Recommendation[] {
    const recommendations: Recommendation[] = []

    // 缺失组件建议
    if (result.missingComponents.length > 0) {
      recommendations.push({
        type: 'missing_components',
        priority: 'high',
        title: '添加缺失的组件展示',
        description: `发现 ${result.missingComponents.length} 个组件未在 Gallery 中展示`,
        action: result.missingComponents.map(mc =>
          `为 ${mc.component} (${mc.category}) 创建展示卡片和预览`
        ).join('; ')
      })
    }

    // 不完整展示建议
    if (result.incompleteImplementations.length > 0) {
      recommendations.push({
        type: 'incomplete_showcase',
        priority: 'medium',
        title: '完善组件展示实现',
        description: `发现 ${result.incompleteImplementations.length} 个组件展示不完整`,
        action: result.incompleteImplementations.map(ci =>
          `完善 ${ci.componentName} 的展示，添加缺失的变体或交互`
        ).join('; ')
      })
    }

    // 覆盖率建议
    if (result.coverage.percentage < 80) {
      recommendations.push({
        type: 'low_coverage',
        priority: 'medium',
        title: '提高组件展示覆盖率',
        description: `当前覆盖率仅为 ${result.coverage.percentage.toFixed(1)}%`,
        action: '确保所有组件都在 Gallery 中完整展示'
      })
    }

    return recommendations
  }
}
```

## 架构标准

### 严格依赖原则
- **仅使用 @xorigo-ui/core**: 禁止添加其他 UI 组件库
- **禁止重复实现**: 不在 Website 中重新实现已存在的组件
- **样式一致性**: Website 样式完全由 packages 中的主题系统控制

### 目录结构标准
```
apps/website/
├── app/                    # App Router
│   ├── gallery/            # 配方库 (SSG)
│   ├── adoption/           # 取用矩阵 (Client)
│   └── playground/          # 在线预览 (Client)
├── components/            # 网站专用组件
├── lib/                   # 工具函数
└── styles/                # 样式文件
```

### 性能标准
- **构建时间**: < 30秒
- **首屏加载**: < 1.5 秒
- **Lighthouse 分数**: > 90
- **Bundle 大小**: < 500KB (gzipped)

## 使用示例

```bash
# 验证架构合规性
"验证 Next.js 应用是否符合 Xorigo UI 架构标准"

# 优化性能配置
"优化 Next.js 配置以提高应用性能"

# 生成 SSG/ISR 策略
"为所有页面生成合适的 SSG/ISR 策略"

# 检查组件展示
"检查组件库组件在 Gallery 中的展示完整性"
```

## 输出格式

1. **合规性报告**: 详细的架构合规性验证结果
2. **优化配置**: 生成的性能优化配置文件
3. **策略文档**: SSG/ISR 策略实现指南
4. **完整性报告**: 组件展示完整性分析结果

## 技术依据

基于 Xorigo UI Next.js 架构文档：

- **严格依赖原则**: 所有 UI 组件来自组件库
- **组件展示完整性**: 100% 覆盖所有组件
- **性能优化**: SSG/ISR/Streaming 策略
- **架构分离**: 组件库与展示网站分离

确保 Next.js 应用架构的一致性、性能和可维护性。