# @xorigo-ui/share

安全的分享链接生成和权限管理系统，支持链接过期、访问控制和使用统计。

## 功能特性

### 🔗 核心功能
- **安全链接生成** - 基于加密令牌的分享链接
- **权限管理** - 细粒度的访问权限控制
- **过期控制** - 支持过期时间和访问次数限制
- **使用统计** - 详细的使用分析和访问记录
- **访问追踪** - 实时访问监控和历史记录

### 📊 功能亮点
- ✅ 访问统计仪表板
- ✅ 权限级别控制
- ✅ 批量链接生成
- ✅ 自动过期清理
- ✅ 密码保护支持
- ✅ 水印功能

### 🔒 安全特性
- **令牌加密** - 安全的分享令牌生成
- **校验和验证** - 防止令牌篡改
- **访问限制** - 基于时间和次数的限制
- **IP 白名单** - 可选的 IP 访问控制
- **速率限制** - 防止滥用和攻击

## 安装

```bash
pnpm add @xorigo-ui/share
```

## 快速开始

### 生成分享链接

```typescript
import { ShareLinkGenerator, createShareUrl } from '@xorigo-ui/share'

// 创建链接生成器
const generator = new ShareLinkGenerator({
  baseUrl: 'https://your-domain.com',
  secret: 'your-secret-key'
})

// 生成单个链接
const link = await generator.generate(
  'document-123',
  'document',
  {
    expiresIn: 24 * 60 * 60, // 24小时
    maxAccessCount: 100,
    allowAnonymous: true,
    metadata: {
      title: 'My Document',
      description: 'A collaborative document'
    }
  }
)

console.log('Share URL:', link.url) // https://your-domain.com/share/abc123...
```

### 批量生成链接

```typescript
// 批量生成多个链接
const links = await generator.generateBatch(
  [
    { id: 'doc-1', type: 'document' },
    { id: 'template-1', type: 'template' },
    { id: 'project-1', type: 'project' }
  ],
  {
    expiresIn: 7 * 24 * 60 * 60, // 7天
    maxAccessCount: 50
  }
)
```

### 验证分享链接

```typescript
// 验证链接有效性
const result = await generator.validate('abc123...')

if (result.valid) {
  console.log('Link is valid:', result.link)
} else {
  console.log('Invalid link:', result.error)
}

// 检查访问权限
const canAccess = await accessTracker.canAccess(result.link!, userId)
if (canAccess) {
  // 允许访问
  const access = await accessTracker.trackAccess(
    'abc123...',
    userId,
    {
      userAgent: navigator.userAgent,
      ip: '192.168.1.1',
      referrer: document.referrer
    }
  )
}
```

### 获取访问统计

```typescript
// 获取链接分析数据
const analytics = await generator.getAnalytics('abc123...')

console.log('Total access:', analytics.totalAccess)
console.log('Unique users:', analytics.uniqueUsers)
console.log('Average duration:', analytics.averageDuration)
console.log('Top referrers:', analytics.topReferrers)
console.log('Access by hour:', analytics.accessByHour)
```

### 权限管理

```typescript
import { PermissionManager } from '@xorigo-ui/share'

// 创建权限管理器
const permManager = new PermissionManager()

// 设置团队权限
permManager.setTeamPermissions('team-123', {
  view: true,
  edit: true,
  comment: true,
  share: false,
  download: true
})

// 检查权限
const result = permManager.hasPermission(
  {
    user: { id: 'user-1', role: 'editor' },
    isAuthenticated: true
  },
  { view: true, edit: true }, // 需要编辑权限
  {
    public: { view: true, edit: false, comment: false, share: false },
    authenticated: { view: true, edit: true, comment: true, share: false }
  }
)

if (result.granted) {
  console.log('Access granted with permissions:', result.permissions)
} else {
  console.log('Access denied:', result.reason)
}
```

## API 参考

### ShareLinkGenerator

#### 构造函数
```typescript
new ShareLinkGenerator(options?: {
  baseUrl?: string
  secret?: string
  tokenLength?: number
})
```

#### 主要方法

