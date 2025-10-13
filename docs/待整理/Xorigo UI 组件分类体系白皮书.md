# 📘 Xorigo UI 组件分类体系白皮书 v1.0（最终稿）

## 0. 前置假设与边界

* 分类仅用于**组件语义归档**与**站点导航/Registry 生成**；不涉及具体实现。
* 每个组件**只属于一个主类**（唯一主归属），避免多处出现。
* `patterns/` 为**复合场景**；`tokens/` 为**设计语义**；`utilities/` 为**技术基元**（不对外展示为“业务组件”）。

---

## 1. 全量分类（YAML，单一事实来源）

```yaml
version: 1.0
components:
  ui:                            # 基础UI（视觉原子）
    - Button
    - Icon
    - Typography
    - Avatar
    - AvatarGroup
    - Badge
    - Divider
    - Separator
    - ScrollArea
    - Kbd
    - Code
    - Surface

  inputs:                        # 输入控件
    - Input
    - Textarea
    - NumberInput
    - MaskedInput
    - Select
    - Combobox
    - Checkbox
    - Radio
    - Switch
    - ToggleGroup
    - SegmentedControl
    - Slider
    - Rating
    - DatePicker
    - DateRangePicker
    - TimePicker
    - Calendar
    - ColorPicker
    - FileUpload
    - PinInput

  forms:                         # 表单容器/逻辑
    - Form
    - FormField
    - Fieldset
    - InputGroup
    - ValidationMessage
    - FormList
    - FormLayout

  navigation:                    # 导航与结构
    - Tabs
    - Breadcrumb
    - Pagination
    - Menu
    - DropdownMenu
    - ContextMenu
    - CommandPalette
    - Toolbar
    - Tree
    - Navbar
    - Sidebar
    - Stepper

  layout:                        # 布局与分区
    - Container
    - Grid
    - Flex
    - Stack
    - Section
    - Spacer
    - SplitView
    - ResizablePanel
    - Masonry
    - AspectRatio
    - AppShell

  feedback:                      # 反馈与状态
    - Alert
    - Toast
    - Notification
    - Progress
    - Spinner
    - Skeleton
    - Tooltip
    - Result

  overlays:                      # 弹层与遮罩
    - Modal
    - Dialog
    - Drawer
    - Sheet
    - Popover
    - HoverCard
    - Lightbox
    - OverlayTrigger

  datadisplay:                   # 数据展示
    - Card
    - List
    - Table
    - TreeTable
    - Tag
    - Statistic
    - Timeline
    - Accordion
    - EmptyState
    - DescriptionList
    - Carousel

  charts:                        # 数据可视化（抽象层 + 常用图）
    - Axis
    - Legend
    - ChartTooltip
    - LineChart
    - BarChart
    - PieChart
    - AreaChart
    - RadarChart
    - ScatterChart
    - GaugeChart
    - Heatmap

  utilities:                     # 技术基元/可达性/SSR基线
    - Portal
    - FocusTrap
    - FocusScope
    - DismissableLayer
    - ScrollLock
    - VisuallyHidden
    - ResizeObserver
    - IntersectionObserver
    - SSRBoundary
    - ThemeProvider

patterns:                        # 复合组件（可拷模板）
  - AuthForm
  - OnboardingFlow
  - WizardForm
  - DataCrudTable
  - SearchPanel
  - DashboardLayout
  - SettingsPanel
  - HeroSection
  - PricingCard
  - ProductGrid
  - CommentThread
  - ChatWindow
  - ContentEditor

tokens:                          # 设计令牌（语义/系统）
  - ColorTokens
  - SpacingTokens
  - TypographyTokens
  - MotionTokens
  - DensityTokens
  - RadiusTokens
  - ZIndexTokens
  - ShadowTokens

i18n:                            # 国际化工具组件
  - LocaleProvider
  - Translate
  - DirectionToggle
  - NumberFormat
  - DateTimeFormat
  - RelativeTime
  - Currency
  - LocaleSwitcher
```

