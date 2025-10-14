# Xorigo UI 图表组件

基于 React 19 + TypeScript + Framer Motion 构建的现代化图表组件库。

## 组件概览

### LineChart - 折线图
专业的折线图组件，支持多种变体和交互。

**特性：**
- ✅ 3种变体：default, smooth, stepped
- ✅ 4种尺寸：sm, md, lg, xl
- ✅ 多系列数据展示
- ✅ 数据点标记和悬浮提示
- ✅ 动画效果
- ✅ 响应式设计
- ✅ 自定义颜色主题
- ✅ 图例显示/隐藏

**基本用法：**
```tsx
import { LineChart } from '@xorigo-ui/core'

const data = [
  {
    name: '销售额',
    data: [
      { name: '1月', value: 400, color: '#3b82f6' },
      { name: '2月', value: 300, color: '#3b82f6' },
      { name: '3月', value: 200, color: '#3b82f6' }
    ]
  }
]

<LineChart
  series={data}
  variant="smooth"
  size="lg"
  showGrid={true}
  showDots={true}
  showTooltip={true}
  showLegend={true}
  strokeWidth={3}
  animationDuration={2}
/>
```

### BarChart - 柱状图
灵活的柱状图组件，支持多种布局模式。

**特性：**
- ✅ 3种变体：default, stacked, grouped
- ✅ 4种尺寸：sm, md, lg, xl
- ✅ 垂直/水平方向
- ✅ 多系列数据
- ✅ 数值标签显示
- ✅ 动画效果
- ✅ 网格线显示
- ✅ 响应式设计

**基本用法：**
```tsx
import { BarChart } from '@xorigo-ui/core'

const data = [
  {
    name: '产品A',
    data: [
      { name: 'Q1', value: 4000 },
      { name: 'Q2', value: 3000 },
      { name: 'Q3', value: 2000 }
    ]
  }
]

<BarChart
  series={data}
  variant="grouped"
  size="lg"
  showGrid={true}
  showTooltip={true}
  showLegend={true}
  showValues={true}
  animationDuration={1.5}
/>
```

### PieChart - 饼图
直观的饼图组件，支持多种展示模式。

**特性：**
- ✅ 3种变体：default, donut, semi-circle
- ✅ 4种尺寸：sm, md, lg, xl
- ✅ 数据标签显示
- ✅ 百分比/数值切换
- ✅ 图例位置调整
- ✅ 动画效果
- ✅ 悬浮交互
- ✅ 颜色主题自定义

**基本用法：**
```tsx
import { PieChart } from '@xorigo-ui/core'

const data = [
  { name: '直接访问', value: 335, color: '#3b82f6' },
  { name: '邮件营销', value: 310, color: '#10b981' },
  { name: '联盟广告', value: 234, color: '#f59e0b' }
]

<PieChart
  data={data}
  variant="donut"
  size="lg"
  showTooltip={true}
  showLegend={true}
  showLabels={true}
  showPercentage={true}
  labelPosition="outside"
  animationDuration={1.8}
/>
```

## 设计系统集成

### 数据结构
```typescript
interface ChartData {
  name: string
  value: number
  color?: string
}

interface ChartSeries {
  name: string
  data: ChartData[]
  color?: string
}
```

### 主题支持
- ✅ 亮色/暗色模式
- ✅ 自定义颜色主题
- ✅ CSS 变量集成
- ✅ 设计令牌系统

### 响应式设计
- ✅ 自适应容器大小
- ✅ 移动端优化
- ✅ 动态尺寸调整

## 动画系统

基于 Framer Motion 构建，提供流畅的动画效果：

- ✅ 进入/退出动画
- ✅ 数据更新动画
- ✅ 交互悬浮效果
- ✅ 自定义动画时长
- ✅ 延迟动画队列

## 可访问性

完整的可访问性支持：

- ✅ SVG 元素 ARIA 标签
- ✅ 键盘导航支持
- ✅ 屏幕阅读器友好
- ✅ 高对比度模式

## API 文档

详细 API 文档和更多示例请参考组件源码和类型定义。

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这些组件。