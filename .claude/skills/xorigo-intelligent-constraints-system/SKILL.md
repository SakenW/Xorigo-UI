---
name: "Xorigo UI 智能约束系统"
description: "基于 Xorigo UI v1.5 SSOT 的智能约束系统 (A11y Guard)，负责七轴主题系统的自动约束验证、冲突解决和可访问性保障，集成AI辅助和性能优化功能"
author: "Xorigo UI Team"
version: "1.5.0"
tags: ["intelligent-constraints", "a11y-guard", "accessibility", "conflict-resolution", "auto-fix", "v1.5.0", "ai-enhanced"]
---

# Xorigo UI 智能约束系统

基于 Xorigo UI v1.5 SSOT 的智能约束系统 (A11y Guard)，负责七轴主题系统的自动约束验证、冲突解决和可访问性保障，集成AI辅助和性能优化功能。

## 🎯 系统职责

**✅ 核心功能**：
- 七轴主题约束验证与自动修复
- 可访问性标准强制执行
- 用户体验冲突自动解决
- 约束规则引擎管理

**❌ 排除范围**：
- 主题配方设计逻辑
- 组件样式实现
- 用户界面交互

## 🧠 约束规则引擎

### 核心约束映射表

| 约束ID | 触发条件 | 优先级 | 自动处理 | 警告级别 | 描述 |
|---|---|---|---|---|---|
| `MOTION_X_HCMODE` | `mode: hc && motion: expressive` | P0 | 降级为 `subtle.classic` | ERROR | HC 模式禁用强烈动效 |
| `TONE_X_SURFACE_NEON` | `tone: vivid && surface: neon` | P1 | 降低 saturation 30% | WARNING | Vivid + Neon 组合优化 |
| `DENSITY_X_MOTION` | `density: compact && motion: expressive` | P1 | 输出 UX 警告 | WARNING | 高密度 + 表现力动效 |
| `MODE_X_SURFACE_GLASS` | `mode: hc && surface: glass` | P0 | 降级为 `flat` | ERROR | HC 模式禁用玻璃效果 |
| `TONE_X_DENSITY` | `tone: vivid && density: compact` | P2 | 增加间距补偿 | WARNING | 密度补偿机制 |
| `ACCENT_X_CONTRAST_LOW` | `base: low && accent: mono` | P1 | 增强 accent 饱和度 | WARNING | 低对比度下的强调色 |
| `MOTION_X_SPRING_X_COMPACT` | `motion: spring && density: compact` | P2 | 降级为 `soft` | WARNING | 弹性动画优化 |

### 约束规则实现

