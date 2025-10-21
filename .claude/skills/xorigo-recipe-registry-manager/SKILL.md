# 七轴配方注册管理 Skill

**触发条件**：当需要管理七轴配方、生成配方注册信息、处理配方发布时触发

## 功能描述

管理 Xorigo UI 七轴 DTCG 配方系统的注册、发布和分发，支持配方的版本管理、CDN 分发和社区贡献。

## 核心能力

### 1. 配方注册生成器
生成配方注册的 JSON 数据和元数据：

```typescript
// 配方注册生成器
class RecipeRegistryGenerator {
  generateRegistry(recipes: StyleRecipe[]): RegistryData {
    const registryRecipes = recipes.map(recipe => this.transformToRegistryRecipe(recipe))

    return {
      version: this.getCurrentVersion(),
      generatedAt: new Date().toISOString(),
      totalRecipes: registryRecipes.length,
      recipes: registryRecipes,
      categories: this.extractCategories(registryRecipes),
      tags: this.extractTags(registryRecipes),
      statistics: this.calculateStatistics(registryRecipes)
    }
  }

  private transformToRegistryRecipe(recipe: StyleRecipe): RegistryRecipe {
    return {
      id: recipe.id,
      name: recipe.name,
      description: recipe.description,
      category: recipe.category || 'general',

      // 七轴参数
      axes: {
        mode: recipe.mode,
        base: recipe.base,
        accent: recipe.accent,
        tone: recipe.tone,
        density: recipe.density,
        motion: recipe.motion,
        surface: recipe.surface
      },

      // 可访问性信息
      accessibility: {
        contrastLevel: recipe.accessibility?.contrastLevel || 'AA',
        cvdFriendly: recipe.accessibility?.cvdFriendly || false,
        motionSafe: recipe.accessibility?.motionSafe || true,
        wcagCompliant: recipe.accessibility?.wcagCompliant || true
      },

      // 预览信息
      preview: {
        thumbnail: this.generateThumbnailUrl(recipe.id),
        demoUrl: this.generateDemoUrl(recipe.id),
        livePreview: this.generateLivePreviewUrl(recipe.id),
        colorPalette: this.generateColorPalette(recipe)
      },

      // 使用统计
      usage: {
        installations: this.getInstallations(recipe.id),
        rating: this.getRating(recipe.id),
        downloads: this.getDownloads(recipe.id),
        lastUsed: this.getLastUsed(recipe.id)
      },

      // 元数据
      metadata: {
        author: recipe.author || 'Xorigo UI Team',
        version: recipe.version || '1.0.0',
        license: recipe.license || 'MIT',
        createdAt: recipe.createdAt || new Date().toISOString(),
        updatedAt: recipe.updatedAt || new Date().toISOString(),
        tags: recipe.tags || [],
        featured: recipe.featured || false,
        deprecated: recipe.deprecated || false,
        breakingChanges: recipe.breakingChanges || []
      },

      // 技术信息
      technical: {
        dependencies: this.getDependencies(recipe),
        browserSupport: this.getBrowserSupport(recipe),
        performance: this.getPerformanceMetrics(recipe),
        bundleSize: this.getBundleSize(recipe)
      }
    }
  }

  private generateThumbnailUrl(recipeId: string): string {
    return `https://cdn.xorigo-ui.dev/recipes/thumbnails/${encodeURIComponent(recipeId)}.png`
  }

  private generateDemoUrl(recipeId: string): string {
    return `https://xorigo-ui.dev/demo?recipe=${encodeURIComponent(recipeId)}`
  }

  private generateLivePreviewUrl(recipeId: string): string {
    return `https://xorigo-ui.dev/preview/${encodeURIComponent(recipeId)}`
  }

  private generateColorPalette(recipe: StyleRecipe): ColorPalette {
    // 使用 OKLCH 引擎生成颜色预览
    const engine = new OKLCHColorEngine()
    const palette = engine.generateColorPalette(recipe)

    return {
      primary: palette.primary,
      neutral: palette.neutral,
      semantic: {
        success: palette.success,
        warning: palette.warning,
        error: palette.error,
        info: palette.primary
      },
      preview: {
        light: this.generatePreviewColors(recipe, 'light'),
        dark: this.generatePreviewColors(recipe, 'dark')
      }
    }
  }

  private calculateStatistics(recipes: RegistryRecipe[]): RegistryStatistics {
    const stats = {
      totalRecipes: recipes.length,
      categories: {} as Record<string, number>,
      modes: {} as Record<string, number>,
      tones: {} as Record<string, number>,
      surfaces: {} as Record<string, number>,
      accessibility: {
        wcagAA: 0,
        cvdFriendly: 0,
        motionSafe: 0
      },
      popularity: {
        mostInstalled: [] as string[],
        highestRated: [] as string[],
        recentlyUpdated: [] as string[]
      }
    }

    recipes.forEach(recipe => {
      // 统计分类
      stats.categories[recipe.category] = (stats.categories[recipe.category] || 0) + 1

      // 统计模式
      stats.modes[recipe.axes.mode] = (stats.modes[recipe.axes.mode] || 0) + 1

      // 统计色调
      stats.tones[recipe.axes.tone] = (stats.tones[recipe.axes.tone] || 0) + 1

      // 统计表面
      stats.surfaces[recipe.axes.surface] = (stats.surfaces[recipe.axes.surface] || 0) + 1

      // 统计可访问性
      if (recipe.accessibility.contrastLevel === 'AA') stats.accessibility.wcagAA++
      if (recipe.accessibility.cvdFriendly) stats.accessibility.cvdFriendly++
      if (recipe.accessibility.motionSafe) stats.accessibility.motionSafe++
    })

    // 计算受欢迎程度
    stats.popularity.mostInstalled = recipes
      .sort((a, b) => b.usage.installations - a.usage.installations)
      .slice(0, 10)
      .map(r => r.id)

    stats.popularity.highestRated = recipes
      .sort((a, b) => b.usage.rating - a.usage.rating)
      .slice(0, 10)
      .map(r => r.id)

    stats.popularity.recentlyUpdated = recipes
      .sort((a, b) => new Date(b.metadata.updatedAt).getTime() - new Date(a.metadata.updatedAt).getTime())
      .slice(0, 10)
      .map(r => r.id)

    return stats
  }
}
```

### 2. CDN 发布管理器
管理配方到 CDN 的发布和分发：

```typescript
// CDN 发布管理器
class CDNPublisher {
  async publishToCDN(registry: RegistryData, config: PublishConfig): Promise<PublishResult> {
    const publishResult: PublishResult = {
      success: false,
      version: registry.version,
      files: [],
      urls: [],
      errors: []
    }

    try {
      // 1. 生成发布文件
      const files = await this.generatePublishFiles(registry)
      publishResult.files = files

      // 2. 上传到 CDN
      const uploadResults = await this.uploadToCDN(files, config)

      // 3. 生成访问 URL
      publishResult.urls = this.generateAccessUrls(uploadResults, config)

      // 4. 更新版本索引
      await this.updateVersionIndex(registry, config)

      // 5. 清理旧版本
      if (config.cleanupOldVersions) {
        await this.cleanupOldVersions(config)
      }

      publishResult.success = true

    } catch (error) {
      publishResult.errors.push(`Publish failed: ${error.message}`)
    }

    return publishResult
  }

