# 🚀 Xorigo UI 完整开发环境指南

## 📋 概述

Xorigo UI 采用**混合式开发环境**设计，既保留了 Docker 的一致性保障，又提供了本地开发的高效体验。本指南将帮助您快速上手并充分利用这个现代化的开发环境。

### 🎯 核心设计理念

- **本地开发为主**：日常开发使用本地环境，速度快、调试方便
- **Docker 环境为辅**：确保生产环境一致性和团队协作
- **端口智能分配**：避免与其他库冲突，3000端口保留给其他项目
- **一键切换**：智能环境管理器，轻松切换开发模式

### 🛠️ 技术栈

- **核心框架**：React 19 + TypeScript 5.9 + Tailwind CSS 4 + Framer Motion 12
- **构建工具**：Vite (Library Mode) + Next.js 15
- **包管理**：pnpm (高性能 Monorepo 支持)
- **容器化**：Docker + Docker Compose
- **代码质量**：ESLint + Prettier + TypeScript 严格模式
- **测试**：Vitest + Testing Library
- **开发工具**：VS Code + Claude Code 集成

---

## 🎛️ 开发模式详解

### 1. 本地开发模式 🌟

**适用场景**：日常开发、功能开发、调试

**优势**：
- ⚡ 启动速度极快 (2-3秒)
- 🔍 调试方便，断点清晰
- 💻 占用资源少，电池友好
- 🎛️ 配置灵活，个性化设置

**使用方法**：
```bash
# 启动完整本地开发环境
pnpm local:dev

# 或者分别启动
pnpm dev:core          # 核心库开发服务器 (端口 3001)
pnpm dev:website       # Website 开发服务器 (端口 3100)

# 启动所有服务
pnpm local:dev:all
```

**访问地址**：
- 核心库：http://localhost:3001
- Website：http://localhost:3100

### 2. Docker 核心库模式 🐳

**适用场景**：核心库开发、生产环境验证

**优势**：
- 🎯 环境一致性保障
- 🔄 热更新支持完整
- 👥 团队协作友好
- 🚫 避免本地环境问题

**使用方法**：
```bash
# Docker 核心库模式
pnpm docker:dev

# 或者使用智能管理器
node scripts/dev-env-manager.js docker-core
```

### 3. Docker 完整模式 🐳

**适用场景**：团队协作、CI/CD、演示部署

**优势**：
- 🎯 完全隔离，无环境差异
- 📦 包含完整 Monorepo 环境
- 🎪 集成 Storybook 和配方预览
- 👥 新成员入职快速上手

**使用方法**：
```bash
# Docker 完整模式
pnpm docker:dev:monorepo

# 或者使用智能管理器
node scripts/dev-env-manager.js docker-monorepo
```

### 4. 混合模式 🔄

**适用场景**：性能要求高、复杂开发场景

**优势**：
- ⚡ 性能最优
- 🎛️ 灵活配置
- 🔄 智能协调

**使用方法**：
```bash
# 混合模式
pnpm local:dev:all

# 或者使用智能管理器
node scripts/dev-env-manager.js hybrid
```

---

## 📊 端口分配策略

### 端口规划表

| 端口 | 服务 | 状态 | 说明 |
|------|------|------|------|
| **3000** | 🔒 **保留** | 禁止使用 | 为其他库测试保留 |
| **3001** | 🚀 核心库开发 | 可用 | Vite 开发服务器 |
| **3002** | 📋 核心库预览 | 可选 | Vite Preview |
| **3100** | 🌐 Website 开发 | 可用 | Next.js 开发服务器 |
| **3101** | 🎨 配方预览 | 可选 | 主题配方展示 |
| **6006** | 📚 Storybook | 可选 | 交互式文档 |
| **6380** | 💾 Redis | 可选 | 缓存服务 |

### 端口管理原则

1. **避免冲突**：3000 端口严格保留
2. **智能分配**：核心库 3001，Website 3100
3. **灵活扩展**：预览服务和工具使用高位端口
4. **团队一致**：所有开发者使用相同端口配置

---

## 🔧 环境配置详解

### 1. 项目结构

