# HOC系统 API文档

## 概述

Xorigo UI HOC系统是一个全面的高阶组件（Higher-Order Components）库，提供了丰富的组件增强功能。HOC是一种React设计模式，允许你在不修改原组件代码的情况下，为组件添加额外的功能。

## 核心概念

### 高阶组件 (HOC)

HOC是一个函数，接受一个组件作为参数，返回一个增强后的组件：

```typescript
const EnhancedComponent = withHOC(BaseComponent)
```

### 组合优于继承

HOC系统采用组合模式，可以通过compose函数将多个HOC组合在一起：

```typescript
const EnhancedComponent = compose([
  withTheme(),
  withVariant('primary'),
  withSize('md')
])(BaseComponent)
```

## 核心HOC

### withTheme

为组件注入主题系统支持。

```typescript
const ThemedComponent = withTheme({
  mode: 'dark',
  colorScheme: 'primary'
})(BaseComponent)
```

**配置选项：**
- `mode`: 主题模式 (`light` | `dark` | `system`)
- `colorScheme`: 色彩方案
- `customTheme`: 自定义主题
- `enableSystemTheme`: 是否启用系统主题检测

**提供属性：**
- `theme`: 主题对象
- `mode`: 当前主题模式
- `colorScheme`: 当前色彩方案
- `isDarkMode`: 是否为深色模式
- `toggleTheme()`: 切换主题
- `setTheme(mode)`: 设置主题

### withVariant

为组件提供变体系统支持。

```typescript
const VariantButton = withVariant({
  defaultVariant: 'primary',
  variants: {
    custom: {
      className: 'custom-style'
    }
  }
})(BaseComponent)
```

**配置选项：**
- `defaultVariant`: 默认变体
- `variants`: 自定义变体配置
- `customVariants`: 自定义变体
- `allowCustomVariant`: 是否允许自定义变体

**提供属性：**
- `variant`: 当前变体
- `currentVariant`: 当前变体
- `setVariant(variant)`: 设置变体
- `isVariant(variant)`: 检查是否为指定变体
- `getVariantStyles()`: 获取变体样式

### withSize

为组件提供尺寸系统支持。

```typescript
const SizedButton = withSize({
  defaultSize: 'md',
  sizes: {
    custom: {
      width: '200px'
    }
  }
})(BaseComponent)
```

**配置选项：**
- `defaultSize`: 默认尺寸
- `sizes`: 自定义尺寸配置
- `responsiveSizes`: 响应式尺寸
- `allowCustomSize`: 是否允许自定义尺寸

**提供属性：**
- `size`: 当前尺寸
- `currentSize`: 当前尺寸
- `setSize(size)`: 设置尺寸
- `isSize(size)`: 检查是否为指定尺寸
- `getSizeStyles()`: 获取尺寸样式

### withState

为组件提供状态管理功能。

```typescript
const StatefulComponent = withState({
  initialState: { count: 0 },
  persistKey: 'countState',
  enablePersistence: true
})(BaseComponent)
```

**配置选项：**
- `initialState`: 初始状态
- `persistKey`: 持久化键
- `enablePersistence`: 是否启用持久化
- `enableReset`: 是否允许重置
- `resetOnPropsChange`: 是否在props变化时重置

**提供属性：**
- `state`: 当前状态
- `setState(updater)`: 更新状态
- `actions`: 状态操作函数
  - `reset()`: 重置状态
  - `merge(updates)`: 合并更新
  - `replace(newState)`: 替换状态
  - `toggle(key)`: 切换布尔值
  - `increment(key, amount)`: 增加数值
  - `decrement(key, amount)`: 减少数值

### withValidation

为组件提供表单验证功能。

```typescript
const ValidatedInput = withValidation({
  rules: {
    required: '此字段为必填项',
    minLength: { value: 3, message: '至少3个字符' },
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: '请输入有效邮箱'
    }
  },
  validateOnChange: true,
  validateOnBlur: true
})(InputComponent)
```

