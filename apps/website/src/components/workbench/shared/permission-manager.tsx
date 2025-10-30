'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@xorigo-ui/core'
import { Button } from '@xorigo-ui/core'
import { Input } from '@xorigo-ui/core'
import { cn } from '@/utils'
import {
  Shield,
  Users,
  Settings,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Key,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  Info,
  Filter,
  Search,
  UserCheck,
  Lock,
  Unlock,
  ShieldCheck,
  ShieldAlert,
  FileText,
  Database,
  Download,
  Upload,
  UserPlus,
  UserMinus,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Plus,
  Save,
  X,
  Bell,
  Calendar,
  LogOut,
  UserX,
  Crown,
  Building
} from 'lucide-react'

// 权限管理相关类型定义
interface Permission {
  id: string
  name: string
  description: string
  module: 'solution' | 'component' | 'template' | 'version' | 'ai' | 'admin'
  action: 'read' | 'write' | 'delete' | 'manage' | 'export' | 'import'
  scope: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  isSystem: boolean
  createdAt: string
  updatedAt: string
  userCount: number
}

interface User {
  id: string
  username: string
  email: string
  fullName: string
  avatar?: string
  roles: string[]
  isActive: boolean
  lastLoginAt?: string
  createdAt: string
}

interface AuditLog {
  id: string
  userId: string
  username: string
  action: string
  module: string
  resource: string
  details: string
  ipAddress: string
  userAgent: string
  timestamp: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'success' | 'failed' | 'warning'
}

