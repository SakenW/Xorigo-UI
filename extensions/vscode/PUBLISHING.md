# Xorigo UI VS Code 扩展发布指南

本文档详细介绍了如何构建、测试和发布 Xorigo UI VS Code 扩展。

## 📋 目录

- [环境准备](#环境准备)
- [本地开发](#本地开发)
- [构建与打包](#构建与打包)
- [测试](#测试)
- [发布到市场](#发布到市场)
- [后续维护](#后续维护)

## 环境准备

### 前置要求

1. **Node.js**: v18+ 或 v20+
2. **npm**: v9+ 或使用 pnpm v9+
3. **VS Code**: 1.80+ 版本
4. **Azure 账号**: 用于发布到 VS Code 市场

### 安装依赖

```bash
cd /home/saken/project/Xorigo-UI/extensions/vscode

# 使用 npm
npm install

# 或使用 pnpm（推荐，项目使用 pnpm）
pnpm install
```

## 本地开发

### 启动开发模式

1. **编译代码**:
   ```bash
   npm run compile
   ```

2. **监听文件变化**:
   ```bash
   npm run watch
   ```

3. **在 VS Code 中调试**:
   - 按 `F5` 键或
   - 在命令面板中运行 "Debug: Start Debugging"
   - 这会打开一个新的 Extension Development Host 窗口

### 调试技巧

#### 使用断点
- 在 `src/extension.ts` 中设置断点
- 在调试窗口中触发扩展功能

#### 查看日志
- 在调试控制台中查看 `console.log` 输出
- 使用 `Output` 面板选择 "Xorigo UI Extension" 查看日志

#### 测试功能
```typescript
// 在 extension.ts 中添加测试代码
console.log('Extension activated!')

// 测试组件注册
const registry = new ComponentRegistry()
await registry.loadComponents()
console.log('Registered components:', registry.getAllComponents())
```

## 构建与打包

### 构建扩展

1. **编译 TypeScript**:
   ```bash
   npm run compile
   ```

2. **检查构建输出**:
   ```bash
   ls -la out/
   ```

3. **确保无错误**:
   ```bash
   npm run lint
   ```

### 创建 VSIX 包

#### 方法一：使用 vsce（推荐）

1. **全局安装 vsce**:
   ```bash
   npm install -g @vscode/vsce
   ```

2. **打包扩展**:
   ```bash
   vsce package
   ```

3. **自定义包名**:
   ```bash
   vsce package --no-git-tag-version --packagePath ./xorigo-ui-snippets-1.0.0.vsix
   ```

#### 方法二：使用 npm 脚本

```bash
npm run package
```

### 验证 VSIX 包

```bash
# 查看包内容
unzip -l xorigo-ui-snippets-1.0.0.vsix

# 安装到本地 VS Code 进行测试
code --install-extension xorigo-ui-snippets-1.0.0.vsix
```

## 测试

### 单元测试

```bash
# 运行所有测试
npm test

# 运行特定测试
npm test -- --grep "ComponentRegistry"
```

### 手动测试清单

#### ✅ 代码补全测试
- [ ] 在 `.tsx` 文件中输入 `<Bu` 出现 Button 补全
- [ ] 选择组件后自动添加属性模板
- [ ] 属性值补全工作正常（variant、size、status）
- [ ] 自动导入功能正常

#### ✅ 悬停提示测试
- [ ] 悬停在组件名上显示详细信息
- [ ] 文档包含属性列表
- [ ] 代码示例正确显示
- [ ] 分类信息正确

#### ✅ 主题预览测试
- [ ] 状态栏显示主题信息
- [ ] 点击状态栏打开主题选择器
- [ ] 主题预览面板正确加载
- [ ] 切换主题生效

#### ✅ 代码片段测试
- [ ] 输入 `xorigo-btn` 插入 Button 模板
- [ ] 输入 `xorigo-input` 插入 Input 模板
- [ ] 输入 `xorigo-form` 插入表单模板
- [ ] 所有 50+ 片段正常工作

#### ✅ 侧边栏测试
- [ ] 组件树视图正确显示
- [ ] 分类正确组织
- [ ] 右键菜单功能正常
- [ ] 搜索功能工作

### 性能测试

```bash
# 检查响应时间
# 代码补全应在 <100ms 内响应
# 悬停提示应在 <50ms 内显示
```

### 兼容性测试

测试以下 VS Code 版本：
- [ ] VS Code 1.80.x
- [ ] VS Code 1.81.x
- [ ] VS Code 1.82.x
- [ ] VS Code 1.83.x

测试以下操作系统：
- [ ] Windows 10/11
- [ ] macOS 12+
- [ ] Ubuntu 20.04+
- [ ] Arch Linux

## 发布到市场

### 准备工作

1. **更新版本号**:
   编辑 `package.json`:
   ```json
   {
     "version": "1.0.0"
   }
   ```

2. **更新 CHANGELOG.md**:
   添加新版本的更新内容

3. **测试最终版本**:
   ```bash
   npm run compile
   npm test
   npm run package
   ```

### 获取 Personal Access Token

1. 登录 [Azure DevOps](https://dev.azure.com)
2. 进入 "User Settings" > "Personal Access Tokens"
3. 创建新的 Token，权限：
   - Marketplace: Manage
   - 过期时间: 1年

### 发布步骤

#### 方法一：使用 vsce（推荐）

```bash
# 登录
vsce login xorigo-ui-team

# 发布
vsce publish

# 或发布特定版本
vsce publish 1.0.0
```

#### 方法二：手动上传

1. 访问 [VS Code 市场发布页面](https://marketplace.visualstudio.com/manage)
2. 点击 "New Extension"
3. 选择 "VS Code"
4. 上传 `.vsix` 文件
5. 填写发布信息
6. 点击发布

### 发布后检查

- [ ] 扩展在市场上可见
- [ ] 下载链接有效
- [ ] 版本号正确
- [ ] 描述和截图正确
- [ ] 兼容性信息正确

## 后续维护

### 监控指标

发布后定期检查：
- **下载量**: 目标 3个月 > 1,000
- **评分**: 保持 > 4.5星
- **安装量**: 持续增长
- **评论**: 及时回复用户反馈

### 更新流程

1. **收集反馈**: 通过 GitHub Issues
2. **制定计划**: 规划下一个版本
3. **开发**: 创建 feature 分支
4. **测试**: 全面测试新功能
5. **发布**: 使用 vsce publish

### 版本策略

- **主版本 (x.0.0)**: 重大更新，不兼容变更
- **次版本 (1.x.0)**: 新功能，向后兼容
- **修订版本 (1.0.x)**: 修复和优化

### 更新频率

- **安全更新**: 24小时内
- **Bug 修复**: 1周内
- **新功能**: 每月一次
- **大版本**: 每季度一次

## 常见问题

### Q: 构建失败，提示缺少依赖

A: 检查 `node_modules` 是否完整，重新安装：
```bash
rm -rf node_modules
npm install
```

### Q: 发布时提示权限错误

A: 检查 PAT token 权限，确保包含 Marketplace: Manage

### Q: 扩展无法在 VS Code 中加载

A: 检查：
1. `package.json` 中的 `activationEvents`
2. `main` 字段指向正确的入口文件
3. 使用 `F5` 调试查看错误信息

### Q: 代码补全不工作

A: 检查：
1. 文件类型是否支持（.tsx, .jsx, .ts, .js）
2. 配置项 `xorigoUi.enableSnippets` 是否启用
3. 重新加载窗口：`Ctrl+Shift+P` > "Developer: Reload Window"

### Q: 主题预览不显示

A: 检查：
1. 配置项 `xorigoUi.enableThemePreview` 是否启用
2. VS Code 版本是否 >= 1.80
3. 查看开发者工具控制台是否有错误

## 联系信息

- **项目仓库**: https://github.com/xorigo-ui/vscode-extension
- **问题反馈**: https://github.com/xorigo-ui/vscode-extension/issues
- **邮件**: extensions@xorigo-ui.com

---

**祝发布顺利！** 🚀
