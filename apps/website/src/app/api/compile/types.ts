/**
 * Compile API 类型定义
 */

/**
 * 编译请求配置
 */
export interface CompileConfig {
  /** 代码加载器类型 */
  loader?: 'tsx' | 'ts' | 'jsx' | 'js'
  /** 编译目标 ECMAScript 版本 */
  target?: 'es2020' | 'esnext' | 'es2015'
  /** 是否压缩代码 */
  minify?: boolean
  /** 是否生成 Source Map */
  sourcemap?: boolean
}

/**
 * 编译请求体
 */
export interface CompileRequest {
  /** 源代码 (1-10000 字符) */
  code: string
  /** 编译配置 (可选) */
  config?: CompileConfig
}

/**
 * 编译成功响应
 */
export interface CompileSuccessResponse {
  /** 编译是否成功 */
  success: true
  /** 编译后的 JavaScript 代码 */
  code: string
  /** Source Map (如果启用) */
  map?: string
  /** 编译警告 */
  warnings?: string[]
}

/**
 * 编译失败响应
 */
export interface CompileErrorResponse {
  /** 编译是否成功 */
  success: false
  /** 错误信息 */
  error: string
  /** 详细错误描述 */
  details?: string
}

/**
 * 编译响应 (联合类型)
 */
export type CompileResponse = CompileSuccessResponse | CompileErrorResponse

/**
 * API 使用说明响应
 */
export interface CompileAPIInfo {
  name: string
  version: string
  description: string
  endpoints: {
    POST: {
      path: string
      body: {
        code: string
        config?: CompileConfig
      }
      response: CompileResponse
    }
  }
  limits: {
    maxCodeLength: string
    compileTimeout: string
  }
  security: {
    restrictions: string[]
  }
  examples: {
    typescript: {
      code: string
      config: CompileConfig
    }
    tsx: {
      code: string
      config: CompileConfig
    }
  }
}
