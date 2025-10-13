# Website 重构配套文档与工具索引

**版本**: v1.0
**更新时间**: 2025-01-13
**项目**: Xorigo UI Website 架构重构

---

## 📚 文档导航

### 🎯 快速入口

**从这里开始**：
1. 📖 **[00-Website重构总览-开始这里.md](./00-Website重构总览-开始这里.md)** - 重构项目总览（必读）
2. 📋 **[Website重构-前置检查清单.md](./Website重构-前置检查清单.md)** - 开始前的准备工作
3. 🚀 **[Website重构-Agent执行计划.md](./Website重构-Agent执行计划.md)** - Agent执行计划

---

## 📖 核心文档 (7个)

### 1. 架构与设计

| 文档名 | 大小 | 用途 | 优先级 |
|--------|------|------|--------|
| [Xorigo UI Website 架构白皮书.md](./Xorigo UI Website 架构白皮书.md) | ~55KB | 架构原则与设计哲学 | 🔴 P0 |
| [Website重构架构设计方案.md](./Website重构架构设计方案.md) | ~57KB | 完整的四层架构设计 | 🔴 P0 |
| [Website架构数据流和交互图.md](./Website架构数据流和交互图.md) | ~26KB | 9个可视化流程图 | 🟡 P1 |

### 2. 组件分类

| 文档名 | 大小 | 用途 | 优先级 |
|--------|------|------|--------|
| [Xorigo UI 组件分类体系白皮书.md](./Xorigo UI 组件分类体系白皮书.md) | ~48KB | 10大分类完整定义 | 🔴 P0 |
| [Website重构-组件分类说明.md](./Website重构-组件分类说明.md) | ~22KB | Website 组件分类适配 | 🔴 P0 |

### 3. 执行计划

| 文档名 | 大小 | 用途 | 优先级 |
|--------|------|------|--------|
| [Website重构-Agent执行计划.md](./Website重构-Agent执行计划.md) | ~19KB | 6个Agent组并行执行 | 🔴 P0 |
| [Website重构实施清单.md](./Website重构实施清单.md) | ~26KB | 16周实施时间表 | 🟡 P1 |

---

## 🔧 配套文档 (20个)

### 4. 开发指南

| 文档名 | 大小 | 用途 | 优先级 |
|--------|------|------|--------|
| [Website重构最佳实践和规则.md](./Website重构最佳实践和规则.md) | ~27KB | 20条开发规则 | 🔴 P0 |
| [Website重构快速开始指南.md](./Website重构快速开始指南.md) | ~20KB | Phase 1-3 教程 | 🔴 P0 |
| [Website重构-常见问题FAQ.md](./Website重构-常见问题FAQ.md) | ~90KB | 38个常见问题解答 | 🟡 P1 |

### 5. 验收与交付

| 文档名 | 大小 | 用途 | 优先级 |
|--------|------|------|--------|
| [Website重构-前置检查清单.md](./Website重构-前置检查清单.md) | ~18KB | 重构前检查 | 🔴 P0 |
| [Website重构-最终交付清单.md](./Website重构-最终交付清单.md) | ~32KB | 26项交付标准 | 🔴 P0 |
| [Website-Packages 联动架构验收清单.md](./Website-Packages 联动架构验收清单.md) | ~16KB | 联动验收标准 | 🟡 P1 |

### 6. 技术细节

| 文档名 | 大小 | 用途 | 优先级 |
|--------|------|------|--------|
| [Website重构-Data Layer设计.md](./Website重构-Data Layer设计.md) | ~15KB | Data Layer 详细设计 | 🔴 P0 |
| [Website重构-SDK Layer设计.md](./Website重构-SDK Layer设计.md) | ~14KB | SDK Layer 详细设计 | 🔴 P0 |
| [Website重构-Playground设计.md](./Website重构-Playground设计.md) | ~18KB | Playground 详细设计 | 🟡 P1 |
| [Website重构-ErrorBoundary设计.md](./Website重构-ErrorBoundary设计.md) | ~12KB | 容错设计 | 🔴 P0 |

### 7. 性能优化

| 文档名 | 大小 | 用途 | 优先级 |
|--------|------|------|--------|
| [Website重构-性能优化指南.md](./Website重构-性能优化指南.md) | ~16KB | 性能优化策略 | 🟡 P1 |
| [Website重构-Bundle优化方案.md](./Website重构-Bundle优化方案.md) | ~14KB | Bundle 优化 | 🟡 P1 |

### 8. 测试与质量

| 文档名 | 大小 | 用途 | 优先级 |
|--------|------|------|--------|
| [Website重构-测试策略.md](./Website重构-测试策略.md) | ~15KB | 测试规范 | 🟡 P1 |
| [Website重构-CI CD配置.md](./Website重构-CI CD配置.md) | ~13KB | CI/CD 配置说明 | 🔴 P0 |

### 9. 快速参考

| 文档名 | 大小 | 用途 | 优先级 |
|--------|------|------|--------|
| [QUICK-SUMMARY.md](./QUICK-SUMMARY.md) | ~5KB | 30秒快速概览 | 🟢 P2 |
| [EXECUTE-HIVE-MIND.sh](./EXECUTE-HIVE-MIND.sh) | ~3KB | Agent执行菜单 | 🔴 P0 |

