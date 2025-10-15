/**
 * 文本搜索引擎
 * 提供基础文本匹配、模糊搜索和高亮功能
 */

import type { ComponentInfo } from '@/data/component-classification'
import type { ComponentMatch, SearchQuery } from './types'

/**
 * 文本搜索配置
 */
interface TextSearchConfig {
  /** 模糊搜索阈值 */
  fuzzyThreshold: number
  /** 启用拼音搜索 */
  enablePinyinSearch: boolean
  /** 权重配置 */
  weights: {
    nameMatch: number
    descriptionMatch: number
    propMatch: number
    variantMatch: number
    categoryMatch: number
  }
}

/**
 * 文本搜索结果
 */
interface TextSearchResult {
  component: ComponentInfo
  score: number
  highlights: {
    name: string[]
    description: string[]
    props: string[]
  }
}

/**
 * 简单的拼音转换映射（实际项目中建议使用专业库）
 */
const PINYIN_MAP: Record<string, string> = {
  '按': 'an',
  '钮': 'niu',
  '按': 'an',
  '钮': 'niu',
  // 这里只做示例，实际应该使用完整的拼音库
}

/**
 * 文本搜索引擎类
 */
export class TextSearchEngine {
  private config: TextSearchConfig
  private componentIndex: Map<string, ComponentInfo> = new Map()

  constructor(config?: Partial<TextSearchConfig>) {
    this.config = {
      fuzzyThreshold: 0.8,
      enablePinyinSearch: true,
      weights: {
        nameMatch: 0.4,
        descriptionMatch: 0.3,
        propMatch: 0.2,
        variantMatch: 0.05,
        categoryMatch: 0.05
      },
      ...config
    }
  }

  /**
   * 构建搜索索引
   */
  buildIndex(components: ComponentInfo[]): void {
    this.componentIndex.clear()
    for (const component of components) {
      this.componentIndex.set(component.name, component)
    }
  }

  /**
   * 执行文本搜索
   */
  search(query: string): ComponentMatch[] {
    if (!query.trim()) return []

    const searchTerms = this.parseQuery(query)
    const results: ComponentMatch[] = []

    for (const [name, component] of this.componentIndex) {
      const result = this.searchComponent(component, searchTerms)
      if (result.score > 0) {
        results.push({
          component,
          score: result.score,
          matchType: this.determineMatchType(result.score),
          highlights: result.highlights,
          relatedComponents: this.findRelatedComponents(component),
          usageStats: this.getUsageStats(component.name),
          matchReasons: this.generateMatchReasons(result),
          confidence: Math.min(result.score, 100)
        })
      }
    }

    return results.sort((a, b) => b.score - a.score)
  }

  /**
   * 解析搜索查询
   */
  private parseQuery(query: string): string[] {
    // 分词处理（简单实现，实际项目中建议使用专业分词库）
    const terms = query
      .toLowerCase()
      .replace(/[^\w\s\u4e00-\u9fff]/g, ' ') // 保留中文、英文、数字
      .split(/\s+/)
      .filter(term => term.length > 0)

    // 如果启用拼音搜索，添加拼音映射
    if (this.config.enablePinyinSearch) {
      const pinyinTerms: string[] = []
      for (const term of terms) {
        // 简单的拼音转换（实际应该使用专业库）
        const pinyin = this.convertToPinyin(term)
        if (pinyin && pinyin !== term) {
          pinyinTerms.push(pinyin)
        }
      }
      terms.push(...pinyinTerms)
    }

    return [...new Set(terms)] // 去重
  }

  /**
   * 搜索单个组件
   */
  private searchComponent(component: ComponentInfo, searchTerms: string[]): TextSearchResult {
    let totalScore = 0
    const highlights = {
      name: [] as string[],
      description: [] as string[],
      props: [] as string[]
    }

    // 名称匹配
    const nameScore = this.searchInText(component.name, searchTerms)
    if (nameScore.score > 0) {
      totalScore += nameScore.score * this.config.weights.nameMatch
      highlights.name = nameScore.matches
    }

    // 描述匹配
    const descriptionScore = this.searchInText(component.description, searchTerms)
    if (descriptionScore.score > 0) {
      totalScore += descriptionScore.score * this.config.weights.descriptionMatch
      highlights.description = descriptionScore.matches
    }

    // 属性匹配
    let propScore = 0
    if (component.props) {
      for (const prop of component.props) {
        const propMatchScore = this.searchInText(prop, searchTerms)
        if (propMatchScore.score > 0) {
          propScore = Math.max(propScore, propMatchScore.score)
          if (!highlights.props.includes(prop)) {
            highlights.props.push(prop)
          }
        }
      }
    }
    if (propScore > 0) {
      totalScore += propScore * this.config.weights.propMatch
    }

    // 变体匹配
    let variantScore = 0
    if (component.variants) {
      for (const variant of component.variants) {
        const variantMatchScore = this.searchInText(variant, searchTerms)
        if (variantMatchScore.score > 0) {
          variantScore = Math.max(variantScore, variantMatchScore.score)
        }
      }
    }
    if (variantScore > 0) {
      totalScore += variantScore * this.config.weights.variantMatch
    }

    // 分类匹配
    const categoryScore = this.searchInText(component.category, searchTerms)
    if (categoryScore.score > 0) {
      totalScore += categoryScore.score * this.config.weights.categoryMatch
    }

    return {
      component,
      score: Math.min(totalScore, 100),
      highlights
    }
  }

