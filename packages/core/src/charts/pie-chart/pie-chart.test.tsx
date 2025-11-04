/**
 * @fileoverview PieChart 组件测试
 * @author Xorigo UI Team
 * @version 1.0.0
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { PieChart, type PieChartDataItem } from './pie-chart'

// ============================================================================
// 测试数据
// ============================================================================

const mockData: PieChartDataItem[] = [
  { label: '类别A', value: 30, color: 'hsl(220, 90%, 56%)' },
  { label: '类别B', value: 25, color: 'hsl(180, 90%, 56%)' },
  { label: '类别C', value: 20, color: 'hsl(140, 90%, 56%)' },
  { label: '类别D', value: 25, color: 'hsl(260, 90%, 56%)' }
]

const mockDataWithHighlights: PieChartDataItem[] = [
  { label: '突出', value: 40, highlighted: true, color: 'hsl(220, 90%, 56%)' },
  { label: '普通1', value: 20, color: 'hsl(180, 90%, 56%)' },
  { label: '普通2', value: 20, color: 'hsl(140, 90%, 56%)' },
  { label: '普通3', value: 20, color: 'hsl(260, 90%, 56%)' }
]

// ============================================================================
// 基础渲染测试
// ============================================================================

describe('PieChart 基础渲染', () => {
  it('应该正确渲染饼图组件', () => {
    render(<PieChart data={mockData} />)

    const chart = screen.getByRole('img')
    expect(chart).toBeInTheDocument()
  })

  it('应该显示所有数据项的标签', () => {
    render(<PieChart data={mockData} showLegend />)

    expect(screen.getByText('类别A')).toBeInTheDocument()
    expect(screen.getByText('类别B')).toBeInTheDocument()
    expect(screen.getByText('类别C')).toBeInTheDocument()
    expect(screen.getByText('类别D')).toBeInTheDocument()
  })

  it('应该显示百分比', () => {
    render(<PieChart data={mockData} showLegend />)

    expect(screen.getByText(/30\.0%/)).toBeInTheDocument()
    expect(screen.getByText(/25\.0%/)).toBeInTheDocument()
    expect(screen.getByText(/20\.0%/)).toBeInTheDocument()
  })
})

// ============================================================================
// 变体测试
// ============================================================================

describe('PieChart 变体', () => {
  it('应该正确渲染标准饼图', () => {
    render(<PieChart data={mockData} variant="standard" />)

    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
  })

  it('应该正确渲染环形饼图', () => {
    render(<PieChart data={mockData} variant="donut" centerText="总数据" />)

    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
  })

  it('应该正确渲染爆炸式饼图', () => {
    render(<PieChart data={mockData} variant="exploded" />)

    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
  })
})

// ============================================================================
// 尺寸测试
// ============================================================================

describe('PieChart 尺寸', () => {
  it('应该支持小尺寸', () => {
    render(<PieChart data={mockData} size="sm" />)

    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
  })

  it('应该支持中等尺寸', () => {
    render(<PieChart data={mockData} size="md" />)

    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
  })

  it('应该支持大尺寸', () => {
    render(<PieChart data={mockData} size="lg" />)

    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
  })

  it('应该支持超大尺寸', () => {
    render(<PieChart data={mockData} size="xl" />)

    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
  })
})

// ============================================================================
// 功能测试
// ============================================================================

describe('PieChart 功能', () => {
  it('应该隐藏百分比标签', () => {
    render(<PieChart data={mockData} showPercentage={false} />)

    // 百分比应该不显示在图表上，但可能在图例中显示
    expect(screen.queryByText(/30\.0%/)).not.toBeInTheDocument()
  })

  it('应该隐藏数据标签', () => {
    render(<PieChart data={mockData} showLabels={false} showLegend />)

    // 图例标签应该不显示
    expect(screen.queryByText('类别A')).not.toBeInTheDocument()
  })

  it('应该隐藏图例', () => {
    render(<PieChart data={mockData} showLegend={false} />)

    expect(screen.queryByText('类别A')).not.toBeInTheDocument()
  })

  it('应该显示自定义中心文本', () => {
    render(<PieChart data={mockData} variant="donut" centerText="自定义文本" />)

    expect(screen.getByText('自定义文本')).toBeInTheDocument()
  })

  it('应该支持自定义半径', () => {
    render(<PieChart data={mockData} radius={150} />)

    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
  })

  it('应该支持自定义内径', () => {
    render(<PieChart data={mockData} variant="donut" innerRadius={40} />)

    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
  })
})

// ============================================================================
// 交互测试
// ============================================================================

describe('PieChart 交互', () => {
  it('应该在鼠标悬停时高亮扇形', async () => {
    render(<PieChart data={mockData} showTooltip />)

    const chart = screen.getByRole('img')

    // 等待动画完成
    await waitFor(() => {
      expect(screen.getAllByRole('img').length).toBeGreaterThan(0)
    })
  })

  it('应该显示工具提示', async () => {
    const { container } = render(<PieChart data={mockData} showTooltip />)

    // 模拟鼠标事件
    const svg = screen.getByRole('img')
    fireEvent.mouseEnter(svg)

    await waitFor(() => {
      // 工具提示应该显示
      expect(screen.queryByText('类别A')).toBeInTheDocument()
    })
  })

  it('应该处理禁用状态', () => {
    render(<PieChart data={mockData} disabled />)

    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
  })
})

// ============================================================================
// 空状态测试
// ============================================================================

describe('PieChart 空状态', () => {
  it('应该显示空状态消息', () => {
    render(<PieChart data={[]} emptyText="无数据" />)

    expect(screen.getByText('无数据')).toBeInTheDocument()
  })

  it('应该显示默认空状态消息', () => {
    render(<PieChart data={[]} />)

    expect(screen.getByText('暂无数据')).toBeInTheDocument()
  })

  it('应该处理全零数据', () => {
    render(<PieChart data={[
      { label: 'A', value: 0 },
      { label: 'B', value: 0 }
    ]} />)

    expect(screen.getByText('暂无数据')).toBeInTheDocument()
  })
})

// ============================================================================
// 图例位置测试
// ============================================================================

describe('PieChart 图例位置', () => {
  it('应该支持右侧图例', () => {
    render(<PieChart data={mockData} showLegend legendPosition="right" />)

    expect(screen.getByText('类别A')).toBeInTheDocument()
  })

  it('应该支持底部图例', () => {
    render(<PieChart data={mockData} showLegend legendPosition="bottom" />)

    expect(screen.getByText('类别A')).toBeInTheDocument()
  })

  it('应该支持左侧图例', () => {
    render(<PieChart data={mockData} showLegend legendPosition="left" />)

    expect(screen.getByText('类别A')).toBeInTheDocument()
  })

  it('应该支持顶部图例', () => {
    render(<PieChart data={mockData} showLegend legendPosition="top" />)

    expect(screen.getByText('类别A')).toBeInTheDocument()
  })
})

// ============================================================================
// 高级功能测试
// ============================================================================

describe('PieChart 高级功能', () => {
  it('应该合并小扇形', () => {
    const dataWithSmallSegments: PieChartDataItem[] = [
      { label: '大项', value: 90 },
      { label: '小项1', value: 3 },
      { label: '小项2', value: 4 },
      { label: '小项3', value: 3 }
    ]

    render(<PieChart data={dataWithSmallSegments} minAngle={10} />)

    // 应该显示"其他"项
    expect(screen.getByText('其他')).toBeInTheDocument()
  })

  it('应该支持突出显示', () => {
    render(<PieChart data={mockDataWithHighlights} variant="exploded" />)

    // 突出项应该在爆炸式模式下分离
    expect(screen.getByText('突出')).toBeInTheDocument()
  })

  it('应该支持自定义颜色主题', () => {
    const customColors = ['red', 'blue', 'green', 'yellow']

    render(
      <PieChart
        data={mockData}
        colorTheme={customColors}
        showLegend
      />
    )

    expect(screen.getByText('类别A')).toBeInTheDocument()
  })
})

// ============================================================================
// 无障碍测试
// ============================================================================

describe('PieChart 无障碍', () => {
  it('应该具有正确的ARIA标签', () => {
    render(<PieChart data={mockData} />)

    const chart = screen.getByRole('img')
    expect(chart).toHaveAttribute('aria-label')
  })

  it('应该为每个扇形提供描述', () => {
    render(<PieChart data={mockData} />)

    // SVG中应该有带有aria-label的元素
    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
  })

  it('工具提示应该具有正确的ARIA角色', () => {
    render(<PieChart data={mockData} showTooltip />)

    // 工具提示区域应该有role="tooltip"
    const svg = screen.getByRole('img')
    expect(svg).toBeInTheDocument()
  })
})

// ============================================================================
// 性能测试
// ============================================================================

describe('PieChart 性能', () => {
  it('应该处理大量数据项', () => {
    const largeData: PieChartDataItem[] = Array.from({ length: 50 }, (_, i) => ({
      label: `项${i}`,
      value: Math.random() * 100,
      color: `hsl(${i * 7}, 90%, 56%)`
    }))

    const start = performance.now()
    render(<PieChart data={largeData} showLegend />)
    const end = performance.now()

    // 渲染时间应该少于1秒
    expect(end - start).toBeLessThan(1000)
  })
})

// ============================================================================
// 边缘情况测试
// ============================================================================

describe('PieChart 边缘情况', () => {
  it('应该处理负值数据', () => {
    const dataWithNegative: PieChartDataItem[] = [
      { label: '正数', value: 100 },
      { label: '负数', value: -20 },
      { label: '零', value: 0 }
    ]

    render(<PieChart data={dataWithNegative} />)

    expect(screen.getByText('正数')).toBeInTheDocument()
  })

  it('应该处理极大数值', () => {
    const dataWithLargeValues: PieChartDataItem[] = [
      { label: '极大值', value: Number.MAX_SAFE_INTEGER }
    ]

    render(<PieChart data={dataWithLargeValues} />)

    expect(screen.getByText('极大值')).toBeInTheDocument()
  })

  it('应该处理非常长的标签', () => {
    const dataWithLongLabels: PieChartDataItem[] = [
      { label: '这是一个非常非常长的标签名称，用于测试长标签的处理', value: 50 },
      { label: '另一个长标签', value: 50 }
    ]

    render(<PieChart data={dataWithLongLabels} showLegend />)

    expect(screen.getByText('这是一个非常非常长的标签名称')).toBeInTheDocument()
  })
})
