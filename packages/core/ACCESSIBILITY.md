# Xorigo UI 可访问性指南

## 📋 概述

Xorigo UI 致力于提供符合 WCAG 2.1 AA 标准的可访问性组件库，确保所有用户都能平等地访问和使用我们的界面。

## 🎯 目标标准

- **WCAG 2.1 AA**: 主要遵循标准
- **WCAG 2.1 AAA**: 在关键交互区域尽可能达到
- **Section 508**: 符合美国联邦可访问性标准
- **EN 301 549**: 欧洲可访问性标准

## 🔧 可访问性特性

### 1. 键盘导航

所有交互组件都支持完整的键盘导航：

```typescript
// ✅ 支持的键盘操作
Tab - 在可聚焦元素间导航
Shift + Tab - 反向导航
Enter - 激活按钮和链接
Space - 激活按钮和复选框
Escape - 关闭模态框和下拉菜单
Arrow Keys - 在菜单、列表、选项卡中导航
```

### 2. ARIA 属性

我们为所有组件提供了完整的 ARIA 属性支持：

```typescript
// ✅ 按钮组件
<Button
  aria-label="删除项目"
  aria-describedby="delete-help"
  aria-expanded={false}
  pressed={false}
>

// ✅ 输入框组件
<Input
  label="邮箱地址"
  aria-required={true}
  aria-invalid={false}
  aria-describedby="email-help"
>

// ✅ 模态框组件
<Modal
  title="确认删除"
  aria-modal={true}
  aria-labelledby="modal-title"
  aria-describedby="modal-description"
>
```

### 3. 焦点管理

- **焦点陷阱**: 模态框和下拉菜单实现完整的焦点陷阱
- **焦点恢复**: 关闭模态框后自动恢复到触发元素
- **焦点指示**: 所有可聚焦元素都有清晰的焦点样式
- **逻辑顺序**: Tab 键遵循逻辑的导航顺序

### 4. 颜色对比度

所有文本和背景组合都满足 WCAG 对比度要求：

- **普通文本**: 至少 4.5:1 对比度 (AA)
- **大文本**: 至少 3:1 对比度 (AA)
- **重要交互元素**: 优先达到 7:1 对比度 (AAA)

## 🧪 测试工具

### 自动化测试

我们提供了完整的可访问性测试套件：

```bash
# 运行所有可访问性测试
npm run test:accessibility

# 检查特定组件
npm run accessibility:check:components

# 生成可访问性报告
npm run accessibility:check:report

# 检查颜色对比度
npm run color-contrast:check
```

### 手动测试清单

#### 键盘导航测试
- [ ] 所有交互元素都可以通过键盘访问
- [ ] Tab 键导航顺序逻辑清晰
- [ ] 焦点指示清晰可见
- [ ] 模态框有焦点陷阱
- [ ] Escape 键可以关闭模态框

#### 屏幕阅读器测试
- [ ] 所有按钮都有可访问的名称
- [ ] 表单元素都有正确的标签
- - [ ] 状态变化有适当的通知
- [ ] 图片有替代文本
- [ ] 链接目的明确

#### 颜色对比度测试
- [ ] 普通文本对比度 ≥ 4.5:1
- [ ] 大文本对比度 ≥ 3:1
- [ ] 交互元素有足够的对比度
- [ ] 不仅依赖颜色传达信息

## 📊 组件可访问性状态

| 组件 | 键盘导航 | ARIA 支持 | 焦点管理 | 颜色对比度 | 状态 |
|------|----------|-----------|----------|------------|------|
| Button | ✅ | ✅ | ✅ | ✅ | 完整 |
| Input | ✅ | ✅ | ✅ | ✅ | 完整 |
| Modal | ✅ | ✅ | ✅ | ✅ | 完整 |
| Alert | ✅ | ✅ | ⚠️ | ✅ | 良好 |
| Toast | ✅ | ✅ | ⚠️ | ✅ | 良好 |
| Dialog | ✅ | ✅ | ✅ | ✅ | 完整 |
| Card | ⚠️ | ⚠️ | ⚠️ | ✅ | 基础 |
| Table | ✅ | ✅ | ⚠️ | ✅ | 良好 |

