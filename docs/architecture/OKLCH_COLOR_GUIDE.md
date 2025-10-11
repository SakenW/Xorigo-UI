# 🌈 TH-UI OKLCH 色彩系统技术文档

> **核心理念**：基于感知均匀的 OKLCH 色彩空间，动态生成高质量、可访问的配色方案

---

## 📐 OKLCH 色彩空间简介

### 什么是 OKLCH？

OKLCH 是基于人类视觉感知的色彩空间，是 Oklab 的圆柱坐标变体。

**三个维度**：
- **L (Lightness)**: 亮度 (0-1)
- **C (Chroma)**: 色度/饱和度 (0-0.4)
- **H (Hue)**: 色相 (0-360°)

### 为什么选择 OKLCH？

| 特性 | OKLCH | HSL/HSV | RGB |
|------|-------|---------|-----|
| **感知均匀** | ✅ 完全均匀 | ❌ 不均匀 | ❌ 不均匀 |
| **亮度一致** | ✅ 同样的 L 值视觉亮度相同 | ❌ 不同色相亮度差异大 | ❌ 数值亮度 ≠ 视觉亮度 |
| **色相准确** | ✅ 360° 色相环准确 | ⚠️ 较准确但有偏差 | ❌ 无色相概念 |
| **可访问性** | ✅ 易于计算对比度 | ⚠️ 需要转换 | ⚠️ 需要转换 |
| **动画流畅** | ✅ 插值自然 | ❌ 色相跳跃 | ❌ 不自然 |

### OKLCH 示例对比

```typescript
// ❌ HSL: 同样的亮度值，视觉亮度差异巨大
const hslBlue = 'hsl(240, 100%, 50%)'   // 视觉上很暗
const hslYellow = 'hsl(60, 100%, 50%)'  // 视觉上很亮

// ✅ OKLCH: 同样的亮度值，视觉亮度一致
const oklchBlue = 'oklch(0.5 0.15 240)'    // 视觉亮度 0.5
const oklchYellow = 'oklch(0.5 0.15 60)'   // 视觉亮度 0.5
```

---

## 🎨 TH-UI 色彩生成策略

### 1. 单色策略 (Monochromatic)

**用途**：`accent: 'mono(blue)'`

**生成逻辑**：
```typescript
class MonochromaticStrategy implements ColorStrategy {
  generatePalette(baseHue: number, recipe: StyleRecipe): ColorScale {
    const palette: ColorScale = {}

    // 根据 tone 轴调整色度
    const chromaMultiplier = {
      'calm': 0.6,        // 低饱和度
      'standard': 1.0,    // 标准饱和度
      'vivid': 1.4,       // 高饱和度
      'vibrant': 1.7,     // 超高饱和度
    }[recipe.tone]

    // 生成 11 个色阶 (50-950)
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

    for (const step of steps) {
      // 计算亮度（反 S 曲线）
      const lightness = this.calculateLightness(step, recipe.mode)

      // 计算色度（中间色阶最高）
      const baseChroma = this.calculateChroma(step)
      const chroma = baseChroma * chromaMultiplier

      // 生成颜色
      palette[step] = oklchToHex({
        l: lightness,
        c: chroma,
        h: baseHue,
      })
    }

    return palette
  }

  private calculateLightness(step: number, mode: ModeAxis): number {
    // 标准化到 0-1 范围
    const normalized = step / 1000

    if (mode === 'dark') {
      // 暗色模式：反转亮度曲线
      // 50 → 0.95 (最亮)
      // 500 → 0.5 (中等)
      // 950 → 0.05 (最暗)
      return 1 - normalized
    }

    // 亮色模式：正常亮度曲线
    // 50 → 0.95 (最亮)
    // 500 → 0.5 (中等)
    // 950 → 0.05 (最暗)
    return 1 - normalized
  }

  private calculateChroma(step: number): number {
    // 500 色阶色度最高，两端递减
    // 这样可以避免极亮/极暗色过于鲜艳
    const distance = Math.abs(step - 500) / 500
    const baseChroma = 0.15 // 基础色度

    // 抛物线衰减
    return baseChroma * (1 - distance * 0.5)
  }
}
```

