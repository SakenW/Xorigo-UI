# Checkbox 复选框组件使用指南

Checkbox 是一个功能完整的复选框组件，支持多种视觉样式、状态管理和交互模式。

## 🚀 快速开始

### 基础用法

```tsx
import { Checkbox } from '@xorigo-ui/core/form'

function App() {
  return (
    <Checkbox>我同意服务条款</Checkbox>
  )
}
```

## 📋 API 参考

### CheckboxProps

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `variant` | `'default' \| 'filled' \| 'outlined' \| 'neon'` | `'default'` | 视觉变体样式 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | 组件尺寸 |
| `status` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | 状态样式 |
| `labelPosition` | `'right' \| 'left'` | `'right'` | 标签位置 |
| `checked` | `boolean` | - | 是否选中（受控模式） |
| `defaultChecked` | `boolean` | - | 默认是否选中（非受控模式） |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `required` | `boolean` | `false` | 是否必填 |
| `indeterminate` | `boolean` | `false` | 是否为半选状态 |
| `error` | `string` | - | 错误信息 |
| `helperText` | `string` | - | 帮助文本 |
| `onChange` | `(e: ChangeEvent<HTMLInputElement>) => void` | - | 变化事件回调 |
| `onIndeterminateChange` | `(indeterminate: boolean) => void` | - | 半选状态变化回调 |

### 继承属性

Checkbox 组件继承了 HTML `<input>` 元素的所有标准属性，除了 `type`、`size`、`onDrag`、`onDragStart`、`onDragEnd`。

## 🎨 视觉变体

### Default 变体

```tsx
<Checkbox variant="default">默认样式</Checkbox>
```

### Filled 变体

```tsx
<Checkbox variant="filled" defaultChecked>
  填充样式
</Checkbox>
```

### Outlined 变体

```tsx
<Checkbox variant="outlined" defaultChecked>
  轮廓样式
</Checkbox>
```

### Neon 变体

```tsx
<Checkbox variant="neon" defaultChecked>
  霓虹样式
</Checkbox>
```

## 📏 尺寸规格

```tsx
<div className="space-y-2">
  <Checkbox size="sm">小尺寸 (16px)</Checkbox>
  <Checkbox size="md">默认尺寸 (20px)</Checkbox>
  <Checkbox size="lg">大尺寸 (24px)</Checkbox>
</div>
```

## 🎭 状态管理

### 基础状态

```tsx
<div className="space-y-2">
  <Checkbox status="default" defaultChecked>默认状态</Checkbox>
  <Checkbox status="success" defaultChecked>成功状态</Checkbox>
  <Checkbox status="warning" defaultChecked>警告状态</Checkbox>
  <Checkbox status="error" defaultChecked>错误状态</Checkbox>
</div>
```

### 错误状态

```tsx
<Checkbox
  error="请先同意服务条款"
  helperText="您必须同意服务条款才能继续"
>
  我同意服务条款
</Checkbox>
```

### 禁用状态

```tsx
<div className="space-y-2">
  <Checkbox disabled>禁用的未选中状态</Checkbox>
  <Checkbox disabled defaultChecked>禁用的已选中状态</Checkbox>
  <Checkbox disabled indeterminate>禁用的半选状态</Checkbox>
</div>
```

## 🔄 Indeterminate 状态

### 基础用法

```tsx
<Checkbox
  indeterminate
  onIndeterminateChange={(indeterminate) => {
    console.log('半选状态变化:', indeterminate)
  }}
>
  半选状态复选框
</Checkbox>
```

### 父子复选框联动

