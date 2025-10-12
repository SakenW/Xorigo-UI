import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import * as esbuild from 'esbuild'

/**
 * 在线代码编译 API
 *
 * 功能：
 * - 接收 TypeScript/TSX 代码
 * - 使用 esbuild 编译为 JavaScript
 * - 返回编译结果或错误信息
 *
 * 安全限制：
 * - 代码长度限制 < 10KB
 * - 编译超时限制 5 秒
 * - 仅编译，不执行代码
 */

// ============================================
// 1. Zod Schema 验证
// ============================================

/**
 * 请求体 Schema
 * - code: 必需的字符串，长度 1-10000 字符
 * - config: 可选的编译配置对象
 */
const CompileRequestSchema = z.object({
  code: z
    .string()
    .min(1, '代码不能为空')
    .max(10000, '代码长度不能超过 10KB'),
  config: z
    .object({
      loader: z.enum(['tsx', 'ts', 'jsx', 'js']).optional().default('tsx'),
      target: z.enum(['es2020', 'esnext', 'es2015']).optional().default('es2020'),
      minify: z.boolean().optional().default(false),
      sourcemap: z.boolean().optional().default(false),
    })
    .optional()
    .default({
      loader: 'tsx',
      target: 'es2020',
      minify: false,
      sourcemap: false,
    }),
})

type CompileRequest = z.infer<typeof CompileRequestSchema>

/**
 * 编译成功响应类型
 */
interface CompileSuccessResponse {
  success: true
  code: string
  map?: string
  warnings?: string[]
}

/**
 * 编译失败响应类型
 */
interface CompileErrorResponse {
  success: false
  error: string
  details?: string
}

type CompileResponse = CompileSuccessResponse | CompileErrorResponse

// ============================================
// 2. 编译核心逻辑
// ============================================

/**
 * 使用 esbuild 编译代码
 *
 * @param code - 源代码
 * @param config - 编译配置
 * @returns 编译结果
 */
async function compileCode(
  code: string,
  config: NonNullable<CompileRequest['config']>
): Promise<CompileResponse> {
  try {
    // 设置编译超时
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('编译超时（5秒限制）')), 5000)
    })

    // esbuild transform 编译
    const compilePromise = esbuild.transform(code, {
      loader: config.loader || 'tsx',
      target: config.target || 'es2020',
      minify: config.minify || false,
      sourcemap: config.sourcemap || false,
      jsx: 'transform', // 使用经典 JSX 转换
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
      format: 'esm', // 输出 ES Module
      // 支持 TypeScript 特性
      tsconfigRaw: {
        compilerOptions: {
          jsx: 'react',
          esModuleInterop: true,
          allowSyntheticDefaultImports: true,
        },
      },
    })

    // 竞态执行：编译或超时
    const result = await Promise.race([compilePromise, timeoutPromise])

    return {
      success: true,
      code: result.code,
      map: result.map || undefined,
      warnings: result.warnings.length > 0
        ? result.warnings.map(w => w.text)
        : undefined,
    }
  } catch (error) {
    // 捕获编译错误
    if (error instanceof Error) {
      return {
        success: false,
        error: '编译失败',
        details: error.message,
      }
    }

    return {
      success: false,
      error: '未知编译错误',
      details: String(error),
    }
  }
}

// ============================================
// 3. API Route Handler
// ============================================

/**
 * POST /api/compile
 *
 * 接收代码编译请求
 *
 * @example
 * ```typescript
 * fetch('/api/compile', {
 *   method: 'POST',
 *   headers: { 'Content-Type': 'application/json' },
 *   body: JSON.stringify({
 *     code: 'const x: number = 1; console.log(x);',
 *     config: { loader: 'ts', target: 'es2020' }
 *   })
 * })
 * ```
 */
export async function POST(request: NextRequest): Promise<NextResponse<CompileResponse>> {
  try {
    // 1. 解析请求体
    const body = await request.json()

    // 2. Zod 验证
    const parseResult = CompileRequestSchema.safeParse(body)

    if (!parseResult.success) {
      // 验证失败，返回详细错误信息
      const firstError = parseResult.error.issues[0]
      return NextResponse.json(
        {
          success: false,
          error: '请求参数验证失败',
          details: `${firstError.path.join('.')}: ${firstError.message}`,
        } as CompileErrorResponse,
        { status: 400 }
      )
    }

    const { code, config } = parseResult.data

    // 3. 安全检查：防止恶意代码模式
    const dangerousPatterns = [
      /require\s*\(\s*['"]child_process['"]\s*\)/,
      /require\s*\(\s*['"]fs['"]\s*\)/,
      /require\s*\(\s*['"]net['"]\s*\)/,
      /import\s+.*\s+from\s+['"]child_process['"]/,
      /import\s+.*\s+from\s+['"]fs['"]/,
      /import\s+.*\s+from\s+['"]net['"]/,
      /process\.env/,
      /__dirname/,
      /__filename/,
    ]

    for (const pattern of dangerousPatterns) {
      if (pattern.test(code)) {
        return NextResponse.json(
          {
            success: false,
            error: '代码包含不允许的模块或操作',
            details: '出于安全考虑，禁止使用 Node.js 内置模块',
          } as CompileErrorResponse,
          { status: 403 }
        )
      }
    }

    // 4. 执行编译
    const result = await compileCode(code, config)

    // 5. 返回结果
    if (result.success) {
      return NextResponse.json(result, { status: 200 })
    } else {
      return NextResponse.json(result, { status: 400 })
    }
  } catch (error) {
    // 顶层错误捕获
    console.error('Compile API Error:', error)

    return NextResponse.json(
      {
        success: false,
        error: '服务器内部错误',
        details: error instanceof Error ? error.message : String(error),
      } as CompileErrorResponse,
      { status: 500 }
    )
  }
}

/**
 * GET /api/compile
 *
 * 返回 API 使用说明
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    name: 'TH-UI Compile API',
    version: '1.0.0',
    description: '在线代码编译服务（TypeScript/TSX → JavaScript）',
    endpoints: {
      POST: {
        path: '/api/compile',
        body: {
          code: 'string (required, 1-10000 chars)',
          config: {
            loader: 'tsx | ts | jsx | js (default: tsx)',
            target: 'es2020 | esnext | es2015 (default: es2020)',
            minify: 'boolean (default: false)',
            sourcemap: 'boolean (default: false)',
          },
        },
        response: {
          success: 'boolean',
          code: 'string (if success)',
          map: 'string (if sourcemap enabled)',
          warnings: 'string[] (if any)',
          error: 'string (if failed)',
          details: 'string (error details)',
        },
      },
    },
    limits: {
      maxCodeLength: '10KB',
      compileTimeout: '5 seconds',
    },
    security: {
      restrictions: [
        'Node.js 内置模块禁用',
        '仅编译不执行代码',
        '代码长度限制',
        '编译时间限制',
      ],
    },
    examples: {
      typescript: {
        code: 'const greeting: string = "Hello"; console.log(greeting);',
        config: { loader: 'ts', target: 'es2020' },
      },
      tsx: {
        code: 'import React from "react"; const App = () => <div>Hello</div>;',
        config: { loader: 'tsx', target: 'es2020' },
      },
    },
  })
}
