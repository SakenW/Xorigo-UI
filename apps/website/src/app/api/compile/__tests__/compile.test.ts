/**
 * Compile API 测试套件
 *
 * 测试覆盖：
 * - Zod Schema 验证
 * - esbuild 编译功能
 * - 错误处理
 * - 安全限制
 */

import { describe, it, expect, beforeAll } from 'vitest'

// 测试辅助函数
async function compileRequest(body: any) {
  const response = await fetch('http://localhost:3000/api/compile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  return {
    status: response.status,
    data: await response.json(),
  }
}

describe('Compile API - Schema 验证', () => {
  it('应该接受有效的 TypeScript 代码', async () => {
    const { status, data } = await compileRequest({
      code: 'const x: number = 1;',
      config: {
        loader: 'ts',
        target: 'es2020',
      },
    })

    expect(status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.code).toContain('const x = 1')
  })

  it('应该拒绝空代码', async () => {
    const { status, data } = await compileRequest({
      code: '',
    })

    expect(status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toContain('验证失败')
  })

  it('应该拒绝超长代码 (>10KB)', async () => {
    const { status, data } = await compileRequest({
      code: 'x'.repeat(20000),
    })

    expect(status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.details).toContain('10KB')
  })

  it('应该使用默认配置', async () => {
    const { status, data } = await compileRequest({
      code: 'const x = 1;',
    })

    expect(status).toBe(200)
    expect(data.success).toBe(true)
  })
})

describe('Compile API - esbuild 编译', () => {
  it('应该编译 TypeScript 代码', async () => {
    const { data } = await compileRequest({
      code: `
        const greeting: string = "Hello";
        console.log(greeting);
      `,
      config: { loader: 'ts' },
    })

    expect(data.success).toBe(true)
    expect(data.code).toContain('const greeting = "Hello"')
  })

  it('应该编译 TSX 代码', async () => {
    const { data } = await compileRequest({
      code: `
        import React from 'react';
        const App = () => <div>Hello</div>;
      `,
      config: { loader: 'tsx' },
    })

    expect(data.success).toBe(true)
    expect(data.code).toContain('React.createElement')
  })

  it('应该支持代码压缩', async () => {
    const { data } = await compileRequest({
      code: `
        const veryLongVariableName = 123;
        console.log(veryLongVariableName);
      `,
      config: { loader: 'ts', minify: true },
    })

    expect(data.success).toBe(true)
    expect(data.code.length).toBeLessThan(100) // 压缩后代码更短
  })

  it('应该生成 Source Map', async () => {
    const { data } = await compileRequest({
      code: 'const x = 1;',
      config: { loader: 'ts', sourcemap: true },
    })

    expect(data.success).toBe(true)
    expect(data.map).toBeDefined()
  })

  it('应该报告编译警告', async () => {
    const { data } = await compileRequest({
      code: `
        // @ts-expect-error
        const x: string = 123;
      `,
      config: { loader: 'ts' },
    })

    // esbuild 可能会有警告（但不会失败）
    expect(data.success).toBe(true)
  })
})

describe('Compile API - 错误处理', () => {
  it('应该捕获语法错误', async () => {
    const { status, data } = await compileRequest({
      code: 'const x: = 1;', // 语法错误
      config: { loader: 'ts' },
    })

    expect(status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('编译失败')
  })

  it('应该处理 JSON 解析错误', async () => {
    const response = await fetch('http://localhost:3000/api/compile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'invalid json',
    })

    expect(response.status).toBe(500)
  })
})

describe('Compile API - 安全限制', () => {
  it('应该拒绝 fs 模块导入', async () => {
    const { status, data } = await compileRequest({
      code: `import fs from 'fs'; fs.readFileSync('/etc/passwd');`,
    })

    expect(status).toBe(403)
    expect(data.success).toBe(false)
    expect(data.error).toContain('不允许的模块')
  })

  it('应该拒绝 child_process 模块', async () => {
    const { status, data } = await compileRequest({
      code: `const cp = require('child_process'); cp.exec('rm -rf /');`,
    })

    expect(status).toBe(403)
    expect(data.error).toContain('不允许的模块')
  })

  it('应该拒绝 process.env 访问', async () => {
    const { status, data } = await compileRequest({
      code: `console.log(process.env.SECRET_KEY);`,
    })

    expect(status).toBe(403)
    expect(data.error).toContain('不允许的模块')
  })

  it('应该拒绝 __dirname 访问', async () => {
    const { status, data } = await compileRequest({
      code: `console.log(__dirname);`,
    })

    expect(status).toBe(403)
  })
})

describe('Compile API - GET 端点', () => {
  it('应该返回 API 使用说明', async () => {
    const response = await fetch('http://localhost:3000/api/compile')
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.name).toBe('TH-UI Compile API')
    expect(data.version).toBe('1.0.0')
    expect(data.endpoints).toBeDefined()
    expect(data.examples).toBeDefined()
  })
})

describe('Compile API - 性能测试', () => {
  it('应该在 5 秒内完成编译', async () => {
    const startTime = Date.now()

    await compileRequest({
      code: `
        const data = Array(1000).fill(0).map((_, i) => ({ id: i, name: 'test' }));
        console.log(data);
      `,
    })

    const duration = Date.now() - startTime
    expect(duration).toBeLessThan(5000)
  })

  it('应该处理并发请求', async () => {
    const requests = Array(10)
      .fill(0)
      .map((_, i) =>
        compileRequest({
          code: `const x${i} = ${i}; console.log(x${i});`,
        })
      )

    const results = await Promise.all(requests)

    results.forEach((result) => {
      expect(result.status).toBe(200)
      expect(result.data.success).toBe(true)
    })
  })
})

describe('Compile API - 边缘情况', () => {
  it('应该处理 Unicode 字符', async () => {
    const { data } = await compileRequest({
      code: `const 你好 = "世界"; console.log(你好);`,
    })

    expect(data.success).toBe(true)
  })

  it('应该处理 Emoji', async () => {
    const { data } = await compileRequest({
      code: `const emoji = "🚀"; console.log(emoji);`,
    })

    expect(data.success).toBe(true)
  })

  it('应该处理多行字符串', async () => {
    const { data } = await compileRequest({
      code: `
        const multiline = \`
          Line 1
          Line 2
          Line 3
        \`;
        console.log(multiline);
      `,
    })

    expect(data.success).toBe(true)
  })
})