  private async generatePublishFiles(registry: RegistryData): Promise<PublishFile[]> {
    const files: PublishFile[] = []

    // 主注册文件
    files.push({
      path: 'recipes.json',
      content: JSON.stringify(registry, null, 2),
      contentType: 'application/json',
      compress: true
    })

    // 版本化文件
    files.push({
      path: `recipes/v${registry.version}.json`,
      content: JSON.stringify(registry, null, 2),
      contentType: 'application/json',
      compress: true
    })

    // 按分类分组的文件
    const categorizedRecipes = this.groupRecipesByCategory(registry.recipes)
    Object.entries(categorizedRecipes).forEach(([category, recipes]) => {
      files.push({
        path: `recipes/categories/${category}.json`,
        content: JSON.stringify(recipes, null, 2),
        contentType: 'application/json',
        compress: true
      })
    })

    // 索引文件
    files.push({
      path: 'recipes/index.json',
      content: JSON.stringify({
        version: registry.version,
        totalRecipes: registry.totalRecipes,
        categories: Object.keys(registry.categories),
        lastUpdated: registry.generatedAt
      }, null, 2),
      contentType: 'application/json',
      compress: false
    })

    // 生成缩略图
    for (const recipe of registry.recipes) {
      const thumbnailData = await this.generateThumbnail(recipe)
      if (thumbnailData) {
        files.push({
          path: `recipes/thumbnails/${encodeURIComponent(recipe.id)}.png`,
          content: thumbnailData,
          contentType: 'image/png',
          compress: false
        })
      }
    }

    return files
  }

