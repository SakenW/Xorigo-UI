# 📅 Xorigo UI 版本号标准化计划

**执行日期**: 2025年11月3日
**目标版本**: v2025.11.03
**状态**: 🔄 执行中

---

## 🎯 标准化目标

统一全项目版本号，消除混乱，采用基于日期的版本控制。

### 新版本规范

```yaml
项目版本: v2025.11.03
格式: vYYYY.MM.DD
更新频率: 每月或有重大变更时
```

---

## 📋 当前混乱现状

### ❌ 发现的问题

1. **架构文档版本不统一**
   - component-taxonomy-v2025.11.03.yaml (v1.5.0)
   - brownfield-architecture-20251030.md (v1.5.1)
   - theme-system-ssot-v1.5.md (v1.5)
   - 仍存在 v1.4 过时引用

2. **包版本不统一**
   - 大部分包: 0.1.0
   - 部分包: 1.0.0 (hooks, cli, registry)

3. **Skills 版本引用过时**
   - 仍引用 v1.5.0/v1.5.1

---

## 🚀 迁移计划

### Phase 1: 架构文档统一 ✅

**文件映射**:
```
docs/shared/component-taxonomy-v2025.11.03.yaml          → docs/shared/component-taxonomy-v2025.11.03.yaml
docs/shared/theme-system-ssot-v1.5.md             → docs/shared/theme-system-ssot-v2025.11.03.md
docs/shared/component-classification-system-v1.5.md → docs/shared/component-classification-system-v2025.11.03.md
docs/architecture/brownfield-architecture-20251030.md → docs/architecture/brownfield-architecture-v2025.11.03.md
```

**内容更新**:
- 统一版本号: v2025.11.03
- 更新文档间交叉引用
- 删除过时版本引用

### Phase 2: 包版本统一

**目标包列表**:
```bash
packages/core/package.json
packages/cli/package.json
packages/hooks/package.json
packages/tokens/package.json
packages/utils/package.json
packages/primitives/package.json
packages/layout/package.json
packages/navigation/package.json
packages/overlays/package.json
packages/feedback/package.json
packages/style-recipe/package.json
packages/registry/package.json
apps/docs/package.json
```

**统一版本**:
```json
{
  "version": "2025.11.03"
}
```

### Phase 3: Skills 更新

**待更新 Skills**:
```bash
.claude/skills/xorigo-component-generator/SKILL.md
.claude/skills/xorigo-design-tokens-manager/SKILL.md
.claude/skills/xorigo-seven-axis-theme-developer/SKILL.md
```

### Phase 4: 交叉引用更新

**更新范围**:
- README.md 文件
- 技术文档引用
- 构建配置
- CLI 工具

---

## 🔧 实施步骤

### Step 1: 重命名文件
```bash
# 重命名 SSOT 文件
mv docs/shared/component-taxonomy-v2025.11.03.yaml docs/shared/component-taxonomy-v2025.11.03.yaml
mv docs/shared/theme-system-ssot-v1.5.md docs/shared/theme-system-ssot-v2025.11.03.md
mv docs/shared/component-classification-system-v1.5.md docs/shared/component-classification-system-v2025.11.03.md
mv docs/architecture/brownfield-architecture-20251030.md docs/architecture/brownfield-architecture-v2025.11.03.md
```

### Step 2: 更新文件内容
- 更新版本号字段
- 更新交叉引用路径
- 验证内容一致性

### Step 3: 批量更新 package.json
```bash
# 批量替换所有包版本
find packages/ -name "package.json" -exec sed -i 's/"version": "0.1.0"/"version": "2025.11.03"/g' {} \;
find packages/ -name "package.json" -exec sed -i 's/"version": "1.0.0"/"version": "2025.11.03"/g' {} \;
```

### Step 4: 更新 Skills 引用
- 更新技能描述中的版本引用
- 更新架构文档链接

### Step 5: 验证一致性
- 检查所有引用是否正确
- 运行测试确保功能正常
- 验证构建流程

---

## ✅ 验收标准

1. **所有文档版本号统一**: v2025.11.03
2. **所有包版本统一**: 2025.11.03
3. **所有引用路径正确**: 无 404 错误
4. **构建测试通过**: 功能正常
5. **无过时版本引用**: 完全清理

---

## 📅 时间线

**执行日期**: 2025年11月3日
**预计完成**: 2025年11月3日当天
**验证日期**: 2025年11月4日

---

## 🔗 相关文档

- [组件分类系统 SSOT](./component-taxonomy-v2025.11.03.yaml)
- [主题系统 SSOT](./theme-system-ssot-v2025.11.03.md)
- [架构文档](../architecture/brownfield-architecture-v2025.11.03.md)

---

**责任人**: Claude Code Assistant
**审查**: Xorigo UI Team
**状态**: 🔄 执行中