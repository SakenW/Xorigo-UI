# @xorigo-ui/team

团队模板库和版本控制系统，支持模板管理、版本控制、团队协作和审核流程。

## 功能特性

### 📚 模板库功能
- **模板管理** - 创建、编辑、删除和版本化模板
- **分类系统** - 支持多种模板分类（仪表板、落地页、表单等）
- **标签系统** - 灵活的标签组织和筛选
- **团队共享** - 团队内模板共享和访问控制
- **使用统计** - 模板使用情况和用户反馈追踪

### 🌳 版本控制功能
- **语义化版本** - 基于 SemVer 的版本管理
- **分支管理** - 支持创建、切换和合并分支
- **合并请求** - 代码审查和合并流程
- **冲突解决** - 自动和手动的冲突解决机制
- **回滚功能** - 支持回滚到历史版本

### 👥 团队协作功能
- **成员管理** - 添加、删除和角色管理
- **权限控制** - 基于角色的访问控制
- **审核流程** - 模板发布和更新的审核机制
- **活动历史** - 完整的团队活动日志

### 📊 分析和洞察
- **使用统计** - 模板使用情况和趋势分析
- **评级系统** - 用户评分和反馈
- **性能指标** - 模板性能和优化建议

## 安装

```bash
pnpm add @xorigo-ui/team
```

## 快速开始

### 模板库管理

```typescript
import { TemplateLibrary } from '@xorigo-ui/team'

// 创建模板库实例
const templateLibrary = new TemplateLibrary('team-123')

// 创建新模板
const template = await templateLibrary.create({
  name: 'Marketing Landing Page',
  description: 'A modern marketing landing page template',
  category: 'landing-page',
  tags: [
    { id: 'tag-1', name: 'Marketing', color: '#FF6B6B' },
    { id: 'tag-2', name: 'Responsive', color: '#4ECDC4' }
  ],
  author: {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com'
  },
  isPublic: false,
  isFeatured: false
}, {
  // 模板内容
  html: '<div>...</div>',
  css: 'body { ... }',
  components: []
})

console.log('Template created:', template.id)
```

### 搜索模板

```typescript
// 搜索模板
const results = await templateLibrary.search({
  query: 'landing page',
  category: 'landing-page',
  tags: ['tag-1', 'tag-2'],
  sortBy: 'rating',
  sortOrder: 'desc',
  limit: 20,
  offset: 0
})

console.log('Found templates:', results.templates.length)
console.log('Total results:', results.total)
console.log('Has more:', results.hasMore)
```

### 版本控制

```typescript
import { VersionControl } from '@xorigo-ui/team'

// 创建版本控制器
const versionControl = new VersionControl('main')

// 创建版本
const version = await versionControl.createVersion(
  '1.0.0',
  'Initial release',
  {
    html: '<div>...</div>',
    css: 'body { ... }'
  },
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com'
  }
)

console.log('Version created:', version.version)
```

### 分支管理

```typescript
// 创建新分支
await versionControl.createBranch(
  'feature/new-section',
  version.id,
  'Adding new section to template'
)

// 切换分支
versionControl.switchBranch('feature/new-section')

// 创建合并请求
const mergeRequest = await versionControl.createMergeRequest(
  'feature/new-section',
  'main',
  'Add new hero section',
  'This MR adds a new hero section to the landing page template',
  'user-1'
)

console.log('Merge request created:', mergeRequest.id)
```

### 合并分支

```typescript
// 分析合并冲突
const analysis = versionControl.analyzeMerge(
  'feature/new-section',
  'main'
)

if (!analysis.hasConflicts) {
  // 无冲突，直接合并
  const mergedVersion = await versionControl.merge(
    'feature/new-section',
    'main',
    mergeRequest.id,
    { id: 'user-1', name: 'John Doe' }
  )
  console.log('Merged successfully:', mergedVersion.version)
} else {
  // 存在冲突，需要手动解决
  console.log('Conflicts detected:', analysis.conflicts)
}
```

