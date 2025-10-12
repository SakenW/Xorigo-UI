# 🔄 Xorigo UI 组件迁移实施指南

> **目标**：将所有组件从旧的 ThemeProvider 系统迁移到新的七轴 StyleRecipeProvider 系统

---

## 📋 迁移概览

### 迁移范围

**需要迁移的组件（17个）**：
- ✅ Button (已完成示例)
- ⏳ Card
- ⏳ Input
- ⏳ Modal
- ⏳ Switch
- ⏳ Toast
- ⏳ Dropdown
- ⏳ Accordion
- ⏳ Tabs
- ⏳ Avatar
- ⏳ Badge
- ⏳ Progress
- ⏳ Spinner
- ⏳ Tooltip
- ⏳ Alert
- ⏳ Breadcrumb
- ⏳ Pagination

### 迁移原则

1. **完全解耦**：组件不再直接依赖 ThemeProvider
2. **CSS 变量优先**：所有样式使用 `var(--*)` CSS 变量
3. **保持 API 一致**：组件 Props 不变，保证向下兼容
4. **渐进式迁移**：组件可以逐个迁移，不影响其他组件

---

## 🎯 迁移模式对比

### 旧系统模式（ThemeProvider）

```typescript
// ❌ 旧模式：组件直接依赖 ThemeProvider
import { useTheme } from '../../theme/ThemeProvider'

const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => {
  const { themeConfig } = useTheme()  // 直接获取主题配置

  // 硬编码颜色或直接使用主题配置
  const buttonStyles = cva(
    'inline-flex items-center justify-center rounded-lg...',
    {
      variants: {
        variant: {
          // ❌ 硬编码渐变
          primary: [
            'bg-gradient-to-r',
            'from-blue-500 to-purple-600',
            'hover:from-blue-600 hover:to-purple-700',
          ].join(' '),

          // ❌ 直接使用主题配置
          secondary: `bg-${themeConfig.colors.secondary}`,
        },
      },
    }
  )

  return <button className={buttonStyles({ variant })} {...props} />
}
```

### 新系统模式（StyleRecipeProvider）

```typescript
// ✅ 新模式：组件使用 CSS 变量，完全解耦
const Button: React.FC<ButtonProps> = ({ variant = 'primary', ...props }) => {
  // ✅ 不需要任何主题 Hook

  const buttonStyles = cva(
    'inline-flex items-center justify-center rounded-lg...',
    {
      variants: {
        variant: {
          // ✅ 使用 CSS 变量
          primary: [
            'bg-[var(--color-primary-500)]',
            'hover:bg-[var(--color-primary-600)]',
            'text-white',
            'shadow-[var(--surface-shadow)]',
            'transition-all',
            'duration-[var(--motion-duration-base)]',
            'ease-[var(--motion-easing)]',
          ].join(' '),

          secondary: [
            'bg-[var(--color-neutral-100)]',
            'dark:bg-[var(--color-neutral-800)]',
            'text-[var(--color-neutral-900)]',
            'dark:text-[var(--color-neutral-100)]',
            'border border-[var(--color-neutral-300)]',
            'hover:bg-[var(--color-neutral-200)]',
          ].join(' '),
        },
      },
    }
  )

  return <button className={buttonStyles({ variant })} {...props} />
}
```

---

## 🔧 CSS 变量映射表

### 颜色变量

| 用途 | 旧系统 | 新系统 |
|------|--------|--------|
| 主色 | `themeConfig.colors.primary` | `var(--color-primary-500)` |
| 主色悬停 | `themeConfig.colors.primaryHover` | `var(--color-primary-600)` |
| 次要色 | `themeConfig.colors.secondary` | `var(--color-neutral-200)` |
| 文本 | `themeConfig.colors.text` | `var(--color-neutral-900)` |
| 背景 | `themeConfig.colors.background` | `var(--color-neutral-50)` |
| 边框 | `themeConfig.colors.border` | `var(--color-neutral-300)` |
| 成功 | `themeConfig.colors.success` | `var(--color-success-500)` |
| 警告 | `themeConfig.colors.warning` | `var(--color-warning-500)` |
| 错误 | `themeConfig.colors.error` | `var(--color-error-500)` |

### 色阶变量（完整色板）

