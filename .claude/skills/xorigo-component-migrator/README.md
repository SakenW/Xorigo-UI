# Xorigo UI 组件迁移器

**专门用于将归档组件迁移到新架构的智能工具**

## 🎯 功能特性

- ✅ **智能分析**: 自动分析归档组件结构和分类
- ✅ **规范迁移**: 严格按照 v1.5 架构规范进行迁移
- ✅ **批量处理**: 支持批量迁移多个组件
- ✅ **路径修复**: 自动修复组件间的导入路径
- ✅ **文件重命名**: 按现代前端标准重命名文件 (PascalCase → kebab-case)
- ✅ **导出生成**: 自动生成分类导出文件和主导出文件
- ✅ **分阶段执行**: 支持按优先级分阶段迁移
- ✅ **预演模式**: 支持干运行模式查看迁移计划

## 🏗️ 架构映射

基于 `component-taxonomy-v1.5.yaml` 的分类标准：

| 归档分类 | 目标分类 | 优先级 | 描述 |
|---------|---------|--------|------|
| `inputs` | `inputs` | 🔴 1 | 输入控件组件 |
| `form` | `forms` | 🔴 2 | 表单容器组件 |
| `overlays` | `overlays` | 🔴 3 | 覆盖层弹窗组件 |
| `feedback` | `feedback` | 🔴 4 | 状态反馈组件 |
| `layout` | `layout` | 🟡 5 | 布局容器组件 |
| `navigation` | `navigation` | 🟡 6 | 导航路由组件 |
| `datadisplay` | `data-display` | 🟡 7 | 数据展示组件 |
| `charts` | `charts` | 🟡 8 | 图表可视化组件 |
| `ui` | `primitives` | 🔵 9 | UI基元组件 |
| `effects` | `effects` | 🔵 10 | 视觉特效组件 |

## 📝 使用方法

### 基本使用

```javascript
const XorigoComponentMigrator = require('./index.js');

// 创建迁移器实例
const migrator = new XorigoComponentMigrator('/path/to/xorigo-ui');

// 执行迁移
const result = await migrator.migrate();
```

### 高级选项

```javascript
const result = await migrator.migrate({
  phases: ['inputs', 'form'],        // 指定迁移阶段
  dryRun: false,                     // 预演模式
  skipExisting: true                 // 跳过已存在的文件
});
```

### 预演模式

查看迁移计划而不实际执行：

```javascript
const result = await migrator.migrate({
  dryRun: true
});
```

## 🎮 迁移阶段

### Phase 1: 核心基础组件 (最高优先级)
- **目标**: `inputs` + `forms`
- **组件数**: ~18个
- **描述**: 用户输入和表单相关的核心组件

### Phase 2: 覆盖层反馈组件 (高优先级)
- **目标**: `overlays` + `feedback`
- **组件数**: ~14个
- **描述**: 弹窗、覆盖层和状态反馈组件

### Phase 3: 布局导航组件 (中高优先级)
- **目标**: `layout` + `navigation`
- **组件数**: ~20个
- **描述**: 页面布局和导航相关组件

### Phase 4: 数据图表组件 (中优先级)
- **目标**: `data-display` + `charts`
- **组件数**: ~26个
- **描述**: 数据可视化和展示组件

### Phase 5: 其他组件 (低优先级)
- **目标**: `primitives` + `effects` + `interactive` + `loading` + `showcase`
- **组件数**: ~43个
- **描述**: UI基元、特效和其他辅助组件

## 📁 文件命名规范

### 重命名规则

| 原文件名 | 新文件名 | 说明 |
|---------|---------|------|
| `Input.tsx` | `input.tsx` | PascalCase → kebab-case |
| `ButtonGroup.tsx` | `button-group.tsx` | 驼峰转连字符 |
| `FormField.tsx` | `form-field.tsx` | 复合词转连字符 |
| `InputNumber.tsx` | `input-number.tsx` | 复合词转连字符 |

### 目录结构

