/**
 * Templates 模块类型定义
 * 定义模板系统的完整数据结构
 */

// 模板分类
export type TemplateCategory = 'starter' | 'application' | 'industry'

// 模板技术栈
export interface TemplateTech {
  name: string
  version?: string
  icon?: string
  category: 'frontend' | 'backend' | 'database' | 'deployment' | 'styling' | 'animation'
}

// 模板特性
export interface TemplateFeature {
  name: string
  description: string
  included: boolean
}

// 模板文件结构
export interface TemplateFile {
  name: string
  path: string
  type: 'file' | 'directory'
  content?: string
  children?: TemplateFile[]
}

// 模板统计数据
export interface TemplateStats {
  downloads: number
  stars: number
  forks: number
  lastUpdated: string
}

// 模板信息
export interface Template {
  id: string
  name: string
  category: TemplateCategory
  description: string
  longDescription?: string
  preview: string
  technologies: TemplateTech[]
  features: TemplateFeature[]
  files?: TemplateFile[]
  githubRepo?: string
  demoUrl?: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  estimatedTime: string
  stats: TemplateStats
  tags: string[]
  author: {
    name: string
    avatar?: string
    url?: string
  }
}

// 模板筛选参数
export interface TemplateFilters {
  category?: TemplateCategory | 'all'
  difficulty?: 'all' | 'beginner' | 'intermediate' | 'advanced'
  technologies?: string[]
  search?: string
}

// 模板下载选项
export type DownloadOption = 'github' | 'zip' | 'cli'

// CLI 命令配置
export interface CliCommand {
  template: string
  options: {
    name?: string
    typescript?: boolean
    tailwind?: boolean
    eslint?: boolean
    appDir?: boolean
    srcDir?: boolean
    importAlias?: string
  }
}