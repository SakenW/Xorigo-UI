/**
 * 🖼️ 图片组件 - v2025.11.03
 *
 * 响应式图片组件，支持懒加载和多种效果
 * 可访问性优化，SEO友好
 *
 * @version 2025.11.03
 * @category Typography & Media
 * @layer component
 */

import React, { forwardRef, useState } from 'react'
import { cva } from '../utils/cva-standalone'
import { cn } from '../foundations/utils/cn'

/**
 * 图片对象位置
 */
export type ObjectPosition = 'center' | 'top' | 'bottom' | 'left' | 'right' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'

/**
 * 图片加载状态
 */
export type ImageLoadingState = 'loading' | 'loaded' | 'error'

/**
 * 图片变体样式
 */
const imageVariants = cva(
  'transition-all duration-300',
  {
    variants: {
      objectFit: {
        cover: 'object-cover',
        contain: 'object-contain',
        fill: 'object-fill',
        none: 'object-none',
        'scale-down': 'object-scale-down'
      },
      objectPosition: {
        center: 'object-center',
        top: 'object-top',
        bottom: 'object-bottom',
        left: 'object-left',
        right: 'object-right',
        'top-left': 'object-top-left',
        'top-right': 'object-top-right',
        'bottom-left': 'object-bottom-left',
        'bottom-right': 'object-bottom-right'
      },
      rounded: {
        none: '',
        sm: 'rounded-sm',
        base: 'rounded',
        md: 'rounded-md',
        lg: 'rounded-lg',
        xl: 'rounded-xl',
        '2xl': 'rounded-2xl',
        '3xl': 'rounded-3xl',
        full: 'rounded-full'
      },
      aspectRatio: {
        square: 'aspect-square',
        video: 'aspect-video',
        '4/3': 'aspect-[4/3]',
        '3/2': 'aspect-[3/2]',
        '16/9': 'aspect-[16/9]',
        '21/9': 'aspect-[21/9]'
      }
    },
    defaultVariants: {
      objectFit: 'cover',
      objectPosition: 'center',
      rounded: 'base'
    }
  }
)

/**
 * 图片组件属性
 */
export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'loading'> {
  /**
   * 图片URL
   */
  src: string

  /**
   * 替代文本
   */
  alt: string

  /**
   * 对象适配方式
   */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

  /**
   * 对象位置
   */
  objectPosition?: ObjectPosition

  /**
   * 圆角大小
   */
  rounded?: 'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'

  /**
   * 宽高比
   */
  aspectRatio?: 'square' | 'video' | '4/3' | '3/2' | '16/9' | '21/9'

  /**
   * 懒加载
   */
  lazy?: boolean

  /**
   * 占位图URL
   */
  placeholder?: string

  /**
   * 错误图片URL
   */
  fallback?: string

  /**
   * 加载状态回调
   */
  onLoadingChange?: (state: ImageLoadingState) => void

  /**
   * 是否显示加载骨架
   */
  showSkeleton?: boolean
}

/**
 * 图片组件
 */
export const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({
    src,
    alt,
    objectFit,
    objectPosition,
    rounded,
    aspectRatio,
    lazy = true,
    placeholder,
    fallback,
    onLoadingChange,
    showSkeleton = true,
    className,
    ...props
  }, ref) => {
    const [loadingState, setLoadingState] = useState<ImageLoadingState>('loading')
    const [imageSrc, setImageSrc] = useState(placeholder || src)

    React.useEffect(() => {
      if (!placeholder || placeholder === src) {
        setImageSrc(src)
      } else {
        // 预加载主图片
        const img = new Image()
        img.src = src
        img.onload = () => {
          setImageSrc(src)
          setLoadingState('loaded')
        }
        img.onerror = () => {
          if (fallback) {
            setImageSrc(fallback)
            setLoadingState('error')
          } else {
            setLoadingState('error')
          }
        }
      }
    }, [src, placeholder, fallback])

    React.useEffect(() => {
      onLoadingChange?.(loadingState)
    }, [loadingState, onLoadingChange])

    const handleError = () => {
      if (fallback && imageSrc !== fallback) {
        setImageSrc(fallback)
      }
      setLoadingState('error')
    }

    const handleLoad = () => {
      setLoadingState('loaded')
    }

    const imageClasses = cn(
      imageVariants({ objectFit, objectPosition, rounded, aspectRatio }),
      {
        'opacity-0': loadingState === 'loading',
        'opacity-100': loadingState === 'loaded',
        'blur-sm': loadingState === 'loading' && placeholder
      },
      className
    )

    if (showSkeleton && loadingState === 'loading') {
      return (
        <div
          className={cn(
            'bg-muted animate-pulse',
            imageVariants({ rounded, aspectRatio }),
            className
          )}
          aria-hidden="true"
        />
      )
    }

    return (
      <img
        ref={ref}
        src={imageSrc}
        alt={alt}
        loading={lazy ? 'lazy' : undefined}
        className={imageClasses}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    )
  }
)

Image.displayName = 'Image'

/**
 * 响应式图片组件
 */
export interface ResponsiveImageProps extends Omit<ImageProps, 'src' | 'srcSet'> {
  /**
   * 响应式图片源配置
   */
  sources: {
    src: string
    media?: string
    width?: number
    height?: number
  }[]

  /**
   * 默认图片源
   */
  defaultSrc: string
}

/**
 * 响应式图片组件
 */
export const ResponsiveImage = forwardRef<HTMLImageElement, ResponsiveImageProps>(
  ({
    sources,
    defaultSrc,
    alt,
    className,
    ...props
  }, ref) => {
    return (
      <picture>
        {sources.map((source, index) => (
          <source
            key={index}
            srcSet={source.src}
            media={source.media}
            width={source.width}
            height={source.height}
          />
        ))}
        <Image
          ref={ref}
          src={defaultSrc}
          alt={alt}
          className={className}
          {...props}
        />
      </picture>
    )
  }
)

ResponsiveImage.displayName = 'ResponsiveImage'

/**
 * 头像组件
 */
export interface AvatarProps extends Omit<ImageProps, 'aspectRatio'> {
  /**
   * 头像大小
   */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'

  /**
   * 是否显示状态指示器
   */
  showStatus?: boolean

  /**
   * 状态指示器颜色
   */
  statusColor?: 'green' | 'red' | 'yellow' | 'gray'
}

/**
 * 头像组件
 */
export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({
    size = 'md',
    showStatus = false,
    statusColor = 'green',
    className,
    ...props
  }, ref) => {
    const sizeClasses = {
      xs: 'h-6 w-6',
      sm: 'h-8 w-8',
      md: 'h-10 w-10',
      lg: 'h-12 w-12',
      xl: 'h-16 w-16',
      '2xl': 'h-20 w-20',
      '3xl': 'h-24 w-24'
    }

    const statusColors = {
      green: 'bg-green-500',
      red: 'bg-red-500',
      yellow: 'bg-yellow-500',
      gray: 'bg-gray-500'
    }

    return (
      <div className="relative inline-block">
        <Image
          ref={ref}
          className={cn(
            sizeClasses[size],
            'rounded-full',
            className
          )}
          aspectRatio="square"
          rounded="full"
          {...props}
        />
        {showStatus && (
          <span
            className={cn(
              'absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background',
              statusColors[statusColor]
            )}
          />
        )}
      </div>
    )
  }
)

Avatar.displayName = 'Avatar'