# 搜索 API 文档

## 概述

TH-UI 搜索 API 提供统一的组件和配方搜索功能,基于 Fuse.js 实现模糊搜索,支持高亮匹配和分页。

**端点**: `GET /api/search`

**技术栈**:
- **Next.js 15** Route Handlers
- **Fuse.js 7.1** 模糊搜索引擎
- **Zod 4.1** 参数验证
- **Edge Runtime** 高性能执行

---

## 请求参数

### 查询参数 (Query Parameters)

| 参数 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| `q` | string | ✅ | - | 搜索关键词 (1-100字符) |
| `type` | enum | ❌ | `all` | 搜索类型: `component`, `recipe`, `all` |
| `page` | number | ❌ | `1` | 页码 (≥1) |
| `pageSize` | number | ❌ | `20` | 每页数量 (1-50) |

### 参数验证规则

```typescript
const SearchQuerySchema = z.object({
  q: z.string()
    .min(1, { message: '搜索关键词不能为空' })
    .max(100, { message: '搜索关键词不能超过100个字符' })
    .trim(),

  type: z.enum(['component', 'recipe', 'all'])
    .default('all'),

  page: z.coerce.number()
    .min(1, { message: '页码必须大于0' })
    .default(1),

  pageSize: z.coerce.number()
    .min(1, { message: '每页数量必须大于0' })
    .max(50, { message: '每页数量不能超过50' })
    .default(20),
})
```

---

## 响应格式

### 成功响应 (200 OK)

```json
{
  "status": "success",
  "data": {
    "results": [
      {
        "id": "button",
        "type": "component",
        "title": "Button",
        "description": "按钮组件，支持多种变体和尺寸",
        "url": "/components/button",
        "score": 0.001,
        "matches": [
          {
            "key": "name",
            "value": "Button",
            "indices": [[0, 6]]
          }
        ],
        "metadata": {
          "category": "ui",
          "tags": ["primary", "secondary"]
        }
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "pageSize": 20,
      "hasMore": false,
      "totalPages": 1
    }
  },
  "meta": {
    "timestamp": "2025-10-12T04:00:00.000Z",
    "query": "button",
    "type": "all",
    "duration": 25
  }
}
```

### 错误响应 (400/500)

```json
{
  "status": "error",
  "error": {
    "message": "查询参数验证失败",
    "code": "VALIDATION_ERROR",
    "details": [
      {
        "code": "too_small",
        "minimum": 1,
        "type": "string",
        "inclusive": true,
        "message": "搜索关键词不能为空",
        "path": ["q"]
      }
    ]
  },
  "meta": {
    "timestamp": "2025-10-12T04:00:00.000Z",
    "query": "",
    "type": "all",
    "duration": 5
  }
}
```

---

## 响应字段说明

### SearchResult 对象

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 唯一标识符 |
| `type` | `component` \| `recipe` | 结果类型 |
| `title` | string | 标题/名称 |
| `description` | string | 描述 |
| `url` | string | 详情页 URL |
| `score` | number | 匹配分数 (0-1, 越小越匹配) |
| `matches` | MatchInfo[] | 匹配位置（用于高亮） |
| `metadata` | object | 扩展元数据 |

### MatchInfo 对象

| 字段 | 类型 | 说明 |
|------|------|------|
| `key` | string | 匹配的字段名 (`name`, `description`, `tags` 等) |
| `value` | string | 匹配的文本内容 |
| `indices` | [number, number][] | 匹配的字符位置区间 |

**示例**:
```json
{
  "key": "name",
  "value": "Button Component",
  "indices": [[0, 6]]  // "Button" 在 "Button Component" 中的位置
}
```

### PaginationInfo 对象

| 字段 | 类型 | 说明 |
|------|------|------|
| `total` | number | 总结果数 |
| `page` | number | 当前页码 |
| `pageSize` | number | 每页数量 |
| `hasMore` | boolean | 是否有下一页 |
| `totalPages` | number | 总页数 |

---

## 请求示例

### 1. 基础搜索

**搜索包含 "button" 的所有内容**

```bash
curl "http://localhost:3100/api/search?q=button"
```

### 2. 组件搜索

**仅搜索组件**

```bash
curl "http://localhost:3100/api/search?q=card&type=component"
```

### 3. 配方搜索

**仅搜索配方**

```bash
curl "http://localhost:3100/api/search?q=dark&type=recipe"
```

### 4. 分页搜索

**第2页,每页10条**

```bash
curl "http://localhost:3100/api/search?q=button&page=2&pageSize=10"
```

### 5. 中文搜索

**搜索中文关键词**

```bash
# URL 编码
curl "http://localhost:3100/api/search?q=%E6%8C%89%E9%92%AE"

# 或使用 --data-urlencode
curl -G "http://localhost:3100/api/search" --data-urlencode "q=按钮"
```

### 6. 复杂查询