```typescript
// 每个颜色都有 11 个色阶
--color-primary-50    // 最浅
--color-primary-100
--color-primary-200
--color-primary-300
--color-primary-400
--color-primary-500   // 主色调
--color-primary-600
--color-primary-700
--color-primary-800
--color-primary-900
--color-primary-950   // 最深

// 同样适用于：
--color-neutral-*
--color-success-*
--color-warning-*
--color-error-*
--color-info-*
```

### 间距变量

| 用途 | 旧系统 | 新系统 |
|------|--------|--------|
| 超小间距 | `themeConfig.spacing.xs` | `var(--spacing-xs)` |
| 小间距 | `themeConfig.spacing.sm` | `var(--spacing-sm)` |
| 中间距 | `themeConfig.spacing.md` | `var(--spacing-md)` |
| 大间距 | `themeConfig.spacing.lg` | `var(--spacing-lg)` |
| 超大间距 | `themeConfig.spacing.xl` | `var(--spacing-xl)` |

### 动效变量

| 用途 | 旧系统 | 新系统 |
|------|--------|--------|
| 快速动效 | `themeConfig.motion.fast` | `var(--motion-duration-fast)` |
| 标准动效 | `themeConfig.motion.base` | `var(--motion-duration-base)` |
| 慢速动效 | `themeConfig.motion.slow` | `var(--motion-duration-slow)` |
| 缓动函数 | `themeConfig.motion.easing` | `var(--motion-easing)` |

### 表面变量

| 用途 | 新系统 |
|------|--------|
| 阴影 | `var(--surface-shadow)` |
| 模糊 | `var(--surface-backdrop-blur)` |
| 玻璃背景 | `var(--surface-background)` |
| 玻璃边框 | `var(--surface-border)` |

### 字体变量

| 用途 | 新系统 |
|------|--------|
| 超小字号 | `var(--font-size-xs)` |
| 小字号 | `var(--font-size-sm)` |
| 基础字号 | `var(--font-size-base)` |
| 大字号 | `var(--font-size-lg)` |
| 超大字号 | `var(--font-size-xl)` |

---

## 📝 标准迁移步骤

### Step 1: 移除 ThemeProvider 依赖

```typescript
// ❌ 删除这一行
import { useTheme } from '../../theme/ThemeProvider'

// ❌ 删除这一行
const { themeConfig } = useTheme()
```

### Step 2: 重写样式变体

**原则**：
1. 所有颜色值改为 `var(--color-*)`
2. 所有间距改为 `var(--spacing-*)`
3. 所有动效改为 `var(--motion-*)`

**示例 - Button 组件**：

```typescript
const buttonVariants = cva(
  // 基础样式
  [
    'inline-flex items-center justify-center',
    'rounded-lg font-medium',
    'transition-all',
    'duration-[var(--motion-duration-base)]',  // ✅ 动效变量
    'ease-[var(--motion-easing)]',            // ✅ 缓动变量
    'focus:outline-hidden',
    'focus:ring-2 focus:ring-offset-2',
    'disabled:opacity-50 disabled:pointer-events-none',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: [
          'bg-[var(--color-primary-500)]',           // ✅ 主色
          'hover:bg-[var(--color-primary-600)]',      // ✅ 悬停色
          'focus:ring-[var(--color-primary-400)]',    // ✅ 聚焦环
          'text-white',
          'shadow-[var(--surface-shadow)]',           // ✅ 阴影
        ].join(' '),

        secondary: [
          'bg-[var(--color-neutral-100)]',            // ✅ 次要背景（亮色）
          'dark:bg-[var(--color-neutral-800)]',       // ✅ 次要背景（暗色）
          'text-[var(--color-neutral-900)]',
          'dark:text-[var(--color-neutral-100)]',
          'border border-[var(--color-neutral-300)]',
          'hover:bg-[var(--color-neutral-200)]',
          'dark:hover:bg-[var(--color-neutral-700)]',
        ].join(' '),

        ghost: [
          'text-[var(--color-neutral-700)]',
          'dark:text-[var(--color-neutral-300)]',
          'hover:bg-[var(--color-neutral-100)]',
          'dark:hover:bg-[var(--color-neutral-800)]',
        ].join(' '),

        glass: [
          'backdrop-blur-[var(--surface-backdrop-blur)]',  // ✅ 玻璃模糊
          'bg-[var(--surface-background)]',                // ✅ 玻璃背景
          'border border-[var(--surface-border)]',         // ✅ 玻璃边框
          'text-white',
        ].join(' '),
      },

      size: {
        sm: [
          'h-[32px]',
          'px-[var(--spacing-sm)]',              // ✅ 间距变量
          'text-[var(--font-size-sm)]',          // ✅ 字号变量
        ].join(' '),
        md: [
          'h-[40px]',
          'px-[var(--spacing-md)]',
          'text-[var(--font-size-base)]',
        ].join(' '),
        lg: [
          'h-[48px]',
          'px-[var(--spacing-lg)]',
          'text-[var(--font-size-lg)]',
        ].join(' '),
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)
```