**生成结果示例**：
```typescript
// mono(blue) + tone: vivid + mode: light
{
  50:  'oklch(0.95 0.08 240)',  // 极浅蓝
  100: 'oklch(0.90 0.10 240)',
  200: 'oklch(0.80 0.13 240)',
  300: 'oklch(0.70 0.16 240)',
  400: 'oklch(0.60 0.18 240)',
  500: 'oklch(0.50 0.21 240)',  // 主色调
  600: 'oklch(0.40 0.18 240)',
  700: 'oklch(0.30 0.16 240)',
  800: 'oklch(0.20 0.13 240)',
  900: 'oklch(0.10 0.10 240)',
  950: 'oklch(0.05 0.08 240)',  // 极深蓝
}
```

### 2. 类似色策略 (Analogous)

**用途**：`accent: 'analog(purple)'`

**生成逻辑**：
```typescript
class AnalogousStrategy implements ColorStrategy {
  generatePalette(baseHue: number, recipe: StyleRecipe): ColorScale {
    // 提取主色：analog(purple) → 'purple' → 280°
    const mainColor = recipe.accent.match(/\((\w+)\)/)?.[1] || 'blue'
    const mainHue = this.colorToHue(mainColor)

    // 生成主色板（使用单色策略）
    const strategy = new MonochromaticStrategy()
    return strategy.generatePalette(mainHue, recipe)
  }

  private colorToHue(colorName: string): number {
    // 色相映射表（基于 OKLCH 优化）
    const hueMap: Record<string, number> = {
      'red': 0,
      'orange': 30,
      'yellow': 80,      // OKLCH 中黄色偏移更大
      'lime': 120,
      'green': 140,
      'cyan': 180,
      'blue': 240,
      'indigo': 260,
      'purple': 280,
      'magenta': 320,
    }

    return hueMap[colorName] || 240
  }
}
```

**扩展功能 - 次要色生成**：
```typescript
// 生成次要色（±30° 色相范围）
interface AnalogousColors {
  main: ColorScale      // 主色（例如 purple 280°）
  secondary: ColorScale // 次要色（例如 blue 250°）
  tertiary: ColorScale  // 第三色（例如 magenta 310°）
}

function generateAnalogousPalette(recipe: StyleRecipe): AnalogousColors {
  const mainHue = colorToHue(extractColor(recipe.accent))
  const secondaryHue = (mainHue - 30 + 360) % 360
  const tertiaryHue = (mainHue + 30) % 360

  return {
    main: strategy.generatePalette(mainHue, recipe),
    secondary: strategy.generatePalette(secondaryHue, recipe),
    tertiary: strategy.generatePalette(tertiaryHue, recipe),
  }
}
```

### 3. 双色策略 (Duotone)

**用途**：`accent: 'duo(cyan,magenta)'`

**生成逻辑**：
```typescript
class DuotoneStrategy implements ColorStrategy {
  generatePalette(baseHue: number, recipe: StyleRecipe): ColorScale {
    // 解析双色：duo(cyan,magenta) → [180°, 320°]
    const [color1, color2] = this.extractColors(recipe.accent)
    const hue1 = this.colorToHue(color1)
    const hue2 = this.colorToHue(color2)

    const palette: ColorScale = {}
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

    for (const step of steps) {
      // 计算色相混合比例
      // 浅色阶 → color1
      // 深色阶 → color2
      const mixRatio = (step - 50) / 900 // 0-1 范围
      const hue = this.interpolateHue(hue1, hue2, mixRatio)

      const lightness = this.calculateLightness(step, recipe.mode)
      const chroma = this.calculateChroma(step) * this.getToneMultiplier(recipe.tone)

      palette[step] = oklchToHex({ l: lightness, c: chroma, h: hue })
    }

    return palette
  }

  private interpolateHue(hue1: number, hue2: number, ratio: number): number {
    // 色相环最短路径插值
    let diff = hue2 - hue1

    // 处理色相环边界
    if (diff > 180) diff -= 360
    if (diff < -180) diff += 360

    return (hue1 + diff * ratio + 360) % 360
  }

  private extractColors(accent: string): [string, string] {
    const match = accent.match(/duo\((\w+),(\w+)\)/)
    return match ? [match[1], match[2]] : ['blue', 'purple']
  }
}
```

