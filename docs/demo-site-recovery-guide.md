# Demo-Site 恢复指南

## 📋 概述

本项目在 **2025年10月12日** 的 monorepo 重构过程中，意外删除了完整的 `demo-site` 前端演示内容。幸运的是，我们通过 Git 历史成功定位并恢复了这些宝贵的资料。

## 🔍 关键时间节点

- **创建时间**: `2025-10-10 04:20:21` (提交 `8705169`)
- **删除时间**: `2025-10-12 01:47:13` (提交 `5109b10`)
- **恢复时间**: `2025-10-16` (当前)

## 🎨 恢复内容概览

### 核心文件
- ✅ **App.tsx** - 主应用路由组件
- ✅ **LandingPage.tsx** - 精美的首页展示
- ✅ **ComponentLibrary.tsx** - 完整的组件库演示页面
- ✅ **main.tsx** - 应用入口文件
- ✅ **styles.css** - 全局样式

### 组件演示 (17+ 核心组件)

#### 📝 表单组件
- **ButtonDemo.tsx** - 按钮组件演示 (多种变体、尺寸、状态)
- **InputDemo.tsx** - 输入框组件演示
- **CheckboxDemo.tsx** - 复选框组件演示
- **SelectDemo.tsx** - 选择器组件演示
- **SwitchDemo.tsx** - 开关组件演示
- **TextareaDemo.tsx** - 文本域演示
- **ComboboxDemo.tsx** - 组合框演示
- **CommandDemo.tsx** - 命令面板演示
- **RadioDemo.tsx** - 单选按钮演示

#### 💬 反馈组件
- **AlertDemo.tsx** - 警告提示演示
- **NotificationDemo.tsx** - 通知系统演示
- **LoadingDemo.tsx** - 加载状态演示
- **ModalDemo.tsx** - 模态框演示
- **ProgressDemo.tsx** - 进度条演示
- **SkeletonDemo.tsx** - 骨架屏演示
- **TooltipDemo.tsx** - 工具提示演示

#### 📊 数据展示
- **CardDemo.tsx** - 卡片组件演示
- **BadgeDemo.tsx** - 标签组件演示
- **DataTableDemo.tsx** - 数据表格演示
- **AvatarDemo.tsx** - 头像组件演示

#### 🧭 导航组件
- **BreadcrumbDemo.tsx** - 面包屑导航演示
- **HeaderDemo.tsx** - 页头组件演示
- **SidebarDemo.tsx** - 侧边栏组件演示
- **TabsDemo.tsx** - 标签页组件演示
- **PaginationDemo.tsx** - 分页组件演示

#### 📐 布局组件
- **AdvancedCardDemo.tsx** - 高级卡片演示
- **DividerDemo.tsx** - 分割线演示
- **ResponsiveLayoutDemo.tsx** - 响应式布局演示

#### 🚀 高级组件
- **ThemeDemo.tsx** - 主题系统演示
- **ThemeToggleDemo.tsx** - 主题切换演示
- **AnimatedCardDemo.tsx** - 动画卡片演示
- **MicroInteractionsDemo.tsx** - 微交互演示
- **RadixUIDemo.tsx** - Radix UI 集成演示
- **InteractionStatesDemo.tsx** - 交互状态演示

#### 🎨 配方系统 (8个演示)
- **UnifiedRecipeDemo.tsx** - 统一配方演示
- **CompleteRecipeDemo.tsx** - 完整配方演示
- **CreativeRecipeDemo.tsx** - 创意配方演示
- **DTCGRecipeDemo.tsx** - DTCG 配方演示
- **DTCGStyleRecipeDemo.tsx** - DTCG 样式配方演示
- **EnhancedRecipeDemo.tsx** - 增强配方演示
- **InteractiveRecipeDemo.tsx** - 交互配方演示
- **StyleRecipeDemo.tsx** - 样式配方演示
- **WorkingRecipeDemo.tsx** - 工作配方演示

## 🌐 当前访问方式

