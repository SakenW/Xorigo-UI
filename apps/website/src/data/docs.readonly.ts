/**
 * 📚 Docs 只读适配器
 *
 * 提供对文档数据的只读访问接口
 * 使用 Singleton 模式确保单一数据源
 * 完整的 Schema 验证和错误处理
 *
 * @author Hive Mind Coder Agent
 * @version 1.0.0
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname, basename } from 'path'
import {
  DocsDataSchema,
  DocContentSchema,
  DocIndexItemSchema,
  DocCategorySchema,
  type DocsData,
  type DocContent,
  type DocIndexItem,
  type DocMetadata,
  type DocCategory,
  type ValidationResult,
  type ValidationError,
  type ValidationWarning,
  DataErrorCode,
  DataError
} from './types'

/**
 * 文档文件解析器接口
 */
interface DocumentParser {
  parse(filePath: string): DocContent
  supports(extension: string): boolean
}

/**
 * Markdown 文档解析器
 */
class MarkdownDocumentParser implements DocumentParser {
  supports(extension: string): boolean {
    return ['.md', '.mdx'].includes(extension)
  }

  parse(filePath: string): DocContent {
    try {
      const content = readFileSync(filePath, 'utf-8')
      const metadata = this.extractMetadata(content)
      const toc = this.extractTableOfContents(content)
      const contentBlocks = this.parseContentBlocks(content)

      return {
        metadata: metadata as DocMetadata,
        content: contentBlocks,
        toc: toc.length > 0 ? toc : undefined
      }
    } catch (error) {
      throw new DataError(
        DataErrorCode.PARSE_ERROR,
        `Failed to parse markdown document: ${filePath}`,
        { filePath, error }
      )
    }
  }

  /**
   * 从 Markdown 文件中提取 Frontmatter 元数据
   */
  private extractMetadata(content: string): Partial<DocMetadata> {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n/
    const match = content.match(frontmatterRegex)

    if (!match) {
      // 如果没有 Frontmatter，从文件名推断基本信息
      const filename = basename(this.getCurrentFilePath(), '.md')
      return {
        title: this.titleCase(filename.replace(/-/g, ' ')),
        description: `Documentation for ${filename}`,
        category: 'getting-started' as DocCategory,
        lastUpdated: new Date().toISOString(),
        tags: [],
        difficulty: 'beginner'
      }
    }

    try {
      const metadata = this.parseYaml(match[1])
      return {
        title: metadata.title || 'Untitled',
        description: metadata.description || '',
        category: metadata.category || 'getting-started',
        author: metadata.author,
        lastUpdated: metadata.lastUpdated || new Date().toISOString(),
        version: metadata.version,
        tags: metadata.tags || [],
        readTime: metadata.readTime,
        difficulty: metadata.difficulty
      }
    } catch (error) {
      throw new DataError(
        DataErrorCode.PARSE_ERROR,
        `Failed to parse frontmatter metadata`,
        { frontmatter: match[1], error }
      )
    }
  }

  /**
   * 从内容中提取目录结构
   */
  private extractTableOfContents(content: string): Array<{ level: number; title: string; anchor: string }> {
    const headingRegex = /^(#{1,6})\s+(.+)$/gm
    const toc: Array<{ level: number; title: string; anchor: string }> = []
    let match

    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length
      const title = match[2].trim()
      const anchor = this.generateAnchor(title)
      toc.push({ level, title, anchor })
    }

    return toc
  }

  /**
   * 解析内容块
   */
  private parseContentBlocks(content: string) {
    // 移除 Frontmatter
    const contentWithoutFrontmatter = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/, '')

    // 简化的内容块解析
    const lines = contentWithoutFrontmatter.split('\n')
    const blocks: any[] = []
    let currentBlock: any = null
    let currentContent: string[] = []

