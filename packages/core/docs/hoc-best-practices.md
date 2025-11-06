# HOC系统最佳实践

## 设计原则

### 1. 组合优于继承

遵循React的设计哲学，优先使用组合而非继承：

```typescript
// ✅ 推荐：使用组合
const EnhancedComponent = compose([
  withTheme(),
  withVariant(),
  withSize()
])(Component)

// ❌ 避免：继承
class EnhancedComponent extends Component {
  render() {
    return <Component {...this.props} />
  }
}
```

### 2. 单一职责原则

每个HOC应该只负责一个功能：

```typescript
// ✅ 推荐：单一职责
const ThemedComponent = withTheme({ mode: 'dark' })(Component)
const SizedComponent = withSize({ defaultSize: 'md' })(Component)

// ❌ 避免：多功能混合
const MultiFeatureHOC = (config) => (Component) => {
  // 主题、尺寸、状态、验证... 太多功能
}
```

### 3. 可预测性

HOC的行为应该可预测，避免副作用：

```typescript
// ✅ 推荐：可预测的HOC
const StatefulComponent = withState({
  initialState: { count: 0 },
  persistKey: 'count'  // 明确指定持久化
})(Component)

// ❌ 避免：隐式副作用
const UnpredictableHOC = (Component) => {
  // 偷偷修改window对象或全局状态
}
```

### 4. 无副作用

HOC不应该产生副作用：

```typescript
// ✅ 推荐：无副作用
const PureHOC = (config) => (Component) => {
  return React.forwardRef((props, ref) => {
    // 只处理props和render
    return <Component ref={ref} {...props} />
  })
}

// ❌ 避免：有副作用
const SideEffectHOC = (Component) => {
  useEffect(() => {
    // 在HOC中使用useEffect会产生副作用
    console.log('HOC mounted')
  }, [])

  return Component
}
```

## 性能优化

### 1. 合理使用React.memo

```typescript
// ✅ 推荐：启用memo
const EnhancedComponent = compose([
  withTheme(),
  withVariant()
], {
  enableMemo: true
})(Component)

// ✅ 推荐：自定义比较函数
const MemoizedComponent = React.memo(
  compose([
    withTheme()
  ])(Component),
  (prevProps, nextProps) => {
    return JSON.stringify(prevProps) === JSON.stringify(nextProps)
  }
)
```

### 2. 避免重复渲染

```typescript
// ✅ 推荐：使用useCallback缓存函数
const OptimizedComponent = withState({
  initialState: { counter: 0 }
})(({ state, actions, ...props }) => {
  const handleClick = useCallback(() => {
    actions.increment('counter')
  }, [actions])

  return <Button onClick={handleClick} {...props} />
})

// ❌ 避免：每次渲染创建新函数
const UnoptimizedComponent = withState()(({ state, actions, ...props }) => {
  return (
    <Button
      onClick={() => actions.increment('counter')} // 新函数每次渲染
      {...props}
    />
  )
})
```

### 3. 使用防抖和节流

```typescript
// ✅ 推荐：防抖高频操作
const DebouncedSearch = withDebounce({
  delay: 300,
  callback: (query) => searchAPI(query)
})(SearchComponent)

// ✅ 推荐：节流滚动事件
const ThrottledScroll = withThrottle({
  interval: 100,
  callback: (event) => handleScroll(event)
})(ScrollHandler)
```

### 4. 懒加载HOC

```typescript
// ✅ 推荐：按需加载HOC
const LazyTheme = lazy(() => import('./withTheme'))

const LazyEnhancedComponent = ({ shouldLoadTheme, ...props }) => {
  const [EnhancedComponent, setEnhancedComponent] = useState(null)

  useEffect(() => {
    if (shouldLoadTheme && !EnhancedComponent) {
      LazyTheme().then(HOC => {
        const Enhanced = HOC.default(Component)
        setEnhancedComponent(() => Enhanced)
      })
    }
  }, [shouldLoadTheme])

  if (!EnhancedComponent) return <div>Loading...</div>

  return <EnhancedComponent {...props} />
}
```

