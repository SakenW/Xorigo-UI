# 📦 Xorigo UI 外部项目使用指南

> **版本**: v2025.11.05
> **更新时间**: 2025-11-08
> **适用场景**: 在其他React项目中集成和使用Xorigo UI组件库

## 🎯 使用方式概览

Xorigo UI支持多种使用方式，根据您的项目需求选择最适合的方案：

### 1. 📦 NPM包管理器使用（推荐）

#### 安装依赖
```bash
# 使用 npm
npm install @xorigo-ui/core

# 使用 yarn
yarn add @xorigo-ui/core

# 使用 pnpm
pnpm add @xorigo-ui/core
```

#### 安装必要依赖
```bash
# 必需的peer dependencies
npm install react react-dom framer-motion class-variance-authority clsx tailwind-merge

# 可选依赖（如果需要表单功能）
npm install formik

# 可选依赖（如果需要数据验证）
npm install zod
```

### 2. 🔗 本地开发模式（开发时推荐）

如果您想在开发过程中使用本地版本的Xorigo UI：

```bash
# 在您的项目中链接本地Xorigo UI
cd /path/to/your-project
npm link /home/saken/project/Xorigo-UI/packages/core
```

## 🚀 基础配置

### 1. Tailwind CSS 配置

在您项目的 `tailwind.config.js` 中添加Xorigo UI的设计令牌：

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@xorigo-ui/**/*.{js,ts,jsx,tsx}" // 添加这一行
  ],
  theme: {
    extend: {
      // Xorigo UI的设计令牌会自动注入
    },
  },
  plugins: [
    // 如果您使用了Xorigo UI的Tailwind插件
    require('@xorigo-ui/tailwind-plugin') // 可选
  ],
}
```

### 2. 主题系统集成

在您的应用根部添加主题提供者：

```tsx
// App.tsx 或根组件
import React from 'react'
import { ThemeBridge } from '@xorigo-ui/core'

export function App() {
  return (
    <ThemeBridge>
      <YourAppContent />
    </ThemeBridge>
  )
}
```

## 📚 组件使用示例

### 基础组件导入

```tsx
// 方式1: 导入所有组件
import { Button, Input, Card } from '@xorigo-ui/core'

// 方式2: 按需导入（推荐）
import { Button } from '@xorigo-ui/core/inputs'
import { Card } from '@xorigo-ui/core/layout'
import { Typography } from '@xorigo-ui/core/typography-media'
```

### 实际使用示例

```tsx
// 示例：创建一个完整的表单界面
import React, { useState } from 'react'
import {
  Button,
  TextInput,
  EmailInput,
  NumberInput,
  Card,
  Alert,
  Heading
} from '@xorigo-ui/core'

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 处理表单提交
    console.log('Form submitted:', formData)
  }

  return (
    <Card className="max-w-md mx-auto p-6">
      <Heading level={2} className="mb-6">联系我们</Heading>

      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="姓名"
          value={formData.name}
          onChange={(value) => setFormData(prev => ({ ...prev, name: value }))}
          placeholder="请输入您的姓名"
          required
        />

        <EmailInput
          label="邮箱"
          value={formData.email}
          onChange={(value) => setFormData(prev => ({ ...prev, email: value }))}
          placeholder="请输入您的邮箱"
          required
        />

        <NumberInput
          label="电话"
          value={formData.phone}
          onChange={(value) => setFormData(prev => ({ ...prev, phone: value }))}
          placeholder="请输入您的电话号码"
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full"
        >
          提交
        </Button>
      </form>
    </Card>
  )
}
```

## 🎨 主题定制

### 使用七轴主题系统

```tsx
import { useTheme, ThemeSelector } from '@xorigo-ui/core'

export function ThemedComponent() {
  const { theme, updateTheme } = useTheme()

  return (
    <div>
      <ThemeSelector />
      {/* 您的组件内容 */}
    </div>
  )
}
```

### 自定义主题配方

```tsx
import { useThemeBridge } from '@xorigo-ui/core'

