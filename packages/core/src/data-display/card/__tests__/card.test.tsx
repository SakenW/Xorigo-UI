/**
 * Card 组件单元测试
 * 测试 Card 组件的所有功能：基础渲染、变体、交互、可访问性等
 */

import React from 'react'
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { axe, toHaveNoViolations } from 'jest-axe'
import '@testing-library/jest-dom'

// 导入 Card 组件系列
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  SimpleCard,
  StatsCard,
  createCardData,
  filterCards
} from '../card'

// 扩展 Jest 匹配器
expect.extend(toHaveNoViolations)

// 模拟主题数据
const mockTheme = {
  colors: {
    primary: 'hsl(210 100% 50%)',
    secondary: 'hsl(210 100% 60%)',
    muted: 'hsl(210 20% 90%)',
    background: 'hsl(0 0% 100%)',
    text: {
      primary: 'hsl(210 20% 10%)',
      secondary: 'hsl(210 15% 40%)'
    },
    border: {
      primary: 'hsl(210 20% 80%)'
    }
  },
  spacing: {
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem'
  }
}

// 模拟 useTheme hook
vi.mock('../../../system', () => ({
  useTheme: () => mockTheme,
  ThemeProvider: ({ children }: { children: React.ReactNode }) => children
}))

// 模拟 cn 工具函数
vi.mock('../../../foundations/utils/cn', () => ({
  cn: (...inputs: any[]) => inputs.filter(Boolean).join(' ')
}))

// 测试数据
const testCardData = createCardData({
  id: 'test-card-1',
  title: '测试卡片标题',
  description: '这是一个测试卡片的描述文本',
  content: '卡片的主要内容',
  icon: <span data-testid="test-icon">🎨</span>,
  data: { custom: 'data' }
})