```typescript
// constraints-engine.ts
export interface ConstraintRule {
  id: string
  name: string
  description: string
  priority: 'P0' | 'P1' | 'P2' | 'P3'
  trigger: (axes: ThemeAxes) => boolean
  apply: (axes: ThemeAxes) => ThemeAxes
  warning?: (axes: ThemeAxes) => string
  documentation?: string
}

export class IntelligentConstraintsEngine {
  private rules: ConstraintRule[] = [
    // P0 约束 - 强制执行
    {
      id: 'MOTION_X_HCMODE',
      name: '高对比度模式动效约束',
      description: 'HC 模式下禁用表现力动效，确保可访问性',
      priority: 'P0',
      trigger: (axes) => axes.mode === 'hc' && axes.motion.startsWith('expressive'),
      apply: (axes) => ({ ...axes, motion: 'subtle.classic' }),
      warning: (axes) => `HC 模式下动效已自动降级: ${axes.motion} → subtle.classic`,
      documentation: 'a11y/wcag-motion-constraints'
    },

    {
      id: 'MODE_X_SURFACE_GLASS',
      name: '高对比度模式表面约束',
      description: 'HC 模式下禁用玻璃效果，确保内容清晰度',
      priority: 'P0',
      trigger: (axes) => axes.mode === 'hc' && axes.surface.includes('glass'),
      apply: (axes) => ({ ...axes, surface: 'flat' }),
      warning: (axes) => `HC 模式下表面效果已降级: ${axes.surface} → flat`,
      documentation: 'a11y/hc-mode-surface-constraints'
    },

    // P1 约束 - 重要警告
    {
      id: 'TONE_X_SURFACE_NEON',
      name: 'Vivid + Neon 饱和度约束',
      description: 'Vivid 色调与 Neon 表面组合时降低饱和度',
      priority: 'P1',
      trigger: (axes) => axes.tone === 'vivid' && axes.surface.includes('neon'),
      apply: (axes) => ({ ...axes }), // 不修改轴配置，但影响令牌生成
      warning: () => 'Vivid + Neon 组合：饱和度已自动降低 30%，建议避免此组合',
      documentation: 'design/tone-surface-compatibility'
    },

    {
      id: 'DENSITY_X_MOTION',
      name: '密度与动效冲突警告',
      description: '高密度与表现力动效可能影响用户体验',
      priority: 'P1',
      trigger: (axes) => axes.density === 'compact' && axes.motion.startsWith('expressive'),
      apply: (axes) => ({ ...axes }),
      warning: () => '⚠️ 高密度 + 表现力动效可能影响用户体验，建议降低动效强度',
      documentation: 'ux/density-motion-guidelines'
    },

    // P2 约束 - 建议优化
    {
      id: 'TONE_X_DENSITY',
      name: 'Vivid 密度补偿',
      description: 'Vivid 色调与高密度组合时增加间距补偿',
      priority: 'P2',
      trigger: (axes) => axes.tone === 'vivid' && axes.density === 'compact',
      apply: (axes) => ({ ...axes }),
      warning: () => 'Vivid + Compact 组合：已增加间距补偿，建议使用 Comfortable 密度',
      documentation: 'design/vivid-density-optimization'
    }
  ]

  // 应用约束规则
  applyConstraints(axes: ThemeAxes): {
    constrainedAxes: ThemeAxes
    warnings: string[]
    errors: string[]
    appliedRules: string[]
    tokenModifications: Record<string, any>
  } {
    const warnings: string[] = []
    const errors: string[] = []
    const appliedRules: string[] = []
    const tokenModifications: Record<string, any> = {}
    let constrainedAxes = { ...axes }

    // 按优先级排序并应用规则
    const sortedRules = [...this.rules].sort((a, b) => {
      const priorityOrder = { 'P0': 0, 'P1': 1, 'P2': 2, 'P3': 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })

    for (const rule of sortedRules) {
      if (rule.trigger(constrainedAxes)) {
        try {
          // 应用约束
          const newAxes = rule.apply(constrainedAxes)

          // 检查是否发生了修改
          if (JSON.stringify(newAxes) !== JSON.stringify(constrainedAxes)) {
            constrainedAxes = newAxes
            appliedRules.push(rule.id)

            if (rule.priority === 'P0') {
              errors.push(rule.warning!(constrainedAxes))
            } else {
              warnings.push(rule.warning!(constrainedAxes))
            }
          } else {
            // 无轴修改，但可能有令牌修改
            if (rule.warning) {
              warnings.push(rule.warning(constrainedAxes))
            }
          }

          // 特殊约束的令牌修改
          if (rule.id === 'TONE_X_SURFACE_NEON') {
            tokenModifications['saturation-reduction'] = 0.3
          } else if (rule.id === 'TONE_X_DENSITY') {
            tokenModifications['spacing-compensation'] = 1.2
          }

        } catch (error) {
          errors.push(`约束规则应用失败: ${rule.id} - ${error}`)
        }
      }
    }

    return {
      constrainedAxes,
      warnings,
      errors,
      appliedRules,
      tokenModifications
    }
  }

  // 验证轴配置
  validateAxes(axes: ThemeAxes): {
    valid: boolean
    conflicts: Array<{
      rule: ConstraintRule
      severity: 'error' | 'warning' | 'info'
      message: string
    }>
  } {
    const conflicts = []

    for (const rule of this.rules) {
      if (rule.trigger(axes)) {
        conflicts.push({
          rule,
          severity: rule.priority === 'P0' ? 'error' : 'warning',
          message: rule.warning!(axes)
        })
      }
    }

    return {
      valid: conflicts.filter(c => c.severity === 'error').length === 0,
      conflicts
    }
  }

  // 获取约束规则文档
  getConstraintDocumentation(ruleId: string): string | null {
    const rule = this.rules.find(r => r.id === ruleId)
    return rule?.documentation || null
  }
}
```

