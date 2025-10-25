# 🎨 Xorigo UI 组件分类系统 - 共用规范（v1.4）

**创建日期**: 2025年10月14日
**版本**: v1.4
**状态**: ✅ 已完成
**位置**: `/docs/shared/component-classification-system.md`
**用途**: UI架构和Website技术架构的共用分类规范
**关联**: [组件分类定义SSOT](./component-taxonomy-v1.4.yaml)

> **重要说明**：本文档是对SSOT文件 `component-taxonomy-v1.4.yaml` 的详细说明和设计理念阐述，所有分类定义以SSOT文件为准。

---

## 🎯 概述

Xorigo UI v1.4 采用**16分类架构体系**，基于现代组件库最佳实践和原子化设计理念。该分类系统同时适用于UI架构设计和Website技术架构实现，确保组件库的完整性、可维护性和扩展性。

## 🏗️ 架构设计原则

### 核心设计理念
1. **层次化设计**：从静态令牌到动态组件，建立清晰的依赖层次
2. **职责分离**：每个分类有明确的功能边界和职责范围
3. **可组合性**：支持组件间的灵活组合和扩展
4. **主题感知**：所有组件深度集成七轴主题系统
5. **可访问性优先**：内置完整的A11y支持和键盘导航

### 依赖层次结构
```
Foundations (静态层)
    ↓
System (运行时层)
    ↓
Primitives (原子层)
    ↓
Inputs/Layout/Navigation (基础层)
    ↓
DataDisplay/Charts/Overlays/Feedback (功能层)
    ↓
Loading/Interactive/Effects/Blocks/Labs (扩展层)
```

---

## 📦 完整分类体系详解

### 1. 🎨 基础设计（Foundations）
**层级**: 静态设计令牌与基线规则
**职责**: 定义设计系统的底层规则和静态配置

**核心组件**:
- **design-tokens** - 令牌汇总入口（颜色/尺寸/半径/阴影/间距等）
- **color-tokens** - 色谱与语义色（含中性/强调基线）
- **density-tokens** - 密度刻度：spacious/comfortable/compact
- **motion-curves** - 动画曲线/时序基线：classic/soft/spring
- **elevation-tokens** - 阴影与层级：卡片/浮层/交互态
- **surface-tokens** - 表面视觉语言基线：flat/soft-shadow/glass/neon
- **typography** - 排版：字号/行高/字重/字距/可读性
- **ssr-compatibility** - SSR约定：Hydration/Portal/边界
- **performance** - 性能基线：懒加载/切片/虚拟化契约
- **matrix** - 可访问性矩阵：键盘/读屏/焦点策略
- **accessibility** - 无障碍基线：对比度/语义/焦点环
- **breakpoints** - 响应断点与token映射
- **z-index-tokens** - 分层优先级表：遮罩/浮层/提示
- **motion-reduced** - 降低动效基线：prefers-reduced-motion

**设计原则**:
- ✅ **静态优先**: 不包含运行时状态，纯配置驱动
- ✅ **主题无关**: 提供中性的设计基础
- ✅ **标准化**: 遵循DTCG设计令牌标准

### 2. ⚙️ 系统与主题（System / Runtime）
**层级**: 运行时主题引擎与系统能力
**职责**: 七轴主题系统、状态管理、系统能力提供

**核心组件**:
- **theme-provider** - 主题Provider：注入七轴与上下文
- **theme-axis-controller** - 七轴状态机：get/set/校验/建议
- **theme-recipes** - 主题配方：18预设 + 8场景，一键应用
- **theme-sync** - 跟随系统主题/持久化（light/dark/hc）
- **contrast-support** - 高对比度适配：forced-colors/prefers-contrast
- **accent-generator** - 主色策略生成：mono/analog/duo(hue)
- **i18n-provider** - 国际化Provider（可插适配）
- **formatters** - 数字/日期/相对时间等格式化工具
- **layer-manager** - 浮层/焦点/z-index/滚动锁协调器
- **error-boundary** - React错误边界（区块/页面兜底与上报）
- **suspense-boundary** - Suspense兜底（数据/代码分片）
- **print-support** - 打印/屏幕模式工具（print-only/screen-only）
- **offline-indicator** - 离线/恢复监听与UI提示

