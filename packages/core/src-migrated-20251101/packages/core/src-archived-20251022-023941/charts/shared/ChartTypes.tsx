import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../utils/cn'

export interface ChartData {
  name: string
  value: number
  color?: string
}

export interface ChartSeries {
  name: string
  data: ChartData[]
  color?: string
}

export interface ChartBaseProps {
  data?: ChartSeries[]
  width?: number
  height?: number
  margin?: {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }
  className?: string
  theme?: 'light' | 'dark'
}

export interface ChartTooltipProps {
  active?: boolean
  payload?: any[]
  label?: string
  content?: React.ReactNode
}

export interface ChartLegendProps {
  payload?: any[]
  verticalAlign?: 'top' | 'middle' | 'bottom'
  align?: 'left' | 'center' | 'right'
  layout?: 'horizontal' | 'vertical'
  iconSize?: number
  wrapperStyle?: React.CSSProperties
}

export type ChartVariant = 'default' | 'smooth' | 'stepped' | 'stacked' | 'grouped' | 'donut' | 'semi-circle'
export type ChartSize = 'sm' | 'md' | 'lg' | 'xl'

export const chartContainerVariants = cva(
  "w-full h-full flex items-center justify-center",
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl"
      },
      theme: {
        light: "text-gray-900",
        dark: "text-gray-100"
      }
    },
    defaultVariants: {
      size: "md",
      theme: "light"
    }
  }
)

export interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof chartContainerVariants> {
  children: React.ReactNode
  width?: number
  height?: number
  responsive?: boolean
}

export const ChartContainer = React.forwardRef<HTMLDivElement, ChartContainerProps>(
  ({ className, size, theme, children, width, height, responsive = true, style, ...props }, ref) => {
    const containerStyle: React.CSSProperties = {
      width: responsive ? '100%' : width,
      height: responsive ? '100%' : height,
      ...style
    }

    return (
      <div
        ref={ref}
        className={cn(chartContainerVariants({ size, theme, className }))}
        style={containerStyle}
        {...props}
      >
        {children}
      </div>
    )
  }
)

ChartContainer.displayName = "ChartContainer"