### 模板使用统计

```typescript
// 记录模板使用
await templateLibrary.trackUsage(
  template.id,
  'user-123',
  {
    source: 'dashboard',
    timestamp: Date.now()
  }
)

// 获取统计信息
const stats = await templateLibrary.getStats(template.id)

console.log('Total usages:', stats.totalUsages)
console.log('Unique users:', stats.uniqueUsers)
console.log('Average rating:', stats.averageRating)
console.log('Usages by day:', stats.usagesByDay)
```

## API 参考

### TemplateLibrary

#### 构造函数
```typescript
new TemplateLibrary(teamId?: string)
```

#### 主要方法

##### create(data, content)
创建新模板
```typescript
await templateLibrary.create(
  data: Omit<Template, 'id' | 'versions' | 'currentVersion' | 'usageCount' | 'rating' | 'ratingsCount' | 'createdAt' | 'updatedAt'>,
  content: unknown
): Promise<Template>
```

##### get(templateId)
获取模板
```typescript
await templateLibrary.get(templateId: string): Promise<Template | null>
```

##### update(templateId, updates)
更新模板
```typescript
await templateLibrary.update(
  templateId: string,
  updates: Partial<Template>
): Promise<Template>
```

##### delete(templateId)
删除模板
```typescript
await templateLibrary.delete(templateId: string): Promise<boolean>
```

##### addVersion(templateId, content, version, changelog)
添加版本
```typescript
await templateLibrary.addVersion(
  templateId: string,
  content: unknown,
  version: string,
  changelog?: string
): Promise<TemplateVersion>
```

##### search(options)
搜索模板
```typescript
await templateLibrary.search(
  options: TemplateSearchOptions
): Promise<TemplateSearchResult>
```

##### trackUsage(templateId, userId, metadata)
记录使用
```typescript
await templateLibrary.trackUsage(
  templateId: string,
  userId: string,
  metadata?: Record<string, unknown>
): Promise<void>
```

##### getStats(templateId)
获取统计
```typescript
await templateLibrary.getStats(
  templateId: string
): Promise<TemplateStats>
```

##### import(templateData, options)
导入模板
```typescript
await templateLibrary.import(
  templateData: Template,
  options: { overwriteExisting?: boolean }
): Promise<Template>
```

##### export(templateId, options)
导出模板
```typescript
await templateLibrary.export(
  templateId: string,
  options: {
    includeVersions?: boolean
    includeMetadata?: boolean
    format?: 'json' | 'yaml'
  }
): Promise<string>
```

### VersionControl

#### 构造函数
```typescript
new VersionControl(initialBranch?: string)
```

#### 主要方法

##### createVersion(version, message, content, author, branch)
创建版本
```typescript
await versionControl.createVersion(
  version: string,
  message: string,
  content: unknown,
  author: { id: string; name: string; email?: string },
  branch?: string
): Promise<Version>
```

##### getVersion(versionId)
获取版本
```typescript
versionControl.getVersion(versionId: string): Version | null
```

##### getLatestVersion(branch)
获取最新版本
```typescript
versionControl.getLatestVersion(branch?: string): Version | null
```

##### getAllVersions(branch)
获取所有版本
```typescript
versionControl.getAllVersions(branch?: string): Version[]
```

##### createBranch(name, fromVersionId, description)
创建分支
```typescript
await versionControl.createBranch(
  name: string,
  fromVersionId: string | null,
  description?: string
): Promise<VersionBranch>
```

##### switchBranch(name)
切换分支
```typescript
versionControl.switchBranch(name: string): void
```

##### getBranch(name)
获取分支
```typescript
versionControl.getBranch(name: string): VersionBranch | null
```

##### getAllBranches()
获取所有分支
```typescript
versionControl.getAllBranches(): VersionBranch[]
```