**图例**: ✅ 完整支持 | ⚠️ 部分支持 | ❌ 不支持

## 🛠️ 开发指南

### 组件开发可访问性要求

1. **语义化 HTML**: 使用正确的 HTML 元素
2. **ARIA 属性**: 添加必要的 ARIA 属性
3. **键盘支持**: 确保键盘可以操作所有功能
4. **焦点管理**: 正确处理焦点状态
5. **颜色对比**: 确保足够的颜色对比度

### 代码示例

```typescript
// ✅ 正确的可访问性实现
const AccessibleButton = ({ children, onClick, ...props }) => {
  return (
    <button
      onClick={onClick}
      // 确保有可访问的名称
      aria-label={props.ariaLabel}
      // 支持键盘操作
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(e)
        }
      }}
      // 焦点样式
      className="focus:ring-2 focus:ring-blue-500"
      {...props}
    >
      {children}
    </button>
  )
}
```

### 常见问题和解决方案

#### 问题1: 图标按钮没有可访问名称
```typescript
// ❌ 错误
<Button onClick={handleDelete}>
  <Icon name="trash" />
</Button>

// ✅ 正确
<Button
  onClick={handleDelete}
  aria-label="删除项目"
>
  <Icon name="trash" />
</Button>
```

#### 问题2: 输入框没有标签
```typescript
// ❌ 错误
<Input placeholder="请输入邮箱" />

// ✅ 正确
<Input
  label="邮箱地址"
  placeholder="请输入邮箱"
  id="email"
/>
```

#### 问题3: 模态框没有焦点管理
```typescript
// ❌ 错误 - 没有焦点陷阱
const Modal = ({ open, children }) => {
  return open ? <div>{children}</div> : null
}

// ✅ 正确 - 有焦点陷阱
const Modal = ({ open, onClose, children }) => {
  // 使用我们的 useFocusTrap hook
  const modalRef = useFocusTrap(open)

  useEffect(() => {
    if (open) {
      // 保存当前焦点
      previousFocusRef.current = document.activeElement
      // 设置焦点陷阱
    } else {
      // 恢复焦点
    }
  }, [open])

  return open ? (
    <div ref={modalRef} role="dialog" aria-modal="true">
      {children}
    </div>
  ) : null
}
```

## 🔍 测试工具使用

### axe-core 集成

我们集成了 axe-core 进行自动化可访问性检测：

```typescript
import { axe, toHaveNoViolations } from 'jest-axe'

// 在测试中使用
test('组件应该没有可访问性违规', async () => {
  const { container } = render(<MyComponent />)
  const results = await axe(container)
  expect(results).toHaveNoViolations()
})
```

### 颜色对比度检查

```typescript
import { checkColorContrast } from './utils/color-contrast'

// 检查颜色对比度
const result = checkColorContrast('#000000', '#FFFFFF', 16)
console.log(result.ratio) // 21
console.log(result.passesWCAG.AA) // true
```

## 🚀 持续改进

我们致力于持续改进可访问性：

1. **定期审查**: 每个版本都进行可访问性审查
2. **用户反馈**: 收集和响应用户的可访问性反馈
3. **标准更新**: 跟进最新的可访问性标准和最佳实践
4. **工具改进**: 持续改进可访问性测试工具

## 📞 反馈和支持

如果您在使用过程中发现可访问性问题，请通过以下方式联系我们：

- **GitHub Issues**: [报告可访问性问题](https://github.com/xorigo-ui/xorigo-ui/issues)
- **邮件**: accessibility@xorigo-ui.com
- **文档**: 查看我们的 [可访问性文档](https://docs.xorigo-ui.com/accessibility)

## 📚 参考资料

- [WCAG 2.1 指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM 可访问性检查清单](https://webaim.org/standards/wcag/checklist)
- [ARIA 最佳实践](https://www.w3.org/TR/wai-aria-practices-1.1/)
- [Microsoft 可访问性指南](https://docs.microsoft.com/en-us/windows/uwp/design/accessibility/)
- [Google Web 可访问性基础](https://web.dev/accessibility/)

---

**最后更新**: 2025年10月16日
**版本**: 1.0.0
**维护者**: Xorigo UI Team