/**
 * 项目初始化命令
 * 支持快速创建基于Xorigo UI的项目
 */

import { Command } from 'commander'
import fs from 'fs/promises'
import path from 'path'
import chalk from 'chalk'
import ora from 'ora'
import { logger } from '../utils/logger'
import { validateProjectName } from '../utils/validation'

export interface InitOptions {
  template: 'default' | 'minimal' | 'full' | 'docs'
  typescript: boolean
  install: boolean
  framework: 'react' | 'next'
}

/**
 * 生成 package.json
 */
function generatePackageJson(name: string, options: InitOptions): string {
  const tsConfig = options.typescript ? '"typescript": "~5.9.3",' : ''
  const frameworkConfig = options.framework === 'next'
    ? `
    "next": "^15.0.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"`
    : `
    "react": "^19.2.0",
    "react-dom": "^19.2.0"`

  return JSON.stringify({
    name,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
      lint: 'eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
      'lint:fix': 'eslint . --ext ts,tsx --fix',
      typecheck: 'tsc --noEmit'
    },
    dependencies: {
      '@xorigo-ui/core': 'latest',
      ...(options.typescript ? {} : frameworkConfig)
    },
    devDependencies: {
      '@types/react': '^18.3.0',
      '@types/react-dom': '^18.3.0',
      '@vitejs/plugin-react': '^4.3.0',
      vite: '^6.0.0',
      tsx: '^4.20.6',
      ...(options.typescript ? { typescript: '~5.9.3' } : {}),
      ...(options.framework === 'react' ? { tailwindcss: '^3.4.0', autoprefixer: '^10.4.0', postcss: '^8.4.0' } : {})
    }
  }, null, 2)
}

/**
 * 生成 Vite 配置
 */
function generateViteConfig(options: InitOptions): string {
  if (options.framework === 'next') {
    return `import { defineConfig } from 'next'
export default defineConfig({
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@xorigo-ui/core']
  }
})`
  }

  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.tsx'),
      name: 'MyApp',
      formats: ['es', 'umd'],
      fileName: (format) => \`my-app.\${format}.js\`
    },
    rollupOptions: {
      external: ['react', 'react-dom']
    }
  }
})`
}

/**
 * 生成 Tailwind 配置
 */
function generateTailwindConfig(): string {
  return `import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e'
        }
      }
    }
  },
  plugins: []
} satisfies Config`
}

/**
 * 生成主应用文件
 */
function generateMainApp(name: string, options: InitOptions): string {
  if (options.framework === 'next') {
    return `export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">${name}</h1>
      <p className="text-lg text-gray-600 mb-8">基于 Xorigo UI 构建的 Next.js 应用</p>
      <div className="flex gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          开始使用
        </button>
      </div>
    </main>
  )
}`
  }

  return `import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)`
}

/**
 * 生成 App 组件
 */
function generateAppComponent(): string {
  return `import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Xorigo UI App
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            基于 Xorigo UI 构建的现代化应用
          </p>
          <div className="flex justify-center gap-4">
            <button className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              主要按钮
            </button>
            <button className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
              次要按钮
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App`
}

/**
 * 生成 CSS 文件
 */
function generateStyles(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}`
}

/**
 * 生成 README
 */
function generateREADME(name: string, options: InitOptions): string {
  return `# ${name}

基于 [Xorigo UI](https://github.com/xorigo-ui) 构建的现代化应用。

## 技术栈

- **框架**: ${options.framework === 'next' ? 'Next.js 15' : 'React 19 + Vite'}
- **UI 组件**: @xorigo-ui/core
- **样式**: Tailwind CSS
- **类型**: ${options.typescript ? 'TypeScript' : 'JavaScript'}
- **构建工具**: ${options.framework === 'next' ? 'Next.js' : 'Vite'}

## 快速开始

### 安装依赖

\`\`\`bash
pnpm install
\`\`\`

### 启动开发服务器

\`\`\`bash
pnpm dev
\`\`\`

### 构建生产版本

\`\`\`bash
pnpm build
\`\`\`

## 项目结构

\`\`\`
${name}/
├── src/
│   ├── components/     # 组件目录
│   ├── pages/         # 页面目录 (Next.js)
│   ├── App.tsx        # 应用组件
│   └── index.css      # 全局样式
├── public/            # 静态资源
├── package.json
└── README.md
\`\`\`

## 使用 Xorigo UI

\`\`\`tsx
import { Button } from '@xorigo-ui/core'

export default function Example() {
  return (
    <Button variant="primary" size="lg">
      点击我
    </Button>
  )
}
\`\`\`

## 更多信息

- [Xorigo UI 文档](https://xorigo-ui.github.io)
- [组件库指南](https://xorigo-ui.github.io/docs)
- [主题系统](https://xorigo-ui.github.io/docs/theme)
`
}

/**
 * 初始化项目命令
 */