## 类型安全

### 1. 泛型约束

```typescript
// ✅ 推荐：使用泛型
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

const EnhancedButton = withVariant<ButtonProps>({
  defaultVariant: 'primary'
})(ButtonComponent)

// ✅ 推荐：类型推断
type EnhancedButtonProps = ComponentProps<typeof EnhancedButton>

const MyButton: React.FC<EnhancedButtonProps> = (props) => {
  // props已经包含所有增强后的属性
  return <EnhancedButton {...props} />
}
```

### 2. 严格类型检查

```typescript
// ✅ 推荐：严格模式
interface StrictComponentProps {
  id: string
  label: string
  value: string
  onChange: (value: string) => void
}

const StrictComponent = withValidation<StrictComponentProps>({
  rules: {
    required: true,
    minLength: { value: 3 }
  }
})(BaseComponent)

// ❌ 避免：宽松类型
const LooseComponent = withValidation()(BaseComponent)
```

### 3. 可选属性处理

```typescript
// ✅ 推荐：明确的可选属性
interface OptionalProps {
  requiredProp: string
  optionalProp?: string
  defaultValue?: number
}

const OptionalComponent = withState<OptionalProps>({
  initialState: {
    defaultValue: 0
  }
})(({ requiredProp, optionalProp, defaultValue, state }) => {
  return <div>{requiredProp} {optionalProp} {defaultValue} {state.defaultValue}</div>
})
```

## 无障碍支持

### 1. 基础无障碍

```typescript
// ✅ 推荐：基础无障碍
const AccessibleButton = withAccessibility({
  role: 'button',
  ariaLabel: '提交表单',
  tabIndex: 0,
  keyboardNavigation: true
})(Button)

// ✅ 推荐：动态无障碍
const DynamicAccessible = withAccessibility(({ isExpanded }) => ({
  role: 'button',
  ariaExpanded: isExpanded,
  ariaControls: 'dropdown-menu'
}))(Dropdown)
```

### 2. 焦点管理

```typescript
// ✅ 推荐：焦点陷阱
const Modal = withAccessibility({
  role: 'dialog',
  ariaModal: true,
  enableFocusTrap: true,
  focusOnMount: true
})(ModalComponent)

// ✅ 推荐：键盘导航
const Menu = withAccessibility({
  role: 'menu',
  keyboardNavigation: true,
  onKeyDown: (event) => {
    switch(event.key) {
      case 'ArrowDown':
        focusNext()
        break
      case 'ArrowUp':
        focusPrevious()
        break
      case 'Enter':
      case ' ':
        selectItem()
        break
    }
  }
})(MenuComponent)
```

### 3. 屏幕阅读器支持

```typescript
// ✅ 推荐：实时公告
const AnnounceComponent = withAccessibility()(({ announce }) => {
  const handleAction = () => {
    announce('操作成功完成', 'polite')
  }

  return <Button onClick={handleAction}>执行操作</Button>
})

// ✅ 推荐：状态公告
const StatusComponent = withAccessibility()(({ isLoading, announce }) => {
  useEffect(() => {
    if (isLoading) {
      announce('正在加载数据', 'assertive')
    } else {
      announce('数据加载完成', 'polite')
    }
  }, [isLoading])

  return <div>{isLoading ? '加载中...' : '完成'}</div>
})
```

## 错误处理

### 1. 错误边界

```typescript
// ✅ 推荐：错误边界
const SafeComponent = withErrorBoundary({
  fallback: ({ error, resetError }) => (
    <div className="error-fallback">
      <h2>出现错误</h2>
      <p>{error.message}</p>
      <button onClick={resetError}>重试</button>
    </div>
  ),
  onError: (error, errorInfo) => {
    // 记录错误
    console.error('Component error:', error, errorInfo)
    // 发送错误报告
    errorReporting.captureException(error)
  }
})(UnreliableComponent)
```

