# 🎯 Xorigo UI 组件预览生成器

> 自动化生成 Xorigo UI 组件预览渲染器，基于智能推断和模板化代码生成

## 📋 概述

Xorigo UI 组件预览生成器是一个专业的自动化工具，专为 Xorigo UI 设计系统打造。它能够：

- 🔍 **智能分析**: 自动分析组件库，提取组件信息和使用模式
- 🎨 **智能分类**: 根据组件功能自动分类到7大类别
- 🧠 **智能推断**: 推断组件属性、复杂度和使用模式
- ⚡ **批量生成**: 支持批量生成高质量渲染器
- 🔧 **自动化更新**: 自动更新组件映射关系

## 🚀 快速开始

### 安装要求

- Python 3.8+
- React 19+
- Xorigo UI 项目结构

### 基本使用

```bash
# 1. 分析组件库
python skill.py --analyze

# 2. 批量生成5个高优先级渲染器
python skill.py --batch --count 5

# 3. 更新组件映射
python skill.py --update-mapping

# 4. 生成分析报告
python skill.py --report
```

## 📊 支持的组件分类

### 🎨 图表组件 (Charts)
**支持的组件**: AreaChart, BarChart, LineChart, PieChart, DonutChart, FunnelChart, GaugeChart, RadarChart, Heatmap, MiniChart, Sparkline, ChartContainer, Legend, Axis, GridLines

**特性**:
- ✅ 动态数据绑定
- ✅ 交互式图表配置
- ✅ 多种图表类型切换
- ✅ 实时数据更新

### 🧱 业务区块 (Business Blocks)
**支持的组件**: HeroSection, FeatureSection, CallToActionSection, TestimonialSection, FAQSection, LoginSection, RegisterSection, AuthCard, PricingSection, ChartPanel, KPOverview, StatsGrid, FilterBar, ActivityFeed

**特性**:
- ✅ 响应式布局
- ✅ 内容编辑支持
- ✅ 多种变体主题
- ✅ 交互式配置

### 📈 数据展示 (Data Display)
**支持的组件**: Avatar, AvatarGroup, ChipDisplay, StatisticCard, DataGrid, DescriptionList, KeyValueList, ListItem, InfoTooltip, Table, List, Tree, Timeline

**特性**:
- ✅ 数据源绑定
- ✅ 选择和排序
- ✅ 分页支持
- ✅ 状态管理

### 🎛️ 增强输入 (Enhanced Inputs)
**支持的组件**: Autocomplete, ButtonGroup, CheckboxGroup, RadioGroup, Chip, IconButton, RangeSlider, Rating, Toggle, DateTimePicker, TimePicker, FileUpload, UploadButton

**特性**:
- ✅ 表单验证
- ✅ 实时预览
- ✅ 状态管理
- ✅ 事件处理

### 💬 反馈动效 (Feedback & Motion)
**支持的组件**: Announcement, Banner, Snackbar, Empty, EmptyState, Result, Loader, Skeleton, SkeletonAvatar, SkeletonBlock, SkeletonText, InlineAlert

**特性**:
- ✅ 动画效果
- ✅ 状态切换
- ✅ 位置控制
- ✅ 自动消失

### 🧭 导航组件 (Navigation)
**支持的组件**: AppShell, ContextualMenu, Link, NavLink, NavMenu, SegmentedControl, Sidenav, Stepper, Topbar, Menu, Breadcrumb, Pagination, Steps

**特性**:
- ✅ 路由集成
- ✅ 活动状态
- ✅ 响应式菜单
- ✅ 层级支持

### 📐 布局组件 (Layout)
**支持的组件**: AppLayout, Gap, PageContainer, Space, Wrap, Row, Col, Card, Collapse

**特性**:
- ✅ 栅格系统
- ✅ 弹性布局
- ✅ 响应式断点
- ✅ 间距控制

## 🛠️ 高级功能

### 智能推断系统

#### 组件复杂度评估
```python
# 复杂度判断逻辑
if name_contains(['chart', 'editor', 'upload', 'table']):
    complexity = "complex"
elif name_contains(['badge', 'tag', 'divider', 'text']):
    complexity = "simple"
else:
    complexity = "medium"
```

#### 属性智能推断
```python
# 基于名称和描述推断属性
if "颜色" in description or "color" in name:
    props.extend(["color", "variant"])
if "大小" in description or "size" in name:
    props.extend(["size", "width", "height"])
```

#### 标签系统
```python
# 自动应用标签
if "响应式" in description:
    tags.append("responsive")
if "动画" in description:
    tags.append("animated")
```

### 模板系统

#### 图表模板
```typescript
// 自动生成的图表渲染器结构
interface ChartRendererProps {
  data: Array<Record<string, any>>
  type: 'line' | 'bar' | 'pie' | 'area'
  variant: 'default' | 'gradient' | 'minimal'
  interactive: boolean
}
```

