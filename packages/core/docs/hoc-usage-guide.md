# HOC系统使用指南

## 快速开始

### 基础用法

```typescript
import React from 'react'
import { withTheme, withVariant, withSize, compose } from '@xorigo/hoc'

// 1. 单个HOC使用
const ThemedButton = withTheme({ mode: 'dark' })(Button)

// 2. 多HOC组合
const EnhancedButton = compose([
  withTheme({ mode: 'dark' }),
  withVariant('primary'),
  withSize('md')
])(Button)

// 3. 快捷组合
const ButtonComponent = createButtonComponent(Button)
```

## 实际应用场景

### 场景1：创建可复用的表单组件

```typescript
import React from 'react'
import { createFormComponent, withField, withValidation } from '@xorigo/hoc'

// 定义表单字段组件
const FormField = withField({
  name: 'email',
  label: '邮箱地址',
  helperText: '请输入有效的邮箱地址',
  required: true
})(Input)

// 创建完整表单
const ContactForm = createFormComponent(({ form }) => (
  <form onSubmit={form.handleSubmit}>
    <FormField
      name="email"
      validation={{
        pattern: {
          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
          message: '请输入有效邮箱'
        }
      }}
    />
    <button type="submit" disabled={form.isSubmitting}>
      {form.isSubmitting ? '提交中...' : '提交'}
    </button>
  </form>
))

// 使用
function App() {
  return (
    <ContactForm
      initialValues={{ email: '' }}
      onSubmit={async (values) => {
        console.log('Form submitted:', values)
      }}
    />
  )
}
```

### 场景2：创建响应式导航组件

```typescript
import React from 'react'
import { withMediaQuery, withClickOutside } from '@xorigo/hoc'

const ResponsiveNav = compose([
  withMediaQuery({
    query: '(max-width: 768px)',
    onMatch: () => setIsMobile(true),
    onUnmatch: () => setIsMobile(false)
  }),
  withClickOutside({
    onClickOutside: () => setIsOpen(false),
    excludeSelectors: ['.nav-toggle']
  })
])(({ isMobile, isOpen, setIsOpen }) => (
  <nav className={isMobile ? 'mobile-nav' : 'desktop-nav'}>
    <button
      className="nav-toggle"
      onClick={() => setIsOpen(!isOpen)}
    >
      Menu
    </button>
    <ul className={isOpen ? 'open' : 'closed'}>
      <li><a href="/">首页</a></li>
      <li><a href="/about">关于</a></li>
      <li><a href="/contact">联系</a></li>
    </ul>
  </nav>
))
```

### 场景3：创建可拖拽的卡片组件

```typescript
import React from 'react'
import { withGestures, withAnimate, withState } from '@xorigo/hoc'

const DraggableCard = compose([
  withState({
    initialState: {
      position: { x: 0, y: 0 },
      isDragging: false
    }
  }),
  withGestures({
    drag: true,
    dragConstraints: {
      top: -200,
      bottom: 200,
      left: -200,
      right: 200
    },
    onDragStart: () => console.log('开始拖拽'),
    onDrag: (delta) => {
      // 更新位置
    },
    onDragEnd: () => console.log('结束拖拽')
  }),
  withAnimate({
    variants: {
      idle: { scale: 1, rotate: 0 },
      dragging: { scale: 1.05, rotate: 2 }
    }
  })
])(({ position, isDragging }) => (
  <div
    className={`card ${isDragging ? 'dragging' : 'idle'}`}
    style={{
      transform: `translate(${position.x}px, ${position.y}px)`
    }}
  >
    <h3>可拖拽卡片</h3>
    <p>拖拽此卡片到任意位置</p>
  </div>
))
```

### 场景4：创建模态框组件

```typescript
import React from 'react'
import { withPortal, withTransition, withClickOutside } from '@xorigo/hoc'

const Modal = compose([
  withPortal({
    containerId: 'modal-root',
    enabled: true,
    ssr: false
  }),
  withTransition({
    initial: { opacity: 0, scale: 0.9 },
    enter: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
    animateOnMount: false
  }),
  withClickOutside({
    onClickOutside: () => onClose(),
    excludeSelectors: ['.modal-content']
  })
])(({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  )
})
```

### 场景5：创建无限滚动列表

