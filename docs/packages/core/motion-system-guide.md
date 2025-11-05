# Xorigo UI 动画系统指南

## 🎭 动画系统概述

Xorigo UI 动画系统是基于 **Framer Motion 12** 的完整动画解决方案，深度集成了七轴主题系统，提供主题感知、可访问性友好、性能优化的动画体验。

### 核心特性

- 🎨 **主题感知动画** - 与七轴主题系统深度集成
- ♿ **可访问性优先** - 遵循 WCAG 2.1 AA 指南
- ⚡ **性能优化** - 智能动画编排和性能监控
- 📱 **响应式动画** - 自适应不同设备和视口
- 🎮 **组件增强** - 为现有组件添加开箱即用的动画
- 🛠️ **开发者友好** - 完整的工具链和调试支持

---

## 📦 系统架构

### 核心组件

```
┌─────────────────────────────────────────────────────────┐
│                  Xorigo UI 动画系统                    │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │   动画系统核心    │  │   动画变体库    │  │   主题系统集成  │      │
│  │                 │  │               │  │                 │      │
│  │ • 动画配置管理  │  │ • 基础动画     │  │ • 主题轴映射    │      │
│  │ • 状态管理      │  │ • 交互状态     │  │ • 响应式配置    │      │
│  │ • 性能监控      │  │ • 高级动画     │  │ • 用户偏好适配  │      │
│  └─────────────────┘�  └─────────────────┘�  └─────────────────┘�      │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │
│  │   动画组件增强  │  │   动画工具函数  │  │   可访问性支持  │      │
│  │                 │  │               │  │                 │      │
│  │ • AnimatedDiv   │  │ • Hook 函数     │  │ • 用户偏好检测   │      │
│  │ • AnimatedCard  │  │ • 性能监控     │  │ • 动画安全检查   │      │
│  │ • AnimatedButton│  │ • 编排工具     │  │ • 辅助技术支持   │      │
│  │ • ...           │  │ • 调试工具     │  │ • 紧急设置     │      │
│  └─────────────────┘�  └─────────────────┘�  └─────────────────┘�      │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 快速开始

### 基础用法

```tsx
import { AnimatedCard, AnimatedButton, fadeVariants } from '@xorigo-ui/core/motion'

function MyComponent() {
  return (
    <AnimatedCard animation="fade" variants={fadeVariants}>
      <AnimatedButton animation="tap">
        点击我
      </AnimatedButton>
    </AnimatedCard>
  )
}
```

### 主题感知动画

```tsx
import { createThemeAnimation } from '@xorigo-ui/core/motion'

// 根据主题轴创建动画
const customAnimation = createThemeAnimation(
  { duration: 300, easing: 'ease-out' },
  {
    intensity: 'standard',     // subtle | standard | expressive
    complexity: 'moderate',   // simple | moderate | complex
    responsiveness: 'normal'   // immediate | fast | normal | slow
  }
)
```

### 可访问性感知动画

```tsx
import { getAccessibleAnimation, isAnimationAccessible } from '@xorigo-ui/core/motion'

// 自动适配用户偏好
const accessibleAnimation = getAccessibleAnimation(
  { duration: 200, easing: 'ease-out' },
  {
    intensity: 'subtle',           // 减少动画强度
    respectReducedMotion: true, // 尊重减少动画偏好
  }
)

// 检查动画是否可访问
const isAccessible = isAnimationAccessible(accessibleAnimation)
```

---

## 🎨 主题感知动画

### 七轴集成

动画系统与七轴主题系统深度集成，通过 `motion` 轴控制动画表现：

```tsx
// 在主题配置中定义 motion 轴
const themeRecipe = createThemeRecipe({
  mode: 'light',
  base: 'neutral',
  accent: 'blue',
  tone: 'balanced',
  density: 'comfortable',
  motion: 'standard',  // subtle | standard | expressive
  surface: 'matte'
})

// 动画会自动适配主题轴配置
const motionConfig = createThemeAnimation(
  baseConfig,
  {
    intensity: themeRecipe.motion,
    // 动画会根据当前主题自动调整
  }
)
```

### 动画强度分级

- **Subtle (微妙)**: 最小化动画干扰，适合内容阅读
- **Standard (标准)**: 平衡的动画体验，适合一般交互
- **Expressive (表现力)**: 丰富的动画表现，适合装饰性元素

### 响应式动画

```tsx
import { createResponsiveThemeAnimation } from '@xorigo-ui/core/motion'

