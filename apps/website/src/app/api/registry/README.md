# Registry API 文档

Xorigo UI 组件注册表 API，提供组件查询、搜索和详情获取功能。

## 📚 技术栈

- **Next.js 15**: Route Handlers + Dynamic Routes
- **Zod**: 查询参数和路径参数验证
- **Fuse.js**: 模糊搜索 (threshold: 0.3)
- **@xorigo-ui/registry**: 组件注册表包

---

## 🎯 API 端点

### 1. 查询组件列表

**端点**: `GET /api/registry`

**功能**:
- 查询所有组件
- 按分类过滤
- 模糊搜索
- 精确过滤

**查询参数**:

| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `category` | `'ui' \| 'feedback' \| 'navigation' \| 'advanced' \| 'radix'` | ❌ | 组件分类 | `ui` |
| `search` | `string` | ❌ | 模糊搜索关键词 | `button` |
| `filter` | `string` | ❌ | 逗号分隔的组件名称 | `Button,Card,Input` |

**响应格式**:

```typescript
{
  status: 'success' | 'error',
  data?: {
    components: Component[],
    total: number,
    query: {
      category?: string,
      search?: string,
      filter?: string[]
    }
  },
  error?: {
    message: string,
    code?: string,
    details?: any
  },
  meta: {
    timestamp: string,
    version: string
  }
}
```

**示例请求**:

```bash
# 1. 获取所有组件
curl http://localhost:3100/api/registry

# 2. 按分类过滤
curl http://localhost:3100/api/registry?category=ui

# 3. 模糊搜索
curl http://localhost:3100/api/registry?search=button

# 4. 精确过滤
curl http://localhost:3100/api/registry?filter=Button,Card,Input

# 5. 组合查询
curl "http://localhost:3100/api/registry?category=ui&search=input"
```

**示例响应**:

```json
{
  "status": "success",
  "data": {
    "components": [
      {
        "name": "Button",
        "description": "可定制的按钮组件",
        "category": "ui",
        "framework": "react",
        "style": "tailwind",
        "files": ["Button.tsx"],
        "props": [
          {
            "name": "variant",
            "type": "string",
            "description": "按钮变体",
            "required": false,
            "options": ["primary", "secondary", "outline-solid"]
          }
        ],
        "variants": [],
        "accessibility": {
          "aria-label": true,
          "keyboard-navigation": true,
          "screen-reader": true,
          "color-contrast": true
        }
      }
    ],
    "total": 1,
    "query": {
      "search": "button"
    }
  },
  "meta": {
    "timestamp": "2025-10-12T04:00:00.000Z",
    "version": "0.1.0"
  }
}
```

---

### 2. 获取组件详情

**端点**: `GET /api/registry/[component]`

**功能**:
- 根据组件名称获取详情
- 返回完整的组件元数据
- 包含注册表令牌和主题信息

**路径参数**:

| 参数 | 类型 | 必填 | 说明 | 示例 |
|------|------|------|------|------|
| `component` | `string` | ✅ | 组件名称 | `Button` |

**响应格式**:

```typescript
{
  status: 'success' | 'error',
  data?: {
    component: Component,
    registry: {
      version: string,
      tokens: {
        colors: Record<string, string>,
        spacing: Record<string, string>,
        typography: Record<string, string>,
        borderRadius: Record<string, string>
      },
      themes: Array<{
        name: string,
        colors: Record<string, string>
      }>
    }
  },
  error?: {
    message: string,
    code?: string,
    details?: any
  },
  meta: {
    timestamp: string,
    version: string
  }
}
```

**示例请求**:

```bash
# 1. 获取 Button 组件详情
curl http://localhost:3100/api/registry/Button

# 2. 获取 Card 组件详情
curl http://localhost:3100/api/registry/Card

# 3. 不存在的组件 (404)
curl http://localhost:3100/api/registry/NonExistent
```

**成功响应示例**:

```json
{
  "status": "success",
  "data": {
    "component": {
      "name": "Button",
      "description": "可定制的按钮组件",
      "category": "ui",
      "framework": "react",
      "style": "tailwind",
      "files": ["Button.tsx"],
      "props": [...],
      "variants": [...],
      "accessibility": {...}
    },
    "registry": {
      "version": "0.1.0",
      "tokens": {
        "colors": {
          "primary": "#3b82f6",
          "secondary": "#f5f5f5",
          "accent": "#f5f5f5"
        },
        "spacing": {...},
        "typography": {...},
        "borderRadius": {...}
      },
      "themes": [
        {
          "name": "light",
          "colors": {...}
        },
        {
          "name": "dark",
          "colors": {...}
        }
      ]
    }
  },
  "meta": {
    "timestamp": "2025-10-12T04:00:00.000Z",
    "version": "0.1.0"
  }
}
```

