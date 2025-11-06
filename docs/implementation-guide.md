# 🎨 Xorigo UI 26参数七轴主题系统实现指南

## 📚 快速开始

### 1. 安装和使用

```tsx
import React from 'react'
import { ThemeConfigurator } from '@xorigo-ui/core'
import { BUILT_IN_THEMES } from '@xorigo-ui/core'

function MyApp() {
  const handleThemeChange = (params, result) => {
    console.log('主题已更新:', params)
    console.log('CSS变量:', result.cssVariables)
  }

  return (
    <ThemeConfigurator
      initialParams={/* 可选：初始参数 */}
      presetThemes={BUILT_IN_THEMES}
      onParamsChange={handleThemeChange}
      showPresets={true}
      showExport={true}
    />
  )
}
```

### 2. 高级主题Hook

```tsx
import { useAdvancedTheme } from '@xorigo-ui/core'

function MyComponent() {
  const { params, result, updateParams, reset } = useAdvancedTheme()

  // 更新色调
  const changeHue = (hue: number) => {
    updateParams(prev => ({
      ...prev,
      hue: { ...prev.hue, primary: hue }
    }))
  }

  return (
    <div>
      <p>当前主色调: {params.hue.primary}°</p>
      <button onClick={() => changeHue(240)}>切换到蓝色</button>
      <button onClick={reset}>重置</button>
    </div>
  )
}
```

## 🏗️ 架构概览

### 核心模块

```
packages/core/src/theme/advanced/
├── twenty-six-params.ts          # 类型定义和默认值
├── param-calculators.ts          # 参数计算引擎
├── ThemeConfigurator.tsx         # 主配置器组件
├── controls/                     # 参数控制组件
│   ├── SevenAxisControls.tsx     # 七轴控制面板
│   ├── mode/ModeSelector.tsx     # 模式选择器
│   ├── hue/HueSelector.tsx       # 色调选择器 (360°色相环)
│   ├── saturation/SaturationSlider.tsx
│   ├── lightness/LightnessSlider.tsx
│   ├── density/DensitySelector.tsx
│   ├── roundness/RoundnessSlider.tsx
│   └── contrast/ContrastSelector.tsx
├── preview/                      # 预览组件
│   └── ThemePreview.tsx
└── presets/                      # 预设主题
    └── built-in-themes.ts        # 20+ 内置主题
```

### 参数体系

#### 七轴核心 (7个参数)
1. **模式轴** - `mode`: light/dark/auto/sepia
2. **色调轴** - `hue.primary`: 0-360°
3. **饱和度轴** - `saturation.factor`: 0-1
4. **亮度轴** - `lightness.factor`: 0-1
5. **密度轴** - `density.level`: compact/comfortable/spacious
6. **圆度轴** - `roundness.level`: 0-1
7. **对比度轴** - `contrast.level`: low/normal/high/custom

#### 字体系统 (5个参数)
- `fonts.primary` - 主字体
- `fonts.secondary` - 次字体
- `fonts.mono` - 等宽字体
- `fonts.display` - 标题字体
- `fonts.code` - 代码字体

#### 尺寸比例 (6个参数)
- `sizes.xs` - 极小
- `sizes.sm` - 小
- `sizes.md` - 中
- `sizes.lg` - 大
- `sizes.xl` - 极大
- `sizes.2xl` - 超大

#### 间距系统 (8个参数)
- `spacing.space0` - 0级 (0px)
- `spacing.space1` - 1级 (4px)
- `spacing.space2` - 2级 (8px)
- `spacing.space3` - 3级 (12px)
- `spacing.space4` - 4级 (16px)
- `spacing.space5` - 5级 (20px)
- `spacing.space6` - 6级 (24px)
- `spacing.space7` - 7级 (32px)

## 🎛️ 组件使用

### 单独使用控制组件

```tsx
import { HueSelector } from '@xorigo-ui/core'

function MyHueControl() {
  const [hue, setHue] = React.useState(240)

  return (
    <HueSelector
      primary={hue}
      onPrimaryChange={setHue}
      showSecondary={true}
      showAccent={true}
    />
  )
}
```

### 自定义预览组件

```tsx
import { ThemePreview } from '@xorigo-ui/core'

function CustomPreview({ params }) {
  return (
    <div style={{
      color: `hsl(${params.hue.primary}, 50%, 50%)`,
      fontFamily: params.fonts.primary.family
    }}>
      <h1>自定义预览</h1>
      <p>主色调: {params.hue.primary}°</p>
    </div>
  )
}

function MyApp() {
  return (
    <ThemeConfigurator
      customPreview={CustomPreview}
    />
  )
}
```

### 应用主题到你的应用

```tsx
import { useEffect } from 'react'
import { calculateAdvancedTheme } from '@xorigo-ui/core'

function AppThemeProvider({ children, themeParams }) {
  useEffect(() => {
    // 计算主题
    calculateAdvancedTheme(themeParams).then(result => {
      // 应用CSS变量到根元素
      const root = document.documentElement
      Object.entries(result.cssVariables).forEach(([key, value]) => {
        root.style.setProperty(key, value)
      })
    })
  }, [themeParams])

  return <>{children}</>
}
```