  /**
   * 在文本中搜索关键词
   */
  private searchInText(text: string, searchTerms: string[]): { score: number; matches: string[] } {
    const lowerText = text.toLowerCase()
    let maxScore = 0
    const matches: string[] = []

    for (const term of searchTerms) {
      if (lowerText.includes(term)) {
        // 精确匹配得分最高
        const exactScore = 100
        if (exactScore > maxScore) {
          maxScore = exactScore
        }
        matches.push(term)
      } else {
        // 模糊匹配
        const fuzzyScore = this.calculateFuzzyScore(lowerText, term)
        if (fuzzyScore >= this.config.fuzzyThreshold) {
          const score = fuzzyScore * 80 // 模糊匹配得分稍低
          if (score > maxScore) {
            maxScore = score
          }
          matches.push(term)
        }
      }
    }

    return { score: maxScore, matches }
  }

  /**
   * 计算模糊匹配分数（使用简化的编辑距离算法）
   */
  private calculateFuzzyScore(text: string, term: string): number {
    if (term.length === 0) return 0
    if (text.length === 0) return 0

    const distance = this.levenshteinDistance(text, term)
    const maxLength = Math.max(text.length, term.length)

    return 1 - (distance / maxLength)
  }

  /**
   * 计算编辑距离
   */
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() =>
      Array(str1.length + 1).fill(null)
    )

    for (let i = 0; i <= str1.length; i++) {
      matrix[0][i] = i
    }

    for (let j = 0; j <= str2.length; j++) {
      matrix[j][0] = j
    }

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        )
      }
    }

    return matrix[str2.length][str1.length]
  }

  /**
   * 简单的拼音转换（示例实现）
   */
  private convertToPinyin(text: string): string {
    return text.split('').map(char => PINYIN_MAP[char] || char).join('')
  }

  /**
   * 确定匹配类型
   */
  private determineMatchType(score: number): 'exact' | 'partial' {
    return score >= 90 ? 'exact' : 'partial'
  }

  /**
   * 查找相关组件
   */
  private findRelatedComponents(component: ComponentInfo): string[] {
    const related: string[] = []

    // 同分类的其他组件
    for (const [name, comp] of this.componentIndex) {
      if (comp.category === component.category && name !== component.name) {
        related.push(name)
      }
    }

    // 限制返回数量
    return related.slice(0, 5)
  }

  /**
   * 获取使用统计（模拟数据）
   */
  private getUsageStats(componentName: string) {
    // 这里应该从实际数据源获取，暂时返回模拟数据
    return {
      frequency: Math.floor(Math.random() * 100) + 10,
      recentUsage: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
      userRating: Math.random() * 2 + 3, // 3-5分
      trending: Math.random() > 0.7
    }
  }

  /**
   * 生成匹配原因
   */
  private generateMatchReasons(result: TextSearchResult): string[] {
    const reasons: string[] = []

    if (result.highlights.name.length > 0) {
      reasons.push('名称匹配')
    }
    if (result.highlights.description.length > 0) {
      reasons.push('描述匹配')
    }
    if (result.highlights.props.length > 0) {
      reasons.push('属性匹配')
    }

    return reasons
  }

  /**
   * 获取搜索建议
   */
  getSuggestions(partial: string): string[] {
    if (partial.length < 2) return []

    const suggestions: string[] = []
    const lowerPartial = partial.toLowerCase()

    // 从组件名称中获取建议
    for (const [name] of this.componentIndex) {
      if (name.toLowerCase().startsWith(lowerPartial)) {
        suggestions.push(name)
      }
    }

    // 从分类中获取建议
    const categories = [...new Set(Array.from(this.componentIndex.values()).map(c => c.category))]
    for (const category of categories) {
      if (category.toLowerCase().startsWith(lowerPartial)) {
        suggestions.push(category)
      }
    }

    return suggestions.slice(0, 10) // 限制建议数量
  }
}