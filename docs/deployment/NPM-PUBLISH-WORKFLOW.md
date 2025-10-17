# 🚀 Xorigo UI NPM包发布工作流程

## 📋 概述

本文档描述了Xorigo UI组件库的完整NPM包发布自动化流程，包括版本管理、多环境发布、安全扫描和监控回滚机制。

## 🏗️ 系统架构

### 核心组件
- **Changesets**: 版本管理和变更日志生成
- **GitHub Actions**: CI/CD自动化
- **NPM Registry**: 包发布平台
- **安全扫描**: 多层次安全检查
- **监控告警**: 实时状态监控

### 发布流程图
```
开发完成 → 添加Changeset → 提交PR → CI验证 → 合并主分支 → 自动发布 → 监控反馈
    ↑                                                            ↓
回滚机制 ←──── 紧急响应 ←─────── 问题发现 ←───── 发布验证 ←────────┘
```

## 🔄 日常工作流程

### 1. 开发阶段
```bash
# 1. 创建功能分支
git checkout -b feat/new-component

# 2. 开发功能
# ... 编写代码 ...

# 3. 添加Changeset
npm run changeset

# 4. 提交代码
git add .
git commit -m "feat: add new component"
git push origin feat/new-component

# 5. 创建Pull Request
# 等待CI自动验证
```

### 2. Changeset配置
添加Changeset时，系统会询问：
- **变更类型**: patch/minor/major
- **影响范围**: 哪些包会受影响
- **变更描述**: 详细的变更说明

示例Changeset内容：
```yaml
---
"@xorigo-ui/core": patch
"@xorigo-ui/tokens": patch
---

🚀 Features:
- 新增Button组件变体支持
- 优化tokens颜色定义

🐛 Bug Fixes:
- 修复Modal组件z-index问题
```

### 3. 发布触发条件
自动发布在以下情况触发：
- ✅ 主分支有未发布的Changesets
- ✅ 所有CI检查通过
- ✅ 代码质量验证通过
- ✅ 安全扫描无高危漏洞

## 🎯 多环境发布策略

### 发布环境
| 环境 | NPM标签 | 发布时机 | 用户群体 |
|------|---------|----------|----------|
| Production | `latest` | 主分支合并 | 所有用户 |
| Beta | `beta` | 手动触发 | 测试用户 |
| Alpha | `alpha` | 手动触发 | 内部开发 |

### 手动发布
```bash
# 发布Beta版本
npm run release:beta

# 发布Alpha版本
npm run release:alpha

# 手动触发完整发布
npm run release

# 预演发布（不实际发布）
npm run release:dry-run
```

### GitHub Actions手动发布
在GitHub Actions页面可以手动触发发布：
1. 进入Actions页面
2. 选择"Release"工作流
3. 点击"Run workflow"
4. 选择版本类型和发布标签

## 🔒 安全检查流程

### 自动安全扫描
每次发布前自动执行：
- **依赖安全扫描**: npm audit + Snyk
- **代码安全扫描**: CodeQL + Semgrep
- **密钥泄露检测**: Gitleaks + TruffleHog
- **容器安全扫描**: Trivy + Grype
- **许可证合规检查**: 开源许可证验证

### 安全阈值
- 🚫 **阻止发布**: 高危安全漏洞
- ⚠️ **警告发布**: 中危漏洞
- ✅ **允许发布**: 低危漏洞或无漏洞

### 安全配置
```json
{
  "auditLevel": "high",
  "allowedLicenses": ["MIT", "Apache-2.0", "BSD-2-Clause", "BSD-3-Clause"],
  "blockDeprecatedPackages": true
}
```

## 📊 监控和告警

### 发布监控
发布完成后自动执行：
- **包可用性检查**: 确认包可以在NPM安装
- **版本一致性验证**: 确认所有包版本同步
- **下载量监控**: 跟踪包使用情况
- **错误监控**: 监控安装和使用错误

### 监控脚本
```bash
# 检查包健康状态
node scripts/publish-monitor.js health

# 检查发布准备状态
node scripts/publish-monitor.js ready

# 完整监控检查
node scripts/publish-monitor.js all
```

### 告警机制
- **Slack通知**: 发布状态实时通知
- **邮件通知**: 重大问题邮件提醒
- **GitHub Issues**: 自动创建问题跟踪