```tsx
function CheckboxGroup() {
  const [parentState, setParentState] = React.useState({
    checked: false,
    indeterminate: true
  })

  const [children, setChildren] = React.useState([
    { id: 'child1', checked: true },
    { id: 'child2', checked: false },
    { id: 'child3', checked: true }
  ])

  // 计算父级状态
  React.useEffect(() => {
    const checkedCount = children.filter(child => child.checked).length
    setParentState({
      checked: checkedCount === children.length,
      indeterminate: checkedCount > 0 && checkedCount < children.length
    })
  }, [children])

  const handleParentChange = () => {
    const newState = !parentState.checked
    setChildren(prev => prev.map(child => ({ ...child, checked: newState })))
  }

  const handleChildChange = (id: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setChildren(prev =>
      prev.map(child =>
        child.id === id
          ? { ...child, checked: e.target.checked }
          : child
      )
    )
  }

  return (
    <div className="space-y-3">
      <Checkbox
        checked={parentState.checked}
        indeterminate={parentState.indeterminate}
        onChange={handleParentChange}
        labelPosition="left"
      >
        选择所有
      </Checkbox>

      <div className="ml-6 space-y-2">
        {children.map(child => (
          <Checkbox
            key={child.id}
            checked={child.checked}
            onChange={handleChildChange(child.id)}
          >
            子选项 {child.id}
          </Checkbox>
        ))}
      </div>
    </div>
  )
}
```

## 📍 标签位置

```tsx
<div className="space-y-2">
  <Checkbox labelPosition="right">右侧标签（默认）</Checkbox>
  <Checkbox labelPosition="left">左侧标签</Checkbox>
</div>
```

## 📝 表单集成

### 受控模式

```tsx
function ControlledForm() {
  const [formData, setFormData] = React.useState({
    newsletter: false,
    notifications: true,
    terms: false
  })

  const handleChange = (field: keyof typeof formData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.checked
      }))
    }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('表单数据:', formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Checkbox
        checked={formData.newsletter}
        onChange={handleChange('newsletter')}
        helperText="订阅我们的新闻通讯"
      >
        订阅新闻通讯
      </Checkbox>

      <Checkbox
        checked={formData.notifications}
        onChange={handleChange('notifications')}
        helperText="接收重要通知和更新"
      >
        启用通知
      </Checkbox>

      <Checkbox
        checked={formData.terms}
        onChange={handleChange('terms')}
        required
        error={!formData.terms ? '必须同意服务条款' : undefined}
      >
        我同意服务条款
      </Checkbox>

      <button type="submit">提交</button>
    </form>
  )
}
```

### 非受控模式

```tsx
function UncontrolledForm() {
  const formRef = React.useRef<HTMLFormElement>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const formData = new FormData(formRef.current!)

    const preferences = {
      newsletter: formData.get('newsletter') === 'on',
      notifications: formData.get('notifications') === 'on',
      terms: formData.get('terms') === 'on'
    }

    console.log('表单数据:', preferences)
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      <Checkbox
        name="newsletter"
        defaultChecked={false}
      >
        订阅新闻通讯
      </Checkbox>

      <Checkbox
        name="notifications"
        defaultChecked={true}
      >
        启用通知
      </Checkbox>

      <Checkbox
        name="terms"
        required
      >
        我同意服务条款
      </Checkbox>

      <button type="submit">提交</button>
    </form>
  )
}
```

## 🎭 分组使用

### 类别分组

```tsx
function CategoryCheckboxes() {
  const [selectedItems, setSelectedItems] = React.useState<Set<string>>(new Set())

  const categories = [
    {
      name: '前端技术',
      items: [
        { id: 'react', label: 'React' },
        { id: 'vue', label: 'Vue' },
        { id: 'angular', label: 'Angular' }
      ]
    },
    {
      name: '后端技术',
      items: [
        { id: 'nodejs', label: 'Node.js' },
        { id: 'python', label: 'Python' },
        { id: 'java', label: 'Java' }
      ]
    }
  ]

  const handleItemChange = (itemId: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSelected = new Set(selectedItems)
    if (e.target.checked) {
      newSelected.add(itemId)
    } else {
      newSelected.delete(itemId)
    }
    setSelectedItems(newSelected)
  }

  const handleCategoryToggle = (categoryItems: Array<{ id: string }>) => {
    const itemIds = categoryItems.map(item => item.id)
    const allSelected = itemIds.every(id => selectedItems.has(id))

    const newSelected = new Set(selectedItems)

    if (allSelected) {
      // 取消选择所有
      itemIds.forEach(id => newSelected.delete(id))
    } else {
      // 选择所有
      itemIds.forEach(id => newSelected.add(id))
    }

    setSelectedItems(newSelected)
  }

  return (
    <div className="space-y-6">
      {categories.map(category => {
        const selectedCount = category.items.filter(item =>
          selectedItems.has(item.id)
        ).length

        return (
          <div key={category.name}>
            <h3 className="font-medium mb-3">{category.name}</h3>

            <div className="space-y-2 ml-4">
              <Checkbox
                checked={selectedCount === category.items.length}
                indeterminate={selectedCount > 0 && selectedCount < category.items.length}
                onChange={() => handleCategoryToggle(category.items)}
                labelPosition="left"
              >
                全选 ({selectedCount}/{category.items.length})
              </Checkbox>

              {category.items.map(item => (
                <div key={item.id} className="ml-8">
                  <Checkbox
                    checked={selectedItems.has(item.id)}
                    onChange={handleItemChange(item.id)}
                  >
                    {item.label}
                  </Checkbox>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
```

