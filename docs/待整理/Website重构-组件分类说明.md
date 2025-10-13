# 📂 Website 重构 - 组件分类说明

> **基于**: [Xorigo UI 组件分类体系白皮书 v1.0](./Xorigo UI 组件分类体系白皮书.md)
> **适用于**: Website 展示层架构、导航设计、Registry 映射
> **版本**: v1.0
> **最后更新**: 2025-10-13

---

## 📋 目录

1. [核心原则](#核心原则)
2. [10个组件分类](#10个组件分类)
3. [七轴映射](#七轴映射)
4. [Website 路由映射](#website-路由映射)
5. [Registry 字段映射](#registry-字段映射)
6. [分类治理规则](#分类治理规则)
7. [实施清单](#实施清单)

---

## 🎯 核心原则

### 1. **唯一归属原则**
- ✅ 每个组件**只属于一个主分类**
- ✅ 避免多处出现同一组件
- ✅ 分类仅用于**语义归档**与**站点导航**

### 2. **三层结构**
```yaml
components:      # 10个基础组件分类（核心）
  - ui
  - inputs
  - forms
  - navigation
  - layout
  - feedback
  - overlays
  - datadisplay
  - charts
  - utilities

patterns:        # 复合场景模板（可拷）
tokens:          # 设计语义令牌
i18n:            # 国际化工具
```

### 3. **边界约定**
- **patterns**: 复合场景组件，不单独归类
- **tokens**: 设计语义，非业务组件
- **utilities**: 技术基元，不对外展示为"业务组件"

---

## 📦 10个组件分类

### 1. **ui** - 基础UI（视觉原子）
**定位**: 最基础的视觉构建块

**组件清单** (14个):
```yaml
ui:
  - Button          # 按钮
  - Icon            # 图标
  - Typography      # 排版
  - Avatar          # 头像
  - AvatarGroup     # 头像组
  - Badge           # 徽章
  - Divider         # 分割线
  - Separator       # 分隔符
  - ScrollArea      # 滚动区域
  - Kbd             # 键盘按键
  - Code            # 代码块
  - Surface         # 表层容器
```

**特点**:
- ✅ 最基础的 UI 构建块
- ✅ 不可再分的功能单元
- ✅ 强复用性，上下文无关

---

### 2. **inputs** - 输入控件
**定位**: 所有表单输入交互组件

**组件清单** (19个):
```yaml
inputs:
  - Input             # 文本输入
  - Textarea          # 多行文本
  - NumberInput       # 数字输入
  - MaskedInput       # 掩码输入
  - Select            # 下拉选择
  - Combobox          # 组合框
  - Checkbox          # 复选框
  - Radio             # 单选框
  - Switch            # 开关
  - ToggleGroup       # 切换组
  - SegmentedControl  # 分段控件
  - Slider            # 滑块
  - Rating            # 评分
  - DatePicker        # 日期选择
  - DateRangePicker   # 日期区间选择
  - TimePicker        # 时间选择
  - Calendar          # 日历
  - ColorPicker       # 颜色选择
  - FileUpload        # 文件上传
  - PinInput          # PIN码输入
```

**特点**:
- ✅ 单一职责：数据采集
- ✅ 与 forms 分类配合使用
- ✅ 支持受控/非受控模式

---

### 3. **forms** - 表单容器/逻辑
**定位**: 表单组合、布局、验证逻辑

**组件清单** (7个):
```yaml
forms:
  - Form                # 表单容器
  - FormField           # 表单字段
  - Fieldset            # 字段集
  - InputGroup          # 输入组
  - ValidationMessage   # 验证消息
  - FormList            # 表单列表
  - FormLayout          # 表单布局
```

**特点**:
- ✅ 表单级别的组合容器
- ✅ 验证逻辑封装
- ✅ 布局和排列控制

---

### 4. **navigation** - 导航与结构
**定位**: 页面导航、菜单、工具栏

**组件清单** (13个):
```yaml
navigation:
  - Tabs            # 标签页
  - Breadcrumb      # 面包屑
  - Pagination      # 分页
  - Menu            # 菜单
  - DropdownMenu    # 下拉菜单
  - ContextMenu     # 右键菜单
  - CommandPalette  # 命令面板
  - Toolbar         # 工具栏
  - Tree            # 树形导航
  - Navbar          # 导航栏
  - Sidebar         # 侧边栏
  - Stepper         # 步进器
```

**特点**:
- ✅ 用户导航主要手段
- ✅ 结构化信息架构
- ✅ 路由和状态管理集成

---

### 5. **layout** - 布局与分区
**定位**: 页面布局、栅格系统、空间分配

**组件清单** (12个):
```yaml
layout:
  - Container        # 容器
  - Grid             # 栅格
  - Flex             # 弹性布局
  - Stack            # 堆叠布局
  - Section          # 区块
  - Spacer           # 间距占位
  - SplitView        # 分割视图
  - ResizablePanel   # 可调整面板
  - Masonry          # 瀑布流
  - AspectRatio      # 宽高比
  - AppShell         # 应用外壳
```

**特点**:
- ✅ 响应式布局支持
- ✅ 栅格系统完整
- ✅ 空间分配精确控制

---

### 6. **feedback** - 反馈与状态
**定位**: 用户操作反馈、加载状态、提示

**组件清单** (8个):
```yaml
feedback:
  - Alert          # 警告框
  - Toast          # 轻提示
  - Notification   # 通知
  - Progress       # 进度条
  - Spinner        # 加载旋转
  - Skeleton       # 骨架屏
  - Tooltip        # 工具提示
  - Result         # 结果页
```

**特点**:
- ✅ 用户操作即时反馈
- ✅ 异步加载状态展示
- ✅ 辅助信息提示

---

### 7. **overlays** - 弹层与遮罩
**定位**: 模态对话框、抽屉、浮层

**组件清单** (8个):
```yaml
overlays:
  - Modal          # 模态框
  - Dialog         # 对话框
  - Drawer         # 抽屉
  - Sheet          # 底部弹层
  - Popover        # 气泡弹出
  - HoverCard      # 悬浮卡片
  - Lightbox       # 灯箱
  - OverlayTrigger # 弹层触发器
```

**Overlay 协议** (必须符合):
- ✅ 焦点环回退（ESC 关闭）
- ✅ 滚动锁定
- ✅ aria-hidden / inert 支持
- ✅ Z-Layer 层级规约

**特点**:
- ✅ 临时信息展示
- ✅ 模态/非模态支持
- ✅ 严格可访问性要求

---

### 8. **datadisplay** - 数据展示
**定位**: 结构化数据呈现、卡片、列表

**组件清单** (12个):
```yaml
datadisplay:
  - Card             # 卡片
  - List             # 列表
  - Table            # 表格
  - TreeTable        # 树形表格
  - Tag              # 标签
  - Statistic        # 统计数值
  - Timeline         # 时间轴
  - Accordion        # 折叠面板
  - EmptyState       # 空状态
  - DescriptionList  # 描述列表
  - Carousel         # 轮播
```

**与 layout 的边界**:
- ✅ `Card/Table/List` → **datadisplay**
- ✅ `Container/Grid/Flex` → **layout**

---

### 9. **charts** - 数据可视化
**定位**: 图表组件、数据可视化抽象层

**组件清单** (12个):
```yaml
charts:
  - Axis          # 坐标轴
  - Legend        # 图例
  - ChartTooltip  # 图表提示（避免与 Tooltip 冲突）
  - LineChart     # 折线图
  - BarChart      # 柱状图
  - PieChart      # 饼图
  - AreaChart     # 面积图
  - RadarChart    # 雷达图
  - ScatterChart  # 散点图
  - GaugeChart    # 仪表盘
  - Heatmap       # 热力图
```

**命名规范**:
- ✅ `ChartTooltip` 避免与 `feedback.Tooltip` 冲突
- ✅ 基础抽象组件：Axis、Legend、ChartTooltip
- ✅ 常用图表组件：LineChart、BarChart 等

---

### 10. **utilities** - 技术基元
**定位**: 可达性工具、SSR 边界、技术实现

**组件清单** (11个):
```yaml
utilities:
  - Portal                # 传送门
  - FocusTrap             # 焦点陷阱
  - FocusScope            # 焦点域
  - DismissableLayer      # 可关闭层
  - ScrollLock            # 滚动锁
  - VisuallyHidden        # 视觉隐藏
  - ResizeObserver        # 尺寸观察器
  - IntersectionObserver  # 交叉观察器
  - SSRBoundary           # SSR 边界
  - ThemeProvider         # 主题提供者
```

**特殊处理**:
- ✅ **不在核心导航展示**
- ✅ 技术性组件，非业务组件
- ✅ 在 API 搜索中可见
- ✅ 文档可查，但默认隐藏

---

## 🧭 七轴映射

基于 Xorigo UI 七轴架构，将10个分类映射到7个轴：

| 七轴 | 覆盖分类 | 说明 |
|------|----------|------|
| **呈现（UI）** | ui, datadisplay, overlays, charts | 视觉呈现相关 |
| **行为（Interaction）** | inputs, forms, feedback | 用户交互相关 |
| **结构（Structure）** | layout, navigation | 页面结构相关 |
| **复合（Composition）** | patterns | 复合场景模板 |
| **语义（Design Tokens）** | tokens | 设计令牌系统 |
| **逻辑（Logic / Tech）** | utilities | 技术基元/逻辑 |
| **国际化（I18n）** | i18n | 国际化工具 |

**用途**:
- ✅ Docs 页面按轴切换视图
- ✅ Playground 按轴筛选组件
- ✅ 学习路径按轴组织

---

## 🗺️ Website 路由映射

### 1. **组件文档路由**
```
/docs/components/{category}/{ComponentName}

示例:
/docs/components/ui/Button
/docs/components/inputs/DateRangePicker
/docs/components/navigation/Breadcrumb
/docs/components/overlays/Modal
/docs/components/datadisplay/Card
/docs/components/charts/LineChart
/docs/components/utilities/Portal         # 可访问但不在导航显示
```

### 2. **Playground 路由**
```
/playground/{ComponentName}?variant=&density=&locale=

示例:
/playground/Button?variant=primary&density=normal&locale=zh-CN
/playground/DateRangePicker?variant=default&density=compact
```

### 3. **分类索引路由**
```
/docs/components/{category}

示例:
/docs/components/ui            # ui 分类所有组件
/docs/components/inputs        # inputs 分类所有组件
/docs/components/navigation    # navigation 分类所有组件
```

### 4. **七轴视图路由**
```
/docs/axis/{axisName}

示例:
/docs/axis/presentation        # 呈现轴（ui + datadisplay + overlays + charts）
/docs/axis/interaction         # 行为轴（inputs + forms + feedback）
/docs/axis/structure           # 结构轴（layout + navigation）
```

---

## 📋 Registry 字段映射

### Registry Schema
```typescript
interface ComponentRegistry {
  name: string                   // 组件名（PascalCase）
  title: string                  // 中文标题
  category: ComponentCategory    // 主分类（唯一）
  tags: string[]                 // 标签数组
  tokens: string[]               // 使用的设计令牌
  a11y: 'ok' | 'warn' | 'na'     // 可访问性状态
  rtl: boolean                   // RTL 支持
  i18n: string[]                 // 支持的语言
  preview: {
    module: string               // 预览模块路径
  }
}

type ComponentCategory =
  | 'ui'
  | 'inputs'
  | 'forms'
  | 'navigation'
  | 'layout'
  | 'feedback'
  | 'overlays'
  | 'datadisplay'
  | 'charts'
  | 'utilities'
```

### 示例条目
```json
{
  "name": "DateRangePicker",
  "title": "日期区间选择器",
  "category": "inputs",
  "tags": ["date", "range", "calendar"],
  "tokens": ["surface.primary", "content.muted", "focus.ring"],
  "a11y": "ok",
  "rtl": true,
  "i18n": ["en", "zh-CN"],
  "preview": {
    "module": "date-range-picker/Preview"
  }
}
```

---

## 📐 分类治理规则

### 1. **唯一归属规则**
```typescript
// ✅ 正确：组件只在一个分类中
const categories = {
  ui: ['Button', 'Icon'],
  inputs: ['Input', 'Select'],
  // ...
}

// ❌ 错误：Portal 在多个分类中
const categories = {
  overlays: ['Modal', 'Portal'],  // ❌
  utilities: ['Portal'],           // ✅ 仅保留此处
}
```

**解决方案**:
- Portal 仅保留在 `utilities`
- Overlay 组件通过 `Portal` 实现，但不重复归类

### 2. **命名规范**
```typescript
// ✅ 正确：组件名 PascalCase
'Button', 'DateRangePicker', 'ChartTooltip'

// ❌ 错误：其他命名方式
'button', 'dateRangePicker', 'chart-tooltip'

// ✅ 正确：分类名小写
'ui', 'inputs', 'datadisplay'

// ❌ 错误：分类名大写
'UI', 'Inputs', 'DataDisplay'
```

### 3. **Overlay 协议**
所有 `overlays/*` 组件必须通过以下检查：

```typescript
// Overlay 协议清单
const overlayProtocol = {
  focusManagement: {
    trapFocus: true,              // 焦点陷阱
    returnFocus: true,            // 关闭后返回焦点
    escapeClose: true,            // ESC 关闭
  },
  scrollManagement: {
    lockScroll: true,             // 滚动锁定
    preventBehind: true,          // 阻止背景滚动
  },
  accessibility: {
    ariaHidden: true,             // aria-hidden 支持
    inert: true,                  // inert 属性
    role: 'dialog',               // 正确的 ARIA 角色
  },
  layering: {
    zIndex: 'from-zLayer-stack',  // 使用 Z-Layer 系统
    backdrop: true,               // 遮罩层
  }
}
```

**CI 检查**:
```bash
# 运行 Overlay 协议检查
xorigo check:overlay

# 检查项:
# - ESC 键关闭
# - 焦点环回退
# - 滚动锁定
# - aria-hidden / inert
# - Z-Layer 层级
```

### 4. **DataDisplay vs Layout 边界**
```typescript
// ✅ datadisplay: 结构化数据呈现
datadisplay: ['Card', 'Table', 'List', 'Timeline']

// ✅ layout: 容器/分区/栅格
layout: ['Container', 'Grid', 'Flex', 'Stack']

// 判断标准:
// - 有明确数据模型 → datadisplay
// - 纯布局容器 → layout
```

### 5. **Utilities 展示策略**
```typescript
// Website 配置
const navigationConfig = {
  categories: {
    ui: { visible: true },
    inputs: { visible: true },
    // ...
    utilities: {
      visible: false,           // 默认不在导航显示
      searchable: true,         // 但可搜索
      docAccessible: true,      // 文档可直接访问
    }
  }
}
```

---

## ✅ 实施清单

### Phase 1: 基础结构（Week 1）
- [ ] **创建分类常量**
  - 文件: `src/constants/categories.ts`
  - 内容: 10个分类常量定义
  - 导出: `ComponentCategory` 类型

- [ ] **更新 Registry Schema**
  - 文件: `src/schemas/registry.schema.ts`
  - 添加: `category` 字段枚举验证
  - 添加: 唯一归属检查逻辑

- [ ] **创建分类映射工具**
  - 文件: `src/utils/category-mapper.ts`
  - 功能: 分类 → 七轴映射
  - 功能: 分类 → 路由映射

### Phase 2: 路由实现（Week 2）
- [ ] **创建分类索引页**
  - 路由: `/docs/components/[category]/page.tsx`
  - 功能: 显示该分类所有组件
  - 布局: 卡片网格 + 筛选器

- [ ] **更新侧边导航**
  - 组件: `src/components/navigation/Sidebar.tsx`
  - 功能: 按分类组织组件树
  - 功能: utilities 默认隐藏

- [ ] **创建七轴视图**
  - 路由: `/docs/axis/[axisName]/page.tsx`
  - 功能: 按轴展示组件
  - 功能: 分类聚合展示

### Phase 3: Registry 对齐（Week 2）
- [ ] **验证 Registry 一致性**
  - 脚本: `scripts/validate-categories.ts`
  - 检查: 所有组件有 `category` 字段
  - 检查: `category` 值在允许范围内
  - 检查: 唯一归属（无重复）

- [ ] **生成分类统计**
  - 脚本: `scripts/generate-category-stats.ts`
  - 输出: 每个分类的组件数量
  - 输出: 覆盖率统计

- [ ] **自动补全分类**
  - 脚本: `scripts/auto-fill-categories.ts`
  - 逻辑: 基于组件名推断分类
  - 逻辑: 需要人工确认

### Phase 4: 文档完善（Week 3）
- [ ] **为每个分类创建概述文档**
  - 文件: `/docs/components/{category}/index.mdx`
  - 内容: 分类说明、使用场景
  - 内容: 组件列表和快速链接

- [ ] **创建分类学习路径**
  - 文件: `/docs/guides/categories-guide.mdx`
  - 内容: 分类体系详解
  - 内容: 最佳实践和选择指南

- [ ] **Playground 分类筛选**
  - 组件: `src/components/playground/CategoryFilter.tsx`
  - 功能: 按分类筛选组件
  - 功能: 多选筛选支持

### Phase 5: CI/CD 集成（Week 3）
- [ ] **CI 检查脚本**
  ```bash
  # 分类一致性检查
  npm run check:categories

  # Overlay 协议检查
  npm run check:overlay

  # 文档覆盖率检查
  npm run check:docs-coverage
  ```

- [ ] **Pre-commit Hook**
  - 文件: `.husky/pre-commit`
  - 检查: Registry 分类字段完整
  - 检查: 唯一归属规则
  - 检查: 命名规范

- [ ] **PR 检查规则**
  - GitHub Action: `.github/workflows/category-check.yml`
  - 检查: 新增组件有正确分类
  - 检查: 分类变更有文档更新

---

## 📊 验收标准

### 1. **结构完整性**
- ✅ 所有10个分类目录存在
- ✅ 每个分类有 `index.mdx` 概述
- ✅ Registry 所有组件有 `category` 字段

### 2. **唯一归属**
- ✅ 零个组件在多个分类中
- ✅ `Portal` 仅在 `utilities` 分类
- ✅ 所有组件归属明确

### 3. **路由正确性**
- ✅ `/docs/components/{category}` 路由工作
- ✅ `/docs/components/{category}/{component}` 路由工作
- ✅ `/playground/{component}` 路由工作

### 4. **导航一致性**
- ✅ 侧边栏按分类组织
- ✅ `utilities` 默认隐藏但可搜索
- ✅ 七轴视图正确聚合分类

### 5. **CI 通过**
- ✅ `npm run check:categories` 通过
- ✅ `npm run check:overlay` 通过
- ✅ `npm run check:docs-coverage` 通过

---

## 🔗 相关文档

1. **[Xorigo UI 组件分类体系白皮书](./Xorigo UI 组件分类体系白皮书.md)** - 原始白皮书
2. **[Website重构架构设计方案](./Website重构架构设计方案.md)** - 架构设计
3. **[Website重构实施清单](./Website重构实施清单.md)** - 实施排期
4. **[Website-Packages 联动架构验收清单](./Website-Packages 联动架构验收清单.md)** - 验收标准

---

## 🎯 总结

### 核心要点
1. ✅ **10个基础分类**: ui, inputs, forms, navigation, layout, feedback, overlays, datadisplay, charts, utilities
2. ✅ **唯一归属原则**: 每个组件只在一个分类中
3. ✅ **七轴映射**: 10个分类映射到7个轴，支持多视角展示
4. ✅ **路由一致性**: `/docs/components/{category}/{component}` 统一路由
5. ✅ **Utilities 隐藏**: 技术组件不在核心导航，但可搜索

### 实施优先级
- **P0 (Week 1-2)**: 分类结构、路由实现、Registry 对齐
- **P1 (Week 3)**: 文档完善、CI 集成
- **P2 (后续)**: 七轴视图、高级筛选、分类统计

### 关键验收
- ✅ 所有组件正确归类
- ✅ 路由和导航工作正常
- ✅ CI 检查全部通过
- ✅ 文档覆盖率 100%

---

**最后更新**: 2025-10-13
**维护者**: Xorigo UI Architecture Team
**版本**: v1.0
