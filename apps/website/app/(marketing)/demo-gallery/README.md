# 🎨 组件画廊临时页面

## 📍 访问地址

**临时测试地址**：
- **首页**：`http://localhost:3100/demo-gallery` （自动跳转到Button）
- **Button组件**：`http://localhost:3100/demo-gallery/button`

> **注意**：此为临时页面，测试通过后将替换现有的 `/workbench?mode=gallery`

---

## 🎯 功能特性

### 1️⃣ 页面布局
- ✅ **左侧导航**：固定宽度（256px），分组显示组件列表
- ✅ **右侧内容**：自适应宽度，瀑布流展示组件卡片
- ✅ **路由切换**：点击导航跳转到对应组件页面

### 2️⃣ 组件卡片（ComponentCard）
- ✅ **标题区**：标题 + 副标题
- ✅ **样式展示区**：始终可见，展示所有变体/尺寸/状态
- ✅ **用法代码区**：可折叠，点击"查看代码"展开
- ✅ **底部展开条**：巧妙的交互设计（参考PrismUI）

### 3️⃣ 瀑布流布局
- ✅ **响应式**：移动端1列 / 平板2列 / 桌面3列
- ✅ **自动高度**：卡片高度由内容决定
- ✅ **无截断**：使用 `break-inside-avoid-column`

### 4️⃣ 代码展示（CodeBlock）
- ✅ **语法高亮**：基础的JSX/TSX高亮
- ✅ **复制按钮**：一键复制代码
- ✅ **行号显示**：可选
- ✅ **滚动容器**：长代码可滚动

---

## 📦 新增组件

所有组件均已添加到 `@xorigo-ui/core` 包中：

### CopyButton
```tsx
import { CopyButton } from '@xorigo-ui/core'

<CopyButton text="复制的内容" />
```

**特性**：
- 多级复制降级（Clipboard API → execCommand → 静默降级）
- 状态反馈（复制中 → 成功/失败）
- 完整无障碍支持

### CodeBlock
```tsx
import { CodeBlock } from '@xorigo-ui/core'

<CodeBlock
  code={`<Button variant="primary">Click me</Button>`}
  language="tsx"
  copyable
/>
```

**特性**：
- 代码展示 + 语法高亮
- 集成复制按钮
- 行号和行高亮

### ComponentCard
```tsx
import { ComponentCard } from '@xorigo-ui/core'

<ComponentCard
  title="Variants"
  subtitle="所有外观一目了然"
  showcase={<div>样式展示区</div>}
  usage={<CodeBlock code="..." />}
/>
```

**特性**：
- 样式展示区（始终可见）
- 用法代码区（可折叠）
- 平滑动画过渡

### ComponentNav
```tsx
import { ComponentNav } from '@xorigo-ui/core'

<ComponentNav
  groups={[
    {
      name: 'Base',
      items: [
        { id: 'button', name: 'Button', description: '按钮组件' },
      ],
    },
  ]}
  activeId="button"
  onItemClick={(item) => router.push(`/gallery/${item.id}`)}
/>
```

**特性**：
- 分组导航
- 当前选中高亮
- 键盘导航支持

---

## 🧪 测试清单

### 布局测试
- [ ] 左侧导航固定显示
- [ ] 右侧内容区自适应宽度
- [ ] 瀑布流在不同屏宽正常（1/2/3列）
- [ ] 卡片无截断现象

### 交互测试
- [ ] 点击导航跳转到对应组件
- [ ] 当前组件高亮显示
- [ ] 点击"查看代码"展开/收起
- [ ] 展开/收起动画流畅

### 功能测试
- [ ] 复制按钮能正常复制代码
- [ ] 复制成功显示"已复制"
- [ ] 复制失败静默降级（无错误提示）
- [ ] 所有Button变体正常显示

### 响应式测试
- [ ] 桌面端（≥1024px）：3列瀑布流
- [ ] 平板端（768px-1024px）：2列瀑布流
- [ ] 移动端（<768px）：1列瀑布流

### 无障碍测试
- [ ] 键盘可导航（Tab键）
- [ ] Enter/Space触发按钮
- [ ] aria-expanded状态正确
- [ ] 焦点状态清晰可见

---

## 🔧 开发说明

### 启动开发服务器
```bash
# 使用Docker热更新（推荐）
npm run docker:dev

# 访问临时画廊
open http://localhost:3100/demo-gallery
```

### 添加新组件页面
1. 创建目录：`apps/website/app/(marketing)/demo-gallery/[component]/`
2. 创建页面：`page.tsx`
3. 参考Button页面的实现
4. 在 `layout.tsx` 中添加导航项

### 目录结构
```
demo-gallery/
├── layout.tsx          # 画廊布局（左侧导航 + 右侧内容）
├── page.tsx            # 首页（重定向到Button）
├── button/
│   └── page.tsx        # Button组件页面
├── card/               # 待添加
├── input/              # 待添加
└── README.md           # 本文档
```

---

## 🚀 后续计划

### 阶段1：测试验证（当前）
- [x] 创建临时页面 `/demo-gallery`
- [ ] 测试所有功能特性
- [ ] 验证响应式布局
- [ ] 检查无障碍支持

### 阶段2：完善优化
- [ ] 添加更多组件页面（Card、Input、Modal等）
- [ ] 优化代码高亮（升级到shiki）
- [ ] 添加搜索功能
- [ ] 添加主题切换

### 阶段3：正式替换
- [ ] 将 `/demo-gallery` 内容迁移到 `/workbench?mode=gallery`
- [ ] 删除临时页面
- [ ] 更新文档

---

## 📝 技术栈

- **React 19** + **TypeScript 5.9**
- **Next.js 15** (App Router)
- **Tailwind CSS 4** (主题令牌)
- **Framer Motion 12** (动画)
- **@xorigo-ui/core** (组件库)

---

## ⚠️ 注意事项

1. **临时页面**：此页面仅用于测试，测试通过后将替换现有的gallery
2. **路径冲突**：`/gallery` 已被重定向到 `/workbench?mode=gallery`
3. **组件依赖**：确保 `@xorigo-ui/core` 已正确构建
4. **Docker开发**：必须使用Docker热更新容器（禁止 `npm run dev`）

---

**维护者**: Xorigo UI Team
**创建时间**: 2025-10-17
**状态**: 🚧 测试中
