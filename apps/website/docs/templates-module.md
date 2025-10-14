# Templates 模块文档

## 概述

Templates 模块是 Xorigo UI 项目模板库的核心功能，提供完整的项目起始模板，帮助开发者快速启动新项目。

## 功能特性

### 1. 模板展示系统
- **分类筛选**: 支持按类别（Starter/Application/Industry）、难度、技术栈筛选
- **搜索功能**: 支持按名称、描述、标签搜索模板
- **响应式设计**: 完美适配桌面、平板和移动设备
- **实时预览**: 提供模板预览图片和交互式预览功能

### 2. 模板详情页面
- **完整信息展示**: 包含模板描述、技术栈、功能特性等详细信息
- **统计数据**: 显示下载量、星标数、分支数等统计信息
- **使用指南**: 提供详细的使用说明和快速开始指南
- **相关推荐**: 智能推荐相关模板

### 3. 多种下载方式
- **CLI 命令**: 使用 `npx create-xorigo-app` 快速创建项目
- **GitHub 克隆**: 直接从 GitHub 仓库克隆完整代码
- **ZIP 下载**: 下载包含所有模板文件的 ZIP 压缩包

## 文件结构

```
apps/website/
├── app/(dashboard)/templates/
│   ├── page.tsx                    # 主模板页面
│   └── [id]/
│       └── page.tsx                # 模板详情页面
├── src/
│   ├── types/
│   │   └── templates.ts            # 模板类型定义
│   ├── data/
│   │   └── templates.ts            # 模板数据配置
│   └── components/templates/
│       ├── index.ts                # 组件导出
│       ├── template-filters.tsx    # 筛选组件
│       ├── template-grid.tsx       # 网格展示组件
│       ├── template-preview.tsx    # 预览组件
│       ├── template-download.tsx   # 下载组件
│       ├── template-features.tsx   # 功能特性组件
│       ├── template-stats.tsx      # 统计信息组件
│       └── related-templates.tsx   # 相关模板组件
```

## 核心类型定义

### Template 接口
```typescript
interface Template {
  id: string                    // 模板唯一标识
  name: string                  // 模板名称
  category: TemplateCategory    // 模板分类
  description: string           // 简短描述
  longDescription?: string      // 详细描述
  preview: string               // 预览图片
  technologies: TemplateTech[]  // 技术栈
  features: TemplateFeature[]   // 功能特性
  githubRepo?: string           // GitHub 仓库地址
  demoUrl?: string              // 在线演示地址
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string         // 预计完成时间
  stats: TemplateStats          // 统计数据
  tags: string[]                // 标签
  author: AuthorInfo            // 作者信息
}
```

### TemplateFilters 接口
```typescript
interface TemplateFilters {
  category?: TemplateCategory | 'all'    // 分类筛选
  difficulty?: 'all' | 'beginner' | 'intermediate' | 'advanced'
  technologies?: string[]               // 技术栈筛选
  search?: string                       // 搜索关键词
}
```

## 使用方法

### 1. 添加新模板

在 `src/data/templates.ts` 中添加新的模板数据：

```typescript
export const templates: Template[] = [
  // 现有模板...
  {
    id: 'new-template',
    name: '新模板',
    category: 'starter',
    description: '模板描述',
    preview: '/templates/new-preview.jpg',
    technologies: [
      { name: 'Next.js', version: '14', icon: '⚛️', category: 'frontend' },
      // 更多技术栈...
    ],
    features: [
      { name: '功能名称', description: '功能描述', included: true },
      // 更多功能...
    ],
    // 其他必需字段...
  }
]
```

### 2. 自定义筛选逻辑

修改 `src/data/templates.ts` 中的 `filterTemplates` 函数：

```typescript
export function filterTemplates(templates: Template[], filters: TemplateFilters): Template[] {
  return templates.filter(template => {
    // 自定义筛选逻辑
    return true
  })
}
```

### 3. 扩展组件功能

所有组件都支持自定义扩展：

```typescript
// 扩展筛选组件
<TemplateFilters
  filters={filters}
  onFiltersChange={handleFiltersChange}
  totalCount={templates.length}
  filteredCount={filteredTemplates.length}
  // 自定义属性
  customFeature={true}
/>
```

## 模板分类

### Starter（基础模板）
- 适合新项目开始的简单模板
- 包含基础的项目结构和配置
- 预计完成时间：30分钟内

### Application（完整应用）
- 功能完整的 Web 应用模板
- 包含完整的业务逻辑和功能
- 预计完成时间：1-2小时

### Industry（行业方案）
- 针对特定行业的专业模板
- 包含行业特定的功能和最佳实践
- 预计完成时间：3-4小时

## CLI 工具集成

模板支持通过 CLI 工具快速创建项目：

```bash
# 基础命令
npx create-xorigo-app@latest my-app --template landing-page

# 带选项的命令
npx create-xorigo-app@latest my-app \
  --template admin-dashboard \
  --typescript \
  --tailwind \
  --eslint \
  --app
```

## 开发指南

### 1. 添加新的筛选条件

1. 更新 `TemplateFilters` 接口
2. 修改 `TemplateFilters` 组件
3. 更新 `filterTemplates` 函数

### 2. 自定义预览功能

1. 更新 `TemplatePreview` 组件
2. 添加新的预览模式
3. 集成实际的预览功能

### 3. 扩展下载方式

1. 更新 `DownloadOption` 类型
2. 修改 `TemplateDownload` 组件
3. 实现新的下载逻辑

## 性能优化

### 1. 图片优化
- 使用 Next.js Image 组件
- 配置适当的图片尺寸
- 启用懒加载

### 2. 代码分割
- 使用动态导入加载组件
- 按需加载模板数据
- 优化 bundle 大小

### 3. 缓存策略
- 实现模板数据缓存
- 使用浏览器缓存
- 配置 CDN 缓存

## 部署注意事项

1. **静态资源**: 确保预览图片正确部署
2. **环境变量**: 配置必要的环境变量
3. **API 集成**: 确保 GitHub API 和下载功能正常
4. **SEO 优化**: 配置合适的 meta 标签和结构化数据

## 未来规划

### 短期目标
- [ ] 添加更多模板类型
- [ ] 实现交互式预览功能
- [ ] 优化移动端体验
- [ ] 添加模板评分系统

### 长期目标
- [ ] 支持自定义模板上传
- [ ] 集成在线编辑器
- [ ] 添加模板市场功能
- [ ] 支持团队协作

## 贡献指南

1. Fork 项目仓库
2. 创建功能分支
3. 提交代码变更
4. 创建 Pull Request
5. 等待代码审查

## 许可证

Templates 模块遵循 MIT 许可证，允许自由使用和修改。