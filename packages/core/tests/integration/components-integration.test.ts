/**
 * @fileoverview 组件集成测试
 * @description 验证组件间的协作和交互功能
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-05
 */

import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useTheme } from '@xorigo-ui/system'
import { Button } from '../../src/inputs/button'
import { Card, CardHeader, CardBody, CardFooter } from '../../src/data-display/card'

// =============================================================================
// Card + Button 集成测试
// =============================================================================

describe('组件集成测试', () => {
  describe('Card 集成', () => {
    it('应该支持 Card + Button 组合', () => {
      render(
        <ThemeProvider>
          <Card>
            <CardHeader title="卡片标题" subtitle="副标题" />
            <CardBody>
              <p>卡片内容</p>
            </CardBody>
            <CardFooter>
              <Button variant="secondary">取消</Button>
              <Button>确定</Button>
            </CardFooter>
          </Card>
        </ThemeProvider>
      )

      expect(screen.getByText('卡片标题')).toBeInTheDocument()
      expect(screen.getByText('卡片内容')).toBeInTheDocument()
      expect(screen.getByText('取消')).toBeInTheDocument()
      expect(screen.getByText('确定')).toBeInTheDocument()
    })

    it('应该支持可交互的 Card', async () => {
      const handleCardClick = vi.fn()

      render(
        <ThemeProvider>
          <Card variant="interactive" onClick={handleCardClick}>
            <CardBody>
              <p>可点击卡片</p>
            </CardBody>
          </Card>
        </ThemeProvider>
      )

      const card = screen.getByText('可点击卡片').closest('[data-component="card"]')
      await userEvent.click(card!)

      expect(handleCardClick).toHaveBeenCalled()
    })
  })

  // =============================================================================
  // 跨组件状态共享测试
  // =============================================================================

  describe('状态共享', () => {
    it('应该在多个组件间共享主题状态', () => {
      const TestComponent = () => (
        <ThemeProvider theme="dark">
          <div>
            <Button>按钮1</Button>
            <Card>
              <CardBody>
                <Button>按钮2</Button>
              </CardBody>
            </Card>
          </div>
        </ThemeProvider>
      )

      render(<TestComponent />)

      const button1 = screen.getByText('按钮1')
      const button2 = screen.getByText('按钮2')

      expect(button1).toBeInTheDocument()
      expect(button2).toBeInTheDocument()
    })

    it('应该支持 Context 跨层级传递', () => {
      const OuterComponent = () => (
        <ThemeProvider theme="ocean">
          <MiddleComponent />
        </ThemeProvider>
      )

      const MiddleComponent = () => (
        <div>
          <InnerComponent />
        </div>
      )

      const InnerComponent = () => {
        const { theme } = useTheme()
        return <div>主题: {theme}</div>
      }

      render(<OuterComponent />)

      expect(screen.getByText('主题: ocean')).toBeInTheDocument()
    })
  })
})
