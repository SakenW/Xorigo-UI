---
name: "Xorigo UI 构建发布约束器"
description: "基于 Xorigo UI v1.5 SSOT 的构建发布约束工具，确保 packages/core 的构建、版本控制和 NPM 发布严格遵循规范要求，支持新的主题系统和组件分类架构"
author: "Xorigo UI Team"
version: "1.5.0"
tags: ["build-constraints", "publish-workflow", "version-control", "package-management", "ci-cd", "v1.5.0"]
---

# Xorigo UI 构建发布约束器

基于 Xorigo UI v1.5 SSOT 的构建发布约束工具，确保 `packages/core` 的构建、版本控制和 NPM 发布严格遵循规范要求，支持新的主题系统和组件分类架构。

## 🎯 作用域边界

**✅ 负责范围**：
- `packages/core` 构建流程约束
- 版本控制与变更管理
- NPM 包发布规范
- CI/CD 流水线质量门禁

**❌ 排除范围**：
- 网站构建流程
- 开发环境配置
- 用户部署流程

## 🔧 构建工具链约束

### 核心工具版本要求

```typescript
// build-tools-requirements.ts
export const BUILD_TOOLS_REQUIREMENTS = {
  // 必需工具版本
  required: {
    'pnpm': '>=9.0.0',
    'node': '>=22.0.0',
    'typescript': '~5.9.3',
    'vite': '^5.0.0',
    'vitest': '^1.0.0',
    'changesets': '^2.27.0'
  },

  // 推荐工具版本
  recommended: {
    'esbuild': '^0.20.0',
    'rollup': '^4.0.0',
    'tsup': '^8.0.0',
    'tsx': '^4.0.0',
    'prettier': '^3.0.0',
    'eslint': '^8.0.0'
  },

  // 构建输出要求
  output: {
    'esm': 'required',
    'cjs': 'required',
    'types': 'required',
    'minified': 'optional',
    'sourcemaps': 'recommended'
  }
}
```

### Vite 配置约束

```typescript
// vite.config.ts 标准配置
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react(),
    // 类型声明生成 - 必需
    dts({
      include: ['src/**/*'],
      exclude: ['src/**/*.test.tsx', 'src/**/*.stories.tsx'],
      rollupTypes: true,
      outDir: 'dist/types'
    })
  ],

  // 构建配置
  build: {
    lib: {
      entry: {
        // 必需入口点
        index: resolve(__dirname, 'src/index.ts'),
        system: resolve(__dirname, 'src/system/index.ts'),
        foundations: resolve(__dirname, 'src/foundations/index.ts'),
        primitives: resolve(__dirname, 'src/primitives/index.ts'),
        components: resolve(__dirname, 'src/components/index.ts'),
        recipes: resolve(__dirname, 'src/system/recipes/index.ts')
      },
      formats: ['es', 'cjs'], // 必需：ESM 和 CommonJS
      fileName: (format, entryName) => {
        const formatMap = { es: 'mjs', cjs: 'js' }
        return `${entryName}.${formatMap[format]}`
      }
    },

    // 输出配置
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true, // 推荐：生成源码映射
    minify: 'terser', // 推荐：代码压缩
    target: 'es2020', // 现代 JS 目标

    // 外部依赖 - 必需
    rollupOptions: {
      external: [
        'react',
        'react-dom',
        'react/jsx-runtime',
        'framer-motion',
        'class-variance-authority'
      ],
      output: {
        globals: {
          'react': 'React',
          'react-dom': 'ReactDOM',
          'react/jsx-runtime': 'jsxRuntime',
          'framer-motion': 'motion',
          'class-variance-authority': 'cva'
        }
      }
    },

    // 构建性能
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      onwarn(warning, warn) {
        // 忽略特定警告
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') return
        if (warning.code === 'THIS_IS_UNDEFINED') return
        warn(warning)
      }
    }
  },

  // 开发配置
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  },

  // 优化配置
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
```

## 📦 Package.json 约束

### 标准结构模板

