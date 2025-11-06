# Xorigo UI VS Code Extension

[![Visual Studio Marketplace](https://img.shields.io/vscode-marketplace/v/xorigo-ui-team.xorigo-ui-snippets)](https://marketplace.visualstudio.com/items?itemName=xorigo-ui-team.xorigo-ui-snippets)
[![Downloads](https://img.shields.io/vscode-marketplace/d/xorigo-ui-team.xorigo-ui-snippets)](https://marketplace.visualstudio.com/items?itemName=xorigo-ui-team.xorigo-ui-snippets)
[![Rating](https://img.shields.io/vscode-marketplace/r/xorigo-ui-team.xorigo-ui-snippets)](https://marketplace.visualstudio.com/items?itemName=xorigo-ui-team.xorigo-ui-snippets)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Xorigo UI 的官方 VS Code 扩展，提供智能代码补全、悬停提示、主题预览和 50+ 代码片段，让开发 Xorigo UI 组件变得更快、更容易！

## ✨ 特性

### 🚀 智能代码补全
- **组件名自动补全**: 输入 `<B` 自动提示 `Button` 组件
- **属性智能提示**: 自动显示所有可用属性和变体
- **变体和尺寸选择**: 快速选择 `primary`、`secondary`、`sm`、`md`、`lg` 等
- **状态值补全**: 智能提示 `error`、`success`、`warning` 等状态

### 📚 悬停文档
- **组件详情**: 悬停在组件名上查看完整文档
- **属性列表**: 查看所有属性、类型和默认值
- **使用示例**: 内置代码示例和最佳实践
- **分类信息**: 了解组件所属分类

### 🎨 主题预览
- **10+ 预置主题**: 企业色、极简、科技、创意等风格
- **实时预览**: 在 WebView 中预览主题效果
- **一键切换**: 快速应用主题到当前工作区
- **七轴系统**: 完整支持 Xorigo UI 的七轴主题系统

### ⚡ 代码片段 (50+)
- **Button**: 按钮组件快速插入
- **Input**: 各种输入框组件
- **Select**: 下拉选择组件
- **Card**: 卡片容器组件
- **Modal**: 模态框组件
- **Tabs**: 标签页组件
- **Form**: 完整表单示例
- **数据组件**: DataTable、Chart 等
- **更多**: 持续更新中...

### 🔧 工具功能
- **组件库浏览器**: 侧边栏组件树视图
- **自动导入**: 自动插入 `@xorigo-ui/core` 导入语句
- **文档链接**: 一键打开官方文档
- **状态栏**: 显示当前主题信息

## 📦 安装

### 从 VS Code 市场安装
1. 打开 VS Code
2. 按 `Ctrl+Shift+X` (Windows/Linux) 或 `Cmd+Shift+X` (Mac) 打开扩展面板
3. 搜索 "Xorigo UI Snippets"
4. 点击安装

### 从 VSIX 文件安装
1. 下载最新的 `.vsix` 文件
2. 在 VS Code 中按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)
3. 运行 "Extensions: Install from VSIX..."
4. 选择下载的 `.vsix` 文件

## 🎯 快速开始

### 基本使用

1. **安装扩展**: 完成上述安装步骤
2. **创建组件**: 在 `.tsx` 或 `.js` 文件中输入组件名触发补全
3. **查看文档**: 悬停在组件名上查看详细文档
4. **插入片段**: 输入前缀（如 `xorigo-btn`）快速插入组件模板

### 代码片段示例

#### Button 组件
```typescript
// 输入: xorigo-btn
// 按 Tab 或 Enter 插入:

<Button
  variant="primary"
  size="md"
  loading={false}
  disabled={false}
  onClick={handleClick}
>
  Button Text
</Button>
```

#### Input 组件
```typescript
// 输入: xorigo-input
// 按 Tab 或 Enter 插入:

<Input
  label="Label"
  variant="default"
  size="md"
  status="default"
  error="Error message"
  helperText="Helper text"
  placeholder="Placeholder"
  value={value}
  onChange={handleChange}
  leftIcon={<Icon />}
  rightIcon={<Icon />}
  clearable={false}
  password={false}
  disabled={false}
  className=""
/>
```

### 智能补全示例

#### 输入组件名
```typescript
// 输入: <Bu
// 自动提示: Button

<Bu  // 悬停显示: 多功能按钮组件，支持多种变体和尺寸
  variant="|"  // 选择变体: primary | secondary | outline | ghost
  size="|"     // 选择尺寸: sm | md | lg
>
```

#### 属性值补全
```typescript
<Input
  variant="|"  // 自动提示: 'default', 'filled', 'outlined', 'underlined', 'ghost', 'neon'
  status="|"   // 自动提示: 'default', 'error', 'success', 'warning'
  size="|"     // 自动提示: 'sm', 'md', 'lg'
/>
```

## ⚙️ 配置

在 VS Code 设置中配置扩展行为：

```json
{
  "xorigoUi.enableSnippets": true,         // 启用代码片段
  "xorigoUi.enableIntelliSense": true,     // 启用智能提示
  "xorigoUi.enableThemePreview": true,     // 启用主题预览
  "xorigoUi.autoImport": true,             // 自动插入导入语句
  "xorigoUi.showThemeInStatusBar": true    // 在状态栏显示主题
}
```

## 🎨 主题系统

### 支持的主题

| 主题名称 | 分类 | 描述 | 预览 |
|---------|------|------|------|
| Corporate Blue | 企业 | 专业的企业蓝色主题 | ![Corporate Blue](https://via.placeholder.com/100x50/3b82f6/ffffff?text=Corporate) |
| Corporate Navy Dark | 企业 | 深色企业主题 | ![Navy Dark](https://via.placeholder.com/100x50/0f172a/ffffff?text=Navy) |
| Minimal White | 极简 | 极简白色主题 | ![Minimal](https://via.placeholder.com/100x50/ffffff/000000?text=Minimal) |
| Minimal Graphite Dark | 极简 | 深色石墨主题 | ![Graphite](https://via.placeholder.com/100x50/0a0a0a/ffffff?text=Graphite) |
| Tech Cyan | 科技 | 科技青色主题 | ![Tech Cyan](https://via.placeholder.com/100x50/06b6d4/ffffff?text=Tech) |
| Tech Neon Dark | 科技 | 赛博朋克霓虹主题 | ![Neon](https://via.placeholder.com/100x50/22d3ee/000000?text=Neon) |
| Creative Purple | 创意 | 创意紫色主题 | ![Purple](https://via.placeholder.com/100x50/a855f7/ffffff?text=Creative) |
| Creative Aurora Dark | 创意 | 极光深色主题 | ![Aurora](https://via.placeholder.com/100x50/a855f7/ffffff?text=Aurora) |
| Classic Neutral | 经典 | 经典中性主题 | ![Classic](https://via.placeholder.com/100x50/627d98/ffffff?text=Classic) |
| High Contrast Pro | 无障碍 | 高对比度主题 | ![HC](https://via.placeholder.com/100x50/000000/ffffff?text=HC) |

### 使用主题预览

1. **命令面板**: 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)，输入 "Xorigo UI: 切换主题"
2. **状态栏**: 点击状态栏右侧的 "Xorigo UI" 图标
3. **组件树**: 在侧边栏的 "Xorigo UI 组件" 视图中右键选择主题
4. **预览**: 选择 "Xorigo UI: 预览主题" 查看详细效果

## 📚 文档与帮助

### 官方资源
- [Xorigo UI 官方网站](https://xorigo-ui.github.io)
- [组件文档](https://xorigo-ui.github.io/docs/components)
- [主题系统指南](https://xorigo-ui.github.io/docs/themes)
- [API 参考](https://xorigo-ui.github.io/docs/api)

### 支持
- [GitHub Issues](https://github.com/xorigo-ui/vscode-extension/issues)
- [Discussions](https://github.com/xorigo-ui/vscode-extension/discussions)
- [Discord 社区](https://discord.gg/xorigo-ui)

## 🤝 贡献

我们欢迎所有形式的贡献！

### 开发指南

1. Fork 本仓库
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交更改: `git commit -am 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 创建 Pull Request

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/xorigo-ui/vscode-extension.git
cd vscode-extension

# 安装依赖
npm install

# 编译 TypeScript
npm run compile

# 在调试模式下运行
F5 键启动扩展开发主机
```

## 📄 许可证

本项目基于 [MIT 许可证](LICENSE) 开源。

## 🙏 致谢

感谢所有为 Xorigo UI 和这个 VS Code 扩展做出贡献的开发者们！

## 📊 统计数据

- **代码片段**: 50+ 个
- **支持的组件**: 30+ 个
- **主题**: 10+ 个
- **支持的语言**: TypeScript, JavaScript, TSX, JSX
- **兼容性**: VS Code 1.80+

---

**Xorigo UI Team** - 构建现代化的 React UI 组件库

[![Twitter](https://img.shields.io/twitter/follow/xorigo_ui)](https://twitter.com/xorigo_ui)
[![GitHub stars](https://img.shields.io/github/stars/xorigo-ui/vscode-extension)](https://github.com/xorigo-ui/vscode-extension/stargazers)
