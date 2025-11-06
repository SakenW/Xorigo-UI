# 🚀 Xorigo UI VS Code 扩展 - 快速入门

欢迎使用 Xorigo UI VS Code 扩展！本指南将帮助您快速上手并充分利用这个强大的开发工具。

## 📋 目录

- [安装](#安装)
- [首次使用](#首次使用)
- [核心功能](#核心功能)
- [代码片段示例](#代码片段示例)
- [自定义配置](#自定义配置)
- [故障排除](#故障排除)
- [更多资源](#更多资源)

## 安装

### 从 VS Code 市场安装（推荐）

1. 打开 VS Code
2. 按 `Ctrl+Shift+X` (Windows/Linux) 或 `Cmd+Shift+X` (Mac) 打开扩展面板
3. 搜索 "**Xorigo UI**"
4. 点击 "安装" 按钮
5. 安装完成后，重新加载 VS Code

### 从源码安装（开发者）

```bash
# 克隆仓库
git clone https://github.com/xorigo-ui/vscode-extension.git
cd vscode-extension

# 安装依赖
npm install

# 编译
npm run compile

# 打包
npm run package

# 安装到 VS Code
code --install-extension xorigo-ui-snippets-1.0.0.vsix
```

## 首次使用

### 检查安装

1. 打开或创建 `.tsx`、`.jsx`、`.ts` 或 `.js` 文件
2. 输入 `xorigo-` 应该会看到代码片段提示
3. 在侧边栏应该能看到 "Xorigo UI 组件" 视图

### 快速体验

尝试以下操作：

1. **输入组件片段**：
   ```typescript
   xorigo-btn  // 按 Tab 插入 Button 组件
   ```

2. **查看智能补全**：
   ```typescript
   <Bu  // 光标悬停显示 Button 组件信息
   ```

3. **悬停查看文档**：
   ```typescript
   <Button>  // 悬停显示详细文档和使用示例
   ```

## 核心功能

### 1. 💡 智能代码补全

**功能说明**: 自动感知您正在输入的组件名，提供智能补全建议

**使用方法**:
- 在 JSX 中输入组件名开头字母，如 `<Bu` 提示 `Button`
- 输入属性名时自动显示可用属性列表
- 选择属性值时显示枚举选项

**快捷键**:
- `Ctrl+Space` (Windows/Linux) 或 `Cmd+Space` (Mac) - 手动触发补全
- `Tab` 或 `Enter` - 确认补全

### 2. 📚 悬停提示

**功能说明**: 将鼠标悬停在组件名或属性名上查看详细文档

**包含信息**:
- 组件描述和用途
- 所有可用属性列表
- 变体和尺寸选项
- 使用示例代码
- 组件分类

**使用方法**:
```typescript
<Button  // 将鼠标悬停在 "Button" 上查看文档
  variant="primary"  // 悬停在 "variant" 上查看属性详情
>
```

### 3. 🎨 主题预览

**功能说明**: 实时预览和切换 Xor UI 主题

**使用方法**:
- **方法一**: 点击状态栏右侧的 "Xorigo UI" 图标
- **方法二**: 按 `Ctrl+Shift+P` (Windows/Linux) 或 `Cmd+Shift+P` (Mac)，输入 "Xorigo UI: 切换主题"
- **方法三**: 在命令面板中运行 "Xorigo UI: 预览主题"

**支持的10种主题**:
- Corporate Blue（企业蓝）
- Corporate Navy Dark（深蓝）
- Minimal White（极简白）
- Tech Cyan（科技青）
- Creative Purple（创意紫）
- 以及更多...

### 4. ⚡ 代码片段

**功能说明**: 输入前缀快速插入常用组件模板

**使用方法**: 输入前缀后按 `Tab` 键

### 5. 🗂️ 组件浏览器

**功能说明**: 在侧边栏浏览所有可用组件

**使用方法**:
1. 打开侧边栏（`Ctrl+B`）
2. 滚动到 "Xorigo UI 组件" 部分
3. 浏览按分类组织的组件列表
4. 右键点击组件选择操作

**可执行操作**:
- 插入组件到当前文件
- 打开组件文档
- 查看组件详情

## 代码片段示例

### Button 组件

```typescript
// 输入: xorigo-btn
// 输出:

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

### Input 组件

```typescript
// 输入: xorigo-input
// 输出:

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

### 完整表单

```typescript
// 输入: xorigo-form
// 输出:

<form onSubmit={handleSubmit}>
  <div className="space-y-4">
    <Input
      label="Name"
      value={name}
      onChange={setName}
      error={nameError}
      required
    />
    <Input
      type="email"
      label="Email"
      value={email}
      onChange={setEmail}
      error={emailError}
      required
    />
    <Button
      type="submit"
      variant="primary"
      disabled={!isValid}
    >
      Submit
    </Button>
  </div>
</form>
```

## 自定义配置

在 VS Code 设置中可以自定义扩展行为：

### 通过 UI 界面

1. 打开设置 (`Ctrl+,`)
2. 搜索 "Xorigo UI"
3. 调整各项配置

### 通过 JSON 文件

编辑 `.vscode/settings.json`:

```json
{
  // 启用/禁用代码片段
  "xorigoUi.enableSnippets": true,

  // 启用/禁用智能提示
  "xorigoUi.enableIntelliSense": true,

  // 启用/禁用主题预览
  "xorigoUi.enableThemePreview": true,

  // 自动插入导入语句
  "xorigoUi.autoImport": true,

  // 在状态栏显示主题
  "xorigoUi.showThemeInStatusBar": true
}
```

## 故障排除

### 问题1: 代码补全不工作

**可能原因**:
- 文件类型不支持
- 扩展未正确安装
- 配置被禁用

**解决方案**:
1. 确认文件扩展名为 `.tsx`、`.jsx`、`.ts` 或 `.js`
2. 重新加载 VS Code: `Ctrl+Shift+P` > "Developer: Reload Window"
3. 检查设置中的 `xorigoUi.enableSnippets` 为 `true`

### 问题2: 悬停提示不显示

**解决方案**:
1. 确认文件类型支持
2. 检查设置中的 `xorigoUi.enableIntelliSense` 为 `true`
3. 尝试重启 VS Code

### 问题3: 主题预览不工作

**解决方案**:
1. 检查设置中的 `xorigoUi.enableThemePreview` 为 `true`
2. 确认 VS Code 版本 >= 1.80
3. 查看开发者工具控制台是否有错误:
   - 打开: `Ctrl+Shift+I` (Windows/Linux) 或 `Cmd+Option+I` (Mac)
   - 查看 "Console" 面板

### 问题4: 无法安装扩展

**解决方案**:
1. 检查网络连接
2. 确认 VS Code 版本 >= 1.80
3. 尝试关闭其他扩展再安装
4. 查看 VS Code 开发者工具中的错误信息

### 问题5: 测试功能

**运行测试套件**:
```bash
cd extensions/vscode
npm install
npm test
```

## 更多资源

### 官方文档
- [Xorigo UI 官网](https://xorigo-ui.github.io)
- [组件文档](https://xorigo-ui.github.io/docs/components)
- [主题系统](https://xorigo-ui.github.io/docs/themes)

### 社区支持
- [GitHub 仓库](https://github.com/xorigo-ui/vscode-extension)
- [问题反馈](https://github.com/xorigo-ui/vscode-extension/issues)
- [功能建议](https://github.com/xorigo-ui/vscode-extension/discussions)

### 视频教程
- [YouTube: Xorigo UI VS Code 扩展介绍](https://youtube.com/watch?v=example)
- [Bilibili: 快速上手指南](https://bilibili.com/video/example)

---

## 常见问题解答

**Q: 这个扩展是免费的吗？**
A: 是的，Xorigo UI VS Code 扩展完全免费开源。

**Q: 支持 React 19 吗？**
A: 支持！扩展兼容 React 19 及以上版本。

**Q: 可以自定义代码片段吗？**
A: 目前不支持自定义，但会在后续版本中添加此功能。

**Q: 如何报告 Bug？**
A: 请在 [GitHub Issues](https://github.com/xorigo-ui/vscode-extension/issues) 中报告。

**Q: 如何请求新功能？**
A: 请在 [GitHub Discussions](https://github.com/xorigo-ui/vscode-extension/discussions) 中讨论。

---

**祝您使用愉快！** 🎉

如果这个扩展对您有帮助，请在 VS Code 市场中给我们一个 ⭐ ！
