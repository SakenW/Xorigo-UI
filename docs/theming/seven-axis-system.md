# 🌈 七轴主题系统使用指南

**版本**: v1.5
**作用域**: 主题系统的使用和定制
**目标受众**: Xorigo UI 用户和主题定制者
**职责**: 提供主题使用指南、配方说明、定制教程
**排除**: 技术实现细节、API接口定义、架构规范

> **技术权威**: 本文档的使用指南基于 [主题系统SSOT](../shared/theme-system-ssot-v1.5.md) 的技术实现。如需了解技术实现细节，请参考SSOT文档。

---

## 📋 文档边界

| 方面 | 用户指南负责 | SSOT文档负责 |
|------|------------|------------|
| **使用方法** | ✅ 主题切换、配方应用、定制教程 | ❌ 不涉及 |
| **用户界面** | ✅ 主题展示、交互演示 | ❌ 不涉及 |
| **技术实现** | ❌ 不涉及 | ✅ 主题引擎、令牌、运行时机制 |
| **API接口** | ❌ 不涉及 | ✅ 类型定义、接口规范 |
| **开发指导** | ⚠️ 仅限使用层面 | ✅ 开发和集成指导 |

---

## 🎨 系统概述

七轴主题系统是 Xorigo UI 的核心特性，它通过 7 个独立的轴来控制界面的视觉表现，为用户提供极其灵活的主题定制能力。

### 🎯 设计理念

- **灵活性** - 每个轴都可以独立控制，支持无限组合
- **一致性** - 基于设计令牌系统，确保视觉一致性
- **可访问性** - 内置 WCAG 对比度验证，确保可访问性
- **性能** - 基于 CSS 变量，支持实时切换，性能优异

### 🔗 快速导航

- **技术实现** → 查看 [主题系统SSOT](../shared/theme-system-ssot-v1.4.md)
- **组件分类** → 查看 [组件分类系统](../shared/component-classification-system.md)
- **快速开始** → 查看 [快速开始指南](../guides/getting-started.md)

---

## 🌈 七个轴详解（v1.4）

基于SSOT文档的定义，七轴主题系统包含以下7个维度：

### 1️⃣ 模式轴 - 光照模式控制

控制应用的基础显示模式。

```typescript
type ModeAxis = 'light' | 'dark' | 'hc'
```

- **`light`** - 浅色模式，适合白天使用
- **`dark`** - 深色模式，适合夜间使用
- **`hc`** - 高对比度模式，符合可访问性标准

**使用示例**：
```css
/* 浅色模式 */
:root {
  --color-background: #ffffff;
  --color-text: #1f2937;
}

/* 深色模式 */
:root {
  --color-background: #1f2937;
  --color-text: #f9fafb;
}
```

### 2️⃣ 基础色轴 - 中性色调与对比度

控制界面的中性色彩系统和对比度水平。

```typescript
type BaseAxis = `${'neutral-warm' | 'neutral-cool' | 'neutral-true'}-${'low' | 'mid' | 'high'}`
```

**基础色选项**：
- **`neutral-warm`** - 暖色调中性色
- **`neutral-cool`** - 冷色调中性色
- **`neutral-true`** - 真中性色

**对比度级别**：
- **`low`** - 低对比度，适合阅读
- **`mid`** - 中等对比度，平衡选择
- **`high`** - 高对比度，符合WCAG标准

**示例配方**：
```css
/* 中等对比度暖色调 */
--color-neutral: #f5f5f4;
--color-neutral-contrast: #78716c;

/* 高对比度冷色调 */
--color-neutral: #f8fafc;
--color-neutral-contrast: #1e293b;
```

### 3️⃣ 强调色轴 - 主色策略与色相

控制界面的主色生成策略和色相选择。

```typescript
type AccentAxis = `${'mono' | 'analog' | 'duo'}(${string})`
```