### Step 3: 更新组件导出

```typescript
// ✅ 保持组件 API 不变
export interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'variant'>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || loading}
        whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
        {...props}
      >
        {loading && <Spinner size={size} className="mr-2" />}
        {!loading && leftIcon && <span className="mr-2">{leftIcon}</span>}
        {children}
        {!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'
```

### Step 4: 测试迁移

```typescript
// tests/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { StyleRecipeProvider } from '../../src/style-recipe'
import { Button } from '../../src/components/ui/Button'

describe('Button - 迁移后测试', () => {
  it('应该正确渲染主要按钮', () => {
    render(
      <StyleRecipeProvider initialRecipe="light.neutral-true-mid.mono(blue).standard.comfortable.standard.soft-shadow">
        <Button variant="primary">点击我</Button>
      </StyleRecipeProvider>
    )

    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveClass('bg-[var(--color-primary-500)]')
  })

  it('应该正确响应主题切换', () => {
    const { rerender } = render(
      <StyleRecipeProvider initialRecipe="light.neutral-true-mid.mono(blue).standard.comfortable.standard.soft-shadow">
        <Button variant="primary">按钮</Button>
      </StyleRecipeProvider>
    )

    // 切换到暗色主题
    rerender(
      <StyleRecipeProvider initialRecipe="dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass">
        <Button variant="primary">按钮</Button>
      </StyleRecipeProvider>
    )

    // 验证 CSS 变量自动更新
    const button = screen.getByRole('button')
    const styles = window.getComputedStyle(button)
    // 注意：CSS 变量值会由 StyleRecipeProvider 动态注入
  })
})
```

---

## 🎨 特殊场景处理

### 场景 1：动态颜色计算

```typescript
// ❌ 旧系统：JavaScript 计算颜色
const getBorderColor = (themeConfig: ThemeConfig) => {
  return themeConfig.mode === 'dark'
    ? lighten(themeConfig.colors.border, 0.1)
    : darken(themeConfig.colors.border, 0.1)
}

// ✅ 新系统：使用预定义色阶
const cardVariants = cva('...', {
  variants: {
    variant: {
      default: [
        'border',
        'border-[var(--color-neutral-300)]',       // 亮色边框
        'dark:border-[var(--color-neutral-700)]',  // 暗色边框
      ].join(' '),
    },
  },
})
```

### 场景 2：渐变色

```typescript
// ❌ 旧系统：硬编码渐变
const gradient = 'bg-gradient-to-r from-blue-500 to-purple-600'

// ✅ 新系统：使用 CSS 变量渐变
const cardVariants = cva('...', {
  variants: {
    variant: {
      gradient: [
        'bg-gradient-to-r',
        'from-[var(--color-primary-500)]',
        'to-[var(--color-primary-700)]',
        // 或者使用自定义渐变变量
        'bg-[var(--gradient-primary)]',  // 由 Provider 生成
      ].join(' '),
    },
  },
})
```

### 场景 3：玻璃态效果

```typescript
// ✅ 使用专用的 surface 变量
const glassCardVariants = cva(
  [
    'backdrop-blur-[var(--surface-backdrop-blur)]',  // 模糊程度
    'bg-[var(--surface-background)]',                // 半透明背景
    'border border-[var(--surface-border)]',         // 边框
    'shadow-[var(--surface-shadow)]',                // 阴影
  ].join(' ')
)
```

### 场景 4：响应式主题切换

```typescript
// ✅ 组件不需要关心主题切换逻辑
// StyleRecipeProvider 会自动更新 CSS 变量

// 应用层（App.tsx）
const App: React.FC = () => {
  const [recipeId, setRecipeId] = useState(DEFAULT_RECIPE)

  return (
    <StyleRecipeProvider initialRecipe={recipeId}>
      {/* 切换主题 */}
      <ThemeSwitcher onSwitch={setRecipeId} />

      {/* 所有组件自动响应 */}
      <Button variant="primary">按钮</Button>
      <Card>卡片内容</Card>
    </StyleRecipeProvider>
  )
}
```

