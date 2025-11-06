'use client'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ChevronDown, User, MapPin, Calendar } from 'lucide-react'
import { Select } from './select'
import type { SelectProps } from './select'

// Meta 配置
const meta: Meta<typeof Select> = {
  title: 'Form/Select',
  component: Select,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
一个功能强大的下拉选择器组件，支持单选、多选、搜索过滤、分组和自定义渲染。

## 主要特性

- ✅ **单选和多选模式** - 支持两种选择模式
- ✅ **搜索过滤** - 内置搜索功能，支持自定义过滤逻辑
- ✅ **分组显示** - 支持选项分组和自定义分组标题
- ✅ **自定义渲染** - 支持选项、值、空状态和加载状态的自定义渲染
- ✅ **键盘导航** - 完整的键盘操作支持
- ✅ **可访问性** - 符合 ARIA 标准
- ✅ **主题集成** - 与 Xorigo UI 主题系统完美集成
- ✅ **动画效果** - 流畅的展开/收起动画

## 使用示例

\`\`\`tsx
import { Select } from './select'
import type { SelectProps } from './select'

const options = [
  { value: 'option1', label: '选项 1' },
  { value: 'option2', label: '选项 2' },
]

<Select
  options={options}
  placeholder="请选择"
  onChange={(e) => console.log(e.target.value)}
/>
\`\`\`
        `,
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined', 'underlined', 'neon'],
      description: '选择器的视觉变体',
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
      description: '选择器的尺寸',
    },
    status: {
      control: 'select',
      options: ['default', 'error', 'success', 'warning'],
      description: '选择器状态',
    },
    multiple: {
      control: 'boolean',
      description: '是否支持多选',
    },
    searchable: {
      control: 'boolean',
      description: '是否支持搜索',
    },
    clearable: {
      control: 'boolean',
      description: '是否可清除',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    loading: {
      control: 'boolean',
      description: '是否显示加载状态',
    },
    required: {
      control: 'boolean',
      description: '是否必填',
    },
    dropdownPosition: {
      control: 'select',
      options: ['bottom', 'top', 'auto'],
      description: '下拉框位置',
    },
    closeOnSelect: {
      control: 'boolean',
      description: '选择后是否自动关闭下拉框',
    },
    maxVisibleItems: {
      control: 'number',
      description: '最大显示项数',
    },
  },
  tags: ['autodocs'],
}

export default meta
type Story = StoryObj<typeof Select>

// 基础故事
export const Default: Story = {
  args: {
    options: [
      { value: 'apple', label: '苹果' },
      { value: 'banana', label: '香蕉' },
      { value: 'orange', label: '橙子' },
      { value: 'grape', label: '葡萄' },
      { value: 'strawberry', label: '草莓' },
    ],
    placeholder: '请选择水果',
  },
}

// 带标签的选择器
export const WithLabel: Story = {
  args: {
    ...Default.args,
    label: '选择你最喜欢的水果',
    helperText: '选择一种你最喜欢的水果',
  },
}

// 必填选择器
export const Required: Story = {
  args: {
    ...WithLabel.args,
    required: true,
  },
}

// 可清除的选择器
export const Clearable: Story = {
  args: {
    ...Default.args,
    label: '可清除的选择器',
    clearable: true,
    value: 'apple',
  },
}

// 可搜索的选择器
export const Searchable: Story = {
  args: {
    ...Default.args,
    label: '可搜索的选择器',
    searchable: true,
    placeholder: '搜索水果...',
  },
}

// 多选选择器
export const Multiple: Story = {
  args: {
    ...Default.args,
    label: '多选水果',
    multiple: true,
    placeholder: '选择多种水果',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>(['apple', 'banana'])
    return (
      <Select
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value as string[])}
      />
    )
  },
}

// 搜索多选
export const SearchableMultiple: Story = {
  args: {
    ...Default.args,
    label: '搜索多选',
    multiple: true,
    searchable: true,
    clearable: true,
    placeholder: '搜索并选择多种水果',
  },
  render: (args) => {
    const [value, setValue] = useState<string[]>([])
    return (
      <Select
        {...args}
        value={value}
        onChange={(e) => setValue(e.target.value as string[])}
      />
    )
  },
}

// 分组选择器
export const Grouped: Story = {
  args: {
    label: '分组选择器',
    options: [
      { value: 'apple', label: '苹果', group: '水果' },
      { value: 'banana', label: '香蕉', group: '水果' },
      { value: 'orange', label: '橙子', group: '水果' },
      { value: 'carrot', label: '胡萝卜', group: '蔬菜' },
      { value: 'broccoli', label: '西兰花', group: '蔬菜' },
      { value: 'tomato', label: '西红柿', group: '蔬菜' },
    ],
    placeholder: '选择食物',
  },
}

// 带图标的选择器
export const WithIcons: Story = {
  args: {
    label: '带图标的选择器',
    options: [
      { value: 'user', label: '用户管理', icon: <User className="w-4 h-4" /> },
      { value: 'location', label: '位置管理', icon: <MapPin className="w-4 h-4" /> },
      { value: 'calendar', label: '日程管理', icon: <Calendar className="w-4 h-4" /> },
    ],
    placeholder: '选择功能模块',
  },
}