```
Xorigo-UI/
├── packages/
│   └── core/                    # 核心组件库
│       ├── src/
│       │   ├── components/       # React 组件
│       │   ├── foundations/      # 设计令牌
│       │   ├── theme/           # 主题系统
│       │   ├── utils/           # 工具函数
│       │   ├── hooks/           # 自定义钩子
│       │   └── types/           # TypeScript 类型
│       ├── tests/               # 测试文件
│       ├── docs/                # 组件文档
│       └── package.json
├── apps/
│   └── website/                 # Website 应用
│       ├── app/                 # Next.js App Router
│       ├── src/                 # 源代码
│       ├── public/              # 静态资源
│       └── package.json
├── scripts/                     # 管理脚本
│   ├── dev-env-manager.js       # 环境管理器
│   ├── check-dev-env.js         # 环境检查
│   └── build-*.js               # 构建脚本
├── docker-compose.*.yml         # Docker 配置
├── Dockerfile.dev              # 开发容器
├── .env.example                # 环境变量模板
└── package.json                # 根配置
```

### 2. 环境变量配置

复制 `.env.example` 到 `.env` 并自定义：

```bash
cp .env.example .env
```

**主要配置项**：
```env
# 端口配置
CORE_DEV_PORT=3001
WEBSITE_PORT=3100
STORYBOOK_PORT=6006

# 开发模式
NODE_ENV=development

# 核心库配置
VITE_PORT=3001
VITE_HOST=0.0.0.0

# Website 配置
NEXT_PUBLIC_CORE_URL=http://localhost:3001
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3100

# 主题配置
NEXT_PUBLIC_DEFAULT_THEME=midnight
NEXT_PUBLIC_THEME_PRESETS=ocean,forest,sunset,lavender

# 调试配置
DEBUG=vite:*
NEXT_TELEMETRY_DISABLED=1

# 缓存配置
CHOKIDAR_USEPOLLING=true
WATCHPACK_POLLING=true
FAST_REFRESH=true
```

### 3. 智能环境管理器

#### 交互式启动
```bash
# 启动交互式环境管理器
node scripts/dev-env-manager.js
```

#### 直接启动
```bash
# 本地开发
node scripts/dev-env-manager.js local

# Docker 核心
node scripts/dev-env-manager.js docker-core

# Docker 完整
node scripts/dev-env-manager.js docker-monorepo

# 停止所有服务
node scripts/dev-env-manager.js stop

# 检查状态
node scripts/dev-env-manager.js status
```

#### 环境检查
```bash
# 完整环境检查
pnpm local:dev:check

# 或者
node scripts/dev-env-manager.js status
```

---

## 🎨 开发工作流

### 1. 日常开发流程

#### 启动环境
```bash
# 1. 环境检查
pnpm local:dev:check

# 2. 启动开发环境
pnpm local:dev

# 3. 访问应用
# 核心库: http://localhost:3001
# Website: http://localhost:3100
```

#### 开发组件
```bash
# 1. 在 packages/core/src/components/ 开发组件
# 2. 实时热更新，无需重启
# 3. 在 Website 中测试组件集成
# 4. 运行测试确保质量
pnpm test

# 5. 代码质量检查
pnpm lint
pnpm type-check
```

#### 提交代码
```bash
# 1. 质量检查
pnpm lint && pnpm type-check && pnpm test

# 2. Git 提交
git add .
git commit -m "feat: 添加新组件"

# 3. 推送代码
git push
```

### 2. 团队协作流程

#### 新成员入职
```bash
# 1. 克隆项目
git clone <repository-url>
cd Xorigo-UI

# 2. 安装依赖
pnpm install

# 3. 环境配置
cp .env.example .env

# 4. 启动 Docker 环境（推荐）
pnpm docker:dev:monorepo

# 5. 验证环境
curl http://localhost:3100
```

#### 功能开发协作
```bash
# 1. 创建功能分支
git checkout -b feature/new-component

# 2. 本地开发
pnpm local:dev

# 3. 测试验证
pnpm test
pnpm build

# 4. 提交审查
git push origin feature/new-component
# 创建 Pull Request
```

