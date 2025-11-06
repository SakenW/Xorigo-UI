/**
 * 解决方案生成命令
 * 支持快速生成常见业务场景的解决方案
 */

import { Command } from 'commander'
import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { logger } from '../utils/logger'

export interface GenerateOptions {
  type: 'solution' | 'component' | 'page' | 'hook' | 'util'
  template?: string
  output?: string
  force?: boolean
}

/**
 * 登录解决方案
 */
function generateLoginSolution(name: string, outputPath: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      // 创建目录结构
      const dirs = [
        path.join(outputPath, name, 'components'),
        path.join(outputPath, name, 'hooks'),
        path.join(outputPath, name, 'types'),
        path.join(outputPath, name, 'utils')
      ]

      for (const dir of dirs) {
        await fs.mkdir(dir, { recursive: true })
      }

      // 登录表单组件
      const loginFormComponent = `import React, { useState } from 'react'
import { useLogin } from '../hooks/useLogin'

interface LoginFormProps {
  onSuccess?: () => void
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useLogin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      await login({ email, password })
      onSuccess?.()
    } catch (error) {
      console.error('登录失败:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          邮箱
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="请输入邮箱"
          required
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          密码
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border rounded-md"
          placeholder="请输入密码"
          required
        />
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? '登录中...' : '登录'}
      </button>
    </form>
  )
}`

      // 登录 Hook
      const loginHook = `import { useState } from 'react'
import { login as loginApi } from '../utils/auth'

interface LoginCredentials {
  email: string
  password: string
}

export const useLogin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const login = async (credentials: LoginCredentials) => {
    setLoading(true)
    setError(null)

    try {
      await loginApi(credentials)
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败')
      throw err
    } finally {
      setLoading(false)
    }
  }

  return { login, loading, error }
}`

      // 认证工具
      const authUtils = `interface LoginCredentials {
  email: string
  password: string
}

export async function login(credentials: LoginCredentials): Promise<void> {
  // TODO: 实现实际的 API 调用
  await new Promise(resolve => setTimeout(resolve, 1000))

  // 模拟成功登录
  console.log('登录成功:', credentials.email)

  // 存储 token (示例)
  localStorage.setItem('auth_token', 'mock_token')
}

export function logout(): void {
  localStorage.removeItem('auth_token')
  console.log('已退出登录')
}

export function getCurrentUser(): string | null {
  return localStorage.getItem('auth_token')
}`

      // 类型定义
      const types = `export interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}`

      // 登录页面
      const loginPage = `import React from 'react'
import { LoginForm } from './components/LoginForm'

export default function Login() {
  const handleLoginSuccess = () => {
    console.log('登录成功，跳转到主页')
    // TODO: 实现路由跳转
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-3xl font-bold text-center">登录</h2>
          <p className="mt-2 text-center text-gray-600">
            欢迎回来，请登录您的账户
          </p>
        </div>
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </div>
  )
}`

      // README
      const readme = `# ${name} 登录解决方案

这是一个完整的登录解决方案，包含前端组件、状态管理和认证逻辑。

## 文件结构

\`\`\`
${name}/
├── components/
│   └── LoginForm.tsx     # 登录表单组件
├── hooks/
│   └── useLogin.ts       # 登录状态管理 Hook
├── types/
│   └── auth.types.ts     # 类型定义
├── utils/
│   └── auth.ts          # 认证工具函数
└── pages/
    └── Login.tsx        # 登录页面
\`\`\`

## 使用方法

### 1. 安装依赖

\`\`\`bash
pnpm add @tanstack/react-query
\`\`\`

### 2. 集成到项目

\`\`\`tsx
import Login from './${name}/pages/Login'

function App() {
  return <Login />
}
\`\`\`

### 3. 自定义样式

修改 \`components/LoginForm.tsx\` 中的 Tailwind 类名以匹配您的设计系统。

## 自定义选项

- 修改登录表单字段
- 添加社交登录
- 集成验证码
- 添加记住我功能

## 下一步

- [ ] 集成真实的 API
- [ ] 添加路由保护
- [ ] 实现注册功能
- [ ] 添加密码重置
`

      // 写入文件
      await fs.writeFile(path.join(outputPath, name, 'components', 'LoginForm.tsx'), loginFormComponent)
      await fs.writeFile(path.join(outputPath, name, 'hooks', 'useLogin.ts'), loginHook)
      await fs.writeFile(path.join(outputPath, name, 'utils', 'auth.ts'), authUtils)
      await fs.writeFile(path.join(outputPath, name, 'types', 'auth.types.ts'), types)
      await fs.writeFile(path.join(outputPath, name, 'pages', 'Login.tsx'), loginPage)
      await fs.writeFile(path.join(outputPath, name, 'README.md'), readme)

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 数据表格解决方案
 */
function generateDataTableSolution(name: string, outputPath: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const dir = path.join(outputPath, name)
      await fs.mkdir(dir, { recursive: true })

      const component = `import React, { useState, useMemo } from 'react'

interface Column {
  key: string
  title: string
  dataIndex: string
  sortable?: boolean
  filterable?: boolean
}

interface DataTableProps {
  columns: Column[]
  data: any[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    onChange: (page: number) => void
  }
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  data,
  loading = false,
  pagination
}) => {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null)

  const sortedData = useMemo(() => {
    if (!sortConfig) return data

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key]
      const bVal = b[sortConfig.key]

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }, [data, sortConfig])

  const handleSort = (key: string) => {
    setSortConfig(current => {
      if (current?.key === key) {
        return {
          key,
          direction: current.direction === 'asc' ? 'desc' : 'asc'
        }
      }
      return { key, direction: 'asc' }
    })
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => column.sortable && handleSort(column.dataIndex)}
              >
                <div className="flex items-center">
                  {column.title}
                  {column.sortable && sortConfig?.key === column.dataIndex && (
                    <span className="ml-1">
                      {sortConfig.direction === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                加载中...
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-4 text-center text-gray-500">
                暂无数据
              </td>
            </tr>
          ) : (
            sortedData.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                {columns.map(column => (
                  <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row[column.dataIndex]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>

      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            共 {pagination.total} 条记录
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => pagination.onChange(pagination.current - 1)}
              disabled={pagination.current === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              上一页
            </button>
            <span className="px-3 py-1">
              {pagination.current} / {Math.ceil(pagination.total / pagination.pageSize)}
            </span>
            <button
              onClick={() => pagination.onChange(pagination.current + 1)}
              disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  )
}`

      const readme = `# ${name} 数据表格解决方案

包含排序、分页和搜索功能的数据表格组件。

## 使用方法

\`\`\`tsx
import { DataTable } from './${name}/DataTable'

const columns = [
  { key: 'id', title: 'ID', dataIndex: 'id', sortable: true },
  { key: 'name', title: '姓名', dataIndex: 'name', sortable: true },
  { key: 'email', title: '邮箱', dataIndex: 'email' }
]

const data = [
  { id: 1, name: '张三', email: 'zhangsan@example.com' },
  { id: 2, name: '李四', email: 'lisi@example.com' }
]

function App() {
  return (
    <DataTable
      columns={columns}
      data={data}
      pagination={{
        current: 1,
        pageSize: 10,
        total: 100,
        onChange: (page) => console.log('切换到第', page, '页')
      }}
    />
  )
}
\`\`\``
      await fs.writeFile(path.join(dir, 'DataTable.tsx'), component)
      await fs.writeFile(path.join(dir, 'README.md'), readme)

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 主题切换解决方案
 */
function generateThemeSwitchSolution(name: string, outputPath: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const dir = path.join(outputPath, name)
      await fs.mkdir(dir, { recursive: true })

      const hook = `import { useState, useEffect } from 'react'

type Theme = 'light' | 'dark' | 'system'

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'system'
  })

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }

    localStorage.setItem('theme', theme)
  }, [theme])

  return { theme, setTheme }
}`

      const component = `import React from 'react'
import { useTheme } from '../hooks/useTheme'

export const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex space-x-2">
      <button
        onClick={() => setTheme('light')}
        className={\`px-4 py-2 rounded \${theme === 'light' ? 'bg-blue-600 text-white' : 'bg-gray-200'\`}
      >
        浅色
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={\`px-4 py-2 rounded \${theme === 'dark' ? 'bg-blue-600 text-white' : 'bg-gray-200'\`}
      >
        深色
      </button>
      <button
        onClick={() => setTheme('system')}
        className={\`px-4 py-2 rounded \${theme === 'system' ? 'bg-blue-600 text-white' : 'bg-gray-200'\`}
      >
        跟随系统
      </button>
    </div>
  )
}`

      const readme = `# ${name} 主题切换解决方案

支持浅色、深色和系统主题的切换功能。

## 使用方法

\`\`\`tsx
import { ThemeSwitcher } from './${name}/ThemeSwitcher'
import { useTheme } from './${name}/hooks/useTheme'

function App() {
  return (
    <div>
      <ThemeSwitcher />
      {/* 你的应用内容 */}
    </div>
  )
}
\`\`\`

## 配置 Tailwind

在 \`tailwind.config.js\` 中启用深色模式:

\`\`\`js
module.exports = {
  darkMode: 'class',
  // ...
}
\`\`\``
      await fs.writeFile(path.join(dir, 'hooks', 'useTheme.ts'), hook)
      await fs.writeFile(path.join(dir, 'ThemeSwitcher.tsx'), component)
      await fs.mkdir(path.join(dir, 'hooks'), { recursive: true })
      await fs.writeFile(path.join(dir, 'hooks', 'useTheme.ts'), hook)
      await fs.writeFile(path.join(dir, 'README.md'), readme)

      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 生成解决方案命令
 */
export const generateCommand = new Command('generate')
  .description('生成预定义的解决方案模板')
  .argument('<type>', '解决方案类型')
  .argument('[name]', '解决方案名称')
  .option('-o, --output <path>', '输出路径')
  .option('-f, --force', '覆盖已存在的文件')
  .action(async (type: string, name: string | undefined, options: any) => {
    const startTime = Date.now()
    const spinner = ora('生成解决方案...').start()

    try {
      const validTypes = ['login', 'data-table', 'theme-switch']

      if (!validTypes.includes(type)) {
        throw new Error(`不支持的解决方案类型: ${type}\n可用类型: ${validTypes.join(', ')}`)
      }

      const solutionName = name || type
      const outputPath = options.output || path.join(process.cwd(), 'solutions')

      spinner.text = `创建目录...`
      await fs.mkdir(outputPath, { recursive: true })

      spinner.text = `生成 ${type} 解决方案...`

      // 检查是否已存在
      const targetPath = path.join(outputPath, solutionName)
      try {
        await fs.access(targetPath)
        if (!options.force) {
          throw new Error(`解决方案 ${solutionName} 已存在，使用 --force 覆盖`)
        }
      } catch {
        // 目录不存在，继续
      }

      // 生成对应的解决方案
      switch (type) {
        case 'login':
          await generateLoginSolution(solutionName, outputPath)
          break

        case 'data-table':
          await generateDataTableSolution(solutionName, outputPath)
          break

        case 'theme-switch':
          await generateThemeSwitchSolution(solutionName, outputPath)
          break
      }

      const elapsed = Date.now() - startTime
      spinner.succeed(chalk.green(`✅ ${type} 解决方案生成成功`))

      logger.section('生成结果')
      console.log(chalk.gray(`  📁 路径: ${targetPath}`))
      console.log(chalk.gray(`  ⏱️ 用时: ${elapsed}ms`))

      logger.section('下一步')
      console.log(chalk.cyan(`  cd ${targetPath}`))
      console.log(chalk.cyan(`  # 查看 README.md 了解使用方法`))

    } catch (error) {
      spinner.fail(chalk.red('❌ 生成解决方案失败'))
      console.error(chalk.red('错误:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })
