# 🚀 Xorigo-UI 重构执行指南

**文件路径**：`/docs/EXECUTION-GUIDE.md`
**版本**：v1.0（2025-10-16）
**适用对象**：开发团队、DevOps 工程师、架构师

---

## 📋 执行概览

本指南提供完整的 Xorigo-UI 重构执行步骤，确保按照《重构与校验一体化执行手册》顺利完成所有改进。

### 🎯 重构目标
- ✅ 按需打包优化（Tree-shaking 生效）
- ✅ Tokens/Theme/Core 三层解耦
- ✅ a11y 自动化集成
- ✅ 视觉回归保护
- ✅ SSR/同构兼容
- ✅ 版本与流水线建设

### 📚 相关文档
- **[重构手册](ARCH-REFACTOR-AND-VALIDATION.md)** - 详细的技术规范和验收标准
- **[执行计划](refactor-execution-plan.yaml)** - 机器可读的任务配置
- **[配置模板](config-templates/)** - 各种配置文件模板
- **[架构检查](../scripts/check-architecture-consistency.sh)** - 架构一致性检查脚本

---

## 🛠️ 执行前准备

### 1. 环境检查
```bash
# 检查 Node.js 版本
node --version  # 应该 >= 22.0.0

# 检查 npm 版本
npm --version   # 应该 >= 10.0.0

# 检查项目结构
ls -la packages/
ls -la apps/website/
```

### 2. 依赖安装
```bash
# 安装根目录依赖
npm install

# 安装新的测试依赖
npm install --save-dev @axe-core/playwright @playwright/test

# 安装发版工具
npm install --save-dev @changesets/cli
```

### 3. 架构检查
```bash
# 运行架构一致性检查
bash scripts/check-architecture-consistency.sh

# 确保没有违规问题
echo "架构检查通过，可以开始重构"
```

---

## 📅 执行计划（按阶段进行）

### 🔄 Phase 1: 构建优化与按需打包（2-3天）

#### 1.1 添加组件级导出入口
```bash
# 创建组件级入口文件
mkdir -p packages/core/src/components

# 复制模板并修改
cp docs/config-templates/vite.config.ts packages/core/vite.config.ts.new

# 手动更新配置（或使用脚本）
npm run create-component-exports
```

**关键文件修改**：
- `packages/core/vite.config.ts` - 添加多入口配置
- `packages/core/src/components/index.ts` - 新增组件导出
- `packages/core/package.json` - 更新 exports 配置

**验证步骤**：
```bash
# 构建测试
npm run build

# 验证按需导入
node -e "console.log(require('@xorigo-ui/core/button'))"

# 分析包体积
npx vite-bundle-analyzer packages/core/dist
```

#### 1.2 更新 package.json exports
```bash
# 使用模板更新配置
cp docs/config-templates/package.exports.json packages/core/package.json.new

# 手动合并配置差异
npm run merge-package-exports
```

---

### 🎨 Phase 2: 主题系统三层解耦（2-3天）

#### 2.1 增强 tokens 包功能
```bash
# 复制令牌模板
cp docs/config-templates/tokens-index.ts packages/tokens/src/index.new.ts

# 更新 tokens 包配置
cd packages/tokens
npm run build
```

#### 2.2 移除硬编码颜色值
```bash
# 检查硬编码颜色
grep -r "#[0-9a-fA-F]\{3,6\}" packages/core/src/components/

# 批量替换为 CSS 变量
npm run replace-hardcoded-colors
```

**验证步骤**：
```bash
# 检查是否还有硬编码颜色
! grep -r "#[0-9a-fA-F]\{3,6\}" packages/core/src/components/

# 测试主题切换
npm run test:theme-switching
```

---

### ♿ Phase 3: a11y 自动化集成（3-4天）

#### 3.1 集成 axe-core 测试
```bash
# 复制测试模板
mkdir -p packages/core/tests/a11y
cp docs/config-templates/a11y-dialog.spec.ts packages/core/tests/a11y/

# 复制 Playwright 配置
cp docs/config-templates/playwright.config.ts packages/core/playwright.config.ts.new

# 安装 Playwright 浏览器
npx playwright install
```

#### 3.2 创建键盘矩阵测试
```bash
# 为每个组件创建 a11y 测试
npm run create-a11y-tests

# 运行 a11y 测试
npm run test:a11y
```

**验证步骤**：
```bash
# 确保 a11y 测试通过
npm run test:a11y

# 检查违规报告
npx playwright test --reporter=list
```

---

### 🖼️ Phase 4: 视觉回归保护（2-3天）

#### 4.1 设置视觉测试
```bash
# 创建视觉测试目录
mkdir -p packages/core/tests/visual

# 复制视觉测试模板
cp docs/config-templates/visual-button.spec.ts packages/core/tests/visual/

# 生成初始基线
npm run test:visual -- --update-snapshots
```

#### 4.2 集成 Storybook 视觉测试
```bash
# 启动 Storybook
npm run storybook &

# 运行视觉测试
npm run test:visual
```

**验证步骤**：
```bash
# 确保视觉测试通过
npm run test:visual

# 检查差异报告
ls test-results/
```

---

### ⚡ Phase 5: SSR 兼容性优化（2-3天）

#### 5.1 Motion SSR Provider
```bash
# 创建 SSR 兼容的动画组件
#（手动实现或使用模板）

# 测试 Next.js 构建
cd apps/website
npm run build
```

#### 5.2 SSR 演示页面
```bash
# 创建 SSR 测试页面
mkdir -p apps/website/app/(marketing)/ssr-test

# 测试 SSR 渲染
npm run build && npm run start

# 检查 hydration 错误
curl -s http://localhost:3000/ssr-test
```

