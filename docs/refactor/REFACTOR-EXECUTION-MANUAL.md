# 🚀 Xorigo-UI 重构执行手册（插件增强版）

**文件路径**：`/docs/refactor/REFACTOR-EXECUTION-MANUAL.md`
**版本**：v1.0（2025-10-16）
**特色**：集成Claude Code插件的智能化重构执行

---

## 🎯 执行概览

本手册基于《重构与校验一体化执行手册》，通过Claude Code插件增强执行效率和质量控制。

### 🤖 插件增强架构

| 执行阶段 | 主导插件 | 辅助插件 | 质量审查 |
|---------|---------|---------|---------|
| Phase 1: 构建优化 | backend-architect | debugger | architect-review |
| Phase 2: 主题解耦 | backend-architect | multi-agent-optimize | architect-review |
| Phase 3: a11y自动化 | test-automator | debugger | architect-review |
| Phase 4: 视觉回归 | test-automator | - | architect-review |
| Phase 5: SSR兼容 | backend-architect | debugger | architect-review |
| Phase 6: 发版流水线 | backend-architect | test-automator | architect-review |

---

## 📋 执行前准备

### 1. 插件环境检查
```bash
# 验证插件市场已安装
ls ~/.claude/plugins/marketplaces/claude-code-workflows/

# 检查可用插件
find ~/.claude/plugins/marketplaces/claude-code-workflows -name "*.md" | grep -E "(backend-architect|test-automator|architect-review)"
```

### 2. 激活项目上下文
```bash
# 确保在项目根目录
cd /home/saken/project/Xorigo-UI

# 检查项目结构
ls -la packages/
ls -la apps/website/
```

### 3. 设置插件上下文模板
```bash
# 创建插件上下文文件
cat > .claude-context.md << 'EOF'
## Xorigo-UI 重构项目上下文

你正在参与Xorigo-UI组件库的重构项目，这是一个基于React 19 + TypeScript 5.9 + Tailwind CSS 4的现代化组件库。

### 项目结构
- packages/*: 核心包（tokens、core、system、hooks、i18n等）
- apps/website: 消费型演示网站（仅导入，不创造UI）

### 重构目标
1. 构建优化：按需打包、tree-shaking生效
2. 主题解耦：CSS变量、三层架构分离
3. a11y自动化：axe-core集成、键盘测试
4. 视觉回归：截图对比、Storybook集成
5. SSR兼容：Next.js 15、React 19支持
6. 发版流水线：Changesets、CI/CD自动化

### 架构原则（严禁违反）
- Website严格消费@xorigo-ui/*包
- 无反向依赖（packages→website）
- 遵循Atomic Design原则
- TypeScript类型安全优先
- 硬编码颜色值禁止

### 质量标准
- 所有组件axe violations = 0
- 视觉差异阈值 < 0.02
- 测试覆盖率 > 80%
- 构建时间 < 10分钟

请基于你的专业能力，严格执行每个阶段的任务要求。
EOF
```

---

## 📅 分阶段执行计划

### 🔄 Phase 1: 构建优化与按需打包（第1-3天）

#### 1.1 激活架构师模式
```bash
# 启动backend-architect插件
/agent backend-architect

# 设置任务上下文
我需要你帮助优化Xorigo-UI组件库的构建系统，目标是实现按需打包和tree-shaking优化。

当前状况：
- packages/core仅有主入口index.ts
- 缺少组件级导出入口
- vite.config.ts需要配置多入口构建

具体任务：
1. 分析当前构建配置
2. 设计组件级导出方案
3. 更新vite.config.ts支持多入口
4. 完善package.json exports配置
5. 验证tree-shaking效果

请严格按照项目架构原则执行，确保不破坏现有功能。
```

#### 1.2 架构图设计验证
```bash
# 架构图验证（使用architect-review）
/agent architect-review

请审查backend-architect设计的构建优化方案，重点关注：
1. 是否符合现代前端构建最佳实践
2. 是否保持了API的一致性
3. 是否考虑了向后兼容性
4. 是否有潜在的性能风险

请提供详细的审查意见和改进建议。
```

