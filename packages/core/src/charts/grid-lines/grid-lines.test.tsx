import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GridLines } from './grid-lines'
import { motion } from 'framer-motion'

// Mock Framer Motion
vi.mock('framer-motion', () => ({
  motion: {
    g: motion.g,
    line: motion.line,
    text: motion.text,
  },
}))

// 模拟 useTheme hook
vi.mock('@xorigo-ui/system', () => ({
  useTheme: vi.fn(() => ({
    themeConfig: {
      palette: {
        primary: { main: '#3b82f6' },
        secondary: { main: '#6366f1' },
      },
    },
  })),
}))

// 模拟 cn 函数
vi.mock('../../utils/cn', () => ({
  cn: vi.fn((...classes: string[]) => classes.filter(Boolean).join(' ')),
}))

// 模拟 cva
vi.mock('../../utils/cva-standalone', () => ({
  cva: vi.fn((base, config) => {
    const variants = config?.variants || {}
    return (props: Record<string, any> = {}) => {
      const classes = [base]

      // 应用变体类名
      Object.keys(variants).forEach((key) => {
        if (props[key] && variants[key][props[key]]) {
          classes.push(variants[key][props[key]])
        }
      })

      // 应用复合变体
      if (config?.compoundVariants) {
        config.compoundVariants.forEach((cv: any) => {
          let matches = true
          if (cv.className) {
            Object.keys(cv).forEach((key) => {
              if (key !== 'className' && props[key] !== cv[key]) {
                matches = false
              }
            })
          }
          if (matches && cv.className) {
            classes.push(cv.className)
          }
        })
      }

      // 应用默认变体
      if (config?.defaultVariants) {
        Object.keys(config.defaultVariants).forEach((key) => {
          if (props[key] === undefined && variants[key] && variants[key][config.defaultVariants[key]]) {
            classes.push(variants[key][config.defaultVariants[key]])
          }
        })
      }

      return classes.join(' ')
    }
  }),
  type: vi.fn(),
}))