export const initCommand = new Command('init')
  .description('初始化新的 Xorigo UI 项目')
  .argument('<name>', '项目名称')
  .option('-t, --template <template>', '项目模板', 'default')
  .option('--typescript', '使用 TypeScript', true)
  .option('--install', '自动安装依赖', true)
  .option('--framework <framework>', '框架类型 (react|next)', 'react')
  .action(async (name: string, options: InitOptions) => {
    const startTime = Date.now()
    const spinner = ora('正在初始化项目...').start()

    try {
      // 验证项目名称
      validateProjectName(name)

      // 验证模板类型
      const validTemplates = ['default', 'minimal', 'full', 'docs']
      if (!validTemplates.includes(options.template)) {
        throw new Error(`无效的模板类型: ${options.template}`)
      }

      // 创建项目目录
      const projectPath = path.resolve(process.cwd(), name)

      spinner.text = '检查目录...'
      try {
        await fs.access(projectPath)
        throw new Error(`目录 ${name} 已存在`)
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') {
          throw error
        }
      }

      await fs.mkdir(projectPath, { recursive: true })
      process.chdir(projectPath)

      spinner.text = '生成配置文件...'

      // 生成 package.json
      const packageJson = generatePackageJson(name, options)
      await fs.writeFile('package.json', packageJson, 'utf-8')

      // 生成 Vite/Next 配置
      const configContent = generateViteConfig(options)
      await fs.writeFile(
        options.framework === 'next' ? 'next.config.mjs' : 'vite.config.ts',
        configContent,
        'utf-8'
      )

      // 生成 Tailwind 配置
      if (options.framework === 'react') {
        const tailwindConfig = generateTailwindConfig()
        await fs.writeFile('tailwind.config.ts', tailwindConfig, 'utf-8')

        const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`
        await fs.writeFile('postcss.config.js', postcssConfig, 'utf-8')
      }

      // 创建源码目录
      const srcDir = path.join(projectPath, 'src')
      await fs.mkdir(srcDir, { recursive: true })

      // 生成主应用文件
      const mainContent = generateMainApp(name, options)
      await fs.writeFile(
        options.framework === 'next'
          ? path.join('app', 'page.tsx')
          : path.join(srcDir, 'main.tsx'),
        mainContent,
        'utf-8'
      )

      // 生成 App 组件
      const appContent = generateAppComponent()
      await fs.writeFile(
        options.framework === 'next'
          ? path.join('app', 'layout.tsx')
          : path.join(srcDir, 'App.tsx'),
        options.framework === 'next'
          ? `export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}\n\n${appContent}`
          : appContent,
        'utf-8'
      )

      // 生成样式文件
      const styles = generateStyles()
      await fs.writeFile(
        options.framework === 'next'
          ? path.join('app', 'globals.css')
          : path.join(srcDir, 'index.css'),
        styles,
        'utf-8'
      )

      // 创建 public 目录
      await fs.mkdir(path.join(projectPath, 'public'), { recursive: true })

      // 生成 README
      const readme = generateREADME(name, options)
      await fs.writeFile('README.md', readme, 'utf-8')

      spinner.text = '生成 .gitignore...'

      // 生成 .gitignore
      const gitignore = `node_modules
dist
.env.local
.env.development.local
.env.test.local
.env.production.local
.DS_Store
*.log
coverage
.cache`
      await fs.writeFile('.gitignore', gitignore, 'utf-8')

      // 生成 TypeScript 配置
      if (options.typescript) {
        const tsconfig = JSON.stringify({
          compilerOptions: {
            target: 'ES2020',
            useDefineForClassFields: true,
            lib: ['ES2020', 'DOM', 'DOM.Iterable'],
            module: 'ESNext',
            skipLibCheck: true,
            moduleResolution: 'bundler',
            allowImportingTsExtensions: true,
            resolveJsonModule: true,
            isolatedModules: true,
            noEmit: true,
            jsx: 'react-jsx',
            strict: true,
            noUnusedLocals: true,
            noUnusedParameters: true,
            noFallthroughCasesInSwitch: true
          },
          include: ['src'],
          references: [{ path: './tsconfig.node.json' }]
        }, null, 2)
        await fs.writeFile('tsconfig.json', tsconfig, 'utf-8')
      }

      // 记录生成时间
      const elapsed = Date.now() - startTime

      spinner.succeed(
        chalk.green(`✅ 项目 ${name} 创建成功！`)
      )

      logger.section('项目信息')
      console.log(chalk.gray(`  📁 项目路径: ${projectPath}`))
      console.log(chalk.gray(`  ⚙️  框架: ${options.framework}`))
      console.log(chalk.gray(`  📦 类型: ${options.typescript ? 'TypeScript' : 'JavaScript'}`))
      console.log(chalk.gray(`  ⏱️  生成时间: ${elapsed}ms`))

      logger.section('下一步')
      if (options.install) {
        logger.info('正在安装依赖...')
        const { exec } = await import('child_process')
        exec('pnpm install', (error) => {
          if (error) {
            logger.error('依赖安装失败')
            logger.info(`请手动运行: cd ${name} && pnpm install`)
          } else {
            logger.success('依赖安装完成')
            logger.info(`请运行: cd ${name} && pnpm dev`)
          }
        })
      } else {
        logger.info(`请运行以下命令启动项目:`)
        console.log(chalk.cyan(`  cd ${name}`))
        console.log(chalk.cyan(`  pnpm install`))
        console.log(chalk.cyan(`  pnpm dev`))
      }

    } catch (error) {
      spinner.fail(chalk.red('❌ 初始化项目失败'))
      console.error(chalk.red('错误:'), error instanceof Error ? error.message : error)
      process.exit(1)
    }
  })