##### generate(resourceId, resourceType, options)
生成分享链接
```typescript
await generator.generate(
  resourceId: string,
  resourceType: 'document' | 'template' | 'project' | 'file',
  options?: ShareLinkOptions
): Promise<ShareLink>
```

##### generateBatch(resources, options)
批量生成链接
```typescript
await generator.generateBatch(
  resources: Array<{ id: string; type: ShareLink['resourceType'] }>,
  options?: ShareLinkOptions
): Promise<ShareLink[]>
```

##### validate(token)
验证链接
```typescript
await generator.validate(token: string): Promise<ValidationResult>
```

##### revoke(token)
撤销链接
```typescript
await generator.revoke(token: string): Promise<boolean>
```

##### getAnalytics(token)
获取分析数据
```typescript
await generator.getAnalytics(token: string): Promise<LinkAnalytics>
```

##### getLinksByResource(resourceId)
获取资源的所有链接
```typescript
await generator.getLinksByResource(resourceId: string): Promise<ShareLink[]>
```

##### cleanupExpired()
清理过期链接
```typescript
await generator.cleanupExpired(): Promise<number> // 返回清理的数量
```

### PermissionManager

#### 构造函数
```typescript
new PermissionManager()
```

#### 主要方法

##### hasPermission(context, required, sharePermissions, settings)
检查权限
```typescript
permManager.hasPermission(
  context: PermissionContext,
  required: PermissionLevel,
  sharePermissions: SharePermissions,
  settings?: ShareSettings
): PermissionResult
```

##### setTeamPermissions(teamId, permissions)
设置团队权限
```typescript
permManager.setTeamPermissions(
  teamId: string,
  permissions: PermissionLevel
): void
```

##### getTeamPermissions(teamId)
获取团队权限
```typescript
permManager.getTeamPermissions(teamId: string): PermissionLevel | undefined
```

##### mergePermissions(...permissionLevels)
合并权限
```typescript
permManager.mergePermissions(
  ...permissionLevels: PermissionLevel[]
): PermissionLevel
```

#### 静态方法

##### createDefaultPermissions()
创建默认权限
```typescript
PermissionManager.createDefaultPermissions(): SharePermissions
```

##### createRestrictiveSettings()
创建严格设置
```typescript
PermissionManager.createRestrictiveSettings(): ShareSettings
```

##### createPublicSettings()
创建公开设置
```typescript
PermissionManager.createPublicSettings(): ShareSettings
```

### AccessTracker

#### 构造函数
```typescript
new AccessTracker(options?: {
  maxRecordsPerLink?: number
})
```

#### 主要方法

##### trackAccess(token, userId, metadata)
跟踪访问
```typescript
await accessTracker.trackAccess(
  token: string,
  userId?: string,
  metadata?: Record<string, unknown>
): Promise<AccessRecord>
```

##### getAccessHistory(linkId)
获取访问历史
```typescript
await accessTracker.getAccessHistory(linkId: string): Promise<AccessRecord[]>
```

##### canAccess(link, userId)
检查是否可以访问
```typescript
await accessTracker.canAccess(
  link: ShareLink,
  userId?: string
): Promise<boolean>
```

##### getStatistics(linkId)
获取统计信息
```typescript
await accessTracker.getStatistics(linkId: string): Promise<{
  totalAccesses: number
  uniqueUsers: number
  successfulAccesses: number
  failedAccesses: number
  averageDuration: number
}>
```

##### cleanup(daysToKeep)
清理旧记录
```typescript
await accessTracker.cleanup(daysToKeep: number): Promise<number>
```

## 类型定义

### ShareLink
```typescript
interface ShareLink {
  id: string
  url: string
  token: string
  resourceId: string
  resourceType: 'document' | 'template' | 'project' | 'file'
  createdBy: string
  createdAt: number
  expiresAt?: number
  maxAccessCount?: number
  accessCount: number
  status: 'active' | 'expired' | 'revoked' | 'maxed'
  metadata?: Record<string, unknown>
}
```

### ShareLinkOptions
```typescript
interface ShareLinkOptions {
  expiresIn?: number // 秒
  maxAccessCount?: number
  requireAuth?: boolean
  allowAnonymous?: boolean
  metadata?: Record<string, unknown>
  domain?: string
  secure?: boolean
}
```

