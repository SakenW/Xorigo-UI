# Matrix 规则与验证系统

## 概述

Matrix 规则系统用于管理样式配方的合法性验证、对比度检查和组合约束。确保所有配方组合都符合可访问性标准，并在 Gallery 中提供可视化热力图反馈。

## 核心功能

### 1. 对比度验证 (WCAG AA/AAA)
- 文本/背景对比度检查
- 交互元素对比度验证
- 状态可访问性验证 (disabled, focus, hover)
- 动态对比度计算

### 2. 非法组合检测
- 语义冲突检测 (ghost + disabled + focus)
- 视觉冲突检测 (低对比度 + 小字号)
- 交互冲突检测 (disabled + interactive states)
- 主题一致性验证

### 3. 热力图可视化
- Gallery 中的合规性热力图
- 违规项高亮显示
- 实时验证反馈
- 建议修复方案

### 4. 国际化支持 (i18n)
- 多语言错误信息
- 本地化评分标准
- 区域性可访问性规范
- 动态语言切换

## 矩阵数据结构

### matrix.json Schema

```json
{
  "$schema": "./schema.json",
  "version": "1.0.0",
  "metadata": {
    "generated": "2025-01-15T10:00:00Z",
    "totalRecipes": 10,
    "totalComponents": 17,
    "validationLevel": "AA",
    "lastValidation": "2025-01-15T10:00:00Z"
  },
  "contrastRequirements": {
    "WCAG_AA": {
      "normalText": 4.5,
      "largeText": 3.0,
      "interactive": 3.0,
      "disabled": 3.0
    },
    "WCAG_AAA": {
      "normalText": 7.0,
      "largeText": 4.5,
      "interactive": 4.5,
      "disabled": 4.5
    }
  },
  "recipeMatrix": {
    "professional-blue": {
      "metadata": {
        "name": "专业蓝",
        "category": "business",
        "status": "stable",
        "lastModified": "2025-01-15T08:30:00Z"
      },
      "components": {
        "Button": {
          "variants": {
            "primary": {
              "states": {
                "default": {
                  "contrast": {
                    "textOnBackground": 8.5,
                    "borderOnBackground": 4.2,
                    "interactive": 8.5,
                    "status": "pass",
                    "level": "AAA"
                  },
                  "accessibility": {
                    "screenReader": true,
                    "keyboard": true,
                    "touch": true,
                    "colorBlind": {
                      "protanopia": "pass",
                      "deuteranopia": "pass",
                      "tritanopia": "pass"
                    }
                  }
                },
                "hover": {
                  "contrast": {
                    "textOnBackground": 9.2,
                    "borderOnBackground": 4.8,
                    "interactive": 9.2,
                    "status": "pass",
                    "level": "AAA"
                  }
                },
                "focus": {
                  "contrast": {
                    "textOnBackground": 8.8,
                    "borderOnBackground": 3.8,
                    "focusIndicator": 4.5,
                    "status": "pass",
                    "level": "AA"
                  }
                },
                "disabled": {
                  "contrast": {
                    "textOnBackground": 2.8,
                    "borderOnBackground": 2.1,
                    "interactive": 2.8,
                    "status": "fail",
                    "level": "none",
                    "reason": "disabled state below contrast threshold"
                  },
                  "accessibility": {
                    "screenReader": true,
                    "keyboard": false,
                    "touch": false
                  }
                }
              }
            },
            "secondary": {
              "states": {
                "default": {
                  "contrast": {
                    "textOnBackground": 7.2,
                    "status": "pass",
                    "level": "AA"
                  }
                }
              }
            },
            "outline": {
              "states": {
                "default": {
                  "contrast": {
                    "textOnBackground": 8.5,
                    "borderOnBackground": 4.5,
                    "status": "pass",
                    "level": "AA"
                  }
                },
                "disabled": {
                  "contrast": {
                    "textOnBackground": 2.1,
                    "borderOnBackground": 1.8,
                    "status": "fail",
                    "level": "none",
                    "reason": "outline disabled state insufficient contrast"
                  }
                }
              }
            },
            "ghost": {
              "states": {
                "default": {
                  "contrast": {
                    "textOnBackground": 4.8,
                    "status": "pass",
                    "level": "AA"
                  }
                },
                "disabled": {
                  "contrast": {
                    "textOnBackground": 1.9,
                    "status": "fail",
                    "level": "none",
                    "reason": "ghost disabled state invisible"
                  }
                }
              }
            }
          }
        },
        "Input": {
          "variants": {
            "default": {
              "states": {
                "default": {
                  "contrast": {
                    "textOnBackground": 7.5,
                    "borderOnBackground": 3.2,
                    "status": "pass",
                    "level": "AA"
                  }
                },
                "focus": {
                  "contrast": {
                    "textOnBackground": 7.5,
                    "borderOnBackground": 4.8,
                    "focusIndicator": 4.5,
                    "status": "pass",
                    "level": "AA"
                  }
                },
                "error": {
                  "contrast": {
                    "textOnBackground": 7.5,
                    "borderOnBackground": 5.2,
                    "errorMessage": 6.8,
                    "status": "pass",
                    "level": "AA"
                  }
                }
              }
            }
          }
        }
      },
      "overallScore": {
        "accessibility": 85,
        "contrast": 92,
        "usability": 88,
        "grade": "A"
      }
    }
  },
  "violations": [
    {
      "id": "contrast-ghost-disabled",
      "recipe": "professional-blue",
      "component": "Button",
      "variant": "ghost",
      "state": "disabled",
      "type": "contrast",
      "severity": "error",
      "description": "Ghost disabled state has insufficient contrast (1.9:1)",
      "wcagLevel": "AA",
      "required": 4.5,
      "actual": 1.9,
      "suggestion": {
        "zh": "使用 #606570 作为禁用态幽灵文本颜色",
        "en": "Use #606570 for disabled ghost text color"
      }
    },
    {
      "id": "semantic-conflict-disabled-focus",
      "recipe": "professional-blue",
      "component": "Button",
      "variant": "ghost",
      "state": "disabled",
      "type": "semantic",
      "severity": "warning",
      "description": {
        "zh": "禁用元素不应该具有焦点状态",
        "en": "Disabled element should not have focus state"
      },
      "reason": {
        "zh": "禁用元素按定义不可获得焦点",
        "en": "Disabled elements are not focusable by definition"
      },
      "suggestion": {
        "zh": "从禁用状态中移除焦点样式",
        "en": "Remove focus styles from disabled state"
      }
    }
  ],
  "combinations": {
    "allowed": [
      {
        "components": ["Button", "Input"],
        "variants": ["primary", "default"],
        "states": ["default", "hover", "focus"],
        "contrast": ">= 4.5",
        "category": "form"
      }
    ],
    "forbidden": [
      {
        "rule": "disabled + interactive",
        "description": "Disabled elements cannot have interactive states",
        "states": ["disabled"],
        "forbiddenStates": ["hover", "focus", "active"],
        "severity": "error"
      },
      {
        "rule": "ghost + small size + low contrast",
        "description": "Ghost buttons need minimum contrast for small sizes",
        "variants": ["ghost"],
        "sizes": ["sm", "xs"],
        "minContrast": 4.5,
        "severity": "warning"
      }
    ]
  },
  "heatmapData": {
    "professional-blue": {
      "Button": {
        "primary": {
          "default": { "score": 100, "status": "excellent" },
          "hover": { "score": 100, "status": "excellent" },
          "focus": { "score": 90, "status": "good" },
          "disabled": { "score": 45, "status": "poor" }
        },
        "secondary": {
          "default": { "score": 95, "status": "excellent" }
        },
        "outline": {
          "default": { "score": 95, "status": "good" },
          "disabled": { "score": 35, "status": "poor" }
        },
        "ghost": {
          "default": { "score": 85, "status": "good" },
          "disabled": { "score": 25, "status": "poor" }
        }
      }
    }
  }
}
```