## 🎨 预设主题

### 内置主题列表

```tsx
import { BUILT_IN_THEMES } from '@xorigo-ui/core'

// 获取所有主题
const allThemes = BUILT_IN_THEMES

// 获取热门主题
const popularThemes = allThemes.filter(t => t.isPopular)

// 获取特定分类
const corporateThemes = allThemes.filter(t => t.category === '企业专业')

// 搜索主题
const searchResults = allThemes.filter(t =>
  t.name.includes('蓝色') || t.tags.includes('blue')
)
```

### 创建自定义主题

```tsx
import type { PresetTheme, TwentySixParams } from '@xorigo-ui/core'

const myCustomTheme: PresetTheme = {
  id: 'my-theme',
  name: '我的主题',
  description: '自定义主题描述',
  category: '创意设计',
  tags: ['custom', 'blue', 'minimal'],
  author: 'Your Name',
  rating: 5.0,
  downloads: 0,
  createdAt: new Date(),
  updatedAt: new Date(),

  parameters: {
    // 26个参数的具体配置
    mode: { mode: 'light', autoDetectSystem: true, sepiaIntensity: 0 },
    hue: { primary: 200, secondary: 220, accent: 180 },
    // ... 其他参数
  }
}
```

### 导出和导入主题

```tsx
// 导出主题
function exportTheme(params: TwentySixParams) {
  const data = {
    version: '1.0.0',
    name: 'My Theme',
    parameters: params
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  })

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'my-theme.json'
  a.click()
}

// 导入主题
function importTheme(file: File): Promise<TwentySixParams> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string)
        resolve(data.parameters)
      } catch (error) {
        reject(error)
      }
    }
    reader.readAsText(file)
  })
}
```

## ⚡ 性能优化

### 防抖和节流

```tsx
// 自动防抖 (150ms)
updateParams(newParams)

// 立即计算
updateParams(newParams, true)

// 手动节流
const throttledUpdate = useCallback(
  throttle((params) => updateParams(params), 100),
  []
)
```

### 缓存管理

```tsx
import { twentySixParamCalculator } from '@xorigo-ui/core'

// 获取缓存统计
const stats = twentySixParamCalculator.getCacheStats()
console.log('缓存大小:', stats)

// 清空缓存
twentySixParamCalculator.clearCache()
```

### 批量更新

```tsx
// 合并多次更新为一次渲染
updateParams(prev => ({
  ...prev,
  hue: { ...prev.hue, primary: 240 },
  saturation: { ...prev.saturation, factor: 0.6 }
}))
```

## 🔧 高级配置

### 自定义计算逻辑

```tsx
import { TwentySixParamCalculator } from '@xorigo-ui/core'

// 扩展计算器
class CustomCalculator extends TwentySixParamCalculator {
  async calculateColorScale(hue, saturation, lightness, mode) {
    // 自定义颜色计算逻辑
    return super.calculateColorScale(hue, saturation, lightness, mode)
  }
}

const customCalculator = new CustomCalculator()
```

### 集成现有设计系统

```tsx
// 转换为Tailwind配置
function themeToTailwindConfig(params: TwentySixParams) {
  return {
    colors: {
      primary: params.hue.primary,
      // ... 其他颜色映射
    },
    spacing: Object.entries(params.spacing).reduce((acc, [key, value]) => {
      acc[key] = `${value}px`
      return acc
    }, {} as Record<string, string>)
  }
}
```

## 📱 响应式设计

### 移动端适配

```tsx
<ThemeConfigurator
  height="100vh"
  className="theme-configurator--mobile"
  // 移动端可以隐藏某些面板
  showExport={isDesktop}
/>
```

### 触摸交互优化

```tsx
// 移动端支持
const isMobile = /Android|iPhone|iPad/.test(navigator.userAgent)

// 色相环支持触摸
<div
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
/>
```

## 🧪 测试

### 参数验证测试

```tsx
import { validateTwentySixParams } from '@xorigo-ui/core'

test('validates theme params', () => {
  const validParams = { /* 有效参数 */ }
  expect(validateTwentySixParams(validParams)).toBe(true)

  const invalidParams = { hue: { primary: 500 } } // 无效色相
  expect(validateTwentySixParams(invalidParams)).toBe(false)
})
```

### 性能测试

```tsx
test('theme calculation performance', async () => {
  const start = performance.now()
  await calculateAdvancedTheme(params)
  const duration = performance.now() - start

  expect(duration).toBeLessThan(100) // 100ms内完成
})
```

## 📖 更多资源

- [完整设计规范](./seven-axis-theme-system-26-params.md)
- [API 文档](../packages/core/src/theme/advanced/)
- [示例代码](../examples/)
- [在线演示](https://example.com)

## 🤝 贡献

欢迎提交自定义主题和功能改进！

1. Fork 项目
2. 创建特性分支
3. 提交更改
4. 推送到分支
5. 创建Pull Request

---

**注意**: 本系统需要 React 19+ 和 TypeScript 5.9+ 支持。
