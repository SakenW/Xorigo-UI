# 语义令牌集成 Skill

**触发条件**：当需要集成设计令牌、验证主题兼容性、应用七轴配方系统时触发

## 功能描述

标准化 Xorigo UI 组件与七轴 DTCG 配方系统的集成，确保所有组件正确使用语义令牌，支持 10 种主题配方和动态主题切换。

## 核心能力

### 1. 语义令牌映射
将组件样式映射到七轴配方系统的语义令牌：

```typescript
// 七轴语义令牌映射系统
interface SemanticTokenMapping {
  // 七轴配方系统
  mode: 'light' | 'dark' | 'hc'           // 模式轴
  base: 'neutral-warm' | 'neutral-cool' | 'neutral-true'  // 基础轴
  accent: 'monochrome(gray)' | 'colorful'  // 色调轴
  tone: 'calm' | 'standard' | 'vivid'     // 色调强度轴
  density: 'spacious' | 'comfortable' | 'compact'  // 密度轴
  motion: 'subtle' | 'standard' | 'expressive'  // 动效轴
  surface: 'flat' | 'soft-shadow' | 'glass' | 'neon'  // 表面轴
}

// 语义令牌生成器
class SemanticTokenGenerator {
  generateTokenMapping(componentType: string, variant: string, state: string): {
    cssVariables: Record<string, string>
    semanticClasses: string[]
    fallbackValues: Record<string, string>
  } {
    const mapping = this.getComponentMapping(componentType, variant, state)

    return {
      cssVariables: {
        // 背景色令牌
        'background-color': 'var(--color-bg-primary)',
        'hover-background': 'var(--color-bg-primary-hover)',
        'active-background': 'var(--color-bg-primary-active)',

        // 文本色令牌
        'text-color': 'var(--color-text-primary)',
        'text-secondary': 'var(--color-text-secondary)',
        'text-tertiary': 'var(--color-text-tertiary)',

        // 边框色令牌
        'border-color': 'var(--border-primary)',
        'border-hover': 'var(--border-primary-hover)',

        // 交互令牌
        'transition': 'var(--transition-fast)',
        'shadow': 'var(--shadow-sm)',
        'radius': 'var(--radius-md)'
      },
      semanticClasses: [
        'bg-primary',
        'text-primary',
        'border-primary',
        'transition-fast'
      ],
      fallbackValues: {
        '--color-bg-primary': '#ffffff',
        '--color-text-primary': '#1a1a1a',
        '--border-primary': '#e0e0e0'
      }
    }
  }

  private getComponentMapping(type: string, variant: string, state: string): ComponentMapping {
    // 基于组件类型、变体和状态的映射逻辑
    const mappings = {
      button: {
        primary: {
          default: {
            background: '--color-primary-500',
            text: '--color-text-on-primary',
            border: '--border-primary-500'
          }
        },
        secondary: {
          default: {
            background: '--color-secondary-500',
            text: '--color-text-on-secondary',
            border: '--border-secondary-500'
          }
        }
      },
      card: {
        elevated: {
          default: {
            background: '--color-surface-primary',
            text: '--color-text-primary',
            border: '--border-surface',
            shadow: '--shadow-md'
          }
        }
      }
    }

    return mappings[type]?.[variant]?.[state] || mappings.button.primary.default
  }
}
```

### 2. 主题兼容性验证
验证组件在不同主题配方下的表现：

```typescript
// 主题兼容性验证器
class ThemeCompatibilityValidator {
  async validateComponentAcrossThemes(
    componentName: string,
    componentStyles: Record<string, string>
  ): Promise<{
    compatible: boolean
    issues: Array<{
      theme: string
      issue: string
      severity: 'error' | 'warning'
      recommendation: string
    }>
    recommendations: string[]
  }> {
    const themes = [
      'light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow',
      'dark.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow',
      'light.neutral-warm-vivid.colorful.standard.comfortable.standard.glass',
      // ... 其他 18 个主题配方
    ]

    const issues = []

    for (const theme of themes) {
      const themeIssues = await this.validateThemeCompatibility(theme, componentStyles)
      issues.push(...themeIssues.map(issue => ({ ...issue, theme })))
    }

    const errorIssues = issues.filter(i => i.severity === 'error')
    const compatible = errorIssues.length === 0

    return {
      compatible,
      issues,
      recommendations: this.generateRecommendations(issues)
    }
  }

  private async validateThemeCompatibility(
    theme: string,
    styles: Record<string, string>
  ): Promise<Array<{
    issue: string
    severity: 'error' | 'warning'
    recommendation: string
  }>> {
    const issues = []

    // 检查硬编码颜色
    Object.entries(styles).forEach(([property, value]) => {
      if (this.isHardcodedColor(value)) {
        issues.push({
          issue: `硬编码颜色值: ${property}: ${value}`,
          severity: 'error',
          recommendation: `使用语义令牌替换硬编码值，如: var(--color-primary-500)`
        })
      }
    })

    // 检查对比度
    if (styles.color && styles.backgroundColor) {
      const contrast = this.calculateContrast(styles.color, styles.backgroundColor)
      if (contrast < 4.5) {
        issues.push({
          issue: `颜色对比度不足: ${contrast.toFixed(2)} (WCAG 要求: 4.5)`,
          severity: 'error',
          recommendation: '调整颜色组合以提高对比度'
        })
      }
    }

    return issues
  }

  private isHardcodedColor(value: string): boolean {
    // 检测 hex, rgb, hsl 等硬编码颜色
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$|^rgb\(|^hsl\(/.test(value)
  }
}
```

