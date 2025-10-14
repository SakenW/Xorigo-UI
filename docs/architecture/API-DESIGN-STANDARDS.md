# Xorigo UI API设计标准文档

**版本**: v1.1
**日期**: 2025年10月13日
**状态**: 草案
**适用范围**: 所有Xorigo UI组件

---

## 📋 概述

本文档定义了Xorigo UI组件库的统一API设计标准，确保所有组件的一致性、可预测性和易用性。

### 🎯 设计目标

- **一致性**: 所有组件遵循相同的API设计模式
- **可预测性**: 开发者可以轻松预测组件的Props和用法
- **可扩展性**: API设计支持未来的功能扩展
- **类型安全**: 完整的TypeScript类型支持
- **可访问性**: 内置可访问性支持

---

## 🔧 基础Props标准

### 1. 统一的尺寸系统

所有组件都应使用统一的5级尺寸系统：

```typescript
// 标准尺寸接口
interface StandardSizes {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
}

// 尺寸映射到实际值
export const sizeMap = {
  xs: { padding: '0.25rem 0.5rem', fontSize: '0.75rem', lineHeight: '1rem' },
  sm: { padding: '0.5rem 0.75rem', fontSize: '0.875rem', lineHeight: '1.25rem' },
  md: { padding: '0.75rem 1rem', fontSize: '1rem', lineHeight: '1.5rem' },
  lg: { padding: '1rem 1.25rem', fontSize: '1.125rem', lineHeight: '1.75rem' },
  xl: { padding: '1.25rem 1.5rem', fontSize: '1.25rem', lineHeight: '1.75rem' },
}

// 使用示例
interface ButtonProps extends StandardSizes {
  // 组件特定props
}
```

### 2. 统一的变体系统

所有交互组件都应使用统一的6种语义化变体：

```typescript
// 标准变体接口
interface StandardVariants {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'
}

// 变体语义定义
export const variantSemantics = {
  primary: '主要操作，如提交、确认',
  secondary: '次要操作，如取消、返回',
  success: '成功状态，如已完成、保存成功',
  warning: '警告状态，如注意事项、提醒',
  danger: '危险操作，如删除、清除',
  neutral: '中性操作，如查看、浏览',
}

// 使用示例
interface AlertProps extends StandardVariants {
  // 组件特定props
}
```

### 3. 统一的状态控制

```typescript
// 标准状态接口
interface StandardStates {
  disabled?: boolean
  loading?: boolean
  error?: boolean
  required?: boolean
}

// 状态优先级（高到低）: error > loading > disabled > normal
```

### 4. 标准的样式扩展

```typescript
// 标准样式扩展接口
interface StyleExtensions {
  className?: string
  style?: React.CSSProperties
  testId?: string
  'data-testid'?: string
  'data-component'?: string
}
```

---

## 🎯 标准Props接口

### 基础组件接口

```typescript
// 所有组件的基础接口
export interface BaseComponentProps
  extends StandardSizes,
            StandardVariants,
            StandardStates,
            StyleExtensions {
  children?: React.ReactNode
  as?: React.ElementType
}
```

### 交互组件接口

```typescript
// 交互组件额外属性
export interface InteractiveComponentProps extends BaseComponentProps {
  // 标准事件处理器
  onClick?: (event: React.MouseEvent) => void
  onFocus?: (event: React.FocusEvent) => void
  onBlur?: (event: React.FocusEvent) => void
  onKeyDown?: (event: React.KeyboardEvent) => void
  onKeyUp?: (event: React.KeyboardEvent) => void

  // 可访问性属性
  'aria-label'?: string
  'aria-describedby'?: string
  'aria-labelledby'?: string
  'aria-expanded'?: boolean
  'aria-pressed'?: boolean
  'aria-selected'?: boolean
  role?: string
  tabIndex?: number
}
```

### 表单组件接口

```typescript
// 表单组件特定属性
export interface FormComponentProps extends InteractiveComponentProps {
  // 值控制
  value?: any
  defaultValue?: any
  onChange?: (value: any, event?: React.ChangeEvent) => void
  onInput?: (value: any, event?: React.ChangeEvent) => void

  // 验证相关
  name?: string
  placeholder?: string
  readOnly?: boolean
  required?: boolean

  // HTML原生属性
  id?: string
  autoComplete?: string
  maxLength?: number
  minLength?: number
  pattern?: string
}
```

---

## 📝 事件处理器命名规范

### 1. 标准事件处理器

