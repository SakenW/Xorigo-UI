# Xorigo UI API 质量保证系统

## 📋 概述

Xorigo UI API 质量保证系统是一个全面的组件库质量监控和验证框架，专门为 Xorigo UI 设计系统构建。该系统提供 API 一致性验证、回归测试、质量监控和 IDE 集成等功能，确保组件库的高质量和一致性。

## 🎯 核心功能

### 1. API 一致性验证
- **标准化 API 设计**: 确保所有组件遵循统一的 API 设计规范
- **Props 一致性检查**: 验证组件 Props 的命名、类型和结构
- **TypeScript 类型安全**: 检查类型定义的完整性和正确性
- **组件分类验证**: 确保组件符合 Atomic Design 原则

### 2. 回归测试框架
- **自动化测试生成**: 基于组件 API 自动生成测试用例
- **多维度测试**: 包括 API 兼容性、交互、主题、可访问性等测试
- **视觉回归测试**: 截图对比确保 UI 一致性
- **性能测试**: 监控组件渲染性能和内存使用

### 3. 质量监控
- **综合质量评分**: 基于多维度指标的质量评估
- **趋势分析**: 跟踪组件质量变化趋势
- **问题识别**: 自动发现和分类质量问题
- **改进建议**: 提供具体的质量改进方案

### 4. IDE 集成
- **实时验证**: 在开发过程中实时检查 API 一致性
- **智能代码完成**: 提供符合规范的 Props 和事件完成建议
- **快速修复**: 自动修复常见的 API 一致性问题
- **悬停帮助**: 显示组件 API 文档和使用说明

## 🚀 快速开始

### 安装和基础使用

```typescript
import {
  XorigoUIQualitySystem,
  validateXorigoUIProject,
  validateXorigoUIComponent,
  runXorigoUITests,
} from '@xorigo-ui/core/api-quality-system'

// 验证整个项目
const projectResult = await validateXorigoUIProject()
console.log(`项目验证通过率: ${projectResult.summary.passRate}%`)

// 验证单个组件
const componentResult = await validateXorigoUIComponent('./components/Button.tsx')
console.log(`组件质量等级: ${componentResult.qualityReport?.grade}`)

// 运行回归测试
const testResult = await runXorigoUITests()
console.log(`测试通过率: ${testResult.summary.passRate}%`)
```

### 高级配置

```typescript
import {
  ComponentScanner,
  APIValidator,
  QualityMonitor,
  RegressionTestFramework,
} from '@xorigo-ui/core/api-quality-system'

// 自定义组件扫描配置
const scanner = new ComponentScanner({
  rootDir: './packages',
  componentPattern: ['**/*.tsx', '**/*.ts'],
  excludeDirs: ['node_modules', 'dist'],
  deepAnalysis: true,
})

// 自定义验证规则
const validator = new APIValidator()
validator.addRule({
  name: 'custom-rule',
  description: '自定义验证规则',
  level: 'warning',
  validate: (component) => {
    // 自定义验证逻辑
    return { passed: true, errors: [], warnings: [], info: [], suggestions: [] }
  },
})

// 自定义质量监控
const monitor = new QualityMonitor({
  thresholds: {
    excellent: 95,
    good: 85,
    acceptable: 75,
    poor: 65,
  },
  reportFrequency: 'weekly',
  autoFix: true,
})
```

## 📊 质量指标

### API 一致性评分 (25%)
- Props 设计规范遵循度
- TypeScript 类型完整性
- 命名约定一致性
- 导出类型规范性

### 测试覆盖率评分 (20%)
- 单元测试覆盖率
- 集成测试完整性
- 可访问性测试
- 性能测试覆盖

### 文档完整性评分 (15%)
- JSDoc 注释完整性
- 使用示例存在性
- API 文档质量
- 类型说明详细度

### 可访问性评分 (15%)
- ARIA 属性正确性
- 键盘导航支持
- 色彩对比度
- 语义化 HTML 使用

### 性能评分 (10%)
- 渲染效率
- 内存使用
- DOM 节点数量
- 重绘重排次数

### 主题兼容性评分 (10%)
- 主题令牌使用
- 七轴主题支持
- 多主题适配
- 主题切换流畅性

### 代码质量评分 (5%)
- TypeScript 类型安全
- 代码结构规范性
- 组件设计合理性
- 文件组织清晰度

## 🛠️ CI/CD 集成

### GitHub Actions 配置