**配置选项：**
- `rules`: 验证规则
- `validateOnChange`: 是否在变化时验证
- `validateOnBlur`: 是否在失焦时验证
- `validateOnMount`: 是否在挂载时验证
- `customValidators`: 自定义验证器
- `asyncValidators`: 异步验证器
- `debounceMs`: 防抖时间

**提供属性：**
- `error`: 当前错误
- `isValid`: 是否有效
- `isValidating`: 是否正在验证
- `validate()`: 执行验证
- `validateField(field)`: 验证单个字段
- `validateAll()`: 验证所有字段
- `resetValidation()`: 重置验证

### withAccessibility

为组件提供无障碍功能支持。

```typescript
const AccessibleButton = withAccessibility({
  role: 'button',
  ariaLabel: '提交表单',
  keyboardNavigation: true,
  focusOnMount: true
})(Button)
```

**配置选项：**
- `role`: ARIA角色
- `ariaLabel`: ARIA标签
- `ariaLabelledBy`: ARIA标签引用
- `ariaDescribedBy`: ARIA描述引用
- `tabIndex`: 焦点索引
- `enableFocusTrap`: 是否启用焦点陷阱
- `keyboardNavigation`: 是否启用键盘导航
- `focusOnMount`: 是否在挂载时获取焦点

**提供属性：**
- `id`: 元素ID
- `isFocused`: 是否已获取焦点
- `focus()`: 获取焦点
- `blur()`: 失去焦点
- `announce(message, priority)`: 公告消息
- `registerAriaId(id)`: 注册ARIA ID

### withLoading

为组件提供加载状态管理。

```typescript
const LoadingButton = withLoading({
  showDelay: 200,
  minDuration: 500,
  preventInteractions: true,
  overlay: true
})(Button)
```

**配置选项：**
- `initialLoading`: 初始加载状态
- `showDelay`: 显示延迟
- `minDuration`: 最小持续时间
- `loadingComponent`: 自定义加载组件
- `overlay`: 是否显示遮罩
- `preventInteractions`: 是否阻止交互

**提供属性：**
- `isLoading`: 是否加载中
- `loadingState`: 加载状态
- `startLoading()`: 开始加载
- `stopLoading(success)`: 停止加载
- `setLoading(loading, state)`: 设置加载状态
- `withLoading(asyncFn)`: 包装异步函数
- `retry()`: 重试
- `error`: 错误信息

### withErrorBoundary

为组件提供错误边界功能。

```typescript
const SafeComponent = withErrorBoundary({
  fallback: ({ error, resetError }) => (
    <div>错误: {error.message}</div>
  ),
  onError: (error, errorInfo) => {
    console.error('Component error:', error, errorInfo)
  }
})(Component)
```

**配置选项：**
- `fallback`: 错误展示组件
- `onError`: 错误处理回调
- `onReset`: 重置回调

**提供属性：**
- `hasError`: 是否有错误
- `error`: 错误信息
- `retry()`: 重试
- `clearError()`: 清除错误
- `reportError(error, info)`: 报告错误

## HOC组合系统

### compose

组合多个HOC为一个HOC。

```typescript
const EnhancedButton = compose([
  withTheme({ mode: 'dark' }),
  withVariant('primary'),
  withSize('md'),
  withLoading()
])(BaseButton)
```

**配置选项：**
- `strategy`: 属性合并策略 (`override` | `merge` | `concatenate` | `custom`)
- `displayName`: 显示名称
- `enableMemo`: 是否启用React.memo
- `debug`: 是否启用调试模式

### withMergeProps

提供智能属性合并功能。

```typescript
const MergedComponent = withMergeProps({
  strategy: 'merge',
  deepMerge: true,
  conflictResolution: {
    omit: ['className'],
    rename: { size: 'buttonSize' }
  }
})(BaseComponent)
```

### withChain

为组件提供链式调用功能。

```typescript
const ChainComponent = withChain({
  autoExpose: true,
  exposeRules: {
    include: ['focus', 'blur', 'click']
  }
})(Component)

const chain = useChainInstance(componentRef)
chain.chain('focus').wait(1000, 'click')
```