### 4. 三色策略 (Triadic)

**用途**：`accent: 'triadic(blue)'`

**生成逻辑**：
```typescript
class TriadicStrategy implements ColorStrategy {
  generatePalette(baseHue: number, recipe: StyleRecipe): TriadicColors {
    // 三色：120° 间隔
    const mainHue = this.colorToHue(extractColor(recipe.accent))
    const secondaryHue = (mainHue + 120) % 360
    const tertiaryHue = (mainHue + 240) % 360

    return {
      main: this.generateMonoPalette(mainHue, recipe),
      secondary: this.generateMonoPalette(secondaryHue, recipe),
      tertiary: this.generateMonoPalette(tertiaryHue, recipe),
    }
  }
}
```

---

## 🎯 中性色生成策略

### Base 轴参数解析

```typescript
// base: 'neutral-warm-mid'
//       ↑       ↑    ↑
//    类型    色温  色度等级
```

**色温 (Temperature)**：
- `warm`: 暖色调（色相 30°）
- `cool`: 冷色调（色相 230°）
- `true`: 无色调（色度 0）

**色度等级 (Chroma Level)**：
- `low`: 0.005 (几乎无色)
- `mid`: 0.01 (轻微色彩)
- `high`: 0.02 (明显色彩)

### 实现代码

```typescript
class NeutralColorGenerator {
  generateNeutralPalette(base: BaseAxis, mode: ModeAxis): ColorScale {
    // 解析参数
    const [_, temp, level] = base.split('-')

    // 色温映射
    const hueMap = {
      'warm': 30,   // 橙色调
      'cool': 230,  // 蓝色调
      'true': 0,    // 无色调
    }

    // 色度映射
    const chromaMap = {
      'low': 0.005,
      'mid': 0.01,
      'high': 0.02,
    }

    const hue = hueMap[temp] || 0
    const baseChroma = chromaMap[level] || 0.01

    const palette: ColorScale = {}
    const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

    for (const step of steps) {
      const lightness = this.calculateLightness(step, mode)

      // 中性色的色度随亮度变化
      // 极亮/极暗时色度接近 0
      const distance = Math.abs(step - 500) / 500
      const chroma = baseChroma * (1 - distance * 0.3)

      palette[step] = oklchToHex({
        l: lightness,
        c: chroma,
        h: hue,
      })
    }

    return palette
  }
}
```

---

## 🌓 暗色模式对称映射

### 对称原则

```typescript
// 亮色模式
primary-50  → 非常浅的蓝色 (oklch(0.95 0.08 240))
primary-500 → 标准蓝色     (oklch(0.50 0.21 240))
primary-950 → 非常深的蓝色 (oklch(0.05 0.08 240))

// 暗色模式（自动反转）
primary-50  → 非常深的蓝色 (oklch(0.05 0.08 240))
primary-500 → 标准蓝色     (oklch(0.50 0.21 240))
primary-950 → 非常浅的蓝色 (oklch(0.95 0.08 240))
```

### 实现逻辑

```typescript
function applyDarkModeMapping(
  lightPalette: ColorScale,
  mode: ModeAxis
): ColorScale {
  if (mode !== 'dark') return lightPalette

  // 反转映射
  return {
    50: lightPalette[950],
    100: lightPalette[900],
    200: lightPalette[800],
    300: lightPalette[700],
    400: lightPalette[600],
    500: lightPalette[500],  // 中间色保持不变
    600: lightPalette[400],
    700: lightPalette[300],
    800: lightPalette[200],
    900: lightPalette[100],
    950: lightPalette[50],
  }
}
```

---

## 🔧 OKLCH 转换工具

### 核心转换函数