interface SecurityPolicy {
  id: string
  name: string
  description: string
  rules: SecurityRule[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

interface SecurityRule {
  id: string
  type: 'password_policy' | 'session_timeout' | 'mfa_required' | 'ip_whitelist'
  name: string
  config: Record<string, any>
  description: string
}

interface PermissionManagerProps {
  className?: string
  onPermissionChange?: (userId: string, permissions: string[]) => void
  onRoleChange?: (userId: string, roles: string[]) => void
}

export function PermissionManager({
  className,
  onPermissionChange,
  onRoleChange
}: PermissionManagerProps) {
  const [activeTab, setActiveTab] = useState<'roles' | 'users' | 'audit' | 'policies'>('roles')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [showCreateRole, setShowCreateRole] = useState(false)
  const [showCreateUser, setShowCreateUser] = useState(false)
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // 模拟权限数据
  const permissions: Permission[] = useMemo(() => [
    // 解决方案权限
    { id: 'solution:read', name: '查看解决方案', description: '查看解决方案详情和配置', module: 'solution', action: 'read', scope: 'all' },
    { id: 'solution:write', name: '编辑解决方案', description: '修改解决方案配置', module: 'solution', action: 'write', scope: 'all' },
    { id: 'solution:delete', name: '删除解决方案', description: '删除解决方案配置', module: 'solution', action: 'delete', scope: 'all' },
    { id: 'solution:export', name: '导出解决方案', description: '导出解决方案配置文件', module: 'solution', action: 'export', scope: 'all' },

    // 组件库权限
    { id: 'component:read', name: '查看组件', description: '查看组件详情和使用方法', module: 'component', action: 'read', scope: 'all' },
    { id: 'component:write', name: '编辑组件', description: '修改组件配置', module: 'component', action: 'write', scope: 'all' },
    { id: 'component:manage', name: '管理组件', description: '管理组件库内容', module: 'component', action: 'manage', scope: 'all' },

    // 版本控制权限
    { id: 'version:read', name: '查看版本', description: '查看版本历史和详情', module: 'version', action: 'read', scope: 'all' },
    { id: 'version:write', name: '编辑版本', description: '创建和编辑版本提交', module: 'version', action: 'write', scope: 'all' },
    { id: 'version:manage', name: '管理版本', description: '管理版本控制功能', module: 'version', action: 'manage', scope: 'all' },
    { id: 'version:restore', name: '恢复版本', description: '恢复到指定版本', module: 'version', action: 'delete', scope: 'all' },

    // AI助手权限
    { id: 'ai:read', name: '查看AI建议', description: '查看AI优化建议', module: 'ai', action: 'read', scope: 'all' },
    { id: 'ai:write', name: '使用AI功能', description: '使用AI生成和优化功能', module: 'ai', action: 'write', scope: 'all' },

    // 管理员权限
    { id: 'admin:users', name: '用户管理', description: '管理系统用户账户', module: 'admin', action: 'manage', scope: 'all' },
    { id: 'admin:roles', name: '角色管理', description: '管理系统角色和权限', module: 'admin', action: 'manage', scope: 'all' },
    { id: 'admin:audit', name: '审计日志', description: '查看系统审计日志', module: 'admin', action: 'read', scope: 'all' },
    { id: 'admin:policies', name: '安全策略', description: '管理安全策略和规则', module: 'admin', action: 'manage', scope: 'all' },
    { id: 'admin:system', name: '系统管理', description: '管理系统配置和设置', module: 'admin', action: 'manage', scope: 'all' }
  ], [])

  // 模拟角色数据
  const roles: Role[] = useMemo(() => [
    {
      id: 'super_admin',
      name: '超级管理员',
      description: '拥有系统所有权限的超级管理员',
      permissions: permissions.map(p => p.id),
      isSystem: true,
      createdAt: '2025-10-29 09:00:00',
      updatedAt: '2025-10-29 09:00:00',
      userCount: 1
    },
    {
      id: 'admin',
      name: '管理员',
      description: '拥有大部分管理权限的系统管理员',
      permissions: permissions.filter(p => p.module !== 'admin:system').map(p => p.id),
      isSystem: true,
      createdAt: '2025-10-29 09:00:00',
      updatedAt: '2025-10-29 09:00:00',
      userCount: 3
    },
    {
      id: 'developer',
      name: '开发者',
      description: '可以创建和编辑解决方案的开发者',
      permissions: [
        'solution:read', 'solution:write', 'solution:export',
        'component:read', 'component:write',
        'version:read', 'version:write',
        'ai:read', 'ai:write'
      ],
      isSystem: true,
      createdAt: '2025-10-29 09:00:00',
      updatedAt: '2025-10-29 09:00:00',
      userCount: 8
    },
    {
      id: 'viewer',
      name: '查看者',
      description: '只能查看内容的只读用户',
      permissions: ['solution:read', 'component:read', 'version:read', 'ai:read'],
      isSystem: true,
      createdAt: '2025-10-29 09:00:00',
      updatedAt: '2025-10-29 09:00:00',
      userCount: 15
    },
    {
      id: 'guest',
      name: '访客',
      description: '只能查看公开内容的访客用户',
      permissions: ['component:read'],
      isSystem: true,
      createdAt: '2025-10-29 09:00:00',
      updatedAt: '2025-10-29 09:00:00',
      userCount: 25
    }
  ], [])

  // 模拟用户数据
  const users: User[] = useMemo(() => [
    {
      id: 'user-001',
      username: 'admin',
      email: 'admin@xorigo-ui.com',
      fullName: '系统管理员',
      avatar: '👤',
      roles: ['super_admin'],
      isActive: true,
      lastLoginAt: '2025-10-29 11:20:00',
      createdAt: '2025-10-20 10:00:00'
    },
    {
      id: 'user-002',
      username: 'claude',
      email: 'claude@xorigo-ui.com',
      fullName: 'Claude AI',
      avatar: '🤖',
      roles: ['admin'],
      isActive: true,
      lastLoginAt: '2025-10-29 11:15:00',
      createdAt: '2025-10-20 10:00:00'
    },
    {
      id: 'user-003',
      username: 'developer1',
      email: 'dev1@xorigo-ui.com',
      fullName: '开发者1',
      avatar: '👨‍💻',
      roles: ['developer'],
      isActive: true,
      lastLoginAt: '2025-10-29 11:10:00',
      createdAt: '2025-10-20 10:00:00'
    },
    {
      id: 'user-004',
      username: 'viewer1',
      email: 'viewer1@xorigo-ui.com',
      fullName: '查看者1',
      avatar: '👁',
      roles: ['viewer'],
      isActive: true,
      lastLoginAt: '2025-10-29 10:30:00',
      createdAt: '2025-10-20 10:00:00'
    }
  ], [])

  // 模拟审计日志
  const auditLogs: AuditLog[] = useMemo(() => [
    {
      id: 'audit-001',
      userId: 'user-001',
      username: 'admin',
      action: '创建角色',
      module: '权限管理',
      resource: '角色 developer',
      details: '创建了新的开发者角色，包含解决方案、组件和AI相关权限',
      ipAddress: '192.168.1.100',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: '2025-10-29 11:25:00',
      severity: 'medium',
      status: 'success'
    },
    {
      id: 'audit-002',
      userId: 'user-002',
      username: 'claude',
      action: '修改用户权限',
      module: '权限管理',
      resource: '用户 developer1',
      details: '为用户 developer1 添加了版本管理权限',
      ipAddress: '192.168.1.101',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: '2025-10-29 11:20:00',
      severity: 'low',
      status: 'success'
    },
    {
      id: 'audit-003',
      userId: 'user-003',
      username: 'developer1',
      action: '版本恢复',
      module: '版本控制',
      resource: '版本 commit-003',
      details: '将解决方案配置恢复到版本 commit-003',
      ipAddress: '192.168.1.102',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: '2025-10-29 11:15:00',
      severity: 'high',
      status: 'success'
    },
    {
      id: 'audit-004',
      userId: 'user-004',
      username: 'viewer1',
      action: '访问拒绝',
      module: '权限管理',
      resource: '角色管理',
      details: '尝试访问管理员功能被权限系统拒绝',
      ipAddress: '192.168.1.103',
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      timestamp: '2025-10-29 10:30:00',
      severity: 'medium',
      status: 'failed'
    }
  ], [])

  // 模拟安全策略
  const securityPolicies: SecurityPolicy[] = useMemo(() => [
    {
      id: 'policy-001',
      name: '密码策略',
      description: '用户密码复杂度要求',
      rules: [
        {
          id: 'rule-001',
          type: 'password_policy',
          name: '密码复杂度',
          config: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: true,
            passwordHistory: 5,
            maxAge: 90
          },
          description: '密码必须包含大小写字母、数字和特殊字符，长度至少8位'
        }
      ],
      isActive: true,
      createdAt: '2025-10-29 09:00:00',
      updatedAt: '2025-10-29 09:00:00'
    },
    {
      id: 'policy-002',
      name: '会话策略',
      description: '用户会话超时和安全设置',
      rules: [
        {
          id: 'rule-002',
          type: 'session_timeout',
          name: '会话超时',
          config: {
            timeoutMinutes: 30,
            idleTimeoutMinutes: 15,
            maxConcurrentSessions: 3,
            requireReauth: true
          },
          description: '用户会话30分钟超时，空闲15分钟后需要重新认证'
        }
      ],
      isActive: true,
      createdAt: '2025-10-29 09:00:00',
      updatedAt: '2025-10-29 09:00:00'
    }
  ], [])

  // 过滤和搜索逻辑
  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      searchQuery === '' ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [users, searchQuery])