#### 1.3 调试验证
```bash
# 调试验证（使用debugger）
/agent debugger

请帮助验证构建优化方案的实现效果：
1. 检查多入口构建是否正常工作
2. 验证按需导入是否生效
3. 分析bundle体积是否优化
4. 识别潜在的构建问题

如果发现问题，请提供具体的解决方案。
```

#### 1.4 Phase 1 验收标准
```bash
# 验证命令
npm run build
node -e "console.log(require('@xorigo-ui/core/button'))"
npx vite-bundle-analyzer packages/core/dist

# 验收清单
□ 支持按需导入 `import '@xorigo-ui/core/button'`
□ Tree-shaking 生效，Bundle 体积减少 > 30%
□ 所有导出都有完整的 TypeScript 类型
□ ESM 和 CJS 导入都正常工作
□ sideEffects 配置正确
```

---

### 🎨 Phase 2: 主题系统三层解耦（第4-6天）

#### 2.1 激活多代理协作
```bash
# 主导：backend-architect
/agent backend-architect

我需要你设计Xorigo-UI的主题系统三层解耦方案。

当前状况：
- 已有基础的tokens包分离
- 主题系统集成需要优化
- 存在硬编码颜色值需要清理

具体任务：
1. 设计tokens/theme/core三层架构
2. 创建语义化颜色令牌系统
3. 建立CSS变量映射机制
4. 制定硬编码颜色迁移策略
5. 确保主题切换无需重新编译

请确保新架构支持10种主题配方，并且与现有的七轴DTCG系统兼容。
```

#### 2.2 多代理优化
```bash
# 协作优化：multi-agent-optimize
/agent multi-agent-optimize

请协调多个代理的方案，优化主题系统解耦设计：
1. 整合tokens包的设计方案
2. 协调core包的CSS变量使用
3. 优化主题切换性能
4. 确保SSR兼容性
5. 制定迁移时间线

请确保各组件方案的一致性和可行性。
```

#### 2.3 架构合规性检查
```bash
# 合规检查：architect-review
/agent architect-review

请审查主题系统三层解耦方案，重点检查：
1. 是否违反了"Website只消费不创造"原则
2. CSS变量设计是否合理
3. 主题切换性能是否达标
4. SSR兼容性是否完备
5. 是否有硬编码颜色残留

请提供合规性评估和改进建议。
```

#### 2.4 Phase 2 验收标准
```bash
# 验证命令
grep -r "#[0-9a-fA-F]\{3,6\}" packages/core/src/components/
npm run test:theme-switching

# 验收清单
□ 无硬编码颜色值（除注释外）
□ 主题切换只需变更CSS变量
□ tokens/theme/core 职责清晰分离
□ 支持10种主题配方
□ SSR兼容性验证通过
```

---

### ♿ Phase 3: a11y自动化集成（第7-10天）

#### 3.1 激活测试专家
```bash
# 切换到test-automator
/agent test-automator

我需要你建立Xorigo-UI的可访问性自动化测试体系。

当前状况：
- Storybook已配置@storybook/addon-a11y
- 缺少CI/CD集成
- 需要建立完整的a11y基线

具体任务：
1. 集成axe-core到Playwright测试
2. 创建核心组件a11y测试套件
3. 建立键盘导航测试矩阵
4. 配置自动化a11y检查
5. 设置a11y违规阻断机制

请确保所有组件符合WCAG 2.1 AA标准，实现0 violations目标。
```

#### 3.2 问题调试
```bash
# 调试支持：debugger
/agent debugger

请帮助解决a11y测试中遇到的问题：
1. 分析axe-core检测到的违规
2. 提供具体的修复方案
3. 验证键盘导航实现
4. 优化ARIA属性配置
5. 测试屏幕阅读器兼容性

请确保每个问题都有完整的解决方案。
```

