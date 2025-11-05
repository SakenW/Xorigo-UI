---
name: "Xorigo UI 文档结构助手"
description: "专门负责 Xorigo UI 项目的文档命名规范、目录结构组织和索引管理的辅助技能，与文档生成器配合使用"
author: "Xorigo UI Team"
version: "2025.11.05"
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
// 文档命名规则（基于新的统一规范）
interface DocumentNamingConfig {
  scope: 'ph' | 'comp' | 'sys' | 'qa'
  sequence: number
  task: string
  stage?: string
  description?: string
}

function generateDocumentName(config: DocumentNamingConfig): string {
  const { scope, sequence, task, stage, description } = config

  // 新格式: {序号}-{scope}-{task}[-{stage}]-{描述}.md
  let name = `${sequence.toString().padStart(2, '0')}-${scope}-${task}`

  // 添加阶段标记（可选）
  if (stage) {
    name += `-${stage}`
  }

  // 添加描述（可选）
  if (description) {
    name += `-${description.toLowerCase().replace(/\s+/g, '-')}`
  }

  return `${name}.md`
}

// 文档分类主线映射
const scopeCategories = {
  'ph': '项目阶段线 (Phase 1–3 项目阶段文件)',
  'comp': '组件开发线 (组件库开发与优化)',
  'sys': '系统构建线 (系统/工具/构建相关文档)',
  'qa': '质量保证线 (测试、审查、评估报告)'
}
```

### 2. 序号管理
自动分配和管理文档序号：

```typescript
// 序号管理（基于新的四线分类）
class DocumentSequenceManager {
  private scopeRanges = {
    'ph': { min: 1, max: 99 },        // Phase 1-3 项目阶段
    'comp': { min: 1, max: 99 },      // 组件开发（每个分类独立编号）
    'sys': { min: 1, max: 99 },       // 系统构建（每个分类独立编号）
    'qa': { min: 1, max: 99 }         // 质量保证（每个分类独立编号）
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
    // 这里简化为模拟数据（使用新的命名格式）
    return [
      { sequence: 1, filename: '01-comp-ThemeBridge组件重构.md' },
      { sequence: 2, filename: '02-comp-Button组件优化.md' },
      { sequence: 1, filename: '01-sys-构建系统优化.md' },
      { sequence: 1, filename: '01-qa-代码质量审查.md' }
    ]
  }
}
```

### 3. 文档分类验证
验证文档分类和命名的一致性：

```typescript
// 文档分类验证（基于新的统一规范）
function validateDocumentClassification(filename: string): {
  valid: boolean
  scope?: string
  category?: string
  errors: string[]
  suggestions: string[]
} {
  const errors: string[] = []
  const suggestions: string[] = []

  // 解析文件名（新格式: {序号}-{scope}-{task}[-{stage}]-{描述}.md）
  const match = filename.match(/^(\d+)-([a-z]+)-(.+?)(?:-(.+?))?(?:-(.+))\.md$/)
  if (!match) {
    errors.push('文件名格式不正确，应为: {序号}-{scope}-{task}[-{stage}]-{描述}.md')
    return { valid: false, errors, suggestions }
  }

  const [, sequenceStr, scope, task, stage, description] = match
  const sequence = parseInt(sequenceStr)

  // 验证作用域（新的四线分类）
  const validScopes = ['ph', 'comp', 'sys', 'qa']
  if (!validScopes.includes(scope)) {
    errors.push(`无效的作用域: ${scope}，有效的作用域: ${validScopes.join(', ')}`)
    suggestions.push('项目阶段线: ph, 组件开发线: comp, 系统构建线: sys, 质量保证线: qa')
  }

  // 验证序号范围（新的简化范围）
  const scopeRanges = {
    'ph': [1, 99],
    'comp': [1, 99],
    'sys': [1, 99],
    'qa': [1, 99]
  }

  const range = scopeRanges[scope as keyof typeof scopeRanges]
  if (range && (sequence < range[0] || sequence > range[1])) {
    errors.push(`序号 ${sequence} 超出作用域 ${scope} 的范围 ${range[0]}-${range[1]}`)
  }

  // 验证任务描述
  if (task.length > 30) {
    suggestions.push('任务部分过长，建议使用简洁的任务描述')
  }

  // 验证阶段标记（可选）
  if (stage && stage.length > 20) {
    suggestions.push('阶段标记过长，建议使用简洁的阶段标识')
  }

  // 验证描述（可选）
  if (description && description.length > 50) {
    suggestions.push('描述部分过长，建议使用简洁的描述')
  }

  const valid = errors.length === 0
  return { valid, scope, category: this.getCategory(scope, task), errors, suggestions }
}