const responsiveAnimation = createResponsiveThemeAnimation({
  mobile: {
    duration: 150,
    easing: 'ease-out'
  },
  tablet: {
    duration: 200,
    easing: 'ease-out'
  },
  desktop: {
    duration: 300,
    easing: 'ease-out'
  }
})
```

---

## ♿ 可访问性支持

### 用户偏好适配

动画系统自动检测并尊重用户偏好：

```tsx
// 自动检测用户偏好
const { userPreferences } = useMotionTheme()

// 减少动画偏好
if (userPreferences.prefersReducedMotion) {
  // 自动使用简化动画
}

// 高对比度偏好
if (userPreferences.prefersHighContrast) {
  // 禁用复杂动画
}
```

### 安全动画变体

我们提供了经过验证的安全动画变体：

```tsx
import { safeAnimationVariants } from '@xorigo-ui/core/motion'

// 安全动画变体列表
safeAnimationVariants = {
  fade: { duration: 200, easing: 'ease-out', properties: ['opacity'] },
  subtleSlide: { duration: 150, easing: 'ease-out', properties: ['transform'], maxDistance: 10 },
  gentleScale: { duration: 150, easing: 'ease-out', properties: ['transform'], maxScale: 1.05 },
  // ... 更多安全变体
}
```

### 可访问性检查

```tsx
import { isAnimationAccessible } from '@xorigo-ui/core/motion'

const animation = { duration: 300, easing: 'ease-out' }
const context = { isImportant: false, isUserTriggered: false }

const { accessible, reason, recommendations } = isAnimationAccessible(animation, context)

if (!accessible) {
  console.log('动画不可访问:', reason)
  console.log('建议:', recommendations)
}
```

---

## 🎭 动画变体库

### 基础动画变体

```tsx
import { fadeVariants, slideVariants, scaleVariants } from '@xorigo-ui/core/motion'

// 淡入淡出
<AnimatedDiv variants={fadeVariants} initial="hidden" animate="visible" />

// 滑动动画
<AnimatedDiv variants={slideVariants} initial="hidden" animate="visible" direction="up" />

// 缩放动画
<AnimatedDiv variants={scaleVariants} initial="hidden" animate="visible" />
```

### 交互状态变体

```tsx
import { hoverVariants, tapVariants, focusVariants } from '@xorigo-ui/core/motion'

// 悬停状态
<AnimatedDiv variants={hoverVariants} whileHover="hover" />

// 点击状态
<AnimatedDiv variants={tapVariants} whileTap="tap" />

// 焦点状态
<AnimatedDiv variants={focusVariants} whileFocus="focus" />
```

### 高级动画变体

```tsx
import { staggerVariants, pulseVariants, bounceVariants } from '@xorigo-ui/core/motion'

// 错位动画
<AnimatedList variants={staggerVariants} staggerDelay={0.1}>
  {items.map(item => <AnimatedDiv key={item.id}>{item}</AnimatedDiv>)}
</AnimatedList>

// 脉冲动画
<AnimatedDiv variants={pulseVariants} animate="animate" />

// 弹跳动画
<AnimatedDiv variants={bounceVariants} initial="hidden" animate="visible" />
```

---

## 🎮 动画组件

### AnimatedDiv

通用的动画容器组件：

```tsx
<AnimatedDiv
  animation="fade"        // 预设动画类型
  variants={customVariants} // 自定义变体
  motionIntensity="standard" // 动画强度
  respectReducedMotion     // 尊重减少动画偏好
  className="custom-class"
>
  内容
</AnimatedDiv>
```

### AnimatedCard

增强的卡片组件：

```tsx
<AnimatedCard
  variant="elevated"
  size="md"
  animation="scale"
  whileHover="hover"
  className="hover:shadow-xl"
>
  卡片内容
</AnimatedCard>
```

### AnimatedButton

增强的按钮组件：

```tsx
<AnimatedButton
  variant="primary"
  size="md"
  animation="tap"
  loading={false}
  whileHover="hover"
  whileTap="tap"
>
  按钮文字
</AnimatedButton>
```

### AnimatedList

列表项错位动画：

```tsx
<AnimatedList
  staggerDelay={0.1}
  direction="up"
  animation="stagger"
>
  <div>项目 1</div>
  <div>项目 2</div>
  <div>项目 3</div>
</AnimatedList>
```

### AnimatedPresence

条件渲染动画：

```tsx
<AnimatedPresence>
  {isVisible && (
    <AnimatedDiv
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      内容
    </AnimatedDiv>
  )}
</AnimatedPresence>
```

---

## 🛠️ 动画工具函数

### Hook 函数

```tsx
import { useThemeAnimation, useViewportAnimation, useStaggerAnimation } from '@xorigo-ui/core/motion'

