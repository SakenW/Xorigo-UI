# 在线代码编译 API

## 概述

这是一个基于 **Next.js 15 App Router** + **esbuild** + **Zod** 的在线代码编译服务，用于将 TypeScript/TSX 代码编译为可执行的 JavaScript。

## 技术栈

- ✅ **Next.js 15** - Route Handlers API
- ✅ **esbuild** - 超快速 TypeScript/JSX 编译器
- ✅ **Zod** - TypeScript-first Schema 验证
- ✅ **安全限制** - 代码长度/超时/模块白名单

## API 端点

### `POST /api/compile`

编译 TypeScript/TSX 代码为 JavaScript。

#### 请求体

```typescript
{
  code: string,           // 必需，1-10000 字符
  config?: {              // 可选配置
    loader?: 'tsx' | 'ts' | 'jsx' | 'js',  // 默认 'tsx'
    target?: 'es2020' | 'esnext' | 'es2015', // 默认 'es2020'
    minify?: boolean,     // 默认 false
    sourcemap?: boolean   // 默认 false
  }
}
```

#### 响应

**成功 (200)**:
```typescript
{
  success: true,
  code: string,           // 编译后的 JavaScript
  map?: string,           // Source Map (如果启用)
  warnings?: string[]     // 编译警告
}
```

**失败 (400/403/500)**:
```typescript
{
  success: false,
  error: string,          // 错误信息
  details?: string        // 详细错误描述
}
```

### `GET /api/compile`

返回 API 使用说明和示例。

## 使用示例

### 1. 基础 TypeScript 编译

```typescript
const response = await fetch('/api/compile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    code: `
      const greeting: string = "Hello, Xorigo UI!";
      console.log(greeting);
    `,
    config: {
      loader: 'ts',
      target: 'es2020'
    }
  })
})

const result = await response.json()

if (result.success) {
  console.log('编译成功:', result.code)
  // 输出: const greeting = "Hello, Xorigo UI!"; console.log(greeting);
} else {
  console.error('编译失败:', result.error, result.details)
}
```

### 2. React TSX 组件编译

```typescript
const response = await fetch('/api/compile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    code: `
      import React from 'react';
      import { Button } from '@xorigo-ui/core';

      const App: React.FC = () => {
        return (
          <div>
            <h1>Hello World</h1>
            <Button variant="primary">Click me</Button>
          </div>
        );
      };

      export default App;
    `,
    config: {
      loader: 'tsx',
      target: 'es2020',
      minify: false
    }
  })
})

const result = await response.json()

if (result.success) {
  console.log('编译后的代码:', result.code)
  // 包含完整的 React.createElement 调用
}
```

### 3. 启用代码压缩和 Source Map

```typescript
const response = await fetch('/api/compile', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    code: `
      interface User {
        name: string;
        age: number;
      }

      const user: User = {
        name: 'Alice',
        age: 30
      };

      console.log(\`User: \${user.name}, Age: \${user.age}\`);
    `,
    config: {
      loader: 'ts',
      target: 'es2020',
      minify: true,        // 启用压缩
      sourcemap: true      // 生成 Source Map
    }
  })
})

const result = await response.json()

if (result.success) {
  console.log('压缩后代码:', result.code)
  console.log('Source Map:', result.map)
}
```

### 4. 错误处理示例

```typescript
// 示例 1: 代码长度超限
const response1 = await fetch('/api/compile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: 'x'.repeat(20000) // 超过 10KB
  })
})
// 响应: { success: false, error: '请求参数验证失败', details: 'code: 代码长度不能超过 10KB' }

// 示例 2: 语法错误
const response2 = await fetch('/api/compile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: 'const x: = 1;' // 语法错误
  })
})
// 响应: { success: false, error: '编译失败', details: '...' }