  const filteredRoles = useMemo(() => {
    return roles.filter(role =>
      searchQuery === '' ||
      role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      role.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [roles, searchQuery])

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter(log =>
      searchQuery === '' ||
      log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [auditLogs, searchQuery])

  // 获取模块图标
  const getModuleIcon = (module: string) => {
    switch (module) {
      case 'solution': return <Database className="w-4 h-4 text-blue-500" />
      case 'component': return <Building className="w-4 h-4 text-green-500" />
      case 'version': return <Clock className="w-4 h-4 text-purple-500" />
      case 'ai': return <Bot className="w-4 h-4 text-orange-500" />
      case 'admin': return <Shield className="w-4 h-4 text-red-500" />
      default: return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  // 获取动作图标
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'read': return <Eye className="w-4 h-4" />
      case 'write': return <Edit className="w-4 h-4" />
      case 'delete': return <Trash2 className="w-4 h-4" />
      case 'manage': return <Settings className="w-4 h-4" />
      case 'export': return <Download className="w-4 h-4" />
      case 'import': return <Upload className="w-4 h-4" />
      default: return <Shield className="w-4 h-4" />
    }
  }

  // 获取严重程度样式
  const getSeverityStyles = (severity: AuditLog['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-700 border-red-200'
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      case 'low': return 'bg-green-100 text-green-700 border-green-200'
    }
  }

  // 获取状态样式
  const getStatusStyles = (status: AuditLog['status']) => {
    switch (status) {
      case 'success': return 'text-green-600'
      case 'failed': return 'text-red-600'
      case 'warning': return 'text-yellow-600'
      default: return 'text-gray-600'
    }
  }

  // 切换展开状态
  const toggleExpanded = useCallback((id: string) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }, [])

  return (
    <div className={cn('space-y-6', className)}>
      {/* 权限管理头部 */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-red-500 to-purple-600 rounded-xl">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                企业级权限管理
                <ShieldCheck className="w-5 h-5 text-green-500" />
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                完整的权限控制和安全审计系统
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {users.length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                用户总数
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {roles.length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                角色总数
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {auditLogs.length}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                审计记录
              </div>
            </div>
            <Button
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              刷新
            </Button>
          </div>
        </div>

        {/* 快速统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: '活跃用户', value: users.filter(u => u.isActive).length, icon: UserCheck, color: 'green' },
            { label: '系统角色', value: roles.filter(r => r.isSystem).length, icon: Shield, color: 'blue' },
            { label: '安全策略', value: securityPolicies.filter(p => p.isActive).length, icon: Lock, color: 'purple' },
            { label: '今日审计', value: auditLogs.filter(l => l.timestamp.includes('2025-10-29')).length, icon: Activity, color: 'orange' }
          ].map((stat) => (
            <div key={stat.label} className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <stat.icon className={cn('w-5 h-5 mx-auto mb-1 text-', stat.color, '-500')} />
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {stat.value}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* 搜索栏 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="搜索用户、角色、操作..."
            className="w-full pl-10"
          />
        </div>
      </Card>

      {/* 标签页导航 */}
      <div className="flex items-center gap-1 bg-white dark:bg-gray-800 rounded-xl p-1">
        {[
          { id: 'roles', label: '角色管理', icon: Shield },
          { id: 'users', label: '用户管理', icon: Users },
          { id: 'audit', label: '审计日志', icon: Activity },
          { id: 'policies', label: '安全策略', icon: Lock }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              activeTab === tab.id
                ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* 角色管理 */}
      {activeTab === 'roles' && (
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                角色管理
              </h4>
              <Button
                onClick={() => setShowCreateRole(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                创建角色
              </Button>
            </div>

            {/* 角色列表 */}
            <div className="space-y-3">
              {filteredRoles.map((role) => (
                <div
                  key={role.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-semibold text-gray-900 dark:text-white">
                          {role.name}
                        </h5>
                        {role.isSystem && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            系统角色
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {role.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div>权限数量: {role.permissions.length}</div>
                        <div>用户数量: {role.userCount}</div>
                        <div>创建时间: {role.createdAt}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedRole(role)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {!role.isSystem && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* 展开的权限详情 */}
                  {selectedRole?.id === role.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t mt-4 pt-4"
                    >
                      <h6 className="font-medium text-gray-900 dark:text-white mb-3">
                        角色权限详情
                      </h6>
                      <div className="space-y-2">
                        {permissions
                          .filter(p => role.permissions.includes(p.id))
                          .map((permission) => (
                            <div
                              key={permission.id}
                              className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-gray-800/50 rounded"
                            >
                              <div className="flex items-center gap-2">
                                {getModuleIcon(permission.module)}
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                  {permission.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {getActionIcon(permission.action)}
                                <span className="text-xs text-gray-500">
                                  {permission.action}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 用户管理 */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                用户管理
              </h4>
              <Button
                onClick={() => setShowCreateUser(true)}
                className="flex items-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                创建用户
              </Button>
            </div>

            {/* 用户列表 */}
            <div className="space-y-3">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full text-lg">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {user.fullName}
                          </h5>
                          <span className={cn(
                            'text-xs px-2 py-1 rounded-full',
                            user.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          )}>
                            {user.isActive ? '活跃' : '停用'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div>@{user.username}</div>
                          <div>{user.email}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {user.roles.map(roleId => (
                            <span
                              key={roleId}
                              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-800 rounded-full"
                            >
                              {roles.find(r => r.id === roleId)?.name}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUser(user)}
                      >
                        <Settings className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={user.isActive ? 'outline' : 'default'}
                        className={user.isActive ? 'text-red-600 hover:text-red-700' : ''}
                      >
                        {user.isActive ? (
                          <>
                            <UserX className="w-4 h-4" />
                            禁用
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-4 h-4" />
                            启用
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 审计日志 */}
      {activeTab === 'audit' && (
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                审计日志
              </h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  导出
                </Button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  刷新
                </Button>
              </div>
            </div>

            {/* 日志列表 */}
            <div className="space-y-3">
              {filteredAuditLogs.map((log) => (
                <div
                  key={log.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={cn(
                        'flex items-center justify-center w-8 h-8 rounded-full',
                        log.status === 'success' ? 'bg-green-100 text-green-700' :
                        log.status === 'failed' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      )}>
                        {log.status === 'success' ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : log.status === 'failed' ? (
                          <X className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h5 className="font-medium text-gray-900 dark:text-white">
                            {log.action}
                          </h5>
                          <span className={cn('text-xs px-2 py-1 rounded-full', getSeverityStyles(log.severity))}>
                            {log.severity === 'critical' && '严重'}
                            {log.severity === 'high' && '高'}
                            {log.severity === 'medium' && '中'}
                            {log.severity === 'low' && '低'}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {log.details}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                          <div>用户: {log.username}</div>
                          <div>模块: {log.module}</div>
                          <div>时间: {log.timestamp}</div>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      IP: {log.ipAddress}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 安全策略 */}
      {activeTab === 'policies' && (
        <div className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                安全策略
              </h4>
              <Button
                onClick={() => setShowPolicyModal(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                创建策略
              </Button>
            </div>

            {/* 策略列表 */}
            <div className="space-y-3">
              {securityPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          {policy.name}
                        </h5>
                        <span className={cn(
                          'text-xs px-2 py-1 rounded-full',
                          policy.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        )}>
                          {policy.isActive ? '启用' : '禁用'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {policy.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <div>规则数量: {policy.rules.length}</div>
                        <div>创建时间: {policy.createdAt}</div>
                        <div>更新时间: {policy.updatedAt}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleExpanded(policy.id)}
                      >
                        {expandedItems.has(policy.id) ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant={policy.isActive ? 'outline' : 'default'}
                        className={policy.isActive ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                      >
                        {policy.isActive ? '禁用' : '启用'}
                      </Button>
                    </div>
                  </div>

                  {/* 展开的策略详情 */}
                  {expandedItems.has(policy.id) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      className="border-t mt-4 pt-4"
                    >
                      <h6 className="font-medium text-gray-900 dark:text-white mb-3">
                        策略规则
                      </h6>
                      <div className="space-y-2">
                        {policy.rules.map((rule) => (
                          <div
                            key={rule.id}
                            className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                          >
                            <div className="flex items-center gap-2">
                              {rule.type === 'password_policy' && <Key className="w-4 h-4 text-blue-500" />}
                              {rule.type === 'session_timeout' && <Clock className="w-4 h-4 text-purple-500" />}
                              <Lock className="w-4 h-4 text-gray-500" />
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm text-gray-900 dark:text-white mb-1">
                                {rule.name}
                              </div>
                              <div className="text-xs text-gray-600 dark:text-gray-400">
                                {rule.description}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {Object.entries(rule.config).map(([key, value]) => (
                                  <div key={key}>
                                    {key}: {JSON.stringify(value)}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {/* 创建角色对话框 */}
      {showCreateRole && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowCreateRole(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              创建新角色
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  角色名称
                </label>
                <Input placeholder="输入角色名称" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  角色描述
                </label>
                <textarea
                  placeholder="输入角色描述"
                  className="w-full h-20 resize-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="flex-1">创建</Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateRole(false)}
              >
                取消
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 创建用户对话框 */}
      {showCreateUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowCreateUser(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              创建新用户
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  用户名
                </label>
                <Input placeholder="输入用户名" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  邮箱
                </label>
                <Input type="email" placeholder="输入邮箱地址" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  全名
                </label>
                <Input placeholder="输入用户全名" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  分配角色
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                  {roles.filter(r => !r.isSystem).map(role => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="flex-1">创建</Button>
              <Button
                variant="outline"
                onClick={() => setShowCreateUser(false)}
              >
                取消
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* 创建策略对话框 */}
      {showPolicyModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowPolicyModal(false)}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              创建安全策略
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  策略名称
                </label>
                <Input placeholder="输入策略名称" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  策略描述
                </label>
                <textarea
                  placeholder="输入策略描述"
                  className="w-full h-20 resize-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="flex-1">创建</Button>
              <Button
                variant="outline"
                onClick={() => setShowPolicyModal(false)}
              >
                取消
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}