// 主题感知动画控制
const { controls, createAnimation } = useThemeAnimation()

// 视口检测动画
const { ref, isInView } = useViewportAnimation()

// 错位动画
const { animationStates, startStagger, resetStagger } = useStaggerAnimation(5, {
  staggerDelay: 0.1,
  initialDelay: 0.2,
})

// 使用示例
useEffect(() => {
  if (isInView) {
    createAnimation({ opacity: 1, y: 0 }, { duration: 300 })
  }
}, [isInView, createAnimation])
```

### 性能工具

```tsx
import {
  AnimationPerformanceMonitor,
  useAnimationPerformance,
  getAnimationBudget
} from '@xorigo-ui/core/motion'

// 性能监控
const monitor = AnimationPerformanceMonitor.getInstance()
const { metrics, getPerformanceScore, getRecommendations } = useAnimationPerformance()

// 动画预算检查
const budget = getAnimationBudget(elementRef.current)
console.log(`动画复杂度: ${budget.complexity}`)
```

### 实用工具

```tsx
import {
  createAnimationThrottle,
  createAnimationDebounce,
  supportsHardwareAcceleration,
  getOptimalAnimationProperties
} from '@xorigo-ui/core/motion'

// 动画节流
const throttledAnimation = createAnimationThrottle(16)

// 动画防抖
const debouncedAnimation = createAnimationDebounce(100)

// 硬件加速检查
const isGPUAccelerated = supportsHardwareAcceleration()

// 最优属性
const optimalProps = getOptimalAnimationProperties()
```

---

## 📊 性能优化

### 动画预算系统

每个元素都有动画预算，根据元素大小、可见性和重要性自动计算：

```tsx
const budget = getAnimationPriority(element)

console.log(`
动画预算:
- 复杂度: ${budget.complexity}
- 最大时长: ${budget.maxDuration}ms
- 最大并行动画数: ${budget.maxParallelAnimations}
- 推荐动画: ${budget.recommendedAnimations.join(', ')}
`)
```

### 性能监控

```tsx
const { metrics, getPerformanceScore, getRecommendations } = useAnimationPerformance()

if (getPerformanceScore(metrics) < 70) {
  console.warn('动画性能较差，建议:', getRecommendations(metrics))
}
```

### 动画编排

```tsx
const { playSequence, playParallel, addAnimation, completedAnimations } = useAnimationOrchestator()

// 添加动画控制
const controls1 = useAnimation()
const controls2 = useAnimation()

addAnimation('slideIn', controls1)
addAnimation('fadeIn', controls2)

// 顺序执行动画
playSequence([
  { name: 'slideIn', animation: { x: 0 }, options: { duration: 300 } },
  { name: 'fadeIn', animation: { opacity: 1 }, options: { duration: 200 } },
])

// 并行执行动画
playParallel([
  { name: 'scale1', animation: { scale: 1.1 } },
  { name: 'scale2', animation: { scale: 0.9 } },
])
```

---

## 📱 响应式动画

### 断点配置

动画系统根据视口大小自动调整：

```tsx
const responsiveAnimation = createResponsiveThemeAnimation({
  mobile: { duration: 150, easing: 'ease-out' },    // < 640px
  tablet: { duration: 200, easing: 'ease-out' },   // 640px - 1024px
  desktop: { duration: 300, easing: 'ease-out' }, // > 1024px
})
```

### 视口检测

```tsx
const { ref, isInView } = useViewportAnimation({
  threshold: 0.1,    // 触发阈值
  rootMargin: '50px', // 根边距
  triggerOnce: true,  // 只触发一次
})

<div ref={ref}>
  {isInView && '元素进入视口'}
</div>
```

### 设备适配

```tsx
import { useMotionTheme } from '@xorigo-ui/core/motion'

const { config } = useMotionTheme()

// 根据设备类型调整动画策略
const deviceStrategy = config.themeAxis.responsiveness
const intensity = config.themeAxis.intensity

// 移动设备使用更快、更简单的动画
const mobileOptimized = deviceStrategy === 'fast' || intensity === 'subtle'
```

---

## 🔧 自定义动画

### 创建自定义变体

```tsx
import { createThemeAwareVariants } from '@xorigo-ui/core/motion'

const customVariants = createThemeAwareVariants({
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1 },
}, 'standard')
```

### 注册自定义变体

```tsx
import { animationSystem } from '@xorigo-ui/core/motion'