**策略类型**：
- **`mono`** - 单色策略：基于单一色相生成完整色谱
- **`analog`** - 类似色策略：基于色相环的邻近色
- **`duo`** - 双色策略：主色与辅助色的组合

**示例用法**：
```css
/* 单色蓝色系 */
--color-primary: #3b82f6;
--color-primary-50: #eff6ff;
--color-primary-900: #1e3a8a;

/* 类似色策略 */
--color-primary: #3b82f6;
--color-secondary: #6366f1;
--color-tertiary: #8b5cf6;
```

### 4️⃣ 色调轴 - 饱和度与亮度曲线

控制色彩的鲜艳程度和亮度表现。

```typescript
type ToneAxis = 'calm' | 'standard' | 'vivid'
```

- **`calm`** - 柔和色调，降低饱和度，适合长时间阅读
- **`standard`** - 标准色调，平衡的视觉效果
- **`vivid`** - 鲜艳色调，高饱和度，突出强调元素

**视觉对比**：
```css
/* 柔和色调 */
--color-primary: hsl(220, 50%, 50%);

/* 标准色调 */
--color-primary: hsl(220, 70%, 50%);

/* 鲜艳色调 */
--color-primary: hsl(220, 90%, 50%);
```

### 5️⃣ 密度轴 - 信息密度控制

控制界面的空间利用率和信息密度。

```typescript
type DensityAxis = 'spacious' | 'comfortable' | 'compact'
```

- **`spacious`** - 宽松密度，更多留白，适合展示型页面
- **`comfortable`** - 舒适密度，平衡的视觉体验
- **`compact`** - 紧凑密度，高信息密度，适合数据密集型应用

**空间参数**：
```css
/* 宽松密度 */
--spacing-sm: 16px;
--spacing-md: 24px;
--spacing-lg: 32px;

/* 紧凑密度 */
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
```

### 6️⃣ 动效轴 - 动画节奏与幅度

控制界面的动画效果和交互反馈。

```typescript
type MotionAxis = `${'subtle' | 'standard' | 'expressive'}.${'classic' | 'soft' | 'spring'}`
```

**动画强度**：
- **`subtle`** - 微妙动效，最小化视觉干扰
- **`standard`** - 标准动效，平衡的交互反馈
- **`expressive`** - 表现力动效，丰富的视觉体验

**动画曲线**：
- **`classic`** - 经典缓动，稳定的动画节奏
- **`soft`** - 柔和缓动，平滑的过渡效果
- **`spring`** - 弹性缓动，自然的物理效果

**示例组合**：
```css
/* 标准经典动效 */
--motion-duration: 300ms;
--motion-easing: cubic-bezier(0.4, 0.0, 0.2, 1);

/* 表现力弹性动效 */
--motion-duration: 500ms;
--motion-easing: cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

### 7️⃣ 表面轴 - 表面材质语言

控制界面的材质表现和视觉效果。

```typescript
type SurfaceAxis = 'flat' | 'soft-shadow' | 'glass' | 'neon' | 'glass+neon'
```

- **`flat`** - 扁平设计，简洁的视觉效果
- **`soft-shadow`** - 柔和阴影，增加层次感
- **`glass`** - 玻璃效果，半透明模糊背景
- **`neon`** - 霓虹效果，发光边界和色彩
- **`glass+neon`** - 玻璃+霓虹，结合两种效果

**材质示例**：
```css
/* 柔和阴影 */
--surface-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);

/* 玻璃效果 */
--surface-backdrop: blur(20px);
--surface-opacity: 0.8;

