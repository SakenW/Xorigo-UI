# 🎨 Xorigo UI 组件分类系统 - 共用规范

**创建日期**: 2025年10月14日
**版本**: v1.0
**状态**: ✅ 已完成
**位置**: `/docs/SHARED/COMPONENT-CLASSIFICATION-SYSTEM.md`
**用途**: UI架构和Website技术架构的共用分类规范

---

## 🎯 概述

本文档定义了Xorigo UI组件库的完整分类体系，基于原子化设计理念和现代组件库最佳实践。该分类系统同时适用于UI架构设计和Website技术架构实现。

## 📦 组件分类体系

### 分类原则
1. **功能职责原则**: 每个分类有明确的功能职责，边界清晰
2. **依赖层次原则**: 基于原子化设计，建立清晰的依赖层次
3. **使用频率原则**: 高频组件位于较低层级，复杂组件位于较高层级
4. **扩展性原则**: 支持灵活的组合和扩展

### 完整分类结构

#### 1. 🎨 Base (基础组件)
**定义**: 最基础的UI构建块，不可再分的功能单元

**组件清单**:
- **text** - 文本/排版：Typography, Heading, Paragraph, Code
- **button** - 按钮组件：Button, IconButton, ToggleButton
- **icon** - 图标注册/渲染
- **link** - 链接组件：Anchor/Link
- **divider** - 分隔线组件：Separator/Divider
- **avatar** - 头像组件
- **kbd** - 键盘提示组件

**设计原则**:
- ✅ **原子性**: 不可再分的最小UI单元
- ✅ **高复用性**: 上下文无关，可在任何场景使用
- ✅ **样式独立**: 不依赖外部样式，完全自包含

#### 2. 📐 Layout (布局组件)
**定义**: 页面布局和空间分配的基础组件

**组件清单**:
- **box** - 最小容器/Box
- **flex** - 弹性布局：Flex/Stack/HStack/VStack
- **grid** - 网格布局：Grid/Col/Row
- **container** - 页面容器/宽度限制
- **spacer** - 空白间距
- **scroll-area** - 滚动容器/虚拟滚动适配位
- **portal** - 传送门/OverlayContainer
- **safe-area** - 移动端安全区适配

**特性**:
- 📱 **响应式设计**: 支持12列网格系统
- 🎯 **灵活容器**: 支持最大宽度和居中对齐
- 📏 **间距系统**: 基于8px的间距系统
- 🔄 **自适应布局**: 支持不同屏幕尺寸的自适应

#### 3. 🧭 Navigation (导航组件)
**定义**: 提供导航和路由功能的组件

**组件清单**:
- **tabs** - 标签页组件
- **menu** - 菜单组件：Menu, ContextMenu
- **breadcrumb** - 面包屑导航
- **pagination** - 分页组件
- **steps** - 步骤指示器：Stepper
- **sidebar** - 侧边栏：Sidenav/TreeMenu（可选）
- **navbar** - 导航栏：AppBar/Header（可选）

**交互特性**:
- 🔄 **状态管理**: 完整的选中状态和导航历史
- 📱 **移动端优化**: 支持触摸手势和移动端交互
- ⚡ **性能优化**: 虚拟滚动和懒加载支持
- 🎯 **SEO友好**: 服务端渲染友好的HTML结构

#### 4. 📝 Form (表单组件)
**定义**: 用户输入数据的核心交互组件

**组件清单**:
- **input** - 输入组件：TextInput, TextArea, Password
- **select** - 选择组件：Single/Multi, Combobox/Autocomplete
- **checkbox** - 复选框组件
- **radio** - 单选框组件
- **switch** - 开关组件：Toggle
- **slider** - 滑块组件
- **number-input** - 数字输入框
- **date-time** - 日期时间组件：DatePicker/TimePicker/Range
- **upload** - 文件上传：文件/图片上传
- **richtext** - 富文本编辑器：RTE/Markdown（可选，或外部集成）
- **form** - 表单容器：Form/Field/Fieldset（容器与校验适配）

**设计标准**:
- 📱 **响应式设计**: 适配移动端和桌面端
- ♿ **无障碍支持**: 完整的ARIA标签和键盘导航
- 🎨 **主题适配**: 支持10种主题配色
- ⚡ **性能优化**: 使用React.memo优化渲染性能

#### 5. 📊 Data Display (数据展示组件)
**定义**: 数据展示和图表可视化组件

**组件清单**:
- **table** - 表格组件：DataGrid/虚拟表格
- **list** - 列表组件：List/VirtualList
- **card** - 卡片组件
- **tag** - 标签组件：Tag/Chip
- **badge** - 徽章组件
- **tooltip** - 提示框组件（也可归Feedback，但常与展示共用）
- **accordion** - 手风琴组件：Collapse/Details
- **description** - 描述列表：Key-Value/Descriptions
- **image** - 图片组件：Image/Preview
- **code-view** - 代码查看器：Code/DiffViewer（可选）