##### createMergeRequest(sourceBranch, targetBranch, title, description, createdBy)
创建合并请求
```typescript
await versionControl.createMergeRequest(
  sourceBranch: string,
  targetBranch: string,
  title: string,
  description: string,
  createdBy: string
): Promise<MergeRequest>
```

##### getMergeRequest(mrId)
获取合并请求
```typescript
versionControl.getMergeRequest(mrId: string): MergeRequest | null
```

##### getAllMergeRequests(status)
获取所有合并请求
```typescript
versionControl.getAllMergeRequests(status?: 'open' | 'merged' | 'closed'): MergeRequest[]
```

##### merge(sourceBranch, targetBranch, mergeRequestId, resolvedBy)
合并分支
```typescript
await versionControl.merge(
  sourceBranch: string,
  targetBranch: string,
  mergeRequestId?: string,
  resolvedBy?: { id: string; name: string }
): Promise<Version>
```

##### rollback(versionId, reason, user)
回滚版本
```typescript
await versionControl.rollback(
  versionId: string,
  reason: string,
  user: { id: string; name: string; email?: string }
): Promise<Version>
```

##### getChanges(fromVersionId, toVersionId)
获取变更历史
```typescript
versionControl.getChanges(
  fromVersionId: string,
  toVersionId: string
): { changes: ChangeSet[]; diff: string }
```

##### compareVersions(versionId1, versionId2)
比较版本
```typescript
versionControl.compareVersions(
  versionId1: string,
  versionId2: string
): { newer: Version | null; older: Version | null; diff: string }
```

##### exportHistory()
导出历史
```typescript
versionControl.exportHistory(): string
```

## 类型定义

### Template
```typescript
interface Template {
  id: string
  name: string
  description: string
  category: TemplateCategory
  tags: TemplateTag[]
  versions: TemplateVersion[]
  currentVersion: string
  author: {
    id: string
    name: string
    email?: string
  }
  teamId?: string
  isPublic: boolean
  isFeatured: boolean
  usageCount: number
  rating: number
  ratingsCount: number
  createdAt: number
  updatedAt: number
  metadata?: Record<string, unknown>
}
```

### TemplateSearchOptions
```typescript
interface TemplateSearchOptions {
  query?: string
  category?: TemplateCategory
  tags?: string[]
  author?: string
  teamId?: string
  isPublic?: boolean
  isFeatured?: boolean
  minRating?: number
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'usageCount' | 'rating'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}
```

### Version
```typescript
interface Version {
  id: string
  version: string
  commitId: string
  branch: string
  message: string
  author: {
    id: string
    name: string
    email?: string
  }
  timestamp: number
  content: unknown
  previousVersion: string | null
  metadata?: Record<string, unknown>
}
```

### MergeRequest
```typescript
interface MergeRequest {
  id: string
  sourceBranch: string
  targetBranch: string
  title: string
  description: string
  createdBy: string
  createdAt: number
  status: 'open' | 'merged' | 'closed'
  reviews: Array<{
    reviewerId: string
    status: 'approved' | 'rejected' | 'pending'
    comments?: string
    timestamp: number
  }>
  conflicts: Array<{
    file: string
    type: 'add-add' | 'add-del' | 'del-del' | 'mod-mod' | 'content'
    sourceContent?: unknown
    targetContent?: unknown
  }>
  changes: ChangeSet[]
  mergedAt: number | null
  mergedBy: string | null
}
```

## 最佳实践

### 1. 模板组织
```typescript
// 使用描述性的名称和描述
const template = await templateLibrary.create({
  name: 'Product Landing Page v2.0',
  description: 'Optimized landing page for product launches with A/B testing support',
  category: 'landing-page',
  // ...
})

// 添加相关标签
template.tags = [
  { id: 'tag-1', name: 'E-commerce', color: '#FF6B6B' },
  { id: 'tag-2', name: 'A/B Testing', color: '#4ECDC4' },
  { id: 'tag-3', name: 'Mobile-First', color: '#45B7D1' }
]
```