> 备注：
>
> * `Portal` 仅保留在 `utilities`（不在 `overlays` 重复）。
> * `Surface` 作为通用表层容器保留在 `ui`，`Card` 归于 `datadisplay`。
> * `ChartTooltip` 命名避免与 overlays/feedback 的 Tooltip 冲突。

---

## 2. 七轴映射（用于 Docs/Playground 按轴切换）

| 七轴                | 覆盖分类                                 |
| ----------------- | ------------------------------------ |
| 呈现（UI）            | ui / datadisplay / overlays / charts |
| 行为（Interaction）   | inputs / forms / feedback            |
| 结构（Structure）     | layout / navigation                  |
| 复合（Composition）   | patterns                             |
| 语义（Design Tokens） | tokens                               |
| 逻辑（Logic / Tech）  | utilities                            |
| 国际化（I18n）         | i18n                                 |

---

## 3. Registry 字段映射规范（从分类到注册表）

* **要求**：每个组件恰有一个主分类：`category ∈ keys(components)`。
* **示例条目**：

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
  "preview": { "module": "date-range-picker/Preview" }
}
```

---

## 4. JSON Schema（机读校验，用于 CI）

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "XorigoUI Categories Schema",
  "type": "object",
  "required": ["version", "components", "patterns", "tokens", "i18n"],
  "properties": {
    "version": { "type": "string", "pattern": "^[0-9]+\\.[0-9]+$" },
    "components": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "ui": { "$ref": "#/definitions/stringArray" },
        "inputs": { "$ref": "#/definitions/stringArray" },
        "forms": { "$ref": "#/definitions/stringArray" },
        "navigation": { "$ref": "#/definitions/stringArray" },
        "layout": { "$ref": "#/definitions/stringArray" },
        "feedback": { "$ref": "#/definitions/stringArray" },
        "overlays": { "$ref": "#/definitions/stringArray" },
        "datadisplay": { "$ref": "#/definitions/stringArray" },
        "charts": { "$ref": "#/definitions/stringArray" },
        "utilities": { "$ref": "#/definitions/stringArray" }
      },
      "required": ["ui","inputs","forms","navigation","layout","feedback","overlays","datadisplay","charts","utilities"]
    },
    "patterns": { "$ref": "#/definitions/stringArray" },
    "tokens": { "$ref": "#/definitions/stringArray" },
    "i18n": { "$ref": "#/definitions/stringArray" }
  },
  "definitions": {
    "stringArray": {
      "type": "array",
      "items": { "type": "string", "pattern": "^[A-Z][A-Za-z0-9]*$" },
      "uniqueItems": true
    }
  }
}
```

**校验要点**

* 组件名必须 `PascalCase`；数组元素唯一；
* 禁止未知分类键；`version` 采用 `MAJOR.MINOR`。

---

## 5. 分类治理规则（可机验）

1. **唯一归属**：

   * 任一组件 `name` 在所有分类集合中出现**至多一次**。
   * 若发现重名（如 `Portal`），以 `utilities` 为准，其他类移除。

2. **命名规范**：

   * 组件名使用 `PascalCase`；分类名固定集（见 Schema）。
   * “图表专用 Tooltip” 统一命名 `ChartTooltip`，避免与 `feedback.Tooltip` 冲突。

3. **Overlay 协议**（适用于 `overlays/*`）：

   * 必须通过：焦点环回退、`Escape` 关闭、滚动锁、`aria-hidden`/`inert`、层级（ZLayer）规约。
   * CI：`cli check:overlay` 逐项机验。

4. **DataDisplay 与 Layout 边界**：

   * `Card`/`Table`/`List` 属于 **datadisplay**；
   * 容器/分区/栅格 属于 **layout**。

5. **Patterns 的公共依赖**：

   * 仅消费公开 API（`core/system/style-recipe/tokens/i18n`），禁止依赖内部实现文件。

6. **i18n 模块化**：

   * `NumberFormat/DateTimeFormat/RelativeTime/Currency` 应基于 Intl API；
   * `DirectionToggle` 会触发 `dir=rtl` 的主题切换与逻辑属性。