### withDisplayName

管理HOC和组件的显示名称。

```typescript
const NamedComponent = withDisplayName({
  prefix: 'Enhanced',
  suffix: 'Wrapper'
})(Component)

const displayName = setDisplayNameForChain(
  Component,
  [withTheme, withVariant('primary')],
  { separator: ' → ' }
)
```

## 实用工具HOC

### withClickOutside

检测点击事件是否发生在组件外部。

```typescript
const DropdownMenu = withClickOutside({
  onClickOutside: () => setIsOpen(false),
  excludeSelectors: ['.dropdown-toggle'],
  eventType: 'click'
})(DropdownComponent)
```

### withPortal

将组件渲染到DOM的任意位置。

```typescript
const Modal = withPortal({
  containerId: 'modal-root',
  containerClassName: 'modal-overlay',
  ssr: true,
  enabled: true
})(ModalComponent)
```

### withResizeObserver

监听元素尺寸变化。

```typescript
const ResponsiveComponent = withResizeObserver({
  onResize: (entry) => console.log('Resized:', entry.contentRect),
  debounceMs: 100,
  onResizeEnd: (entry) => console.log('Resize ended')
})(Component)
```

### withIntersectionObserver

监听元素进入/离开视口。

```typescript
const LazyImage = withIntersectionObserver({
  threshold: 0.1,
  onIntersect: (entry) => {
    const target = entry.target as HTMLImageElement
    const dataSrc = target.getAttribute('data-src')
    if (dataSrc) {
      target.src = dataSrc
    }
  }
})(ImageComponent)
```

### withMediaQuery

监听媒体查询变化。

```typescript
const ResponsiveComponent = withMediaQuery({
  query: '(min-width: 768px)',
  onMatch: () => console.log('Desktop view'),
  onUnmatch: () => console.log('Mobile view'),
  debounceMs: 100
})(Component)
```

### withDebounce

为函数提供防抖功能。

```typescript
const DebouncedInput = withDebounce({
  delay: 300,
  callback: (value) => search(value),
  immediate: false
})(InputComponent)
```

### withThrottle

为函数提供节流功能。

```typescript
const ThrottledScroll = withThrottle({
  interval: 100,
  callback: (event) => handleScroll(event),
  immediate: true,
  waitForLast: false
})(ScrollHandler)
```

## 表单专用HOC

### withForm

提供完整的表单管理功能。

```typescript
const MyForm = withForm({
  initialValues: { name: '', email: '' },
  validate: (values) => {
    const errors = {}
    if (!values.name) errors.name = '必填'
    if (!values.email) errors.email = '必填'
    return errors
  },
  onSubmit: async (values) => {
    console.log('Submit:', values)
  },
  validateOnChange: true,
  validateOnBlur: true
})(FormComponent)
```

**提供属性：**
- `values`: 表单值
- `errors`: 表单错误
- `touched`: 触摸状态
- `isSubmitting`: 是否提交中
- `isValidating`: 是否验证中
- `isValid`: 是否有效
- `isDirty`: 是否已修改
- `handleSubmit(e)`: 提交表单
- `handleReset()`: 重置表单
- `getFieldProps(name)`: 获取字段属性
- `setFieldValue(name, value)`: 设置字段值

### withField

增强表单字段组件。

```typescript
const FormInput = withField({
  name: 'email',
  label: '邮箱地址',
  helperText: '请输入有效的邮箱地址',
  required: true
})(InputComponent)
```

### withController

提供受控组件功能。

```typescript
const ControllerInput = withController({
  name: 'username',
  defaultValue: '',
  rules: {
    required: '用户名不能为空',
    minLength: { value: 3, message: '至少3个字符' }
  },
  transformValue: (value) => value.trim()
})(InputComponent)
```

### withAsyncValidation

提供异步验证功能。

```tsx
const AsyncInput = withAsyncValidation({
  validator: async (email) => {
    const response = await fetch('/api/check-email', {
      method: 'POST',
      body: JSON.stringify({ email })
    })
    const result = await response.json()
    return result.available || '该邮箱已被注册'
  },
  delay: 500,
  validateOnBlur: true
})(InputComponent)
```

