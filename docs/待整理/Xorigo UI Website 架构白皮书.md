# 🧭 Xorigo UI Website 架构白皮书 （Architecture Whitepaper – Website Module）

> **项目代号**：Xorigo UI Website
> **版本**：v1.1.0 (DX Enhanced)
> **文件定位**：定义 Next.js 驱动的展示层架构、调用边界与数据只读策略，包含完整DX增强层实现。
> **适用范围**：文档、令牌可视化、取用矩阵（Adoption）、交互沙盒（Playground）、主题与国际化展示。
>
> **更新日志**：
> - v1.1.0: 新增完整DX增强层实现，包括Playground Live Props + Snapshot双模式、性能监控与KPI仪表板、配置管理等功能
> - v1.0.0: 初始架构白皮书，定义Website与Packages分离的七轴架构

## 一、目标与边界

### 1.1 核心定位

**只读展示与交互壳层**：
- **只读原则**：所有内容来自现有产物（registry/tokens/templates/docs/i18n），站点不生成、不写入任何数据
- **RSC/Client 分层**：Docs/Adoption/Token/Theme → RSC/ISR；Playground → Client + 动态导入
- **即拷即用**：任何示例均能产出「复制命令」与「源码片段」

### 1.2 架构边界

```mermaid
graph TB
    subgraph "Packages Layer (只读源)"
        A[registry.json]
        B[tokens/*.json]
        C[docs/*.mdx]
        D[templates/*.tsx]
        E[i18n/*.json]
        F[CLI Tools<br/>add/doctor/check/sync]
    end

    subgraph "Website SDK Layer (数据协议层)"
        G[@xorigo-ui/sdk-website<br/>registry.client.ts]
        H[@xorigo-ui/sdk-website<br/>tokens.client.ts]
        I[@xorigo-ui/sdk-website<br/>docs.client.ts]
    end

    subgraph "Website Data Layer (适配层)"
        J[src/data/*.readonly.ts]
        K[Schema Validation]
        L[Consistency Check]
        M[Docs Pipeline<br/>sync-scripts]
    end

    subgraph "Website App Layer (展示层)"
        N[RSC Pages<br/>Docs/Adoption/Token/Theme]
        O[Client Pages<br/>Playground<br/>Live Props + Snapshot]
        P[Status Dashboard<br/>KPI Monitor]
        Q[Static Generation<br/>ISR]
    end

    A --> G
    B --> H
    C --> I
    D --> I
    E --> I
    F --> M

    G --> J
    H --> J
    I --> J
    M --> J

    J --> K
    J --> L
    K --> N
    L --> N
    J --> O
    N --> P
    N --> Q
```

---

## 二、P0 硬护栏（立即执行的工程化约束）

### 2.1 数据入口收口机制

**只读数据访问控制**：
```typescript
// src/data/registry.readonly.ts - 唯一数据入口点
/**
 * @fileoverview 只读数据适配层 - 禁止任何其他路径访问上游数据
 */
export const readonlyRegistry = {
  // 仅允许通过此接口访问 registry.json
  getComponents: () => validatedRegistry.components,
  getMetadata: () => validatedRegistry.metadata,

  // 构建时一致性校验
  validateConsistency: () => {
    // 1. 校验 registry.preview.module 与实际可导入路径
    // 2. 校验 tokens/registry JSON Schema 固定版本
    // 3. 失败立即阻断构建
  }
}

// ESLint 规则：禁止其他路径访问上游数据
// 'no-restricted-imports': [
//   'error',
//   {
//     patterns: [
//       {
//         group: ['@xorigo-ui/registry', '@xorigo-ui/tokens'],
//         message: '请使用 src/data/*.readonly.ts 访问上游数据'
//       }
//     ]
//   }
// ]
```

### 2.2 RSC/Client 边界规约

**RSC 严格约束**：
```typescript
// RSC 页面约束清单
const RSC_CONSTRAINTS = {
  // 禁止使用的浏览器 API
  forbiddenBrowserAPIs: [
    'window', 'document', 'localStorage', 'sessionStorage',
    'navigator', 'location', 'history', 'getBoundingClientRect'
  ],

  // 禁止使用的 React Hooks
  forbiddenHooks: [
    'useEffect', 'useLayoutEffect', 'useState', 'useRef'
  ],

  // 允许的服务器端操作
  allowedServerOperations: [
    'fetch', 'headers', 'cookies', 'params', 'searchParams'
  ]
}

// Client-only 页面动态导入
const ClientOnlyPlayground = dynamic(
  () => import('@/components/playground/Playground'),
  {
    loading: () => <PlaygroundSkeleton />,
    ssr: false // 明确标记为客户端渲染
  }
)
```

**体积预算控制**：
```json
// next.config.js - 路由级分包配置
module.exports = {
  experimental: {
    optimizePackageImports: ['@xorigo-ui/core']
  },
  webpack: (config) => {
    config.optimization.splitChunks = {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        playground: {
          test: /[\\/]components[\\/]playground[\\/]/,
          name: 'playground',
          chunks: 'all',
          maxSize: 150 * 1024 // 150KB gzip 上限
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          maxSize: 120 * 1024 // 站点基础 120KB gzip 上限
        }
      }
    }
    return config
  }
}
```

### 2.3 只读一致性保障

**构建前校验机制**：
```typescript
// scripts/validate-readonly-consistency.ts
export class ReadonlyConsistencyValidator {
  async validateRegistryPaths(): Promise<ValidationResult> {
    // 1. 读取 registry.preview.module 中的所有导入路径
    // 2. 验证路径在实际包结构中存在
    // 3. 检查导出的组件名称与注册表一致
    // 4. 失败时提供详细缺失项清单并阻断构建
  }

  async validateTokenSchema(): Promise<ValidationResult> {
    // 1. 使用固定版本 JSON Schema 校验 tokens/*.json
    // 2. 检查必需的语义令牌是否存在
    // 3. 验证令牌值的类型和格式
    // 4. 生成兼容性报告
  }
}

// package.json - 构建前钩子
{
  "scripts": {
    "prebuild": "node scripts/validate-readonly-consistency.ts",
    "build": "next build"
  }
}
```

### 2.4 可达性与叠层标准

**站点级 WCAG 2.1 AA 合规**：
```typescript
// src/components/accessibility/SkipNavLink.tsx
export const SkipNavLink = () => (
  <a
    href="#main-content"
    className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-500 text-white px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-primary-300"
  >
    跳转到主要内容
  </a>
)

// 统一焦点环规范
const FOCUS_RING_STYLES = {
  // 基于设计令牌的焦点环
  '--focus-ring-color': 'var(--color-primary-500)',
  '--focus-ring-width': '2px',
  '--focus-ring-offset': '2px',
  '--focus-ring-style': 'solid'
}

// Z-Layer 避让规范
const Z_LAYER_STACK = {
  skipLink: 1000,
  modal: 900,
  dropdown: 800,
  tooltip: 700,
  sticky: 600,
  default: 1,
  background: -1
}
```

### 2.5 错误容忍机制

**分层错误边界**：
```typescript
// src/components/errors/PlaygroundErrorBoundary.tsx
export class PlaygroundErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // 记录错误但不影响全站
    console.error('Playground Error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="border border-error-200 bg-error-50 p-6 rounded-lg">
          <h3 className="text-error-800 font-semibold mb-2">
            示例加载失败
          </h3>
          <p className="text-error-600 mb-4">
            这个示例暂时无法显示，请稍后再试或查看其他示例。
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="bg-error-500 text-white px-4 py-2 rounded hover:bg-error-600"
          >
            重试
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

// MDX 渲染错误边界
export class MDXErrorBoundary extends Component {
  // 类似实现，专门处理 MDX 渲染错误
}
```

---

## 三、DX 强化层（开发者体验提升）

### 3.1 Website SDK 层（统一数据协议）

**数据访问抽象**：
```typescript
// packages/sdk-website/src/registry.client.ts
/**
 * @fileoverview Website 统一数据访问协议
 * 替代直接读取 readonly 层，提供类型安全的数据访问
 */
export class WebsiteRegistryClient {
  private cache: Map<string, any> = new Map()
  private baseUrl: string

  constructor(config?: { baseUrl?: string }) {
    this.baseUrl = config?.baseUrl || '/api/registry'
  }

  // 获取组件列表
  async getComponents(): Promise<Component[]> {
    const cacheKey = 'components'
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const response = await fetch(`${this.baseUrl}/components.json`)
    const components = await response.json()

    this.cache.set(cacheKey, components)
    return components
  }

  // 获取组件详情
  async getComponent(name: string): Promise<ComponentDetail> {
    const cacheKey = `component:${name}`
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)
    }

    const response = await fetch(`${this.baseUrl}/components/${name}.json`)
    const component = await response.json()

    this.cache.set(cacheKey, component)
    return component
  }

  // 搜索组件
  async searchComponents(query: string): Promise<Component[]> {
    const components = await this.getComponents()
    return components.filter(comp =>
      comp.name.toLowerCase().includes(query.toLowerCase()) ||
      comp.description.toLowerCase().includes(query.toLowerCase()) ||
      comp.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    )
  }
}

// packages/sdk-website/src/tokens.client.ts
export class WebsiteTokensClient {
  // 设计令牌访问
  async getDesignTokens(): Promise<DesignTokens> { }

  // 语义令牌访问
  async getSemanticTokens(): Promise<SemanticTokens> { }

  // 状态令牌访问
  async getStateTokens(): Promise<StateTokens> { }

  // 主题令牌访问
  async getThemeTokens(): Promise<ThemeTokens> { }
}

// packages/sdk-website/src/docs.client.ts
export class WebsiteDocsClient {
  // 文档索引
  async getDocsIndex(): Promise<DocsIndex> { }

  // 文档内容
  async getDoc(slug: string): Promise<DocContent> { }

  // 文档搜索
  async searchDocs(query: string): Promise<SearchResult[]> { }
}
```

### 3.2 CLI 工具强化（对比 Shadcn/ui）

**增强的 CLI 命令集**：
```bash
# 基础命令（已有）
npx xorigo add button           # 添加组件
npx xorigo add card --variant="outlined"

# 新增 DX 强化命令
npx xorigo sync docs            # 同步组件文档到 website
npx xorigo doctor               # 健康检查和问题诊断
npx xorigo check                 # 运行所有检查（schema/a11y/performance）
npx xorigo generate props-table  # 生成组件 Props 表
npx xorigo optimize             # 性能优化建议
```

**Doctor 命令实现**：
```typescript
// packages/cli/src/commands/doctor.ts
export const doctorCommand = new Command('doctor')
  .description('Xorigo UI 健康检查和问题诊断')
  .option('--fix', '自动修复发现的问题')
  .action(async (options) => {
    const healthCheck = new XorigoHealthCheck()

    const results = await Promise.allSettled([
      healthCheck.checkPackageVersions(),
      healthCheck.checkDependencies(),
      healthCheck.checkTypeScript(),
      healthCheck.checkESLint(),
      healthCheck.checkA11y(),
      healthCheck.checkBundleSize(),
      healthCheck.checkRegistryConsistency()
    ])

    healthCheck.generateReport(results)

    if (options.fix) {
      await healthCheck.autoFixIssues(results)
    }
  })

class XorigoHealthCheck {
  async checkPackageVersions() { /* 检查包版本一致性 */ }
  async checkDependencies() { /* 检查依赖健康状态 */ }
  async checkTypeScript() { /* TypeScript 编译检查 */ }
  async checkESLint() { /* ESLint 检查 */ }
  async checkA11y() { /* 可访问性检查 */ }
  async checkBundleSize() { /* Bundle 大小检查 */ }
  async checkRegistryConsistency() { /* Registry 一致性检查 */ }

  generateReport(results: PromiseSettledResult<any>[]) { /* 生成健康报告 */ }
  async autoFixIssues(results: PromiseSettledResult<any>[]) { /* 自动修复问题 */ }
}
```

### 3.3 Docs Pipeline 自动同步层

**文档同步脚本**：
```typescript
// scripts/sync-docs-from-registry.ts
/**
 * @fileoverview 从 registry 自动同步文档到 website
 * 避免文档与组件脱节（Shadcn 手动 copy 文档的痛点）
 */
export class DocsSyncPipeline {
  async syncAll() {
    console.log('🚀 开始同步文档...')

    // 1. 从 registry 读取组件信息
    const registry = await this.loadRegistry()

    // 2. 生成组件文档页面
    await this.generateComponentDocs(registry.components)

    // 3. 生成 Props 表
    await this.generatePropsTables(registry.components)

    // 4. 生成示例代码
    await this.generateExamples(registry.components)

    // 5. 更新搜索索引
    await this.updateSearchIndex(registry)

    // 6. 验证同步结果
    await this.validateSync()

    console.log('✅ 文档同步完成')
  }

  private async generateComponentDocs(components: Component[]) {
    for (const component of components) {
      // 基于 TypeScript 类型生成文档
      const docContent = await this.generateDocContent(component)

      // 写入到 docs 目录
      await this.writeFile(`docs/components/${component.name}.mdx`, docContent)
    }
  }

  private async generatePropsTables(components: Component[]) {
    for (const component of components) {
      const propsTable = await this.generatePropsTable(component)
      await this.writeFile(`docs/components/${component.name}/props.mdx`, propsTable)
    }
  }

  private async generateExamples(components: Component[]) {
    for (const component of components) {
      const examples = await this.generateExamples(component)
      await this.writeFile(`docs/components/${component.name}/examples.mdx`, examples)
    }
  }
}

// package.json scripts
{
  "scripts": {
    "sync:docs": "node scripts/sync-docs-from-registry.ts",
    "sync:docs:watch": "node scripts/sync-docs-from-registry.ts --watch",
    "prebuild": "npm run sync:docs"
  }
}
```

### 3.4 Token Schema 可视化与治理

**设计令牌 Schema 可视化**：
```typescript
// src/app/tokens/schema/page.tsx
export default function TokenSchemaPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Design Tokens Schema</h1>

      {/* Schema 可视化 */}
      <TokenSchemaVisualization />

      {/* 版本治理 */}
      <TokenVersionGovernance />

      {/* 依赖关系图 */}
      <TokenDependencyGraph />

      {/* 使用统计 */}
      <TokenUsageStats />
    </div>
  )
}

// Token Schema 可视化组件
const TokenSchemaVisualization = () => {
  const [schema, setSchema] = useState<TokenSchema | null>(null)

  useEffect(() => {
    loadTokenSchema().then(setSchema)
  }, [])

  if (!schema) return <div>Loading...</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* 颜色令牌 */}
      <TokenCategoryCard
        title="Color Tokens"
        tokens={schema.colors}
        renderToken={(token) => <ColorTokenVisualization token={token} />}
      />

      {/* 间距令牌 */}
      <TokenCategoryCard
        title="Spacing Tokens"
        tokens={schema.spacing}
        renderToken={(token) => <SpacingTokenVisualization token={token} />}
      />

      {/* 动效令牌 */}
      <TokenCategoryCard
        title="Motion Tokens"
        tokens={schema.motion}
        renderToken={(token) => <MotionTokenVisualization token={token} />}
      />

      {/* 字体令牌 */}
      <TokenCategoryCard
        title="Typography Tokens"
        tokens={schema.typography}
        renderToken={(token) => <TypographyTokenVisualization token={token} />}
      />

      {/* 阴影令牌 */}
      <TokenCategoryCard
        title="Shadow Tokens"
        tokens={schema.shadows}
        renderToken={(token) => <ShadowTokenVisualization token={token} />}
      />

      {/* 边框令牌 */}
      <TokenCategoryCard
        title="Border Tokens"
        tokens={schema.borders}
        renderToken={(token) => <BorderTokenVisualization token={token} />}
      />
    </div>
  )
}

// Token 版本治理
const TokenVersionGovernance = () => {
  const [versions, setVersions] = useState<TokenVersion[]>([])

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">Token Version Governance</h2>

      {/* 版本历史 */}
      <TokenVersionHistory versions={versions} />

      {/* 版本对比 */}
      <TokenVersionComparison />

      {/* 迁移指南 */}
      <TokenMigrationGuide />

      {/* 兼容性检查 */}
      <TokenCompatibilityCheck />
    </div>
  )
}
```

---

## 四、P1 规范深化（本周内完成）

### 3.1 Adoption 取用矩阵

**组件展示与发现**：
```typescript
// src/components/adoption/ComponentMatrix.tsx
interface ComponentMatrixProps {
  filters: {
    category: ComponentCategory[]
    tags: string[]
    dependencies: string[]
    a11yCompliant: boolean
    rtlSupport: boolean
  }
}

// 功能特性
const MATRIX_FEATURES = {
  // 一键复制安装命令
  copyInstallCommand: (componentName: string) =>
    `xorigo add ${componentName}`,

  // 令牌使用展示
  showTokenUsage: (componentName: string) =>
    extractUsedTokens(componentName),

  // 依赖关系可视化
  showDependencyGraph: (componentName: string) =>
    buildDependencyGraph(componentName),

  // 可访问性评分展示
  showA11yScore: (componentName: string) =>
    getA11yComplianceScore(componentName)
}
```

**高级搜索与过滤**：
```typescript
// 性能要求：1k 项筛选交互 ≤ 50ms
const SEARCH_PERFORMANCE_TARGETS = {
  maxFilterTime: 50, // ms
  maxSearchResults: 1000,
  debounceDelay: 300
}

// 搜索索引构建
export class ComponentSearchIndex {
  buildIndex(components: Component[]) {
    // 使用 Fuse.js 或轻量级搜索库
    // 支持名称、描述、标签、令牌使用搜索
  }
}
```