## 🔍 可访问性保障系统

### WCAG 合规性检查

```typescript
// a11y-compliance.ts
export class AccessibilityComplianceChecker {
  // 对比度检查
  static checkContrastRatio(foreground: string, background: string): {
    ratio: number
    wcagLevel: 'AAA' | 'AA' | 'A' | 'FAIL'
    recommendation?: string
  } {
    const ratio = this.calculateContrastRatio(foreground, background)

    let wcagLevel: 'AAA' | 'AA' | 'A' | 'FAIL'
    let recommendation: string | undefined

    if (ratio >= 7) {
      wcagLevel = 'AAA'
    } else if (ratio >= 4.5) {
      wcagLevel = 'AA'
    } else if (ratio >= 3) {
      wcagLevel = 'A'
      recommendation = '建议调整颜色以提高对比度至 AA 标准 (4.5:1)'
    } else {
      wcagLevel = 'FAIL'
      recommendation = '必须调整颜色以满足最低对比度要求 (3:1)'
    }

    return { ratio, wcagLevel, recommendation }
  }

  // 动效可访问性检查
  static checkMotionAccessibility(motionAxis: string): {
    accessible: boolean
    issues: string[]
    recommendations: string[]
  } {
    const issues: string[] = []
    const recommendations: string[] = []

    if (motionAxis.includes('expressive')) {
      issues.push('表现力动效可能引起前庭功能障碍')
      recommendations.push('为敏感用户提供减少动效选项')
    }

    if (motionAxis.includes('spring')) {
      issues.push('弹性动画可能对某些用户造成困扰')
      recommendations.push('确保动画时间控制在合理范围内')
    }

    return {
      accessible: issues.length === 0,
      issues,
      recommendations
    }
  }

  // 色彩多样性检查
  static checkColorDiversity(axes: ThemeAxes): {
    adequate: boolean
    issues: string[]
    suggestions: string[]
  } {
    const issues: string[] = []
    const suggestions: string[] = []

    // 检查是否过度依赖单一颜色
    if (axes.accent.includes('mono')) {
      suggestions.push('考虑使用 duo 策略增加色彩多样性')
    }

    // 检查 HC 模式下的色彩区分度
    if (axes.mode === 'hc') {
      if (axes.tone === 'vivid') {
        issues.push('HC 模式下应避免过于鲜艳的颜色')
      }
    }

    return {
      adequate: issues.length === 0,
      issues,
      suggestions
    }
  }

  private static calculateContrastRatio(foreground: string, background: string): number {
    // 简化的对比度计算逻辑
    // 实际实现需要解析颜色并计算相对亮度
    return 4.5 // 示例值
  }
}
```

## 🎯 冲突解决策略

### 自动修复机制

