# 组件注册系统集成指南

## 目录

1. [快速开始](#快速开始)
2. [在React应用中使用](#在react应用中使用)
3. [CLI工具使用](#cli工具使用)
4. [API集成](#api集成)
5. [CI/CD集成](#cicd集成)
6. [自定义扩展](#自定义扩展)
7. [最佳实践](#最佳实践)
8. [故障排除](#故障排除)

## 快速开始

### 安装依赖

```bash
# 安装到项目
pnpm add @xorigo-ui/core

# 开发依赖（可选）
pnpm add -D @xorigo-ui/cli
```

### 基本使用

```tsx
import { ComponentRegistryProvider, ComponentBrowser } from '@xorigo-ui/website'

export default function ComponentExplorer() {
  return (
    <ComponentRegistryProvider>
      <ComponentBrowser />
    </ComponentRegistryProvider>
  )
}
```

## 在React应用中使用

### 1. 基础配置

```tsx
import { useComponentRegistry } from '@xorigo-ui/website'

function MyComponent() {
  const registry = useComponentRegistry()
  
  // 获取组件
  const button = registry.getComponent('button')
  
  // 搜索组件
  const buttons = registry.searchComponents('button')
  
  return <div>已加载 {registry.totalCount} 个组件</div>
}
```

### 2. 高级配置

```tsx
import { ComponentRegistryProvider } from '@xorigo-ui/website'

function App() {
  return (
    <ComponentRegistryProvider
      config={{
        rootPaths: [
          '/path/to/components',
          '/path/to/other-components'
        ],
        autoScan: true,
        performance: {
          enableCache: true,
          cacheConfig: {
            maxSize: 100 * 1024 * 1024, // 100MB
            maxAge: 300000, // 5分钟
            storageType: 'memory'
          },
          enableLazyLoading: true,
          enablePreloading: true
        }
      }}
      onScanComplete={(result) => {
        console.log(`扫描完成: ${result.stats.validComponents} 个组件`)
      }}
      onError={(error) => {
        console.error('扫描失败:', error)
      }}
    >
      <ComponentBrowser />
    </ComponentRegistryProvider>
  )
}
```

### 3. 使用搜索功能

```tsx
import { useComponentRegistry, SearchFilters } from '@xorigo-ui/website'

function SearchInterface() {
  const registry = useComponentRegistry()
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({})
  
  const results = registry.searchComponents(query, filters)
  
  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索组件..."
      />
      <div>
        {results.map(component => (
          <div key={component.id}>
            {component.displayName}
          </div>
        ))}
      </div>
    </div>
  )
}
```

### 4. 获取相似组件

```tsx
function SimilarComponents({ componentId }) {
  const registry = useComponentRegistry()
  
  const similar = registry.getSimilarComponents(componentId, 5)
  
  return (
    <div>
      <h3>相似组件</h3>
      {similar.map(comp => (
        <div key={comp.id}>
          {comp.displayName}
        </div>
      ))}
    </div>
  )
}
```

## CLI工具使用

### 安装CLI

```bash
# 全局安装
npm install -g @xorigo-ui/cli

# 或本地安装
pnpm add -D @xorigo-ui/cli
```

### 扫描组件

```bash
# 基本扫描
xorigo-component-registry scan \
  --path ./src/components \
  --output component-registry.json

# 高级选项
xorigo-component-registry scan \
  --path ./src/components \
  --output component-registry.json \
  --format yaml \
  --include-test \
  --parallel \
  --exclude "node_modules,dist,*.test.ts"
```

### 缓存管理

```bash
# 设置缓存
xorigo-component-registry cache \
  --action set \
  --file component-registry.json

# 获取组件
xorigo-component-registry cache \
  --action get \
  --id button

# 预热缓存
xorigo-component-registry cache \
  --action warmup \
  --file component-registry.json

# 清空缓存
xorigo-component-registry cache \
  --action clear
```

### 验证组件

```bash
# 基本验证
xorigo-component-registry validate \
  --file component-registry.json

# 严格模式
xorigo-component-registry validate \
  --file component-registry.json \
  --strict
```

### 生成报告

```bash
# 生成Markdown报告
xorigo-component-registry report \
  --file component-registry.json \
  --output component-report.md
```

### 导入导出

```bash
# 导出JSON
xorigo-component-registry export \
  --file component-registry.json \
  --to json \
  --output output.json

# 导出YAML
xorigo-component-registry export \
  --file component-registry.json \
  --to yaml \
  --output output.yaml

# 导出CSV
xorigo-component-registry export \
  --file component-registry.json \
  --to csv \
  --output output.csv
```

## API集成

### REST API

```javascript
// 获取组件列表
const response = await fetch('/api/components?category=primitives')
const { data } = await response.json()

// 搜索组件
const response = await fetch('/api/components', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    query: 'button',
    filters: {
      category: 'primitives',
      tags: ['基础']
    }
  })
})
const { data } = await response.json()
```

### GraphQL (规划中)

```graphql
query GetComponents($category: String) {
  components(category: $category) {
    id
    name
    description
    props {
      name
      type
      required
    }
  }
}
```

## CI/CD集成

### GitHub Actions

```yaml
name: 组件注册系统

on: [push, pull_request]

jobs:
  scan-components:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm cli scan --path src/components
      - run: pnpm cli validate --file component-registry.json
```

### Git Hooks

```bash
# .husky/pre-commit
#!/bin/sh
pnpm cli scan --path src/components --output component-registry.json
pnpm cli validate --file component-registry.json
```

### Jenkins Pipeline

```groovy
pipeline {
  agent any
  stages {
    stage('Scan Components') {
      steps {
        sh 'pnpm cli scan --path src/components'
      }
    }
    stage('Validate') {
      steps {
        sh 'pnpm cli validate --file component-registry.json'
      }
    }
  }
}
```

## 自定义扩展

### 自定义扫描器

```typescript
import { ComponentScanner } from '@xorigo-ui/website'

class CustomScanner extends ComponentScanner {
  async extractMetadata(filePath: string) {
    // 自定义逻辑
    const content = await fs.readFile(filePath, 'utf-8')
    
    // 提取自定义元数据
    const customData = this.parseCustomComments(content)
    
    return customData
  }
}
```

### 自定义过滤器

```typescript
import { SearchFilters } from '@xorigo-ui/website'

function customFilter(component: ComponentMetadata, filters: CustomFilters): boolean {
  // 自定义过滤逻辑
  return true
}
```

### 自定义缓存策略

```typescript
import { ComponentCache } from '@xorigo-ui/website'

class CustomCache extends ComponentCache {
  async getComponent(id: string) {
    // 自定义缓存逻辑
    return super.getComponent(id)
  }
}
```

## 最佳实践

### 1. 性能优化

```tsx
// 启用缓存
<ComponentRegistryProvider
  config={{
    performance: {
      enableCache: true,
      cacheConfig: {
        maxSize: 100 * 1024 * 1024,
        maxAge: 300000
      }
    }
  }}
>
  <App />
</ComponentRegistryProvider>

// 预加载常用组件
const registry = useComponentRegistry()
useEffect(() => {
  registry.preloadComponents(['button', 'input', 'card'])
}, [])
```

### 2. 错误处理

```tsx
<ComponentRegistryProvider
  onError={(error) => {
    // 发送错误报告
    console.error('组件扫描失败:', error)
    
    // 用户提示
    toast.error('组件加载失败，请刷新页面')
  }}
>
  <App />
</ComponentRegistryProvider>
```

### 3. 监控指标

```tsx
function MetricsPanel() {
  const registry = useComponentRegistry()
  const metrics = registry.getMetrics()
  
  return (
    <div>
      <p>扫描时间: {metrics.totalScanTime}ms</p>
      <p>缓存命中率: {metrics.cacheHitRate}%</p>
      <p>内存使用: {(metrics.memoryUsage / 1024 / 1024).toFixed(2)}MB</p>
    </div>
  )
}
```

### 4. 懒加载

```tsx
// 按需加载组件列表
const LazyComponentList = lazy(() => import('./ComponentList'))

function App() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <LazyComponentList />
    </Suspense>
  )
}
```

### 5. 搜索优化

```tsx
// 防抖搜索
const debouncedSearch = useMemo(
  () => debounce((query) => {
    const results = registry.searchComponents(query)
    setResults(results)
  }, 300),
  [registry]
)

// 分页搜索
const [page, setPage] = useState(1)
const [pageSize] = useState(20)

const results = useMemo(() => {
  const allResults = registry.searchComponents(query)
  return allResults.slice((page - 1) * pageSize, page * pageSize)
}, [registry, query, page, pageSize])
```

## 故障排除

### 常见问题

**Q: 扫描速度慢**

```bash
# 解决方案
# 1. 启用并行扫描
--parallel

# 2. 排除不需要的目录
--exclude "node_modules,dist,*.test.ts"

# 3. 限制扫描深度
--max-depth 5
```

**Q: 缓存命中率低**

```tsx
// 解决方案
// 1. 增加缓存大小
config={{
  performance: {
    cacheConfig: {
      maxSize: 200 * 1024 * 1024, // 200MB
      maxAge: 600000 // 10分钟
    }
  }
}}

// 2. 启用预热
await cache.warmup(data)
```

**Q: 内存占用过高**

```tsx
// 解决方案
// 1. 启用压缩
config={{
  performance: {
    cacheConfig: {
      compression: true
    }
  }
}}

// 2. 清理过期缓存
await cache.clear()
```

**Q: TypeScript类型错误**

```tsx
// 解决方案
// 1. 检查类型定义
import { ComponentMetadata } from '@xorigo-ui/website'

// 2. 添加类型断言
const component = registry.getComponent('button') as ComponentMetadata

// 3. 类型守卫
if (!component) return null
```

**Q: 组件未找到**

```tsx
// 解决方案
// 1. 检查组件ID
const registry = useComponentRegistry()
console.log(Array.from(registry.components.keys()))

// 2. 确认扫描路径
config={{
  rootPaths: [
    '/correct/path/to/components'
  ]
}}

// 3. 检查文件格式
// 确保文件扩展名为 .tsx 或 .ts
```

### 调试模式

```tsx
// 启用调试日志
import { ComponentScanner } from '@xorigo-ui/website'

const scanner = new ComponentScanner({
  rootPath: './src/components',
  debug: true  // 启用详细日志
})
```

### 性能分析

```tsx
// 性能监控
function PerformanceMonitor() {
  const registry = useComponentRegistry()
  
  useEffect(() => {
    const interval = setInterval(() => {
      const metrics = registry.getMetrics()
      console.table({
        'Total Scan Time': `${metrics.totalScanTime}ms`,
        'Cache Hit Rate': `${metrics.cacheHitRate}%`,
        'Memory Usage': `${metrics.memoryUsage / 1024 / 1024}MB`
      })
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])
  
  return null
}
```

## 更多资源

- [API文档](./api-reference.md)
- [性能基准](./performance-benchmark-report.md)
- [架构设计](./architecture.md)
- [常见问题FAQ](./faq.md)

---

**文档版本**: 1.0.0  
**最后更新**: 2025-11-05