export function CustomThemeExample() {
  const { applyRecipe } = useThemeBridge()

  const applyCustomTheme = () => {
    applyRecipe({
      mode: 'dark',
      hue: 220,      // 蓝色调
      saturation: 80, // 高饱和度
      lightness: 50,  // 中等亮度
      density: 'comfortable',
      roundness: 'medium',
      contrast: 'high'
    })
  }

  return (
    <Button onClick={applyCustomTheme}>
      应用自定义主题
    </Button>
  )
}
```

## 🔧 高级配置

### 1. 自定义组件注册

```tsx
import { ComponentRegistry } from '@xorigo-ui/core'

// 注册自定义组件
ComponentRegistry.register('MyCustomComponent', {
  category: 'utilities',
  component: MyCustomComponent,
  defaultProps: { /* 默认属性 */ }
})
```

### 2. 工具函数使用

```tsx
import {
  cn,  // 类名合并工具
  formatNumber,  // 数字格式化
  validateEmail  // 邮箱验证
} from '@xorigo-ui/core/utils'

export function UtilityExample() {
  const className = cn(
    'base-class',
    'additional-class',
    condition && 'conditional-class'
  )

  return (
    <div className={className}>
      格式化数字: {formatNumber(1234567)}
    </div>
  )
}
```

## 🏗️ 项目结构建议

```
your-project/
├── src/
│   ├── components/
│   │   ├── ui/           # UI组件封装
│   │   └── features/     # 功能组件
│   ├── hooks/
│   ├── utils/
│   └── styles/
├── tailwind.config.js
├── package.json
└── tsconfig.json
```

### UI组件封装示例

```tsx
// src/components/ui/Button.tsx
import { Button as XorigoButton } from '@xorigo-ui/core/inputs'

interface ButtonProps extends React.ComponentProps<typeof XorigoButton> {
  // 扩展您的自定义属性
}

export function Button(props: ButtonProps) {
  return <XorigoButton {...props} />
}
```

## 🚨 常见问题

### Q1: 样式不生效？
**A**: 确保已正确配置Tailwind CSS，并且包含了Xorigo UI的路径。

### Q2: TypeScript类型错误？
**A**: 确保安装了正确的类型定义：
```bash
npm install -D @types/react @types/react-dom
```

### Q3: 主题不生效？
**A**: 确保在应用根部使用了 `ThemeBridge` 组件。

### Q4: 构建体积过大？
**A**: 使用按需导入：
```tsx
// ✅ 推荐
import { Button } from '@xorigo-ui/core/inputs'

// ❌ 不推荐
import * as XorigoUI from '@xorigo-ui/core'
```

## 📖 完整项目示例

```tsx
// main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeBridge } from '@xorigo-ui/core'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeBridge>
      <App />
    </ThemeBridge>
  </React.StrictMode>
)

// App.tsx
import React from 'react'
import {
  Button,
  Card,
  Heading,
  TextInput,
  Alert
} from '@xorigo-ui/core'

function App() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <header>
          <Heading level={1}>欢迎使用Xorigo UI</Heading>
        </header>

        <main>
          <Card className="p-6">
            <Heading level={2}>快速开始</Heading>
            <Alert type="info" className="mb-4">
              这是使用Xorigo UI构建的示例应用
            </Alert>

            <TextInput
              label="示例输入框"
              placeholder="请输入内容..."
              className="mb-4"
            />

            <Button variant="primary">
              开始使用
            </Button>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default App
```

## 📞 技术支持

- 📚 **文档**: [Xorigo UI 官方文档](https://xorigo-ui.com/docs)
- 🐛 **问题反馈**: [GitHub Issues](https://github.com/your-org/xorigo-ui/issues)
- 💬 **社区讨论**: [Discord 社区](https://discord.gg/xorigo-ui)

---

**🎉 恭喜！您已经掌握了在其他项目中使用Xorigo UI的方法。**