# Xorigo CLI - 现代化组件库脚手架工具

## 概述

Xorigo CLI 是一个功能强大的命令行工具，专为 Xorigo UI 组件库设计，支持项目初始化、组件生成、主题管理、构建优化、NPM 发布等全生命周期操作。

## 核心命令

### 1. 项目初始化 - `xorigo init`

快速创建基于 Xorigo UI 的新项目。

```bash
# 创建 React 项目（默认）
xorigo init my-app

# 创建 Next.js 项目
xorigo init my-app --framework next

# 使用 TypeScript（默认开启）
xorigo init my-app --typescript

# 创建最小化模板
xorigo init my-app --template minimal

# 不自动安装依赖
xorigo init my-app --no-install
```

**特性**:
- ✅ 支持 React 19 和 Next.js 15
- ✅ 集成 Tailwind CSS
- ✅ TypeScript 支持
- ✅ 5秒内完成项目脚手架
- ✅ 自动生成项目结构和配置

### 2. 组件生成 - `xorigo add`

生成符合规范的 React 组件。

```bash
# 生成标准组件
xorigo add Button

# 指定模板类型
xorigo add DataTable --template compound

# 指定分类
xorigo add Modal --category overlay

# 生成变体和复合组件
xorigo add Button --has-variants --has-compound
```

**特性**:
- ✅ 6种组件模板：standard、compound、form、layout、navigation、overlay
- ✅ 完整类型定义（TypeScript）
- ✅ 自动生成测试文件
- ✅ API 文档生成
- ✅ 遵循设计系统规范

### 3. 主题管理 - `xorigo theme`

主题生成、预览和管理。

```bash
# 预览主题
xorigo theme preview

# 使用指定配方
xorigo theme preview --preset modern-dark

# 生成主题令牌
xorigo theme generate

# 生成指定主题
xorigo theme generate --preset warm-light

# 列出所有配方
xorigo theme list

# 验证主题配置
xorigo theme --validate --preset modern-light
```

**内置配方**:
- `modern-light` - 现代浅色主题
- `modern-dark` - 现代深色主题
- `warm-light` - 暖色浅色主题
- `cool-dark` - 冷色深色主题
- `nature-light` - 自然浅色主题

**特性**:
- ✅ 5种预定义配色方案
- ✅ 七轴主题系统（DTCG 标准）
- ✅ 自动生成 Tailwind 配置
- ✅ 主题预览页面
- ✅ 令牌文件导出

### 4. 构建优化 - `xorigo build`

高性能构建和包分析。

```bash
# 生产环境构建
xorigo build

# 开发环境构建
xorigo build --preset development

# 启用包分析
xorigo build --analyze

# 监听模式
xorigo build --watch

# 性能优化模式
xorigo build --preset performance
```

**特性**:
- ✅ 自动代码分割
- ✅ 性能监控
- ✅ 包大小分析
- ✅ 构建报告生成
- ✅ Tree Shaking 优化

### 5. 解决方案生成 - `xorigo generate`

快速生成常见业务场景的完整解决方案。

```bash
# 生成登录解决方案
xorigo generate login my-login

# 生成数据表格解决方案
xorigo generate data-table user-table

# 生成主题切换解决方案
xorigo generate theme-switch dark-mode
```

**内置解决方案**:

#### 登录方案 (`login`)
- 登录表单组件
- 状态管理 Hook
- 认证工具函数
- 类型定义
- 完整示例页面

#### 数据表格方案 (`data-table`)
- 可排序、可筛选表格
- 分页组件
- 响应式设计
- TypeScript 类型安全

#### 主题切换方案 (`theme-switch`)
- Hook 管理主题状态
- 浅色/深色/系统主题切换
- 本地存储持久化
- Tailwind 集成

**特性**:
- ✅ 完整功能实现
- ✅ 开箱即用
- ✅ 可自定义扩展
- ✅ 包含完整文档

### 6. NPM 发布 - `xorigo publish`

一键发布到 NPM。

```bash
# 发布到 latest 标签
xorigo publish

# 发布到 beta 标签
xorigo publish --tag beta

# 模拟发布
xorigo publish --dry-run

# 私有包
xorigo publish --access private

# 跳过测试和构建
xorigo publish --skip-tests --skip-build
```

