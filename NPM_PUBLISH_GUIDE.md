# 🚀 Xorigo UI NPM 发布指南

> **当前版本**: 0.1.0-dev.20251108
> **发布状态**: 准备就绪
> **更新时间**: 2025-11-08

## 📋 发布前准备

### ✅ 1. 登录 NPM

您需要先登录到 NPM：

```bash
# 方法1: 使用命令行登录（推荐）
npm login

# 输入您的 NPM 用户名、密码和邮箱
```

或者，如果您已经有 Access Token：

```bash
# 方法2: 使用 Access Token
# 在项目根目录创建 .npmrc 文件，添加：
# //registry.npmjs.org/:_authToken=YOUR_ACCESS_TOKEN
```

### ✅ 2. 检查包配置

当前包配置：
- **包名**: @xorigo-ui/core
- **版本**: 0.1.0-dev.20251108
- **状态**: 开发版本

### ✅ 3. 构建检查

```bash
# 检查构建状态
ls packages/core/dist/

# 如果需要重新构建
pnpm build
```

## 🎯 发布选项

### 选项1: 发布开发版本（推荐）

```bash
# 发布当前开发版本
pnpm publish:alpha

# 或使用脚本
node scripts/publish-package.js alpha
```

这将发布为 `@xorigo-ui/core@0.1.0-dev.20251108`

### 选项2: 切换到正式版本后发布

```bash
# 切换到正式版本号
pnpm dev:stage start  # 0.1.0-alpha.0

# 然后发布
pnpm publish:alpha
```

### 选项3: 发布为私有包

如果您想发布为私有包：

```bash
# 修改 packages/core/package.json
# 添加 "publishConfig": { "access": "restricted" }

# 然后发布
npm publish --access restricted
```

## 🚀 一键发布命令

我已经为您准备了便捷的发布命令：

### 开发版本发布
```bash
# 检查发布环境
pnpm publish:setup

# 发布 Alpha 版本
pnpm publish:alpha

# 发布 Beta 版本
pnpm publish:beta

# 发布 RC 版本
pnpm publish:rc

# 发布正式版本
pnpm publish:core
```

## 📦 发布后验证

发布成功后，您可以：

1. **检查 NPM 页面**:
   - 访问: https://www.npmjs.com/package/@xorigo-ui/core
   - 验证版本号和描述

2. **测试安装**:
   ```bash
   npm install @xorigo-ui/core@alpha
   ```

3. **查看包信息**:
   ```bash
   npm view @xorigo-ui/core
   ```

## ⚠️ 注意事项

### 开发版本特点
- ✅ 包含 `-dev.` 标识
- ✅ 适合开发测试
- ✅ 不会影响正式版本
- ✅ 可以随时更新

### 版本号规则
- `0.1.0-dev.YYYYMMDD` - 日常开发版本
- `0.1.0-alpha.X` - Alpha 测试版本
- `0.1.0-beta.X` - Beta 测试版本
- `0.1.0-rc.X` - 发布候选版本
- `0.1.0` - 正式版本

## 🔧 故障排除

### 常见问题

**1. 权限错误**
```bash
# 确保您是包的维护者
npm access ls-collaborators @xorigo-ui/core
```

**2. 版本冲突**
```bash
# 检查当前版本
npm view @xorigo-ui/core version

# 更新版本号
pnpm dev:stage start
```

**3. 构建错误**
```bash
# 清理并重新构建
rm -rf packages/core/dist
pnpm build
```

## 📞 支持信息

- **NPM 包管理**: https://www.npmjs.com/settings/xorigo/packages
- **项目仓库**: 您的 GitHub 仓库
- **文档**: ./EXTERNAL_USAGE_GUIDE.md

---

**🎯 准备发布**: 一旦您登录 NPM，就可以使用 `pnpm publish:alpha` 发布！