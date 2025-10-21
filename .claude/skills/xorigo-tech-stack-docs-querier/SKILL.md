# 技术栈文档查询 Skill

**触发条件**：当需要查询技术栈文档、获取最佳实践、验证技术实现时触发

## 功能描述

智能查询和分析技术栈文档，提供 Context7 集成策略，确保代码实现遵循官方最佳实践。

## 核心能力

### 1. Context7 集成查询器
集成 Context7 MCP 服务器进行技术栈文档查询：

```typescript
// Context7 集成查询器
class Context7Integrator {
  async queryTechStack(queries: TechStackQuery[]): Promise<TechStackQueryResult[]> {
    const results: TechStackQueryResult[] = []

    for (const query of queries) {
      try {
        // 解析库 ID
        const libraryId = await this.resolveLibraryId(query.technology)

        // 查询文档
        const documentation = await this.queryDocumentation(libraryId, query)

        // 分析和总结
        const analysis = await this.analyzeDocumentation(documentation, query)

        results.push({
          technology: query.technology,
          libraryId,
          queries: query.keywords,
          documentation,
          analysis,
          recommendations: this.generateRecommendations(analysis, query),
          confidence: this.calculateConfidence(analysis, query)
        })

      } catch (error) {
        results.push({
          technology: query.technology,
          error: error.message,
          fallback: await this.getFallbackInformation(query.technology)
        })
      }
    }

    return results
  }

  private async resolveLibraryId(technology: string): Promise<string> {
    const libraryMappings = {
      'React 19': '/facebook/react',
      'Next.js 15': '/vercel/next.js/v15',
      'TypeScript 5.9': '/microsoft/TypeScript',
      'Framer Motion 12': '/framer/motion',
      'Tailwind CSS 4': '/tailwindlabs/tailwindcss',
      'Vite 7': '/vitejs/vite',
      'Radix UI': '/radix-ui/primitives',
      'culori': '/evercoder/culori',
      'Zod': '/colinhacks/zod'
    }

    return libraryMappings[technology] || technology
  }

  private async queryDocumentation(libraryId: string, query: TechStackQuery): Promise<DocumentationContent> {
    // 使用 Context7 MCP 查询文档
    const context7Result = await this.useContext7({
      library: libraryId,
      topic: query.purpose,
      tokens: query.maxTokens || 5000,
      keywords: query.keywords
    })

    return {
      libraryId,
      content: context7Result.content,
      sections: this.parseSections(context7Result.content),
      codeExamples: this.extractCodeExamples(context7Result.content),
      bestPractices: this.extractBestPractices(context7Result.content),
      commonPitfalls: this.extractCommonPitfalls(context7Result.content),
      versionInfo: this.extractVersionInfo(context7Result.content),
      lastUpdated: context7Result.lastUpdated
    }
  }

  private analyzeDocumentation(documentation: DocumentationContent, query: TechStackQuery): DocumentationAnalysis {
    return {
      relevanceScore: this.calculateRelevance(documentation, query),
      keyInsights: this.extractKeyInsights(documentation),
      implementationPatterns: this.identifyImplementationPatterns(documentation),
      apiChanges: this.identifyAPIChanges(documentation),
      performanceConsiderations: this.extractPerformanceInfo(documentation),
      compatibility: this.analyzeCompatibility(documentation),
      migrationNotes: this.extractMigrationNotes(documentation)
    }
  }

  private generateRecommendations(analysis: DocumentationAnalysis, query: TechStackQuery): Recommendation[] {
    const recommendations: Recommendation[] = []

    // 基于分析生成推荐
    if (analysis.relevanceScore > 0.8) {
      recommendations.push({
        type: 'implementation',
        priority: 'high',
        title: '遵循官方推荐模式',
        description: '文档提供了高度相关的实现指导，建议严格遵循',
        action: '使用文档中的代码示例和最佳实践'
      })
    }

    if (analysis.apiChanges.length > 0) {
      recommendations.push({
        type: 'migration',
        priority: 'medium',
        title: '注意 API 变更',
        description: `检测到 ${analysis.apiChanges.length} 个 API 变更`,
        action: '更新现有代码以使用新的 API'
      })
    }

    if (analysis.performanceConsiderations.length > 0) {
      recommendations.push({
        type: 'optimization',
        priority: 'medium',
        title: '性能优化建议',
        description: '文档提供了性能优化指导',
        action: '应用建议的性能优化技巧'
      })
    }

    return recommendations
  }
}
```