### 3.2 Playground 交互沙盒

**Props 编辑器**：
```typescript
// src/components/playground/PropsEditor.tsx
interface PropsEditorConfig {
  // 基础类型支持
  supportedTypes: [
    'string', 'number', 'boolean',
    'enum', 'array', 'object'
  ]

  // 枚举值自动推断
  inferEnumValues: (component: string) => Promise<string[]>

  // 令牌值提示
  suggestTokenValues: (propName: string) => TokenValue[]
}

// 主题切换支持
const THEME_CONTROLS = {
  density: ['compact', 'normal', 'spacious'],
  mode: ['light', 'dark', 'auto'],
  contrast: ['normal', 'high'],
  direction: ['ltr', 'rtl']
}
```

**Token Inspector**：
```typescript
// 分析示例用到的语义令牌
export class TokenInspector {
  analyzeUsage(componentCode: string): TokenUsageReport {
    return {
      designTokens: extractDesignTokens(componentCode),
      semanticTokens: extractSemanticTokens(componentCode),
      stateTokens: extractStateTokens(componentCode),
      themeTokens: extractThemeTokens(componentCode)
    }
  }
}
```

### 3.3 Tokens/Theme Hub

**可视化令牌浏览器**：
```typescript
// src/app/tokens/[category]/page.tsx
interface TokenVisualization {
  // 颜色令牌：色板、对比度检查
  colorTokens: {
    swatch: ColorSwatch
    contrastRatio: number
    wcagCompliance: 'AA' | 'AAA' | 'FAIL'
  }

  // 间距令牌：可视化尺子
  spacingTokens: {
    visualRuler: VisualRuler
    relativeScale: number
  }

  // 动效令牌：预览动画
  motionTokens: {
    previewAnimation: MotionPreview
    duration: number
    easing: string
  }
}
```

**URL 参数化共享**：
```typescript
// 主题状态 URL 编码
export interface ThemeStateURL {
  brand: string      // ?brand=corporate-blue
  mode: string       // ?mode=dark
  density: string    // ?density=compact
  contrast: string   // ?contrast=high
  rtl: boolean       // ?rtl=true
}

// URL 状态同步
export const useThemeSync = () => {
  // 1. 从 URL 读取主题状态
  // 2. 同步到 ThemeProvider
  // 3. 状态变化时更新 URL
}
```

### 3.4 站点级搜索

**统一搜索索引**：
```typescript
// 搜索数据源整合
interface SearchIndex {
  components: Component[]
  documentation: DocumentationPage[]
  tokens: Token[]
  examples: CodeExample[]
}

// 搜索性能优化
const SEARCH_CONFIG = {
  // 使用 Fuse.js 前端搜索或 Algolia DocSearch
  engine: process.env.ALGOLIA_APP_ID ? 'algolia' : 'fuse',

  // 搜索权重配置
  weights: {
    title: 3.0,
    description: 2.0,
    tags: 1.5,
    content: 1.0
  },

  // 搜索结果限制
  maxResults: 50,
  highlightThreshold: 0.3
}
```

---

## 四、P2 优化功能（可择期实现）

### 4.1 性能面板

**示例性能指标展示**：
```typescript
// src/components/playground/PerformancePanel.tsx
interface PerformanceMetrics {
  bundleSize: {
    gzip: number      // KB
    brotli: number    // KB
    parsed: number    // KB
  }

  renderPerformance: {
    firstPaint: number     // ms
    firstContentfulPaint: number // ms
    largestContentfulPaint: number // ms
    interactionTime: number // ms
  }

  memoryUsage: {
    peak: number       // MB
    average: number    // MB
    leaks: boolean
  }
}
```

### 4.2 可达性面板

**axe 结果集成**：
```typescript
// src/components/playground/A11yPanel.tsx
export class A11yPanel {
  async runAxeTest(element: HTMLElement): Promise<A11yReport> {
    const results = await axe.run(element, {
      reporter: 'v2',
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag21aa']
      }
    })

    return {
      violations: results.violations,
      passes: results.passes,
      incomplete: results.incomplete,
      score: this.calculateA11yScore(results)
    }
  }
}
```

### 4.3 快照链接生成

**Playground 状态持久化**：
```typescript
// URL 友好的状态编码
export class PlaygroundSnapshot {
  encodeState(state: PlaygroundState): string {
    // 1. 压缩状态数据
    // 2. Base64 编码
    // 3. 生成短链接
    return `https://xorigo-ui.dev/playground/${componentName}?s=${encodedState}`
  }

  decodeState(encodedState: string): PlaygroundState {
    // 1. Base64 解码
    // 2. 解压状态数据
    // 3. 验证状态完整性
  }
}
```

---

## 五、KPI 指标体系

### 5.1 性能指标

| 指标 | 目标值 | 测量方法 | 频率 |
|------|--------|----------|------|
| **首屏 LCP (3G)** | ≤ 2.5s | Lighthouse / Web Vitals | CI |
| **CLS (累积布局偏移)** | ≤ 0.05 | Lighthouse / Web Vitals | CI |
| **Adoption 页面筛选** | ≤ 50ms | Performance API | Real User |
| **站点基础包体积** | ≤ 120KB gzip | Bundle Analyzer | CI |
| **Playground 单页体积** | ≤ 150KB gzip | Bundle Analyzer | CI |

### 5.2 可用性指标

| 指标 | 目标值 | 测量方法 | 频率 |
|------|--------|----------|------|
| **站点级 a11y** | 严重/中等问题 0 | axe-core 扫描 | CI |
| **示例加载成功率** | ≥ 99% | ErrorBoundary 监控 | Real User |
| **搜索响应时间** | ≤ 200ms | Search Analytics | Real User |
| **Playground 渲染时间** | ≤ 100ms | Performance API | Real User |

### 5.3 内容质量指标

| 指标 | 目标值 | 测量方法 | 频率 |
|------|--------|----------|------|
| **文档覆盖率** | 100% 组件有文档 | Registry Check | CI |
| **示例完整性** | 100% 组件有示例 | Registry Check | CI |
| **令牌一致性** | 100% 一致 | Schema Validation | CI |
| **链接有效性** | 100% 有效 | Link Checker | Daily |

---

## 六、主要风险与兜底机制

### 6.1 源与副本漂移风险

**风险描述**：registry/tokens 产物更新与 Website 显示不同步

**兜底机制**：
```typescript
// 构建前强制校验
const CONSISTENCY_CHECKS = {
  // Schema 校验 + 构建前一致性检查
  preBuildValidation: true,

  // 失败阻断并给出缺失项清单
  failFast: true,

  // 自动生成差异报告
  diffReport: true
}

// 监控告警
const MONITORING = {
  // 产物变更监控
  watchPackages: true,

  // 自动触发重建
  autoRebuild: true,

  // 通知机制
  notifications: ['slack', 'email']
}
```

### 6.2 RSC 水合不一致风险

**风险描述**：服务端渲染与客户端渲染结果不一致

**兜底机制**：
```typescript
// RSC 禁用项清单
const RSC_FORBIDDEN_PATTERNS = [
  'window', 'document', 'localStorage', 'sessionStorage',
  'Math.random()', 'Date.now()', 'getBoundingClientRect()',
  'useEffect', 'useLayoutEffect', 'useState'
]

// ESLint 规则检查
const RSC_ESLINT_RULES = {
  'no-window-in-rsc': 'error',
  'no-document-in-rsc': 'error',
  'no-side-effects-in-rsc': 'error',
  'require-client-directive': 'error'
}
```

### 6.3 体积膨胀风险

**风险描述**：Playground 或站点整体体积超出预算

**兜底机制**：
```typescript
// 体积监控与告警
const BUDGET_MONITORING = {
  // 路由级分包报表
  bundleAnalysis: true,

  // 超限阈值阻断
  sizeLimits: {
    site: 120 * 1024,    // 120KB gzip
    playground: 150 * 1024 // 150KB gzip
  },

  // 自动拆分建议
  autoSplitSuggestions: true
}

// CI 构建检查
{
  "scripts": {
    "build:check": "npm run build && npm run check-bundle-size",
    "check-bundle-size": "size-limit"
  }
}
```

### 6.4 文档单点失败风险

**风险描述**：MDX 文档渲染错误导致页面崩溃

**兜底机制**：
```typescript
// 分层错误边界
const ERROR_BOUNDARIES = {
  // 页面级错误边界
  page: 'PageErrorBoundary',

  // MDX 渲染错误边界
  mdx: 'MDXErrorBoundary',

  // 组件示例错误边界
  component: 'ComponentErrorBoundary',

  // 全局错误边界
  global: 'GlobalErrorBoundary'
}