**搜索 "theme",仅配方,第1页,每页5条**

```bash
curl "http://localhost:3100/api/search?q=theme&type=recipe&page=1&pageSize=5"
```

---

## JavaScript/TypeScript 客户端示例

### Fetch API

```typescript
async function searchTHUI(
  query: string,
  options?: {
    type?: 'component' | 'recipe' | 'all'
    page?: number
    pageSize?: number
  }
) {
  const params = new URLSearchParams({
    q: query,
    type: options?.type || 'all',
    page: String(options?.page || 1),
    pageSize: String(options?.pageSize || 20),
  })

  const response = await fetch(`/api/search?${params}`)
  const data = await response.json()

  if (data.status === 'error') {
    throw new Error(data.error.message)
  }

  return data.data
}

// 使用示例
const results = await searchTHUI('button', {
  type: 'component',
  page: 1,
  pageSize: 10,
})

console.log(`找到 ${results.pagination.total} 个结果`)
results.results.forEach(result => {
  console.log(`- ${result.title}: ${result.description}`)
})
```

### React Hook

```typescript
import { useState, useEffect } from 'react'

function useSearch(query: string, type: 'component' | 'recipe' | 'all' = 'all') {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!query) {
      setResults([])
      return
    }

    const search = async () => {
      setLoading(true)
      setError(null)

      try {
        const params = new URLSearchParams({ q: query, type })
        const response = await fetch(`/api/search?${params}`)
        const data = await response.json()

        if (data.status === 'error') {
          throw new Error(data.error.message)
        }

        setResults(data.data.results)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    const debounce = setTimeout(search, 300)
    return () => clearTimeout(debounce)
  }, [query, type])

  return { results, loading, error }
}

// 使用示例
function SearchComponent() {
  const [query, setQuery] = useState('')
  const { results, loading, error } = useSearch(query)

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="搜索组件或配方..."
      />

      {loading && <p>搜索中...</p>}
      {error && <p>错误: {error}</p>}

      <ul>
        {results.map(result => (
          <li key={result.id}>
            <a href={result.url}>{result.title}</a>
            <p>{result.description}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

---

## Fuse.js 配置

### 组件搜索配置

```typescript
{
  threshold: 0.3,           // 匹配阈值 (0=完全匹配, 1=任意匹配)
  includeScore: true,       // 返回匹配分数
  includeMatches: true,     // 返回匹配位置
  minMatchCharLength: 2,    // 最小匹配字符数
  keys: [
    { name: 'name', weight: 2 },           // 名称权重最高
    { name: 'description', weight: 1 },    // 描述次之
    { name: 'category', weight: 0.5 },     // 类别
    { name: 'tags', weight: 0.5 },         // 标签
  ],
}
```

### 配方搜索配置

```typescript
{
  threshold: 0.3,
  includeScore: true,
  includeMatches: true,
  minMatchCharLength: 2,
  keys: [
    { name: 'name', weight: 2 },
    { name: 'description', weight: 1 },
    { name: 'tags', weight: 0.8 },
    { name: 'category', weight: 0.5 },
    { name: 'mode', weight: 0.3 },         // light/dark
    { name: 'base', weight: 0.2 },         // 基础色调
    { name: 'accent', weight: 0.2 },       // 强调色
  ],
}
```

---

## 错误码

| 错误码 | HTTP 状态码 | 说明 |
|--------|-------------|------|
| `VALIDATION_ERROR` | 400 | 查询参数验证失败 |
| `INTERNAL_ERROR` | 500 | 搜索服务内部错误 |

---

## 性能优化

### 缓存策略

- **Edge Runtime**: 使用 Vercel Edge Functions 降低延迟
- **HTTP 缓存**: `Cache-Control: public, s-maxage=60, stale-while-revalidate=120`
- **数据预加载**: 首次请求后缓存组件和配方数据

### 响应时间

- **平均响应时间**: 20-50ms (Edge Runtime)
- **首次冷启动**: 200-500ms (需加载数据)

---

## 限制

- **查询长度**: 1-100 字符
- **每页数量**: 1-50 条
- **总结果数**: 无限制
- **Rate Limit**: 暂无 (未来可能添加)

---

## 测试

运行测试脚本:

```bash
cd apps/website
./test-search-api.sh
```

---

## 版本历史

### v1.0.0 (2025-10-12)

- ✅ 初始版本发布
- ✅ 支持组件和配方搜索
- ✅ Fuse.js 模糊搜索
- ✅ Zod 参数验证
- ✅ 分页功能
- ✅ 高亮匹配
- ✅ Edge Runtime

---

## 相关文档

- [Fuse.js 官方文档](https://www.fusejs.io/)
- [Zod 官方文档](https://zod.dev/)
- [Next.js Route Handlers](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)

---

**维护者**: TH-UI Team
**最后更新**: 2025-10-12
