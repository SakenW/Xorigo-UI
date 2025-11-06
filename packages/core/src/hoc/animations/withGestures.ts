/**
 * @fileoverview withGestures HOC - 手势动画高阶组件
 * @description 为组件提供手势动画功能，支持拖拽、滑动、缩放等手势
 */

import React, { useState, useRef, useCallback, useEffect } from 'react'
import { HOC, ComponentType } from '../types'

/**
 * 手势配置
 */
export interface GesturesConfig {
  /**
   * 是否启用拖拽
   */
  drag?: boolean

  /**
   * 拖拽方向限制
   */
  dragConstraints?: {
    top?: number
    bottom?: number
    left?: number
    right?: number
  }

  /**
   * 拖拽弹性
   */
  dragElastic?: number

  /**
   * 是否启用滑动手势
   */
  swipe?: boolean

  /**
   * 滑动阈值
   */
  swipeThreshold?: number

  /**
   * 是否启用缩放手势
   */
  pinch?: boolean

  /**
   * 缩放阈值
   */
  pinchThreshold?: number

  /**
   * 是否启用旋转手势
   */
  rotate?: boolean

  /**
   * 旋转阈值
   */
  rotateThreshold?: number

  /**
   * 手势回调
   */
  onDragStart?: (event: PointerEvent | TouchEvent | MouseEvent) => void
  onDragEnd?: (event: PointerEvent | TouchEvent | MouseEvent) => void
  onDrag?: (delta: { x: number; y: number }) => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onPinchStart?: (distance: number) => void
  onPinchEnd?: (distance: number) => void
  onPinch?: (distance: number) => void
  onRotateStart?: (angle: number) => void
  onRotateEnd?: (angle: number) => void
  onRotate?: (angle: number) => void
}

/**
 * 手势状态
 */
export interface GesturesState {
  isDragging: boolean
  isSwiping: boolean
  isPinching: boolean
  isRotating: boolean
  position: { x: number; y: number }
  scale: number
  rotation: number
  dragOffset: { x: number; y: number }
}

/**
 * 手势上下文
 */
export interface GesturesContextValue {
  /**
   * 手势状态
   */
  gesturesState: GesturesState

  /**
   * 手势控制方法
   */
  dragTo: (x: number, y: number) => void
  resetPosition: () => void
  resetScale: () => void
  resetRotation: () => void
  resetAll: () => void

  /**
   * 检查是否在拖拽
   */
  isDragging: () => boolean

  /**
   * 检查是否在缩放
   */
  isPinching: () => boolean

  /**
   * 检查是否在旋转
   */
  isRotating: () => boolean

  /**
   * 获取当前位置
   */
  getPosition: () => { x: number; y: number }

  /**
   * 获取当前缩放
   */
  getScale: () => number

  /**
   * 获取当前旋转
   */
  getRotation: () => number
}

/**
 * 计算两点间距离
 */