### 2. 版本管理
```typescript
// 使用语义化版本
await versionControl.createVersion('1.0.0', 'Initial release', content, author)
await versionControl.createVersion('1.1.0', 'Add new features', content, author)
await versionControl.createVersion('2.0.0', 'Major redesign', content, author)

// 添加详细的变更日志
await versionControl.createVersion(
  '1.1.0',
  'Add hero section and CTA buttons',
  content,
  author
)
```

### 3. 分支策略
```typescript
// 主分支（main）- 稳定版本
await versionControl.createBranch('main', null, 'Main development branch')

// 功能分支（feature/*）
await versionControl.createBranch(
  'feature/new-section',
  latestVersionId,
  'Adding new sections'
)

// 发布分支（release/*）
await versionControl.createBranch(
  'release/v1.1',
  mainVersionId,
  'Release preparation'
)
```

### 4. 合并请求流程
```typescript
// 1. 创建合并请求
const mr = await versionControl.createMergeRequest(
  'feature/new-section',
  'main',
  'Add hero section',
  'This MR adds a hero section to improve user engagement'
)

// 2. 团队成员审查
// (在生产环境中实现审查API)

// 3. 检查冲突
const analysis = versionControl.analyzeMerge('feature/new-section', 'main')
if (analysis.hasConflicts) {
  // 解决冲突...
}

// 4. 合并
await versionControl.merge('feature/new-section', 'main', mr.id, reviewer)
```

### 5. 性能优化
```typescript
// 限制搜索结果数量
const results = await templateLibrary.search({
  limit: 20, // 每页 20 个结果
  offset: 0
})

// 使用索引字段排序
const results = await templateLibrary.search({
  sortBy: 'rating', // 使用索引字段
  sortOrder: 'desc'
})

// 定期清理
setInterval(async () => {
  const cleaned = await templateLibrary.cleanup(365) // 保留 365 天
  console.log(`Cleaned ${cleaned} old templates`)
}, 24 * 60 * 60 * 1000) // 每 24 小时
```

### 6. 导入导出
```typescript
// 导出模板
const jsonExport = await templateLibrary.export(templateId, {
  includeVersions: true,
  includeMetadata: true,
  format: 'json'
})

// 导入模板
await templateLibrary.import(JSON.parse(jsonExport), {
  overwriteExisting: false
})
```

## 常用分类

### 模板分类
- `dashboard` - 仪表板模板
- `landing-page` - 落地页模板
- `form` - 表单模板
- `email` - 邮件模板
- `document` - 文档模板
- `presentation` - 演示文稿模板
- `custom` - 自定义模板

### 用户角色
- `owner` - 所有者
- `admin` - 管理员
- `editor` - 编辑者
- `viewer` - 查看者

### 权限级别
- `view` - 查看权限
- `edit` - 编辑权限
- `comment` - 评论权限
- `share` - 分享权限
- `delete` - 删除权限
- `download` - 下载权限

## 常见问题

### Q: 如何设置模板为公开？
A: 在创建模板时设置 `isPublic: true`，或在更新时修改此属性。

### Q: 如何实现模板审核流程？
A: 使用合并请求功能。在模板发布前创建合并请求，团队成员审查后合并。

### Q: 如何回滚到之前的版本？
A: 使用 `rollback()` 方法，需要提供原因和操作者信息。

### Q: 如何管理大量模板？
A: 使用搜索和筛选功能，支持按分类、标签、评分等多维度筛选。

### Q: 如何实现模板评分？
A: 使用 `rate()` 方法，用户可以为模板评分（1-5分）。

### Q: 如何获取模板使用趋势？
A: 使用 `getStats()` 方法，返回使用统计和趋势数据。

## 许可证

MIT

## 更新日志

### v2025.11.05
- 初始版本发布
- 支持模板库管理（创建、编辑、删除、搜索）
- 支持版本控制系统（语义化版本、分支、合并）
- 支持合并请求和代码审查
- 支持团队成员和权限管理
- 支持模板评分和使用统计
- 支持模板导入导出功能
