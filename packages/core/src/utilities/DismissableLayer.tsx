import React, { forwardRef, useEffect, useRef, useState, useCallback } from 'react'

export interface DismissableLayerProps {
  /** 子元素 */
  children: React.ReactNode
  /** 是否启用可关闭层 */
  enabled?: boolean
  /** 是否启用ESC键关闭 */
  escapeKeyDisabled?: boolean
  /** 是否启用点击外部关闭 */
  outsideClickDisabled?: boolean
  /** 是否启用PointerDown事件 */
  pointerDownDisabled?: boolean
  /** 自定义关闭处理函数 */
  onDismiss?: () => void
  /** ESC键关闭回调 */
  onEscapeKeyDown?: (event: KeyboardEvent) => void
  /** 外部点击回调 */
  onOutsideClick?: (event: MouseEvent | TouchEvent) => void
  /** PointerDown回调 */
  onPointerDown?: (event: PointerEvent) => void
  /** 禁用关闭的元素选择器 */
  dismissDisabledElements?: string[]
  /** 自定义容器 */
  container?: HTMLElement | null
}

export const DismissableLayer = forwardRef<HTMLDivElement, DismissableLayerProps>(
  ({
    children,
    enabled = true,
    escapeKeyDisabled = false,
    outsideClickDisabled = false,
    pointerDownDisabled = false,
    onDismiss,
    onEscapeKeyDown,
    onOutsideClick,
    onPointerDown,
    dismissDisabledElements = ['[data-dismiss-disabled]'],
    container,
    ...props
  }, ref) => {
    const layerRef = useRef<HTMLDivElement>(null)
    const [isInteractingOutside, setIsInteractingOutside] = useState(false)

    // 合并refs
    const mergedRef = React.useCallback((node: HTMLDivElement) => {
      layerRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }, [ref])

    // 检查元素是否应该忽略外部点击
    const shouldIgnoreOutsideClick = useCallback((target: EventTarget): boolean => {
      if (!layerRef.current) return false

      // 检查是否在层内部
      if (layerRef.current.contains(target as Node)) {
        return true
      }

      // 检查是否在禁用元素内
      for (const selector of dismissDisabledElements) {
        const element = (target as Element).closest(selector)
        if (element) {
          return true
        }
      }

      return false
    }, [dismissDisabledElements])

    // ESC键处理
    const handleEscapeKeyDown = useCallback((event: KeyboardEvent) => {
      if (!enabled || escapeKeyDisabled || event.key !== 'Escape') return

      // 停止事件传播
      event.preventDefault()
      event.stopPropagation()

      // 调用自定义回调
      onEscapeKeyDown?.(event)

      // 调用关闭回调
      onDismiss?.()
    }, [enabled, escapeKeyDisabled, onEscapeKeyDown, onDismiss])

    // 外部点击处理
    const handleOutsideClick = useCallback((event: MouseEvent | TouchEvent) => {
      if (!enabled || outsideClickDisabled || shouldIgnoreOutsideClick(event.target)) {
        return
      }

      // 防止重复触发
      if (isInteractingOutside) return

      setIsInteractingOutside(true)

      // 调用自定义回调
      onOutsideClick?.(event)

      // 调用关闭回调
      onDismiss?.()

      // 重置状态
      setTimeout(() => setIsInteractingOutside(false), 0)
    }, [enabled, outsideClickDisabled, shouldIgnoreOutsideClick, isInteractingOutside, onOutsideClick, onDismiss])

    // PointerDown处理
    const handlePointerDown = useCallback((event: PointerEvent) => {
      if (!enabled || pointerDownDisabled || shouldIgnoreOutsideClick(event.target)) {
        return
      }

      // 调用自定义回调
      onPointerDown?.(event)
    }, [enabled, pointerDownDisabled, shouldIgnoreOutsideClick, onPointerDown])

    // 处理层内部PointerDown
    const handleLayerPointerDown = useCallback((event: React.PointerEvent) => {
      if (!enabled) return

      // 阻止事件冒泡
      event.stopPropagation()
    }, [enabled])

    // 添加事件监听器
    useEffect(() => {
      if (!enabled) return

      const targetElement = container || document

      // 监听键盘事件
      targetElement.addEventListener('keydown', handleEscapeKeyDown as EventListener)

      // 监听点击事件
      targetElement.addEventListener('mousedown', handleOutsideClick as EventListener)
      targetElement.addEventListener('touchstart', handleOutsideClick as EventListener)

      // 监听PointerDown事件
      targetElement.addEventListener('pointerdown', handlePointerDown as EventListener)

      return () => {
        targetElement.removeEventListener('keydown', handleEscapeKeyDown as EventListener)
        targetElement.removeEventListener('mousedown', handleOutsideClick as EventListener)
        targetElement.removeEventListener('touchstart', handleOutsideClick as EventListener)
        targetElement.removeEventListener('pointerdown', handlePointerDown as EventListener)
      }
    }, [enabled, handleEscapeKeyDown, handleOutsideClick, handlePointerDown, container])

    return (
      <div
        ref={mergedRef}
        onPointerDown={handleLayerPointerDown}
        data-dismissable-layer
        {...props}
      >
        {children}
      </div>
    )
  }
)