// 错误恢复策略
const ERROR_RECOVERY = {
  // 友好错误提示
  friendlyMessages: true,

  // 重试机制
  retryMechanism: true,

  // 降级显示
  fallbackContent: true,

  // 错误上报
  errorReporting: true
}
```

---

## 二、核心技术栈

| 模块   | 技术                                   | 说明                                      |
| ---- | ------------------------------------ | --------------------------------------- |
| 前端框架 | **Next.js 15.5.4**                   | App Router + RSC + Server Actions + ISR |
| UI 层 | **React 19.2.0**                     | 并发渲染 / Hooks / 过渡 API                   |
| 类型系统 | TypeScript 5.9 严格模式                  | 与 packages 共享 types 库                   |
| 样式   | Tailwind CSS 4.1 + @xorigo-ui/tokens | 设计令牌驱动样式体系                              |
| 动画   | Framer Motion 12.23                  | 组件过渡与沙盒演示动效                             |
| 国际化  | next-intl + @xorigo-ui/i18n          | SSR 与 Client 双端语言切换                     |
| 内容渲染 | next-mdx-remote + rehype/remark 插件   | MDX 文档渲染                                |
| 部署   | Vercel / Docker + Nginx              | 支持 ISR 与 边缘部署                           |

---

## 三、架构分层

```bash
apps/website/
├─ app/                     # App Router 路由层
│  ├─ (docs)/               # MDX 文档页（RSC）
│  ├─ adoption/             # 取用矩阵（RSC + 客户端筛选）
│  ├─ playground/[name]/    # 交互沙盒（Client）
│  ├─ tokens/               # 设计令牌可视化
│  ├─ themes/               # 主题与模式切换
│  ├─ search/               # 全局搜索页
│  └─ layout.tsx            # 统一 Root Providers 入口
│
├─ src/
│  ├─ data/                 # 🔒 只读数据适配层
│  │  ├─ registry.readonly.ts
│  │  ├─ tokens.readonly.ts
│  │  ├─ i18n.readonly.ts
│  │  └─ templates.readonly.ts
│  ├─ widgets/              # 站点级 UI 组件（非库导出）
│  ├─ hooks/                # Website 专属交互 hooks
│  └─ styles/               # 站点样式与主题切换样式
│
├─ public/                  # 静态资源
├─ config/                  # ISR 与构建配置
└─ package.json
```

> ✅ `src/data/*` 是唯一访问上游 packages 的入口，确保 Website 全域只读。

---

## 四、数据来源映射

| 数据类型          | 上游来源                              | 访问方式                       | 缓存策略       |
| ------------- | --------------------------------- | -------------------------- | ---------- |
| 组件 Registry   | `packages/registry/registry.json` | RSC 静态读取 / ISR 刷新          | 10 min ISR |
| Design Tokens | `@xorigo-ui/tokens` 导出 JSON       | 静态 import 或 fetch          | 构建时注入      |
| 文档 (MDX)      | `/docs/**`                        | next-mdx-remote 渲染         | 静态 / ISR   |
| 模板预览          | `packages/cli/templates/**`       | Client 动态导入 Preview 组件     | ETag 缓存    |
| 国际化           | `@xorigo-ui/i18n`                 | next-intl Provider 加载 JSON | 按语言懒加载     |

---

## 五、页面职责矩阵

| 页面                   | 主要职责                           | 技术层级                  |
| -------------------- | ------------------------------ | --------------------- |
| `/`                  | 首页、七轴概览、入门引导                   | RSC + ISR             |
| `/docs/[slug]`       | 文档与指南 (MDX)                    | RSC + MDX 渲染          |
| `/adoption`          | 组件列表 + 搜索过滤 + 复制命令             | RSC 静态 + 客户端筛选        |
| `/playground/[name]` | 交互沙盒 Demo 与 Props 编辑           | Client 动态导入 Preview   |
| `/tokens`            | Token Explorer 可视化             | RSC + Client 切换       |
| `/themes`            | 主题/密度/模式预览                     | RSC + Client Provider |
| `/search`            | 统一索引（registry + docs + tokens） | RSC + 客户端 Fuse 搜索     |

---

## 六、Provider 结构

```tsx
export function RootProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider mode="system">
      <ConfigProvider density="cozy" radius="soft">
        <A11yProvider>
          <ZLayerProvider baseZIndex={1000}>{children}</ZLayerProvider>
        </A11yProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
}
```

* Provider 来自 `@xorigo-ui/system`；
* Website 不得重写 Context 逻辑，仅配置参数；
* ZLayer 定义全局 z-index 范围（Modal/Tooltip/Toast 等 避让）。

---

## 七、数据层契约

### 1. Registry 契约

```ts
interface ComponentRegistryItem {
  name: string;
  title: string;
  category: string;
  preview: { module: string };
  tokens?: string[];
  a11y?: boolean;
  rtl?: boolean;
  i18n?: boolean;
}
```

### 2. Token 契约

```ts
interface TokenGroup {
  name: string;
  type: "color" | "spacing" | "radius" | "motion";
  tokens: Record<string, string>;
}
```

### 3. Templates 契约

* 路径映射：`/packages/cli/templates/<component>/Preview.tsx`
* 暴露：`export default function Preview()`
* Website 动态导入模块，不缓存于构建包。

---

## 八、性能与安全策略

| 项目    | 策略                                                  |
| ----- | --------------------------------------------------- |
| 首屏渲染  | 首页与文档页 ISR + Edge 缓存                                |
| JS 体积 | Route Bundle ≤ 120 KB gzip （Playground 单页 ≤ 150 KB） |
| 数据缓存  | Registry/Tokens ISR 10 min ； Preview ETag           |
| 安全    | CSP 默认 script-src self ； 禁用 dangerouslySetInnerHTML |
| 可达性   | axe 自动化 AA 校验 + 焦点陷阱 + SkipNav 链接                   |
| 国际化   | 懒加载 JSON 包 ； RTL 自动镜像布局                             |

---

## 九、DX 增强层实现

### 9.1 完整 Playground Live Props + Snapshot 双模式

**Zustand 状态管理架构**：
```typescript
// src/stores/playground.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface ThemeState {
  colors: Record<string, string>
  spacing: Record<string, string>
  typography: Record<string, any>
  borderRadius: Record<string, string>
  shadows: Record<string, string>
  animations: Record<string, any>
  direction: 'ltr' | 'rtl'
}

interface ComponentConfig {
  name: string
  category: string
  props: Record<string, any>
  variants: string[]
}

interface PlaygroundState {
  // 当前状态
  currentTheme: string
  currentDensity: 'compact' | 'modern' | 'spacious'
  currentRtl: boolean
  themeState: ThemeState

  // 组件状态
  selectedComponent: ComponentConfig | null
  componentProps: Record<string, any>

  // 快照管理
  snapshots: ThemeSnapshot[]
  currentSnapshot: string | null
  history: ThemeSnapshot[]
  historyIndex: number

  // 编辑模式
  editMode: 'live' | 'snapshot'
  compareMode: boolean
  snapshotA: string | null
  snapshotB: string | null

  // UI 状态
  showTokenInspector: boolean
  showPropsEditor: boolean
  showSnapshotManager: boolean
}

interface PlaygroundActions {
  // 主题操作
  setThemeState: (theme: string) => void
  setDensity: (density: string) => void
  setRtl: (rtl: boolean) => void

  // 组件操作
  selectComponent: (component: ComponentConfig) => void
  updateComponentProp: (prop: string, value: any) => void
  resetComponentProps: () => void

  // 快照操作
  saveSnapshot: (name: string, description?: string) => void
  loadSnapshot: (id: string) => void
  deleteSnapshot: (id: string) => void

  // 历史操作
  undo: () => void
  redo: () => void
  reset: () => void

  // 模式切换
  setEditMode: (mode: 'live' | 'snapshot') => void
  setCompareMode: (enabled: boolean) => void
  setCompareSnapshots: (a: string | null, b: string | null) => void

  // UI 状态
  toggleTokenInspector: () => void
  togglePropsEditor: () => void
  toggleSnapshotManager: () => void
}

type PlaygroundStore = PlaygroundState & PlaygroundActions

export const usePlaygroundStore = create<PlaygroundStore>()(
  persist(
    (set, get) => ({
      // 初始状态
      currentTheme: 'system',
      currentDensity: 'modern',
      currentRtl: false,
      themeState: generateThemeState('system', 'modern', false),
      selectedComponent: null,
      componentProps: {},
      snapshots: [],
      currentSnapshot: null,
      history: [{ state: generateThemeState('system', 'modern', false), timestamp: Date.now() }],
      historyIndex: 0,
      editMode: 'live',
      compareMode: false,
      snapshotA: null,
      snapshotB: null,
      showTokenInspector: true,
      showPropsEditor: true,
      showSnapshotManager: false,

      // 主题操作
      setThemeState: (theme) => {
        const snapshot = get()
        const newThemeState = generateThemeState(theme, snapshot.currentDensity, snapshot.currentRtl)
        set({
          currentTheme: theme,
          themeState: newThemeState,
          history: [...snapshot.history.slice(0, snapshot.historyIndex + 1),
                   { state: newThemeState, timestamp: Date.now() }],
          historyIndex: snapshot.historyIndex + 1
        })
      },

      setDensity: (density) => {
        const snapshot = get()
        const newThemeState = generateThemeState(snapshot.currentTheme, density, snapshot.currentRtl)
        set({
          currentDensity: density,
          themeState: newThemeState,
          history: [...snapshot.history.slice(0, snapshot.historyIndex + 1),
                   { state: newThemeState, timestamp: Date.now() }],
          historyIndex: snapshot.historyIndex + 1
        })
      },

      setRtl: (rtl) => {
        const snapshot = get()
        const newThemeState = generateThemeState(snapshot.currentTheme, snapshot.currentDensity, rtl)
        set({
          currentRtl: rtl,
          themeState: newThemeState,
          history: [...snapshot.history.slice(0, snapshot.historyIndex + 1),
                   { state: newThemeState, timestamp: Date.now() }],
          historyIndex: snapshot.historyIndex + 1
        })
      },

      // 组件操作
      selectComponent: (component) => {
        set({
          selectedComponent: component,
          componentProps: getDefaultProps(component)
        })
      },

      updateComponentProp: (prop, value) => {
        set(state => ({
          componentProps: { ...state.componentProps, [prop]: value }
        }))
      },

      resetComponentProps: () => {
        const state = get()
        if (state.selectedComponent) {
          set({ componentProps: getDefaultProps(state.selectedComponent) })
        }
      },

      // 快照操作
      saveSnapshot: (name, description = '') => {
        const state = get()
        const newSnapshot: ThemeSnapshot = {
          id: generateId(),
          name,
          description: description || `快照 - ${new Date().toLocaleString()}`,
          themeState: { ...state.themeState },
          componentState: {
            selectedComponent: state.selectedComponent,
            componentProps: { ...state.componentProps }
          },
          metadata: {
            created: new Date().toISOString(),
            version: '1.0.0',
            tags: ['手动创建'],
            theme: state.currentTheme,
            density: state.currentDensity,
            rtl: state.currentRtl
          }
        }

        set({
          snapshots: [...state.snapshots, newSnapshot],
          currentSnapshot: newSnapshot.id
        })
      },

      loadSnapshot: (id) => {
        const state = get()
        const snapshot = state.snapshots.find(s => s.id === id)
        if (snapshot) {
          set({
            currentSnapshot: id,
            themeState: { ...snapshot.themeState },
            selectedComponent: snapshot.componentState.selectedComponent,
            componentProps: { ...snapshot.componentState.componentProps },
            currentTheme: snapshot.metadata.theme,
            currentDensity: snapshot.metadata.density as any,
            currentRtl: snapshot.metadata.rtl,
            history: [...state.history.slice(0, state.historyIndex + 1),
                     { state: snapshot.themeState, timestamp: Date.now() }],
            historyIndex: state.historyIndex + 1
          })
        }
      },

      deleteSnapshot: (id) => {
        const state = get()
        set({
          snapshots: state.snapshots.filter(s => s.id !== id),
          currentSnapshot: state.currentSnapshot === id ? null : state.currentSnapshot
        })
      },

      // 历史操作
      undo: () => {
        const state = get()
        if (state.historyIndex > 0) {
          const newIndex = state.historyIndex - 1
          const prevState = state.history[newIndex]
          set({
            historyIndex: newIndex,
            themeState: { ...prevState.state }
          })
        }
      },

      redo: () => {
        const state = get()
        if (state.historyIndex < state.history.length - 1) {
          const newIndex = state.historyIndex + 1
          const nextState = state.history[newIndex]
          set({
            historyIndex: newIndex,
            themeState: { ...nextState.state }
          })
        }
      },

      reset: () => {
        const defaultState = generateThemeState('system', 'modern', false)
        set({
          currentTheme: 'system',
          currentDensity: 'modern',
          currentRtl: false,
          themeState: defaultState,
          history: [{ state: defaultState, timestamp: Date.now() }],
          historyIndex: 0,
          currentSnapshot: null
        })
      },

      // 模式切换
      setEditMode: (mode) => set({ editMode: mode }),
      setCompareMode: (enabled) => set({ compareMode: enabled }),
      setCompareSnapshots: (a, b) => set({ snapshotA: a, snapshotB: b }),

      // UI 状态
      toggleTokenInspector: () => set(state => ({ showTokenInspector: !state.showTokenInspector })),
      togglePropsEditor: () => set(state => ({ showPropsEditor: !state.showPropsEditor })),
      toggleSnapshotManager: () => set(state => ({ showSnapshotManager: !state.showSnapshotManager }))
    }),
    {
      name: 'xorigo-playground-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        snapshots: state.snapshots,
        currentTheme: state.currentTheme,
        currentDensity: state.currentDensity,
        currentRtl: state.currentRtl
      })
    }
  )
)

// 辅助函数
function generateThemeState(theme: string, density: string, rtl: boolean): ThemeState {
  return {
    colors: getColorPalette(theme),
    spacing: getSpacingScale(density),
    typography: getTypographySystem(density),
    borderRadius: getBorderRadiusScale(density),
    shadows: getShadowSystem(density),
    animations: getAnimationSystem(density),
    direction: rtl ? 'rtl' : 'ltr'
  }
}

function generateId(): string {
  return `snapshot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

function getDefaultProps(component: ComponentConfig): Record<string, any> {
  // 返回组件的默认props
  return component.props || {}
}

// 类型定义
interface ThemeSnapshot {
  id: string
  name: string
  description: string
  themeState: ThemeState
  componentState: {
    selectedComponent: ComponentConfig | null
    componentProps: Record<string, any>
  }
  metadata: {
    created: string
    version: string
    tags: string[]
    theme: string
    density: string
    rtl: boolean
  }
}
```

**Live Props 编辑器实现**：
```typescript
// src/components/playground/LivePropsEditor.tsx
import React, { useState } from 'react'
import { usePlaygroundStore } from '@/stores/playground'

interface LivePropsEditorProps {
  component: ComponentConfig
  themeState: ThemeState
  onThemeStateChange: (state: Partial<ThemeState>) => void
}

export const LivePropsEditor: React.FC<LivePropsEditorProps> = ({
  component,
  themeState,
  onThemeStateChange
}) => {
  const { updateComponentProp, componentProps } = usePlaygroundStore()
  const [activeTab, setActiveTab] = useState<'props' | 'theme' | 'tokens'>('props')

  return (
    <div className="live-props-editor">
      <div className="editor-header">
        <h3>实时编辑器</h3>
        <div className="component-info">
          <span className="component-name">{component.name}</span>
          <span className="component-category">{component.category}</span>
        </div>
      </div>

      <div className="editor-tabs">
        <button
          className={`tab ${activeTab === 'props' ? 'active' : ''}`}
          onClick={() => setActiveTab('props')}
        >
          组件属性
        </button>
        <button
          className={`tab ${activeTab === 'theme' ? 'active' : ''}`}
          onClick={() => setActiveTab('theme')}
        >
          主题设置
        </button>
        <button
          className={`tab ${activeTab === 'tokens' ? 'active' : ''}`}
          onClick={() => setActiveTab('tokens')}
        >
          令牌检查
        </button>
      </div>

      <div className="editor-content">
        {activeTab === 'props' && (
          <PropsEditor
            component={component}
            props={componentProps}
            onPropChange={updateComponentProp}
          />
        )}

        {activeTab === 'theme' && (
          <ThemeEditor
            themeState={themeState}
            onThemeStateChange={onThemeStateChange}
          />
        )}

        {activeTab === 'tokens' && (
          <TokenInspector
            component={component}
            themeState={themeState}
          />
        )}
      </div>
    </div>
  )
}

// 属性编辑器
const PropsEditor: React.FC<{
  component: ComponentConfig
  props: Record<string, any>
  onPropChange: (prop: string, value: any) => void
}> = ({ component, props, onPropChange }) => {
  return (
    <div className="props-editor">
      {Object.entries(component.props || {}).map(([propName, propConfig]) => (
        <div key={propName} className="prop-field">
          <label className="prop-label">{propName}</label>
          <PropInput
            name={propName}
            config={propConfig}
            value={props[propName]}
            onChange={(value) => onPropChange(propName, value)}
          />
        </div>
      ))}
    </div>
  )
}

// 主题编辑器
const ThemeEditor: React.FC<{
  themeState: ThemeState
  onThemeStateChange: (state: Partial<ThemeState>) => void
}> = ({ themeState, onThemeStateChange }) => {
  return (
    <div className="theme-editor">
      <div className="editor-section">
        <h4>颜色系统</h4>
        <ColorPaletteEditor
          colors={themeState.colors}
          onChange={(colors) => onThemeStateChange({ colors })}
        />
      </div>

      <div className="editor-section">
        <h4>间距系统</h4>
        <SpacingScaleEditor
          spacing={themeState.spacing}
          onChange={(spacing) => onThemeStateChange({ spacing })}
        />
      </div>

      <div className="editor-section">
        <h4>字体系统</h4>
        <TypographyEditor
          typography={themeState.typography}
          onChange={(typography) => onThemeStateChange({ typography })}
        />
      </div>

      <div className="editor-section">
        <h4>圆角系统</h4>
        <BorderRadiusEditor
          borderRadius={themeState.borderRadius}
          onChange={(borderRadius) => onThemeStateChange({ borderRadius })}
        />
      </div>

      <div className="editor-section">
        <h4>阴影系统</h4>
        <ShadowEditor
          shadows={themeState.shadows}
          onChange={(shadows) => onThemeStateChange({ shadows })}
        />
      </div>

      <div className="editor-section">
        <h4>动画系统</h4>
        <AnimationEditor
          animations={themeState.animations}
          onChange={(animations) => onThemeStateChange({ animations })}
        />
      </div>
    </div>
  )
}
```

**快照管理和比较模式**：
```typescript
// src/components/playground/SnapshotManager.tsx
import React, { useState } from 'react'
import { usePlaygroundStore } from '@/stores/playground'

export const SnapshotManager: React.FC = () => {
  const {
    snapshots,
    currentSnapshot,
    saveSnapshot,
    loadSnapshot,
    deleteSnapshot,
    compareMode,
    setCompareMode,
    snapshotA,
    snapshotB,
    setCompareSnapshots
  } = usePlaygroundStore()

  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [snapshotName, setSnapshotName] = useState('')
  const [snapshotDescription, setSnapshotDescription] = useState('')

  const handleSaveSnapshot = () => {
    if (!snapshotName.trim()) return
    saveSnapshot(snapshotName, snapshotDescription)
    setSnapshotName('')
    setSnapshotDescription('')
    setShowSaveDialog(false)
  }

  if (compareMode) {
    return <CompareMode />
  }

  return (
    <div className="snapshot-manager">
      <div className="snapshot-header">
        <h3>快照管理</h3>
        <div className="header-actions">
          <button
            className="compare-btn"
            onClick={() => setCompareMode(true)}
          >
            对比模式
          </button>
          <button
            className="save-btn"
            onClick={() => setShowSaveDialog(true)}
          >
            保存快照
          </button>
        </div>
      </div>

      {/* 保存快照对话框 */}
      {showSaveDialog && (
        <div className="snapshot-dialog-overlay">
          <div className="snapshot-dialog">
            <h4>保存当前状态为快照</h4>
            <div className="form-group">
              <label>快照名称</label>
              <input
                type="text"
                value={snapshotName}
                onChange={(e) => setSnapshotName(e.target.value)}
                placeholder="输入快照名称"
              />
            </div>
            <div className="form-group">
              <label>描述</label>
              <textarea
                value={snapshotDescription}
                onChange={(e) => setSnapshotDescription(e.target.value)}
                placeholder="输入描述（可选）"
                rows={3}
              />
            </div>
            <div className="dialog-actions">
              <button onClick={() => setShowSaveDialog(false)}>取消</button>
              <button onClick={handleSaveSnapshot}>保存</button>
            </div>
          </div>
        </div>
      )}

      {/* 快照列表 */}
      <div className="snapshot-list">
        {snapshots.length === 0 ? (
          <div className="empty-state">
            <p>还没有保存的快照</p>
            <p>创建你的第一个快照来保存当前状态</p>
          </div>
        ) : (
          snapshots.map((snapshot) => (
            <div
              key={snapshot.id}
              className={`snapshot-item ${currentSnapshot === snapshot.id ? 'active' : ''}`}
            >
              <div className="snapshot-info">
                <h4>{snapshot.name}</h4>
                <p>{snapshot.description}</p>
                <div className="snapshot-meta">
                  <span className="date">
                    {new Date(snapshot.metadata.created).toLocaleDateString()}
                  </span>
                  <span className="theme">{snapshot.metadata.theme}</span>
                  <span className="density">{snapshot.metadata.density}</span>
                  {snapshot.metadata.rtl && <span className="rtl">RTL</span>}
                </div>
              </div>
              <div className="snapshot-actions">
                <button
                  onClick={() => loadSnapshot(snapshot.id)}
                  disabled={currentSnapshot === snapshot.id}
                  className="load-btn"
                >
                  {currentSnapshot === snapshot.id ? '当前' : '加载'}
                </button>
                <button
                  onClick={() => deleteSnapshot(snapshot.id)}
                  className="delete-btn"
                  disabled={currentSnapshot === snapshot.id}
                >
                  删除
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

// 对比模式组件
const CompareMode: React.FC = () => {
  const {
    snapshots,
    compareMode,
    setCompareMode,
    snapshotA,
    snapshotB,
    setCompareSnapshots
  } = usePlaygroundStore()

  const [differences, setDifferences] = useState<ThemeDifference[]>([])

  const snapshotAData = snapshots.find(s => s.id === snapshotA)
  const snapshotBData = snapshots.find(s => s.id === snapshotB)

  React.useEffect(() => {
    if (snapshotAData && snapshotBData) {
      const diffs = compareThemeStates(snapshotAData.themeState, snapshotBData.themeState)
      setDifferences(diffs)
    } else {
      setDifferences([])
    }
  }, [snapshotAData, snapshotBData])

  return (
    <div className="compare-mode">
      <div className="compare-header">
        <h3>快照对比</h3>
        <button
          className="back-btn"
          onClick={() => setCompareMode(false)}
        >
          返回列表
        </button>
      </div>

      <div className="snapshot-selectors">
        <div className="selector">
          <label>快照 A:</label>
          <select
            value={snapshotA || ''}
            onChange={(e) => setCompareSnapshots(e.target.value || null, snapshotB)}
          >
            <option value="">选择快照</option>
            {snapshots.map((snapshot) => (
              <option key={snapshot.id} value={snapshot.id}>
                {snapshot.name}
              </option>
            ))}
          </select>
        </div>

        <div className="selector">
          <label>快照 B:</label>
          <select
            value={snapshotB || ''}
            onChange={(e) => setCompareSnapshots(snapshotA, e.target.value || null)}
          >
            <option value="">选择快照</option>
            {snapshots.map((snapshot) => (
              <option key={snapshot.id} value={snapshot.id}>
                {snapshot.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 差异展示 */}
      {snapshotAData && snapshotBData && (
        <div className="differences">
          <h4>
            差异分析
            {differences.length > 0 && (
              <span className="diff-count">({differences.length} 处差异)</span>
            )}
          </h4>

          {differences.length === 0 ? (
            <div className="no-differences">
              <p>两个快照完全相同</p>
            </div>
          ) : (
            <div className="differences-list">
              {differences.map((diff, index) => (
                <div key={index} className="difference-item">
                  <span className="diff-path">{diff.path}</span>
                  <span className="diff-type">{diff.type}</span>
                  <div className="diff-values">
                    <div className="value old">
                      <span className="label">旧值:</span>
                      <span className="value-content">{diff.oldValue}</span>
                    </div>
                    <div className="arrow">→</div>
                    <div className="value new">
                      <span className="label">新值:</span>
                      <span className="value-content">{diff.newValue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// 工具函数
function compareThemeStates(stateA: ThemeState, stateB: ThemeState): ThemeDifference[] {
  const differences: ThemeDifference[] = []

  // 比较颜色系统
  Object.keys(stateA.colors).forEach(key => {
    if (stateA.colors[key] !== stateB.colors[key]) {
      differences.push({
        path: `colors.${key}`,
        type: 'color',
        oldValue: stateA.colors[key],
        newValue: stateB.colors[key]
      })
    }
  })

  // 比较间距系统
  Object.keys(stateA.spacing).forEach(key => {
    if (stateA.spacing[key] !== stateB.spacing[key]) {
      differences.push({
        path: `spacing.${key}`,
        type: 'spacing',
        oldValue: stateA.spacing[key],
        newValue: stateB.spacing[key]
      })
    }
  })

  // 比较其他系统...
  return differences
}

// 类型定义
interface ThemeDifference {
  path: string
  type: 'color' | 'spacing' | 'typography' | 'borderRadius' | 'shadow' | 'animation'
  oldValue: string | number
  newValue: string | number
}
```

### 9.2 性能监控与 KPI 仪表板

**性能监控系统**：
```typescript
// src/lib/performance-monitor.ts
interface PerformanceMetrics {
  // 核心性能指标
  lcp: number // Largest Contentful Paint
  fid: number // First Input Delay
  cls: number // Cumulative Layout Shift
  fcp: number // First Contentful Paint
  ttfb: number // Time to First Byte

  // 自定义指标
  componentRenderTime: Record<string, number>
  themeSwitchTime: number
  searchResponseTime: number
  bundleLoadTime: number

  // 用户体验指标
  routeChangeTime: number
  interactiveTime: number
  errorRate: number

  // 资源使用
  memoryUsage: number
  bundleSize: number
  networkRequests: number
}

interface PerformanceThresholds {
  lcp: { good: number, needsImprovement: number, poor: number }
  fid: { good: number, needsImprovement: number, poor: number }
  cls: { good: number, needsImprovement: number, poor: number }
  fcp: { good: number, needsImprovement: number, poor: number }
  ttfb: { good: number, needsImprovement: number, poor: number }
}

const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
  lcp: { good: 2500, needsImprovement: 4000, poor: Infinity },
  fid: { good: 100, needsImprovement: 300, poor: Infinity },
  cls: { good: 0.1, needsImprovement: 0.25, poor: Infinity },
  fcp: { good: 1800, needsImprovement: 3000, poor: Infinity },
  ttfb: { good: 800, needsImprovement: 1800, poor: Infinity }
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {
    lcp: 0,
    fid: 0,
    cls: 0,
    fcp: 0,
    ttfb: 0,
    componentRenderTime: {},
    themeSwitchTime: 0,
    searchResponseTime: 0,
    bundleLoadTime: 0,
    routeChangeTime: 0,
    interactiveTime: 0,
    errorRate: 0,
    memoryUsage: 0,
    bundleSize: 0,
    networkRequests: 0
  }

  private observers: PerformanceObserver[] = []
  private measurementCallbacks: ((metrics: PerformanceMetrics) => void)[] = []

  constructor() {
    this.initializeObservers()
    this.measureCustomMetrics()
  }

  // 初始化性能观察器
  private initializeObservers() {
    // LCP 观察
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const lastEntry = entries[entries.length - 1] as any
        this.metrics.lcp = lastEntry.startTime
        this.notifyMeasurementCallbacks()
      })
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
      this.observers.push(lcpObserver)

      // FID 观察
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry: any) => {
          this.metrics.fid = entry.processingStart - entry.startTime
          this.notifyMeasurementCallbacks()
        })
      })
      fidObserver.observe({ entryTypes: ['first-input'] })
      this.observers.push(fidObserver)

      // CLS 观察
      let clsValue = 0
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            this.metrics.cls = clsValue
            this.notifyMeasurementCallbacks()
          }
        })
      })
      clsObserver.observe({ entryTypes: ['layout-shift'] })
      this.observers.push(clsObserver)

      // FCP 观察
      const fcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries()
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint')
        if (fcpEntry) {
          this.metrics.fcp = fcpEntry.startTime
          this.notifyMeasurementCallbacks()
        }
      })
      fcpObserver.observe({ entryTypes: ['paint'] })
      this.observers.push(fcpObserver)
    }
  }

  // 测量自定义指标
  private measureCustomMetrics() {
    // 测量主题切换时间
    this.measureThemeSwitchTime()

    // 测量搜索响应时间
    this.measureSearchResponseTime()

    // 测量路由切换时间
    this.measureRouteChangeTime()

    // 测量内存使用
    this.measureMemoryUsage()
  }

  // 测量主题切换时间
  private measureThemeSwitchTime() {
    let startTime = 0

    // 监听主题切换开始
    const themeSwitchStart = () => {
      startTime = performance.now()
    }

    // 监听主题切换完成
    const themeSwitchEnd = () => {
      if (startTime > 0) {
        this.metrics.themeSwitchTime = performance.now() - startTime
        this.notifyMeasurementCallbacks()
        startTime = 0
      }
    }

    document.addEventListener('themeSwitchStart', themeSwitchStart)
    document.addEventListener('themeSwitchEnd', themeSwitchEnd)
  }

  // 测量搜索响应时间
  private measureSearchResponseTime() {
    document.addEventListener('searchStart', () => {
      const startTime = performance.now()

      document.addEventListener('searchEnd', () => {
        this.metrics.searchResponseTime = performance.now() - startTime
        this.notifyMeasurementCallbacks()
      }, { once: true })
    })
  }

  // 测量路由切换时间
  private measureRouteChangeTime() {
    let startTime = 0

    const routeChangeStart = () => {
      startTime = performance.now()
    }

    const routeChangeComplete = () => {
      if (startTime > 0) {
        this.metrics.routeChangeTime = performance.now() - startTime
        this.notifyMeasurementCallbacks()
        startTime = 0
      }
    }

    document.addEventListener('routeChangeStart', routeChangeStart)
    document.addEventListener('routeChangeComplete', routeChangeComplete)
  }

  // 测量内存使用
  private measureMemoryUsage() {
    if ('memory' in performance) {
      const memory = (performance as any).memory
      this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024 // MB

      // 定期更新内存使用情况
      setInterval(() => {
        this.metrics.memoryUsage = memory.usedJSHeapSize / 1024 / 1024
        this.notifyMeasurementCallbacks()
      }, 5000)
    }
  }

  // 测量组件渲染时间
  measureComponentRenderTime(componentName: string, renderFn: () => void) {
    const startTime = performance.now()
    renderFn()
    const endTime = performance.now()

    this.metrics.componentRenderTime[componentName] = endTime - startTime
    this.notifyMeasurementCallbacks()
  }

  // 获取性能评分
  getPerformanceScore(): number {
    let totalScore = 0
    let weightedCount = 0

    // LCP 评分 (权重: 30%)
    const lcpScore = this.getMetricScore(this.metrics.lcp, 'lcp')
    totalScore += lcpScore * 0.3
    weightedCount += 0.3

    // FID 评分 (权重: 20%)
    const fidScore = this.getMetricScore(this.metrics.fid, 'fid')
    totalScore += fidScore * 0.2
    weightedCount += 0.2

    // CLS 评分 (权重: 25%)
    const clsScore = this.getMetricScore(this.metrics.cls, 'cls')
    totalScore += clsScore * 0.25
    weightedCount += 0.25

    // FCP 评分 (权重: 15%)
    const fcpScore = this.getMetricScore(this.metrics.fcp, 'fcp')
    totalScore += fcpScore * 0.15
    weightedCount += 0.15

    // TTFB 评分 (权重: 10%)
    const ttfbScore = this.getMetricScore(this.metrics.ttfb, 'ttfb')
    totalScore += ttfbScore * 0.1
    weightedCount += 0.1

    return weightedCount > 0 ? Math.round(totalScore / weightedCount) : 0
  }

  // 获取单个指标评分
  private getMetricScore(value: number, metric: keyof PerformanceThresholds): number {
    const threshold = PERFORMANCE_THRESHOLDS[metric]

    if (value <= threshold.good) return 100
    if (value <= threshold.needsImprovement) {
      const range = threshold.needsImprovement - threshold.good
      const offset = value - threshold.good
      return Math.round(100 - (offset / range) * 50)
    }
    if (value < threshold.poor) {
      const range = threshold.poor - threshold.needsImprovement
      const offset = value - threshold.needsImprovement
      return Math.round(50 - (offset / range) * 50)
    }
    return 0
  }

  // 获取性能等级
  getPerformanceGrade(): 'excellent' | 'good' | 'needs-improvement' | 'poor' {
    const score = this.getPerformanceScore()

    if (score >= 90) return 'excellent'
    if (score >= 75) return 'good'
    if (score >= 50) return 'needs-improvement'
    return 'poor'
  }

  // 添加测量回调
  onMeasurement(callback: (metrics: PerformanceMetrics) => void) {
    this.measurementCallbacks.push(callback)
  }

  // 通知测量回调
  private notifyMeasurementCallbacks() {
    this.measurementCallbacks.forEach(callback => callback(this.metrics))
  }

  // 获取当前指标
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics }
  }

  // 生成性能报告
  generateReport(): PerformanceReport {
    const score = this.getPerformanceScore()
    const grade = this.getPerformanceGrade()

    return {
      timestamp: new Date().toISOString(),
      score,
      grade,
      metrics: { ...this.metrics },
      recommendations: this.generateRecommendations(),
      thresholds: PERFORMANCE_THRESHOLDS
    }
  }

  // 生成优化建议
  private generateRecommendations(): string[] {
    const recommendations: string[] = []

    if (this.metrics.lcp > PERFORMANCE_THRESHOLDS.lcp.good) {
      recommendations.push('优化最大内容绘制时间：考虑预加载关键资源、使用CDN、优化图片')
    }

    if (this.metrics.fid > PERFORMANCE_THRESHOLDS.fid.good) {
      recommendations.push('优化首次输入延迟：减少主线程阻塞、分割代码、使用Web Workers')
    }

    if (this.metrics.cls > PERFORMANCE_THRESHOLDS.cls.good) {
      recommendations.push('优化累积布局偏移：为图片和广告设置尺寸、避免插入内容')
    }

    if (this.metrics.fcp > PERFORMANCE_THRESHOLDS.fcp.good) {
      recommendations.push('优化首次内容绘制：减少服务器响应时间、消除阻塞渲染的资源')
    }

    if (this.metrics.ttfb > PERFORMANCE_THRESHOLDS.ttfb.good) {
      recommendations.push('优化首字节时间：使用CDN、优化服务器配置、启用压缩')
    }

    return recommendations
  }

  // 清理观察器
  disconnect() {
    this.observers.forEach(observer => observer.disconnect())
    this.observers = []
    this.measurementCallbacks = []
  }
}