### 3. 配方系统应用
应用七轴配方系统到组件样式：

```typescript
// 七轴配方应用器
class RecipeSystemApplier {
  applyRecipeToComponent(
    recipeId: string,
    componentStyles: Record<string, string>
  ): {
    transformedStyles: Record<string, string>
    recipeInfo: RecipeInfo
    cssClasses: string[]
  } {
    const recipe = this.parseRecipeId(recipeId)
    const transformedStyles = this.transformStyles(recipe, componentStyles)

    return {
      transformedStyles,
      recipeInfo: recipe,
      cssClasses: this.generateRecipeClasses(recipe)
    }
  }

  private parseRecipeId(recipeId: string): RecipeInfo {
    // 解析配方ID: light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow
    const parts = recipeId.split('.')

    return {
      mode: parts[0] as 'light' | 'dark' | 'hc',
      base: parts[1] as 'neutral-warm' | 'neutral-cool' | 'neutral-true',
      tone: parts[2] as 'calm' | 'standard' | 'vivid',
      accent: parts[3] as 'monochrome(gray)' | 'colorful',
      density: parts[4] as 'spacious' | 'comfortable' | 'compact',
      motion: parts[5] as 'subtle' | 'standard' | 'expressive',
      surface: parts[6] as 'flat' | 'soft-shadow' | 'glass' | 'neon'
    }
  }

  private transformStyles(recipe: RecipeInfo, styles: Record<string, string>): Record<string, string> {
    const transformed = { ...styles }

    // 根据配方转换样式
    Object.keys(transformed).forEach(property => {
      if (transformed[property].startsWith('var(--')) {
        transformed[property] = this.transformCSSVariable(recipe, transformed[property])
      }
    })

    return transformed
  }

  private transformCSSVariable(recipe: RecipeInfo, variable: string): string {
    // 根据配方转换 CSS 变量
    const variableMap = {
      '--color-primary-500': this.getColorVariable(recipe, 'primary', 500),
      '--color-bg-primary': this.getBackgroundVariable(recipe, 'primary'),
      '--color-text-primary': this.getTextVariable(recipe, 'primary'),
      '--border-primary': this.getBorderVariable(recipe, 'primary'),
      '--transition-fast': this.getTransitionVariable(recipe, 'fast'),
      '--shadow-md': this.getShadowVariable(recipe, 'md')
    }

    return variableMap[variable] || variable
  }
}
```

### 4. 动态主题切换
实现组件的动态主题切换功能：

```typescript
// 动态主题切换管理器
class DynamicThemeManager {
  private currentRecipe: string
  private subscribers: Set<(recipe: string) => void> = new Set()

  constructor(initialRecipe: string) {
    this.currentRecipe = initialRecipe
  }

  switchTheme(newRecipe: string): void {
    if (this.validateRecipe(newRecipe)) {
      this.currentRecipe = newRecipe
      this.applyThemeToDocument(newRecipe)
      this.notifySubscribers(newRecipe)
    } else {
      throw new Error(`无效的主题配方: ${newRecipe}`)
    }
  }

  subscribe(callback: (recipe: string) => void): () => void {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  private applyThemeToDocument(recipe: string): void {
    const root = document.documentElement
    const recipeInfo = this.parseRecipeId(recipe)

    // 应用主题变量
    root.style.setProperty('--recipe-mode', recipeInfo.mode)
    root.style.setProperty('--recipe-base', recipeInfo.base)
    root.style.setProperty('--recipe-tone', recipeInfo.tone)
    root.style.setProperty('--recipe-accent', recipeInfo.accent)
    root.style.setProperty('--recipe-density', recipeInfo.density)
    root.style.setProperty('--recipe-motion', recipeInfo.motion)
    root.style.setProperty('--recipe-surface', recipeInfo.surface)

    // 触发主题变化事件
    const event = new CustomEvent('themechange', { detail: { recipe, recipeInfo } })
    document.dispatchEvent(event)
  }

  private validateRecipe(recipe: string): boolean {
    // 验证配方格式
    const recipePattern = /^(light|dark|hc)\.(neutral-warm|neutral-cool|neutral-true)\.(calm|standard|vivid)\.(monochrome\(gray\)|colorful)\.(spacious|comfortable|compact)\.(subtle|standard|expressive)\.(flat|soft-shadow|glass|neon)$/
    return recipePattern.test(recipe)
  }
}
```

