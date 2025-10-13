# @xorigo-ui/style-recipe

样式配方系统 - 基于 DTCG 七轴理论的多维主题配方生成器。

## 功能特性

- **DTCG 七轴**: Mode/Hue/Density/Surface/Intent/Interactive/State
- **多维配方**: 支持 20+ 预设配方，可无限扩展
- **类型安全**: 完整的 TypeScript 类型支持
- **自动生成**: 根据配方参数自动生成完整主题

## 安装

```bash
npm install @xorigo-ui/style-recipe
```

## 使用

```typescript
import { createRecipe, applyRecipe } from '@xorigo-ui/style-recipe';

// 创建配方
const recipe = createRecipe({
  mode: 'light',
  hue: 'blue',
  density: 'regular',
  surface: 'solid',
  // ... 其他参数
});

// 应用配方
applyRecipe(recipe);
```

## 配方结构

每个配方包含：
- 七轴参数配置
- 颜色变量映射
- 组件样式覆盖
- 动画与过渡配置

## 许可证

MIT © Xorigo UI Team
