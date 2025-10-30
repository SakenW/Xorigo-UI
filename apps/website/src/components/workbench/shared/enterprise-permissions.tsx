'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Users,
  UserCheck,
  UserX,
  Settings,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Key,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Download,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Copy,
  Crown,
  Award,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Calendar,
  Mail,
  Phone,
  Building,
  MapPin,
  Globe,
  Database,
  Server,
  Terminal,
  Code,
  Palette,
  Layout,
  Zap,
  Heart,
  Star,
  TrendingUp,
  BarChart3,
  PieChart,
  Target,
  Flag,
  Bookmark,
  Archive,
  RotateCcw,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react'

// 权限系统相关接口定义
interface Permission {
  id: string
  name: string
  description: string
  category: 'system' | 'project' | 'user' | 'content' | 'admin'
  level: 'read' | 'write' | 'delete' | 'admin'
  resource: string
  conditions?: Record<string, any>
}

interface Role {
  id: string
  name: string
  displayName: string
  description: string
  level: 'basic' | 'standard' | 'advanced' | 'admin' | 'super_admin'
  permissions: string[]
  isActive: boolean
  userCount: number
  createdAt: Date
  updatedAt: Date
  createdBy: string
  isSystem: boolean
  color: string
  icon: string
}

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  phone?: string
  department?: string
  position?: string
  location?: string
  status: 'active' | 'inactive' | 'suspended' | 'pending'
  roles: string[]
  permissions: string[]
  lastLogin?: Date
  createdAt: Date
  createdBy: string
  metadata: {
    loginCount: number
    failedLogins: number
    lastActivity: Date
    ipAddress: string
    userAgent: string
  }
}

interface AuditLog {
  id: string
  userId: string
  userName: string
  action: string
  resource: string
  resourceId?: string
  details: string
  ipAddress: string
  userAgent: string
  timestamp: Date
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'authentication' | 'authorization' | 'data_access' | 'configuration' | 'system'
  result: 'success' | 'failure' | 'warning'
  metadata?: Record<string, any>
}

interface SecurityPolicy {
  id: string
  name: string
  description: string
  category: 'password' | 'session' | 'access' | 'data' | 'network'
  isEnabled: boolean
  rules: {
    type: string
    value: any
    description: string
  }[]
  priority: number
  appliesTo: string[] // roles, users, departments
  createdAt: Date
  updatedAt: Date
  updatedBy: string
}

