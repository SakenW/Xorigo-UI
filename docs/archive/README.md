# 📚 TH-UI 文档中心

> **TH-UI 完整文档索引和导航**

---

## 🎯 快速导航

### 🚀 新手入门
- [项目概览](../README.md) - 了解 TH-UI 是什么
- [快速开始](#) - 5分钟上手指南
- [开发指南](../CLAUDE.md) - 开发规范和最佳实践

### 🏗️ 核心架构
1. **[完整新系统架构指南](./NEW_SYSTEM_COMPLETE_GUIDE.md)** ⭐
   - 七轴配方体系完整设计
   - 系统分层和数据流
   - OKLCH 色彩引擎
   - 实施路线图

2. **[OKLCH 色彩系统](./OKLCH_COLOR_SYSTEM.md)** 🌈
   - OKLCH 色彩空间详解
   - 色彩生成策略（单色/类似色/双色/三色）
   - 暗色模式对称映射
   - 可访问性计算

3. **[Next.js 网站架构](./NEXTJS_GALLERY_ADOPTION_ARCHITECTURE.md)** 🌐
   - Gallery 展示页面设计
   - Adoption Matrix 取用矩阵
   - Playground 实时预览
   - Monorepo 架构

### 📖 实施指南
- **[组件迁移指南](./COMPONENT_MIGRATION_GUIDE.md)** 🔄
  - 从 ThemeProvider 到 StyleRecipeProvider
  - CSS 变量映射表
  - 标准迁移步骤
  - 常见问题和解决方案

- **[API 参考文档](./API_REFERENCE.md)** 📘
  - StyleRecipeProvider API
  - Hooks 完整文档
  - 类型定义
  - 配方查询 API

### 📊 技术规范
- [七轴风格配方体系](./TH-UI%20风格配方体系（v1.0）设计指南.md)
- [项目架构概览](./ARCHITECTURE.md)
- [升级总结](./UPGRADE-SUMMARY.md)

---

## 📂 文档结构

```
docs/
├── README.md                                    # 本文档（文档中心）
│
├── 🏗️ 核心架构文档
│   ├── NEW_SYSTEM_COMPLETE_GUIDE.md            # ⭐ 完整新系统架构
│   ├── OKLCH_COLOR_SYSTEM.md                   # 🌈 OKLCH 色彩系统
│   └── NEXTJS_GALLERY_ADOPTION_ARCHITECTURE.md # 🌐 Next.js 网站架构
│
├── 📖 实施指南
│   ├── COMPONENT_MIGRATION_GUIDE.md            # 🔄 组件迁移指南
│   └── API_REFERENCE.md                        # 📘 API 参考文档
│
├── 📊 技术规范
│   ├── ARCHITECTURE.md                         # 项目架构概览
│   ├── TH-UI 风格配方体系（v1.0）设计指南.md  # 七轴体系设计
│   └── UPGRADE-SUMMARY.md                      # 升级总结
│
├── 🗑️ 已废弃文档（仅供参考）
│   └── UNIFIED_RECIPE_OPTIMIZATION.md          # 已被 NEW_SYSTEM 取代
│
└── 📁 专题文档
    ├── architecture/                           # 架构相关
    ├── docker/                                 # Docker 部署
    ├── migration/                              # 迁移指南
    └── reports/                                # 开发报告
```

---

## 🎨 核心概念

### 七轴风格配方体系

**七个轴**：
1. **Mode** - 模式轴：light / dark / hc
2. **Base** - 基础轴：中性色温度和色度
3. **Accent** - 强调轴：主色策略（mono/analog/duo/triadic）
4. **Tone** - 色调轴：calm / standard / vivid / vibrant
5. **Density** - 密度轴：spacious / comfortable / compact
6. **Motion** - 动效轴：subtle / standard / expressive
7. **Surface** - 表面轴：flat / soft-shadow / elevated / glass

**配方 ID 格式**：
```
<mode>.<base>.<accent>.<tone>.<density>.<motion>.<surface>

示例:
dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass
```

### OKLCH 色彩空间

- **L (Lightness)**: 亮度 (0-1)
- **C (Chroma)**: 色度 (0-0.4)
- **H (Hue)**: 色相 (0-360°)

**优势**：
- ✅ 感知均匀
- ✅ 亮度一致
- ✅ 动画流畅
- ✅ 易于计算对比度

### CSS 变量系统

组件完全解耦，使用 CSS 变量：

```typescript
// ✅ 新系统
'bg-[var(--color-primary-500)]'
'px-[var(--spacing-md)]'
'duration-[var(--motion-duration-base)]'

// ❌ 旧系统
'bg-gradient-to-r from-blue-500 to-purple-600'
```

---

## 📋 开发路线图

### ✅ 已完成

- [x] 七轴配方体系设计
- [x] OKLCH 色彩引擎设计
- [x] StyleRecipeProvider 架构
- [x] Next.js 网站架构
- [x] 核心文档编写
- [x] Button 组件示例

### 🔄 进行中

- [ ] OKLCH 色彩引擎实现
- [ ] CSS 变量生成器实现
- [ ] StyleRecipeProvider 实现
- [ ] Card 组件迁移
- [ ] Input 组件迁移

### ⏳ 待开始

- [ ] Modal 组件迁移
- [ ] Switch 组件迁移
- [ ] 其余13个组件迁移
- [ ] Next.js 网站实现
- [ ] Gallery 页面实现
- [ ] Adoption Matrix 实现

---

## 🔗 相关资源

### 外部文档
- [OKLCH Color Space](https://bottosson.github.io/posts/oklab/)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [CSS Color Module Level 4](https://www.w3.org/TR/css-color-4/)
- [Tailwind CSS 4](https://tailwindcss.com/docs)
- [React 19](https://react.dev/)
- [Framer Motion 12](https://www.framer.com/motion/)

### 工具库
- [culori](https://culorijs.org/) - 色彩空间转换
- [color.js](https://colorjs.io/) - 现代色彩操作
- [CVA](https://cva.style/) - 类型安全的变体系统
- [Radix UI](https://www.radix-ui.com/) - 无障碍组件基础

---

## 🤝 贡献指南

### 文档更新流程

1. **修改文档** - 编辑 `.md` 文件
2. **更新索引** - 在本文档中更新链接
3. **检查链接** - 确保所有链接有效
4. **提交审核** - 创建 Pull Request

### 文档规范

- 使用 Markdown 格式
- 中文为主，技术术语保留英文
- 代码示例完整可运行
- 添加适当的 emoji 增强可读性
- 保持目录结构清晰

---

## 📞 获取帮助

- **GitHub Issues**: [提交问题](https://github.com/your-org/th-ui/issues)
- **讨论区**: [参与讨论](https://github.com/your-org/th-ui/discussions)
- **团队联系**: TH-UI Team

---

## 📄 文档状态

| 文档 | 状态 | 最后更新 |
|------|------|----------|
| NEW_SYSTEM_COMPLETE_GUIDE.md | ✅ 完成 | 2025-01-13 |
| OKLCH_COLOR_SYSTEM.md | ✅ 完成 | 2025-01-13 |
| COMPONENT_MIGRATION_GUIDE.md | ✅ 完成 | 2025-01-13 |
| API_REFERENCE.md | ✅ 完成 | 2025-01-13 |
| NEXTJS_GALLERY_ADOPTION_ARCHITECTURE.md | ✅ 完成 | 2025-01-13 |
| ARCHITECTURE.md | ⚠️ 需更新 | - |
| UNIFIED_RECIPE_OPTIMIZATION.md | 🗑️ 已废弃 | - |

---

**维护**: TH-UI Team
**版本**: 1.0.0
**最后更新**: 2025-01-13