/* 霓虹效果 */
--surface-glow: 0 0 20px rgba(59, 130, 246, 0.5);
--surface-border: 1px solid rgba(59, 130, 246, 0.8);
```

---

## 🎭 配方格式

### 配方ID格式

七轴配方采用以下格式：

```
<mode>.<base>.<accent>.<tone>.<density>.<motion>.<surface>
```

**示例配方**：
```
dark.neutral-warm-high.mono(blue).vivid.comfortable.standard.soft-shadow
light.neutral-cool-mid.analog(green).calm.spacious.subtle.flat
hc.neutral-true-high.duo(red).standard.compact.expressive.neon
```

### 常用预设配方

#### 1. 商务蓝调
```
light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow
```

#### 2. 创意紫调
```
dark.neutral-warm-high.analog(purple).vivid.comfortable.standard.glass
```

#### 3. 科技青调
```
light.neutral-true-mid.duo(cyan).calm.spacious.subtle.flat
```

#### 4. 无障碍高对比
```
hc.neutral-true-high.mono(blue).standard.compact.expressive.flat
```

---

## 🛠️ 使用方法

### 基础配置

```tsx
import { ThemeProvider, ThemeAxisController } from '@xorigo-ui/core'

function App() {
  const [theme, setTheme] = useState({
    mode: 'light',
    base: 'neutral-cool-mid',
    accent: 'mono(blue)',
    tone: 'standard',
    density: 'comfortable',
    motion: 'standard.classic',
    surface: 'soft-shadow'
  })

  return (
    <ThemeProvider theme={theme}>
      <ThemeAxisController>
        {/* 你的应用内容 */}
      </ThemeAxisController>
    </ThemeProvider>
  )
}
```

### 动态切换

```tsx
function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()

  const toggleMode = () => {
    setTheme(prev => ({
      ...prev,
      mode: prev.mode === 'light' ? 'dark' : 'light'
    }))
  }

  const applyPreset = (preset: string) => {
    setTheme({
      mode: 'light',
      base: 'neutral-cool-mid',
      accent: 'mono(blue)',
      tone: 'standard',
      density: 'comfortable',
      motion: 'standard.classic',
      surface: 'soft-shadow'
    })
  }

  return (
    <div>
      <button onClick={toggleMode}>
        切换模式: {theme.mode}
      </button>
      <button onClick={() => applyPreset('business')}>
        应用商务配方
      </button>
    </div>
  )
}
```

### 预设配方使用

```tsx
import { presetThemes } from '@xorigo-ui/core/recipes'

function ThemeSelector() {
  return (
    <div>
      <h3>选择主题配方</h3>
      <select onChange={(e) => setTheme(presetThemes[e.target.value])}>
        <option value="business-blue">商务蓝调</option>
        <option value="creative-purple">创意紫调</option>
        <option value="tech-cyan">科技青调</option>
        <option value="minimal-gray">极简灰调</option>
        <option value="vibrant-sunset">活力日落</option>
      </select>
    </div>
  )
}
```

---

## 🔧 高级定制

### 自定义配方

```tsx
// 创建自定义配方
const customRecipe = {
  mode: 'dark',
  base: 'neutral-warm-high',
  accent: 'analog(orange)',
  tone: 'vivid',
  density: 'compact',
  motion: 'expressive.spring',
  surface: 'glass+neon'
}

// 应用自定义配方
<ThemeProvider theme={customRecipe}>
  <App />
</ThemeProvider>
```

### 扩展令牌

```css
/* 扩展设计令牌 */
:root {
  /* 自定义品牌色 */
  --color-brand-50: #fef3c7;
  --color-brand-500: #f59e0b;
  --color-brand-900: #78350f;

  /* 自定义语义色 */
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;

  /* 自定义阴影 */
  --shadow-brand: 0 10px 25px rgba(245, 158, 11, 0.15);
}
```

### CSS 变量访问

```css
/* 访问主题变量 */
.my-component {
  background-color: var(--color-background);
  color: var(--color-text);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
  transition: all var(--motion-duration) var(--motion-easing);
}