#### 业务区块模板
```typescript
// 自动生成的区块渲染器结构
interface BusinessBlockRendererProps {
  title: string
  subtitle: string
  cta: string
  variant: 'default' | 'minimal' | 'featured'
  layout: 'center' | 'left' | 'right'
}
```

## 📋 命令参考

### 完整命令列表

```bash
# 分析命令
python skill.py --analyze
# 描述: 分析组件库，提取所有组件信息并按使用频率排序

# 生成命令
python skill.py --generate --component-name "AreaChart"
# 描述: 为指定组件生成专用渲染器

# 批量生成命令
python skill.py --batch --count 10 --priority high
# 描述: 批量生成指定数量的高优先级组件渲染器

# 更新映射命令
python skill.py --update-mapping
# 描述: 更新ComponentPreview.tsx中的渲染器映射关系

# 报告生成命令
python skill.py --report
# 描述: 生成详细的分析报告和改进建议
```

### 参数说明

| 参数 | 类型 | 描述 | 默认值 | 必需 |
|------|------|------|--------|------|
| `--project-root` | string | 项目根目录路径 | . | ❌ |
| `--analyze` | flag | 分析组件库 | - | ❌ |
| `--generate` | string | 指定组件名称 | - | ❌ |
| `--batch` | flag | 批量生成 | - | ❌ |
| `--count` | integer | 批量生成数量 | 10 | ❌ |
| `--priority` | string | 生成优先级 | high | ❌ |
| `--update-mapping` | flag | 更新映射 | - | ❌ |
| `--report` | flag | 生成报告 | - | ❌ |

## 📊 输出文件

### 生成的文件结构

```
apps/website/app/workbench/components/renderers/
├── AreaChartRenderer.tsx          # 图表渲染器
├── HeroSectionRenderer.tsx        # 业务区块渲染器
├── AvatarRenderer.tsx             # 数据展示渲染器
├── AutocompleteRenderer.tsx       # 增强输入渲染器
├── AnnouncementRenderer.tsx       # 反馈动效渲染器
├── AppShellRenderer.tsx           # 导航组件渲染器
├── AppLayoutRenderer.tsx          # 布局组件渲染器
└── ...

apps/website/app/workbench/components/
└── ComponentPreview.tsx           # 更新的映射文件
```

### 渲染器代码特征

每个生成的渲染器都包含：

```typescript
// ✅ TypeScript 类型安全
interface ComponentRendererProps {
  component: any
  previewProps: Record<string, any>
  updatePreviewProp: (prop: string, value: any) => void
  isInteractiveMode: boolean
  setIsInteractiveMode: (mode: boolean) => void
  resetPreviewProps: () => void
}

// ✅ Framer Motion 动画
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  animate={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.3 }}
>

// ✅ 交互式控制面板
{isInteractiveMode && (
  <motion.div>
    {/* 变体选择 */}
    <select value={localState.variant}>
      {variants.map(variant => (
        <option key={variant} value={variant}>{variant}</option>
      ))}
    </select>

    {/* 尺寸选择 */}
    <select value={localState.size}>
      {sizes.map(size => (
        <option key={size} value={size}>{size}</option>
      ))}
    </select>

    {/* 开关控制 */}
    <input
      type="checkbox"
      checked={localState.disabled}
      onChange={(e) => handleStateChange('disabled', e.target.checked)}
    />
  </motion.div>
)}

// ✅ 主题系统集成
className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
```

## 🎯 使用示例

### 示例 1: 分析当前组件库

```bash
$ python skill.py --analyze

🔍 正在分析组件库...
✅ 分析完成，发现 135 个组件
  - AreaChart (charts) - 使用次数: 6
  - BarChart (charts) - 使用次数: 8
  - HeroSection (blocks) - 使用次数: 8
  - Avatar (data-display) - 使用次数: 9
  - Button (forms) - 使用次数: 15
```

### 示例 2: 为特定组件生成渲染器

```bash
$ python skill.py --generate "AreaChart"

🔧 正在为 AreaChart 生成渲染器...
/**
 * AreaChart 组件预览渲染器
 * 自动生成于: 2025-11-09 15:30:45
 * 组件分类: charts
 * 复杂度: complex
 * 使用频率: 6
 */

'use client'
import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface AreaChartRendererProps {
  component: any
  previewProps: Record<string, any>
  updatePreviewProp: (prop: string, value: any) => void
  isInteractiveMode: boolean
  setIsInteractiveMode: (mode: boolean) => void
  resetPreviewProps: () => void
}

export default function AreaChartRenderer({ ... }) {
  // 完整的渲染器实现
}
```

### 示例 3: 批量生成高优先级组件

