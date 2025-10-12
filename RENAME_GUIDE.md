# Xorigo UI (原点 UI) 重命名指南

## 🎯 重命名目标

将 **Xorigo UI** 完全重命名为 **Xorigo UI (原点 UI)**，包括所有相关的文件、配置和引用。

## 📁 已创建的脚本

### 1. 主要重命名脚本
- **文件**: `scripts/rename-to-xorigo.sh`
- **用途**: 执行完整的重命名操作
- **权限**: 可执行 (`chmod +x`)

### 2. 验证脚本
- **文件**: `scripts/verify-rename.js`
- **用途**: 验证重命名是否完成，检查遗漏
- **权限**: 可执行 (`chmod +x`)

### 3. 回滚脚本
- **文件**: `scripts/rollback-rename.sh`
- **用途**: 如果出现问题，回滚到 Xorigo UI
- **权限**: 可执行 (`chmod +x`)

## 🚀 执行步骤

### 第一步：创建备份（可选）
```bash
# 手动创建备份
cp -r . ../xorigo-ui-backup-$(date +%Y%m%d)
```

### 第二步：执行重命名
```bash
# 运行重命名脚本
./scripts/rename-to-xorigo.sh
```

脚本会自动：
- 📦 更新所有 `package.json` 文件
- 📄 更新文档文件 (README, CLAUDE.md)
- 🔧 更新源码文件中的引用
- 🌐 更新国际化文件
- 📁 重命名配置文件
- 🧹 清理缓存并重新安装依赖

### 第三步：验证结果
```bash
# 运行验证脚本
./scripts/verify-rename.js
```

验证脚本会检查：
- 🔍 文件内容中是否还有 Xorigo UI 引用
- 📦 包名是否正确更新
- 🔧 配置文件是否正确重命名

### 第四步：测试构建
```bash
# 测试构建
npm run build

# 测试开发环境
npm run dev
```

## 📋 重命名映射表

| 原名称 | 新名称 | 影响范围 |
|--------|--------|----------|
| Xorigo UI | Xorigo UI | 品牌名称 |
| xorigo-ui | xorigo-ui | 小写标识符 |
| @xorigo-ui | @xorigo-ui | npm 包名 |
| Xorigo UI Team | Xorigo UI Team | 团队名称 |
| xorigo-ui-locale | xorigo-ui-locale | 本地存储键 |
| xorigo-ui-locale-change | xorigo-ui-locale-change | 事件名称 |
| xorigo-ui.config.json | xorigo-ui.config.json | 配置文件 |

## 🎯 涉及的文件

### 核心配置文件
- ✅ `package.json` - 根包配置
- ✅ `packages/*/package.json` - 所有子包配置
- ✅ `apps/*/package.json` - 应用配置
- ✅ `xorigo-ui.config.json` → `xorigo-ui.config.json`

### 文档文件
- ✅ `CLAUDE.md` - 开发指南
- ✅ `README.md` - 项目说明
- ✅ `packages/i18n/README.md` - i18n 包文档

### 源码文件
- ✅ `packages/i18n/src/core/I18nManager.ts`
- ✅ `packages/i18n/src/index.ts`
- ✅ `packages/i18n/examples/basic-usage.ts`
- ✅ `packages/i18n/src/locales/zh-CN/*.json`

### 配置文件
- ✅ `eslint.config.js`
- ✅ `postcss.config.js`

## ⚠️ 注意事项

### 1. 备份重要性
- 脚本会自动创建备份目录 `backup-YYYYMMDD-HHMMSS`
- 备份包含所有关键的 `package.json` 和 `CLAUDE.md` 文件
- 如需回滚，可使用 `rollback-rename.sh` 脚本

### 2. 依赖重新安装
- 脚本会自动清理 `node_modules` 和构建产物
- 自动运行 `npm install` 重新安装依赖
- 确保所有包引用使用新的名称

### 3. Git 提交
- 重命名完成后，建议创建单独的 Git 提交
- 提交信息建议：`refactor: rename Xorigo UI to Xorigo UI (原点 UI)`

### 4. 外部服务
- 如果已发布到 npm，需要更新包名
- 如果有 CI/CD 流程，需要更新配置
- 如果有文档网站，需要更新部署配置

## 🔧 故障排除

### 问题：脚本执行失败
```bash
# 检查脚本权限
ls -la scripts/rename-to-xorigo.sh

# 添加执行权限
chmod +x scripts/rename-to-xorigo.sh
```

### 问题：验证脚本发现问题
```bash
# 手动修复特定文件
# 或重新运行重命名脚本
./scripts/rename-to-xorigo.sh
```

### 问题：需要回滚
```bash
# 运行回滚脚本
./scripts/rollback-rename.sh
```

## 📊 验证清单

重命名完成后，请验证以下项目：

- [ ] 所有 `package.json` 中的 `name` 字段已更新
- [ ] 所有文档中的品牌名称已更新
- [ ] 源码中的引用已更新
- [ ] 配置文件已重命名
- [ ] 国际化文件已更新
- [ ] 构建成功 (`npm run build`)
- [ ] 开发环境正常 (`npm run dev`)
- [ ] 验证脚本通过 (`./scripts/verify-rename.js`)

## 🎉 完成后

重命名成功完成后：
1. 📝 提交代码变更
2. 🏷️ 创建 Git 标签 (如需要)
3. 📦 更新 npm 包信息
4. 🌐 更新文档网站
5. 📢 发布重命名公告

---

**注意**: 此重命名过程是单向的，请确保在执行前已充分备份，并验证所有更改。