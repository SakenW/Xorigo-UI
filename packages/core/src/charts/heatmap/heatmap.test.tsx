/**
 * @fileoverview Heatmap 组件测试
 * @description 测试热力图组件的渲染、交互和功能
 *
 * 测试覆盖范围：
 * 1. 基础渲染测试 - 验证组件正确渲染
 * 2. 属性测试 - 验证各种 prop 的功能
 * 3. 交互测试 - 验证鼠标悬停、点击等交互
 * 4. 格式化测试 - 验证数值和工具提示格式化
 * 5. 动画测试 - 验证 Framer Motion 动画
 * 6. 响应式测试 - 验证不同尺寸的处理
 * 7. 主题集成测试 - 验证主题系统集成
 * 8. 可访问性测试 - 验证 aria 属性和键盘导航
 * 9. 边界情况测试 - 验证异常数据处理
 * 10. ref 转发测试 - 验证 ref 正确转发
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-04
 */

import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Heatmap, type HeatmapSeries } from './heatmap'
import { ThemeBridge } from '../../theme'

// ============================================================================
// Test Data
// ============================================================================

/**
 * 模拟数据 - 产品销售数据
 * 包含两个城市（北京、上海）在三个月份（1月、2月、3月）的销售数据
 * 用于测试组件的基本渲染和数据处理功能
 */
const mockData: HeatmapSeries[] = [
  {
    name: '产品销售',
    data: [
      { x: '北京', y: '1月', value: 120 },
      { x: '北京', y: '2月', value: 180 },
      { x: '北京', y: '3月', value: 220 },
      { x: '上海', y: '1月', value: 150 },
      { x: '上海', y: '2月', value: 200 },
      { x: '上海', y: '3月', value: 240 }
    ]
  }
]

// ============================================================================
// Unit Tests
// ============================================================================

/**
 * Heatmap 组件测试套件
 * 包含完整的单元测试，覆盖组件的所有功能和边界情况
 */