## 生成器实现

### MatrixGenerator 类

```typescript
// @th-ui/matrix/src/generator.ts
import type {
  MatrixData,
  Recipe,
  Component,
  ContrastRequirement,
  Violation,
  HeatmapData
} from './types'
import { OKLCHConverter } from '@th-ui/oklch'

export class MatrixGenerator {
  private oklchConverter: OKLCHConverter
  private wcagRequirements: Record<string, ContrastRequirement>

  constructor() {
    this.oklchConverter = new OKLCHConverter()
    this.wcagRequirements = {
      WCAG_AA: {
        normalText: 4.5,
        largeText: 3.0,
        interactive: 3.0,
        disabled: 3.0
      },
      WCAG_AAA: {
        normalText: 7.0,
        largeText: 4.5,
        interactive: 4.5,
        disabled: 4.5
      }
    }
  }

  /**
   * 生成完整的 Matrix 数据
   */
  async generateMatrix(
    recipes: Recipe[],
    components: Component[],
    validationLevel: 'AA' | 'AAA' = 'AA'
  ): Promise<MatrixData> {
    const matrix: MatrixData = {
      $schema: './schema.json',
      version: '1.0.0',
      metadata: {
        generated: new Date().toISOString(),
        totalRecipes: recipes.length,
        totalComponents: components.length,
        validationLevel,
        lastValidation: new Date().toISOString()
      },
      contrastRequirements: this.wcagRequirements,
      recipeMatrix: {},
      violations: [],
      combinations: {
        allowed: [],
        forbidden: this.generateForbiddenRules()
      },
      heatmapData: {}
    }

    // 为每个配方生成验证数据
    for (const recipe of recipes) {
      const recipeData = await this.validateRecipe(recipe, components, validationLevel)
      matrix.recipeMatrix[recipe.id] = recipeData
      matrix.heatmapData[recipe.id] = this.generateHeatmapData(recipeData)
      matrix.violations.push(...recipeData.violations)
    }

    return matrix
  }

  /**
   * 验证单个配方
   */
  private async validateRecipe(
    recipe: Recipe,
    components: Component[],
    validationLevel: string
  ): Promise<any> {
    const recipeData: any = {
      metadata: {
        name: recipe.name,
        category: recipe.category,
        status: recipe.status,
        lastModified: recipe.lastModified
      },
      components: {},
      violations: [],
      overallScore: {
        accessibility: 0,
        contrast: 0,
        usability: 0,
        grade: 'F'
      }
    }

    let totalScores = { accessibility: [], contrast: [], usability: [] }

    // 验证每个组件
    for (const component of components) {
      const componentData = await this.validateComponent(recipe, component, validationLevel)
      recipeData.components[component.name] = componentData

      // 收集评分
      Object.values(componentData.variants).forEach((variant: any) => {
        Object.values(variant.states).forEach((state: any) => {
          if (state.accessibility) {
            totalScores.accessibility.push(this.calculateAccessibilityScore(state))
          }
          if (state.contrast) {
            totalScores.contrast.push(state.contrast.textOnBackground || 0)
          }
        })
      })
    }

    // 计算总体评分
    recipeData.overallScore = this.calculateOverallScore(totalScores)

    return recipeData
  }

  /**
   * 验证单个组件
   */
  private async validateComponent(
    recipe: Recipe,
    component: Component,
    validationLevel: string
  ): Promise<any> {
    const componentData: any = {
      variants: {}
    }

    // 验证每个变体
    for (const variant of component.variants) {
      const variantData: any = {
        states: {}
      }

      // 验证每个状态
      for (const state of variant.states) {
        const stateData = await this.validateState(recipe, component, variant, state, validationLevel)
        variantData.states[state.name] = stateData
      }

      componentData.variants[variant.name] = variantData
    }

    return componentData
  }

  /**
   * 验证单个状态
   */
  private async validateState(
    recipe: Recipe,
    component: Component,
    variant: any,
    state: any,
    validationLevel: string
  ): Promise<any> {
    const stateData: any = {
      contrast: {},
      accessibility: {}
    }

    // 获取状态颜色
    const colors = this.getStateColors(recipe, component, variant, state)

    // 验证对比度
    const contrastResults = this.validateContrast(colors, validationLevel)
    stateData.contrast = contrastResults

    // 验证可访问性
    const accessibilityResults = this.validateAccessibility(state, contrastResults)
    stateData.accessibility = accessibilityResults

    // 检查语义冲突
    const semanticConflicts = this.checkSemanticConflicts(component, variant, state)
    if (semanticConflicts.length > 0) {
      stateData.conflicts = semanticConflicts
    }

    return stateData
  }

  /**
   * 验证颜色对比度
   */
  private validateContrast(colors: any, validationLevel: string): any {
    const results: any = {}
    const requirements = this.wcagRequirements[`WCAG_${validationLevel}`]

    // 文本/背景对比度
    if (colors.text && colors.background) {
      const textContrast = this.calculateContrast(colors.text, colors.background)
      results.textOnBackground = textContrast
      results.status = textContrast >= requirements.normalText ? 'pass' : 'fail'
      results.level = textContrast >= requirements.normalText * 1.5 ? 'AAA' :
                     textContrast >= requirements.normalText ? 'AA' : 'none'

      if (results.status === 'fail') {
        results.reason = `Contrast ${textContrast.toFixed(1)}:1 below ${requirements.normalText}:1 requirement`
        results.suggestion = this.generateContrastSuggestion(colors.text, colors.background, requirements.normalText)
      }
    }

    // 边框/背景对比度
    if (colors.border && colors.background) {
      const borderContrast = this.calculateContrast(colors.border, colors.background)
      results.borderOnBackground = borderContrast
    }

    // 焦点指示器对比度
    if (colors.focusIndicator && colors.background) {
      const focusContrast = this.calculateContrast(colors.focusIndicator, colors.background)
      results.focusIndicator = focusContrast
    }

    return results
  }

  /**
   * 计算两个颜色之间的对比度
   */
  private calculateContrast(color1: string, color2: string): number {
    // 转换为相对亮度
    const luminance1 = this.getRelativeLuminance(color1)
    const luminance2 = this.getRelativeLuminance(color2)

    // 计算对比度
    const lighter = Math.max(luminance1, luminance2)
    const darker = Math.min(luminance1, luminance2)

    return (lighter + 0.05) / (darker + 0.05)
  }

  /**
   * 获取颜色的相对亮度
   */
  private getRelativeLuminance(color: string): number {
    // 将颜色转换为 RGB
    const rgb = this.hexToRgb(color)
    if (!rgb) return 0

    // 转换为线性 RGB
    const linearR = this.sRGBToLinear(rgb.r / 255)
    const linearG = this.sRGBToLinear(rgb.g / 255)
    const linearB = this.sRGBToLinear(rgb.b / 255)

    // 计算相对亮度
    return 0.2126 * linearR + 0.7152 * linearG + 0.0722 * linearB
  }

  /**
   * sRGB 转线性 RGB
   */
  private sRGBToLinear(value: number): number {
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4)
  }

  /**
   * 十六进制颜色转 RGB
   */
  private hexToRgb(hex: string): { r: number, g: number, b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  /**
   * 生成对比度改进建议
   */
  private generateContrastSuggestion(foreground: string, background: string, required: number): string {
    const currentContrast = this.calculateContrast(foreground, background)
    const deficiency = required / currentContrast

    // 简单的建议生成逻辑
    if (deficiency > 2) {
      return "需要显著调整前景色或背景色"
    } else if (deficiency > 1.5) {
      return "建议调整前景色亮度"
    } else {
      return "微调颜色即可达到要求"
    }
  }

  /**
   * 检查语义冲突
   */
  private checkSemanticConflicts(component: any, variant: any, state: any): any[] {
    const conflicts: any[] = []

    // disabled + interactive states 冲突
    if (state.name === 'disabled') {
      const interactiveStates = ['hover', 'focus', 'active', 'pressed']
      if (interactiveStates.includes(state.name)) {
        conflicts.push({
          type: 'semantic',
          severity: 'error',
          description: 'Disabled element should not have interactive states',
          suggestion: 'Remove interactive styles from disabled state'
        })
      }
    }

    // ghost variant + disabled state 冲突
    if (variant.name === 'ghost' && state.name === 'disabled') {
      conflicts.push({
        type: 'visibility',
        severity: 'warning',
        description: 'Ghost disabled state may be invisible',
        suggestion: 'Add background color or increase text contrast'
      })
    }

    return conflicts
  }

  /**
   * 生成热力图数据
   */
  private generateHeatmapData(recipeData: any): HeatmapData {
    const heatmapData: HeatmapData = {}

    for (const [componentName, componentData] of Object.entries(recipeData.components)) {
      heatmapData[componentName] = {}

      for (const [variantName, variantData] of Object.entries((componentData as any).variants)) {
        heatmapData[componentName][variantName] = {}

        for (const [stateName, stateData] of Object.entries((variantData as any).states)) {
          const score = this.calculateStateScore(stateData as any)
          const status = this.getScoreStatus(score)

          heatmapData[componentName][variantName][stateName] = { score, status }
        }
      }
    }

    return heatmapData
  }

  /**
   * 计算状态评分
   */
  private calculateStateScore(stateData: any): number {
    let score = 0

    // 对比度评分 (40%)
    if (stateData.contrast?.status === 'pass') {
      score += stateData.contrast.level === 'AAA' ? 40 : 30
    }

    // 可访问性评分 (30%)
    if (stateData.accessibility?.screenReader) score += 10
    if (stateData.accessibility?.keyboard) score += 10
    if (stateData.accessibility?.touch) score += 10

    // 无冲突评分 (30%)
    if (!stateData.conflicts || stateData.conflicts.length === 0) score += 30

    return Math.min(100, score)
  }

  /**
   * 获取评分状态
   */
  private getScoreStatus(score: number): string {
    if (score >= 90) return 'excellent'
    if (score >= 70) return 'good'
    if (score >= 50) return 'fair'
    return 'poor'
  }

  /**
   * 生成禁止规则
   */
  private generateForbiddenRules(): any[] {
    return [
      {
        rule: 'disabled + interactive',
        description: 'Disabled elements cannot have interactive states',
        states: ['disabled'],
        forbiddenStates: ['hover', 'focus', 'active', 'pressed'],
        severity: 'error'
      },
      {
        rule: 'ghost + disabled',
        description: 'Ghost variant disabled state needs special handling',
        variants: ['ghost'],
        states: ['disabled'],
        minContrast: 3.0,
        severity: 'warning'
      },
      {
        rule: 'small text + low contrast',
        description: 'Small text requires higher contrast',
        sizes: ['xs', 'sm'],
        minContrast: 4.5,
        severity: 'error'
      }
    ]
  }

  /**
   * 计算可访问性评分
   */
  private calculateAccessibilityScore(state: any): number {
    let score = 0
    if (state.accessibility?.screenReader) score += 33
    if (state.accessibility?.keyboard) score += 33
    if (state.accessibility?.touch) score += 34
    return score
  }

  /**
   * 计算总体评分
   */
  private calculateOverallScore(totalScores: any): any {
    const avgAccessibility = this.average(totalScores.accessibility) || 0
    const avgContrast = this.average(totalScores.contrast) || 0
    const avgUsability = 85 // 基于组件功能完整性

    const overall = (avgAccessibility + avgContrast + avgUsability) / 3
    const grade = this.getGrade(overall)

    return {
      accessibility: Math.round(avgAccessibility),
      contrast: Math.round(avgContrast),
      usability: avgUsability,
      grade
    }
  }

  /**
   * 计算平均值
   */
  private average(arr: number[]): number {
    return arr.length > 0 ? arr.reduce((a, b) => a + b) / arr.length : 0
  }

  /**
   * 获取等级
   */
  private getGrade(score: number): string {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
  }

  /**
   * 获取状态颜色（简化实现）
   */
  private getStateColors(recipe: Recipe, component: Component, variant: any, state: any): any {
    // 这里应该根据实际的配方系统获取颜色
    // 简化实现，返回示例颜色
    return {
      text: '#000000',
      background: '#ffffff',
      border: '#e5e7eb',
      focusIndicator: '#3b82f6'
    }
  }
}
```

