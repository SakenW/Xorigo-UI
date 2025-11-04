# Switch 组件使用示例

## 基础用法

```tsx
import { Switch } from '@xorigo-ui/core/form'

function BasicSwitch() {
  return <Switch label="Enable notifications" />
}
```

## 受控组件

```tsx
import { useState } from 'react'
import { Switch } from '@xorigo-ui/core/form'

function ControlledSwitch() {
  const [enabled, setEnabled] = useState(false)

  return (
    <Switch
      checked={enabled}
      onCheckedChange={setEnabled}
      label="Auto-save"
      description="Automatically save your changes"
    />
  )
}
```

## 不同变体

```tsx
import { Switch } from '@xorigo-ui/core/form'

function VariantSwitches() {
  return (
    <div className="space-y-4">
      <Switch label="Default" variant="default" />
      <Switch label="Primary" variant="primary" defaultChecked />
      <Switch label="Success" variant="success" />
      <Switch label="Danger" variant="danger" />
      <Switch label="Outline" variant="outline" defaultChecked />
    </div>
  )
}
```

## 不同尺寸

```tsx
import { Switch } from '@xorigo-ui/core/form'

function SizeSwitches() {
  return (
    <div className="space-y-4">
      <Switch label="Small" size="sm" />
      <Switch label="Medium" size="md" defaultChecked />
      <Switch label="Large" size="lg" />
    </div>
  )
}
```

## 加载状态

```tsx
import { useState } from 'react'
import { Switch } from '@xorigo-ui/core/form'

function LoadingSwitch() {
  const [loading, setLoading] = useState(false)

  const handleChange = async (checked: boolean) => {
    setLoading(true)
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    setLoading(false)
  }

  return (
    <Switch
      label="Sync settings"
      loading={loading}
      onCheckedChange={handleChange}
    />
  )
}
```

## 带图标

```tsx
import { Switch } from '@xorigo-ui/core/form'

function IconSwitch() {
  const SunIcon = () => <span className="text-yellow-500">☀️</span>
  const MoonIcon = () => <span className="text-blue-500">🌙</span>

  return (
    <div className="space-y-4">
      <Switch
        label="Light mode"
        description="Use light theme"
        thumbIcon={<SunIcon />}
      />
      <Switch
        label="Dark mode"
        description="Use dark theme"
        defaultChecked
        thumbIcon={<MoonIcon />}
      />
    </div>
  )
}
```

## 表单集成

```tsx
import { useState } from 'react'
import { Switch } from '@xorigo-ui/core/form'

function SettingsForm() {
  const [settings, setSettings] = useState({
    notifications: true,
    marketing: false,
    security: true,
  })

  const updateSetting = (key: string) => (value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  return (
    <form className="space-y-4">
      <Switch
        label="Email notifications"
        description="Receive email updates"
        checked={settings.notifications}
        onCheckedChange={updateSetting('notifications')}
      />
      <Switch
        label="Marketing emails"
        description="Promotional content"
        checked={settings.marketing}
        onCheckedChange={updateSetting('marketing')}
      />
      <Switch
        label="Two-factor auth"
        description="Extra security layer"
        checked={settings.security}
        onCheckedChange={updateSetting('security')}
        variant="success"
      />
    </form>
  )
}
```

## 状态和验证

```tsx
import { useState } from 'react'
import { Switch } from '@xorigo-ui/core/form'

function ValidationSwitch() {
  const [hasError, setHasError] = useState(false)

  return (
    <div className="space-y-4">
      <Switch
        label="Valid option"
        status="success"
        defaultChecked
        description="This setting is valid"
      />
      <Switch
        label="Error option"
        status="error"
        description="This option has an error"
        onChange={() => setHasError(!hasError)}
      />
      <Switch
        label="Warning option"
        status="warning"
        description="Please review this setting"
      />
    </div>
  )
}
```

## 可访问性最佳实践

```tsx
import { Switch } from '@xorigo-ui/core/form'

function AccessibleSwitch() {
  return (
    <Switch
      label="Screen reader friendly"
      description="This switch supports assistive technologies"
      aria-label="Toggle screen reader mode"
      aria-describedby="screen-reader-help"
    />
  )
}
```

## 主题适配

Switch组件自动适配Xorigo UI的七轴主题系统：

- **模式轴**: 浅色/深色模式自动切换
- **色调轴**: 使用主题色彩令牌
- **饱和度轴**: 色彩鲜艳度适配
- **亮度轴**: 明暗程度适配
- **密度轴**: 空间紧凑度适配
- **圆度轴**: 边角圆润度适配
- **对比度轴**: 视觉对比度适配

无需额外配置，组件会自动应用当前主题的样式。