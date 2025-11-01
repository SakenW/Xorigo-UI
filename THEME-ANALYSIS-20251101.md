# 🎨 Xorigo UI 主题七轴属性分析

**分析日期**: 2025-11-01
**系统版本**: 棕地架构 v1.5.1
**主题总数**: 10个预设主题

---

## 📋 七轴系统定义

| 轴心 | 英文 | 功能 | 取值说明 |
|------|------|------|----------|
| **模式轴** | Mode | 亮度模式 | `light`(亮色) | `dark`(暗色) | `hc`(高对比) |
| **基底轴** | Base | 中性色基底 | `neutral-{色调}-{对比度}` |
| **强调轴** | Accent | 强调色策略 | `mono(色)` | `duo(色1,色2)` | `analog(色)` |
| **色调轴** | Tone | 色彩强度 | `calm`(冷静) | `standard`(标准) | `vivid`(鲜活) |
| **密度轴** | Density | 空间密度 | `compact`(紧凑) | `comfortable`(舒适) | `spacious`(宽松) |
| **动效轴** | Motion | 动画效果 | `subtle`(微妙) | `standard`(标准) | `expressive`(表现) |
| **表面轴** | Surface | 视觉表面 | `flat`(扁平) | `soft-shadow`(柔和阴影) | `glass`(玻璃) | `glass+neon`(霓虹玻璃) | `spring`(弹性) |

---

## 🏢 企业系列 (Corporate Themes)

### 1. corporate-blue (企业蓝)
- **主题ID**: `light.neutral-cool-mid.mono(blue).standard.comfortable.standard.soft-shadow`
- **描述**: 企业蓝色配方，适用于商业应用
- **七轴属性**:
  - 模式轴: `light` (亮色模式)
  - 基底轴: `neutral-cool-mid` (冷色调中性基底，中等对比度)
  - 强调轴: `mono(blue)` (单色蓝色强调)
  - 色调轴: `standard` (标准色调)
  - 密度轴: `comfortable` (舒适密度)
  - 动效轴: `standard` (标准动效)
  - 表面轴: `soft-shadow` (柔和阴影)

### 2. corporate-navy-dark (企业深蓝)
- **主题ID**: `dark.neutral-cool-high.mono(navy).standard.comfortable.standard.soft-shadow`
- **描述**: 企业深色配方，适用于正式商业环境
- **七轴属性**:
  - 模式轴: `dark` (暗色模式)
  - 基底轴: `neutral-cool-high` (冷色调中性基底，高对比度)
  - 强调轴: `mono(navy)` (单色海军蓝强调)
  - 色调轴: `standard` (标准色调)
  - 密度轴: `comfortable` (舒适密度)
  - 动效轴: `standard` (标准动效)
  - 表面轴: `soft-shadow` (柔和阴影)

---

## 🎯 极简系列 (Minimal Themes)

### 3. minimal-white (极简白)
- **主题ID**: `light.neutral-true-mid.mono(gray).calm.spacious.subtle.flat`
- **描述**: 极简白色配方，专注内容展示
- **七轴属性**:
  - 模式轴: `light` (亮色模式)
  - 基底轴: `neutral-true-mid` (真色彩中性基底，中等对比度)
  - 强调轴: `mono(gray)` (单色灰色强调)
  - 色调轴: `calm` (冷静色调)
  - 密度轴: `spacious` (宽松密度)
  - 动效轴: `subtle` (微妙动效)
  - 表面轴: `flat` (扁平表面)

### 4. minimal-graphite-dark (极简石墨)
- **主题ID**: `dark.neutral-true-high.mono(gray).calm.comfortable.subtle.flat`
- **描述**: 极简深色配方，石墨风格设计
- **七轴属性**:
  - 模式轴: `dark` (暗色模式)
  - 基底轴: `neutral-true-high` (真色彩中性基底，高对比度)
  - 强调轴: `mono(gray)` (单色灰色强调)
  - 色调轴: `calm` (冷静色调)
  - 密度轴: `comfortable` (舒适密度)
  - 动效轴: `subtle` (微妙动效)
  - 表面轴: `flat` (扁平表面)

---

## 🚀 科技系列 (Tech Themes)

### 5. tech-cyan (科技青)
- **主题ID**: `light.neutral-cool-mid.mono(cyan).standard.comfortable.standard.soft-shadow`
- **描述**: 科技青色配方，现代科技感设计
- **七轴属性**:
  - 模式轴: `light` (亮色模式)
  - 基底轴: `neutral-cool-mid` (冷色调中性基底，中等对比度)
  - 强调轴: `mono(cyan)` (单色青色强调)
  - 色调轴: `standard` (标准色调)
  - 密度轴: `comfortable` (舒适密度)
  - 动效轴: `standard` (标准动效)
  - 表面轴: `soft-shadow` (柔和阴影)