    for (const line of lines) {
      if (line.startsWith('#')) {
        // 标题块
        if (currentBlock) {
          currentBlock.content = currentContent.join('\n').trim()
          blocks.push(currentBlock)
        }

        const level = line.match(/^#+/)?.[0].length || 1
        const title = line.replace(/^#+\s*/, '').trim()

        currentBlock = {
          type: 'heading',
          content: '',
          attrs: { level, title }
        }
        currentContent = []
      } else if (line.startsWith('```')) {
        // 代码块
        if (currentBlock) {
          currentBlock.content = currentContent.join('\n').trim()
          blocks.push(currentBlock)
        }

        const language = line.replace(/```\s*/, '') || 'text'
        currentBlock = {
          type: 'code',
          content: '',
          attrs: { language }
        }
        currentContent = []
      } else if (line.trim() === '') {
        // 空行，结束当前块
        if (currentBlock && currentContent.length > 0) {
          currentBlock.content = currentContent.join('\n').trim()
          blocks.push(currentBlock)
          currentBlock = null
          currentContent = []
        }
      } else {
        // 普通内容
        if (!currentBlock) {
          currentBlock = { type: 'paragraph', content: '' }
          currentContent = []
        }
        currentContent.push(line)
      }
    }

    // 处理最后一个块
    if (currentBlock && currentContent.length > 0) {
      currentBlock.content = currentContent.join('\n').trim()
      blocks.push(currentBlock)
    }

    return blocks.length > 0 ? blocks : [{ type: 'paragraph', content: contentWithoutFrontmatter.trim() }]
  }

  /**
   * 生成锚点链接
   */
  private generateAnchor(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
  }

  /**
   * 简单的 YAML 解析器（仅支持基本格式）
   */
  private parseYaml(yaml: string): Record<string, any> {
    const result: Record<string, any> = {}
    const lines = yaml.split('\n')

    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.*)$/)
      if (match) {
        const [, key, value] = match
        if (value.startsWith('"') && value.endsWith('"')) {
          result[key] = value.slice(1, -1)
        } else if (value === 'true') {
          result[key] = true
        } else if (value === 'false') {
          result[key] = false
        } else if (/^\d+$/.test(value)) {
          result[key] = parseInt(value, 10)
        } else if (value.startsWith('[') && value.endsWith(']')) {
          result[key] = value.slice(1, -1).split(',').map(item => item.trim())
        } else {
          result[key] = value
        }
      }
    }

    return result
  }

  /**
   * 标题转换
   */
  private titleCase(str: string): string {
    return str.replace(/\b\w/g, char => char.toUpperCase())
  }

  /**
   * 获取当前文件路径（占位符，实际使用时需要传入）
   */
  private getCurrentFilePath(): string {
    return ''
  }
}

/**
 * Docs 只读适配器类 (Singleton)
 */
export class DocsReadonlyAdapter {
  private static instance: DocsReadonlyAdapter | null = null
  private docsData: DocsData | null = null
  private validated: boolean = false
  private validationResult: ValidationResult | null = null
  private parsers: DocumentParser[] = []
  private config: any = null

  /**
   * 私有构造函数，防止外部实例化
   */
  private constructor(config?: any) {
    this.config = config || {
      docsPath: '../../packages/core/src/docs/',
      supportedFormats: ['md', 'mdx']
    }
    this.initializeParsers()
  }

  /**
   * 获取单例实例
   */
  static getInstance(config?: any): DocsReadonlyAdapter {
    if (!DocsReadonlyAdapter.instance) {
      DocsReadonlyAdapter.instance = new DocsReadonlyAdapter(config)
    }
    return DocsReadonlyAdapter.instance
  }

  /**
   * 初始化文档解析器
   */
  private initializeParsers(): void {
    this.parsers = [
      new MarkdownDocumentParser()
    ]
  }

  /**
   * 初始化 Docs 数据
   */
  private ensureInitialized(): void {
    if (!this.docsData) {
      try {
        this.docsData = this.loadDocsData()
        this.validated = false
        this.validationResult = null
      } catch (error) {
        throw new DataError(
          DataErrorCode.CONFIG_ERROR,
          `Failed to initialize Docs: ${error instanceof Error ? error.message : 'Unknown error'}`,
          { error }
        )
      }
    }
  }

  /**
   * 加载文档数据
   */
  private loadDocsData(): DocsData {
    try {
      const docsPath = this.resolvePath(this.config.docsPath)
      const index = this.buildDocumentIndex(docsPath)
      const content = this.loadDocumentContents(docsPath, index)
      const categories = this.extractCategories(index)

      return {
        index,
        content,
        categories,
        lastUpdated: new Date().toISOString()
      }
    } catch (error) {
      throw new DataError(
        DataErrorCode.NOT_FOUND,
        `Failed to load docs data from ${this.config.docsPath}`,
        { error }
      )
    }
  }

  /**
   * 构建文档索引
   */
  private buildDocumentIndex(docsPath: string): DocIndexItem[] {
    const index: DocIndexItem[] = []

    try {
      this.scanDirectory(docsPath, index)
      return index
    } catch (error) {
      throw new DataError(
        DataErrorCode.NOT_FOUND,
        `Failed to build document index from ${docsPath}`,
        { error }
      )
    }
  }

  /**
   * 递归扫描文档目录
   */
  private scanDirectory(dirPath: string, index: DocIndexItem[], relativePath: string = ''): void {
    try {
      const items = readdirSync(dirPath)

      for (const item of items) {
        const itemPath = join(dirPath, item)
        const stat = statSync(itemPath)
        const itemRelativePath = relativePath ? join(relativePath, item) : item

        if (stat.isDirectory()) {
          this.scanDirectory(itemPath, index, itemRelativePath)
        } else if (stat.isFile()) {
          const ext = extname(item).toLowerCase()
          if (this.isSupportedFormat(ext)) {
            try {
              const content = this.parseDocument(itemPath)
              const slug = this.generateSlug(itemRelativePath)
              const excerpt = this.extractExcerpt(content)

              index.push({
                slug,
                metadata: content.metadata,
                excerpt
              })
            } catch (error) {
              console.warn(`Failed to parse document ${itemPath}:`, error)
            }
          }
        }
      }
    } catch (error) {
      throw new DataError(
        DataErrorCode.NOT_FOUND,
        `Failed to scan directory ${dirPath}`,
        { error }
      )
    }
  }

  /**
   * 加载文档内容
   */
  private loadDocumentContents(docsPath: string, index: DocIndexItem[]): Record<string, DocContent> {
    const content: Record<string, DocContent> = {}

    for (const item of index) {
      try {
        const filePath = this.resolvePath(join(docsPath, `${item.slug}.md`))
        const docContent = this.parseDocument(filePath)
        content[item.slug] = docContent
      } catch (error) {
        console.warn(`Failed to load content for ${item.slug}:`, error)
      }
    }

    return content
  }

  /**
   * 解析文档
   */
  private parseDocument(filePath: string): DocContent {
    const ext = extname(filePath).toLowerCase()
    const parser = this.parsers.find(p => p.supports(ext))

    if (!parser) {
      throw new DataError(
        DataErrorCode.PARSE_ERROR,
        `No parser found for file extension: ${ext}`,
        { filePath, extension: ext }
      )
    }

    return parser.parse(filePath)
  }

  /**
   * 检查是否为支持的格式
   */
  private isSupportedFormat(extension: string): boolean {
    return this.config.supportedFormats.some((format: string) =>
      `.${format}` === extension
    )
  }

  /**
   * 生成文档 slug
   */
  private generateSlug(filePath: string): string {
    return filePath
      .replace(/\.(md|mdx)$/i, '')
      .replace(/\\/g, '/')
      .replace(/\/+/g, '/')
  }

  /**
   * 提取文档摘要
   */
  private extractExcerpt(content: DocContent): string {
    const firstParagraph = content.content.find(block => block.type === 'paragraph')
    if (firstParagraph && typeof firstParagraph.content === 'string') {
      return firstParagraph.content.substring(0, 150) + (firstParagraph.content.length > 150 ? '...' : '')
    }
    return content.metadata.description || ''
  }

  /**
   * 提取文档分类
   */
  private extractCategories(index: DocIndexItem[]): DocCategory[] {
    const categories = new Set<DocCategory>()

    for (const item of index) {
      if (item.metadata.category) {
        categories.add(item.metadata.category)
      }
    }

    return Array.from(categories).sort()
  }

  /**
   * 解析路径
   */
  private resolvePath(path: string): string {
    if (path.startsWith('../')) {
      return join(process.cwd(), path)
    }
    return path
  }

  // ============================================================================
  // 公共 API 方法
  // ============================================================================

  /**
   * 获取所有文档数据
   */
  getDocsData(): DocsData {
    this.ensureInitialized()
    return this.docsData!
  }

  /**
   * 获取文档索引
   */
  getDocumentIndex(): DocIndexItem[] {
    this.ensureInitialized()
    return this.docsData!.index
  }

  /**
   * 获取文档内容
   */
  getDocumentContent(slug: string): DocContent | undefined {
    this.ensureInitialized()
    return this.docsData!.content[slug]
  }

  /**
   * 按分类获取文档
   */
  getDocumentsByCategory(category: DocCategory): DocIndexItem[] {
    this.ensureInitialized()
    return this.docsData!.index.filter(doc => doc.metadata.category === category)
  }

  /**
   * 搜索文档
   */
  searchDocuments(query: string): DocIndexItem[] {
    this.ensureInitialized()
    const lowerQuery = query.toLowerCase()

    return this.docsData!.index.filter(doc =>
      doc.metadata.title.toLowerCase().includes(lowerQuery) ||
      doc.metadata.description.toLowerCase().includes(lowerQuery) ||
      doc.metadata.tags?.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
      doc.excerpt?.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * 按标签获取文档
   */
  getDocumentsByTag(tag: string): DocIndexItem[] {
    this.ensureInitialized()
    return this.docsData!.index.filter(doc =>
      doc.metadata.tags?.includes(tag)
    )
  }

  /**
   * 获取所有分类
   */
  getCategories(): DocCategory[] {
    this.ensureInitialized()
    return this.docsData!.categories
  }

  /**
   * 获取相关文档
   */
  getRelatedDocuments(slug: string, limit: number = 5): DocIndexItem[] {
    this.ensureInitialized()
    const doc = this.docsData!.content[slug]

    if (!doc || !doc.related || doc.related.length === 0) {
      return []
    }

    return doc.related
      .map(relatedSlug => this.docsData!.index.find(d => d.slug === relatedSlug))
      .filter(Boolean)
      .slice(0, limit) as DocIndexItem[]
  }

  /**
   * 验证文档数据一致性
   */
  validateConsistency(): ValidationResult {
    this.ensureInitialized()

    // 如果已经验证过，直接返回缓存结果
    if (this.validated && this.validationResult) {
      return this.validationResult
    }

    const errors: ValidationError[] = []
    const warnings: ValidationWarning[] = []

    try {
      // 使用 Zod Schema 验证整体结构
      const parseResult = DocsDataSchema.safeParse(this.docsData)

      if (!parseResult.success) {
        parseResult.error.issues.forEach((zodError) => {
          errors.push({
            path: zodError.path.join('.'),
            message: zodError.message,
            code: zodError.code,
          })
        })
      }

      // 额外的业务逻辑验证
      this.validateDocumentIndex(errors, warnings)
      this.validateDocumentContent(errors, warnings)
      this.validateCategories(errors, warnings)

      this.validationResult = {
        valid: errors.length === 0,
        errors,
        warnings,
      }

      this.validated = true
      return this.validationResult
    } catch (error) {
      errors.push({
        path: 'docs',
        message: `Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        code: 'VALIDATION_ERROR',
      })

      this.validationResult = {
        valid: false,
        errors,
        warnings,
      }

      return this.validationResult
    }
  }

  /**
   * 验证文档索引
   */
  private validateDocumentIndex(errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!this.docsData) return

    if (this.docsData.index.length === 0) {
      warnings.push({
        path: 'docs.index',
        message: 'No documents found in index'
      })
    }

    // 检查重复的 slug
    const slugs = this.docsData.index.map(doc => doc.slug)
    const duplicateSlugs = slugs.filter((slug, index) => slugs.indexOf(slug) !== index)

    if (duplicateSlugs.length > 0) {
      errors.push({
        path: 'docs.index',
        message: `Duplicate document slugs found: ${duplicateSlugs.join(', ')}`,
        code: 'DUPLICATE_SLUGS'
      })
    }

    // 验证每个索引项的元数据
    this.docsData.index.forEach((doc, index) => {
      if (!doc.metadata.title) {
        errors.push({
          path: `docs.index.${index}.metadata.title`,
          message: `Document missing title: ${doc.slug}`,
          code: 'MISSING_TITLE'
        })
      }

      if (!doc.metadata.category) {
        warnings.push({
          path: `docs.index.${index}.metadata.category`,
          message: `Document missing category: ${doc.slug}`
        })
      }
    })
  }