```json
{
  "name": "@xorigo/core",
  "version": "1.4.0",
  "description": "Xorigo UI Core Component Library - 七轴主题系统组件库",
  "keywords": [
    "react",
    "components",
    "ui",
    "design-system",
    "theme-system",
    "seven-axis",
    "typescript"
  ],
  "author": "Xorigo UI Team",
  "license": "MIT",
  "homepage": "https://github.com/xorigo/xorigo-ui#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/xorigo/xorigo-ui.git",
    "directory": "packages/core"
  },
  "bugs": {
    "url": "https://github.com/xorigo/xorigo-ui/issues"
  },

  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    },
    "./system": {
      "import": "./dist/system.mjs",
      "require": "./dist/system.js",
      "types": "./dist/system.d.ts"
    },
    "./foundations": {
      "import": "./dist/foundations.mjs",
      "require": "./dist/foundations.js",
      "types": "./dist/foundations.d.ts"
    },
    "./primitives": {
      "import": "./dist/primitives.mjs",
      "require": "./dist/primitives.js",
      "types": "./dist/primitives.d.ts"
    },
    "./components": {
      "import": "./dist/components.mjs",
      "require": "./dist/components.js",
      "types": "./dist/components.d.ts"
    },
    "./recipes": {
      "import": "./dist/recipes.mjs",
      "require": "./dist/recipes.js",
      "types": "./dist/recipes.d.ts"
    },
    "./package.json": "./package.json"
  },

  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "files": [
    "dist",
    "README.md",
    "CHANGELOG.md"
  ],

  "scripts": {
    "dev": "vite build --watch",
    "build": "vite build && tsc --noEmit",
    "build:strict": "vite build && tsc --noEmit --strict",
    "build:types": "tsc --emitDeclarationOnly --outDir dist/types",
    "build:analyze": "vite build && npx vite-bundle-analyzer dist/index.mjs",
    "type-check": "tsc --noEmit",
    "lint": "eslint src --ext .ts,.tsx --report-unused-disable-directives --max-warnings 0",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,json,md}\"",
    "format:check": "prettier --check \"src/**/*.{ts,tsx,json,md}\"",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:e2e": "playwright test",
    "accessibility": "axe src --include=\"**/*.tsx\"",
    "changeset": "changeset",
    "version-packages": "changeset version",
    "release": "pnpm build && changeset publish",
    "prepublishOnly": "pnpm build && pnpm test"
  },

  "dependencies": {
    "class-variance-authority": "^0.7.0",
    "framer-motion": "^12.0.0",
    "clsx": "^2.0.0"
  },

  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@testing-library/react": "^15.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "vite": "^5.0.0",
    "vite-plugin-dts": "^3.0.0",
    "typescript": "~5.9.3",
    "vitest": "^1.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "prettier": "^3.0.0",
    "axe-core": "^4.0.0",
    "playwright": "^1.40.0"
  },

  "peerDependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },

  "peerDependenciesMeta": {
    "react-dom": {
      "optional": true
    }
  },

  "engines": {
    "node": ">=22.0.0",
    "pnpm": ">=9.0.0"
  },

  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  }
}
```

## 🔍 构建验证器

### 构建前检查