function calculateDistance(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y
  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * 计算角度
 */
function calculateAngle(point1: { x: number; y: number }, point2: { x: number; y: number }): number {
  const dx = point2.x - point1.x
  const dy = point2.y - point1.y
  return Math.atan2(dy, dx) * (180 / Math.PI)
}

/**
 * withGestures HOC - 提供手势动画功能
 *
 * @param config 手势配置
 * @returns HOC函数
 *
 * @example
 * ```tsx
 * const DraggableComponent = withGestures({
 *   drag: true,
 *   dragConstraints: { top: -100, bottom: 100, left: -100, right: 100 },
 *   onDrag: (delta) => console.log('Dragged:', delta),
 *   onDragEnd: () => console.log('Drag ended')
 * })(BaseComponent)
 * ```
 */
export function withGestures<T extends Record<string, any> = {}>(
  config: GesturesConfig
): HOC<T, T & GesturesContextValue> {
  const {
    drag = false,
    dragConstraints,
    dragElastic = 0.1,
    swipe = false,
    swipeThreshold = 50,
    pinch = false,
    pinchThreshold = 50,
    rotate = false,
    rotateThreshold = 30,
    onDragStart,
    onDragEnd,
    onDrag,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    onPinchStart,
    onPinchEnd,
    onPinch,
    onRotateStart,
    onRotateEnd,
    onRotate,
  } = config

  const displayName = `withGestures(${Component.displayName || Component.name || 'Component'})`

  const GesturesComponent = React.forwardRef<any, T & GesturesContextValue>((props, ref) => {
    // 手势状态
    const [gesturesState, setGesturesState] = useState<GesturesState>({
      isDragging: false,
      isSwiping: false,
      isPinching: false,
      isRotating: false,
      position: { x: 0, y: 0 },
      scale: 1,
      rotation: 0,
      dragOffset: { x: 0, y: 0 },
    })

    // refs
    const elementRef = useRef<HTMLElement>(null)
    const startPositionRef = useRef({ x: 0, y: 0 })
    const currentPositionRef = useRef({ x: 0, y: 0 })
    const lastTouchesRef = useRef<TouchList | null>(null)
    const lastDistanceRef = useRef<number>(0)
    const lastAngleRef = useRef<number>(0)

    // 拖拽到指定位置
    const dragTo = useCallback((x: number, y: number) => {
      setGesturesState(prev => ({
        ...prev,
        position: { x, y },
        dragOffset: { x: x - startPositionRef.current.x, y: y - startPositionRef.current.y },
      }))
    }, [])

    // 重置位置
    const resetPosition = useCallback(() => {
      setGesturesState(prev => ({
        ...prev,
        position: { x: 0, y: 0 },
        dragOffset: { x: 0, y: 0 },
      }))
    }, [])

    // 重置缩放
    const resetScale = useCallback(() => {
      setGesturesState(prev => ({
        ...prev,
        scale: 1,
      }))
    }, [])

    // 重置旋转
    const resetRotation = useCallback(() => {
      setGesturesState(prev => ({
        ...prev,
        rotation: 0,
      }))
    }, [])

    // 重置所有
    const resetAll = useCallback(() => {
      setGesturesState(prev => ({
        ...prev,
        position: { x: 0, y: 0 },
        scale: 1,
        rotation: 0,
        dragOffset: { x: 0, y: 0 },
      }))
    }, [])

    // 检查是否在拖拽
    const isDragging = useCallback(() => {
      return gesturesState.isDragging
    }, [gesturesState.isDragging])

    // 检查是否在缩放
    const isPinching = useCallback(() => {
      return gesturesState.isPinching
    }, [gesturesState.isPinching])

    // 检查是否在旋转
    const isRotating = useCallback(() => {
      return gesturesState.isRotating
    }, [gesturesState.isRotating])

    // 获取当前位置
    const getPosition = useCallback(() => {
      return { ...gesturesState.position }
    }, [gesturesState.position])

    // 获取当前缩放
    const getScale = useCallback(() => {
      return gesturesState.scale
    }, [gesturesState.scale])

    // 获取当前旋转
    const getRotation = useCallback(() => {
      return gesturesState.rotation
    }, [gesturesState.rotation])

    // 开始拖拽
    const startDrag = useCallback((clientX: number, clientY: number) => {
      const rect = elementRef.current?.getBoundingClientRect()
      if (!rect) return

      startPositionRef.current = {
        x: clientX - rect.left - gesturesState.position.x,
        y: clientY - rect.top - gesturesState.position.y,
      }
      currentPositionRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      }

      setGesturesState(prev => ({
        ...prev,
        isDragging: true,
      }))

      if (onDragStart) {
        onDragStart({ clientX, clientY } as any)
      }
    }, [gesturesState.position, onDragStart])

    // 拖拽移动
    const dragMove = useCallback((clientX: number, clientY: number) => {
      if (!gesturesState.isDragging) return

      const rect = elementRef.current?.getBoundingClientRect()
      if (!rect) return

      currentPositionRef.current = {
        x: clientX - rect.left,
        y: clientY - rect.top,
      }

      const newX = clientX - rect.left - startPositionRef.current.x
      const newY = clientY - rect.top - startPositionRef.current.y

      // 应用约束
      let constrainedX = newX
      let constrainedY = newY

      if (dragConstraints) {
        if (dragConstraints.left !== undefined) {
          constrainedX = Math.max(constrainedX, dragConstraints.left)
        }
        if (dragConstraints.right !== undefined) {
          constrainedX = Math.min(constrainedX, dragConstraints.right)
        }
        if (dragConstraints.top !== undefined) {
          constrainedY = Math.max(constrainedY, dragConstraints.top)
        }
        if (dragConstraints.bottom !== undefined) {
          constrainedY = Math.min(constrainedY, dragConstraints.bottom)
        }
      }

      const delta = {
        x: constrainedX - gesturesState.position.x,
        y: constrainedY - gesturesState.position.y,
      }

      setGesturesState(prev => ({
        ...prev,
        position: { x: constrainedX, y: constrainedY },
        dragOffset: { x: constrainedX, y: constrainedY },
      }))

      if (onDrag) {
        onDrag(delta)
      }
    }, [gesturesState.isDragging, gesturesState.position, dragConstraints, onDrag])

    // 结束拖拽
    const endDrag = useCallback((clientX: number, clientY: number) => {
      if (!gesturesState.isDragging) return

      const deltaX = clientX - currentPositionRef.current.x
      const deltaY = clientY - currentPositionRef.current.y

      setGesturesState(prev => ({
        ...prev,
        isDragging: false,
      }))

      if (onDragEnd) {
        onDragEnd({ clientX, clientY } as any)
      }

      // 检测滑动手势
      if (swipe) {
        if (Math.abs(deltaX) > swipeThreshold) {
          if (deltaX > 0) {
            onSwipeRight?.()
          } else {
            onSwipeLeft?.()
          }
        }
        if (Math.abs(deltaY) > swipeThreshold) {
          if (deltaY > 0) {
            onSwipeDown?.()
          } else {
            onSwipeUp?.()
          }
        }
      }
    }, [gesturesState.isDragging, swipe, swipeThreshold, onDragEnd, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])

    // 开始缩放
    const startPinch = useCallback((touches: TouchList) => {
      if (touches.length < 2 || !pinch) return

      const distance = calculateDistance(
        { x: touches[0].clientX, y: touches[0].clientY },
        { x: touches[1].clientX, y: touches[1].clientY }
      )

      lastDistanceRef.current = distance

      setGesturesState(prev => ({
        ...prev,
        isPinching: true,
      }))

      if (onPinchStart) {
        onPinchStart(distance)
      }
    }, [pinch, onPinchStart])

    // 缩放移动
    const pinchMove = useCallback((touches: TouchList) => {
      if (touches.length < 2 || !gesturesState.isPinching) return

      const distance = calculateDistance(
        { x: touches[0].clientX, y: touches[0].clientY },
        { x: touches[1].clientX, y: touches[1].clientY }
      )

      const scale = distance / lastDistanceRef.current
      const newScale = Math.max(0.5, Math.min(3, gesturesState.scale * scale))

      setGesturesState(prev => ({
        ...prev,
        scale: newScale,
      }))

      if (onPinch) {
        onPinch(distance)
      }

      lastDistanceRef.current = distance
    }, [gesturesState.isPinching, gesturesState.scale, onPinch])

    // 结束缩放
    const endPinch = useCallback((touches: TouchList) => {
      if (touches.length >= 2 || !gesturesState.isPinching) return

      const distance = lastDistanceRef.current

      setGesturesState(prev => ({
        ...prev,
        isPinching: false,
      }))

      if (onPinchEnd) {
        onPinchEnd(distance)
      }
    }, [gesturesState.isPinching, onPinchEnd])

    // 开始旋转
    const startRotate = useCallback((touches: TouchList) => {
      if (touches.length < 2 || !rotate) return

      const angle = calculateAngle(
        { x: touches[0].clientX, y: touches[0].clientY },
        { x: touches[1].clientX, y: touches[1].clientY }
      )

      lastAngleRef.current = angle

      setGesturesState(prev => ({
        ...prev,
        isRotating: true,
      }))

      if (onRotateStart) {
        onRotateStart(angle)
      }
    }, [rotate, onRotateStart])

    // 旋转移动
    const rotateMove = useCallback((touches: TouchList) => {
      if (touches.length < 2 || !gesturesState.isRotating) return

      const angle = calculateAngle(
        { x: touches[0].clientX, y: touches[0].clientY },
        { x: touches[1].clientX, y: touches[1].clientY }
      )

      const deltaAngle = angle - lastAngleRef.current
      const newRotation = gesturesState.rotation + deltaAngle

      setGesturesState(prev => ({
        ...prev,
        rotation: newRotation,
      }))

      if (onRotate) {
        onRotate(newRotation)
      }

      lastAngleRef.current = angle
    }, [gesturesState.isRotating, gesturesState.rotation, onRotate])

    // 结束旋转
    const endRotate = useCallback((touches: TouchList) => {
      if (touches.length >= 2 || !gesturesState.isRotating) return

      const angle = lastAngleRef.current

      setGesturesState(prev => ({
        ...prev,
        isRotating: false,
      }))

      if (onRotateEnd) {
        onRotateEnd(angle)
      }
    }, [gesturesState.isRotating, onRotateEnd])

    // 事件处理
    const handlePointerDown = useCallback((e: React.PointerEvent) => {
      if (drag) {
        startDrag(e.clientX, e.clientY)
      }
    }, [drag, startDrag])

    const handlePointerMove = useCallback((e: React.PointerEvent) => {
      if (drag && gesturesState.isDragging) {
        e.preventDefault()
        dragMove(e.clientX, e.clientY)
      }
    }, [drag, gesturesState.isDragging, dragMove])

    const handlePointerUp = useCallback((e: React.PointerEvent) => {
      if (drag && gesturesState.isDragging) {
        endDrag(e.clientX, e.clientY)
      }
    }, [drag, gesturesState.isDragging, endDrag])

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
      lastTouchesRef.current = e.touches

      if (pinch) {
        startPinch(e.touches)
      }
      if (rotate) {
        startRotate(e.touches)
      }
    }, [pinch, rotate, startPinch, startRotate])

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
      e.preventDefault()

      if (pinch && gesturesState.isPinching) {
        pinchMove(e.touches)
      }
      if (rotate && gesturesState.isRotating) {
        rotateMove(e.touches)
      }
    }, [pinch, rotate, gesturesState.isPinching, gesturesState.isRotating, pinchMove, rotateMove])

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
      if (pinch) {
        endPinch(e.touches)
      }
      if (rotate) {
        endRotate(e.touches)
      }

      lastTouchesRef.current = e.touches
    }, [pinch, rotate, endPinch, endRotate])

    // 传递给组件的增强props
    const enhancedProps = {
      ...props,
      ref: (node: HTMLElement) => {
        if (typeof ref === 'function') {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
        elementRef.current = node
      },
      gesturesState,
      dragTo,
      resetPosition,
      resetScale,
      resetRotation,
      resetAll,
      isDragging,
      isPinching,
      isRotating,
      getPosition,
      getScale,
      getRotation,
      style: {
        ...props.style,
        transform: `translate(${gesturesState.position.x}px, ${gesturesState.position.y}px) scale(${gesturesState.scale}) rotate(${gesturesState.rotation}deg)`,
        cursor: drag && gesturesState.isDragging ? 'grabbing' : drag ? 'grab' : undefined,
        touchAction: 'none',
      },
      onPointerDown: handlePointerDown,
      onPointerMove: handlePointerMove,
      onPointerUp: handlePointerUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    }

    return <Component {...enhancedProps} />
  })

  GesturesComponent.displayName = displayName

  return GesturesComponent
}

// 便捷导出
export const WithGestures = withGestures

// 预设手势配置
export const withDragGestures = (constraints?: GesturesConfig['dragConstraints']) =>
  withGestures({
    drag: true,
    dragConstraints: constraints,
  })

export const withSwipeGestures = () =>
  withGestures({
    swipe: true,
    swipeThreshold: 50,
  })

export const withPinchGestures = () =>
  withGestures({
    pinch: true,
    pinchThreshold: 50,
  })

export const withRotateGestures = () =>
  withGestures({
    rotate: true,
    rotateThreshold: 30,
  })

export const withAllGestures = () =>
  withGestures({
    drag: true,
    swipe: true,
    pinch: true,
    rotate: true,
  })

export default withGestures