/* 使用条件样式 */
@media (prefers-reduced-motion: reduce) {
  .my-component {
    transition: none;
    animation: none;
  }
}
```

---

## 🎨 设计令牌映射

### 色彩系统映射

| 令牌 | 作用 | 动态来源 |
|------|------|----------|
| `--color-primary` | 主要操作色 | 强调色轴 |
| `--color-secondary` | 次要操作色 | 强调色轴 |
| `--color-background` | 背景色 | 模式轴 + 基础色轴 |
| `--color-text` | 文本色 | 模式轴 + 基础色轴 |
| `--color-border` | 边框色 | 基础色轴 + 色调轴 |

### 间距系统映射

| 令牌 | 值（舒适密度） | 动态来源 |
|------|----------------|----------|
| `--spacing-xs` | 4px | 密度轴 |
| `--spacing-sm` | 8px | 密度轴 |
| `--spacing-md` | 16px | 密度轴 |
| `--spacing-lg` | 24px | 密度轴 |
| `--spacing-xl` | 32px | 密度轴 |

### 动画系统映射

| 令牌 | 默认值 | 动态来源 |
|------|--------|----------|
| `--motion-duration-fast` | 150ms | 动效轴 |
| `--motion-duration-base` | 200ms | 动效轴 |
| `--motion-duration-slow` | 300ms | 动效轴 |
| `--motion-easing-in` | cubic-bezier(0.4, 0.0, 1, 1) | 动效轴 |
| `--motion-easing-out` | cubic-bezier(0.0, 0.0, 0.2, 1) | 动效轴 |

---

## 🧪 测试与验证

### 对比度测试

七轴系统内置对比度验证：

```tsx
import { useAccessibilityCheck } from '@xorigo-ui/core'

function AccessibilityMonitor() {
  const { contrastIssues, suggestions } = useAccessibilityCheck()

  return (
    <div>
      <h4>可访问性检查</h4>
      {contrastIssues.length > 0 && (
        <div>
          <p>发现 {contrastIssues.length} 个对比度问题</p>
          <ul>
            {contrastIssues.map((issue, index) => (
              <li key={index}>
                {issue.element}: {issue.ratio}:1
                (建议: {suggestion})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

### 配方验证

```tsx
import { validateThemeRecipe } from '@xorigo-ui/core'

function RecipeValidator({ recipe }) {
  const validation = validateThemeRecipe(recipe)

  return (
    <div>
      <h4>配方验证结果</h4>
      <p>状态: {validation.isValid ? '✅ 有效' : '❌ 无效'}</p>
      {validation.errors.length > 0 && (
        <div>
          <p>错误信息:</p>
          <ul>
            {validation.errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

---

## 📚 相关文档

### 📖 技术文档
- [主题系统SSOT](../shared/theme-system-ssot-v1.4.md) - 技术实现和架构
- [组件分类系统](../shared/component-classification-system.md) - 组件分类规范
- [设计令牌](design-tokens.md) - 设计令牌详细说明

### 🎯 使用指南
- [快速开始指南](../guides/getting-started.md) - 5分钟集成指南
- [组件总览](../components/README.md) - 所有可用组件
- [开发指南](../development/README.md) - 开发环境搭建

### 🔧 API 参考
- [主题API](../api/themes.md) - 完整的API文档
- [组件API](../api/components.md) - 组件API参考
- [工具函数](../api/utils.md) - 实用工具函数

---

## 🔄 版本历史

### v1.4 (当前版本)
- ✅ 完整的七轴主题系统
- ✅ 支持主题配方系统
- ✅ 内置可访问性验证
- ✅ 优化的性能表现

### v1.3 (已废弃)
- ❌ 轴轴定义与当前版本不兼容
- ❌ 配方格式已更新
- ❌ 建议升级到v1.4

---

**文档维护**: Xorigo UI 设计团队
**最后更新**: 2025年10月25日
**技术权威**: [主题系统SSOT v1.4](../shared/theme-system-ssot-v1.4.md)

---

> 💡 **提示**: 如需了解七轴系统的技术实现细节，请参考 [主题系统SSOT文档](../shared/theme-system-ssot-v1.4.md)。本文档专注于使用方法和最佳实践。