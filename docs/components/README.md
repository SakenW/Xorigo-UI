# Xorigo UI 组件库

> 基于 Atomic Design 原则的现代化 React 组件集合

## 📋 组件分类

### 🎨 UI 组件 (`ui/`)
基础界面元素，构成用户界面的基本单元

- **Button** - 按钮组件，支持多种变体和尺寸
- **Input** - 输入框组件，包含多种输入类型
- **Card** - 卡片容器组件
- **Avatar** - 头像组件
- **Badge** - 徽章/标签组件
- **Skeleton** - 骨架屏加载组件
- **Divider** - 分割线组件
- **Spinner** - 加载指示器
- **Checkbox** - 复选框组件
- **Radio** - 单选框组件
- **Select** - 选择器组件
- **Switch** - 开关组件
- **Textarea** - 多行文本输入
- **Pagination** - 分页组件
- **Breadcrumb** - 面包屑导航
- **Tooltip** - 工具提示
- **SearchInput** - 搜索输入框
- **PasswordInput** - 密码输入框
- **InputNumber** - 数字输入框
- **ButtonGroup** - 按钮组
- **Combobox** - 组合框
- **Command** - 命令面板
- **SwitchNoMotion** - 无动画开关

### 💬 反馈组件 (`feedback/`)
用于向用户提供反馈和状态信息的组件

- **Alert** - 警告提示组件
- **Toast** - 轻量级消息提示
- **Notification** - 通知消息组件
- **Loading** - 加载状态组件
- **Progress** - 进度条组件
- **Modal** - 模态框组件
- **ThemeToggle** - 主题切换器

### 🧭 导航组件 (`navigation/`)
用于页面导航和布局的组件

- **Sidebar** - 侧边栏导航
- **Tabs** - 标签页组件
- **DataTable** - 数据表格
- **ResponsiveLayout** - 响应式布局
- **BasicHeader** - 基础页头

### 🚀 高级组件 (`advanced/`)
复杂交互和复合组件

- **Dialog** - 对话框组件
- **AdvancedCard** - 高级卡片组件
- **AnimatedCard** - 动画卡片组件
- **MicroInteractions** - 微交互组件
- **InteractionStates** - 交互状态组件

### 🔧 Radix UI 组件 (`radix/`)
基于 Radix UI 的无障碍组件

- **Accordion** - 手风琴组件
- **DropdownMenu** - 下拉菜单组件

## 🎯 组件特性

### ✨ 统一的设计系统
- **七轴主题支持** - 所有组件完全支持七轴主题系统
- **原子化设计** - 基于 Atomic Design 原则的组件架构
- **响应式设计** - 移动优先的响应式布局
- **可访问性** - 符合 WCAG 2.1 AA 标准

### 🔧 开发体验
- **TypeScript 优先** - 完整的类型定义和智能提示
- **一致性 API** - 统一的组件接口设计
- **组合式设计** - 高度可组合和可定制
- **性能优化** - 基于现代 React 的最佳性能实践

### 🎨 样式系统
- **CSS 变量驱动** - 完全基于 CSS 变量的样式系统
- **Tailwind CSS 集成** - 深度集成 Tailwind CSS 4
- **主题切换** - 支持实时主题切换
- **动画支持** - 基于 Framer Motion 12 的流畅动画

## 📖 使用指南

### 安装
```bash
npm install @xorigo-ui/core
```

### 基础用法
```typescript
import { Button, Card, Input } from '@xorigo-ui/core'

function MyComponent() {
  return (
    <Card className="p-4">
      <Input placeholder="输入内容..." className="mb-4" />
      <Button variant="primary">提交</Button>
    </Card>
  )
}
```

### 主题配置
```typescript
import { StyleRecipeProvider } from '@xorigo-ui/core'

function App() {
  return (
    <StyleRecipeProvider recipe="dark.cool-blue.vivid.bright.comfortable.medium.high">
      <MyApp />
    </StyleRecipeProvider>
  )
}
```

## 🎨 组件 API 标准

### 基础属性
所有组件都支持以下基础属性：

```typescript
interface ComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  className?: string
  children?: React.ReactNode
}
```

### 事件处理
```typescript
interface InteractiveProps {
  onClick?: (event: Event) => void
  onFocus?: (event: FocusEvent) => void
  onBlur?: (event: FocusEvent) => void
}
```

### 状态属性
```typescript
interface StateProps {
  loading?: boolean
  error?: boolean
  required?: boolean
}
```

## 🧪 测试覆盖

所有组件都包含完整的测试覆盖：

- **渲染测试** - 确保组件正确渲染
- **Props 测试** - 验证所有 props 的正确处理
- **事件测试** - 测试用户交互事件
- **可访问性测试** - 验证 ARIA 属性和键盘导航
- **主题测试** - 确保在不同主题下正常显示

## 📚 相关文档

- [组件 API 文档](../api/components.md) - 详细的组件 API 参考
- [主题系统](../theming/README.md) - 七轴主题系统详解
- [开发指南](../development/component-development.md) - 组件开发规范
- [设计令牌](../theming/design-tokens.md) - DTCG 标准令牌系统

## 🤝 贡献

欢迎为组件库贡献新的组件或改进现有组件！请查看 [贡献指南](../development/contributing.md) 了解详细信息。

---

**Xorigo UI Team** · **组件库版本** v1.4.0