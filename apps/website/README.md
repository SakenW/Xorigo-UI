# Xorigo UI Website

现代化的 React 组件库官网和应用演示平台，基于 Next.js 14 和现代 Web 技术栈构建。

## 🚀 技术栈

- **框架**: Next.js 14 (App Router)
- **语言**: TypeScript 5.9
- **样式**: Tailwind CSS 3.4
- **动画**: Framer Motion 12
- **构建工具**: Vite
- **部署**: Docker

## 📁 项目结构

```
apps/website/
├── src/
│   ├── app/                 # Next.js App Router 页面
│   │   ├── docs/           # 文档页面
│   │   ├── adoption/       # 采用案例页面
│   │   ├── tokens/         # 设计令牌页面
│   │   ├── gallery/        # 配方库页面
│   │   ├── playground/     # 演练场页面
│   │   └── api/           # API 路由
│   ├── components/         # React 组件
│   │   ├── ui/            # 基础 UI 组件
│   │   ├── errors/        # 错误边界组件
│   │   ├── gallery/       # 配方库组件
│   │   ├── playground/    # 演练场组件
│   │   ├── hero/          # 首页 Hero 组件
│   │   ├── features/      # 特性展示组件
│   │   ├── cta/           # CTA 组件
│   │   └── stats/         # 统计数据组件
│   ├── lib/               # 工具函数和配置
│   ├── stores/            # 状态管理
│   ├── sdk/               # SDK 客户端
│   └── data/              # 静态数据
├── public/                # 静态资源
├── __tests__/             # 测试文件
└── docs/                 # 项目文档
```

## 🛠️ 开发环境

### 前置要求

- Node.js 18+
- npm 或 yarn
- Docker (可选，用于容器化部署)

### 本地开发

1. **克隆项目**
```bash
git clone https://github.com/xorigo-ui/xorigo-ui.git
cd xorigo-ui/apps/website
```

2. **安装依赖**
```bash
npm install
```

3. **启动开发服务器**
```bash
npm run dev
```

4. **访问应用**
- 开发环境: http://localhost:3000
- API 路由: http://localhost:3000/api

### Docker 开发

```bash
# 启动开发容器
npm run docker:dev

# 查看日志
npm run docker:logs

# 停止容器
npm run docker:stop
```

## 📚 功能特性

### 🎨 配方库系统
- **七轴样式配方**: 模式/色调/密度/表面/类别等多维度样式组合
- **实时预览**: 点击配方即时查看效果
- **无限扩展**: 支持自定义配方和样式组合
- **响应式设计**: 适配各种屏幕尺寸

### 🛝 演练场功能
- **实时编辑**: 在线编辑组件代码
- **组件预览**: 实时查看组件效果
- **属性编辑**: 动态调整组件属性
- **性能监控**: 组件性能分析和优化建议
- **代码生成**: 一键复制可用代码

### 📖 文档系统
- **完整 API 文档**: 详细的组件 API 参考
- **使用指南**: 从基础到高级的使用教程
- **示例代码**: 实际应用场景的代码示例
- **设计令牌**: 完整的设计系统文档

### 🎯 采用案例
- **成功案例**: 真实的客户使用案例
- **用户反馈**: 来自社区的正面评价
- **统计数据**: 下载量、用户数等关键指标
- **行业覆盖**: 不同行业的应用场景

## 🔧 构建和部署

### 本地构建

```bash
# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 类型检查
npm run type-check

# 代码检查
npm run lint

# 格式化代码
npm run format
```

### 生产部署

```bash
# Docker 部署
npm run deploy

# 查看生产日志
npm run deploy:logs

# 停止生产环境
npm run deploy:stop

# 重新构建部署
npm run deploy:rebuild
```

## 🧪 测试

```bash
# 运行所有测试
npm run test

# 测试覆盖率
npm run test:coverage

# 测试 UI 界面
npm run test:ui

# 监听模式
npm run test:watch
```

## 📊 性能优化

- **代码分割**: 自动路由级别的代码分割
- **图片优化**: Next.js 内置图片优化
- **缓存策略**: 智能的静态资源缓存
- **预加载**: 关键资源预加载
- **压缩**: Gzip/Brotli 压缩

## 🔐 安全性

- **HTTPS 强制**: 生产环境强制 HTTPS
- **CSP 头**: 内容安全策略配置
- **XSS 防护**: 内置 XSS 攻击防护
- **依赖扫描**: 定期安全漏洞扫描

## 🌍 国际化

- **多语言支持**: 中文优先，支持英文
- **RTL 支持**: 从右到左语言支持
- **本地化**: 日期、时间、数字格式本地化

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🔗 相关链接

- [主项目仓库](https://github.com/xorigo-ui/xorigo-ui)
- [组件库文档](https://xorigo-ui.com/docs)
- [API 参考](https://xorigo-ui.com/api)
- [设计系统](https://xorigo-ui.com/tokens)

## 📞 联系我们

- GitHub Issues: [提交问题](https://github.com/xorigo-ui/xorigo-ui/issues)
- Discussions: [参与讨论](https://github.com/xorigo-ui/xorigo-ui/discussions)
- Email: [联系我们](mailto:team@xorigo-ui.com)

---

Made with ❤️ by Xorigo UI Team# 热更新测试 Mon Oct 13 01:33:49 PM CST 2025
