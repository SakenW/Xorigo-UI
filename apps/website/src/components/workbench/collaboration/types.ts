/**
 * 协作编辑系统核心类型定义
 * 支持 Phase 3.2 协作编辑功能的完整类型系统
 */

// ============================================================================
// 核心用户类型
// ============================================================================

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  status: UserStatus
  lastSeen: Date
  cursor?: CursorPosition
  color: string // 用户标识颜色
  permissions: UserPermissions
}

export type UserStatus = 'online' | 'offline' | 'away' | 'editing'

export interface UserPermissions {
  canEdit: boolean
  canComment: boolean
  canShare: boolean
  canManageTemplates: boolean
  canDelete: boolean
}

// ============================================================================
// 光标和选择类型
// ============================================================================

export interface CursorPosition {
  line: number
  column: number
  userId: string
  userName: string
  color: string
  timestamp: Date
}

export interface SelectionRange {
  start: CursorPosition
  end: CursorPosition
  userId: string
  userName: string
  color: string
  timestamp: Date
}

// ============================================================================
// 实时编辑操作类型
// ============================================================================

export interface EditOperation {
  id: string
  type: EditOperationType
  userId: string
  timestamp: Date
  content: string
  position: CursorPosition
  length?: number
  attributes?: Record<string, any>
  version: number
}

export type EditOperationType =
  | 'insert'
  | 'delete'
  | 'replace'
  | 'format'
  | 'attribute'

export interface ConflictResolution {
  operationId: string
  conflictType: ConflictType
  resolutionStrategy: ResolutionStrategy
  resolvedOperation: EditOperation
  originalOperation: EditOperation
  timestamp: Date
}

export type ConflictType =
  | 'concurrent_edit'
  | 'version_mismatch'
  | 'attribute_conflict'

export type ResolutionStrategy =
  | 'last_writer_wins'
  | 'operational_transform'
  | 'manual_resolution'
  | 'merge'

// ============================================================================
// WebSocket 连接类型
// ============================================================================

export interface WebSocketMessage {
  type: WebSocketMessageType
  payload: any
  userId: string
  timestamp: Date
  messageId: string
}

export type WebSocketMessageType =
  | 'cursor_position'
  | 'selection_range'
  | 'edit_operation'
  | 'user_status'
  | 'conflict_detection'
  | 'version_update'
  | 'comment'
  | 'template_update'

export interface CollaborationSession {
  id: string
  documentId: string
  users: User[]
  operations: EditOperation[]
  version: number
  createdAt: Date
  lastActivity: Date
  isActive: boolean
  permissions: SessionPermissions
}

export interface SessionPermissions {
  allowAnonymous: boolean
  requireInvite: boolean
  maxUsers: number
  defaultPermissions: UserPermissions
}

// ============================================================================
// 版本控制类型
// ============================================================================

export interface Version {
  id: string
  version: string
  name: string
  description?: string
  author: User
  timestamp: Date
  changes: VersionChange[]
  parents: string[] // 父版本ID
  tags: string[]
  isMainBranch: boolean
  branchName: string
}

export interface VersionChange {
  type: 'add' | 'modify' | 'delete' | 'move'
  path: string
  content?: string
  oldContent?: string
  metadata?: Record<string, any>
}

export interface Branch {
  id: string
  name: string
  description?: string
  headVersionId: string
  baseVersionId: string
  author: User
  createdAt: Date
  isMain: boolean
  isProtected: boolean
  collaborators: User[]
}

export interface MergeRequest {
  id: string
  title: string
  description?: string
  sourceBranch: string
  targetBranch: string
  author: User
  reviewers: User[]
  status: MergeRequestStatus
  createdAt: Date
  updatedAt: Date
  conflicts: MergeConflict[]
  changes: VersionChange[]
}

export type MergeRequestStatus =
  | 'open'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'merged'
  | 'closed'