### PermissionLevel
```typescript
interface PermissionLevel {
  view: boolean
  edit: boolean
  comment: boolean
  share: boolean
  delete?: boolean
  download?: boolean
}
```

### SharePermissions
```typescript
interface SharePermissions {
  public: PermissionLevel
  authenticated: PermissionLevel
  custom?: Record<string, PermissionLevel>
}
```

### LinkAnalytics
```typescript
interface LinkAnalytics {
  totalAccess: number
  uniqueUsers: number
  averageDuration: number
  topReferrers: Array<{ referrer: string; count: number }>
  accessByHour: Array<{ hour: number; count: number }>
  accessByCountry: Array<{ country: string; count: number }>
  recentAccess: AccessRecord[]
}
```

## 最佳实践

### 1. 安全配置
```typescript
// 使用强密钥
const generator = new ShareLinkGenerator({
  secret: process.env.SHARE_SECRET || 'generate-a-secure-random-key'
})

// 启用 HTTPS
const generator = new ShareLinkGenerator({
  baseUrl: 'https://your-domain.com' // 确保使用 HTTPS
})
```

### 2. 过期策略
```typescript
// 不同资源使用不同的过期策略
const options: ShareLinkOptions = {
  expiresIn: documentType === 'temporary' ? 24 * 60 * 60 : 30 * 24 * 60 * 60
}
```

### 3. 访问控制
```typescript
// 结合认证和权限检查
const canAccess = await accessTracker.canAccess(link, userId)
if (!canAccess) {
  // 检查是否需要认证
  if (permManager.hasPermission(context, { view: true }, link.permissions).requiresAuth) {
    redirectToLogin()
  } else {
    showAccessDenied()
  }
}
```

### 4. 监控和分析
```typescript
// 定期获取分析数据
setInterval(async () => {
  const analytics = await generator.getAnalytics(link.token)
  updateDashboard(analytics)
}, 60 * 1000) // 每分钟更新一次
```

### 5. 批量管理
```typescript
// 定期清理过期链接
setInterval(async () => {
  const cleaned = await generator.cleanupExpired()
  console.log(`Cleaned ${cleaned} expired links`)
}, 60 * 60 * 1000) // 每小时清理一次
```

## 权限预设

### 公开访问
```typescript
const permissions = {
  public: { view: true, edit: false, comment: false, share: false },
  authenticated: { view: true, edit: true, comment: true, share: false }
}
```

### 团队协作
```typescript
const permissions = {
  public: { view: false, edit: false, comment: false, share: false },
  authenticated: { view: true, edit: true, comment: true, share: true },
  custom: {
    team: { view: true, edit: true, comment: true, share: true, download: true }
  }
}
```

### 严格控制
```typescript
const permissions = {
  public: { view: false, edit: false, comment: false, share: false },
  authenticated: { view: true, edit: false, comment: false, share: false }
}
```

## 常见问题

### Q: 如何设置链接永不过期？
A: 不要设置 `expiresIn` 选项，或者设置为 `0`。

### Q: 如何限制访问次数？
A: 设置 `maxAccessCount` 选项。当达到限制时，链接状态会变为 `maxed`。

### Q: 如何追踪谁访问了链接？
A: 在 `trackAccess` 时提供 `userId`，这将在访问记录中关联用户。

### Q: 如何实现密码保护？
A: 在 `ShareSettings` 中设置 `password` 字段。用户访问时需要提供正确密码。

### Q: 如何添加自定义水印？
A: 在 `ShareSettings` 中配置 `watermark` 对象。
```typescript
watermark: {
  enabled: true,
  text: 'Confidential',
  opacity: 0.5
}
```

### Q: 如何导出访问统计？
A: 使用 `getAnalytics()` 获取数据，然后转换为所需的格式（如 CSV、Excel）。

## 许可证

MIT

## 更新日志

### v2025.11.05
- 初始版本发布
- 支持分享链接生成和管理
- 支持细粒度权限控制
- 支持访问统计和分析
- 支持批量操作和自动清理
- 支持密码保护和水印功能
