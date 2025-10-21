# 🚀 Astro 文档站点设置指南

这个指南将帮助你快速设置和运行 Xorigo UI 的 Astro 文档站点。

## 📋 前置要求

- Node.js 22.0.0 或更高版本
- npm 10.0.0 或更高版本

## 🔧 安装步骤

### 1. 安装依赖

在项目根目录运行：

```bash
# 安装所有依赖（包括文档站点）
npm install

# 或者只安装文档站点的依赖
cd apps/docs
npm install
```

### 2. 启动开发服务器

```bash
# 在项目根目录运行
npm run dev:docs

# 或者在 docs 目录运行
cd apps/docs
npm run dev
```

### 3. 访问文档站点

打开浏览器访问：[http://localhost:4321](http://localhost:4321)

## 📁 项目结构

```
apps/docs/
├── src/
│   ├── content/docs/          # Markdown 文档内容
│   │   ├── index.mdx          # 首页
│   │   ├── guides/            # 使用指南
│   │   ├── components/        # 组件文档
│   │   ├── design/            # 设计系统
│   │   ├── themes/            # 主题系统
│   │   ├── development/       # 开发指南
│   │   └── api/               # API 参考
│   ├── components/            # Astro 组件
│   │   └── Example.astro      # 交互式示例组件
│   ├── styles/                # 自定义样式
│   │   └── custom.css         # 主题定制样式
│   └── assets/                # 静态资源
│       └── logo.svg           # Logo 文件
├── public/                    # 公共静态文件
├── astro.config.mjs           # Astro 配置
├── tsconfig.json             # TypeScript 配置
├── package.json              # 项目配置
└── README.md                 # 项目说明
```

## 📝 添加新文档

### 1. 创建文档文件

在 `src/content/docs/` 对应目录下创建 `.mdx` 文件：

```bash
# 例如，添加新的组件文档
touch src/content/docs/components/new-component.mdx
```

### 2. 添加 Frontmatter

每个文档文件都需要包含 frontmatter：

```yaml
---
title: 新组件名称
description: 组件的简要描述
sidebar:
  order: 10  # 排序序号
---
```

### 3. 编写文档内容

```mdx
---
title: 新组件
description: 新组件的使用说明
sidebar:
  order: 10
---

import { Example } from '../../components/Example.astro'

# 新组件

这是新组件的详细说明。

## 基础用法

<Example client:load>
  {`
import { NewComponent } from '@xorigo-ui/core'

export default function Demo() {
  return <NewComponent>Hello World</NewComponent>
}
  `}
</Example>

## API 参考

| 属性 | 类型 | 默认值 | 描述 |
|------|------|--------|------|
| `prop1` | `string` | `'default'` | 属性说明 |
| `prop2` | `boolean` | `false` | 属性说明 |
```

### 4. 更新侧边栏配置

在 `astro.config.mjs` 中的 `sidebar` 配置中添加新文档：

```js
export default defineConfig({
  integrations: [
    starlight({
      sidebar: [
        // ... 其他配置
        {
          label: '组件',
          items: [
            { label: '概览', link: 'components/overview' },
            { label: 'Button', link: 'components/button' },
            { label: '新组件', link: 'components/new-component' }, // 添加新组件
          ]
        }
      ]
    })
  ]
})
```

## 🎨 自定义样式

### 1. 修改主题色彩

在 `src/styles/custom.css` 中修改 CSS 变量：

```css
:root {
  /* 自定义主色调 */
  --xorigo-primary: 220 90% 56%;
  --xorigo-primary-foreground: 220 90% 98%;

  /* 自定义次要色调 */
  --xorigo-secondary: 220 84% 61%;
  --xorigo-secondary-foreground: 220 84% 98%;
}
```

### 2. 添加组件样式

```css
/* 自定义组件样式 */
.my-custom-component {
  background: hsl(var(--xorigo-primary));
  color: hsl(var(--xorigo-primary-foreground));
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}
```

### 3. 响应式设计

```css
/* 响应式样式 */
.responsive-example {
  padding: var(--space-2);
}

@media (min-width: 768px) {
  .responsive-example {
    padding: var(--space-6);
  }
}
```

## 🔍 搜索和导航

### 1. 搜索功能

Starlight 内置了全文搜索功能，自动索引所有 Markdown 内容。

### 2. 导航结构

侧边栏导航基于文件结构自动生成，可以通过 `astro.config.mjs` 进行自定义：

```js
{
  label: '分类名称',
  items: [
    { label: '页面标题', link: 'path/to/page' },
    // 分组
    {
      label: '子分类',
      items: [
        { label: '子页面', link: 'path/to/subpage' }
      ]
    }
  ]
}
```

## 📱 响应式设计

文档站点自动适配各种设备尺寸：

- **移动端**: < 768px
- **平板端**: 768px - 1024px
- **桌面端**: > 1024px

## 🧪 测试和验证

### 1. 类型检查

```bash
npm run type-check
```

### 2. 代码检查

```bash
npm run lint
```

### 3. 格式化代码

```bash
npm run format
```

### 4. 构建测试

```bash
npm run build
```

## 🚀 部署

### 1. 构建静态文件

```bash
npm run build
```

构建完成后，静态文件会生成在 `dist/` 目录。

### 2. 部署到不同平台

#### Netlify

```bash
# 上传 dist/ 目录到 Netlify
npm run build

# 或者使用 Netlify CLI
netlify deploy --prod --dir=dist
```

#### Vercel

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

#### GitHub Pages

```bash
# 构建并推送到 gh-pages 分支
npm run build

git add dist/
git commit -m "Deploy docs"
git subtree push --prefix dist origin gh-pages
```

### 3. 环境变量配置

创建 `.env.production` 文件：

```env
# 生产环境配置
SITE_URL=https://your-domain.com
SITE_NAME=Xorigo UI 文档
```

## 🔧 故障排除

### 常见问题

#### 1. 端口冲突

如果 4321 端口被占用，可以修改端口：

```bash
# 使用不同端口
npm run dev -- --port 3000
```

#### 2. 依赖问题

重新安装依赖：

```bash
rm -rf node_modules package-lock.json
npm install
```

#### 3. 构建失败

检查 TypeScript 配置和类型错误：

```bash
npm run type-check
```

#### 4. 样式不生效

确保 Tailwind CSS 和自定义样式正确导入：

```css
/* 在 custom.css 中确保样式正确加载 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 调试技巧

#### 1. 开启详细日志

```bash
DEBUG=astro:* npm run dev
```

#### 2. 检查构建分析

```bash
npm run build -- --analyze
```

#### 3. 清理缓存

```bash
# 清理 Astro 缓存
rm -rf .astro/

# 清理构建缓存
rm -rf dist/
```

## 📚 相关资源

- [Astro 官方文档](https://docs.astro.build/)
- [Starlight 文档主题](https://starlight.astro.build/)
- [Tailwind CSS](https://tailwindcss.com/)
- [MDX 文档](https://mdxjs.com/)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📞 获取帮助

如果遇到问题，可以：

1. 查看 [Astro 官方文档](https://docs.astro.build/)
2. 搜索 [GitHub Issues](https://github.com/withastro/astro/issues)
3. 加入 [Astro Discord 社区](https://astro.build/chat)