// 性能报告接口
interface PerformanceReport {
  timestamp: string
  score: number
  grade: 'excellent' | 'good' | 'needs-improvement' | 'poor'
  metrics: PerformanceMetrics
  recommendations: string[]
  thresholds: PerformanceThresholds
}

// 全局性能监控实例
export const performanceMonitor = new PerformanceMonitor()
```

**KPI 仪表板组件**：
```typescript
// src/components/dashboard/KPIDashboard.tsx
import React, { useState, useEffect } from 'react'
import { performanceMonitor, PerformanceReport } from '@/lib/performance-monitor'

export const KPIDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState(performanceMonitor.getMetrics())
  const [report, setReport] = useState<PerformanceReport | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    // 监听性能指标更新
    performanceMonitor.onMeasurement((newMetrics) => {
      setMetrics(newMetrics)
    })

    // 定期生成报告
    const reportInterval = setInterval(() => {
      const newReport = performanceMonitor.generateReport()
      setReport(newReport)
    }, 10000) // 每10秒更新一次

    return () => {
      clearInterval(reportInterval)
    }
  }, [])

  const score = performanceMonitor.getPerformanceScore()
  const grade = performanceMonitor.getPerformanceGrade()

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'excellent': return '#10b981' // green
      case 'good': return '#3b82f6' // blue
      case 'needs-improvement': return '#f59e0b' // yellow
      case 'poor': return '#ef4444' // red
      default: return '#6b7280' // gray
    }
  }

  const getMetricColor = (value: number, metric: keyof PerformanceThresholds) => {
    const thresholds = PERFORMANCE_THRESHOLDS[metric]
    if (value <= thresholds.good) return '#10b981'
    if (value <= thresholds.needsImprovement) return '#f59e0b'
    return '#ef4444'
  }

  return (
    <div className="kpi-dashboard">
      <div className="dashboard-header">
        <h2>性能监控仪表板</h2>
        <div className="overall-score">
          <div
            className="score-circle"
            style={{ borderColor: getGradeColor(grade) }}
          >
            <span className="score-value" style={{ color: getGradeColor(grade) }}>
              {score}
            </span>
          </div>
          <div className="score-info">
            <span className="score-grade" style={{ color: getGradeColor(grade) }}>
              {grade.toUpperCase()}
            </span>
            <span className="score-label">性能评分</span>
          </div>
        </div>
      </div>

      <div className="metrics-grid">
        {/* Core Web Vitals */}
        <div className="metric-card">
          <h3>Core Web Vitals</h3>
          <div className="metric-item">
            <span className="metric-name">LCP</span>
            <span
              className="metric-value"
              style={{ color: getMetricColor(metrics.lcp, 'lcp') }}
            >
              {Math.round(metrics.lcp)}ms
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-name">FID</span>
            <span
              className="metric-value"
              style={{ color: getMetricColor(metrics.fid, 'fid') }}
            >
              {Math.round(metrics.fid)}ms
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-name">CLS</span>
            <span
              className="metric-value"
              style={{ color: getMetricColor(metrics.cls, 'cls') }}
            >
              {metrics.cls.toFixed(3)}
            </span>
          </div>
        </div>

        {/* Other Metrics */}
        <div className="metric-card">
          <h3>其他指标</h3>
          <div className="metric-item">
            <span className="metric-name">FCP</span>
            <span
              className="metric-value"
              style={{ color: getMetricColor(metrics.fcp, 'fcp') }}
            >
              {Math.round(metrics.fcp)}ms
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-name">TTFB</span>
            <span
              className="metric-value"
              style={{ color: getMetricColor(metrics.ttfb, 'ttfb') }}
            >
              {Math.round(metrics.ttfb)}ms
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-name">路由切换</span>
            <span className="metric-value">
              {Math.round(metrics.routeChangeTime)}ms
            </span>
          </div>
        </div>

        {/* Custom Metrics */}
        <div className="metric-card">
          <h3>自定义指标</h3>
          <div className="metric-item">
            <span className="metric-name">主题切换</span>
            <span className="metric-value">
              {Math.round(metrics.themeSwitchTime)}ms
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-name">搜索响应</span>
            <span className="metric-value">
              {Math.round(metrics.searchResponseTime)}ms
            </span>
          </div>
          <div className="metric-item">
            <span className="metric-name">内存使用</span>
            <span className="metric-value">
              {Math.round(metrics.memoryUsage)}MB
            </span>
          </div>
        </div>

        {/* Component Performance */}
        <div className="metric-card">
          <h3>组件性能</h3>
          <div className="component-metrics">
            {Object.entries(metrics.componentRenderTime).map(([component, time]) => (
              <div key={component} className="metric-item">
                <span className="metric-name">{component}</span>
                <span className="metric-value">
                  {Math.round(time)}ms
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="dashboard-actions">
        <button
          className="toggle-details-btn"
          onClick={() => setShowDetails(!showDetails)}
        >
          {showDetails ? '隐藏详情' : '显示详情'}
        </button>
        <button
          className="generate-report-btn"
          onClick={() => {
            const newReport = performanceMonitor.generateReport()
            setReport(newReport)
            console.log('Performance Report:', newReport)
          }}
        >
          生成报告
        </button>
      </div>

      {/* Detailed Report */}
      {showDetails && report && (
        <div className="detailed-report">
          <h3>详细性能报告</h3>
          <div className="report-content">
            <div className="report-section">
              <h4>优化建议</h4>
              <ul className="recommendations">
                {report.recommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>

            <div className="report-section">
              <h4>原始数据</h4>
              <pre className="raw-data">
                {JSON.stringify(report.metrics, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 性能阈值常量
const PERFORMANCE_THRESHOLDS = {
  lcp: { good: 2500, needsImprovement: 4000, poor: Infinity },
  fid: { good: 100, needsImprovement: 300, poor: Infinity },
  cls: { good: 0.1, needsImprovement: 0.25, poor: Infinity },
  fcp: { good: 1800, needsImprovement: 3000, poor: Infinity },
  ttfb: { good: 800, needsImprovement: 1800, poor: Infinity }
}
```

**导出配置管理器**：
```typescript
// src/lib/playground-manager.ts
import { usePlaygroundStore } from '@/stores/playground'
import { performanceMonitor } from './performance-monitor'

export interface ExportConfig {
  themeState: ThemeState
  componentState: {
    selectedComponent: ComponentConfig | null
    componentProps: Record<string, any>
  }
  playgroundSettings: {
    editMode: 'live' | 'snapshot'
    showTokenInspector: boolean
    showPropsEditor: boolean
    showSnapshotManager: boolean
  }
  metadata: {
    exported: string
    version: string
    url: string
  }
}

export interface ImportConfig {
  config: ExportConfig
  mergeStrategy: 'replace' | 'merge'
}

export class PlaygroundManager {
  // 初始化Playground
  static initialize() {
    // 恢复上一次的状态
    const savedConfig = localStorage.getItem('xorigo-playground-config')
    if (savedConfig) {
      try {
        const config: ExportConfig = JSON.parse(savedConfig)
        this.importConfig({ config, mergeStrategy: 'merge' })
      } catch (error) {
        console.error('Failed to load playground config:', error)
      }
    }

    // 初始化性能监控
    performanceMonitor.onMeasurement((metrics) => {
      // 发送性能数据到分析服务（可选）
      this.sendAnalytics(metrics)
    })
  }

  // 导出当前配置
  static exportConfig(): ExportConfig {
    const store = usePlaygroundStore.getState()

    return {
      themeState: store.themeState,
      componentState: {
        selectedComponent: store.selectedComponent,
        componentProps: store.componentProps
      },
      playgroundSettings: {
        editMode: store.editMode,
        showTokenInspector: store.showTokenInspector,
        showPropsEditor: store.showPropsEditor,
        showSnapshotManager: store.showSnapshotManager
      },
      metadata: {
        exported: new Date().toISOString(),
        version: '1.0.0',
        url: window.location.href
      }
    }
  }

  // 导入配置
  static importConfig({ config, mergeStrategy }: ImportConfig) {
    const store = usePlaygroundStore.getState()

    if (mergeStrategy === 'replace') {
      // 完全替换
      store.setThemeState('custom') // 设置为自定义主题
      store.themeState = config.themeState

      if (config.componentState.selectedComponent) {
        store.selectComponent(config.componentState.selectedComponent)
        store.componentProps = config.componentState.componentProps
      }

      store.setEditMode(config.playgroundSettings.editMode)
      store.showTokenInspector = config.playgroundSettings.showTokenInspector
      store.showPropsEditor = config.playgroundSettings.showPropsEditor
      store.showSnapshotManager = config.playgroundSettings.showSnapshotManager

    } else {
      // 合并配置
      // 这里可以根据需要实现更复杂的合并逻辑
      store.showTokenInspector = config.playgroundSettings.showTokenInspector
      store.showPropsEditor = config.playgroundSettings.showPropsEditor
    }
  }

  // 保存配置到本地存储
  static saveConfig(config: ExportConfig) {
    localStorage.setItem('xorigo-playground-config', JSON.stringify(config))
  }

  // 分享配置
  static shareConfig(): string {
    const config = this.exportConfig()
    const compressed = this.compressConfig(config)
    const shareUrl = `${window.location.origin}${window.location.pathname}?config=${compressed}`

    // 复制到剪贴板
    navigator.clipboard.writeText(shareUrl).then(() => {
      console.log('Configuration URL copied to clipboard')
    }).catch(err => {
      console.error('Failed to copy URL:', err)
    })

    return shareUrl
  }

  // 从URL加载配置
  static loadConfigFromURL(): boolean {
    const urlParams = new URLSearchParams(window.location.search)
    const configParam = urlParams.get('config')

    if (configParam) {
      try {
        const config = this.decompressConfig(configParam)
        this.importConfig({ config, mergeStrategy: 'replace' })
        return true
      } catch (error) {
        console.error('Failed to load config from URL:', error)
        return false
      }
    }

    return false
  }

  // 压缩配置
  private static compressConfig(config: ExportConfig): string {
    // 使用简单的压缩算法，实际项目中可以使用更好的压缩库
    const json = JSON.stringify(config)
    return btoa(json)
  }

  // 解压缩配置
  private static decompressConfig(compressed: string): ExportConfig {
    const json = atob(compressed)
    return JSON.parse(json)
  }

  // 发送分析数据
  private static sendAnalytics(metrics: PerformanceMetrics) {
    // 这里可以发送到分析服务
    // 例如：Google Analytics、自建分析平台等
    if (process.env.NODE_ENV === 'production') {
      // 发送数据的逻辑
      console.log('Sending analytics:', metrics)
    }
  }

  // 生成性能报告
  static generatePerformanceReport(): PerformanceReport {
    return performanceMonitor.generateReport()
  }

  // 下载配置文件
  static downloadConfig() {
    const config = this.exportConfig()
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json'
    })

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `xorigo-playground-config-${new Date().toISOString().split('T')[0]}.json`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  // 上传配置文件
  static uploadConfig(file: File): Promise<ExportConfig> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const config = JSON.parse(event.target?.result as string)
          resolve(config)
        } catch (error) {
          reject(new Error('Invalid configuration file'))
        }
      }

      reader.onerror = () => {
        reject(new Error('Failed to read file'))
      }

      reader.readAsText(file)
    })
  }
}
```

这套完整的DX增强层为Xorigo UI Website提供了：

1. **完整的Playground功能**：Live Props编辑、快照管理、对比模式
2. **性能监控系统**：Core Web Vitals、自定义指标、KPI仪表板
3. **配置管理**：导入/导出、分享功能、本地存储
4. **开发体验优化**：实时编辑、状态持久化、性能分析

---

## 十、@xorigo-ui/sdk-website 统一数据访问层

### 10.1 SDK 层架构设计

**核心定位**：为Website提供统一、类型安全、可测试的数据访问抽象，解耦Website与内部包结构的直接依赖。

```
packages/sdk-website/
├── src/
│   ├── clients/
│   │   ├── registry.client.ts      # 组件注册表客户端
│   │   ├── tokens.client.ts        # 令牌系统客户端
│   │   ├── docs.client.ts          # 文档系统客户端
│   │   ├── templates.client.ts     # 模板系统客户端
│   │   └── i18n.client.ts          # 国际化客户端
│   ├── types/
│   │   ├── registry.types.ts       # 注册表类型定义
│   │   ├── tokens.types.ts         # 令牌类型定义
│   │   ├── docs.types.ts           # 文档类型定义
│   │   └── common.types.ts         # 通用类型定义
│   ├── utils/
│   │   ├── cache.ts                # 缓存工具
│   │   ├── validation.ts           # 数据验证
│   │   ├── error-handling.ts       # 错误处理
│   │   └── performance.ts          # 性能监控
│   ├── hooks/
│   │   ├── useRegistry.ts          # 注册表Hook
│   │   ├── useTokens.ts            # 令牌Hook
│   │   ├── useDocs.ts              # 文档Hook
│   │   └── useI18n.ts              # 国际化Hook
│   └── index.ts
├── tests/
│   ├── clients/
│   ├── hooks/
│   └── utils/
├── package.json
├── tsconfig.json
└── README.md
```

### 10.2 核心客户端实现

**Registry客户端**：
```typescript
// packages/sdk-website/src/clients/registry.client.ts
import { z } from 'zod'
import {
  ComponentRegistrySchema,
  ComponentRegistryItem,
  RegistryQueryOptions,
  RegistryResponse
} from '../types/registry.types'
import { BaseClient } from './base.client'
import { CacheManager } from '../utils/cache'

export class RegistryClient extends BaseClient {
  private cache: CacheManager<ComponentRegistryItem>

  constructor(baseUrl: string, options?: ClientOptions) {
    super(baseUrl, options)
    this.cache = new CacheManager<ComponentRegistryItem>({
      ttl: 10 * 60 * 1000, // 10分钟
      maxSize: 1000
    })
  }

  /**
   * 获取所有组件注册信息
   */
  async getAllComponents(options?: RegistryQueryOptions): Promise<ComponentRegistryItem[]> {
    const cacheKey = this.generateCacheKey('all-components', options)

    // 检查缓存
    const cached = this.cache.get(cacheKey)
    if (cached) {
      return cached
    }

    try {
      // 从readonly层读取数据
      const response = await this.get<RegistryResponse>('/data/registry.readonly.json', {
        query: options,
        cache: 'force-cache'
      })

      // 数据验证
      const validatedData = ComponentRegistrySchema.parse(response.data)

      // 应用过滤器
      let filteredData = validatedData.components
      if (options?.category) {
        filteredData = filteredData.filter(item => item.category === options.category)
      }
      if (options?.tags) {
        filteredData = filteredData.filter(item =>
          options.tags!.some(tag => item.tags?.includes(tag))
        )
      }

      // 缓存结果
      this.cache.set(cacheKey, filteredData)

      return filteredData
    } catch (error) {
      throw new RegistryError(`Failed to fetch components: ${error.message}`, error)
    }
  }

  /**
   * 根据名称获取组件
   */
  async getComponentByName(name: string): Promise<ComponentRegistryItem | null> {
    try {
      const components = await this.getAllComponents()
      return components.find(item => item.name === name) || null
    } catch (error) {
      throw new RegistryError(`Failed to get component "${name}": ${error.message}`, error)
    }
  }

  /**
   * 搜索组件
   */
  async searchComponents(query: string, options?: RegistryQueryOptions): Promise<ComponentRegistryItem[]> {
    try {
      const components = await this.getAllComponents(options)

      if (!query.trim()) {
        return components
      }

      const searchTerms = query.toLowerCase().split(' ')

      return components.filter(component => {
        const searchText = `${component.name} ${component.title} ${component.description} ${component.tags?.join(' ') || ''}`.toLowerCase()

        return searchTerms.every(term => searchText.includes(term))
      })
    } catch (error) {
      throw new RegistryError(`Search failed for query "${query}": ${error.message}`, error)
    }
  }

  /**
   * 获取组件分类统计
   */
  async getCategoryStats(): Promise<Record<string, number>> {
    try {
      const components = await this.getAllComponents()

      return components.reduce((stats, component) => {
        stats[component.category] = (stats[component.category] || 0) + 1
        return stats
      }, {} as Record<string, number>)
    } catch (error) {
      throw new RegistryError(`Failed to get category stats: ${error.message}`, error)
    }
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * 预热缓存
   */
  async warmupCache(): Promise<void> {
    try {
      await this.getAllComponents()
      await this.getCategoryStats()
    } catch (error) {
      console.warn('Failed to warmup cache:', error)
    }
  }
}

// 自定义错误类
export class RegistryError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message)
    this.name = 'RegistryError'
  }
}
```

### 10.3 React Hooks集成

**Registry Hooks**：
```typescript
// packages/sdk-website/src/hooks/useRegistry.ts
import { useState, useEffect, useCallback } from 'react'
import { RegistryClient } from '../clients/registry.client'
import { ComponentRegistryItem, RegistryQueryOptions } from '../types/registry.types'

export interface UseRegistryOptions {
  initialCategory?: string
  initialTags?: string[]
  enabled?: boolean
}

export interface UseRegistryReturn {
  components: ComponentRegistryItem[]
  loading: boolean
  error: Error | null
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  selectedTags: string[]
  setSelectedTags: (tags: string[]) => void
  refetch: () => Promise<void>
  clearCache: () => void
}

export function useRegistry(
  client: RegistryClient,
  options: UseRegistryOptions = {}
): UseRegistryReturn {
  const {
    initialCategory = '',
    initialTags = [],
    enabled = true
  } = options

  const [components, setComponents] = useState<ComponentRegistryItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [selectedTags, setSelectedTags] = useState(initialTags)

  const fetchComponents = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      const queryOptions: RegistryQueryOptions = {
        category: selectedCategory || undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined
      }

      let result: ComponentRegistryItem[]

      if (searchQuery.trim()) {
        result = await client.searchComponents(searchQuery, queryOptions)
      } else {
        result = await client.getAllComponents(queryOptions)
      }

      setComponents(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [client, enabled, searchQuery, selectedCategory, selectedTags])

  const refetch = useCallback(() => {
    return fetchComponents()
  }, [fetchComponents])

  const clearCache = useCallback(() => {
    client.clearCache()
  }, [client])

  // 初始加载
  useEffect(() => {
    fetchComponents()
  }, [fetchComponents])

  return {
    components,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedTags,
    setSelectedTags,
    refetch,
    clearCache
  }
}
```

### 10.4 SDK使用示例

**在Website中的集成**：
```typescript
// apps/website/lib/clients.ts
import { RegistryClient } from '@xorigo-ui/sdk-website'
import { TokensClient } from '@xorigo-ui/sdk-website'

// 创建客户端实例
export const registryClient = new RegistryClient('/api/data', {
  timeout: 15000,
  retries: 2,
  cache: 'force-cache'
})

export const tokensClient = new TokensClient('/api/data', {
  timeout: 10000,
  retries: 2,
  cache: 'force-cache'
})

// apps/website/app/components/ComponentGallery.tsx
'use client'

import { useRegistry } from '@xorigo-ui/sdk-website'
import { registryClient } from '@/lib/clients'

export function ComponentGallery() {
  const {
    components,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    refetch
  } = useRegistry(registryClient)

  if (loading) return <div>Loading components...</div>
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      <div className="filters">
        <input
          type="text"
          placeholder="Search components..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          <option value="base">Base</option>
          <option value="layout">Layout</option>
          <option value="navigation">Navigation</option>
        </select>
      </div>

      <div className="component-grid">
        {components.map((component) => (
          <ComponentCard key={component.name} component={component} />
        ))}
      </div>
    </div>
  )
}
```

## 十一、Docs Pipeline 自动同步机制

### 11.1 同步架构设计

**目标**：建立从组件发布到文档更新的自动化流水线，确保"单一事实来源"原则，消除手工维护成本。

```
scripts/docs-pipeline/
├── sync-from-registry.ts      # 从注册表同步组件信息
├── generate-mdx-templates.ts   # 生成MDX模板文件
├── generate-props-table.ts     # 生成Props表格
├── generate-examples.ts        # 生成示例代码
├── validate-docs.ts           # 文档完整性验证
├── build-search-index.ts      # 构建搜索索引
└── deploy-docs.ts             # 部署到文档站点
```

### 11.2 核心同步脚本

**从注册表同步组件信息**：
```typescript
// scripts/docs-pipeline/sync-from-registry.ts
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { RegistryClient } from '@xorigo-ui/sdk-website'

