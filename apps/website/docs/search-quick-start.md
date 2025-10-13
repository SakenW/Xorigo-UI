# 🚀 搜索系统快速开始指南

> 5 分钟快速上手搜索优化系统

---

## 📦 安装依赖

搜索系统已经集成到 Website 项目中，所有依赖已在 `package.json` 中配置：

```bash
cd apps/website
npm install
```

**核心依赖**:
- `fuse.js` - 模糊搜索引擎
- `@tanstack/react-virtual` - 虚拟化列表

---

## 🔧 构建搜索索引

在使用搜索功能前，必须先构建搜索索引：

```bash
npm run build:search-index
```

**输出文件**:
- `public/search-index/components.json` - 组件搜索索引
- `public/search-index/recipes.json` - 配方搜索索引
- `public/search-index/metadata.json` - 索引元数据

**何时需要重建索引**:
- Registry 数据更新后
- 添加/删除组件后
- 修改组件描述或标签后

---

## 🎯 基础使用

### 1. 在页面中集成搜索

创建搜索页面 `app/search/page.tsx`:

```tsx
import { SearchPage } from '@/components/search'

export default function SearchRoute() {
  return <SearchPage />
}
```

### 2. 初始化搜索引擎

在客户端组件中使用：

```tsx
'use client'

import { useEffect, useState } from 'react'
import { initializeSearch, getClientSearchEngine } from '@/lib/search/client'

export function SearchComponent() {
  const [results, setResults] = useState([])

  useEffect(() => {
    async function init() {
      // 初始化搜索引擎
      await initializeSearch()

      // 执行搜索
      const engine = getClientSearchEngine()
      const searchResults = engine.searchAll('button', 20)
      setResults(searchResults)
    }
    init()
  }, [])

  return (
    <div>
      {results.map(result => (
        <div key={result.id}>{result.title}</div>
      ))}
    </div>
  )
}
```

### 3. 使用虚拟化列表

```tsx
import { VirtualizedSearchResults } from '@/components/search'

export function SearchResultsView({ results }) {
  return (
    <VirtualizedSearchResults
      results={results}
      loading={false}
      onResultClick={(result) => console.log(result)}
    />
  )
}
```

---

## 🔍 高级功能

### 1. 高级搜索 (带筛选)

```tsx
const engine = getClientSearchEngine()

const results = engine.advancedSearch(
  'button',                    // 搜索关键词
  {
    type: 'component',         // 类型筛选
    categories: ['input'],     // 类别筛选
    tags: ['accessible']       // 标签筛选
  },
  20                           // 结果数量限制
)
```

### 2. 搜索建议

```tsx
const suggestions = engine.getSuggestions('but', 5)
// ['button', 'button-group', ...]
```

### 3. 使用高级筛选组件

```tsx
import { AdvancedFilters } from '@/components/search'

const [filters, setFilters] = useState({
  type: 'all',
  categories: [],
  tags: []
})

<AdvancedFilters
  filters={filters}
  availableCategories={['input', 'display', 'feedback']}
  availableTags={['accessible', 'responsive', 'animated']}
  onFilterChange={setFilters}
  onReset={() => setFilters({ type: 'all', categories: [], tags: [] })}
/>
```

### 4. 防抖搜索

```tsx
import { useDebounce } from '@/lib/hooks/use-debounce'

const [query, setQuery] = useState('')
const debouncedQuery = useDebounce(query, 300)

useEffect(() => {
  if (debouncedQuery) {
    // 仅在用户停止输入 300ms 后触发搜索
    performSearch(debouncedQuery)
  }
}, [debouncedQuery])
```

---

## ⚡ 性能测试

运行性能测试以验证搜索性能：

```bash
npm run test:search-performance
```

**测试内容**:
- 10 个常见查询关键词
- 每个查询 100 次迭代
- 平均/最小/最大耗时统计
- 性能目标验证 (≤ 50ms)

**示例输出**:
```
📊 性能测试结果

──────────────────────────────────────────────────────────
查询关键词      平均耗时      最小耗时      最大耗时      结果数量      状态
──────────────────────────────────────────────────────────
button          25.34ms       22.10ms       30.15ms       15            ✅ PASS
card            28.67ms       24.82ms       35.44ms       8             ✅ PASS
input           31.22ms       27.35ms       38.91ms       12            ✅ PASS
──────────────────────────────────────────────────────────

📈 总结:
   通过率: 10/10 (100.0%)
   性能目标: ≤ 50ms
```