```typescript
import React, { useState, useEffect } from 'react'
import { withIntersectionObserver, withState, withLoading } from '@xorigo/hoc'

const InfiniteScrollList = compose([
  withState({
    initialState: {
      items: [],
      hasMore: true,
      page: 1
    }
  }),
  withIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px',
    onIntersect: async (entry) => {
      if (entry.isIntersecting && state.hasMore && !state.isLoading) {
        // 加载更多数据
        await loadMore()
      }
    }
  }),
  withLoading({
    initialLoading: false,
    showDelay: 300,
    overlay: false
  })
])(({ items, hasMore, isLoading, loadMore }) => (
  <div className="infinite-list">
    {items.map(item => (
      <div key={item.id} className="list-item">
        {item.content}
      </div>
    ))}
    {isLoading && <div className="loading">加载中...</div>}
    {hasMore && <div ref={loadMore}>加载更多</div>}
  </div>
))
```

### 场景6：创建主题切换器

```typescript
import React from 'react'
import { withTheme, withVariant } from '@xorigo/hoc'

const ThemeToggle = compose([
  withTheme({
    mode: 'system',
    enableSystemTheme: true
  }),
  withVariant({
    defaultVariant: 'outline',
    variants: {
      dark: {
        className: 'dark-theme-toggle'
      },
      light: {
        className: 'light-theme-toggle'
      }
    }
  })
])(({ isDarkMode, toggleTheme, currentVariant }) => (
  <button
    className={`theme-toggle ${currentVariant}`}
    onClick={toggleTheme}
    aria-label={isDarkMode ? '切换到浅色主题' : '切换到深色主题'}
  >
    {isDarkMode ? '☀️' : '🌙'}
  </button>
))
```

## 高级技巧

### 1. 条件性HOC应用

```typescript
const EnhancedComponent = compose([
  withTheme(),
  when(() => process.env.NODE_ENV === 'development')(
    withDebugOverlay()
  ),
  when((props) => props.isAdmin)(
    withAdminFeatures()
  )
])(Component)
```

### 2. 自定义HOC组合

```typescript
// 创建自定义HOC组合
const createEnhancedComponent = (config) => compose([
  withTheme(config.theme),
  withVariant(config.variant),
  withSize(config.size),
  ...config.additionalHOCs
])

// 使用
const EnhancedButton = createEnhancedComponent({
  theme: { mode: 'dark' },
  variant: 'primary',
  size: 'lg',
  additionalHOCs: [
    withLoading(),
    withAccessibility()
  ]
})(Button)
```

### 3. 链式调用

```typescript
import { withChain } from '@xorigo/hoc'

const ChainComponent = withChain({
  autoExpose: true,
  exposeRules: {
    include: ['focus', 'blur', 'click', 'reset']
  }
})(Component)

// 使用链式调用
const chain = useChainInstance(componentRef)

chain
  .chain('focus')
  .wait(1000, 'click')
  .chain('reset')
```

### 4. 性能优化组合

```typescript
const OptimizedComponent = compose([
  withResizeObserver({
    debounceMs: 100,
    onResizeEnd: (entry) => {
      // 响应式处理
    }
  }),
  withIntersectionObserver({
    threshold: 0.1,
    onEnter: () => {
      // 懒加载
    }
  }),
  withMediaQuery({
    query: '(min-width: 768px)',
    debounceMs: 100
  })
])(Component)
```

### 5. 表单验证组合

```typescript
const ValidatedForm = compose([
  withForm({
    validateOnChange: true,
    validateOnBlur: true,
    validationDebounce: 300
  }),
  withAsyncValidation({
    validator: async (email) => {
      const response = await fetch(`/api/check-email/${email}`)
      const result = await response.json()
      return result.available || '邮箱已被使用'
    },
    delay: 500,
    cacheResults: true
  }),
  withSubmit({
    preventDoubleSubmit: true,
    retryOnError: true,
    maxRetries: 3
  })
])(FormComponent)
```

## 性能最佳实践

### 1. 合理使用HOC

```typescript
// ❌ 不推荐：过度使用HOC
const OverEnhancedComponent = compose([
  withTheme(),
  withVariant(),
  withSize(),
  withState(),
  withValidation(),
  withAccessibility(),
  withLoading(),
  withErrorBoundary(),
  withClickOutside(),
  withResizeObserver(),
  withIntersectionObserver(),
  withMediaQuery(),
  withDebounce(),
  withThrottle(),
  withPortal(),
  withAnimate(),
  withTransition(),
  withGestures(),
  withPageTransition()
])(Component)

// ✅ 推荐：按需使用HOC
const OptimizedComponent = compose([
  withTheme(),
  withVariant(),
  withSize()
])(Component)
```

### 2. 启用React.memo

```typescript
const EnhancedComponent = compose([
  withTheme(),
  withVariant()
], {
  enableMemo: true,
  debug: false  // 生产环境关闭调试
})(Component)
```

### 3. 使用防抖和节流

