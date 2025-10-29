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

## 🔧 项目结构适配

### 文件创建规则
- **工具函数**: `packages/core/src/utils/accessibility.ts`
- **测试工具**: `packages/core/src/utils/accessibility-tester.ts`
- **组件文件**: `packages/core/src/components/[category]/[component]/`
- **类型文件**: 与组件同目录或 `types/` 子目录

### 模块导出规则
- **组件导出**: 每个组件目录需要 `index.ts` 导出文件
- **工具导出**: 在 `packages/core/src/index.ts` 中统一导出
- **类型导出**: 明确导出类型定义
- **兼容性**: 支持现有导入路径

### TypeScript 配置要求
- **React 导入**: 必须显式导入 `React` 用于 JSX/TSX
- **类型安全**: 使用 `forwardRef` 和完整的类型定义
- **JSX 语法**: 考虑使用 `React.createElement` 兼容不同配置

## ⚠️ 常见问题避免

### 1. JSX 语法问题
**错误**: 直接使用 JSX 语法可能导致编译错误
```typescript
// ❌ 可能失败
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ href, children, className }, ref) => {
    return (
      <a ref={ref} href={href} className={className}>
        {children}
      </a>
    )
  }
)
```

**正确**: 使用 React.createElement 确保兼容性
```typescript
// ✅ 确保兼容
export const SkipLink = forwardRef<HTMLAnchorElement, SkipLinkProps>(
  ({ href, children, className }, ref) => {
    return React.createElement('a', { ref, href, className }, children)
  }
)
```

### 2. 导入路径问题
**错误**: 假设所有路径都存在或使用不兼容的导入路径
```typescript
// ❌ 可能失败
export * from './components/modal'  // 需要确认目录存在

// ❌ Vite 构建时有效，Next.js 运行时失败
import { cn } from '@/foundations/utils/cn'
```

**正确**: 检查文件结构并使用兼容的导入路径
```typescript
// ✅ 确保路径存在
// 1. 确认目录存在: packages/core/src/components/modal/
// 2. 确认主文件存在: packages/core/src/components/modal/modal.tsx
// 3. 创建导出文件: packages/core/src/components/modal/index.ts
// 4. 在主 index.ts 中导出: export * from './components/modal'

// ✅ 使用相对路径确保跨环境兼容
import { cn } from '../../foundations/utils/cn'  // 从 form/typography 子目录
import { cn } from '../foundations/utils/cn'   // 从其他子目录
```

**实际案例**: 2025-10-29 组件生成器问题
- **问题**: 生成的组件使用 `@/foundations/utils/cn` 导致 Next.js 运行时无法解析
- **原因**: Vite 别名在构建时有效，但在 Next.js 运行时失败
- **解决**: 修改生成器模板使用相对路径 `../../foundations/utils/cn`
- **验证**: 确保在 Vite 构建和 Next.js 运行时都能正常工作

### 3. ARIA 属性拼写
**错误**: ARIA 属性拼写错误
```typescript
// ❌ 错误的 ARIA 属性
{ 'aria-extended': ariaExpanded }  // 应该是 aria-expanded
```

**正确**: 使用标准 ARIA 属性
```typescript
// ✅ 正确的 ARIA 属性
{ 'aria-expanded': ariaExpanded }
```

### 4. 运行时错误问题
**错误**: 变量名不一致或缺少错误处理
```typescript
// ❌ 可能导致 ReferenceError
private generateRecommendations(): string[] {
  const commonIssues = this.getCommonIssues()  // 返回 commonErrors
  if (commonErrors.keyboard > 0) { ... }     // ❌ 变量名错误
}
```

**正确**: 统一变量名并添加错误处理
```typescript
// ✅ 确保变量名一致
private generateRecommendations(): string[] {
  const commonErrors = this.getCommonIssues()
  if (commonErrors.keyboard > 0) { ... }
}

// ✅ 添加环境检查和错误处理
testPage(): AccessibilityTestResult[] {
  if (typeof document === 'undefined') {
    return []  // 非浏览器环境
  }

  try {
    // 测试逻辑
  } catch (error) {
    console.warn('Accessibility test failed:', error)
    return []
  }
}
```

### 5. 空结果处理问题
**错误**: 假设总是有可测试的元素
```typescript
// ❌ 可能在没有交互元素时出错
const elements = document.querySelectorAll('button, input')
elements.forEach(el => testElement(el))  // 如果 elements 为空则不会执行
```

**正确**: 添加空结果检查
```typescript
// ✅ 安全处理空结果
const elements = document.querySelectorAll('button, input')
if (elements.length === 0) {
  return []  // 明确返回空数组
}

elements.forEach(el => testElement(el))
```

## 🛠️ 实现步骤

