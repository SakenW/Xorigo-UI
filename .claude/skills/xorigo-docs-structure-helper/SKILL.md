---
name: "Xorigo UI 文档结构助手"
description: "专门负责 Xorigo UI 项目的文档命名规范、目录结构组织和索引管理的辅助技能，与文档生成器配合使用"
author: "Xorigo UI Team"
version: "1.1.0"
tags: ["documentation", "naming", "structure", "organization", "indexing"]
---

# Xorigo UI 文档结构助手

**触发条件**：当需要文档命名规范验证、目录结构组织、索引生成或文档分类管理时触发

## 功能描述

这个技能专门负责 Xorigo UI 项目的**文档结构管理**，包括命名规范、目录组织和索引生成。它与 `xorigo-docs-generator`（文档生成器）配合使用，形成完整的文档管理解决方案。

**注意**：这个技能不负责生成文档内容，只负责文档的结构和命名管理。

## 核心能力

### 1. 文档命名生成器
根据项目阶段和任务类型生成标准化的文档名称：

```typescript
// 文档命名规则
interface DocumentNamingConfig {
  scope: 'ph' | 'comp' | 'ds' | 'build' | 'test' | 'doc' | 'deploy'
  sequence: number
  subSequence?: number
  stage?: 'r1' | 'r2' | 'r3' | 'legacy' | 'planning' | 'research'
  description: string
}

function generateDocumentName(config: DocumentNamingConfig): string {
  const { scope, sequence, subSequence, stage, description } = config

  // 基础格式: {序号}-{scope}-{task}[-{stage}]-{描述}.md
  let name = `${sequence.toString().padStart(3, '0')}-${scope}`

  // 添加子序号
  if (subSequence) {
    name += `.${subSequence}`
  }

  // 根据作用域添加任务标识
  switch (scope) {
    case 'ph':
      name += '-project'
      break
    case 'comp':
      name += '-core'
      break
    case 'ds':
      name += '-design'
      break
    case 'build':
      name += '-build'
      break
    case 'test':
      name += '-test'
      break
    case 'doc':
      name += '-docs'
      break
    case 'deploy':
      name += '-deploy'
      break
  }

  // 添加阶段标记
  if (stage) {
    name += `-${stage}`
  }

  // 添加描述
  name += `-${description.toLowerCase().replace(/\s+/g, '-')}`

  // 移除冗余词
  const redundantWords = ['-report', '-summary', '-completion', '-refactoring', '-document', '-analysis', '-implementation', '-development']
  redundantWords.forEach(word => {
    name = name.replace(word, '')
  })

  return `${name}.md`
}
```

### 2. 序号管理
自动分配和管理文档序号：

```typescript
// 序号管理
class DocumentSequenceManager {
  private scopeRanges = {
    'ph': { min: 1, max: 30 },      // Phase 1-3
    'comp': { min: 31, max: 150 },  // Component Development
    'ds': { min: 151, max: 200 },   // Design System
    'build': { min: 201, max: 250 }, // Build System
    'test': { min: 251, max: 300 },  // Testing
    'doc': { min: 301, max: 350 },   // Documentation
    'deploy': { min: 351, max: 400 } // Deployment
  }

  async getNextSequence(scope: string): Promise<number> {
    const range = this.scopeRanges[scope as keyof typeof this.scopeRanges]
    if (!range) {
      throw new Error(`Unknown scope: ${scope}`)
    }

    // 获取当前最大序号
    const existingDocs = await this.getExistingDocuments(scope)
    const maxSequence = existingDocs.length > 0
      ? Math.max(...existingDocs.map(doc => doc.sequence))
      : range.min - 1

    const nextSequence = maxSequence + 1

    if (nextSequence > range.max) {
      throw new Error(`Sequence number exceeds range for scope ${scope}`)
    }

    return nextSequence
  }

  private async getExistingDocuments(scope: string): Promise<Array<{ sequence: number, filename: string }>> {
    // 实现获取现有文档的逻辑
    // 这里简化为模拟数据
    return [
      { sequence: 32, filename: '032-comp-core-button.md' },
      { sequence: 45, filename: '045-comp-advanced-datatable.md' }
    ]
  }
}
```