## CI/CD 集成

### GitHub Actions 工作流

```yaml
# .github/workflows/matrix-validation.yml
name: Matrix Validation

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  matrix-validation:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Generate Matrix
        run: npm run matrix:generate

      - name: Validate Matrix
        run: npm run matrix:validate

      - name: Check Violations
        run: npm run matrix:check-violations

      - name: Upload Matrix
        uses: actions/upload-artifact@v4
        with:
          name: matrix-data
          path: packages/matrix/dist/matrix.json

      - name: Generate Heatmap Report
        run: npm run matrix:heatmap-report

      - name: Upload Report
        uses: actions/upload-artifact@v4
        with:
          name: matrix-report
          path: matrix-report.html
```

## Gallery 热力图集成

### React 热力图组件

```typescript
// apps/gallery/src/components/MatrixHeatmap.tsx
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@th-ui/core'
import { MatrixData } from '@th-ui/matrix'

interface MatrixHeatmapProps {
  matrixData: MatrixData
  selectedRecipe: string
}

export const MatrixHeatmap: React.FC<MatrixHeatmapProps> = ({
  matrixData,
  selectedRecipe
}) => {
  const recipeData = matrixData.recipeMatrix[selectedRecipe]
  const heatmapData = matrixData.heatmapData[selectedRecipe]

  if (!recipeData || !heatmapData) {
    return <div>No data available</div>
  }

  return (
    <Card className="matrix-heatmap">
      <CardHeader>
        <CardTitle>可访问性热力图 - {recipeData.metadata.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="heatmap-legend">
          <div className="legend-item">
            <div className="legend-color excellent"></div>
            <span>优秀 (90-100)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color good"></div>
            <span>良好 (70-89)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color fair"></div>
            <span>一般 (50-69)</span>
          </div>
          <div className="legend-item">
            <div className="legend-color poor"></div>
            <span>较差 (0-49)</span>
          </div>
        </div>

        {Object.entries(heatmapData).map(([componentName, componentData]) => (
          <div key={componentName} className="component-heatmap">
            <h4>{componentName}</h4>
            <div className="variants-grid">
              {Object.entries(componentData).map(([variantName, variantData]) => (
                <div key={variantName} className="variant-card">
                  <h5>{variantName}</h5>
                  <div className="states-grid">
                    {Object.entries(variantData).map(([stateName, stateData]) => (
                      <div
                        key={stateName}
                        className={`state-cell ${stateData.status}`}
                        title={`${stateName}: ${stateData.score}分`}
                      >
                        <span className="state-name">{stateName}</span>
                        <span className="state-score">{stateData.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 违规项列表 */}
        {matrixData.violations.length > 0 && (
          <div className="violations-section">
            <h4>发现的问题</h4>
            {matrixData.violations
              .filter(v => v.recipe === selectedRecipe)
              .map((violation, index) => (
                <div key={index} className={`violation-item ${violation.severity}`}>
                  <div className="violation-header">
                    <span className="violation-type">{violation.type}</span>
                    <span className="violation-severity">{violation.severity}</span>
                  </div>
                  <div className="violation-description">
                    {violation.description}
                  </div>
                  {violation.suggestion && (
                    <div className="violation-suggestion">
                      建议: {violation.suggestion}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

## Adoption Matrix 集成

### 组合过滤器

```typescript
// apps/adoption-matrix/src/hooks/useValidCombinations.ts
import { useMemo } from 'react'
import { MatrixData } from '@th-ui/matrix'

