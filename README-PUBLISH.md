# 🚀 Xorigo UI NPM发布系统

## 🎯 快速开始

### 发布你的第一个版本

1. **添加变更集**
```bash
npm run changeset
# 选择变更类型：patch/minor/major
# 描述你的变更
```

2. **提交代码**
```bash
git add .
git commit -m "feat: add awesome feature"
git push origin main
```

3. **自动发布**
- GitHub Actions会自动检测变更并发布
- 查看Actions页面确认发布状态

## 📦 发布环境

| 环境 | 命令 | 说明 |
|------|------|------|
| Production | `npm run release` | 发布到npm (latest标签) |
| Beta | `npm run release:beta` | 发布到npm (beta标签) |
| Alpha | `npm run release:alpha` | 发布到npm (alpha标签) |

## 🔍 发布前检查

```bash
# 完整验证
npm run release:validate

# 包健康检查
node scripts/publish-monitor.js health

# 发布准备检查
node scripts/publish-monitor.js ready
```

## 🚨 紧急回滚

```bash
# 回滚单个包
node scripts/rollback-release.js package @xorigo-ui/core "紧急修复"

# 回滚所有包
node scripts/rollback-release.js all "严重bug"
```

## 📊 监控和统计

- GitHub Actions: 自动化CI/CD
- NPM下载量: 包使用统计
- 安全扫描: 漏洞检测和修复
- CodeQL: 代码安全分析

## 📚 更多文档

- [完整工作流程](./docs/deployment/NPM-PUBLISH-WORKFLOW.md)
- [API文档](https://xorigo-ui.github.io/docs)
- [组件示例](https://xorigo-ui.github.io)

---

**需要帮助？** 查看 [完整文档](./docs/deployment/NPM-PUBLISH-WORKFLOW.md) 或创建 [GitHub Issue](https://github.com/your-org/xorigo-ui/issues)