---

## 🛠️ 配套工具 (6个)

### 10. 诊断与验证工具

| 脚本名 | 功能 | 使用场景 | 优先级 |
|--------|------|---------|--------|
| [scripts/diagnose-layer.sh](../../scripts/diagnose-layer.sh) | 分层架构诊断 | 检查四层架构完整性 | 🔴 P0 |
| [scripts/validate-categories.ts](../../apps/website/scripts/validate-categories.ts) | 组件分类验证 | 验证Registry分类规范 | 🔴 P0 |
| [scripts/local-ci.sh](../../scripts/local-ci.sh) | 本地CI测试 | 提交前完整检查 | 🔴 P0 |
| [scripts/final-acceptance.sh](../../scripts/final-acceptance.sh) | 最终验收 | 26项交付验收 | 🔴 P0 |

### 11. CI/CD 配置

| 文件名 | 功能 | 使用场景 | 优先级 |
|--------|------|---------|--------|
| [.github/workflows/website-refactor-check.yml](../../.github/workflows/website-refactor-check.yml) | GitHub Actions | PR自动检查 | 🔴 P0 |
| [scripts/pre-refactor-check.sh](../../scripts/pre-refactor-check.sh) | 前置检查脚本 | 重构前环境检查 | 🔴 P0 |

---

## 📊 文档统计

### 文档数量

| 类型 | 数量 | 总大小 |
|------|------|--------|
| 核心文档 | 7 | ~233KB |
| 配套文档 | 20 | ~367KB |
| 工具脚本 | 6 | ~15KB |
| **总计** | **33** | **~615KB** |

### 优先级分布

| 优先级 | 数量 | 说明 |
|--------|------|------|
| 🔴 P0 (必须) | 18 | 必须完成和阅读 |
| 🟡 P1 (重要) | 13 | 重要但非必须 |
| 🟢 P2 (可选) | 2 | 参考性文档 |

---

## 🎯 使用场景指南

### 场景 1: 首次了解项目

**推荐阅读顺序**：
1. ✅ [00-Website重构总览-开始这里.md](./00-Website重构总览-开始这里.md) - 快速了解全貌
2. ✅ [QUICK-SUMMARY.md](./QUICK-SUMMARY.md) - 30秒快速参考
3. ✅ [Xorigo UI Website 架构白皮书.md](./Xorigo UI Website 架构白皮书.md) - 架构原则
4. ✅ [Website重构架构设计方案.md](./Website重构架构设计方案.md) - 完整设计

**预计阅读时间**: 1-2小时

---

### 场景 2: 准备开始重构

**推荐操作流程**：
1. ✅ 阅读 [Website重构-前置检查清单.md](./Website重构-前置检查清单.md)
2. ✅ 运行 `bash scripts/pre-refactor-check.sh` - 环境检查
3. ✅ 运行 `bash scripts/diagnose-layer.sh` - 架构诊断
4. ✅ 阅读 [Website重构-Agent执行计划.md](./Website重构-Agent执行计划.md)
5. ✅ 准备执行 `bash docs/待整理/EXECUTE-HIVE-MIND.sh`

**预计准备时间**: 30分钟

---

### 场景 3: 开发中遇到问题

**快速查找方案**：

| 问题类型 | 查阅文档 |
|---------|---------|
| 架构分层不清楚 | [Website重构-常见问题FAQ.md](./Website重构-常见问题FAQ.md) Q1.1-Q1.3 |
| 组件分类不确定 | [Website重构-常见问题FAQ.md](./Website重构-常见问题FAQ.md) Q2.1-Q2.3 |
| Playground 状态管理 | [Website重构-常见问题FAQ.md](./Website重构-常见问题FAQ.md) Q3.1-Q3.3 |
| 性能优化问题 | [Website重构-常见问题FAQ.md](./Website重构-常见问题FAQ.md) Q4.1-Q4.2 |
| 开发流程问题 | [Website重构-常见问题FAQ.md](./Website重构-常见问题FAQ.md) Q5.1-Q5.3 |
| CI/CD 配置 | [Website重构-常见问题FAQ.md](./Website重构-常见问题FAQ.md) Q6.1-Q6.2 |
| 故障排查 | [Website重构-常见问题FAQ.md](./Website重构-常见问题FAQ.md) Q7.1-Q7.3 |

**诊断工具**：
- 分层问题: `bash scripts/diagnose-layer.sh`
- 分类问题: `npm run check:categories`
- 本地CI: `bash scripts/local-ci.sh --fast`

---

### 场景 4: 代码审查与质量检查

**推荐工具链**：
1. ✅ `bash scripts/local-ci.sh` - 完整CI检查
2. ✅ `npm run lint` - 代码规范
3. ✅ `npm run type-check` - 类型检查
4. ✅ `npm run check:categories` - 分类验证
5. ✅ `npm test -- --coverage` - 单元测试