**技术特性**:
- 🎭 **七轴主题系统**: 支持7维度的主题定制
- 🔄 **状态管理**: 集中化的主题状态管理
- 🌐 **国际化支持**: 内置i18n能力
- 🛡️ **错误边界**: 完整的错误处理机制

### 3. 🧩 UI 基元（Primitives）
**层级**: 可组合的无样式或轻样式原子组件
**职责**: 提供最基础的UI交互能力和可访问性基元

**核心组件**:
- **button** - 按钮：尺寸/变体/状态
- **badge** - 徽章：状态/计数/可点击
- **avatar** - 头像：占位/故障保护
- **avatar-group** - 头像组：溢出计数
- **icon** - 图标封装（Lucide/自定义）
- **link** - 链接：外链图标/可访问性
- **chip** - 轻标签：可关闭/可选中
- **tag** - 标签：静态语义色
- **kbd** - 键盘提示：组合键/布局
- **divider** - 分割线：水平/垂直
- **separator** - 语义分隔（A11y）
- **surface** - 表面容器：层级/背景/投影
- **spinner** - 通用加载指示（品牌Loader另列）
- **skeleton** - 骨架屏：延时/动画
- **tooltip** - 工具提示：键盘可达
- **toggle** - 切换按钮：二态
- **switch** - 开关：motion?: 'none'|'default'
- **scroll-area** - 滚动容器：可控滚条
- **portal** - Portal：浮层挂载
- **visually-hidden** - 屏幕阅读器可见
- **focus-trap** - 焦点陷阱：对话框内循环
- **focus-scope** - 焦点域：界定与恢复
- **dismissable-layer** - 可关闭层：外击/ESC统一
- **overlay-trigger** - 覆盖层触发：对齐/开闭
- **intersection-observer** - 视口观察：懒加载
- **resize-observer** - 尺寸观察：自适应
- **scroll-lock** - 锁滚：弹层开启滚动管理
- **ssr-boundary** - 仅客户端渲染边界
- **aspect-ratio** - 比例容器：媒体适配
- **truncate** - 文本截断：单/多行
- **copy-button** - 通用复制按钮（独立于code-block）
- **skip-link** - 跳到主内容（A11y基线）

**设计原则**:
- ⚛️ **原子性**: 不可再分的最小UI单元
- 🎨 **无样式优先**: 提供最大程度的样式定制能力
- ♿ **可访问性内置**: 完整的ARIA支持和键盘导航
- 🔗 **高可组合性**: 支持灵活的组合模式

### 4. 📝 表单输入（Inputs）
**层级**: 统一表单输入控件
**职责**: 用户数据输入的完整解决方案

**核心组件**:
- **input** - 文本输入
- **password-input** - 密码输入：可见切换
- **input-number** - 数字输入：步进/限制
- **textarea** - 多行文本
- **checkbox** - 复选框：全选/半选
- **radio** - 单选框：分组/对齐
- **select** - 选择器：单/多选
- **combobox** - 组合框：搜索+选择
- **slider** - 滑块：范围/单值
- **search-input** - 搜索输入：清除/Submit
- **button-group** - 按钮组：互斥/多选
- **input-group** - 输入组：前后缀/组合
- **segmented-control** - 分段选择：紧凑切换
- **toggle-group** - Toggle组：多选/标签态

**设计标准**:
- 🎛️ **统一策略**: 受控/非受控统一API设计
- ⌨️ **键盘矩阵**: 一致的键盘导航和快捷键
- ✅ **表单验证**: 内置校验和错误提示
- 📱 **响应式**: 适配移动端和桌面端

### 5. 📋 表单容器与校验（Forms）
**层级**: 表单逻辑容器与校验系统
**职责**: 表单数据管理、校验逻辑、多步表单

**核心组件**:
- **form** - 表单容器：默认值/提交/重置
- **form-field** - 字段容器：标签/描述/错误
- **fieldset** - 字段集：分组/禁用/图例
- **validation-message** - 校验消息：错误/警告/成功
- **form-stepper** - 多步表单：步骤/进度/导航
- **form-summary** - 表单摘要：确认/编辑/提交

