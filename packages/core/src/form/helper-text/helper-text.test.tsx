/**
 * @fileoverview HelperText 组件测试
 * @description 测试 HelperText 组件的渲染、状态、交互和无障碍功能
 */

import React from 'react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider } from '../../../theme'
import { HelperText, HelperTextList } from './helper-text'

// =================================
// 工具函数
// =================================

const renderWithTheme = (component: React.ReactNode) => {
  return render(
    <ThemeProvider>
      {component}
    </ThemeProvider>
  )
}

// =================================
// 测试套件
// =================================

describe('HelperText', () => {
  // 清理
  afterEach(() => {
    vi.clearAllMocks()
  })

  // =================================
  // 基础渲染测试
  // =================================

  describe('基础渲染', () => {
    it('应该渲染默认状态的帮助文本', () => {
      renderWithTheme(
        <HelperText content="这是帮助文本" />
      )

      const helperText = screen.getByRole('status')
      expect(helperText).toBeInTheDocument()
      expect(screen.getByText('这是帮助文本')).toBeInTheDocument()
    })

    it('应该通过 children 渲染内容', () => {
      renderWithTheme(
        <HelperText>
          <span>通过 children 渲染</span>
        </HelperText>
      )

      expect(screen.getByText('通过 children 渲染')).toBeInTheDocument()
    })

    it('当没有内容时不应该渲染', () => {
      const { container } = renderWithTheme(
        <HelperText content="" />
      )

      expect(container.firstChild).toBeNull()
    })

    it('应该渲染自定义 ID', () => {
      renderWithTheme(
        <HelperText id="custom-id" content="测试ID" />
      )

      expect(screen.getByTestId('custom-id')).toBeInTheDocument()
    })
  })

  // =================================
  // 状态变体测试
  // =================================

  describe('状态变体', () => {
    it('应该渲染信息状态', () => {
      renderWithTheme(
        <HelperText status="info" content="这是一个信息提示" />
      )

      const helperText = screen.getByRole('status')
      expect(helperText).toBeInTheDocument()
      expect(screen.getByText('这是一个信息提示')).toBeInTheDocument()
    })

    it('应该渲染警告状态', () => {
      renderWithTheme(
        <HelperText status="warning" content="这是一个警告提示" />
      )

      expect(screen.getByText('这是一个警告提示')).toBeInTheDocument()
    })

    it('应该渲染错误状态', () => {
      renderWithTheme(
        <HelperText status="error" content="这是一个错误提示" />
      )

      // 错误状态使用 role="alert"
      expect(screen.getByRole('alert')).toBeInTheDocument()
      expect(screen.getByText('这是一个错误提示')).toBeInTheDocument()
    })

    it('应该渲染成功状态', () => {
      renderWithTheme(
        <HelperText status="success" content="操作成功" />
      )

      expect(screen.getByText('操作成功')).toBeInTheDocument()
    })

    it('应该支持 variant 属性', () => {
      renderWithTheme(
        <HelperText variant="info" content="使用 variant" />
      )

      expect(screen.getByText('使用 variant')).toBeInTheDocument()
    })
  })

  // =================================
  // 图标测试
  // =================================

  describe('图标显示', () => {
    it('默认情况下不显示图标', () => {
      renderWithTheme(
        <HelperText content="没有图标" />
      )

      // 查找是否有图标元素（检查 SVG）
      const icons = screen.queryAllByRole('img')
      expect(icons.length).toBe(0)
    })

    it('showIcon=true 时应该显示图标', () => {
      renderWithTheme(
        <HelperText showIcon={true} content="有图标" />
      )

      // 查找 SVG 图标
      const svgIcons = screen.queryAllByTagName('svg')
      expect(svgIcons.length).toBeGreaterThan(0)
    })

    it('应该支持自定义图标', () => {
      renderWithTheme(
        <HelperText
          showIcon={true}
          icon={<span data-testid="custom-icon">自定义图标</span>}
          content="自定义图标"
        />
      )

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })
  })

  // =================================
  // 尺寸测试
  // =================================

  describe('尺寸变体', () => {
    it('应该支持 sm 尺寸', () => {
      renderWithTheme(
        <HelperText size="sm" content="小尺寸" />
      )

      const helperText = screen.getByText('小尺寸')
      expect(helperText).toHaveClass('text-xs')
    })

    it('应该支持 md 尺寸（默认）', () => {
      renderWithTheme(
        <HelperText content="中等尺寸" />
      )

      const helperText = screen.getByText('中等尺寸')
      expect(helperText).toHaveClass('text-xs')
    })

    it('应该支持 lg 尺寸', () => {
      renderWithTheme(
        <HelperText size="lg" content="大尺寸" />
      )

      const helperText = screen.getByText('大尺寸')
      expect(helperText).toHaveClass('text-sm')
    })
  })

  // =================================
  // 截断测试
  // =================================

  describe('文本截断', () => {
    it('应该支持单行截断', () => {
      renderWithTheme(
        <HelperText
          truncation="single"
          content="这是一个很长的文本应该被截断"
        />
      )

      const helperText = screen.getByText('这是一个很长的文本应该被截断')
      expect(helperText).toHaveClass('truncate')
    })

    it('应该支持多行截断', () => {
      renderWithTheme(
        <HelperText
          truncation="multi"
          content="这是一个很长的多行文本应该被正确处理"
        />
      )

      const helperText = screen.getByText('这是一个很长的多行文本应该被正确处理')
      expect(helperText).toHaveClass('break-words')
    })

    it('应该支持最大行数限制', () => {
      renderWithTheme(
        <HelperText
          maxLines={2}
          content="第一行文本\n第二行文本\n第三行文本"
        />
      )

      const helperText = screen.getByText(/第一行文本/)
      expect(helperText).toHaveClass('line-clamp-2')
    })
  })

  // =================================
  // 链接测试
  // =================================

  describe('链接支持', () => {
    it('应该渲染带链接的文本', () => {
      renderWithTheme(
        <HelperText
          content="点击 {1} 查看更多信息"
          links={[
            { text: '这里', href: '/help' }
          ]}
        />
      )

      const link = screen.getByRole('link', { name: '这里' })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/help')
    })

    it('应该支持外部链接', () => {
      renderWithTheme(
        <HelperText
          content="访问 {1} 网站"
          links={[
            { text: '外部网站', href: 'https://example.com', external: true }
          ]}
        />
      )

      const link = screen.getByRole('link', { name: '外部网站' })
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })

    it('应该支持链接点击事件', async () => {
      const handleClick = vi.fn()

      renderWithTheme(
        <HelperText
          content="点击 {1}"
          links={[
            { text: '链接', href: '#', onClick: handleClick }
          ]}
        />
      )

      const link = screen.getByRole('link', { name: '链接' })
      await userEvent.click(link)

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('应该支持多个链接', () => {
      renderWithTheme(
        <HelperText
          content="查看 {1} 或 {2}"
          links={[
            { text: '文档', href: '/docs' },
            { text: '示例', href: '/examples' }
          ]}
        />
      )

      expect(screen.getByText('文档')).toBeInTheDocument()
      expect(screen.getByText('示例')).toBeInTheDocument()
    })
  })

  // =================================
  // 状态控制测试
  // =================================

  describe('状态控制', () => {
    it('应该正确处理禁用状态', () => {
      renderWithTheme(
        <HelperText disabled={true} content="禁用状态" />
      )

      const helperText = screen.getByText('禁用状态')
      expect(helperText.parentElement).toHaveClass('opacity-50', 'cursor-not-allowed')
    })

    it('应该支持隐藏文本', () => {
      renderWithTheme(
        <HelperText isHidden={true} content="隐藏文本" />
      )

      const helperText = screen.getByText('隐藏文本')
      expect(helperText).toHaveAttribute('aria-hidden', 'true')
    })
  })

  // =================================
  // 无障碍测试
  // =================================

  describe('无障碍功能', () => {
    it('默认状态应该有 role="status"', () => {
      renderWithTheme(
        <HelperText content="状态消息" />
      )

      expect(screen.getByRole('status')).toBeInTheDocument()
    })

    it('错误状态应该有 role="alert"', () => {
      renderWithTheme(
        <HelperText status="error" content="错误消息" />
      )

      expect(screen.getByRole('alert')).toBeInTheDocument()
    })

    it('错误状态应该有 assertive 的 aria-live', () => {
      renderWithTheme(
        <HelperText status="error" content="重要错误" />
      )

      const alert = screen.getByRole('alert')
      expect(alert).toHaveAttribute('aria-live', 'assertive')
    })

    it('其他状态应该有 polite 的 aria-live', () => {
      renderWithTheme(
        <HelperText status="info" content="信息提示" />
      )

      const status = screen.getByRole('status')
      expect(status).toHaveAttribute('aria-live', 'polite')
    })
  })

  // =================================
  // forwardRef 测试
  // =================================

  describe('forwardRef', () => {
    it('应该正确转发 ref', () => {
      const ref = React.createRef<HTMLDivElement>()

      renderWithTheme(
        <HelperText ref={ref} content="测试 ref" />
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
      expect(ref.current).toHaveTextContent('测试 ref')
    })

    it('应该正确处理 ref 的类名合并', () => {
      const ref = React.createRef<HTMLDivElement>()

      renderWithTheme(
        <HelperText ref={ref} className="custom-class" content="测试" />
      )

      expect(ref.current).toHaveClass('custom-class')
    })
  })

  // =================================
  // 动画测试
  // =================================

  describe('动画效果', () => {
    it('应该支持进入动画', () => {
      const { container } = renderWithTheme(
        <HelperText content="动画测试" />
      )

      // 检查是否有动画相关属性
      expect(container.firstChild).toHaveAttribute('data-framer-motion')
    })

    it('应该正确应用动画变体', () => {
      renderWithTheme(
        <HelperText content="动画内容" />
      )

      // 动画应该正常工作（具体动画效果通过视觉测试验证）
      expect(screen.getByText('动画内容')).toBeInTheDocument()
    })
  })
})

// =================================
// HelperTextList 测试套件
// =================================

describe('HelperTextList', () => {
  // =================================
  // 基础功能测试
  // =================================

  describe('基础功能', () => {
    it('应该渲染多个帮助文本项', () => {
      renderWithTheme(
        <HelperTextList
          items={[
            { content: '第一项' },
            { content: '第二项' },
            { content: '第三项' }
          ]}
        />
      )

      expect(screen.getByText('第一项')).toBeInTheDocument()
      expect(screen.getByText('第二项')).toBeInTheDocument()
      expect(screen.getByText('第三项')).toBeInTheDocument()
    })

    it('当 items 为空时不应该渲染', () => {
      const { container } = renderWithTheme(
        <HelperTextList items={[]} />
      )

      expect(container.firstChild).toBeNull()
    })

    it('应该支持不同状态的帮助文本', () => {
      renderWithTheme(
        <HelperTextList
          items={[
            { content: '信息提示', status: 'info' },
            { content: '错误提示', status: 'error' },
            { content: '警告提示', status: 'warning' }
          ]}
        />
      )

      expect(screen.getByText('信息提示')).toBeInTheDocument()
      expect(screen.getByText('错误提示')).toBeInTheDocument()
      expect(screen.getByText('警告提示')).toBeInTheDocument()
    })

    it('应该为每个项显示图标', () => {
      renderWithTheme(
        <HelperTextList
          items={[
            { content: '带图标的项' }
          ]}
        />
      )

      // 检查是否有图标
      const svgs = screen.queryAllByTagName('svg')
      expect(svgs.length).toBeGreaterThan(0)
    })

    it('应该支持自定义 ID', () => {
      renderWithTheme(
        <HelperTextList
          items={[
            { content: '测试项', id: 'item-1' }
          ]}
        />
      )

      expect(screen.getByText('测试项')).toBeInTheDocument()
    })

    it('应该支持动画开关', () => {
      const { container: containerWithAnimation } = renderWithTheme(
        <HelperTextList
          items={[{ content: '动画项' }]}
          animation={true}
        />
      )

      const { container: containerWithoutAnimation } = renderWithTheme(
        <HelperTextList
          items={[{ content: '非动画项' }]}
          animation={false}
        />
      )

      // 两个都应该渲染内容（动画只是视觉效果）
      expect(containerWithAnimation.firstChild).not.toBeNull()
      expect(containerWithoutAnimation.firstChild).not.toBeNull()
    })

    it('应该转发 ref', () => {
      const ref = React.createRef<HTMLDivElement>()

      renderWithTheme(
        <HelperTextList
          ref={ref}
          items={[
            { content: '测试项' }
          ]}
        />
      )

      expect(ref.current).toBeInstanceOf(HTMLDivElement)
    })
  })

  // =================================
  // 复杂场景测试
  // =================================

  describe('复杂场景', () => {
    it('应该正确处理混合状态', () => {
      renderWithTheme(
        <HelperTextList
          items={[
            { content: '成功项', status: 'success' },
            { content: '信息项', status: 'info' },
            { content: '默认项' }
          ]}
        />
      )

      expect(screen.getByText('成功项')).toBeInTheDocument()
      expect(screen.getByText('信息项')).toBeInTheDocument()
      expect(screen.getByText('默认项')).toBeInTheDocument()
    })

    it('应该支持 props 的传递', () => {
      renderWithTheme(
        <HelperTextList
          items={[
            { content: '测试项' }
          ]}
          size="lg"
          className="custom-list-class"
        />
      )

      const list = screen.getByText('测试项').closest('div')
      expect(list).toHaveClass('custom-list-class', 'space-y-1.5')
    })
  })
})