**错误响应示例 (404)**:

```json
{
  "status": "error",
  "error": {
    "message": "组件 'NonExistent' 未找到",
    "code": "NOT_FOUND",
    "details": {
      "availableComponents": ["Button", "Card", "Input", "Modal", ...]
    }
  },
  "meta": {
    "timestamp": "2025-10-12T04:00:00.000Z",
    "version": "0.1.0"
  }
}
```

---

## 🧪 测试用例

### 基础测试

```bash
# 测试脚本存放位置
cd /home/saken/project/Xorigo UI/apps/website

# 1. 测试基础连接
curl -i http://localhost:3100/api/registry

# 2. 测试 CORS
curl -i -X OPTIONS http://localhost:3100/api/registry

# 3. 测试无效分类 (应该返回 400)
curl -i "http://localhost:3100/api/registry?category=invalid"
```

### 功能测试

```bash
# 1. 分类过滤测试
echo "=== 测试分类过滤 ==="
curl -s "http://localhost:3100/api/registry?category=ui" | jq '.data.components[].name'

# 2. 搜索功能测试
echo "=== 测试模糊搜索 ==="
curl -s "http://localhost:3100/api/registry?search=but" | jq '.data.total'

# 3. 精确过滤测试
echo "=== 测试精确过滤 ==="
curl -s "http://localhost:3100/api/registry?filter=Button,Card" | jq '.data.components[].name'

# 4. 组合查询测试
echo "=== 测试组合查询 ==="
curl -s "http://localhost:3100/api/registry?category=ui&search=card" | jq '.data'
```

### 组件详情测试

```bash
# 1. 有效组件测试
echo "=== 测试获取 Button 详情 ==="
curl -s http://localhost:3100/api/registry/Button | jq '.data.component.name'

# 2. 无效组件测试 (404)
echo "=== 测试 404 错误 ==="
curl -i http://localhost:3100/api/registry/NonExistent

# 3. 空名称测试
echo "=== 测试空组件名 ==="
curl -i http://localhost:3100/api/registry/
```

### 性能测试

```bash
# 1. 并发请求测试
echo "=== 测试并发 10 个请求 ==="
for i in {1..10}; do
  curl -s http://localhost:3100/api/registry &
done
wait

# 2. 响应时间测试
echo "=== 测试响应时间 ==="
time curl -s http://localhost:3100/api/registry > /dev/null
```

### Zod 验证测试

```bash
# 1. 无效查询参数
curl -i "http://localhost:3100/api/registry?category=invalid_category"

# 2. 空搜索字符串
curl -i "http://localhost:3100/api/registry?search="

# 3. 特殊字符测试
curl -i "http://localhost:3100/api/registry?search=%3Cscript%3E"
```

---

## 📊 Fuse.js 搜索配置

### 搜索参数说明

```typescript
{
  threshold: 0.3,        // 匹配阈值 (0.0 精确, 1.0 宽松)
  keys: [
    { name: 'name', weight: 2 },          // 组件名称 (权重最高)
    { name: 'description', weight: 1 },   // 描述 (中等权重)
    { name: 'category', weight: 0.5 }     // 分类 (低权重)
  ],
  includeScore: true,    // 返回相关度分数
  includeMatches: true,  // 返回匹配详情
  minMatchCharLength: 2  // 最小匹配长度
}
```

### 搜索示例

```bash
# 1. 精确匹配 (相关度最高)
curl "http://localhost:3100/api/registry?search=Button"

# 2. 部分匹配
curl "http://localhost:3100/api/registry?search=but"

# 3. 模糊匹配
curl "http://localhost:3100/api/registry?search=buton"  # 拼写错误

# 4. 描述搜索
curl "http://localhost:3100/api/registry?search=customizable"
```

---

## 🔧 TypeScript 客户端示例

### React Hook 示例

