import { cn } from '@/src/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  text?: string
}

/**
 * 加载动画组件
 * 提供不同尺寸和样式的加载动画
 */
export function LoadingSpinner({
  size = 'md',
  className = "",
  text
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="text-center">
        <div
          className={cn(
            "animate-spin rounded-full border-b-2 border-blue-600 mx-auto",
            sizeClasses[size]
          )}
        />
        {text && (
          <p className={cn("mt-4 text-gray-600 dark:text-gray-400", textSizeClasses[size])}>
            {text}
          </p>
        )}
      </div>
    </div>
  )
}