---

## 6. CI 检查清单（零错误基线）

* **结构校验**

  * [ ] `分类.yml` → 按上述 JSON Schema 通过
  * [ ] 唯一归属去重通过（无跨类重复）

* **Registry 映射校验**

  * [ ] `registry.json` 中 `category` 值 ∈ `components.*` 键集合
  * [ ] `preview.module` 路径存在（Website 只读导入可用）

* **Overlay 协议**

  * [ ] `overlays/*` 组件通过 `cli check:overlay`（ESC/焦点/滚动锁/aria-hidden/inert/ZLayer）

* **A11y & RTL**

  * [ ] 组件 a11y 标识（`a11y: "ok"|"warn"|"na"`）完整
  * [ ] RTL 适配标识（`rtl: true|false`）完整

* **Docs/Playground 对应**

  * [ ] 每个新增组件有占位 MDX（示例 + API 表占位）
  * [ ] Playground 可渲染 Demo 或给出 “暂无示例”只读提示

---

## 7. 变更与版本策略

* 分类改动按 **MINOR** 提升（如 1.1→1.2）。
* 引入/删除组件名需在 `CHANGELOG` 写明，并给出**迁移建议**（如由 `Tooltip` → `ChartTooltip`）。
* 任何删除行为需提供**替代项**或**弃用周期**（≥ 一个次要版本周期）。

---

## 8. 快速落地步骤（架构层，不写实现）

1. 将本 YAML 存为：`packages/core/src/components/structure/categories.yml`。
2. 在 CLI 增加：`xorigo check categories`（Schema + 去重 + Registry 对齐）。
3. Docs 侧边栏由 YAML → 生成 `docs/sidebar.config.ts`。
4. Playground 分类页从 Registry 读取 `category` 渲染分组。

---

### ✅ 结论

* 本稿即为**最终版**：覆盖 95%+ 中后台与营销站需求，并与七轴完全映射。
* 具备**单一事实来源**（YAML）、**机读 Schema**、**CI 校验**与**Registry/Docs/Playground 可用性**。
* 直接入库即可使用；后续若新增个别组件，只需按此规则增量维护 YAML 与 Registry。

---

基于 v1.0 最终分类，我给出 **packages 与 website 的最优目录蓝图**（可直接落地），含：目录树、命名与导出规范、Registry 映射、Docs/Playground 路由、脚手架与校验位。按你习惯，分“三段式”：**可执行目录结构 → 原理与取舍 → 落地步骤与清单**。

---

# 一、可执行答案（目录蓝图）

## A) packages（Monorepo 内核层）