```typescript
const OptimizedSearch = compose([
  withDebounce({
    delay: 300,
    callback: (query) => searchAPI(query)
  }),
  withThrottle({
    interval: 100,
    callback: (event) => handleScroll(event)
  })
])(SearchComponent)
```

### 4. 避免重复渲染

```typescript
const StableComponent = React.memo(
  compose([
    withTheme(),
    withVariant()
  ])(Component),
  (prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps)
  }
)
```

## 调试技巧

### 1. 启用调试模式

```typescript
const DebugComponent = compose([
  withTheme()
], {
  debug: true,
  displayName: 'DebugComponent'
})(Component)
```

### 2. 使用displayName

```typescript
const NamedComponent = withDisplayName({
  prefix: 'Enhanced',
  separator: ' → '
})(Component)

console.log(NamedComponent.displayName)
// 输出: "Enhanced → BaseComponent"
```

### 3. 监控性能

```typescript
const PerformanceMonitoredComponent = compose([
  withState({
    initialState: { renderCount: 0 }
  }),
  withAnimate()
])(({ state, setState }) => {
  // 增加渲染计数
  setState(prev => ({ ...prev, renderCount: prev.renderCount + 1 }))

  return <Component />
})
```

## 常见错误避免

### 1. HOC嵌套层级过深

```typescript
// ❌ 错误：HOC嵌套层级过深
const DeeplyNestedComponent = withTheme(
  withVariant(
    withSize(
      withState(
        withValidation(Component)
      )
    )
  )
)

// ✅ 正确：使用compose
const CleanComponent = compose([
  withTheme(),
  withVariant(),
  withSize(),
  withState(),
  withValidation()
])(Component)
```

### 2. 忘记传递props

```typescript
// ❌ 错误：props未正确传递
const BrokenComponent = withTheme()(Component)

// ❌ 错误：手动传递所有props
const ManualComponent = withTheme()(({ theme, ...props }) => (
  <Component {...props} />
))

// ✅ 正确：HOC自动处理props传递
const WorkingComponent = withTheme()(Component)
```

### 3. 不当的状态管理

```typescript
// ❌ 错误：在组件内部创建状态
const BadComponent = () => {
  const [state, setState] = useState({})
  return withState()(Component)
}

// ✅ 正确：使用withState HOC
const GoodComponent = withState()(Component)
```

### 4. 忽略错误边界

```typescript
// ❌ 错误：没有错误边界
const UnsafeComponent = compose([
  withTheme(),
  withVariant()
])(UnreliableComponent)

// ✅ 正确：添加错误边界
const SafeComponent = compose([
  withTheme(),
  withVariant(),
  withErrorBoundary({
    fallback: ({ error }) => <ErrorFallback error={error} />
  })
])(UnreliableComponent)
```

## 测试策略

### 1. 单元测试HOC

```typescript
import { render, screen } from '@testing-library/react'
import { withTheme } from '@xorigo/hoc'

const BaseComponent = ({ theme }) => (
  <div data-testid="themed">{theme.mode}</div>
)

const ThemedComponent = withTheme({ mode: 'dark' })(BaseComponent)

test('should provide theme', () => {
  render(<ThemedComponent />)
  expect(screen.getByTestId('themed')).toHaveTextContent('dark')
})
```

### 2. 集成测试

```typescript
import { fireEvent, waitFor } from '@testing-library/react'
import { createFormComponent } from '@xorigo/hoc'

const MockForm = ({ form }) => (
  <form onSubmit={form.handleSubmit}>
    <input name="email" {...form.getFieldProps('email')} />
    <button type="submit">Submit</button>
  </form>
)

test('should handle form submission', async () => {
  const onSubmit = vi.fn()
  const FormComponent = createFormComponent(MockForm)

  render(<FormComponent onSubmit={onSubmit} />)

  fireEvent.click(screen.getByText('Submit'))

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled()
  })
})
```

### 3. 性能测试

```typescript
import { render } from '@testing-library/react'
import { compose } from '@xorigo/hoc'

test('should not cause unnecessary re-renders', () => {
  const EnhancedComponent = compose([
    withTheme(),
    withVariant(),
    withSize()
  ])(Component)

  const { rerender } = render(<EnhancedComponent />)

  // 重新渲染，props未变化
  rerender(<EnhancedComponent />)

  // 验证没有不必要的渲染
  expect(screen.getByTestId('component')).toBeInTheDocument()
})
```

## 更多资源

- [API参考文档](./hoc-api-reference.md)
- [最佳实践](./hoc-best-practices.md)
- [性能优化指南](./hoc-performance.md)
- [无障碍指南](./hoc-accessibility.md)
- [故障排除](./hoc-troubleshooting.md)

---

开始使用Xorigo UI HOC系统，让你的React组件更加强大！