### 6. tech-neon-dark (科技霓虹)
- **主题ID**: `dark.neutral-cool-high.duo(cyan,magenta).vivid.compact.expressive.glass+neon`
- **描述**: 科技霓虹深色配方，未来感十足
- **七轴属性**:
  - 模式轴: `dark` (暗色模式)
  - 基底轴: `neutral-cool-high` (冷色调中性基底，高对比度)
  - 强调轴: `duo(cyan,magenta)` (双色青色+洋红强调)
  - 色调轴: `vivid` (鲜活色调)
  - 密度轴: `compact` (紧凑密度)
  - 动效轴: `expressive` (表现力动效)
  - 表面轴: `glass+neon` (霓虹玻璃表面)

---

## 🎨 创意系列 (Creative Themes)

### 7. creative-purple (创意紫)
- **主题ID**: `light.neutral-true-mid.analog(purple).standard.comfortable.soft.spring`
- **描述**: 创意紫色配方，激发创造力
- **七轴属性**:
  - 模式轴: `light` (亮色模式)
  - 基底轴: `neutral-true-mid` (真色彩中性基底，中等对比度)
  - 强调轴: `analog(purple)` (类似色紫色强调)
  - 色调轴: `standard` (标准色调)
  - 密度轴: `comfortable` (舒适密度)
  - 动效轴: `soft` (柔和动效)
  - 表面轴: `spring` (弹性表面)

### 8. creative-aurora-dark (创意极光)
- **主题ID**: `dark.neutral-true-mid.analog(purple).vivid.comfortable.expressive.glass`
- **描述**: 创意极光深色配方，梦幻效果
- **七轴属性**:
  - 模式轴: `dark` (暗色模式)
  - 基底轴: `neutral-true-mid` (真色彩中性基底，中等对比度)
  - 强调轴: `analog(purple)` (类似色紫色强调)
  - 色调轴: `vivid` (鲜活色调)
  - 密度轴: `comfortable` (舒适密度)
  - 动效轴: `expressive` (表现力动效)
  - 表面轴: `glass` (玻璃表面)

---

## 🏛️ 经典系列 (Classic Themes)

### 9. classic-neutral (经典中性)
- **主题ID**: `light.neutral-true-mid.mono(gray).standard.comfortable.standard.soft-shadow`
- **描述**: 经典中性配方，永不过时的设计
- **七轴属性**:
  - 模式轴: `light` (亮色模式)
  - 基底轴: `neutral-true-mid` (真色彩中性基底，中等对比度)
  - 强调轴: `mono(gray)` (单色灰色强调)
  - 色调轴: `standard` (标准色调)
  - 密度轴: `comfortable` (舒适密度)
  - 动效轴: `standard` (标准动效)
  - 表面轴: `soft-shadow` (柔和阴影)

---

## ♿ 可访问性系列 (Accessibility Themes)

### 10. high-contrast-pro (高对比专业)
- **主题ID**: `hc.neutral-true-high.mono(blue).standard.comfortable.subtle.flat`
- **描述**: 高对比专业配方，满足WCAG AAA标准
- **七轴属性**:
  - 模式轴: `hc` (高对比模式)
  - 基底轴: `neutral-true-high` (真色彩中性基底，高对比度)
  - 强调轴: `mono(blue)` (单色蓝色强调)
  - 色调轴: `standard` (标准色调)
  - 密度轴: `comfortable` (舒适密度)
  - 动效轴: `subtle` (微妙动效)
  - 表面轴: `flat` (扁平表面)

---

## 📊 主题分布统计

| 系列分类 | 主题数量 | 占比 |
|----------|----------|------|
| 企业系列 | 2个 | 20% |
| 极简系列 | 2个 | 20% |
| 科技系列 | 2个 | 20% |
| 创意系列 | 2个 | 20% |
| 经典系列 | 1个 | 10% |
| 可访问性 | 1个 | 10% |

### 模式轴分布
- **light** (亮色): 6个主题 (60%)
- **dark** (暗色): 3个主题 (30%)
- **hc** (高对比): 1个主题 (10%)

### 密度轴分布
- **comfortable** (舒适): 7个主题 (70%)
- **spacious** (宽松): 1个主题 (10%)
- **compact** (紧凑): 2个主题 (20%)

### 表面轴分布
- **soft-shadow** (柔和阴影): 4个主题 (40%)
- **flat** (扁平): 3个主题 (30%)
- **glass** (玻璃): 2个主题 (20%)
- **glass+neon** (霓虹玻璃): 1个主题 (10%)

---

## 🎯 使用建议

### 商业应用
- **推荐**: `corporate-blue`, `corporate-navy-dark`
- **特点**: 专业、稳重、企业级

### 内容创作
- **推荐**: `minimal-white`, `creative-purple`
- **特点**: 简洁、创意、内容聚焦

### 科技产品
- **推荐**: `tech-cyan`, `tech-neon-dark`
- **特点**: 现代、未来感、科技感

### 可访问性要求
- **推荐**: `high-contrast-pro`
- **特点**: 高对比、无障碍、WCAG AAA

---

**生成时间**: 2025-11-01
**数据源**: `packages/tokens/src/index.json`
**版本**: Xorigo UI v1.5.1 (棕地架构)