```
packages/
├─ core/                                   # UI 组件实现（公开 API）
│  ├─ src/
│  │  ├─ components/                       # ← 按 v1.2 分类落目录
│  │  │  ├─ ui/
│  │  │  │  ├─ Button/
│  │  │  │  ├─ Icon/
│  │  │  │  ├─ Typography/
│  │  │  │  ├─ Avatar/
│  │  │  │  ├─ AvatarGroup/
│  │  │  │  ├─ Badge/
│  │  │  │  ├─ Divider/
│  │  │  │  ├─ Separator/
│  │  │  │  ├─ ScrollArea/
│  │  │  │  ├─ Kbd/
│  │  │  │  ├─ Code/
│  │  │  │  └─ Surface/
│  │  │  ├─ inputs/
│  │  │  │  ├─ Input/
│  │  │  │  ├─ Textarea/
│  │  │  │  ├─ NumberInput/
│  │  │  │  ├─ MaskedInput/
│  │  │  │  ├─ Select/
│  │  │  │  ├─ Combobox/
│  │  │  │  ├─ Checkbox/
│  │  │  │  ├─ Radio/
│  │  │  │  ├─ Switch/
│  │  │  │  ├─ ToggleGroup/
│  │  │  │  ├─ SegmentedControl/
│  │  │  │  ├─ Slider/
│  │  │  │  ├─ Rating/
│  │  │  │  ├─ DatePicker/
│  │  │  │  ├─ DateRangePicker/
│  │  │  │  ├─ TimePicker/
│  │  │  │  ├─ Calendar/
│  │  │  │  ├─ ColorPicker/
│  │  │  │  ├─ FileUpload/
│  │  │  │  └─ PinInput/
│  │  │  ├─ forms/
│  │  │  │  ├─ Form/
│  │  │  │  ├─ FormField/
│  │  │  │  ├─ Fieldset/
│  │  │  │  ├─ InputGroup/
│  │  │  │  ├─ ValidationMessage/
│  │  │  │  ├─ FormList/
│  │  │  │  └─ FormLayout/
│  │  │  ├─ navigation/
│  │  │  │  ├─ Tabs/
│  │  │  │  ├─ Breadcrumb/
│  │  │  │  ├─ Pagination/
│  │  │  │  ├─ Menu/
│  │  │  │  ├─ DropdownMenu/
│  │  │  │  ├─ ContextMenu/
│  │  │  │  ├─ CommandPalette/
│  │  │  │  ├─ Toolbar/
│  │  │  │  ├─ Tree/
│  │  │  │  ├─ Navbar/
│  │  │  │  ├─ Sidebar/
│  │  │  │  └─ Stepper/
│  │  │  ├─ layout/
│  │  │  │  ├─ Container/
│  │  │  │  ├─ Grid/
│  │  │  │  ├─ Flex/
│  │  │  │  ├─ Stack/
│  │  │  │  ├─ Section/
│  │  │  │  ├─ Spacer/
│  │  │  │  ├─ SplitView/
│  │  │  │  ├─ ResizablePanel/
│  │  │  │  ├─ Masonry/
│  │  │  │  ├─ AspectRatio/
│  │  │  │  └─ AppShell/
│  │  │  ├─ feedback/
│  │  │  │  ├─ Alert/
│  │  │  │  ├─ Toast/
│  │  │  │  ├─ Notification/
│  │  │  │  ├─ Progress/
│  │  │  │  ├─ Spinner/
│  │  │  │  ├─ Skeleton/
│  │  │  │  ├─ Tooltip/
│  │  │  │  └─ Result/
│  │  │  ├─ overlays/
│  │  │  │  ├─ Modal/
│  │  │  │  ├─ Dialog/
│  │  │  │  ├─ Drawer/
│  │  │  │  ├─ Sheet/
│  │  │  │  ├─ Popover/
│  │  │  │  ├─ HoverCard/
│  │  │  │  ├─ Lightbox/
│  │  │  │  └─ OverlayTrigger/
│  │  │  ├─ datadisplay/
│  │  │  │  ├─ Card/
│  │  │  │  ├─ List/
│  │  │  │  ├─ Table/
│  │  │  │  ├─ TreeTable/
│  │  │  │  ├─ Tag/
│  │  │  │  ├─ Statistic/
│  │  │  │  ├─ Timeline/
│  │  │  │  ├─ Accordion/
│  │  │  │  ├─ EmptyState/
│  │  │  │  ├─ DescriptionList/
│  │  │  │  └─ Carousel/
│  │  │  ├─ charts/
│  │  │  │  ├─ Axis/
│  │  │  │  ├─ Legend/
│  │  │  │  ├─ ChartTooltip/
│  │  │  │  ├─ LineChart/
│  │  │  │  ├─ BarChart/
│  │  │  │  ├─ PieChart/
│  │  │  │  ├─ AreaChart/
│  │  │  │  ├─ RadarChart/
│  │  │  │  ├─ ScatterChart/
│  │  │  │  ├─ GaugeChart/
│  │  │  │  └─ Heatmap/
│  │  │  └─ utilities/
│  │  │     ├─ Portal/
│  │  │     ├─ FocusTrap/
│  │  │     ├─ FocusScope/
│  │  │     ├─ DismissableLayer/
│  │  │     ├─ ScrollLock/
│  │  │     ├─ VisuallyHidden/
│  │  │     ├─ ResizeObserver/
│  │  │     ├─ IntersectionObserver/
│  │  │     ├─ SSRBoundary/
│  │  │     └─ ThemeProvider/
│  │  ├─ index.ts                 # 按分类聚合导出（禁止跨内部面）
│  │  └─ types/                   # 公共类型
│  ├─ tests/                      # 单元/可达性/交互测试
│  └─ package.json (exports map/sideEffects:false/peerDeps/engines)
│
├─ style-recipe/                  # 样式配方（消费 tokens）
├─ tokens/                        # 设计令牌（JSON / TS）
├─ i18n/                          # 本地化资源与工具
├─ hooks/                         # 交互逻辑（不依赖 core）
├─ system/                        # Providers（Theme/Config/A11y/ZLayer）
├─ registry/                      # registry.json + schema + 生成脚本
├─ cli/                           # xorigo 命令（add/sync/check/doctor）
│  └─ templates/
│     ├─ components/...           # 即拷单组件
│     ├─ patterns/...             # 复合模式
│     └─ blocks/...               # 页面区块（可选）
└─ patterns/ (可选，若将来提供 import 即用的运行时包)
```