export function useValidCombinations(
  matrixData: MatrixData,
  selectedRecipe: string,
  selectedComponent: string
) {
  return useMemo(() => {
    const recipe = matrixData.recipeMatrix[selectedRecipe]
    if (!recipe) return { valid: [], invalid: [] }

    const component = recipe.components[selectedComponent]
    if (!component) return { valid: [], invalid: [] }

    const valid: any[] = []
    const invalid: any[] = []

    Object.entries(component.variants).forEach(([variantName, variantData]) => {
      Object.entries((variantData as any).states).forEach(([stateName, stateData]) => {
        const combination = {
          variant: variantName,
          state: stateName,
          score: (stateData as any).contrast?.textOnBackground || 0,
          status: (stateData as any).contrast?.status || 'unknown',
          level: (stateData as any).contrast?.level || 'none'
        }

        if (combination.status === 'pass') {
          valid.push(combination)
        } else {
          invalid.push(combination)
        }
      })
    })

    return { valid, invalid }
  }, [matrixData, selectedRecipe, selectedComponent])
}
```

## 包结构

```
@th-ui/matrix/
├── src/
│   ├── generator.ts          # 矩阵生成器
│   ├── validator.ts          # 验证器
│   ├── types.ts             # 类型定义
│   ├── schema.json          # JSON Schema
│   └── index.ts             # 导出
├── scripts/
│   ├── generate.ts          # 生成脚本
│   ├── validate.ts          # 验证脚本
│   └── heatmap-report.ts    # 热力图报告
├── dist/
│   ├── matrix.json          # 生成的矩阵数据
│   └── report.html          # 热力图报告
└── package.json
```

## 国际化系统 (i18n)

### 语言包结构

```
@th-ui/matrix/
├── src/
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── zh-CN.json        # 中文简体
│   │   │   ├── zh-TW.json        # 中文繁体 (未来)
│   │   │   ├── en-US.json        # 英文 (未来)
│   │   │   └── ja-JP.json        # 日文 (未来)
│   │   ├── index.ts             # i18n 配置
│   │   └── types.ts             # 类型定义
│   └── ...
```

### 中文语言包配置

```json
// src/i18n/locales/zh-CN.json
{
  "validation": {
    "contrast": {
      "fail": {
        "title": "对比度不足",
        "description": "当前对比度 {{actual}}:1 低于 {{required}}:1 的要求",
        "suggestion_high": "需要显著调整前景色或背景色",
        "suggestion_medium": "建议调整前景色亮度",
        "suggestion_low": "微调颜色即可达到要求"
      },
      "pass": {
        "title": "对比度合格",
        "description_aa": "符合 WCAG AA 标准",
        "description_aaa": "符合 WCAG AAA 标准"
      }
    },
    "semantic": {
      "disabled_focus": {
        "title": "语义冲突",
        "description": "禁用元素不应该具有焦点状态",
        "reason": "禁用元素按定义不可获得焦点",
        "suggestion": "从禁用状态中移除焦点样式"
      },
      "ghost_disabled": {
        "title": "可见性问题",
        "description": "幽灵变体的禁用状态可能不可见",
        "suggestion": "添加背景色或提高文本对比度"
      }
    },
    "accessibility": {
      "screen_reader": "屏幕阅读器支持",
      "keyboard": "键盘导航支持",
      "touch": "触摸操作支持",
      "color_blind": {
        "protanopia": "红色盲友好",
        "deuteranopia": "绿色盲友好",
        "tritanopia": "蓝色盲友好"
      }
    }
  },
  "heatmap": {
    "legend": {
      "excellent": "优秀 (90-100)",
      "good": "良好 (70-89)",
      "fair": "一般 (50-69)",
      "poor": "较差 (0-49)"
    },
    "states": {
      "default": "默认状态",
      "hover": "悬停状态",
      "focus": "焦点状态",
      "active": "激活状态",
      "disabled": "禁用状态",
      "loading": "加载状态",
      "error": "错误状态"
    },
    "variants": {
      "primary": "主要样式",
      "secondary": "次要样式",
      "outline": "轮廓样式",
      "ghost": "幽灵样式",
      "link": "链接样式",
      "destructive": "危险样式"
    },
    "components": {
      "Button": "按钮",
      "Input": "输入框",
      "Card": "卡片",
      "Modal": "模态框",
      "Alert": "提示框",
      "Badge": "徽章",
      "Avatar": "头像",
      "Switch": "开关",
      "Checkbox": "复选框",
      "Radio": "单选框"
    },
    "scores": {
      "overall": "总体评分",
      "accessibility": "可访问性",
      "contrast": "对比度",
      "usability": "可用性",
      "grade": "等级"
    }
  },
  "violations": {
    "severity": {
      "error": "错误",
      "warning": "警告",
      "info": "提示"
    },
    "type": {
      "contrast": "对比度问题",
      "semantic": "语义冲突",
      "visibility": "可见性问题",
      "accessibility": "可访问性问题"
    },
    "actions": {
      "view_details": "查看详情",
      "apply_fix": "应用修复",
      "ignore": "忽略",
      "export_report": "导出报告"
    }
  },
  "reports": {
    "title": "可访问性验证报告",
    "generated_at": "生成时间",
    "recipe": "配方",
    "component": "组件",
    "total_violations": "违规总数",
    "critical_issues": "严重问题",
    "recommendations": "改进建议",
    "summary": {
      "passed": "通过",
      "failed": "失败",
      "skipped": "跳过",
      "total_score": "总分"
    }
  }
}
```

### i18n 类型定义

```typescript
// src/i18n/types.ts
export interface LocaleMessages {
  validation: {
    contrast: {
      fail: {
        title: string
        description: string
        suggestion_high: string
        suggestion_medium: string
        suggestion_low: string
      }
      pass: {
        title: string
        description_aa: string
        description_aaa: string
      }
    }
    semantic: {
      disabled_focus: {
        title: string
        description: string
        reason: string
        suggestion: string
      }
      ghost_disabled: {
        title: string
        description: string
        suggestion: string
      }
    }
    accessibility: {
      screen_reader: string
      keyboard: string
      touch: string
      color_blind: {
        protanopia: string
        deuteranopia: string
        tritanopia: string
      }
    }
  }
  heatmap: {
    legend: {
      excellent: string
      good: string
      fair: string
      poor: string
    }
    states: Record<string, string>
    variants: Record<string, string>
    components: Record<string, string>
    scores: {
      overall: string
      accessibility: string
      contrast: string
      usability: string
      grade: string
    }
  }
  violations: {
    severity: Record<string, string>
    type: Record<string, string>
    actions: {
      view_details: string
      apply_fix: string
      ignore: string
      export_report: string
    }
  }
  reports: {
    title: string
    generated_at: string
    recipe: string
    component: string
    total_violations: string
    critical_issues: string
    recommendations: string
    summary: {
      passed: string
      failed: string
      skipped: string
      total_score: string
    }
  }
}