```bash
$ python skill.py --batch --count 5

🚀 批量生成渲染器 (最多 5 个)...
🔧 正在生成 BarChart 渲染器...
✅ 已生成: BarChartRenderer.tsx
🔧 正在生成 LineChart 渲染器...
✅ 已生成: LineChartRenderer.tsx
🔧 正在生成 HeroSection 渲染器...
✅ 已生成: HeroSectionRenderer.tsx
🔧 正在生成 Avatar 渲染器...
✅ 已生成: AvatarRenderer.tsx
🔧 正在生成 Table 渲染器...
✅ 已生成: TableRenderer.tsx
✅ 成功生成 5 个渲染器
```

### 示例 4: 生成分析报告

```bash
$ python skill.py --report

📊 生成分析报告...
✅ 报告已生成: component-preview-report.md

# 报告内容预览
# Xorigo UI 组件预览生成报告

**生成时间**: 2025-11-09 15:30:45
**分析组件总数**: 135

## 📊 组件分类统计

- **charts**: 15个组件
- **blocks**: 16个组件
- **data-display**: 20个组件
- **enhanced-inputs**: 15个组件
- **feedback-motion**: 15个组件
- **navigation**: 13个组件
- **layout**: 8个组件
- **others**: 33个组件
```

## 🔄 集成到工作流

### 1. 开发流程集成

```bash
# 在组件开发完成后
git add ./new-component.tsx
git commit -m "feat: add new component"

# 自动生成渲染器
python /path/to/skill.py --generate --component-name "NewComponent"

# 更新映射
python /path/to/skill.py --update-mapping

# 测试渲染器
pnpm dev:website
```

### 2. CI/CD 集成

```yaml
# .github/workflows/component-preview.yml
name: Update Component Previews

on:
  push:
    paths:
      - 'packages/core/src/components/**'

jobs:
  update-previews:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      - name: Generate Renderers
        run: |
          python .claude/skills/xorigo-preview-generator/skill.py --batch --count 5
          python .claude/skills/xorigo-preview-generator/skill.py --update-mapping
      - name: Commit Changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add apps/website/app/workbench/components/renderers/
          git add apps/website/app/workbench/components/ComponentPreview.tsx
          git commit -m "auto: update component preview renderers" || exit 0
          git push
```

### 3. 预提交钩子

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# 检查是否有新组件
if git diff --cached --name-only | grep -q "packages/core/src/components"; then
  echo "🔍 检测到新组件，生成预览渲染器..."
  python .claude/skills/xorigo-preview-generator/skill.py --batch --count 3
  python .claude/skills/xorigo-preview-generator/skill.py --update-mapping
  git add apps/website/app/workbench/components/renderers/
  git add apps/website/app/workbench/components/ComponentPreview.tsx
fi
```

## 🐛 故障排除

### 常见问题

#### 1. 找不到组件库文件
```
❌ 找不到组件库文件: useComponentLibraryV2.ts
```

**解决方案**:
- 确保在 Xorigo UI 项目根目录运行
- 检查文件路径是否正确
- 确保组件库文件存在

#### 2. 生成的渲染器有类型错误
```
❌ TypeScript 编译错误
```

**解决方案**:
- 检查组件名称拼写
- 确保导入路径正确
- 运行 `pnpm type-check` 检查类型

#### 3. 渲染器无法正常工作
```
❌ 组件预览显示空白
```

**解决方案**:
- 检查 ComponentPreview.tsx 映射是否更新
- 确保渲染器文件名正确
- 检查浏览器控制台错误信息

### 调试模式

```bash
# 启用详细日志
python skill.py --batch --count 1 --verbose

# 生成调试报告
python skill.py --report --debug
```

## 📈 性能优化

### 生成速度优化

1. **批量处理**: 使用 `--batch` 参数一次生成多个渲染器
2. **优先级排序**: 优先生成高频使用的组件渲染器
3. **缓存机制**: 重复运行时利用缓存结果

### 代码质量优化

1. **模板复用**: 相似组件使用相同的模板
2. **类型推断**: 智能推断组件属性类型
3. **代码规范**: 自动应用 ESLint 和 Prettier 规范

## 🤝 贡献指南

### 添加新的组件类别

1. 在 `skill.py` 中添加新的分类
2. 创建对应的模板
3. 更新推断逻辑
4. 添加测试用例

### 改进模板

1. 修改 `RendererTemplate` 数据结构
2. 更新生成逻辑
3. 添加新的变体和尺寸
4. 测试生成结果

### 扩展功能

1. 添加新的命令行参数
2. 实现新的分析功能
3. 集成其他工具
4. 优化性能

## 📞 支持与反馈

- **GitHub Issues**: [报告问题](https://github.com/xorigo-ui/xorigo-ui/issues)
- **文档**: [详细文档](https://xorigo-ui.com/docs)
- **社区**: [讨论区](https://github.com/xorigo-ui/xorigo-ui/discussions)

---

**🎯 让我们一起打造更优秀的组件预览体验！**

*最后更新: 2025-11-09*