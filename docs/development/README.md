# 开发指南

> Xorigo UI 开发环境搭建和开发规范

## 🚀 快速开始

### 环境要求

- **Node.js** >= 22.0.0
- **pnpm** >= 9.0.0 (推荐)
- **Docker** & Docker Compose

### 克隆项目

```bash
git clone https://github.com/your-org/xorigo-ui.git
cd xorigo-ui
```

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

```bash
# 启动 Docker 热更新容器 (推荐)
npm run docker:dev

# 或者直接使用 Docker Compose
docker-compose -f docker-compose.dev.monorepo.yml up
```

访问 `http://localhost:3100` 查看应用。

## 📁 项目结构

```
xorigo-ui/
├── packages/                    # 包目录
│   └── core/                   # 核心组件库
│       ├── src/                # 源码
│       │   ├── components/     # 组件源码
│       │   ├── theme/          # 主题系统
│       │   ├── utils/          # 工具函数
│       │   └── types/          # 类型定义
│       ├── tests/              # 测试文件
│       └── package.json
├── apps/                       # 应用目录
│   └── website/               # 展示网站
│       ├── app/                # Next.js 应用
│       └── package.json
├── docs/                       # 文档
├── docker-compose.dev.monorepo.yml
└── package.json
```

## 🛠️ 开发工具

### 推荐的 VS Code 扩展

```json
{
  "recommendations": [
    "bradlc.vscode-tailwindcss",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-typescript-next",
    "formulahendry.auto-rename-tag",
    "christian-kohler.path-intellisense"
  ]
}
```

### 代码格式化

项目使用 Prettier 和 ESLint：

```bash
# 格式化代码
npm run format

# 检查代码规范
npm run lint

# 自动修复
npm run lint:fix
```

## 🧩 组件开发

### 组件文件结构

```
packages/core/src/components/button/
├── index.ts              # 导出文件
├── button.tsx           # 组件实现
├── button.test.tsx      # 测试文件
├── button.stories.tsx   # Storybook 故事
└── button.types.ts      # 类型定义
```

### 组件模板

```typescript
// button.tsx
import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/utils/cn'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-primary-500 text-white hover:bg-primary-600',
        secondary: 'bg-secondary-500 text-white hover:bg-secondary-600',
        outline: 'border border-primary-500 text-primary-500 hover:bg-primary-50',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 py-2',
        lg: 'h-12 px-6 text-lg',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner className="mr-2 h-4 w-4" />}
        {children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'
```

### 测试模板

```typescript
// button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="secondary">Click me</Button>)
    expect(screen.getByRole('button')).toHaveClass('bg-secondary-500')
  })

  it('is accessible', () => {
    render(<Button aria-label="Submit form">Submit</Button>)
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Submit form')
  })
})
```

## 🎨 主题开发

### 添加新的主题配方

```typescript
// packages/core/src/theme/recipes/index.ts
export const recipes = {
  // 现有配方...
  'custom-blue': {
    mode: 'light',
    hue: 'blue',
    saturation: 'vivid',
    lightness: 'bright',
    density: 'comfortable',
    roundness: 'medium',
    contrast: 'high',
  }
}
```

### 扩展设计令牌

```typescript
// packages/core/src/theme/tokens/colors.ts
export const colors = {
  primary: {
    50: 'var(--color-primary-50)',
    100: 'var(--color-primary-100)',
    // ...
    900: 'var(--color-primary-900)',
  },
  // 添加新的颜色令牌
  brand: {
    50: 'var(--color-brand-50)',
    500: 'var(--color-brand-500)',
    900: 'var(--color-brand-900)',
  }
}
```

## 🧪 测试策略

### 测试类型

1. **单元测试** - 组件逻辑和渲染
2. **集成测试** - 组件间交互
3. **可访问性测试** - a11y 标准
4. **视觉回归测试** - UI 一致性

### 测试命令

```bash
# 运行所有测试
npm run test

# 监听模式
npm run test:watch

# 测试覆盖率
npm run test:coverage

# UI 测试
npm run test:ui
```

### 测试配置

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.stories.tsx',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

## 📦 构建和发布

### 开发构建

```bash
# 开发模式构建
npm run build

# 类型检查
npm run type-check

# 严格模式构建
npm run build:strict
```

### 发布流程

```bash
# 1. 更新版本
npm run version

# 2. 构建生产版本
npm run build:prod

# 3. 运行测试
npm run test:ci

# 4. 发布到 npm
npm run publish
```

### 版本管理

使用语义化版本控制：

- **主版本号** - 不兼容的 API 修改
- **次版本号** - 向下兼容的功能性新增
- **修订号** - 向下兼容的问题修正

## 🐳 Docker 开发

### 开发容器

```yaml
# docker-compose.dev.monorepo.yml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3100:3100"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
    command: pnpm dev
```

### 开发 Dockerfile

```dockerfile
# Dockerfile.dev
FROM node:18-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package 文件
COPY package*.json pnpm-lock.yaml ./
COPY packages/core/package*.json ./packages/core/
COPY apps/website/package*.json ./apps/website/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源码
COPY . .

# 暴露端口
EXPOSE 3100

# 启动开发服务器
CMD ["pnpm", "dev"]
```

## 🔧 调试技巧

### VS Code 调试配置

```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Tests",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/node_modules/.bin/vitest",
      "args": ["run", "--reporter=verbose"],
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

### 性能分析

```bash
# 构建分析
npm run build:analyze

# 包大小分析
npm run size-check

# 性能监控
npm run perf:watch
```

## 📚 学习资源

### 必读文档

- [React 19 文档](https://react.dev/)
- [TypeScript 5.9 手册](https://www.typescriptlang.org/docs/)
- [Tailwind CSS 4 文档](https://tailwindcss.com/)
- [Framer Motion 12 文档](https://www.framer.com/motion/)

### 最佳实践

- [React 组件设计模式](https://reactpatterns.com/)
- [TypeScript 最佳实践](https://typescript-eslint.io/rules/)
- [可访问性指南](https://www.w3.org/WAI/WCAG21/quickref/)
- [性能优化指南](https://web.dev/performance/)

## 🤝 贡献指南

### 提交规范

使用约定式提交：

```
feat: 添加新的按钮组件
fix: 修复主题切换问题
docs: 更新组件文档
refactor: 重构工具函数
test: 添加组件测试
```

### Pull Request 流程

1. Fork 项目
2. 创建功能分支
3. 编写代码和测试
4. 提交 PR
5. 代码审查
6. 合并到主分支

### 代码审查清单

- [ ] 代码符合项目规范
- [ ] 包含必要的测试
- [ ] 文档已更新
- [ ] 类型安全
- [ ] 可访问性检查
- [ ] 性能影响评估

---

**Xorigo UI Team** · **开发指南 v1.4**