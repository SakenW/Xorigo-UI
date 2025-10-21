# 组件变体系统标准化 Skill

**触发条件**：当需要创建组件变体系统、维护组件 API 一致性、应用 CVA 模式时触发

## 功能描述

标准化 Xorigo UI 组件的变体系统设计，确保所有组件遵循统一的 API 设计模式、变体定义和语义令牌集成规范。

## 核心能力

### 1. 组件变体结构生成
基于分析的 Button/Input 模式，生成标准化的组件变体结构：

```typescript
// 标准变体配置模式
const componentVariants = cva(
  "base-classes", // 基础样式类
  {
    variants: {
      variant: {
        primary: "主题色变体样式",
        secondary: "次要色变体样式",
        outline: "边框变体样式",
        ghost: "幽灵变体样式"
      },
      size: {
        sm: "小尺寸样式",
        md: "标准尺寸样式",
        lg: "大尺寸样式"
      },
      state: {
        default: "默认状态样式",
        disabled: "禁用状态样式",
        loading: "加载状态样式"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
)
```

### 2. 组件 API 标准化
确保所有组件遵循统一的 API 设计规范：

```typescript
// 标准组件 Props 接口
export interface ComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  // 基础属性
  className?: string
  children?: React.ReactNode

  // 状态控制
  disabled?: boolean
  loading?: boolean

  // 可访问性
  'aria-label'?: string
  'aria-describedby'?: string

  // 事件处理
  onClick?: (event: Event) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}
```

### 3. 语义令牌集成验证
验证组件是否正确使用主题令牌：

```typescript
// ✅ 正确的令牌使用
const semanticStyles = {
  backgroundColor: 'var(--color-primary-500)',
  color: 'var(--color-text-on-primary)',
  borderColor: 'var(--border-primary)',
  transition: 'all var(--transition-fast)'
}

// ❌ 硬编码颜色检测
if (containsHardcodedColors(styles)) {
  throw new Error('检测到硬编码颜色，请使用主题令牌')
}
```

### 4. 组件定义模板生成
生成完整的组件定义模板：

```typescript
// 完整组件模板
import React from 'react'
import { motion } from 'framer-motion'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const componentVariants = cva(/* 变体配置 */)

export interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // 属性定义
}

const Component = React.forwardRef<HTMLDivElement, ComponentProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <motion.div
        className={cn(componentVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      >
        {children}
      </motion.div>
    )
  }
)

Component.displayName = "Component"
export { Component, componentVariants }
```

## 标准化规范

### 变体命名规范
- **variant**: `primary | secondary | outline | ghost | destructive`
- **size**: `xs | sm | md | lg | xl | 2xl`
- **state**: `default | disabled | loading | error | success`

### 语义令牌映射
- **背景色**: `--color-{variant}-{value}`
- **文本色**: `--color-text-{context}`
- **边框色**: `--border-{priority}`
- **过渡**: `--transition-{speed}`

### 组件结构要求
- 使用 `React.forwardRef` 支持 ref 转发
- 继承标准 HTML 元素属性
- 集成 Framer Motion 动画
- 支持 className 合并
- 设置 displayName

## 质量检查

### API 一致性检查
- [ ] 继承正确的 HTML 元素属性
- [ ] 使用 VariantProps 类型扩展
- [ ] 包含标准基础属性 (className, children)
- [ ] 事件处理器命名规范 (on + 事件名)

### 变体系统检查
- [ ] 使用 CVA 定义变体
- [ ] 包含 defaultVariants 配置
- [ ] 变体命名符合规范
- [ ] 样式类正确组合

### 主题集成检查
- [ ] 使用 CSS 变量而非硬编码值
- [ ] 语义化令牌命名
- [ ] 支持深色/浅色主题
- [ ] 10种主题配方兼容

### 可访问性检查
- [ ] 正确的 ARIA 属性
- [ ] 键盘导航支持
- [ ] 焦点管理
- [ ] 屏幕阅读器兼容

## 使用示例

```bash
# 使用 Skill 创建新组件
"创建一个 Badge 组件，包含 primary/secondary/destructive 变体，支持 sm/md/lg 尺寸"

# 验证现有组件
"检查 Button 组件是否符合组件变体系统标准"

# 修复组件 API
"将 Card 组件的 API 标准化，添加缺失的 variant 和 size 属性"
```

## 输出格式

1. **组件代码**: 完整的组件实现
2. **类型定义**: TypeScript 接口和类型
3. **测试用例**: 基础测试模板
4. **使用文档**: 组件使用说明和示例

## 技术依据

基于 Xorigo UI 组件库的实际模式分析：
- Button 组件: 10种变体，6种尺寸，完整的语义令牌集成
- Input 组件: 6种变体，浮动标签，验证状态支持
- Skeleton 组件: 4种变体，预设组合模式
- Spinner 组件: 6种尺寸，Framer Motion 动画集成

确保所有生成的组件遵循 Xorigo UI 的设计系统原则和 React 19 + TypeScript 5.9 最佳实践。