### 3. 文档分类验证
验证文档分类和命名的一致性：

```typescript
// 文档分类验证
function validateDocumentClassification(filename: string): {
  valid: boolean
  scope?: string
  category?: string
  errors: string[]
  suggestions: string[]
} {
  const errors: string[] = []
  const suggestions: string[] = []

  // 解析文件名
  const match = filename.match(/^(\d+)-([a-z]+)(?:\.(\d+))?(?:-(.+?))?-(.+)\.md$/)
  if (!match) {
    errors.push('文件名格式不正确，应为: {序号}-{scope}[.{sub}][-{stage}]-{描述}.md')
    return { valid: false, errors, suggestions }
  }

  const [, sequenceStr, scope, subSequence, stage, description] = match
  const sequence = parseInt(sequenceStr)

  // 验证作用域
  const validScopes = ['ph', 'comp', 'ds', 'build', 'test', 'doc', 'deploy']
  if (!validScopes.includes(scope)) {
    errors.push(`无效的作用域: ${scope}，有效的作用域: ${validScopes.join(', ')}`)
  }

  // 验证序号范围
  const scopeRanges = {
    'ph': [1, 30],
    'comp': [31, 150],
    'ds': [151, 200],
    'build': [201, 250],
    'test': [251, 300],
    'doc': [301, 350],
    'deploy': [351, 400]
  }

  const range = scopeRanges[scope as keyof typeof scopeRanges]
  if (range && (sequence < range[0] || sequence > range[1])) {
    errors.push(`序号 ${sequence} 超出作用域 ${scope} 的范围 ${range[0]}-${range[1]}`)
  }

  // 验证阶段标记
  if (stage) {
    const validStages = ['r1', 'r2', 'r3', 'legacy', 'planning', 'research']
    if (!validStages.includes(stage)) {
      suggestions.push(`建议使用标准阶段标记: ${validStages.join(', ')}`)
    }
  }

  // 验证描述
  if (description.length > 50) {
    suggestions.push('描述部分过长，建议使用简洁的描述')
  }

  const valid = errors.length === 0
  return { valid, scope, category: this.getCategory(scope, description), errors, suggestions }
}

private getCategory(scope: string, description: string): string {
  switch (scope) {
    case 'comp':
      if (description.includes('button') || description.includes('input')) return 'core'
      if (description.includes('table') || description.includes('chart')) return 'advanced'
      if (description.includes('header') || description.includes('sidebar')) return 'layout'
      return 'unknown'
    case 'ph':
      return 'phase'
    default:
      return scope
  }
}
```

### 4. 文档结构组织
生成和组织文档目录结构：

```typescript
// 文档结构组织
function organizeDocumentStructure(): {
  structure: Record<string, string[]>
  indexFiles: string[]
  missingDocs: string[]
} {
  return {
    structure: {
      'docs/reports/phases/': [
        'README.md',
        '001-ph1-project-init.md',
        '005-ph2-design-tokens.md',
        '012-ph3-component-migration.md'
      ],
      'docs/reports/components/core/': [
        'README.md',
        '032-comp-core-button.md',
        '038-comp-core-input.md',
        '045-comp-core-card.md'
      ],
      'docs/reports/components/advanced/': [
        'README.md',
        '058-comp-advanced-datatable.md',
        '067-comp-advanced-carousel.md'
      ],
      'docs/reports/design-system/tokens/': [
        'README.md',
        '152-ds-tokens-colors.md',
        '158-ds-tokens-typography.md'
      ],
      'docs/reports/build/vite/': [
        'README.md',
        '202-build-vite-config.md',
        '210-build-vite-optimization.md'
      ]
    },
    indexFiles: [
      'docs/reports/00-TIMELINE-INDEX.md',
      'docs/reports/phases/README.md',
      'docs/reports/components/README.md'
    ],
    missingDocs: [
      'docs/reports/components/README.md',
      'docs/reports/design-system/README.md'
    ]
  }
}
```