  private async uploadToCDN(files: PublishFile[], config: PublishConfig): Promise<UploadResult[]> {
    const results: UploadResult[] = []

    for (const file of files) {
      try {
        const url = await this.uploadFile(file, config)
        results.push({
          path: file.path,
          url,
          success: true,
          size: file.content.length
        })
      } catch (error) {
        results.push({
          path: file.path,
          success: false,
          error: error.message
        })
      }
    }

    return results
  }

  private async uploadFile(file: PublishFile, config: PublishConfig): Promise<string> {
    // 根据配置选择 CDN 提供商
    switch (config.provider) {
      case 'cloudflare':
        return this.uploadToCloudflare(file, config)
      case 'aws':
        return this.uploadToAWS(file, config)
      case 'jsdelivr':
        return this.uploadToJsDelivr(file, config)
      default:
        throw new Error(`Unsupported CDN provider: ${config.provider}`)
    }
  }

  private generateAccessUrls(uploadResults: UploadResult[], config: PublishConfig): string[] {
    return uploadResults
      .filter(result => result.success)
      .map(result => result.url)
  }

  private async updateVersionIndex(registry: RegistryData, config: PublishConfig): Promise<void> {
    const versionIndex = {
      currentVersion: registry.version,
      versions: await this.getVersionHistory(config),
      updated: new Date().toISOString()
    }

    await this.uploadFile({
      path: 'recipes/versions.json',
      content: JSON.stringify(versionIndex, null, 2),
      contentType: 'application/json',
      compress: false
    }, config)
  }
}
```

### 3. 配方验证器
验证配方的完整性和合规性：

```typescript
// 配方验证器
class RecipeValidator {
  validateRecipe(recipe: StyleRecipe): ValidationResult {
    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    // 验证基础结构
    this.validateBasicStructure(recipe, errors)

    // 验证七轴参数
    this.validateAxes(recipe, errors, warnings)

    // 验证可访问性
    this.validateAccessibility(recipe, errors, warnings)

    // 验证元数据
    this.validateMetadata(recipe, errors, warnings)

    // 验证颜色生成
    this.validateColorGeneration(recipe, errors, warnings)

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      score: this.calculateValidationScore(errors, warnings)
    }
  }

  private validateBasicStructure(recipe: StyleRecipe, errors: ValidationError[]): void {
    const requiredFields = ['id', 'name', 'description', 'mode', 'base', 'accent', 'tone', 'density', 'motion', 'surface']

    requiredFields.forEach(field => {
      if (!recipe[field]) {
        errors.push({
          field,
          message: `Missing required field: ${field}`,
          severity: 'error'
        })
      }
    })

    // 验证 ID 格式
    if (recipe.id && !this.isValidRecipeId(recipe.id)) {
      errors.push({
        field: 'id',
        message: `Invalid recipe ID format: ${recipe.id}`,
        severity: 'error'
      })
    }
  }

  private validateAxes(recipe: StyleRecipe, errors: ValidationError[], warnings: ValidationWarning[]): void {
    const validModes = ['light', 'dark', 'hc']
    const validTones = ['calm', 'standard', 'vivid', 'vibrant']
    const validDensities = ['spacious', 'comfortable', 'compact']
    const validSurfaces = ['flat', 'soft-shadow', 'elevated', 'glass']

    // 验证模式
    if (!validModes.includes(recipe.mode)) {
      errors.push({
        field: 'mode',
        message: `Invalid mode: ${recipe.mode}, must be one of: ${validModes.join(', ')}`,
        severity: 'error'
      })
    }

    // 验证色调
    if (!validTones.includes(recipe.tone)) {
      warnings.push({
        field: 'tone',
        message: `Unusual tone: ${recipe.tone}, consider using: ${validTones.join(', ')}`,
        severity: 'warning'
      })
    }

    // 验证表面与动效的组合
    if (recipe.surface === 'glass' && recipe.motion.includes('subtle')) {
      warnings.push({
        field: 'surface',
        message: 'Glass surface works better with expressive motion',
        severity: 'warning'
      })
    }

    // 验证高对比度模式
    if (recipe.mode === 'hc') {
      if (recipe.tone !== 'vivid') {
        warnings.push({
          field: 'tone',
          message: 'High contrast mode recommended with vivid tone',
          severity: 'warning'
        })
      }
    }
  }

  private validateAccessibility(recipe: StyleRecipe, errors: ValidationError[], warnings: ValidationWarning[]): void {
    const accessibility = recipe.accessibility || {}

    // 检查对比度
    if (!accessibility.contrastLevel) {
      warnings.push({
        field: 'accessibility.contrastLevel',
        message: 'Contrast level not specified, recommend AA or higher',
        severity: 'warning'
      })
    }

    // 检查色盲友好
    if (accessibility.cvdFriendly === false) {
      warnings.push({
        field: 'accessibility.cvdFriendly',
        message: 'Recipe may not be color vision deficiency friendly',
        severity: 'warning'
      })
    }

    // 检查动效安全
    if (recipe.motion.includes('expressive') && accessibility.motionSafe !== false) {
      warnings.push({
        field: 'accessibility.motionSafe',
        message: 'Expressive motion may not be safe for motion-sensitive users',
        severity: 'warning'
      })
    }
  }

  private validateColorGeneration(recipe: StyleRecipe, errors: ValidationError[], warnings: ValidationWarning[]): void {
    try {
      const engine = new OKLCHColorEngine()
      const palette = engine.generateColorPalette(recipe)

      // 检查颜色生成是否成功
      if (!palette.primary || Object.keys(palette.primary).length === 0) {
        errors.push({
          field: 'colorGeneration',
          message: 'Failed to generate color palette',
          severity: 'error'
        })
      }

      // 检查对比度
      this.validateColorContrast(palette, errors, warnings)

    } catch (error) {
      errors.push({
        field: 'colorGeneration',
        message: `Color generation error: ${error.message}`,
        severity: 'error'
      })
    }
  }

  private validateColorContrast(palette: ColorPalette, errors: ValidationError[], warnings: ValidationWarning[]): void {
    // 验证主色对比度
    const primaryContrast = this.calculateContrast(
      palette.primary['500'],
      palette.primary['100']
    )

    if (primaryContrast < 4.5) {
      errors.push({
        field: 'colorContrast',
        message: `Primary color contrast too low: ${primaryContrast.toFixed(2)} (WCAG AA requires 4.5)`,
        severity: 'error'
      })
    }

    // 验证状态色对比度
    ['success', 'warning', 'error'].forEach(state => {
      const statePalette = palette[state as keyof ColorPalette] as ColorScale
      if (statePalette) {
        const contrast = this.calculateContrast(statePalette['500'], palette.neutral['100'])
        if (contrast < 3.0) {
          warnings.push({
            field: 'colorContrast',
            message: `${state} color contrast could be improved: ${contrast.toFixed(2)}`,
            severity: 'warning'
          })
        }
      }
    })
  }

  private calculateValidationScore(errors: ValidationError[], warnings: ValidationWarning[]): number {
    const errorWeight = 10
    const warningWeight = 3
    const maxScore = 100

    const deduction = (errors.length * errorWeight) + (warnings.length * warningWeight)
    return Math.max(0, maxScore - deduction)
  }
}
```

### 4. 社区贡献管理器
管理社区贡献的配方：

```typescript
// 社区贡献管理器
class CommunityContributionManager {
  async submitContribution(submission: RecipeSubmission): Promise<ContributionResult> {
    const result: ContributionResult = {
      success: false,
      submissionId: this.generateSubmissionId(),
      status: 'pending',
      errors: [],
      warnings: []
    }

    try {
      // 1. 验证提交
      const validation = this.validateSubmission(submission)
      if (!validation.valid) {
        result.status = 'rejected'
        result.errors = validation.errors
        return result
      }

      result.warnings = validation.warnings

      // 2. 检查重复
      const duplicateCheck = await this.checkDuplicate(submission.recipe)
      if (duplicateCheck.isDuplicate) {
        result.status = 'duplicate'
        result.warnings.push(`Similar recipe already exists: ${duplicateCheck.existingRecipeId}`)
        return result
      }

      // 3. 测试配方
      const testResult = await this.testRecipe(submission.recipe)
      if (!testResult.success) {
        result.status = 'failed_tests'
        result.errors = testResult.errors
        return result
      }

      // 4. 存储到待审核队列
      await this.addToReviewQueue({
        ...submission,
        submissionId: result.submissionId,
        submittedAt: new Date().toISOString(),
        status: 'pending_review'
      })

      result.status = 'submitted'
      result.success = true

    } catch (error) {
      result.status = 'error'
      result.errors.push({
        field: 'submission',
        message: `Submission error: ${error.message}`,
        severity: 'error'
      })
    }

    return result
  }