interface SyncConfig {
  registryPath: string
  outputDir: string
  templateDir: string
  examplesDir: string
}

interface ComponentDocData {
  component: ComponentRegistryItem
  propsTable: string
  examples: CodeExample[]
  mdxTemplate: string
  filePath: string
}

export class DocsSyncPipeline {
  private registryClient: RegistryClient
  private config: SyncConfig

  constructor(config: SyncConfig) {
    this.config = config
    this.registryClient = new RegistryClient(config.registryPath)
  }

  /**
   * 执行完整的同步流程
   */
  async sync(): Promise<void> {
    console.log('🚀 Starting docs synchronization...')

    try {
      // 1. 获取最新组件注册信息
      const components = await this.registryClient.getAllComponents()
      console.log(`📦 Found ${components.length} components`)

      // 2. 为每个组件生成文档
      const docsData: ComponentDocData[] = []
      for (const component of components) {
        const docData = await this.generateComponentDocs(component)
        docsData.push(docData)
      }

      // 3. 生成分类索引
      await this.generateCategoryIndexes(docsData)

      // 4. 生成搜索索引
      await this.generateSearchIndex(docsData)

      // 5. 验证文档完整性
      await this.validateDocs(docsData)

      console.log('✅ Documentation synchronization completed successfully')
      console.log(`📄 Generated ${docsData.length} component documentation files`)
    } catch (error) {
      console.error('❌ Documentation synchronization failed:', error)
      throw error
    }
  }

  /**
   * 为单个组件生成文档
   */
  private async generateComponentDocs(component: ComponentRegistryItem): Promise<ComponentDocData> {
    console.log(`📝 Generating docs for ${component.name}...`)

    // 1. 生成Props表格
    const propsTable = await this.generatePropsTable(component)

    // 2. 生成示例代码
    const examples = await this.generateExamples(component)

    // 3. 生成MDX模板
    const mdxTemplate = await this.generateMDXTemplate(component, propsTable, examples)

    // 4. 确定文件路径
    const filePath = this.getComponentFilePath(component)

    // 5. 写入文件
    await this.writeFile(filePath, mdxTemplate)

    return {
      component,
      propsTable,
      examples,
      mdxTemplate,
      filePath
    }
  }

  /**
   * 生成Props表格
   */
  private async generatePropsTable(component: ComponentRegistryItem): Promise<string> {
    if (!component.props || Object.keys(component.props).length === 0) {
      return '<p>This component does not accept any props.</p>'
    }

    const propsEntries = Object.entries(component.props).map(([name, propConfig]) => {
      const type = this.formatPropType(propConfig.type)
      const defaultValue = propConfig.default ? `\`${propConfig.default}\`` : '-'
      const required = propConfig.required ? '✅ Yes' : '❌ No'
      const description = propConfig.description || '-'

      return `| \`${name}\` | ${type} | ${defaultValue} | ${required} | ${description} |`
    }).join('\n')

    return `
## Props

| Name | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
${propsEntries}
    `.trim()
  }

  /**
   * 生成示例代码
   */
  private async generateExamples(component: ComponentRegistryItem): Promise<CodeExample[]> {
    const examples: CodeExample[] = []

    // 1. 基础用法示例
    examples.push(await this.generateBasicExample(component))

    // 2. 变体示例
    if (component.variants && component.variants.length > 0) {
      for (const variant of component.variants) {
        examples.push(await this.generateVariantExample(component, variant))
      }
    }

    // 3. 高级用法示例
    if (component.complexity === 'advanced') {
      examples.push(await this.generateAdvancedExample(component))
    }

    return examples
  }

  /**
   * 生成基础用法示例
   */
  private async generateBasicExample(component: ComponentRegistryItem): Promise<CodeExample> {
    const importStatement = `import { ${component.name} } from '@xorigo-ui/core'`

    // 根据组件类型生成基础示例
    let basicUsage = ''
    switch (component.category) {
      case 'base':
        basicUsage = `<${component.name}>Hello World</${component.name}>`
        break
      case 'form':
        basicUsage = `<${component.name} placeholder="Enter text" />`
        break
      case 'navigation':
        basicUsage = `<${component.name} href="/home">Home</${component.name}>`
        break
      default:
        basicUsage = `<${component.name} />`
    }

    return {
      title: 'Basic Usage',
      description: `Basic usage of the ${component.title} component.`,
      code: `${importStatement}

export default function Example() {
  return (
    <div>
      ${basicUsage}
    </div>
  )
}`,
      live: true
    }
  }