```yaml
name: API Quality Check

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  api-validation:
    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@v3

    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'

    - name: Install dependencies
      run: npm ci

    - name: Run API validation
      run: npx ts-node scripts/api-validation-ci.ts validate --fail-on-warnings

    - name: Run regression tests
      run: npx ts-node scripts/api-validation-ci.ts test --parallel

    - name: Generate quality report
      run: npx ts-node scripts/api-validation-ci.ts validate --format html --output quality-report.html

    - name: Upload quality report
      uses: actions/upload-artifact@v3
      with:
        name: quality-report
        path: quality-report.html
```

### npm Scripts 配置

```json
{
  "scripts": {
    "quality:validate": "ts-node scripts/api-validation-ci.ts validate",
    "quality:test": "ts-node scripts/api-validation-ci.ts test",
    "quality:scan": "ts-node scripts/api-validation-ci.ts scan",
    "quality:watch": "ts-node scripts/api-validation-ci.ts watch",
    "quality:report": "ts-node scripts/api-validation-ci.ts validate --format html"
  }
}
```

## 🔧 IDE 集成

### VS Code 扩展

创建 VS Code 扩展以提供实时的 API 验证和智能建议：

```typescript
import * as vscode from 'vscode'
import { IDEIntegrationService } from '@xorigo-ui/core/api-quality-system'

export function activate(context: vscode.ExtensionContext) {
  const ideService = new IDEIntegrationService()

  // 注册诊断提供器
  const diagnosticCollection = vscode.languages.createDiagnosticCollection('xorigo-ui')

  // 监听文档变化
  vscode.workspace.onDidChangeTextDocument(async (event) => {
    if (event.document.fileName.endsWith('.tsx')) {
      const diagnostics = await ideService.getIDEFileDiagnostics(
        event.document.uri.toString(),
        event.document.getText()
      )

      diagnosticCollection.set(
        event.document.uri,
        diagnostics.map(d => convertToVSCodeDiagnostic(d))
      )
    }
  })

  // 注册代码完成提供器
  const completionProvider = vscode.languages.registerCompletionItemProvider(
    { scheme: 'file', language: 'typescriptreact' },
    async (document, position) => {
      const completions = await ideService.getIDECodeCompletions(
        document.uri.toString(),
        document.getText(),
        { line: position.line, character: position.character }
      )

      return completions.map(c => convertToVSCodeCompletionItem(c))
    }
  )

  context.subscriptions.push(diagnosticCollection, completionProvider)
}
```

## 📈 质量报告

### 项目质量报告示例

```json
{
  "projectName": "Xorigo UI",
  "version": "1.0.0",
  "overallMetrics": {
    "apiConsistencyScore": 92,
    "testCoverageScore": 85,
    "documentationScore": 88,
    "accessibilityScore": 90,
    "performanceScore": 95,
    "themeCompatibilityScore": 87,
    "codeQualityScore": 91,
    "overallScore": 89
  },
  "gradeDistribution": {
    "A": 12,
    "B": 8,
    "C": 3,
    "D": 1,
    "F": 0
  },
  "keyIssues": [
    {
      "id": "missing-tests-001",
      "title": "缺少测试覆盖",
      "description": "Button 组件测试覆盖率低于 80%",
      "severity": "high",
      "affectedMetric": "testCoverageScore"
    }
  ],
  "priorityRecommendations": [
    {
      "title": "增加测试覆盖",
      "description": "为核心组件添加更全面的单元测试",
      "priority": "urgent",
      "expectedImprovement": { "metric": "testCoverageScore", "improvement": 15 }
    }
  ]
}
```

### 组件质量报告示例

```json
{
  "componentName": "Button",
  "version": "1.0.0",
  "grade": "A",
  "metrics": {
    "apiConsistencyScore": 95,
    "testCoverageScore": 92,
    "documentationScore": 90,
    "accessibilityScore": 88,
    "performanceScore": 96,
    "themeCompatibilityScore": 94,
    "codeQualityScore": 93,
    "overallScore": 93
  },
  "trend": {
    "current": 93,
    "change": 2,
    "changePercent": 2.2,
    "direction": "improving"
  },
  "issues": [],
  "recommendations": [
    {
      "title": "添加键盘导航测试",
      "description": "为键盘交互添加专门的测试用例",
      "priority": "medium",
      "difficulty": "easy",
      "estimatedTime": "2-4小时"
    }
  ]
}
```