### 2. 智能查询规划器
根据项目需求规划最优的文档查询策略：

```typescript
// 智能查询规划器
class QueryPlanner {
  planQueries(context: ProjectContext): QueryPlan {
    const plan: QueryPlan = {
      queries: [],
      strategy: this.determineStrategy(context),
      estimatedTokens: 0,
      priority: this.calculatePriority(context)
    }

    // 基于项目技术栈确定查询
    const techStack = this.analyzeTechStack(context)

    techStack.forEach(tech => {
      const queries = this.generateQueriesForTechnology(tech, context)
      plan.queries.push(...queries)
    })

    // 优化查询顺序和令牌使用
    plan.queries = this.optimizeQueries(plan.queries)
    plan.estimatedTokens = this.estimateTokenUsage(plan.queries)

    return plan
  }

  private generateQueriesForTechnology(technology: string, context: ProjectContext): TechStackQuery[] {
    const queryGenerators = {
      'React 19': () => [
        {
          technology: 'React 19',
          purpose: 'hooks best practices',
          keywords: ['React 19', 'hooks', 'useState', 'useEffect', 'useMemo', 'useCallback'],
          maxTokens: 3000,
          priority: 'high'
        },
        {
          technology: 'React 19',
          purpose: 'server components',
          keywords: ['React 19', 'Server Components', 'use client', 'RSC'],
          maxTokens: 4000,
          priority: 'high'
        },
        {
          technology: 'React 19',
          purpose: 'concurrent features',
          keywords: ['React 19', 'concurrent', 'startTransition', 'useDeferredValue'],
          maxTokens: 2000,
          priority: 'medium'
        }
      ],
      'Next.js 15': () => [
        {
          technology: 'Next.js 15',
          purpose: 'App Router patterns',
          keywords: ['Next.js 15', 'App Router', 'page.tsx', 'layout.tsx', 'metadata'],
          maxTokens: 4000,
          priority: 'high'
        },
        {
          technology: 'Next.js 15',
          purpose: 'client components',
          keywords: ['Next.js 15', 'client components', 'use client', 'useState'],
          maxTokens: 3000,
          priority: 'high'
        },
        {
          technology: 'Next.js 15',
          purpose: 'optimization',
          keywords: ['Next.js 15', 'performance', 'optimization', 'Image', 'Script'],
          maxTokens: 3000,
          priority: 'medium'
        }
      ],
      'Framer Motion 12': () => [
        {
          technology: 'Framer Motion 12',
          purpose: 'layout animations',
          keywords: ['Framer Motion 12', 'AnimatePresence', 'layout animations', 'LayoutGroup'],
          maxTokens: 3000,
          priority: 'high'
        },
        {
          technology: 'Framer Motion 12',
          purpose: 'variants and gestures',
          keywords: ['Framer Motion 12', 'variants', 'gestures', 'drag', 'pan'],
          maxTokens: 3000,
          priority: 'medium'
        }
      ]
    }

    return queryGenerators[technology]?.() || []
  }

  private optimizeQueries(queries: TechStackQuery[]): TechStackQuery[] {
    // 按优先级排序
    const sortedQueries = queries.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })

    // 合并相似查询以节省令牌
    const optimizedQueries = this.mergeSimilarQueries(sortedQueries)

    // 限制令牌使用
    return this.limitTokenUsage(optimizedQueries)
  }

  private mergeSimilarQueries(queries: TechStackQuery[]): TechStackQuery[] {
    const merged: TechStackQuery[] = []
    const seen = new Set<string>()

    for (const query of queries) {
      const key = `${query.technology}-${query.purpose}`

      if (!seen.has(key)) {
        seen.add(key)

        // 查找相似的查询并合并
        const similar = queries.filter(q =>
          q.technology === query.technology &&
          q.purpose === query.purpose &&
          q !== query
        )

        if (similar.length > 0) {
          // 合并关键词
          const mergedKeywords = [
            ...query.keywords,
            ...similar.flatMap(s => s.keywords)
          ].filter((keyword, index, array) => array.indexOf(keyword) === index)

          // 增加令牌限制
          const maxTokens = Math.max(
            query.maxTokens || 0,
            ...similar.map(s => s.maxTokens || 0)
          )

          merged.push({
            ...query,
            keywords: mergedKeywords,
            maxTokens: Math.min(maxTokens, 8000) // 限制最大令牌数
          })
        } else {
          merged.push(query)
        }
      }
    }

    return merged
  }
}
```