**技术特性**:
- ✅ **校验引擎**: 内置完整的校验系统
- 🎯 **状态管理**: 表单状态的统一管理
- 🔗 **关联校验**: 支持跨字段的关联校验
- 📊 **数据分析**: 表单数据的统计和分析

### 6. 📐 布局（Layout）
**层级**: 页面与组件级布局容器
**职责**: 空间分配、响应式布局、网格系统

**核心组件**:
- **box** - 最小容器/Box
- **flex** - 弹性布局：Flex/Stack/HStack/VStack
- **grid** - 网格布局：Grid/Col/Row
- **container** - 页面容器/宽度限制
- **spacer** - 空白间距
- **panel** - 面板容器：Header/Content/Footer
- **panel-header** - 面板头部
- **panel-content** - 面板内容
- **panel-footer** - 面板底部
- **aspect-ratio-container** - 比例容器：媒体适配

**布局特性**:
- 📱 **响应式设计**: 支持12列网格系统
- 🎯 **灵活容器**: 支持最大宽度和居中对齐
- 📏 **间距系统**: 基于8px的间距系统
- 🔄 **自适应布局**: 支持不同屏幕尺寸的自适应

### 7. 🧭 导航（Navigation）
**层级**: 站点与上下文导航结构
**职责**: 路由导航、菜单系统、命令入口

**核心组件**:
- **tabs** - 标签页组件
- **menu** - 菜单组件：Menu/ContextMenu/Dropdown
- **breadcrumb** - 面包屑导航
- **pagination** - 分页组件
- **basic-header** - 基础头部
- **navbar** - 导航栏：AppBar/Header
- **sidebar** - 侧边栏：Sidenav/TreeMenu
- **component-nav** - 组件导航
- **command** - 命令组件：命令面板/快捷键

**交互特性**:
- 🔄 **状态管理**: 完整的选中状态和导航历史
- 📱 **移动端优化**: 支持触摸手势和移动端交互
- ⚡ **性能优化**: 虚拟滚动和懒加载支持
- 🎯 **SEO友好**: 服务端渲染友好的HTML结构

### 8. 📊 数据呈现（Data Display）
**层级**: 数据展示与内容组织
**职责**: 列表、表格、卡片、媒体等数据展示组件

**核心组件**:
- **table** - 表格：DataGrid/虚拟表格
- **data-table** - 数据表格
- **list** - 列表组件：List/VirtualList
- **card** - 卡片组件
- **advanced-card** - 高级卡片
- **component-card** - 组件卡片
- **accordion** - 手风琴组件：Collapse/Details
- **accordion-header** - 手风琴头部
- **accordion-content** - 手风琴内容
- **accordion-item** - 手风琴项
- **code-block** - 代码块
- **description-list** - 属性-值：详情页
- **carousel** - 轮播图
- **carousel-control** - 轮播控制
- **carousel-item** - 轮播项

**可视化特性**:
- 📈 **动态数据**: 支持实时数据更新
- 🎨 **主题适配**: 自动适配当前主题配色
- 📱 **响应式图表**: 支持不同屏幕尺寸
- ⚡ **性能优化**: 虚拟化和懒加载

### 9. 📈 可视化（Charts）
**层级**: 数据可视化与图表组件
**职责**: 图表渲染、数据可视化、统计分析

**核心组件**:
- **chart** - 图表基类
- **line-chart** - 折线图
- **bar-chart** - 柱状图
- **pie-chart** - 饼图
- **gauge** - 仪表盘
- **stat** - 统计数值
- **chart-container** - 图表容器
- **chart-tooltip** - 图表提示
- **chart-legend** - 图表图例

**图表特性**:
- 🎨 **主题集成**: 深度集成七轴主题系统
- 📱 **响应式**: 自动适配不同屏幕尺寸
- 🔄 **交互支持**: 缩放、筛选、钻取等交互
- ⚡ **性能优化**: Canvas渲染和虚拟化

### 10. 🎭 弹层（Overlays）
**层级**: 覆盖层与弹出组件
**职责**: 对话框、抽屉、提示框等覆盖层组件