```typescript
// build-validator.ts
export class BuildValidator {
  // 验证构建环境
  static async validateBuildEnvironment(): Promise<{
    valid: boolean
    issues: string[]
    warnings: string[]
    fixes: string[]
  }> {
    const issues: string[] = []
    const warnings: string[] = []
    const fixes: string[] = []

    // 检查 Node.js 版本
    const nodeVersion = process.version
    const requiredNodeVersion = 'v22.0.0'
    if (this.compareVersions(nodeVersion, requiredNodeVersion) < 0) {
      issues.push(`Node.js 版本过低: ${nodeVersion}，需要 >= ${requiredNodeVersion}`)
      fixes.push('升级 Node.js 到 v22.0.0 或更高版本')
    }

    // 检查 pnpm 版本
    try {
      const pnpmVersion = await this.execCommand('pnpm --version')
      const requiredPnpmVersion = '9.0.0'
      if (this.compareVersions(`v${pnpmVersion}`, `v${requiredPnpmVersion}`) < 0) {
        issues.push(`pnpm 版本过低: ${pnpmVersion}，需要 >= ${requiredPnpmVersion}`)
        fixes.push('升级 pnpm 到 9.0.0 或更高版本')
      }
    } catch (error) {
      issues.push('未找到 pnpm，请安装 pnpm')
      fixes.push('运行: npm install -g pnpm')
    }

    // 检查必需文件
    const requiredFiles = [
      'src/index.ts',
      'package.json',
      'vite.config.ts',
      'tsconfig.json',
      'README.md'
    ]

    for (const file of requiredFiles) {
      if (!await this.fileExists(file)) {
        issues.push(`缺少必需文件: ${file}`)
      }
    }

    // 检查 package.json 配置
    const packageJson = await this.readJson('package.json')
    const packageValidation = this.validatePackageJson(packageJson)
    issues.push(...packageValidation.issues)
    warnings.push(...packageValidation.warnings)

    return {
      valid: issues.length === 0,
      issues,
      warnings,
      fixes
    }
  }

  // 验证构建输出
  static async validateBuildOutput(): Promise<{
    valid: boolean
    issues: string[]
    metrics: BuildMetrics
  }> {
    const issues: string[] = []
    const metrics: BuildMetrics = {
      bundleSize: 0,
      chunkCount: 0,
      typesGenerated: false,
      exportsValid: false
    }

    // 检查构建产物
    const requiredOutputs = [
      'dist/index.mjs',
      'dist/index.js',
      'dist/index.d.ts',
      'dist/system.mjs',
      'dist/system.js',
      'dist/system.d.ts'
    ]

    for (const output of requiredOutputs) {
      if (!await this.fileExists(output)) {
        issues.push(`缺少构建产物: ${output}`)
      }
    }

    // 检查包大小
    try {
      const stats = await this.getBundleStats('dist/index.mjs')
      metrics.bundleSize = stats.size
      metrics.chunkCount = stats.chunks

      if (stats.size > 500 * 1024) { // 500KB
        warnings.push(`主包体积过大: ${this.formatBytes(stats.size)}，建议优化`)
      }
    } catch (error) {
      issues.push('无法获取构建产物统计信息')
    }

    // 验证类型定义
    if (await this.fileExists('dist/index.d.ts')) {
      metrics.typesGenerated = true
    } else {
      issues.push('缺少类型定义文件')
    }

    // 验证导出配置
    const packageJson = await this.readJson('package.json')
    metrics.exportsValid = this.validateExports(packageJson.exports)

    return {
      valid: issues.length === 0,
      issues,
      metrics
    }
  }

  private static validatePackageJson(packageJson: any): {
    issues: string[]
    warnings: string[]
  } {
    const issues: string[] = []
    const warnings: string[] = []

    // 检查必需字段
    const requiredFields = ['name', 'version', 'description', 'main', 'module', 'types', 'exports']
    requiredFields.forEach(field => {
      if (!packageJson[field]) {
        issues.push(`package.json 缺少必需字段: ${field}`)
      }
    })

    // 检查版本格式
    if (packageJson.version && !this.isValidVersion(packageJson.version)) {
      issues.push(`无效的版本格式: ${packageJson.version}`)
    }

    // 检查依赖版本
    if (packageJson.peerDependencies) {
      if (!packageJson.peerDependencies.react) {
        warnings.push('建议添加 React peer dependency')
      }
    }

    return { issues, warnings }
  }

  private static validateExports(exports: any): boolean {
    const requiredExports = ['.', './system', './foundations', './primitives']
    return requiredExports.every(exportPath => exports[exportPath])
  }

  private static compareVersions(v1: string, v2: string): number {
    // 简化的版本比较逻辑
    const normalize = (v: string) => v.replace('v', '').split('.').map(Number)
    const [major1, minor1, patch1] = normalize(v1)
    const [major2, minor2, patch2] = normalize(v2)

    if (major1 !== major2) return major1 - major2
    if (minor1 !== minor2) return minor1 - minor2
    return patch1 - patch2
  }

  private static isValidVersion(version: string): boolean {
    return /^\d+\.\d+\.\d+(-.*)?$/.test(version)
  }

  private static formatBytes(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }
}

interface BuildMetrics {
  bundleSize: number
  chunkCount: number
  typesGenerated: boolean
  exportsValid: boolean
}
```

## 🚀 发布流程约束

### 发布前检查清单

