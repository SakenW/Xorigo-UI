import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../utils/cn'
import type { ChartTooltipProps } from './ChartTypes'

export const ChartTooltip: React.FC<ChartTooltipProps & { className?: string }> = ({
  active,
  payload,
  label,
  content,
  className
}) => {
  if (!active || !payload?.length) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -10 }}
        transition={{ duration: 0.15 }}
        className={cn(
          "absolute z-50 px-3 py-2 text-sm font-medium",
          "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
          "rounded-lg shadow-lg backdrop-blur-sm",
          "max-w-xs break-words",
          className
        )}
      >
        {content || (
          <div className="space-y-1">
            {label && (
              <p className="text-gray-900 dark:text-gray-100 font-medium mb-2">
                {label}
              </p>
            )}
            {payload.map((entry: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between space-x-2"
              >
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-gray-600 dark:text-gray-400">
                    {entry.name}
                  </span>
                </div>
                <span className="text-gray-900 dark:text-gray-100 font-medium">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

ChartTooltip.displayName = "ChartTooltip"