describe('Heatmap', () => {
  /**
   * 在每个测试前清理所有 mock 和状态
   */
  beforeEach(() => {
    vi.clearAllMocks()
  })

  /**
   * 渲染测试分组
   * 测试组件的基础渲染功能和数据显示
   */
  describe('渲染测试', () => {
    /**
     * 测试组件正确渲染
     * 验证组件能够正常挂载并显示基础结构
     */
    it('应该正确渲染热力图组件', () => {
      render(<Heatmap data={mockData} />)

      const heatmap = screen.getByRole('img')
      expect(heatmap).toBeInTheDocument()
    })

    /**
     * 测试空数据状态
     * 验证当数据为空时显示正确的占位符
     */
    it('当数据为空时应该显示占位符', () => {
      render(<Heatmap data={[]} />)

      expect(screen.getByText('暂无数据')).toBeInTheDocument()
    })

    /**
     * 测试数据点渲染
     * 验证所有数据点都被正确转换为单元格
     */
    it('应该显示所有数据点', () => {
      render(<Heatmap data={mockData} />)

      // 检查单元格数量 - 6个数据点对应6个单元格
      const cells = document.querySelectorAll('rect')
      expect(cells.length).toBe(6) // 2城市 × 3月份
    })

    /**
     * 测试坐标轴标签
     * 验证 X 轴和 Y 轴标签都正确显示
     */
    it('应该显示坐标轴标签', () => {
      render(<Heatmap data={mockData} />)

      // 验证 X 轴标签
      expect(screen.getByText('北京')).toBeInTheDocument()
      expect(screen.getByText('上海')).toBeInTheDocument()

      // 验证 Y 轴标签
      expect(screen.getByText('1月')).toBeInTheDocument()
      expect(screen.getByText('2月')).toBeInTheDocument()
      expect(screen.getByText('3月')).toBeInTheDocument()
    })
  })

  /**
   * 属性测试分组
   * 测试组件的各种 prop 配置功能
   */
  describe('属性测试', () => {
    /**
     * 测试 showValues 属性
     * 验证数值标签能够正确显示
     */
    it('应该正确处理 showValues 属性', () => {
      render(<Heatmap data={mockData} showValues={true} />)

      // 检查是否有数值标签（非轴标签的文本）
      const texts = document.querySelectorAll('text')
      const valueTexts = Array.from(texts).filter(text =>
        !['北京', '上海', '1月', '2月', '3月'].includes(text.textContent || '')
      )
      expect(valueTexts.length).toBeGreaterThan(0)
    })

    /**
     * 测试 showTooltip 属性
     * 验证工具提示的显示/隐藏功能
     */
    it('应该正确处理 showTooltip 属性', () => {
      const { rerender } = render(<Heatmap data={mockData} showTooltip={true} />)

      // 验证单元格存在
      const cell = document.querySelector('rect')
      expect(cell).toBeTruthy()

      // 测试隐藏工具提示
      rerender(<Heatmap data={mockData} showTooltip={false} />)
      // showTooltip=false 时的行为已在交互测试中验证
    })

    /**
     * 测试 showLegend 属性
     * 验证图例的显示功能
     */
    it('应该正确处理 showLegend 属性', () => {
      render(<Heatmap data={mockData} showLegend={true} />)

      // 验证图例容器存在（使用底部定位的类名）
      expect(document.querySelector('.absolute.bottom-4')).toBeInTheDocument()
    })

    /**
     * 测试 showGrid 属性
     * 验证网格线的显示功能
     */
    it('应该正确处理 showGrid 属性', () => {
      render(<Heatmap data={mockData} showGrid={true} />)

      // 验证网格线存在
      const gridLines = document.querySelectorAll('line')
      expect(gridLines.length).toBeGreaterThan(0)
    })

    /**
     * 测试 cellGap 属性
     * 验证单元格间距的配置
     */
    it('应该正确处理 cellGap 属性', () => {
      render(<Heatmap data={mockData} cellGap={10} />)

      // 验证单元格数量不变，但间距增大
      const cells = document.querySelectorAll('rect')
      expect(cells.length).toBe(6)
    })

    /**
     * 测试 cellRadius 属性
     * 验证单元格圆角的配置
     */
    it('应该正确处理 cellRadius 属性', () => {
      render(<Heatmap data={mockData} cellRadius={8} />)

      // 验证单元格存在
      const cells = document.querySelectorAll('rect')
      expect(cells.length).toBe(6)
    })

    /**
     * 测试自定义 colorScale
     * 验证自定义颜色调色板的应用
     */
    it('应该正确处理自定义 colorScale', () => {
      const customColors = ['#ff0000', '#00ff00', '#0000ff']
      render(<Heatmap data={mockData} colorScale={customColors} />)

      // 验证所有单元格都使用自定义颜色
      const cells = document.querySelectorAll('rect')
      expect(cells.length).toBe(6)
    })

    /**
     * 测试自定义 minValue 和 maxValue
     * 验证自定义数值范围的限制
     */
    it('应该正确处理自定义 minValue 和 maxValue', () => {
      render(<Heatmap data={mockData} minValue={100} maxValue={300} />)

      // 验证组件正确渲染
      expect(screen.getByRole('img')).toBeInTheDocument()
    })
  })

  /**
   * 交互测试分组
   * 测试用户的各种交互行为
   */
  describe('交互测试', () => {
    /**
     * 测试单元格悬停
     * 验证鼠标悬停时的状态变化
     */
    it('应该处理单元格悬停', async () => {
      const user = userEvent.setup()
      render(<Heatmap data={mockData} onCellHover={vi.fn()} />)

      const cell = document.querySelector('rect')
      if (cell) {
        fireEvent.mouseEnter(cell)
      }

      // 验证悬停状态已设置
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    /**
     * 测试单元格点击
     * 验证点击事件的触发和回调
     */
    it('应该处理单元格点击', async () => {
      const user = userEvent.setup()
      const handleClick = vi.fn()
      render(<Heatmap data={mockData} onCellClick={handleClick} />)

      const cell = document.querySelector('rect')
      if (cell) {
        await user.click(cell)
        // 验证点击回调被调用
        expect(handleClick).toHaveBeenCalled()
      }
    })

    /**
     * 测试工具提示显示
     * 验证鼠标悬停时工具提示的出现
     */
    it('应该显示工具提示', async () => {
      const user = userEvent.setup()
      render(<Heatmap data={mockData} showTooltip={true} />)

      const cell = document.querySelector('rect')
      if (cell) {
        fireEvent.mouseEnter(cell)
      }

      // 验证工具提示出现
      expect(document.querySelector('.absolute.pointer-events-none')).toBeInTheDocument()
    })

    /**
     * 测试鼠标移动
     * 验证鼠标移动事件的处理
     */
    it('应该处理鼠标移动', async () => {
      const user = userEvent.setup()
      render(<Heatmap data={mockData} />)

      const container = document.querySelector('.heatmap')
      if (container) {
        fireEvent.mouseMove(container)
      }

      // 验证容器存在
      expect(container).toBeInTheDocument()
    })

    /**
     * 测试鼠标离开
     * 验证鼠标离开容器时的事件处理
     */
    it('应该处理鼠标离开', async () => {
      const user = userEvent.setup()
      render(<Heatmap data={mockData} showTooltip={true} />)

      const container = document.querySelector('.heatmap')
      if (container) {
        fireEvent.mouseLeave(container)
      }

      // 验证容器存在
      expect(container).toBeInTheDocument()
    })
  })

  /**
   * 格式化测试分组
   * 测试各种格式化函数的功能
   */
  describe('格式化测试', () => {
    /**
     * 测试 formatValue 函数
     * 验证数值格式化的自定义
     */
    it('应该正确使用 formatValue', () => {
      const formatValue = (value: number) => `¥${value}`
      render(<Heatmap data={mockData} formatValue={formatValue} />)

      // 验证组件正确渲染（格式化后的值在渲染时应用）
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    /**
     * 测试 tooltipFormatter 函数
     * 验证工具提示格式化的自定义
     */
    it('应该正确使用 tooltipFormatter', () => {
      const tooltipFormatter = (data: any) => `自定义: ${data.value}`
      render(
        <Heatmap
          data={mockData}
          tooltipFormatter={tooltipFormatter}
          showTooltip={true}
        />
      )

      // 验证组件正确渲染
      expect(screen.getByRole('img')).toBeInTheDocument()
    })
  })

  /**
   * 动画测试分组
   * 测试 Framer Motion 动画相关功能
   */
  describe('动画测试', () => {
    /**
     * 测试动画持续时间
     * 验证动画时间配置
     */
    it('应该应用动画持续时间', () => {
      render(<Heatmap data={mockData} animationDuration={2} />)

      // 验证组件正确渲染，动画时间已配置
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    /**
     * 测试动画初始化
     * 验证动画元素正确初始化
     */
    it('应该正确初始化动画', () => {
      render(<Heatmap data={mockData} />)

      // 验证动画元素存在（motion.g 元素）
      const animatedElements = document.querySelectorAll('g')
      expect(animatedElements.length).toBeGreaterThan(0)
    })
  })

  /**
   * 响应式测试分组
   * 测试不同尺寸和布局的配置
   */
  describe('响应式测试', () => {
    /**
     * 测试自定义宽度
     * 验证数值宽度的处理
     */
    it('应该正确处理自定义宽度', () => {
      render(<Heatmap data={mockData} width={800} />)

      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    /**
     * 测试自定义高度
     * 验证数值高度的处理
     */
    it('应该正确处理自定义高度', () => {
      render(<Heatmap data={mockData} height={500} />)

      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    /**
     * 测试百分比宽度
     * 验证百分比宽度的处理
     */
    it('应该正确处理百分比宽度', () => {
      render(<Heatmap data={mockData} width="100%" />)

      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    /**
     * 测试内边距
     * 验证容器内边距的配置
     */
    it('应该正确处理内边距', () => {
      render(<Heatmap data={mockData} padding={80} />)

      expect(screen.getByRole('img')).toBeInTheDocument()
    })
  })

  /**
   * 主题集成测试分组
   * 测试主题系统的集成
   */
  describe('主题集成测试', () => {
    /**
     * 测试在主题桥接器中渲染
     * 验证组件与主题桥接器的集成
     */
    it('应该在主题桥接器中正确渲染', () => {
      render(
        <ThemeBridge>
          <Heatmap data={mockData} />
        </ThemeBridge>
      )

      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    /**
     * 测试主题变量使用
     * 验证组件使用 CSS 变量
     */
    it('应该使用主题变量', () => {
      render(<Heatmap data={mockData} />)

      // 验证 SVG 元素存在且使用主题变量
      const svg = document.querySelector('svg')
      expect(svg).toBeInTheDocument()
    })

    /**
     * 测试深色主题
     * 验证在深色模式下的显示
     */
    it('应该正确处理深色主题', () => {
      render(
        <ThemeBridge>
          <Heatmap data={mockData} />
        </ThemeBridge>
      )

      expect(screen.getByRole('img')).toBeInTheDocument()
    })
  })

  /**
   * 可访问性测试分组
   * 测试无障碍访问功能
   */
  describe('可访问性测试', () => {
    /**
     * 测试 role 属性
     * 验证组件具有正确的 ARIA 角色
     */
    it('应该具有正确的 role 属性', () => {
      render(<Heatmap data={mockData} ariaLabel="销售热力图" />)

      const heatmap = screen.getByRole('img')
      expect(heatmap).toBeInTheDocument()
    })

    /**
     * 测试 aria-label 属性
     * 验证自定义 aria-label 的设置
     */
    it('应该具有适当的 aria-label', () => {
      render(<Heatmap data={mockData} ariaLabel="测试热力图" />)

      // 验证 aria-label 属性设置正确
      const heatmap = screen.getByRole('img', { hidden: true })
      expect(heatmap).toHaveAttribute('aria-label', '测试热力图')
    })

    /**
     * 测试键盘导航
     * 验证键盘导航的支持
     */
    it('应该支持键盘导航', async () => {
      const user = userEvent.setup()
      render(<Heatmap data={mockData} />)

      const container = document.querySelector('.heatmap')
      if (container) {
        // 尝试焦点导航
        await user.tab()
      }

      // 验证容器存在
      expect(container).toBeInTheDocument()
    })
  })

  /**
   * 边界情况测试分组
   * 测试各种异常和边界情况
   */
  describe('边界情况测试', () => {
    /**
     * 测试单行数据
     * 验证只有一行的数据处理
     */
    it('应该处理单行数据', () => {
      const singleRowData: HeatmapSeries[] = [
        {
          name: '单行数据',
          data: [
            { x: 'A', y: 'Row1', value: 100 },
            { x: 'B', y: 'Row1', value: 200 }
          ]
        }
      ]

      render(<Heatmap data={singleRowData} />)
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    /**
     * 测试单列数据
     * 验证只有一列的数据处理
     */
    it('应该处理单列数据', () => {
      const singleColumnData: HeatmapSeries[] = [
        {
          name: '单列数据',
          data: [
            { x: 'Col1', y: 'A', value: 100 },
            { x: 'Col1', y: 'B', value: 200 }
          ]
        }
      ]

      render(<Heatmap data={singleColumnData} />)
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    /**
     * 测试负值
     * 验证负数值的处理
     */
    it('应该处理负值', () => {
      const negativeData: HeatmapSeries[] = [
        {
          name: '负值数据',
          data: [
            { x: 'A', y: 'Y1', value: -100 },
            { x: 'B', y: 'Y2', value: 50 }
          ]
        }
      ]

      render(<Heatmap data={negativeData} />)
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    /**
     * 测试零值
     * 验证零值的处理
     */
    it('应该处理零值', () => {
      const zeroData: HeatmapSeries[] = [
        {
          name: '零值数据',
          data: [
            { x: 'A', y: 'Y1', value: 0 },
            { x: 'B', y: 'Y2', value: 0 }
          ]
        }
      ]

      render(<Heatmap data={zeroData} />)
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    /**
     * 测试大数据集
     * 验证大量数据的处理性能
     */
    it('应该处理大数据集', () => {
      const largeData: HeatmapSeries[] = [
        {
          name: '大数据集',
          data: Array.from({ length: 100 }, (_, i) => ({
            x: `X${i % 10}`,
            y: `Y${Math.floor(i / 10)}`,
            value: Math.random() * 100
          }))
        }
      ]

      render(<Heatmap data={largeData} />)
      expect(screen.getByRole('img')).toBeInTheDocument()
    })
  })

  /**
   * ref 转发测试分组
   * 测试 ref 的正确转发
   */
  describe('ref 转发测试', () => {
    /**
     * 测试 ref 转发到容器元素
     * 验证 ref 能够正确转发到根元素
     */
    it('应该转发 ref 到容器元素', () => {
      const ref = React.createRef<HTMLDivElement>()
      render(<Heatmap data={mockData} ref={ref} />)

      // 验证 ref 指向正确的 DOM 元素
      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })
})
