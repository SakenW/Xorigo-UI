# 可访问性属性生成 Skill

**触发条件**：当需要为组件添加可访问性支持、生成 ARIA 属性、实现键盘导航时触发

## 功能描述

自动生成符合 WCAG 2.1 AA 标准的可访问性属性和键盘导航逻辑，确保所有组件具备完整的可访问性支持。

## 核心能力

### 1. ARIA 属性自动生成
基于组件类型和用途，生成正确的 ARIA 属性：

```typescript
// 基于组件分析的 ARIA 属性生成
function generateAriaProps(componentType: string, props: any) {
  const ariaProps: Record<string, any> = {}

  switch (componentType) {
    case 'Button':
      ariaProps['role'] = 'button'
      ariaProps['aria-disabled'] = props.disabled
      if (props.loading) {
        ariaProps['aria-busy'] = true
        ariaProps['aria-label'] = 'Loading'
      }
      break

    case 'Input':
      ariaProps['aria-invalid'] = props.error
      ariaProps['aria-describedby'] = props.error ? 'error-message' : undefined
      if (props.required) {
        ariaProps['aria-required'] = true
      }
      if (props.label) {
        ariaProps['aria-label'] = props.label
      }
      break

    case 'Modal':
      ariaProps['role'] = 'dialog'
      ariaProps['aria-modal'] = true
      ariaProps['aria-labelledby'] = 'modal-title'
      ariaProps['aria-describedby'] = 'modal-description'
      break
  }

  return ariaProps
}
```

### 2. 键盘导航逻辑
生成标准的键盘导航处理：

```typescript
// 键盘导航模式生成
function generateKeyboardNavigation(componentType: string) {
  const keyboardHandlers: Record<string, Function> = {}

  switch (componentType) {
    case 'Button':
      keyboardHandlers['onKeyDown'] = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'Enter':
          case ' ':
            e.preventDefault()
            handleClick()
            break
          case 'Tab':
            // 允许默认 Tab 行为
            break
        }
      }
      break

    case 'Dropdown':
      keyboardHandlers['onKeyDown'] = (e: KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault()
            navigateDown()
            break
          case 'ArrowUp':
            e.preventDefault()
            navigateUp()
            break
          case 'Enter':
          case ' ':
            e.preventDefault()
            selectOption()
            break
          case 'Escape':
            e.preventDefault()
            closeDropdown()
            break
        }
      }
      break
  }

  return keyboardHandlers
}
```

### 3. 焦点管理
实现正确的焦点管理和视觉指示：

```typescript
// 焦点管理逻辑
function generateFocusManagement() {
  return {
    // 焦点陷阱
    trapFocus: (containerRef: RefObject<HTMLElement>) => {
      useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const focusableElements = container.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        const firstElement = focusableElements[0] as HTMLElement
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

        const handleTabKey = (e: KeyboardEvent) => {
          if (e.key !== 'Tab') return

          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus()
              e.preventDefault()
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus()
              e.preventDefault()
            }
          }
        }

        container.addEventListener('keydown', handleTabKey)
        return () => container.removeEventListener('keydown', handleTabKey)
      }, [])
    },

    // 焦点恢复
    restoreFocus: (previousFocusRef: RefObject<HTMLElement>) => {
      useEffect(() => {
        return () => {
          if (previousFocusRef.current) {
            previousFocusRef.current.focus()
          }
        }
      }, [])
    }
  }
}
```

### 4. 屏幕阅读器支持
生成屏幕阅读器友好的文本和提示：

```typescript
// 屏幕阅读器支持
function generateScreenReaderSupport() {
  return {
    // 状态公告
    announceToScreenReader: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      const announcement = document.createElement('div')
      announcement.setAttribute('aria-live', priority)
      announcement.setAttribute('aria-atomic', 'true')
      announcement.style.position = 'absolute'
      announcement.style.left = '-10000px'
      announcement.textContent = message

      document.body.appendChild(announcement)

      setTimeout(() => {
        document.body.removeChild(announcement)
      }, 1000)
    },

    // 描述性文本生成
    generateDescription: (componentType: string, props: any) => {
      const descriptions: string[] = []

      if (props.disabled) {
        descriptions.push('Disabled')
      }

      if (props.required) {
        descriptions.push('Required')
      }

      if (props.error) {
        descriptions.push(`Error: ${props.error}`)
      }

      if (props.loading) {
        descriptions.push('Loading')
      }

      return descriptions.join(', ')
    }
  }
}
```

### 5. 颜色对比度验证
验证文本和背景的颜色对比度：

```typescript
// 颜色对比度检查
function validateColorContrast(foreground: string, background: string): {
  ratio: number
  wcagAA: boolean
  wcagAAA: boolean
  recommendation?: string
} {
  // 简化的对比度计算 (实际实现需要更复杂的算法)
  const getLuminance = (color: string): number => {
    // 移除 # 并转换为 RGB
    const hex = color.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16) / 255
    const g = parseInt(hex.substring(2, 4), 16) / 255
    const b = parseInt(hex.substring(4, 6), 16) / 255

    // 计算相对亮度
    const rsRGB = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
    const gsRGB = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
    const bsRGB = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

    return 0.2126 * rsRGB + 0.7152 * gsRGB + 0.0722 * bsRGB
  }

  const l1 = getLuminance(foreground)
  const l2 = getLuminance(background)
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

  return {
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
    recommendation: ratio < 4.5 ? 'Increase color contrast' : undefined
  }
}
```

## 可访问性检查清单

### 基础要求
- [ ] 所有交互元素可通过键盘访问
- [ ] 正确的 ARIA 角色和属性
- [ ] 焦点指示器清晰可见
- [ ] 屏幕阅读器文本描述完整

### 高级要求
- [ ] 颜色对比度符合 WCAG AA 标准 (4.5:1)
- [ ] 动态内容变化时有屏幕阅读器公告
- [ ] 焦点陷阱在模态框中正确工作
- [ ] 跳过链接支持

### 交互要求
- [ ] Enter/Space 键激活按钮
- [ ] 方向键导航菜单项
- [ ] Escape 键关闭弹出层
- [ ] Tab 键顺序逻辑正确

## 使用示例

```bash
# 为组件生成可访问性支持
"为 Button 组件添加完整的可访问性支持，包括键盘导航和屏幕阅读器支持"

# 验证可访问性
"检查 Modal 组件的可访问性实现，确保符合 WCAG 2.1 AA 标准"

# 修复可访问性问题
"修复 Dropdown 组件的键盘导航问题，添加正确的 ARIA 属性"
```

## 输出格式

1. **可访问性属性**: 完整的 ARIA 属性配置
2. **键盘处理**: 键盘事件处理逻辑
3. **焦点管理**: 焦点陷阱和恢复逻辑
4. **测试用例**: 可访问性测试场景
5. **使用指南**: 可访问性最佳实践说明

## 技术依据

基于 WCAG 2.1 AA 标准和 Xorigo UI 组件的实际可访问性需求：

- **Button**: Enter/Space 激活，loading 状态公告
- **Input**: 标签关联，错误消息描述，必填字段标识
- **Modal**: 焦点陷阱，Escape 关闭，背景锁定
- **Dropdown**: 方向键导航，选项选择，关闭处理

确保所有组件提供平等的用户体验，支持键盘导航、屏幕阅读器和辅助技术。