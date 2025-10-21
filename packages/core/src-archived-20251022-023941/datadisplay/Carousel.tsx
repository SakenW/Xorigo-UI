import React, { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '../utils/cn'
import { cva, type VariantProps } from 'class-variance-authority'
import { motion, AnimatePresence, PanInfo } from 'framer-motion'

const carouselVariants = cva(
  "relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "",
        fade: "",
        slide: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface CarouselProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof carouselVariants> {
  autoplay?: boolean
  interval?: number
  infinite?: boolean
  showIndicators?: boolean
  showControls?: boolean
  indicatorType?: 'dots' | 'numbers' | 'thumbnails'
  orientation?: 'horizontal' | 'vertical'
  loop?: boolean
  pauseOnHover?: boolean
  swipeThreshold?: number
  onSlideChange?: (currentIndex: number) => void
}

interface CarouselContextValue {
  currentIndex: number
  totalItems: number
  goToSlide: (index: number) => void
  nextSlide: () => void
  prevSlide: () => void
  variant: 'default' | 'fade' | 'slide'
  infinite: boolean
  orientation: 'horizontal' | 'vertical'
}

const CarouselContext = React.createContext<CarouselContextValue | null>(null)

const useCarousel = () => {
  const context = React.useContext(CarouselContext)
  if (!context) {
    throw new Error('useCarousel must be used within a Carousel')
  }
  return context
}

const Carousel = React.forwardRef<HTMLDivElement, CarouselProps>(
  ({
    className,
    variant = "default",
    autoplay = false,
    interval = 3000,
    infinite = true,
    showIndicators = true,
    showControls = true,
    indicatorType = 'dots',
    orientation = 'horizontal',
    loop = true,
    pauseOnHover = true,
    swipeThreshold = 50,
    onSlideChange,
    children,
    ...props
  }, ref) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isPaused, setIsPaused] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
    const dragStartRef = useRef({ x: 0, y: 0 })

    const items = React.Children.toArray(children)
    const totalItems = items.length

    // 自动播放
    useEffect(() => {
      if (autoplay && !isPaused && !isDragging && totalItems > 1) {
        intervalRef.current = setInterval(() => {
          setCurrentIndex((prev) => {
            const nextIndex = prev + 1
            if (nextIndex >= totalItems) {
              return loop ? 0 : prev
            }
            return nextIndex
          })
        }, interval)
      }

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }, [autoplay, interval, isPaused, isDragging, totalItems, loop])

    // 滑动变化回调
    useEffect(() => {
      onSlideChange?.(currentIndex)
    }, [currentIndex, onSlideChange])

    const goToSlide = useCallback((index: number) => {
      if (index >= 0 && index < totalItems) {
        setCurrentIndex(index)
      }
    }, [totalItems])

    const nextSlide = useCallback(() => {
      setCurrentIndex((prev) => {
        const nextIndex = prev + 1
        if (nextIndex >= totalItems) {
          return loop ? 0 : prev
        }
        return nextIndex
      })
    }, [totalItems, loop])

    const prevSlide = useCallback(() => {
      setCurrentIndex((prev) => {
        const prevIndex = prev - 1
        if (prevIndex < 0) {
          return loop ? totalItems - 1 : prev
        }
        return prevIndex
      })
    }, [totalItems, loop])

    const handlePanEnd = (event: any, info: PanInfo) => {
      setIsDragging(false)

      if (orientation === 'horizontal') {
        if (Math.abs(info.offset.x) > swipeThreshold) {
          if (info.offset.x > 0) {
            prevSlide()
          } else {
            nextSlide()
          }
        }
      } else {
        if (Math.abs(info.offset.y) > swipeThreshold) {
          if (info.offset.y > 0) {
            prevSlide()
          } else {
            nextSlide()
          }
        }
      }
    }

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
      if (orientation === 'horizontal') {
        if (e.key === 'ArrowLeft') {
          prevSlide()
        } else if (e.key === 'ArrowRight') {
          nextSlide()
        }
      } else {
        if (e.key === 'ArrowUp') {
          prevSlide()
        } else if (e.key === 'ArrowDown') {
          nextSlide()
        }
      }
    }, [orientation, prevSlide, nextSlide])

    // 动画变体配置
    const getSlideVariants = () => {
      switch (variant) {
        case 'fade':
          return {
            enter: { opacity: 0 },
            center: { opacity: 1 },
            exit: { opacity: 0 },
          }
        case 'slide':
          if (orientation === 'horizontal') {
            return {
              enter: { x: '100%' },
              center: { x: 0 },
              exit: { x: '-100%' },
            }
          } else {
            return {
              enter: { y: '100%' },
              center: { y: 0 },
              exit: { y: '-100%' },
            }
          }
        default:
          return {
            enter: { opacity: 0, scale: 0.8 },
            center: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.8 },
          }
      }
    }

    const slideVariants = getSlideVariants()

    return (
      <CarouselContext.Provider
        value={{
          currentIndex,
          totalItems,
          goToSlide,
          nextSlide,
          prevSlide,
          variant: variant || 'default',
          infinite,
          orientation,
        }}
      >
        <div
          ref={ref}
          className={cn(carouselVariants({ variant, className }))}
          onMouseEnter={() => pauseOnHover && setIsPaused(true)}
          onMouseLeave={() => pauseOnHover && setIsPaused(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="region"
          aria-roledescription="轮播图"
          aria-label="图片轮播"
          {...props}
        >
          {/* 轮播内容 */}
          <div
            className={cn(
              "relative",
              orientation === 'horizontal' ? "h-full w-full" : "h-full w-full"
            )}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  duration: variant === 'fade' ? 0.5 : 0.3,
                  ease: "easeInOut",
                }}
                drag={orientation === 'horizontal' ? 'x' : 'y'}
                dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragStart={() => setIsDragging(true)}
                onDragEnd={handlePanEnd}
                className="h-full w-full"
              >
                {items[currentIndex]}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 控制按钮 */}
          {showControls && totalItems > 1 && (
            <>
              <button
                className={cn(
                  "absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 dark:bg-gray-800/80 dark:text-gray-200",
                  orientation === 'vertical' && "left-1/2 top-4 -translate-x-1/2"
                )}
                onClick={prevSlide}
                aria-label="上一张"
              >
                <svg
                  className={cn(
                    "h-5 w-5",
                    orientation === 'vertical' ? "rotate-90" : ""
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className={cn(
                  "absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-gray-800 shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:scale-110 dark:bg-gray-800/80 dark:text-gray-200",
                  orientation === 'vertical' && "left-1/2 bottom-4 -translate-x-1/2"
                )}
                onClick={nextSlide}
                aria-label="下一张"
              >
                <svg
                  className={cn(
                    "h-5 w-5",
                    orientation === 'vertical' ? "rotate-90" : ""
                  )}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* 指示器 */}
          {showIndicators && totalItems > 1 && (
            <div
              className={cn(
                "absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center space-x-2",
                orientation === 'vertical' && "left-4 top-1/2 bottom-auto flex-col -translate-y-1/2 space-x-0 space-y-2"
              )}
            >
              {items.map((_, index) => {
                if (indicatorType === 'dots') {
                  return (
                    <button
                      key={index}
                      className={cn(
                        "h-2 w-2 rounded-full transition-all",
                        currentIndex === index
                          ? "w-8 bg-white"
                          : "bg-white/50 hover:bg-white/75"
                      )}
                      onClick={() => goToSlide(index)}
                      aria-label={`前往第 ${index + 1} 张`}
                      aria-current={currentIndex === index}
                    />
                  )
                } else if (indicatorType === 'numbers') {
                  return (
                    <button
                      key={index}
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all",
                        currentIndex === index
                          ? "bg-white text-gray-900"
                          : "bg-white/50 text-gray-600 hover:bg-white/75 hover:text-gray-900"
                      )}
                      onClick={() => goToSlide(index)}
                      aria-label={`前往第 ${index + 1} 张`}
                    >
                      {index + 1}
                    </button>
                  )
                } else {
                  return (
                    <button
                      key={index}
                      className={cn(
                        "h-12 w-12 overflow-hidden rounded-md border-2 transition-all",
                        currentIndex === index
                          ? "border-white"
                          : "border-white/50 hover:border-white/75"
                      )}
                      onClick={() => goToSlide(index)}
                      aria-label={`前往第 ${index + 1} 张`}
                    >
                      <div className="h-full w-full scale-150 transform">
                        {items[index]}
                      </div>
                    </button>
                  )
                }
              })}
            </div>
          )}
        </div>
      </CarouselContext.Provider>
    )
  }
)

Carousel.displayName = "Carousel"

export { Carousel, carouselVariants, useCarousel }