# Overlays 覆盖层组件

按照 Xorigo UI 白皮书 v1.0 标准实现的覆盖层组件库，提供对话框、抽屉、弹出框等高质量的覆盖层组件。

## 📦 组件列表

### Dialog 对话框
模态对话框，用于重要操作确认或信息展示。

**特性**：
- ✅ 4种变体：default, destructive, warning, success
- ✅ 5种尺寸：sm, md, lg, xl, full
- ✅ 模态和非模态模式
- ✅ ESC键关闭
- ✅ 点击遮罩关闭（可选）
- ✅ 强制焦点管理
- ✅ 完整可访问性支持

**基本用法**：
```tsx
import { Dialog, DialogHeader, DialogContent, DialogFooter, DialogTitle, DialogDescription } from '@xorigo-ui/core'

function Example() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen} variant="default" size="md">
      <DialogHeader>
        <DialogTitle>确认删除</DialogTitle>
        <DialogDescription>
          此操作不可撤销，确定要删除吗？
        </DialogDescription>
      </DialogHeader>

      <DialogContent>
        <p>删除后将无法恢复数据。</p>
      </DialogContent>

      <DialogFooter>
        <button onClick={() => setOpen(false)}>取消</button>
        <button onClick={() => setOpen(false)}>确认删除</button>
      </DialogFooter>
    </Dialog>
  )
}
```

### Drawer 抽屉
侧边抽屉，用于次要操作或大量内容展示。

**特性**：
- ✅ 4个方向：top, bottom, left, right
- ✅ 4种尺寸：sm, md, lg, xl
- ✅ 手势滑动关闭（移动端）
- ✅ 流畅滑入/滑出动画
- ✅ ESC键关闭
- ✅ 点击遮罩关闭

**基本用法**：
```tsx
import { Drawer, DrawerHeader, DrawerContent, DrawerFooter, DrawerTitle } from '@xorigo-ui/core'

function Example() {
  const [open, setOpen] = useState(false)

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      placement="right"
      size="md"
      swipeable={true}
    >
      <DrawerHeader>
        <DrawerTitle>设置</DrawerTitle>
      </DrawerHeader>

      <DrawerContent>
        <div>设置内容...</div>
      </DrawerContent>

      <DrawerFooter>
        <button onClick={() => setOpen(false)}>关闭</button>
      </DrawerFooter>
    </Drawer>
  )
}
```

### Popover 弹出框
弹出提示框，用于补充信息或快捷操作。

**特性**：
- ✅ 4种变体：default, card, dropdown, tooltip
- ✅ 4个位置：top, bottom, left, right
- ✅ 智能位置自动调整
- ✅ 点击外部关闭
- ✅ 延迟显示/隐藏
- ✅ 箭头指示器

**基本用法**：
```tsx
import { Popover, PopoverTrigger, PopoverContent } from '@xorigo-ui/core'

function Example() {
  const [open, setOpen] = useState(false)

  return (
    <Popover
      open={open}
      onOpenChange={setOpen}
      position="top"
      variant="default"
      delay={100}
    >
      <PopoverTrigger>
        <button>触发按钮</button>
      </PopoverTrigger>

      <PopoverContent>
        <div className="p-4">
          <h3>标题</h3>
          <p>弹出框内容</p>
        </div>
      </PopoverContent>
    </Popover>
  )
}
```

## 🎨 组件变体

### Dialog 变体
- `default`: 默认样式
- `destructive`: 危险操作（红色主题）
- `warning`: 警告提示（橙色主题）
- `success`: 成功提示（绿色主题）

### Drawer 方向
- `left`: 从左侧滑入
- `right`: 从右侧滑入
- `top`: 从顶部滑入
- `bottom`: 从底部滑入

### Popover 变体
- `default`: 默认弹出框样式
- `card`: 卡片样式，带阴影
- `dropdown`: 下拉菜单样式
- `tooltip`: 工具提示样式

## 🔧 高级配置

### 焦点管理
所有组件都提供完整的焦点管理：
- 打开时自动聚焦到内容区域
- 关闭时恢复到触发元素
- 支持Tab键导航
- 支持焦点陷阱（模态组件）

### 可访问性
完整的ARIA支持：
- `role="dialog"` 和 `aria-modal`
- `aria-labelledby` 和 `aria-describedby`
- 键盘导航支持
- 屏幕阅读器友好

### 动画配置
使用Framer Motion提供流畅动画：
- 可自定义动画时长和缓动函数
- 支持不同的进入/退出动画
- 性能优化的动画实现

## 📋 API 参考

### Dialog Props
| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| open | boolean | - | 控制对话框打开状态 |
| onOpenChange | (open: boolean) => void | - | 打开状态变化回调 |
| variant | 'default' \| 'destructive' \| 'warning' \| 'success' | 'default' | 对话框变体 |
| size | 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' | 'md' | 对话框尺寸 |
| modal | boolean | true | 是否为模态对话框 |
| maskClosable | boolean | true | 点击遮罩是否关闭 |
| closeOnEscape | boolean | true | ESC键是否关闭 |

### Drawer Props
| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| open | boolean | - | 控制抽屉打开状态 |
| onOpenChange | (open: boolean) => void | - | 打开状态变化回调 |
| placement | 'left' \| 'right' \| 'top' \| 'bottom' | 'right' | 抽屉弹出方向 |
| size | 'sm' \| 'md' \| 'lg' \| 'xl' | 'md' | 抽屉尺寸 |
| swipeable | boolean | true | 是否支持手势滑动 |
| swipeThreshold | number | 50 | 滑动关闭阈值 |

### Popover Props
| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| open | boolean | - | 控制弹出框打开状态 |
| onOpenChange | (open: boolean) => void | - | 打开状态变化回调 |
| position | 'top' \| 'bottom' \| 'left' \| 'right' | 'bottom' | 弹出位置 |
| variant | 'default' \| 'card' \| 'dropdown' \| 'tooltip' | 'default' | 弹出框变体 |
| showArrow | boolean | true | 是否显示箭头 |
| delay | number | 0 | 延迟显示时间(ms) |

## 🎯 最佳实践

### 1. 使用场景
- **Dialog**: 重要操作确认、表单填写、详细信息展示
- **Drawer**: 次要操作、设置面板、大量内容展示
- **Popover**: 补充信息、快捷操作、工具提示

### 2. 性能优化
- 使用React.memo避免不必要的重渲染
- 合理设置延迟时间避免意外触发
- 在大量内容时考虑虚拟滚动

### 3. 可访问性
- 始终提供语义化的标题和描述
- 确保键盘操作路径完整
- 测试屏幕阅读器兼容性

## 🧪 测试

运行测试示例：
```bash
npm run dev
# 访问 http://localhost:3100 查看组件示例
```

## 🔗 相关链接

- [Xorigo UI 白皮书 v1.0](../../docs/whitepaper.md)
- [组件设计原则](../../docs/design-principles.md)
- [可访问性指南](../../docs/accessibility.md)
- [动画系统文档](../../docs/animations.md)

---

**版本**: 1.0.0
**更新时间**: 2024-10-13
**维护者**: Xorigo UI Team