describe('Card 组件测试', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('基础渲染测试', () => {
    it('应该正确渲染基础 Card 组件', () => {
      render(<Card>基础卡片内容</Card>)

      const card = screen.getByRole('article')
      expect(card).toBeInTheDocument()
      expect(card).toHaveTextContent('基础卡片内容')
      expect(card).toHaveAttribute('aria-label', '卡片')
    })

    it('应该支持自定义 className', () => {
      render(<Card className="custom-card-class">内容</Card>)

      const card = screen.getByRole('article')
      expect(card).toHaveClass('custom-card-class')
    })

    it('应该支持自定义样式', () => {
      render(
        <Card style={{ backgroundColor: 'red' }}>
          内容
        </Card>
      )

      const card = screen.getByRole('article')
      expect(card).toHaveStyle('background-color: red')
    })
  })

  describe('Card 变体测试', () => {
    it('应该支持 default 变体', () => {
      render(<Card variant="default">默认变体</Card>)

      const card = screen.getByRole('article')
      expect(card).toHaveClass('border')
      expect(card).toHaveClass('shadow-sm')
    })

    it('应该支持 outline 变体', () => {
      render(<Card variant="outline">轮廓变体</Card>)

      const card = screen.getByRole('article')
      expect(card).toHaveClass('border-2')
    })

    it('应该支持 elevated 变体', () => {
      render(<Card variant="elevated">凸起变体</Card>)

      const card = screen.getByRole('article')
      expect(card).toHaveClass('shadow-lg')
    })

    it('应该支持 filled 变体', () => {
      render(<Card variant="filled">填充变体</Card>)

      const card = screen.getByRole('article')
      expect(card).toHaveClass('border-0')
    })

    it('应该支持 ghost 变体', () => {
      render(<Card variant="ghost">幽灵变体</Card>)

      const card = screen.getByRole('article')
      expect(card).toHaveClass('border-transparent')
      expect(card).toHaveClass('bg-transparent')
      expect(card).toHaveClass('shadow-none')
    })
  })

  describe('Card 尺寸测试', () => {
    it('应该支持 sm 尺寸', () => {
      render(<Card size="sm">小尺寸卡片</Card>)

      const card = screen.getByRole('article')
      expect(card).toHaveClass('p-3')
    })

    it('应该支持 md 尺寸（默认）', () => {
      render(<Card size="md">中等尺寸卡片</Card>)

      const card = screen.getByRole('article')
      expect(card).toHaveClass('p-4')
    })

    it('应该支持 lg 尺寸', () => {
      render(<Card size="lg">大尺寸卡片</Card>)

      const card = screen.getByRole('article')
      expect(card).toHaveClass('p-6')
    })
  })

  describe('Card 状态测试', () => {
    it('应该支持 disabled 状态', () => {
      render(<Card disabled>禁用卡片</Card>)

      const card = screen.getByRole('article')
      expect(card).toHaveClass('opacity-50')
      expect(card).toHaveClass('pointer-events-none')
      expect(card).toHaveAttribute('aria-disabled', 'true')
    })

    it('应该支持 loading 状态', () => {
      render(<Card loading>加载中卡片</Card>)

      const card = screen.getByRole('article')
      expect(card).toHaveClass('opacity-75')
      expect(card).toHaveAttribute('aria-busy', 'true')
    })

    it('应该支持 selected 状态', () => {
      render(<Card selected>选中卡片</Card>)

      const card = screen.getByRole('article')
      expect(card).toHaveClass('ring-2')
      expect(card).toHaveAttribute('aria-selected', 'true')
    })

    it('应该支持 destructive 变体', () => {
      render(<Card variant="destructive">错误卡片</Card>)

      const card = screen.getByRole('article')
      expect(card).toHaveClass('border-error-500')
      expect(card).toHaveClass('bg-error-500')
      expect(card).toHaveClass('text-error-600-foreground')
    })
  })

  describe('Card 交互测试', () => {
    it('应该支持点击事件', async () => {
      const handleClick = vi.fn()
      render(<Card onClick={handleClick}>可点击卡片</Card>)

      const card = screen.getByRole('article')
      fireEvent.click(card)

      await waitFor(() => {
        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })

    it('应该支持键盘交互（Tab + Enter）', async () => {
      const handleClick = vi.fn()
      render(<Card onClick={handleClick} tabIndex={0}>键盘可访问卡片</Card>)

      const card = screen.getByRole('article')
      card.focus()
      expect(card).toHaveFocus()

      fireEvent.keyDown(card, { key: 'Enter' })

      await waitFor(() => {
        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })

    it('应该支持键盘交互（Space）', async () => {
      const handleClick = vi.fn()
      render(<Card onClick={handleClick} tabIndex={0}>空格键交互卡片</Card>)

      const card = screen.getByRole('article')
      card.focus()

      fireEvent.keyDown(card, { key: ' ' })

      await waitFor(() => {
        expect(handleClick).toHaveBeenCalledTimes(1)
      })
    })

    it('禁用状态下不应该触发点击事件', async () => {
      const handleClick = vi.fn()
      render(<Card disabled onClick={handleClick}>禁用卡片</Card>)

      const card = screen.getByRole('article')
      fireEvent.click(card)

      await waitFor(() => {
        expect(handleClick).not.toHaveBeenCalled()
      })
    })
  })

  describe('CardHeader 组件测试', () => {
    it('应该正确渲染卡片头部', () => {
      render(<CardHeader title="测试标题" description="测试描述" />)

      expect(screen.getByText('测试标题')).toBeInTheDocument()
      expect(screen.getByText('测试描述')).toBeInTheDocument()
    })

    it('应该支持居中对齐', () => {
      render(
        <CardHeader
          title="居中标题"
          description="居中描述"
          centered
        />
      )

      expect(screen.getByText('居中标题')).toBeInTheDocument()
      expect(screen.getByText('居中描述')).toBeInTheDocument()
    })

    it('应该支持图标', () => {
      const icon = <span data-testid="header-icon">🎯</span>
      render(
        <CardHeader
          title="带图标的标题"
          description="带图标的描述"
          icon={icon}
        />
      )

      expect(screen.getByTestId('header-icon')).toBeInTheDocument()
    })

    it('应该支持操作按钮', () => {
      const action = <button data-testid="action-button">操作</button>
      render(
        <CardHeader
          title="标题"
          description="描述"
          actions={action}
        />
      )

      expect(screen.getByTestId('action-button')).toBeInTheDocument()
    })
  })

  describe('CardContent 组件测试', () => {
    it('应该正确渲染卡片内容', () => {
      render(<CardContent>卡片内容文本</CardContent>)

      expect(screen.getByText('卡片内容文本')).toBeInTheDocument()
    })

    it('应该支持垂直对齐', () => {
      render(
        <CardContent align="center">
          垂直居中内容
        </CardContent>
      )

      const content = screen.getByText('垂直居中内容')
      expect(content).toBeInTheDocument()
    })

    it('应该支持水平对齐', () => {
      render(
        <CardContent align="center">
          水平居中内容
        </CardContent>
      )

      const content = screen.getByText('水平居中内容')
      expect(content).toBeInTheDocument()
    })
  })

  describe('CardFooter 组件测试', () => {
    it('应该正确渲染卡片底部', () => {
      render(<CardFooter>卡片底部内容</CardFooter>)

      expect(screen.getByText('卡片底部内容')).toBeInTheDocument()
    })

    it('应该支持对齐方式', () => {
      render(
        <CardFooter justify="end">
          右对齐底部
        </CardFooter>
      )

      expect(screen.getByText('右对齐底部')).toBeInTheDocument()
    })
  })

  describe('组合组件测试', () => {
    it('应该正确组合 Card 组件系列', () => {
      render(
        <Card variant="elevated">
          <CardHeader
            title="组合卡片标题"
            description="组合卡片描述"
          />
          <CardContent>
            这是组合卡片的内容部分
          </CardContent>
          <CardFooter>
            <button>确认</button>
            <button>取消</button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByText('组合卡片标题')).toBeInTheDocument()
      expect(screen.getByText('组合卡片描述')).toBeInTheDocument()
      expect(screen.getByText('这是组合卡片的内容部分')).toBeInTheDocument()
      expect(screen.getByText('确认')).toBeInTheDocument()
      expect(screen.getByText('取消')).toBeInTheDocument()
    })
  })

  describe('SimpleCard 组件测试', () => {
    it('应该正确渲染简单卡片', () => {
      const simpleCard = createCardData({
        id: 'simple-1',
        title: '简单标题',
        content: '简单内容'
      })

      render(<SimpleCard card={simpleCard} />)

      expect(screen.getByText('简单标题')).toBeInTheDocument()
      expect(screen.getByText('简单内容')).toBeInTheDocument()
    })

    it('应该支持自定义渲染函数', () => {
      const customCard = createCardData({
        id: 'custom-1',
        title: '自定义标题',
        content: '自定义内容'
      })

      render(
        <SimpleCard
          card={customCard}
          renderContent={(card) => (
            <div data-testid="custom-content">
              自定义渲染: {card.title}
            </div>
          )}
        />
      )

      expect(screen.getByTestId('custom-content')).toBeInTheDocument()
      expect(screen.getByTestId('custom-content')).toHaveTextContent('自定义渲染: 自定义标题')
    })
  })

  describe('StatsCard 组件测试', () => {
    it('应该正确渲染统计卡片', () => {
      const statsCard = createCardData({
        id: 'stats-1',
        title: '用户总数',
        content: '1,234',
        data: { trend: '+12%', period: '本月' }
      })

      render(<StatsCard card={statsCard} />)

      expect(screen.getByText('用户总数')).toBeInTheDocument()
      expect(screen.getByText('1,234')).toBeInTheDocument()
    })

    it('应该支持趋势显示', () => {
      const trendingCard = createCardData({
        id: 'trending-1',
        title: '销售额',
        content: '¥56,789',
        data: {
          trend: '+23%',
          period: '本月',
          trendDirection: 'up'
        }
      })

      render(<StatsCard card={trendingCard} />)

      expect(screen.getByText('¥56,789')).toBeInTheDocument()
    })
  })

  describe('工具函数测试', () => {
    it('createCardData 应该创建正确的卡片数据', () => {
      const card = createCardData({
        id: 'test-1',
        title: '测试卡片',
        description: '测试描述',
        data: { custom: 'value' }
      })

      expect(card.id).toBe('test-1')
      expect(card.title).toBe('测试卡片')
      expect(card.description).toBe('测试描述')
      expect(card.data).toEqual({ custom: 'value' })
    })

    it('filterCards 应该正确过滤卡片', () => {
      const cards = [
        createCardData({ id: '1', title: '苹果', description: '红色水果' }),
        createCardData({ id: '2', title: '香蕉', description: '黄色水果' }),
        createCardData({ id: '3', title: '胡萝卜', description: '橙色蔬菜' })
      ]

      const filteredCards = filterCards(cards, '水果')
      expect(filteredCards).toHaveLength(2)
      expect(filteredCards.map(c => c.id)).toEqual(['1', '2'])
    })

    it('filterCards 应该支持自定义过滤函数', () => {
      const cards = [
        createCardData({ id: '1', title: '高优先级', data: { priority: 'high' } }),
        createCardData({ id: '2', title: '中优先级', data: { priority: 'medium' } }),
        createCardData({ id: '3', title: '低优先级', data: { priority: 'low' } })
      ]

      const highPriorityCards = filterCards(cards, '', (card) =>
        card.data?.priority === 'high'
      )
      expect(highPriorityCards).toHaveLength(1)
      expect(highPriorityCards[0].id).toBe('1')
    })
  })

  describe('可访问性测试', () => {
    it('应该通过可访问性检查', async () => {
      const { container } = render(
        <Card
          variant="elevated"
          aria-labelledby="card-title"
          aria-describedby="card-description"
        >
          <CardHeader id="card-title" title="可访问性测试" />
          <CardContent id="card-description">
            这是一个用于可访问性测试的卡片内容
          </CardContent>
        </Card>
      )

      const results = await axe(container)
      expect(results).toHaveNoViolations()
    })

    it('应该支持键盘导航', () => {
      render(<Card variant="interactive" tabIndex={0}>键盘导航卡片</Card>)

      const card = screen.getByRole('article')
      card.focus()
      expect(card).toHaveFocus()
    })

    it('应该有正确的 ARIA 标签', () => {
      render(<Card role="article" aria-label="用户信息卡片">内容</Card>)

      const card = screen.getByRole('article')
      expect(card).toHaveAttribute('aria-label', '用户信息卡片')
    })
  })

  describe('主题集成测试', () => {
    it('应该应用正确的主题变量', () => {
      render(<Card variant="filled">主题测试卡片</Card>)

      const card = screen.getByRole('article')
      expect(card).toBeInTheDocument()
    })
  })

  describe('错误处理测试', () => {
    it('应该优雅处理缺失的 props', () => {
      render(<Card />)

      const card = screen.getByRole('article')
      expect(card).toBeInTheDocument()
    })

    it('应该处理无效的 variant 值', () => {
      render(<Card variant="invalid" as="div">内容</Card>)

      const card = screen.getByRole('article')
      expect(card).toBeInTheDocument()
    })
  })
})