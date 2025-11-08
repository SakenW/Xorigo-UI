# 🚀 开发阶段版本号管理指南

> **版本**: 0.1.0-alpha.0
> **更新时间**: 2025-11-08
> **适用场景**: 开发阶段，不使用正式版本号

## 📦 开发版本号格式

### 当前版本状态
```
✅ 当前版本: 0.1.0-alpha.0
🔶 开发阶段: Alpha (早期开发)
```

### 开发版本号规则

| 阶段 | 格式 | 说明 | 示例 |
|------|------|------|------|
| **Alpha** | `0.1.0-alpha.X` | 早期开发，功能不稳定 | `0.1.0-alpha.0` |
| **Beta** | `0.1.0-beta.X` | 功能测试，基本稳定 | `0.1.0-beta.0` |
| **RC** | `0.1.0-rc.X` | 发布候选，功能完整 | `0.1.0-rc.0` |
| **Dev** | `0.1.0-dev.YYYYMMDD` | 日常开发，带日期 | `0.1.0-dev.20251108` |
| **Snapshot** | `0.1.0-SNAPSHOT` | 快照版本，频繁更新 | `0.1.0-SNAPSHOT` |

## 🛠️ 版本管理工具

### 使用版本管理器

```bash
# 切换到不同开发阶段
node scripts/develop-version-manager.js alpha    # → 0.1.0-alpha.0
node scripts/develop-version-manager.js beta     # → 0.1.0-beta.0
node scripts/develop-version-manager.js rc       # → 0.1.0-rc.0
node scripts/develop-version-manager.js dev      # → 0.1.0-dev.20251108
node scripts/develop-version-manager.js snapshot # → 0.1.0-SNAPSHOT

# 自定义版本号
node scripts/develop-version-manager.js 0.1.0-alpha.1
```

### 手动更新版本

```bash
# 方法1: npm version (推荐)
npm version prerelease --preid=alpha  # 0.1.0-alpha.1
npm version prerelease --preid=beta   # 0.1.0-beta.1
npm version prerelease --preid=rc     # 0.1.0-rc.1

# 方法2: 直接修改package.json
# 手动修改 packages/core/package.json 中的 version 字段
```

## 🎯 开发阶段推荐

### 1. 项目初期 (0.1.0-alpha.0)
- ✅ **状态**: 核心功能开发中
- ✅ **稳定性**: 可能 breaking changes
- ✅ **适用**: 内部开发，API不稳定

### 2. 功能开发 (0.1.0-dev.20251108)
- ✅ **状态**: 功能快速迭代
- ✅ **稳定性**: 基本功能可用
- ✅ **适用**: 日常开发，功能测试

### 3. 内部测试 (0.1.0-beta.0)
- ✅ **状态**: 功能基本稳定
- ✅ **稳定性**: API基本确定
- ✅ **适用**: 内部测试，小范围试用

### 4. 发布前 (0.1.0-rc.0)
- ✅ **状态**: 功能完整，准备发布
- ✅ **稳定性**: 生产就绪
- ✅ **适用**: 最终测试，发布准备

## 📋 版本检查命令

```bash
# 检查当前版本状态
node scripts/develop-version-manager.js

# 检查包状态
node scripts/check-package-status.js

# 验证包构建
pnpm build
pnpm test
```

## 🔄 版本发布流程

### 开发阶段 → 测试阶段
```bash
# 1. 更新到beta版本
node scripts/develop-version-manager.js beta

# 2. 构建测试
pnpm build
pnpm test

# 3. 发布到私有仓库
npm publish --access private
```

### 测试阶段 → 发布准备
```bash
# 1. 更新到RC版本
node scripts/develop-version-manager.js rc

# 2. 完整测试
pnpm test:run
pnpm build

# 3. 准备发布
npm version prerelease --preid=rc
```

## 🚨 注意事项

### ❌ 避免的做法
- 不要在开发阶段使用正式版本号 (如 1.0.0)
- 不要跳过版本阶段 (alpha → beta → rc)
- 不要在开发阶段发布到公开NPM

### ✅ 推荐的做法
- 使用语义化版本控制 (SemVer)
- 在开发阶段使用 prerelease 标识
- 保持版本号的递增性
- 及时更新CHANGELOG

### 📝 版本记录
建议记录重要的版本变更：

```markdown
## v0.1.0-alpha.0 (2025-11-08)
- ✨ 新增: 开发版本管理器
- 🐛 修复: 组件预览功能
- 📦 配置: 开发版本号配置

## v0.1.0-alpha.1 (待发布)
- ...
```

## 🌐 外部使用建议

### 开发阶段包安装
```bash
# 安装开发版本
npm install @xorigo-ui/core@alpha

# 或安装特定版本
npm install @xorigo-ui/core@0.1.0-alpha.0
```

### 项目配置示例
```json
{
  "dependencies": {
    "@xorigo-ui/core": "0.1.0-alpha.0"
  },
  "engines": {
    "node": ">=22.0.0"
  }
}
```

---

**🎯 当前版本**: `0.1.0-alpha.0`
**📅 下一步**: 根据开发进度选择合适的版本策略