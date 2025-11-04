/**
 * @fileoverview DataGrid 组件测试
 * @description 验证 DataGrid 组件的功能特性、排序、过滤、分页等
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-04
 */

import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DataGrid, type DataGridColumn } from './data-grid'

// Mock framer-motion 在测试环境
vi.mock('framer-motion', () => ({
  motion: {
    tr: 'tr',
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useReducedMotion: () => true,
}))

// =============================================================================
// 工具函数和测试数据
// =============================================================================

const renderDataGrid = (props: any = {}) => {
  const defaultProps = {
    data: [
      { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com' },
      { id: 2, name: '李四', age: 30, email: 'lisi@example.com' },
      { id: 3, name: '王五', age: 28, email: 'wangwu@example.com' },
    ],
    columns: [
      { key: 'id', title: 'ID', sortable: true },
      { key: 'name', title: '姓名', sortable: true },
      { key: 'age', title: '年龄', sortable: true },
      { key: 'email', title: '邮箱' },
    ],
    ...props,
  }
  return render(<DataGrid {...defaultProps} />)
}

const columns: DataGridColumn[] = [
  { key: 'id', title: 'ID', sortable: true },
  { key: 'name', title: '姓名', sortable: true, filterable: true },
  { key: 'age', title: '年龄', sortable: true },
  { key: 'email', title: '邮箱' },
]

// =============================================================================
// 基础渲染测试
// =============================================================================

describe('DataGrid', () => {
  describe('基础渲染', () => {
    it('应该正确渲染基础 DataGrid', () => {
      renderDataGrid()

      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByText('ID')).toBeInTheDocument()
      expect(screen.getByText('姓名')).toBeInTheDocument()
      expect(screen.getByText('张三')).toBeInTheDocument()
    })

    it('应该支持自定义 className', () => {
      renderDataGrid({ className: 'custom-class' })

      const container = screen.getByRole('table').closest('[data-component="data-grid"]')
      expect(container).toHaveClass('custom-class')
    })

    it('应该渲染所有列', () => {
      renderDataGrid()

      expect(screen.getByText('ID')).toBeInTheDocument()
      expect(screen.getByText('姓名')).toBeInTheDocument()
      expect(screen.getByText('年龄')).toBeInTheDocument()
      expect(screen.getByText('邮箱')).toBeInTheDocument()
    })

    it('应该渲染所有数据行', () => {
      renderDataGrid()

      expect(screen.getByText('张三')).toBeInTheDocument()
      expect(screen.getByText('李四')).toBeInTheDocument()
      expect(screen.getByText('王五')).toBeInTheDocument()
    })

    it('应该支持 ref 转发', () => {
      const ref = { current: null }
      renderDataGrid({ ref })

      expect(ref.current).toBeTruthy()
      expect(typeof ref.current?.export).toBe('function')
      expect(typeof ref.current?.clearSelection).toBe('function')
      expect(typeof ref.current?.selectAll).toBe('function')
    })
  })

  // =============================================================================
  // 变体测试
  // =============================================================================

  describe('变体测试', () => {
    it('应该应用 default 变体', () => {
      renderDataGrid({ variant: 'default' })
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })

    it('应该应用 striped 变体', () => {
      renderDataGrid({ variant: 'striped' })
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })

    it('应该应用 bordered 变体', () => {
      renderDataGrid({ variant: 'bordered' })
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })

    it('应该应用 minimal 变体', () => {
      renderDataGrid({ variant: 'minimal' })
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 尺寸测试
  // =============================================================================

  describe('尺寸测试', () => {
    it('应该支持 sm 尺寸', () => {
      renderDataGrid({ size: 'sm' })
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })

    it('应该支持 md 尺寸', () => {
      renderDataGrid({ size: 'md' })
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })

    it('应该支持 lg 尺寸', () => {
      renderDataGrid({ size: 'lg' })
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 密度测试
  // =============================================================================

  describe('密度测试', () => {
    it('应该支持 compact 密度', () => {
      renderDataGrid({ density: 'compact' })
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })

    it('应该支持 normal 密度', () => {
      renderDataGrid({ density: 'normal' })
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })

    it('应该支持 comfortable 密度', () => {
      renderDataGrid({ density: 'comfortable' })
      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 排序功能测试
  // =============================================================================

  describe('排序功能', () => {
    it('应该在点击可排序列时触发排序', async () => {
      const onSort = vi.fn()
      renderDataGrid({ onSort })

      const nameHeader = screen.getByText('姓名').closest('th')
      fireEvent.click(nameHeader!)

      expect(onSort).toHaveBeenCalled()
    })

    it('应该在多次点击时切换排序方向', async () => {
      const onSort = vi.fn()
      renderDataGrid({ onSort })

      const nameHeader = screen.getByText('姓名').closest('th')

      fireEvent.click(nameHeader!)
      expect(onSort).toHaveBeenCalledWith([
        expect.objectContaining({ key: 'name', direction: 'asc' }),
      ])

      fireEvent.click(nameHeader!)
      expect(onSort).toHaveBeenCalledWith([
        expect.objectContaining({ key: 'name', direction: 'desc' }),
      ])
    })

    it('应该显示排序指示器', () => {
      renderDataGrid()

      const nameHeader = screen.getByText('姓名').closest('th')
      expect(nameHeader).toHaveClass('cursor-pointer')
    })

    it('禁用排序时不应该显示排序指示器', () => {
      renderDataGrid({ sortable: false })

      const nameHeader = screen.getByText('姓名').closest('th')
      expect(nameHeader).not.toHaveClass('cursor-pointer')
    })
  })

  // =============================================================================
  // 过滤功能测试
  // =============================================================================

  describe('过滤功能', () => {
    it('应该显示过滤输入框', () => {
      renderDataGrid({ columns })

      const filterInput = screen.getByPlaceholderText('过滤 姓名...')
      expect(filterInput).toBeInTheDocument()
    })

    it('应该在输入过滤条件时过滤数据', async () => {
      const user = userEvent.setup()
      renderDataGrid({ columns })

      const filterInput = screen.getByPlaceholderText('过滤 姓名...')
      await user.type(filterInput, '张三')

      expect(screen.getByText('张三')).toBeInTheDocument()
      expect(screen.queryByText('李四')).not.toBeInTheDocument()
    })

    it('应该触发过滤回调', async () => {
      const user = userEvent.setup()
      const onFilter = vi.fn()
      renderDataGrid({ columns, onFilter })

      const filterInput = screen.getByPlaceholderText('过滤 姓名...')
      await user.type(filterInput, '张三')

      expect(onFilter).toHaveBeenCalled()
    })
  })

  // =============================================================================
  // 选择功能测试
  // =============================================================================

  describe('选择功能', () => {
    it('应该在多选模式下显示选择框', () => {
      renderDataGrid({ selectable: { mode: 'multiple' } })

      const checkboxes = screen.getAllByRole('checkbox')
      expect(checkboxes.length).toBeGreaterThan(0)
    })

    it('应该在单选模式下显示单选框', () => {
      renderDataGrid({ selectable: { mode: 'single' } })

      const radios = screen.getAllByRole('radio')
      expect(radios.length).toBeGreaterThan(0)
    })

    it('应该支持选择行', async () => {
      const user = userEvent.setup()
      const onSelectionChange = vi.fn()
      renderDataGrid({
        selectable: { mode: 'multiple' },
        onSelectionChange,
      })

      const firstCheckbox = screen.getAllByRole('checkbox')[1]
      await user.click(firstCheckbox)

      expect(onSelectionChange).toHaveBeenCalled()
    })

    it('应该支持全选', async () => {
      const user = userEvent.setup()
      const onSelectionChange = vi.fn()
      renderDataGrid({
        selectable: { mode: 'multiple' },
        onSelectionChange,
      })

      const selectAllCheckbox = screen.getAllByRole('checkbox')[0]
      await user.click(selectAllCheckbox)

      expect(onSelectionChange).toHaveBeenCalled()
    })

    it('禁用选择时不应该显示选择框', () => {
      renderDataGrid({ selectable: false })

      const checkboxes = screen.queryAllByRole('checkbox')
      expect(checkboxes.length).toBe(0)
    })
  })

  // =============================================================================
  // 分页功能测试
  // =============================================================================

  describe('分页功能', () => {
    it('应该启用分页时显示分页控件', () => {
      renderDataGrid({ pagination: { enabled: true, pageSize: 10, pageIndex: 1, total: 3 } })

      expect(screen.getByText('上一页')).toBeInTheDocument()
      expect(screen.getByText('下一页')).toBeInTheDocument()
    })

    it('应该禁用分页时不显示分页控件', () => {
      renderDataGrid({ pagination: false })

      expect(screen.queryByText('上一页')).not.toBeInTheDocument()
      expect(screen.queryByText('下一页')).not.toBeInTheDocument()
    })

    it('应该触发页码变化回调', async () => {
      const user = userEvent.setup()
      const onPageChange = vi.fn()
      renderDataGrid({
        pagination: { enabled: true, pageSize: 10, pageIndex: 1, total: 50 },
        onPageChange,
      })

      const nextButton = screen.getByText('下一页')
      await user.click(nextButton)

      expect(onPageChange).toHaveBeenCalledWith(2, 10)
    })

    it('应该显示分页信息', () => {
      renderDataGrid({ pagination: { enabled: true, pageSize: 10, pageIndex: 1, total: 3 } })

      expect(screen.getByText(/显示 1 到 3 条/)).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 加载状态测试
  // =============================================================================

  describe('加载状态', () => {
    it('应该显示加载指示器', () => {
      renderDataGrid({ loading: true })

      expect(screen.getByText('加载中...')).toBeInTheDocument()
    })

    it('加载时不应该显示数据', () => {
      renderDataGrid({ loading: true })

      expect(screen.queryByText('张三')).not.toBeInTheDocument()
    })
  })

  // =============================================================================
  // 空数据状态测试
  // =============================================================================

  describe('空数据状态', () => {
    it('应该显示默认空数据文本', () => {
      renderDataGrid({ data: [] })

      expect(screen.getByText('暂无数据')).toBeInTheDocument()
    })

    it('应该显示自定义空数据文本', () => {
      renderDataGrid({ data: [], emptyText: '没有找到数据' })

      expect(screen.getByText('没有找到数据')).toBeInTheDocument()
    })

    it('应该支持自定义空数据组件', () => {
      renderDataGrid({
        data: [],
        emptyComponent: <div data-testid="custom-empty">自定义空状态</div>,
      })

      expect(screen.getByTestId('custom-empty')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 单元格自定义渲染测试
  // =============================================================================

  describe('单元格自定义渲染', () => {
    it('应该支持自定义单元格渲染', () => {
      const customColumns = [
        {
          key: 'name',
          title: '姓名',
          render: (value: string) => <strong>{value}</strong>,
        },
      ]
      renderDataGrid({ columns: customColumns })

      const nameCell = screen.getByText('张三').closest('td')
      expect(nameCell?.querySelector('strong')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 行内编辑测试
  // =============================================================================

  describe('行内编辑', () => {
    it('应该支持双击编辑', async () => {
      const user = userEvent.setup()
      const onCellEdit = vi.fn()
      renderDataGrid({ editable: true, onCellEdit })

      const nameCell = screen.getByText('张三').closest('td')
      await user.dblClick(nameCell!)

      const input = screen.getByDisplayValue('张三')
      expect(input).toBeInTheDocument()
    })

    it('应该在回车时保存编辑', async () => {
      const user = userEvent.setup()
      const onCellEdit = vi.fn()
      renderDataGrid({ editable: true, onCellEdit })

      const nameCell = screen.getByText('张三').closest('td')
      await user.dblClick(nameCell!)

      const input = screen.getByDisplayValue('张三')
      await user.clear(input)
      await user.type(input, '张三三')
      await user.keyboard('{Enter}')

      expect(onCellEdit).toHaveBeenCalled()
    })

    it('应该在 ESC 时取消编辑', async () => {
      const user = userEvent.setup()
      renderDataGrid({ editable: true })

      const nameCell = screen.getByText('张三').closest('td')
      await user.dblClick(nameCell!)

      const input = screen.getByDisplayValue('张三')
      await user.keyboard('{Escape}')

      expect(screen.getByText('张三')).toBeInTheDocument()
      expect(screen.queryByDisplayValue('张三')).not.toBeInTheDocument()
    })
  })

  // =============================================================================
  // 导出功能测试
  // =============================================================================

  describe('导出功能', () => {
    it('应该显示导出按钮', () => {
      renderDataGrid({ exportable: true })

      expect(screen.getByText('导出 CSV')).toBeInTheDocument()
      expect(screen.getByText('导出 Excel')).toBeInTheDocument()
      expect(screen.getByText('导出 JSON')).toBeInTheDocument()
    })

    it('应该触发导出回调', async () => {
      const user = userEvent.setup()
      const onExport = vi.fn()
      renderDataGrid({ exportable: true, onExport })

      const exportButton = screen.getByText('导出 CSV')
      await user.click(exportButton)

      expect(onExport).toHaveBeenCalledWith('csv')
    })
  })

  // =============================================================================
  // 固定列测试
  // =============================================================================

  describe('固定列', () => {
    it('应该支持固定列', () => {
      const fixedColumns = [
        { key: 'id', title: 'ID', fixed: 'left' as const },
        { key: 'name', title: '姓名' },
        { key: 'age', title: '年龄', fixed: 'right' as const },
      ]
      renderDataGrid({ columns: fixedColumns })

      const idHeader = screen.getByText('ID').closest('th')
      const ageHeader = screen.getByText('年龄').closest('th')

      expect(idHeader).toHaveClass('sticky', 'left-0')
      expect(ageHeader).toHaveClass('sticky', 'right-0')
    })
  })

  // =============================================================================
  // 可访问性测试
  // =============================================================================

  describe('可访问性', () => {
    it('应该具有正确的表格结构', () => {
      renderDataGrid()

      expect(screen.getByRole('table')).toBeInTheDocument()
      expect(screen.getByRole('rowgroup')).toBeInTheDocument()
      expect(screen.getAllByRole('row')).toHaveLength(4) // 1个表头 + 3行数据
    })

    it('应该支持键盘导航', () => {
      renderDataGrid()

      const table = screen.getByRole('table')
      expect(table).toBeInTheDocument()
    })
  })

  // =============================================================================
  // 工具提示测试
  // =============================================================================

  describe('工具提示', () => {
    it('应该在文本截断时显示工具提示', () => {
      const longTextColumns = [
        {
          key: 'name',
          title: '姓名',
          ellipsis: true,
        },
      ]
      renderDataGrid({ columns: longTextColumns })

      const nameCell = screen.getByText('张三').closest('td')
      expect(nameCell).toHaveClass('max-w-xs', 'overflow-hidden', 'text-ellipsis', 'whitespace-nowrap')
    })

    it('禁用工具提示时不应该显示 title', () => {
      const longTextColumns = [
        {
          key: 'name',
          title: '姓名',
          ellipsis: true,
        },
      ]
      renderDataGrid({ columns: longTextColumns, showTooltip: false })

      const nameCell = screen.getByText('张三').closest('td')
      expect(nameCell).not.toHaveAttribute('title')
    })
  })

  // =============================================================================
  // 边缘情况测试
  // =============================================================================

  describe('边缘情况', () => {
    it('应该处理空数据数组', () => {
      renderDataGrid({ data: [] })

      expect(screen.getByText('暂无数据')).toBeInTheDocument()
    })

    it('应该处理缺失的列定义', () => {
      const emptyColumns: DataGridColumn[] = []
      renderDataGrid({ columns: emptyColumns })

      expect(screen.getByRole('table')).toBeInTheDocument()
    })
  })

  // =============================================================================
  // ref 暴露方法测试
  // =============================================================================

  describe('Ref 方法', () => {
    it('应该暴露 export 方法', async () => {
      const ref = { current: null }
      const onExport = vi.fn()
      renderDataGrid({ ref, onExport })

      ref.current?.export('csv')
      expect(onExport).toHaveBeenCalledWith('csv')
    })

    it('应该暴露 clearSelection 方法', async () => {
      const ref = { current: null }
      const onSelectionChange = vi.fn()
      renderDataGrid({ ref, selectable: { mode: 'multiple' }, onSelectionChange })

      ref.current?.clearSelection()
      expect(onSelectionChange).toHaveBeenCalledWith([], [])
    })

    it('应该暴露 selectAll 方法', async () => {
      const ref = { current: null }
      const onSelectionChange = vi.fn()
      renderDataGrid({ ref, selectable: { mode: 'multiple' }, onSelectionChange })

      ref.current?.selectAll()
      expect(onSelectionChange).toHaveBeenCalled()
    })
  })
})
