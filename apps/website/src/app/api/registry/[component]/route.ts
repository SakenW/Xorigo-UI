/**
 * Registry API - 组件详情查询
 * GET /api/registry/[component]
 *
 * 功能：
 * - 根据组件名称获取详情
 * - 返回完整的组件元数据
 * - 包含代码、依赖、文档等信息
 *
 * 技术栈：
 * - Next.js 15 Dynamic Route Handlers
 * - Zod 验证
 * - @th-ui/registry 包
 */

import { NextRequest, NextResponse } from 'next/server'
import { generateRegistry, type Component } from '@th-ui/registry'
import { ComponentParamsSchema, type ComponentParams, type ApiResponse } from '../types'
import { createSuccessResponse, createErrorResponse } from '../utils'

/**
 * GET 处理器 - 获取组件详情
 *
 * Path Parameters:
 * - component: string (组件名称，如 'Button', 'Card')
 *
 * Response:
 * {
 *   status: 'success' | 'error',
 *   data?: Component,
 *   error?: { message, code, details },
 *   meta: { timestamp, version }
 * }
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<ComponentParams> }
): Promise<NextResponse<ApiResponse>> {
  try {
    // 1. 解析路径参数 (Next.js 15 要求 await params)
    const params = await context.params

    // 2. Zod 验证路径参数
    const validationResult = ComponentParamsSchema.safeParse(params)

    if (!validationResult.success) {
      return NextResponse.json(
        createErrorResponse(
          '路径参数验证失败',
          'VALIDATION_ERROR',
          validationResult.error.issues
        ),
        { status: 400 }
      )
    }

    const { component: componentName } = validationResult.data

    // 3. 生成注册表
    const registry = generateRegistry()

    // 4. 查找组件
    const component = registry.components.find((c: Component) => c.name === componentName)

    if (!component) {
      return NextResponse.json(
        createErrorResponse(
          `组件 '${componentName}' 未找到`,
          'NOT_FOUND',
          {
            availableComponents: registry.components.map((c: Component) => c.name),
          }
        ),
        { status: 404 }
      )
    }

    // 5. 返回组件详情
    return NextResponse.json(
      createSuccessResponse({
        component,
        registry: {
          version: registry.version,
          tokens: registry.tokens,
          themes: registry.themes,
        },
      }),
      { status: 200 }
    )
  } catch (error) {
    // 6. 错误处理
    console.error('Component API Error:', error)

    return NextResponse.json(
      createErrorResponse(
        error instanceof Error ? error.message : '内部服务器错误',
        'INTERNAL_ERROR',
        error instanceof Error ? { stack: error.stack } : undefined
      ),
      { status: 500 }
    )
  }
}

/**
 * OPTIONS 处理器 - CORS 预检
 */
export async function OPTIONS(): Promise<NextResponse> {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}