private getCategory(scope: string, task: string): string {
  switch (scope) {
    case 'comp':
      // 组件开发线的细分分类
      if (task.includes('Button') || task.includes('Input') || task.includes('基础')) return '核心组件'
      if (task.includes('Table') || task.includes('Chart') || task.includes('高级')) return '高级组件'
      if (task.includes('Header') || task.includes('Sidebar') || task.includes('布局')) return '布局组件'
      if (task.includes('Form') || task.includes('表单')) return '表单组件'
      return '组件开发'
    case 'ph':
      return '项目阶段'
    case 'sys':
      // 系统构建线的细分分类
      if (task.includes('构建') || task.includes('build')) return '构建系统'
      if (task.includes('部署') || task.includes('deploy')) return '部署系统'
      if (task.includes('工具') || task.includes('tool')) return '工具链'
      return '系统构建'
    case 'qa':
      // 质量保证线的细分分类
      if (task.includes('测试') || task.includes('test')) return '测试'
      if (task.includes('审查') || task.includes('review')) return '代码审查'
      if (task.includes('质量') || task.includes('quality')) return '质量保证'
      return '质量保证'
    default:
      return scope
  }
}
```

### 4. 文档结构组织
生成和组织文档目录结构：

```typescript
// 文档结构组织（基于新的统一规范）
function organizeDocumentStructure(): {
  structure: Record<string, string[]>
  indexFiles: string[]
  missingDocs: string[]
} {
  return {
    structure: {
      'docs/reports/phases/': [
        'README.md',
        '01-ph1-项目初始化.md',
        '05-ph2-设计令牌系统.md',
        '12-ph3-组件迁移完成.md'
      ],
      'docs/reports/components/': [
        'README.md',
        '01-comp-ThemeBridge组件重构.md',
        '02-comp-Button组件优化.md',
        '03-comp-数据表格组件开发.md'
      ],
      'docs/reports/system/': [
        'README.md',
        '01-sys-构建系统优化.md',
        '02-sys-Docker环境配置.md',
        '03-sys-工具链集成.md'
      ],
      'docs/reports/quality/': [
        'README.md',
        '01-qa-代码质量审查.md',
        '02-qa-单元测试覆盖率.md',
        '03-qa-可访问性测试.md'
      ]
    },
    indexFiles: [
      'docs/00-TIMELINE-INDEX.md',
      'docs/reports/phases/README.md',
      'docs/reports/components/README.md',
      'docs/reports/system/README.md',
      'docs/reports/quality/README.md'
    ],
    missingDocs: [
      'docs/guidelines/naming-guidelines.md',
      'docs/reports/system/README.md',
      'docs/reports/quality/README.md'
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
# 创建新文档（使用新的命名格式）
"创建 ThemeBridge 组件重构文档，分类为组件开发线"
"生成项目阶段文档：ph3-项目封版说明"
"创建系统构建文档：构建系统优化-性能提升"

# 验证文档命名（新格式）
"验证文件 comp-01-ThemeBridge组件重构.md 的命名是否符合规范"
"检查文档 qa-02-代码质量审查-阶段一.md 的分类是否正确"

# 生成索引
"生成项目文档时间线索引，包含所有四线文档"
"组织文档结构，创建标准目录和索引文件"
```

## 输出格式

1. **标准文件名**: 符合命名规范的文档文件名
2. **文档模板**: 预定义的文档内容模板
3. **目录结构**: 组织良好的文档目录结构
4. **索引文件**: 自动生成的文档索引和时间线

## 技术依据

基于 Xorigo UI v1.5.1 统一文件命名规范：

- **四线分类系统**: 项目阶段线(ph)、组件开发线(comp)、系统构建线(sys)、质量保证线(qa)
- **简化命名格式**: {序号}-{scope}-{task}[-{stage}]-{描述}.md
- **统一序号范围**: 各线独立编号 01-99，避免复杂的序号分配
- **兼容性扩展**: 支持源代码、配置、测试等全类型文件命名规范
- **版本管理**: 通过 Git 管理文档版本，文件名不含版本号

确保文档系统的一致性、可维护性和易用性，与整个项目的文件命名规范保持统一。