---

## 🎨 自定义配置

### 1. 调整 Fuse.js 参数

编辑 `src/lib/search/client.ts`:

```typescript
const COMPONENT_FUSE_OPTIONS = {
  threshold: 0.3,        // 匹配阈值 (0=完全匹配, 1=任意匹配)
  minMatchCharLength: 2, // 最小匹配字符数
  keys: [
    { name: 'name', weight: 2.0 },        // 调整权重
    { name: 'description', weight: 1.0 },
    { name: 'tags', weight: 0.8 },
  ],
}
```

### 2. 调整虚拟化参数

编辑 `src/components/search/virtualized-search-results.tsx`:

```typescript
const rowVirtualizer = useVirtualizer({
  estimateSize: () => 80,  // 估算项高度
  overscan: 5,             // 预渲染额外项数
})
```

### 3. 调整防抖延迟

```typescript
const debouncedQuery = useDebounce(query, 300) // 300ms 延迟
```

---

## 🐛 故障排除

### 问题 1: 搜索索引未找到

**错误**: `加载组件索引失败`

**解决方案**:
```bash
npm run build:search-index
```

### 问题 2: 搜索性能慢 (>50ms)

**可能原因**:
- 索引数据量过大
- Fuse.js threshold 设置过低
- 未使用防抖优化

**解决方案**:
1. 优化索引数据 (移除冗余字段)
2. 调整 threshold 到 0.4-0.5
3. 使用防抖 (300ms)
4. 考虑使用 Web Worker

### 问题 3: 虚拟化列表滚动卡顿

**可能原因**:
- 项高度估算不准确
- 项内容过于复杂
- 预渲染数量不足

**解决方案**:
1. 调整 `estimateSize` 为实际高度
2. 简化项内容渲染
3. 增加 `overscan` 数量

---

## 📚 API 参考

### ClientSearchEngine

```typescript
class ClientSearchEngine {
  // 初始化搜索引擎
  async initialize(): Promise<void>

  // 搜索组件
  searchComponents(query: string, limit?: number): SearchResult[]

  // 搜索配方
  searchRecipes(query: string, limit?: number): SearchResult[]

  // 搜索所有内容
  searchAll(query: string, limit?: number): SearchResult[]

  // 高级搜索
  advancedSearch(
    query: string,
    filters: FilterOptions,
    limit?: number
  ): SearchResult[]

  // 获取搜索建议
  getSuggestions(query: string, limit?: number): string[]

  // 获取统计信息
  getStats(): {
    componentCount: number
    recipeCount: number
    totalCount: number
    initialized: boolean
  }
}
```

### VirtualizedSearchResults Props

```typescript
interface VirtualizedSearchResultsProps {
  results: SearchResult[]          // 搜索结果
  onResultClick?: (result) => void // 点击回调
  loading?: boolean                // 加载状态
  emptyMessage?: string            // 空状态消息
  className?: string               // 自定义样式
}
```

### AdvancedFilters Props

```typescript
interface AdvancedFiltersProps {
  filters: FilterOptions           // 当前筛选状态
  availableCategories: string[]    // 可用类别
  availableTags: string[]          // 可用标签
  onFilterChange: (filters) => void // 筛选变更回调
  onReset: () => void              // 重置回调
}
```

---

## 🔗 相关文档

- [完整实施报告](./search-optimization-report.md)
- [Website 架构设计](../待整理/Website重构架构设计方案.md)
- [Fuse.js 文档](https://fusejs.io/)
- [@tanstack/react-virtual 文档](https://tanstack.com/virtual/latest)

---

## ✅ 检查清单

使用前确认：

- [ ] 已安装所有依赖 (`npm install`)
- [ ] 已构建搜索索引 (`npm run build:search-index`)
- [ ] 索引文件存在于 `public/search-index/`
- [ ] 已运行性能测试 (`npm run test:search-performance`)
- [ ] 性能测试通过 (≤ 50ms)

---

**需要帮助?** 查看完整的[搜索优化报告](./search-optimization-report.md)或提交 Issue。
