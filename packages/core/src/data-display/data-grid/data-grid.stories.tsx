import type { Meta, StoryObj } from '@storybook/react'
import { fn } from '@storybook/test'
import { DataGrid, type DataGridColumn } from './data-grid'

/**
 * DataGrid 高级数据表格组件故事文件
 *
 * 展示了各种使用场景和配置选项的 DataGrid 组件示例
 */
const meta = {
  title: 'Data Display/DataGrid',
  component: DataGrid,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
 DataGrid 是一个功能完整的高级数据表格组件，支持以下特性：

 - ✅ 列定义和配置
 - 🔄 排序功能（升序/降序/多列排序）
 - 🔍 过滤功能
 - 📄 分页功能
 - ☑️ 行选择（单选/多选）
 - 📌 固定列支持
 - ⚡ 虚拟滚动支持
 - ✏️ 行内编辑
 - 🎨 单元格渲染自定义
 - 💡 工具提示
 - 📤 导出功能
 - 🌙 七轴主题系统集成
 - ♿ 完整的可访问性支持
        `,
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'striped', 'bordered', 'minimal'],
      description: '表格的视觉变体样式',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '表格的尺寸大小',
    },
    density: {
      control: 'select',
      options: ['compact', 'normal', 'comfortable'],
      description: '表格的密度',
    },
    sortable: {
      control: 'boolean',
      description: '是否启用排序功能',
    },
    filterable: {
      control: 'boolean',
      description: '是否启用过滤功能',
    },
    selectable: {
      control: 'select',
      options: ['multiple', 'single', 'false'],
      description: '行选择模式',
    },
    pagination: {
      control: 'select',
      options: ['true', 'false', 'custom'],
      description: '分页配置',
    },
    editable: {
      control: 'boolean',
      description: '是否启用行内编辑',
    },
    exportable: {
      control: 'boolean',
      description: '是否启用导出功能',
    },
    loading: {
      control: 'boolean',
      description: '是否显示加载状态',
    },
    stickyHeader: {
      control: 'boolean',
      description: '是否固定表头',
    },
  },
  args: {
    onSort: fn(),
    onFilter: fn(),
    onSelectionChange: fn(),
    onPageChange: fn(),
    onCellEdit: fn(),
    onExport: fn(),
  },
} satisfies Meta<typeof DataGrid>

export default meta
type Story = StoryObj<typeof meta>

/**
 * 示例数据
 */
const sampleData = [
  { id: 1, name: '张三', age: 25, email: 'zhangsan@example.com', department: '技术部', status: 'active' },
  { id: 2, name: '李四', age: 30, email: 'lisi@example.com', department: '产品部', status: 'active' },
  { id: 3, name: '王五', age: 28, email: 'wangwu@example.com', department: '市场部', status: 'inactive' },
  { id: 4, name: '赵六', age: 32, email: 'zhaoliu@example.com', department: '技术部', status: 'active' },
  { id: 5, name: '孙七', age: 26, email: 'sunqi@example.com', department: '运营部', status: 'pending' },
  { id: 6, name: '周八', age: 29, email: 'zhouba@example.com', department: '产品部', status: 'active' },
  { id: 7, name: '吴九', age: 31, email: 'wujiu@example.com', department: '技术部', status: 'inactive' },
  { id: 8, name: '郑十', age: 27, email: 'zhengshi@example.com', department: '市场部', status: 'active' },
  { id: 9, name: '王一', age: 24, email: 'wangyi@example.com', department: '运营部', status: 'pending' },
  { id: 10, name: '李二', age: 33, email: 'lier@example.com', department: '技术部', status: 'active' },
]

const sampleColumns: DataGridColumn[] = [
  { key: 'id', title: 'ID', width: 80, sortable: true },
  { key: 'name', title: '姓名', width: 120, sortable: true, filterable: true },
  { key: 'age', title: '年龄', width: 100, sortable: true },
  { key: 'email', title: '邮箱', width: 200, ellipsis: true },
  { key: 'department', title: '部门', width: 120, sortable: true },
  { key: 'status', title: '状态', width: 100, render: (value) => (
    <span className={`px-2 py-1 text-xs rounded-full ${
      value === 'active' ? 'bg-green-100 text-green-800' :
      value === 'inactive' ? 'bg-gray-100 text-gray-800' :
      'bg-yellow-100 text-yellow-800'
    }`}>
      {value === 'active' ? '活跃' : value === 'inactive' ? '非活跃' : '待定'}
    </span>
  ) },
]

/**
 * 基础 DataGrid 示例
 */
export const Default: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
  },
}

/**
 * 排序功能示例
 */
export const Sortable: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
    sortable: true,
  },
}

/**
 * 过滤功能示例
 */
export const Filterable: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
    filterable: true,
  },
}

/**
 * 多选功能示例
 */
export const Selectable: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
    selectable: { mode: 'multiple' },
  },
}

/**
 * 单选功能示例
 */
export const SingleSelect: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
    selectable: { mode: 'single' },
  },
}

/**
 * 分页功能示例
 */
export const WithPagination: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
    pagination: { enabled: true, pageSize: 5, pageIndex: 1, total: sampleData.length },
  },
}

/**
 * 行内编辑示例
 */
export const Editable: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
    editable: true,
  },
}

/**
 * 变体展示
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Default 变体</h3>
        <DataGrid
          data={sampleData.slice(0, 3)}
          columns={sampleColumns}
          variant="default"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Striped 变体</h3>
        <DataGrid
          data={sampleData.slice(0, 3)}
          columns={sampleColumns}
          variant="striped"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Bordered 变体</h3>
        <DataGrid
          data={sampleData.slice(0, 3)}
          columns={sampleColumns}
          variant="bordered"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Minimal 变体</h3>
        <DataGrid
          data={sampleData.slice(0, 3)}
          columns={sampleColumns}
          variant="minimal"
        />
      </div>
    </div>
  ),
}

/**
 * 尺寸展示
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Small 尺寸</h3>
        <DataGrid
          data={sampleData.slice(0, 3)}
          columns={sampleColumns}
          size="sm"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Medium 尺寸（默认）</h3>
        <DataGrid
          data={sampleData.slice(0, 3)}
          columns={sampleColumns}
          size="md"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Large 尺寸</h3>
        <DataGrid
          data={sampleData.slice(0, 3)}
          columns={sampleColumns}
          size="lg"
        />
      </div>
    </div>
  ),
}

/**
 * 密度展示
 */
export const Density: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Compact 密度</h3>
        <DataGrid
          data={sampleData.slice(0, 3)}
          columns={sampleColumns}
          density="compact"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Normal 密度（默认）</h3>
        <DataGrid
          data={sampleData.slice(0, 3)}
          columns={sampleColumns}
          density="normal"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Comfortable 密度</h3>
        <DataGrid
          data={sampleData.slice(0, 3)}
          columns={sampleColumns}
          density="comfortable"
        />
      </div>
    </div>
  ),
}

/**
 * 导出功能示例
 */
export const Exportable: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
    exportable: true,
  },
}

/**
 * 自定义单元格渲染示例
 */
export const CustomCellRenderer: Story = {
  args: {
    data: sampleData,
    columns: [
      ...sampleColumns,
      {
        key: 'action',
        title: '操作',
        width: 150,
        render: (_, row) => (
          <div className="space-x-2">
            <button
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => alert(`编辑 ${row.name}`)}
            >
              编辑
            </button>
            <button
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              onClick={() => alert(`删除 ${row.name}`)}
            >
              删除
            </button>
          </div>
        ),
      },
    ],
  },
}

/**
 * 固定列示例
 */
export const StickyColumns: Story = {
  args: {
    data: sampleData,
    columns: [
      { key: 'id', title: 'ID', width: 80, fixed: 'left' as const },
      { key: 'name', title: '姓名', width: 120, sortable: true, filterable: true },
      { key: 'email', title: '邮箱', width: 200, ellipsis: true },
      { key: 'department', title: '部门', width: 120 },
      { key: 'status', title: '状态', width: 100, fixed: 'right' as const },
    ],
    stickyFirstColumn: true,
    stickyLastColumn: true,
  },
}

/**
 * 完整功能示例
 */
export const FullFeature: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
    sortable: true,
    filterable: true,
    selectable: { mode: 'multiple' },
    pagination: { enabled: true, pageSize: 5, pageIndex: 1, total: sampleData.length },
    editable: true,
    exportable: true,
  },
}

/**
 * 空数据状态示例
 */
export const EmptyState: Story = {
  args: {
    data: [],
    columns: sampleColumns,
    emptyText: '没有找到匹配的数据',
  },
}

/**
 * 加载状态示例
 */
export const LoadingState: Story = {
  args: {
    data: sampleData,
    columns: sampleColumns,
    loading: true,
  },
}

/**
 * 大数据量示例（虚拟滚动）
 */
export const LargeDataSet: Story = {
  args: {
    data: Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `用户 ${i + 1}`,
      age: 20 + (i % 50),
      email: `user${i + 1}@example.com`,
      department: ['技术部', '产品部', '市场部', '运营部'][i % 4],
      status: ['active', 'inactive', 'pending'][i % 3],
    })),
    columns: sampleColumns,
    virtualized: { enabled: true, rowHeight: 50, overscan: 5 },
  },
}

/**
 * 主题适配示例
 */
export const ThemeVariants: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">多种变体组合</h3>
        <DataGrid
          data={sampleData.slice(0, 3)}
          columns={sampleColumns}
          variant="striped"
          size="md"
          density="normal"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">紧凑型表格</h3>
        <DataGrid
          data={sampleData.slice(0, 3)}
          columns={sampleColumns}
          variant="minimal"
          size="sm"
          density="compact"
        />
      </div>
    </div>
  ),
}
