import { cn } from '@/src/lib/utils'

interface SkeletonProps {
  className?: string
  lines?: number
  height?: string
}

/**
 * 骨架屏组件
 * 用于内容加载时的占位显示
 */
export function Skeleton({ className = "", lines = 1, height = "h-4" }: SkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={cn(
            "animate-pulse bg-gray-200 dark:bg-gray-700 rounded",
            height,
            index === lines - 1 && lines > 1 ? "w-3/4" : "w-full"
          )}
        />
      ))}
    </div>
  )
}

/**
 * 卡片骨架屏
 */
export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton lines={2} />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>
  )
}

/**
 * 表格骨架屏
 */
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto">
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg">
        {/* 表头 */}
        <div className="border-b border-gray-200 dark:border-gray-700 p-4">
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-4" />
            ))}
          </div>
        </div>

        {/* 表格行 */}
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="border-b border-gray-200 dark:border-gray-700 p-4 last:border-b-0">
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, colIndex) => (
                <Skeleton key={colIndex} className="h-4" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}