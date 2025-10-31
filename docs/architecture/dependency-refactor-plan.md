# Xorigo UI 架构重构方案

## 依赖层次结构

### Layer 1: 基础设施层
- `@xorigo-ui/tokens` - 设计令牌（无依赖）
- `@xorigo-ui/system` - 主题系统、提供者（依赖tokens、style-recipe）
- `@xorigo-ui/utils` - 工具函数（无依赖）
- `@xorigo-ui/cli` - 命令行工具

### Layer 2: 原子组件层
- `@xorigo-ui/primitives` - 基础原子组件（依赖tokens、system、utils）

### Layer 3: 组合组件层
- `@xorigo-ui/forms` - 表单组件（依赖primitives、tokens、system、utils）
- `@xorigo-ui/layout` - 布局组件（依赖primitives、tokens、system、utils）
- `@xorigo-ui/feedback` - 反馈组件（依赖primitives、tokens、system、utils）
- `@xorigo-ui/navigation` - 导航组件（依赖primitives、tokens、system、utils）
- `@xorigo-ui/overlays` - 覆层组件（依赖primitives、tokens、system、utils）

### Layer 4: 聚合层
- `@xorigo-ui/core` - 向后兼容聚合包（依赖所有layer 3包）
- `@xorigo-ui/i18n` - 国际化（可独立使用）
- `@xorigo-ui/style-recipe` - 样式配方（依赖tokens）

## 重构目标
1. 清晰的依赖层次，避免循环依赖
2. 原子化设计，每个包职责单一
3. 支持tree-shaking，减小bundle大小
4. 向后兼容@xorigo-ui/core的导入方式