### 临时恢复页面
- **地址**: http://localhost:3100/demo-restore
- **内容**: 丰富的组件演示和恢复信息
- **状态**: ✅ 可直接访问
- **已修复**: ✅ Framer Motion 导入问题已解决
- **包含组件**:
  - 📝 **Button Demo** - 按钮组件（含交互功能，可打开模态框）
  - 📝 **Input Demo** - 输入框组件（支持多种类型）
  - 💬 **Alert Demo** - 警告提示组件（信息/成功/错误提示，带动画效果）
  - 🎬 **Animation Demo** - 动画效果演示（涟漪、磁性按钮、打字机效果等）
  - 🎨 **Recipe Demo** - 配方系统演示（5种主题配色）
  - 📊 **Card Demo** - 卡片组件展示
- **交互功能**: 模态框打开、表单输入、动画状态切换、主题选择等
- **动画效果**: Alert 组件带有 Framer Motion 动画（淡入淡出效果）

### 完整恢复 (可选)
如需恢复完整的 demo-site，可以执行：

```bash
# 1. 创建恢复分支
git checkout -b restore-demo-site 8705169

# 2. 查看完整内容
git ls-tree 8705169:demo-site

# 3. 选择性复制需要的文件
```

## 📖 文件查看命令

### 查看特定文件
```bash
# 查看主应用组件
git show 8705169:demo-site/App.tsx

# 查看首页
git show 8705169:demo-site/pages/LandingPage.tsx

# 查看组件库页面
git show 8705169:demo-site/pages/ComponentLibrary.tsx

# 查看按钮演示
git show 8705169:demo-site/components/forms/ButtonDemo.tsx
```

### 保存文件到本地
```bash
# 保存到临时文件
git show 8705169:demo-site/App.tsx > /tmp/App.tsx

# 保存到项目目录
git show 8705169:demo-site/components/forms/ButtonDemo.tsx > ./ButtonDemo.tsx
```

### 查看目录结构
```bash
git ls-tree 8705169:demo-site

# 查看特定子目录
git ls-tree 8705169:demo-site/components
git ls-tree 8705169:demo-site/components/forms
```

## 🛠️ 使用辅助脚本

项目提供了便捷的查看脚本：

```bash
# 运行查看脚本
./scripts/view-demo-site.sh
```

该脚本会显示：
- 📁 所有可用文件列表
- 🧩 按类别组织的组件演示
- 📖 详细的使用命令
- 🌐 当前恢复页面地址

## 💡 恢复建议

### 立即可用
- ✅ 临时恢复页面已可访问 http://localhost:3100/demo-restore
- ✅ 可以直接复制需要的组件代码

### 长期方案
1. **选择性迁移**: 将需要的组件演示逐个适配到当前项目
2. **独立分支**: 创建专门分支保存完整 demo-site
3. **文档整合**: 将演示内容整合到官方文档中
4. **测试覆盖**: 为恢复的组件添加测试用例

### 适配注意事项
- ⚠️ 需要更新组件导入路径 (`@xorigo-ui/core`)
- ⚠️ 可能需要适配新的 API 接口
- ⚠️ 主题系统可能需要调整
- ⚠️ 样式可能需要与当前设计系统对齐

## 🎯 技术栈信息

**原始 Demo-Site 技术栈**:
- React 19 + TypeScript 5.9
- Tailwind CSS 3 + Framer Motion 12
- React Router DOM
- 完整的主题系统 (10种主题)
- 无障碍设计 (WCAG 2.1)

**组件特点**:
- 🎨 精美的视觉效果和动画
- ♿ 完整的无障碍支持
- 📱 响应式设计
- 🌙 明暗主题切换
- 🔧 TypeScript 类型安全

## 📞 使用支持

如需进一步协助：
1. 查看临时恢复页面了解效果
2. 使用脚本命令查看具体文件
3. 根据需要复制和适配组件代码
4. 参考现有项目结构和 API

---

**最后更新**: 2025-10-16
**恢复状态**: ✅ 成功恢复核心内容
**访问地址**: http://localhost:3100/demo-restore