// 示例 3: 不允许的模块
const response3 = await fetch('/api/compile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    code: `import fs from 'fs'; fs.readFileSync('/etc/passwd');`
  })
})
// 响应: { success: false, error: '代码包含不允许的模块或操作' }
```

## 安全限制

### 代码限制
- **最大长度**: 10KB (10,000 字符)
- **编译超时**: 5 秒
- **仅编译不执行**: 服务器不会执行编译后的代码

### 模块白名单

以下 Node.js 内置模块**禁止**使用：
- ❌ `child_process` - 进程执行
- ❌ `fs` - 文件系统
- ❌ `net` - 网络操作
- ❌ `process.env` - 环境变量
- ❌ `__dirname` / `__filename` - 路径信息

### 错误类型

| HTTP 状态码 | 错误类型 | 说明 |
|------------|---------|------|
| 400 | 请求参数验证失败 | Zod Schema 验证失败 |
| 403 | 代码包含不允许的模块 | 使用了禁止的 Node.js 模块 |
| 500 | 服务器内部错误 | esbuild 编译失败或超时 |

## 配置选项详解

### `loader`
- **`tsx`** (默认): TypeScript + JSX
- **`ts`**: 纯 TypeScript
- **`jsx`**: JavaScript + JSX
- **`js`**: 纯 JavaScript

### `target`
- **`es2020`** (默认): 兼容 ES2020 语法
- **`esnext`**: 最新 ECMAScript 特性
- **`es2015`**: ES6/ES2015 兼容

### `minify`
- **`false`** (默认): 保持可读性
- **`true`**: 压缩代码（移除空格、缩短变量名）

### `sourcemap`
- **`false`** (默认): 不生成 Source Map
- **`true`**: 生成 Source Map（用于调试）

## 集成到 Playground

### React 组件示例

```tsx
'use client'

import { useState } from 'react'
import { Button } from '@xorigo-ui/core'

export default function PlaygroundEditor() {
  const [code, setCode] = useState(`const x: number = 1;\nconsole.log(x);`)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const handleCompile = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code,
          config: {
            loader: 'ts',
            target: 'es2020',
            minify: false
          }
        })
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: '网络错误',
        details: error instanceof Error ? error.message : String(error)
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="playground">
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="editor"
        rows={10}
      />
      <Button onClick={handleCompile} disabled={loading}>
        {loading ? '编译中...' : '编译代码'}
      </Button>
      {result && (
        <div className="result">
          {result.success ? (
            <pre>{result.code}</pre>
          ) : (
            <div className="error">
              <strong>{result.error}</strong>
              <p>{result.details}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

## 性能优化

### 1. esbuild 缓存
esbuild 会自动缓存编译结果，相同代码的重复编译会非常快速。

### 2. 客户端防抖
建议在客户端实现防抖（debounce）机制，避免频繁请求：

```typescript
import { debounce } from 'lodash'

const debouncedCompile = debounce(async (code: string) => {
  await fetch('/api/compile', {
    method: 'POST',
    body: JSON.stringify({ code })
  })
}, 500) // 500ms 防抖
```

### 3. 增量编译
对于大型项目，考虑只编译变更的文件部分。

## 故障排查

### 问题 1: 编译超时
**原因**: 代码过于复杂或包含死循环逻辑
**解决**: 简化代码，移除复杂的类型推导

### 问题 2: 类型错误
**原因**: TypeScript 类型不兼容
**解决**: 检查类型定义，确保符合 TypeScript 规范

### 问题 3: JSX 转换失败
**原因**: JSX 语法错误或缺少 React 导入
**解决**: 确保代码包含 `import React from 'react'`

## API 版本
- **Version**: 1.0.0
- **Last Updated**: 2025-10-12

## 技术支持
- GitHub Issues: [Xorigo UI Issues](https://github.com/your-org/Xorigo UI/issues)
- Documentation: [Xorigo UI Docs](https://xorigo-ui.dev/docs/api/compile)

---

**🚀 Built with Next.js 15 + esbuild + Zod**