### 3. 部署准备流程

#### 构建验证
```bash
# 1. 完整构建
pnpm build:all

# 2. 类型检查
pnpm type-check

# 3. 测试验证
pnpm test:coverage

# 4. Docker 构建
docker build -f Dockerfile.dev -t xorigo-ui:dev .
```

#### 生产环境测试
```bash
# 1. Docker 生产环境测试
docker-compose -f docker-compose.prod.yml up

# 2. 验证所有功能
# 3. 性能测试
# 4. 安全扫描
```

---

## 🛠️ VS Code 集成

### 1. 推荐扩展

自动安装推荐扩展：
- **Prettier** - 代码格式化
- **ESLint** - 代码检查
- **Tailwind CSS** - 样式开发
- **Docker** - 容器管理
- **Vitest** - 测试集成
- **TypeScript** - 类型支持

### 2. 调试配置

#### 本地开发调试
```json
{
  "name": "Launch Website (Local)",
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/node_modules/.bin/next",
  "args": ["dev"],
  "cwd": "${workspaceFolder}/apps/website",
  "env": {
    "NODE_ENV": "development",
    "PORT": "3100"
  }
}
```

#### 核心库调试
```json
{
  "name": "Launch Core Library (Local)",
  "type": "node",
  "request": "launch",
  "program": "${workspaceFolder}/node_modules/.bin/vite",
  "args": ["--mode", "development"],
  "cwd": "${workspaceFolder}/packages/core",
  "env": {
    "NODE_ENV": "development",
    "VITE_PORT": "3001"
  }
}
```

### 3. 任务配置

#### 开发任务
```json
{
  "label": "Start Local Development",
  "command": "pnpm",
  "args": ["local:dev"],
  "group": {
    "kind": "build",
    "isDefault": true
  }
}
```

#### 质量检查任务
```json
{
  "label": "Type Check",
  "command": "pnpm",
  "args": ["type-check"],
  "group": "test"
}
```

### 4. 快捷键

- **F5** - 启动调试
- **Ctrl+Shift+P** - 命令面板
- **Ctrl+`** - 打开终端
- **Ctrl+Shift+B** - 运行构建任务

---

## 🔍 Claude Code 集成

### 1. 智能权限管理

#### 允许的开发命令
```bash
# 本地开发命令
pnpm local:dev
pnpm dev:core
pnpm dev:website
pnpm local:dev:all

# Docker 开发命令
pnpm docker:dev
pnpm docker:dev:monorepo

# 环境管理命令
node scripts/dev-env-manager.js
pnpm local:dev:check
```

#### 安全约束
- ❌ 严禁直接 Docker 命令
- ❌ 严禁占用端口 3000
- ❌ 严禁模糊的 `npm run dev`
- ✅ 必须使用明确的开发模式

### 2. 代码质量保证

#### 自动检测
- 文件编辑时自动触发质量检测
- 实时反馈架构规则和命名规范
- TypeScript 类型检查和格式化

#### 智能提示
- 违反规则时的具体错误说明
- 推荐的正确命令和解决方案
- 开发环境状态检查和指导

### 3. 开发辅助

#### 组件开发
- 组件模板生成和规范检查
- API 设计一致性验证
- 主题系统集成检查

#### 构建和测试
- 自动化测试执行
- 构建错误诊断
- 性能优化建议

---

## 🎨 主题系统开发

### 1. 七轴主题系统

Xorigo UI 基于七轴DTCG标准，支持：
- **模式轴** (Mode): light/dark/auto
- **色调轴** (Hue): 色相选择
- **饱和度轴** (Saturation): 色彩鲜艳度
- **亮度轴** (Lightness): 明暗程度
- **密度轴** (Density): 空间紧凑度
- **圆度轴** (Roundness): 边角圆润度
- **对比度轴** (Contrast): 视觉对比度

### 2. 配方系统

#### 预览配方
```bash
# 访问配方预览页面
http://localhost:3100/recipes