  private async checkDuplicate(recipe: StyleRecipe): Promise<DuplicateCheck> {
    const existingRecipes = await this.loadExistingRecipes()

    for (const existing of existingRecipes) {
      const similarity = this.calculateSimilarity(recipe, existing)

      if (similarity > 0.8) {
        return {
          isDuplicate: true,
          existingRecipeId: existing.id,
          similarity,
          reason: 'High similarity with existing recipe'
        }
      }
    }

    return {
      isDuplicate: false,
      similarity: 0
    }
  }

  private calculateSimilarity(recipe1: StyleRecipe, recipe2: StyleRecipe): number {
    let similarity = 0
    let factors = 0

    // 比较七轴参数
    const axes = ['mode', 'base', 'accent', 'tone', 'density', 'motion', 'surface']
    axes.forEach(axis => {
      factors++
      if (recipe1[axis] === recipe2[axis]) {
        similarity += 1
      }
    })

    // 比较名称和描述
    factors += 2
    similarity += this.calculateTextSimilarity(recipe1.name, recipe2.name)
    similarity += this.calculateTextSimilarity(recipe1.description, recipe2.description)

    return similarity / factors
  }

  private async testRecipe(recipe: StyleRecipe): Promise<TestResult> {
    const errors: TestError[] = []

    try {
      // 测试颜色生成
      const engine = new OKLCHColorEngine()
      const palette = engine.generateColorPalette(recipe)

      if (!palette.primary) {
        errors.push({
          type: 'color_generation',
          message: 'Failed to generate color palette'
        })
      }

      // 测试可访问性
      const validator = new RecipeValidator()
      const validation = validator.validateRecipe(recipe)

      if (!validation.valid) {
        errors.push(...validation.errors.map(err => ({
          type: 'validation',
          message: `${err.field}: ${err.message}`
        })))
      }

      // 测试性能
      const performanceTest = await this.testRecipePerformance(recipe)
      if (!performanceTest.success) {
        errors.push({
          type: 'performance',
          message: `Performance test failed: ${performanceTest.reason}`
        })
      }

    } catch (error) {
      errors.push({
        type: 'general',
        message: `Test execution error: ${error.message}`
      })
    }

    return {
      success: errors.length === 0,
      errors,
      executionTime: Date.now()
    }
  }