```typescript
interface StandardEventHandlers<T = any> {
  // 基础事件
  onClick?: (event: React.MouseEvent) => void
  onFocus?: (event: React.FocusEvent) => void
  onBlur?: (event: React.FocusEvent) => void
  onChange?: (value: T, event?: React.ChangeEvent) => void
  onSubmit?: (data: T, event?: React.FormEvent) => void

  // 键盘事件
  onKeyDown?: (event: React.KeyboardEvent) => void
  onKeyUp?: (event: React.KeyboardEvent) => void
  onKeyPress?: (event: React.KeyboardEvent) => void

  // 拖拽事件
  onDragStart?: (event: React.DragEvent) => void
  onDragEnd?: (event: React.DragEvent) => void
  onDrop?: (event: React.DragEvent) => void
}
```

### 2. 业务特定事件处理器

```typescript
// 选择类组件
interface SelectionEventHandlers<T = any> {
  onSelect?: (value: T, event?: React.MouseEvent) => void
  onSelectionChange?: (selectedValues: T[]) => void
  onSelectAll?: (event?: React.MouseEvent) => void
  onSelectNone?: (event?: React.MouseEvent) => void
}

// 导航类组件
interface NavigationEventHandlers<T = any> {
  onNavigate?: (destination: T, event?: React.MouseEvent) => void
  onActiveChange?: (activeIndex: number) => void
  onTabChange?: (tabId: string, index: number) => void
}

// 覆盖层组件
interface OverlayEventHandlers {
  onOpen?: (event?: React.MouseEvent) => void
  onClose?: (event?: React.MouseEvent) => void
  onToggle?: (isOpen: boolean, event?: React.MouseEvent) => void
  onOutsideClick?: (event: React.MouseEvent) => void
  onEscapeKey?: (event: React.KeyboardEvent) => void
}
```

---

## 🎨 变体系统标准

### 1. Class Variance Authority (CVA) 模式

```typescript
import { cva, type VariantProps } from 'class-variance-authority'

// 标准变体配置
export const createComponentVariants = (config: {
  base: string
  variants?: {
    size?: Record<string, string>
    variant?: Record<string, string>
    state?: Record<string, string>
  }
  defaultVariants?: {
    size?: string
    variant?: string
  }
}) => {
  return cva(config.base, {
    variants: {
      size: config.variants?.size || {
        xs: 'text-xs px-2 py-1',
        sm: 'text-sm px-3 py-1.5',
        md: 'text-base px-4 py-2',
        lg: 'text-lg px-5 py-2.5',
        xl: 'text-xl px-6 py-3',
      },
      variant: config.variants?.variant || {
        primary: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
        success: 'bg-green-500 text-white hover:bg-green-600',
        warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
        danger: 'bg-red-500 text-white hover:bg-red-600',
        neutral: 'bg-gray-500 text-white hover:bg-gray-600',
      },
      state: config.variants?.state || {
        disabled: 'opacity-50 cursor-not-allowed',
        loading: 'opacity-75 cursor-wait',
        error: 'border-red-500',
      },
    },
    defaultVariants: {
      size: config.defaultVariants?.size || 'md',
      variant: config.defaultVariants?.variant || 'primary',
    },
  })
}
```

### 2. 变体使用示例

```typescript
// Button组件变体定义
const buttonVariants = createComponentVariants({
  base: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  variants: {
    variant: {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500',
      // 其他变体...
    },
    size: {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
    },
  },
})

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
            VariantProps<typeof buttonVariants> {
  loading?: boolean
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}
```

---

## 🏗️ 复合组件标准

### 1. 复合组件接口定义

```typescript
// 标准复合组件接口
export interface CompoundComponent<T = {}> extends React.FC<T> {
  // 标准子组件命名空间
  Header?: React.FC<any>
  Body?: React.FC<any>
  Footer?: React.FC<any>
  Item?: React.FC<any>
  Content?: React.FC<any>
  Title?: React.FC<any>
  Description?: React.FC<any>

  // 可扩展的子组件
  [key: string]: React.FC<any> | undefined
}

// 复合组件创建辅助函数
export const createCompoundComponent = <T extends Record<string, React.FC>>(
  components: T
): CompoundComponent & T => {
  const Root = React.forwardRef<HTMLDivElement, { children: React.ReactNode }>(
    ({ children, ...props }, ref) => (
      <div ref={ref} {...props}>
        {children}
      </div>
    )
  )

  Root.displayName = 'CompoundRoot'

  return Object.assign(Root, components) as CompoundComponent & T
}
```

### 2. 复合组件使用示例

```typescript
// Card复合组件
const Card = createCompoundComponent({
  Root: CardRoot,
  Header: CardHeader,
  Body: CardBody,
  Footer: CardFooter,
})

// 使用方式
<Card>
  <Card.Header>标题</Card.Header>
  <Card.Body>内容</Card.Body>
  <Card.Footer>
    <Button>操作</Button>
  </Card.Footer>
</Card>
```

