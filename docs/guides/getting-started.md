# 快速开始指南

> 5分钟集成 Xorigo UI 到你的 React 项目

## 🚀 安装

### 使用 npm
```bash
npm install @xorigo-ui/core
```

### 使用 yarn
```bash
yarn add @xorigo-ui/core
```

### 使用 pnpm
```bash
pnpm add @xorigo-ui/core
```

## 📋 依赖要求

Xorigo UI 需要以下 peer dependencies：

```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "tailwindcss": "^4.1.14"
}
```

## ⚙️ 配置

### 1. 配置 Tailwind CSS

在你的 `tailwind.config.js` 中添加 Xorigo UI 的路径：

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@xorigo-ui/core/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 2. 导入 CSS

在你的主入口文件中导入必要的 CSS：

```typescript
// src/main.tsx or src/index.tsx
import '@xorigo-ui/core/styles.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
```

## 🎨 基础使用

### 设置主题提供者

```typescript
// src/App.tsx
import { StyleRecipeProvider } from '@xorigo-ui/core'

function App() {
  return (
    <StyleRecipeProvider recipe="light.neutral-cool.standard.bright.comfortable.medium.high">
      <YourAppContent />
    </StyleRecipeProvider>
  )
}
```

### 使用组件

```typescript
import { Button, Card, Input, Avatar } from '@xorigo-ui/core'

function YourAppContent() {
  return (
    <div className="p-8 space-y-6">
      <Card className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar src="/avatar.jpg" alt="用户头像" />
          <div>
            <h1 className="text-xl font-semibold">欢迎使用 Xorigo UI</h1>
            <p className="text-gray-600">现代化的 React 组件库</p>
          </div>
        </div>

        <Input
          placeholder="请输入内容..."
          className="mb-4"
        />

        <div className="flex space-x-2">
          <Button variant="primary">
            主要按钮
          </Button>
          <Button variant="outline">
            次要按钮
          </Button>
        </div>
      </Card>
    </div>
  )
}
```

## 🎭 主题系统

Xorigo UI 使用七轴主题系统，配方格式为：
```
<mode>.<hue>.<saturation>.<lightness>.<density>.<roundness>.<contrast>
```

### 预定义主题

```typescript
// 浅色主题
StyleRecipeProvider recipe="light.neutral-warm.standard.bright.comfortable.medium.high"

// 深色主题
StyleRecipeProvider recipe="dark.neutral-cool.vivid.bright.comfortable.medium.high"

// 高对比度主题
StyleRecipeProvider recipe="light.blue.desaturated.bright.comfortable.rounded.high"

// 更多主题配方...
```

### 动态切换主题

```typescript
import { useState } from 'react'
import { StyleRecipeProvider } from '@xorigo-ui/core'

function ThemeApp() {
  const [recipe, setRecipe] = useState('light.neutral-warm.standard.bright.comfortable.medium.high')

  return (
    <StyleRecipeProvider recipe={recipe}>
      <YourAppContent />
      <ThemeSelector onThemeChange={setRecipe} />
    </StyleRecipeProvider>
  )
}
```

## 🎯 常用组件示例

### 按钮组件

```typescript
import { Button } from '@xorigo-ui/core'

function ButtonExamples() {
  return (
    <div className="space-x-2">
      <Button variant="primary" size="sm">小按钮</Button>
      <Button variant="primary" size="md">中按钮</Button>
      <Button variant="primary" size="lg">大按钮</Button>
      <Button variant="outline" disabled>禁用按钮</Button>
    </div>
  )
}
```

### 表单组件

```typescript
import { Input, Select, Checkbox } from '@xorigo-ui/core'

function FormExample() {
  return (
    <div className="space-y-4">
      <Input
        label="用户名"
        placeholder="请输入用户名"
        required
      />

      <Select
        label="城市"
        options={[
          { value: 'beijing', label: '北京' },
          { value: 'shanghai', label: '上海' },
          { value: 'guangzhou', label: '广州' }
        ]}
      />

      <Checkbox label="我同意用户协议" />
    </div>
  )
}
```

### 反馈组件

```typescript
import { Alert, Progress, Spinner } from '@xorigo-ui/core'

function FeedbackExample() {
  return (
    <div className="space-y-4">
      <Alert variant="info">
        这是一条信息提示
      </Alert>

      <Alert variant="success">
        操作成功完成！
      </Alert>

      <Progress value={60} className="w-full" />

      <Spinner size="lg" />
    </div>
  )
}
```

## 🔧 高级配置

### 自定义主题令牌

```typescript
import { extendTheme } from '@xorigo-ui/core'

const customTheme = extendTheme({
  colors: {
    primary: {
      50: '#eff6ff',
      500: '#3b82f6',
      900: '#1e3a8a',
    }
  }
})

function CustomThemeApp() {
  return (
    <StyleRecipeProvider recipe="your-custom-recipe" theme={customTheme}>
      <YourAppContent />
    </StyleRecipeProvider>
  )
}
```

### TypeScript 配置

在你的 `tsconfig.json` 中确保路径解析正确：

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"]
    }
  }
}
```

## 🐳 Docker 开发环境

推荐使用 Docker 进行开发：

```bash
# 启动开发环境
npm run docker:dev

# 访问应用
# http://localhost:3100
```

## 📚 下一步

- 查看 [组件文档](../components/README.md) 了解所有可用组件
- 阅读 [主题系统指南](../theming/seven-axis-system.md) 深入了解主题定制
- 探索 [开发指南](../development/README.md) 学习最佳实践

## 🤝 需要帮助？

- 查看 [GitHub Issues](https://github.com/your-org/xorigo-ui/issues)
- 参与 [社区讨论](https://github.com/your-org/xorigo-ui/discussions)
- 阅读 [完整文档](../README.md)

---

**Xorigo UI Team** · **版本** v1.4.0