**特性**:
- ✅ 自动运行测试
- ✅ 自动构建包
- ✅ 版本冲突检测
- ✅ 包内容验证
- ✅ 发布日志生成

### 7. 其他命令

```bash
# 设计令牌导出
xorigo tokens:export -f css -o ./tokens

# 国际化提取
xorigo i18n:extract -l en zh-CN

# 组件注册表扫描
xorigo registry:scan

# 质量检查
xorigo check keyboard
xorigo check overlay
xorigo check virtualization

# 系统健康检查
xorigo doctor

# 文档同步
xorigo sync
```

## 性能指标

### 响应时间

- **命令启动**: < 500ms
- **init 命令**: < 5s
- **add 命令**: < 1s
- **theme preview**: < 1s
- **build 命令**: < 10s

### 代码质量

- **文档覆盖率**: > 95%
- **TypeScript 类型覆盖**: 100%
- **组件测试覆盖**: > 90%

## 安装和使用

### 全局安装

```bash
npm install -g @xorigo-cli/commands
```

### 项目局部使用

```bash
# 在项目中安装
pnpm add -D @xorigo-cli/commands

# 或使用 npx
npx xorigo init my-app
```

### 开发模式

```bash
# 从源码运行
cd packages/cli
pnpm dev
```

## 项目结构

```
packages/cli/
├── bin/
│   └── xorigo.js              # CLI 入口脚本
├── src/
│   ├── index.ts               # 主程序
│   ├── commands/              # 命令实现
│   │   ├── init.ts            # 项目初始化
│   │   ├── add.ts             # 组件生成
│   │   ├── theme.ts           # 主题管理
│   │   ├── build.ts           # 构建优化
│   │   ├── generate.ts        # 解决方案生成
│   │   ├── publish.ts         # NPM 发布
│   │   └── ...                # 其他命令
│   └── utils/                 # 工具函数
│       ├── logger.ts          # 日志工具
│       ├── validation.ts      # 验证工具
│       └── file-system.ts     # 文件系统
├── dist/                      # 编译输出
├── package.json
└── README.md
```

## 技术栈

- **命令解析**: Commander.js
- **进度显示**: Ora
- **彩色输出**: Chalk
- **文件操作**: fs/promises
- **构建工具**: TypeScript 编译器
- **运行环境**: Node.js 18+

## 最佳实践

### 1. 项目初始化

```bash
# 推荐配置
xorigo init my-app \
  --framework next \
  --typescript \
  --template full

cd my-app
pnpm install
pnpm dev
```

### 2. 组件开发

```bash
# 生成组件
xorigo add MyComponent --template standard

# 添加到项目
cd packages/core/src
cp MyComponent.tsx base/

# 运行测试
pnpm test MyComponent
```

### 3. 主题定制

```bash
# 预览现有主题
xorigo theme preview --preset modern-light

# 基于现有主题生成自定义主题
xorigo theme generate --preset my-theme

# 编辑生成的配置文件
vim themes/my-theme/tailwind.config.js
```

### 4. 解决方案集成

```bash
# 生成解决方案
xorigo generate login auth

# 集成到应用
cp -r solutions/auth/* src/

# 自定义样式
vim src/components/LoginForm.tsx
```

## 常见问题

### Q: 如何更新 CLI 工具？

```bash
npm update -g @xorigo-cli/commands
```

### Q: 如何查看命令详细帮助？

```bash
xorigo init --help
xorigo add --help
xorigo theme --help
```

### Q: 如何报告问题？

请访问 [GitHub Issues](https://github.com/xorigo-ui/cli/issues)

### Q: 如何贡献代码？

请阅读 [贡献指南](CONTRIBUTING.md)

## 许可证

MIT License

## 更新日志

### v2025.11.05

- ✨ 新增 `init` 命令 - 项目初始化
- ✨ 新增 `theme` 命令 - 主题管理
- ✨ 新增 `build` 命令 - 构建优化
- ✨ 新增 `generate` 命令 - 解决方案生成
- ✨ 新增 `publish` 命令 - NPM 发布
- 🚀 优化命令响应时间至 < 1秒
- 📚 完善文档，覆盖率 > 95%

---

**维护**: Xorigo UI Team
**版本**: 2025.11.05
