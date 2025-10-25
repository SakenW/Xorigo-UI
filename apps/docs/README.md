# 🌐 Xorigo UI 文档站点

> 基于 Astro Starlight 构建的 Xorigo UI 技术文档站点

**📍 重要提示**：本文档仅说明如何部署和维护文档站点。完整的 Xorigo UI 技术文档请查看 [主文档中心](../../docs/README.md)。

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:4321](http://localhost:4321) 查看文档。

### 构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

## 📁 项目结构

```
apps/docs/
├── src/
│   ├── content/
│   │   └── docs/           # Markdown 文档内容
│   ├── components/         # Astro 组件
│   ├── styles/            # 自定义样式
│   └── assets/            # 静态资源
├── public/                # 公共静态文件
├── astro.config.mjs       # Astro 配置
├── tsconfig.json         # TypeScript 配置
└── package.json          # 项目配置
```

## 🎨 文档结构

文档按以下结构组织：

- **开始** - 项目介绍、快速开始、安装指南
- **组件** - 所有 UI 组件的详细文档
- **设计系统** - 设计令牌、颜色、字体等
- **主题系统** - 主题使用和自定义指南
- **开发指南** - 架构、贡献、测试等
- **API 参考** - 核心 API 详细说明

## 🛠️ 技术栈

- **Astro** - 静态站点生成器
- **Starlight** - 官方文档主题
- **React** - 交互式组件演示
- **TypeScript** - 类型安全
- **Tailwind CSS** - 样式系统

## 📝 编写文档

### 创建新文档

1. 在 `src/content/docs/` 目录下创建 `.mdx` 文件
2. 在文件头部添加 frontmatter：

```yaml
---
title: 文档标题
description: 文档描述
sidebar:
  order: 1
---
```

3. 在 `astro.config.mjs` 的 `sidebar` 配置中添加链接

### 添加交互式示例

使用 React 组件创建交互式示例：

```mdx
import { Example } from '../../components/Example.astro'

<Example client:load>
  {`
import { Button } from '@xorigo-ui/core'

export default function Demo() {
  return <Button>Hello World</Button>
}
  `}
</Example>
```

## 🎨 自定义样式

在 `src/styles/custom.css` 中添加自定义样式：

```css
/* 自定义 CSS 变量 */
:root {
  --custom-color: #3b82f6;
}

/* 自定义组件样式 */
.custom-component {
  color: var(--custom-color);
}
```

## 🚀 部署

### Netlify

```bash
npm run build
# 将 dist/ 目录部署到 Netlify
```

### Vercel

```bash
npm run build
# 将 dist/ 目录部署到 Vercel
```

### 自定义服务器

```bash
npm run build
npm run preview
```

## 🔧 配置

### Astro 配置

主要配置文件：`astro.config.mjs`

```js
export default defineConfig({
  integrations: [
    starlight({
      title: 'Xorigo UI 文档',
      // ...其他配置
    })
  ]
})
```

### TypeScript 配置

配置文件：`tsconfig.json`

```json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "jsx": "react-jsx",
    "baseUrl": "."
  }
}
```

## 📊 性能优化

- 使用 Astro 的静态生成能力
- 图片优化和懒加载
- CSS 和 JS 最小化
- CDN 部署

## 🔍 SEO 优化

- 自动生成 sitemap
- Meta 标签优化
- 结构化数据
- 开放图谱标签

## 🧪 测试

```bash
# 类型检查
npm run type-check

# 代码格式化
npm run format

# 代码检查
npm run lint
```

## 🤝 贡献

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT License - 查看 [LICENSE](../../LICENSE) 了解详情。