### 5. 组件样式生成器
生成符合七轴配方系统的组件样式：

```typescript
// 组件样式生成器
class ComponentStyleGenerator {
  generateComponentStyles(
    componentName: string,
    variants: ComponentVariant[]
  ): {
    css: string
    cssVariables: Record<string, string>
    utilityClasses: string[]
  } {
    const cssRules = []
    const cssVariables = {}
    const utilityClasses = []

    variants.forEach(variant => {
      const variantCSS = this.generateVariantCSS(componentName, variant)
      cssRules.push(variantCSS.css)
      Object.assign(cssVariables, variantCSS.variables)
      utilityClasses.push(...variantCSS.classes)
    })

    return {
      css: cssRules.join('\n\n'),
      cssVariables,
      utilityClasses: [...new Set(utilityClasses)]
    }
  }

  private generateVariantCSS(componentName: string, variant: ComponentVariant): {
    css: string
    variables: Record<string, string>
    classes: string[]
  } {
    const baseSelector = `.xorigo-${componentName}`
    const variantSelector = `${baseSelector}--${variant.name}`

    const css = `
${variantSelector} {
  /* 基础样式 */
  background-color: var(--color-bg-${variant.background || 'primary'});
  color: var(--color-text-${variant.text || 'primary'});
  border-color: var(--border-${variant.border || 'primary'});

  /* 交互样式 */
  transition: var(--transition-${variant.transition || 'fast'});

  /* 状态样式 */
  ${variant.states ? this.generateStateStyles(variantSelector, variant.states) : ''}
}

${variantSelector}:hover {
  background-color: var(--color-bg-${variant.background || 'primary'}-hover);
  border-color: var(--border-${variant.border || 'primary'}-hover);
}

${variantSelector}:active {
  background-color: var(--color-bg-${variant.background || 'primary'}-active);
}
    `.trim()

    const variables = {
      [`--color-bg-${variant.background || 'primary'}`]: this.getDefaultColor(variant.background, 'bg'),
      [`--color-text-${variant.text || 'primary'}`]: this.getDefaultColor(variant.text, 'text'),
      [`--border-${variant.border || 'primary'}`]: this.getDefaultColor(variant.border, 'border')
    }

    const classes = [
      `xorigo-${componentName}--${variant.name}`,
      `bg-${variant.background || 'primary'}`,
      `text-${variant.text || 'primary'}`
    ]

    return { css, variables, classes }
  }
}
```

## 令牌验证规则

### 颜色令牌规范
- **主色**: `--color-primary-{50|100|200|300|400|500|600|700|800|900}`
- **中性色**: `--color-neutral-{50|100|200|300|400|500|600|700|800|900}`
- **语义色**: `--color-bg-{primary|secondary|tertiary|surface}`
- **文本色**: `--color-text-{primary|secondary|tertiary|disabled}`
- **边框色**: `--border-{primary|secondary|tertiary|surface}`

### 交互令牌规范
- **过渡**: `--transition-{fast|normal|slow}`
- **阴影**: `--shadow-{none|sm|md|lg|xl}`
- **圆角**: `--radius-{none|sm|md|lg|xl|full}`
- **间距**: `--spacing-{1|2|3|4|5|6|8|10|12|16|20|24}`

### 运动令牌规范
- **缓动**: `--ease-{linear|in|out|in-out|bounce}`
- **持续时间**: `--duration-{fast|normal|slow}`

## 使用示例

```bash
# 应用七轴配方
"将 Button 组件应用七轴配方: light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow"

# 验证主题兼容性
"验证 Card 组件在所有 20 种主题配方下的兼容性"

# 生成语义令牌
"为新的 Badge 组件生成语义令牌映射，支持所有变体和状态"

# 动态主题切换
"实现组件的动态主题切换功能，支持实时切换七轴配方"
```

## 输出格式

1. **CSS 变量**: 完整的语义令牌 CSS 变量定义
2. **样式类**: 符合七轴系统的样式类
3. **主题配置**: 支持所有主题配方的配置
4. **验证报告**: 主题兼容性验证结果

## 技术依据

基于 Xorigo UI 的七轴 DTCG 配方系统：

- **七轴控制**: 模式/基础/色调/强度/密度/动效/表面
- **20 种配方**: 覆盖所有常见使用场景的主题组合
- **语义令牌**: 符合 W3C Design Tokens 规范的令牌体系
- **动态切换**: 运行时主题切换，无需重新加载

确保所有组件与主题系统完美集成，提供一致的用户体验。