animationSystem.registerVariants('customSlide', {
  hidden: { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0 },
}, {
  category: 'navigation',
  description: '自定义滑动动画',
  accessibility: '适合所有用户'
})
```

### Spring 动画配置

```tsx
import { springConfig } from '@/foundations/motion-curves'

const customSpring = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
  mass: 1,
}
```

---

## 🎯 最佳实践

### 1. 可访问性优先

```tsx
// ✅ 好的做法
<AnimatedCard
  animation="fade"
  respectReducedMotion={true}
  aria-label="卡片内容"
>

// ❌ 避免的做法
<AnimatedCard
  animation="bounce"
  // 没有考虑用户偏好
  // 没有适当的 ARIA 标签
>
```

### 2. 性能优化

```tsx
// ✅ 好的做法
const optimizedAnimation = createThemeAnimation(
  { duration: 200 }, // 较短时长
  {
    complexity: 'simple',      // 简单复杂度
    responsiveness: 'fast',     // 快速响应
  }
)

// ❌ 避免的做法
const heavyAnimation = {
  duration: 1000,        // 过长时长
  type: 'spring',        // 复杂动画
  stiffness: 600,         // 高强度
}
```

### 3. 主题感知

```tsx
// ✅ 好的做法
const themeAwareAnimation = createThemeAnimation(
  baseConfig,
  {
    intensity: currentTheme.motion, // 使用主题配置
    respectReducedMotion: true,   // 尊重用户偏好
  }
)

// ❌ 避免的做法
const staticAnimation = {
  duration: 300,    // 固定配置
  easing: 'ease-out', // 不考虑主题
}
```

### 4. 渐进增强

```tsx
// ✅ 好的做法
<AnimatedCard
  animation="fade"
  motionIntensity="subtle"  // 从微妙开始
  respectReducedMotion={true}
  className="base-class"
>

// 基础样式 + 动画增强
<div className="card-base">
  <AnimatedCard className="card-animation">
    内容
  </AnimatedCard>
</div>
```

---

## 🐛 故障排除

### 常见问题

1. **动画不生效**
   - 检查 Framer Motion 版本是否为 12+
   - 确认组件已正确导入动画属性
   - 检查 CSS transform 属性设置

2. **性能问题**
   - 减少同时运行的动画数量
   - 使用动画预算系统
   - 检查硬件加速支持

3. **可访问性问题**
   - 确保尊重用户偏好设置
   - 提供无动画替代方案
   - 检查 ARIA 标签

4. **主题不生效**
   - 确认主题提供者已正确配置
   - 检查 motion 轴设置
   - 验证主题轴映射

### 调试工具

```tsx
// 启用调试模式
const debugConfig = {
  debugMode: true,
  enableAnimations: true,
  performanceMode: 'balanced',
}

animationSystem.updateGlobalConfig(debugConfig)

// 检查动画状态
const { animationStates } = animationSystem.getContext()
console.log('当前动画状态:', animationStates)

// 获取性能建议
const { performanceMetrics } = animationSystem.getContext()
console.log('性能建议:', animationSystem.getPerformanceRecommendations())
```

---

## 📚� API 参考

### 核心类

#### `XorigoAnimationSystem`

```typescript
class XorigoAnimationSystem {
  // 创建动画配置
  createAnimationConfig(baseConfig, themeAxis?, themeRecipe?): ThemeAwareAnimation

  // 创建预设变体
  createPresetVariants(preset, intensity?): Variants

  // 注册自定义变体
  registerVariants(name, variants, metadata?): void

  // 检查动画可访问性
  isAnimationAccessible(animation, context?): AccessibilityResult

  // 获取系统上下文
  getContext(): AnimationContext
}
```

#### `MotionThemeProvider`

```typescript
class MotionThemeProvider {
  // 更新主题轴配置
  updateThemeAxis(key, value): void

  // 创建主题感知动画
  createThemeAnimation(baseConfig, options?): ThemeAwareAnimation

  // 创建响应式动画
  createResponsiveAnimation(configs): ThemeAwareAnimation

  // 生成 CSS 变量
  generateCSSVariables(): string
}
```

#### `AccessibilityAnimationProvider`

```typescript
class AccessibilityAnimationProvider {
  // 检查动画可访问性
  isAnimationAccessible(animation, context?): AccessibilityResult

  // 获取可访问动画配置
  getAccessibleAnimation(baseAnimation, context?): ThemeAwareAnimation

