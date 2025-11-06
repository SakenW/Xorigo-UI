/**
 * @fileoverview 动画HOC模块统一导出
 * @description 提供所有动画相关高阶组件的统一导出点
 */

export { default as withAnimate, WithAnimate, withFadeIn, withSlideIn, withScale, withBounce, withSpin } from './withAnimate'
export type { AnimationConfig, AnimationContextValue, AnimationState } from './withAnimate'

export { default as withTransition, WithTransition, withSlideTransition, withFadeTransition, withScaleTransition } from './withTransition'
export type { TransitionConfig, TransitionContextValue, TransitionState } from './withTransition'

export { default as withGestures, WithGestures, withDragGestures, withSwipeGestures, withPinchGestures, withRotateGestures, withAllGestures } from './withGestures'
export type { GesturesConfig, GesturesContextValue, GesturesState } from './withGestures'

export { default as withPageTransition, WithPageTransition, withSlidePageTransition, withFadePageTransition, withScalePageTransition, withRotatePageTransition } from './withPageTransition'
export type { PageTransitionConfig, PageTransitionContextValue, PageState } from './withPageTransition'