### 3. 文档质量评估器
评估查询到的文档质量和相关性：

```typescript
// 文档质量评估器
class DocumentQualityAssessor {
  assessQuality(documentation: DocumentationContent, query: TechStackQuery): QualityAssessment {
    const assessment: QualityAssessment = {
      overallScore: 0,
      relevanceScore: 0,
      completenessScore: 0,
      accuracyScore: 0,
      practicalityScore: 0,
      issues: [],
      strengths: []
    }

    // 评估相关性
    assessment.relevanceScore = this.assessRelevance(documentation, query)

    // 评估完整性
    assessment.completenessScore = this.assessCompleteness(documentation)

    // 评估准确性
    assessment.accuracyScore = this.assessAccuracy(documentation)

    // 评估实用性
    assessment.practicalityScore = this.assessPracticality(documentation)

    // 计算总分
    assessment.overallScore = (
      assessment.relevanceScore * 0.3 +
      assessment.completenessScore * 0.25 +
      assessment.accuracyScore * 0.25 +
      assessment.practicalityScore * 0.2
    )

    // 识别问题和优势
    assessment.issues = this.identifyIssues(documentation, assessment)
    assessment.strengths = this.identifyStrengths(documentation, assessment)

    return assessment
  }

  private assessRelevance(documentation: DocumentationContent, query: TechStackQuery): number {
    let score = 0
    const keywords = query.keywords.map(k => k.toLowerCase())
    const content = documentation.content.toLowerCase()

    // 关键词匹配
    const matchedKeywords = keywords.filter(keyword => content.includes(keyword))
    score += (matchedKeywords.length / keywords.length) * 40

    // 章节相关性
    const relevantSections = documentation.sections.filter(section =>
      keywords.some(keyword => section.title.toLowerCase().includes(keyword))
    )
    score += Math.min(relevantSections.length * 10, 30)

    // 代码示例相关性
    const relevantExamples = documentation.codeExamples.filter(example =>
      keywords.some(keyword => example.code.toLowerCase().includes(keyword))
    )
    score += Math.min(relevantExamples.length * 10, 30)

    return Math.min(score, 100)
  }

  private assessCompleteness(documentation: DocumentationContent): number {
    let score = 0

    // API 文档完整性
    if (documentation.sections.some(s => s.title.includes('API'))) score += 20
    if (documentation.sections.some(s => s.title.includes('Reference'))) score += 10

    // 示例完整性
    if (documentation.codeExamples.length > 0) score += 15
    if (documentation.codeExamples.some(e => e.isComplete)) score += 10

    // 最佳实践
    if (documentation.bestPractices.length > 0) score += 15
    if (documentation.commonPitfalls.length > 0) score += 10

    // 版本信息
    if (documentation.versionInfo) score += 10

    // 迁移指南
    if (documentation.migrationNotes.length > 0) score += 10

    return Math.min(score, 100)
  }

  private assessPracticality(documentation: DocumentationContent): number {
    let score = 0

    // 代码示例质量
    const exampleScores = documentation.codeExamples.map(example =>
      this.assessCodeExampleQuality(example)
    )
    const avgExampleScore = exampleScores.length > 0
      ? exampleScores.reduce((sum, score) => sum + score, 0) / exampleScores.length
      : 0
    score += avgExampleScore * 0.4

    // 最佳实践实用性
    if (documentation.bestPractices.length > 0) {
      score += 20
    }

    // 常见问题覆盖
    if (documentation.commonPitfalls.length > 0) {
      score += 20
    }

    // 性能指导
    if (documentation.content.includes('performance') ||
        documentation.content.includes('optimization')) {
      score += 20
    }

    return Math.min(score, 100)
  }

  private assessCodeExampleQuality(example: CodeExample): number {
    let score = 0

    // 完整性
    if (example.isComplete) score += 30

    // 注释质量
    if (example.code.includes('//') || example.code.includes('/*')) {
      score += 20
    }

    // 实际可运行性
    if (example.imports && example.imports.length > 0) score += 20

    // 错误处理
    if (example.code.includes('try') || example.code.includes('catch')) {
      score += 15
    }

    // 类型安全
    if (example.code.includes(':') || example.code.includes('interface')) {
      score += 15
    }

    return Math.min(score, 100)
  }
}
```