### withSubmit

提供高级提交功能。

```typescript
const SubmitButton = withSubmit({
  onSubmit: async (values) => {
    const response = await fetch('/api/submit', {
      method: 'POST',
      body: JSON.stringify(values)
    })
    return response.json()
  },
  preventDoubleSubmit: true,
  onSuccess: (result) => {
    console.log('Success:', result)
  },
  onError: (error) => {
    console.error('Error:', error)
  },
  retryOnError: true,
  maxRetries: 3
})(Button)
```

## 动画HOC

### withAnimate

提供基础动画功能。

```typescript
const AnimatedComponent = withAnimate({
  variants: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    hover: { scale: 1.05, transition: { duration: 0.2 } }
  },
  initial: 'hidden',
  animate: 'visible'
})(Component)
```

**预设动画：**
- `withFadeIn(duration)`: 淡入动画
- `withSlideIn(direction, duration)`: 滑动进入动画
- `withScale(scale, duration)`: 缩放动画
- `withBounce()`: 弹跳动画
- `withSpin()`: 旋转动画

### withTransition

提供过渡动画功能。

```typescript
const Modal = withTransition({
  initial: { opacity: 0, scale: 0.9 },
  enter: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  animateOnMount: true
})(ModalComponent)
```

**预设转场：**
- `withSlideTransition(direction)`: 滑动转场
- `withFadeTransition()`: 淡入淡出转场
- `withScaleTransition()`: 缩放转场

### withGestures

提供手势动画功能。

```typescript
const DraggableComponent = withGestures({
  drag: true,
  dragConstraints: { top: -100, bottom: 100, left: -100, right: 100 },
  swipe: true,
  swipeThreshold: 50,
  pinch: true,
  rotate: true,
  onDrag: (delta) => console.log('Dragged:', delta),
  onSwipeLeft: () => console.log('Swiped left')
})(Component)
```

**预设手势：**
- `withDragGestures(constraints)`: 拖拽手势
- `withSwipeGestures()`: 滑动手势
- `withPinchGestures()`: 缩放手势
- `withRotateGestures()`: 旋转手势

### withPageTransition

提供页面转场动画功能。

```typescript
const PageComponent = withPageTransition({
  initial: { opacity: 0, x: '100%' },
  enter: { opacity: 1, x: '0%', transition: { duration: 0.5 } },
  exit: { opacity: 0, x: '-100%', transition: { duration: 0.3 } },
  skipInitial: true
})(Page)
```

**预设页面转场：**
- `withSlidePageTransition(direction)`: 滑动转场
- `withFadePageTransition()`: 淡入淡出转场
- `withScalePageTransition()`: 缩放转场
- `withRotatePageTransition()`: 旋转转场

## 快捷组合函数

### createFormComponent

创建一个完整的表单组件。

```typescript
const FormComponent = createFormComponent(MockForm)
```

包含：表单管理、字段增强、验证、提交处理、加载状态、错误边界。

### createButtonComponent

创建一个完整的按钮组件。

```typescript
const ButtonComponent = createButtonComponent(MockButton)
```

包含：主题、变体、尺寸、状态、无障碍、加载、错误边界。

### createInputComponent

创建一个完整的输入框组件。

```typescript
const InputComponent = createInputComponent(MockInput)
```

包含：表单、字段、控制器、验证、无障碍。

### createAnimatedComponent

创建一个动画容器组件。

```typescript
const AnimatedComponent = createAnimatedComponent(Component)
```

包含：动画、转场、手势、错误边界。

### createResponsiveComponent

创建一个响应式组件。

```typescript
const ResponsiveComponent = createResponsiveComponent(Component)
```

包含：媒体查询、尺寸监听、视口监听。

## 性能优化

### React.memo集成

所有HOC默认启用React.memo优化，防止不必要的重渲染。

```typescript
const EnhancedComponent = compose([
  withTheme(),
  withVariant()
], { enableMemo: true })(Component)
```

