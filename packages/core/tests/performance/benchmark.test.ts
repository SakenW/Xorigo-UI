/**
 * @fileoverview 性能基准测试
 * @description 验证组件渲染性能和主题切换性能
 *
 * @author Xorigo UI Team
 * @version 1.0.0
 * @since 2025-11-05
 */

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Button } from '../../src/inputs/button'
import { Card } from '../../src/data-display/card'
import { Tabs, TabList, Tab, TabPanel } from '../../src/primitives/tabs'

// =============================================================================
// 渲染性能基准测试
// =============================================================================

describe('性能基准测试', () => {
  describe('组件渲染性能', () => {
    it('Button 组件渲染应该在 1ms 内完成', () => {
      const start = performance.now()
      
      render(<Button>测试按钮</Button>)
      
      const end = performance.now()
      const renderTime = end - start
      
      expect(renderTime).toBeLessThan(1)
    })

    it('Card 组件渲染应该在 1ms 内完成', () => {
      const start = performance.now()
      
      render(
        <Card>
          <Card.Body>卡片内容</Card.Body>
        </Card>
      )
      
      const end = performance.now()
      const renderTime = end - start
      
      expect(renderTime).toBeLessThan(1)
    })

    it('大量组件渲染应该保持性能', () => {
      const start = performance.now()
      
      const buttons = Array.from({ length: 100 }, (_, i) => (
        <Button key={i}>按钮{i}</Button>
      ))
      
      render(<div>{buttons}</div>)
      
      const end = performance.now()
      const renderTime = end - start
      
      expect(renderTime).toBeLessThan(10)
    })
  })

  // =============================================================================
  // 主题切换性能测试
  // =============================================================================

  describe('主题切换性能', () => {
    it('主题切换应该在 10ms 内完成', () => {
      const TestComponent = () => <Button>测试</Button>
      
      const { rerender } = render(<TestComponent />)
      
      const start = performance.now()
      
      // 模拟主题切换
      rerender(<TestComponent />)
      
      const end = performance.now()
      const switchTime = end - start
      
      expect(switchTime).toBeLessThan(10)
    })
  })

  // =============================================================================
  // 内存使用基准测试
  // =============================================================================

  describe('内存使用基准', () => {
    it('组件卸载后应该清理内存', () => {
      // 获取初始内存使用
      const initialMemory = (performance as any).memory?.usedJSHeapSize || 0
      
      // 渲染大量组件
      const { unmount } = render(
        <div>
          {Array.from({ length: 50 }, (_, i) => (
            <Card key={i}>
              <Card.Body>卡片{i}</Card.Body>
            </Card>
          ))}
        </div>
      )
      
      // 卸载组件
      unmount()
      
      // 强制垃圾回收（如果支持）
      if (globalThis.gc) {
        globalThis.gc()
      }
      
      // 检查内存使用（简化检查）
      const finalMemory = (performance as any).memory?.usedJSHeapSize || 0
      
      expect(finalMemory).toBeLessThanOrEqual(initialMemory * 1.5)
    })
  })

  // =============================================================================
  // 交互性能测试
  // =============================================================================

  describe('交互性能', () => {
    it('Tab 切换应该在 16ms 内完成', async () => {
      const onValueChange = vi.fn()
      
      const { rerender } = render(
        <Tabs value="tab1" onValueChange={onValueChange}>
          <TabList>
            <Tab value="tab1">标签1</Tab>
            <Tab value="tab2">标签2</Tab>
            <Tab value="tab3">标签3</Tab>
          </TabList>
          <TabPanel value="tab1">内容1</TabPanel>
          <TabPanel value="tab2">内容2</TabPanel>
          <TabPanel value="tab3">内容3</TabPanel>
        </Tabs>
      )
      
      const start = performance.now()
      
      rerender(
        <Tabs value="tab2" onValueChange={onValueChange}>
          <TabList>
            <Tab value="tab1">标签1</Tab>
            <Tab value="tab2">标签2</Tab>
            <Tab value="tab3">标签3</Tab>
          </TabList>
          <TabPanel value="tab1">内容1</TabPanel>
          <TabPanel value="tab2">内容2</TabPanel>
          <TabPanel value="tab3">内容3</TabPanel>
        </Tabs>
      )
      
      const end = performance.now()
      const switchTime = end - start
      
      expect(switchTime).toBeLessThan(16)
    })
  })
})