DismissableLayer.displayName = 'DismissableLayer'

// 可关闭层组合组件
export interface DismissableLayerGroupProps {
  /** 子元素 */
  children: React.ReactNode
  /** 是否启用堆栈管理 */
  stack?: boolean
  /** 自定义关闭处理函数 */
  onDismiss?: () => void
}

// 全局状态管理
const dismissableLayersStack = new Set<HTMLDivElement>()

export const DismissableLayerGroup = forwardRef<HTMLDivElement, DismissableLayerGroupProps>(
  ({ children, stack = true, onDismiss, ...props }, ref) => {
    const layerRef = useRef<HTMLDivElement>(null)

    // 添加到堆栈
    useEffect(() => {
      if (!stack || !layerRef.current) return

      dismissableLayersStack.add(layerRef.current)

      return () => {
        dismissableLayersStack.delete(layerRef.current!)
      }
    }, [stack])

    // 处理堆栈中的关闭
    const handleStackDismiss = useCallback(() => {
      if (!stack) return

      // 检查是否是堆栈中的顶层元素
      const layers = Array.from(dismissableLayersStack)
      const topLayer = layers[layers.length - 1]

      if (topLayer === layerRef.current) {
        onDismiss?.()
      }
    }, [stack, onDismiss])

    return (
      <DismissableLayer
        ref={layerRef}
        onDismiss={handleStackDismiss}
        {...props}
      >
        {children}
      </DismissableLayer>
    )
  }
)

DismissableLayerGroup.displayName = 'DismissableLayerGroup'

// 简化的可关闭层组件
export interface SimpleDismissableLayerProps extends Omit<DismissableLayerProps, 'onDismiss'> {
  /** 是否显示 */
  open: boolean
  /** 关闭回调 */
  onClose: () => void
}

export const SimpleDismissableLayer = forwardRef<HTMLDivElement, SimpleDismissableLayerProps>(
  ({ open, onClose, ...props }, ref) => {
    if (!open) return null

    return (
      <DismissableLayer
        ref={ref}
        enabled={open}
        onDismiss={onClose}
        {...props}
      />
    )
  }
)

SimpleDismissableLayer.displayName = 'SimpleDismissableLayer'

// 模态框可关闭层组件
export interface ModalDismissableLayerProps extends Omit<DismissableLayerProps, 'outsideClickDisabled' | 'escapeKeyDisabled'> {}

export const ModalDismissableLayer = forwardRef<HTMLDivElement, ModalDismissableLayerProps>(
  (props, ref) => (
    <DismissableLayer
      ref={ref}
      outsideClickDisabled={false}
      escapeKeyDisabled={false}
      {...props}
    />
  )
)

ModalDismissableLayer.displayName = 'ModalDismissableLayer'

// 工具提示可关闭层组件
export interface TooltipDismissableLayerProps extends Omit<DismissableLayerProps, 'outsideClickDisabled' | 'escapeKeyDisabled'> {}

export const TooltipDismissableLayer = forwardRef<HTMLDivElement, TooltipDismissableLayerProps>(
  (props, ref) => (
    <DismissableLayer
      ref={ref}
      outsideClickDisabled={true}
      escapeKeyDisabled={true}
      {...props}
    />
  )
)

TooltipDismissableLayer.displayName = 'TooltipDismissableLayer'