### 4. 实现指导生成器
基于查询结果生成具体的实现指导：

```typescript
// 实现指导生成器
class ImplementationGuideGenerator {
  generateGuide(queryResults: TechStackQueryResult[], context: ProjectContext): ImplementationGuide {
    const guide: ImplementationGuide = {
      summary: this.generateSummary(queryResults),
      prerequisites: this.extractPrerequisites(queryResults),
      stepByStepGuide: this.generateStepByStep(queryResults, context),
      codeTemplate: this.generateCodeTemplate(queryResults, context),
      bestPractices: this.extractBestPractices(queryResults),
      commonPitfalls: this.extractCommonPitfalls(queryResults),
      validationChecklist: this.generateChecklist(queryResults),
      references: this.generateReferences(queryResults)
    }

    return guide
  }

  private generateStepByStep(queryResults: TechStackQueryResult[], context: ProjectContext): Step[] {
    const steps: Step[] = []

    // 基于查询结果生成实现步骤
    queryResults.forEach(result => {
      if (result.analysis && result.recommendations) {
        const technologySteps = this.generateStepsForTechnology(result, context)
        steps.push(...technologySteps)
      }
    })

    // 按逻辑顺序排列步骤
    return this.orderSteps(steps)
  }

  private generateStepsForTechnology(result: TechStackQueryResult, context: ProjectContext): Step[] {
    const steps: Step[] = []

    switch (result.technology) {
      case 'React 19':
        steps.push(
          {
            id: 'react-19-setup',
            title: '设置 React 19 环境',
            description: '配置 React 19 和相关依赖',
            actions: [
              '安装 React 19: npm install react@19 react-dom@19',
              '更新 TypeScript: npm install typescript@^5.9',
              '配置 tsconfig.json 严格模式'
            ],
            codeBlocks: [
              {
                language: 'bash',
                code: 'npm install react@19 react-dom@19 typescript@^5.9'
              }
            ],
            verification: '验证 React 版本和 TypeScript 配置'
          },
          {
            id: 'react-19-hooks',
            title: '使用 React 19 Hooks',
            description: '应用 React 19 的 Hooks 最佳实践',
            actions: [
              '使用 useState 管理组件状态',
              '使用 useEffect 处理副作用',
              '使用 useMemo 和 useCallback 优化性能'
            ],
            codeBlocks: this.extractHookExamples(result),
            verification: '确保 Hooks 正确使用且无性能问题'
          }
        )
        break

      case 'Next.js 15':
        steps.push(
          {
            id: 'nextjs-15-app-router',
            title: '配置 Next.js 15 App Router',
            description: '使用 App Router 模式组织页面',
            actions: [
              '创建 app 目录结构',
              '配置 page.tsx 和 layout.tsx',
              '正确使用 "use client" 指令'
            ],
            codeBlocks: this.extractAppRouterExamples(result),
            verification: '验证页面路由和客户端组件正常工作'
          }
        )
        break

      case 'Framer Motion 12':
        steps.push(
          {
            id: 'framer-motion-setup',
            title: '集成 Framer Motion 12',
            description: '设置动画和交互效果',
            actions: [
              '安装 Framer Motion 12',
              '配置动画变体',
              '实现布局动画'
            ],
            codeBlocks: this.extractAnimationExamples(result),
            verification: '验证动画流畅且无性能问题'
          }
        )
        break
    }

    return steps
  }

  private generateCodeTemplate(queryResults: TechStackQueryResult[], context: ProjectContext): CodeTemplate {
    const template: CodeTemplate = {
      language: 'typescript',
      framework: this.detectFramework(queryResults),
      structure: this.generateFileStructure(queryResults, context),
      files: this.generateTemplateFiles(queryResults, context),
      dependencies: this.extractDependencies(queryResults),
      configuration: this.generateConfiguration(queryResults)
    }

    return template
  }

  private generateChecklist(queryResults: TechStackQueryResult[]): ChecklistItem[] {
    const checklist: ChecklistItem[] = []

    queryResults.forEach(result => {
      if (result.analysis) {
        const items = this.generateChecklistForTechnology(result)
        checklist.push(...items)
      }
    })

    return checklist
  }

  private generateChecklistForTechnology(result: TechStackQueryResult): ChecklistItem[] {
    const items: ChecklistItem[] = []

    switch (result.technology) {
      case 'React 19':
        items.push(
          { id: 'react-19-version', task: '确认使用 React 19 版本', priority: 'high' },
          { id: 'react-19-typescript', task: 'TypeScript 严格模式配置', priority: 'high' },
          { id: 'react-19-hooks-correct', task: 'Hooks 使用正确', priority: 'medium' },
          { id: 'react-19-performance', task: '性能优化措施到位', priority: 'medium' }
        )
        break

      case 'Next.js 15':
        items.push(
          { id: 'nextjs-15-app-router', task: '使用 App Router 模式', priority: 'high' },
          { id: 'nextjs-15-client-directive', task: '正确标记客户端组件', priority: 'high' },
          { id: 'nextjs-15-metadata', task: '配置页面元数据', priority: 'medium' }
        )
        break

      case 'Framer Motion 12':
        items.push(
          { id: 'framer-motion-12-version', task: '使用 Framer Motion 12', priority: 'medium' },
          { id: 'framer-motion-12-performance', task: '动画性能优化', priority: 'medium' },
          { id: 'framer-motion-12-accessibility', task: '动画可访问性支持', priority: 'high' }
        )
        break
    }

    return items
  }
}
```

