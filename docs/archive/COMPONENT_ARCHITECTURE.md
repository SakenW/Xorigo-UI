# TH-UI 组件架构文档

## 概述

TH-UI 是一个现代化的 React 组件库，基于 React 19、TypeScript 5.9、Tailwind CSS 3 和 Framer Motion 12 构建。本文档详细说明了 TH-UI 的组件架构设计原则和最佳实践。

## 架构层次

### 1. 原子层 (Atoms)
最基础的 UI 构建块，不可再分的功能单元。

**组件示例**：
- `Button` - 按钮组件
- `Input` - 输入框组件
- `Icon` - 图标组件
- `Badge` - 徽标组件

**设计原则**：
- 单一职责，功能明确
- 高度可复用
- 上下文无关
- 最小化内部状态

### 2. 分子层 (Molecules)
原子的简单组合，具备基础交互功能。

**组件示例**：
- `SearchInput` - 搜索输入框
- `UserAvatar` - 用户头像
- `FormInput` - 表单输入项
- `NavigationItem` - 导航项

**设计原则**：
- 组合原子组件
- 具备基础交互逻辑
- 保持相对简单的内部状态
- 遵循可组合性原则

### 3. 生物体层 (Organisms)
复杂的组件组合，业务逻辑的载体。

**组件示例**：
- `DataTable` - 数据表格
- `Header` - 页面头部
- `Sidebar` - 侧边栏
- `Modal` - 模态框

**设计原则**：
- 复杂的内部状态和交互逻辑
- 承载业务逻辑
- 集成多个分子组件
- 提供完整的用户体验

### 4. 模板层 (Templates)
页面布局模板，定义页面结构和内容排列。

**组件示例**：
- `ResponsiveLayout` - 响应式布局
- `AdminLayout` - 管理后台布局
- `AuthLayout` - 认证页面布局

### 5. 页面层 (Pages)
完整的业务页面，集成所有组件层级。

**组件示例**：
- `LoginPage` - 登录页面
- `DashboardPage` - 仪表板页面
- `SettingsPage` - 设置页面

## 组件设计原则

### 1. 原子化设计 (Atomic Design)

#### 单一职责原则
```typescript
// ✅ 好的设计 - 职责单一
const Button = ({ variant, size, children, ...props }) => {
  // 只负责按钮的渲染和交互
}

// ❌ 避免 - 职责过多
const ButtonWithForm = ({ onSubmit, formData, ...props }) => {
  // 按钮不应该包含表单逻辑
}
```

#### 可组合性优先
```typescript
// ✅ 好的设计 - 可组合
const Card = ({ children, className, ...props }) => {
  return <div className={cn('card', className)} {...props}>{children}</div>
}

const CardHeader = ({ children }) => <div className="card-header">{children}</div>
const CardContent = ({ children }) => <div className="card-content">{children}</div>

// 使用
<Card>
  <CardHeader>标题</CardHeader>
  <CardContent>内容</CardContent>
</Card>
```

### 2. API 设计一致性

#### 标准化 Props
```typescript
// ✅ 标准组件 API
interface ComponentProps extends BaseComponentProps, ComponentVariants {
  variant?: 'primary' | 'secondary' | 'outline-solid'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  children?: React.ReactNode
  disabled?: boolean
  onClick?: (event: Event) => void
}
```

#### 命名规范
- **布尔值**：使用 `is/has/should` 前缀
- **事件处理器**：使用 `on` 前缀
- **回调函数**：使用 `handle` 前缀
- **组件名称**：使用 PascalCase

### 3. 主题系统集成

#### 设计令牌使用
```typescript
// ✅ 使用主题令牌
const buttonStyles = cva({
  base: {
    backgroundColor: 'var(--color-primary-500)',
    color: 'var(--color-text-on-primary)',
    transition: 'all var(--transition-fast)',
  },
  variants: {
    variant: {
      primary: {
        backgroundColor: 'var(--color-primary-500)',
      },
      secondary: {
        backgroundColor: 'var(--color-secondary-500)',
      }
    }
  }
})
```

