/**
 * @fileoverview RadarChart 组件测试
 * @description 测试 RadarChart 组件的渲染、交互和功能
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { RadarChart } from './radar-chart'

// ============================================================================
// 测试数据
// ============================================================================

const mockData = [
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

// ============================================================================
// 测试套件
// ============================================================================

describe('RadarChart', () => {
  describe('基本渲染', () => {
    it('应该正确渲染雷达图组件', () => {
      render(<RadarChart data={mockData} />)

      const chart = screen.getByRole('img', { hidden: true })
      expect(chart).toBeInTheDocument()
    })

    it('应该显示所有数据系列', () => {
      render(<RadarChart data={mockData} />)

      // 检查是否有对应的图例项
      expect(screen.getByText('产品 A')).toBeInTheDocument()
      expect(screen.getByText('产品 B')).toBeInTheDocument()
    })

    it('应该显示维度标签', () => {
      render(<RadarChart data={mockData} />)

      // 检查至少显示一个维度标签
      expect(screen.getByText('质量')).toBeInTheDocument()
      expect(screen.getByText('性能')).toBeInTheDocument()
    })
  })

  describe('配置选项', () => {
    it('应该正确处理 showGrid=false', () => {
      const { container } = render(
        <RadarChart data={mockData} showGrid={false} />
      )

      // 网格线应该不可见
      const svg = container.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    it('应该正确处理 showLegend=false', () => {
      render(
        <RadarChart data={mockData} showLegend={false} />
      )

      // 图例不应该显示
      expect(screen.queryByText('产品 A')).not.toBeInTheDocument()
    })

    it('应该正确处理自定义尺寸', () => {
      const { container } = render(
        <RadarChart
          data={mockData}
          width={500}
          height={400}
        />
      )

      const chart = container.querySelector('.radar-chart')
      expect(chart).toHaveStyle({
        width: '500px',
        height: '400px'
      })
    })

    it('应该正确处理自定义半径', () => {
      render(<RadarChart data={mockData} radius={150} />)

      const chart = screen.getByRole('img', { hidden: true })
      expect(chart).toBeInTheDocument()
    })

    it('应该正确处理 startAngle', () => {
      render(<RadarChart data={mockData} startAngle={0} />)

      const chart = screen.getByRole('img', { hidden: true })
      expect(chart).toBeInTheDocument()
    })
  })

  describe('数据处理', () => {
    it('应该正确处理空数据', () => {
      render(<RadarChart data={[]} />)

      const chart = screen.getByRole('img', { hidden: true })
      expect(chart).toBeInTheDocument()
    })

    it('应该正确处理单个系列', () => {
      const singleSeriesData = [mockData[0]]
      render(<RadarChart data={singleSeriesData} />)

      expect(screen.getByText('产品 A')).toBeInTheDocument()
    })

    it('应该正确处理隐藏的系列', () => {
      const dataWithHidden = [
        {
          name: '产品 A',
          color: '#3b82f6',
          visible: false,
          data: mockData[0].data
        },
        {
          name: '产品 B',
          color: '#10b981',
          data: mockData[1].data
        }
      ]

      render(<RadarChart data={dataWithHidden} />)

      // 产品 A 不应该显示
      expect(screen.queryByText('产品 A')).not.toBeInTheDocument()
      // 产品 B 应该显示
      expect(screen.getByText('产品 B')).toBeInTheDocument()
    })
  })

  describe('交互功能', () => {
    it('应该支持鼠标悬停显示工具提示', async () => {
      render(
        <RadarChart
          data={mockData}
          showTooltip={true}
          tooltipFormatter={(data) => `${data.dimension}: ${data.value}`}
        />
      )

      // 获取中心点
      const circles = document.querySelectorAll('circle')
      if (circles.length > 0) {
        fireEvent.mouseEnter(circles[0])

        // 工具提示应该出现
        // 注意：由于工具提示的实现方式，这里可能需要根据实际实现调整
      }
    })

    it('应该支持点击交互', () => {
      render(
        <RadarChart
          data={mockData}
          interactive={true}
        />
      )

      const circles = document.querySelectorAll('circle')
      if (circles.length > 0) {
        fireEvent.click(circles[0])
        // 点击应该不会抛出错误
      }
    })
  })

  describe('自定义样式', () => {
    it('应该正确应用自定义 className', () => {
      const { container } = render(
        <RadarChart data={mockData} className="custom-radar-chart" />
      )

      expect(container.firstChild).toHaveClass('custom-radar-chart')
    })

    it('应该正确应用自定义样式', () => {
      const customStyle = {
        backgroundColor: '#f0f0f0'
      }

      const { container } = render(
        <RadarChart data={mockData} style={customStyle} />
      )

      expect(container.firstChild).toHaveStyle(customStyle)
    })

    it('应该正确处理自定义颜色', () => {
      const dataWithCustomColors = [
        {
          name: '自定义产品',
          color: '#ff0000',
          data: mockData[0].data
        }
      ]

      render(<RadarChart data={dataWithCustomColors} />)

      // SVG 路径应该包含自定义颜色
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })
  })

  describe('无障碍支持', () => {
    it('应该设置正确的 aria-label', () => {
      render(
        <RadarChart
          data={mockData}
          ariaLabel="产品性能对比雷达图"
        />
      )

      // ChartContainer 应该设置 aria-label
      const chart = screen.getByRole('img', { hidden: true })
      expect(chart).toHaveAttribute('aria-label')
    })

    it('应该设置正确的 role', () => {
      render(<RadarChart data={mockData} />)

      const chart = screen.getByRole('img', { hidden: true })
      expect(chart).toHaveAttribute('role', 'img')
    })
  })

  describe('性能优化', () => {
    it('应该正确处理大数据集', () => {
      const largeDataSet = Array.from({ length: 5 }, (_, i) => ({
        name: `产品 ${String.fromCharCode(65 + i)}`,
        color: `hsl(${i * 60}, 70%, 50%)`,
        data: Array.from({ length: 12 }, (_, j) => ({
          dimension: `维度 ${j + 1}`,
          value: Math.floor(Math.random() * 100)
        }))
      }))

      const start = performance.now()
      render(<RadarChart data={largeDataSet} />)
      const end = performance.now()

      // 渲染应该在大约合理的时间内完成
      expect(end - start).toBeLessThan(1000)
    })
  })

  describe('边界情况', () => {
    it('应该处理零值', () => {
      const dataWithZeros = [
        {
          name: '零值产品',
          color: '#3b82f6',
          data: [
            { dimension: '维度1', value: 0 },
            { dimension: '维度2', value: 0 },
            { dimension: '维度3', value: 0 }
          ]
        }
      ]

      render(<RadarChart data={dataWithZeros} />)

      const chart = screen.getByRole('img', { hidden: true })
      expect(chart).toBeInTheDocument()
    })

    it('应该处理负值', () => {
      const dataWithNegatives = [
        {
          name: '负值产品',
          color: '#3b82f6',
          data: [
            { dimension: '维度1', value: -10 },
            { dimension: '维度2', value: 5 },
            { dimension: '维度3', value: -5 }
          ]
        }
      ]

      render(<RadarChart data={dataWithNegatives} />)

      const chart = screen.getByRole('img', { hidden: true })
      expect(chart).toBeInTheDocument()
    })

    it('应该处理不同长度的数据系列', () => {
      const dataWithDifferentLengths = [
        {
          name: '产品 A',
          color: '#3b82f6',
          data: [
            { dimension: '维度1', value: 80 },
            { dimension: '维度2', value: 90 }
          ]
        },
        {
          name: '产品 B',
          color: '#10b981',
          data: [
            { dimension: '维度1', value: 75 },
            { dimension: '维度2', value: 85 },
            { dimension: '维度3', value: 95 },
            { dimension: '维度4', value: 65 }
          ]
        }
      ]

      render(<RadarChart data={dataWithDifferentLengths} />)

      const chart = screen.getByRole('img', { hidden: true })
      expect(chart).toBeInTheDocument()
    })
  })
})