  async processReviewQueue(): Promise<ReviewResult[]> {
    const pendingSubmissions = await this.getPendingSubmissions()
    const results: ReviewResult[] = []

    for (const submission of pendingSubmissions) {
      const result = await this.reviewSubmission(submission)
      results.push(result)

      // 更新提交状态
      await this.updateSubmissionStatus(submission.submissionId, result.status)
    }

    return results
  }

  private async reviewSubmission(submission: RecipeSubmission): Promise<ReviewResult> {
    const reviewCriteria = {
      codeQuality: await this.reviewCodeQuality(submission.recipe),
      designConsistency: await this.reviewDesignConsistency(submission.recipe),
      accessibility: await this.reviewAccessibility(submission.recipe),
      performance: await this.reviewPerformance(submission.recipe),
      documentation: await this.reviewDocumentation(submission)
    }

    const overallScore = Object.values(reviewCriteria).reduce((sum, score) => sum + score, 0) / Object.keys(reviewCriteria).length

    const status = overallScore >= 8 ? 'approved' : overallScore >= 6 ? 'needs_revision' : 'rejected'

    return {
      submissionId: submission.submissionId,
      status,
      overallScore,
      criteria: reviewCriteria,
      reviewer: 'Automated Review System',
      reviewedAt: new Date().toISOString(),
      feedback: this.generateFeedback(reviewCriteria)
    }
  }
}
```

## 配方标准

### ID 命名规范
```
{mode}.{base}.{tone}.{accent}.{density}.{motion}.{surface}