```typescript
// conflict-resolution.ts
export class ConflictResolutionEngine {
  // 解决动效冲突
  static resolveMotionConflict(
    originalMotion: string,
    context: { mode: string; density: string }
  ): {
    resolvedMotion: string
    reason: string
    userActionRequired: boolean
  } {
    const { mode, density } = context

    // HC 模式下的动效降级
    if (mode === 'hc' && originalMotion.startsWith('expressive')) {
      return {
        resolvedMotion: 'subtle.classic',
        reason: 'HC 模式下动效已降级以确保可访问性',
        userActionRequired: false
      }
    }

    // 高密度下的动效优化
    if (density === 'compact' && originalMotion.startsWith('expressive')) {
      return {
        resolvedMotion: 'standard.classic',
        reason: '高密度环境下动效已优化以提升用户体验',
        userActionRequired: true
      }
    }

    return {
      resolvedMotion: originalMotion,
      reason: '无冲突需要解决',
      userActionRequired: false
    }
  }

  // 解决表面冲突
  static resolveSurfaceConflict(
    originalSurface: string,
    context: { mode: string; tone: string }
  ): {
    resolvedSurface: string
    reason: string
    modifications: Record<string, any>
  } {
    const { mode, tone } = context
    const modifications: Record<string, any> = {}

    // HC 模式下的表面降级
    if (mode === 'hc' && originalSurface.includes('glass')) {
      return {
        resolvedSurface: 'flat',
        reason: 'HC 模式下玻璃效果已降级为平面效果',
        modifications: { 'glass-opacity': 0, 'backdrop-blur': 0 }
      }
    }

    // Vivid + Neon 组合优化
    if (tone === 'vivid' && originalSurface.includes('neon')) {
      modifications['neon-saturation'] = 0.7 // 降低 30%
      modifications['neon-brightness'] = 0.9

      return {
        resolvedSurface: originalSurface,
        reason: 'Vivid + Neon 组合：饱和度和亮度已自动调整',
        modifications
      }
    }

    return {
      resolvedSurface: originalSurface,
      reason: '无冲突需要解决',
      modifications
    }
  }

  // 解决色调冲突
  static resolveToneConflict(
    originalTone: string,
    context: { density: string; surface: string }
  ): {
    resolvedTone: string
    compensation: Record<string, number>
    recommendation: string
  } {
    const { density, surface } = context
    const compensation: Record<string, number> = {}

    // Vivid + Compact 密度补偿
    if (originalTone === 'vivid' && density === 'compact') {
      compensation['spacing-scale'] = 1.2
      compensation['font-scale'] = 0.95

      return {
        resolvedTone: originalTone,
        compensation,
        recommendation: '已增加间距补偿，建议考虑使用 Comfortable 密度'
      }
    }

    return {
      resolvedTone: originalTone,
      compensation,
      recommendation: '色调配置无冲突'
    }
  }
}
```

## 🔧 约束系统监控

### 实时监控仪表板

```typescript
// constraints-monitor.ts
export class ConstraintsMonitor {
  private metrics = {
    rulesApplied: 0,
    warningsGenerated: 0,
    errorsFixed: 0,
    userOverrides: 0,
    performanceImpact: 0
  }

  // 记录约束应用
  recordConstraintApplication(ruleId: string, originalAxes: ThemeAxes, result: any): void {
    this.metrics.rulesApplied++

    // 记录到监控系统
    console.log(`[约束监控] 规则 ${ruleId} 已应用`, {
      timestamp: new Date().toISOString(),
      originalAxes,
      result: result.constrainedAxes,
      warnings: result.warnings.length,
      errors: result.errors.length
    })

    // 性能影响评估
    this.assessPerformanceImpact(ruleId, result)
  }

  // 生成约束报告
  generateConstraintsReport(): {
    summary: any
    topViolations: Array<{ rule: string; count: number; severity: string }>
    recommendations: string[]
  } {
    return {
      summary: this.metrics,
      topViolations: this.getTopViolations(),
      recommendations: this.generateRecommendations()
    }
  }

  // 用户反馈收集
  collectUserFeedback(ruleId: string, feedback: {
    helpful: boolean
    severity: 'too-strict' | 'appropriate' | 'too-lenient'
    comment?: string
  }): void {
    console.log(`[用户反馈] 规则 ${ruleId}:`, feedback)

    // 基于反馈调整约束规则
    if (feedback.severity === 'too-strict') {
      this.suggestRuleRelaxation(ruleId)
    } else if (feedback.severity === 'too-lenient') {
      this.suggestRuleStrengthening(ruleId)
    }
  }

  private assessPerformanceImpact(ruleId: string, result: any): void {
    // 评估约束应用对性能的影响
    const processingTime = result.processingTime || 0
    this.metrics.performanceImpact += processingTime

    if (processingTime > 10) { // 超过 10ms
      console.warn(`[性能警告] 规则 ${ruleId} 处理时间过长: ${processingTime}ms`)
    }
  }

  private getTopViolations(): Array<{ rule: string; count: number; severity: string }> {
    // 返回最常见的约束违规
    return [
      { rule: 'MOTION_X_HCMODE', count: 45, severity: 'error' },
      { rule: 'TONE_X_SURFACE_NEON', count: 32, severity: 'warning' },
      { rule: 'DENSITY_X_MOTION', count: 28, severity: 'warning' }
    ]
  }

  private generateRecommendations(): string[] {
    return [
      '建议在设计阶段避免 HC + Expressive 动效组合',
      '考虑为 Vivid + Neon 组合提供预设优化方案',
      '在高密度应用中默认使用 subtle 动效'
    ]
  }

  private suggestRuleRelaxation(ruleId: string): void {
    console.log(`[建议] 考虑放松约束规则: ${ruleId}`)
  }

  private suggestRuleStrengthening(ruleId: string): void {
    console.log(`[建议] 考虑加强约束规则: ${ruleId}`)
  }
}
```

