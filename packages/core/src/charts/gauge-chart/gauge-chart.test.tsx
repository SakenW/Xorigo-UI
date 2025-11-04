/**
 * @fileoverview GaugeChart 组件测试
 * @component Charts/GaugeChart
 * @stable true
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { GaugeChart } from './gauge-chart'

// =============================================================================
// 测试工具函数
// =============================================================================

const renderGaugeChart = (props = {}) => {
  const defaultProps = {
    value: 75,
    min: 0,
    max: 100,
    ...props,
  }

  return render(<GaugeChart {...defaultProps} />)
}

// =============================================================================
// 基础渲染测试
// =============================================================================

describe('GaugeChart', () => {
  describe('基础渲染', () => {
    it('应该正确渲染组件', () => {
      renderGaugeChart()
      const chart = screen.getByRole('img')
      expect(chart).toBeInTheDocument()
    })

    it('应该显示当前数值', () => {
      renderGaugeChart({ value: 75 })
      expect(screen.getByText('75')).toBeInTheDocument()
    })

    it('应该显示单位', () => {
      renderGaugeChart({ unit: 'km/h' })
      expect(screen.getByText('km/h')).toBeInTheDocument()
    })

    it('应该显示标签', () => {
      renderGaugeChart({ label: '速度' })
      expect(screen.getByText('速度')).toBeInTheDocument()
    })

    it('应该显示最小值和最大值', () => {
      renderGaugeChart()
      expect(screen.getByText('0')).toBeInTheDocument()
      expect(screen.getByText('100')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 属性测试
  // =============================================================================

  describe('属性测试', () => {
    it('应该接受自定义最小值和最大值', () => {
      renderGaugeChart({ min: 50, max: 150 })
      expect(screen.getByText('50')).toBeInTheDocument()
      expect(screen.getByText('150')).toBeInTheDocument()
    })

    it('应该正确格式化小数位', () => {
      renderGaugeChart({ value: 75.567, decimals: 2 })
      expect(screen.getByText('75.57')).toBeInTheDocument()
    })

    it('应该支持不同的尺寸', () => {
      const { rerender } = renderGaugeChart({ size: 'sm' })
      let chart = screen.getByRole('img')
      expect(chart).toHaveClass('h-32', 'w-32')

      rerender(<GaugeChart value={75} size="lg" />)
      chart = screen.getByRole('img')
      expect(chart).toHaveClass('h-48', 'w-48')
    })

    it('应该支持半圆形和满圆形', () => {
      const { rerender } = renderGaugeChart({ shape: 'semi' })
      let chart = screen.getByRole('img')
      expect(chart.closest('div')).toHaveClass('rounded-t-full')

      rerender(<GaugeChart value={75} shape="full" />)
      chart = screen.getByRole('img')
      expect(chart.closest('div')).toHaveClass('rounded-full')
    })

    it('应该支持隐藏指针', () => {
      renderGaugeChart({ showPointer: false })
      const svg = screen.getByRole('img')
      const lines = svg.querySelectorAll('line')
      // 隐藏指针后，应该只有关键线（阈值线可能存在）
      expect(lines.length).toBeLessThanOrEqual(2)
    })

    it('应该支持隐藏阈值线', () => {
      renderGaugeChart({
        thresholds: { warning: 60, danger: 80 },
        showThresholds: false
      })
      const svg = screen.getByRole('img')
      const circles = svg.querySelectorAll('circle')
      // 只显示中心圆点（指针的圆心）
      expect(circles.length).toBe(1)
    })

    it('应该支持禁用动画', () => {
      renderGaugeChart({ animated: false })
      const svg = screen.getByRole('img')
      expect(svg).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 阈值测试
  // =============================================================================

  describe('阈值测试', () => {
    it('应该正确显示警告阈值', () => {
      renderGaugeChart({
        thresholds: { warning: 60, danger: 80 },
        showThresholds: true
      })

      const svg = screen.getByRole('img')
      const dashedLines = svg.querySelectorAll('line[stroke-dasharray]')
      expect(dashedLines.length).toBeGreaterThanOrEqual(2)
    })

    it('应该根据值显示正确的颜色', () => {
      const { rerender } = render(
        <>
          <GaugeChart value={50} thresholds={{ warning: 60, danger: 80 }} />
          <GaugeChart value={70} thresholds={{ warning: 60, danger: 80 }} />
          <GaugeChart value={90} thresholds={{ warning: 60, danger: 80 }} />
        </>
      )

      // 验证组件能正确渲染
      const charts = screen.getAllByRole('img')
      expect(charts.length).toBe(3)
    })
  })

  // =============================================================================
  // 可访问性测试
  // =============================================================================

  describe('可访问性测试', () => {
    it('应该有正确的 aria-label', () => {
      renderGaugeChart({
        value: 75,
        label: 'CPU使用率',
        unit: '%'
      })

      const chart = screen.getByRole('img')
      expect(chart).toHaveAttribute('aria-label', '仪表图: CPU使用率: 75%')
    })

    it('应该有 title 元素', () => {
      renderGaugeChart({ label: '温度' })
      const svg = screen.getByRole('img')
      expect(svg.querySelector('title')).toBeInTheDocument()
    })

    it('应该有 desc 元素', () => {
      renderGaugeChart({ value: 75, min: 0, max: 100, unit: '%' })
      const svg = screen.getByRole('img')
      expect(svg.querySelector('desc')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 数值范围测试
  // =============================================================================

  describe('数值范围测试', () => {
    it('应该正确处理最大值', () => {
      renderGaugeChart({ value: 100, max: 100 })
      expect(screen.getByText('100')).toBeInTheDocument()
    })

    it('应该正确处理最小值', () => {
      renderGaugeChart({ value: 0, min: 0 })
      expect(screen.getByText('0')).toBeInTheDocument()
    })

    it('应该处理超过最大值的情况', () => {
      renderGaugeChart({ value: 150, max: 100 })
      expect(screen.getByText('150')).toBeInTheDocument()
    })

    it('应该处理低于最小值的情况', () => {
      renderGaugeChart({ value: -10, min: 0 })
      expect(screen.getByText('-10')).toBeInTheDocument()
    })

    it('应该处理负数范围', () => {
      renderGaugeChart({ value: -5, min: -10, max: 10 })
      expect(screen.getByText('-5')).toBeInTheDocument()
      expect(screen.getByText('-10')).toBeInTheDocument()
      expect(screen.getByText('10')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 角度测试
  // =============================================================================

  describe('角度测试', () => {
    it('应该支持自定义起始角度', () => {
      renderGaugeChart({ startAngle: 270, endAngle: 90 })
      const chart = screen.getByRole('img')
      expect(chart).toBeInTheDocument()
    })

    it('应该支持自定义结束角度', () => {
      renderGaugeChart({ startAngle: 180, endAngle: 0 })
      const chart = screen.getByRole('img')
      expect(chart).toBeInTheDocument()
    })

    it('应该支持全圆角度', () => {
      renderGaugeChart({ startAngle: 0, endAngle: 360 })
      const chart = screen.getByRole('img')
      expect(chart).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 样式测试
  // =============================================================================

  describe('样式测试', () => {
    it('应该接受自定义类名', () => {
      renderGaugeChart({ className: 'custom-class' })
      const chart = screen.getByRole('img').closest('div')
      expect(chart).toHaveClass('custom-class')
    })

    it('应该应用变体样式', () => {
      renderGaugeChart({ variant: 'gradient' })
      const chart = screen.getByRole('img').closest('div')
      expect(chart).toHaveClass('bg-gradient-to-r')
    })

    it('应该传递 SVG 属性', () => {
      renderGaugeChart({ 'data-testid': 'gauge-chart' })
      expect(screen.getByTestId('gauge-chart')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 事件测试
  // =============================================================================

  describe('事件测试', () => {
    it('应该正确处理 onClick 事件', () => {
      const handleClick = vi.fn()
      renderGaugeChart({ onClick: handleClick })

      const chart = screen.getByRole('img').closest('div')
      chart?.click()

      expect(handleClick).toHaveBeenCalledTimes(1)
    })
  })

  // =============================================================================
  // 性能测试
  // =============================================================================

  describe('性能测试', () => {
    it('应该在 value 变化时更新显示', () => {
      const { rerender } = renderGaugeChart({ value: 50 })
      expect(screen.getByText('50')).toBeInTheDocument()

      rerender(<GaugeChart value={75} />)
      expect(screen.getByText('75')).toBeInTheDocument()
      expect(screen.queryByText('50')).not.toBeInTheDocument()
    })

    it('应该在 threshold 变化时重新渲染', () => {
      const { rerender } = render(
        <GaugeChart
          value={70}
          thresholds={{ warning: 60, danger: 80 }}
        />
      )

      rerender(
        <GaugeChart
          value={70}
          thresholds={{ warning: 50, danger: 90 }}
        />
      )

      expect(screen.getByText('70')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 边界情况测试
  // =============================================================================

  describe('边界情况测试', () () => {
    it('应该处理 value 为 NaN 的情况', () => {
      renderGaugeChart({ value: NaN })
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    it('应该处理 min 等于 max 的情况', () => {
      renderGaugeChart({ min: 100, max: 100 })
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    it('应该处理负数 decimals', () => {
      renderGaugeChart({ value: 75, decimals: -1 })
      expect(screen.getByRole('img')).toBeInTheDocument()
    })
  })
})