### 2. 优雅降级

```typescript
// ✅ 推荐：优雅降级
const ResilientComponent = compose([
  withResizeObserver({
    fallback: 'MutationObserver' // 提供fallback
  }),
  withIntersectionObserver({
    fallback: 'Scroll event' // 提供fallback
  })
])(Component)

// ❌ 避免：硬依赖
const FragileComponent = withResizeObserver()({
  onResize: (entry) => {
    // 没有fallback，可能崩溃
  }
})(Component)
```

### 3. 错误恢复

```typescript
// ✅ 推荐：自动重试
const RetryComponent = withErrorBoundary({
  onReset: () => {
    // 清理错误状态
    resetErrorState()
    // 重新初始化组件
    reinitialize()
  }
})(UnreliableComponent)

// ✅ 推荐：手动恢复
const ManualRecoveryComponent = withErrorBoundary({
  fallback: ({ error, resetError }) => (
    <div>
      <p>错误: {error.message}</p>
      <button onClick={resetError}>恢复</button>
      <button onClick={() => window.location.reload()}>刷新页面</button>
    </div>
  )
})(Component)
```

## 测试策略

### 1. 单元测试

```typescript
// ✅ 推荐：测试HOC
import { render, screen, fireEvent } from '@testing-library/react'
import { withTheme } from '@xorigo/hoc'

const BaseComponent = ({ theme }) => (
  <div data-testid="theme-mode">{theme.mode}</div>
)

const ThemedComponent = withTheme({ mode: 'dark' })(BaseComponent)

test('should apply theme', () => {
  render(<ThemedComponent />)
  expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')
})

// ✅ 推荐：测试HOC组合
test('should compose multiple HOCs', () => {
  const EnhancedComponent = compose([
    withTheme({ mode: 'light' }),
    withVariant('primary'),
    withSize('md')
  ])(BaseComponent)

  render(<EnhancedComponent />)
  // 断言...
})
```

### 2. 集成测试

```typescript
// ✅ 推荐：测试交互
test('should handle form submission', async () => {
  const onSubmit = vi.fn()
  const FormComponent = createFormComponent(MockForm)

  render(<FormComponent onSubmit={onSubmit} />)

  fireEvent.click(screen.getByText('Submit'))

  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled()
  })
})

// ✅ 推荐：测试异步操作
test('should handle async validation', async () => {
  const validator = vi.fn().mockResolvedValue(true)
  const ValidatedComponent = withAsyncValidation({
    validator,
    delay: 100
  })(Input)

  render(<ValidatedComponent value="test@example.com" />)

  await waitFor(() => {
    expect(validator).toHaveBeenCalledWith('test@example.com')
  })
})
```

### 3. 性能测试

```typescript
// ✅ 推荐：测试渲染性能
import { renderTimes } from '@testing-library/react'

test('should not cause excessive re-renders', () => {
  const EnhancedComponent = compose([
    withTheme(),
    withVariant()
  ])(Component)

  const { render } = renderTimes(<EnhancedComponent />)

  expect(render.count).toBeLessThan(5) // 限制渲染次数
})

// ✅ 推荐：测试内存泄漏
test('should not leak memory', () => {
  const EnhancedComponent = withTheme()(Component)

  const { unmount } = render(<EnhancedComponent />)

  unmount()

  // 验证没有内存泄漏
  expect(window.memoryLeaks).toBeUndefined()
})
```

## 可维护性

### 1. 命名规范

```typescript
// ✅ 推荐：清晰的命名
const ButtonWithTheme = withTheme()(Button)
const ButtonWithVariant = withVariant()(Button)
const PrimaryButton = withVariant({ defaultVariant: 'primary' })(Button)

// ❌ 避免：无意义命名
const HOC1 = withTheme()(Button)
const HOC2 = withVariant()(Button)
```

### 2. 文档化

