# @xorigo-ui/tokens

设计令牌系统 - Xorigo UI 的核心设计令牌定义。

## 功能特性

- **颜色系统**: 完整的颜色调色板定义
- **间距系统**: 标准化的间距尺度
- **字体系统**: 字体大小、行高、字重定义
- **动画系统**: 标准动画时长和缓动函数
- **阴影系统**: 统一的阴影效果定义
- **边框系统**: 标准边框样式和圆角
- **响应式**: 断点和媒体查询定义
- **类型安全**: 完整的 TypeScript 类型支持

## 安装

```bash
npm install @xorigo-ui/tokens
```

## 使用

```typescript
import { colors, spacing, typography } from '@xorigo-ui/tokens';

// 使用颜色令牌
const primaryColor = colors.primary[500];

// 使用间距令牌
const padding = spacing[4];

// 使用字体令牌
const fontSize = typography.fontSize.md;
```

## 令牌结构

### 颜色令牌
- Primary/Secondary/Accent/Neutral 色板
- 语义化颜色（success/warning/error/info）
- 文本和背景颜色

### 间距令牌
- 0.5 - 96 的标准间距尺度
- 响应式间距工具

### 字体令牌
- 字体大小（xs - 9xl）
- 字重（thin - black）
- 行高（tight - loose）

## 许可证

MIT © Xorigo UI Team
