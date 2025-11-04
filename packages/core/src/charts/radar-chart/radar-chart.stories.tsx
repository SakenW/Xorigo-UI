/**
 * @fileoverview RadarChart 组件故事文件
 * @description 展示 RadarChart 组件的各种使用场景和配置选项
 */

import type { Meta, StoryObj } from '@storybook/react'
import { RadarChart } from './radar-chart'

// ============================================================================
// Meta 配置
// ============================================================================

const meta = {
  title: 'Charts/RadarChart',
  component: RadarChart,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
雷达图组件用于展示多维数据的对比分析。通过雷达图可以直观地比较不同系列在各个维度上的表现。

## 特性

- 支持多个数据系列对比
- 可配置的网格线和标签
- 支持面积填充和透明度
- 支持鼠标交互和工具提示
- 主题系统集成
- Framer Motion 动画支持

## 使用场景

- 产品性能对比
- 多维度评估分析
- 技能雷达图
- KPI 仪表盘
        `
      }
    }
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      control: 'object',
      description: '雷达图数据系列'
    },
    showGrid: {
      control: 'boolean',
      description: '是否显示网格线'
    },
    showGridLabels: {
      control: 'boolean',
      description: '是否显示网格标签'
    },
    showLegend: {
      control: 'boolean',
      description: '是否显示图例'
    },
    showTooltip: {
      control: 'boolean',
      description: '是否显示工具提示'
    },
    radius: {
      control: { type: 'number', min: 50, max: 200, step: 10 },
      description: '雷达图半径'
    },
    startAngle: {
      control: { type: 'number', min: -180, max: 180, step: 15 },
      description: '雷达图起始角度（度数）'
    },
    height: {
      control: { type: 'number', min: 200, max: 600, step: 50 },
      description: '图表高度'
    },
    width: {
      control: { type: 'number', min: 200, max: 800, step: 50 },
      description: '图表宽度'
    },
    showCenterPoint: {
      control: 'boolean',
      description: '是否显示中心点'
    },
    gridLevels: {
      control: { type: 'number', min: 3, max: 10, step: 1 },
      description: '网格线数量'
    },
    fillArea: {
      control: 'boolean',
      description: '是否填充区域'
    },
    interactive: {
      control: 'boolean',
      description: '是否启用交互'
    },
    gridLineStyle: {
      control: 'select',
      options: ['circle', 'polygon'],
      description: '网格线样式'
    },
    gridLineColor: {
      control: 'color',
      description: '网格线颜色'
    },
    labelFontSize: {
      control: { type: 'number', min: 8, max: 20, step: 1 },
      description: '标签字体大小'
    }
  }
} satisfies Meta<typeof RadarChart>

export default meta
export { meta }
type Story = StoryObj<typeof meta>

// ============================================================================
// 故事集合
// ============================================================================

// 基础示例
export const Basic: Story = {
  name: '基础雷达图',
  args: {
    data: [
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
    ],
    height: 400,
    width: 500
  }
}

// 多系列对比
export const MultipleSeries: Story = {
  name: '多系列对比',
  args: {
    data: [
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
      },
      {
        name: '产品 C',
        color: '#f59e0b',
        data: [
          { dimension: '质量', value: 88 },
          { dimension: '性能', value: 92 },
          { dimension: '价格', value: 65 },
          { dimension: '服务', value: 90 },
          { dimension: '设计', value: 87 },
          { dimension: '创新', value: 95 }
        ]
      }
    ],
    height: 400,
    width: 600,
    showLegend: true
  }
}

// 技能雷达图
export const SkillsRadar: Story = {
  name: '技能雷达图',
  args: {
    data: [
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
    ],
    height: 450,
    width: 550,
    showLegend: true,
    legendPosition: 'bottom'
  }
}

// 自定义样式
export const CustomStyle: Story = {
  name: '自定义样式',
  args: {
    data: [
      {
        name: '自定义系列',
        color: '#ff6b6b',
        fillOpacity: 0.4,
        showStroke: true,
        data: [
          { dimension: '指标1', value: 85 },
          { dimension: '指标2', value: 92 },
          { dimension: '指标3', value: 78 },
          { dimension: '指标4', value: 88 },
          { dimension: '指标5', value: 95 }
        ]
      }
    ],
    height: 400,
    width: 500,
    showGrid: true,
    showGridLabels: true,
    showCenterPoint: true,
    centerPointSize: 6,
    gridLevels: 6,
    fillArea: true,
    gridLineStyle: 'circle',
    gridLineColor: '#e5e7eb',
    labelFontSize: 14,
    labelColor: '#6b7280'
  }
}

// 无网格线
export const NoGrid: Story = {
  name: '无网格线',
  args: {
    data: [
      {
        name: '产品 A',
        color: '#3b82f6',
        data: [
          { dimension: '维度1', value: 80 },
          { dimension: '维度2', value: 90 },
          { dimension: '维度3', value: 70 },
          { dimension: '维度4', value: 85 },
          { dimension: '维度5', value: 95 },
          { dimension: '维度6', value: 88 }
        ]
      }
    ],
    height: 400,
    width: 500,
    showGrid: false,
    showGridLabels: true,
    showLegend: false
  }
}

// 大维度数量
export const ManyDimensions: Story = {
  name: '多维度雷达图',
  args: {
    data: [
      {
        name: '产品 A',
        color: '#3b82f6',
        data: [
          { dimension: '质量', value: 80 },
          { dimension: '性能', value: 90 },
          { dimension: '价格', value: 70 },
          { dimension: '服务', value: 85 },
          { dimension: '设计', value: 95 },
          { dimension: '创新', value: 88 },
          { dimension: '品牌', value: 92 },
          { dimension: '口碑', value: 87 },
          { dimension: '渠道', value: 83 },
          { dimension: '生态', value: 90 }
        ]
      }
    ],
    height: 500,
    width: 600,
    showGrid: true,
    showGridLabels: true,
    gridLevels: 5
  }
}

// 自定义起始角度
export const CustomStartAngle: Story = {
  name: '自定义起始角度',
  args: {
    data: [
      {
        name: '产品 A',
        color: '#3b82f6',
        data: [
          { dimension: 'A', value: 80 },
          { dimension: 'B', value: 90 },
          { dimension: 'C', value: 70 },
          { dimension: 'D', value: 85 },
          { dimension: 'E', value: 95 },
          { dimension: 'F', value: 88 }
        ]
      }
    ],
    height: 400,
    width: 500,
    startAngle: 0,
    showGrid: true
  }
}

// 工具提示自定义
export const CustomTooltip: Story = {
  name: '自定义工具提示',
  args: {
    data: [
      {
        name: '产品 A',
        color: '#3b82f6',
        data: [
          { dimension: '质量', value: 80 },
          { dimension: '性能', value: 90 },
          { dimension: '价格', value: 70 },
          { dimension: '服务', value: 85 },
          { dimension: '设计', value: 95 }
        ]
      }
    ],
    height: 400,
    width: 500,
    showTooltip: true,
    tooltipFormatter: (data, series) => (
      <div className="p-2">
        <div className="font-semibold">{series.name}</div>
        <div>{data.dimension}: {data.value}分</div>
        <div className="text-sm text-gray-500">满意度: {data.value > 80 ? '高' : '中'}</div>
      </div>
    )
  }
}

// 隐藏系列
export const HiddenSeries: Story = {
  name: '隐藏系列',
  args: {
    data: [
      {
        name: '产品 A',
        color: '#3b82f6',
        visible: true,
        data: [
          { dimension: '质量', value: 80 },
          { dimension: '性能', value: 90 },
          { dimension: '价格', value: 70 },
          { dimension: '服务', value: 85 },
          { dimension: '设计', value: 95 }
        ]
      },
      {
        name: '产品 B',
        color: '#10b981',
        visible: false,
        data: [
          { dimension: '质量', value: 75 },
          { dimension: '性能', value: 85 },
          { dimension: '价格', value: 90 },
          { dimension: '服务', value: 80 },
          { dimension: '设计', value: 82 }
        ]
      }
    ],
    height: 400,
    width: 500,
    showLegend: true
  }
}

// 响应式尺寸
export const Responsive: Story = {
  name: '响应式尺寸',
  args: {
    data: [
      {
        name: '产品 A',
        color: '#3b82f6',
        data: [
          { dimension: '质量', value: 80 },
          { dimension: '性能', value: 90 },
          { dimension: '价格', value: 70 },
          { dimension: '服务', value: 85 },
          { dimension: '设计', value: 95 }
        ]
      }
    ],
    height: '100%',
    width: '100%',
    showLegend: false
  }
}

// 小尺寸雷达图
export const Small: Story = {
  name: '小尺寸雷达图',
  args: {
    data: [
      {
        name: '产品 A',
        color: '#3b82f6',
        data: [
          { dimension: 'A', value: 80 },
          { dimension: 'B', value: 90 },
          { dimension: 'C', value: 70 }
        ]
      }
    ],
    height: 250,
    width: 300,
    showGrid: false,
    showCenterPoint: true,
    centerPointSize: 3,
    labelFontSize: 10
  }
}

// 大尺寸雷达图
export const Large: Story = {
  name: '大尺寸雷达图',
  args: {
    data: [
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
    ],
    height: 600,
    width: 700,
    radius: 200,
    showGrid: true,
    gridLevels: 7,
    showCenterPoint: true,
    centerPointSize: 6,
    labelFontSize: 16
  }
}