#### 响应式设计
```typescript
// ✅ 响应式变体
const responsiveStyles = tv({
  base: 'px-4 py-2',
  variants: {
    size: {
      sm: 'text-sm px-3 py-1.5',
      md: 'text-base px-4 py-2',
      lg: 'text-lg px-6 py-3',
    }
  }
})
```

### 4. TypeScript 类型安全

#### 完整的类型定义
```typescript
// ✅ 完整的 Props 类型
interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}
```

#### 泛型设计
```typescript
// ✅ 灵活的泛型组件
interface TableProps<T = any> {
  dataSource: T[]
  columns: TableColumnProps<T>[]
  rowKey?: keyof T
}

const Table = <T extends Record<string, any>>({ ...props }: TableProps<T>) => {
  // 实现
}
```

### 5. 可访问性 (A11y)

#### ARIA 属性
```typescript
// ✅ 完整的 ARIA 支持
const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  disabled,
  'aria-label': ariaLabel,
  'aria-describedby': ariaDescribedBy,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      role="button"
      {...props}
    >
      {children}
    </button>
  )
})
```

#### 键盘导航
```typescript
// ✅ 键盘事件处理
const handleKeyDown = (event: React.KeyboardEvent) => {
  switch (event.key) {
    case 'Enter':
    case ' ':
      event.preventDefault()
      handleClick()
      break
    case 'Escape':
      handleCancel()
      break
  }
}
```

## 组件分类

### 核心组件 (Core)
基础功能组件，构成 UI 的基础。

- **Button** - 按钮组件
- **Input** - 输入框组件
- **Card** - 卡片组件
- **Select** - 选择器组件
- **Checkbox** - 复选框组件

### 反馈组件 (Feedback)
用户操作反馈组件。

- **Modal** - 模态框
- **Alert** - 警告提示
- **Loading** - 加载指示器
- **Notification** - 通知消息
- **Toast** - 轻提示
- **Progress** - 进度条
- **Skeleton** - 骨架屏

### 表单组件 (Form)
表单相关组件。

- **Radio** - 单选框
- **Textarea** - 多行文本框
- **DatePicker** - 日期选择器
- **Form** - 表单容器

### 导航组件 (Navigation)
导航和路由相关组件。

- **Breadcrumb** - 面包屑
- **Header** - 页面头部
- **Sidebar** - 侧边栏
- **Tabs** - 标签页
- **Pagination** - 分页

### 布局组件 (Layout)
页面布局相关组件。

- **ResponsiveLayout** - 响应式布局
- **Grid** - 网格布局
- **Container** - 容器
- **Spacer** - 间距组件

### Radix UI 组件
基于 Radix UI 的高级组件。

- **Accordion** - 手风琴
- **DropdownMenu** - 下拉菜单
- **Dialog** - 对话框
- **Toast** - 轻提示 (增强版)

### 业务组件 (Blocks)
复合业务组件，用于特定场景。

- **Pricing** - 定价表
- **Hero** - 首页横幅
- **Features** - 特性展示
- **Footer** - 页面底部

## 状态管理

### 1. 内部状态
组件内部维护的状态，通常使用 `useState` 和 `useReducer`。

```typescript
const [isOpen, setIsOpen] = useState(false)
const [selectedValue, setSelectedValue] = useState<string | null>(null)
```

### 2. Context 状态
跨组件共享的状态，使用 React Context API。

```typescript
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

const ThemeProvider = ({ children, value }) => {
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
```

### 3. 外部状态
通过 Props 传递的状态，由父组件控制。

```typescript
interface ControlledComponentProps {
  value: string
  onChange: (value: string) => void
}
```

## 动画系统

### Framer Motion 集成
所有动画效果基于 Framer Motion 实现。

#### 基础动画
```typescript
const AnimatedComponent = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
)
```

#### 动画变体
```typescript
const variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
}

const Modal = ({ isOpen, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
)
```

