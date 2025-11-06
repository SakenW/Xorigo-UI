'use client'
import React, { forwardRef, useRef, useImperativeHandle, useState } from 'react'
import { motion, AnimatePresence, Variants, Transition as MotionTransition } from 'framer-motion'
import { cn } from '../utils'

// Transition type definitions
export type TransitionType =
  | 'fade'
  | 'slide'
  | 'scale'
  | 'flip'
  | 'rotate'
  | 'bounce'
  | 'spring'
  | 'tween'
  | 'keyframes'
  | 'custom'

export type TransitionDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'center'
  | 'top'
  | 'bottom'

export type TransitionEasing =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'circIn'
  | 'circOut'
  | 'circInOut'
  | 'backIn'
  | 'backOut'
  | 'backInOut'
  | 'anticipate'

export interface TransitionConfig {
  type?: TransitionType
  direction?: TransitionDirection
  duration?: number
  delay?: number
  easing?: TransitionEasing
  stiffness?: number
  damping?: number
  mass?: number
  scale?: number
  rotate?: number
  distance?: number
  opacity?: boolean
}

export interface TransitionProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Whether the transition should be visible
   */
  show?: boolean

  /**
   * Transition configuration
   */
  config?: TransitionConfig

  /**
   * Custom animation variants
   */
  variants?: Variants

  /**
   * Custom framer motion transition
   */
  transition?: MotionTransition

  /**
   * Whether to use AnimatePresence for enter/exit animations
   */
  animatePresence?: boolean

  /**
   * Element to render as
   */
  as?: keyof JSX.IntrinsicElements

  /**
   * Callback when animation starts
   */
  onAnimationStart?: () => void

  /**
   * Callback when animation completes
   */
  onAnimationComplete?: () => void

  /**
   * Whether to animate children
   */
  animateChildren?: boolean

  /**
   * Stagger delay for children animations
   */
  staggerDelay?: number

  /**
   * Children to render
   */
  children: React.ReactNode
}

export interface TransitionRef {
  /**
   * Play the enter animation
   */
  playEnter: () => void

  /**
   * Play the exit animation
   */
  playExit: () => void

  /**
   * Get the current animation state
   */
  getState: () => 'entering' | 'entered' | 'exiting' | 'exited'
}

// Default transition configurations
const defaultConfigs: Record<TransitionType, Partial<TransitionConfig>> = {
  fade: {
    opacity: true,
    duration: 0.3,
    easing: 'easeInOut'
  },
  slide: {
    opacity: true,
    duration: 0.4,
    easing: 'easeOut',
    distance: 20
  },
  scale: {
    scale: 0.8,
    duration: 0.3,
    easing: 'backOut'
  },
  flip: {
    rotate: 180,
    duration: 0.6,
    easing: 'easeInOut'
  },
  rotate: {
    rotate: 360,
    duration: 0.8,
    easing: 'easeInOut'
  },
  bounce: {
    type: 'spring',
    stiffness: 400,
    damping: 10
  },
  spring: {
    type: 'spring',
    stiffness: 100,
    damping: 15
  },
  tween: {
    duration: 0.5,
    easing: 'easeInOut'
  },
  keyframes: {
    duration: 1.2,
    easing: 'easeInOut'
  },
  custom: {
    duration: 0.4,
    easing: 'easeInOut'
  }
}

// Create default variants for different transition types
const createVariantsForType = (
  type: TransitionType,
  direction: TransitionDirection,
  config: TransitionConfig
): Variants => {
  const {
    scale = 0.8,
    rotate = 0,
    distance = 20,
    opacity = true
  } = config

  // Calculate offset based on direction
  const getOffset = () => {
    switch (direction) {
      case 'up':
      case 'top':
        return { y: distance }
      case 'down':
      case 'bottom':
        return { y: -distance }
      case 'left':
        return { x: distance }
      case 'right':
        return { x: -distance }
      case 'center':
        return { x: 0, y: 0 }
      default:
        return { x: 0, y: 0 }
    }
  }

  const offset = getOffset()

  const baseHidden = {
    opacity: opacity ? 0 : 1,
    ...offset
  }

  const baseVisible = {
    opacity: 1,
    x: 0,
    y: 0
  }

  switch (type) {
    case 'fade':
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
      }

    case 'slide':
      return {
        hidden: baseHidden,
        visible: baseVisible
      }

    case 'scale':
      return {
        hidden: { ...baseHidden, scale },
        visible: { ...baseVisible, scale: 1 }
      }

    case 'flip':
      return {
        hidden: { ...baseHidden, rotateY: rotate },
        visible: { ...baseVisible, rotateY: 0 }
      }

    case 'rotate':
      return {
        hidden: { ...baseHidden, rotate },
        visible: { ...baseVisible, rotate: 0 }
      }

    case 'bounce':
    case 'spring':
      return {
        hidden: { ...baseHidden, scale: 0.8 },
        visible: { ...baseVisible, scale: 1 }
      }

    case 'keyframes':
      return {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
          opacity: [0, 1, 1],
          scale: [0.8, 1.1, 1],
          transition: {
            duration: config.duration || 1.2,
            ease: config.easing || 'easeInOut'
          }
        }
      }

    default:
      return {
        hidden: baseHidden,
        visible: baseVisible
      }
  }
}

