# 049 - Xorigo UI 组件增强规划

**基于**: shadcn/ui, MagicUI, dub.sh 等优秀项目的设计理念
**日期**: 2025-10-11
**状态**: 规划中

---

## 📋 概述

本文档基于 shadcn/ui、MagicUI、dub.sh 等业界优秀项目的设计理念，规划 Xorigo UI 组件库的增强方向。我们将聚焦于：

1. **高级交互组件** - Command Palette、Combobox、DataTable
2. **增强现有组件** - 为已有组件添加更多变体和演示
3. **设计模式优化** - 采用 shadcn/ui 的"复制粘贴"理念，强调组件的可定制性

---

## 🎯 核心设计理念

### 1. shadcn/ui 理念

**不是组件库，而是组件集合**：
- ✅ 组件代码完全透明，用户可以自由修改
- ✅ 基于 Radix UI 等优秀基础库，确保可访问性
- ✅ 使用 Tailwind CSS，保持样式的一致性和可定制性
- ✅ TypeScript 优先，完整的类型支持

**应用到 Xorigo UI**：
- 保持组件的简洁性和可定制性
- 提供完整的源代码和文档
- 强调组件的组合性而非大而全

### 2. MagicUI 理念

**精妙的动画和交互**：
- ✅ Framer Motion 驱动的流畅动画
- ✅ 微交互细节（hover、focus、active 状态）
- ✅ 视觉反馈的即时性
- ✅ 动画的性能优化

**应用到 Xorigo UI**：
- 已经集成 Framer Motion 12
- 需要为更多组件添加细腻的动画
- 优化现有动画的性能

### 3. dub.sh 理念

**简洁现代的 UI/UX**：
- ✅ 清晰的视觉层次
- ✅ 合理的空间使用
- ✅ 一致的设计语言
- ✅ 响应式优先

---

## 🆕 需要添加的新组件

### 1. Command 组件（高优先级）

**功能**：命令面板/快速搜索

**参考**: shadcn/ui Command, cmdk

**核心特性**：
- 快速搜索和过滤
- 键盘导航（↑↓ 选择，Enter 确认，Esc 关闭）
- 分组显示
- 支持快捷键（如 ⌘K 或 Ctrl+K 唤起）
- 模糊搜索

**技术栈**：
```typescript
// 基础组件结构
<Command>
  <CommandInput placeholder="搜索..." />
  <CommandList>
    <CommandEmpty>未找到结果</CommandEmpty>
    <CommandGroup heading="建议">
      <CommandItem onSelect={...}>日历</CommandItem>
      <CommandItem onSelect={...}>设置</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="最近使用">
      <CommandItem>...</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>
```

**实现优先级**: ⭐⭐⭐⭐⭐

**预计工时**: 6-8 小时