  /**
   * 生成MDX模板
   */
  private async generateMDXTemplate(
    component: ComponentRegistryItem,
    propsTable: string,
    examples: CodeExample[]
  ): Promise<string> {
    const examplesSection = examples.map(example => `
## ${example.title}

${example.description}

\`\`\`tsx
${example.code}
\`\`\`

${example.live ? `<LiveCode>{${example.code}}</LiveCode>` : ''}
    `).join('\n')

    const metadata = {
      title: component.title,
      description: component.description,
      category: component.category,
      tags: component.tags || [],
      accessibility: component.accessibility || false,
      rtl: component.rtl || false,
      i18n: component.i18n || false
    }

    return `---
title: "${component.title}"
description: "${component.description}"
category: "${component.category}"
tags: [${(component.tags || []).map(tag => `"${tag}"`).join(', ')}]
accessibility: ${component.accessibility || false}
rtl: ${component.rtl || false}
i18n: ${component.i18n || false}
---

# ${component.title}

${component.description}

${propsTable}

${examplesSection}

## Accessibility

${component.accessibility ?
  `This component follows WCAG 2.1 AA guidelines. Learn more about [accessibility best practices](${component.name}/accessibility).` :
  `This component does not have specific accessibility considerations. Consider implementing appropriate ARIA attributes and keyboard navigation.`}

## Design Guidelines

View the [design specifications](${component.name}/design) for usage guidelines and design patterns.

## API Reference

See the [complete API documentation](${component.name}/api) for all available props and methods.
    `.trim()
  }

  /**
   * 生成分类索引
   */
  private async generateCategoryIndexes(docsData: ComponentDocData[]): Promise<void> {
    const categories = [...new Set(docsData.map(doc => doc.component.category))]

    for (const category of categories) {
      const categoryDocs = docsData.filter(doc => doc.component.category === category)

      const indexContent = this.generateCategoryIndex(category, categoryDocs)
      const indexPath = join(this.config.outputDir, category, 'index.mdx')

      await this.writeFile(indexPath, indexContent)
    }
  }

  /**
   * 生成分类索引内容
   */
  private generateCategoryIndex(category: string, docsData: ComponentDocData[]): string {
    const componentList = docsData.map(doc => {
      const { component } = doc
      return `### [${component.title}](${component.name})

${component.description}

**Tags**: ${component.tags?.join(', ') || 'None'}
**Accessibility**: ${component.accessibility ? '✅' : '❌'}
**RTL Support**: ${component.rtl ? '✅' : '❌'}
      `
    }).join('\n\n')

    return `---
title: "${this.capitalizeFirst(category)} Components"
description: "All ${category} components in Xorigo UI"
category: "${category}"
---

# ${this.capitalizeFirst(category)} Components

${componentList}
    `.trim()
  }

  /**
   * 生成搜索索引
   */
  private async generateSearchIndex(docsData: ComponentDocData[]): Promise<void> {
    const searchIndex = docsData.map(doc => ({
      id: doc.component.name,
      title: doc.component.title,
      description: doc.component.description,
      category: doc.component.category,
      tags: doc.component.tags || [],
      url: `/components/${doc.component.name}`,
      content: this.extractTextContent(doc.mdxTemplate)
    }))

    const indexPath = join(this.config.outputDir, 'search-index.json')
    await this.writeFile(indexPath, JSON.stringify(searchIndex, null, 2))
  }

  /**
   * 验证文档完整性
   */
  private async validateDocs(docsData: ComponentDocData[]): Promise<void> {
    console.log('🔍 Validating documentation integrity...')

    const issues: string[] = []

    for (const doc of docsData) {
      // 检查必要字段
      if (!doc.component.title) {
        issues.push(`${doc.component.name}: Missing title`)
      }
      if (!doc.component.description) {
        issues.push(`${doc.component.name}: Missing description`)
      }

      // 检查示例代码
      if (doc.examples.length === 0) {
        issues.push(`${doc.component.name}: No examples provided`)
      }

      // 检查Props文档
      if (doc.component.props && Object.keys(doc.component.props).length > 0) {
        if (!doc.propsTable.includes('Props')) {
          issues.push(`${doc.component.name}: Props table not generated`)
        }
      }
    }

    if (issues.length > 0) {
      console.warn('⚠️ Documentation validation issues found:')
      issues.forEach(issue => console.warn(`  - ${issue}`))
    } else {
      console.log('✅ All documentation passed validation')
    }
  }

  // 工具方法
  private getComponentFilePath(component: ComponentRegistryItem): string {
    return join(this.config.outputDir, component.category, component.name, 'index.mdx')
  }

  private async writeFile(filePath: string, content: string): Promise<void> {
    const dir = dirname(filePath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    writeFileSync(filePath, content, 'utf-8')
  }

  private formatPropType(type: any): string {
    if (typeof type === 'string') return type
    if (Array.isArray(type)) return type.join(' | ')
    return JSON.stringify(type)
  }

  private capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  private extractTextContent(mdxContent: string): string {
    // 移除代码块和Front Matter
    return mdxContent
      .replace(/^---[\s\S]*?---\n/, '') // 移除Front Matter
      .replace(/```[\s\S]*?```/g, '') // 移除代码块
      .replace(/`[^`]+`/g, '') // 移除行内代码
      .replace(/[#*`\[\]()]/g, '') // 移除Markdown语法
      .replace(/\s+/g, ' ') // 合并空白字符
      .trim()
  }
}

// 使用示例
async function runSync() {
  const pipeline = new DocsSyncPipeline({
    registryPath: './packages/core/dist/registry.json',
    outputDir: './apps/website/docs/components',
    templateDir: './templates/docs',
    examplesDir: './examples'
  })

  await pipeline.sync()
}

// 如果直接运行此脚本
if (require.main === module) {
  runSync().catch(console.error)
}
```

### 11.3 CI集成

**GitHub Actions工作流**：
```yaml
# .github/workflows/docs-sync.yml
name: Docs Sync Pipeline

on:
  push:
    paths:
      - 'packages/core/src/**'
      - 'packages/core/registry.json'
  workflow_dispatch:

jobs:
  sync-docs:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build core package
        run: npm run build:core

      - name: Sync documentation
        run: npm run docs:sync

      - name: Validate docs
        run: npm run docs:validate

      - name: Deploy docs
        if: github.ref == 'refs/heads/main'
        run: npm run docs:deploy

      - name: Create PR for docs changes
        if: github.ref != 'refs/heads/main'
        uses: peter-evans/create-pull-request@v5
        with:
          title: 'docs: sync documentation with component changes'
          body: 'Automated documentation sync from component changes'
          branch: docs-sync
          delete-branch: true
```

### 11.4 Package.json脚本

```json
{
  "scripts": {
    "docs:sync": "tsx scripts/docs-pipeline/sync-from-registry.ts",
    "docs:validate": "tsx scripts/docs-pipeline/validate-docs.ts",
    "docs:build": "npm run docs:sync && npm run docs:validate",
    "docs:deploy": "npm run docs:build && npm run deploy:website",
    "docs:watch": "nodemon --watch packages/core --exec 'npm run docs:sync'"
  }
}
```

这个Docs Pipeline系统提供了：

1. **自动化同步**：从组件注册表自动生成最新文档
2. **完整性验证**：确保所有组件都有完整的文档
3. **搜索索引**：为文档站点提供搜索功能
4. **CI集成**：在组件更新时自动触发文档同步
5. **模板化生成**：统一的MDX模板，确保文档格式一致

---

## 十二、KPI与CI指标闭环系统

### 12.1 性能指标监控架构

**目标**：建立从CI构建到线上监控的完整质量闭环，实现数据驱动的性能优化。

```
monitoring/
├── ci/
│   ├── bundle-analyzer.ts        # 构建体积分析
│   ├── performance-budget.ts     # 性能预算检查
│   ├── lighthouse-ci.ts          # Lighthouse CI集成
│   └── metrics-collector.ts      # 指标收集器
├── runtime/
│   ├── web-vitals-monitor.ts     # 实时性能监控
│   ├── error-tracking.ts         # 错误追踪
│   ├── user-analytics.ts         # 用户行为分析
│   └── health-check.ts           # 健康检查
├── dashboard/
│   ├── metrics-dashboard.tsx     # 指标仪表板
│   ├── performance-trends.tsx    # 性能趋势图
│   └── alerting-system.ts        # 告警系统
└── reports/
    ├── daily-report.ts           # 日报生成
    ├── weekly-summary.ts         # 周报汇总
    └── monthly-analysis.ts       # 月度分析
```

### 12.2 CI性能监控实现

**构建时性能分析**：
```typescript
// monitoring/ci/bundle-analyzer.ts
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { gzipSync } from 'zlib'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

interface BundleAnalysisResult {
  totalSize: number
  gzippedSize: number
  chunks: ChunkInfo[]
  largestAssets: AssetInfo[]
  duplicates: DuplicateInfo[]
  recommendations: string[]
}

interface ChunkInfo {
  name: string
  size: number
  gzippedSize: number
  modules: ModuleInfo[]
}

interface AssetInfo {
  name: string
  size: number
  gzippedSize: number
  type: 'js' | 'css' | 'font' | 'image'
}

interface DuplicateInfo {
  modules: string[]
  totalSize: number
  chunks: string[]
}

export class BundleAnalyzer {
  private readonly BUDGET_LIMITS = {
    totalSize: 250 * 1024, // 250KB
    gzippedSize: 70 * 1024, // 70KB
    maxChunkSize: 50 * 1024, // 50KB
    maxAssetSize: 20 * 1024 // 20KB
  }

  async analyzeBundle(buildDir: string): Promise<BundleAnalysisResult> {
    const manifestPath = join(buildDir, '.next/static/chunks/manifest.json')
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf-8'))

    const chunks: ChunkInfo[] = []
    const allAssets: AssetInfo[] = []
    let totalSize = 0
    let totalGzippedSize = 0

    // 分析所有chunk
    for (const [chunkName, chunkData] of Object.entries(manifest.chunks || {})) {
      const chunkInfo = await this.analyzeChunk(chunkName, chunkData, buildDir)
      chunks.push(chunkInfo)
      totalSize += chunkInfo.size
      totalGzippedSize += chunkInfo.gzippedSize
      allAssets.push(...chunkInfo.modules.map(m => ({
        name: m.name,
        size: m.size,
        gzippedSize: m.gzippedSize,
        type: this.getAssetType(m.name)
      })))
    }

    // 查找重复模块
    const duplicates = this.findDuplicates(chunks)

    // 生成优化建议
    const recommendations = this.generateRecommendations(chunks, allAssets)

    return {
      totalSize,
      gzippedSize: totalGzippedSize,
      chunks,
      largestAssets: allAssets.sort((a, b) => b.size - a.size).slice(0, 10),
      duplicates,
      recommendations
    }
  }

  private async analyzeChunk(chunkName: string, chunkData: any, buildDir: string): Promise<ChunkInfo> {
    const chunkPath = join(buildDir, '.next', chunkData.path)
    const chunkContent = readFileSync(chunkPath)
    const gzippedContent = gzipSync(chunkContent)

    return {
      name: chunkName,
      size: chunkContent.length,
      gzippedSize: gzippedContent.length,
      modules: await this.extractModules(chunkData, buildDir)
    }
  }

  private findDuplicates(chunks: ChunkInfo[]): DuplicateInfo[] {
    const moduleMap = new Map<string, Set<string>>()

    // 统计每个模块出现在哪些chunk中
    chunks.forEach(chunk => {
      chunk.modules.forEach(module => {
        if (!moduleMap.has(module.name)) {
          moduleMap.set(module.name, new Set())
        }
        moduleMap.get(module.name)!.add(chunk.name)
      })
    })

    // 找出重复的模块
    const duplicates: DuplicateInfo[] = []
    moduleMap.forEach((chunks, moduleName) => {
      if (chunks.size > 1) {
        const totalSize = Array.from(chunks).reduce((sum, chunkName) => {
          const chunk = chunks.find(c => c.name === chunkName)
          return sum + (chunk?.modules.find(m => m.name === moduleName)?.size || 0)
        }, 0)

        duplicates.push({
          modules: [moduleName],
          totalSize,
          chunks: Array.from(chunks)
        })
      }
    })

    return duplicates.sort((a, b) => b.totalSize - a.totalSize)
  }

  private generateRecommendations(chunks: ChunkInfo[], assets: AssetInfo[]): string[] {
    const recommendations: string[] = []

    // 检查总体积
    const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0)
    if (totalSize > this.BUDGET_LIMITS.totalSize) {
      recommendations.push(`总构建体积 ${this.formatBytes(totalSize)} 超出预算 ${this.formatBytes(this.BUDGET_LIMITS.totalSize)}`)
    }

    // 检查大chunk
    const largeChunks = chunks.filter(chunk => chunk.size > this.BUDGET_LIMITS.maxChunkSize)
    if (largeChunks.length > 0) {
      recommendations.push(`发现 ${largeChunks.length} 个过大的chunk，建议代码分割`)
    }

    // 检查重复代码
    const duplicates = this.findDuplicates(chunks)
    if (duplicates.length > 0) {
      const duplicateSize = duplicates.reduce((sum, dup) => sum + dup.totalSize, 0)
      recommendations.push(`发现重复代码 ${this.formatBytes(duplicateSize)}，建议提取公共模块`)
    }

    // 检查资源优化
    const unoptimizedImages = assets.filter(asset =>
      asset.type === 'image' && asset.size > this.BUDGET_LIMITS.maxAssetSize
    )
    if (unoptimizedImages.length > 0) {
      recommendations.push(`${unoptimizedImages.length} 个图片未优化，建议压缩或使用现代格式`)
    }

    return recommendations
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  private getAssetType(fileName: string): 'js' | 'css' | 'font' | 'image' {
    if (fileName.endsWith('.js')) return 'js'
    if (fileName.endsWith('.css')) return 'css'
    if (fileName.match(/\.(woff|woff2|ttf|eot)$/)) return 'font'
    if (fileName.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image'
    return 'js' // 默认
  }

  private async extractModules(chunkData: any, buildDir: string): Promise<ModuleInfo[]> {
    // 这里需要根据实际的构建输出格式来解析模块信息
    // 可能需要webpack stats文件或其他构建信息
    return []
  }
}

interface ModuleInfo {
  name: string
  size: number
  gzippedSize: number
}
```

**Lighthouse CI集成**：
```typescript
// monitoring/ci/lighthouse-ci.ts
import { launch } from 'chrome-launcher'
import lighthouse from 'lighthouse'
import { writeFileSync } from 'fs'

interface LighthouseResult {
  lhr: {
    categories: {
      performance: { score: number }
      accessibility: { score: number }
      'best-practices': { score: number }
      seo: { score: number }
      pwa: { score: number }
    }
    audits: {
      'first-contentful-paint': { numericValue: number }
      'largest-contentful-paint': { numericValue: number }
      'cumulative-layout-shift': { numericValue: number }
      'total-blocking-time': { numericValue: number }
      'speed-index': { numericValue: number }
      'interactive': { numericValue: number }
    }
  }
}

export class LighthouseCIMonitor {
  private readonly THRESHOLDS = {
    performance: 0.9,
    accessibility: 0.95,
    'best-practices': 0.9,
    seo: 0.9,
    pwa: 0.8
  }

  async runAudit(url: string, outputPath: string): Promise<LighthouseResult> {
    console.log(`🔍 Running Lighthouse audit for ${url}`)

    const chrome = await launch({ chromeFlags: ['--headless', '--no-sandbox'] })

    try {
      const options = {
        logLevel: 'info',
        output: 'json',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo', 'pwa'],
        port: chrome.port
      }

      const runnerResult = await lighthouse(url, options)
      const result = runnerResult.lhr as LighthouseResult['lhr']

      // 保存结果
      writeFileSync(outputPath, JSON.stringify(runnerResult, null, 2))

      // 检查阈值
      this.checkThresholds(result)

      return { lhr: result }
    } finally {
      await chrome.kill()
    }
  }

  private checkThresholds(result: LighthouseResult['lhr']): void {
    const failedCategories: string[] = []

    Object.entries(this.THRESHOLDS).forEach(([category, threshold]) => {
      const score = result.categories[category as keyof typeof result.categories].score
      if (score < threshold) {
        failedCategories.push(`${category} (${Math.round(score * 100)}% < ${Math.round(threshold * 100)}%)`)
      }
    })

    if (failedCategories.length > 0) {
      throw new Error(`Lighthouse audit failed for categories: ${failedCategories.join(', ')}`)
    }
  }