```typescript
/**
 * OKLCH 转 sRGB
 */
function oklchToRGB(l: number, c: number, h: number): [number, number, number] {
  // 1. OKLCH → Oklab
  const a = c * Math.cos((h * Math.PI) / 180)
  const b = c * Math.sin((h * Math.PI) / 180)

  // 2. Oklab → Linear sRGB (矩阵变换)
  const l_ = l + 0.3963377774 * a + 0.2158037573 * b
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b
  const s_ = l - 0.0894841775 * a - 1.2914855480 * b

  const l3 = l_ * l_ * l_
  const m3 = m_ * m_ * m_
  const s3 = s_ * s_ * s_

  const lr = +4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3
  const lg = -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3
  const lb = -0.0041960863 * l3 - 0.7034186147 * m3 + 1.7076147010 * s3

  // 3. Linear sRGB → sRGB (gamma correction)
  const r = srgbGamma(lr)
  const g = srgbGamma(lg)
  const b = srgbGamma(lb)

  return [r, g, b]
}

/**
 * sRGB Gamma Correction
 */
function srgbGamma(value: number): number {
  if (value <= 0.0031308) {
    return 12.92 * value
  }
  return 1.055 * Math.pow(value, 1 / 2.4) - 0.055
}

/**
 * OKLCH 转 HEX
 */
function oklchToHex(color: { l: number; c: number; h: number }): string {
  const [r, g, b] = oklchToRGB(color.l, color.c, color.h)

  // RGB 范围限制 [0, 1]
  const clamp = (v: number) => Math.max(0, Math.min(1, v))

  const toHex = (v: number) => {
    const int = Math.round(clamp(v) * 255)
    return int.toString(16).padStart(2, '0')
  }

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}
```

### 色域限制处理

```typescript
/**
 * 检查颜色是否在 sRGB 色域内
 */
function isInSRGBGamut(l: number, c: number, h: number): boolean {
  const [r, g, b] = oklchToRGB(l, c, h)
  return r >= 0 && r <= 1 && g >= 0 && g <= 1 && b >= 0 && b <= 1
}

/**
 * 色度裁剪（保持色相和亮度）
 */
function clipChroma(l: number, c: number, h: number): number {
  // 二分查找最大可用色度
  let low = 0
  let high = c
  let result = 0

  while (high - low > 0.001) {
    const mid = (low + high) / 2

    if (isInSRGBGamut(l, mid, h)) {
      result = mid
      low = mid
    } else {
      high = mid
    }
  }

  return result
}

/**
 * 安全的 OKLCH 转 HEX（自动裁剪）
 */
function safeOklchToHex(color: { l: number; c: number; h: number }): string {
  const { l, c, h } = color

  // 如果超出色域，裁剪色度
  if (!isInSRGBGamut(l, c, h)) {
    const clippedC = clipChroma(l, c, h)
    return oklchToHex({ l, c: clippedC, h })
  }

  return oklchToHex(color)
}
```

---

## ♿ 可访问性计算

### WCAG 对比度计算

```typescript
/**
 * 计算 WCAG 2.1 对比度
 */
function calculateContrast(color1: string, color2: string): number {
  const l1 = getRelativeLuminance(color1)
  const l2 = getRelativeLuminance(color2)

  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)

  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * 获取相对亮度
 */
function getRelativeLuminance(hex: string): number {
  const rgb = hexToRGB(hex)

  // 线性化
  const [r, g, b] = rgb.map(v => {
    const normalized = v / 255
    return normalized <= 0.03928
      ? normalized / 12.92
      : Math.pow((normalized + 0.055) / 1.055, 2.4)
  })

  // ITU-R BT.709 系数
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/**
 * 检查对比度是否符合 WCAG 标准
 */
function meetsWCAG(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA'
): {
  normal: boolean  // 普通文本
  large: boolean   // 大文本
  contrast: number
} {
  const contrast = calculateContrast(foreground, background)

  const thresholds = {
    'AA': { normal: 4.5, large: 3 },
    'AAA': { normal: 7, large: 4.5 },
  }

  return {
    normal: contrast >= thresholds[level].normal,
    large: contrast >= thresholds[level].large,
    contrast,
  }
}
```

### 自动对比度优化

```typescript
/**
 * 调整颜色以满足对比度要求
 */
function adjustForContrast(
  foreground: { l: number; c: number; h: number },
  background: string,
  targetContrast: number = 4.5
): string {
  let { l, c, h } = foreground

  // 尝试调整亮度
  for (let i = 0; i < 100; i++) {
    const testColor = oklchToHex({ l, c, h })
    const contrast = calculateContrast(testColor, background)

    if (contrast >= targetContrast) {
      return testColor
    }

    // 根据背景亮度决定调整方向
    const bgLuminance = getRelativeLuminance(background)
    l = bgLuminance > 0.5 ? l - 0.01 : l + 0.01

    // 边界检查
    if (l < 0 || l > 1) break
  }

  return oklchToHex(foreground)
}
```