### 5. 持续学习管理器
管理和更新技术栈知识库：

```typescript
// 持续学习管理器
class ContinuousLearningManager {
  async updateKnowledgeBase(): Promise<UpdateResult> {
    const result: UpdateResult = {
      success: false,
      updatedLibraries: [],
      failedLibraries: [],
      summary: ''
    }

    try {
      // 获取需要更新的技术栈列表
      const techStack = this.getManagedTechStack()

      for (const tech of techStack) {
        try {
          const updateResult = await this.updateLibraryDocumentation(tech)
          if (updateResult.success) {
            result.updatedLibraries.push({
              library: tech,
              previousVersion: updateResult.previousVersion,
              newVersion: updateResult.newVersion,
              changes: updateResult.changes
            })
          } else {
            result.failedLibraries.push({
              library: tech,
              error: updateResult.error
            })
          }
        } catch (error) {
          result.failedLibraries.push({
            library: tech,
            error: error.message
          })
        }
      }

      result.success = result.failedLibraries.length === 0
      result.summary = this.generateUpdateSummary(result)

    } catch (error) {
      result.summary = `Update failed: ${error.message}`
    }

    return result
  }

  private async updateLibraryDocumentation(library: string): Promise<LibraryUpdateResult> {
    // 查询最新文档
    const latestDoc = await this.queryLatestDocumentation(library)

    // 与缓存的文档比较
    const cachedDoc = await this.getCachedDocumentation(library)

    if (!cachedDoc || this.hasSignificantChanges(latestDoc, cachedDoc)) {
      // 保存新文档
      await this.cacheDocumentation(library, latestDoc)

      // 分析变更
      const changes = this.analyzeChanges(latestDoc, cachedDoc)

      return {
        success: true,
        previousVersion: cachedDoc?.versionInfo?.version || 'unknown',
        newVersion: latestDoc.versionInfo?.version || 'unknown',
        changes
      }
    }

    return {
      success: true,
      previousVersion: latestDoc.versionInfo?.version || 'unknown',
      newVersion: latestDoc.versionInfo?.version || 'unknown',
      changes: []
    }
  }

  private analyzeChanges(latest: DocumentationContent, cached: DocumentationContent | null): DocumentationChange[] {
    if (!cached) return []

    const changes: DocumentationChange[] = []

    // 检测 API 变更
    const latestAPI = this.extractAPIInfo(latest)
    const cachedAPI = this.extractAPIInfo(cached)

    const apiChanges = this.compareAPIs(latestAPI, cachedAPI)
    changes.push(...apiChanges)

    // 检测最佳实践变更
    const latestPractices = latest.bestPractices
    const cachedPractices = cached.bestPractices

    const practiceChanges = this.compareBestPractices(latestPractices, cachedPractices)
    changes.push(...practiceChanges)

    return changes
  }

  async generateUpdateRecommendations(): Promise<UpdateRecommendation[]> {
    const recommendations: UpdateRecommendation[] = []

    // 分析项目当前状态
    const projectAnalysis = await this.analyzeCurrentProject()

    // 基于更新历史生成建议
    const updateHistory = await this.getUpdateHistory()

    updateHistory.forEach(update => {
      if (update.priority === 'high' && !update.applied) {
        recommendations.push({
          type: 'version_upgrade',
          library: update.library,
          currentVersion: update.currentVersion,
          recommendedVersion: update.latestVersion,
          priority: update.priority,
          reason: update.reason,
          breakingChanges: update.breakingChanges,
          migrationGuide: update.migrationGuide
        })
      }
    })

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    })
  }
}
```