  /**
   * 验证文档内容
   */
  private validateDocumentContent(errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!this.docsData) return

    const indexSlugs = new Set(this.docsData.index.map(doc => doc.slug))
    const contentSlugs = new Set(Object.keys(this.docsData.content))

    // 检查内容缺失
    const missingContent = Array.from(indexSlugs).filter(slug => !contentSlugs.has(slug))
    if (missingContent.length > 0) {
      errors.push({
        path: 'docs.content',
        message: `Missing content for documents: ${missingContent.join(', ')}`,
        code: 'MISSING_CONTENT'
      })
    }

    // 检查多余的内容
    const orphanedContent = Array.from(contentSlugs).filter(slug => !indexSlugs.has(slug))
    if (orphanedContent.length > 0) {
      warnings.push({
        path: 'docs.content',
        message: `Orphaned content found: ${orphanedContent.join(', ')}`
      })
    }

    // 验证内容结构
    Object.entries(this.docsData.content).forEach(([slug, content]) => {
      if (!content.content || content.content.length === 0) {
        warnings.push({
          path: `docs.content.${slug}`,
          message: `Document has no content blocks: ${slug}`
        })
      }
    })
  }

  /**
   * 验证分类
   */
  private validateCategories(errors: ValidationError[], warnings: ValidationWarning[]): void {
    if (!this.docsData) return

    const validCategories = [
      'getting-started', 'components', 'design-tokens',
      'patterns', 'guidelines', 'migration', 'api-reference'
    ]

    this.docsData.index.forEach((doc, index) => {
      if (doc.metadata.category && !validCategories.includes(doc.metadata.category)) {
        warnings.push({
          path: `docs.index.${index}.metadata.category`,
          message: `Unknown category '${doc.metadata.category}' in document: ${doc.slug}`
        })
      }
    })
  }

  /**
   * 重置实例（主要用于测试）
   */
  static resetInstance(): void {
    DocsReadonlyAdapter.instance = null
  }

  /**
   * 清除缓存
   */
  clearCache(): void {
    this.docsData = null
    this.validated = false
    this.validationResult = null
  }
}

// ============================================================================
// 便捷导出
// ============================================================================

/**
 * 获取全局 Docs 适配器实例
 */
export function getDocsAdapter(): DocsReadonlyAdapter {
  return DocsReadonlyAdapter.getInstance()
}

/**
 * 全局只读 Docs 适配器实例
 * 便捷导出，直接使用 Singleton 模式
 */
export const readonlyDocs = DocsReadonlyAdapter.getInstance()