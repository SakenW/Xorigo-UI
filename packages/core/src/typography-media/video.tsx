/**
 * 🎥 视频组件 - v2025.11.03
 *
 * 响应式视频播放器，支持多种源格式
 * 可访问性优化，自定义控制
 *
 * @version 2025.11.03
 * @category Typography & Media
 * @layer component
 */

import React, { forwardRef, useState, useRef, useEffect } from 'react'
import { cva } from '../utils/cva-standalone'
import { cn } from '../foundations/utils/cn'

/**
 * 视频播放状态
 */
export type PlaybackState = 'idle' | 'playing' | 'paused' | 'ended' | 'loading' | 'error'

/**
 * 视频变体样式
 */
const videoVariants = cva(
  'w-full transition-all duration-300',
  {
    variants: {
      objectFit: {
        cover: 'object-cover',
        contain: 'object-contain',
        fill: 'object-fill',
        none: 'object-none',
        'scale-down': 'object-scale-down'
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
      objectFit: 'contain',
      rounded: 'base'
    }
  }
)

/**
 * 视频源接口
 */
export interface VideoSource {
  src: string
  type: string
  quality?: string
  label?: string
}

/**
 * 视频组件属性
 */
export interface VideoProps extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'children'> {
  /**
   * 视频源
   */
  src?: string

  /**
   * 多源视频配置
   */
  sources?: VideoSource[]

  /**
   * 海报图片URL
   */
  poster?: string

  /**
   * 对象适配方式
   */
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'

  /**
   * 圆角大小
   */
  rounded?: 'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full'

  /**
   * 宽高比
   */
  aspectRatio?: 'square' | 'video' | '4/3' | '3/2' | '16/9' | '21/9'

  /**
   * 是否显示控制栏
   */
  controls?: boolean

  /**
   * 是否自动播放
   */
  autoPlay?: boolean

  /**
   * 是否静音
   */
  muted?: boolean

  /**
   * 是否循环播放
   */
  loop?: boolean

  /**
   * 播放状态回调
   */
  onPlaybackStateChange?: (state: PlaybackState) => void

  /**
   * 自定义控制栏
   */
  customControls?: React.ReactNode

  /**
   * 错误回调
   */
  onError?: (error: Error) => void
}

/**
 * 视频组件
 */
export const Video = forwardRef<HTMLVideoElement, VideoProps>(
  ({
    src,
    sources,
    poster,
    objectFit,
    rounded,
    aspectRatio,
    controls = true,
    autoPlay = false,
    muted = false,
    loop = false,
    onPlaybackStateChange,
    customControls,
    onError,
    className,
    ...props
  }, ref) => {
    const [playbackState, setPlaybackState] = useState<PlaybackState>('idle')
    const [isControlsVisible, setIsControlsVisible] = useState(true)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [volume, setVolume] = useState(1)
    const videoRef = useRef<HTMLVideoElement>(null)
    const timeoutRef = useRef<NodeJS.Timeout>()

    // 使用 ref 链接
    const videoRefs = useRef(ref)
    videoRefs.current = ref

    useEffect(() => {
      const video = videoRef.current
      if (!video) return

      const handlePlay = () => {
        setPlaybackState('playing')
        onPlaybackStateChange?.('playing')
      }

      const handlePause = () => {
        setPlaybackState('paused')
        onPlaybackStateChange?.('paused')
      }

      const handleEnded = () => {
        setPlaybackState('ended')
        onPlaybackStateChange?.('ended')
      }

      const handleLoadStart = () => {
        setPlaybackState('loading')
        onPlaybackStateChange?.('loading')
      }

      const handleCanPlay = () => {
        setPlaybackState('paused')
        onPlaybackStateChange?.('paused')
      }

      const handleError = () => {
        setPlaybackState('error')
        const error = new Error('Video playback error')
        onError?.(error)
        onPlaybackStateChange?.('error')
      }

      const handleTimeUpdate = () => {
        setCurrentTime(video.currentTime)
      }

      const handleLoadedMetadata = () => {
        setDuration(video.duration)
      }

      video.addEventListener('play', handlePlay)
      video.addEventListener('pause', handlePause)
      video.addEventListener('ended', handleEnded)
      video.addEventListener('loadstart', handleLoadStart)
      video.addEventListener('canplay', handleCanPlay)
      video.addEventListener('error', handleError)
      video.addEventListener('timeupdate', handleTimeUpdate)
      video.addEventListener('loadedmetadata', handleLoadedMetadata)

      return () => {
        video.removeEventListener('play', handlePlay)
        video.removeEventListener('pause', handlePause)
        video.removeEventListener('ended', handleEnded)
        video.removeEventListener('loadstart', handleLoadStart)
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
        video.removeEventListener('timeupdate', handleTimeUpdate)
        video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      }
    }, [onPlaybackStateChange, onError])

    const handlePlayPause = () => {
      const video = videoRef.current
      if (!video) return

      if (video.paused) {
        video.play()
      } else {
        video.pause()
      }
    }

    const handleSeek = (newTime: number) => {
      const video = videoRef.current
      if (!video) return

      video.currentTime = newTime
      setCurrentTime(newTime)
    }

    const handleVolumeChange = (newVolume: number) => {
      const video = videoRef.current
      if (!video) return

      video.volume = newVolume
      setVolume(newVolume)
    }

    const handleMouseMove = () => {
      setIsControlsVisible(true)

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        if (playbackState === 'playing') {
          setIsControlsVisible(false)
        }
      }, 3000)
    }

    const formatTime = (time: number): string => {
      const minutes = Math.floor(time / 60)
      const seconds = Math.floor(time % 60)
      return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    const videoClasses = cn(
      videoVariants({ objectFit, rounded, aspectRatio }),
      className
    )

    // 准备视频源
    const videoSources = sources || (src ? [{ src, type: 'video/mp4' }] : [])

    return (
      <div
        className="relative group"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseMove}
      >
        <video
          ref={videoRef}
          poster={poster}
          autoPlay={autoPlay}
          muted={muted}
          loop={loop}
          className={videoClasses}
          {...props}
        >
          {videoSources.map((source, index) => (
            <source key={index} src={source.src} type={source.type} />
          ))}
          您的浏览器不支持视频播放。
        </video>

        {/* 自定义控制栏 */}
        {(controls && !customControls) && (
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300',
              {
                'opacity-0': !isControlsVisible,
                'opacity-100': isControlsVisible
              }
            )}
          >
            <div className="flex items-center gap-4">
              {/* 播放/暂停按钮 */}
              <button
                onClick={handlePlayPause}
                className="text-white hover:text-primary transition-colors"
                aria-label={playbackState === 'playing' ? '暂停' : '播放'}
              >
                {playbackState === 'playing' ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                )}
              </button>

              {/* 进度条 */}
              <div className="flex-1">
                <div className="bg-white/30 rounded-full h-1">
                  <div
                    className="bg-primary h-full rounded-full transition-all duration-100"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-white">{formatTime(currentTime)}</span>
                  <span className="text-xs text-white">{formatTime(duration)}</span>
                </div>
              </div>

              {/* 音量控制 */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleVolumeChange(volume === 0 ? 0.5 : 0)}
                  className="text-white hover:text-primary transition-colors"
                  aria-label={volume === 0 ? '开启声音' : '静音'}
                >
                  {volume === 0 ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z"/>
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                  className="w-20 h-1 bg-white/30 rounded-full appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* 自定义控制栏 */}
        {customControls && controls && (
          <div
            className={cn(
              'absolute bottom-0 left-0 right-0',
              {
                'opacity-0': !isControlsVisible,
                'opacity-100': isControlsVisible
              }
            )}
          >
            {customControls}
          </div>
        )}

        {/* 播放状态指示器 */}
        {playbackState === 'loading' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white">加载中...</div>
          </div>
        )}

        {playbackState === 'error' && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white">视频加载失败</div>
          </div>
        )}
      </div>
    )
  }
)

Video.displayName = 'Video'