### 5. 自动索引生成
自动生成文档索引和时间线：

```typescript
// 索引生成器
function generateDocumentIndex(docs: DocumentInfo[]): string {
  const timeline = docs
    .sort((a, b) => a.sequence - b.sequence)
    .map(doc => {
      const date = doc.createdAt.toLocaleDateString('zh-CN')
      const status = doc.status === 'completed' ? '✅' : '🔄'
      return `${status} ${doc.sequence} - [${doc.filename}](./${doc.filename}) - ${doc.title} (${date})`
    })
    .join('\n')

  const categories = docs.reduce((acc, doc) => {
    const category = doc.category || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(doc)
    return acc
  }, {} as Record<string, DocumentInfo[]>)

  const categoryIndex = Object.entries(categories)
    .map(([category, categoryDocs]) => {
      const docList = categoryDocs
        .sort((a, b) => a.sequence - b.sequence)
        .map(doc => `  - ${doc.sequence} - [${doc.title}](./${doc.filename})`)
        .join('\n')

      return `## ${category.toUpperCase()}\n${docList}\n`
    })
    .join('\n')

  return `# Xorigo UI 文档时间线索引

## 📅 项目时间线

${timeline}

## 📂 分类索引

${categoryIndex}

## 📊 统计信息

- 总文档数: ${docs.length}
- 已完成: ${docs.filter(d => d.status === 'completed').length}
- 进行中: ${docs.filter(d => d.status === 'in-progress').length}

---

*最后更新: ${new Date().toLocaleDateString('zh-CN')}*
`
}
```

## 标准化模板

### Phase 文档模板
```markdown
# Phase {N} - {阶段名称}

**时间范围**: {开始日期} - {结束日期}
**负责人**: {负责人}
**状态**: {planning | in-progress | completed}

## 🎯 目标

{主要目标描述}

## 📋 关键任务

- [ ] {任务1}
- [ ] {任务2}
- [ ] {任务3}

## 📊 进度跟踪

| 任务 | 状态 | 完成日期 | 负责人 |
|------|------|----------|--------|
| {任务名} | {状态} | {日期} | {负责人} |

## 🚧 阻塞问题

{描述当前遇到的阻塞问题}

## 📝 相关文档

- {相关文档链接}
```

### 组件文档模板
```markdown
# {组件名称} 组件开发

**组件类型**: {core | advanced | layout | feedback}
**优先级**: {high | medium | low}
**状态**: {planning | development | testing | completed}

## 🎨 设计要求

{组件设计和UI要求}

## 🔧 技术实现

### API 设计
```typescript
interface {ComponentName}Props {
  // 组件属性定义
}
```

### 变体系统
- variant: {变体列表}
- size: {尺寸列表}
- state: {状态列表}

## ✅ 验收标准

- [ ] 组件渲染正确
- [ ] 所有变体工作正常
- [ ] 可访问性支持完整
- [ ] 主题适配正常
- [ ] 单元测试通过

## 📚 相关文档

- {设计稿链接}
- {API文档链接}
```

## 使用示例

```bash
# 创建新文档
"创建 Button 组件开发文档，分类为核心组件，优先级高"

# 验证文档命名
"验证文件 032-comp-core-button.md 的命名是否符合规范"

# 生成索引
"生成项目文档时间线索引，包含所有已完成和进行中的文档"
```

## 输出格式

1. **标准文件名**: 符合命名规范的文档文件名
2. **文档模板**: 预定义的文档内容模板
3. **目录结构**: 组织良好的文档目录结构
4. **索引文件**: 自动生成的文档索引和时间线

## 技术依据

基于 Xorigo UI 项目的文档管理规范：

- **序号系统**: 按作用域分配的序号范围
- **命名规范**: 统一的文件命名格式
- **分类体系**: 清晰的文档分类和组织结构
- **版本管理**: 通过 Git 管理文档版本，文件名不含版本号

确保文档系统的一致性、可维护性和易用性。