// Convert easing string to framer motion easing
const getEasing = (easing: TransitionEasing) => {
  switch (easing) {
    case 'linear':
      return [0, 0, 1, 1]
    case 'easeIn':
      return [0.4, 0, 1, 1]
    case 'easeOut':
      return [0, 0, 0.2, 1]
    case 'easeInOut':
      return [0.4, 0, 0.2, 1]
    case 'circIn':
      return [0.6, 0.04, 0.98, 0.34]
    case 'circOut':
      return [0.08, 0.82, 0.17, 1]
    case 'circInOut':
      return [0.85, 0, 0.15, 1]
    case 'backIn':
      return [0.6, -0.28, 0.735, 0.045]
    case 'backOut':
      return [0.175, 0.885, 0.32, 1.275]
    case 'backInOut':
      return [0.68, -0.55, 0.265, 1.55]
    case 'anticipate':
      return [0, 0, 0.2, 1]
    default:
      return [0.4, 0, 0.2, 1]
  }
}

const Transition = forwardRef<TransitionRef, TransitionProps>(({
  show = true,
  config = {},
  variants,
  transition,
  animatePresence = true,
  as: Component = 'div',
  onAnimationStart,
  onAnimationComplete,
  animateChildren = false,
  staggerDelay = 0.1,
  className,
  children,
  ...props
}, ref) => {
  const animationRef = useRef<HTMLDivElement>(null)
  const [animationState, setAnimationState] = useState<'entering' | 'entered' | 'exiting' | 'exited'>('exited')

  // Merge default config with provided config
  const transitionConfig: TransitionConfig = {
    type: config.type || 'fade',
    direction: config.direction || 'center',
    duration: config.duration || 0.3,
    delay: config.delay || 0,
    easing: config.easing || 'easeInOut',
    ...config
  }

  // Get default configuration for transition type
  const defaultConfig = defaultConfigs[transitionConfig.type] || {}
  const finalConfig = { ...defaultConfig, ...transitionConfig }

  // Create variants if not provided
  const defaultVariants = variants || createVariantsForType(
    finalConfig.type!,
    finalConfig.direction!,
    finalConfig
  )

  // Create transition configuration
  const motionTransition: MotionTransition = transition || (() => {
    if (finalConfig.type === 'spring' || finalConfig.type === 'bounce') {
      return {
        type: 'spring',
        stiffness: finalConfig.stiffness || (finalConfig.type === 'bounce' ? 400 : 100),
        damping: finalConfig.damping || (finalConfig.type === 'bounce' ? 10 : 15),
        mass: finalConfig.mass || 1,
        delay: finalConfig.delay
      }
    }

    return {
      duration: finalConfig.duration,
      delay: finalConfig.delay,
      ease: getEasing(finalConfig.easing!)
    }
  })()

  // Create children variants if animateChildren is enabled
  const childrenVariants = animateChildren ? {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        staggerChildren: staggerDelay
      }
    }
  } : undefined

  // Imperative methods
  useImperativeHandle(ref, () => ({
    playEnter: () => {
      setAnimationState('entering')
      onAnimationStart?.()
    },
    playExit: () => {
      setAnimationState('exiting')
    },
    getState: () => animationState
  }), [animationState, onAnimationStart])

  const handleAnimationStart = () => {
    setAnimationState(show ? 'entering' : 'exiting')
    onAnimationStart?.()
  }

  const handleAnimationComplete = () => {
    setAnimationState(show ? 'entered' : 'exited')
    onAnimationComplete?.()
  }

  const MotionComponent = motion[Component as keyof typeof motion] as any

  const content = (
    <MotionComponent
      ref={animationRef}
      className={cn(
        // Base styles
        'transition-all duration-200',
        // Custom className
        className
      )}
      variants={childrenVariants || defaultVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={motionTransition}
      onAnimationStart={handleAnimationStart}
      onAnimationComplete={handleAnimationComplete}
      {...props}
    >
      {animateChildren ? (
        <motion.div
          variants={
            animateChildren
              ? {
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: staggerDelay
                    }
                  }
                }
              : undefined
          }
        >
          {React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) return child

            return (
              <motion.div
                key={index}
                variants={
                  animateChildren
                    ? {
                        hidden: { opacity: 0, y: 20 },
                        visible: { opacity: 1, y: 0 }
                      }
                    : undefined
                }
              >
                {child}
              </motion.div>
            )
          })}
        </motion.div>
      ) : (
        children
      )}
    </MotionComponent>
  )

  if (animatePresence) {
    return (
      <AnimatePresence
        mode="wait"
        onExitComplete={() => setAnimationState('exited')}
      >
        {show && content}
      </AnimatePresence>
    )
  }

  return show ? content : null
})

Transition.displayName = 'Transition'

export default Transition

// Preset transition configurations
export const transitionPresets = {
  // Fade transitions
  fadeIn: { type: 'fade' as const, duration: 0.3 },
  fadeInSlow: { type: 'fade' as const, duration: 0.6 },

  // Slide transitions
  slideUp: { type: 'slide' as const, direction: 'up' as const },
  slideDown: { type: 'slide' as const, direction: 'down' as const },
  slideLeft: { type: 'slide' as const, direction: 'left' as const },
  slideRight: { type: 'slide' as const, direction: 'right' as const },

  // Scale transitions
  scaleIn: { type: 'scale' as const, scale: 0.8 },
  scaleOut: { type: 'scale' as const, scale: 1.2 },

  // Bounce transitions
  bounceIn: { type: 'bounce' as const },
  springIn: { type: 'spring' as const, stiffness: 200, damping: 20 },

  // Complex transitions
  flipIn: { type: 'flip' as const, rotate: 180 },
  rotateIn: { type: 'rotate' as const, rotate: 360 },

  // Keyframe transitions
  dramatic: { type: 'keyframes' as const, duration: 1.5 }
} as const

// Helper function to create custom transitions
export const createTransition = (config: TransitionConfig): TransitionConfig => ({
  ...defaultConfigs.fade,
  ...config
})