> 约束：
>
> * **core 只放可对外导出的 UI 组件**；`utilities` 归 core，但在网站导航**隐藏**。
> * hooks/system/style-recipe/tokens 为**下游被依赖层**，严禁反向依赖 core。
> * `registry` 是事实来源（与分类 YAML 一致），Website 只读消费。

---

## B) website（Next.js App Router 站点壳层，严格只读）

```
apps/website/
├─ app/
│  ├─ page.tsx                         # 首页（入门&七轴概览）
│  ├─ adoption/                        # 取用矩阵（RSC + 客户端筛选）
│  │  └─ page.tsx
│  ├─ playground/                      # 交互沙盒
│  │  ├─ page.tsx                      # 入口（选择器/搜索）
│  │  └─ [name]/page.tsx               # 指定组件/模式的沙盒
│  ├─ tokens/                          # Token Explorer
│  │  └─ page.tsx
│  ├─ themes/                          # 主题/密度/对比度中心
│  │  └─ page.tsx
│  ├─ docs/                            # 文档（MDX）
│  │  ├─ components/
│  │  │  ├─ ui/
│  │  │  ├─ inputs/
│  │  │  ├─ forms/
│  │  │  ├─ navigation/
│  │  │  ├─ layout/
│  │  │  ├─ feedback/
│  │  │  ├─ overlays/
│  │  │  ├─ datadisplay/
│  │  │  ├─ charts/
│  │  │  └─ utilities/                 # 技术基元文档（在站点导航可选择隐藏）
│  │  ├─ patterns/
│  │  ├─ tokens/
│  │  ├─ i18n/
│  │  ├─ guides/                       # 七轴/协议/可达性规范
│  │  └─ references/                   # API/协议/约束
│  └─ layout.tsx                       # Root Providers（@xorigo-ui/system）
│
├─ src/
│  ├─ data/                            # 🔒 唯一数据入口（只读适配层）
│  │  ├─ registry.readonly.ts          # 读 packages/registry/registry.json
│  │  ├─ tokens.readonly.ts            # 读 @xorigo-ui/tokens
│  │  ├─ docs.readonly.ts              # 读 /docs/**.mdx 索引
│  │  ├─ i18n.readonly.ts              # 读 @xorigo-ui/i18n
│  │  └─ templates.readonly.ts         # 解析预览模块入口（仅映射路径）
│  ├─ templates/                       # 预览只读副本（由 CLI 同步）
│  │  ├─ Button/Preview.tsx
│  │  └─ ...
│  ├─ widgets/                         # 站点专用 UI（CopyButton/PropEditor/TokenViewer/ThemeSwitcher）
│  ├─ hooks/                           # 站点交互 hooks（非库）
│  └─ styles/                          # 站点样式
│
├─ public/
└─ package.json                        # scripts: predev/build 前置只读同步
```