```typescript
// publish-validator.ts
export class PublishValidator {
  // 完整发布前验证
  static async validateForPublish(): Promise<{
    canPublish: boolean
    checks: PublishCheck[]
    recommendations: string[]
  }> {
    const checks: PublishCheck[] = []

    // 1. 构建验证
    checks.push(await this.checkBuild())

    // 2. 测试验证
    checks.push(await this.checkTests())

    // 3. 类型验证
    checks.push(await this.checkTypes())

    // 4. 版本验证
    checks.push(await this.checkVersion())

    // 5. 文档验证
    checks.push(await this.checkDocumentation())

    // 6. 可访问性验证
    checks.push(await this.checkAccessibility())

    // 7. 性能验证
    checks.push(await this.checkPerformance())

    const canPublish = checks.every(check => check.status === 'pass')
    const recommendations = this.generateRecommendations(checks)

    return { canPublish, checks, recommendations }
  }

  private static async checkBuild(): Promise<PublishCheck> {
    try {
      // 检查构建产物
      const buildResult = await BuildValidator.validateBuildOutput()

      if (!buildResult.valid) {
        return {
          name: '构建验证',
          status: 'fail',
          message: '构建验证失败',
          details: buildResult.issues
        }
      }

      // 检查包大小
      if (buildResult.metrics.bundleSize > 1024 * 1024) { // 1MB
        return {
          name: '构建验证',
          status: 'warn',
          message: '包体积过大',
          details: [`当前大小: ${this.formatBytes(buildResult.metrics.bundleSize)}`]
        }
      }

      return {
        name: '构建验证',
        status: 'pass',
        message: '构建验证通过'
      }
    } catch (error) {
      return {
        name: '构建验证',
        status: 'fail',
        message: '构建验证异常',
        details: [error.message]
      }
    }
  }

  private static async checkTests(): Promise<PublishCheck> {
    try {
      // 运行测试套件
      const testResult = await this.runTests()

      if (testResult.failed > 0) {
        return {
          name: '测试验证',
          status: 'fail',
          message: `${testResult.failed} 个测试失败`,
          details: testResult.failures
        }
      }

      if (testResult.coverage < 80) {
        return {
          name: '测试验证',
          status: 'warn',
          message: `测试覆盖率不足: ${testResult.coverage}%`,
          details: ['建议达到 80% 以上覆盖率']
        }
      }

      return {
        name: '测试验证',
        status: 'pass',
        message: `所有测试通过 (${testResult.passed} 个)`
      }
    } catch (error) {
      return {
        name: '测试验证',
        status: 'fail',
        message: '测试执行失败',
        details: [error.message]
      }
    }
  }

  private static async checkTypes(): Promise<PublishCheck> {
    try {
      // TypeScript 类型检查
      const typeCheckResult = await this.runTypeCheck()

      if (!typeCheckResult.success) {
        return {
          name: '类型验证',
          status: 'fail',
          message: 'TypeScript 类型检查失败',
          details: typeCheckResult.errors
        }
      }

      return {
        name: '类型验证',
        status: 'pass',
        message: '类型检查通过'
      }
    } catch (error) {
      return {
        name: '类型验证',
        status: 'fail',
        message: '类型检查异常',
        details: [error.message]
      }
    }
  }

  private static async checkVersion(): Promise<PublishCheck> {
    const packageJson = await this.readJson('package.json')
    const currentVersion = packageJson.version

    // 检查版本是否已发布
    const isPublished = await this.checkVersionPublished(currentVersion)

    if (isPublished) {
      return {
        name: '版本验证',
        status: 'fail',
        message: `版本 ${currentVersion} 已存在`,
        details: ['请更新版本号']
      }
    }

    // 检查版本格式
    if (!this.isValidSemver(currentVersion)) {
      return {
        name: '版本验证',
        status: 'fail',
        message: `无效的版本格式: ${currentVersion}`,
        details: ['请使用语义化版本号 (semver)']
      }
    }

    return {
      name: '版本验证',
      status: 'pass',
      message: `版本检查通过: ${currentVersion}`
    }
  }

  private static generateRecommendations(checks: PublishCheck[]): string[] {
    const recommendations: string[] = []

    checks.forEach(check => {
      if (check.status === 'warn') {
        recommendations.push(`建议: ${check.message}`)
      }
    })

    // 通用建议
    recommendations.push('发布前请确保所有文档已更新')
    recommendations.push('建议在预发布环境测试包的安装和使用')
    recommendations.push('请检查 CHANGELOG.md 是否已更新')

    return recommendations
  }
}

interface PublishCheck {
  name: string
  status: 'pass' | 'warn' | 'fail'
  message: string
  details?: string[]
}
```