**验证步骤**：
```bash
# 确保 Next.js 构建无错误
cd apps/website && npm run build

# 检查 hydration mismatch
npm run start && npm run test:ssr
```

---

### 🚀 Phase 6: 发版流水线建设（3-4天）

#### 6.1 设置 Changesets
```bash
# 初始化 Changesets
npx changeset init

# 复制配置模板
cp docs/config-templates/changeset-config.json .changeset/config.json

# 创建第一个变更集
npx changeset
```

#### 6.2 CI/CD 流水线设置
```bash
# 创建 GitHub Actions 工作流目录
mkdir -p .github/workflows

# 复制工作流模板
cp docs/config-templates/github-workflow-release.yml .github/workflows/release.yml

# 测试工作流（本地）
act -j release --dry-run
```

**验证步骤**：
```bash
# 测试版本管理
npm run version-packages --dry-run

# 测试发布流程
npm run release --dry-run
```

---

## 🧪 质量检查清单

### 每个阶段完成后的检查

#### ✅ 构建优化检查
- [ ] 支持按需导入 `import '@xorigo-ui/core/button'`
- [ ] Tree-shaking 生效，Bundle 体积减少 > 30%
- [ ] 所有导出都有类型支持

#### ✅ 主题系统检查
- [ ] 无硬编码颜色值
- [ ] 主题切换只需变更 CSS 变量
- [ ] tokens/theme/core 职责清晰分离

#### ✅ a11y 检查
- [ ] axe-core 检测 0 violations
- [ ] 键盘导航完整覆盖
- [ ] WCAG 2.1 AA 标准合规

#### ✅ 视觉回归检查
- [ ] 关键组件有视觉基线
- [ ] 自动化截图对比工作
- [ ] 视觉差异阈值 < 0.02

#### ✅ SSR 兼容检查
- [ ] Next.js 15 构建无错误
- [ ] 无 hydration mismatch
- [ ] 动画客户端正常工作

#### ✅ 发版流水线检查
- [ ] Changesets 语义化发版
- [ ] CI/CD 完整流水线
- [ ] 架构守卫自动阻断

### 🛡️ 架构一致性检查
```bash
# 每个阶段后运行架构检查
bash scripts/check-architecture-consistency.sh

# 确保以下检查通过：
# ✅ Website 不定义 UI 组件
# ✅ Website 只从 @xorigo-ui/* 导入
# ✅ packages 不反向依赖 website
```

---

## 🔧 故障排除

### 常见问题和解决方案

#### 构建问题
```bash
# 问题：TypeScript 类型错误
# 解决：
npm run type-check
# 手动修复类型错误或更新类型定义

# 问题：Vite 构建失败
# 解决：
rm -rf node_modules packages/*/dist
npm install
npm run build
```

#### 测试问题
```bash
# 问题：Playwright 浏览器未安装
# 解决：
npx playwright install

# 问题：a11y 测试失败
# 解决：
npx playwright test --debug
# 手动检查并修复 a11y 问题
```

#### 架构问题
```bash
# 问题：架构检查失败
# 解决：
bash scripts/check-architecture-consistency.sh
# 根据错误提示修复违规问题
```

### 回滚程序
```bash
# 如果遇到严重问题，可以回滚到安全状态：
git checkout main
git reset --hard HEAD~1
npm install
npm run build
```

---

## 📊 监控和度量

### 关键指标监控
- **Bundle 大小**：按需导入 < 50KB
- **构建时间**：CI 构建 < 10 分钟
- **测试覆盖率**：> 80%
- **a11y 评分**：axe violations = 0
- **视觉回归**：差异阈值 < 0.02

### 自动化报告
- **构建报告**：每次 CI 运行生成
- **测试报告**：上传到 GitHub Artifacts
- **a11y 报告**：生成 HTML 格式报告
- **视觉差异**：失败时提供对比图

---

## 🎉 完成标准

### 最终验收标准
当所有以下条件满足时，重构视为完成：

1. **构建优化**：
   - ✅ 所有组件支持按需导入
   - ✅ Tree-shaking 生效验证通过
   - ✅ Bundle 体积优化达标

2. **主题系统**：
   - ✅ 三层架构完全解耦
   - ✅ 无硬编码颜色值
   - ✅ 主题切换灵活

3. **可访问性**：
   - ✅ axe-core 检测 0 violations
   - ✅ 键盘导航完整
   - ✅ WCAG 合规

4. **视觉回归**：
   - ✅ 视觉基线建立
   - ✅ 自动化检测工作
   - ✅ 差异控制达标

5. **SSR 兼容**：
   - ✅ Next.js 15 完全兼容
   - ✅ 零 Hydration 错误
   - ✅ 动画正常工作

6. **发版流水线**：
   - ✅ 语义化发版工作
   - ✅ CI/CD 完整
   - ✅ 架构守卫有效

### 🏆 发布就绪
完成重构后，项目将具备：
- 现代化的构建和发布流程
- 完整的质量保证体系
- 自动化的测试和验证
- 符合行业标准的可访问性
- 优秀的开发者体验

---

## 📞 支持和联系

### 获取帮助
- **技术文档**：参考 `docs/` 目录下的详细文档
- **配置模板**：参考 `docs/config-templates/` 目录
- **架构规则**：参考 `docs/WEBSITE-ARCHITECTURE/` 目录

### 团队协作
- **代码审查**：所有变更需要通过代码审查
- **测试验证**：确保所有测试通过后再合并
- **文档更新**：及时更新相关文档和注释

---

**维护者**：Xorigo-UI Team
**最后更新**：2025-10-16
**版本**：v1.0

> 🎯 **执行原则**：严格按照阶段顺序执行，每个阶段完成后进行质量检查，确保重构过程的稳定性和可控性。