/**
 * @fileoverview Playground Store 单元测试
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { usePlaygroundStore } from '../playground.store'

describe('PlaygroundStore', () => {
  beforeEach(() => {
    // 重置 store 状态
    usePlaygroundStore.getState().reset()
  })

  describe('组件状态管理', () => {
    it('应该正确设置当前组件', () => {
      const { setCurrentComponent, currentComponentId, currentProps } =
        usePlaygroundStore.getState()

      setCurrentComponent('Button', { variant: 'primary' })

      expect(usePlaygroundStore.getState().currentComponentId).toBe('Button')
      expect(usePlaygroundStore.getState().currentProps).toEqual({
        variant: 'primary',
      })
    })

    it('应该正确更新属性', () => {
      const { setCurrentComponent, updateProp } = usePlaygroundStore.getState()

      setCurrentComponent('Button', { variant: 'primary' })
      updateProp('size', 'lg')

      const state = usePlaygroundStore.getState()
      expect(state.currentProps).toEqual({
        variant: 'primary',
        size: 'lg',
      })
    })

    it('应该正确重置属性', () => {
      const { setCurrentComponent, updateProp, resetProps } =
        usePlaygroundStore.getState()

      setCurrentComponent('Button', { variant: 'primary' })
      updateProp('size', 'lg')
      resetProps()

      const state = usePlaygroundStore.getState()
      expect(state.currentProps).toEqual({ variant: 'primary' })
    })
  })

  describe('历史记录管理', () => {
    it('应该正确记录历史', () => {
      const { setCurrentComponent, updateProp, history } =
        usePlaygroundStore.getState()

      setCurrentComponent('Button', { variant: 'primary' })
      updateProp('size', 'lg')
      updateProp('disabled', true)

      const state = usePlaygroundStore.getState()
      expect(state.history.length).toBeGreaterThan(1)
    })

    it('应该正确执行撤销操作', () => {
      const { setCurrentComponent, updateProp, undo, canUndo } =
        usePlaygroundStore.getState()

      setCurrentComponent('Button', { variant: 'primary' })
      updateProp('size', 'lg')

      expect(usePlaygroundStore.getState().canUndo()).toBe(true)

      undo()

      const state = usePlaygroundStore.getState()
      expect(state.currentProps).toEqual({ variant: 'primary' })
    })

    it('应该正确执行重做操作', () => {
      const { setCurrentComponent, updateProp, undo, redo, canRedo } =
        usePlaygroundStore.getState()

      setCurrentComponent('Button', { variant: 'primary' })
      updateProp('size', 'lg')
      undo()

      expect(usePlaygroundStore.getState().canRedo()).toBe(true)

      redo()

      const state = usePlaygroundStore.getState()
      expect(state.currentProps).toEqual({
        variant: 'primary',
        size: 'lg',
      })
    })
  })

  describe('快照管理', () => {
    it('应该正确创建快照', () => {
      const { setCurrentComponent, createSnapshot } =
        usePlaygroundStore.getState()

      setCurrentComponent('Button', { variant: 'primary' })
      createSnapshot('测试快照', '这是一个测试快照')

      const state = usePlaygroundStore.getState()
      expect(state.snapshots.length).toBe(1)
      expect(state.snapshots[0].name).toBe('测试快照')
      expect(state.snapshots[0].description).toBe('这是一个测试快照')
    })

    it('应该正确恢复快照', () => {
      const { setCurrentComponent, createSnapshot, restoreSnapshot, updateProp } =
        usePlaygroundStore.getState()

      setCurrentComponent('Button', { variant: 'primary' })
      createSnapshot('测试快照')

      updateProp('size', 'lg')

      const snapshotId = usePlaygroundStore.getState().snapshots[0].id
      restoreSnapshot(snapshotId)

      const state = usePlaygroundStore.getState()
      expect(state.currentProps).toEqual({ variant: 'primary' })
    })

    it('应该正确删除快照', () => {
      const { setCurrentComponent, createSnapshot, deleteSnapshot } =
        usePlaygroundStore.getState()

      setCurrentComponent('Button', { variant: 'primary' })
      createSnapshot('测试快照')

      const snapshotId = usePlaygroundStore.getState().snapshots[0].id
      deleteSnapshot(snapshotId)

      const state = usePlaygroundStore.getState()
      expect(state.snapshots.length).toBe(0)
    })
  })

  describe('主题管理', () => {
    it('应该正确更新主题', () => {
      const { updateTheme } = usePlaygroundStore.getState()

      updateTheme({ mode: 'dark', density: 'compact' })

      const state = usePlaygroundStore.getState()
      expect(state.themeState.mode).toBe('dark')
      expect(state.themeState.density).toBe('compact')
    })
  })

  describe('对比模式', () => {
    it('应该正确进入对比模式', () => {
      const { setCompareMode, setCompareSnapshots, setCurrentComponent, createSnapshot } =
        usePlaygroundStore.getState()

      setCurrentComponent('Button', { variant: 'primary' })
      createSnapshot('快照 A')

      setCurrentComponent('Button', { variant: 'secondary' })
      createSnapshot('快照 B')

      const snapshots = usePlaygroundStore.getState().snapshots
      setCompareSnapshots(snapshots[0].id, snapshots[1].id)
      setCompareMode(true)

      const state = usePlaygroundStore.getState()
      expect(state.compareMode).toBe(true)
      expect(state.snapshotA).toBe(snapshots[0].id)
      expect(state.snapshotB).toBe(snapshots[1].id)
    })

    it('应该正确退出对比模式', () => {
      const { setCompareMode } = usePlaygroundStore.getState()

      setCompareMode(true)
      setCompareMode(false)

      const state = usePlaygroundStore.getState()
      expect(state.compareMode).toBe(false)
      expect(state.snapshotA).toBeNull()
      expect(state.snapshotB).toBeNull()
    })
  })

  describe('性能指标', () => {
    it('应该正确更新性能指标', () => {
      const { updateProp, setCurrentComponent } = usePlaygroundStore.getState()

      setCurrentComponent('Button', { variant: 'primary' })
      updateProp('size', 'lg')

      const state = usePlaygroundStore.getState()
      expect(state.performanceMetrics.updateCount).toBeGreaterThan(0)
      expect(state.performanceMetrics.renderTime).toBeGreaterThan(0)
    })
  })

  describe('UI 状态管理', () => {
    it('应该正确切换 UI 面板', () => {
      const { togglePropsEditor, toggleTokenInspector, toggleCodeViewer } =
        usePlaygroundStore.getState()

      const initialState = usePlaygroundStore.getState()
      const initialPropsEditor = initialState.showPropsEditor

      togglePropsEditor()
      expect(usePlaygroundStore.getState().showPropsEditor).toBe(!initialPropsEditor)

      const initialTokenInspector = initialState.showTokenInspector
      toggleTokenInspector()
      expect(usePlaygroundStore.getState().showTokenInspector).toBe(
        !initialTokenInspector
      )

      const initialCodeViewer = initialState.showCodeViewer
      toggleCodeViewer()
      expect(usePlaygroundStore.getState().showCodeViewer).toBe(!initialCodeViewer)
    })
  })
})