export type Locale = 'zh-CN' | 'zh-TW' | 'en-US' | 'ja-JP'
```

### i18n 实现类

```typescript
// src/i18n/index.ts
import type { Locale, LocaleMessages } from './types'
import zhCN from './locales/zh-CN.json'

export class MatrixI18n {
  private static instance: MatrixI18n
  private currentLocale: Locale = 'zh-CN'
  private messages: Record<Locale, LocaleMessages> = {
    'zh-CN': zhCN as LocaleMessages,
    // 其他语言包将来添加
    'zh-TW': {} as LocaleMessages,
    'en-US': {} as LocaleMessages,
    'ja-JP': {} as LocaleMessages
  }

  static getInstance(): MatrixI18n {
    if (!MatrixI18n.instance) {
      MatrixI18n.instance = new MatrixI18n()
    }
    return MatrixI18n.instance
  }

  /**
   * 设置当前语言
   */
  setLocale(locale: Locale): void {
    this.currentLocale = locale
  }

  /**
   * 获取当前语言
   */
  getLocale(): Locale {
    return this.currentLocale
  }

  /**
   * 获取翻译文本
   */
  t(key: string, params?: Record<string, any>): string {
    const keys = key.split('.')
    let value: any = this.messages[this.currentLocale]

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k]
      } else {
        return key // 如果找不到翻译，返回 key
      }
    }

    if (typeof value !== 'string') {
      return key
    }

    // 替换参数
    if (params) {
      return value.replace(/\{\{(\w+)\}\}/g, (match, param) => {
        return params[param] || match
      })
    }

    return value
  }

  /**
   * 获取本地化的违规信息
   */
  getLocalizedViolation(violation: any): any {
    return {
      ...violation,
      title: this.t(`validation.${violation.type}.${violation.id}.title`),
      description: typeof violation.description === 'string'
        ? violation.description
        : this.t(`validation.${violation.type}.${violation.id}.description`),
      reason: typeof violation.reason === 'string'
        ? violation.reason
        : this.t(`validation.${violation.type}.${violation.id}.reason`),
      suggestion: typeof violation.suggestion === 'string'
        ? violation.suggestion
        : this.t(`validation.${violation.type}.${violation.id}.suggestion`)
    }
  }

  /**
   * 获取本地化的组件名称
   */
  getLocalizedComponentName(componentName: string): string {
    return this.t(`heatmap.components.${componentName}`)
  }

  /**
   * 获取本地化的状态名称
   */
  getLocalizedStateName(stateName: string): string {
    return this.t(`heatmap.states.${stateName}`)
  }

  /**
   * 获取本地化的变体名称
   */
  getLocalizedVariantName(variantName: string): string {
    return this.t(`heatmap.variants.${variantName}`)
  }

  /**
   * 获取本地化的对比度信息
   */
  getLocalizedContrastInfo(contrast: any): any {
    if (contrast.status === 'pass') {
      return {
        ...contrast,
        title: this.t('validation.contrast.pass.title'),
        description: contrast.level === 'AAA'
          ? this.t('validation.contrast.pass.description_aaa')
          : this.t('validation.contrast.pass.description_aa')
      }
    } else {
      let suggestion = this.t('validation.contrast.fail.suggestion_low')
      if (contrast.actual && contrast.required) {
        const ratio = contrast.required / contrast.actual
        if (ratio > 2) {
          suggestion = this.t('validation.contrast.fail.suggestion_high')
        } else if (ratio > 1.5) {
          suggestion = this.t('validation.contrast.fail.suggestion_medium')
        }
      }

      return {
        ...contrast,
        title: this.t('validation.contrast.fail.title'),
        description: this.t('validation.contrast.fail.description', {
          actual: contrast.actual?.toFixed(1) || '未知',
          required: contrast.required || '未知'
        }),
        suggestion: suggestion
      }
    }
  }
}
```

### 更新生成器以支持 i18n

```typescript
// src/generator.ts (更新部分)
import { MatrixI18n } from './i18n'