### 第一步: 创建工具函数
1. 创建 `packages/core/src/utils/accessibility.ts`
2. 实现 ARIA 生成器、键盘导航、焦点管理等功能
3. 确保导入 React 和相关类型

### 第二步: 创建测试工具
1. 创建 `packages/core/src/utils/accessibility-tester.ts`
2. 实现自动化 WCAG 合规性检查
3. 添加开发环境集成

### 第三步: 创建/增强组件
1. 创建组件目录和主文件
2. 创建 `index.ts` 导出文件
3. 实现完整的可访问性支持

### 第四步: 更新导出
1. 在 `packages/core/src/index.ts` 中添加新导出
2. 确保向后兼容性
3. 测试导入路径

### 第五步: 集成到应用
1. 更新现有组件的可访问性支持
2. 添加跳过链接等辅助功能
3. 集成自动化测试

## 📋 质量检查清单

### 代码质量
- [ ] 无 TypeScript 编译错误
- [ ] 无 ESLint 警告
- [ ] 无运行时错误（ReferenceError 等）
- [ ] 使用 React.createElement（可选）
- [ ] 正确的 ARIA 属性拼写
- [ ] 完整的类型定义
- [ ] 变量名一致性检查
- [ ] 错误处理和边界情况

### 项目结构
- [ ] 文件路径正确
- [ ] 目录结构符合规范
- [ ] 导出文件完整
- [ ] 导入路径有效

### 功能完整性
- [ ] 键盘导航支持
- [ ] 屏幕阅读器支持
- [ ] 焦点管理
- [ ] WCAG 合规性检查
- [ ] 跳过链接支持
- [ ] 运行时稳定性（无 ReferenceError）
- [ ] 空结果安全处理
- [ ] 环境兼容性检查

### 兼容性
- [ ] 现有组件兼容
- [ ] 导入路径兼容
- [ ] API 向后兼容
- [ ] 浏览器兼容性

## 🔧 故障排除

### 常见运行时错误

**1. `ReferenceError: xxx is not defined`**
```typescript
// 症状：运行时提示变量未定义
// 原因：变量名不一致或作用域问题

// 解决方案：
// 1. 检查变量名拼写
const commonErrors = this.getCommonIssues()  // ✅ 正确
if (commonErrors.keyboard > 0) { ... }      // ✅ 使用相同变量名

// 2. 确保变量在正确作用域内定义
private methodName(): ReturnType {
  const localVar = 'value'  // ✅ 在方法内定义
  return localVar
}
```

**2. `Cannot read property 'xxx' of undefined`**
```typescript
// 症状：访问 undefined 对象的属性
// 原因：空结果或异步加载问题

// 解决方案：
// 1. 添加空值检查
if (!data || !data.recommendations) {
  return []
}

// 2. 提供默认值
const recommendations = report.recommendations || []
```

**3. `document is not defined`**
```typescript
// 症状：SSR 环境中访问浏览器 API
// 原因：服务器端渲染时缺少 document 对象

// 解决方案：
// 1. 环境检查
if (typeof document !== 'undefined') {
  // 浏览器环境代码
}

// 2. 动态导入
const isBrowser = typeof window !== 'undefined'
if (isBrowser) {
  // 安全访问浏览器 API
}
```

### 调试技巧

**1. 开发环境检查**
```typescript
// 在开发环境中启用详细日志
if (process.env.NODE_ENV === 'development') {
  console.log('Accessibility test results:', results)
  console.log('Generated report:', report)
}
```

**2. 渐进式测试**
```typescript
// 先测试基础功能，再添加复杂功能
try {
  // 1. 基础 DOM 查询
  const elements = document.querySelectorAll('button')
  console.log(`Found ${elements.length} buttons`)

  // 2. 简单属性检查
  elements.forEach(el => {
    console.log('Button attributes:', el.getAttribute('aria-label'))
  })

  // 3. 完整测试
  return testPage()
} catch (error) {
  console.error('Test failed at step:', error)
  return []
}
```

### 性能优化

**1. 避免重复查询**
```typescript
// ❌ 多次查询相同元素
document.querySelectorAll('button')
document.querySelectorAll('button')

// ✅ 缓存查询结果
const buttons = document.querySelectorAll('button')
buttons.forEach(button => testButton(button))
```

**2. 使用防抖**
```typescript
// 避免频繁触发测试
const debouncedTest = debounce(runAccessibilityTests, 1000)
window.addEventListener('resize', debouncedTest)
```

## 🎯 最佳实践总结

1. **始终添加环境检查** - 确保代码在不同环境中稳定运行
2. **变量名保持一致** - 避免拼写错误和作用域问题
3. **处理空结果** - 明确处理边界情况
4. **添加错误处理** - 使用 try-catch 捕获异常
5. **渐进式实现** - 从简单到复杂，逐步完善功能