**可视化特性**:
- 📈 **动态数据**: 支持实时数据更新
- 🎨 **主题适配**: 自动适配当前主题配色
- 📱 **响应式图表**: 支持不同屏幕尺寸
- ⚡ **性能优化**: Canvas渲染和虚拟化

#### 6. 💬 Feedback (反馈组件)
**定义**: 用户操作反馈和状态提示组件

**组件清单**:
- **modal** - 模态框组件：Dialog/AlertDialog
- **drawer** - 抽屉组件
- **popover** - 气泡组件
- **toast** - 消息提示：Message/Snackbar
- **progress** - 进度条：Linear/Circular
- **spinner** - 加载指示器：Loading/Spin
- **skeleton** - 骨架屏组件
- **result** - 结果状态：成功/失败/警告/403/404/500
- **empty** - 空状态组件

**技术特性**:
- 🎭 **动画效果**: 流畅的进入和退出动画
- 🎪 **Portal渲染**: 使用React Portal渲染到body
- 🎯 **焦点管理**: 自动处理焦点捕获和恢复
- ♿ **可访问性**: 完整的ARIA支持和键盘导航

#### 7. 🧩 Composite (复合组件)
**定义**: 由基础组件组合而成的复杂功能组件

**子分类**:

##### 7.1 Business (业务复合)
- **form-dialog** - 表单弹窗：提交/校验/加载
- **filter-panel** - 过滤条件面板
- **table-editor** - 表格编辑器：行内编辑/批量操作

##### 7.2 Functional (功能复合)
- **tree** - 树形组件：Tree/TreeSelect
- **transfer** - 穿梭框组件
- **cascader** - 级联选择器
- **file-manager** - 文件管理器：预览/批量/拖拽（可选）

##### 7.3 UI Pattern (界面模式)
- **page-header** - 页面头部：标题/面包屑/操作区
- **dashboard-layout** - 仪表盘布局：分栏/卡片栅格
- **empty-state** - 场景化空状态集合

#### 8. ⚙️ System (系统组件)
**定义**: 系统级和主题相关的基础设施组件

**组件清单**:
- **theme-provider** - 主题提供者：主题/密度/圆角/字号 等设计令牌注入
- **tokens** - 语义令牌：color/surface/content/state/elevation/motion
- **mode-toggle** - 模式切换：亮/暗/高对比
- **motion** - 动效系统：duration/easing/presets + prefers-reduced-motion
- **i18n-provider** - 国际化提供者：文案/区域化（只做容器，不强绑定实现）
- **a11y** - 无障碍组件：FocusTrap, VisuallyHidden, SkipNav
- **z-layer** - 层级管理：Overlay 层级/避让策略

#### 9. 📈 Visualization (可视化组件)
**定义**: 数据可视化和图表组件（独立层，外部图表库适配）

**组件清单**:
- **chart-adapter** - 图表适配器：ECharts/Recharts 适配组件
- **stat** - 统计组件：统计数值/Sparkline/Gauge

---

## 🔧 元模式 (Meta Patterns)

### 设计模式
- **controlled_uncontrolled_policy** - 受控/非受控统一规则
- **keyboard_matrix** - 键盘导航矩阵
- **overlay_behavior** - 弹层/滚动锁定/回焦/层级
- **async_validation** - 异步校验/aria-live
- **virtualization_contract** - 虚拟滚动接口约定

---

## 📋 使用指南

### 组件分类选择
1. **原子组件优先**: 优先使用Base分类中的原子组件
2. **复合组件**: 对于复杂场景，优先使用Composite分类
3. **业务特定**: 避免创建业务特定组件，优先组合现有组件
4. **性能考虑**: 大数据量场景优先选择支持虚拟化的组件

### 扩展原则
1. **保持分类边界**: 新组件应该明确属于某个分类
2. **复用现有组件**: 避免重复实现已有功能
3. **遵循API标准**: 使用统一的Props命名和事件处理模式
4. **考虑向后兼容**: 新功能不应破坏现有API

---

## 🔄 版本历史

- **v1.0** (2025-10-14): 初始版本，定义9大分类体系
- 基于原子化设计理念和现代组件库最佳实践
- 整合了UI架构和Website技术架构的共同需求

---

## 📄 文档信息

**文档状态**: ✅ 已完成
**创建日期**: 2025年10月14日
**版本**: v1.0
**维护者**: Xorigo UI 架构团队
**适用范围**: UI架构设计、Website技术架构、组件开发指南

---

**🎯 本分类系统为Xorigo UI提供了统一的组件组织架构，确保开发体验和用户体验的一致性！**