export class MatrixGenerator {
  private i18n: MatrixI18n

  constructor(locale: Locale = 'zh-CN') {
    this.i18n = MatrixI18n.getInstance()
    this.i18n.setLocale(locale)
    // ... 其他初始化
  }

  /**
   * 生成本地化的违规信息
   */
  private generateLocalizedViolation(
    type: string,
    id: string,
    data: any
  ): any {
    const baseViolation = {
      id: `${type}-${id}`,
      type,
      severity: data.severity || 'error',
      ...data
    }

    return this.i18n.getLocalizedViolation(baseViolation)
  }

  /**
   * 生成本地化的对比度建议
   */
  private generateLocalizedContrastSuggestion(
    foreground: string,
    background: string,
    required: number,
    actual: number
  ): string {
    const ratio = required / actual

    if (ratio > 2) {
      return this.i18n.t('validation.contrast.fail.suggestion_high')
    } else if (ratio > 1.5) {
      return this.i18n.t('validation.contrast.fail.suggestion_medium')
    } else {
      return this.i18n.t('validation.contrast.fail.suggestion_low')
    }
  }
}
```

### React 集成

```typescript
// hooks/useMatrixI18n.ts
import { useMemo } from 'react'
import { MatrixI18n, Locale } from '@th-ui/matrix'