#### 3.3 质量审查
```bash
# 质量审查：architect-review
/agent architect-review

请审查a11y自动化测试方案，重点关注：
1. 测试覆盖率是否完整
2. 违规检测机制是否有效
3. 键盘导航测试是否全面
4. CI集成是否合理
5. 是否符合现代a11y最佳实践

请提供改进建议和质量评估。
```

#### 3.4 Phase 3 验收标准
```bash
# 验证命令
npm run test:a11y
npx playwright test --reporter=list

# 验收清单
□ 所有核心组件axe violations = 0
□ 键盘导航完整覆盖（Tab/Enter/Space/Escape/Arrows）
□ ARIA属性符合WCAG 2.1 AA标准
□ 焦点管理正确工作
□ CI自动运行a11y检查
```

---

### 🖼️ Phase 4: 视觉回归保护（第11-13天）

#### 4.1 继续测试专家模式
```bash
# 继续使用test-automator
/agent test-automator

我需要你建立Xorigo-UI的视觉回归保护体系。

当前状况：
- 已有Storybook配置
- 缺少自动化截图对比
- 需要建立视觉基线

具体任务：
1. 配置Playwright视觉测试框架
2. 创建关键组件视觉测试套件
3. 设置截图对比阈值（< 0.02）
4. 建立Storybook视觉回归基线
5. 集成到CI/CD流程

请确保视觉测试既能保护质量，又不会产生过多误报。
```

#### 4.2 Phase 4 验收标准
```bash
# 验证命令
npm run test:visual
npm run test:visual -- --update-snapshots

# 验收清单
□ 关键组件建立视觉基线
□ 自动化截图对比工作正常
□ 视觉差异阈值 < 0.02
□ CI失败提供清晰的差异报告
□ 支持本地更新基线
```

---

### ⚡ Phase 5: SSR兼容性优化（第14-16天）

#### 5.1 重新激活架构师
```bash
# 回到backend-architect
/agent backend-architect

我需要你解决Xorigo-UI的SSR兼容性问题。

当前状况：
- Website基于Next.js 15
- Framer Motion SSR兜底不完整
- 需要支持React 19新特性

具体任务：
1. 创建Motion SSR Provider
2. 优化动画组件SSR兜底
3. 解决hydration mismatch问题
4. 创建SSR兼容演示页面
5. 验证Next.js 15完全兼容

请确保动画在客户端正常工作，同时避免SSR相关错误。
```

#### 5.2 调试验证
```bash
# 调试验证：debugger
/agent debugger

请帮助验证和解决SSR兼容性问题：
1. 检查Next.js构建错误
2. 分析hydration mismatch原因
3. 验证客户端动画功能
4. 测试各种SSR场景
5. 优化性能表现

请确保每个SSR问题都有完整的解决方案。
```

#### 5.3 Phase 5 验收标准
```bash
# 验证命令
cd apps/website && npm run build
npm run start && curl -s http://localhost:3000/ssr-test

# 验收清单
□ Next.js构建无window错误
□ 无hydration mismatch警告
□ Framer Motion客户端正常工作
□ SSR演示页面功能完整
□ 性能指标达标
```

---

### 🚀 Phase 6: 发版流水线建设（第17-20天）

#### 6.1 三代理协作模式
```bash
# 主导：backend-architect
/agent backend-architect

# 协作：test-automator
/agent test-automator

# 审查：architect-review
/agent architect-review

我需要你们三方协作建立Xorigo-UI的发版流水线。

backend-architect任务：
1. 设计Changesets工作流
2. 创建GitHub Actions流水线
3. 建立多包协同构建
4. 配置自动化发布

test-automator任务：
1. 集成所有测试到CI
2. 设置质量门禁
3. 配置测试报告
4. 验证发布流程

architect-review任务：
1. 审查流水线设计
2. 检查架构守卫机制
3. 验证质量标准
4. 评估风险控制

请确保三方协作顺畅，建立完整的自动化发版流程。
```

