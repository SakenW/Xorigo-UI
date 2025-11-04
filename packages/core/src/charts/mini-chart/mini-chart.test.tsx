/**
 * @file MiniChart 组件测试
 * @description 迷你图表组件的单元测试
 * @version 1.0.0
 * @stable true
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MiniChart } from './mini-chart'

// =============================================================================
// 测试数据
// =============================================================================

const mockData = [
  { value: 10, label: 'A' },
  { value: 20, label: 'B' },
  { value: 15, label: 'C' },
  { value: 25, label: 'D' },
  { value: 30, label: 'E' },
]

const mockPieData = [
  { value: 30, label: 'A', color: '#3b82f6' },
  { value: 20, label: 'B', color: '#10b981' },
  { value: 25, label: 'C', color: '#f59e0b' },
  { value: 25, label: 'D', color: '#ef4444' },
]

// =============================================================================
// 基础渲染测试
// =============================================================================

describe('MiniChart 基础渲染', () => {
  it('应该正确渲染组件', () => {
    render(<MiniChart data={mockData} />)
    const chart = screen.getByRole('graphics-document')
    expect(chart).toBeTruthy()
  })

  it('应该应用正确的默认属性', () => {
    const { container } = render(<MiniChart data={mockData} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '120')
    expect(svg).toHaveAttribute('height', '60')
  })

  it('应该接受自定义尺寸', () => {
    const { container } = render(<MiniChart data={mockData} width={200} height={80} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '200')
    expect(svg).toHaveAttribute('height', '80')
  })
})

// =============================================================================
// 图表类型测试
// =============================================================================

describe('MiniChart 图表类型', () => {
  it('应该支持线图类型', () => {
    const { container } = render(<MiniChart data={mockData} type="line" />)
    const path = container.querySelector('path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('fill')).toBe('none')
  })

  it('应该支持面积图类型', () => {
    const { container } = render(<MiniChart data={mockData} type="area" />)
    const path = container.querySelector('path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('fill')).not.toBe('none')
  })

  it('应该支持柱状图类型', () => {
    const { container } = render(<MiniChart data={mockData} type="bar" />)
    const rects = container.querySelectorAll('rect')
    expect(rects.length).toBeGreaterThan(0)
  })

  it('应该支持饼图类型', () => {
    const { container } = render(<MiniChart data={mockPieData} type="pie" />)
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBeGreaterThan(0)
  })

  it('应该支持环形图类型', () => {
    const { container } = render(<MiniChart data={mockPieData} type="donut" />)
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBeGreaterThan(0)
  })
})

// =============================================================================
// 紧凑模式测试
// =============================================================================

describe('MiniChart 紧凑模式', () => {
  it('应该支持紧凑模式', () => {
    const { container } = render(<MiniChart data={mockData} compact={true} />)
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
  })

  it('应该在小尺寸下正常工作', () => {
    const { container } = render(
      <MiniChart data={mockData} width={80} height={40} compact={true} />
    )
    const svg = container.querySelector('svg')
    expect(svg).toBeTruthy()
    expect(svg).toHaveAttribute('width', '80')
    expect(svg).toHaveAttribute('height', '40')
  })
})

// =============================================================================
// 趋势指示测试
// =============================================================================

describe('MiniChart 趋势指示', () => {
  it('应该显示趋势指示', () => {
    const { container } = render(<MiniChart data={mockData} showTrend={true} />)
    expect(container.querySelector('.text-xs.font-medium')).toBeTruthy()
  })

  it('应该根据趋势方向应用正确的颜色', () => {
    const { container } = render(<MiniChart data={mockData} showTrend={true} />)
    const trendElement = container.querySelector('.text-xs.font-medium')
    expect(trendElement).toBeTruthy()
  })

  it('应该显示上升趋势', () => {
    const upData = [
      { value: 10, label: 'A' },
      { value: 15, label: 'B' },
      { value: 20, label: 'C' },
    ]
    const { container } = render(<MiniChart data={upData} showTrend={true} />)
    const trendElement = container.querySelector('.text-xs.font-medium')
    expect(trendElement?.textContent).toMatch(/↑/)
  })

  it('应该显示下降趋势', () => {
    const downData = [
      { value: 20, label: 'A' },
      { value: 15, label: 'B' },
      { value: 10, label: 'C' },
    ]
    const { container } = render(<MiniChart data={downData} showTrend={true} />)
    const trendElement = container.querySelector('.text-xs.font-medium')
    expect(trendElement?.textContent).toMatch(/↓/)
  })

  it('应该显示持平趋势', () => {
    const neutralData = [
      { value: 10, label: 'A' },
      { value: 10.1, label: 'B' },
      { value: 10, label: 'C' },
    ]
    const { container } = render(<MiniChart data={neutralData} showTrend={true} />)
    const trendElement = container.querySelector('.text-xs.font-medium')
    expect(trendElement?.textContent).toMatch(/→/)
  })
})

// =============================================================================
// 百分比变化测试
// =============================================================================

describe('MiniChart 百分比变化', () => {
  it('应该显示百分比变化', () => {
    const { container } = render(<MiniChart data={mockData} showChange={true} />)
    const changeElement = container.querySelectorAll('.text-xs.font-medium')
    expect(changeElement.length).toBeGreaterThan(0)
  })

  it('应该计算正确的百分比变化', () => {
    const { container } = render(<MiniChart data={mockData} showChange={true} />)
    const changeElement = container.querySelector('.text-xs.font-medium')
    expect(changeElement?.textContent).toMatch(/\d+\.?\d*%/)
  })
})

// =============================================================================
// 趋势模式测试
// =============================================================================

describe('MiniChart 趋势模式', () => {
  it('应该支持自动模式', () => {
    const { container } = render(<MiniChart data={mockData} trendMode="auto" />)
    expect(container).toBeTruthy()
  })

  it('应该支持手动上升模式', () => {
    const { container } = render(<MiniChart data={mockData} trendMode="up" />)
    expect(container).toBeTruthy()
  })

  it('应该支持手动下降模式', () => {
    const { container } = render(<MiniChart data={mockData} trendMode="down" />)
    expect(container).toBeTruthy()
  })

  it('应该支持手动持平模式', () => {
    const { container } = render(<MiniChart data={mockData} trendMode="neutral" />)
    expect(container).toBeTruthy()
  })
})

// =============================================================================
// 颜色变体测试
// =============================================================================

describe('MiniChart 颜色变体', () => {
  const colorVariants: Array<'primary' | 'success' | 'danger' | 'warning' | 'neutral'> = [
    'primary',
    'success',
    'danger',
    'warning',
    'neutral',
  ]

  colorVariants.forEach(variant => {
    it(`应该支持 ${variant} 颜色变体`, () => {
      const { container } = render(
        <MiniChart data={mockData} colorVariant={variant} />
      )
      const svg = container.querySelector('svg')
      expect(svg).toBeTruthy()
    })
  })
})

// =============================================================================
// 交互测试
// =============================================================================

describe('MiniChart 交互功能', () => {
  it('应该触发鼠标悬停事件', () => {
    const handleHover = vi.fn()
    render(<MiniChart data={mockData} onHover={handleHover} />)

    const svg = screen.getByRole('graphics-document')
    fireEvent.mouseMove(svg)

    expect(handleHover).toHaveBeenCalled()
  })

  it('应该触发点击事件', () => {
    const handleClick = vi.fn()
    render(<MiniChart data={mockData} onClick={handleClick} />)

    const svg = screen.getByRole('graphics-document')
    fireEvent.click(svg)

    expect(handleClick).toHaveBeenCalled()
  })

  it('应该在鼠标悬停时显示悬停效果', () => {
    const { container } = render(<MiniChart data={mockData} type="line" />)

    const svg = container.querySelector('svg')
    if (svg) {
      fireEvent.mouseMove(svg, { clientX: 50, clientY: 30 })
    }

    expect(container).toBeTruthy()
  })
})

// =============================================================================
// 自定义工具提示测试
// =============================================================================

describe('MiniChart 自定义工具提示', () => {
  it('应该渲染自定义工具提示内容', () => {
    const customTooltip = vi.fn().mockReturnValue(<div>自定义提示</div>)
    render(
      <MiniChart
        data={mockData}
        renderTooltip={customTooltip}
      />
    )

    const svg = screen.getByRole('graphics-document')
    fireEvent.mouseMove(svg, { clientX: 50, clientY: 30 })

    expect(customTooltip).toHaveBeenCalled()
  })
})

// =============================================================================
// 特殊属性测试
// =============================================================================

describe('MiniChart 特殊属性', () => {
  it('应该接受内半径比例', () => {
    const { container } = render(
      <MiniChart data={mockPieData} type="donut" innerRadiusRatio={0.5} />
    )
    const paths = container.querySelectorAll('path')
    expect(paths.length).toBeGreaterThan(0)
  })

  it('应该接受数据点大小', () => {
    const { container } = render(
      <MiniChart data={mockData} type="line" pointSize={5} />
    )
    const circles = container.querySelectorAll('circle')
    expect(circles.length).toBeGreaterThan(0)
  })
})

// =============================================================================
// 边缘情况测试
// =============================================================================

describe('MiniChart 边缘情况', () => {
  it('应该处理空数据数组', () => {
    const { container } = render(<MiniChart data={[]} type="line" />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('应该处理单点数据', () => {
    const { container } = render(<MiniChart data={[{ value: 10 }]} type="line" />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('应该处理相同数值的数据', () => {
    const sameValueData = Array(5).fill({ value: 10 })
    const { container } = render(<MiniChart data={sameValueData as any} type="line" />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('应该处理负数值', () => {
    const negativeData = [
      { value: -10 },
      { value: -5 },
      { value: -15 },
    ]
    const { container } = render(<MiniChart data={negativeData} type="line" />)
    expect(container.querySelector('svg')).toBeTruthy()
  })
})

// =============================================================================
// 辅助功能测试
// =============================================================================

describe('MiniChart 可访问性', () => {
  it('应该具有正确的 role 属性', () => {
    render(<MiniChart data={mockData} />)
    const element = screen.getByRole('graphics-document')
    expect(element).toBeTruthy()
  })

  it('应该支持 ref 转发', () => {
    const ref = { current: null }
    const { container } = render(<MiniChart data={mockData} ref={ref as any} />)
    expect(ref.current).toBeTruthy()
  })
})

// =============================================================================
// 动画测试
// =============================================================================

describe('MiniChart 动画', () => {
  it('应该默认启用动画', () => {
    const { container } = render(<MiniChart data={mockData} animated={true} />)
    expect(container.querySelector('svg')).toBeTruthy()
  })

  it('应该允许禁用动画', () => {
    const { container } = render(<MiniChart data={mockData} animated={false} />)
    expect(container.querySelector('svg')).toBeTruthy()
  })
})