**核心组件**:
- **dialog** - 对话框
- **modal** - 模态框
- **drawer** - 抽屉
- **popover** - 弹出框
- **hover-card** - 悬停卡片
- **lightbox** - 灯箱
- **sheet** - 底部抽屉
- **overlay-trigger** - 覆盖层触发器

**弹层特性**:
- 🎭 **Portal渲染**: 使用React Portal渲染到body
- 🎯 **焦点管理**: 自动处理焦点捕获和恢复
- 🔄 **滚动锁定**: 弹层开启时的滚动管理
- ♿ **可访问性**: 完整的ARIA支持和键盘导航

### 11. 💬 反馈（Feedback）
**层级**: 用户操作反馈与状态提示
**职责**: 提示消息、状态反馈、进度指示

**核心组件**:
- **alert** - 警告提示
- **toast** - 轻提示
- **notification** - 通知消息
- **progress** - 进度条
- **loading** - 加载状态
- **theme-toggle** - 主题切换

**反馈特性**:
- ⏰ **自动管理**: 自动消失和堆积管理
- 🎭 **动画效果**: 流畅的进入和退出动画
- 🎯 **上下文感知**: 根据操作类型选择合适的反馈方式
- 📱 **移动端优化**: 触摸友好的交互设计

### 12. ⏳ 加载（Loading）
**层级**: 专门的加载状态组件
**职责**: 品牌化加载动画、加载状态管理

**核心组件**:
- **xorigo-logo-loader** - Xorigo Logo加载动画
- **brand-spinner** - 品牌化加载动画
- **loading-skeleton** - 骨架屏加载
- **loading-dots** - 点状加载动画
- **loading-progress** - 进度加载

**加载特性**:
- 🎨 **品牌一致**: 统一的视觉风格
- ⚡ **性能优化**: 轻量级实现
- 🎭 **动画流畅**: 60fps的动画效果
- ♿ **可访问性**: 屏幕阅读器支持

### 13. 🎮 交互（Interactive）
**层级**: 复杂用户交互组件
**职责**: 需要复杂用户交互的组件

**核心组件**:
- **code-editor** - 代码编辑器
- **rich-text-editor** - 富文本编辑器
- **drag-drop** - 拖拽组件
- **resizable** - 可调整大小组件
- **split-view** - 分割视图
- **tree-view** - 树形视图

**交互特性**:
- 🎮 **丰富交互**: 支持复杂的用户操作
- ⌨️ **键盘支持**: 完整的键盘快捷键
- 📱 **触控优化**: 移动端触摸交互
- 🔄 **状态同步**: 复杂状态的同步管理

### 14. ✨ 特效（Effects）
**层级**: 视觉特效与动画组件
**职责**: 粒子效果、背景动画、视觉特效

**核心组件**:
- **super-particle-system** - 超级粒子系统
- **super-particle-system-simple** - 简化版粒子系统
- **fluid-background** - 流体背景
- **hero-title** - 英雄标题
- **gradient-text** - 渐变文字
- **shimmer** - 微光效果

**特效特性**:
- 🎨 **视觉冲击**: 强烈的视觉效果
- ⚡ **性能优化**: GPU加速和优化算法
- 🎭 **主题适配**: 自动适配主题色彩
- 📱 **响应式**: 适配不同设备性能

### 15. 🧱 模板与区块（Blocks）
**层级**: 页面级块级组件
**职责**: 预制的页面模板和功能区块

**核心组件**:
- **hero-section** - 英雄区块
- **feature-grid** - 功能网格
- **testimonial-section** - 评价区块
- **pricing-section** - 价格区块
- **footer-section** - 页脚区块
- **navigation-block** - 导航区块

**区块特性**:
- 🏗️ **即插即用**: 开箱即用的页面区块
- 🎨 **主题适配**: 自动适配主题系统
- 📱 **响应式**: 内置响应式设计
- 🔧 **高度可定制**: 丰富的配置选项

### 16. 🧪 实验室（Labs / Showcase）
**层级**: 实验性和展示性组件
**职责**: 创新组件展示、实验性功能、演示组件