---

## 📊 完整配方生成流程

```typescript
class OKLCHColorEngine {
  /**
   * 从七轴配方生成完整色板
   */
  generateColorPalette(recipe: StyleRecipe): {
    primary: ColorScale
    neutral: ColorScale
    success: ColorScale
    warning: ColorScale
    error: ColorScale
    info: ColorScale
  } {
    // 1. 解析 accent 策略
    const strategyType = this.parseAccentStrategy(recipe.accent)
    const strategy = this.getStrategy(strategyType)

    // 2. 解析主色
    const mainColor = this.extractMainColor(recipe.accent)
    const mainHue = this.colorToHue(mainColor)

    // 3. 生成主色板
    const primary = strategy.generatePalette(mainHue, recipe)

    // 4. 生成中性色板
    const neutral = this.generateNeutralPalette(recipe.base, recipe.mode)

    // 5. 生成状态色板
    const success = strategy.generatePalette(140, recipe)  // 绿色
    const warning = strategy.generatePalette(80, recipe)   // 黄色
    const error = strategy.generatePalette(0, recipe)      // 红色
    const info = strategy.generatePalette(200, recipe)     // 青色

    // 6. 应用暗色模式映射
    if (recipe.mode === 'dark') {
      return {
        primary: applyDarkModeMapping(primary, 'dark'),
        neutral: applyDarkModeMapping(neutral, 'dark'),
        success: applyDarkModeMapping(success, 'dark'),
        warning: applyDarkModeMapping(warning, 'dark'),
        error: applyDarkModeMapping(error, 'dark'),
        info: applyDarkModeMapping(info, 'dark'),
      }
    }

    return { primary, neutral, success, warning, error, info }
  }
}
```

---

## 🔬 测试和验证

### 色彩质量测试

```typescript
/**
 * 验证色板质量
 */
function validateColorPalette(palette: ColorScale): {
  valid: boolean
  errors: string[]
  warnings: string[]
} {
  const errors: string[] = []
  const warnings: string[] = []

  const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

  // 1. 检查亮度单调性
  for (let i = 0; i < steps.length - 1; i++) {
    const l1 = rgbToOklch(hexToRGB(palette[steps[i]])).l
    const l2 = rgbToOklch(hexToRGB(palette[steps[i + 1]])).l

    if (l1 <= l2) {
      errors.push(`亮度不单调：${steps[i]} → ${steps[i + 1]}`)
    }
  }

  // 2. 检查对比度
  const bg = palette[50]
  const text = palette[900]
  const contrast = calculateContrast(text, bg)

  if (contrast < 4.5) {
    warnings.push(`文本对比度不足：${contrast.toFixed(2)} (需要 ≥4.5)`)
  }

  // 3. 检查色域
  for (const step of steps) {
    const color = hexToRGB(palette[step])
    if (color.some(v => v < 0 || v > 255)) {
      errors.push(`颜色超出 sRGB 色域：step ${step}`)
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}
```

---

## 📚 参考资源

### 规范和标准
- [OKLCH Color Space](https://bottosson.github.io/posts/oklab/)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/)

### 工具和库
- [culori](https://culorijs.org/) - 色彩空间转换库
- [color.js](https://colorjs.io/) - 现代色彩操作库
- [OKLCH Color Picker](https://oklch.com/) - 在线 OKLCH 选择器

### TH-UI 内部文档
- [七轴风格配方体系](./SEVEN_AXIS_SYSTEM_GUIDE.md)
- [完整新系统架构](./NEW_SYSTEM_COMPLETE_GUIDE.md)
- [组件迁移指南](./COMPONENT_MIGRATION_GUIDE.md)

---

**创建时间**: 2025-01-13
**最后更新**: 2025-01-13
**状态**: 📚 技术参考
**负责人**: TH-UI Team