export interface MergeConflict {
  path: string
  type: 'content' | 'structure' | 'permission'
  description: string
  proposedResolution?: string
  isResolved: boolean
}

// ============================================================================
// 分享和评论类型
// ============================================================================

export interface ShareableLink {
  id: string
  token: string
  documentId: string
  versionId?: string
  createdBy: User
  createdAt: Date
  expiresAt?: Date
  permissions: SharePermissions
  isActive: boolean
  accessCount: number
  maxAccess?: number
  password?: string
}

export interface SharePermissions {
  canView: boolean
  canEdit: boolean
  canComment: boolean
  canDownload: boolean
  canShare: boolean
  requiresApproval: boolean
}

export interface Comment {
  id: string
  content: string
  author: User
  documentId: string
  versionId?: string
  position?: CursorPosition
  selection?: SelectionRange
  parentId?: string // 父评论ID，支持回复
  replies: Comment[]
  status: CommentStatus
  tags: string[]
  reactions: CommentReaction[]
  createdAt: Date
  updatedAt: Date
  isResolved: boolean
  resolvedBy?: User
  resolvedAt?: Date
}

export type CommentStatus =
  | 'active'
  | 'resolved'
  | 'archived'
  | 'deleted'

export interface CommentReaction {
  id: string
  userId: string
  emoji: string
  createdAt: Date
}

export interface Annotation {
  id: string
  type: AnnotationType
  content: string
  author: User
  position: CursorPosition
  selection?: SelectionRange
  style: AnnotationStyle
  isPublic: boolean
  createdAt: Date
}

export type AnnotationType =
  | 'highlight'
  | 'note'
  | 'suggestion'
  | 'warning'
  | 'error'

export interface AnnotationStyle {
  color: string
  backgroundColor?: string
  borderColor?: string
  fontStyle?: string
  fontWeight?: string
}

// ============================================================================
// 团队模板库类型
// ============================================================================

export interface TeamTemplate {
  id: string
  name: string
  description: string
  category: TemplateCategory
  tags: string[]
  author: User
  content: TemplateContent
  metadata: TemplateMetadata
  permissions: TemplatePermissions
  statistics: TemplateStatistics
  createdAt: Date
  updatedAt: Date
  isPublic: boolean
  isApproved: boolean
  approvedBy?: User
  approvedAt?: Date
}

export type TemplateCategory =
  | 'layout'
  | 'component'
  | 'pattern'
  | 'business-logic'
  | 'data-structure'
  | 'styling'
  | 'configuration'
  | 'workflow'

export interface TemplateContent {
  code: string
  dependencies: string[]
  assets: TemplateAsset[]
  configuration: Record<string, any>
  preview?: TemplatePreview
}

export interface TemplateAsset {
  id: string
  name: string
  type: 'image' | 'video' | 'document' | 'code' | 'config'
  url: string
  size: number
  mimeType: string
}

export interface TemplatePreview {
  images: string[]
  videos: string[]
  description: string
  interactiveDemo?: string
}

export interface TemplateMetadata {
  version: string
  compatibility: string[]
  framework: string
  language: string
  complexity: 'simple' | 'moderate' | 'complex'
  estimatedTime: number // 预估实现时间（分钟）
  prerequisites: string[]
  relatedTemplates: string[]
}

export interface TemplatePermissions {
  canUse: boolean
  canModify: boolean
  canShare: boolean
  canDelete: boolean
  canApprove: boolean
  canComment: boolean
  canRate: boolean
}

export interface TemplateStatistics {
  views: number
  downloads: number
  uses: number
  ratings: TemplateRating[]
  averageRating: number
  comments: number
  forks: number
  lastUsed?: Date
}

export interface TemplateRating {
  userId: string
  rating: number // 1-5
  review?: string
  createdAt: Date
}