## 🔄 CI/CD 约束

### GitHub Actions 工作流

```yaml
# .github/workflows/release.yml
name: Release

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '22'
        cache: 'pnpm'

    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 9

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Type check
      run: pnpm type-check

    - name: Lint
      run: pnpm lint

    - name: Build
      run: pnpm build

    - name: Test
      run: pnpm test:coverage

    - name: Accessibility check
      run: pnpm accessibility

    - name: Build validation
      run: node scripts/validate-build.js

    - name: Upload coverage reports
      uses: codecov/codecov-action@v3

  publish:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '22'
        registry-url: 'https://registry.npmjs.org'
        cache: 'pnpm'

    - name: Install pnpm
      uses: pnpm/action-setup@v2
      with:
        version: 9

    - name: Install dependencies
      run: pnpm install --frozen-lockfile

    - name: Build
      run: pnpm build

    - name: Publish validation
      run: node scripts/validate-publish.js

    - name: Create Release Pull Request or Publish
      id: changesets
      uses: changesets/action@v1
      with:
        publish: pnpm release
        commit: "chore: release packages"
        title: "chore: release packages"
      env:
        GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 🚀 使用方法

### 构建验证

```bash
# 验证构建环境
"验证当前环境是否满足构建要求"

# 完整构建流程
"执行完整的构建和验证流程"

# 构建产物检查
"检查构建产物是否符合规范"
```

### 发布验证

```bash
# 发布前检查
"执行完整的发布前验证流程"

# 版本管理
"检查版本号并生成变更日志"

# 发布执行
"执行 NPM 发布流程"
```

### 质量门禁

```bash
# 设置质量门禁
"配置 CI/CD 质量门禁规则"

# 性能检查
"检查包体积和性能指标"

# 安全扫描
"执行依赖安全扫描"
```

## 📋 发布验证报告

```
🚀 Xorigo UI 发布验证报告
📦 包: @xorigo/core
📅 时间: 2025-01-XX
🎯 版本: 1.4.0

✅ 发布前检查
- ✅ 构建验证: 通过 (452KB)
- ✅ 测试验证: 通过 (156/156 tests, 92% coverage)
- ✅ 类型验证: 通过 (0 errors)
- ✅ 版本验证: 通过 (1.4.0 未发布)
- ✅ 文档验证: 通过
- ✅ 可访问性验证: 通过 (0 violations)
- ⚠️ 性能验证: 警告 (主包略大)

📊 质量指标
- 包大小: 452KB (目标: <500KB)
- 测试覆盖率: 92% (目标: >80%)
- 类型安全: 100% (目标: 100%)
- 构建时间: 12.3s (目标: <30s)

🎯 发布准备状态: ✅ 可以发布

💡 建议
1. 考虑优化包大小 (当前 452KB)
2. 更新 CHANGELOG.md
3. 在预发布环境测试安装

🔗 相关资源
- 构建产物: ./dist/
- 测试报告: ./coverage/
- 类型定义: ./dist/*.d.ts
```

## 🛡️ 质量保证

### 发布约束规则

- **构建完整性**：所有必需的构建产物必须存在
- **测试覆盖**：测试覆盖率必须达到 80% 以上
- **类型安全**：TypeScript 编译必须无错误
- **版本规范**：必须遵循语义化版本号
- **文档完整**：README 和 API 文档必须完整

### 自动化保障

- **CI/CD 集成**：所有检查集成到持续集成流程
- **自动回滚**：发布失败时自动回滚
- **监控告警**：发布后监控包的使用情况
- **安全扫描**：依赖漏洞自动扫描

基于 Xorigo UI v1.4 SSOT，确保构建和发布流程的可靠性、一致性和质量保障。