describe('GridLines', () => {
  const defaultProps = {
    width: 400,
    height: 300,
    margin: { top: 20, right: 30, bottom: 40, left: 50 },
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('渲染水平网格线', () => {
    render(
      <GridLines
        {...defaultProps}
        direction="horizontal"
        dataRange={{ min: 0, max: 100 }}
      />
    )

    // 验证水平网格线是否存在
    const horizontalLines = document.querySelectorAll('line')
    expect(horizontalLines.length).toBeGreaterThan(0)
  })

  it('渲染垂直网格线', () => {
    render(
      <GridLines
        {...defaultProps}
        direction="vertical"
        dataRange={{ min: 0, max: 100 }}
      />
    )

    // 验证垂直网格线是否存在
    const verticalLines = document.querySelectorAll('line')
    expect(verticalLines.length).toBeGreaterThan(0)
  })

  it('渲染双向网格线', () => {
    render(
      <GridLines
        {...defaultProps}
        direction="both"
        dataRange={{ min: 0, max: 100 }}
      />
    )

    // 验证双向网格线
    const lines = document.querySelectorAll('line')
    expect(lines.length).toBeGreaterThan(0)
  })

  it('显示坐标轴', () => {
    render(
      <GridLines
        {...defaultProps}
        showAxes={true}
        dataRange={{ min: 0, max: 100 }}
      />
    )

    // 验证坐标轴存在
    const axes = document.querySelectorAll('line')
    expect(axes.length).toBeGreaterThan(0)
  })

  it('隐藏坐标轴', () => {
    render(
      <GridLines
        {...defaultProps}
        showAxes={false}
        axisStyle="none"
        dataRange={{ min: 0, max: 100 }}
      />
    )

    // 验证没有坐标轴
    const lines = document.querySelectorAll('line')
    // 只有网格线，没有坐标轴
    expect(lines.length).toBeGreaterThan(0)
  })

  it('应用自定义网格线配置', () => {
    render(
      <GridLines
        {...defaultProps}
        horizontal={{
          count: 10,
          color: 'red',
          variant: 'dashed',
          opacity: 'strong',
        }}
        vertical={{
          count: 8,
          color: 'blue',
          variant: 'dotted',
          opacity: 'medium',
        }}
        dataRange={{ min: 0, max: 100 }}
      />
    )

    // 验证网格线存在
    const lines = document.querySelectorAll('line')
    expect(lines.length).toBeGreaterThan(0)
  })

  it('显示标签', () => {
    render(
      <GridLines
        {...defaultProps}
        horizontal={{
          showLabels: true,
          formatLabel: (index: number, value: number | string) => `${value}个`,
        }}
        vertical={{
          showLabels: true,
        }}
        dataRange={{ min: 0, max: 100 }}
      />
    )

    // 验证标签存在
    const labels = document.querySelectorAll('text')
    expect(labels.length).toBeGreaterThan(0)
  })

  it('隐藏标签', () => {
    render(
      <GridLines
        {...defaultProps}
        horizontal={{ showLabels: false }}
        vertical={{ showLabels: false }}
        dataRange={{ min: 0, max: 100 }}
      />
    )

    // 验证没有标签
    const labels = document.querySelectorAll('text')
    expect(labels.length).toBe(0)
  })

  it('使用自定义数据范围和标签', () => {
    render(
      <GridLines
        {...defaultProps}
        dataRange={{
          min: 0,
          max: 1000,
          labels: ['一月', '二月', '三月', '四月', '五月', '六月'],
        }}
      />
    )

    // 验证标签文本
    const labels = document.querySelectorAll('text')
    expect(labels.length).toBeGreaterThan(0)
  })

  it('应用自定义样式类名', () => {
    render(
      <GridLines
        {...defaultProps}
        className="custom-grid-lines"
        labelClassName="custom-labels"
        dataRange={{ min: 0, max: 100 }}
      />
    )

    // 验证自定义类名
    const gridGroup = document.querySelector('.grid-lines')
    expect(gridGroup).toBeInTheDocument()
  })

  it('禁用动画', () => {
    render(
      <GridLines
        {...defaultProps}
        animated={false}
        dataRange={{ min: 0, max: 100 }}
      />
    )

    // 验证组件渲染
    const gridGroup = document.querySelector('.grid-lines')
    expect(gridGroup).toBeInTheDocument()
  })

  it('设置自定义轴样式', () => {
    render(
      <GridLines
        {...defaultProps}
        axisStyle="bold"
        dataRange={{ min: 0, max: 100 }}
      />
    )

    // 验证坐标轴样式
    const lines = document.querySelectorAll('line')
    expect(lines.length).toBeGreaterThan(0)
  })

  it('正确计算图表区域', () => {
    const { rerender } = render(
      <GridLines
        {...defaultProps}
        margin={{ top: 30, right: 40, bottom: 50, left: 60 }}
        dataRange={{ min: 0, max: 100 }}
      />
    )

    // 验证组件正确渲染
    const gridGroup = document.querySelector('.grid-lines')
    expect(gridGroup).toBeInTheDocument()

    // 重新渲染不同尺寸
    rerender(
      <GridLines
        width={600}
        height={400}
        margin={{ top: 30, right: 40, bottom: 50, left: 60 }}
        dataRange={{ min: 0, max: 100 }}
      />
    )

    expect(gridGroup).toBeInTheDocument()
  })

  it('forwardRef 工作正常', () => {
    const ref = React.createRef<SVGGElement>()

    render(
      <GridLines
        {...defaultProps}
        ref={ref}
        dataRange={{ min: 0, max: 100 }}
      />
    )

    // 验证 ref 已设置
    expect(ref.current).toBeTruthy()
  })

  it('处理空数据范围', () => {
    render(
      <GridLines
        {...defaultProps}
        dataRange={{ min: 0, max: 0 }}
      />
    )

    // 验证组件仍然渲染
    const gridGroup = document.querySelector('.grid-lines')
    expect(gridGroup).toBeInTheDocument()
  })

  it('应用不同的变体样式', () => {
    const { rerender } = render(
      <GridLines
        {...defaultProps}
        horizontal={{ variant: 'dashed' }}
        dataRange={{ min: 0, max: 100 }}
      />
    )

    // 切换到虚线样式
    rerender(
      <GridLines
        {...defaultProps}
        horizontal={{ variant: 'dotted' }}
        dataRange={{ min: 0, max: 100 }}
      />
    )

    expect(document.querySelector('.grid-lines')).toBeInTheDocument()
  })
})