**参考文档**：
- [Website重构最佳实践和规则.md](./Website重构最佳实践和规则.md)
- [Website重构-测试策略.md](./Website重构-测试策略.md)

---

### 场景 5: 最终验收与交付

**验收流程**：
1. ✅ 运行 `bash scripts/final-acceptance.sh --auto` - 自动验收
2. ✅ 运行 `bash scripts/final-acceptance.sh --manual` - 手动验收
3. ✅ 对照 [Website重构-最终交付清单.md](./Website重构-最终交付清单.md)
4. ✅ 确认 26 项交付标准全部通过

**验收标准**：
- 🔴 P0 (必须): 架构层、Data Layer、Error Tolerance、Quality、CI/CD、Performance
- 🟡 P1 (重要): Pages Layer、Playground、Tools、Search、Testing、Documentation

---

## 📝 文档维护指南

### 文档更新规范

| 更新类型 | 操作 | 说明 |
|---------|------|------|
| 新增文档 | 1. 添加文档<br>2. 更新本索引<br>3. 更新总览文档 | 保持索引同步 |
| 修改文档 | 1. 修改内容<br>2. 更新版本号<br>3. 更新时间戳 | 版本追踪 |
| 删除文档 | 1. 标记为废弃<br>2. 更新本索引<br>3. 归档到历史目录 | 保留历史 |

### 文档命名规范

**格式**：`{序号}-{scope}-{task}[-{stage}]-{描述}.md`

**示例**：
- `00-Website重构总览-开始这里.md` - 总览文档
- `Website重构-组件分类说明.md` - 主题文档
- `Website重构-常见问题FAQ.md` - 参考文档

---

## 🔗 相关资源

### 内部链接

- **Monorepo Root**: `/`
- **Website App**: `/apps/website`
- **Core Package**: `/packages/core`
- **Registry Package**: `/packages/registry`
- **Tokens Package**: `/packages/tokens`
- **Scripts**: `/scripts`
- **Docs**: `/docs/待整理`

### 外部资源

- **Next.js 15 文档**: https://nextjs.org/docs
- **React 19 文档**: https://react.dev/
- **Zustand 文档**: https://zustand-demo.pmnd.rs/
- **Zod 文档**: https://zod.dev/
- **Tailwind CSS 文档**: https://tailwindcss.com/docs

---

## 🚀 快速命令参考

### 开发命令

```bash
# 环境检查
bash scripts/pre-refactor-check.sh

# 架构诊断
bash scripts/diagnose-layer.sh
bash scripts/diagnose-layer.sh --fix  # 自动修复

# 本地 CI 测试
bash scripts/local-ci.sh --fast       # 快速模式
bash scripts/local-ci.sh --full       # 完整模式

# 分类验证
cd apps/website
npm run check:categories
npm run generate:category-stats

# 最终验收
bash scripts/final-acceptance.sh --auto    # 自动模式
bash scripts/final-acceptance.sh --manual  # 手动模式

# Agent 执行
bash docs/待整理/EXECUTE-HIVE-MIND.sh
```

### 开发流程

```bash
# Step 1: 前置检查
bash scripts/pre-refactor-check.sh

# Step 2: 架构诊断
bash scripts/diagnose-layer.sh

# Step 3: 开发 (按 Agent 计划)
# ... 开发过程 ...

# Step 4: 本地 CI 测试
bash scripts/local-ci.sh

# Step 5: 最终验收
bash scripts/final-acceptance.sh --auto
```

---

## 📞 技术支持

### 问题反馈

- **文档问题**: 在 GitHub Issues 提交，标签 `documentation`
- **工具问题**: 在 GitHub Issues 提交，标签 `tools`
- **架构问题**: 在 GitHub Discussions 讨论，标签 `architecture`

### 贡献指南

欢迎贡献新的文档和工具！请遵循以下流程：
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/new-doc`)
3. 提交更改 (`git commit -m 'docs: add new documentation'`)
4. 推送到分支 (`git push origin feature/new-doc`)
5. 创建 Pull Request

---

## 📜 版本历史

| 版本 | 日期 | 变更说明 |
|------|------|---------|
| v1.0 | 2025-01-13 | 初始版本，包含33个文档和工具 |

---

**维护者**: Xorigo UI Team
**联系方式**: GitHub Issues
**最后更新**: 2025-01-13

---

## ✨ 总结

这个文档索引系统为 Website 重构项目提供了完整的导航和支持，包括：

- ✅ **33个文档** (~615KB) - 覆盖架构、设计、开发、测试、交付全流程
- ✅ **6个工具脚本** - 自动化诊断、验证、测试、验收
- ✅ **5个使用场景** - 适配不同阶段的文档和工具组合
- ✅ **完整的命令参考** - 快速查找和执行常用命令
- ✅ **FAQ 支持** - 38个常见问题解答

**下一步行动**：
1. 📖 阅读 [00-Website重构总览-开始这里.md](./00-Website重构总览-开始这里.md)
2. 🔍 运行 `bash scripts/pre-refactor-check.sh`
3. 🚀 准备执行 `bash docs/待整理/EXECUTE-HIVE-MIND.sh`

祝重构顺利！🎉