---

## 🔍 迁移检查清单

### 代码层面

- [ ] 移除所有 `import { useTheme } from '../../theme/ThemeProvider'`
- [ ] 移除所有 `const { themeConfig } = useTheme()`
- [ ] 所有颜色值改为 `var(--color-*)`
- [ ] 所有间距改为 `var(--spacing-*)`
- [ ] 所有动效时长改为 `var(--motion-duration-*)`
- [ ] 所有缓动函数改为 `var(--motion-easing)`
- [ ] 所有表面效果改为 `var(--surface-*)`
- [ ] 添加 `dark:` 前缀支持暗色模式

### 测试层面

- [ ] 组件在亮色模式下渲染正确
- [ ] 组件在暗色模式下渲染正确
- [ ] 组件响应配方切换
- [ ] 所有变体（variant）渲染正确
- [ ] 所有尺寸（size）渲染正确
- [ ] Props API 保持不变
- [ ] TypeScript 类型定义完整

### 文档层面

- [ ] 更新组件文档示例
- [ ] 更新 Storybook 故事
- [ ] 添加配方切换示例
- [ ] 更新 README.md

---

## 📊 迁移进度跟踪

### Phase 1 - 核心组件（1周）

- [x] Button - 已完成
- [ ] Card - 进行中
- [ ] Input - 待开始
- [ ] Modal - 待开始

### Phase 2 - 交互组件（1周）

- [ ] Switch
- [ ] Toast
- [ ] Dropdown
- [ ] Accordion

### Phase 3 - 信息组件（1周）

- [ ] Badge
- [ ] Alert
- [ ] Tooltip
- [ ] Progress
- [ ] Spinner

### Phase 4 - 导航组件（1周）

- [ ] Tabs
- [ ] Breadcrumb
- [ ] Pagination

### Phase 5 - 清理和优化（3天）

- [ ] 删除 `src/theme/ThemeProvider.tsx`
- [ ] 删除 `src/theme/palettes/`
- [ ] 更新所有测试
- [ ] 更新所有文档
- [ ] 性能优化和测试

---

## 🚨 常见问题和解决方案

### Q1: CSS 变量在 TypeScript 中没有类型提示？

**A**: 添加 CSS 变量类型声明：

```typescript
// src/types/css-variables.d.ts
declare module 'react' {
  interface CSSProperties {
    '--color-primary-500'?: string
    '--color-neutral-100'?: string
    // ... 其他变量
  }
}
```

### Q2: Tailwind 不识别 `var(--*)` 语法？

**A**: 使用方括号语法 `bg-[var(--color-primary-500)]`，Tailwind 会保留原始值。

### Q3: 如何在 JavaScript 中访问 CSS 变量值？

**A**: 使用 `getComputedStyle`：

```typescript
const getPrimaryColor = () => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--color-primary-500')
}
```

### Q4: 暗色模式下某些颜色不对？

**A**: 确保添加了 `dark:` 前缀：

```typescript
// ✅ 正确
'bg-[var(--color-neutral-100)] dark:bg-[var(--color-neutral-800)]'

// ❌ 错误（暗色模式下仍然是 neutral-100）
'bg-[var(--color-neutral-100)]'
```

### Q5: 如何调试 CSS 变量值？

**A**: 在浏览器开发者工具中查看 `:root` 的 CSS 变量：

```javascript
// 控制台执行
console.table(
  Array.from(document.styleSheets)
    .flatMap(sheet => Array.from(sheet.cssRules))
    .filter(rule => rule.selectorText === ':root')
    .flatMap(rule => Array.from(rule.style))
    .map(prop => ({
      name: prop,
      value: getComputedStyle(document.documentElement).getPropertyValue(prop)
    }))
)
```

---

## 📚 相关文档

- [完整新系统架构](./NEW_SYSTEM_COMPLETE_GUIDE.md)
- [OKLCH 色彩系统](./OKLCH_COLOR_SYSTEM.md)
- [StyleRecipeProvider API](./API_REFERENCE.md)
- [测试指南](./TESTING_GUIDE.md)

---

**创建时间**: 2025-01-13
**最后更新**: 2025-01-13
**状态**: 🚀 实施指南
**负责人**: Xorigo UI Team
