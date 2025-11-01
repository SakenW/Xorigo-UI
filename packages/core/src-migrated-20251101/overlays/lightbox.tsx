import React, { forwardRef, useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence, type HTMLMotionProps } from 'framer-motion'
import { createPortal } from 'react-dom'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils'

// Lightbox变体配置
const lightboxVariants = cva(
  'fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center',
  {
    variants: {
      variant: {
        default: 'bg-black/90',
        dark: 'bg-black/95',
        light: 'bg-white/95',
        blur: 'bg-black/80 backdrop-blur-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

// 图片容器变体
const imageContainerVariants = cva(
  'relative max-w-full max-h-full flex items-center justify-center',
  {
    variants: {
      size: {
        sm: 'max-w-2xl max-h-[80vh]',
        md: 'max-w-4xl max-h-[85vh]',
        lg: 'max-w-6xl max-h-[90vh]',
        xl: 'max-w-7xl max-h-[95vh]',
        full: 'max-w-full max-h-full',
      },
    },
    defaultVariants: {
      size: 'lg',
    },
  }
)

// 缩略图容器变体
const thumbnailVariants = cva(
  'flex gap-2 overflow-x-auto p-4 bg-black/50 rounded-lg',
  {
    variants: {
      position: {
        bottom: 'absolute bottom-4 left-4 right-4',
        top: 'absolute top-4 left-4 right-4',
        left: 'absolute left-4 top-1/2 -translate-y-1/2 flex-col max-h-full',
        right: 'absolute right-4 top-1/2 -translate-y-1/2 flex-col max-h-full',
      },
    },
    defaultVariants: {
      position: 'bottom',
    },
  }
)

// 缩略图项变体
const thumbnailItemVariants = cva(
  'relative overflow-hidden rounded cursor-pointer transition-all duration-200 border-2',
  {
    variants: {
      isActive: {
        true: 'border-blue-500 scale-110',
        false: 'border-transparent hover:border-gray-400',
      },
      size: {
        sm: 'w-12 h-12',
        md: 'w-16 h-16',
        lg: 'w-20 h-20',
      },
    },
    defaultVariants: {
      isActive: false,
      size: 'md',
    },
  }
)

// 控制按钮变体
const controlButtonVariants = cva(
  'absolute flex items-center justify-center w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all duration-200',
  {
    variants: {
      position: {
        prev: 'left-4',
        next: 'right-4',
        close: 'top-4 right-4',
      },
    },
  }
)

export interface LightboxProps
  extends Omit<HTMLMotionProps<'div'>, 'size'>,
    VariantProps<typeof lightboxVariants> {
  /** 是否打开 */
  open: boolean
  /** 关闭回调 */
  onClose: () => void
  /** 图片列表 */
  images: LightboxImage[]
  /** 当前图片索引 */
  currentIndex?: number
  /** 图片变化回调 */
  onIndexChange?: (index: number) => void
  /** 图片容器大小 */
  imageSize?: VariantProps<typeof imageContainerVariants>['size']
  /** 是否显示缩略图 */
  showThumbnails?: boolean
  /** 缩略图位置 */
  thumbnailPosition?: VariantProps<typeof thumbnailVariants>['position']
  /** 缩略图大小 */
  thumbnailSize?: VariantProps<typeof thumbnailItemVariants>['size']
  /** 是否显示标题 */
  showTitle?: boolean
  /** 是否显示描述 */
  showDescription?: boolean
  /** 是否显示控制按钮 */
  showControls?: boolean
  /** 是否启用键盘导航 */
  enableKeyboard?: boolean
  /** 是否启用触摸滑动 */
  enableTouch?: boolean
  /** 是否启用缩放 */
  enableZoom?: boolean
  /** 自定义容器 */
  container?: HTMLElement | null
  /** z-index */
  zIndex?: number
}

export interface LightboxImage {
  /** 图片URL */
  src: string
  /** 缩略图URL */
  thumbnail?: string
  /** 标题 */
  title?: string
  /** 描述 */
  description?: string
  /** 替代文本 */
  alt?: string
  /** 宽度 */
  width?: number
  /** 高度 */
  height?: number
}

export const Lightbox = forwardRef<HTMLDivElement, LightboxProps>(
  ({
    open,
    onClose,
    images,
    currentIndex: controlledIndex,
    onIndexChange,
    imageSize = 'lg',
    variant = 'default',
    showThumbnails = true,
    thumbnailPosition = 'bottom',
    thumbnailSize = 'md',
    showTitle = true,
    showDescription = true,
    showControls = true,
    enableKeyboard = true,
    enableTouch = true,
    enableZoom = false,
    container,
    zIndex = 9999,
    className,
    ...props
  }, ref) => {
    const [internalIndex, setInternalIndex] = useState(controlledIndex || 0)
    const [isZoomed, setIsZoomed] = useState(false)
    const [zoomLevel, setZoomLevel] = useState(1)
    const lightboxRef = useRef<HTMLDivElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    // 当前图片索引（受控或非受控）
    const currentIndex = controlledIndex !== undefined ? controlledIndex : internalIndex

    // 当前图片
    const currentImage = images[currentIndex]

    // 上一张图片
    const goToPrevious = useCallback(() => {
      const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
      if (controlledIndex === undefined) {
        setInternalIndex(newIndex)
      }
      onIndexChange?.(newIndex)
    }, [currentIndex, images.length, controlledIndex, onIndexChange])

    // 下一张图片
    const goToNext = useCallback(() => {
      const newIndex = (currentIndex + 1) % images.length
      if (controlledIndex === undefined) {
        setInternalIndex(newIndex)
      }
      onIndexChange?.(newIndex)
    }, [currentIndex, images.length, controlledIndex, onIndexChange])

    // 跳转到指定图片
    const goToIndex = useCallback((index: number) => {
      if (index >= 0 && index < images.length) {
        if (controlledIndex === undefined) {
          setInternalIndex(index)
        }
        onIndexChange?.(index)
      }
    }, [images.length, controlledIndex, onIndexChange])

    // 键盘导航
    useEffect(() => {
      if (!open || !enableKeyboard) return

      const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowLeft':
            event.preventDefault()
            goToPrevious()
            break
          case 'ArrowRight':
            event.preventDefault()
            goToNext()
            break
          case 'Escape':
            event.preventDefault()
            onClose()
            break
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open, enableKeyboard, goToPrevious, goToNext, onClose])

    // 缩放功能
    const handleZoomIn = useCallback(() => {
      if (enableZoom) {
        setZoomLevel(prev => Math.min(prev + 0.5, 3))
        setIsZoomed(true)
      }
    }, [enableZoom])

    const handleZoomOut = useCallback(() => {
      if (enableZoom) {
        setZoomLevel(prev => Math.max(prev - 0.5, 1))
        if (zoomLevel - 0.5 <= 1) {
          setIsZoomed(false)
        }
      }
    }, [enableZoom, zoomLevel])

    const handleZoomReset = useCallback(() => {
      if (enableZoom) {
        setZoomLevel(1)
        setIsZoomed(false)
      }
    }, [enableZoom])

    // 触摸滑动支持（简化实现）
    const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)

    const handleTouchStart = useCallback((event: React.TouchEvent) => {
      if (enableTouch) {
        setTouchStart({
          x: event.touches[0].clientX,
          y: event.touches[0].clientY,
        })
      }
    }, [enableTouch])

    const handleTouchEnd = useCallback((event: React.TouchEvent) => {
      if (!enableTouch || !touchStart) return

      const touchEnd = {
        x: event.changedTouches[0].clientX,
        y: event.changedTouches[0].clientY,
      }

      const deltaX = touchEnd.x - touchStart.x
      const deltaY = touchEnd.y - touchStart.y

      // 水平滑动阈值
      if (Math.abs(deltaX) > 50 && Math.abs(deltaY) < 100) {
        if (deltaX > 0) {
          goToPrevious()
        } else {
          goToNext()
        }
      }

      setTouchStart(null)
    }, [enableTouch, touchStart, goToPrevious, goToNext])

    // 合并refs
    const mergedRef = React.useCallback((node: HTMLDivElement) => {
      lightboxRef.current = node
      if (typeof ref === 'function') {
        ref(node)
      } else if (ref) {
        ref.current = node
      }
    }, [ref])

    // 渲染内容
    const renderContent = () => (
      <AnimatePresence>
        {open && (
          <motion.div
            ref={mergedRef}
            className={cn(lightboxVariants({ variant }), className)}
            style={{ zIndex }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            {...props}
          >
            {/* 关闭按钮 */}
            {showControls && (
              <button
                onClick={onClose}
                className={controlButtonVariants({ position: 'close' })}
                aria-label="关闭灯箱"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* 上一张按钮 */}
            {showControls && images.length > 1 && (
              <button
                onClick={goToPrevious}
                className={controlButtonVariants({ position: 'prev' })}
                aria-label="上一张图片"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* 下一张按钮 */}
            {showControls && images.length > 1 && (
              <button
                onClick={goToNext}
                className={controlButtonVariants({ position: 'next' })}
                aria-label="下一张图片"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* 图片容器 */}
            <div className={imageContainerVariants({ size: imageSize })}>
              <motion.img
                ref={imageRef}
                src={currentImage?.src}
                alt={currentImage?.alt || 'Lightbox image'}
                className={cn(
                  'max-w-full max-h-full object-contain',
                  isZoomed && 'cursor-zoom-out'
                )}
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.3s ease',
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                onClick={enableZoom ? (isZoomed ? handleZoomReset : handleZoomIn) : undefined}
              />
            </div>

            {/* 标题和描述 */}
            {(showTitle || showDescription) && currentImage && (
              <div className="absolute bottom-4 left-4 right-4 text-white text-center">
                {showTitle && currentImage.title && (
                  <h2 className="text-lg font-semibold mb-1">
                    {currentImage.title}
                  </h2>
                )}
                {showDescription && currentImage.description && (
                  <p className="text-sm opacity-80">
                    {currentImage.description}
                  </p>
                )}
              </div>
            )}

            {/* 缩略图 */}
            {showThumbnails && images.length > 1 && (
              <div className={thumbnailVariants({ position: thumbnailPosition })}>
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => goToIndex(index)}
                    className={thumbnailItemVariants({
                      isActive: index === currentIndex,
                      size: thumbnailSize,
                    })}
                    aria-label={`查看图片 ${index + 1}`}
                  >
                    <img
                      src={image.thumbnail || image.src}
                      alt={image.alt || `缩略图 ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* 图片计数 */}
            {images.length > 1 && (
              <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    )

    // Portal渲染
    if (!open) return null
    const portalContainer = container || document.body
    return createPortal(renderContent(), portalContainer)
  }
)

Lightbox.displayName = 'Lightbox'

// 预设组件
export const ImageLightbox = forwardRef<HTMLDivElement, Omit<LightboxProps, 'images'>>(
  ({ src, thumbnail, title, description, alt, ...props }, ref) => (
    <Lightbox
      ref={ref}
      images={[{ src, thumbnail, title, description, alt }]}
      showThumbnails={false}
      showControls={false}
      {...props}
    />
  )
)

ImageLightbox.displayName = 'ImageLightbox'

export {
  lightboxVariants,
  imageContainerVariants,
  thumbnailVariants,
  thumbnailItemVariants,
  controlButtonVariants,
}