#### 6.2 Phase 6 验收标准
```bash
# 验证命令
npm run version-packages --dry-run
npm run release --dry-run
act -j ci --dry-run

# 验收清单
□ Changesets语义化发版工作
□ CI/CD完整流水线通过
□ 架构守卫自动阻断违规
□ 所有质量门禁生效
□ 发版流程完全自动化
```

---

## 🛡️ 质量保证体系

### 架构守卫机制
```bash
# 每个阶段后运行架构检查
bash scripts/check-architecture-consistency.sh

# 检查内容：
□ Website不定义UI组件
□ Website只从@xorigo-ui/*导入
□ packages不反向依赖website
□ 无硬编码颜色值
□ sideEffects配置正确
```

### 插件质量审查
```bash
# 每个阶段完成前，使用architect-review审查
/agent architect-review

请审查当前阶段的完成情况：
1. 是否符合重构目标要求
2. 是否违反架构原则
3. 质量标准是否达标
4. 是否有遗漏的风险点
5. 是否可以进入下一阶段

请提供详细的审查报告和改进建议。
```

### 自动化质量门禁
```yaml
# .github/workflows/quality-gates.yml
质量门禁检查：
- TypeScript类型检查：npm run type-check
- ESLint代码质量：npm run lint
- 单元测试覆盖：npm run test
- a11y自动化：npm run test:a11y
- 视觉回归：npm run test:visual
- 架构一致性：bash scripts/check-architecture-consistency.sh
- 构建成功：npm run build
```

---

## 📊 监控和度量

### 关键指标
- **Bundle大小**：按需导入 < 50KB
- **构建时间**：CI构建 < 10分钟
- **测试覆盖率**：> 80%
- **a11y评分**：axe violations = 0
- **视觉回归**：差异阈值 < 0.02
- **发布成功率**：> 95%

### 插件效率评估
- **架构师效率**：方案设计 vs 实现质量
- **测试效率**：测试覆盖率 vs 问题发现率
- **审查效率**：问题识别 vs 改进建议质量

---

## 🎯 成功标准

### 技术指标
- ✅ 所有6个阶段按计划完成
- ✅ 所有验收标准100%达成
- ✅ 零架构违规事件
- ✅ 插件协同效率 > 85%

### 业务指标
- ✅ 组件库具备现代化发布能力
- ✅ 开发者体验显著提升
- ✅ 质量保证体系完善
- ✅ 社区反馈积极正面

---

## 📞 故障处理

### 插件故障
```bash
# 插件响应异常时
/agent debugger
请帮助诊断插件协作问题，并提供解决方案。

# 插件方案冲突时
/agent multi-agent-optimize
请协调不同插件的方案，找到最优解决方案。
```

### 技术故障
```bash
# 构建失败时
回滚到上一个稳定状态：
git checkout main
git reset --hard HEAD~1
npm install
npm run build

# 测试失败时
使用debugger分析具体原因，制定修复计划。
```

---

## 📝 经验总结

### 插件使用最佳实践
1. **上下文同步**：确保所有插件了解项目整体情况
2. **角色明确**：每个插件有清晰的职责边界
3. **质量优先**：使用architect-review进行阶段性审查
4. **持续优化**：根据实际效果调整插件配置

### 重构经验沉淀
1. **分阶段执行**：避免大爆炸式重构
2. **质量门禁**：每个阶段都有明确的验收标准
3. **风险控制**：建立完善的回滚和应急机制
4. **团队协作**：插件协作模式提升了执行效率

---

**制定者**：Claude Code Assistant
**执行者**：Xorigo-UI Team + Claude Code插件
**版本**：v1.0（2025-10-16）

> 🎯 **核心原则**：通过插件增强执行效率，通过质量控制确保重构成功，实现"可发布、可维护、可验证"的现代化组件库目标。