---

## 🧪 测试Props标准

### 1. 测试标识符

```typescript
// 测试Props接口
interface TestProps {
  testId?: string
  'data-testid'?: string
  'data-component'?: string
  'data-variant'?: string
  'data-size'?: string
  'data-state'?: string
}

// 测试工具辅助函数
export const getTestProps = (name: string, props: Partial<TestProps> = {}) => ({
  'data-testid': props.testId || `${name}-test-id`,
  'data-component': name,
  'data-variant': props.variant,
  'data-size': props.size,
  'data-state': props.state,
})
```

### 2. 可访问性测试

```typescript
// 可访问性Props接口
interface AccessibilityProps {
  'aria-label'?: string
  'aria-labelledby'?: string
  'aria-describedby'?: string
  'aria-expanded'?: boolean
  'aria-pressed'?: boolean
  'aria-selected'?: boolean
  'aria-disabled'?: boolean
  'aria-required'?: boolean
  'aria-invalid'?: boolean
  'aria-live'?: 'polite' | 'assertive' | 'off'
  role?: string
  tabIndex?: number
}
```

---

## 📦 组件导出标准

### 1. 组件导出模式

```typescript
// 组件文件导出标准
export { Component, componentVariants } from './Component'
export type { ComponentProps } from './Component'

// index.ts文件导出标准
export * from './Button'
export * from './Input'
export * from './Card'

// 预设组件导出
export const ButtonGroup = { Root: ButtonGroupRoot, Item: ButtonGroupItem }
export const InputGroup = { Root: InputGroupRoot, Addon: InputGroupAddon }
```

### 2. 类型导出标准

```typescript
// 类型定义文件
export type {
  BaseComponentProps,
  InteractiveComponentProps,
  FormComponentProps,
  StandardSizes,
  StandardVariants,
  StandardStates,
  StyleExtensions,
} from './types'

// VariantProps类型
export type ButtonVariants = VariantProps<typeof buttonVariants>
export type InputVariants = VariantProps<typeof inputVariants>
```

---

## ✅ 组件开发检查清单

### API设计检查
- [ ] 继承正确的基础接口（BaseComponentProps, InteractiveComponentProps等）
- [ ] 使用标准的尺寸系统（xs, sm, md, lg, xl）
- [ ] 使用标准的变体系统（primary, secondary, success, warning, danger, neutral）
- [ ] 使用标准的Props命名规范
- [ ] 提供完整的TypeScript类型定义

### 可访问性检查
- [ ] 支持键盘导航（tabIndex, onKeyDown等）
- [ ] 提供适当的ARIA属性
- [ ] 支持屏幕阅读器
- [ ] 有合适的焦点指示器
- [ ] 颜色对比度符合WCAG标准

### 测试检查
- [ ] 提供testId或data-testid属性
- [ ] 支持自动化测试
- [ ] 包含可访问性测试
- [ ] 包含交互测试

### 文档检查
- [ ] 有完整的JSDoc注释
- [ ] 提供使用示例
- [ ] 说明Props用法
- [ ] 包含可访问性说明

---

## 🚀 迁移指南

### 从旧API迁移到新API

```typescript
// 旧API示例
interface OldButtonProps {
  type?: 'button' | 'submit'
  size?: 'small' | 'medium' | 'large'
  color?: 'blue' | 'green' | 'red'
  onClick?: (e: React.MouseEvent) => void
  disabled?: boolean
  loading?: boolean
}

// 新API示例
interface NewButtonProps extends InteractiveComponentProps {
  variant?: 'primary' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  onClick?: (event: React.MouseEvent) => void
}

// 迁移映射
const migrateProps = (oldProps: OldButtonProps): NewButtonProps => ({
  variant: oldProps.color === 'blue' ? 'primary' :
           oldProps.color === 'green' ? 'success' : 'danger',
  size: oldProps.size === 'small' ? 'sm' :
        oldProps.size === 'medium' ? 'md' : 'lg',
  disabled: oldProps.disabled,
  loading: oldProps.loading,
  onClick: oldProps.onClick,
})
```

---

## 📚 参考资源

- [React组件设计最佳实践](https://react.dev/learn/thinking-in-react)
- [ARIA设计模式](https://www.w3.org/WAI/ARIA/apg/)
- [TypeScript React组件类型](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS类变体](https://cva.style/docs/getting-started/introduction)

---

## 📝 更新日志

### v1.1 (2025-10-13)
- 初始版本发布
- 定义统一的API设计标准
- 建立变体系统规范
- 制定复合组件模式

---

**维护团队**: Xorigo UI 架构团队
**审核**: 技术委员会
**下次更新**: 2025年10月20日