```typescript
// hooks/useRegistry.ts
import { useQuery } from '@tanstack/react-query'
import type { Component } from '@xorigo-ui/registry'
import type { ApiResponse } from '@/app/api/registry/types'

interface RegistryQueryParams {
  category?: 'ui' | 'feedback' | 'navigation' | 'advanced' | 'radix'
  search?: string
  filter?: string
}

export function useRegistry(params?: RegistryQueryParams) {
  return useQuery({
    queryKey: ['registry', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams()

      if (params?.category) searchParams.set('category', params.category)
      if (params?.search) searchParams.set('search', params.search)
      if (params?.filter) searchParams.set('filter', params.filter)

      const response = await fetch(`/api/registry?${searchParams}`)
      const data: ApiResponse = await response.json()

      if (data.status === 'error') {
        throw new Error(data.error?.message || 'API Error')
      }

      return data.data
    },
  })
}

export function useComponent(componentName: string) {
  return useQuery({
    queryKey: ['component', componentName],
    queryFn: async () => {
      const response = await fetch(`/api/registry/${componentName}`)
      const data: ApiResponse = await response.json()

      if (data.status === 'error') {
        throw new Error(data.error?.message || 'Component not found')
      }

      return data.data
    },
    enabled: !!componentName,
  })
}
```

### 使用示例

```typescript
// components/ComponentBrowser.tsx
'use client'

import { useState } from 'react'
import { useRegistry, useComponent } from '@/hooks/useRegistry'

export function ComponentBrowser() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<string>()
  const [selectedComponent, setSelectedComponent] = useState<string>()

  // 查询组件列表
  const { data: registry, isLoading } = useRegistry({ search, category })

  // 查询组件详情
  const { data: component } = useComponent(selectedComponent || '')

  if (isLoading) return <div>Loading...</div>

  return (
    <div>
      {/* 搜索和过滤 */}
      <input
        type="text"
        placeholder="搜索组件..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select onChange={(e) => setCategory(e.target.value || undefined)}>
        <option value="">所有分类</option>
        <option value="ui">UI</option>
        <option value="feedback">Feedback</option>
        <option value="navigation">Navigation</option>
        <option value="advanced">Advanced</option>
        <option value="radix">Radix</option>
      </select>

      {/* 组件列表 */}
      <div>
        {registry?.components.map((comp) => (
          <div
            key={comp.name}
            onClick={() => setSelectedComponent(comp.name)}
          >
            <h3>{comp.name}</h3>
            <p>{comp.description}</p>
          </div>
        ))}
      </div>

      {/* 组件详情 */}
      {component && (
        <div>
          <h2>{component.component.name}</h2>
          <p>{component.component.description}</p>
          <pre>{JSON.stringify(component.component, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
```

---

## 🚀 部署和使用

### 开发环境

```bash
# 启动开发服务器
cd /home/saken/project/Xorigo UI/apps/website
npm run dev

# 访问 API
# http://localhost:3100/api/registry
# http://localhost:3100/api/registry/Button
```

### Docker 环境

```bash
# 启动 Docker 开发环境
npm run docker:dev

# API 端点
# http://localhost:3100/api/registry
```

### 生产环境

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 或使用 Docker
npm run deploy
```

---

## 📝 错误码说明

| 错误码 | HTTP 状态码 | 说明 |
|--------|-------------|------|
| `VALIDATION_ERROR` | 400 | 查询参数或路径参数验证失败 |
| `NOT_FOUND` | 404 | 组件未找到 |
| `INTERNAL_ERROR` | 500 | 内部服务器错误 |

---

## 🔍 故障排查

### 常见问题

1. **404 错误**
   - 检查组件名称是否正确
   - 查看错误响应中的 `availableComponents` 列表

2. **400 验证错误**
   - 检查查询参数类型是否正确
   - 确保 `category` 值在允许的枚举中

3. **500 内部错误**
   - 查看服务器日志
   - 检查 `@xorigo-ui/registry` 包是否正确安装

### 调试命令

```bash
# 查看详细错误信息
curl -i http://localhost:3100/api/registry/Button

# 检查响应头
curl -I http://localhost:3100/api/registry

# 格式化 JSON 输出
curl -s http://localhost:3100/api/registry | jq .
```

---

**维护**: Registry-API-Builder Agent
**版本**: 0.1.0
**技术栈**: Next.js 15 + Zod + Fuse.js + @xorigo-ui/registry
**最后更新**: 2025-10-12