**核心组件**:
- **component-3d-carousel** - 3D组件轮播
- **counter-animation** - 计数动画
- **stats-card** - 统计卡片
- **code-demo** - 代码演示
- **interactive-showcase** - 交互式展示
- **experimental-feature** - 实验性功能

**实验特性**:
- 🚀 **创新探索**: 前沿的交互和技术探索
- 🎪 **展示导向**: 优秀的视觉效果和交互体验
- 🔄 **快速迭代**: 实验性质的快速迭代
- 📊 **数据收集**: 用户行为数据收集和分析

---

## 🔗 组件间依赖关系

### 依赖层次图
```
Foundations (第1层)
    ↓
System (第2层) → 依赖 Foundations
    ↓
Primitives (第3层) → 依赖 System + Foundations
    ↓
Inputs/Forms/Layout/Navigation (第4层) → 依赖 Primitives + System
    ↓
DataDisplay/Charts/Overlays/Feedback (第5层) → 依赖基础层组件
    ↓
Loading/Interactive/Effects/Blocks/Labs (第6层) → 依赖所有下层
```

### 跨层依赖规则
- ✅ **单向依赖**: 上层可以依赖下层，下层不能依赖上层
- ✅ **水平解耦**: 同层组件之间尽量减少直接依赖
- ✅ **接口驱动**: 通过标准化的Props接口进行交互
- ✅ **主题注入**: 通过主题系统注入样式，而非直接依赖

---

## 🎯 设计决策与最佳实践

### 分类策略
1. **功能优先**: 按组件的功能职责进行分类，而非视觉相似性
2. **层次清晰**: 建立清晰的依赖层次，避免循环依赖
3. **扩展友好**: 为未来的组件扩展预留合理的分类空间
4. **维护便利**: 每个分类都有明确的维护边界和责任人

### 命名规范
- **文件名**: kebab-case（如：`component-name.tsx`）
- **组件名**: PascalCase（如：`ComponentName`）
- **目录名**: kebab-case（如：`component-name/`）
- **导出名**: 与组件名保持一致

### API设计原则
- **一致性**: 同类组件使用相似的API设计
- **可组合性**: 支持组件的灵活组合
- **渐进增强**: 提供从基础到高级的完整功能
- **向后兼容**: 新版本保持API的向后兼容

### 质量保证
- **类型安全**: 完整的TypeScript类型定义
- **单元测试**: 每个组件都有对应的单元测试
- **可访问性**: 通过WCAG 2.1 AA标准
- **性能优化**: 使用React.memo和useMemo优化渲染

---

## 📚 使用指南

### 开发者如何使用
1. **查看SSOT**: 首先查看 `component-taxonomy-v1.4.yaml` 了解完整分类
2. **选择分类**: 根据组件功能选择合适的分类
3. **遵循规范**: 按照对应分类的设计和API规范开发
4. **更新文档**: 及时更新相关文档和类型定义

### 架构师如何使用
1. **理解体系**: 深入理解16分类的设计理念和依赖关系
2. **规划组件**: 基于分类体系规划新组件的开发路径
3. **审查设计**: 审查组件设计是否符合分类原则
4. **推动演进**: 推动分类体系的持续优化和演进

### 项目管理者如何使用
1. **评估范围**: 基于分类体系评估项目所需组件范围
2. **规划资源**: 根据分类复杂度分配开发资源
3. **跟踪进度**: 按分类跟踪组件开发进度
4. **质量控制**: 建立基于分类的质量控制标准

---

## 🔮 未来演进规划

### v1.5 计划
- **智能分类**: 基于AI的组件自动分类建议
- **性能优化**: 进一步优化组件渲染性能
- **主题增强**: 增强七轴主题系统的表现力

### 长期规划
- **生态扩展**: 建立第三方组件生态
- **标准化**: 推动行业组件分类标准化
- **工具链**: 完善的组件开发和维护工具链

---

**文档维护**: Xorigo UI 架构团队
**最后更新**: 2025年10月25日
**下次审查**: 2025年11月25日

---

> 📋 **重要提醒**: 本文档与 `component-taxonomy-v1.4.yaml` 保持严格同步，任何分类变更必须同时更新两个文件。