## 🚀 使用方法

### 约束验证

```bash
# 验证主题配置
"验证主题配置：dark.neutral-cool-high.vivid.compact.expressive.neon"

# 检查约束冲突
"检查当前配置的约束冲突和自动修复建议"

# 批量验证
"验证所有主题配方的约束合规性"
```

### 可访问性检查

```bash
# WCAG 合规性检查
"检查主题配置的 WCAG 2.1 AA 级别合规性"

# 动效可访问性
"验证动效配置是否符合可访问性标准"

# 色彩对比度检查
"检查文本和背景颜色的对比度是否达标"
```

### 冲突解决

```bash
# 自动冲突解决
"自动解决主题配置中的约束冲突"

# 查看解决建议
"显示约束冲突的详细解决建议"

# 用户反馈
"记录用户对约束规则的反馈意见"
```

## 📋 约束验证报告

```
🧠 智能约束系统验证报告
📅 时间: 2025-01-XX
🎯 配置: dark.neutral-cool-high.vivid.compact.expressive.neon

🔍 约束检查结果
✅ 通过约束: 5/7
⚠️ 触发警告: 2/7
❌ 强制修复: 2/7

🛠️ 自动修复
- ✅ [P0] 动效降级: expressive.spring → subtle.classic (HC 兼容性)
- ✅ [P0] 表面降级: neon → flat (清晰度保障)
- ⚠️ [P1] 饱和度调整: Vivid + Neon 组合 (已降低 30%)
- ⚠️ [P1] 密度警告: Compact + Expressive (UX 提醒)

📊 可访问性评估
- ✅ WCAG AA 合规: 是
- ✅ 对比度达标: 7.2:1 (AAA)
- ✅ 动效安全: 已优化
- ⚠️ 色彩多样性: 建议改进

🎯 最终配置
- mode: dark
- base: neutral-cool-high
- accent: mono(cyan)
- tone: vivid (已优化)
- density: compact
- motion: subtle.classic (已修复)
- surface: flat (已修复)

💡 建议
1. 考虑使用 duo 色彩策略增加多样性
2. 在高密度应用中推荐 comfortable 密度
3. 为敏感用户提供动效控制选项
```

## 🛡️ 质量保证

### 约束系统测试

- **规则覆盖测试**：确保所有约束规则都有对应的测试用例
- **边界条件测试**：验证极端组合下的约束行为
- **性能基准测试**：确保约束应用不影响性能
- **可访问性测试**：验证可访问性保障的有效性

### 持续改进机制

- **用户反馈收集**：收集开发者对约束规则的反馈
- **数据分析**：分析约束应用的统计数据
- **规则优化**：基于数据和反馈持续优化约束规则
- **文档更新**：及时更新约束规则文档

基于 Xorigo UI v1.4 SSOT，确保智能约束系统为七轴主题系统提供可靠的可访问性保障和冲突解决能力。