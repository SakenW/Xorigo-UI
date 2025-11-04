/**
 * @file Sparkline 组件测试
 * @description 迷你线图组件的单元测试
 * @version 1.0.0
 * @stable true
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Sparkline } from './sparkline'

// =============================================================================
// 测试数据
// =============================================================================

const mockData = [
  { value: 10, label: '1月' },
  { value: 20, label: '2月' },
  { value: 15, label: '3月' },
  { value: 25, label: '4月' },
  { value: 30, label: '5月' },
]

// =============================================================================
// 基础渲染测试
// =============================================================================

describe('Sparkline 基础渲染', () => {
  it('应该正确渲染组件', () => {
    render(<Sparkline data={mockData} />)
    const sparkline = screen.getByRole('graphics-document')
    expect(sparkline).toBeTruthy()
  })

  it('应该应用正确的默认属性', () => {
    const { container } = render(<Sparkline data={mockData} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '120')
    expect(svg).toHaveAttribute('height', '40')
  })

  it('应该接受自定义尺寸', () => {
    const { container } = render(<Sparkline data={mockData} width={200} height={60} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveAttribute('width', '200')
    expect(svg).toHaveAttribute('height', '60')
  })
})

// =============================================================================
// 线型变体测试
// =============================================================================

describe('Sparkline 线型变体', () => {
  it('应该支持线性模式', () => {
    const { container } = render(<Sparkline data={mockData} variant="linear" />)
    const path = container.querySelector('path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('fill')).toBe('none')
  })

  it('应该支持曲线模式', () => {
    const { container } = render(<Sparkline data={mockData} variant="curve" />)
    const path = container.querySelector('path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('fill')).toBe('none')
  })

  it('应该支持面积模式', () => {
    const { container } = render(<Sparkline data={mockData} variant="area" />)
    const path = container.querySelector('path')
    expect(path).toBeTruthy()
    expect(path?.getAttribute('fill')).not.toBe('none')
  })
})

// =============================================================================
// 显示选项测试
// =============================================================================

describe('Sparkline 显示选项', () => {
  it('应该根据 showPoints 属性显示或隐藏数据点', () => {
    const { container, rerender } = render(<Sparkline data={mockData} showPoints={true} />)
    expect(container.querySelectorAll('circle').length).toBe(mockData.length)

    rerender(<Sparkline data={mockData} showPoints={false} />)
    expect(container.querySelectorAll('circle').length).toBe(0)
  })

  it('应该显示极值点标记', () => {
    const { container } = render(<Sparkline data={mockData} showExtremes={true} />)
    expect(container.querySelectorAll('circle').length).toBeGreaterThan(mockData.length)
  })

  it('应该显示阈值线', () => {
    const { container } = render(<Sparkline data={mockData} showThreshold={true} thresholdValue={20} />)
    expect(container.querySelector('line')).toBeTruthy()
  })

  it('应该显示百分比变化', () => {
    const { container } = render(<Sparkline data={mockData} showChange={true} />)
    expect(container.querySelector('.text-xs.font-medium')).toBeTruthy()
  })
})

// =============================================================================
// 颜色变体测试
// =============================================================================

describe('Sparkline 颜色变体', () => {
  const colorVariants = ['primary', 'secondary', 'success', 'danger', 'warning']

  colorVariants.forEach(variant => {
    it(`应该支持 ${variant} 颜色变体`, () => {
      const { container } = render(
        <Sparkline data={mockData} colorVariant={variant as any} />
      )
      const path = container.querySelector('path')
      expect(path).toBeTruthy()
      // 验证样式类存在
      const hasColorClass = Array.from(path?.classList || []).some(cls =>
        cls.includes(variant)
      )
      expect(hasColorClass).toBe(true)
    })
  })
})

// =============================================================================
// 交互测试
// =============================================================================

describe('Sparkline 交互功能', () => {
  it('应该触发鼠标悬停事件', () => {
    const handleHover = vi.fn()
    render(<Sparkline data={mockData} onHover={handleHover} />)

    const svg = screen.getByRole('graphics-document')
    fireEvent.mouseMove(svg)

    expect(handleHover).toHaveBeenCalled()
  })

  it('应该触发点击事件', () => {
    const handleClick = vi.fn()
    render(<Sparkline data={mockData} onClick={handleClick} />)

    const svg = screen.getByRole('graphics-document')
    fireEvent.click(svg)

    expect(handleClick).toHaveBeenCalled()
  })

  it('应该在鼠标悬停时显示工具提示', () => {
    const { container } = render(<Sparkline data={mockData} />)

    const svg = container.querySelector('svg')
    if (svg) {
      fireEvent.mouseMove(svg, { clientX: 100, clientY: 20 })
    }

    // 验证悬停指示线出现
    expect(container.querySelector('line[stroke-dasharray="2,2"]')).toBeTruthy()
  })
})

// =============================================================================
// 自定义工具提示测试
// =============================================================================

describe('Sparkline 自定义工具提示', () => {
  it('应该渲染自定义工具提示内容', () => {
    const customTooltip = vi.fn().mockReturnValue(<div>自定义提示</div>)
    render(
      <Sparkline
        data={mockData}
        renderTooltip={customTooltip}
      />
    )

    const svg = screen.getByRole('graphics-document')
    fireEvent.mouseMove(svg, { clientX: 50, clientY: 20 })

    // 验证自定义工具提示被调用
    expect(customTooltip).toHaveBeenCalled()
  })
})

// =============================================================================
// 区域标记测试
// =============================================================================

describe('Sparkline 区域标记', () => {
  it('应该渲染区域标记', () => {
    const regions = [
      { start: 0, end: 30, color: 'blue', opacity: 0.2 },
      { start: 70, end: 100, color: 'green', opacity: 0.1 },
    ]

    const { container } = render(
      <Sparkline data={mockData} regions={regions} />
    )

    // 验证区域元素存在
    expect(container.querySelectorAll('rect').length).toBe(regions.length)
  })
})

// =============================================================================
// 边缘情况测试
// =============================================================================

describe('Sparkline 边缘情况', () => {
  it('应该处理空数据数组', () => {
    const { container } = render(<Sparkline data={[]} />)
    const path = container.querySelector('path')
    expect(path?.getAttribute('d')).toBe('')
  })

  it('应该处理单点数据', () => {
    const { container } = render(<Sparkline data={[{ value: 10 }]} />)
    const path = container.querySelector('path')
    expect(path).toBeTruthy()
  })

  it('应该处理相同数值的数据', () => {
    const sameValueData = Array(5).fill({ value: 10 })
    const { container } = render(<Sparkline data={sameValueData as any} />)
    const path = container.querySelector('path')
    expect(path).toBeTruthy()
  })

  it('应该处理负数值', () => {
    const negativeData = [
      { value: -10 },
      { value: -5 },
      { value: -15 },
      { value: -8 },
    ]
    const { container } = render(<Sparkline data={negativeData} />)
    const path = container.querySelector('path')
    expect(path).toBeTruthy()
  })
})

// =============================================================================
// 辅助功能测试
// =============================================================================

describe('Sparkline 可访问性', () => {
  it('应该具有正确的 role 属性', () => {
    render(<Sparkline data={mockData} />)
    const element = screen.getByRole('graphics-document')
    expect(element).toBeTruthy()
  })

  it('应该支持 ref 转发', () => {
    const ref = { current: null }
    const { container } = render(<Sparkline data={mockData} ref={ref as any} />)
    expect(ref.current).toBeTruthy()
  })
})

// =============================================================================
// 动画测试
// =============================================================================

describe('Sparkline 动画', () => {
  it('应该默认启用动画', () => {
    const { container } = render(<Sparkline data={mockData} animated={true} />)
    // 验证动画属性存在
    const path = container.querySelector('path')
    expect(path?.style).toBeTruthy()
  })

  it('应该允许禁用动画', () => {
    const { container } = render(<Sparkline data={mockData} animated={false} />)
    const path = container.querySelector('path')
    expect(path).toBeTruthy()
  })
})