// 带描述的选择器
export const WithDescriptions: Story = {
  args: {
    label: '带描述的选择器',
    options: [
      {
        value: 'basic',
        label: '基础版',
        description: '适合个人用户和小团队',
      },
      {
        value: 'pro',
        label: '专业版',
        description: '适合中小企业，包含高级功能',
      },
      {
        value: 'enterprise',
        label: '企业版',
        description: '适合大型企业，定制化服务',
      },
    ],
    placeholder: '选择版本',
  },
}

// 状态变体
export const StatusVariants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <Select
          {...Default.args}
          label="默认状态"
          placeholder="默认状态的选择器"
        />
      </div>

      <div>
        <Select
          {...Default.args}
          label="成功状态"
          status="success"
          helperText="验证成功"
        />
      </div>

      <div>
        <Select
          {...Default.args}
          label="警告状态"
          status="warning"
          helperText="请注意选择"
        />
      </div>

      <div>
        <Select
          {...Default.args}
          label="错误状态"
          status="error"
          error="请选择一个选项"
        />
      </div>
    </div>
  ),
}

// 样式变体
export const StyleVariants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Select
        {...Default.args}
        label="默认样式 (default)"
        variant="default"
      />

      <Select
        {...Default.args}
        label="填充样式 (filled)"
        variant="filled"
      />

      <Select
        {...Default.args}
        label="轮廓样式 (outlined)"
        variant="outlined"
      />

      <Select
        {...Default.args}
        label="下划线样式 (underlined)"
        variant="underlined"
      />

      <Select
        {...Default.args}
        label="霓虹样式 (neon)"
        variant="neon"
      />
    </div>
  ),
}

// 尺寸变体
export const SizeVariants: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Select
        {...Default.args}
        label="小尺寸 (sm)"
        size="sm"
      />

      <Select
        {...Default.args}
        label="中等尺寸 (md)"
        size="md"
      />

      <Select
        {...Default.args}
        label="大尺寸 (lg)"
        size="lg"
      />
    </div>
  ),
}

// 自定义渲染
export const CustomRendering: Story = {
  render: () => {
    const customOptions = [
      { value: 'hot', label: '🌶️ 辣', color: 'red' },
      { value: 'medium', label: '🟡 中辣', color: 'yellow' },
      { value: 'mild', label: '🟢 微辣', color: 'green' },
      { value: 'none', label: '❌ 不辣', color: 'gray' },
    ]

    return (
      <div className="space-y-4 w-80">
        {/* 自定义选项渲染 */}
        <Select
          label="自定义选项渲染"
          options={customOptions}
          renderOption={(option) => (
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: option.color }}
              />
              <span>{option.label}</span>
            </div>
          )}
        />

        {/* 自定义值渲染 */}
        <Select
          label="自定义值渲染"
          options={customOptions}
          renderValue={(selectedOptions) => (
            <div className="flex items-center gap-2">
              <span>辣度: </span>
              {selectedOptions.map((opt) => (
                <span key={opt.value}>{opt.label}</span>
              ))}
            </div>
          )}
        />

        {/* 自定义空状态 */}
        <Select
          label="自定义空状态"
          options={[]}
          searchable
          renderEmpty={(query) => (
            <div className="text-center py-4">
              <div className="text-gray-400 mb-2">🔍</div>
              <div>没找到 "{query}"</div>
              <div className="text-sm text-gray-500">试试其他关键词</div>
            </div>
          )}
        />

        {/* 自定义加载状态 */}
        <Select
          label="自定义加载状态"
          options={[]}
          loading
          renderLoading={() => (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <div>正在加载选项...</div>
            </div>
          )}
        />
      </div>
    )
  },
}

// 高级功能演示
export const AdvancedFeatures: Story = {
  render: () => {
    const [selectedUsers, setSelectedUsers] = useState<string[]>([])

    const userOptions = [
      { value: '1', label: '张三', group: '开发团队', description: '前端工程师' },
      { value: '2', label: '李四', group: '开发团队', description: '后端工程师' },
      { value: '3', label: '王五', group: '设计团队', description: 'UI设计师' },
      { value: '4', label: '赵六', group: '产品团队', description: '产品经理' },
      { value: '5', label: '孙七', group: '运营团队', description: '运营专员' },
    ]

    return (
      <div className="space-y-6 w-96">
        {/* 自动下拉位置 */}
        <Select
          label="自动下拉位置 (滚动页面查看效果)"
          options={Default.args?.options || []}
          dropdownPosition="auto"
          placeholder="选择选项"
        />

        {/* 自定义过滤 */}
        <Select
          label='自定义过滤 (只显示包含"工程师"的选项)'
          options={userOptions}
          searchable
          filterOption={(option, query) =>
            option.description?.includes(query) ||
            option.label.includes(query)
          }
          placeholder="搜索职位或姓名..."
        />

        {/* 高级多选 */}
        <Select
          label="高级多选 (支持自定义渲染)"
          options={userOptions}
          multiple
          searchable
          clearable
          value={selectedUsers}
          onChange={(e) => setSelectedUsers(e.target.value as string[])}
          renderOption={(option) => (
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="font-medium">{option.label}</div>
                <div className="text-xs text-gray-500">{option.description}</div>
              </div>
              <div className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded">
                {option.group}
              </div>
            </div>
          )}
          renderGroupHeader={(group) => (
            <div className="flex items-center gap-2">
              <ChevronDown className="w-4 h-4" />
              <span>{group}</span>
            </div>
          )}
          placeholder="选择团队成员"
        />

        <div className="text-sm text-gray-500">
          已选择 {selectedUsers.length} 个成员
        </div>
      </div>
    )
  },
}

