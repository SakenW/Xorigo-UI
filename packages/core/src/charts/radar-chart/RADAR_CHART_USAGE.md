# RadarChart 使用指南

## 概述

RadarChart（雷达图）组件用于展示多维度数据的对比分析。通过雷达图可以直观地比较不同系列在各个维度上的表现。

## 基本用法

### 导入组件

```tsx
import { RadarChart } from '@xorigo-ui/core'
```

### 基础示例

```tsx
import { RadarChart } from '@xorigo-ui/core'
import React from 'react'

const data = [
  {
    name: '产品 A',
    color: '#3b82f6',
    data: [
      { dimension: '质量', value: 80 },
      { dimension: '性能', value: 90 },
      { dimension: '价格', value: 70 },
      { dimension: '服务', value: 85 },
      { dimension: '设计', value: 95 },
      { dimension: '创新', value: 88 }
    ]
  }
]

function App() {
  return (
    <div style={{ width: 500, height: 400 }}>
      <RadarChart data={data} />
    </div>
  )
}

export default App
```

## 多系列对比

```tsx
const multiSeriesData = [
  {
    name: '产品 A',
    color: '#3b82f6',
    data: [
      { dimension: '质量', value: 80 },
      { dimension: '性能', value: 90 },
      { dimension: '价格', value: 70 },
      { dimension: '服务', value: 85 },
      { dimension: '设计', value: 95 },
      { dimension: '创新', value: 88 }
    ]
  },
  {
    name: '产品 B',
    color: '#10b981',
    data: [
      { dimension: '质量', value: 75 },
      { dimension: '性能', value: 85 },
      { dimension: '价格', value: 90 },
      { dimension: '服务', value: 80 },
      { dimension: '设计', value: 82 },
      { dimension: '创新', value: 78 }
    ]
  }
]

function App() {
  return (
    <RadarChart
      data={multiSeriesData}
      height={400}
      width={600}
      showLegend={true}
    />
  )
}
```

## 自定义样式

```tsx
function CustomStyleExample() {
  return (
    <RadarChart
      data={data}
      showGrid={true}
      showGridLabels={true}
      showCenterPoint={true}
      centerPointSize={6}
      gridLevels={6}
      fillArea={true}
      gridLineStyle="circle"
      gridLineColor="#e5e7eb"
      labelFontSize={14}
      labelColor="#6b7280"
      height={400}
      width={500}
    />
  )
}
```

## 技能雷达图示例

```tsx
const skillsData = [
  {
    name: '张三',
    color: '#8b5cf6',
    data: [
      { dimension: '前端开发', value: 90 },
      { dimension: '后端开发', value: 75 },
      { dimension: '数据库', value: 80 },
      { dimension: 'DevOps', value: 65 },
      { dimension: 'UI/UX', value: 85 },
      { dimension: '项目管理', value: 70 },
      { dimension: '数据分析', value: 78 }
    ]
  },
  {
    name: '李四',
    color: '#ec4899',
    data: [
      { dimension: '前端开发', value: 85 },
      { dimension: '后端开发', value: 88 },
      { dimension: '数据库', value: 92 },
      { dimension: 'DevOps', value: 70 },
      { dimension: 'UI/UX', value: 75 },
      { dimension: '项目管理', value: 80 },
      { dimension: '数据分析', value: 82 }
    ]
  }
]

function SkillsRadar() {
  return (
    <RadarChart
      data={skillsData}
      height={450}
      width={550}
      showLegend={true}
      showTooltip={true}
    />
  )
}
```

## 自定义工具提示

```tsx
function CustomTooltipExample() {
  return (
    <RadarChart
      data={data}
      showTooltip={true}
      tooltipFormatter={(dataPoint, series) => (
        <div className="p-2">
          <div className="font-semibold">{series.name}</div>
          <div>{dataPoint.dimension}: {dataPoint.value}分</div>
          <div className="text-sm text-gray-500">
            满意度: {dataPoint.value > 80 ? '高' : '中'}
          </div>
        </div>
      )}
    />
  )
}
```

## 隐藏系列

