/**
 * Alert 组件单元测试
 * 测试 Alert 组件的所有功能：基础渲染、变体、交互、可访问性等
 */

import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import '@testing-library/jest-dom'

// 导入 Alert 组件
import {
  Alert,
  AlertDescription,
  AlertTitle,
  AlertAction,
  alertVariants
} from '../alert'

// 扩展 Jest 匹配器
expect.extend(toHaveNoViolations)

// 模拟 cn 工具函数
vi.mock('../../../foundations/utils/cn', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' ')
}))

describe('Alert 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('基础渲染测试', () => {
    it('应该正确渲染基础 Alert 组件', () => {
      render(
        <Alert>
          <AlertTitle>提示标题</AlertTitle>
          <AlertDescription>这是一个提示信息</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
      expect(screen.getByText('提示标题')).toBeInTheDocument()
      expect(screen.getByText('这是一个提示信息')).toBeInTheDocument()
    })

    it('应该支持自定义 className', () => {
      render(
        <Alert className="custom-alert-class">
          <AlertDescription>内容</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('custom-alert-class')
    })

    it('应该支持自定义样式', () => {
      render(
        <Alert style={{ marginTop: '20px' }}>
          <AlertDescription>内容</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveStyle('margin-top: 20px')
    })
  })

  describe('Alert 变体测试', () => {
    it('应该支持 default 变体', () => {
      render(
        <Alert variant="default">
          <AlertDescription>默认提示</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('border-border')
      expect(alert).toHaveClass('bg-background')
      expect(alert).toHaveClass('text-foreground')
    })

    it('应该支持 destructive 变体', () => {
      render(
        <Alert variant="destructive">
          <AlertDescription>错误提示</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('border-destructive')
      expect(alert).toHaveClass('bg-destructive')
      expect(alert).toHaveClass('text-destructive-foreground')
    })

    it('应该支持 warning 变体', () => {
      render(
        <Alert variant="warning">
          <AlertDescription>警告提示</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('border-yellow-200')
      expect(alert).toHaveClass('bg-yellow-50')
      expect(alert).toHaveClass('text-yellow-900')
    })

    it('应该支持 success 变体', () => {
      render(
        <Alert variant="success">
          <AlertDescription>成功提示</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('border-green-200')
      expect(alert).toHaveClass('bg-green-50')
      expect(alert).toHaveClass('text-green-900')
    })

    it('应该支持 info 变体', () => {
      render(
        <Alert variant="info">
          <AlertDescription>信息提示</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('border-blue-200')
      expect(alert).toHaveClass('bg-blue-50')
      expect(alert).toHaveClass('text-blue-900')
    })
  })

  describe('AlertTitle 组件测试', () => {
    it('应该正确渲染警告标题', () => {
      render(
        <Alert>
          <AlertTitle>重要提示</AlertTitle>
          <AlertDescription>提示详情</AlertDescription>
        </Alert>
      )

      const title = screen.getByText('重要提示')
      expect(title).toBeInTheDocument()
      expect(title.tagName).toBe('H5')
    })

    it('应该支持自定义 className', () => {
      render(
        <Alert>
          <AlertTitle className="custom-title-class">标题</AlertTitle>
          <AlertDescription>内容</AlertDescription>
        </Alert>
      )

      const title = screen.getByText('标题')
      expect(title).toHaveClass('custom-title-class')
    })
  })

  describe('AlertDescription 组件测试', () => {
    it('应该正确渲染警告描述', () => {
      render(
        <Alert>
          <AlertDescription>这是详细的警告描述信息</AlertDescription>
        </Alert>
      )

      const description = screen.getByText('这是详细的警告描述信息')
      expect(description).toBeInTheDocument()
      expect(description.tagName).toBe('DIV')
    })

    it('应该支持自定义 className', () => {
      render(
        <Alert>
          <AlertDescription className="custom-description-class">
            描述内容
          </AlertDescription>
        </Alert>
      )

      const description = screen.getByText('描述内容')
      expect(description).toHaveClass('custom-description-class')
    })
  })

  describe('AlertAction 组件测试', () => {
    it('应该正确渲染警告操作按钮', () => {
      const handleClick = vi.fn()
      render(
        <Alert>
          <AlertDescription>需要用户确认的操作</AlertDescription>
          <AlertAction onClick={handleClick}>确认</AlertAction>
        </Alert>
      )

      const button = screen.getByRole('button', { name: '确认' })
      expect(button).toBeInTheDocument()

      fireEvent.click(button)
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('应该支持自定义 className', () => {
      render(
        <Alert>
          <AlertDescription>内容</AlertDescription>
          <AlertAction className="custom-action-class">操作</AlertAction>
        </Alert>
      )

      const button = screen.getByRole('button', { name: '操作' })
      expect(button).toHaveClass('custom-action-class')
    })

    it('应该支持禁用状态', () => {
      const handleClick = vi.fn()
      render(
        <Alert>
          <AlertDescription>内容</AlertDescription>
          <AlertAction disabled onClick={handleClick}>
            禁用操作
          </AlertAction>
        </Alert>
      )

      const button = screen.getByRole('button', { name: '禁用操作' })
      expect(button).toBeDisabled()

      fireEvent.click(button)
      expect(handleClick).not.toHaveBeenCalled()
    })
  })

  describe('组合组件测试', () => {
    it('应该正确组合完整的 Alert 组件', () => {
      const handleAction = vi.fn()
      render(
        <Alert variant="destructive">
          <AlertTitle>删除确认</AlertTitle>
          <AlertDescription>
            您确定要删除这个项目吗？此操作无法撤销。
          </AlertDescription>
          <AlertAction onClick={handleAction}>确认删除</AlertAction>
        </Alert>
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('删除确认')).toBeInTheDocument()
      expect(screen.getByText('您确定要删除这个项目吗？此操作无法撤销。')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: '确认删除' })).toBeInTheDocument()

      const button = screen.getByRole('button', { name: '确认删除' })
      fireEvent.click(button)
      expect(handleAction).toHaveBeenCalledTimes(1)
    })
  })

  describe('变体函数测试', () => {
    it('alertVariants 应该返回正确的类名', () => {
      const defaultClasses = alertVariants({ variant: 'default' })
      expect(defaultClasses).toContain('relative')
      expect(defaultClasses).toContain('w-full')
      expect(defaultClasses).toContain('rounded-lg')
      expect(defaultClasses).toContain('border')
      expect(defaultClasses).toContain('p-4')

      const destructiveClasses = alertVariants({ variant: 'destructive' })
      expect(destructiveClasses).toContain('border-destructive')
      expect(destructiveClasses).toContain('bg-destructive')
      expect(destructiveClasses).toContain('text-destructive-foreground')
    })
  })

  describe('可访问性测试', () => {
    it('应该通过可访问性检查', async () => {
      const { container } = render(
        <Alert variant="warning">
          <AlertTitle>可访问性测试</AlertTitle>
          <AlertDescription>
            这是一个用于可访问性测试的警告信息
          </AlertDescription>
          <AlertAction>操作</AlertAction>
        </Alert>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('应该有正确的 ARIA 角色', () => {
      render(
        <Alert>
          <AlertDescription>ARIA 测试</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('应该支持键盘导航', () => {
      render(
        <Alert>
          <AlertDescription>键盘导航测试</AlertDescription>
          <AlertAction>操作</AlertAction>
        </Alert>
      )

      const button = screen.getByRole('button', { name: '操作' })
      button.focus()
      expect(button).toHaveFocus()

      fireEvent.keyDown(button, { key: 'Enter' })
      // 检查按钮是否响应键盘事件
    })
  })

  describe('错误处理测试', () => {
    it('应该优雅处理缺失的子组件', () => {
      render(<Alert />)

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })

    it('应该处理无效的 variant 值', () => {
      render(
        <Alert variant="invalid" as="div">
          <AlertDescription>内容</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toBeInTheDocument()
    })
  })

  describe('主题集成测试', () => {
    it('应该应用正确的主题类名', () => {
      render(
        <Alert variant="success">
          <AlertDescription>主题测试</AlertDescription>
        </Alert>
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveClass('border-green-200')
      expect(alert).toHaveClass('bg-green-50')
      expect(alert).toHaveClass('text-green-900')
    })
  })

  describe('事件处理测试', () => {
    it('应该正确处理 AlertAction 点击事件', async () => {
      const handleClick = vi.fn()
      render(
        <Alert>
          <AlertDescription>测试点击事件</AlertDescription>
          <AlertAction onClick={handleClick}>点击我</AlertAction>
        </Alert>
      )

      const button = screen.getByRole('button', { name: '点击我' })
      fireEvent.click(button)

      await waitFor(() => {
        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })

    it('应该支持键盘触发点击事件', async () => {
      const handleClick = vi.fn()
      render(
        <Alert>
          <AlertDescription>键盘事件测试</AlertDescription>
          <AlertAction onClick={handleClick}>操作</AlertAction>
        </Alert>
      )

      const button = screen.getByRole('button', { name: '操作' })
      fireEvent.keyDown(button, { key: 'Enter' })

      await waitFor(() => {
        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })
  })

  describe('渲染优化测试', () => {
    it('应该正确渲染复杂内容', () => {
      render(
        <Alert variant="info">
          <AlertTitle>复杂内容测试</AlertTitle>
          <AlertDescription>
            <div>
              <p>第一段内容</p>
              <p>第二段内容</p>
              <ul>
                <li>列表项 1</li>
                <li>列表项 2</li>
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )

      expect(screen.getByText('复杂内容测试')).toBeInTheDocument()
      expect(screen.getByText('第一段内容')).toBeInTheDocument()
      expect(screen.getByText('第二段内容')).toBeInTheDocument()
      expect(screen.getByText('列表项 1')).toBeInTheDocument()
      expect(screen.getByText('列表项 2')).toBeInTheDocument()
    })
  })
})