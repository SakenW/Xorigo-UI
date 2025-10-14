/**
 * @fileoverview 健康检查 API 端点
 */
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    port: process.env.PORT || 3100,
    version: '0.1.0',
    services: {
      website: 'running',
      dataLayer: 'connected',
      playground: 'ready'
    }
  })
}

export const dynamic = 'force-dynamic'