## 🚨 紧急回滚流程

### 回滚触发条件
- 🚨 **严重安全漏洞**
- 🚨 **功能严重破坏**
- 🚨 **性能严重下降**
- 🚨 **兼容性问题**

### 自动回滚
```bash
# 回滚单个包
node scripts/rollback-release.js package @xorigo-ui/core "修复安全漏洞"

# 回滚所有包
node scripts/rollback-release.js all "紧急修复"

# 检查可回滚版本
node scripts/rollback-release.js check

# 强制回滚（跳过确认）
node scripts/rollback-release.js package @xorigo-ui/core "紧急修复" --force
```

### 回滚步骤
1. **确认问题**: 验证问题严重程度
2. **选择回滚版本**: 确定目标版本
3. **执行回滚**: 运行回滚脚本
4. **验证回滚**: 确认回滚成功
5. **通知团队**: 告知相关开发人员
6. **问题修复**: 修复导致回滚的问题
7. **重新发布**: 修复后重新发布

## 🔧 开发者工具

### 版本管理工具
```bash
# 添加新的变更集
npm run changeset

# 更新版本号（基于changesets）
npm run version-packages

# 生成变更日志
npx changeset generate

# 进入预发布模式
npx changeset pre enter beta
npx changeset pre exit
```

### 发布前验证
```bash
# 完整验证流程
npm run release:validate

# 手动验证清单
npm run lint
npm run type-check
npm run test
npm run build:all
npm run security:audit
```

### 包大小分析
```bash
# 分析包大小
node scripts/bundle-analyzer.js

# 检查包大小趋势
cat bundle-analysis.json | jq '.packages'
```

## 📋 发布清单

### 发布前检查清单
- [ ] 代码已通过所有测试
- [ ] 类型检查无错误
- [ ] 代码检查通过
- [ ] 安全扫描无高危漏洞
- [ ] Changeset已添加
- [ ] 构建成功
- [ ] 文档已更新
- [ ] 变更日志已生成

### 发布后检查清单
- [ ] 包成功发布到NPM
- [ ] 版本号正确更新
- [ ] GitHub Release已创建
- [ ] 变更日志正确
- [ ] 网站已更新（如需要）
- [ ] 监控告警正常
- [ ] 团队已通知

## 🛠️ 故障排除

### 常见问题

#### 1. 发布失败
**问题**: Changeset发布失败
```bash
# 检查NPM Token
echo $NPM_TOKEN

# 检查包权限
npm owner ls @xorigo-ui/core

# 重新登录
npm login
```

#### 2. 版本冲突
**问题**: 版本号冲突
```bash
# 检查当前版本
npm view @xorigo-ui/core

# 手动更新版本
npm version patch --no-git-tag-version

# 清理Changesets
rm .changeset/*.md
```

#### 3. 构建失败
**问题**: 构建过程中断
```bash
# 清理缓存
npm run clean
rm -rf node_modules
npm ci

# 重新构建
npm run build:all
```

#### 4. 安全扫描失败
**问题**: 发现安全漏洞
```bash
# 查看详细报告
npm audit

# 修复漏洞
npm audit fix

# 更新依赖
npm update
```

### 获取帮助
- 📖 **文档**: [完整文档](https://xorigo-ui.github.io/docs)
- 🐛 **问题反馈**: [GitHub Issues](https://github.com/your-org/xorigo-ui/issues)
- 💬 **讨论**: [GitHub Discussions](https://github.com/your-org/xorigo-ui/discussions)
- 📧 **邮件**: dev-team@xorigo-ui.com

## 📚 参考资源

### 官方文档
- [Changesets文档](https://github.com/changesets/changesets)
- [GitHub Actions文档](https://docs.github.com/en/actions)
- [NPM发布文档](https://docs.npmjs.com/cli/v8/commands/npm-publish)

### 工具文档
- [Snyk安全扫描](https://snyk.io/)
- [CodeQL代码分析](https://codeql.github.com/)
- [Semgrep安全扫描](https://semgrep.dev/)

### 最佳实践
- [语义化版本控制](https://semver.org/)
- [Conventional Commits](https://conventionalcommits.org/)
- [开源许可证选择](https://choosealicense.com/)

---

**维护者**: Xorigo UI DevOps Team
**更新时间**: 2025-10-16
**版本**: 1.0.0