### 动画原则
1. **一致性** - 所有动画使用相同的缓动函数和时长
2. **有意义** - 动画要有明确的目的，不是装饰性的
3. **性能** - 使用 transform 和 opacity 进行动画
4. **可配置** - 提供动画配置选项

## 主题系统

### 设计令牌
基于 CSS 自定义属性的主题系统。

```css
:root {
  --color-primary-50: #eff6ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;

  --transition-fast: 150ms;
  --transition-normal: 200ms;
  --transition-slow: 300ms;
}
```

### 主题切换
支持亮暗主题切换。

```typescript
const ThemeProvider = ({ children, theme = 'light' }) => {
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return <>{children}</>
}
```

## 测试策略

### 单元测试
每个组件都应有对应的单元测试。

```typescript
describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
```

### 可访问性测试
使用 axe-core 进行可访问性测试。

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

expect.extend(toHaveNoViolations)

it('should be accessible', async () => {
  const { container } = render(<Button>Click me</Button>)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

## 构建优化

### Tree Shaking
支持按需导入，减少打包体积。

```typescript
// 按需导入
import { Button } from '@th-ui/core'

// 全量导入
import * as THUI from '@th-ui/core'
```

### 代码分割
使用动态导入进行代码分割。

```typescript
const LazyComponent = React.lazy(() => import('./HeavyComponent'))

<Suspense fallback={<Loading />}>
  <LazyComponent />
</Suspense>
```

## 性能优化

### React.memo
对纯组件使用 React.memo 进行优化。

```typescript
const OptimizedComponent = React.memo(({ data }) => {
  return <div>{data.value}</div>
})
```

### useCallback 和 useMemo
对函数和计算结果进行缓存。

```typescript
const handleClick = useCallback((id: string) => {
  onItemClick(id)
}, [onItemClick])

const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data)
}, [data])
```

### 虚拟滚动
对于长列表组件，实现虚拟滚动。

```typescript
const VirtualList = ({ items, itemHeight, containerHeight }) => {
  // 虚拟滚动实现
}
```

## 国际化支持

### 文本处理
支持多语言文本。

```typescript
interface I18nTextProps {
  i18nKey: string
  values?: Record<string, any>
}

const I18nText = ({ i18nKey, values }) => {
  const text = useTranslation(i18nKey, values)
  return <>{text}</>
}
```

### 格式化
提供本地化格式化工具。

```typescript
import { formatNumber, formatCurrency } from '@th-ui/utils'

formatNumber(1234.56) // '1,234.56'
formatCurrency(1234.56, 'CNY') // '¥1,234.56'
```

## 贡献指南

### 组件开发流程
1. **设计令牌定义** - 在 `/src/tokens` 中定义相关设计令牌
2. **组件实现** - 在 `/src/components` 中实现组件
3. **类型定义** - 确保完整的 TypeScript 类型支持
4. **主题集成** - 验证在10种主题下的表现
5. **测试编写** - 在 `/tests` 中编写单元测试
6. **文档更新** - 更新组件使用文档

### 代码规范
- 使用 TypeScript 进行开发
- 遵循 ESLint 和 Prettier 配置
- 组件必须有完整的 JSDoc 注释
- 所有 Props 必须有类型定义和默认值

### 提交规范
```
feat: 新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建工具或辅助工具的变动
```

## 版本管理

### 语义化版本
遵循 SemVer 规范：
- **主版本号** - 不兼容的 API 修改
- **次版本号** - 向下兼容的功能性新增
- **修订号** - 向下兼容的问题修正

### 更新日志
每个版本都有详细的更新日志，包括：
- 新增功能
- 修复问题
- 破坏性变更
- 迁移指南

## 总结

TH-UI 组件架构基于现代 React 生态最佳实践，通过原子化设计、一致性 API、主题系统集成、TypeScript 类型安全和可访问性支持，为开发者提供了一个高质量、易用、可扩展的组件库解决方案。