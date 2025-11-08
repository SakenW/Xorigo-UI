# 🎯 版本号变更策略指南

> **核心原则**: 开发阶段无需频繁变更版本号，按里程碑发布
> **当前版本**: 0.1.0-alpha.0
> **更新时间**: 2025-11-08

## 📋 版本变更场景

### ✅ **需要变更版本号的情况**

#### 1. **重大里程碑完成**
```
示例:
- ✅ 核心组件库基础架构完成
- ✅ 主题系统实现
- ✅ 工作台组件库集成
- ✅ 第一个完整功能模块完成
```

#### 2. **API 重大变更**
```
示例:
- 🔧 组件API重大调整
- 🔄 破坏性变更 (Breaking Changes)
- 📦 导出方式改变
- 🏗️ 架构重构
```

#### 3. **发布阶段转换**
```
示例:
- 🔶 Alpha → Beta (功能基本稳定)
- 🔷 Beta → RC (准备发布)
- 🔵 RC → Release (正式发布)
```

#### 4. **重要功能完成**
```
示例:
- 🎨 设计系统完成
- 🧩 组件库预览功能
- 🚀 主题切换系统
- 📊 性能优化工具
```

### ❌ **不需要变更版本号的情况**

#### 1. **日常开发提交**
```
示例:
- 🐛 Bug修复
- ✨ 小功能增强
- 📝 文档更新
- 🧪 测试用例补充
- 🔧 代码重构 (无API变更)
- 🎨 样式调整
- ⚡ 性能优化
```

#### 2. **内部优化**
```
示例:
- 📦 依赖更新
- 🔧 构建优化
- 🧪 测试覆盖率提升
- 📝 代码注释
- 🏗️ 代码结构调整
```

## 🎯 推荐的版本变更频率

### Alpha阶段 (当前: 0.1.0-alpha.0)
```
频率: 每周1-2次，或重大功能完成时
触发条件:
- ✅ 核心模块完成
- ✅ 重大功能实现
- ✅ API设计变更
```

### Beta阶段
```
频率: 每周1次，或重要修复时
触发条件:
- 🔧 重大Bug修复
- ✅ 用户反馈改进
- 📦 依赖更新
```

### RC阶段
```
频率: 每天或每次重要修复
触发条件:
- 🐛 关键Bug修复
- 📋 文档完善
- 🔧 性能优化
```

## 📅 实际开发建议

### 当前开发模式 ✅
```bash
# 开发期间 - 保持相同版本号
git commit -m "feat: 添加按钮组件"
git commit -m "fix: 修复表单验证问题"
git commit -m "docs: 更新组件文档"
# 版本号保持: 0.1.0-alpha.0

# 里程碑完成 - 更新版本号
git commit -m "feat: 完成所有表单组件开发"
pnpm dev:stage start  # 0.1.0-alpha.1
git commit -m "chore: 升级版本到 0.1.0-alpha.1"
```

### 推荐的工作流
```bash
# 1. 日常开发 (不改变版本号)
git add .
git commit -m "feat: 添加新的组件渲染器"
git push

# 2. 里程碑完成 (改变版本号)
git add .
git commit -m "feat: 完成所有组件预览功能"
pnpm dev:stage start  # 更新到 0.1.0-alpha.1
git add package.json
git commit -m "chore: 升级版本到 0.1.0-alpha.1"
git push

# 3. 阶段转换 (改变版本号)
pnpm dev:stage test  # 0.1.0-beta.0
git add package.json
git commit -m "chore: 升级到 Beta 阶段 (0.1.0-beta.0)"
git push
```

## 🚀 Git Hooks 自动化

### 预提交检查 (可选)
```bash
# .git/hooks/pre-commit
#!/bin/bash

# 检查是否需要版本更新
CHANGED_FILES=$(git diff --cached --name-only | grep -E "(package\.json|src/)")
if [[ -n "$CHANGED_FILES" ]]; then
    echo "检测到代码变更，请确认是否需要更新版本号"
    echo "当前版本: $(node -p "require('./packages/core/package.json').version")"
    echo "如需更新版本，请运行: pnpm dev:stage <stage>"
fi
```

## 📊 版本状态追踪

### 创建版本里程碑
```markdown
## 0.1.0-alpha.0 (2025-11-08)
- ✅ 基础项目架构
- ✅ 核心组件库 (39个组件)
- ✅ 工作台界面
- ✅ 主题系统
- ✅ 开发版本管理工具

## 0.1.0-alpha.1 (计划中)
- 🔄 组件API优化
- 🔄 测试覆盖率提升
- 🔄 文档完善

## 0.1.0-beta.0 (计划中)
- 📋 Beta测试准备
- 📋 性能优化
- 📋 用户体验改进
```

## 🎯 具体建议

### 对于当前项目
```
✅ 保持版本: 0.1.0-alpha.0
✅ 日常开发无需更新版本号
✅ 当以下情况完成时，才考虑更新版本:
  - 所有组件渲染器完成
  - 测试用例编写完成
  - 文档整理完成
  - 性能优化完成
```

### 快速检查命令
```bash
# 检查当前版本
pnpm dev:status

# 检查代码变更
git status

# 检查是否需要版本更新 (手动判断)
node scripts/develop-version-manager.js
```

## 📝 总结

**核心建议**:
1. **开发阶段**: 保持 `0.1.0-alpha.0`，专注于功能开发
2. **里程碑完成**: 再考虑更新到 `0.1.0-alpha.1`
3. **阶段转换**: Alpha → Beta → RC → Release
4. **质量优先**: 功能稳定比版本号更重要

---

**当前建议**: 继续使用 `0.1.0-alpha.0` 进行开发，专注于功能完善！