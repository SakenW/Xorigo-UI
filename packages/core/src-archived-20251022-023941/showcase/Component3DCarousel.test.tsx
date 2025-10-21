/**
 * Component3DCarousel 组件测试
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import Component3DCarousel from './Component3DCarousel'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
  },
}))

describe('Component3DCarousel', () => {
  it('renders without crashing', () => {
    render(<Component3DCarousel />)
    expect(screen.getByRole('generic')).toBeInTheDocument()
  })

  it('displays component names', () => {
    render(<Component3DCarousel />)
    expect(screen.getByText('Button')).toBeInTheDocument()
    expect(screen.getByText('Card')).toBeInTheDocument()
    expect(screen.getByText('Input')).toBeInTheDocument()
    expect(screen.getByText('Modal')).toBeInTheDocument()
    expect(screen.getByText('Table')).toBeInTheDocument()
    expect(screen.getByText('Form')).toBeInTheDocument()
  })

  it('displays component descriptions', () => {
    render(<Component3DCarousel />)
    expect(screen.getByText('灵活的按钮组件')).toBeInTheDocument()
    expect(screen.getByText('优雅的卡片容器')).toBeInTheDocument()
    expect(screen.getByText('强大的表单输入')).toBeInTheDocument()
    expect(screen.getByText('流畅的弹窗组件')).toBeInTheDocument()
    expect(screen.getByText('智能数据表格')).toBeInTheDocument()
    expect(screen.getByText('完整的表单方案')).toBeInTheDocument()
  })

  it('has navigation controls', () => {
    render(<Component3DCarousel />)
    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)
  })
})