**依赖**:
- 需要集成 [cmdk](https://github.com/pacocoursey/cmdk) 库
- 或自行实现搜索和键盘导航逻辑

---

### 2. Combobox 组件（高优先级）

**功能**：可搜索的下拉选择器

**参考**: shadcn/ui Combobox

**核心特性**：
- 结合 Input + Dropdown 的功能
- 实时搜索过滤
- 支持单选/多选
- 键盘导航
- 自定义渲染项

**技术栈**：
```typescript
// 基于 Command + Popover 组合
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" role="combobox">
      {value ? items.find(i => i.value === value)?.label : "选择..."}
      <ChevronsUpDown className="ml-2" />
    </Button>
  </PopoverTrigger>
  <PopoverContent>
    <Command>
      <CommandInput placeholder="搜索..." />
      <CommandList>
        <CommandEmpty>未找到结果</CommandEmpty>
        <CommandGroup>
          {items.map(item => (
            <CommandItem key={item.value} onSelect={...}>
              <Check className={value === item.value ? "opacity-100" : "opacity-0"} />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
```

**实现优先级**: ⭐⭐⭐⭐⭐

**预计工时**: 4-6 小时

**依赖**:
- Command 组件
- Popover 组件（已有）

---

### 3. DataTable 组件（高优先级）

**功能**：高级数据表格

**参考**: shadcn/ui DataTable, TanStack Table

**核心特性**：
- 排序（单列/多列）
- 过滤（列级别）
- 分页
- 行选择（单选/多选）
- 列可见性控制
- 自定义单元格渲染
- 响应式设计
- 虚拟滚动（可选，用于大数据集）

**技术栈**：
```typescript
// 基于 TanStack Table v8
import { useReactTable, getCoreRowModel, ... } from '@tanstack/react-table'

// 列定义
const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => <Checkbox ... />,
    cell: ({ row }) => <Checkbox ... />
  },
  {
    accessorKey: "email",
    header: ({ column }) => <Button onClick={() => column.toggleSorting()}>邮箱</Button>,
    cell: ({ row }) => row.getValue("email")
  },
  {
    id: "actions",
    cell: ({ row }) => <DropdownMenu>...</DropdownMenu>
  }
]

// 表格组件
<DataTable columns={columns} data={data} />
```

**高级功能**：
- DataTablePagination - 分页控制
- DataTableViewOptions - 列可见性切换
- DataTableToolbar - 工具栏（搜索、过滤）
- DataTableFacetedFilter - 多选过滤

**实现优先级**: ⭐⭐⭐⭐⭐

**预计工时**: 10-12 小时

**依赖**:
- `@tanstack/react-table` (需要安装)
- DropdownMenu 组件（已有）
- Checkbox 组件（已有）
- Button 组件（已有）

---

### 4. Menubar 组件（中优先级）

**功能**：菜单栏（类似应用程序顶部菜单）

**参考**: shadcn/ui Menubar

**核心特性**：
- 水平菜单布局
- 嵌套子菜单
- 键盘导航
- 分隔符和标签
- 快捷键显示

**实现优先级**: ⭐⭐⭐

**预计工时**: 4-6 小时

---

### 5. ContextMenu 组件（中优先级）

**功能**：右键上下文菜单

**参考**: shadcn/ui ContextMenu

**核心特性**：
- 右键触发
- 位置智能定位
- 嵌套子菜单
- 快捷键显示

**实现优先级**: ⭐⭐⭐

**预计工时**: 3-4 小时

---

### 6. Calendar 组件（中优先级）

**功能**：日历选择器

**参考**: shadcn/ui Calendar, react-day-picker

**核心特性**：
- 单日选择
- 日期范围选择
- 多日选择
- 禁用日期
- 月份/年份选择器
- 国际化支持

**实现优先级**: ⭐⭐⭐

**预计工时**: 6-8 小时

**依赖**:
- `react-day-picker` (需要安装)
- `date-fns` (需要安装)

---

### 7. DatePicker 组件（中优先级）

**功能**：日期选择器（Input + Calendar）

**参考**: shadcn/ui DatePicker

**核心特性**：
- 日期输入框
- 日历弹出层
- 日期范围选择
- 预设日期快捷选项
- 格式化显示

**实现优先级**: ⭐⭐⭐

**预计工时**: 4-6 小时

**依赖**:
- Calendar 组件
- Popover 组件（已有）

---

### 8. Collapsible 组件（低优先级）

**功能**：可折叠内容区域

**参考**: shadcn/ui Collapsible

**核心特性**：
- 展开/折叠动画
- 触发器自定义
- 可访问性支持

**实现优先级**: ⭐⭐

**预计工时**: 2-3 小时

---

### 9. HoverCard 组件（低优先级）

**功能**：悬停卡片（类似 Twitter 用户卡片）

**参考**: shadcn/ui HoverCard

**核心特性**：
- 悬停延迟触发
- 自定义内容
- 智能定位

**实现优先级**: ⭐⭐

**预计工时**: 3-4 小时

---

### 10. ScrollArea 组件（低优先级）

**功能**：自定义滚动条

**参考**: shadcn/ui ScrollArea

**核心特性**：
- 样式化滚动条
- 水平/垂直滚动
- 响应式

**实现优先级**: ⭐⭐

**预计工时**: 2-3 小时

---

## 🔧 现有组件增强

### 1. Button 组件

**当前状态**: 基础变体已完成

**需要增强**：
- ✅ 添加 loading 状态的 spinner 动画
- ✅ 添加 icon-only 变体
- ✅ 添加按钮组（ButtonGroup）
- ✅ 添加更多尺寸变体（xs, 2xl）
- ✅ 添加 ghost 和 link 变体

**演示增强**：
```typescript
// 新增演示
<ButtonDemo>
  <Button loading>Loading...</Button>
  <Button leftIcon={<Icon />}>Left Icon</Button>
  <Button rightIcon={<Icon />}>Right Icon</Button>
  <ButtonGroup>
    <Button>First</Button>
    <Button>Second</Button>
    <Button>Third</Button>
  </ButtonGroup>
</ButtonDemo>
```

---

### 2. Card 组件

**当前状态**: 基础组件已完成

**需要增强**：
- ✅ 添加 hover 效果（阴影、边框高亮）
- ✅ 添加可点击卡片变体
- ✅ 添加 loading skeleton 状态
- ✅ 添加图片卡片变体

**演示增强**：
```typescript
<CardDemo>
  <Card hoverable onClick={...}>
    <CardImage src="..." />
    <CardHeader>...</CardHeader>
    <CardContent>...</CardContent>
    <CardFooter>...</CardFooter>
  </Card>

  <Card loading>
    <Skeleton height={200} />
    <Skeleton height={20} />
  </Card>
</CardDemo>
```

---

### 3. Modal/Dialog 组件

**当前状态**: 基础功能已完成

**需要增强**：
- ✅ 添加多种尺寸（sm, md, lg, xl, full）
- ✅ 添加确认对话框变体（AlertDialog）
- ✅ 添加抽屉式对话框（Drawer）
- ✅ 优化进入/退出动画

**演示增强**：
```typescript
<ModalDemo>
  <AlertDialog
    title="确认删除"
    description="此操作无法撤销"
    onConfirm={...}
    onCancel={...}
  />

  <Drawer position="right" open={...}>
    <DrawerHeader>...</DrawerHeader>
    <DrawerContent>...</DrawerContent>
  </Drawer>
</ModalDemo>
```

---

### 4. Input 组件

**当前状态**: 基础输入框已完成

**需要增强**：
- ✅ 添加前缀/后缀图标支持
- ✅ 添加清除按钮
- ✅ 添加密码显示/隐藏切换
- ✅ 添加搜索输入框变体
- ✅ 添加数字输入框（InputNumber）

**演示增强**：
```typescript
<InputDemo>
  <Input leftIcon={<SearchIcon />} placeholder="搜索..." />
  <Input rightIcon={<ClearIcon />} clearable />
  <PasswordInput />
  <InputNumber min={0} max={100} step={5} />
</InputDemo>
```

---

### 5. Select 组件

**当前状态**: 基础选择器已完成

**需要增强**：
- ✅ 添加多选支持
- ✅ 添加搜索功能
- ✅ 添加分组选项
- ✅ 添加自定义选项渲染
- ✅ 添加标签模式（TagSelect）

---

### 6. Avatar 组件

**当前状态**: 基础头像已完成

**需要增强**：
- ✅ 添加头像组（AvatarGroup）
- ✅ 添加在线状态指示器
- ✅ 添加徽章支持
- ✅ 添加上传功能（AvatarUpload）

---

### 7. Badge 组件

**当前状态**: 基础徽章已完成

**需要增强**：
- ✅ 添加点状徽章（dot variant）
- ✅ 添加可关闭徽章
- ✅ 添加动画效果（pulse, bounce）
- ✅ 添加徽章定位容器（BadgeWrapper）

---

### 8. Tabs 组件

**当前状态**: 基础标签页已完成

**需要增强**：
- ✅ 添加卡片式标签页
- ✅ 添加垂直标签页
- ✅ 添加可滚动标签页
- ✅ 添加可关闭标签页
- ✅ 添加标签页动画（滑动指示器）

---

## 📊 组件优先级矩阵

| 组件 | 业务价值 | 实现难度 | 优先级 | 预计工时 |
|------|---------|---------|--------|---------|
| Command | ⭐⭐⭐⭐⭐ | 中 | 高 | 6-8h |
| Combobox | ⭐⭐⭐⭐⭐ | 中 | 高 | 4-6h |
| DataTable | ⭐⭐⭐⭐⭐ | 高 | 高 | 10-12h |
| DatePicker | ⭐⭐⭐⭐ | 中 | 中 | 4-6h |
| Calendar | ⭐⭐⭐⭐ | 中 | 中 | 6-8h |
| Menubar | ⭐⭐⭐ | 中 | 中 | 4-6h |
| ContextMenu | ⭐⭐⭐ | 低 | 中 | 3-4h |
| Collapsible | ⭐⭐ | 低 | 低 | 2-3h |
| HoverCard | ⭐⭐ | 低 | 低 | 3-4h |
| ScrollArea | ⭐⭐ | 低 | 低 | 2-3h |

---

## 🎨 设计模式建议

### 1. 组合模式（Compound Components）

**推荐用于**: Card, Modal, Command, DataTable

**示例**：
```typescript
// ❌ 不好的设计：所有配置通过 props
<Card
  title="标题"
  description="描述"
  footer={<Button>操作</Button>}
  image="..."
/>

// ✅ 好的设计：组合式 API
<Card>
  <CardImage src="..." />
  <CardHeader>
    <CardTitle>标题</CardTitle>
    <CardDescription>描述</CardDescription>
  </CardHeader>
  <CardContent>
    内容
  </CardContent>
  <CardFooter>
    <Button>操作</Button>
  </CardFooter>
</Card>
```

**优势**：
- 灵活性高
- 代码可读性强
- 易于扩展

---

### 2. Render Props 模式

**推荐用于**: DataTable, Select, Combobox

**示例**：
```typescript
<DataTable
  data={data}
  columns={columns}
  renderRow={(row) => (
    <TableRow key={row.id}>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.email}</TableCell>
    </TableRow>
  )}
  renderEmpty={() => (
    <div>暂无数据</div>
  )}
/>
```

---

### 3. Controlled/Uncontrolled 双模式

**推荐用于**: 所有表单组件

**示例**：
```typescript
// Uncontrolled - 组件自己管理状态
<Input defaultValue="初始值" />

// Controlled - 外部控制状态
<Input value={value} onChange={setValue} />
```

---

### 4. 变体系统（Variants）

**推荐用于**: 所有 UI 组件

**使用 cva (class-variance-authority)**：
```typescript
import { cva } from 'class-variance-authority'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-blue-600 text-white hover:bg-blue-700',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
        outline: 'border border-gray-300 bg-transparent hover:bg-gray-50'
      },
      size: {
        sm: 'h-8 px-3 text-sm',
        md: 'h-10 px-4 text-base',
        lg: 'h-12 px-6 text-lg'
      }
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md'
    }
  }
)
```

---

## 📝 文档和演示增强

### 1. 每个组件需要的文档

**基础部分**：
- [ ] 组件描述
- [ ] 安装说明
- [ ] 基本用法示例
- [ ] Props API 文档
- [ ] TypeScript 类型定义

**高级部分**：
- [ ] 可访问性说明（ARIA 属性）
- [ ] 键盘导航指南
- [ ] 主题定制方法
- [ ] 最佳实践
- [ ] 常见问题（FAQ）

---

### 2. 演示页面结构

**推荐结构**：
```typescript
// 每个组件的演示页面
<ComponentDemo>
  {/* 1. 基础用法 */}
  <Section title="基础用法">
    <BasicExample />
  </Section>

  {/* 2. 变体展示 */}
  <Section title="变体">
    <VariantsExample />
  </Section>

  {/* 3. 尺寸 */}
  <Section title="尺寸">
    <SizesExample />
  </Section>

  {/* 4. 状态 */}
  <Section title="状态">
    <StatesExample />
  </Section>

  {/* 5. 高级用法 */}
  <Section title="高级用法">
    <AdvancedExample />
  </Section>

  {/* 6. 可访问性 */}
  <Section title="可访问性">
    <AccessibilityExample />
  </Section>
</ComponentDemo>
```

---

## 🚀 实施计划

### Phase 1: 高优先级组件（2-3 周）

**Week 1-2**:
1. Command 组件 (6-8h)
2. Combobox 组件 (4-6h)
3. 测试和文档

**Week 2-3**:
1. DataTable 组件 (10-12h)
2. 测试和文档
3. 演示页面优化

### Phase 2: 现有组件增强（1-2 周）

**Week 4**:
1. Button 组件增强
2. Card 组件增强
3. Input 组件增强
4. Modal 组件增强

**Week 5**:
1. Select 组件增强
2. Avatar 组件增强
3. Badge 组件增强
4. Tabs 组件增强

### Phase 3: 中优先级组件（2-3 周）

**Week 6-7**:
1. Calendar 组件 (6-8h)
2. DatePicker 组件 (4-6h)
3. Menubar 组件 (4-6h)
4. 测试和文档

**Week 7-8**:
1. ContextMenu 组件 (3-4h)
2. 其他中低优先级组件
3. 文档和演示完善

### Phase 4: 文档和优化（1 周）

**Week 9**:
1. 完善所有组件文档
2. 优化演示页面
3. 可访问性测试
4. 性能优化
5. 准备发布

---

## 📦 需要安装的依赖

```json
{
  "dependencies": {
    "@tanstack/react-table": "^8.20.0",
    "cmdk": "^1.0.0",
    "react-day-picker": "^9.0.0",
    "date-fns": "^3.0.0"
  }
}
```

---

## 🎯 成功指标

### 组件完成度
- [ ] 10+ 高级组件实现
- [ ] 所有组件支持亮暗主题
- [ ] 所有组件支持响应式
- [ ] 所有组件通过可访问性测试

### 文档质量
- [ ] 100% 组件有完整文档
- [ ] 100% 组件有交互式演示
- [ ] 提供迁移指南（从其他库）
- [ ] 提供最佳实践文档

### 开发体验
- [ ] 完整的 TypeScript 类型支持
- [ ] 清晰的 API 设计
- [ ] 良好的错误提示
- [ ] 快速的构建速度

### 用户体验
- [ ] 流畅的动画效果
- [ ] 一致的交互模式
- [ ] 优秀的性能表现
- [ ] 完整的键盘导航支持

---

## 🔗 参考资源

### 设计系统参考
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Headless UI](https://headlessui.com/)
- [Chakra UI](https://chakra-ui.com/)

### 动画参考
- [Framer Motion](https://www.framer.com/motion/)
- [React Spring](https://react-spring.dev/)
- [Auto Animate](https://auto-animate.formkit.com/)

### 表格参考
- [TanStack Table](https://tanstack.com/table)
- [AG Grid](https://www.ag-grid.com/)

### 最佳实践
- [Accessible Components](https://www.accessibility-developer-guide.com/)
- [WAI-ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)

---

**维护者**: Xorigo UI Team
**最后更新**: 2025-10-11