export function useMatrixI18n(locale?: Locale) {
  const i18n = useMemo(() => {
    const instance = MatrixI18n.getInstance()
    if (locale) {
      instance.setLocale(locale)
    }
    return instance
  }, [locale])

  return {
    t: i18n.t.bind(i18n),
    getLocalizedViolation: i18n.getLocalizedViolation.bind(i18n),
    getLocalizedComponentName: i18n.getLocalizedComponentName.bind(i18n),
    getLocalizedStateName: i18n.getLocalizedStateName.bind(i18n),
    getLocalizedVariantName: i18n.getLocalizedVariantName.bind(i18n),
    getLocalizedContrastInfo: i18n.getLocalizedContrastInfo.bind(i18n),
    currentLocale: i18n.getLocale(),
    setLocale: i18n.setLocale.bind(i18n)
  }
}
```

### Gallery 热力图 i18n 集成

```typescript
// apps/gallery/src/components/MatrixHeatmap.tsx (更新)
import { useMatrixI18n } from '@th-ui/matrix/hooks'

export const MatrixHeatmap: React.FC<MatrixHeatmapProps> = ({
  matrixData,
  selectedRecipe,
  locale = 'zh-CN'
}) => {
  const {
    t,
    getLocalizedComponentName,
    getLocalizedStateName,
    getLocalizedVariantName,
    getLocalizedContrastInfo
  } = useMatrixI18n(locale)

  return (
    <Card className="matrix-heatmap">
      <CardHeader>
        <CardTitle>
          {t('heatmap.scores.accessibility')}热力图 - {recipeData.metadata.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="heatmap-legend">
          <div className="legend-item">
            <div className="legend-color excellent"></div>
            <span>{t('heatmap.legend.excellent')}</span>
          </div>
          <div className="legend-item">
            <div className="legend-color good"></div>
            <span>{t('heatmap.legend.good')}</span>
          </div>
          <div className="legend-item">
            <div className="legend-color fair"></div>
            <span>{t('heatmap.legend.fair')}</span>
          </div>
          <div className="legend-item">
            <div className="legend-color poor"></div>
            <span>{t('heatmap.legend.poor')}</span>
          </div>
        </div>

        {Object.entries(heatmapData).map(([componentName, componentData]) => (
          <div key={componentName} className="component-heatmap">
            <h4>{getLocalizedComponentName(componentName)}</h4>
            <div className="variants-grid">
              {Object.entries(componentData).map(([variantName, variantData]) => (
                <div key={variantName} className="variant-card">
                  <h5>{getLocalizedVariantName(variantName)}</h5>
                  <div className="states-grid">
                    {Object.entries(variantData).map(([stateName, stateData]) => (
                      <div
                        key={stateName}
                        className={`state-cell ${stateData.status}`}
                        title={`${getLocalizedStateName(stateName)}: ${stateData.score}分`}
                      >
                        <span className="state-name">{getLocalizedStateName(stateName)}</span>
                        <span className="state-score">{stateData.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* 本地化的违规项列表 */}
        {matrixData.violations.length > 0 && (
          <div className="violations-section">
            <h4>{t('violations.type.contrast')}</h4>
            {matrixData.violations
              .filter(v => v.recipe === selectedRecipe)
              .map((violation, index) => (
                <div key={index} className={`violation-item ${violation.severity}`}>
                  <div className="violation-header">
                    <span className="violation-type">
                      {t(`violations.type.${violation.type}`)}
                    </span>
                    <span className="violation-severity">
                      {t(`violations.severity.${violation.severity}`)}
                    </span>
                  </div>
                  <div className="violation-description">
                    {typeof violation.description === 'string'
                      ? violation.description
                      : violation.description?.[locale] || violation.description?.zh}
                  </div>
                  {violation.suggestion && (
                    <div className="violation-suggestion">
                      {t('reports.recommendations')}: {
                        typeof violation.suggestion === 'string'
                          ? violation.suggestion
                          : violation.suggestion?.[locale] || violation.suggestion?.zh
                      }
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
```

## 使用方式

```bash
# 生成 Matrix 数据 (指定语言)
npm run matrix:generate -- --locale zh-CN

# 验证 Matrix
npm run matrix:validate

# 检查违规项
npm run matrix:check-violations

# 生成热力图报告 (多语言)
npm run matrix:heatmap-report -- --locales zh-CN,en-US

# CI 门禁检查
npm run matrix:ci-check
```

这个增强的 Matrix 规则系统现在提供了：

1. **完整的对比度验证** - WCAG AA/AAA 标准
2. **语义冲突检测** - disabled + focus 等非法组合
3. **热力图可视化** - Gallery 中的直观展示
4. **CI/CD 集成** - 自动化验证门禁
5. **实时反馈** - Adoption Matrix 中的组合过滤
6. **国际化支持** - 多语言错误信息和界面文本，当前支持中文，未来可扩展其他语言

确保所有配方组合都符合可访问性要求，并提供清晰的本地化改进建议。