export interface TemplateLibrary {
  id: string
  name: string
  description: string
  organizationId: string
  templates: TeamTemplate[]
  categories: TemplateCategory[]
  tags: string[]
  moderators: User[]
  settings: LibrarySettings
  createdAt: Date
  updatedAt: Date
}

export interface LibrarySettings {
  allowPublicSubmission: boolean
  requireApproval: boolean
  enableRating: boolean
  enableComments: boolean
  maxFileSize: number
  allowedFileTypes: string[]
  defaultPermissions: TemplatePermissions
}

// ============================================================================
// API 响应类型
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
  timestamp: Date
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

// ============================================================================
// 事件类型
// ============================================================================

export interface CollaborationEvent {
  type: CollaborationEventType
  userId: string
  sessionId: string
  data: any
  timestamp: Date
}

export type CollaborationEventType =
  | 'user_joined'
  | 'user_left'
  | 'cursor_moved'
  | 'selection_changed'
  | 'content_changed'
  | 'conflict_detected'
  | 'conflict_resolved'
  | 'comment_added'
  | 'comment_resolved'
  | 'version_created'
  | 'branch_created'
  | 'merge_requested'
  | 'template_shared'
  | 'permission_changed'

// ============================================================================
// 配置和设置类型
// ============================================================================

export interface CollaborationConfig {
  websocket: WebSocketConfig
  versionControl: VersionControlConfig
  sharing: SharingConfig
  templates: TemplateConfig
  realTime: RealTimeConfig
}

export interface WebSocketConfig {
  url: string
  reconnectInterval: number
  maxReconnectAttempts: number
  heartbeatInterval: number
  timeout: number
}

export interface VersionControlConfig {
  autoSave: boolean
  autoSaveInterval: number
  maxVersions: number
  compressionEnabled: boolean
  diffAlgorithm: 'myers' | 'patience' | 'histogram'
}

export interface SharingConfig {
  defaultExpiryDays: number
  maxAccessCount: number
  requirePasswordForPublic: boolean
  allowAnonymousComments: boolean
  enableLinkTracking: boolean
}

export interface TemplateConfig {
  maxFileSize: number
  allowedFileTypes: string[]
  enableVersioning: boolean
  enableRating: boolean
  requireApproval: boolean
  categories: TemplateCategory[]
}

export interface RealTimeConfig {
  enableRealTimeEditing: boolean
  cursorUpdateInterval: number
  conflictResolutionStrategy: ResolutionStrategy
  maxConcurrentUsers: number
  enablePresenceIndicators: boolean
}

// ============================================================================
// Hook 和组件 Props 类型
// ============================================================================

export interface UseCollaborationOptions {
  documentId: string
  userId: string
  config?: Partial<CollaborationConfig>
  onUserJoined?: (user: User) => void
  onUserLeft?: (userId: string) => void
  onContentChanged?: (operation: EditOperation) => void
  onConflictDetected?: (conflict: ConflictResolution) => void
  onError?: (error: ApiError) => void
}

export interface UseVersionControlOptions {
  documentId: string
  autoLoad?: boolean
  onVersionCreated?: (version: Version) => void
  onBranchCreated?: (branch: Branch) => void
  onMergeRequested?: (mergeRequest: MergeRequest) => void
  onError?: (error: ApiError) => void
}

export interface UseSharingOptions {
  documentId: string
  userId: string
  onLinkCreated?: (link: ShareableLink) => void
  onLinkAccessed?: (linkId: string, accessInfo: any) => void
  onCommentAdded?: (comment: Comment) => void
  onError?: (error: ApiError) => void
}

export interface UseTemplateLibraryOptions {
  organizationId?: string
  userId: string
  categories?: TemplateCategory[]
  tags?: string[]
  searchQuery?: string
  sortBy?: 'name' | 'created' | 'updated' | 'rating' | 'popularity'
  sortOrder?: 'asc' | 'desc'
  onTemplateSelected?: (template: TeamTemplate) => void
  onError?: (error: ApiError) => void
}