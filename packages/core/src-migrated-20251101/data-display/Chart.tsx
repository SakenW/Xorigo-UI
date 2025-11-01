import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../utils/cn'

const chartVariants = cva(
  "w-full",
  {
    variants: {
      type: {
        line: "",
        bar: "",
        pie: "",
        area: "",
      },
      size: {
        sm: "h-32",
        md: "h-48",
        lg: "h-64",
        xl: "h-80",
        full: "h-full",
      },
    },
    defaultVariants: {
      type: "line",
      size: "md",
    },
  }
)

export interface ChartData {
  label: string
  value: number
  color?: string
}

export interface ChartProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chartVariants> {
  data: ChartData[]
  title?: string
  showLegend?: boolean
  showGrid?: boolean
  animated?: boolean
}

const Chart = React.forwardRef<HTMLDivElement, ChartProps>(
  ({
    className,
    type,
    size,
    data,
    title,
    showLegend = true,
    showGrid = true,
    animated = true,
    ...props
  }, ref) => {
    const maxValue = Math.max(...data.map(item => item.value))
    const colors = [
      '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
      '#06b6d4', '#ec4899', '#6366f1', '#14b8a6', '#f97316'
    ]

    const renderChart = () => {
      switch (type) {
        case 'bar':
          return (
            <div className="flex items-end justify-around h-full">
              {data.map((item, index) => {
                const height = (item.value / maxValue) * 100
                const color = item.color || colors[index % colors.length]

                return (
                  <div key={index} className="flex flex-col items-center flex-1 mx-1">
                    <div
                      className={cn(
                        "w-full rounded-t transition-all duration-300",
                        animated && "animate-pulse"
                      )}
                      style={{
                        height: `${height}%`,
                        backgroundColor: color,
                      }}
                    />
                    <span className="text-xs mt-2 text-center truncate w-full">
                      {item.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )

        case 'pie':
          return (
            <div className="flex items-center justify-center h-full">
              <div className="relative w-32 h-32">
                {data.map((item, index) => {
                  const percentage = (item.value / data.reduce((sum, d) => sum + d.value, 0)) * 100
                  const color = item.color || colors[index % colors.length]

                  return (
                    <div key={index} className="absolute inset-0">
                      <div
                        className="w-full h-full rounded-full"
                        style={{
                          backgroundColor: color,
                          transform: `rotate(${index * (360 / data.length)}deg)`,
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((index * (360 / data.length) - 90) * Math.PI / 180)}% ${50 + 50 * Math.sin((index * (360 / data.length) - 90) * Math.PI / 180)}%)`,
                        }}
                      />
                    </div>
                  )
                })}
              </div>
            </div>
          )

        case 'area':
          return (
            <div className="relative h-full">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                  </linearGradient>
                </defs>

                <path
                  d={`M 0,${200 - (data[0]?.value / maxValue) * 180} ${data.map((item, index) =>
                    `L ${(index / (data.length - 1)) * 400},${200 - (item.value / maxValue) * 180}`
                  ).join(' ')} L 400,200 L 0,200 Z`}
                  fill="url(#gradient)"
                />

                <path
                  d={`M 0,${200 - (data[0]?.value / maxValue) * 180} ${data.map((item, index) =>
                    `L ${(index / (data.length - 1)) * 400},${200 - (item.value / maxValue) * 180}`
                  ).join(' ')}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {data.map((item, index) => (
                  <circle
                    key={index}
                    cx={(index / (data.length - 1)) * 400}
                    cy={200 - (item.value / maxValue) * 180}
                    r="4"
                    fill="#3b82f6"
                  />
                ))}
              </svg>
            </div>
          )

        default: // line
          return (
            <div className="relative h-full">
              <svg className="w-full h-full" viewBox="0 0 400 200">
                {showGrid && (
                  <g className="text-gray-300">
                    {Array.from({ length: 5 }, (_, i) => (
                      <line
                        key={`h-${i}`}
                        x1="0"
                        y1={i * 50}
                        x2="400"
                        y2={i * 50}
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    ))}
                    {Array.from({ length: 8 }, (_, i) => (
                      <line
                        key={`v-${i}`}
                        x1={i * 57}
                        y1="0"
                        x2={i * 57}
                        y2="200"
                        stroke="#e5e7eb"
                        strokeWidth="1"
                      />
                    ))}
                  </g>
                )}

                <path
                  d={`M 0,${200 - (data[0]?.value / maxValue) * 180} ${data.map((item, index) =>
                    `L ${(index / (data.length - 1)) * 400},${200 - (item.value / maxValue) * 180}`
                  ).join(' ')}`}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                />

                {data.map((item, index) => (
                  <g key={index}>
                    <circle
                      cx={(index / (data.length - 1)) * 400}
                      cy={200 - (item.value / maxValue) * 180}
                      r="4"
                      fill="#3b82f6"
                    />
                    <text
                      x={(index / (data.length - 1)) * 400}
                      y="220"
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {item.label}
                    </text>
                    <text
                      x={(index / (data.length - 1)) * 400}
                      y={190 - (item.value / maxValue) * 180}
                      textAnchor="middle"
                      className="text-xs fill-gray-600"
                    >
                      {item.value}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )
      }
    }

    return (
      <div
        className={cn(chartVariants({ type, size, className }))}
        ref={ref}
        {...props}
      >
        {title && (
          <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
        )}

        <div className="relative">
          {renderChart()}
        </div>

        {showLegend && type === 'pie' && (
          <div className="flex flex-wrap justify-center mt-4 gap-4">
            {data.map((item, index) => {
              const color = item.color || colors[index % colors.length]
              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-600">{item.label}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }
)

Chart.displayName = "Chart"

export { Chart, chartVariants }