示例:
- light.neutral-true-mid.mono(blue).standard.comfortable.standard.soft-shadow
- dark.neutral-cool-mid.analog(purple).vivid.comfortable.expressive.glass
```

### 元数据要求
- **name**: 简洁描述性的配方名称
- **description**: 详细的配方描述 (50-200 字符)
- **tags**: 相关标签数组 (3-8 个标签)
- **author**: 配方作者信息
- **license**: 开源协议 (推荐 MIT)

### 质量标准
- **验证评分**: ≥ 80 分
- **可访问性**: WCAG AA 合规
- **性能**: 配方生成时间 < 100ms
- **文档**: 完整的使用说明和示例

## 使用示例

```bash
# 生成配方注册
"将当前 20 个配方生成注册 JSON，包含完整的元数据和预览信息"

# 发布到 CDN
"将配方注册发布到 Cloudflare CDN，生成缩略图和版本化文件"

# 验证配方
"验证新提交的配方是否符合七轴系统标准"

# 处理社区贡献
"审核待处理的社区配方贡献，自动测试和评分"
```

## 输出格式

1. **注册 JSON**: 完整的配方注册数据
2. **CDN 文件**: 上传到 CDN 的文件列表
3. **验证报告**: 配方验证结果和改进建议
4. **审核结果**: 社区贡献的审核结果

## 技术依据

基于 Xorigo UI 七轴配方系统的设计原则：

- **七轴参数化**: Mode/Base/Accent/Tone/Density/Motion/Surface
- **动态色彩生成**: OKLCH 色彩空间算法
- **标准化接口**: 统一的配方定义和访问方式
- **社区驱动**: 支持社区贡献和配方分享

确保配方系统的可扩展性、一致性和高质量。