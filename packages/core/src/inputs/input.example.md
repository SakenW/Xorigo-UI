# Input 组件使用示例

## 基础用法

```typescript
import { Input } from '@xorigo-ui/core/form'

// 基础输入框
<Input placeholder="请输入内容" />

// 带标签的输入框
<Input label="用户名" placeholder="请输入用户名" />

// 受控模式
const [value, setValue] = useState('')
<Input value={value} onChange={(e) => setValue(e.target.value)} />
```

## 变体样式

```typescript
// 默认样式
<Input variant="default" placeholder="Default" />

// 填充样式
<Input variant="filled" placeholder="Filled" />

// 轮廓样式
<Input variant="outlined" placeholder="Outlined" />

// 下划线样式
<Input variant="underlined" placeholder="Underlined" />

// 幽灵样式
<Input variant="ghost" placeholder="Ghost" />

// 霓虹样式
<Input variant="neon" placeholder="Neon" />
```

## 尺寸规格

```typescript
// 小尺寸
<Input size="sm" placeholder="Small" />

// 中等尺寸
<Input size="md" placeholder="Medium" />

// 大尺寸
<Input size="lg" placeholder="Large" />
```

## 状态管理

```typescript
// 错误状态
<Input error="邮箱格式不正确" placeholder="请输入邮箱" />

// 成功状态
<Input validationState="success" placeholder="验证通过" />

// 警告状态
<Input validationState="warning" placeholder="需要注意" />

// 禁用状态
<Input disabled placeholder="已禁用" />

// 加载状态
<Input loading placeholder="加载中..." />
```

## 图标和前缀后缀

```typescript
import { Mail, Lock, Search } from 'lucide-react'

// 左侧图标
<Input leftIcon={<Mail />} placeholder="请输入邮箱" />

// 右侧图标
<Input rightIcon={<Search />} placeholder="搜索内容" />

// 前缀文本
<Input prefix="https://" placeholder="example.com" />

// 后缀文本
<Input suffix=".com" placeholder="example" />

// 组合使用
<Input
  leftIcon={<Mail />}
  prefix="@"
  suffix=".com"
  placeholder="username"
/>
```

## 高级功能

```typescript
// 可清除
<Input clearable placeholder="可清除的输入框" />

// 密码切换
<Input
  type="password"
  showPasswordToggle
  placeholder="请输入密码"
/>

// 字符计数
<Input
  showCharCount
  maxLength={100}
  placeholder="限制字数"
/>

// 浮动标签
<Input
  floatingLabel
  label="用户名"
  placeholder="请输入用户名"
/>
```

## 表单验证

```typescript
const [email, setEmail] = useState('')
const [emailError, setEmailError] = useState('')

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!re.test(email)) {
    setEmailError('请输入有效的邮箱地址')
    return false
  }
  setEmailError('')
  return true
}

return (
  <Input
    label="邮箱地址"
    type="email"
    placeholder="请输入邮箱地址"
    value={email}
    onChange={(e) => {
      setEmail(e.target.value)
      validateEmail(e.target.value)
    }}
    error={emailError}
    leftIcon={<Mail />}
    required
  />
)
```

## 完整表单示例

```typescript
import { useState } from 'react'
import { Input } from '@xorigo-ui/core/form'
import { Mail, Lock, User } from 'lucide-react'

export function RegistrationForm() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    // 清除对应字段的错误
    setErrors(prev => ({ ...prev, [field]: '' }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // 验证逻辑
    console.log('提交表单:', formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="用户名"
        placeholder="请输入用户名"
        value={formData.username}
        onChange={handleChange('username')}
        error={errors.username}
        leftIcon={<User />}
        clearable
        showCharCount
        maxLength={20}
        required
      />

      <Input
        label="邮箱地址"
        type="email"
        placeholder="请输入邮箱地址"
        value={formData.email}
        onChange={handleChange('email')}
        error={errors.email}
        leftIcon={<Mail />}
        required
      />

      <Input
        label="密码"
        type="password"
        placeholder="请输入密码"
        value={formData.password}
        onChange={handleChange('password')}
        error={errors.password}
        leftIcon={<Lock />}
        showPasswordToggle
        showCharCount
        maxLength={32}
        required
        helperText="密码至少8位，包含字母和数字"
      />

      <button type="submit" className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg">
        注册
      </button>
    </form>
  )
}
```

## 主题集成

Input 组件完全集成 Xorigo UI 的七轴主题系统，支持：

- **模式轴**: 自动适配 light/dark 模式
- **色调轴**: 支持自定义色相
- **饱和度轴**: 可调节色彩鲜艳度
- **亮度轴**: 动态明暗程度
- **密度轴**: 空间紧凑度适配
- **圆度轴**: 边角圆润度变化
- **对比度轴**: 视觉对比度支持

所有状态颜色、边框样式、阴影效果都会根据当前主题配方自动调整。