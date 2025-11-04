# Select 组件使用示例

## 基础用法

```tsx
import { Select } from '@xorigo-ui/core/form'

const options = [
  { value: 'apple', label: '苹果' },
  { value: 'banana', label: '香蕉' },
  { value: 'orange', label: '橙子' },
]

<Select
  options={options}
  placeholder="请选择水果"
  onChange={(e) => console.log(e.target.value)}
/>
```

## 多选模式

```tsx
const [selectedFruits, setSelectedFruits] = useState<string[]>([])

<Select
  options={options}
  multiple
  value={selectedFruits}
  onChange={(e) => setSelectedFruits(e.target.value as string[])}
  placeholder="选择多种水果"
/>
```

## 搜索功能

```tsx
<Select
  options={options}
  searchable
  onSearch={(query) => console.log('搜索:', query)}
  placeholder="搜索水果..."
/>
```

## 分组显示

```tsx
const groupedOptions = [
  { value: 'apple', label: '苹果', group: '水果' },
  { value: 'carrot', label: '胡萝卜', group: '蔬菜' },
]

<Select
  options={groupedOptions}
  groupBy="group"
  placeholder="选择食物"
/>
```

## 自定义渲染

```tsx
<Select
  options={options}
  renderOption={(option, index, isSelected) => (
    <div className="flex items-center gap-2">
      <span>🍎</span>
      <span>{option.label}</span>
      {isSelected && <span>✓</span>}
    </div>
  )}
  renderValue={(selectedOptions) => (
    <div>已选择: {selectedOptions.map(opt => opt.label).join(', ')}</div>
  )}
/>
```

## 高级配置

```tsx
<Select
  options={options}
  variant="outlined"
  size="lg"
  status="success"
  clearable
  loading={isLoading}
  disabled={false}
  dropdownPosition="auto"
  closeOnSelect={true}
  maxVisibleItems={10}
  onOpen={() => console.log('下拉框打开')}
  onClose={() => console.log('下拉框关闭')}
/>
```

## API 文档

### SelectProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `options` | `SelectOption[]` | - | 选项数组 |
| `value` | `string \| number \| (string \| number)[]` | - | 选中的值 |
| `onChange` | `(e: ChangeEvent) => void` | - | 值变化回调 |
| `multiple` | `boolean` | `false` | 是否多选 |
| `searchable` | `boolean` | `false` | 是否可搜索 |
| `clearable` | `boolean` | `false` | 是否可清除 |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `loading` | `boolean` | `false` | 是否加载中 |
| `variant` | `'default' \| 'filled' \| 'outlined' \| 'underlined' \| 'neon'` | `'default'` | 视觉变体 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 尺寸 |
| `status` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | 状态 |
| `placeholder` | `string` | - | 占位符 |
| `label` | `string` | - | 标签 |
| `error` | `string` | - | 错误信息 |
| `helperText` | `string` | - | 帮助信息 |
| `required` | `boolean` | `false` | 是否必填 |

### SelectOption

```tsx
interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
  group?: string
  icon?: React.ReactNode
  description?: string
}
```

## 自定义渲染函数

### renderOption
```tsx
(option: SelectOption, index: number, isSelected: boolean) => React.ReactNode
```

### renderValue
```tsx
(selectedOptions: SelectOption[]) => React.ReactNode
```

### renderEmpty
```tsx
(query: string) => React.ReactNode
```

### renderLoading
```tsx
() => React.ReactNode
```

### renderGroupHeader
```tsx
(group: string) => React.ReactNode
```

## 主题集成

Select 组件完全支持 Xorigo UI 的七轴主题系统，可以在所有主题配方下正常工作：

- ✅ **professional-dark** - 专业商务深色主题
- ✅ **creative-light** - 创意设计浅色主题
- ✅ **minimal** - 极简主义主题
- ✅ **seasonal** - 季节性主题

## 可访问性

组件完全符合 WCAG 2.1 AA 标准：

- ✅ 键盘导航支持 (Arrow keys, Enter, Escape)
- ✅ 屏幕阅读器支持 (ARIA 属性)
- ✅ 高对比度模式兼容
- ✅ 焦点管理
- ✅ 颜色对比度优化