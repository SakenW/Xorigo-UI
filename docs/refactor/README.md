# 🔄 Xorigo-UI 重构与校验一体化文档

本目录包含 Xorigo-UI 完整的重构执行文档，涵盖按需打包、主题系统解耦、a11y 自动化、视觉回归、SSR 兼容和发版流水线等核心改进。

## 📁 目录结构

```
docs/refactor/
├── README.md                    # 本文件，总览说明
├── core/                        # 核心文档
│   ├── ARCH-REFACTOR-AND-VALIDATION.md    # 重构与校验一体化执行手册
│   ├── refactor-execution-plan.yaml       # 机器可读执行计划
│   └── EXECUTION-GUIDE.md                 # 详细执行指南
├── templates/                   # 配置文件模板
│   ├── README.md                          # 模板使用说明
│   ├── vite.config.ts                     # Vite 构建配置模板
│   ├── package.exports.json              # package.json 导出配置
│   ├── playwright.config.ts               # Playwright 测试配置
│   ├── a11y-dialog.spec.ts               # a11y 测试模板
│   ├── visual-button.spec.ts              # 视觉回归测试模板
│   ├── changeset-config.json              # Changesets 配置
│   ├── github-workflow-release.yml        # GitHub Actions 工作流
│   └── tokens-index.ts                    # 设计令牌系统模板
└── scripts/                     # 自动化脚本
    └── check-architecture-consistency.sh  # 架构一致性检查脚本
```

## 🎯 重构目标

- **构建优化**：实现按需打包和 Tree-shaking 优化
- **主题解耦**：完善 Tokens/Theme/Core 三层架构
- **a11y 自动化**：集成 axe-core 和键盘矩阵测试
- **视觉回归**：建立自动化截图对比机制
- **SSR 兼容**：确保 Next.js 15 + React 19 完全兼容
- **发版流水线**：建设语义化版本管理和 CI/CD

## 🚀 快速开始

### 1. 理解重构范围
```bash
# 阅读核心技术规范
cat core/ARCH-REFACTOR-AND-VALIDATION.md

# 查看机器可读执行计划
cat core/refactor-execution-plan.yaml
```

### 2. 准备执行环境
```bash
# 运行架构一致性检查
bash scripts/check-architecture-consistency.sh

# 按照执行指南开始
cat core/EXECUTION-GUIDE.md
```

### 3. 使用配置模板
```bash
# 查看可用模板
ls templates/

# 复制需要的配置
cp templates/vite.config.ts packages/core/vite.config.ts.new
cp templates/playwright.config.ts packages/core/playwright.config.ts.new
```

## 📋 执行阶段

重构分为 6 个主要阶段，预计总时长 14-20 天：

1. **Phase 1**: 构建优化与按需打包（2-3 天）
2. **Phase 2**: 主题系统三层解耦（2-3 天）
3. **Phase 3**: a11y 自动化集成（3-4 天）
4. **Phase 4**: 视觉回归保护（2-3 天）
5. **Phase 5**: SSR 兼容性优化（2-3 天）
6. **Phase 6**: 发版流水线建设（3-4 天）

详细步骤请参考 `core/EXECUTION-GUIDE.md`。

## 🛡️ 质量保证

### 架构守卫
```bash
# 自动检查架构一致性
bash scripts/check-architecture-consistency.sh
```

### 质量门禁
- TypeScript 类型检查
- ESLint 代码质量检查
- 单元测试覆盖率 > 80%
- a11y 检测 0 violations
- 视觉回归阈值 < 0.02

## 🔧 故障排除

### 常见问题
1. **构建失败**：检查依赖版本和配置文件
2. **测试失败**：确保 Playwright 浏览器已安装
3. **架构违规**：运行架构检查脚本并修复问题

### 回滚程序
```bash
# 紧急回滚
git checkout main
git reset --hard HEAD~1
npm install
npm run build
```

## 📞 支持

### 文档导航
- **核心技术规范**：`core/ARCH-REFACTOR-AND-VALIDATION.md`
- **执行指南**：`core/EXECUTION-GUIDE.md`
- **配置模板**：`templates/`
- **自动化脚本**：`scripts/`

### 相关资源
- **项目架构文档**：`../WEBSITE-ARCHITECTURE/`
- **开发指南**：`../../CLAUDE.md`
- **项目根目录**：`../../`

---

**维护者**：Xorigo-UI Team
**创建时间**：2025-10-16
**版本**：v1.0

> 💡 **提示**：建议先阅读 `core/ARCH-REFACTOR-AND-VALIDATION.md` 了解整体规划，然后按照 `core/EXECUTION-GUIDE.md` 的步骤执行。