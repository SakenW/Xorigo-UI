/**
 * @fileoverview Timeline 组件测试套件
 * @description 测试时间线组件的所有功能特性
 */

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Timeline, TimelineItem, TimelineMarker, TimelineContent } from './timeline'

// 测试数据
const mockData = [
  {
    id: 1,
    date: '2024-01-15',
    title: '项目启动',
    description: '项目初始规划和需求分析阶段',
    variant: 'primary' as const,
  },
  {
    id: 2,
    date: '2024-02-20',
    title: '开发阶段',
    description: '核心功能开发和实现',
    variant: 'success' as const,
  },
  {
    id: 3,
    date: '2024-03-10',
    title: '测试验收',
    description: '功能测试和用户验收',
    variant: 'info' as const,
  },
]

describe('Timeline', () => {
  describe('基础渲染', () => {
    it('应该正确渲染垂直时间线', () => {
      render(
        <Timeline>
          <TimelineItem>
            <TimelineMarker>
              <div className="w-3 h-3 rounded-full bg-blue-500" />
            </TimelineMarker>
            <TimelineContent>
              <div className="font-semibold">测试项目</div>
              <div className="text-sm text-gray-500">这是一个测试项目</div>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      const timeline = screen.getByRole('generic')
      expect(timeline).toBeInTheDocument()
      expect(timeline).toHaveClass('flex', 'flex-col', 'space-y-6')
    })

    it('应该正确渲染水平时间线', () => {
      render(
        <Timeline orientation="horizontal">
          <TimelineItem>
            <TimelineMarker>
              <div className="w-3 h-3 rounded-full bg-blue-500" />
            </TimelineMarker>
            <TimelineContent>
              <div className="font-semibold">测试项目</div>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      const timeline = screen.getByRole('generic')
      expect(timeline).toHaveClass('flex', 'flex-row', 'space-x-6')
    })
  })

  describe('变体系统', () => {
    it('应该支持不同的变体', () => {
      const { rerender } = render(
        <Timeline variant="default">
          <TimelineItem>
            <TimelineMarker>1</TimelineMarker>
            <TimelineContent>内容</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      const timeline = screen.getByRole('generic')
      expect(timeline).toHaveClass('relative')

      rerender(
        <Timeline variant="simple">
          <TimelineItem>
            <TimelineMarker>1</TimelineMarker>
            <TimelineContent>内容</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      expect(screen.getByRole('generic')).toHaveClass('relative')
    })

    it('应该支持不同的密度设置', () => {
      const { rerender } = render(
        <Timeline density="compact">
          <TimelineItem>
            <TimelineMarker>1</TimelineMarker>
            <TimelineContent>内容</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      expect(screen.getByRole('generic')).toHaveClass('space-y-3')

      rerender(
        <Timeline density="loose">
          <TimelineItem>
            <TimelineMarker>1</TimelineMarker>
            <TimelineContent>内容</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      expect(screen.getByRole('generic')).toHaveClass('space-y-8')
    })
  })

  describe('TimelineItem', () => {
    it('应该正确渲染时间线项', () => {
      render(
        <Timeline>
          <TimelineItem>
            <TimelineMarker>1</TimelineMarker>
            <TimelineContent>时间线内容</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      expect(screen.getByText('时间线内容')).toBeInTheDocument()
    })

    it('应该支持交替对齐', () => {
      render(
        <Timeline>
          <TimelineItem align="alternate">
            <TimelineMarker>1</TimelineMarker>
            <TimelineContent>内容1</TimelineContent>
          </TimelineItem>
          <TimelineItem align="alternate">
            <TimelineMarker>2</TimelineMarker>
            <TimelineContent>内容2</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      const timeline = screen.getByRole('generic')
      const items = timeline.querySelectorAll('.relative.flex')
      expect(items[0]).toHaveClass('justify-start')
    })
  })

  describe('TimelineMarker', () => {
    it('应该支持不同的尺寸', () => {
      const { rerender } = render(
        <Timeline>
          <TimelineItem>
            <TimelineMarker size="sm">1</TimelineMarker>
            <TimelineContent>内容</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      let marker = screen.getByRole('generic').querySelector('.w-6.h-6')
      expect(marker).toBeInTheDocument()

      rerender(
        <Timeline>
          <TimelineItem>
            <TimelineMarker size="lg">1</TimelineMarker>
            <TimelineContent>内容</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      marker = screen.getByRole('generic').querySelector('.w-10.h-10')
      expect(marker).toBeInTheDocument()
    })

    it('应该支持不同的颜色变体', () => {
      render(
        <Timeline>
          <TimelineItem>
            <TimelineMarker variant="primary">1</TimelineMarker>
            <TimelineContent>内容</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      const marker = screen.getByRole('generic').querySelector('.border-primary.bg-primary')
      expect(marker).toBeInTheDocument()
    })

    it('应该支持点状标记', () => {
      render(
        <Timeline>
          <TimelineItem>
            <TimelineMarker dot>1</TimelineMarker>
            <TimelineContent>内容</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      const marker = screen.getByRole('generic').querySelector('.bg-current')
      expect(marker).toBeInTheDocument()
    })
  })

  describe('TimelineFromData', () => {
    it('应该正确渲染数据列表', () => {
      render(
        <Timeline.fromData items={mockData} />
      )

      expect(screen.getByText('项目启动')).toBeInTheDocument()
      expect(screen.getByText('开发阶段')).toBeInTheDocument()
      expect(screen.getByText('测试验收')).toBeInTheDocument()
    })

    it('应该支持自定义渲染函数', () => {
      const customRender = (item: typeof mockData[0]) => (
        <div key={item.id} data-testid="custom-item">
          {item.title} - {item.description}
        </div>
      )

      render(
        <Timeline.fromData items={mockData} renderItem={customRender} />
      )

      expect(screen.getByText('项目启动 - 项目初始规划和需求分析阶段')).toBeInTheDocument()
    })
  })

  describe('加载状态', () => {
    it('应该正确渲染骨架屏', () => {
      render(<Timeline.skeleton />)

      const skeleton = screen.getByRole('generic')
      expect(skeleton).toBeInTheDocument()

      const pulseElements = skeleton.querySelectorAll('.animate-pulse')
      expect(pulseElements.length).toBeGreaterThan(0)
    })
  })

  describe('空状态', () => {
    it('应该正确渲染空状态', () => {
      render(<Timeline.empty message="暂无数据" />)

      expect(screen.getByText('暂无数据')).toBeInTheDocument()
    })
  })

  describe('可访问性', () => {
    it('应该支持键盘导航', () => {
      render(
        <Timeline>
          <TimelineItem>
            <TimelineMarker tabIndex={0}>1</TimelineMarker>
            <TimelineContent>可访问内容</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      const marker = screen.getByRole('generic').querySelector('[tabIndex="0"]')
      expect(marker).toBeInTheDocument()
    })

    it('应该包含适当的 ARIA 属性', () => {
      render(
        <Timeline>
          <TimelineItem>
            <TimelineMarker aria-label="步骤 1">1</TimelineMarker>
            <TimelineContent>内容</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      const marker = screen.getByLabelText('步骤 1')
      expect(marker).toBeInTheDocument()
    })
  })

  describe('响应式设计', () => {
    it('应该在不同方向下正确渲染', () => {
      const { rerender } = render(
        <Timeline orientation="vertical">
          <TimelineItem>
            <TimelineMarker>1</TimelineMarker>
            <TimelineContent>垂直内容</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      let timeline = screen.getByRole('generic')
      expect(timeline).toHaveClass('flex-col')

      rerender(
        <Timeline orientation="horizontal">
          <TimelineItem>
            <TimelineMarker>1</TimelineMarker>
            <TimelineContent>水平内容</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      timeline = screen.getByRole('generic')
      expect(timeline).toHaveClass('flex-row')
    })
  })

  describe('样式集成', () => {
    it('应该接受自定义类名', () => {
      render(
        <Timeline className="custom-timeline">
          <TimelineItem className="custom-item">
            <TimelineMarker className="custom-marker">1</TimelineMarker>
            <TimelineContent className="custom-content">内容</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      const timeline = screen.getByRole('generic')
      expect(timeline).toHaveClass('custom-timeline')

      const item = timeline.querySelector('.relative.flex')
      expect(item).toHaveClass('custom-item')
    })

    it('应该正确合并 Tailwind 类名', () => {
      render(
        <Timeline className="px-4 py-2 px-8">
          <TimelineItem>
            <TimelineMarker>1</TimelineMarker>
            <TimelineContent>内容</TimelineContent>
          </TimelineItem>
        </Timeline>
      )

      const timeline = screen.getByRole('generic')
      // 通过 tailwind-merge，重复的类会被合并，px-4 会被 px-8 覆盖
      expect(timeline).toHaveClass('py-2', 'px-8')
    })
  })
})
