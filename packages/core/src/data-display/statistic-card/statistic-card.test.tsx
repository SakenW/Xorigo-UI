/**
 * @fileoverview StatisticCard 组件测试
 * @description 验证统计卡片组件的功能特性、变体、趋势显示、图表渲染等
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-04
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { StatisticCard } from './statistic-card'
import { ThemeProvider } from '@xorigo-ui/system'

// =============================================================================
// 工具函数
// =============================================================================

const renderWithTheme = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  )
}

const mockChartData = [
  { value: 10, label: '1月' },
  { value: 15, label: '2月' },
  { value: 12, label: '3月' },
  { value: 18, label: '4月' },
  { value: 22, label: '5月' },
]

// =============================================================================
// 基础渲染测试
// =============================================================================

describe('StatisticCard', () => {
  describe('基础渲染', () => {
    it('应该正确渲染默认 StatisticCard', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
        />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toBeInTheDocument()
      expect(card).toHaveAttribute('data-state', 'normal')
      expect(screen.getByText('￥1,234,567')).toBeInTheDocument()
    })

    it('应该支持自定义 className', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          className="custom-class"
        />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveClass('custom-class')
    })

    it('应该显示自定义图标', () => {
      const icon = <span data-testid="custom-icon">💰</span>
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          icon={icon}
        />
      )

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 变体测试
  // =============================================================================

  describe('变体测试', () => {
    it('应该应用 default 变体', () => {
      renderWithTheme(
        <StatisticCard variant="default" label="总收入" value="￥1,234,567" />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveClass('bg-[var(--bg-primary)]')
    })

    it('应该应用 elevated 变体', () => {
      renderWithTheme(
        <StatisticCard variant="elevated" label="总收入" value="￥1,234,567" />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveClass('shadow-[0_4px_12px_rgba(0,0,0,0.1),0_2px_4px_rgba(0,0,0,0.06)]')
    })

    it('应该应用 filled 变体', () => {
      renderWithTheme(
        <StatisticCard variant="filled" label="总收入" value="￥1,234,567" />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveClass('bg-[var(--bg-secondary)]')
    })

    it('应该应用 gradient 变体', () => {
      renderWithTheme(
        <StatisticCard variant="gradient" label="总收入" value="￥1,234,567" />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveClass('bg-gradient-to-br')
    })

    it('应该应用 glass 变体', () => {
      renderWithTheme(
        <StatisticCard variant="glass" label="总收入" value="￥1,234,567" />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveClass('backdrop-blur-md')
    })

    it('应该应用 success 变体', () => {
      renderWithTheme(
        <StatisticCard variant="success" label="总收入" value="￥1,234,567" />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveClass('border-[var(--border-success)]')
    })

    it('应该应用 warning 变体', () => {
      renderWithTheme(
        <StatisticCard variant="warning" label="总收入" value="￥1,234,567" />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveClass('border-[var(--border-warning)]')
    })

    it('应该应用 error 变体', () => {
      renderWithTheme(
        <StatisticCard variant="error" label="总收入" value="￥1,234,567" />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveClass('border-[var(--border-error)]')
    })

    it('应该应用 info 变体', () => {
      renderWithTheme(
        <StatisticCard variant="info" label="总收入" value="￥1,234,567" />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveClass('border-[var(--border-info)]')
    })
  })

  // =============================================================================
  // 尺寸测试
  // =============================================================================

  describe('尺寸测试', () => {
    it('应该应用 sm 尺寸', () => {
      renderWithTheme(
        <StatisticCard size="sm" label="总收入" value="￥1,234,567" />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveClass('p-4')
    })

    it('应该应用 md 尺寸', () => {
      renderWithTheme(
        <StatisticCard size="md" label="总收入" value="￥1,234,567" />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveClass('p-6')
    })

    it('应该应用 lg 尺寸', () => {
      renderWithTheme(
        <StatisticCard size="lg" label="总收入" value="￥1,234,567" />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveClass('p-8')
    })
  })

  // =============================================================================
  // 趋势测试
  // =============================================================================

  describe('趋势测试', () => {
    it('应该显示上升趋势', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          trend={{ value: 12, direction: 'up', label: '较上月' }}
        />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveAttribute('data-trend', 'up')
      expect(screen.getByText('12%')).toBeInTheDocument()
      expect(screen.getByText('较上月')).toBeInTheDocument()
    })

    it('应该显示下降趋势', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          trend={{ value: 8, direction: 'down', label: '较上月' }}
        />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveAttribute('data-trend', 'down')
      expect(screen.getByText('8%')).toBeInTheDocument()
    })

    it('应该显示持平趋势', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          trend={{ value: 0, direction: 'neutral', label: '无变化' }}
        />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveAttribute('data-trend', 'neutral')
    })

    it('应该根据趋势自动应用边框颜色', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          trend={{ value: 10, direction: 'up' }}
        />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toHaveClass('border-l-[var(--border-success)]')
    })
  })

  // =============================================================================
  // 数值格式化测试
  // =============================================================================

  describe('数值格式化测试', () => {
    it('应该支持自定义格式化函数', () => {
      const formatValue = vi.fn((value) => `格式化: ${value}`)
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value={1234567}
          formatValue={formatValue}
        />
      )

      expect(screen.getByText('格式化: 1234567')).toBeInTheDocument()
      expect(formatValue).toHaveBeenCalledWith(1234567)
    })

    it('应该支持前缀', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value={1234567}
          prefix="￥"
        />
      )

      expect(screen.getByText('￥1,234,567')).toBeInTheDocument()
    })

    it('应该支持后缀', () => {
      renderWithTheme(
        <StatisticCard
          label="转化率"
          value={85}
          suffix="%"
        />
      )

      expect(screen.getByText('85%')).toBeInTheDocument()
    })

    it('应该支持货币格式化', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value={1234567}
          currency="￥"
        />
      )

      expect(screen.getByText('￥1,234,567')).toBeInTheDocument()
    })

    it('应该支持小数位数控制', () => {
      renderWithTheme(
        <StatisticCard
          label="转化率"
          value={85.5}
          precision={1}
        />
      )

      expect(screen.getByText('85.5')).toBeInTheDocument()
    })

    it('应该支持禁用千分位分隔符', () => {
      renderWithTheme(
        <StatisticCard
          label="总数"
          value={1234567}
          noThousandSeparator
        />
      )

      expect(screen.getByText('1234567')).toBeInTheDocument()
    })

    it('应该处理无效数值', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="无效数值"
        />
      )

      expect(screen.getByText('无效数值')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 对比数据测试
  // =============================================================================

  describe('对比数据测试', () => {
    it('应该显示对比数据', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value={1234567}
          comparison={{
            label: '上月',
            value: 1000000,
            type: 'increase'
          }}
        />
      )

      expect(screen.getByText('上月:')).toBeInTheDocument()
      expect(screen.getByText('1000000')).toBeInTheDocument()
    })

    it('应该根据类型应用不同颜色', () => {
      const { rerender } = renderWithTheme(
        <StatisticCard
          label="总收入"
          value={1234567}
          comparison={{
            label: '上月',
            value: 1000000,
            type: 'increase'
          }}
        />
      )

      let valueEl = screen.getByText('1000000').closest('div')
      expect(valueEl?.firstChild).toHaveClass('text-[var(--text-success)]')

      rerender(
        <StatisticCard
          label="总收入"
          value={900000}
          comparison={{
            label: '上月',
            value: 1000000,
            type: 'decrease'
          }}
        />
      )

      valueEl = screen.getByText('1000000').closest('div')
      expect(valueEl?.firstChild).toHaveClass('text-[var(--text-error)]')
    })
  })

  // =============================================================================
  // 图表测试
  // =============================================================================

  describe('图表测试', () => {
    it('应该渲染线形图表', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          chartData={mockChartData}
          chartType="line"
        />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card).toBeInTheDocument()
      // 检查是否包含 SVG 元素
      expect(card?.querySelector('svg')).toBeInTheDocument()
    })

    it('应该渲染柱状图表', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          chartData={mockChartData}
          chartType="bar"
        />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card?.querySelector('svg')).toBeInTheDocument()
    })

    it('应该渲染面积图表', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          chartData={mockChartData}
          chartType="area"
        />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card?.querySelector('svg')).toBeInTheDocument()
    })

    it('不应该渲染空图表数据', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          chartData={[]}
        />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card?.querySelector('svg')).not.toBeInTheDocument()
    })

    it('不应该渲染 undefined 图表数据', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          chartData={undefined}
        />
      )

      const card = screen.getByText('总收入').closest('[data-component="statistic-card"]')
      expect(card?.querySelector('svg')).not.toBeInTheDocument()
    })
  })

  // =============================================================================
  // 状态测试
  // =============================================================================

  describe('状态测试', () => {
    it('应该显示加载状态', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          loading
        />
      )

      const card = screen.getByTestId('statistic-card-loading')
      expect(card).toBeInTheDocument()
      expect(card).toHaveAttribute('data-state', 'loading')
      // 检查骨架屏
      expect(card.querySelector('[data-testid^="xorigo-skeleton"]')).toBeInTheDocument()
    })

    it('应该显示错误状态', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          error
          errorMessage="数据获取失败"
        />
      )

      const card = screen.getByTestId('statistic-card-error')
      expect(card).toBeInTheDocument()
      expect(card).toHaveAttribute('data-state', 'error')
      expect(screen.getByText('数据获取失败')).toBeInTheDocument()
    })

    it('应该优先显示加载状态而非错误状态', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          loading
          error
        />
      )

      expect(screen.getByTestId('statistic-card-loading')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 图标位置测试
  // =============================================================================

  describe('图标位置测试', () => {
    it('应该支持左侧图标', () => {
      const icon = <span>💰</span>
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          icon={icon}
          iconPosition="left"
        />
      )

      const card = screen.getByText('💰').closest('[data-component="statistic-card"]')
      const iconContainer = screen.getByText('💰').closest('div')?.parentElement
      expect(iconContainer).toHaveClass('mb-4')
    })

    it('应该支持右侧图标', () => {
      const icon = <span>💰</span>
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          icon={icon}
          iconPosition="right"
        />
      )

      const iconContainer = screen.getByText('💰').closest('div')
      expect(iconContainer).toHaveClass('absolute', 'top-4', 'right-4')
    })

    it('应该支持顶部图标', () => {
      const icon = <span>💰</span>
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          icon={icon}
          iconPosition="top"
        />
      )

      const iconContainer = screen.getByText('💰').closest('div')
      expect(iconContainer).toHaveClass('flex', 'justify-center')
    })
  })

  // =============================================================================
  // 可访问性测试
  // =============================================================================

  describe('可访问性测试', () => {
    it('错误状态应该设置 role="alert"', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          error
        />
      )

      const card = screen.getByTestId('statistic-card-error')
      expect(card).toHaveAttribute('role', 'alert')
    })

    it('应该包含 data-testid 属性', () => {
      renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
          testId="custom-test-id"
        />
      )

      const card = screen.getByTestId('custom-test-id')
      expect(card).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 动画测试
  // =============================================================================

  describe('动画测试', () => {
    it('应该支持悬停动画', async () => {
      const { container } = renderWithTheme(
        <StatisticCard
          label="总收入"
          value="￥1,234,567"
        />
      )

      const card = container.querySelector('[data-component="statistic-card"]')
      expect(card).toBeInTheDocument()
      // 检查是否应用了 whileHover 属性（通过 Framer Motion）
    })
  })
})
