import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '../../utils/cn'
import type { ChartLegendProps } from './ChartTypes'

export const ChartLegend: React.FC<ChartLegendProps & { className?: string }> = ({
  payload,
  verticalAlign = 'bottom',
  align = 'center',
  layout = 'horizontal',
  iconSize = 14,
  wrapperStyle,
  className
}) => {
  if (!payload?.length) return null

  const alignmentClasses = {
    top: 'items-start pt-4',
    middle: 'items-center',
    bottom: 'items-end pb-4'
  }

  const justifyClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }

  const directionClasses = {
    horizontal: 'flex-row',
    vertical: 'flex-col'
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={cn(
        "flex w-full gap-4 flex-wrap",
        alignmentClasses[verticalAlign],
        justifyClasses[align],
        directionClasses[layout],
        className
      )}
      style={wrapperStyle}
    >
      {payload.map((entry: any, index: number) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: 0.1 * index }}
          className="flex items-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity"
        >
          <div
            className="rounded-sm flex-shrink-0"
            style={{
              width: iconSize,
              height: iconSize,
              backgroundColor: entry.color
            }}
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">
            {entry.value}
          </span>
        </motion.div>
      ))}
    </motion.div>
  )
}

ChartLegend.displayName = "ChartLegend"