## 🎛️ 配置选项

### 验证配置

```typescript
const validationConfig = {
  // 验证超时时间
  timeout: 30000,
  // 并发验证数
  concurrency: 4,
  // 重试次数
  retries: 2,
  // 失败时停止
  stopOnFailure: false,
  // 将警告视为失败
  failOnWarnings: false,
}
```

### 质量监控配置

```typescript
const qualityConfig = {
  thresholds: {
    excellent: 90,  // 优秀阈值
    good: 80,       // 良好阈值
    acceptable: 70, // 及格阈值
    poor: 60,       // 不及格阈值
  },
  monitoredMetrics: [
    'apiConsistencyScore',
    'testCoverageScore',
    'documentationScore',
    'accessibilityScore',
    'performanceScore',
    'themeCompatibilityScore',
    'codeQualityScore',
  ],
  reportFrequency: 'weekly',
  autoFix: false,
  historyRetentionDays: 90,
}
```

### IDE 集成配置

```typescript
const ideConfig = {
  enableRealTimeValidation: true,
  enableCodeCompletion: true,
  enableQuickFixes: true,
  enableHover: true,
  enableSignatureHelp: true,
  validationDelay: 500,
  excludePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.git/**',
  ],
  customRules: [], // 自定义规则
}
```

## 🔍 自定义规则

### 添加自定义验证规则

```typescript
import { APIValidator } from '@xorigo-ui/core/api-quality-system'

const validator = new APIValidator()

// 添加自定义命名规范验证
validator.addRule({
  name: 'custom-naming-convention',
  description: '检查自定义命名规范',
  level: 'warning',
  validate: (component) => {
    const warnings = []

    // 检查 Props 是否以特定前缀开头
    Object.keys(component.props || {}).forEach(propName => {
      if (propName.startsWith('custom') && !propName.startsWith('customXorigo')) {
        warnings.push({
          message: `自定义属性建议使用 'customXorigo' 前缀: ${propName}`,
          location: `${component.name}.props.${propName}`,
          code: 'CUSTOM_NAMING_CONVENTION',
          suggestion: `将 ${propName} 改为 customXorigo${propName.slice(6)}`,
        })
      }
    })

    return {
      passed: warnings.length === 0,
      errors: [],
      warnings,
      info: [],
      suggestions: ['遵循项目的命名规范'],
    }
  },
})
```

### 添加自定义质量规则

```typescript
import { QualityMonitor } from '@xorigo-ui/core/api-quality-system'

const monitor = new QualityMonitor()

// 自定义质量评估规则
const customQualityRule = {
  name: 'custom-component-pattern',
  description: '检查组件是否遵循特定的设计模式',
  evaluate: (component) => {
    let score = 100

    // 检查是否使用了特定的设计模式
    if (!component.usesCompositionPattern) {
      score -= 10
    }

    if (!component.hasErrorBoundary) {
      score -= 5
    }

    return Math.max(0, score)
  },
}
```

## 🚨 故障排除

### 常见问题

1. **组件扫描失败**
   ```
   错误: 扫描组件时出现权限错误
   解决: 检查文件权限，确保进程有读取权限
   ```

2. **验证超时**
   ```
   错误: API 验证超时
   解决: 增加 timeout 配置或减少并发数
   ```

3. **测试失败**
   ```
   错误: 回归测试执行失败
   解决: 检查测试环境配置，确保依赖已安装
   ```

### 调试模式

```typescript
// 启用详细日志
process.env.DEBUG = 'xorigo-ui:*'

// 创建调试模式的质量系统
const qualitySystem = new XorigoUIQualitySystem()

// 带调试信息的验证
const result = await qualitySystem.validateProject({
  debug: true,
  verbose: true,
})
```

## 📚 API 参考

详细的 API 文档请参考 TypeScript 类型定义文件。主要接口包括：

- `ComponentAnalysis` - 组件分析结果
- `ValidationResult` - 验证结果
- `ComponentQualityReport` - 组件质量报告
- `ProjectQualityReport` - 项目质量报告
- `IDEDiagnostic` - IDE 诊断信息
- `IDECompletionItem` - IDE 完成建议

## 🤝 贡献指南

欢迎贡献代码！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 运行质量检查：`npm run quality:validate`
5. 提交 Pull Request

## 📄 许可证

MIT License - 详见 LICENSE 文件

---

**Xorigo UI Team** - 构建高质量的 UI 组件库