### useMemo和useCallback

HOC内部使用useMemo和useCallback缓存计算结果和函数引用，减少渲染开销。

### 防抖和节流

实用工具HOC提供防抖和节流功能，优化高频事件处理性能。

```typescript
const DebouncedComponent = withDebounce({
  delay: 300,
  callback: (value) => processValue(value)
})(Component)
```

## 类型安全

### TypeScript泛型支持

所有HOC都提供完整的TypeScript类型支持。

```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
}

const EnhancedButton = withVariant<ButtonProps>()(ButtonComponent)

type EnhancedButtonProps = ComponentProps<typeof EnhancedButton>
```

### 类型推断

HOC支持自动类型推断，提供优秀的开发体验。

```typescript
const EnhancedComponent = compose([
  withTheme(),
  withVariant()
])(BaseComponent)

// 类型自动推断
<EnhancedComponent theme={theme} variant="primary" />
```

## 最佳实践

### 1. 组合原则

优先使用组合而非继承，通过compose函数组合多个HOC：

```typescript
const EnhancedButton = compose([
  withTheme(),
  withVariant(),
  withSize(),
  withLoading()
])(Button)
```

### 2. 配置分离

将HOC配置独立出来，提高复用性：

```typescript
// 配置
const buttonEnhancers = [
  withTheme({ mode: 'dark' }),
  withVariant('primary'),
  withSize('md')
]

// 使用
const Button = compose(buttonEnhancers)(BaseButton)
```

### 3. 条件增强

使用when函数进行条件性HOC应用：

```typescript
const EnhancedComponent = compose([
  withTheme(),
  when(() => process.env.NODE_ENV === 'development')(
    withDebugOverlay()
  )
])(Component)
```

### 4. 错误处理

始终为组件添加错误边界：

```typescript
const SafeComponent = withErrorBoundary({
  fallback: ({ error }) => <ErrorDisplay error={error} />
})(Component)
```

### 5. 无障碍优先

为交互组件添加无障碍支持：

```typescript
const AccessibleButton = withAccessibility({
  role: 'button',
  ariaLabel: '提交表单',
  keyboardNavigation: true
})(Button)
```

### 6. 性能监控

使用性能优化HOC：

```typescript
const OptimizedComponent = compose([
  withDebounce({ delay: 300 }),
  withThrottle({ interval: 100 }),
  withResizeObserver()
])(Component)
```

## 迁移指南

### 从其他HOC库迁移

Xorigo UI HOC系统兼容主流HOC库的API：

```typescript
// React Redux
const ConnectedComponent = connect(mapStateToProps, mapDispatchToProps)(Component)

// Xorigo UI HOC
const ConnectedComponent = withState({
  initialState: {},
  customReducers: {
    setState: (state, action) => { /* ... */ }
  }
})(Component)
```

### 从类组件迁移

HOC可以与类组件和函数组件配合使用：

```typescript
class ClassComponent extends React.Component {
  render() {
    return <div>{this.props.children}</div>
  }
}

// 使用HOC增强
const EnhancedClassComponent = withTheme()(ClassComponent)
```

## 故障排除

### 常见问题

1. **HOC重复包装**
   - 检查是否多次应用同一个HOC
   - 使用compose避免重复

2. **类型错误**
   - 确保提供正确的泛型参数
   - 检查组件Props类型

3. **性能问题**
   - 启用React.memo优化
   - 使用useMemo缓存计算结果

4. **渲染问题**
   - 检查displayName设置
   - 确保forwardRef正确传递

### 调试模式

启用debug模式查看HOC执行信息：

```typescript
const EnhancedComponent = compose([
  withTheme()
], { debug: true })(Component)
```

## 更新日志

### v1.0.0

- 初始版本发布
- 支持8个核心HOC
- 提供完整的类型系统
- 包含完整的测试套件
- 性能优化支持
- 无障碍功能集成

---

更多信息请参考[使用指南](./hoc-usage-guide.md)和[最佳实践](./hoc-best-practices.md)。