```
packages/core/src/components/
├── inputs/                 # 输入组件
│   ├── input.tsx
│   ├── button-group.tsx
│   ├── select.tsx
│   └── index.ts
├── forms/                  # 表单组件
│   ├── form.tsx
│   ├── fieldset.tsx
│   └── index.ts
├── overlays/               # 覆盖层组件
│   ├── modal.tsx
│   ├── dialog.tsx
│   └── index.ts
├── feedback/               # 反馈组件
│   ├── alert.tsx
│   ├── toast.tsx
│   └── index.ts
└── index.ts               # 主导出文件
```

## ⚙️ 配置选项

### 迁移选项

| 选项 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `phases` | string[] | `['inputs', 'form', 'overlays', 'feedback']` | 迁移阶段列表 |
| `dryRun` | boolean | `false` | 预演模式，不实际迁移文件 |
| `skipExisting` | boolean | `false` | 跳过已存在的目标文件 |

### 分类映射

可以自定义分类映射规则：

```javascript
migrator.categoryMapping = {
  'ui': 'primitives',      // ui 目录映射到 primitives
  'form': 'forms',         // 单数映射到复数
  // ... 其他映射规则
};
```

## 🔧 迁移过程

### 自动化处理

迁移器会自动处理以下任务：

1. **分析组件结构**: 扫描归档目录，识别所有 `.tsx` 组件文件
2. **创建目标目录**: 按新架构创建必要的目录结构
3. **文件重命名**: 按现代前端标准重命名文件
4. **路径修复**: 修复组件间的相对导入路径
5. **批量迁移**: 将文件复制到目标位置
6. **生成导出**: 自动生成 `index.ts` 导出文件
7. **更新主导出**: 更新组件库的主导出文件

### 冲突解决

- **重复组件**: 保留功能更完整的版本，删除重复文件
- **导入冲突**: 自动修复相对导入路径
- **命名冲突**: 按优先级规则处理命名冲突

## 📊 迁移报告

迁移完成后会生成详细的报告：

```
📋 迁移总结:
  ✅ 成功迁移: 32 个组件
  ❌ 迁移失败: 0 个组件
  📊 成功率: 100.0%
```

### 日志输出

迁移过程中的详细日志：

```
✅ 创建目录: /packages/core/src/components/inputs
✅ 迁移成功: inputs/Input.tsx → inputs/input.tsx
✅ 迁移成功: inputs/ButtonGroup.tsx → inputs/button-group.tsx
✅ 生成导出文件: /packages/core/src/components/inputs/index.ts
✅ 生成主导出文件: /packages/core/src/components/index.ts
```

## ⚠️ 注意事项

### 迁移前准备

1. **备份代码**: 迁移前建议备份现有代码
2. **关闭编辑器**: 避免文件锁定问题
3. **检查依赖**: 确保所有依赖包已正确安装

### 迁移后检查

1. **类型检查**: 运行 `pnpm type-check` 验证类型
2. **构建测试**: 运行 `pnpm build` 验证构建
3. **功能测试**: 测试迁移后的组件功能
4. **导入测试**: 验证组件导入是否正常

### 已知限制

1. **复杂导入**: 复杂的导入路径可能需要手动修复
2. **样式文件**: CSS/样式文件需要单独处理
3. **测试文件**: 测试文件迁移需要额外配置
4. **Storybook**: Storybook 故事文件需要路径更新

## 🚀 最佳实践

### 分阶段迁移

建议按以下顺序分阶段迁移：

1. **Phase 1**: 核心基础组件 (inputs + forms)
2. **Phase 2**: 覆盖层反馈组件 (overlays + feedback)
3. **Phase 3**: 布局导航组件 (layout + navigation)
4. **Phase 4**: 数据图表组件 (data-display + charts)
5. **Phase 5**: 其他组件 (primitives + effects + others)

### 质量保证

每个阶段完成后：

1. 运行类型检查: `pnpm type-check`
2. 运行构建: `pnpm build`
3. 运行测试: `pnpm test`
4. 启动开发服务器验证: `pnpm local:dev`

### 团队协作

- 迁移前与团队成员沟通计划
- 创建专门的迁移分支
- 迁移完成后提交 Pull Request
- 进行代码审查和测试验证

---

**维护**: Xorigo UI Team
**版本**: 1.0.0
**更新**: 2025-11-01