```typescript
// ✅ 推荐：详细的JSDoc
/**
 * 为按钮组件添加主题支持
 *
 * @param config 主题配置
 * @param config.mode 主题模式 (light|dark|system)
 * @param config.colorScheme 色彩方案
 * @returns 增强后的按钮组件
 *
 * @example
 * ```tsx
 * const ThemedButton = withTheme({
 *   mode: 'dark',
 *   colorScheme: 'primary'
 * })(Button)
 * ```
 */
function withTheme(config: ThemeConfig): HOC
```

### 3. 配置分离

```typescript
// ✅ 推荐：配置外置
// theme.config.ts
export const lightThemeConfig = {
  mode: 'light' as const,
  colorScheme: 'primary' as const,
}

// button.config.ts
export const buttonEnhancers = [
  withTheme(lightThemeConfig),
  withVariant('primary'),
  withSize('md')
]

// 使用
const Button = compose(buttonEnhancers)(BaseButton)

// ❌ 避免：配置内联
const InlineButton = compose([
  withTheme({ mode: 'light', colorScheme: 'primary' }),
  withVariant('primary'),
  withSize('md')
])(BaseButton)
```

### 4. 版本控制

```typescript
// ✅ 推荐：版本标记
const VersionedHOC = withTheme

// 在文档中标记版本
/**
 * @since v1.0.0
 * @version 1.2.0 添加了 colorScheme 支持
 */
```

## 安全性

### 1. 输入验证

```typescript
// ✅ 推荐：验证输入
const SecureComponent = withValidation({
  rules: {
    email: {
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Invalid email format'
      }
    },
    password: {
      minLength: {
        value: 8,
        message: 'Password must be at least 8 characters'
      }
    }
  }
})(InputComponent)

// ❌ 避免：没有验证
const InsecureComponent = withTheme()(InputComponent)
```

### 2. XSS防护

```typescript
// ✅ 推荐：内容转义
const SafeComponent = withAccessibility()(({ content }) => {
  // 渲染前转义内容
  const safeContent = DOMPurify.sanitize(content)

  return <div dangerouslySetInnerHTML={{ __html: safeContent }} />
})

// ✅ 推荐：使用textContent
const TextComponent = withAccessibility()(({ content }) => {
  return <div>{content}</div> // React自动转义
})
```

### 3. 权限控制

```typescript
// ✅ 推荐：权限检查
const PermissionAwareComponent = withState({
  initialState: { hasPermission: false }
})(({ state, user, permission }) => {
  useEffect(() => {
    setState({ hasPermission: user.hasPermission(permission) })
  }, [user, permission])

  if (!state.hasPermission) {
    return <AccessDenied />
  }

  return <Component />
})
```

## 最佳实践总结

### Do's ✅

1. **使用组合模式** - 通过compose组合多个HOC
2. **保持单一职责** - 每个HOC只负责一个功能
3. **启用TypeScript** - 使用泛型确保类型安全
4. **添加错误边界** - 防止错误传播
5. **优化性能** - 使用React.memo和防抖节流
6. **支持无障碍** - 为所有交互组件添加a11y支持
7. **编写测试** - 确保代码质量和稳定性
8. **文档化** - 提供清晰的API文档和使用示例
9. **配置外置** - 将HOC配置独立出来
10. **版本控制** - 跟踪API变化

### Don'ts ❌

1. **避免过度使用** - 不要为每个组件添加所有HOC
2. **避免副作用** - HOC不应该产生副作用
3. **避免深度嵌套** - 使用compose避免嵌套过深
4. **避免硬编码** - 使用配置而非硬编码值
5. **忽略错误处理** - 始终添加错误边界
6. **忽略性能** - 注意渲染性能优化
7. **忽略类型** - 使用TypeScript确保类型安全
8. **忽略无障碍** - 为所有交互组件添加a11y
9. **忽略测试** - 编写全面的测试用例
10. **忽略文档** - 提供清晰的文档和示例

---

遵循这些最佳实践，可以构建出高质量、可维护、可扩展的React应用程序。