```tsx
function HiddenSeriesExample() {
  return (
    <RadarChart
      data={[
        {
          name: '产品 A',
          color: '#3b82f6',
          visible: true,
          data: [...data]
        },
        {
          name: '产品 B',
          color: '#10b981',
          visible: false, // 隐藏这个系列
          data: [...]
        }
      ]}
      showLegend={true}
    />
  )
}
```

## API 参考

### 属性

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `data` | `RadarSeries[]` | - | **必填** - 雷达图数据系列 |
| `showGrid` | `boolean` | `true` | 是否显示网格线 |
| `showGridLabels` | `boolean` | `true` | 是否显示网格标签 |
| `showLegend` | `boolean` | `true` | 是否显示图例 |
| `showTooltip` | `boolean` | `true` | 是否显示工具提示 |
| `tooltipFormatter` | `(data: RadarDataPoint, series: RadarSeries) => React.ReactNode` | - | 工具提示的自定义渲染函数 |
| `radius` | `number` | `120` | 雷达图的半径 |
| `startAngle` | `number` | `-90` | 雷达图的起始角度（度数） |
| `height` | `number \| string` | `400` | 图表高度 |
| `width` | `number \| string` | `'100%'` | 图表宽度 |
| `showCenterPoint` | `boolean` | `true` | 是否显示中心点 |
| `centerPointSize` | `number` | `4` | 中心点大小 |
| `gridLevels` | `number` | `5` | 网格线数量 |
| `fillArea` | `boolean` | `true` | 是否填充区域 |
| `interactive` | `boolean` | `true` | 是否启用交互 |
| `gridLineStyle` | `'circle' \| 'polygon'` | `'circle'` | 网格线样式 |
| `gridLineColor` | `string` | - | 网格线颜色 |
| `labelFontSize` | `number` | `12` | 维度标签字体大小 |
| `labelColor` | `string` | - | 维度标签颜色 |

### RadarSeries 接口

```typescript
interface RadarSeries {
  name: string              // 系列名称
  color: string             // 系列颜色
  data: RadarDataPoint[]    // 系列数据
  visible?: boolean         // 系列是否可见（可选）
  fillOpacity?: number      // 填充透明度（可选）
  showStroke?: boolean      // 是否显示边界线（可选）
}
```

### RadarDataPoint 接口

```typescript
interface RadarDataPoint {
  dimension: string  // 维度名称
  value: number      // 维度值
  [key: string]: any // 自定义数据
}
```

## 最佳实践

1. **维度数量控制**：建议将维度数量控制在 3-10 个之间，以保证图表的可读性。

2. **颜色选择**：
   - 使用对比明显的颜色区分不同系列
   - 推荐使用 ColorBrewer 或类似工具生成调色板

3. **透明度设置**：
   - 合理设置透明度（0.3-0.5）以便观察重叠区域
   - 避免过高的透明度导致数据难以辨认

4. **网格线配置**：
   - 根据数据范围调整网格线数量
   - 5-7 条网格线通常能提供良好的参考

5. **数据质量**：
   - 确保所有系列的数据维度一致
   - 处理缺失数据（组件会自动忽略）

6. **响应式设计**：
   - 在移动设备上考虑简化交互
   - 使用合适的标签字体大小

## 常见问题

### Q: 如何处理不同维度的数据系列？

A: 组件会自动合并所有系列中的维度，缺失的维度值会被设置为 0。建议在数据准备阶段确保所有系列的数据维度一致。

### Q: 如何优化大数据集的性能？

A: 可以通过以下方式优化：
- 减少维度数量
- 降低动画持续时间
- 禁用不必要的效果（如中心点）

### Q: 如何自定义网格线样式？

A: 可以使用 `gridLineStyle` 和 `gridLineColor` 属性来自定义网格线外观。

### Q: 支持负值吗？

A: 支持，但负值会被处理为 0。建议在数据处理阶段确保所有值都为非负数。

### Q: 如何禁用所有交互？

A: 设置 `interactive={false}` 即可禁用所有交互功能。

## 相关组件

- [ChartContainer](chart-container) - 图表容器
- [Legend](legend) - 图例组件
- [ChartTooltip](chart-tooltip) - 工具提示组件
- [AreaChart](area-chart) - 面积图组件
- [DonutChart](donut-chart) - 环形图组件