## 查询策略

### 优先级技术栈
1. **React 19** - 核心框架，优先级最高
2. **Next.js 15** - 应用框架，优先级高
3. **TypeScript 5.9** - 类型系统，优先级高
4. **Framer Motion 12** - 动画库，优先级中等
5. **Tailwind CSS 4** - 样式框架，优先级中等

### 查询关键词模板
```typescript
const queryTemplates = {
  'React 19': [
    'React 19 hooks best practices',
    'React 19 server components',
    'React 19 concurrent features',
    'React 19 performance optimization'
  ],
  'Next.js 15': [
    'Next.js 15 App Router',
    'Next.js 15 client components',
    'Next.js 15 metadata API',
    'Next.js 15 performance'
  ]
}
```

## 使用示例

```bash
# 查询技术栈文档
"查询 React 19 和 Next.js 15 的最佳实践，生成组件开发指导"

# 生成实现指南
"基于文档查询结果生成完整的实现指南和代码模板"

# 评估文档质量
"评估查询到的文档质量和相关性，提供改进建议"

# 更新知识库
"检查技术栈是否有新版本，更新知识库文档"
```

## 输出格式

1. **查询结果**: 结构化的技术栈文档信息
2. **实现指南**: 详细的步骤-by-步骤实现指导
3. **代码模板**: 可直接使用的代码模板
4. **验证清单**: 质量检查和验证项目清单

## 技术依据

基于 Xorigo UI 项目的技术栈和 Context7 集成策略：

- **文档优先**: 先查询文档再实现
- **版本敏感**: 明确技术栈版本和特性
- **最佳实践导向**: 遵循官方推荐模式
- **持续学习**: 自动更新技术栈知识

确保代码实现符合官方最佳实践和技术发展趋势。