# 支持的配方
ocean, forest, sunset, lavender, midnight
autumn, winter, spring, summer, cyberpunk
minimal, maximal, warm, cool, neutral
```

#### 自定义配方
```typescript
// 创建新配方
const customRecipe = {
  name: 'custom-theme',
  tokens: {
    mode: 'dark',
    hue: 'blue',
    saturation: 'high',
    lightness: 'medium',
    density: 'comfortable',
    roundness: 'rounded',
    contrast: 'high'
  }
}
```

### 3. 主题开发指南

#### 组件主题适配
```typescript
// 在组件中使用主题令牌
import { useTheme } from '@xorigo/theme'

function Button({ variant, size, children }) {
  const theme = useTheme()

  return (
    <button
      className={cn(
        'btn',
        `btn-${variant}`,
        `btn-${size}`
      )}
      style={{
        backgroundColor: theme.colors.primary,
        color: theme.colors.onPrimary
      }}
    >
      {children}
    </button>
  )
}
```

#### 主题测试
```bash
# 测试所有主题
pnpm test:themes

# 主题一致性检查
pnpm check:themes
```

---

## 🧪 测试策略

### 1. 单元测试

#### 组件测试
```typescript
// Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '../Button'

describe('Button', () => {
  it('renders correctly', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('handles click events', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    screen.getByRole('button').click()
    expect(handleClick).toHaveBeenCalled()
  })
})
```

#### 运行测试
```bash
# 运行所有测试
pnpm test

# 监听模式
pnpm test:watch

# 覆盖率报告
pnpm test:coverage

# 特定文件测试
pnpm test Button.test.tsx
```

### 2. 集成测试

#### 端到端测试
```bash
# 启动测试服务器
pnpm test:e2e

# 运行 Playwright 测试
pnpm test:playwright
```

#### 可访问性测试
```bash
# 可访问性检查
pnpm test:a11y

# 生成可访问性报告
pnpm lint:a11y
```

### 3. 性能测试

#### 构建性能
```bash
# 构建时间分析
pnpm build:analyze

# Bundle 大小分析
pnpm build:size
```

#### 运行时性能
```bash
# Lighthouse CI
pnpm test:lighthouse

# 性能监控
pnpm test:performance
```

---

## 🚨 故障排除

### 1. 环境问题

#### 端口冲突
```bash
# 检查端口占用
lsof -ti:3000
lsof -ti:3001
lsof -ti:3100

# 终止占用进程
kill -9 <PID>

# 使用环境管理器清理
node scripts/dev-env-manager.js stop
```

#### 依赖问题
```bash
# 清理缓存
rm -rf node_modules
rm -rf packages/*/node_modules
rm -rf apps/*/node_modules

# 重新安装
pnpm install

# 验证安装
pnpm local:dev:check
```

#### Docker 问题
```bash
# 检查 Docker 状态
docker --version
docker ps

# 重新构建镜像
docker-compose down
docker-compose up --build

# 清理 Docker 资源
docker system prune -f
```

### 2. 开发问题

#### 热更新不工作
```bash
# 检查文件监听
CHOKIDAR_USEPOLLING=true WATCHPACK_POLLING=true

# 检查 Docker 文件挂载
# 确保 volumes 配置正确

# 重启开发服务器
pnpm local:dev
```

#### TypeScript 错误
```bash
# 类型检查
pnpm type-check

# 重新生成类型
pnpm build:types

# 清理缓存
rm -rf .next
rm -rf packages/core/dist
```

#### 样式问题
```bash
# Tailwind 重建
pnpm build:css

# 检查类名
pnpm lint:css

# 主题一致性检查
pnpm check:themes
```

### 3. 构建问题

#### 构建失败
```bash
# 详细构建日志
DEBUG=vite:* pnpm build

# 检查依赖
pnpm ls

# 清理构建产物
pnpm clean
pnpm build
```

#### 测试失败
```bash
# 详细测试输出
pnpm test --verbose

# 运行特定测试
pnpm test --grep "test-name"

# 更新快照
pnpm test --updateSnapshot
```

---

## 📈 性能优化

### 1. 开发性能

#### 启动优化
- 使用 pnpm 而非 npm（更快的依赖安装）
- 本地开发模式（避免 Docker 开销）
- 增量构建和热更新
- 智能文件监听

#### 内存优化
```bash
# 限制 Node.js 内存
NODE_OPTIONS="--max-old-space-size=4096"

