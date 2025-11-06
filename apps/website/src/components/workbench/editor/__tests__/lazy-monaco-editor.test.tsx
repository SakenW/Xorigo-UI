/**
 * 懒加载 Monaco 编辑器测试
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { LazyMonacoEditor } from '../lazy-monaco-editor'

describe('LazyMonacoEditor', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders loader initially', () => {
    render(
      <LazyMonacoEditor
        value="test"
        config={{ language: 'typescript' }}
        height={500}
      />
    )

    expect(screen.getByText(/正在加载 Monaco 编辑器/)).toBeInTheDocument()
  })
})