  // 生成可访问性报告
  generateAccessibilityReport(): AccessibilityReport
}
```

### Hook 函数

#### `useThemeAnimation`

```typescript
function useThemeAnimation(): {
  controls: AnimationControls
  createAnimation: (target, options?) => Promise<any>
}
```

#### `useViewportAnimation`

```typescript
function useViewportAnimation(options?: {
  threshold?: number
  rootMargin?: string
  triggerOnce?: boolean
}): {
  ref: RefObject<HTMLElement>
  isInView: boolean
  controls: AnimationControls
}
```

#### `useStaggerAnimation`

```typescript
function useStaggerAnimation(
  itemCount: number,
  options?: {
    staggerDelay?: number
    initialDelay?: number
    duration?: number
  }
): {
  animationStates: boolean[]
  startStagger: () => void
  resetStagger: () => void
}
```

#### `useAnimationOrchestrator`

```typescript
function useAnimationOrchestator(): {
  addAnimation: (name: string, controls: AnimationControls) => void
  playSequence: (sequence: AnimationSequence[]) => Promise<void>
  playParallel: (animations: AnimationSequence[]) => Promise<void>
  completedAnimations: Set<string>
  reset: () => void
}
```

### 组件属性

#### `AnimatedDivProps`

```typescript
interface AnimatedDivProps {
  // 动画配置
  animation?: ThemeAwareAnimation | string
  variants?: Variants
  initial?: string | boolean
  animate?: string | boolean
  exit?: string | boolean
  whileHover?: string | boolean
  whileTap?: string | boolean
  whileFocus?: string | boolean
  whileInView?: string | boolean

  // 主题轴配置
  motionIntensity?: MotionAxisConfig['intensity']
  motionComplexity?: MotionAxisConfig['complexity']
  motionResponsiveness?: MotionAxisConfig['responsiveness']

  // 可访问性
  respectReducedMotion?: boolean
  safeToAnimate?: boolean

  // 通用属性
  className?: string
  children?: React.ReactNode
  as?: keyof JSX.IntrinsicElements
  // ...MotionProps
}
```

### 类型定义

#### `AnimationConfig`

```typescript
interface AnimationConfig {
  duration?: number | string
  easing?: string
  delay?: number

  type?: 'tween' | 'spring' | 'keyframes' | 'inertia'
  stiffness?: number
  damping?: number
  mass?: number
  velocity?: number

  repeat?: number | boolean
  repeatType?: 'loop' | 'reverse' | 'mirror'
  direction?: 'normal' | 'reverse' | 'alternate'

  willChange?: boolean
  layout?: boolean
  layoutAnimation?: boolean
}
```

#### `ThemeAwareAnimation`

```typescript
interface ThemeAwareAnimation extends AnimationConfig {
  // 主题感知配置
  themeAxis?: MotionAxisConfig
  themeRecipe?: ThemeRecipe

  // 响应式配置
  responsive?: {
    mobile?: AnimationConfig
    tablet?: AnimationConfig
    desktop?: AnimationConfig
  }

  // 状态感知配置
  stateAware?: {
    hover?: AnimationConfig
    focus?: AnimationConfig
    active?: AnimationConfig
    disabled?: AnimationConfig
  }
}
```

#### `MotionAxisConfig`

```typescript
interface MotionAxisConfig {
  intensity: 'subtle' | 'standard' | 'expressive'
  complexity: 'simple' | 'moderate' | 'complex'
  responsiveness: 'immediate' | 'fast' | 'normal' | 'slow'

  strategy: 'functional' | 'decorative' | 'feedback' | 'navigation'
  priority: 'critical' | 'important' | 'normal' | 'low'

  prefersReducedMotion?: boolean
  respectMotionPreference?: boolean
  safeToAnimate?: boolean
}
```

---

## 🔗 版本历史

### v1.0.0 (当前版本)
- ✅ 完整的动画系统架构
- ✅ 七轴主题系统集成
- ✅ 可访问性优先设计
- ✅ 性能优化工具
- ✅ 响应式动画支持
- ✅ 组件增强
- ✅ 完整的工具函数库

### 计划中的功能

- **v1.1.0**: Lottie 集成
- **v1.2.0**: 3D 动画增强
- **v1.3.0**: 物理动画库
- **v1.4.0**: 手势动画支持
- **v1.5.0**: 动画编辑器

---

## 📞 相关资源

- [Framer Motion 官方文档](https://www.framer.com/motion/)
- [WCAG 2.1 指南](https://www.w3.org/WAI/WCAG21/)
- [MDN Web Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Animations/)
- [七轴主题系统文档](../tokens/design-tokens.md)

---

**生成时间**: 2025-10-22
**动画系统版本**: v1.0.0
**Framer Motion 版本**: ^12.0.0
**状态**: 🟢 production ready