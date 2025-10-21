'use client'

import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { motion, AnimatePresence } from 'framer-motion'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { cn } from '../utils/cn'
import { forwardRef } from 'react'

export const ToastProvider = ToastPrimitive.Provider

export const ToastViewport = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Viewport
    ref={ref}
    className={cn(
      'fixed top-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]',
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitive.Viewport.displayName

const toastVariants = {
  default: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700',
  success: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700',
  error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700',
  warning: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700',
  info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700',
}

const Toast = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Root> & {
    variant?: 'default' | 'success' | 'error' | 'warning' | 'info'
    description?: string
  }
>(({ className, variant = 'default', description, ...props }, ref) => {
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      default:
        return null
    }
  }

  return (
    <ToastPrimitive.Root
      ref={ref}
      className={cn(
        'group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all',
        'data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-(--radix-toast-swipe-end-x) data-[swipe=move]:translate-x-(--radix-toast-swipe-move-x) data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full',
        toastVariants[variant],
        className
      )}
      {...props}
    >
      <div className="grid gap-1">
        <AnimatePresence>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2"
          >
            {getIcon()}
            <ToastPrimitive.Title className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {props.title}
            </ToastPrimitive.Title>
          </motion.div>
        </AnimatePresence>
        {description && (
          <ToastPrimitive.Description className={cn(
            'text-sm opacity-90',
            variant === 'default'
              ? 'text-gray-600 dark:text-gray-400'
              : 'text-gray-700 dark:text-gray-300'
          )}>
            {description}
          </ToastPrimitive.Description>
        )}
      </div>
      <ToastPrimitive.Close
        className={cn(
          'absolute right-2 top-2 rounded-md p-1 text-gray-500 dark:text-gray-400',
          'opacity-0 transition-opacity group-hover:opacity-100',
          'hover:text-gray-900 dark:hover:text-gray-100',
          'focus:opacity-100 focus:outline-hidden focus:ring-2 group-hover:ring-2',
          variant === 'default'
            ? 'ring-gray-300 dark:ring-gray-600'
            : 'ring-gray-200 dark:ring-gray-700'
        )}
        toast-close=""
      >
        <X className="h-4 w-4" />
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  )
})
Toast.displayName = ToastPrimitive.Root.displayName

export const ToastAction = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Action
    ref={ref}
    className={cn(
      'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors',
      'hover:bg-secondary focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive',
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitive.Action.displayName

export const ToastClose = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Close
    ref={ref}
    className={cn(
      'absolute right-2 top-2 rounded-md p-1 text-foreground/50 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-hidden focus:ring-2 group-hover:opacity-100 group-[.destructive]:text-red-300 hover:group-[.destructive]:text-red-50 focus:group-[.destructive]:ring-red-400 focus:group-[.destructive]:ring-offset-red-600',
      className
    )}
    toast-close=""
    {...props}
  />
))
ToastClose.displayName = ToastPrimitive.Close.displayName

export const ToastTitle = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Title
    ref={ref}
    className={cn('text-sm font-semibold', className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitive.Title.displayName

export const ToastDescription = forwardRef<
  React.ElementRef<typeof ToastPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitive.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitive.Description
    ref={ref}
    className={cn('text-sm opacity-90', className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitive.Description.displayName

// Hook for managing toasts
import { useState, useCallback } from 'react'

type ToastType = 'default' | 'success' | 'error' | 'warning' | 'info'

interface ToastMessage {
  id: string
  title: string
  description?: string
  variant?: ToastType
  duration?: number
}

export const useToast = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const toast = useCallback(
    ({
      title,
      description,
      variant = 'default',
      duration = 5000,
    }: Omit<ToastMessage, 'id'>) => {
      const id = Math.random().toString(36).substr(2, 9)

      setToasts(prev => [...prev, { id, title, description, variant }])

      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, duration)
    },
    []
  )

  const dismiss = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return {
    toast,
    dismiss,
    toasts,
  }
}

// 复合组件接口
interface ToastComponent extends React.FC<React.ComponentPropsWithoutRef<typeof Toast>> {
  Provider: typeof ToastProvider
  Viewport: typeof ToastViewport
  Action: typeof ToastAction
  Close: typeof ToastClose
  Title: typeof ToastTitle
  Description: typeof ToastDescription
}

const ToastComponent = Toast as unknown as ToastComponent
ToastComponent.Provider = ToastProvider
ToastComponent.Viewport = ToastViewport
ToastComponent.Action = ToastAction
ToastComponent.Close = ToastClose
ToastComponent.Title = ToastTitle
ToastComponent.Description = ToastDescription

export { ToastComponent as Toast }
export default Toast