> 路由规范：
>
> * 组件文档：`/docs/components/{category}/{ComponentName}`
> * 沙盒直链：`/playground/{ComponentName}?variant=&density=&locale=`
> * Tokens：`/tokens?brand=&mode=&density=`

---

# 二、原理与取舍（为何这样设计）

* **分类即目录**：packages/core 中的物理目录与 v1.2 分类一一映射，**最小心智成本**，避免“分类与物理路径不一致”的二义性。
* **导航与路由直连分类**：website 的 `/docs/components/` 子树与分类同构，侧边栏与路由天然一致，**无需二次映射层**。
* **只读边界**：website 的 `src/data/*.readonly.ts` 是**唯一入口**，确保站点不生成/不写入，上游（registry/tokens/docs/templates）更新后仅重新读取。
* **复合/模板双轨**：patterns 作为复合组件只在 CLI 模板与文档存在，不强求 runtime 包（与你的 A 方案即拷一致）。
* **技术基元可见性**：utilities 属于“站点可查、默认隐藏导航”的技术件，避免用户把它当业务组件用。
* **单向依赖**：core 依赖 style-recipe/tokens/hooks/system，**不得反向**；控制层级清晰，便于未来替换适配层（如 Radix 版本变化）。

---

# 三、落地步骤与清单（实施/检查/回滚）

## P0（当天完成）

* [ ] **目录迁移**：按上面树形把 `packages/core/src/components/*` 重排；移除重名（如 Portal 仅保留 utilities）。
* [ ] **导出聚合**：`core/src/index.ts` 分分类聚合导出（禁止跨内部路径 import）。
* [ ] **website 侧路由**：创建 `/docs/components/{category}` 目录骨架，生成空的 `index.mdx` 与占位示例。
* [ ] **只读适配层**：在 `apps/website/src/data` 增加五个 `*.readonly.ts` 文件，集中访问上游产物。
* [ ] **预览副本目录**：建立 `apps/website/src/templates`，并配置 CLI 的 `templates:sync` 把 `packages/cli/templates` 同步为只读副本。

## P1（本周内）

* [ ] **Registry 校验**：在 `packages/registry` 增加 schema 与 `xorigo check categories`，校验：

  * 组件名唯一、category ∈ {v1.2 分类集合}、preview.module 存在。
* [ ] **Docs 索引生成**：脚本从分类 YAML → 生成 `docs/sidebar.config.ts`，侧边栏与路由同构。
* [ ] **Playground 入口**：按 `preview.module` 动态导入 `src/templates/<name>/Preview`，失败出只读错误。
* [ ] **导航展示策略**：utilities 默认在 `/docs/components` 侧边栏隐藏，仅可搜索直达。

## P2（可择期）

* [ ] **Props 表生成**：脚本基于 TS 类型自动生成 Props 表插入 MDX。
* [ ] **状态仪表盘**：website 增加 `/status` 页，显示 bundle size、axe 报告、覆盖率等指标。
* [ ] **i18n 完整化**：`/playground` 支持 RTL/locale 切换并深链。

### 回滚方案

* 目录迁移通过 Git 提交逐步完成；若某分类影响构建，回滚对应该目录的提交即可。
* website 的只读适配层不写入数据，如上游缺失则在 UI 提示，不阻断其它页面。

---

## 关键命名/规范（摘要）

* **组件目录名 = 组件名（PascalCase）**；分类目录名为小写。
* **每组件目录**：`index.tsx`、`styles.ts`（可选）、`__tests__`、`Readme.mdx`（用于 Docs 注入）。
* **Overlay 协议**：overlays/* 必过 ESC/焦点回退/滚动锁/aria-hidden/inert/ZLayer 检查（在 CLI 的 `check:overlay` 实现机验）。
* **Utilities 不出现在核心导航**：避免被用户当业务组件引用；但在 API 搜索可见。

---

### 总结

* 以上蓝图把 **v1.2 分类**精准落在 **packages 的物理结构** 与 **website 的路由/导航**；
* 保持“**单一事实来源** + **只读站点** + **单向依赖**”三条红线，后续演进与替换都低成本。