// 禁用状态
export const Disabled: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <Select
        {...Default.args}
        label="禁用状态"
        disabled
        placeholder="禁用的选择器"
      />

      <Select
        {...Default.args}
        label="禁用的多选"
        disabled
        multiple
        value={['apple', 'banana']}
      />
    </div>
  ),
}

// 异步加载示例
export const AsyncLoading: Story = {
  render: () => {
    const [options, setOptions] = useState<SelectProps['options']>([])
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')

    const handleSearch = async (query: string) => {
      setSearchQuery(query)
      setLoading(true)

      // 模拟 API 调用
      setTimeout(() => {
        const mockResults = [
          { value: '1', label: `${query} - 结果 1` },
          { value: '2', label: `${query} - 结果 2` },
          { value: '3', label: `${query} - 结果 3` },
        ]
        setOptions(mockResults)
        setLoading(false)
      }, 1000)
    }

    return (
      <Select
        label="异步搜索"
        options={options}
        searchable
        loading={loading}
        onSearch={handleSearch}
        placeholder="搜索远程数据..."
        renderEmpty={() => (
          <div className="text-center py-4">
            <div className="text-gray-400 mb-2">🔍</div>
            <div>输入关键词搜索</div>
            <div className="text-sm text-gray-500">
              当前搜索: "{searchQuery || '无'}"
            </div>
          </div>
        )}
      />
    )
  },
}

// 交互式演示
export const InteractiveDemo: Story = {
  render: () => {
    const [singleValue, setSingleValue] = useState('')
    const [multiValue, setMultiValue] = useState<string[]>([])
    const [formData, setFormData] = useState({
      country: '',
      city: '',
      interests: [] as string[],
    })

    const countries = [
      { value: 'china', label: '中国' },
      { value: 'usa', label: '美国' },
      { value: 'japan', label: '日本' },
    ]

    const cities = {
      china: [
        { value: 'beijing', label: '北京' },
        { value: 'shanghai', label: '上海' },
        { value: 'guangzhou', label: '广州' },
      ],
      usa: [
        { value: 'newyork', label: '纽约' },
        { value: 'losangeles', label: '洛杉矶' },
        { value: 'chicago', label: '芝加哥' },
      ],
      japan: [
        { value: 'tokyo', label: '东京' },
        { value: 'osaka', label: '大阪' },
        { value: 'kyoto', label: '京都' },
      ],
    }

    const interests = [
      { value: 'music', label: '音乐', group: '艺术' },
      { value: 'painting', label: '绘画', group: '艺术' },
      { value: 'sports', label: '运动', group: '运动' },
      { value: 'reading', label: '阅读', group: '学习' },
      { value: 'coding', label: '编程', group: '学习' },
      { value: 'travel', label: '旅行', group: '生活' },
    ]

    return (
      <div className="space-y-6 w-96">
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2">基础单选</h3>
          <Select
            options={Default.args?.options || []}
            value={singleValue}
            onChange={(e) => setSingleValue(e.target.value)}
            placeholder="选择一个选项"
          />
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            选择了: {singleValue || '无'}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2">多选示例</h3>
          <Select
            options={Default.args?.options || []}
            multiple
            searchable
            value={multiValue}
            onChange={(e) => setMultiValue(e.target.value as string[])}
            placeholder="选择多个选项"
          />
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2">
            选择了: {multiValue.join(', ') || '无'}
          </div>
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2">级联选择</h3>
          <Select
            label="国家"
            options={countries}
            value={formData.country}
            onChange={(e) => {
              setFormData({
                ...formData,
                country: e.target.value,
                city: '', // 重置城市
              })
            }}
            placeholder="选择国家"
          />

          {formData.country && (
            <Select
              label="城市"
              options={cities[formData.country as keyof typeof cities]}
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              placeholder="选择城市"
              className="mt-2"
            />
          )}
        </div>

        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2">分组多选</h3>
          <Select
            label="兴趣爱好"
            options={interests}
            multiple
            groupBy="group"
            value={formData.interests}
            onChange={(e) => setFormData({ ...formData, interests: e.target.value as string[] })}
            placeholder="选择兴趣爱好"
          />
        </div>
      </div>
    )
  },
}