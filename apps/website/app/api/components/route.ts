/**
 * 组件注册系统 REST API
 * 提供组件查询、搜索、统计等API接口
 */

import { NextRequest, NextResponse } from 'next/server'

// 模拟数据
const mockComponents = [
  {
    id: 'button',
    name: 'Button',
    displayName: 'Button',
    description: '基础按钮组件',
    category: 'primitives',
    tags: ['基础', '按钮'],
    version: '1.0.0',
    props: [],
    examples: []
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    
    let components = [...mockComponents]
    
    if (category) {
      components = components.filter(c => c.category === category)
    }
    
    if (search) {
      const lower = search.toLowerCase()
      components = components.filter(c => 
        c.name.toLowerCase().includes(lower) ||
        c.description.toLowerCase().includes(lower)
      )
    }

    return NextResponse.json({
      success: true,
      data: components
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body
    
    let components = [...mockComponents]
    
    if (query) {
      const lower = query.toLowerCase()
      components = components.filter(c => 
        c.name.toLowerCase().includes(lower)
      )
    }

    return NextResponse.json({
      success: true,
      data: components
    })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Unknown error' },
      { status: 500 }
    )
  }
}