# 启用 SWC 编译器
NEXT_SWC_TELEMETRY_DISABLED=1
```

### 2. 构建性能

#### Vite 优化
```typescript
// vite.config.ts
export default defineConfig({
  build: {
    target: 'esnext',
    minify: 'esbuild',
    sourcemap: true
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
```

#### Next.js 优化
```javascript
// next.config.js
const nextConfig = {
  experimental: {
    appDir: true,
    serverComponentsExternalPackages: ['@xorigo/theme']
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production'
  }
}
```

### 3. 运行时性能

#### 代码分割
```typescript
// 动态导入
const LazyComponent = React.lazy(() => import('./LazyComponent'))

// 路由级别分割
const ComponentPage = dynamic(() => import('./ComponentPage'))
```

#### 主题性能
```typescript
// 主题缓存
const themeCache = new Map()

function useTheme() {
  const [theme, setTheme] = useState(() => {
    const cached = themeCache.get(currentThemeId)
    return cached || generateTheme(currentThemeId)
  })

  return theme
}
```

---

## 🔧 最佳实践

### 1. 代码组织

#### 组件结构
```
components/
├── ui/                    # 原子组件
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Button.stories.tsx
│   │   └── index.ts
│   └── Input/
├── layout/               # 布局组件
└── features/             # 功能组件
```

#### 类型定义
```typescript
// 组件 Props 类型
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
  children: React.ReactNode
}

// 主题类型
interface Theme {
  colors: ColorTokens
  spacing: SpacingTokens
  typography: TypographyTokens
}
```

### 2. 开发流程

#### Git 工作流
```bash
# 功能开发
git checkout -b feature/new-component
# 开发...
git add .
git commit -m "feat: 添加新组件"
git push origin feature/new-component

# 代码审查后合并
git checkout main
git merge feature/new-component
git tag v1.2.3
```

#### 提交规范
```bash
# 提交类型
feat: 新功能
fix: 修复问题
docs: 文档更新
style: 代码格式
refactor: 代码重构
test: 测试相关
chore: 构建工具
```

### 3. 质量保证

#### 代码审查清单
- [ ] TypeScript 类型正确
- [ ] 组件 API 一致性
- [ ] 主题系统集成
- [ ] 可访问性支持
- [ ] 测试覆盖率 >80%
- [ ] 文档完整

#### 发布前检查
```bash
# 完整检查流程
pnpm lint
pnpm type-check
pnpm test
pnpm build:all
pnpm test:e2e
pnpm check:themes
```

---

## 🎯 总结

Xorigo UI 的混合开发环境为现代化前端开发提供了：

### ✅ 核心优势

1. **灵活选择**：根据需求选择最适合的开发模式
2. **性能优化**：本地开发极速，Docker 环境一致
3. **智能管理**：一键切换，自动检测和修复
4. **端口安全**：避免冲突，为其他库让路
5. **工具完善**：VS Code 集成，调试工具齐全
6. **质量保证**：自动化测试和代码检查
7. **团队协作**：统一的开发环境和流程

### 🚀 推荐使用方式

1. **日常开发**：`pnpm local:dev`
2. **团队协作**：`pnpm docker:dev:monorepo`
3. **环境管理**：`node scripts/dev-env-manager.js`
4. **质量检查**：`pnpm lint && pnpm type-check && pnpm test`
5. **问题排查**：查看错误提示和本文档故障排除章节

### 📚 相关文档

- [CLAUDE.md](../CLAUDE.md) - Claude Code 开发指南
- [DEV-ENVIRONMENT.md](../DEV-ENVIRONMENT.md) - 开发环境详细说明
- [claude-configuration-update.md](./claude-configuration-update.md) - Claude 配置更新说明

---

**维护者**：Xorigo UI Team
**更新日期**：2025-01-25
**版本**：1.0.0
**技术栈**：React 19 + TypeScript 5.9 + Tailwind CSS 4 + Framer Motion 12
**部署状态**：✅ 本地 + Docker 双模式就绪