  generateReport(result: LighthouseResult): string {
    const { lhr } = result

    return `
# Lighthouse 性能报告

## 总体评分

| 类别 | 评分 | 状态 |
|------|------|------|
| 性能 | ${Math.round(lhr.categories.performance.score * 100)}% | ${this.getScoreEmoji(lhr.categories.performance.score)} |
| 可访问性 | ${Math.round(lhr.categories.accessibility.score * 100)}% | ${this.getScoreEmoji(lhr.categories.accessibility.score)} |
| 最佳实践 | ${Math.round(lhr.categories['best-practices'].score * 100)}% | ${this.getScoreEmoji(lhr.categories['best-practices'].score)} |
| SEO | ${Math.round(lhr.categories.seo.score * 100)}% | ${this.getScoreEmoji(lhr.categories.seo.score)} |
| PWA | ${Math.round(lhr.categories.pwa.score * 100)}% | ${this.getScoreEmoji(lhr.categories.pwa.score)} |

## 关键指标

| 指标 | 数值 | 评级 |
|------|------|------|
| 首次内容绘制 (FCP) | ${Math.round(lhr.audits['first-contentful-paint'].numericValue)}ms | ${this.getMetricGrade(lhr.audits['first-contentful-paint'].numericValue, 'fcp')} |
| 最大内容绘制 (LCP) | ${Math.round(lhr.audits['largest-contentful-paint'].numericValue)}ms | ${this.getMetricGrade(lhr.audits['largest-contentful-paint'].numericValue, 'lcp')} |
| 累积布局偏移 (CLS) | ${lhr.audits['cumulative-layout-shift'].numericValue.toFixed(3)} | ${this.getMetricGrade(lhr.audits['cumulative-layout-shift'].numericValue, 'cls')} |
| 总阻塞时间 (TBT) | ${Math.round(lhr.audits['total-blocking-time'].numericValue)}ms | ${this.getMetricGrade(lhr.audits['total-blocking-time'].numericValue, 'tbt')} |
| 速度指数 | ${Math.round(lhr.audits['speed-index'].numericValue)}ms | ${this.getMetricGrade(lhr.audits['speed-index'].numericValue, 'si')} |
| 可交互时间 | ${Math.round(lhr.audits['interactive'].numericValue)}ms | ${this.getMetricGrade(lhr.audits['interactive'].numericValue, 'tti')} |
    `.trim()
  }

  private getScoreEmoji(score: number): string {
    if (score >= 0.9) return '🟢'
    if (score >= 0.7) return '🟡'
    return '🔴'
  }

  private getMetricGrade(value: number, metric: string): string {
    const thresholds = {
      fcp: { good: 1800, needsImprovement: 3000 },
      lcp: { good: 2500, needsImprovement: 4000 },
      cls: { good: 0.1, needsImprovement: 0.25 },
      tbt: { good: 200, needsImprovement: 600 },
      si: { good: 3400, needsImprovement: 5800 },
      tti: { good: 3800, needsImprovement: 7300 }
    }

    const threshold = thresholds[metric as keyof typeof thresholds]
    if (value <= threshold.good) return '🟢 良好'
    if (value <= threshold.needsImprovement) return '🟡 需改进'
    return '🔴 较差'
  }
}
```

### 12.3 实时性能监控

**Web Vitals监控**：
```typescript
// monitoring/runtime/web-vitals-monitor.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

interface WebVitalsMetrics {
  cls: number
  fid: number
  fcp: number
  lcp: number
  ttfb: number
  timestamp: number
  url: string
  userAgent: string
}

export class WebVitalsMonitor {
  private metrics: WebVitalsMetrics[] = []
  private readonly endpoint: string
  private readonly batchSize: number = 10

  constructor(endpoint: string) {
    this.endpoint = endpoint
  }

  start(): void {
    // 监听所有Core Web Vitals
    getCLS((metric) => this.recordMetric('cls', metric.value))
    getFID((metric) => this.recordMetric('fid', metric.value))
    getFCP((metric) => this.recordMetric('fcp', metric.value))
    getLCP((metric) => this.recordMetric('lcp', metric.value))
    getTTFB((metric) => this.recordMetric('ttfb', metric.value))
  }

  private recordMetric(name: keyof Omit<WebVitalsMetrics, 'timestamp' | 'url' | 'userAgent'>, value: number): void {
    const metric: Partial<WebVitalsMetrics> = {
      [name]: value,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    // 查找是否已有相同页面的记录
    const existingMetric = this.metrics.find(m => m.url === metric.url && m.timestamp > Date.now() - 30000)

    if (existingMetric) {
      // 更新现有记录
      Object.assign(existingMetric, metric)
    } else {
      // 创建新记录
      this.metrics.push(metric as WebVitalsMetrics)
    }

    // 达到批量大小时发送
    if (this.metrics.length >= this.batchSize) {
      this.sendMetrics()
    }
  }

  private async sendMetrics(): Promise<void> {
    if (this.metrics.length === 0) return

    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          metrics: this.metrics,
          meta: {
            timestamp: Date.now(),
            source: 'web-vitals-monitor'
          }
        })
      })

      // 清空已发送的指标
      this.metrics = []
    } catch (error) {
      console.error('Failed to send web vitals metrics:', error)
    }
  }

  // 页面卸载时发送剩余指标
  bindPageUnload(): void {
    const sendBeforeUnload = () => {
      if (this.metrics.length > 0) {
        // 使用sendBeacon确保在页面卸载时发送
        navigator.sendBeacon(this.endpoint, JSON.stringify({
          metrics: this.metrics,
          meta: {
            timestamp: Date.now(),
            source: 'web-vitals-monitor',
            unload: true
          }
        }))
      }
    }

    window.addEventListener('beforeunload', sendBeforeUnload)
    window.addEventListener('pagehide', sendBeforeUnload)
  }

  getMetrics(): WebVitalsMetrics[] {
    return [...this.metrics]
  }

  clearMetrics(): void {
    this.metrics = []
  }
}

// React Hook封装
export function useWebVitalsMonitor(endpoint: string): void {
  React.useEffect(() => {
    const monitor = new WebVitalsMonitor(endpoint)
    monitor.start()
    monitor.bindPageUnload()

    return () => {
      monitor.clearMetrics()
    }
  }, [endpoint])
}
```

### 12.4 性能Dashboard

**实时性能仪表板**：
```typescript
// monitoring/dashboard/metrics-dashboard.tsx
import React, { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface MetricsData {
  timestamp: string
  lcp: number
  fid: number
  cls: number
  fcp: number
  ttfb: number
}

interface DashboardProps {
  endpoint: string
  timeRange: '1h' | '24h' | '7d' | '30d'
}

export const MetricsDashboard: React.FC<DashboardProps> = ({ endpoint, timeRange }) => {
  const [metrics, setMetrics] = useState<MetricsData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchMetrics()
    const interval = setInterval(fetchMetrics, 60000) // 每分钟更新

    return () => clearInterval(interval)
  }, [endpoint, timeRange])

  const fetchMetrics = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${endpoint}/metrics?range=${timeRange}`)
      const data = await response.json()
      setMetrics(data.metrics)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch metrics')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div>加载中...</div>
  if (error) return <div>错误: {error}</div>

  const currentMetrics = metrics[metrics.length - 1]
  const averageMetrics = calculateAverages(metrics)

  return (
    <div className="metrics-dashboard">
      <div className="dashboard-header">
        <h2>性能监控仪表板</h2>
        <div className="time-range-selector">
          <select value={timeRange} onChange={(e) => {
            // 处理时间范围切换
          }}>
            <option value="1h">最近1小时</option>
            <option value="24h">最近24小时</option>
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
          </select>
        </div>
      </div>

      {/* 核心指标卡片 */}
      <div className="metrics-cards">
        <MetricCard
          title="LCP"
          value={currentMetrics?.lcp}
          unit="ms"
          average={averageMetrics.lcp}
          threshold={{ good: 2500, needsImprovement: 4000 }}
        />
        <MetricCard
          title="FID"
          value={currentMetrics?.fid}
          unit="ms"
          average={averageMetrics.fid}
          threshold={{ good: 100, needsImprovement: 300 }}
        />
        <MetricCard
          title="CLS"
          value={currentMetrics?.cls}
          unit=""
          average={averageMetrics.cls}
          threshold={{ good: 0.1, needsImprovement: 0.25 }}
        />
        <MetricCard
          title="FCP"
          value={currentMetrics?.fcp}
          unit="ms"
          average={averageMetrics.fcp}
          threshold={{ good: 1800, needsImprovement: 3000 }}
        />
      </div>

      {/* 趋势图表 */}
      <div className="charts-section">
        <h3>性能趋势</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={metrics}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickFormatter={(value) => new Date(value).toLocaleTimeString()}
            />
            <YAxis />
            <Tooltip
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value: number, name: string) => [
                `${value}${name === 'CLS' ? '' : 'ms'}`,
                name
              ]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="lcp"
              stroke="#8884d8"
              name="LCP"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="fcp"
              stroke="#82ca9d"
              name="FCP"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="fid"
              stroke="#ffc658"
              name="FID"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 性能分布 */}
      <div className="distribution-section">
        <h3>性能分布</h3>
        <PerformanceDistribution metrics={metrics} />
      </div>
    </div>
  )
}

const MetricCard: React.FC<{
  title: string
  value?: number
  unit: string
  average: number
  threshold: { good: number; needsImprovement: number }
}> = ({ title, value, unit, average, threshold }) => {
  if (!value) return null

  const getStatus = (val: number) => {
    if (val <= threshold.good) return 'good'
    if (val <= threshold.needsImprovement) return 'warning'
    return 'poor'
  }

  const status = getStatus(value)
  const statusColor = {
    good: '#10b981',
    warning: '#f59e0b',
    poor: '#ef4444'
  }[status]

  return (
    <div className="metric-card">
      <h4>{title}</h4>
      <div className="metric-value" style={{ color: statusColor }}>
        {Math.round(value)}{unit}
      </div>
      <div className="metric-average">
        平均: {Math.round(average)}{unit}
      </div>
      <div className={`metric-status ${status}`}>
        {status === 'good' ? '良好' : status === 'warning' ? '需改进' : '较差'}
      </div>
    </div>
  )
}

const calculateAverages = (metrics: MetricsData[]) => {
  if (metrics.length === 0) return { lcp: 0, fid: 0, cls: 0, fcp: 0, ttfb: 0 }

  const sums = metrics.reduce((acc, metric) => ({
    lcp: acc.lcp + metric.lcp,
    fid: acc.fid + metric.fid,
    cls: acc.cls + metric.cls,
    fcp: acc.fcp + metric.fcp,
    ttfb: acc.ttfb + metric.ttfb
  }), { lcp: 0, fid: 0, cls: 0, fcp: 0, ttfb: 0 })

  const count = metrics.length
  return {
    lcp: sums.lcp / count,
    fid: sums.fid / count,
    cls: sums.cls / count,
    fcp: sums.fcp / count,
    ttfb: sums.ttfb / count
  }
}

const PerformanceDistribution: React.FC<{ metrics: MetricsData[] }> = ({ metrics }) => {
  const distribution = metrics.reduce((acc, metric) => {
    const lcpCategory = categorizeLCP(metric.lcp)
    acc[lcpCategory] = (acc[lcpCategory] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const data = Object.entries(distribution).map(([category, count]) => ({
    category,
    count,
    percentage: (count / metrics.length) * 100
  }))

  return (
    <div className="distribution-chart">
      {data.map(({ category, count, percentage }) => (
        <div key={category} className="distribution-item">
          <span className="category-label">{category}</span>
          <div className="percentage-bar">
            <div
              className="percentage-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="count">{count} ({percentage.toFixed(1)}%)</span>
        </div>
      ))}
    </div>
  )
}

const categorizeLCP = (lcp: number): string => {
  if (lcp <= 2500) return '优秀 (≤2.5s)'
  if (lcp <= 4000) return '需改进 (2.5s-4s)'
  return '较差 (>4s)'
}
```

### 12.5 CI集成配置

**GitHub Actions工作流**：
```yaml
# .github/workflows/performance-monitoring.yml
name: Performance Monitoring

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  schedule:
    - cron: '0 2 * * *' # 每天凌晨2点运行

jobs:
  performance-audit:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build application
        run: npm run build

      - name: Analyze bundle size
        run: npm run monitor:bundle

      - name: Start application
        run: npm run start &
        wait-on http://localhost:3000

      - name: Run Lighthouse audit
        run: npm run monitor:lighthouse

      - name: Upload performance reports
        uses: actions/upload-artifact@v3
        with:
          name: performance-reports
          path: |
            reports/lighthouse.json
            reports/bundle-analysis.json
            reports/metrics.json

      - name: Comment PR with results
        if: github.event_name == 'pull_request'
        uses: actions/github-script@v6
        with:
          script: |
            const fs = require('fs');
            const lighthouse = JSON.parse(fs.readFileSync('reports/lighthouse.json', 'utf8'));
            const bundle = JSON.parse(fs.readFileSync('reports/bundle-analysis.json', 'utf8'));

            const comment = `
            ## 📊 Performance Report

            **Lighthouse Scores:**
            - Performance: ${Math.round(lighthouse.lhr.categories.performance.score * 100)}%
            - Accessibility: ${Math.round(lighthouse.lhr.categories.accessibility.score * 100)}%

            **Bundle Analysis:**
            - Total Size: ${bundle.totalSize / 1024}KB
            - Gzipped: ${bundle.gzippedSize / 1024}KB

            ${bundle.recommendations.length > 0 ?
              '**⚠️ Recommendations:**\n' + bundle.recommendations.map(r => `- ${r}`).join('\n') :
              '✅ No optimization needed'
            }
            `;

            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: comment
            });
```

### 12.6 Package.json脚本

```json
{
  "scripts": {
    "monitor:bundle": "tsx monitoring/ci/bundle-analyzer.ts",
    "monitor:lighthouse": "tsx monitoring/ci/lighthouse-ci.ts",
    "monitor:local": "npm run build && npm run monitor:bundle && npm run monitor:lighthouse",
    "metrics:dashboard": "next dev --port 3001",
    "metrics:analyze": "tsx monitoring/reports/monthly-analysis.ts",
    "metrics:alert": "tsx monitoring/dashboard/alerting-system.ts"
  }
}
```

这个KPI与CI指标闭环系统提供了：

1. **构建时监控**：Bundle分析、性能预算检查
2. **自动化测试**：Lighthouse CI集成
3. **实时监控**：Web Vitals实时收集
4. **可视化Dashboard**：性能趋势和分布图表
5. **告警系统**：性能阈值监控和通知
6. **历史分析**：长期性能趋势分析

---

## 十三、文档内容结构重构

### 13.1 模块化文档架构

**目标**：将文档内容按功能和使用场景进行模块化组织，便于维护和多语言扩展。

```
docs/
├── architecture/                    # 架构文档（内部阅读）
│   ├── overview.md                 # 总体架构概览
│   ├── seven-axes.md              # 七轴架构详解
│   ├── website-architecture.md    # Website架构白皮书
│   ├── package-structure.md       # 包结构设计
│   └── evolution-roadmap.md       # 演进路线图
├── specification/                   # 设计规范（外部发布）
│   ├── design-principles.md        # 设计原则
│   ├── component-guidelines.md     # 组件设计指南
│   ├── token-system.md             # 令牌系统规范
│   ├── accessibility-standards.md  # 可访问性标准
│   └── internationalization.md     # 国际化规范
├── playbook/                       # 运维与开发操作手册
│   ├── getting-started.md          # 快速开始
│   ├── development-setup.md        # 开发环境搭建
│   ├── contribution-guide.md       # 贡献指南
│   ├── release-process.md          # 发布流程
│   └── troubleshooting.md           # 故障排除
├── reference/                       # API / CLI / Tokens参考
│   ├── components/                 # 组件API文档
│   │   ├── base/                   # 基础组件
│   │   ├── layout/                 # 布局组件
│   │   ├── navigation/             # 导航组件
│   │   ├── form/                   # 表单组件
│   │   ├── feedback/               # 反馈组件
│   │   └── data/                   # 数据组件
│   ├── tokens/                     # 令牌参考
│   │   ├── colors.md               # 颜色令牌
│   │   ├── typography.md           # 字体令牌
│   │   ├── spacing.md              # 间距令牌
│   │   ├── shadows.md              # 阴影令牌
│   │   └── animations.md           # 动画令牌
│   ├── cli/                        # CLI工具文档
│   │   ├── commands.md             # 命令参考
│   │   ├── configuration.md        # 配置指南
│   │   └── examples.md             # 使用示例
│   └── sdk/                        # SDK文档
│       ├── website-sdk.md          # Website SDK
│       ├── core-sdk.md             # Core SDK
│       └── examples.md             # 使用示例
├── guides/                          # 用户指南
│   ├── migration/                  # 迁移指南
│   ├── patterns/                   # 设计模式
│   ├── best-practices/            # 最佳实践
│   └── tutorials/                  # 教程
├── resources/                       # 资源中心
│   ├── assets/                     # 静态资源
│   ├── templates/                  # 模板文件
│   ├── tools/                      # 工具下载
│   └── community/                  # 社区资源
├── reports/                         # 运行与指标报告
│   ├── performance/                # 性能报告
│   ├── accessibility/              # 可访问性报告
│   ├── security/                   # 安全报告
│   └── analytics/                  # 分析报告
└── i18n/                           # 多语言支持
    ├── en-US/                      # 英文
    ├── zh-CN/                      # 简体中文
    ├── ja-JP/                      # 日文
    └── ko-KR/                      # 韩文
```

### 13.2 内容分类标准

**文档类型定义**：
```typescript
// docs/config/content-types.ts
export interface DocumentMetadata {
  id: string
  title: string
  description: string
  category: DocumentCategory
  type: DocumentType
  audience: Audience[]
  difficulty: DifficultyLevel
  estimatedReadTime: number
  lastUpdated: string
  version: string
  tags: string[]
  relatedDocs: string[]
  prerequisites: string[]
  learningObjectives: string[]
}

export enum DocumentCategory {
  ARCHITECTURE = 'architecture',
  SPECIFICATION = 'specification',
  PLAYBOOK = 'playbook',
  REFERENCE = 'reference',
  GUIDES = 'guides',
  RESOURCES = 'resources',
  REPORTS = 'reports'
}

export enum DocumentType {
  OVERVIEW = 'overview',
  TUTORIAL = 'tutorial',
  GUIDE = 'guide',
  REFERENCE = 'reference',
  EXAMPLE = 'example',
  SPECIFICATION = 'specification',
  CHECKLIST = 'checklist',
  FAQ = 'faq'
}

export enum Audience {
  DEVELOPERS = 'developers',
  DESIGNERS = 'designers',
  PM_MANAGERS = 'pm_managers',
  QA_ENGINEERS = 'qa_engineers',
  DEVOPS = 'devops',
  CONTRIBUTORS = 'contributors'
}

export enum DifficultyLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  ADVANCED = 'advanced',
  EXPERT = 'expert'
}
```