export function EnterprisePermissions({
  className
}: {
  className?: string
}) {
  // 状态管理
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'permissions' | 'audit' | 'policies'>('roles')
  const [roles, setRoles] = useState<Role[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>([])
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all')
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30天前
    end: new Date()
  })

  // UI状态
  const [isCreatingRole, setIsCreatingRole] = useState(false)
  const [isEditingRole, setIsEditingRole] = useState(false)
  const [isCreatingUser, setIsCreatingUser] = useState(false)
  const [isEditingUser, setIsEditingUser] = useState(false)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // 初始化数据
  useEffect(() => {
    initializePermissionsData()
  }, [])

  const initializePermissionsData = () => {
    // 模拟初始化权限数据
    const mockPermissions: Permission[] = [
      {
        id: 'perm-1',
        name: 'view_dashboard',
        description: '查看仪表板',
        category: 'system',
        level: 'read',
        resource: 'dashboard'
      },
      {
        id: 'perm-2',
        name: 'manage_users',
        description: '管理用户账户',
        category: 'user',
        level: 'admin',
        resource: 'users'
      },
      {
        id: 'perm-3',
        name: 'edit_project',
        description: '编辑项目配置',
        category: 'project',
        level: 'write',
        resource: 'project'
      },
      {
        id: 'perm-4',
        name: 'delete_content',
        description: '删除内容',
        category: 'content',
        level: 'delete',
        resource: 'content'
      },
      {
        id: 'perm-5',
        name: 'system_admin',
        description: '系统管理权限',
        category: 'admin',
        level: 'admin',
        resource: 'system'
      }
    ]

    const mockRoles: Role[] = [
      {
        id: 'role-1',
        name: 'super_admin',
        displayName: '超级管理员',
        description: '拥有系统所有权限的超级管理员',
        level: 'super_admin',
        permissions: ['perm-1', 'perm-2', 'perm-3', 'perm-4', 'perm-5'],
        isActive: true,
        userCount: 2,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        createdBy: 'system',
        isSystem: true,
        color: '#ef4444',
        icon: '👑'
      },
      {
        id: 'role-2',
        name: 'admin',
        displayName: '管理员',
        description: '系统管理员，拥有大部分管理权限',
        level: 'admin',
        permissions: ['perm-1', 'perm-2', 'perm-3'],
        isActive: true,
        userCount: 5,
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
        createdBy: 'system',
        isSystem: true,
        color: '#f59e0b',
        icon: '🛡️'
      },
      {
        id: 'role-3',
        name: 'developer',
        displayName: '开发者',
        description: '项目开发者，可以创建和编辑项目',
        level: 'advanced',
        permissions: ['perm-1', 'perm-3'],
        isActive: true,
        userCount: 15,
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        createdBy: 'admin',
        isSystem: false,
        color: '#3b82f6',
        icon: '💻'
      },
      {
        id: 'role-4',
        name: 'viewer',
        displayName: '查看者',
        description: '只读用户，只能查看内容',
        level: 'basic',
        permissions: ['perm-1'],
        isActive: true,
        userCount: 50,
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        createdBy: 'admin',
        isSystem: false,
        color: '#10b981',
        icon: '👁️'
      }
    ]

    const mockUsers: User[] = [
      {
        id: 'user-1',
        name: '张三',
        email: 'zhangsan@example.com',
        phone: '+86 138 0000 0001',
        department: '技术部',
        position: '高级开发工程师',
        location: '北京',
        status: 'active',
        roles: ['role-3'],
        permissions: ['perm-1', 'perm-3'],
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
        createdBy: 'admin',
        metadata: {
          loginCount: 245,
          failedLogins: 3,
          lastActivity: new Date(Date.now() - 30 * 60 * 1000),
          ipAddress: '192.168.1.100',
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      {
        id: 'user-2',
        name: '李四',
        email: 'lisi@example.com',
        phone: '+86 138 0000 0002',
        department: '产品部',
        position: '产品经理',
        location: '上海',
        status: 'active',
        roles: ['role-2'],
        permissions: ['perm-1', 'perm-2', 'perm-3'],
        lastLogin: new Date(Date.now() - 1 * 60 * 60 * 1000),
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        createdBy: 'admin',
        metadata: {
          loginCount: 189,
          failedLogins: 1,
          lastActivity: new Date(Date.now() - 15 * 60 * 1000),
          ipAddress: '192.168.1.101',
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
        }
      }
    ]

    const mockAuditLogs: AuditLog[] = [
      {
        id: 'audit-1',
        userId: 'user-1',
        userName: '张三',
        action: '登录系统',
        resource: 'auth',
        details: '用户登录成功',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        severity: 'low',
        category: 'authentication',
        result: 'success'
      },
      {
        id: 'audit-2',
        userId: 'user-2',
        userName: '李四',
        action: '修改用户权限',
        resource: 'user',
        resourceId: 'user-3',
        details: '为用户王五分配开发者角色',
        ipAddress: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
        severity: 'medium',
        category: 'authorization',
        result: 'success'
      },
      {
        id: 'audit-3',
        userId: 'user-3',
        userName: '王五',
        action: '访问被拒绝',
        resource: 'admin',
        details: '尝试访问管理员页面，权限不足',
        ipAddress: '192.168.1.102',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0)',
        timestamp: new Date(Date.now() - 30 * 60 * 1000),
        severity: 'high',
        category: 'authorization',
        result: 'failure'
      }
    ]

    setPermissions(mockPermissions)
    setRoles(mockRoles)
    setUsers(mockUsers)
    setAuditLogs(mockAuditLogs)
  }

  // 过滤和搜索数据
  const filteredData = useMemo(() => {
    let data = []

    switch (activeTab) {
      case 'roles':
        data = roles.filter(role =>
          role.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          role.description.toLowerCase().includes(searchQuery.toLowerCase())
        )
        break
      case 'users':
        data = users.filter(user =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.department?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        break
      case 'audit':
        data = auditLogs.filter(log =>
          log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          log.resource.toLowerCase().includes(searchQuery.toLowerCase())
        )
        if (selectedSeverity !== 'all') {
          data = data.filter(log => log.severity === selectedSeverity)
        }
        if (selectedCategory !== 'all') {
          data = data.filter(log => log.category === selectedCategory)
        }
        // 日期范围过滤
        data = data.filter(log =>
          log.timestamp >= dateRange.start && log.timestamp <= dateRange.end
        )
        break
      default:
        data = []
    }

    return data
  }, [activeTab, roles, users, auditLogs, searchQuery, selectedSeverity, selectedCategory, dateRange])

  // 展开/收起项目
  const toggleExpanded = (id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  // 获取角色图标
  const getRoleIcon = (level: Role['level']) => {
    switch (level) {
      case 'super_admin': return <Crown className="w-5 h-5" />
      case 'admin': return <ShieldCheck className="w-5 h-5" />
      case 'advanced': return <Award className="w-5 h-5" />
      case 'standard': return <Shield className="w-5 h-5" />
      case 'basic': return <ShieldAlert className="w-5 h-5" />
      default: return <Shield className="w-5 h-5" />
    }
  }

  // 获取状态图标
  const getStatusIcon = (status: User['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'inactive': return <XCircle className="w-4 h-4 text-gray-500" />
      case 'suspended': return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  // 获取严重程度颜色
  const getSeverityColor = (severity: AuditLog['severity']) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200'
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 头部信息 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Shield className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">企业级权限管理</h3>
            <p className="text-sm text-muted-foreground">
              角色权限系统、用户管理、审计日志和安全策略配置
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* 统计信息 */}
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>角色: {roles.length}</span>
            <span>用户: {users.length}</span>
            <span>权限: {permissions.length}</span>
          </div>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="flex items-center space-x-1 p-1 bg-muted rounded-lg">
        {[
          { id: 'roles', label: '角色管理', icon: Users },
          { id: 'users', label: '用户管理', icon: UserCheck },
          { id: 'permissions', label: '权限配置', icon: Key },
          { id: 'audit', label: '审计日志', icon: FileText },
          { id: 'policies', label: '安全策略', icon: Shield }
        ].map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-background/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          )
        })}
      </div>

      {/* 搜索和过滤器 */}
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索角色、用户或操作..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {activeTab === 'audit' && (
          <div className="flex items-center space-x-2">
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="px-3 py-2 bg-muted rounded-md text-sm"
            >
              <option value="all">所有严重程度</option>
              <option value="critical">严重</option>
              <option value="high">高</option>
              <option value="medium">中</option>
              <option value="low">低</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-muted rounded-md text-sm"
            >
              <option value="all">所有类别</option>
              <option value="authentication">身份认证</option>
              <option value="authorization">权限授权</option>
              <option value="data_access">数据访问</option>
              <option value="configuration">系统配置</option>
              <option value="system">系统操作</option>
            </select>
          </div>
        )}

        <button className="flex items-center space-x-2 px-3 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
          <Plus className="w-4 h-4" />
          <span>新建</span>
        </button>
      </div>

      {/* 角色管理 */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {filteredData.map((role: Role) => (
              <motion.div
                key={role.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 bg-background border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedRole?.id === role.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedRole(role)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {/* 角色图标 */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg" style={{ backgroundColor: role.color + '20' }}>
                      <span className="text-xl">{role.icon}</span>
                    </div>

                    {/* 角色信息 */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-foreground">{role.displayName}</h5>
                        <span className="text-xs text-muted-foreground">({role.name})</span>

                        {role.isSystem && (
                          <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 text-xs rounded-full">
                            系统
                          </span>
                        )}

                        {!role.isActive && (
                          <span className="px-2 py-0.5 bg-gray-500/10 text-gray-600 text-xs rounded-full">
                            已禁用
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {role.description}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{role.userCount} 用户</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Key className="w-3 h-3" />
                          <span>{role.permissions.length} 权限</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>创建于 {role.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpanded(role.id)
                      }}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    >
                      {expandedItems.has(role.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // 编辑角色
                      }}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      title="编辑角色"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {!role.isSystem && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          // 删除角色
                        }}
                        className="p-1.5 hover:bg-muted rounded-md transition-colors"
                        title="删除角色"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 展开的详细信息 */}
                {expandedItems.has(role.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-border"
                  >
                    <div>
                      <h6 className="text-sm font-medium mb-2">权限列表</h6>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((permissionId) => {
                          const permission = permissions.find(p => p.id === permissionId)
                          return permission ? (
                            <span
                              key={permissionId}
                              className="px-2 py-1 bg-muted rounded-md text-xs"
                              title={permission.description}
                            >
                              {permission.name}
                            </span>
                          ) : null
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 用户管理 */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {filteredData.map((user: User) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 bg-background border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedUser?.id === user.id ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {/* 用户头像 */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500/10">
                      <span className="text-lg font-medium text-blue-600">
                        {user.name.charAt(0)}
                      </span>
                    </div>

                    {/* 用户信息 */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-foreground">{user.name}</h5>
                        {getStatusIcon(user.status)}
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-2">
                        <span>{user.email}</span>
                        {user.phone && <span>{user.phone}</span>}
                        {user.department && <span>{user.department}</span>}
                        {user.position && <span>{user.position}</span>}
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{user.roles.length} 角色</span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Key className="w-3 h-3" />
                          <span>{user.permissions.length} 权限</span>
                        </div>

                        {user.lastLogin && (
                          <div className="flex items-center space-x-1">
                            <Clock className="w-3 h-3" />
                            <span>最后登录: {user.lastLogin.toLocaleString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 操作按钮 */}
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleExpanded(user.id)
                      }}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                    >
                      {expandedItems.has(user.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        // 编辑用户
                      }}
                      className="p-1.5 hover:bg-muted rounded-md transition-colors"
                      title="编辑用户"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 展开的详细信息 */}
                {expandedItems.has(user.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-border space-y-3"
                  >
                    <div>
                      <h6 className="text-sm font-medium mb-2">角色权限</h6>
                      <div className="space-y-2">
                        {user.roles.map((roleId) => {
                          const role = roles.find(r => r.id === roleId)
                          return role ? (
                            <div key={roleId} className="flex items-center space-x-2">
                              <span className="text-lg">{role.icon}</span>
                              <span className="text-sm font-medium">{role.displayName}</span>
                              <span className="text-xs text-muted-foreground">({role.permissions.length} 权限)</span>
                            </div>
                          ) : null
                        })}
                      </div>
                    </div>

                    <div>
                      <h6 className="text-sm font-medium mb-2">活动统计</h6>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        <div className="p-2 bg-muted rounded">
                          <p className="font-medium">{user.metadata.loginCount}</p>
                          <p className="text-muted-foreground">登录次数</p>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <p className="font-medium">{user.metadata.failedLogins}</p>
                          <p className="text-muted-foreground">失败登录</p>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <p className="font-medium">{user.metadata.ipAddress}</p>
                          <p className="text-muted-foreground">IP地址</p>
                        </div>
                        <div className="p-2 bg-muted rounded">
                          <p className="font-medium">{user.metadata.lastActivity.toLocaleString()}</p>
                          <p className="text-muted-foreground">最后活动</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 审计日志 */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="grid gap-3">
            {filteredData.map((log: AuditLog) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 bg-background border rounded-lg ${getSeverityColor(log.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {/* 严重程度图标 */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/50">
                      {log.result === 'success' ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : log.result === 'failure' ? (
                        <XCircle className="w-4 h-4 text-red-500" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>

                    {/* 日志信息 */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h5 className="font-medium text-foreground">{log.action}</h5>
                        <span className="text-xs text-muted-foreground">by {log.userName}</span>

                        {log.result === 'failure' && (
                          <span className="px-2 py-0.5 bg-red-500/10 text-red-600 text-xs rounded-full">
                            失败
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground mb-2">
                        {log.details}
                      </p>

                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>资源: {log.resource}</span>
                        <span>IP: {log.ipAddress}</span>
                        <span>{log.timestamp.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* 展开按钮 */}
                  <button
                    onClick={() => toggleExpanded(log.id)}
                    className="p-1.5 hover:bg-white/50 rounded-md transition-colors"
                  >
                    {expandedItems.has(log.id) ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>

                {/* 展开的详细信息 */}
                {expandedItems.has(log.id) && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-current/20"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="font-medium mb-1">用户代理</p>
                        <p className="text-muted-foreground">{log.userAgent}</p>
                      </div>
                      <div>
                        <p className="font-medium mb-1">操作类别</p>
                        <p className="text-muted-foreground">{log.category}</p>
                      </div>
                      {log.resourceId && (
                        <div>
                          <p className="font-medium mb-1">资源ID</p>
                          <p className="text-muted-foreground font-mono">{log.resourceId}</p>
                        </div>
                      )}
                      <div>
                        <p className="font-medium mb-1">严重程度</p>
                        <p className="text-muted-foreground capitalize">{log.severity}</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* 权限配置 */}
      {activeTab === 'permissions' && (
        <div className="space-y-4">
          <div className="grid gap-4">
            {['system', 'user', 'project', 'content', 'admin'].map((category) => (
              <div key={category} className="p-4 bg-background border rounded-lg">
                <h5 className="font-medium mb-3 capitalize">{category} 权限</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {permissions
                    .filter(p => p.category === category)
                    .map((permission) => (
                      <div
                        key={permission.id}
                        className="p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium text-sm">{permission.name}</span>
                          <span className={`px-2 py-0.5 text-xs rounded-full ${
                            permission.level === 'admin' ? 'bg-red-500/10 text-red-600' :
                            permission.level === 'delete' ? 'bg-orange-500/10 text-orange-600' :
                            permission.level === 'write' ? 'bg-blue-500/10 text-blue-600' :
                            'bg-green-500/10 text-green-600'
                          }`}>
                            {permission.level}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{permission.description}</p>
                        <p className="text-xs text-muted-foreground mt-1">资源: {permission.resource}</p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 安全策略 */}
      {activeTab === 'policies' && (
        <div className="space-y-4">
          <div className="p-6 bg-background border rounded-lg text-center">
            <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="text-lg font-medium text-foreground mb-2">安全策略配置</h4>
            <p className="text-sm text-muted-foreground mb-4">
              配置密码策略、会话管理、访问控制等安全策略
            </p>
            <button className="px-4 py-2 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600">
              配置安全策略
            </button>
          </div>
        </div>
      )}
    </div>
  )
}