## ♿ 可访问性

### ARIA 属性

```tsx
<Checkbox
  aria-describedby="helper-text"
  aria-invalid={!!error}
  aria-required={required}
>
  可访问的复选框
</Checkbox>
<div id="helper-text">这是一个帮助文本</div>
```

### 键盘导航

```tsx
function AccessibleExample() {
  const [checked, setChecked] = React.useState(false)

  return (
    <div>
      <p>支持键盘导航：</p>
      <ul>
        <li><kbd>Tab</kbd> - 聚焦复选框</li>
        <li><kbd>Space</kbd> - 切换选中状态</li>
        <li><kbd>Enter</kbd> - 切换选中状态</li>
      </ul>

      <Checkbox
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
        aria-label="切换选项"
      >
        使用键盘导航
      </Checkbox>
    </div>
  )
}
```

## 🎨 主题定制

### 使用设计令牌

```tsx
import { useTheme } from '@xorigo-ui/theme'

function ThemedCheckbox() {
  const { themeConfig } = useTheme()

  return (
    <Checkbox
      style={{
        accentColor: themeConfig.colors.primary,
      }}
    >
      主题化复选框
    </Checkbox>
  )
}
```

### 自定义样式

```tsx
<Checkbox
  className="my-custom-checkbox"
  style={{
    borderRadius: '8px',
    borderWidth: '2px',
  }}
>
  自定义样式
</Checkbox>

<style jsx>{`
  .my-custom-checkbox {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .my-custom-checkbox:hover {
    transform: translateY(-2px);
  }
`}</style>
```

## 🎭 动画效果

Checkbox 组件内置了 Framer Motion 动画效果：

- **悬停动画**：悬停时轻微放大效果
- **点击动画**：点击时缩小效果
- **标签动画**：标签淡入效果
- **错误信息动画**：错误信息滑入效果

```tsx
// 动画效果是自动应用的，无需额外配置
<Checkbox>带动画的复选框</Checkbox>
```

## 🔧 高级用法

### 与其他组件集成

```tsx
import { Card, Button } from '@xorigo-ui/core'

function IntegratedExample() {
  const [preferences, setPreferences] = React.useState({
    email: true,
    sms: false,
    push: true
  })

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-4">通知设置</h2>

      <div className="space-y-4">
        <Checkbox
          checked={preferences.email}
          onChange={(e) => setPreferences(prev => ({
            ...prev,
            email: e.target.checked
          }))}
        >
          邮件通知
        </Checkbox>

        <Checkbox
          checked={preferences.sms}
          onChange={(e) => setPreferences(prev => ({
            ...prev,
            sms: e.target.checked
          }))}
        >
          短信通知
        </Checkbox>

        <Checkbox
          checked={preferences.push}
          onChange={(e) => setPreferences(prev => ({
            ...prev,
            push: e.target.checked
          }))}
        >
          推送通知
        </Checkbox>
      </div>

      <Button className="mt-6">
        保存设置
      </Button>
    </Card>
  )
}
```

### 性能优化

```tsx
import { memo, useCallback } from 'react'

const OptimizedCheckbox = memo(({
  value,
  checked,
  onChange
}: {
  value: string
  checked: boolean
  onChange: (value: string, checked: boolean) => void
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(value, e.target.checked)
  }, [value, onChange])

  return (
    <Checkbox
      checked={checked}
      onChange={handleChange}
    >
      {value}
    </Checkbox>
  )
})

OptimizedCheckbox.displayName = 'OptimizedCheckbox'
```

## 🚨 注意事项

### 最佳实践

1. **明确的状态管理**：在复杂场景下，优先使用受控模式
2. **可访问性**：始终提供 `aria-label` 或关联的 `<label>`
3. **错误处理**：及时显示验证错误信息
4. **性能考虑**：大量复选框时使用 `memo` 优化渲染

### 常见问题

**Q: 如何处理大量复选框的性能问题？**

A: 使用虚拟化技术或分页显示，对每个复选框使用 `memo` 包装。

```tsx
import { memo } from 'react'

const MemoizedCheckbox = memo(Checkbox)

function VirtualizedCheckboxList({ items }: { items: Array<{ id: string, label: string }> }) {
  // 实现虚拟化逻辑
}
```

**Q: 如何实现全选/取消全选功能？**

A: 维护父级状态，根据子级选中状态计算父级的 `checked` 和 `indeterminate` 属性。

**Q: 如何在表单验证中使用？**

A: 使用 `error` 属性显示验证错误，结合 `required` 属性进行必填验证。

```tsx
<Checkbox
  required
  error={errors.terms}
  helperText="请同意服务条款"
>
  我同意服务条款
</Checkbox>
```

## 🎯 完整示例

```tsx
import React, { useState } from 'react'
import { Checkbox, Button, Card, Alert } from '@xorigo-ui/core'

function CompleteCheckboxExample() {
  const [formData, setFormData] = useState({
    preferences: {
      newsletter: false,
      notifications: true,
      marketing: false
    },
    terms: false,
    privacy: false
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handlePreferenceChange = (key: string) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [key]: e.target.checked
        }
      }))
    }

  const handleTermsChange = (field: 'terms' | 'privacy') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData(prev => ({
        ...prev,
        [field]: e.target.checked
      }))

      // 清除相关错误
      if (e.target.checked && errors[field]) {
        setErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[field]
          return newErrors
        })
      }
    }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.terms) {
      newErrors.terms = '必须同意服务条款'
    }

    if (!formData.privacy) {
      newErrors.privacy = '必须同意隐私政策'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validate()) {
      console.log('提交的数据:', formData)
      // 处理提交逻辑
    }
  }

  return (
    <Card className="p-6 max-w-md">
      <h2 className="text-xl font-semibold mb-6">用户设置</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">通知偏好</h3>
          <div className="space-y-3">
            <Checkbox
              checked={formData.preferences.newsletter}
              onChange={handlePreferenceChange('newsletter')}
              helperText="接收产品更新和新闻"
            >
              订阅新闻通讯
            </Checkbox>

            <Checkbox
              checked={formData.preferences.notifications}
              onChange={handlePreferenceChange('notifications')}
              helperText="接收重要通知和提醒"
            >
              启用通知
            </Checkbox>

            <Checkbox
              checked={formData.preferences.marketing}
              onChange={handlePreferenceChange('marketing')}
              helperText="接收营销推广信息"
            >
              营销信息
            </Checkbox>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">法律条款</h3>
          <div className="space-y-3">
            <Checkbox
              checked={formData.terms}
              onChange={handleTermsChange('terms')}
              required
              error={errors.terms}
            >
              我同意服务条款
            </Checkbox>

            <Checkbox
              checked={formData.privacy}
              onChange={handleTermsChange('privacy')}
              required
              error={errors.privacy}
            >
              我同意隐私政策
            </Checkbox>
          </div>
        </div>

        {Object.keys(errors).length > 0 && (
          <Alert status="error">
            请修正以下错误后再提交
          </Alert>
        )}

        <Button type="submit" className="w-full">
          保存设置
        </Button>
      </form>
    </Card>
  )
}
```

这个完整的示例展示了 Checkbox 组件在实际应用中的各种使用场景，包括状态管理、表单验证、错误处理和用户交互。