### 13.3 内容管理系统

**文档生成器**：
```typescript
// scripts/content-management/doc-generator.ts
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { DocumentMetadata, DocumentCategory } from '../config/content-types'

export class DocumentationGenerator {
  private readonly contentDir: string
  private readonly outputDir: string

  constructor(contentDir: string, outputDir: string) {
    this.contentDir = contentDir
    this.outputDir = outputDir
  }

  /**
   * 生成完整的文档站点
   */
  async generateSite(): Promise<void> {
    console.log('🚀 Generating documentation site...')

    // 1. 扫描所有文档
    const documents = await this.scanDocuments()
    console.log(`📚 Found ${documents.length} documents`)

    // 2. 生成分类索引
    await this.generateCategoryIndexes(documents)

    // 3. 生成导航结构
    await this.generateNavigation(documents)

    // 4. 生成搜索索引
    await this.generateSearchIndex(documents)

    // 5. 生成站点地图
    await this.generateSitemap(documents)

    // 6. 验证文档完整性
    await this.validateDocuments(documents)

    console.log('✅ Documentation site generated successfully')
  }

  /**
   * 扫描所有文档文件
   */
  private async scanDocuments(): Promise<DocumentMetadata[]> {
    const documents: DocumentMetadata[] = []

    // 扫描各个分类目录
    const categories = Object.values(DocumentCategory)

    for (const category of categories) {
      const categoryDir = join(this.contentDir, category)
      if (existsSync(categoryDir)) {
        const categoryDocs = await this.scanCategory(category, categoryDir)
        documents.push(...categoryDocs)
      }
    }

    return documents
  }

  /**
   * 扫描单个分类目录
   */
  private async scanCategory(category: DocumentCategory, categoryDir: string): Promise<DocumentMetadata[]> {
    const documents: DocumentMetadata[] = []
    const files = this.getAllMarkdownFiles(categoryDir)

    for (const filePath of files) {
      try {
        const metadata = await this.extractMetadata(filePath, category)
        documents.push(metadata)
      } catch (error) {
        console.warn(`⚠️ Failed to process ${filePath}:`, error)
      }
    }

    return documents
  }

  /**
   * 从Markdown文件提取元数据
   */
  private async extractMetadata(filePath: string, category: DocumentCategory): Promise<DocumentMetadata> {
    const content = readFileSync(filePath, 'utf-8')
    const frontMatter = this.extractFrontMatter(content)

    // 计算阅读时间（假设每分钟200字）
    const wordCount = content.replace(/^---[\s\S]*?---/, '').split(/\s+/).length
    const readTime = Math.ceil(wordCount / 200)

    return {
      id: this.generateDocId(filePath),
      title: frontMatter.title || this.extractTitle(content),
      description: frontMatter.description || this.extractDescription(content),
      category,
      type: frontMatter.type || 'guide',
      audience: frontMatter.audience || ['developers'],
      difficulty: frontMatter.difficulty || 'intermediate',
      estimatedReadTime: readTime,
      lastUpdated: frontMatter.lastUpdated || new Date().toISOString(),
      version: frontMatter.version || '1.0.0',
      tags: frontMatter.tags || [],
      relatedDocs: frontMatter.relatedDocs || [],
      prerequisites: frontMatter.prerequisites || [],
      learningObjectives: frontMatter.learningObjectives || []
    }
  }

  /**
   * 生成分类索引页面
   */
  private async generateCategoryIndexes(documents: DocumentMetadata[]): Promise<void> {
    const categories = [...new Set(documents.map(doc => doc.category))]

    for (const category of categories) {
      const categoryDocs = documents.filter(doc => doc.category === category)
      const indexContent = this.generateCategoryIndex(category, categoryDocs)

      const outputPath = join(this.outputDir, category, 'index.mdx')
      await this.writeFile(outputPath, indexContent)
    }
  }

  /**
   * 生成导航结构
   */
  private async generateNavigation(documents: DocumentMetadata[]): Promise<void> {
    const navigation = this.buildNavigation(documents)
    const navigationPath = join(this.outputDir, 'navigation.json')

    await this.writeFile(navigationPath, JSON.stringify(navigation, null, 2))
  }

  /**
   * 构建导航结构
   */
  private buildNavigation(documents: DocumentMetadata[]): NavigationStructure {
    const navigation: NavigationStructure = {}

    documents.forEach(doc => {
      if (!navigation[doc.category]) {
        navigation[doc.category] = {
          title: this.getCategoryTitle(doc.category),
          items: []
        }
      }

      navigation[doc.category].items.push({
        id: doc.id,
        title: doc.title,
        path: this.getDocPath(doc),
        type: doc.type,
        difficulty: doc.difficulty,
        audience: doc.audience
      })
    })

    // 排序
    Object.values(navigation).forEach(category => {
      category.items.sort((a, b) => a.title.localeCompare(b.title))
    })

    return navigation
  }

  /**
   * 生成搜索索引
   */
  private async generateSearchIndex(documents: DocumentMetadata[]): Promise<void> {
    const searchIndex = documents.map(doc => {
      const content = this.getDocContent(doc)

      return {
        id: doc.id,
        title: doc.title,
        description: doc.description,
        content: content,
        category: doc.category,
        type: doc.type,
        tags: doc.tags,
        url: this.getDocPath(doc),
        lastUpdated: doc.lastUpdated
      }
    })

    const indexPath = join(this.outputDir, 'search-index.json')
    await this.writeFile(indexPath, JSON.stringify(searchIndex, null, 2))
  }

  /**
   * 验证文档完整性
   */
  private async validateDocuments(documents: DocumentMetadata[]): Promise<void> {
    console.log('🔍 Validating documentation...')

    const issues: string[] = []

    documents.forEach(doc => {
      // 检查必要字段
      if (!doc.title) issues.push(`${doc.id}: Missing title`)
      if (!doc.description) issues.push(`${doc.id}: Missing description`)

      // 检查前置条件
      doc.prerequisites.forEach(prereq => {
        if (!documents.find(d => d.id === prereq)) {
          issues.push(`${doc.id}: Prerequisite ${prereq} not found`)
        }
      })

      // 检查相关文档
      doc.relatedDocs.forEach(related => {
        if (!documents.find(d => d.id === related)) {
          issues.push(`${doc.id}: Related doc ${related} not found`)
        }
      })
    })

    if (issues.length > 0) {
      console.warn('⚠️ Documentation validation issues:')
      issues.forEach(issue => console.warn(`  - ${issue}`))
    } else {
      console.log('✅ All documentation passed validation')
    }
  }

  // 工具方法
  private getAllMarkdownFiles(dir: string): string[] {
    const files: string[] = []

    if (!existsSync(dir)) return files

    const items = require('fs').readdirSync(dir)

    items.forEach(item => {
      const fullPath = join(dir, item)
      const stat = require('fs').statSync(fullPath)

      if (stat.isDirectory()) {
        files.push(...this.getAllMarkdownFiles(fullPath))
      } else if (item.endsWith('.md')) {
        files.push(fullPath)
      }
    })

    return files
  }

  private extractFrontMatter(content: string): Record<string, any> {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---/
    const match = content.match(frontMatterRegex)

    if (match) {
      try {
        return require('yaml').parse(match[1])
      } catch {
        return {}
      }
    }

    return {}
  }

  private extractTitle(content: string): string {
    const titleRegex = /^#\s+(.+)$/m
    const match = content.match(titleRegex)
    return match ? match[1] : 'Untitled'
  }

  private extractDescription(content: string): string {
    const withoutFrontMatter = content.replace(/^---[\s\S]*?---\n/, '')
    const firstParagraph = withoutFrontMatter.split('\n\n')[0]
    return firstParagraph.replace(/^#.*$/gm, '').trim()
  }

  private generateDocId(filePath: string): string {
    return filePath
      .replace(this.contentDir, '')
      .replace(/^\//, '')
      .replace(/\.md$/, '')
      .replace(/\//g, '-')
  }

  private getDocPath(doc: DocumentMetadata): string {
    return `/${doc.category}/${doc.id}`
  }

  private getCategoryTitle(category: DocumentCategory): string {
    const titles = {
      [DocumentCategory.ARCHITECTURE]: '架构文档',
      [DocumentCategory.SPECIFICATION]: '设计规范',
      [DocumentCategory.PLAYBOOK]: '操作手册',
      [DocumentCategory.REFERENCE]: '参考文档',
      [DocumentCategory.GUIDES]: '用户指南',
      [DocumentCategory.RESOURCES]: '资源中心',
      [DocumentCategory.REPORTS]: '报告分析'
    }
    return titles[category] || category
  }

  private async writeFile(filePath: string, content: string): Promise<void> {
    const dir = dirname(filePath)
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true })
    }
    writeFileSync(filePath, content, 'utf-8')
  }
}

interface NavigationStructure {
  [category: string]: {
    title: string
    items: NavigationItem[]
  }
}

interface NavigationItem {
  id: string
  title: string
  path: string
  type: string
  difficulty: string
  audience: string[]
}
```

### 13.4 多语言支持

**国际化配置**：
```typescript
// docs/config/i18n-config.ts
export interface I18nConfig {
  defaultLocale: string
  locales: string[]
  supportedLocales: string[]
  fallbackLocale: string
}

export const I18N_CONFIG: I18nConfig = {
  defaultLocale: 'zh-CN',
  locales: ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'],
  supportedLocales: ['zh-CN', 'en-US', 'ja-JP', 'ko-KR'],
  fallbackLocale: 'en-US'
}

export interface LocaleMessages {
  common: {
    navigation: string
    search: string
    language: string
    theme: string
    lastUpdated: string
    readingTime: string
    minutes: string
    relatedDocs: string
    prerequisites: string
    learningObjectives: string
    difficulty: string
    audience: string
  }
  categories: Record<string, string>
  types: Record<string, string>
  difficulties: Record<string, string>
  audiences: Record<string, string>
}

// 语言文件示例
export const ZH_CN_MESSAGES: LocaleMessages = {
  common: {
    navigation: '导航',
    search: '搜索',
    language: '语言',
    theme: '主题',
    lastUpdated: '最后更新',
    readingTime: '阅读时间',
    minutes: '分钟',
    relatedDocs: '相关文档',
    prerequisites: '前置条件',
    learningObjectives: '学习目标',
    difficulty: '难度',
    audience: '受众'
  },
  categories: {
    architecture: '架构文档',
    specification: '设计规范',
    playbook: '操作手册',
    reference: '参考文档',
    guides: '用户指南',
    resources: '资源中心',
    reports: '报告分析'
  },
  types: {
    overview: '概览',
    tutorial: '教程',
    guide: '指南',
    reference: '参考',
    example: '示例',
    specification: '规范',
    checklist: '检查清单',
    faq: '常见问题'
  },
  difficulties: {
    beginner: '初级',
    intermediate: '中级',
    advanced: '高级',
    expert: '专家'
  },
  audiences: {
    developers: '开发者',
    designers: '设计师',
    pm_managers: '产品经理',
    qa_engineers: '测试工程师',
    devops: '运维工程师',
    contributors: '贡献者'
  }
}
```

这套文档结构重构系统提供了：

1. **模块化组织**：按功能和用途分类文档
2. **内容管理**：自动化的文档生成和验证
3. **搜索支持**：完整的搜索索引
4. **多语言支持**：国际化框架
5. **导航结构**：自动生成的导航菜单
6. **版本控制**：文档版本管理和更新追踪

---

## 十四、CI 与构建管线

1. **Lint & Type Check**：RSC / Client 边界 eslint 规则。
2. **Build**：`next build --no-lint --no-eslint` （CI 前已通过 check）。
3. **Test**：Vitest 单测 + Playwright E2E。
4. **Deploy**：Vercel 自动 ISR / Docker 容器部署。
5. **Check**：Size Limit / Bundle Analyzer / axe 报告。

---

## 十五、验收标准

| 分类    | 指标                                   |
| ----- | ------------------------------------ |
| 架构一致性 | 仅通过 `@xorigo-ui/sdk-website` 访问数据    |
| 性能    | LCP ≤ 2.5 s (3G)； CLS ≤ 0.05         |
| 可达性   | WCAG AA 全通过                          |
| 多语言   | ≥ 2 种语言 + RTL 支持                     |
| 安全    | CSP 通过； 无 XSS 警告                     |
| 版本    | Next / React / Tailwind 匹配 core 生态版本 |

---

## 十六、风险与防护

* RSC 不当使用导致 Hydration 错位 → CI 检测 Client only 标记；
* 模板模块 路径变更 → 构建时报 import 错误；
* 多语言 懒加载 失败 → fallback 为 en-US；
* 令牌 JSON 字段漂移 → Schema 校验 + Type Guard 断断；
* SDK 版本不兼容 → 自动化测试验证接口契约。

---

## 十七、结论与更新路线图

### 17.1 核心成就

**Xorigo UI Website 作为展示层的核心目标**：

> "一切内容皆调用，一切数据皆只读，一切渲染皆高效，一切交互皆可达。"

**架构实现**：
- ✅ 基于 Next.js App Router 与 RSC 的现代 SSR 文档站
- ✅ 统一 SDK 体系，解耦数据访问层
- ✅ 严格 边界 （data 层 只读、包依赖单向）
- ✅ 完整 CI 验证链 （类型 → 性能 → 可达性 → 体积）
- ✅ 全链路监控体系（CI → Dashboard → 告警）

### 17.2 v1.1 → v2.0 实施路线图

| 版本     | 核心改进                               | 预计完成时间 | 影响范围 |
|--------|--------------------------------------|-------------|----------|
| **v1.1** | ✅ SDK层 + Docs Pipeline + Playground 增强 + KPI监控 + 文档重构 | **已完成** | 开发体验、数据一致性 |
| **v1.2** | 多站点共享SDK、主题编辑器、CLI增强功能 | 4周 | 生态扩展、用户参与 |
| **v1.3** | AI助手集成、代码生成、智能推荐 | 6周 | 智能化开发 |
| **v2.0** | 插件系统、市场生态、社区贡献平台 | 8周 | 开放生态 |

### 17.3 与竞品对比优势

| 维度 | Shadcn/ui | PrismUI | **Xorigo UI (v1.1)** |
|------|-----------|----------|-------------------|
| **数据架构** | 无中心化 | 部分本地化 | ✅ 七轴统一注册表 |
| **文档体系** | 手动维护 | MDX + CLI | ✅ 自动同步管线 |
| **DX工具** | 基础CLI | 无完整CLI | ✅ doctor + sync + check |
| **Playground** | 静态预览 | 无交互 | ✅ Live Props + Snapshot |
| **多语言** | ❌ | ❌ | ✅ 完整国际化框架 |
| **可访问性** | 部分支持 | 弱 | ✅ 机器可验证标准 |
| **性能监控** | ❌ | ❌ | ✅ Core Web Vitals + Dashboard |

### 17.4 最终建议

**立即行动项**：
1. **实施SDK层**：开始 `@xorigo-ui/sdk-website` 包的开发和迁移
2. **配置CI流水线**：启用文档同步和性能监控
3. **部署Playground增强**：启用Live Props编辑功能
4. **建立监控仪表板**：部署性能监控Dashboard

**中长期规划**：
1. **生态扩展**：支持多站点（Docs/Design/Portal）共享SDK
2. **智能化升级**：集成AI助手，实现智能代码生成
3. **开放生态**：构建插件系统和开发者市场

**技术债务清理**：
1. 完成TypeScript严格模式迁移
2. 启用类型声明生成
3. 完善测试覆盖率至90%+
4. 优化构建体积和性能指标

---

该文档可直接作为 `docs/architecture/website-v1.1.md` 收录入主架构白皮书，作为Xorigo UI Website架构的权威参考文档。

**文档版本**: v1.1.0 (Enhanced)
**完成时间**: 2024-12-19
**状态**: ✅ 生产就绪

---

## 十一、风险与防护

* RSC 不当使用导致 Hydration 错位 → CI 检测 Client only 标记；
* 模板模块 路径变更 → 构建时报 import 错误；
* 多语言 懒加载 失败 → fallback 为 en-US；
* 令牌 JSON 字段漂移 → Schema 校验 + Type Guard 断言。

---

## 十二、结论

**Website 作为 Xorigo UI 生态的展示层，其核心目标：**

> “一切内容皆调用，一切数据皆只读，一切渲染皆高效，一切交互皆可达。”

架构实现：

* 基于 Next.js App Router 与 RSC 的现代 SSR 文档站；
* 统一 Provider 体系 （Theme / A11y / Config / ZLayer）；
* 严格 边界 （data 层 只读、包依赖单向）；
* 完整 CI 验证链 （类型 → 可达 → 性能 → 体积）。

该文档可直接作为 `docs/architecture/website.md` 收录入主白皮书 v1.0 章节。
